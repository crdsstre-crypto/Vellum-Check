/* =========================================================
   art/field.js: บรรยากาศของหน้าแรก (ภาพต้นฉบับของ Vellum ไม่คัดลอกจากเว็บใด)
   1) ผืนแคนวาสในฉากเปิด: แสงเงินเฉียงจางสองแนว กับฝุ่นลอยในแสงแบบมีชั้นความลึก (ตอบสนองเมาส์และการเลื่อน)
      - วาดเฉพาะตอนฉากเปิดอยู่ในจอ และหยุดเมื่อแท็บถูกซ่อน  ปรับ DPR ไม่เกิน 1.5
      - โหมดลดการเคลื่อนไหว: วาดภาพนิ่งเฟรมเดียว
   2) พื้นผิวจุดฝุ่นและเส้นใยแบบกระดาษ: สร้างครั้งเดียวด้วย canvas แล้วคลุมทั้งหน้าที่ body::before (ดู art/finish.css)
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- 2) พื้นผิวจุดฝุ่น ---------- */
  function specks() {
    try {
      var S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
      var g = c.getContext('2d'); if (!g) return;
      var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      function blob(col, n, rmin, rmax) {
        g.fillStyle = col;
        for (var i = 0; i < n; i++) {
          var x = rnd() * S, y = rnd() * S, r = rmin + rnd() * (rmax - rmin);
          g.save(); g.translate(x, y); g.rotate(rnd() * 3.14); g.scale(1, .45 + rnd() * .55);
          g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore();
        }
      }
      function fibers(col, n) {
        g.strokeStyle = col; g.lineWidth = .8; g.lineCap = 'round';
        for (var i = 0; i < n; i++) {
          var x = rnd() * S, y = rnd() * S, a = rnd() * 6.283, l = 6 + rnd() * 16;
          g.beginPath(); g.moveTo(x, y);
          g.quadraticCurveTo(x + Math.cos(a) * l * .6 + rnd() * 5, y + Math.sin(a) * l * .6 + rnd() * 5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
        }
      }
      blob('rgba(0,0,0,.5)', 150, .5, 2.4);          /* จุดเข้ม: เห็นบนพื้นกระดาษ (บนชาร์โคลแทบมองไม่เห็น) */
      blob('rgba(236,233,226,.30)', 130, .5, 2.0);   /* จุดสว่าง: เห็นบนพื้นเข้ม (บนกระดาษแทบมองไม่เห็น) */
      fibers('rgba(0,0,0,.35)', 26);
      fibers('rgba(236,233,226,.22)', 22);
      root.style.setProperty('--specks', 'url(' + c.toDataURL('image/png') + ')');
      root.classList.add('vc-specks');
    } catch (e) { /* ไม่มีพื้นผิวก็ไม่กระทบการใช้งาน */ }
  }
  specks();

  /* ---------- 1) ผืนแคนวาสฉากเปิด ---------- */
  function field() {
    var hero = document.querySelector('main > .hero');
    if (!hero) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero-field'; cv.setAttribute('aria-hidden', 'true');
    hero.insertBefore(cv, hero.firstChild);
    var g = cv.getContext('2d'); if (!g) return;
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var W = 0, H = 0, dpr = 1, parts = [], running = false, inView = true, t0 = performance.now();
    var small = window.innerWidth < 768;

    function size() {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = small ? 28 : 64;
      parts = [];
      var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var i = 0; i < n; i++) parts.push({ x: rnd() * W, y: rnd() * H, z: .25 + rnd() * .75, r: .5 + rnd() * 1.7, vy: -(.012 + rnd() * .03), ph: rnd() * 6.283, sp: .4 + rnd() * .9 });
    }
    function beam(cx, w, a, sway) {
      var grd = g.createLinearGradient(cx - w, 0, cx + w, 0);
      grd.addColorStop(0, 'rgba(217,219,223,0)'); grd.addColorStop(.5, 'rgba(217,219,223,' + a + ')'); grd.addColorStop(1, 'rgba(217,219,223,0)');
      g.save(); g.translate(cx, -H * .1); g.rotate(.32 + sway); g.translate(-cx, 0);
      g.fillStyle = grd; g.fillRect(cx - w, 0, w * 2, H * 1.6); g.restore();
    }
    function draw(now) {
      var t = (now - t0) / 1000, P = window.VCPointer || { x: 0, y: 0 };
      var sc = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, H)));
      g.clearRect(0, 0, W, H);
      beam(W * .72, W * .07, .055, Math.sin(t * .18) * .015 + P.x * .02);
      beam(W * .9, W * .045, .035, Math.sin(t * .13 + 1) * .012 + P.x * .015);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var x = p.x + Math.sin(t * .25 * p.sp + p.ph) * 14 * p.z - P.x * 46 * p.z;
        var y = p.y + t * p.vy * H * .16 - sc * 90 * p.z - P.y * 28 * p.z;
        y = ((y % (H + 20)) + (H + 20)) % (H + 20) - 10;
        var inBeam = Math.max(0, 1 - Math.abs(x - (W * .72 + (y - H * .1) * -.33)) / (W * .12));
        var tw = .55 + .45 * Math.sin(t * p.sp * 1.4 + p.ph);
        var a = (.1 + .4 * inBeam) * p.z * tw;
        g.fillStyle = 'rgba(236,233,226,' + a.toFixed(3) + ')';
        g.beginPath(); g.arc(x, y, p.r * p.z * 1.2, 0, 6.283); g.fill();
      }
    }
    function loop(now) { if (!running) return; draw(now); requestAnimationFrame(loop); }
    function go() {
      var reduced = mq && mq.matches;
      if (reduced) { running = false; draw(t0 + 4000); return; }
      if (!running && inView && !document.hidden) { running = true; requestAnimationFrame(loop); }
    }
    size(); draw(performance.now()); go();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (!inView) running = false; else go(); }, { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else go(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { small = window.innerWidth < 768; size(); draw(performance.now()); }, 150); });
    if (mq) { var h = function () { if (mq.matches) { running = false; draw(t0 + 4000); } else go(); }; if (mq.addEventListener) mq.addEventListener('change', h); else if (mq.addListener) mq.addListener(h); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', field); else field();
})();
