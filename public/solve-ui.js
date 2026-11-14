/* ===== "III · เราช่วยอะไรได้" — ลูกค้าเลือกปัญหาที่เจอ → เห็นว่าเว็บช่วยอะไร =====
   ต่อท้ายส่วน "สามขั้น" (#chapters) บนหน้าแรก ใช้พื้นกระดาษเดียวกัน (ไม่กระทบ grid ของคอม)
   แต่ละเรื่อง: ปัญหาที่เจอบ่อย → ตัวอย่างข้อความในสัญญา + ควรขอแก้เป็น → เว็บช่วยอะไร → ปุ่มดูตัวอย่างฟรี / ตรวจสัญญาของฉัน */
(function () {
  'use strict';
  var host = document.getElementById('chapters'); if (!host || document.getElementById('solve')) return;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function calm() { return document.documentElement.hasAttribute('data-calm') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  var S = [
    { id: 'rent', ico: '🏠', t: 'เช่าห้อง / คอนโด', type: 'rent', demo: 'เช่าห้องพักรายปี',
      pain: ['ย้ายออกแล้ว ไม่ได้เงินประกันคืน', 'ค่าน้ำค่าไฟแพงกว่าที่คิด', 'ของในห้องพัง ต้องซ่อมเองหมด'],
      trap: 'ผู้เช่าย้ายออกก่อนครบสัญญา ผู้ให้เช่าจะไม่คืนเงินประกันทุกกรณี',
      fix: 'คืนเงินประกันภายใน 30 วัน หักได้เฉพาะความเสียหายที่มีหลักฐาน',
      remind: 'ตั้งเตือนวันครบสัญญา ช่วยไม่ให้ลืมวันแจ้งย้ายออก' },
    { id: 'job', ico: '💼', t: 'เริ่มงานใหม่', type: 'employment', demo: 'พนักงานประจำ (ออฟฟิศ)',
      pain: ['ทำงานเกินเวลา แต่ไม่มีโอที', 'ลาออกแล้วโดนเรียกค่าปรับ', 'ห้ามไปทำงานสายเดียวกันหลายปี'],
      trap: 'พนักงานลาออกก่อนครบ 2 ปี ต้องชำระค่าปรับ 3 เท่าของเงินเดือน',
      fix: 'ลาออกได้โดยแจ้งล่วงหน้า 30 วัน โดยไม่มีค่าปรับ',
      remind: 'ตั้งเตือนวันครบทดลองงาน และวันรับเงินเดือน' },
    { id: 'loan', ico: '💸', t: 'กู้ / ยืมเงิน', type: 'loan', demo: 'กู้เงินดอกเบี้ยสูง',
      pain: ['ดอกเบี้ยสูงจนจ่ายไม่ไหว', 'ผิดนัดงวดเดียว โดนยึดของ', 'ไม่ได้เขียนวันคืนเงินให้ชัด'],
      trap: 'ดอกเบี้ยร้อยละ 10 ต่อเดือน หากผิดนัด ผู้ให้กู้ยึดทรัพย์ได้ทันที',
      fix: 'ดอกเบี้ยไม่เกินที่กฎหมายกำหนด และต้องแจ้งเตือนเป็นหนังสือก่อนดำเนินการใด ๆ',
      remind: 'ตั้งเตือนวันจ่ายแต่ละงวด ไม่ผิดนัดโดยไม่ตั้งใจ' },
    { id: 'hire', ico: '🔨', t: 'จ้างช่าง / ฟรีแลนซ์', type: 'service', demo: 'จ้างรับเหมาต่อเติมบ้าน',
      pain: ['จ่ายเงินไปก่อน แต่งานไม่เสร็จ', 'งานมีปัญหา แต่ไม่มีรับประกัน', 'แก้งานไม่จบไม่สิ้น'],
      trap: 'ผู้ว่าจ้างชำระเงินล่วงหน้าร้อยละ 70 ก่อนเริ่มงาน',
      fix: 'แบ่งจ่ายเป็นงวดตามงานที่เสร็จจริง พร้อมรับประกันงาน 1 ปี',
      remind: 'ตั้งเตือนวันส่งงานแต่ละงวด และวันหมดประกัน' },
    { id: 'buy', ico: '🚗', t: 'ซื้อรถ / ที่ดิน / ผ่อนของ', type: 'sale', demo: 'ซื้อขายรถมือสอง',
      pain: ['ซื้อมาแล้วเจอของเสีย อีกฝ่ายไม่รับผิดชอบ', 'ผิดนัดงวดเดียว โดนริบเงินทั้งหมด', 'ไม่ได้ระบุวันโอนให้ชัด'],
      trap: 'ผู้ขายขายตามสภาพ ไม่รับผิดชอบความชำรุดใด ๆ ทุกกรณี',
      fix: 'ผู้ขายแจ้งความชำรุดที่ทราบทั้งหมด และระบุวันโอนกรรมสิทธิ์ให้ชัดเจน',
      remind: 'ตั้งเตือนวันโอน วันผ่อนแต่ละงวด' },
    { id: 'partner', ico: '🤝', t: 'ร่วมหุ้นทำธุรกิจ', type: 'shareholder', demo: 'หุ้นส่วนเปิดร้านกาแฟ',
      pain: ['แบ่งกำไรไม่ชัด ทะเลาะกันทีหลัง', 'ถอนตัวแล้วไม่ได้เงินคืน', 'หนี้ตกอยู่ที่เราคนเดียว'],
      trap: 'หุ้นส่วนที่ถอนตัวจะไม่ได้รับเงินลงทุนคืนไม่ว่ากรณีใด',
      fix: 'ผู้ถอนตัวได้รับเงินคืนตามมูลค่าหุ้น ณ วันที่ถอนตัว',
      remind: 'ตั้งเตือนวันแบ่งกำไร และวันประชุมหุ้นส่วน' },
    { id: 'sub', ico: '📝', t: 'สมัครสมาชิก / อื่น ๆ', type: 'other', demo: 'สมัครสมาชิกฟิตเนส',
      pain: ['ยกเลิกไม่ได้ ต้องจ่ายจนครบ', 'ต่ออายุอัตโนมัติ ไม่ทันรู้ตัว', 'ค่าธรรมเนียมแฝงที่ไม่ได้บอก'],
      trap: 'สมาชิกไม่สามารถยกเลิกได้ และสัญญาต่ออายุอัตโนมัติทุกปี',
      fix: 'ยกเลิกได้โดยแจ้งล่วงหน้า 30 วัน และต้องแจ้งเตือนก่อนต่ออายุ',
      remind: 'ตั้งเตือนก่อนวันต่ออายุ จะได้ยกเลิกทัน' }
  ];

  var el = document.createElement('div'); el.className = 'svx'; el.id = 'solve';
  el.setAttribute('aria-labelledby', 'svxT');
  el.innerHTML =
    '<div class="svx-head"><p class="sec-label mono">III · เราช่วยอะไรได้</p>' +
    '<h2 id="svxT" class="svx-h">กำลังจะเซ็นสัญญาแบบนี้<br>อยู่หรือเปล่า?</h2>' +
    '<p class="svx-lead">เลือกเรื่องที่ตรงกับคุณ แล้วดูว่าเราช่วยอะไรได้บ้าง</p></div>' +
    '<div class="svx-body"><div class="svx-tabs" role="tablist" aria-label="เลือกเรื่องที่เจอ">' +
    S.map(function (s, k) {
      return '<button type="button" role="tab" class="svx-tab" id="svxTab-' + s.id + '" aria-controls="svxPane" aria-selected="' + (k ? 'false' : 'true') + '" tabindex="' + (k ? '-1' : '0') + '" data-i="' + k + '"><span class="svx-ti" aria-hidden="true">' + s.ico + '</span><span>' + esc(s.t) + '</span></button>';
    }).join('') + '</div><div class="svx-pane" id="svxPane" role="tabpanel" tabindex="0"></div></div>' +
    '<div class="svx-honest"><div class="svx-can"><h3>✓ สิ่งที่เราช่วยได้</h3><ul>' +
      '<li>ชี้ข้อที่ควรระวัง พร้อมอ้างข้อความจริงในสัญญา</li><li>บอกว่าควรถาม หรือขอแก้เป็นอะไร</li><li>ปิดชื่อ เลขบัตร เบอร์โทร ก่อนส่งตรวจ</li><li>ตั้งเตือนวันสำคัญในสัญญา</li></ul></div>' +
    '<div class="svx-cant"><h3>✕ สิ่งที่เราไม่ได้ทำ</h3><ul>' +
      '<li>ไม่ใช่ทนาย ไม่ได้ให้คำปรึกษากฎหมาย</li><li>ไม่ตัดสินว่าใครถูกใครผิด</li><li>ไม่ได้ร่างสัญญาใหม่ทั้งฉบับ</li><li>ไม่ได้ติดต่ออีกฝ่ายแทนคุณ</li></ul></div></div>';

  var foot = host.querySelector('.ch-foot');
  if (foot) host.insertBefore(el, foot); else host.appendChild(el);
  var pane = el.querySelector('.svx-pane'), tabs = [].slice.call(el.querySelectorAll('.svx-tab')), cur = -1;

  function paint(i, focusTab) {
    if (i === cur) return; cur = i; var s = S[i];
    tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
    pane.setAttribute('aria-labelledby', 'svxTab-' + s.id);
    pane.innerHTML =
      '<div class="svx-col"><h3 class="svx-k">ปัญหาที่เจอบ่อย</h3><ul class="svx-pain">' + s.pain.map(function (p, k) { return '<li style="--k:' + k + '">' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="svx-col svx-doc"><h3 class="svx-k">ในสัญญามักเขียนแบบนี้</h3>' +
        '<p class="svx-trap"><mark>' + esc(s.trap) + '</mark></p>' +
        '<p class="svx-arrow" aria-hidden="true">↓ เราจะบอกว่าควรขอแก้เป็น</p>' +
        '<p class="svx-fix">' + esc(s.fix) + '</p>' +
        '<p class="svx-fine">ตัวอย่างเพื่อให้เห็นภาพ · ไม่ใช่คำแนะนำทางกฎหมาย</p></div>' +
      '<div class="svx-col"><h3 class="svx-k">เว็บเราช่วยคุณ</h3><ol class="svx-help">' +
        '<li style="--k:0"><b>ชี้ข้อที่เสี่ยง</b> พร้อมยกข้อความจริงมาให้ดู</li>' +
        '<li style="--k:1"><b>บอกว่าควรขอแก้</b> หรือถามอีกฝ่ายว่าอะไร</li>' +
        '<li style="--k:2"><b>' + esc(s.remind.split(' ')[0]) + '</b> ' + esc(s.remind.split(' ').slice(1).join(' ')) + '</li></ol>' +
        '<div class="svx-acts"><button type="button" class="svx-btn" data-demo="' + esc(s.demo) + '">ดูตัวอย่างฟรี: ' + esc(s.demo) + ' →</button>' +
        '<button type="button" class="svx-btn is-ghost" data-type="' + s.type + '">ตรวจสัญญาของฉัน</button>' +
        '<small class="svx-free">ตัวอย่างไม่ใช้เครดิต · สมัครใหม่ตรวจฟรี 2 ครั้ง</small></div></div>';
    pane.classList.remove('is-in'); void pane.offsetWidth; if (!calm()) pane.classList.add('is-in');
    if (focusTab) tabs[i].focus();
  }

  el.addEventListener('click', function (e) {
    var t = e.target.closest('.svx-tab'); if (t) { paint(+t.getAttribute('data-i')); return; }
    var d = e.target.closest('[data-demo]');
    if (d) { var n = d.getAttribute('data-demo'); if (window.VCTryDemo) window.VCTryDemo(n); else if (window.VCSamples) window.VCSamples.open(); return; }
    var ty = e.target.closest('[data-type]');
    if (ty) {
      var sel = document.getElementById('contractType');
      if (sel) { sel.value = ty.getAttribute('data-type'); sel.dispatchEvent(new Event('change', { bubbles: true })); }
      if (location.hash !== '#checkCard') location.hash = '#checkCard';
      setTimeout(function () {
        var c = document.getElementById('checkCard'); if (!c) return;
        try { c.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' }); } catch (x) {}
        var ta = document.getElementById('input'); if (ta && !matchMedia('(hover:none)').matches) { try { ta.focus({ preventScroll: true }); } catch (x) {} }
      }, 380);
    }
  });
  el.querySelector('.svx-tabs').addEventListener('keydown', function (e) {
    var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (k) { e.preventDefault(); paint((cur + k + S.length) % S.length, true); }
    else if (e.key === 'Home') { e.preventDefault(); paint(0, true); }
    else if (e.key === 'End') { e.preventDefault(); paint(S.length - 1, true); }
  });
  paint(0);

  /* ทางเข้าจากหน้าแรก: ลิงก์เล็กใต้ปุ่มหลัก → หน้า "วิธีอ่าน" แล้วเลื่อนมาที่ส่วนนี้ */
  var hc = document.querySelector('main > .hero .hero-copy');
  if (hc && !hc.querySelector('.svx-entry')) {
    var a = document.createElement('a'); a.className = 'svx-entry'; a.href = '#solve';
    a.innerHTML = '<span aria-hidden="true">🤔</span> ไม่แน่ใจว่าเว็บนี้ช่วยอะไรได้? <b>ดูตัวอย่างปัญหา ›</b>';
    hc.appendChild(a);
  }

  /* ค่อย ๆ ปรากฏตอนเลื่อนมาถึง */
  if (!calm() && 'IntersectionObserver' in window) {
    el.classList.add('svx-wait');
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { el.classList.remove('svx-wait'); el.classList.add('svx-show'); io.disconnect(); } }); }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
  }
})();
