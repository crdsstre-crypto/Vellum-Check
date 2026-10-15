
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeContract } from './ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = process.env.PORT || 3000;
const FREE_CREDITS = Number(process.env.FREE_CREDITS ?? 3);
const MAX_CHARS = 20000;

app.use(express.json({ limit: '200kb' }));

// ---------- CORS (ใช้เมื่อเรียกจากโดเมนอื่น ปกติหน้าเว็บอยู่โดเมนเดียวกันจึงไม่ต้องใช้) ----------
app.use((req, res, next) => {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-Id');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
  }
  next();
});

// ---------- เครดิต ----------
// ⚠️ เก็บในหน่วยความจำ: รีสตาร์ตแล้วหาย และ Render free tier รีสตาร์ตบ่อย
// ⚠️ ระบุตัวผู้ใช้ด้วย X-Device-Id ซึ่งผู้ใช้แก้ได้ จึงยังไม่ปลอดภัยสำหรับเงินจริง
// ต้องเปลี่ยนเป็น Postgres และระบบล็อกอินก่อนเปิดให้ใช้จริง
const balances = new Map();

function getBalance(id) {
  if (!balances.has(id)) balances.set(id, FREE_CREDITS);
  return balances.get(id);
}

// การอ่านและเขียนใน Node เป็นแบบ synchronous ภายในโปรเซสเดียว จึงไม่แทรกกลางได้
function reserveCredit(id) {
  const b = getBalance(id);
  if (b < 1) return false;
  balances.set(id, b - 1);
  return true;
}

function refundCredit(id) {
  balances.set(id, getBalance(id) + 1);
}

function getDeviceId(req) {
  const id = req.get('X-Device-Id') || '';
  return /^[A-Za-z0-9_-]{8,100}$/.test(id) ? id : null;
}

// ---------- ตรวจผลจาก AI ----------
const LEVELS = new Set(['check_detail', 'caution', 'low']);

// ตัดช่องว่างทั้งหมดก่อนเทียบ เพื่อกันปัญหาการขึ้นบรรทัดใหม่ต่างกัน
const squash = s => s.replace(/\s+/g, '');
const str = v => (typeof v === 'string' ? v.slice(0, 1000) : '');

function cleanResult(raw, sourceText) {
  const normSource = squash(sourceText);
  const rawItems = Array.isArray(raw?.items) ? raw.items.slice(0, 20) : [];

  const items = rawItems.map((it, i) => {
    const quote = str(it?.quote).trim();
    // ถ้า quote ไม่มีอยู่ในสัญญาจริง ให้ติดป้ายว่าไม่พบ ไม่เชื่อ AI อย่างเดียว
    const found = quote.length > 0 && normSource.includes(squash(quote));

    return {
      id: i + 1,
      level: LEVELS.has(it?.level) ? it.level : 'caution',
      title: str(it?.title),
      quote,
      explanation: str(it?.explanation),
      reference: str(it?.reference),
      suggested_fix: str(it?.suggested_fix),
      how_to_negotiate: str(it?.how_to_negotiate),
      missing: !found,
    };
  });

  const counts = { check_detail: 0, caution: 0, low: 0 };
  items.forEach(it => counts[it.level]++);

  return {
    summary: {
      job: str(raw?.summary?.job),
      money: str(raw?.summary?.money),
      time: str(raw?.summary?.time),
    },
    risk_counts: counts,
    items,
    missing_info: Array.isArray(raw?.missing_info)
      ? raw.missing_info.filter(x => typeof x === 'string').slice(0, 20)
      : [],
  };
}

// ---------- API ----------
app.get('/api/me', (req, res) => {
  const id = getDeviceId(req);
  if (!id) return res.status(400).json({ error: 'missing or invalid device id' });
  res.json({ credits: getBalance(id) });
});

app.post('/api/check', async (req, res) => {
  const id = getDeviceId(req);
  if (!id) return res.status(400).json({ error: 'missing or invalid device id' });

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) return res.status(400).json({ error: 'กรุณาวางข้อความสัญญาก่อน' });
  if (text.length > MAX_CHARS) {
    return res.status(413).json({ error: `ข้อความยาวเกิน ${MAX_CHARS} ตัวอักษร` });
  }

  // ตัดเครดิตก่อนเรียก AI
  if (!reserveCredit(id)) {
    return res.status(402).json({ error: 'เครดิตหมดแล้ว', credits: 0 });
  }

  try {
    const raw = await analyzeContract(text);
    const result = cleanResult(raw, text);
    res.json({ ok: true, result, credits: getBalance(id) });
  } catch (err) {
    // AI ล้มเหลวหรือ JSON ผิดรูปแบบ คืนเครดิตให้ผู้ใช้
    refundCredit(id);
    console.error('[check] failed:', err.message);
    res.status(502).json({
      error: 'เกิดข้อผิดพลาดระหว่างตรวจสัญญา เครดิตถูกคืนแล้ว ลองใหม่อีกครั้ง',
      credits: getBalance(id),
    });
  }
});

// ---------- หน้าเว็บ ----------
// หลังย้ายไฟล์เข้า public/ แล้วเท่านั้น
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`[เช็กสัญญา] server running on port ${PORT}`);
});
