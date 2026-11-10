// แจ้งเตือนวันสำคัญในสัญญา (วันสิ้นสุด วันแจ้งล่วงหน้า วันชำระเงิน ฯลฯ)
// ผู้ใช้ยืนยันวันที่เองก่อนบันทึก · ไม่เก็บข้อความสัญญา เก็บแค่ชื่อรายการและวันที่

import { pool } from './db.js';

export const MAX_REMINDERS = 200;   // ต่อบัญชี
export const MAX_BATCH = 20;        // ต่อการบันทึกหนึ่งครั้ง
const KINDS = new Set(['end', 'notice', 'pay', 'start', 'deliver', 'probation', 'renew', 'other']);
const REPEATS = new Set(['none', 'monthly', 'yearly']);

// ตรวจและทำความสะอาดข้อมูลจากหน้าเว็บ คืน null ถ้าใช้ไม่ได้
export function cleanReminder(x) {
  if (!x || typeof x !== 'object') return null;
  const title = String(x.title || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  const due = String(x.dueDate || '');
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(due)) return null;
  const d = new Date(due + 'T00:00:00Z');
  const y = d.getUTCFullYear();
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== due || y < 2000 || y > 2100) return null;
  const kind = KINDS.has(x.kind) ? x.kind : 'other';
  const repeat = REPEATS.has(x.repeat) ? x.repeat : 'none';
  const note = x.note ? String(x.note).replace(/\s+/g, ' ').trim().slice(0, 200) : null;
  const inspectionId = Number.isInteger(x.inspectionId) && x.inspectionId > 0 ? x.inspectionId : null;
  return { title, dueDate: due, kind, repeat, note, inspectionId };
}

const COLS = `id, inspection_id, title, to_char(due_date, 'YYYY-MM-DD') AS due_date, kind, repeat, note, done, created_at`;
const toApi = r => ({
  id: r.id, inspectionId: r.inspection_id, title: r.title, dueDate: r.due_date,
  kind: r.kind, repeat: r.repeat, note: r.note, done: r.done === true, createdAt: r.created_at,
});

export async function listReminders(userId) {
  const { rows } = await pool.query(
    `SELECT ${COLS} FROM reminders WHERE user_id = $1 ORDER BY done, due_date, id LIMIT $2`,
    [userId, MAX_REMINDERS]
  );
  return rows.map(toApi);
}

// บันทึกหลายรายการพร้อมกัน · ถ้าเกินเพดานต่อบัญชีจะไม่บันทึกเลย (คืน { full: true })
export async function addReminders(userId, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // ล็อกแถวผู้ใช้กันการบันทึกซ้อนกันจนเกินเพดาน
    await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [userId]);
    const { rows: c } = await client.query('SELECT count(*)::int AS n FROM reminders WHERE user_id = $1', [userId]);
    if (c[0].n + items.length > MAX_REMINDERS) { await client.query('ROLLBACK'); return { full: true }; }
    const out = [];
    for (const it of items) {
      // inspection_id ต้องเป็นของบัญชีนี้ ไม่งั้นตั้งเป็น null
      const { rows } = await client.query(
        `INSERT INTO reminders (user_id, inspection_id, title, due_date, kind, repeat, note)
         VALUES ($1, (SELECT id FROM inspections WHERE id = $2 AND user_id = $1), $3, $4, $5, $6, $7)
         RETURNING ${COLS}`,
        [userId, it.inspectionId, it.title, it.dueDate, it.kind, it.repeat, it.note]
      );
      out.push(toApi(rows[0]));
    }
    await client.query('COMMIT');
    return { items: out };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function updateReminder(userId, id, patch) {
  const sets = [], vals = [id, userId];
  if (typeof patch.done === 'boolean') { vals.push(patch.done); sets.push(`done = $${vals.length}`); }
  if (patch.title !== undefined) { vals.push(patch.title); sets.push(`title = $${vals.length}`); }
  if (patch.dueDate !== undefined) { vals.push(patch.dueDate); sets.push(`due_date = $${vals.length}`); }
  if (!sets.length) return null;
  const { rows } = await pool.query(
    `UPDATE reminders SET ${sets.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING ${COLS}`, vals
  );
  return rows[0] ? toApi(rows[0]) : null;
}

export async function deleteReminder(userId, id) {
  const { rowCount } = await pool.query('DELETE FROM reminders WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount;
}

// ----- ไฟล์ปฏิทิน (.ics) -----
// เตือนล่วงหน้า 7 วันและ 1 วัน เวลา 09:00 (เวลาเครื่องของผู้ใช้) · รายเดือน/รายปีใช้ RRULE
function icsText(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
// ตัดบรรทัดยาวตามมาตรฐาน (75 octets) โดยไม่ตัดกลางอักขระ UTF-8
function fold(line) {
  const out = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}
export function buildIcs(items, host = 'vellum-check') {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vellum Check//Reminders//TH', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  items.forEach((it, k) => {
    const d = it.dueDate.replace(/-/g, '');
    const next = new Date(it.dueDate + 'T00:00:00Z'); next.setUTCDate(next.getUTCDate() + 1);
    const uidBase = it.id ? 'r' + it.id : 'x' + Date.now().toString(36) + k;
    L.push('BEGIN:VEVENT',
      `UID:${uidBase}@${host}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, '')}`,
      fold('SUMMARY:' + icsText(it.title)),
      fold('DESCRIPTION:' + icsText((it.note ? it.note + '\n' : '') + 'บันทึกจาก Vellum Check · ตรวจทานวันที่กับสัญญาฉบับจริงอีกครั้ง')));
    if (it.repeat === 'monthly') L.push('RRULE:FREQ=MONTHLY');
    if (it.repeat === 'yearly') L.push('RRULE:FREQ=YEARLY');
    // รายเดือนเตือนแค่วันก่อนหน้า (เตือน 7 วันทุกเดือนจะถี่เกินไป)
    if (it.repeat !== 'monthly') L.push('BEGIN:VALARM', 'ACTION:DISPLAY', fold('DESCRIPTION:' + icsText('อีก 7 วัน: ' + it.title)), 'TRIGGER:-P6DT15H', 'END:VALARM');
    L.push('BEGIN:VALARM', 'ACTION:DISPLAY', fold('DESCRIPTION:' + icsText('พรุ่งนี้: ' + it.title)), 'TRIGGER:-PT15H', 'END:VALARM');
    L.push('END:VEVENT');
  });
  L.push('END:VCALENDAR');
  return L.join('\r\n') + '\r\n';
}
