// เช็กอินรายวัน + แต้มสะสมแลกเครดิตตรวจ
// - วันเปลี่ยนตามเวลาไทย (Asia/Bangkok) ตัดสินที่เซิร์ฟเวอร์เท่านั้น
// - รอบละ 7 วัน: 10, 15, 20, 25, 30, 40, 60 แต้ม (รวม 200/สัปดาห์) · ขาดวันไหน streak เริ่มใหม่ แต่แต้มที่สะสมไม่หาย
// - 300 แต้ม = เครดิตตรวจ 1 ครั้ง · แลกได้ไม่เกิน REDEEM_PER_MONTH ครั้งต่อเดือน (คุมต้นทุน AI)
// - สร้างตารางเองตอนใช้งานครั้งแรก ไม่ต้องแก้ db.js

import { pool } from './db.js';

export const REWARDS = [10, 15, 20, 25, 30, 40, 60];
export const REDEEM_COST = 300;
export const REDEEM_PER_MONTH = 2;
const TZ = 'Asia/Bangkok';

let ready = null;
function ensureTables() {
  if (!ready) {
    ready = (async () => {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0)`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS checkins (
          user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          day        DATE NOT NULL,
          streak     INTEGER NOT NULL,
          points     INTEGER NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, day)
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS point_redeems (
          id         SERIAL PRIMARY KEY,
          user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          points     INTEGER NOT NULL,
          credits    INTEGER NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await pool.query(`CREATE INDEX IF NOT EXISTS point_redeems_user_idx ON point_redeems (user_id, created_at)`);
    })().catch(err => { ready = null; throw err; });
  }
  return ready;
}

const rewardFor = streak => REWARDS[(streak - 1) % REWARDS.length];

// สถานะปัจจุบันของบัญชี (ใช้ทั้งตอนเปิดหน้าและหลังเช็กอิน/แลก)
async function state(db, userId) {
  const { rows: [t] } = await db.query(`SELECT to_char((now() AT TIME ZONE '${TZ}')::date, 'YYYY-MM-DD') AS today`);
  const today = t.today;
  const { rows: last } = await db.query(
    `SELECT to_char(day, 'YYYY-MM-DD') AS day, streak, day = $2::date AS is_today, day = ($2::date - 1) AS is_yesterday
       FROM checkins WHERE user_id = $1 ORDER BY day DESC LIMIT 1`,
    [userId, today]
  );
  const { rows: [u] } = await db.query('SELECT points, credits FROM users WHERE id = $1', [userId]);
  const { rows: [m] } = await db.query(
    `SELECT count(*)::int AS n FROM point_redeems
      WHERE user_id = $1 AND date_trunc('month', created_at AT TIME ZONE '${TZ}') = date_trunc('month', now() AT TIME ZONE '${TZ}')`,
    [userId]
  );
  const { rows: [tot] } = await db.query('SELECT count(*)::int AS days FROM checkins WHERE user_id = $1', [userId]);
  const l = last[0];
  const checkedToday = !!(l && l.is_today);
  // streak ที่ยังนับต่อได้: เช็กอินวันนี้แล้ว หรือเมื่อวาน (ยังไม่ขาด)
  const streak = l && (l.is_today || l.is_yesterday) ? l.streak : 0;
  // ตำแหน่งในรอบ 7 วัน: ช่องที่ทำแล้ว = done
  const doneInCycle = streak === 0 ? 0 : ((streak - 1) % 7) + 1;
  const cycleDone = checkedToday ? doneInCycle : (streak === 0 ? 0 : doneInCycle % 7);
  const week = REWARDS.map((r, i) => ({ day: i + 1, reward: r, done: i < cycleDone, today: !checkedToday && i === cycleDone }));
  return {
    today,
    checkedToday,
    streak,
    totalDays: tot.days,
    points: u?.points ?? 0,
    credits: u?.credits ?? 0,
    todayReward: checkedToday ? null : rewardFor(streak + 1),
    tomorrowReward: checkedToday ? rewardFor(streak + 1) : null,
    week,
    redeem: { cost: REDEEM_COST, perMonth: REDEEM_PER_MONTH, usedThisMonth: m.n, canRedeem: (u?.points ?? 0) >= REDEEM_COST && m.n < REDEEM_PER_MONTH },
  };
}

export async function getDaily(userId) {
  await ensureTables();
  return state(pool, userId);
}

// เช็กอินวันนี้ (กดซ้ำได้ ไม่ได้แต้มซ้ำ) คืน { gained, ...state }
export async function checkIn(userId) {
  await ensureTables();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [userId]);
    const { rows: [t] } = await client.query(`SELECT to_char((now() AT TIME ZONE '${TZ}')::date, 'YYYY-MM-DD') AS today`);
    const { rows: prev } = await client.query(
      'SELECT streak FROM checkins WHERE user_id = $1 AND day = $2::date - 1', [userId, t.today]
    );
    const streak = prev[0] ? prev[0].streak + 1 : 1;
    const pts = rewardFor(streak);
    const ins = await client.query(
      'INSERT INTO checkins (user_id, day, streak, points) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, day) DO NOTHING',
      [userId, t.today, streak, pts]
    );
    let gained = 0;
    if (ins.rowCount === 1) {
      await client.query('UPDATE users SET points = points + $2 WHERE id = $1', [userId, pts]);
      gained = pts;
    }
    await client.query('COMMIT');
    return { gained, bonus: gained && streak % 7 === 0, ...(await state(pool, userId)) };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// แลกแต้มเป็นเครดิตตรวจ 1 ครั้ง คืน { ok, error?, ...state }
export async function redeem(userId) {
  await ensureTables();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [u] } = await client.query('SELECT points FROM users WHERE id = $1 FOR UPDATE', [userId]);
    const { rows: [m] } = await client.query(
      `SELECT count(*)::int AS n FROM point_redeems
        WHERE user_id = $1 AND date_trunc('month', created_at AT TIME ZONE '${TZ}') = date_trunc('month', now() AT TIME ZONE '${TZ}')`,
      [userId]
    );
    if (!u || u.points < REDEEM_COST) { await client.query('ROLLBACK'); return { ok: false, error: `ต้องมีอย่างน้อย ${REDEEM_COST} แต้ม` }; }
    if (m.n >= REDEEM_PER_MONTH) { await client.query('ROLLBACK'); return { ok: false, error: `เดือนนี้แลกครบ ${REDEEM_PER_MONTH} ครั้งแล้ว เดือนหน้าแลกได้อีกครับ` }; }
    await client.query('UPDATE users SET points = points - $2, credits = credits + 1 WHERE id = $1', [userId, REDEEM_COST]);
    await client.query('INSERT INTO point_redeems (user_id, points, credits) VALUES ($1, $2, 1)', [userId, REDEEM_COST]);
    await client.query('COMMIT');
    return { ok: true, ...(await state(pool, userId)) };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
