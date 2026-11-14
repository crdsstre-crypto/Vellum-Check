// ระยะเวลาเก็บข้อมูล (ลดข้อมูลที่ถือไว้ให้น้อยที่สุด = ลดความเสี่ยงข้อมูลรั่ว/ข้อพิพาท PDPA)
// - ผลตรวจที่ไม่ได้ปักหมุด: ลบอัตโนมัติเมื่อเก่ากว่า KEEP_DAYS วัน
// - ผลตรวจที่ปักหมุด: เก็บได้นานสุด PINNED_DAYS วัน
// - ลิงก์แชร์ที่หมดอายุแล้ว: ลบหลังหมดอายุ 7 วัน
// - เรื่องร้องเรียนที่ปิดแล้ว: ลบหลัง 365 วัน
// ทำงานตอนเปิดเซิร์ฟเวอร์ และทุก 6 ชั่วโมง (เซิร์ฟเวอร์ฟรีหลับบ่อย จึงไม่พึ่งเวลาเที่ยงคืน)

import { pool } from './db.js';

export const KEEP_DAYS = 90;
export const PINNED_DAYS = 365;

const JOBS = [
  ['inspections', `DELETE FROM inspections WHERE (pinned IS NOT TRUE AND created_at < now() - interval '${KEEP_DAYS} days')
                                           OR created_at < now() - interval '${PINNED_DAYS} days'`],
  ['shares', `DELETE FROM shares WHERE expires_at < now() - interval '7 days'`],
  ['support', `DELETE FROM support_tickets WHERE status = 'resolved' AND resolved_at < now() - interval '365 days'`],
];

export async function runRetention() {
  const out = {};
  for (const [name, sql] of JOBS) {
    try { const r = await pool.query(sql); out[name] = r.rowCount || 0; }
    catch (e) { if (!/does not exist/i.test(e.message)) console.error('[retention]', name, e.message); out[name] = 0; }
  }
  const n = Object.values(out).reduce((a, b) => a + b, 0);
  if (n) console.log('[retention] ลบข้อมูลเก่า', JSON.stringify(out));
  return out;
}

let timer = null;
export function startRetention() {
  if (timer) return;
  setTimeout(() => runRetention().catch(() => {}), 20_000);
  timer = setInterval(() => runRetention().catch(() => {}), 6 * 3600e3);
  timer.unref?.();
}
