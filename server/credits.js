// เครดิตผูกกับบัญชีผู้ใช้ ไม่ผูกกับเครื่องอีกต่อไป
// การตัดเครดิตเป็นคำสั่ง UPDATE ที่มีเงื่อนไขในคำสั่งเดียว จึงกันการตัดซ้ำจากการกดพร้อมกันได้

import { pool } from './db.js';

export async function getCredits(userId) {
  const { rows } = await pool.query('SELECT credits FROM users WHERE id = $1', [userId]);
  return rows[0]?.credits ?? 0;
}

// ตัดเครดิต 1 ครั้ง คืน true ถ้าตัดได้ false ถ้าเครดิตไม่พอ
export async function reserveCredit(userId) {
  const { rowCount } = await pool.query(
    'UPDATE users SET credits = credits - 1 WHERE id = $1 AND credits >= 1',
    [userId]
  );
  return rowCount === 1;
}

// คืนเครดิต 1 ครั้ง ใช้เมื่อ AI ล้มเหลว
export async function refundCredit(userId) {
  await pool.query('UPDATE users SET credits = credits + 1 WHERE id = $1', [userId]);
}
