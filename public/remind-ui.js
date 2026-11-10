/* ===== แจ้งเตือนวันสำคัญในสัญญา (Contract Reminder) =====
   1) การ์ดในผลตรวจ: อ่านวันที่จากข้อความสัญญาในเครื่อง (ไม่ส่งข้อความไปไหน) → ผู้ใช้ตรวจ/แก้ → บันทึก หรือเพิ่มลงปฏิทิน
   2) หน้าต่างรวมแจ้งเตือน: เลยกำหนด / 30 วันข้างหน้า / ภายหลัง / เสร็จแล้ว
   3) แถบเตือนบนหน้าตรวจ เมื่อมีรายการใน 30 วัน
   เซิร์ฟเวอร์เก็บแค่ชื่อรายการ + วันที่ (server/reminders.js · หน้าเว็บ: remind-ui.js + remind-ui.css) · ปฏิทินใช้ไฟล์ .ics (เตือนก่อน 7 วันและ 1 วัน เวลา 09:00) */
(function () {
  'use strict';

  var MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var MON_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var KIND = {
    end: 'วันสิ้นสุดสัญญา', start: 'วันเริ่มสัญญา', pay: 'วันครบกำหนดชำระเงิน', deliver: 'วันส่งมอบงาน',
    notice: 'วันสุดท้ายที่ต้องแจ้งล่วงหน้า', probation: 'วันครบกำหนดทดลองงาน', renew: 'วันสุดท้ายที่แจ้งไม่ต่อสัญญา', other: 'วันสำคัญในสัญญา'
  };
  var TYPE = { rent: 'สัญญาเช่า', sale: 'สัญญาซื้อขาย', employment: 'สัญญาจ้างงาน', service: 'สัญญาจ้างบริการ', loan: 'สัญญากู้ยืม', shareholder: 'สัญญาหุ้นส่วน', nda: 'สัญญารักษาความลับ' };

  /* ---------- วันที่ ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseIso(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function daysLeft(s) { var d = parseIso(s); return d ? Math.round((d - today()) / 864e5) : 0; }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function addMonths(d, n) { var t = new Date(d.getFullYear(), d.getMonth() + n, 1), last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); t.setDate(Math.min(d.getDate(), last)); return t; }
  function thDate(s, full) { var d = parseIso(s); return d ? d.getDate() + ' ' + (full ? MON_FULL : MON)[d.getMonth()] + ' ' + (d.getFullYear() + 543) : ''; }
  function leftText(n) {
    if (n === 0) return 'วันนี้';
    if (n === 1) return 'พรุ่งนี้';
    if (n < 0) return 'เลยมา ' + (-n) + ' วัน';
    if (n < 60) return 'อีก ' + n + ' วัน';
    var m = Math.round(n / 30.4);
    return m < 24 ? 'อีกประมาณ ' + m + ' เดือน' : 'อีกประมาณ ' + Math.round(n / 365) + ' ปี';
  }
  function leftLabel(s) { return leftText(daysLeft(s)) + ' · ' + thDate(s); }
  function makeDate(day, mon, year) {
    if (year < 100) year += 2500;          // "69" = พ.ศ. 2569
    if (year > 2400) year -= 543;          // พ.ศ. → ค.ศ.
    if (year < 2000 || year > 2100 || mon < 1 || mon > 12 || day < 1) return null;
    var d = new Date(year, mon - 1, day);
    return d.getMonth() === mon - 1 ? d : null;
  }

  /* ---------- อ่านวันที่จากข้อความ (กฎตายตัว ไม่ใช้ AI) ---------- */
  var MONTH_RE = MON_FULL.concat(MON).map(function (m) { return m.replace(/\./g, '\\.?'); }).join('|');
  var RE_TH = new RegExp('(\\d{1,2})\\s*(' + MONTH_RE + ')\\s*(?:พ\\.\\s?ศ\\.|ค\\.\\s?ศ\\.)?\\s*(\\d{2,4})', 'g');
  var RE_NUM = /(^|[^\d])(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})(?!\d)/g;
  function monIndex(s) {
    var k = s.replace(/\./g, '');
    for (var i = 0; i < 12; i++) if (MON_FULL[i] === s || MON[i].replace(/\./g, '') === k) return i + 1;
    return 0;
  }
  function normDigits(t) { return String(t || '').replace(/[๐-๙]/g, function (c) { return String(c.charCodeAt(0) - 0x0E50); }); }
  function lineAt(text, idx) {
    var a = text.lastIndexOf('\n', idx - 1) + 1, b = text.indexOf('\n', idx); if (b < 0) b = text.length;
    return { s: text.slice(a, b).trim(), start: a };
  }
  function clip(s, n) { s = s.replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function classify(before, line) {
    // ดูคำที่อยู่ก่อนวันที่ไม่เกิน ~14 ตัวอักษร (เช่น "ถึงวันที่", "เริ่มงานวันที่")
    if (/(ถึง|สิ้นสุด|ครบกำหนด|หมดอายุ|จนกว่า)[^\d]{0,14}$/.test(before)) return 'end';
    if (/(เริ่ม|ตั้งแต่)[^\d]{0,14}$/.test(before)) return 'start';
    if (/(ส่งมอบ|ส่งงาน|แล้วเสร็จ)/.test(line)) return 'deliver';
    if (/(ชำระ|จ่าย|โอนเงิน|งวด)/.test(line)) return 'pay';
    if (/(สิ้นสุด|ครบกำหนด|หมดอายุ)/.test(line)) return 'end';
    return 'other';
  }
  function docName(text, result) {
    var first = (text.split('\n').map(function (x) { return x.trim(); }).filter(Boolean)[0] || '');
    if (first && first.length <= 40 && /(สัญญา|ข้อตกลง|บันทึก)/.test(first) && !/^ข้อ\s*\d/.test(first)) return first;
    var sel = document.getElementById('contractType'), t = (result && result.detected_type) || (sel && sel.value);
    return TYPE[t] || 'สัญญา';
  }

  function extract(textIn, result) {
    var text = normDigits(textIn);
    // ไม่มีข้อความต้นฉบับ (เปิดจากประวัติ): ใช้สรุปเวลา + ข้อความที่ AI อ้างอิง
    if (!text.trim() && result) {
      var bits = [];
      if (result.summary && result.summary.time) bits.push(result.summary.time);
      (result.items || []).forEach(function (it) { if (it && it.quote) bits.push(it.quote); });
      text = normDigits(bits.join('\n'));
    }
    var name = docName(textIn || '', result), out = [], seen = {};
    function push(c) {
      var key = c.dueDate + '|' + c.kind; if (seen[key]) return; seen[key] = 1;
      c.title = name + ': ' + (c.label || KIND[c.kind]); delete c.label; out.push(c);
    }
    var found = [], m;
    RE_TH.lastIndex = 0;
    while ((m = RE_TH.exec(text))) { var d = makeDate(+m[1], monIndex(m[2]), +m[3]); if (d) found.push({ d: d, idx: m.index }); }
    RE_NUM.lastIndex = 0;
    while ((m = RE_NUM.exec(text))) { var d2 = makeDate(+m[2], +m[3], +m[4]); if (d2) found.push({ d: d2, idx: m.index + m[1].length }); }
    found.sort(function (a, b) { return a.idx - b.idx; });
    var start = null, end = null;
    found.forEach(function (f) {
      var ln = lineAt(text, f.idx), before = text.slice(Math.max(ln.start, f.idx - 30), f.idx);
      var kind = classify(before, ln.s);
      if (kind === 'start' && !start) start = f.d;
      if (kind === 'end' && (!end || f.d > end)) end = f.d;
      push({ dueDate: iso(f.d), kind: kind, repeat: 'none', src: clip(ln.s, 90) });
    });
    // มีวันเริ่ม + "ระยะเวลา N ปี/เดือน" แต่ไม่มีวันสิ้นสุด → คำนวณให้
    var dur = /ระยะเวลา(?:ของสัญญา)?\s*(\d{1,2})\s*(ปี|เดือน)/.exec(text);
    if (start && !end && dur) {
      end = addDays(addMonths(start, dur[2] === 'ปี' ? +dur[1] * 12 : +dur[1]), -1);
      push({ dueDate: iso(end), kind: 'end', repeat: 'none', src: clip(lineAt(text, dur.index).s, 90), calc: 'คำนวณจากวันเริ่ม + ' + dur[1] + ' ' + dur[2] });
    }
    // แจ้งล่วงหน้า N วัน ก่อนสิ้นสุดสัญญา
    var reN = /(แจ้ง|บอกกล่าว|บอกเลิก)[^\n]{0,40}?ล่วงหน้า\s*(?:ไม่น้อยกว่า\s*)?(\d{1,3})\s*วัน/g;
    while (end && (m = reN.exec(text))) {
      var ln2 = lineAt(text, m.index), auto = /ต่อ(?:สัญญา|อายุ)[^\n]{0,12}อัตโนมัติ/.test(ln2.s);
      if (/ผู้ให้เช่า|นายจ้าง|บริษัท|ผู้ขาย|ร้าน/.test(text.slice(Math.max(ln2.start, m.index - 20), m.index)) && !auto) continue; // อีกฝ่ายเป็นคนแจ้ง ไม่ใช่หน้าที่ผู้ใช้
      push({ dueDate: iso(addDays(end, -(+m[2]))), kind: auto ? 'renew' : 'notice', repeat: 'none', src: clip(ln2.s, 90),
        label: (auto ? 'วันสุดท้ายที่แจ้งไม่ต่อสัญญา' : 'วันสุดท้ายที่ต้องแจ้ง') + ' (ล่วงหน้า ' + m[2] + ' วัน)', calc: 'วันสิ้นสุดสัญญา − ' + m[2] + ' วัน' });
    }
    // ทดลองงาน N วัน นับจากวันเริ่ม
    var pr = /ทดลองงาน\s*(?:เป็นเวลา\s*)?(\d{1,3})\s*วัน/.exec(text);
    if (pr && start) push({ dueDate: iso(addDays(start, +pr[1] - 1)), kind: 'probation', repeat: 'none', src: clip(lineAt(text, pr.index).s, 90), calc: 'วันเริ่ม + ' + pr[1] + ' วัน' });
    // ชำระทุกเดือนภายในวันที่ N → นัดถัดไป ทำซ้ำทุกเดือน
    var mo = /(?:ภายใน\s*)?วันที่\s*(\d{1,2})\s*ของ\s*(?:ทุก\s*)?เดือน/.exec(text);
    if (mo && +mo[1] >= 1 && +mo[1] <= 31) {
      var t0 = today(), day = +mo[1];
      var onMonth = function (y, mIdx) { return new Date(y, mIdx, Math.min(day, new Date(y, mIdx + 1, 0).getDate())); };
      var cand = onMonth(t0.getFullYear(), t0.getMonth());
      if (cand < t0) cand = onMonth(t0.getFullYear(), t0.getMonth() + 1);
      push({ dueDate: iso(cand), kind: 'pay', repeat: 'monthly', src: clip(lineAt(text, mo.index).s, 90), label: 'ครบกำหนดชำระรายเดือน (ทุกวันที่ ' + day + ')' });
    }
    out.sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0; });
    out.forEach(function (c) { c.on = daysLeft(c.dueDate) >= 0 && c.kind !== 'start'; });
    return out.slice(0, 12);
  }

  /* ---------- เครื่องมือ ---------- */
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function say(msg) { if (typeof toast === 'function') toast(msg); }
  function call(path, method, body) {
    if (typeof api === 'function') return api(path, method, body);
    return fetch(path, { method: method || 'GET', credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); })
      .catch(function () { return { ok: false, status: 0, data: { error: 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง' } }; });
  }
  function user() { try { return typeof currentUser !== 'undefined' ? currentUser : null; } catch (e) { return null; } }
  // ส่งฟอร์มให้เซิร์ฟเวอร์ตอบเป็นไฟล์ .ics → iPhone เปิดหน้า "เพิ่มลงปฏิทิน" เอง
  function toCalendar(items) {
    if (!items.length) { say('เลือกวันที่ก่อนนะครับ'); return; }
    var f = document.createElement('form'); f.method = 'POST'; f.action = '/api/ics'; f.style.display = 'none';
    var i = document.createElement('input'); i.type = 'hidden'; i.name = 'events';
    i.value = JSON.stringify(items.slice(0, 50).map(function (x) { return { id: x.id, title: x.title, dueDate: x.dueDate, kind: x.kind, repeat: x.repeat, note: x.note || '' }; }));
    f.appendChild(i); document.body.appendChild(f); f.submit(); setTimeout(function () { f.remove(); }, 1000);
  }
  var ICO_CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.4" class="f"/></svg>';
  var ICO_BELL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>';

  /* ---------- 1) การ์ดในผลตรวจ ---------- */
  var ctx = { inspectionId: null, demo: false };
  function rowHtml(c, k) {
    var n = daysLeft(c.dueDate);
    return '<div class="vrm-row' + (c.on ? ' is-on' : '') + '" data-k="' + k + '">' +
      '<label class="vrm-tick"><input type="checkbox"' + (c.on ? ' checked' : '') + ' aria-label="เลือกรายการนี้"><i aria-hidden="true"></i></label>' +
      '<div class="vrm-main"><textarea class="vrm-title" rows="1" maxlength="120" aria-label="ชื่อรายการ">' + h(c.title) + '</textarea>' +
      '<div class="vrm-meta"><input class="vrm-date" type="date" value="' + c.dueDate + '" aria-label="วันที่">' +
      '<span class="vrm-left' + (n < 0 ? ' is-past' : n <= 30 ? ' is-near' : '') + '">' + leftLabel(c.dueDate) + '</span>' +
      (c.repeat === 'monthly' ? '<span class="vrm-tag">ทุกเดือน</span>' : '') + (c.calc ? '<span class="vrm-tag is-calc" title="' + h(c.calc) + '">คำนวณ</span>' : '') + '</div>' +
      (c.src ? '<small class="vrm-src">“' + h(c.src) + '”</small>' : '') + '</div>' +
      '<button type="button" class="vrm-x" aria-label="ลบรายการนี้">✕</button></div>';
  }
  function cardHtml(list) {
    return '<section class="vrm-card" aria-label="วันสำคัญในสัญญานี้">' +
      '<div class="vrm-head"><span class="vrm-ic">' + ICO_CAL + '</span><div><h4>วันสำคัญในสัญญานี้</h4>' +
      '<p>' + (list.length ? 'ระบบอ่านวันที่จากข้อความในเครื่องของคุณ ตรวจและแก้ให้ตรงกับสัญญาจริงก่อนบันทึก' : 'ไม่พบวันที่ในสัญญานี้ เพิ่มวันที่อยากให้เตือนเองได้') + '</p></div></div>' +
      '<div class="vrm-list">' + list.map(rowHtml).join('') + '</div>' +
      '<div class="vrm-acts"><button type="button" class="vrm-add">+ เพิ่มวันเอง</button><span class="vrm-sp"></span>' +
      '<button type="button" class="vrm-ics">' + ICO_CAL + '<span>เพิ่มลงปฏิทิน</span></button>' +
      '<button type="button" class="vrm-save">' + ICO_BELL + '<span>' + (user() ? 'บันทึกแจ้งเตือน' : 'เข้าสู่ระบบเพื่อบันทึก') + '</span></button></div>' +
      '<p class="vrm-fine">ปฏิทินในมือถือจะเตือนก่อน 7 วันและ 1 วัน เวลา 09:00 · วันที่จากระบบเป็นการอ่านอัตโนมัติ อาจไม่ครบหรือคลาดเคลื่อน</p></section>';
  }
  function cardItems(card) {
    return [].map.call(card.querySelectorAll('.vrm-row'), function (r) {
      var c = card.__list[+r.dataset.k] || {};
      return { on: r.querySelector('input[type=checkbox]').checked, title: r.querySelector('.vrm-title').value.trim(), dueDate: r.querySelector('.vrm-date').value, kind: c.kind || 'other', repeat: c.repeat || 'none', inspectionId: ctx.inspectionId || undefined };
    }).filter(function (x) { return x.on; });
  }
  function fit(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
  function fitAll(card) { [].forEach.call(card.querySelectorAll('textarea.vrm-title'), fit); }
  function bindCard(card) {
    card.addEventListener('input', function (e) { if (e.target.classList.contains('vrm-title')) { if (/\n/.test(e.target.value)) e.target.value = e.target.value.replace(/\n+/g, ' '); fit(e.target); } });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('vrm-title')) e.preventDefault(); });
    card.addEventListener('change', function (e) {
      var r = e.target.closest('.vrm-row'); if (!r) return;
      if (e.target.type === 'checkbox') r.classList.toggle('is-on', e.target.checked);
      if (e.target.classList.contains('vrm-date')) {
        var n = daysLeft(e.target.value), l = r.querySelector('.vrm-left');
        if (l) { l.textContent = e.target.value ? leftLabel(e.target.value) : '—'; l.className = 'vrm-left' + (n < 0 ? ' is-past' : n <= 30 ? ' is-near' : ''); }
        var c = r.querySelector('.is-calc'); if (c) c.remove();
      }
    });
    card.addEventListener('click', function (e) {
      if (e.target.closest('.vrm-x')) { e.target.closest('.vrm-row').remove(); return; }
      if (e.target.closest('.vrm-add')) {
        var k = card.__list.length, c = { title: docName((typeof viewerSrc !== 'undefined' && viewerSrc && viewerSrc.text) || '', null) + ': ', dueDate: iso(addDays(today(), 30)), kind: 'other', repeat: 'none', on: true };
        card.__list.push(c);
        card.querySelector('.vrm-list').insertAdjacentHTML('beforeend', rowHtml(c, k));
        var t = card.querySelector('.vrm-row[data-k="' + k + '"] .vrm-title'); if (t) { fit(t); t.focus(); t.setSelectionRange(t.value.length, t.value.length); }
        return;
      }
      if (e.target.closest('.vrm-ics')) { toCalendar(cardItems(card).filter(function (x) { return x.title && x.dueDate; })); return; }
      var sv = e.target.closest('.vrm-save'); if (!sv || sv.disabled) return;
      if (!user()) { if (window.VCAuthGate) window.VCAuthGate.open(); else say('เข้าสู่ระบบก่อนนะครับ'); return; }
      var items = cardItems(card);
      if (!items.length) { say('เลือกอย่างน้อย 1 รายการ'); return; }
      if (items.some(function (x) { return !x.title || !x.dueDate; })) { say('กรอกชื่อและวันที่ให้ครบทุกรายการที่เลือก'); return; }
      sv.disabled = true;
      call('/api/reminders', 'POST', { items: items }).then(function (r) {
        sv.disabled = false;
        if (!r.ok) { say(r.data.error || 'บันทึกไม่สำเร็จ'); return; }
        card.querySelector('.vrm-acts').innerHTML = '<span class="vrm-done">✓ บันทึกแล้ว ' + r.data.items.length + ' รายการ</span><span class="vrm-sp"></span>' +
          '<button type="button" class="vrm-ics-saved">' + ICO_CAL + '<span>เพิ่มลงปฏิทิน</span></button><button type="button" class="vrm-open">ดูแจ้งเตือนทั้งหมด</button>';
        card.__saved = r.data.items;
        [].forEach.call(card.querySelectorAll('.vrm-row input, .vrm-x'), function (x) { x.disabled = true; });
        card.classList.add('is-saved');
        refresh();
      });
    });
    card.addEventListener('click', function (e) {
      if (e.target.closest('.vrm-ics-saved')) toCalendar(card.__saved || []);
      if (e.target.closest('.vrm-open')) openHub();
    });
  }
  // เรียกจาก script.js หลังแสดงผลตรวจ (ผลจริง ผลตัวอย่าง และเปิดจากประวัติ)
  function attach(result, text) {
    var box = document.getElementById('result'); if (!box) return;
    var rpt = box.querySelector('.rpt'); if (!rpt) return;
    var old = rpt.querySelector('.vrm-card'); if (old) old.remove();
    ctx = { inspectionId: null, demo: !!window.__vcDemoRun };
    var list = extract(text || '', result);
    var anchor = rpt.querySelector('.share-bar');
    var wrap = document.createElement('div'); wrap.innerHTML = cardHtml(list);
    var card = wrap.firstChild; card.__list = list;
    if (anchor) rpt.insertBefore(card, anchor); else rpt.appendChild(card);
    bindCard(card);
    fitAll(card);
    // ฟอนต์โหลดช้า/หน้าจอเปลี่ยนขนาด → ความสูงช่องชื่อเปลี่ยน
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(card); });
    window.addEventListener('resize', function () { if (card.isConnected) fitAll(card); }, { passive: true });
  }
  function link(inspectionId) { if (Number.isInteger(inspectionId) && inspectionId > 0) ctx.inspectionId = inspectionId; }

  /* ---------- 2) หน้าต่างรวมแจ้งเตือน ---------- */
  var items = [], hub = null, loaded = false;
  function group(list) {
    var g = { over: [], soon: [], later: [], done: [] };
    list.forEach(function (x) { var n = daysLeft(x.dueDate); if (x.done) g.done.push(x); else if (n < 0) g.over.push(x); else if (n <= 30) g.soon.push(x); else g.later.push(x); });
    return g;
  }
  function hubRow(x) {
    var d = parseIso(x.dueDate), n = daysLeft(x.dueDate), rep = x.repeat === 'monthly' ? 'ทุกเดือน' : x.repeat === 'yearly' ? 'ทุกปี' : '';
    return '<li class="vrh-row' + (x.done ? ' is-done' : n < 0 ? ' is-over' : n <= 7 ? ' is-near' : '') + '" data-id="' + x.id + '">' +
      '<span class="vrh-day"><b>' + (d ? d.getDate() : '') + '</b><small>' + (d ? MON[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2) : '') + '</small></span>' +
      '<span class="vrh-txt"><b>' + h(x.title) + '</b><small>' + (x.done ? 'เสร็จแล้ว' : leftText(n)) + ' · ' + thDate(x.dueDate, true) + (rep ? ' · ' + rep : '') + '</small></span>' +
      '<span class="vrh-acts">' +
      '<button type="button" class="vrh-done" aria-label="' + (x.done ? 'ยกเลิกเสร็จแล้ว' : rep ? 'ผ่านรอบนี้แล้ว เลื่อนไปรอบถัดไป' : 'ทำเครื่องหมายเสร็จแล้ว') + '" title="' + (rep && !x.done ? 'ผ่านรอบนี้แล้ว' : 'เสร็จแล้ว') + '">✓</button>' +
      '<button type="button" class="vrh-cal" aria-label="เพิ่มลงปฏิทิน" title="เพิ่มลงปฏิทิน">' + ICO_CAL + '</button>' +
      '<button type="button" class="vrh-del" aria-label="ลบ" title="ลบ">✕</button></span></li>';
  }
  function renderHub() {
    if (!hub) return;
    var body = hub.querySelector('.vrh-body'), g = group(items);
    if (!user()) { body.innerHTML = '<p class="vrh-empty">เข้าสู่ระบบเพื่อบันทึกและดูแจ้งเตือนวันสำคัญของสัญญาทุกฉบับ</p>'; return; }
    if (!loaded) { body.innerHTML = '<p class="vrh-empty">กำลังโหลด…</p>'; return; }
    var sec = function (key, title, list) { return list.length ? '<section class="vrh-g vrh-' + key + '"><h5>' + title + ' <span>' + list.length + '</span></h5><ul>' + list.map(hubRow).join('') + '</ul></section>' : ''; };
    body.innerHTML = items.length
      ? sec('over', 'เลยกำหนดแล้ว', g.over) + sec('soon', 'ใน 30 วันข้างหน้า', g.soon) + sec('later', 'ภายหลัง', g.later) + sec('done', 'เสร็จแล้ว', g.done)
      : '<div class="vrh-empty"><span class="vrm-ic">' + ICO_CAL + '</span><b>ยังไม่มีแจ้งเตือน</b><p>หลังตรวจสัญญา ระบบจะอ่านวันสิ้นสุด วันที่ต้องแจ้งล่วงหน้า และวันชำระเงินให้ เลือกบันทึกได้จากท้ายผลตรวจ หรือกด "เพิ่มเอง" ด้านบน</p></div>';
    var open = items.filter(function (x) { return !x.done; });
    hub.querySelector('.vrh-allcal').disabled = !open.length;
  }
  function buildHub() {
    hub = document.createElement('div'); hub.className = 'vrh'; hub.hidden = true;
    hub.setAttribute('role', 'dialog'); hub.setAttribute('aria-modal', 'true'); hub.setAttribute('aria-labelledby', 'vrhT');
    hub.innerHTML = '<div class="vrh-bg" data-x></div><div class="vrh-card">' +
      '<div class="vrh-grip" aria-hidden="true"></div>' +
      '<div class="vrh-head"><span class="vrm-ic">' + ICO_BELL + '</span><div><h3 id="vrhT">แจ้งเตือนวันสำคัญ</h3><p>วันสิ้นสุด วันที่ต้องแจ้งล่วงหน้า และวันชำระเงินของทุกสัญญา</p></div>' +
      '<button type="button" class="vrh-x" data-x aria-label="ปิด">✕</button></div>' +
      '<div class="vrh-tools"><button type="button" class="vrh-new">+ เพิ่มเอง</button><button type="button" class="vrh-allcal">' + ICO_CAL + '<span>เพิ่มทั้งหมดลงปฏิทิน</span></button></div>' +
      '<form class="vrh-form" hidden><input name="title" type="text" maxlength="120" placeholder="เช่น สัญญาเช่าคอนโด: แจ้งย้ายออก" required aria-label="ชื่อรายการ">' +
      '<div class="vrh-form-r"><input name="date" type="date" required aria-label="วันที่"><select name="repeat" aria-label="ทำซ้ำ"><option value="none">ครั้งเดียว</option><option value="monthly">ทุกเดือน</option><option value="yearly">ทุกปี</option></select>' +
      '<button type="submit">บันทึก</button></div></form>' +
      '<div class="vrh-body"></div>' +
      '<p class="vrh-fine">บันทึกเฉพาะชื่อรายการและวันที่ ไม่เก็บข้อความสัญญา · ตรวจวันที่กับสัญญาฉบับจริงเสมอ</p></div>';
    document.body.appendChild(hub);
    hub.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) { closeHub(); return; }
      if (e.target.closest('.vrh-new')) {
        if (!user()) { closeHub(); if (window.VCAuthGate) window.VCAuthGate.open(); return; }
        var f = hub.querySelector('.vrh-form'); f.hidden = !f.hidden;
        if (!f.hidden) { var fe = f.elements; if (!fe.namedItem('date').value) fe.namedItem('date').value = iso(addDays(today(), 30)); fe.namedItem('title').focus(); }
        return;
      }
      if (e.target.closest('.vrh-allcal')) { toCalendar(items.filter(function (x) { return !x.done; })); return; }
      var row = e.target.closest('.vrh-row'); if (!row) return;
      var id = +row.dataset.id, x = items.filter(function (y) { return y.id === id; })[0]; if (!x) return;
      if (e.target.closest('.vrh-cal')) { toCalendar([x]); return; }
      if (e.target.closest('.vrh-del')) {
        if (!confirmDel(row)) return;
        call('/api/reminders/' + id, 'DELETE').then(function (r) { if (!r.ok) { say(r.data.error || 'ลบไม่สำเร็จ'); return; } items = items.filter(function (y) { return y.id !== id; }); renderHub(); renderStrip(); });
        return;
      }
      if (e.target.closest('.vrh-done')) {
        // รายการทำซ้ำ: ✓ = ผ่านรอบนี้ เลื่อนไปรอบถัดไป · รายการครั้งเดียว: สลับเสร็จ/ไม่เสร็จ
        var body = x.repeat !== 'none' && !x.done ? { dueDate: iso(x.repeat === 'monthly' ? addMonths(parseIso(x.dueDate), 1) : addMonths(parseIso(x.dueDate), 12)) } : { done: !x.done };
        call('/api/reminders/' + id, 'PATCH', body).then(function (r) {
          if (!r.ok) { say(r.data.error || 'บันทึกไม่สำเร็จ'); return; }
          items = items.map(function (y) { return y.id === id ? r.data.item : y; }); sortItems(); renderHub(); renderStrip();
          if (body.dueDate) say('เลื่อนไปรอบถัดไป: ' + thDate(body.dueDate));
        });
      }
    });
    hub.querySelector('.vrh-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, fe = f.elements, it = { title: fe.namedItem('title').value.trim(), dueDate: fe.namedItem('date').value, kind: 'other', repeat: fe.namedItem('repeat').value };
      if (!it.title || !it.dueDate) return;
      var b = f.querySelector('button'); b.disabled = true;
      call('/api/reminders', 'POST', { items: [it] }).then(function (r) {
        b.disabled = false;
        if (!r.ok) { say(r.data.error || 'บันทึกไม่สำเร็จ'); return; }
        items = items.concat(r.data.items); sortItems(); f.reset(); f.hidden = true; renderHub(); renderStrip(); say('บันทึกแล้ว');
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hub && !hub.hidden) closeHub(); });
  }
  // ลบ: กดครั้งแรกให้ปุ่มเปลี่ยนเป็น "ลบ?" กดซ้ำภายใน 3 วินาทีจึงลบ (ไม่ใช้ confirm() ที่ค้างบน iPhone บางรุ่น)
  function confirmDel(row) {
    var b = row.querySelector('.vrh-del');
    if (b.classList.contains('is-arm')) return true;
    b.classList.add('is-arm'); b.textContent = 'ลบ?';
    setTimeout(function () { if (b.isConnected) { b.classList.remove('is-arm'); b.textContent = '✕'; } }, 3000);
    return false;
  }
  var lastFocus = null;
  function openHub() {
    if (!hub) buildHub();
    lastFocus = document.activeElement;
    hub.hidden = false; document.documentElement.classList.add('vrh-open');
    renderHub(); if (user() && !loaded) refresh();
    setTimeout(function () { var x = hub.querySelector('.vrh-x'); if (x) x.focus({ preventScroll: true }); }, 30);
  }
  function closeHub() {
    if (!hub) return; hub.hidden = true; document.documentElement.classList.remove('vrh-open');
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  function sortItems() { items.sort(function (a, b) { return (a.done - b.done) || (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : a.id - b.id); }); }
  function refresh() {
    if (!user()) { items = []; loaded = false; renderHub(); renderStrip(); renderMenu(); return Promise.resolve(); }
    return call('/api/reminders').then(function (r) {
      if (!r.ok) { if (r.status === 401) items = []; loaded = r.status === 401; renderHub(); return; }
      items = r.data.items || []; loaded = true; sortItems(); renderHub(); renderStrip(); renderMenu();
    });
  }

  /* ---------- 3) แถบเตือนบนหน้าตรวจ + ปุ่มในเมนูบัญชี ---------- */
  var DISMISS = 'vrm_strip_off';
  function renderStrip() {
    var host = document.getElementById('checkCard'), s = document.getElementById('vrmStrip');
    var due = items.filter(function (x) { return !x.done && daysLeft(x.dueDate) <= 30; });
    var off = false; try { off = sessionStorage.getItem(DISMISS) === due.map(function (x) { return x.id; }).join(','); } catch (e) {}
    if (!host || !user() || !due.length || off) { if (s) s.remove(); return; }
    if (!s) {
      s = document.createElement('div'); s.id = 'vrmStrip'; s.className = 'vrm-strip'; s.setAttribute('role', 'status');
      host.insertBefore(s, host.firstChild);
      s.addEventListener('click', function (e) {
        if (e.target.closest('.vrs-x')) { try { sessionStorage.setItem(DISMISS, s.dataset.ids); } catch (er) {} s.remove(); return; }
        openHub();
      });
    }
    var x = due[0], n = daysLeft(x.dueDate);
    s.dataset.ids = due.map(function (y) { return y.id; }).join(',');
    s.className = 'vrm-strip' + (n < 0 ? ' is-over' : n <= 7 ? ' is-near' : '');
    s.innerHTML = '<span class="vrm-ic">' + ICO_BELL + '</span><button type="button" class="vrs-main"><b>' + leftText(n) + '</b><span>' + h(x.title) + '</span>' +
      (due.length > 1 ? '<em>+' + (due.length - 1) + ' รายการ</em>' : '') + '<i aria-hidden="true">›</i></button><button type="button" class="vrs-x" aria-label="ซ่อนจนกว่าจะเปิดเว็บใหม่">✕</button>';
  }
  function renderMenu() {
    var nav = document.querySelector('#authLoggedIn .acct-menu'); if (!nav) return;
    var b = document.getElementById('vrmMenu');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'vrmMenu'; b.className = 'menu-item vrm-menu';
      b.innerHTML = '<span class="menu-ico" aria-hidden="true">' + ICO_BELL + '</span><span class="menu-txt"><b>แจ้งเตือนวันสำคัญ</b><small>วันสิ้นสุด วันแจ้งล่วงหน้า วันชำระเงิน</small></span><span class="vrm-badge" hidden></span>';
      nav.insertBefore(b, nav.firstChild);
      b.addEventListener('click', openHub);
    }
    var due = items.filter(function (x) { return !x.done && daysLeft(x.dueDate) <= 30; }).length, bd = b.querySelector('.vrm-badge');
    bd.hidden = !due; bd.textContent = due;
  }

  // ต่อจาก onAuthChange เดิม (pay-ui.js) — script.js เรียกตามชื่อนี้ทุกครั้งที่สถานะล็อกอินเปลี่ยน
  var prev = window.onAuthChange;
  window.onAuthChange = function (u) {
    if (typeof prev === 'function') try { prev(u); } catch (e) { console.error(e); }
    loaded = false; items = [];
    var sv = document.querySelector('.vrm-card:not(.is-saved) .vrm-save span'); if (sv) sv.textContent = u ? 'บันทึกแจ้งเตือน' : 'เข้าสู่ระบบเพื่อบันทึก';
    refresh();
  };
  function init() { renderMenu(); if (user()) refresh(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.VCRemind = { attach: attach, link: link, open: openHub, refresh: refresh, extract: extract, _ics: toCalendar };
})();
