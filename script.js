/* =====================================================
   เช็กสัญญา — script.js
   ควบคุมการทำงานของหน้าเว็บ (ปุ่ม และการแสดงผล)

   ⚠️ ไฟล์นี้ไม่ต้องแก้เพื่อเพิ่มกฎ
   กฎทั้งหมดอยู่ที่ rules.js (ดูวิธีเพิ่มใน README.md)
   ⚠️ rules.js กับ script.js ต้องอัปเดตคู่กันเสมอ

   โครงสร้างไฟล์
   1. CONFIG      ค่าที่ปรับได้ (ข้อความ, ระดับความเสี่ยง, ระยะตัวอย่าง)
   2. HELPERS     ฟังก์ชันช่วยเหลือ
   3. VALIDATION  ตรวจรูปแบบกฎก่อนใช้ กฎที่ผิดจะถูกข้ามและแจ้งใน console
   4. DETECTION   ค้นหาจุดที่พบจากกฎ (keys และ pattern) และตัดจุดซ้อนทับ
   5. RENDERING   สร้าง HTML ของผลลัพธ์ (แสดงทุกจุดที่พบ)
   6. ACTIONS     การทำงานของปุ่มตรวจ / ล้าง
   7. INIT        เริ่มต้นและผูกปุ่มเข้ากับฟังก์ชัน
   ===================================================== */


/* ---------- 1. CONFIG ---------- */
const CONFIG = {
  levelLabel: { high: 'ควรระวังมาก', mid: 'ควรพิจารณา', low: 'ควรสังเกต' },
  levelOrder: { high: 0, mid: 1, low: 2 },

  messages: {
    empty:        'ยังไม่มีผลการตรวจ',
    noInput:      'กรุณาวางข้อความสัญญาก่อน',
    noHit:        '✅ ไม่พบคำสำคัญที่ระบบตรวจไว้ ลองอ่านทั้งฉบับอีกครั้งเพื่อความมั่นใจ',
    error:        'เกิดข้อผิดพลาดระหว่างตรวจสัญญา ลองใหม่อีกครั้ง',
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

// ตัดข้อความรอบตำแหน่งที่พบ
function snippetOf(text, idx, len) {
  const { before, after } = CONFIG.snippetRange;
  const start = Math.max(0, idx - before);
  const end = Math.min(text.length, idx + len + after);
  return (start > 0 ? '...' : '')
    + text.slice(start, end).trim()
    + (end < text.length ? '...' : '');
}


/* ---------- 3. VALIDATION ---------- */

// ตรวจว่ากฎมีรูปแบบถูกต้อง ถ้าไม่ถูกจะคืน false และแจ้งเหตุผลใน console
function isValidRule(rule, index) {
  const problems = [];

  if (!rule || typeof rule !== 'object') {
    problems.push('ไม่ใช่ object');
  } else {
    if (!rule.label) problems.push('ไม่มี label');
    if (!rule.tip) problems.push('ไม่มี tip');
    if (!(rule.level in CONFIG.levelOrder)) problems.push("level ต้องเป็น 'high', 'mid' หรือ 'low'");

    const hasKeys = rule.keys !== undefined;
    const hasPattern = rule.pattern !== undefined;

    if (!hasKeys && !hasPattern) {
      problems.push('ต้องมี keys หรือ pattern อย่างน้อยหนึ่งอย่าง');
    }
    if (hasKeys && !(Array.isArray(rule.keys) && rule.keys.length > 0
        && rule.keys.every(k => typeof k === 'string' && k.length > 0))) {
      problems.push('keys ต้องเป็นรายการข้อความที่ไม่ว่าง');
    }
    if (hasPattern && !(rule.pattern instanceof RegExp)) {
      problems.push('pattern ต้องเป็น RegExp เช่น /ตัวอย่าง/');
    }
    if (rule.check !== undefined && typeof rule.check !== 'function') {
      problems.push('check ต้องเป็นฟังก์ชัน');
    }
  }

  if (problems.length) {
    const name = (rule && rule.label) || 'ไม่มีชื่อ';
    console.warn(`[เช็กสัญญา] ข้ามกฎลำดับที่ ${index + 1} (${name}): ${problems.join(', ')}`);
    return false;
  }
  return true;
}

// กฎที่ผ่านการตรวจแล้ว ใช้ในการค้นหาจริง (ตั้งค่าตอนเริ่มต้นใน init)
let ACTIVE_RULES = [];


/* ---------- 4. DETECTION ---------- */

// กฎแบบคำสำคัญ: หาทุกตำแหน่งที่คำปรากฏ
function findKeywordHits(rule, text, found) {
  rule.keys.forEach(keyword => {
    let pos = 0, idx;
    while ((idx = text.indexOf(keyword, pos)) !== -1) {
      found.push({ rule, keyword, idx, len: keyword.length });
      pos = idx + keyword.length;
    }
  });
}

// กฎแบบรูปแบบ (pattern): ใช้ regex หาข้อความ แล้วให้ check() ตัดสินว่าจะแจ้งหรือไม่
function findPatternHits(rule, text, found) {
  const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g';
  const re = new RegExp(rule.pattern.source, flags);

  for (const m of text.matchAll(re)) {
    if (m[0].length === 0) continue;
    if (!rule.check || rule.check(m)) {
      found.push({ rule, keyword: m[0], idx: m.index, len: m[0].length });
    }
  }
}

// หาทุกจุดที่พบจากกฎทั้งหมด
function findHits(text) {
  const found = [];
  ACTIVE_RULES.forEach(rule => {
    if (rule.keys) findKeywordHits(rule, text, found);
    if (rule.pattern) findPatternHits(rule, text, found);
  });
  return found;
}

// ตัดจุดที่ซ้อนทับกัน: ให้ความสำคัญระดับสูงก่อน แล้วค่อยเลือกคำที่ยาวกว่า
// ผลคือข้อความแต่ละตำแหน่งจะถูกนับเพียงครั้งเดียว
function removeOverlaps(hits) {
  const ranked = [...hits].sort((a, b) =>
    CONFIG.levelOrder[a.rule.level] - CONFIG.levelOrder[b.rule.level]
    || b.len - a.len
    || a.idx - b.idx
  );

  const kept = [];
  ranked.forEach(hit => {
    const overlaps = kept.some(k => hit.idx < k.idx + k.len && k.idx < hit.idx + hit.len);
    if (!overlaps) kept.push(hit);
  });

  return kept.sort((a, b) => a.idx - b.idx);
}

// จัดกลุ่มผลตามชื่อหมวด
function groupByRule(hits) {
  const groups = {};
  hits.forEach(hit => {
    const key = hit.rule.label;
    if (!groups[key]) groups[key] = { rule: hit.rule, hits: [] };
    groups[key].hits.push(hit);
  });
  return groups;
}


/* ---------- 5. RENDERING ---------- */

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

// ตัวอย่างข้อความของจุดที่พบ 1 จุด พร้อมไฮไลต์คำ
function renderSnippet(hit, text) {
  const snip = esc(snippetOf(text, hit.idx, hit.len));
  const keywordHtml = esc(hit.keyword);
  const highlighted = snip.replace(
    new RegExp(escRe(keywordHtml), 'g'),
    m => `<mark>${m}</mark>`
  );
  return `<div class="snippet">${highlighted}</div>`;
}

// การ์ดของแต่ละหมวด แสดงทุกจุดที่พบ
function renderGroup(group, text) {
  const snippets = group.hits.map(hit => renderSnippet(hit, text)).join('');

  return `<div class="item ${group.rule.level}">
    <div class="tag">${CONFIG.levelLabel[group.rule.level]} · พบ ${group.hits.length} จุด</div>
    <h3>${esc(group.rule.label)}</h3>
    <div>${esc(group.rule.tip)}</div>
    ${snippets}
  </div>`;
}

// แสดงผลทั้งหมดลงในกล่องผลลัพธ์
function renderResult(text, box) {
  const hits = removeOverlaps(findHits(text));

  if (hits.length === 0) {
    renderEmpty(box, CONFIG.messages.noHit);
    return;
  }

  const groups = groupByRule(hits);

  const counts = { high: 0, mid: 0, low: 0 };
  Object.values(groups).forEach(g => counts[g.rule.level]++);

  const cards = Object.values(groups)
    .sort((a, b) => CONFIG.levelOrder[a.rule.level] - CONFIG.levelOrder[b.rule.level])
    .map(g => renderGroup(g, text))
    .join('');

  box.innerHTML = renderSummary(counts) + cards;
}


/* ---------- 6. ACTIONS ---------- */

// เลื่อนหน้าจอไปที่การ์ดผลการตรวจทั้งใบ
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


/* ---------- 7. INIT ---------- */
function init() {
  if (typeof RULES === 'undefined' || !Array.isArray(RULES)) {
    console.error('[เช็กสัญญา] ไม่พบ RULES หรือไม่ใช่รายการ — ตรวจว่า rules.js โหลดก่อน script.js และมี const RULES = [...]');
    return;
  }

  ACTIVE_RULES = RULES.filter(isValidRule);
  if (ACTIVE_RULES.length === 0) {
    console.error('[เช็กสัญญา] ไม่มีกฎที่ใช้งานได้เลย — ดูคำเตือนด้านบนเพื่อหาสาเหตุ');
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
