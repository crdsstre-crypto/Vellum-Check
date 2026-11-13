// ลิงก์แชร์ผลตรวจแบบอ่านอย่างเดียว (หมดอายุใน 7 วัน)
// - เก็บเฉพาะ "ผลตรวจ" ที่คัดฟิลด์แล้ว ไม่เก็บข้อความสัญญาเต็ม
// - ปิดบังข้อมูลส่วนตัว (เลขบัตร เบอร์โทร อีเมล เลขบัญชี ชื่อหลังคำนำหน้า เลขที่บ้าน) ก่อนบันทึก
// - เจ้าของลิงก์ยกเลิกลิงก์ได้ทุกเมื่อ

import crypto from 'node:crypto';
import { pool } from './db.js';

export const SHARE_DAYS = 7;
const MAX_ITEMS = 30;
const MAX_STR = 1500;

let ready = null;
function ensureTable() {
  if (!ready) {
    ready = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS shares (
          id         TEXT PRIMARY KEY,
          user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          payload    JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires_at TIMESTAMPTZ NOT NULL,
          views      INTEGER NOT NULL DEFAULT 0
        )`);
      await pool.query('CREATE INDEX IF NOT EXISTS shares_user_idx ON shares (user_id, created_at)');
    })().catch(err => { ready = null; throw err; });
  }
  return ready;
}

/* ---------- ปิดบังข้อมูลส่วนตัว ---------- */
const MASK = '•••';
export function maskText(s) {
  return String(s || '')
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, MASK + '@' + MASK)                                   // อีเมล
    .replace(/\b\d[\d -]{11,16}\d\b/g, m => (m.replace(/\D/g, '').length >= 10 ? MASK : m))         // เลขบัตร/บัญชียาว ๆ
    .replace(/\b0\d{1,2}[- ]?\d{3}[- ]?\d{3,4}\b/g, MASK)                                          // เบอร์โทร
    .replace(/\b\d{3}-?\d-?\d{5}-?\d\b/g, MASK)                                                   // เลขบัญชีธนาคาร 10 หลัก
    .replace(/(นางสาว|นาย|นาง|น\.ส\.|ด\.ช\.|ด\.ญ\.)\s*[ก-๙]{2,}(\s+[ก-๙]{2,})?/g, '$1 ' + MASK)     // ชื่อหลังคำนำหน้า
    .replace(/(บ้านเลขที่|เลขที่)\s*[\d/]+/g, '$1 ' + MASK);                                       // เลขที่บ้าน
}
function str(v, keepQuote) {
  if (typeof v !== 'string') return '';
  const t = v.slice(0, MAX_STR);
  return keepQuote === false ? '' : maskText(t);
}

/* คัดเฉพาะฟิลด์ที่หน้าแชร์ต้องใช้ */
export function cleanPayload(result, opts = {}) {
  if (!result || typeof result !== 'object' || !Array.isArray(result.items)) return null;
  const withQuotes = opts.quotes !== false;
  const LV = new Set(['check_detail', 'caution', 'low']);
  const items = result.items.slice(0, MAX_ITEMS).map(it => ({
    level: LV.has(it?.level) ? it.level : 'low',
    title: str(it?.title),
    topic: str(it?.topic),
    explanation: str(it?.explanation),
    quote: it?.missing ? '' : str(it?.quote, withQuotes),
    suggested_fix: str(it?.suggested_fix),
    how_to_negotiate: str(it?.how_to_negotiate),
    missing: !!it?.missing,
  })).filter(it => it.title);
  const missing = Array.isArray(result.missing_info)
    ? result.missing_info.slice(0, 20).map(x => str(typeof x === 'string' ? x : (x?.item || x?.title || ''))).filter(Boolean)
    : [];
  const counts = {
    check_detail: items.filter(i => i.level === 'check_detail').length,
    caution: items.filter(i => i.level === 'caution').length,
    low: items.filter(i => i.level === 'low').length,
  };
  return {
    v: 1,
    typeText: str(opts.typeText).slice(0, 60),
    title: str(opts.title).slice(0, 80),
    items, missing,
    counts,
    quotes: withQuotes,
  };
}

function newId() { return crypto.randomBytes(9).toString('base64url'); }

export async function createShare(userId, payload) {
  await ensureTable();
  const id = newId();
  const { rows } = await pool.query(
    `INSERT INTO shares (id, user_id, payload, expires_at)
     VALUES ($1, $2, $3, now() + ($4 || ' days')::interval) RETURNING expires_at`,
    [id, userId, JSON.stringify(payload), String(SHARE_DAYS)]
  );
  // เก็บกวาดลิงก์ที่หมดอายุ (เบา ๆ ทุกครั้งที่สร้างใหม่)
  pool.query('DELETE FROM shares WHERE expires_at < now() - interval \'1 day\'').catch(() => {});
  return { id, expiresAt: rows[0].expires_at };
}

export async function getShare(id) {
  if (!/^[A-Za-z0-9_-]{8,24}$/.test(String(id || ''))) return null;
  await ensureTable();
  const { rows } = await pool.query(
    `UPDATE shares SET views = views + 1 WHERE id = $1 RETURNING payload, created_at, expires_at, expires_at < now() AS expired`,
    [id]
  );
  if (!rows[0]) return null;
  return { payload: rows[0].payload, createdAt: rows[0].created_at, expiresAt: rows[0].expires_at, expired: rows[0].expired };
}

export async function deleteShare(userId, id) {
  await ensureTable();
  const { rowCount } = await pool.query('DELETE FROM shares WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount;
}
