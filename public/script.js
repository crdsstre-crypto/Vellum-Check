/* =====================================================
   เช็กสัญญา — script.js (เวอร์ชันเรียกเซิร์ฟเวอร์)
   ส่งข้อความสัญญาไปที่ /api/check แล้วแสดงผลที่ได้

   ⚠️ ไฟล์นี้ไม่มี API key และไม่ตัดเครดิต ทั้งหมดอยู่ที่ server/
   ⚠️ rules.js ไม่ได้ใช้ในเวอร์ชันนี้แล้ว (ยังโหลดไว้ได้ ไม่มีผลกระทบ)

   โครงสร้าง
   1. CONFIG     ค่าและข้อความ
   2. HELPERS    ฟังก์ชันช่วยเหลือ
   3. RENDERING  แสดงผลจาก JSON ของเซิร์ฟเวอร์
   4. ACTIONS    ปุ่มตรวจ / ล้าง / โหลดเครดิต
   5. INIT       เริ่มต้นและผูกปุ่ม
   ===================================================== */


/* ---------- 1. CONFIG ---------- */
const CONFIG = {
  apiCheck: '/api/check',
  apiMe: '/api/me',
  levelLabel: {
    check_detail: 'ควรตรวจละเอียด',
    caution: 'ควรระวัง',
    low: 'เสี่ยงต่ำ',
  },
  messages: {
    empty:        'ยังไม่มีผลการตรวจ',
    noInput:      'กรุณาวางข้อความสัญญาก่อน',
    loading:      'กำลังตรวจสัญญา รอสักครู่...',
    network:      'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง',
    noHit:        '✅ AI ไม่พบจุดที่ควรตรวจ ลองอ่านทั้งฉบับอีกครั้งเพื่อความมั่นใจ',
    clearConfirm: 'ล้างข้อความสัญญาทั้งหมดใช่ไหม?',
    disclaimer:   'ผลนี้เป็นการคัดกรองเบื้องต้นเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย ควรให้ทนายตรวจก่อนลงนาม',
  },
};

// เก็บ element ที่ใช้บ่อยไว้ตรงนี้ ตั้งค่าใน init()
const els = {};


/* ---------- 2. HELPERS ---------- */

// กัน HTML แปลกปลอมจากข้อความสัญญาหรือจาก AI
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// รหัสเครื่องของผู้ใช้ เก็บไว้ในเบราว์เซอร์ ใช้ระบุตัวตนเพื่อเช็กเครดิตที่ server
// (ไม่ใช่รหัสผ่านและไม่ใช่ความลับ)
function getDeviceId() {
  try {
    let id = localStorage.getItem('vc_device_id');
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('vc_device_id', id);
    }
    return id;
  } catch {
    // ถ้าเบราว์เซอร์ไม่ให้ใช้ localStorage ใช้ค่าชั่วคราวแทน
    return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}


/* ---------- 3. RENDERING ---------- */

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

// แสดงผลทั้งหมดจาก result ของเซิร์ฟเวอร์
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


/* ---------- 4. ACTIONS ---------- */

function showCredits(n) {
  if (els.credits) els.credits.textContent = `เครดิตคงเหลือ ${n}`;
}

// ปิดปุ่มระหว่างประมวลผล กันการกดซ้ำ
function setBusy(busy) {
  els.checkBtn.disabled = busy;
  els.clearBtn.disabled = busy;
  els.checkBtn.textContent = busy ? 'กำลังตรวจ...' : 'ตรวจสัญญา';
}

async function loadCredits() {
  try {
    const res = await fetch(CONFIG.apiMe, {
      headers: { 'X-Device-Id': getDeviceId() },
    });
    const data = await res.json();
    if (typeof data.credits === 'number') showCredits(data.credits);
  } catch {
    // ไม่ต้องแจ้งผู้ใช้ตอนโหลดเครดิตไม่ได้ จะแสดงอีกครั้งเมื่อกดตรวจ
  }
}

async function runCheck() {
  const text = els.input.value.trim();
  if (!text) {
    renderEmpty(CONFIG.messages.noInput);
    return;
  }

  setBusy(true);
  renderEmpty(CONFIG.messages.loading);

  try {
    const res = await fetch(CONFIG.apiCheck, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': getDeviceId(),
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json().catch(() => ({}));
    if (typeof data.credits === 'number') showCredits(data.credits);

    if (!res.ok) {
      // เช่น เครดิตหมด หรือ AI ล้มเหลว (server คืนเครดิตให้แล้ว)
      renderEmpty(data.error || CONFIG.messages.network);
      return;
    }

    renderResult(data.result);
    els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    console.error('[เช็กสัญญา] เรียก API ไม่สำเร็จ:', err);
    renderEmpty(CONFIG.messages.network);
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


/* ---------- 5. INIT ---------- */
function init() {
  els.input    = document.getElementById('input');
  els.result   = document.getElementById('result');
  els.checkBtn = document.getElementById('checkBtn');
  els.clearBtn = document.getElementById('clearBtn');

  if (!els.input || !els.result || !els.checkBtn || !els.clearBtn) {
    console.error('[เช็กสัญญา] ไม่พบ element ที่ต้องใช้ — ตรวจ id ใน index.html ให้ตรงกับ script.js');
    return;
  }

  // สร้างช่องแสดงเครดิตไว้เหนือผลลัพธ์ โดยไม่ต้องแก้ index.html
  els.credits = document.createElement('p');
  els.credits.className = 'credits';
  els.result.parentElement.insertBefore(els.credits, els.result);

  els.checkBtn.addEventListener('click', runCheck);
  els.clearBtn.addEventListener('click', clearAll);

  loadCredits();
}

document.addEventListener('DOMContentLoaded', init);
