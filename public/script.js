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
function renderSummary(counts) {
  const c = { check_detail: counts.check_detail || 0, caution: counts.caution || 0, low: counts.low || 0 };
  const total = c.check_detail + c.caution + c.low;
  const top = c.check_detail ? 'check_detail' : (c.caution ? 'caution' : 'low');
  const pct = total ? Math.round((c[top] / total) * 100) : 0;
  const rows = ['check_detail', 'caution', 'low'].filter(k => k !== top).map(k =>
    `<div class="sum-row lv-${k}" data-jumplv="${k}" role="button" tabindex="0"><span>${CONFIG.levelLabel[k]}</span><b>${pad2(c[k])} รายการ</b></div>`).join('');
  return `<div class="summary sum-panel lv-${top}">
    <div class="sum-top" data-jumplv="${top}" role="button" tabindex="0"><span>${CONFIG.levelLabel[top]}</span><b>${pad2(c[top])}</b></div>
    <div class="sum-bar" role="img" aria-label="สัดส่วน ${pct}%"><i style="width:${pct}%"></i></div>
    ${rows}
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
  return `<blockquote class="hl-quote">${esc(item.quote)}</blockquote>
    <div class="src-row"><span>อ้างอิงจากข้อความในสัญญา</span>${hasViewer() ? '<button type="button" class="src-link" data-act="jump">ดูข้อความต้นฉบับ <i aria-hidden="true">›</i></button>' : ''}</div>`;
}

// บนมือถือเปิดแค่สองรายการแรก (เรียงจากความเสี่ยงสูงสุด) ที่เหลือพับไว้ให้แตะเปิดเอง
function openByDefault(index) {
  return window.matchMedia('(max-width: 767px)').matches ? index < 2 : true;
}

const ICO_WARN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17.2v.1"/></svg>';

function renderItem(item, index) {
  const lv = ['check_detail', 'caution', 'low'].includes(item.level) ? item.level : 'low';
  return `<details class="item lv-${lv}" ${openByDefault(index) ? 'open' : ''}>
    <summary>
      <span class="it-ico">${ICO_WARN}</span>
      <span class="it-title"><em>${pad2(index + 1)} —</em> <b>${esc(item.title)}</b></span>
      <span class="tag">${esc(CONFIG.levelLabel[item.level] || '')}</span>
    </summary>
    ${item.explanation ? `<p class="it-lbl">เหตุผลที่ควรตรวจสอบ</p><p class="it-text${item.explanation.length > 110 ? ' clamp' : ''}">${esc(item.explanation)}</p>${item.explanation.length > 110 ? '<button type="button" class="more-btn" data-act="more">อ่านเพิ่มเติม</button>' : ''}` : ''}
    ${renderQuote(item)}
    ${item.reference ? `<p class="it-ref">📚 แนวทางตรวจ: ${esc(item.reference)}</p>` : ''}
    ${item.suggested_fix ? `<div class="it-sug"><h4><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>ข้อเสนอแนะ</h4>${item.missing || !item.quote ? '' : `<p class="cmp-lbl">ข้อความเดิม</p><p class="cmp-old">${esc(item.quote)}</p><p class="cmp-lbl">ข้อความที่แนะนำ</p>`}<p class="cmp-new">${esc(item.suggested_fix)}</p><button type="button" class="more-btn" data-act="copyfix">คัดลอกข้อความที่แนะนำ</button></div>` : ''}
    ${item.how_to_negotiate ? `<div class="it-sug"><h4>วิธีรับมือ</h4><p>${esc(item.how_to_negotiate)}</p></div>` : ''}
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
  const items = Array.isArray(result.items) ? result.items : [];
  const meta = reportMeta();

  const body = items.length
    ? items.map((it, i) => renderItem(it, i)).join('')
    : `<p class="empty">${esc(CONFIG.messages.noHit)}</p>`;

  els.result.innerHTML = `
    <article class="rpt">
      <header class="rpt-head">
        <p class="rpt-kicker">ANALYSIS REPORT <span>· ${esc(meta.no)}</span></p>
        <h3 class="rpt-title">ผลการตรวจสอบสัญญา</h3>
        <p class="rpt-meta">${meta.typeText ? 'ประเภทเอกสาร: ' + esc(meta.typeText) + ' · ' : ''}${esc(meta.date)}</p>
      </header>
      ${renderSummary(result.risk_counts || { check_detail: 0, caution: 0, low: 0 })}
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
      const idx = all.indexOf(btn.closest('details'));
      if (typeof openViewer === 'function') openViewer(idx);
      else jumpToQuote(btn.closest('details')?.querySelector('blockquote')?.textContent || '');
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
    if (btn.dataset.act === 'copyfix') {
      const t = btn.parentElement.querySelector('.cmp-new')?.textContent || '';
      toast((await copyText(t)) ? 'คัดลอกข้อความที่แนะนำแล้ว' : 'คัดลอกไม่สำเร็จ ลองอีกครั้ง');
      return;
    }
    if (btn.dataset.act === 'pdf') {
      // เปิดหน้าต่างพิมพ์ของเครื่อง เลือก "บันทึกเป็น PDF" (iPhone: แชร์ → บันทึกลงไฟล์)
      document.body.classList.add('printing-report');
      const done = () => document.body.classList.remove('printing-report');
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
  els.result.addEventListener('click', function (e) {
    const j = e.target.closest('[data-jumplv]');
    if (!j) return;
    const target = els.result.querySelector('details.item.lv-' + j.dataset.jumplv);
    if (!target) { toast('ไม่มีรายการในระดับนี้'); return; }
    target.open = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  els.clearBtn.addEventListener('click', clearAll);

  showLoggedOut();
  restoreSession();
}

document.addEventListener('DOMContentLoaded', init);
