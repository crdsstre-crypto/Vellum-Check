// ล็อกอินด้วย Google (OAuth 2.0 แบบ authorization code)
// ต้องตั้ง env ใน Render: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// GOOGLE_REDIRECT_URI เป็นตัวเลือก (ใช้เมื่อเข้าเว็บจากโดเมนที่ไม่อยู่ในรายการ ALLOWED_HOSTS)
// ลิงก์กลับจาก Google = โดเมนเดียวกับที่ผู้ใช้กดเริ่ม (vellumcheck.com / www / onrender) → คุกกี้กัน CSRF กับคุกกี้ล็อกอินอยู่โดเมนเดียวกัน
// ⚠ ทุกลิงก์ด้านล่างต้องใส่ไว้ใน Google Cloud Console → Credentials → OAuth client → Authorized redirect URIs

import crypto from 'node:crypto';
import dns from 'node:dns';
import net from 'node:net';

// "fetch failed" บน Render มักเกิดจากเครื่องลองต่อ Google ผ่าน IPv6 ก่อนแล้วค้าง → ให้ใช้ IPv4 ก่อน + สลับเองถ้าช้า
try { dns.setDefaultResultOrder('ipv4first'); } catch {}
try { net.setDefaultAutoSelectFamily?.(true); } catch {}

// เรียก Google ซ้ำได้สูงสุด 3 ครั้ง (เฉพาะเครือข่ายล้ม/หมดเวลา) แต่ละครั้งรอไม่เกิน 8 วินาที
async function gfetch(url, opts, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) }); }
    catch (e) {
      last = e;
      console.warn('[google] fetch retry', i + 1, url.split('/')[2], e.cause?.code || e.name || e.message);
      if (i < tries - 1) await new Promise(r => setTimeout(r, 400 * (i + 1)));
    }
  }
  const err = new Error('fetch failed (' + (last?.cause?.code || last?.name || 'network') + ')');
  err.cause = last; throw err;
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DEFAULT_REDIRECT = process.env.GOOGLE_REDIRECT_URI
  || 'https://vellum-check-api.onrender.com/api/auth/google/callback';
export const ALLOWED_HOSTS = new Set(
  (process.env.ALLOWED_HOSTS || 'vellumcheck.com,www.vellumcheck.com,vellum-check-api.onrender.com')
    .split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
);

// ลิงก์กลับของคำขอนี้: โดเมนที่อยู่ในรายการ → https://<โดเมนนั้น>/api/auth/google/callback
export function redirectUriFor(req) {
  const host = String(req.hostname || '').toLowerCase();
  return ALLOWED_HOSTS.has(host) ? `https://${host}/api/auth/google/callback` : DEFAULT_REDIRECT;
}

export function googleConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

// ค่า state กัน CSRF ผูกกับคุกกี้ของเบราว์เซอร์นั้น
export function makeState() {
  return crypto.randomBytes(24).toString('base64url');
}

export function buildAuthUrl(state, redirectUri = DEFAULT_REDIRECT) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function readCookieValue(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) {
      return decodeURIComponent(part.slice(i + 1).trim());
    }
  }
  return null;
}

// แลก code เป็น access token แล้วอ่านข้อมูลผู้ใช้จาก Google
export async function exchangeCodeForProfile(code, redirectUri = DEFAULT_REDIRECT) {
  const tokenRes = await gfetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error(`token exchange ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const infoRes = await gfetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!infoRes.ok) throw new Error(`userinfo ${infoRes.status}`);
  const info = await infoRes.json();
  if (!info.sub || !info.email) throw new Error('missing profile fields');

  return {
    sub: info.sub,
    email: info.email,
    emailVerified: info.email_verified === true,
    picture: info.picture ?? null,
    name: String(info.given_name || info.name || '').slice(0, 40),
  };
}
