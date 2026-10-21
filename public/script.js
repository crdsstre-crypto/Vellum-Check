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

function showCredits(n, voice) {
  lastCredits = typeof n === 'number' ? n : null;
  els.creditsLine.textContent = `เครดิตตรวจคงเหลือ ${n} · เครดิตเสียงคงเหลือ ${voice ?? 0}`;

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

function renderResult(result) {
  lastResult = result;
  const items = Array.isArray(result.items) ? result.items : [];

  const body = items.length
    ? items.map(renderItem).join('')
    : `<p class="empty">${esc(CONFIG.messages.noHit)}</p>`;

  els.result.innerHTML = `
    <div class="share-bar">
      <button type="button" class="ghost" data-act="copy">คัดลอกผลตรวจ</button>
      <button type="button" class="ghost" data-act="share">แชร์ผลตรวจ</button>
    </div>
    ${renderSummary(result.risk_counts || { check_detail: 0, caution: 0, low: 0 })}
    ${renderBrief(result.summary || {})}
    ${body}
    ${renderMissing(result.missing_info || [])}
    <p class="disclaimer">${esc(CONFIG.messages.disclaimer)}</p>`;
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
    const text = buildShareText(lastResult);
    if (btn.dataset.act === 'copy') {
      const ok = await copyText(text);
      btn.textContent = ok ? 'คัดลอกแล้ว' : 'คัดลอกไม่สำเร็จ';
      setTimeout(() => { btn.textContent = 'คัดลอกผลตรวจ'; }, 1800);
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ผลตรวจสัญญา', text });
      } catch (err) { /* ผู้ใช้ยกเลิกการแชร์ */ }
    } else {
      const ok = await copyText(text);
      btn.textContent = ok ? 'คัดลอกแล้ว (แชร์ไม่รองรับ)' : 'ทำไม่สำเร็จ';
      setTimeout(() => { btn.textContent = 'แชร์ผลตรวจ'; }, 1800);
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
  els.clearBtn.addEventListener('click', clearAll);

  showLoggedOut();
  restoreSession();
}

document.addEventListener('DOMContentLoaded', init);
