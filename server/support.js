// ช่องทางแจ้งปัญหา / ขอคืนเครดิต — ให้ลูกค้ามีทางออกที่ง่ายกว่าการฟ้อง
// สัญญาบริการ: ตอบภายใน RESPONSE_DAYS วัน · เก็บข้อความไม่เกิน 1,000 ตัวอักษร (ไม่รับเนื้อหาสัญญา)

import { pool } from './db.js';
import { REF_RE } from './receipt.js';

export const RESPONSE_DAYS = 7;
export const CATEGORIES = {
  wrong: 'ผลตรวจผิด/ไม่ครบ',
  bug: 'ระบบมีปัญหา',
  refund: 'ขอคืนเครดิต',
  privacy: 'ข้อมูลส่วนตัว (PDPA)',
  other: 'อื่น ๆ',
};
const MSG_MAX = 1000;

let ready = null;
function ensure() {
  if (!ready) {
    ready = pool.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER,
        email       TEXT,
        category    TEXT NOT NULL,
        message     TEXT NOT NULL,
        ref         TEXT,
        status      TEXT NOT NULL DEFAULT 'open',
        admin_note  TEXT,
        refunded    INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        resolved_at TIMESTAMPTZ
      )`).then(() => pool.query('CREATE INDEX IF NOT EXISTS support_status_idx ON support_tickets (status, created_at)'))
      .catch(e => { ready = null; throw e; });
  }
  return ready;
}

// ปิดบังเลขบัตร/เลขบัญชี/เบอร์โทรที่ผู้ใช้อาจพิมพ์มาโดยไม่ตั้งใจ
export function scrub(s) {
  return String(s || '')
    .replace(/\b\d[\d\s-]{11,}\d\b/g, m => m.replace(/\d/g, '•'))
    .replace(/\s+/g, ' ').trim().slice(0, MSG_MAX);
}

export async function createTicket(user, { category, message, ref }) {
  const cat = Object.hasOwn(CATEGORIES, category) ? category : 'other';
  const msg = scrub(message);
  if (msg.length < 5) return { error: 'เล่าปัญหาสั้น ๆ อย่างน้อย 5 ตัวอักษร' };
  const r = REF_RE.test(String(ref || '').toUpperCase()) ? String(ref).toUpperCase() : null;
  await ensure();
  const { rows: open } = await pool.query(
    `SELECT count(*)::int AS n FROM support_tickets WHERE user_id = $1 AND status = 'open'`, [user.id]);
  if (open[0].n >= 5) return { error: 'มีเรื่องที่รอตอบอยู่ 5 เรื่องแล้ว ทีมงานจะตอบกลับทางอีเมลโดยเร็ว', status: 429 };
  const { rows } = await pool.query(
    `INSERT INTO support_tickets (user_id, email, category, message, ref) VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at`, [user.id, user.email || null, cat, msg, r]);
  console.log(`[support] #${rows[0].id} ${cat} จาก ${user.email || user.id}${r ? ' ref ' + r : ''}`);
  return { ok: true, id: rows[0].id, createdAt: rows[0].created_at, responseDays: RESPONSE_DAYS };
}

export async function myTickets(userId) {
  await ensure();
  const { rows } = await pool.query(
    `SELECT id, category, message, ref, status, admin_note, refunded, created_at, resolved_at
       FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`, [userId]);
  return rows;
}

export async function listTickets(status = 'open') {
  await ensure();
  const st = status === 'resolved' ? 'resolved' : status === 'all' ? null : 'open';
  const { rows } = await pool.query(
    `SELECT t.*, (now() - t.created_at) > interval '${RESPONSE_DAYS - 2} days' AS late
       FROM support_tickets t ${st ? 'WHERE status = $1' : ''}
      ORDER BY created_at ${st === 'open' ? 'ASC' : 'DESC'} LIMIT 200`, st ? [st] : []);
  return rows;
}

// ปิดเรื่อง (คืนเครดิตได้ในขั้นตอนเดียว ไม่เกิน 20 ต่อเรื่อง)
export async function resolveTicket(id, { note, refund }) {
  await ensure();
  const n = Math.max(0, Math.min(20, Number(refund) | 0));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM support_tickets WHERE id = $1 FOR UPDATE`, [id]);
    const t = rows[0];
    if (!t) { await client.query('ROLLBACK'); return { error: 'ไม่พบเรื่องนี้', status: 404 }; }
    if (t.status === 'resolved') { await client.query('ROLLBACK'); return { error: 'เรื่องนี้ปิดไปแล้ว', status: 409 }; }
    if (n && t.user_id) await client.query('UPDATE users SET credits = credits + $2 WHERE id = $1', [t.user_id, n]);
    await client.query(
      `UPDATE support_tickets SET status = 'resolved', admin_note = $2, refunded = $3, resolved_at = now() WHERE id = $1`,
      [id, String(note || '').trim().slice(0, 500) || null, n]);
    await client.query('COMMIT');
    return { ok: true, refunded: n };
  } catch (e) { await client.query('ROLLBACK').catch(() => {}); throw e; }
  finally { client.release(); }
}
