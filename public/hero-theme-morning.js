/* Vellum Check · ธีมหน้าปก "แดดเช้า" (v1)
   - โต๊ะไม้สีอ่อนลง โคมไฟปิด แสงแดดลอดมู่ลี่เป็นแถบพาดโต๊ะ (ขยับช้า ๆ ตามลม)
   - แสงอุ่นจากมุมขวาบน ฝุ่นลอยในแสง · กาแฟเปลี่ยนเป็นชา
   ไม่แตะข้อความหัวข้อ/โลโก้ — เปลี่ยนเฉพาะสีตัวอักษรหัวข้อ */
(function () {
  var css = `
  :host([data-th=morning]){background:#2a1a0d}
  :host([data-th=morning]) .desk{background:
      radial-gradient(70% 60% at 78% 18%,rgba(255,226,170,.28),transparent 70%),
      repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 118px,rgba(60,30,10,.22) 118px 121px),
      repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 7px,rgba(0,0,0,.03) 7px 13px,rgba(255,255,255,.025) 13px 29px),
      linear-gradient(180deg,#8a5a34,#7a4d2b 60%,#664024)}
  :host([data-th=morning]) .desk::after{opacity:.32}
  :host([data-th=morning]) .vig{background:radial-gradient(ellipse at 55% 45%,transparent 50%,rgba(40,20,5,.5))}
  /* โคมไฟปิด: ไม่มีลำแสง/วงแสงโคม */
  :host([data-th=morning]) .bulb{opacity:calc(var(--bo,1) * .12)}
  :host([data-th=morning]) .shaft{visibility:hidden}
  :host([data-th=morning]) .pool{background:radial-gradient(circle at 50% 50%,rgba(255,236,200,.14),transparent 50%)}
  /* ชาแทนกาแฟ */
  :host([data-th=morning]) #cf stop:nth-child(1){stop-color:#e2a24c}
  :host([data-th=morning]) #cf stop:nth-child(2){stop-color:#b8701f}
  :host([data-th=morning]) #cf stop:nth-child(3){stop-color:#8a4f14}
  /* หัวข้อ: ขาวนวล → พีช อุ่นแบบแดดเช้า + เงาเข้มขึ้นให้อ่านชัดบนพื้นสว่าง */
  :host([data-th=morning]) .ttl small{color:#fff3dc;text-shadow:0 1px 10px rgba(70,30,0,.8)}
  :host([data-th=morning]) .ttl span{background-image:linear-gradient(180deg,#fffef9 12%,#fff0d2 48%,#ffc98a 78%,#f39a4a 100%)}
  :host([data-th=morning]) .ttl{filter:blur(var(--tb,0px)) drop-shadow(0 3px 0 rgba(90,40,5,.55)) drop-shadow(0 8px 22px rgba(50,20,0,.75))}
  :host([data-th=morning]) .hint{color:#fff3dc}
  /* แสงอุ่นมุมขวาบน */
  .tm-sun{position:absolute;inset:0;background:radial-gradient(85% 75% at 100% 0%,rgba(255,236,190,.34),rgba(255,206,140,.14) 40%,transparent 70%)}
  /* แถบแดดลอดมู่ลี่ */
  .tm-bl{position:absolute;left:-30%;top:-40%;width:160%;height:180%;transform:rotate(-28deg);
      -webkit-mask:radial-gradient(60% 55% at 68% 40%,#000 30%,transparent 80%);mask:radial-gradient(60% 55% at 68% 40%,#000 30%,transparent 80%)}
  .tm-bl i{position:absolute;inset:0;animation:tmb 9s ease-in-out infinite alternate;
      background:repeating-linear-gradient(180deg,rgba(255,240,205,0) 0,rgba(255,240,205,.30) 10px,rgba(255,236,196,.30) 34px,rgba(255,240,205,0) 44px,rgba(0,0,0,0) 62px)}
  @keyframes tmb{0%{transform:translateY(0)}100%{transform:translateY(14px)}}
  /* ฝุ่นลอยในแสง */
  .tm-m{position:absolute;width:var(--s,3px);height:var(--s,3px);border-radius:50%;background:rgba(255,246,220,.9);box-shadow:0 0 6px rgba(255,230,180,.9);
      opacity:0;animation:tmm var(--d,12s) linear var(--w,0s) infinite}
  @keyframes tmm{0%{opacity:0;transform:translate(0,0)}15%{opacity:.85}85%{opacity:.6}100%{opacity:0;transform:translate(var(--dx,-40px),var(--dy,-90px))}}
  /* เปิดมา: มู่ลี่ค่อย ๆ ดึงขึ้น → แสงแดดกวาดผ่านโต๊ะ */
  .tm-shut{position:absolute;inset:0;transform-origin:50% 0;opacity:0;animation:tmsh 1.6s cubic-bezier(.6,0,.3,1) .2s both;
      background:repeating-linear-gradient(180deg,rgba(40,20,6,.82) 0 30px,rgba(255,226,170,.25) 30px 34px)}
  @keyframes tmsh{0%{opacity:1;transform:scaleY(1)}70%{opacity:1}100%{opacity:0;transform:scaleY(0)}}
  .tm-sw{position:absolute;top:-20%;bottom:-20%;left:0;width:45%;opacity:0;transform:translateX(-120%) skewX(-18deg);
      background:linear-gradient(90deg,transparent,rgba(255,240,200,.38),rgba(255,250,230,.5),rgba(255,240,200,.38),transparent);animation:tmsw 2s ease-in-out 1.1s both}
  @keyframes tmsw{0%{opacity:1;transform:translateX(-120%) skewX(-18deg)}100%{opacity:1;transform:translateX(320%) skewX(-18deg)}}
  /* เงานกบินผ่าน (รอบละ 16 วิ) */
  .tm-birds{position:absolute;right:0;top:46%;width:220px;height:90px;opacity:0;animation:tmbf 16s linear 2.6s infinite}
  .tm-birds svg{position:absolute;width:64px;height:32px;overflow:visible;filter:blur(1.2px)}
  .tm-birds path{fill:rgba(50,24,4,.55);transform-origin:50% 60%;animation:tmfl .32s ease-in-out infinite alternate}
  @keyframes tmfl{from{transform:scaleY(1)}to{transform:scaleY(-.35)}}
  @keyframes tmbf{0%{opacity:1;transform:translate(30vw,-6vh)}30%{opacity:1;transform:translate(-115vw,8vh)}30.1%,100%{opacity:0;transform:translate(-115vw,10vh)}}
  /* แตะ → ฝุ่นในแสงกระจาย */
  .tm-tp{width:0;height:0}
  .tm-tp i{position:absolute;width:4px;height:4px;margin:-2px;border-radius:50%;background:#fff6dc;box-shadow:0 0 8px rgba(255,230,170,.95);animation:tmtp 1.3s ease-out forwards}
  @keyframes tmtp{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.4)}}
  @media (prefers-reduced-motion:reduce){.tm-shut,.tm-sw,.tm-birds{display:none}}
  @media (max-width:767px){.tm-bl{-webkit-mask:radial-gradient(70% 50% at 70% 42%,#000 30%,transparent 80%);mask:radial-gradient(70% 50% at 70% 42%,#000 30%,transparent 80%)}}
  `;
  var motes = '';
  [[62, 30, 3, 13, 0, -50, -110], [74, 46, 2, 11, 3, -30, -90], [55, 52, 4, 15, 6, -60, -80], [83, 26, 2, 10, 1.5, -40, -120], [68, 62, 3, 14, 8, -20, -100],
   [48, 38, 2, 12, 4.5, -50, -70], [88, 50, 3, 16, 10, -70, -90], [60, 70, 2, 13, 2.5, -30, -110], [77, 36, 4, 18, 7, -40, -60]].forEach(function (m) {
    motes += '<i class="tm-m" style="left:' + m[0] + '%;top:' + m[1] + '%;--s:' + m[2] + 'px;--d:' + m[3] + 's;--w:-' + m[4] + 's;--dx:' + m[5] + 'px;--dy:' + m[6] + 'px"></i>';
  });
  var bird = function (x, y, sc, d) { return '<svg viewBox="0 0 44 22" style="left:' + x + 'px;top:' + y + 'px;transform:scale(' + sc + ')"><path style="animation-delay:-' + d + 's" d="M0 8C8 0 16 2 22 12 28 2 36 0 44 8 36 6 28 8 22 16 16 8 8 6 0 8z"/></svg>'; };
  var stage = '<div class="tm-sun"></div><div class="tm-bl"><i></i></div>' + motes + '<div class="tm-birds">' + bird(0, 30, 1, 0) + bird(60, 0, .8, .12) + bird(110, 46, .7, .2) + '</div><div class="tm-sw"></div><div class="tm-shut"></div>';
  function tap(x, y, lay) { var d = document.createElement('div'), h = '', i; d.className = 'thm-fx tm-tp'; d.style.left = x + 'px'; d.style.top = y + 'px';
    for (i = 0; i < 12; i++) { var a = i / 12 * 6.283 + Math.random() * .4, r = 40 + Math.random() * 50; h += '<i style="--x:' + (Math.cos(a) * r).toFixed(0) + 'px;--y:' + (Math.sin(a) * r - 20).toFixed(0) + 'px"></i>'; }
    d.innerHTML = h; lay.appendChild(d); setTimeout(function () { d.remove(); }, 1400); }

  (window.VCHT = window.VCHT || {}).morning = { css: css, stage: stage, tap: tap };
  if (window.__vchApply) window.__vchApply();
})();
