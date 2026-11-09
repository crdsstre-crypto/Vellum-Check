// สถิติสำหรับแอดมิน + ความเห็นต่อผลตรวจ
// ตัวเลขทั้งหมดนับจากฐานข้อมูลจริง ไม่เก็บเนื้อหาสัญญา

import { pool } from './db.js';

export const FEEDBACK_REASONS = {
  up: ['เข้าใจง่าย', 'เจอจุดที่ไม่เคยสังเกต', 'ได้คำแนะนำไปคุยต่อ', 'ประหยัดเวลา'],
  down: ['ชี้ข้อผิด', 'ขาดประเด็นสำคัญ', 'อธิบายไม่เข้าใจ', 'คำแนะนำใช้จริงไม่ได้', 'ช้าเกินไป'],
};
const NOTE_MAX = 300;

// บันทึกการตรวจหนึ่งครั้ง (ไม่มีเนื้อหา) — ล้มเหลวได้โดยไม่กระทบผู้ใช้
export async function logCheck(userId, contractType, nItems) {
  await pool.query('INSERT INTO check_log (user_id, contract_type, n_items) VALUES ($1, $2, $3)', [userId, contractType, nItems | 0]);
}

// บันทึก/แก้ความเห็น — หนึ่งความเห็นต่อผลตรวจหนึ่งรายการ (ส่งซ้ำ = แก้ของเดิม)
export async function saveFeedback(userId, { inspectionId, rating, reasons, note }) {
  const r = rating === 1 ? 1 : rating === -1 ? -1 : 0;
  if (!r) return { error: 'คะแนนไม่ถูกต้อง' };
  const allowed = new Set(r === 1 ? FEEDBACK_REASONS.up : FEEDBACK_REASONS.down);
  const rs = Array.isArray(reasons) ? [...new Set(reasons.filter(x => typeof x === 'string' && allowed.has(x)))].slice(0, 5) : [];
  const n = typeof note === 'string' ? note.replace(/\s+/g, ' ').trim().slice(0, NOTE_MAX) : '';

  let insp = null, type = 'unsure';
  if (Number.isInteger(inspectionId) && inspectionId > 0) {
    const { rows } = await pool.query('SELECT id, contract_type FROM inspections WHERE id = $1 AND user_id = $2', [inspectionId, userId]);
    if (!rows[0]) return { error: 'ไม่พบผลตรวจนี้', status: 404 };
    insp = rows[0].id; type = rows[0].contract_type;
  }
  if (insp) {
    await pool.query(
      `INSERT INTO feedback (user_id, inspection_id, rating, reasons, note, contract_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, inspection_id) WHERE inspection_id IS NOT NULL
       DO UPDATE SET rating = EXCLUDED.rating, reasons = EXCLUDED.reasons, note = EXCLUDED.note, updated_at = now()`,
      [userId, insp, r, rs, n || null, type]
    );
  } else {
    await pool.query('INSERT INTO feedback (user_id, rating, reasons, note, contract_type) VALUES ($1, $2, $3, $4, $5)', [userId, r, rs, n || null, type]);
  }
  return { ok: true };
}

// สถิติย้อนหลัง N วัน (เวลาไทย) — รายวัน + ยอดรวม + ความเห็นล่าสุด
export async function adminStats(days = 30) {
  const d = Math.min(90, Math.max(7, days | 0));
  const TZ = 'Asia/Bangkok';
  const { rows: daily } = await pool.query(
    `WITH days AS (
       SELECT generate_series((now() AT TIME ZONE $2)::date - ($1::int - 1), (now() AT TIME ZONE $2)::date, '1 day')::date AS day
     )
     SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
       (SELECT count(*) FROM users u WHERE (u.created_at AT TIME ZONE $2)::date = days.day) AS signups,
       (SELECT count(*) FROM check_log c WHERE (c.created_at AT TIME ZONE $2)::date = days.day) AS checks,
       (SELECT count(*) FROM payments p WHERE p.status = 'credited' AND (p.credited_at AT TIME ZONE $2)::date = days.day) AS paid,
       (SELECT coalesce(sum(amount_satang), 0) FROM payments p WHERE p.status = 'credited' AND (p.credited_at AT TIME ZONE $2)::date = days.day) AS revenue_satang
     FROM days ORDER BY days.day`,
    [d, TZ]
  );
  const since = `now() - interval '${d} days'`;
  const one = async (sql, args = []) => (await pool.query(sql, args)).rows[0];
  const t = await one(
    `SELECT
       (SELECT count(*) FROM users) AS users_total,
       (SELECT count(*) FROM users WHERE created_at >= ${since}) AS signups,
       (SELECT count(*) FROM check_log WHERE created_at >= ${since}) AS checks,
       (SELECT count(DISTINCT user_id) FROM check_log WHERE created_at >= ${since}) AS checkers,
       (SELECT count(*) FROM (SELECT user_id FROM check_log WHERE created_at >= ${since} AND user_id IS NOT NULL GROUP BY user_id HAVING count(*) >= 2) x) AS repeat_users,
       (SELECT count(*) FROM payments WHERE status = 'credited' AND credited_at >= ${since}) AS paid_orders,
       (SELECT count(DISTINCT user_id) FROM payments WHERE status = 'credited' AND credited_at >= ${since}) AS payers,
       (SELECT coalesce(sum(amount_satang), 0) FROM payments WHERE status = 'credited' AND credited_at >= ${since}) AS revenue_satang,
       (SELECT count(DISTINCT user_id) FROM payments WHERE status = 'credited') AS payers_all,
       (SELECT count(*) FROM feedback WHERE created_at >= ${since} AND rating = 1) AS fb_up,
       (SELECT count(*) FROM feedback WHERE created_at >= ${since} AND rating = -1) AS fb_down`
  );
  const { rows: reasons } = await pool.query(
    `SELECT rating, reason, count(*) AS n FROM feedback, unnest(reasons) AS reason
      WHERE created_at >= ${since} GROUP BY rating, reason ORDER BY n DESC LIMIT 20`
  );
  const { rows: recent } = await pool.query(
    `SELECT rating, reasons, note, contract_type, created_at FROM feedback
      WHERE created_at >= ${since} ORDER BY created_at DESC LIMIT 20`
  );
  const { rows: packs } = await pool.query(
    `SELECT package_id, count(*) AS n, coalesce(sum(amount_satang), 0) AS satang FROM payments
      WHERE status = 'credited' AND credited_at >= ${since} GROUP BY package_id ORDER BY n DESC`
  );
  const N = v => Number(v) || 0;
  return {
    days: d,
    totals: {
      usersTotal: N(t.users_total), signups: N(t.signups), checks: N(t.checks), checkers: N(t.checkers),
      repeatUsers: N(t.repeat_users), paidOrders: N(t.paid_orders), payers: N(t.payers), payersAll: N(t.payers_all),
      revenueBaht: Math.round(N(t.revenue_satang) / 100), feedbackUp: N(t.fb_up), feedbackDown: N(t.fb_down),
    },
    daily: daily.map(r => ({ day: r.day, signups: N(r.signups), checks: N(r.checks), paid: N(r.paid), revenueBaht: Math.round(N(r.revenue_satang) / 100) })),
    packages: packs.map(r => ({ id: r.package_id, n: N(r.n), baht: Math.round(N(r.satang) / 100) })),
    reasons: reasons.map(r => ({ rating: N(r.rating), reason: r.reason, n: N(r.n) })),
    recent: recent.map(r => ({ rating: N(r.rating), reasons: r.reasons || [], note: r.note || '', type: r.contract_type, at: r.created_at })),
  };
}
