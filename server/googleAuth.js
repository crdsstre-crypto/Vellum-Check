// ล็อกอินด้วย Google (OAuth 2.0 แบบ authorization code)
// ต้องตั้ง env ใน Render: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// GOOGLE_REDIRECT_URI เป็นตัวเลือก (ค่าเริ่มต้นคือ URL ของบริการนี้)

import crypto from 'node:crypto';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
  || 'https://vellum-check-api.onrender.com/api/auth/google/callback';

export function googleConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

// ค่า state กัน CSRF ผูกกับคุกกี้ของเบราว์เซอร์นั้น
export function makeState() {
  return crypto.randomBytes(24).toString('base64url');
}

export function buildAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
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
export async function exchangeCodeForProfile(code) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error(`token exchange ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
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
  };
}
