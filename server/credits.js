// ระบบเครดิต
// - ถ้ามี DATABASE_URL: เก็บใน Postgres (ไม่หายเมื่อเซิร์ฟเวอร์รีสตาร์ต)
// - ถ้าไม่มี: เก็บในหน่วยความจำ (หายเมื่อรีสตาร์ต ใช้ทดสอบบนเครื่องเท่านั้น)
//
// ⚠️ ระบุตัวผู้ใช้ด้วยรหัสเครื่องที่เบราว์เซอร์สร้าง ผู้ใช้ล้างข้อมูลเบราว์เซอร์แล้วได้เครดิตใหม่ได้
//    ก่อนเปิดให้คนจ่ายเงินต้องเปลี่ยนเป็นระบบล็อกอิน

import pg from 'pg';

const FREE_CREDITS = Number(process.env.FREE_CREDITS ?? 3);
const useDb = Boolean(process.env.DATABASE_URL);

let pool = null;
const memory = new Map();

// เรียกครั้งเดียวตอนเริ่มเซิร์ฟเวอร์ ถ้าเชื่อมฐานข้อมูลไม่ได้จะโยน error ให้เซิร์ฟเวอร์หยุดทำงาน
export async function initCredits() {
  if (!useDb) {
    console.warn('[credits] ไม่มี DATABASE_URL ใช้หน่วยความจำ (เครดิตจะหายเมื่อรีสตาร์ต)');
    return;
  }

  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Internal URL ของ Render ไม่ต้องใช้ SSL ถ้า URL ภายนอกต้องตั้ง DATABASE_SSL=true
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS credits (
      device_id TEXT PRIMARY KEY,
      balance   INTEGER NOT NULL CHECK (balance >= 0)
    )
  `);
  console.log('[credits] Postgres พร้อมใช้งาน');
}

// คืนยอดคงเหลือ ถ้าผู้ใช้ใหม่จะสร้างแถวให้ด้วยค่าเริ่มต้น
export async function getBalance(id) {
  if (!useDb) {
    if (!memory.has(id)) memory.set(id, FREE_CREDITS);
    return memory.get(id);
  }

  await pool.query(
    'INSERT INTO credits (device_id, balance) VALUES ($1, $2) ON CONFLICT (device_id) DO NOTHING',
    [id, FREE_CREDITS]
  );
  const { rows } = await pool.query('SELECT balance FROM credits WHERE device_id = $1', [id]);
  return rows[0].balance;
}

// ตัดเครดิต 1 ครั้ง คืน true ถ้าตัดได้ false ถ้าเครดิตไม่พอ
// โหมด Postgres ใช้คำสั่ง UPDATE ที่มีเงื่อนไขในคำสั่งเดียว จึงกันการตัดซ้ำจากการกดพร้อมกันได้
export async function reserveCredit(id) {
  if (!useDb) {
    // ไม่มี await ระหว่างอ่านกับเขียน จึงไม่มีการแทรกจาก request อื่น
    if (!memory.has(id)) memory.set(id, FREE_CREDITS);
    const b = memory.get(id);
    if (b < 1) return false;
    memory.set(id, b - 1);
    return true;
  }

  await getBalance(id);
  const { rowCount } = await pool.query(
    'UPDATE credits SET balance = balance - 1 WHERE device_id = $1 AND balance >= 1',
    [id]
  );
  return rowCount === 1;
}

// คืนเครดิต 1 ครั้ง ใช้เมื่อ AI ล้มเหลว
export async function refundCredit(id) {
  if (!useDb) {
    memory.set(id, (memory.get(id) ?? FREE_CREDITS) + 1);
    return;
  }
  await pool.query('UPDATE credits SET balance = balance + 1 WHERE device_id = $1', [id]);
}
