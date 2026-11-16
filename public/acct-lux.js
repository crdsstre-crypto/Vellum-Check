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
      '<svg class="alx-pen" viewBox="0 0 200 40"><rect x="18" y="12" width="132" height="16" rx="8" fill="#141416"/><rect x="18" y="12" width="132" height="5" rx="2.5" fill="#2a2a30"/><rect x="104" y="11" width="8" height="18" rx="1" fill="#c99a3a"/><path d="M150 13L186 20L150 27Z" fill="#d9b25a"/><path d="M150 20H182" stroke="#6a4808" stroke-width="1"/><rect x="40" y="9" width="44" height="4" rx="2" fill="#c99a3a"/></svg>' +
      /* แว่นอ่านหนังสือ ขอบล่างซ้าย */
      '<svg class="alx-gls" viewBox="0 0 200 80"><g fill="rgba(200,220,255,.05)" stroke="#a88a52" stroke-width="5"><circle cx="58" cy="44" r="30"/><circle cx="142" cy="44" r="30"/></g><path d="M88 40Q100 30 112 40" stroke="#a88a52" stroke-width="5" fill="none"/><path d="M28 38L4 22" stroke="#a88a52" stroke-width="5" stroke-linecap="round"/><path d="M44 30q8-6 18-6" stroke="#fff" stroke-width="3" fill="none" opacity=".25" stroke-linecap="round"/></svg>' +
      '<div class="alx-dust">' + dust + '</div><div class="alx-v"></div>';
    card.insertBefore(bg, card.firstChild);
  }
  /* การ์ดเครดิตแบบสมุดบัญชีหนัง: มุมโลหะทอง 4 มุม · ตราโล่ปั๊มทอง · แสงโคมตกกระทบ */
  var CORNER = '<svg viewBox="0 0 30 30"><path d="M2 28V8Q2 2 8 2H28L22 8H10Q8 8 8 10V22Z" fill="url(#alxG)" stroke="#5c3a06" stroke-width="1.2" stroke-linejoin="round"/><path d="M5 22V9Q5 5 9 5H22" fill="none" stroke="#fff3c4" stroke-width=".9" opacity=".7"/><circle cx="7.6" cy="7.6" r="1.6" fill="#7a4d08"/><path d="M12 11q3 0 3 3" fill="none" stroke="#7a4d08" stroke-width=".8"/><defs><linearGradient id="alxG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0bd"/><stop offset=".45" stop-color="#e2ad3a"/><stop offset="1" stop-color="#8a5a10"/></linearGradient></defs></svg>';
  /* ตัว V ปั๊มทองแบบโลโก้แบรนด์ (แทนโล่) */
  var CREST = '<svg viewBox="0 0 40 46"><defs><linearGradient id="alxC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ebb84a"/><stop offset="1" stop-color="#9a6410"/></linearGradient></defs>' +
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
  function boot() { build(); dressCard(); dressHead(); dressGroups();
    if (window.MutationObserver) new MutationObserver(watchOpen).observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    new MutationObserver(dressGroups).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    var card = document.getElementById('authCard'); if (card && window.MutationObserver) new MutationObserver(function () { if (!document.querySelector('#authCard .alx-spine')) dressCard(); dressHead(); dressGroups(); }).observe(card, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
