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
    cap: { vb: '18 -2 92 34', art: '<path d="M24 24c4-14 22-22 40-20 14 2 26 10 34 4-2 10-12 14-22 14z" fill="#4b5bd6" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/><path d="M22 22c12-4 50-4 58 0" stroke="#f7efdc" stroke-width="6" stroke-linecap="round"/><path d="M22 22c12-4 50-4 58 0" stroke="' + INK + '" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="100" cy="7" r="6" fill="#f7efdc" stroke="' + INK + '" stroke-width="2.2"/><path d="M48 12l1 2.4 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3zM70 9l.8 1.8 1.9.2-1.4 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.4-1.3 1.9-.2z" fill="#ffd84d"/>' },
    bow: { vb: '44 74 32 24', art: '<g transform="translate(60 86)"><path d="M-3-3-14-9v18L-3 3zM3-3 14-9v18L3 3z" fill="#d2343e" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="-4" y="-4.5" width="8" height="9" rx="2.5" fill="#a91f2a" stroke="' + INK + '" stroke-width="2"/><path d="M-11-5-6-2M11-5 6-2" stroke="#ff8a92" stroke-width="1.4" stroke-linecap="round"/></g>' },
    crown: { vb: '34 -8 52 34', art: '<g transform="translate(60 14)"><path d="M-20 6-23-14-10-3 0-18 10-3 23-14 20 6z" fill="#f4c542" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/><rect x="-21" y="4" width="42" height="7" rx="2.5" fill="#e0a92c" stroke="' + INK + '" stroke-width="2.2"/><circle cy="7.5" r="2.4" fill="#d2343e"/><circle cx="-12" cy="7.5" r="1.8" fill="#4b8bd6"/><circle cx="12" cy="7.5" r="1.8" fill="#4b8bd6"/><path d="M-14-6l3 4" stroke="#fff6cf" stroke-width="1.8" stroke-linecap="round"/></g>' },
    scarf: { vb: '28 62 70 46', art: '<path d="M30 70q30 10 60 0v9q-30 10-60 0z" fill="#d2343e" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M74 78l4 24 9-2-4-24z" fill="#d2343e" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M36 74q24 7 48 0M77 92h8M78 97h8" stroke="#ff8a92" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
    wizard: { vb: '8 -36 104 64', art: '<path d="M22 24 58-30q6-5 10 2l-6 6 12 46z" fill="#5b3fb0" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="60" cy="24" rx="46" ry="7" fill="#4a2f96" stroke="' + INK + '" stroke-width="2.4"/><path d="M26 18q34 8 70-2" stroke="#f4c542" stroke-width="4" fill="none"/><path d="M50 0l1.5 3.4 3.6.4-2.7 2.4.8 3.6-3.2-1.9-3.2 1.9.8-3.6-2.7-2.4 3.6-.4zM64-14l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z" fill="#ffe28a"/>' },
    medal: { vb: '30 62 60 56', art: '' },
    laurel: { vb: '16 -6 88 36', art: '<g fill="#7fbf4a" stroke="' + INK + '" stroke-width="1.6"><path d="M24 22q-4-10 2-18 4 8-2 18z"/><path d="M30 12q-2-9 6-14 2 8-6 14z"/><path d="M40 6q2-8 10-9-1 7-10 9z"/><path d="M96 22q4-10-2-18-4 8 2 18z"/><path d="M90 12q2-9-6-14-2 8 6 14z"/><path d="M80 6q-2-8-10-9 1 7 10 9z"/></g><path d="M24 24q36-30 72 0" stroke="#e0a92c" stroke-width="2.4" fill="none"/><circle cx="60" cy="0" r="3.4" fill="#f4c542" stroke="' + INK + '" stroke-width="1.6"/>' }
  };
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
  function artFor(id) { return id === 'medal' ? medalArt(medalTier()) : ART_OUT[id] ? ART_OUT[id].art : ''; }
  var RAR = { common: 'ธรรมดา', rare: 'หายาก', epic: 'พิเศษ', legendary: 'ตำนาน' };
  function shopItems() { return (S && S.shop || []).filter(function (o) { return ART_OUT[o.id]; }); }
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
  function dressed(m, size) {
    var svg = mascot(m, size, ICO_GIFT), worn = wornOutfits();
    if (!worn.length || svg.indexOf('<g class="vm-face">') < 0) return svg;
    var art = worn.map(function (id) { return id === 'medal' ? frontArt(medalTier()) + '<g class="md-worn">' + artFor(id) + '</g>' : artFor(id); }).join('');
    var i = svg.indexOf('<g class="vm-face">'), depth = 0, j = i;
    var re = /<g[\s>]|<\/g>/g; re.lastIndex = i;
    for (var mt; (mt = re.exec(svg));) { if (mt[0] === '</g>') { depth--; if (!depth) { j = mt.index + 4; break; } } else depth++; }
    var out = svg.slice(0, j) + '<g class="vm-outfit">' + art + '</g>' + svg.slice(j);
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
        '<div class="vst-stage"><div class="vst-fire" aria-hidden="true"></div><i class="vst-spot"></i><i class="vst-glow"></i><div class="vst-refl" aria-hidden="true"></div><i class="vst-ped"></i><i class="vst-sweep"></i><i class="vst-grain"></i><div class="vst-extra"></div><div class="vst-hero" aria-hidden="true"></div><div class="vst-ms" aria-hidden="true"></div><p class="vst-say"></p></div>' +
        '<div class="vst-tabs" role="tablist"></div><div class="vst-grid"></div><div class="vst-bar"></div></div>';
      document.body.appendChild(sh);
      sh.addEventListener('click', function (e) {
        if (e.target.closest('[data-shx]')) { shopClose(); return; }
        var t = e.target.closest('[data-tab]'); if (t) { shTab = t.getAttribute('data-tab'); shopRender(); return; }
        var tr = e.target.closest('.vst-tiers [data-tier]'); if (tr) { pvTier = +tr.getAttribute('data-tier'); if (pvTier === realTier()) pvTier = 0; shopRender(); hop(sh.querySelector('.vst-ms')); return; }
        var it = e.target.closest('[data-outfit]'); if (it) { pick(it.getAttribute('data-outfit')); return; }
        var a = e.target.closest('[data-act]'); if (a) { act(a.getAttribute('data-act')); return; }
        if (e.target.closest('.vst-ms')) hop(sh.querySelector('.vst-ms'));
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sh && !sh.hidden) shopClose(); });
    }
    sel = focusId || null; tryOn = focusId && ownedOutfits().indexOf(focusId) < 0 ? focusId : null;
    sh.hidden = false; document.documentElement.classList.add('vst-open');
    requestAnimationFrame(function () { sh.classList.add('on'); });
    if (S) shopRender(); else { sh.querySelector('.vst-grid').innerHTML = '<p class="vst-wait">กำลังโหลดร้าน…</p>'; load(); }
    setTimeout(function () { var x = sh.querySelector('.vst-x'); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function shopClose() {
    if (!sh) return; tryOn = null; sel = null; pvTier = 0; heroKey = ''; heroPlayed = false; sh.classList.remove('on'); document.documentElement.classList.remove('vst-open');
    setTimeout(function () { if (sh && !sh.classList.contains('on')) sh.hidden = true; }, 260);
    if (box && !box.hidden) render();
  }
  function pick(id) {
    var o = itemById(id); if (!o) return;
    sel = id; tryOn = ownedOutfits().indexOf(id) < 0 ? id : null; if (id !== 'medal') pvTier = 0;
    shopRender(); hop(sh.querySelector('.vst-ms'));
  }
  function act(a) {
    var o = itemById(sel); if (!o) return;
    if (a === 'buy') { buy(o.id); return; }
    if (a === 'wear') { var on = wear(o.id); shopRender(); hop(sh.querySelector('.vst-ms')); say(on ? 'ใส่ ' + o.name + ' แล้ว' : 'ถอด ' + o.name + ' แล้ว'); if (box && !box.hidden) render(); }
  }
  /* (2) ปีกฟีนิกซ์ (3) วงเวทไฟ (5) ปุ่มดูตัวอย่างระดับ (6) ป้ายนับถอยหลังปลดล็อก */
  /* ฉากเหรียญไฟไม่มอด แนวภาพยนตร์: ควันมืด + ถ่านไฟเบลอลอยช้า + แสงอุ่นตัดขอบ · ป้ายแบบแบรนด์หรู */
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
      f.innerHTML = '<i class="vst-smoke"></i><i class="vst-smoke s2"></i><i class="vst-haze"></i>' + bk +
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
    if (picked) html += '<div class="vst-tiers" role="group" aria-label="ดูตัวอย่างระดับเหรียญ">' + [[1, 'ทอง', 7], [2, 'ทองคำขาว', 14], [3, 'เพชร', 30]].map(function (t) {
      return '<button type="button" data-tier="' + t[0] + '" class="t' + t[0] + (medalTier() === t[0] ? ' on' : '') + (bd && bd.earned && rt >= t[0] ? ' got' : '') + '">' + t[1] + '<small>' + t[2] + ' วัน' + (bd && bd.earned && rt >= t[0] ? ' ✓' : '') + '</small></button>';
    }).join('') + '</div>';
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
    var hk = sel === 'medal' ? 'm' + medalTier() : '';
    if (hk && !heroPlayed) setTimeout(function () { playHero(medalTier()); }, 30);
    else if (hk && heroKey && hk !== heroKey && !calm()) { var stg = sh.querySelector('.vst-stage'); stg.classList.remove('tier-flash'); void stg.offsetWidth; stg.classList.add('tier-flash'); }
    if (!hk) { heroT.forEach(clearTimeout); var he = sh.querySelector('.vst-hero'); he.className = 'vst-hero'; sh.querySelector('.vst-ms').classList.remove('hide-medal'); }
    heroKey = hk;
    var o = itemById(sel), say2 = sh.querySelector('.vst-say');
    say2.textContent = !o ? 'อยากให้ฉันใส่อะไรดี? แตะของด้านล่างเพื่อลองใส่ได้เลย ✨'
      : own.indexOf(o.id) >= 0 ? (worn.indexOf(o.id) >= 0 ? 'ใส่ ' + o.name + ' อยู่นะ เข้ากับฉันไหม? 😊' : o.name + ' ของเราเอง ใส่เลยไหม?')
      : o.badge ? 'ชิ้นนี้ซื้อไม่ได้ ต้องได้เหรียญตรา "' + (bmap[o.badge] ? bmap[o.badge].name : '') + '" ก่อนนะ'
      : 'ลอง ' + o.name + ' อยู่! ' + (S.points >= o.price ? 'ชอบไหม?' : 'อีกนิดเดียวก็ซื้อได้แล้ว');
    sh.querySelector('.vst-tabs').innerHTML = TABS.map(function (t) {
      var n = t[0] === 'all' ? list.length : list.filter(function (x) { return x.slot === t[0]; }).length;
      return n ? '<button type="button" role="tab" aria-selected="' + (shTab === t[0]) + '" class="' + (shTab === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>' : '';
    }).join('');
    var show = list.filter(function (x) { return shTab === 'all' || x.slot === shTab; });
    sh.querySelector('.vst-grid').innerHTML = show.map(function (it) {
      var has = own.indexOf(it.id) >= 0, on = worn.indexOf(it.id) >= 0 && tryOn !== it.id, a = ART_OUT[it.id], bd = it.badge && bmap[it.badge];
      var tag = has ? '<span class="vof-act' + (on ? ' is-on' : '') + '">' + (on ? 'ใส่อยู่ ✓' : 'มีแล้ว') + '</span>'
        : it.badge ? '<span class="vof-act is-badge">🏅 รางวัล</span>'
        : '<span class="vof-act is-buy' + (S.points < it.price ? ' is-short' : '') + '"><i class="vof-coin"></i>' + fmt(it.price) + '</span>';
      return '<button type="button" class="vof-b r-' + it.rarity + (it.id === 'medal' ? ' is-fire mt-' + medalTier() : '') + (has ? ' is-own' : ' is-lock' + (it.badge ? ' is-badge-item' : '')) + (on ? ' is-on' : '') + (sel === it.id ? ' is-try' : '') + '" data-outfit="' + it.id + '" aria-pressed="' + (sel === it.id) + '" aria-label="' + h(it.name + ' · ' + (RAR[it.rarity] || '')) + '">' +
        '<em class="vof-r">' + (RAR[it.rarity] || '') + '</em>' + (!has && bd ? '<span class="vof-pr" style="--bp:' + Math.round(bd.have / bd.n * 100) + '%"><svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(it.id) + '</svg><i class="vof-spark"></i><b>' + bd.have + '/' + bd.n + '</b></span>' : '<svg viewBox="' + a.vb + '" aria-hidden="true">' + artFor(it.id) + '</svg>') + '<small>' + h(it.name) + '</small>' + tag + '</button>';
    }).join('');
    var bar = sh.querySelector('.vst-bar');
    if (!o) { bar.innerHTML = '<p class="vst-hint">แตะของเพื่อลองใส่ · ' + own.length + '/' + list.length + ' ชิ้นที่มีแล้ว · ได้แต้มจากเช็กอินทุกวัน</p>'; return; }
    var head = '<span class="vst-it r-' + o.rarity + '"><em>' + (RAR[o.rarity] || '') + (o.id === 'medal' ? ' · ระดับ' + MED[medalTier()].name + (pvTier ? ' (ตัวอย่าง)' : '') : '') + '</em><b>' + h(o.name) + '</b></span>';
    if (own.indexOf(o.id) >= 0) bar.innerHTML = head + '<button type="button" class="vst-btn ' + (worn.indexOf(o.id) >= 0 ? 'is-off' : '') + '" data-act="wear">' + (worn.indexOf(o.id) >= 0 ? 'ถอดออก' : 'ใส่ชิ้นนี้') + '</button>';
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
