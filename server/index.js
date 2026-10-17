// เซิร์ฟเวอร์เช็กสัญญา
// หน้าที่: ล็อกอินผู้ใช้ ตัดเครดิตตามบัญชี เรียก AI ตรวจ quote แล้วส่งผลกลับ
// ไฟล์ที่เกี่ยวข้อง: db.js (ฐานข้อมูล), auth.js (บัญชี), credits.js (เครดิต), ai.js (AI)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeContract, MAX_ITEMS_LIMIT } from './ai.js';
import { initDb } from './db.js';
import {
  validateCredentials,
  registerUser,
  loginUser,
  startSession,
  endSession,
  getUserFromRequest,
} from './auth.js';
import { getCredits, reserveCredit, refundCredit } from './credits.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const MAX_CHARS = 20000;

// อยู่หลัง proxy ของ Render จึงต้องบอก Express ให้รู้ว่าเป็น https (ใช้ตั้งคุกกี้แบบ Secure)
app.set('trust proxy', 1);
app.use(express.json({ limit: '200kb' }));

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

// ---------- บัญชีผู้ใช้ ----------

// ผู้ใช้ที่ล็อกอินอยู่ (หรือ 401 ถ้ายังไม่ได้ล็อกอิน)
app.get('/api/me', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
    res.json({ email: user.email, credits: user.credits });
  } catch (err) {
    console.error('[me] failed:', err.message);
    res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const problem = validateCredentials(email, password);
    if (problem) return res.status(400).json({ error: problem });

    const user = await registerUser(email, password);
    if (!user) return res.status(409).json({ error: 'อีเมลนี้มีบัญชีอยู่แล้ว' });

    await startSession(req, res, user.id);
    res.status(201).json({ email: user.email, credits: user.credits });
  } catch (err) {
    console.error('[signup] failed:', err.message);
    res.status(500).json({ error: 'สมัครไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const user = await loginUser(email, password);
    if (!user) return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    await startSession(req, res, user.id);
    res.json({ email: user.email, credits: user.credits });
  } catch (err) {
    console.error('[login] failed:', err.message);
    res.status(500).json({ error: 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.post('/api/logout', async (req, res) => {
  try {
    await endSession(req, res);
    res.json({ ok: true });
  } catch (err) {
    console.error('[logout] failed:', err.message);
    res.status(500).json({ error: 'ออกจากระบบไม่สำเร็จ' });
  }
});

// ---------- ตรวจสัญญา (ต้องล็อกอิน) ----------
app.post('/api/check', async (req, res) => {
  let user;
  try {
    user = await getUserFromRequest(req);
  } catch (err) {
    console.error('[check] session lookup failed:', err.message);
    return res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
  if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อนตรวจสัญญา' });

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) return res.status(400).json({ error: 'กรุณาวางข้อความสัญญาก่อน' });
  if (text.length > MAX_CHARS) {
    return res.status(413).json({ error: `ข้อความยาวเกิน ${MAX_CHARS} ตัวอักษร` });
  }

  // ตัดเครดิตก่อนเรียก AI
  let reserved;
  try {
    reserved = await reserveCredit(user.id);
  } catch (err) {
    console.error('[credits] reserve failed:', err.message);
    return res.status(500).json({ error: 'ระบบเครดิตมีปัญหา ลองใหม่อีกครั้ง' });
  }
  if (!reserved) return res.status(402).json({ error: 'เครดิตหมดแล้ว', credits: 0 });

  // เรียก AI และแปลงผล ถ้าขั้นนี้ล้มเหลวให้คืนเครดิต
  let result;
  try {
    const raw = await analyzeContract(text);
    result = cleanResult(raw, text);
  } catch (err) {
    console.error('[check] failed:', err.message);
    try {
      await refundCredit(user.id);
    } catch (refundErr) {
      console.error('[credits] refund failed:', refundErr.message);
    }
    const credits = await getCredits(user.id).catch(() => null);
    return res.status(502).json({
      error: 'เกิดข้อผิดพลาดระหว่างตรวจสัญญา เครดิตถูกคืนแล้ว ลองใหม่อีกครั้ง',
      credits,
    });
  }

  // ออกมาถึงตรงนี้แปลว่าตรวจสำเร็จ จึงไม่คืนเครดิตแม้การอ่านยอดจะพลาด
  const credits = await getCredits(user.id).catch(() => null);
  res.json({ ok: true, result, credits });
});

// ---------- หน้าเว็บ ----------
app.use(express.static(path.join(__dirname, '..', 'public')));

// เริ่มรับคำขอหลังเชื่อมฐานข้อมูลและสร้างตารางสำเร็จเท่านั้น
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[เช็กสัญญา] server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('[startup] เริ่มฐานข้อมูลไม่สำเร็จ:', err.message);
    process.exit(1);
  });
