/* acct-lux.js — ฉากหลังหน้าบัญชี (มือถือ) ต่อเนื่องจากหน้าปก
   ใส่ชั้นพื้นหลังเข้าไปใน #authCard: โต๊ะไม้เข้ม · แสงโคมอุ่น · ฝุ่นทองลอย · ใบไม้เงา/ปากกา/แว่นที่ขอบจอ
   หน้าตาทั้งหมดอยู่ใน acct-lux.css (ทำงานเฉพาะ body[data-sheet="acct"] จอ ≤767px)
   ปิด: ลบ <script src="acct-lux.js"> และ <link href="acct-lux.css"> ออกจาก index.html */
(function () {
  'use strict';
  if (window.__vcAcctLux) return; window.__vcAcctLux = 1;
  function build() {
    var card = document.getElementById('authCard'); if (!card || card.querySelector('.alx-bg')) return;
    var dust = ''; for (var i = 0; i < 16; i++) dust += '<i style="left:' + (6 + Math.random() * 88).toFixed(0) + '%;top:' + (4 + Math.random() * 60).toFixed(0) + '%;--d:-' + (Math.random() * 9).toFixed(1) + 's;--t:' + (7 + Math.random() * 5).toFixed(1) + 's"></i>';
    var bg = document.createElement('div'); bg.className = 'alx-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<div class="alx-w"></div><div class="alx-l"></div>' +
      /* ใบไม้เงามุมขวาบน */
      '<svg class="alx-leaf" viewBox="0 0 160 160"><g fill="#0f1a12"><path d="M160 0C120 6 96 30 92 64C112 50 136 44 160 46Z"/><path d="M160 40C128 46 110 66 108 94C126 82 144 78 160 80Z"/><path d="M150 0C134 22 132 48 140 70C150 50 156 26 160 0Z"/><path d="M120 0C102 14 92 34 92 56C106 40 118 22 124 0Z"/></g><g stroke="#25382a" stroke-width="1.2" fill="none"><path d="M160 4C130 18 106 40 96 62M160 44C134 56 116 74 110 92"/></g></svg>' +
      /* ปากกาหมึกซึม ขอบล่างขวา */
      '<svg class="alx-pen" viewBox="0 0 200 40"><rect x="18" y="12" width="132" height="16" rx="8" fill="#141416"/><rect x="18" y="12" width="132" height="5" rx="2.5" fill="#2a2a30"/><rect x="104" y="11" width="8" height="18" rx="1" fill="#a78748"/><path d="M150 13L186 20L150 27Z" fill="#bfa05b"/><path d="M150 20H182" stroke="#6a4808" stroke-width="1"/><rect x="40" y="9" width="44" height="4" rx="2" fill="#a78748"/></svg>' +
      /* แว่นอ่านหนังสือ ขอบล่างซ้าย */
      '<svg class="alx-gls" viewBox="0 0 200 80"><g fill="rgba(200,220,255,.05)" stroke="#a88a52" stroke-width="5"><circle cx="58" cy="44" r="30"/><circle cx="142" cy="44" r="30"/></g><path d="M88 40Q100 30 112 40" stroke="#a88a52" stroke-width="5" fill="none"/><path d="M28 38L4 22" stroke="#a88a52" stroke-width="5" stroke-linecap="round"/><path d="M44 30q8-6 18-6" stroke="#fff" stroke-width="3" fill="none" opacity=".25" stroke-linecap="round"/></svg>' +
      '<div class="alx-dust">' + dust + '</div><div class="alx-v"></div>';
    card.insertBefore(bg, card.firstChild);
  }
  /* การ์ดเครดิตแบบสมุดบัญชีหนัง: มุมโลหะทอง 4 มุม · ตราโล่ปั๊มทอง · แสงโคมตกกระทบ */
  var CORNER = '<svg viewBox="0 0 30 30"><path d="M2 28V8Q2 2 8 2H28L22 8H10Q8 8 8 10V22Z" fill="url(#alxG)" stroke="#5c3a06" stroke-width="1.2" stroke-linejoin="round"/><path d="M5 22V9Q5 5 9 5H22" fill="none" stroke="#f1e3ae" stroke-width=".9" opacity=".7"/><circle cx="7.6" cy="7.6" r="1.6" fill="#7a4d08"/><path d="M12 11q3 0 3 3" fill="none" stroke="#7a4d08" stroke-width=".8"/><defs><linearGradient id="alxG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0e0a9"/><stop offset=".45" stop-color="#c39b42"/><stop offset="1" stop-color="#8a5a10"/></linearGradient></defs></svg>';
  /* ตัว V ปั๊มทองแบบโลโก้แบรนด์ (แทนโล่) */
  var CREST = '<svg viewBox="0 0 40 46"><defs><linearGradient id="alxC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e3ae"/><stop offset=".45" stop-color="#cda54f"/><stop offset="1" stop-color="#9a6410"/></linearGradient></defs>' +
    '<g transform="translate(0 1.4)" fill="#2a0410" opacity=".6"><path d="M4 7H15V9.4L12.6 10L20.4 31L27.6 10L25 9.4V7H36V9.4L33.4 10L22 40H18.4L6.4 10L4 9.4Z"/></g>' +
    '<path d="M4 7H15V9.4L12.6 10L20.4 31L27.6 10L25 9.4V7H36V9.4L33.4 10L22 40H18.4L6.4 10L4 9.4Z" fill="url(#alxC)" stroke="#6a4006" stroke-width=".8" stroke-linejoin="round"/>' +
    '<path d="M8 9.6L19.4 37" stroke="#fffbe6" stroke-width=".9" opacity=".7" stroke-linecap="round"/><path d="M11 44.4Q20 41.6 29 44.4" stroke="url(#alxC)" stroke-width="1.1" fill="none" stroke-linecap="round"/></svg>';
  function dressCard() {
    var c = document.querySelector('#authCard .vc-wcard'); if (!c || c.querySelector('.alx-spine')) return;
    var f = document.createElement('div'); f.className = 'alx-cf'; f.setAttribute('aria-hidden', 'true');
    var tw = ''; [[30, 22, 0], [72, 60, 1.3], [52, 86, 2.4], [88, 30, 3.1]].forEach(function (q) { tw += '<i class="alx-tw" style="left:' + q[0] + '%;top:' + q[1] + '%;animation-delay:' + q[2] + 's"></i>'; });
    f.innerHTML = '<i class="alx-spine"><b></b><b></b><b></b></i>' + ['tl', 'tr', 'bl', 'br'].map(function (k) { return '<i class="alx-stud ' + k + '"></i>'; }).join('') + '<i class="alx-crest">' + CREST + '<b></b></i><i class="alx-glare"></i>' + tw;
    c.insertBefore(f, c.firstChild);
    var bt = c.querySelector('.vc-wc-top-up'); if (bt && !bt.querySelector('.alx-coin')) { var ic = document.createElement('i'); ic.className = 'alx-coin'; ic.setAttribute('aria-hidden', 'true'); bt.insertBefore(ic, bt.firstChild); var ar = document.createElement('i'); ar.className = 'alx-arr'; ar.setAttribute('aria-hidden', 'true'); bt.appendChild(ar); var stc = document.createElement('i'); stc.className = 'alx-stc'; stc.setAttribute('aria-hidden', 'true'); bt.appendChild(stc);
      bt.addEventListener('pointerdown', function () { ic.classList.remove('spin'); void ic.offsetWidth; ic.classList.add('spin'); }); }
  }
  /* เส้นทองใต้ส่วนหัว + เพชรกลาง */
  function dressHead() { var h = document.querySelector('#authCard .sheet-head'); if (!h || h.querySelector('.alx-hd')) return; var d = document.createElement('i'); d.className = 'alx-hd'; d.setAttribute('aria-hidden', 'true'); h.appendChild(d); }
  /* นับเลขเครดิตขึ้นทุกครั้งที่เปิดหน้าบัญชี + ประกายทองตอนหยุด */
  var lastOpen = false, opens = 0;
  function countUp() {
    var b = document.querySelector('#authCard .vc-wcard .vc-wc-num b'); if (!b) return;
    var to = parseInt(b.textContent, 10); if (isNaN(to)) return;
    var num = b.parentNode;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t0 = null; b.classList.add('alx-counting');
    (function st(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3);
      if (parseInt(b.dataset.alxTo || to, 10) !== to) { b.classList.remove('alx-counting'); return; }
      b.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(st); else { b.textContent = to; b.classList.remove('alx-counting'); num.classList.remove('alx-pop'); void num.offsetWidth; num.classList.add('alx-pop'); } })(performance.now());
  }
  function sparkle() { var n = document.querySelector('#authCard .vc-wcard .vc-wc-num'); if (!n || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return; n.classList.remove('alx-pop'); void n.offsetWidth; n.classList.add('alx-pop'); }
  function watchOpen() {
    var on = document.body.dataset.sheet === 'acct' && !(document.getElementById('authLoggedIn') || {}).hidden;
    if (on && !lastOpen) setTimeout(sparkle, 950);
    lastOpen = on;
  }
  /* หัวข้อกลุ่มใหม่ (เรียงตามความสำคัญ) — ลำดับจริงจัดด้วย CSS order ใน acct-lux.css */
  var GT = { th: { r: 'แต้มและรางวัล', w: 'งานของฉัน', h: 'ช่วยเหลือ', g1: 'ตั้งค่า', g2: 'นโยบาย' }, en: { r: 'Points & rewards', w: 'My work', h: 'Help', g1: 'Settings', g2: 'Policies' }, zh: { r: '积分与奖励', w: '我的工作', h: '帮助', g1: '设置', g2: '政策' } };
  function dressGroups() {
    var li = document.getElementById('authLoggedIn'); if (!li) return;
    var lang = document.documentElement.getAttribute('data-lang') || 'th', T = GT[lang] || GT.th;
    ['r', 'w', 'h'].forEach(function (k) { var e = li.querySelector('.alx-mg-' + k); if (!e) { e = document.createElement('p'); e.className = 'vc-mg alx-mg alx-mg-' + k; li.appendChild(e); } if (e.textContent !== T[k]) e.textContent = T[k]; });
    ['g1', 'g2'].forEach(function (k) { var e = li.querySelector('.acct-menu .vc-mg.' + k); if (e && e.textContent !== T[k]) e.textContent = T[k]; });
  }
  /* ป้ายเครดิตหน้าตรวจสัญญา: ใกล้หมด (≤1) → data-low · ตัวเลขเปลี่ยน → เด้ง+ประกาย */
  function watchChip() {
    var n = document.getElementById('creditNum'), c = document.getElementById('creditChip'); if (!n || !c || c.__alx) return; c.__alx = 1;
    var last = n.textContent;
    var upd = function () { var t = n.textContent, v = parseInt(t, 10); c.toggleAttribute('data-low', !isNaN(v) && v <= 1);
      if (t !== last && last !== '–' && t !== '–') { c.classList.remove('alx-pop'); void c.offsetWidth; c.classList.add('alx-pop'); }
      last = t; };
    upd(); if (window.MutationObserver) new MutationObserver(upd).observe(n, { childList: true, characterData: true, subtree: true });
  }
  function boot() { build(); dressCard(); dressHead(); dressGroups(); watchChip();
    if (window.MutationObserver) new MutationObserver(watchOpen).observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    new MutationObserver(dressGroups).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    var card = document.getElementById('authCard'); if (card && window.MutationObserver) new MutationObserver(function () { if (!document.querySelector('#authCard .alx-spine')) dressCard(); dressHead(); dressGroups(); }).observe(card, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
/* คลังเอกสาร: แสดงจำนวนฉบับจากตัวนับ #stAll (acct-lux.js v10) */
(function () {
  function sync() { var n = document.getElementById('stAll'), h = document.querySelector('#historyPanel .vault-head'); if (!n || !h) return; var v = parseInt(n.textContent, 10), b = h.querySelector('.vault-txt b'); [h, b].forEach(function (e) { if (!e) return; if (v > 0) e.setAttribute('data-n', v); else e.removeAttribute('data-n'); }); }
  function boot() { var n = document.getElementById('stAll'); if (!n || !window.MutationObserver) return; sync(); new MutationObserver(sync).observe(n, { childList: true, characterData: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
/* คลังเอกสาร = ตู้บัตรรายการ: สร้างลิ้นชักเล็ก ลิ้นชักหลัก แฟ้มที่โผล่ (แท็บ = ประเภทสัญญาที่มีจริง) มือจับ (acct-lux.js v12: แฟ้มเป็น SVG) */
(function () {
  var st = document.createElement('style'); st.textContent = '.alx-cab-top,.alx-cab-main>.alx-grv,.alx-files,.alx-pull{display:none}'; document.head.appendChild(st);
  function types() {
    var out = [], sel = document.getElementById('histType');
    if (sel) [].forEach.call(sel.options, function (o) { if (o.value !== 'all' && out.length < 3) out.push(o.textContent.replace(/^สัญญา/, '').replace(/เงิน$/, '').trim()); });
    if (!out.length) [].forEach.call(document.querySelectorAll('#histList .hr-chip:not(.is-pin)'), function (c) { var x = c.textContent.replace(/^สัญญา/, '').replace(/เงิน$/, '').trim(); if (x && out.indexOf(x) < 0 && out.length < 3) out.push(x); });
    return out;
  }
  var FC = [['#6a3a3e', '#4a262c'], ['#3c5444', '#2a3c30'], ['#3e4c62', '#2c3648']];
  function esc2(x) { return String(x).replace(/[<>"&]/g, ''); }
  function folders(t) {
    var n = Math.max(t.length, 3), W = 300, H = 60, TW = 80, TH = 15, s = '';
    for (var i = 0; i < n; i++) {
      var ins = (n - 1 - i) * 9, x0 = ins, x1 = W - ins, top = 3 + i * 10, body = top + TH, c = FC[i % 3];
      var span = x1 - x0 - 28 - TW, tx = x0 + 14 + (n > 1 ? span * i / (n - 1) : 0);
      var back = 'M' + x0 + ' ' + (body + 4) + 'Q' + x0 + ' ' + body + ' ' + (x0 + 4) + ' ' + body + 'H' + (tx - 3) + 'Q' + tx + ' ' + body + ' ' + (tx + 2) + ' ' + (body - 4) + 'L' + (tx + 5) + ' ' + (top + 3) + 'Q' + (tx + 6) + ' ' + top + ' ' + (tx + 10) + ' ' + top + 'H' + (tx + TW - 10) + 'Q' + (tx + TW - 6) + ' ' + top + ' ' + (tx + TW - 5) + ' ' + (top + 3) + 'L' + (tx + TW - 2) + ' ' + (body - 4) + 'Q' + (tx + TW) + ' ' + body + ' ' + (tx + TW + 3) + ' ' + body + 'H' + (x1 - 4) + 'Q' + x1 + ' ' + body + ' ' + x1 + ' ' + (body + 4) + 'V' + H + 'H' + x0 + 'Z';
      var p1y = body + 1 + (i % 2), p2y = body + 3 - (i % 2);
      var lines = ''; for (var k = 0; k < 3; k++) lines += '<path d="M' + (x0 + 22) + ' ' + (p1y + 3 + k * 3) + 'H' + (x1 - 40 - k * 18) + '" stroke="#a08458" stroke-width=".8" opacity=".55"/>';
      var lb = t[i] ? '<rect x="' + (tx + 9) + '" y="' + (top + 3) + '" width="' + (TW - 18) + '" height="' + (TH - 5) + '" rx="1.5" fill="#ece0c2" stroke="#8a7246" stroke-width=".8"/><text x="' + (tx + TW / 2) + '" y="' + (top + 10.6) + '" text-anchor="middle" font-family="Prompt,sans-serif" font-size="8.4" font-weight="700" fill="#4a3214">' + esc2(t[i]) + '</text>' : '<rect x="' + (tx + 9) + '" y="' + (top + 3) + '" width="' + (TW - 18) + '" height="' + (TH - 5) + '" rx="1.5" fill="#ece0c2" stroke="#8a7246" stroke-width=".8" opacity=".85"/>';
      s += '<g class="fd" style="animation-delay:' + (0.62 + i * 0.13).toFixed(2) + 's">' +
        '<path d="' + back + '" fill="url(#fdg' + (i % 3) + ')" stroke="#140a04" stroke-width=".9"/>' +
        '<path d="M' + (tx + 10) + ' ' + (top + 1) + 'H' + (tx + TW - 10) + '" stroke="rgba(255,225,180,.25)" stroke-width="1"/>' + lb +
        '<rect x="' + (x0 + 16) + '" y="' + p1y + '" width="' + (x1 - x0 - 40) + '" height="' + (H - p1y) + '" rx="1" fill="#e6d8b6" stroke="#8a6a3a" stroke-width=".6" transform="rotate(' + (i % 2 ? .6 : -.5) + ' ' + (x0 + 12) + ' ' + p1y + ')"/>' + lines +
        '<rect x="' + (x0 + 26) + '" y="' + p2y + '" width="' + (x1 - x0 - 60) + '" height="' + (H - p2y) + '" rx="1" fill="#efe4c8" stroke="#8a6a3a" stroke-width=".5"/>' +
        '<path d="M' + x0 + ' ' + (body + 9) + 'H' + x1 + 'V' + H + 'H' + x0 + 'Z" fill="url(#fdf' + (i % 3) + ')" stroke="#140a04" stroke-width=".9"/>' +
        '<path d="M' + (x0 + 1) + ' ' + (body + 9.8) + 'H' + (x1 - 1) + '" stroke="rgba(255,225,180,.22)" stroke-width="1"/></g>';
    }
    var defs = FC.map(function (c, k) { return '<linearGradient id="fdg' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient><linearGradient id="fdf' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '" stop-opacity=".98"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' + defs + '</defs>' + s + '</svg>';
  }
  function tabs() {
    var f = document.querySelector('#historyPanel .alx-files'); if (!f) return;
    var t = types(), key = 'v3|' + t.join('|'); if (f.getAttribute('data-k') === key) return; f.setAttribute('data-k', key);
    f.innerHTML = folders(t);
  }
  function build() {
    var h = document.querySelector('#historyPanel .vault-head'); if (!h || h.querySelector('.alx-cab-main')) return;
    var top = document.createElement('div'); top.className = 'alx-cab-top'; top.setAttribute('aria-hidden', 'true'); top.innerHTML = '<i></i><i></i><i></i>';
    var main = document.createElement('div'); main.className = 'alx-cab-main';
    main.innerHTML = '<i class="alx-grv" aria-hidden="true"></i><div class="alx-files" aria-hidden="true"></div>';
    var txt = h.querySelector('.vault-txt'); if (txt) main.appendChild(txt);
    var pull = document.createElement('i'); pull.className = 'alx-pull'; pull.setAttribute('aria-hidden', 'true'); pull.innerHTML = '<i></i><i></i>'; main.appendChild(pull);
    h.appendChild(top); h.appendChild(main); tabs();
  }
  function boot() {
    build();
    var sel = document.getElementById('histType'), list = document.getElementById('histList');
    if (window.MutationObserver) { if (sel) new MutationObserver(tabs).observe(sel, { childList: true }); if (list) new MutationObserver(tabs).observe(list, { childList: true }); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
