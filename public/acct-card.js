/* ===== แฟ้มเอกสารสมาชิก (หน้าบัญชี) v7 =====
   แฟ้มกระดาษคราฟต์ มีแท็บด้านบน 3 แท็บ: ภาพรวม · ประวัติ · ตั้งค่า (แตะ/ปัดเพื่อสลับ)
   - ภาพรวม: รูป+ชื่อ · เครดิตคงเหลือ + เติม/แลกแต้ม · เช็กอิน 7 วัน (แตะช่องวันนี้) · สถิติย่อ
   - ประวัติ: 6 ฉบับล่าสุด (ชื่อ · ประเด็นสำคัญ · ตรายาง เสี่ยง/ระวัง/ผ่าน) แตะ = เปิดรายงาน
   - ตั้งค่า: เมนูเดิมทั้งหมด (กดปุ่มเดิมที่ซ่อนไว้ให้)
   ข้อมูลจาก /api/me · /api/history/inspections · /api/daily (+ POST /api/daily/checkin) */
(function () {
  'use strict';
  var pane = document.querySelector('.pane[data-pane="acct"]');
  if (!pane) return;
  var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(u) { return fetch(u, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  var I = function (d) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };

  var box = document.createElement('section'); box.className = 'vac vf'; box.id = 'vacCard'; box.setAttribute('aria-label', 'แฟ้มบัญชีของคุณ'); box.hidden = true;
  pane.insertBefore(box, pane.firstChild);
  document.documentElement.classList.add('vac-on');

  function ago(iso) {
    var t = Date.parse(iso); if (!t) return '–';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'เมื่อสักครู่'; if (m < 60) return m + ' นาทีก่อน';
    var h = Math.round(m / 60); if (h < 24) return h + ' ชม.ก่อน';
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
    var w = document.getElementById('walletHist'); if (w) w.click();
  }
  function topup() { var b = document.querySelector('.wallet-topup'); if (b) b.click(); else if (window.VCShowCredits) window.VCShowCredits(); }
  function nm(m) {
    var n = '';
    try { n = localStorage.getItem('vc_gname_' + String(m || '').toLowerCase()) || ''; } catch (e) {}
    n = n.split(/\s+/)[0] || '';
    if (!n) { n = String(m || '').split('@')[0].replace(/[._-]+/g, ' ').trim().split(/\s+/)[0] || ''; n = n.replace(/\d+$/, '') || n; n = n.charAt(0).toUpperCase() + n.slice(1); }
    return n.length > 16 ? n.slice(0, 15) + '…' : n;
  }
  function fileNo(m) { var h = 7; String(m || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 99991; }); return 'VC-' + ('0000' + (h % 10000)).slice(-4); }
  function typeName(v) {
    var o = v && document.querySelector('#contractType option[value="' + String(v).replace(/["\\]/g, '') + '"]');
    if (!o || v === 'unsure') return '';
    return o.textContent.replace(/\s*\(.*$/, '').trim();
  }

  /* ---------- รูปโปรไฟล์ (ใช้ปุ่ม/ไฟล์อินพุตเดิม) ---------- */
  var lastMe = null;
  function photoHtml(me) {
    var ph = document.getElementById('acctPhoto'), src = '';
    if (ph && !ph.hidden && ph.getAttribute('src')) src = ph.currentSrc || ph.src;
    else if (me && typeof me.avatar === 'string' && /^(https:|data:image)/.test(me.avatar)) src = me.avatar;
    return src ? '<img alt="" src="' + esc(src) + '">' : '<b>' + esc((nm(me && me.email).charAt(0) || '?').toUpperCase()) + '</b>';
  }
  var ph0 = document.getElementById('acctPhoto');
  if (ph0 && 'MutationObserver' in window) new MutationObserver(function () {
    var f = box.querySelector('.vf-av'); if (f && lastMe) f.innerHTML = photoHtml(lastMe) + '<i class="vf-cam" aria-hidden="true">' + I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>') + '</i>';
  }).observe(ph0, { attributes: true, attributeFilter: ['src', 'hidden'] });
  function photoMenu(btn) {
    var old = box.querySelector('.vf-phmenu'); if (old) { old.remove(); return; }
    var del = document.getElementById('acctPhotoDel'), file = document.getElementById('acctFile');
    if (!del || del.hidden) { if (file) file.click(); return; }
    var m = document.createElement('div'); m.className = 'vf-phmenu'; m.setAttribute('role', 'menu');
    m.innerHTML = '<button type="button" role="menuitem" data-a="ph-ch">เปลี่ยนรูป</button><button type="button" role="menuitem" data-a="ph-rm" class="is-rm">ลบรูป</button>';
    btn.parentNode.appendChild(m);
  }

  /* ---------- เช็กอิน 7 วัน ---------- */
  var D = null, ckBusy = false;
  function weekHtml() {
    if (!D || !D.week || !D.week.length) return '';
    return D.week.map(function (w, i) {
      var cls = w.done ? 'is-done' : w.today ? 'is-today' : '';
      var tag = w.today ? 'button type="button" data-a="checkin"' : 'span';
      return '<' + tag + ' class="vf-day ' + cls + (i === 6 ? ' is-last' : '') + '" aria-label="วันที่ ' + w.day + (w.done ? ' เช็กอินแล้ว' : ' ได้ ' + w.reward + ' แต้ม') + '">' +
        '<i>' + (w.done ? I('<path d="m6 12.5 4 4 8-9"/>') : '+' + w.reward) + '</i><small>' + (i === 6 ? 'วัน 7 ★' : 'วัน ' + w.day) + '</small></' + tag.split(' ')[0] + '>';
    }).join('');
  }
  function ckLine() {
    if (!D) return '';
    if (D.checkedToday) return 'เช็กอินแล้ววันนี้' + (D.tomorrowReward ? ' · พรุ่งนี้ +' + D.tomorrowReward : '');
    return 'แตะช่องวันนี้เพื่อรับ +' + (D.todayReward || 0) + ' แต้ม';
  }
  function paintCheck() {
    var r = box.querySelector('.vf-week'); if (r) r.innerHTML = weekHtml();
    var l = box.querySelector('.vf-ckline'); if (l) { l.textContent = ckLine(); l.classList.toggle('is-ready', !!(D && !D.checkedToday)); }
    var s = box.querySelector('.vf-streak'); if (s) s.innerHTML = D && D.streak ? 'ต่อเนื่อง <b>' + D.streak + '</b> วัน' : '';
    var p = box.querySelector('.vf-pts'); if (p && D) p.textContent = D.points >= 300 ? 'แลกตรวจฟรีได้แล้ว' : 'แต้ม ' + D.points + '/300';
  }
  function checkin(btn) {
    if (ckBusy || !D || D.checkedToday) return; ckBusy = true;
    if (!calm() && btn.animate) btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.3,.7,.3,1)' });
    fetch('/api/daily/checkin', { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (r) {
        ckBusy = false;
        var l = box.querySelector('.vf-ckline');
        if (!r.ok || !r.j || !r.j.week) { if (l) l.textContent = (r.j && r.j.error) || 'เช็กอินไม่สำเร็จ ลองใหม่'; return; }
        D = r.j; paintCheck(); lastKey = '';
        if (r.j.gained) {
          var host = box.querySelector('.vf-ckwrap');
          var p = document.createElement('span'); p.className = 'vf-plus'; p.textContent = '+' + r.j.gained + ' แต้ม'; host.appendChild(p);
          if (!calm() && p.animate) p.animate([{ transform: 'translate(-50%,6px)', opacity: 0 }, { transform: 'translate(-50%,-6px)', opacity: 1, offset: .25 }, { transform: 'translate(-50%,-26px)', opacity: 0 }], { duration: 1400, easing: 'ease-out' }).onfinish = function () { p.remove(); };
          else setTimeout(function () { p.remove(); }, 1400);
          var dn = box.querySelectorAll('.vf-day.is-done'), last = dn[dn.length - 1];
          if (last && !calm() && last.animate) last.animate([{ transform: 'scale(1.5) rotate(-14deg)', opacity: 0 }, { transform: 'scale(.92) rotate(-6deg)', opacity: 1, offset: .6 }, { transform: 'scale(1) rotate(-6deg)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.3,1)' });
        }
        if (window.VCDaily && VCDaily.refresh) try { VCDaily.refresh(); } catch (e) {}
      }, function () { ckBusy = false; var l = box.querySelector('.vf-ckline'); if (l) l.textContent = 'เชื่อมต่อไม่ได้ ลองใหม่'; });
  }

  /* ---------- แท็บ ---------- */
  var TABS = ['ov', 'hist', 'set'], cur = 'ov';
  function show(t, anim) {
    if (TABS.indexOf(t) < 0) return;
    var from = TABS.indexOf(cur), to = TABS.indexOf(t); cur = t;
    try { sessionStorage.setItem('vf_tab', t); } catch (e) {}
    [].forEach.call(box.querySelectorAll('.vf-tab'), function (b) { var on = b.getAttribute('data-t') === t; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    var nw = null;
    [].forEach.call(box.querySelectorAll('.vf-panel'), function (p) { var on = p.getAttribute('data-p') === t; p.hidden = !on; if (on) nw = p; });
    var mn = box.querySelector('.vf-phmenu'); if (mn) mn.remove();
    if (anim && nw && !calm() && nw.animate && from !== to) {
      var dx = to > from ? 26 : -26;
      nw.animate([{ transform: 'translateX(' + dx + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  }

  /* ---------- ภาพรวม ---------- */
  function overview(me, items, risk, last) {
    var cr = me.credits | 0, vc = me.voice_credits | 0, low = cr <= 2, nIns = items.length;
    return '<div class="vf-panel" data-p="ov" role="tabpanel" aria-label="ภาพรวม">' +
      '<div class="vf-who">' +
        '<div class="vf-avwrap"><button type="button" class="vf-av" data-a="photo" aria-label="เปลี่ยนรูปโปรไฟล์">' + photoHtml(me) + '<i class="vf-cam" aria-hidden="true">' + I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>') + '</i></button></div>' +
        '<div class="vf-id"><p class="vf-name">' + esc(nm(me.email)) + (me.is_admin ? ' <i class="vf-badge">แอดมิน</i>' : '') + '</p><p class="vf-mail">' + esc(me.email) + '</p></div>' +
      '</div>' +
      '<div class="vf-bal' + (low ? ' is-low' : '') + '">' +
        '<div class="vf-bnum"><span class="vf-lab">เครดิตตรวจคงเหลือ</span><p><b data-c="' + cr + '">' + cr + '</b><small>ครั้ง</small></p>' +
          '<span class="vf-sub">' + (cr === 0 ? 'เครดิตหมดแล้ว' : low ? 'ใกล้หมดแล้ว' : 'พร้อมตรวจได้อีก ' + cr + ' ฉบับ') + ' · เสียง ' + vc + ' ครั้ง</span></div>' +
        '<div class="vf-bact"><button type="button" class="vf-btn" data-a="topup">' + I('<path d="M12 5v14M5 12h14"/>') + 'เติมเครดิต</button>' +
          '<button type="button" class="vf-link" data-a="redeem"><span class="vf-pts">แลกแต้มเช็กอิน</span> →</button></div>' +
      '</div>' +
      (D && D.week ? '<div class="vf-ck"><div class="vf-ckh"><span class="vf-lab">เช็กอินรายวัน</span><span class="vf-streak"></span></div>' +
        '<div class="vf-ckwrap"><div class="vf-week"></div></div><p class="vf-ckline"></p></div>' : '') +
      '<div class="vf-stats">' +
        '<button type="button" class="vf-st" data-a="tab" data-t="hist"><b data-c="' + nIns + '">' + nIns + '</b>' + (nIns >= 50 ? '<em>+</em>' : '') + '<span>ฉบับที่ตรวจ</span></button>' +
        '<button type="button" class="vf-st is-r" data-a="tab" data-t="hist"><b data-c="' + risk + '">' + risk + '</b><span>จุดน่าสงสัย</span></button>' +
        '<button type="button" class="vf-st" data-a="tab" data-t="hist"><b class="is-t">' + (last ? esc(ago(last)) : '–') + '</b><span>ใช้ล่าสุด</span></button>' +
      '</div>' +
    '</div>';
  }
  /* ---------- ประวัติ ---------- */
  function history(items) {
    var rows = items.slice(0, 6).map(function (it) {
      var sm = it.summary || {}, hi = +sm.check_detail || +it.n_detail || 0, mid = +sm.caution || +it.n_caution || 0;
      var st = hi ? ['is-hi', 'เสี่ยง'] : mid ? ['is-mid', 'ระวัง'] : ['is-ok', 'ผ่าน'];
      var title = (it.title || typeName(it.contractType) || 'สัญญาทั่วไป').replace(/\s*\(.*$/, '');
      return '<button type="button" class="vf-row" data-a="open" data-id="' + esc(it.id) + '">' +
        '<span class="vf-rdoc" aria-hidden="true">' + I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>') + '</span>' +
        '<span class="vf-rtx"><b>' + esc(title) + '</b><small>' + esc(dshort(it.createdAt || it.created_at)) + (it.topIssue && it.topIssue.title ? ' · ' + esc(it.topIssue.title) : ' · ' + (hi + mid) + ' จุด') + '</small></span>' +
        '<i class="vf-stamp ' + st[0] + '">' + st[1] + '</i>' +
      '</button>';
    }).join('');
    return '<div class="vf-panel" data-p="hist" role="tabpanel" aria-label="ประวัติ" hidden>' +
      (items.length ? rows + '<button type="button" class="vf-all" data-a="hist">ดูประวัติทั้งหมด ' + items.length + (items.length >= 50 ? '+' : '') + ' ฉบับ →</button>'
        : '<p class="vf-empty">ยังไม่มีสัญญาในแฟ้ม<br><small>ตรวจฉบับแรกแล้วจะถูกเก็บไว้ที่นี่</small></p>') +
    '</div>';
  }
  /* ---------- ตั้งค่า (กดปุ่มเดิมที่ซ่อนไว้) ---------- */
  function settings(me) {
    var L = [
      ['#vrmAcct', 'แจ้งเตือนวันสำคัญ', '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'],
      ['#dispBtn', 'การแสดงผล', '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'],
      ['#privBtn', 'ความเป็นส่วนตัวของข้อมูล', '<path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'],
      ['#helpPrivacy', 'นโยบายความเป็นส่วนตัว', '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'],
      ['#helpTerms', 'เงื่อนไขการใช้บริการ', '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'],
      ['#helpContact', 'ติดต่อผู้ดูแล', '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8M8 13h5"/>']
    ];
    if (me.is_admin && document.getElementById('adminPanel')) L.unshift(['#adminPanel .adm-head', 'แผงแอดมิน', '<path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6z"/><path d="M12 9v6M9 12h6"/>']);
    L = L.filter(function (x) { return document.querySelector(x[0]); });
    return '<div class="vf-panel" data-p="set" role="tabpanel" aria-label="ตั้งค่า" hidden>' +
      L.map(function (x) { return '<button type="button" class="vf-set" data-a="go" data-sel="' + x[0] + '"><span class="vf-sic">' + I(x[2]) + '</span><span>' + x[1] + '</span><i aria-hidden="true">›</i></button>'; }).join('') +
      (document.getElementById('logoutBtn') ? '<button type="button" class="vf-set is-out" data-a="go" data-sel="#logoutBtn"><span class="vf-sic">' + I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>') + '</span><span>ออกจากระบบ</span><i aria-hidden="true">›</i></button>' : '') +
    '</div>';
  }

  var busy = false, lastKey = '', shownOnce = false;
  function render(me, hist, daily) {
    var items = (hist && hist.items) || [], risk = 0;
    items.forEach(function (it) { var sm = it.summary || {}; risk += (+sm.check_detail || +it.n_detail || 0) + (+sm.caution || +it.n_caution || 0); });
    var last = items[0] && (items[0].createdAt || items[0].created_at);
    D = daily && typeof daily.points === 'number' ? daily : null; lastMe = me;
    try { var t0 = sessionStorage.getItem('vf_tab'); if (TABS.indexOf(t0) >= 0) cur = t0; } catch (e) {}
    var tab = function (t, label) { return '<button type="button" class="vf-tab" role="tab" data-a="tab" data-t="' + t + '"><span>' + label + '</span></button>'; };
    box.innerHTML =
      '<div class="vf-folder">' +
        '<div class="vf-tabs" role="tablist" aria-label="แฟ้มบัญชี">' + tab('ov', 'ภาพรวม') + tab('hist', 'ประวัติ') + tab('set', 'ตั้งค่า') + '</div>' +
        '<div class="vf-body">' +
          '<span class="vf-label" aria-hidden="true">แฟ้มสมาชิก <b>' + fileNo(me.email) + '</b></span>' +
          '<div class="vf-sheet">' + overview(me, items, risk, last) + history(items) + settings(me) + '</div>' +
        '</div>' +
      '</div>';
    paintCheck(); show(cur, false);
    var wc = document.querySelector('#authLoggedIn .vc-wcard');
    if (wc && wc.parentNode && box.nextSibling !== wc) wc.parentNode.insertBefore(box, wc);
    box.hidden = false;
    if (!shownOnce && !calm() && 'IntersectionObserver' in window) {
      shownOnce = true;
      var io = new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting; })) { io.disconnect(); intro(); } }, { threshold: .3 });
      io.observe(box.querySelector('.vf-folder'));
    }
  }
  function intro() {
    {
      var f = box.querySelector('.vf-folder'), s = box.querySelector('.vf-sheet'); if (!f) return;
      if (f.animate) f.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
      if (s.animate) s.animate([{ transform: 'translateY(22px)' }, { transform: 'none' }], { duration: 620, delay: 120, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      [].forEach.call(box.querySelectorAll('[data-c]'), function (el) { count(el, +el.getAttribute('data-c')); });
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
    var menu = box.querySelector('.vf-phmenu'); if (menu && !(b && /^ph-|^photo$/.test(b.getAttribute('data-a')))) menu.remove();
    if (!b) return;
    var a = b.getAttribute('data-a');
    if (a === 'tab') show(b.getAttribute('data-t'), true);
    else if (a === 'topup') topup();
    else if (a === 'redeem') { if (window.VCDaily && VCDaily.open) VCDaily.open(); }
    else if (a === 'hist') goHist();
    else if (a === 'checkin') checkin(b);
    else if (a === 'photo') photoMenu(b);
    else if (a === 'ph-ch' || a === 'ph-rm') { if (menu) menu.remove(); var t = document.getElementById(a === 'ph-ch' ? 'acctFile' : 'acctPhotoDel'); if (t) t.click(); }
    else if (a === 'open') { var id = b.getAttribute('data-id'); if (window.vcOpenInspection) window.vcOpenInspection(id); else goHist(); }
    else if (a === 'go') {
      var g = document.querySelector(b.getAttribute('data-sel')); if (!g) return;
      g.click();
      if (/adminPanel/.test(b.getAttribute('data-sel'))) try { document.getElementById('adminPanel').scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e2) {}
    }
  });
  /* คีย์บอร์ด: ลูกศรซ้าย/ขวาบนแท็บ */
  box.addEventListener('keydown', function (e) {
    if (!e.target.closest('.vf-tab') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    var i = TABS.indexOf(cur) + (e.key === 'ArrowRight' ? 1 : -1); if (i < 0 || i >= TABS.length) return;
    show(TABS[i], true); var t = box.querySelector('.vf-tab[data-t="' + TABS[i] + '"]'); if (t) t.focus(); e.preventDefault();
  });
  /* ปัดซ้าย/ขวาบนแผ่นเพื่อสลับแท็บ */
  var sx = 0, sy = 0, st = 0;
  box.addEventListener('touchstart', function (e) { if (!e.target.closest('.vf-sheet')) { st = 0; return; } var t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (!st || Date.now() - st > 700) return; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; st = 0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) { var i = TABS.indexOf(cur) + (dx < 0 ? 1 : -1); if (i >= 0 && i < TABS.length) show(TABS[i], true); }
  }, { passive: true });
  /* อัปเดตเมื่อเปิดหน้าบัญชี / ล็อกอิน-ออก */
  var lo = document.getElementById('authLoggedIn');
  if (lo && 'MutationObserver' in window) new MutationObserver(function () { if (lo.hidden) { box.hidden = true; lastKey = ''; shownOnce = false; } else refresh(); }).observe(lo, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(function () { if (document.body.classList.contains('auth-open')) refresh(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-nav="acct"],#authToggle,[data-tab="acct"]')) setTimeout(refresh, 60); }, true);
  if (lo && !lo.hidden) refresh(); else setTimeout(refresh, 1500);
})();
