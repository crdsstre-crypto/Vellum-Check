// เรียก AI ฝั่งเซิร์ฟเวอร์เท่านั้น
// API key ต้องตั้งไว้ใน Environment Variables ของ Render (ชื่อ ANTHROPIC_API_KEY)
// ห้ามใส่ key ในไฟล์นี้หรือไฟล์ใดใน public/

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';

// เพดานโทเคนของคำตอบ ภาษาไทยใช้โทเคนมาก จึงตั้งสูง
const MAX_TOKENS = 8000;

// จำนวนข้อ: อย่างน้อย MIN_ITEMS และไม่เกิน MAX_ITEMS_LIMIT
// สัญญายาวขึ้น ประมาณทุก CHARS_PER_ITEM ตัวอักษรจะเพิ่มได้ 1 ข้อ
export const MAX_ITEMS_LIMIT = 10;
const MIN_ITEMS = 5;
const CHARS_PER_ITEM = 400;

export function itemsFor(textLength) {
  return Math.min(MAX_ITEMS_LIMIT, Math.max(MIN_ITEMS, Math.ceil(textLength / CHARS_PER_ITEM)));
}

// ประเภทสัญญาที่ผู้ใช้เลือกได้ ค่าอื่นทั้งหมดจะถูกแปลงเป็น "unsure"
// ต้องตรงกับ value ใน <select id="contractType"> ของ index.html
export const CONTRACT_TYPES = new Set([
  'unsure', 'rent', 'sale', 'employment', 'service',
  'loan', 'shareholder', 'nda', 'other',
]);

// คำแนะนำว่าควรให้น้ำหนักหัวข้อใดเป็นพิเศษ เป็นแค่การเลือกจุดที่ควรดู ไม่ใช่การตัดสิน
const TYPE_FOCUS = {
  rent: 'ค่าเช่าและการขึ้นค่าเช่า เงินประกันและการคืนเงิน การบอกเลิกสัญญาและการคืนมัดจำ การซ่อมแซมและความรับผิดชอบเมื่อเกิดความเสียหาย',
  sale: 'ราคาและวิธีชำระ การส่งมอบและความเสี่ยงระหว่างส่งมอบ การรับประกันความชำรุด เงื่อนไขการคืนสินค้าหรือการยกเลิก',
  employment: 'ค่าจ้างและการจ่ายตรงเวลา ชั่วโมงหรือระยะเวลาทำงาน โบนัสและสวัสดิการ การเลิกจ้างและการแจ้งล่วงหน้า สิทธิในทรัพย์สินทางปัญญาที่สร้างขณะทำงาน',
  service: 'ขอบเขตงานและการส่งมอบ กำหนดเวลาและค่าปรับ การแก้ไขงานและจำนวนครั้งที่แก้ได้ ลิขสิทธิ์ของงานที่ส่งมอบ การชำระเงินเมื่อยกเลิกกลางคัน',
  loan: 'ดอกเบี้ยและค่าธรรมเนียม กำหนดคืนเงินและงวดชำระ เงื่อนไขการผิดนัดและค่าปรับ หลักประกันที่ให้ไว้',
  shareholder: 'สัดส่วนการลงทุนและการแบ่งกำไร หน้าที่และการตัดสินใจของแต่ละฝ่าย เงื่อนไขการถอนตัวและการโอนหุ้น การระงับข้อพิพาท',
  nda: 'ขอบเขตของข้อมูลลับ ข้อยกเว้นการเปิดเผย ระยะเวลาคุ้มครอง ค่าเสียหายและการบังคับใช้',
  other: 'เงื่อนไขการชำระเงิน ระยะเวลาและการยกเลิก ความรับผิดและค่าเสียหาย การระงับข้อพิพาท',
  unsure: 'ให้พิจารณาจากข้อความสัญญาเอง ถ้าไม่แน่ใจว่าเป็นสัญญาประเภทใด ให้ระบุไว้ใน missing_info แทนการเดา',
};

function buildSystemPrompt(maxItems, contractType = 'unsure') {
  const focus = TYPE_FOCUS[contractType] || TYPE_FOCUS.unsure;
  return `คุณช่วยคัดกรองความเสี่ยงเบื้องต้นของสัญญาภาษาไทย คุณไม่ใช่ทนายและไม่ให้คำปรึกษาทางกฎหมาย

ประเภทสัญญาที่ผู้ใช้ระบุ: ${contractType}
หัวข้อที่ควรให้ความสำคัญเป็นพิเศษ: ${focus}
(ประเภทนี้ช่วยเลือกหัวข้อที่ควรดูเท่านั้น ห้ามใช้เป็นเหตุผลในการฟันธงว่าสัญญาเป็นธรรมหรือไม่เป็นธรรม และถ้าข้อความไม่ตรงกับประเภทที่ระบุ ให้ใส่ไว้ใน missing_info)

กติกา:
- ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่ใช้ markdown ไม่ใส่ backtick
- ห้ามฟันธงว่าสัญญาเป็นธรรมหรือไม่เป็นธรรม ห้ามบอกว่าฝ่ายใดชนะหรือแพ้
- "quote" ต้องคัดลอกจากสัญญาตามตัวอักษรเท่านั้น ถ้าสัญญาไม่มีข้อความนั้นให้ใส่ ""
- ถ้าสัญญาไม่ได้ระบุเรื่องใด ให้ใส่ไว้ใน missing_info ห้ามเดาเอง
- detected_type ให้ระบุประเภทที่เห็นจากข้อความ ใช้ได้เพียงค่าเหล่านี้: "rent" (เช่า), "sale" (ซื้อขาย), "employment" (จ้างงาน), "service" (จ้างบริการ), "loan" (กู้ยืม), "shareholder" (หุ้นส่วน), "nda" (รักษาความลับ), "other" (อื่น ๆ) ถ้าดูไม่ออกให้ใส่ "unsure" ห้ามเดา
- level ใช้ได้เพียงค่าเหล่านี้: "check_detail" (ควรตรวจละเอียด), "caution" (ควรระวัง), "low" (เสี่ยงต่ำ)
- "reference" ใส่มาตราที่เกี่ยวข้องเฉพาะที่มั่นใจ ถ้าไม่แน่ใจให้ใส่ ""
- ทุกข้อความเป็นภาษาไทย กระชับ ไม่เกินสองประโยค
- ไม่เกิน ${maxItems} รายการใน items เรียงจากความเสี่ยงสูงสุดก่อน
- แต่ละฟิลด์ยาวไม่เกิน 2 ประโยค quote สั้นที่สุดที่ยังระบุจุดนั้นได้ชัด
- ตอบให้จบ JSON เสมอ แม้ต้องตัดรายละเอียดลง

รูปแบบ JSON:
{
  "summary": { "job": "", "money": "", "time": "" },
  "items": [
    {
      "title": "",
      "level": "check_detail",
      "quote": "",
      "explanation": "",
      "reference": "",
      "suggested_fix": "",
      "how_to_negotiate": ""
    }
  ],
  "missing_info": [],
  "detected_type": "unsure"
}`;
}

// ดึงเฉพาะส่วนที่เป็น JSON ออกจากข้อความ แม้ AI จะใส่คำนำหรือ backtick มาด้วย
function extractJson(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('AI response does not contain a JSON object');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function analyzeContract(text, contractType = 'unsure') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  // รับเฉพาะค่าที่รู้จัก ค่าอื่นให้ถือว่าไม่แน่ใจ
  const type = CONTRACT_TYPES.has(contractType) ? contractType : 'unsure';
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(itemsFor(text.length), type),
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed with status ${res.status}`);
  }

  const data = await res.json();

  // คำตอบถูกตัดกลางคัน ให้แจ้งชัดเจน แล้ว index.js จะคืนเครดิต
  if (data.stop_reason === 'max_tokens') {
    throw new Error('AI response was cut off by max_tokens');
  }

  const raw = (data.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  return extractJson(raw);
}
