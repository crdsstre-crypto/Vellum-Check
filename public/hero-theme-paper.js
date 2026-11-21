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
  .pc-t{top:calc(var(--pc-top,58px) - 14px);height:calc(16vh + 12px)}   /* v2: ชิดใต้แถบหัวเว็บจริง (เดิมใช้ --art-head ซึ่งรวมระยะเผื่อ จึงมีช่องว่าง) · ยื่นเข้าใต้หัวเว็บ 14px กันช่องตอนแกว่ง */.pc-b{bottom:-1%;height:11vh}
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
  @media (min-width:768px){.pc-t{height:calc(15vh + 12px)}.pc-b{height:11vh}}
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
    /* ขอบบนของกรอบกระดาษ = ขอบล่างของแถบหัวเว็บที่เห็นจริง */
    function top() { var h = document.querySelector('.site-header'); if (!h) return; var b = h.getBoundingClientRect().bottom; if (b > 0) host.style.setProperty('--pc-top', b.toFixed(0) + 'px'); }
    top(); setTimeout(top, 600); addEventListener('resize', function () { requestAnimationFrame(top); });
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

/*PZHEAD*/ /* ธีมตัดกระดาษ: หัวเว็บเป็นกระดาษคราฟต์ 2 ชั้น (เฉพาะหน้าแรก · ธีมอื่นไม่เปลี่ยน)
   ขอบล่างตัดซิกแซก + ชั้นมัสตาร์ดเหลื่อม · ลายเส้นใยกระดาษ · โลโก้ V ซ้อน 3 สี · ปุ่มกลมกระดาษ · ป้ายตรวจสัญญามัสตาร์ดรอยปรุ + เทป
   ดาวลับข้างชื่อเว็บ แตะแล้วโน้ตพับเปิด · เทปลายจุดมุมซ้าย */
(function () {
  'use strict';
  if (window.__pzHead) return; window.__pzHead = 1;
  var H = 'html[data-htheme="paper"][data-view="home"] body';
  function zig(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((100 - i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '100%' : 'calc(100% - ' + d + 'px)')); return 'polygon(0 0,100% 0,' + a.join(',') + ')'; }
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1 0 0 0 .2 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")";
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var css =
    '.pzh,.pzv,.pzs,.pzt{display:none}' +
    H + ' .site-header{background:none !important;box-shadow:none !important;border:0 !important;isolation:isolate}' +
    H + ' .site-header .pzh{display:block;position:absolute;left:0;right:0;top:0;bottom:-9px;z-index:-1;pointer-events:none}' +
    '.pzh i{position:absolute;inset:0}' +
    '.pzh .k2{background:#a9843a;clip-path:' + zig(64, 9) + ';filter:drop-shadow(0 4px 3px rgba(0,0,0,.32))}' +
    '.pzh .k1{bottom:6px;background:' + FIB + ',' + NOISE + ',linear-gradient(180deg,#b19267,#a1845a);clip-path:' + zig(80, 7) + '}' +
    '.pzh .wa{left:-16px;top:7px;right:auto;bottom:auto;width:76px;height:17px;transform:rotate(-24deg);opacity:.8;box-shadow:0 1px 2px rgba(0,0,0,.2);background:radial-gradient(circle,#c4735a 0 2.3px,transparent 2.6px) 0 0/12px 17px,#e6d6b8}' +
    '@media (min-width:768px){.pzh .wa{left:-12px;top:8px;transform:rotate(-18deg)}}' +
    /* โลโก้ V ซ้อน 3 สี */
    H + ' .site-header .brand > svg{display:none !important}' +
    H + ' .site-header .pzv{display:block;position:relative;flex:none;width:30px;height:34px;margin-right:2px}' +
    '.pzv svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}' +
    H + ' .site-header .brand-name{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;background:none !important;text-shadow:none !important}' +
    /* ดาวลับ */
    H + ' .site-header .brand{position:relative}' +
    H + ' .site-header .pzs{display:block;position:absolute;left:16px;top:-6px;z-index:2;width:30px;height:30px;margin:0;padding:6px;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.pzs svg{display:block;width:18px;height:18px;filter:drop-shadow(1px 2px 0 rgba(0,0,0,.25));transition:transform .2s}' +
    '.pzs:hover svg{transform:rotate(12deg) scale(1.1)}.pzs.go svg{animation:pzsp .6s cubic-bezier(.3,1.6,.5,1)}' +
    '.pzs,.pzs:focus{outline:none !important;box-shadow:none !important;border-radius:50%}.pzs:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:1px}' +
    '@keyframes pzsp{0%{transform:scale(.8) rotate(-30deg)}60%{transform:scale(1.35) rotate(30deg)}100%{transform:scale(1.15) rotate(18deg)}}' +
    '.pzn{position:fixed;z-index:60;width:min(250px,calc(100vw - 24px));padding:12px 14px 12px 50px;border-radius:4px;background:#eadcc0;color:#3a2a16;font:500 12.5px/1.5 Prompt,Sarabun,sans-serif;box-shadow:3px 4px 0 #ef7d5e,0 14px 22px -8px rgba(0,0,0,.55);transform-origin:var(--ox,30px) 0;animation:pzno .45s cubic-bezier(.3,1.4,.5,1)}' +
    '.pzn b{display:block;font:700 14px/1.35 Prompt,sans-serif;color:#1d4f4c}' +
    '.pzn svg{position:absolute;left:11px;top:12px;width:30px;height:30px}' +
    '.pzn::before{content:"";position:absolute;left:var(--ox,30px);top:-7px;margin-left:-7px;border:7px solid transparent;border-top:0;border-bottom-color:#eadcc0}' +
    '.pzn.out{animation:pznc .3s ease forwards}' +
    '@keyframes pzno{from{transform:perspective(500px) rotateX(-90deg);opacity:0}to{transform:none;opacity:1}}@keyframes pznc{to{transform:perspective(500px) rotateX(-90deg);opacity:0}}' +
    /* ปุ่มกลมกระดาษ (☰ / บัญชี / ภาษา) */
    H + ' .site-header .vct-mb,' + H + ' .site-header #authToggle.auth-toggle,' + H + ' .site-header .vc-lang{position:relative !important;background:#e3d3b4 !important;border:0 !important;color:#3a2a16 !important;box-shadow:2px 3px 0 #7d6233,0 6px 8px -4px rgba(0,0,0,.4) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important}' +
    H + ' .site-header .vct-mb::after,' + H + ' .site-header #authToggle.auth-toggle::after,' + H + ' .site-header .vc-lang::after{content:"" !important;display:block !important;position:absolute;inset:3px;border-radius:inherit;border:1.5px dashed rgba(58,42,22,.24);pointer-events:none;background:none !important}' +
    H + ' .site-header .vct-mb *,' + H + ' .site-header #authToggle *,' + H + ' .site-header .vc-lang *{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;text-shadow:none !important}' +
    H + ' .site-header .vct-mb svg,' + H + ' .site-header #authToggle svg{stroke:currentColor;filter:none !important}' +
    H + ' .site-header .vct-mb:active,' + H + ' .site-header #authToggle:active,' + H + ' .site-header .vc-lang:active{transform:translate(1px,2px);box-shadow:1px 1px 0 #7d6233 !important}' +
    H + ' .site-header .vct-mb:focus-visible,' + H + ' .site-header #authToggle:focus-visible,' + H + ' .site-header .vc-lang:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    /* ลิงก์เมนู (คอม) */
    H + ' .site-header .dx-nav a:not([href="#checkCard"]),' + H + ' .site-header .dx-nav a:not([href="#checkCard"]) *{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;text-shadow:none !important}' +
    H + ' .site-header .dx-nav a:not([href="#checkCard"])::after{background:#d0603f !important}' +
    /* ป้ายตรวจสัญญา = กระดาษมัสตาร์ด ขอบรอยปรุ + เทปมุม (ปุ่มทองปุ่มเดียวบนหัวเว็บ) */
    H + ' .site-header .dx-nav a[href="#checkCard"]{position:relative !important;overflow:visible !important;border-radius:3px !important;background:#d1a54a !important;border:0 !important;color:#3a2c12 !important;box-shadow:2px 3px 0 #7d6233,0 7px 10px -5px rgba(0,0,0,.45) !important;padding-left:18px !important;padding-right:18px !important;animation:none !important;transition:transform .15s,box-shadow .15s !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"] *{color:#3a2c12 !important;-webkit-text-fill-color:#3a2c12 !important;text-shadow:none !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]::before,' + H + ' .site-header .dx-nav a[href="#checkCard"]::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border-radius:0 !important;opacity:1 !important;transform:none !important;animation:none !important;box-shadow:none !important;background:radial-gradient(circle 2.4px at 50% 50%,#a98b5f 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]::before{left:-3px !important}' + H + ' .site-header .dx-nav a[href="#checkCard"]::after{right:-3px !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]:hover{transform:translateY(-1px) !important;box-shadow:2px 4px 0 #7d6233,0 10px 14px -6px rgba(0,0,0,.5) !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]:active{transform:translate(1px,2px) !important;box-shadow:1px 1px 0 #7d6233 !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    H + ' .site-header .pzt{display:block;position:absolute;right:-9px;top:-6px;width:28px;height:11px;transform:rotate(18deg);background:rgba(230,216,188,.72);border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08);pointer-events:none}' +
    '@media (prefers-reduced-motion:reduce){.pzn,.pzn.out,.pzs.go svg{animation:none}}';
  /* v2: หัวเว็บเป็นกระดาษเขียวเข้มสีโต๊ะ ชุดเดียวกับแถบล่าง — ขอบฟอยล์ทองหม่น · ดาวฉลุจาง · ตัวหนังสือครีม */
  var STARS = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='40'%3E%3Cg fill='%23b98d45' fill-opacity='.22'%3E%3Cpath d='M12 6l1.4 2.9 3.1.4-2.3 2.1.6 3.1L12 13l-2.8 1.5.6-3.1-2.3-2.1 3.1-.4z'/%3E%3Cpath d='M44 22l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z'/%3E%3Ccircle cx='30' cy='8' r='1.3'/%3E%3Ccircle cx='56' cy='34' r='1.1'/%3E%3Ccircle cx='22' cy='31' r='1.2'/%3E%3C/g%3E%3C/svg%3E\")";
  var NOISE2 = NOISE.replace("0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1", "0 0 0 0 0 0 0 0 0 .05 0 0 0 0 .05");
  css +=
    '.pzh .k2{background:#b8964e !important;filter:drop-shadow(0 4px 4px rgba(0,0,0,.4)) !important}' +
    '.pzh .k1{bottom:5px !important;background:' + STARS + ',' + NOISE2 + ',linear-gradient(180deg,#224a45,#2c5b55) !important}' +
    H + ' .site-header .brand-name{color:#e6d6b8 !important;-webkit-text-fill-color:#e6d6b8 !important;text-shadow:0 1px 2px rgba(0,0,0,.35) !important}' +
    H + ' .site-header .dx-nav a:not([href="#checkCard"]),' + H + ' .site-header .dx-nav a:not([href="#checkCard"]) *{color:#e6d6b8 !important;-webkit-text-fill-color:#e6d6b8 !important}' +
    H + ' .site-header .vct-mb,' + H + ' .site-header #authToggle.auth-toggle,' + H + ' .site-header .vc-lang{box-shadow:2px 3px 0 #10302c,0 6px 8px -4px rgba(0,0,0,.5) !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]{box-shadow:2px 3px 0 #10302c,0 7px 10px -5px rgba(0,0,0,.5) !important}' +
    H + ' .site-header .dx-nav a[href="#checkCard"]::before,' + H + ' .site-header .dx-nav a[href="#checkCard"]::after{background:radial-gradient(circle 2.4px at 50% 50%,#24504b 92%,transparent) 0 1px/6px 8px repeat-y !important}';
  var V = 'M4 7H15V9.4L12.6 10L20.4 31L27.6 10L25 9.4V7H36V9.4L33.4 10L22 40H18.4L6.4 10L4 9.4Z', SW = 'M11 44.4Q20 41.6 29 44.4';
  var LOGO = '<svg viewBox="0 0 40 46" aria-hidden="true">' +
    '<g transform="translate(2.6 2.6)"><path d="' + V + '" fill="#c4735a"/><path d="' + SW + '" stroke="#c4735a" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>' +
    '<g transform="translate(1.3 1.3)"><path d="' + V + '" fill="#d1a54a"/><path d="' + SW + '" stroke="#d1a54a" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>' +
    '<path d="' + V + '" fill="#e6d6b8" stroke="#5a3a18" stroke-width=".7"/><path d="' + SW + '" stroke="#e6d6b8" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.4 4.9 17.1l1-5.6-4.1-4 5.7-.8z" fill="#d1a54a" stroke="#a87a22" stroke-width="1" stroke-linejoin="round"/></svg>';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  var note = null;
  function closeNote() { if (!note) return; var n = note; note = null; n.classList.add('out'); setTimeout(function () { n.remove(); }, 320); }
  function openNote(btn) {
    if (note) { closeNote(); return; }
    var r = btn.getBoundingClientRect(), n = document.createElement('div'); n.className = 'pzn'; n.setAttribute('role', 'status');
    n.innerHTML = STAR + '<b>คุณเจอธีมลับแล้ว ✂</b>ธีม “งานกระดาษตัด” ฉบับหายาก · แตะที่ไหนก็ได้เพื่อปิด';
    document.body.appendChild(n);
    var w = n.offsetWidth, x = Math.max(12, Math.min(innerWidth - w - 12, r.left + r.width / 2 - 40));
    n.style.left = x + 'px'; n.style.top = (r.bottom + 12) + 'px'; n.style.setProperty('--ox', (r.left + r.width / 2 - x) + 'px');
    note = n;
  }
  function build() {
    if (!on()) return false;
    var h = document.querySelector('.site-header'); if (!h) return false;
    if (!document.getElementById('pz-head')) { var s = document.createElement('style'); s.id = 'pz-head'; s.textContent = css; document.head.appendChild(s); }
    if (!h.querySelector(':scope > .pzh')) { var b = document.createElement('div'); b.className = 'pzh'; b.setAttribute('aria-hidden', 'true'); b.innerHTML = '<i class="k2"></i><i class="k1"></i><i class="wa"></i>'; h.insertBefore(b, h.firstChild); }
    var br = h.querySelector('.brand');
    if (br && !br.querySelector('.pzv')) { var v = document.createElement('span'); v.className = 'pzv'; v.innerHTML = LOGO; br.insertBefore(v, br.firstChild); }
    if (br && !br.querySelector('.pzs')) {
      var st = document.createElement('button'); st.type = 'button'; st.className = 'pzs'; st.setAttribute('aria-label', 'ธีมลับ'); st.innerHTML = STAR;
      st.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); st.classList.remove('go'); void st.offsetWidth; st.classList.add('go'); openNote(st); });
      br.appendChild(st);
    }
    var a = h.querySelector('.dx-nav a[href="#checkCard"]'); if (a && !a.querySelector('.pzt')) { var t = document.createElement('i'); t.className = 'pzt'; t.setAttribute('aria-hidden', 'true'); a.appendChild(t); }
    return true;
  }
  document.addEventListener('click', function (e) { if (note && !(e.target.closest && e.target.closest('.pzs,.pzn'))) closeNote(); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNote(); });
  addEventListener('scroll', closeNote, { passive: true, capture: true });
  function go() { if (build()) return; var n = 0, iv = setInterval(function () { if (build() || ++n > 20) clearInterval(iv); }, 400); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZHEAD*/

/*PZNAV*/ /* ธีมตัดกระดาษ: แถบเมนูล่างเป็นกระดาษคราฟต์ (เฉพาะหน้าแรก) — ขอบบนซิกแซก + ชั้นมัสตาร์ด · ไอคอนตัดกระดาษ 2 สี
   แท็บที่เลือก = ป้ายมัสตาร์ดติดเทป · กดแล้วยกขึ้นแล้ววางลง · ไอคอนบัญชีบนหัวเว็บเป็นแบบเดียวกัน (เดิมจางจนมองไม่เห็น) */
(function () {
  'use strict';
  if (window.__pzNav) return; window.__pzNav = 1;
  var H = 'html[data-htheme="paper"][data-view="home"] body';
  function zigTop(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '0' : d + 'px')); return 'polygon(' + a.join(',') + ',100% 100%,0 100%)'; }
  function U(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">' + svg + '</svg>').replace(/'/g, '%27') + '")'; }
  var D = '#3a2a16', R = '#c4735a', C = '#eadcc0', M = '#d1a54a';
  var IC = {
    home: U('<path d="M7 3h10l5 5v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="' + D + '"/><path d="M17 3v5h5z" fill="' + R + '"/><rect x="8" y="12" width="9" height="2.2" rx="1" fill="' + C + '"/><rect x="8" y="16.5" width="6" height="2.2" rx="1" fill="' + R + '"/>'),
    tools: U('<circle cx="14" cy="14" r="10" fill="' + D + '"/><circle cx="14" cy="14" r="6.5" fill="' + C + '"/><path d="M17.5 10.5l-2 5-5 2 2-5z" fill="' + R + '"/>'),
    hist: U('<path d="M7 3h14v3l-5 8 5 8v3H7v-3l5-8-5-8z" fill="' + D + '"/><path d="M10 6h8l-4 6z" fill="' + R + '"/><path d="M10 23l4-5 4 5z" fill="' + M + '"/>'),
    acct: U('<circle cx="14" cy="9" r="5.5" fill="' + D + '"/><path d="M4 25c0-6 4.5-9 10-9s10 3 10 9z" fill="' + R + '"/>')
  };
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1 0 0 0 .2 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")";
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var B = H + ' .bottom-nav';
  var css =
    '.pzb{display:none}' +
    B + '{background:none !important;box-shadow:none !important;border:0 !important;isolation:isolate;contain:layout style !important}' +
    B + ' > .pzb{display:block;position:absolute;left:0;right:0;top:-13px;bottom:0;z-index:-1;pointer-events:none}' +
    '.pzb i{position:absolute;left:0;right:0;bottom:0}' +
    '.pzb .k2{top:0;background:#a9843a;clip-path:' + zigTop(64, 11) + ';filter:drop-shadow(0 -3px 3px rgba(0,0,0,.3))}' +
    '.pzb .k1{top:9px;background:' + FIB + ',' + NOISE + ',linear-gradient(0deg,#a1845a,#ad8f64);clip-path:' + zigTop(80, 7) + '}' +
    /* ไอคอนตัดกระดาษ (แทนภาพเดิม) */
    B + ' .bn-item svg{background:var(--pzi) center/100% 100% no-repeat !important;filter:drop-shadow(1.5px 2px 0 rgba(0,0,0,.2)) !important;opacity:1 !important}' +
    B + ' .bn-item svg > *{display:none !important}' +
    B + ' .bn-item[data-nav="home"]{--pzi:' + IC.home + '}' + B + ' .bn-item.vct-nb{--pzi:' + IC.tools + '}' +
    B + ' .bn-item[data-nav="hist"]{--pzi:' + IC.hist + '}' + B + ' .bn-item[data-nav="acct"]{--pzi:' + IC.acct + '}' +
    B + ' .bn-item span{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;font-weight:600}' +
    B + ' .bn-item.is-on span{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;font-weight:700}' +
    B + ' .bn-item::before,' + B + ' .bn-item::after{display:none !important}' +
    B + ' .bn-item:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:-4px}' +
    /* ป้ายมัสตาร์ดติดเทป (ตัวไฮไลต์ที่เลื่อนตามแท็บเดิม) */
    B + ' .vc-bn-ind::before{inset:0 9% !important;border-radius:4px !important;border:0 !important;background:#c99f48 !important;box-shadow:2px 3px 0 #7d6233,0 6px 10px -5px rgba(0,0,0,.4) !important}' +
    B + ' .vc-bn-ind::after{content:"" !important;display:block !important;position:absolute !important;top:-6px !important;left:50% !important;width:30px !important;height:11px !important;margin-left:-15px !important;border-radius:0 !important;transform:rotate(-6deg) !important;' +
      'background:rgba(230,216,188,.72) !important;border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08);box-shadow:none !important;opacity:1 !important}' +
    /* กด → ยกขึ้นแล้ววางลง */
    B + ' .bn-item.vc-tap{animation:pzlift .45s cubic-bezier(.3,1.4,.5,1) !important}' +
    B + ':has(.bn-item.vc-tap) .vc-bn-ind::before{animation:pzlift2 .45s cubic-bezier(.3,1.4,.5,1)}' +
    '@keyframes pzlift{0%{translate:0 0}35%{translate:0 -7px;rotate:-2deg}100%{translate:0 0;rotate:0deg}}' +
    '@keyframes pzlift2{0%{translate:0 0}35%{translate:0 -7px;rotate:-2deg;box-shadow:3px 9px 0 rgba(0,0,0,.18),0 14px 14px -6px rgba(0,0,0,.45)}100%{translate:0 0;rotate:0deg}}' +
    /* ไอคอนบัญชีบนหัวเว็บ (ล็อกอินแล้ว) */
    H + ' .site-header #authToggle.auth-toggle::before{-webkit-mask:none !important;mask:none !important;background:' + IC.acct + ' center/78% no-repeat !important;opacity:1 !important;filter:drop-shadow(1px 1.5px 0 rgba(0,0,0,.18)) !important}' +
    '@media (prefers-reduced-motion:reduce){' + B + ' .bn-item.vc-tap,' + B + ':has(.bn-item.vc-tap) .vc-bn-ind::before{animation:none !important}}';
  /* v2: แถบล่างเป็นกระดาษเขียวเข้มสีโต๊ะ ตัดกับแผ่นต่างๆ ชัด (ผู้ใช้: กลืนกับแผ่นบัญชีเกินไป ไม่ดูลับ)
     ขอบฟอยล์ทองหม่น · ลายฉลุดาวจางๆ · ไอคอน/ตัวหนังสือครีม · ป้ายแท็บที่เลือกเป็นครีมติดเทป + ตราขี้ผึ้งจิ๋ว */
  var LD = '#e6d6b8', LR = '#d08a70', LC = '#2f5a54', LM = '#cfa75a';
  var ICL = {
    home: U('<path d="M7 3h10l5 5v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="' + LD + '"/><path d="M17 3v5h5z" fill="' + LR + '"/><rect x="8" y="12" width="9" height="2.2" rx="1" fill="' + LC + '"/><rect x="8" y="16.5" width="6" height="2.2" rx="1" fill="' + LR + '"/>'),
    tools: U('<circle cx="14" cy="14" r="10" fill="' + LD + '"/><circle cx="14" cy="14" r="6.5" fill="' + LC + '"/><path d="M17.5 10.5l-2 5-5 2 2-5z" fill="' + LR + '"/>'),
    hist: U('<path d="M7 3h14v3l-5 8 5 8v3H7v-3l5-8-5-8z" fill="' + LD + '"/><path d="M10 6h8l-4 6z" fill="' + LR + '"/><path d="M10 23l4-5 4 5z" fill="' + LM + '"/>'),
    acct: U('<circle cx="14" cy="9" r="5.5" fill="' + LD + '"/><path d="M4 25c0-6 4.5-9 10-9s10 3 10 9z" fill="' + LR + '"/>')
  };
  var STARS = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='40'%3E%3Cg fill='%23b98d45' fill-opacity='.22'%3E%3Cpath d='M12 6l1.4 2.9 3.1.4-2.3 2.1.6 3.1L12 13l-2.8 1.5.6-3.1-2.3-2.1 3.1-.4z'/%3E%3Cpath d='M44 22l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z'/%3E%3Ccircle cx='30' cy='8' r='1.3'/%3E%3Ccircle cx='56' cy='34' r='1.1'/%3E%3Ccircle cx='22' cy='31' r='1.2'/%3E%3C/g%3E%3C/svg%3E\")";
  var NOISE2 = NOISE.replace("0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1", "0 0 0 0 0 0 0 0 0 .05 0 0 0 0 .05");
  css +=
    '.pzb .k2{background:#b8964e !important;filter:drop-shadow(0 -3px 4px rgba(0,0,0,.4)) !important}' +
    '.pzb .k1{top:5px !important;background:' + STARS + ',' + NOISE2 + ',linear-gradient(180deg,#2c5b55,#224a45) !important}' +
    B + ' .bn-item[data-nav="home"]{--pzi:' + ICL.home + ';--pzid:' + IC.home + '}' + B + ' .bn-item.vct-nb{--pzi:' + ICL.tools + ';--pzid:' + IC.tools + '}' +
    B + ' .bn-item[data-nav="hist"]{--pzi:' + ICL.hist + ';--pzid:' + IC.hist + '}' + B + ' .bn-item[data-nav="acct"]{--pzi:' + ICL.acct + ';--pzid:' + IC.acct + '}' +
    B + ' .bn-item svg{opacity:.78 !important;filter:drop-shadow(1px 2px 0 rgba(0,0,0,.35)) !important}' +
    B + ' .bn-item.is-on svg{background-image:var(--pzid) !important;opacity:1 !important;filter:drop-shadow(1.5px 2px 0 rgba(0,0,0,.2)) !important}' +
    B + ' .bn-item span{color:#d6c7a8 !important;-webkit-text-fill-color:#d6c7a8 !important}' +
    B + ' .bn-item.is-on span{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important}' +
    B + ' .vc-bn-ind::before{background:radial-gradient(circle at calc(100% - 9px) 9px,#b55a45 0 4px,#8a4232 4.5px 6px,transparent 6.5px),' + FIB + ',linear-gradient(180deg,#e9dbbf,#ddcca9) !important;box-shadow:2px 3px 0 #10302c,0 6px 10px -5px rgba(0,0,0,.5) !important}' +
    B + ' .bn-item:focus-visible{outline-color:#e6d6b8 !important}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function build() {
    if (!on()) return true;
    if (!document.getElementById('pz-nav')) { var s = document.createElement('style'); s.id = 'pz-nav'; s.textContent = css; document.head.appendChild(s); }
    var n = document.querySelector('.bottom-nav'); if (!n) return false;
    if (!n.querySelector(':scope > .pzb')) { var b = document.createElement('div'); b.className = 'pzb'; b.setAttribute('aria-hidden', 'true'); b.innerHTML = '<i class="k2"></i><i class="k1"></i>'; n.insertBefore(b, n.firstChild); }
    return true;
  }
  function go() { if (build()) return; var k = 0, iv = setInterval(function () { if (build() || ++k > 40) clearInterval(iv); }, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZNAV*/

/*PZMENU*/ /* ธีมตัดกระดาษ: แผ่นเมนู ☰ เป็นกระดาษคราฟต์หม่น (เฉพาะหน้าแรก · โทนเดียวกับหัวเว็บ ไม่แสบตา)
   ขอบบนซิกแซก + ชั้นมัสตาร์ดหม่น · หัวแผ่นไอคอนกรรไกร + เส้นคั่นรอยปรุ · การ์ดกระดาษครีมนวลเอียงสลับ · ไอคอนตัดกระดาษ 2 สี
   ปุ่มภาษาเป็นแถบตั๋ว 3 ช่อง (ช่องที่เลือกติดเทป) · ปุ่มปิดวงกลมกระดาษ */
(function () {
  'use strict';
  if (window.__pzMenu) return; window.__pzMenu = 1;
  var M = 'html[data-htheme="paper"][data-view="home"] body .vct.vcm';
  function zigTop(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '0' : d + 'px')); return 'polygon(' + a.join(',') + ',100% 100%,0 100%)'; }
  function U(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">' + svg + '</svg>').replace(/'/g, '%27') + '")'; }
  var D = '#3a2a16', R = '#c4735a', C = '#eadcc0';
  var IC = {
    cut: U('<path d="M11.2 15.6L24 3.4" stroke="' + D + '" stroke-width="2.8" stroke-linecap="round"/><path d="M12.4 12.4L25 21" stroke="' + D + '" stroke-width="2.8" stroke-linecap="round"/><circle cx="7.6" cy="19.6" r="4.4" fill="none" stroke="' + R + '" stroke-width="2.8"/><circle cx="7.6" cy="8.4" r="4.4" fill="none" stroke="' + D + '" stroke-width="2.8"/><circle cx="13.2" cy="14" r="1.6" fill="' + C + '"/>'),
    tools: U('<rect x="3" y="3" width="9" height="9" rx="2" fill="' + D + '"/><rect x="16" y="3" width="9" height="9" rx="2" fill="' + R + '"/><rect x="3" y="16" width="9" height="9" rx="2" fill="' + R + '"/><path d="M20.5 15.5v10M15.5 20.5h10" stroke="' + D + '" stroke-width="3" stroke-linecap="round"/>'),
    lib: U('<rect x="3" y="4" width="10" height="20" rx="1.5" fill="' + D + '"/><rect x="15" y="4" width="10" height="20" rx="1.5" fill="' + R + '"/><rect x="5.5" y="8" width="5" height="2" rx="1" fill="' + C + '"/><rect x="17.5" y="8" width="5" height="2" rx="1" fill="' + C + '"/>'),
    vid: U('<rect x="3" y="6" width="22" height="16" rx="3" fill="' + D + '"/><path d="M12 10l6 4-6 4z" fill="' + R + '"/>'),
    read: U('<path d="M3 6c4-1.5 7-1 11 1.5V24c-4-2.5-7-3-11-1.5z" fill="' + D + '"/><path d="M25 6c-4-1.5-7-1-11 1.5V24c4-2.5 7-3 11-1.5z" fill="' + R + '"/>')
  };
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")";
  var PAPER = 'background:' + FIB + ',linear-gradient(180deg,#e6d7b9,#ddcca9) !important;';
  var css =
    M + ' .vct-card{background:none !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;isolation:isolate;color:#3a2a16 !important}' +
    M + ' .vct-card::before,' + M + ' .vct-card::after{content:"" !important;display:block !important;position:absolute !important;left:0 !important;right:0 !important;bottom:0 !important;pointer-events:none;z-index:-1 !important;border-radius:0 !important;opacity:1 !important}' +
    M + ' .vct-card::before{top:0 !important;background:#a9843a !important;clip-path:' + zigTop(40, 11) + ';filter:drop-shadow(0 -4px 4px rgba(0,0,0,.35))}' +
    M + ' .vct-card::after{top:9px !important;background:' + FIB + ',' + NOISE + ',linear-gradient(180deg,#ad8f64,#9d8057) !important;clip-path:' + zigTop(50, 7) + '}' +
    /* หัวแผ่น */
    M + ' .vct-hd{background:none !important;box-shadow:none !important;border:0 !important;padding-top:24px !important}' +
    M + ' .vct-hd::before{display:none !important}' +
    M + ' .vct-hd::after{content:"" !important;display:block !important;left:18px !important;right:18px !important;bottom:0 !important;width:auto !important;height:6px !important;opacity:.7 !important;transform:none !important;background:radial-gradient(circle 2.2px at 50% 50%,#5e472a 92%,transparent) 0 0/9px 6px repeat-x !important}' +
    M + ' .vct-hd .ic{position:relative;border-radius:6px !important;' + PAPER + 'border:0 !important;box-shadow:2px 3px 0 #7d6233 !important}' +
    M + ' .vct-hd .ic svg{background:' + IC.cut + ' center/100% 100% no-repeat !important;filter:none !important;-webkit-mask:none !important;mask:none !important;width:26px !important;height:26px !important}' +
    M + ' .vct-hd .ic svg > *{display:none !important}' +
    M + ' .vct-hd b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}' +
    M + ' .vct-hd small{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    M + ' .vct-x{position:relative;border-radius:50% !important;background:#e3d3b4 !important;border:0 !important;color:#3a2a16 !important;box-shadow:2px 3px 0 #7d6233,0 6px 8px -4px rgba(0,0,0,.4) !important;font-weight:700 !important}' +
    M + ' .vct-x::after{content:"" !important;display:block !important;position:absolute;inset:3px;border-radius:50%;border:1.5px dashed rgba(58,42,22,.24);background:none !important;pointer-events:none}' +
    M + ' .vct-x:active{transform:translate(1px,2px);box-shadow:1px 1px 0 #7d6233 !important}' +
    /* การ์ดเมนู */
    M + ' .vcm-row{' + PAPER + 'border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233,0 8px 12px -8px rgba(0,0,0,.5) !important;color:#2e2112 !important;transition:transform .15s,box-shadow .15s !important}' +
    M + ' .vcm-sec:nth-child(odd) .vcm-row,' + M + ' .vcm-row:nth-child(even){rotate:-.6deg}' + M + ' .vcm-sec:nth-child(even) .vcm-row:nth-child(odd){rotate:.5deg}' +
    M + ' .vcm-row:hover{box-shadow:2px 4px 0 #7d6233,0 10px 14px -8px rgba(0,0,0,.5) !important}' +
    M + ' .vcm-row:active{transform:translate(1px,2px) !important;box-shadow:1px 1px 0 #7d6233 !important}' +
    M + ' .vcm-row:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    M + ' .vcm-row b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important}' +
    M + ' .vcm-row small{color:#5a4528 !important;-webkit-text-fill-color:#5a4528 !important}' +
    M + ' .vcm-row em{color:#6f5634 !important;font-style:normal}' +
    M + ' .vcm-row .i{background:#d4c19c !important;border-radius:4px !important;border:0 !important;box-shadow:none !important}' +
    M + ' .vcm-row .i svg{background:var(--pzi) center/100% 100% no-repeat !important;-webkit-mask:none !important;mask:none !important;width:24px !important;height:24px !important;filter:drop-shadow(1px 1.5px 0 rgba(0,0,0,.18)) !important;fill:none !important;stroke:none !important}' +
    M + ' .vcm-row .i svg > *{display:none !important}' +
    M + ' .vcm-row[data-m="tools"]{--pzi:' + IC.tools + '}' + M + ' .vcm-row[data-href="/library"]{--pzi:' + IC.lib + '}' +
    M + ' .vcm-row[data-goto="#introVideo"]{--pzi:' + IC.vid + '}' + M + ' .vcm-row[data-goto="#manifesto"]{--pzi:' + IC.read + '}' +
    /* การ์ดหลากสี (หม่น ไม่แสบตา): เขียวเสจ · ชมพูอิฐ · มัสตาร์ด · ฟ้าหม่น */
    M + ' .vcm-row[data-m="tools"]{background:' + FIB + ',linear-gradient(180deg,#cdd6c0,#bfcab1) !important}' + M + ' .vcm-row[data-m="tools"] .i{background:#a9b897 !important}' +
    M + ' .vcm-row[data-href="/library"]{background:' + FIB + ',linear-gradient(180deg,#e2c6b6,#d6b6a4) !important}' + M + ' .vcm-row[data-href="/library"] .i{background:#c99d86 !important}' +
    M + ' .vcm-row[data-goto="#introVideo"]{background:' + FIB + ',linear-gradient(180deg,#e4d3a6,#d8c493) !important}' + M + ' .vcm-row[data-goto="#introVideo"] .i{background:#c8ad6c !important}' +
    M + ' .vcm-row[data-goto="#manifesto"]{background:' + FIB + ',linear-gradient(180deg,#c6d3d3,#b6c5c6) !important}' + M + ' .vcm-row[data-goto="#manifesto"] .i{background:#93aaac !important}' +
    /* ปุ่มภาษา = แถบตั๋ว */
    M + ' .vcm-h{color:#2e2112 !important;font-weight:700 !important}' +
    M + ' .vcm-lang{background:#e3d3b4 !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233 !important;padding:0 !important;gap:0 !important;overflow:visible !important}' +
    M + ' .vcm-lang button{position:relative;border-radius:4px !important;color:#3a2a16 !important;background:none !important;box-shadow:none !important}' +
    M + ' .vcm-lang button small{color:#5a4528 !important}' +
    M + ' .vcm-lang button + button{background:radial-gradient(circle 2.2px at 50% 50%,#9d8057 92%,transparent) left top/6px 8px repeat-y !important}' +
    M + ' .vcm-lang button.is-on{background:#c99f48 !important;color:#2e2112 !important;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06) !important}' +
    M + ' .vcm-lang button.is-on::after{content:"";position:absolute;top:-6px;left:50%;width:30px;height:11px;margin-left:-15px;transform:rotate(-6deg);background:rgba(230,216,188,.72);border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08);pointer-events:none}' +
    M + ' .vcm-lang button:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:-2px}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function go() { if (!on() || document.getElementById('pz-menu')) return; var s = document.createElement('style'); s.id = 'pz-menu'; s.textContent = css; document.head.appendChild(s); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZMENU*/

/*PZACCT*/ /* ธีมตัดกระดาษ: แผ่นบัญชีเป็นกระดาษคราฟต์หม่น (เฉพาะเปิดจากหน้าแรก) — การ์ดเครดิตเป็น "ซองลับ"
   ฝาซองเปิดฉลุลาย + ซับในมัสตาร์ด · ตราขี้ผึ้งกระดาษ 3 ชั้น · เลขตัดกระดาษ 3 ชั้นบนการ์ดที่โผล่จากซอง · ตรายาง "ลับเฉพาะ"
   เปิดแผ่นครั้งแรกของวัน: ตราแตก 2 ซีก → ฝาซองพับเปิด → การ์ดเลื่อนขึ้น → ตราประกบกลับ (≤0.8 วิ) */
(function () {
  'use strict';
  if (window.__pzAcct) return; window.__pzAcct = 1;
  var A = 'html[data-htheme="paper"][data-view="home"] body #authCard#authCard';   /* id ซ้ำ 2 ครั้ง = ชนะกฎเดิมของ art.css */
  function zigTop(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '0' : d + 'px')); return 'polygon(' + a.join(',') + ',100% 100%,0 100%)'; }
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")";
  var INK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7'/%3E%3C/filter%3E%3Crect width='120' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")";
  function card(bg1, bg2) { return 'background:' + FIB + ',linear-gradient(180deg,' + bg1 + ',' + bg2 + ') !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233,0 8px 12px -8px rgba(0,0,0,.5) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'; }
  var TXT = ' b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}';
  var SM = ' small{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}';
  var SEAL_EDGE = 'polygon(50% 0,60% 6%,72% 3%,78% 14%,92% 18%,90% 31%,100% 42%,93% 54%,98% 67%,87% 75%,85% 89%,71% 90%,62% 100%,50% 94%,38% 100%,29% 90%,15% 89%,13% 75%,2% 67%,7% 54%,0 42%,10% 31%,8% 18%,22% 14%,28% 3%,40% 6%)';
  var LACE = '<svg viewBox="0 0 366 96" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="pzlace"><rect width="366" height="96" fill="#fff"/><g fill="#000">' +
    '<path d="M183 22l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/><circle cx="130" cy="66" r="5"/><circle cx="236" cy="66" r="5"/><circle cx="183" cy="64" r="4"/>' +
    '<path d="M80 82q10-10 20 0q-10 10-20 0z"/><path d="M266 82q10-10 20 0q-10 10-20 0z"/><path d="M150 50q8-8 16 0q-8 8-16 0z"/><path d="M200 50q8-8 16 0q-8 8-16 0z"/>' +
    '<path d="M30 84l5 5-5 5-5-5z"/><path d="M336 84l5 5-5 5-5-5z"/></g></mask></defs>' +
    '<path d="M0 96H366L183 0Z" fill="#b98d45" mask="url(#pzlace)"/><path d="M0 96H366L183 0Z" fill="none" stroke="#8d6a2e" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/></svg>';
  var css =
    /* พื้นแผ่น */
    A + '{background:#9d8057 !important;isolation:isolate}' +
    A + ' > .alx-bg{display:none !important}' +
    '.pza{display:none}' + A + ' > .pza{display:block;position:absolute;inset:0;z-index:0;pointer-events:none;border-radius:inherit;overflow:hidden}' +
    '.pza i{position:absolute;left:0;right:0;bottom:0}' +
    '.pza .k2{top:0;background:#a9843a;clip-path:' + zigTop(40, 11) + '}' +
    '.pza .k1{top:9px;background:' + FIB + ',' + NOISE + ',linear-gradient(180deg,#ad8f64,#9d8057);clip-path:' + zigTop(50, 7) + '}' +
    A + ' > .sheet-head,' + A + ' > .sheet-body{position:relative;z-index:1}' +
    A + ' .sheet-head{background:none !important;border:0 !important;box-shadow:none !important}' +
    A + ' .sheet-head::before,' + A + ' .sheet-head::after{display:none !important}' +
    A + ' .alx-hd{background:radial-gradient(circle 2.2px at 50% 50%,#5e472a 92%,transparent) 0 0/9px 6px repeat-x !important;height:6px !important;opacity:.7;box-shadow:none !important}' +
    A + ' .alx-hd::before,' + A + ' .alx-hd::after{display:none !important}' +
    /* หัวแผ่น */
    A + ' .acct-avatar{background:#e3d3b4 !important;border:0 !important;box-shadow:2px 3px 0 #7d6233 !important;position:relative}' +
    A + ' .acct-avatar::before{display:none !important}' +
    A + ' .acct-avatar::after{content:"" !important;display:block !important;position:absolute;inset:4px;border-radius:50%;border:1.5px dashed rgba(58,42,22,.25);background:none !important;box-shadow:none !important;pointer-events:none;animation:none !important}' +
    A + ' #acctInitial{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;text-shadow:none !important}' +
    A + ' .acct-mail{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}' +
    A + ' .acct-label{color:#2f4a2c !important;-webkit-text-fill-color:#2f4a2c !important;text-shadow:none !important}' + A + ' #adminPanel .adm-head svg:last-child,' + A + ' #adminPanel [class*=chev]{color:#5e472a !important;stroke:#5e472a !important}' + A + ' .acct-label::before{background:#5f9a7a !important;box-shadow:none !important}' +
    A + ' .vc-adm-badge{position:relative;background:#c99f48 !important;color:#2e2112 !important;border:0 !important;border-radius:3px !important;box-shadow:none !important;text-shadow:none !important;-webkit-text-fill-color:#2e2112 !important}' +
    A + ' .vc-adm-badge::after{content:"";position:absolute;top:-5px;left:50%;width:22px;height:9px;margin-left:-11px;transform:rotate(-8deg);background:rgba(230,216,188,.75)}' +
    A + ' #authClose.sheet-close{position:relative !important;background:#e3d3b4 !important;border:0 !important;color:#3a2a16 !important;box-shadow:2px 3px 0 #7d6233,0 6px 8px -4px rgba(0,0,0,.4) !important}' +
    A + ' #authClose.sheet-close::before{content:"" !important;display:block !important;position:absolute;inset:3px;border-radius:50%;border:1.5px dashed rgba(58,42,22,.24);background:none !important;pointer-events:none}' +
    A + ' #authClose.sheet-close *{color:#3a2a16 !important;stroke:#3a2a16 !important}' + A + ' #authClose.sheet-close::after{content:"" !important;display:block !important;position:absolute !important;left:50% !important;top:50% !important;width:16px !important;height:16px !important;margin:-8px 0 0 -8px !important;border:0 !important;border-radius:0 !important;opacity:1 !important;transform:none !important;background:linear-gradient(45deg,transparent 43%,#3a2a16 43% 57%,transparent 57%),linear-gradient(-45deg,transparent 43%,#3a2a16 43% 57%,transparent 57%) !important;-webkit-mask:none !important;mask:none !important}' +
    /* ---------- ซองลับ ---------- */
    A + ' .vc-wcard{margin-top:62px !important;background:linear-gradient(180deg,#b06a55,#a9644f) !important;border:0 !important;border-radius:6px !important;box-shadow:2px 4px 0 #6e3f30,0 14px 20px -10px rgba(0,0,0,.55) !important;transform:none !important;overflow:visible !important;contain:none !important;color:#2e2112 !important;isolation:isolate;padding-bottom:18px !important}' +
    A + ' .vc-wcard::before,' + A + ' .vc-wcard::after{display:none !important}' +
    A + ' .vc-wcard .alx-cf,' + A + ' .vc-wcard .vc-wc-sheen,' + A + ' .vc-wcard .vc-wc-glare{display:none !important}' +
    '.pze{display:none}' + A + ' .vc-wcard > .pze{display:block;position:absolute;pointer-events:none}' +
    A + ' .vc-wcard > .pze-lin{left:8px;right:8px;top:8px;height:42%;z-index:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 6px,transparent 6px 12px),#b98d45;clip-path:polygon(0 0,100% 0,50% 100%)}' +
    A + ' .vc-wcard > .pze-flap{left:0;right:0;top:-58px;height:60px;z-index:0;transform-origin:50% 100%;filter:drop-shadow(0 -2px 2px rgba(0,0,0,.15))}' +
    '.pze-flap svg{display:block;width:100%;height:100%;overflow:visible}' +
    A + ' .vc-wcard > .pze-card{left:16px;right:16px;top:14px;bottom:86px;z-index:1;border-radius:4px;background:' + FIB + ',linear-gradient(180deg,#e9dbbf,#e0cfae);box-shadow:0 6px 10px -4px rgba(0,0,0,.35)}' +
    A + ' .vc-wcard > .pze-pk{left:0;right:0;bottom:0;height:118px;z-index:2;border-radius:0 0 6px 6px;background:linear-gradient(180deg,#b87563,#ad6955);clip-path:polygon(0 0,50% 30%,100% 0,100% 100%,0 100%);filter:drop-shadow(0 -2px 2px rgba(0,0,0,.18))}' +
    A + ' .vc-wcard > .pze-st{right:26px;top:84px;z-index:3;transform:rotate(-12deg);padding:5px 9px;border:2.5px solid rgba(60,92,76,.85);border-radius:4px;color:rgba(60,92,76,.92);font:800 12.5px/1.2 Prompt,sans-serif;text-align:center;-webkit-mask:' + INK + ';mask:' + INK + '}' +
    '.pze-st small{display:block;font-size:9.5px;font-weight:700}' +
    A + ' .vc-wcard > .pze-se{left:50%;bottom:62px;width:46px;height:46px;margin-left:-23px;z-index:4}' +
    '.pze-se b{position:absolute;inset:0;transition:none}' +
    '.pze-se b.l{clip-path:inset(0 50% 0 0)}.pze-se b.r{clip-path:inset(0 0 0 50%)}' +
    '.pze-se b i{position:absolute;inset:0}' +
    '.pze-se .s1{background:#7d3a2c;clip-path:' + SEAL_EDGE + ';filter:drop-shadow(1px 3px 2px rgba(0,0,0,.35))}' +
    '.pze-se .s2{inset:6px !important;border-radius:50%;background:#9c4a38;box-shadow:inset 0 2px 3px rgba(255,255,255,.15)}' +
    '.pze-se .s3{inset:11px !important;border-radius:50%;background:#b55a45;display:flex;align-items:center;justify-content:center;font:800 15px/1 Georgia,serif;color:#e8c9a8;text-shadow:0 -1px 0 rgba(0,0,0,.35),0 1px 0 rgba(255,220,190,.3)}' +
    /* เนื้อหาบนการ์ด */
    A + ' .vc-wcard .vc-wc-top,' + A + ' .vc-wcard .vc-wc-num,' + A + ' .vc-wcard .vc-wc-sub{position:relative;z-index:3}' +
    A + ' .vc-wcard .vc-wc-top{padding:0 6px}' +
    A + ' .vc-wc-lab{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;font-weight:700 !important}' + A + ' .vc-wc-lab svg{stroke:#2e2112 !important;color:#2e2112 !important}' +
    A + ' .vc-wc-voice{background:#cdd6c0 !important;border:0 !important;border-radius:3px !important;color:#2e2112 !important;box-shadow:1px 2px 0 #7d6233 !important}' +
    A + ' .vc-wc-voice *{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;stroke:#2e2112 !important}' +
    A + ' .vc-wc-num{background:none !important;border:0 !important;box-shadow:none !important;padding-left:6px !important}' +
    A + ' .vc-wc-num::before,' + A + ' .vc-wc-num::after{display:none !important}' +
    A + ' .vc-wc-num b{background:none !important;-webkit-background-clip:border-box !important;background-clip:border-box !important;color:#efe3cb !important;-webkit-text-fill-color:#efe3cb !important;-webkit-text-stroke:1.2px #5a3a18;text-shadow:2.5px 2.5px 0 #d1a54a,5px 5px 0 #c4735a !important;filter:none !important}' +
    A + ' .vc-wc-num small{color:#5a3a18 !important;-webkit-text-fill-color:#5a3a18 !important;text-shadow:none !important;font-weight:800 !important}' +
    A + ' .vc-wc-sub{color:#4f3b22 !important;padding:0 6px}' + A + ' .vc-wc-sub *{color:#4f3b22 !important}' +
    A + ' .vc-wc-sub::before,' + A + ' .vc-wc-sub::after{display:none !important}' +
    /* ตั๋วเติมเครดิต (ปุ่มเด่นปุ่มเดียว) */
    A + ' .vc-wc-top-up{position:relative;z-index:5;margin-top:58px !important;border-radius:4px !important;background:#d1a54a !important;border:0 !important;color:#2e2112 !important;box-shadow:2px 3px 0 #6e4f22 !important;text-shadow:none !important;overflow:visible !important}' +
    A + ' .vc-wc-top-up .alx-coin,' + A + ' .vc-wc-top-up .alx-stc,' + A + ' .vc-wc-top-up > svg{display:none !important}' +
    A + ' .vc-wc-top-up .alx-arr{border-color:#2e2112 !important;color:#2e2112 !important}' +
    A + ' .vc-wc-top-up::before,' + A + ' .vc-wc-top-up::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border-radius:0 !important;opacity:1 !important;transform:none !important;animation:none !important;box-shadow:none !important;background:radial-gradient(circle 2.4px at 50% 50%,#ad6955 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    A + ' .vc-wc-top-up::before{left:-3px !important}' + A + ' .vc-wc-top-up::after{right:-3px !important}' +
    A + ' .vc-wc-top-up:active{transform:translate(1px,2px);box-shadow:1px 1px 0 #6e4f22 !important}' +
    A + ' .vc-wc-top-up:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    A + ' .vc-wc-top-up .pzt2{position:absolute;right:-8px;top:-6px;width:28px;height:11px;transform:rotate(18deg);background:rgba(230,216,188,.75);pointer-events:none}' +
    /* เปิดผนึก */
    A + ' .vc-wcard.pz-open > .pze-flap{animation:pzeF .42s .14s cubic-bezier(.3,1.2,.5,1) both}' +
    A + ' .vc-wcard.pz-open > .pze-se b.l{animation:pzeL .8s ease both}' + A + ' .vc-wcard.pz-open > .pze-se b.r{animation:pzeR .8s ease both}' +
    A + ' .vc-wcard.pz-open > .pze-card,' + A + ' .vc-wcard.pz-open .vc-wc-top,' + A + ' .vc-wcard.pz-open .vc-wc-num,' + A + ' .vc-wcard.pz-open .vc-wc-sub,' + A + ' .vc-wcard.pz-open > .pze-st{animation:pzeC .42s .34s cubic-bezier(.25,1.3,.5,1) both}' +
    '@keyframes pzeF{from{transform:perspective(600px) rotateX(180deg)}to{transform:none}}' +
    '@keyframes pzeC{from{translate:0 34px;opacity:.4}to{translate:0 0;opacity:1}}' +
    '@keyframes pzeL{0%{transform:none}22%,72%{transform:translate(-7px,2px) rotate(-14deg)}100%{transform:none}}' +
    '@keyframes pzeR{0%{transform:none}22%,72%{transform:translate(7px,2px) rotate(14deg)}100%{transform:none}}' +
    '@media (prefers-reduced-motion:reduce){' + A + ' .vc-wcard.pz-open *{animation:none !important}}' +
    /* หัวข้อ */
    A + ' .vc-mg{color:#2e2112 !important;text-shadow:none !important}' +
    A + ' .vc-mg::before{content:"✂" !important;color:#7d3a2c !important;text-shadow:none !important}' +
    A + ' .vc-mg::after{background:radial-gradient(circle 1.6px at 50% 50%,#5e472a 92%,transparent) 0 50%/7px 4px repeat-x !important;opacity:.6;height:4px !important}' +
    /* การ์ดหลากสี */
    A + ' #vdcAcct{' + card('#cdd6c0', '#bfcab1') + '}' +
    A + ' #vrmAcct{' + card('#e2c6b6', '#d6b6a4') + '}' +
    A + ' .vc-stat{' + card('#e4d3a6', '#d8c493') + '}' +
    A + ' #vstMenu.menu-item{' + card('#c6d3d3', '#b6c5c6') + '}' +
    A + ' .menu-item,' + A + ' .acct-out{' + card('#e6d7b9', '#ddcca9') + '}' +
    A + ' #vdcAcct::before,' + A + ' #vdcAcct::after,' + A + ' #vrmAcct::before,' + A + ' #vrmAcct::after,' + A + ' .vc-stat::before,' + A + ' .vc-stat::after,' + A + ' .menu-item::before,' + A + ' .menu-item::after,' + A + ' .acct-out::before,' + A + ' .acct-out::after{display:none !important}' +
    A + ' #vdcAcct' + TXT + A + ' #vrmAcct' + TXT + A + ' .vc-stat' + TXT + A + ' .menu-item' + TXT + A + ' .acct-out' + TXT +
    A + ' #vdcAcct' + SM + A + ' #vrmAcct' + SM + A + ' .vc-stat' + SM + A + ' .menu-item' + SM + A + ' .acct-out' + SM +
    A + ' .acct-out{color:#7d3a2c !important}' +
    A + ' .vda-fire,' + A + ' .vda-tx em{color:#4f3b22 !important}' +
    A + ' .vda-ic,' + A + ' .vra-ic,' + A + ' .vc-stat-ic,' + A + ' .vc-mi,' + A + ' .acct-ico{background:rgba(58,42,22,.14) !important;border:0 !important;box-shadow:none !important;border-radius:4px !important}' +
    A + ' .vra-ic svg,' + A + ' .vc-stat-ic svg,' + A + ' .vc-mi svg,' + A + ' .acct-ico svg{color:#3a2a16 !important;stroke:#3a2a16 !important;opacity:1 !important;visibility:visible !important;filter:none !important}' +
    A + ' .vda-chev,' + A + ' .vra-chev,' + A + ' .vc-mchev,' + A + ' .vc-stat > i,' + A + ' .acct-chev{color:#5e472a !important;background-color:#5e472a !important;border-color:#5e472a !important}' +
    A + ' .vc-stat > i,' + A + ' .acct-chev{background:none !important}' +
    /* แถบ 7 ชิ้น */
    A + ' .vda-dots i{height:6px !important;border-radius:1px !important;background:none !important;border:1.5px dashed rgba(58,42,22,.35) !important;box-shadow:none !important}' +
    A + ' .vda-dots i.is-done{background:#c4735a !important;border:0 !important}' +
    A + ' .vda-dots i:nth-child(odd){rotate:-2deg}' +
    /* แสตมป์ รับแต้ม */
    A + ' .vda-pill{background:#7fa184 !important;background-clip:border-box !important;border:4px dotted #c6cfb8 !important;border-radius:0 !important;color:#f4f1e6 !important;box-shadow:inset 0 0 0 2px rgba(255,255,255,.22) !important;rotate:3deg;text-shadow:none !important}' +
    A + ' .vda-pill *{color:#f4f1e6 !important;-webkit-text-fill-color:#f4f1e6 !important}' +
    A + ' .vda-pill.is-ok{background:#9fb59f !important}' +
    A + ' .vc-acct-foot,' + A + ' .vc-acct-foot *{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    A + ' #vstMenu .vc-mi{background:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 28 28%27%3E%3Cpath d=%27M6 10h16l-1.5 14h-13z%27 fill=%27%233a2a16%27/%3E%3Cpath d=%27M10 10V8a4 4 0 0 1 8 0v2%27 stroke=%27%23c4735a%27 stroke-width=%272.6%27 fill=%27none%27/%3E%3C/svg%3E\") center/22px no-repeat,rgba(58,42,22,.14) !important}' +
    A + ' .acct-out,' + A + ' .acct-out *:not(svg):not(path){color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important;text-shadow:none !important}' +
    A + ' .acct-out svg{color:#7d3a2c !important;stroke:#7d3a2c !important}' +
    A + ' #adminPanel{' + card('#e6d7b9', '#ddcca9') + '}' + A + ' #adminPanel::before,' + A + ' #adminPanel::after{display:none !important}' +
    A + ' #adminPanel .adm-head,' + A + ' #adminPanel .adm-head *{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}' +
    A + ' #adminPanel .adm-ico{background:rgba(58,42,22,.14) !important;border:0 !important;box-shadow:none !important}' + A + ' #adminPanel .adm-ico svg{color:#3a2a16 !important;stroke:#3a2a16 !important;opacity:1 !important;visibility:visible !important;display:block !important;filter:none !important}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function build() {
    var c = document.getElementById('authCard'); if (!c) return;
    if (!c.querySelector(':scope > .pza')) { var z = document.createElement('div'); z.className = 'pza'; z.setAttribute('aria-hidden', 'true'); z.innerHTML = '<i class="k2"></i><i class="k1"></i>'; c.insertBefore(z, c.firstChild); }
    var w = c.querySelector('.vc-wcard'); if (w && !w.querySelector(':scope > .pze')) {
      var h = '<i class="pze pze-lin"></i><i class="pze pze-flap">' + LACE + '</i><i class="pze pze-card"></i><i class="pze pze-pk"></i>' +
        '<i class="pze pze-st">ลับเฉพาะ<small>ฉบับหายาก ✂</small></i>' +
        '<i class="pze pze-se"><b class="l"><i class="s1"></i><i class="s2"></i><i class="s3">V</i></b><b class="r"><i class="s1"></i><i class="s2"></i><i class="s3">V</i></b></i>';
      var t = document.createElement('template'); t.innerHTML = h;
      var first = w.firstChild; [].slice.call(t.content.childNodes).forEach(function (n) { n.setAttribute && n.setAttribute('aria-hidden', 'true'); w.insertBefore(n, first); });
    }
    var tu = c.querySelector('.vc-wc-top-up'); if (tu && !tu.querySelector('.pzt2')) { var tp = document.createElement('i'); tp.className = 'pzt2'; tp.setAttribute('aria-hidden', 'true'); tu.appendChild(tp); }
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function opened() {
    if (document.documentElement.getAttribute('data-view') !== 'home') return;
    build();
    var w = document.querySelector('#authCard .vc-wcard'); if (!w) return;
    var k = ''; try { k = localStorage.getItem('vc_pz_env') || ''; } catch (e) {}
    if (k === today()) return;
    try { localStorage.setItem('vc_pz_env', today()); } catch (e) {}
    w.classList.remove('pz-open'); void w.offsetWidth; w.classList.add('pz-open');
    setTimeout(function () { w.classList.remove('pz-open'); }, 1000);
  }
  function go() {
    if (!on()) return;
    if (!document.getElementById('pz-acct')) { var s = document.createElement('style'); s.id = 'pz-acct'; s.textContent = css; document.head.appendChild(s); }
    build();
    var last = document.body.getAttribute('data-sheet');
    new MutationObserver(function () {
      var v = document.body.getAttribute('data-sheet'); if (v === last) return; last = v;
      if (v === 'acct') setTimeout(opened, 60);
    }).observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    var c = document.getElementById('authCard');
    if (c) { var q = 0; new MutationObserver(function () { if (q) return; q = requestAnimationFrame(function () { q = 0; build(); }); }).observe(c, { childList: true, subtree: true }); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZACCT*/

/*PZTOOLS*/ /* ธีมตัดกระดาษ: แผ่นเครื่องมือเป็นกระดาษคราฟต์หม่น (เฉพาะเปิดจากหน้าแรก) — แต่ละเครื่องมือเป็นแฟ้มกระดาษมีหู วนสี 4 สี
   ไอคอนตัดกระดาษสีเข้ม · ป้าย "ฟรี" แสตมป์เขียวเสจ · แท็บหูกระดาษ · โน้ตครีมติดเทป · ตั๋วมัสตาร์ดเป็นปุ่มเด่นปุ่มเดียวในการ์ด */
(function () {
  'use strict';
  if (window.__pzTools) return; window.__pzTools = 1;
  var T = 'html[data-htheme="paper"][data-view="home"] body .vct.vct:not(.vcm)';
  function zigTop(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '0' : d + 'px')); return 'polygon(' + a.join(',') + ',100% 100%,0 100%)'; }
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .22 0 0 0 0 .1 0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E\")";
  var CUT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M11.2 15.6L24 3.4M12.4 12.4L25 21' stroke='%233a2a16' stroke-width='2.8' stroke-linecap='round'/%3E%3Ccircle cx='7.6' cy='19.6' r='4.4' fill='none' stroke='%23c4735a' stroke-width='2.8'/%3E%3Ccircle cx='7.6' cy='8.4' r='4.4' fill='none' stroke='%233a2a16' stroke-width='2.8'/%3E%3C/svg%3E\")";
  /* สี: [พื้นบน, พื้นล่าง, กรอบไอคอน, สีรอยปรุของตั๋ว] */
  var COL = [['#cdd6c0', '#bfcab1', '#a9b897'], ['#e2c6b6', '#d6b6a4', '#c99d86'], ['#e4d3a6', '#d8c493', '#c8ad6c'], ['#c6d3d3', '#b6c5c6', '#93aaac']];
  var TABX = ['0', '30%', '58%', '14%'];
  var css =
    T + ' .vct-card{background:none !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;isolation:isolate;color:#2e2112 !important}' +
    T + ' .vct-card::before,' + T + ' .vct-card::after{content:"" !important;display:block !important;position:absolute !important;left:0 !important;right:0 !important;bottom:0 !important;pointer-events:none;z-index:-1 !important;border-radius:0 !important;opacity:1 !important}' +
    T + ' .vct-card::before{top:0 !important;background:#a9843a !important;clip-path:' + zigTop(40, 11) + ';filter:drop-shadow(0 -4px 4px rgba(0,0,0,.35))}' +
    T + ' .vct-card::after{top:9px !important;background:' + FIB + ',' + NOISE + ',linear-gradient(180deg,#ad8f64,#9d8057) !important;clip-path:' + zigTop(50, 7) + '}' +
    /* หัวแผ่น */
    T + ' .vct-hd{background:none !important;box-shadow:none !important;border:0 !important;padding-top:24px !important}' +
    T + ' .vct-hd::before{display:none !important}' +
    T + ' .vct-hd::after{content:"" !important;display:block !important;left:18px !important;right:18px !important;bottom:0 !important;width:auto !important;height:6px !important;opacity:.7 !important;transform:none !important;background:radial-gradient(circle 2.2px at 50% 50%,#5e472a 92%,transparent) 0 0/9px 6px repeat-x !important}' +
    T + ' .vct-hd .ic{border-radius:6px !important;background:' + FIB + ',linear-gradient(180deg,#e6d7b9,#ddcca9) !important;border:0 !important;box-shadow:2px 3px 0 #7d6233 !important}' +
    T + ' .vct-hd .ic svg{background:' + CUT + ' center/100% 100% no-repeat !important;-webkit-mask:none !important;mask:none !important;filter:none !important;width:26px !important;height:26px !important}' +
    T + ' .vct-hd .ic svg > *{display:none !important}' +
    T + ' .vct-hd b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}' +
    T + ' .vct-hd small{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    T + ' .vct-x{position:relative;border-radius:50% !important;background:#e3d3b4 !important;border:0 !important;color:#3a2a16 !important;box-shadow:2px 3px 0 #7d6233,0 6px 8px -4px rgba(0,0,0,.4) !important;font-weight:700 !important}' +
    T + ' .vct-x::after{content:"" !important;display:block !important;position:absolute;inset:3px;border-radius:50%;border:1.5px dashed rgba(58,42,22,.24);background:none !important;pointer-events:none}' +
    /* หัวข้อหมวด */
    T + ' .vct-gh{color:#2e2112 !important;text-shadow:none !important}' +
    T + ' .vct-gh::before{content:"✂" !important;color:#7d3a2c !important;text-shadow:none !important}' +
    T + ' .vct-gh::after{background:radial-gradient(circle 1.6px at 50% 50%,#5e472a 92%,transparent) 0 50%/7px 4px repeat-x !important;opacity:.6;height:4px !important}' +
    /* แฟ้มเครื่องมือ */
    T + ' section.vct-it{position:relative;margin-top:30px !important;overflow:visible !important;border:0 !important;border-radius:0 6px 6px 6px !important;box-shadow:2px 4px 0 #7d6233,0 10px 16px -8px rgba(0,0,0,.5) !important;color:#2e2112 !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;--pzk:#bfcab1}' +
    T + ' section.vct-it::before{display:none !important}' +
    T + ' section.vct-it::after{content:"";position:absolute;top:-19px;left:var(--pzx,0);width:128px;height:20px;background:var(--pzt);clip-path:polygon(0 100%,0 30%,8% 0,92% 0,100% 30%,100% 100%);pointer-events:none}' +
    COL.map(function (c, i) {
      var sel = T + ' section.vct-it:nth-of-type(4n+' + (i + 1) + ')';
      return sel + '{background:' + FIB + ',linear-gradient(180deg,' + c[0] + ',' + c[1] + ') !important;--pzt:' + c[0] + ';--pzx:' + TABX[i] + ';--pzk:' + c[1] + '}' + sel + ' .vct-ih .ic{background:' + c[2] + ' !important}';
    }).join('') +
    T + ' .vct-ih .ic{border:0 !important;border-radius:5px !important;box-shadow:none !important}' +
    T + ' .vct-ih .ic svg{background:#3a2a16 !important;filter:drop-shadow(1px 1.5px 0 rgba(255,255,255,.25)) !important}' +
    T + ' section.vct-it[data-tool="library"] .vct-ih .ic svg{background:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 28 28%27%3E%3Crect x=%273%27 y=%274%27 width=%2710%27 height=%2720%27 rx=%271.5%27 fill=%27%233a2a16%27/%3E%3Crect x=%2715%27 y=%274%27 width=%2710%27 height=%2720%27 rx=%271.5%27 fill=%27%23c4735a%27/%3E%3Crect x=%275.5%27 y=%278%27 width=%275%27 height=%272%27 rx=%271%27 fill=%27%23eadcc0%27/%3E%3Crect x=%2717.5%27 y=%278%27 width=%275%27 height=%272%27 rx=%271%27 fill=%27%23eadcc0%27/%3E%3C/svg%3E\") center/100% 100% no-repeat !important;-webkit-mask:none !important;mask:none !important}' + T + ' section.vct-it[data-tool="library"] .vct-ih .ic svg > *{display:none !important}' +
    T + ' .vct-ih b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important}' +
    T + ' .vct-ih em{display:inline-block !important;margin-top:4px;padding:1px 8px !important;background:#7fa184 !important;background-clip:border-box !important;border:3px dotted var(--pzk) !important;border-radius:0 !important;color:#f4f1e6 !important;-webkit-text-fill-color:#f4f1e6 !important;font-style:normal !important;font-weight:700 !important;rotate:-2deg;text-shadow:none !important}' +
    T + ' section.vct-it p,' + T + ' section.vct-it li span,' + T + ' .vct-pts span{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important;text-shadow:none !important}' +
    T + ' section.vct-it li span b,' + T + ' .vct-ben b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important}' +
    T + ' .vct-hl{background:linear-gradient(transparent 62%,rgba(209,165,74,.55) 62%) !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;font-weight:700}' +
    /* แท็บหูกระดาษ */
    T + ' .vct-tb{border-bottom:2px solid rgba(58,42,22,.25) !important;gap:6px !important;box-shadow:none !important;background:none !important}' +
    T + ' .vct-tb button{border-radius:5px 5px 0 0 !important;background:rgba(58,42,22,.08) !important;color:#5a4528 !important;-webkit-text-fill-color:#5a4528 !important;border:0 !important;box-shadow:none !important;text-shadow:none !important}' +
    T + ' .vct-tb button.is-on{background:#e6d7b9 !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;translate:0 2px}' +
    T + ' .vct-tb button::after{display:none !important}' +
    /* โน้ต "ช่วยคุณอย่างไร" */
    T + ' .vct-ben{position:relative;background:#ede0c6 !important;border:0 !important;border-radius:3px !important;box-shadow:1px 2px 0 rgba(0,0,0,.15) !important;rotate:-.6deg;color:#2e2112 !important}' +
    T + ' .vct-ben::before{content:"" !important;display:block !important;position:absolute !important;top:-6px !important;left:22px !important;right:auto !important;bottom:auto !important;width:40px !important;height:12px !important;background:rgba(230,216,188,.85) !important;transform:rotate(-4deg) !important;border-radius:0 !important;box-shadow:none !important}' +
    T + ' .vct-ben > b:first-child{color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important}' +
    T + ' .vct-ben *{color:#2e2112;-webkit-text-fill-color:#2e2112}' +
    /* รายการประโยชน์ / ขั้นตอน / จุดเด่น */
    T + ' .vct-bi + .vct-bi,' + T + ' .vct-pts span + span{background:radial-gradient(circle 1.8px at 50% 50%,#7d6233 92%,transparent) 0 0/8px 4px repeat-x !important}' +
    T + ' .vct-bi:first-child,' + T + ' .vct-pts span:first-child{background:none !important}' +
    T + ' .vct-bi > i{border-radius:50% !important;background:#e6d7b9 !important;border:0 !important;box-shadow:1px 2px 0 #7d6233 !important}' +
    T + ' .vct-bi > i::after{background:#3a2a16 !important}' +
    T + ' .vct-pts span::before{color:#7d3a2c !important;text-shadow:none !important}' +
    T + ' .vct-hw li{color:#3a2a16 !important}' + T + ' .vct-hw li b{color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important}' +
    T + ' .vct-hw li::before{background:#e6d7b9 !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;border:0 !important;box-shadow:1px 2px 0 #7d6233 !important;text-shadow:none !important}' +
    T + ' .vct-hw li::after{background:rgba(58,42,22,.25) !important}' +
    T + ' .vct-mo{background:none !important;border:1.5px dashed rgba(58,42,22,.35) !important;border-radius:4px !important;color:#3a2a16 !important;box-shadow:none !important}' +
    T + ' .vct-mo *{color:#3a2a16 !important;-webkit-text-fill-color:#3a2a16 !important}' + T + ' .vct-mo::after{border-color:#3a2a16 !important}' +
    /* ปุ่ม: ตั๋วมัสตาร์ด (เด่น) + กระดาษครีมขอบประ */
    T + ' .vct-ac button{border-radius:4px !important;background:#e6d7b9 !important;border:1.5px dashed rgba(58,42,22,.4) !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;box-shadow:none !important;text-shadow:none !important}' +
    T + ' .vct-ac button.p{position:relative;overflow:visible !important;background:#d1a54a !important;border:0 !important;box-shadow:2px 3px 0 #6e4f22 !important;font-weight:800 !important}' +
    T + ' .vct-ac button.p::before,' + T + ' .vct-ac button.p::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border-radius:0 !important;opacity:1 !important;transform:none !important;animation:none !important;box-shadow:none !important;background:radial-gradient(circle 2.4px at 50% 50%,var(--pzk) 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    T + ' .vct-ac button.p::before{left:-3px !important}' + T + ' .vct-ac button.p::after{right:-3px !important}' +
    T + ' .vct-ac button:active{transform:translate(1px,2px)}' +
    T + ' .vct-ac button:focus-visible,' + T + ' .vct-tb button:focus-visible,' + T + ' .vct-mo:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function go() { if (!on() || document.getElementById('pz-tools')) return; var s = document.createElement('style'); s.id = 'pz-tools'; s.textContent = css; document.head.appendChild(s); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZTOOLS*/

/*PZHIST*/ /* ธีมตัดกระดาษ: แผ่นประวัติ (อยู่ใน #authCard โหมด data-sheet=hist) — ตู้ลิ้นชักไม้เปลี่ยนเป็น "ราวเชือกไม้หนีบ"
   ธงราวกระดาษ 4 สี · แผ่นสัญญา 3 แผ่นหนีบด้วยไม้หนีบ (แกว่งเบาๆ ครั้งเดียวตอนเปิด) · แท็ก "ลับเฉพาะ" · การ์ดภาพรวมครีมมีหูแฟ้ม
   ช่องตัวเลข 4 สี ตัวเลขตัดกระดาษ · แถบกระดาษ 3 ชิ้น · ปุ่ม "ประเด็นควรทบทวน" เป็นตั๋วมัสตาร์ด · รายการเป็นการ์ดครีมมีแถบสีทางซ้าย */
(function () {
  'use strict';
  if (window.__pzHist) return; window.__pzHist = 1;
  var A = 'html[data-htheme="paper"][data-view="home"] body #authCard#authCard';
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var CUT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M11.2 15.6L24 3.4M12.4 12.4L25 21' stroke='%233a2a16' stroke-width='2.8' stroke-linecap='round'/%3E%3Ccircle cx='7.6' cy='19.6' r='4.4' fill='none' stroke='%23c4735a' stroke-width='2.8'/%3E%3Ccircle cx='7.6' cy='8.4' r='4.4' fill='none' stroke='%233a2a16' stroke-width='2.8'/%3E%3C/svg%3E\")";
  function paper(a, b) { return 'background:' + FIB + ',linear-gradient(180deg,' + a + ',' + b + ') !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233,0 8px 12px -8px rgba(0,0,0,.45) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'; }
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;';
  var BUNT = '<svg class="bt" viewBox="0 0 358 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q179 30 358 6" fill="none" stroke="#5e472a" stroke-width="1.6"/><g stroke="#5e472a" stroke-width=".6">' +
    [[14, 8.5, 40, 11.6, 26, 34, '#c4735a'], [48, 12.4, 74, 15, 60, 37, '#d1a54a'], [82, 15.6, 108, 17.8, 94, 40, '#7fa184'], [116, 18.4, 142, 19.8, 128, 42, '#93aaac'], [150, 20, 176, 20.6, 162, 43, '#c4735a'],
     [182, 20.6, 208, 20, 196, 43, '#d1a54a'], [216, 19.8, 242, 18.4, 230, 42, '#7fa184'], [250, 17.8, 276, 15.6, 264, 40, '#93aaac'], [284, 15, 310, 12.4, 298, 37, '#c4735a'], [318, 11.6, 344, 8.5, 332, 34, '#d1a54a']]
      .map(function (t) { return '<path d="M' + t[0] + ' ' + t[1] + 'L' + t[2] + ' ' + t[3] + 'L' + t[4] + ' ' + t[5] + 'Z" fill="' + t[6] + '"/>'; }).join('') + '</g></svg>' +
    '<svg class="rp" viewBox="0 0 358 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8 Q179 48 358 8" fill="none" stroke="#5e472a" stroke-width="2" stroke-dasharray="5 1.5"/></svg>';
  function pp(cls, col, name, w) { return '<span class="pp ' + cls + '"><i class="pg"></i><b style="background:' + col + '">' + name + '</b><s></s><s style="width:' + w[0] + '%"></s><s></s><s style="width:' + w[1] + '%"></s></span>'; }
  var CL = BUNT + pp('p1', '#d6b6a4', 'เช่า', [100, 60]) + pp('p2', '#bfcab1', 'จ้างงาน', [70, 50]) + pp('p3', '#b6c5c6', 'ซื้อขาย', [100, 65]) + '<span class="tg"><i></i>ลับเฉพาะ ✂</span>';
  var V = A + ' .vault-head';
  var css =
    /* หัวแผ่น */
    A + ' .sheet-head h2{' + DK + '}' +
    A + ' .sheet-head h2::before{-webkit-mask:none !important;mask:none !important;background:' + CUT + ' center/22px no-repeat,linear-gradient(180deg,#e6d7b9,#ddcca9) !important;width:36px !important;height:36px !important;border-radius:6px !important;box-shadow:2px 3px 0 #7d6233 !important;vertical-align:middle}' +
    A + ' .sheet-head h2::after{display:none !important}' +
    /* ราวเชือกไม้หนีบ (แทนตู้ลิ้นชัก) */
    V + '{position:relative;height:290px !important;min-height:0 !important;padding:0 !important;overflow:hidden !important;' + paper('#e2d2b2', '#d6c49f') + 'border-radius:5px !important}' +
    V + '::before,' + V + '::after{display:none !important}' +
    V + ' .alx-cab-top,' + V + ' .alx-grv,' + V + ' .alx-files,' + V + ' .alx-pull{display:none !important}' +
    V + ' .alx-cab-main{position:absolute !important;inset:0 !important;width:auto !important;transform:none !important;background:none !important;border:0 !important;box-shadow:none !important;padding:0 !important;height:auto !important}' +
    V + ' .alx-cab-main::before,' + V + ' .alx-cab-main::after{display:none !important}' +
    '.pzcl{display:none}' + V + ' > .pzcl{display:block;position:absolute;inset:0;pointer-events:none}' +
    '.pzcl .bt{position:absolute;left:0;top:0;width:100%;height:46px}' +
    '.pzcl .rp{position:absolute;left:0;top:60px;width:100%;height:60px}' +
    '.pzcl .pp{position:absolute;top:0;width:27%;height:118px;background:#f1e6cf;border-radius:2px;box-shadow:2px 4px 6px -2px rgba(0,0,0,.35);padding:22px 9px 8px;transform-origin:50% 0}' +
    '.pzcl .pp b{display:block;margin:0 -9px 8px;padding:3px 0;text-align:center;font:700 12px/1.3 Prompt,sans-serif;color:#2e2112}' +
    '.pzcl .pp s{display:block;height:4px;border-radius:2px;background:#d7c8a8;margin:6px 0}' +
    '.pzcl .pg{position:absolute;left:50%;top:-12px;margin-left:-5px;width:10px;height:26px;border-radius:2px;background:linear-gradient(90deg,#c9a46a,#b48c54);box-shadow:1px 1px 0 rgba(0,0,0,.25)}' +
    '.pzcl .pg::after{content:"";position:absolute;left:3px;top:9px;width:4px;height:4px;border-radius:50%;background:#7d6233}' +
    '.pzcl .p1{left:6%;top:76px;rotate:-6deg}.pzcl .p2{left:33%;top:90px;rotate:2deg}.pzcl .p3{left:59%;top:82px;rotate:6deg}' +
    '.pzcl .tg{position:absolute;right:-24px;top:66px;padding:4px 8px 4px 14px;background:#e9dbbf;border:1.5px solid rgba(60,92,76,.8);color:#3c5c4c;font:800 11px/1.2 Prompt,sans-serif;border-radius:2px 8px 8px 2px;rotate:74deg;transform-origin:0 50%;white-space:nowrap}' +
    '.pzcl .tg i{position:absolute;left:4px;top:50%;margin-top:-3px;width:6px;height:6px;border-radius:50%;background:#9d8057}' +
    V + '.pz-sw .pzcl .pp{animation:pzsw 1.1s ease-out both}' + V + '.pz-sw .pzcl .p2{animation-delay:.08s}' + V + '.pz-sw .pzcl .p3{animation-delay:.16s}' +
    '@keyframes pzsw{0%{transform:rotate(9deg)}30%{transform:rotate(-6deg)}55%{transform:rotate(3.5deg)}78%{transform:rotate(-1.5deg)}100%{transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.pzcl .pp{animation:none !important}}' +
    V + ' .vault-txt{position:absolute !important;left:0 !important;right:0 !important;bottom:14px !important;top:auto !important;width:auto !important;margin:0 !important;background:none !important;border:0 !important;box-shadow:none !important;text-align:center;transform:none !important}' +
    V + ' .vault-txt::before,' + V + ' .vault-txt::after{display:none !important}' +
    V + ' .vault-txt b{' + DK + 'font-size:19px !important}' + V + ' .vault-txt b::after{color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important;font-size:16px}' +
    V + ' .vault-txt small{' + MD + '}' + V + ' .vault-txt small::before{' + MD + '}' +
    /* การ์ดภาพรวม */
    A + ' section.vcc{position:relative;margin-top:30px !important;overflow:visible !important;' + paper('#e9dbbf', '#e0cfae') + 'border-radius:0 6px 6px 6px !important;color:#2e2112 !important}' +
    A + ' section.vcc::before{display:none !important}' +
    A + ' section.vcc::after{content:"";position:absolute;left:0;top:-19px;width:128px;height:20px;background:#e9dbbf;clip-path:polygon(0 100%,0 30%,8% 0,92% 0,100% 30%,100% 100%)}' +
    A + ' .vcc-h b,' + A + ' .vcc-tx b,' + A + ' .vcc-sec p{' + DK + '}' + A + ' .vcc-h small,' + A + ' .vcc-tx small,' + A + ' .vcc-leg span,' + A + ' .vcc-sec p em{' + MD + '}' +
    A + ' .vcc-sec p::before{content:"✂" !important;color:#7d3a2c !important}' +
    A + ' .vcc-h .ic{background:#d4c19c !important;border:0 !important;box-shadow:none !important;border-radius:5px !important}' + A + ' .vcc-h .ic svg{background:#3a2a16 !important}' +
    A + ' .vcc-rf{position:relative;border-radius:50% !important;background:#e3d3b4 !important;border:0 !important;box-shadow:2px 3px 0 #7d6233 !important;color:#3a2a16 !important}' + A + ' .vcc-rf svg{color:#3a2a16 !important;stroke:#3a2a16 !important}' +
    A + ' .vcc-rf::after{content:"" !important;display:block !important;position:absolute;inset:3px;border-radius:50%;border:1.5px dashed rgba(58,42,22,.24);background:none !important;pointer-events:none}' +
    A + ' .vcc-st{border:0 !important;border-radius:4px !important;box-shadow:1px 2px 0 #7d6233 !important}' +
    A + ' .vcc-st:nth-child(1){background:#bfcab1 !important;rotate:-1.2deg}' + A + ' .vcc-st:nth-child(2){background:#d6b6a4 !important;rotate:1deg}' + A + ' .vcc-st:nth-child(3){background:#d8c493 !important;rotate:-.8deg}' + A + ' .vcc-st:nth-child(4){background:#b6c5c6 !important;rotate:1.2deg}' +
    A + ' .vcc-st b{color:#efe3cb !important;-webkit-text-fill-color:#efe3cb !important;-webkit-text-stroke:1px #5a3a18;text-shadow:2px 2px 0 #7a4434 !important;background:none !important;font-weight:900 !important}' +
    A + ' .vcc-st small{' + DK + 'font-weight:600 !important}' +
    A + ' .vcc-dist{background:none !important;gap:3px;display:flex !important;height:12px !important;border-radius:0 !important;box-shadow:none !important;overflow:visible !important}' +
    A + ' .vcc-dist i{clip-path:polygon(0 0,100% 0,97% 100%,0 100%);border-radius:0 !important}' +
    A + ' .vcc-row{' + paper('#efe3ca', '#e6d7b9') + 'color:#2e2112 !important}' +
    A + ' .vcc-row .vcc-ar{color:#5e472a !important}' + A + ' .vcc-mr b{' + DK + '}' +
    A + ' .vcc-pg{background:#f1e6cf !important;border:0 !important;box-shadow:1px 2px 0 #7d6233 !important}' + A + ' .vcc-pg i{background:#c4735a !important;color:#fff4e6 !important}' + A + ' .vcc-pg b{' + DK + '}' +
    A + ' .vcc-cd{background:#d6b6a4 !important;color:#2e2112 !important;border:0 !important;border-radius:3px !important}' +
    /* แบนเนอร์เทียบ 2 ฉบับ + แดชบอร์ด */
    A + ' .vct-cc{' + paper('#c6d3d3', '#b6c5c6') + 'color:#2e2112 !important}' + A + ' .vct-cc b,' + A + ' .vct-cc em{' + DK + 'font-style:normal}' + A + ' .vct-cc small{' + MD + '}' +
    A + ' .vct-cc .i{background:#93aaac !important;border:0 !important;box-shadow:none !important}' + A + ' .vct-cc .i svg{background:#3a2a16 !important}' +
    A + ' .ld-head small,' + A + ' .ld-head b{' + DK + '}' +
    A + ' .ld-period{background:#e3d3b4 !important;border:0 !important;box-shadow:2px 3px 0 #7d6233 !important;' + DK + '}' + A + ' .ld-period *{' + DK + '}' + A + ' .ld-period svg{background:#3a2a16 !important}' +
    A + ' .ld-strip{' + paper('#e6d7b9', '#ddcca9') + '}' + A + ' .ld-strip::before,' + A + ' .ld-strip::after{display:none !important}' +
    A + ' .ls-cell b,' + A + ' .ls-cell small{' + DK + '}' + A + ' .ls-cell svg{background:#5e472a !important}' + A + ' .ls-cell::before{background:rgba(58,42,22,.25) !important}' +
    /* แท็บ / เครื่องมือค้นหา */
    A + ' .hist-tabs{border-bottom:2px solid rgba(58,42,22,.25) !important;gap:6px}' +
    A + ' .hist-tab{border-radius:5px 5px 0 0 !important;background:rgba(58,42,22,.1) !important;border:0 !important;box-shadow:none !important;color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    A + ' .hist-tab.is-on{background:#e6d7b9 !important;' + DK + 'translate:0 2px}' + A + ' .hist-tab::before,' + A + ' .hist-tab::after{display:none !important}' +
    A + ' .hist-tools{background:#a1845a !important;box-shadow:0 6px 10px -8px rgba(0,0,0,.5) !important}' + A + ' .hist-tools::after{display:none !important}' +
    A + ' #histSearch{background:#efe3ca !important;border:1.5px dashed rgba(58,42,22,.4) !important;color:#2e2112 !important;box-shadow:none !important}' + A + ' #histSearch::placeholder{color:#7a6448 !important}' +
    A + ' .lib-seg-b,' + A + ' .lib-chip{background:#e3d3b4 !important;border:0 !important;box-shadow:1px 2px 0 #7d6233 !important;' + DK + '}' + A + ' .lib-seg-b *,' + A + ' .lib-chip *{' + DK + '}' +
    A + ' .lib-seg-b.is-on{background:#c99f48 !important}' + A + ' .lib-seg-b svg{background:#3a2a16 !important}' +
    /* ตั๋ว "ประเด็นควรทบทวน" (ปุ่มเด่นปุ่มเดียว) */
    A + ' #libReview{position:relative;overflow:visible !important;border-radius:4px !important;background:#d1a54a !important;border:0 !important;box-shadow:2px 3px 0 #6e4f22 !important;' + DK + 'font-weight:800 !important}' +
    A + ' #libReview *{' + DK + '}' + A + ' #libReview svg{color:#2e2112 !important;stroke:#2e2112 !important;background:none !important}' +
    A + ' #libReview::before,' + A + ' #libReview::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border:0 !important;border-radius:0 !important;opacity:1 !important;transform:none !important;animation:none !important;box-shadow:none !important;background:radial-gradient(circle 2.4px at 50% 50%,#9d8057 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    A + ' #libReview::before{left:-3px !important}' + A + ' #libReview::after{right:-3px !important}' +
    A + ' #libReview[aria-pressed="true"]{background:#c99f48 !important;box-shadow:inset 0 2px 4px rgba(0,0,0,.25) !important}' +
    /* รายการรายงาน */
    A + ' .hr-day-h span,' + A + ' .hr-day-h{' + DK + '}' + A + ' .hr-day-h span::before{content:"✂ " !important;color:#7d3a2c !important}' +
    A + ' .hr-day-n{background:#c99f48 !important;color:#2e2112 !important;border:0 !important}' + A + ' .hr-day-line{background:radial-gradient(circle 1.6px at 50% 50%,#5e472a 92%,transparent) 0 50%/7px 4px repeat-x !important;height:4px !important;opacity:.6}' +
    A + ' .hr-day-chev{color:#5e472a !important}' +
    A + ' .hist-card{position:relative;overflow:visible !important;' + paper('#efe3ca', '#e6d7b9') + 'color:#2e2112 !important}' +
    A + ' .hist-card::before{content:"" !important;display:block !important;position:absolute !important;left:-6px !important;top:12px !important;bottom:auto !important;width:12px !important;height:30px !important;border-radius:3px 0 0 3px !important;background:#bfcab1 !important;box-shadow:none !important;opacity:1 !important}' +
    A + ' .hist-card:has(.hr-review)::before{background:#d8c493 !important}' + A + ' .hist-card.is-pinned::before{background:#d6b6a4 !important}' +
    A + ' .hist-card::after{display:none !important}' +
    A + ' .hist-card b{' + DK + '}' + A + ' .hist-card small,' + A + ' .hist-card .hr-time,' + A + ' .hist-card .hr-state{' + MD + '}' +
    A + ' .hist-card .hr-chip{background:rgba(58,42,22,.1) !important;border:0 !important;' + DK + '}' +
    A + ' .hist-card .hr-review{background:#d8c493 !important;color:#2e2112 !important;border:0 !important;border-radius:3px !important}' +
    A + ' .hist-card .hr-menu{color:#5e472a !important;background:none !important}' +
    A + ' .hist-card svg{color:#5e472a}' +
    A + ' .hist-know,' + A + ' .hist-know *{' + MD + '}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function build() {
    var v = document.querySelector('#authCard .vault-head'); if (!v || v.querySelector(':scope > .pzcl')) return;
    var d = document.createElement('div'); d.className = 'pzcl'; d.setAttribute('aria-hidden', 'true'); d.innerHTML = CL; v.insertBefore(d, v.firstChild);
  }
  function swing() {
    if (document.documentElement.getAttribute('data-view') !== 'home') return;
    build(); var v = document.querySelector('#authCard .vault-head'); if (!v) return;
    v.classList.remove('pz-sw'); void v.offsetWidth; v.classList.add('pz-sw'); setTimeout(function () { v.classList.remove('pz-sw'); }, 1500);
  }
  function go() {
    if (!on()) return;
    if (!document.getElementById('pz-hist')) { var s = document.createElement('style'); s.id = 'pz-hist'; s.textContent = css; document.head.appendChild(s); }
    build();
    var last = document.body.getAttribute('data-sheet');
    new MutationObserver(function () { var v = document.body.getAttribute('data-sheet'); if (v === last) return; last = v; if (v === 'hist') setTimeout(swing, 80); })
      .observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    var c = document.getElementById('authCard');
    if (c) { var q = 0; new MutationObserver(function () { if (q) return; q = requestAnimationFrame(function () { q = 0; build(); }); }).observe(c, { childList: true, subtree: true }); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZHIST*/

/*PZFX*/ /* ธีมตัดกระดาษ: (ก) "ข้อมูลบัญชี" ที่กางออก = ซองคราฟต์ + บัตรสมาชิก + การ์ดเครดิต 3 สี + แสตมป์ "+ เติม"
   (ข) อนิเมชันหน้าบัญชี: นกกระเรียนกระดาษตอนล็อกอิน · ป๊อปอัปตอนเปิดแผ่น · เศษกระดาษร่วงแทนฝน · เลขเครดิตพลิก · แสตมป์ปั๊มตอนรับแต้ม
   โหมดสงบ (html[data-calm]) / ลดภาพเคลื่อนไหว → ไม่มีเศษกระดาษร่วง และข้ามฉาก · ใช้ transform/opacity ล้วน */
(function () {
  'use strict';
  if (window.__pzFx) return; window.__pzFx = 1;
  var H0 = 'html[data-htheme="paper"][data-view="home"]';
  var A = H0 + ' body #authCard#authCard';
  var CALM = 'html[data-calm]';
  function calm() { var h = document.documentElement; return h.hasAttribute('data-calm') || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var INK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7'/%3E%3C/filter%3E%3Crect width='120' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;';
  var NUM = 'background:none !important;color:#efe3cb !important;-webkit-text-fill-color:#efe3cb !important;-webkit-text-stroke:1.2px #5a3a18;text-shadow:2px 2px 0 #d1a54a,4px 4px 0 #c4735a !important;font-weight:900 !important;filter:none !important;';
  var css =
    /* ---------- (ก) ข้อมูลบัญชีที่กางออก ---------- */
    A + ' #acctDetail{position:relative;margin:0 6px !important;padding:14px 12px 14px !important;background:linear-gradient(180deg,#8a6c42,#7d6036) !important;border:0 !important;border-radius:0 0 6px 6px !important;box-shadow:inset 0 8px 10px -6px rgba(0,0,0,.4),2px 3px 0 #4a3720 !important}' +
    A + ' #acctDetail::before{content:"" !important;display:block !important;position:absolute;inset:6px;border:1.5px dashed rgba(240,225,195,.35);border-radius:4px;pointer-events:none;background:none !important}' +
    A + ' #acctDetail::after{display:none !important}' +
    A + ' .vai-c{border:0 !important;border-radius:4px !important;box-shadow:1px 3px 0 #4a3720 !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;color:#2e2112 !important}' +
    A + ' .vai-c::before,' + A + ' .vai-c::after{display:none !important}' +
    A + ' .vai-c.is-mail{position:relative;background:' + FIB + ',linear-gradient(180deg,#f1e6cf,#e8d9bb) !important}' +
    A + ' .vai-c.is-check{background:' + FIB + ',linear-gradient(180deg,#cdd6c0,#bfcab1) !important;rotate:-.8deg;--pzk:#bfcab1}' +
    A + ' .vai-c.is-voice{background:' + FIB + ',linear-gradient(180deg,#c6d3d3,#b6c5c6) !important;rotate:.8deg;--pzk:#b6c5c6}' +
    A + ' .vai-c.is-hist{background:' + FIB + ',linear-gradient(180deg,#e2c6b6,#d6b6a4) !important}' +
    A + ' .vai-ic{background:rgba(58,42,22,.14) !important;border:0 !important;box-shadow:none !important;border-radius:4px !important}' +
    A + ' .vai-ic::after{display:none !important}' +
    A + ' .vai-ic svg{color:#3a2a16 !important;stroke:#3a2a16 !important;opacity:1 !important;visibility:visible !important;filter:none !important}' +
    A + ' .vai-lab{' + DK + 'font-weight:700 !important}' + A + ' .vai-mail{' + DK + '}' +
    A + ' .vai-num b,' + A + ' .vai-cap b{' + NUM + '}' + A + ' .vai-num small,' + A + ' .vai-cap small{color:#5a3a18 !important;-webkit-text-fill-color:#5a3a18 !important;font-weight:700 !important}' +
    A + ' .vai-note{' + MD + '}' + A + ' .vai-go{color:#5e472a !important}' +
    A + ' .vai-add{background:#d1a54a !important;background-clip:border-box !important;border:3px dotted var(--pzk,#bfcab1) !important;border-radius:0 !important;' + DK + 'font-weight:800 !important;box-shadow:none !important;rotate:2deg;transition:transform .12s}' +
    A + ' .vai-add:active{transform:translateY(2px) scale(.96)}' + A + ' .vai-add:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    A + ' .vai-bar{background:none !important;border:1.5px dashed rgba(58,42,22,.4) !important;border-radius:2px !important;padding:1.5px !important;height:12px !important;box-shadow:none !important}' +
    A + ' .vai-bar i{background:#c4735a !important;border-radius:0 !important;clip-path:polygon(0 0,100% 0,99% 100%,0 100%);box-shadow:none !important}' +
    A + ' .vai-c.is-hist .vai-note.pz-warn,' + A + ' .vai-c.is-hist .vai-note:has(svg){position:relative;display:block;margin-top:10px;padding:7px 10px !important;background:#ede0c6 !important;border-radius:3px;color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important;font-weight:700 !important;rotate:-.6deg}' +
    A + ' .vai-c.is-hist .vai-note:has(svg)::before{content:"";position:absolute;top:-6px;left:18px;width:36px;height:11px;background:rgba(230,216,188,.85);transform:rotate(-4deg)}' +
    A + ' .vai-c.is-hist .vai-note svg{color:#7d3a2c !important;stroke:#7d3a2c !important}' +
    '.pzm{display:none}' + A + ' .vai-c.is-mail > .pzm{display:block;position:absolute;pointer-events:none}' +
    A + ' .vai-c.is-mail > .pzm.h{right:16px;top:14px;width:12px;height:12px;border-radius:50%;background:#7d6036;box-shadow:inset 0 1px 2px rgba(0,0,0,.4)}' +
    A + ' .vai-c.is-mail > .pzm.s{right:20px;top:-20px;width:2px;height:40px;background:#c4735a;transform:rotate(8deg)}' +
    A + ' .vai-c.is-mail > .pzm.r{right:40px;top:14px;transform:rotate(-10deg);padding:2px 7px;border:2px solid rgba(60,92,76,.85);border-radius:3px;color:rgba(60,92,76,.92);font:800 10.5px/1.2 Prompt,sans-serif;-webkit-mask:' + INK + ';mask:' + INK + '}' +
    /* ---------- (ข2) ป๊อปอัปตอนเปิดแผ่นบัญชี ---------- */
    A + '.pz-pop > .pza{animation:pzpA .45s cubic-bezier(.2,1.2,.4,1) both}' +
    A + '.pz-pop .vc-wcard,' + A + '.pz-pop .vc-mg,' + A + '.pz-pop #vdcAcct,' + A + '.pz-pop #vstMenu,' + A + '.pz-pop .vc-stat,' + A + '.pz-pop #vrmAcct{transform-origin:50% 100%;animation:pzpC .5s cubic-bezier(.25,1.5,.5,1) both}' +
    A + '.pz-pop .vc-wcard{animation-delay:.08s}' + A + '.pz-pop .vc-mg{animation-delay:.16s}' + A + '.pz-pop #vdcAcct{animation-delay:.2s}' + A + '.pz-pop #vstMenu{animation-delay:.26s}' + A + '.pz-pop .vc-stat{animation-delay:.32s}' + A + '.pz-pop #vrmAcct{animation-delay:.36s}' +
    '@keyframes pzpA{from{translate:0 -24px;opacity:.3}to{translate:0 0;opacity:1}}' +
    '@keyframes pzpC{0%{scale:1 .2;opacity:0}60%{scale:1 1.05;opacity:1}100%{scale:1 1;opacity:1}}' +
    /* ---------- (ข3) เศษกระดาษร่วง (แทนฝน) ---------- */
    '.pzf{display:none}' +
    H0 + ' body[data-sheet="acct"] #authCard#authCard > .pzf{display:block;position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;border-radius:inherit}' +
    CALM + ' body #authCard > .pzf{display:none !important}' +
    '.pzf i{position:absolute;top:-24px;left:var(--x);width:var(--w);height:var(--w);background:var(--c);opacity:.5;will-change:transform;animation:pzfall var(--d) linear var(--dl) infinite}' +
    '.pzf i.st{clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}.pzf i.dm{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}.pzf i.dt{border-radius:50%}' +
    '@keyframes pzfall{0%{transform:translate3d(0,0,0) rotate(0deg)}50%{transform:translate3d(18px,55vh,0) rotate(180deg)}100%{transform:translate3d(-6px,110vh,0) rotate(360deg)}}' +
    '@media (prefers-reduced-motion:reduce){.pzf{display:none !important}}' +
    /* ---------- (ข5) เลขเครดิตพลิก ---------- */
    A + ' .vc-wc-num b.pz-flip,' + A + ' .vai-num b.pz-flip{display:inline-block;animation:pzflip .55s cubic-bezier(.3,1.3,.5,1) both}' +
    '@keyframes pzflip{0%{transform:perspective(300px) rotateX(-95deg);opacity:.2}55%{transform:perspective(300px) rotateX(14deg);opacity:1}100%{transform:perspective(300px) rotateX(0)}}' +
    /* ---------- (ข6) แสตมป์ปั๊ม ---------- */
    A + ' .vda-pill.pz-stamp{animation:pzst .62s cubic-bezier(.3,1.4,.5,1) both}' +
    A + ' #vdcAcct.pz-shake{animation:pzsh .3s .26s ease both}' +
    '@keyframes pzst{0%{transform:translateY(0) scale(1)}35%{transform:translateY(-16px) scale(1.18) rotate(-6deg)}55%{transform:translateY(2px) scale(.9) rotate(-3deg)}100%{transform:none}}' +
    '@keyframes pzsh{0%,100%{translate:0 0}30%{translate:-2px 1px}60%{translate:2px -1px}}' +
    '.pzcf{position:absolute;width:10px;height:10px;pointer-events:none;z-index:6}' +
    /* ---------- (ข1) นกกระเรียนตอนล็อกอิน ---------- */
    '.pzl{position:fixed;inset:0;z-index:2147483000;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.pzl-dim{position:absolute;left:0;right:0;top:0;bottom:var(--nb,0px);background:rgba(13,36,34,.62);animation:pzlD .35s ease both}' +
    '.pzl.out .pzl-dim{animation:pzlD .3s ease reverse both}' +
    '@keyframes pzlD{from{opacity:0}to{opacity:1}}' +
    '.pzl-sq{position:absolute;left:50%;top:44%;width:120px;height:120px;margin:-60px 0 0 -60px;background:' + FIB + ',linear-gradient(135deg,#f1e6cf,#ddcca9);box-shadow:0 10px 20px rgba(0,0,0,.35);border-radius:2px}' +
    '.pzl-cr{position:absolute;left:0;top:0;width:128px;height:96px;margin:-48px 0 0 -64px;opacity:0;filter:drop-shadow(0 8px 8px rgba(0,0,0,.35))}' +
    '.pzl-cr svg{width:100%;height:100%;overflow:visible}' +
    '.pzl-cr .wl,.pzl-cr .wr{transform-box:fill-box;animation:pzflap .32s ease-in-out infinite alternate}' + '.pzl-cr .wl{transform-origin:100% 100%}.pzl-cr .wr{transform-origin:0 100%;animation-delay:.05s}' +
    '@keyframes pzflap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}' +
    '.pzl-wel{position:absolute;left:0;right:0;top:calc(44% - 150px);text-align:center;color:#f6ead2;font:700 20px/1.3 Prompt,sans-serif;text-shadow:0 2px 6px rgba(0,0,0,.4);opacity:0}' +
    '.pzl-wel small{display:block;font-size:13px;font-weight:500;opacity:.85}' +
    '.pzl-skip{position:absolute;right:14px;top:calc(env(safe-area-inset-top) + 12px);padding:6px 12px;border:0;border-radius:3px;background:#e6d7b9;color:#2e2112;font:700 13px Prompt,sans-serif;box-shadow:2px 3px 0 #7d6233}' +
    '.pz-catch{animation:pzcatch .5s cubic-bezier(.3,1.6,.5,1)}@keyframes pzcatch{0%{transform:none}35%{transform:translateY(-8px) scale(1.15)}100%{transform:none}}';
  var CRANE = '<svg viewBox="0 0 96 72" aria-hidden="true"><path class="wl" d="M48 40 L20 6 L44 30 Z" fill="#e6d6b8"/><path class="wr" d="M48 40 L80 2 L54 32 Z" fill="#d9c7a3"/>' +
    '<path d="M6 44 L48 40 L34 52 Z" fill="#efe3cb"/><path d="M48 40 L90 30 L62 50 Z" fill="#d9c7a3"/><path d="M34 52 L48 40 L62 50 L48 58 Z" fill="#c9b48c"/><path d="M90 30 L94 22 L86 30 Z" fill="#c4735a"/></svg>';
  /* ---------- (ข1) ฉากล็อกอิน ---------- */
  window.VCPaperLogin = function (info, api) {
    var email = (info && info.email) || '', nm = api.name(email) || '';
    var old = document.querySelector('.pzl'); if (old) old.remove();
    var nav = document.getElementById('bottomNav'), nb = 0;
    if (nav && innerWidth < 768) { var nr = nav.getBoundingClientRect(); if (nr.height > 0 && nr.top < innerHeight) nb = innerHeight - nr.top; }
    var R = document.createElement('div'); R.className = 'pzl'; R.style.setProperty('--nb', nb + 'px');
    R.innerHTML = '<i class="pzl-dim"></i><i class="pzl-sq"></i><i class="pzl-cr">' + CRANE + '</i><div class="pzl-wel"><small>ยินดีต้อนรับ</small><b></b></div><button type="button" class="pzl-skip">ข้าม ›</button>';
    R.querySelector('.pzl-wel b').textContent = nm ? 'คุณ ' + nm : 'กลับมาแล้ว';
    document.body.appendChild(R);
    if (window.__vcGinOff) setTimeout(window.__vcGinOff, 60);
    var alive = true, anims = [], guard = 0;
    function end() {
      if (!alive) return; alive = false; clearTimeout(guard);
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      R.classList.add('out'); setTimeout(function () { if (R.parentNode) R.parentNode.removeChild(R); }, 300);
      if (window.__vcGinOff) window.__vcGinOff();
      window.__vcHold = Date.now() + 7000; api.welcome(email);
    }
    R.addEventListener('click', end);
    guard = setTimeout(end, 6500);
    if (calm() || !R.animate) { R.querySelector('.pzl-sq').style.display = 'none'; R.querySelector('.pzl-wel').style.opacity = 1; guard = setTimeout(end, 1000); return; }
    var sq = R.querySelector('.pzl-sq'), cr = R.querySelector('.pzl-cr'), wel = R.querySelector('.pzl-wel');
    var vw = innerWidth, vh = innerHeight, cx = vw / 2, cy = vh * .44;
    /* พับกระดาษ: สี่เหลี่ยมหมุนเป็นข้าวหลามตัด → พับครึ่ง → หดเป็นนก */
    anims.push(sq.animate([{ transform: 'rotate(0) scale(.6)', opacity: 0 }, { transform: 'rotate(45deg) scale(1)', opacity: 1, offset: .3 }, { transform: 'rotate(45deg) scale(1,.5)', offset: .6 }, { transform: 'rotate(45deg) scale(.5,.2)', opacity: 0 }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' }));
    anims.push(wel.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none', offset: .2 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: 1600, fill: 'forwards' }));
    var tg = api.target(), tx = tg ? tg.r.left + tg.r.width / 2 : vw - 60, ty = tg ? tg.r.top + tg.r.height / 2 : vh - 40;
    if (!tg || tg.r.top < vh * .5) { tx = vw - 60; ty = 40; }
    var c1x = cx + (tx - cx) * .2, c1y = cy - vh * .3, c2x = tx + (tx > cx ? 30 : -30), c2y = cy - vh * .05;
    var K = [], n = 10, i;
    for (i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var x = u * u * u * cx + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * tx;
      var y = u * u * u * cy + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ty;
      var dx = 3 * u * u * (c1x - cx) + 6 * u * t * (c2x - c1x) + 3 * t * t * (tx - c2x), dy = 3 * u * u * (c1y - cy) + 6 * u * t * (c2y - c1y) + 3 * t * t * (ty - c2y);
      var flip = dx < 0 ? -1 : 1, ang = Math.max(-28, Math.min(28, Math.atan2(dy, Math.abs(dx) + 40) * 180 / Math.PI));
      K.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scaleX(' + flip + ') rotate(' + ang.toFixed(1) + 'deg) scale(' + (1 - t * .6).toFixed(3) + ')', opacity: i === 0 ? 0 : 1 });
    }
    K[1].opacity = 1;
    setTimeout(function () {
      if (!alive) return;
      var fly = cr.animate(K, { duration: 1300, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' }); anims.push(fly);
      fly.onfinish = function () {
        if (!alive) return;
        var el = tg && tg.el; if (el) { el.classList.remove('pz-catch'); void el.offsetWidth; el.classList.add('pz-catch'); setTimeout(function () { el.classList.remove('pz-catch'); }, 600); }
        cr.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
        setTimeout(end, 260);
      };
    }, 560);
  };
  /* ---------- อื่นๆ ---------- */
  var BITS = [['st', '#d1a54a', 12], ['dm', '#c4735a', 9], ['dt', '#93aaac', 7], ['st', '#7fa184', 10], ['dm', '#d1a54a', 8], ['st', '#c4735a', 11], ['dt', '#e6d6b8', 6]];
  function build() {
    var c = document.getElementById('authCard'); if (!c) return;
    if (!c.querySelector(':scope > .pzf')) {
      var f = document.createElement('div'); f.className = 'pzf'; f.setAttribute('aria-hidden', 'true');
      f.innerHTML = BITS.map(function (b, i) { return '<i class="' + b[0] + '" style="--c:' + b[1] + ';--w:' + b[2] + 'px;--x:' + (6 + i * 13.5) + '%;--d:' + (11 + (i % 3) * 3.5) + 's;--dl:-' + (i * 2.3).toFixed(1) + 's"></i>'; }).join('');
      var pza = c.querySelector(':scope > .pza'); c.insertBefore(f, pza ? pza.nextSibling : c.firstChild);
    }
    var m = c.querySelector('.vai-c.is-mail'); if (m && !m.querySelector(':scope > .pzm')) {
      m.insertAdjacentHTML('beforeend', '<i class="pzm s" aria-hidden="true"></i><i class="pzm h" aria-hidden="true"></i><i class="pzm r" aria-hidden="true">ลับเฉพาะ</i>');
    }
  }
  function flip(b) { if (!b || calm()) return; b.classList.remove('pz-flip'); void b.offsetWidth; b.classList.add('pz-flip'); setTimeout(function () { b.classList.remove('pz-flip'); }, 700); }
  function home() { return document.documentElement.getAttribute('data-view') === 'home' && document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function opened() {
    if (!home()) return; build();
    var c = document.getElementById('authCard');
    if (!calm()) { c.classList.remove('pz-pop'); void c.offsetWidth; c.classList.add('pz-pop'); setTimeout(function () { c.classList.remove('pz-pop'); }, 900); }
    setTimeout(function () { flip(c.querySelector('.vc-wc-num b')); }, 260);
  }
  function confetti(host) {
    var cols = ['#d1a54a', '#c4735a', '#7fa184', '#93aaac', '#e6d6b8', '#d1a54a'], shp = ['50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%', '50% 0,100% 50%,50% 100%,0 50%'];
    var pill = host.querySelector('.vda-pill'); var hr = host.getBoundingClientRect(), pr = pill ? pill.getBoundingClientRect() : hr;
    var ox = pr.left - hr.left + pr.width / 2, oy = pr.top - hr.top + pr.height / 2;
    for (var i = 0; i < 6; i++) {
      var s = document.createElement('i'); s.className = 'pzcf'; s.style.left = ox + 'px'; s.style.top = oy + 'px'; s.style.background = cols[i]; s.style.clipPath = 'polygon(' + shp[i % 2] + ')';
      host.appendChild(s);
      var a = (-150 + i * 24) * Math.PI / 180, d = 38 + (i % 3) * 12;
      var an = s.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + (Math.cos(a) * d).toFixed(0) + 'px),calc(-50% + ' + (Math.sin(a) * d).toFixed(0) + 'px)) rotate(' + (120 + i * 40) + 'deg) scale(1)', opacity: 1, offset: .6 }, { transform: 'translate(calc(-50% + ' + (Math.cos(a) * d * 1.1).toFixed(0) + 'px),calc(-50% + ' + (Math.sin(a) * d + 24).toFixed(0) + 'px)) rotate(' + (200 + i * 40) + 'deg) scale(.8)', opacity: 0 }], { duration: 700, delay: 260, easing: 'cubic-bezier(.2,.8,.4,1)', fill: 'both' });
      (function (n) { an.onfinish = function () { n.remove(); }; })(s);
    }
  }
  function stamp() {
    if (!home() || calm()) return;
    var host = document.getElementById('vdcAcct'), pill = host && host.querySelector('.vda-pill'); if (!pill) return;
    pill.classList.remove('pz-stamp'); host.classList.remove('pz-shake'); void pill.offsetWidth;
    pill.classList.add('pz-stamp'); host.classList.add('pz-shake'); if (host.animate) confetti(host);
    setTimeout(function () { pill.classList.remove('pz-stamp'); host.classList.remove('pz-shake'); }, 800);
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-fx')) { var s = document.createElement('style'); s.id = 'pz-fx'; s.textContent = css; document.head.appendChild(s); }
    build();
    var last = document.body.getAttribute('data-sheet');
    new MutationObserver(function () { var v = document.body.getAttribute('data-sheet'); if (v === last) return; last = v; if (v === 'acct') setTimeout(opened, 40); })
      .observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    var c = document.getElementById('authCard'); if (!c) return;
    var q = 0, okWas = !!c.querySelector('#vdcAcct .vda-pill.is-ok'), numWas = (c.querySelector('.vc-wc-num b') || {}).textContent;
    new MutationObserver(function () {
      if (q) return; q = requestAnimationFrame(function () {
        q = 0; build();
        var ok = !!c.querySelector('#vdcAcct .vda-pill.is-ok'); if (ok && !okWas) stamp(); okWas = ok;
        var nb = c.querySelector('.vc-wc-num b'), nv = nb && nb.textContent; if (nb && numWas !== undefined && nv !== numWas && document.body.getAttribute('data-sheet') === 'acct' && home()) flip(nb); numWas = nv;
      });
    }).observe(c, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'], characterData: true });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('#acctInfoBtn'); if (!b || !home()) return;
      setTimeout(function () { if (b.getAttribute('aria-expanded') === 'true') [].forEach.call(c.querySelectorAll('.vai-num b,.vai-cap b'), function (x, i) { setTimeout(function () { flip(x); }, i * 90); }); }, 60);
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZFX*/
