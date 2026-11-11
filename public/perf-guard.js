/* ===== หยุดฉากแอนิเมชันหน้าแรก (WebGL แว่นขยาย, ละอองแสง, กระดาษลอย) ระหว่างมีหน้าต่างเปิดทับ =====
   เดิมฉากด้านหลังยังวาดทุกเฟรมแม้มีหน้าต่างล็อกอิน/บัญชี/เช็กอินบังอยู่ → บนคอมรู้สึกหน่วง
   art.js เรียก VCPause.on() ในลูปแต่ละตัว · ปิดหน้าต่างแล้วส่ง 'vc:resume' ให้ลูปกลับมาเล่นต่อ */
(function () {
  'use strict';
  var root = document.documentElement;
  var CLS = ['auth-open', 'cs-open', 'pay-open', 'vw-open', 'vdc-open', 'vrh-open', 'vcp-open', 'vc-tool-open', 'vc-ld-open', 'vc-rd-open', 'vc-dsc-open', 'vhp-open'];
  function has(el) { if (!el) return false; for (var i = 0; i < CLS.length; i++) if (el.classList.contains(CLS[i])) return true; return false; }
  var paused = false;
  function on() { return paused; }
  function check() {
    var p = has(root) || has(document.body);
    if (p === paused) return;
    paused = p;
    root.classList.toggle('vc-paused', p);
    if (!p) window.dispatchEvent(new Event('vc:resume'));
  }
  window.VCPause = { on: on, check: check };
  var mo = new MutationObserver(check);
  mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  function watchBody() { if (document.body) { mo.observe(document.body, { attributes: true, attributeFilter: ['class'] }); check(); } }
  if (document.body) watchBody(); else document.addEventListener('DOMContentLoaded', watchBody);
})();
