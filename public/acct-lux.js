/* ของตกแต่งที่สคริปต์นี้สร้าง ใช้กับหน้ามือถือ (acct-lux.css โหลดเฉพาะจอ ≤767px) → จอคอม/แท็บเล็ตซ่อนทั้งหมด ไม่งั้นรูปจะขยายเต็มจอ (acct-lux.js v19) */
(function () { var s = document.createElement('style'); s.textContent = '@media (min-width:768px) and (max-width:1023px){.alx-bg,.alx-crest,.alx-glare,.alx-spine,.alx-stud,.alx-tw,.alx-coin,.alx-arr,.alx-stc,.alx-hd,.alx-cf,.alx-mg,.alx-cab-top,.alx-files,.alx-pull,.alx-grv,.alx-un,.alx-st{display:none!important}}'; (document.head || document.documentElement).appendChild(s); })();
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
/* ความเป็นส่วนตัวของข้อมูล: ไฮไลต์คำสำคัญ (ภาษาไทยเท่านั้น คืนข้อความเดิมเมื่อเปลี่ยนภาษา) (acct-lux.js v13) */
(function () {
  var KEY = ['ไม่เก็บข้อความสัญญาต้นฉบับ', 'ไม่บันทึกเนื้อหาสัญญาลง log', 'ไม่แสดงเนื้อหาจนกว่าคุณจะกดเปิด'];
  var orig = null;
  function apply() {
    var ul = document.querySelector('#privPanel .priv-list'); if (!ul) return;
    var th = (document.documentElement.getAttribute('data-lang') || 'th') === 'th';
    if (!th) { if (orig !== null && ul.getAttribute('data-hl')) { ul.innerHTML = orig; ul.removeAttribute('data-hl'); } return; }
    if (ul.getAttribute('data-hl')) return;
    orig = ul.innerHTML;
    [].forEach.call(ul.querySelectorAll('li'), function (li) {
      [].forEach.call(li.childNodes, function (n) {
        if (n.nodeType !== 3) return;
        for (var i = 0; i < KEY.length; i++) {
          var k = n.nodeValue.indexOf(KEY[i]); if (k < 0) continue;
          var after = n.splitText(k); after.splitText(KEY[i].length);
          var m = document.createElement('mark'); m.className = 'alx-hl'; m.textContent = KEY[i]; after.parentNode.replaceChild(m, after); break;
        }
      });
    });
    ul.setAttribute('data-hl', '1');
  }
  function boot() {
    apply();
    var tries = 0, iv = setInterval(function () { apply(); if (document.querySelector('#privPanel .priv-list[data-hl]') || ++tries > 20) clearInterval(iv); }, 500);
    if (window.MutationObserver) new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
/* แจ้งเตือนวันสำคัญ: ตอนว่างแสดง 2 ขั้นตอน (ภาษาไทย มือถือ) (acct-lux.js v14) */
(function () {
  var st = document.createElement('style'); st.textContent = '.alx-st{display:none}'; document.head.appendChild(st);
  function add() {
    if ((document.documentElement.getAttribute('data-lang') || 'th') !== 'th') return;
    var e = document.querySelector('.vrh .vrh-body div.vrh-empty'); if (!e || e.querySelector('.alx-st')) return;
    var ol = document.createElement('ol'); ol.className = 'alx-st';
    ol.innerHTML = '<li><span><b>ตรวจสัญญา</b>ระบบจะหาวันสิ้นสุด วันแจ้งล่วงหน้า และวันชำระเงินให้</span></li><li><span><b>บันทึกแจ้งเตือน</b>กดบันทึกท้ายผลตรวจ หรือกด "+ เพิ่มเอง" ด้านบน</span></li>';
    e.appendChild(ol);
  }
  function watch() {
    var b = document.querySelector('.vrh .vrh-body'); if (!b) return false;
    add(); if (window.MutationObserver) new MutationObserver(add).observe(b, { childList: true }); return true;
  }
  function boot() { if (watch()) return; var n = 0, iv = setInterval(function () { if (watch() || ++n > 120) clearInterval(iv); }, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
/* แจ้งปัญหา: ตัวนับใกล้เต็มเปลี่ยนสี (acct-lux.js v15) */
document.addEventListener('input', function (e) {
  if (!e.target || e.target.id !== 'vtsMsg') return;
  var c = document.getElementById('vtsCnt'); if (c) c.classList.toggle('alx-near', e.target.value.length >= 900);
}, true);
/* พรีวิวประเภทสัญญา: แยก "ใช้กับ:" / "เน้นตรวจ:" เป็นป้ายหัวข้อ + เลื่อนแผ่นป้ายขึ้นเมื่อเปลี่ยน (acct-lux.js v18: + ไฮไลต์คำสำคัญ) */
(function () {
  var last = '';
  var HL = ['ไม่รู้ว่าเป็นแบบไหน', 'หลายเรื่องรวมกัน', 'เลือกประเภทให้เอง', 'เงินมัดจำ', 'การคืนเงินประกัน', 'การส่งมอบ', 'ความรับผิดเมื่อชำรุด', 'ค่าจ้าง', 'การเลิกจ้าง', 'ขอบเขตงาน', 'งวดเงิน', 'ดอกเบี้ย', 'หลักประกัน', 'การแบ่งกำไร', 'การออกจากหุ้นส่วน', 'ห้ามเปิดเผยข้อมูล', 'ค่าเสียหาย', 'มักเสียเปรียบ'];
  function hlIn(el) {
    var txt = el.textContent, out = [], i = 0;
    while (i < txt.length) {
      var best = -1, w = '';
      HL.forEach(function (h) { var k = txt.indexOf(h, i); if (k >= 0 && (best < 0 || k < best)) { best = k; w = h; } });
      if (best < 0) { out.push(document.createTextNode(txt.slice(i))); break; }
      if (best > i) out.push(document.createTextNode(txt.slice(i, best)));
      var m = document.createElement('mark'); m.className = 'alx-hl'; m.textContent = w; out.push(m); i = best + w.length;
    }
    if (el.querySelector('mark')) return; el.textContent = ''; out.forEach(function (n) { el.appendChild(n); });
  }
  /* v20: "เน้นตรวจ" → "ระบบดูให้" เป็นเม็ด ✓ + ตัวอย่างจริง 1 บรรทัด (ภาษาไทยเท่านั้น) */
  var EX = { rent: 'ข้อที่ไม่ได้บอกว่าจะคืนเงินประกันเมื่อไหร่', sale: 'ข้อที่ไม่ได้บอกว่าของชำรุดหลังส่งมอบ ใครรับผิดชอบ', employment: 'ข้อที่ให้เลิกจ้างได้ทันทีโดยไม่ต้องแจ้งล่วงหน้า', service: 'ข้อที่ไม่จำกัดจำนวนครั้งที่ต้องแก้งาน', loan: 'ข้อที่คิดค่าปรับเพิ่มทุกวันเมื่อจ่ายช้า', shareholder: 'ข้อที่ไม่ได้บอกว่าถอนตัวแล้วจะได้เงินลงทุนคืนอย่างไร', nda: 'ข้อที่ไม่ได้กำหนดว่าห้ามเปิดเผยนานแค่ไหน', other: 'ข้อที่ให้อีกฝ่ายเปลี่ยนเงื่อนไขได้ฝ่ายเดียว' };
  function th() { return (document.documentElement.getAttribute('data-lang') || 'th') === 'th'; }
  /* v22: ประโยชน์ 2 ข้อบนการ์ด + แผ่นรายละเอียด (รายการตรวจ 8 เรื่อง · ประโยชน์เพิ่ม · ใช้กับ · ตัวอย่าง) */
  /* ข้อความอิงจาก TYPE_FOCUS ใน server/ai.js — ถ้าแก้ฝั่งเซิร์ฟเวอร์ ต้องแก้ตรงนี้ให้ตรงกัน (ห้ามเขียนเกินสิ่งที่ระบบทำจริง) */
  var INFO = {
    unsure: { h: 'ระบบทำอะไรให้', b: ['ไม่ต้องเลือกประเภทเอง ระบบลองระบุจากข้อความให้', 'ถ้าดูไม่ออก ระบบถูกตั้งให้บอกตรงๆ แทนการเดา', 'ยกข้อความจากสัญญามาให้ดู ถ้าหาไม่เจอในสัญญาจะติดป้ายบอก', 'เสนอแนวทางขอแก้ และบอกเรื่องที่ระบบไม่พบในสัญญา'], c: ['อ่านจากข้อความในสัญญา', 'ลองระบุประเภทสัญญา', 'ดูไม่ออก จะบอกตรงๆ'] },
    rent: { b: ['ดูข้อเรื่องเงินประกันและมัดจำ ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องค่าซ่อมและความเสียหาย พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ค่าเช่าและการขึ้นค่าเช่า', 'เงินประกันและการคืนเงิน', 'การบอกเลิกสัญญา', 'การคืนมัดจำ', 'การซ่อมแซม', 'ความรับผิดเมื่อเสียหาย'] },
    sale: { b: ['ดูข้อเรื่องการชำระเงินและการส่งมอบ ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องของชำรุดและการยกเลิก พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ราคาและวิธีชำระ', 'การส่งมอบ', 'ความเสี่ยงระหว่างส่งมอบ', 'การรับประกันความชำรุด', 'การคืนสินค้าหรือยกเลิก'] },
    employment: { b: ['ดูข้อเรื่องค่าจ้าง เวลาทำงาน และสวัสดิการ ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องการเลิกจ้างและการแจ้งล่วงหน้า พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ค่าจ้างและการจ่ายตรงเวลา', 'ชั่วโมงหรือระยะเวลาทำงาน', 'โบนัสและสวัสดิการ', 'การเลิกจ้างและแจ้งล่วงหน้า', 'สิทธิในงานที่สร้างขณะทำงาน'] },
    service: { b: ['ดูข้อเรื่องขอบเขตงานและจำนวนครั้งที่แก้ได้ ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องค่าปรับ ลิขสิทธิ์ และการยกเลิก พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ขอบเขตงานและการส่งมอบ', 'กำหนดเวลาและค่าปรับ', 'การแก้งานและจำนวนครั้ง', 'ลิขสิทธิ์ของงาน', 'การจ่ายเงินเมื่อยกเลิกกลางคัน'] },
    loan: { b: ['ดูข้อเรื่องดอกเบี้ย ค่าธรรมเนียม และค่าปรับ ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องการผิดนัดและหลักประกัน พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ดอกเบี้ยและค่าธรรมเนียม', 'กำหนดคืนเงินและงวดชำระ', 'การผิดนัดและค่าปรับ', 'หลักประกัน'] },
    shareholder: { b: ['ดูข้อเรื่องเงินลงทุนและการแบ่งกำไร ว่ามีจุดที่ควรคุยให้ชัดไหม', 'ดูข้อเรื่องการถอนตัวและการโอนหุ้น พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['สัดส่วนการลงทุน', 'การแบ่งกำไร', 'หน้าที่และการตัดสินใจ', 'การถอนตัวและการโอนหุ้น', 'การระงับข้อพิพาท'] },
    nda: { b: ['ดูว่าสัญญากำหนดข้อมูลลับและข้อยกเว้นไว้อย่างไร', 'ดูข้อเรื่องระยะเวลาและค่าเสียหาย ว่ามีจุดที่ควรถามไหม', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['ขอบเขตของข้อมูลลับ', 'ข้อยกเว้นการเปิดเผย', 'ระยะเวลาคุ้มครอง', 'ค่าเสียหายและการบังคับใช้'] },
    other: { b: ['ดูข้อเรื่องการชำระเงินและการยกเลิก ว่ามีจุดที่ควรถามไหม', 'ดูข้อเรื่องความรับผิดและค่าเสียหาย พร้อมอธิบายภาษาง่าย', 'ยกข้อความจริงจากสัญญามาให้ดู พร้อมคำอธิบายภาษาง่าย', 'แนะนำข้อความที่ใช้ขอแก้ และบอกเรื่องที่สัญญายังไม่ได้เขียนไว้'], c: ['เงื่อนไขการชำระเงิน', 'ระยะเวลาและการยกเลิก', 'ความรับผิดและค่าเสียหาย', 'การระงับข้อพิพาท'] }
  };
  var WARN = [
    'อย่าใช้ผลตรวจแทนการอ่านสัญญาเอง และอย่าใช้แทนคำปรึกษาจากทนาย',
    'ระบบไม่พบจุดเสี่ยง ไม่ได้แปลว่าสัญญาปลอดภัยหรือเซ็นได้เลย',
    'AI อาจอ่านผิดหรือตกหล่น ควรเทียบข้อความที่ยกมากับสัญญาฉบับจริงทุกครั้ง',
    'ส่งสัญญาให้ครบทุกหน้า ส่วนที่ไม่ได้ส่ง ระบบจะไม่ได้ตรวจ',
    'อย่าส่งแนวทางขอแก้ให้อีกฝ่ายโดยไม่อ่านทวนและปรับให้ตรงกับกรณีของคุณ',
    'ใช้ "ปกปิดข้อมูลส่วนตัว" ก่อนส่ง และตรวจอีกครั้งว่าไม่มีข้อมูลที่ไม่จำเป็น เช่น เลขบัตรประชาชน เลขบัญชี',
    'สัญญาเงินก้อนใหญ่ อสังหาริมทรัพย์ หรือมีผลทางกฎหมายสูง ควรให้ทนายตรวจก่อนเซ็น'
  ];
  var sheet = null;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fillSheet(cap, ct) {
    var I = INFO[ct]; if (!I) return; sheet.setAttribute('data-ct', ct);
    var nm = (cap.querySelector('.vcp-cn') || {}).textContent || '', ue = cap.querySelector('.vcp-use .alx-tx'), use = ue ? ue.textContent : '';
    sheet.querySelector('.alx-sh-in').innerHTML =
      '<div class="alx-sh-hd"><b>' + esc(nm) + '</b><button type="button" class="alx-sh-x" aria-label="ปิด">✕</button></div>' +
      '<h4>' + (I.h || 'เรื่องที่ระบบเน้นดู') + '</h4><ul class="alx-sh-c">' + I.c.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<h4>สิ่งที่ระบบช่วยได้</h4><ul class="alx-sh-b">' + I.b.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (use ? '<h4>ใช้กับ</h4><p class="alx-sh-u">' + esc(use) + '</p>' : '') +
      (EX[ct] ? '<p class="alx-sh-ex">ตัวอย่างข้อที่ระบบอาจชี้: ' + esc(EX[ct]) + '</p>' : '') +
      '<p class="alx-sh-ft">ระบบอ่านข้อความที่คุณส่งทั้งหมด (ไม่เกิน 20,000 ตัวอักษร) แล้วสรุปจุดที่ควรดูได้สูงสุด 10 ข้อ เรียงจากเรื่องที่ควรระวังก่อน เรื่องนอกรายการนี้ก็อาจถูกชี้ได้</p>' +
      '<h4 class="alx-sh-wh">ข้อควรระวัง</h4><ul class="alx-sh-w">' + WARN.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p class="alx-sh-dc">Vellum Check เป็นเครื่องมือคัดกรองเบื้องต้นด้วย AI ไม่ใช่ทนายความ และไม่ใช่คำปรึกษาทางกฎหมาย</p>';
    sheet.querySelector('.alx-sh-in').scrollTop = 0;
  }
  function openSheet(cap) {
    var st = cap.closest('.vcp-stage'); if (!st) return;
    if (!sheet) {
      sheet = document.createElement('div'); sheet.className = 'alx-sh'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'รายละเอียดประเภทสัญญา');
      sheet.innerHTML = '<div class="alx-sh-in"></div>'; st.appendChild(sheet);
      sheet.addEventListener('click', function (e) { if (e.target.closest('.alx-sh-x')) closeSheet(); });
      sheet.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    }
    fillSheet(cap, st.dataset.ct); void sheet.offsetWidth; sheet.classList.add('is-on'); st.classList.add('alx-sh-open');
    var mb = cap.querySelector('.alx-more'); if (mb) mb.setAttribute('aria-expanded', 'true');
    var x = sheet.querySelector('.alx-sh-x'); if (x) x.focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheet) return; sheet.classList.remove('is-on'); var st = sheet.closest('.vcp-stage'); if (st) st.classList.remove('alx-sh-open');
    var mb = document.querySelector('#vcp .alx-more'); if (mb) { mb.setAttribute('aria-expanded', 'false'); mb.focus({ preventScroll: true }); }
  }
  document.addEventListener('click', function (e) { if (sheet && e.target.closest && e.target.closest('#vcp [data-x],#vcp .vcp-ok')) { sheet.classList.remove('is-on'); var st = sheet.closest('.vcp-stage'); if (st) st.classList.remove('alx-sh-open'); } }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && sheet.classList.contains('is-on')) { e.stopPropagation(); closeSheet(); } }, true);
  function fix() {
    var cap = document.querySelector('#vcp .vcp-cap'); if (!cap) return false;
    ['.vcp-use', '.vcp-cs'].forEach(function (s) {
      var e = cap.querySelector(s); if (!e || e.querySelector('.alx-k')) return;
      var m = /^([^:：]{1,24})[:：]\s*/.exec(e.textContent || ''); if (!m) return;
      var rest = e.textContent.slice(m[0].length), isCs = s === '.vcp-cs';
      e.innerHTML = ''; var k = document.createElement('span'); k.className = 'alx-k'; k.textContent = isCs && th() ? 'ระบบดูให้' : m[1];
      var r = document.createElement('span'); r.className = 'alx-tx';
      var parts = rest.trim().split(/\s+/);
      if (isCs && th() && parts.length > 1) { r.className = 'alx-tx alx-pills'; parts.forEach(function (w) { var b = document.createElement('i'); b.textContent = w; r.appendChild(b); }); }
      else r.textContent = rest;
      e.appendChild(k); e.appendChild(r);
    });
    var st = cap.closest('.vcp-stage'), ct = st && st.dataset.ct, ex = cap.querySelector('.alx-ex');
    if (!ex) { ex = document.createElement('span'); ex.className = 'alx-ex'; cap.appendChild(ex); }
    var want = th() && EX[ct] ? 'ตัวอย่างข้อที่ระบบอาจชี้: ' + EX[ct] : '';
    if (ex.textContent !== want) ex.textContent = want; ex.hidden = !want;
    var useTh = th() && !!INFO[ct]; cap.classList.toggle('alx-th', useTh);
    if (useTh) {
      var bn = cap.querySelector('.alx-ben'); if (!bn) { bn = document.createElement('ul'); bn.className = 'alx-ben'; cap.insertBefore(bn, cap.querySelector('.vcp-use') || null); }
      if (bn.getAttribute('data-ct') !== ct) { bn.setAttribute('data-ct', ct); bn.innerHTML = INFO[ct].b.slice(0, 2).map(function (t) { return '<li>' + t + '</li>'; }).join(''); }
    }
    var mb = cap.querySelector('.alx-more');
    if (!mb) {
      mb = document.createElement('button'); mb.type = 'button'; mb.className = 'alx-more'; mb.setAttribute('aria-expanded', 'false');
      mb.addEventListener('click', function (e) {
        e.stopPropagation();
        if (cap.classList.contains('alx-th')) { openSheet(cap); return; }
        var o = cap.classList.toggle('alx-open'); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); mb.textContent = o ? 'Less' : 'More';
      });
      var row = document.createElement('div'); row.className = 'alx-mrow'; row.appendChild(mb);
      var dc = document.createElement('span'); dc.className = 'alx-dc'; dc.textContent = 'ผลจาก AI ไม่ใช่คำปรึกษาทางกฎหมาย'; row.appendChild(dc);
      cap.appendChild(row);
    }
    var lbl = useTh ? (ct === 'unsure' ? 'ดูว่าระบบทำอะไรให้' : 'ดูเรื่องที่ระบบเน้นดู') : (cap.classList.contains('alx-open') ? 'Less' : 'More');
    if (mb.textContent !== lbl) mb.textContent = lbl;
    if (sheet && sheet.classList.contains('is-on') && sheet.getAttribute('data-ct') !== ct) fillSheet(cap, ct);
    var cn = cap.querySelector('.vcp-cn'), now = cn ? cn.textContent : '';
    if (now && now !== last) { last = now; cap.classList.remove('alx-up'); void cap.offsetWidth; cap.classList.add('alx-up'); }
    return true;
  }
  function boot() {
    var cap = document.querySelector('#vcp .vcp-cap');
    if (!cap) { var n = 0, iv = setInterval(function () { if (document.querySelector('#vcp .vcp-cap') || ++n > 60) { clearInterval(iv); boot2(); } }, 1000); return; }
    boot2();
  }
  function boot2() {
    var cap = document.querySelector('#vcp .vcp-cap'); if (!cap || !window.MutationObserver) return;
    fix(); new MutationObserver(fix).observe(cap, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
/* พรีวิว "ไม่แน่ใจ": ฉากประกอบวาดด้วย SVG (acct-lux.js v17) */
(function () {
  var st = document.createElement('style'); st.textContent = '.alx-un{display:none}'; document.head.appendChild(st);
  var SVG = '<svg viewBox="0 0 360 170" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="unW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4428"/><stop offset="1" stop-color="#3e2616"/></linearGradient><linearGradient id="unP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece0c2"/><stop offset="1" stop-color="#d6c49a"/></linearGradient><linearGradient id="unG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d6a4"/><stop offset=".55" stop-color="#c9a862"/><stop offset="1" stop-color="#8a6c38"/></linearGradient><radialGradient id="unL" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6dc" stop-opacity=".35"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient></defs><ellipse cx="180" cy="160" rx="170" ry="12" fill="#000" opacity=".35"/><path d="M20 150L48 118H312L340 150Z" fill="url(#unW)" stroke="#140a04" stroke-width=".8"/><g transform="rotate(-8 120 112)"><rect x="76" y="62" width="84" height="66" rx="2" fill="#cdb98c" stroke="#6a5030" stroke-width=".7"/></g><g transform="rotate(5 140 108)"><rect x="96" y="58" width="84" height="66" rx="2" fill="url(#unP)" stroke="#6a5030" stroke-width=".7"/><path d="M104 72h50M104 80h66M104 88h60M104 96h66M104 104h44" stroke="#9a7e52" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></g><g transform="rotate(-2 150 112)"><rect x="112" y="70" width="84" height="62" rx="2" fill="url(#unP)" stroke="#6a5030" stroke-width=".8"/><path d="M120 84h48M120 92h66M120 100h62M120 108h66M120 116h40" stroke="#9a7e52" stroke-width="1.6" stroke-linecap="round" opacity=".6"/><path d="M168 122c4-3 8-3 12 0" stroke="#7a4a20" stroke-width="1.3" fill="none" stroke-linecap="round"/></g><g class="mg"><circle cx="150" cy="96" r="19" fill="url(#unL)" stroke="url(#unG)" stroke-width="4.5"/><circle cx="150" cy="96" r="19" fill="none" stroke="#3a2208" stroke-width=".8" opacity=".6"/><path d="M164 110l16 16" stroke="#3a2414" stroke-width="7" stroke-linecap="round"/><path d="M164 110l5 5" stroke="url(#unG)" stroke-width="6" stroke-linecap="round"/><path d="M140 88a12 12 0 0 1 9-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/></g><g><g class="fd" style="animation-delay:0s"><path d="M221 56Q221 53 224 53H212Q214 53 215.5 50L217.5 42.5Q218.5 40 221.5 40H240.5Q243.5 40 244.5 42.5L246.5 50Q248 53 250 53H334Q337 53 337 56V128H221Z" fill="#3c5444" stroke="#140a04" stroke-width=".8"/><rect x="219" y="42.6" width="24" height="8.4" rx="1.2" fill="#ece0c2" stroke="#8a7246" stroke-width=".6"/><text x="231.0" y="49" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="700" font-size="6.2" fill="#4a3214">เช่า</text><path class="ft" style="animation-delay:0s" d="M215.5 52L217.5 42.5Q218.5 40 221.5 40H240.5Q243.5 40 244.5 42.5L246.5 52" fill="none" stroke="#f0dca8" stroke-width="1.4" stroke-linejoin="round"/><rect x="229" y="55" width="98" height="40" rx="1" fill="#e6d8b6" stroke="#8a6a3a" stroke-width=".5"/><path d="M235 59H307M235 62H293" stroke="#a08458" stroke-width=".7" opacity=".55"/><path d="M221 62H337V128H221Z" fill="#2a3c30" stroke="#140a04" stroke-width=".8"/><path d="M222 62.8H336" stroke="rgba(255,225,180,.22)" stroke-width=".9"/></g><g class="fd" style="animation-delay:2s"><path d="M218 65Q218 62 221 62H244Q246 62 247.5 59L249.5 51.5Q250.5 49 253.5 49H272.5Q275.5 49 276.5 51.5L278.5 59Q280 62 282 62H337Q340 62 340 65V128H218Z" fill="#6a4a2a" stroke="#140a04" stroke-width=".8"/><rect x="251" y="51.6" width="24" height="8.4" rx="1.2" fill="#ece0c2" stroke="#8a7246" stroke-width=".6"/><text x="263.0" y="58" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="700" font-size="6.2" fill="#4a3214">จ้าง</text><path class="ft" style="animation-delay:2s" d="M247.5 61L249.5 51.5Q250.5 49 253.5 49H272.5Q275.5 49 276.5 51.5L278.5 61" fill="none" stroke="#f0dca8" stroke-width="1.4" stroke-linejoin="round"/><rect x="226" y="65" width="104" height="40" rx="1" fill="#e6d8b6" stroke="#8a6a3a" stroke-width=".5"/><path d="M232 69H310M232 72H296" stroke="#a08458" stroke-width=".7" opacity=".55"/><path d="M218 71H340V128H218Z" fill="#4a321c" stroke="#140a04" stroke-width=".8"/><path d="M219 71.8H339" stroke="rgba(255,225,180,.22)" stroke-width=".9"/></g><g class="fd" style="animation-delay:4s"><path d="M215 74Q215 71 218 71H276Q278 71 279.5 68L281.5 60.5Q282.5 58 285.5 58H304.5Q307.5 58 308.5 60.5L310.5 68Q312 71 314 71H340Q343 71 343 74V128H215Z" fill="#3e4c62" stroke="#140a04" stroke-width=".8"/><rect x="283" y="60.6" width="24" height="8.4" rx="1.2" fill="#ece0c2" stroke="#8a7246" stroke-width=".6"/><text x="295.0" y="67" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="700" font-size="7.2" fill="#4a3214">กู้</text><path class="ft" style="animation-delay:4s" d="M279.5 70L281.5 60.5Q282.5 58 285.5 58H304.5Q307.5 58 308.5 60.5L310.5 70" fill="none" stroke="#f0dca8" stroke-width="1.4" stroke-linejoin="round"/><rect x="223" y="73" width="110" height="40" rx="1" fill="#e6d8b6" stroke="#8a6a3a" stroke-width=".5"/><path d="M229 77H313M229 80H299" stroke="#a08458" stroke-width=".7" opacity=".55"/><path d="M215 80H343V128H215Z" fill="#2c3648" stroke="#140a04" stroke-width=".8"/><path d="M216 80.8H342" stroke="rgba(255,225,180,.22)" stroke-width=".9"/></g><g class="fd" style="animation-delay:6s"><path d="M212 83Q212 80 215 80H308Q310 80 311.5 77L313.5 69.5Q314.5 67 317.5 67H336.5Q339.5 67 340.5 69.5L342.5 77Q344 80 346 80H343Q346 80 346 83V128H212Z" fill="#6a3a3e" stroke="#140a04" stroke-width=".8"/><rect x="315" y="69.6" width="24" height="8.4" rx="1.2" fill="#ece0c2" stroke="#8a7246" stroke-width=".6"/><text x="327.0" y="76" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="700" font-size="6.2" fill="#4a3214">ซื้อขาย</text><path class="ft" style="animation-delay:6s" d="M311.5 79L313.5 69.5Q314.5 67 317.5 67H336.5Q339.5 67 340.5 69.5L342.5 79" fill="none" stroke="#f0dca8" stroke-width="1.4" stroke-linejoin="round"/><rect x="220" y="83" width="116" height="40" rx="1" fill="#e6d8b6" stroke="#8a6a3a" stroke-width=".5"/><path d="M226 87H316M226 90H302" stroke="#a08458" stroke-width=".7" opacity=".55"/><path d="M212 89H346V128H212Z" fill="#4a262c" stroke="#140a04" stroke-width=".8"/><path d="M213 89.8H345" stroke="rgba(255,225,180,.22)" stroke-width=".9"/></g></g><path d="M206 98H352V130H206Z" fill="url(#unW)" stroke="#140a04" stroke-width=".9"/><path d="M207 99H351" stroke="rgba(255,220,170,.22)" stroke-width="1"/><rect x="263" y="106" width="32" height="12" rx="1.5" fill="#d9c8a0" stroke="#8e7648" stroke-width="1.4"/><path d="M268 112h22" stroke="#9a7e52" stroke-width="1" opacity=".6"/><circle cx="259" cy="112" r="1.6" fill="#b8955a"/><circle cx="299" cy="112" r="1.6" fill="#b8955a"/></svg>';
  function add() {
    var stage = document.querySelector('#vcp .vcp-stage'); if (!stage) return false;
    if (stage.querySelector('.alx-un')) return true;
    var d = document.createElement('div'); d.className = 'alx-un'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = SVG + '<div class="st"><i>1</i>อ่านข้อความ<br><i>2</i>หาประเภทสัญญา<br><i>3</i>สรุปจุดที่ควรดู</div><div class="bd">ระบบลองระบุประเภทให้</div>';
    stage.insertBefore(d, stage.querySelector('.vcp-cap'));
    return true;
  }
  function boot() { if (add()) return; var n = 0, iv = setInterval(function () { if (add() || ++n > 60) clearInterval(iv); }, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* คำแนะนำ "แตะ ⊕" ครั้งแรก: ถ้าจุดอยู่หลังกรอบคำอธิบาย ไม่ต้องโชว์ทับข้อความในกรอบ (acct-lux.js v20) */
(function () {
  if (!window.MutationObserver || !window.matchMedia || !matchMedia('(max-width:767px)').matches) return;
  var n = 0, iv = setInterval(function () {
    var h = document.querySelector('#vcp .vcp-hint-spot'), cap = document.querySelector('#vcp .vcp-cap');
    if (!h || !cap) { if (++n > 90) clearInterval(iv); return; } clearInterval(iv);
    new MutationObserver(function () {
      var m = /translate\(\s*[-\d.]+px,\s*([-\d.]+)px/.exec(h.style.transform || ''); if (!m) return;
      var under = +m[1] + 30 > cap.offsetTop; if (h.classList.contains('alx-off') !== under) h.classList.toggle('alx-off', under);
    }).observe(h, { attributes: true, attributeFilter: ['style'] });
  }, 1000);
})();
/* ตอนลากหมุนโมเดล 3D: การ์ดคำอธิบายจางเหลือแค่หัวข้อ ปล่อยมือ 2 วินาทีค่อยกลับ (acct-lux.js v21) */
(function () {
  if (!window.matchMedia || !matchMedia('(max-width:767px)').matches) return;
  var tm = 0;
  document.addEventListener('pointerdown', function (e) {
    var t = e.target; if (!t || !t.closest || !t.closest('#vcp .vcp-stage canvas')) return;
    var st = t.closest('.vcp-stage'); clearTimeout(tm); st.classList.add('alx-drag');
    function up() { document.removeEventListener('pointerup', up, true); document.removeEventListener('pointercancel', up, true); clearTimeout(tm); tm = setTimeout(function () { st.classList.remove('alx-drag'); }, 2000); }
    document.addEventListener('pointerup', up, true); document.addEventListener('pointercancel', up, true);
  }, { passive: true, capture: true });
})();
