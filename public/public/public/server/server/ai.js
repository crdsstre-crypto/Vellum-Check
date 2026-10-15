// เรียก AI ฝั่งเซิร์ฟเวอร์เท่านั้น
// API key ต้องตั้งไว้ใน Environment Variables ของ Render (ชื่อ ANTHROPIC_API_KEY)
// ห้ามใส่ key ในไฟล์นี้หรือไฟล์ใดใน public/

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';

const SYSTEM_PROMPT = `คุณช่วยคัดกรองความเสี่ยงเบื้องต้นของสัญญาภาษาไทย คุณไม่ใช่ทนายและไม่ให้คำปรึกษาทางกฎหมาย

กติกา:
- ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่ใช้ markdown ไม่ใส่ backtick
- ห้ามฟันธงว่าสัญญาเป็นธรรมหรือไม่เป็นธรรม ห้ามบอกว่าฝ่ายใดชนะหรือแพ้
- "quote" ต้องคัดลอกจากสัญญาตามตัวอักษรเท่านั้น ถ้าสัญญาไม่มีข้อความนั้นให้ใส่ ""
- ถ้าสัญญาไม่ได้ระบุเรื่องใด ให้ใส่ไว้ใน missing_info ห้ามเดาเอง
- level ใช้ได้เพียงค่าเหล่านี้: "check_detail" (ควรตรวจละเอียด), "caution" (ควรระวัง), "low" (เสี่ยงต่ำ)
- "reference" ใส่มาตราที่เกี่ยวข้องเฉพาะที่มั่นใจ ถ้าไม่แน่ใจให้ใส่ ""
- ทุกข้อความเป็นภาษาไทย กระชับ ไม่เกินสองประโยค

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
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed with status ${res.status}`);
  }

  const data = await res.json();
  const raw = (data.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  // ถ้า JSON ผิดรูปแบบ JSON.parse จะโยน error และ index.js จะคืนเครดิตให้
  return JSON.parse(raw);
}

