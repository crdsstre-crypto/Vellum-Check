/* extras.js: ฟีเจอร์เสริมมือถือ (รอบ 11)
   - ถามต่อจากผลตรวจ (ปุ่มคำถามสำเร็จรูป + พิมพ์เอง)
   - ศูนย์ความเป็นส่วนตัว (ลบประวัติผลตรวจ)
   - การแสดงผล: กะทัดรัด, ขนาดตัวอักษร, ลดภาพเคลื่อนไหว
   - ปุ่มกลับขึ้นบน
   ไม่แก้ id เดิมใน index.html ถ้าไฟล์นี้โหลดไม่ขึ้น เว็บหลักยังทำงานปกติ */
(function () {
  'use strict';

  /* ---------- ตั้งค่าการแสดงผล (เก็บในเครื่อง) ---------- */
  var KEY = 'vc_display';
  var prefs = { compact: false, font: 'm', calm: false };
  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  function applyPrefs() {
    var h = document.documentElement;
    h.toggleAttribute('data-compact', !!prefs.compact);
    h.toggleAttribute('data-calm', !!prefs.calm);
    h.setAttribute('data-font', ['s', 'm', 'l'].indexOf(prefs.font) >= 0 ? prefs.font : 'm');
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }
  applyPrefs();

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toastMsg(t) {
    // ใช้ toast ของ script.js ถ้ามี
    if (typeof toast === 'function') toast(t); else alert(t);
  }

  /* ---------- ถามต่อจากผลตรวจ ---------- */
  var QUICK = [
    'อธิบายข้อที่เสี่ยงที่สุดแบบเข้าใจง่าย',
    'มีค่าใช้จ่ายแฝงตรงไหนบ้าง',
    'มีเงื่อนไขการยกเลิกอย่างไร',
    'มีข้อไหนที่ควรถามอีกฝ่ายก่อนเซ็น',
  ];

  function followupHtml() {
    return '<section class="fu" id="fuBox" aria-label="ถามต่อจากผลตรวจ">' +
      '<h3 class="fu-title">ถามต่อจากผลตรวจนี้</h3>' +
      '<div class="fu-chips">' + QUICK.map(function (q) {
        return '<button type="button" class="fu-chip" data-q="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('') + '</div>' +
      '<form class="fu-form" id="fuForm">' +
        '<input id="fuInput" type="text" maxlength="300" placeholder="พิมพ์คำถามของคุณ" autocomplete="off" enterkeyhint="send">' +
        '<button type="submit" class="primary" id="fuSend">ถาม</button>' +
      '</form>' +
      '<div class="fu-log" id="fuLog" aria-live="polite"></div>' +
      '<p class="fu-note">ตอบจากผลตรวจด้านบนเท่านั้น · ถามต่อฟรี (จำกัดชั่วโมงละ 15 ครั้ง) · ไม่ใช่คำปรึกษาทางกฎหมาย</p>' +
    '</section>';
  }

  var asking = false;
  async function ask(q) {
    q = (q || '').trim();
    if (!q || asking || typeof lastResult === 'undefined' || !lastResult) return;
    asking = true;
    var log = document.getElementById('fuLog');
    var send = document.getElementById('fuSend');
    if (send) send.disabled = true;
    log.insertAdjacentHTML('beforeend',
      '<div class="fu-q">' + esc(q) + '</div><div class="fu-a is-wait" id="fuWait">กำลังหาคำตอบจากผลตรวจ...</div>');
    var wait = document.getElementById('fuWait');
    try {
      var r = await api('/api/followup', 'POST', { question: q, result: lastResult });
      if (r.status === 401 && typeof showLoggedOut === 'function') showLoggedOut(CONFIG.messages.sessionEnded);
      wait.classList.remove('is-wait');
      if (r.ok && r.data.answer) {
        wait.textContent = r.data.answer;
        var inp = document.getElementById('fuInput'); if (inp) inp.value = '';
      } else {
        wait.classList.add('is-err');
        wait.textContent = r.status === 0 ? 'เน็ตมีปัญหา ลองถามใหม่อีกครั้ง' : (r.data.error || 'ตอบไม่สำเร็จ ลองใหม่อีกครั้ง');
      }
    } finally {
      wait.removeAttribute('id');
      asking = false;
      if (send) send.disabled = false;
      wait.scrollIntoView({ behavior: prefs.calm ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function watchResult() {
    var box = document.getElementById('result');
    if (!box) return;
    new MutationObserver(function () {
      // เติมกล่องถามต่อใต้ผลตรวจ เมื่อมีผลจริง (มีแถบแชร์) และยังไม่มีกล่อง
      if (box.querySelector('.share-bar') && !box.querySelector('#fuBox')) {
        var disc = box.querySelector('.disclaimer');
        if (disc) disc.insertAdjacentHTML('beforebegin', followupHtml());
        else box.insertAdjacentHTML('beforeend', followupHtml());
      }
    }).observe(box, { childList: true });
    box.addEventListener('click', function (e) {
      var c = e.target.closest('.fu-chip');
      if (c) ask(c.dataset.q);
    });
    box.addEventListener('submit', function (e) {
      if (e.target.id !== 'fuForm') return;
      e.preventDefault();
      ask(document.getElementById('fuInput').value);
    });
  }

  /* ---------- ศูนย์ความเป็นส่วนตัว + การแสดงผล (ในเมนูบัญชี) ---------- */
  var ICO_LOCK = '<svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true" focusable="false"><ellipse cx="32" cy="58.5" rx="17" ry="3" fill="#000" opacity=".3"/><path d="M20.5 30v-8.5a11.5 11.5 0 0 1 23 0V30" stroke="url(#vcg-s)" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="13" y="28" width="38" height="27" rx="8" fill="url(#vcg-g)"/><circle cx="32" cy="39" r="4.2" fill="url(#vcg-y)"/><rect x="30" y="41" width="4" height="9" rx="2" fill="url(#vcg-y)"/><path d="M18.5 37v-2a3 3 0 0 1 3-3H29" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".35"/></svg>';
  var ICO_DISP = '<svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true" focusable="false"><ellipse cx="32" cy="58.5" rx="17" ry="3" fill="#000" opacity=".3"/><rect x="8" y="8" width="48" height="48" rx="12" fill="url(#vcg-v)"/><rect x="16" y="19" width="32" height="4" rx="2" fill="#fff" opacity=".55"/><rect x="16" y="30" width="32" height="4" rx="2" fill="#fff" opacity=".55"/><rect x="16" y="41" width="32" height="4" rx="2" fill="#fff" opacity=".55"/><circle cx="27" cy="21" r="5.5" fill="url(#vcg-y)"/><circle cx="40" cy="32" r="5.5" fill="url(#vcg-p)"/><circle cx="30" cy="43" r="5.5" fill="url(#vcg-g)"/><path d="M13 16a6 6 0 0 1 5-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".4" fill="none"/></svg>';

  function menuHtml() {
    return '' +
    '<button type="button" class="menu-item" id="privBtn" aria-expanded="false" aria-controls="privPanel">' +
      '<span class="menu-ico" aria-hidden="true">' + ICO_LOCK + '</span>' +
      '<span class="menu-txt"><b>ความเป็นส่วนตัวของข้อมูล</b><small>ข้อมูลไปที่ไหน เก็บนานแค่ไหน ลบได้อย่างไร</small></span>' +
    '</button>' +
    '<div class="menu-panel" id="privPanel" hidden>' +
      '<ul class="priv-list">' +
        '<li><b>ส่งไปประมวลผลที่ไหน</b>ข้อความสัญญาที่คุณกดตรวจจะถูกส่งให้ผู้ให้บริการ AI (Anthropic) เพื่อวิเคราะห์ ไฟล์ PDF/Word/รูปภาพถูกอ่านเป็นข้อความบนเซิร์ฟเวอร์ของเรา</li>' +
        '<li><b>เราเก็บอะไร</b>เก็บเฉพาะ "ผลตรวจ" ล่าสุดไม่เกิน 50 รายการต่อบัญชี ไม่เก็บข้อความสัญญาต้นฉบับไว้ในฐานข้อมูล</li>' +
        '<li><b>บันทึก (log)</b>ระบบไม่บันทึกเนื้อหาสัญญาลง log เก็บเพียงจำนวนตัวอักษรและชนิดไฟล์ตอนอัปโหลด</li>' +
        '<li><b>หน้าประวัติ</b>แสดงเพียงวันที่และประเภท ไม่แสดงเนื้อหาจนกว่าคุณจะกดเปิด</li>' +
        '<li><b>คำแนะนำ</b>ไม่ควรวางเลขบัตรประชาชน เลขบัญชี หรือข้อมูลที่ไม่เกี่ยวกับการตรวจ</li>' +
      '</ul>' +
      '<button type="button" class="priv-del" id="privDel">ลบผลตรวจทั้งหมดของฉัน</button>' +
      '<p class="priv-note" id="privNote" role="status"></p>' +
    '</div>' +
    '<button type="button" class="menu-item" id="dispBtn" aria-expanded="false" aria-controls="dispPanel">' +
      '<span class="menu-ico" aria-hidden="true">' + ICO_DISP + '</span>' +
      '<span class="menu-txt"><b>การแสดงผล</b><small>กะทัดรัด ขนาดตัวอักษร ลดภาพเคลื่อนไหว</small></span>' +
    '</button>' +
    '<div class="menu-panel" id="dispPanel" hidden>' +
      '<div class="disp-row"><span>ขนาดตัวอักษร</span>' +
        '<div class="seg" role="group" aria-label="ขนาดตัวอักษร">' +
          '<button type="button" data-font="s" aria-label="เล็ก">ก</button>' +
          '<button type="button" data-font="m" aria-label="กลาง">ก</button>' +
          '<button type="button" data-font="l" aria-label="ใหญ่">ก</button>' +
        '</div></div>' +
      '<label class="disp-row"><span>โหมดกะทัดรัด<small>ลดระยะห่างและความสูงการ์ด</small></span><input type="checkbox" id="dispCompact"></label>' +
      '<label class="disp-row"><span>ลดภาพเคลื่อนไหว<small>เหมาะกับเครื่องช้า</small></span><input type="checkbox" id="dispCalm"></label>' +
    '</div>';
  }

  function toggleAcc(btn, panel) {
    var open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  }

  function syncDisplayUi() {
    var p = document.getElementById('dispPanel');
    if (!p) return;
    p.querySelectorAll('.seg button').forEach(function (b) {
      var on = b.dataset.font === prefs.font;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    document.getElementById('dispCompact').checked = !!prefs.compact;
    document.getElementById('dispCalm').checked = !!prefs.calm;
  }

  function buildMenu() {
    var anchor = document.getElementById('acctDetail');
    if (!anchor || document.getElementById('privBtn')) return;
    anchor.insertAdjacentHTML('afterend', menuHtml());
    document.getElementById('privBtn').addEventListener('click', function () {
      toggleAcc(this, document.getElementById('privPanel'));
    });
    document.getElementById('dispBtn').addEventListener('click', function () {
      toggleAcc(this, document.getElementById('dispPanel'));
    });
    document.getElementById('dispPanel').addEventListener('click', function (e) {
      var b = e.target.closest('.seg button');
      if (b) { prefs.font = b.dataset.font; applyPrefs(); syncDisplayUi(); }
    });
    document.getElementById('dispCompact').addEventListener('change', function () { prefs.compact = this.checked; applyPrefs(); });
    document.getElementById('dispCalm').addEventListener('change', function () { prefs.calm = this.checked; applyPrefs(); });
    syncDisplayUi();

    var del = document.getElementById('privDel');
    del.addEventListener('click', async function () {
      var note = document.getElementById('privNote');
      if (!confirm('ลบผลตรวจทั้งหมดของบัญชีนี้ใช่ไหม? ลบแล้วกู้คืนไม่ได้ (ประวัติการเติมเครดิตและเครดิตคงเหลือไม่หาย)')) return;
      del.disabled = true;
      var r = await api('/api/history/inspections', 'DELETE');
      del.disabled = false;
      if (r.ok) {
        note.textContent = 'ลบผลตรวจแล้ว ' + (r.data.deleted || 0) + ' รายการ';
        var list = document.getElementById('histList');
        if (list && !document.getElementById('historyPanel').hidden) list.innerHTML = '';
        toastMsg('ลบผลตรวจทั้งหมดแล้ว');
      } else {
        note.textContent = r.status === 0 ? 'เน็ตมีปัญหา ลองใหม่อีกครั้ง' : (r.data.error || 'ลบไม่สำเร็จ ลองใหม่อีกครั้ง');
      }
    });
  }


  /* ---------- Smart Highlight: ดูสัญญาพร้อมไฮไลต์ตามระดับความเสี่ยง ---------- */
  var LV_TEXT = { check_detail: 'ควรตรวจละเอียด', caution: 'ควรระวัง', low: 'เสี่ยงต่ำ' };
  var viewerEl = null;

  // หาตำแหน่งข้อความที่ AI อ้างในสัญญา แล้วตัดช่วงที่ซ้อนกันทิ้ง
  function buildRanges(text, items) {
    var out = [];
    items.forEach(function (it, i) {
      var q = (it.quote || '').trim();
      if (!q || it.missing) return;
      var at = text.indexOf(q), len = q.length;
      if (at < 0 && q.length > 40) { at = text.indexOf(q.slice(0, 40)); len = Math.min(q.length, text.length - at); }
      if (at < 0) return;
      out.push({ start: at, end: at + len, i: i, level: it.level });
    });
    out.sort(function (a, b) { return a.start - b.start; });
    var kept = [];
    out.forEach(function (r) {
      var last = kept[kept.length - 1];
      if (!last || r.start >= last.end) kept.push(r);
    });
    return kept;
  }

  function buildViewer() {
    var v = document.createElement('div');
    v.className = 'vw';
    v.hidden = true;
    v.setAttribute('role', 'dialog');
    v.setAttribute('aria-modal', 'true');
    v.setAttribute('aria-label', 'สัญญาพร้อมไฮไลต์');
    v.innerHTML =
      '<div class="vw-head"><b>สัญญาพร้อมไฮไลต์</b><button type="button" class="vw-close" aria-label="ปิด">✕</button></div>' +
      '<div class="vw-legend"><span class="lv-check_detail">ควรตรวจละเอียด</span><span class="lv-caution">ควรระวัง</span><span class="lv-low">เสี่ยงต่ำ</span></div>' +
      '<div class="vw-body" id="vwBody"></div>' +
      '<div class="vw-pop" id="vwPop" hidden></div>';
    document.body.appendChild(v);
    v.querySelector('.vw-close').addEventListener('click', closeViewer);
    v.addEventListener('click', function (e) {
      var m = e.target.closest('mark.hl');
      var pop = document.getElementById('vwPop');
      if (m) { showPop(+m.dataset.i, m); return; }
      if (!e.target.closest('.vw-pop')) pop.hidden = true;
    });
    return v;
  }

  function showPop(i, mark) {
    var it = lastResult.items[i];
    var pop = document.getElementById('vwPop');
    pop.className = 'vw-pop lv-' + it.level;
    pop.innerHTML =
      '<span class="vw-tag">' + esc(LV_TEXT[it.level] || '') + '</span>' +
      '<b>' + esc(String(i + 1).padStart(2, '0')) + ' — ' + esc(it.title) + '</b>' +
      (it.explanation ? '<p>' + esc(it.explanation) + '</p>' : '') +
      '<button type="button" class="vw-go">ดูรายละเอียดในรายงาน</button>';
    pop.hidden = false;
    document.querySelectorAll('#vwBody mark.hl').forEach(function (x) { x.classList.toggle('is-on', x === mark); });
    pop.querySelector('.vw-go').addEventListener('click', function () {
      closeViewer();
      if (typeof window.focusIssue === 'function') { window.focusIssue(i); return; }
      var card = document.querySelectorAll('#result details.item')[i];
      if (card) { card.open = true; card.scrollIntoView({ behavior: prefs.calm ? 'auto' : 'smooth', block: 'start' }); }
    });
  }

  function closeViewer() {
    if (!viewerEl) return;
    viewerEl.hidden = true;
    document.body.classList.remove('vw-open');
  }

  // เปิดตัวดูสัญญา แล้วเลื่อนไปที่ไฮไลต์ของรายการที่ index
  window.openViewer = function (index) {
    if (typeof viewerSrc === 'undefined' || !viewerSrc || viewerSrc.result !== lastResult) {
      toastMsg('ผลจากประวัติไม่มีข้อความสัญญา เพราะระบบไม่เก็บข้อความไว้');
      return;
    }
    if (!viewerEl) viewerEl = buildViewer();
    var text = viewerSrc.text;
    var items = lastResult.items || [];
    var ranges = buildRanges(text, items);
    var html = '', pos = 0;
    ranges.forEach(function (r) {
      html += esc(text.slice(pos, r.start)) +
        '<mark class="hl lv-' + esc(r.level) + '" data-i="' + r.i + '" id="hl' + r.i + '" tabindex="0">' + esc(text.slice(r.start, r.end)) + '</mark>';
      pos = r.end;
    });
    html += esc(text.slice(pos));
    document.getElementById('vwBody').innerHTML = html;
    document.getElementById('vwPop').hidden = true;
    viewerEl.hidden = false;
    document.body.classList.add('vw-open');
    var target = document.getElementById('hl' + index);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView({ behavior: prefs.calm ? 'auto' : 'smooth', block: 'center' });
        showPop(index, target);
      }, 60);
    } else {
      toastMsg('หาตำแหน่งข้อความนี้ไม่พบ ลองเปิดจากรายการอื่น');
    }
  };

  /* ---------- ปุ่มกลับขึ้นบน ---------- */
  function buildTop() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.setAttribute('aria-label', 'กลับขึ้นด้านบน');
    b.hidden = true;
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
    document.body.appendChild(b);
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        b.hidden = window.scrollY < 700;
        ticking = false;
      });
    }, { passive: true });
    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefs.calm ? 'auto' : 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { watchResult(); buildMenu(); buildTop(); }
    catch (e) { console.error('[extras]', e); }
  });
})();
