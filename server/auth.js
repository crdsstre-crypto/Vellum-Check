// ระบบบัญชีผู้ใช้
// - รหัสผ่านเก็บเป็น hash ด้วย bcrypt ไม่เก็บเป็นข้อความ
// - session เก็บเป็น hash ของโทเคน โทเคนจริงอยู่ในคุกกี้ HttpOnly เท่านั้น
// - ผู้ใช้ 1 บัญชี = เครดิตชุดเดียว (ตาราง users)

import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { pool } from './db.js';

const COOKIE_NAME = 'vc_session';
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');

// คืนข้อความผิดพลาดถ้าไม่ถูกต้อง คืน null ถ้าผ่าน
export function validateCredentials(email, password) {
  if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return 'รูปแบบอีเมลไม่ถูกต้อง';
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
    return 'รหัสผ่านต้องยาว 8 ถึง 200 ตัวอักษร';
  }
  return null;
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) {
      return decodeURIComponent(part.slice(i + 1).trim());
    }
  }
  return null;
}

// คืนผู้ใช้ที่สร้างใหม่ หรือ null ถ้าอีเมลนี้มีบัญชีแล้ว
export async function registerUser(email, password) {
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, credits',
      [email.trim().toLowerCase(), hash]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') return null; // unique_violation: อีเมลซ้ำ
    throw err;
  }
}

// คืนข้อมูลผู้ใช้ถ้าอีเมลและรหัสผ่านถูก ไม่เช่นนั้นคืน null
export async function loginUser(email, password) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash, credits FROM users WHERE email = $1',
    [email.trim().toLowerCase()]
  );
  const user = rows[0];
  // บัญชีที่สมัครด้วย Google ไม่มีรหัสผ่าน จึงล็อกอินด้วยรหัสผ่านไม่ได้
  if (!user || !user.password_hash) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  return ok ? { id: user.id, email: user.email, credits: user.credits } : null;
}

// สร้าง session ใหม่และตั้งคุกกี้ให้เบราว์เซอร์
export async function startSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await pool.query(
    'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))',
    [sha256(token), userId, SESSION_DAYS]
  );
  const secure = req.secure ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`
  );
}

// ลบ session ฝั่งเซิร์ฟเวอร์และล้างคุกกี้
export async function endSession(req, res) {
  const token = readCookie(req, COOKIE_NAME);
  if (token) {
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [sha256(token)]);
  }
  const secure = req.secure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

// คืนผู้ใช้ที่ล็อกอินอยู่ หรือ null ถ้าไม่มี session ที่ยังไม่หมดอายุ
export async function getUserFromRequest(req) {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.credits, u.avatar
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [sha256(token)]
  );
  return rows[0] ?? null;
}

// หาบัญชีจาก Google หรือสร้างใหม่
// - ถ้าเคยล็อกอินด้วย Google นี้แล้ว ใช้บัญชีเดิม
// - ถ้าอีเมลตรงกับบัญชีเดิมและ Google ยืนยันอีเมลแล้ว ผูกบัญชี Google เข้ากับบัญชีนั้น
// - ไม่ผูกถ้า Google ยังไม่ยืนยันอีเมล
export async function findOrCreateGoogleUser({ sub, email, emailVerified, picture }) {
  const normEmail = email.trim().toLowerCase();

  const bySub = await pool.query(
    'SELECT id, email, credits FROM users WHERE google_sub = $1',
    [sub]
  );
  if (bySub.rows[0]) return bySub.rows[0];

  if (!emailVerified) return null;

  const byEmail = await pool.query(
    'SELECT id, email, credits FROM users WHERE email = $1',
    [normEmail]
  );
  if (byEmail.rows[0]) {
    await pool.query(
      'UPDATE users SET google_sub = $1, avatar = COALESCE(avatar, $3) WHERE id = $2 AND google_sub IS NULL',
      [sub, byEmail.rows[0].id, picture ?? null]
    );
    return byEmail.rows[0];
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, google_sub, avatar) VALUES ($1, NULL, $2, $3) RETURNING id, email, credits',
      [normEmail, sub, picture ?? null]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') return null; // ชนกันพร้อมกัน ให้ลองใหม่
    throw err;
  }
}

// ตั้งหรือลบรูปโปรไฟล์ (value เป็น null เพื่อลบ)
export async function setUserAvatar(userId, value) {
  const { rows } = await pool.query(
    'UPDATE users SET avatar = $2 WHERE id = $1 RETURNING avatar',
    [userId, value]
  );
  return rows[0]?.avatar ?? null;
}
