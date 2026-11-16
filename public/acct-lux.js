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
  var CREST = '<svg viewBox="0 0 40 46"><defs><linearGradient id="alxC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e2ad3a"/><stop offset="1" stop-color="#9a6410"/></linearGradient></defs><path d="M20 2L36 8V22C36 33 29 40 20 44C11 40 4 33 4 22V8Z" fill="rgba(40,8,10,.35)" stroke="url(#alxC)" stroke-width="2.6" stroke-linejoin="round"/><path d="M20 7L31 11.4V22C31 30 26 35.6 20 38.6C14 35.6 9 30 9 22V11.4Z" fill="none" stroke="url(#alxC)" stroke-width="1" opacity=".7"/><path d="M12.5 22.5L18 28L28 15.5" fill="none" stroke="url(#alxC)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function dressCard() {
    var c = document.querySelector('#authCard .vc-wcard'); if (!c || c.querySelector('.alx-spine')) return;
    var f = document.createElement('div'); f.className = 'alx-cf'; f.setAttribute('aria-hidden', 'true');
    var tw = ''; [[30, 22, 0], [72, 60, 1.3], [52, 86, 2.4], [88, 30, 3.1]].forEach(function (q) { tw += '<i class="alx-tw" style="left:' + q[0] + '%;top:' + q[1] + '%;animation-delay:' + q[2] + 's"></i>'; });
    f.innerHTML = '<i class="alx-spine"><b></b><b></b><b></b></i>' + ['tl', 'tr', 'bl', 'br'].map(function (k) { return '<i class="alx-stud ' + k + '"></i>'; }).join('') + '<i class="alx-crest">' + CREST + '<b></b></i><i class="alx-glare"></i>' + tw;
    c.insertBefore(f, c.firstChild);
    var bt = c.querySelector('.vc-wc-top-up'); if (bt && !bt.querySelector('.alx-coin')) { var ic = document.createElement('i'); ic.className = 'alx-coin'; ic.setAttribute('aria-hidden', 'true'); bt.insertBefore(ic, bt.firstChild); }
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
  function boot() { build(); dressCard(); dressHead();
    if (window.MutationObserver) new MutationObserver(watchOpen).observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    var card = document.getElementById('authCard'); if (card && window.MutationObserver) new MutationObserver(function () { if (!document.querySelector('#authCard .alx-spine')) dressCard(); dressHead(); }).observe(card, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
