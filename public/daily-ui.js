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
  // มาสคอตเวลลัม (mascot.js) — ถ้าโหลดไม่ได้ใช้ไอคอนเดิมแทน
  var justClaimed = null;   // 'happy' | 'party' หลังกดรับในรอบนี้
  function mood() {
    if (!S) return 'wave';
    if (S.checkedToday) return justClaimed || 'sleep';
    return S.streak === 0 && S.totalDays > 0 ? 'sad' : 'wave';
  }
  function mascot(m, size, fallback) { return window.VCMascot ? window.VCMascot.svg(m, size) : (fallback || ''); }
  function line(m) {
    if (!S) return '';
    if (m === 'party') return 'ครบ 7 วันแล้ว! เปิดกล่องสมบัติได้ +' + S.week[6].reward + ' แต้ม';
    if (m === 'happy') return 'เย่! เก็บแต้มแล้ว พรุ่งนี้มารับ +' + S.tomorrowReward + ' นะ';
    if (m === 'sleep') return 'วันนี้รับไปแล้ว เจอกันพรุ่งนี้นะ… zzz';
    if (m === 'sad') return 'เมื่อวานพลาดไปนิด ไม่เป็นไร แต้มยังอยู่ครบ เริ่มใหม่กัน!';
    return S.week[6].today ? 'วันนี้เปิดกล่องสมบัติได้แล้ว!' : 'วันนี้มีของรออยู่นะ! กดรับ +' + S.todayReward + ' แต้มเลย';
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
      var mn = box.querySelector('.vdg-moon'); if (mn) mn.style.setProperty('--dp', (100 - ms / 864e3).toFixed(1) + '%');
      if (ms < 1000) { stopTick(); setTimeout(load, 1500); }  // ขึ้นวันใหม่
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  function cardHtml(w, i) {
    var done = S.week.filter(function (x) { return x.done; }).length;
    var st = w.done ? 'is-done' : w.today ? 'is-open' : 'is-lock', soon = S.checkedToday && i === done;
    var foot = w.done ? '' : w.today ? 'วันนี้' : soon ? 'พรุ่งนี้ <b data-cd="s">' + hms2(msToMidnight()) + '</b>' : '';
    var tag = w.today ? 'button' : 'div';
    return '<' + tag + (w.today ? ' type="button"' : '') + ' class="vdg-c ' + st + (soon ? ' is-soon' : '') + (i === 6 ? ' is-big' : '') + '" data-i="' + i + '"' +
      (w.today ? ' aria-label="รับรางวัลวันที่ ' + w.day + ' +' + w.reward + ' แต้ม"' : ' aria-label="วันที่ ' + w.day + ' +' + w.reward + ' แต้ม ' + (w.done ? 'รับแล้ว' : 'ยังไม่ถึง') + '"') + '>' +
      '<span class="vdg-day">' + (i === 6 ? 'วันที่ 7 · กล่องสมบัติ' : 'วัน ' + w.day) + '</span>' +
      '<svg class="vdg-art" viewBox="0 0 64 64" aria-hidden="true">' + ART[i] + '</svg>' +
      '<span class="vdg-amt">+' + w.reward + '</span>' +
      (foot ? '<span class="vdg-tag">' + foot + '</span>' : '') +
      (w.done ? '<span class="vdg-ok" aria-hidden="true">' + ICO_OK + '</span><span class="vdg-seal" aria-hidden="true"><i>รับแล้ว</i></span>' : '') +
      (!w.done && !w.today ? '<span class="vdg-lk" aria-hidden="true">' + ICO_LOCK + '</span>' : '') +
      '</' + tag + '>';
  }
  function render() {
    if (!box || !S) return;
    var r = S.redeem, pct = Math.min(100, Math.round(S.points / r.cost * 100)), done = S.week.filter(function (x) { return x.done; }).length;
    // อีกกี่วันถึงกล่องสมบัติ (วันที่ 7)
    var toChest = S.checkedToday ? 7 - done : 6 - done;
    var hint = S.week[6].done ? 'ครบรอบ 7 วันแล้ว! พรุ่งนี้เริ่มรอบใหม่' : S.week[6].today ? 'วันนี้เปิดกล่องสมบัติได้!' : 'อีก ' + toChest + ' วัน เปิดกล่องสมบัติ +' + S.week[6].reward + ' แต้ม';
    var need = r.cost - S.points;
    var redeemRow = r.canRedeem
      ? '<button type="button" class="vdg-redeem">แลกตรวจฟรี 1 ครั้ง</button>'
      : '<span class="vdg-need">' + (r.usedThisMonth >= r.perMonth ? 'เดือนนี้แลกครบ ' + r.perMonth + ' ครั้งแล้ว' : 'อีก <b>' + fmt(need) + '</b> แต้ม แลกตรวจฟรี 1 ครั้ง') + '</span>';
    box.querySelector('.vdg-body').innerHTML =
      '<div class="vdg-sum">' +
        '<div class="vdg-fire' + (S.streak ? '' : ' is-zero') + '">' + ICO_FIRE + '<b>' + S.streak + '</b><span>' + (S.streak ? 'วันติด' : 'เริ่มวันแรก') + '</span></div>' +
        '<div class="vdg-wallet"><div class="vdg-wl"><svg class="vdg-coin" viewBox="0 0 64 64" aria-hidden="true">' + COIN(32, 30, 22) + '</svg><b data-pts>' + fmt(S.points) + '</b><span>/ ' + fmt(r.cost) + ' แต้ม</span></div>' +
          '<div class="vdg-bar" role="progressbar" aria-label="แต้มสะสมสู่การแลกตรวจฟรี" aria-valuemin="0" aria-valuemax="' + r.cost + '" aria-valuenow="' + Math.min(S.points, r.cost) + '"><i style="width:' + pct + '%"></i>' + [1, 2].map(function (k) { var v = Math.round(r.cost * k / 3); return '<s class="' + (S.points >= v ? 'on' : '') + '" style="left:' + (k * 100 / 3).toFixed(2) + '%"><em>' + fmt(v) + '</em></s>'; }).join('') + '<s class="end' + (S.points >= r.cost ? ' on' : '') + '" style="left:100%"><em>ตรวจฟรี</em></s></div>' +
          redeemRow + '</div>' +
      '</div>' +
      '<div class="vdg-grid">' + S.week.map(cardHtml).join('') + '</div>' +
      '<p class="vdg-hint">' + hint + '</p>' +
      '<details class="vdg-rules"><summary>กติกา</summary><ul><li>รับได้วันละ 1 ครั้ง ขึ้นวันใหม่ตอนเที่ยงคืน (เวลาไทย)</li><li>ขาดวันไหน เริ่มวันที่ 1 ใหม่ แต่แต้มที่สะสมไว้ไม่หาย</li><li>' + fmt(r.cost) + ' แต้ม แลกตรวจสัญญาฟรีได้ 1 ครั้ง · เดือนละไม่เกิน ' + r.perMonth + ' ครั้ง (ใช้แล้ว ' + r.usedThisMonth + ')</li></ul></details>';
    var sub = box.querySelector('.vdg-sub'), foot = box.querySelector('.vdg-foot'), md = mood();
    var ms = box.querySelector('.vdg-mascot');
    if (ms.getAttribute('data-m') !== md) { ms.setAttribute('data-m', md); ms.innerHTML = mascot(md, 260, ICO_GIFT); }
    box.querySelector('.vdg-say').textContent = line(md);
    sub.className = 'vdg-sub' + (S.checkedToday ? ' is-wait' : '');
    sub.innerHTML = S.checkedToday
      ? '<span><i aria-hidden="true">⏱</i>รอบถัดไปใน <b data-cd>' + hms(msToMidnight()) + '</b></span>'
      : '<span><i aria-hidden="true">+</i>วันที่ ' + (done + 1) + ' · รับได้ <b>' + S.todayReward + ' แต้ม</b></span>';
    foot.innerHTML = S.checkedToday
      ? '<div class="vdg-rest" role="status"><span class="vdg-moon" aria-hidden="true" style="--dp:' + (100 - msToMidnight() / 864e3).toFixed(1) + '%"><svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" fill="currentColor"/></svg></span>' +
        '<span class="vdg-rtx"><b>วันนี้รับครบแล้ว พักก่อนนะ</b><small>กลับมาตอนเที่ยงคืน รับ <em>+' + S.tomorrowReward + ' แต้ม</em></small></span>' +
        '<span class="vdg-rcd" data-cd="s">' + hms2(msToMidnight()) + '</span></div>'
      : '<button type="button" class="vdg-claim"><span>รับ +' + S.todayReward + ' แต้ม</span></button>';
    startTick();
  }
  function build() {
    box = document.createElement('div'); box.className = 'vdc'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'vdcT');
    box.innerHTML = DEFS + '<div class="vdc-bg" data-x></div><div class="vdg-frame"><div class="vdc-grip" aria-hidden="true"></div>' +
      '<button type="button" class="vdg-x" data-x aria-label="ปิด">✕</button>' +
      '<div class="vdg-hd"><div class="vdg-hdt"><h3 id="vdcT"><span>ล็อกอิน</span><span>รายวัน</span><em>ฟรี!</em></h3><p class="vdg-say"></p></div><span class="vdg-mascot" aria-hidden="true"></span></div>' +
      '<div class="vdg-stage"><p class="vdg-sub"></p><div class="vdg-body"><p class="vdc-wait">กำลังโหลด…</p></div><div class="vdg-foot"></div></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target.closest('.vdg-retry')) { box.querySelector('.vdg-body').innerHTML = '<p class="vdc-wait">กำลังโหลด…</p>'; load(); return; }
      if (e.target.closest('[data-x]')) { close(); return; }
      if (e.target.closest('.vdg-c.is-open, .vdg-claim:not([disabled])')) { checkin(); return; }
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
    setTimeout(function () { var x = box.querySelector('.vdg-claim:not([disabled])') || box.querySelector('.vdg-x'); if (x) x.focus({ preventScroll: true }); }, 40);
  }
  function close() {
    if (!box) return; box.hidden = true; document.documentElement.classList.remove('vdc-open'); stopTick();
    if (justClaimed) { justClaimed = null; menu(); }   // เปิดครั้งหน้าเป็นท่าหลับรอพรุ่งนี้
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- ฉลองตอนรับรางวัล: เหรียญบินจากการ์ดเข้ากระเป๋า แล้วตัวเลขนับขึ้น ---------- */
  var calm = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  function celebrate(card, from, to, gained, bonus) {
    var num = box && box.querySelector('[data-pts]'), dst = box && box.querySelector('.vdg-coin');
    if (!num) return;
    if (calm() || !card || !dst || !card.animate) { num.textContent = fmt(to); return; }
    num.textContent = fmt(from);
    var a = card.getBoundingClientRect(), b = dst.getBoundingClientRect();
    var n = bonus ? 12 : Math.min(9, 3 + Math.round(gained / 10));
    for (var k = 0; k < n; k++) (function (k) {
      var c = document.createElement('span'); c.className = 'vdg-fly';
      c.innerHTML = '<svg viewBox="0 0 64 64">' + COIN(32, 30, 22) + '</svg>';
      var x0 = a.left + a.width / 2 - 12 + (Math.random() - .5) * a.width * .5, y0 = a.top + a.height * .45 + (Math.random() - .5) * 20;
      var x1 = b.left + b.width / 2 - 12, y1 = b.top + b.height / 2 - 12, mx = (x0 + x1) / 2 + (Math.random() - .5) * 120, my = Math.min(y0, y1) - 60 - Math.random() * 80;
      document.body.appendChild(c);
      var an = c.animate([
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.4)', opacity: 0 },
        { transform: 'translate(' + x0 + 'px,' + (y0 - 18) + 'px) scale(1.1)', opacity: 1, offset: .15 },
        { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1)', opacity: 1, offset: .55 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.7)', opacity: .9 }
      ], { duration: 780 + Math.random() * 160, delay: k * 55, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' });
      an.onfinish = function () {
        c.remove();
        if (dst.animate) dst.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 220 });
      };
    })(k);
    // ตัวเลขนับขึ้นระหว่างเหรียญกำลังเข้า
    var t0 = performance.now() + 520, dur = 700;
    (function step(t) {
      var p = Math.max(0, Math.min(1, (t - t0) / dur));
      num.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
    if (bonus) setTimeout(burst, 300);
  }
  // ประกายเมื่อครบ 7 วัน
  function burst() {
    var big = box && box.querySelector('.vdg-c.is-big'); if (!big || calm()) return;
    var r = big.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var k = 0; k < 26; k++) {
      var d = document.createElement('i'); d.className = 'vdg-spark'; document.body.appendChild(d);
      var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
      d.style.background = ['#ffe28a', '#f4c542', '#fff', '#5fd3a6', '#ff9a4d'][k % 5];
      d.animate([{ transform: 'translate(' + cx + 'px,' + cy + 'px) scale(1)', opacity: 1 }, { transform: 'translate(' + (cx + Math.cos(ang) * dist) + 'px,' + (cy + Math.sin(ang) * dist + 40) + 'px) scale(.3)', opacity: 0 }],
        { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' }).onfinish = (function (d) { return function () { d.remove(); }; })(d);
    }
  }

  /* ---------- การทำงาน ---------- */
  function apply(d) { S = d; render(); strip(); menu(); }
  function load() {
    if (!user()) { S = null; strip(); menu(); return Promise.resolve(); }
    /* v11: ไม่ค้าง "กำลังโหลด…" — เกิน 9 วินาที (เซิร์ฟเวอร์ตื่นช้า) หรือผิดพลาด → ขึ้นปุ่มลองใหม่ */
    var done = false, fail = function (m) { if (done) return; done = true; if (box && !box.hidden && !S) box.querySelector('.vdg-body').innerHTML = '<p class="vdc-wait">' + h(m || 'โหลดไม่สำเร็จ') + '</p><p class="vdc-wait"><button type="button" class="vdg-retry">ลองใหม่</button></p>'; };
    setTimeout(function () { fail('เซิร์ฟเวอร์กำลังตื่น ใช้เวลานานกว่าปกติ'); }, 9000);
    return call('/api/daily').then(function (r) { if (r.ok) { done = true; try { apply(r.data); } catch (e) { fail('แสดงผลไม่สำเร็จ'); } } else fail(r.data && r.data.error); }, function () { fail('เชื่อมต่อไม่ได้'); });
  }
  function checkin() {
    if (busy || (S && S.checkedToday)) return; busy = true;
    var btns = document.querySelectorAll('.vdg-claim, .vdg-c.is-open, .vds-go');
    [].forEach.call(btns, function (b) { b.disabled = true; });
    var before = S ? S.points : 0, k = S ? S.week.filter(function (x) { return x.done; }).length : 0;
    call('/api/daily/checkin', 'POST').then(function (r) {
      busy = false;
      if (!r.ok) { say(r.data.error || 'เช็กอินไม่สำเร็จ'); [].forEach.call(btns, function (b) { b.disabled = false; }); return; }
      if (r.data.gained) justClaimed = r.data.bonus ? 'party' : 'happy';
      apply(r.data);
      var open = box && !box.hidden, card = open && box.querySelector('.vdg-c[data-i="' + k + '"]');
      if (card) card.classList.add('just-claimed');
      if (r.data.gained) {
        if (open) celebrate(card, before, r.data.points, r.data.gained, r.data.bonus);
        else pop(r.data.gained);
        say(r.data.bonus ? 'ครบ 7 วัน! เปิดกล่องสมบัติ +' + r.data.gained + ' แต้ม' : 'เช็กอินแล้ว +' + r.data.gained + ' แต้ม');
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
    var t = document.getElementById('vdcStrip');
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
        s.innerHTML = '<span class="vdc-ic vdc-mini">' + mascot(justClaimed || 'happy', 40, ICO_FIRE) + '</span><span class="vds-txt"><b>เช็กอินแล้ว · ' + S.streak + ' วันติด</b><small>แต้มสะสม ' + fmt(S.points) + ' · พรุ่งนี้ +' + S.tomorrowReward + '</small></span>';
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
    s.innerHTML = '<span class="vdc-ic vdc-mini">' + mascot(mood(), 40, ICO_GIFT) + '</span>' +
      '<button type="button" class="vds-txt"><b>เช็กอินวันนี้ +' + S.todayReward + ' แต้ม</b><small>วันที่ ' + k + '/7 · สะสม ' + fmt(S.points) + ' แต้ม</small></button>' +
      '<button type="button" class="vds-go">เช็กอิน</button><button type="button" class="vds-x" aria-label="ซ่อนวันนี้">✕</button>';
  }

  /* ---------- ปุ่มในเมนูบัญชี ---------- */
  /* ---------- การ์ดในหน้าบัญชี: เห็นตลอด ทั้งก่อนและหลังรับรางวัลวันนี้ ----------
     วางต่อจากการ์ดเครดิต (.vc-wcard) / แถวประวัติ (.vc-stat) · การ์ดแจ้งเตือน (remind-ui.js) จะวางต่อจากการ์ดนี้ */
  function acctAnchor(li) { return li.querySelector('.vc-stat') || li.querySelector('.vc-wcard') || li.querySelector('.wallet-total'); }
  function placeAfter(el, anchor) { if (anchor && anchor.parentNode && el.previousElementSibling !== anchor) anchor.parentNode.insertBefore(el, anchor.nextSibling); }
  function menu() {
    var li = document.getElementById('authLoggedIn'); if (!li) return;
    var old = document.getElementById('vdcMenu'); if (old) old.remove();
    var c = document.getElementById('vdcAcct');
    if (!c) {
      c = document.createElement('button'); c.type = 'button'; c.id = 'vdcAcct'; c.className = 'vdc-acct';
      c.addEventListener('click', open);
      // หน้าบัญชีสร้างการ์ดเครดิต/แถวประวัติทีหลัง → คอยจัดตำแหน่งให้ถูกเสมอ
      new MutationObserver(function () { var x = document.getElementById('vdcAcct'); if (x) placeAfter(x, acctAnchor(li)); }).observe(li, { childList: true, subtree: true });
    }
    placeAfter(c, acctAnchor(li));
    c.hidden = !user();
    if (!S) { c.className = 'vdc-acct'; c.innerHTML = '<span class="vda-ic vdc-mini">' + mascot('wave', 44, ICO_GIFT) + '</span><span class="vda-tx"><b>เช็กอินรายวัน</b><small>สะสมแต้มแลกตรวจสัญญาฟรี</small></span><i class="vda-chev" aria-hidden="true"></i>'; return; }
    var done = S.week.filter(function (x) { return x.done; }).length;
    var dots = S.week.map(function (w) { return '<i class="' + (w.done ? 'is-done' : w.today ? 'is-today' : '') + '"></i>'; }).join('');
    c.className = 'vdc-acct' + (S.checkedToday ? ' is-claimed' : ' is-ready');
    c.setAttribute('aria-label', 'เช็กอินรายวัน ' + (S.checkedToday ? 'รับของวันนี้แล้ว' : 'วันนี้รับได้ ' + S.todayReward + ' แต้ม') + ' แต้มสะสม ' + S.points);
    c.innerHTML = '<span class="vda-ic vdc-mini">' + mascot(mood(), 44, ICO_GIFT) + '</span>' +
      '<span class="vda-tx"><b>เช็กอินรายวัน</b>' +
      '<small><span class="vda-fire">' + ICO_FIRE + S.streak + ' วันติด</span> · ' + fmt(S.points) + ' แต้ม</small>' +
      '<span class="vda-dots" aria-hidden="true">' + dots + '<em>' + done + '/7</em></span></span>' +
      (S.checkedToday
        ? '<span class="vda-pill is-ok">✓ รับแล้ว<small>พรุ่งนี้ +' + S.tomorrowReward + '</small></span>'
        : '<span class="vda-pill">รับ +' + S.todayReward + '</span>') +
      '<i class="vda-chev" aria-hidden="true"></i>';
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
