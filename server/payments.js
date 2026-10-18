// ระบบเติมเครดิตผ่าน PromptPay
// หลักการ: ราคาและจำนวนเครดิตกำหนดที่เซิร์ฟเวอร์เท่านั้น หน้าเว็บส่งได้แค่รหัสแพ็กเกจ
// การเติมเครดิตจริงจะทำหลังยืนยันกับ Omise แล้วเท่านั้น (ทำในขั้นตอนถัดไป)

import { pool } from './db.js';
import { omisePost } from './omise.js';

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
