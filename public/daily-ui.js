/* ===== เช็กอินรายวัน + แต้มแลกเครดิต (หน้าเว็บ) — เซิร์ฟเวอร์: server/daily.js =====
   - แถบบนหน้าตรวจสัญญา: ยังไม่เช็กอินวันนี้ → ปุ่มเช็กอินรับแต้ม
   - หน้าต่างเช็กอิน: รอบ 7 วัน แต้มสะสม แลก 300 แต้ม = ตรวจฟรี 1 ครั้ง
   - ปุ่ม "เช็กอินรายวัน" ในเมนูบัญชี */
(function () {
  'use strict';

  var S = null, box = null, busy = false;
  var ICO_GIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="17" height="11.5" rx="2"/><path d="M2.5 9h19v-1a1 1 0 0 0-1-1h-17a1 1 0 0 0-1 1zM12 7v13.5"/><path d="M12 7c-1.5-3.5-5.5-3.6-5.5-1.2C6.5 7 9 7 12 7zM12 7c1.5-3.5 5.5-3.6 5.5-1.2C17.5 7 15 7 12 7z"/></svg>';
  var ICO_FIRE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.6 3-5.6 3.6-9.4 2.5 1.5 3.6 3.6 3.6 5.6 1-.7 1.6-1.9 1.7-3.1 2.4 1.9 3.6 4.3 3.6 6.9 0 3.5-2.6 6.1-6 6.1z"/></svg>';
  var ICO_COIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 9.5h3.7a1.6 1.6 0 0 1 0 3.2h-2.4a1.6 1.6 0 0 0 0 3.2h3.7"/></svg>';

  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function say(m) { if (typeof toast === 'function') toast(m); }
  function user() { try { return typeof currentUser !== 'undefined' ? currentUser : null; } catch (e) { return null; } }
  function call(path, method) {
    if (typeof api === 'function') return api(path, method || 'GET');
    return fetch(path, { method: method || 'GET', credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); })
      .catch(function () { return { ok: false, status: 0, data: { error: 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง' } }; });
  }
  function fmt(n) { return Number(n || 0).toLocaleString('th-TH'); }
  function slot() { if (!S) return 0; for (var i = 0; i < S.week.length; i++) if (S.week[i].today) return i + 1; return 0; }

  /* ---------- หน้าต่างเช็กอิน (สไตล์หน้ารับรางวัลเกม) ---------- */
  // ภาพรางวัลแต่ละวัน: เหรียญเพิ่มขึ้นตามวัน · วันที่ 7 เป็นกล่องสมบัติ
  var COIN = function (x, y, r) { return '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="' + (r * .22) + '" rx="' + r + '" ry="' + (r * .9) + '" fill="#9a6a12"/><ellipse cx="0" cy="0" rx="' + r + '" ry="' + (r * .9) + '" fill="url(#vdcG)"/><ellipse cx="0" cy="0" rx="' + (r * .66) + '" ry="' + (r * .58) + '" fill="none" stroke="#fff3c4" stroke-width="' + (r * .1) + '" opacity=".7"/><path d="M' + (-r * .12) + ' ' + (-r * .34) + 'v' + (r * .68) + 'M' + (r * .14) + ' ' + (-r * .34) + 'v' + (r * .68) + '" stroke="#8a5a08" stroke-width="' + (r * .13) + '" stroke-linecap="round"/></g>'; };
  var ART = [
    COIN(32, 34, 15),
    COIN(25, 37, 12) + COIN(39, 31, 12),
    COIN(22, 39, 11) + COIN(42, 39, 11) + COIN(32, 27, 11),
    COIN(24, 42, 10) + COIN(40, 42, 10) + COIN(24, 30, 10) + COIN(40, 30, 10),
    COIN(32, 46, 11) + COIN(32, 38, 11) + COIN(32, 30, 11) + COIN(19, 44, 9) + COIN(45, 44, 9),
    COIN(18, 46, 10) + COIN(46, 46, 10) + COIN(32, 46, 10) + COIN(25, 34, 10) + COIN(39, 34, 10) + COIN(32, 23, 10),
    // กล่องสมบัติ
    '<path d="M8 30h48v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="#7a3f12"/><path d="M8 30h48v6H8z" fill="#5c2c0b"/><path d="M10 30c0-11 9-18 22-18s22 7 22 18z" fill="#a8561b"/>' +
    '<path d="M28 12h8v44h-8z" fill="url(#vdcG)"/><path d="M8 30h48" stroke="url(#vdcG)" stroke-width="4"/><rect x="26" y="27" width="12" height="13" rx="3" fill="url(#vdcG)" stroke="#8a5a08" stroke-width="1.5"/><circle cx="32" cy="33" r="2" fill="#5c3a06"/>' +
    '<path d="M14 18l2-5 2 5 5 2-5 2-2 5-2-5-5-2zM50 9l1.4-3.5L53 9l3.5 1.4L53 12l-1.6 3.5L50 12l-3.5-1.6z" fill="#fff4c2"/>'
  ];
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="vdcG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".45" stop-color="#f4c542"/><stop offset="1" stop-color="#c88a12"/></linearGradient></defs></svg>';
  var ICO_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>';
  var ICO_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4.2 4.2L18.5 8"/></svg>';

  // นับถอยหลังถึงเที่ยงคืนเวลาไทย (UTC+7 ไม่มีเวลาออมแสง)
  function msToMidnight() { var d = 864e5, o = 7 * 36e5, n = Date.now(); return (Math.floor((n + o) / d) + 1) * d - o - n; }
  function hms2(ms) { var t = Math.max(0, Math.floor(ms / 1000)), p = function (n) { return (n < 10 ? '0' : '') + n; }; return Math.floor(t / 3600) + ':' + p(Math.floor(t % 3600 / 60)) + ':' + p(t % 60); }
  function hms(ms) { var t = Math.max(0, Math.floor(ms / 1000)), hh = Math.floor(t / 3600), mm = Math.floor(t % 3600 / 60), ss = t % 60; return hh + ' ชม. ' + mm + ' นาที ' + ss + ' วิ'; }
  var tick = null;
  function startTick() {
    stopTick();
    tick = setInterval(function () {
      if (!box || box.hidden) { stopTick(); return; }
      var ms = msToMidnight(), el = box.querySelectorAll('[data-cd]');
      [].forEach.call(el, function (x) { x.textContent = x.getAttribute('data-cd') === 's' ? hms2(ms) : hms(ms); });
      if (ms < 1000) { stopTick(); setTimeout(load, 1500); }  // ขึ้นวันใหม่
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  function cardHtml(w, i) {
    var st = w.done ? 'is-done' : w.today ? 'is-open' : 'is-lock', next = S.checkedToday && i === S.week.filter(function (x) { return x.done; }).length;
    var foot = w.done ? '<span class="vdg-st">' + ICO_OK + 'รับแล้ว</span>'
      : w.today ? '<span class="vdg-st">กดรับ</span>'
      : next ? '<span class="vdg-st is-cd">' + ICO_LOCK + '<i data-cd="s">' + hms2(msToMidnight()) + '</i></span>'
      : '<span class="vdg-st">' + ICO_LOCK + 'ล็อก</span>';
    var tag = w.today ? 'button type="button"' : 'div';
    return '<' + tag + ' class="vdg-c ' + st + (i === 6 ? ' is-big' : '') + '" data-i="' + i + '"' + (w.today ? ' aria-label="รับรางวัลวันที่ ' + w.day + ' +' + w.reward + ' แต้ม"' : '') + '>' +
      '<span class="vdg-day">วันที่ ' + w.day + '</span>' +
      '<svg class="vdg-art" viewBox="0 0 64 64" aria-hidden="true">' + ART[i] + '</svg>' +
      '<span class="vdg-amt">' + (i === 6 ? 'รางวัลใหญ่ ' : '') + '+' + w.reward + ' <small>แต้ม</small></span>' + foot +
      '</' + (w.today ? 'button' : 'div') + '>';
  }
  function render() {
    if (!box || !S) return;
    var r = S.redeem, pct = Math.min(100, Math.round(S.points / r.cost * 100)), done = S.week.filter(function (x) { return x.done; }).length;
    var reason = r.canRedeem ? '' : r.usedThisMonth >= r.perMonth ? 'เดือนนี้แลกครบ ' + r.perMonth + ' ครั้งแล้ว' : 'อีก ' + fmt(r.cost - S.points) + ' แต้ม';
    box.querySelector('.vdg-side').innerHTML =
      '<div class="vdg-panel vdg-fire">' + ICO_FIRE + '<div><b>' + S.streak + '</b><span>วันติดต่อกัน</span></div></div>' +
      '<div class="vdg-panel vdg-wallet"><span>แต้มสะสม</span><b>' + fmt(S.points) + '</b>' +
      '<div class="vdg-bar" role="progressbar" aria-label="ความคืบหน้าสู่การแลก" aria-valuemin="0" aria-valuemax="' + r.cost + '" aria-valuenow="' + Math.min(S.points, r.cost) + '"><i style="width:' + pct + '%"></i></div>' +
      '<small>' + fmt(r.cost) + ' แต้ม = ตรวจสัญญาฟรี 1 ครั้ง</small>' +
      '<button type="button" class="vdg-redeem"' + (r.canRedeem ? '' : ' disabled') + '>' + (r.canRedeem ? 'แลกตรวจฟรี 1 ครั้ง' : h(reason)) + '</button></div>' +
      '<ul class="vdg-rules"><li>รับได้วันละ 1 ช่อง ขึ้นวันใหม่ตอนเที่ยงคืน (เวลาไทย)</li><li>ขาดวันไหน เริ่มวันที่ 1 ใหม่ แต้มที่สะสมไม่หาย</li><li>แลกได้เดือนละ ' + r.perMonth + ' ครั้ง · ใช้แล้ว ' + r.usedThisMonth + '</li></ul>';
    box.querySelector('.vdg-main').innerHTML =
      '<div class="vdg-bar2"><span class="vdg-chip"><b>' + done + '/7</b> วัน</span>' +
      (S.checkedToday ? '<span class="vdg-next">รับครั้งถัดไปใน <b data-cd>' + hms(msToMidnight()) + '</b></span>' : '<span class="vdg-next">วันนี้รับได้ <b>+' + S.todayReward + ' แต้ม</b></span>') +
      '<button type="button" class="vdg-claim"' + (S.checkedToday ? ' disabled' : '') + '>' + (S.checkedToday ? 'รับแล้ววันนี้' : 'รับรางวัล') + '</button></div>' +
      '<div class="vdg-grid">' + S.week.map(cardHtml).join('') + '</div>';
    startTick();
  }
  function build() {
    box = document.createElement('div'); box.className = 'vdc'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'vdcT');
    box.innerHTML = DEFS + '<div class="vdc-bg" data-x></div><div class="vdg-frame"><div class="vdc-grip" aria-hidden="true"></div>' +
      '<button type="button" class="vdg-x" data-x aria-label="ปิด">✕</button>' +
      '<h3 class="vdg-title" id="vdcT"><span>7 วัน</span> รับรางวัลรายวัน!</h3>' +
      '<div class="vdg-in"><aside class="vdg-side"></aside><section class="vdg-main"><p class="vdc-wait">กำลังโหลด…</p></section></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) { close(); return; }
      if (e.target.closest('.vdg-c.is-open, .vdg-claim')) { checkin(); return; }
      if (e.target.closest('.vdg-redeem')) redeem();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && !box.hidden) close(); });
  }
  var lastFocus = null;
  function open() {
    if (!user()) { if (window.VCAuthGate) window.VCAuthGate.open(); else say('เข้าสู่ระบบก่อนนะครับ'); return; }
    if (!box) build();
    lastFocus = document.activeElement;
    box.hidden = false; document.documentElement.classList.add('vdc-open');
    if (S) render();
    load();
    setTimeout(function () { var x = box.querySelector('.vdg-c.is-open') || box.querySelector('.vdg-x'); if (x) x.focus({ preventScroll: true }); }, 40);
  }
  function close() {
    if (!box) return; box.hidden = true; document.documentElement.classList.remove('vdc-open'); stopTick();
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- การทำงาน ---------- */
  function apply(d) { S = d; render(); strip(); menu(); }
  function load() {
    if (!user()) { S = null; strip(); menu(); return Promise.resolve(); }
    return call('/api/daily').then(function (r) { if (r.ok) apply(r.data); else if (box && !box.hidden && !S) box.querySelector('.vdg-main').innerHTML = '<p class="vdc-wait">' + h(r.data.error || 'โหลดไม่สำเร็จ') + '</p>'; });
  }
  function checkin() {
    if (busy) return; busy = true;
    [].forEach.call(document.querySelectorAll('.vdg-claim, .vdg-c.is-open, .vds-go'), function (b) { b.disabled = true; });
    call('/api/daily/checkin', 'POST').then(function (r) {
      busy = false;
      if (!r.ok) { say(r.data.error || 'เช็กอินไม่สำเร็จ'); [].forEach.call(document.querySelectorAll('.vdg-claim, .vdg-c.is-open, .vds-go'), function (b) { b.disabled = false; }); return; }
      var k = S ? S.week.filter(function (x) { return x.done; }).length : 0;
      apply(r.data);
      if (box && !box.hidden) { var jc = box.querySelector('.vdg-c[data-i="' + k + '"]'); if (jc) jc.classList.add('just-claimed'); }
      if (r.data.gained) {
        say((r.data.bonus ? 'ครบ 7 วัน! ' : '') + 'เช็กอินแล้ว +' + r.data.gained + ' แต้ม');
        pop(r.data.gained);
      }
    });
  }
  function redeem() {
    if (busy || !S || !S.redeem.canRedeem) return; busy = true;
    var b = box && box.querySelector('.vdg-redeem'); if (b) b.disabled = true;
    call('/api/daily/redeem', 'POST').then(function (r) {
      busy = false;
      if (!r.ok) { say(r.data.error || 'แลกไม่สำเร็จ'); if (r.data && r.data.redeem) apply(r.data); else render(); return; }
      apply(r.data);
      say('แลกแล้ว ได้เครดิตตรวจ +1 ครั้ง');
      // อัปเดตเครดิตบนหน้าเว็บ (กระเป๋า ป้ายเครดิต ปุ่มตรวจ)
      call('/api/me').then(function (m) { if (m.ok && typeof showCredits === 'function') showCredits(m.data.credits, m.data.voice_credits); });
    });
  }
  // แต้มลอยขึ้นเล็กน้อยตอนเช็กอินสำเร็จ
  function pop(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t = document.querySelector('.vdc:not([hidden]) .vdg-c.just-claimed') || document.querySelector('.vdc:not([hidden]) .vdg-wallet') || document.getElementById('vdcStrip');
    if (!t) return;
    var r = t.getBoundingClientRect(), p = document.createElement('span');
    p.className = 'vdc-pop'; p.textContent = '+' + n;
    p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top + 8) + 'px';
    document.body.appendChild(p); setTimeout(function () { p.remove(); }, 1300);
  }

  /* ---------- แถบบนหน้าตรวจ (แสดงเฉพาะวันที่ยังไม่เช็กอิน) ---------- */
  var OFF = 'vdc_strip_off';
  function strip() {
    var host = document.getElementById('checkCard'), s = document.getElementById('vdcStrip');
    var off = false; try { off = S && sessionStorage.getItem(OFF) === S.today; } catch (e) {}
    if (!host || !user() || !S || S.checkedToday || off) {
      if (s && S && S.checkedToday && !s.classList.contains('is-done')) {
        // เพิ่งเช็กอิน: เปลี่ยนเป็นข้อความยืนยันสั้นๆ แล้วค่อยหายไป
        s.classList.add('is-done');
        s.innerHTML = '<span class="vdc-ic">' + ICO_FIRE + '</span><span class="vds-txt"><b>เช็กอินแล้ว · ' + S.streak + ' วันติด</b><small>แต้มสะสม ' + fmt(S.points) + ' · พรุ่งนี้ +' + S.tomorrowReward + '</small></span>';
        setTimeout(function () { if (s.isConnected) { s.classList.add('is-out'); setTimeout(function () { s.remove(); }, 400); } }, 3500);
      } else if (s && !(s.classList.contains('is-done'))) s.remove();
      return;
    }
    if (!s) {
      s = document.createElement('div'); s.id = 'vdcStrip'; s.className = 'vdc-strip';
      host.insertBefore(s, host.firstChild);
      s.addEventListener('click', function (e) {
        if (e.target.closest('.vds-go')) { checkin(); return; }
        if (e.target.closest('.vds-x')) { try { sessionStorage.setItem(OFF, S.today); } catch (er) {} s.remove(); return; }
        if (e.target.closest('.vds-txt')) open();
      });
    }
    var k = slot();
    s.innerHTML = '<span class="vdc-ic">' + ICO_GIFT + '</span>' +
      '<button type="button" class="vds-txt"><b>เช็กอินวันนี้ +' + S.todayReward + ' แต้ม</b><small>วันที่ ' + k + '/7 · สะสม ' + fmt(S.points) + ' แต้ม</small></button>' +
      '<button type="button" class="vds-go">เช็กอิน</button><button type="button" class="vds-x" aria-label="ซ่อนวันนี้">✕</button>';
  }

  /* ---------- ปุ่มในเมนูบัญชี ---------- */
  function menu() {
    var nav = document.querySelector('#authLoggedIn .acct-menu'); if (!nav) return;
    var b = document.getElementById('vdcMenu');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'vdcMenu'; b.className = 'menu-item vdc-menu';
      b.innerHTML = '<span class="menu-ico" aria-hidden="true">' + ICO_GIFT + '</span><span class="menu-txt"><b>เช็กอินรายวัน</b><small>สะสมแต้มแลกตรวจสัญญาฟรี</small></span><span class="vdc-badge" hidden></span>';
      nav.insertBefore(b, nav.firstChild);
      b.addEventListener('click', open);
    }
    var bd = b.querySelector('.vdc-badge'), sm = b.querySelector('small');
    if (S) sm.textContent = 'แต้มสะสม ' + fmt(S.points) + (S.streak ? ' · ' + S.streak + ' วันติด' : '');
    bd.hidden = !(S && !S.checkedToday); bd.textContent = 'ใหม่';
  }

  // ต่อจาก onAuthChange เดิม (pay-ui.js / remind-ui.js)
  var prev = window.onAuthChange;
  window.onAuthChange = function (u) {
    if (typeof prev === 'function') try { prev(u); } catch (e) { console.error(e); }
    S = null; load();
  };
  // กลับมาที่แท็บหลังเที่ยงคืน: โหลดใหม่ให้ได้วันใหม่
  document.addEventListener('visibilitychange', function () { if (!document.hidden && user()) load(); });
  function init() { menu(); if (user()) load(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.VCDaily = { open: open, refresh: load };
})();
