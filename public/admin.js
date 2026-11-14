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
        '<div class="adm-st adm-ev" id="admEval">' +
          '<div class="adm-st-hd"><h4>ทดสอบความแม่นยำ AI</h4></div>' +
          '<p class="adm-fine">รันสัญญาสมมติพร้อมเฉลยทั้งชุด แล้วให้คะแนนว่า AI หาจุดเสี่ยงและสิ่งที่ต้องทำเจอกี่ % · ใช้ก่อนและหลังแก้คำสั่ง AI ทุกครั้ง · เรียก AI จริง 2 ครั้งต่อฉบับ (มีค่า API ไม่หักเครดิตใคร)</p>' +
          '<button type="button" class="adm-go adm-ev-go">▶ รันชุดทดสอบ</button>' +
          '<div class="adm-ev-body"></div>' +
        '</div>' +
        '<div class="adm-st adm-sp" id="admSupport">' +
          '<div class="adm-st-hd"><h4>เรื่องร้องเรียน</h4><div class="adm-st-rng adm-sp-rng" role="group" aria-label="สถานะ"><button type="button" data-s="open" class="is-on">รอตอบ</button><button type="button" data-s="resolved">ปิดแล้ว</button></div></div>' +
          '<p class="adm-fine">สัญญากับลูกค้าว่าตอบภายใน 7 วัน · เรื่องที่ใกล้ครบกำหนดจะขึ้นสีแดง · ตอบลูกค้าทางอีเมลแล้วกดปิดเรื่องที่นี่ (คืนเครดิตได้ในขั้นตอนเดียว)</p>' +
          '<form class="adm-sp-find"><input type="text" id="admRef" placeholder="ค้นรหัสอ้างอิง VC-XXXX-XXXX" autocomplete="off" spellcheck="false"><button type="submit">ค้น</button></form>' +
          '<div class="adm-sp-ref"></div>' +
          '<div class="adm-sp-body"><p class="adm-st-load">กำลังโหลด…</p></div>' +
        '</div>' +
      '</section>'
    );
    var wallet = loggedIn.querySelector('.wallet');
    /* วางใต้การ์ดยอดเครดิต (ก่อนรายการเครดิตแยกประเภท) */
    if (wallet && wallet.parentNode) wallet.parentNode.insertBefore(card, wallet); else loggedIn.appendChild(card);

    card.querySelector('.adm-ev-go').addEventListener('click', evStart);
    card.querySelector('.adm-sp-rng').addEventListener('click', function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return;
      [].forEach.call(this.children, function (x) { x.classList.toggle('is-on', x === b); });
      spLoad(b.getAttribute('data-s'));
    });
    card.querySelector('.adm-sp-body').addEventListener('click', spAct);
    card.querySelector('.adm-sp-find').addEventListener('submit', function (e) { e.preventDefault(); spFind(); });
    if (!document.getElementById('admSpCss')) { var c2 = document.createElement('style'); c2.id = 'admSpCss'; c2.textContent =
      '.adm-sp-list{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px}.adm-sp-list li{padding:11px 12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}' +
      '.adm-sp-list li.late{border-color:rgba(255,122,134,.5);background:rgba(255,122,134,.06)}.adm-sp-list .hd{display:flex;justify-content:space-between;gap:8px;font:600 12.5px/1.4 Prompt,sans-serif;color:#fff}' +
      '.adm-sp-list .hd small{color:#a1a1aa;font-weight:400}.adm-sp-list p{margin:6px 0;font:400 13px/1.55 Prompt,sans-serif;color:#d4d4da;white-space:pre-wrap;word-break:break-word}' +
      '.adm-sp-list .meta{font:400 11.5px/1.5 Prompt,sans-serif;color:#a1a1aa}.adm-sp-list .meta a{color:#7fb5ff}.adm-sp-list .act{display:grid;grid-template-columns:1fr 70px auto;gap:6px;margin-top:8px}' +
      '.adm-sp-list input{min-width:0;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);color:#fff;border-radius:9px;padding:8px 9px;font:400 12.5px/1.3 Prompt,sans-serif}' +
      '.adm-sp-list button,.adm-sp-find button{appearance:none;border:0;border-radius:9px;padding:8px 12px;background:linear-gradient(135deg,#3be0c0,#22c3e6);color:#04201c;font:700 12.5px/1 Prompt,sans-serif;cursor:pointer}' +
      '.adm-sp-find{display:grid;grid-template-columns:1fr auto;gap:6px;margin:8px 0 0}.adm-sp-find input{min-width:0;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);color:#fff;border-radius:9px;padding:8px 9px;font:500 12.5px/1.3 ui-monospace,monospace;text-transform:uppercase}' +
      '.adm-sp-ref{font:400 12px/1.6 Prompt,sans-serif;color:#d4d4da}.adm-sp-ref dl{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;margin:8px 0 0;padding:10px;border-radius:10px;background:rgba(246,214,140,.06)}.adm-sp-ref dt{color:#a1a1aa}.adm-sp-ref dd{margin:0;word-break:break-all}';
      document.head.appendChild(c2); }
    if (!document.getElementById('admEvCss')) { var cs = document.createElement('style'); cs.id = 'admEvCss'; cs.textContent =
      '.adm-ev-go{margin-top:8px}.adm-ev-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;margin:10px 0 4px}.adm-ev-bar i{display:block;height:100%;background:linear-gradient(90deg,#3be0c0,#22c3e6);transition:width .4s}' +
      '.adm-ev-t{grid-template-columns:repeat(2,minmax(0,1fr))}.adm-ev-t>div{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04)}.adm-ev-t small{display:block;font:500 11px/1.3 Prompt,sans-serif;color:#a1a1aa}.adm-ev-t b{font:800 22px/1.2 Prompt,sans-serif}' +
      '.adm-ev-list{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:6px}.adm-ev-list li{padding:9px 11px;border-radius:11px;background:rgba(255,255,255,.035)}.adm-ev-list b{display:block;font:600 13px/1.3 Prompt,sans-serif;color:#fff}.adm-ev-list small{font:400 11.5px/1.5 Prompt,sans-serif;color:#a1a1aa}.adm-ev-list em{font-style:normal;color:#ff9aa4}' +
      '.adm-ev-miss{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.adm-ev .m{display:inline-block;padding:2px 7px;border-radius:99px;font:600 10.5px/1.4 Prompt,sans-serif}.adm-ev .m.r{background:rgba(255,122,134,.15);color:#ffaab3}.adm-ev .m.o{background:rgba(127,181,255,.15);color:#a9cbff}';
      document.head.appendChild(cs); }
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

  /* ---- ชุดทดสอบความแม่นยำ ---- */
  var evTimer = 0;
  function evPct(v, good) { var c = v >= good ? '#34d399' : v >= good - 15 ? '#f5c451' : '#ff7a86'; return '<b style="color:' + c + '">' + v + '%</b>'; }
  function evRender(d) {
    var b = card.querySelector('.adm-ev-body'), go = card.querySelector('.adm-ev-go'), j = d && d.job;
    if (!j) { b.innerHTML = '<p class="adm-fine">ยังไม่เคยรัน · มีสัญญาทดสอบ ' + ((d && d.cases) || []).length + ' ฉบับ</p>'; go.disabled = false; go.textContent = '▶ รันชุดทดสอบ'; return; }
    if (j.status === 'running') {
      go.disabled = true; go.textContent = 'กำลังทดสอบ ' + j.done + '/' + j.total + '…';
      b.innerHTML = '<div class="adm-ev-bar"><i style="width:' + Math.round(j.done / j.total * 100) + '%"></i></div><p class="adm-fine">ใช้เวลาประมาณ 2–4 นาที ปิดหน้านี้ได้ กลับมาดูผลทีหลังได้</p>';
      clearTimeout(evTimer); evTimer = setTimeout(evLoad, 4000); return;
    }
    go.disabled = false; go.textContent = '▶ รันอีกครั้ง';
    var S = j.summary || {}, when = new Date(j.finishedAt || j.startedAt).toLocaleString('th-TH');
    var rows = (j.cases || []).map(function (c) {
      var miss = c.risk.missed.map(function (m) { return '<span class="m r">' + esc(m) + '</span>'; }).join('') + c.obl.missed.map(function (m) { return '<span class="m o">' + esc(m) + '</span>'; }).join('');
      return '<li><div><b>' + esc(c.name) + '</b><small>จุดเสี่ยง ' + c.risk.found + '/' + c.risk.total + ' · สิ่งที่ต้องทำ ' + c.obl.found + '/' + c.obl.total + ' · อ้างข้อความถูก ' + c.quotes.ok + '/' + c.quotes.total +
        (c.overAlert ? ' · <em>เตือนเกินจริง (' + c.high + ')</em>' : '') + (c.oblError ? ' · <em>ดึงสิ่งที่ต้องทำล้มเหลว</em>' : '') + '</small>' + (miss ? '<div class="adm-ev-miss">' + miss + '</div>' : '') + '</div></li>';
    }).join('');
    var errs = (j.errors || []).map(function (e) { return '<li><div><b>' + esc(e.id) + '</b><small><em>' + esc(e.error) + '</em></small></div></li>'; }).join('');
    b.innerHTML = '<div class="adm-tiles adm-ev-t">' +
      '<div><small>คะแนนรวม</small>' + evPct(S.overall || 0, 90) + '</div><div><small>หาจุดเสี่ยงเจอ</small>' + evPct(S.riskRecall || 0, 90) + '</div>' +
      '<div><small>สิ่งที่ต้องทำครบ</small>' + evPct(S.oblRecall || 0, 90) + '</div><div><small>อ้างข้อความถูก</small>' + evPct(S.quoteValid || 0, 95) + '</div></div>' +
      '<p class="adm-fine">รันเมื่อ ' + esc(when) + (S.overAlerts ? ' · สัญญาเป็นธรรมที่ถูกเตือนเกินจริง ' + S.overAlerts + ' ฉบับ' : '') + (S.failed ? ' · ล้มเหลว ' + S.failed + ' ฉบับ' : '') + '</p>' +
      '<p class="adm-fine"><span class="m r">แดง</span> = จุดเสี่ยงที่ AI ไม่เจอ · <span class="m o">ฟ้า</span> = สิ่งที่ต้องทำที่ AI ไม่ดึงมา</p>' +
      '<ul class="adm-ev-list">' + rows + errs + '</ul>';
  }
  function evLoad(id) {
    fetch('/api/admin/eval' + (id ? '?id=' + encodeURIComponent(id) : ''), { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }); }).then(evRender).catch(function () {});
  }
  function evStart() {
    if (!confirm('รันชุดทดสอบทั้งหมด? จะเรียก AI จริงประมาณ 30 ครั้ง (มีค่า API)')) return;
    var go = card.querySelector('.adm-ev-go'); go.disabled = true; go.textContent = 'กำลังเริ่ม…';
    fetch('/api/admin/eval', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) { if (!x.ok) { go.disabled = false; go.textContent = '▶ รันชุดทดสอบ'; card.querySelector('.adm-ev-body').innerHTML = '<p class="adm-empty">' + esc(x.d.error || 'เริ่มไม่สำเร็จ') + '</p>'; return; } evLoad(x.d.id); })
      .catch(function () { go.disabled = false; go.textContent = '▶ รันชุดทดสอบ'; });
  }

  var SP_CAT = { wrong: 'ผลตรวจผิด/ไม่ครบ', bug: 'ระบบมีปัญหา', refund: 'ขอคืนเครดิต', privacy: 'ข้อมูลส่วนตัว (PDPA)', other: 'อื่น ๆ' }, spStatus = 'open';
  function spDate(v) { try { return new Date(v).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }); } catch (e) { return v; } }
  function spLoad(s) {
    if (!card) return; spStatus = s || spStatus;
    var b = card.querySelector('.adm-sp-body'); b.innerHTML = '<p class="adm-st-load">กำลังโหลด…</p>';
    fetch('/api/admin/support?status=' + spStatus, { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { b.innerHTML = '<p class="adm-empty">' + esc(x.d.error || 'โหลดไม่สำเร็จ') + '</p>'; return; }
        var t = x.d.tickets || [];
        if (!t.length) { b.innerHTML = '<p class="adm-empty">' + (spStatus === 'open' ? 'ไม่มีเรื่องรอตอบ 🎉' : 'ยังไม่มีเรื่องที่ปิด') + '</p>'; return; }
        b.innerHTML = '<ul class="adm-sp-list">' + t.map(function (k) {
          var open = k.status !== 'resolved';
          return '<li class="' + (open && k.late ? 'late' : '') + '" data-id="' + k.id + '">' +
            '<div class="hd"><span>#' + k.id + ' · ' + esc(SP_CAT[k.category] || k.category) + '</span><small>' + esc(spDate(k.created_at)) + (open && k.late ? ' · ใกล้ครบ 7 วัน' : '') + '</small></div>' +
            '<p>' + esc(k.message) + '</p>' +
            '<div class="meta">' + (k.email ? '<a href="mailto:' + esc(k.email) + '?subject=' + encodeURIComponent('เรื่อง #' + k.id + ' จาก Vellum Check') + '">' + esc(k.email) + '</a>' : 'ไม่มีอีเมล') +
              (k.ref ? ' · <a href="#" data-ref="' + esc(k.ref) + '">' + esc(k.ref) + '</a>' : '') +
              (!open ? ' · ปิดเมื่อ ' + esc(spDate(k.resolved_at)) + (k.refunded ? ' · คืน ' + k.refunded + ' เครดิต' : '') + (k.admin_note ? ' · ' + esc(k.admin_note) : '') : '') + '</div>' +
            (open ? '<div class="act"><input type="text" class="sp-note" maxlength="500" placeholder="บันทึกคำตอบ (ลูกค้าเห็น)"><input type="number" class="sp-ref" min="0" max="20" value="' + (k.category === 'refund' || k.category === 'bug' ? 1 : 0) + '" aria-label="คืนเครดิต"><button type="button" data-a="resolve">ปิดเรื่อง</button></div>' : '') +
          '</li>';
        }).join('') + '</ul>';
      }).catch(function () { b.innerHTML = '<p class="adm-empty">เชื่อมต่อไม่ได้</p>'; });
  }
  function spAct(e) {
    var r = e.target.closest('[data-ref]');
    if (r) { e.preventDefault(); card.querySelector('#admRef').value = r.getAttribute('data-ref'); spFind(); return; }
    var b = e.target.closest('[data-a="resolve"]'); if (!b) return;
    var li = b.closest('li'), id = li.getAttribute('data-id');
    var note = li.querySelector('.sp-note').value.trim(), refund = parseInt(li.querySelector('.sp-ref').value || '0', 10) || 0;
    b.disabled = true; b.textContent = '…';
    fetch('/api/admin/support/' + id + '/resolve', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: note, refund: refund }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { b.disabled = false; b.textContent = 'ปิดเรื่อง'; alertMsg(x.d.error || 'บันทึกไม่สำเร็จ'); return; }
        alertMsg('ปิดเรื่อง #' + id + ' แล้ว' + (x.d.refunded ? ' · คืน ' + x.d.refunded + ' เครดิต' : ''), 'ok');
        spLoad();
      }).catch(function () { b.disabled = false; b.textContent = 'ปิดเรื่อง'; });
  }
  function alertMsg(t, kind) { say(t, kind || 'err'); var m = card.querySelector('#admMsg'); if (m && m.scrollIntoView) m.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  function spFind() {
    var v = card.querySelector('#admRef').value.trim().toUpperCase(), out = card.querySelector('.adm-sp-ref');
    if (!v) { out.innerHTML = ''; return; }
    out.innerHTML = '<p class="adm-st-load">กำลังค้น…</p>';
    fetch('/api/admin/receipt/' + encodeURIComponent(v), { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { out.innerHTML = '<p class="adm-empty">' + esc(x.d.error || 'ไม่พบ') + '</p>'; return; }
        var d = x.d;
        out.innerHTML = '<dl><dt>รหัส</dt><dd>' + esc(d.ref) + '</dd><dt>ตรวจเมื่อ</dt><dd>' + esc(spDate(d.created_at)) + '</dd><dt>บัญชี</dt><dd>' + esc(d.email || '–') + '</dd>' +
          '<dt>ประเภท</dt><dd>' + esc(d.contract_type) + ' · ' + d.n_items + ' ประเด็น</dd><dt>ข้อกำหนด</dt><dd>v' + esc(d.terms_version || '–') + '</dd>' +
          '<dt>รุ่นระบบตรวจ</dt><dd>' + esc(d.prompt_version || '–') + '</dd><dt>บันทึกประวัติ</dt><dd>' + (d.saved ? 'ใช่' : 'ไม่ (ผู้ใช้เลือกไม่เก็บ)') + '</dd>' +
          '<dt>ลายนิ้วมือผล</dt><dd>' + esc(d.result_hash || '–') + '</dd></dl>';
      }).catch(function () { out.innerHTML = '<p class="adm-empty">เชื่อมต่อไม่ได้</p>'; });
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
      loadStats(); evLoad(); spLoad('open');
      var em = card.querySelector('#admEmail'); if (!em.value) em.value = d.email || '';
    }).catch(function () {});
  }

  new MutationObserver(check).observe(loggedIn, { attributes: true, attributeFilter: ['hidden'] });
  check();
})();
