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
import { pool } from './db.js';
const EL = 'https://api.elevenlabs.io/v1';
let voiceCache = null, voiceAt = 0, lastSource = '', lastErr = '';
export function voiceSource() { return lastSource; }
const FALLBACK = [   // เสียงฝรั่งพูดไทยจะฟังคล้ายกัน เลือกเฉพาะ 4 เสียงที่ต่างกันที่สุด
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'ผู้หญิง' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'ผู้ชาย' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'ผู้หญิง' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'ผู้ชาย' },
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
      // รูปแบบ "id:ชื่อ:เพศ:คำอธิบาย" เช่น "abc123:Ohm:ชาย:เสียงเล่าเรื่อง อธิบายชัด" (เพศ/คำอธิบายใส่หรือไม่ก็ได้)
      const [id, name = '', g = '', ...d] = x.split(':').map(y => y.trim());
      const gender = /หญิง|female|^f$|^w$/i.test(g) ? 'ผู้หญิง' : /ชาย|male|^m$/i.test(g) ? 'ผู้ชาย' : '';
      return { id, name: name || 'เสียง', gender, desc: d.join(':').slice(0, 80) };
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

// ตัวอย่างเสียง: ประโยคแบบเดียวกับสรุปจริง ยาวพอให้ฟังออก (~8 วินาที)
// สร้างครั้งเดียวต่อเสียง เก็บในฐานข้อมูล (รีสตาร์ตไม่ต้องสร้างใหม่) และสร้างล่วงหน้าทุกเสียงตอนเซิร์ฟเวอร์เปิด ลูกค้ากดแล้วได้ยินทันที
const PREVIEW_V = 3;   // เปลี่ยนประโยคตัวอย่างเมื่อไรให้เพิ่มเลขนี้ จะสร้างใหม่ทั้งหมด
function previewText(v) {
  const end = v?.gender === 'ผู้หญิง' ? 'ค่ะ' : v?.gender === 'ผู้ชาย' ? 'ครับ' : '';
  return `สวัสดี${end} นี่คือเสียงสรุปผลตรวจสัญญาจาก Vellum Check. พบ 3 ประเด็นที่ควรตรวจ ได้แก่ ค่าปรับวันละ 500 บาท สูงเกินสมควร, ผู้ให้เช่าขึ้นค่าเช่าได้ตลอด และเงินประกันไม่คืนทุกกรณี`;
}
let pvTable = null;
function pvReady() {
  if (!pvTable) pvTable = pool.query('CREATE TABLE IF NOT EXISTS voice_previews (id TEXT NOT NULL, v INTEGER NOT NULL, audio BYTEA NOT NULL, PRIMARY KEY (id, v))').catch(e => { pvTable = null; throw e; });
  return pvTable;
}
const pkey = id => id + '|' + (process.env.ELEVENLABS_MODEL || 'eleven_v3');   // เปลี่ยนโมเดลเสียง = สร้างตัวอย่างใหม่
const previews = new Map();
export async function voicePreview(id) {
  if (previews.has(id)) return previews.get(id);
  const p = (async () => {
    try {
      await pvReady();
      const r = await pool.query('SELECT audio FROM voice_previews WHERE id = $1 AND v = $2', [pkey(id), PREVIEW_V]);
      if (r.rows[0]) return r.rows[0].audio;
    } catch (e) { console.error('[voice] preview db read:', e.message); }
    const v = (await listVoices()).find(x => x.id === id);
    const buf = Buffer.from(await synthesizeSpeech(previewText(v), id), 'base64');
    pool.query('INSERT INTO voice_previews (id, v, audio) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [pkey(id), PREVIEW_V, buf])
      .catch(e => console.error('[voice] preview db write:', e.message));
    return buf;
  })();
  previews.set(id, p);
  p.catch(() => previews.delete(id));
  return p;
}
// สร้างตัวอย่างทุกเสียงไว้ล่วงหน้า (ทีละเสียง ไม่รบกวนงานอื่น)
export async function warmPreviews() {
  try { for (const v of await listVoices()) await voicePreview(v.id).catch(e => console.error('[voice] warm', v.name, e.message)); }
  catch (e) { console.error('[voice] warm:', e.message); }
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
    body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL || 'eleven_v3' }),
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
