// ใบรับรองการตรวจ (หลักฐาน) — บันทึกว่า "ตรวจเมื่อไร ใช้เงื่อนไขรุ่นไหน ใช้คำสั่ง AI รุ่นไหน ผลออกมาเป็นอะไร"
// เก็บเพียงค่า hash ของผลตรวจ ไม่เก็บข้อความสัญญา · ถ้ามีข้อพิพาท ผู้ใช้ส่งรหัสอ้างอิง + ผลที่ได้ มาเทียบ hash ได้
// ใช้ตาราง check_log เดิม เพิ่มคอลัมน์แบบไม่ทำลายข้อมูลเก่า

import { createHash, randomBytes } from 'node:crypto';
import { pool } from './db.js';

let ready = null;
function ensure() {
  if (!ready) {
    ready = (async () => {
      for (const col of ['ref TEXT', 'terms_version TEXT', 'prompt_version TEXT', 'result_hash TEXT', 'saved BOOLEAN']) {
        await pool.query(`ALTER TABLE check_log ADD COLUMN IF NOT EXISTS ${col}`);
      }
      await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS check_log_ref_idx ON check_log (ref) WHERE ref IS NOT NULL');
    })().catch(e => { ready = null; throw e; });
  }
  return ready;
}

// เรียงคีย์ก่อน hash ให้ได้ค่าเดิมเสมอ ไม่ขึ้นกับลำดับฟิลด์
function stable(v) {
  if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
  return JSON.stringify(v ?? null);
}
export function hashResult(result) {
  const { receipt, guard, ...rest } = result || {};
  return createHash('sha256').update(stable(rest)).digest('hex');
}

// รหัสอ้างอิง เช่น VC-6K2Q-9TPA (อ่านง่าย ไม่มี 0/O/1/I)
const ABC = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export function newRef() {
  const b = randomBytes(8); let s = '';
  for (let i = 0; i < 8; i++) s += ABC[b[i] % ABC.length];
  return 'VC-' + s.slice(0, 4) + '-' + s.slice(4);
}
export const REF_RE = /^VC-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/;

export async function logCheckReceipt(userId, contractType, result, { terms, prompt, saved }) {
  const at = new Date();
  const receipt = { ref: newRef(), at: at.toISOString(), terms, prompt, hash: hashResult(result).slice(0, 16) };
  try {
    await ensure();
    await pool.query(
      `INSERT INTO check_log (user_id, contract_type, n_items, ref, terms_version, prompt_version, result_hash, saved, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [userId, contractType, (result?.items?.length | 0), receipt.ref, terms, prompt, hashResult(result), !!saved, at]
    );
  } catch (e) {
    console.error('[receipt] log failed:', e.message);
    // บันทึกแบบเดิมให้สถิติยังนับได้
    await pool.query('INSERT INTO check_log (user_id, contract_type, n_items) VALUES ($1, $2, $3)', [userId, contractType, result?.items?.length | 0]).catch(() => {});
  }
  return receipt;
}

// แอดมินค้นรหัสอ้างอิง (ใช้ตอบเรื่องร้องเรียน)
export async function findReceipt(ref) {
  await ensure();
  const { rows } = await pool.query(
    `SELECT c.ref, c.created_at, c.contract_type, c.n_items, c.terms_version, c.prompt_version, c.result_hash, c.saved, u.email
       FROM check_log c LEFT JOIN users u ON u.id = c.user_id WHERE c.ref = $1`, [ref]);
  return rows[0] || null;
}
// ผู้ใช้ตรวจว่ารหัสนี้เป็นของตัวเองไหม
export async function ownsRef(userId, ref) {
  if (!REF_RE.test(ref || '')) return false;
  await ensure();
  const { rows } = await pool.query('SELECT 1 FROM check_log WHERE ref = $1 AND user_id = $2', [ref, userId]);
  return !!rows[0];
}
