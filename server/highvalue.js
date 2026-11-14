// ตรวจว่าสัญญา "มูลค่าสูง/ผลผูกพันสำคัญ" หรือไม่ (ทำก่อนหักเครดิต ไม่เรียก AI)
// ถ้าใช่: ผู้ใช้ต้องติ๊กยืนยันว่า "เข้าใจว่าควรให้ทนายตรวจก่อนลงนาม" ก่อนตรวจ (บันทึกเป็นหลักฐานในตาราง consents)
// และรายงานจะมีกล่องเตือนเด่นด้านบน — ปิดช่อง "เสียหายหนักเพราะเชื่อผลตรวจอย่างเดียว"

export const HIGH_AMOUNT = 500_000;

const TH_DIGITS = /[๐-๙]/g;
const KEYWORDS = [
  [/โฉนด|ซื้อขายที่ดิน|ที่ดินพร้อมสิ่งปลูกสร้าง|ซื้อขายห้องชุด|ซื้อขายบ้าน|land title|sale of land/i, 'ซื้อขายที่ดินหรืออสังหาริมทรัพย์'],
  [/ขายฝาก/, 'ขายฝาก'],
  [/จำนอง|mortgage/i, 'จำนอง'],
  [/สัญญากู้|กู้ยืมเงิน|ผู้กู้|loan agreement|borrower/i, 'กู้ยืมเงิน'],
  [/ผู้ถือหุ้น|หุ้นส่วน|โอนหุ้น|shareholder|partnership/i, 'หุ้นหรือหุ้นส่วน'],
];

function toNum(s) { return Number(String(s).replace(/,/g, '')); }

// หายอดเงินที่สูงที่สุดในข้อความ (บาท / ล้านบาท / THB)
export function maxAmount(text) {
  const t = String(text || '').replace(TH_DIGITS, d => '๐๑๒๓๔๕๖๗๘๙'.indexOf(d));
  let max = 0;
  const take = v => { if (Number.isFinite(v) && v > max && v < 1e12) max = v; };
  // 1.5 ล้านบาท / 3 ล้าน
  for (const m of t.matchAll(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s*ล้าน/g)) take(toNum(m[1]) * 1e6);
  // 1,500,000 บาท / 1500000.00 บาท
  for (const m of t.matchAll(/(\d{1,3}(?:,\d{3})+|\d{4,})(?:\.\d{1,2})?\s*(?:บาท|baht|THB|฿)/gi)) take(toNum(m[1]));
  // THB 1,500,000 / ฿1,500,000
  for (const m of t.matchAll(/(?:THB|฿)\s*(\d{1,3}(?:,\d{3})+|\d{4,})/gi)) take(toNum(m[1]));
  return max;
}

export function detectHighValue(text) {
  const amount = maxAmount(text);
  const reasons = [];
  if (amount >= HIGH_AMOUNT) reasons.push('มียอดเงิน ' + amount.toLocaleString('th-TH') + ' บาท');
  for (const [re, label] of KEYWORDS) if (re.test(text || '')) reasons.push(label);
  return { high: reasons.length > 0, amount, reasons: reasons.slice(0, 4) };
}
