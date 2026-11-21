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
  (window.VCHT = window.VCHT || {}).paper = { css: css, stage: stage, cam: cam, init: init, tap: tap };   /* v2: เรียก __vchApply ท้ายไฟล์ (หลังเพิ่มฉากเลื่อน) */
})();

/*PZSCROLL*/ /* ธีมตัดกระดาษ (v2): ฉากเลื่อนลงของตัวเอง — ดิ่งผ่านชั้นกระดาษ → กรรไกรตัดข้อเสี่ยง 3 ข้อ → ลอกชั้นบนดูตัวเล็ก 2 ข้อ
   → ขอบกระดาษฉีกคั่นฉาก → ตรากระดาษนูน "ตรวจแล้ว" → ผลตรวจเป็นการ์ดป๊อปอัป แถบกระดาษสี
   หน้าปกเหมือนเดิม · ข้อมูลในสัญญาเป็นข้อมูลสมมติ · ขยับด้วย transform/opacity เป็นหลัก (ลื่นบนมือถือ) */
(function () {
  var T = window.VCHT && window.VCHT.paper; if (!T || T.frame) return;
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function io(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function S(el, k, v) { if (!el) return; var c = el.__pz || (el.__pz = {}); if (c[k] === v) return; c[k] = v; if (k.charAt(0) === '-') el.style.setProperty(k, v); else el.style[k] = v; }
  var CUT = [.205, .283, .361], CD = .05;          /* เวลาเริ่มตัดแต่ละข้อ + ช่วงตัด */
  var PE0 = .468, PE1 = .53, PE2 = .566;           /* ลอกมุม → ดึงแผ่นออก */
  var TW0 = .574, TW1 = .642;                       /* ขอบฉีกกวาดผ่าน */
  var SE0 = .608, SE1 = .636;                       /* ตรานูน */
  var OUT0 = .665, OUT1 = .728;                     /* ฉากจางออก → การ์ดผล */
  var SC = '<svg viewBox="0 0 64 40"><g class="b1"><path d="M30 20 L62 8" stroke="#fff0d8" stroke-width="5" stroke-linecap="round"/><ellipse cx="13" cy="12" rx="10" ry="6.5" fill="none" stroke="#f3c14d" stroke-width="4.5"/><path d="M21 15 L30 20" stroke="#f3c14d" stroke-width="4.5"/></g>' +
    '<g class="b2"><path d="M30 20 L62 32" stroke="#e8d8bc" stroke-width="5" stroke-linecap="round"/><ellipse cx="13" cy="28" rx="10" ry="6.5" fill="none" stroke="#ef7d5e" stroke-width="4.5"/><path d="M21 25 L30 20" stroke="#ef7d5e" stroke-width="4.5"/></g><circle cx="30" cy="20" r="2.6" fill="#1d4f4c"/></svg>';
  function frameSvg(c1, c2) { /* กรอบเต็มจอ เจาะรูหยัก (evenodd) */
    var top = 'M14 16', bot = '', i, n = 6, w = 72 / n;
    for (i = 0; i < n; i++) top += ' Q' + (14 + w * i + w / 2).toFixed(1) + ' ' + (i % 2 ? 19.5 : 12.5) + ' ' + (14 + w * (i + 1)).toFixed(1) + ' 16';
    top += ' L86 84'; for (i = n - 1; i >= 0; i--) top += ' Q' + (14 + w * i + w / 2).toFixed(1) + ' ' + (i % 2 ? 80.5 : 87.5) + ' ' + (14 + w * i).toFixed(1) + ' 84';
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path fill-rule="evenodd" fill="' + c1 + '" d="M-40 -40H140V140H-40Z ' + top + 'Z"/><path fill="none" stroke="' + c2 + '" stroke-width=".5" d="' + top + 'Z" opacity=".5"/></svg>';
  }
  var css = `
  :host([data-th=paper]) .cap,:host([data-th=paper]) .uvc,:host([data-th=paper]) .dawn{display:none !important}
  :host([data-th=paper].pz-on) .paper,:host([data-th=paper].pz-on) .curl,:host([data-th=paper].pz-on) .scraps,:host([data-th=paper].pz-on) .uvl,:host([data-th=paper].pz-on) .uvs,
  :host([data-th=paper].pz-on) .nib,:host([data-th=paper].pz-on) .torch,:host([data-th=paper].pz-on) .beam,:host([data-th=paper].pz-on) .row .ink,:host([data-th=paper].pz-on) .row .strip,
  :host([data-th=paper].pz-on) .row .uvt,:host([data-th=paper].pz-on) .uvring,:host([data-th=paper].pz-on) .uvtag,:host([data-th=paper].pz-on) .stamp,:host([data-th=paper].pz-on) .splat,
  :host([data-th=paper].pz-on) .shock,:host([data-th=paper].pz-on) .note{display:none !important}
  :host([data-th=paper]) .dark{background:#0c2725}
  .pz{position:absolute;inset:0;z-index:16;pointer-events:none;overflow:hidden;--sd:0;contain:layout paint}
  .pz,.pz *{box-sizing:border-box}
  .pz-fr{position:absolute;inset:0;opacity:0;visibility:hidden;will-change:transform,opacity;transform-origin:50% 52%}
  .pz-fr svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))}
  .pz-ch{position:absolute;left:0;right:0;top:34%;text-align:center;opacity:0;visibility:hidden;will-change:transform,opacity}
  .pz-ch::before{content:'';position:absolute;left:50%;top:50%;width:min(110vw,620px);height:280px;margin:-150px 0 0 calc(min(110vw,620px) / -2);background:radial-gradient(closest-side,rgba(18,53,51,.92),rgba(18,53,51,.7) 55%,rgba(18,53,51,0));z-index:-1}
  .pz-lt{display:inline-block;margin:0 2px;padding:0 9px;border-radius:4px;background:#fff0d8;color:#d0603f;font:800 clamp(34px,10vw,58px)/1.25 Prompt;box-shadow:4px 4px 0 #f3c14d,8px 8px 0 rgba(0,0,0,.22);transform:scale(var(--s,0)) rotate(var(--r,0deg))}
  .pz-lt.n{background:#f3c14d;color:#1d4f4c;box-shadow:4px 4px 0 #ef7d5e,8px 8px 0 rgba(0,0,0,.22)}
  .pz-ch p{margin:16px 0 0;color:#fff0d8;font:600 15px/1.4 Prompt;text-shadow:0 2px 6px rgba(0,0,0,.4)}
  .pz-tp{position:absolute;width:52px;height:16px;background:rgba(246,236,210,.78);border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08)}
  .pz-bn{position:absolute;left:14px;top:calc(var(--art-head,56px) + 10px);display:flex;align-items:center;gap:8px;opacity:0;visibility:hidden;will-change:opacity,transform}
  .pz-bt{position:relative;height:30px}
  .pz-bt span{position:absolute;left:0;top:0;white-space:nowrap;padding:5px 11px;border-radius:3px;background:#fff0d8;color:#1d4f4c;font:700 13px/20px Prompt;box-shadow:3px 3px 0 #ef7d5e;transform:rotate(-1.5deg);transition:opacity .25s}
  .pz-bt span b{color:#d0603f}
  .pz-bt span+span{opacity:0}.pz-bn.c2 .pz-bt span{opacity:0}.pz-bn.c2 .pz-bt span+span{opacity:1}
  .pz-cn{margin-left:auto;padding:4px 10px;border-radius:14px;background:#f3c14d;color:#1d4f4c;font:700 12px/18px Prompt;box-shadow:2px 2px 0 rgba(0,0,0,.25);white-space:nowrap}
  .pz-cn.bump{animation:pzb .35s cubic-bezier(.3,1.8,.5,1)}@keyframes pzb{from{transform:scale(1.35)}to{transform:none}}
  .pz-pg{position:absolute;left:50%;top:calc(var(--art-head,56px) + 52px);bottom:calc(var(--vh-nav,0px) + 66px + env(safe-area-inset-bottom));width:min(88vw,430px);max-height:560px;margin:auto 0 auto calc(min(88vw,430px) / -2);
     background:#f6ecd8;border-radius:4px;padding:18px 16px 14px;color:#4a3a2a;font:400 13px/1.65 Sarabun,Prompt;display:flex;flex-direction:column;justify-content:space-between;gap:8px;
     box-shadow:calc(var(--sd) * 1px) calc(var(--sd) * 1px + 8px) 0 rgba(0,0,0,.16),0 22px 34px -12px rgba(0,0,0,.55);opacity:0;visibility:hidden;will-change:transform,opacity}
  .pz-pg h4{margin:0;font:700 15px/1.3 Prompt;color:#1d4f4c}
  .pz-pg .pz-tx{margin:0}
  .pz-ln{display:block;height:6px;border-radius:3px;background:#dccfb4;flex:none}.pz-ln.s{width:68%}
  .pz-cl{position:relative;flex:none}
  .pz-ho{position:absolute;inset:-3px -4px;border-radius:5px;background:#1d4f4c;box-shadow:inset 0 4px 8px rgba(0,0,0,.5);opacity:0}
  .pz-sd{position:absolute;inset:0;border-radius:5px;background:rgba(0,0,0,.4);filter:blur(5px);opacity:0}
  .pz-pc{position:relative;padding:5px 8px;border-radius:4px;background:#f6ecd8;will-change:transform}
  .pz-pc b{font-weight:700;transition:color .3s}.pz-cl.cut .pz-pc{background:#fff7e6}.pz-cl.cut .pz-pc b{color:#d0603f}
  .pz-cut{position:absolute;left:-4px;top:-3px;overflow:visible;pointer-events:none}
  .pz-cut .g{fill:none;stroke:#d0603f;stroke-width:1.6;stroke-dasharray:5 4;opacity:var(--go,0)}
  .pz-cut .k{fill:none;stroke:#1d4f4c;stroke-width:1.8;stroke-linecap:round}
  .pz-sc{position:absolute;left:0;top:0;width:60px;height:38px;margin:-19px 0 0 -14px;opacity:0;visibility:hidden;filter:drop-shadow(2px 3px 2px rgba(0,0,0,.35));z-index:3;will-change:transform}
  .pz-sc svg{width:100%;height:100%;overflow:visible}.pz-sc .b1,.pz-sc .b2{transform-origin:30px 20px}
  .pz-fine{position:relative;margin-top:22px;flex:none;height:96px;border-radius:3px}
  .pz-fine small.h{position:absolute;left:0;top:-20px;font:600 11px/1 Prompt;color:#8a7a62}
  .pz-un{position:absolute;inset:0;border-radius:3px;background:#d8c49e;box-shadow:inset 0 2px 6px rgba(0,0,0,.18);padding:10px 10px;display:flex;flex-direction:column;justify-content:center;gap:6px}
  .pz-hd{margin:0;padding:3px 8px;border-left:4px solid #d0603f;background:#fff4de;border-radius:2px;font:400 12.5px/1.45 Sarabun,Prompt;transition:box-shadow .3s}
  .pz-hd b{color:#d0603f}.pz-hd.on{box-shadow:0 0 0 2px #f3c14d}
  .pz-shw{position:absolute;inset:0;will-change:transform,opacity}
  .pz-sh{position:absolute;inset:0;border-radius:3px;background:#f6ecd8;border-top:1px dashed #cdbd9c;padding:12px 4px;display:flex;flex-direction:column;gap:9px}
  .pz-sh i{display:block;height:5px;border-radius:3px;background:#dccfb4}.pz-sh i:nth-child(2){width:84%}.pz-sh i:nth-child(3){width:62%}.pz-sh i:nth-child(4){width:74%}
  .pz-flap{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(-3px 4px 4px rgba(0,0,0,.3))}
  .pz-pg.done .pz-cl,.pz-pg.done .pz-fine,.pz-pg.done .pz-tx,.pz-pg.done .pz-ln{opacity:.6}
  .pz-pg.done .pz-cut,.pz-pg.done .pz-shw{display:none}
  .pz-tw{position:absolute;left:-4%;right:-4%;top:0;height:150vh;margin-top:-150vh;visibility:hidden;will-change:transform;background:#ef7d5e}
  .pz-tw svg{position:absolute;left:0;width:100%;overflow:visible}
  .pz-se{position:absolute;left:50%;top:50%;width:min(40vw,190px);aspect-ratio:1;margin:calc(min(40vw,190px) / -2) 0 0 calc(min(40vw,190px) / -2);opacity:0;visibility:hidden;will-change:transform,opacity}
  .pz-se i{position:absolute;inset:0;border-radius:50%}
  .pz-se .s0{inset:8% 4% -6% 10%;background:rgba(0,0,0,.35);filter:blur(8px);border-radius:50%}
  .pz-se .s1{background:#ef7d5e;clip-path:polygon(50% 0,61% 9%,75% 5%,80% 19%,95% 25%,91% 39%,100% 50%,91% 61%,95% 75%,80% 81%,75% 95%,61% 91%,50% 100%,39% 91%,25% 95%,20% 81%,5% 75%,9% 61%,0 50%,9% 39%,5% 25%,20% 19%,25% 5%,39% 9%)}
  .pz-se .s2{inset:12%;background:#f3c14d;box-shadow:0 4px 6px rgba(0,0,0,.28)}
  .pz-se .s3{inset:21%;background:#fff0d8;box-shadow:inset 0 3px 5px rgba(0,0,0,.16),0 2px 3px rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1d4f4c;font:800 clamp(17px,5vw,25px)/1.05 Prompt;text-align:center}
  .pz-se .s3 small{margin-top:4px;font:700 11px/1 Prompt;color:#d0603f}
  .pz-lg{position:absolute;inset:-20%;background:linear-gradient(115deg,rgba(255,236,200,.17),rgba(255,236,200,0) 42%);opacity:0;will-change:transform,opacity}
  /* ---------- ผลตรวจ: การ์ดป๊อปอัป + แถบกระดาษสี ---------- */
  .pz-pop{position:absolute;left:50%;z-index:9;width:min(92vw,500px);margin-left:calc(min(92vw,500px) / -2);pointer-events:none;opacity:0;visibility:hidden;perspective:900px}
  .pz-pop .t,.pz-pop .b{position:absolute;left:0;right:0;background:#f6ecd8}
  .pz-pop .t{top:0;height:var(--hh,120px);border-radius:6px 6px 0 0;transform-origin:50% 100%;background:linear-gradient(180deg,#f8efdc,#efe2c6);box-shadow:inset 0 -14px 16px -10px rgba(0,0,0,.18)}
  .pz-pop .b{top:var(--hh,120px);bottom:0;border-radius:0 0 6px 6px;background:#efe2c8;box-shadow:0 18px 28px -10px rgba(0,0,0,.5)}
  :host([data-th=paper]) .rh small{color:#d0603f;letter-spacing:.3em}
  :host([data-th=paper]) .rh h2{color:#1d4f4c;text-shadow:none}
  :host([data-th=paper]) .rh h2 em{color:#d0603f;text-shadow:none}
  :host([data-th=paper]) .rh p{color:#6a5a48;text-shadow:none}
  :host([data-th=paper]) .rh .money{color:#6a5a48;background:rgba(0,0,0,.05);border-color:transparent;text-shadow:none}
  :host([data-th=paper]) .rh .money b{color:#d0603f}
  :host([data-th=paper]) .row .card{background:#fff0d8;border:0;-webkit-backdrop-filter:none;backdrop-filter:none;border-radius:4px;box-shadow:3px 4px 0 rgba(0,0,0,.2);padding-left:13px}
  :host([data-th=paper]) .row .card::before,:host([data-th=paper]) .row .card::after,:host([data-th=paper]) .row .card .gl{display:none}
  :host([data-th=paper]) .row .card i{display:none}
  :host([data-th=paper]) .row .card b{color:#3a2c12;text-shadow:none;font-family:Prompt}
  :host([data-th=paper]) .row .card em,:host([data-th=paper]) .row .card em.u{background:rgba(255,255,255,.4);color:#3a2c12;border:0}
  :host([data-th=paper]) .row .card.pz-hi{background:#ef7d5e}:host([data-th=paper]) .row .card.pz-hi b{color:#fff8ec}
  :host([data-th=paper]) .row .card.pz-md{background:#f3c14d}
  :host([data-th=paper]) .row .card.pz-lo{background:#5f9a8e}:host([data-th=paper]) .row .card.pz-lo b{color:#f4fbf6}
  :host([data-th=paper]) .row .card.pz-hi em,:host([data-th=paper]) .row .card.pz-lo em{background:rgba(255,255,255,.25);color:#fff8ec}
  :host([data-th=paper]) .row:nth-child(odd) .card{rotate:-.8deg}:host([data-th=paper]) .row:nth-child(even) .card{rotate:.6deg}
  :host([data-th=paper]) .row .card .bkf small{color:inherit;opacity:.85}:host([data-th=paper]) .row .card .bkf span{color:inherit}
  :host([data-th=paper]) .row .card.pz-hi .bkf,:host([data-th=paper]) .row .card.pz-lo .bkf{color:#fff8ec}:host([data-th=paper]) .row .card.pz-md .bkf{color:#3a2c12}
  :host([data-th=paper]) .row .card:hover{box-shadow:4px 6px 0 rgba(0,0,0,.24)}
  :host([data-th=paper]) .flh{color:#6a5a48;text-shadow:none}
  :host([data-th=paper]) .end a.go{background:#f3c14d;color:#3a2c12;animation:none;box-shadow:0 5px 0 #b48a2c,0 14px 24px -10px rgba(0,0,0,.5);border:0}
  :host([data-th=paper]) .end a.go::after{display:none}
  @media (prefers-reduced-motion:reduce){.pz{display:none}}
  `;
  var stageAdd = '';
  function build() {
    var fr = frameSvg('#2f7a72', '#173f3d'), fr2 = frameSvg('#f3c14d', '#b48a2c'), fr3 = frameSvg('#ef7d5e', '#a9442c');
    var tw = '<svg viewBox="0 0 100 40" preserveAspectRatio="none" style="top:calc(100% - 1px);height:11vh;filter:drop-shadow(0 6px 6px rgba(0,0,0,.3))"><path fill="#f3c14d" d="M0 0H100V22 L93 34 L87 20 L80 36 L73 22 L67 35 L60 20 L53 34 L47 21 L40 36 L33 22 L27 34 L20 20 L13 35 L7 21 L0 30Z"/></svg>' +
      '<svg viewBox="0 0 100 40" preserveAspectRatio="none" style="top:calc(100% - 1px);height:7vh"><path fill="#ef7d5e" d="M0 0H100V20 L95 30 L90 18 L85 33 L80 21 L75 31 L70 17 L65 29 L60 20 L55 34 L50 19 L45 30 L40 18 L35 32 L30 20 L25 30 L20 17 L15 31 L10 21 L5 33 L0 22Z"/></svg>' +
      '<svg viewBox="0 0 100 40" preserveAspectRatio="none" style="top:-8vh;height:8vh;transform:scaleY(-1)"><path fill="#ef7d5e" d="M0 0H100V20 L94 31 L88 18 L82 32 L76 19 L70 30 L64 18 L58 33 L52 20 L46 31 L40 18 L34 32 L28 19 L22 30 L16 18 L10 31 L4 20 L0 26Z"/></svg>';
    return '<div class="pz-lg"></div>' +
      '<div class="pz-fr f0">' + fr + '</div><div class="pz-fr f1">' + fr2 + '</div><div class="pz-fr f2">' + fr3 + '</div>' +
      '<div class="pz-ch"><span class="pz-lt" style="--r:-4deg">บ</span><span class="pz-lt" style="--r:3deg">ท</span><span class="pz-lt" style="--r:-2deg">ที่</span><span class="pz-lt n" style="--r:4deg">1</span>' +
        '<i class="pz-tp" style="left:calc(50% - 128px);top:-8px;transform:rotate(-12deg)"></i><i class="pz-tp" style="left:calc(50% + 86px);top:44px;transform:rotate(10deg)"></i><p>หาข้อที่ซ่อนอยู่ในสัญญา</p></div>' +
      '<div class="pz-pg"><h4>สัญญาเช่าห้อง (ตัวอย่าง)</h4>' +
        '<p class="pz-tx">ข้อ 1 ผู้ให้เช่าตกลงให้ นายตัวอย่าง นามสมมติ เช่าห้อง 000 ค่าเช่าเดือนละ 8,500 บาท</p>' +
        cl(0, 'ข้อ 2 ผู้ให้เช่า<b>ขึ้นค่าเช่าได้ตลอดเวลา</b> โดยไม่ต้องแจ้งล่วงหน้า') + '<i class="pz-ln"></i>' +
        cl(1, 'ข้อ 3 เงินประกัน 17,000 บาท <b>หักได้ตามที่เห็นสมควร</b>') + '<i class="pz-ln s"></i>' +
        cl(2, 'ข้อ 4 ชำระค่าเช่าล่าช้า <b>ปรับวันละ 300 บาท</b>') + '<i class="pz-ln"></i>' +
        '<div class="pz-fine"><small class="h">หมายเหตุท้ายสัญญา</small><div class="pz-un"><p class="pz-hd h0">ก. <b>ยกเลิกก่อนกำหนด = เสียเงินประกันหมด</b></p><p class="pz-hd h1">ข. <b>ต่อสัญญาเองอัตโนมัติทุกปี</b></p></div>' +
          '<div class="pz-shw"><div class="pz-sh"><i></i><i></i><i></i><i></i></div><svg class="pz-flap"><defs><linearGradient id="pzfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#eadcbf"/></linearGradient></defs><path fill="url(#pzfg)" stroke="#cdb88f" stroke-width="1"/></svg></div></div>' +
        '<div class="pz-sc">' + SC + '</div></div>' +
      '<div class="pz-bn"><div class="pz-bt"><span>บทที่ 1 · <b>ตัดข้อเสี่ยง</b></span><span>บทที่ 2 · <b>ลอกดูตัวเล็ก</b></span></div><span class="pz-cn">✂ <b class="n">0</b> / 5</span></div>' +
      '<div class="pz-tw">' + tw + '</div>' +
      '<div class="pz-se"><i class="s0"></i><i class="s1"></i><i class="s2"></i><i class="s3">ตรวจ<br>แล้ว<small>พบ 5 จุด</small></i></div>';
    function cl(k, t) { return '<div class="pz-cl c' + k + '"><div class="pz-ho"></div><div class="pz-sd"></div><div class="pz-pc">' + t + '</div><svg class="pz-cut"><path class="g"/><path class="k"/></svg></div>'; }
  }
  var Z = null;
  var init0 = T.init;
  T.init = function (SR, host) {
    try { init0 && init0(SR, host); } catch (e) {}
    host.__thQuiet = true;
    var st = SR.getElementById('st'), cam = SR.getElementById('cam'), cw = SR.getElementById('cw');
    var L = document.createElement('div'); L.className = 'pz'; L.setAttribute('aria-hidden', 'true'); L.innerHTML = build(); st.insertBefore(L, cam.nextSibling);
    var pop = document.createElement('div'); pop.className = 'pz-pop'; pop.setAttribute('aria-hidden', 'true'); pop.innerHTML = '<div class="t"></div><div class="b"></div>'; cam.insertBefore(pop, cw);
    var q = function (s) { return L.querySelector(s); }, qa = function (s) { return [].slice.call(L.querySelectorAll(s)); };
    Z = { host: host, SR: SR, st: st, L: L, pop: pop, popT: pop.querySelector('.t'), fr: qa('.pz-fr'), ch: q('.pz-ch'), lt: qa('.pz-lt'), pg: q('.pz-pg'), bn: q('.pz-bn'), cn: q('.pz-cn'), cnn: q('.pz-cn .n'),
      cls: qa('.pz-cl'), sc: q('.pz-sc'), b1: q('.pz-sc .b1'), b2: q('.pz-sc .b2'), fine: q('.pz-fine'), shw: q('.pz-shw'), sh: q('.pz-sh'), flap: q('.pz-flap path'), hd: qa('.pz-hd'),
      tw: q('.pz-tw'), se: q('.pz-se'), lg: q('.pz-lg'), lastN: -1, lp: -1, cuts: [], rh: SR.getElementById('rh'), end: SR.getElementById('end') };
    Z.cls.forEach(function (c) { Z.cuts.push({ el: c, ho: c.querySelector('.pz-ho'), sd: c.querySelector('.pz-sd'), pc: c.querySelector('.pz-pc'), svg: c.querySelector('.pz-cut'), g: c.querySelector('.pz-cut .g'), k: c.querySelector('.pz-cut .k') }); });
    function geo() {
      Z.cuts.forEach(function (c) {
        var w = c.el.offsetWidth + 8, h = c.el.offsetHeight + 6; c.w = w; c.h = h; c.x = c.el.offsetLeft - 4; c.y = c.el.offsetTop - 3; c.L = 2 * (w + h);
        c.svg.setAttribute('width', w); c.svg.setAttribute('height', h); c.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        var d = 'M0 0H' + w + 'V' + h + 'H0Z'; c.g.setAttribute('d', d); c.k.setAttribute('d', d); c.k.style.strokeDasharray = c.L; c.k.__pz = {};
      });
      Z.fw = Z.fine.offsetWidth; Z.fh = Z.fine.offsetHeight; Z.H = Z.st.clientHeight;
      Z.lp = -1; Z.popG = null;
    }
    Z.geo = geo; geo();
    addEventListener('resize', function () { requestAnimationFrame(geo); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(geo);
  };
  /* จุดบนเส้นรอบกรอบ (ตามเข็มนาฬิกา จากมุมซ้ายบน) */
  function per(c, s) { var w = c.w, h = c.h; if (s <= w) return [s, 0, 0]; s -= w; if (s <= h) return [w, s, 90]; s -= h; if (s <= w) return [w - s, h, 180]; s -= w; return [0, h - Math.min(h, s), 270]; }
  /* ตัดสี่เหลี่ยมด้วยเส้นพับ: คืนส่วนที่เหลือ + ส่วนที่พับขึ้น (สะท้อนข้ามเส้น) */
  function peel(w, h, d) {
    var t = .62, x1 = w - d, x2 = x1 + t * h, ux = x2 - x1, uy = -h, n = Math.hypot(ux, uy); ux /= n; uy /= n;
    function side(P) { return ux * (P[1] - h) - uy * (P[0] - x1); }   /* <0 = ฝั่งซ้าย (คงอยู่) */
    var R = [[0, 0], [w, 0], [w, h], [0, h]], keep = [], cut = [];
    for (var i = 0; i < 4; i++) {
      var A = R[i], B = R[(i + 1) % 4], sa = side(A), sb = side(B);
      if (sa <= 0) keep.push(A); else cut.push(A);
      if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) { var k = sa / (sa - sb), X = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; keep.push(X); cut.push(X); }
    }
    var fl = cut.map(function (P) { var vx = P[0] - x1, vy = P[1] - h, pr = vx * ux + vy * uy; return [x1 + 2 * pr * ux - vx, h + 2 * pr * uy - vy]; });
    return { keep: keep, flap: fl };
  }
  function poly(a, pct, w, h) { return a.map(function (P) { return pct ? (P[0] / w * 100).toFixed(2) + '% ' + (P[1] / h * 100).toFixed(2) + '%' : P[0].toFixed(1) + ' ' + P[1].toFixed(1); }).join(pct ? ',' : ' L'); }
  function frame(p, info) {
    if (!Z) return;
    if (Z.lp === p) return; Z.lp = p;
    if (!Z.fw && p > .15 && Z.geo) Z.geo();   /* ตอนเริ่มอาจยังวัดขนาดไม่ได้ (ซ่อนอยู่) */
    var host = Z.host, H = Z.H || 800;
    var on = p > .19; if (on !== Z.on) { Z.on = on; host.classList.toggle('pz-on', on); }
    var vis = p > .025 && p < OUT1; if (vis !== Z.vis) { Z.vis = vis; S(Z.L, 'visibility', vis ? 'visible' : 'hidden'); }
    S(Z.L, 'opacity', (1 - seg(p, OUT0, OUT1)).toFixed(3));
    /* 10: แสงเฉียงเลื่อนตาม + เงาชั้นกระดาษยาวขึ้น */
    S(Z.lg, 'opacity', (seg(p, .04, .1) * .9).toFixed(3)); S(Z.lg, 'transform', 'translateX(' + lerp(-14, 10, seg(p, .04, .66)).toFixed(1) + '%)');
    var sd = Math.round(lerp(-2, 9, seg(p, .2, .64)) * 2) / 2; S(Z.L, '--sd', String(sd));
    /* 1: ดิ่งผ่านกรอบกระดาษ 3 ชั้น */
    Z.fr.forEach(function (f, k) {
      var a = .035 + k * .03, t = seg(p, a, a + .12), o = seg(p, a - .01, a + .015) * (1 - seg(t, .72, 1));
      S(f, 'visibility', o > .002 ? 'visible' : 'hidden'); if (o <= .002) return;
      S(f, 'opacity', o.toFixed(3)); S(f, 'transform', 'scale(' + (.62 + t * t * 3.4 + k * .04).toFixed(4) + ')');
    });
    /* 11: ป้ายบทที่ 1 ตัวอักษรตัดกระดาษ */
    var co = seg(p, .07, .085) * (1 - seg(p, .172, .192));
    S(Z.ch, 'visibility', co > .002 ? 'visible' : 'hidden');
    if (co > .002) { S(Z.ch, 'opacity', co.toFixed(3)); S(Z.ch, 'transform', 'translateY(' + (-seg(p, .172, .192) * 30).toFixed(1) + 'px)');
      Z.lt.forEach(function (e, i) { var s = io(seg(p, .072 + i * .009, .09 + i * .009)); S(e, '--s', (s * (1 + Math.sin(s * Math.PI) * .18)).toFixed(3)); }); }
    /* หน้าสัญญา */
    var pi = seg(p, .165, .198), po = pi * (1 - seg(p, OUT0, OUT1));
    S(Z.pg, 'visibility', pi > .002 && p < OUT1 ? 'visible' : 'hidden');
    S(Z.pg, 'opacity', cl(pi * 1.4).toFixed(3)); S(Z.pg, 'transform', 'translateY(' + ((1 - io(pi)) * 22).toFixed(1) + 'px) scale(' + lerp(.92, 1, io(pi)).toFixed(4) + ')');
    var done = p > (TW0 + TW1) / 2; if (done !== Z.done) { Z.done = done; Z.pg.classList.toggle('done', done); }
    /* 2: กรรไกรตัดตามเส้นประ */
    var n = 0, scV = 0, sx = 0, sy = 0, sr = 0;
    Z.cuts.forEach(function (c, k) {
      var a = CUT[k], q = seg(p, a, a + CD), lf = io(seg(p, a + CD, a + CD + .016));
      if (done) lf = 0;
      S(c.svg, '--go', (seg(p, a - .012, a) * (1 - lf)).toFixed(3));
      S(c.k, 'strokeDashoffset', (c.L * (1 - q)).toFixed(1)); S(c.k, 'opacity', (1 - lf).toFixed(3));
      S(c.ho, 'opacity', lf.toFixed(3)); S(c.sd, 'opacity', (lf * .55).toFixed(3));
      S(c.sd, 'transform', 'translate(' + (lf * (4 + sd)).toFixed(1) + 'px,' + (lf * (10 + sd)).toFixed(1) + 'px)');
      S(c.pc, 'transform', lf ? 'translate(' + (-lf * 3).toFixed(1) + 'px,' + (-lf * 9).toFixed(1) + 'px) rotate(' + (lf * (k % 2 ? 1.6 : -2)).toFixed(2) + 'deg) scale(' + (1 + lf * .025).toFixed(3) + ')' : '');
      var isCut = q >= 1 && !done; if (isCut !== c.cut) { c.cut = isCut; c.el.classList.toggle('cut', isCut); }
      if (q >= 1 && lf > .5) n++;
      if (q > 0 && q < 1) { var P = per(c, q * c.L); scV = 1; sx = c.x + P[0]; sy = c.y + P[1]; sr = P[2]; }
    });
    S(Z.sc, 'visibility', scV ? 'visible' : 'hidden'); S(Z.sc, 'opacity', String(scV));
    if (scV) { S(Z.sc, 'transform', 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) rotate(' + sr + 'deg)'); var ch = Math.abs(Math.sin(p * 2600)) * 16; S(Z.b1, 'transform', 'rotate(' + (-ch).toFixed(1) + 'deg)'); S(Z.b2, 'transform', 'rotate(' + ch.toFixed(1) + 'deg)'); }
    /* 4: ลอกมุมกระดาษ → ดึงแผ่นออก */
    var pq = io(seg(p, PE0, PE1)), rip = io(seg(p, PE1, PE2)), w = Z.fw, h = Z.fh;
    if (!done && w) {
      var d = pq * w * .58;
      if (d < 1) { S(Z.sh, 'clipPath', ''); S(Z.flap, 'd', ''); }
      else { var R = peel(w, h, d); S(Z.sh, 'clipPath', 'polygon(' + poly(R.keep, 1, w, h) + ')'); S(Z.flap, 'd', R.flap.length ? 'M' + poly(R.flap, 0) + 'Z' : ''); }
      S(Z.shw, 'transform', rip ? 'translate(' + (rip * 26).toFixed(1) + '%,' + (-rip * 110).toFixed(1) + '%) rotate(' + (rip * 12).toFixed(2) + 'deg)' : '');
      S(Z.shw, 'opacity', (1 - seg(rip, .45, 1)).toFixed(3));
    }
    if (p > PE0 + (PE1 - PE0) * .62) n++;
    if (p > PE1 + (PE2 - PE1) * .55) n++;
    Z.hd[0].classList.toggle('on', p > PE0 + (PE1 - PE0) * .62 && !done); Z.hd[1].classList.toggle('on', p > PE1 + (PE2 - PE1) * .55 && !done);
    if (done) n = 5;
    if (n !== Z.lastN) { if (n > Z.lastN && Z.lastN >= 0) { Z.cn.classList.remove('bump'); void Z.cn.offsetWidth; Z.cn.classList.add('bump'); } Z.lastN = n; Z.cnn.textContent = n; }
    /* แถบบทที่ 1/2 + ตัวนับ */
    var bo = seg(p, .19, .205) * (1 - seg(p, TW0 + .01, TW0 + .025));
    S(Z.bn, 'visibility', bo > .002 ? 'visible' : 'hidden'); S(Z.bn, 'opacity', bo.toFixed(3));
    var c2 = p > PE0 - .012; if (c2 !== Z.c2) { Z.c2 = c2; Z.bn.classList.toggle('c2', c2); }
    /* 9: ขอบกระดาษฉีกกวาดผ่าน */
    var tq = seg(p, TW0, TW1); S(Z.tw, 'visibility', tq > 0 && tq < 1 ? 'visible' : 'hidden');
    if (tq > 0 && tq < 1) S(Z.tw, 'transform', 'translateY(' + (io(tq) * (H * 2.6)).toFixed(1) + 'px)');
    /* 6: ตรากระดาษซ้อนชั้น กดลงแล้วนูน */
    var si = seg(p, SE0, SE1), so = cl(si * 5);
    S(Z.se, 'visibility', so > .002 ? 'visible' : 'hidden');
    if (so > .002) { var sc = si < .55 ? lerp(1.8, .9, io(si / .55)) : lerp(.9, 1, io((si - .55) / .45));
      S(Z.se, 'opacity', so.toFixed(3)); S(Z.se, 'transform', 'scale(' + sc.toFixed(4) + ') rotate(' + lerp(-18, -6, io(si)).toFixed(2) + 'deg)'); }
    /* 8: การ์ดผลแบบป๊อปอัป */
    var pp = seg(p, .712, .742), pu = io(seg(p, .716, .8));
    S(Z.pop, 'visibility', pp > .002 ? 'visible' : 'hidden');
    if (pp > .002) {
      if (!Z.popG) popGeo(); S(Z.pop, 'opacity', pp.toFixed(3));
      S(Z.popT, 'transform', 'rotateX(' + lerp(88, 0, pu).toFixed(2) + 'deg)');
      if (!Z.tint) tint();
    }
  }
  function popGeo() {
    var st = Z.st, H = Z.H || st.clientHeight, rh = Z.rh, end = Z.end, flh = end && end.querySelector('.flh');
    if (!rh || !end) return;
    var top = rh.offsetTop - 18, bot = end.offsetTop + (flh ? flh.offsetTop + flh.offsetHeight + 12 : 30);
    function loc(y) { return H / 2 + (y - H / 2) / 1.03; }
    var t = loc(top), b = loc(bot); Z.pop.style.top = t.toFixed(0) + 'px'; Z.pop.style.height = Math.max(120, b - t).toFixed(0) + 'px';
    Z.pop.style.setProperty('--hh', Math.max(60, loc(rh.offsetTop + rh.offsetHeight + 6) - t).toFixed(0) + 'px');
    Z.popG = true;
  }
  function tint() { /* แถบกระดาษสี: 2 ข้อแรกเสี่ยงสูง · 2 ข้อถัดไปปานกลาง · ข้อสุดท้ายต่ำ */
    var cards = [].slice.call(Z.SR.querySelectorAll('.row .card')).filter(function (c) { return c.textContent.trim(); });
    if (!cards.length) return;
    cards.forEach(function (c, i) { c.classList.add(i < 2 ? 'pz-hi' : i < 4 ? 'pz-md' : 'pz-lo'); });
    Z.tint = true;
  }
  T.css += css; T.frame = frame;
  addEventListener('resize', function () { if (Z) Z.popG = null; });
  if (window.__vchApply) window.__vchApply();
})();
/*/PZSCROLL*/
