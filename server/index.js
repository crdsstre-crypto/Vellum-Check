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
import {
  getCredits, reserveCredits, refundCredits,
  getVoiceCredits, reserveVoiceCredits, refundVoiceCredits,
} from './credits.js';
import { isBlocked, recordFailure, clearFailures } from './rateLimit.js';
import { buildSpokenSummary, synthesizeSpeech, VOICE_CREDIT_COST } from './voice.js';
import { createPromptPayPayment, confirmAndCredit, PACKAGES } from './payments.js';

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
    res.json({
      email: user.email,
      credits: user.credits,
      voice_credits: await getVoiceCredits(user.id),
    });
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

    // นับตามทั้งอีเมลและ IP ตรวจก่อนเทียบรหัสผ่าน เพื่อไม่ต้องเสียเวลา hash ตอนถูกบล็อก
    const emailKey = `email:${email.trim().toLowerCase().slice(0, 254)}`;
    const keys = [emailKey, `ip:${req.ip}`];
    if (isBlocked(keys)) {
      return res.status(429).json({
        error: 'ล็อกอินผิดหลายครั้ง กรุณารอ 15 นาทีแล้วลองใหม่',
      });
    }

    const user = await loginUser(email, password);
    if (!user) {
      recordFailure(keys);
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ล็อกอินสำเร็จ ล้างการนับของอีเมลนี้ (การนับของ IP ยังคงอยู่)
    clearFailures([emailKey]);
    await startSession(req, res, user.id);
    res.json({ email: user.email, credits: user.credits });
  } catch (err) {
    console.error('[login] failed:', err.message);
    res.status(500).json({ error: 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// สร้างรายการชำระเงิน PromptPay สำหรับเติมเครดิต (ต้องล็อกอินก่อน)
app.post('/api/payments/promptpay', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });

    const packageId = req.body?.packageId;
    if (typeof packageId !== 'string' || !PACKAGES[packageId]) {
      return res.status(400).json({ error: 'แพ็กเกจไม่ถูกต้อง' });
    }

    const payment = await createPromptPayPayment(user.id, packageId);
    res.json(payment);
  } catch (err) {
    // บันทึกเฉพาะข้อความผิดพลาด ห้ามบันทึกคีย์หรือข้อมูลการชำระ
    console.error('[payment] สร้างรายการ PromptPay ไม่สำเร็จ:', err.message);
    res.status(500).json({ error: 'สร้างรายการชำระเงินไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// รับการแจ้งเหตุการณ์จาก Omise (ไม่ต้องล็อกอิน เพราะ Omise เป็นผู้เรียก)
// ความปลอดภัย: เราดึงสถานะการชำระจาก Omise ด้วยคีย์ลับเองทุกครั้ง จึงไม่เชื่อข้อมูลในคำขอนี้
app.post('/api/omise/webhook', async (req, res) => {
  const event = req.body ?? {};

  // สนใจเฉพาะเหตุการณ์ charge.complete ที่เกี่ยวกับ charge เท่านั้น เหตุการณ์อื่นตอบ 200 เพื่อไม่ให้ Omise ส่งซ้ำ
  if (event.key !== 'charge.complete' || event.data?.object !== 'charge' || typeof event.data?.id !== 'string') {
    return res.sendStatus(200);
  }

  try {
    const { result } = await confirmAndCredit(event.data.id);
    console.log(`[payment] webhook ${event.data.id}: ${result}`);
    res.sendStatus(200);
  } catch (err) {
    // ตอบ 500 เพื่อให้ Omise ลองส่งอีกครั้ง
    console.error('[payment] webhook ผิดพลาด:', err.message);
    res.sendStatus(500);
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

  // ยอดแยกกัน: ตรวจ 1 ครั้งหักจากยอดตรวจ และถ้าขอเสียงหักจากยอดเสียงเพิ่ม
  const wantVoice = req.body?.voice === true;

  // 1) หักยอดตรวจก่อนเรียก AI
  let reserved;
  try {
    reserved = await reserveCredits(user.id, 1);
  } catch (err) {
    console.error('[credits] reserve failed:', err.message);
    return res.status(500).json({ error: 'ระบบเครดิตมีปัญหา ลองใหม่อีกครั้ง' });
  }
  if (!reserved) {
    const credits = await getCredits(user.id).catch(() => 0);
    return res.status(402).json({ error: 'เครดิตตรวจสัญญาหมดแล้ว กรุณาซื้อแพ็กตรวจสัญญา', credits });
  }

  // 2) ถ้าขอเสียง หักยอดเสียง ถ้าไม่พอให้คืนยอดตรวจที่หักไปแล้ว
  if (wantVoice) {
    let voiceOk;
    try {
      voiceOk = await reserveVoiceCredits(user.id, VOICE_CREDIT_COST);
    } catch (err) {
      console.error('[credits] voice reserve failed:', err.message);
      await refundCredits(user.id, 1).catch(() => {});
      return res.status(500).json({ error: 'ระบบเครดิตมีปัญหา ลองใหม่อีกครั้ง' });
    }
    if (!voiceOk) {
      await refundCredits(user.id, 1).catch(() => {});
      const credits = await getCredits(user.id).catch(() => null);
      const voiceCredits = await getVoiceCredits(user.id).catch(() => null);
      return res.status(402).json({ error: 'เครดิตเสียงสรุปไม่พอ กรุณาซื้อแพ็กสรุปเสียง', credits, voiceCredits });
    }
  }

  // 3) เรียก AI ถ้าล้มเหลวคืนยอดทั้งหมดที่หักไป
  let result;
  try {
    const raw = await analyzeContract(text);
    result = cleanResult(raw, text);
  } catch (err) {
    console.error('[check] failed:', err.message);
    await refundCredits(user.id, 1).catch(e => console.error('[credits] refund failed:', e.message));
    if (wantVoice) {
      await refundVoiceCredits(user.id, VOICE_CREDIT_COST).catch(e => console.error('[credits] voice refund failed:', e.message));
    }
    const credits = await getCredits(user.id).catch(() => null);
    const voiceCredits = await getVoiceCredits(user.id).catch(() => null);
    return res.status(502).json({
      error: 'เกิดข้อผิดพลาดระหว่างตรวจสัญญา ยอดถูกคืนแล้ว ลองใหม่อีกครั้ง',
      credits,
      voiceCredits,
    });
  }

  // 4) สร้างเสียงสรุป ถ้าล้มเหลวคืนเฉพาะยอดเสียง ผลการตรวจยังส่งให้ตามปกติ
  let audio = null;
  let voiceError = null;
  if (wantVoice) {
    try {
      audio = await synthesizeSpeech(buildSpokenSummary(result));
    } catch (err) {
      console.error('[voice] failed:', err.message);
      await refundVoiceCredits(user.id, VOICE_CREDIT_COST)
        .catch(e => console.error('[credits] voice refund failed:', e.message));
      voiceError = 'สร้างเสียงสรุปไม่สำเร็จ ยอดเสียงถูกคืนแล้ว';
    }
  }

  const credits = await getCredits(user.id).catch(() => null);
  const voiceCredits = await getVoiceCredits(user.id).catch(() => null);
  res.json({ ok: true, result, credits, voiceCredits, audio, voiceError });
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
