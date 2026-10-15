/* =====================================================
   เช็กสัญญา — script.js
   ควบคุมการทำงานของหน้าเว็บ (ปุ่ม และการแสดงผล)
   กฎการตรวจอยู่ที่ rules.js ไม่ต้องแก้ไฟล์นี้เพื่อเพิ่มคำสำคัญ

   โครงสร้างไฟล์
   1. CONFIG      ค่าที่ปรับได้ (ข้อความ, ระดับความเสี่ยง, ระยะตัวอย่าง)
   2. HELPERS     ฟังก์ชันช่วยเหลือ
   3. DETECTION   ค้นหาคำสำคัญในข้อความ
   4. RENDERING   สร้าง HTML ของผลลัพธ์
   5. ACTIONS     การทำงานของปุ่มตรวจ / ล้าง
   6. INIT        เริ่มต้นและผูกปุ่มเข้ากับฟังก์ชัน
   ===================================================== */


/* ---------- 1. CONFIG ---------- */
const CONFIG = {
  levelLabel: { high: 'ควรระวังมาก', mid: 'ควรพิจารณา', low: 'ควรสังเกต' },
  levelOrder: { high: 0, mid: 1, low: 2 },

  messages: {
    empty:     'ยังไม่มีผลการตรวจ',
    noInput:   'กรุณาวางข้อความสัญญาก่อน',
    noHit:     '✅ ไม่พบคำสำคัญที่ระบบตรวจไว้ ลองอ่านทั้งฉบับอีกครั้งเพื่อความมั่นใจ',
    error:     'เกิดข้อผิดพลาดระหว่างตรวจสัญญา ลองใหม่อีกครั้ง',
    clearConfirm: 'ล้างข้อความสัญญาทั้งหมดใช่ไหม?',
  },

  // ความยาวข้อความที่แสดงรอบคำที่พบ (ตัวอักษรก่อน / หลัง)
  snippetRange: { before: 60, after: 80 },
};


/* ---------- 2. HELPERS ---------- */

// กัน HTML แปลกปลอมจากข้อความสัญญา
function esc(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// escape อักขระพิเศษของ regex
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ตัดข้อความรอบตำแหน่งที่พบคำสำคัญ
function snippetOf(text, idx, len) {
  const { before, after } = CONFIG.snippetRange;
  const start = Math.max(0, idx - before);
  const end = Math.min(text.length, idx + len + after);
  return (start > 0 ? '...' : '')
    + text.slice(start, end).trim()
    + (end < text.length ? '...' : '');
}


/* ---------- 3. DETECTION ---------- */

// หาทุกตำแหน่งของคำสำคัญจากทุกกฎ
function findHits(text) {
  const found = [];
  RULES.forEach(rule => {
    rule.keys.forEach(keyword => {
      let pos = 0, idx;
      while ((idx = text.indexOf(keyword, pos)) !== -1) {
        found.push({ rule, keyword, idx, len: keyword.length });
        pos = idx + keyword.length;
      }
    });
  });
  return found;
}

// จัดกลุ่มผลตามหัวข้อของกฎ
function groupByRule(found) {
  const groups = {};
  found.forEach(hit => {
    const key = hit.rule.label;
    if (!groups[key]) groups[key] = { rule: hit.rule, hits: [] };
    groups[key].hits.push(hit);
  });
  return groups;
}


/* ---------- 4. RENDERING ---------- */

// แสดงข้อความว่าง / ข้อความแจ้งเตือนสั้น ๆ
function renderEmpty(box, message = CONFIG.messages.empty) {
  box.innerHTML = `<p class="empty">${esc(message)}</p>`;
}

// แถบสรุปจำนวนหมวดในแต่ละระดับ
function renderSummary(counts) {
  return `<div class="summary">
    <span class="badge" style="background:var(--high);color:var(--highText)">ระดับสูง ${counts.high}</span>
    <span class="badge" style="background:var(--mid);color:var(--midText)">ระดับกลาง ${counts.mid}</span>
    <span class="badge" style="background:var(--low);color:var(--lowText)">ระดับต่ำ ${counts.low}</span>
  </div>`;
}

// การ์ดของแต่ละหมวดที่พบ
function renderGroup(group, text) {
  const first = group.hits[0];
  const snip = esc(snippetOf(text, first.idx, first.len));
  const keywordHtml = esc(first.keyword);
  const snipHtml = snip.replace(
    new RegExp(escRe(keywordHtml), 'g'),
    m => `<mark>${m}</mark>`
  );

  return `<div class="item ${group.rule.level}">
    <div class="tag">${CONFIG.levelLabel[group.rule.level]} · พบ ${group.hits.length} จุด</div>
    <h3>${esc(group.rule.label)}</h3>
    <div>${esc(group.rule.tip)}</div>
    <div class="snippet">${snipHtml}</div>
  </div>`;
}

// แสดงผลทั้งหมดลงในกล่องผลลัพธ์
function renderResult(text, box) {
  const found = findHits(text);

  if (found.length === 0) {
    renderEmpty(box, CONFIG.messages.noHit);
    return;
  }

  const groups = groupByRule(found);

  const counts = { high: 0, mid: 0, low: 0 };
  Object.values(groups).forEach(g => counts[g.rule.level]++);

  const cards = Object.values(groups)
    .sort((a, b) => CONFIG.levelOrder[a.rule.level] - CONFIG.levelOrder[b.rule.level])
    .map(g => renderGroup(g, text))
    .join('');

  box.innerHTML = renderSummary(counts) + cards;
}


/* ---------- 5. ACTIONS ---------- */

// เลื่อนหน้าจอไปที่ส่วนผลการตรวจ (ทั้งการ์ด ไม่ใช่แค่กล่องข้างใน)
function scrollToResult(box) {
  const target = box.closest('.card') || box;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// กดปุ่ม "ตรวจสัญญา"
function runCheck(input, box) {
  const text = input.value.trim();

  if (!text) {
    renderEmpty(box, CONFIG.messages.noInput);
    return;
  }

  try {
    renderResult(text, box);
    scrollToResult(box);
  } catch (err) {
    // ถ้ามีอะไรผิดพลาด ผู้ใช้จะเห็นข้อความแทนหน้าว่าง
    console.error('[เช็กสัญญา] ตรวจไม่สำเร็จ:', err);
    renderEmpty(box, CONFIG.messages.error);
  }
}

// กดปุ่ม "ล้าง" (ถามยืนยันก่อนถ้ามีข้อความอยู่)
function clearAll(input, box) {
  const hasText = input.value.trim() !== '';
  if (hasText && !confirm(CONFIG.messages.clearConfirm)) return;

  input.value = '';
  renderEmpty(box);
}


/* ---------- 6. INIT ---------- */
function init() {
  // ตรวจว่าไฟล์ที่ต้องใช้โหลดครบ จะได้รู้ปัญหาทันที
  if (typeof RULES === 'undefined') {
    console.error('[เช็กสัญญา] ไม่พบ RULES — ตรวจว่า rules.js โหลดก่อน script.js ใน index.html');
    return;
  }

  const input    = document.getElementById('input');
  const box      = document.getElementById('result');
  const checkBtn = document.getElementById('checkBtn');
  const clearBtn = document.getElementById('clearBtn');

  if (!input || !box || !checkBtn || !clearBtn) {
    console.error('[เช็กสัญญา] ไม่พบ element ที่ต้องใช้ — ตรวจ id ใน index.html ว่าตรงกับ script.js');
    return;
  }

  checkBtn.addEventListener('click', () => runCheck(input, box));
  clearBtn.addEventListener('click', () => clearAll(input, box));
}

document.addEventListener('DOMContentLoaded', init);
