/* =====================================================
   เช็กสัญญา — script.js (ฉบับมีล็อกอิน)
   ล็อกอินด้วยอีเมลและรหัสผ่าน เครดิตผูกกับบัญชี
   ⚠️ ไฟล์นี้ไม่มี API key และไม่ตัดเครดิต ทั้งหมดอยู่ที่ server/

   โครงสร้าง
   1. CONFIG     ค่าและข้อความ
   2. HELPERS    ฟังก์ชันช่วยเหลือ
   3. AUTH       สมัคร ล็อกอิน ออกจากระบบ และสถานะการล็อกอิน
   4. RENDERING  แสดงผลจาก JSON ของเซิร์ฟเวอร์
   5. ACTIONS    ปุ่มตรวจ / ล้าง
   6. INIT       เริ่มต้นและผูกปุ่ม
   ===================================================== */


/* ---------- 1. CONFIG ---------- */
const CONFIG = {
  api: {
    me: '/api/me',
    signup: '/api/signup',
    login: '/api/login',
    logout: '/api/logout',
    check: '/api/check',
  },
  levelLabel: {
    check_detail: 'ควรตรวจละเอียด',
    caution: 'ควรระวัง',
    low: 'เสี่ยงต่ำ',
  },
  messages: {
    empty:        'ยังไม่มีผลการตรวจ',
    loginFirst:   'กรุณาเข้าสู่ระบบก่อนตรวจสัญญา',
    needCreds:    'กรุณากรอกอีเมลและรหัสผ่าน',
    noInput:      'กรุณาวางข้อความสัญญาก่อน',
    loading:      'กำลังตรวจสัญญา รอสักครู่...',
    network:      'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง',
    noHit:        '✅ AI ไม่พบจุดที่ควรตรวจ ลองอ่านทั้งฉบับอีกครั้งเพื่อความมั่นใจ',
    noCredit:     'เครดิตหมดแล้ว',
    sessionEnded: 'หมดเวลาการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่',
    loggedOut:    'ออกจากระบบแล้ว',
    clearConfirm: 'ล้างข้อความสัญญาทั้งหมดใช่ไหม?',
    disclaimer:   'ผลนี้เป็นการคัดกรองเบื้องต้นเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย ควรให้ทนายตรวจก่อนลงนาม',
  },
};

// เก็บ element ที่ใช้บ่อยไว้ตรงนี้ ตั้งค่าใน init()
const els = {};

// ผู้ใช้ที่ล็อกอินอยู่ หรือ null
let currentUser = null;


/* ---------- 2. HELPERS ---------- */

// กัน HTML แปลกปลอมจากข้อความสัญญาหรือจาก AI
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// เรียก API ของเซิร์ฟเวอร์ ส่งคุกกี้ไปด้วยอัตโนมัติ
async function api(path, method = 'GET', body) {
  const opts = { method, credentials: 'same-origin', headers: {} };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(path, opts);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: CONFIG.messages.network } };
  }
}


/* ---------- 3. AUTH ---------- */

function showCredits(n, voice) {
  els.creditsLine.textContent = `เครดิตตรวจคงเหลือ ${n} · เครดิตเสียงคงเหลือ ${voice ?? 0}`;
}

function notifyAuthChange(user) {
  if (typeof onAuthChange === 'function') onAuthChange(user);
}

function showLoggedIn(user) {
  currentUser = user;
  notifyAuthChange(user);
  els.loggedOut.hidden = true;
  els.loggedIn.hidden = false;
  els.userEmail.textContent = user.email;
  showCredits(user.credits, user.voice_credits);
  els.authMsg.textContent = '';
  setBusy(false);
}

function showLoggedOut(message = '') {
  currentUser = null;
  notifyAuthChange(null);
  els.loggedOut.hidden = false;
  els.loggedIn.hidden = true;
  els.authMsg.textContent = message;
  setBusy(false);
}

// ตรวจตอนเปิดหน้า ถ้ามี session อยู่แล้วจะเข้าสู่ระบบให้อัตโนมัติ
async function restoreSession() {
  const r = await api(CONFIG.api.me);
  if (r.ok) showLoggedIn(r.data);
  else showLoggedOut();
}

function readCredentials() {
  const email = els.email.value.trim();
  const password = els.password.value;
  if (!email || !password) {
    els.authMsg.textContent = CONFIG.messages.needCreds;
    return null;
  }
  return { email, password };
}

// kind คือ 'login' หรือ 'signup'
async function submitAuth(kind) {
  const creds = readCredentials();
  if (!creds) return;

  const r = await api(CONFIG.api[kind], 'POST', creds);
  if (r.ok) {
    els.password.value = '';
    showLoggedIn(r.data);
    return;
  }
  els.authMsg.textContent = r.data.error || CONFIG.messages.network;
}

async function logout() {
  await api(CONFIG.api.logout, 'POST', {});
  els.password.value = '';
  els.result.innerHTML = `<p class="empty">${esc(CONFIG.messages.empty)}</p>`;
  showLoggedOut(CONFIG.messages.loggedOut);
}


/* ---------- 4. RENDERING ---------- */

function renderEmpty(message = CONFIG.messages.empty) {
  els.result.innerHTML = `<p class="empty">${esc(message)}</p>`;
}

function renderSummary(counts) {
  return `<div class="summary">
    <span class="badge high">${CONFIG.levelLabel.check_detail} ${counts.check_detail}</span>
    <span class="badge mid">${CONFIG.levelLabel.caution} ${counts.caution}</span>
    <span class="badge low">${CONFIG.levelLabel.low} ${counts.low}</span>
  </div>`;
}

function renderBrief(summary) {
  return `<div class="brief">
    <p>📋 <b>งาน:</b> ${esc(summary.job) || '—'}</p>
    <p>💰 <b>เงิน:</b> ${esc(summary.money) || '—'}</p>
    <p>⏰ <b>เวลา:</b> ${esc(summary.time) || '—'}</p>
  </div>`;
}

// ข้อความต้นฉบับ: ถ้า AI อ้างถูกต้องให้แสดง ถ้าไม่พบให้เตือน
function renderQuote(item) {
  if (item.missing) {
    return `<p class="notfound">⚠️ ไม่พบข้อความนี้ในสัญญาต้นฉบับ AI อาจอ้างผิด โปรดตรวจเอง</p>`;
  }
  return `<p class="found">✅ พบข้อความนี้ในสัญญาต้นฉบับ</p>
    <blockquote>${esc(item.quote)}</blockquote>`;
}

function renderItem(item) {
  return `<details class="item ${esc(item.level)}" open>
    <summary>
      <span class="tag">${esc(CONFIG.levelLabel[item.level] || '')}</span>
      <b>${esc(item.title)}</b>
    </summary>
    ${renderQuote(item)}
    ${item.explanation ? `<p>${esc(item.explanation)}</p>` : ''}
    ${item.reference ? `<p>📚 แนวทางตรวจ: ${esc(item.reference)}</p>` : ''}
    ${item.suggested_fix ? `<p><b>เสนอแก้เป็น:</b> ${esc(item.suggested_fix)}</p>` : ''}
    ${item.how_to_negotiate ? `<p><b>วิธีรับมือ:</b> ${esc(item.how_to_negotiate)}</p>` : ''}
  </details>`;
}

function renderMissing(list) {
  if (!list.length) return '';
  return `<h3>สิ่งที่สัญญายังไม่ได้ระบุ</h3>
    <ul>${list.map(m => `<li>${esc(m)}</li>`).join('')}</ul>`;
}

function renderResult(result) {
  const items = Array.isArray(result.items) ? result.items : [];

  const body = items.length
    ? items.map(renderItem).join('')
    : `<p class="empty">${esc(CONFIG.messages.noHit)}</p>`;

  els.result.innerHTML = `
    ${renderSummary(result.risk_counts || { check_detail: 0, caution: 0, low: 0 })}
    ${renderBrief(result.summary || {})}
    ${body}
    ${renderMissing(result.missing_info || [])}
    <p class="disclaimer">${esc(CONFIG.messages.disclaimer)}</p>`;
}


/* ---------- 5. ACTIONS ---------- */

// ปิดปุ่มระหว่างประมวลผล และปิดทั้งหมดถ้ายังไม่ได้ล็อกอิน
function setBusy(busy) {
  els.checkBtn.disabled = busy || !currentUser;
  els.clearBtn.disabled = busy;
  els.checkBtn.textContent = busy ? 'กำลังตรวจ...' : 'ตรวจสัญญา';
}

async function runCheck() {
  if (!currentUser) {
    renderEmpty(CONFIG.messages.loginFirst);
    return;
  }

  const text = els.input.value.trim();
  if (!text) {
    renderEmpty(CONFIG.messages.noInput);
    return;
  }

  setBusy(true);
  renderEmpty(CONFIG.messages.loading);

  try {
    // ประเภทสัญญาเป็นตัวเลือกเสริม ถ้าไม่มีในหน้าให้ส่ง "unsure" (ระบบพิจารณาเอง)
    const contractType = document.getElementById('contractType')?.value || 'unsure';
    const r = await api(CONFIG.api.check, 'POST', {
      text,
      voice: els.voiceOpt?.checked === true,
      contractType,
    });

    if (typeof r.data.credits === 'number') showCredits(r.data.credits, r.data.voiceCredits);

    if (r.status === 401) {
      showLoggedOut(CONFIG.messages.sessionEnded);
      renderEmpty(CONFIG.messages.loginFirst);
      return;
    }
    if (!r.ok) {
      renderEmpty(r.status === 402 ? CONFIG.messages.noCredit : (r.data.error || CONFIG.messages.network));
      return;
    }

    renderResult(r.data.result);
    if (r.data.audio) {
      els.result.insertAdjacentHTML('afterbegin',
        `<audio controls src="data:audio/mpeg;base64,${r.data.audio}" style="width:100%;margin-bottom:12px"></audio>`);
    }
    if (r.data.voiceError) {
      els.result.insertAdjacentHTML('afterbegin', `<p class="notfound">${esc(r.data.voiceError)}</p>`);
    }
    els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } finally {
    setBusy(false);
  }
}

function clearAll() {
  const hasText = els.input.value.trim() !== '';
  if (hasText && !confirm(CONFIG.messages.clearConfirm)) return;
  els.input.value = '';
  renderEmpty();
}


/* ---------- 6. INIT ---------- */
function init() {
  const ids = {
    input: 'input', result: 'result', checkBtn: 'checkBtn', clearBtn: 'clearBtn',
    loggedOut: 'authLoggedOut', loggedIn: 'authLoggedIn',
    email: 'email', password: 'password',
    loginBtn: 'loginBtn', signupBtn: 'signupBtn', logoutBtn: 'logoutBtn',
    userEmail: 'userEmail', creditsLine: 'creditsLine', authMsg: 'authMsg',
  };

  // ช่องเสียงเป็นตัวเลือกเสริม ถ้าไม่มีในหน้าก็ไม่ควรหยุดการผูกปุ่มอื่น
  els.voiceOpt = document.getElementById('voiceOpt');

  for (const [key, id] of Object.entries(ids)) {
    els[key] = document.getElementById(id);
    if (!els[key]) {
      console.error(`[เช็กสัญญา] ไม่พบ element id="${id}" ใน index.html`);
      return;
    }
  }

  els.loginBtn.addEventListener('click', () => submitAuth('login'));
  els.signupBtn.addEventListener('click', () => submitAuth('signup'));
  els.logoutBtn.addEventListener('click', logout);
  els.checkBtn.addEventListener('click', runCheck);
  els.clearBtn.addEventListener('click', clearAll);

  showLoggedOut();
  restoreSession();
}

document.addEventListener('DOMContentLoaded', init);
