// เซิร์ฟเวอร์เช็กสัญญา
// หน้าที่: ล็อกอินผู้ใช้ ตัดเครดิตตามบัญชี เรียก AI ตรวจ quote แล้วส่งผลกลับ
// ไฟล์ที่เกี่ยวข้อง: db.js (ฐานข้อมูล), auth.js (บัญชี), credits.js (เครดิต), ai.js (AI)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeContract, answerFollowup, transcribeImage, MAX_ITEMS_LIMIT, CONTRACT_TYPES } from './ai.js';
import { extractPdfText, extractDocxText } from './extract.js';
import { initDb } from './db.js';
import {
  validateCredentials,
  registerUser,
  loginUser,
  startSession,
  endSession,
  getUserFromRequest,
  findOrCreateGoogleUser,
  setUserAvatar,
} from './auth.js';
import { saveInspection, listInspections, getInspection, listPayments, deleteAllInspections, deleteInspection } from './history.js';
import {
  googleConfigured, makeState, buildAuthUrl, readCookieValue, exchangeCodeForProfile,
} from './googleAuth.js';
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
// ไฟล์อัปโหลดส่งเป็น base64 ใน JSON จึงให้ /api/extract รับขนาดใหญ่กว่าเส้นทางอื่น
app.use((req, res, next) => (
  req.path === '/api/extract' ? express.json({ limit: '8mb' }) : express.json({ limit: '200kb' })
)(req, res, next));

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
    detected_type: typeof raw?.detected_type === 'string' && CONTRACT_TYPES.has(raw.detected_type) ? raw.detected_type : 'unsure',
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
      avatar: user.avatar ?? null,
      voice_credits: await getVoiceCredits(user.id),
    });
  } catch (err) {
    console.error('[me] failed:', err.message);
    res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
});

// ----- ล็อกอินด้วย Google -----
const OAUTH_STATE_COOKIE = 'vc_oauth_state';
const CLEAR_STATE_COOKIE = `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

app.get('/api/auth/google', (req, res) => {
  if (!googleConfigured()) {
    return res.status(503).send('ยังไม่ได้ตั้งค่าการเข้าสู่ระบบด้วย Google');
  }
  const state = makeState();
  res.setHeader(
    'Set-Cookie',
    `${OAUTH_STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  res.redirect(buildAuthUrl(state));
});

app.get('/api/auth/google/callback', async (req, res) => {
  const fail = () => {
    res.append('Set-Cookie', CLEAR_STATE_COOKIE);
    res.redirect('/?google=error');
  };
  try {
    const { code, state, error } = req.query;
    const expected = readCookieValue(req, OAUTH_STATE_COOKIE);
    if (error || typeof code !== 'string' || typeof state !== 'string'
        || !expected || expected !== state) {
      return fail();
    }

    const profile = await exchangeCodeForProfile(code);
    const user = await findOrCreateGoogleUser(profile);
    if (!user) return fail();

    // startSession ตั้ง Set-Cookie ใหม่ จึงต้องล้างคุกกี้ state หลังจากนั้น
    await startSession(req, res, user.id);
    res.append('Set-Cookie', CLEAR_STATE_COOKIE);
    res.redirect('/');
  } catch (err) {
    console.error('[google] failed:', err.message);
    fail();
  }
});

// ----- ประวัติการใช้งาน -----
app.get('/api/history/inspections', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    res.json({ items: await listInspections(user.id) });
  } catch (err) {
    console.error('[history] list inspections failed:', err.message);
    res.status(500).json({ error: 'โหลดประวัติไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.get('/api/history/inspections/:id', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    const result = await getInspection(user.id, id);
    if (!result) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json({ result });
  } catch (err) {
    console.error('[history] get inspection failed:', err.message);
    res.status(500).json({ error: 'โหลดผลตรวจไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.get('/api/history/payments', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    res.json({ items: await listPayments(user.id) });
  } catch (err) {
    console.error('[history] list payments failed:', err.message);
    res.status(500).json({ error: 'โหลดประวัติไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// ----- ลบประวัติผลตรวจ -----
app.delete('/api/history/inspections', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const deleted = await deleteAllInspections(user.id);
    res.json({ ok: true, deleted });
  } catch (err) {
    console.error('[history] delete all failed:', err.message);
    res.status(500).json({ error: 'ลบประวัติไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.delete('/api/history/inspections/:id', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    const deleted = await deleteInspection(user.id, id);
    if (!deleted) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[history] delete failed:', err.message);
    res.status(500).json({ error: 'ลบรายการไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// ----- ถามต่อจากผลตรวจ (ฟรี แต่จำกัดจำนวนต่อชั่วโมง เพราะมีต้นทุน AI) -----
const FOLLOWUP_PER_HOUR = 15;
const FOLLOWUP_MAX_Q = 300;
const followupHits = new Map(); // userId -> { count, resetAt }

app.post('/api/followup', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });

    const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
    if (!question) return res.status(400).json({ error: 'กรุณาพิมพ์คำถาม' });
    if (question.length > FOLLOWUP_MAX_Q) {
      return res.status(413).json({ error: `คำถามยาวเกิน ${FOLLOWUP_MAX_Q} ตัวอักษร` });
    }
    // ผลตรวจที่ส่งมา: ตัดให้เหลือเฉพาะฟิลด์ที่ใช้ และจำกัดขนาด
    const r = req.body?.result;
    if (!r || typeof r !== 'object' || !Array.isArray(r.items)) {
      return res.status(400).json({ error: 'ไม่พบผลตรวจที่จะอ้างอิง' });
    }
    const pick = v => (typeof v === 'string' ? v.slice(0, 1200) : '');
    const context = JSON.stringify({
      summary: { job: pick(r.summary?.job), money: pick(r.summary?.money), time: pick(r.summary?.time) },
      items: r.items.slice(0, MAX_ITEMS_LIMIT).map(it => ({
        level: pick(it?.level), title: pick(it?.title), quote: pick(it?.quote),
        explanation: pick(it?.explanation), reference: pick(it?.reference),
        suggested_fix: pick(it?.suggested_fix), how_to_negotiate: pick(it?.how_to_negotiate),
      })),
      missing_info: (Array.isArray(r.missing_info) ? r.missing_info : []).slice(0, 10).map(pick),
    });

    const now = Date.now();
    let hit = followupHits.get(user.id);
    if (!hit || hit.resetAt <= now) hit = { count: 0, resetAt: now + 60 * 60 * 1000 };
    if (hit.count >= FOLLOWUP_PER_HOUR) {
      return res.status(429).json({ error: 'ถามต่อได้ชั่วโมงละ ' + FOLLOWUP_PER_HOUR + ' ครั้ง รออีกสักครู่แล้วลองใหม่' });
    }
    hit.count += 1;
    followupHits.set(user.id, hit);

    try {
      const answer = await answerFollowup(question, context);
      res.json({ ok: true, answer });
    } catch (err) {
      hit.count -= 1; // ล้มเหลวไม่นับโควตา
      console.error('[followup] failed:', err.message);
      res.status(502).json({ error: 'ตอบไม่สำเร็จ ลองใหม่อีกครั้ง' });
    }
  } catch (err) {
    console.error('[followup] error:', err.message);
    res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
});

// ----- รูปโปรไฟล์ -----
const AVATAR_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const AVATAR_MAX_CHARS = 200000;

app.post('/api/me/avatar', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const image = req.body?.image;
    if (typeof image !== 'string' || image.length > AVATAR_MAX_CHARS || !AVATAR_PATTERN.test(image)) {
      return res.status(400).json({ error: 'รูปไม่ถูกต้องหรือใหญ่เกินไป' });
    }
    const avatar = await setUserAvatar(user.id, image);
    res.json({ avatar });
  } catch (err) {
    console.error('[avatar] save failed:', err.message);
    res.status(500).json({ error: 'บันทึกรูปไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.delete('/api/me/avatar', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    await setUserAvatar(user.id, null);
    res.json({ avatar: null });
  } catch (err) {
    console.error('[avatar] delete failed:', err.message);
    res.status(500).json({ error: 'ลบรูปไม่สำเร็จ ลองใหม่อีกครั้ง' });
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

  // ประเภทสัญญา: ค่าที่ไม่รู้จักหรือไม่ได้ส่งมาจะถือว่า "unsure" ไม่ทำให้คำขอล้มเหลว
  const contractType = CONTRACT_TYPES.has(req.body?.contractType) ? req.body.contractType : 'unsure';

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
    const raw = await analyzeContract(text, contractType);
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
  // บันทึกผลตรวจไว้ดูย้อนหลัง ถ้าบันทึกไม่สำเร็จไม่กระทบผลที่ส่งให้ผู้ใช้
  saveInspection(user.id, contractType, result)
    .catch(e => console.error('[history] save failed:', e.message));
  res.json({ ok: true, result, credits, voiceCredits, audio, voiceError });
});

// ---------- อัปโหลดไฟล์ ----------
const EXTRACT_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

app.post('/api/extract', async (req, res) => {
  let user;
  try {
    user = await getUserFromRequest(req);
  } catch (err) {
    console.error('[extract] session lookup failed:', err.message);
    return res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
  if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อนอัปโหลดไฟล์' });

  const name = typeof req.body?.name === 'string' ? req.body.name : '';
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  const isPdf = ext === 'pdf';
  const isDocx = ext === 'docx';
  const imageType = IMAGE_TYPES[ext];
  if (!isPdf && !isDocx && !imageType) {
    return res.status(400).json({ error: 'รองรับไฟล์ PDF, Word (.docx) และรูปภาพ JPG, PNG, WEBP' });
  }

  const data = typeof req.body?.data === 'string' ? req.body.data.replace(/^data:[^,]*,/, '') : '';
  const buffer = Buffer.from(data, 'base64');
  if (buffer.length === 0) return res.status(400).json({ error: 'ไม่พบไฟล์' });
  if (buffer.length > EXTRACT_MAX_BYTES) {
    return res.status(413).json({ error: 'ไฟล์ต้องมีขนาดไม่เกิน 5 MB' });
  }

  // รูปภาพใช้ AI อ่าน จึงหักเครดิตตรวจ 1 ครั้ง และคืนถ้าอ่านไม่สำเร็จ
  let reserved = false;
  let text = '';
  try {
    if (isPdf) {
      text = await extractPdfText(buffer);
    } else if (isDocx) {
      text = await extractDocxText(buffer);
    } else {
      reserved = await reserveCredits(user.id, 1);
      if (!reserved) {
        const credits = await getCredits(user.id).catch(() => 0);
        return res.status(402).json({ error: 'เครดิตตรวจสัญญาหมดแล้ว กรุณาซื้อแพ็กตรวจสัญญา', credits });
      }
      text = await transcribeImage(buffer.toString('base64'), imageType);
    }
  } catch (err) {
    console.error('[extract] failed:', err.message);
    if (reserved) await refundCredits(user.id, 1).catch(e => console.error('[credits] refund failed:', e.message));
    return res.status(502).json({ error: 'อ่านไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง หรือใช้ไฟล์อื่น' });
  }

  text = String(text || '').replace(/\r\n/g, '\n').trim();
  console.log(`[extract] ext=${ext} bytes=${buffer.length} chars=${text.length}`);
  if (!text) {
    if (reserved) await refundCredits(user.id, 1).catch(() => {});
    const hint = isPdf
      ? 'ไฟล์ PDF นี้ไม่มีข้อความให้อ่าน (อาจเป็นไฟล์สแกนเป็นภาพ) ลองใช้ไฟล์ที่พิมพ์จากระบบ หรือถ่ายรูปแทน'
      : isDocx
        ? 'ไฟล์ Word นี้ไม่มีข้อความให้อ่าน ลองบันทึกใหม่เป็น .docx หรือคัดลอกข้อความมาวางแทน'
        : 'AI อ่านข้อความจากรูปนี้ไม่ได้ ลองถ่ายใหม่ให้ชัดและเห็นเนื้อหาครบทั้งหน้า';
    return res.status(422).json({ error: hint });
  }
  if (text.length > MAX_CHARS) {
    if (reserved) await refundCredits(user.id, 1).catch(() => {});
    return res.status(413).json({ error: `ข้อความในไฟล์ยาวเกิน ${MAX_CHARS} ตัวอักษร` });
  }

  const credits = await getCredits(user.id).catch(() => null);
  const voiceCredits = await getVoiceCredits(user.id).catch(() => null);
  res.json({ ok: true, text, credits, voiceCredits });
});

// ---------- หน้าเว็บ ----------
// ไฟล์หน้าเว็บให้เบราว์เซอร์ตรวจกับเซิร์ฟเวอร์ทุกครั้ง เพื่อไม่ให้ค้างเวอร์ชันเก่าในมือถือ
app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache'),
}));

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
