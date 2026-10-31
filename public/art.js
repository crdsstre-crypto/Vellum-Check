/* art.js: รวมจาก art-motion, art-cursor, art-scene, art-field (ตามลำดับ) แต่ละส่วนเป็นฟังก์ชันแยกของตัวเอง */

/* ===== (จาก art-motion.js) ===== */
/* =========================================================
   art/motion.js: โครงระบบการเคลื่อนไหวของ Vellum (ไม่พึ่งไลบรารี ไม่ยึดการเลื่อนของเบราว์เซอร์)
   - VCMotion.reduced        true เมื่อผู้ใช้ตั้ง prefers-reduced-motion
   - html[data-motion]       "reduced" | "full" (อัปเดตเมื่อผู้ใช้เปลี่ยนการตั้งค่า)
   - html.vc-motion          เติมเมื่อเล่นอนิเมชันได้ (มี IntersectionObserver และไม่ลดการเคลื่อนไหว)
                             CSS จะซ่อน [data-reveal] เฉพาะเมื่อมี class นี้ จึงไม่มีเนื้อหาหายถ้า JS ล้ม
   - [data-reveal]           เมื่อเข้าจอ เติม .is-in  (ตัวเลือก: style="--i:2" เพื่อหน่วงตามลำดับ)
   - [data-split="lines"]    ห่อข้อความเป็นบรรทัด/คำ เพื่อเปิดทีละบรรทัด (ตัดคำไทยด้วย Intl.Segmenter)
   - [data-scene]            เขียนค่า --p (0..1) ตามความคืบหน้าการเลื่อนผ่านองค์ประกอบ (ใช้ rAF เฉพาะตอนอยู่ในจอ)
                             เพิ่ม data-pin = ฉากตรึงจอ (องค์ประกอบสูงกว่าจอ แล้วเนื้อหา position:sticky)
                             data-scene="exit" = 0 เมื่ออยู่บนสุด → 1 เมื่อเลื่อนพ้นไป (ใช้ทำพาราแลกซ์ตอนออก)
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var hasIO = 'IntersectionObserver' in window;

  var api = { reduced: !!(mq && mq.matches) };
  window.VCMotion = api;

  function applyMode() {
    api.reduced = !!(mq && mq.matches);
    root.setAttribute('data-motion', api.reduced ? 'reduced' : 'full');
    root.classList.toggle('vc-motion', !api.reduced && hasIO);
    if (api.reduced) revealAll();
  }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', applyMode);
    else if (mq.addListener) mq.addListener(applyMode);
  }

  /* ---- แยกข้อความเป็นคำ/บรรทัด (ภาษาไทยไม่มีช่องว่างคั่นคำ ใช้ Intl.Segmenter กันสระและวรรณยุกต์แตก) ---- */
  function segmentWords(text) {
    if (window.Intl && Intl.Segmenter) {
      var seg = new Intl.Segmenter('th', { granularity: 'word' });
      return Array.from(seg.segment(text), function (s) { return s.segment; });
    }
    return text.split(/(\s+)/);
  }
  api.split = function (el) {
    if (!el || el.getAttribute('data-split-done')) return;
    var text = el.textContent;
    var parts = segmentWords(text), html = '', i = 0;
    /* ข้อความจริงสำหรับโปรแกรมอ่านหน้าจอ (ซ่อนด้วยสายตา) ส่วนคำที่แยกแล้วเป็น aria-hidden */
    html += '<span class="vc-sr" style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">' + text.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span>';
    parts.forEach(function (w) {
      if (/^\s+$/.test(w)) { html += w; return; }
      html += '<span class="vc-word" aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:top"><span style="display:inline-block;transition:transform var(--dur-4) var(--ease-out);transition-delay:calc(' + (i++) + ' * 28ms)">' + w.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span></span>';
    });
    el.innerHTML = html;
    el.setAttribute('data-split-done', '1');
    if (root.classList.contains('vc-motion')) {
      el.querySelectorAll('.vc-word > span').forEach(function (s) { s.style.transform = 'translate3d(0,110%,0)'; });
    }
  };
  function playSplit(el) {
    el.querySelectorAll('.vc-word > span').forEach(function (s) { s.style.transform = 'none'; });
  }

  /* ---- เปิดเผยตอนเลื่อน ---- */
  var io = null;
  function enter(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-split')) playSplit(el);
    if (io) io.unobserve(el);
  }
  function revealAll() {
    document.querySelectorAll('[data-reveal]:not(.is-in),[data-split]:not(.is-in)').forEach(function (el) {
      el.classList.add('is-in');
      if (el.hasAttribute('data-split')) playSplit(el);
    });
  }
  /* เล่นการเปิดเผยของหน้าใหม่ซ้ำทุกครั้งที่เปิดหน้านั้น (ใช้กับระบบหน้า) */
  api.replay = function (scope) {
    (scope || document).querySelectorAll('[data-reveal],[data-split]').forEach(function (el) {
      el.classList.remove('is-in');
      if (el.hasAttribute('data-split')) el.querySelectorAll('.vc-word > span').forEach(function (s) { if (root.classList.contains('vc-motion')) s.style.transform = 'translate3d(0,110%,0)'; });
    });
    api.observe(scope);
  };
  api.observe = function (scope) {
    var els = (scope || document).querySelectorAll('[data-reveal],[data-split]');
    els.forEach(function (el) {
      if (el.hasAttribute('data-split')) api.split(el);
      if (el.classList.contains('is-in')) return;
      if (!root.classList.contains('vc-motion') || !io) { enter(el); return; }
      io.observe(el);
    });
  };

  /* ---- ความคืบหน้าการเลื่อนของฉาก ---- */
  var scenes = [], ticking = false;
  function updateScenes() {
    ticking = false;
    var vh = window.innerHeight || 1;
    scenes.forEach(function (s) {
      if (!s.on) return;
      var r = s.el.getBoundingClientRect();
      var p = s.pin ? -r.top / Math.max(1, r.height - vh)
            : s.exit ? -r.top / Math.max(1, r.height)
            : (vh - r.top) / (r.height + vh);
      p = Math.min(1, Math.max(0, p));
      s.el.style.setProperty('--p', p.toFixed(4));
    });
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(updateScenes); } }
  api.scene = function (el, opts) {
    var s = { el: el, on: false, pin: !!(opts && opts.pin), exit: !!(opts && opts.exit) };
    scenes.push(s);
    if (api.reduced || !hasIO) { el.style.setProperty('--p', s.exit ? '0' : '1'); return s; }
    new IntersectionObserver(function (es) { s.on = es[0].isIntersecting; if (s.on) requestTick(); }, { rootMargin: '10% 0px' }).observe(el);
    return s;
  };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  function init() {
    applyMode();
    if (hasIO) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) enter(e.target); });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    api.observe(document);
    document.querySelectorAll('[data-scene]').forEach(function (el) { api.scene(el, { pin: el.hasAttribute('data-pin'), exit: el.getAttribute('data-scene') === 'exit' }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ===== (จาก art-cursor.js) ===== */
/* =========================================================
   art/cursor.js: การโต้ตอบด้วยเมาส์ของ Vellum (เฉพาะอุปกรณ์ที่มีเมาส์จริง: hover + pointer:fine)
   - วงแหวนกลวงตามหลังลูกศร (ลูกศรเดิมยังอยู่ ไม่ซ่อน) ขยายเมื่อชี้ลิงก์/ปุ่ม และหายไปเมื่ออยู่บนช่องพิมพ์
   - [data-tilt]  เอียงเล็กน้อยตามตำแหน่งเมาส์ (เฉพาะตอนเมาส์อยู่บนองค์ประกอบนั้น)
   - window.VCPointer {x,y}  ตำแหน่งเมาส์ปรับให้นิ่ง (-0.5..0.5) สำหรับพาราแลกซ์ (field.js และ CSS --mx/--my บน .hero)
   - ลิงก์เมนูที่ตรงกับส่วนที่กำลังดูอยู่ได้ class .is-here
   ปิดทั้งหมดเมื่อผู้ใช้ลดการเคลื่อนไหว  ไม่ทำงานบนจอสัมผัส
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;
  var pointer = { x: 0, y: 0 };
  window.VCPointer = pointer;
  window.VCFX = window.VCFX || { hover: 0, pulse: 0 };   /* ตัวส่งสัญญาณไปฉาก 3 มิติ: hover = แตะปุ่มหลัก, pulse = เพิ่งคลิก */

  /* ---- เมนู: ไฮไลต์ลิงก์ของส่วนที่กำลังดู (ทำงานทุกอุปกรณ์) ---- */
  function navHere() {
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.dx-nav a[href^="#"]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var order = ['manifesto', 'introVideo', 'authCard', 'checkCard'];
    var targets = order.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bv = 0;
      order.forEach(function (id) { if ((vis[id] || 0) > bv) { bv = vis[id]; best = id; } });
      links.forEach(function (a) { a.classList.remove('is-here'); a.removeAttribute('aria-current'); });
      if (best && map[best]) { map[best].classList.add('is-here'); map[best].setAttribute('aria-current', 'location'); }
    }, { threshold: [0, .15, .4, .7] });
    targets.forEach(function (t) { io.observe(t); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', navHere); else navHere();

  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  function start() {
    var ring = document.createElement('div');
    ring.className = 'vc-cursor';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<i></i>';
    document.body.appendChild(ring);
    root.classList.add('vc-cursor-on');

    var tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, seen = false;
    var tiltEl = null, tiltT = { x: 0, y: 0 }, tiltC = { x: 0, y: 0 };
    var px = 0, py = 0;               /* ตำแหน่งเมาส์ที่นิ่งแล้ว (พาราแลกซ์) */
    var LINK = 'a,button,summary,select,label[for],[role="button"],[data-cursor]';
    var SNAP = '.dx-cta,.dx-cta-ghost,.dx-nav a,button.primary,button.ghost';          /* วงแหวนล็อกเข้ากับปุ่มเหล่านี้ */
    var HERO_BTN = '.dx-cta,.dx-cta-ghost,.dx-nav a:last-child';                          /* ปุ่มที่ทำให้ฉาก 3 มิติตอบสนอง */
    var MAGNET = '.dx-cta,.dx-cta-ghost,.dx-nav a:last-child';                           /* ปุ่มที่ถูกดูดตามเมาส์ */
    var snapEl = null, mouseX = -999, mouseY = -999, ringSize = { w: 28, h: 28, r: 14 };
    var mags = [].slice.call(document.querySelectorAll(MAGNET)).map(function (el) { return { el: el, x: 0, y: 0, tx: 0, ty: 0, inner: null }; });

    /* ตัวอักษรกลิ้ง: ห่อข้อความของลิงก์ปุ่มด้วยสองชั้น (ชั้นจริง + ชั้นซ้ำที่กลิ้งขึ้นมา) ชั้นซ้ำซ่อนจากโปรแกรมอ่านหน้าจอ */
    [].slice.call(document.querySelectorAll('.dx-cta,.dx-cta-ghost,.dx-nav a')).forEach(function (el) {
      if (el.querySelector('.rl')) return;
      var tn = null;
      for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) { tn = n; break; } }
      if (!tn) return;
      var txt = tn.nodeValue.trim(), w = document.createElement('span');
      w.className = 'rl';
      var a = document.createElement('span'); a.className = 'rl-a'; a.textContent = txt;
      var b = document.createElement('span'); b.className = 'rl-b'; b.setAttribute('aria-hidden', 'true'); b.textContent = txt;
      w.appendChild(a); w.appendChild(b);
      el.replaceChild(w, tn);
      mags.forEach(function (m) { if (m.el === el) m.inner = w; });
    });
    var TEXT = 'input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[contenteditable="true"]';

    function frame() {
      raf = 0;
      var gx = tx, gy = ty;
      if (snapEl) {
        var sr = snapEl.getBoundingClientRect();
        gx = sr.left + sr.width / 2; gy = sr.top + sr.height / 2;
        ringSize.w = sr.width + 16; ringSize.h = sr.height + 16;
        ringSize.r = Math.min(ringSize.h / 2, (parseFloat(getComputedStyle(snapEl).borderTopLeftRadius) || 0) + 8);
      } else { ringSize.w = 28; ringSize.h = 28; ringSize.r = 14; }
      ring.style.setProperty('--rw', ringSize.w.toFixed(1) + 'px'); ring.style.setProperty('--rh', ringSize.h.toFixed(1) + 'px'); ring.style.setProperty('--rr', ringSize.r.toFixed(1) + 'px');
      var magMoving = false;
      for (var mi = 0; mi < mags.length; mi++) {
        var m = mags[mi], mr = m.el.getBoundingClientRect(), cx = mr.left - (m.x), cy = mr.top - (m.y);
        var ccx = cx + mr.width / 2, ccy = cy + mr.height / 2;
        var dxm = mouseX - ccx, dym = mouseY - ccy;
        var near = mouseX > cx - 70 && mouseX < cx + mr.width + 70 && mouseY > cy - 70 && mouseY < cy + mr.height + 70;
        m.tx = near ? Math.max(-14, Math.min(14, dxm * .30)) : 0; m.ty = near ? Math.max(-10, Math.min(10, dym * .30)) : 0;
        m.x += (m.tx - m.x) * .16; m.y += (m.ty - m.y) * .16;
        if (Math.abs(m.tx - m.x) > .05 || Math.abs(m.ty - m.y) > .05) magMoving = true;
        m.el.style.translate = m.x.toFixed(2) + 'px ' + m.y.toFixed(2) + 'px';
        if (m.inner) m.inner.style.translate = (m.x * .18).toFixed(2) + 'px ' + (m.y * .18).toFixed(2) + 'px';
      }
      rx += (gx - rx) * (snapEl ? 0.28 : 0.2); ry += (gy - ry) * (snapEl ? 0.28 : 0.2);
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      px += (pointer.tx - px) * 0.06; py += (pointer.ty - py) * 0.06;
      pointer.x = px; pointer.y = py;
      var hero = document.querySelector('.hero');
      if (hero) { hero.style.setProperty('--mx', px.toFixed(3)); hero.style.setProperty('--my', py.toFixed(3)); }
      tiltC.x += (tiltT.x - tiltC.x) * 0.12; tiltC.y += (tiltT.y - tiltC.y) * 0.12;
      var moving = magMoving || snapEl || Math.abs(gx - rx) > .3 || Math.abs(gy - ry) > .3 || Math.abs(pointer.tx - px) > .001 || Math.abs(pointer.ty - py) > .001 ||
                   Math.abs(tiltT.x - tiltC.x) > .02 || Math.abs(tiltT.y - tiltC.y) > .02;
      if (tiltEl) tiltEl.style.transform = 'perspective(900px) rotateX(' + (-tiltC.y).toFixed(2) + 'deg) rotateY(' + tiltC.x.toFixed(2) + 'deg)';
      if (moving || tiltEl) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    pointer.tx = 0; pointer.ty = 0;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY; mouseX = tx; mouseY = ty;
      if (!seen) { seen = true; rx = tx; ry = ty; ring.classList.add('is-on'); }
      pointer.tx = e.clientX / window.innerWidth - .5; pointer.ty = e.clientY / window.innerHeight - .5;
      var t = e.target && e.target.closest ? e.target : null;
      if (t) {
        var inText = !!t.closest(TEXT);
        ring.classList.toggle('is-text', inText);
        var sn = !inText ? t.closest(SNAP) : null;
        if (sn && sn.disabled) sn = null;
        if (sn && sn.closest('.auth-doc')) sn = null;   /* กระดาษเอียง: กรอบดูดแบบสี่เหลี่ยมตรงจะไม่ตรงกับปุ่ม จึงไม่ดูด */
        snapEl = sn;
        ring.classList.toggle('is-snap', !!sn);
        ring.classList.toggle('is-link', !inText && !sn && !!t.closest(LINK));
        window.VCFX.hover = (sn && sn.matches(HERO_BTN)) ? 1 : 0;
        var tilt = t.closest('[data-tilt]');
        if (tilt) {
          if (tilt !== tiltEl) { if (tiltEl) tiltEl.style.transform = ''; tiltEl = tilt; }
          var r = tilt.getBoundingClientRect();
          tiltT.x = ((e.clientX - r.left) / r.width - .5) * 7;
          tiltT.y = ((e.clientY - r.top) / r.height - .5) * 7;
        } else if (tiltEl) { tiltT.x = 0; tiltT.y = 0; }
      }
      kick();
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      ring.classList.add('is-down');
      var b = e.target && e.target.closest ? e.target.closest(SNAP) : null;
      if (!b || b.disabled || (e.pointerType && e.pointerType !== 'mouse')) return;
      if (b.matches(HERO_BTN)) window.VCFX.pulse = 1;
      burst(e.clientX, e.clientY);
    }, { passive: true });
    /* ประกายไฟกระเด็น + คลื่นวงแหวนตอนคลิกปุ่ม (WAAPI ล้วน ลบตัวเองเมื่อจบ) */
    function burst(x, y) {
      if (!document.body.animate) return;
      var wv = document.createElement('i'); wv.className = 'vc-wave'; wv.style.left = x + 'px'; wv.style.top = y + 'px'; document.body.appendChild(wv);
      var wa = wv.animate([{ transform: 'scale(.4)', opacity: .9 }, { transform: 'scale(7)', opacity: 0 }], { duration: 780, easing: 'cubic-bezier(.16,1,.3,1)' });
      wa.onfinish = function () { wv.remove(); };
      var cols = ['#ece9e2', '#d9dbdf', '#f2b266', '#ff9a3c', '#ffd9a0'];
      for (var k = 0; k < 16; k++) {
        var s = document.createElement('i'); s.className = 'vc-spark';
        s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.background = cols[k % cols.length];
        var sz = 2 + Math.random() * 4; s.style.width = s.style.height = sz + 'px';
        document.body.appendChild(s);
        var ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 110, dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
        var an = s.animate([
          { transform: 'translate(-50%,-50%) translate(0,0) scale(1)', opacity: 1 },
          { transform: 'translate(-50%,-50%) translate(' + (dx * .75).toFixed(1) + 'px,' + (dy * .75).toFixed(1) + 'px) scale(.9)', opacity: 1, offset: .55 },
          { transform: 'translate(-50%,-50%) translate(' + dx.toFixed(1) + 'px,' + (dy + 60 + Math.random() * 50).toFixed(1) + 'px) scale(0)', opacity: 0 }
        ], { duration: 650 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' });
        an.onfinish = (function (el) { return function () { el.remove(); }; })(s);
      }
    }
    window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
    document.addEventListener('pointerleave', function () { ring.classList.remove('is-on'); snapEl = null; mouseX = mouseY = -999; window.VCFX.hover = 0; kick(); });
    document.addEventListener('pointerenter', function () { if (seen) ring.classList.add('is-on'); });
    /* เมื่อเมาส์ออกจากองค์ประกอบเอียง ให้ค่อย ๆ กลับที่เดิมแล้วล้าง transform */
    setInterval(function () {
      if (tiltEl && tiltT.x === 0 && tiltT.y === 0 && Math.abs(tiltC.x) < .05 && Math.abs(tiltC.y) < .05) { tiltEl.style.transform = ''; tiltEl = null; }
    }, 600);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

/* ===== (จาก art-scene.js) — ฉาก 3 มิติ "แผ่นสัญญาลอยในห้องมืด" (ฉบับสัญญา 29 ต.ค. 2026) =====
   ภาพต้นฉบับของ Vellum (WebGL ล้วน ไม่ใช้ไฟล์ภาพ): แผ่นสัญญา 9 แผ่นลอยเอียงในห้องมืด แต่ละแผ่นมีบรรทัดข้อความ
   ไฮไลต์ความเสี่ยง (แดง/เหลือง/ฟ้า) แถบปกปิด เส้นลายเซ็น และตราตรวจแล้วบางแผ่น · พื้นเงาสะท้อนแผ่นสัญญา
   "แว่นขยาย" วงกลมตามเมาส์ (บนมือถือตามนิ้ว หรือเดินวนเองเมื่อไม่มีการแตะ) ขยายบรรทัดที่อยู่ใต้เลนส์
   กล้องขยับตามเมาส์และเดินเข้าห้องตามการเลื่อน · ไม่มี WebGL / ลดการเคลื่อนไหว / context หลุด = ถอยเป็นภาพนิ่งหรือฉากฝุ่น 2 มิติ */
(function () {
  'use strict';
  var root = document.documentElement;
  var NS = 12;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;uniform float uDim;uniform vec2 uLens;uniform float uLensOn;uniform float uLite;uniform float uEx;uniform vec3 uRip;',
    'uniform vec3 uC[12];uniform vec3 uR[12];uniform vec3 uU[12];',
    'const int N=12;',
    'const vec3 L=vec3(-.35,.7,.62);',
    'float gSc;vec3 gFig;vec3 gFire;float gFlick;float gT;',
    'float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float dseg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}',
    'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}',
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){if(uLite>.5&&i>=2)break;s+=a*vn(p);p*=2.03;a*=.5;}return s;}',
    'float sdb(vec2 p,vec2 c,vec2 h,float r){return length(max(abs(p-c)-h+r,0.))-r;}',
    'float msk(float d){return 1.-smoothstep(-.012,.012,d);}',
    'vec3 sky(vec3 rd){',
    '  float h=clamp(rd.y*.5+.5,0.,1.);',
    '  vec3 c=mix(vec3(.050,.052,.060),vec3(.010,.010,.013),h);',
    '  vec3 Ld=normalize(vec3(.30,.34,-1.));float g=max(dot(rd,Ld),0.);',
    '  c+=vec3(.50,.52,.56)*pow(g,5.)*.26;c+=vec3(.90,.92,.96)*pow(g,48.)*.6;',
    '  return c;',
    '}',
    'vec3 sheetCol(float seed,vec2 q){',
    '  vec3 col=vec3(.91,.90,.86);float u=q.x,v=q.y;float ink=0.;vec3 hl=vec3(0.);float hla=0.;',
    '  if(v>.80&&v<.90&&u>-.8&&u<.12)ink=.85;',
    '  float yy=(.70-v)/.068;',
    '  if(yy>0.&&yy<18.&&abs(u)<.8){',
    '    float row=floor(yy);float fy=fract(yy);float r=h21(vec2(seed,row));',
    '    if(r>.10){',
    '      float Ln=.55+.43*h21(vec2(row,seed+3.));float x=(u+.8)/1.6;',
    '      float words=step(.16,fract(x*(9.+6.*r)+r*7.));float inL=step(x,Ln);',
    '      float band=step(.28,fy)*step(fy,.66);',
    '      ink=max(ink,band*words*inL*.80);',
    '      float hv=h21(vec2(seed*1.7,row+11.));float hb=step(.10,fy)*step(fy,.84);',
    '      if(inL>.5&&x>.12){',
    '        if(hv>.935){hl=vec3(.80,.34,.32);hla=.58*hb;}',
    '        else if(hv>.875){hl=vec3(.80,.60,.22);hla=.52*hb;}',
    '        else if(hv>.835){hl=vec3(.36,.58,.74);hla=.46*hb;}',
    '      }',
    '      if(hv<.045&&x>.25&&x<.25+.32*Ln&&band>.5)ink=1.;',
    '    }',
    '  }',
    '  hla*=.82+.18*sin(uTime*2.1+seed*3.7+u*2.);col=mix(col,hl,hla);col=mix(col,vec3(.09,.09,.11),ink);',
    '  col=mix(col,vec3(.16),smoothstep(.006,0.,abs(v+.90))*step(abs(u+.12),.60)*.55);',
    '  float sg=smoothstep(.010,0.,abs(v+.86+.045*sin(u*13.+seed*2.)))*step(.04,u)*step(u,.66);col=mix(col,vec3(.10,.10,.16),sg*.8);',
    '  if(mod(seed,4.)>2.5){',
    '    vec2 c=vec2(.50,-.52);float ring=smoothstep(.014,0.,abs(length(q-c)-.20));',
    '    float tk=min(dseg(q,c+vec2(-.10,-.01),c+vec2(-.03,-.09)),dseg(q,c+vec2(-.03,-.09),c+vec2(.11,.08)));',
    '    col=mix(col,vec3(.30,.40,.46),max(ring,smoothstep(.016,0.,tk))*.85);',
    '  }',
    '  float e=min(1.-abs(u),1.-abs(v));col*=.88+.12*smoothstep(0.,.05,e);',
    '  return col;',
    '}',
    'vec3 page(float s,vec2 g){',
    '  vec3 c=vec3(.80,.77,.70);float ink=0.;',
    '  if(g.x<.04||g.x>.96||g.y<.03||g.y>.97)return c*.9;',
    '  if(g.y>.05&&g.y<.17){float r=step(.30,h21(vec2(floor(g.x*13.),s)));ink=max(ink,r*step(.10,fract(g.y*9.)));}',
    '  if(g.x>.06&&g.x<.50&&g.y>.22&&g.y<.52)c=mix(c,vec3(.42,.41,.39),.85*(.45+.55*vn(g*9.+s)));',
    '  float yy=g.y/.026;float row=floor(yy);float fy=fract(yy);',
    '  float cx=floor(g.x/.31);float lx=fract(g.x/.31);',
    '  float r=h21(vec2(row+cx*17.,s));',
    '  float words=step(.18,fract(lx*(7.+5.*r)+r*5.));',
    '  float inT=step(.06,lx)*step(lx,.93)*step(g.y,.95)*max(step(.54,g.y),step(.52,g.x)*step(.22,g.y));',
    '  ink=max(ink,inT*step(.3,fy)*step(fy,.7)*words*step(r,.88)*.78);',
    '  return mix(c,vec3(.09),ink);',
    '}',
    'vec3 newspaper(vec2 q,float p){',
    '  float cf=cos(3.14159*p);',
    '  vec3 col;',
    '  vec2 gR=vec2(q.x,(1.-q.y)*.5);',
    '  vec2 gL=vec2(q.x+1.,(1.-q.y)*.5);',
    '  if(q.x>=0.){',
    '    if(cf>0.&&q.x<cf){col=page(2.,vec2(q.x/cf,gR.y));col*=.82+.18*(q.x/cf);}',
    '    else{col=page(4.,gR);col*=1.-.38*smoothstep(.35,0.,q.x-cf)*step(.001,p)*step(p,.999);}',
    '  }else{',
    '    if(cf<0.&&q.x>cf){col=page(3.,vec2(q.x/cf,gL.y));col*=.8+.2*(1.-q.x/cf);}',
    '    else col=page(1.,gL);',
    '  }',
    '  col*=1.-.30*smoothstep(.0,.06,.06-abs(q.x));',
    '  return col;',
    '}',
    'vec3 warmAt(vec3 P){float d=length(P-gFire);return vec3(1.,.40,.13)*gFlick*1.7/(1.+d*d*.16);}',
    'vec4 figure(vec2 q,float pf){',
    '  vec2 p=vec2(q.x*1.4,q.y*1.7);',
    '  vec3 col=vec3(0.);float a=0.;',
    '  float dc=min(min(sdb(p,vec2(.15,-.05),vec2(1.0,1.25),.38),sdb(p,vec2(.1,-1.2),vec2(1.15,.42),.3)),min(sdb(p,vec2(-1.1,-.75),vec2(.26,.62),.24),sdb(p,vec2(1.2,-.8),vec2(.26,.58),.24)));',
    '  float mc=msk(dc);',
    '  vec3 lea=vec3(.11,.07,.05)*(.55+.9*smoothstep(-1.4,1.4,p.x));',
    '  lea+=vec3(.9,.38,.12)*smoothstep(-.14,.0,dc)*smoothstep(-.6,1.2,p.x)*.9*gFlick;',
    '  col=mix(col,lea,mc);a=max(a,mc);',
    '  float turn=sin(3.14159*pf);',
    '  vec2 pb=p-vec2(0.,sin(gT*1.7)*.012);',
    '  float dm=min(sdb(pb,vec2(.12,-.3),vec2(.52,.62),.32),sdb(pb,vec2(.25,-1.0),vec2(.78,.2),.2));',
    '  float mb=msk(dm);',
    '  vec3 suit=vec3(.045,.048,.060)+vec3(.9,.4,.13)*smoothstep(-.2,.0,dm)*smoothstep(-.4,.9,p.x)*.8*gFlick;',
    '  col=mix(col,suit,mb);a=max(a,mb);',
    '  vec2 ph=pb-vec2(.12+.03*turn,.84-.05*turn);',
    '  float dh=length(ph*vec2(1.,.92))-.25;',
    '  float mh=msk(dh);',
    '  float side=clamp(ph.x/.25*.5+.5,0.,1.);',
    '  vec3 skin=vec3(.30,.19,.14)*(.45+1.3*side*gFlick)+vec3(.7,.3,.1)*smoothstep(-.08,0.,dh)*side*.7;',
    '  skin=mix(skin,vec3(.03,.025,.025),smoothstep(.0,.05,ph.y-.04+.12*(1.-side))*.92);',
    '  col=mix(col,skin,mh);a=max(a,mh);',
    '  vec2 pn=p-vec2(.1,.06-.13*turn);',
    '  float rot=-.10+.04*turn;float cr=cos(rot),sr=sin(rot);',
    '  pn=vec2(cr*pn.x-sr*pn.y,sr*pn.x+cr*pn.y);',
    '  float mn=msk(sdb(pn,vec2(0.),vec2(.68,.46),.01));',
    '  vec3 np=newspaper(vec2(pn.x/.68,pn.y/.46),pf);',
    '  np*=(.45+.65*smoothstep(-.8,.8,p.x))*vec3(1.,.84,.68)*(.5+.5*gFlick);',
    '  col=mix(col,np,mn);a=max(a,mn);',
    '  float dHd=min(length((pn-vec2(-.62,-.36))*vec2(1.,1.2)),length((pn-vec2(.62,-.36))*vec2(1.,1.2)))-.11;',
    '  float mHd=msk(dHd);',
    '  col=mix(col,vec3(.18,.11,.08)*(.4+.6*smoothstep(-.5,.5,p.x)),mHd);a=max(a,mHd);',
    '  return vec4(col,a);',
    '}',
    'vec4 fireplace(vec2 q){',
    '  vec2 p=vec2(q.x*1.9,q.y*2.4+.6);float t=gT;',
    '  float dM=sdb(p,vec2(0.,-.05),vec2(1.55,1.58),.05);',
    '  float mM=msk(dM);',
    '  float vein=smoothstep(.035,.0,abs(fbm(p*1.15+3.)-.5));',
    '  vec3 col=vec3(.040,.040,.046)+vec3(.30,.28,.26)*vein*.10;',
    '  col+=vec3(.9,.38,.12)*gFlick*.34*exp(-length(p-vec2(0.,-.95))*.7);',
    '  float a=mM;',
    '  float dS=sdb(p,vec2(0.,1.58),vec2(1.75,.10),.03);',
    '  col=mix(col,vec3(.08,.075,.07)+vec3(.35,.15,.05)*gFlick*.1,msk(dS));a=max(a,msk(dS));',
    '  float mO=msk(sdb(p,vec2(0.,-.9),vec2(1.12,.74),.04));',
    '  vec2 f=vec2(p.x/1.12,(p.y+1.64)/1.48);',
    '  float n=fbm(vec2(f.x*2.6,f.y*2.0-t*1.5));',
    '  float n2=fbm(vec2(f.x*5.,f.y*3.5-t*2.4)+7.);',
    '  float env=(1.-pow(abs(f.x),1.4))*smoothstep(1.25,.0,f.y)*smoothstep(0.,.08,f.y);',
    '  float fl=clamp((n*.8+n2*.6)*env*2.7-.2+uEx*.3,0.,1.)*(.92+.15*sin(t*7.));',
    '  vec3 fc=mix(vec3(.9,.12,.02),vec3(1.,.55,.1),smoothstep(.1,.55,fl));fc=mix(fc,vec3(1.,.9,.6),smoothstep(.6,1.,fl));',
    '  vec3 inner=vec3(.012,.008,.007)+fc*fl*2.3;',
    '  float dLog=min(sdb(p,vec2(-.2,-1.45),vec2(.55,.1),.09),sdb(p,vec2(.3,-1.40),vec2(.5,.11),.1));',
    '  vec3 logc=vec3(.02,.014,.011)+vec3(1.,.28,.04)*.22*(.3+fbm(p*7.+t*.4));',
    '  inner=mix(inner,logc,msk(dLog)*(1.-fl*.85)*.9);',
    '  col=mix(col,inner,mO);a=max(a,mO);',
    '  vec2 sp=p-vec2(-.72,1.68);',
    '  float dB=sdb(sp,vec2(0.,.07),vec2(.30,.07),.03);',
    '  float dP=sdb(sp,vec2(0.,.78),vec2(.035,.70),.02);',
    '  float dBm=sdb(sp,vec2(0.,1.50),vec2(.66,.032),.02);',
    '  float dKn=length(sp-vec2(0.,1.54))-.07;',
    '  float dPans=1e3;float dStr=1e3;',
    '  for(int k=0;k<2;k++){float s=k==0?-1.:1.;',
    '    dPans=min(dPans,sdb(sp,vec2(s*.58,.98),vec2(.19,.028),.028));',
    '    dStr=min(dStr,min(dseg(sp,vec2(s*.58,1.47),vec2(s*.58-.18,1.02)),dseg(sp,vec2(s*.58,1.47),vec2(s*.58+.18,1.02)))-.007);}',
    '  float dSc=min(min(min(dB,dP),min(dBm,dKn)),min(dPans,dStr));',
    '  float mSc=msk(dSc);',
    '  vec3 brass=vec3(.40,.30,.17)*(.30+.80*smoothstep(-.9,.9,sp.x+.9))*(.55+.7*gFlick)+vec3(.9,.45,.15)*smoothstep(-.05,0.,dSc)*.35*gFlick;',
    '  col=mix(col,brass,mSc);a=max(a,mSc);',
    '  vec2 ec=vec2(p.x*6.,(p.y-t*.55)*6.);vec2 id=floor(ec);vec2 fr=fract(ec)-.5;',
    '  float e=step(.955,h21(id))*smoothstep(.16,.0,length(fr+(h21(id+3.)-.5)*.4))*smoothstep(-.9,.3,p.y)*smoothstep(1.7,.2,p.y)*step(abs(p.x),1.15);',
    '  col+=vec3(1.,.5,.12)*e*(1.6+uEx*2.);a=max(a,e);',
    '  return vec4(col,a);',
    '}',
    'vec3 scene(vec3 ro,vec3 rd,float tmax,out float hit){',
    '  float best=tmax;hit=0.;float bs=0.;vec2 bq=vec2(0.);float bdn=1.;float bl=1.;float bf=1.;',
    '  for(int i=0;i<N;i++){',
    '    vec3 C=uC[i];vec3 R=uR[i];vec3 U=uU[i];vec3 n=normalize(cross(R,U));',
    '    float dn=dot(rd,n);if(abs(dn)<1e-4)continue;',
    '    float t=dot(C-ro,n)/dn;if(t<=.05||t>=best)continue;',
    '    vec3 p=ro+rd*t-C;float u=dot(p,R)/.78;float v=dot(p,U)/1.1;',
    '    if(abs(u)>1.||abs(v)>1.)continue;',
    '    best=t;hit=1.;bs=float(i)+1.;bq=vec2(u,v);bdn=dn;',
    '    bl=.40+.60*clamp(abs(dot(n,normalize(L))),0.,1.);',
    '    bf=smoothstep(-1.25,-.55,C.y)*smoothstep(4.7,4.0,C.y);',
    '  }',
    '  vec3 pc=vec3(0.);float pset=0.;',
    '  {',
    '    vec3 n=vec3(.3146,0.,.9492);vec3 R=vec3(.9492,0.,-.3146);',
    '    float dn=dot(rd,n);float t=dot(gFig-ro,n)/dn;',
    '    if(dn<0.&&t>.05&&t<best){vec3 p=ro+rd*t-gFig;vec2 q=vec2(dot(p,R)/(1.4*gSc),p.y/(1.7*gSc));',
    '      if(abs(q.x)<1.&&abs(q.y)<1.){vec4 f=figure(q,smoothstep(0.,1.,clamp((mod(gT,9.)-3.)/2.,0.,1.)));',
    '        if(f.a>.5){best=t;pc=f.rgb;pset=1.;}}}',
    '  }',
    '  {',
    '    vec3 n=vec3(-.2764,0.,.9610);vec3 R=vec3(.9610,0.,.2764);',
    '    float dn=dot(rd,n);float t=dot(gFire-ro,n)/dn;',
    '    if(dn<0.&&t>.05&&t<best){vec3 p=ro+rd*t-gFire;vec2 q=vec2(dot(p,R)/(1.9*gSc),(p.y/gSc-.6)/2.4);',
    '      if(abs(q.x)<1.&&abs(q.y)<1.){vec4 f=fireplace(q);',
    '        if(f.a>.5){best=t;pc=f.rgb;pset=1.;}}}',
    '  }',
    '  if(pset>.5){hit=1.;return mix(vec3(.02,.022,.027),pc,exp(-best*.02));}',
    '  vec3 col=vec3(0.);',
    '  if(hit>.5){',
    '    vec3 c=bdn<0.?sheetCol(bs,bq):vec3(.50,.49,.47);',
    '    c*=bl*.92;c+=c*warmAt(ro+rd*best)*1.1;',
    '    c=mix(c,vec3(.02,.022,.027),1.-exp(-best*.075));',
    '    col=mix(vec3(.02,.022,.027),c,bf);',
    '  }',
    '  return col;',
    '}',
    'vec3 render(vec2 uv){',
    '  float asp=uRes.x/uRes.y;float fv=clamp(.9/asp,1.,2.3);',
    '  vec3 ro=vec3(-uMouse.x*.9+sin(uTime*.11)*.15,.45+uMouse.y*.38+sin(uTime*.09)*.04,4.9-uScroll*9.-uEx*.9);',
    '  vec3 ta=vec3(0.,.7,-4.5-uScroll*9.);',
    '  vec3 f=normalize(ta-ro);',
    '  float yw=uMouse.x*.34;float pt=uMouse.y*.26;float cyw=cos(yw),syw=sin(yw);',
    '  f=vec3(f.x*cyw+f.z*syw,f.y,-f.x*syw+f.z*cyw);f.y+=pt;f=normalize(f);',
    '  vec3 r=normalize(cross(f,vec3(0.,1.,0.)));vec3 u=cross(r,f);',
    '  float rl=uMouse.x*.10;vec3 r2=r*cos(rl)+u*sin(rl);vec3 u2=-r*sin(rl)+u*cos(rl);',
    '  vec3 rd=normalize(f+(uv.x*r2+uv.y*u2)*1.12*fv);',
    '  vec3 col;float tf=1e5;float h=0.;',
    '  if(rd.y<-1e-3)tf=(-1.7-ro.y)/rd.y;',
    '  bool onFloor=tf>0.&&tf<1e4;',
    '  vec3 p=ro+rd*tf;vec3 rr=vec3(rd.x,-rd.y,rd.z);',
    '  vec3 rc=sky(rr);vec3 sc=vec3(0.);',
    '  for(int pass=0;pass<2;pass++){',
    '    vec3 o=ro;vec3 d=rd;float tm=onFloor?tf:1e5;',
    '    if(pass==0){if(!onFloor||uLite>.5)continue;o=p+vec3(0.,.002,0.);d=rr;tm=40.;}',
    '    float hh;vec3 cc=scene(o,d,tm,hh);',
    '    if(pass==0)rc=mix(sky(rr),cc,hh);else{h=hh;sc=cc;}',
    '  }',
    '  if(onFloor){',
    '    float fres=.12+.62*pow(1.-clamp(-rd.y,0.,1.),3.);',
    '    vec2 g=abs(fract(p.xz*.5)-.5);float grid=smoothstep(.012,0.,min(g.x,g.y))*.045;',
    '    vec3 base=vec3(.016,.017,.020)+vec3(.55,.57,.62)*grid+warmAt(p)*.30;',
    '    col=mix(base,rc,fres);col=mix(col,sky(rd)*.9,clamp(1.-exp(-tf*.05),0.,1.));',
    '  }else col=sky(rd);',
    '  col=mix(col,sc,h);',
    '  return col;',
    '}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    '  float asp=uRes.x/uRes.y;float fv=clamp(.9/asp,1.,2.3);float vis=.5*asp*1.12*fv;',
    '  gT=uTime;gSc=clamp(vis*6.1/5.4,.55,1.15);',
    '  gFig=vec3(-.54*vis*6.1,-1.7+1.7*gSc,-1.0);',
    '  gFire=vec3(.52*vis*6.1,-1.7+1.8*gSc,-1.4);',
    '  gFlick=.86+.10*sin(uTime*7.3)+.06*sin(uTime*13.1+1.7)+uEx*.32;',
    '  float d=length(uv-uLens);float LR=.12;float inL=uLensOn*step(d,LR);float k=clamp(d/LR,0.,1.);',
    '  vec2 uvm=uLens+(uv-uLens)*mix(1.,.50+.50*k*k,inL);',
    '  vec3 col=render(uvm);',
    '  col=col/(1.+col*.55);',
    '  float vig=1.-dot(uv*vec2(.9,1.),uv*vec2(.9,1.))*.9;col*=clamp(vig,.25,1.);',
    '  float cx=abs(gl_FragCoord.x/uRes.x-.5)*2.;float m=mix(uDim,1.,smoothstep(.2,.95,cx));m=mix(m,1.,inL*.85);col*=m;',
    '  col+=inL*vec3(.035,.038,.045)*(1.-k);',
    '  float rim=uLensOn*smoothstep(.0065,0.,abs(d-LR));float halo=uLensOn*smoothstep(.03,0.,abs(d-LR-.006))*.18;',
    '  col=mix(col,vec3(.93,.94,.96),rim*.92)+halo*vec3(.7,.72,.76);',
    '  float ra=uRip.z;float rd2=length(uv-uRip.xy);',
    '  float ring=step(0.,ra)*smoothstep(.022,0.,abs(rd2-ra*.6))*exp(-ra*1.3);',
    '  float ring2=step(.12,ra)*smoothstep(.014,0.,abs(rd2-(ra-.12)*.6))*exp(-ra*1.8);',
    '  col+=(ring+ring2*.6)*vec3(.85,.87,.92)*.55;',
    '  col+=(h21(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.022;',
    '  gl_FragColor=vec4(pow(max(col,0.),vec3(.95)),1.);',
    '}'
  ].join('\n');

  /* ตำแหน่งและการหมุนของแผ่นสัญญาแต่ละแผ่น (คำนวณทุกเฟรมเพื่อให้ลอยเบา ๆ) */
  var AC = new Float32Array(NS * 3), AR = new Float32Array(NS * 3), AU = new Float32Array(NS * 3);
  var BURST = { age: -1, x: 0, y: 0 };   /* คลื่นกระแทกจากการคลิก: age = วินาทีนับจากคลิก (-1 = ไม่มี), x/y = ตำแหน่งโดยประมาณในโลก 3 มิติ */
  function layout(t) {
    var amp = BURST.age >= 0 ? 2.2 * Math.exp(-BURST.age * 1.5) * (1 - Math.exp(-BURST.age * 9)) : 0;
    for (var i = 0; i < NS; i++) {
      if (i >= 9) {                                   /* กระดาษที่ร่วงลงมาและหมุนตกลงมาเป็นรอบ ๆ */
        var j = i - 9, v = .46 + .08 * j, cyc = 6.2, ph = j * 2.3;
        var yw = t * .5 + j * 2, pt = Math.sin(t * .8 + j) * .6, rl = t * .35 + j, sc = .7;
        var c1 = Math.cos(yw), s1 = Math.sin(yw), c2 = Math.cos(pt), s2 = Math.sin(pt), c3 = Math.cos(rl), s3 = Math.sin(rl);
        AR[i * 3] = (c3 * c1 + s3 * s2 * s1) / sc; AR[i * 3 + 1] = (s3 * c2) / sc; AR[i * 3 + 2] = (-c3 * s1 + s3 * s2 * c1) / sc;
        AU[i * 3] = (-s3 * c1 + c3 * s2 * s1) / sc; AU[i * 3 + 1] = (c3 * c2) / sc; AU[i * 3 + 2] = (s3 * s1 + c3 * s2 * c1) / sc;
        AC[i * 3] = [-.9, .3, 1.5][j] + Math.sin(t * .7 + j * 2) * .4;
        AC[i * 3 + 1] = 4.5 - (((t * v + ph) % cyc) + cyc) % cyc;
        AC[i * 3 + 2] = -2.0 - j * 1.2;
        continue;
      }
      var yaw = Math.sin(i * 1.9) * .55 + Math.sin(t * .17 + i) * .07 + amp * .5 * Math.sin(i * 1.3);
      var pit = Math.sin(i * 2.7) * .16 + Math.sin(t * .13 + i * 2) * .04;
      var rol = Math.sin(i * 3.3) * .22 + Math.sin(t * .11 + i * 3) * .05;
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), cr = Math.cos(rol), sr = Math.sin(rol);
      AR[i * 3] = cr * cy + sr * sp * sy; AR[i * 3 + 1] = sr * cp; AR[i * 3 + 2] = -cr * sy + sr * sp * cy;
      AU[i * 3] = -sr * cy + cr * sp * sy; AU[i * 3 + 1] = cr * cp; AU[i * 3 + 2] = sr * sy + cr * sp * cy;
      var side = (i % 2) ? 1 : -1;
      AC[i * 3] = side * (3.0 + ((i * .37) % 1.6)) + Math.sin(i * 2.1) * .4;
      AC[i * 3 + 1] = .45 + .85 * Math.sin(i * 1.7) + Math.sin(t * .4 + i * 1.3) * .08;
      AC[i * 3 + 2] = -4.2 - i * .9;
      if (amp > 0) {                                     /* แผ่นสัญญากระเด็นออกจากจุดคลิก */
        var bdx = AC[i * 3] - BURST.x, bdy = AC[i * 3 + 1] - BURST.y, bl = Math.sqrt(bdx * bdx + bdy * bdy) + .35;
        AC[i * 3] += bdx / bl * amp * 1.4; AC[i * 3 + 1] += bdy / bl * amp * 1.4; AC[i * 3 + 2] -= amp * .6;
      }
    }
  }

  function init() {
    var hero = document.querySelector('main > .hero');
    if (!hero) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero-3d'; cv.setAttribute('aria-hidden', 'true');
    var gl = null;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', depth: false, stencil: false }); } catch (e) { gl = null; }
    if (!gl) return;

    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { try { console.warn('[VCScene] shader', gl.getShaderInfoLog(s)); } catch (e) {} return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    /* คอมไพล์ shader แบบขนาน (ถ้าเบราว์เซอร์รองรับ) เพื่อไม่ให้หน้าเว็บค้างตอนเปิด: รอจนเสร็จแล้วค่อยเริ่มฉาก */
    var par = null; try { par = gl.getExtension('KHR_parallel_shader_compile'); } catch (e) {}
    function whenReady(cb) {
      if (!par) { cb(); return; }
      (function chk() { var ok = true; try { ok = gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR); } catch (e) {} if (ok) cb(); else setTimeout(chk, 40); })();
    }
    whenReady(function boot() {
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { try { console.warn('[VCScene] link', gl.getProgramInfoLog(prog)); } catch (e) {} return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uRes', 'uTime', 'uMouse', 'uScroll', 'uDim', 'uLens', 'uLensOn', 'uLite', 'uEx', 'uRip', 'uC', 'uR', 'uU'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    /* ฉากอยู่ที่ฉากเปิดในหน้าแรก และย้ายไปเป็นฉากหลังคงที่ (#vcBackdrop) ทุกหน้าอื่น: host = องค์ประกอบที่กำหนดขนาดของแคนวาส */
    var back = document.getElementById('vcBackdrop');
    if (!back) { back = document.createElement('div'); back.id = 'vcBackdrop'; back.setAttribute('aria-hidden', 'true'); document.body.insertBefore(back, document.body.firstChild); }
    var host = hero;
    var onHome = function () { return root.getAttribute('data-view') !== null ? root.getAttribute('data-view') === 'home' : true; };
    hero.insertBefore(cv, hero.firstChild);
    root.classList.add('vc-3d');

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var small = window.innerWidth < 768;
    /* ตรวจชนิดการ์ดจอ: ถ้าเป็นตัววาดด้วยซอฟต์แวร์ (ไม่ได้เปิดการเร่งด้วยการ์ดจอ) เริ่มที่โหมดเบาทันที */
    var rend = ''; try { var dbg = gl.getExtension('WEBGL_debug_renderer_info'); rend = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''; } catch (e) {}
    var soft = /swiftshader|basic render|llvmpipe|softpipe|software/i.test(rend) && !/[?&]hq\b/.test(location.search);   /* ?hq = บังคับคุณภาพเต็ม (ใช้ทดสอบ) */
    var weak = !soft && /vega\s*[1-9]\b|intel.*(hd|uhd|iris)|mali|adreno|powervr|radeon\(tm\) graphics/i.test(rend) && !/[?&]hq\b/.test(location.search);   /* การ์ดจอในตัวที่อ่อน: เริ่มที่โหมดเบา */
    var tier = soft ? 2 : (weak ? 1 : 0), fpsNow = 0, minScale = soft ? 0.3 : (weak ? 0.3 : 0.36);
    var scale = soft ? 0.4 : (weak ? 0.4 : (small ? 0.55 : 0.6)), running = false, inView = true, t0 = performance.now(), raf = 0, W = 0, H = 0;
    var frames = 0, acc = 0, last = 0, lost = false;
    var lens = { x: .12, y: .06, tx: .12, ty: .06, moved: -1e9 };
    var mp = { x: 0, y: 0, tx: 0, ty: 0 }, fixedT = null, exH = 0, pulseV = 0, rip = { x: 0, y: 0, t0: 0 };
    /* คลิกบนฉากเปิด: วงคลื่นแผ่ออกจากจุดคลิก และแผ่นสัญญากระเด็นออก (ข้ามถ้าเครื่องช้า/ลดการเคลื่อนไหว) */
    window.addEventListener('pointerdown', function (e) {
      if (tier >= 2 || (mq && mq.matches)) return;
      if (!onHome()) return;
      var r = hero.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      var asp = r.width / r.height, fv = Math.min(2.3, Math.max(1, .9 / asp));
      rip.x = ((e.clientX - r.left) / r.width - .5) * asp; rip.y = .5 - (e.clientY - r.top) / r.height; rip.t0 = performance.now();
      BURST.x = rip.x * 1.12 * fv * 10; BURST.y = .7 + rip.y * 1.12 * fv * 10; BURST.age = 0;
    }, { passive: true });
    window.addEventListener('pointermove', function (e) { mp.tx = e.clientX / window.innerWidth - .5; mp.ty = e.clientY / window.innerHeight - .5; }, { passive: true });
    document.addEventListener('pointerleave', function () { mp.tx = 0; mp.ty = 0; });

    /* แว่นขยายตามเมาส์/นิ้วที่อยู่บนฉากเปิด ถ้านิ่งเกิน 6 วินาทีจะเดินวนเอง */
    function onMove(e) {
      if (!onHome()) return;
      var r = hero.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      lens.tx = ((e.clientX - r.left) / r.width - .5) * (r.width / r.height);
      lens.ty = .5 - (e.clientY - r.top) / r.height;
      lens.moved = performance.now();
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });

    function size() {
      var r = host.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.max(2, Math.round(r.width * scale * dpr)); H = Math.max(2, Math.round(r.height * scale * dpr));
      cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
    }
    function draw(now, still) {
      var r = host.getBoundingClientRect();
      var sc = onHome() ? Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))) : 0;
      if (!still) { mp.x += (mp.tx - mp.x) * .16; mp.y += (mp.ty - mp.y) * .16; }
      var P = still ? { x: 0, y: 0 } : mp;
      var t = still ? 3.0 : (fixedT !== null ? fixedT : (now - t0) / 1000), asp = W / H;
      if (still) { lens.x = asp * .12; lens.y = .05; }
      else {
        if (now - lens.moved > 6000) { lens.tx = Math.sin(t * .33) * .27 * asp; lens.ty = Math.cos(t * .21) * .15; }
        lens.x += (lens.tx - lens.x) * .12; lens.y += (lens.ty - lens.y) * .12;
      }
      layout(t);
      gl.uniform2f(U.uRes, W, H);
      gl.uniform1f(U.uTime, t);
      gl.uniform2f(U.uMouse, still ? 0 : P.x, still ? 0 : P.y);
      gl.uniform1f(U.uScroll, still ? 0 : sc);
      gl.uniform1f(U.uDim, small ? 0.6 : 0.5);
      gl.uniform2f(U.uLens, lens.x, lens.y);
      gl.uniform1f(U.uLensOn, (onHome() && sc < .6) ? 1 : 0);
      gl.uniform1f(U.uLite, tier > 0 ? 1 : 0);
      if (!still && rip.t0 && (now - rip.t0) / 1000 < 3.2) BURST.age = (now - rip.t0) / 1000; else BURST.age = -1;
      gl.uniform3f(U.uRip, rip.x, rip.y, BURST.age);
      var fx = window.VCFX || { hover: 0, pulse: 0 };
      if (fx.pulse) { pulseV = Math.max(pulseV, fx.pulse); fx.pulse = 0; }
      pulseV *= .93; exH += ((fx.hover || 0) * .55 - exH) * .07;
      gl.uniform1f(U.uEx, still ? 0 : Math.min(1.4, exH + pulseV * .9));
      gl.uniform3fv(U.uC, AC); gl.uniform3fv(U.uR, AR); gl.uniform3fv(U.uU, AU);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(now) {
      raf = 0; if (!running || lost) return;
      draw(now, false);
      if (last) {
        var dtm = now - last; acc += dtm; frames++;
        if ((acc >= 600 || frames >= 12) && !/[?&]hq\b/.test(location.search)) {                    /* ตัดสินใจทุก ~0.6 วินาที (เร็วพอแม้เฟรมช้ามาก) */
          var avg = acc / frames; fpsNow = 1000 / avg;
          if (avg > 36 && scale > minScale) { scale = Math.max(minScale, scale * 0.75); size(); }
          else if (avg > 45 && tier < 2) { tier++; minScale = 0.3; }
          else if (avg > 110 && tier >= 2) { tier = 3; running = false; draw(performance.now(), true); }   /* ช้ามากแม้โหมดเบา: หยุดฉากเป็นภาพนิ่ง ให้หน้าเว็บยังลื่น */
          frames = 0; acc = 0;
        } else if (acc >= 600 || frames >= 12) { fpsNow = 1000 * frames / acc; frames = 0; acc = 0; }
      }
      last = now; raf = requestAnimationFrame(loop);
    }
    function go() {
      if (lost || tier === 3) return;
      if (mq && mq.matches) { running = false; draw(performance.now(), true); return; }
      if (!running && inView && !document.hidden) { running = true; last = 0; if (!raf) raf = requestAnimationFrame(loop); }
    }
    size(); draw(performance.now(), mq && mq.matches); go();
    window.VCScene = { ok: true, get scale() { return scale; }, get tier() { return tier; }, get burst() { return BURST.age; }, get ex() { return exH + pulseV * .9; }, get fps() { return fpsNow; }, get renderer() { return rend; }, freeze: function (t) { fixedT = (typeof t === 'number') ? t : null; } };   /* freeze(t): ตรึงเวลาของฉาก ใช้ทดสอบ */

    if (/[?&]fps\b/.test(location.search)) {
      var box = document.createElement('div');
      box.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:10001;padding:6px 8px;font:12px/1.4 monospace;color:#fff;background:rgba(0,0,0,.7);border-radius:4px;pointer-events:none;max-width:90vw;white-space:pre-wrap';
      document.body.appendChild(box);
      setInterval(function () { box.textContent = 'fps ' + fpsNow.toFixed(1) + ' | scale ' + scale.toFixed(2) + ' | tier ' + tier + (soft ? ' (software GL!)' : '') + '\n' + rend; }, 500);
    }
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; running = false; root.classList.remove('vc-3d'); cv.style.display = 'none'; });
    var heroSeen = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { heroSeen = es[0].isIntersecting; if (onHome()) { inView = heroSeen; if (!inView) running = false; else go(); } }, { threshold: 0 }).observe(hero);
    document.addEventListener('vc-view', function (e) {
      var v = e.detail && e.detail.view;
      if (v === 'home') { host = hero; hero.insertBefore(cv, hero.firstChild); inView = true; }
      else { host = back; back.appendChild(cv); inView = (v !== 'desk'); }
      size(); if (v === 'desk') { running = false; draw(performance.now(), mq && mq.matches); } else { running = false; go(); }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else go(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { small = window.innerWidth < 768; size(); if (!running) draw(performance.now(), mq && mq.matches); }, 150); });
    if (mq) { var h = function () { if (mq.matches) { running = false; draw(performance.now(), true); } else go(); }; if (mq.addEventListener) mq.addEventListener('change', h); else if (mq.addListener) mq.addListener(h); }
    });
  }
  /* เริ่มฉากหลังหน้าโหลดเสร็จและเบราว์เซอร์ว่าง เพื่อให้กดอะไรได้ทันทีตอนเปิดเว็บ */
  function start() {
    var go = function () { setTimeout(init, 300); };
    if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 1500 }); else go();
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();

/* ===== แถบหัวเว็บโปร่งใสเมื่ออยู่บนสุดของหน้า (29 ต.ค. 2026) =====
   html.vc-top = เลื่อนอยู่ใกล้บนสุด: แถบหัวเว็บไม่มีพื้นและไม่มีเส้น โลโก้กับเมนูลอยบนฉากเปิด
   เลื่อนลงแล้วพื้นแถบกลับมา เพื่อให้เมนูอ่านออกบนส่วนสีอื่น */
(function () {
  'use strict';
  var root = document.documentElement, ticking = false;
  function upd() { ticking = false; root.classList.toggle('vc-top', (window.scrollY || window.pageYOffset || 0) < 24); }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  window.addEventListener('scroll', req, { passive: true });
  upd();
})();

/* ===== (จาก art-field.js) ===== */
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
      if (!root.classList.contains('vc-3d')) {
        beam(W * .72, W * .07, .055, Math.sin(t * .18) * .015 + P.x * .02);
        beam(W * .9, W * .045, .035, Math.sin(t * .13 + 1) * .012 + P.x * .015);
      }
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


/* ===== พื้นบานจากจุดที่เมาส์เข้า/ออกของปุ่ม (29 ต.ค. 2026) =====
   เก็บตำแหน่งเมาส์ในปุ่มเป็น --hx/--hy ให้ CSS (art.css: clip-path วงกลมบานออกจากจุดนั้น และหดกลับเข้าจุดที่เมาส์ออก)
   ส่วนอื่นของเอฟเฟกต์ปุ่ม (วงแหวนล็อก, ดูดตามเมาส์, ตัวอักษรกลิ้ง, ประกายไฟ, ไฟเตาแรงขึ้น) อยู่ใน art-cursor ด้านบน */
(function () {
  'use strict';
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;
  var SEL = '.dx-cta,.dx-cta-ghost,.dx-nav a:last-child,button.primary,button.ghost';
  function at(btn, e) {
    var r = btn.getBoundingClientRect();
    btn.style.setProperty('--hx', (e.clientX - r.left).toFixed(0) + 'px');
    btn.style.setProperty('--hy', (e.clientY - r.top).toFixed(0) + 'px');
  }
  /* ใช้ event delegation จึงรวมปุ่มที่ถูกสร้างภายหลังด้วย */
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var b = e.target.closest && e.target.closest(SEL); if (!b || b.disabled) return;
    if (e.relatedTarget && b.contains(e.relatedTarget)) return;
    at(b, e);
  }, true);
  document.addEventListener('pointerout', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var b = e.target.closest && e.target.closest(SEL); if (!b) return;
    if (e.relatedTarget && b.contains(e.relatedTarget)) return;
    at(b, e);
  }, true);
})();


/* ===== โครงหน้าแบบหน้าเดียว: หน้าแรกมีแต่ฉากเปิด ส่วนอื่นเป็น "หน้าย่อย" เปิดด้วยเมนูด้านบน (29 ต.ค. 2026) =====
   html[data-view] = home | how | film | desk
     home = ฉากเปิด (#top)            how = #manifesto + #chapters (วิธีอ่าน)
     film = #introVideo (คลิปแนะนำ)    desk = .desk-head + #authCard + #checkCard + #resultCard + #paymentCard (บัญชี/ตรวจสัญญา)
   - ซ่อนด้วย CSS (display:none) ไม่ลบองค์ประกอบ  ทุก id และ JS เดิมทำงานต่อได้
   - ลิงก์ #hash เดิมใช้ได้ทั้งหมด (เมนู ปุ่มในฉากเปิด คลิป): เปลี่ยน hash → สลับหน้าด้วยฉากม่าน → เลื่อนไปหาเป้าหมาย
   - ครอบ Element.scrollIntoView: ถ้าเป้าหมายอยู่ในหน้าที่ถูกซ่อน (เช่น script.js เลื่อนไปหาผลตรวจ) จะสลับหน้าให้ก่อนอัตโนมัติ
   - ปุ่ม Back/Forward ของเบราว์เซอร์ทำงานตามปกติ  ลดการเคลื่อนไหว: สลับทันทีไม่มีม่าน
   - ปิดทั้งหมด: ลบ class "vc-spa" ออกจาก html (ในสคริปต์ที่ <head>) */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('vc-art')) return;
  var MAP = [
    ['home', ['main > .hero']],
    ['how', ['#manifesto', '#chapters']],
    ['film', ['#introVideo']],
    ['desk', ['#desk', '#authCard', '#checkCard', '#resultCard', '#paymentCard']]
  ];
  var HASH = { '': 'home', '#top': 'home', '#manifesto': 'how', '#chapters': 'how', '#introVideo': 'film',
               '#desk': 'desk', '#authCard': 'desk', '#checkCard': 'desk', '#resultCard': 'desk', '#paymentCard': 'desk' };
  var cur = 'home', busy = false;
  var reduce = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function tag() {
    MAP.forEach(function (m) { m[1].forEach(function (sel) { document.querySelectorAll(sel).forEach(function (el) { el.setAttribute('data-v', m[0]); }); }); });
    var f = document.querySelector('footer'); if (f) f.setAttribute('data-v', 'foot');
  }
  function viewOf(el) { var h = el && el.closest ? el.closest('[data-v]') : null; var v = h && h.getAttribute('data-v'); return v === 'foot' ? 'how' : v; }
  function mark(view) {
    var h = location.hash, links = document.querySelectorAll('.dx-nav a[href^="#"]'), best = null;
    links.forEach(function (a) { a.classList.remove('is-here'); a.removeAttribute('aria-current'); });
    if (view !== 'home') {
      links.forEach(function (a) { if (a.getAttribute('href') === h && HASH[h] === view) best = a; });
      if (!best) links.forEach(function (a) { if (!best && HASH[a.getAttribute('href')] === view) best = a; });
    }
    if (best) { best.classList.add('is-here'); best.setAttribute('aria-current', 'page'); }
  }
  function apply(view) {
    cur = view; root.setAttribute('data-view', view);
    window.dispatchEvent(new Event('resize'));       /* ให้ฉาก 3 มิติ/ฉากเลื่อนคำนวณขนาดใหม่ */
    document.dispatchEvent(new CustomEvent('vc-view', { detail: { view: view } }));
  }
  /* ระลอกหมึก (Ink tide): แถบหมึกชาร์โคลมีขอบเงินบางแบบเส้นบรรทัดบัญชี ไหลขึ้นจากล่างจอเป็นคลื่น ปิดทั้งจอ → สลับหน้าตอนปิดสนิท
     → ขอบท้ายของแถบไหลขึ้นไปเผยหน้าใหม่ (คลื่นพาดผ่านทั้งจอ) · หัวข้อของหน้าใหม่ลอยขึ้นพร้อมเงาสะท้อนบนผิวหมึก (CSS ของ art.css)
     คลื่น = ขอบที่คำนวณด้วย sin หลายความถี่ วาดเป็น clip-path polygon ทุกเฟรม (rAF) 3 ชั้น: เทาเข้มนำหน้า / เงินบางเป็นขอบ / หมึกเป็นตัวแผ่น */
  var wipe = null, layers = null, rafId = 0;
  var PTS = 44;
  function getWipe() {
    if (wipe) return wipe;
    wipe = document.createElement('div'); wipe.id = 'vcWipe'; wipe.setAttribute('aria-hidden', 'true');
    wipe.innerHTML = '<i class="tw tw3"></i><i class="tw tw1"></i><i class="tw tw2"></i><b class="tw-lab mono"></b>';
    document.body.appendChild(wipe);
    layers = [wipe.querySelector('.tw3'), wipe.querySelector('.tw1'), wipe.querySelector('.tw2')];
    return wipe;
  }
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  function edge(x, base, amp, ph) {                  /* ความสูงของขอบ (หน่วย %) ที่ตำแหน่ง x (0..1) */
    return base + amp * (Math.sin(x * 8.6 + ph) + .55 * Math.sin(x * 17.3 - ph * 1.7) + .25 * Math.sin(x * 31 + ph * 2.3));
  }
  function poly(base, amp, ph, off, fromTop) {       /* off = เลื่อนขอบลง/ขึ้น (%) ของแต่ละชั้น */
    var pts = [];
    for (var i = 0; i <= PTS; i++) { var x = i / PTS; pts.push([x * 100, edge(x, base, amp, ph) + off]); }
    var s;
    if (fromTop) { s = '0 -2%,100% -2%'; for (var j = PTS; j >= 0; j--) s += ',' + pts[j][0].toFixed(2) + '% ' + pts[j][1].toFixed(2) + '%'; }
    else { s = '0 102%,100% 102%'; for (var k = PTS; k >= 0; k--) s += ',' + pts[k][0].toFixed(2) + '% ' + pts[k][1].toFixed(2) + '%'; }
    return 'polygon(' + s + ')';
  }
  function runTide(dir, dur, label, onEnd, tok) {    /* dir 'up' = หมึกขึ้นปิดจอ · 'out' = ขอบท้ายขึ้นเปิดจอ */
    var t0 = performance.now(), W = getWipe();
    var lab = W.querySelector('.tw-lab'); lab.textContent = label || '';
    W.style.display = 'block';
    function step(now) {
      if (tok !== seq) return;
      var p = Math.min(1, (now - t0) / dur), e = ease(p), env = Math.sin(Math.PI * p);
      var amp = 2.2 + 5.5 * env, ph = (now - t0) / 260;
      var base = dir === 'up' ? 118 - 138 * e : 118 - 138 * e;      /* 118% → -20% */
      var top = dir === 'out';
      var lead = top ? 7 : -7, line = top ? -.6 : .6;                              /* ชั้นเทาเข้มนำหน้า/ตามหลัง 7% ชั้นหมึกเว้นจากเงิน .6% ให้เห็นเป็นเส้นเงินบาง */
      layers[0].style.clipPath = poly(base, amp * 1.15, ph - .8, lead, top);      /* เทาเข้ม */
      layers[1].style.clipPath = poly(base, amp, ph, 0, top);                       /* เงิน */
      layers[2].style.clipPath = poly(base, amp, ph, line, top);                    /* หมึก */
      lab.style.opacity = String(top ? Math.max(0, 1 - p * 2.2) : Math.min(1, p * 3));
      if (p < 1) rafId = requestAnimationFrame(step); else { rafId = 0; if (onEnd) onEnd(); }
    }
    rafId = requestAnimationFrame(step);
  }
  var seq = 0;
  function hideWipe() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } if (wipe) wipe.style.display = 'none'; busy = false; root.removeAttribute('data-entering'); }
  var NAME = { home: '', how: 'วิธีอ่าน', film: 'คลิปแนะนำ', desk: 'ตรวจสัญญา' };
  function go(view, after, opts) {
    opts = opts || {};
    var my = ++seq;                                  /* การสลับหน้าใหม่ยกเลิกอันเก่าที่ค้างอยู่ (กันกดรัว ๆ) */
    if (view === cur) { hideWipe(); if (after) after(); return; }
    var finish = function () { window.scrollTo(0, 0); apply(view); mark(view); if (after) after(); if (window.VCMotion && VCMotion.replay) VCMotion.replay(document.querySelector('main')); };
    if (reduce() || opts.instant || !window.requestAnimationFrame) { hideWipe(); finish(); return; }
    hideWipe(); busy = true;
    runTide('up', 640, NAME[view] || '', function () {
      if (my !== seq) return;
      finish();
      root.setAttribute('data-entering', view);
      runTide('out', 700, NAME[view] || '', function () { if (my === seq) { hideWipe(); } }, my);
      setTimeout(function () { if (my === seq) root.removeAttribute('data-entering'); }, 1500);
    }, my);
  }
  function scrollToHash(h) {
    var el = h && h.length > 1 ? document.getElementById(h.slice(1)) : null;
    if (!el) { window.scrollTo(0, 0); return; }
    var ref = el.getBoundingClientRect().top + (window.pageYOffset || 0) - ((parseFloat(getComputedStyle(root).getPropertyValue('--art-head')) || 64) + 12);
    /* หัวส่วนของหน้าอยู่บนสุดอยู่แล้ว: ถ้าเป้าหมายคือส่วนแรกของหน้าให้อยู่บนสุด */
    window.scrollTo({ top: Math.max(0, ref), behavior: 'instant' });
  }
  function route(h, opts) {
    var view = HASH.hasOwnProperty(h) ? HASH[h] : (h && document.getElementById(h.slice(1)) ? (viewOf(document.getElementById(h.slice(1))) || cur) : 'home');
    go(view, function () { if (view !== 'home') scrollToHash(h); }, opts);
  }
  window.addEventListener('hashchange', function () { route(location.hash); });
  window.addEventListener('popstate', function () { route(location.hash, { instant: true }); });

  /* เมนูหลัก / โลโก้ / ปุ่มในฉากเปิด */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) {
      var hr = a.getAttribute('href');
      if (hr && hr.length > 1 && HASH.hasOwnProperty(hr)) {
        e.preventDefault();
        if (location.hash !== hr) history.pushState(null, '', hr);
        route(hr);
        return;
      }
    }
    var br = e.target.closest && e.target.closest('.brand');
    if (br && cur !== 'home') { if (location.hash) history.pushState(null, '', location.pathname + location.search); route(''); }
  });

  /* ครอบ scrollIntoView */
  var orig = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function () {
    var v = viewOf(this), args = arguments, self = this;
    if (v && v !== cur) { go(v, function () { orig.apply(self, args); }, { instant: true }); return; }
    return orig.apply(this, args);
  };
  /* คลิปแนะนำส่งข้อความขอไปหน้าตรวจสัญญา (video-embed.js เลื่อนไปที่การ์ดเอง ซึ่งผ่านตัวครอบข้างบนแล้ว) และแถบล่างมือถือแท็บ "ตรวจสัญญา" */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#bottomNav [data-nav="home"]');
    if (b && cur !== 'desk') go('desk', null, { instant: true });
  }, true);

  function start() {
    tag();
    var h = location.hash;
    if (HASH.hasOwnProperty(h) && HASH[h] !== 'home') { apply(HASH[h]); mark(HASH[h]); setTimeout(function () { scrollToHash(h); }, 60); }
    else apply('home');
    window.VCView = { get current() { return cur; }, go: function (v, instant) { go(v, null, { instant: !!instant }); }, route: route };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


/* ===== ตราประทับ "เข้าสู่ระบบแล้ว" เมื่อล็อกอินสำเร็จ (29 ต.ค. 2026) =====
   ไม่แตะ script.js: เฝ้าดู #authLoggedIn ว่าเพิ่งถูกแสดง (script.js เรียก showLoggedIn) และมี "เจตนาล็อกอิน" ล่าสุด
   (กดปุ่ม เข้าสู่ระบบ/สมัครใหม่ หรือกด Enter ในช่องกรอก หรือเพิ่งกลับมาจาก Google) จึงสร้างสำเนาเอกสาร
   ลอยทับตำแหน่งเดิม ประทับตรา แล้วค่อยเลือนออกเผยการ์ดบัญชีที่อยู่ข้างใต้
   - ตอนเปิดหน้าแล้วมี session อยู่แล้ว (ไม่มีเจตนา) จะไม่ประทับ
   - ลดการเคลื่อนไหว/ไม่มี WAAPI: ข้ามอนิเมชัน ไม่มีผลต่อการล็อกอิน */
(function () {
  'use strict';
  var intent = null;      /* { t, rect, email } */
  var GKEY = 'vc_stamp_google';
  function docEl() { return document.querySelector('#authLoggedOut .auth-doc'); }
  function remember() {
    var d = docEl(); if (!d) return;
    var r = d.getBoundingClientRect(); if (r.width < 50) return;
    var em = document.getElementById('email');
    intent = { t: Date.now(), rect: { left: r.left, top: r.top, width: r.width, height: r.height }, email: em ? em.value.trim() : '' };
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#loginBtn,#signupBtn');
    if (b) { remember(); return; }
    if (e.target.closest && e.target.closest('#googleBtn')) { try { sessionStorage.setItem(GKEY, String(Date.now())); } catch (x) {} }
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && (e.target.id === 'email' || e.target.id === 'password')) remember();
  }, true);

  function reduce() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function cleanupFx() {
    document.documentElement.classList.remove('vc-ritual'); Array.prototype.forEach.call(document.querySelectorAll('.auth-focus,.auth-ghost,.auth-skip,.auth-welcome,.auth-sound'), function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
  }
  function play(info) {
    if (reduce() || !document.body.animate) return;
    /* รอฟอนต์ลายมือ (Charmonman) ก่อนวัดความกว้างอีเมล ไม่เกิน 700ms ถ้าโหลดไม่ได้ใช้ฟอนต์สำรอง */
    if (document.fonts && document.fonts.load && !play.__f) {
      play.__f = 1; var done = false, go2 = function () { if (done) return; done = true; play(info); };
      Promise.race([document.fonts.load('700 22px Charmonman'), new Promise(function (r) { setTimeout(r, 700); })]).then(go2, go2);
      return;
    }
    play.__f = 0;
    try { playInner(info); }
    catch (e) { cleanupFx(); if (window.console) console.warn('stamp fx', e); return; }
    setTimeout(cleanupFx, 14000);   /* กันค้าง: ไม่ว่าเกิดอะไรขึ้น ชั้นมืดต้องหายภายใน 14 วินาที */
    var d = document.querySelector('.auth-focus'); if (d) d.addEventListener('click', cleanupFx);   /* แตะเพื่อข้ามได้ */
  }
  /* เสียงเอกสารแบบเบามาก: สังเคราะห์ด้วย WebAudio (ไม่มีไฟล์เสียง) · ปิดเป็นค่าเริ่มต้น เปิดได้จากปุ่มระหว่างฉาก */
  var AC = null;
  function sndOn() { try { return localStorage.getItem('vc_sfx') === '1'; } catch (e) { return false; } }
  function ac() { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; }
  function noise(a, dur) { var b = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; var s = a.createBufferSource(); s.buffer = b; return s; }
  function sfx(kind, ms) {
    if (!sndOn()) return; var a = ac(); if (!a) return; var t = a.currentTime, g = a.createGain(), f = a.createBiquadFilter(); g.connect(a.destination);
    if (kind === 'paper') { var n = noise(a, .5); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2600, t + .45); n.connect(f); f.connect(g);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .12); g.gain.linearRampToValueAtTime(0, t + .5); n.start(t); }
    else if (kind === 'scratch') { var d = (ms || 1000) / 1000, n2 = noise(a, d); f.type = 'bandpass'; f.frequency.value = 3800; f.Q.value = 1.4; n2.connect(f); f.connect(g);
      g.gain.setValueAtTime(0, t); for (var k = 0; k < d; k += .09) g.gain.linearRampToValueAtTime(.012 + Math.random() * .014, t + k); g.gain.linearRampToValueAtTime(0, t + d); n2.start(t); }
    else if (kind === 'seal') { var o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + .25); o.connect(g);
      g.gain.setValueAtTime(.32, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); o.start(t); o.stop(t + .4);
      var g2 = a.createGain(), n3 = noise(a, .12); f.type = 'lowpass'; f.frequency.value = 1200; n3.connect(f); f.connect(g2); g2.connect(a.destination); g2.gain.setValueAtTime(.12, t); g2.gain.exponentialRampToValueAtTime(.001, t + .12); n3.start(t); }
  }
  function playInner(info) {
    if (document.querySelector('.auth-ghost')) return;                     /* กันเริ่มซ้อน */
    var src = docEl() || document.querySelector('.auth-doc'); if (!src) return;
    var NSV = 'http://www.w3.org/2000/svg', mob = window.innerWidth < 768;
    /* ---------- Timeline กลาง: ทุกอนิเมชันอ้างเวลาศูนย์เดียวกัน ---------- */
    var TL = { t0: 0, anims: [], cues: [], dead: false, raf: 0, frame: null };
    function A(el, kf, o) { var x = el.animate(kf, o); TL.anims.push(x); return x; }
    function cue(at, fn) { TL.cues.push({ at: at, fn: fn }); }
    function kill() { if (TL.dead) return; TL.dead = true; cancelAnimationFrame(TL.raf); TL.anims.forEach(function (x) { try { x.cancel(); } catch (e) {} });
      document.documentElement.classList.remove('vc-ritual');
      Array.prototype.forEach.call(document.querySelectorAll('.auth-focus,.auth-ghost,.auth-skip,.auth-welcome,.auth-sound'), function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }
    var EASE_OUT = 'cubic-bezier(.22,.61,.36,1)', EASE_IO = 'cubic-bezier(.45,0,.25,1)', SETTLE = 'cubic-bezier(.16,1,.3,1)';

    /* ---------- สร้างเอกสาร (สำเนาแบบฟอร์ม ไม่มี id/ช่องกรอกจริง) ---------- */
    var g = document.createElement('div'); g.className = 'auth-ghost'; g.setAttribute('aria-hidden', 'true');
    var clone = src.cloneNode(true);
    clone.removeAttribute('data-tilt'); clone.style.transform = '';
    clone.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    clone.querySelectorAll('label').forEach(function (n) { n.removeAttribute('for'); });
    clone.querySelectorAll('input').forEach(function (inp, i) {
      var s = document.createElement('span'); s.className = 'gv';
      s.textContent = i === 0 ? '' : '••••••••';
      inp.parentNode.replaceChild(s, inp);
    });
    clone.querySelectorAll('button').forEach(function (n) { n.tabIndex = -1; });
    var wrap = document.createElement('div'); wrap.className = 'auth-doc-wrap';
    var pose = document.createElement('div'); pose.className = 'ad-pose';
    pose.appendChild(clone); wrap.appendChild(pose); g.appendChild(wrap);
    var r = info.rect, vw = window.innerWidth, vh = window.innerHeight;
    var w = r ? r.width : Math.min(330, vw - 32), h = r ? r.height : 470;
    g.style.width = w + 'px'; g.style.left = (r ? r.left : (vw - w) / 2) + 'px'; g.style.top = (r ? Math.max(r.top, Math.min(100, vh - h - 10)) : Math.max(70, (vh - h) / 2)) + 'px';
    var st = document.createElement('div');
    st.className = 'auth-stamp wax'; st.innerHTML = '<img class="wx-img" src="data:image/webp;base64,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" alt="" draggable="false">' + '<span class="wx-cap">ได้รับการตรวจสอบแล้ว<small>VERIFIED · VELLUM CHECK</small></span>';
    clone.appendChild(st); st.style.opacity = 0;
    var dim = document.createElement('div'); dim.className = 'auth-focus'; document.body.appendChild(dim); document.documentElement.classList.add('vc-ritual');
    var cs = document.createElement('i'); cs.className = 'gh-contact'; g.insertBefore(cs, g.firstChild);
    document.body.appendChild(g);
    var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'auth-skip'; skip.textContent = 'ข้าม ›';
    skip.addEventListener('click', kill); document.body.appendChild(skip);
    var snd = document.createElement('button'); snd.type = 'button'; snd.className = 'auth-sound';
    var lab = function () { snd.textContent = sndOn() ? 'เสียง: เปิด' : 'เสียง: ปิด'; snd.setAttribute('aria-pressed', sndOn() ? 'true' : 'false'); }; lab();
    snd.addEventListener('click', function () { try { localStorage.setItem('vc_sfx', sndOn() ? '0' : '1'); } catch (e) {} lab(); if (sndOn()) ac(); });
    document.body.appendChild(snd);

    /* ---------- วัดตำแหน่ง (อ่าน layout ครั้งเดียวก่อนเริ่ม) ---------- */
    function offs(el, root) { var x = 0, y = 0; while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; }
    var CW = clone.offsetWidth, CH = clone.offsetHeight;
    var email = (info.email || '').trim(), gv = clone.querySelector('.gv');
    var signLine = clone.querySelector('.ad-sign i') || clone.querySelector('.ad-sign');
    var sgn = signLine ? offs(signLine, clone) : { x: 90, y: CH - 70 };
    var lineW = signLine ? Math.max(signLine.offsetWidth, 120) : CW * .6;
    var sigW = Math.min(lineW - 16, 230), sigH = sigW * .24, sigX = sgn.x + 10, sigY = sgn.y - sigH - 2, k = sigW / 260;
    var sig = document.createElementNS(NSV, 'svg'); sig.setAttribute('viewBox', '0 0 260 62'); sig.setAttribute('class', 'gh-sig');
    sig.style.cssText = 'left:' + sigX + 'px;top:' + sigY + 'px;width:' + sigW + 'px;height:' + sigH + 'px';
    sig.innerHTML = '<path d="M6 44 C14 6 30 4 34 34 S46 58 54 26 S70 2 78 32 C83 52 96 46 100 24 S118 6 126 34 C130 52 144 44 150 28 S168 14 178 26 M4 54 C64 60 140 56 214 46" fill="none" stroke="#2a1a3a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
    clone.appendChild(sig);
    var sp = sig.firstChild, SL = sp.getTotalLength ? sp.getTotalLength() : 0;
    sp.style.strokeDasharray = SL; sp.style.strokeDashoffset = SL;
    var PTS = []; for (var pi = 0; pi <= 240; pi++) { var q0 = sp.getPointAtLength(SL * pi / 240); PTS.push([q0.x, q0.y]); }   /* อ่านเส้นทางครั้งเดียว ไม่เรียกระหว่างเล่น */
    function ptAt(f) { var s = Math.min(240, Math.max(0, f * 240)), i0 = Math.floor(s), i1 = Math.min(240, i0 + 1), fr = s - i0; return { x: PTS[i0][0] + (PTS[i1][0] - PTS[i0][0]) * fr, y: PTS[i0][1] + (PTS[i1][1] - PTS[i0][1]) * fr }; }
    var gw = null, tw = 0, go = { x: sgn.x, y: sgn.y - 60 }, gh = 20;
    if (gv && email) {
      gv.innerHTML = '<span class="gw"></span>'; gw = gv.firstChild; gw.textContent = email;
      tw = gw.offsetWidth || 120;
      if (tw > gv.offsetWidth - 10) { gw.style.fontSize = (parseFloat(getComputedStyle(gw).fontSize) * (gv.offsetWidth - 10) / tw).toFixed(1) + 'px'; tw = gw.offsetWidth; }
      go = offs(gw, clone); gh = gw.offsetHeight; inkMask(gw, 0);
    }
    var stX = Math.min(CW * .68, CW - 95), stY = Math.max(110, sgn.y - 150);
    st.style.left = stX + 'px'; st.style.top = stY + 'px';

    /* ---------- ปากกา: วัตถุแข็งชิ้นเดียวที่ขยับได้จริง (แทนมือที่งอข้อต่อไม่ได้) ----------
       ปากกาวางบนโต๊ะ → ถูกยกขึ้น → เขียนอีเมล → ยกข้ามไปเซ็น → วางกลับที่เดิม
       ปลายปากกาอยู่ที่จุด (0,0) ของชิ้น เคลื่อนด้วย transform อย่างเดียว (ไม่กระทบ layout) */
    var PS = mob ? .62 : .8;
    var pen = document.createElement('div'); pen.className = 'gh-penw';
    pen.innerHTML = '<img class="pn" src="data:image/webp;base64,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" alt="" draggable="false" decoding="async">';
    var psh = document.createElement('div'); psh.className = 'gh-pensh';
    clone.appendChild(psh); clone.appendChild(pen);
    var REST = { x: CW + (mob ? 6 : 26), y: CH * .70, rot: -22, lift: 0 }, HOLD = -38;
    function penAt(x, y, rot, lift) {
      var s = PS * (1 + lift * .05);
      pen.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y - lift * 10).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
      psh.style.transform = 'translate3d(' + (x + 4 + lift * 16).toFixed(1) + 'px,' + (y + 5 + lift * 14).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + PS.toFixed(3) + ')';
      psh.style.opacity = (.55 - lift * .3).toFixed(2);
    }
    penAt(REST.x, REST.y, REST.rot, 0);
    var bead = document.createElement('i'); bead.className = 'ink-bead'; bead.style.left = go.x + 'px'; bead.style.top = (go.y + gh * .64) + 'px'; clone.appendChild(bead);

    /* จังหวะเขียน: ความเร็วแกว่งตามธรรมชาติแต่ไม่หยุดนิ่ง (ไม่ใช่ linear และไม่สะดุด) */
    function smooth(p) { return .5 - .5 * Math.cos(Math.PI * Math.min(1, Math.max(0, p))); }
    function pace(p) { var b0 = smooth(p), n = 5, a = .28; return Math.min(1, Math.max(0, b0 + a * Math.sin(2 * Math.PI * n * b0) / (2 * Math.PI * n))); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function inkMask(el, x) { var m = 'linear-gradient(90deg,#000 ' + Math.max(0, x - 8).toFixed(1) + 'px,rgba(0,0,0,.4) ' + x.toFixed(1) + 'px,transparent ' + (x + 5).toFixed(1) + 'px)'; el.style.webkitMaskImage = m; el.style.maskImage = m; }
    function blot(x, y, rr) { var bb = document.createElement('i'); bb.className = 'ink-blot'; bb.style.cssText = 'left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;width:' + (rr * 2) + 'px;height:' + (rr * 2) + 'px'; clone.appendChild(bb);
      A(bb, [{ transform: 'scale(.3)', opacity: .85 }, { transform: 'scale(1)', opacity: .7 }], { duration: 500, easing: EASE_OUT, fill: 'both' }); }

    /* ---------- ลำดับเวลา (ms จากจุดเริ่ม) ---------- */
    var P0 = 800, PICK = 650;                                   /* ยกปากกาจากโต๊ะไปจุดเริ่มอีเมล */
    var W0 = P0 + PICK, WRITE = gw ? Math.max(1300, Math.min(2300, 700 + email.length * 62)) : 0;
    var G0 = W0 + WRITE, GAP = 460;                            /* ยกข้ามไปที่ลายเซ็น */
    var S0 = G0 + GAP, SIG = SL ? 1250 : 0;
    var R0 = S0 + SIG, RET = 700;                              /* วางปากกากลับที่เดิม */
    var D = R0 + 320;                                          /* ตราเริ่มลง (หลังปากกาพ้นบริเวณลายเซ็นแล้ว) */
    var CONTACT = D + 520, LK = D + 1250, EXIT = LK + 4000;
    var e1 = { x: go.x + 2, y: go.y + gh * .8 }, s0 = SL ? sp.getPointAtLength(0) : { x: 0, y: 0 }, sEnd = SL ? sp.getPointAtLength(SL) : { x: 0, y: 0 };
    var sigStart = { x: sigX + s0.x * k, y: sigY + s0.y * k }, sigEnd = { x: sigX + sEnd.x * k, y: sigY + sEnd.y * k };
    var lastX = 0, rotC = REST.rot;

    function frame(t) {                                          /* เรียกจาก rAF เดียว */
      var x, y, rot = HOLD, lift = 0, u;
      if (t < P0) { x = REST.x; y = REST.y; rot = REST.rot; lift = 0; }
      else if (t < W0) { u = smooth((t - P0) / PICK); x = lerp(REST.x, e1.x, u); y = lerp(REST.y, e1.y, u); rot = lerp(REST.rot, HOLD, u); lift = Math.sin(Math.PI * u) * .9 + (u > .85 ? 0 : 0); }
      else if (t < G0 && gw) {
        var pr = pace((t - W0) / WRITE), xx = pr * tw;
        inkMask(gw, xx); bead.style.transform = 'translate3d(' + xx.toFixed(1) + 'px,0,0)'; bead.style.opacity = .85;
        x = e1.x + xx; y = e1.y + Math.sin(pr * Math.PI * 9) * .8; lift = 0;
        if (!frame.s1) { frame.s1 = 1; sfx('scratch', WRITE); }
      }
      else if (t < S0) {
        if (gw && !frame.d1) { frame.d1 = 1; gw.style.webkitMaskImage = gw.style.maskImage = 'none'; gw.classList.add('dry'); bead.style.opacity = 0; }
        u = smooth((t - G0) / GAP); x = lerp(e1.x + tw, sigStart.x, u); y = lerp(e1.y, sigStart.y, u); lift = Math.sin(Math.PI * u);
      }
      else if (t < R0 && SL) {
        if (!frame.b1) { frame.b1 = 1; blot(sigStart.x, sigStart.y, 2.6); sfx('scratch', SIG); }
        var p2 = pace((t - S0) / SIG), pt = ptAt(p2);
        sp.style.strokeDashoffset = (SL * (1 - p2)).toFixed(1);
        x = sigX + pt.x * k; y = sigY + pt.y * k; lift = 0;
      }
      else if (t < R0 + RET) {
        if (!frame.b2) { frame.b2 = 1; sp.style.strokeDashoffset = 0; blot(sigEnd.x, sigEnd.y, 2.2); }
        u = smooth((t - R0) / RET); x = lerp(sigEnd.x, REST.x, u); y = lerp(sigEnd.y, REST.y, u); rot = lerp(HOLD, REST.rot, u); lift = Math.sin(Math.PI * u) * .9;
      }
      else { x = REST.x; y = REST.y; rot = REST.rot; lift = 0; }
      /* ปากกาเอียงตามความเร็วแนวนอนเล็กน้อย (หน่วงนุ่ม ไม่สั่น) */
      if (rot === HOLD) { var vx = x - lastX; rotC += ((HOLD + Math.max(-4, Math.min(4, -vx * .9))) - rotC) * .18; rot = rotC; } else rotC = rot;
      lastX = x; penAt(x, y, rot, lift);
    }
    function tick(now) {
      if (TL.dead) return;
      var t = now - TL.t0;
      frame(t);
      for (var i = 0; i < TL.cues.length; i++) { var c = TL.cues[i]; if (!c.done && t >= c.at) { c.done = 1; c.fn(); } }
      if (t < EXIT + 900) TL.raf = requestAnimationFrame(tick);
    }

    /* ---------- อนิเมชันทั้งหมด (WAAPI อ้างเวลาเริ่มเดียวกัน) ---------- */
    A(dim, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: EASE_OUT, fill: 'both' });
    g.style.transformOrigin = '50% 70%';
    A(g, [{ opacity: 0, transform: 'translate3d(0,56px,0) rotate(2.5deg)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: SETTLE, fill: 'both' });
    A(cs, [{ opacity: 0, transform: 'translate3d(0,40px,0) scale(1.1)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: SETTLE, fill: 'both' });
    try { ['::before', '::after'].forEach(function (pe, n) {
      var fin = getComputedStyle(clone, pe).transform; if (!fin || fin === 'none') return;
      A(clone, [{ transform: fin + (n ? ' translate(-14px,24px)' : ' translate(12px,18px)') }, { transform: fin }], { duration: 1000, delay: 80 + n * 90, easing: SETTLE, fill: 'both', pseudoElement: pe });
    }); } catch (e) {}
    /* แสงเล่าเรื่อง: เริ่มมืด สว่างตามการเขียน สงบหลังประทับตรา */
    var ls = document.createElement('i'); ls.className = 'ls-shade'; clone.appendChild(ls);
    A(ls, [{ opacity: .6 }, { opacity: .1 }], { duration: Math.max(800, G0 - 300), delay: 300, easing: EASE_IO, fill: 'both' });
    /* ตรา: เคลื่อนลง (เร่งเล็กน้อย) → สัมผัส → กดลงเล็กน้อย → ยกแรงออก ไม่เด้ง */
    cue(D, function () {
    /* พิธีประทับตราจริง: หยดขี้ผึ้งแดงแผ่ตัว → ตราทองเหลืองเลื่อนลงมา (เงาค่อยๆ คมชัด) → กดลง → ยกออก เผยรอยตรา VC ในขี้ผึ้ง */
    var SZ = st.offsetWidth || 118;
    var pool = document.createElement('i'); pool.className = 'wx-pool'; var PS2 = SZ * 1.12; pool.style.cssText = 'left:' + stX + 'px;top:' + stY + 'px;width:' + PS2 + 'px;height:' + PS2 + 'px;margin:-' + PS2 / 2 + 'px 0 0 -' + PS2 / 2 + 'px'; clone.appendChild(pool);
    A(pool, [{ opacity: 0, transform: 'scale(.12) rotate(-10deg)' }, { opacity: 1, transform: 'scale(.55) rotate(-4deg)', offset: .3 }, { opacity: 1, transform: 'scale(1.04) rotate(3deg)' }], { duration: 560, easing: 'cubic-bezier(.15,.75,.3,1)', fill: 'both' });
    A(pool, [{ opacity: 1 }, { opacity: 0 }], { duration: 80, delay: 560, fill: 'forwards' });
    var TS = SZ * 1.18, tool = document.createElement('div'); tool.className = 'wx-tool';
    tool.style.cssText = 'left:' + stX + 'px;top:' + stY + 'px;width:' + TS + 'px;height:' + TS + 'px;margin:-' + TS / 2 + 'px 0 0 -' + TS / 2 + 'px';
    tool.innerHTML = '<img src="data:image/webp;base64,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" alt="" draggable="false">';
    var tsh = document.createElement('i'); tsh.className = 'wx-tsh'; tsh.style.cssText = tool.style.cssText;
    clone.appendChild(tsh); clone.appendChild(tool);
    /* ลงมา: ขนาดลดเข้าหาจริง เงาเลื่อนเข้าหาตัวและคมขึ้น (ความสูงจากกระดาษลดลง) */
    A(tool, [{ opacity: 0, transform: 'translate3d(-26px,-70px,0) scale(1.55)' }, { opacity: 1, transform: 'translate3d(-14px,-38px,0) scale(1.3)', offset: .3 }, { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }], { duration: 420, delay: 100, easing: 'cubic-bezier(.55,0,.85,.45)', fill: 'both' });
    A(tsh, [{ opacity: 0, transform: 'translate3d(46px,58px,0) scale(1.25)' }, { opacity: .7, transform: 'translate3d(4px,6px,0) scale(1)' }], { duration: 420, delay: 100, easing: 'cubic-bezier(.55,0,.85,.45)', fill: 'both' });
    /* กด: ยุบลงเล็กน้อยค้างไว้ครู่หนึ่ง */
    A(tool, [{ transform: 'scale(1)' }, { transform: 'scale(.965)', offset: .3 }, { transform: 'scale(.965)', offset: .7 }, { transform: 'scale(.98)' }], { duration: 220, delay: 520, easing: 'ease-out', fill: 'none', composite: 'replace' });
    /* ยกออก: ลอยขึ้นและจาง เงาห่างออก เผยรอยตรา */
    A(tool, [{ opacity: 1, transform: 'translate3d(0,0,0) scale(.98)' }, { opacity: 0, transform: 'translate3d(30px,-80px,0) scale(1.45)' }], { duration: 520, delay: 760, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
    A(tsh, [{ opacity: .7, transform: 'translate3d(4px,6px,0) scale(1)' }, { opacity: 0, transform: 'translate3d(60px,70px,0) scale(1.3)' }], { duration: 520, delay: 760, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
    st.style.transform = 'rotate(-8deg)';
    A(st, [{ opacity: 0 }, { opacity: 1 }], { duration: 90, delay: 530, easing: 'linear', fill: 'both' });
    A(clone, [{ transform: 'translateY(0)' }, { transform: 'translateY(1.5px)', offset: .35 }, { transform: 'translateY(0)' }], { duration: 300, delay: 520, easing: EASE_OUT });
    var cap = st.querySelector('.wx-cap');
    if (cap) A(cap, [{ opacity: 0, transform: 'translateX(-50%) translateY(4px)' }, { opacity: 1, transform: 'translateX(-50%)' }], { duration: 560, delay: 1000, easing: SETTLE, fill: 'both' });
    });
    cue(CONTACT, function () { sfx('seal'); try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {} });
    /* เลขที่เอกสารเฉพาะตัว (คำนวณจากอีเมล + เวลาเข้าสู่ระบบจริง) พิมพ์ทีละตัวแบบเครื่องพิมพ์ดีด */
    var hsh = 0; for (var hi = 0; hi < email.length; hi++) hsh = (hsh * 31 + email.charCodeAt(hi)) >>> 0;
    var now0 = new Date(), TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    var serial = 'เลขที่ VC-' + now0.getFullYear() + '-' + (hsh % 0xFFFF).toString(16).toUpperCase().padStart(4, '0') + ' · ' + now0.getDate() + ' ' + TH[now0.getMonth()] + ' ' + String(now0.getHours()).padStart(2, '0') + ':' + String(now0.getMinutes()).padStart(2, '0');
    var serEl = document.createElement('p'); serEl.className = 'gh-serial'; serEl.style.cssText = 'right:' + (mob ? 22 : 30) + 'px;top:' + (mob ? 30 : 40) + 'px;text-align:right' + (mob ? ';font-size:.54rem' : ''); clone.appendChild(serEl);
    cue(CONTACT + 520, function () { var i0 = 0, t1 = performance.now(); (function ty(n) { if (TL.dead) return; var k2 = Math.min(serial.length, Math.floor((n - t1) / 26)); if (k2 !== i0) { i0 = k2; serEl.textContent = serial.slice(0, k2); } if (k2 < serial.length) requestAnimationFrame(ty); })(t1); });
    /* (ตัดออกตามผู้ใช้: ช่วงเอกสารหมุนเข้าตรงก่อนตราลอยขึ้น) */
    /* ---------- The Document Journey: เอกสารที่ประทับตราแล้วเดินทางเข้าไปที่ "บัญชีของฉัน" ----------
       1) ตราเสร็จ ทุกอย่างนิ่ง (ช่วงล็อกด้านบน)  2) ยกกระดาษขึ้นจากโต๊ะ เงาห่างออก ปากกาอยู่บนโต๊ะ
       3) เคลื่อนไปที่ปุ่มบัญชี (คอม: เมนูบนสุด / มือถือ: แถบล่าง) ย่อขนาดระหว่างทาง ไม่หมุนแบบการ์ด
       4) ถึงปุ่มแล้วปุ่มรับแรงกดเบาๆ หน้าบัญชีจริง (ไม่ใช่ภาพจำลอง) ค่อยๆ ปรากฏทีละส่วน */
    function target() {
      var cands = mob ? ['#bottomNav [data-nav="acct"]', '#authToggle'] : ['.dx-nav a[href="#authCard"]', '#authToggle'];
      for (var i = 0; i < cands.length; i++) { var el = document.querySelector(cands[i]); if (el) { var rr = el.getBoundingClientRect(); if (rr.width > 0 && rr.height > 0) return { el: el, r: rr }; } }
      return null;
    }
    var J0 = LK + 700, LIFT = 450, TRAVEL = 1450, ARRIVE = 650;
    EXIT = J0 + LIFT + TRAVEL + ARRIVE;
    cue(J0, function () {
      /* ปากกาและเงาปากกาอยู่บนโต๊ะ: จางลงแทนการติดไปกับกระดาษ */
      A(pen, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: EASE_OUT, fill: 'forwards' });
      A(psh, [{ opacity: .55 }, { opacity: 0 }], { duration: 300, easing: EASE_OUT, fill: 'forwards' });
      /* ยกขึ้น: กระดาษ (pose) ขยายนิด เงาสัมผัสห่างและนุ่มลง */
      A(wrap, [{ transform: 'none' }, { transform: 'translate3d(0,-12px,0) scale(1.03)' }], { duration: LIFT, easing: EASE_IO, fill: 'forwards' });
      A(cs, [{ opacity: 1, transform: 'none' }, { opacity: .55, transform: 'translate3d(10px,22px,0) scale(1.04)' }], { duration: LIFT, easing: EASE_IO, fill: 'forwards' });
    });
    cue(J0 + LIFT, function () {
      /* ---------- Seal Iris: ตราลอยขึ้นจากกระดาษ → ม่านมืดเปิดเป็นวงจากตรา เผยหน้าบัญชีจริง → ตราลอยเข้าปุ่มบัญชี
         ใช้ transform/opacity ล้วน (ม่านเป็นวงกลมที่มีเงาทึบรอบนอก แล้วขยายด้วย scale) ไม่มีแสงจ้า ---------- */
      var tg = target(), sr = st.getBoundingClientRect();
      var av = document.querySelector('#authLoggedIn .acct-avatar'), avr = av && av.getBoundingClientRect();
      if (avr && avr.width > 0 && avr.bottom > 0 && avr.top < innerHeight) tg = { el: av, r: { left: avr.right - 16, top: avr.bottom - 16, width: 22, height: 22 }, avatar: true };
      var scx = sr.left + sr.width / 2, scy = sr.top + sr.height / 2;
      var tx = tg ? tg.r.left + tg.r.width / 2 : innerWidth / 2, ty = tg ? tg.r.top + tg.r.height / 2 : (mob ? innerHeight - 30 : 32);
      var far = Math.max(Math.hypot(scx, scy), Math.hypot(innerWidth - scx, scy), Math.hypot(scx, innerHeight - scy), Math.hypot(innerWidth - scx, innerHeight - scy));
      var R0 = 40, SMAX = (far + 80) / R0;
      var iris = document.createElement('i'); iris.className = 'si-iris';
      iris.style.cssText = 'left:' + scx.toFixed(0) + 'px;top:' + scy.toFixed(0) + 'px;width:' + (R0 * 2) + 'px;height:' + (R0 * 2) + 'px;margin:-' + R0 + 'px 0 0 -' + R0 + 'px';
      document.body.appendChild(iris);
      var sv = st.querySelector('.wx-img'), seal = document.createElement('div'); seal.className = 'si-seal';
      seal.innerHTML = sv ? sv.outerHTML : '';
      seal.style.cssText = 'left:' + scx.toFixed(0) + 'px;top:' + scy.toFixed(0) + 'px;width:' + sr.width.toFixed(0) + 'px;height:' + sr.height.toFixed(0) + 'px;margin:-' + (sr.height / 2).toFixed(0) + 'px 0 0 -' + (sr.width / 2).toFixed(0) + 'px';
      document.body.appendChild(seal);
      st.style.visibility = 'hidden';
      [skip, snd].forEach(function (n) { A(n, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }); });
      /* 1) ตราลอยขึ้นเล็กน้อย เงาห่างออก · กระดาษจางลงใต้ตรา (0–500ms) */
      A(seal, [{ transform: 'translate3d(0,0,0) rotate(-8deg) scale(1)', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.5))' },
               { transform: 'translate3d(0,-10px,0) rotate(-4deg) scale(1.18)', filter: 'drop-shadow(0 16px 14px rgba(0,0,0,.45))' }], { duration: 500, easing: EASE_IO, fill: 'forwards' });
      A(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, delay: 120, easing: EASE_IO, fill: 'forwards' });
      A(cs, [{ opacity: .55 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      /* 2) ม่านมืดสลับเป็นวงเปิดจากตรา แล้วขยายจนเห็นหน้าบัญชีเต็มจอ (450–1450ms) */
      A(iris, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 300, easing: 'linear', fill: 'both' });
      A(dim, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: 450, easing: 'linear', fill: 'forwards' });
      A(iris, [{ transform: 'scale(.5)' }, { transform: 'scale(' + SMAX.toFixed(2) + ')' }], { duration: 1000, delay: 450, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' });
      /* 3) ตราลอยโค้งไปเข้าปุ่มบัญชี ย่อลงเท่าปุ่ม (700–1500ms) */
      var dx = tx - scx, dy = ty - scy, sEnd = Math.max(.18, Math.min(.4, (tg ? tg.r.height + 6 : 30) / sr.height));
      A(seal, [{ transform: 'translate3d(0,-10px,0) rotate(-4deg) scale(1.18)', opacity: 1 },
               { transform: 'translate3d(' + (dx * .5).toFixed(0) + 'px,' + (dy * .5 - 40).toFixed(0) + 'px,0) rotate(0deg) scale(.7)', opacity: 1, offset: .55 },
               { transform: 'translate3d(' + dx.toFixed(0) + 'px,' + dy.toFixed(0) + 'px,0) rotate(0deg) scale(' + sEnd.toFixed(3) + ')', opacity: 0 }],
        { duration: 800, delay: 700, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
      /* 4) ปุ่มบัญชีรับตรา: ยุบเบาๆ + ขอบเงินจางๆ */
      if (tg && tg.avatar) cue(J0 + LIFT + 1480, function () {
        var old = tg.el.querySelector('.av-seal'); if (old) old.parentNode.removeChild(old);
        var mini = document.createElement('i'); mini.className = 'av-seal'; mini.setAttribute('aria-hidden', 'true'); mini.innerHTML = sv ? sv.outerHTML : ''; tg.el.appendChild(mini);
        mini.animate([{ transform: 'scale(1.35)', opacity: .6 }, { transform: 'scale(.92)', opacity: 1, offset: .55 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.3,0,.2,1)' });
      });
      if (tg && !tg.avatar) A(tg.el, [{ transform: 'none', boxShadow: '0 0 0 0 rgba(214,218,226,0)' }, { transform: 'scale(.94)', boxShadow: '0 0 0 3px rgba(214,218,226,.45)', offset: .35 }, { transform: 'none', boxShadow: '0 0 0 8px rgba(214,218,226,0)' }],
        { duration: 600, delay: 1400, easing: EASE_OUT });
      sfx('paper');
      TL.anims.push({ cancel: function () { [iris, seal].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); } });
    });
    cue(J0 + LIFT + 420, function () {
      /* หน้าบัญชีจริงค่อยๆ ปรากฏทีละส่วน (แค่ opacity/transform ชั่วคราว ไม่แตะข้อมูล) */
      var li = document.getElementById('authLoggedIn'); if (!li || li.hidden) return;
      ['walletTotal', 'walletRowCheck', 'walletRowVoice'].forEach(function (id, ix) {
        var el = document.getElementById(id); if (!el) return; var fin = parseInt((el.textContent || '').replace(/[^\d]/g, ''), 10); if (!(fin > 0)) return;
        var raw = el.textContent, t1 = performance.now() + 250 + ix * 120, D2 = Math.min(900, 400 + fin * 60);
        (function cu(nw) { if (TL.dead) { el.textContent = raw; return; } var q = Math.max(0, Math.min(1, (nw - t1) / D2)), e = 1 - Math.pow(1 - q, 3);
          el.textContent = String(Math.round(fin * e)); if (q < 1) requestAnimationFrame(cu); else el.textContent = raw; })(performance.now());
      });
      var parts = li.querySelectorAll('.cred-head, .acct-row, .wallet-total, .wallet, .wallet-quick'); var n = 0;
      Array.prototype.forEach.call(parts, function (el) { if (!el.offsetParent || n > 5) return;
        A(el, [{ opacity: 0, transform: 'translate3d(0,10px,0)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: n++ * 80, easing: SETTLE, fill: 'backwards' }); });
    });
    cue(EXIT + 200, kill);

    /* ล็อกเวลาเริ่มของทุกอนิเมชันให้ตรงกับนาฬิกาเดียวกัน */
    TL.t0 = performance.now();
    var tl0 = document.timeline ? document.timeline.currentTime : null;
    if (tl0 != null) TL.anims.forEach(function (x) { try { x.startTime = tl0; } catch (e) {} });
    sfx('paper');
    TL.raf = requestAnimationFrame(tick);
    window.__vcRitual = { TL: TL, times: { P0: P0, W0: W0, G0: G0, S0: S0, R0: R0, D: D, CONTACT: CONTACT, LK: LK, J0: LK + 700, EXIT: EXIT } };
  }

  function onLoggedIn() {
    var gAt = 0; try { gAt = Number(sessionStorage.getItem(GKEY) || 0); sessionStorage.removeItem(GKEY); } catch (x) {}
    var fromForm = intent && (Date.now() - intent.t) < 15000;
    var fromGoogle = gAt && (Date.now() - gAt) < 180000;
    if (!fromForm && !fromGoogle) return;
    var info = fromForm ? intent : { rect: null, email: '' };
    intent = null;
    /* ล็อกอินด้วย Google หรือกรอกอัตโนมัติ: ไม่มีอีเมลที่จดไว้ → อ่านจากการ์ดบัญชีที่เพิ่งแสดงขึ้น */
    function userMail() { var u = document.getElementById('userEmail'); return u ? (u.textContent || '').trim() : ''; }
    if (info.email) { play(info); return; }
    var tries = 0;
    (function wait() {
      var m = userMail();
      if (m || tries++ > 12) { play({ rect: info.rect, email: m }); return; }
      setTimeout(wait, 120);
    })();
  }
  function init() {
    if (/[?&]stampdemo=1/.test(location.search)) setTimeout(function () { var tg = document.getElementById('authToggle'); if (innerWidth < 768 && tg && !document.body.classList.contains('auth-open')) tg.click(); }, 2400);
    if (/[?&]stampdemo=1/.test(location.search)) setTimeout(function () { var d = docEl(), r = d && d.getBoundingClientRect(); play({ rect: r && r.width > 50 ? { left: r.left, top: r.top, width: r.width, height: r.height } : null, email: 'somchai@example.com' }); }, 3500);
    var li = document.getElementById('authLoggedIn'); if (!li || !('MutationObserver' in window)) return;
    var wasHidden = li.hidden;
    new MutationObserver(function () {
      if (wasHidden && !li.hidden) { wasHidden = false; onLoggedIn(); }
      else if (li.hidden) wasHidden = true;
    }).observe(li, { attributes: true, attributeFilter: ['hidden'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* ===== โต๊ะเขียนเอกสาร: สร้างกองเอกสาร ขอบกระดาษไหม้ และอนิเมชันมือเซ็นชื่อ (29 ต.ค. 2026) =====
   - กองเอกสาร: แผ่นสุ่มแบบกำหนดค่าเริ่มต้นคงที่ (seed) ซ้อนกัน 46 แผ่น มีแท็บสี ตราแดงบางแผ่น
   - ขอบกระดาษ: ชั้น .ad-rim (ขอบไหม้เข้ม) กับ .ad-face (หน้ากระดาษ) ตัดด้วย clip-path polygon ขอบเว้าแหว่ง (seed คงที่)
     แทรกเป็นลูกแรกของ .auth-doc (ตัวคัดลอกในตราประทับจึงได้ขอบเดียวกัน)
   - มือ: ปากกาเคลื่อนไปตามเส้นลายเซ็น (SVG getPointAtLength) หมึกถูกวาดตามด้วย stroke-dashoffset
     วน: เขียน 3.4 วินาที → ค้าง → จางหาย → พัก แล้วเขียนใหม่ · หยุดเมื่อไม่อยู่ในจอ · ลดการเคลื่อนไหว = ลายเซ็นเสร็จแล้ว มือวางนิ่ง */
(function () {
  'use strict';
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  var PILE_SVG = '<defs>\n<linearGradient id="pvL1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3a22"/><stop offset="1" stop-color="#3a1d10"/></linearGradient>\n<linearGradient id="pvL2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f4a3a"/><stop offset="1" stop-color="#15271d"/></linearGradient>\n<linearGradient id="pvL3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2530"/><stop offset="1" stop-color="#2c0f16"/></linearGradient>\n<linearGradient id="pvPg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2cfa0"/><stop offset="1" stop-color="#b79c66"/></linearGradient>\n<linearGradient id="pvMan" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfa968"/><stop offset="1" stop-color="#9c7a40"/></linearGradient>\n<linearGradient id="pvScr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e1b6"/><stop offset=".5" stop-color="#d8c18a"/><stop offset="1" stop-color="#9f8450"/></linearGradient>\n<pattern id="pvLines" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height=".8" y="2" fill="rgba(70,45,15,.35)"/></pattern>\n</defs>\n<ellipse cx="170" cy="250" rx="165" ry="12" fill="rgba(0,0,0,.55)"/>\n<!-- แฟ้มสีน้ำตาลเก่า วางเฉียงด้านหลัง มีกระดาษโผล่ -->\n<g transform="rotate(-5 220 190)">\n<rect x="120" y="150" width="190" height="90" rx="2" fill="#e5d3a5"/>\n<rect x="124" y="140" width="186" height="90" rx="2" fill="#d9c593"/>\n<rect x="116" y="130" width="196" height="108" rx="3" fill="url(#pvMan)"/>\n<path d="M116 130 H170 L178 120 H236 L244 130 H312" fill="none" stroke="rgba(60,40,15,.5)" stroke-width="1.2"/>\n<rect x="190" y="126" width="60" height="9" rx="2" fill="#7b4a2a" opacity=".55"/>\n<path d="M130 150 H300 M130 164 H300" stroke="rgba(60,40,15,.25)" stroke-width="1"/>\n<path d="M214 130 C214 160 218 190 224 238" fill="none" stroke="#9c2d2a" stroke-width="2"/>\n<path d="M214 130 C206 160 210 190 218 238" fill="none" stroke="#7d2220" stroke-width="1.5"/>\n</g>\n<!-- สมุดบัญชีเล่มหนา 3 เล่ม ซ้อนกัน -->\n<g>\n<rect x="14" y="204" width="246" height="38" rx="3" fill="url(#pvL1)"/>\n<rect x="22" y="212" width="236" height="22" fill="url(#pvPg)"/>\n<rect x="22" y="212" width="236" height="22" fill="url(#pvLines)"/>\n<rect x="14" y="204" width="246" height="7" rx="3" fill="#7a4628"/>\n<rect x="14" y="236" width="246" height="6" rx="3" fill="#2d160b"/>\n<rect x="8" y="204" width="14" height="38" rx="4" fill="#55301b"/>\n<path d="M12 212 H22 M12 224 H22 M12 234 H22" stroke="#d3ac55" stroke-width="1.6"/>\n</g>\n<g transform="rotate(-2.5 140 190)">\n<rect x="34" y="170" width="220" height="34" rx="3" fill="url(#pvL2)"/>\n<rect x="42" y="177" width="210" height="20" fill="url(#pvPg)"/>\n<rect x="42" y="177" width="210" height="20" fill="url(#pvLines)"/>\n<rect x="34" y="170" width="220" height="6" rx="3" fill="#3f6150"/>\n<rect x="34" y="198" width="220" height="6" rx="3" fill="#0f1c15"/>\n<rect x="28" y="170" width="14" height="34" rx="4" fill="#1d3226"/>\n<path d="M32 178 H42 M32 188 H42 M32 198 H42" stroke="#d3ac55" stroke-width="1.6"/>\n</g>\n<g transform="rotate(1.8 140 160)">\n<rect x="50" y="140" width="190" height="30" rx="3" fill="url(#pvL3)"/>\n<rect x="58" y="146" width="180" height="18" fill="url(#pvPg)"/>\n<rect x="58" y="146" width="180" height="18" fill="url(#pvLines)"/>\n<rect x="50" y="140" width="190" height="6" rx="3" fill="#7a3441"/>\n<rect x="50" y="164" width="190" height="6" rx="3" fill="#1f0a10"/>\n<rect x="44" y="140" width="14" height="30" rx="4" fill="#3d1620"/>\n<path d="M48 147 H58 M48 155 H58 M48 163 H58" stroke="#d3ac55" stroke-width="1.6"/>\n<rect x="150" y="142" width="26" height="22" rx="1" fill="#d8c08a" opacity=".0"/>\n</g>\n<!-- ม้วนหนังสือผูกริบบิ้นพร้อมตราขี้ผึ้ง วางด้านหน้า -->\n<g transform="rotate(-8 150 232)">\n<ellipse cx="156" cy="244" rx="104" ry="8" fill="rgba(0,0,0,.45)"/>\n<rect x="64" y="216" width="190" height="28" rx="14" fill="url(#pvScr)"/>\n<ellipse cx="66" cy="230" rx="9" ry="14" fill="#c4a96c"/>\n<ellipse cx="66" cy="230" rx="5" ry="8.5" fill="#8a7040"/>\n<ellipse cx="252" cy="230" rx="9" ry="14" fill="#d9c58f"/>\n<path d="M150 216 C146 226 146 236 150 244 M162 216 C158 226 158 236 162 244" stroke="#8c2a2a" stroke-width="3.2" fill="none"/>\n<path d="M156 244 C152 254 148 262 142 266 M158 244 C162 254 168 260 172 264" stroke="#8c2a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>\n<circle cx="156" cy="232" r="11" fill="#8f1f1d"/><circle cx="156" cy="232" r="7.5" fill="none" stroke="#c0453f" stroke-width="1.4"/>\n<circle cx="153" cy="229" r="3" fill="rgba(255,200,190,.4)"/>\n</g>\n';
  function pile() {
    var box = document.querySelector('.ld-pile'); if (!box || box.__built) return; box.__built = true;
    box.innerHTML = '<svg viewBox="0 0 320 270" focusable="false" aria-hidden="true">' + PILE_SVG + '</svg>';
    /* ชั้นหนังสือบนผนัง: สันหนังสือสุ่มแบบ seed คงที่ 2 ชั้น */
    var sh = document.querySelector('.ld-books'); if (!sh || sh.__built) return; sh.__built = true;
    var r = rng(77123), cols = ['#4a2a1a', '#2f4636', '#5a2a34', '#3a3550', '#6b4a24', '#2b2b2f', '#5b3b2a', '#40301f'];
    for (var row = 0; row < 2; row++) {
      var line = document.createElement('div'); line.className = 'bk-row';
      for (var i = 0; i < 24; i++) {
        var b = document.createElement('i'), c = cols[Math.floor(r() * cols.length)];
        b.style.cssText = 'width:' + (10 + r() * 18).toFixed(0) + 'px;height:' + (62 + r() * 38).toFixed(0) + '%;background:linear-gradient(90deg,rgba(0,0,0,.45),rgba(255,255,255,.07) 40%,rgba(0,0,0,.4)),' + c + (r() < .5 ? ';box-shadow:inset 0 10px 0 -8px #c9a557,inset 0 -10px 0 -8px #c9a557' : '') + (r() < .08 ? ';transform:rotate(' + (4 + r() * 5).toFixed(1) + 'deg);transform-origin:bottom left' : '');
        line.appendChild(b);
      }
      sh.appendChild(line);
    }
  }


  function extras() {
    var sc = document.querySelector('.ld-scene'); if (!sc || sc.__ex) return; sc.__ex = true;
    var lamp = sc.querySelector('.ld-lamp');
    if (lamp) { lamp.setAttribute('role', 'button'); lamp.setAttribute('tabindex', '0'); lamp.setAttribute('aria-label', 'เปิด/ปิดตะเกียง'); lamp.removeAttribute('aria-hidden');
      var flip = function () { var cur = sc.getAttribute('data-lamp'); if (!cur) cur = parseFloat(getComputedStyle(sc).getPropertyValue('--on')) > .5 ? 'on' : 'off'; sc.setAttribute('data-lamp', cur === 'on' ? 'off' : 'on'); };
      lamp.addEventListener('click', flip); lamp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }); }
    var desk = sc.querySelector('.ld-desk'), mk = function (cls, html, vb) { var d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); if (html) d.innerHTML = '<svg viewBox="' + vb + '" focusable="false">' + html + '</svg>'; return d; };
    sc.insertBefore(mk('ld-bag', '<image href="data:image/webp;base64,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" x="0" y="-66" width="260" height="486"/>', '0 -66 260 486'), sc.querySelector('.ld-lamp'));
    var cup = mk('ld-cup', '<defs>\n<radialGradient id="cpS" cx=".32" cy=".28" r="1"><stop offset="0" stop-color="#fffdf8"/><stop offset=".55" stop-color="#e9e3d4"/><stop offset="1" stop-color="#a9a291"/></radialGradient>\n<linearGradient id="cpRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d9d3c3"/><stop offset="1" stop-color="#8f8978"/></linearGradient>\n<radialGradient id="cpWell" cx=".6" cy=".62" r=".9"><stop offset="0" stop-color="#fbf8ef"/><stop offset=".7" stop-color="#e0d9c8"/><stop offset="1" stop-color="#bdb6a4"/></radialGradient>\n<linearGradient id="cpWall" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5a3519"/><stop offset=".6" stop-color="#b9a98c"/><stop offset="1" stop-color="#f1ebdc"/></linearGradient>\n<radialGradient id="cpK" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#8f5d30"/><stop offset=".45" stop-color="#4f2810"/><stop offset="1" stop-color="#1d0d05"/></radialGradient>\n<linearGradient id="cpH" gradientUnits="userSpaceOnUse" x1="170" y1="90" x2="226" y2="150"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d8d2c2"/><stop offset="1" stop-color="#8d8777"/></linearGradient>\n<linearGradient id="cpSp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fafafc"/><stop offset=".45" stop-color="#a3a5ad"/><stop offset=".75" stop-color="#ececf0"/><stop offset="1" stop-color="#7d7f88"/></linearGradient>\n<radialGradient id="cpSh"><stop offset="0" stop-color="rgba(0,0,0,.62)"/><stop offset=".6" stop-color="rgba(0,0,0,.28)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>\n<radialGradient id="cpCt"><stop offset="0" stop-color="rgba(0,0,0,.5)"/><stop offset=".75" stop-color="rgba(0,0,0,.3)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>\n<radialGradient id="cpGl"><stop offset="0" stop-color="rgba(255,236,190,.95)"/><stop offset="1" stop-color="rgba(255,236,190,0)"/></radialGradient>\n</defs><image href="data:image/webp;base64,UklGRpgpAABXRUJQVlA4WAoAAAAQAAAAZwEAZwEAQUxQSC8SAAANd6GgbRtJSfkDHYjtXhARkQUuXVmCtlnyZ5Avg3wJR5Lktk2tsIQAVfn/D2YCGHyO6P8E4LYPUMyWcbR1ja6qaoKITEDrIKlnAKqSERIEkOScxIEkZyQDIDnmJwHNRjwNZtbz08DMtihLYDHYs0UpZQlf6mv9jaWsob7U+zReX6N4wxbxjtkKv7W8g+W+PB+AmWX5ENNkDCSTmj2QniEBZJzMgXWMDI4AVNUIiYLWMz+JQ6WqQ8kNfV/AVugK7suA3DaSJEn03+w+qjNn9x8RE9A/C0vchwxBXahiAPK++Iq+9XVf07kGOdKs411NHzT/O238lXb+fW29s6u1N6+H7rVZS90vs8OudnnMBm93ZU4vLMj7MadDDmPEcRPSOd/pSz6ib3Ekg0V5LGjW+zbepP/VjiRJgiQ5ZpHVc4sX4P+vBKa7KpzoBYXpyuAmIibA223butu2ttZ6H3MBlJP//0P3i01gzTH6B+mDBYCgPkbEBPybX///Nt4AJr+lIQIZGmNQSMrx/h2eT7CbBpJZEahaI6/p4eo+f8c+5QU3l9USAv0BUaSsKXqt+6Bj7hAH/XtRW2HuWqInxxgrGufCYyFqH542OYc48JnD+ffMRX0CSmbHuueic0khTkSNqVmaYzeZ6Sm4SRemJevf40hlw8W7g2d6PI0gS/AfBeFiqgKZU33GuruKbeNE/N6jQ0po6+Jpq8/MdZYXciD5D4EklwTDnp57Sp1DkvhZQAT6lyI0DggFqei1bixdZ67vmD5kybh9Vs1hNNP3kx1pZUUC0E+g8BsNQMSvBarBa1x54uvZM0evuQQ3TkoOmel79wRKMuBB/KzwmMpPEYCCRJEjiw73/vQWQHDLJJbFmvS9P30eeRQCAphfPLh5IwIii/BPrWMtdUaBoO+WpLXwcJvzPnNUiRgBDP/Xhsh7kcdZuh4chM5GQt8oocrHmvwz585eZQNGwPATGoiACYGstZaLzh4D+iZZumRV32737FU2IMDwoxqIEDrd4lqIbakF2iBL16V87v/LvpQlEIDhBzZEIMB2ah1L6pMUuDdS6Vjx5+3+t9alAAQKP7cQISSkvOzOnlQEt8VSldfe/38b6mLQT+HVCxECOi9DLQnwYsU9OVSXpG/n31MXGwQofIlCBPFsedmizmeZcj8k+bLo85+/z8tRBsHwhQqRYKtrkT7BRt8MWSXl83/u/LUOgWD4tBIBW1nWZKsQ+ka4aq05///zzHUZJDB8YiPAOpm1jlEnVKRvguSjpP///Kc/bAGIjy1ESGLq8HBmsNAGSK7jmNv93j9skFD40oWIYqpGyY2U5P2r8qQ/7+dfBsR7aARMsor0VAm9dXLWsW5///3PD6+fEHkHkAjIyCqpdy/KG6ejyuzb3V4C8U6KiKCxDvfZ6Vp419bYfP/nlT9LEMyNIAIE6wBztg+st0w6Ds3rv89/LUEk3E0JiH0oM1tlvV+SFjr/udYqAcINDSJAahV7N3LeLansue3+KkGQ2xqBVUVNT7wnb1YV5+1uC4LhvkrEzEFx9j5F3iepWHx+9qUEYLi3RpCz5LlrziHvUlXtc+IChHB7jZBqlfc6YL9JGi3vf86LDSB3WCLIkn35uPRJv0Gq8nT6UpD7rAGuFzqqrzjz9owvPv/uJXc7Akn1Pdcf2Tfe3VJU+1z1F3OjAAN0u1zSkLwxNtmfLQNyvyOQDO1jHerkfeE4+rYp8c5HuWUdV7pH74qkyrYFYO6ZgQHK6hZ5U8juugLifY+AQE7byrwnYXKP+Rame9cqZt0OVQxnDgHM7eMilwhD8lYo+k0VIBtoIBNkibPfiay11vlswh5GADuqmp03QsSrEcke/O+o5IDehij3q/8EZDPTW65J3gXwvmqxobkNy9ab0AaMbMkg2dvvQABlinezFwqEVFCMHy4+qcOLjV3dfBPXFzc5X6vYVROB6mdyLH1tyoLOroANXAhmf205vtYz7KzgOuwztr4wyccVdlYC65CTZvJVZUIXmxtBqoMq62uawAICZGMgAmiYEf6C0p06hATcGvMWcd++6OuRpmetDbLHk55ZRl8OSB4N+2yZnuLLHa2Lb5B90ly87xv7i7nnOCZ8q9fS/kxd9JVo1aQ0fLOjpB2hrwNfjkXyrYoQMn1n/GV45L8qELJPCpCLPj91Xfoq6sJZtwHQPv3SRXfkfA0qLe5ns+el6yVb0ldACjrZsIgrVYTmK0zR54KQ3TJAw8UJen2WObcB3K2/32ZdZ8jLk0v7XHrb86A67PGr81jZJXY9QsQR9qs7lum7BdkzA7nPOjpBr6wuzj4PIdyz9+App80rV1W/lsi+C/RaX3i/MBlXWsF9A8nTdTRGrypUnd9HITtvSMXDM7zuiBwimy8dELL0okz6VHDvJOSluuQML1njlXuJbL+GHKXNS469KinB7QOcFDNGr4etdFtk/w1BYwm9IqyxEfcPIaAaRXo1kYtPiSmUSR1qXq+JuoTOgEGJxUh6MXLNGTGHgimLiJeq8SW7jMbAEGtd2P1aojKnBU4BAnZMY+t1JFLmEGISFRQb5oWQoQeEBkGBxJMsv4yQ9eglyChKY0WFXoWSdIPMoqGCGIsXmXj5uhhIg0ftM9Jr0NThZwkOg4FaRUa8SJWzCmUahUV0EukVjFxskYn0yloavQY6hQQnAomY9muItSNTmYHR8QrSVrdwJAyS8Eykp2NdaiRwIhA0h+e0eXqpuAmZSkXLvRvryWaWQOBQGGRXq8RzK6naRsylMmKmpCcDKQLnAqF4xJMdU4rFH06ZnmU91YXDG/QHQ0GYscQzm1oCOBcIXg97Yz0RtWxkOEWzB/G8Uh31Ap0NWKtGVU+E6/CS4TTIolvW05RKxeEAU7An4mlV8gU4HcjSjKynKeHFiEpp0NMU1ZbzYUjE7mU9R2z3CY4HYC0mMs8pilsAx8N2dWUn1lMwck5kRqUdlXlGUXSKOCJi/aRnyKq17zKlzjHnNs9pIhwRW5b6PPAzKMo5ZEQAiWGeQhyVc+GYpNbs0hOk9poxOCSo2ImfAK8MZkhtPCg4jyeOvk9NCSh16L7rCdq4bccEUO6xH08BFTgkRkrjNQ8nW+dQDGqqNJs8nJZ6O5NiV+49PPpIko2Dgplt9GBK0iqjmiD6wVh1PE+LUc0q7ncePUd1L5wThXLte5LHslOLmhQQ2jcjPRZJtGRW0x7z4GqQacFR5sGqKt9dOCgKttkzD6XHP4kMq7UueyYPhTvVhbMCYSZ6LBEPZFzF4XksEItxDch6rEIaHRXFstN5KNdXX40Ma45jces8lB+eFM6KyKWcPBRLQRlWEbt5aKdLGZcQXQo9EmDLwJqIZzTj8uv/39/GmTFlvmMWExukxxpd+piXMFB+KP4580fHhd6six6q+/SoOC935+Ch0+WVkJqUOOl112Mx6yIioyqgmkcPGOY1zqMNrctpSUvr4Z6v9bWY1pn7h4/HSpI6zLCEzrH2YzGaAKk5iSEHtzwYRdIicyrAc2kePNIW0zoUfjRdz9RjTUrMZK+lR8vq5/HAQRFkxj/Io0W1zP6DAvIeSjx+LP60HpZ4eO2tq2fimEi5qw7n0YboKpo5lcJckB6N4GIzKh6JxxcTySHOSBxEOY8H59SHdjGmSu/jmCeI+jgwgzrTfgomKsYhSckLtXhCMXPUFHFCAPeei58harwoGVJRG/OMilk+58TlznNAd6/rwYimImUbPYfhqrWI8wFozlTxlAqUoBjRlGjzpJmt9efBkHDuWs8iNF5p4nTEDL2tp8nWOiIynSJkZvG00egwYTpj6IxWnkb8RBNnQzBn2uF5I7siMp2J0gfPK3b7gGY+s1vriZDDqoY4GTEztOaZoHGRyGQKWjUHz2wyXgp/OqXdWk8FRMsZ4lxEEt2a57JlVYSYS6HKzKHnArZKhMmUwmjlyeSMHIhzgemu8Ozxua5WZCzl2e0rzy57SwLiTERk5W49HThxAcaJiLF2s3h+ye1V08hMylZbL4BgPIlMZJzUgkpegKU9RyXEeQCcs+sILzEnyyUykREZ8xpFQ9nMZNjbR15DRGbJIk5DnDszFV6j8EDVFeMsxMkGLq8CUV2LE2Qce2uIXgXkIHYgmoQI1rAmL0P41loDYhAF63ztOnihnh25FqTmIILEx7wSijNLgHAMxFyES16J2J2LRwwC4PWqj61XgmjQUhjDCNKpCa9FK+CE1AyAJqyv4cVqtDUR4ATEsDQ2r7fSWQuRARSE0nW8IJFMpxri/kXIQIVXrGldqkT2X8Qz6/qSpNp3rSXEzROgZ3M0L1kdUzQY9y7CWm3nVS27T1aBcetEO9IlvOpa5+ZIiWy8vF/bH3lZovt0HQBx3yLQbnl43ZM+NwqIbReIGY7r8MKTZqpsiLsWgWay5qWRTW8tC+OmCWWio5rXPsfsyCNk32eo6+bFR+rGVSFumAGEdE1eHTJ7pwLG/YqQZA43r0/uE7vEuF2gZqZq8vqQoNsHIDuereOD4SscndS1tiD6VimA3J/nMl9jWvqPb9Phex1hX3PeVumr4KyjIXy/J6ZH4avMzH39sObbtRZ7Z4kvdGcdzpkBs0kB5aLP/1/mC83AWpoI4h5FAI5tvlQlvY9DNHscRSi9XXyx2fe5Hp4ze/ReTt/a/moYV13W3s53KAKtI+dNfMkjIPP9iQA2hvqa0mevWP7uiIDsnHMRX1NO1lphAG3Mzxmak/qiCGAAQ3BXgmClRPjCt8EmCdsaBaMZhq9e5XMPxD1518X7jr44q0qdjgT3IwrCa4avXnoQrIBkOwzQRXP46Rj2rKOCEDfD8Nez51h8/tmpBQYgbkTAv2Sd4h1MgqBBMPsgBC4RI/QOgBTwKpZsZISWLgThbVReL9fR+xDxfl7lCm9kor56lbUNP9v0RQW9EUiuvPcmxCGYdXAmvJVxue9j+afovYsAJsrSeXEzLdwoAwLlvVMg4FIl3E/BdDqoeP/TTBGJ99SKdnQYAfGeRT9peuri8KaKqDclAZh7ZiAhLUm8rTEuzg4xN346Og7dNm/tqn0/d10KgXivIpDxnrpeJnlrHDz3kaYQzL0y0PREqya8u2Vq7dttsRPAOwVRb9ZVM9xhX3T+0x/rV+A9ioAkNOs675IGOIqQBIP3JxpgMsdRdPM261C4rMoEkPtrIHumc/mrzuFtlpd3juNQSELEOxOBRLtzXJXwVitqorVEByTeGPN2NlUX3Zt3W9rq8lrSCYD3JAJJZ/CPg/vk/YIwez0O8sJg8H5EA+k+Ox9X7wnv+YTUOqSgAUVvRqRAJhG+fnDnXRfWOYnr0DAC0K1QIJn+Z6//Xr2Tt+3n1h4dx0oSgoJ3IQKS5BR1+eg94Z0XJuBZKSKCwTsQFZjcz63rx1Vn8w0U7BYXSQlg/HixgPR9D3X85+Pck2+AEJlg+1AS/u7nihQwkfady1/Hvu3wPRSJvM2qJAaE+KFiAaRznqwf/73qFr6RsT26hwKodQngJ4qB5AUZH/+5rPuebwWCnmejdKwoEQqgTxKBQpK9Wzquf619m7CbykXsUZWdkYIgfo44QDJnd2r99bH8/x12VEpx0hYyiF/7CSIUojutc68fl2vx2YTvqlmVmdOQVZoaIQH8ySJQIMzmhv1x/dD9nPCN1ZI7me5ay/BTEII/VaQATLj7M1U/Pi7r7z3huytMhakzkHKpEQzgTxNBASbJbOaoy3XpPCd8h4WUg9t0G5VFYUQIoFcRwQBhkslmaf24rNve4dssuVBm6DHLoiIIQkDPFzEAYbh712lfDn/U/Z7hWy0CC6/Zo6yULcABkV/oKaJfKBAlZGaTNR/1teQ7HbZbtbSSPrMjmb0qFYN+EUCPFaH8IkoYMjOU1rqU8zqbXVdrgd2TPRMdZBkjJECQn/QA+YUCEIAeArsqdfiq3NJh61U2I6b7ZFoGu1dRkQMGot9nEY9g0GRqTiqzlupice6EAZRkC1XYs6fj/DRVAUsgpN8SArAtJtmXvVedXEurNOo9/DmU5CpKoTN9hkxW7WitEB38XvVM2Nm1OJNjWKvCRZ1phj+MEiXZTujqc5O5k6MG7IvmN2Tfdghnryq67DUcc6pD+CMpsHBJ60zct0GcM4hW5t9Ds7CpiXOpnspMhj+fgZBr3azFmVyVhMq/Jw/OsFz3UU3ahDENthCTZHnO5MJvOGqdV7NmgEBkWCMYhCa9+J2aMMQh/h2//v81JgBWUDggQhcAALCwAJ0BKmgBaAE+PR6NRCIhqZLbJVyYA8S0t34Q66PlByA6RCxPy9CFwCDN6RNvD4tfrO+m70AP106xb0AP2A6y791/YA/iv9b9QD0AOIJ/af8d/0R9SP27+o73r/Ffc29uv2H6+L2G3m+T+Id+Kf1L/VbYFJ7/aNQA/V3xc/+B4832/1AP4z/U/93/gPx4+mP+6/8P3Je3H8y/zn/i9wL+Pf0D/gf4T/Ge9d66v3E9hL9Rvv/LSqiuCGSOi33aSshkjot91h2k118+3CTuysOVeMuaF641GxI7LX1tgBtSucqorghkjoHITqMho+K6U28dE/+yxBPRUKx6BTyf/EsuuIMiS1PLARIh8QEvjzdkh78BWsfreg1wQyPhsVf56mAxmNCf+966/j80hFPRJQeLHJrN3W8pPnzOIcg0fp63IQAwrAxYgIYvc3gSqDeQyR0DkGEB2K23atMmVsQw9k3IgdZiovIsEu3kZEGfidEFdTD2WI3X7cCHnkumvJU2bpEL3+xwfVD8dMjlh+PyF9ISHmNLu0KbQ6QfV3glDunx1RrEvrDTmSRL2wMZD3w8zkjhJKLAUJrWiuedVLnHx+qUTEEKJNU4XkHqTvlBGBitvpHYN//W6YTBF+SIYw9mIx9bU3PE9dUeYWU6N/dS+ZVO9M+ZiSKl7puw7RdLAitddMRBgWaTuQDbW+cfdhKQX/qgGZVQCcuAwEBwJAF4yst/XSdsLNimmhTaHhWL7nQGZfocKRrJ6XYT9LkbTaWfAGRQuecGp/LFHc63K958lFds/BpVJM15grhf5Pxol7ECUUVi21SvIYP/byp0wlmVciabmNtrDBi2B+cIJ6PoY3SLfGgKX67VqRLKnnQ3E3v6i2J22cEBaVlB9iH1xjaCUNMutJs2kF9bhddN/7I4CmZOWcs0T/z3Ujax+nZsNjdSI1ynQu7eSCYDcX04VJcADTyKUX0Zfi7nweFb6rlsryUqh19u80WM175Urq3MVHZsT5Kl4nLI8jmxUQUFcgEm3pFk7pECpnmBmAWWhGpA2pdJGouHtbFtl9HPcrPjvq//0XG8ekie65fjuHTv/bFWGJeAUM6Ey+207Yzd/3b9Vh5o2mm0mIEL/WqGuZUZvP6qKw5FqMRh/q3hs20+9g8PrO6HiuXzYyzIK0Mh8pQGtCS4Fjyvd79TUcxY8DTKX3Fk/BAKTJ9nsQd378mJdaXWBlvu7jj5y44CIO9Sy34GN55F+NyIi+7cyL4+DluZHc65207V0f/jJFivWj1yHg7THhPKWbocAcAhVXdpv+sZFwLDjEWAvVeIvcaQjpk3MNtL/kDyyk9WYSIevBqh56aHL7H7yj1DATH7gBTpWw0BGMjDUW4Yzkjy3dvmC0k2Ig5A5Y7P4xfaYB9d77aGS9EF26xmCWi23712wb2DPbxMLqSKJ2VRhk6w2VAIIAFiT5fKZlqFIZ81/ywMKSEoUq0gVx3xgKbWiyZilfb/tXk7yPbydvbTsMGvR6rEqAxZf9V+Vn345nhPO6zfg3NeDFd/dgCya3DCwRJxN3hOVopEd9ahGEhO3jxQeq0di98Sl9aYfi9fh+14ATHVg4Px39iSY8vo0CRLzxnhkjg40J26pjjPvcoJ+baJD3nwkIgahBh7vxW48KmE5oRE4qx/GEQGphXVEkktaAp3CG36ElTGOGK+D8eTW/eFr5o/UwOGkrIVkAIalPquU6QMMR8rhfFLiU6pqrtUJLdJl8G/53rvH1ev6uf/Cxrz6wk/8psgEZKNfJHQnWt4YioPH8+C9daBxc1Q1Nme9xvEu/1RDUckWcREz06rn+8T+p7n8f+j8Y1kMkdFvuu9Q9Toxj43Qy76fMU7Uh3fxQWf6sR1abIZI6LfdpKyGSOi33aSshkegAD++R4AAAAAAAH//eaUriMebeDfkL8wCKeIMLMTgsJ/SCNJ3gmAWDkvOMmC0ZHZUPkYIKbwxPImOM6+eP4oiV4/26Z5FYmdunBGDS/K7txtwHNagWN8lcS0oHS1sAVC9rgdSLPy1QVqfymGzyBjr62HayEjNVvcSuRCzYtTFZni7kj1TyOxIPIw4U+WlC+Ybp+4qUW5BC/4NvSram8KzkUufJUMpJXpSuPoK2eoha1mRHREgNPSt08A/K0BW/hPwcXecWcXSgjisuh/ceWDsZLJo7RETnhLPAeK2+L+YsP+giOxOqJtyZkkvt54x0G04H5TZkggLmimvgAADx/uZ5/oYUpLMQP/Er/9nDcdG/E1TdP1nbLghIO1ZTkWrAxOYh1JB+NiK1a80gwf/oEFls50Ug805PtJnr+iuqGZ9AEMc/XPeLac9KZMIaeu8pAga250jUiqa4/h2Q0GCFb4pZfWrKDBgT3G5oX72fzdMPvUfq7TGj0Wpp+j7yM9jp4/BWt0moIzVDOQl6fJjBMUgrCB+QotqlvK3Fe528UDO9/3DaSmuSZ0UMbleySlIHtJO/82B69c6Gc4Tsoerm4jdfGkw0VKcxjoGqcWwqXXrIGZ0fnUBrUKluq/8Gfq0KGZzdUUAI5Odwr6wXHtjW37lvRxkruM/3A4qyMtkVNwO4pQXjRmIxkNkwDOapyGM1zn62ZuyxPpMFGgLFleGKDq/u5sOKa9nHr5Fm0xgFwpOG3qg6Lxf+8ABj/2mw4JaLRQADxJ8L/re9Cj8ZvEEf7aq3APscp/7dThERrWtD9N1pcbFJ35dgryhUjavSYszqGshSqz6jsiADV+qy+Ql9OcnqSk/NTm58CkZSdp/SYvHJGEiKf8HTF+7bJKoQ4qQpDh/KHraSMqkJFxyQIfYkP+VDHxlgWK+ZoCKWYGcVESP+/2pgQ9oMhCM7vYhnQ5hMXf7fzeKq3DlFdZtPKrcmMy6FhD8wL+MWUl2Mm5Pzd0divEQ4ZLv+9SL+oi1e5PWEQUGLx8Ww5/zu1IFtHvKJdfJvR1pUkrtNHaM5je43pF0NVfsjfFphvBMN1WoRrKn4hz0/3S4AAVf93pDxIjxB6WytTFiexqHlq05Ik+//7TYnqNriNvnbS0ge0+6IQLPvnXyL2TZtw/XynSVqzzkhSyncTzrPoPV+EoGzNK5rB6Z0/TwHugwXF92/KBYgxVnQW8OqjQUz1ymEAlKs1xCvcUtBG/05HxnAiiNLICiWmHAPahsAX9BbElHJrM7uJQtNVzVMENEPsmvwJh6ciAgb/IBIH/y6PwjeMQ5drisp9H4MRFDMwZgrPtxIrJQvWGN+eZ/V22rbtYOBBI7zVsMsZzivdLf4ZVvvfgBQ/7iC4dWOiydKMz7tAI6Q1zz94WumbkXi1Yt/7dYlDElKhBX/BSocaXTaTgTGwrNfkgHqM9b9kNIg+1tvLqfIvU49rbl0FPj44tMwEfu4pIxD0tDvnRCZ/YhqkhPIKRilqoXXk/H8ADP5zQ31ROn9VBQZsQ2AUj+aX/AvDD4Rhfu/8wvg8RUXibhMEdNpRRQpk2eXEnIn6EBYiLir9qfIywtkgE1QSEh5RShXZNjZl4VcuosBKe2Nphb1xvxBkmUFRYcaICxCOGV0vh+AP9VlRwe4wDl3HgD18++FfLpq3IsFCNo2qOtUs1BGNBlI5Wj83HmZbLoV0E/Eu3h+VN1m07DAXpad1DFf+pyADE9de8Fzc83cHU+fVXlywJDQblgeiaP1Z9bIWjhPAo/t1f9oDyT6qXinAqjvjqZSeYnbOItjhgRzUhjzTianuM8GgbjI0+UlWKCQfsjZPYPyFZaPQx6GEnqYMR1OCRc4nMbhrl6ryrYT+hHhtspZC2BJcdzF5ajeUnOKcRwgIRS8ME+/a6taDgSKR8X8eMldpDkQxqUoeaxeeTEf7tCg4wIZrMHrUAYORKJui4Dqp3COV/udu0R4DUU5U6gZSqX7C0GmrXwbv+mYxA54DOAUP+7xrvo1xZTgGiElYeDOTTUoobC/1RTG9K4Nby7+jEAjOA9amRgIcTWKP5wCJqTMjQ3n3yxf/b+Ng8Wz4sL6h5jFGxw3R46iOilEZl5KH3SWS4SUfbdImJUgUpT5WzY/9t4GiZHrvY8tqP5mt5kQ3MzQVf5DvqUHJudvASKjlXS2ToZVq9V1gctX5lSbzXtuUXKvxRcBBGDGOPtwOohcWHG+DnBJ2p9lVxknH4I/T+RJ0S8/zSyJNXMPjiLO6pFwTiJNQ6uOjngQgXedaS4mp5QoXLsvPyGbMWdmcZSoAXWEAV9tUpeJIxzHmCVegCK4UtmJorClGpZWZICI0XCUPFT6+Xq7kBVu7+irl3sCos1UyWucRZg/rV6/uqGADd2Zojz44I7tt+bEBo2gV04avzkJ7w/3yGBxdvaD88Pn/6xAlSpY+0kZmkD6eAUsZH7P8o3w9Rzm5Eym/zZceiWVj86pK6/rYEyxMRkQGJ2Au7Dd6SXa6c4Tze7q7Oiu8qpPa59l/+3WHg5nauDUbdWjham0LU+81Xzgd/16z+g5LBAX/cDBGzYBldXToNenEhk+1Gv4oLjE1ZrFIr6sYRtByLYwQCy+RFXRswqgMAOYiel5CbvQVsCF0xqAxY+dgvtSAdLJwU1wijOIxVpFQtT7mjk4oCPfPSPedwfcSewFgloDjPpkIs3knzo/DX87dCgSblmyjauG+MQQPRbDajjzhe/vHHMtrpIbEEB5eAJgWbXDyCI7+chY20iuQLYD9k2SNB5Z0Hghc/sKWQYDEN+zLh64DFKUe53qKQpV/bEiPsA0LekKwRqwL89gIbant7CQfWa4fDTi+YI7KZAyTtJfkCIwUqaKMW02A21PY3EvVlADlQEhd9OGYq+cPappYexASMr/JSp4JZLAlTqPpgwgsgHwvtTOPcf32NvOcc/FQ+XPD/Wi04q1JCLK/pOuMO3PZ0Xon6QyfELYerOychZHGXde4b3YDgU7GbVVsGowsAaCNZlvQeylbXeFT3Hrn+Cu2CxkA6oC2zyO4vf9qvR/TTNtJi+uUx8Rsb6Hxd28GGsMhZixBAPGa1mjsIrZPCq9xWriFigdMavMvjhyFp5Yh7uzre8YLrZCvmMXuEKr46dLycZH7U98yW+jxk/6FjUs7EysF1cLmAY+Fp+KdMoCENbMUcyekG/qsVjuBOMykunW5f/OIAfV3G/l040q5Z0SWHhFK5XwUE4IQ6XP/QNZkJYRfLwaoy4TMyxLTM5RNY4yeoNEkUu0gj+8m77FNaCnGisjNPIxW5F22oduVMN5qITmjoW637PmV56mspoVuJjKJWW/WCqc9oNCsfxrUG0dranmECOZzhvQCMu44RpE2m2OzBUF90yG9kFMuguwVVg8XlmFhwS/w/5xe62HqzcgWBOEawXakr5u7iPB4gVmCIP2MohUbbV0ign96KkV1efWavpJSVJ8OO4BsnwXG+rEEBB144uTLQWZQkKRP4WQ6iQZWPcyRGUhF8BPzJLFQuB7QgwHV+vo4EkdkddBjilP5LGrwhQXxLNi8hAtuhVaosw290TDQgl9X/BH4NJ+ZVNC/tmGXKZZZzksTHXAzV+62i015dQImJXdX9NgCxtpCQ0/E1DRuWPqAmGvW0Sr6MuxN1gLZq6pHslfaHtzlCz0PTppFEQQ10eavD/DPGEFEg0jUxbyBPWo+WDp8IJl3utfECjfoqa8AslwVoRkBZN2lYWHu1DArTAs+5gRbARWwm8OHsKR7PVCiMPP+80Nz/hYLqYLfxULh2/HHBUSoIyx/nbIAHqHCuBcxOIKsKYRteEHSlRuXQ+oY5AqcBXln9StHhMqAw7/L63Ci3F2g/ghnyid0NiTtvLL4QpmMN3PerzF0S2IOTvmiSB/pYc3w0oRFqYNzB/tshqbyAqNIixutx3wkIFBRmfcBxJtR3V3BK754FtTI+N+F73Is37uqbk9cpYMoOc1Iv9+cjW2ZhE8FvHWZ+5ZpwLEjX9GPJCkLOUNcx0fNcKK/3WxPpi2vbwqGqYnc8zYTIFf6y/RwoHZLyVHPubxyqaSgQGtN1TwNbN8VbqQ/5P2O07YJoQ2xVb7oIHYdIq7v5cKhACDqZempAvfShwHJQwZ4InqEhvsOnLzhtEusxfEv1NdPLBGyXYKiz/OVBOVS15JsMOIvJNOHBeJEpkfgoYmTOmeqNURAFQTrUNmINSf0vz1FtIu3tS/mIMBa08dT5I/VW6x0esXH6CJMWoI9/+DUkvhSUGwsnsJRH8nnqDbBooA+cu7T3bTD9Q0Bgh/6d0/ZBKM1gStRuS8ONNoMk+oN/xBmxqBuUGsC0Ka6BaOFtH5JxRTfu8Dc/6TizbDAVmyjIeatx9k+1vbnUoOvsA2zOF/MexwGHYxwds/Z0y2wwnjNFyUhHSth939ShJpQuHkxcxUCCtvzMAI3YQTBE6xLapnFmx1iARRthH6zBrEuTSvpUakoJl5ol8ZTTnRjn3zygsN3owRHZjd0sYrhRO1hGduRVevviEf95Pet+6zMzSHm1SVulDCcCSXa4FZTZ51jhriUH3kqsazOA6keKBrVont6FpHJ4fI9flHfmX2yujLdqLrjY2EIx3jhrZl13rVbgZWQI9linhBuierINobYAGIn7Nvn4KgM/qigoDnSxRGPzzCc+ESyw3jgXdl/ElUC1P1db+/K/JxrLO0dDWcGC/zOgmQ3yVL1Y4YFA9TYiXAqEXjUiBc9fKEhVi8quFCeaOYP+EMRxISB1BobUgC1f1iwoMebbtI3pSHDieqWAX4zXu9MOCH+3DTs+4KqH0PGQjIDoOK9c7hs6bs9HHtynN64hgPW3OhpRW5bToaZUxjzkfQs4vHhYiwz4cIM9ZubilrMHq+8gibzzveDON+S98fhqnu2rCrRaJudvWkbPoUtowJplZ2ZIlLi5q8Pq0SbCuv5Dkg71UFyc37v7ge9qrQHN5IekNrvmdPh2eQ8IBCl9PPbsW309HGABC7jK7jcnRiXJv87TqyS0WKiYv4x5Po6q+VAeYCJMDVq5QgF5pW4kIaNc45ElxDdAIqT4bVOqkTbqp33fl0y/lLh0xdD+HU7dHeSY7B5uLbNLTLiRNURhdgff3ouBX6cBgYQKC0m8EYcnvypBKAHD12ce6QbhVl0dC3u6m9jqofQ90/9t+LZ+7B/do881BPMT2dXx5CoIkbci9YWj1PCusbXx5l+7Np5ht6elGSHPkTkjADNRo5u6kN5xi/n/sQe2waKCYu7MPukIDC+1jM4Cm4KbPcWHF3StZOcox1R3FKZc7NV6+MWNvU0Az+42Wx3ywtXRjNRtbtI3zizI1eF5Os+2AlXbAwdiH1WMgapjkLsspfqK8PBDchfYpolT5AbjPpSt+jgUYO6/qAAADOy87zT7xotUfVZMuk/e37Pi/zJs6J4EGQaCFSi81DbLJgMRr8/12WmEASz9yL/ImbBYUI0tCSJUmI+4lnlaC59pDoyXJmBWuatTI2gd2xY6P+HrMmMdIt5YRvGUCiN8MQet56UOdb7tAXWPJQFDpsEzX9aow1fXEtlPQzZEwH+Uj2wK3C9YnrRYQlCIbeRs+cLnmMW6+zI4U/uo7l4tryD4cLJApEETuy8b6L5+RjNr/TD7YzpJ2ysdgJaIcUa+FYrxcdECXp8p8D8yuM2mu7w4oDaCod9DHEOZp0He2EXprn7Jf6TWKbN1nHM/NnO6zvBKivSlmvFcyx6T40Ol91cKiu+v0htUSH1h+j9Ux/1EFaL3O7Wc4pCU1woCDxGG/lLdvN2tLsXIrdlngZY1mvfMQbXFd9f8ZsPVpsqjTLFpYdq5YQDPVYL7qb8ON25l+Yaqxl/9UC3TgAAAFDnGYOvKkSHR4BFn/1V6Q/0snDHmmxmp5eYmqkNHVt3I71T/rqiGnLXlySKWEZhI5HY4rromPzeTCS0IScW3m5rRqRB90z3m1xTzv8ZNJ1yrX5bm29WwsIadFbsHYXmN5U3ORKJYw2/nRDIKsbd3FDrqEw3WYosPpW3LAAAAAAAAAAAA" x="0" y="0" width="240" height="240"/><g class="cp-spoon" transform="rotate(38 120 120)"><image href="data:image/webp;base64,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" x="100" y="150" width="40" height="95"/></g><image class="cp-cof" href="data:image/webp;base64,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" x="0" y="0" width="240" height="240"/><circle class="cp-cof" cx="120" cy="120" r="46" fill="none" stroke="rgba(214,160,100,.25)" stroke-width="3"/><g class="cp-swirl">\n<path d="M120 120 m-2 0 a6 6 0 1 1 10 -3 a13 13 0 1 1 -22 6 a21 21 0 1 1 34 -12" fill="none" stroke="rgba(214,170,120,.28)" stroke-width="3.2" stroke-linecap="round"/>\n<path d="M120 120 m2 3 a9 9 0 1 0 -8 -10 a18 18 0 1 0 26 14" fill="none" stroke="rgba(30,12,4,.3)" stroke-width="2.4" stroke-linecap="round"/></g><image href="data:image/webp;base64,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" x="0" y="0" width="240" height="240"/><circle class="cp-hd" cx="214" cy="122" r="3" fill="none"/>', '0 0 240 240');
    for (var q = 0; q < 5; q++) { var st = document.createElement('i'); st.className = 'ld-steam'; st.style.cssText = '--d:' + (4.2 + q * .7).toFixed(1) + 's;--w:-' + (q * 1.1).toFixed(1) + 's;--x:' + ((q % 2 ? 1 : -1) * (10 + q * 5)) + 'px;left:' + (44 + q * 3) + '%;top:' + (40 + (q % 3) * 4) + '%'; cup.appendChild(st); }
    sc.insertBefore(cup, sc.querySelector('.ld-lamp'));
    sc.insertBefore(mk('ld-pen', '<defs><linearGradient id="pnB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a42"/><stop offset=".35" stop-color="#14100d"/><stop offset="1" stop-color="#050403"/></linearGradient><linearGradient id="pnG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#c9a24c"/><stop offset="1" stop-color="#6b4d17"/></linearGradient></defs><ellipse cx="150" cy="30" rx="140" ry="6" fill="rgba(0,0,0,.4)"/><rect x="40" y="10" width="190" height="16" rx="8" fill="url(#pnB)"/><rect x="60" y="10" width="7" height="16" fill="url(#pnG)"/><rect x="198" y="10" width="5" height="16" fill="url(#pnG)"/><path d="M230 11 H252 L276 18 L252 25 H230 Z" fill="url(#pnG)"/><path d="M276 18 L296 18" stroke="#8a6a28" stroke-width="2.4"/><path d="M52 8 L36 8 Q30 8 30 12 L30 14 L40 14 L40 12 L52 12 Z" fill="url(#pnG)"/><path d="M70 12 H190" stroke="rgba(255,255,255,.3)" stroke-width="2" stroke-linecap="round"/>', '0 0 300 36'), sc.querySelector('.ld-lamp'));
    var bl = mk('ld-blotter'); desk.parentNode.insertBefore(bl, desk.nextSibling);
    sc.insertBefore(mk('ld-extra ld-scales', '<defs><linearGradient id="sgB" x1="0" x2="1"><stop offset="0" stop-color="#4d3513"/><stop offset=".35" stop-color="#f1d58a"/><stop offset=".7" stop-color="#b58a3a"/><stop offset="1" stop-color="#3f2b0f"/></linearGradient></defs><ellipse cx="80" cy="166" rx="52" ry="7" fill="rgba(0,0,0,.5)"/><path d="M40 164 C40 154 56 150 66 148 L94 148 C104 150 120 154 120 164 Z" fill="url(#sgB)"/><rect x="75" y="34" width="10" height="116" fill="url(#sgB)"/><circle cx="80" cy="30" r="8" fill="url(#sgB)"/><path d="M14 44 Q80 24 146 44" fill="none" stroke="url(#sgB)" stroke-width="5" stroke-linecap="round"/><path d="M18 46 L6 100 M18 46 L32 100 M142 46 L128 100 M142 46 L154 100" stroke="#c9a557" stroke-width="1.3" fill="none"/><path d="M2 100 H36 C34 112 26 118 19 118 C12 118 4 112 2 100 Z" fill="url(#sgB)"/><path d="M124 100 H158 C156 112 148 118 141 118 C134 118 126 112 124 100 Z" fill="url(#sgB)"/>', '0 0 160 170'), sc.querySelector('.ld-lamp'));
    sc.insertBefore(mk('ld-extra ld-ink', '<defs><linearGradient id="ikG" x1="0" x2="1"><stop offset="0" stop-color="#0c0c10"/><stop offset=".3" stop-color="#3a3b46"/><stop offset="1" stop-color="#08080b"/></linearGradient><linearGradient id="ikB" x1="0" x2="1"><stop offset="0" stop-color="#4d3513"/><stop offset=".4" stop-color="#f1d58a"/><stop offset="1" stop-color="#3f2b0f"/></linearGradient></defs><ellipse cx="60" cy="96" rx="48" ry="7" fill="rgba(0,0,0,.5)"/><path d="M26 92 C20 70 26 52 38 46 H70 C82 52 88 70 82 92 Z" fill="url(#ikG)"/><rect x="38" y="36" width="32" height="12" rx="2" fill="url(#ikB)"/><path d="M34 62 C38 56 44 54 50 54" stroke="rgba(255,255,255,.3)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 38 C80 18 104 6 128 4 C112 14 96 28 80 44 Z" fill="#e9dcc0" stroke="#8a7a58" stroke-width="1"/><path d="M62 38 C84 22 106 10 126 5" stroke="#8a7a58" stroke-width="1" fill="none"/><path d="M96 76 L146 88" stroke="#17120e" stroke-width="7" stroke-linecap="round"/><path d="M96 76 L104 77.5" stroke="#d4af61" stroke-width="8"/><path d="M88 74 L96 76" stroke="#cfae62" stroke-width="3"/>', '0 0 150 100'), sc.querySelector('.ld-lamp'));
    var dust = mk('ld-dust'), r = rng(4417);
    for (var i = 0; i < 18; i++) { var p = document.createElement('i'); p.style.cssText = 'left:' + (66 + r() * 28).toFixed(1) + '%;top:' + (28 + r() * 50).toFixed(1) + '%;--d:' + (7 + r() * 7).toFixed(1) + 's;--w:-' + (r() * 12).toFixed(1) + 's;--x:' + ((r() - .5) * 60).toFixed(0) + 'px'; dust.appendChild(p); }
    sc.appendChild(dust);
  }

  function paper(doc) {
    if (!doc || doc.__paper) return; doc.__paper = true;
    function ragged(inset, amp, seed) {
      var r = rng(seed), pts = [], i, n, t;
      n = 26; for (i = 0; i <= n; i++) { t = i / n * 100; pts.push([t, inset + r() * amp + (r() < .08 ? r() * amp * 2.2 : 0)]); }
      n = 34; for (i = 1; i <= n; i++) { t = i / n * 100; pts.push([100 - inset - r() * amp - (r() < .08 ? r() * amp * 1.6 : 0), t]); }
      n = 26; for (i = n - 1; i >= 0; i--) { t = i / n * 100; pts.push([t, 100 - inset - r() * amp - (r() < .08 ? r() * amp * 2 : 0)]); }
      n = 34; for (i = n - 1; i >= 1; i--) { t = i / n * 100; pts.push([inset + r() * amp + (r() < .08 ? r() * amp * 1.6 : 0), t]); }
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(2) + '% ' + p[1].toFixed(2) + '%'; }).join(',') + ')';
    }
    var clipEl = document.createElement('i'); clipEl.className = 'ad-clip'; clipEl.setAttribute('aria-hidden', 'true'); clipEl.innerHTML = '<svg viewBox="0 0 26 74" aria-hidden="true" focusable="false"><path d="M6 66 V14 a7 7 0 0 1 14 0 V58 a4 4 0 0 1-8 0 V20" fill="none" stroke="#b9bcc4" stroke-width="2.6" stroke-linecap="round"/><path d="M6 66 V14 a7 7 0 0 1 14 0" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1" transform="translate(-.6 0)"/></svg>'; doc.appendChild(clipEl);
    var rim = document.createElement('i'); rim.className = 'ad-rim'; rim.setAttribute('aria-hidden', 'true'); rim.style.clipPath = ragged(.2, 1.6, 7);
    var face = document.createElement('i'); face.className = 'ad-face'; face.setAttribute('aria-hidden', 'true'); face.style.clipPath = ragged(1.9, 1.3, 19);
    doc.insertBefore(face, doc.firstChild); doc.insertBefore(rim, doc.firstChild);
    var sheet = document.createElement('i'); sheet.className = 'ad-sheet'; sheet.setAttribute('aria-hidden', 'true'); face.parentNode.insertBefore(sheet, face.nextSibling);
    var sp = document.createElement('i'); sp.className = 'ad-spill'; sp.setAttribute('aria-hidden', 'true'); sp.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g fill="#3d1c09"><path d="M58 58 C44 50 46 34 60 32 C76 28 94 42 90 58 C96 74 80 92 64 86 C50 94 38 80 46 70 C40 66 48 62 58 58 Z"/><path d="M30 66 C22 60 26 50 36 52 C46 52 48 64 40 70 C36 76 26 74 30 66 Z"/><path d="M70 22 C64 16 70 8 78 12 C86 14 84 24 76 26 Z"/><path d="M12 40 C8 34 14 28 20 32 C24 36 20 44 14 44 Z"/></g><g fill="#4a2410"><circle cx="26" cy="34" r="2.2"/><circle cx="18" cy="58" r="1.8"/><circle cx="44" cy="18" r="2"/><circle cx="56" cy="10" r="1.4"/><circle cx="90" cy="34" r="2.4"/><circle cx="94" cy="72" r="1.8"/><circle cx="30" cy="88" r="2.2"/><circle cx="52" cy="94" r="1.6"/><circle cx="12" cy="78" r="1.4"/></g><path d="M62 86 C61 92 63 96 62 100" stroke="#3d1c09" stroke-width="3" fill="none"/><path d="M46 70 C45 80 47 88 46 98" stroke="#3d1c09" stroke-width="2.4" fill="none"/></svg>'; face.parentNode.insertBefore(sp, sheet.nextSibling);
  }

  /* มือภาพจริงแบ่งเป็น 2 ชั้น: ข้อมือ (หมุนรอบข้อมือ) และนิ้ว+ปากกา (งอรอบโคนนิ้วโป้ง)
     คำนวณตำแหน่งย้อนกลับให้ปลายปากกา (จุด 0,0) อยู่บนเส้นลายเซ็นพอดีเสมอ */
  var HP = { F: [78, -48], W: [131, -41] }, lastFY = null, flexS = 0;
  function rot(p, c, a) { var r = a * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]; }
  function poseHand(x, y, prog, rawY) {
    var hd = document.querySelector('#authLoggedOut .ad-hand .ah-hand'); if (!hd) return;
    var wr = hd.querySelector('.ah-wrist'), fi = hd.querySelector('.ah-fing');
    var dy = lastFY == null ? 0 : rawY - lastFY; lastFY = rawY;
    flexS += (Math.max(-4.5, Math.min(4.5, -dy * 1.1)) - flexS) * .25;     /* นิ้วดันขึ้น/ดึงลงตามทิศเส้น */
    var a = flexS, b = -5 + (prog || 0) * 9;                                  /* ข้อมือหมุนตามระยะที่มือเลื่อนไปทางขวา */
    var tip = rot(rot([0, 0], HP.F, a), HP.W, b);
    if (fi) fi.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' ' + HP.F[0] + ' ' + HP.F[1] + ')');
    if (wr) wr.setAttribute('transform', 'rotate(' + b.toFixed(2) + ' ' + HP.W[0] + ' ' + HP.W[1] + ')');
    hd.style.transform = 'translate(' + (x - tip[0]).toFixed(1) + 'px,' + (y - tip[1]).toFixed(1) + 'px) scale(var(--ahs,1))';
  }

  function hand(doc) {
    var svg = doc && doc.querySelector('.ad-hand'); if (!svg || svg.__run) return; svg.__run = true;
    var p1 = svg.querySelector('.ah-ink1'), p2 = svg.querySelector('.ah-ink2'), hd = svg.querySelector('.ah-hand');
    if (!p1 || !p2 || !hd || !p1.getTotalLength) return;
    var L1 = p1.getTotalLength(), L2 = p2.getTotalLength(), LT = L1 + L2;
    [[p1, L1], [p2, L2]].forEach(function (x) { x[0].style.strokeDasharray = x[1]; });
    function setProgress(p, ink) {                   /* p 0..1 ของลายเซ็นทั้งหมด */
      var len = p * LT, a = Math.min(len, L1), b = Math.max(0, Math.min(len - L1, L2));
      p1.style.strokeDashoffset = String(L1 - a); p2.style.strokeDashoffset = String(L2 - b);
      var seg = len <= L1 ? p1 : p2, at = len <= L1 ? len : len - L1;
      var pt = seg.getPointAtLength(Math.max(0, Math.min(at, seg === p1 ? L1 : L2)));
      var wob = Math.sin(p * 90) * 1.2;              /* มือสั่นเบา ๆ ตอนเขียน */
      poseHand(pt.x, pt.y + wob, p, pt.y);
      p1.style.opacity = p2.style.opacity = String(ink == null ? .9 : ink);
    }
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.documentElement.hasAttribute('data-calm')) { setProgress(1, .9); hd.style.transform = 'translate(262px,86px) scale(var(--ahs,1))'; return; }
    var WRITE = 3400, HOLD = 1300, t0 = performance.now(), raf = 0, on = false;
    hd.style.transition = 'opacity .5s';
    function frame(now) {
      raf = 0; if (!on) return;
      var t = now - t0;
      if (t < WRITE) { var q = t / WRITE; setProgress(q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2, .9); }
      else if (t < WRITE + HOLD) { setProgress(1, .9); var rest = (t - WRITE) / HOLD; hd.style.transform = 'translate(' + (262 + rest * 14).toFixed(1) + 'px,' + (86 - rest * 6).toFixed(1) + 'px) scale(var(--ahs,1))'; }
      else { setProgress(1, .9); hd.style.opacity = 0; svg.setAttribute('data-done', '1'); on = false; return; }   /* เซ็นครั้งเดียว: ลายเซ็นค้างอยู่ มือถอยออก */
      raf = requestAnimationFrame(frame);
    }
    function go() { if (!on && !svg.getAttribute('data-done')) { on = true; t0 = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { on = false; }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !document.hidden) go(); else stop(); }, { threshold: .05 }).observe(svg);
    else go();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (svg.getBoundingClientRect().height) go(); });
    setProgress(0, 0);
  }

  function pressFx(doc) {
    if (doc.__press) return; doc.__press = true;
    doc.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.btns button, .google-btn'); if (!b || b.disabled) return;
      var r = document.createElement('i'); r.className = 'rp'; r.setAttribute('aria-hidden', 'true'); b.appendChild(r);
      setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 700);
      doc.classList.remove('pressed'); void doc.offsetWidth; doc.classList.add('pressed');
      setTimeout(function () { doc.classList.remove('pressed'); }, 320);
    });
  }

  function hoverFx(doc) {
    if (doc.__hov) return; doc.__hov = true;
    var sc = doc.closest('.ld-scene'), pose = doc.closest('.ad-pose'); if (!sc || !pose) return;
    var g = document.createElement('i'); g.className = 'ad-glint'; g.setAttribute('aria-hidden', 'true'); doc.appendChild(g);
    var sp = document.createElement('i'); sp.className = 'ld-spot'; sp.setAttribute('aria-hidden', 'true'); sc.appendChild(sp);
    var raf = 0, mx = .5, my = .5, cx = .5, cy = .5, on = false;
    function loop() {
      raf = 0; cx += (mx - cx) * .14; cy += (my - cy) * .14;
      pose.style.setProperty('--rx', ((.5 - cy) * 9).toFixed(2) + 'deg'); pose.style.setProperty('--ry', ((cx - .5) * 11).toFixed(2) + 'deg');
      doc.style.setProperty('--gx', (cx * 100).toFixed(1) + '%'); doc.style.setProperty('--gy', (cy * 100).toFixed(1) + '%');
      sc.style.setProperty('--px', ((.5 - cx) * 14).toFixed(1) + 'px'); sc.style.setProperty('--py', ((.5 - cy) * 10).toFixed(1) + 'px');
      if (on || Math.abs(mx - cx) > .002 || Math.abs(my - cy) > .002) raf = requestAnimationFrame(loop);
    }
    doc.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = doc.getBoundingClientRect(); mx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); my = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      var s = sc.getBoundingClientRect(); sc.style.setProperty('--sx', (e.clientX - s.left).toFixed(0) + 'px'); sc.style.setProperty('--sy', (e.clientY - s.top).toFixed(0) + 'px');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    doc.addEventListener('pointerenter', function (e) { if (e.pointerType && e.pointerType !== 'mouse') return; on = true; pose.classList.add('is-hover'); sc.classList.add('doc-hover'); if (!raf) raf = requestAnimationFrame(loop); });
    doc.addEventListener('pointerleave', function () { on = false; mx = my = .5; pose.classList.remove('is-hover'); sc.classList.remove('doc-hover'); if (!raf) raf = requestAnimationFrame(loop); });
  }

  function init() {
    var doc = document.querySelector('#authLoggedOut .auth-doc'); if (!doc) return;
    pressFx(doc); hoverFx(doc);
    pile(); extras(); paper(doc); hand(doc);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* ===== โต๊ะเขียนเอกสาร: ฉากมือเล่นกับกาแฟ (30 ต.ค. 2026) =====
   3 ฉากสลับกันหลังเซ็นชื่อเสร็จ: (1) คนกาแฟแล้วใส่น้ำแข็ง (2) ตักกาแฟกิน (3) ทำแก้วหก → ไปหยิบไดร์เป่าจากกระเป๋า → ผ้าเช็ดโต๊ะ → แก้วใหม่
   แขนสติกเกอร์ตัวที่สอง (.ld-arm) คัดลอกจากแขนที่เขียนลายเซ็น แล้วเปลี่ยนปากกาเป็นช้อน/น้ำแข็ง/ไดร์/ผ้า
   หยุดทันทีเมื่อผู้ใช้โฟกัสช่องกรอก · ไม่ทำงานเมื่อลดการเคลื่อนไหว/มือถือ/ซ่อนฉาก */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var sc, wrap, doc, pose, docSvg, docHand, cup, spoon, swirl, cofs, hdm, bag, spill, arm, G, toolG;
  var tok = 0, ci = 0, busy = false, inView = true, P = { x: 0, y: 0, r: 52 }, S = 1, W = 0, H = 0, OFF = { x: 0, y: 0 };
  function q(s, r) { return (r || document).querySelector(s); }
  function ez(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ctr(el) { var a = el.getBoundingClientRect(), b = sc.getBoundingClientRect(); return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2, w: a.width, h: a.height }; }
  function chk(my) { if (my !== tok) throw new Error('abort'); }
  function w(ms) { var my = tok; return new Promise(function (r) { setTimeout(r, ms); }).then(function () { chk(my); }); }
  function place() { G.setAttribute('transform', 'translate(' + P.x.toFixed(1) + ' ' + P.y.toFixed(1) + ') rotate(' + P.r.toFixed(1) + ') scale(' + S.toFixed(3) + ')'); }
  function an(dur, f) {
    var my = tok;
    return new Promise(function (res, rej) {
      var t0 = performance.now();
      (function fr(now) { if (my !== tok) { rej(new Error('abort')); return; } var t = Math.min(1, (now - t0) / dur); f(ez(t), t); if (t < 1) requestAnimationFrame(fr); else res(); })(t0);
    });
  }
  function go(x, y, r, dur, o) {
    o = o || {}; var a = { x: P.x, y: P.y, r: P.r };
    return an(dur, function (e) {
      P.x = lerp(a.x, x, e); P.y = lerp(a.y, y, e); P.r = lerp(a.r, r, e);
      if (o.shake) { var n = performance.now(); P.x += Math.sin(n / 40) * o.shake; P.y += Math.cos(n / 33) * o.shake; }
      place(); if (o.f) o.f(P, e);
    });
  }
  function orbit(cx, cy, rad, turns, dur, f) {
    return an(dur, function (e, t) { var a = t * turns * Math.PI * 2; P.x = cx + rad * Math.cos(a); P.y = cy + rad * Math.sin(a) * .85; P.r = 68 + 8 * Math.sin(a); place(); if (f) f(a); });
  }

  var TOOLS = {
    spoon: '<path d="M14 -2 L130 -8" stroke="url(#asSp)" stroke-width="6" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="0" rx="17" ry="11" fill="url(#asSp)" stroke="#6f717a" stroke-width="1.2"/><ellipse class="liq" cx="1" cy="0" rx="12" ry="7" fill="#3f1e0b" opacity="0"/><ellipse cx="-6" cy="-4" rx="5" ry="2.4" fill="rgba(255,255,255,.8)"/>',
    ice: '<g class="i1"><rect x="-13" y="-13" width="26" height="26" rx="5" fill="rgba(210,238,255,.72)" stroke="rgba(255,255,255,.95)" stroke-width="1.5"/><path d="M-8 -8 L-1 -8" stroke="#fff" stroke-width="2.5"/></g><g class="i2" transform="translate(16 20) rotate(22)"><rect x="-12" y="-12" width="24" height="24" rx="5" fill="rgba(200,232,255,.72)" stroke="rgba(255,255,255,.95)" stroke-width="1.5"/><path d="M-7 -7 L0 -7" stroke="#fff" stroke-width="2.5"/></g>',
    dryer: '<g class="wind"><line x1="-30" y1="-18" x2="-150" y2="-24"/><line x1="-34" y1="-6" x2="-172" y2="-8"/><line x1="-30" y1="6" x2="-160" y2="10"/><line x1="-26" y1="18" x2="-140" y2="26"/></g><rect x="12" y="-28" width="108" height="46" rx="16" fill="#1e1e23" stroke="#4a4a52" stroke-width="1.5"/><path d="M12 -20 L-14 -12 L-14 6 L12 12 Z" fill="#34343a" stroke="#55555d"/><rect x="6" y="-26" width="9" height="42" rx="3" fill="url(#asSp)"/><path d="M30 -22 H104 M30 -14 H104" stroke="rgba(255,255,255,.18)" stroke-width="1.6"/><rect x="72" y="14" width="26" height="62" rx="9" fill="#17171a" stroke="#3a3a40"/><circle cx="52" cy="-4" r="3.5" fill="#c8402f"/>',
    towel: '<path d="M-36 -34 C-10 -44 40 -38 70 -36 L78 38 C44 46 -4 42 -30 44 Z" fill="url(#asTw)" stroke="#8fa0b3" stroke-width="1.5"/><path d="M-24 -24 L66 -28 M-26 -4 L70 -6 M-26 16 L72 14 M-24 34 L68 32" stroke="rgba(70,110,170,.55)" stroke-width="5"/><path d="M10 -40 C14 -10 8 20 14 44" stroke="rgba(0,0,0,.18)" stroke-width="3" fill="none"/>'
  };
  function tool(n) { toolG.innerHTML = n ? TOOLS[n] : ''; }

  function init() {
    sc = q('.ld-scene'); if (!sc || sc.__acts) return;
    wrap = q('.auth-doc-wrap', sc); doc = q('.auth-doc', sc); pose = q('.ad-pose', sc); docSvg = doc && q('.ad-hand', doc);
    cup = q('.ld-cup', sc); bag = q('.ld-bag', sc); spill = q('.ad-spill', doc);
    var rot = docSvg && q('.ah-rot', docSvg);
    if (!cup || !bag || !rot || !spill) return;
    sc.__acts = true;
    spoon = q('.cp-spoon', cup); swirl = q('.cp-swirl', cup); cofs = cup.querySelectorAll('.cp-cof'); hdm = q('.cp-hd', cup);
    arm = document.createElementNS(NS, 'svg'); arm.setAttribute('class', 'ld-arm'); arm.setAttribute('aria-hidden', 'true');
    arm.innerHTML = '<defs><linearGradient id="asSp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fafafc"/><stop offset=".45" stop-color="#a3a5ad"/><stop offset=".75" stop-color="#ececf0"/><stop offset="1" stop-color="#7d7f88"/></linearGradient><linearGradient id="asTw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbfd"/><stop offset="1" stop-color="#c9d6e6"/></linearGradient></defs>';
    G = document.createElementNS(NS, 'g'); var body = rot.cloneNode(true);
    Array.prototype.slice.call(body.querySelectorAll('path')).forEach(function (p) {
      var d = p.getAttribute('d') || '';
      if (d.indexOf('M0 0 L172') === 0) p.parentNode.removeChild(p);
      else if (d.indexOf('M0 0 L124') === 0) { toolG = document.createElementNS(NS, 'g'); p.parentNode.replaceChild(toolG, p); }
      else if (d.indexOf('M14 -3 L110') === 0 || d.indexOf('M70 -5 L76') === 0 || d.indexOf('M-12 1 L20') === 0) p.parentNode.removeChild(p);
    });
    Array.prototype.forEach.call(body.querySelectorAll('.ah-penimg'), function (x) { x.parentNode.removeChild(x); });
    if (!toolG) return;
    G.appendChild(body); arm.appendChild(G); sc.appendChild(arm);
    docHand = q('.ah-hand', docSvg); docHand.style.transition = 'opacity .3s';
    doc.addEventListener('focusin', abort); doc.addEventListener('pointerenter', function (e) { if (!e.pointerType || e.pointerType === 'mouse') abort(); });
    window.VCActs = { act1: act1, act2: act2, act3: act3, run: function (n) { return runAct([act1, act2, act3][n - 1]); }, abort: abort };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (!inView) abort(); }, { threshold: .05 }).observe(sc);
    scheduler();
  }

  function layout() {
    var z = parseFloat(getComputedStyle(wrap).zoom) || 1; S = (sc.offsetWidth < 600 ? .55 : .8) * z; W = sc.offsetWidth; H = sc.offsetHeight;
    OFF.x = W + 140; OFF.y = H + 240; P.x = OFF.x; P.y = OFF.y; P.r = 52; place();
  }
  function begin() { layout(); arm.style.opacity = 1; docHand.style.opacity = 0; }
  function cleanup() {
    if (!sc) return;
    arm.style.opacity = 0; tool(null); docHand.style.opacity = docSvg.getAttribute('data-done') ? 0 : '';
    spoon.style.opacity = ''; cup.style.transform = ''; cup.style.zIndex = ''; cup.classList.remove('nosteam');
    Array.prototype.forEach.call(cofs, function (c) { c.style.opacity = ''; c.style.transform = ''; });
    swirl.style.transform = '';
    Array.prototype.slice.call(cup.querySelectorAll('.ld-ice,.ld-rip')).forEach(function (n) { n.parentNode.removeChild(n); });
    Array.prototype.slice.call(sc.querySelectorAll('.ld-stain')).forEach(function (n) { n.parentNode.removeChild(n); });
    spill.className = 'ad-spill';
  }
  function abort() { if (busy) { tok++; } }

  function ice(i) {
    var el = document.createElement('i'); el.className = 'ld-ice'; var pos = [[-7, -5, 18], [6, 4, -24], [-1, 9, 40]][i];
    el.style.cssText = 'left:' + (50 + pos[0]) + '%;top:' + (50 + pos[1]) + '%;--r:' + pos[2] + 'deg'; cup.appendChild(el);
    var r = document.createElement('i'); r.className = 'ld-rip'; r.style.cssText = 'left:' + (50 + pos[0]) + '%;top:' + (50 + pos[1]) + '%'; cup.appendChild(r);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 1100);
  }
  function emo(ch, x, y, sz) {
    var e = document.createElement('i'); e.className = 'ld-emo'; e.textContent = ch; e.setAttribute('aria-hidden', 'true');
    e.style.cssText = 'left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;font-size:' + Math.round((sz || 46) * Math.max(1, S * .9)) + 'px';
    sc.appendChild(e); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 2300);
  }
  function setLiq(v) { var l = q('.liq', toolG); if (l) l.style.opacity = v; }
  function cofScale(s) { Array.prototype.forEach.call(cofs, function (c) { c.style.transformOrigin = '120px 120px'; c.style.transition = 'transform .8s'; c.style.transform = 'scale(' + s + ')'; }); }

  async function act1() {
    begin(); var cu = ctr(cup), sp = ctr(spoon), R = cu.w / 240 * 47;
    await go(sp.x, sp.y, 62, 1500); tool('spoon'); spoon.style.opacity = 0;
    await go(cu.x + R * .15, cu.y, 70, 800);
    await orbit(cu.x, cu.y, R * .52, 3, 2700, function (a) { swirl.style.transform = 'rotate(' + (a * 57.3).toFixed(0) + 'deg)'; });
    await go(cu.x + R * .4, cu.y - R * .8, 62, 600);
    await go(sp.x, sp.y, 62, 900); spoon.style.opacity = 1; tool(null);
    await go(OFF.x, OFF.y, 52, 1100); await w(500);
    tool('ice'); await go(cu.x + R * .5, cu.y - R * 1.1, 78, 1400);
    q('.i1', toolG).style.opacity = 0; ice(0); await w(450);
    await go(cu.x + R * .2, cu.y - R * 1.05, 78, 500); ice(1);
    q('.i2', toolG).style.opacity = 0; await w(450);
    await go(OFF.x, OFF.y, 52, 1200); tool(null); await w(300);
    await go(sp.x, sp.y, 62, 1300); tool('spoon'); spoon.style.opacity = 0;
    await orbit(cu.x, cu.y, R * .45, 1.5, 1500, function (a) { swirl.style.transform = 'rotate(' + (a * 57.3).toFixed(0) + 'deg)'; });
    await go(sp.x, sp.y, 62, 900); spoon.style.opacity = 1; tool(null);
    await go(OFF.x, OFF.y, 52, 1100);
    await w(5000);
    Array.prototype.forEach.call(cup.querySelectorAll('.ld-ice'), function (n) { n.classList.add('melt'); });
    await w(4200);
  }

  async function act2() {
    begin(); var cu = ctr(cup), sp = ctr(spoon), R = cu.w / 240 * 47;
    await go(sp.x, sp.y, 62, 1500); tool('spoon'); spoon.style.opacity = 0;
    for (var s = 0; s < 2; s++) {
      await go(cu.x + R * .1, cu.y + R * .1, 70, 900); setLiq(.95); await w(250);
      await go(cu.x + R * .5, cu.y - R * .9, 66, 600);
      await go(OFF.x - 260, OFF.y - 200, 40, 1500); emo(s ? '😍' : '😋', W - 190, H - 170, 54); if (s) setTimeout(function () { emo('😊', W - 120, H - 230, 38); }, 500); await w(1100); setLiq(0); cofScale(s ? .84 : .93);
      await go(cu.x + R * .4, cu.y - R * .9, 66, 1400);
    }
    await go(sp.x, sp.y, 62, 1000); spoon.style.opacity = 1; tool(null);
    await go(OFF.x, OFF.y, 52, 1100); await w(900); cofScale(1); await w(900);
  }

  async function act3() {
    begin(); var dc = ctr(doc), cu = ctr(cup), h0 = ctr(hdm), bg = ctr(bag), v = { x: h0.x - cu.x, y: h0.y - cu.y }, base = -8;
    cup.style.zIndex = 5;
    function hold(x, y, th) {
      var d = (th - base) * Math.PI / 180, c = Math.cos(d), s = Math.sin(d), vx = v.x * c - v.y * s, vy = v.x * s + v.y * c;
      cup.style.transform = 'translate(' + (x - vx - cu.x).toFixed(1) + 'px,' + (y - vy - cu.y).toFixed(1) + 'px) rotate(' + th.toFixed(1) + 'deg)';
    }
    function jiggle() { try { bag.animate([{ translate: '0 0' }, { translate: '-7px 4px' }, { translate: '6px -3px' }, { translate: '0 0' }], { duration: 260, iterations: 3 }); } catch (e) {} }
    await go(h0.x, h0.y, 56, 1400); hold(h0.x, h0.y, base); cup.classList.add('nosteam');
    await go(dc.x + dc.w * .3, dc.y - dc.h * .02, 70, 1200, { f: function (p, e) { hold(p.x, p.y, base - 14 * e); } });
    await go(dc.x + dc.w * .14, dc.y - dc.h * .1, 86, 900, { shake: 1.6, f: function (p, e) { hold(p.x, p.y, -22 - 52 * e); } });
    /* พลาด: มือสะดุด แก้วหลุดตกบนกระดาษ กาแฟหกเต็มเอกสาร */
    var tx = P.x, ty = P.y, drop = { x: dc.x + dc.w * .08, y: dc.y + dc.h * .2 };
    spill.classList.add('on'); emo('😱', tx - 30, ty - 120, 56); setTimeout(function () { emo('💦', drop.x, drop.y - 60, 40); }, 350); Array.prototype.forEach.call(cofs, function (c) { c.style.opacity = .08; });
    await Promise.all([go(tx + 90, ty - 70, 40, 520, { shake: 3 }), an(620, function (e) { hold(lerp(tx, drop.x, e), lerp(ty, drop.y, e), lerp(-74, -150, e)); })]);
    var dsk = { x: dc.x + dc.w * .62, y: dc.y + dc.h * .6 };
    var stain = document.createElement('i'); stain.className = 'ld-stain'; stain.style.cssText = 'left:' + dsk.x + 'px;top:' + dsk.y + 'px;width:' + (cu.w * 1.05) + 'px;height:' + (cu.w * .8) + 'px'; sc.appendChild(stain);
    requestAnimationFrame(function () { stain.style.opacity = 1; });
    an(900, function (e) { hold(lerp(drop.x, dsk.x, e), lerp(drop.y, dsk.y, e), lerp(-150, -232, e)); });
    emo('😰', P.x - 40, P.y - 140, 50); await go(P.x + 40, P.y - 90, 30, 700, { shake: 7 }); await w(300);
    /* รีบไปหยิบไดร์จากกระเป๋า */
    setTimeout(function () { emo('😵‍💫', bg.x + 40, bg.y - 140, 48); }, 700); await go(bg.x + bg.w * .08, bg.y - bg.h * .05, 40, 1300, { shake: 6 }); jiggle(); await w(800); tool('dryer');
    await go(dc.x + dc.w * .4, dc.y + dc.h * .42, 38, 1300); var wind = q('.wind', toolG); wind.classList.add('on');
    spill.classList.add('dry');
    try { pose.animate([{ rotate: '0deg' }, { rotate: '1.1deg' }, { rotate: '-1deg' }, { rotate: '0deg' }], { duration: 300, iterations: 16 }); } catch (e) {}
    for (var k = 0; k < 3; k++) { if (k === 1) emo('🥵', dc.x + dc.w * .3, dc.y + dc.h * .25, 44); await go(dc.x + dc.w * .1, dc.y + dc.h * .12, 30, 750, { shake: 3 }); await go(dc.x + dc.w * .38, dc.y + dc.h * .42, 40, 750, { shake: 3 }); }
    wind.classList.remove('on'); spill.className = 'ad-spill';
    await go(bg.x + bg.w * .08, bg.y - bg.h * .05, 40, 1100); tool(null); jiggle(); await w(600); tool('towel');
    await go(dsk.x + 70, dsk.y, 50, 1200);
    for (var m = 0; m < 4; m++) { stain.style.transition = 'opacity .4s'; stain.style.opacity = 1 - (m + 1) / 4; await go(dsk.x - 70, dsk.y + 8, 50, 420); await go(dsk.x + 70, dsk.y - 8, 50, 420); }
    if (stain.parentNode) stain.parentNode.removeChild(stain); emo('😮‍💨', dsk.x, dsk.y - 110, 50);
    await go(OFF.x, OFF.y, 52, 1100); tool(null); await w(400);
    /* หยิบแก้วที่ตกไปทิ้ง แล้วเอาแก้วใหม่ (กาแฟเต็ม) มาวางที่เดิม */
    var hd = ctr(hdm); await go(hd.x, hd.y, 58, 1400);
    await go(OFF.x - 60, OFF.y - 60, 50, 1300, { f: function (p) { hold(p.x, p.y, -232); } });
    Array.prototype.forEach.call(cofs, function (c) { c.style.opacity = ''; }); Array.prototype.forEach.call(cup.querySelectorAll('.ld-ice'), function (n) { n.parentNode.removeChild(n); });
    await w(700);
    await go(h0.x, h0.y, 56, 1500, { f: function (p, e) { hold(p.x, p.y, lerp(-232, base, e)); } });
    cup.style.transform = ''; cup.classList.remove('nosteam'); emo('😌', h0.x + 10, h0.y - 110, 50); await w(300);
    await go(OFF.x, OFF.y, 52, 1200);
  }

  async function runAct(fn) {
    if (busy) return; busy = true; var my = ++tok;
    try { await fn(); } catch (e) { if (!(e && e.message === 'abort')) console.warn(e); else window.__abortAt = (new Error()).stack; }
    cleanup(); busy = false;
  }
  function userBusy() {
    var a = document.activeElement, em = q('#email'), pw = q('#password');
    return (a && doc.contains(a) && /INPUT|BUTTON/.test(a.tagName)) || (em && em.value) || (pw && pw.value);
  }
  function okToRun() {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reduced && !document.documentElement.hasAttribute('data-calm') && !document.hidden && inView && sc.offsetParent !== null && sc.offsetWidth > 300 && (innerWidth >= 768 || document.body.classList.contains('auth-open')) && !userBusy() && !busy && !sc.classList.contains('doc-hover');
  }
  function scheduler() {
    var acts = [act1, act2, act3], bag = [], lastPick = -1, last = performance.now(), gap = 5500;
    function pick() {   /* ถุงสุ่ม: ครบทั้ง 3 ฉากก่อนถึงจะวนรอบใหม่ และฉากแรกของรอบใหม่ไม่ซ้ำฉากสุดท้ายของรอบก่อน */
      if (!bag.length) {
        bag = [0, 1, 2]; for (var i = 2; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[k]; bag[k] = t; }
        if (bag[0] === lastPick) { var t2 = bag[0]; bag[0] = bag[2]; bag[2] = t2; }
      }
      lastPick = bag.shift(); return lastPick;
    }
    setInterval(function () {
      if (busy) { last = performance.now(); return; }
      if (performance.now() - last > gap && okToRun()) { gap = 2500 + Math.random() * 3500; runAct(acts[pick()]).then(function () { last = performance.now(); }); }
    }, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 800); }); else setTimeout(init, 800);
  window.addEventListener('load', function () { setTimeout(init, 1200); });
})();
