// เซิร์ฟเวอร์เช็กสัญญา
// หน้าที่ของไฟล์นี้: รับคำขอ ตรวจเครดิต เรียก AI ตรวจ quote แล้วส่งผลกลับ
// เครดิตอยู่ใน credits.js และการเรียก AI อยู่ใน ai.js

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeContract, MAX_ITEMS_LIMIT } from './ai.js';
import { initCredits, getBalance, reserveCredit, refundCredit } from './credits.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = process.env.PORT || 3000;
const MAX_CHARS = 20000;

app.use(express.json({ limit: '200kb' }));

// ---------- CORS: ใช้เมื่อเรียกจากโดเมนอื่น ปกติหน้าเว็บอยู่โดเมนเดียวกันจึงไม่ต้องตั้ง ----------
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

// รหัสเครื่องต้องเป็นตัวอักษร ตัวเลข _ หรือ - ยาว 8–100 ตัว
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
  const rawItems = Array.isArray(raw?.items) ? raw.items.slice(0, MAX_ITEMS_LIMIT) : [];

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

app.get('/api/me', async (req, res) => {
  const id = getDeviceId(req);
  if (!id) return res.status(400).json({ error: 'missing or invalid device id' });

  try {
    res.json({ credits: await getBalance(id) });
  } catch (err) {
    console.error('[me] failed:', err.message);
    res.status(500).json({ error: 'อ่านข้อมูลเครดิตไม่ได้ ลองใหม่อีกครั้ง' });
  }
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
  let reserved;
  try {
    reserved = await reserveCredit(id);
  } catch (err) {
    console.error('[credits] reserve failed:', err.message);
    return res.status(500).json({ error: 'ระบบเครดิตมีปัญหา ลองใหม่อีกครั้ง' });
  }
  if (!reserved) {
    return res.status(402).json({ error: 'เครดิตหมดแล้ว', credits: 0 });
  }

  try {
    const raw = await analyzeContract(text);
    const result = cleanResult(raw, text);
    const credits = await getBalance(id);
    res.json({ ok: true, result, credits });
  } catch (err) {
    // AI ล้มเหลว หรือ JSON ผิดรูปแบบ หรือคำตอบถูกตัด: คืนเครดิตให้ผู้ใช้
    console.error('[check] failed:', err.message);
    try {
      await refundCredit(id);
    } catch (refundErr) {
      console.error('[credits] refund failed:', refundErr.message);
    }

    let credits = null;
    try {
      credits = await getBalance(id);
    } catch {
      // ไม่ต้องทำอะไร ส่ง credits เป็น null ไป
    }

    res.status(502).json({
      error: 'เกิดข้อผิดพลาดระหว่างตรวจสัญญา เครดิตถูกคืนแล้ว ลองใหม่อีกครั้ง',
      credits,
    });
  }
});

// ---------- หน้าเว็บ ----------
app.use(express.static(path.join(__dirname, '..', 'public')));

// เริ่มรับคำขอหลังเชื่อมฐานข้อมูลสำเร็จเท่านั้น ถ้าเชื่อมไม่ได้ให้หยุดและแสดง error ใน Logs
initCredits()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[เช็กสัญญา] server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('[startup] เริ่มระบบเครดิตไม่สำเร็จ:', err.message);
    process.exit(1);
  });
