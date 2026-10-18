// เสียงสรุปผลการตรวจด้วย ElevenLabs (เรียกจากเซิร์ฟเวอร์เท่านั้น คีย์อยู่ใน Environment)
// ตั้งค่าใน Render: ELEVENLABS_API_KEY และ ELEVENLABS_VOICE_ID

export const VOICE_CREDIT_COST = 2; // 1 เครดิต ≈ 5 บาท จึงเท่ากับประมาณ 10 บาทต่อการสรุปเสียง
const MAX_SPEECH_CHARS = 1500;      // กันข้อความยาวเกินจนค่าใช้จ่ายพุ่ง

// สร้างข้อความที่จะอ่านจากผลตรวจ ให้สั้น ฟังง่าย
export function buildSpokenSummary(result) {
  const counts = result?.risk_counts ?? {};
  const lines = [
    `ผลการตรวจพบ ${counts.check_detail ?? 0} ประเด็นที่ควรตรวจละเอียด และ ${counts.caution ?? 0} ประเด็นที่ควรระวัง`,
  ];
  const titles = (result?.items ?? []).map(i => i.title).filter(Boolean).slice(0, 5);
  if (titles.length) lines.push('ประเด็นหลักได้แก่ ' + titles.join(' และ ') + ' กรุณาอ่านรายละเอียดในหน้าเว็บ');
  lines.push('ผลนี้เป็นการคัดกรองเบื้องต้น ควรให้ทนายตรวจก่อนลงนาม');
  return lines.join('。 ').slice(0, MAX_SPEECH_CHARS);
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
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
  });
  if (!res.ok) {
    // ไม่บันทึกเนื้อหาตอบกลับ เพื่อไม่ให้ข้อมูลส่วนตัวหรือคีย์หลุดไปใน log
    throw new Error(`ElevenLabs ตอบกลับสถานะ ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer()).toString('base64');
}
