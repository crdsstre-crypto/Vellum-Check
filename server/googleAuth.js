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

// เรียก Google แบบ "ยิงซ้อน": ถ้าครั้งแรกยังไม่ตอบใน 2.5 วินาที ยิงครั้งใหม่คู่ขนาน (สูงสุด 3 ทาง) แล้วใช้คำตอบที่มาก่อน
// แก้อาการกดเลือกอีเมลแล้วรอนาน (การเชื่อมต่อบางครั้งค้างจนหมดเวลาทีละ 8 วินาที)
// ใช้ได้เพราะแต่ละคำขอเป็นแบบอ่านอย่างเดียว ส่วน /token ส่งซ้อนได้: Google ตอบสำเร็จให้คำขอแรกที่ถึง ที่เหลือได้ invalid_grant ซึ่งถูกทิ้งไป
function gfetch(url, opts, { tries = 3, hedgeMs = 2500, timeoutMs = 10000 } = {}) {
  const host = url.split('/')[2];
  return new Promise((resolve, reject) => {
    let done = false, started = 0, failed = 0, lastErr, okFallback = null;
    const ctrls = [];
    const finish = (fn, v) => { if (done) return; done = true; clearTimeout(timer); ctrls.forEach(c => { try { c.abort(); } catch {} }); fn(v); };
    const fire = () => {
      if (done || started >= tries) return;
      const n = ++started, ctrl = new AbortController(); ctrls.push(ctrl);
      const to = setTimeout(() => ctrl.abort(), timeoutMs);
      if (n > 1) console.warn('[google] slow, hedge request', n, host);
      fetch(url, { ...opts, signal: ctrl.signal }).then(async r => {
        clearTimeout(to);
        if (r.ok) return finish(resolve, r);
        // คำตอบผิดพลาดจาก Google (เช่น invalid_grant ของคำขอซ้อน) → รอคำขออื่นก่อน ถ้าไม่มีแล้วค่อยส่งต่อ
        okFallback = okFallback || r;
        if (++failed >= started && started >= tries) finish(resolve, okFallback); else if (failed >= started) fire();
      }, e => {
        clearTimeout(to);
        lastErr = e; console.warn('[google] fetch fail', n, host, e.cause?.code || e.name || e.message);
        if (++failed >= started) {
          if (started < tries) fire();
          else if (okFallback) finish(resolve, okFallback);
          else { const err = new Error('fetch failed (' + (lastErr?.cause?.code || lastErr?.name || 'network') + ')'); err.cause = lastErr; finish(reject, err); }
        }
      });
    };
    const timer = setInterval(() => { if (started < tries) fire(); else clearInterval(timer); }, hedgeMs);
    fire();
  });
}

// อ่านข้อมูลผู้ใช้จาก id_token ที่ได้มาพร้อม token (ได้ตรงจาก Google ผ่าน HTTPS → ไม่ต้องเรียก userinfo อีกรอบ)
function readIdToken(idToken) {
  try {
    const p = JSON.parse(Buffer.from(String(idToken).split('.')[1], 'base64url').toString('utf8'));
    const issOk = p.iss === 'https://accounts.google.com' || p.iss === 'accounts.google.com';
    const audOk = p.aud === CLIENT_ID || (Array.isArray(p.aud) && p.aud.includes(CLIENT_ID));
    if (!issOk || !audOk || !(p.exp * 1000 > Date.now() - 60000) || !p.sub || !p.email) return null;
    return p;
  } catch { return null; }
}

// อุ่นการเชื่อมต่อไปยัง Google ตอนผู้ใช้กดปุ่ม (DNS + TLS พร้อมก่อนกลับมาที่ callback)
export function warmGoogle() {
  fetch('https://oauth2.googleapis.com/', { method: 'HEAD', signal: AbortSignal.timeout(5000) }).catch(() => {});
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
  const tok = await tokenRes.json();

  let info = readIdToken(tok.id_token);
  if (!info) {
    const infoRes = await gfetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tok.access_token}` },
    });
    if (!infoRes.ok) throw new Error(`userinfo ${infoRes.status}`);
    info = await infoRes.json();
  }
  if (!info.sub || !info.email) throw new Error('missing profile fields');

  return {
    sub: info.sub,
    email: info.email,
    emailVerified: info.email_verified === true || info.email_verified === 'true',
    picture: info.picture ?? null,
    name: String(info.given_name || info.name || '').slice(0, 40),
  };
}
