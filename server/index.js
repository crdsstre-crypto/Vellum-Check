// เซิร์ฟเวอร์เช็กสัญญา
// หน้าที่: ล็อกอินผู้ใช้ ตัดเครดิตตามบัญชี เรียก AI ตรวจ quote แล้วส่งผลกลับ
// ไฟล์ที่เกี่ยวข้อง: db.js (ฐานข้อมูล), auth.js (บัญชี), credits.js (เครดิต), ai.js (AI)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeContract, answerFollowup, transcribeImage, MAX_ITEMS_LIMIT, CONTRACT_TYPES } from './ai.js';
import { extractPdfText, extractDocxText } from './extract.js';
import { initDb, pool } from './db.js';
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
import { saveInspection, listInspections, getInspection, listPayments, deleteAllInspections, deleteInspection, updateInspection } from './history.js';
import {
  googleConfigured, makeState, buildAuthUrl, readCookieValue, exchangeCodeForProfile,
} from './googleAuth.js';
import {
  getCredits, reserveCredits, refundCredits,
  getVoiceCredits, reserveVoiceCredits, refundVoiceCredits,
} from './credits.js';
import { isBlocked, recordFailure, clearFailures } from './rateLimit.js';
import { buildSpokenSummary, synthesizeSpeech, VOICE_CREDIT_COST } from './voice.js';
import { createPromptPayPayment, confirmAndCredit, getPaymentStatus, PACKAGES } from './payments.js';
import { logCheck, saveFeedback, adminStats, FEEDBACK_REASONS } from './stats.js';
import { listReminders, addReminders, updateReminder, deleteReminder, cleanReminder, buildIcs, MAX_BATCH, MAX_REMINDERS } from './reminders.js';

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
const URGENCIES = new Set(['before_sign', 'before_pay', 'before_deadline', 'monitor']);

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
      topic: str(it?.topic).slice(0, 30),
      quote,
      explanation: str(it?.explanation),
      reference: str(it?.reference),
      suggested_fix: str(it?.suggested_fix),
      how_to_negotiate: str(it?.how_to_negotiate),
      impact: str(it?.impact).slice(0, 300),
      urgency: URGENCIES.has(it?.urgency) ? it.urgency : 'monitor',
      urgency_note: str(it?.urgency_note).slice(0, 300),
      uncertainty: str(it?.uncertainty).slice(0, 300),
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

// ---------- แอดมิน ----------
// อีเมลแอดมินตั้งได้ใน Render ด้วยตัวแปร ADMIN_EMAILS (คั่นด้วยจุลภาค) ถ้าไม่ตั้งจะใช้ค่าเริ่มต้นด้านล่าง
// อีเมลในระบบไม่ซ้ำกัน (UNIQUE) คนอื่นจึงสมัครด้วยอีเมลนี้ซ้ำไม่ได้
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || 'crdsstre@gmail.com').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
);
const isAdmin = user => !!user && ADMIN_EMAILS.has(String(user.email || '').toLowerCase());

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
      is_admin: isAdmin(user),
    });
  } catch (err) {
    console.error('[me] failed:', err.message);
    res.status(500).json({ error: 'ระบบมีปัญหา ลองใหม่อีกครั้ง' });
  }
});

// แอดมินเพิ่ม/ลดเครดิตให้บัญชีใดก็ได้ (ใส่อีเมล) — ยอดไม่ติดลบ และบันทึกประวัติไว้ในตาราง admin_grants
app.post('/api/admin/credits', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
    if (!isAdmin(user)) return res.status(403).json({ error: 'บัญชีนี้ไม่มีสิทธิ์แอดมิน' });
    const email = String(req.body?.email || user.email).trim().toLowerCase();
    const toInt = v => (Number.isInteger(Number(v)) ? Number(v) : NaN);
    const dCheck = toInt(req.body?.check ?? 0), dVoice = toInt(req.body?.voice ?? 0);
    if (!email || Number.isNaN(dCheck) || Number.isNaN(dVoice) || Math.abs(dCheck) > 1000 || Math.abs(dVoice) > 1000) {
      return res.status(400).json({ error: 'ใส่จำนวนเป็นเลขจำนวนเต็มระหว่าง -1000 ถึง 1000' });
    }
    if (!dCheck && !dVoice) return res.status(400).json({ error: 'ใส่จำนวนเครดิตที่ต้องการเพิ่มก่อน' });
    const { rows } = await pool.query(
      `UPDATE users SET credits = GREATEST(0, credits + $2), voice_credits = GREATEST(0, voice_credits + $3)
        WHERE email = $1 RETURNING id, email, credits, voice_credits`,
      [email, dCheck, dVoice]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบบัญชีอีเมลนี้' });
    await pool.query(
      'INSERT INTO admin_grants (admin_id, target_id, check_delta, voice_delta) VALUES ($1, $2, $3, $4)',
      [user.id, rows[0].id, dCheck, dVoice]
    ).catch(err => console.error('[admin] log failed:', err.message));
    console.log(`[admin] ${user.email} → ${rows[0].email}: check ${dCheck >= 0 ? '+' : ''}${dCheck}, voice ${dVoice >= 0 ? '+' : ''}${dVoice}`);
    res.json({ email: rows[0].email, credits: rows[0].credits, voice_credits: rows[0].voice_credits, self: rows[0].id === user.id });
  } catch (err) {
    console.error('[admin] credits failed:', err.message);
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

app.patch('/api/history/inspections/:id', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    const body = req.body || {};
    const patch = {};
    if (typeof body.title === 'string' || body.title === null) patch.title = body.title;
    if (typeof body.pinned === 'boolean') patch.pinned = body.pinned;
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'ไม่มีข้อมูลที่จะแก้ไข' });
    const n = await updateInspection(user.id, id, patch);
    if (!n) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[history] update failed:', err.message);
    res.status(500).json({ error: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' });
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
        impact: pick(it?.impact), uncertainty: pick(it?.uncertainty),
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

// ดูสถานะรายการชำระเงินของตัวเอง (หน้าเว็บถามทุกไม่กี่วินาทีระหว่างรอ)
app.get('/api/payments/:chargeId/status', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });

    const chargeId = req.params.chargeId;
    if (!/^chrg_[A-Za-z0-9_]{4,64}$/.test(chargeId)) {
      return res.status(400).json({ error: 'รหัสรายการไม่ถูกต้อง' });
    }

    const result = await getPaymentStatus(user.id, chargeId);
    if (!result) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json(result);
  } catch (err) {
    console.error('[payment] ตรวจสถานะไม่สำเร็จ:', err.message);
    res.status(500).json({ error: 'ตรวจสอบสถานะไม่สำเร็จ ลองใหม่อีกครั้ง' });
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
    return res.status(402).json({ error: 'พร้อมตรวจครั้งถัดไปเมื่อคุณต้องการ ดูแพ็กเกจเพื่อเพิ่มสิทธิ์ได้', credits });
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
  // บันทึกผลตรวจไว้ดูย้อนหลัง ถ้าบันทึกไม่สำเร็จไม่กระทบผลที่ส่งให้ผู้ใช้ (รอเพื่อส่ง id กลับไปผูกความเห็น)
  const inspectionId = await saveInspection(user.id, contractType, result)
    .catch(e => { console.error('[history] save failed:', e.message); return null; });
  logCheck(user.id, contractType, result.items.length).catch(e => console.error('[stats] log failed:', e.message));
  res.json({ ok: true, result, credits, voiceCredits, audio, voiceError, inspectionId });
});

// ---------- ความเห็นต่อผลตรวจ ----------
const feedbackHits = new Map(); // userId -> { count, resetAt } กันส่งรัว
app.get('/api/feedback/reasons', (req, res) => res.json(FEEDBACK_REASONS));
app.post('/api/feedback', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const now = Date.now(), h = feedbackHits.get(user.id);
    if (h && h.resetAt > now && h.count >= 30) return res.status(429).json({ error: 'ส่งความเห็นบ่อยเกินไป ลองใหม่ภายหลัง' });
    feedbackHits.set(user.id, h && h.resetAt > now ? { count: h.count + 1, resetAt: h.resetAt } : { count: 1, resetAt: now + 3600e3 });
    const b = req.body || {};
    const r = await saveFeedback(user.id, { inspectionId: Number(b.inspectionId), rating: Number(b.rating), reasons: b.reasons, note: b.note });
    if (r.error) return res.status(r.status || 400).json({ error: r.error });
    res.json({ ok: true });
  } catch (err) {
    console.error('[feedback] failed:', err.message);
    res.status(500).json({ error: 'ส่งความเห็นไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// ---------- สถิติสำหรับแอดมิน ----------
app.get('/api/admin/stats', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
    if (!isAdmin(user)) return res.status(403).json({ error: 'บัญชีนี้ไม่มีสิทธิ์แอดมิน' });
    res.json(await adminStats(Number(req.query.days) || 30));
  } catch (err) {
    console.error('[admin] stats failed:', err.message);
    res.status(500).json({ error: 'โหลดสถิติไม่สำเร็จ' });
  }
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
        return res.status(402).json({ error: 'พร้อมตรวจครั้งถัดไปเมื่อคุณต้องการ ดูแพ็กเกจเพื่อเพิ่มสิทธิ์ได้', credits });
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

// ---------- แจ้งเตือนวันสำคัญในสัญญา ----------
app.get('/api/reminders', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    res.json({ items: await listReminders(user.id) });
  } catch (err) {
    console.error('[reminders] list failed:', err.message);
    res.status(500).json({ error: 'โหลดรายการแจ้งเตือนไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.post('/api/reminders', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const raw = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!raw.length) return res.status(400).json({ error: 'ไม่มีรายการที่จะบันทึก' });
    if (raw.length > MAX_BATCH) return res.status(400).json({ error: `บันทึกได้ครั้งละไม่เกิน ${MAX_BATCH} รายการ` });
    const items = raw.map(cleanReminder);
    if (items.some(x => !x)) return res.status(400).json({ error: 'มีรายการที่ชื่อหรือวันที่ไม่ถูกต้อง' });
    const r = await addReminders(user.id, items);
    if (r.full) return res.status(409).json({ error: `เก็บแจ้งเตือนได้สูงสุด ${MAX_REMINDERS} รายการ ลบรายการเก่าก่อนนะครับ` });
    res.json({ ok: true, items: r.items });
  } catch (err) {
    console.error('[reminders] add failed:', err.message);
    res.status(500).json({ error: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.patch('/api/reminders/:id', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    const body = req.body || {}, patch = {};
    if (typeof body.done === 'boolean') patch.done = body.done;
    if (body.title !== undefined || body.dueDate !== undefined) {
      const c = cleanReminder({ title: body.title ?? 'x', dueDate: body.dueDate ?? '2000-01-01' });
      if (!c) return res.status(400).json({ error: 'ชื่อหรือวันที่ไม่ถูกต้อง' });
      if (body.title !== undefined) patch.title = c.title;
      if (body.dueDate !== undefined) patch.dueDate = c.dueDate;
    }
    const item = await updateReminder(user.id, id, patch);
    if (!item) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json({ ok: true, item });
  } catch (err) {
    console.error('[reminders] update failed:', err.message);
    res.status(500).json({ error: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

app.delete('/api/reminders/:id', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'รหัสไม่ถูกต้อง' });
    if (!(await deleteReminder(user.id, id))) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[reminders] delete failed:', err.message);
    res.status(500).json({ error: 'ลบไม่สำเร็จ ลองใหม่อีกครั้ง' });
  }
});

// ไฟล์ปฏิทิน: หน้าเว็บส่งฟอร์ม (field "events" = JSON) แล้ว iPhone/คอมเปิดหน้าต่างเพิ่มลงปฏิทินเอง
// ไม่ต้องเข้าสู่ระบบ (ใช้กับผลตัวอย่างได้) ไม่บันทึกอะไรในเซิร์ฟเวอร์
app.post('/api/ics', express.urlencoded({ extended: false, limit: '40kb' }), (req, res) => {
  let raw;
  try { raw = JSON.parse(String(req.body?.events || '[]')); } catch { raw = null; }
  const items = Array.isArray(raw) ? raw.slice(0, 50).map(x => {
    const c = cleanReminder(x);
    if (c && Number.isInteger(x.id) && x.id > 0) c.id = x.id;
    return c;
  }).filter(Boolean) : [];
  if (!items.length) return res.status(400).type('text/plain; charset=utf-8').send('ไม่มีวันที่ที่ใช้ได้');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="vellum-${items.length === 1 ? items[0].dueDate : 'reminders'}.ics"`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(buildIcs(items, req.hostname || 'vellum-check'));
});

// ---------- หน้าเว็บ ----------
// ไฟล์หน้าเว็บให้เบราว์เซอร์ตรวจกับเซิร์ฟเวอร์ทุกครั้ง เพื่อไม่ให้ค้างเวอร์ชันเก่าในมือถือ
// คลิปวิดีโอ (public/videos/<ชื่อคลิป>/) แคชนาน 30 วัน — ถ้าแก้คลิป ให้เปลี่ยนชื่อโฟลเดอร์เป็นเวอร์ชันใหม่ (เช่น clip-intro-v2)
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos'), {
  maxAge: '30d',
  immutable: true,
}));
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
