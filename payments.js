// ระบบเติมเครดิตผ่าน PromptPay
// หลักการ: ราคาและจำนวนเครดิตกำหนดที่เซิร์ฟเวอร์เท่านั้น หน้าเว็บส่งได้แค่รหัสแพ็กเกจ
// การเติมเครดิตทำเฉพาะหลังยืนยันกับ Omise แล้วเท่านั้น (ดู confirmAndCredit ด้านล่าง)

import { pool } from './db.js';
import { omisePost, omiseGet } from './omise.js';

// ราคาปัจจุบัน 50 บาทต่อ 10 ครั้ง หน่วยเป็นสตางค์ (50 บาท = 5000) ปรับได้ที่นี่ที่เดียว
export const PACKAGES = {
  check3: { kind: 'check', credits: 3, amountSatang: 4900, label: 'ตรวจสัญญา 3 ครั้ง ราคา 49 บาท' },
  voice1: { kind: 'voice', credits: 1, amountSatang: 900,  label: 'สรุปเสียง 1 ครั้ง ราคา 9 บาท' },
  voice5: { kind: 'voice', credits: 5, amountSatang: 3900, label: 'สรุปเสียง 5 ครั้ง ราคา 39 บาท' },
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
    `INSERT INTO payments (charge_id, user_id, package_id, credits, amount_satang, status, kind)
     VALUES ($1, $2, $3, $4, $5, 'pending', $6)`,
    [charge.id, userId, packageId, pkg.credits, pkg.amountSatang, pkg.kind]
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
  // เทียบแบบแปลงชนิดก่อน และแสดงค่าจริงในข้อความ error เพื่อให้ดูจาก Logs ได้
  const sameAmount = Number(charge.amount) === Number(row.amount_satang);
  const sameCurrency = String(charge.currency).toLowerCase() === 'thb';
  if (!sameAmount || !sameCurrency) {
    throw new Error(
      `ยอดหรือสกุลเงินไม่ตรง ${chargeId}: จาก Omise=${charge.amount} ${charge.currency}, ที่บันทึก=${row.amount_satang}`
    );
  }

  // เปลี่ยนสถานะและเติมเครดิตในคำสั่งเดียว
  // ถ้า webhook ส่งซ้ำพร้อมกัน จะมีเพียงคำสั่งเดียวที่เปลี่ยนจาก pending ได้
  const { rowCount } = await pool.query(
    `WITH claimed AS (
       UPDATE payments SET status = 'credited', credited_at = now()
        WHERE charge_id = $1 AND status = 'pending'
        RETURNING user_id, credits, kind
     )
     UPDATE users SET
       credits       = users.credits       + CASE WHEN claimed.kind = 'check' THEN claimed.credits ELSE 0 END,
       voice_credits = users.voice_credits + CASE WHEN claimed.kind = 'voice' THEN claimed.credits ELSE 0 END
       FROM claimed
      WHERE users.id = claimed.user_id`,
    [chargeId]
  );

  return { result: rowCount === 1 ? 'credited' : 'already' };
}


/* ---------- ดูสถานะรายการของตัวเอง (ให้หน้าเว็บถามเป็นระยะ) ---------- */

// หลักการ: หน้าเว็บไม่เป็นผู้ตัดสินว่าจ่ายแล้ว ทุกคำตอบมาจากฐานข้อมูลหรือ Omise
// ถ้า Omise บอกว่า successful จะเรียก confirmAndCredit ซึ่งตรวจยอดและกันเติมซ้ำเหมือนเดิม
// คืนค่า status เป็น 'pending' | 'credited' | 'failed' | 'expired' หรือ null ถ้าไม่ใช่รายการของผู้ใช้คนนี้
export async function getPaymentStatus(userId, chargeId) {
  const { rows } = await pool.query(
    'SELECT status, package_id FROM payments WHERE charge_id = $1 AND user_id = $2',
    [chargeId, userId]
  );
  const row = rows[0];
  if (!row) return null;

  const pkg = PACKAGES[row.package_id];
  const base = pkg
    ? { kind: pkg.kind, credits: pkg.credits, amountBaht: pkg.amountSatang / 100 }
    : {};

  if (row.status === 'credited') return { status: 'credited', ...base };

  const charge = await omiseGet(`/charges/${encodeURIComponent(chargeId)}`);

  if (charge.status === 'successful') {
    const { result } = await confirmAndCredit(chargeId);
    if (result === 'credited' || result === 'already') return { status: 'credited', ...base };
    return { status: 'pending', ...base };
  }
  if (charge.status === 'expired') return { status: 'expired', ...base };
  if (charge.status === 'failed' || charge.status === 'reversed') return { status: 'failed', ...base };
  return { status: 'pending', ...base };
}
