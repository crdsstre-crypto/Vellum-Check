/* ===== บัตรสมาชิกในหน้าบัญชี (แทนตาราง "ข้อมูลบัญชี") =====
   (1) บัตรสีเข้มขอบทอง: รูป อีเมล ตรา VC · เครดิตตรวจ/เสียงตัวใหญ่ นับขึ้นตอนเปิด
   (2) สถิติของฉัน: ตรวจไปแล้ว · จุดเสี่ยงที่พบ · ใช้ล่าสุด (กดไปหน้าประวัติ)
   (3) หลอดเครดิต + ปุ่มเติมเครดิต / แลกแต้มเช็กอิน
   ข้อมูลจาก /api/me · /api/history/inspections · /api/daily (ไม่ต้องแก้เซิร์ฟเวอร์) */
(function () {
  'use strict';
  var pane = document.querySelector('.pane[data-pane="acct"]');
  if (!pane) return;
  var calm = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(u) { return fetch(u, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  var box = document.createElement('section'); box.className = 'vac'; box.id = 'vacCard'; box.setAttribute('aria-label', 'สมุดบัญชีของคุณ'); box.hidden = true;
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
  function count(el, to) {
    to = Math.max(0, to | 0);
    if (calm() || !to) { el.textContent = to; return; }
    var t0 = performance.now(), D = Math.min(900, 300 + to * 30);
    (function f(n) { var u = Math.min(1, (n - t0) / D), e = 1 - Math.pow(1 - u, 3); el.textContent = Math.round(to * e); if (u < 1) requestAnimationFrame(f); })(t0);
  }
  function goHist() {
    var h = document.querySelector('#bottomNav [data-nav="hist"]');
    if (h && h.offsetParent) { h.click(); return; }
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
  function setOpen(on, anim) {
    var bk = box.querySelector('.vl-book'); if (!bk) return;
    if (!anim || calm()) bk.classList.add('no-anim'); else bk.classList.remove('no-anim');
    bk.classList.toggle('is-open', on);
    var cv = bk.querySelector('.vl-cover'); if (cv) { cv.setAttribute('aria-expanded', on ? 'true' : 'false'); cv.tabIndex = on ? -1 : 0; }
    if (!anim || calm()) { void bk.offsetWidth; bk.classList.remove('no-anim'); }
  }

  var busy = false, lastKey = '';
  function render(me, hist, daily) {
    var email = me.email || '', cr = me.credits | 0, vc = me.voice_credits | 0;
    var items = (hist && hist.items) || [], nIns = items.length, risk = 0;
    items.forEach(function (it) { var sm = it.summary || {}; risk += (+sm.check_detail || +it.n_detail || 0) + (+sm.caution || +it.n_caution || 0); });
    var last = items[0] && (items[0].createdAt || items[0].created_at);
    var pts = daily && typeof daily.points === 'number' ? daily.points : null, need = 300;
    var lowCr = cr <= 2, pct = Math.max(3, Math.min(100, cr / Math.max(10, cr) * 100));
    var name = nm(email), wasOpen = false;
    try { wasOpen = sessionStorage.getItem('vl_open') === '1'; } catch (e) {}
    var line = function (pre, val, post, cls) { return '<button type="button" class="vl-ln' + (cls ? ' ' + cls : '') + '" data-a="hist">' + pre + ' <u>' + val + '</u> ' + post + '</button>'; };
    box.className = 'vac vl';
    box.innerHTML =
      '<div class="vl-book' + (wasOpen ? ' is-open' : '') + '">' +
        '<div class="vl-page">' +
          '<div class="vl-head">' +
            '<div><small class="vl-kick">สมุดบัญชีสมาชิก' + (me.is_admin ? ' · แอดมิน' : '') + '</small>' +
            '<p class="vl-name">' + esc(name) + '</p><p class="vl-mail">' + esc(email) + '</p></div>' +
            '<span class="vl-wax" aria-hidden="true"><b>VC</b></span>' +
          '</div>' +
          '<div class="vl-bal">' +
            '<div class="vl-n"><span>เครดิตตรวจคงเหลือ</span><p><b data-c="' + cr + '">0</b><small>ครั้ง</small></p></div>' +
            '<div class="vl-n is-v"><span>เครดิตเสียง</span><p><b data-c="' + vc + '">0</b><small>ครั้ง</small></p></div>' +
          '</div>' +
          '<div class="vl-gauge' + (lowCr ? ' is-low' : '') + '" role="img" aria-label="เหลือเครดิตตรวจ ' + cr + ' ครั้ง"><i style="--w:' + pct.toFixed(0) + '%"></i></div>' +
          '<p class="vl-hint">' + (cr === 0 ? 'เครดิตหมดแล้ว — เติมหรือแลกแต้มเพื่อตรวจต่อ' : lowCr ? 'ใกล้หมดแล้ว เหลืออีก ' + cr + ' ครั้ง' : 'พร้อมตรวจได้อีก ' + cr + ' ฉบับ') + '</p>' +
          '<div class="vl-acts">' +
            '<button type="button" class="vl-stamp" data-a="topup">เติมเครดิต</button>' +
            '<button type="button" class="vl-link" data-a="redeem">' + (pts == null ? 'แลกแต้มเช็กอิน' : pts >= need ? 'แลกตรวจฟรีได้แล้ว' : 'แต้มเช็กอิน ' + pts + '/' + need) + ' <span aria-hidden="true">→</span></button>' +
          '</div>' +
          '<div class="vl-notes">' +
            '<p class="vl-nh">บันทึกของฉัน</p>' +
            (nIns ? line('ตรวจไปแล้ว', nIns + (nIns >= 50 ? '+' : ''), 'ฉบับ') + line('เจอจุดน่าสงสัย', risk, 'จุด', 'is-r') + (last ? line('ล่าสุดเมื่อ', esc(ago(last)), '') : '')
                  : '<button type="button" class="vl-ln is-empty" data-a="hist">ยังไม่มีบันทึก — ตรวจสัญญาฉบับแรกได้เลย</button>') +
          '</div>' +
          '<button type="button" class="vl-close" data-a="close" aria-label="ปิดสมุด">ปิดเล่ม</button>' +
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
        var key = JSON.stringify([me.email, me.credits, me.voice_credits, r[0] && r[0].items && r[0].items.length, r[1] && r[1].points]);
        if (key !== lastKey || box.hidden) { lastKey = key; render(me, r[0], r[1]); }
        busy = false;
      });
    }).catch(function () { busy = false; });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return;
    var a = b.getAttribute('data-a');
    if (a === 'topup') topup();
    else if (a === 'redeem') { if (window.VCDaily && VCDaily.open) VCDaily.open(); }
    else if (a === 'hist') goHist();
    else if (a === 'cover') setOpen(true, true);
    else if (a === 'close') setOpen(false, true);
  });
  /* อัปเดตเมื่อเปิดหน้าบัญชี / ล็อกอิน-ออก */
  var lo = document.getElementById('authLoggedIn');
  if (lo && 'MutationObserver' in window) new MutationObserver(function () { if (lo.hidden) { box.hidden = true; lastKey = ''; } else refresh(); }).observe(lo, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(function () { if (document.body.classList.contains('auth-open')) refresh(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-nav="acct"],#authToggle,[data-tab="acct"]')) setTimeout(refresh, 60); }, true);
  if (lo && !lo.hidden) refresh(); else setTimeout(refresh, 1500);
})();
