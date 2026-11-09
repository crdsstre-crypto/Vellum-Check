/* แผงแอดมิน: แสดงเฉพาะบัญชีที่เซิร์ฟเวอร์ตอบ is_admin = true (ตั้งใน ADMIN_EMAILS)
   เพิ่ม/ลดเครดิตตรวจและเครดิตเสียงให้บัญชีใดก็ได้ผ่าน POST /api/admin/credits
   สิทธิ์ตรวจที่เซิร์ฟเวอร์ทุกครั้ง ไฟล์นี้แค่สร้างหน้าตา */
(function () {
  var loggedIn = document.getElementById('authLoggedIn');
  if (!loggedIn) return;
  var card = null, me = null, busy = false;

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function build() {
    card = el(
      '<section class="adm" id="adminPanel" aria-labelledby="admTitle">' +
        '<header class="adm-head"><span class="adm-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="M9.5 12h5M12 9.5v5"/></svg></span>' +
        '<div><h3 id="admTitle">แผงแอดมิน</h3><p>เพิ่มหรือลดเครดิตให้บัญชีใดก็ได้</p></div></header>' +
        '<label class="adm-f">อีเมลบัญชี<input type="email" id="admEmail" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="email"></label>' +
        '<div class="adm-row">' +
          '<label class="adm-f">เครดิตตรวจ<input type="number" id="admCheck" inputmode="numeric" step="1" value="10"></label>' +
          '<label class="adm-f">เครดิตเสียง<input type="number" id="admVoice" inputmode="numeric" step="1" value="0"></label>' +
        '</div>' +
        '<div class="adm-quick" role="group" aria-label="จำนวนด่วน">' +
          '<button type="button" data-q="5">+5</button><button type="button" data-q="10">+10</button><button type="button" data-q="50">+50</button><button type="button" data-q="100">+100</button>' +
        '</div>' +
        '<button type="button" class="adm-go" id="admGo">เพิ่มเครดิต</button>' +
        '<p class="adm-msg" id="admMsg" role="status" aria-live="polite"></p>' +
        '<p class="adm-fine">ใส่เลขติดลบเพื่อลดเครดิต ยอดจะไม่ต่ำกว่า 0 · ทุกครั้งถูกบันทึกในระบบ</p>' +
        '<div class="adm-st" id="admStats">' +
          '<div class="adm-st-hd"><h4>สถิติธุรกิจ</h4><div class="adm-st-rng" role="group" aria-label="ช่วงเวลา"><button type="button" data-d="7">7 วัน</button><button type="button" data-d="30" class="is-on">30 วัน</button><button type="button" data-d="90">90 วัน</button></div></div>' +
          '<div class="adm-st-body"><p class="adm-st-load">กำลังโหลด…</p></div>' +
        '</div>' +
      '</section>'
    );
    var wallet = loggedIn.querySelector('.wallet');
    /* วางใต้การ์ดยอดเครดิต (ก่อนรายการเครดิตแยกประเภท) */
    if (wallet && wallet.parentNode) wallet.parentNode.insertBefore(card, wallet); else loggedIn.appendChild(card);

    card.querySelector('.adm-quick').addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return;
      card.querySelector('#admCheck').value = b.getAttribute('data-q');
    });
    card.querySelector('#admGo').addEventListener('click', submit);
    card.querySelector('.adm-st-rng').addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('is-on', x === b); });
      loadStats(+b.getAttribute('data-d'));
    });
  }

  /* ---------- สถิติ (ตัวเลขจริงจากฐานข้อมูล ผ่าน GET /api/admin/stats) ---------- */
  var statsDays = 30;
  function n(v) { return Number(v || 0).toLocaleString('th-TH'); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) + '%' : '–'; }
  var TYPE_TH = { rent: 'เช่า', sale: 'ซื้อขาย', employment: 'จ้างงาน', service: 'จ้างบริการ', loan: 'กู้ยืม', shareholder: 'หุ้นส่วน', nda: 'รักษาความลับ', other: 'อื่น ๆ', unsure: 'ไม่แน่ใจ' };
  function bars(daily) {
    /* กราฟแท่งชุดเดียว: จำนวนการตรวจต่อวัน · ชี้แท่งเพื่อดูตัวเลข */
    var max = Math.max(1, Math.max.apply(null, daily.map(function (d) { return d.checks; })));
    var W = 300, H = 92, gap = 2, bw = Math.max(2, (W - gap * (daily.length - 1)) / daily.length);
    var g = daily.map(function (d, i) {
      var h = d.checks ? Math.max(4, Math.round((H - 4) * d.checks / max)) : 0, x = (i * (bw + gap)).toFixed(1);
      var tip = d.day.slice(8) + '/' + d.day.slice(5, 7) + ' · ตรวจ ' + d.checks + ' · สมัคร ' + d.signups + ' · จ่าย ' + d.paid + (d.revenueBaht ? ' (' + n(d.revenueBaht) + ' ฿)' : '');
      return '<g class="adm-bar"><title>' + esc(tip) + '</title><rect class="hit" x="' + x + '" y="0" width="' + bw.toFixed(1) + '" height="' + H + '"/>' +
        (h ? '<rect class="b" x="' + x + '" y="' + (H - h) + '" width="' + bw.toFixed(1) + '" height="' + h + '" rx="' + Math.min(4, bw / 2).toFixed(1) + '"/>' : '<rect class="z" x="' + x + '" y="' + (H - 1) + '" width="' + bw.toFixed(1) + '" height="1"/>') + '</g>';
    }).join('');
    var f = daily[0], l = daily[daily.length - 1];
    return '<figure class="adm-chart"><figcaption>จำนวนการตรวจต่อวัน <small>สูงสุด ' + n(max) + ' ครั้ง/วัน · ชี้แท่งเพื่อดูรายละเอียด</small></figcaption>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="กราฟจำนวนการตรวจต่อวัน">' + g + '</svg>' +
      '<div class="adm-chart-x"><span>' + f.day.slice(8) + '/' + f.day.slice(5, 7) + '</span><span>วันนี้</span></div></figure>';
  }
  function renderStats(d) {
    var t = d.totals, fb = t.feedbackUp + t.feedbackDown, body = card.querySelector('.adm-st-body');
    var tiles = [
      ['ผู้สมัครใหม่', n(t.signups), 'ทั้งหมด ' + n(t.usersTotal) + ' บัญชี'],
      ['ตรวจสัญญา', n(t.checks), n(t.checkers) + ' คนที่ตรวจ'],
      ['กลับมาตรวจซ้ำ', n(t.repeatUsers), pct(t.repeatUsers, t.checkers) + ' ของคนที่ตรวจ'],
      ['ยอดขาย', n(t.revenueBaht) + ' ฿', n(t.paidOrders) + ' รายการ · ' + n(t.payers) + ' คน'],
      ['ความเห็น', fb ? pct(t.feedbackUp, fb) : '–', fb ? '👍 ' + n(t.feedbackUp) + ' · 👎 ' + n(t.feedbackDown) : 'ยังไม่มีความเห็น']
    ].map(function (x) { return '<div class="adm-tile"><span>' + x[0] + '</span><b>' + x[1] + '</b><small>' + x[2] + '</small></div>'; }).join('');
    var reasons = d.reasons.length ? '<ul class="adm-rs">' + d.reasons.map(function (r) { return '<li class="' + (r.rating > 0 ? 'up' : 'down') + '"><span>' + (r.rating > 0 ? '👍' : '👎') + ' ' + esc(r.reason) + '</span><b>' + n(r.n) + '</b></li>'; }).join('') + '</ul>' : '<p class="adm-empty">ยังไม่มีเหตุผลที่ผู้ใช้เลือก</p>';
    var notes = d.recent.filter(function (r) { return r.note; }).slice(0, 8);
    var noteHtml = notes.length ? '<ul class="adm-notes">' + notes.map(function (r) {
      return '<li><span class="' + (r.rating > 0 ? 'up' : 'down') + '">' + (r.rating > 0 ? '👍' : '👎') + '</span><div><p>' + esc(r.note) + '</p><small>' + esc(TYPE_TH[r.type] || r.type) + ' · ' + new Date(r.at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) + '</small></div></li>';
    }).join('') + '</ul>' : '<p class="adm-empty">ยังไม่มีข้อความจากผู้ใช้</p>';
    var packs = d.packages.length ? d.packages.map(function (p) { return '<li><span>' + esc(p.id) + '</span><b>' + n(p.n) + ' · ' + n(p.baht) + ' ฿</b></li>'; }).join('') : '';
    body.innerHTML = '<div class="adm-tiles">' + tiles + '</div>' + bars(d.daily) +
      (packs ? '<h5>แพ็กเกจที่ขายได้</h5><ul class="adm-rs">' + packs + '</ul>' : '') +
      '<h5>เหตุผลจากผู้ใช้</h5>' + reasons + '<h5>ข้อความล่าสุด</h5>' + noteHtml +
      '<p class="adm-fine">นับตามเวลาไทย · การตรวจนับจากบันทึกการตรวจ (ไม่หายเมื่อผู้ใช้ลบประวัติ) · เริ่มนับตั้งแต่อัปเดตนี้ขึ้นระบบ</p>';
  }
  function loadStats(days) {
    statsDays = days || statsDays;
    var body = card.querySelector('.adm-st-body'); body.innerHTML = '<p class="adm-st-load">กำลังโหลด…</p>';
    fetch('/api/admin/stats?days=' + statsDays, { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) { if (!x.ok) { body.innerHTML = '<p class="adm-empty">' + esc(x.d.error || 'โหลดสถิติไม่สำเร็จ') + '</p>'; return; } renderStats(x.d); })
      .catch(function () { body.innerHTML = '<p class="adm-empty">เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง</p>'; });
  }

  function say(t, kind) { var m = card.querySelector('#admMsg'); m.textContent = t || ''; m.className = 'adm-msg' + (kind ? ' is-' + kind : ''); }

  function submit() {
    if (busy) return;
    var email = card.querySelector('#admEmail').value.trim() || (me && me.email) || '';
    var check = parseInt(card.querySelector('#admCheck').value || '0', 10) || 0;
    var voice = parseInt(card.querySelector('#admVoice').value || '0', 10) || 0;
    if (!check && !voice) { say('ใส่จำนวนเครดิตก่อน', 'err'); return; }
    busy = true; var go = card.querySelector('#admGo'); go.disabled = true; go.textContent = 'กำลังบันทึก...'; say('');
    fetch('/api/admin/credits', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, check: check, voice: voice })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { say(x.d.error || 'ทำรายการไม่สำเร็จ', 'err'); return; }
        say('สำเร็จ · ' + esc(x.d.email) + ' มีเครดิตตรวจ ' + x.d.credits + ' · เสียง ' + x.d.voice_credits, 'ok');
        if (x.d.self && typeof window.showCredits === 'function') { try { window.showCredits(x.d.credits, x.d.voice_credits); } catch (e) {} }
        else if (x.d.self) location.reload();
      })
      .catch(function () { say('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', 'err'); })
      .then(function () { busy = false; go.disabled = false; go.textContent = 'เพิ่มเครดิต'; });
  }

  function check() {
    if (loggedIn.hidden) { if (card) card.hidden = true; return; }
    fetch('/api/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      me = d;
      if (!d || !d.is_admin) { if (card) card.hidden = true; return; }
      if (!card) build();
      card.hidden = false;
      loadStats();
      var em = card.querySelector('#admEmail'); if (!em.value) em.value = d.email || '';
    }).catch(function () {});
  }

  new MutationObserver(check).observe(loggedIn, { attributes: true, attributeFilter: ['hidden'] });
  check();
})();
