// เรียก AI ฝั่งเซิร์ฟเวอร์เท่านั้น
// API key ต้องตั้งไว้ใน Environment Variables ของ Render (ชื่อ ANTHROPIC_API_KEY)
// ห้ามใส่ key ในไฟล์นี้หรือไฟล์ใดใน public/

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';

// ขีดจำกัดโทเคนของคำตอบ ภาษาไทยใช้โทเคนมาก จึงตั้งไว้สูงพอให้ JSON ไม่ถูกตัดกลางคัน
const MAX_TOKENS = 4000;

const SYSTEM_PROMPT = `คุณช่วยคัดกรองความเสี่ยงเบื้องต้นของสัญญาภาษาไทย คุณไม่ใช่ทนายและไม่ให้คำปรึกษาทางกฎหมาย

กติกา:
- ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่ใช้ markdown ไม่ใส่ backtick
- ห้ามฟันธงว่าสัญญาเป็นธรรมหรือไม่เป็นธรรม ห้ามบอกว่าฝ่ายใดชนะหรือแพ้
- "quote" ต้องคัดลอกจากสัญญาตามตัวอักษรเท่านั้น ถ้าสัญญาไม่มีข้อความนั้นให้ใส่ ""
- ถ้าสัญญาไม่ได้ระบุเรื่องใด ให้ใส่ไว้ใน missing_info ห้ามเดาเอง
- level ใช้ได้เพียงค่าเหล่านี้: "check_detail" (ควรตรวจละเอียด), "caution" (ควรระวัง), "low" (เสี่ยงต่ำ)
- "reference" ใส่มาตราที่เกี่ยวข้องเฉพาะที่มั่นใจ ถ้าไม่แน่ใจให้ใส่ ""
- ทุกข้อความเป็นภาษาไทย กระชับ ไม่เกินสองประโยค
- ไม่เกิน 8 รายการใน items

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
  "missing_info": []
}`;

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

export async function analyzeContract(text) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
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
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed with status ${res.status}`);
  }

  const data = await res.json();

  // ถ้าคำตอบถูกตัดเพราะยาวเกิน จะแจ้งใน Logs ให้เห็นชัด
  if (data.stop_reason === 'max_tokens') {
    console.warn('[ai] response was cut off by max_tokens');
  }

  const raw = (data.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  // ถ้า JSON ผิดรูปแบบจะโยน error และ index.js จะคืนเครดิตให้
  return extractJson(raw);
}
