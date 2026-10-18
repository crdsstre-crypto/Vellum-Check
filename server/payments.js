// ระบบเติมเครดิตผ่าน PromptPay
// หลักการ: ราคาและจำนวนเครดิตกำหนดที่เซิร์ฟเวอร์เท่านั้น หน้าเว็บส่งได้แค่รหัสแพ็กเกจ
// การเติมเครดิตทำเฉพาะหลังยืนยันกับ Omise แล้วเท่านั้น (ดู confirmAndCredit ด้านล่าง)

import { pool } from './db.js';
import { omisePost, omiseGet } from './omise.js';

// ราคาเป็นค่าเริ่มต้นสำหรับทดสอบ ปรับได้ตามที่ตกลงกัน หน่วยเป็นสตางค์ (99 บาท = 9900)
export const PACKAGES = {
  pack10: { credits: 10, amountSatang: 9900, label: '10 ครั้ง ราคา 99 บาท' },
};

// สร้างรายการ PromptPay แล้วคืน QR สำหรับให้ผู้ใช้สแกน
export async function createPromptPayPayment(userId, packageId) {
  const pkg = PACKAGES[packageId];
  if (!pkg) throw new Error('ไม่พบแพ็กเกจ');

  // 1) สร้างแหล่งชำระเงินชนิด PromptPay
  const source = await omisePost('/sources', {
    type: 'promptpay',
    amount: pkg.amountSatang,
    currency: 'thb',
  });

  // 2) สร้างรายการเรียกเก็บเงินจากแหล่งนั้น
  const charge = await omisePost('/charges', {
    amount: pkg.amountSatang,
    currency: 'thb',
    source: source.id,
    description: `เติมเครดิต ${pkg.credits} ครั้ง (user ${userId})`,
  });

  // 3) บันทึกเป็นรายการรอชำระ เครดิตยังไม่ถูกเพิ่มจนกว่าจะยืนยันว่าจ่ายแล้ว
  await pool.query(
    `INSERT INTO payments (charge_id, user_id, package_id, credits, amount_satang, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')`,
    [charge.id, userId, packageId, pkg.credits, pkg.amountSatang]
  );

  return {
    chargeId: charge.id,
    status: charge.status,
    label: pkg.label,
    // ลิงก์รูป QR ที่ Omise สร้างให้ ถ้าไม่มีให้ตรวจโครงสร้างตอบกลับตอนทดสอบ
    qrImageUrl: charge.source?.scannable_code?.image?.download_uri ?? null,
    expiresAt: charge.expires_at ?? null,
  };
}


/* ---------- ยืนยันการจ่ายและเติมเครดิต (ขั้นที่ 3) ---------- */

// เรียกจาก webhook ของ Omise
// หลักการ: ไม่เชื่อข้อมูลใน webhook แต่ดึงสถานะจาก Omise ด้วยคีย์ลับอีกครั้ง
// คืนค่า result เป็น 'credited' | 'already' | 'not_paid' | 'unknown'
export async function confirmAndCredit(chargeId) {
  const { rows } = await pool.query(
    'SELECT user_id, amount_satang, status FROM payments WHERE charge_id = $1',
    [chargeId]
  );
  const row = rows[0];
  if (!row) return { result: 'unknown' }; // ไม่ใช่รายการที่ระบบนี้สร้าง
  if (row.status === 'credited') return { result: 'already' };

  const charge = await omiseGet(`/charges/${encodeURIComponent(chargeId)}`);
  if (charge.status !== 'successful') return { result: 'not_paid' };

  // ยอดและสกุลเงินต้องตรงกับที่บันทึกไว้ตอนสร้างรายการ
  if (charge.amount !== row.amount_satang || charge.currency !== 'thb') {
    throw new Error(`ยอดหรือสกุลเงินไม่ตรงกับรายการ ${chargeId}`);
  }

  // เปลี่ยนสถานะและเติมเครดิตในคำสั่งเดียว
  // ถ้า webhook ส่งซ้ำพร้อมกัน จะมีเพียงคำสั่งเดียวที่เปลี่ยนจาก pending ได้
  const { rowCount } = await pool.query(
    `WITH claimed AS (
       UPDATE payments SET status = 'credited', credited_at = now()
        WHERE charge_id = $1 AND status = 'pending'
        RETURNING user_id, credits
     )
     UPDATE users SET credits = users.credits + claimed.credits
       FROM claimed
      WHERE users.id = claimed.user_id`,
    [chargeId]
  );

  return { result: rowCount === 1 ? 'credited' : 'already' };
}
