// การเชื่อมฐานข้อมูล Postgres และการสร้างตาราง
// ระบบนี้ต้องใช้ฐานข้อมูลเสมอ เพราะบัญชีผู้ใช้และ session เก็บที่นี่

import pg from 'pg';

const FREE_CREDITS = Number(process.env.FREE_CREDITS ?? 3);

if (!process.env.DATABASE_URL) {
  throw new Error('ต้องตั้งค่า DATABASE_URL ก่อนเริ่มระบบ');
}

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Internal URL ของ Render ไม่ต้องใช้ SSL ถ้าใช้ External URL ให้ตั้ง DATABASE_SSL=true
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// เรียกครั้งเดียวตอนเริ่มเซิร์ฟเวอร์ ถ้าล้มเหลวเซิร์ฟเวอร์จะไม่เปิดรับคำขอ
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      credits       INTEGER NOT NULL DEFAULT ${FREE_CREDITS} CHECK (credits >= 0),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      charge_id      TEXT PRIMARY KEY,
      user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id     TEXT NOT NULL,
      credits        INTEGER NOT NULL CHECK (credits > 0),
      amount_satang  INTEGER NOT NULL CHECK (amount_satang > 0),
      status         TEXT NOT NULL DEFAULT 'pending',
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
      credited_at    TIMESTAMPTZ
    )
  `);

  console.log('[db] ตารางผู้ใช้และ session พร้อมใช้งาน');
}
