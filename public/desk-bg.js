/* desk-bg.js — พื้นหลังหน้าตรวจสัญญา ต่อเนื่องจากหน้าปก
   1) โต๊ะไม้ลายเดียวกับหน้าปก แต่หรี่มืดลงมาก + ขอบภาพมืด
   2) แสงโคมไฟอุ่น ๆ จากมุมซ้ายบน (หายใจช้า ๆ)
   3) แสงสีเปลี่ยนตามขั้นตอนที่กำลังทำ: 1 ทอง · 2 เขียวอมฟ้า · 3 ฟ้าเทอร์ควอยซ์ · ผลตรวจ ม่วงอ่อน
   - ชั้นพื้นหลังเป็น position:fixed z-index:-2 (ทับพื้นหินเดิม #vcBackdrop ที่ -3) ไม่รับการแตะ
   - ใช้เฉพาะหน้า desk ที่ไม่ใช่หน้าบัญชี (data-desk="acct")
   - ปิด: ลบ <script src="desk-bg.js"> ออกจาก index.html */
(function () {
  'use strict';
  if (window.__vcDeskBg) return; window.__vcDeskBg = 1;
  var root = document.documentElement;
  var SEL = 'html[data-view="desk"]:not([data-desk="acct"])';
  var grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .32' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 .1 0 0 0 0 .06 0 0 0 0 .03 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";
  var css =
    '@property --dbg-c{syntax:"<color>";inherits:true;initial-value:rgba(246,196,110,.16)}' +
    '@property --dbg-c2{syntax:"<color>";inherits:true;initial-value:rgba(246,196,110,.07)}' +
    '#vcDeskBg{position:fixed;inset:0;z-index:-2;pointer-events:none;display:none;opacity:0;transition:opacity .8s ease;' +
      '--dbg-c:rgba(246,196,110,.16);--dbg-c2:rgba(246,196,110,.07);transition:opacity .8s ease,--dbg-c 1.2s ease,--dbg-c2 1.2s ease}' +
    SEL + ' #vcDeskBg{display:block}' +
    'html.vc-dbg-in #vcDeskBg{opacity:1}' +
    /* โต๊ะไม้ (หรี่มืด) */
    '#vcDeskBg .w{position:absolute;inset:-2px;background:' +
      'linear-gradient(rgba(9,6,4,.80),rgba(9,6,4,.86)),' +
      grain + ' 0 0/600px 600px,' +
      'repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 118px,rgba(0,0,0,.32) 118px 121px),' +
      'repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0 7px,rgba(0,0,0,.04) 7px 13px,rgba(255,255,255,.02) 13px 29px),' +
      'linear-gradient(180deg,#5b3a22,#4a2e1a 60%,#3b2414)}' +
    /* แสงโคมไฟมุมซ้ายบน */
    '#vcDeskBg .l{position:absolute;inset:0;mix-blend-mode:screen;animation:vcDbgBr 7s ease-in-out infinite;background:' +
      'radial-gradient(75% 55% at 6% -4%,rgba(255,206,140,.26),rgba(255,170,90,.09) 38%,transparent 68%),' +
      'radial-gradient(28% 22% at 4% 0%,rgba(255,236,190,.22),transparent 70%)}' +
    '@keyframes vcDbgBr{50%{opacity:.82}}' +
    /* แสงสีตามขั้นตอน */
    '#vcDeskBg .s{position:absolute;inset:0;mix-blend-mode:screen;background:' +
      'radial-gradient(70% 42% at 72% 30%,var(--dbg-c),transparent 72%),' +
      'radial-gradient(90% 40% at 30% 100%,var(--dbg-c2),transparent 70%)}' +
    /* ขอบภาพมืด */
    '#vcDeskBg .v{position:absolute;inset:0;background:radial-gradient(ellipse 120% 95% at 50% 45%,transparent 45%,rgba(0,0,0,.72))}' +
    '@media (max-width:767px){#vcDeskBg .l{background:radial-gradient(110% 45% at 0% -4%,rgba(255,206,140,.24),rgba(255,170,90,.08) 40%,transparent 70%)}' +
      '#vcDeskBg .s{background:radial-gradient(120% 40% at 80% 26%,var(--dbg-c),transparent 72%),radial-gradient(130% 36% at 20% 100%,var(--dbg-c2),transparent 70%)}}' +
    /* การ์ดโปร่งขึ้นเล็กน้อยให้เห็นโต๊ะไม้ลอดผ่าน (เบลอหลังการ์ดเพื่อให้อ่านง่ายเหมือนเดิม) */
    'html.vc-art[data-view="desk"][data-desk="check"]{--k-card:rgba(20,17,15,.8)}' +
    'html.vc-art[data-view="desk"][data-desk="check"] main > :is(#checkCard,#resultCard){-webkit-backdrop-filter:blur(14px) saturate(1.15);backdrop-filter:blur(14px) saturate(1.15)}' +
    '@media (max-width:1023px){html.vc-art[data-view="desk"][data-desk="check"] body main #checkCard.vc-boxed > .vc-box.vc-box{background:rgba(22,18,16,.8) !important;-webkit-backdrop-filter:blur(14px) saturate(1.15);backdrop-filter:blur(14px) saturate(1.15)}' +
      '#vcDeskBg .w{background:linear-gradient(rgba(9,6,4,.7),rgba(9,6,4,.8)),' + grain + ' 0 0/600px 600px,repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 96px,rgba(0,0,0,.32) 96px 99px),linear-gradient(180deg,#5b3a22,#4a2e1a 60%,#3b2414)}}' +
    '@media (prefers-reduced-motion:reduce){#vcDeskBg .l{animation:none}}';
  /* สีของแต่ละขั้น [หลัก, รอง] */
  var COL = [
    ['rgba(246,196,110,.24)', 'rgba(246,196,110,.12)'],   /* 1 เลือกประเภทและใส่สัญญา */
    ['rgba(60,210,160,.24)', 'rgba(60,210,160,.12)'],     /* 2 ปกป้องข้อมูล */
    ['rgba(40,190,230,.26)', 'rgba(40,190,230,.13)'],     /* 3 ตรวจสัญญา */
    ['rgba(170,130,255,.24)', 'rgba(170,130,255,.12)']    /* ผลตรวจ */
  ];
  var bg, marks = [], cur = -1, tick = false;

  function build() {
    var st = document.createElement('style'); st.id = 'vcDeskBgCss'; st.textContent = css; document.head.appendChild(st);
    bg = document.createElement('div'); bg.id = 'vcDeskBg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<div class="w"></div><div class="l"></div><div class="s"></div><div class="v"></div>';
    document.body.insertBefore(bg, document.body.firstChild);
    collect(); update();
    requestAnimationFrame(function () { root.classList.add('vc-dbg-in'); });
  }
  function collect() {
    var card = document.getElementById('checkCard'), res = document.getElementById('resultCard');
    marks = [];
    if (card) {
      /* art.js ห่อหัวข้อแต่ละขั้นไว้ใน .vc-box จึงหาแบบไม่จำกัดชั้น */
      var h = card.querySelector('.step-head'); if (h) marks.push([0, h]);
      [].slice.call(card.querySelectorAll('.step-sub')).forEach(function (e, i) { marks.push([Math.min(2, i + 1), e]); });
    }
    if (res) marks.push([3, res]);
  }
  function active() {
    if (root.getAttribute('data-view') !== 'desk') return -1;
    collect();
    var line = innerHeight * .55, k = 0, res = document.getElementById('resultCard');
    /* จอคอมกว้าง: ผลตรวจอยู่ข้าง ๆ ช่องใส่สัญญา → ใช้สีผลตรวจเมื่อมีผลแล้วเท่านั้น */
    var wide = innerWidth >= 1280;
    marks.forEach(function (m) {
      var el = m[1]; if (!el.offsetParent) return;
      if (m[0] === 3 && (wide || res.hidden)) { if (wide && !res.hidden && res.querySelector('details, .item, [data-vault-back]')) k = Math.max(k, 3); return; }
      if (el.getBoundingClientRect().top < line) k = Math.max(k, m[0]);
    });
    return k;
  }
  function update() {
    tick = false; if (!bg) return;
    var k = active(); if (k < 0 || k === cur) return; cur = k;
    bg.style.setProperty('--dbg-c', COL[k][0]); bg.style.setProperty('--dbg-c2', COL[k][1]);
  }
  function on() { if (!tick) { tick = true; requestAnimationFrame(update); } }

  function boot() {
    if (!document.body) return;
    build();
    addEventListener('scroll', on, { passive: true, capture: true });
    addEventListener('resize', function () { collect(); on(); });
    document.addEventListener('vc-view', function () { collect(); cur = -1; setTimeout(on, 60); });
    window.addEventListener('hashchange', function () { setTimeout(on, 120); });
    /* ผลตรวจขึ้น/หาย → คำนวณใหม่ */
    var res = document.getElementById('resultCard');
    if (res && 'MutationObserver' in window) new MutationObserver(function () { cur = -1; on(); }).observe(res, { attributes: true, attributeFilter: ['hidden'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
