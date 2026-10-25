/* =====================================================
   privacy.js — Privacy Shield (ปกป้องข้อมูลส่วนตัวอัตโนมัติ)
   - ค้นหาและแทนที่ ชื่อ / เลขบัตรประชาชน / เบอร์โทร / อีเมล ด้วยเครื่องหมาย เช่น [ปกปิดเบอร์โทร]
   - ทำงานในเบราว์เซอร์ก่อนส่งข้อความไปวิเคราะห์ (ฝั่งผู้ใช้เท่านั้น ไม่ส่งข้อมูลจริงไปไหน)
   - ไม่ลบข้อความสำคัญของสัญญา เช่น ค่าเช่า วันที่ ระยะเวลา จำนวนเงิน
   - การตรวจจับเป็นแบบประมาณ ไม่ครบทุกกรณี (โดยเฉพาะชื่อ และไฟล์สแกน) จึงมีตัวอย่างให้ตรวจและช่องเพิ่มคำเอง
   - script.js เรียก window.privacyRedact(text) ก่อนส่ง /api/check
   ===================================================== */
(function () {
  'use strict';

  var KEY = 'vc_privacy_v1';
  var TH = '[ก-๙]';
  var LABEL = {
    name: '[ปกปิดชื่อ]',
    id: '[ปกปิดเลขบัตร]',
    phone: '[ปกปิดเบอร์โทร]',
    email: '[ปกปิดอีเมล]',
    custom: '[ปกปิด]'
  };

  var state = { on: true, name: true, id: true, phone: true, email: true, custom: '' };

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
  function load() {
    var raw = store(function (s) { return s.getItem(KEY); });
    if (!raw) return;
    try {
      var d = JSON.parse(raw);
      ['on', 'name', 'id', 'phone', 'email'].forEach(function (k) { if (typeof d[k] === 'boolean') state[k] = d[k]; });
    } catch (e) { /* ใช้ค่าเริ่มต้น */ }
  }
  function save() {
    // ไม่เก็บคำที่ผู้ใช้พิมพ์เพิ่มเอง (อาจเป็นชื่อจริง) เก็บแค่สวิตช์
    store(function (s) {
      s.setItem(KEY, JSON.stringify({ on: state.on, name: state.name, id: state.id, phone: state.phone, email: state.email }));
    });
  }

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function digitsOnly(s) { return s.replace(/[^0-9๐-๙]/g, ''); }

  /* ---------- ตัวตรวจจับ (คืน {text, counts}) ---------- */
  var TITLES = '(?:นางสาว|น\\.ส\\.|นาง|นาย|คุณ|ดร\\.|Mr\\.?|Mrs\\.?|Ms\\.?|Miss)';
  // คำที่ขึ้นต้นเหมือนคำนำหน้า แต่ไม่ใช่ชื่อคน เช่น นายจ้าง คุณสมบัติ
  var NOT_NAME = '(?!จ้าง|หน้า|ทะเบียน|ธนาคาร|ประกัน|ทุน|ตลาด|สมบัติ|ภาพ|ค่า|ลักษณะ|วุฒิ|ธรรม|งาม|เสมอ|ประโยชน์)';
  // คำที่มักตามหลังชื่อ ไม่ใช่นามสกุล: ขึ้นต้นด้วยคำเหล่านี้ (คำยาว) หรือเท่ากับคำเหล่านี้ทั้งคำ (คำสั้น)
  var STOP_PREFIX = ['ผู้', 'ซึ่ง', 'ต่อไป', 'อยู่', 'อายุ', 'เลขที่', 'ถือ', 'สัญชาติ', 'ตกลง', 'ยินยอม', 'โดย', 'และ', 'กับ'];
  var STOP_EXACT = ['ที่', 'มี', 'ให้', 'ขอ', 'จะ', 'ทำ', 'เช่า', 'ขาย', 'ซื้อ', 'จ้าง', 'กู้', 'ได้', 'เป็น', 'ใน', 'ของ', 'นี้', 'ว่า'];
  function isSurname(t) {
    if (!t) return false;
    if (STOP_EXACT.indexOf(t) >= 0) return false;
    for (var i = 0; i < STOP_PREFIX.length; i++) if (t.indexOf(STOP_PREFIX[i]) === 0) return false;
    return true;
  }
  var RE_NAME = new RegExp('(' + TITLES + ')(\\s*)' + NOT_NAME + '(' + TH + '{2,30})(?:(\\s+)(' + TH + '{2,30}))?', 'g');
  var RE_NAME_EN = /\b(Mr\.?|Mrs\.?|Ms\.?|Miss)\s+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/g;
  var RE_ID = /(^|[^0-9๐-๙])([0-9๐-๙](?:[\s-]?[0-9๐-๙]){12})(?![0-9๐-๙])/g;
  var RE_PHONE = /(^|[^0-9๐-๙])((?:(?:\+66|0066)[\s-]?\(?0?\)?[\s-]?|0)[0-9๐-๙](?:[\s-]?[0-9๐-๙]){7,8})(?![0-9๐-๙])/g;
  var RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

  function redact(input, opts) {
    var o = opts || state;
    var text = String(input == null ? '' : input);
    var counts = { name: 0, id: 0, phone: 0, email: 0, custom: 0 };
    if (!o.on) return { text: text, counts: counts };

    // คำที่ผู้ใช้เพิ่มเอง (คั่นด้วยจุลภาคหรือขึ้นบรรทัดใหม่) ทำก่อนเพื่อให้แม่นที่สุด
    var extras = String(o.custom || '').split(/[,\n،、]/).map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length >= 2; })
      .sort(function (a, b) { return b.length - a.length; });
    extras.forEach(function (w) {
      var re = new RegExp(escRe(w), 'gi');
      text = text.replace(re, function () { counts.custom++; return LABEL.custom; });
    });

    if (o.email) {
      text = text.replace(RE_EMAIL, function () { counts.email++; return LABEL.email; });
    }
    if (o.id) {
      text = text.replace(RE_ID, function (m, pre, num) { counts.id++; return pre + LABEL.id; });
    }
    if (o.phone) {
      text = text.replace(RE_PHONE, function (m, pre, num) {
        var d = digitsOnly(num);
        // เบอร์ไทย: 9-10 หลักขึ้นต้น 0 หรือ 11-12 หลักขึ้นต้น 66 / 0066 ไม่แตะตัวเลขอื่น เช่น ค่าเช่า
        var ok = /^0[0-9๐-๙]{8,9}$/.test(d) || /^(?:66|0066)0?[0-9๐-๙]{9}$/.test(d);
        if (!ok) return m;
        counts.phone++;
        return pre + LABEL.phone;
      });
    }
    if (o.name) {
      text = text.replace(RE_NAME, function (m, title, sp, first, gap, last) {
        counts.name++;
        var tail = last && !isSurname(last) ? gap + last : '';
        return title + sp + LABEL.name + tail;
      });
      text = text.replace(RE_NAME_EN, function (m, title) {
        counts.name++;
        return title + ' ' + LABEL.name;
      });
    }
    return { text: text, counts: counts };
  }

  window.privacyRedact = function (text) { return redact(text).text; };
  window.privacyStats = function (text) { return redact(text).counts; };

  /* ---------- หน้าตา ---------- */
  function $(id) { return document.getElementById(id); }
  var timer = null;

  function total(c) { return c.name + c.id + c.phone + c.email + c.custom; }

  function refresh() {
    var input = $('input');
    var sum = $('psSummary');
    var prev = $('psPreview');
    var panel = $('privacyShield');
    var badge = $('psBadge');
    if (!input || !sum || !panel) return;

    panel.classList.toggle('is-off', !state.on);
    badge.textContent = state.on ? 'เปิดใช้งาน' : 'ปิดอยู่';
    badge.classList.toggle('is-off', !state.on);
    $('psMaster').checked = state.on;
    ['name', 'id', 'phone', 'email'].forEach(function (k) {
      var cb = $('ps_' + k);
      cb.checked = state[k];
      cb.disabled = !state.on;
    });

    var raw = input.value;
    if (!state.on) {
      sum.textContent = 'ปิดการปกปิดอยู่ ข้อความจะถูกส่งไปวิเคราะห์ตามที่เห็นในกล่อง';
      prev.hidden = true;
      $('psPeek').hidden = true;
      return;
    }
    if (!raw.trim()) {
      sum.textContent = 'วางข้อความสัญญา แล้วระบบจะปกปิดข้อมูลส่วนตัวให้ก่อนส่งวิเคราะห์';
      prev.hidden = true;
      $('psPeek').hidden = true;
      return;
    }
    var r = redact(raw);
    var n = total(r.counts);
    $('psPeek').hidden = false;
    if (n === 0) {
      sum.textContent = 'ยังไม่พบข้อมูลส่วนตัวตามประเภทที่เลือก ตรวจดูข้อความอีกครั้งก่อนส่งได้';
    } else {
      var parts = [];
      if (r.counts.name) parts.push('ชื่อ ' + r.counts.name);
      if (r.counts.id) parts.push('เลขบัตร ' + r.counts.id);
      if (r.counts.phone) parts.push('เบอร์โทร ' + r.counts.phone);
      if (r.counts.email) parts.push('อีเมล ' + r.counts.email);
      if (r.counts.custom) parts.push('คำที่เพิ่มเอง ' + r.counts.custom);
      sum.textContent = 'จะปกปิด ' + n + ' รายการ (' + parts.join(' · ') + ')';
    }
    if (!prev.hidden) prev.textContent = r.text;
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(refresh, 250); }

  function init() {
    var panel = $('privacyShield');
    var input = $('input');
    if (!panel || !input) return;
    load();

    $('psMaster').addEventListener('change', function (e) { state.on = e.target.checked; save(); refresh(); });
    ['name', 'id', 'phone', 'email'].forEach(function (k) {
      $('ps_' + k).addEventListener('change', function (e) { state[k] = e.target.checked; save(); refresh(); });
    });
    $('psCustom').addEventListener('input', function (e) { state.custom = e.target.value; schedule(); });
    $('psPeek').addEventListener('click', function () {
      var prev = $('psPreview');
      prev.hidden = !prev.hidden;
      this.setAttribute('aria-expanded', String(!prev.hidden));
      this.textContent = prev.hidden ? 'ดูตัวอย่างข้อความหลังปกปิด' : 'ซ่อนตัวอย่าง';
      refresh();
    });
    $('psMore').addEventListener('click', function () {
      var box = $('psBody');
      box.hidden = !box.hidden;
      this.setAttribute('aria-expanded', String(!box.hidden));
      this.textContent = box.hidden ? 'ตั้งค่า' : 'ซ่อน';
    });

    input.addEventListener('input', schedule);
    // ข้อความที่ใส่ด้วยโค้ด (อัปโหลดไฟล์ ข้อความตัวอย่าง กู้คืน) ไม่ยิง input event จึงตรวจซ้ำเป็นระยะสั้น ๆ
    var last = input.value;
    setInterval(function () { if (input.value !== last) { last = input.value; refresh(); } }, 800);
    refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* เปิดสวิตช์ปกปิดอัตโนมัติ: วาดเครื่องหมายถูกของโล่ใหม่หนึ่งครั้ง */
(function () {
  document.addEventListener('change', function (e) {
    if (!e.target || e.target.id !== 'psMaster' || !e.target.checked) return;
    var ico = document.querySelector('.ps-ico');
    if (!ico) return;
    ico.classList.remove('st-redraw');
    void ico.offsetWidth;
    ico.classList.add('st-redraw');
    setTimeout(function () { ico.classList.remove('st-redraw'); }, 1000);
  });
})();
