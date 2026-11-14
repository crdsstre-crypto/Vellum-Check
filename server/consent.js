// บันทึกการยอมรับข้อกำหนดการใช้บริการ (หลักฐานว่าผู้ใช้รับทราบว่าเป็นการคัดกรองเบื้องต้นด้วย AI ไม่ใช่คำปรึกษาทางกฎหมาย)
// - เก็บ user_id, ฉบับข้อกำหนด, ช่องทาง (check/signup), เวลา และ user-agent แบบย่อ
// - ไม่เก็บ IP เต็ม (เก็บเฉพาะค่าแฮช เพื่อใช้ยืนยันกรณีมีข้อโต้แย้งโดยไม่ระบุตัวบุคคลโดยตรง)
// - ★ เมื่อแก้ข้อกำหนดในสาระสำคัญ ให้เปลี่ยน TERMS_VERSION ที่นี่ และ VERSION/OKV ใน public/art.js และ public/consent-ui.js ให้ตรงกัน
//   ผู้ใช้ทุกคนจะต้องกดยอมรับฉบับใหม่ก่อนตรวจครั้งถัดไป

import crypto from 'node:crypto';
import { pool } from './db.js';

export const TERMS_VERSION = '1.1';
const KINDS = new Set(['check', 'signup', 'high_value']);

let ready = null;
function ensureTable() {
  if (!ready) {
    ready = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS consents (
          id         BIGSERIAL PRIMARY KEY,
          user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          version    TEXT NOT NULL,
          kind       TEXT NOT NULL,
          ip_hash    TEXT,
          user_agent TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`);
      await pool.query('CREATE INDEX IF NOT EXISTS consents_user_idx ON consents (user_id, version)');
    })().catch(err => { ready = null; throw err; });
  }
  return ready;
}

// แคชในหน่วยความจำ ลดการถามฐานข้อมูลทุกครั้งที่ตรวจ
const cache = new Map();

export async function hasConsent(userId, version = TERMS_VERSION) {
  const key = `${userId}:${version}`;
  if (cache.get(key)) return true;
  await ensureTable();
  const { rows } = await pool.query('SELECT 1 FROM consents WHERE user_id = $1 AND version = $2 LIMIT 1', [userId, version]);
  if (rows.length) { cache.set(key, true); return true; }
  return false;
}

export async function recordConsent(userId, { version, kind, ip, userAgent }) {
  if (version !== TERMS_VERSION) return { ok: false, error: 'ฉบับข้อกำหนดไม่ตรงกับปัจจุบัน กรุณารีเฟรชหน้าเว็บ' };
  await ensureTable();
  const k = KINDS.has(kind) ? kind : 'check';
  const ipHash = ip ? crypto.createHash('sha256').update(String(ip) + (process.env.IP_SALT || 'vellum-check')).digest('hex').slice(0, 32) : null;
  await pool.query(
    'INSERT INTO consents (user_id, version, kind, ip_hash, user_agent) VALUES ($1, $2, $3, $4, $5)',
    [userId, version, k, ipHash, String(userAgent || '').slice(0, 200)]
  );
  cache.set(`${userId}:${version}`, true);
  return { ok: true };
}
