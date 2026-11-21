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

/*PZMUSIC*/ /* เพลงธีมตัดกระดาษ "Paper Crane Waltz" — กล่องดนตรี/คาลิมบา จังหวะวอลซ์ 3/4 คีย์ D major + เสียงกระดาษ (สร้างด้วยโค้ดทั้งหมด ไม่มีไฟล์ ไม่มีลิขสิทธิ์)
   ผสมตามฉากเลื่อนของธีมนี้: ดิ่งผ่านชั้นกระดาษ (คาลิมบา + เสียงกระดาษปัด) → ตัดข้อเสี่ยง (เสียงกรรไกร "ฉึบ" ตามจังหวะ)
   → ลอกชั้นบน (กระดิ่งกล่องดนตรีระยิบ) → ฉีกกระดาษ (เสียงฉีก) → ตรานูน (ตุ้บ) → ผลตรวจ (คอร์ดสว่าง ทำนองช้าลง) */
(function () {
  var T = window.VCHT && window.VCHT.paper; if (!T || T.music) return;
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  /* D · Bm · G · A (ช่วงหลัก) / G · D/F# · Em · A (ช่วงผลตรวจ) — [เบส, 5th, 10th, ...] */
  var CH = [[50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64]];
  var CB = [[43, 50, 55, 59, 62], [42, 50, 54, 57, 62], [40, 47, 52, 55, 59], [45, 52, 57, 61, 64]];
  /* ทำนอง 8 ห้อง (ห้องละ 3 โน้ต: จังหวะ 1, 2, 3) — 0 = เว้น */
  var ML = [78, 0, 76, 74, 0, 71, 74, 76, 79, 78, 0, 0, 78, 0, 81, 83, 81, 78, 76, 78, 74, 76, 0, 0];
  var MB = [74, 0, 78, 81, 0, 79, 78, 0, 76, 76, 74, 0, 79, 0, 78, 76, 0, 74, 73, 74, 76, 74, 0, 0];
  var SP = [86, 88, 90, 93, 95, 98];
  function kal(A, bus, f, t, dur, g) {   /* คาลิมบา/กล่องดนตรี: ไซน์ดีดเร็ว + โอเวอร์โทนเพี้ยนนิดๆ */
    t = Math.max(t, A.currentTime || 0);
    var e = A.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + .004); e.gain.exponentialRampToValueAtTime(g * .3, t + .18); e.gain.exponentialRampToValueAtTime(.0004, t + dur); e.connect(bus);
    [[1, 1], [2.76, .18], [5.4, .06]].forEach(function (h) { var o = A.createOscillator(), gg = A.createGain(); o.type = 'sine'; o.frequency.value = f * h[0]; gg.gain.value = h[1]; o.connect(gg); gg.connect(e); o.start(t); o.stop(t + dur + .05); });
  }
  function nz(A, sec) { var b = A.createBuffer(1, Math.floor(A.sampleRate * sec), A.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
  function burst(A, buf, bus, t, f0, f1, dur, g, type, q) {
    var s = A.createBufferSource(), fl = A.createBiquadFilter(), e = A.createGain(); s.buffer = buf;
    fl.type = type || 'bandpass'; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur); fl.Q.value = q || 1.2;
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + .004); e.gain.exponentialRampToValueAtTime(.0005, t + dur);
    s.connect(fl); fl.connect(e); e.connect(bus); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
  }
  function snip(A, N, t) { burst(A, N.nb, N.sn, t, 5200, 2600, .05, .5, 'bandpass', 2.5); burst(A, N.nb, N.sn, t + .055, 6400, 3400, .04, .32, 'bandpass', 3); }
  function rustle(A, N, t, g) { burst(A, N.nb, N.ks, t, 2600, 1200, .22, g, 'bandpass', .8); }
  function tear(A, N, t) {
    var s = A.createBufferSource(), fl = A.createBiquadFilter(), e = A.createGain(); s.buffer = N.nb;
    fl.type = 'highpass'; fl.frequency.setValueAtTime(900, t); fl.frequency.linearRampToValueAtTime(2600, t + .5);
    e.gain.setValueAtTime(0, t); for (var i = 0; i < 10; i++) e.gain.linearRampToValueAtTime((i % 2 ? .12 : .34) * (1 - i / 12), t + .05 * i + .02); e.gain.linearRampToValueAtTime(0, t + .6);
    s.connect(fl); fl.connect(e); e.connect(N.fx); s.start(t); s.stop(t + .65);
  }
  function thump(A, N, t) {
    var o = A.createOscillator(), e = A.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(55, t + .2);
    e.gain.setValueAtTime(.45, t); e.gain.exponentialRampToValueAtTime(.001, t + .32); o.connect(e); e.connect(N.fx); o.start(t); o.stop(t + .34);
    burst(A, N.nb, N.fx, t, 900, 400, .08, .25, 'lowpass', .7);
  }
  T.music = {
    title: 'Paper Crane Waltz',
    build: function (A, M, u) {
      var b = u && u.bus ? u.bus : function () { var g = A.createGain(); g.gain.value = 0; g.connect(M.out); return g; };
      var fx = A.createGain(); fx.gain.value = .8; fx.connect(M.out);
      M.pz = { nb: nz(A, 2), ks: b(), sn: b(), sp: b(), br: b(), fx: fx, step: 0, next: 0, spT: 0, lp: -1, x: { k: 1, s: 0, p: 0, b: 0 } };
    },
    sched: function (A, M) {
      var N = M.pz; if (!N) return;
      var now = A.currentTime, x = N.x;
      if (!N.next || N.next < now - .5) N.next = now + .06;
      while (N.next < now + .25) {
        var t = N.next, br = x.b > x.k, beat = N.step % 3, bar = Math.floor(N.step / 3) % 8, ch = (br ? CB : CH)[Math.floor(N.step / 6) % 4];
        var bus = br ? N.br : N.ks, sw = beat === 0 ? 0 : .025;   /* วอลซ์: จังหวะ 2-3 หน่วงนิดๆ */
        if (x.k > .02 || x.b > .02) {
          if (beat === 0) kal(A, bus, hz(ch[0]), t, 2.6, .17);
          else kal(A, bus, hz(ch[beat === 1 ? 2 : 3]), t + sw, 1.3, .07 + Math.random() * .02);
          var m = (br ? MB : ML)[bar * 3 + beat]; if (m) kal(A, bus, hz(m), t + sw + .008, beat === 0 ? 2.2 : 1.6, .11);
          if (!br && beat === 0 && x.k > .3 && bar % 2 === 0) rustle(A, N, t + .02, .05);
        }
        if (x.s > .05 && beat === 1) snip(A, N, t + sw);
        N.step++; N.next += br ? .46 : .38;
      }
      if (x.p > .05 && now > N.spT) { N.spT = now + .22 + Math.random() * .35; kal(A, N.sp, hz(SP[Math.floor(Math.random() * SP.length)]), now + .03, 1.8, .05); }
    },
    mix: function (A, M, p) {
      var N = M.pz; if (!N) return; var n = A.currentTime;
      var k = 1 - seg(p, .68, .74), s = seg(p, .2, .215) * (1 - seg(p, .4, .43)), sp = seg(p, .455, .475) * (1 - seg(p, .565, .59)), b = seg(p, .7, .78);
      N.x = { k: k, s: s, p: sp, b: b };
      [M.warm, M.dark, M.ten, M.res].forEach(function (g) { g.gain.cancelScheduledValues(n); g.gain.setTargetAtTime(0, n, .2); });   /* ปิดเพลงตั้งต้น */
      N.ks.gain.setTargetAtTime(k * .9, n, .3); N.sn.gain.setTargetAtTime(s * .7, n, .15); N.sp.gain.setTargetAtTime(sp * .8, n, .3); N.br.gain.setTargetAtTime(b * .9, n, .5);
      if (N.lp >= 0) {
        if (N.lp < .58 && p >= .58 && p < .64) tear(A, N, n + .02);
        if (N.lp < .612 && p >= .612 && p < .66) thump(A, N, n + .02);
        if (N.lp < .468 && p >= .468 && p < .5) rustle(A, N, n + .02, .12);
      }
      N.lp = p;
    }
  };
  /* ชื่อเพลงบนปุ่ม (ถ้าธีมถูกใช้ไปแล้วก่อนบล็อกนี้) */
  function title() { var h = document.getElementById('vch'), sr = h && h.shadowRoot, t = sr && sr.querySelector('.snd .t1x'); if (t && h.getAttribute('data-th') === 'paper') t.textContent = T.music.title; }
  title(); setTimeout(title, 600); setTimeout(title, 2500);
})();
/*/PZMUSIC*/

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

/*PZLOGIN*/ /* ธีมตัดกระดาษ: หน้าเข้าสู่ระบบ (#authLoggedOut) — โต๊ะกระดาษเขียวเข้ม + กรอบหยัก 3 ชั้นบน/ล่าง · การ์ดครีมซ้อนชั้นอิฐ ติดเทป
   หัวกรรไกร · ช่องกรอกขอบประ ป้ายชื่อติด · ตั๋ว "เข้าสู่ระบบ" (ปุ่มเด่นปุ่มเดียว) · ปุ่ม Google มีโลโก้ G · ตรายาง "ลับเฉพาะ"
   ซ่อนถ้วย/กระเป๋า/เทียน (บน iPhone ขึ้นเป็นรูปเสีย "?") แทนด้วยนกกระเรียน/ดาวกระดาษ */
(function () {
  'use strict';
  if (window.__pzLogin) return; window.__pzLogin = 1;
  var A = 'html[data-htheme="paper"][data-view="home"] body #authCard#authCard';
  var L = A + ' #authLoggedOut';
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var STARS = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='40'%3E%3Cg fill='%23b98d45' fill-opacity='.16'%3E%3Cpath d='M12 6l1.4 2.9 3.1.4-2.3 2.1.6 3.1L12 13l-2.8 1.5.6-3.1-2.3-2.1 3.1-.4z'/%3E%3Ccircle cx='44' cy='26' r='1.3'/%3E%3C/g%3E%3C/svg%3E\")";
  var CUT = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M11.2 15.6L24 3.4M12.4 12.4L25 21' stroke='%233a2a16' stroke-width='2.8' stroke-linecap='round'/%3E%3Ccircle cx='7.6' cy='19.6' r='4.4' fill='none' stroke='%23c4735a' stroke-width='2.8'/%3E%3Ccircle cx='7.6' cy='8.4' r='4.4' fill='none' stroke='%233a2a16' stroke-width='2.8'/%3E%3C/svg%3E\")";
  var INK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7'/%3E%3C/filter%3E%3Crect width='120' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var WAVE = '<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100V12 Q92 16 84 12 T67 12 T50 12 T33 12 T17 12 T0 12Z" fill="#e6d6b8"/><path d="M0 0H100V8 Q92 12 84 8 T68 8 T50 8 T34 8 T17 8 T0 8Z" fill="#c99f48"/><path d="M0 0H100V4 Q92 7 84 4 T68 4 T50 4 T34 4 T17 4 T0 4Z" fill="#b06a55"/></svg>';
  var CRANE = '<svg viewBox="0 0 96 72" aria-hidden="true"><path d="M48 40 L20 6 L44 30 Z" fill="#e6d6b8"/><path d="M48 40 L80 2 L54 32 Z" fill="#d9c7a3"/><path d="M6 44 L48 40 L34 52 Z" fill="#efe3cb"/><path d="M48 40 L90 30 L62 50 Z" fill="#d9c7a3"/><path d="M34 52 L48 40 L62 50 L48 58 Z" fill="#c9b48c"/><path d="M90 30 L94 22 L86 30 Z" fill="#c4735a"/></svg>';
  var STAR = function (c) { return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.4 4.9 17.1l1-5.6-4.1-4 5.7-.8z" fill="' + c + '" stroke="rgba(0,0,0,.25)" stroke-width=".6"/></svg>'; };
  var G = '<svg class="pzg" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  var css =
    /* หัวแผ่นตอนยังไม่ล็อกอิน: ไม่มีเส้นประ/ลูกไฟ */
    A + ':has(#authLoggedOut:not([hidden])) .alx-hd{display:none !important}' +
    /* พื้นหลัง */
    L + ' .ld-desk{background:' + STARS + ',linear-gradient(180deg,#24605c,#1d4f4c) !important}' +
    L + ' .ld-scene::after,' + L + ' .ld-bag,' + L + ' .ld-cup,' + L + ' .ld-scene > svg,' + L + ' .ld-glow,' + L + ' .ld-dark,' + L + ' .vc-dust,' + L + ' .vc-intro-ov{display:none !important}' +
    '.pzlw{display:none}' + L + ' .ld-scene > .pzlw{display:block;position:absolute;left:0;right:0;height:64px;pointer-events:none;z-index:1}' +
    L + ' .ld-scene > .pzlw svg{width:100%;height:100%;display:block}' + L + ' .ld-scene > .pzlw.t{top:0}' + L + ' .ld-scene > .pzlw.b{bottom:0;transform:scaleY(-1)}' +
    L + ' .ld-scene > .pzld{display:block;position:absolute;pointer-events:none;z-index:1;filter:drop-shadow(0 4px 4px rgba(0,0,0,.35))}' + '.pzld{display:none}' +
    L + ' .ld-scene > .pzld svg{width:100%;height:100%;display:block;overflow:visible}' +
    L + ' .ld-scene > .pzld.cr{left:14px;top:48px;width:62px;height:46px;rotate:-10deg}' +
    L + ' .ld-scene > .pzld.s1{right:84px;bottom:58px;width:30px;height:30px;rotate:18deg;z-index:3}' + L + ' .ld-scene > .pzld.s2{right:124px;bottom:66px;width:18px;height:18px;rotate:-12deg;z-index:3}' +
    /* การ์ด */
    L + ' .auth-doc-wrap{z-index:2}' +
    L + ' .auth-doc::before{background:#b06a55 !important;border-radius:5px !important;transform:rotate(2.2deg) translate(6px,6px) !important;box-shadow:0 10px 18px rgba(0,0,0,.35) !important;opacity:1 !important}' +
    L + ' .auth-doc::after,' + L + ' .ad-rim,' + L + ' .ad-spill,' + L + ' .ad-clip,' + L + ' .ad-sign,' + L + ' .ad-vidlayer{display:none !important}' +
    L + ' .ad-face{background:' + FIB + ',linear-gradient(180deg,#efe3ca,#e3d3b2) !important;border-radius:5px !important;box-shadow:none !important}' +
    L + ' .ad-face::before,' + L + ' .ad-face::after{display:none !important}' +
    L + ' .auth-doc > .pzlt{display:block;position:absolute;left:-14px;top:10px;width:62px;height:18px;rotate:-34deg;background:rgba(240,228,200,.82);border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08);z-index:5;pointer-events:none}' + '.pzlt,.pzls{display:none}' +
    L + ' .auth-doc > .pzls{display:block;position:absolute;right:16px;top:20px;rotate:-10deg;padding:3px 8px;border:2.5px solid rgba(60,92,76,.85);border-radius:4px;color:rgba(60,92,76,.92);font:800 11px/1.2 Prompt,sans-serif;text-align:center;-webkit-mask:' + INK + ';mask:' + INK + ';z-index:5;pointer-events:none}' +
    L + ' .auth-doc > .pzls small{display:block;font-size:9px}' +
    L + ' .ad-kicker{font-size:0 !important;height:46px;margin-bottom:4px !important}' +
    L + ' .ad-kicker::before{content:"" !important;display:block !important;width:46px !important;height:46px !important;margin:0 auto !important;border-radius:6px;background:' + CUT + ' center/26px no-repeat,linear-gradient(180deg,#e6d7b9,#ddcca9) !important;box-shadow:2px 3px 0 #7d6233;-webkit-mask:none !important;mask:none !important;opacity:1 !important}' +
    L + ' .ad-title{' + DK + 'font-weight:800 !important}' +
    L + ' .ad-sub{background:none !important;color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    L + ' .ad-sub::after,' + L + ' .ad-title::after{background:radial-gradient(circle 2.2px at 50% 50%,#7d6233 92%,transparent) 0 0/9px 6px repeat-x !important;height:6px !important;opacity:.6;border:0 !important}' +
    /* ช่องกรอก */
    L + ' .ad-field{position:relative;margin-top:10px !important}' +
    L + ' .ad-lab{position:relative;z-index:2;display:inline-block !important;margin:0 0 -9px 10px !important;padding:1px 8px !important;background:#d6b6a4 !important;border-radius:2px;rotate:-2deg;' + DK + 'font-weight:700 !important;letter-spacing:0 !important;font-family:Prompt,sans-serif !important}' +
    L + ' .ad-field + .ad-field .ad-lab{background:#bfcab1 !important}' +
    L + ' .ad-field input{background:#e6d5b4 !important;border:1.5px dashed rgba(58,42,22,.35) !important;border-radius:4px !important;padding:14px 12px 8px !important;color:#2e2112 !important;box-shadow:none !important}' +
    L + ' .ad-field input::placeholder{color:#8a7458 !important}' +
    L + ' .ad-field input:focus{outline:2px solid #1d4f4c !important;outline-offset:1px;border-style:solid !important}' +
    L + ' .ac-txt{color:#3a2a16 !important}' + L + ' .ac-txt a{color:#7d3a2c !important;font-weight:700;text-decoration:underline dashed !important}' +
    L + ' .ac-box{border-color:#7d6233 !important;background:#efe3ca !important;border-radius:3px !important}' +
    L + ' #vcConsent:checked + .ac-box{background:#7fa184 !important;border-color:#5f8166 !important}' +
    /* ปุ่ม */
    L + ' #loginBtn{position:relative;overflow:visible !important;background:#d1a54a !important;border:0 !important;border-radius:4px !important;' + DK + 'font-weight:800 !important;box-shadow:2px 3px 0 #6e4f22 !important}' +
    L + ' #loginBtn::before,' + L + ' #loginBtn::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border:0 !important;border-radius:0 !important;opacity:1 !important;transform:none !important;animation:none !important;box-shadow:none !important;background:radial-gradient(circle 2.4px at 50% 50%,#e3d3b2 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    L + ' #loginBtn::before{left:-3px !important}' + L + ' #loginBtn::after{right:-3px !important}' +
    L + ' #signupBtn{background:#efe3ca !important;border:1.5px dashed rgba(58,42,22,.4) !important;border-radius:4px !important;' + DK + 'font-weight:700 !important;box-shadow:none !important}' +
    L + ' #loginBtn:active,' + L + ' #signupBtn:active{transform:translate(1px,2px)}' +
    L + ' #loginBtn:focus-visible,' + L + ' #signupBtn:focus-visible,' + L + ' #googleBtn:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    L + ' .ad-freetag{background:#7fa184 !important;background-clip:border-box !important;border:3px dotted #e3d3b2 !important;border-radius:0 !important;color:#f4f1e6 !important;font-style:normal;font-weight:800 !important;box-shadow:none !important;rotate:6deg}' +
    L + ' .or-line{color:#7a6448 !important}' + L + ' .or-line::before,' + L + ' .or-line::after{background:rgba(58,42,22,.25) !important}' +
    L + ' #googleBtn{display:flex !important;align-items:center;justify-content:center;gap:10px;background:#fffaf0 !important;border:0 !important;border-radius:4px !important;box-shadow:1px 2px 0 #b8a37f !important;' + DK + 'font-weight:700 !important}' +
    L + ' #googleBtn::before{display:none !important}' + L + ' #googleBtn .pzg{width:20px;height:20px;flex:none}' +
    L + ' .ad-fine{color:#7a6448 !important}' +
    /* v2: การ์ดใหญ่ขึ้นเต็มจอ · อยู่กลางแนวตั้ง */
    L + ':not([hidden]){min-height:100% !important;display:flex !important;flex-direction:column}' + L + ' .ld-scene{display:flex !important;flex-direction:column;justify-content:safe center;flex:1 0 auto;min-height:0 !important}' +
    L + ' .ld-scene .auth-doc-wrap{width:100% !important;max-width:560px;margin:0 auto !important;padding:100px 14px 92px !important;zoom:1 !important}' +
    L + ' .ad-pose{transform:rotate(-.8deg) !important}' +
    '@media (max-height:760px){' + L + ' .ld-scene .auth-doc-wrap{padding:66px 12px 70px !important}' + L + ' .auth-doc{padding:22px 18px 20px !important}' + L + ' .ad-title{font-size:26px !important}' + L + ' .ld-scene > .pzld.cr{top:34px;width:48px;height:36px}}' +
    L + ' .auth-doc{padding:30px 22px 26px !important}' +
    L + ' .ad-title{font-size:30px !important}' + L + ' .ad-sub{font-size:14px !important}' +
    L + ' .ad-field input{font-size:16px !important;min-height:52px}' +
    L + ' #loginBtn,' + L + ' #signupBtn,' + L + ' #googleBtn{min-height:54px !important;font-size:16px !important}' +
    /* v2: ข้อความ "ออกจากระบบแล้ว" เป็นป้ายกระดาษห้อยมุมซ้ายล่าง (หายเองใน 4 วิ) */
    A + ':has(#authLoggedOut:not([hidden])) #authMsg:empty{display:none !important}' +
    A + ':has(#authLoggedOut:not([hidden])) #authMsg:not(:empty){position:fixed !important;left:14px !important;bottom:calc(env(safe-area-inset-bottom) + 18px) !important;z-index:30;width:auto !important;max-width:70vw;margin:0 !important;' +
      'padding:9px 14px 9px 30px !important;background:linear-gradient(180deg,#f1e6cf,#e3d3b2) !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;font:700 14px/1.3 Prompt,sans-serif !important;text-align:left !important;' +
      'border:0 !important;border-radius:3px 12px 12px 3px !important;box-shadow:2px 3px 0 #7d6233,0 8px 14px -6px rgba(0,0,0,.5) !important;rotate:-3deg;animation:pzmsg .45s cubic-bezier(.3,1.4,.5,1) both}' +
    A + ':has(#authLoggedOut:not([hidden])) #authMsg:not(:empty)::before{content:"";position:absolute;left:11px;top:50%;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;background:#1d4f4c;box-shadow:inset 0 1px 2px rgba(0,0,0,.5)}' +
    A + ':has(#authLoggedOut:not([hidden])) #authMsg:not(:empty)::after{content:"";position:absolute;left:15px;top:-26px;width:1.5px;height:30px;background:#c4735a;rotate:-14deg;transform-origin:50% 100%}' +
    '@keyframes pzmsg{from{translate:-30px 10px;rotate:-14deg;opacity:0}to{translate:0 0;rotate:-3deg;opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){' + A + ' #authMsg{animation:none !important}}';
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function build() {
    var sc = document.querySelector('#authLoggedOut .ld-scene'); if (sc && !sc.querySelector(':scope > .pzlw')) {
      sc.insertAdjacentHTML('beforeend', '<i class="pzlw t">' + WAVE + '</i><i class="pzlw b">' + WAVE + '</i><i class="pzld cr">' + CRANE + '</i><i class="pzld s1">' + STAR('#d1a54a') + '</i><i class="pzld s2">' + STAR('#c4735a') + '</i>');
    }
    var d = document.querySelector('#authLoggedOut .auth-doc'); if (d && !d.querySelector(':scope > .pzlt')) {
      d.insertAdjacentHTML('beforeend', '<i class="pzlt" aria-hidden="true"></i><i class="pzls" aria-hidden="true">ลับเฉพาะ<small>ฉบับหายาก ✂</small></i>');
    }
    var g = document.getElementById('googleBtn'); if (g && !g.querySelector('.pzg') && !g.querySelector('svg')) g.insertAdjacentHTML('afterbegin', G);
  }
  var msgT = 0;
  function msgWatch() {
    var m = document.getElementById('authMsg'); if (!m || m.__pz) return; m.__pz = 1;
    new MutationObserver(function () {
      clearTimeout(msgT);
      if (on() && /^\s*ออกจากระบบแล้ว\s*$/.test(m.textContent)) msgT = setTimeout(function () { if (/^\s*ออกจากระบบแล้ว\s*$/.test(m.textContent)) m.textContent = ''; }, 4000);
    }).observe(m, { childList: true, characterData: true, subtree: true });
  }
  function go() {
    if (!on()) return;
    msgWatch();
    if (!document.getElementById('pz-login')) { var s = document.createElement('style'); s.id = 'pz-login'; s.textContent = css; document.head.appendChild(s); }
    build();
    var c = document.getElementById('authCard');
    if (c) { var q = 0; new MutationObserver(function () { if (q) return; q = requestAnimationFrame(function () { q = 0; build(); }); }).observe(c, { childList: true, subtree: true }); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZLOGIN*/

/*PZHELLO*/ /* ธีมตัดกระดาษ: การ์ดต้อนรับ (.vc-hello จาก art.js welcomeCard) — โน้ตครีมติดเทป 2 มุม ขอบล่างซิกแซก
   ตรานกกระเรียนแทนตราครั่ง · ตัวเลขบนป้ายกระดาษ · แสตมป์เช็กอิน · ตั๋ว "เริ่มตรวจสัญญา" · แถบอิฐ + กรรไกรจิ๋ว · ตรายาง · พับกางตอนเด้ง */
(function () {
  'use strict';
  if (window.__pzHello) return; window.__pzHello = 1;
  var C = 'html[data-htheme="paper"] body .vc-hello.vc-hello';
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.16' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var INK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7'/%3E%3C/filter%3E%3Crect width='120' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var EDGE = 'polygon(50% 0,61% 9%,75% 5%,80% 19%,95% 25%,91% 39%,100% 50%,91% 61%,95% 75%,80% 81%,75% 95%,61% 91%,50% 100%,39% 91%,25% 95%,20% 81%,5% 75%,9% 61%,0 50%,9% 39%,5% 25%,20% 19%,25% 5%,39% 9%)';
  function zigBot(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((100 - i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '100%' : 'calc(100% - ' + d + 'px)')); return 'polygon(0 0,100% 0,' + a.join(',') + ')'; }
  var CRANE = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 31 L23 9 L36 32 Z" fill="#efe3cb"/><path d="M32 31 L23 9 L28 30 Z" fill="#dccaa6"/><path d="M33 31 L46 7 L40 33 Z" fill="#d9c7a3"/>' +
    '<path d="M17 39 L32 31 L47 39 L32 45 Z" fill="#c4735a"/><path d="M17 39 L32 39 L32 45 Z" fill="#a85a46"/><path d="M22 38 L9 21 L11.5 20 L25 36 Z" fill="#c4735a"/><path d="M9 21 L4.5 23.5 L10.5 22.5 Z" fill="#3a2a16"/><path d="M42 38 L59 27 L45 40.5 Z" fill="#b06a55"/></svg>';
  var SCI = '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M30 20 L62 8" stroke="#3a2a16" stroke-width="5" stroke-linecap="round"/><path d="M30 20 L62 32" stroke="#5a4528" stroke-width="5" stroke-linecap="round"/><ellipse cx="13" cy="12" rx="10" ry="6.5" fill="none" stroke="#c4735a" stroke-width="4.5"/><ellipse cx="13" cy="28" rx="10" ry="6.5" fill="none" stroke="#3a2a16" stroke-width="4.5"/></svg>';
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var css =
    C + '{background:none !important;border:0 !important;box-shadow:none !important;overflow:visible !important;isolation:isolate;rotate:-1.2deg;filter:drop-shadow(0 10px 12px rgba(0,0,0,.4));-webkit-backdrop-filter:none !important;backdrop-filter:none !important;padding-bottom:26px !important;transform-origin:50% 100%}' +
    C + '::before{content:"" !important;display:block !important;position:absolute !important;inset:0 !important;z-index:-1 !important;border-radius:0 !important;opacity:1 !important;background:' + FIB + ',linear-gradient(180deg,#f1e6cf,#e6d7b9) !important;clip-path:' + zigBot(40, 8) + ';box-shadow:none !important;animation:none !important}' +
    C + '::after{content:"" !important;display:block !important;position:absolute !important;left:16px !important;right:16px !important;bottom:16px !important;top:auto !important;height:0 !important;border:0 !important;border-top:1.5px dashed rgba(58,42,22,.3) !important;background:none !important;opacity:1 !important;z-index:0 !important}' +
    C + '.pz-in{animation:pzhIn .4s cubic-bezier(.3,1.3,.5,1) both}' + '@keyframes pzhIn{from{scale:1 .12;opacity:.3}to{scale:1 1;opacity:1}}' +
    C + ' .vh-seal{width:58px !important;height:58px !important;background:none !important;box-shadow:none !important;border:0 !important;position:relative;filter:drop-shadow(1px 3px 2px rgba(0,0,0,.28))}' +
    C + ' .vh-seal > b{display:none !important}' + C + ' .vh-seal::before,' + C + ' .vh-seal::after{display:none !important}' +
    '.pzhb{display:none}' + C + ' .vh-seal > .pzhb{display:block;position:absolute;inset:0}' +
    C + ' .vh-seal .r1{position:absolute;inset:0;background:#d1a54a;clip-path:' + EDGE + '}' +
    C + ' .vh-seal .r2{position:absolute;inset:7px;border-radius:50%;background:#f4ead6;box-shadow:inset 0 2px 3px rgba(0,0,0,.12)}' +
    C + ' .vh-seal svg{position:absolute;inset:7px;width:44px;height:44px}' +
    C + ' .vh-hi{' + DK + 'font-weight:800 !important}' +
    C + ' .vh-cr{color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important}' +
    C + ' .vh-cr .pzn{display:inline-block !important;width:auto !important;position:static !important;font:800 15px/1.25 Prompt,sans-serif;color:#7d3a2c;-webkit-text-fill-color:#7d3a2c;background:#ecd8a4;padding:0 7px;margin:0 3px;border-radius:2px;box-shadow:1px 2px 0 rgba(125,98,51,.45);rotate:-2deg}' +
    C + ' .vh-x{background:#e3d3b4 !important;border:0 !important;box-shadow:1px 2px 0 #7d6233 !important;border-radius:50% !important;position:absolute}' +
    C + ' .vh-x::before{content:"" !important;display:block !important;position:absolute;inset:2.5px;border-radius:50%;border:1.2px dashed rgba(58,42,22,.25);background:none !important}' +
    C + ' .vh-x::after{content:"" !important;display:block !important;position:absolute !important;left:50% !important;top:50% !important;width:12px !important;height:12px !important;margin:-6px 0 0 -6px !important;border:0 !important;opacity:1 !important;transform:none !important;-webkit-mask:none !important;mask:none !important;background:linear-gradient(45deg,transparent 42%,#3a2a16 42% 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,#3a2a16 42% 58%,transparent 58%) !important}' +
    C + ' .vh-x{background-image:none !important}' +
    C + ' > .pzhs{position:absolute;right:50px;top:12px;rotate:-10deg;padding:1px 6px;border:2px solid rgba(60,92,76,.85);border-radius:3px;color:rgba(60,92,76,.92);font:800 10px/1.3 Prompt,sans-serif;-webkit-mask:' + INK + ';mask:' + INK + ';pointer-events:none}' +
    C + ' > .pzht{position:absolute;top:4px;width:56px;height:16px;background:rgba(240,228,200,.85);border-left:2px dashed rgba(0,0,0,.08);border-right:2px dashed rgba(0,0,0,.08);pointer-events:none;z-index:3}' +
    C + ' > .pzht.l{left:-12px;rotate:-30deg}' + C + ' > .pzht.r{right:-14px;rotate:28deg}' +
    C + ' .vh-btn{border-radius:4px !important;' + DK + 'font-weight:800 !important;box-shadow:none !important}' +
    C + ' .vh-btn[data-a="daily"]{background:#7fa184 !important;background-clip:border-box !important;border:4px dotted #e6d7b9 !important;border-radius:0 !important;color:#f4f1e6 !important;-webkit-text-fill-color:#f4f1e6 !important;rotate:-1.5deg}' +
    C + ' .vh-btn[data-a="daily"] svg{stroke:#f4f1e6 !important;color:#f4f1e6 !important}' +
    C + ' .vh-btn[data-a="check"]{position:relative;overflow:visible !important;background:#d1a54a !important;border:0 !important;box-shadow:2px 3px 0 #6e4f22 !important}' +
    C + ' .vh-btn[data-a="check"]::before,' + C + ' .vh-btn[data-a="check"]::after{content:"" !important;display:block !important;position:absolute !important;top:0 !important;bottom:0 !important;left:auto;right:auto;width:6px !important;height:auto !important;border:0 !important;opacity:1 !important;transform:none !important;animation:none !important;background:radial-gradient(circle 2.4px at 50% 50%,#e6d7b9 92%,transparent) 0 1px/6px 8px repeat-y !important}' +
    C + ' .vh-btn[data-a="check"]::before{left:-3px !important}' + C + ' .vh-btn[data-a="check"]::after{right:-3px !important}' +
    C + ' .vh-btn:active{translate:1px 2px}' + C + ' .vh-btn:focus-visible,' + C + ' .vh-x:focus-visible{outline:2px solid #1d4f4c !important;outline-offset:2px}' +
    C + ' .vh-bar{left:16px !important;right:16px !important;bottom:14px !important;height:6px !important;background:#c4735a !important;clip-path:polygon(0 0,100% 0,99% 100%,0 100%);border-radius:0 !important;z-index:1}' +
    C + ' > .pzhc{position:absolute;bottom:9px;left:16px;width:22px;height:16px;margin-left:-11px;z-index:2;pointer-events:none;will-change:transform}' +
    C + ' > .pzhc svg{width:100%;height:100%;display:block}' +
    '@media (prefers-reduced-motion:reduce){' + C + '.pz-in{animation:none}}' + 'html[data-calm] body .vc-hello.vc-hello.pz-in{animation:none}';
  function dress(c) {
    if (c.__pz) return; c.__pz = 1;
    var s = c.querySelector('.vh-seal'); if (s) s.insertAdjacentHTML('afterbegin', '<span class="pzhb" aria-hidden="true"><i class="r1"></i><i class="r2"></i>' + CRANE + '</span>');
    var cr = c.querySelector('.vh-cr'); if (cr) { var t = cr.textContent, m = t.match(/(\d+)/); if (m) { var i = t.indexOf(m[1]); cr.textContent = ''; cr.appendChild(document.createTextNode(t.slice(0, i))); var b = document.createElement('span'); b.className = 'pzn'; b.textContent = m[1]; cr.appendChild(b); cr.appendChild(document.createTextNode(t.slice(i + m[1].length))); } }
    c.insertAdjacentHTML('beforeend', '<i class="pzht l" aria-hidden="true"></i><i class="pzht r" aria-hidden="true"></i><i class="pzhs" aria-hidden="true">ลับเฉพาะ</i><i class="pzhc" aria-hidden="true">' + SCI + '</i>');
    var calm = document.documentElement.hasAttribute('data-calm') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!calm) c.classList.add('pz-in');
    var bar = c.querySelector('.vh-bar'), sc = c.querySelector('.pzhc');
    if (!bar || !sc) return;
    (function tick() {
      if (!c.isConnected) return;
      var w = bar.offsetWidth, a = bar.getAnimations ? bar.getAnimations()[0] : null, p = 0;
      if (a && a.effect && a.effect.getTiming) { var d = a.effect.getTiming().duration || 9000; p = Math.min(1, (a.currentTime || 0) / d); }
      sc.style.transform = 'translateX(' + ((1 - p) * w).toFixed(1) + 'px)';
      if (p < 1) requestAnimationFrame(tick);
    })();
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-hello')) { var s = document.createElement('style'); s.id = 'pz-hello'; s.textContent = css; document.head.appendChild(s); }
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j]; if (n.nodeType === 1 && n.classList.contains('vc-hello')) dress(n); } })
      .observe(document.body, { childList: true });
    var ex = document.querySelector('.vc-hello'); if (ex) dress(ex);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZHELLO*/

/*PZNAVOUT*/ /* ธีมตัดกระดาษ: แถบเมนูล่างบนมือถือแสดงตอนยังไม่ล็อกอินด้วย (เดิมซ่อน) — แตะ ประวัติ/บัญชี → เปิดหน้าเข้าสู่ระบบ */
(function () {
  'use strict';
  if (window.__pzNavOut) return; window.__pzNavOut = 1;
  var mq = window.matchMedia('(max-width: 767px)');
  function on() { return document.documentElement.getAttribute('data-htheme') === 'paper'; }
  function go() {
    if (!on()) return;
    var nav = document.getElementById('bottomNav'), li = document.getElementById('authLoggedIn'), tg = document.getElementById('authToggle');
    if (!nav || !li) return;
    if (!document.getElementById('pz-navout')) { var st = document.createElement('style'); st.id = 'pz-navout'; st.textContent = '@media (max-width:767px){html[data-htheme="paper"] body.pz-nav-out .vch{--vh-nav:64px}html[data-htheme="paper"] body.pz-nav-out footer{padding-bottom:calc(26px + var(--nav-h,64px) + env(safe-area-inset-bottom))}html[data-htheme="paper"] body.pz-nav-out .vc-fpill,html[data-htheme="paper"] body.pz-nav-out .to-top{margin-bottom:var(--nav-h,64px)}}'; document.head.appendChild(st); }
    var busy = false;
    function fix() {
      if (busy) return; busy = true;
      var out = li.hidden && mq.matches;
      if (out) { if (nav.hidden) nav.hidden = false; document.body.classList.add('pz-nav-out'); }
      else document.body.classList.remove('pz-nav-out');
      busy = false;
    }
    new MutationObserver(function () { setTimeout(fix, 0); }).observe(nav, { attributes: true, attributeFilter: ['hidden'] });
    new MutationObserver(function () { setTimeout(fix, 0); }).observe(li, { attributes: true, attributeFilter: ['hidden'] });
    if (mq.addEventListener) mq.addEventListener('change', fix);
    nav.addEventListener('click', function (e) {
      if (!li.hidden) return;
      var b = e.target.closest && e.target.closest('[data-nav="hist"],[data-nav="acct"]'); if (!b) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!document.body.classList.contains('auth-open') && tg) tg.click();
    }, true);
    fix();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else setTimeout(go, 0);
})();
/*/PZNAVOUT*/

/*PZPOP*/ /* ธีมตัดกระดาษ: ฉากหลังหน้าบัญชี = "ทิวทัศน์ป๊อปอัปซ้อนชั้น" (แทนเศษกระดาษร่วง .pzf)
   ฟ้ากระดาษครีม · ดวงอาทิตย์ · เมฆติดไม้ห้อย (แกว่งช้า) · ฝูงนกกระเรียนบินผ่านเป็นระยะ · ภูเขา/เนิน 5 ชั้น + ต้นสน + บ้านไฟกะพริบ
   (ก) อยู่หลังการ์ด + แผ่นโปร่งช่วยอ่าน · (ข) parallax: เลื่อนแผ่นลง ชั้นหน้าจมเร็ว ชั้นหลังจมช้า
   (ค) ใช้ transform/opacity ล้วน · display:none เมื่อปิดแผ่น = อนิเมชันหยุดเอง · (ง) โหมดสงบ/ลดภาพเคลื่อนไหว = ภาพนิ่ง */
(function () {
  'use strict';
  if (window.__pzPop) return; window.__pzPop = 1;
  var H0 = 'html[data-htheme="paper"][data-view="home"]';
  var A = H0 + ' body[data-sheet="acct"] #authCard#authCard';
  var CALM = 'html[data-calm]';
  function zigTop(n, d) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (i % 2 ? '0' : d + 'px')); return 'polygon(' + a.join(',') + ',100% 100%,0 100%)'; }
  function calm() { var h = document.documentElement; return h.hasAttribute('data-calm') || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  /* ชั้นเนิน: [ความสูง %, ตัวคูณ parallax, svg ภายใน] — เงาขอบบน = path เดิมเลื่อนขึ้น 4px (ถูกกว่า filter) */
  function hill(d, fill) { return '<path d="' + d + '" fill="rgba(60,40,20,.2)" transform="translate(0 -4)"/><path d="' + d + '" fill="' + fill + '"/>'; }
  var CR = '<svg viewBox="0 0 96 72"><path d="M48 40 L20 6 L44 30 Z" fill="#f4ead6"/><path d="M48 40 L80 2 L54 32 Z" fill="#e2d2b2"/><path d="M6 44 L48 40 L34 52 Z" fill="#c4735a"/><path d="M48 40 L90 30 L62 50 Z" fill="#b06a55"/></svg>';
  var LAYERS = [
    [66, .035, hill('M0 200 L60 110 L110 170 L180 60 L250 160 L300 100 L360 170 L420 120 V560 H0Z', '#8eaeb4'), 560],
    [56, .06, hill('M0 140 Q60 80 130 120 T260 110 T420 90 V470 H0Z', '#84b07a'), 470],
    [48, .09, hill('M0 120 Q90 60 190 110 T420 80 V400 H0Z', '#4f9064') +
      '<path d="M60 110 L76 60 L92 110Z" fill="#2f6b4a"/><rect x="74" y="110" width="4" height="10" fill="#6b5030"/><path d="M96 104 L108 70 L120 104Z" fill="#3b7d55"/><path d="M320 92 L336 46 L352 92Z" fill="#2f6b4a"/><path d="M350 96 L362 62 L374 96Z" fill="#3b7d55"/>' +
      '<g transform="translate(220 62)"><rect x="0" y="22" width="46" height="34" fill="#e9dbbf"/><path d="M-6 24 L23 0 L52 24Z" fill="#b06a55"/><rect x="18" y="34" width="12" height="22" fill="#7d6036"/><rect class="w" x="5" y="30" width="9" height="9" fill="#e2b45a"/><rect class="w w2" x="33" y="30" width="9" height="9" fill="#e2b45a"/></g>', 400],
    [36, .13, hill('M0 90 Q110 40 230 80 T420 60 V300 H0Z', '#dba63e') + '<g fill="#f2e2c0"><circle cx="40" cy="96" r="4"/><circle cx="150" cy="88" r="3.5"/><circle cx="300" cy="76" r="4"/></g><g fill="#c4624a"><circle cx="90" cy="110" r="3.5"/><circle cx="230" cy="98" r="4"/><circle cx="380" cy="84" r="3.5"/></g>', 300],
    [26, .18, hill('M0 70 Q70 30 160 60 T320 50 T420 40 V220 H0Z', '#c4624a') + '<g fill="#f2e2c0"><circle cx="30" cy="80" r="4"/><circle cx="200" cy="74" r="4.5"/><circle cx="350" cy="62" r="4"/></g><g fill="#dba63e"><circle cx="110" cy="72" r="4"/><circle cx="280" cy="76" r="3.5"/><circle cx="405" cy="58" r="4"/></g><g fill="#8eaeb4"><circle cx="70" cy="92" r="3"/><circle cx="250" cy="90" r="3"/></g>', 220]
  ];
  var css =
    '.pzp{display:none}' +
    A + ' > .pzp{display:block;position:absolute;left:0;right:0;top:9px;bottom:0;z-index:0;pointer-events:none;overflow:hidden;clip-path:' + zigTop(50, 7) + ';background:linear-gradient(180deg,#f1dfb4 0%,#eed0a2 40%,#e9b99a 72%,#dfa98e 100%);contain:strict}' +
    A + ' > .pzf{display:none !important}' +
    '.pzp > *,.pzp .pzp-sun,.pzp .pzp-cw{position:absolute}' +
    '.pzp .pzp-sky{inset:0}' +
    '.pzp .pzp-rb{position:absolute;left:-8%;right:18%;bottom:34%;aspect-ratio:2/1}' +
    '.pzp .pzp-rb i{position:absolute;left:var(--o);right:var(--o);top:calc(var(--o) * 2);bottom:calc(var(--o) * 2 - 100%);border-radius:50%;background:var(--c);box-shadow:0 -3px 0 rgba(60,40,20,.12)}' +
    '.pzp .pzp-rb i:nth-child(1){--o:0%}.pzp .pzp-rb i:nth-child(2){--o:5%}.pzp .pzp-rb i:nth-child(3){--o:10%}.pzp .pzp-rb i:nth-child(4){--o:15%}.pzp .pzp-rb i:nth-child(5){--o:20%;background:linear-gradient(180deg,#f1dfb4,#eed0a2)}' +
    '.pzp .pzp-rb{overflow:hidden;opacity:.9}' +
    '.pzp .pzp-sun{right:14%;top:15%;width:58px;height:58px;border-radius:50%;background:#e2b45a;box-shadow:0 0 0 8px rgba(226,180,90,.25)}' +
    '.pzp .pzp-cw{top:84px;width:2px;transform-origin:50% 0;animation:pzpSway 7s ease-in-out infinite alternate}' +
    '.pzp .pzp-cw::before{content:"";position:absolute;left:0;top:0;bottom:12px;width:2px;background:#8a6c42}' +
    '.pzp .pzp-cl{position:absolute;bottom:0;height:24px;border-radius:13px;background:#f4ead6;box-shadow:2px 3px 0 rgba(0,0,0,.12)}' +
    '.pzp .pzp-cl::before{content:"";position:absolute;width:46%;height:150%;left:18%;top:-60%;border-radius:50%;background:inherit}' +
    '.pzp .c1{left:30%;height:70px}.pzp .c1 .pzp-cl{left:-40px;width:86px}' +
    '.pzp .c2{left:64%;height:132px;animation-duration:9s;animation-delay:-3s}.pzp .c2 .pzp-cl{left:-38px;width:76px;opacity:.92}' +
    '@keyframes pzpSway{from{transform:rotate(-3.5deg)}to{transform:rotate(3.5deg)}}' +
    '.pzp .pzp-fly{left:0;right:0;top:27%;height:60px}' +
    '.pzp .pzp-flock{position:absolute;inset:0;transform:translate3d(-110px,0,0);animation:pzpFly 26s linear 2s infinite}' +
    '.pzp .pzp-flock svg{position:absolute;display:block;height:auto}' +
    '.pzp .pzp-flock .f1{left:30px;top:6px;width:32px}.pzp .pzp-flock .f2{left:70px;top:18px;width:24px}.pzp .pzp-flock .f3{left:0;top:26px;width:20px}' +
    '.pzp .pzp-flock svg{animation:pzpBob 1.6s ease-in-out infinite alternate}.pzp .pzp-flock .f2{animation-delay:-.6s}.pzp .pzp-flock .f3{animation-delay:-1.1s}' +
    '@keyframes pzpFly{0%{transform:translate3d(-110px,14px,0)}45%{transform:translate3d(calc(100% + 20px),-16px,0)}100%{transform:translate3d(calc(100% + 20px),-16px,0)}}' +
    '@keyframes pzpBob{from{transform:translateY(0)}to{transform:translateY(-4px)}}' +
    '.pzp .pzp-L{left:-10px;right:-10px;bottom:-100px;will-change:transform}' +
    '.pzp .pzp-L svg{display:block;width:100%;height:calc(100% - 100px)}' +
    '.pzp .pzp-L::after{content:"";display:block;height:100px;background:var(--pzf)}' +
    '.pzp .w{animation:pzpLit 5s steps(1,end) infinite}.pzp .w2{animation-duration:7s;animation-delay:-2s}' +
    '@keyframes pzpLit{0%,100%{opacity:1}46%{opacity:.55}50%{opacity:1}78%{opacity:.75}82%{opacity:1}}' +
    /* (ก) แผ่นโปร่ง: บนโปร่งใส ล่างนวลลง — ตัวหนังสือที่วางบนเนินเขียว/อิฐยังอ่านได้ */
    '.pzp .pzp-veil{inset:0;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0))}' +
    A + ' .vc-mg{background:rgba(239,227,202,.86) !important;border-radius:3px !important;box-shadow:1px 2px 0 rgba(125,98,51,.45) !important;padding-top:3px !important;padding-bottom:3px !important;padding-right:8px !important}' +
    /* ป๊อปอัปตอนเปิดแผ่น: ชั้นเด้งขึ้นทีละชั้น (หลัง→หน้า) */
    A + '.pz-pop > .pzp .pzp-L svg{animation:pzpUp .6s cubic-bezier(.2,1.25,.4,1) var(--pzd,0s) both}' +
    '@keyframes pzpUp{from{transform:translate3d(0,60px,0)}to{transform:none}}' +
    /* (ง) */
    CALM + ' .pzp *,' + CALM + ' .pzp *::before{animation:none !important}' + CALM + ' .pzp .pzp-flock{transform:translate3d(46%,0,0) !important}' +
    '@media (prefers-reduced-motion:reduce){.pzp *,.pzp *::before{animation:none !important}.pzp .pzp-flock{transform:translate3d(46%,0,0) !important}}';
  var layers = [], sky = [], body = null, q = 0;
  function build() {
    var c = document.getElementById('authCard'); if (!c) return null;
    var s = c.querySelector(':scope > .pzp'); if (s) return s;
    s = document.createElement('div'); s.className = 'pzp'; s.setAttribute('aria-hidden', 'true');
    var h = '<div class="pzp-sky"><div class="pzp-rb"><i style="--c:#c4624a"></i><i style="--c:#dba63e"></i><i style="--c:#84b07a"></i><i style="--c:#8eaeb4"></i><i style="--c:#f1dfb4"></i></div><div class="pzp-sun"></div><div class="pzp-cw c1"><div class="pzp-cl"></div></div><div class="pzp-cw c2"><div class="pzp-cl"></div></div></div>' +
      '<div class="pzp-fly"><div class="pzp-flock">' + CR.replace('<svg', '<svg class="f1"') + CR.replace('<svg', '<svg class="f2"') + CR.replace('<svg', '<svg class="f3"') + '</div></div>';
    LAYERS.forEach(function (L, i) {
      var fill = (L[2].match(/fill="(#[0-9a-f]+)"/) || [])[1];
      h += '<div class="pzp-L" style="height:calc(' + L[0] + '% + 100px);--pzf:' + fill + ';--pzd:' + (i * .06).toFixed(2) + 's"><svg viewBox="0 0 420 ' + L[3] + '" preserveAspectRatio="xMidYMin slice">' + L[2] + '</svg></div>';
    });
    s.innerHTML = h + '<div class="pzp-veil"></div>';
    var pza = c.querySelector(':scope > .pza'); c.insertBefore(s, pza ? pza.nextSibling : c.firstChild);
    return s;
  }
  function active() { var h = document.documentElement; return h.getAttribute('data-htheme') === 'paper' && h.getAttribute('data-view') === 'home' && document.body.getAttribute('data-sheet') === 'acct'; }
  function paint() {
    q = 0; var y = (!active() || calm() || !body) ? 0 : Math.max(0, body.scrollTop);
    for (var i = 0; i < layers.length; i++) { var v = Math.min(y * LAYERS[i][1], 40 + i * 14); layers[i].style.transform = v ? 'translate3d(0,' + v.toFixed(1) + 'px,0)' : ''; }
    if (sky[0]) sky[0].style.transform = y ? 'translate3d(0,' + Math.min(y * .02, 14).toFixed(1) + 'px,0)' : '';
  }
  function onScroll() { if (!q) q = requestAnimationFrame(paint); }
  function hook() {
    var s = build(); if (!s) return;
    layers = [].slice.call(s.querySelectorAll('.pzp-L')); sky = [s.querySelector('.pzp-sky')];
    var b = document.querySelector('#authCard > .sheet-body');
    if (b !== body) { if (body) body.removeEventListener('scroll', onScroll); body = b; if (body) body.addEventListener('scroll', onScroll, { passive: true }); }
    paint();
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-pop')) { var st = document.createElement('style'); st.id = 'pz-pop'; st.textContent = css; document.head.appendChild(st); }
    hook();
    var last = document.body.getAttribute('data-sheet');
    new MutationObserver(function () { var v = document.body.getAttribute('data-sheet'); if (v === last) return; last = v; hook(); })
      .observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZPOP*/

/*PZPROF*/ /* ธีมตัดกระดาษ: หัวแผ่นบัญชี = "ป้ายชื่อกระดาษ" ติดเทป (รูปโปรไฟล์วงแหวนประ + ป้ายตราประทับ "เข้าสู่ระบบแล้ว")
   ปุ่ม X กลางแนวป้ายชื่อ ชิดขวา · ซองเครดิต: เลื่อนปุ่ม "เติมเครดิต" ลง + ย้ายตรา V ขึ้นเหนือปุ่ม (ไม่ทับกันแล้ว) */
(function () {
  'use strict';
  if (window.__pzProf) return; window.__pzProf = 1;
  var A = 'html[data-htheme="paper"][data-view="home"] body[data-sheet="acct"] #authCard#authCard';
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.14' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var css =
    /* หัวแผ่น */
    A + ' > .sheet-head{padding:24px 16px 12px 18px !important;align-items:center !important;gap:12px !important}' +
    A + ' .acct-row{flex:1 1 auto;min-width:0;position:relative;align-items:center !important;gap:12px !important;padding:10px 12px 10px 10px !important;background:' + FIB + ',linear-gradient(180deg,#f1e6cf,#e8d9bb) !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233,0 8px 12px -8px rgba(0,0,0,.45) !important;rotate:-.6deg}' +
    A + ' .acct-row::before{content:"";position:absolute;inset:4px;border:1.5px dashed rgba(94,71,42,.28);border-radius:3px;pointer-events:none}' +
    A + ' .acct-row::after{content:"";position:absolute;top:-8px;left:22px;width:46px;height:15px;transform:rotate(-7deg);background:rgba(216,196,147,.85);box-shadow:0 1px 1px rgba(0,0,0,.12);pointer-events:none}' +
    A + ' .acct-avatar{width:48px !important;height:48px !important;flex:0 0 48px !important;background:#cdd6c0 !important;box-shadow:0 0 0 3px #efe3ca,0 0 0 4.5px #a9843a !important}' +
    A + ' .acct-avatar::after{inset:4px !important;border-color:rgba(47,74,44,.3) !important}' +
    A + ' #acctInitial{font-size:20px !important;color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important}' +
    A + ' .acct-cam{right:-5px !important;bottom:-5px !important;width:20px !important;height:20px !important;background:#d1a54a !important;color:#2e2112 !important;border:2px solid #efe3ca !important;box-shadow:1px 1px 0 #6e4f22 !important}' +
    A + ' .acct-cam svg{width:10px !important;height:10px !important;color:#2e2112 !important;stroke:#2e2112 !important}' +
    A + ' .acct-info{min-width:0;gap:5px !important}' +
    A + ' .acct-mail{font-size:14.5px !important;line-height:1.25 !important}' +
    A + ' .acct-label{align-self:flex-start;gap:6px !important;padding:3px 9px 3px 7px !important;border:1.5px solid rgba(60,92,76,.6) !important;border-radius:20px !important;background:rgba(127,161,132,.16) !important;font-size:0 !important}' +
    A + ' .acct-label::before{width:6px !important;height:6px !important}' +
    A + ' .acct-label::after{color:#2f4a2c !important;-webkit-text-fill-color:#2f4a2c !important;font:600 11.5px/1 Prompt,Sarabun,sans-serif !important}' +
    A + ' #authClose.sheet-close{position:relative !important;top:auto !important;right:auto !important;left:auto !important;align-self:center !important;flex:0 0 40px !important;width:40px !important;height:40px !important;margin:0 !important;rotate:4deg}' +
    A + ' .alx-hd{margin-top:12px !important}' +
    /* ซองเครดิต: ปุ่มลง 38px · ตรา V อยู่เหนือปุ่ม · กระเป๋าซองสูงขึ้นให้ปลาย V ตรงตรา */
    A + ' .vc-wc-top-up{margin-top:96px !important}' +
    A + ' .vc-wcard > .pze-se{bottom:94px !important}' +
    A + ' .vc-wcard > .pze-pk{height:166px !important}';
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (document.getElementById('pz-prof')) return;
    var s = document.createElement('style'); s.id = 'pz-prof'; s.textContent = css; document.head.appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZPROF*/

/*PZREM*/ /* ธีมตัดกระดาษ: แผ่น "แจ้งเตือนวันสำคัญ" (.vrh จาก remind-ui.js — อยู่ใต้ body ไม่ได้อยู่ใน #authCard)
   พื้นคราฟต์ขอบซิกแซก · หัวแผ่นป้ายเขียวเข้มกรอบทอง ขอบล่างหยัก + กระดิ่งตัดกระดาษบนเหรียญทอง + ปุ่ม X อยู่ในป้าย
   "+ เพิ่มเอง" ตั๋วทอง (ปุ่มทองปุ่มเดียว) · "เพิ่มทั้งหมดลงปฏิทิน" ป้ายครีมเย็บขอบ
   ตอนว่าง: ปฏิทินฉีก (วันที่วันนี้) + นกกระเรียนเกาะ · 2 ขั้นตอน = ป้ายห้อยบนเชือก
   รายการ = "ตั๋ววันที่" ต้นขั้วสีตามความเร่งด่วน (อิฐ เลย · มัสตาร์ด ≤7 วัน · เขียว ยังอีกนาน) · เพิ่มรายการใหม่ → ตรายาง "บันทึกแล้ว" */
(function () {
  'use strict';
  if (window.__pzRem) return; window.__pzRem = 1;
  var P = 'html[data-htheme="paper"][data-view="home"] body .vrh';
  var X = ':not(#pz0):not(#pz1)';   /* ชนะกฎปุ่มปิดรวมของ art.css ที่ใช้ :is(#authClose,...) */
  function zig(n, d, top) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (top ? (i % 2 ? '0' : d + 'px') : (i % 2 ? '100%' : 'calc(100% - ' + d + 'px)'))); return top ? 'polygon(' + a.join(',') + ',100% 100%,0 100%)' : 'polygon(0 0,100% 0,' + a.reverse().join(',') + ')'; }
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.14' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var BELL = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='26' r='22' fill='%23a9843a'/%3E%3Ccircle cx='24' cy='25' r='22' fill='%23d1a54a'/%3E%3Ccircle cx='24' cy='25' r='17.5' fill='none' stroke='%232c5b55' stroke-width='1' stroke-dasharray='2.5 2.5' opacity='.5'/%3E%3Cg transform='rotate(-10 24 24)'%3E%3Cpath d='M15.5 34.5V24.5a10 10 0 0 1 20 0v10l2.5 3h-25z' fill='%237d3a2c'/%3E%3Cpath d='M14 33V23a10 10 0 0 1 20 0v10l2.5 3h-25z' fill='%23efe3ca'/%3E%3Cpath d='M17.5 22a6.5 6.5 0 0 1 4-6' stroke='%23d1a54a' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='24' cy='39.5' r='3' fill='%23c4735a'/%3E%3Crect x='22.5' y='10' width='3' height='4' rx='1.5' fill='%23efe3ca'/%3E%3C/g%3E%3C/svg%3E\")";
  var LOCK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 16'%3E%3Cpath d='M3 7V5a4 4 0 0 1 8 0v2' fill='none' stroke='%237d3a2c' stroke-width='2'/%3E%3Crect x='1' y='7' width='12' height='9' rx='1.5' fill='%23c4735a'/%3E%3Ccircle cx='7' cy='11.5' r='1.5' fill='%23efe3ca'/%3E%3C/svg%3E\")";
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;';
  var css =
    /* แผ่น */
    P + ' .vrh-card{background:#a9843a !important;border:0 !important;box-shadow:0 -10px 30px rgba(0,0,0,.35) !important;clip-path:' + zig(50, 10, true) + ';border-radius:0 !important;padding-top:18px !important;color:#2e2112 !important}' +
    P + ' .vrh-card::before{content:"" !important;display:block !important;position:absolute !important;inset:8px 0 0 !important;z-index:0 !important;pointer-events:none;background:' + FIB + ',linear-gradient(180deg,#ad8f64,#9d8057) !important;clip-path:' + zig(60, 7, true) + ';border:0 !important;border-radius:0 !important;opacity:1 !important;animation:none !important}' +
    P + ' .vrh-card::after{display:none !important}' +
    P + ' .vrh-card > *{position:relative;z-index:1}' +
    P + ' .vrh-grip{background:#5e472a !important;opacity:.6 !important;box-shadow:none !important}' +
    /* หัวแผ่น = ป้ายเขียว */
    P + ' .vrh-head{position:relative !important;align-items:center !important;gap:12px !important;margin:10px 0 0 !important;padding:14px 52px 20px 12px !important;background:linear-gradient(180deg,#2c5b55,#224a45) !important;border:0 !important;border-radius:0 !important;box-shadow:none !important;clip-path:' + zig(34, 6, false) + ';filter:none}' +
    P + ' .vrh-head::before{content:"" !important;display:block !important;position:absolute !important;inset:5px 5px 11px !important;left:5px !important;top:5px !important;width:auto !important;height:auto !important;border:1px solid rgba(184,150,78,.75) !important;border-radius:0 !important;background:none !important;box-shadow:none !important;pointer-events:none;transform:none !important}' +
    P + ' .vrh-head::after{content:"\\2726" !important;display:block !important;position:absolute !important;left:auto !important;right:58px !important;bottom:16px !important;top:auto !important;width:auto !important;height:auto !important;background:none !important;color:#d8b86a !important;font-size:8px !important;line-height:1 !important;opacity:1 !important}' +
    P + ' .vrh-head .vrm-ic{flex:0 0 50px !important;width:50px !important;height:50px !important;border:0 !important;border-radius:50% !important;box-shadow:none !important;background:' + BELL + ' center/100% 100% no-repeat !important}' +
    P + ' .vrh-head .vrm-ic svg{display:none !important}' + P + ' .vrh-head .vrm-ic::before,' + P + ' .vrh-head .vrm-ic::after{display:none !important}' +
    P + ' .vrh-head h3{color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;text-shadow:none !important;font-weight:800 !important}' +
    P + ' .vrh-head h3::before,' + P + ' .vrh-head h3::after{display:none !important}' +
    P + ' .vrh-head p{color:#cbd9cf !important;-webkit-text-fill-color:#cbd9cf !important;text-shadow:none !important}' +
    P + ' .vrh-x' + X + '{position:absolute !important;right:12px !important;top:12px !important;left:auto !important;width:34px !important;height:34px !important;min-width:0 !important;margin:0 !important;border-radius:50% !important;border:0 !important;background:rgba(18,48,44,.55) !important;box-shadow:inset 0 0 0 1.5px #b8964e !important;color:transparent !important;font-size:0 !important;transform:none !important}' +
    P + ' .vrh-x' + X + '::before{content:"" !important;display:block !important;position:absolute !important;inset:3.5px !important;border-radius:50% !important;border:1px dashed rgba(216,184,106,.6) !important;background:none !important}' +
    P + ' .vrh-x' + X + '::after{content:"" !important;display:block !important;position:absolute !important;left:50% !important;top:50% !important;width:12px !important;height:12px !important;margin:-6px 0 0 -6px !important;background:linear-gradient(45deg,transparent calc(50% - 1.2px),#efe3ca calc(50% - 1.2px),#efe3ca calc(50% + 1.2px),transparent calc(50% + 1.2px)),linear-gradient(-45deg,transparent calc(50% - 1.2px),#efe3ca calc(50% - 1.2px),#efe3ca calc(50% + 1.2px),transparent calc(50% + 1.2px)) !important;border:0 !important;opacity:1 !important;transform:none !important}' +
    /* ปุ่มเครื่องมือ */
    P + ' .vrh-tools{gap:10px !important;margin:16px 0 12px !important}' +
    P + ' .vrh-new{position:relative !important;overflow:visible !important;background:#d1a54a !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #6e4f22 !important;' + DK + 'font-weight:800 !important}' +
    P + ' .vrh-new::before,' + P + ' .vrh-new::after{content:"" !important;display:block !important;position:absolute !important;top:4px !important;bottom:4px !important;left:auto;right:auto;width:6px !important;height:auto !important;inset:auto;border:0 !important;border-radius:0 !important;background:radial-gradient(circle 2.5px at 50% 50%,#9d8057 95%,transparent) 0 0/6px 9px repeat-y !important;box-shadow:none !important;opacity:1 !important}' +
    P + ' .vrh-new::before{left:-3px !important}' + P + ' .vrh-new::after{right:-3px !important;left:auto !important}' +
    P + ' .vrh-allcal{position:relative !important;background:#efe3ca !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233 !important;' + DK + 'font-weight:700 !important}' +
    P + ' .vrh-allcal::before{content:"";position:absolute;inset:4px;border:1.5px dashed rgba(94,71,42,.35);border-radius:3px;pointer-events:none}' +
    P + ' .vrh-allcal svg{color:#5e472a !important;stroke:#5e472a !important}' +
    P + ' .vrh-allcal:disabled{opacity:.6 !important}' +
    /* ฟอร์มเพิ่มเอง */
    P + ' .vrh-form{background:' + FIB + ',linear-gradient(180deg,#f1e6cf,#e8d9bb) !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233 !important;padding:10px !important;margin-bottom:12px !important}' +
    P + ' .vrh-form input,' + P + ' .vrh-form select{background:#fbf4e4 !important;border:1.5px solid #c9b48a !important;border-radius:4px !important;' + DK + 'box-shadow:none !important}' +
    P + ' .vrh-form input::placeholder{color:#8a7454 !important;-webkit-text-fill-color:#8a7454 !important}' +
    P + ' .vrh-form input:focus,' + P + ' .vrh-form select:focus{border-color:#2c5b55 !important;box-shadow:0 0 0 3px rgba(44,91,85,.2) !important;outline:0 !important}' +
    P + ' .vrh-form button[type=submit]{background:#2c5b55 !important;border:0 !important;border-radius:4px !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;box-shadow:2px 2px 0 #13302c !important;text-shadow:none !important}' +
    /* ว่าง: ปฏิทินฉีก + ป้ายห้อย */
    P + ' .vrh-empty{color:#2e2112 !important}' +
    P + ' div.vrh-empty .vrm-ic,' + P + ' div.vrh-empty .nt-rsc{display:none !important}' +
    '.pzr-cal{display:none}' + P + ' div.vrh-empty .pzr-cal{display:block;width:180px;height:156px;margin:0 auto 2px}' +
    P + ' div.vrh-empty > b{' + DK + 'font-size:18px !important;font-weight:800 !important}' +
    P + ' .alx-st{position:relative !important;display:flex !important;gap:14px !important;margin:8px 0 6px !important;padding:24px 0 0 !important;list-style:none !important;counter-reset:none}' +
    '.pzr-rope{display:none}' + P + ' .alx-st > .pzr-rope{display:block;position:absolute;left:-6px;right:-6px;top:0;width:auto;height:28px;pointer-events:none}' +
    P + ' .alx-st li{flex:1 1 0 !important;position:relative !important;display:block !important;min-height:150px;margin:0 !important;padding:28px 10px 14px 12px !important;text-align:center !important;color:#3d2e1a !important;background:none !important;border:0 !important;box-shadow:none !important;font-size:11.5px !important;line-height:1.45 !important}' +
    P + ' .alx-st li:nth-of-type(1){rotate:-3deg}' + P + ' .alx-st li:nth-of-type(2){rotate:2.5deg;margin-top:10px !important}' +
    P + ' .alx-st li::before{content:"" !important;position:absolute !important;inset:0 !important;width:auto !important;height:auto !important;margin:0 !important;z-index:-1;border-radius:0 !important;clip-path:polygon(18px 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%,0 18px);box-shadow:none !important;color:transparent !important;font-size:0 !important;transform:none !important}' +
    P + ' .alx-st li:nth-of-type(1)::before{background:' + FIB + ',linear-gradient(180deg,#cdd6c0,#bfcab1) !important}' + P + ' .alx-st li:nth-of-type(2)::before{background:' + FIB + ',linear-gradient(180deg,#c6d3d3,#b6c5c6) !important}' +
    P + ' .alx-st li::after{content:"" !important;display:block !important;position:absolute !important;inset:0 !important;z-index:-2;background:#7d6233 !important;transform:translate(3px,4px) !important;clip-path:polygon(18px 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%,0 18px);border:0 !important;width:auto !important;height:auto !important}' +
    P + ' .alx-st li > span{position:relative;display:block;' + MD + 'color:#3d2e1a !important;-webkit-text-fill-color:#3d2e1a !important}' +
    P + ' .alx-st li > span::before{content:"";position:absolute;left:-4px;right:-6px;top:-22px;bottom:-8px;border:1.5px dashed rgba(60,46,26,.28);pointer-events:none;clip-path:none}' +
    P + ' .alx-st li b{display:block !important;' + DK + 'font-size:14px !important;margin:0 0 3px !important}' +
    '.pzr-t{display:none}' + P + ' .alx-st .pzr-t{display:block;position:absolute}' +
    P + ' .alx-st .pzr-t.str{left:50%;top:-24px;width:2px;height:38px;margin-left:-1px;background:#5e472a}' + P + ' .alx-st li:nth-of-type(2) .pzr-t.str{top:-34px;height:48px}' +
    P + ' .alx-st .pzr-t.hole{left:50%;top:8px;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:#9d8057;box-shadow:inset 1px 1px 0 rgba(0,0,0,.25),0 0 0 3px #efe3ca}' +
    P + ' .alx-st .pzr-t.n{right:6px;top:-10px;width:26px;height:26px;border-radius:50%;background:#c4735a;color:#efe3ca;font:900 13px/26px Prompt,sans-serif;font-style:normal;text-align:center;box-shadow:0 0 0 2.5px #efe3ca,1px 2px 0 2.5px #7d3a2c;rotate:8deg}' +
    P + ' .alx-st .pzr-ic{display:block;width:46px;height:40px;margin:2px auto 6px}' +
    /* หัวข้อกลุ่ม */
    P + ' .vrh-g h5{display:flex !important;align-items:center !important;gap:8px !important;padding:4px 10px !important;margin:6px 0 9px !important;background:rgba(239,227,202,.9) !important;border-radius:3px !important;box-shadow:1px 2px 0 rgba(125,98,51,.45) !important;' + DK + 'font-weight:800 !important}' +
    P + ' .vrh-g h5::before{content:"\\2702" !important;color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important;background:none !important;width:auto !important;height:auto !important;-webkit-mask:none !important;mask:none !important;font-size:13px !important}' +
    P + ' .vrh-g h5 span{display:inline-flex !important;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px !important;border:0 !important;border-radius:10px !important;background:#2c5b55 !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;box-shadow:none !important;font-size:11px !important}' +
    /* ตั๋ววันที่ */
    P + ' .vrh-g ul{display:flex;flex-direction:column;gap:12px}' +
    P + ' .vrh-row{display:grid !important;grid-template-columns:74px 1fr !important;grid-template-rows:1fr auto !important;gap:0 !important;padding:0 !important;min-height:94px;background:none !important;border:0 !important;border-radius:0 !important;box-shadow:none !important;filter:drop-shadow(2px 3px 0 #7d6233);position:relative;overflow:visible !important}' +
    P + ' .vrh-row::before,' + P + ' .vrh-row::after{display:none !important}' +
    P + ' .vrh-day{grid-row:1 / 3 !important;grid-column:1 !important;width:auto !important;height:auto !important;min-height:0 !important;align-self:stretch !important;margin:0 !important;transform:none !important;rotate:none !important;display:flex !important;flex-direction:column-reverse !important;align-items:center !important;justify-content:center !important;gap:2px;padding:6px 0 !important;border:0 !important;border-radius:5px 0 0 5px !important;background:#7fa184 !important;box-shadow:none !important;-webkit-mask:radial-gradient(circle 7px at 100% 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at 100% 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle 7px at 100% 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at 100% 100%,transparent 98%,#000) bottom/100% 51% no-repeat}' +
    P + ' .vrh-row.is-near .vrh-day{background:#d1a54a !important}' + P + ' .vrh-row.is-over .vrh-day{background:#c4735a !important}' + P + ' .vrh-row.is-done .vrh-day{background:#b5a68a !important}' +
    P + ' .vrh-day b{margin:0 !important;padding:0 !important;background:none !important;font:900 30px/1 Prompt,sans-serif !important;color:#efe3cb !important;-webkit-text-fill-color:#efe3cb !important;-webkit-text-stroke:1px #4a2e14;text-shadow:2px 2px 0 rgba(74,46,20,.5) !important}' +
    P + ' .vrh-day small{margin:0 !important;background:none !important;padding:0 !important;border:0 !important;box-shadow:none !important;font-size:11px !important;font-weight:800 !important;color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;opacity:.85}' +
    P + ' .vrh-txt,' + P + ' .vrh-acts{background:#eee2c7 !important;margin:0 !important;align-self:stretch !important}' +
    P + ' .vrh-txt{grid-column:2;grid-row:1;position:relative;padding:12px 12px 4px 16px !important;border-radius:0 5px 0 0;-webkit-mask:radial-gradient(circle 7px at 0 0,transparent 98%,#000);mask:radial-gradient(circle 7px at 0 0,transparent 98%,#000)}' +
    P + ' .vrh-acts{grid-column:2;grid-row:2;position:relative;display:flex !important;gap:6px !important;padding:4px 12px 10px 16px !important;border-radius:0 0 5px 0;-webkit-mask:radial-gradient(circle 7px at 0 100%,transparent 98%,#000);mask:radial-gradient(circle 7px at 0 100%,transparent 98%,#000)}' +
    P + ' .vrh-txt::before{content:"";position:absolute;left:0;top:9px;bottom:0;border-left:2px dashed rgba(94,71,42,.45)}' + P + ' .vrh-acts::before{content:"";position:absolute;left:0;top:0;bottom:9px;border-left:2px dashed rgba(94,71,42,.45)}' +
    P + ' .vrh-txt b{' + DK + 'font-weight:700 !important;font-size:14px !important}' +
    P + ' .vrh-txt small{' + MD + 'font-size:11.5px !important}' +
    P + ' .vrh-row.is-over .vrh-txt small{color:#8a3a2a !important;-webkit-text-fill-color:#8a3a2a !important;font-weight:700 !important}' +
    P + ' .vrh-row.is-near .vrh-txt small{color:#6e4f22 !important;-webkit-text-fill-color:#6e4f22 !important;font-weight:700 !important}' +
    P + ' .vrh-row.is-done{opacity:.7 !important}' +
    P + ' .vrh-acts button{min-width:34px !important;width:34px !important;height:30px !important;padding:0 !important;border:0 !important;border-radius:3px !important;box-shadow:1px 2px 0 rgba(125,98,51,.6) !important;font-weight:800 !important}' +
    P + ' .vrh-acts .vrh-done{background:#cdd6c0 !important;color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important}' +
    P + ' .vrh-row.is-done .vrh-done{background:#2c5b55 !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important}' +
    P + ' .vrh-acts .vrh-cal{background:#e4d3a6 !important;color:#5e472a !important}' + P + ' .vrh-acts .vrh-cal svg{width:16px !important;height:16px !important;color:#5e472a !important;stroke:#5e472a !important}' +
    P + ' .vrh-acts .vrh-del{background:#efe3ca !important;color:#8a3a2a !important;-webkit-text-fill-color:#8a3a2a !important;box-shadow:inset 0 0 0 1.5px rgba(138,58,42,.4),1px 2px 0 rgba(125,98,51,.6) !important}' +
    P + ' .vrh-acts .vrh-del.is-arm{background:#c4735a !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important}' +
    /* ตรายาง "บันทึกแล้ว" */
    '.pzr-stp{display:none}' + P + ' .vrh-row > .pzr-stp{display:block;position:absolute;right:12px;bottom:10px;z-index:3;padding:3px 8px;border:2.5px solid rgba(60,92,76,.85);border-radius:4px;color:rgba(60,92,76,.92);font:800 12px/1.2 Prompt,sans-serif;transform:rotate(-12deg);pointer-events:none;animation:pzrStp .5s cubic-bezier(.3,1.5,.5,1) both}' +
    '@keyframes pzrStp{0%{transform:rotate(-12deg) scale(2.2);opacity:0}60%{transform:rotate(-12deg) scale(.92);opacity:1}100%{transform:rotate(-12deg) scale(1);opacity:1}}' +
    'html[data-calm] .vrh .pzr-stp{animation:none !important}@media (prefers-reduced-motion:reduce){.vrh .pzr-stp{animation:none !important}}' +
    /* ข้อความท้าย */
    P + ' .vrh-fine{position:relative !important;margin:12px 0 0 !important;padding:8px 12px 8px 34px !important;background:#e6d7b9 !important;border-radius:3px !important;box-shadow:1px 2px 0 #7d6233 !important;' + MD + 'rotate:.4deg}' +
    P + ' .vrh-fine::before{content:"" !important;position:absolute !important;left:11px !important;top:50% !important;width:14px !important;height:16px !important;margin-top:-8px !important;background:' + LOCK + ' center/contain no-repeat !important;-webkit-mask:none !important;mask:none !important}';
  var MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  function calSvg() {
    var d = new Date(), n = d.getDate(), m = MON[d.getMonth()];
    return '<svg class="pzr-cal" viewBox="0 0 220 190" aria-hidden="true"><ellipse cx="110" cy="180" rx="78" ry="7" fill="rgba(60,40,20,.25)"/>' +
      '<g transform="translate(160 118) rotate(18)"><path d="M0 0 h40 v34 q-10 10 -24 4 q-12 -6 -16 4z" fill="#efe3ca"/><path d="M16 38 q-12 -6 -16 4 l0 -8z" fill="#d8c493"/><path d="M0 0h40v9H0z" fill="#c4735a"/></g>' +
      '<rect x="52" y="44" width="116" height="128" rx="5" fill="#7d6233"/><rect x="48" y="40" width="116" height="128" rx="5" fill="#e6d7b9"/><rect x="48" y="40" width="116" height="122" rx="5" fill="#efe3ca"/>' +
      '<path d="M48 45a5 5 0 0 1 5-5h106a5 5 0 0 1 5 5v31H48z" fill="#c4735a"/><path d="M48 76 L54 70 L60 76 L66 70 L72 76 L78 70 L84 76 L90 70 L96 76 L102 70 L108 76 L114 70 L120 76 L126 70 L132 76 L138 70 L144 76 L150 70 L156 76 L162 70 L164 72 V76Z" fill="#efe3ca"/>' +
      '<text x="106" y="64" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="800" font-size="15" fill="#efe3ca">' + m + '</text>' +
      '<text x="106" y="138" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="900" font-size="50" fill="#d1a54a">' + n + '</text><text x="104" y="136" text-anchor="middle" font-family="Prompt,sans-serif" font-weight="900" font-size="50" fill="#efe3cb" stroke="#5a3a18" stroke-width="1.3">' + n + '</text>' +
      '<g fill="#8a7a62"><rect x="72" y="30" width="6" height="20" rx="3"/><rect x="100" y="30" width="6" height="20" rx="3"/><rect x="128" y="30" width="6" height="20" rx="3"/></g>' +
      '<g transform="translate(128 6) scale(.62)"><path d="M48 40 L20 6 L44 30 Z" fill="#f4ead6"/><path d="M48 40 L80 2 L54 32 Z" fill="#e2d2b2"/><path d="M6 44 L48 40 L34 52 Z" fill="#2c5b55"/><path d="M48 40 L90 30 L62 50 Z" fill="#224a45"/></g></svg>';
  }
  var ROPE = '<svg class="pzr-rope" viewBox="0 0 360 28" preserveAspectRatio="none" aria-hidden="true"><path d="M0 4 Q90 24 180 13 T360 4" fill="none" stroke="#5e472a" stroke-width="2"/><path d="M0 4 Q90 24 180 13 T360 4" fill="none" stroke="#e6d7b9" stroke-width="1" stroke-dasharray="4 5"/></svg>';
  var IC = [
    '<svg class="pzr-ic" viewBox="0 0 48 42" aria-hidden="true"><rect x="9" y="4" width="24" height="31" rx="2" fill="#7d6233"/><rect x="7" y="2" width="24" height="31" rx="2" fill="#efe3ca"/><path d="M11 9h16M11 14h16M11 19h10" stroke="#a9843a" stroke-width="2" stroke-linecap="round"/><circle cx="30" cy="26" r="9" fill="#c6d3d3" stroke="#2c5b55" stroke-width="3.5"/><path d="M36.5 32.5l7 7" stroke="#2c5b55" stroke-width="4.5" stroke-linecap="round"/></svg>',
    '<svg class="pzr-ic" viewBox="0 0 48 42" aria-hidden="true"><rect x="10" y="11" width="32" height="30" rx="3" fill="#7d6233"/><rect x="8" y="9" width="32" height="30" rx="3" fill="#efe3ca"/><path d="M8 12a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v6H8z" fill="#c4735a"/><rect x="14" y="5" width="3.5" height="8" rx="1.7" fill="#5e472a"/><rect x="30.5" y="5" width="3.5" height="8" rx="1.7" fill="#5e472a"/><path d="M17 28l5 5 9-10" stroke="#2c5b55" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  ];
  function on() { var h = document.documentElement; return h.getAttribute('data-htheme') === 'paper' && h.getAttribute('data-view') === 'home'; }
  var prev = null, pend = 0;
  function dress() {
    var hub = document.querySelector('.vrh'); if (!hub) return;
    var e = hub.querySelector('.vrh-body div.vrh-empty');
    if (e && !e.querySelector('.pzr-cal')) e.insertAdjacentHTML('afterbegin', calSvg());
    var ol = e && e.querySelector('.alx-st');
    if (ol && !ol.querySelector('.pzr-rope')) {
      ol.insertAdjacentHTML('afterbegin', ROPE);
      [].forEach.call(ol.querySelectorAll('li'), function (li, i) {
        li.insertAdjacentHTML('afterbegin', '<i class="pzr-t str" aria-hidden="true"></i><i class="pzr-t hole" aria-hidden="true"></i><i class="pzr-t n" aria-hidden="true">' + (i + 1) + '</i>');
        var sp = li.querySelector('span'); if (sp && IC[i]) sp.insertAdjacentHTML('afterbegin', IC[i]);
      });
    }
    /* ตรายางบนรายการที่เพิ่งเพิ่ม */
    var rows = [].slice.call(hub.querySelectorAll('.vrh-row')), ids = rows.map(function (r) { return r.getAttribute('data-id'); });
    if (prev && pend && Date.now() - pend < 8000 && on()) {
      rows.forEach(function (r) { var id = r.getAttribute('data-id'); if (prev.indexOf(id) < 0 && !r.querySelector('.pzr-stp')) { r.insertAdjacentHTML('beforeend', '<span class="pzr-stp" aria-hidden="true">บันทึกแล้ว</span>'); pend = 0; } });
    }
    if (rows.length || (hub.querySelector('.vrh-body div.vrh-empty'))) prev = ids;
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-rem')) { var s = document.createElement('style'); s.id = 'pz-rem'; s.textContent = css; document.head.appendChild(s); }
    var q = 0, hooked = null;
    function tick() { if (q) return; q = requestAnimationFrame(function () { q = 0; dress(); }); }
    function hook() { var hub = document.querySelector('.vrh'); if (!hub || hub === hooked) return; hooked = hub; new MutationObserver(tick).observe(hub, { childList: true, subtree: true }); tick(); }
    hook(); new MutationObserver(hook).observe(document.body, { childList: true });
    document.addEventListener('submit', function (ev) { if (ev.target && ev.target.closest && ev.target.closest('.vrh-form')) pend = Date.now(); }, true);
    dress();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZREM*/

/*PZVTS*/ /* ธีมตัดกระดาษ: แผ่น "แจ้งปัญหา / ขอคืนเครดิต" (.vts จาก trust-ui.js · ไม่แตะ .vth แผ่นยืนยันทนาย)
   พื้นคราฟต์ขอบซิกแซก · หัว = ป้ายเขียวกรอบทอง + ซองจดหมายบนเหรียญทอง
   ฟอร์มอยู่บน "กระดาษเขียนจดหมาย" (JS ห่อ .vts-pr ถึง .vts-m ด้วย .pzv-lt) + แสตมป์นกกระเรียน + ตราไปรษณีย์
   "ตอบกลับภายใน 7 วัน" = ตั๋วต้นขั้วเขียวเข้มเลข 7 · เรื่องที่แจ้ง = ป้ายกระดาษ 5 สี อันที่เลือกยก + กรอบเขียว + หมุดอิฐ (.pzv-pin)
   ช่องรายละเอียด = กระดาษบรรทัดเส้นขอบแดง · รหัสอ้างอิง = ช่องตั๋วตัวพิมพ์ดีด · "ส่งเรื่อง" ตั๋วทอง · ส่งสำเร็จ → ตรายาง "รับเรื่องแล้ว" */
(function () {
  'use strict';
  if (window.__pzVts) return; window.__pzVts = 1;
  var P = 'html[data-htheme="paper"][data-view="home"] body .vts:not(.vth)';
  function zig(n, d, top) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (top ? (i % 2 ? '0' : d + 'px') : (i % 2 ? '100%' : 'calc(100% - ' + d + 'px)'))); return top ? 'polygon(' + a.join(',') + ',100% 100%,0 100%)' : 'polygon(0 0,100% 0,' + a.reverse().join(',') + ')'; }
  function u(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")'; }
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.14' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var COIN = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="26" r="22" fill="#a9843a"/><circle cx="24" cy="25" r="22" fill="#d1a54a"/><circle cx="24" cy="25" r="17.5" fill="none" stroke="#2c5b55" stroke-width="1" stroke-dasharray="2.5 2.5" opacity=".5"/><g transform="rotate(-8 24 25)"><rect x="12.5" y="17.5" width="25" height="17" rx="1.5" fill="#7d3a2c"/><rect x="11" y="16" width="25" height="17" rx="1.5" fill="#efe3ca"/><path d="M11 17 L23.5 26 L36 17" fill="none" stroke="#c4735a" stroke-width="2"/><circle cx="23.5" cy="27" r="3.2" fill="#c4735a"/></g></svg>');
  var LOCK = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16"><path d="M3 7V5a4 4 0 0 1 8 0v2" fill="none" stroke="#7d3a2c" stroke-width="2"/><rect x="1" y="7" width="12" height="9" rx="1.5" fill="#c4735a"/><circle cx="7" cy="11.5" r="1.5" fill="#efe3ca"/></svg>');
  var TKT = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16"><path d="M1 2h20v4a2 2 0 0 0 0 4v4H1v-4a2 2 0 0 0 0-4z" fill="#d1a54a" stroke="#6e4f22" stroke-width="1"/><path d="M8 3v10" stroke="#6e4f22" stroke-dasharray="1.5 1.5"/></svg>');
  var SEND = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2e2112" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>');
  var IC = {
    wrong: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3 1.5h7l3 3v10H3z" fill="#efe3ca" stroke="#5e472a" stroke-width="1.2"/><path d="M5 7h6M5 9.5h6M5 12h4" stroke="#c4735a" stroke-width="1.3"/></svg>',
    bug: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" fill="#efe3ca" stroke="#2c5b55" stroke-width="1.3"/><path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15M3 3l1.8 1.8M11.2 11.2L13 13M3 13l1.8-1.8M11.2 4.8L13 3" stroke="#2c5b55" stroke-width="1.3"/></svg>',
    refund: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#d1a54a" stroke="#6e4f22" stroke-width="1.2"/><path d="M10.5 6.5a3 3 0 1 0 0 3" fill="none" stroke="#efe3ca" stroke-width="1.5"/><path d="M10.5 4.5v2h-2" fill="none" stroke="#efe3ca" stroke-width="1.4"/></svg>',
    privacy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="#2c4a3f" stroke-width="1.5"/><rect x="3" y="7" width="10" height="7.5" rx="1.3" fill="#2c5b55"/><circle cx="8" cy="10.7" r="1.3" fill="#efe3ca"/></svg>',
    other: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="3.5" cy="8" r="1.6" fill="#7d3a2c"/><circle cx="8" cy="8" r="1.6" fill="#a9843a"/><circle cx="12.5" cy="8" r="1.6" fill="#2c5b55"/></svg>'
  };
  var COL = { wrong: '#e2c6b6', bug: '#c6d3d3', refund: '#e4d3a6', privacy: '#cdd6c0', other: '#e6d7b9' };
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;';
  var css =
    P + '{background:rgba(20,14,8,.6) !important}' +
    P + ' .vts-p{background:' + FIB + ',linear-gradient(180deg,#ad8f64,#9d8057) !important;background-attachment:local,local !important;border:0 !important;border-radius:0 !important;box-shadow:0 -10px 30px rgba(0,0,0,.35) !important;clip-path:' + zig(50, 10, true) + ';color:#2e2112 !important;padding-top:22px !important;overflow:auto !important}' +
    P + ' .vts-p::before{display:none !important}' +
    P + ' .vts-p::after{display:none !important}' +
    P + ' .vts-p > *{position:relative;z-index:1}' +
    /* ป้ายหัว */
    '.pzv-bn{display:contents}' + P + ' .vts-p > .pzv-bn{display:block;position:relative;margin:4px 0 14px;padding:14px 14px 20px 74px;min-height:76px;background:linear-gradient(180deg,#2c5b55,#224a45);clip-path:' + zig(34, 6, false) + '}' +
    P + ' .pzv-bn::before{content:"";position:absolute;inset:5px 5px 11px;border:1px solid rgba(184,150,78,.75);pointer-events:none}' +
    P + ' .pzv-bn::after{content:"";position:absolute;left:14px;top:14px;width:50px;height:50px;background:' + COIN + ' center/100% no-repeat}' +
    P + ' .pzv-bn h3{margin:0 0 2px !important;padding:0 !important;background:none !important;box-shadow:none !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;text-shadow:none !important;font-weight:800 !important;font-size:17px !important;display:block !important}' +
    P + ' .pzv-bn h3::before,' + P + ' .pzv-bn h3::after,' + P + ' .pzv-bn .vts-s::before,' + P + ' .pzv-bn .vts-s::after{display:none !important}' +
    P + ' .pzv-bn .vts-s{margin:0 !important;padding:0 !important;background:none !important;box-shadow:none !important;color:#cbd9cf !important;-webkit-text-fill-color:#cbd9cf !important;font-size:11.5px !important;line-height:1.45 !important}' +
    /* จดหมาย */
    '.pzv-lt{display:contents}' + P + ' .pzv-lt{display:block;position:relative;margin:0 0 16px;padding:16px 14px 14px 18px;background:repeating-linear-gradient(180deg,transparent 0 27px,rgba(94,71,42,.11) 27px 28px),linear-gradient(180deg,#f3e9d4,#eadcbe);box-shadow:2px 3px 0 #7d6233,0 10px 16px -10px rgba(0,0,0,.5);rotate:-.3deg}' +
    P + ' .pzv-lt::after{content:"";position:absolute;top:0;bottom:0;left:9px;border-left:1.5px solid rgba(196,115,90,.45);pointer-events:none}' +
    '.pzv-x{display:none}' + P + ' .pzv-lt > .pzv-x{display:block;position:absolute;pointer-events:none}' +
    P + ' .pzv-lt > .pzv-x.stp{right:10px;top:-14px;width:58px;height:68px;rotate:6deg;filter:drop-shadow(1px 2px 0 rgba(125,98,51,.7));z-index:3}' +
    P + ' .pzv-lt > .pzv-x.pm{right:40px;top:30px;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(60,92,76,.55);color:rgba(60,92,76,.6);font:800 6.5px/1.2 Prompt,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;rotate:-14deg;z-index:4}' +
    P + ' .pzv-lt > .pzv-x.rs{right:18px;top:var(--rsT,180px);z-index:5;padding:5px 12px;border:3px solid rgba(60,92,76,.85);border-radius:5px;color:rgba(60,92,76,.92);font:900 18px/1.15 Prompt,sans-serif;text-align:center;transform:rotate(-14deg);background:rgba(243,233,212,.35);display:none}' +
    P + ' .pzv-lt > .pzv-x.rs small{display:block;font-size:9px;font-weight:700}' +
    P + ' .pzv-lt.pz-ok.pz-okb{padding-bottom:78px}' + P + ' .pzv-lt.pz-okb > .pzv-x.rs{top:auto;bottom:14px}' +
    P + ' .pzv-lt.pz-ok > .pzv-x.rs{display:block;animation:pzvStp .5s cubic-bezier(.3,1.5,.5,1) both}' +
    '@keyframes pzvStp{0%{transform:rotate(-14deg) scale(2.2);opacity:0}60%{transform:rotate(-14deg) scale(.92);opacity:1}100%{transform:rotate(-14deg) scale(1);opacity:1}}' +
    'html[data-calm] .vts .pzv-x.rs{animation:none !important}@media (prefers-reduced-motion:reduce){.vts .pzv-x.rs{animation:none !important}}' +
    /* ตั๋ว 7 วัน */
    P + ' .vts-pr{position:relative !important;display:block !important;margin:0 78px 14px 0 !important;padding:9px 10px 9px 76px !important;min-height:70px;border:0 !important;border-radius:4px !important;background:linear-gradient(90deg,#2c5b55 0 62px,#e3ead9 62px) !important;box-shadow:none !important;' + MD + 'font-size:11.5px !important;line-height:1.45 !important;-webkit-mask:radial-gradient(circle 6px at 62px 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 62px 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle 6px at 62px 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 62px 100%,transparent 98%,#000) bottom/100% 51% no-repeat}' +
    P + ' .vts-pr > svg{display:none !important}' +
    P + ' .vts-pr::before{content:"7" !important;position:absolute !important;left:0 !important;top:0 !important;bottom:0 !important;width:62px !important;height:auto !important;margin:0 !important;display:flex !important;align-items:center;justify-content:center;padding-bottom:14px;background:none !important;-webkit-mask:none !important;mask:none !important;color:#f3e6c8 !important;-webkit-text-fill-color:#f3e6c8 !important;font:900 34px/1 Prompt,sans-serif !important;text-shadow:2px 2px 0 #13302c !important}' +
    P + ' .vts-pr::after{content:"\\0E27\\0E31\\0E19" !important;position:absolute !important;left:0 !important;right:auto !important;top:auto !important;bottom:11px !important;width:62px !important;height:auto !important;margin:0 !important;border-radius:0 !important;background:none !important;box-shadow:none !important;text-align:center;color:#e6c77a !important;-webkit-text-fill-color:#e6c77a !important;opacity:1 !important;font:800 11.5px/1 Prompt,sans-serif !important}' +
    P + ' .vts-pr span{position:relative;display:block;' + MD + '}' + P + ' .vts-pr b{' + DK + '}' +
    P + ' .vts-pr span::before{content:"";position:absolute;left:-14px;top:-2px;bottom:-2px;border-left:2px dashed rgba(44,74,63,.45)}' +
    /* ป้ายหัวข้อ */
    P + ' .vts-lb{' + DK + 'font-weight:800 !important;font-size:13.5px !important;letter-spacing:0 !important;margin:4px 0 8px !important}' +
    P + ' .vts-lb::before{content:"\\2702" !important;color:#7d3a2c !important;font-size:12px !important}' +
    /* ป้ายเลือกเรื่อง */
    P + ' .vts-cat{position:relative;gap:8px !important;margin:0 0 14px !important}' +
    P + ' .vts-cat button{position:relative !important;display:inline-flex !important;align-items:center;gap:6px !important;padding:8px 11px 8px 16px !important;border:0 !important;border-radius:3px !important;box-shadow:1px 2px 0 #7d6233 !important;' + DK + 'font-weight:700 !important;font-size:12.5px !important;clip-path:polygon(9px 0,100% 0,100% calc(100% + 6px),9px calc(100% + 6px),0 50%);transition:transform .18s ease,box-shadow .18s ease !important}' +
    P + ' .vts-cat button::before{content:"" !important;flex:0 0 16px !important;width:16px !important;height:16px !important;opacity:1 !important;-webkit-mask:none !important;mask:none !important}' +
    P + ' .vts-cat button.on{transform:translateY(-3px) rotate(-2deg) !important;box-shadow:2px 5px 0 #5e472a !important;outline:2px solid #2c5b55 !important;outline-offset:-4px !important;color:#2e2112 !important}' +
    P + ' .vts-cat button:focus-visible{outline:2px solid #2c5b55 !important;outline-offset:2px !important}' +
    '.pzv-pin{display:none}' + P + ' .vts-cat > .pzv-pin{display:block;position:absolute;z-index:3;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e09a82,#c4735a 55%,#7d3a2c);box-shadow:1px 2px 0 rgba(0,0,0,.3);pointer-events:none;transition:left .2s ease,top .2s ease}' +
    /* ช่องกรอก */
    P + ' #vtsMsg{position:relative;min-height:106px !important;padding:6px 10px 6px 24px !important;border:0 !important;border-radius:3px !important;background:linear-gradient(90deg,transparent 15px,rgba(196,115,90,.6) 15px,rgba(196,115,90,.6) 16.5px,transparent 16.5px),repeating-linear-gradient(180deg,#fbf4e4 0 25px,rgba(94,71,42,.18) 25px 26px) !important;background-attachment:local !important;box-shadow:inset 0 0 0 1.5px #c9b48a !important;' + DK + 'font-size:14px !important;line-height:26px !important}' +
    P + ' #vtsMsg::placeholder{color:#8a7454 !important;-webkit-text-fill-color:#8a7454 !important}' +
    P + ' #vtsMsg:focus,' + P + ' #vtsRef:focus{box-shadow:inset 0 0 0 1.5px #2c5b55,0 0 0 3px rgba(44,91,85,.18) !important;outline:0 !important}' +
    P + ' #vtsRef{height:44px;padding:0 12px 0 44px !important;border:0 !important;border-radius:3px !important;background:' + TKT + ' 12px 50%/22px 16px no-repeat,#fbf4e4 !important;box-shadow:inset 0 0 0 1.5px #c9b48a !important;' + DK + 'font:700 15px/1 "Courier New",ui-monospace,monospace !important;letter-spacing:.12em !important}' +
    P + ' #vtsRef::placeholder{color:#9a8566 !important;-webkit-text-fill-color:#9a8566 !important}' +
    P + ' .vts-n{' + MD + 'color:#5e472a !important;-webkit-text-fill-color:#5e472a !important;font-size:10.5px !important}' +
    P + ' #vtsCnt{background:#2c5b55;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;font-weight:700;padding:1px 7px;border-radius:2px;rotate:-3deg;align-self:flex-start;margin-top:-10px}' +
    P + ' #vtsCnt.alx-near{background:#c4735a}' +
    P + ' .vts-m{color:#8a3a2a !important;-webkit-text-fill-color:#8a3a2a !important;font-weight:700 !important}' +
    P + ' .vts-m.ok{display:inline-block;padding:3px 9px;background:#cdd6c0;border-radius:3px;box-shadow:1px 2px 0 rgba(125,98,51,.5);color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important}' +
    /* ปุ่ม */
    P + ' .vts-b{gap:10px !important}' +
    P + ' .vts-no{position:relative;background:#efe3ca !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #7d6233 !important;' + DK + '}' +
    P + ' .vts-no::after{content:"";position:absolute;inset:4px;border:1.5px dashed rgba(94,71,42,.35);border-radius:3px;pointer-events:none}' +
    P + ' .vts-go{position:relative;overflow:visible !important;background:#d1a54a !important;border:0 !important;border-radius:4px !important;box-shadow:2px 3px 0 #6e4f22 !important;' + DK + 'font-weight:800 !important}' +
    P + ' .vts-go::before{content:"" !important;width:18px !important;height:18px !important;background:' + SEND + ' center/contain no-repeat !important;-webkit-mask:none !important;mask:none !important}' +
    P + ' .vts-go::after{content:"" !important;display:block !important;position:absolute !important;inset:4px -3px !important;width:auto !important;height:auto !important;background:radial-gradient(circle 2.5px at 3px 50%,#9d8057 95%,transparent) 0 0/100% 9px repeat-y,radial-gradient(circle 2.5px at calc(100% - 3px) 50%,#9d8057 95%,transparent) 0 0/100% 9px repeat-y !important;border:0 !important;opacity:1 !important;pointer-events:none}' +
    /* เรื่องที่เคยแจ้ง */
    P + ' .vts-my{border-top:0 !important}' + P + ' .vts-my h4{' + DK + 'font-weight:800 !important;display:flex;gap:6px}' + P + ' .vts-my h4::before{content:"\\2702";color:#7d3a2c}' +
    P + ' .vts-my li{background:#efe3ca !important;border:0 !important;border-left:5px solid #c4735a !important;border-radius:0 !important;box-shadow:1px 2px 0 #7d6233 !important;' + MD + '}' +
    P + ' .vts-my li:has(.vts-st.done){border-left-color:#7fa184 !important}' +
    P + ' .vts-my li b{' + DK + '}' + P + ' .vts-my .ans{color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important}' +
    P + ' .vts-st{border-radius:2px !important;background:#e4d3a6 !important;color:#5e472a !important;-webkit-text-fill-color:#5e472a !important}' + P + ' .vts-st.done{background:#2c5b55 !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important}' +
    /* ข้อความท้าย */
    P + ' .vts-fine{position:relative !important;padding:8px 12px 8px 34px !important;background:#e6d7b9 !important;border-radius:3px !important;box-shadow:1px 2px 0 #7d6233 !important;' + MD + 'rotate:.4deg}' +
    P + ' .vts-fine::before{left:11px !important;top:50% !important;width:14px !important;height:16px !important;margin-top:-8px !important;background:' + LOCK + ' center/contain no-repeat !important;-webkit-mask:none !important;mask:none !important}';
  Object.keys(IC).forEach(function (k) {
    css += P + ' .vts-cat button[data-c="' + k + '"]{background:' + COL[k] + ' !important}' + P + ' .vts-cat button[data-c="' + k + '"]::before{background:' + u(IC[k]) + ' center/contain no-repeat !important}';
  });
  var STAMP = (function () {
    var c = '', x, y; for (x = 1; x < 58; x += 6) c += '<circle cx="' + x + '" cy="0" r="2.6"/><circle cx="' + x + '" cy="68" r="2.6"/>'; for (y = 4; y < 68; y += 6) c += '<circle cx="0" cy="' + y + '" r="2.6"/><circle cx="58" cy="' + y + '" r="2.6"/>';
    return '<svg class="pzv-x stp" viewBox="0 0 58 68" aria-hidden="true"><defs><mask id="pzvpf"><rect width="58" height="68" fill="#fff"/><g fill="#000">' + c + '</g></mask></defs><g mask="url(#pzvpf)"><rect width="58" height="68" fill="#efe3ca"/><rect x="5" y="5" width="48" height="58" fill="#c6d3d3"/><g transform="translate(9 14) scale(.42)"><path d="M48 40 L20 6 L44 30 Z" fill="#f4ead6"/><path d="M48 40 L80 2 L54 32 Z" fill="#e2d2b2"/><path d="M6 44 L48 40 L34 52 Z" fill="#c4735a"/><path d="M48 40 L90 30 L62 50 Z" fill="#b06a55"/></g><text x="29" y="57" text-anchor="middle" font-size="7" font-weight="800" fill="#2c5b55" font-family="Prompt,sans-serif">VELLUM</text></g></svg>';
  })();
  function on() { var h = document.documentElement; return h.getAttribute('data-htheme') === 'paper' && h.getAttribute('data-view') === 'home'; }
  function pin(p) {
    var cat = p.querySelector('.vts-cat'); if (!cat) return;
    var pn = cat.querySelector('.pzv-pin'); if (!pn) { pn = document.createElement('i'); pn.className = 'pzv-pin'; pn.setAttribute('aria-hidden', 'true'); cat.appendChild(pn); }
    var b = cat.querySelector('button.on'); if (!b) { pn.style.display = 'none'; return; }
    pn.style.display = ''; pn.style.left = (b.offsetLeft + b.offsetWidth - 12) + 'px'; pn.style.top = (b.offsetTop - 9) + 'px';
  }
  function okStamp(p) {
    var lt = p.querySelector('.pzv-lt'), m = p.querySelector('#vtsM'); if (!lt || !m) return;
    var ok = m.classList.contains('ok') && !!m.textContent;
    if (ok && !lt.classList.contains('pz-ok')) {
      /* วางตราในที่ว่างข้างป้ายสุดท้าย ถ้าไม่พอ → วางท้ายจดหมาย (เพิ่มที่ว่างด้านล่าง) ไม่ให้ทับตัวหนังสือ */
      var cat = p.querySelector('.vts-cat'), last = cat && cat.querySelector('button:last-of-type');
      if (last && lt.clientWidth - (last.offsetLeft + last.offsetWidth) > 190) { lt.classList.remove('pz-okb'); lt.style.setProperty('--rsT', (cat.offsetTop + last.offsetTop - 6) + 'px'); }
      else lt.classList.add('pz-okb');
    }
    lt.classList.toggle('pz-ok', ok);
  }
  function dress(sheet) {
    var p = sheet.querySelector('.vts-p'); if (!p || p.querySelector('.pzv-lt')) return;
    var h3 = p.querySelector(':scope > h3'), s = p.querySelector(':scope > .vts-s');
    if (h3 && s) { var bn = document.createElement('div'); bn.className = 'pzv-bn'; p.insertBefore(bn, h3); bn.appendChild(h3); bn.appendChild(s); }
    var pr = p.querySelector(':scope > .vts-pr'), m = p.querySelector(':scope > #vtsM');
    if (pr && m) {
      var lt = document.createElement('div'); lt.className = 'pzv-lt'; p.insertBefore(lt, pr);
      var n = pr, nx; while (n) { nx = n.nextSibling; lt.appendChild(n); if (n === m) break; n = nx; }
      lt.insertAdjacentHTML('afterbegin', STAMP + '<span class="pzv-x pm" aria-hidden="true">VELLUM<br>CHECK<br>✦</span><span class="pzv-x rs" aria-hidden="true">รับเรื่องแล้ว<small>VELLUM CHECK</small></span>');
      new MutationObserver(function () { okStamp(p); }).observe(m, { attributes: true, childList: true, characterData: true, subtree: true });
    }
    var cat = p.querySelector('.vts-cat');
    if (cat) { new MutationObserver(function () { pin(p); }).observe(cat, { attributes: true, subtree: true, attributeFilter: ['class'] }); }
    setTimeout(function () { pin(p); }, 60); setTimeout(function () { pin(p); }, 400);
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-vts')) { var st = document.createElement('style'); st.id = 'pz-vts'; st.textContent = css; document.head.appendChild(st); }
    new MutationObserver(function (ml) {
      if (!on()) return;
      ml.forEach(function (r) { [].forEach.call(r.addedNodes, function (n) { if (n.nodeType === 1 && n.classList.contains('vts') && !n.classList.contains('vth')) dress(n); }); });
    }).observe(document.body, { childList: true });
    var ex = document.querySelector('.vts:not(.vth)'); if (ex && on()) dress(ex);
    window.addEventListener('resize', function () { var p = document.querySelector('.vts:not(.vth) .vts-p'); if (p) pin(p); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZVTS*/

/*PZDISP*/ /* ธีมตัดกระดาษ: แผง "การแสดงผล" (#dispPanel จาก extras.js + แถวภาษาจาก i18n.js) ในหน้าบัญชี
   (ก) แฟ้มกระดาษครีมทึบ — แก้ฉากทิวทัศน์ทะลุทับตัวหนังสือ · หูแฟ้มเขียวกรอบทอง "ตั้งค่าการแสดงผล"
   ภาษา = ตั๋ว 3 สี ใบที่ใช้อยู่ยก + หมุด + ตรา "ใช้อยู่" · ขนาดตัวอักษร = "ก" ตัดกระดาษบนไม้บรรทัด · ตัวอย่าง = โน้ตติดเทป
   สวิตช์ = ป้ายเลื่อนมีคำ เปิด/ปิด · ไอคอนวงกลม 3 สี · คั่นแถวรอยปรุ · เปิดลดภาพเคลื่อนไหว → ตรา "นิ่ง" */
(function () {
  'use strict';
  if (window.__pzDisp) return; window.__pzDisp = 1;
  var H = 'html[data-htheme="paper"][data-view="home"]';
  var D = H + ' body #authCard#authCard #dispPanel';
  function u(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")'; }
  var GEAR = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l2 3 3.5-.8.8 3.5 3 2-2 3 .8 3.5-3.5.8-2 3-3-2-3 2-2-3-3.5-.8.8-3.5-2-3 3-2-.8-3.5L10 5z" fill="#d8b86a"/><circle cx="12" cy="12" r="4" fill="#2c5b55"/></svg>');
  var PIN = 'radial-gradient(circle at 35% 30%,#e09a82,#c4735a 55%,#7d3a2c)';
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#4f3b22 !important;-webkit-text-fill-color:#4f3b22 !important;text-shadow:none !important;';
  var NOTCH = function (c, bg) { return 'radial-gradient(circle 5px at 0 50%,' + bg + ' 95%,transparent 100%),radial-gradient(circle 5px at 100% 50%,' + bg + ' 95%,transparent 100%),' + c; };
  var css =
    /* แฟ้ม */
    D + '.menu-panel{position:relative !important;overflow:visible !important;margin:32px 0 6px !important;padding:20px 16px 14px !important;border:0 !important;border-radius:0 6px 6px 6px !important;background:repeating-linear-gradient(180deg,transparent 0 31px,rgba(94,71,42,.07) 31px 32px),linear-gradient(180deg,#f3e9d4,#eadcbe) !important;box-shadow:2px 3px 0 #7d6233,0 12px 18px -10px rgba(0,0,0,.5) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;' + DK + '}' +
    D + '.menu-panel::before{content:"\\0E15\\0E31\\0E49\\0E07\\0E04\\0E48\\0E32\\0E01\\0E32\\0E23\\0E41\\0E2A\\0E14\\0E07\\0E1C\\0E25" !important;display:flex !important;align-items:center;position:absolute !important;left:0 !important;top:-26px !important;right:auto !important;bottom:auto !important;width:auto !important;height:28px !important;padding:0 16px 0 30px !important;border:0 !important;border-radius:6px 10px 0 0 !important;background:' + GEAR + ' 9px 50%/15px no-repeat,linear-gradient(180deg,#2c5b55,#224a45) !important;box-shadow:inset 0 0 0 1px rgba(184,150,78,.55) !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;font:800 12.5px/1 Prompt,sans-serif !important;opacity:1 !important;pointer-events:none;-webkit-mask:none !important;mask:none !important;transform:none !important}' +
    'html[data-lang="en"]' + D.slice(4) + '.menu-panel::before{content:"Display settings" !important}' + 'html[data-lang="zh"]' + D.slice(4) + '.menu-panel::before{content:"\\663E\\793A\\8BBE\\7F6E" !important}' +
    D + '.menu-panel::after{display:none !important}' +
    D + ' .vds-blk{border:0 !important;background:none !important;box-shadow:none !important;padding:0 !important;margin:0 0 14px !important}' +
    D + ' .vds-blk::before,' + D + ' .vds-blk::after{display:none !important}' +
    D + ' .vds-h{' + DK + 'font-weight:800 !important;font-size:13px !important;letter-spacing:0 !important;margin:2px 0 10px !important;opacity:1 !important}' +
    D + ' .vds-h::before{content:"\\2702" !important;color:#7d3a2c !important;font-size:12px !important}' +
    D + ' .vds-h::after{display:none !important}' +
    /* แถบปุ่ม (รวม) */
    D + ' .vds-seg{position:relative !important;gap:9px !important;padding:0 !important;border:0 !important;border-radius:0 !important;background:none !important;box-shadow:none !important;overflow:visible !important}' +
    D + ' .vds-seg::before,' + D + ' .vds-seg::after{display:none !important}' +
    D + ' .vds-seg button{position:relative !important;overflow:visible !important;transform:none;transition:transform .18s ease !important;opacity:1 !important}' +
    D + ' .vds-seg button b{' + DK + 'opacity:1 !important}' + D + ' .vds-seg button span{' + MD + 'opacity:1 !important;position:static !important}' +
    /* ภาษา = ตั๋ว */
    D + ' .vds-lang .vds-seg button{height:62px !important;border-radius:4px !important;box-shadow:1px 2px 0 #7d6233 !important}' +
    D + ' .vds-lang .vds-seg button[data-lang="th"]{background:' + NOTCH('#e2c6b6', '#eee2c7') + ' !important}' +
    D + ' .vds-lang .vds-seg button[data-lang="en"]{background:' + NOTCH('#c6d3d3', '#eee2c7') + ' !important}' +
    D + ' .vds-lang .vds-seg button[data-lang="zh"]{background:' + NOTCH('#e4d3a6', '#eee2c7') + ' !important}' +
    D + ' .vds-lang .vds-seg button::before{content:"" !important;display:block !important;position:absolute !important;inset:5px 9px !important;width:auto !important;height:auto !important;border:1.5px dashed rgba(46,33,18,.25) !important;border-radius:2px !important;background:none !important;pointer-events:none;opacity:1 !important}' +
    D + ' .vds-lang .vds-seg button::after{display:none !important}' +
    D + ' .vds-lang .vds-seg button b{font-size:16px !important;font-weight:800 !important}' +
    D + ' .vds-lang .vds-seg button.is-on{transform:translateY(-4px) rotate(-2deg) !important;box-shadow:inset 0 0 0 2px #2c5b55,2px 5px 0 #5e472a !important}' +
    D + ' .vds-lang .vds-seg button.is-on::after{content:"\\0E43\\0E0A\\0E49\\0E2D\\0E22\\0E39\\0E48" !important;display:block !important;position:absolute !important;right:-6px !important;bottom:-9px !important;left:auto !important;top:auto !important;width:auto !important;height:auto !important;z-index:4;padding:1px 6px !important;border:2px solid rgba(60,92,76,.85) !important;border-radius:3px !important;background:rgba(243,233,212,.92) !important;color:rgba(60,92,76,.95) !important;-webkit-text-fill-color:rgba(60,92,76,.95) !important;font:900 9.5px/1.3 Prompt,sans-serif !important;transform:rotate(-10deg) !important;opacity:1 !important}' +
    'html[data-lang="en"]' + D.slice(4) + ' .vds-lang .vds-seg button.is-on::after{content:"IN USE" !important}' + 'html[data-lang="zh"]' + D.slice(4) + ' .vds-lang .vds-seg button.is-on::after{content:"\\4F7F\\7528\\4E2D" !important}' +
    /* หมุด (ใช้ span::after เพราะ ::before/::after ของปุ่มใช้แล้ว) */
    D + ' .vds-seg button.is-on span::after{content:"";position:absolute;right:-5px;top:-9px;width:14px;height:14px;border-radius:50%;background:' + PIN + ';box-shadow:1px 2px 0 rgba(0,0,0,.3);z-index:5}' +
    /* ขนาดตัวอักษร = ไม้บรรทัด */
    D + ' .vds-blk:not(.vds-lang) .vds-seg{height:76px;align-items:end !important;gap:0 !important;padding:0 4px !important;border-radius:3px !important;background:repeating-linear-gradient(90deg,rgba(94,71,42,.55) 0 1.5px,transparent 1.5px 10px) 8px 0/calc(100% - 16px) 7px no-repeat,repeating-linear-gradient(90deg,rgba(94,71,42,.6) 0 1.5px,transparent 1.5px 50px) 8px 0/calc(100% - 16px) 12px no-repeat,linear-gradient(180deg,#e4d3a6,#d8c493) !important;box-shadow:1px 2px 0 #7d6233 !important}' +
    D + ' .vds-blk:not(.vds-lang) .vds-seg button{height:58px !important;margin:0 8px 6px !important;padding:0 !important;display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:flex-end !important;background:none !important;border:0 !important;border-radius:4px !important;box-shadow:none !important}' +
    D + ' .vds-blk:not(.vds-lang) .vds-seg button::before,' + D + ' .vds-blk:not(.vds-lang) .vds-seg button::after{display:none !important}' +
    D + ' .vds-blk:not(.vds-lang) .vds-seg button b{font-family:Prompt,sans-serif !important;font-weight:900 !important;line-height:1 !important;color:#efe3cb !important;-webkit-text-fill-color:#efe3cb !important;-webkit-text-stroke:1.1px #4a2e14;text-shadow:2px 2px 0 #c4735a !important}' +
    D + ' .vds-seg button[data-font="s"] b{font-size:20px !important}' + D + ' .vds-seg button[data-font="m"] b{font-size:28px !important}' + D + ' .vds-seg button[data-font="l"] b{font-size:36px !important}' +
    D + ' .vds-blk:not(.vds-lang) .vds-seg button span{font-size:10.5px !important;font-weight:700 !important;margin-top:3px !important;padding-bottom:3px}' +
    D + ' .vds-blk:not(.vds-lang) .vds-seg button.is-on{background:rgba(239,227,202,.6) !important;box-shadow:inset 0 0 0 2px #2c5b55 !important}' +
    /* โน้ตตัวอย่าง */
    D + ' .vds-pv{position:relative !important;margin:14px 0 4px !important;padding:14px 14px 12px !important;border:0 !important;border-radius:0 !important;background:#fbf4e4 !important;box-shadow:1px 3px 0 #7d6233 !important;rotate:-.6deg;' + DK + '}' +
    D + ' .vds-pv::before{content:"" !important;display:block !important;position:absolute !important;top:-8px !important;left:50% !important;width:56px !important;height:16px !important;margin-left:-28px !important;background:rgba(216,196,147,.85) !important;transform:rotate(-3deg) !important;border:0 !important;border-radius:0 !important;opacity:1 !important}' +
    D + ' .vds-pv::after{display:none !important}' +
    D + ' .vds-pv small{color:#7d6a4c !important;-webkit-text-fill-color:#7d6a4c !important;font-weight:700 !important}' +
    /* แถวสวิตช์ */
    D + ' .vds-row{position:relative !important;padding:14px 2px !important;border:0 !important;background:none !important;box-shadow:none !important}' +
    D + ' .vds-row::after{display:none !important}' +
    D + ' .vds-row::before{content:"" !important;display:block !important;position:absolute !important;left:-6px !important;right:-6px !important;top:0 !important;height:6px !important;width:auto !important;border:0 !important;background:radial-gradient(circle 2.2px at 50% 50%,rgba(94,71,42,.45) 95%,transparent) 0 0/10px 6px repeat-x !important;opacity:1 !important}' +
    D + ' .vds-ic{flex:0 0 42px !important;width:42px !important;height:42px !important;border:0 !important;border-radius:50% !important;box-shadow:1px 2px 0 #7d6233 !important;display:flex !important;align-items:center;justify-content:center}' +
    D + ' .vds-ic::before,' + D + ' .vds-ic::after{display:none !important}' +
    D + ' .vds-ic svg{opacity:1 !important;width:20px !important;height:20px !important;color:#efe3ca !important;stroke:#efe3ca !important;stroke-width:2 !important}' +
    D + ' .vds-row.is-c .vds-ic{background:#93aaac !important}' + D + ' .vds-row.is-m .vds-ic{background:#7fa184 !important}' + D + ' .vds-row.is-s .vds-ic{background:#d1a54a !important}' +
    D + ' .vds-row.is-s .vds-ic svg{color:#2e2112 !important;stroke:#2e2112 !important}' +
    D + ' .vds-tx{position:relative;' + DK + 'font-weight:800 !important;font-size:14.5px !important}' +
    D + ' .vds-tx small{' + MD + 'font-weight:400 !important;font-size:11.5px !important;opacity:1 !important}' +
    D + ' .vds-row.is-m:has(input:checked) .vds-tx::after{content:"\\0E19\\0E34\\0E48\\0E07";position:absolute;right:-4px;top:-8px;padding:1px 7px;border:2px solid rgba(60,92,76,.85);border-radius:3px;color:rgba(60,92,76,.95);-webkit-text-fill-color:rgba(60,92,76,.95);font:900 10px/1.3 Prompt,sans-serif;transform:rotate(-12deg)}' +
    'html[data-lang="en"]' + D.slice(4) + ' .vds-row.is-m:has(input:checked) .vds-tx::after{content:"STILL"}' + 'html[data-lang="zh"]' + D.slice(4) + ' .vds-row.is-m:has(input:checked) .vds-tx::after{content:"\\9759\\6B62"}' +
    /* สวิตช์ป้ายเลื่อน */
    D + ' .vds-sw{flex:0 0 78px !important;width:78px !important;height:34px !important}' +
    D + ' .vds-sw i{border-radius:4px !important;background:#e6d7b9 !important;box-shadow:inset 0 0 0 1.5px #b9a47c !important}' +
    D + ' .vds-sw i::before{content:"" !important;position:absolute;inset:4px;border:1.5px dashed rgba(94,71,42,.25);border-radius:2px}' +
    D + ' .vds-sw i::after{content:"\\0E1B\\0E34\\0E14" !important;top:3px !important;left:3px !important;width:38px !important;height:28px !important;border-radius:3px !important;background:#efe3ca !important;box-shadow:1px 2px 0 #7d6233 !important;display:flex !important;align-items:center;justify-content:center;color:#5e472a !important;font:800 11.5px/1 Prompt,sans-serif !important;transform:none}' +
    D + ' .vds-sw input:checked + i{background:#2c5b55 !important;box-shadow:inset 0 0 0 1.5px #1f423d !important}' +
    D + ' .vds-sw input:checked + i::before{border-color:rgba(216,184,106,.35)}' +
    D + ' .vds-sw input:checked + i::after{content:"\\0E40\\0E1B\\0E34\\0E14" !important;transform:translateX(34px) !important;background:#d8b86a !important;color:#2e2112 !important;box-shadow:1px 2px 0 #13302c !important}' +
    D + ' .vds-sw input:active + i::after{width:38px !important}' + D + ' .vds-sw input:checked:active + i::after{transform:translateX(31px) !important}' +
    'html[data-lang="en"]' + D.slice(4) + ' .vds-sw i::after{content:"OFF" !important}' + 'html[data-lang="en"]' + D.slice(4) + ' .vds-sw input:checked + i::after{content:"ON" !important}' +
    'html[data-lang="zh"]' + D.slice(4) + ' .vds-sw i::after{content:"\\5173" !important}' + 'html[data-lang="zh"]' + D.slice(4) + ' .vds-sw input:checked + i::after{content:"\\5F00" !important}' +
    D + ' .vds-sw input:focus-visible + i{outline:2px solid #2c5b55 !important;outline-offset:2px !important}' +
    /* ท้ายแผง */
    D + ' .vds-foot{border:0 !important;padding-top:8px !important;margin-top:4px !important}' + D + ' .vds-foot::before{display:none !important}' +
    D + ' .vds-saved{padding:3px 9px;background:#cdd6c0 !important;border-radius:3px;box-shadow:1px 2px 0 rgba(125,98,51,.5);color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important;font-weight:700 !important}' +
    D + ' .vds-saved:empty{padding:0;box-shadow:none;background:none !important}' +
    D + ' .vds-reset{position:relative !important;padding:9px 14px !important;border:0 !important;border-radius:4px !important;background:#efe3ca !important;box-shadow:2px 3px 0 #7d6233 !important;' + DK + 'font-weight:700 !important}' +
    D + ' .vds-reset::after{content:"" !important;position:absolute !important;inset:3px !important;border:1.5px dashed rgba(94,71,42,.35) !important;border-radius:3px !important;background:none !important}' +
    D + ' .vds-reset:disabled{opacity:.55 !important}' +
    '@media (prefers-reduced-motion:reduce){' + D + ' .vds-seg button{transition:none !important}}';
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (document.getElementById('pz-disp')) return;
    var s = document.createElement('style'); s.id = 'pz-disp'; s.textContent = css; document.head.appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZDISP*/

/*PZPRIV*/ /* ธีมตัดกระดาษ: แผง "ความเป็นส่วนตัวของข้อมูล" (#privPanel จาก extras.js) ในหน้าบัญชี
   แฟ้มกระดาษครีมทึบ (แก้ฉากทะลุ) + หูแฟ้มเขียว "ความเป็นส่วนตัว" · ตรายาง "ไม่เก็บสัญญาต้นฉบับ" (ภาษาไทย)
   หัวข้อ = การ์ดดัชนี 5 สี (เส้นหัวแดง + รูเจาะ) · ไอคอนวงกลมกระดาษ · ไฮไลต์เขียว (mark.alx-hl จาก acct-lux.js)
   ปุ่มลบ = ตั๋วอิฐขอบปรุ + กรรไกร · ยืนยันด้วย confirm() เดิม (ไม่เปลี่ยนการทำงาน) · ระหว่างลบ (disabled) = รอยตัด + "กำลังลบ…"
   ผล: ป้ายเขียว + ตรายาง "ลบแล้ว" / ผิดพลาด = ป้ายอิฐ */
(function () {
  'use strict';
  if (window.__pzPriv) return; window.__pzPriv = 1;
  var H = 'html[data-htheme="paper"][data-view="home"]';
  var D = H + ' body #authCard#authCard #privPanel';
  function u(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")'; }
  var LOCKT = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#d8b86a" stroke-width="2.6"/><rect x="5" y="11" width="14" height="10" rx="2" fill="#d8b86a"/></svg>');
  var SC = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f6ead2" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/></svg>');
  var CARDS = [
    ['#e2c6b6', '#c4735a', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 11l20-8-6 19-4-8z" fill="#efe3ca"/><path d="M12 14l10-11" stroke="#c4735a" stroke-width="1.5"/></svg>'],
    ['#c6d3d3', '#5f7f88', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="7" rx="1.5" fill="#efe3ca"/><rect x="4" y="13" width="16" height="7" rx="1.5" fill="#efe3ca"/><path d="M10 7.5h4M10 16.5h4" stroke="#5f7f88" stroke-width="2"/></svg>'],
    ['#e4d3a6', '#a9843a', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1.5" fill="#efe3ca"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#a9843a" stroke-width="2"/></svg>'],
    ['#cdd6c0', '#5f8a6f', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#efe3ca"/><path d="M12 7v5l3 2" stroke="#5f8a6f" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>'],
    ['#e6d7b9', '#d1a54a', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z" fill="#efe3ca"/><rect x="9" y="18.5" width="6" height="2.5" rx="1" fill="#efe3ca"/></svg>']
  ];
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var css =
    D + '.menu-panel{position:relative !important;overflow:visible !important;margin:32px 0 6px !important;padding:22px 14px 14px !important;border:0 !important;border-radius:0 6px 6px 6px !important;background:repeating-linear-gradient(180deg,transparent 0 31px,rgba(94,71,42,.07) 31px 32px),linear-gradient(180deg,#f3e9d4,#eadcbe) !important;box-shadow:2px 3px 0 #7d6233,0 12px 18px -10px rgba(0,0,0,.5) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;' + DK + '}' +
    D + '.menu-panel::before{content:"\\0E04\\0E27\\0E32\\0E21\\0E40\\0E1B\\0E47\\0E19\\0E2A\\0E48\\0E27\\0E19\\0E15\\0E31\\0E27" !important;display:flex !important;align-items:center;position:absolute !important;left:0 !important;top:-26px !important;right:auto !important;bottom:auto !important;width:auto !important;height:28px !important;padding:0 16px 0 30px !important;border:0 !important;border-radius:6px 10px 0 0 !important;background:' + LOCKT + ' 9px 50%/14px no-repeat,linear-gradient(180deg,#2c5b55,#224a45) !important;box-shadow:inset 0 0 0 1px rgba(184,150,78,.55) !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;font:800 12.5px/1 Prompt,sans-serif !important;opacity:1 !important;pointer-events:none;-webkit-mask:none !important;mask:none !important;transform:none !important}' +
    'html[data-lang="en"]' + D.slice(4) + '.menu-panel::before{content:"Privacy" !important}' + 'html[data-lang="zh"]' + D.slice(4) + '.menu-panel::before{content:"\\9690\\79C1" !important}' +
    /* ตรายาง "ลบแล้ว" = ::after ของแผง */
    D + '.menu-panel::after{content:"\\0E25\\0E1A\\0E41\\0E25\\0E49\\0E27" !important;display:none !important;position:absolute !important;right:20px !important;bottom:18px !important;left:auto !important;top:auto !important;width:auto !important;height:auto !important;padding:4px 12px !important;border:3px solid rgba(60,92,76,.85) !important;border-radius:4px !important;background:rgba(243,233,212,.4) !important;color:rgba(60,92,76,.95) !important;-webkit-text-fill-color:rgba(60,92,76,.95) !important;font:900 18px/1.2 Prompt,sans-serif !important;transform:rotate(-12deg) !important;pointer-events:none;z-index:3;opacity:1 !important}' +
    'html[data-lang="en"]' + D.slice(4) + '.menu-panel::after{content:"DELETED" !important}' + 'html[data-lang="zh"]' + D.slice(4) + '.menu-panel::after{content:"\\5DF2\\5220\\9664" !important}' +
    D + '.menu-panel.pz-delok{padding-bottom:70px !important}' + D + '.menu-panel.pz-delok::after{display:block !important;animation:pzpvStp .5s cubic-bezier(.3,1.5,.5,1) both}' +
    '@keyframes pzpvStp{0%{transform:rotate(-12deg) scale(2.2);opacity:0}60%{transform:rotate(-12deg) scale(.92);opacity:1}100%{transform:rotate(-12deg) scale(1);opacity:1}}' +
    'html[data-calm] #privPanel.menu-panel::after{animation:none !important}@media (prefers-reduced-motion:reduce){#privPanel.menu-panel::after{animation:none !important}}' +
    /* ตรายาง "ไม่เก็บสัญญาต้นฉบับ" (JS แทรก · ไทยเท่านั้น) */
    '.pzpv-big{display:none}' + D + ' > .pzpv-big{display:block;position:absolute;right:10px;top:-16px;z-index:5;padding:4px 10px;border:2.5px solid rgba(60,92,76,.85);border-radius:4px;background:rgba(243,233,212,.92);color:rgba(60,92,76,.95);font:900 12px/1.2 Prompt,sans-serif;text-align:center;transform:rotate(8deg);pointer-events:none}' +
    D + ' > .pzpv-big small{display:block;font-size:8px;font-weight:700}' +
    'html[data-lang="en"] #privPanel > .pzpv-big,html[data-lang="zh"] #privPanel > .pzpv-big{display:none !important}' +
    /* การ์ดดัชนี */
    D + ' .priv-list{display:block !important;margin:0 !important;padding:6px 0 0 !important}' +
    D + ' .priv-list li{position:relative !important;display:block !important;min-height:0 !important;margin:0 0 10px !important;padding:12px 12px 16px 62px !important;border:0 !important;border-radius:3px !important;box-shadow:1px 2px 0 #7d6233 !important;color:#3d2e1a !important;-webkit-text-fill-color:#3d2e1a !important;font-size:11.5px !important;line-height:1.5 !important;text-shadow:none !important}' +
    D + ' .priv-list li:nth-child(odd){rotate:-.5deg}' + D + ' .priv-list li:nth-child(even){rotate:.5deg}' +
    D + ' .priv-list li b{display:block !important;margin:0 0 7px !important;' + DK + 'font:800 13.5px/1.4 Prompt,sans-serif !important;letter-spacing:0 !important}' +
    D + ' .priv-list li::before{content:"" !important;position:absolute !important;left:12px !important;top:12px !important;width:38px !important;height:38px !important;margin:0 !important;border:0 !important;border-radius:50% !important;box-shadow:1px 2px 0 #7d6233 !important;-webkit-mask:none !important;mask:none !important;opacity:1 !important;transform:none !important}' +
    D + ' .priv-list li::after{content:"" !important;position:absolute !important;left:50% !important;top:auto !important;bottom:4px !important;width:8px !important;height:8px !important;margin:0 0 0 -4px !important;border-radius:50% !important;background:#9d8057 !important;box-shadow:inset 1px 1px 0 rgba(0,0,0,.25) !important;-webkit-mask:none !important;mask:none !important;opacity:1 !important}' +
    D + ' .priv-list mark.alx-hl{background:linear-gradient(180deg,transparent 35%,rgba(127,161,132,.55) 35%,rgba(127,161,132,.55) 90%,transparent 90%) !important;background-size:auto !important;color:#1f2a1c !important;-webkit-text-fill-color:#1f2a1c !important;font-weight:800 !important;padding:0 2px !important;animation:none !important;text-decoration:none !important;border:0 !important}' +
    D + ' .priv-list mark.alx-hl::before,' + D + ' .priv-list mark.alx-hl::after{display:none !important}' +
    /* ปุ่มลบ */
    D + ' .priv-del{position:relative !important;display:flex !important;align-items:center;justify-content:center;gap:8px;width:100%;min-height:50px !important;margin-top:14px !important;border:0 !important;border-radius:4px !important;background:radial-gradient(circle 2.5px at 0 50%,#eadcbe 95%,transparent) 0 0/6px 9px repeat-y,radial-gradient(circle 2.5px at 100% 50%,#eadcbe 95%,transparent) 100% 0/6px 9px repeat-y,#b8604b !important;box-shadow:2px 3px 0 #6e3f30 !important;color:#f6ead2 !important;-webkit-text-fill-color:#f6ead2 !important;text-shadow:none !important;font:800 14.5px/1.2 Prompt,sans-serif !important}' +
    D + ' .priv-del::before{content:"" !important;flex:0 0 18px !important;width:18px !important;height:18px !important;background:' + SC + ' center/contain no-repeat !important;-webkit-mask:none !important;mask:none !important}' +
    D + ' .priv-del:active{transform:translateY(2px) !important;box-shadow:0 1px 0 #6e3f30 !important}' +
    D + ' .priv-del:disabled{opacity:1 !important;cursor:progress}' +
    D + ' .priv-del:disabled::after{content:"\\0E01\\0E33\\0E25\\0E31\\0E07\\0E25\\0E1A\\2026";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:4px;background:linear-gradient(#a85440,#a85440) center/120px 26px no-repeat,repeating-linear-gradient(90deg,rgba(246,234,210,.75) 0 8px,transparent 8px 14px) center/calc(100% - 28px) 2px no-repeat,repeating-linear-gradient(90deg,#b8604b 0 10px,#a85440 10px 20px);color:#f6ead2;font:800 14.5px/1 Prompt,sans-serif}' +
    'html[data-lang="en"]' + D.slice(4) + ' .priv-del:disabled::after{content:"Deleting\\2026"}' + 'html[data-lang="zh"]' + D.slice(4) + ' .priv-del:disabled::after{content:"\\6B63\\5728\\5220\\9664\\2026"}' +
    D + ' .priv-note{text-align:left !important;margin:10px 0 0 !important}' +
    D + ' .priv-note:empty{display:none !important}' +
    D + ' .priv-note.pz-ok,' + D + ' .priv-note.pz-err{display:inline-block !important;padding:3px 9px !important;border-radius:3px !important;box-shadow:1px 2px 0 rgba(125,98,51,.5) !important;font-weight:700 !important;font-size:12px !important}' +
    D + ' .priv-note.pz-ok{background:#cdd6c0 !important;color:#2c4a3f !important;-webkit-text-fill-color:#2c4a3f !important}' +
    D + ' .priv-note.pz-err{background:#e2c6b6 !important;color:#7d3a2c !important;-webkit-text-fill-color:#7d3a2c !important}';
  CARDS.forEach(function (c, i) {
    css += D + ' .priv-list li:nth-child(' + (i + 1) + '){background:linear-gradient(180deg,transparent 33px,rgba(196,115,90,.55) 33px,rgba(196,115,90,.55) 34.5px,transparent 34.5px),' + c[0] + ' !important}' +
      D + ' .priv-list li:nth-child(' + (i + 1) + ')::before{background:' + u(c[2]) + ' center/19px no-repeat,' + c[1] + ' !important}';
  });
  function on() { var h = document.documentElement; return h.getAttribute('data-htheme') === 'paper' && h.getAttribute('data-view') === 'home'; }
  function note(p) {
    var n = p.querySelector('#privNote'); if (!n) return;
    var t = (n.textContent || '').trim(), ok = /^(ลบผลตรวจแล้ว|Deleted|已删除)/.test(t);
    n.classList.toggle('pz-ok', !!t && ok); n.classList.toggle('pz-err', !!t && !ok);
    p.classList.toggle('pz-delok', !!t && ok);
  }
  function dress() {
    var p = document.getElementById('privPanel'); if (!p || p.querySelector(':scope > .pzpv-big')) return !!p;
    p.insertAdjacentHTML('afterbegin', '<span class="pzpv-big" aria-hidden="true">ไม่เก็บ<br>สัญญาต้นฉบับ<small>VELLUM CHECK</small></span>');
    var n = p.querySelector('#privNote'); if (n) new MutationObserver(function () { note(p); }).observe(n, { childList: true, characterData: true, subtree: true });
    return true;
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-priv')) { var s = document.createElement('style'); s.id = 'pz-priv'; s.textContent = css; document.head.appendChild(s); }
    if (dress()) return;
    var k = 0, iv = setInterval(function () { if (dress() || ++k > 60) clearInterval(iv); }, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZPRIV*/

/*PZHELP*/ /* ธีมตัดกระดาษ: แผ่นช่วยเหลือ "ติดตรงไหนครับ?" (.vhp จาก help-ui.js)
   พื้นคราฟต์ขอบซิกแซก · หัว = ป้ายเขียวกรอบทอง + น้องเวลลัม + ปุ่ม X ในป้าย
   "ใช้ยังไง?" การ์ดครีม เลข 3 ขั้นคนละสี · ปัญหา 6 เรื่อง = แฟ้มมีหู 6 สี (หูเขียนหมวด) · ไอคอนรูปตัดกระดาษหลายชั้นบนวงกลมสี
   "เจอบ่อย" = ตรายางอิฐ · ลูกศร = มุมพับ · "ส่งข้อความหาเรา" = ซองจดหมาย ต่อท้ายรายการ (ไม่ลอยทับ) + ตั๋วทอง
   หน้าวิธีแก้: ป้ายหัวเขียว · ขั้นตอน = โน้ตครีม เลขบนเหรียญตราขอบหยัก 3 สี + เส้นประเชื่อม · ปุ่มหลักตั๋วทอง */
(function () {
  'use strict';
  if (window.__pzHelp) return; window.__pzHelp = 1;
  var V = 'html[data-htheme="paper"][data-view="home"] body .vhp';
  function zig(n, d, top) { var a = [], i; for (i = 0; i <= n; i++) a.push((i * 100 / n).toFixed(2) + '% ' + (top ? (i % 2 ? '0' : d + 'px') : (i % 2 ? '100%' : 'calc(100% - ' + d + 'px)'))); return top ? 'polygon(' + a.join(',') + ',100% 100%,0 100%)' : 'polygon(0 0,100% 0,' + a.reverse().join(',') + ')'; }
  function u(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")'; }
  var X = ':not(#pz0):not(#pz1)';
  var FIB = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Cg fill='none' stroke='%237a5a30' stroke-opacity='.14' stroke-width='.8'%3E%3Cpath d='M10 20q20 6 34-2M80 64q14 10 30 4M150 30q18-8 32 2M30 96q12-6 26 0M190 90q10 8 24 2M120 104q16 4 28-6'/%3E%3C/g%3E%3C/svg%3E\")";
  var S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"';
  var IC = {
    start: '<svg ' + S + '><rect x="9" y="8" width="24" height="31" rx="2" fill="#f6ecd6"/><path d="M13 15h14M13 20h14M13 25h9" stroke="#c9b48a" stroke-width="2" stroke-linecap="round"/><path d="M20 38l3-9 13-13 6 6-13 13z" fill="#7d3a2c"/><path d="M19 37l3-9 13-13 6 6-13 13z" fill="#c4735a"/><path d="M19 37l3-9 5 5z" fill="#f2d48a"/></svg>',
    login: '<svg ' + S + '><circle cx="18.5" cy="28.5" r="11" fill="#7d3a2c"/><circle cx="17" cy="27" r="11" fill="#f2d48a"/><circle cx="17" cy="27" r="4.5" fill="#c4735a"/><path d="M25 21l13-13 4 4-3 3 3 3-3 3-3-3-6 6z" fill="#f2d48a" stroke="#7d3a2c" stroke-width="1.2"/></svg>',
    file: '<svg ' + S + '><path d="M15 9h16l8 8v27H15z" fill="#2f4f57"/><path d="M13 7h16l8 8v27H13z" fill="#f6ecd6"/><path d="M29 7v8h8z" fill="#c9b48a"/><path d="M17 21h15M17 26h15M17 31h10" stroke="#5f7f88" stroke-width="2.2" stroke-linecap="round"/><circle cx="34" cy="36" r="7" fill="#c4735a"/><path d="M34 32.5v4M34 38.5v.6" stroke="#f6ecd6" stroke-width="2.2" stroke-linecap="round"/></svg>',
    stuck: '<svg ' + S + '><rect x="12" y="6" width="24" height="5" rx="2" fill="#6e4f22"/><rect x="12" y="37" width="24" height="5" rx="2" fill="#6e4f22"/><path d="M15 11h18c0 8-7 9-7 13s7 5 7 13H15c0-8 7-9 7-13s-7-5-7-13z" fill="#f6ecd6"/><path d="M18 14h12c-1 4-6 6-6 8 0-2-5-4-6-8z" fill="#d1a54a"/><path d="M17 36c1-4 4-6 7-6s6 2 7 6z" fill="#d1a54a"/></svg>',
    pay: '<svg ' + S + '><rect x="8" y="15" width="34" height="23" rx="3" fill="#2c4a3f"/><rect x="6" y="13" width="34" height="23" rx="3" fill="#f6ecd6"/><rect x="6" y="18" width="34" height="5" fill="#5f8a6f"/><rect x="10" y="27" width="7" height="5" rx="1" fill="#d1a54a"/><path d="M21 30h12" stroke="#a9997a" stroke-width="2" stroke-linecap="round"/><circle cx="38" cy="12" r="7" fill="#c4735a"/><path d="M35 12h6M38 9v6" stroke="#f6ecd6" stroke-width="2" stroke-linecap="round"/></svg>',
    read: '<svg ' + S + '><path d="M8 8h20v28H8z" fill="#f6ecd6"/><path d="M12 14h12M12 19h12M12 24h8" stroke="#e2a08c" stroke-width="2.4" stroke-linecap="round"/><circle cx="29" cy="27" r="10" fill="#c6d3d3" fill-opacity=".85" stroke="#6e3f30" stroke-width="3.5"/><path d="M36.5 34.5l7 7" stroke="#6e3f30" stroke-width="5" stroke-linecap="round"/><path d="M24 23a6 6 0 0 1 5-3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    hist: '<svg ' + S + '><path d="M8 15h13l3 4h20v22H8z" fill="#4a3720"/><path d="M6 13h13l3 4h20v22H6z" fill="#d1a54a"/><rect x="11" y="9" width="24" height="16" rx="1" fill="#f6ecd6" transform="rotate(-6 23 17)"/><rect x="14" y="11" width="24" height="16" rx="1" fill="#e6d7b9" transform="rotate(4 26 19)"/><path d="M6 21h36v18H6z" fill="#e4b95a"/><path d="M19 30h10" stroke="#6e4f22" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
  var C = { start: ['#2c5b55'], login: ['#e2c6b6', '#c4735a', 'บัญชี', 'Account', '账户'], file: ['#c6d3d3', '#5f7f88', 'ไฟล์', 'Files', '文件'], stuck: ['#e4d3a6', '#a9843a', 'การตรวจ', 'Checking', '检查'], pay: ['#cdd6c0', '#5f8a6f', 'ชำระเงิน', 'Payment', '付款'], read: ['#ecd2c8', '#b06a55', 'ผลตรวจ', 'Results', '结果'], hist: ['#e6d7b9', '#8a6c42', 'ประวัติ', 'History', '历史'] };
  var TITLE = { 'ใช้ยังไง?': 'start', 'เข้าสู่ระบบไม่ได้': 'login', 'ใส่ไฟล์ไม่ได้': 'file', 'กดตรวจแล้วไม่ขึ้นผล': 'stuck', 'จ่ายเงินแล้วเครดิตไม่เข้า': 'pay', 'อ่านผลไม่เข้าใจ': 'read', 'หาผลตรวจเก่าไม่เจอ': 'hist' };
  var DK = 'color:#2e2112 !important;-webkit-text-fill-color:#2e2112 !important;text-shadow:none !important;';
  var MD = 'color:#3d2e1a !important;-webkit-text-fill-color:#3d2e1a !important;text-shadow:none !important;';
  var BANNER = 'background:linear-gradient(180deg,#2c5b55,#224a45) !important;clip-path:' + zig(34, 6, false) + ';box-shadow:none !important;border:0 !important;border-radius:0 !important;';
  var XBTN = 'width:34px !important;height:34px !important;min-width:0 !important;padding:0 !important;border:0 !important;border-radius:50% !important;background:rgba(18,48,44,.55) !important;box-shadow:inset 0 0 0 1.5px #b8964e,inset 0 0 0 5px rgba(18,48,44,.55),inset 0 0 0 6px rgba(216,184,106,.45) !important;';
  var SCALLOP = 'polygon(100.0% 50.0%,92.2% 58.4%,96.2% 69.1%,85.8% 73.9%,85.4% 85.4%,73.9% 85.8%,69.1% 96.2%,58.4% 92.2%,50.0% 100.0%,41.6% 92.2%,30.9% 96.2%,26.1% 85.8%,14.6% 85.4%,14.2% 73.9%,3.8% 69.1%,7.8% 58.4%,0.0% 50.0%,7.8% 41.6%,3.8% 30.9%,14.2% 26.1%,14.6% 14.6%,26.1% 14.2%,30.9% 3.8%,41.6% 7.8%,50.0% 0.0%,58.4% 7.8%,69.1% 3.8%,73.9% 14.2%,85.4% 14.6%,85.8% 26.1%,96.2% 30.9%,92.2% 41.6%)';
  var css =
    V + ' .vhp-bg{background:rgba(20,14,8,.6) !important}' +
    V + ' .vhp-panel{background:' + FIB + ',linear-gradient(180deg,#ad8f64,#9d8057) !important;border:0 !important;border-radius:0 !important;clip-path:' + zig(50, 10, true) + ';box-shadow:0 -10px 30px rgba(0,0,0,.35) !important;color:#2e2112 !important}' +
    V + ' .vhp-panel::before{background:#5e472a !important;opacity:.55;top:16px !important}' +
    /* หัวหน้าแรก + หัวหน้าวิธีแก้ */
    V + ' .vhp-hd,' + V + ' .vhp-dh{position:sticky !important;top:0;z-index:2;margin:0 -16px 6px !important;padding:28px 16px 6px !important;background:linear-gradient(180deg,#a68860 70%,rgba(166,136,96,0)) !important;box-shadow:none !important;border:0 !important}' +
    V + ' .vhp-hd,' + V + ' .vhp-dh{display:block !important}' + V + ' .vhp-dh > .pzh-bn{gap:10px !important}' +
    '.pzh-bn{display:contents}' +
    V + ' .vhp-hd > .pzh-bn,' + V + ' .vhp-dh > .pzh-bn{position:relative;display:flex;align-items:center;gap:12px;padding:12px 56px 18px 10px;' + BANNER + 'filter:drop-shadow(2px 3px 0 #7d6233)}' +
    V + ' .pzh-bn::before{content:"";position:absolute;inset:5px 5px 11px;border:1px solid rgba(184,150,78,.75);pointer-events:none}' +
    V + ' .pzh-bn h2{margin:0 !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;text-shadow:none !important;font-weight:800 !important;font-size:18px !important;line-height:1.3 !important}' +
    V + ' .vhp-dh .pzh-bn h2{font-size:16px !important}' +
    V + ' .pzh-bn p{margin:2px 0 0 !important;color:#cbd9cf !important;-webkit-text-fill-color:#cbd9cf !important;font-size:11.5px !important}' +
    V + ' .pzh-bn .vhp-hm{flex:0 0 54px;width:54px !important;height:auto !important;margin:0 !important;background:none !important;box-shadow:none !important}' +
    V + ' .pzh-bn .vhp-hm svg{width:54px !important;height:64px !important}' +
    V + ' .vhp-panel > .vhp-x' + X + '{position:absolute !important;z-index:5 !important;top:41px !important;right:28px !important;left:auto !important;margin:0 !important;' + XBTN + '}' +
    V + ' .vhp-panel > .vhp-x' + X + ' svg{stroke:#efe3ca !important;width:15px !important;height:15px !important}' +
    V + ' .vhp-back' + X + '{flex:0 0 34px;' + XBTN + 'display:flex !important;align-items:center;justify-content:center}' +
    V + ' .vhp-back' + X + ' svg{stroke:#efe3ca !important;width:16px !important;height:16px !important}' +
    V + ' .vhp-dic{flex:0 0 44px !important;width:44px !important;height:44px !important;border:0 !important;border-radius:50% !important;background:#a9843a !important;box-shadow:0 0 0 2px rgba(216,184,106,.6) !important;display:flex !important;align-items:center;justify-content:center;background-position:center !important;background-size:34px !important;background-repeat:no-repeat !important}' +
    V + ' .vhp-dic[data-pz] svg{display:none !important}' + V + ' .vhp-dic svg{stroke:#efe3ca !important}' +
    /* การ์ด */
    V + ' .vhp-grid{gap:24px 12px !important;padding-top:4px}' +
    V + ' .vhp-card{position:relative !important;overflow:visible !important;border:0 !important;border-radius:0 5px 5px 5px !important;box-shadow:2px 3px 0 #7d6233 !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;padding:14px 12px 18px !important;' + DK + '}' +
    V + ' .vhp-card::after{display:none !important}' +
    V + ' .vhp-card:hover{transform:translateY(-1px) !important;box-shadow:2px 4px 0 #7d6233 !important}' +
    V + ' .vhp-card:active{transform:translateY(2px) !important;box-shadow:0 1px 0 #7d6233 !important}' +
    V + ' .vhp-card:focus-visible{outline:2px solid #2c5b55 !important;outline-offset:3px !important}' +
    V + ' .vhp-card::before{position:absolute !important;left:0 !important;top:-18px !important;right:auto !important;bottom:auto !important;width:auto !important;height:19px !important;padding:0 10px !important;border-radius:5px 8px 0 0 !important;display:flex !important;align-items:center;font:800 10px/1 Prompt,sans-serif !important;color:#2e2112 !important;opacity:1 !important;border:0 !important;box-shadow:none !important;-webkit-mask:none !important;mask:none !important;transform:none !important}' +
    V + ' .vhp-card.is-wide{border-radius:4px !important;background:' + FIB + ',linear-gradient(180deg,#f3e9d4,#eadcbe) !important;padding:12px !important;margin-bottom:6px}' +
    V + ' .vhp-card.is-wide::before{display:none !important}' +
    V + ' .vhp-ic{width:56px !important;height:56px !important;min-width:56px;border:0 !important;border-radius:50% !important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.18),2px 3px 0 rgba(60,40,20,.35) !important;background-position:center !important;background-size:42px !important;background-repeat:no-repeat !important}' +
    V + ' .vhp-ic svg{display:none !important}' + V + ' .vhp-ic::before,' + V + ' .vhp-ic::after{display:none !important}' +
    V + ' .vhp-card.is-wide .vhp-ic{width:54px !important;height:54px !important;background-size:40px !important}' +
    V + ' .vhp-ct b{' + DK + 'font-weight:800 !important;font-size:14px !important}' +
    V + ' .vhp-ct small{' + MD + 'font-size:11px !important;opacity:1 !important}' +
    V + ' .vhp-3 i{' + MD + 'font-size:11.5px !important;font-style:normal}' +
    V + ' .vhp-3 em{background:#c4735a !important;color:#efe3ca !important;-webkit-text-fill-color:#efe3ca !important;box-shadow:none !important;border:0 !important;font-style:normal}' +
    V + ' .vhp-3 i:nth-child(2) em{background:#5f7f88 !important}' + V + ' .vhp-3 i:nth-child(3) em{background:#5f8a6f !important}' +
    V + ' .vhp-hot{position:absolute !important;right:8px !important;top:8px !important;left:auto !important;padding:1px 6px !important;border:2px solid rgba(160,70,50,.85) !important;border-radius:3px !important;background:rgba(246,236,214,.35) !important;box-shadow:none !important;color:rgba(160,70,50,.95) !important;-webkit-text-fill-color:rgba(160,70,50,.95) !important;font:900 10px/1.3 Prompt,sans-serif !important;transform:rotate(-10deg) !important;text-shadow:none !important}' +
    V + ' .vhp-card .vhp-go{position:absolute !important;right:0 !important;bottom:0 !important;left:auto !important;top:auto !important;width:22px !important;height:22px !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 0 5px 0 !important;background:linear-gradient(135deg,transparent 50%,rgba(0,0,0,.18) 50%,rgba(0,0,0,.18) 56%,#efe3ca 56%) !important;box-shadow:none !important;color:#5e472a !important;-webkit-text-fill-color:#5e472a !important;font:900 13px/1 Prompt,sans-serif !important;display:flex !important;align-items:flex-end;justify-content:flex-end;padding:0 3px 2px 0 !important}' +
    V + ' .vhp-card.is-wide .vhp-go{display:none !important}' +
    /* ซองจดหมาย */
    V + ' .vhp-mailbar{position:static !important;margin:18px 0 0 !important;padding:0 0 calc(18px + env(safe-area-inset-bottom,0px)) !important;background:none !important;border:0 !important;box-shadow:none !important}' +
    V + ' .vhp-mail{position:relative !important;display:flex !important;align-items:center;gap:10px;margin:0 !important;padding:14px 120px 12px 14px !important;border:0 !important;border-radius:0 !important;background:linear-gradient(160deg,transparent 49%,rgba(94,71,42,.18) 50%,transparent 51%) 0 0/50% 40px no-repeat,linear-gradient(200deg,transparent 49%,rgba(94,71,42,.18) 50%,transparent 51%) 100% 0/50% 40px no-repeat,#efe3ca !important;box-shadow:2px 3px 0 #7d6233 !important;text-align:left !important;' + MD + '}' +
    V + ' .vhp-mail .vhp-mi,' + V + ' .vhp-mail .vhp-go{display:none !important}' +
    V + ' .vhp-mail b{' + DK + 'font-size:14px !important;text-decoration:none !important}' +
    V + ' .vhp-mail span{' + MD + '}' +
    V + ' .vhp-mail::after{content:"\\0E2A\\0E48\\0E07\\0E02\\0E49\\0E2D\\0E04\\0E27\\0E32\\0E21";position:absolute;right:12px;top:50%;transform:translateY(-50%);padding:10px 12px;border-radius:4px;background:radial-gradient(circle 2.5px at 0 50%,#efe3ca 95%,transparent) 0 0/6px 9px repeat-y,radial-gradient(circle 2.5px at 100% 50%,#efe3ca 95%,transparent) 100% 0/6px 9px repeat-y,#d1a54a;box-shadow:2px 3px 0 #6e4f22;color:#2e2112;font:800 12.5px/1 Prompt,sans-serif;white-space:nowrap}' +
    'html[data-lang="en"]' + V.slice(4) + ' .vhp-mail::after{content:"Send"}' + 'html[data-lang="zh"]' + V.slice(4) + ' .vhp-mail::after{content:"\\53D1\\9001"}' +
    /* หน้าวิธีแก้ */
    V + ' .vhp-steps{padding:0 !important;margin:8px 0 0 !important}' +
    V + ' .vhp-steps::before,' + V + ' .vhp-steps::after{display:none !important}' +
    V + ' .vhp-steps li{position:relative !important;display:block !important;margin:0 0 16px !important;padding:12px 12px 12px 70px !important;min-height:74px;background:#fbf4e4 !important;box-shadow:1px 3px 0 #7d6233 !important;border:0 !important;border-radius:0 !important}' +
    V + ' .vhp-steps li:nth-child(odd){rotate:-.5deg}' + V + ' .vhp-steps li:nth-child(even){rotate:.5deg}' +
    V + ' .vhp-steps li::before,' + V + ' .vhp-steps li::after{display:none !important}' +
    V + ' .vhp-steps li + li::after{content:"" !important;display:block !important;position:absolute !important;left:34px !important;top:-18px !important;height:20px !important;width:0 !important;border-left:2.5px dashed #5e472a !important;background:none !important}' +
    V + ' .vhp-steps li > div{padding:0 !important;background:none !important;border:0 !important;box-shadow:none !important}' +
    V + ' .vhp-st{' + DK + 'font-weight:800 !important;font-size:14px !important}' +
    V + ' .vhp-steps li > div > span{' + MD + 'font-size:12px !important}' +
    V + ' .vhp-steps li > div > span b{background:linear-gradient(180deg,transparent 40%,rgba(127,161,132,.55) 40%,rgba(127,161,132,.55) 90%,transparent 90%) !important;' + DK + '}' +
    V + ' .vhp-n{position:absolute !important;left:10px !important;top:50% !important;width:50px !important;height:50px !important;margin:-25px 0 0 !important;padding:0 !important;isolation:isolate;display:flex !important;align-items:center;justify-content:center;border:0 !important;border-radius:0 !important;background:none !important;box-shadow:none !important;--c:#c4735a;--d:#8a3a2a;color:var(--d) !important;-webkit-text-fill-color:var(--d) !important;font:900 24px/1 Prompt,sans-serif !important;text-shadow:none !important}' +
    V + ' .vhp-steps li:nth-child(3n+2) .vhp-n{--c:#5f7f88;--d:#2f4f57}' + V + ' .vhp-steps li:nth-child(3n) .vhp-n{--c:#5f8a6f;--d:#2c4a3f}' +
    V + ' .vhp-n::before{content:"" !important;position:absolute !important;inset:0 !important;z-index:-2;background:var(--c) !important;clip-path:' + SCALLOP + ';filter:drop-shadow(1px 2px 0 rgba(60,40,20,.4));border:0 !important;border-radius:0 !important;width:auto !important;height:auto !important}' +
    V + ' .vhp-n::after{content:"" !important;position:absolute !important;inset:8px !important;z-index:-1;border-radius:50% !important;background:#f6ecd6 !important;box-shadow:inset 0 0 0 1.5px var(--c),inset 0 0 0 3.5px #f6ecd6,inset 0 0 0 4.5px rgba(94,71,42,.3) !important;width:auto !important;height:auto !important}' +
    V + ' .vhp-note{background:#e6d7b9 !important;border:0 !important;border-radius:3px !important;box-shadow:1px 2px 0 #7d6233 !important;' + MD + '}' +
    V + ' .vhp-btn{position:relative !important;border:0 !important;border-radius:4px !important;background:radial-gradient(circle 2.5px at 0 50%,#a68860 95%,transparent) 0 0/6px 9px repeat-y,radial-gradient(circle 2.5px at 100% 50%,#a68860 95%,transparent) 100% 0/6px 9px repeat-y,#d1a54a !important;box-shadow:2px 3px 0 #6e4f22 !important;' + DK + 'font-weight:800 !important}' +
    V + ' .vhp-btn.is-ghost{background:#efe3ca !important;box-shadow:2px 3px 0 #7d6233 !important}' +
    V + ' .vhp-fb{border-top:0 !important;' + DK + '}' + V + ' .vhp-fb > span{' + DK + 'font-weight:700 !important}' + V + ' .vhp-fb > span::before{content:"\\2702  ";color:#7d3a2c}' +
    V + ' .vhp-chip{position:relative !important;border:0 !important;border-radius:4px !important;background:#efe3ca !important;box-shadow:1px 2px 0 #7d6233,inset 0 0 0 3px #efe3ca,inset 0 0 0 4.5px rgba(94,71,42,.3) !important;' + DK + 'font-weight:700 !important}' +
    V + ' .vhp-chip[data-ok]{background:#cdd6c0 !important;box-shadow:1px 2px 0 #7d6233,inset 0 0 0 3px #cdd6c0,inset 0 0 0 4.5px rgba(44,74,63,.3) !important}' +
    V + ' .vhp-thx h2,' + V + ' .vhp-thx p{' + DK + '}' +
    '@media (prefers-reduced-motion:reduce){' + V + ' .vhp-card{transition:none !important}}';
  Object.keys(IC).forEach(function (k) {
    var c = C[k];
    css += V + ' .vhp-card[data-tp="' + k + '"] .vhp-ic{background-color:' + (c[1] || c[0]) + ' !important;background-image:' + u(IC[k]) + ' !important}' +
      V + ' .vhp-dic[data-pz="' + k + '"]{background-image:' + u(IC[k]) + ' !important;background-color:' + (c[1] || c[0]) + ' !important}';
    if (c[1]) css += V + ' .vhp-card[data-tp="' + k + '"]{background:' + FIB + ',' + c[0] + ' !important}' +
      V + ' .vhp-card[data-tp="' + k + '"]::before{content:"' + c[2] + '" !important;background:' + c[0] + ' !important}' +
      'html[data-lang="en"]' + V.slice(4) + ' .vhp-card[data-tp="' + k + '"]::before{content:"' + c[3] + '" !important}' +
      'html[data-lang="zh"]' + V.slice(4) + ' .vhp-card[data-tp="' + k + '"]::before{content:"' + c[4] + '" !important}';
  });
  var lastTp = null;
  function dress(w) {
    if (!w) return;
    var hd = w.querySelector('.vhp-hd'); if (hd && !hd.querySelector('.pzh-bn')) { var b = document.createElement('div'); b.className = 'pzh-bn'; while (hd.firstChild) b.appendChild(hd.firstChild); hd.appendChild(b); }
    var dh = w.querySelector('.vhp-dh'); if (dh && !dh.querySelector('.pzh-bn')) { var b2 = document.createElement('div'); b2.className = 'pzh-bn'; while (dh.firstChild) b2.appendChild(dh.firstChild); dh.appendChild(b2); }
    var di = w.querySelector('.vhp-dic'); if (di && !di.hasAttribute('data-pz')) { var h = w.querySelector('.vhp-dh h2'), id = (h && TITLE[(h.textContent || '').trim()]) || lastTp; if (id && IC[id]) di.setAttribute('data-pz', id); }
  }
  function go() {
    if (document.documentElement.getAttribute('data-htheme') !== 'paper') return;
    if (!document.getElementById('pz-help')) { var s = document.createElement('style'); s.id = 'pz-help'; s.textContent = css; document.head.appendChild(s); }
    document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('.vhp [data-tp]'); if (t) lastTp = t.getAttribute('data-tp'); }, true);
    var hooked = null;
    function hook() { var w = document.querySelector('.vhp'); if (!w || w === hooked) return; hooked = w; var v = w.querySelector('.vhp-view'); new MutationObserver(function () { dress(w); }).observe(v || w, { childList: true }); dress(w); }
    hook(); new MutationObserver(hook).observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
/*/PZHELP*/
