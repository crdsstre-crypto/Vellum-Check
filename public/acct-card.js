/* ===== สมุดบัญชีหนังในหน้าบัญชี (v5) =====
   ปกหนังพลิกเปิด → หน้ากระดาษ:
   (1) รูปโปรไฟล์ติดบนหน้ากระดาษ (มุมกระดาษยึดรูป + คลิปทองเหลือง) แทนแถบอีเมลด้านบน · แตะรูป = เปลี่ยน/ลบรูป
   (2) เครดิตเป็นขีดนับลายมือ (มัดละ 5) ค่อย ๆ เขียนตอนเปิดสมุด
   (3) ตารางบัญชี "รายการล่าสุด" 3 ฉบับ + ตรายาง เสี่ยง/ระวัง/ผ่าน · แตะแถว = เปิดรายงาน
   (5) แตะตราครั่ง = เช็กอินรายวัน (กดตรา ครั่งกระเพื่อม +แต้ม)
   v6: แท็บดัชนีข้างเล่ม (มือถือ) แทนการ์ด/เมนูเดิม · ตารางย้ายไปหน้า 2 พลิกหน้าได้ (ปัด/แตะ) · ตราครั่ง 7 วันแทนการ์ดเช็กอิน
   ข้อมูลจาก /api/me · /api/history/inspections · /api/daily (+ POST /api/daily/checkin) */
(function () {
  'use strict';
  var pane = document.querySelector('.pane[data-pane="acct"]');
  if (!pane) return;
  var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(u) { return fetch(u, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  var box = document.createElement('section'); box.className = 'vac vl'; box.id = 'vacCard'; box.setAttribute('aria-label', 'สมุดบัญชีของคุณ'); box.hidden = true;
  pane.insertBefore(box, pane.firstChild);
  document.documentElement.classList.add('vac-on');

  function ago(iso) {
    var t = Date.parse(iso); if (!t) return '–';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'เมื่อสักครู่'; if (m < 60) return m + ' นาทีก่อน';
    var h = Math.round(m / 60); if (h < 24) return h + ' ชม. ก่อน';
    var d = Math.round(h / 24); if (d < 30) return d + ' วันก่อน';
    return Math.round(d / 30) + ' เดือนก่อน';
  }
  function dshort(iso) { var t = new Date(iso); if (isNaN(t)) return '–'; try { return t.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }); } catch (e) { return t.getDate() + '/' + (t.getMonth() + 1); } }
  function count(el, to) {
    to = Math.max(0, to | 0);
    if (calm() || !to) { el.textContent = to; return; }
    var t0 = performance.now(), D = Math.min(900, 300 + to * 30);
    (function f(n) { var u = Math.min(1, (n - t0) / D), e = 1 - Math.pow(1 - u, 3); el.textContent = Math.round(to * e); if (u < 1) requestAnimationFrame(f); })(t0);
  }
  function goHist() {
    var h = document.querySelector('#bottomNav [data-nav="hist"]');
    if (h && h.offsetParent) { h.click(); return; }
    if (window.vcOpenHistory) { window.vcOpenHistory(); return; }
    var w = document.getElementById('walletHist'); if (w) { if (w.getAttribute('aria-expanded') !== 'true') w.click(); try { w.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} }
  }
  function topup() { var b = document.querySelector('.wallet-topup'); if (b) b.click(); else if (window.VCShowCredits) window.VCShowCredits(); }
  function nm(m) {
    var n = '';
    try { n = localStorage.getItem('vc_gname_' + String(m || '').toLowerCase()) || ''; } catch (e) {}
    n = n.split(/\s+/)[0] || '';
    if (!n) { n = String(m || '').split('@')[0].replace(/[._-]+/g, ' ').trim().split(/\s+/)[0] || ''; n = n.replace(/\d+$/, '') || n; n = n.charAt(0).toUpperCase() + n.slice(1); }
    return n.length > 14 ? n.slice(0, 13) + '…' : n;
  }
  function ledgerNo(m) { var h = 7; String(m || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 99991; }); return 'VC-' + ('0000' + (h % 10000)).slice(-4); }
  function typeName(v) {
    var o = v && document.querySelector('#contractType option[value="' + String(v).replace(/["\\]/g, '') + '"]');
    if (!o || v === 'unsure') return '';
    return o.textContent.replace(/\s*\(.*$/, '').trim();
  }
  function setOpen(on, anim) {
    var bk = box.querySelector('.vl-book'); if (!bk) return;
    if (!anim || calm()) bk.classList.add('no-anim'); else bk.classList.remove('no-anim');
    bk.classList.toggle('is-open', on);
    var cv = bk.querySelector('.vl-cover'); if (cv) { cv.setAttribute('aria-expanded', on ? 'true' : 'false'); cv.tabIndex = on ? -1 : 0; }
    if (!anim || calm()) { void bk.offsetWidth; bk.classList.remove('no-anim'); }
  }

  /* (1) รูปติดบนหน้ากระดาษ — ใช้รูปเดียวกับปุ่มรูปโปรไฟล์เดิม */
  function photoSrc(me) {
    var ph = document.getElementById('acctPhoto');
    if (ph && !ph.hidden && ph.getAttribute('src')) return ph.currentSrc || ph.src;
    return me && typeof me.avatar === 'string' && /^(https:|data:image)/.test(me.avatar) ? me.avatar : '';
  }
  function photoHtml(me, email) {
    var src = photoSrc(me);
    return src ? '<img alt="" src="' + esc(src) + '">' : '<b>' + esc((nm(email).charAt(0) || '?').toUpperCase()) + '</b>';
  }
  var lastMe = null;
  var ph0 = document.getElementById('acctPhoto');
  if (ph0 && 'MutationObserver' in window) new MutationObserver(function () {
    var f = box.querySelector('.vl-photo .vl-ph-in'); if (f && lastMe) f.innerHTML = photoHtml(lastMe, lastMe.email);
  }).observe(ph0, { attributes: true, attributeFilter: ['src', 'hidden'] });
  function photoMenu(btn) {
    var old = box.querySelector('.vl-phmenu'); if (old) { old.remove(); return; }
    var del = document.getElementById('acctPhotoDel'), file = document.getElementById('acctFile');
    if (!del || del.hidden) { if (file) file.click(); return; }
    var m = document.createElement('div'); m.className = 'vl-phmenu'; m.setAttribute('role', 'menu');
    m.innerHTML = '<button type="button" role="menuitem" data-a="ph-ch">เปลี่ยนรูป</button><button type="button" role="menuitem" data-a="ph-rm" class="is-rm">ลบรูป</button>';
    btn.parentNode.appendChild(m);
  }

  /* (2) ขีดนับลายมือ: มัดละ 5 (4 ขีดตั้ง + 1 ขีดเฉียง) */
  function tally(n) {
    var MAXG = 6, full = Math.floor(n / 5), rest = n % 5, out = '', k = 0, extra = 0;
    if (n > MAXG * 5) { full = MAXG; rest = 0; extra = n - MAXG * 5; }
    var r = function (a) { return (Math.sin(a * 12.9898 + n) * 43758.5453 % 1) * 1.6; };
    var stroke = function (d) { var s = '<path pathLength="1" style="--d:' + (k * 70) + 'ms" d="' + d + '"/>'; k++; return s; };
    var group = function (cnt, slash, gi) {
      var s = '<svg class="vl-tg" viewBox="0 0 34 30" aria-hidden="true">';
      for (var i = 0; i < cnt; i++) { var x = 5 + i * 6.4 + r(gi * 9 + i); s += stroke('M' + x.toFixed(1) + ' ' + (4 + r(i + 3)).toFixed(1) + ' Q' + (x + .9).toFixed(1) + ' 15 ' + (x - .3 + r(i)).toFixed(1) + ' ' + (26 - r(i + 7)).toFixed(1)); }
      if (slash) s += stroke('M1.5 ' + (20 + r(gi)).toFixed(1) + ' Q17 14 ' + (32 - r(gi + 2)).toFixed(1) + ' ' + (8 + r(gi + 5)).toFixed(1));
      return s + '</svg>';
    };
    for (var g = 0; g < full; g++) out += group(4, true, g);
    if (rest) out += group(rest, false, full);
    if (extra) out += '<span class="vl-tmore">+' + extra + '</span>';
    return out;
  }

  /* (3) ตารางบัญชีรายการล่าสุด */
  function ledger(items) {
    if (!items.length) return '<div class="vl-ledger"><p class="vl-lh"><span>รายการล่าสุด</span></p><p class="vl-lempty">ยังไม่มีรายการ — ตรวจสัญญาฉบับแรก แล้วจะถูกบันทึกไว้ที่หน้านี้</p></div>';
    var rows = items.slice(0, 6).map(function (it) {
      var sm = it.summary || {}, hi = +sm.check_detail || +it.n_detail || 0, mid = +sm.caution || +it.n_caution || 0;
      var st = hi ? ['is-hi', 'เสี่ยง'] : mid ? ['is-mid', 'ระวัง'] : ['is-ok', 'ผ่าน'];
      var title = (it.title || typeName(it.contractType) || 'สัญญาทั่วไป').replace(/\s*\(.*$/, '');
      var top = it.topIssue && it.topIssue.title ? '<small class="vl-ti">' + esc(it.topIssue.title) + '</small>' : '';
      return '<button type="button" class="vl-tr" data-a="open" data-id="' + esc(it.id) + '">' +
        '<span class="vl-td is-d">' + esc(dshort(it.createdAt || it.created_at)) + '</span>' +
        '<span class="vl-td is-t"><b>' + esc(title) + '</b>' + top + '</span>' +
        '<span class="vl-td is-n">' + (hi + mid) + '</span>' +
        '<span class="vl-td is-s"><i class="vl-rstamp ' + st[0] + '">' + st[1] + '</i></span>' +
      '</button>';
    }).join('');
    return '<div class="vl-ledger">' +
      '<p class="vl-lh"><span>รายการล่าสุด</span>' + (items.length > 6 ? '<button type="button" class="vl-more" data-a="hist">ดูทั้งหมด ' + items.length + (items.length >= 50 ? '+' : '') + ' ฉบับ →</button>' : '') + '</p>' +
      '<div class="vl-thead" aria-hidden="true"><span class="is-d">วันที่</span><span class="is-t">รายการ</span><span class="is-n">จุด</span><span class="is-s"></span></div>' +
      rows + '</div>';
  }

  /* (5) ตราครั่ง = เช็กอินรายวัน */
  var D = null, sealBusy = false;
  function sealNote() {
    if (!D) return '';
    if (D.checkedToday) return 'ประทับแล้ว\n' + (D.tomorrowReward ? 'พรุ่งนี้ +' + D.tomorrowReward : 'วันนี้');
    return 'แตะตรา\nเช็กอิน' + (D.todayReward ? ' +' + D.todayReward : '');
  }
  function week() {
    if (!D || !D.week || !D.week.length) return '';
    return D.week.map(function (w, i) {
      var cls = w.done ? 'is-done' : w.today ? 'is-today' : '';
      var inner = w.done ? '<b>VC</b>' : '<em>+' + w.reward + '</em>';
      return '<' + (w.today ? 'button type="button" data-a="seal"' : 'span') + ' class="vl-wd ' + cls + (i === 6 ? ' is-last' : '') + '" aria-label="วันที่ ' + w.day + (w.done ? ' ประทับแล้ว' : ' ได้ ' + w.reward + ' แต้ม') + '">' + inner + '<small>' + (i === 6 ? '★' : w.day) + '</small></' + (w.today ? 'button' : 'span') + '>';
    }).join('');
  }
  function paintSeal() {
    var wk = box.querySelector('.vl-wrow'); if (wk) wk.innerHTML = week();
    var sk = box.querySelector('.vl-streak'); if (sk) sk.innerHTML = D && D.streak ? 'ต่อเนื่อง <u>' + D.streak + '</u> วัน' : (D ? 'เริ่มนับวันนี้' : '');
    var w = box.querySelector('.vl-wax'), n = box.querySelector('.vl-snote'), l = box.querySelector('.vl-link');
    if (w) { w.classList.toggle('is-ready', !!(D && !D.checkedToday)); w.setAttribute('aria-label', D ? (D.checkedToday ? 'เช็กอินวันนี้แล้ว' : 'แตะตราเพื่อเช็กอินวันนี้') : 'ตรา Vellum Check'); }
    if (n) { n.textContent = sealNote(); n.classList.toggle('is-done', !!(D && D.checkedToday)); }
    if (l && D && typeof D.points === 'number') l.innerHTML = (D.points >= 300 ? 'แลกตรวจฟรีได้แล้ว' : 'แต้มเช็กอิน ' + D.points + '/300') + ' <span aria-hidden="true">→</span>';
  }
  function press(w, gained) {
    if (calm() || !w.animate) return;
    w.animate([{ transform: 'rotate(-10deg) translateY(0) scale(1)' }, { transform: 'rotate(-4deg) translateY(-14px) scale(1.12)', offset: .35 }, { transform: 'rotate(-10deg) translateY(1px) scale(.9,.86)', offset: .62 }, { transform: 'rotate(-10deg) scale(1.04)', offset: .8 }, { transform: 'rotate(-10deg) scale(1)' }], { duration: 640, easing: 'cubic-bezier(.3,.7,.3,1)' });
    if (!gained) return;
    var host = w.parentNode;
    setTimeout(function () {
      var rg = document.createElement('i'); rg.className = 'vl-ripple'; host.appendChild(rg);
      rg.animate([{ transform: 'scale(.6)', opacity: .7 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 700, easing: 'ease-out' }).onfinish = function () { rg.remove(); };
      for (var i = 0; i < 6; i++) {
        var d = document.createElement('i'); d.className = 'vl-drop'; host.appendChild(d);
        var a = (i / 6) * Math.PI * 2 + Math.random() * .6, R = 30 + Math.random() * 16;
        d.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + (Math.cos(a) * R).toFixed(0) + 'px,' + (Math.sin(a) * R).toFixed(0) + 'px) scale(.4)', opacity: 0 }], { duration: 560 + Math.random() * 200, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = (function (x) { return function () { x.remove(); }; })(d);
      }
      var p = document.createElement('span'); p.className = 'vl-plus'; p.textContent = '+' + gained + ' แต้ม'; host.appendChild(p);
      p.animate([{ transform: 'translate(-50%,0) rotate(-6deg)', opacity: 0 }, { transform: 'translate(-50%,-14px) rotate(-6deg)', opacity: 1, offset: .25 }, { transform: 'translate(-50%,-34px) rotate(-6deg)', opacity: 0 }], { duration: 1500, easing: 'ease-out' }).onfinish = function () { p.remove(); };
    }, 400);
  }
  function seal(w) {
    if (sealBusy) return;
    if (!D || D.checkedToday) { press(w, 0); var n = box.querySelector('.vl-snote'); if (n && n.animate && !calm()) n.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    sealBusy = true; press(w, 0);
    fetch('/api/daily/checkin', { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (r) {
        sealBusy = false;
        if (!r.ok || !r.j) { var n = box.querySelector('.vl-snote'); if (n) n.textContent = (r.j && r.j.error) || 'เช็กอินไม่สำเร็จ ลองใหม่'; return; }
        D = r.j; paintSeal();
        if (r.j.gained) press(w, r.j.gained);
        lastKey = '';                                   /* ให้รอบหน้ารีเฟรชข้อมูลใหม่ */
        if (window.VCDaily && VCDaily.refresh) try { VCDaily.refresh(); } catch (e) {}
      }, function () { sealBusy = false; var n = box.querySelector('.vl-snote'); if (n) n.textContent = 'เชื่อมต่อไม่ได้ ลองใหม่'; });
  }

  /* (3) พลิกหน้า: หน้า 1 (ยอด/บันทึก) ↔ หน้า 2 (ตารางรายการล่าสุด) */
  var onP2 = false;
  function turn(to2) {
    var pg = box.querySelector('.vl-page'); if (!pg || onP2 === to2) return;
    onP2 = to2;
    var l1 = pg.querySelector('.vl-leaf.is-p1');
    pg.classList.toggle('on-p2', to2);
    if (!calm() && l1 && l1.animate) {
      var fr = [{ transform: 'perspective(1800px) rotateY(0deg)', filter: 'brightness(1)' }, { transform: 'perspective(1800px) rotateY(-62deg)', filter: 'brightness(.88)', offset: .55 }, { transform: 'perspective(1800px) rotateY(-100deg)', filter: 'brightness(.7)' }];
      l1.style.visibility = 'visible';
      var an = l1.animate(to2 ? fr : fr.slice().reverse(), { duration: 620, easing: to2 ? 'cubic-bezier(.45,.05,.55,.95)' : 'cubic-bezier(.3,.6,.35,1)', fill: 'both' });
      an.onfinish = function () { l1.style.visibility = ''; an.cancel(); };
    }
    try { pg.scrollIntoView({ block: 'start', behavior: calm() ? 'auto' : 'smooth' }); } catch (e) {}
  }
  function tab(t) {
    if (t === 'hist') return goHist();
    var sel = { remind: '#vrmAcct', disp: '#dispBtn', help: '#helpContact', out: '#logoutBtn', admin: '#adminPanel .adm-head' }[t];
    var el = sel && document.querySelector(sel); if (!el) return;
    el.click();
    if (t === 'admin') try { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
  }
  function tabs(me) {
    var T = [['hist', 'ประวัติ'], ['remind', 'แจ้งเตือน'], ['disp', 'ตั้งค่า'], ['help', 'ติดต่อ']];
    if (me.is_admin && document.getElementById('adminPanel')) T.push(['admin', 'แอดมิน']);
    T.push(['out', 'ออก']);
    return '<nav class="vl-tabs" aria-label="ดัชนีบัญชี">' + T.map(function (x, i) { return '<button type="button" class="vl-tab is-' + x[0] + '" style="--i:' + i + '" data-a="tab" data-t="' + x[0] + '"><span>' + x[1] + '</span></button>'; }).join('') + '</nav>';
  }

  var busy = false, lastKey = '';
  function render(me, hist, daily) {
    var email = me.email || '', cr = me.credits | 0, vc = me.voice_credits | 0;
    var items = (hist && hist.items) || [], nIns = items.length, risk = 0;
    items.forEach(function (it) { var sm = it.summary || {}; risk += (+sm.check_detail || +it.n_detail || 0) + (+sm.caution || +it.n_caution || 0); });
    var last = items[0] && (items[0].createdAt || items[0].created_at);
    D = daily && typeof daily.points === 'number' ? daily : null; lastMe = me;
    var lowCr = cr <= 2, name = nm(email), wasOpen = false;
    try { wasOpen = sessionStorage.getItem('vl_open') === '1'; } catch (e) {}
    var line = function (pre, val, post, cls) { return '<button type="button" class="vl-ln' + (cls ? ' ' + cls : '') + '" data-a="hist">' + pre + ' <u>' + val + '</u> ' + post + '</button>'; };
    box.innerHTML =
      '<div class="vl-book' + (wasOpen ? ' is-open' : '') + '">' +
        '<i class="vl-ribbon" aria-hidden="true"></i>' +
        tabs(me) +
        '<div class="vl-page">' +
         '<div class="vl-leaf is-p2">' +
          ledger(items) +
          '<p class="vl-legal"><button type="button" data-a="go" data-sel="#privBtn">ความเป็นส่วนตัวของข้อมูล</button> · <button type="button" data-a="go" data-sel="#helpPrivacy">นโยบาย</button> · <button type="button" data-a="go" data-sel="#helpTerms">เงื่อนไขการใช้บริการ</button></p>' +
          '<div class="vl-foot"><button type="button" class="vl-turn is-back" data-a="turn" data-p="1">← กลับหน้าแรก</button><span class="vl-pno">— ๒ —</span></div>' +
         '</div>' +
         '<div class="vl-leaf is-p1">' +
          '<div class="vl-head">' +
            '<div class="vl-phwrap"><button type="button" class="vl-photo" data-a="photo" aria-label="เปลี่ยนรูปโปรไฟล์"><span class="vl-ph-in">' + photoHtml(me, email) + '</span><i class="vl-corner is-a" aria-hidden="true"></i><i class="vl-corner is-b" aria-hidden="true"></i></button><i class="vl-clip" aria-hidden="true"></i></div>' +
            '<div class="vl-id"><small class="vl-kick">สมุดบัญชีสมาชิก</small>' +
            '<p class="vl-name">' + esc(name) + '</p><p class="vl-no">บัญชีเลขที่ <b>' + ledgerNo(email) + '</b>' + (me.is_admin ? '<i class="vl-rstamp vl-admin">แอดมิน</i>' : '') + '</p></div>' +
            '<div class="vl-sealwrap"><button type="button" class="vl-wax" data-a="seal"><b>VC</b></button><span class="vl-snote" aria-live="polite"></span></div>' +
          '</div>' +
          '<div class="vl-bal">' +
            '<div class="vl-n"><span>เครดิตตรวจคงเหลือ</span><p><b data-c="' + cr + '">0</b><small>ครั้ง</small></p></div>' +
            '<div class="vl-n is-v"><span>เครดิตเสียง</span><p><b data-c="' + vc + '">0</b><small>ครั้ง</small></p></div>' +
          '</div>' +
          '<div class="vl-tally' + (lowCr ? ' is-low' : '') + '" role="img" aria-label="เหลือเครดิตตรวจ ' + cr + ' ครั้ง">' + (cr ? tally(cr) : '<span class="vl-tnone">หมดแล้ว</span>') + '</div>' +
          '<p class="vl-hint' + (lowCr ? ' is-low' : '') + '">' + (cr === 0 ? 'เครดิตหมดแล้ว — เติมหรือแลกแต้มเพื่อตรวจต่อ' : lowCr ? 'ใกล้หมดแล้ว เหลืออีก ' + cr + ' ครั้ง' : 'พร้อมตรวจได้อีก ' + cr + ' ฉบับ') + '</p>' +
          '<div class="vl-acts">' +
            '<button type="button" class="vl-stamp" data-a="topup">เติมเครดิต</button>' +
            '<button type="button" class="vl-link" data-a="redeem">แลกแต้มเช็กอิน <span aria-hidden="true">→</span></button>' +
          '</div>' +
          (D && D.week ? '<div class="vl-week"><p class="vl-nh"><span>ตราเช็กอิน 7 วัน</span><span class="vl-streak"></span></p><div class="vl-wrow"></div></div>' : '') +
          '<div class="vl-notes">' +
            '<p class="vl-nh"><span>บันทึกของฉัน</span><button type="button" class="vl-close" data-a="close" aria-label="ปิดสมุด">ปิดเล่ม</button></p>' +
            (nIns ? line('ตรวจไปแล้ว', nIns + (nIns >= 50 ? '+' : ''), 'ฉบับ') + line('เจอจุดน่าสงสัย', risk, 'จุด', 'is-r') + (last ? line('ล่าสุดเมื่อ', esc(ago(last)), '') : '')
                  : '<button type="button" class="vl-ln is-empty" data-a="hist">ยังไม่มีบันทึก — ตรวจสัญญาฉบับแรกได้เลย</button>') +
          '</div>' +
          '<div class="vl-foot"><button type="button" class="vl-turn" data-a="turn" data-p="2">รายการล่าสุด ↷</button><span class="vl-pno">— ๑ —</span></div>' +
         '</div>' +
        '</div>' +
        '<button type="button" class="vl-cover" data-a="cover" aria-label="เปิดสมุดบัญชี" aria-expanded="' + (wasOpen ? 'true' : 'false') + '"' + (wasOpen ? ' tabindex="-1"' : '') + '>' +
          '<span class="vl-cv-in">' +
            '<small>VELLUM CHECK</small>' +
            '<i class="vl-orn" aria-hidden="true"></i>' +
            '<b>' + esc(name) + '</b>' +
            '<em>สมุดบัญชีสมาชิก</em>' +
            '<span class="vl-tap">แตะเพื่อเปิด</span>' +
          '</span>' +
        '</button>' +
      '</div>';
    paintSeal(); onP2 = false;
    var wc = document.querySelector('#authLoggedIn .vc-wcard');
    if (wc && wc.parentNode && box.nextSibling !== wc) wc.parentNode.insertBefore(box, wc);
    box.hidden = false;
    var nums = function () { [].forEach.call(box.querySelectorAll('[data-c]'), function (el) { count(el, +el.getAttribute('data-c')); }); };
    if (wasOpen) nums();
    else {
      [].forEach.call(box.querySelectorAll('[data-c]'), function (el) { el.textContent = el.getAttribute('data-c'); });
      var go = function () {
        setTimeout(function () {
          if (box.hidden) return;
          setOpen(true, true);
          try { sessionStorage.setItem('vl_open', '1'); } catch (e) {}
          setTimeout(function () { [].forEach.call(box.querySelectorAll('[data-c]'), function (el) { el.textContent = '0'; }); nums(); }, calm() ? 0 : 380);
        }, calm() ? 0 : 650);
      };
      /* พลิกเปิดเมื่อสมุดอยู่บนจอจริง ๆ (ไม่เปิดทิ้งไว้ตอนหน้าบัญชียังซ่อนอยู่) */
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); go(); } }, { threshold: .5 });
        io.observe(box.querySelector('.vl-book'));
      } else go();
    }
  }
  function refresh() {
    if (busy) return; busy = true;
    get('/api/me').then(function (me) {
      if (!me || !me.email) { box.hidden = true; busy = false; return; }
      return Promise.all([get('/api/history/inspections'), get('/api/daily')]).then(function (r) {
        var it = r[0] && r[0].items || [];
        var key = JSON.stringify([me.email, me.credits, me.voice_credits, it.length, it[0] && it[0].id, r[1] && r[1].points, r[1] && r[1].checkedToday]);
        if (key !== lastKey || box.hidden) { lastKey = key; render(me, r[0], r[1]); }
        busy = false;
      });
    }).catch(function () { busy = false; });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    var menu = box.querySelector('.vl-phmenu'); if (menu && !(b && /^ph-|^photo$/.test(b.getAttribute('data-a')))) menu.remove();
    if (!b) return;
    var a = b.getAttribute('data-a');
    if (a === 'topup') topup();
    else if (a === 'redeem') { if (window.VCDaily && VCDaily.open) VCDaily.open(); }
    else if (a === 'hist') goHist();
    else if (a === 'cover') setOpen(true, true);
    else if (a === 'close') setOpen(false, true);
    else if (a === 'photo') photoMenu(b);
    else if (a === 'ph-ch' || a === 'ph-rm') { if (menu) menu.remove(); var t = document.getElementById(a === 'ph-ch' ? 'acctFile' : 'acctPhotoDel'); if (t) t.click(); }
    else if (a === 'seal') seal(box.querySelector('.vl-wax') || b);
    else if (a === 'turn') turn(b.getAttribute('data-p') === '2');
    else if (a === 'tab') tab(b.getAttribute('data-t'));
    else if (a === 'go') { var g = document.querySelector(b.getAttribute('data-sel')); if (g) g.click(); }
    else if (a === 'open') { var id = b.getAttribute('data-id'); if (window.vcOpenInspection) window.vcOpenInspection(id); else goHist(); }
  });
  /* ปัดซ้าย/ขวาเพื่อพลิกหน้า */
  var sx = 0, sy = 0, st = 0;
  box.addEventListener('touchstart', function (e) { if (!e.target.closest('.vl-page')) { st = 0; return; } var t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (!st || Date.now() - st > 700) return; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; st = 0;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) turn(dx < 0);
  }, { passive: true });
  /* อัปเดตเมื่อเปิดหน้าบัญชี / ล็อกอิน-ออก */
  var lo = document.getElementById('authLoggedIn');
  if (lo && 'MutationObserver' in window) new MutationObserver(function () { if (lo.hidden) { box.hidden = true; lastKey = ''; } else refresh(); }).observe(lo, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(function () { if (document.body.classList.contains('auth-open')) refresh(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-nav="acct"],#authToggle,[data-tab="acct"]')) setTimeout(refresh, 60); }, true);
  if (lo && !lo.hidden) refresh(); else setTimeout(refresh, 1500);
})();
