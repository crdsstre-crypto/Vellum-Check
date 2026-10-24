// ประวัติการใช้งานของบัญชี: ผลตรวจสัญญา และรายการเติมเครดิต
// เก็บผลตรวจล่าสุดไม่เกิน KEEP_INSPECTIONS รายการต่อบัญชี เพื่อจำกัดข้อมูลที่เก็บไว้

import { pool } from './db.js';
import { PACKAGES } from './payments.js';

const KEEP_INSPECTIONS = 50;

export async function saveInspection(userId, contractType, result) {
  await pool.query(
    'INSERT INTO inspections (user_id, contract_type, result) VALUES ($1, $2, $3)',
    [userId, contractType, JSON.stringify(result)]
  );
  // ลบรายการที่เก่าเกินเพดาน
  await pool.query(
    `DELETE FROM inspections
      WHERE user_id = $1
        AND id NOT IN (
          SELECT id FROM inspections WHERE user_id = $1
          ORDER BY created_at DESC, id DESC LIMIT $2
        )`,
    [userId, KEEP_INSPECTIONS]
  );
}

export async function listInspections(userId) {
  const { rows } = await pool.query(
    `SELECT id, contract_type, created_at FROM inspections
      WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT $2`,
    [userId, KEEP_INSPECTIONS]
  );
  return rows.map(r => ({
    id: r.id,
    contractType: r.contract_type,
    createdAt: r.created_at,
  }));
}

export async function getInspection(userId, id) {
  const { rows } = await pool.query(
    'SELECT result FROM inspections WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0]?.result ?? null;
}

export async function listPayments(userId) {
  const { rows } = await pool.query(
    `SELECT package_id, amount_satang, status, created_at, credited_at
       FROM payments WHERE user_id = $1
      ORDER BY created_at DESC LIMIT 50`,
    [userId]
  );
  return rows.map(r => ({
    label: PACKAGES[r.package_id]?.label ?? r.package_id,
    amountBaht: Math.round(r.amount_satang / 100),
    credited: r.status === 'credited',
    createdAt: r.created_at,
    creditedAt: r.credited_at,
  }));
}
