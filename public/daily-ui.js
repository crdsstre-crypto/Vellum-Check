/* ===== เช็กอินรายวัน + แต้มแลกเครดิต (หน้าเว็บ) — เซิร์ฟเวอร์: server/daily.js =====
   - แถบบนหน้าตรวจสัญญา: ยังไม่เช็กอินวันนี้ → ปุ่มเช็กอินรับแต้ม
   - หน้าต่างเช็กอิน: รอบ 7 วัน แต้มสะสม แลก 300 แต้ม = ตรวจฟรี 1 ครั้ง
   - ปุ่ม "เช็กอินรายวัน" ในเมนูบัญชี */
(function () {
  'use strict';

  var S = null, box = null, busy = false;
  var ICO_GIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="17" height="11.5" rx="2"/><path d="M2.5 9h19v-1a1 1 0 0 0-1-1h-17a1 1 0 0 0-1 1zM12 7v13.5"/><path d="M12 7c-1.5-3.5-5.5-3.6-5.5-1.2C6.5 7 9 7 12 7zM12 7c1.5-3.5 5.5-3.6 5.5-1.2C17.5 7 15 7 12 7z"/></svg>';
  var ICO_FIRE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.6 3-5.6 3.6-9.4 2.5 1.5 3.6 3.6 3.6 5.6 1-.7 1.6-1.9 1.7-3.1 2.4 1.9 3.6 4.3 3.6 6.9 0 3.5-2.6 6.1-6 6.1z"/></svg>';
  var ICO_COIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 9.5h3.7a1.6 1.6 0 0 1 0 3.2h-2.4a1.6 1.6 0 0 0 0 3.2h3.7"/></svg>';

  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function say(m) { if (typeof toast === 'function') toast(m); }
  function user() { try { return typeof currentUser !== 'undefined' ? currentUser : null; } catch (e) { return null; } }
  function call(path, method) {
    if (typeof api === 'function') return api(path, method || 'GET');
    return fetch(path, { method: method || 'GET', credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); })
      .catch(function () { return { ok: false, status: 0, data: { error: 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง' } }; });
  }
  // มาสคอตเวลลัม (mascot.js) — ถ้าโหลดไม่ได้ใช้ไอคอนเดิมแทน
  var justClaimed = null;   // 'happy' | 'party' หลังกดรับในรอบนี้
  function mood() {
    if (!S) return 'wave';
    if (S.checkedToday) return justClaimed || 'sleep';
    return S.streak === 0 && S.totalDays > 0 ? 'sad' : 'wave';
  }
  function mascot(m, size, fallback) { return window.VCMascot ? window.VCMascot.svg(m, size) : (fallback || ''); }
  /* (6) ชุดแต่งตัวน้อง: ปลดล็อกด้วยเหรียญตรา · เลือกใส่ได้หลายชิ้น (จำไว้ในเครื่อง) · วาดในพิกัดเดียวกับมาสคอต (120×140) */
  var INK = '#3a2a12';
  var ART_OUT = {
    pin: { vb: '72 82 24 24', art: '<g transform="translate(84 94)"><path d="M0-7 2-2h5.5L3 1.3 4.6 6.8 0 3.6-4.6 6.8-3 1.3-7.5-2H-2z" fill="#ffd84d" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/></g>' },
    glasses: { vb: '30 44 60 28', art: '<g fill="rgba(190,225,255,.28)" stroke="' + INK + '" stroke-width="2.4"><circle cx="50" cy="58" r="8.5"/><circle cx="70" cy="58" r="8.5"/></g><path d="M58.5 57q1.5-2 3 0M41.5 56 32 52M78.5 56 88 52" stroke="' + INK + '" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M45 53.5q3-3 6-1.5M65 53.5q3-3 6-1.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>' },
    cap: { vb: '12 -22 108 66', art: '<defs><linearGradient id="cpB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d8cff"/><stop offset=".5" stop-color="#4f5fe0"/><stop offset="1" stop-color="#2c37a6"/></linearGradient>' +
      '<linearGradient id="cpT" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6aea"/><stop offset="1" stop-color="#2f3aa8"/></linearGradient>' +
      '<radialGradient id="cpF" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffdf6"/><stop offset=".7" stop-color="#f6ecd6"/><stop offset="1" stop-color="#e2d2ae"/></radialGradient></defs>' +
      /* ตัวหมวกทรงโดมนุ่ม */
      '<path d="M23 19C24 3 38-11 57-14C76-16 92-6 97 19Z" fill="url(#cpB)" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M31 13C34 3 42-5 52-8" stroke="#aab4ff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>' +
      '<path d="M74 6a5 5 0 1 0 3.6 8.2 4 4 0 1 1-3.6-8.2z" fill="#ffe28a"/>' +
      '<path d="M86 1l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z" fill="#ffe28a"/><path d="M63-6l.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.7.9.4-1.8-1.3-1.2 1.8-.2z" fill="#fff3c4"/>' +
      '<circle cx="50" cy="8" r="1.1" fill="#fff3c4"/><circle cx="82" cy="12" r="1" fill="#fff3c4"/><circle cx="69" cy="-1" r=".9" fill="#fff3c4"/>' +
      /* ปลายผ้าห้อยพับลงซ้าย + ปอมปอม (แกว่ง) */
      '<g class="cp-tl"><g transform="matrix(-1 0 0 1 120 0)"><path d="M52-13C38-12 24-5 15 7C10 14 8 22 9 30L16 29C16 22 19 14 25 8C31 2 40-2 48-3Z" fill="url(#cpT)" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M45-8C34-6 24 0 18 9" stroke="#8e9bff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/><path d="M28 1l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z" fill="#ffe28a"/>' +
      '<g transform="translate(12.5 35)"><circle r="7.2" fill="url(#cpF)" stroke="' + INK + '" stroke-width="2.2"/><path d="M-4-2.5q1.2-1.6 3-1.8M-1.5 3.2q2 .6 3.6-.6M3 -3.6q1.4.8 1.8 2.4" stroke="#d9c79f" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="-2.4" cy="-2.6" r="1.6" fill="#fff" opacity=".9"/></g></g></g>' +
      /* ขอบพับขนนุ่ม */
      '<path d="M18 23Q17 15 26 15Q30 12 36 14Q42 11 48 14Q54 11 60 14Q66 11 72 14Q78 11 84 14Q90 12 94 15Q103 15 102 23Q103 31 94 31Q90 34 84 32Q78 35 72 32Q66 35 60 32Q54 35 48 32Q42 35 36 32Q30 34 26 31Q17 31 18 23Z" fill="url(#cpF)" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M27 21q2-1.6 4 0M41 19q2-1.6 4 0M55 21q2-1.6 4 0M69 19q2-1.6 4 0M83 21q2-1.6 4 0M34 27q2 1.4 4 0M48 26q2 1.4 4 0M62 27q2 1.4 4 0M76 26q2 1.4 4 0" stroke="#d9c79f" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path d="M26 18Q50 15 92 18" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>' },
    bow: { vb: '44 74 32 24', art: '<g transform="translate(60 86)"><path d="M-3-3-14-9v18L-3 3zM3-3 14-9v18L3 3z" fill="#d2343e" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="-4" y="-4.5" width="8" height="9" rx="2.5" fill="#a91f2a" stroke="' + INK + '" stroke-width="2"/><path d="M-11-5-6-2M11-5 6-2" stroke="#ff8a92" stroke-width="1.4" stroke-linecap="round"/></g>' },
    crown: { vb: '12 -34 96 68', art: '' },
    scarf: { vb: '28 62 70 46', art: '<path d="M30 70q30 10 60 0v9q-30 10-60 0z" fill="#d2343e" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M74 78l4 24 9-2-4-24z" fill="#d2343e" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M36 74q24 7 48 0M77 92h8M78 97h8" stroke="#ff8a92" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
    wizard: { vb: '6 -36 108 72', art: '<defs><linearGradient id="wzC" x1="0" x2="1"><stop offset="0" stop-color="#8a6be0"/><stop offset=".45" stop-color="#6243c4"/><stop offset="1" stop-color="#3e2690"/></linearGradient>' +
      '<linearGradient id="wzG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".55" stop-color="#f4c542"/><stop offset="1" stop-color="#c9921f"/></linearGradient>' +
      '<linearGradient id="wzBr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4bd0"/><stop offset="1" stop-color="#36217f"/></linearGradient></defs>' +
      '<path d="M12 22Q14 17 60 16Q106 17 108 22Q100 26 60 26Q20 26 12 22Z" fill="#2e1b6e" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M35 21C40 6 49-9 57-20C62-27 70-32 78-31C85-30 90-25 89-19C86-23 80-24 75-21C72-10 77 6 85 21Q60 25 35 21Z" fill="url(#wzC)" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M42 16C46 4 52-8 58-17" stroke="#b9a2ff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M75-21C79-23 84-22 87-20" stroke="#2a1766" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M67-4a5.5 5.5 0 1 0 4 9 4.4 4.4 0 1 1-4-9z" fill="#ffe28a"/><path d="M50 4l1.5 3.3 3.6.4-2.7 2.4.8 3.5-3.2-1.9-3.2 1.9.8-3.5-2.7-2.4 3.6-.4z" fill="#ffe28a"/><path d="M60-14l.9 2 2.2.3-1.6 1.5.4 2.2-1.9-1.1-1.9 1.1.4-2.2-1.6-1.5 2.2-.3z" fill="#fff3c4"/>' +
      '<path d="M89-19v5" stroke="' + INK + '" stroke-width="1.4"/><path d="M89-15l1.6 3.4 3.7.5-2.7 2.6.7 3.7-3.3-1.8-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="url(#wzG)" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M35 13Q60 19 85 13L87 21Q60 27 33 21Z" fill="url(#wzG)" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="54.5" y="14.5" width="11" height="9.5" rx="1.6" fill="#ffe9a3" stroke="' + INK + '" stroke-width="1.8"/><rect x="57.8" y="17.4" width="4.4" height="3.8" rx=".6" fill="#4a2f96"/>' +
      '<path d="M12 22Q20 26 60 26Q100 26 108 22Q110 27 102 30Q86 33 60 33Q34 33 18 30Q10 27 12 22Z" fill="url(#wzBr)" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/><path d="M22 29Q60 34 98 29" stroke="#8f74ea" stroke-width="1.4" fill="none" opacity=".6"/>' },
    medal: { vb: '30 62 60 56', art: '' },
    laurel: { vb: '20 -17 80 40', art: '' },
  };
  /* หนังตาปรือง่วง (หมวกนอนดาว · หน้า wave เท่านั้น) — ซ่อนไว้ เปิดเป็นจังหวะเฉพาะในฉากท้องฟ้าแห่งความฝัน */
  var CP_LID = '<g class="cp-lid"><path d="M45 58.4V53.5Q50 49.6 55 53.5V58.4Q50 59.6 45 58.4ZM65 58.4V53.5Q70 49.6 75 53.5V58.4Q70 59.6 65 58.4Z" fill="#f7efdc"/><path d="M45.2 58.3Q50 60 54.8 58.3M65.2 58.3Q70 60 74.8 58.3" stroke="' + INK + '" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>';
  /* (2) เหรียญไฟไม่มอดวิวัฒนาการตามสถิติติดต่อกันสูงสุด: 7 ทอง·ไฟส้ม → 14 ทองคำขาว·ไฟฟ้า → 30 เพชร·ไฟม่วง+ปีก */
  var MED = {
    1: { rim: '#e0a92c', disc: '#f4c542', inn: '#e2a524', line: '#9a6a12', hi: '#fff1b8', f1: '#ff6a2b', f2: '#ffe28a', fs: '#7a2a06', r1: '#c8323c', r2: '#a8222c', rs: '#f4c542', name: 'ทอง' },
    2: { rim: '#aebfd2', disc: '#eef4fb', inn: '#c9d6e3', line: '#5d7088', hi: '#ffffff', f1: '#2f7bff', f2: '#d6f0ff', fs: '#0b2a6b', r1: '#23408e', r2: '#1a3070', rs: '#dfe8f2', name: 'ทองคำขาว' },
    3: { rim: '#8a5cff', disc: '#e4d6ff', inn: '#b28bff', line: '#4a2a9a', hi: '#ffffff', f1: '#a64bff', f2: '#f3dcff', fs: '#3a0a6b', r1: '#5b2bb0', r2: '#46208c', rs: '#ffd9ff', name: 'เพชร' }
  };
  var pvTier = 0;   // ดูตัวอย่างระดับในร้าน
  function realTier() { var b = S && S.bestStreak || 0; return b >= 30 ? 3 : b >= 14 ? 2 : 1; }
  function medalTier() { return pvTier || realTier(); }
  function medalArt(t) {
    var c = MED[t] || MED[1];
    return (t === 3 ? '<g transform="translate(60 72) scale(1.22) translate(-60 -72)">' : '') +
      '<path d="M40 72h8l15 15h-8z" fill="' + c.r1 + '" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M80 72h-8L57 87h8z" fill="' + c.r2 + '" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M44 72l15 15M76 72 61 87" stroke="' + c.rs + '" stroke-width="2.2"/>' +
      '<path d="M40 72h8l-1.6 2.4h-8zM80 72h-8l1.6 2.4h8z" fill="#000" opacity=".3"/>' +
      '<path d="M54 104l-3 9 4-2 2 3 2-9z" fill="' + c.r1 + '" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M66 104l3 9-4-2-2 3-2-9z" fill="' + c.r2 + '" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="86.5" r="2.8" fill="none" stroke="' + c.line + '" stroke-width="2"/>' +
      '<g class="md-coin"><path d="' + (t === 2 ? 'M60.0 84.4 L62.5 87.7 L65.2 88.0 L66.8 90.2 L70.9 90.7 L69.3 94.5 L70.4 97.0 L69.3 99.5 L70.9 103.3 L66.8 103.8 L65.2 106.0 L62.5 106.3 L60.0 109.6 L57.5 106.3 L54.8 106.0 L53.2 103.8 L49.1 103.3 L50.7 99.5 L49.6 97.0 L50.7 94.5 L49.1 90.7 L53.2 90.2 L54.8 88.0 L57.5 87.7Z' : 'M60.0 85.8 L61.9 87.3 L64.3 86.7 L65.5 88.8 L67.9 89.1 L68.2 91.5 L70.3 92.7 L69.7 95.1 L71.2 97.0 L69.7 98.9 L70.3 101.3 L68.2 102.5 L67.9 104.9 L65.5 105.2 L64.3 107.3 L61.9 106.7 L60.0 108.2 L58.1 106.7 L55.7 107.3 L54.5 105.2 L52.1 104.9 L51.8 102.5 L49.7 101.3 L50.3 98.9 L48.8 97.0 L50.3 95.1 L49.7 92.7 L51.8 91.5 L52.1 89.1 L54.5 88.8 L55.7 86.7 L58.1 87.3Z') + '" fill="' + c.rim + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="97" r="8.4" fill="' + c.disc + '" stroke="' + c.line + '" stroke-width="1.4"/>' +
      (t === 3 ? '<g class="md-gem"><path d="M60 89 67.5 95.5 60 105.5 52.5 95.5z" fill="#7a4cff" stroke="#fff" stroke-width=".7"/>' +
          '<path d="M60 89l-3.5 6.5h7z" fill="#e9dcff"/><path d="M52.5 95.5 56.5 95.5 60 89z" fill="#b89aff"/><path d="M67.5 95.5 63.5 95.5 60 89z" fill="#cdb5ff"/>' +
          '<path d="M52.5 95.5h4L60 105.5z" fill="#5b2bd6"/><path d="M67.5 95.5h-4L60 105.5z" fill="#8a5cff"/><path d="M56.5 95.5h7L60 105.5z" fill="#a47dff"/>' +
          '<path class="md-rb" d="M53.5 96 66.5 96 60 104.5z" fill="url(#mdRb)" opacity="0"/></g>' +
          '<defs><linearGradient id="mdRb" x1="0" x2="1"><stop offset="0" stop-color="#ff7ad9"/><stop offset=".33" stop-color="#7ad7ff"/><stop offset=".66" stop-color="#b6ff8a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>'
        : '<circle cx="60" cy="97" r="6.3" fill="' + c.inn + '" stroke="' + c.hi + '" stroke-width=".9" opacity=".95"/>') +
      (t === 2 ? '<g stroke="#ffffff" stroke-width=".7" stroke-linecap="round" opacity=".85"><path d="M60 89.6v14.8M53.6 93.3l12.8 7.4M53.6 100.7l12.8-7.4"/><path d="M58.4 90.6 60 92.2l1.6-1.6M58.4 103.4 60 101.8l1.6 1.6M54.8 95.4l2.2-.2-.6-2.2M65.2 98.6l-2.2.2.6 2.2M54.8 98.6l2.2.2-.6 2.2M65.2 95.4l-2.2-.2.6-2.2" fill="none"/></g>' : '') +
      '<path class="md-gl" d="M53.6 94a7 7 0 0 1 5-4.8" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      (t === 3 ? '</g>' : '<g class="md-fl"><path d="M60 102.6c-2.6 0-4.2-1.7-4.2-3.8 0-2.4 1.9-3.4 2.4-5.8 1.4 1 2.2 2.3 2.2 3.5.7-.5 1.1-1.3 1.2-2.1 1.6 1.3 2.4 2.8 2.4 4.4 0 2.2-1.6 3.8-4 3.8z" fill="' + c.f1 + '" stroke="' + c.fs + '" stroke-width=".8"/>' +
      '<path d="M60 102c-1.2 0-2-.8-2-1.9 0-1.4 1.2-1.8 1.4-3.2.9.7 2.6 1.9 2.6 3.2 0 1.1-.8 1.9-2 1.9z" fill="' + c.f2 + '"/></g></g>') +
      '<circle class="md-em" cx="58" cy="92" r=".9" fill="' + c.f2 + '"/><circle class="md-em md-em2" cx="62" cy="92" r=".7" fill="' + c.f2 + '"/>' +
      '<path class="md-tw" d="M67 88l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="#fffbe6"/>' +
      (t === 3 ? '<g class="md-burst" transform="translate(60 96)"><path d="M0-15 1.2-1.2 15 0 1.2 1.2 0 15-1.2 1.2-15 0-1.2-1.2z" fill="#fff"/><path d="M0-7 .7-.7 7 0 .7.7 0 7-.7.7-7 0-.7-.7z" fill="#fff" transform="rotate(45)"/></g></g>' : '');
  }
  /* (1) ออร่าไฟรอบตัวน้องตอนใส่เหรียญ (สีตามระดับเหรียญ) — วาดไว้หลังตัวน้อง */
  function auraArt(t) {   // แสงอุ่นจาง ๆ หลังตัว + ถ่านไฟไม่กี่จุด (ไม่ใช่ลิ้นไฟการ์ตูน)
    var c = MED[t] || MED[1];
    return '<g class="md-aura" aria-hidden="true">' +
      '<circle class="md-ae" cx="22" cy="78" r="1.3" fill="' + c.f2 + '"/><circle class="md-ae md-ae2" cx="98" cy="64" r="1.1" fill="' + c.f2 + '"/><circle class="md-ae md-ae3" cx="30" cy="44" r=".9" fill="' + c.f2 + '"/><circle class="md-ae md-ae4" cx="94" cy="100" r="1.2" fill="' + c.f2 + '"/></g>';
  }


  function backArt(t) {   // ระดับเพชร: ปีกคริสตัลกางหลังตัว + มงกุฎแสงเหนือหัว
    if (t !== 3) return '';
    var fe = function (d, o) { return '<path d="' + d + '" fill="url(#cwG)" stroke="#fff" stroke-width=".8" stroke-linejoin="round" opacity="' + o + '"/>'; };
    var wing = fe('M50 70C34 56 16 50-6 52c10 6 14 11 14 16-8-1-14 0-20 4 10 3 16 7 18 12-6 1-11 4-14 9 12-1 22 1 30 5z', .95) +
      fe('M50 74C38 66 26 62 10 62c6 5 8 9 8 13-5 0-9 2-12 5 8 1 13 4 15 8 9-1 18 0 28 4z', .8) +
      '<path d="M50 70C34 60 18 56 0 56M50 72C36 68 24 68 6 74M50 76C38 76 28 80 16 88" stroke="#fff" stroke-width=".7" fill="none" opacity=".8"/>';
    return '<g class="cw" aria-hidden="true"><defs><linearGradient id="cwG" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".45" stop-color="#d9c6ff" stop-opacity=".8"/><stop offset="1" stop-color="#8a6cff" stop-opacity=".45"/></linearGradient></defs>' +
      '<g class="cw-l">' + wing + '</g><g class="cw-r" transform="translate(120 0) scale(-1 1)"><g class="cw-l2">' + wing + '</g></g></g>' +
      '<g class="halo" aria-hidden="true"><ellipse cx="60" cy="8" rx="20" ry="5" fill="none" stroke="#f3e9ff" stroke-width="2.2"/><ellipse cx="60" cy="8" rx="20" ry="5" fill="none" stroke="#b28bff" stroke-width="5" opacity=".35"/>' +
      '<path class="halo-g" d="M44 6.5a20 5 0 0 1 10-3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  }
  function frontArt(t) {   // ทองคำขาว: ผ้าคลุมไหล่ขนฟูสีขาว + ไอหายใจ
    if (t !== 2) return '';
    var puffs = '', xs = [30, 37, 44, 51, 58, 65, 72, 79, 86, 90];
    xs.forEach(function (x, n) { puffs += '<circle cx="' + x + '" cy="' + (70 + (n % 2 ? 1.5 : -0.5)) + '" r="' + (n % 2 ? 5.2 : 5.8) + '"/>'; });
    return '<g class="fur" transform="translate(0 6)"><g fill="#f4f8ff" stroke="' + INK + '" stroke-width="1.6">' + puffs + '</g>' +
      '<g fill="#f4f8ff">' + puffs.replace(/r="[\d.]+"/g, function (m) { return 'r="' + (parseFloat(m.slice(3)) - 1.6) + '"'; }) + '</g>' +
      '<path d="M36 69q4-3 8 0M50 69q4-3 8 0M64 69q4-3 8 0M78 69q4-3 8 0" stroke="#cfe0f5" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<g class="fur-tail"><path d="M84 74c-1 6-1 12 1 18 2 3 7 3 8 0 2-6 1-12-1-18z" fill="#f4f8ff" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M86 80v8M90 80v8" stroke="#cfe0f5" stroke-width="1" fill="none"/></g></g>' +
      '<g class="brth"><circle cx="72" cy="63" r="2.2" fill="#fff"/><circle cx="76" cy="60" r="3" fill="#fff"/><circle cx="81" cy="58" r="2.4" fill="#fff"/></g>';
  }
  function laurelAura() {   // วงรัศมีทองหมุนช้า + ใบลอเรลทองร่วง (หลังตัวน้อง)
    var rays = ''; for (var k = 0; k < 16; k++) rays += '<path d="M60 70 L' + (60 + 54 * Math.cos(k * Math.PI / 8 - .06)).toFixed(1) + ' ' + (70 + 54 * Math.sin(k * Math.PI / 8 - .06)).toFixed(1) + ' L' + (60 + 54 * Math.cos(k * Math.PI / 8 + .06)).toFixed(1) + ' ' + (70 + 54 * Math.sin(k * Math.PI / 8 + .06)).toFixed(1) + 'z"/>';
    var fall = ''; [[18, 0], [100, 1.3], [32, 2.6], [88, 3.9]].forEach(function (q) { fall += '<path class="lr-fall" style="animation-delay:-' + q[1] + 's" transform="translate(' + q[0] + ' 10)" d="M0 0c-2-1.3-2.4-4-.1-6 2.3 2 1.9 4.7.1 6z" fill="#f4c542"/>'; });
    return '<g class="lr-aura" aria-hidden="true"><circle cx="60" cy="70" r="58" fill="url(#lrHalo)"/><g class="lr-rays" fill="url(#lrRay)">' + rays + '</g>' + fall +
      '<defs><radialGradient id="lrRay" cx="60" cy="70" r="54" gradientUnits="userSpaceOnUse"><stop offset=".25" stop-color="#ffe08a" stop-opacity=".28"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient><radialGradient id="lrHalo"><stop offset="0" stop-color="#ffe08a" stop-opacity=".35"/><stop offset=".6" stop-color="#f4c542" stop-opacity=".12"/><stop offset="1" stop-color="#f4c542" stop-opacity="0"/></radialGradient></defs></g>';
  }
  /* มาลัยตำนาน v3 (แบบ A): มงกุฎลอเรลลอยเหนือหัว · ใบเรียวทองขัดเงาสลับใบแก้วแสง · อัญมณีหยดน้ำ · ประกายปลายใบ
     โตตามวันเช็กอินรวม: ขั้น 1 ได้รับ (100 วัน) · ขั้น 2 รวม 130 วัน ใบเพิ่ม+ประกาย · ขั้น 3 รวม 160 วัน วงรัศมีด้านหลัง */
  function LR3(o) {
    o = Object.assign({ cx: 60, cy: -1, rx: 34, ry: 9, tilt: -6, n: 9, glassEvery: 3, glassMode: 'mix', open: false, L: 15, W: 2.1, ang: 34, gem: 'drop', id: 'z' }, o);
    var I = o.id, P = [];
    function pt(t) { return [o.cx + o.rx * Math.cos(t), o.cy + o.ry * Math.sin(t)]; }
    function f(v) { return v.toFixed(2); }
    var defs = '<defs>' +
      '<linearGradient id="m' + I + '" x1="0" y1="-1" x2="0" y2="1" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffd75a"/><stop offset=".55" stop-color="#a8700f"/><stop offset=".75" stop-color="#ffe89a"/><stop offset="1" stop-color="#7a4d08"/></linearGradient>' +
      '<linearGradient id="g' + I + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6d6" stop-opacity=".2"/><stop offset=".6" stop-color="#fff2b8" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".95"/></linearGradient>' +
      '<radialGradient id="h' + I + '"><stop offset="0" stop-color="#fff2b8" stop-opacity=".75"/><stop offset=".5" stop-color="#ffd75a" stop-opacity=".25"/><stop offset="1" stop-color="#ffd75a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="r' + I + '" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#ffe1a8"/><stop offset=".6" stop-color="#f08a1c"/><stop offset="1" stop-color="#a3300a"/></radialGradient>' +
      '<linearGradient id="w' + I + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a0c"/><stop offset=".5" stop-color="#fff0b0"/><stop offset="1" stop-color="#8a5a0c"/></linearGradient></defs>';
    // กิ่ง: ซ้าย = ไล่ θ จากหลังไปหน้าทางซ้าย, ขวา = สมมาตร
    var a0 = o.open ? Math.PI * 1.5 - .55 : Math.PI * 1.5 - .12, a1 = Math.PI / 2 + .16;
    var leaves = [], stems = [[], []];
    [-1, 1].forEach(function (side, si) {
      var A = side < 0 ? a0 : Math.PI * 3 - a0, B = side < 0 ? a1 : Math.PI - a1 + 0; // right mirrors via cos sign
      for (var k = 0; k <= 40; k++) { var t = a0 + (a1 - a0) * k / 40; var p = pt(t); if (side > 0) p[0] = 2 * o.cx - p[0]; stems[si].push(p); }
      for (var j = 0; j < o.n; j++) {
        var u = (j + .5) / o.n, t = a0 + (a1 - a0) * u, p = pt(t), q = pt(t + (a1 - a0) * .01);
        if (side > 0) { p[0] = 2 * o.cx - p[0]; q[0] = 2 * o.cx - q[0]; }
        var dir = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
        var back = Math.sin(t) < -.05, sz = (.7 + .4 * Math.sin(Math.PI * Math.min(1, u * 1.15))) * (back ? .85 : 1);
        [1, -1].forEach(function (s, si2) {
          var glass = o.glassMode === 'all' ? true : o.glassMode === 'none' ? false : ((j + si2) % o.glassEvery === 0);
          leaves.push({ x: p[0], y: p[1], r: dir, s: s, side: side, sz: sz, back: back, glass: glass, depth: Math.sin(t) });
        });
      }
      // ใบปลาย
      var pe = pt(a1), qe = pt(a1 - .05); if (side > 0) { pe[0] = 2 * o.cx - pe[0]; qe[0] = 2 * o.cx - qe[0]; }
      leaves.push({ x: pe[0], y: pe[1], r: Math.atan2(pe[1] - qe[1], pe[0] - qe[0]) * 180 / Math.PI, s: 0, side: side, sz: .55, back: false, glass: false, depth: 1 });
    });
    leaves.sort(function (a, b) { return a.depth - b.depth; });
    function leaf(l) {
      var L = o.L * l.sz, W = o.W * l.sz * 2.2;
      var d = 'M0 0C' + f(L * .25) + ' ' + f(-W) + ' ' + f(L * .7) + ' ' + f(-W * .9) + ' ' + f(L) + ' 0 ' + f(L * .7) + ' ' + f(W * .9) + ' ' + f(L * .25) + ' ' + f(W) + ' 0 0z';
      var tf = 'translate(' + f(l.x) + ' ' + f(l.y) + ') rotate(' + f(l.r + l.s * o.ang) + ')';
      var op = l.back ? ' opacity=".55"' : '';
      if (l.glass) return '<g transform="' + tf + '"' + op + ' class="lv-gl"><path d="' + d + '" fill="url(#g' + I + ')" stroke="#fff6d6" stroke-width=".45"/><path d="M.5 0H' + f(L * .9) + '" stroke="#fff" stroke-width=".35" opacity=".9"/></g>';
      return '<g transform="' + tf + '"' + op + '><path d="' + d + '" fill="url(#m' + I + ')" stroke="#5a3a06" stroke-width=".4" transform="scale(1 1)"/><path d="M.5 0H' + f(L * .9) + '" stroke="#fff6d6" stroke-width=".3" opacity=".8"/></g>';
    }
    function poly(a) { return a.map(function (p, i) { return (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); }).join(''); }
    var disc = (o.disc ? '<g class="lr-disc"><circle cx="' + o.cx + '" cy="' + (o.cy + 14) + '" r="46" fill="url(#h' + I + ')" opacity=".8"/><circle cx="' + o.cx + '" cy="' + (o.cy + 14) + '" r="40" fill="none" stroke="#ffe89a" stroke-width=".6" stroke-dasharray="1 3" opacity=".7"/></g>' : ''); if (o.part === 'back') return defs + disc; var out = defs + (o.part === 'front' ? '' : disc) + '<g class="lr-halo"><ellipse cx="' + o.cx + '" cy="17" rx="30" ry="5" fill="url(#h' + I + ')"/></g>';
    out += '<g class="lr-float"><g transform="rotate(' + o.tilt + ' ' + o.cx + ' ' + o.cy + ')">';
    out += '<path d="' + poly(stems[0]) + poly(stems[1]) + '" stroke="url(#w' + I + ')" stroke-width=".9" fill="none" stroke-linecap="round"/>';
    out += leaves.filter(function (l) { return l.back; }).map(leaf).join('');
    out += leaves.filter(function (l) { return !l.back; }).map(leaf).join('');
    var g = pt(Math.PI / 2), gx = g[0], gy = g[1] + 1;
    if (o.gem === 'drop') out += '<g class="lr-gem"><circle cx="' + gx + '" cy="' + (gy + 4) + '" r="7" fill="url(#h' + I + ')"/><circle cx="' + gx + '" cy="' + gy + '" r="1.6" fill="url(#m' + I + ')" stroke="#5a3a06" stroke-width=".3"/><path d="M' + gx + ' ' + (gy + 1.2) + 'c-2.8 3.4-3.4 5.4-3.4 6.6a3.4 3.4 0 0 0 6.8 0c0-1.2-.6-3.2-3.4-6.6z" fill="url(#r' + I + ')" stroke="#7a2a06" stroke-width=".4"/><ellipse cx="' + (gx - 1.1) + '" cy="' + (gy + 6.6) + '" rx=".8" ry="1.3" fill="#fff" opacity=".9"/></g>';
    else out += '<g class="lr-gem"><circle cx="' + gx + '" cy="' + gy + '" r="6" fill="url(#h' + I + ')"/><path d="M' + gx + ' ' + (gy - 4) + 'l1.2 2.8 2.8 1.2-2.8 1.2L' + gx + ' ' + (gy + 4) + 'l-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#fff" stroke="#ffd75a" stroke-width=".4"/></g>';
    // ประกายปลายใบ
    var tips = o.tips === false ? [] : leaves.filter(function (l) { return !l.back && !l.glass && l.s === 1; }).slice(-3);
    tips.forEach(function (l, i) { var rr = (l.r + l.s * o.ang) * Math.PI / 180, L = o.L * l.sz; out += '<path class="lr-tw" style="animation-delay:' + (i * .7) + 's" transform="translate(' + f(l.x + L * Math.cos(rr)) + ' ' + f(l.y + L * Math.sin(rr)) + ')" d="M0-3 .4-.4 3 0 .4.4 0 3-.4.4-3 0-.4-.4z" fill="#fff"/>'; });
    return out + '</g></g>';
  }
  function lrStage() { var b = S && S.totalDays || 0; return b >= 160 ? 3 : b >= 130 ? 2 : 1; }
  function lrOpt(st, part) { return { id: 'L' + st + (part || ''), n: st === 1 ? 7 : st === 2 ? 9 : 11, tips: st >= 2, disc: st === 3, part: part }; }
  function laurelArt(st, part) { return LR3(lrOpt(st || lrStage(), part)); }
  /* มงกุฎตำนาน v2: ทองขัดเงา · กำมะหยี่แดง · มุกที่ยอด · ทับทิม/ไพลินเจียระไน · ประกาย */
  function crownArt() {   // มงกุฎอิมพีเรียล: ขอบกว้างครอบหัวม้วน + ขนเออร์มีน · โค้งทองไขว้ + ลูกแก้วยอด · ยอดลายใบไม้สลับไข่มุก · อัญมณีเจียระไน (พิกัดเดียวกับมาสคอต)
    var D = '#4a2e05';
    var o = '<defs>' +
      '<linearGradient id="crG" x1="0" y1="-30" x2="0" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff6cf"/><stop offset=".3" stop-color="#ffd75a"/><stop offset=".6" stop-color="#c88a16"/><stop offset=".8" stop-color="#ffe9a0"/><stop offset="1" stop-color="#9a6410"/></linearGradient>' +
      '<linearGradient id="crB" x1="0" y1="12" x2="0" y2="25" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff3c0"/><stop offset=".3" stop-color="#f0bf45"/><stop offset=".65" stop-color="#a8700f"/><stop offset="1" stop-color="#e8b23a"/></linearGradient>' +
      '<radialGradient id="crV" cx=".45" cy=".3" r=".75"><stop offset="0" stop-color="#e2324e"/><stop offset=".55" stop-color="#a01030"/><stop offset="1" stop-color="#4a0414"/></radialGradient>' +
      '<radialGradient id="crO" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff8dc"/><stop offset=".45" stop-color="#f4c542"/><stop offset="1" stop-color="#8a5a0c"/></radialGradient>' +
      '<radialGradient id="crR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd0d8"/><stop offset=".35" stop-color="#ff3456"/><stop offset="1" stop-color="#6a0418"/></radialGradient>' +
      '<radialGradient id="crS" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d6ecff"/><stop offset=".35" stop-color="#3a7bff"/><stop offset="1" stop-color="#0a1f6a"/></radialGradient>' +
      '<radialGradient id="crE" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d4ffe8"/><stop offset=".4" stop-color="#22b874"/><stop offset="1" stop-color="#05502e"/></radialGradient>' +
      '<radialGradient id="crP" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#f1e8d8"/><stop offset="1" stop-color="#b4a68a"/></radialGradient>' +
      '<linearGradient id="crW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6ddd0"/></linearGradient></defs>';
    var B = function (t) { var u = 1 - t; return [u * u * u * 24 + 3 * u * u * t * 24 + 3 * u * t * t * 96 + t * t * t * 96, u * u * u * 13 + 3 * u * u * t * -24 + 3 * u * t * t * -24 + t * t * t * 13]; };
    var pearl = function (x, y, r) { return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="url(#crP)" stroke="' + D + '" stroke-width=".5"/>'; };
    // กำมะหยี่ทรงโดม + รอยพับ
    o += '<path d="M25 14C25-10 40-18 60-18S95-10 95 14z" fill="url(#crV)" stroke="' + D + '" stroke-width="1"/>' +
      '<path d="M38 12C38-2 44-10 50-13M70 12C72-2 76-8 82-10" stroke="#5a0618" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round"/><path d="M33 4C35-6 41-11 48-13" stroke="#ff8a9c" stroke-width="1.3" fill="none" opacity=".55" stroke-linecap="round"/>';
    // โค้งทองไขว้ (ด้านข้าง + กลาง)
    var arc = 'M24 13C24-24 96-24 96 13M60 13V-15';
    o += '<path d="' + arc + '" stroke="' + D + '" stroke-width="6.2" fill="none" stroke-linecap="round"/><path d="' + arc + '" stroke="url(#crG)" stroke-width="4.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M27 6C30-12 46-17 58-17.5M61 12V-12" stroke="#fff8dc" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"/>';
    [.12, .24, .36, .64, .76, .88].forEach(function (t) { var q = B(t); o += pearl(q[0], q[1], 1.5); });
    [3, -5].forEach(function (y) { o += pearl(60, y, 1.5); });
    // ลูกแก้วทองบนยอด + เพชร
    o += '<circle cx="60" cy="-20.5" r="5.6" fill="url(#crO)" stroke="' + D + '" stroke-width="1"/><path d="M54.6-20.5h10.8M60-26v11" stroke="' + D + '" stroke-width=".7" opacity=".55"/><path d="M54.8-19.6Q60-17.4 65.2-19.6" stroke="#fff3c4" stroke-width="1.1" fill="none"/><ellipse cx="58" cy="-22.6" rx="1.6" ry="1" fill="#fff" opacity=".85"/>' +
      '<path d="M60-31.5 62.6-28.4 60-25.6 57.4-28.4z" fill="#eaf6ff" stroke="' + D + '" stroke-width=".7"/><path d="M57.4-28.4h5.2M60-31.5v5.9" stroke="#9ec9ff" stroke-width=".4"/>';
    // ยอดลายใบไม้ + ยอดไข่มุก บนขอบ
    var FL = 'M0-10C2.6-7 3-4 1.2-1.6C3.4-3.4 6-3 6.4-.6C6.8 1.6 4.6 2.4 3 2H-3C-4.6 2.4-6.8 1.6-6.4-.6C-6-3-3.4-3.4-1.2-1.6C-3-4-2.6-7 0-10Z';
    [[24, .85], [42, .95], [78, .95], [96, .85]].forEach(function (f) { o += '<path transform="translate(' + f[0] + ' 12) scale(' + f[1] + ')" d="' + FL + '" fill="url(#crG)" stroke="' + D + '" stroke-width="1" stroke-linejoin="round"/>'; });
    o += '<path transform="translate(60 12) scale(1.05)" d="' + FL + '" fill="url(#crG)" stroke="' + D + '" stroke-width="1" stroke-linejoin="round"/>';
    [33, 51, 69, 87].forEach(function (x) { o += '<path d="M' + (x - 1.8) + ' 13.5L' + x + ' 5 ' + (x + 1.8) + ' 13.5z" fill="url(#crG)" stroke="' + D + '" stroke-width=".8" stroke-linejoin="round"/>' + pearl(x, 3.6, 2); });
    // ขอบทองกว้าง + ลายเม็ดทอง
    o += '<rect x="17" y="12.5" width="86" height="12" rx="3" fill="url(#crB)" stroke="' + D + '" stroke-width="1.2"/><path d="M20 14.4h80" stroke="#fff6d6" stroke-width=".9" opacity=".85"/>';
    for (var k = 21; k <= 99; k += 3.5) if (Math.abs(k - 60) > 7 && Math.abs(k - 40) > 4.5 && Math.abs(k - 80) > 4.5 && Math.abs(k - 27.5) > 2.6 && Math.abs(k - 92.5) > 2.6) o += '<circle cx="' + k.toFixed(1) + '" cy="16" r=".55" fill="#fff3c4"/><circle cx="' + k.toFixed(1) + '" cy="21.2" r=".55" fill="#7a4d08" opacity=".7"/>';
    // อัญมณีเจียระไน
    o += '<g transform="translate(60 18.6)"><path d="M-6 0-3.6-4.4H3.6L6 0 3.6 4.4H-3.6z" fill="url(#crR)" stroke="' + D + '" stroke-width=".8"/><path d="M-6 0H6M-3.6-4.4-1.6 0-3.6 4.4M3.6-4.4 1.6 0 3.6 4.4M-1.6 0 0-4.4 1.6 0 0 4.4z" stroke="#ffb3c0" stroke-width=".35" fill="none" opacity=".85"/><path d="M-3.2-3.4-1.2-3.4-2.4-1.2z" fill="#fff" opacity=".9"/></g>';
    [40, 80].forEach(function (x) { o += '<g transform="translate(' + x + ' 18.6)"><path d="M0-4.2 3.6 0 0 4.2-3.6 0z" fill="url(#crS)" stroke="' + D + '" stroke-width=".7"/><path d="M-3.6 0h7.2M0-4.2v8.4M-1.8-2.1 1.8 2.1M1.8-2.1-1.8 2.1" stroke="#bfe0ff" stroke-width=".3" opacity=".8"/><path d="M-1.6-1.6-.4-2.8-.4-1z" fill="#fff" opacity=".9"/></g>'; });
    [27.5, 92.5].forEach(function (x) { o += '<g transform="translate(' + x + ' 18.6)"><rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx=".8" transform="rotate(45)" fill="url(#crE)" stroke="' + D + '" stroke-width=".6"/><circle cx="-.8" cy="-.9" r=".6" fill="#fff" opacity=".9"/></g>'; });
    // ขนเออร์มีนขอบล่าง (ครอบหัวม้วน)
    o += '<path d="M15 26.5Q15 23.5 19 23.8Q24 22.6 29 23.8Q34 22.6 39 23.8Q44 22.6 49 23.8Q54 22.6 60 23.8Q66 22.6 71 23.8Q76 22.6 81 23.8Q86 22.6 91 23.8Q96 22.6 101 23.8Q105 23.5 105 26.5Q105 31.6 100 31.4Q95 32.8 90 31.4Q85 32.8 80 31.4Q75 32.8 70 31.4Q65 32.8 60 31.4Q55 32.8 50 31.4Q45 32.8 40 31.4Q35 32.8 30 31.4Q25 32.8 20 31.4Q15 31.6 15 26.5Z" fill="url(#crW)" stroke="' + D + '" stroke-width="1.1" stroke-linejoin="round"/>';
    [22, 34, 46, 58, 70, 82, 94].forEach(function (x, i) { var y = i % 2 ? 26 : 27.6; o += '<path d="M' + x + ' ' + y + 'l.9 2.6-.9-.7-.9.7z" fill="#2a1d14"/>'; });
    o += '<path d="M19 25.4Q60 24 101 25.4" stroke="#fff" stroke-width="1" fill="none" opacity=".9"/>';
    // ประกายบนอัญมณี
    [[60, 15.6, 0], [40, 15.8, 1.1], [80, 15.8, 2.2], [60, -31.5, .55], [58, -23, 1.7]].forEach(function (q) { o += '<path class="cr-tw" style="animation-delay:' + q[2] + 's" transform="translate(' + q[0] + ' ' + q[1] + ')" d="M0-3.4.5-.5 3.4 0 .5.5 0 3.4-.5.5-3.4 0-.5-.5z" fill="#fff"/>'; });
    return o;
  }
  ART_OUT.crown.art = crownArt();
  function artFor(id) { return id === 'medal' ? medalArt(medalTier()) : id === 'laurel' ? laurelArt() : ART_OUT[id] ? ART_OUT[id].art : ''; }
  var RAR = { limited: 'LIMITED', common: 'ธรรมดา', rare: 'หายาก', epic: 'พิเศษ', legendary: 'ตำนาน' };
  function shopItems() { return (S && S.shop || []).filter(function (o) { return ART_OUT[o.id]; }).map(function (o) { return o.id === 'medal' ? Object.assign({}, o, { rarity: 'limited' }) : o; }); }
  function itemById(id) { return shopItems().filter(function (o) { return o.id === id; })[0]; }
  function ownedOutfits() {
    if (!S) return []; var e = {}; (S.badges || []).forEach(function (b) { if (b.earned) e[b.id] = 1; });
    var own = S.owned || [];
    return shopItems().filter(function (o) { return own.indexOf(o.id) >= 0 || (o.badge && e[o.badge]); }).map(function (o) { return o.id; });
  }
  var tryOn = null;   // ลองใส่ชั่วคราว (ยังไม่ได้ซื้อ)
  function wornOutfits() {
    var w = []; try { w = JSON.parse(localStorage.getItem('vc_outfit') || '[]'); } catch (e) {}
    var own = ownedOutfits(); w = w.filter(function (id) { return own.indexOf(id) >= 0; });
    if (tryOn) { var t = itemById(tryOn); if (t) w = w.filter(function (id) { var o = itemById(id); return o && o.slot !== t.slot; }).concat(tryOn); }
    var order = { chest: 0, neck: 1, face: 2, head: 3 };
    return w.sort(function (a, b) { return (order[(itemById(a) || {}).slot] || 0) - (order[(itemById(b) || {}).slot] || 0); });
  }
  function wear(id) {   // ใส่/ถอด · ช่องเดียวกันใส่ได้ชิ้นเดียว
    var w = []; try { w = JSON.parse(localStorage.getItem('vc_outfit') || '[]'); } catch (e) {}
    var it = itemById(id), k = w.indexOf(id);
    if (k >= 0) w.splice(k, 1);
    else { w = w.filter(function (x) { var o = itemById(x); return !o || o.slot !== it.slot; }); w.push(id); }
    try { localStorage.setItem('vc_outfit', JSON.stringify(w)); } catch (e) {}
    return k < 0;
  }
  /* ท่าทางเฉพาะมาลัยตำนาน: ตาประกายดาว · ลอยตัวแบบเทพ · สลับ 3 ท่า (แชมป์ชูแขน → แตะมาลัย+เท้าเอว → โบกมือราชวงศ์) */
  function lrPoseSvg(svg) {
    var INKc = '#3a2a12', PAP = '#f7efdc';
    var arm = function (d) { return '<path d="' + d + '" stroke="' + INKc + '" stroke-width="3" stroke-linecap="round" fill="none"/>'; };
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + PAP + '" stroke="' + INKc + '" stroke-width="2.4"/>'; };
    var pen = function (x, y, r) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-4" y="-17" width="8" height="22" rx="2.5" fill="#ffd84d" stroke="' + INKc + '" stroke-width="2"/><rect x="-4" y="-17" width="8" height="6" rx="2" fill="#f2b81c" stroke="' + INKc + '" stroke-width="2"/><path d="M-3 5h6l-1.5 5h-3z" fill="#f2b81c" stroke="' + INKc + '" stroke-width="2" stroke-linejoin="round"/></g>'; };
    var star = function (x, y, s) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-6l1.6 4.4L6 0l-4.4 1.6L0 6l-1.6-4.4L-6 0l4.4-1.6z" fill="#ffe28a"/>'; };
    var face = '<ellipse cx="50" cy="58" rx="4.4" ry="5.4" fill="' + INKc + '"/><ellipse cx="70" cy="58" rx="4.4" ry="5.4" fill="' + INKc + '"/>' +
      '<path class="lp-eye" d="M51.6 53.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7zM71.6 53.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="#fff"/><circle cx="48.4" cy="60.6" r=".9" fill="#fff" opacity=".8"/><circle cx="68.4" cy="60.6" r=".9" fill="#fff" opacity=".8"/>' +
      '<path d="M44 48.6q5-4.4 11-2.2M65 46.4q6-2.2 11 2.2" stroke="' + INKc + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M52 65.4q8 7.6 16-.6q-8 3.2-16 .6z" fill="#c2453b" stroke="' + INKc + '" stroke-width="2.1" stroke-linejoin="round"/>' +
      '<ellipse cx="42" cy="66" rx="5.6" ry="3.4" fill="#ff8f8f" opacity=".45"/><ellipse cx="78" cy="66" rx="5.6" ry="3.4" fill="#ff8f8f" opacity=".45"/>';
    var p1 = '<g class="lp-p lp-1"><g class="lp-pump">' + arm('M31 72q-16-14-18-52') + hand(13, 20) + pen(12, 9, -8) + arm('M89 72q16-14 18-52') + hand(107, 20) + '</g>' + star(4, 34, .8) + star(116, 6, .7) + star(24, 2, .55) + '</g>';
    var p2 = '<g class="lp-p lp-2">' + arm('M31 74q-11 2-9 12 2 4 8 1') + hand(28, 86) + '<g class="lp-tap">' + arm('M89 72q16-20 0-56') + hand(88, 14) + '</g></g>';
    var p3 = '<g class="lp-p lp-3">' + arm('M31 80q-1 12 10 16') + pen(46, 98, 50) + hand(42, 97) + '<g class="lp-wv">' + arm('M89 72q12-4 15-20') + hand(104, 50) + '<path d="M112 40q4 5 1 11M116 36q6 8 1 17" stroke="#ffe28a" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></g>';
    // หน้า
    var i = svg.indexOf('<g class="vm-face">'), depth = 0, j = i, re = /<g[\s>]|<\/g>/g; re.lastIndex = i;
    for (var mt; (mt = re.exec(svg));) { if (mt[0] === '</g>') { depth--; if (!depth) { j = mt.index + 4; break; } } else depth++; }
    var end = svg.lastIndexOf('</g></svg>');
    svg = svg.slice(0, i) + '<g class="vm-face"><g class="lp-face">' + face + '</g></g>' + p1 + p2 + p3 + svg.slice(end);
    // ลอยตัว + วงแสงใต้เท้า
    svg = svg.replace('<ellipse cx="60" cy="134" rx="30" ry="4" fill="#000" opacity=".28"/>', '<ellipse class="lp-sh" cx="60" cy="134" rx="30" ry="4" fill="#000" opacity=".22"/><ellipse class="lp-ring" cx="60" cy="133" rx="27" ry="4.6" fill="none" stroke="#ffd75a" stroke-width="1.4"/><ellipse class="lp-ring lp-ring2" cx="60" cy="133" rx="27" ry="4.6" fill="none" stroke="#fff2b8" stroke-width=".8"/>');
    svg = svg.replace('<g class="vm-body">', '<g class="lp-lev"><g class="vm-body">');
    return svg.replace(/<\/g><\/svg>$/, '</g></g></svg>');
  }
  /* ท่าราชาเมื่อสวมมงกุฎ: ถือคทาทองลูกแก้วทับทิม · ผ้าคลุมกำมะหยี่แดงขอบขนเออร์มีน (หลังตัว) + ปกขนสีขาว */
  function crPoseSvg(svg) {
    var I = '#3a2a12', P = '#f7efdc';
    var arm = function (d) { return '<path d="' + d + '" stroke="' + I + '" stroke-width="3" stroke-linecap="round" fill="none"/>'; };
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + P + '" stroke="' + I + '" stroke-width="2.4"/>'; };
    var pen = '<g transform="translate(19 90) rotate(-20)"><rect x="-4" y="-17" width="8" height="22" rx="2.5" fill="#ffd84d" stroke="' + I + '" stroke-width="2"/><rect x="-4" y="-17" width="8" height="6" rx="2" fill="#f2b81c" stroke="' + I + '" stroke-width="2"/><path d="M-3 5h6l-1.5 5h-3z" fill="#f2b81c" stroke="' + I + '" stroke-width="2" stroke-linejoin="round"/></g>';
    var scepter = '<g class="cp-sc"><defs><linearGradient id="cpG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a0c"/><stop offset=".45" stop-color="#fff0b0"/><stop offset="1" stop-color="#a8700f"/></linearGradient><radialGradient id="cpO" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd0d8"/><stop offset=".4" stop-color="#ff3456"/><stop offset="1" stop-color="#6a0418"/></radialGradient></defs>' +
      '<rect x="99.6" y="56" width="4.8" height="58" rx="2.2" fill="url(#cpG)" stroke="' + I + '" stroke-width="1.4"/><rect x="97.6" y="62" width="8.8" height="3.6" rx="1.6" fill="#f4c542" stroke="' + I + '" stroke-width="1.1"/><rect x="97.6" y="106" width="8.8" height="3.6" rx="1.6" fill="#f4c542" stroke="' + I + '" stroke-width="1.1"/>' +
      '<path d="M96 56q6-6 12 0" fill="#f4c542" stroke="' + I + '" stroke-width="1.2"/><circle cx="102" cy="49" r="6" fill="url(#cpO)" stroke="' + I + '" stroke-width="1.4"/><ellipse cx="100" cy="47" rx="1.8" ry="1.2" fill="#fff" opacity=".85"/><path d="M102 43v-5M99.6 40.4h4.8" stroke="#f4c542" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path class="cp-gl" d="M108 44l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z" fill="#fff"/></g>';
    var collar = '<g class="cp-col"><path d="M26 30q34 12 68 0l2 8q-36 12-72 0z" fill="#fbf8f2" stroke="' + I + '" stroke-width="1.6" stroke-linejoin="round"/><g fill="#2a2018"><path d="M36 36l1 3 1-3z"/><path d="M50 39l1 3 1-3z"/><path d="M68 39l1 3 1-3z"/><path d="M83 36l1 3 1-3z"/></g><path d="M30 33q30 9 60 0" stroke="#e6ddd0" stroke-width="1.2" fill="none"/></g>';
    var i = svg.indexOf('<g class="vm-face">'), depth = 0, j = i, re = /<g[\s>]|<\/g>/g; re.lastIndex = i;
    for (var mt; (mt = re.exec(svg));) { if (mt[0] === '</g>') { depth--; if (!depth) { j = mt.index + 4; break; } } else depth++; }
    var end = svg.lastIndexOf('</g></svg>');
    svg = svg.slice(0, j) + collar + arm('M31 76q-10 4-12 12') + pen + hand(19, 90) + scepter + arm('M89 76q8 2 12 8') + hand(101, 84) + svg.slice(end);
    var cape = '<g class="cp-cape"><defs><linearGradient id="cpV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a0614"/><stop offset=".3" stop-color="#b3122e"/><stop offset=".55" stop-color="#d42a46"/><stop offset=".8" stop-color="#9e0f2a"/><stop offset="1" stop-color="#4a0410"/></linearGradient></defs>' +
      '<path d="M24 32C20 60 12 92 8 120q9 6 18 0 9 6 18 0 9 6 16 0 7 6 16 0 9 6 18 0 9 6 18 0C108 92 100 60 96 32z" fill="url(#cpV)" stroke="' + I + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M8 120q9 6 18 0 9 6 18 0 9 6 16 0 7 6 16 0 9 6 18 0 9 6 18 0" stroke="#fbf8f2" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#2a2018"><path d="M17 122l1 3 1-3z"/><path d="M35 122l1 3 1-3z"/><path d="M52 122l1 3 1-3z"/><path d="M68 122l1 3 1-3z"/><path d="M86 122l1 3 1-3z"/><path d="M103 122l1 3 1-3z"/></g>' +
      '<path d="M30 44c-3 24-8 50-12 72M90 44c3 24 8 50 12 72M44 40c-2 26-4 52-6 78M76 40c2 26 4 52 6 78" stroke="#6a0818" stroke-width="1.2" fill="none" opacity=".55"/></g>';
    var k = svg.indexOf('>') + 1;
    return svg.slice(0, k) + cape + svg.slice(k);
  }
  function dressed(m, size) {
    var svg = mascot(m, size, ICO_GIFT), worn = wornOutfits();
    if (!worn.length || svg.indexOf('<g class="vm-face">') < 0) return svg;
    if (worn.indexOf('laurel') >= 0 && /^(wave|happy|party)$/.test(m)) svg = lrPoseSvg(svg);
    else if (worn.indexOf('crown') >= 0 && /^(wave|happy|party)$/.test(m)) svg = crPoseSvg(svg);
    var art = worn.map(function (id) { return id === 'medal' ? frontArt(medalTier()) + '<g class="md-worn">' + artFor(id) + '</g>' : id === 'laurel' ? '<g class="lr-worn">' + laurelArt(0, 'front') + '</g>' : id === 'crown' ? '<g class="cr-worn">' + artFor(id) + '</g>' : id === 'wizard' ? '<g class="wz-worn">' + artFor(id) + '</g>' : id === 'cap' ? '<g class="cp-worn">' + (m === 'wave' ? CP_LID : '') + artFor(id) + '</g>' : artFor(id); }).join('');
    var i = svg.indexOf('<g class="vm-face">'), depth = 0, j = i;
    var re = /<g[\s>]|<\/g>/g; re.lastIndex = i;
    for (var mt; (mt = re.exec(svg));) { if (mt[0] === '</g>') { depth--; if (!depth) { j = mt.index + 4; break; } } else depth++; }
    var out = svg.slice(0, j) + '<g class="vm-outfit">' + art + '</g>' + svg.slice(j);
    if (worn.indexOf('laurel') >= 0) { var kL = out.indexOf('>') + 1; out = out.slice(0, kL) + laurelAura() + '<g class="lr-aura lr-bk">' + laurelArt(0, 'back') + '</g>' + out.slice(kL); }
    if (worn.indexOf('medal') >= 0) { var k = out.indexOf('>') + 1; out = out.slice(0, k) + auraArt(medalTier()) + backArt(medalTier()) + out.slice(k); }
    return out;
  }
  function outfitHtml() {
    var list = shopItems(); if (!list.length) return '';
    var own = ownedOutfits(), worn = wornOutfits(), names = {}; (S.badges || []).forEach(function (b) { names[b.id] = b; });
    return '<div class="vof"><div class="vbg-hd"><b>ร้านแต่งตัวน้อง</b><span>มี ' + fmt(S.points) + ' แต้ม</span></div>' +
      '<p class="vof-tip">แตะรูปเพื่อลองใส่ · แต้มใช้ได้ทั้งซื้อของและแลกตรวจฟรี</p><div class="vof-row">' +
      list.map(function (o) {
        var has = own.indexOf(o.id) >= 0, on = worn.indexOf(o.id) >= 0 && tryOn !== o.id, a = ART_OUT[o.id], bd = o.badge && names[o.badge];
        var btn = has ? '<span class="vof-act' + (on ? ' is-on' : '') + '">' + (on ? 'ใส่อยู่ ✓' : 'ใส่') + '</span>'
          : o.badge ? '<span class="vof-act is-badge">🏅 ' + h(bd ? bd.name : 'เหรียญตรา') + '</span>'
          : '<span class="vof-act is-buy' + (S.points < o.price ? ' is-short' : '') + '"><i class="vof-coin"></i>' + fmt(o.price) + '</span>';
        return '<button type="button" class="vof-b r-' + o.rarity + (has ? ' is-own' : ' is-lock' + (o.badge ? ' is-badge-item' : '')) + (on ? ' is-on' : '') + (tryOn === o.id ? ' is-try' : '') + '" data-outfit="' + o.id + '" aria-label="' + h(o.name + ' · ' + (RAR[o.rarity] || '') + (has ? (on ? ' · ใส่อยู่' : ' · กดเพื่อใส่') : o.badge ? ' · ได้จากเหรียญตรา ' + (bd ? bd.name : '') : ' · ราคา ' + o.price + ' แต้ม')) + '">' +
          '<em class="vof-r">' + (RAR[o.rarity] || '') + '</em>' +
          '<svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(o.id) + '</svg><small>' + h(o.name) + '</small>' + btn + '</button>';
      }).join('') + '</div></div>';
  }

  function line(m) {
    if (!S) return '';
    if (m === 'party') return 'ครบ 7 วันแล้ว! เปิดกล่องสมบัติได้ +' + S.week[6].reward + ' แต้ม';
    if (m === 'happy') return 'เย่! เก็บแต้มแล้ว พรุ่งนี้มารับ +' + S.tomorrowReward + ' นะ';
    if (m === 'sleep') return 'วันนี้รับไปแล้ว เจอกันพรุ่งนี้นะ… zzz';
    if (m === 'sad') return 'เมื่อวานพลาดไปนิด ไม่เป็นไร แต้มยังอยู่ครบ เริ่มใหม่กัน!';
    if (S.week[6].today) return 'วันนี้เปิดกล่องสมบัติได้แล้ว!';
    if (S.streak >= 3) return 'ยินดีต้อนรับกลับมา! ดูแลเอกสารต่อเนื่อง ' + S.streak + ' วันแล้ว รับ +' + S.todayReward + ' แต้มเลย';
    return 'วันนี้มีของรออยู่นะ! กดรับ +' + S.todayReward + ' แต้มเลย';
  }
  /* (1) ไฟวันติด: เปลวไฟ 3 ชั้นพลิ้ว + สะเก็ดไฟ · ระดับตามจำนวนวัน (ส้ม → ทอง → ไฟฟ้า) */
  function flameTier(n) { return n >= 7 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0; }
  var FLAME = '<svg class="vf-svg" viewBox="0 0 48 60" aria-hidden="true">' +
    '<path class="vf-o" d="M24 58C11 58 4 49 4 39 4 27 13 21 15 9c7 4 11 11 11 18 3-2 5-6 5-10 8 6 13 14 13 22 0 11-8 19-20 19Z"/>' +
    '<path class="vf-m" d="M24 56c-8 0-13-6-13-13 0-8 6-12 8-20 4 3 6 8 6 12 2-1 4-4 4-7 5 4 8 9 8 15 0 8-5 13-13 13Z"/>' +
    '<path class="vf-i" d="M24 55c-4 0-7-3-7-7 0-5 4-7 5-12 3 3 9 7 9 12 0 4-3 7-7 7Z"/></svg>' +
    '<i class="vf-em"></i><i class="vf-em"></i><i class="vf-em"></i>';
  /* (2) นาฬิกาพลิก: ตัวเลขแต่ละหลักเป็นแผ่นพลิก */
  function flipParts(ms) { var t = Math.max(0, Math.floor(ms / 1000)), p = function (n) { return (n < 10 ? '0' : '') + n; }; return [p(Math.floor(t / 3600)), p(Math.floor(t % 3600 / 60)), p(t % 60)]; }
  function flipHtml(ms, small) {
    return '<span class="vfl' + (small ? ' is-sm' : '') + '" data-flip role="timer" aria-label="เหลือเวลา ' + hms(ms) + '">' + flipParts(ms).map(function (g, gi) {
      return (gi ? '<em>:</em>' : '') + g.split('').map(function (d) { return '<i class="vfd"><b>' + d + '</b></i>'; }).join('');
    }).join('') + '</span>';
  }
  function flipSet(el, ms) {
    var ds = flipParts(ms).join('').split(''), cells = el.querySelectorAll('.vfd');
    el.setAttribute('aria-label', 'เหลือเวลา ' + hms(ms));
    [].forEach.call(cells, function (c, i) {
      var cur = c.firstChild ? c.firstChild.textContent : '';
      if (cur === ds[i]) return;
      c.innerHTML = '<b>' + ds[i] + '</b><s>' + cur + '</s>';
      c.classList.remove('go'); void c.offsetWidth; c.classList.add('go');
    });
  }
  /* (7) เหรียญตรา */
  var BADGE_ART = {
    d1: '<path d="M32 16 36 28h12l-10 8 4 12-10-7-10 7 4-12-10-8h12z"/>',
    s7: '<path d="M32 48c-7 0-11-5-11-11 0-7 5-10 7-17 4 3 6 7 6 11 2-1 3-4 3-6 4 3 7 8 7 13 0 6-5 10-12 10z"/>',
    d30: '<path d="M22 20h20v8a10 10 0 0 1-20 0zM18 22h4v4a4 4 0 0 1-4-4zM46 22h-4v4a4 4 0 0 0 4-4zM29 38h6v5h5v4H24v-4h5z"/>',
    s30: '<path d="M33 14 22 34h9l-2 16 13-22h-9z"/>',
    d100: '<path d="M18 40 22 22l8 9 2-13 2 13 8-9 4 18zM18 43h28v5H18z"/>'
  };
  function badgesHtml() {
    if (!S || !S.badges) return '';
    var got = S.badges.filter(function (b) { return b.earned; }).length;
    return '<div class="vbg"><div class="vbg-hd"><b>เหรียญตรา</b><span>' + got + '/' + S.badges.length + '</span></div><div class="vbg-row">' +
      S.badges.map(function (b) {
        var pct = Math.round(b.have / b.n * 100);
        return '<button type="button" class="vbg-b' + (b.earned ? ' is-on' : '') + '" data-badge="' + b.id + '" style="--bp:' + pct + '%" aria-label="' + h(b.name + ' · ' + b.desc + (b.earned ? ' · ได้แล้ว' : ' · ' + b.have + '/' + b.n)) + '">' +
          '<span class="vbg-m"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" class="vbg-c"/><circle cx="32" cy="32" r="24" class="vbg-c2"/><g class="vbg-i">' + (BADGE_ART[b.id] || BADGE_ART.d1) + '</g></svg></span>' +
          '<small>' + h(b.name) + '</small><em>' + (b.earned ? 'ได้แล้ว' : b.have + '/' + b.n) + '</em></button>';
      }).join('') + '</div></div>';
  }
  function fmt(n) { return Number(n || 0).toLocaleString('th-TH'); }
  function slot() { if (!S) return 0; for (var i = 0; i < S.week.length; i++) if (S.week[i].today) return i + 1; return 0; }

  /* ---------- หน้าต่างเช็กอิน (สไตล์หน้ารับรางวัลเกม) ---------- */
  // ภาพรางวัลแต่ละวัน: เหรียญเพิ่มขึ้นตามวัน · วันที่ 7 เป็นกล่องสมบัติ
  var COIN = function (x, y, r) {
    var ry = r * .9, e = r * .26;   // e = ความหนาขอบเหรียญ
    return '<g class="vdg-cn" transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="0" cy="' + e + '" rx="' + r + '" ry="' + ry + '" fill="url(#vdcE)"/>' +
      '<path d="M' + (-r) + ' 0v' + e + 'a' + r + ' ' + ry + ' 0 0 0 ' + (2 * r) + ' 0v' + (-e) + '" fill="url(#vdcE)"/>' +
      '<path d="M' + (-r * .96) + ' ' + (e * .55) + 'a' + r + ' ' + ry + ' 0 0 0 ' + (r * 1.92) + ' 0" fill="none" stroke="#5c3a06" stroke-width="' + (r * .05) + '" stroke-dasharray="' + (r * .08) + ' ' + (r * .1) + '" opacity=".55"/>' +
      '<ellipse cx="0" cy="0" rx="' + r + '" ry="' + ry + '" fill="url(#vdcF)"/>' +
      '<ellipse cx="0" cy="0" rx="' + r + '" ry="' + ry + '" fill="none" stroke="#fff6cf" stroke-width="' + (r * .06) + '" opacity=".55"/>' +
      '<ellipse cx="0" cy="' + (r * .03) + '" rx="' + (r * .7) + '" ry="' + (r * .62) + '" fill="url(#vdcI)" stroke="#a46f10" stroke-width="' + (r * .07) + '"/>' +
      '<path d="M' + (-r * .12) + ' ' + (-r * .3) + 'v' + (r * .62) + 'M' + (r * .14) + ' ' + (-r * .3) + 'v' + (r * .62) + '" stroke="#8a5a08" stroke-width="' + (r * .13) + '" stroke-linecap="round"/>' +
      '<path d="M' + (-r * .12 + r * .06) + ' ' + (-r * .3) + 'v' + (r * .62) + 'M' + (r * .14 + r * .06) + ' ' + (-r * .3) + 'v' + (r * .62) + '" stroke="#ffe9a0" stroke-width="' + (r * .05) + '" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M' + (-r * .72) + ' ' + (-r * .3) + 'a' + (r * .8) + ' ' + (r * .7) + ' 0 0 1 ' + (r * .9) + ' ' + (-r * .5) + '" fill="none" stroke="#fff" stroke-width="' + (r * .12) + '" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse class="vdg-gl" cx="0" cy="0" rx="' + r + '" ry="' + ry + '" fill="url(#vdcS)"/>' +
      '</g>';
  };
  var ART = [
    COIN(32, 34, 15),
    COIN(25, 37, 12) + COIN(39, 31, 12),
    COIN(22, 39, 11) + COIN(42, 39, 11) + COIN(32, 27, 11),
    COIN(24, 42, 10) + COIN(40, 42, 10) + COIN(24, 30, 10) + COIN(40, 30, 10),
    COIN(32, 46, 11) + COIN(32, 38, 11) + COIN(32, 30, 11) + COIN(19, 44, 9) + COIN(45, 44, 9),
    COIN(18, 46, 10) + COIN(46, 46, 10) + COIN(32, 46, 10) + COIN(25, 34, 10) + COIN(39, 34, 10) + COIN(32, 23, 10),
    // กล่องสมบัติ
    '<g class="vdg-ch-glow"><ellipse cx="32" cy="30" rx="20" ry="7" fill="#ffd95a" opacity=".85"/></g>' +
    '<path d="M8 30h48v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="#7a3f12"/><path d="M8 30h48v6H8z" fill="#5c2c0b"/><path d="M14 36v18M50 36v18" stroke="#5c2c0b" stroke-width="1.5" opacity=".6"/>' +
    '<path d="M28 30h8v26h-8z" fill="url(#vdcG)"/>' +
    '<g class="vdg-lid"><path d="M10 30c0-11 9-18 22-18s22 7 22 18z" fill="#a8561b"/><path d="M14 26c2-7 9-11 18-11" stroke="#d8823a" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M28 12.3h8V30h-8z" fill="url(#vdcG)"/><path d="M8 30h48" stroke="url(#vdcG)" stroke-width="4"/></g>' +
    '<rect x="26" y="27" width="12" height="13" rx="3" fill="url(#vdcG)" stroke="#8a5a08" stroke-width="1.5"/><circle cx="32" cy="33" r="2" fill="#5c3a06"/>' +
    '<path class="vdg-tw" d="M14 18l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#fff4c2"/><path class="vdg-tw vdg-tw2" d="M50 9l1.4-3.5L53 9l3.5 1.4L53 12l-1.6 3.5L50 12l-3.5-1.6z" fill="#fff4c2"/>'
  ];
  var GLINT = function (x, y) { return '<g transform="translate(' + x + ' ' + y + ')"><path class="vdg-tw" d="M0 -6 1.3 -1.3 6 0 1.3 1.3 0 6 -1.3 1.3 -6 0 -1.3 -1.3Z" fill="#fffbe6"/></g>'; };
  [[42, 22], [47, 26], [41, 18], [48, 21], [42, 20], [41, 15]].forEach(function (g, i) { ART[i] += GLINT(g[0], g[1]); });
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="vdcG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".45" stop-color="#f4c542"/><stop offset="1" stop-color="#c88a12"/></linearGradient>' +
    '<radialGradient id="vdcF" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fff7d0"/><stop offset=".35" stop-color="#ffd85c"/><stop offset=".75" stop-color="#e2a524"/><stop offset="1" stop-color="#a86d0c"/></radialGradient>' +
    '<radialGradient id="vdcI" cx=".6" cy=".7" r=".8"><stop offset="0" stop-color="#ffe17a"/><stop offset="1" stop-color="#d79a1e"/></radialGradient>' +
    '<linearGradient id="vdcE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4f08"/><stop offset=".3" stop-color="#c58d1a"/><stop offset=".55" stop-color="#8a5a08"/><stop offset="1" stop-color="#5c3a06"/></linearGradient>' +
    '<linearGradient id="vdcS" x1="0" y1="0" x2="1" y2=".4"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".85"/><stop offset=".56" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>';
  var ICO_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>';
  var ICO_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4.2 4.2L18.5 8"/></svg>';

  // นับถอยหลังถึงเที่ยงคืนเวลาไทย (UTC+7 ไม่มีเวลาออมแสง)
  function msToMidnight() { var d = 864e5, o = 7 * 36e5, n = Date.now(); return (Math.floor((n + o) / d) + 1) * d - o - n; }
  function hms2(ms) { var t = Math.max(0, Math.floor(ms / 1000)), p = function (n) { return (n < 10 ? '0' : '') + n; }; return Math.floor(t / 3600) + ':' + p(Math.floor(t % 3600 / 60)) + ':' + p(t % 60); }
  function hms(ms) { var t = Math.max(0, Math.floor(ms / 1000)), hh = Math.floor(t / 3600), mm = Math.floor(t % 3600 / 60), ss = t % 60; return hh + ' ชม. ' + mm + ' นาที ' + ss + ' วิ'; }
  var tick = null;
  function startTick() {
    stopTick();
    tick = setInterval(function () {
      if (!box || box.hidden) { stopTick(); return; }
      var ms = msToMidnight(), el = box.querySelectorAll('[data-cd]');
      [].forEach.call(el, function (x) { x.textContent = x.getAttribute('data-cd') === 's' ? hms2(ms) : hms(ms); });
      [].forEach.call(box.querySelectorAll('[data-flip]'), function (f) { flipSet(f, ms); });
      var mn = box.querySelector('.vdg-moon'); if (mn) mn.style.setProperty('--dp', (100 - ms / 864e3).toFixed(1) + '%');
      if (ms < 1000) { stopTick(); setTimeout(load, 1500); }  // ขึ้นวันใหม่
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  function cardHtml(w, i) {
    var done = S.week.filter(function (x) { return x.done; }).length;
    var st = w.done ? 'is-done' : w.today ? 'is-open' : 'is-lock', soon = S.checkedToday && i === done;
    var toChest = S.checkedToday ? 7 - done : 6 - done;
    var foot = w.done ? '' : w.today ? 'วันนี้' : soon ? 'พรุ่งนี้ <b data-cd="s">' + hms2(msToMidnight()) + '</b>' : i === 6 ? 'อีก ' + toChest + ' วัน' : '';
    var tag = w.today ? 'button' : 'div';
    return '<' + tag + (w.today ? ' type="button"' : '') + ' class="vdg-c ' + st + (soon ? ' is-soon' : '') + (i === 6 ? ' is-big' : '') + '" data-i="' + i + '"' +
      (w.today ? ' aria-label="รับรางวัลวันที่ ' + w.day + ' +' + w.reward + ' แต้ม"' : ' aria-label="วันที่ ' + w.day + ' +' + w.reward + ' แต้ม ' + (w.done ? 'รับแล้ว' : 'ยังไม่ถึง') + '"') + '>' +
      '<span class="vdg-day">' + (i === 6 ? 'วันที่ 7 · กล่องสมบัติ' : 'วัน ' + w.day) + '</span>' +
      (i === 6 ? '<span class="vdg-rays" aria-hidden="true"></span>' : '') +
      '<svg class="vdg-art" viewBox="0 0 64 64" aria-hidden="true">' + ART[i] + '</svg>' +
      '<span class="vdg-amt">+' + w.reward + '</span>' +
      (foot ? '<span class="vdg-tag">' + foot + '</span>' : '') +
      (w.done ? '<span class="vdg-ok" aria-hidden="true">' + ICO_OK + '</span><span class="vdg-seal" aria-hidden="true"><i>รับแล้ว</i></span>' : '') +
      (!w.done && !w.today ? '<span class="vdg-lk" aria-hidden="true">' + ICO_LOCK + '</span>' : '') +
      '</' + tag + '>';
  }
  /* (6) แตะน้อง: หลับอยู่ → สะดุ้งตื่น บ่นแล้วหลับต่อ · ตื่นอยู่ → กระโดดดีใจ */
  var pokeT = 0, CHEER = ['กดรับแต้มเลย! 🎁', 'วันนี้ก็อ่านสัญญาให้ครบนะ!', 'เก็บครบ 7 วัน เปิดกล่องสมบัติได้นะ ✨', 'สู้ ๆ! 💪'];
  function poke() {
    if (!box || !S) return;
    var ms = box.querySelector('.vdg-mascot'), sayEl = box.querySelector('.vdg-say'), md = mood();
    clearTimeout(pokeT); ms.classList.remove('is-poke', 'is-hop'); void ms.offsetWidth;
    if (md === 'sleep') {
      var hrs = Math.max(1, Math.round(msToMidnight() / 36e5));
      ms.innerHTML = dressed('wave', 260); ms.setAttribute('data-m', 'poke'); ms.classList.add('is-poke');
      sayEl.textContent = 'หืม…? อีกตั้ง ' + hrs + ' ชั่วโมงแน่ะ… ขอนอนต่อนะ 😴';
      pokeT = setTimeout(function () { ms.classList.remove('is-poke'); ms.innerHTML = dressed('sleep', 260); ms.setAttribute('data-m', 'sleep|' + wornOutfits().join(',')); sayEl.textContent = line('sleep'); }, 2600);
    } else {
      ms.classList.add('is-hop'); sayEl.textContent = CHEER[Math.floor(Math.random() * CHEER.length)];
      pokeT = setTimeout(function () { ms.classList.remove('is-hop'); sayEl.textContent = line(mood()); }, 2600);
    }
  }
  /* ===== ร้านค้าน้องเวลลัม (หน้าต่างแยก) =====
     แท่นโชว์น้องตัวใหญ่ + แท็บตามส่วน + แตะของ = ลองใส่บนแท่น + แถบล่าง ซื้อ/ใส่/ถอด */
  var sh = null, shTab = 'all', sel = null;
  var TABS = [['all', 'ทั้งหมด'], ['head', 'หมวก'], ['face', 'แว่น'], ['neck', 'คอ'], ['chest', 'เข็มกลัด']];
  function hop(el) { if (!el) return; el.classList.remove('is-hop'); void el.offsetWidth; el.classList.add('is-hop'); setTimeout(function () { el.classList.remove('is-hop'); }, 1500); }
  function shopPromo() {
    var list = shopItems(); if (!list.length) return '';
    var own = ownedOutfits().length;
    return '<button type="button" class="vsp" data-shop><span class="vsp-ic" aria-hidden="true">🛍️</span><span class="vsp-tx"><b>ร้านค้าน้องเวลลัม</b><small>มี ' + own + '/' + list.length + ' ชิ้น · ใช้แต้มซื้อชุดแต่งตัว</small></span><span class="vsp-go">เข้าร้าน ›</span></button>';
  }
  function shopOpen(focusId) {
    if (!user()) { if (window.VCAuthGate) window.VCAuthGate.open(); else say('เข้าสู่ระบบก่อนนะครับ'); return; }
    if (!sh) {
      sh = document.createElement('div'); sh.className = 'vst'; sh.hidden = true;
      sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-labelledby', 'vstT');
      sh.innerHTML = '<div class="vst-bg" data-shx></div><div class="vst-p">' +
        '<div class="vst-hd"><h3 id="vstT">ร้านค้าน้องเวลลัม</h3><span class="vst-pts"><i class="vof-coin"></i><b data-spts>0</b> แต้ม</span><button type="button" class="vst-x" data-shx aria-label="ปิดร้าน">✕</button></div>' +
        '<div class="vst-stage"><div class="vst-fire" aria-hidden="true"></div><i class="vst-spot"></i><i class="vst-glow"></i><div class="vst-refl" aria-hidden="true"></div><i class="vst-ped"></i><i class="vst-sweep"></i><i class="vst-grain"></i><div class="vst-extra"></div><div class="vst-hero" aria-hidden="true"></div><div class="vst-heav" aria-hidden="true"></div><div class="vst-wzs" aria-hidden="true"></div><div class="vst-drm" aria-hidden="true"></div><div class="vst-thr" aria-hidden="true"></div><div class="vst-ms" aria-hidden="true"></div><p class="vst-say"></p></div>' +
        '<div class="vst-tabs" role="tablist"></div><div class="vst-grid"></div><div class="vst-bar"></div></div>';
      document.body.appendChild(sh);
      sh.addEventListener('click', function (e) {
        if (e.target.closest('[data-shx]')) { shopClose(); return; }
        var t = e.target.closest('[data-tab]'); if (t) { shTab = t.getAttribute('data-tab'); shopRender(); return; }
        var tr = e.target.closest('.vst-tiers [data-tier]'); if (tr) { pvTier = +tr.getAttribute('data-tier'); if (pvTier === realTier()) pvTier = 0; shopRender(); hop(sh.querySelector('.vst-ms')); return; }
        var lo = e.target.closest('[data-lore]'); if (lo) { loreOpen(undefined, lo.getAttribute('data-lore')); return; }
        var it = e.target.closest('[data-outfit]'); if (it) { pick(it.getAttribute('data-outfit')); return; }
        var a = e.target.closest('[data-act]'); if (a) { act(a.getAttribute('data-act')); return; }
        if (e.target.closest('.vst-ms')) hop(sh.querySelector('.vst-ms'));
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sh && !sh.hidden) shopClose(); });
    }
    sel = focusId || null; tryOn = focusId && ownedOutfits().indexOf(focusId) < 0 ? focusId : null;
    sh.hidden = false; document.documentElement.classList.add('vst-open');
    clearTimeout(fullT); fullT = setTimeout(function () { if (sh && !sh.hidden && sh.classList.contains('on')) document.documentElement.classList.add('vst-full'); }, 320);
    liteCheck();
    requestAnimationFrame(function () { sh.classList.add('on'); });
    if (S) shopRender(); else { sh.querySelector('.vst-grid').innerHTML = '<p class="vst-wait">กำลังโหลดร้าน…</p>'; load(); }
    setTimeout(function () { var x = sh.querySelector('.vst-x'); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  /* (6) เครื่องช้า: วัดความลื่น 1.5 วิ หลังเปิดร้าน ถ้าต่ำกว่า ~45 เฟรม/วิ ลดจำนวนละออง/กลีบดอกไม้ลงครึ่งหนึ่ง (เครื่องแรงเห็นครบเหมือนเดิม) */
  function liteCheck() {
    try { if (sessionStorage.getItem('vc_lite') === '1') { sh.classList.add('is-lite'); return; } } catch (e) {}
    if (sh.classList.contains('is-lite') || calm()) return;
    setTimeout(function () {
      if (!sh || sh.hidden) return;
      var t = [], last = 0, t0 = 0;
      (function f(n) { if (!t0) t0 = n; if (last) t.push(n - last); last = n; if (n - t0 < 1500 && sh && !sh.hidden) requestAnimationFrame(f); else done(); })(performance.now());
      function done() {
        if (t.length < 10) return; t.sort(function (a, b) { return a - b; }); var med = t[Math.floor(t.length / 2)];
        if (med > 22) { sh.classList.add('is-lite'); try { sessionStorage.setItem('vc_lite', '1'); } catch (e) {} }
      }
    }, 1400);
  }
  var fullT = 0;
  function shopClose() {
    clearTimeout(fullT); document.documentElement.classList.remove('vst-full');
    if (!sh) return; tryOn = null; sel = null; pvTier = 0; heroKey = ''; heroPlayed = false; heroT.forEach(clearTimeout); heroT = []; (function () { var he = sh.querySelector('.vst-hero'); if (he) { if (he.getAnimations) he.getAnimations().forEach(function (x) { x.cancel(); }); he.className = 'vst-hero'; he.innerHTML = ''; } })(); lrStop(); lrPlayed = false; crStop(); crPlayed = false; wzStop(); wzPlayed = false; cpStop(); cpPlayed = false; sh.classList.remove('on'); document.documentElement.classList.remove('vst-open');
    setTimeout(function () { if (sh && !sh.classList.contains('on')) sh.hidden = true; }, 260);
    if (box && !box.hidden) render();
  }
  function pick(id) {
    var o = itemById(id); if (!o) return;
    sel = id; tryOn = ownedOutfits().indexOf(id) < 0 ? id : null; if (id !== 'medal') pvTier = 0; if (id === 'laurel') lrSayN++;
    shopRender(); hop(sh.querySelector('.vst-ms'));
  }
  function act(a) {
    var o = itemById(sel); if (!o) return;
    if (a === 'buy') { buy(o.id); return; }
    if (a === 'wear') { var on = wear(o.id); shopRender(); hop(sh.querySelector('.vst-ms')); say(on ? 'ใส่ ' + o.name + ' แล้ว' : 'ถอด ' + o.name + ' แล้ว'); if (box && !box.hidden) render(); }
  }
  /* (2) ปีกฟีนิกซ์ (3) วงเวทไฟ (5) ปุ่มดูตัวอย่างระดับ (6) ป้ายนับถอยหลังปลดล็อก */
  /* ฉากเหรียญไฟไม่มอด แนวภาพยนตร์: ควันมืด + ถ่านไฟเบลอลอยช้า + แสงอุ่นตัดขอบ · ป้ายแบบแบรนด์หรู */
  /* ฉากสวรรค์ของมาลัยตำนาน v2: ฟ้าโพล้เพล้ทองอำพัน-ชมพูกุหลาบ + ดวงอาทิตย์ · เกาะลอยฟ้าไกล ๆ · วงรัศมีลอเรล (เลขโรมันตั้งตรง)
     · เสาหินอ่อนมีเงา+เถาไอวี่ทอง+ผ้าไหมพลิ้ว · พื้นหินอ่อนเงาวับ+หมอก · บันไดสู่แท่น (ผิวแท่นสะท้อนเงาน้อง) · โบเก้ · ละอองทอง+กลีบดอก */
  /* ===== ลื่นขึ้น: แยกภาพฉากเป็น 2 ชั้น — ชั้นนิ่ง (วาดครั้งเดียว เก็บเป็นภาพ) กับชั้นที่ขยับ (วาดเฉพาะของที่ขยับ) — หน้าตาเหมือนเดิม ===== */
  function splitSvg(svg) {
    if (!svg || svg.__sp || svg.classList.contains('vst-anim')) return; svg.__sp = 1;
    var all = [svg].concat([].slice.call(svg.querySelectorAll('*'))), n = all.length, isA = new Array(n), hasA = new Array(n), inA = new Array(n), inD = new Array(n), idx = new Map(), any = false;
    all.forEach(function (el, i) { idx.set(el, i); });
    for (var i = 1; i < n; i++) {
      var el = all[i], pi = idx.get(el.parentNode);
      inD[i] = el.tagName === 'defs' || (pi !== undefined && inD[pi]) || el.tagName === 'style';
      if (inD[i]) continue;
      var an = getComputedStyle(el).animationName;
      isA[i] = !!an && an !== 'none';
      inA[i] = isA[i] || (pi !== undefined && inA[pi]);
      if (isA[i]) { any = true; for (var q = el.parentNode; q && q !== svg; q = q.parentNode) hasA[idx.get(q)] = true; }
    }
    svg.classList.add('vst-static');
    if (!any) return;
    var cl = svg.cloneNode(true), ca = [cl].concat([].slice.call(cl.querySelectorAll('*')));
    cl.classList.remove('vst-static'); cl.classList.add('vst-anim'); cl.setAttribute('aria-hidden', 'true');
    for (var j = n - 1; j >= 1; j--) {
      var pj = idx.get(all[j].parentNode), pRemovedS = false;
      if (inD[j]) { if (ca[j].parentNode && (pj === 0 || !inD[pj])) ca[j].remove(); continue; }
      if (isA[j] && !(pj && inA[pj])) all[j].remove();               // ชั้นนิ่ง: เอาของที่ขยับออก
      if (!inA[j] && !hasA[j]) ca[j].remove();                         // ชั้นขยับ: เก็บเฉพาะของที่ขยับ (และกลุ่มที่ครอบอยู่)
    }
    svg.parentNode.insertBefore(cl, svg.nextSibling);
  }
  function libBreath(root) {   /* หน้าต่างกระจกสี "หายใจ" ด้วยแผ่นเงาด้านบน (การ์ดจอทำให้) แทนการวาดหน้าต่าง+แสงเรืองใหม่ทุกเฟรม */
    var w = root.querySelector('.lb-win circle.lb-rim'); if (!w) return;
    var b = root.querySelector('.lb-wb') || root.appendChild(document.createElement('i')); b.className = 'lb-wb';
    var r = w.getBoundingClientRect(), q = root.getBoundingClientRect();
    b.style.cssText = 'left:' + (r.left - q.left) + 'px;top:' + (r.top - q.top) + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
  }
  function splitScene(root) { if (!root) return; requestAnimationFrame(function () { root.querySelectorAll('svg').forEach(function (v) { if (v.parentNode === root && v.viewBox && v.viewBox.baseVal && v.viewBox.baseVal.width >= 300) splitSvg(v); }); }); }
  /* ฉากที่ปิดไปแล้ว: ลบทิ้งหลังจางหาย (คืนหน่วยความจำ) แล้วสร้างใหม่ตอนกลับมา */
  function dropLater(el, cls) { clearTimeout(el.__dt); el.__dt = setTimeout(function () { if (sh && !sh.classList.contains(cls) && el.getAttribute('data-on')) { el.innerHTML = ''; el.removeAttribute('data-on'); } }, 1200); }
  function heavScene(on) {
    var hv = sh.querySelector('.vst-heav'); if (!hv) return;
    var was = sh.classList.contains('is-heav');
    sh.classList.toggle('is-heav', on);
    if (!on) { if (was) dropLater(hv, 'is-heav'); return; }
    if (!hv.getAttribute('data-on')) {
      hv.setAttribute('data-on', '1');
      var CX = 195, CY = 112, f1 = function (v) { return v.toFixed(1); };
      var R = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'], num = '', wreath = '';
      for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6 - Math.PI / 2; num += '<text x="' + f1(CX + 79 * Math.cos(a)) + '" y="' + f1(CY + 79 * Math.sin(a) + 3) + '">' + R[k] + '</text>'; }
      for (var w = 0; w < 36; w++) { var b2 = w * Math.PI / 18, px = CX + 70 * Math.cos(b2), py = CY + 70 * Math.sin(b2), rr = b2 * 180 / Math.PI + 90 + (w % 2 ? 32 : -32); wreath += '<path transform="translate(' + f1(px) + ' ' + f1(py) + ') rotate(' + f1(rr) + ')" d="M0 0c2.4-2.2 6-2.2 8.4 0-2.4 2.2-6 2.2-8.4 0z"/>'; }
      function island(x, y, s, c) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + c + '"><path d="M-30 0h60c-6 8-14 22-30 30C14 22-24 8-30 0z"/><rect x="-14" y="-12" width="28" height="12"/><path d="M-17-12h34L0-21z"/><path d="M-10-12v12M-4-12v12M2-12v12M8-12v12" stroke="' + c + '" stroke-width="1"/><path d="M-30 0c4-4 12-4 16-2 6-4 18-3 22 0 6-3 16-2 22 2z"/></g>'; }
      function col(x, flip) {
        var ivy = '', d = 'M' + (x + 15) + ' 236';
        for (var y = 236; y > 50; y -= 16) { var sx = ((236 - y) / 16) % 2 ? -1 : 1; d += 'Q' + (x + 15 + sx * 20) + ' ' + (y - 8) + ' ' + (x + 15) + ' ' + (y - 16); ivy += '<path transform="translate(' + (x + 15 + sx * 12) + ' ' + (y - 8) + ') rotate(' + (sx > 0 ? -30 : 210) + ')" d="M0 0c2-2.4 5.4-2.4 7.4 0-2 2.4-5.4 2.4-7.4 0z" fill="#e2b23c"/>'; }
        var fl = ''; for (var q = 1; q < 5; q++) fl += 'M' + (x + q * 6) + ' 46V238';
        return '<rect x="' + x + '" y="46" width="30" height="194" fill="url(#hvC)"/><path d="' + fl + '" stroke="#a89a82" stroke-width=".7" opacity=".5"/>' +
          '<path d="' + d + '" stroke="#c8961e" stroke-width="1.1" fill="none" opacity=".9"/>' + ivy +
          '<rect x="' + (x - 3) + '" y="40" width="36" height="6" fill="url(#hvC)" stroke="#c8961e" stroke-width=".8"/>' +
          '<path d="M' + (x - 7) + ' 34h44" stroke="#c8961e" stroke-width="7" stroke-linecap="round"/><path d="M' + (x - 7) + ' 34h44" stroke="#fff6dc" stroke-width="4.6" stroke-linecap="round"/>' +
          '<circle cx="' + (x - 7) + '" cy="35" r="4.4" fill="#fff6dc" stroke="#c8961e" stroke-width="1.3"/><circle cx="' + (x - 7) + '" cy="35" r="1.6" fill="#c8961e"/><circle cx="' + (x + 37) + '" cy="35" r="4.4" fill="#fff6dc" stroke="#c8961e" stroke-width="1.3"/><circle cx="' + (x + 37) + '" cy="35" r="1.6" fill="#c8961e"/>' +
          '<rect x="' + (x - 6) + '" y="236" width="42" height="8" fill="url(#hvC)" stroke="#c8961e" stroke-width=".8"/>';
      }
      function drape(x, dir) {   // ผ้าไหมขาวขอบทอง ผูกเชือกทองที่ครึ่งเสา
        var o = x + dir * 2, m = x + dir * 24;
        return '<g class="hv-dr" style="transform-origin:' + x + 'px 30px"><path d="M' + o + ' 30C' + (o + dir * 30) + ' 34 ' + (m + dir * 6) + ' 40 ' + (m + dir * 10) + ' 32L' + (x + dir * 10) + ' 132C' + (x + dir * 22) + ' 160 ' + (x + dir * 30) + ' 196 ' + (x + dir * 30) + ' 236H' + o + 'z" fill="url(#hvF)" opacity=".92" stroke="#d4a43a" stroke-width="1.2"/>' +
          '<path d="M' + (x + dir * 8) + ' 40C' + (x + dir * 12) + ' 80 ' + (x + dir * 8) + ' 110 ' + (x + dir * 6) + ' 132M' + (x + dir * 18) + ' 38C' + (x + dir * 18) + ' 90 ' + (x + dir * 12) + ' 116 ' + (x + dir * 9) + ' 132" stroke="#e6dccb" stroke-width="1.2" fill="none"/>' +
          '<path d="M' + (x + dir * 14) + ' 150C' + (x + dir * 20) + ' 180 ' + (x + dir * 26) + ' 210 ' + (x + dir * 32) + ' 236" stroke="#e6dccb" stroke-width="1.2" fill="none"/>' +
          '<path d="M' + (x - dir * 2) + ' 128q' + (dir * 8) + ' 8 ' + (dir * 16) + ' 2" stroke="#d4a43a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="' + (x + dir * 15) + '" cy="131" r="2.4" fill="#f4c542"/><path d="M' + (x + dir * 15) + ' 133l' + (dir * -2) + ' 10M' + (x + dir * 15) + ' 133l' + (dir * 3) + ' 9" stroke="#d4a43a" stroke-width="1.3"/></g>';
      }
      function angel(x, dir) {   // รูปปั้นเทวดาหินอ่อนเป่าแตร บนแท่น
        var g = '<g transform="translate(' + x + ' 0) scale(' + dir + ' 1)">';
        g += '<rect x="-15" y="178" width="30" height="20" fill="url(#hvC)" stroke="#c8961e" stroke-width=".8"/><rect x="-18" y="174" width="36" height="5" fill="#f3ebdd" stroke="#c8961e" stroke-width=".8"/>';
        g += '<path d="M-3 132C-14 116-24 106-30 92c6 2 9 6 10 9 1-6 0-11-2-16 6 4 9 10 10 16 2-5 2-10 1-15 6 6 8 14 8 24z" fill="#efe6d6" stroke="#bfae94" stroke-width=".7"/>';
        g += '<path d="M-6 132c-3 14-7 28-12 42h28c-2-14-4-28-6-42z" fill="url(#hvC)" stroke="#bfae94" stroke-width=".7"/><path d="M-2 140c-1 10-3 22-6 32M3 140c1 10 1 22 2 32" stroke="#c9bca6" stroke-width=".7" fill="none"/>';
        g += '<circle cx="0" cy="124" r="6.4" fill="#f6efe2" stroke="#bfae94" stroke-width=".7"/><path d="M-6 121c2-5 8-7 12-3" stroke="#d9a536" stroke-width="1.4" fill="none"/>';
        g += '<path d="M3 134c5-2 8-6 9-11" stroke="#efe6d6" stroke-width="3" stroke-linecap="round" fill="none"/>';
        g += '<g transform="translate(6 123) rotate(-38)"><rect x="0" y="-1" width="26" height="2" rx="1" fill="#e6b84a"/><path d="M24-1.6l9-5q2 6.6 0 13.2l-9-5z" fill="#f4c542" stroke="#b9821c" stroke-width=".5"/></g>';
        return g + '</g>';
      }
      var tiles = '', VY = 120, rows = [198, 203, 209, 217, 228, 243, 262], cols = [];
      for (var cx2 = -585; cx2 <= 975; cx2 += 78) cols.push(cx2);
      for (var ri = 0; ri < rows.length - 1; ri++) {
        var y0 = rows[ri], y1 = rows[ri + 1], k0 = (y0 - VY) / (262 - VY), k1 = (y1 - VY) / (262 - VY);
        for (var ci = 0; ci < cols.length - 1; ci++) {
          if ((ri + ci) % 2) continue;
          var xa = 195 + (cols[ci] - 195) * k0, xb = 195 + (cols[ci + 1] - 195) * k0, xc = 195 + (cols[ci + 1] - 195) * k1, xd = 195 + (cols[ci] - 195) * k1;
          tiles += 'M' + f1(xa) + ' ' + y0 + 'L' + f1(xb) + ' ' + y0 + 'L' + f1(xc) + ' ' + y1 + 'L' + f1(xd) + ' ' + y1 + 'z';
        }
      }
      var vo = ''; for (var vi = 0; vi <= 14; vi++) { var va = Math.PI + vi * Math.PI / 14; vo += 'M' + f1(195 + 80 * Math.cos(va)) + ' ' + f1(112 + 80 * Math.sin(va)) + 'L' + f1(195 + 96 * Math.cos(va)) + ' ' + f1(112 + 96 * Math.sin(va)); }
      var arch = '<path d="M99 198V112A96 96 0 0 1 291 112V198H275V112A80 80 0 0 0 115 112V198z" fill="#f0dfc2" stroke="#c8961e" stroke-width="1"/>' +
        '<path d="' + vo + '" stroke="#d9c9ae" stroke-width=".8"/><path d="M115 198V112A80 80 0 0 1 275 112V198" stroke="#d4a43a" stroke-width="2" fill="none"/><path d="M99 112A96 96 0 0 1 291 112" stroke="#e8c870" stroke-width="1" fill="none"/>' +
        '<path d="M186 14h18l-3 20h-12z" fill="#f4c542" stroke="#8a5a12" stroke-width=".7"/><rect x="190" y="19" width="10" height="9" rx="1.5" fill="#fff6d6" stroke="#8a5a12" stroke-width=".6"/><path d="M192 22h6M192 24.6h4" stroke="#b9821c" stroke-width=".6"/>' +
        '<rect x="95" y="104" width="24" height="8" fill="#f3ebdd" stroke="#c8961e" stroke-width=".8"/><rect x="271" y="104" width="24" height="8" fill="#f3ebdd" stroke="#c8961e" stroke-width=".8"/>';
      var stars = '<g class="hv-stars" fill="#fff8dc">'; [[60, 46, .7], [150, 40, .5], [250, 44, .6], [330, 52, .8], [120, 70, .4], [282, 74, .45], [70, 96, .5], [36, 64, .4]].forEach(function (q, i) { stars += '<path class="hv-st" style="animation-delay:-' + (i * .6).toFixed(1) + 's" transform="translate(' + q[0] + ' ' + q[1] + ') scale(' + q[2] + ')" d="M0-5l1.2 3.8L5 0 1.2 1.2 0 5-1.2 1.2-5 0-1.2-1.2z"/>'; });
      stars += '</g><path d="M318 58a12 12 0 1 0 10 18 9.6 9.6 0 1 1-10-18z" fill="#fff4d6" opacity=".85"/>';
      function swag(dir) {
        var a = 195 - dir * 185, sx = function (v) { return 195 - dir * (195 - v); };
        return '<path d="M' + a + ' 24H195V38C' + sx(140) + ' 76 ' + sx(64) + ' 74 ' + a + ' 34z" fill="url(#hvF)" stroke="#d4a43a" stroke-width="1.2"/>' +
          '<path d="M' + sx(30) + ' 32C' + sx(80) + ' 60 ' + sx(140) + ' 60 ' + sx(186) + ' 34M' + sx(40) + ' 30C' + sx(86) + ' 48 ' + sx(140) + ' 48 ' + sx(180) + ' 30" stroke="#e3d6c0" stroke-width="1.4" fill="none"/>' +
          '<path d="M' + a + ' 34C' + sx(64) + ' 74 ' + sx(140) + ' 76 195 38" stroke="#e8c870" stroke-width="3" stroke-dasharray="1.2 1.6" fill="none"/>';
      }
      var notes = '<g class="hv-nts" fill="#ffe08a" font-family="serif" font-size="11" font-weight="700">';
      [[104, 103, 1], [286, 103, -1]].forEach(function (b, i) { notes += '<circle class="hv-bell" style="animation-delay:' + (i * 3) + 's" cx="' + b[0] + '" cy="' + b[1] + '" r="5" fill="#fff3c4"/>'; ['♪', '♫', '♪'].forEach(function (n, j) { notes += '<text class="hv-nt" style="--nx:' + (b[2] * (16 + j * 8)) + 'px;--ny:' + (-22 - j * 8) + 'px;animation-delay:' + (i * 3 + j * .35).toFixed(2) + 's" x="' + b[0] + '" y="' + b[1] + '">' + n + '</text>'; }); });
      notes += '</g>';
      var veins = '<path d="M0 214c40-6 70 6 110 2s60-10 96-4M180 236c40-8 90 4 140-4s50-6 70-2M20 248c50-4 80 6 130 2" stroke="#d9b45a" stroke-width=".7" fill="none" opacity=".55"/>';
      var dust = ''; for (var d = 0; d < 18; d++) { var pet = d % 3 === 0; dust += '<i class="hv-d' + (pet ? ' is-pet' : '') + '" style="left:' + (3 + Math.random() * 94).toFixed(1) + '%;--t:' + (6 + Math.random() * 7).toFixed(1) + 's;--d:-' + (Math.random() * 12).toFixed(1) + 's;--x:' + (Math.random() * 40 - 20).toFixed(0) + 'px;--s:' + (.6 + Math.random() * .8).toFixed(2) + '"></i>'; }
      var bok = ''; [[8, 30, 34], [86, 22, 26], [16, 74, 20], [78, 70, 40], [50, 12, 16], [94, 52, 18]].forEach(function (q, i) { bok += '<i class="hv-bk" style="left:' + q[0] + '%;top:' + q[1] + '%;width:' + q[2] + 'px;height:' + q[2] + 'px;--d:-' + (i * 1.7) + 's"></i>'; });
      hv.innerHTML = '<i class="hv-sky"></i><svg class="hv-svg" viewBox="0 0 390 256" preserveAspectRatio="xMidYMax slice"><defs>' +
        '<linearGradient id="hvC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfb48a"/><stop offset=".22" stop-color="#f1e2c6"/><stop offset=".45" stop-color="#fff8ea"/><stop offset=".7" stop-color="#ead6b4"/><stop offset="1" stop-color="#b9976a"/></linearGradient>' +
        '<linearGradient id="hvF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#fbf4ea"/><stop offset="1" stop-color="#e9dcc8"/></linearGradient>' +
        '<linearGradient id="hvB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c8" stop-opacity=".6"/><stop offset="1" stop-color="#fff3c8" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="hvS"><stop offset="0" stop-color="#fff2cc" stop-opacity=".85"/><stop offset=".22" stop-color="#ffe2a6" stop-opacity=".8"/><stop offset=".45" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ff9a6a" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="hvFl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9d6bd"/><stop offset=".3" stop-color="#f7ecdc"/><stop offset="1" stop-color="#d9c2a2"/></linearGradient>' +
        '<linearGradient id="hvP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cdb088"/><stop offset=".5" stop-color="#fff8ea"/><stop offset="1" stop-color="#c2a47a"/></linearGradient>' +
        '<radialGradient id="hvDk"><stop offset="0" stop-color="#4a1a30" stop-opacity=".75"/><stop offset=".55" stop-color="#6a2c40" stop-opacity=".35"/><stop offset="1" stop-color="#7a3a4a" stop-opacity="0"/></radialGradient><filter id="hvBl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter><filter id="hvBl2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.2"/></filter><radialGradient id="hvG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient></defs>' +
        '<g class="hv-sunw"><circle cx="' + CX + '" cy="' + CY + '" r="170" fill="url(#hvS)"/><circle cx="' + CX + '" cy="' + CY + '" r="58" fill="#ffe9bf" opacity=".3"/></g>' +
        stars + '<g class="hv-far">' + island(78, 92, .8, '#c98aa8') + island(318, 70, .65, '#c98aa8') + island(345, 120, .45, '#d7a0b6') + island(40, 52, .4, '#d7a0b6') + '</g>' +
        '<g class="hv-arch">' + arch + '</g><g class="hv-rays" fill="url(#hvB)"><path d="M180-10h30l60 270H120z" opacity=".5"/><path d="M150-10h14l-60 270H64z" opacity=".6"/><path d="M226-10h14l86 270h-40z" opacity=".6"/></g>' +
        '<g class="hv-halo"><circle cx="' + CX + '" cy="' + CY + '" r="70" fill="none" stroke="#e0b048" stroke-width="1"/><g fill="#d9a536">' + wreath + '</g>' +
          '<g class="hv-spin"><circle cx="' + CX + '" cy="' + CY + '" r="63" fill="none" stroke="#f2d48a" stroke-width=".8" stroke-dasharray="1 5"/></g>' +
          '<g fill="#b9821c" font-family="Georgia,serif" font-size="7.5" font-weight="700" text-anchor="middle" opacity=".85">' + num + '</g></g>' +
        '<rect x="-10" y="14" width="410" height="12" fill="#f3e8d8"/><path d="M-10 14H400M-10 26H400" stroke="#d4a43a" stroke-width=".9"/>' +
        '<rect x="0" y="198" width="390" height="58" fill="url(#hvFl)"/><path d="' + tiles + '" fill="#d2a862" opacity=".7"/>' + veins + '<path d="M0 198H390" stroke="#d4a43a" stroke-width="1"/><ellipse cx="' + CX + '" cy="206" rx="120" ry="7" fill="#fffbea" opacity=".7"/>' +
        '<g class="hv-ang">' + angel(72, 1) + angel(318, -1) + '</g>' + notes + col(14) + col(346) + '<g class="hv-swag">' + swag(1) + swag(-1) + '<circle cx="195" cy="38" r="3.4" fill="#f4c542" stroke="#8a5a12" stroke-width=".6"/><path class="hv-tas" d="M195 41l-3 12h6z" fill="#e0a92c" stroke="#8a5a12" stroke-width=".5"/></g><ellipse cx="195" cy="56" rx="78" ry="36" fill="url(#hvDk)"/>' +
        '<g class="hv-mist"><ellipse cx="70" cy="214" rx="90" ry="10" fill="url(#hvG)"/><ellipse cx="320" cy="220" rx="100" ry="11" fill="url(#hvG)"/></g>' +
        '<g class="hv-ped">' +
          '<ellipse cx="' + CX + '" cy="250" rx="148" ry="16" fill="#bfae94"/><path d="M47 242v8c0 9 66 16 148 16s148-7 148-16v-8z" fill="url(#hvP)"/><ellipse cx="' + CX + '" cy="242" rx="148" ry="16" fill="#f6efe2" stroke="#d4a43a" stroke-width="1.2"/>' +
          '<path d="M75 232v8c0 8 54 14 120 14s120-6 120-14v-8z" fill="url(#hvP)"/><ellipse cx="' + CX + '" cy="232" rx="120" ry="14" fill="#faf4ea" stroke="#d4a43a" stroke-width="1.2"/>' +
          '<path d="M103 218v13c0 7 41 13 92 13s92-6 92-13v-13z" fill="url(#hvP)"/><path d="M103 231c0 7 41 13 92 13s92-6 92-13" stroke="#d4a43a" stroke-width="1.4" fill="none"/>' +
          '<ellipse class="hv-top" cx="' + CX + '" cy="218" rx="92" ry="13" fill="#fbf7ef" stroke="#d4a43a" stroke-width="1.6"/><ellipse cx="' + CX + '" cy="218" rx="80" ry="10" fill="none" stroke="#e8c870" stroke-width=".7"/></g>' +
        '</svg><div class="hv-refl"></div><span class="hv-dust">' + dust + '</span><span class="hv-bks">' + bok + '</span><i class="hv-vig"></i><i class="hv-flash"></i>';
      var main = hv.querySelector('.hv-svg'), dfs = main.querySelector('defs'), back = '';
      ['.hv-sunw', '.hv-far', '.hv-arch', '.hv-ang'].forEach(function (sel2) { var n = main.querySelector(sel2); if (n) { back += '<g filter="url(#' + (sel2 === '.hv-far' ? 'hvBl2' : 'hvBl') + ')">' + n.outerHTML + '</g>'; n.remove(); } });
      main.insertAdjacentHTML('beforebegin', '<svg class="hv-svg hv-back" viewBox="0 0 390 256" preserveAspectRatio="xMidYMax slice">' + dfs.outerHTML + back + '</svg>');
      hv.querySelector('.hv-sky').insertAdjacentHTML('afterend', '<i class="hv-shoot"></i>');
    }
    var stg = sh.querySelector('.vst-stage'), orb = stg.querySelector('.vst-orb'), msb = sh.querySelector('.vst-ms');
    if (!orb) { orb = document.createElement('div'); orb.className = 'vst-orb'; orb.setAttribute('aria-hidden', 'true'); var oh = ''; [0, 1].forEach(function (r) { oh += '<span class="ob ob' + r + '"><span class="obr">'; for (var z = 0; z < 7; z++) oh += '<i style="transform:rotate(' + (z * 51.4 + r * 20).toFixed(1) + 'deg) translateY(-' + (r ? 70 : 84) + 'px)"></i>'; oh += '</span></span>'; }); orb.innerHTML = oh; msb.parentNode.insertBefore(orb, msb.nextSibling); }
    var sr = stg.getBoundingClientRect(), mr = msb.getBoundingClientRect(); orb.style.left = (mr.left - sr.left + mr.width / 2) + 'px'; orb.style.top = (mr.top - sr.top + mr.height * .5) + 'px';
    var rf = hv.querySelector('.hv-refl'), top = hv.querySelector('.hv-top'), msx = sh.querySelector('.vst-ms');
    if (rf && top && msx) {
      rf.innerHTML = msx.innerHTML;
      var q = sh.querySelector('.vst-stage').getBoundingClientRect(), t = top.getBoundingClientRect(), sv = msx.querySelector('svg'), m = (sv || msx).getBoundingClientRect();
      rf.style.cssText = 'left:' + (t.left - q.left) + 'px;top:' + (t.top - q.top) + 'px;width:' + t.width + 'px;height:' + t.height + 'px;--mx:' + (m.left - t.left).toFixed(1) + 'px;--mw:' + m.width.toFixed(1) + 'px;--mh:' + m.height.toFixed(1) + 'px;--fy:' + (m.top + m.height * 130 / 140 - t.top).toFixed(1) + 'px';
    }
    if (!was) { hv.classList.remove('in'); void hv.offsetWidth; hv.classList.add('in'); }
  }
  /* ฉากท้องพระโรงของมงกุฎตำนาน: ผนังลายดามัสก์ · ม่านกำมะหยี่แดง · บัลลังก์ทอง · เชิงเทียนเรืองแสง · พรมแดง · แท่นขั้นบันได · สปอตไลต์ · กลีบกุหลาบ */
  /* ===== ฉากหอคอยพ่อมดยามค่ำคืน (เลือก/ใส่หมวกนักเวท): ฟ้าดาว · จันทร์เสี้ยว · หอคอยหน้าต่างเรืองแสง · วงเวทบนพื้น · ผงดาวลอยขึ้น (วาดเองทั้งหมด) ===== */
  function wizScene(on) {
    var wv = sh.querySelector('.vst-wzs'); if (!wv) return;
    var wasW = sh.classList.contains('is-wzs');
    sh.classList.toggle('is-wzs', on);
    if (!on && wasW) dropLater(wv, 'is-wzs');
    if (!on || wv.getAttribute('data-on')) return;
    wv.setAttribute('data-on', '1');
    var R = function (a, b) { return a + Math.random() * (b - a); };
    var stars = ''; for (var k = 0; k < 46; k++) { var big = k % 9 === 0; stars += '<circle class="ws-st' + (k % 3 ? '' : ' tw') + '" cx="' + R(4, 386).toFixed(1) + '" cy="' + R(4, 150).toFixed(1) + '" r="' + (big ? 1.5 : R(.5, 1.05)).toFixed(2) + '" style="--d:-' + R(0, 4).toFixed(1) + 's"/>'; }
    var win = function (x, y) { return '<path d="M' + x + ' ' + (y + 9) + 'v-5a3 3 0 0 1 6 0v5z" fill="url(#wsWin)"/>'; };
    var tower =
      '<g class="ws-tw">' +
      /* หอคอยหลัก */
      '<path d="M58 256V112h40v144z" fill="url(#wsT)"/><path d="M52 114h52l-4-8H56z" fill="#1b1340"/>' +
      '<path d="M50 108 78 34q4-6 8 2l-2 4 22 68z" fill="#24185a" stroke="#120c2c" stroke-width="1.2" stroke-linejoin="round"/><path d="M78 34q10-4 16 4" stroke="#24185a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="95" cy="39" r="2.4" fill="#ffd36a" class="ws-tip"/>' +
      win(70, 128) + win(82, 150) + win(66, 178) + win(84, 206) +
      '<path d="M64 140h28M64 170h28M64 200h28M64 230h28" stroke="#120c2c" stroke-width=".8" opacity=".5"/>' +
      /* หอคอยรอง */
      '<path d="M104 256V170h22v86z" fill="url(#wsT2)"/><path d="M100 172 115 132l15 40z" fill="#1d1448" stroke="#120c2c" stroke-width="1" stroke-linejoin="round"/>' + win(112, 186) +
      '</g>';
    var dust = ''; for (var d = 0; d < 18; d++) dust += '<i class="ws-d" style="left:' + R(4, 96).toFixed(1) + '%;--t:' + R(5, 9).toFixed(1) + 's;--d:-' + R(0, 9).toFixed(1) + 's;--x:' + R(-24, 24).toFixed(0) + 'px;--s:' + R(.6, 1.3).toFixed(2) + '"></i>';
    var RUN = ''; for (var q = 0; q < 16; q++) RUN += '<circle cx="' + (60 + 50 * Math.cos(q / 16 * 6.283)).toFixed(1) + '" cy="' + (60 + 50 * Math.sin(q / 16 * 6.283)).toFixed(1) + '" r="' + (q % 4 ? 1 : 2) + '"/>';
    wv.innerHTML = '<svg class="ws-svg" viewBox="0 0 390 256" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<linearGradient id="wsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a2a"/><stop offset=".55" stop-color="#241650"/><stop offset="1" stop-color="#3b2170"/></linearGradient>' +
      '<radialGradient id="wsMg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4" stop-opacity=".55"/><stop offset=".45" stop-color="#cdb8ff" stop-opacity=".18"/><stop offset="1" stop-color="#cdb8ff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="wsT" x1="0" x2="1"><stop offset="0" stop-color="#2c2060"/><stop offset=".6" stop-color="#1c1444"/><stop offset="1" stop-color="#140e34"/></linearGradient>' +
      '<linearGradient id="wsT2" x1="0" x2="1"><stop offset="0" stop-color="#251a54"/><stop offset="1" stop-color="#120c2e"/></linearGradient>' +
      '<radialGradient id="wsWin"><stop offset="0" stop-color="#fff0b0"/><stop offset="1" stop-color="#f4b740"/></radialGradient>' +
      '<linearGradient id="wsH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1546"/><stop offset="1" stop-color="#120c2e"/></linearGradient></defs>' +
      '<rect width="390" height="256" fill="url(#wsSky)"/><g class="ws-stars">' + stars + '</g>' +
      '<g transform="translate(0 46)"><circle cx="312" cy="58" r="60" fill="url(#wsMg)"/><path class="ws-moon" d="M318 26a32 32 0 1 0 24 52 26 26 0 1 1-24-52z" fill="#fff3c4"/></g>' +
      '<path d="M0 214q60-26 120-12t130-8q70-12 140 6v56H0z" fill="#1a1240" opacity=".85"/>' + tower +
      '<path d="M0 232q90-14 195-10t195 8v26H0z" fill="url(#wsH)"/></svg>' +
      '<i class="ws-shoot"></i><div class="ws-dust">' + dust + '</div>' +
      '<svg class="ws-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="44" class="i"/><g class="rn">' + RUN + '</g><path d="M60 16 98 82H22z" class="t"/><path d="M60 104 22 38h76z" class="t"/></svg><i class="ws-vig"></i>';
  }
  /* ===== ฉากท้องฟ้าแห่งความฝัน (เลือก/ใส่หมวกนอนดาว): ฟ้าพาสเทล · เมฆนุ่มลอย · พระจันทร์หลับยิ้ม · ดาวห้อยเชือกแกว่ง · Zzz ลอย · ยืนบนก้อนเมฆ (วาดเองทั้งหมด) ===== */
  function dreamScene(on) {
    var dv = sh.querySelector('.vst-drm'); if (!dv) return;
    var wasD = sh.classList.contains('is-drm');
    sh.classList.toggle('is-drm', on);
    if (!on && wasD) dropLater(dv, 'is-drm');
    if (!on || dv.getAttribute('data-on')) return;
    dv.setAttribute('data-on', '1');
    var R = function (a, b) { return a + Math.random() * (b - a); };
    var stars = ''; for (var k = 0; k < 34; k++) stars += '<circle class="dm-st' + (k % 3 ? '' : ' tw') + '" cx="' + R(4, 386).toFixed(1) + '" cy="' + R(4, 140).toFixed(1) + '" r="' + R(.5, 1.2).toFixed(2) + '" style="--d:-' + R(0, 4).toFixed(1) + 's"/>';
    var cloud = function (x, y, s, o, c) { return '<g class="dm-cl ' + c + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" opacity="' + o + '"><path d="M-40 12Q-46 0-34-4Q-32-18-16-16Q-8-30 8-24Q20-32 30-20Q46-20 44-4Q54 2 44 12Z" fill="url(#dmCl)"/><path d="M-30 4Q-12 0 4 6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/></g>'; };
    var hang = function (x, len, sc, d) { return '<g class="dm-hg" style="--d:' + d + 's;transform-origin:' + x + 'px 0"><path d="M' + x + ' 0v' + len + '" stroke="#e8dcff" stroke-width=".8" opacity=".75"/><path transform="translate(' + x + ' ' + (len + 6) + ') scale(' + sc + ')" d="M0-7 2.1-2.3 7.2-1.9 3.3 1.4 4.5 6.4 0 3.7-4.5 6.4-3.3 1.4-7.2-1.9-2.1-2.3z" fill="#ffe28a" stroke="#c9952a" stroke-width=".8" stroke-linejoin="round"/></g>'; };
    var zz = ''; for (var z = 0; z < 3; z++) zz += '<i class="dm-z" style="--d:' + (z * 1.4) + 's;--s:' + (0.8 + z * .25) + '">z</i>';
    dv.innerHTML = '<svg class="dm-svg" viewBox="0 0 390 256" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<linearGradient id="dmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2463"/><stop offset=".5" stop-color="#4b4a9e"/><stop offset=".85" stop-color="#9b7fc8"/><stop offset="1" stop-color="#d6a6cf"/></linearGradient>' +
      '<radialGradient id="dmMg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d6" stop-opacity=".6"/><stop offset=".5" stop-color="#ffd9f0" stop-opacity=".16"/><stop offset="1" stop-color="#ffd9f0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="dmMn" cx=".35" cy=".4" r=".8"><stop offset="0" stop-color="#fffbe6"/><stop offset=".6" stop-color="#ffe9a6"/><stop offset="1" stop-color="#f2c45e"/></radialGradient>' +
      '<linearGradient id="dmCl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3d6f6"/></linearGradient></defs>' +
      '<rect width="390" height="256" fill="url(#dmSky)"/><g class="dm-stars">' + stars + '</g>' +
      hang(46, 34, 1, -.4) + hang(82, 18, .75, -1.6) + hang(338, 26, .9, -2.4) +
      '<g transform="translate(24.5 60.8) scale(.92)"><circle cx="300" cy="62" r="58" fill="url(#dmMg)"/><g class="dm-moon">' +
      '<path d="M306.1 28A32 32 0 1 0 336.3 70.2A26 26 0 0 1 306.1 28Z" fill="url(#dmMn)" stroke="#c99236" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M285 40Q278 50 278 62" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="296" cy="84" r="2.2" fill="#f0c766" opacity=".7"/><circle cx="283" cy="74" r="1.5" fill="#f0c766" opacity=".7"/>' +
      '<path d="M286 60q3.4 3 6.8 0" stroke="#6b4a18" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M287 61.5l-1.4 1.6M289.4 62.6l-.4 2M292 61.6l1 1.6" stroke="#6b4a18" stroke-width="1.1" stroke-linecap="round"/>' +
      '<path d="M291 69q3 2.6 6 .2" stroke="#6b4a18" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="285" cy="68" rx="3.4" ry="2" fill="#f7a3a0" opacity=".75"/></g></g>' +
      cloud(70, 92, .9, .55, 'a') + cloud(320, 158, .75, .5, 'b') + cloud(30, 190, 1.2, .7, 'c') + cloud(360, 214, 1.3, .75, 'a') +
      '<path d="M0 236q50-18 100-6t95-4q48-12 95 2t100-2v30H0z" fill="#f1e6fb" opacity=".55"/></svg>' +
      '<div class="dm-zz">' + zz + '</div>' +
      '<svg class="dm-pd" viewBox="0 0 220 64" aria-hidden="true"><defs><linearGradient id="dmPd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#efe6fb"/><stop offset="1" stop-color="#c8b6ea"/></linearGradient></defs>' +
      '<path d="M18 50Q4 48 8 36Q6 24 22 24Q26 12 44 14Q54 2 72 8Q84 0 100 6Q114-2 128 6Q144 0 156 10Q174 6 180 18Q198 16 200 30Q216 34 208 46Q206 56 190 56H30Q16 58 18 50Z" fill="url(#dmPd)"/>' +
      '<path d="M34 30Q60 22 92 26M120 20Q150 16 176 26" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/><path d="M30 56H190" stroke="#b8a2e0" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg><i class="dm-vig"></i>';
  }
  function throneScene(on) {
    var tv = sh.querySelector('.vst-thr'); if (!tv) return;
    var was = sh.classList.contains('is-thr');
    sh.classList.toggle('is-thr', on);
    if (!on) { if (was) dropLater(tv, 'is-thr'); return; }
    if (!tv.getAttribute('data-on')) {
      tv.setAttribute('data-on', '1');
      var tuft = ''; for (var ty = 64; ty < 190; ty += 16) for (var tx = 162; tx <= 228; tx += 16) tuft += '<circle cx="' + (tx + ((ty / 16) % 2 ? 8 : 0)) + '" cy="' + ty + '" r="1.4" fill="#4a0410"/>';
      function curtain(dir) {
        var x0 = dir > 0 ? 0 : 390, sx = function (v) { return dir > 0 ? v : 390 - v; };
        return '<g class="tr-cur"><path d="M' + x0 + ' 0H' + sx(78) + 'C' + sx(74) + ' 60 ' + sx(56) + ' 120 ' + sx(40) + ' 150C' + sx(52) + ' 180 ' + sx(60) + ' 220 ' + sx(64) + ' 256H' + x0 + 'z" fill="url(#trC)"/>' +
          '<path d="M' + sx(16) + ' 0C' + sx(18) + ' 60 ' + sx(20) + ' 110 ' + sx(22) + ' 150M' + sx(36) + ' 0C' + sx(36) + ' 60 ' + sx(32) + ' 110 ' + sx(30) + ' 150M' + sx(56) + ' 0C' + sx(54) + ' 60 ' + sx(46) + ' 110 ' + sx(38) + ' 150M' + sx(30) + ' 160C' + sx(36) + ' 200 ' + sx(42) + ' 230 ' + sx(46) + ' 256M' + sx(14) + ' 160C' + sx(16) + ' 200 ' + sx(18) + ' 230 ' + sx(20) + ' 256" stroke="#3a0410" stroke-width="2" fill="none" opacity=".6"/>' +
          '<path d="M' + sx(4) + ' 146q' + (dir * 20) + ' 10 ' + (dir * 40) + ' 4" stroke="#f4c542" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="' + sx(44) + '" cy="150" r="3.4" fill="#f4c542" stroke="#8a5a12" stroke-width=".8"/><path d="M' + sx(44) + ' 153l-2 14h4z" fill="#e0a92c" stroke="#8a5a12" stroke-width=".6"/></g>';
      }
      var fr = ''; for (var fx = 0; fx < 390; fx += 6) fr += 'M' + fx + ' 30v' + (5 + (fx / 6 % 2) * 2);
      function sconce(x) { return '<g transform="translate(' + x + ' 96)"><circle r="22" fill="url(#trL)"/><path d="M-8 10h16l-3 6h-10z" fill="#d4a43a" stroke="#7a4d08" stroke-width=".8"/><rect x="-2" y="-2" width="4" height="12" fill="#fff6e0"/><path class="tr-fl" d="M0-12c-2.6 3-3.4 5.4-3.4 7a3.4 3.4 0 0 0 6.8 0c0-1.6-.8-4-3.4-7z" fill="#ffcf5a"/></g>'; }
      var dust = ''; for (var d = 0; d < 16; d++) { var pet = d % 2 === 0; dust += '<i class="tr-d' + (pet ? ' is-pet' : '') + '" style="left:' + (4 + Math.random() * 92).toFixed(1) + '%;--t:' + (6 + Math.random() * 6).toFixed(1) + 's;--d:-' + (Math.random() * 12).toFixed(1) + 's;--x:' + (Math.random() * 40 - 20).toFixed(0) + 'px;--s:' + (.7 + Math.random() * .7).toFixed(2) + '"></i>'; }
      var carpet = '<path d="M172 200h46l52 56H120z" fill="url(#trK)"/><path d="M172 200L120 256M218 200l52 56" stroke="#f4c542" stroke-width="2.4"/><path d="M178 200l-46 56M212 200l46 56" stroke="#f4c542" stroke-width=".8" opacity=".6"/>';
      tv.innerHTML = '<svg class="tr-svg" viewBox="0 0 390 256" preserveAspectRatio="xMidYMax slice"><defs>' +
        '<linearGradient id="trW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0610"/><stop offset=".55" stop-color="#5a1020"/><stop offset="1" stop-color="#3a0a14"/></linearGradient>' +
        '<pattern id="trD" width="26" height="30" patternUnits="userSpaceOnUse"><path d="M13 3c3 4 7 6 7 12s-4 9-7 12c-3-3-7-6-7-12s4-8 7-12z" fill="none" stroke="#f4c542" stroke-width=".8" opacity=".14"/><circle cx="13" cy="15" r="1.4" fill="#f4c542" opacity=".14"/></pattern>' +
        '<linearGradient id="trC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a0614"/><stop offset=".35" stop-color="#b3122e"/><stop offset=".6" stop-color="#7a0a1e"/><stop offset=".85" stop-color="#c41c38"/><stop offset="1" stop-color="#5a0614"/></linearGradient>' +
        '<linearGradient id="trG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a0c"/><stop offset=".3" stop-color="#ffe9a0"/><stop offset=".55" stop-color="#d4a43a"/><stop offset=".8" stop-color="#fff0b0"/><stop offset="1" stop-color="#8a5a0c"/></linearGradient>' +
        '<radialGradient id="trV" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#d42a46"/><stop offset="1" stop-color="#6a0818"/></radialGradient>' +
        '<radialGradient id="trL"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="trK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a0a1e"/><stop offset="1" stop-color="#c41c38"/></linearGradient>' +
        '<linearGradient id="trF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e0a10"/><stop offset="1" stop-color="#3a1a1e"/></linearGradient>' +
        '<linearGradient id="trS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d0" stop-opacity=".5"/><stop offset="1" stop-color="#fff3d0" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="trP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a0818"/><stop offset=".5" stop-color="#c41c38"/><stop offset="1" stop-color="#6a0818"/></linearGradient></defs>' +
        '<rect width="390" height="256" fill="url(#trW)"/><rect width="390" height="200" fill="url(#trD)"/>' +
        '<circle cx="195" cy="110" r="120" fill="url(#trL)" opacity=".5"/>' + sconce(98) + sconce(292) +
        '<g class="tr-throne"><path d="M134 200V72q0-34 61-46 61 12 61 46v128z" fill="url(#trG)" stroke="#5a3a06" stroke-width="1.4"/><path d="M148 196V76q0-24 47-34 47 10 47 34v120z" fill="url(#trV)" stroke="#7a4d08" stroke-width="1.2"/>' + tuft +
          '<circle cx="134" cy="66" r="6" fill="url(#trG)" stroke="#5a3a06" stroke-width="1"/><circle cx="256" cy="66" r="6" fill="url(#trG)" stroke="#5a3a06" stroke-width="1"/>' +
          '<g transform="translate(195 22) scale(.55)"><path d="M-20 6L-23-12-15 0-11.5-7-6 0 0-19 6 0 11.5-7 15 0 23-12 20.5 6z" fill="url(#trG)" stroke="#5a3a06" stroke-width="1.6"/><rect x="-21" y="4" width="42" height="7" rx="2" fill="url(#trG)" stroke="#5a3a06" stroke-width="1.6"/><circle cy="7.5" r="2.6" fill="#ff3456"/></g>' +
          '<path d="M116 150h30v50h-30z" fill="url(#trG)" stroke="#5a3a06" stroke-width="1.2"/><path d="M244 150h30v50h-30z" fill="url(#trG)" stroke="#5a3a06" stroke-width="1.2"/><rect x="112" y="144" width="38" height="10" rx="5" fill="url(#trV)" stroke="#7a4d08" stroke-width="1"/><rect x="240" y="144" width="38" height="10" rx="5" fill="url(#trV)" stroke="#7a4d08" stroke-width="1"/></g>' +
        '<rect x="0" y="200" width="390" height="56" fill="url(#trF)"/><path d="M0 200H390" stroke="#d4a43a" stroke-width="1.2"/>' + carpet +
        '<path class="tr-spot" d="M175-10h40l60 250H115z" fill="url(#trS)"/>' +
        curtain(1) + curtain(-1) +
        '<path d="M-5 0H395V22C340 44 260 44 195 30 130 44 50 44-5 22z" fill="url(#trC)"/><path d="M-5 22C50 44 130 44 195 30 260 44 340 44 395 22" stroke="#f4c542" stroke-width="2" fill="none"/><path d="M-5 26C50 48 130 48 195 34 260 48 340 48 395 26" stroke="#f4c542" stroke-width="3" stroke-dasharray="1.2 2" fill="none"/>' +
        '<g class="tr-dais"><ellipse cx="195" cy="244" rx="128" ry="15" fill="#3a0a14"/><path d="M67 236v8c0 8 57 15 128 15s128-7 128-15v-8z" fill="url(#trP)"/><ellipse cx="195" cy="236" rx="128" ry="15" fill="#a3122c" stroke="#f4c542" stroke-width="1.4"/>' +
          '<path d="M103 220v12c0 7 41 13 92 13s92-6 92-13v-12z" fill="url(#trG)"/><ellipse cx="195" cy="220" rx="92" ry="13" fill="url(#trV)" stroke="#f4c542" stroke-width="1.8"/><ellipse cx="195" cy="220" rx="80" ry="10" fill="none" stroke="#f4c542" stroke-width=".7" stroke-dasharray="2 2"/></g></svg>' +
        '<span class="tr-dust">' + dust + '</span><i class="tr-vig"></i><i class="tr-flash"></i>';
    }
    if (!was) { tv.classList.remove('in'); void tv.offsetWidth; tv.classList.add('in'); }
  }
  /* ===== ฉากห้องสมุดที่ไม่เคยหลับ (เหรียญไฟไม่มอด): ชั้นหนังสือสองข้าง · หน้าต่างกระจกสีรูปเปลวไฟ + ลำแสง · แท่นหินแกะสลัก — สีตามระดับผ่าน CSS (data-tier) ===== */
  function libScene() {
    var R = function (a, b) { return a + Math.random() * (b - a); };
    var bays = [[20, 130], [140, 250], [262, 322], [578, 638], [650, 760], [770, 880]], rows = [74, 128, 182, 236, 290], sh_ = '', bk = '', gk = '';
    bays.forEach(function (b) {
      sh_ += '<rect class="lb-wd2" x="' + (b[0] - 6) + '" y="14" width="' + (b[1] - b[0] + 12) + '" height="280" rx="2"/><rect class="lb-bk" x="' + b[0] + '" y="20" width="' + (b[1] - b[0]) + '" height="272"/>';
      rows.forEach(function (y) {
        var x = b[0] + 2;
        while (x < b[1] - 6) {
          var w = R(5, 10), hh = R(30, 46), c = 'b' + (1 + Math.floor(Math.random() * 5)), gl = Math.random() < .09;
          if (x + w > b[1] - 2) break;
          if (Math.random() < .08 && x + hh * .5 < b[1] - 4) { bk += '<rect class="' + c + '" x="' + x.toFixed(1) + '" y="' + (y - w).toFixed(1) + '" width="' + (hh * .8).toFixed(1) + '" height="' + w.toFixed(1) + '" rx="1"/>'; x += hh * .8 + 1; continue; }
          var bkS = '<rect class="' + c + (gl ? ' gl' : '') + '" x="' + x.toFixed(1) + '" y="' + (y - hh).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="1"' + (gl ? ' style="--d:-' + R(0, 4).toFixed(1) + 's"' : '') + '/>' +
            (w > 7 ? '<rect class="lb-band" x="' + x.toFixed(1) + '" y="' + (y - hh + 5).toFixed(1) + '" width="' + w.toFixed(1) + '" height="2"/>' : '');
          if (gl) gk += bkS; else bk += bkS;
          x += w + R(.6, 1.8);
        }
        sh_ += '<rect class="lb-wd" x="' + (b[0] - 6) + '" y="' + y + '" width="' + (b[1] - b[0] + 12) + '" height="6" rx="1"/>';
      });
    });
    var pet = ''; for (var i = 0; i < 12; i++) { var a0 = i / 12 * 6.2832, a1 = (i + 1) / 12 * 6.2832, P = function (r, a) { return (450 + r * Math.cos(a)).toFixed(1) + ' ' + (128 + r * Math.sin(a)).toFixed(1); };
      pet += '<path class="' + (i % 2 ? 'g1' : 'g2') + '" d="M' + P(40, a0) + 'L' + P(84, a0) + 'A84 84 0 0 1 ' + P(84, a1) + 'L' + P(40, a1) + 'A40 40 0 0 0 ' + P(40, a0) + 'Z"/>'; }
    var rays = '<g class="lb-rays"><path d="M408 190 340 300H420z"/><path d="M450 212 430 300H480z" class="r2"/><path d="M492 190 560 300H480z"/></g>';
    return '<div class="vst-lib" aria-hidden="true"><svg class="lb-svg" viewBox="0 0 900 360" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<radialGradient id="lbWg"><stop offset="0" style="stop-color:var(--lg)" stop-opacity=".55"/><stop offset=".6" style="stop-color:var(--lg)" stop-opacity=".12"/><stop offset="1" style="stop-color:var(--lg)" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lbRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--lg)" stop-opacity=".35"/><stop offset="1" style="stop-color:var(--lg)" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lbFl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--lfl)"/><stop offset="1" stop-color="#000"/></linearGradient></defs>' +
      '<rect class="lb-wall" width="900" height="360"/>' +
      '<path class="lb-st" d="M312 300V96Q312 4 450 4Q588 4 588 96V300H570V98Q570 22 450 22Q330 22 330 98V300Z"/><path class="lb-st2" d="M330 300V98Q330 22 450 22Q570 22 570 98V300Z"/>' +
      '<circle cx="450" cy="128" r="140" fill="url(#lbWg)"/>' + sh_ + bk + '</svg>' +
      '<svg class="lb-svg lb-anim" viewBox="0 0 900 360" preserveAspectRatio="xMidYMax slice">' + gk +
      '<g class="lb-win"><circle cx="450" cy="128" r="92" class="lb-rim"/>' + pet + '<circle cx="450" cy="128" r="40" class="g3"/>' +
      '<path class="g4" d="M450 98C462 112 470 122 466 138C463 150 456 156 450 158C444 156 437 150 434 138C432 128 438 120 444 114C444 124 448 128 451 128C452 118 448 108 450 98Z"/>' +
      '<g class="lb-lead"><circle cx="450" cy="128" r="84"/><circle cx="450" cy="128" r="40"/><circle cx="450" cy="128" r="62"/></g></g>' + rays +
      '<rect class="lb-fl" y="292" width="900" height="68" fill="url(#lbFl)"/><path class="lb-fll" d="M0 300H900M120 300 40 360M300 300 260 360M450 300V360M600 300 640 360M780 300 860 360"/></svg><i class="lb-vig"></i>' +
      '<svg class="vst-pd3" viewBox="0 0 230 64"><defs><linearGradient id="pdS" x1="0" x2="1"><stop offset="0" style="stop-color:var(--ps0)"/><stop offset=".45" style="stop-color:var(--ps1)"/><stop offset="1" style="stop-color:var(--ps0)"/></linearGradient>' +
      '<radialGradient id="pdT" cx=".5" cy=".35" r=".7"><stop offset="0" style="stop-color:var(--ps1)"/><stop offset="1" style="stop-color:var(--ps0)"/></radialGradient></defs>' +
      '<ellipse cx="115" cy="40" rx="108" ry="8" class="pd-b"/><path d="M15 16V36A100 13 0 0 0 215 36V16Z" fill="url(#pdS)"/>' +
      '<g class="pd-c">' + [40, 64, 90, 115, 140, 166, 190].map(function (x) { return '<path d="M' + x + ' 21q3 4 0 9q-3-5 0-9z"/>'; }).join('') + '</g>' +
      '<path d="M15 36A100 13 0 0 0 215 36" class="pd-m"/><path d="M15 33A100 13 0 0 0 215 33" class="pd-m2"/>' +
      '<ellipse cx="115" cy="16" rx="100" ry="13" fill="url(#pdT)" class="pd-tm"/><ellipse cx="115" cy="16" rx="76" ry="9.5" class="pd-in"/><ellipse cx="115" cy="16" rx="90" ry="11.6" class="pd-fl"/></svg></div>';
  }
  function fireScene(on, picked) {
    var f = sh.querySelector('.vst-fire'), x = sh.querySelector('.vst-extra');
    if (!on) { f.innerHTML = ''; x.innerHTML = ''; f.removeAttribute('data-on'); return; }
    if (!f.getAttribute('data-on')) {
      f.setAttribute('data-on', '1');
      var bk = '';
      for (var k = 0; k < 16; k++) {
        var sz = 3 + Math.random() * 12;
        bk += '<i class="vst-bk" style="left:' + (4 + Math.random() * 92).toFixed(1) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;--b:' + (sz > 9 ? 4 : sz > 6 ? 2 : .6) + 'px;--t:' + (7 + Math.random() * 8).toFixed(1) + 's;--d:-' + (Math.random() * 12).toFixed(1) + 's;--o:' + (.35 + Math.random() * .5).toFixed(2) + '"></i>';
      }
      var sn = '', sd = '';
      for (var q = 0; q < 18; q++) { var z = 4 + Math.random() * 8; sn += '<i class="vst-sf" style="left:' + (Math.random() * 100).toFixed(1) + '%;font-size:' + z.toFixed(1) + 'px;--t:' + (8 + Math.random() * 8).toFixed(1) + 's;--d:-' + (Math.random() * 14).toFixed(1) + 's;--x:' + (Math.random() * 40 - 20).toFixed(0) + 'px">❄</i>'; }
      var SH = [[18, 30, 10], [80, 26, 8], [12, 62, 7], [86, 58, 11], [26, 82, 6], [74, 80, 8]];
      SH.forEach(function (p, n) { sd += '<i class="vst-shard" style="left:' + p[0] + '%;top:' + p[1] + '%;width:' + p[2] + 'px;height:' + (p[2] * 1.7).toFixed(0) + 'px;--d:-' + (n * .9).toFixed(1) + 's"></i>'; });
      f.innerHTML = libScene() + '<i class="vst-smoke"></i><i class="vst-smoke s2"></i><i class="vst-haze"></i>' + bk +
        '<i class="vst-neb"></i><i class="vst-stars"></i><i class="vst-stars s2"></i>' + sd + '<i class="vst-fog"></i><i class="vst-aur"></i><i class="vst-aur a2"></i><i class="vst-crk"></i>' + sn + '<i class="vst-hor"></i>';
    }
    var bd = (S.badges || []).filter(function (b) { return b.id === 's7'; })[0], best = S.bestStreak || 0, rt = realTier(), line2 = '', pips = '';
    if (bd && !bd.earned) {
      for (var k2 = 0; k2 < bd.n; k2++) pips += '<i class="' + (k2 < bd.have ? 'on' : '') + '"></i>';
      line2 = 'ปลดล็อกในอีก ' + (bd.n - bd.have) + ' วัน';
    } else if (best < 30) line2 = 'อีก ' + ((best < 14 ? 14 : 30) - best) + ' วัน สู่ระดับ' + (best < 14 ? 'ทองคำขาว' : 'เพชร');
    else line2 = 'ระดับสูงสุด';
    var html = '<div class="vst-lux"><em>' + (medalTier() === 3 ? '<i class="vst-dia"></i>' : '') + 'LIMITED · ' + (MED[medalTier()].name === 'ทอง' ? 'GOLD' : MED[medalTier()].name === 'ทองคำขาว' ? 'PLATINUM' : 'DIAMOND') + '</em>' +
      '<b>ของรางวัลเฉพาะผู้ไม่ยอมแพ้</b><span>' + line2 + '</span>' + (pips ? '<span class="vst-dots">' + pips + '</span>' : '') + '</div>';
    if (picked) {
      var got = bd && bd.earned ? rt : 0, prog = Math.min(best, 30);
      // ตำแหน่งบนเส้นทาง: 0→7 วัน = 0→1/3 ... 30 วัน = 1 (แบ่ง 3 ช่วง: 0-7, 7-14, 14-30)
      var pos = prog <= 7 ? prog / 7 / 2 * 0 + (prog / 7) * 0 : 0;
      var fill = prog >= 30 ? 100 : prog >= 14 ? 50 + (prog - 14) / 16 * 50 : prog >= 7 ? (prog - 7) / 7 * 50 : 0;
      var pre = prog < 7 ? Math.round(prog / 7 * 100) : 100;
      html += '<div class="vst-tiers vst-path" role="group" aria-label="ดูตัวอย่างระดับเหรียญ" style="--fill:' + fill.toFixed(1) + '%;--pre:' + pre + '%">' +
        '<i class="vtp-pre"><b></b></i><i class="vtp-line"><b></b></i>' +
        [[1, 'ทอง', 7], [2, 'ทองคำขาว', 14], [3, 'เพชร', 30]].map(function (t) {
          var c = MED[t[0]], isOn = medalTier() === t[0], has = got >= t[0];
          return '<button type="button" data-tier="' + t[0] + '" class="vtp t' + t[0] + (isOn ? ' on' : '') + (has ? ' got' : ' lock') + '" aria-pressed="' + isOn + '" aria-label="ระดับ' + t[1] + ' ' + t[2] + ' วัน' + (has ? ' ได้แล้ว' : '') + '" style="--c1:' + c.f1 + ';--c2:' + c.f2 + ';--rim:' + c.rim + '">' +
            '<span class="vtp-c"><svg viewBox="47 84 26 26" aria-hidden="true">' + medalArt(t[0]).replace(/<g class="md-burst"[\s\S]*?<\/g>/, '') + '</svg>' + (has ? '' : '<i class="vtp-lk"></i>') + '</span>' +
            '<b>' + t[1] + '</b><small>' + (has ? 'ได้แล้ว ✓' : t[2] + ' วัน') + '</small></button>';
        }).join('') + '</div>';
    }
    x.innerHTML = html;
  }
  /* (5) เหรียญเป็นพระเอก: ลอยใหญ่กลางฉาก หมุนช้า ๆ แล้วลอยลงไปคล้องคอน้อง */
  var heroKey = '', heroT = [];
  var heroPlayed = false;
  function playHero(t) {   // เล่นครั้งเดียวต่อการเข้าร้าน: เหรียญลอยเด่นด้านบน แล้วค่อย ๆ ลอยลงไปคล้องคอน้อง
    var hEl = sh.querySelector('.vst-hero'), ms = sh.querySelector('.vst-ms');
    heroT.forEach(clearTimeout); heroT = [];
    if (calm()) return;
    heroPlayed = true;
    hEl.innerHTML = '<i class="vst-rays"></i><svg viewBox="36 66 48 54">' + medalArt(t) + '</svg>';
    hEl.className = 'vst-hero'; hEl.style.transform = ''; void hEl.offsetWidth; hEl.classList.add('show'); ms.classList.add('hide-medal');
    heroT.push(setTimeout(function () {
      var tgt = ms.querySelector('.md-worn'); if (!tgt || !hEl.animate) { done(); return; }
      var a = hEl.querySelector('svg').getBoundingClientRect(), b = tgt.getBoundingClientRect();
      var k = b.height / a.height, dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      hEl.classList.add('fly');
      var an = hEl.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')' }], { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
      an.onfinish = done;
    }, 1700));
    function done() {
      ms.classList.remove('hide-medal'); hEl.className = 'vst-hero'; hEl.getAnimations && hEl.getAnimations().forEach(function (x) { x.cancel(); });
      var f = document.createElement('i'); f.className = 'vst-clasp'; var b = ms.querySelector('.md-worn'), st = sh.querySelector('.vst-stage');
      if (b && st) { var r = b.getBoundingClientRect(), q = st.getBoundingClientRect(); f.style.left = (r.left - q.left + r.width / 2) + 'px'; f.style.top = (r.top - q.top + r.height / 2) + 'px'; st.appendChild(f); setTimeout(function () { f.remove(); }, 900); }
      hop(ms);
    }
  }
  /* มาลัยตำนาน: บทเปิดตัว — เทพธิดาเป่าแตรทองบนก้อนเมฆ · น้ำพุหินอ่อนพุ่ง · มาลัยลอยขึ้นจากสายน้ำแล้วบินไปสวมหัวน้อง (แตะเพื่อข้าม) */
  var lrPlayed = false, lrT = [], lrEnd = null;
  function lrStop() { lrT.forEach(clearTimeout); lrT = []; if (lrEnd) lrEnd(true); }
  function goddessSvg() {
    return '<svg class="vli-gd" viewBox="0 0 150 150" aria-hidden="true"><defs>' +
      '<linearGradient id="gdG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset=".45" stop-color="#ffe08a"/><stop offset="1" stop-color="#d49a2a"/></linearGradient>' +
      '<linearGradient id="gdW" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fffdf4"/><stop offset=".6" stop-color="#fff0c0"/><stop offset="1" stop-color="#f4c542"/></linearGradient>' +
      '<linearGradient id="gdT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9821c"/><stop offset=".5" stop-color="#fff3c4"/><stop offset="1" stop-color="#e0a92c"/></linearGradient>' +
      '<radialGradient id="gdH"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="66" cy="62" r="56" fill="url(#gdH)" opacity=".55"/>' +
      '<g class="vli-wing" stroke="#e0a92c" stroke-width=".5">' + [-38, -24, -10, 4, 18].map(function (r, k) { return '<path transform="rotate(' + r + ' 60 60)" d="M60 60C50 50 30 44 ' + (6 + k * 3) + ' 46C' + (24 + k * 2) + ' 54 44 60 60 63z" fill="url(#gdW)" opacity="' + (1 - k * .1).toFixed(2) + '"/>'; }).join('') + '<path d="M60 60C52 54 40 52 30 54" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/></g>' +
      '<path d="M18 132c-8 0-12-5-10-10 2-6 9-7 13-4 2-8 12-11 18-6 4-7 16-8 21 0 6-5 17-2 18 6 6-3 14 0 14 7 0 5-4 7-8 7z" fill="#fff8e6" opacity=".92"/>' +
      '<path d="M60 60c-6 16-12 38-22 66 18 6 42 6 58-2-8-22-14-44-20-64z" fill="url(#gdG)"/>' +
      '<path d="M64 64c2 18 8 40 16 58M58 70c-2 16-6 34-12 52" stroke="#c8861a" stroke-width="1" fill="none" opacity=".55"/>' +
      '<path d="M55 64c6-6 14-6 20 0" stroke="#fff6d6" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M60 34c-8-3-14 4-12 12-5 6-3 14 4 16 1-7 4-12 9-15z" fill="#c8861a"/><circle cx="57" cy="31" r="5" fill="#c8861a"/>' +
      '<rect x="64" y="44" width="5" height="10" rx="2" fill="url(#gdG)"/>' +
      '<circle cx="67" cy="40" r="10.5" fill="url(#gdG)"/><path d="M76 38l2.6 2.4-2.4.8" fill="url(#gdG)"/>' +
      '<path d="M69 37.5q2.4 1.6 4.4 0" stroke="#8a5a12" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="72" cy="43.5" r="2" fill="#ff9aa8" opacity=".55"/>' +
      '<path d="M57 32c3-5 9-8 15-6M58 29l-2-3M62 27l-1-3.4M66 26l.4-3.6M70 26.4l1.6-3.2" stroke="#3fae6a" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M68 56c6-2 9-6 10-11" stroke="url(#gdG)" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g class="vli-tp" transform="translate(77 43) rotate(22)">' +
        '<rect x="0" y="-1.4" width="54" height="2.8" rx="1.4" fill="url(#gdT)"/><circle cx="20" cy="0" r="2.4" fill="#e0a92c"/>' +
        '<path d="M50-2.4L66-10q3 10 0 20L50 2.4z" fill="url(#gdT)" stroke="#8a5a12" stroke-width=".6"/><ellipse class="vli-bell" cx="66" cy="0" rx="1.8" ry="10" fill="#fff6d6"/>' +
        '<path d="M24 1.4h18l-2 13-7-3.4-7 3.4z" fill="#b3122e" stroke="#f4c542" stroke-width=".8"/><circle cx="33" cy="6.6" r="2.2" fill="#f4c542"/></g>' +
      '<g class="vli-wv" fill="none" stroke="#fff3c4" stroke-linecap="round"><path d="M144 66q4 8 0 16"/><path d="M138 62q7 12 0 24" opacity=".6"/></g></svg>';
  }
  function fountainSvg() {
    return '<svg class="vli-fn" viewBox="0 0 120 130" aria-hidden="true"><defs>' +
      '<linearGradient id="fnM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfc6b8"/><stop offset=".45" stop-color="#fffdf7"/><stop offset="1" stop-color="#b9ae9c"/></linearGradient>' +
      '<linearGradient id="fnW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9fbff"/><stop offset="1" stop-color="#7fd3f0" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="fnJ" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#bff0ff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<rect class="vli-jet" x="56" y="-40" width="8" height="80" rx="4" fill="url(#fnJ)"/>' +
      '<g class="vli-wat" fill="none" stroke="url(#fnW)" stroke-width="2.4" stroke-linecap="round">' +
        '<path d="M60 36C50 30 36 40 30 64"/><path d="M60 36C70 30 84 40 90 64"/><path d="M30 64C22 70 16 86 14 104"/><path d="M90 64C98 70 104 86 106 104"/></g>' +
      '<ellipse cx="60" cy="112" rx="56" ry="11" fill="#8a7e6c"/><path d="M4 106h112v6c0 6-25 11-56 11S4 118 4 112z" fill="url(#fnM)"/>' +
      '<ellipse cx="60" cy="106" rx="56" ry="10" fill="url(#fnM)" stroke="#d4a43a" stroke-width="1.4"/><ellipse cx="60" cy="106" rx="48" ry="7" fill="#7fd3f0" opacity=".7"/>' +
      '<ellipse class="vli-rip" cx="60" cy="106" rx="20" ry="3" fill="none" stroke="#e9fbff" stroke-width="1"/>' +
      '<path d="M54 104V70h12v34z" fill="url(#fnM)"/><path d="M52 72h16M52 100h16" stroke="#d4a43a" stroke-width="2"/>' +
      '<path d="M28 62h64c0 9-14 14-32 14S28 71 28 62z" fill="url(#fnM)"/><ellipse cx="60" cy="62" rx="32" ry="5.5" fill="url(#fnM)" stroke="#d4a43a" stroke-width="1.2"/><ellipse cx="60" cy="62" rx="26" ry="3.6" fill="#7fd3f0" opacity=".75"/>' +
      '<path d="M57 60V44h6v16z" fill="url(#fnM)"/><circle cx="60" cy="40" r="5" fill="#f4c542" stroke="#8a5a12" stroke-width=".6"/></svg>';
  }
  function playLaurel() {
    if (!sh || lrPlayed || calm()) return;
    var st = sh.querySelector('.vst-stage'), ms = sh.querySelector('.vst-ms'); if (!st || !ms || !ms.querySelector('.lr-worn')) return;
    lrStop(); lrPlayed = true;
    var notes = ''; ['♪', '♫', '♪', '♬', '♪', '♫'].forEach(function (n, k) { notes += '<i class="vli-nt" style="--d:' + (0.9 + k * 0.3).toFixed(2) + 's;--x:' + (40 + (k % 3) * 22) + 'px;--y:' + (-34 - (k % 2) * 26) + 'px">' + n + '</i>'; });
    var ov = document.createElement('div'); ov.className = 'vli'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<i class="vli-dim"></i><i class="vli-gr"></i>' + goddessSvg() + '<span class="vli-nts">' + notes + '</span>' + fountainSvg() +
      '<span class="vli-lr"><i class="vli-lrg"></i><svg viewBox="' + ART_OUT.laurel.vb + '">' + artFor('laurel') + '</svg></span><small class="vli-skip">แตะเพื่อข้าม</small>';
    ms.classList.remove('is-hop'); void ms.offsetWidth;
    st.appendChild(ov); sh.classList.add('lr-intro'); ms.classList.add('hide-laurel');
    var lr = ov.querySelector('.vli-lr'), fn = ov.querySelector('.vli-fn');
    var q = st.getBoundingClientRect(), f = fn.getBoundingClientRect();
    lr.style.left = (f.left - q.left + f.width / 2) + 'px'; lr.style.top = (f.top - q.top + f.height * 40 / 130) + 'px';
    void ov.offsetWidth; ov.classList.add('go');
    var fly = null, ended = false;
    lrEnd = function (quiet) {
      if (ended) return; ended = true; lrEnd = null; lrT.forEach(clearTimeout); lrT = [];
      lr.style.visibility = 'hidden'; if (fly) try { fly.cancel(); } catch (e) {}
      ms.classList.remove('hide-laurel'); sh.classList.remove('lr-intro');
      var sy = sh.querySelector('.vst-say'); if (sy && !quiet) { sy.classList.remove('sv-in'); void sy.offsetWidth; sy.classList.add('sv-in'); }
      if (quiet) { ov.remove(); return; }
      ov.classList.add('out'); setTimeout(function () { ov.remove(); }, 500);
      var b = ms.querySelector('.lr-worn'); if (b) { var r = b.getBoundingClientRect(), qq = st.getBoundingClientRect(), c = document.createElement('i'); c.className = 'vst-clasp vli-crown'; c.style.left = (r.left - qq.left + r.width / 2) + 'px'; c.style.top = (r.top - qq.top + r.height / 2) + 'px'; st.appendChild(c); setTimeout(function () { c.remove(); }, 900); }
      hop(ms);
    };
    ov.addEventListener('click', function (e) { e.stopPropagation(); if (lrEnd) lrEnd(); });
    lrT.push(setTimeout(function () {
      var tgt = ms.querySelector('.lr-worn'), sv = lr.querySelector('svg'); if (!tgt || !lr.animate) { lrEnd && lrEnd(); return; }
      lr.classList.add('fly');
      var a = sv.getBoundingClientRect(), b = tgt.getBoundingClientRect();
      var k = b.width / a.width, dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      fly = lr.animate([{ transform: 'translate(-50%,-50%) translate(0,-70px) scale(1)' }, { transform: 'translate(-50%,-50%) translate(' + (dx * .5) + 'px,' + (dy * .5 - 120) + 'px) scale(' + ((1 + k) / 2) + ') rotate(-8deg)', offset: .5 }, { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + (dy - 70) + 'px) scale(' + k + ')' }], { duration: 1000, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' });
      fly.onfinish = function () { lrEnd && lrEnd(); };
    }, 3300));
  }
  /* พิธีสวมมงกุฎ: สปอตไลต์ส่องลง · กลีบกุหลาบโปรย · มงกุฎค่อย ๆ ลอยลงจากฟ้าแล้วสวมบนหัวน้อง (แตะเพื่อข้าม) */
  var crPlayed = false, crT = [], crEnd = null;
  function crStop() { crT.forEach(clearTimeout); crT = []; if (crEnd) crEnd(true); }
  /* ราชา (ตัวละครแต่งเอง) เดินเข้ามายื่นมงกุฎ แล้วยกขึ้นสวมบนหัวน้อง จากนั้นโค้งคำนับแล้วเดินออก */
  function kingSvg() {
    var I = '#3a2a12', SK = '#f6d7b5';
    var sleeve = function (d) { return '<path d="' + d + '" stroke="' + I + '" stroke-width="9" stroke-linecap="round" fill="none"/><path d="' + d + '" stroke="#c41c38" stroke-width="6" stroke-linecap="round" fill="none"/>'; };
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + SK + '" stroke="' + I + '" stroke-width="2"/>'; };
    var cuff = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#fbf8f2" stroke="' + I + '" stroke-width="1.2"/>'; };
    var o = '<svg class="vci-ks" viewBox="0 0 110 160">';
    o += '<ellipse cx="55" cy="156" rx="30" ry="3.6" fill="#000" opacity=".3"/>';
    o += '<g class="vk-body">';
    // เสื้อคลุม
    o += '<path d="M33 66C26 92 20 120 16 150h78c-4-30-10-58-17-84z" fill="#b3122e" stroke="' + I + '" stroke-width="2" stroke-linejoin="round"/>';
    o += '<path d="M16 150h78" stroke="#fbf8f2" stroke-width="7" stroke-linecap="round"/><path d="M51 66h8v84h-8z" fill="#fbf8f2" stroke="' + I + '" stroke-width="1.2"/>';
    o += '<g fill="#2a2018"><path d="M54 80l1 3 1-3z"/><path d="M54 98l1 3 1-3z"/><path d="M54 116l1 3 1-3z"/><path d="M54 134l1 3 1-3z"/><path d="M26 149l1 3 1-3z"/><path d="M40 149l1 3 1-3z"/><path d="M70 149l1 3 1-3z"/><path d="M84 149l1 3 1-3z"/></g>';
    o += '<path d="M30 68q25 10 50 0l2 6q-27 10-54 0z" fill="#fbf8f2" stroke="' + I + '" stroke-width="1.4"/>';
    o += '<ellipse cx="44" cy="155" rx="7" ry="3.6" fill="' + I + '"/><ellipse cx="66" cy="155" rx="7" ry="3.6" fill="' + I + '"/>';
    // หัว
    o += '<circle cx="55" cy="46" r="15" fill="' + SK + '" stroke="' + I + '" stroke-width="2"/>';
    o += '<path d="M40 48c0 14 7 24 15 26 8-2 15-12 15-26-4 4-9 5-15 5s-11-1-15-5z" fill="#fbf8f2" stroke="' + I + '" stroke-width="1.6" stroke-linejoin="round"/>';
    o += '<path d="M47 52q4-3 8 0 4-3 8 0" stroke="' + I + '" stroke-width="1.4" fill="#fbf8f2"/>';
    o += '<path d="M47 43q3 2 6 0M57 43q3 2 6 0" stroke="' + I + '" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M45 39q4-2 8 0M57 39q4-2 8 0" stroke="#fbf8f2" stroke-width="2" fill="none" stroke-linecap="round"/>';
    o += '<ellipse cx="45" cy="48" rx="3" ry="1.8" fill="#f4a7a0" opacity=".8"/><ellipse cx="65" cy="48" rx="3" ry="1.8" fill="#f4a7a0" opacity=".8"/>';
    // มงกุฎของราชา
    o += '<path d="M44 33l-2-10 6 5 7-8 7 8 6-5-2 10z" fill="#f4c542" stroke="' + I + '" stroke-width="1.4" stroke-linejoin="round"/><rect x="43" y="31" width="24" height="4" rx="1.4" fill="#e0a92c" stroke="' + I + '" stroke-width="1.2"/><circle cx="55" cy="33" r="1.3" fill="#ff3456"/>';
    o += '</g>';
    // แขน 3 ท่า
    o += '<g class="vk-a vk-hold">' + sleeve('M34 76q-12 6-18 16') + sleeve('M76 76q-22 8-46 20') + cuff(16, 92) + cuff(30, 96) + hand(12, 93) + hand(26, 98) + '</g>';
    o += '<g class="vk-a vk-up">' + sleeve('M34 74q-14-6-22-20') + sleeve('M76 74q-24-10-46-28') + cuff(13, 55) + cuff(31, 47) + hand(10, 51) + hand(28, 44) + '</g>';
    o += '<g class="vk-a vk-bow">' + sleeve('M34 76q-8 12-8 26') + sleeve('M76 76q8 12 8 26') + cuff(26, 102) + cuff(84, 102) + hand(26, 107) + hand(84, 107) + '</g>';
    return o + '</svg>';
  }
  function playCrown() {
    if (!sh || crPlayed || calm()) return;
    var st = sh.querySelector('.vst-stage'), ms = sh.querySelector('.vst-ms'); if (!st || !ms || !ms.querySelector('.cr-worn')) return;
    crStop(); crPlayed = true;
    var pet = ''; for (var k = 0; k < 14; k++) pet += '<i style="left:' + (6 + Math.random() * 88).toFixed(1) + '%;--d:' + (1.6 + Math.random() * 1.4).toFixed(2) + 's;--t:' + (2.2 + Math.random() * 1.4).toFixed(2) + 's;--x:' + (Math.random() * 40 - 20).toFixed(0) + 'px"></i>';
    var ov = document.createElement('div'); ov.className = 'vci'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<i class="vci-dim"></i><i class="vci-spot"></i><span class="vci-pet">' + pet + '</span><span class="vci-k">' + kingSvg() + '</span><span class="vci-cr"><i class="vci-crg"></i><svg viewBox="' + ART_OUT.crown.vb + '">' + crownArt() + '</svg></span><small class="vli-skip">แตะเพื่อข้าม</small>';
    ms.classList.remove('is-hop'); void ms.offsetWidth;   /* วัดตำแหน่งหัวตอนยืนนิ่ง (ไม่ใช่กลางท่ากระโดด) */
    st.appendChild(ov); sh.classList.add('cr-intro'); ms.classList.add('hide-crown');
    var q = st.getBoundingClientRect(), tg = ms.querySelector('.cr-worn').getBoundingClientRect(), msv = (ms.querySelector('svg') || ms).getBoundingClientRect();
    var kEl = ov.querySelector('.vci-k'), cr = ov.querySelector('.vci-cr');
    var KW = 104, KH = KW * 160 / 110, feetY = msv.top - q.top + msv.height * 132 / 140, kx = Math.min(q.width - KW / 2 - 4, msv.right - q.left + KW * .28), ky = feetY - KH * 156 / 160;
    kEl.style.cssText = 'left:' + (kx - KW / 2) + 'px;top:' + ky + 'px;width:' + KW + 'px;height:' + KH + 'px';
    var tx = tg.left - q.left + tg.width / 2, ty = tg.top - q.top + tg.height / 2;
    cr.style.left = tx + 'px'; cr.style.top = ty + 'px';
    var sc = KW / 110, hx = kx - KW / 2 + 19 * sc - tx, hy = ky + 90 * sc - ty, ux = kx - KW / 2 + 6 * sc - tx, uy = ky + 36 * sc - ty, IN = 220;
    void ov.offsetWidth; ov.classList.add('go');
    var anims = [], ended = false;
    crEnd = function (quiet) {
      if (ended) return; ended = true; crEnd = null; crT.forEach(clearTimeout); crT = [];
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      ms.classList.remove('hide-crown'); sh.classList.remove('cr-intro');
      if (quiet) { ov.remove(); return; }
      ov.classList.add('out'); setTimeout(function () { ov.remove(); }, 500);
    };
    ov.addEventListener('click', function (e) { e.stopPropagation(); if (crEnd) crEnd(); });
    if (!cr.animate) { crEnd(); return; }
    var sv = cr.querySelector('svg'), k0 = tg.width / Math.max(1, sv.getBoundingClientRect().width);
    var T = 3400;
    anims.push(kEl.animate([{ transform: 'translateX(' + IN + 'px)', opacity: 1, easing: 'ease-out' }, { transform: 'translateX(0)', opacity: 1, offset: 1470 / 4600 }, { transform: 'translateX(0)', opacity: 1, offset: .86, easing: 'ease-in' }, { transform: 'translateX(' + IN + 'px)', opacity: 0 }], { duration: 4600, fill: 'forwards' }));
    var p = function (x, y, s, r) { return 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s + ') rotate(' + (r || 0) + 'deg)'; };
    var ca = cr.animate([
      { transform: p(hx + IN, hy, (k0 * .6).toFixed(3)), opacity: 1, easing: 'ease-out' },
      { transform: p(hx, hy, (k0 * .6).toFixed(3)), opacity: 1, offset: 1470 / T },
      { transform: p(hx, hy, (k0 * .6).toFixed(3)), opacity: 1, offset: 1700 / T, easing: 'ease-in-out' },
      { transform: p(ux, uy, (k0 * .75).toFixed(3), -6), opacity: 1, offset: 2150 / T, easing: 'ease-in-out' },
      { transform: p(ux * .4, -46, (k0 * .9).toFixed(3), -3), opacity: 1, offset: 2700 / T, easing: 'ease-in-out' },
      { transform: p(0, -16, (k0 * .98).toFixed(3), 0), opacity: 1, offset: 3050 / T, easing: 'ease-in' },
      { transform: p(0, 0, k0.toFixed(3), 0), opacity: 1 }], { duration: T, fill: 'forwards' });
    anims.push(ca);
    var hold = kEl.querySelector('.vk-hold'), upA = kEl.querySelector('.vk-up');
    anims.push(hold.animate([{ opacity: 1 }, { opacity: 1, offset: 1640 / T }, { opacity: 0, offset: 1650 / T }, { opacity: 0 }], { duration: T, fill: 'forwards' }));
    anims.push(upA.animate([{ opacity: 0 }, { opacity: 0, offset: 1640 / T }, { opacity: 1, offset: 1650 / T }, { opacity: 1 }], { duration: T, fill: 'forwards' }));
    ca.onfinish = function () {
      if (ended) return;
      ms.classList.remove('hide-crown'); cr.style.opacity = '0';
      var b = ms.querySelector('.cr-worn'); if (b) { var r = b.getBoundingClientRect(), qq = st.getBoundingClientRect(), c = document.createElement('i'); c.className = 'vst-clasp vli-crown'; c.style.left = (r.left - qq.left + r.width / 2) + 'px'; c.style.top = (r.top - qq.top + r.height / 2) + 'px'; st.appendChild(c); setTimeout(function () { c.remove(); }, 900); }
      hop(ms); anims.slice(-2).forEach(function (a) { try { a.cancel(); } catch (e) {} }); kEl.classList.add('bow');
      crT.push(setTimeout(function () { crEnd && crEnd(); }, 1250));
    };
  }
  /* ===== ฉากเปิดตัวหมวกนักเวท (ระดับพิเศษ): วงเวทใต้เท้า → หมวกลอยขึ้นจากวง → ลอยลงสวมหัว → น้องร่ายคาถาเป็นดาว → การ์ดแนะนำ (แตะเพื่อข้าม) ===== */
  var wzPlayed = false, wzT = [], wzEnd = null;
  function wzStop() { wzT.forEach(clearTimeout); wzT = []; if (wzEnd) wzEnd(true); }
  function playWizard(force) {
    if (!sh || (wzPlayed && !force)) return;
    var st = sh.querySelector('.vst-stage'), ms = sh.querySelector('.vst-ms'), worn = ms && ms.querySelector('.wz-worn'); if (!st || !worn) return;
    wzStop(); wzPlayed = true;
    var o = itemById('wizard') || { name: 'หมวกนักเวท', price: 400 }, has = ownedOutfits().indexOf('wizard') >= 0;
    var isOn = function () { try { return JSON.parse(localStorage.getItem('vc_outfit') || '[]').indexOf('wizard') >= 0; } catch (e) { return false; } };
    var RUNE = '';
    for (var k = 0; k < 12; k++) { var a = k * 30; RUNE += '<g transform="rotate(' + a + ' 60 60) translate(60 13)">' + (k % 3 === 0 ? '<path d="M0-4 1.2-1.2 4 0 1.2 1.2 0 4-1.2 1.2-4 0-1.2-1.2z"/>' : k % 3 === 1 ? '<path d="M1.6-3.2a3.4 3.4 0 1 0 0 6.4 2.6 2.6 0 1 1 0-6.4z"/>' : '<circle r="1.4"/>') + '</g>'; }
    var ring = '<svg class="vwz-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" class="r1"/><circle cx="60" cy="60" r="44" class="r2"/><g class="rn">' + RUNE + '</g>' +
      '<path class="r3" d="M60 22 93 79H27z"/><path class="r3" d="M60 98 27 41h66z"/></svg>';
    var card = '<div class="vwz-card" role="dialog" aria-label="ไอเทมใหม่ หมวกนักเวท"><i class="vwz-rb">✦ พิเศษ</i><svg viewBox="' + ART_OUT.wizard.vb + '" aria-hidden="true">' + ART_OUT.wizard.art + '</svg>' +
      '<b>' + h(o.name) + '</b><span class="vwz-q">“อ่านสัญญาแบบมีเวทมนตร์!”</span>' +
      '<button type="button" class="vwz-go">' + (has ? (isOn() ? 'ใส่อยู่ ✓' : 'ใส่เลย') : 'ลองดูต่อ') + '</button>' + (has ? '' : '<small class="vwz-pr">ราคา ' + fmt(o.price) + ' แต้ม</small>') + '</div>';
    var ov = document.createElement('div'); ov.className = 'vwz'; ov.setAttribute('aria-live', 'polite');
    ov.innerHTML = '<i class="vwz-dim"></i>' + ring + '<i class="vwz-beam"></i><span class="vwz-hat"><svg viewBox="' + ART_OUT.wizard.vb + '">' + ART_OUT.wizard.art + '</svg></span>' +
      '<svg class="vwz-star" viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d="M50 6 61 38 95 38 67 58 78 92 50 71 22 92 33 58 5 38 39 38Z"/></svg><i class="vwz-burst b1"></i><i class="vwz-burst b2"></i>' + '<small class="vli-skip">แตะเพื่อข้าม</small>';
    ms.classList.remove('is-hop'); void ms.offsetWidth;
    st.appendChild(ov); sh.classList.add('wz-intro');
    var q = st.getBoundingClientRect(), msv = (ms.querySelector('svg') || ms).getBoundingClientRect(), tg = worn.getBoundingClientRect();
    var cx = msv.left - q.left + msv.width / 2, feetY = msv.top - q.top + msv.height * 132 / 140;
    var RW = Math.min(q.width * .62, msv.width * 1.25);
    var rg = ov.querySelector('.vwz-ring'); rg.style.cssText = 'left:' + (cx - RW / 2) + 'px;top:' + (feetY - RW / 2) + 'px;width:' + RW + 'px;height:' + RW + 'px';
    var bm = ov.querySelector('.vwz-beam'); bm.style.cssText = 'left:' + (cx - RW * .2) + 'px;width:' + (RW * .4) + 'px;top:' + (tg.top - q.top - 40) + 'px;height:' + (feetY - (tg.top - q.top) + 40) + 'px';
    var tx = tg.left - q.left + tg.width / 2, ty = tg.top - q.top + tg.height / 2;
    var hat = ov.querySelector('.vwz-hat'); hat.style.left = tx + 'px'; hat.style.top = ty + 'px';
    var SW = Math.max(54, msv.width * .3), sx = msv.left - q.left + msv.width * .02, sy = msv.top - q.top + msv.height * .38;
    var stv = ov.querySelector('.vwz-star'); stv.style.cssText = 'left:' + (sx - SW / 2) + 'px;top:' + (sy - SW / 2) + 'px;width:' + SW + 'px;height:' + SW + 'px';
    [['b1', tx, ty], ['b2', sx, sy]].forEach(function (b) { var e = ov.querySelector('.vwz-burst.' + b[0]); e.style.left = b[1] + 'px'; e.style.top = b[2] + 'px'; });
    var anims = [], ended = false;
    wzEnd = function (quiet) {
      if (ended) return; ended = true; wzEnd = null; wzT.forEach(clearTimeout); wzT = [];
      anims.forEach(function (x) { try { x.cancel(); } catch (e) {} });
      ms.classList.remove('hide-wizard'); sh.classList.remove('wz-intro');
      if (quiet) { ov.remove(); return; }
      ov.classList.add('out'); setTimeout(function () { ov.remove(); }, 450);
    };
    var showCard = function () { wzEnd && wzEnd(); };
    ov.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('.vwz-go')) { if (has && !isOn()) { wear('wizard'); wzEnd && wzEnd(); shopRender(); } else if (wzEnd) wzEnd(); return; }
      if (e.target.closest('.vwz-card')) return;
      if (ov.classList.contains('is-card')) { wzEnd && wzEnd(); return; }
      wzT.forEach(clearTimeout); wzT = []; anims.forEach(function (x) { try { x.cancel(); } catch (er) {} }); ms.classList.remove('hide-wizard'); ov.classList.add('skip'); showCard();
    });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); wzEnd && wzEnd(); } });
    if (calm() || !hat.animate) { ov.classList.add('skip'); showCard(); return; }
    ms.classList.add('hide-wizard'); void ov.offsetWidth; ov.classList.add('go');
    var sv = hat.querySelector('svg'), k0 = tg.width / Math.max(1, sv.getBoundingClientRect().width), up = Math.max(54, tg.height * 1.6);
    var P = function (x, y, s, r) { return 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s + ') rotate(' + (r || 0) + 'deg)'; };
    var dy0 = feetY - ty, T = 2300;
    var ha = hat.animate([
      { transform: P(0, dy0, .25, 0), opacity: 0 },
      { transform: P(0, dy0 - 10, .5, -8), opacity: 1, offset: .12, easing: 'ease-out' },
      { transform: P(0, -up, 1.25, 8), opacity: 1, offset: .5, easing: 'ease-in-out' },
      { transform: P(0, -up - 6, 1.3, -6), opacity: 1, offset: .66, easing: 'ease-in' },
      { transform: P(0, -6, k0 * 1.05, 0), opacity: 1, offset: .92 },
      { transform: P(0, 0, k0, 0), opacity: 1 }], { duration: T, delay: 550, fill: 'both' });
    anims.push(ha);
    ha.onfinish = function () {
      if (ended) return; ms.classList.remove('hide-wizard'); try { ha.cancel(); } catch (e) {} hat.style.display = 'none'; ov.classList.add('worn'); hop(ms);
      wzT.push(setTimeout(function () { ov.classList.add('cast'); }, 350));
      wzT.push(setTimeout(function () { ov.classList.add('pop'); }, 1250));
      wzT.push(setTimeout(function () { wzEnd && wzEnd(); }, 1750));
    };
  }
  /* ===== ฉากเปิดตัวหมวกนอนดาว: น้องนอนหลับบนเตียง (Zzz) → สะดุ้งตื่น "!" → กระโดดลงจากเตียง → หมวกลอยพลิ้วลงมาสวมหัว → การ์ดแนะนำ ===== */
  var cpPlayed = false, cpT = [], cpEnd = null;
  function cpStop() { cpT.forEach(clearTimeout); cpT = []; if (cpEnd) cpEnd(true); }
  function playCap(force) {
    if (!sh || (cpPlayed && !force)) return;
    var st = sh.querySelector('.vst-stage'), ms = sh.querySelector('.vst-ms'), worn = ms && ms.querySelector('.cp-worn'); if (!st || !worn) return;
    cpStop(); cpPlayed = true;
    var o = itemById('cap') || { name: 'หมวกนอนดาว', price: 300 }, has = ownedOutfits().indexOf('cap') >= 0;
    var isOn = function () { try { return JSON.parse(localStorage.getItem('vc_outfit') || '[]').indexOf('cap') >= 0; } catch (e) { return false; } };
    var sleeper = (window.VCMascot ? window.VCMascot.svg('sleep', 120) : '').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    var STAR = function (x, y, r, f) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + r + ')" d="M0-5 1.5-1.6 5.2-1.3 2.4 1 3.2 4.6 0 2.7-3.2 4.6-2.4 1-5.2-1.3-1.5-1.6z" fill="' + (f || '#ffe28a') + '"/>'; };
    var bed = '<svg class="vnz-bed" viewBox="0 0 200 124" aria-hidden="true"><defs>' +
      '<linearGradient id="vnzWd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a066"/><stop offset="1" stop-color="#9a6334"/></linearGradient>' +
      '<linearGradient id="vnzWd2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2ad74"/><stop offset=".6" stop-color="#c08048"/><stop offset="1" stop-color="#94602f"/></linearGradient>' +
      '<linearGradient id="vnzMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#e9dcc2"/></linearGradient>' +
      '<linearGradient id="vnzBl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8eff"/><stop offset=".55" stop-color="#5262e2"/><stop offset="1" stop-color="#3540b0"/></linearGradient>' +
      '<linearGradient id="vnzBs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4553cc"/><stop offset="1" stop-color="#29328f"/></linearGradient>' +
      '<radialGradient id="vnzPl" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f3eee6"/><stop offset="1" stop-color="#d8cfc0"/></radialGradient>' +
      '<pattern id="vnzQ" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H12M0 0V12" stroke="#fff" stroke-width=".7" opacity=".18"/></pattern></defs>' +
      '<ellipse cx="104" cy="120" rx="94" ry="3.6" fill="#140c38" opacity=".35"/>' +
      /* ขาหลัง */
      '<rect x="44" y="104" width="7" height="10" rx="1.5" fill="#7a4a22"/><rect x="172" y="104" width="7" height="10" rx="1.5" fill="#7a4a22"/>' +
      /* หัวเตียงไม้ ทรงโค้ง + แผงกลาง + ดาวฉลุ */
      '<path d="M12 116V50Q12 34 28 34Q44 34 44 50V116Z" fill="url(#vnzWd2)" stroke="#3a2412" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M18 104V52Q18 41 28 41Q38 41 38 52V104Z" fill="#b97a43" stroke="#7a4a22" stroke-width="1.4"/>' + STAR(28, 56, 1.3, '#ffe9a8') +
      '<path d="M16 50Q18 40 26 38" stroke="#f3cf9a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="28" cy="34" r="3.6" fill="#e2ad74" stroke="#3a2412" stroke-width="1.8"/>' +
      /* โครงเตียง */
      '<rect x="36" y="96" width="158" height="12" rx="4" fill="url(#vnzWd)" stroke="#3a2412" stroke-width="2.4"/><path d="M42 99.5H188" stroke="#f0c48e" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>' +
      /* ขาหน้าทรงหนา */
      '<path d="M40 106h12v10q0 3-3 3h-6q-3 0-3-3z" fill="url(#vnzWd)" stroke="#3a2412" stroke-width="2.2" stroke-linejoin="round"/><path d="M178 106h12v10q0 3-3 3h-6q-3 0-3-3z" fill="url(#vnzWd)" stroke="#3a2412" stroke-width="2.2" stroke-linejoin="round"/>' +
      /* ฟูก: ด้านบน (มีมิติ) + ด้านหน้า + ตะเข็บ */
      '<path d="M44 80H190Q195 80 194 85L193 88H40L41 85Q41 80 44 80Z" fill="#fffdf8" stroke="#3a2412" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="40" y="86" width="153" height="12" rx="3" fill="url(#vnzMt)" stroke="#3a2412" stroke-width="2.2"/><path d="M46 92H188" stroke="#c9b894" stroke-width="1" stroke-dasharray="3 3"/>' +
      /* หมอนนุ่ม */
      '<path d="M44 74Q42 62 56 62H72Q82 62 81 72Q83 84 70 84H54Q42 85 44 74Z" fill="url(#vnzPl)" stroke="#3a2412" stroke-width="2.2"/>' +
      '<path d="M50 67Q60 64 72 66" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M56 78Q64 80 74 78" stroke="#cfc4b2" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<g class="vnz-who"><g transform="translate(36 102) rotate(-90) scale(.5)">' + sleeper + '</g></g>' +
      /* ผ้าห่ม: ผืนบนนูนตามตัว + ชายห้อยลงด้านหน้าเป็นคลื่น + ขอบพับครีม */
      '<g class="vnz-bl">' +
      '<path d="M90 70Q92 62 104 62Q132 58 170 62Q192 64 194 78L194 100Q186 104 178 100Q170 104 162 100Q154 104 146 100Q138 104 130 100Q122 104 114 100Q106 104 98 100Q94 103 90 100Z" fill="url(#vnzBl)" stroke="#2a1e5c" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M90 70Q92 62 104 62Q132 58 170 62Q192 64 194 78L194 100Q186 104 178 100Q170 104 162 100Q154 104 146 100Q138 104 130 100Q122 104 114 100Q106 104 98 100Q94 103 90 100Z" fill="url(#vnzQ)"/>' +
      '<path d="M92 86Q142 82 193 86" stroke="#2a3290" stroke-width="1.6" fill="none" opacity=".55"/><path d="M98 66Q140 62 178 66" stroke="#b4bdff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M87 66Q89 58 99 59Q107 60 107 70L105 100Q99 103 93 100Q87 88 87 66Z" fill="#fbf3e0" stroke="#2a1e5c" stroke-width="2.2" stroke-linejoin="round"/><path d="M93 66V96M99 64V98" stroke="#e2d2ae" stroke-width="1.1" stroke-dasharray="2.5 2.5"/>' +
      STAR(118, 76, 1.1) + STAR(150, 72, .8, '#fff3c4') + STAR(176, 78, 1, '#ffe28a') + STAR(134, 94, .7, '#fff3c4') + STAR(166, 93, .9) +
      '<path d="M108 88a4 4 0 1 0 3 6.4 3.2 3.2 0 1 1-3-6.4z" fill="#ffe28a"/></g>' +
      '<g class="vnz-zz"><text x="68" y="44">z</text><text x="78" y="32">z</text><text x="90" y="18">Z</text></g><text class="vnz-ex" x="56" y="44">!</text></svg>';
    var card = '<div class="vwz-card" role="dialog" aria-label="ไอเทมใหม่ หมวกนอนดาว"><i class="vwz-rb">✦ พิเศษ</i><svg viewBox="' + ART_OUT.cap.vb + '" aria-hidden="true">' + ART_OUT.cap.art + '</svg>' +
      '<b>' + h(o.name) + '</b><span class="vwz-q">“หลับฝันดี ตื่นมาอ่านสัญญาสดชื่น!”</span>' +
      '<button type="button" class="vwz-go">' + (has ? (isOn() ? 'ใส่อยู่ ✓' : 'ใส่เลย') : 'ลองดูต่อ') + '</button>' + (has ? '' : '<small class="vwz-pr">ราคา ' + fmt(o.price) + ' แต้ม</small>') + '</div>';
    var ov = document.createElement('div'); ov.className = 'vwz vnz'; ov.setAttribute('aria-live', 'polite');
    ov.innerHTML = '<i class="vwz-dim"></i>' + bed + '<span class="vwz-hat vnz-hat"><svg viewBox="' + ART_OUT.cap.vb + '">' + ART_OUT.cap.art + '</svg></span><i class="vwz-burst b1"></i>' + '<small class="vli-skip">แตะเพื่อข้าม</small>';
    ms.classList.remove('is-hop'); void ms.offsetWidth;
    st.appendChild(ov); sh.classList.add('wz-intro');
    var q = st.getBoundingClientRect(), msv = (ms.querySelector('svg') || ms).getBoundingClientRect(), tg = worn.getBoundingClientRect();
    var cx = msv.left - q.left + msv.width / 2, feetY = msv.top - q.top + msv.height * 132 / 140;
    var BW = Math.min(q.width * .86, msv.width * 1.75), BH = BW * .62;
    ov.querySelector('.vnz-bed').style.cssText = 'left:' + (cx - BW / 2) + 'px;top:' + (feetY - BH * .93) + 'px;width:' + BW + 'px;height:' + BH + 'px';
    var tx = tg.left - q.left + tg.width / 2, ty = tg.top - q.top + tg.height / 2;
    var hat = ov.querySelector('.vwz-hat'); hat.style.cssText = 'left:' + tx + 'px;top:' + ty + 'px;width:' + tg.width + 'px;height:' + tg.height + 'px';
    try { var bb = worn.getBBox(), hs = hat.querySelector('svg'); hs.setAttribute('viewBox', bb.x + ' ' + bb.y + ' ' + bb.width + ' ' + bb.height); hs.setAttribute('preserveAspectRatio', 'none'); } catch (e) {}
    var bu = ov.querySelector('.vwz-burst'); bu.style.left = tx + 'px'; bu.style.top = ty + 'px';
    var anims = [], ended = false;
    cpEnd = function (quiet) {
      if (ended) return; ended = true; cpEnd = null; cpT.forEach(clearTimeout); cpT = [];
      anims.forEach(function (x) { try { x.cancel(); } catch (e) {} });
      ms.classList.remove('cp-hide', 'cp-nohat'); sh.classList.remove('wz-intro');
      if (quiet) { ov.remove(); return; }
      ov.classList.add('out'); setTimeout(function () { ov.remove(); }, 450);
    };
    var showCard = function () { cpEnd && cpEnd(); };
    var skipTo = function () { cpT.forEach(clearTimeout); cpT = []; anims.forEach(function (x) { try { x.cancel(); } catch (er) {} }); ms.classList.remove('cp-hide', 'cp-nohat'); ov.classList.add('skip'); showCard(); };
    ov.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('.vwz-go')) { if (has && !isOn()) { wear('cap'); cpEnd && cpEnd(); shopRender(); } else if (cpEnd) cpEnd(); return; }
      if (e.target.closest('.vwz-card')) return;
      if (ov.classList.contains('is-card')) { cpEnd && cpEnd(); return; }
      skipTo();
    });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); cpEnd && cpEnd(); } });
    if (calm() || !hat.animate) { ov.classList.add('skip'); showCard(); return; }
    ms.classList.add('cp-hide', 'cp-nohat'); void ov.offsetWidth; ov.classList.add('go');
    cpT.push(setTimeout(function () { ov.classList.add('wake'); }, 2300));
    cpT.push(setTimeout(function () {                 // กระโดดลงจากเตียง
      if (ended) return; ov.classList.add('up'); ms.classList.remove('cp-hide'); hop(ms);
    }, 3100));
    cpT.push(setTimeout(function () {                 // หมวกลอยพลิ้วลงมา
      if (ended) return;
      var sv = hat.querySelector('svg'), k0 = 1, top = -(ty + tg.height);
      var P = function (x, y, s, r) { return 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s + ') rotate(' + r + 'deg)'; };
      var ha = hat.animate([
        { transform: P(-30, top, k0, -18), opacity: 0 },
        { transform: P(26, top * .62, k0, 14), opacity: 1, offset: .25, easing: 'ease-in-out' },
        { transform: P(-22, top * .32, k0, -12), opacity: 1, offset: .5, easing: 'ease-in-out' },
        { transform: P(14, top * .1, k0, 8), opacity: 1, offset: .75, easing: 'ease-in-out' },
        { transform: P(0, -4, k0 * 1.04, -2), opacity: 1, offset: .92 },
        { transform: P(0, 0, k0, 0), opacity: 1 }], { duration: 1700, fill: 'both' });
      anims.push(ha);
      ha.onfinish = function () {
        if (ended) return; ms.classList.remove('cp-nohat'); try { ha.cancel(); } catch (e) {} hat.style.display = 'none'; ov.classList.add('worn'); hop(ms);
        cpT.push(setTimeout(showCard, 900));
      };
    }, 3500));
  }
  /* การ์ดลิมิเต็ด: กว้าง 2 ช่อง กรอบโฮโลแกรม · ยังไม่ได้ = เห็นเหรียญจางพร้อมแม่กุญแจ ยิ่งใกล้ครบยิ่งสว่าง */
  function tierTag(t) {   // ระดับเป็นดาว 3 ดวง: ทอง ★☆☆ · ทองคำขาว ★★☆ · เพชร ★★★
    var st = ''; for (var k = 1; k <= 3; k++) st += '<svg class="' + (k <= t ? 'on' : '') + '" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/></svg>';
    return '<em class="lim-stars t' + t + '" role="img" aria-label="ระดับ' + MED[t].name + ' ' + t + ' จาก 3 ดาว">' + st + '</em>';
  }
  function limitedCard(it, has, on, bd) {
    var a = ART_OUT[it.id], p = bd ? Math.min(1, bd.have / bd.n) : 1, left = bd ? bd.n - bd.have : 0;
    var lit = has ? 1 : (.28 + .72 * p);
    var tag = has ? '<span class="vof-act' + (on ? ' is-on' : '') + '">' + (on ? 'ใส่อยู่ ✓' : 'มีแล้ว · แตะเพื่อใส่') + '</span>'
      : '<span class="vof-act is-soon" aria-label="อีก ' + left + ' วัน"><svg class="soon-fl" viewBox="0 0 24 30" aria-hidden="true"><defs><linearGradient id="soonG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4d1f"/><stop offset=".55" stop-color="#ff9a2b"/><stop offset="1" stop-color="#ffe08a"/></linearGradient></defs>' +
        '<path d="M12 29C5.4 29 1.5 24.6 1.5 19 1.5 12 7.4 9.2 8.2 1.5c4.6 3.6 6.6 8 6.6 11.6 1.9-1.3 3-3.6 3.2-5.9 4 3.6 5.8 8.2 5.8 12.4 0 5.6-5.1 9.4-11.8 9.4z" fill="url(#soonG)"/><path d="M12 27c-3 0-5-2-5-4.8 0-3.4 3-4.6 3.6-8.4 2.2 1.6 5.4 4.2 5.4 7.6 0 3.2-1.8 5.6-4 5.6z" fill="#fff1c2" opacity=".85"/></svg>' +
        '<span class="soon-t"><small>อีก</small><b>' + left + '</b><small>วัน</small></span></span>';
    return '<button type="button" class="vof-b vof-lim r-limited mt-' + medalTier() + (has ? ' is-own' : ' is-lock') + (on ? ' is-on' : '') + (sel === it.id ? ' is-try' : '') + '" data-outfit="' + it.id + '" aria-pressed="' + (sel === it.id) + '" aria-label="' + h(it.name + ' · ลิมิเต็ด · ' + (has ? 'มีแล้ว' : 'อีก ' + left + ' วัน')) + '" style="--lit:' + lit.toFixed(2) + ';--bp:' + Math.round(p * 100) + '%">' +
      '<i class="lim-sheen" aria-hidden="true"></i><i class="lim-crn" aria-hidden="true">' + ['tl', 'tr', 'bl', 'br'].map(function (c) { return '<span class="' + c + '"><svg viewBox=\"0 0 24 24\"><path d=\"M2 22V8Q2 2 8 2H22\"/><path d=\"M6 18V10Q6 6 10 6H18\" class=\"t\"/><path d=\"M2 -1.5 5.5 2 2 5.5 -1.5 2z\" class=\"d\"/></svg></span>'; }).join('') + '</i><em class="vof-r"><i class="vst-dia"></i>LIMITED</em>' +
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="lqG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#c9962f"/></linearGradient><linearGradient id="stG1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#f4c542"/><stop offset="1" stop-color="#c8861a"/></linearGradient><linearGradient id="stG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9fc4e6"/></linearGradient><linearGradient id="stG3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf6ff"/><stop offset="1" stop-color="#a47dff"/></linearGradient></defs></svg>' +
      '<span class="lim-art"><svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(it.id) + '</svg>' + (has ? '' : '<svg class="lim-pl" viewBox="0 0 24 30" aria-hidden="true"><defs><linearGradient id="plB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".45" stop-color="#e0a92c"/><stop offset="1" stop-color="#8a5a12"/></linearGradient><linearGradient id="plS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a12"/><stop offset=".5" stop-color="#f6d98a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient></defs>' +
        '<path d="M6.5 13V9a5.5 5.5 0 0 1 11 0v4" fill="none" stroke="url(#plS)" stroke-width="3" stroke-linecap="round"/><path d="M6.5 13V9a5.5 5.5 0 0 1 11 0v4" fill="none" stroke="#5a3a0a" stroke-width=".8" opacity=".6"/>' +
        '<rect x="3" y="12" width="18" height="15" rx="3.2" fill="url(#plB)" stroke="#5a3a0a" stroke-width="1.1"/><path d="M5 14.5h14" stroke="#fff6d6" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>' +
        '<circle cx="12" cy="18.6" r="2" fill="#3a2406"/><path d="M11.1 19.6h1.8l.5 3.6h-2.8z" fill="#3a2406"/><path class="pl-gl" d="M6 25l3-11" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="0"/></svg>') + '</span>' +
      '<span class="lim-tx"><span class="lim-nm"><b>' + h(it.name) + '</b>' + tierTag(medalTier()) + '</span>' +
      '<i class="lim-div" aria-hidden="true"></i><small class="lim-tag"><svg class="lq lq-o" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 20v-7C2 6 5.4 1.6 10.4 0l1 2.4C8.4 4 6.8 6.6 6.6 9.6H11V20zm13 0v-7c0-7 3.4-11.4 8.4-13l1 2.4c-3 1.6-4.6 4.2-4.8 7.2H24V20z"/></svg>ไฟที่ไม่ยอมมอด แม้ในคืนที่ยาวที่สุด<svg class="lq lq-c" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 20v-7C2 6 5.4 1.6 10.4 0l1 2.4C8.4 4 6.8 6.6 6.6 9.6H11V20zm13 0v-7c0-7 3.4-11.4 8.4-13l1 2.4c-3 1.6-4.6 4.2-4.8 7.2H24V20z"/></svg></small>' +
      (has ? '' : '<span class="lim-pg"><span class="lim-lt" aria-hidden="true">' + (function () { var o = ''; for (var q = 0; q < bd.n; q++) o += '<i class="' + (q < bd.have ? 'on' : q === bd.have ? 'nx' : '') + '" style="--q:' + q + '"></i>'; return o; })() + '</span><b>' + bd.have + '/' + bd.n + '</b></span><small class="lim-n">ได้เมื่อเช็กอินติดกัน ' + bd.n + ' วัน</small>') + '</span><span class="lim-row">' + tag + loreBtn() + '</span></button>';
  }
  /* การ์ดมาลัย (ยังไม่ได้): มาลัยเส้นทองเรืองแสง · วงรัศมีความคืบหน้ารอบมาลัย · ตัวเลขสลักกรีก */
  var LRC_TAG = '<em class="vof-r lrc-tag"><span class="lrt-in"><svg class="lrt-sp l" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 11Q12 8 25 3" stroke="#d9a536" stroke-width="1" fill="none"/><g fill="#e8b94a"><ellipse cx="7" cy="7.4" rx="3.4" ry="1.5" transform="rotate(-40 7 7.4)"/><ellipse cx="9" cy="12" rx="3.4" ry="1.5" transform="rotate(20 9 12)"/><ellipse cx="14" cy="5" rx="3.4" ry="1.5" transform="rotate(-50 14 5)"/><ellipse cx="16.4" cy="9.6" rx="3.4" ry="1.5" transform="rotate(10 16.4 9.6)"/><ellipse cx="22" cy="2.6" rx="3" ry="1.4" transform="rotate(-30 22 2.6)"/></g></svg><span class="lrt-tx">LEGENDARY</span><svg class="lrt-sp r" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 11Q12 8 25 3" stroke="#d9a536" stroke-width="1" fill="none"/><g fill="#e8b94a"><ellipse cx="7" cy="7.4" rx="3.4" ry="1.5" transform="rotate(-40 7 7.4)"/><ellipse cx="9" cy="12" rx="3.4" ry="1.5" transform="rotate(20 9 12)"/><ellipse cx="14" cy="5" rx="3.4" ry="1.5" transform="rotate(-50 14 5)"/><ellipse cx="16.4" cy="9.6" rx="3.4" ry="1.5" transform="rotate(10 16.4 9.6)"/><ellipse cx="22" cy="2.6" rx="3" ry="1.4" transform="rotate(-30 22 2.6)"/></g></svg></span></em>';
  var LRC_TW = [[16, 30, 0], [80, 22, 1.7], [34, 62, 3.1], [66, 66, 4.4]].map(function (q) { return '<i class="lrc-tw" style="left:' + q[0] + '%;top:' + q[1] + '%;animation-delay:' + q[2] + 's"></i>'; }).join('');
  var CRC_TAG = '<em class="vof-r crc-tag"><span class="lrt-in"><svg class="crt-ic" viewBox="-24 -22 48 36" aria-hidden="true"><path d="M-20 6L-23-12-15 0-11.5-7-6 0 0-19 6 0 11.5-7 15 0 23-12 20.5 6z" fill="#f4c542"/><rect x="-21" y="4" width="42" height="8" rx="2" fill="#e0a92c"/></svg><span class="crt-tx">ROYAL</span><svg class="crt-ic" viewBox="-24 -22 48 36" aria-hidden="true"><path d="M-20 6L-23-12-15 0-11.5-7-6 0 0-19 6 0 11.5-7 15 0 23-12 20.5 6z" fill="#f4c542"/><rect x="-21" y="4" width="42" height="8" rx="2" fill="#e0a92c"/></svg></span></em>';
  var LRC_DUST = (function () { var o = '<span class="lrc-dust" aria-hidden="true">'; for (var i = 0; i < 9; i++) o += '<i style="left:' + (8 + i * 10.5).toFixed(1) + '%;--d:-' + (i * 0.73 % 4).toFixed(2) + 's;--t:' + (3.2 + (i % 3) * .8).toFixed(1) + 's"></i>'; return o + '</span>'; })();
  function lrCard(bd, a) {
    var p = Math.max(0, Math.min(1, bd.have / bd.n)), ang = -Math.PI / 2 + p * 2 * Math.PI, dx = 50 + 46 * Math.cos(ang), dy = 26 + 23 * Math.sin(ang);
    return '<span class="lr-card"><span class="lrc-ring"><svg class="lrc-pr" viewBox="0 0 100 52" aria-hidden="true"><ellipse cx="50" cy="26" rx="46" ry="23" class="bg"/><path class="fg" pathLength="100" stroke-dasharray="' + (p * 100).toFixed(1) + ' 100" d="M50 3A46 23 0 1 1 49.99 3"/><circle class="dot" cx="' + dx.toFixed(1) + '" cy="' + dy.toFixed(1) + '" r="2.4"/></svg>' +
      '<i class="lrc-gl"></i><svg class="lrc-art" viewBox="' + a.vb + '" aria-hidden="true"><defs><linearGradient id="lrcSh" gradientUnits="userSpaceOnUse" x1="-40" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#f4c542"/><stop offset=".4" stop-color="#f4c542"/><stop offset=".5" stop-color="#fffbe8"/><stop offset=".6" stop-color="#f4c542"/><stop offset="1" stop-color="#f4c542"/><animate attributeName="x1" values="-40;-40;100;100" keyTimes="0;.6;.85;1" dur="6.5s" repeatCount="indefinite"/><animate attributeName="x2" values="0;0;140;140" keyTimes="0;.6;.85;1" dur="6.5s" repeatCount="indefinite"/></linearGradient></defs>' + artFor('laurel') + '</svg>' + LRC_TW + '</span><em class="lr-left">อีก <b>' + (bd.n - bd.have) + '</b> วัน</em></span>';
  }
  /* คำพูดน้องตอนเลือกมาลัย (สุ่มสลับทุกครั้งที่แตะ) */
  var lrSayN = Math.floor(Math.random() * 6);
  function lrSay(has, lft) {   // "ประโยค|บรรทัดตัวเลข" — ฉากสวรรค์แยกตัวเลขลงบรรทัดล่าง
    var L;
    if (has) {
      var st = lrStage();
      L = ['ขอบคุณที่ไม่ยอมแพ้นะ ตำนานนี้เป็นของเรา',
        st === 3 ? 'รัศมีเทพเปล่งประกายเต็มที่แล้ว|ขั้นสูงสุด 3/3' : (st === 1 ? 'มาลัยจะเปล่งประกายเมื่อเช็กอินรวมครบ 130 วัน' : 'วงรัศมีเทพจะปรากฏเมื่อเช็กอินรวมครบ 160 วัน') + '|ขั้น ' + st + '/3'];
    } else if (lft <= 10) {
      L = ['ฉันได้ยินเสียงแตรเทวดาแล้ว!|อีกแค่ ' + lft + ' วัน', 'ประตูสวรรค์เริ่มเปิดแล้ว…|อีกแค่ ' + lft + ' วัน'];
    } else {
      L = ['เทพกำลังเฝ้ามองอยู่นะ… มาลัยจะเป็นของเราในไม่ช้า|อีก ' + lft + ' วัน', 'เช็กอินทุกวัน แล้ววันหนึ่งเทพจะสวมมาลัยให้ฉัน|อีก ' + lft + ' วัน', 'ผู้ที่อ่านสัญญาครบ 100 วัน… คือตำนาน|อีก ' + lft + ' วัน'];
    }
    return L[lrSayN % L.length];
  }
  /* ม้วนกระดาษฉากสวรรค์: คลี่ออกจากกลาง (แกนหมุน) · ตัวหนังสือหมึกทองทีละคำ · ตัวเลขนับขึ้น · ใบลอเรลงอก · ลอยพลิ้ว · แสงวิ่งบนแกน · เปลี่ยนข้อความ = พับแล้วคลี่ใหม่ */
  var svTok = 0, svCnt = 0;
  function svSegs(t) {
    var out = [];
    try { if (window.Intl && Intl.Segmenter) { var sg = new Intl.Segmenter('th', { granularity: 'word' }); for (var it = sg.segment(t)[Symbol.iterator](), r = it.next(); !r.done; r = it.next()) out.push(r.value.segment); return out; } } catch (e) {}
    for (var i = 0; i < t.length; i += 3) out.push(t.slice(i, i + 3)); return out;
  }
  function svShow(el, txt) {
    var tok = ++svTok, prev = el.querySelector('.sv-body');
    if (prev && !calm()) { el.classList.add('sv-out'); setTimeout(function () { if (tok === svTok) svBuild(el, txt, tok); }, 320); }
    else svBuild(el, txt, tok);
  }
  function svBuild(el, txt, tok) {
    clearInterval(svCnt); el.classList.remove('sv-out', 'sv-in', 'sv-done');
    var pr = String(txt).split('|'), segs = svSegs(pr[0]), d = .38, t = '';
    segs.forEach(function (w) { t += /^\s+$/.test(w) ? w : '<span class="sv-w" style="animation-delay:' + d.toFixed(2) + 's">' + h(w) + '</span>'; if (!/^\s+$/.test(w)) d += .055; });
    var hn = '<span class="sv-t">' + t + '</span>', num = 0;
    if (pr[1]) {
      var m = pr[1].match(/(\d+)(\/\d+)?/); num = m ? +m[1] : 0;
      var c = h(pr[1]).replace(/(\d+)(\/\d+)?/, '<b class="sv-n">' + (m ? '0' : '') + '</b>' + (m && m[2] ? '<span class="sv-of">' + m[2] + '</span>' : ''));
      hn += '<span class="sv-hr" style="animation-delay:' + d.toFixed(2) + 's"></span><span class="sv-c" style="animation-delay:' + d.toFixed(2) + 's"><svg class="sv-lf" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 11Q12 8 25 3" stroke="#b9821c" stroke-width=".9" fill="none"/><g fill="#d9a536" stroke="#9a6410" stroke-width=".35"><ellipse class="sv-lv" cx="7" cy="7.4" rx="3.4" ry="1.5" transform="rotate(-40 7 7.4)"/><ellipse class="sv-lv" cx="9" cy="12" rx="3.4" ry="1.5" transform="rotate(20 9 12)"/><ellipse class="sv-lv" cx="14" cy="5" rx="3.4" ry="1.5" transform="rotate(-50 14 5)"/><ellipse class="sv-lv" cx="16.4" cy="9.6" rx="3.4" ry="1.5" transform="rotate(10 16.4 9.6)"/><ellipse class="sv-lv" cx="22" cy="2.6" rx="3" ry="1.4" transform="rotate(-30 22 2.6)"/></g></svg>' + c + '<svg class="sv-lf sv-r" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 11Q12 8 25 3" stroke="#b9821c" stroke-width=".9" fill="none"/><g fill="#d9a536" stroke="#9a6410" stroke-width=".35"><ellipse class="sv-lv" cx="7" cy="7.4" rx="3.4" ry="1.5" transform="rotate(-40 7 7.4)"/><ellipse class="sv-lv" cx="9" cy="12" rx="3.4" ry="1.5" transform="rotate(20 9 12)"/><ellipse class="sv-lv" cx="14" cy="5" rx="3.4" ry="1.5" transform="rotate(-50 14 5)"/><ellipse class="sv-lv" cx="16.4" cy="9.6" rx="3.4" ry="1.5" transform="rotate(10 16.4 9.6)"/><ellipse class="sv-lv" cx="22" cy="2.6" rx="3" ry="1.4" transform="rotate(-30 22 2.6)"/></g></svg></span>';
    }
    el.innerHTML = '<i class="sv-pp"></i><svg class="sv-co c0" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 15V7c0-3.4 2.6-6 6-6h8M1 10c2 0 3-1 3-3s1.4-3 3-3M4 15c0-2 1-3 3-3" stroke="#c8961e" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="7" cy="7" r="1.3" fill="#d9a536"/></svg><svg class="sv-co c1" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 15V7c0-3.4 2.6-6 6-6h8M1 10c2 0 3-1 3-3s1.4-3 3-3M4 15c0-2 1-3 3-3" stroke="#c8961e" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="7" cy="7" r="1.3" fill="#d9a536"/></svg><svg class="sv-co c2" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 15V7c0-3.4 2.6-6 6-6h8M1 10c2 0 3-1 3-3s1.4-3 3-3M4 15c0-2 1-3 3-3" stroke="#c8961e" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="7" cy="7" r="1.3" fill="#d9a536"/></svg><svg class="sv-co c3" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 15V7c0-3.4 2.6-6 6-6h8M1 10c2 0 3-1 3-3s1.4-3 3-3M4 15c0-2 1-3 3-3" stroke="#c8961e" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="7" cy="7" r="1.3" fill="#d9a536"/></svg><i class="sv-rod t"><b class="sv-sh"></b></i><i class="sv-rod b"><b class="sv-sh"></b></i><svg class="sv-tail" viewBox="0 0 20 16" aria-hidden="true"><path d="M0 2C7 1 14 4 18 11 13 8.6 7 8.4 0 11z" fill="#efdcae" stroke="#b9821c" stroke-width=".8"/><path d="M18 11c-2.6-.6-4.4.4-4.4 2.2 0 1.4 1.4 2.2 2.8 1.6" fill="#e3c88e" stroke="#b9821c" stroke-width=".8"/></svg><span class="sv-body">' + hn + '</span>';
    el.style.setProperty('--sh', (el.offsetHeight / 2) + 'px');
    void el.offsetWidth; el.classList.add('sv-in');
    var nEl = el.querySelector('.sv-n');
    if (!nEl) return;
    if (calm()) { nEl.textContent = num; el.classList.add('sv-done'); return; }
    setTimeout(function () {
      if (tok !== svTok) return;
      var t0 = Date.now(), dur = Math.min(900, 300 + num * 6);
      svCnt = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / dur); nEl.textContent = Math.round(num * (1 - Math.pow(1 - k, 3)));
        if (k >= 1) { clearInterval(svCnt); el.classList.add('sv-done'); }
      }, 30);
    }, (d + .2) * 1000);
  }
  /* กล่องคำพูด: พิมพ์ทีละตัว (ข้อความเดิมไม่พิมพ์ซ้ำ) */
  var typeT = 0;
  /* กรอบคำพูดฉากเหรียญไฟ: ป้ายหนังแกะลาย + ตราประทับครั่ง · ข้อความตำนานจัดเป็น 3 บรรทัด (หัวเรื่อง / ไอคอนม้วน / ตัวเลขวันเรืองแสง) */
  var MK_SEAL = '<i class="mk-seal" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.8 3.4-5.4 3.8-9.4 2.6 1.8 3.8 4.4 3.8 6.4 1-.8 1.6-2 1.8-3.4 2 1.8 2.6 4.4 2.6 6.4 0 3.2-2.4 5.6-6 5.6z"/></svg></i>';
  var MK_SCROLL = '<svg class="mk-ic" viewBox="0 0 24 20" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="1" fill="#fbf1d8" stroke="currentColor" stroke-width="1.6"/><rect x="2" y="1.5" width="4" height="17" rx="2" fill="currentColor"/><rect x="18" y="1.5" width="4" height="17" rx="2" fill="currentColor"/><path d="M8 7h8M8 10.5h6M8 14h7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".6"/></svg>';
  function mkShow(el, txt) {
    var m = /^รู้ไหม เหรียญนี้มีตำนานนะ… กด 📜 อ่านดูสิ! อีก (\d+) วันก็ได้แล้ว/.exec(String(txt));
    el.classList.remove('sv-in');
    el.innerHTML = (m ? '<span class="mk-h">รู้ไหม เหรียญนี้มีตำนานนะ…</span><span class="mk-m">กด ' + MK_SCROLL + ' อ่านดูสิ!</span><span class="mk-n">อีก <b>' + m[1] + '</b> วันก็ได้แล้ว 🔥</span>'
      : '<span class="mk-t">' + h(String(txt).replace('|', ' · ')) + '</span>') + MK_SEAL;
    el.classList.toggle('mk-lore', !!m);
    if (!calm()) { el.classList.remove('mk-in'); void el.offsetWidth; el.classList.add('mk-in'); }
  }
  function sayType(el, txt) {
    var thr = !!(sh && sh.classList.contains('is-thr')), RY = thr ? '<i class="ry-sp a" aria-hidden="true">✦</i><i class="ry-sp b" aria-hidden="true">✦</i>' : '';
    var tk = txt + (sh && sh.classList.contains('is-fire') ? '#f' : thr ? '#t' : '');
    if (el.getAttribute('data-t') === tk) return;
    el.setAttribute('data-t', tk); clearInterval(typeT); el.classList.remove('mk-lore', 'mk-in');
    if (sh && sh.classList.contains('is-heav')) { svShow(el, txt); return; }
    if (sh && sh.classList.contains('is-fire')) { mkShow(el, txt); return; }
    if (String(txt).indexOf('|') >= 0) txt = String(txt).replace('|', ' · ');
    el.classList.remove('sv-in');
    if (calm()) { el.textContent = txt; if (RY) el.insertAdjacentHTML('beforeend', RY); return; }
    var chars = Array.from ? Array.from(txt) : txt.split(''), n = 0;
    el.innerHTML = '<span></span><i class="vst-cur"></i><span class="vst-rest"></span>' + RY;
    var sp = el.firstChild, rest = el.querySelector('.vst-rest'); rest.textContent = txt;
    typeT = setInterval(function () { n += 2; sp.textContent = chars.slice(0, n).join(''); rest.textContent = chars.slice(n).join(''); if (n >= chars.length) { clearInterval(typeT); setTimeout(function () { var c = el.querySelector('.vst-cur'); if (c) c.remove(); }, 1400); } }, 28);
  }
  /* ===== ตำนานเหรียญไฟไม่มอด: บทนำเปิดให้อ่านเสมอ · ตอนที่ 1–3 ปลดล็อกตามสถิติติดต่อกัน (7/14/30) ===== */
  var LORE = [
    { need: 0, tier: 1, ic: '🕯️', t: 'บทนำ · ห้องสมุดที่ไม่เคยหลับ', p: [
      'ตำนานเล่าว่า ในห้องสมุดเก่าแห่งหนึ่ง มีม้วนกระดาษน้อยชื่อ "เวลลัม"',
      'ทุกคืนเขาจะจุดตะเกียงดวงเล็ก แล้วอ่านสัญญาทุกฉบับจนถึงบรรทัดสุดท้าย',
      'ใคร ๆ ต่างรีบเซ็นแล้วจากไป แต่เวลลัมเชื่อว่า ความจริงมักซ่อนอยู่ในบรรทัดที่ไม่มีใครอ่าน'] },
    { need: 7, tier: 1, ic: '🔥', t: 'ตอนที่ 1 · ไฟดวงแรก', p: [
      'คืนที่เจ็ด ลมพัดแรงจนตะเกียงแทบดับ เวลลัมเอามือป้องเปลวไฟไว้แล้วอ่านต่อ',
      'จนพบข้อความตัวจิ๋วที่อาจทำให้เพื่อนรักต้องเสียบ้านทั้งหลัง',
      'รุ่งเช้า เปลวไฟนั้นไม่ดับอีกเลย มันหลอมเป็นเหรียญทองติดอกเขา — ไฟแห่งความอดทนดวงแรก'] },
    { need: 14, tier: 2, ic: '❄️', t: 'ตอนที่ 2 · ไฟกลางหิมะ', p: [
      'ฤดูหนาวมาเยือน หิมะปิดทางทุกสาย หลายคนเลิกกลางคัน',
      'เวลลัมห่มผ้าขนฟู ฝ่าความหนาวไปอ่านทุกวันไม่เคยขาด',
      'ไฟในเหรียญเปลี่ยนเป็นสีฟ้าใสดั่งน้ำแข็ง แต่ร้อนแรงกว่าเดิม — ไฟที่ความหนาวดับไม่ได้'] },
    { need: 30, tier: 3, ic: '💎', t: 'ตอนที่ 3 · หัวใจที่ไม่มีวันมอด', p: [
      'ครบสามสิบคืน ดวงดาวทั้งฟ้าลงมาส่องห้องสมุด',
      'ไฟในเหรียญถูกหลอมด้วยความตั้งใจจนกลายเป็นเพชร และงอกปีกคริสตัลออกมา',
      'นับแต่นั้น ใครได้ครอบครองเหรียญนี้ คือผู้ที่ "อ่านให้ครบ ก่อนเซ็น" ทุกครั้ง และไม่มีวันยอมแพ้'] }
  ];
  var lr = null, lrIdx = 0;
  var LIC = [   // ไอคอนตอน วาดเอง สีทอง
    '<path d="M12 3c1.6 2 1.8 3.4.4 4.6-1.6-1-1.8-2.6-.4-4.6z" fill="#f4a020"/><rect x="9" y="9" width="6" height="11" rx="1.4" fill="currentColor"/><path d="M7 21h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.6 3-5.2 3.6-9.4 2.4 1.5 3.6 3.6 3.6 5.6 1-.7 1.6-1.9 1.7-3.1 2.4 1.9 3.6 4.3 3.6 6.9 0 3.4-2.6 5.6-6.5 5.6z" fill="currentColor"/>',
    '<g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M10 4.5 12 6l2-1.5M10 19.5 12 18l2 1.5M4.6 10.3l2.4-.3-.7-2.3M19.4 13.7l-2.4.3.7 2.3M4.6 13.7l2.4.3-.7 2.3M19.4 10.3l-2.4-.3.7-2.3"/></g>',
    '<path d="M6 4h12l4 5-10 12L2 9z" fill="currentColor"/><path d="M2 9h20M8 4l4 17M16 4l-4 17M6 4l2 5M18 4l-2 5" stroke="#fff6dc" stroke-width="1" fill="none" opacity=".7"/>'
  ];
  var SEAL = '<svg class="vlr-seal" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c6 0 9 4 14 5s9 3 10 9-1 9 1 14-1 10-6 13-5 8-11 10-9-1-14 0-11-1-14-6-6-7-7-13 3-8 1-13 1-11 7-13 7-5 12-6 4-0 7 0z" fill="#a8232c"/><circle cx="32" cy="32" r="17" fill="#c22d37" stroke="#7a1018" stroke-width="2"/><circle cx="32" cy="32" r="13" fill="none" stroke="#e06b72" stroke-width="1" stroke-dasharray="2 2.4"/><path d="M32 43c-4.6 0-7.6-3-7.6-7 0-4.6 3.8-6.6 4.6-12 3 1.9 4.6 4.6 4.6 7.2 1.3-.9 2-2.4 2.2-4 3 2.4 4.6 5.4 4.6 8.8 0 4.3-3.3 7-8.4 7z" fill="#7a1018"/><path d="M14 20c3-6 9-10 16-10" stroke="#ff9aa0" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".55"/></svg>';
  function dropCap(t) { var m = t.match(/^.[ัำ-ฺ็-๎]*/); return '<span class="dc">' + h(m[0]) + '</span>' + h(t.slice(m[0].length)); }
  function loreSeen() { try { return +(localStorage.getItem('vc_lore_seen') || -1); } catch (e) { return -1; } }
  function loreBtn() {
    var n = LORE.filter(loreOk).length, last = -1; LORE.forEach(function (x, k) { if (loreOk(x)) last = k; });
    var fresh = last > loreSeen();
    return '<span class="lim-lore" role="button" tabindex="0" data-lore aria-label="อ่านตำนานเหรียญไฟไม่มอด อ่านได้ ' + n + ' จาก ' + LORE.length + ' ตอน' + (fresh ? ' มีตอนใหม่' : '') + '">' +
      '<svg class="lore-ic" viewBox="0 0 32 28" aria-hidden="true">' +
        '<rect x="5" y="6" width="22" height="16" rx="1.2" fill="#f6e8c4" stroke="#8a5a2b" stroke-width="1"/><path d="M9 10.5h6M9 13.5h5M19 10.5h4M19 17.5h4M9 17.5h5" stroke="#b08a4a" stroke-width="1.1" stroke-linecap="round"/>' +
        '<rect x="2" y="3" width="28" height="4.4" rx="2.2" fill="#7a4a1f"/><rect x="2" y="20.6" width="28" height="4.4" rx="2.2" fill="#7a4a1f"/>' +
        '<rect x="0" y="2.2" width="3.4" height="6" rx="1.3" fill="#f4c542"/><rect x="28.6" y="2.2" width="3.4" height="6" rx="1.3" fill="#f4c542"/><rect x="0" y="19.8" width="3.4" height="6" rx="1.3" fill="#f4c542"/><rect x="28.6" y="19.8" width="3.4" height="6" rx="1.3" fill="#f4c542"/>' +
        '<path d="M17 6v16" stroke="#c22d37" stroke-width="2"/><circle cx="17" cy="14" r="3.6" fill="#b2232d" stroke="#7a1018" stroke-width=".8"/><path d="M17 15.8c-1 0-1.6-.7-1.6-1.5 0-1 .8-1.4 1-2.4.6.4 1 1 1 1.6.3-.2.5-.5.5-.9.6.5 1 1.1 1 1.8 0 .8-.7 1.4-1.9 1.4z" fill="#ff9aa0"/></svg>' +
      '<i class="lore-tw" aria-hidden="true"></i><span>ตำนาน</span><span class="lore-dots" aria-hidden="true">' + LORE.map(function (x) { return '<i class="' + (loreOk(x) ? 'on' : '') + '"></i>'; }).join('') + '</span>' + (fresh ? '<i class="lore-new"></i>' : '') + '</span>';
  }
  function loreOk(c) { return c.need === 0 || (S && (S.bestStreak || 0) >= c.need); }
  /* ===== ตำนานมาลัย: บทนำอ่านได้ทันที · ตอน 1–3 ที่ 25/50/75 วัน · ตอนจบ 100 วัน (ได้มาลัย) · ตอนพิเศษ 130/160 วัน (ขั้น 2/3) — นับวันเช็กอินรวม ===== */
  var lrSet = 'm';
  function lrTreeArt(bare) {
    var lv = ''; [[-22, -10, -30], [-14, -22, -10], [0, -28, 0], [14, -22, 10], [22, -10, 30], [-26, 2, -50], [26, 2, 50], [-8, -14, -20], [8, -14, 20]].forEach(function (q, k) { if (bare && k) return; lv += '<ellipse cx="' + (60 + q[0]) + '" cy="' + (34 + q[1]) + '" rx="6" ry="2.6" transform="rotate(' + q[2] + ' ' + (60 + q[0]) + ' ' + (34 + q[1]) + ')" fill="url(#ltG)" stroke="#8a5a12" stroke-width=".5"/>'; });
    return '<svg viewBox="0 0 120 80"><defs><linearGradient id="ltG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#f4c542"/><stop offset="1" stop-color="#a8741a"/></linearGradient><radialGradient id="ltH"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".8"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="60" cy="34" r="36" fill="url(#ltH)"/><path d="M28 72c-6 0-8-5-5-8 2-3 7-3 9-1 2-5 9-7 13-3 3-5 12-5 15 0 4-4 12-2 13 3 4-2 10 0 10 5 0 3-3 5-6 5z" fill="#fff8ec" opacity=".9"/>' +
      '<path d="M60 66V40M60 50l-12-12M60 46l12-12M60 40l-8-14M60 40l8-14" stroke="#9a6a1c" stroke-width="2.4" stroke-linecap="round" fill="none"/>' + lv +
      (bare ? '<ellipse class="lt-fall" cx="80" cy="56" rx="5" ry="2.2" transform="rotate(30 80 56)" fill="url(#ltG)" stroke="#8a5a12" stroke-width=".5"/>' : '') + '</svg>';
  }
  var LORE_L = [
    { need: 0, t: 'บทนำ · ต้นลอเรลทอง', art: function () { return lrTreeArt(false); }, q: 'คำสัญญาที่ไม่ได้อ่าน ไม่ใช่คำสัญญาที่แท้จริง', p: [
      'เหนือก้อนเมฆชั้นที่เจ็ด มี**สวนสวรรค์**ที่ไม่เคยมืด',
      'กลางสวนมี==ต้นลอเรลทอง==ต้นเดียว ที่ไม่ผลิใบตามฤดูกาล',
      'มันจะแตกใบใหม่ก็ต่อเมื่อมีใครสักคน ==อ่านเอกสารจนถึงบรรทัดสุดท้าย==อย่างตั้งใจ',
      'ผู้ดูแลต้นไม้คือ**เทพีออเรลา** เทพีแห่งพันธสัญญา ผู้เชื่อว่า'] },
    { need: 25, t: 'ตอนที่ 1 · ยุคที่ใบร่วง', art: function () { return lrTreeArt(true); }, q: 'ผู้ใดกลับมาอ่านอย่างตั้งใจได้ครบร้อยวัน ใบไม้ทั้งร้อยจะกลายเป็นมาลัยบนศีรษะของเขา', p: [
      'มีอยู่ยุคหนึ่งที่ผู้คนรีบร้อน ==เซ็นชื่อทั้งที่ยังไม่ได้อ่าน==',
      '**ต้นลอเรลทอง**จึงร่วงใบทีละใบ จนกิ่งโล่ง',
      '**เทพีออเรลา**เก็บใบสุดท้ายไว้ในมือ แล้วประกาศว่า'] },
    { need: 50, t: 'ตอนที่ 2 · น้ำพุแห่งความจำ', art: function () { return fountainSvg(); }, q: 'ยิ่งอ่านละเอียดเท่าไร ใบไม้ก็ยิ่งเปล่งประกายเท่านั้น', p: [
      'ใบลอเรลที่ผลิใหม่ทุกใบ เทพีจะนำไปจุ่มใน**น้ำพุแห่งความจำ**',
      'น้ำในน้ำพุ==จดจำทุกบรรทัดที่ผู้อ่านเคยอ่าน==',
      'แล้วเคลือบใบไม้ให้เป็นทองทีละชั้น ว่ากันว่า'] },
    { need: 75, t: 'ตอนที่ 3 · ม้วนกระดาษน้อยผู้ไม่ยอมแพ้', art: function () { return mascot('happy', 100, ''); }, q: 'และตอนนี้ เขาได้พบคนคนนั้นแล้ว', p: [
      'ในบรรดาผู้เฝ้ารอ มีม้วนกระดาษสัญญาน้อย ๆ ชื่อ**เวลลัม**',
      'เขา==เคยถูกเซ็นทิ้งโดยไม่มีใครอ่าน==มาหลายครั้ง แต่ไม่เคยโกรธ',
      'เขาเพียงหวังว่าวันหนึ่ง จะมีใครสักคนอ่านเขาจนจบ แล้วเดินไปด้วยกันทุกวัน…'] },
    { need: 100, t: 'ตอนจบ · เสียงแตรแห่งสวรรค์', art: function () { return goddessSvg(); }, q: 'ใบไม้ทุกใบ เกิดจากวันที่เราอ่านด้วยกัน', p: [
      'เช้าวันที่ร้อย ==เสียงแตรทองดังก้องทั่วฟ้า==',
      '**เทพีออเรลา**เป่าแตรประกาศชื่อผู้ไม่ยอมแพ้',
      '**น้ำพุแห่งความจำ**พุ่งสูง มาลัยที่ถักจากใบไม้ร้อยใบลอยขึ้นจากสายน้ำ แล้ว==บินมาสวมบนศีรษะของเวลลัม== เพราะ'] },
    { need: 130, t: 'ตอนพิเศษ 1 · ใบที่เปล่งประกาย', art: function () { return '<svg viewBox="20 -17 80 40">' + laurelArt(2) + '</svg>'; }, q: 'มาลัยนี้ไม่เคยเสร็จ ตราบใดที่ยังมีคนอ่าน', p: [
      'หลังพิธี ผู้คนคิดว่าเรื่องจบแล้ว แต่**ต้นลอเรลทอง**ยังคงผลิใบต่อ',
      'ทุกใบใหม่ลอยมาประดับมาลัยบนหัว**เวลลัม** จน==ปลายใบทุกใบมีประกายดาว==',
      '**เทพีออเรลา**กระซิบว่า'] },
    { need: 160, t: 'ตอนพิเศษ 2 · รัศมีแห่งผู้รักษาคำสัญญา', art: function () { return '<svg viewBox="10 -32 100 70">' + laurelArt(3, 'back') + laurelArt(3, 'front') + '</svg>'; }, q: 'ไม่ใช่เพราะอ่านเร็วที่สุด แต่เพราะไม่เคยหยุดอ่าน', p: [
      'เมื่อครบร้อยหกสิบวัน ==วงแหวนแสงก่อตัวขึ้นหลังศีรษะ==ของ**เวลลัม**',
      'เป็นรัศมีที่เทพีมอบให้==ผู้รักษาคำสัญญา==เท่านั้น'] }
  ];
  var LIC_L = [
    '<path d="M12 21v-8M12 15l-4-4M12 14l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><g fill="currentColor"><ellipse cx="7" cy="9" rx="3" ry="1.4" transform="rotate(-35 7 9)"/><ellipse cx="17" cy="9" rx="3" ry="1.4" transform="rotate(35 17 9)"/><ellipse cx="12" cy="6" rx="1.4" ry="3"/><ellipse cx="9" cy="5" rx="1.2" ry="2.6" transform="rotate(-25 9 5)"/><ellipse cx="15" cy="5" rx="1.2" ry="2.6" transform="rotate(25 15 5)"/></g>',
    '<path d="M6 4c3 3 4 7 3 11M9 15c-2 1-4 0-5-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><ellipse cx="16" cy="17" rx="4" ry="1.8" transform="rotate(30 16 17)" fill="currentColor"/>',
    '<path d="M12 3c-2.6 3.4-4 5.8-4 7.6a4 4 0 0 0 8 0C16 8.8 14.6 6.4 12 3z" fill="currentColor"/><path d="M4 18h16M6 21h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    '<rect x="6" y="5" width="12" height="14" rx="1" fill="currentColor"/><rect x="4" y="3" width="16" height="3.4" rx="1.7" fill="currentColor"/><rect x="4" y="17.6" width="16" height="3.4" rx="1.7" fill="currentColor"/><path d="M9 10h6M9 13h4" stroke="#fff6dc" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>',
    '<path d="M3 13h9l7-5v12l-7-5H3z" fill="currentColor"/><path d="M21 11q1.4 2 0 4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor"/><circle cx="19" cy="18" r="1.6" fill="currentColor"/><circle cx="5" cy="19" r="1.1" fill="currentColor"/>',
    '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.4 2"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>'
  ];
  var SEAL_L = '<svg class="vlr-seal vlr-seal-l" viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="slG" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#e0a92c"/><stop offset="1" stop-color="#8a5a12"/></radialGradient></defs><circle cx="32" cy="32" r="27" fill="url(#slG)" stroke="#7a4d08" stroke-width="1.6"/><circle cx="32" cy="32" r="21" fill="none" stroke="#fff3c4" stroke-width=".9" stroke-dasharray="1.6 2.2"/>' +
    (function () { var o = ''; for (var k = 0; k < 7; k++) { var a = Math.PI * (.62 + k * .13); o += '<ellipse cx="' + (32 + 14 * Math.cos(a)).toFixed(1) + '" cy="' + (32 + 14 * Math.sin(a)).toFixed(1) + '" rx="3.4" ry="1.4" transform="rotate(' + (a * 180 / Math.PI + 60).toFixed(0) + ' ' + (32 + 14 * Math.cos(a)).toFixed(1) + ' ' + (32 + 14 * Math.sin(a)).toFixed(1) + ')" fill="#7a4d08"/>'; a = Math.PI * (.38 - k * .13); o += '<ellipse cx="' + (32 + 14 * Math.cos(a)).toFixed(1) + '" cy="' + (32 + 14 * Math.sin(a)).toFixed(1) + '" rx="3.4" ry="1.4" transform="rotate(' + (a * 180 / Math.PI - 60).toFixed(0) + ' ' + (32 + 14 * Math.cos(a)).toFixed(1) + ' ' + (32 + 14 * Math.sin(a)).toFixed(1) + ')" fill="#7a4d08"/>'; } return o; })() +
    '<path d="M32 23l2.2 5.4 5.8.4-4.4 3.8 1.4 5.6L32 35.2l-5 3 1.4-5.6-4.4-3.8 5.8-.4z" fill="#7a4d08"/></svg>';
  function lFmt(t, d) { var k = 0; return h(t).replace(/==(.+?)==/g, function (m, x) { return '<mark class="lh" style="--md:' + (d + .25 * k++).toFixed(2) + 's">' + x + '</mark>'; }).replace(/\*\*(.+?)\*\*/g, '<b class="ln">$1</b>'); }
  /* ===== ตำนานหมวกนักเวท: บทนำอ่านได้ทุกคน · ตอน 1–3 อ่านได้เมื่อมีหมวก (เนื้อเรื่อง/ตัวละครแต่งขึ้นเอง) ===== */
  var WZH = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + ART_OUT.wizard.art + '</g>'; };
  var LORE_W = [
    { need: 0, t: 'บทนำ · หมวกบนชั้นบนสุด', art: function () { return '<svg viewBox="0 -44 120 92"><g fill="#f3e6c8" stroke="#3a2a12" stroke-width="2"><rect x="18" y="20" width="84" height="12" rx="2"/><rect x="24" y="10" width="72" height="11" rx="2"/><rect x="14" y="31" width="92" height="12" rx="2"/></g><path d="M30 16h40M26 37h50" stroke="#c9b48a" stroke-width="1.6"/>' + WZH(12, -12, .8) + '</svg>'; }, q: 'บางอย่างรอให้ถูกอ่าน มานานกว่าที่เราคิด', p: [
      'บนชั้นบนสุดของ**หอสมุดสัญญา** มีกองกระดาษที่ไม่เคยมีใครเปิดอ่าน',
      'คืนหนึ่ง**เวลลัม**ปีนขึ้นไปเก็บฝุ่น แล้วพบ==หมวกปลายงอสีม่วงหม่น==วางอยู่บนกองนั้น',
      'บนแถบผ้าคาดหมวกมีตัวอักษรจาง ๆ เขียนไว้ว่า'] },
    { need: 1, t: 'ตอนที่ 1 · ตัวหนังสือที่ซ่อนตัว', art: function () { return '<svg viewBox="0 -10 120 70"><rect x="22" y="-4" width="76" height="60" rx="4" fill="#fbf6ea" stroke="#3a2a12" stroke-width="2"/><g stroke="#c9b48a" stroke-width="2.4" stroke-linecap="round"><path d="M32 8h56M32 17h50M32 26h54"/></g><path d="M32 42h44" stroke="#f4c542" stroke-width="3" stroke-linecap="round"/><path d="M32 48h30" stroke="#b98cff" stroke-width="2" stroke-linecap="round"/><g fill="#ffe28a"><path d="M86 38l1.5 3.3 3.6.4-2.7 2.4.8 3.5-3.2-1.9-3.2 1.9.8-3.5-2.7-2.4 3.6-.4z"/><circle cx="80" cy="50" r="1.4"/><circle cx="94" cy="47" r="1.1"/></g></svg>'; }, q: 'สิ่งที่ตัวเล็กที่สุด มักสำคัญที่สุด', p: [
      'ทันทีที่สวมหมวก ==ตัวหนังสือเล็กจิ๋วท้ายสัญญาทุกฉบับก็เรืองแสงขึ้นมา==',
      'มันคือ**เงื่อนไขที่ซ่อนอยู่** ค่าปรับ การต่ออายุอัตโนมัติ สิทธิ์ที่อีกฝ่ายเก็บไว้คนเดียว',
      'ข้อความเหล่านั้นอยู่ตรงนั้นมาตลอด เพียงแต่ไม่เคยมีใครอ่านถึง หมวกกระซิบเบา ๆ ว่า'] },
    { need: 1, t: 'ตอนที่ 2 · พ่อมดผู้ลืมอ่าน', art: function () { return '<svg viewBox="0 -10 120 70"><path d="M40 56V14l10-14 10 14v42z" fill="#4a3a7a" stroke="#3a2a12" stroke-width="2" stroke-linejoin="round"/><path d="M60 56V24l12-10 12 10v32z" fill="#3a2d63" stroke="#3a2a12" stroke-width="2" stroke-linejoin="round" opacity=".7"/><rect x="47" y="22" width="6" height="8" rx="3" fill="#ffe28a" opacity=".5"/><path d="M20 56h80" stroke="#3a2a12" stroke-width="2"/><path d="M86 6c6 0 9 4 9 8" stroke="#b9a2ff" stroke-width="1.6" fill="none" stroke-dasharray="2 3"/></svg>'; }, q: 'เวทมนตร์ช่วยได้ทุกอย่าง ยกเว้นสิ่งที่เราไม่ยอมอ่าน', p: [
      'หมวกเคยเป็นของ**พ่อมดโอบิน** ผู้ร่ายคาถาได้ร้อยบท แต่มีนิสัยอย่างหนึ่ง คือ==เซ็นทุกอย่างโดยไม่อ่านให้จบ==',
      'วันหนึ่งเขาเซ็นสัญญาเช่าหอคอย ในข้อสุดท้ายเขียนไว้ว่า ==ผู้ให้เช่าเรียกคืนได้ทุกเมื่อ==',
      'เช้าวันต่อมา หอคอยก็ไม่ใช่ของเขาอีกต่อไป เหลือเพียงหมวกใบนี้กับคำสอนข้อเดียว'] },
    { need: 1, t: 'ตอนที่ 3 · คาถาที่แท้จริง', art: function () { var m = mascot('happy', 100, ''); return m.indexOf('</svg>') > 0 ? m.replace(/<\/svg>\s*$/, '<g class="vm-outfit">' + ART_OUT.wizard.art + '</g></svg>') : m; }, q: 'คาถาที่ดีที่สุด คือการอ่านทุกบรรทัดก่อนเซ็น', p: [
      '**เวลลัม**ถามหมวกว่า แล้วเวทมนตร์ของเจ้าอยู่ที่ไหนกันแน่',
      'หมวกหัวเราะ ==เวทมนตร์ไม่เคยอยู่ที่ประกายดาวบนผ้า==',
      'มันอยู่ที่**คนที่ยอมอ่านจนจบ** ทุกครั้งที่ใครสักคนอ่านทุกบรรทัดก่อนเซ็น หมวกก็จะเรืองแสงขึ้นอีกนิด เพราะ'] }
  ];
  var LIC_W = [
    '<path d="M4 18h16M6 14h12M5 10h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 16h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    '<path d="M8 21V8l4-5 4 5v13zM5 21h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    '<path d="M12 3l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.4 7 18.2l1.2-5.6L4 8.8l5.6-.6z" fill="currentColor"/>'
  ];
  /* ===== ตำนานหมวกนอนดาว (lrSet 'c') — บทนำอ่านได้ทุกคน · ตอน 1–3 เมื่อมีหมวก ===== */
  var CPH = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + ART_OUT.cap.art + '</g>'; };
  var MOON_C = '<path d="M306.1 28A32 32 0 1 0 336.3 70.2A26 26 0 0 1 306.1 28Z" fill="#ffe9a6" stroke="#c99236" stroke-width="1.6" stroke-linejoin="round"/><path d="M286 60q3.4 3 6.8 0M291 69q3 2.6 6 .2" stroke="#6b4a18" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="285" cy="68" rx="3.4" ry="2" fill="#f7a3a0" opacity=".75"/>';
  var LORE_C = [
    { need: 0, t: 'บทนำ · หมวกที่ลอยลงมาจากฟ้า', art: function () { return '<svg viewBox="0 -14 120 84"><rect x="20" y="-6" width="80" height="62" rx="6" fill="#2b3170" stroke="#3a2a12" stroke-width="2"/><path d="M60-6v62M20 25h80" stroke="#3a2a12" stroke-width="2"/><g fill="#fff3c4"><circle cx="32" cy="6" r="1.2"/><circle cx="82" cy="10" r="1"/><circle cx="46" cy="36" r="1"/><circle cx="90" cy="40" r="1.3"/></g><path d="M74 2l18-8" stroke="#fff6d0" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><rect x="14" y="54" width="92" height="8" rx="2" fill="#e2ad74" stroke="#3a2a12" stroke-width="2"/>' + CPH(34, 34, .46) + '</svg>'; }, q: 'บางเรื่อง คำตอบที่ดีที่สุดคือ “ขอนอนคิดก่อน”', p: [
      'คืนหนึ่ง**เวลลัม**นั่งอ่านสัญญากองโตจนดึกดื่น ตาปรือจนตัวหนังสือเริ่มเต้นไปมา',
      'ทันใดนั้น ดาวตกดวงหนึ่งพาดผ่านหน้าต่าง แล้ว==หมวกผ้านุ่มสีน้ำเงินก็ลอยพลิ้วลงมาวางบนขอบหน้าต่าง==',
      'ปอมปอมของมันอุ่นเหมือนแสงจันทร์ มีป้ายผ้าเล็ก ๆ ปักไว้ว่า'] },
    { need: 1, t: 'ตอนที่ 1 · ข้อเสนอตอนเที่ยงคืน', art: function () { return '<svg viewBox="0 -10 120 70"><rect x="16" y="-2" width="58" height="58" rx="4" fill="#fbf6ea" stroke="#3a2a12" stroke-width="2"/><g stroke="#c9b48a" stroke-width="2.4" stroke-linecap="round"><path d="M24 10h42M24 19h36M24 28h40M24 37h30"/></g><path d="M24 47h22" stroke="#e5484d" stroke-width="2.4" stroke-linecap="round"/><circle cx="88" cy="22" r="18" fill="#fffaf0" stroke="#3a2a12" stroke-width="2"/><path d="M88 22V9M88 22l-1 0" stroke="#3a2a12" stroke-width="2.4" stroke-linecap="round"/><circle cx="88" cy="22" r="2" fill="#3a2a12"/><path d="M88 6v2M104 22h-2M88 38v-2M72 22h2" stroke="#3a2a12" stroke-width="1.6"/><text x="98" y="50" font-size="16" font-weight="800" fill="#ffd84d" stroke="#3a2a12" stroke-width="1" paint-order="stroke">!</text></svg>'; }, q: 'ข้อเสนอที่ดีจริง ไม่เคยกลัวให้คุณคิดนาน', p: [
      'ทันทีที่สวมหมวก เวลลัมก็หลับไปและฝันถึง**พ่อค้าผ้าคลุมสีเทา** ผู้ยื่นสัญญามาพร้อมรอยยิ้มกว้าง',
      'เขาเร่งว่า ==เซ็นเดี๋ยวนี้เลย ข้อเสนอนี้หมดเขตตอนเที่ยงคืน!== นาฬิกาเดินติ๊กต่อกดดันอยู่ข้างหู',
      'แต่หมวกทำให้เวลลัมหาวยาว แล้วพูดสิ่งที่พ่อค้าไม่อยากได้ยินที่สุด'] },
    { need: 1, t: 'ตอนที่ 2 · พระจันทร์ผู้เคยรีบเซ็น', art: function () { return '<svg viewBox="262 18 96 84"><circle cx="304" cy="62" r="40" fill="#fff3c4" opacity=".25"/>' + MOON_C + '<path d="M326 82l14 10M332 88l-6 8" stroke="#a89ad0" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/><rect x="334" y="88" width="18" height="12" rx="2" fill="#fbf6ea" stroke="#3a2a12" stroke-width="1.6" transform="rotate(12 343 94)"/></svg>'; }, q: 'สัญญาที่ไม่มีทางออก คือกับดักที่ดูสวยงาม', p: [
      'บนฟ้า**พระจันทร์ง่วงงุน**กระซิบเล่าว่า นานมาแล้วเขาเคยรีบเซ็นสัญญาว่าจะส่องแสง==ทุกคืน ตลอดไป==',
      'เขาไม่ได้อ่านว่าในสัญญา**ไม่มีข้อไหนให้เลิกได้เลย** ไม่มีวันหยุด ไม่มีวันพัก',
      'พระจันทร์จึงง่วงมาตลอดจนทุกวันนี้ และถักหมวกใบนี้ขึ้นจากแสงที่นุ่มที่สุดของตัวเอง เพื่อเตือนทุกคนว่า'] },
    { need: 1, t: 'ตอนที่ 3 · ตื่นมาพร้อมคำตอบ', art: function () { var m = mascot('happy', 100, ''); return m.indexOf('</svg>') > 0 ? m.replace(/<\/svg>\s*$/, '<g class="vm-outfit">' + ART_OUT.cap.art + '</g></svg>') : m; }, q: 'สัญญาที่ดี รอให้คุณนอนคิดได้เสมอ', p: [
      'เช้าวันรุ่งขึ้น เวลลัมอ่านสัญญาฉบับเดิมอีกครั้งด้วยใจที่สดชื่น แล้วก็เจอ==ข้อต่ออายุอัตโนมัติกับค่าธรรมเนียมซ่อนอยู่ท้ายหน้า==',
      'เมื่อคืนตาปรือจนมองข้ามไป แต่เช้านี้เห็นชัดทุกบรรทัด เวลลัมจด**คำถาม**ไว้ถามอีกฝ่ายก่อนตัดสินใจ',
      'หมวกนอนดาวแกว่งปอมปอมอย่างพอใจ เพราะเวทมนตร์ของมันมีเพียงข้อเดียว'] }
  ];
  var LIC_C = [
    '<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.6"/>',
    '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    '<path d="M14 3.5a8.5 8.5 0 1 0 6.5 13 7 7 0 1 1-6.5-13z" fill="currentColor"/>',
    '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  ];
  function hasCap() { return ownedOutfits().indexOf('cap') >= 0; }
  function capLoreBtn() {
    var seen = -1; try { seen = +(localStorage.getItem('vc_lore_seen_c') || -1); } catch (e) {}
    var last = hasCap() ? LORE_C.length - 1 : 0;
    return '<span class="vof-lore-w is-cap" role="button" tabindex="0" data-lore="cap" aria-label="อ่านตำนานหมวกนอนดาว' + (last > seen ? ' มีตอนใหม่' : '') + '">📜' + (last > seen ? '<i class="lore-new"></i>' : '') + '</span>';
  }
  /* ===== ตำนานมงกุฎตำนาน (lrSet 'r') 5 ตอน — บทนำอ่านได้ทุกคน · ตอน 1–4 เมื่อมีมงกุฎ · ธีมท้องพระโรง · ตราประทับตอนจบ ===== */
  var CRH = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + ART_OUT.crown.art + '</g>'; };
  var LORE_R = [
    { need: 0, t: 'บทนำ · พระราชาผู้ไม่เคยรีบ', art: function () { return '<svg viewBox="0 -40 120 100"><path d="M30 58V-6Q30-34 60-34Q90-34 90-6V58Z" fill="#c9921f" stroke="#4a2e05" stroke-width="2"/><path d="M38 58V-2Q38-24 60-24Q82-24 82-2V58Z" fill="#8e1328" stroke="#4a2e05" stroke-width="1.6"/><rect x="24" y="34" width="72" height="14" rx="4" fill="#a8172f" stroke="#4a2e05" stroke-width="2"/><rect x="20" y="46" width="80" height="10" rx="3" fill="#e0a92c" stroke="#4a2e05" stroke-width="2"/><circle cx="30" cy="-6" r="4" fill="#f4c542" stroke="#4a2e05" stroke-width="1.4"/><circle cx="90" cy="-6" r="4" fill="#f4c542" stroke="#4a2e05" stroke-width="1.4"/>' + CRH(27, 4, .55) + '</svg>'; }, q: 'ตราประทับหนึ่งดวง หนักเท่าทั้งอาณาจักร', p: [
      'ณ **อาณาจักรลูเมน** มีพระราชาชราองค์หนึ่งนามว่า**พระราชาโอรัน** ผู้ครองบัลลังก์มาหกสิบปี',
      'ทั้งอาณาจักรรู้จักพระองค์ในฐานะ==พระราชาที่ไม่เคยประทับตราราชโองการใดเลย ก่อนอ่านครบทุกบรรทัด==',
      'เหล่าขุนนางมักทูลถามว่าทำไมต้องช้าขนาดนั้น พระองค์จะยิ้มแล้วตรัสเสมอว่า'] },
    { need: 1, t: 'ตอนที่ 1 · ม้วนราชโองการพันม้วน', art: function () { var sc = function (x, y, r) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-22" y="-6" width="44" height="12" rx="2" fill="#fbf1d8" stroke="#4a2e05" stroke-width="1.6"/><rect x="-26" y="-7" width="6" height="14" rx="3" fill="#c9921f" stroke="#4a2e05" stroke-width="1.4"/><rect x="20" y="-7" width="6" height="14" rx="3" fill="#c9921f" stroke="#4a2e05" stroke-width="1.4"/></g>'; }; return '<svg viewBox="0 -6 120 72">' + sc(46, 52, -4) + sc(54, 38, 6) + sc(44, 24, -8) + sc(56, 10, 3) + '<g transform="translate(92 34)"><rect x="-6" y="-20" width="12" height="20" rx="3" fill="#7a4a22" stroke="#4a2e05" stroke-width="1.6"/><ellipse cx="0" cy="4" rx="13" ry="6" fill="#b3261e" stroke="#4a2e05" stroke-width="1.6"/><path d="M-5 4h10M0 0v8" stroke="#ffcf9a" stroke-width="1.4" opacity=".7"/></g><path d="M70 14l4-4M76 20l5-2" stroke="#e0a92c" stroke-width="1.6" stroke-linecap="round"/></svg>'; }, q: 'ความรีบ คือประตูที่คนเจ้าเล่ห์ชอบใช้', p: [
      'ทุกเช้าจะมี**ม้วนราชโองการนับพันม้วน**ส่งมาถึงท้องพระโรง ขุนนางคลังทูลเร่งว่า ==โปรดประทับตราเร็ว ๆ เถิด งานจะได้ไม่ค้าง==',
      'แต่ในม้วนภาษีม้วนหนึ่ง พระองค์อ่านเจอข้อความเล็กจิ๋วท้ายหน้า ที่ให้**ขุนนางคลังเก็บภาษีเพิ่มเป็นสองเท่าเข้ากระเป๋าตัวเอง**',
      'ถ้าวันนั้นพระองค์รีบ ราษฎรทั้งเมืองคงต้องจ่ายแพงไปอีกหลายปี พระองค์จึงจดบทเรียนไว้ในบันทึกส่วนพระองค์ว่า'] },
    { need: 1, t: 'ตอนที่ 2 · บททดสอบของผู้สืบทอด', art: function () { return '<svg viewBox="0 -8 120 72"><rect x="22" y="-2" width="62" height="62" rx="4" fill="#fbf6ea" stroke="#4a2e05" stroke-width="2"/><g stroke="#c9b48a" stroke-width="2.2" stroke-linecap="round"><path d="M30 10h46M30 18h40M30 26h44M30 34h36"/></g><path d="M30 50h22" stroke="#4a2e05" stroke-width="1" stroke-dasharray="1.4 1.6"/><circle cx="88" cy="44" r="13" fill="rgba(200,230,255,.35)" stroke="#c9921f" stroke-width="3"/><path d="M97 53l9 9" stroke="#7a4a22" stroke-width="4" stroke-linecap="round"/><g transform="translate(88 44)"><path d="M-5-1-6-6-2-3h4l4-3-1 5q1 5-5 5t-5-5z" fill="#f2a65a" stroke="#4a2e05" stroke-width=".9"/><circle cx="-2" cy="-.5" r=".7" fill="#4a2e05"/><circle cx="2" cy="-.5" r=".7" fill="#4a2e05"/></g></svg>'; }, q: 'ผู้ที่ใช่ ไม่ใช่คนที่เก่งที่สุด แต่คือคนที่ละเอียดที่สุด', p: [
      'เมื่อทรงชราลง พระราชาโอรันต้องหาผู้สืบทอดมงกุฎ จึงมอบ**สัญญาฉบับหนึ่ง**ให้ผู้สมัครทุกคนลงนาม',
      'ท้ายสัญญามีบรรทัดเล็ก ๆ เขียนไว้ว่า ==ผู้ลงนามยินยอมยกมงกุฎให้แมวส้มประจำวัง==',
      'ผู้สมัครทุกคนเซ็นทันทีโดยไม่อ่านถึงบรรทัดนั้น แมวส้มจึงได้มงกุฎไปถึงสิบสองใบ พระราชาส่ายพระพักตร์แล้วตรัสว่า'] },
    { need: 1, t: 'ตอนที่ 3 · ม้วนกระดาษน้อยในหอสมุด', art: function () { var m = mascot('happy', 80, ''); return '<svg viewBox="0 -4 120 70"><g fill="#3a2414"><rect x="6" y="2" width="44" height="60" rx="2"/></g><g>' + [10, 16, 21, 27, 33, 38, 43].map(function (x, i) { return '<rect x="' + x + '" y="' + (i % 2 ? 10 : 6) + '" width="' + (i % 3 ? 4.5 : 5.5) + '" height="' + (i % 2 ? 22 : 26) + '" fill="' + ['#8e1328', '#2f5f9e', '#c9921f', '#1f6a4a'][i % 4] + '"/>'; }).join('') + [10, 15, 21, 26, 32, 38, 44].map(function (x, i) { return '<rect x="' + x + '" y="' + (i % 2 ? 40 : 36) + '" width="4.5" height="' + (i % 2 ? 20 : 24) + '" fill="' + ['#1f6a4a', '#c9921f', '#8e1328', '#2f5f9e'][i % 4] + '"/>'; }).join('') + '</g><rect x="4" y="32" width="48" height="3" fill="#7a4a22"/>' + (m.indexOf('<svg') === 0 ? m.replace(/^<svg[^>]*>/, '<svg x="56" y="-4" width="60" height="70" viewBox="0 0 120 140">') : '') + '</svg>'; }, q: 'ทุกคำถามที่กล้าถาม คือเกราะที่มองไม่เห็น', p: [
      'วันหนึ่งพระราชาได้ยินว่า ในหอสมุดเก่ามี**ม้วนกระดาษน้อยตัวหนึ่ง**ที่อ่านทุกบรรทัด ขีดไฮไลต์จุดสำคัญ และจดคำถามไว้เสมอ',
      'พระองค์ปลอมตัวเป็นบรรณารักษ์ แล้วยื่นสัญญาฉบับเดิมให้ **เวลลัม**อ่านจนถึงบรรทัดสุดท้าย แล้ว==หัวเราะคิกคักพร้อมวงปากกาไฮไลต์รอบข้อเรื่องแมวส้ม==',
      'เวลลัมเขียนคำถามไว้ข้างกระดาษว่า ข้อนี้หมายความว่าอย่างไร ขอแก้ได้ไหม พระราชายิ้มกว้างที่สุดในรอบหกสิบปี เพราะ'] },
    { need: 1, t: 'ตอนที่ 4 · พิธีสวมมงกุฎ', art: function () { var m = mascot('happy', 100, ''); return m.indexOf('</svg>') > 0 ? m.replace(/<\/svg>\s*$/, '<g class="vm-outfit">' + ART_OUT.crown.art + '</g></svg>') : m; }, q: 'อ่านทุกบรรทัด ก่อนประทับตราเสมอ', p: [
      'ในท้องพระโรงที่เต็มไปด้วยกลีบกุหลาบ พระราชาโอรันค่อย ๆ ==สวมมงกุฎลงบนหัวม้วนของเวลลัม== ด้วยพระหัตถ์ของพระองค์เอง',
      'พระองค์กระซิบความลับของมงกุฎว่า มันไม่ได้ทำให้ใครเป็นพระราชา แต่มัน**จะหนักขึ้นทุกครั้งที่เราลงนามโดยไม่อ่าน** และเบาลงทุกครั้งที่เราอ่านจนจบ',
      'นับจากวันนั้น มงกุฎบนหัวเวลลัมไม่เคยหนักเลยสักวัน และนี่คือราชโองการแรกของพระราชาองค์ใหม่'] }
  ];
  var GEM = function (c1, c2, d) { return '<path d="' + d + '" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1.2" stroke-linejoin="round"/>'; };
  var LIC_R = [
    GEM('#ff3456', '#7a0418', 'M12 3 19 8.5 16.5 19h-9L5 8.5z') + '<path d="M9 8l3-2.5L15 8" stroke="#ffd0d8" stroke-width="1" fill="none"/>',
    GEM('#3a7bff', '#0a1f6a', 'M12 2 20 12 12 22 4 12z') + '<path d="M8 10l4-4" stroke="#d6ecff" stroke-width="1.2" fill="none"/>',
    GEM('#22b874', '#05502e', 'M8 3h8l4 4v10l-4 4H8l-4-4V7z') + '<path d="M8 7h4" stroke="#d4ffe8" stroke-width="1.2"/>',
    GEM('#eaf6ff', '#4a6a8a', 'M5 9 8 4h8l3 5-7 11z') + '<path d="M5 9h14M8 4l4 16M16 4l-4 16" stroke="#9ec9ff" stroke-width=".8" fill="none"/>',
    GEM('#f4c542', '#7a4d08', 'M4 17 3 7l5 4 4-7 4 7 5-4-1 10z') + '<rect x="4" y="16.5" width="16" height="3.5" rx="1" fill="#e0a92c" stroke="#7a4d08" stroke-width="1"/><circle cx="12" cy="18.2" r="1.1" fill="#ff3456"/>'
  ];
  var SEAL_R = '<svg class="vlr-seal vlr-seal-r" viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="srW" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e2324e"/><stop offset=".6" stop-color="#9e0f2a"/><stop offset="1" stop-color="#5a0414"/></radialGradient></defs>' +
    '<path d="M32 4C40 3 44 8 50 9S60 16 60 24 63 36 58 42 52 56 44 58 36 62 28 60 14 58 9 50 2 40 5 30 6 14 14 9 24 5 32 4Z" fill="url(#srW)" stroke="#4a0410" stroke-width="1.5"/><circle cx="32" cy="32" r="19" fill="none" stroke="#ff8a9c" stroke-width="1.4" opacity=".6"/><circle cx="32" cy="32" r="16" fill="none" stroke="#5a0414" stroke-width="1"/>' +
    '<g transform="translate(32 33)"><path d="M-12 6-14-7-7-1-3-9 0-14 3-9 7-1 14-7 12 6z" fill="#ffd36a" stroke="#6a3a08" stroke-width="1" stroke-linejoin="round"/><rect x="-12" y="5" width="24" height="5" rx="1.4" fill="#e0a92c" stroke="#6a3a08" stroke-width="1"/></g><path d="M18 18q4-5 10-6" stroke="#ffb3c0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/></svg>';
  function hasCrown() { return ownedOutfits().indexOf('crown') >= 0; }
  function crownLoreBtn() {
    var seen = -1; try { seen = +(localStorage.getItem('vc_lore_seen_r') || -1); } catch (e) {}
    var last = hasCrown() ? LORE_R.length - 1 : 0;
    return '<span class="vof-lore-w is-crown" role="button" tabindex="0" data-lore="crown" aria-label="อ่านตำนานมงกุฎตำนาน' + (last > seen ? ' มีตอนใหม่' : '') + '">📜' + (last > seen ? '<i class="lore-new"></i>' : '') + '</span>';
  }
  function hasWizard() { return ownedOutfits().indexOf('wizard') >= 0; }
  function wizardLoreBtn() {
    var seen = -1; try { seen = +(localStorage.getItem('vc_lore_seen_w') || -1); } catch (e) {}
    var last = hasWizard() ? LORE_W.length - 1 : 0;
    return '<span class="vof-lore-w" role="button" tabindex="0" data-lore="wizard" aria-label="อ่านตำนานหมวกนักเวท' + (last > seen ? ' มีตอนใหม่' : '') + '">📜' + (last > seen ? '<i class="lore-new"></i>' : '') + '</span>';
  }
  function curLore() { return lrSet === 'l' ? LORE_L : lrSet === 'w' ? LORE_W : lrSet === 'c' ? LORE_C : lrSet === 'r' ? LORE_R : LORE; }
  function okLore(c) { return lrSet === 'r' ? (c.need === 0 || hasCrown()) : lrSet === 'c' ? (c.need === 0 || hasCap()) : lrSet === 'w' ? (c.need === 0 || hasWizard()) : lrSet === 'l' ? (c.need === 0 || (S && (S.totalDays || 0) >= c.need)) : loreOk(c); }
  function seenLore() { try { return +(localStorage.getItem(lrSet === 'l' ? 'vc_lore_seen_l' : lrSet === 'w' ? 'vc_lore_seen_w' : lrSet === 'c' ? 'vc_lore_seen_c' : lrSet === 'r' ? 'vc_lore_seen_r' : 'vc_lore_seen') || -1); } catch (e) { return -1; } }
  function laurelLoreBtn() {
    var tot = S && S.totalDays || 0, last = -1, seen = -1; LORE_L.forEach(function (x, k) { if (x.need === 0 || tot >= x.need) last = k; });
    try { seen = +(localStorage.getItem('vc_lore_seen_l') || -1); } catch (e) {}
    return '<span class="vof-act lrc-lore" role="button" tabindex="0" data-lore="laurel" aria-label="อ่านตำนานมาลัย' + (last > seen ? ' มีตอนใหม่' : '') + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + LIC_L[0] + '</svg>ตำนาน' + (last > seen ? '<i class="lore-new"></i>' : '') + '</span>';
  }
  function loreOpen(i, set) {
    lrSet = set === 'laurel' ? 'l' : set === 'wizard' ? 'w' : set === 'cap' ? 'c' : set === 'crown' ? 'r' : 'm';
    if (!lr) {
      lr = document.createElement('div'); lr.className = 'vlr'; lr.setAttribute('role', 'dialog'); lr.setAttribute('aria-modal', 'true'); lr.setAttribute('aria-labelledby', 'vlrT');
      lr.innerHTML = '<div class="vlr-bg" data-lx></div><div class="vlr-p"><i class="vlr-rod"></i><i class="vlr-glow" aria-hidden="true"></i><i class="vlr-frame" aria-hidden="true"><b></b><b></b><b></b><b></b></i><div class="vlr-sh"><button type="button" class="vlr-x" data-lx aria-label="ปิด">✕</button>' +
        '<p class="vlr-k">ตำนานแห่ง</p><h3 id="vlrT"></h3><div class="vlr-tabs" role="tablist"></div><div class="vlr-body"></div></div><i class="vlr-rod b"></i></div>';
      document.body.appendChild(lr);
      lr.addEventListener('click', function (e) {
        if (e.target.closest('[data-lx]')) { loreClose(); return; }
        var t = e.target.closest('[data-ch]'); if (t) { lrIdx = +t.getAttribute('data-ch'); loreRender(); }
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lr && lr.classList.contains('on')) loreClose(); });
    }
    lr.classList.toggle('is-laurel', lrSet === 'l' || lrSet === 'w' || lrSet === 'c' || lrSet === 'r'); lr.classList.toggle('is-crown', lrSet === 'r'); lr.classList.toggle('is-wizard', lrSet === 'w'); lr.classList.toggle('is-cap', lrSet === 'c'); lr.querySelector('#vlrT').textContent = lrSet === 'l' ? 'มาลัยตำนาน' : lrSet === 'w' ? 'หมวกนักเวท' : lrSet === 'c' ? 'หมวกนอนดาว' : lrSet === 'r' ? 'มงกุฎตำนาน' : 'เหรียญไฟไม่มอด';
    var LL = curLore();
    if (typeof i !== 'number') { lrIdx = 0; for (var k = LL.length - 1; k >= 0; k--) if (okLore(LL[k])) { lrIdx = k; break; } } else lrIdx = i;
    lr.hidden = false; requestAnimationFrame(function () { lr.classList.add('on'); }); loreRender();
  }
  function loreClose() { if (!lr) return; lr.classList.remove('on'); setTimeout(function () { if (!lr.classList.contains('on')) lr.hidden = true; }, 400); }
  function loreRender() {
    var LL = curLore(), RR = lrSet === 'r', C = lrSet === 'c', W = lrSet === 'w', L = lrSet === 'l' || W || C || RR, c = LL[lrIdx], ok = okLore(c), m = MED[L ? 3 : c.tier];
    if (ok && lrIdx > seenLore()) { try { localStorage.setItem(RR ? 'vc_lore_seen_r' : C ? 'vc_lore_seen_c' : W ? 'vc_lore_seen_w' : L ? 'vc_lore_seen_l' : 'vc_lore_seen', lrIdx); } catch (e) {} if (sh && !sh.hidden) shopRender(); }
    if (!L) { lr.style.setProperty('--f1', m.f1); lr.style.setProperty('--f2', m.f2); }
    var lastOk = 0; LL.forEach(function (x, n) { if (okLore(x)) lastOk = n; });
    var tb = lr.querySelector('.vlr-tabs'); tb.style.setProperty('--lf', (lastOk / (LL.length - 1) * 100) + '%');
    var IC = RR ? LIC_R : C ? LIC_C : W ? LIC_W : L ? LIC_L : LIC;
    tb.innerHTML = '<i class="vlr-path"><b></b></i>' + LL.map(function (x, n) {
      return '<button type="button" role="tab" data-ch="' + n + '" aria-selected="' + (n === lrIdx) + '" aria-label="' + h(x.t) + (okLore(x) ? '' : ' (ล็อก)') + '" class="' + (n === lrIdx ? 'on' : '') + (okLore(x) ? '' : ' lk') + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>' + (okLore(x) ? '' : '<i class="lkb"></i>') + '</button>';
    }).join('');
    var tot = S && S.totalDays || 0, best = S && S.bestStreak || 0;
    lr.querySelector('.vlr-body').innerHTML = (L ? '<div class="vlr-art vlr-art-l" aria-hidden="true">' + c.art() + '</div>' : '<div class="vlr-art" aria-hidden="true"><svg viewBox="36 66 48 54">' + medalArt(c.tier) + '</svg></div>') +
      '<h4>' + h(c.t) + '</h4>' +
      (L ? c.p.map(function (t, n) { return '<p class="lp' + (!ok && n > 0 ? ' blur' : '') + '" style="--d:' + (n * .3 + .25).toFixed(2) + 's">' + lFmt(t, n * .3 + .7) + '</p>'; }).join('') + (c.q ? '<blockquote class="lq' + (ok ? '' : ' blur') + '" style="--d:' + (c.p.length * .3 + .3).toFixed(2) + 's"><i class="lq-o">“</i>' + h(c.q) + '<i class="lq-c">”</i></blockquote>' : '')
        : c.p.map(function (t, n) { return '<p class="' + (n === 0 ? 'first ' : '') + (!ok && n > 0 ? 'blur' : '') + '" style="--d:' + (n * .35 + .3) + 's">' + (n === 0 ? dropCap(t) : h(t)) + '</p>'; }).join('')) +
      (ok ? '<div class="vlr-end">' + (RR ? SEAL_R : L ? SEAL_L : SEAL) + '</div>' : RR ? '<div class="vlr-lock">🔒 อ่านต่อได้เมื่อมีมงกุฎตำนาน<small>ราคา ' + fmt((itemById('crown') || {}).price || 1000) + ' แต้ม · ตอนนี้มี ' + fmt(S && S.points || 0) + ' แต้ม</small></div>' : C ? '<div class="vlr-lock">🔒 อ่านต่อได้เมื่อมีหมวกนอนดาว<small>ราคา ' + fmt((itemById('cap') || {}).price || 300) + ' แต้ม · ตอนนี้มี ' + fmt(S && S.points || 0) + ' แต้ม</small></div>' : W ? '<div class="vlr-lock">🔒 อ่านต่อได้เมื่อมีหมวกนักเวท<small>ราคา ' + fmt((itemById('wizard') || {}).price || 400) + ' แต้ม · ตอนนี้มี ' + fmt(S && S.points || 0) + ' แต้ม</small></div>' : L ? '<div class="vlr-lock">🔒 ปลดล็อกเมื่อเช็กอินรวมครบ ' + c.need + ' วัน<small>ตอนนี้เช็กอินรวม ' + tot + ' วัน · อีก ' + Math.max(0, c.need - tot) + ' วัน</small></div>' : '<div class="vlr-lock">🔒 ปลดล็อกเมื่อเช็กอินติดกันครบ ' + c.need + ' วัน<small>สถิติสูงสุดของคุณ ' + best + ' วัน</small></div>');
    lr.querySelector('.vlr-body').scrollTop = 0;
  }
  /* ลื่นขึ้น: หยุดอนิเมชันของการ์ด/ฉากที่อยู่นอกจอ (มองไม่เห็นอยู่แล้ว หน้าตาไม่เปลี่ยน) */
  var offIO = null;
  function watchOff() {
    if (!('IntersectionObserver' in window) || !sh) return;
    if (!offIO) offIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); }); }, { rootMargin: '120px 0px' });
    else offIO.disconnect();
    sh.querySelectorAll('.vof-b, .vst-stage').forEach(function (n) { offIO.observe(n); });
  }
  function shopRender() {
    if (!sh || sh.hidden || !S) return;
    var list = shopItems(), own = ownedOutfits(), worn = wornOutfits(), bmap = {};
    (S.badges || []).forEach(function (b) { bmap[b.id] = b; });
    sh.querySelector('[data-spts]').textContent = fmt(S.points);
    var mh = dressed('wave', 220); sh.querySelector('.vst-ms').innerHTML = mh;
    var fireOn = sel === 'medal' || (!sel && wornOutfits().indexOf('medal') >= 0);
    sh.classList.toggle('is-fire', fireOn);
    sh.querySelector('.vst-refl').innerHTML = fireOn ? mh : '';
    var mc = MED[medalTier()] || MED[1]; sh.style.setProperty('--f1', mc.f1); sh.style.setProperty('--f2', mc.f2);
    sh.setAttribute('data-tier', medalTier());
    fireScene(fireOn, sel === 'medal');
    var hvOn = !fireOn && (sel === 'laurel' || (!sel && wornOutfits().indexOf('laurel') >= 0));
    heavScene(hvOn);
    var thOn = !fireOn && !hvOn && (sel === 'crown' || (!sel && wornOutfits().indexOf('crown') >= 0));
    throneScene(thOn);
    var wzOn = !fireOn && !hvOn && !thOn && (sel === 'wizard' || (!sel && wornOutfits().indexOf('wizard') >= 0));
    wizScene(wzOn);
    dreamScene(!fireOn && !hvOn && !thOn && !wzOn && (sel === 'cap' || (!sel && wornOutfits().indexOf('cap') >= 0)));
    ['.vst-heav', '.vst-thr', '.vst-wzs', '.vst-drm', '.vst-lib'].forEach(function (q) { var r = sh.querySelector(q); if (r && r.firstChild) splitScene(r); }); var lbr = sh.querySelector('.vst-lib'); if (lbr) requestAnimationFrame(function () { libBreath(lbr); }); var pd = sh.querySelector('.vst-pd3'); if (pd) requestAnimationFrame(function () { splitSvg(pd); });
    var hk = sel === 'medal' ? 'm' + medalTier() : '';
    if (hk && !heroPlayed) setTimeout(function () { playHero(medalTier()); }, 30);
    else if (hk && heroKey && hk !== heroKey && !calm()) { var stg = sh.querySelector('.vst-stage'); stg.classList.remove('tier-flash'); void stg.offsetWidth; stg.classList.add('tier-flash'); }
    if (!hk) { heroT.forEach(clearTimeout); var he = sh.querySelector('.vst-hero'); he.className = 'vst-hero'; if (he.getAnimations) he.getAnimations().forEach(function (x) { x.cancel(); }); he.innerHTML = ''; sh.querySelector('.vst-ms').classList.remove('hide-medal'); }
    /* กวาดของค้าง: แสง/ฉากเปิดตัวที่ไม่ได้เล่นอยู่ จะไม่ค้างทับตัวน้อง */
    [['.vli', lrEnd], ['.vci', crEnd], ['.vwz', wzEnd || cpEnd]].forEach(function (q) { if (!q[1]) sh.querySelectorAll('.vst-stage > ' + q[0]).forEach(function (n) { n.remove(); }); });
    sh.querySelectorAll('.vst-stage > .vst-clasp').forEach(function (n) { if (!n._t) { n._t = 1; setTimeout(function () { n.remove(); }, 900); } });
    if (!sh.classList.contains('lr-intro') && !sh.classList.contains('cr-intro') && !sh.classList.contains('wz-intro')) { var msx = sh.querySelector('.vst-ms'); msx.classList.remove('hide-laurel', 'hide-crown', 'hide-wizard', 'cp-hide', 'cp-nohat'); }
    heroKey = hk;
    if (sel === 'laurel' && !lrPlayed && !calm()) sh.classList.add('lr-intro');
    if (sel === 'laurel' && !lrPlayed) setTimeout(playLaurel, 30); else if (sel !== 'laurel') lrStop();
    if (sel === 'crown' && !crPlayed && !calm()) sh.classList.add('cr-intro');
    if (sel === 'crown' && !crPlayed) setTimeout(playCrown, 30); else if (sel !== 'crown') crStop();
    if (sel === 'wizard' && !wzPlayed) setTimeout(playWizard, 30); else if (sel !== 'wizard') wzStop();
    if (sel === 'cap' && !cpPlayed) setTimeout(playCap, 30); else if (sel !== 'cap') cpStop();
    var o = itemById(sel), say2 = sh.querySelector('.vst-say');
    var bb = o && o.badge && bmap[o.badge], lft = bb ? bb.n - bb.have : 0;
    sayType(say2, !o ? 'อยากให้ฉันใส่อะไรดี? แตะของด้านล่างเลย ✨'
      : o.id === 'laurel' ? lrSay(ownedOutfits().indexOf('laurel') >= 0, lft)
      : own.indexOf(o.id) >= 0 ? (worn.indexOf(o.id) >= 0 ? 'ใส่อยู่นะ เข้ากับฉันไหม? 😊' : 'ของเราเองนี่นา ใส่เลยไหม? 💛')
      : o.id === 'medal' ? 'รู้ไหม เหรียญนี้มีตำนานนะ… กด 📜 อ่านดูสิ! อีก ' + lft + ' วันก็ได้แล้ว 🔥'
      : o.badge ? (bb && bb.n - bb.have <= 3 ? 'อีกแค่ ' + lft + ' วันเอง! เช็กอินต่อนะ 🔥' : 'สู้ ๆ อีก ' + lft + ' วันได้แน่! 🔥')
      : (S.points >= o.price ? 'ลองใส่อยู่! ชอบไหม? ✨' : 'อีกนิดเดียวก็ซื้อได้แล้ว 💪'));
    sh.querySelector('.vst-tabs').innerHTML = TABS.map(function (t) {
      var n = t[0] === 'all' ? list.length : list.filter(function (x) { return x.slot === t[0]; }).length;
      return n ? '<button type="button" role="tab" aria-selected="' + (shTab === t[0]) + '" class="' + (shTab === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>' : '';
    }).join('');
    var show = list.filter(function (x) { return shTab === 'all' || x.slot === shTab; }).sort(function (a, b) { return (b.rarity === 'limited') - (a.rarity === 'limited'); });
    sh.querySelector('.vst-grid').innerHTML = show.map(function (it) {
      if (it.rarity === 'limited') return limitedCard(it, own.indexOf(it.id) >= 0, worn.indexOf(it.id) >= 0 && tryOn !== it.id, bmap[it.badge]);
      var has = own.indexOf(it.id) >= 0, on = worn.indexOf(it.id) >= 0 && tryOn !== it.id, a = ART_OUT[it.id], bd = it.badge && bmap[it.badge];
      var tag = has ? '<span class="vof-act' + (on ? ' is-on' : '') + '">' + (on ? 'ใส่อยู่ ✓' : 'มีแล้ว') + '</span>'
        : it.id === 'laurel' ? laurelLoreBtn()
        : it.badge ? '<span class="vof-act is-badge">🏅 รางวัล</span>'
        : '<span class="vof-act is-buy' + (S.points < it.price ? ' is-short' : '') + '"><i class="vof-coin"></i>' + fmt(it.price) + '</span>';
      return '<button type="button" class="vof-b r-' + it.rarity + (it.id === 'laurel' ? ' is-laurel' : it.id === 'crown' ? ' is-crown' : '') + (it.id === 'medal' ? ' is-fire mt-' + medalTier() : '') + (has ? ' is-own' : ' is-lock' + (it.badge ? ' is-badge-item' : '')) + (on ? ' is-on' : '') + (sel === it.id ? ' is-try' : '') + '" data-outfit="' + it.id + '" aria-pressed="' + (sel === it.id) + '" aria-label="' + h(it.name + ' · ' + (RAR[it.rarity] || '')) + '">' +
        (it.id === 'laurel' ? LRC_TAG + LRC_DUST : it.id === 'crown' ? CRC_TAG : '<em class="vof-r">' + (RAR[it.rarity] || '') + '</em>') + (!has && bd && it.id === 'laurel' ? lrCard(bd, a) : !has && bd ? '<span class="vof-pr" style="--bp:' + Math.round(bd.have / bd.n * 100) + '%"><svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(it.id) + '</svg><i class="vof-spark"></i><b>' + bd.have + '/' + bd.n + '</b></span>' : '<svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(it.id) + '</svg>') + '<small>' + h(it.name) + '</small>' + tag + (has && it.id === 'laurel' ? laurelLoreBtn() : '') + (it.id === 'wizard' ? wizardLoreBtn() : it.id === 'cap' ? capLoreBtn() : it.id === 'crown' ? crownLoreBtn() : '') + '</button>';
    }).join('');
    watchOff();
    var bar = sh.querySelector('.vst-bar');
    if (!o) { bar.innerHTML = '<p class="vst-hint">แตะของเพื่อลองใส่ · ' + own.length + '/' + list.length + ' ชิ้นที่มีแล้ว · ได้แต้มจากเช็กอินทุกวัน</p>'; return; }
    bar.className = 'vst-bar' + (o.id === 'medal' ? ' is-med mt-' + medalTier() : '');
    var head = '<span class="vst-it r-' + o.rarity + '"><em>' + (RAR[o.rarity] || '') + (o.id === 'medal' ? ' · ระดับ' + MED[medalTier()].name + (pvTier ? ' (ตัวอย่าง)' : '') : '') + '</em><b>' + h(o.name) + '</b></span>';
    if (own.indexOf(o.id) >= 0) bar.innerHTML = head + '<button type="button" class="vst-btn ' + (worn.indexOf(o.id) >= 0 ? 'is-off' : '') + '" data-act="wear">' + (worn.indexOf(o.id) >= 0 ? 'ถอดออก' : 'ใส่ชิ้นนี้') + '</button>';
    else if (o.id === 'medal' && bmap[o.badge]) { var bm = bmap[o.badge], C = 2 * Math.PI * 15, pr = Math.min(1, bm.have / bm.n);
      bar.innerHTML = '<span class="vst-mic" aria-hidden="true"><svg viewBox="47 84 26 26">' + medalArt(medalTier()).replace(/<g class="md-burst"[\s\S]*?<\/g>/, '') + '</svg></span>' + head +
        '<span class="vst-need is-med" aria-label="' + h(bm.desc) + ' ' + bm.have + ' จาก ' + bm.n + '"><span class="mr-t"><small>เช็กอินติดกัน ' + bm.n + ' วัน</small><b>' + (bm.have >= bm.n ? 'ครบแล้ว!' : 'อีก ' + (bm.n - bm.have) + ' วัน') + '</b></span>' +
        '<svg class="mr-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="bg"/><circle cx="18" cy="18" r="15" class="fg" style="stroke-dasharray:' + (C * pr).toFixed(1) + ' ' + C.toFixed(1) + '"/><text x="18" y="21.5">' + bm.have + '/' + bm.n + '</text></svg></span>'; }
    else if (o.badge) { var b = bmap[o.badge]; bar.innerHTML = head + '<span class="vst-need">🏅 ' + h(b ? b.desc : 'เหรียญตรา') + (b ? ' · ' + b.have + '/' + b.n : '') + '</span>'; }
    else if (S.points >= o.price) bar.innerHTML = head + '<button type="button" class="vst-btn is-buy" data-act="buy"><i class="vof-coin"></i>ซื้อ ' + fmt(o.price) + ' แต้ม</button>';
    else bar.innerHTML = head + '<span class="vst-need">ขาดอีก ' + fmt(o.price - S.points) + ' แต้ม</span>';
  }
  function buy(id) {
    var o = itemById(id); if (!o || busy || !S) return;
    if (S.stale) { say('กำลังเชื่อมต่อเซิร์ฟเวอร์ รอสักครู่นะ'); return; }
    if (S.points < o.price) { say('แต้มยังไม่พอ ขาดอีก ' + fmt(o.price - S.points) + ' แต้ม'); return; }
    busy = true; var btn = sh && sh.querySelector('[data-act="buy"]'); if (btn) { btn.disabled = true; btn.textContent = 'กำลังซื้อ…'; }
    fetch('/api/daily/buy', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item: id }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        busy = false;
        if (!x.ok) { say(x.d.error || 'ซื้อไม่สำเร็จ'); if (x.d && x.d.week) apply(x.d); else shopRender(); return; }
        var before = S.points; tryOn = null; wear(id); apply(x.d);
        var pt = sh && sh.querySelector('[data-spts]'); if (pt && !calm()) { pt.textContent = fmt(before); rollNum(pt, before, x.d.points); }
        var ms = sh && sh.querySelector('.vst-ms'); hop(ms);
        if (sh && !calm()) { var fx = document.createElement('i'); fx.className = 'vst-fx'; sh.querySelector('.vst-stage').appendChild(fx); setTimeout(function () { fx.remove(); }, 1200); }
        var card = sh && sh.querySelector('.vof-b[data-outfit="' + id + '"]'); if (card) card.classList.add('is-new');
        say('🎉 ได้ ' + o.name + ' แล้ว! ใส่ให้น้องเรียบร้อย');
        if (id === 'wizard') setTimeout(function () { playWizard(true); }, 250);
        if (id === 'cap') setTimeout(function () { playCap(true); }, 250);
      }, function () { busy = false; shopRender(); say('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง'); });
  }
  function render() {
    if (!box || !S) return;
    var r = S.redeem, pct = Math.min(100, Math.round(S.points / r.cost * 100)), done = S.week.filter(function (x) { return x.done; }).length;
    // อีกกี่วันถึงกล่องสมบัติ (วันที่ 7)
    var toChest = S.checkedToday ? 7 - done : 6 - done;
    var hint = S.week[6].done ? 'ครบรอบ 7 วันแล้ว! พรุ่งนี้เริ่มรอบใหม่' : S.week[6].today ? 'วันนี้เปิดกล่องสมบัติได้!' : '';
    var need = r.cost - S.points;
    var redeemRow = r.canRedeem
      ? '<button type="button" class="vdg-redeem">แลกตรวจฟรี 1 ครั้ง</button>'
      : '<span class="vdg-need">' + (r.usedThisMonth >= r.perMonth ? 'เดือนนี้แลกครบ ' + r.perMonth + ' ครั้งแล้ว' : 'อีก <b>' + fmt(need) + '</b> แต้ม แลกตรวจฟรี 1 ครั้ง') + '</span>';
    box.querySelector('.vdg-body').innerHTML =
      '<div class="vdg-sum">' +
        '<div class="vdg-fire vf-t' + flameTier(S.streak) + (S.streak ? '' : ' is-zero') + '"><span class="vf">' + FLAME + '</span><b>' + S.streak + '</b><span>' + (S.streak ? 'วันติด' : 'เริ่มวันแรก') + '</span></div>' +
        '<div class="vdg-wallet"><div class="vdg-wl"><svg class="vdg-coin" viewBox="0 0 64 64" aria-hidden="true">' + COIN(32, 30, 22) + '</svg><b data-pts>' + fmt(S.points) + '</b><span>/ ' + fmt(r.cost) + ' แต้ม</span></div>' +
          '<div class="vdg-bar" role="progressbar" aria-label="แต้มสะสมสู่การแลกตรวจฟรี" aria-valuemin="0" aria-valuemax="' + r.cost + '" aria-valuenow="' + Math.min(S.points, r.cost) + '"><i style="width:' + pct + '%"></i>' + [1, 2].map(function (k) { var v = Math.round(r.cost * k / 3); return '<s class="' + (S.points >= v ? 'on' : '') + '" style="left:' + (k * 100 / 3).toFixed(2) + '%"><em>' + fmt(v) + '</em></s>'; }).join('') + '<s class="end' + (S.points >= r.cost ? ' on' : '') + '" style="left:100%"><em>ตรวจฟรี</em></s></div>' +
          redeemRow + '</div>' +
      '</div>' +
      '<div class="vdg-grid">' + S.week.map(cardHtml).join('') + '</div>' +
      (hint ? '<p class="vdg-hint">' + hint + '</p>' : '') +
      badgesHtml() + shopPromo() +
      '<details class="vdg-rules"><summary>กติกา</summary><ul><li>รับได้วันละ 1 ครั้ง ขึ้นวันใหม่ตอนเที่ยงคืน (เวลาไทย)</li><li>ขาดวันไหน เริ่มวันที่ 1 ใหม่ แต่แต้มที่สะสมไว้ไม่หาย</li><li>' + fmt(r.cost) + ' แต้ม แลกตรวจสัญญาฟรีได้ 1 ครั้ง · เดือนละไม่เกิน ' + r.perMonth + ' ครั้ง (ใช้แล้ว ' + r.usedThisMonth + ')</li></ul></details>';
    var sub = box.querySelector('.vdg-sub'), foot = box.querySelector('.vdg-foot'), md = mood();
    var ms = box.querySelector('.vdg-mascot');
    var mk = md + '|' + wornOutfits().join(',');
    if (ms.getAttribute('data-m') !== mk) { ms.setAttribute('data-m', mk); ms.innerHTML = dressed(md, 260); }
    box.setAttribute('data-sky', md === 'sleep' ? 'night' : 'day');
    box.querySelector('.vdg-say').textContent = line(md);
    sub.className = 'vdg-sub' + (S.checkedToday ? ' is-wait' : '');
    sub.innerHTML = S.checkedToday
      ? '<span><i aria-hidden="true">⏱</i>รอบถัดไปใน ' + flipHtml(msToMidnight()) + '</span>'
      : '<span><i aria-hidden="true">+</i>วันที่ ' + (done + 1) + ' · รับได้ <b>' + S.todayReward + ' แต้ม</b></span>';
    foot.innerHTML = S.checkedToday
      ? '<div class="vdg-rest" role="status"><span class="vdg-moon" aria-hidden="true" style="--dp:' + (100 - msToMidnight() / 864e3).toFixed(1) + '%"><svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" fill="currentColor"/></svg></span>' +
        '<span class="vdg-rtx"><b>รับครบแล้ว พักก่อนนะ</b><small>กลับมาตอนเที่ยงคืน รับ <em>+' + S.tomorrowReward + ' แต้ม</em></small></span>' +
        '<span class="vdg-rcd">' + flipHtml(msToMidnight(), true) + '</span></div>'
      : '<button type="button" class="vdg-claim"><span>รับ +' + S.todayReward + ' แต้ม</span></button>';
    startTick();
  }
  function build() {
    box = document.createElement('div'); box.className = 'vdc'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'vdcT');
    box.innerHTML = DEFS + '<div class="vdc-bg" data-x></div><div class="vdg-frame"><div class="vdc-grip" aria-hidden="true"></div>' +
      '<button type="button" class="vdg-x" data-x aria-label="ปิด">✕</button>' +
      '<div class="vdg-sky" aria-hidden="true"><i class="sk-stars"></i><i class="sk-stars sk-b"></i><i class="sk-moon"></i><i class="sk-sun"></i><b class="sk-z">z</b><b class="sk-z sk-z2">z</b><b class="sk-z sk-z3">Z</b></div>' +
      '<div class="vdg-hd"><div class="vdg-hdt"><h3 id="vdcT"><span>ล็อกอิน</span><span>รายวัน</span><em>ฟรี!</em></h3><p class="vdg-say"></p></div><span class="vdg-mascot" aria-hidden="true"></span></div>' +
      '<div class="vdg-stage"><p class="vdg-sub"></p><div class="vdg-body"><p class="vdc-wait">กำลังโหลด…</p></div><div class="vdg-foot"></div></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target.closest('.vdg-retry')) { box.querySelector('.vdg-body').innerHTML = '<p class="vdc-wait">กำลังโหลด…</p>'; load(); return; }
      if (e.target.closest('[data-x]')) { close(); return; }
      if (e.target.closest('.vdg-c.is-open, .vdg-claim:not([disabled])')) { checkin(); return; }
      if (e.target.closest('.vdg-redeem')) { redeem(); return; }
      var bg = e.target.closest('[data-badge]');
      if (bg && S && S.badges) { var b = S.badges.filter(function (x) { return x.id === bg.getAttribute('data-badge'); })[0]; if (b) say((b.earned ? '🏅 ' : '🔒 ') + b.name + ' · ' + b.desc + (b.earned ? '' : ' (' + b.have + '/' + b.n + ')')); return; }
      if (e.target.closest('[data-shop]')) { shopOpen(); return; }
      if (e.target.closest('.vdg-mascot')) poke();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && !box.hidden) close(); });
  }
  var lastFocus = null;
  function open() {
    if (!user()) { if (window.VCAuthGate) window.VCAuthGate.open(); else say('เข้าสู่ระบบก่อนนะครับ'); return; }
    if (!box) build();
    lastFocus = document.activeElement;
    box.hidden = false; document.documentElement.classList.add('vdc-open');
    if (S) render();
    load();
    setTimeout(function () { var x = box.querySelector('.vdg-claim:not([disabled])') || box.querySelector('.vdg-x'); if (x) x.focus({ preventScroll: true }); }, 40);
  }
  function close() {
    if (!box) return; clearTimeout(retryT); box.hidden = true; document.documentElement.classList.remove('vdc-open'); stopTick();
    if (justClaimed) { justClaimed = null; menu(); }   // เปิดครั้งหน้าเป็นท่าหลับรอพรุ่งนี้
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- ฉลองตอนรับรางวัล: เหรียญบินจากการ์ดเข้ากระเป๋า แล้วตัวเลขนับขึ้น ---------- */
  var calm = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  /* (4) ตัวเลขหมุนแบบสล็อต: ทุกหลักหมุนจากค่าเดิมไปค่าใหม่ หลักขวาหมุนนานกว่า */
  function rollNum(el, from, to) {
    var a = fmt(to), b = fmt(from); while (b.length < a.length) b = ' ' + b;
    el.classList.add('vrl'); el.setAttribute('aria-label', a);
    el.innerHTML = a.split('').map(function (ch, i) {
      if (!/\d/.test(ch)) return '<span class="vrl-x">' + ch + '</span>';
      var st = ''; for (var k = 0; k < 20; k++) st += '<i>' + (k % 10) + '</i>';
      return '<span class="vrl-c"><span class="vrl-s" data-f="' + (/\d/.test(b[i]) ? b[i] : 0) + '" data-t="' + ch + '">' + st + '</span></span>';
    }).join('');
    var cols = el.querySelectorAll('.vrl-s'), n = cols.length;
    [].forEach.call(cols, function (c) { c.style.transform = 'translateY(' + (-c.getAttribute('data-f') * 5) + '%)'; });
    void el.offsetWidth;
    [].forEach.call(cols, function (c, i) {
      var f = +c.getAttribute('data-f'), t = +c.getAttribute('data-t'), steps = t + 10 - (t >= f && i < n - 1 ? 10 : 0);
      if (i === n - 1) steps = t + 10;   // หลักหน่วยหมุนเต็มรอบเสมอ
      c.style.transition = 'transform ' + (.55 + i * .12) + 's cubic-bezier(.2,.9,.25,1.08)';
      c.style.transform = 'translateY(' + (-steps * 5) + '%)';
    });
    setTimeout(function () { el.classList.remove('vrl'); el.textContent = a; }, 900 + n * 140);
  }
  /* (1) ฉากเปิดกล่องสมบัติ (วันที่ 7): จอมืด → กล่องสั่น → ฝาระเบิดเปิด เหรียญพุ่ง → ตัวเลขแต้ม · แตะเพื่อข้าม */
  function chestShow(gained, done) {
    if (calm()) { done(); return; }
    var w = document.createElement('div'); w.className = 'vcs'; w.setAttribute('role', 'status'); w.setAttribute('aria-label', 'เปิดกล่องสมบัติ +' + gained + ' แต้ม');
    var coins = ''; for (var k = 0; k < 26; k++) { var ang = Math.random() * Math.PI * 2, dist = 140 + Math.random() * 220; coins += '<i class="vcs-c" style="--dx:' + Math.round(Math.cos(ang) * dist) + 'px;--dy:' + Math.round(Math.sin(ang) * dist - 80) + 'px;--r:' + Math.round(Math.random() * 720 - 360) + 'deg;--d:' + (Math.random() * .25).toFixed(2) + 's"><svg viewBox="0 0 64 64">' + COIN(32, 30, 22) + '</svg></i>'; }
    w.innerHTML = '<div class="vcs-rays"></div><div class="vcs-flash"></div><div class="vcs-box"><svg viewBox="0 0 64 64" aria-hidden="true">' + ART[6] + '</svg></div>' + coins +
      '<div class="vcs-num">+' + gained + '<small>กล่องสมบัติวันที่ 7</small></div><p class="vcs-skip">แตะเพื่อไปต่อ</p>';
    document.body.appendChild(w);
    var fin = false, end = function () { if (fin) return; fin = true; w.classList.add('out'); setTimeout(function () { w.remove(); done(); }, 380); };
    requestAnimationFrame(function () { w.classList.add('on'); });
    setTimeout(function () { w.classList.add('burst'); }, 1250);
    setTimeout(end, 3600);
    w.addEventListener('click', end);
  }
  /* (7) ฉากปลดล็อก/วิวัฒนาการเหรียญไฟไม่มอด */
  function medalShow(tier, evolve, done) {
    if (calm()) { done && done(); return; }
    var c = MED[tier] || MED[1];
    var w = document.createElement('div'); w.className = 'vms'; w.style.setProperty('--f1', c.f1); w.style.setProperty('--f2', c.f2);
    w.setAttribute('role', 'status'); w.setAttribute('aria-label', (evolve ? 'เหรียญไฟไม่มอดวิวัฒนาการเป็นระดับ' + c.name : 'ได้รับเหรียญไฟไม่มอด'));
    var em = ''; for (var k = 0; k < 22; k++) em += '<i class="vms-e" style="left:' + (5 + Math.random() * 90).toFixed(1) + '%;--d:' + (Math.random() * 2).toFixed(2) + 's;--s:' + (.6 + Math.random() * .9).toFixed(2) + '"></i>';
    w.innerHTML = '<div class="vms-ring"></div><div class="vms-pillar"></div>' + em +
      '<div class="vms-m"><svg viewBox="30 62 60 56" aria-hidden="true">' + medalArt(tier) + '</svg></div>' +
      '<div class="vms-t"><small>' + (evolve ? 'เหรียญวิวัฒนาการ!' : 'ปลดล็อกเหรียญตรา') + '</small><b>' + (evolve ? 'ไฟไม่มอด · ระดับ' + c.name : 'ได้รับ เหรียญไฟไม่มอด!') + '</b><span>' + (evolve ? 'รักษาสถิติติดต่อกันได้สุดยอดมาก 🔥' : 'เช็กอินติดกัน 7 วัน · ใส่ให้น้องแล้ว') + '</span></div><p class="vcs-skip">แตะเพื่อไปต่อ</p>';
    document.body.appendChild(w);
    var fin = false, end = function () { if (fin) return; fin = true; w.classList.add('out'); setTimeout(function () { w.remove(); done && done(); }, 380); };
    requestAnimationFrame(function () { w.classList.add('on'); });
    setTimeout(function () { w.classList.add('land'); }, 1500);
    setTimeout(end, 4600); w.addEventListener('click', end);
  }
  function celebrate(card, from, to, gained, bonus) {
    var num = box && box.querySelector('[data-pts]'), dst = box && box.querySelector('.vdg-coin');
    if (!num) return;
    if (calm() || !card || !dst || !card.animate) { num.textContent = fmt(to); return; }
    num.textContent = fmt(from);
    var a = card.getBoundingClientRect(), b = dst.getBoundingClientRect();
    var n = bonus ? 12 : Math.min(9, 3 + Math.round(gained / 10));
    for (var k = 0; k < n; k++) (function (k) {
      var c = document.createElement('span'); c.className = 'vdg-fly';
      c.innerHTML = '<svg viewBox="0 0 64 64">' + COIN(32, 30, 22) + '</svg>';
      var x0 = a.left + a.width / 2 - 12 + (Math.random() - .5) * a.width * .5, y0 = a.top + a.height * .45 + (Math.random() - .5) * 20;
      var x1 = b.left + b.width / 2 - 12, y1 = b.top + b.height / 2 - 12, mx = (x0 + x1) / 2 + (Math.random() - .5) * 120, my = Math.min(y0, y1) - 60 - Math.random() * 80;
      document.body.appendChild(c);
      var an = c.animate([
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.4)', opacity: 0 },
        { transform: 'translate(' + x0 + 'px,' + (y0 - 18) + 'px) scale(1.1)', opacity: 1, offset: .15 },
        { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1)', opacity: 1, offset: .55 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.7)', opacity: .9 }
      ], { duration: 780 + Math.random() * 160, delay: k * 55, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' });
      an.onfinish = function () {
        c.remove();
        if (dst.animate) dst.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 220 });
      };
    })(k);
    // ตัวเลขหมุนแบบเครื่องนับ ระหว่างเหรียญกำลังเข้า
    setTimeout(function () { rollNum(num, from, to); }, 520);
    if (bonus) setTimeout(burst, 300);
  }
  // ประกายเมื่อครบ 7 วัน
  function burst() {
    var big = box && box.querySelector('.vdg-c.is-big'); if (!big || calm()) return;
    var r = big.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var k = 0; k < 26; k++) {
      var d = document.createElement('i'); d.className = 'vdg-spark'; document.body.appendChild(d);
      var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
      d.style.background = ['#ffe28a', '#f4c542', '#fff', '#5fd3a6', '#ff9a4d'][k % 5];
      d.animate([{ transform: 'translate(' + cx + 'px,' + cy + 'px) scale(1)', opacity: 1 }, { transform: 'translate(' + (cx + Math.cos(ang) * dist) + 'px,' + (cy + Math.sin(ang) * dist + 40) + 'px) scale(.3)', opacity: 0 }],
        { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' }).onfinish = (function (d) { return function () { d.remove(); }; })(d);
    }
  }

  /* ---------- การทำงาน ---------- */
  /* v16: จำสถานะล่าสุดไว้ในเครื่อง (เฉพาะวันเดียวกัน) → เปิดหน้าต่างแล้วขึ้นทันที ไม่ต้องรอเซิร์ฟเวอร์ตื่น
     ระหว่างนั้นปุ่มรับยังกดไม่ได้ (stale) จนกว่าเซิร์ฟเวอร์ตอบ · โหลดไม่สำเร็จ → ลองใหม่อัตโนมัติทุก 5 วินาที */
  var CK = 'vc_daily', retryT = 0, tries = 0;
  function thaiToday() { return new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10); }
  function saveCache(d) { try { var u = user(); if (u && d && d.today) localStorage.setItem(CK, JSON.stringify({ e: u.email, d: d })); } catch (e) {} }
  function readCache() {
    try { var c = JSON.parse(localStorage.getItem(CK) || 'null'), u = user(); if (!c || !u || c.e !== u.email || !c.d || !c.d.shop || c.d.today !== thaiToday()) return null; c.d.stale = true; return c.d; } catch (e) { return null; }
  }
  function apply(d) { S = d; if (!d.stale) { saveCache(d); tries = 0; clearTimeout(retryT); } render(); shopRender(); strip(); menu(); }
  function load() {
    if (!user()) { S = null; strip(); menu(); return Promise.resolve(); }
    clearTimeout(retryT);
    if (!S) { var c = readCache(); if (c) apply(c); }
    var done = false, fail = function (m) {
      if (done) return; done = true;
      if (box && !box.hidden) {
        if (S) { var sb = box.querySelector('.vdg-sub'); if (sb && S.stale) sb.innerHTML = '<span><i aria-hidden="true">⟳</i>กำลังเชื่อมต่อเซิร์ฟเวอร์…</span>'; }
        else box.querySelector('.vdg-body').innerHTML = '<p class="vdc-wait">' + h(m || 'โหลดไม่สำเร็จ') + '</p><p class="vdc-wait vdc-auto">กำลังลองใหม่อัตโนมัติ…</p><p class="vdc-wait"><button type="button" class="vdg-retry">ลองใหม่ตอนนี้</button></p>';
        if (tries++ < 36) retryT = setTimeout(load, 5000);
      }
    };
    setTimeout(function () { fail('เซิร์ฟเวอร์กำลังตื่น ใช้เวลานานกว่าปกติ'); }, 9000);
    return call('/api/daily').then(function (r) { if (r.ok) { done = true; try { apply(r.data); } catch (e) { fail('แสดงผลไม่สำเร็จ'); } } else fail(r.data && r.data.error); }, function () { fail('เชื่อมต่อไม่ได้'); });
  }
  function checkin() {
    if (busy || (S && S.checkedToday)) return;
    if (S && S.stale) { say('กำลังเชื่อมต่อเซิร์ฟเวอร์ รอสักครู่แล้วกดอีกครั้งนะ'); load(); return; }
    busy = true;
    var btns = document.querySelectorAll('.vdg-claim, .vdg-c.is-open, .vds-go');
    [].forEach.call(btns, function (b) { b.disabled = true; });
    var before = S ? S.points : 0, k = S ? S.week.filter(function (x) { return x.done; }).length : 0;
    var had = S && S.badges ? S.badges.filter(function (b) { return b.earned; }).map(function (b) { return b.id; }) : null;
    window.__vdBest = S && S.bestStreak || 0;
    call('/api/daily/checkin', 'POST').then(function (r) {
      busy = false;
      if (!r.ok) { say(r.data.error || 'เช็กอินไม่สำเร็จ'); [].forEach.call(btns, function (b) { b.disabled = false; }); return; }
      if (r.data.gained) justClaimed = r.data.bonus ? 'party' : 'happy';
      apply(r.data);
      var open = box && !box.hidden, card = open && box.querySelector('.vdg-c[data-i="' + k + '"]');
      if (card) card.classList.add('just-claimed');
      if (r.data.gained) {
        if (open && r.data.bonus) { var nm = box.querySelector('[data-pts]'); if (nm) nm.textContent = fmt(before); chestShow(r.data.gained, function () { celebrate(card, before, r.data.points, r.data.gained, true); }); }
        else if (open) celebrate(card, before, r.data.points, r.data.gained, r.data.bonus);
        else pop(r.data.gained);
        say(r.data.bonus ? 'ครบ 7 วัน! เปิดกล่องสมบัติ +' + r.data.gained + ' แต้ม' : 'เช็กอินแล้ว +' + r.data.gained + ' แต้ม');
      }
      if (had && r.data.badges) {
        var fresh = r.data.badges.filter(function (b) { return b.earned && had.indexOf(b.id) < 0; });
        var beforeBest = had ? (window.__vdBest || 0) : 0;
        var gotMedal = fresh.some(function (b) { return b.id === 's7'; });
        var tierAfter = r.data.bestStreak >= 30 ? 3 : r.data.bestStreak >= 14 ? 2 : 1, tierBefore = beforeBest >= 30 ? 3 : beforeBest >= 14 ? 2 : 1;
        if (gotMedal || (beforeBest >= 7 && tierAfter > tierBefore)) {
          if (gotMedal) { var w0 = []; try { w0 = JSON.parse(localStorage.getItem('vc_outfit') || '[]'); } catch (e) {} if (w0.indexOf('medal') < 0) wear('medal'); }
          setTimeout(function () { medalShow(tierAfter, !gotMedal, function () { render(); }); }, r.data.bonus ? 4300 : 1500);
        }
        if (fresh.length) setTimeout(function () {
          say('🏅 ได้เหรียญตราใหม่: ' + fresh[0].name);
          var el = box && box.querySelector('.vbg-b[data-badge="' + fresh[0].id + '"]');
          if (el) { el.classList.add('is-new'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
        }, 1600);
      }
    });
  }
  function redeem() {
    if (busy || !S || !S.redeem.canRedeem) return; busy = true;
    var b = box && box.querySelector('.vdg-redeem'); if (b) b.disabled = true;
    call('/api/daily/redeem', 'POST').then(function (r) {
      busy = false;
      if (!r.ok) { say(r.data.error || 'แลกไม่สำเร็จ'); if (r.data && r.data.redeem) apply(r.data); else render(); return; }
      apply(r.data);
      say('แลกแล้ว ได้เครดิตตรวจ +1 ครั้ง');
      // อัปเดตเครดิตบนหน้าเว็บ (กระเป๋า ป้ายเครดิต ปุ่มตรวจ)
      call('/api/me').then(function (m) { if (m.ok && typeof showCredits === 'function') showCredits(m.data.credits, m.data.voice_credits); });
    });
  }
  // แต้มลอยขึ้นเล็กน้อยตอนเช็กอินสำเร็จ
  function pop(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t = document.getElementById('vdcStrip');
    if (!t) return;
    var r = t.getBoundingClientRect(), p = document.createElement('span');
    p.className = 'vdc-pop'; p.textContent = '+' + n;
    p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top + 8) + 'px';
    document.body.appendChild(p); setTimeout(function () { p.remove(); }, 1300);
  }

  /* ---------- แถบบนหน้าตรวจ (แสดงเฉพาะวันที่ยังไม่เช็กอิน) ---------- */
  var OFF = 'vdc_strip_off';
  function strip() {
    var host = document.getElementById('checkCard'), s = document.getElementById('vdcStrip');
    var off = false; try { off = S && sessionStorage.getItem(OFF) === S.today; } catch (e) {}
    if (!host || !user() || !S || S.checkedToday || off) {
      if (s && S && S.checkedToday && !s.classList.contains('is-done')) {
        // เพิ่งเช็กอิน: เปลี่ยนเป็นข้อความยืนยันสั้นๆ แล้วค่อยหายไป
        s.classList.add('is-done');
        s.innerHTML = '<span class="vdc-ic vdc-mini">' + mascot(justClaimed || 'happy', 40, ICO_FIRE) + '</span><span class="vds-txt"><b>เช็กอินแล้ว · ' + S.streak + ' วันติด</b><small>แต้มสะสม ' + fmt(S.points) + ' · พรุ่งนี้ +' + S.tomorrowReward + '</small></span>';
        setTimeout(function () { if (s.isConnected) { s.classList.add('is-out'); setTimeout(function () { s.remove(); }, 400); } }, 3500);
      } else if (s && !(s.classList.contains('is-done'))) s.remove();
      return;
    }
    if (!s) {
      s = document.createElement('div'); s.id = 'vdcStrip'; s.className = 'vdc-strip';
      host.insertBefore(s, host.firstChild);
      s.addEventListener('click', function (e) {
        if (e.target.closest('.vds-go')) { checkin(); return; }
        if (e.target.closest('.vds-x')) { try { sessionStorage.setItem(OFF, S.today); } catch (er) {} s.remove(); return; }
        if (e.target.closest('.vds-txt')) open();
      });
    }
    var k = slot();
    s.innerHTML = '<span class="vdc-ic vdc-mini">' + mascot(mood(), 40, ICO_GIFT) + '</span>' +
      '<button type="button" class="vds-txt"><b>เช็กอินวันนี้ +' + S.todayReward + ' แต้ม</b><small>วันที่ ' + k + '/7 · สะสม ' + fmt(S.points) + ' แต้ม</small></button>' +
      '<button type="button" class="vds-go">เช็กอิน</button><button type="button" class="vds-x" aria-label="ซ่อนวันนี้">✕</button>';
  }

  /* ---------- ปุ่มในเมนูบัญชี ---------- */
  /* ---------- การ์ดในหน้าบัญชี: เห็นตลอด ทั้งก่อนและหลังรับรางวัลวันนี้ ----------
     วางต่อจากการ์ดเครดิต (.vc-wcard) / แถวประวัติ (.vc-stat) · การ์ดแจ้งเตือน (remind-ui.js) จะวางต่อจากการ์ดนี้ */
  function acctAnchor(li) { return li.querySelector('.vc-stat') || li.querySelector('.vc-wcard') || li.querySelector('.wallet-total'); }
  function placeAfter(el, anchor) { if (anchor && anchor.parentNode && el.previousElementSibling !== anchor) anchor.parentNode.insertBefore(el, anchor.nextSibling); }
  function menu() {
    var li = document.getElementById('authLoggedIn'); if (!li) return;
    var old = document.getElementById('vdcMenu'); if (old) old.remove();
    var c = document.getElementById('vdcAcct');
    if (!c) {
      c = document.createElement('button'); c.type = 'button'; c.id = 'vdcAcct'; c.className = 'vdc-acct';
      c.addEventListener('click', open);
      // หน้าบัญชีสร้างการ์ดเครดิต/แถวประวัติทีหลัง → คอยจัดตำแหน่งให้ถูกเสมอ
      new MutationObserver(function () { var x = document.getElementById('vdcAcct'); if (x) placeAfter(x, acctAnchor(li)); }).observe(li, { childList: true, subtree: true });
    }
    placeAfter(c, acctAnchor(li));
    c.hidden = !user();
    if (!S) { c.className = 'vdc-acct'; c.innerHTML = '<span class="vda-ic vdc-mini">' + mascot('wave', 44, ICO_GIFT) + '</span><span class="vda-tx"><b>เช็กอินรายวัน</b><small>สะสมแต้มแลกตรวจสัญญาฟรี</small></span><i class="vda-chev" aria-hidden="true"></i>'; return; }
    var done = S.week.filter(function (x) { return x.done; }).length;
    var dots = S.week.map(function (w) { return '<i class="' + (w.done ? 'is-done' : w.today ? 'is-today' : '') + '"></i>'; }).join('');
    c.className = 'vdc-acct' + (S.checkedToday ? ' is-claimed' : ' is-ready');
    c.setAttribute('aria-label', 'เช็กอินรายวัน ' + (S.checkedToday ? 'รับของวันนี้แล้ว' : 'วันนี้รับได้ ' + S.todayReward + ' แต้ม') + ' แต้มสะสม ' + S.points);
    c.innerHTML = '<span class="vda-ic vdc-mini">' + mascot(mood(), 44, ICO_GIFT) + '</span>' +
      '<span class="vda-tx"><b>เช็กอินรายวัน</b>' +
      '<small><span class="vda-fire">' + ICO_FIRE + S.streak + ' วันติด</span> · ' + fmt(S.points) + ' แต้ม</small>' +
      '<span class="vda-dots" aria-hidden="true">' + dots + '<em>' + done + '/7</em></span></span>' +
      (S.checkedToday
        ? '<span class="vda-pill is-ok">✓ รับแล้ว<small>พรุ่งนี้ +' + S.tomorrowReward + '</small></span>'
        : '<span class="vda-pill">รับ +' + S.todayReward + '</span>') +
      '<i class="vda-chev" aria-hidden="true"></i>';
  }

  // ต่อจาก onAuthChange เดิม (pay-ui.js / remind-ui.js)
  var prev = window.onAuthChange;
  window.onAuthChange = function (u) {
    if (typeof prev === 'function') try { prev(u); } catch (e) { console.error(e); }
    S = null; load();
  };
  // กลับมาที่แท็บหลังเที่ยงคืน: โหลดใหม่ให้ได้วันใหม่
  document.addEventListener('visibilitychange', function () { if (!document.hidden && user()) load(); });
  function init() { menu(); if (user()) load(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.VCDaily = { open: open, refresh: load, shop: shopOpen };
  /* เมนูบัญชี: "ร้านค้าน้องเวลลัม" (วางก่อน "ติดต่อผู้ดูแล") */
  function shopMenu() {
    var nav = document.querySelector('.acct-menu'); if (!nav || document.getElementById('vstMenu')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'menu-item'; b.id = 'vstMenu';
    b.innerHTML = '<span class="vc-mi" aria-hidden="true">🛍️</span><span class="menu-txt"><b>ร้านค้าน้องเวลลัม</b><small>ใช้แต้มซื้อชุดแต่งตัว</small></span><i class="vc-mchev" aria-hidden="true"></i>';
    b.addEventListener('click', function () { shopOpen(); });
    nav.insertBefore(b, document.getElementById('vtMenu') || document.getElementById('helpContact') || null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shopMenu); else shopMenu();
})();
