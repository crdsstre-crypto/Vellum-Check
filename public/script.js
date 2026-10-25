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
    extract: '/api/extract',
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
let lastCredits = null;

// ข้อความปุ่มตรวจ: บอกค่าใช้จ่ายไว้ก่อนกด และเปลี่ยนเป็นเติมเครดิตเมื่อเครดิตหมด
function checkLabel() {
  if (!currentUser) return 'ตรวจสัญญา';
  if (lastCredits === 0) return 'เติมเครดิตเพื่อตรวจสัญญา';
  return 'ตรวจสัญญา (ใช้ 1 เครดิต)';
}


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

/* MY WALLET: สร้างการ์ดครั้งเดียว หลังจากนั้นอัปเดตตัวเลขในที่เดิม
   (ไม่สร้างใหม่ทุกครั้ง เพื่อไม่ให้อนิเมชันเข้าฉากเล่นซ้ำ) */
const WALLET_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICO_CHECK = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg>';
const ICO_MIC = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';

function walletCard(cls, icon, th, en, use, id) {
  return `<div class="wallet-card ${cls}">` +
    `<div class="wallet-card-top"><span class="wallet-ico" aria-hidden="true">${icon}</span>` +
    `<div class="wallet-card-name"><b>${th}</b><small>${en}</small></div>` +
    `<span class="wallet-badge" id="${id}Badge">พร้อมใช้งาน</span></div>` +
    `<p class="wallet-card-use">${use}</p>` +
    `<div class="wallet-card-bottom"><p class="wallet-card-num"><b id="${id}">–</b><small>เครดิตคงเหลือ</small></p>` +
    `<button type="button" class="wallet-topup" aria-label="เติม${th}">เติมเครดิต</button></div></div>`;
}

// นับตัวเลขค่อย ๆ เปลี่ยนไปยังค่าจริง (~400ms) ใช้ rAF และแก้เฉพาะข้อความ ไม่กระทบเลย์เอาต์
function walletCountTo(el, from, to) {
  cancelAnimationFrame(el._raf);
  if (WALLET_REDUCED || from === to) { el.textContent = String(to); return; }
  const t0 = performance.now(), dur = 400;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

function walletSet(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = el.dataset.target === undefined || el.dataset.target === '' ? null : Number(el.dataset.target);
  el.dataset.target = val === null ? '' : String(val);
  if (val === null) { el.textContent = '–'; return; }
  const open = document.body.classList.contains('auth-open');
  if (open && prev !== null && prev !== val) walletCountTo(el, prev, val);
  else el.textContent = String(val);
  const badge = document.getElementById(id + 'Badge');
  if (badge) {
    badge.textContent = val === 0 ? 'หมดแล้ว' : 'พร้อมใช้งาน';
    badge.classList.toggle('is-empty', val === 0);
  }
}

// เปิดแผนบัญชีทีไร ตัวเลขนับขึ้นจาก 0 ไปยอดจริง
(function () {
  let wasOpen = document.body.classList.contains('auth-open');
  new MutationObserver(function () {
    const open = document.body.classList.contains('auth-open');
    if (open && !wasOpen) {
      ['walletTotal', 'walletRowCheck', 'walletRowVoice', 'walletCheck', 'walletVoice'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.dataset.target) walletCountTo(el, 0, Number(el.dataset.target));
      });
    }
    wasOpen = open;
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// แตะการ์ด: ขอบเปลี่ยนเป็นสีทองเล็กน้อย (iOS ไม่รองรับ :active บน div จึงใช้คลาสแทน)
(function () {
  const root = document.getElementById('creditsLine');
  if (!root) return;
  root.addEventListener('pointerdown', function (e) {
    const c = e.target.closest('.wallet-card');
    if (c) c.classList.add('is-touched');
  }, { passive: true });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
    root.addEventListener(t, function () {
      root.querySelectorAll('.is-touched').forEach(function (c) { c.classList.remove('is-touched'); });
    }, { passive: true });
  });
})();

function showCredits(n, voice) {
  lastCredits = typeof n === 'number' ? n : null;
  const hasN = typeof n === 'number';
  const voiceNum = typeof voice === 'number' ? voice : 0;
  if (!els.creditsLine.firstElementChild) {
    els.creditsLine.innerHTML =
      walletCard('wallet-card-check', ICO_CHECK, 'เครดิตตรวจ', 'Inspection Credit', 'ใช้ตรวจสัญญาและวิเคราะห์ความเสี่ยง', 'walletCheck') +
      walletCard('wallet-card-voice', ICO_MIC, 'เครดิตเสียง', 'Voice Credit', 'ใช้สรุปผลการตรวจเป็นเสียง', 'walletVoice');
  }
  walletSet('walletCheck', hasN ? n : null);
  walletSet('walletVoice', voiceNum);
  walletSet('walletRowCheck', hasN ? n : null);
  walletSet('walletRowVoice', voiceNum);
  walletSet('walletTotal', hasN ? n + voiceNum : null);

  // ป้ายบนหน้าหลัก (มือถือ) ให้เห็นเครดิตทันทีโดยไม่ต้องเปิดแผนบัญชี
  const chip = document.getElementById('creditChip');
  const num = document.getElementById('creditNum');
  if (chip && num) {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    num.textContent = lastCredits === null ? '–' : String(lastCredits);
    chip.hidden = !(isMobile && currentUser);
    chip.classList.toggle('is-low', lastCredits === 0);
  }
  if (!busyNow) els.checkBtn.textContent = checkLabel();
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
  const initial = document.getElementById('acctInitial');
  if (initial) initial.textContent = (user.email || '?').charAt(0).toUpperCase();
  showCredits(user.credits, user.voice_credits);
  els.authMsg.textContent = '';
  setBusy(false);
}

function showLoggedOut(message = '') {
  currentUser = null;
  notifyAuthChange(null);
  els.loggedOut.hidden = false;
  els.loggedIn.hidden = true;
  lastCredits = null;
  const chip = document.getElementById('creditChip');
  if (chip) chip.hidden = true;
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

// ---- สถานะกำลังรอผล: ข้อความหมุนเวียนและกล่องโครงร่าง ----
const LOADING_STEPS = [
  'กำลังอ่านเงื่อนไขในสัญญา...',
  'กำลังเทียบกับหลักกฎหมายที่เกี่ยวข้อง...',
  'กำลังหาจุดที่ควรระวัง...',
];
let loadingTimer = null;

function showLoading() {
  els.result.innerHTML = `
    <div class="loading-box" role="status" aria-live="polite">
      <ol class="load-steps" id="loadSteps">
        ${LOADING_STEPS.map((t, k) => `<li class="${k === 0 ? 'now' : ''}"><span class="dot" aria-hidden="true"></span>${esc(t)}</li>`).join('')}
      </ol>
      <p class="load-note">ใช้เวลาประมาณ 10–30 วินาที ไม่ต้องกดซ้ำ</p>
      <div class="skel"></div>
      <div class="skel short"></div>
    </div>`;
  let i = 0;
  loadingTimer = setInterval(() => {
    const lis = document.querySelectorAll('#loadSteps li');
    if (i < lis.length - 1) {
      lis[i].className = 'done';
      i += 1;
      lis[i].className = 'now';
    }
  }, 2500);
}

function stopLoading() {
  if (loadingTimer) clearInterval(loadingTimer);
  loadingTimer = null;
}

// ---- ข้อความแจ้งสั้น ๆ มุมล่าง ----
let toastTimer = null;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// เน็ตหลุด/เซิร์ฟเวอร์ไม่ตอบ: แสดงปุ่มลองใหม่ ข้อความที่วางยังอยู่ครบ
function renderRetry(message) {
  els.result.innerHTML = `
    <div class="retry-box">
      <p class="empty">${esc(message)}</p>
      <button type="button" class="ghost" id="retryBtn">ลองใหม่อีกครั้ง</button>
    </div>`;
  document.getElementById('retryBtn')?.addEventListener('click', () => runCheck());
}

function renderEmpty(message = CONFIG.messages.empty) {
  els.result.innerHTML = `<p class="empty">${esc(message)}</p>`;
}

const pad2 = n => String(Math.max(0, Number(n) || 0)).padStart(2, '0');

// แผงสรุปความเสี่ยง: ตัวเลขใหญ่ของระดับสูงสุดที่พบ + แถบสัดส่วน + จำนวนระดับอื่น
function renderSummary(counts, hasIndex) {
  const c = { check_detail: counts.check_detail || 0, caution: counts.caution || 0, low: counts.low || 0 };
  const total = c.check_detail + c.caution + c.low;
  if (!total || hasIndex) return '';
  const top = c.check_detail ? 'check_detail' : (c.caution ? 'caution' : 'low');
  const sub = top === 'low'
    ? 'ไม่พบประเด็นที่ต้องรีบตรวจ แต่ควรอ่านทั้งฉบับอีกครั้งก่อนลงนาม'
    : 'มีประเด็นที่แนะนำให้ตรวจสอบเงื่อนไขก่อนลงนาม';
  const tiles = ['check_detail', 'caution', 'low'].map(k =>
    `<div class="sum-tile lv-${k}" data-jumplv="${k}" role="button" tabindex="0"><b>${c[k]}</b><span>${CONFIG.levelLabel[k]}</span></div>`).join('');
  const btnLabel = top === 'low' ? 'ดูประเด็นทั้งหมด' : 'ดูประเด็นที่' + CONFIG.levelLabel[top];
  return `<div class="summary sum-card">
    <p class="sc-kick">สรุปผลการตรวจสอบ</p>
    <h3 class="sc-title">พบ ${total} ประเด็นที่ควรอ่าน</h3>
    <p class="sc-sub">${sub}</p>
    <div class="sc-tiles">${tiles}</div>
    ${hasIndex ? '' : `<button type="button" class="sc-go" data-jumplv="${top}">${esc(btnLabel)} <span aria-hidden="true">↓</span></button>`}
  </div>`;
}

// สารบัญประเด็น (Smart Issue Navigation): การ์ดแต่ละประเด็น แตะแล้วเลื่อนไปการ์ดจริงในรายงาน
const IX_LIMIT = 4;
const ICO_SHIELD = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M12 8.5v4M12 15.5v.1"/></svg>';
const ICO_CLAUSE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 9h6M9 13h6"/></svg>';
const ICO_TARGET = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/></svg>';
const ICO_GRID = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
const ICO_CHECKC = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16 9.6"/></svg>';
const reviewed = new Set();

// หาเลขข้อสัญญาจากข้อความต้นฉบับ (เฉพาะรอบที่ยังมีข้อความ): ข้อที่ขึ้นต้นบรรทัดล่าสุดก่อนตำแหน่ง quote
// ถ้าหาไม่เจอหรือไม่แน่ใจ จะไม่แสดง ไม่เดา
function clauseOf(item) {
  if (!hasViewer() || !viewerSrc.text || item.missing) return '';
  const text = viewerSrc.text, q = String(item.quote || '').trim();
  if (!q) return '';
  let at = text.indexOf(q);
  if (at < 0 && q.length > 40) at = text.indexOf(q.slice(0, 40));
  if (at < 0) return '';
  let num = '';
  for (const m of text.matchAll(/(?:^|\n)[ \t]*(?:ข้อที่|ข้อ)\s*([0-9๐-๙]{1,3})(?![0-9๐-๙])/g)) {
    if (m.index > at) break;
    num = m[1];
  }
  return num;
}
function ixShort(item) {
  const [head] = splitReason(item.explanation || '');
  const t = String(head || item.topic || '').replace(/\s+/g, ' ').trim();
  return t.length > 80 ? t.slice(0, 78).trim() + '…' : t;
}
function renderIssueIndex(items) {
  if (!Array.isArray(items) || items.length < 2) return '';
  const lvOf = it => (['check_detail', 'caution', 'low'].includes(it.level) ? it.level : 'low');
  const present = ['check_detail', 'caution', 'low'].filter(k => items.some(it => lvOf(it) === k));
  const hasRisk = present.some(k => k !== 'low');
  const sub = hasRisk
    ? 'เรียงตามความเสี่ยง · แตะรายการเพื่อดูรายละเอียด'
    : 'ไม่พบประเด็นที่ต้องรีบตรวจ แต่ควรอ่านทั้งฉบับอีกครั้งก่อนลงนาม';
  const seg = present.length > 1
    ? `<div class="ix-seg" role="group" aria-label="กรองประเด็นตามระดับ"><button type="button" class="ix-chip" data-ixfilter="all" aria-pressed="true">ทั้งหมด ${items.length}</button>${present.map(k => `<button type="button" class="ix-chip" data-ixfilter="${k}" aria-pressed="false">${esc(CONFIG.levelLabel[k])} ${items.filter(it => lvOf(it) === k).length}</button>`).join('')}</div>`
    : '';
  const rows = items.map((it, i) => {
    const lv = lvOf(it);
    const desc = ixShort(it);
    const clause = clauseOf(it);
    const meta = it.missing
      ? '<span class="ix-clause is-warn">ไม่พบข้อความนี้ในสัญญาต้นฉบับ</span>'
      : (clause ? `<span class="ix-clause">${ICO_CLAUSE}ข้อ ${esc(clause)} ของสัญญา</span>` : '');
    return `<button type="button" class="ix-row lv-${lv}" data-ixcard="${i}" data-jumpidx="${i}"${i >= IX_LIMIT ? ' hidden data-ixextra="1"' : ''}>
      <span class="ix-ico">${lv === 'check_detail' ? ICO_WARN : lv === 'caution' ? ICO_SHIELD : ICO_DOC}</span>
      <span class="ix-tx">
        <small>ประเด็น ${pad2(i + 1)} · ${esc(CONFIG.levelLabel[lv])}<em class="ix-done-chip">ตรวจแล้ว ✓</em></small>
        <b>${esc(it.title)}</b>
        ${desc ? `<p>${esc(desc)}</p>` : ''}
        ${meta}
      </span>
      <span class="ix-arrow" aria-hidden="true">→</span>
    </button>`;
  }).join('');
  const more = items.length > IX_LIMIT
    ? `<button type="button" class="ix-more" data-ixmore="1" aria-expanded="false">ดูทั้ง ${items.length} ประเด็น ›</button>` : '';
  return `<section class="ix" id="issueIndex" aria-label="สารบัญประเด็นที่ควรตรวจสอบ">
    <div class="ix-head"><h3 class="ix-title">จุดที่ควรตรวจสอบ</h3><span class="ix-badge${hasRisk ? '' : ' is-calm'}">พบ ${items.length} ประเด็น</span></div>
    <p class="ix-sub">${sub}</p>
    ${items.length >= 3 ? '<div class="ix-search-w"><input type="search" id="ixSearch" class="ix-search" placeholder="ค้นหาในประเด็น เช่น ค่าปรับ เงินประกัน การบอกเลิก" aria-label="ค้นหาในประเด็นที่พบ" autocomplete="off" enterkeyhint="search"></div>' : ''}
    ${seg}
    <div class="ix-list">${rows}</div><p class="ix-nohit" hidden>ไม่พบประเด็นที่ตรงกับคำค้น ลองใช้คำอื่นหรือล้างตัวกรอง</p>${more}
    <details class="ix-legend"><summary>วิธีอ่านสีและข้อควรทราบ</summary>
      <ul>
        <li><i class="k-gold"></i>ทอง: ตัวเลข ระยะเวลา จำนวนเงินในข้อความสัญญา</li>
        <li><i class="k-red"></i>แดง: ประเด็นระดับ “${esc(CONFIG.levelLabel.check_detail)}”</li>
        <li><i class="k-green"></i>เขียว: ข้อเสนอแนะและขั้นตอนถัดไป</li>
        <li><i class="k-blue"></i>ฟ้า: แหล่งอ้างอิง</li>
      </ul>
      <p>ระดับความเสี่ยงมาจากการประเมินของ AI ตามข้อความสัญญาที่อ่านได้ ไม่ใช่เกณฑ์ทางกฎหมาย และเรียงจากระดับสูงไปต่ำ ไม่ได้เรียงตามเลขข้อสัญญา</p>
      <p>ข้อสังเกตเหล่านี้ไม่ใช่คำวินิจฉัยทางกฎหมาย ควรพิจารณาข้อสัญญาอื่นและข้อเท็จจริงประกอบ</p>
    </details>
  </section>`;
}

// ทำเครื่องหมาย "ตรวจแล้ว": เป็นของผู้ใช้เท่านั้น ไม่เปลี่ยนระดับความเสี่ยงที่ระบบวิเคราะห์ และกดกลับมาดูได้เสมอ
function syncReview() {
  const total = els.result.querySelectorAll('details.item').length;
  els.result.querySelectorAll('[data-ixcard]').forEach(c => {
    const on = reviewed.has(+c.dataset.ixcard);
    c.classList.toggle('is-done', on);
    const t = c.querySelector('.ix-go-t');
    if (t) t.textContent = on ? 'ดูอีกครั้ง' : 'ไปยังประเด็นนี้';
  });
  els.result.querySelectorAll('[data-review]').forEach(b => {
    const on = reviewed.has(+b.dataset.review);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    const t = b.querySelector('.rv-t');
    if (t) t.textContent = on ? 'ตรวจแล้ว ✓ แตะเพื่อยกเลิก' : 'ทำเครื่องหมายว่าตรวจแล้ว';
    const d = b.closest('details.item');
    if (d) d.classList.toggle('is-reviewed', on);
  });
  const pct = total ? Math.round((reviewed.size / total) * 100) : 0;
  const n = els.result.querySelector('.ix-prog-n');
  if (n) n.textContent = reviewed.size + '/' + total;
  const pc = els.result.querySelector('.ix-prog-pct');
  if (pc) pc.textContent = pct + '% ความคืบหน้า';
  const bar = els.result.querySelector('.ix-bar');
  if (bar) { bar.setAttribute('aria-valuenow', String(pct)); bar.firstElementChild.style.width = pct + '%'; }
  const note = els.result.querySelector('.ix-prog-note');
  if (note) note.hidden = !(total && reviewed.size === total);
  syncCommand();
}

let filterLevel = 'all';
let lastIssueIdx = -1;
let ixReturnY = null;
let flashTimer = 0;
function calmMotion() {
  return document.documentElement.hasAttribute('data-calm') ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
// กรองประเด็นตามระดับและคำค้น: ซ่อนทั้งรายการในสารบัญและการ์ดในรายงาน
let ixQuery = '';
const normQ = t => String(t || '').toLowerCase().replace(/\s+/g, '');
function issueHay(it) {
  return normQ([it.title, it.topic, it.explanation, it.quote, it.suggested_fix, it.how_to_negotiate, it.impact, it.reference].join(' '));
}
function applyFilter(level) {
  filterLevel = level;
  const q = normQ(ixQuery);
  const items = (lastResult && Array.isArray(lastResult.items)) ? lastResult.items : [];
  const hit = i => !q || (items[i] ? issueHay(items[i]).includes(q) : true);
  const more = els.result.querySelector('[data-ixmore]');
  const expanded = more && more.getAttribute('aria-expanded') === 'true';
  let shownN = 0;
  els.result.querySelectorAll('[data-ixcard]').forEach(c => {
    const lvOk = level === 'all' || c.classList.contains('lv-' + level);
    const folded = level === 'all' && !q && c.hasAttribute('data-ixextra') && !expanded;
    c.hidden = !(lvOk && hit(+c.dataset.ixcard)) || folded;
    if (lvOk && hit(+c.dataset.ixcard)) shownN++;
  });
  els.result.querySelectorAll('details.item').forEach((d, i) => {
    d.hidden = !((level === 'all' || d.classList.contains('lv-' + level)) && hit(i));
  });
  if (more) more.hidden = level !== 'all' || !!q;
  const nohit = els.result.querySelector('.ix-nohit');
  if (nohit) nohit.hidden = shownN > 0;
  els.result.querySelectorAll('[data-ixfilter]').forEach(b => b.setAttribute('aria-pressed', b.dataset.ixfilter === level ? 'true' : 'false'));
}

// เลื่อนไปการ์ดประเด็นที่ idx: จำตำแหน่งหน้าสรุปไว้ ปิดการ์ดอื่นบนมือถือ เปิดการ์ดนี้ แล้วเน้นขอบทองสั้น ๆ
function focusIssue(idx) {
  const all = [...els.result.querySelectorAll('details.item')];
  const target = all[idx];
  if (!target) { toast('ไม่พบประเด็นนี้'); return; }
  if (target.hidden) {
    ixQuery = '';
    const sb = document.getElementById('ixSearch');
    if (sb) sb.value = '';
    applyFilter('all');
  }
  if (lastIssueIdx < 0 || ixVisible) ixReturnY = window.scrollY;
  if (window.matchMedia('(max-width: 767px)').matches) {
    all.forEach(d => { if (d !== target) d.open = false; });
  }
  target.open = true;
  lastIssueIdx = idx;
  all.forEach(d => { d.classList.remove('is-flash'); d.classList.toggle('is-picked', d === target); });
  els.result.querySelectorAll('[data-ixcard]').forEach(c => c.classList.toggle('is-current', +c.dataset.ixcard === idx));
  target.scrollIntoView({ behavior: calmMotion() ? 'auto' : 'smooth', block: 'start' });
  void target.offsetWidth;
  target.classList.add('is-flash');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => target.classList.remove('is-flash'), 1500);
  watchPicked(target);
  const sm = target.querySelector('summary');
  if (sm) { sm.setAttribute('tabindex', '-1'); sm.focus({ preventScroll: true }); }
  updateIxBack();
}
window.focusIssue = focusIssue;

// ล้างสถานะ "ประเด็นที่เลือก" เมื่อกลับหน้าสรุป
function clearPick() {
  els.result.querySelectorAll('details.item.is-picked,details.item.is-flash').forEach(d => d.classList.remove('is-picked', 'is-flash'));
  els.result.querySelectorAll('[data-ixcard].is-current').forEach(c => c.classList.remove('is-current'));
  if (pickObs) pickObs.disconnect();
  lastIssueIdx = -1;
  updateIxBack();
}
// "ภาพรวม" = ไปต้นรายการประเด็น · "กลับหน้าสรุป" = กลับตำแหน่งเดิมก่อนกดเข้ามา
function navBack(kind) {
  const behavior = calmMotion() ? 'auto' : 'smooth';
  const box = document.getElementById('issueIndex');
  if (kind === 'back' && ixReturnY != null) window.scrollTo({ top: ixReturnY, behavior });
  else if (box) box.scrollIntoView({ behavior, block: 'start' });
  clearPick();
}
let pickObs = null, pickedVisible = true;
function watchPicked(target) {
  if (pickObs) pickObs.disconnect();
  pickedVisible = true;
  if (!('IntersectionObserver' in window)) return;
  pickObs = new IntersectionObserver(es => { pickedVisible = es[0].isIntersecting; updateIxBack(); }, { threshold: 0 });
  pickObs.observe(target);
}

// ปุ่มลอย "กลับไปภาพรวม" แสดงเมื่ออยู่ลึกในรายงานและรายการประเด็นหลุดจอ กดแล้วกลับตำแหน่งเดิมของหน้าสรุป
let ixBackEl = null, ixObserver = null, ixVisible = true;
function ensureIxBack() {
  if (ixBackEl) return ixBackEl;
  ixBackEl = document.createElement('button');
  ixBackEl.type = 'button';
  ixBackEl.className = 'ix-back';
  ixBackEl.hidden = true;
  ixBackEl.innerHTML = '<span aria-hidden="true">↑</span> กลับไปภาพรวม';
  ixBackEl.addEventListener('click', () => {
    navBack('back');
  });
  document.body.appendChild(ixBackEl);
  return ixBackEl;
}
function updateIxBack() {
  const b = ensureIxBack();
  b.hidden = !(lastIssueIdx >= 0 && !ixVisible && !pickedVisible && document.getElementById('issueIndex'));
  document.body.classList.toggle('has-ixback', !b.hidden);
}
function watchIssueIndex() {
  lastIssueIdx = -1;
  ixReturnY = null;
  ixVisible = true;
  pickedVisible = true;
  if (pickObs) pickObs.disconnect();
  if (ixObserver) ixObserver.disconnect();
  const box = document.getElementById('issueIndex');
  updateIxBack();
  if (!box || !('IntersectionObserver' in window)) return;
  ixObserver = new IntersectionObserver(entries => {
    ixVisible = entries[0].isIntersecting;
    updateIxBack();
  }, { threshold: 0 });
  ixObserver.observe(box);
}


// ---------- Command Center + มิติความเสี่ยง (ใช้ข้อมูลที่ระบบมีจริงเท่านั้น ไม่เดาเพิ่ม) ----------
const URGENCY_LABEL = {
  before_sign: 'ควรจัดการก่อนลงนาม',
  before_pay: 'ควรจัดการก่อนชำระเงิน/ส่งมอบ',
  before_deadline: 'มีกำหนดเวลาที่ต้องระวัง',
  monitor: 'ติดตามได้',
};
const URGENCY_RANK = { before_sign: 0, before_pay: 1, before_deadline: 2, monitor: 3 };
const LEVEL_RANK = { check_detail: 0, caution: 1, low: 2 };
const lvKey = it => (LEVEL_RANK[it && it.level] !== undefined ? it.level : 'low');
const urRank = it => (URGENCY_RANK[it && it.urgency] !== undefined ? URGENCY_RANK[it.urgency] : 3);
// ผลจากประวัติเก่าไม่มีฟิลด์ urgency: ต้องไม่แสดงเหมือนระบบประเมินแล้ว
const hasUrgencyData = items => items.some(it => it && URGENCY_RANK[it.urgency] !== undefined);
const isPending = it => !!(it && (it.missing || String(it.uncertainty || '').trim()));

function ccTopIndex(items) {
  let best = -1;
  items.forEach((it, i) => {
    if (best < 0) { best = i; return; }
    const a = items[best];
    if (LEVEL_RANK[lvKey(it)] < LEVEL_RANK[lvKey(a)] ||
        (LEVEL_RANK[lvKey(it)] === LEVEL_RANK[lvKey(a)] && urRank(it) < urRank(a))) best = i;
  });
  return best;
}
function ccBeforeSign(items) {
  const withData = hasUrgencyData(items);
  const list = items.map((it, i) => ({ it, i })).filter(({ it }) => (withData
    ? lvKey(it) !== 'low' && urRank(it) < 3
    : lvKey(it) === 'check_detail'));
  return { withData, list: list.sort((a, b) => urRank(a.it) - urRank(b.it) || a.i - b.i) };
}
function ccRow(it, i, tag) {
  return `<button type="button" class="cc-row lv-${lvKey(it)}" data-jumpidx="${i}">
    <span class="cc-row-tx"><small>${esc(tag)}</small><b>${esc(it.title)}</b></span>
    <span class="cc-go" aria-hidden="true">›</span>
  </button>`;
}
// Command Center = สรุปสั้น ๆ หนึ่งส่วน: จำนวน + สัดส่วนระดับความเสี่ยง + ประเด็นที่ควรดูก่อน + สถานะการตรวจ
// รายการประเด็นทั้งหมดอยู่ที่ "จุดที่ควรตรวจสอบ" ด้านล่างเท่านั้น (ไม่แสดงซ้ำเป็นการ์ดสองชุด)
// "ระดับความเสี่ยง" (AI ประเมิน) แยกจาก "สถานะการตรวจ" (ผู้ใช้ทำเครื่องหมายเอง) ชัดเจน
function renderCommand(items, result) {
  if (!Array.isArray(items) || !items.length) return '';
  const n = items.length;
  const cnt = k => items.filter(it => lvKey(it) === k).length;
  const hi = cnt('check_detail'), mid = cnt('caution'), lo = cnt('low');
  const status = hi || mid ? 'พบประเด็นที่ต้องพิจารณา' : 'ไม่พบประเด็นที่ต้องรีบตรวจ';
  const seg = (k, c, label) => c ? `<i class="cc-seg lv-${k}" style="flex:${c}"></i>` : '';
  const leg = (k, c, label) => c ? `<span class="cc-lg lv-${k}">${label} ${c}</span>` : '';

  const ti = ccTopIndex(items);
  const top = items[ti];
  const topWhy = ixShort(top);
  const topUr = URGENCY_RANK[top.urgency] !== undefined && top.urgency !== 'monitor' ? URGENCY_LABEL[top.urgency] : '';
  const focus = `<div class="cc-focus lv-${lvKey(top)}">
    <p class="cc-focus-k"><span aria-hidden="true">⚑</span> ควรดูก่อน${topUr ? ' · ' + esc(topUr) : ''}</p>
    <b class="cc-focus-t">${esc(top.title)}</b>
    ${topWhy ? `<p class="cc-why">${esc(topWhy)}</p>` : ''}
    <button type="button" class="cc-focus-go" data-jumpidx="${ti}">ไปยังประเด็นนี้ <span aria-hidden="true">›</span></button>
  </div>`;

  // ประเด็นอื่นที่ควรจัดการก่อนลงนาม (ไม่ซ้ำกับประเด็นด้านบน สูงสุด 2)
  const bs = ccBeforeSign(items);
  const others = bs.list.filter(({ i }) => i !== ti).slice(0, 2);
  const more = bs.list.filter(({ i }) => i !== ti).length - others.length;
  const before = others.length ? `<div class="cc-before"><h4>ควรจัดการก่อนลงนามด้วย</h4>
    ${others.map(({ it, i }) => ccRow(it, i, bs.withData ? (URGENCY_LABEL[it.urgency] || '') : 'ควรตรวจละเอียด')).join('')}
    ${more > 0 ? `<p class="cc-why">และอีก ${more} ประเด็น ดูในรายการด้านล่าง</p>` : ''}
    ${bs.withData ? '' : '<p class="cc-why">ผลจากประวัติเก่าไม่มีข้อมูลความเร่งด่วน จึงแสดงตามระดับความเสี่ยง</p>'}</div>` : '';

  const pending = items.filter(isPending).length;
  const miss = Array.isArray(result && result.missing_info) ? result.missing_info.length : 0;
  const notes = [
    pending ? `${pending} ประเด็นที่ข้อมูลไม่ครบหรือไม่พบข้อความอ้างอิง` : '',
    miss ? `${miss} หัวข้อที่ไม่พบในข้อความที่ตรวจ (ไม่ได้แปลว่าสัญญาไม่มี)` : '',
  ].filter(Boolean);
  const progress = `<div class="cc-status">
    <div class="ix-prog" aria-live="polite">
      <div class="ix-prog-row"><span class="ix-prog-l">สถานะการตรวจ <b class="ix-prog-n">0/${n}</b></span>
        <div class="ix-bar" role="progressbar" aria-label="ความคืบหน้าการตรวจ" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i style="width:0%"></i></div></div>
      <p class="ix-prog-note" hidden>คุณดูครบทุกประเด็นแล้ว ควรอ่านสัญญาทั้งฉบับอีกครั้งก่อนลงนาม</p>
    </div>
    ${notes.length ? `<ul class="cc-notes">${notes.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    <button type="button" class="cc-next" data-ccnext="1">เปิดประเด็นแรกที่ยังไม่ตรวจ <span aria-hidden="true">›</span></button>
  </div>`;

  return `<section class="cc" id="commandCenter" aria-label="สรุปภาพรวมสัญญา">
    <div class="cc-head"><div><p class="cc-kick">VELLUM CHECK / OVERVIEW</p><h3>${esc(status)}</h3></div></div>
    <div class="cc-count"><b>${pad2(n)}</b><span>ประเด็นที่พบ</span></div>
    <div class="cc-bar" role="img" aria-label="สัดส่วนระดับความเสี่ยง">${seg('check_detail', hi)}${seg('caution', mid)}${seg('low', lo)}</div>
    <div class="cc-legend">${leg('check_detail', hi, 'สำคัญ')}${leg('caution', mid, 'ควรระวัง')}${leg('low', lo, 'อื่น ๆ')}</div>
    ${focus}${before}${progress}
    <p class="cc-note">ระดับความเสี่ยงมาจากการประเมินของ AI เพื่อคัดกรองเบื้องต้น ส่วนสถานะการตรวจเป็นของคุณเอง ไม่ใช่คำวินิจฉัยทางกฎหมาย</p>
  </section>`;
}
function syncCommand() {
  const total = els.result.querySelectorAll('details.item').length;
  const nx = els.result.querySelector('[data-ccnext]');
  if (nx) nx.hidden = total > 0 && reviewed.size >= total;
}
function ccOpenNext() {
  const total = els.result.querySelectorAll('details.item').length;
  for (let i = 0; i < total; i++) if (!reviewed.has(i)) { focusIssue(i); return; }
  toast('ตรวจครบทุกประเด็นแล้ว ควรอ่านสัญญาทั้งฉบับอีกครั้งก่อนลงนาม');
}

// มิติความเสี่ยง 4 ด้านในการ์ดประเด็น: ผลกระทบ · ความเร่งด่วน · หลักฐาน · ความไม่แน่นอน
// ผลกระทบ/ความเร่งด่วน/ความไม่แน่นอน มาจากการประเมินของ AI · หลักฐานคำนวณจากการตรวจข้อความจริงฝั่งเซิร์ฟเวอร์
function renderDims(item) {
  const rows = [];
  const impact = String(item.impact || '').trim();
  if (impact) rows.push(['ผลกระทบ', esc(impact)]);
  if (URGENCY_RANK[item.urgency] !== undefined) {
    const note = String(item.urgency_note || '').trim();
    rows.push(['ความเร่งด่วน', `<b>${esc(URGENCY_LABEL[item.urgency])}</b>${note ? ' · ' + esc(note) : ''}`]);
  }
  const clause = clauseOf(item);
  const ref = String(item.reference || '').trim();
  const ev = [];
  ev.push(item.missing ? '<span class="dm-bad">ไม่พบข้อความนี้ในสัญญาต้นฉบับ</span>' : 'ข้อความตรงกับสัญญา');
  if (clause) ev.push(`ข้อ ${esc(clause)} ของสัญญา`);
  if (ref) ev.push(`มาตราที่ AI ระบุ: ${esc(ref)} (ยังไม่ได้ตรวจเทียบกฎหมาย)`);
  rows.push(['หลักฐาน', ev.join(' · ')]);
  const unc = String(item.uncertainty || '').trim();
  rows.push(['ความไม่แน่นอน', unc ? esc(unc) : '<span class="dm-mute">ระบบไม่ได้ระบุ (ไม่ได้แปลว่าไม่มีข้อมูลที่ขาด)</span>']);
  return `<div class="dims"><h4>มิติความเสี่ยง</h4><dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`;
}
// แถบสั้นใต้เหตุผลในการ์ด: ความเร่งด่วน (ถ้าระบบระบุ)
function renderUrgencyChip(item) {
  if (URGENCY_RANK[item.urgency] === undefined || item.urgency === 'monitor') return '';
  return `<p class="ur-chip ur-${item.urgency}"><span aria-hidden="true">●</span> ${esc(URGENCY_LABEL[item.urgency])}</p>`;
}

function renderBrief(summary) {
  return `<div class="brief">
    <p>📋 <b>งาน:</b> ${esc(summary.job) || '—'}</p>
    <p>💰 <b>เงิน:</b> ${esc(summary.money) || '—'}</p>
    <p>⏰ <b>เวลา:</b> ${esc(summary.time) || '—'}</p>
  </div>`;
}

// ข้อความต้นฉบับ: ถ้า AI อ้างถูกต้องให้แสดง ถ้าไม่พบให้เตือน
// ไฮไลต์ตัวเลขสำคัญในข้อความสัญญา (จำนวนเงิน ระยะเวลา ร้อยละ) ด้วยกฎตายตัว ไม่ใช้ AI เดา จึงไม่ฟันธงว่าตรงไหนเสี่ยง
const KT_RE = /ร้อยละ\s*[0-9๐-๙][0-9๐-๙,.]*|[0-9๐-๙][0-9๐-๙,.]*\s*(?:ล้านบาท|บาท|เปอร์เซ็นต์|%|วันทำการ|วัน|สัปดาห์|เดือน|ปี|ชั่วโมง|ครั้ง)|[0-9๐-๙]{1,3}(?:,[0-9๐-๙]{3})+(?:\.[0-9]+)?/g;
function hlKeyTerms(text) {
  const t = String(text || '');
  let out = '', last = 0;
  for (const m of t.matchAll(KT_RE)) {
    out += esc(t.slice(last, m.index)) + '<mark class="kt">' + esc(m[0]) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + esc(t.slice(last));
}
const ICO_BOOK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1v-13z"/><path d="M12 6.5v13"/></svg>';
// แหล่งอ้างอิง: เลขข้อสัญญา (หาเจอจริงเท่านั้น) และมาตราที่ AI ระบุ
// "reference" มาจาก AI และยังไม่ได้ตรวจเทียบกับแหล่งกฎหมายจริง จึงต้องบอกสถานะนี้เสมอ ห้ามแสดงเหมือนผ่านการตรวจแล้ว
function renderSource(item) {
  const clause = clauseOf(item);
  const ref = String(item.reference || '').trim();
  if (!clause && !ref) return '';
  return `<div class="it-src"><h4>${ICO_BOOK}แหล่งอ้างอิง</h4>${clause ? `<p><b>ข้อความจากสัญญา</b> ข้อ ${esc(clause)}</p>` : ''}${ref ? `<p><b>มาตราที่ระบบระบุ</b> ${esc(ref)}</p><p class="src-warn">ระบบยังไม่ได้ตรวจเทียบกับแหล่งกฎหมายจริง ต้องตรวจสอบเพิ่มเติม</p>` : ''}</div>`;
}

function renderQuote(item) {
  if (item.missing) {
    return `<p class="notfound">⚠️ ไม่พบข้อความนี้ในสัญญาต้นฉบับ AI อาจอ้างผิด โปรดตรวจเอง</p>`;
  }
  return `<blockquote class="hl-quote">${hlKeyTerms(item.quote)}</blockquote>
    <div class="src-row"><span>อ้างอิงจากข้อความในสัญญา</span>${hasViewer() ? '<button type="button" class="src-link" data-act="jump">ดูข้อความต้นฉบับ <i aria-hidden="true">›</i></button>' : ''}</div>`;
}

// บนมือถือเปิดแค่สองรายการแรก (เรียงจากความเสี่ยงสูงสุด) ที่เหลือพับไว้ให้แตะเปิดเอง
function openByDefault(index) {
  return window.matchMedia('(max-width: 767px)').matches ? index < 2 : true;
}

const ICO_WARN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17.2v.1"/></svg>';


// รายการความเสี่ยงแบบย่อ: เห็นชื่อ ระดับ และเหตุผลสั้น ๆ ก่อน
// ข้อความต้นฉบับ ข้อเสนอแนะ และวิธีรับมือ รวมไว้ใต้ปุ่มเดียว กดเมื่ออยากอ่านรายละเอียด
const ICO_BULB = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
const ICO_DOC = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>';

// ปุ่มกางรายละเอียด: ชื่อปุ่มเปลี่ยนตามสถานะเปิด/ปิด และมีบรรทัดอธิบายใต้ชื่อ
function sgSummary(openText, closeText, sub) {
  return `<summary><span class="sg-ico">${ICO_DOC}</span><span class="sg-st"><b class="sg-open">${openText}</b><b class="sg-close">${closeText}</b><small>${sub}</small></span></summary>`;
}

// กล่องเขียวที่เห็นทันที: "สิ่งที่ควรขอแก้ไข" (ถ้าไม่มีข้อเสนอแก้ไข ใช้ขั้นตอนถัดไปแทน)
function renderFix(item) {
  const text = item.suggested_fix || item.how_to_negotiate;
  if (!text) return '';
  return `<div class="it-next it-fix"><h4>${ICO_BULB}${item.suggested_fix ? 'สิ่งที่ควรขอแก้ไข' : 'ขั้นตอนถัดไป'}</h4><p>${esc(text)}</p></div>`;
}

// รายละเอียดทั้งหมดรวมไว้ใต้ปุ่มเดียว: ขั้นตอนถัดไป แหล่งอ้างอิง ข้อความต้นฉบับ และข้อความเปรียบเทียบ
function renderDetail(item) {
  const hasQuote = !item.missing && !!item.quote;
  const fix = item.suggested_fix ? esc(item.suggested_fix) : '';
  const nego = item.suggested_fix && item.how_to_negotiate ? renderNext(item) : '';
  const src = renderSource(item);
  const dims = renderDims(item);

  const copyBtn = (which, label) =>
    `<button type="button" class="sg-copy" data-act="copyfix" data-copy="${which}">${ICO_COPY}<span>${label}</span></button>`;
  const jump = hasViewer() ? '<button type="button" class="src-link" data-act="jump">ดูตำแหน่งในสัญญา <i aria-hidden="true">›</i></button>' : '';

  let body = '';
  if (fix && hasQuote) {
    body = `
      <div class="sg-tabs" role="tablist">
        <button type="button" role="tab" class="sg-tab" data-act="sgtab" data-tab="old">ข้อความเดิม</button>
        <button type="button" role="tab" class="sg-tab" data-act="sgtab" data-tab="new">ข้อความแนะนำ</button>
        <button type="button" role="tab" class="sg-tab on" data-act="sgtab" data-tab="cmp">เปรียบเทียบ</button>
      </div>
      <div class="sg-panel sg-old" data-panel="old" hidden>
        <p class="sg-plbl">ข้อความในสัญญา</p><p class="tx-old">${hlKeyTerms(item.quote)}</p>${jump}
        ${copyBtn('old', 'คัดลอกข้อความเดิม')}
      </div>
      <div class="sg-panel sg-new" data-panel="new" hidden>
        <p class="sg-plbl">ข้อความที่แนะนำ</p><p class="tx-new">${fix}</p>
        ${copyBtn('new', 'คัดลอกข้อความแนะนำ')}
      </div>
      <div class="sg-panel sg-cmp" data-panel="cmp">
        <div class="sg-card sg-old"><p class="sg-plbl">01 · ข้อความเดิม</p><p>${hlKeyTerms(item.quote)}</p></div>
        <p class="sg-arrow"><span aria-hidden="true">↓</span> ปรับถ้อยคำให้ชัดเจนขึ้น</p>
        <div class="sg-card sg-new"><p class="sg-plbl">02 · ข้อความแนะนำ</p><p>${fix}</p>${copyBtn('new', 'คัดลอกข้อความแนะนำ')}</div>
      </div>`;
  } else if (fix) {
    body = `
      <div class="sg-panel sg-new" data-panel="new">
        <p class="sg-plbl">ข้อความที่แนะนำ</p><p class="tx-new">${fix}</p>
        ${copyBtn('new', 'คัดลอกข้อความแนะนำ')}
      </div>`;
  } else if (hasQuote) {
    body = `<p class="cmp-lbl">ข้อความเดิมในสัญญา</p>${renderQuote(item)}`;
  }
  const note = fix ? '<p class="sg-note">ข้อความตัวอย่างเพื่อประกอบการพิจารณา ควรตรวจสอบให้สอดคล้องกับข้อเท็จจริงและกฎหมายที่ใช้บังคับก่อนนำไปใช้จริง</p>' : '';

  return `<details class="sg-more">
    ${sgSummary('ดูรายละเอียด ข้อกฎหมาย และข้อความต้นฉบับ', 'ซ่อนรายละเอียด', 'แหล่งอ้างอิงและข้อความเปรียบเทียบ')}
    ${dims}${nego}${src}${body}${note}
  </details>`;
}


// เหตุผล: ประโยคแรกเป็นหัวข้อตัวหนา ประโยคที่สองเป็นรายละเอียดสีจาง (ถ้าแยกไม่ได้ใช้แบบย่อ-ขยายเดิม)
function splitReason(t) {
  const text = String(t || '').trim();
  const nl = text.indexOf('\n');
  if (nl > 0) return [text.slice(0, nl).trim(), text.slice(nl + 1).trim()];
  const m = text.match(/^([\s\S]{12,}?[.!?])\s+([\s\S]+)$/);
  return m ? [m[1].trim(), m[2].trim()] : [text, ''];
}
function renderReason(explanation) {
  if (!explanation) return '';
  const [head, detail] = splitReason(explanation);
  if (detail) {
    return `<div class="it-reason"><p class="it-lbl">สิ่งที่ต้องรู้</p><p class="it-text it-head">${esc(head)}</p><p class="it-detail">${esc(detail)}</p></div>`;
  }
  const long = explanation.length > 110;
  return `<div class="it-reason"><p class="it-lbl">สิ่งที่ต้องรู้</p><p class="it-text${long ? ' clamp' : ''}">${esc(explanation)}</p>${long ? '<button type="button" class="more-btn" data-act="more">อ่านเพิ่มเติม</button>' : ''}</div>`;
}

// ขั้นตอนถัดไป: วิธีรับมือที่ AI เสนอ แสดงให้เห็นทันที ไม่ซ่อนไว้ใต้ปุ่ม (เป็นข้อเสนอแนะ ไม่ใช่ข้อความในสัญญา)
function renderNext(item) {
  if (!item.how_to_negotiate) return '';
  return `<div class="it-next"><h4>${ICO_BULB}ขั้นตอนถัดไป</h4><p>${esc(item.how_to_negotiate)}</p></div>`;
}

function renderItem(item, index, total) {
  const lv = ['check_detail', 'caution', 'low'].includes(item.level) ? item.level : 'low';
  return `<details class="item lv-${lv}" id="issue-${index}" ${openByDefault(index) ? 'open' : ''}>
    <summary>
      <span class="it-ico">${ICO_WARN}</span>
      <span class="pick-banner" aria-live="polite">${ICO_CHECKC}<b>คุณมาถึงประเด็นที่เลือกแล้ว</b><em>${index + 1} จาก ${total}</em></span>
      <span class="it-title"><small>ประเด็นที่ ${pad2(index + 1)}${item.topic ? ' · ' + esc(item.topic) : ''}</small><b>${esc(item.title)}</b></span>
      <span class="tag">${esc(CONFIG.levelLabel[item.level] || '')}</span>
    </summary>
    ${renderReason(item.explanation)}
    ${renderUrgencyChip(item)}
    ${renderFix(item)}
    ${item.missing ? renderQuote(item) : ''}
    ${renderDetail(item)}
    <div class="rv-row"><button type="button" class="rv-btn" data-review="${index}" aria-pressed="false"><span class="rv-t">ทำเครื่องหมายว่าตรวจแล้ว</span>${ICO_CHECKC}</button></div>
    <div class="pk-row"><button type="button" class="pk-btn" data-ixnav="overview">${ICO_GRID}<span>ภาพรวม</span></button><button type="button" class="pk-btn is-primary" data-ixnav="back"><span>กลับหน้าสรุป</span></button></div>
  </details>`;
}

function renderMissing(list) {
  if (!list.length) return '';
  return `<section class="miss"><h3>ไม่พบในข้อความที่ตรวจ</h3>
    <p class="miss-note">ไม่ได้แปลว่าสัญญาไม่มีเรื่องนี้ ระบบอาจอ่านเอกสารได้ไม่ครบ ควรเช็กกับต้นฉบับอีกครั้ง</p>
    <ul>${list.map(m => `<li>${esc(m)}</li>`).join('')}</ul></section>`;
}

// ถ้าผู้ใช้ไม่ได้เลือกประเภท (ไม่แน่ใจ) แต่ระบบดูจากข้อความได้ ให้บอกผลและเปิดให้เปลี่ยนได้
function addDetectBanner(result, selected) {
  const found = result?.detected_type;
  if (selected !== 'unsure' || !found || found === 'unsure') return;
  const opt = document.querySelector('#contractType option[value="' + found + '"]');
  if (!opt) return;
  const name = opt.textContent.replace(/\s*\(.*\)\s*$/, '');
  els.result.insertAdjacentHTML('afterbegin',
    `<div class="detect-banner"><span>ระบบดูว่าเป็น <b>${esc(name)}</b></span>` +
    `<button type="button" class="detect-change" id="detectChange">เปลี่ยนประเภท</button></div>`);
  document.getElementById('detectChange').addEventListener('click', function () {
    const t = document.getElementById('ctTrigger');
    if (t && !t.hidden) t.click();
    else document.getElementById('contractType')?.focus();
  });
}

let lastResult = null;
// ข้อความสัญญาที่ใช้ตรวจ จับคู่กับผลตรวจรอบนั้นเท่านั้น (ผลจากประวัติไม่มีข้อความนี้ เพราะเราไม่เก็บไว้)
let viewerSrc = null;
const hasViewer = () => !!(viewerSrc && viewerSrc.result === lastResult);

// ข้อความสรุปผลตรวจสำหรับคัดลอกหรือแชร์ (ไม่รวมข้อความต้นฉบับของสัญญา)
function buildShareText(result) {
  const s = result.summary || {};
  const items = Array.isArray(result.items) ? result.items : [];
  const lines = ['ผลตรวจสัญญาเบื้องต้น (Vellum Check)', ''];
  lines.push(`งาน: ${s.job || '—'}`, `เงิน: ${s.money || '—'}`, `เวลา: ${s.time || '—'}`, '');
  if (items.length === 0) {
    lines.push(CONFIG.messages.noHit);
  } else {
    items.forEach((it, i) => {
      lines.push(`${i + 1}. [${CONFIG.levelLabel[it.level] || ''}] ${it.title || ''}`);
      if (it.explanation) lines.push(`   ${it.explanation}`);
      if (it.suggested_fix) lines.push(`   เสนอแก้เป็น: ${it.suggested_fix}`);
    });
  }
  lines.push('', CONFIG.messages.disclaimer);
  return lines.join('\n');
}

// เลื่อนกลับไปที่ข้อความในช่องวางสัญญาและเลือกส่วนที่ AI อ้างถึง
function jumpToQuote(quote) {
  const q = quote.trim();
  const ta = els.input;
  if (!q || !ta) return;
  let at = ta.value.indexOf(q);
  if (at < 0) at = ta.value.indexOf(q.slice(0, 40)); // ข้อความยาว: ลองจับจากต้นประโยค
  if (at < 0) { toast('หาตำแหน่งไม่พบ ข้อความอาจถูกแก้หลังตรวจ'); return; }
  ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  ta.focus({ preventScroll: true });
  ta.setSelectionRange(at, at + Math.min(q.length, ta.value.length - at));
  // textarea เลื่อนเองตามเคอร์เซอร์ไม่แน่นอนบน iOS จึงคำนวณจากสัดส่วนข้อความ
  ta.scrollTop = Math.max(0, (at / Math.max(1, ta.value.length)) * ta.scrollHeight - ta.clientHeight / 2);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // เบราว์เซอร์บางตัวไม่อนุญาต clipboard API ใช้วิธีเลือกข้อความแทน
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

const ICO_COPY = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
const ICO_SHARE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>';
const ICO_PDF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14"/></svg>';

// เลขรายงาน เช่น VC-241024-1842 (ใช้เวลาในเครื่อง ไม่ใช่เลขอ้างอิงทางกฎหมาย)
function reportMeta() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  const no = `VC-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  const date = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  const sel = document.getElementById('contractType');
  const typeText = sel && sel.value && sel.value !== 'unsure' ? sel.options[sel.selectedIndex].text.trim() : '';
  return { no, date, typeText };
}

function renderResult(result) {
  lastResult = result;
  reviewed.clear();
  // เรียงตามระดับความเสี่ยงที่ระบบประเมิน (สูง -> ต่ำ) แบบ stable ไม่เรียงตามเลขข้อสัญญา
  if (Array.isArray(result.items)) {
    const RANK = { check_detail: 0, caution: 1, low: 2 };
    const rk = x => (x && RANK[x.level] !== undefined ? RANK[x.level] : 2);
    if (result.items.some((x, i, a) => i && rk(x) < rk(a[i - 1]))) {
      result.items = result.items.map((x, i) => [x, i]).sort((a, b) => rk(a[0]) - rk(b[0]) || a[1] - b[1]).map(p => p[0]);
    }
  }
  filterLevel = 'all';
  ixQuery = '';
  const items = Array.isArray(result.items) ? result.items : [];
  const meta = reportMeta();

  const body = items.length
    ? items.map((it, i) => renderItem(it, i, items.length)).join('')
    : `<p class="empty">${esc(CONFIG.messages.noHit)}</p>`;

  els.result.innerHTML = `
    <article class="rpt${items.length >= 2 ? ' has-ix' : ''}">
      <header class="rpt-head">
        <p class="rpt-kicker">ANALYSIS REPORT <span>· ${esc(meta.no)}</span></p>
        <h3 class="rpt-title">ผลการตรวจสอบสัญญา</h3>
        <p class="rpt-meta">${meta.typeText ? 'ประเภทเอกสาร: ' + esc(meta.typeText) + ' · ' : ''}${esc(meta.date)}</p>
      </header>
      ${renderSummary(result.risk_counts || { check_detail: 0, caution: 0, low: 0 }, items.length >= 2)}
      ${renderCommand(items, result)}
      ${renderIssueIndex(items)}
      ${renderBrief(result.summary || {})}
      ${body}
      ${renderMissing(result.missing_info || [])}
      ${typeof renderGlossary === 'function' ? renderGlossary(result) : ''}
      <div class="share-bar">
        <button type="button" class="ghost" data-act="copy">${ICO_COPY}<span>คัดลอกผล</span></button>
        <button type="button" class="ghost" data-act="share">${ICO_SHARE}<span>แชร์รายงาน</span></button>
        <button type="button" class="ghost" data-act="pdf">${ICO_PDF}<span>บันทึก PDF</span></button>
      </div>
      <p class="disclaimer">${esc(CONFIG.messages.disclaimer)}</p>
    </article>`;
  if (typeof linkifyGlossary === 'function') linkifyGlossary(els.result);
  watchIssueIndex();
}


/* ---------- 5. ACTIONS ---------- */

// ปิดปุ่มระหว่างประมวลผล และปิดทั้งหมดถ้ายังไม่ได้ล็อกอิน
let busyNow = false;

// ปุ่มตรวจกดได้เมื่อล็อกอินแล้ว มีข้อความ และไม่ได้กำลังตรวจอยู่
function updateCheckState() {
  els.checkBtn.disabled = busyNow || !currentUser || !els.input.value.trim();
}

function setBusy(busy) {
  busyNow = busy;
  updateCheckState();
  els.clearBtn.disabled = busy;
  els.checkBtn.textContent = busy ? 'กำลังตรวจ...' : checkLabel();
}

async function runCheck() {
  if (!currentUser) {
    renderEmpty(CONFIG.messages.loginFirst);
    return;
  }
  // เครดิตหมด: พาไปหน้าเติมเครดิตแทนการส่งคำขอที่จะถูกปฏิเสธ
  if (lastCredits === 0) {
    document.getElementById('authToggle')?.click();
    return;
  }

  const text = els.input.value.trim();
  if (!text) {
    renderEmpty(CONFIG.messages.noInput);
    return;
  }

  setBusy(true);
  showLoading();

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
      if (r.status === 0) {
        renderRetry(CONFIG.messages.network);
        return;
      }
      renderEmpty(r.status === 402 ? CONFIG.messages.noCredit : (r.data.error || CONFIG.messages.network));
      return;
    }

    viewerSrc = { result: r.data.result, text };
    renderResult(r.data.result);
    if (typeof r.data.credits === 'number') toast('ใช้ 1 เครดิต · เหลือ ' + r.data.credits + ' เครดิต');
    addDetectBanner(r.data.result, contractType);
    if (r.data.audio) {
      els.result.insertAdjacentHTML('afterbegin',
        `<audio controls src="data:audio/mpeg;base64,${r.data.audio}" style="width:100%;margin-bottom:12px"></audio>`);
    }
    if (r.data.voiceError) {
      els.result.insertAdjacentHTML('afterbegin', `<p class="notfound">${esc(r.data.voiceError)}</p>`);
    }
    els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } finally {
    stopLoading();
    setBusy(false);
  }
}

/* ---------- 5b. อัปโหลดไฟล์ ---------- */
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_EXT = ['txt', 'pdf', 'docx', 'jpg', 'jpeg', 'png', 'webp'];

// ไฟล์ .txt อ่านในเครื่อง ส่วน PDF, Word และรูปภาพส่งไปให้เซิร์ฟเวอร์อ่าน
async function handleUpload(file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
  if (!UPLOAD_EXT.includes(ext)) {
    alert('รองรับไฟล์ .txt, .pdf, .docx, JPG, PNG และ WEBP');
    return;
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    alert('ไฟล์ต้องมีขนาดไม่เกิน 5 MB');
    return;
  }

  if (ext === 'txt') {
    const reader = new FileReader();
    reader.onload = function () {
      els.input.value = String(reader.result || '');
      els.input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    reader.readAsText(file, 'utf-8');
    return;
  }

  if (!currentUser) {
    alert('กรุณาเข้าสู่ระบบก่อนอัปโหลดไฟล์');
    return;
  }

  const countEl = document.getElementById('taCount');
  if (countEl) countEl.textContent = 'กำลังอ่านไฟล์...';
  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });
    const r = await api(CONFIG.api.extract, 'POST', { name: file.name, data: base64 });
    if (typeof r.data.credits === 'number') showCredits(r.data.credits, r.data.voiceCredits);
    if (!r.ok) {
      alert(r.data.error || 'อ่านไฟล์ไม่สำเร็จ');
      return;
    }
    els.input.value = r.data.text;
  } catch (err) {
    alert('อ่านไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง');
  } finally {
    // อัปเดตตัวนับและปุ่มตรวจให้ตรงกับข้อความที่อยู่ในกล่องจริง
    els.input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function clearAll() {
  const hasText = els.input.value.trim() !== '';
  if (hasText && !confirm(CONFIG.messages.clearConfirm)) return;
  els.input.value = '';
  // แจ้งให้ช่องอื่นที่ฟังการพิมพ์ (ตัวนับตัวอักษร ปุ่มล้าง) อัปเดตตาม
  els.input.dispatchEvent(new Event('input', { bubbles: true }));
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
  els.input.addEventListener('input', updateCheckState);
  els.result.addEventListener('click', async function (e) {
    const btn = e.target.closest('[data-act]');
    if (!btn || !lastResult) return;
    if (btn.dataset.act === 'jump') {
      const all = [...els.result.querySelectorAll('details.item')];
      const idx = all.indexOf(btn.closest('details.item'));
      if (typeof openViewer === 'function') openViewer(idx);
      else jumpToQuote(btn.closest('details.item')?.querySelector('blockquote')?.textContent || '');
      return;
    }
    if (btn.dataset.act === 'more') {
      const p = btn.previousElementSibling;
      if (p && p.classList.contains('it-text')) {
        const open = p.classList.toggle('clamp');
        btn.textContent = open ? 'อ่านเพิ่มเติม' : 'แสดงน้อยลง';
      }
      return;
    }
    if (btn.dataset.act === 'sgtab') {
      // สลับแท็บ ข้อความเดิม / ข้อความแนะนำ / เปรียบเทียบ ภายในการ์ดเดียวกัน
      const box = btn.closest('.sg-more');
      if (!box) return;
      box.querySelectorAll('.sg-tab').forEach(t => {
        const on = t === btn;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      box.querySelectorAll('.sg-panel').forEach(p => { p.hidden = p.dataset.panel !== btn.dataset.tab; });
      return;
    }
    if (btn.dataset.act === 'copyfix') {
      const old = btn.dataset.copy === 'old';
      const t = btn.closest('.sg-more')?.querySelector(old ? '.tx-old' : '.tx-new')?.textContent || '';
      const ok = t ? await copyText(t) : false;
      toast(ok ? (old ? 'คัดลอกข้อความเดิมแล้ว' : 'คัดลอกข้อความที่แนะนำแล้ว') : 'คัดลอกไม่สำเร็จ ลองอีกครั้ง');
      return;
    }
    if (btn.dataset.act === 'pdf') {
      // เปิดหน้าต่างพิมพ์ของเครื่อง เลือก "บันทึกเป็น PDF" (iPhone: แชร์ → บันทึกลงไฟล์)
      document.body.classList.add('printing-report');
      // กางส่วนที่พับไว้ให้ครบก่อนพิมพ์ แล้วคืนสถานะเดิมหลังพิมพ์
      const folded = [...els.result.querySelectorAll('.sg-more:not([open])')];
      folded.forEach(d => { d.open = true; });
      const done = () => {
        document.body.classList.remove('printing-report');
        folded.forEach(d => { d.open = false; });
      };
      window.addEventListener('afterprint', done, { once: true });
      toast('เลือก "บันทึกเป็น PDF" ในหน้าต่างถัดไป');
      setTimeout(() => window.print(), 350);
      setTimeout(done, 60000);
      return;
    }
    const text = buildShareText(lastResult);
    if (btn.dataset.act === 'save') {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ผลตรวจสัญญา.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('บันทึกไฟล์แล้ว');
      return;
    }
    if (btn.dataset.act === 'copy') {
      const ok = await copyText(text);
      toast(ok ? 'คัดลอกผลตรวจแล้ว วางในแอปอื่นได้เลย' : 'คัดลอกไม่สำเร็จ ลองอีกครั้ง');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ผลตรวจสัญญา', text });
      } catch (err) { /* ผู้ใช้ยกเลิกการแชร์ */ }
    } else {
      const ok = await copyText(text);
      toast(ok ? 'เบราว์เซอร์นี้แชร์ไม่ได้ จึงคัดลอกให้แทนแล้ว' : 'แชร์ไม่สำเร็จ ลองอีกครั้ง');
    }
  });
  const fileIn = document.getElementById('fileIn');
  if (fileIn) {
    fileIn.addEventListener('change', function () {
      const f = fileIn.files && fileIn.files[0];
      fileIn.value = '';
      if (f) handleUpload(f);
    });
  }
  els.result.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'ixSearch') { ixQuery = e.target.value; applyFilter(filterLevel); }
  });
  els.result.addEventListener('click', function (e) {
    if (e.target.closest('[data-ccnext]')) { ccOpenNext(); return; }
    const row = e.target.closest('[data-jumpidx]');
    if (row) { focusIssue(+row.dataset.jumpidx); return; }
    const fl = e.target.closest('[data-ixfilter]');
    if (fl) { applyFilter(fl.dataset.ixfilter); return; }
    const nv = e.target.closest('[data-ixnav]');
    if (nv) { navBack(nv.dataset.ixnav); return; }
    const rv = e.target.closest('[data-review]');
    if (rv) {
      const k = +rv.dataset.review;
      if (reviewed.has(k)) reviewed.delete(k); else reviewed.add(k);
      syncReview();
      return;
    }
    const more = e.target.closest('[data-ixmore]');
    if (more) {
      const open = more.getAttribute('aria-expanded') !== 'true';
      els.result.querySelectorAll('[data-ixextra]').forEach(r => { r.hidden = !open; });
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'แสดงน้อยลง' : 'ดูทั้ง ' + els.result.querySelectorAll('[data-ixcard]').length + ' ประเด็น ›';
      return;
    }
    const j = e.target.closest('[data-jumplv]');
    if (!j) return;
    const target = els.result.querySelector('details.item.lv-' + j.dataset.jumplv);
    if (!target) { toast('ไม่มีรายการในระดับนี้'); return; }
    focusIssue([...els.result.querySelectorAll('details.item')].indexOf(target));
  });
  els.clearBtn.addEventListener('click', clearAll);

  showLoggedOut();
  restoreSession();
}

document.addEventListener('DOMContentLoaded', init);
