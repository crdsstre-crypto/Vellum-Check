// เครดิตผูกกับบัญชีผู้ใช้ ไม่ผูกกับเครื่องอีกต่อไป
// การตัดเครดิตเป็นคำสั่ง UPDATE ที่มีเงื่อนไขในคำสั่งเดียว จึงกันการตัดซ้ำจากการกดพร้อมกันได้

import { pool } from './db.js';

export async function getCredits(userId) {
  const { rows } = await pool.query('SELECT credits FROM users WHERE id = $1', [userId]);
  return rows[0]?.credits ?? 0;
}

// ตัดเครดิต 1 ครั้ง คืน true ถ้าตัดได้ false ถ้าเครดิตไม่พอ
export async function reserveCredit(userId) {
  return reserveCredits(userId, 1);
}

// ตัดเครดิตหลายหน่วยพร้อมกัน คืน true ถ้าตัดได้ทั้งหมด false ถ้าไม่พอ (ไม่ตัดเลยถ้าไม่พอ)
export async function reserveCredits(userId, n) {
  const { rowCount } = await pool.query(
    'UPDATE users SET credits = credits - $2 WHERE id = $1 AND credits >= $2',
    [userId, n]
  );
  return rowCount === 1;
}

// คืนเครดิต 1 ครั้ง ใช้เมื่อ AI ล้มเหลว
export async function refundCredit(userId) {
  return refundCredits(userId, 1);
}

// คืนเครดิตหลายหน่วย
export async function refundCredits(userId, n) {
  await pool.query('UPDATE users SET credits = credits + $2 WHERE id = $1', [userId, n]);
}

// ---------- ยอดเสียงสรุป (แยกจากยอดตรวจสัญญา) ----------

export async function getVoiceCredits(userId) {
  const { rows } = await pool.query('SELECT voice_credits FROM users WHERE id = $1', [userId]);
  return rows[0]?.voice_credits ?? 0;
}

// ตัดยอดเสียง n ครั้ง คืน true ถ้าพอ และตัดให้ทั้งหมดในคำสั่งเดียว
export async function reserveVoiceCredits(userId, n) {
  const { rowCount } = await pool.query(
    'UPDATE users SET voice_credits = voice_credits - $2 WHERE id = $1 AND voice_credits >= $2',
    [userId, n]
  );
  return rowCount === 1;
}

export async function refundVoiceCredits(userId, n) {
  await pool.query('UPDATE users SET voice_credits = voice_credits + $2 WHERE id = $1', [userId, n]);
}
