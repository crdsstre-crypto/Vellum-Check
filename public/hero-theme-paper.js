/* Vellum Check · ธีมหน้าปก "งานกระดาษตัดซ้อนชั้น" (v1)
   - โต๊ะเป็นกระดาษคราฟต์สีเขียวหัวเป็ด · ของบนโต๊ะเป็นกระดาษตัด (ต้นไม้ แก้ว ดินสอ คลิป) แทนของจริง
   - กรอบกระดาษหยักซ้อน 3 ชั้นรอบจอ ขยับเป็นมิติตามเมาส์ / การเอียงเครื่อง (Android) / แกว่งเบา ๆ บน iPhone
   - หัวข้อสีครีมมีเงากระดาษซ้อน (ส้มอิฐ + เหลืองมัสตาร์ด)
   ไม่แตะข้อความหัวข้อ/โลโก้ — เปลี่ยนเฉพาะสีตัวอักษรหัวข้อ */
(function () {
  var css = `
  :host([data-th=paper]){background:#123533}
  :host([data-th=paper]) .desk{background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23f)'/%3E%3C/svg%3E"),
      radial-gradient(60% 50% at 40% 40%,rgba(255,240,210,.10),transparent 70%),
      linear-gradient(180deg,#24605c,#1d4f4c 60%,#173f3d)}
  :host([data-th=paper]) .desk .grain{display:none}
  :host([data-th=paper]) .desk::after{opacity:.35}
  /* ซ่อนของจริง (โคม แก้ว แว่น ปากกา ต้นไม้ เงาใบไม้ โทรศัพท์) */
  :host([data-th=paper]) .L.obj[data-x="-.3"],:host([data-th=paper]) .L.obj[data-x=".36"],:host([data-th=paper]) .L.obj[data-x="-.36"],
  :host([data-th=paper]) .L.obj[data-x=".43"],:host([data-th=paper]) .L.obj[data-x=".46"],:host([data-th=paper]) .L.obj[data-x="-.44"],
  :host([data-th=paper]) .leafsh,:host([data-th=paper]) .shaft{display:none}
  :host([data-th=paper]) .pool{background:radial-gradient(circle at 50% 50%,rgba(255,236,200,.16),transparent 52%)}
  :host([data-th=paper]) .vig{background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(4,20,20,.55))}
  :host([data-th=paper]) .note{background:#ffd76a;box-shadow:3px 4px 0 #e0a93a,0 14px 20px -8px rgba(0,0,0,.45)}
  :host([data-th=paper]) .note::before{background:rgba(255,255,255,.55)}
  /* หัวข้อ: ครีม + เงากระดาษซ้อน */
  :host([data-th=paper]) .ttl small{color:#ffe6c7}
  :host([data-th=paper]) .ttl span{background-image:linear-gradient(180deg,#fffdf6,#fff0d8)}
  :host([data-th=paper]) .ttl{filter:blur(var(--tb,0px)) drop-shadow(0 12px 18px rgba(0,0,0,.45))}
  :host([data-th=paper]) .ttl span{filter:drop-shadow(0 3px 0 #ef7d5e) drop-shadow(0 3px 0 #f3c14d)}
  :host([data-th=paper]) .cap p b,:host([data-th=paper]) .cap p .u{color:#ffd27a}
  /* กรอบกระดาษหยักซ้อนชั้น (ขยับต่างระดับ = มิติ) */
  .pc-l{position:absolute;left:-6%;right:-6%;pointer-events:none;transform:translate(calc(var(--px,0) * var(--k) * 1px),calc(var(--py,0) * var(--k) * 1px));transition:transform .25s ease-out}
  .pc-l svg{position:absolute;inset:0;width:100%;height:100%}
  .pc-l path{filter:drop-shadow(0 6px 6px rgba(0,0,0,.35))}
  .pc-t{top:calc(var(--art-head,56px) - 2px);height:16vh}.pc-b{bottom:-1%;height:11vh}
  .pc-sway{position:absolute;inset:0;animation:pcs 9s ease-in-out infinite alternate}
  @keyframes pcs{from{transform:translate(-6px,-3px)}to{transform:translate(6px,4px)}}
  .pc-dot{position:absolute;width:var(--s);height:var(--s);background:var(--c);border-radius:var(--r,50%);box-shadow:2px 3px 0 rgba(0,0,0,.25);transform:rotate(var(--a,0deg))}
  /* เปิดมา: กางออกแบบหนังสือป๊อปอัพ — กรอบพับตั้งขึ้นทีละชั้น ของบนโต๊ะเด้งตั้ง */
  .pc-l{perspective:700px}
  .pc-l svg{animation:pcpop .9s cubic-bezier(.3,1.45,.5,1) both;animation-delay:calc(var(--k) * 28ms + .15s)}
  .pc-t svg{transform-origin:50% 0}.pc-b svg{transform-origin:50% 100%}
  @keyframes pcpop{from{transform:rotateX(-92deg);opacity:0}30%{opacity:1}to{transform:none}}
  .pc-b svg{animation-name:pcpopb}@keyframes pcpopb{from{transform:rotateX(92deg);opacity:0}30%{opacity:1}to{transform:none}}
  .pc-o > svg{transform-origin:50% 100%;animation:pcob .75s cubic-bezier(.3,1.7,.5,1) both;animation-delay:.55s}\n  .pc-o:nth-last-child(3) > svg{animation-delay:.7s}.pc-o:nth-last-child(2) > svg{animation-delay:.85s}.pc-o:last-child > svg{animation-delay:1s}
  @keyframes pcob{from{transform:perspective(500px) rotateX(75deg) scale(.4);opacity:0}40%{opacity:1}to{transform:none}}
  /* นกกระเรียนกระดาษบินผ่าน (รอบละ 18 วิ) */
  .pc-cr{position:absolute;left:0;top:0;width:min(24vmin,170px);aspect-ratio:1.4;opacity:0;animation:pccr 18s linear 2.2s infinite}
  .pc-cr svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(6px 14px 6px rgba(0,0,0,.35))}
  .pc-cr .w1{transform-origin:50px 40px;animation:pcw .5s ease-in-out infinite alternate}.pc-cr .w2{transform-origin:50px 40px;animation:pcw2 .5s ease-in-out infinite alternate}
  @keyframes pcw{from{transform:rotateX(0)}to{transform:scaleY(-.6)}}@keyframes pcw2{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
  @keyframes pccr{0%{opacity:1;transform:translate(-20vw,78vh) rotate(-14deg)}38%{opacity:1;transform:translate(110vw,8vh) rotate(-8deg)}38.1%,100%{opacity:0;transform:translate(110vw,8vh)}}
  /* แตะ → เศษกระดาษเด้ง */
  .pc-tp{width:0;height:0}
  .pc-tp i{position:absolute;width:var(--w);height:var(--h);margin:-5px;background:var(--c);border-radius:2px;box-shadow:2px 2px 0 rgba(0,0,0,.22);animation:pctp 1.2s cubic-bezier(.2,.7,.4,1) forwards}
  @keyframes pctp{0%{opacity:1;transform:translate(0,0) rotate(0)}55%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r))}100%{opacity:0;transform:translate(calc(var(--x) * 1.2),calc(var(--y) + 70px)) rotate(calc(var(--r) * 2))}}
  @media (prefers-reduced-motion:reduce){.pc-cr{display:none}}
  @media (min-width:768px){.pc-t{height:15vh}.pc-b{height:11vh}}
  `;
  function wave(top, layers) {
    var out = '';
    layers.forEach(function (L) {
      var amp = L[1], base = L[2], d;
      if (top) d = 'M0 0H100V' + base + ' ' + bump(base, amp, L[3], 1) + 'Z';
      else d = 'M0 100H100V' + (100 - base) + ' ' + bump(100 - base, amp, L[3], -1) + 'Z';
      out += '<div class="pc-l ' + (top ? 'pc-t' : 'pc-b') + '" style="--k:' + L[4] + '"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + d + '" fill="' + L[0] + '"/></svg></div>';
    });
    return out;
  }
  function bump(y, a, n, sgn) { /* เส้นหยักจากขวาไปซ้าย */
    var s = '', i, w = 100 / n;
    for (i = 0; i < n; i++) { var x1 = 100 - i * w, x2 = x1 - w; s += 'Q' + (x1 - w / 2).toFixed(2) + ' ' + (y + sgn * a * (i % 2 ? -.6 : 1)).toFixed(2) + ' ' + x2.toFixed(2) + ' ' + y.toFixed(2) + ' '; }
    return s + 'L0 ' + (sgn > 0 ? 0 : 100);
  }
  var dots = '';
  [[8, 40, 10, '#f3c14d', '50%', 0], [92, 44, 8, '#ef7d5e', '2px', 20], [6, 64, 7, '#fff0d8', '2px', 45], [94, 66, 11, '#f3c14d', '50%', 0], [14, 52, 6, '#ef7d5e', '50%', 0], [86, 54, 7, '#fff0d8', '2px', 30]].forEach(function (d) {
    dots += '<i class="pc-dot" style="left:' + d[0] + '%;top:' + d[1] + '%;--s:' + d[2] + 'px;--c:' + d[3] + ';--r:' + d[4] + ';--a:' + d[5] + 'deg"></i>';
  });
  var stage = '<div class="pc-sway">' +
    wave(true, [['#ef7d5e', 10, 58, 6, 4], ['#f3c14d', 9, 38, 7, 9], ['#fff0d8', 8, 18, 9, 14]]) +
    wave(false, [['#f3c14d', 10, 52, 5, 4], ['#ef7d5e', 9, 34, 7, 9], ['#fff0d8', 8, 16, 8, 14]]) + dots + '</div>' +
    '<div class="pc-cr"><svg viewBox="0 0 100 70"><path d="M8 44L50 40 92 18 62 46z" fill="#fff0d8"/><path d="M50 40L36 56 62 46z" fill="#e8d8bc"/><path d="M92 18l6-8-2 10z" fill="#fff0d8"/>' +
    '<path class="w2" d="M50 40L66 8 62 46z" fill="#f3c14d"/><path class="w1" d="M50 40L28 4 44 44z" fill="#ef7d5e"/><path d="M8 44L2 38 14 42z" fill="#e8d8bc"/></svg></div>';

  /* ของกระดาษตัด (มองจากบน) */
  var SH = 'style="filter:drop-shadow(3px 4px 0 rgba(0,0,0,.22))"';
  var plant = '<svg viewBox="0 0 200 200">' +
    '<g ' + SH + '><path d="M100 100C60 40 20 50 18 70c20-4 48 4 82 30z" fill="#2f8f6a"/><path d="M100 100C150 30 190 50 186 76c-22-6-52 0-86 24z" fill="#3fae7e"/>' +
    '<path d="M100 100C70 150 30 170 20 150c18-8 46-22 80-50z" fill="#3fae7e"/><path d="M100 100C140 150 176 168 186 146c-20-6-50-20-86-46z" fill="#2f8f6a"/>' +
    '<path d="M100 100C96 50 110 14 128 10c4 26-8 60-28 90z" fill="#5cc796"/><path d="M100 100C90 150 74 186 56 190c0-26 18-60 44-90z" fill="#5cc796"/></g>' +
    '<circle cx="100" cy="100" r="22" fill="#fff0d8" ' + SH + '/><circle cx="100" cy="100" r="15" fill="#c98a5a"/></svg>';
  var cup = '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#ef7d5e" ' + SH + '/><circle cx="100" cy="100" r="76" fill="#f59a7e"/>' +
    '<rect x="150" y="86" width="46" height="28" rx="14" fill="#fff0d8" ' + SH + '/><circle cx="100" cy="100" r="60" fill="#fff0d8" ' + SH + '/>' +
    '<circle cx="100" cy="100" r="48" fill="#7a4a2a"/><path d="M100 120c-22-14-26-28-16-34 7-4 13 0 16 6 3-6 9-10 16-6 10 6 6 20-16 34z" fill="#fff0d8"/></svg>';
  var pencil = '<svg viewBox="0 0 240 40"><g ' + SH + '><rect x="34" y="6" width="170" height="28" fill="#f3c14d"/><rect x="34" y="6" width="170" height="9" fill="#ffd76a"/><rect x="34" y="25" width="170" height="9" fill="#e0a93a"/>' +
    '<rect x="204" y="6" width="16" height="28" fill="#c9c9c9"/><rect x="220" y="6" width="16" height="28" rx="4" fill="#ef7d5e"/><path d="M34 6L4 20l30 14z" fill="#f6dcb8"/><path d="M14 15L4 20l10 5z" fill="#2a2a2a"/></g></svg>';
  var clip = '<svg viewBox="0 0 60 140"><path d="M20 120V30a12 12 0 0124 0v84a20 20 0 01-40 0V40" fill="none" stroke="#fff0d8" stroke-width="6" stroke-linecap="round" ' + SH + '/></svg>';
  var cam =
    '<div class="L obj pc-o" data-k="2.4" data-x=".4" data-y="-.3" data-w="46vmin" style="z-index:13">' + plant + '</div>' +
    '<div class="L obj pc-o" data-k="1.6" data-x=".36" data-y=".34" data-w="32vmin" style="z-index:12">' + cup + '</div>' +
    '<div class="L obj pc-o" data-k="1.3" data-x="-.42" data-y=".02" data-w="54vmin" data-r="72" style="z-index:12">' + pencil + '</div>' +
    '<div class="L obj pc-o" data-k="1.35" data-x="-.34" data-y=".36" data-w="9vmin" data-r="-22" style="z-index:12">' + clip + '</div>';

  /* มิติ: เมาส์ (คอม) / เอียงเครื่อง (Android) → --px/--py บนหน้าปก */
  function init(SR, host) {
    var raf = 0, X = 0, Y = 0;
    function put() { raf = 0; host.style.setProperty('--px', X.toFixed(2)); host.style.setProperty('--py', Y.toFixed(2)); }
    function q(x, y) { X = Math.max(-1, Math.min(1, x)); Y = Math.max(-1, Math.min(1, y)); if (!raf) raf = requestAnimationFrame(put); }
    host.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var r = host.getBoundingClientRect(); q((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1); }, { passive: true });
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      addEventListener('deviceorientation', function (e) { if (e.gamma == null) return; q(e.gamma / 25, (e.beta - 45) / 25); }, { passive: true });
    }
  }

  function tap(x, y, lay) { var d = document.createElement('div'), h = '', i, C = ['#ef7d5e', '#f3c14d', '#fff0d8', '#5cc796']; d.className = 'thm-fx pc-tp'; d.style.left = x + 'px'; d.style.top = y + 'px';
    for (i = 0; i < 11; i++) { var a = -Math.PI / 2 + (Math.random() - .5) * 2.6, r = 50 + Math.random() * 60; h += '<i style="--x:' + (Math.cos(a) * r).toFixed(0) + 'px;--y:' + (Math.sin(a) * r).toFixed(0) + 'px;--r:' + ((Math.random() - .5) * 540).toFixed(0) + 'deg;--w:' + (6 + Math.random() * 8).toFixed(0) + 'px;--h:' + (5 + Math.random() * 6).toFixed(0) + 'px;--c:' + C[i % 4] + '"></i>'; }
    d.innerHTML = h; lay.appendChild(d); setTimeout(function () { d.remove(); }, 1300); }
  (window.VCHT = window.VCHT || {}).paper = { css: css, stage: stage, cam: cam, init: init, tap: tap };
  if (window.__vchApply) window.__vchApply();
})();
