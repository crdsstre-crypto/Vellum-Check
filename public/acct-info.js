/* ===== กล่อง "ข้อมูลบัญชี" แบบการ์ดเล็ก (เปิดจากเมนูข้อมูลบัญชี) =====
   (1) การ์ด: อีเมล · เครดิตตรวจ · เครดิตเสียง · ประวัติ
   (2) ประวัติเป็นหลอดความจุ "เก็บแล้ว N/50" (เต็ม = สีส้ม + เตือน)
   (3) เครดิตมีสี (ตรวจ = ทอง · เสียง = ม่วง · เหลือน้อย = แดง) + ปุ่ม "เติม"
   แถวเดิมใน <dl id="acctDetail"> ยังอยู่ (สคริปต์เดิมยังเขียนค่าลงไปได้) แค่ซ่อนไว้ */
(function () {
  'use strict';
  var btn = document.getElementById('acctInfoBtn'), box = document.getElementById('acctDetail');
  if (!btn || !box) return;
  var KEEP = 50;
  var m = /ไม่เกิน\s*(\d+)/.exec(box.textContent || ''); if (m) KEEP = +m[1] || 50;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(u) { return fetch(u, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  var S = function (d) { return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var IC = {
    mail: S('<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/>'),
    check: S('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>'),
    voice: S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
    hist: S('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4v4h4"/><path d="M12 8v4.5l3 1.8"/>')
  };
  var wrap = document.createElement('div'); wrap.className = 'vai';
  box.insertBefore(wrap, box.firstChild); box.classList.add('has-vai');

  function credit(kind, n, label) {
    var low = n <= 2;
    return '<div class="vai-c is-' + kind + (low ? ' is-low' : '') + '">' +
      '<div class="vai-top"><span class="vai-ic">' + IC[kind] + '</span><span class="vai-lab">' + label + '</span></div>' +
      '<p class="vai-num"><b>' + n + '</b><small>ครั้ง</small></p>' +
      '<div class="vai-foot"><span class="vai-note">' + (n === 0 ? 'หมดแล้ว' : low ? 'ใกล้หมด' : 'พร้อมใช้') + '</span>' +
      '<button type="button" class="vai-add" data-a="topup" aria-label="เติม' + label + '">+ เติม</button></div>' +
    '</div>';
  }
  function render(me, hist) {
    var email = (me && me.email) || (document.getElementById('userEmail') || {}).textContent || '–';
    var cr = me ? me.credits | 0 : +((document.getElementById('walletRowCheck') || {}).textContent) || 0;
    var vc = me ? me.voice_credits | 0 : +((document.getElementById('walletRowVoice') || {}).textContent) || 0;
    var n = hist && hist.items ? Math.min(hist.items.length, KEEP) : null;
    var pct = n == null ? 0 : Math.round(n / KEEP * 100), full = n != null && n >= KEEP, near = n != null && !full && n >= KEEP * .8;
    wrap.innerHTML =
      '<div class="vai-c is-mail">' +
        '<div class="vai-top"><span class="vai-ic">' + IC.mail + '</span><span class="vai-lab">อีเมลที่เข้าสู่ระบบ</span></div>' +
        '<p class="vai-mail">' + esc(email) + '</p>' +
      '</div>' +
      credit('check', cr, 'เครดิตตรวจ') +
      credit('voice', vc, 'เครดิตเสียง') +
      '<button type="button" class="vai-c is-hist' + (full ? ' is-full' : near ? ' is-near' : '') + '" data-a="hist">' +
        '<div class="vai-top"><span class="vai-ic">' + IC.hist + '</span><span class="vai-lab">ประวัติการตรวจ</span><span class="vai-go" aria-hidden="true">›</span></div>' +
        '<p class="vai-cap"><b>' + (n == null ? '–' : n) + '</b><small>/ ' + KEEP + ' ฉบับ</small></p>' +
        '<div class="vai-bar" role="img" aria-label="เก็บแล้ว ' + (n || 0) + ' จาก ' + KEEP + ' ฉบับ"><i style="--w:' + pct + '%"></i></div>' +
        '<span class="vai-note">' + (n == null ? 'กำลังโหลด…' : full ? 'เต็มแล้ว · ตรวจฉบับใหม่ ฉบับเก่าสุดจะถูกลบ' : near ? 'ใกล้เต็ม · เก็บได้อีก ' + (KEEP - n) + ' ฉบับ' : 'เก็บได้อีก ' + (KEEP - n) + ' ฉบับ') + '</span>' +
      '</button>';
  }
  function load() {
    render(null, null);
    Promise.all([get('/api/me'), get('/api/history/inspections')]).then(function (r) { if (!box.hidden) render(r[0], r[1]); });
  }
  btn.addEventListener('click', function () { setTimeout(function () { if (!box.hidden) load(); }, 0); });
  wrap.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return;
    if (b.getAttribute('data-a') === 'topup') { var t = document.querySelector('.wallet-topup'); if (t) t.click(); else if (window.VCShowCredits) window.VCShowCredits(); }
    else {
      var h = document.querySelector('#bottomNav [data-nav="hist"]');
      if (h && h.offsetParent) h.click(); else if (window.vcOpenHistory) window.vcOpenHistory(); else { var w = document.getElementById('walletHist'); if (w) w.click(); }
    }
  });
})();
