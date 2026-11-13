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

  var box = document.createElement('section'); box.className = 'vac'; box.id = 'vacCard'; box.setAttribute('aria-label', 'บัตรสมาชิกของคุณ'); box.hidden = true;
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

  var busy = false, lastKey = '';
  function render(me, hist, daily) {
    var email = me.email || '', cr = me.credits | 0, vc = me.voice_credits | 0;
    var items = (hist && hist.items) || [], nIns = items.length, risk = 0;
    items.forEach(function (it) { risk += (+it.n_detail || 0) + (+it.n_caution || 0); });
    var last = items[0] && items[0].created_at;
    var ph = document.getElementById('acctPhoto'), src = ph && !ph.hidden && ph.getAttribute('src') ? ph.currentSrc || ph.src : (typeof me.avatar === 'string' && /^(https:|data:image)/.test(me.avatar) ? me.avatar : '');
    var pts = daily && typeof daily.points === 'number' ? daily.points : null, need = 300;
    var lowCr = cr <= 2, pct = Math.max(4, Math.min(100, cr / Math.max(10, cr) * 100));
    box.innerHTML =
      '<div class="vac-card">' +
        '<i class="vac-sheen" aria-hidden="true"></i>' +
        '<div class="vac-top">' +
          '<span class="vac-av">' + (src ? '<img alt="" src="' + esc(src) + '">' : '<b>' + esc((email.charAt(0) || '?').toUpperCase()) + '</b>') + '</span>' +
          '<div class="vac-id"><small>สมาชิก Vellum Check' + (me.is_admin ? ' · แอดมิน' : '') + '</small><b>' + esc(email) + '</b></div>' +
          '<span class="vac-seal" aria-hidden="true"><b>VC</b></span>' +
        '</div>' +
        '<div class="vac-nums">' +
          '<div class="vac-n"><span>เครดิตตรวจ</span><p><b data-c="' + cr + '">0</b> <small>ครั้ง</small></p></div>' +
          '<div class="vac-n is-v"><span>เครดิตเสียง</span><p><b data-c="' + vc + '">0</b> <small>ครั้ง</small></p></div>' +
        '</div>' +
        '<div class="vac-bar' + (lowCr ? ' is-low' : '') + '" role="img" aria-label="เหลือเครดิตตรวจ ' + cr + ' ครั้ง"><i style="--w:' + pct.toFixed(0) + '%"></i></div>' +
        '<p class="vac-hint">' + (cr === 0 ? 'เครดิตหมดแล้ว เติมหรือแลกแต้มเพื่อตรวจต่อ' : lowCr ? 'ใกล้หมดแล้ว · เหลือ ' + cr + ' ครั้ง' : 'พร้อมตรวจได้อีก ' + cr + ' ฉบับ') + '</p>' +
        '<div class="vac-acts">' +
          '<button type="button" class="vac-btn" data-a="topup"><span aria-hidden="true">+</span> เติมเครดิต</button>' +
          '<button type="button" class="vac-btn is-ghost" data-a="redeem">🪙 ' + (pts == null ? 'แลกแต้มเช็กอิน' : pts >= need ? 'แลกตรวจฟรีได้แล้ว!' : 'แต้ม ' + pts + '/' + need) + '</button>' +
        '</div>' +
      '</div>' +
      '<p class="vac-h">สถิติของฉัน</p>' +
      '<div class="vac-stats">' +
        '<button type="button" class="vac-st" data-a="hist"><b data-c="' + nIns + '">0</b>' + (nIns >= 50 ? '<em>+</em>' : '') + '<span>ฉบับที่ตรวจ</span></button>' +
        '<button type="button" class="vac-st is-r" data-a="hist"><b data-c="' + risk + '">0</b><span>จุดเสี่ยงที่พบ</span></button>' +
        '<button type="button" class="vac-st" data-a="hist"><b class="is-t">' + (last ? esc(ago(last)) : 'ยังไม่เคย') + '</b><span>ใช้ล่าสุด</span></button>' +
      '</div>';
    /* วางแทนการ์ดเครดิตเดิมบนสุดของหน้าบัญชี (การ์ดเดิมถูกซ่อนด้วย CSS · ปุ่มเติมเครดิตเดิมยังใช้งานผ่านบัตรนี้) */
    var wc = document.querySelector('#authLoggedIn .vc-wcard');
    if (wc && wc.parentNode && box.nextSibling !== wc) wc.parentNode.insertBefore(box, wc);
    box.hidden = false;
    [].forEach.call(box.querySelectorAll('[data-c]'), function (el) { count(el, +el.getAttribute('data-c')); });
    if (!calm()) { var c = box.querySelector('.vac-card'); if (c.animate) c.animate([{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }); }
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
  });
  /* อัปเดตเมื่อเปิดหน้าบัญชี / ล็อกอิน-ออก */
  var lo = document.getElementById('authLoggedIn');
  if (lo && 'MutationObserver' in window) new MutationObserver(function () { if (lo.hidden) { box.hidden = true; lastKey = ''; } else refresh(); }).observe(lo, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(function () { if (document.body.classList.contains('auth-open')) refresh(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-nav="acct"],#authToggle,[data-tab="acct"]')) setTimeout(refresh, 60); }, true);
  if (lo && !lo.hidden) refresh(); else setTimeout(refresh, 1500);
})();
