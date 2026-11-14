/* ===== ความโปร่งใสและช่องทางร้องเรียน (trust-ui.js) =====
   (1) ตัวเลือก "ไม่บันทึกประวัติ" ใต้ปุ่มตรวจ — จำค่าไว้ในเครื่อง (vc_nosave) แล้วแนบ noSave:true ไปกับคำขอตรวจ
   (2) ใบรับรองผลตรวจท้ายรายงาน — รหัสอ้างอิง เวลา ฉบับข้อกำหนด รุ่นคำสั่ง AI (ไม่เก็บข้อความสัญญา)
   (3) หน้าต่าง "แจ้งปัญหา / ขอคืนเครดิต" — เลือกหมวด เล่าปัญหา แนบรหัสอ้างอิงอัตโนมัติ สัญญาตอบภายใน 7 วัน
       เปิดได้จากท้ายรายงาน และจากเมนูบัญชี · ดูสถานะเรื่องที่เคยแจ้งได้ในหน้าต่างเดียวกัน
   (4) สัญญามูลค่าสูง: เซิร์ฟเวอร์ตอบ 409 needHighAck → เปิดหน้าต่างให้ติ๊กยืนยันว่าควรให้ทนายตรวจ แล้วส่งใหม่ (ยังไม่หักเครดิต)
       และรายงานมีกล่องเตือนเด่นด้านบน
   ไม่แก้ script.js: ดักคำขอ /api/check ผ่าน fetch และเฝ้าดู #result ด้วย MutationObserver */
(function () {
  'use strict';
  if (window.VCTrust) return;
  var KEY = 'vc_nosave';
  function noSave() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function setNoSave(on) { try { if (on) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) {} }
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function logged() { try { return typeof currentUser !== 'undefined' && !!currentUser; } catch (e) { return false; } }
  function res() { try { return typeof lastResult !== 'undefined' ? lastResult : null; } catch (e) { return null; } }
  function say(t) { try { if (typeof toast === 'function') toast(t); } catch (e) {} }
  function fmt(iso) {
    try { return new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }); } catch (e) { return iso || ''; }
  }

  var ICO = {
    lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>',
    seal: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="m9 12 2.2 2.2L15.3 10"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/></svg>',
    flag: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>'
  };

  var CSS =
    /* (1) สวิตช์ไม่บันทึกประวัติ */
    'html body .vt-ns{display:flex;align-items:center;gap:10px;margin:10px 0 0;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);cursor:pointer;font:500 13px/1.4 Prompt,Sarabun,sans-serif;color:#d9d9df;-webkit-tap-highlight-color:transparent}' +
    'html body .vt-ns .vt-ic{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:rgba(127,181,255,.12);color:#a9cbff}' +
    'html body .vt-ns .vt-tx{flex:1;min-width:0}html body .vt-ns .vt-tx b{display:block;font-weight:700;color:#fff}html body .vt-ns .vt-tx small{display:block;font-size:11.5px;color:#9a9aa3}' +
    'html body .vt-ns input{position:absolute;opacity:0;pointer-events:none}' +
    'html body .vt-sw{flex:none;width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.14);position:relative;transition:background .2s}' +
    'html body .vt-sw::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .22s cubic-bezier(.3,1.4,.5,1)}' +
    'html body .vt-ns.on{border-color:rgba(127,181,255,.4);background:rgba(127,181,255,.07)}html body .vt-ns.on .vt-sw{background:linear-gradient(135deg,#7fb5ff,#5b8cff)}html body .vt-ns.on .vt-sw::after{transform:translateX(18px)}' +
    'html body .vt-ns:focus-within{outline:2px solid #7fb5ff;outline-offset:2px}' +
    /* (2) ใบรับรองผลตรวจ */
    'html body #result .vt-rc{margin:14px 0 8px;padding:14px;border-radius:16px;background:linear-gradient(160deg,rgba(246,214,140,.07),rgba(255,255,255,.02));border:1px dashed rgba(246,214,140,.3);font-family:Prompt,Sarabun,sans-serif}' +
    'html body #result .vt-rc-hd{display:flex;align-items:center;gap:8px;color:#f6d68c;font:700 13px/1.3 Prompt,sans-serif;margin:0 0 8px}' +
    'html body #result .vt-rc-ref{display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    'html body #result .vt-rc-ref code{font:700 17px/1.2 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.06em;color:#fff;background:rgba(0,0,0,.25);padding:6px 10px;border-radius:9px}' +
    'html body #result .vt-rc-cp{appearance:none;display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#e4e4e8;border-radius:99px;padding:6px 11px;font:600 12px/1 Prompt,sans-serif;cursor:pointer}' +
    'html body #result .vt-rc dl{display:grid;grid-template-columns:auto 1fr;gap:3px 12px;margin:10px 0 0;font:400 12px/1.5 Prompt,sans-serif}' +
    'html body #result .vt-rc dt{color:#8e8e97}html body #result .vt-rc dd{margin:0;color:#d4d4da;word-break:break-all}' +
    'html body #result .vt-rc-fine{margin:8px 0 0;font:400 11.5px/1.55 Prompt,sans-serif;color:#9a9aa3}' +
    'html body #result .vt-rc-ns{display:inline-flex;align-items:center;gap:5px;margin-top:8px;padding:4px 9px;border-radius:99px;background:rgba(127,181,255,.12);color:#a9cbff;font:600 11.5px/1.3 Prompt,sans-serif}' +
    'html body .vt-rep{appearance:none;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin:10px 0 0;padding:12px;border-radius:13px;border:1px solid rgba(255,154,164,.3);background:rgba(255,122,134,.07);color:#ffc0c6;font:700 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    /* (3) หน้าต่างแจ้งปัญหา */
    '.vts{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:flex-end;justify-content:center;background:rgba(5,5,8,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}.vts.on{opacity:1}.vts *{box-sizing:border-box}' +
    '.vts-p{width:min(100%,520px);max-height:92vh;overflow:auto;padding:20px 18px calc(18px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:linear-gradient(170deg,#1b1a21,#131217 60%);border:1px solid rgba(255,255,255,.1);color:#ececef;font-family:Prompt,Sarabun,system-ui,sans-serif;transform:translateY(24px);transition:transform .32s cubic-bezier(.2,1.2,.4,1)}' +
    '.vts.on .vts-p{transform:none}@media (min-width:640px){.vts{align-items:center}.vts-p{border-radius:24px}}' +
    '.vts-p h3{margin:0 0 4px;font:700 18px/1.35 Prompt,sans-serif;color:#fff}.vts-s{margin:0 0 12px;font:400 12.5px/1.55 Prompt,sans-serif;color:#a3a3aa}' +
    '.vts-pr{display:flex;gap:10px;align-items:center;margin:0 0 14px;padding:10px 12px;border-radius:13px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.25);font:500 12.5px/1.5 Prompt,sans-serif;color:#b6f0d6}.vts-pr b{color:#fff}' +
    '.vts-lb{display:block;margin:0 0 6px;font:600 12.5px/1.3 Prompt,sans-serif;color:#cfcfd6}' +
    '.vts-cat{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}' +
    '.vts-cat button{appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#d4d4da;border-radius:99px;padding:8px 12px;font:600 12.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vts-cat button.on{border-color:#3be0c0;background:rgba(59,224,192,.14);color:#fff}' +
    '.vts textarea,.vts input[type=text]{width:100%;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);color:#fff;border-radius:12px;padding:11px 12px;font:400 14px/1.5 Prompt,Sarabun,sans-serif;resize:vertical}' +
    '.vts textarea{min-height:96px}.vts input[type=text]{font-family:ui-monospace,Menlo,monospace;letter-spacing:.05em;text-transform:uppercase}' +
    '.vts-n{display:flex;justify-content:space-between;margin:4px 2px 12px;font:400 11px/1.4 Prompt,sans-serif;color:#7d7d86}' +
    '.vts-m{min-height:18px;margin:0 2px 8px;font:500 12.5px/1.45 Prompt,sans-serif;color:#ff9aa4}.vts-m.ok{color:#7ee8b8}' +
    '.vts-b{display:grid;grid-template-columns:1fr 2fr;gap:8px}.vts-b button{appearance:none;border:0;border-radius:14px;padding:14px 10px;font:700 14.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vts-no{background:rgba(255,255,255,.07);color:#d4d4da}.vts-go{background:linear-gradient(135deg,#3be0c0,#22c3e6);color:#04201c}.vts-go[disabled]{opacity:.5}' +
    '.vts-my{margin:16px 0 0;padding:12px 0 0;border-top:1px solid rgba(255,255,255,.08)}.vts-my h4{margin:0 0 8px;font:700 13px/1.3 Prompt,sans-serif;color:#cfcfd6}' +
    '.vts-my ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}.vts-my li{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.035);font:400 12px/1.5 Prompt,sans-serif;color:#bdbdc5}' +
    '.vts-my li b{color:#fff;font-weight:600}.vts-st{float:right;padding:2px 8px;border-radius:99px;font:600 11px/1.5 Prompt,sans-serif;background:rgba(245,196,81,.15);color:#f5c451}.vts-st.done{background:rgba(52,211,153,.15);color:#7ee8b8}' +
    '.vts-my .ans{display:block;margin-top:5px;color:#b6f0d6}' +
    '.vts-fine{margin:12px 0 0;font:400 11px/1.55 Prompt,sans-serif;color:#7d7d86}' +
    '.vth-ic{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:26px;margin:0 0 10px;background:rgba(246,196,81,.12);border:1px solid rgba(246,196,81,.3)}' +
    '.vth-rs{margin:0 0 12px;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}.vth-rs li{padding:5px 10px;border-radius:99px;background:rgba(246,196,81,.12);color:#f6d68c;font:600 12px/1.3 Prompt,sans-serif}' +
    '.vth-box{padding:12px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);font:400 13px/1.6 Prompt,sans-serif;color:#d4d4da}.vth-box b{color:#fff}' +
    '.vth-c{display:flex;gap:10px;align-items:flex-start;margin:14px 2px 4px;font:500 13px/1.55 Prompt,sans-serif;color:#e4e4e8;cursor:pointer}.vth-c input{flex:none;width:22px;height:22px;margin:1px 0 0;accent-color:#f5c451}' +
    '.vth .vts-go{background:linear-gradient(135deg,#f6d68c,#f5a524);color:#2a1a00}.vth .vts-go[aria-disabled=true]{opacity:.45;filter:grayscale(.6)}' +
    'html body #result .vt-hv{display:flex;gap:12px;align-items:flex-start;margin:0 0 14px;padding:14px;border-radius:16px;background:linear-gradient(150deg,rgba(245,165,36,.16),rgba(245,165,36,.05));border:1px solid rgba(245,165,36,.45);font-family:Prompt,Sarabun,sans-serif}' +
    'html body #result .vt-hv-ic{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:20px;background:rgba(0,0,0,.2)}' +
    'html body #result .vt-hv b{display:block;font:700 14.5px/1.4 Prompt,sans-serif;color:#ffd58a}html body #result .vt-hv small{display:block;margin-top:3px;font:400 12.5px/1.55 Prompt,sans-serif;color:#e8d9bd}' +
    /* เมนูบัญชีบนมือถือ (art.css จัดลำดับด้วย order) */
    '@media (max-width:767px){body[data-sheet="acct"] #authLoggedIn #vtMenu{order:11}body[data-sheet="acct"] #authLoggedIn #helpContact{order:12}body[data-sheet="acct"] #authLoggedIn #vtMenu .vc-mi{--mc:#fb7185}}';
  var st = document.createElement('style'); st.id = 'vtCss'; st.textContent = CSS; document.head.appendChild(st);

  /* ---------- (1) แนบ noSave ไปกับคำขอตรวจ + จำรหัสอ้างอิงล่าสุด ---------- */
  var lastReceipt = null;
  var of = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var isCheck = /\/api\/check(\?|$)/.test(url) && init && String(init.method || 'GET').toUpperCase() === 'POST';
    if (isCheck && noSave() && typeof init.body === 'string') {
      try { var b = JSON.parse(init.body); b.noSave = true; init = Object.assign({}, init, { body: JSON.stringify(b) }); } catch (e) {}
    }
    var self = this, p = of.call(this, input, init);
    if (isCheck) p = p.then(function (r) {
      if (r.status !== 409) return r;
      return r.clone().json().catch(function () { return {}; }).then(function (d) {
        if (!d || !d.needHighAck) return r;
        return askHigh(d.highValue || {}).then(function (ok) {
          if (!ok) return new Response(JSON.stringify({ error: 'ยกเลิกการตรวจแล้ว ยังไม่ได้ใช้เครดิต' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
          var b2 = {}; try { b2 = JSON.parse(init.body); } catch (e) {}
          b2.highAck = true;
          return window.fetch.call(self, input, Object.assign({}, init, { body: JSON.stringify(b2) }));
        });
      });
    });
    if (isCheck) p.then(function (r) {
      if (!r.ok) return;
      r.clone().json().then(function (d) { if (d && d.receipt) { lastReceipt = Object.assign({ noSave: !!d.noSave }, d.receipt); stamp(); } }).catch(function () {});
    }).catch(function () {});
    return p;
  };

  function mountToggle() {
    var btns = document.getElementById('checkBtn'); btns = btns && btns.closest('.btns');
    if (!btns || document.getElementById('vtNoSave')) return;
    var lab = document.createElement('label');
    lab.className = 'vt-ns' + (noSave() ? ' on' : ''); lab.id = 'vtNoSaveRow';
    lab.innerHTML = '<span class="vt-ic">' + ICO.lock + '</span>' +
      '<span class="vt-tx"><b>ไม่บันทึกผลตรวจในประวัติ</b><small>ปิดหน้าแล้วผลหายทันที · ปกติเก็บไว้ 90 วันแล้วลบอัตโนมัติ</small></span>' +
      '<input type="checkbox" id="vtNoSave" role="switch"' + (noSave() ? ' checked' : '') + '><span class="vt-sw" aria-hidden="true"></span>';
    btns.parentNode.insertBefore(lab, btns.nextSibling);
    lab.querySelector('input').addEventListener('change', function () {
      setNoSave(this.checked); lab.classList.toggle('on', this.checked);
      say(this.checked ? 'ผลตรวจครั้งถัดไปจะไม่ถูกบันทึกในประวัติ' : 'ผลตรวจจะเก็บในประวัติ 90 วัน');
    });
  }

  /* ---------- (2) ใบรับรองผลตรวจท้ายรายงาน ---------- */
  function receiptFor() {
    var r = res();
    if (r && r.receipt && r.receipt.ref) return Object.assign({ noSave: lastReceipt && lastReceipt.ref === r.receipt.ref ? lastReceipt.noSave : false }, r.receipt);
    return null;
  }
  function stamp() {
    var box = document.getElementById('result'); if (!box) return;
    var disc = box.querySelector('.disclaimer'); if (!disc) return;
    var rc = receiptFor(), old = box.querySelector('.vt-rc'), rep = box.querySelector('.vt-rep');
    if (old && rc && old.getAttribute('data-ref') === rc.ref) return;
    if (old) old.remove();
    if (rc) {
      var d = document.createElement('div'); d.className = 'vt-rc'; d.setAttribute('data-ref', rc.ref);
      d.innerHTML = '<p class="vt-rc-hd">' + ICO.seal + 'ใบรับรองการตรวจ</p>' +
        '<div class="vt-rc-ref"><code>' + h(rc.ref) + '</code><button type="button" class="vt-rc-cp" data-vt="copy">' + ICO.copy + 'คัดลอก</button></div>' +
        '<dl><dt>ตรวจเมื่อ</dt><dd>' + h(fmt(rc.at)) + '</dd>' +
        '<dt>ข้อกำหนดฉบับ</dt><dd>v' + h(rc.terms || '–') + '</dd>' +
        '<dt>รุ่นระบบตรวจ</dt><dd>' + h(rc.prompt || '–') + '</dd>' +
        (rc.hash ? '<dt>ลายนิ้วมือผล</dt><dd>' + h(rc.hash) + '</dd>' : '') + '</dl>' +
        (rc.noSave ? '<span class="vt-rc-ns">' + ICO.lock + 'ผลนี้ไม่ได้บันทึกในประวัติ</span>' : '') +
        '<p class="vt-rc-fine">ใช้รหัสนี้เมื่อแจ้งปัญหาหรือขอคืนเครดิต · ระบบเก็บเพียงรหัส เวลา และลายนิ้วมือของผล ไม่เก็บข้อความสัญญา</p>';
      disc.parentNode.insertBefore(d, disc);
    }
    if (!rep) {
      rep = document.createElement('button'); rep.type = 'button'; rep.className = 'vt-rep'; rep.setAttribute('data-vt', 'report');
      rep.innerHTML = ICO.flag + 'ผลไม่ถูกต้อง? แจ้งปัญหา / ขอคืนเครดิต';
      disc.parentNode.insertBefore(rep, disc.nextSibling);
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-vt]'); if (!b) return;
    var a = b.getAttribute('data-vt');
    if (a === 'copy') {
      var rc = receiptFor(); if (!rc) return;
      (navigator.clipboard ? navigator.clipboard.writeText(rc.ref) : Promise.reject()).then(function () { say('คัดลอกรหัส ' + rc.ref + ' แล้ว'); }, function () { say(rc.ref); });
    } else if (a === 'report') { var r = receiptFor(); open({ ref: r ? r.ref : '', category: 'wrong' }); }
    else if (a === 'menu') open({});
  });
  function watch() {
    var box = document.getElementById('result'); if (!box) return;
    var t = 0;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { stamp(); banner(); }, 60); }).observe(box, { childList: true });
    stamp(); banner();
  }

  /* ---------- (4) สัญญามูลค่าสูง ---------- */
  function askHigh(hv) {
    return new Promise(function (resolve) {
      var w = document.createElement('div'); w.className = 'vts vth';
      w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'vthT');
      var rs = (hv.reasons || []).map(function (r) { return '<li>' + h(r) + '</li>'; }).join('');
      w.innerHTML = '<div class="vts-p">' +
        '<div class="vth-ic" aria-hidden="true">⚖️</div>' +
        '<h3 id="vthT">สัญญานี้มีมูลค่าสูงหรือมีผลผูกพันสำคัญ</h3>' +
        '<p class="vts-s">ระบบพบจุดที่ทำให้สัญญานี้ควรได้รับการตรวจจากทนายความก่อนลงนาม</p>' +
        (rs ? '<ul class="vth-rs">' + rs + '</ul>' : '') +
        '<div class="vth-box">ผลตรวจจาก AI ใช้เป็น<b>จุดเริ่มต้น</b>สำหรับคุยกับทนายหรืออีกฝ่ายได้ แต่<b>ไม่ควรใช้แทนการตรวจของทนาย</b> โดยเฉพาะเรื่องเงินก้อนใหญ่ ที่ดิน เงินกู้ และหุ้น</div>' +
        '<label class="vth-c"><input type="checkbox" id="vthAck"><span>ฉันเข้าใจว่าสัญญานี้ควรให้ทนายความตรวจก่อนลงนาม และจะไม่ตัดสินใจจากผลตรวจนี้เพียงอย่างเดียว</span></label>' +
        '<p class="vts-m" id="vthM" role="status" aria-live="polite"></p>' +
        '<div class="vts-b"><button type="button" class="vts-no">ยกเลิก</button><button type="button" class="vts-go" aria-disabled="true">ยืนยันและตรวจต่อ</button></div>' +
        '<p class="vts-fine">การยืนยันนี้ถูกบันทึกไว้กับบัญชีของคุณ · ยังไม่หักเครดิตจนกว่าจะกดตรวจต่อ</p>' +
        '</div>';
      document.body.appendChild(w);
      requestAnimationFrame(function () { w.classList.add('on'); });
      var cb = w.querySelector('#vthAck'), go = w.querySelector('.vts-go');
      cb.addEventListener('change', function () { go.setAttribute('aria-disabled', cb.checked ? 'false' : 'true'); w.querySelector('#vthM').textContent = ''; });
      function done(ok) { document.removeEventListener('keydown', key); w.classList.remove('on'); setTimeout(function () { w.remove(); }, 260); resolve(ok); }
      function key(e) { if (e.key === 'Escape') done(false); }
      document.addEventListener('keydown', key);
      w.querySelector('.vts-no').addEventListener('click', function () { done(false); });
      go.addEventListener('click', function () {
        if (!cb.checked) { w.querySelector('#vthM').textContent = 'ติ๊กช่องยืนยันด้านบนก่อนนะครับ'; return; }
        done(true);
      });
    });
  }
  function banner() {
    var box = document.getElementById('result'); if (!box) return;
    var r = res(), hv = r && r.high_value, old = box.querySelector('.vt-hv');
    if (!box.querySelector('.disclaimer')) hv = null;   // แสดงเฉพาะตอนมีรายงานอยู่บนจอ (ไม่ใช่ตอนโหลด/ข้อความว่าง)
    if (!hv) { if (old) old.remove(); return; }
    if (old) return;
    var art = box.querySelector('article') || box;
    var d = document.createElement('div'); d.className = 'vt-hv'; d.setAttribute('role', 'note');
    d.innerHTML = '<span class="vt-hv-ic" aria-hidden="true">⚖️</span><div><b>สัญญามูลค่าสูง ควรให้ทนายความตรวจก่อนเซ็น</b>' +
      '<small>' + h((hv.reasons || []).join(' · ')) + (hv.reasons && hv.reasons.length ? ' — ' : '') + 'ใช้ผลด้านล่างเป็นรายการคำถามไปคุยกับทนาย ไม่ใช่คำตอบสุดท้าย</small></div>';
    art.insertBefore(d, art.firstChild);
  }

  /* ---------- (3) หน้าต่างแจ้งปัญหา ---------- */
  var CATS = [['wrong', 'ผลตรวจผิด/ไม่ครบ'], ['bug', 'ระบบมีปัญหา'], ['refund', 'ขอคืนเครดิต'], ['privacy', 'ข้อมูลส่วนตัว (PDPA)'], ['other', 'อื่น ๆ']];
  var CAT_NAME = {}; CATS.forEach(function (c) { CAT_NAME[c[0]] = c[1]; });
  var HINT = {
    wrong: 'เช่น ข้อ 4 บอกว่าเงินประกันคืนใน 30 วัน แต่สัญญาเขียน 60 วัน',
    bug: 'เช่น กดตรวจแล้วค้าง เครดิตถูกหักแต่ไม่ได้ผล',
    refund: 'บอกเหตุผลสั้น ๆ ทีมงานจะคืนเครดิตให้ถ้าระบบผิดพลาด',
    privacy: 'เช่น ขอสำเนาข้อมูล ขอลบบัญชีและข้อมูลทั้งหมด',
    other: 'เล่าสิ่งที่อยากให้ทีมงานรู้'
  };
  var sheet = null, cat = 'wrong', busy = false;
  function open(o) {
    o = o || {};
    if (!logged()) { say('เข้าสู่ระบบก่อน เพื่อให้ทีมงานตอบกลับทางอีเมลได้'); return; }
    if (sheet) close(true);
    cat = o.category || 'wrong';
    sheet = document.createElement('div'); sheet.className = 'vts';
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'vtsT');
    sheet.innerHTML = '<div class="vts-p">' +
      '<h3 id="vtsT">แจ้งปัญหา / ขอคืนเครดิต</h3>' +
      '<p class="vts-s">ผลตรวจผิด ระบบขัดข้อง หรือไม่พอใจ บอกเราได้ตรงนี้ ไม่ต้องเสียค่าใช้จ่าย</p>' +
      '<div class="vts-pr">' + ICO.seal + '<span><b>ตอบกลับทางอีเมลภายใน 7 วัน</b> · ถ้าพบว่าระบบผิดพลาด เราคืนเครดิตให้</span></div>' +
      '<span class="vts-lb">เรื่องที่ต้องการแจ้ง</span>' +
      '<div class="vts-cat" role="radiogroup">' + CATS.map(function (c) { return '<button type="button" role="radio" data-c="' + c[0] + '" aria-checked="' + (c[0] === cat) + '" class="' + (c[0] === cat ? 'on' : '') + '">' + h(c[1]) + '</button>'; }).join('') + '</div>' +
      '<label class="vts-lb" for="vtsMsg">รายละเอียด</label>' +
      '<textarea id="vtsMsg" maxlength="1000" placeholder="' + h(HINT[cat]) + '"></textarea>' +
      '<div class="vts-n"><span>อย่าใส่ข้อความสัญญาทั้งฉบับ หรือเลขบัตร/เลขบัญชี</span><span id="vtsCnt">0/1000</span></div>' +
      '<label class="vts-lb" for="vtsRef">รหัสอ้างอิงผลตรวจ (ถ้ามี)</label>' +
      '<input type="text" id="vtsRef" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="VC-XXXX-XXXX" value="' + h(o.ref || '') + '">' +
      '<div class="vts-n"><span>ดูได้ที่ท้ายรายงานผลตรวจ</span><span></span></div>' +
      '<p class="vts-m" id="vtsM" role="status" aria-live="polite"></p>' +
      '<div class="vts-b"><button type="button" class="vts-no">ปิด</button><button type="button" class="vts-go">ส่งเรื่อง</button></div>' +
      '<div class="vts-my" id="vtsMy" hidden><h4>เรื่องที่เคยแจ้ง</h4><ul></ul></div>' +
      '<p class="vts-fine">ทีมงานใช้ข้อมูลที่ส่งมาเพื่อตอบเรื่องนี้เท่านั้น เรื่องที่ปิดแล้วลบอัตโนมัติหลัง 1 ปี · ติดต่อทางอีเมลได้เสมอ</p>' +
      '</div>';
    document.body.appendChild(sheet);
    requestAnimationFrame(function () { sheet && sheet.classList.add('on'); });
    var ta = sheet.querySelector('#vtsMsg');
    ta.addEventListener('input', function () { sheet.querySelector('#vtsCnt').textContent = ta.value.length + '/1000'; });
    sheet.querySelector('.vts-cat').addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return; cat = b.getAttribute('data-c');
      [].forEach.call(this.children, function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
      ta.placeholder = HINT[cat];
    });
    sheet.querySelector('.vts-no').addEventListener('click', function () { close(); });
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
    sheet.querySelector('.vts-go').addEventListener('click', send);
    document.addEventListener('keydown', esc);
    setTimeout(function () { ta.focus(); }, 250);
    loadMine();
  }
  function esc(e) { if (e.key === 'Escape') close(); }
  function close(now) {
    if (!sheet) return; var s = sheet; sheet = null; document.removeEventListener('keydown', esc);
    if (now) { s.remove(); return; }
    s.classList.remove('on'); setTimeout(function () { s.remove(); }, 260);
  }
  function msg(t, ok) { if (!sheet) return; var m = sheet.querySelector('#vtsM'); m.textContent = t || ''; m.className = 'vts-m' + (ok ? ' ok' : ''); }
  function send() {
    if (busy || !sheet) return;
    var text = sheet.querySelector('#vtsMsg').value.trim(), ref = sheet.querySelector('#vtsRef').value.trim().toUpperCase();
    if (text.length < 5) { msg('เล่าปัญหาสั้น ๆ อย่างน้อย 5 ตัวอักษร'); sheet.querySelector('#vtsMsg').focus(); return; }
    if (ref && !/^VC-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/.test(ref)) { msg('รหัสอ้างอิงต้องเป็นแบบ VC-XXXX-XXXX (หรือเว้นว่างไว้)'); return; }
    busy = true; var go = sheet.querySelector('.vts-go'); go.disabled = true; go.textContent = 'กำลังส่ง…'; msg('');
    of('/api/support', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: cat, message: text, ref: ref }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { msg(x.d.error || 'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง'); return; }
        msg('ได้รับเรื่อง #' + x.d.id + ' แล้ว ทีมงานจะตอบกลับทางอีเมลภายใน ' + (x.d.responseDays || 7) + ' วัน', true);
        sheet.querySelector('#vtsMsg').value = ''; sheet.querySelector('#vtsCnt').textContent = '0/1000';
        loadMine();
      })
      .catch(function () { msg('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง'); })
      .then(function () { busy = false; if (sheet) { go.disabled = false; go.textContent = 'ส่งเรื่อง'; } });
  }
  function loadMine() {
    of('/api/support', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!sheet || !d || !d.tickets || !d.tickets.length) return;
      var box = sheet.querySelector('#vtsMy'); box.hidden = false;
      box.querySelector('ul').innerHTML = d.tickets.slice(0, 5).map(function (t) {
        var done = t.status === 'resolved';
        return '<li><span class="vts-st' + (done ? ' done' : '') + '">' + (done ? 'ตอบแล้ว' : 'รอตอบ') + '</span>' +
          '<b>#' + t.id + ' · ' + h(CAT_NAME[t.category] || t.category) + '</b><br>' + h(fmt(t.created_at)) +
          (t.ref ? ' · ' + h(t.ref) : '') +
          (done && (t.admin_note || t.refunded) ? '<span class="ans">' + (t.refunded ? 'คืน ' + t.refunded + ' เครดิตแล้ว · ' : '') + h(t.admin_note || '') + '</span>' : '') + '</li>';
      }).join('');
    }).catch(function () {});
  }

  /* เมนูบัญชี: แถว "แจ้งปัญหา / ขอคืนเครดิต" (วางก่อน "ติดต่อผู้ดูแล") */
  function mountMenu() {
    var nav = document.querySelector('.acct-menu'); if (!nav || document.getElementById('vtMenu')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'menu-item'; b.id = 'vtMenu'; b.setAttribute('data-vt', 'menu');
    b.innerHTML = '<span class="menu-ico" aria-hidden="true"><svg viewBox="0 0 64 64" width="28" height="28" focusable="false"><ellipse cx="32" cy="58.5" rx="17" ry="3" fill="#000" opacity=".3"/><path d="M16 8v48" stroke="url(#vcg-s)" stroke-width="6" stroke-linecap="round"/><path d="M19 10h26l-6 9 6 9H19z" fill="url(#vcg-p)"/><path d="M22 14h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".45"/></svg></span>' +
      '<span class="menu-txt"><b>แจ้งปัญหา / ขอคืนเครดิต</b><small>ตอบกลับภายใน 7 วัน</small></span>';
    var mi = document.createElement('span'); mi.className = 'vc-mi'; mi.innerHTML = ICO.flag.replace(/16/g, '18'); b.insertBefore(mi, b.firstChild);
    var ch = document.createElement('i'); ch.className = 'vc-mchev'; ch.setAttribute('aria-hidden', 'true'); b.appendChild(ch);
    var c = document.getElementById('helpContact');
    nav.insertBefore(b, c || null);
    var dd = document.querySelector('#acctDetail dd:not([id])');
    if (dd && /50/.test(dd.textContent)) dd.textContent = 'เก็บล่าสุดไม่เกิน 50 รายการ · ลบอัตโนมัติเมื่อครบ 90 วัน (ปักหมุดได้ 1 ปี)';
  }

  function init() { mountToggle(); mountMenu(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.VCTrust = { open: open, noSave: noSave };
})();
