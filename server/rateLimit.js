// จำกัดจำนวนครั้งที่ล็อกอินผิดซ้ำ เพื่อกันการเดารหัสผ่าน
// - นับแยกตาม "อีเมล" และ "IP" แต่ละตัวมีเพดานต่างกัน (IP ใช้เพดานสูงกว่า เพราะหลายคนอาจใช้ IP เดียวกัน)
// - เก็บในหน่วยความจำของเซิร์ฟเวอร์ จึงรีเซ็ตเมื่อเซิร์ฟเวอร์รีสตาร์ต ใช้ได้เพราะตอนนี้รันแค่ instance เดียว

const WINDOW_MS = 15 * 60 * 1000;
const LIMITS = { email: 5, ip: 30 };
const failures = new Map(); // key -> { count, resetAt }

function limitFor(key) {
  return LIMITS[key.split(':')[0]] ?? 5;
}

// คืนรายการที่ยังไม่หมดอายุ ถ้าหมดอายุแล้วจะลบทิ้ง
function liveEntry(key) {
  const entry = failures.get(key);
  if (!entry) return null;
  if (entry.resetAt <= Date.now()) {
    failures.delete(key);
    return null;
  }
  return entry;
}

// true ถ้ามี key ใดที่ถึงเพดานแล้ว
export function isBlocked(keys) {
  return keys.some(key => {
    const entry = liveEntry(key);
    return entry !== null && entry.count >= limitFor(key);
  });
}

// บันทึกการล็อกอินผิดหนึ่งครั้งให้ทุก key
export function recordFailure(keys) {
  const now = Date.now();
  for (const key of keys) {
    const entry = liveEntry(key);
    if (entry) entry.count += 1;
    else failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  }
}

// ล้างการนับของ key นั้น (ใช้เมื่อล็อกอินสำเร็จ)
export function clearFailures(keys) {
  for (const key of keys) failures.delete(key);
}

// ลบรายการที่หมดอายุทุก 10 นาที กันหน่วยความจำโตเรื่อย ๆ
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of failures) {
    if (entry.resetAt <= now) failures.delete(key);
  }
}, 10 * 60 * 1000).unref();
