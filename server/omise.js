// เรียก API ของ Omise (Opn Payments) ด้วย fetch ที่มีใน Node แล้ว ไม่ต้องติดตั้งไลบรารีเพิ่ม
// คีย์ลับ OMISE_SECRET_KEY อ่านจาก Environment เท่านั้น ห้ามพิมพ์หรือ log ค่านี้

const OMISE_API = 'https://api.omise.co';

if (!process.env.OMISE_SECRET_KEY) {
  console.warn('[omise] ยังไม่ได้ตั้งค่า OMISE_SECRET_KEY ระบบชำระเงินจะใช้งานไม่ได้');
}

function authHeader() {
  // Omise ใช้ Basic Auth โดยคีย์เป็นชื่อผู้ใช้ และรหัสผ่านว่าง
  return 'Basic ' + Buffer.from(`${process.env.OMISE_SECRET_KEY ?? ''}:`).toString('base64');
}

export async function omisePost(path, body) {
  const res = await fetch(OMISE_API + path, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Omise ${path} ตอบกลับ ${res.status}: ${data.message ?? 'ไม่ทราบสาเหตุ'}`);
  }
  return data;
}

export async function omiseGet(path) {
  const res = await fetch(OMISE_API + path, {
    headers: { Authorization: authHeader() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Omise ${path} ตอบกลับ ${res.status}: ${data.message ?? 'ไม่ทราบสาเหตุ'}`);
  }
  return data;
}
