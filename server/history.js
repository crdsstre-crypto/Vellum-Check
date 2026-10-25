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
    `SELECT id, contract_type, created_at, title, pinned,
            CASE WHEN jsonb_typeof(result->'items') = 'array' THEN
              (SELECT count(*) FROM jsonb_array_elements(result->'items') e WHERE e->>'level' = 'check_detail')
            ELSE 0 END AS n_detail,
            CASE WHEN jsonb_typeof(result->'items') = 'array' THEN
              (SELECT count(*) FROM jsonb_array_elements(result->'items') e WHERE e->>'level' = 'caution')
            ELSE 0 END AS n_caution,
            CASE WHEN jsonb_typeof(result->'items') = 'array' THEN
              (SELECT count(*) FROM jsonb_array_elements(result->'items') e WHERE e->>'level' = 'low')
            ELSE 0 END AS n_low
       FROM inspections
      WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT $2`,
    [userId, KEEP_INSPECTIONS]
  );
  return rows.map(r => ({
    id: r.id,
    contractType: r.contract_type,
    createdAt: r.created_at,
    title: r.title || null,
    pinned: r.pinned === true,
    // นับจากผลตรวจจริงที่บันทึกไว้
    summary: { check_detail: Number(r.n_detail), caution: Number(r.n_caution), low: Number(r.n_low) },
  }));
}

// เปลี่ยนชื่อรายงาน / ปักหมุด (เฉพาะรายการของบัญชีนี้) ชื่อว่าง = กลับไปใช้ชื่ออัตโนมัติ
export async function updateInspection(userId, id, { title, pinned }) {
  const sets = [];
  const vals = [id, userId];
  if (title !== undefined) {
    const t = String(title ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
    vals.push(t === '' ? null : t);
    sets.push(`title = $${vals.length}`);
  }
  if (pinned !== undefined) {
    vals.push(pinned === true);
    sets.push(`pinned = $${vals.length}`);
  }
  if (!sets.length) return 0;
  const r = await pool.query(
    `UPDATE inspections SET ${sets.join(', ')} WHERE id = $1 AND user_id = $2`,
    vals
  );
  return r.rowCount;
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

// ลบผลตรวจของบัญชีนี้ทั้งหมด (ไม่แตะประวัติการเติมเครดิต เพราะเป็นหลักฐานการเงิน)
export async function deleteAllInspections(userId) {
  const r = await pool.query('DELETE FROM inspections WHERE user_id = $1', [userId]);
  return r.rowCount;
}

export async function deleteInspection(userId, id) {
  const r = await pool.query('DELETE FROM inspections WHERE id = $1 AND user_id = $2', [id, userId]);
  return r.rowCount;
}
