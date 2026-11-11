/* ===== หน้า "วิธีอ่าน" แบบเล่าเรื่องด้วยกระดาษ (ข้อ 1) + ตัวเลขสามขั้นเติมหมึก/เส้นเชื่อม (ข้อ 4) =====
   ข้อ 1: กระดาษสัญญาอยู่ใน .mf-pin ทุกอย่างขยับตาม --p ที่ art.js ตั้งให้ .mf อยู่แล้ว (CSS ล้วน ไม่มีลูปเพิ่ม)
     ช่วง 01 (p .04–.32) คาดดำชื่อ/เลขบัตร/เบอร์ · 02 (.38–.60) เส้นสแกนไล่อ่านทีละบรรทัด ติ๊ก ✓
     03 (.64–.92) ปากกาไฮไลต์ข้อเสี่ยง + ป้าย + ตราสรุป
     ไม่มีการเคลื่อนไหว (ลดการเคลื่อนไหว / ไม่มี vc-motion): --p = 1 → เห็นสภาพสุดท้ายครบ
   ข้อ 4: .ch-item ได้ .is-lit เมื่อเลื่อนมาถึง → ตัวเลขเติมหมึกทอง + เส้นประวาดลงไปหาขั้นถัดไป */
(function () {
  'use strict';
  var pin = document.querySelector('#manifesto .mf-pin');
  if (pin && !pin.querySelector('.rs')) {
    function L(cls, y, html, extra) { return '<p class="rs-l ' + cls + '" style="--y:' + y + (extra || '') + '">' + html + '<i class="rs-tick" aria-hidden="true">✓</i></p>'; }
    function R(t, d) { return '<span class="rs-rx" style="--d:' + d + '"><span>' + t + '</span></span>'; }
    function H(t, d) { return '<span class="rs-mk" style="--d:' + d + '">' + t + '</span>'; }
    var st = document.createElement('div');
    st.className = 'rs'; st.setAttribute('aria-hidden', 'true');
    st.innerHTML =
      '<div class="rs-doc">' +
        '<div class="rs-hd"><b>สัญญาเช่าห้องพัก</b><span>ตัวอย่าง</span></div>' +
        L('rs-party', .08, 'ผู้ให้เช่า ' + R('นายสมมติ ใจดี', .06) + ' เลขบัตร ' + R('1-2345-67890-12-3', .11)) +
        L('rs-party', .2, 'ผู้เช่า ' + R('นางสาวตัวอย่าง มีสุข', .16) + ' โทร ' + R('08x-xxx-5678', .21)) +
        L('', .34, '<b>ข้อ 1</b> ค่าเช่าเดือนละ 8,000 บาท ชำระทุกวันที่ 5 ของเดือน') +
        L('rs-risk lv-h', .48, '<b>ข้อ 2</b> ' + H('ย้ายออกก่อนครบสัญญา ไม่คืนเงินประกันทุกกรณี', .66), ';--tg:\'ไม่คืนประกัน\';--hd:.7') +
        L('rs-risk lv-c', .62, '<b>ข้อ 3</b> ' + H('ผู้ให้เช่าปรับค่าเช่าได้ตลอดเวลา โดยไม่แจ้งล่วงหน้า', .73), ';--tg:\'ขึ้นค่าเช่า\';--hd:.77') +
        L('rs-risk lv-c', .76, '<b>ข้อ 4</b> ' + H('ผู้เช่าต้องซ่อมแซมความเสียหายทุกกรณี', .8), ';--tg:\'ค่าซ่อม\';--hd:.84') +
        L('', .88, '<b>ข้อ 5</b> สัญญามีระยะเวลา 1 ปี นับจากวันลงนาม') +
        '<div class="rs-sign"><span>ลงชื่อ ............ ผู้ให้เช่า</span><span>ลงชื่อ ............ ผู้เช่า</span></div>' +
        '<i class="rs-scan"><b>🔍</b></i>' +
        '<div class="rs-stamp"><b>3</b><span>จุดที่ควรถาม<br>ก่อนเซ็น</span></div>' +
        '<div class="rs-ph" aria-hidden="true"><i class="on1">1 ปกปิด</i><i class="on2">2 อ่าน</i><i class="on3">3 ทำเครื่องหมาย</i></div>' +
      '</div>';
    pin.appendChild(st);
    pin.classList.add('rs-on');
  }

  /* ---------- ข้อ 4: สามขั้น ---------- */
  var items = [].slice.call(document.querySelectorAll('#chapters .ch-item'));
  if (!items.length) return;
  var list = items[0].parentNode; list.classList.add('rs-ch');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { items.forEach(function (it) { it.classList.add('is-lit'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-lit'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -30% 0px', threshold: .2 });
  items.forEach(function (it) { io.observe(it); });
  /* เปลี่ยนหน้าไป-กลับ: เล่นใหม่ทุกครั้งที่เข้าหน้า "วิธีอ่าน" */
  document.addEventListener('vc-view', function (e) {
    if (!e.detail || e.detail.view !== 'how') return;
    items.forEach(function (it) { it.classList.remove('is-lit'); io.observe(it); });
  });
})();
