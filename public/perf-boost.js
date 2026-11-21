/* perf-boost.js (v1) — ทำให้เว็บลื่นขึ้นทุกจอ โดยไม่เปลี่ยนหน้าตา
   1) โหลดร้านค้า/รางวัลรายวัน (daily-ui.js + daily-ui.css ~750KB) ทีหลัง: ตอนเครื่องว่างหลังเปิดหน้า
      หรือทันทีที่มีคนเรียก VCDaily.* / เปิดหน้าบัญชี
   4) หยุดแอนิเมชันวนซ้ำที่มองไม่เห็น (นอกจอ / อยู่ในหน้าต่างที่ปิดอยู่) แล้วเล่นต่อเมื่อกลับมาเห็น
   8) โหมดเครื่องช้า: วัดเฟรมเรตช่วงแรก ถ้าต่ำ → html.vc-lite (ลดของประดับในperf-boost.css · ฉากหน้าแรกวาดฝุ่นน้อยลง)
   ปิดทั้งหมด: ลบ <script src="perf-boost.js"> และ <link href="perf-boost.css"> แล้วใส่ daily-ui.css/js กลับใน index.html */
(function () {
  'use strict';
  var root = document.documentElement;
  var DJS = 'daily-ui.js?v=113', DCSS = 'daily-ui.css?v=126';

  /* ---------- 1) โหลดร้านค้า/รางวัลรายวันทีหลัง ---------- */
  var dState = 0, dWait = [];   /* 0 ยังไม่โหลด · 1 กำลังโหลด · 2 พร้อม */
  function loadDaily(cb) {
    if (cb) dWait.push(cb);
    if (dState === 2) { flush(); return; }
    if (dState === 1) return;
    dState = 1;
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = DCSS;
    var done = false;
    function js() {
      if (done) return; done = true;
      var s = document.createElement('script'); s.src = DJS;
      s.onload = function () { dState = 2; flush(); };
      s.onerror = function () { dState = 0; };
      document.body.appendChild(s);
    }
    css.onload = js; css.onerror = js; setTimeout(js, 4000);
    document.head.appendChild(css);
  }
  function flush() { var w = dWait; dWait = []; w.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  function stub(name) { return function () { var a = arguments; loadDaily(function () { var V = window.VCDaily; if (V && V[name] && V[name].__vcStub !== 1) V[name].apply(V, a); }); }; }
  if (!window.VCDaily) {
    var S = { open: stub('open'), refresh: stub('refresh'), shop: stub('shop') };
    S.open.__vcStub = S.refresh.__vcStub = S.shop.__vcStub = 1;
    window.VCDaily = S;
  }
  window.VCLoadDaily = loadDaily;
  /* เปิดหน้าบัญชี (มีการ์ดเช็กอิน/เมนูร้านค้า) → โหลดทันที */
  function onSheet() { if (dState === 0 && document.body && document.body.dataset.sheet) loadDaily(); }
  /* หลังเปิดหน้าเสร็จ รอเครื่องว่าง แล้วโหลด (ผู้ที่เข้าสู่ระบบจะเห็นหน้าเช็กอินเหมือนเดิม แค่ช้ากว่าไม่ถึง 2 วินาที) */
  function idle() {
    var go = function () { if (dState === 0) loadDaily(); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1200);
  }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle);
  function bootObs() {
    if (!document.body || !window.MutationObserver) return;
    new MutationObserver(onSheet).observe(document.body, { attributes: true, attributeFilter: ['data-sheet'] });
    /* แตะ/คลิกครั้งแรกที่ไหนก็ได้ = ผู้ใช้เริ่มใช้งาน → โหลดเลย จะได้พร้อมตอนกดปุ่มร้านค้า */
    var first = function () { window.removeEventListener('pointerdown', first, true); if (dState === 0) loadDaily(); };
    window.addEventListener('pointerdown', first, true);
  }
  if (document.body) bootObs(); else document.addEventListener('DOMContentLoaded', bootObs);

  /* ---------- 4) หยุดแอนิเมชันวนซ้ำที่มองไม่เห็น ---------- */
  var mine = (typeof WeakSet === 'function') ? new WeakSet() : null, held = [];
  var canAnim = typeof document.getAnimations === 'function';
  function seen(el) {
    if (!el || !el.isConnected || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect(), m = 160;
    if (r.bottom < -m || r.top > innerHeight + m || r.right < -m || r.left > innerWidth + m) return false;
    if (el.checkVisibility) { try { return el.checkVisibility({ visibilityProperty: true, checkVisibilityCSS: true }); } catch (e) {} }
    return true;
  }
  function cssPaused(el) { try { return /paused/.test(getComputedStyle(el).animationPlayState); } catch (e) { return false; } }
  function sweep() {
    if (!canAnim || !mine || document.hidden) return;
    var keep = [];
    /* เล่นต่อเมื่อกลับมาเห็น (ถ้า CSS ไม่ได้สั่งหยุดเอง) */
    held.forEach(function (a) {
      var el = a.effect && a.effect.target;
      if (!el || !el.isConnected || a.playState === 'idle') { mine.delete(a); return; }
      if (seen(el) && !cssPaused(el)) { try { a.play(); } catch (e) {} mine.delete(a); } else keep.push(a);
    });
    held = keep;
    var list; try { list = document.getAnimations(); } catch (e) { return; }
    for (var i = 0; i < list.length; i++) {
      var a = list[i]; if (a.playState !== 'running' || mine.has(a)) continue;
      var t; try { t = a.effect.getTiming(); } catch (e) { continue; }
      if (t.iterations !== Infinity) { var left = (typeof t.duration === 'number' ? t.duration : 0) * t.iterations + (t.delay || 0) - (a.currentTime || 0); if (!(left > 4000)) continue; }   /* v3: แอนิเมชันยาว (>4 วิ) ที่มองไม่เห็นก็หยุดด้วย */
      var el = a.effect.target; if (!el || el.nodeType !== 1) continue;
      if (!seen(el)) { try { a.pause(); mine.add(a); held.push(a); } catch (e) {} }
    }
  }
  var scrolling = 0;
  function tick() { if (!scrolling) sweep(); }
  if (canAnim) {
    setInterval(tick, 1200);
    /* เลื่อนจอ/เปิดหน้าต่างใหม่ → เช็กอีกรอบหลังหยุดเลื่อน ให้ของที่กลับมาในจอเล่นต่อทันที */
    var st = 0;
    window.addEventListener('scroll', function () { scrolling = 1; clearTimeout(st); st = setTimeout(function () { scrolling = 0; sweep(); }, 160); }, { passive: true, capture: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(sweep, 50); });
    if (window.MutationObserver) {
      var mt = 0, kick = function () { clearTimeout(mt); mt = setTimeout(sweep, 120); };
      new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ['class', 'data-view', 'data-desk'] });
      var bodyObs = function () { if (document.body) new MutationObserver(kick).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-sheet'] }); };
      if (document.body) bodyObs(); else document.addEventListener('DOMContentLoaded', bodyObs);
    }
  }

  /* ---------- 8) โหมดเครื่องช้า ---------- */
  function lite(on) { root.classList.toggle('vc-lite', on); window.VCLite = on; }
  var saved = null; try { saved = sessionStorage.getItem('vc_lite'); } catch (e) {}
  if (saved === '1') lite(true);
  else if (saved !== '0' && window.requestAnimationFrame) {
    var save = function (v) { try { sessionStorage.setItem('vc_lite', v ? '1' : '0'); } catch (e) {} };
    var measure = function () {
      if (document.hidden) { setTimeout(measure, 1500); return; }
      var n = 0, t0 = -1, slow = 0, prev = 0;
      function f(t) {
        if (t0 < 0) { t0 = prev = t; } else { if (t - prev > 34) slow++; prev = t; }
        n++;
        if (t - t0 < 2000) requestAnimationFrame(f);
        else { var fps = (n - 1) * 1000 / (t - t0), on = fps < 40 || slow > n * .35; lite(on); save(on); }
      }
      requestAnimationFrame(f);
    };
    var startM = function () { setTimeout(measure, 1800); };
    if (document.readyState === 'complete') startM(); else window.addEventListener('load', startM);
  }
})();
