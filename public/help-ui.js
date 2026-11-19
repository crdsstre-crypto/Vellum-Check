/* ===== ปุ่ม "ติดปัญหา?" — ตัวช่วยแก้ปัญหาแบบเข้าใจง่าย =====
   ปุ่มลอยมุมขวาล่าง (มาสคอต) → เลือกปัญหาจากการ์ดใหญ่ ๆ → วิธีแก้ 1-2-3 + ปุ่มพาไปทำจริง
   ยังไม่หาย → ส่งอีเมลหาเรา (กรอกหัวข้อ + ข้อมูลเครื่องให้อัตโนมัติ)
   ไม่ต้องใช้เซิร์ฟเวอร์ · เปิด VCHelp.open('login') จากที่อื่นได้ */
(function () {
  'use strict';
  var MAIL = 'vellumcheck.support@gmail.com';
  var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var isMob = function () { return window.matchMedia && matchMedia('(max-width: 767px)').matches; };
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- พาไปทำจริง ---------- */
  function openAcct() {
    if (document.body.classList.contains('auth-open')) return;
    var a = document.querySelector('#bottomNav [data-nav="acct"]');
    if (!(a && a.offsetParent)) a = $('authToggle');
    if (a) a.click();
  }
  function goCheck() {
    var c = $('checkCard'); if (!c) return;
    if (document.body.classList.contains('auth-open')) { var t = $('authToggle'); if (t) t.click(); }
    var h = document.querySelector('#bottomNav [data-nav="home"]'); if (h && h.offsetParent) h.click();
    setTimeout(function () {
      try { c.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' }); } catch (e) { c.scrollIntoView(); }
      c.classList.remove('vhp-glow'); void c.offsetWidth; c.classList.add('vhp-glow');
      setTimeout(function () { c.classList.remove('vhp-glow'); }, 2200);
    }, 120);
  }
  function openHist() {
    var h = document.querySelector('#bottomNav [data-nav="hist"]');
    if (h && h.offsetParent) { h.click(); return; }
    openAcct();
    setTimeout(function () {
      var w = $('walletHist'); if (!w) return;
      if (w.getAttribute('aria-expanded') !== 'true') w.click();
      setTimeout(function () { try { w.scrollIntoView({ block: 'start', behavior: calm() ? 'auto' : 'smooth' }); } catch (e) {} }, 140);
    }, 320);
  }
  var ACT = {
    login: openAcct,
    file: function () { var f = $('fileIn'); if (f) f.click(); else goCheck(); },
    check: goCheck,
    hist: openHist,
    credits: function () { if (window.VCShowCredits) window.VCShowCredits(); else openAcct(); },
    solve: function () { if (document.getElementById('solve')) location.hash = '#solve'; else goCheck(); },
    sample: function () { if (window.VCSamples && window.VCSamples.open) window.VCSamples.open(); else goCheck(); }
  };

  /* ---------- เนื้อหา: สั้น ทีละขั้น ภาษาคน ---------- */
  var TOPICS = [
    { id: 'start', ico: '🚀', t: 'ใช้ยังไง?', s: 'เริ่มครั้งแรก 3 ขั้น',
      steps: [
        ['วางข้อความสัญญา', 'หรือกด <b>เลือกไฟล์</b> (PDF, Word, รูปถ่าย)'],
        ['กด <b>ตรวจสัญญา</b>', 'รอไม่ถึง 1 นาที'],
        ['อ่านข้อ <b class="vhp-r">สำคัญ</b> ก่อน', 'แตะแต่ละข้อเพื่อดูว่าทำไมเสี่ยง และควรขอแก้อะไร']
      ],
      acts: [['solve', 'ดูว่าเว็บช่วยปัญหาอะไรได้บ้าง'], ['sample', 'ลองดูสัญญาตัวอย่าง']] },
    { id: 'login', ico: '🔑', t: 'เข้าสู่ระบบไม่ได้', s: 'รหัสผิด / กด Google แล้วไม่ไปต่อ',
      steps: [
        ['เช็กอีเมลกับรหัสผ่าน', 'รหัสผ่านต้องยาว <b>อย่างน้อย 8 ตัว</b>'],
        ['ยังไม่มีบัญชี?', 'กด <b>สมัครใหม่</b> ก่อน รับตรวจฟรี 2 ครั้ง'],
        ['กด Google แล้วค้าง?', 'ลองเปิดใน <b>Chrome</b> (ไม่ใช่ในแอป LINE/Facebook) หรือใช้อีเมลแทน']
      ],
      acts: [['login', 'ไปหน้าเข้าสู่ระบบ']] },
    { id: 'file', ico: '📄', t: 'ใส่ไฟล์ไม่ได้', s: 'เลือกไฟล์แล้วขึ้นข้อผิดพลาด',
      steps: [
        ['ใช้ไฟล์ที่รองรับ', '<b>PDF · Word (.docx) · .txt · รูป JPG / PNG</b>'],
        ['ไฟล์ต้อง <b>ไม่เกิน 5 MB</b>', 'รูปใหญ่ไป → แคปหน้าจอแทน หรือถ่ายใหม่ให้เห็นตัวหนังสือชัด'],
        ['ไม่มีไฟล์ก็ได้', 'คัดลอกข้อความสัญญามา <b>วางในช่อง</b> ได้เลย']
      ],
      acts: [['file', 'เลือกไฟล์อีกครั้ง']] },
    { id: 'stuck', ico: '⏳', t: 'กดตรวจแล้วไม่ขึ้นผล', s: 'หมุนนาน / ขึ้นว่าไม่สำเร็จ',
      steps: [
        ['รอสักครู่', 'ครั้งแรกของวันอาจช้าหน่อย <b>รอได้ถึง 1 นาที</b>'],
        ['เช็กเน็ต แล้วกดตรวจอีกครั้ง', 'ถ้าครั้งก่อนไม่สำเร็จ <b>เครดิตจะคืนให้เอง</b>'],
        ['ยังไม่ได้?', 'รีเฟรชหน้าเว็บ แล้วลองใหม่']
      ],
      acts: [['check', 'ไปที่ช่องตรวจสัญญา']] },
    { id: 'pay', ico: '💳', t: 'จ่ายเงินแล้วเครดิตไม่เข้า', s: 'สแกน PromptPay แล้ว',
      steps: [
        ['รอ 1–2 นาที', 'ระบบเติมเครดิตให้ <b>อัตโนมัติ</b> หลังธนาคารยืนยัน'],
        ['ดูสถานะการจ่าย', 'ที่ <b>บัญชี → ประวัติ</b>'],
        ['เกิน 10 นาทียังไม่เข้า?', 'ส่ง <b>สลิป</b> มาทางอีเมล เราเติมให้']
      ],
      acts: [['hist', 'ดูประวัติการจ่ายเงิน']] },
    { id: 'read', ico: '🧐', t: 'อ่านผลไม่เข้าใจ', s: 'สีแต่ละแบบหมายถึงอะไร',
      steps: [
        ['<b class="vhp-r">สำคัญ</b>', 'อ่านก่อน — อาจเสียเงินหรือเสียสิทธิ์'],
        ['<b class="vhp-y">ควรระวัง</b>', 'ถามอีกฝ่ายให้ชัด หรือขอเขียนเพิ่ม'],
        ['<b class="vhp-g">อื่น ๆ</b>', 'ปกติ ดูผ่าน ๆ ได้']
      ],
      note: 'ผลตรวจเป็นตัวช่วยคัดกรองเบื้องต้น ไม่ใช่คำปรึกษากฎหมาย · ถ้าเงินเยอะ ปรึกษาทนายก่อนเซ็น',
      acts: [['sample', 'ดูตัวอย่างผลที่ไฮไลต์แล้ว']] },
    { id: 'hist', ico: '🗂️', t: 'หาผลตรวจเก่าไม่เจอ', s: 'ผลที่เคยตรวจไว้หายไปไหน',
      steps: [
        ['เข้าบัญชีเดิม', 'ต้องล็อกอิน <b>อีเมลเดียวกับตอนตรวจ</b>'],
        ['เปิดประวัติ', 'มือถือ: แตะ <b>ประวัติ</b> ด้านล่าง · คอม: <b>บัญชี → ประวัติ</b>'],
        ['ค้นหาได้', 'พิมพ์ชื่อสัญญาในช่องค้นหา']
      ],
      acts: [['hist', 'เปิดประวัติ']] }
  ];
  /* v3: ไอคอนเส้นสีทองชุดเดียวกัน (แทนอิโมจิหลายสไตล์) */
  var SVG = {
    start: '<path d="M5 19c1.5-4 4-7.5 7.5-10.5L17 4l3 3-4.5 4.5C12.5 15 9 17.5 5 19z"/><path d="M14 7l3 3"/><path d="M7.5 13.5L4 13l2.5-3.5h3.5M10.5 16.5l.5 3.5 3.5-2.5V14"/>',
    login: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l2.5 2.5M14.5 8.5l2 2"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    stuck: '<path d="M7 3h10M7 21h10M8 3c0 4.5 8 5.5 8 9s-8 4.5-8 9M16 3c0 4.5-8 5.5-8 9s8 4.5 8 9"/>',
    pay: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    read: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M8.5 11h5"/>',
    hist: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8"/>'
  };
  function ico(t) { return SVG[t.id] ? '<svg viewBox="0 0 24 24" aria-hidden="true">' + SVG[t.id] + '</svg>' : t.ico; }
  var HOT = { stuck: 1, pay: 1 };   /* ป้าย "เจอบ่อย" — ปรับเรื่องได้ตรงนี้ */
  var byId = {}; TOPICS.forEach(function (t) { byId[t.id] = t; });

  function mascot(mood, size) { return window.VCMascot ? window.VCMascot.svg(mood, size) : '<span class="vhp-emo">' + (mood === 'happy' ? '😊' : '👋') + '</span>'; }
  function mailHref(topic) {
    var t = topic ? byId[topic] : null;
    var sub = 'แจ้งปัญหา Vellum Check' + (t ? ' — ' + t.t : '');
    var ua = navigator.userAgent || '';
    var dev = /iphone|ipad/i.test(ua) ? 'iPhone/iPad' : /android/i.test(ua) ? 'Android' : /mac/i.test(ua) ? 'Mac' : /win/i.test(ua) ? 'Windows' : 'อื่น ๆ';
    var br = /edg\//i.test(ua) ? 'Edge' : /line\//i.test(ua) ? 'LINE' : /fban|fbav/i.test(ua) ? 'Facebook' : /chrome|crios/i.test(ua) ? 'Chrome' : /safari/i.test(ua) ? 'Safari' : /firefox/i.test(ua) ? 'Firefox' : 'อื่น ๆ';
    var body = 'เล่าปัญหาสั้น ๆ:\n\n\n(แนบรูปหน้าจอได้เลยครับ)\n\n—\nเครื่อง: ' + dev + ' · เบราว์เซอร์: ' + br + ' · จอ ' + window.innerWidth + '×' + window.innerHeight;
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
  }

  /* ---------- สร้างหน้าต่าง ---------- */
  var fab, wrap, panel, view, cur = null, lastFocus = null;
  function build() {
    fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'vhp-fab'; fab.setAttribute('aria-label', 'ติดปัญหา? กดเพื่อดูวิธีแก้');
    fab.innerHTML = '<span class="vhp-fab-m">' + mascot('wave', 40) + '</span><span class="vhp-fab-t">ติดปัญหา?</span>';
    fab.addEventListener('click', function () { open(); });
    document.body.appendChild(fab);

    wrap = document.createElement('div'); wrap.className = 'vhp'; wrap.hidden = true;
    wrap.innerHTML = '<div class="vhp-bg" data-x></div><section class="vhp-panel" role="dialog" aria-modal="true" aria-labelledby="vhpT">' +
      '<button type="button" class="vhp-x" data-x aria-label="ปิด"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="vhp-view"></div></section>';
    document.body.appendChild(wrap);
    panel = wrap.querySelector('.vhp-panel'); view = wrap.querySelector('.vhp-view');
    wrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) { close(); return; }
      var tp = e.target.closest('[data-tp]'); if (tp) { show(tp.getAttribute('data-tp'), 1); return; }
      if (e.target.closest('[data-back]')) { show(null, -1); return; }
      var a = e.target.closest('[data-act]');
      if (a) { var fn = ACT[a.getAttribute('data-act')]; close(true); if (fn) setTimeout(fn, 60); return; }
      if (e.target.closest('[data-ok]')) { thanks(); return; }
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); if (cur) show(null, -1); else close(); }
      if (e.key === 'Tab') {   // วนโฟกัสอยู่ในหน้าต่าง
        var f = panel.querySelectorAll('button,a[href]'); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function home() {
    return '<div class="vhp-hd"><div class="vhp-hm">' + mascot('wave', 64) + '</div><div><h2 id="vhpT">ติดตรงไหนครับ?</h2><p>แตะเรื่องที่เจอ เดี๋ยวบอกวิธีแก้ทีละขั้น</p></div></div>' +
      '<div class="vhp-grid">' + TOPICS.map(function (t, k) {
        var wide = t.id === 'start';
        var sub = wide ? '<span class="vhp-3">' + t.steps.map(function (st, n) { return '<i><em>' + (n + 1) + '</em>' + ['วางสัญญา', 'กดตรวจ', 'อ่านข้อสำคัญ'][n] + '</i>'; }).join('') + '</span>' : '<small>' + esc(t.s) + '</small>';
        return '<button type="button" class="vhp-card' + (wide ? ' is-wide' : '') + '" data-tp="' + t.id + '" style="--k:' + k + '"><span class="vhp-ic" aria-hidden="true">' + ico(t) + '</span>' + (HOT[t.id] ? '<span class="vhp-hot">เจอบ่อย</span>' : '') + '<span class="vhp-ct"><b>' + esc(t.t) + '</b>' + sub + '</span><span class="vhp-go" aria-hidden="true">›</span></button>';
      }).join('') + '</div>' +
      '<div class="vhp-mailbar"><a class="vhp-mail" href="' + mailHref(null) + '"><span class="vhp-mi" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><span class="vhp-mt">ไม่มีเรื่องที่ตรง? <b>ส่งข้อความหาเรา</b><small>เราตอบกลับภายใน 7 วัน</small></span><span class="vhp-go" aria-hidden="true">›</span></a></div>';
  }
  function detail(t) {
    return '<div class="vhp-dh"><button type="button" class="vhp-back" data-back aria-label="กลับไปเลือกปัญหา"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<span class="vhp-dic" aria-hidden="true">' + ico(t) + '</span><h2 id="vhpT">' + esc(t.t) + '</h2></div>' +
      '<ol class="vhp-steps">' + t.steps.map(function (s, k) {
        return '<li style="--k:' + k + '"><span class="vhp-n" aria-hidden="true">' + (k + 1) + '</span><div><b class="vhp-st">' + s[0] + '</b><span>' + s[1] + '</span></div></li>';
      }).join('') + '</ol>' +
      (t.note ? '<p class="vhp-note">' + esc(t.note) + '</p>' : '') +
      '<div class="vhp-acts">' + t.acts.map(function (a, k) { return '<button type="button" class="vhp-btn' + (k ? ' is-ghost' : '') + '" data-act="' + a[0] + '">' + esc(a[1]) + ' →</button>'; }).join('') + '</div>' +
      '<div class="vhp-fb"><span>แก้ได้หรือยัง?</span><button type="button" class="vhp-chip" data-ok>👍 ได้แล้ว</button><a class="vhp-chip is-no" href="' + mailHref(t.id) + '">ยังไม่ได้ · ส่งอีเมลหาเรา</a></div>';
  }
  function thanks() {
    swap('<div class="vhp-thx">' + mascot('happy', 110) + '<h2 id="vhpT">เยี่ยมเลย!</h2><p>ติดอะไรอีก กดปุ่ม <b>ติดปัญหา?</b> ได้ทุกเมื่อ</p><button type="button" class="vhp-btn" data-x>ปิด</button></div>', 1);
    setTimeout(function () { if (!wrap.hidden && view.querySelector('.vhp-thx')) close(); }, 2600);
  }
  function swap(html, dir) {
    view.innerHTML = html;
    if (!calm() && view.animate) view.animate([{ opacity: 0, transform: 'translateX(' + (dir * 22) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.25,1)' });
    var h = view.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
    panel.scrollTop = 0; view.scrollTop = 0;   /* ตอนนี้ .vhp-view เป็นตัวเลื่อน (หัวติดบน ปุ่มปิดไม่เลื่อนหาย) */
  }
  function show(id, dir) { cur = id && byId[id] ? id : null; swap(cur ? detail(byId[cur]) : home(), dir || 0); }

  function open(id) {
    if (!fab) build();
    lastFocus = document.activeElement;
    wrap.hidden = false; document.documentElement.classList.add('vhp-open');
    show(id || null, 0);
    if (!calm() && panel.animate) {
      panel.animate(isMob()
        ? [{ transform: 'translateY(100%)' }, { transform: 'none' }]
        : [{ opacity: 0, transform: 'translateY(18px) scale(.96)' }, { opacity: 1, transform: 'none' }],
        { duration: 340, easing: 'cubic-bezier(.2,.9,.25,1)' });
      wrap.querySelector('.vhp-bg').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    }
  }
  function close(noFocus) {
    if (!wrap || wrap.hidden) return;
    var done = function () { wrap.hidden = true; document.documentElement.classList.remove('vhp-open'); cur = null; };
    if (!calm() && panel.animate) {
      var a = panel.animate(isMob() ? [{ transform: 'none' }, { transform: 'translateY(100%)' }] : [{ opacity: 1 }, { opacity: 0, transform: 'translateY(12px) scale(.97)' }], { duration: 200, easing: 'ease-in' });
      wrap.querySelector('.vhp-bg').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
      a.onfinish = done;
    } else done();
    if (!noFocus && lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  window.VCHelp = { open: open, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
