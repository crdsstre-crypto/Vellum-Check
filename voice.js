// เสียงสรุปผลการตรวจด้วย ElevenLabs (เรียกจากเซิร์ฟเวอร์เท่านั้น คีย์อยู่ใน Environment)
// ตั้งค่าใน Render: ELEVENLABS_API_KEY และ ELEVENLABS_VOICE_ID

export const VOICE_CREDIT_COST = 1; // 1 เครดิตเสียง = 1 การสรุปเสียง (แพ็ก 1 ครั้ง 9 บาท)
const MAX_SPEECH_CHARS = 400;       // เพดานความยาวต่อการสรุปหนึ่งครั้ง กันเครดิตหมดโดยไม่ตั้งใจ

// สร้างข้อความสั้นสำหรับอ่านจากผลตรวจ
// อ่านเฉพาะจำนวนประเด็นและหัวข้อ 3 ข้อแรก ส่วนรายละเอียดให้ดูในหน้าเว็บ
export function buildSpokenSummary(result) {
  const counts = result?.risk_counts ?? {};
  const total = (counts.check_detail ?? 0) + (counts.caution ?? 0);
  if (total === 0) return 'ไม่พบประเด็นที่ควรระวังในสัญญานี้';

  const titles = (result?.items ?? []).map(i => i.title).filter(Boolean).slice(0, 3);
  const head = `พบ ${total} ประเด็นที่ควรตรวจ`;
  // เรียงเป็นรายการด้วยจุลภาค และใช้ 'และ' เฉพาะก่อนข้อสุดท้าย ฟังเป็นธรรมชาติกว่า
  const listed = titles.length > 1
    ? `${titles.slice(0, -1).join(', ')} และ ${titles[titles.length - 1]}`
    : titles[0] ?? '';
  const tail = listed ? `ได้แก่ ${listed}` : '';
  return `${head} ${tail}`.trim().slice(0, MAX_SPEECH_CHARS);
}

// คืนค่าเป็น base64 ของไฟล์ mp3
export async function synthesizeSpeech(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    throw new Error('ยังไม่ได้ตั้งค่า ELEVENLABS_API_KEY หรือ ELEVENLABS_VOICE_ID');
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    // ต้องใช้โมเดลที่รองรับภาษาไทยจริง (eleven_multilingual_v2 ไม่มีภาษาไทยในรายการ)
    body: JSON.stringify({ text, model_id: 'eleven_v3' }),
  });
  if (!res.ok) {
    // บันทึกเฉพาะข้อความสั้น ๆ จากผู้ให้บริการ ไม่บันทึกข้อความสัญญาหรือคีย์
    const body = await res.json().catch(() => ({}));
    const reason = String(body?.detail?.message ?? body?.detail?.status ?? '').slice(0, 150);
    throw new Error(`ElevenLabs ตอบกลับสถานะ ${res.status}${reason ? ` (${reason})` : ''}`);
  }
  // ElevenLabs ส่งจำนวนตัวอักษรที่คิดเงินมาในหัวข้อ character-cost ใช้ตรวจว่าเครดิตลดจริงเท่าไร
  console.log(`[voice] ตัวอักษรที่คิดเงิน: ${res.headers.get('character-cost') ?? 'ไม่ทราบ'} จากข้อความ ${text.length} ตัวอักษร`);
  return Buffer.from(await res.arrayBuffer()).toString('base64');
}
