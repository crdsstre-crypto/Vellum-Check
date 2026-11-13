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

// ===== ให้ลูกค้าเลือกเสียงได้ =====
// รายการเสียง: ถ้าตั้ง ELEVENLABS_VOICES (เช่น "id1:น้ำฝน,id2:ธนา") ใช้ตามนั้น
// ถ้าไม่ตั้ง ดึงจาก "My Voices" ในบัญชี ElevenLabs เอง (เสียงที่กด Add จาก Voice Library หรือโคลนไว้)
// ไม่เอาเสียง Default เพราะ ElevenLabs จะปิดเสียงกลุ่มนี้สิ้นปี 2026 · เสียงใน ELEVENLABS_VOICE_ID อยู่ในรายการเสมอเป็นค่าเริ่มต้น
const EL = 'https://api.elevenlabs.io/v1';
let voiceCache = null, voiceAt = 0, lastSource = '', lastErr = '';
export function voiceSource() { return lastSource; }
const FALLBACK = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'ผู้หญิง' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'ผู้ชาย' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'ผู้หญิง' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', gender: 'ผู้ชาย' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'ผู้หญิง' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'ผู้ชาย' },
];
const GENDER = { female: 'ผู้หญิง', male: 'ผู้ชาย' };
function shortName(n) { return String(n || '').split(/\s+[-–|]\s+/)[0].trim().slice(0, 24) || 'เสียง'; }

export async function listVoices() {
  if (voiceCache && Date.now() - voiceAt < 10 * 60 * 1000) return voiceCache;
  const def = process.env.ELEVENLABS_VOICE_ID || '';
  let out = [], bad = false;
  const env = String(process.env.ELEVENLABS_VOICES || '').trim();
  if (env) {
    out = env.split(',').map(x => x.trim()).filter(Boolean).map(x => {
      const [id, ...rest] = x.split(':');
      return { id: id.trim(), name: rest.join(':').trim() || 'เสียง', gender: '' };
    });
  } else if (process.env.ELEVENLABS_API_KEY) {
    try {
      const r = await fetch(`${EL}/voices`, { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, signal: AbortSignal.timeout(10000) });
      if (r.ok) {
        const d = await r.json();
        const map = v => ({ id: v.voice_id, name: shortName(v.name), gender: GENDER[String(v.labels?.gender || '').toLowerCase()] || '' });
        const all = d.voices || [];
        out = all.filter(v => v.category !== 'premade' || v.voice_id === def).map(map);
        // ยังมีเสียงของตัวเองไม่ถึง 2 เสียง → ใช้เสียง Default ของ ElevenLabs ไปก่อน (ใช้ได้ถึงสิ้นปี 2026 แล้วหายเอง)
        if (out.length < 2 && Date.now() < Date.UTC(2027, 0, 1)) {
          const pref = ['Sarah', 'George', 'Matilda', 'Will', 'Jessica', 'Brian'];
          const pre = all.filter(v => v.category === 'premade' && v.voice_id !== def)
            .sort((a, b) => ((pref.indexOf(shortName(a.name)) + 99) % 99) - ((pref.indexOf(shortName(b.name)) + 99) % 99))
            .map(map);
          // สลับหญิง/ชาย ให้มีให้เลือกทั้งสองแบบ
          const f = pre.filter(v => v.gender === 'ผู้หญิง'), m = pre.filter(v => v.gender !== 'ผู้หญิง'), mix = [];
          for (let i = 0; mix.length < 6 && (i < f.length || i < m.length); i++) { if (f[i]) mix.push(f[i]); if (m[i] && mix.length < 6) mix.push(m[i]); }
          out = out.concat(mix);
        }
      } else { console.error('[voice] list voices status', r.status); bad = true; lastErr = 'status ' + r.status; }
    } catch (e) { console.error('[voice] list voices:', e.message); bad = true; lastErr = e.message.slice(0, 60); }
  }
  // คีย์ ElevenLabs บางแบบไม่มีสิทธิ์อ่านรายการเสียง (voices_read) → ใช้รายการเสียง Default ที่รู้จักแทน (ใช้ได้ถึงสิ้นปี 2026)
  if (!env && out.length < 2 && Date.now() < Date.UTC(2027, 0, 1)) {
    lastSource = bad ? 'fallback (list failed: ' + lastErr + ')' : 'fallback';
    for (const v of FALLBACK) if (out.length < 7 && v.id !== def && !out.some(x => x.id === v.id)) out.push(v);
  } else lastSource = env ? 'env' : 'account';
  if (def && !out.some(v => v.id === def)) out.unshift({ id: def, name: 'เสียงหลัก', gender: '' });
  out.sort((a, b) => (b.id === def) - (a.id === def));
  out = out.filter(v => /^[A-Za-z0-9]{8,40}$/.test(v.id)).slice(0, 8);
  voiceCache = out; voiceAt = bad ? Date.now() - 9.5 * 60 * 1000 : Date.now();   // ดึงไม่สำเร็จ → ลองใหม่ใน 30 วินาที
  return out;
}
export async function pickVoice(id) {
  const list = await listVoices();
  return list.some(v => v.id === id) ? id : (process.env.ELEVENLABS_VOICE_ID || list[0]?.id || '');
}

// ตัวอย่างเสียง: สร้างครั้งเดียวต่อเสียงแล้วจำไว้ (ประโยคสั้น เสียค่า ElevenLabs ไม่กี่สิบตัวอักษร)
const PREVIEW_TEXT = 'สวัสดีครับ นี่คือตัวอย่างเสียงสรุปผลตรวจสัญญา';
const previews = new Map();
export async function voicePreview(id) {
  if (previews.has(id)) return previews.get(id);
  const p = synthesizeSpeech(PREVIEW_TEXT, id).then(b64 => Buffer.from(b64, 'base64'));
  previews.set(id, p);
  p.catch(() => previews.delete(id));
  return p;
}

// คืนค่าเป็น base64 ของไฟล์ mp3
export async function synthesizeSpeech(text, chosenVoice) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = chosenVoice || process.env.ELEVENLABS_VOICE_ID;
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
