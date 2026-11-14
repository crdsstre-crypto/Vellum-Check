/* ===== ติดตามภาระผูกพัน (Obligation Tracker) =====
   การ์ดในผลตรวจ: "สิ่งที่ต้องทำตามสัญญา" ใครต้องทำอะไร เท่าไร เมื่อไร
   - ข้อมูลหลักมาจาก result.obligations (AI ดึงจากสัญญาตอนตรวจ · server/ai.js + cleanObligations ใน server/index.js)
   - ผลตรวจเก่า/ตัวอย่างที่ไม่มี obligations: อ่านจากข้อความสัญญาในเครื่องด้วยกฎตายตัว (ไม่เรียก AI ไม่ส่งข้อความไปไหน)
   - เลือกได้ว่า "คุณคือฝ่ายไหน" → แท็บ ที่คุณต้องทำ / ที่อีกฝ่ายต้องทำให้คุณ
   - ติ๊กว่าทำแล้ว (จำในเครื่องต่อสัญญาหนึ่งฉบับ) · ปุ่ม 🔔 ตั้งเตือน → บันทึกแจ้งเตือน (ล็อกอิน) หรือเพิ่มลงปฏิทิน
   - window.VCObl = { open, list } */
(function () {
  'use strict';
  if (window.VCObl) return;

  var KIND = {
    pay: { ic: '💰', name: 'จ่ายเงิน', c: '#f5c451' },
    deliver: { ic: '📦', name: 'ส่งมอบ / คืน', c: '#7fb5ff' },
    notice: { ic: '📣', name: 'ต้องแจ้งล่วงหน้า', c: '#c4a1ff' },
    do: { ic: '✅', name: 'หน้าที่', c: '#34d399' },
    dont: { ic: '🚫', name: 'ข้อห้าม', c: '#ff7a86' }
  };
  var ORDER = ['pay', 'deliver', 'notice', 'do', 'dont'];
  /* ฝ่ายที่มักเป็น "ผู้อ่าน" (ใช้เดาค่าเริ่มต้นเท่านั้น ผู้ใช้เปลี่ยนได้) */
  var ME = ['ผู้เช่า', 'ผู้เช่าซื้อ', 'ลูกจ้าง', 'พนักงาน', 'ผู้กู้', 'ผู้กู้ยืม', 'ผู้ซื้อ', 'ผู้รับจ้าง', 'สมาชิก', 'ผู้รับข้อมูล', 'ผู้ใช้บริการ',
    'tenant', 'lessee', 'employee', 'borrower', 'buyer', 'purchaser', 'contractor', 'member', 'recipient', '租户', '承租人', '员工', '借款人', '买方'];
  /* คู่บทบาทสำหรับการอ่านในเครื่อง */
  var PAIRS = [['ผู้เช่าซื้อ', 'ผู้ให้เช่าซื้อ'], ['ผู้เช่า', 'ผู้ให้เช่า'], ['ลูกจ้าง', 'นายจ้าง'], ['ผู้รับจ้าง', 'ผู้ว่าจ้าง'], ['ผู้ซื้อ', 'ผู้ขาย'],
    ['ผู้กู้', 'ผู้ให้กู้'], ['ผู้รับข้อมูล', 'ผู้เปิดเผยข้อมูล'], ['สมาชิก', 'สถานบริการ'], ['ผู้ใช้บริการ', 'ผู้ให้บริการ']];

  /* ---------- เครื่องมือ ---------- */
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function res() { try { return typeof lastResult !== 'undefined' ? lastResult : null; } catch (e) { return null; } }
  function srcText() { try { return (typeof viewerSrc !== 'undefined' && viewerSrc && viewerSrc.result === lastResult && viewerSrc.text) || ''; } catch (e) { return ''; } }
  function user() { try { return typeof currentUser !== 'undefined' ? currentUser : null; } catch (e) { return null; } }
  function say(m) { if (typeof toast === 'function') toast(m); }
  function call(path, method, body) {
    if (typeof api === 'function') return api(path, method, body);
    return fetch(path, { method: method || 'GET', credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); })
      .catch(function () { return { ok: false, status: 0, data: {} }; });
  }
  function hash(s) { var x = 5381; for (var i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36); }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function normDigits(t) { return String(t || '').replace(/[๐-๙]/g, function (c) { return String(c.charCodeAt(0) - 0x0E50); }); }

  /* ---------- วันที่ ---------- */
  var MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function parseIso(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  /* วันเริ่มสัญญา (ใช้ตัวอ่านวันที่ของ remind-ui.js) — งวดรายเดือนเริ่มนับจากวันเริ่มสัญญา ถ้ายังไม่ถึง */
  var startCache = { r: null, d: null };
  function startDate() {
    var r = res(); if (startCache.r === r) return startCache.d;
    var d = null;
    try { if (window.VCRemind && VCRemind.extract) { var st0 = VCRemind.extract(srcText(), r).filter(function (x) { return x.kind === 'start'; })[0]; if (st0) d = parseIso(st0.dueDate); } } catch (e) {}
    startCache = { r: r, d: d }; return d;
  }
  function nextDue(o) {
    if (o.due_date) return o.due_date;
    if (o.repeat === 'monthly' && o.day_of_month) {
      var t = today(), day = o.day_of_month, sd = startDate();
      if (sd && sd > t) t = sd;
      var on = function (y, m) { return new Date(y, m, Math.min(day, new Date(y, m + 1, 0).getDate())); };
      var c = on(t.getFullYear(), t.getMonth()); if (c < t) c = on(t.getFullYear(), t.getMonth() + 1);
      return iso(c);
    }
    return '';
  }
  function leftTx(s) {
    var d = parseIso(s); if (!d) return '';
    var n = Math.round((d - today()) / 864e5);
    var dt = d.getDate() + ' ' + MON[d.getMonth()];
    return (n < 0 ? 'เลยมา ' + (-n) + ' วัน' : n === 0 ? 'วันนี้' : n === 1 ? 'พรุ่งนี้' : 'อีก ' + n + ' วัน') + ' · ' + dt;
  }

  /* ---------- อ่านภาระผูกพันจากข้อความในเครื่อง (ผลตรวจเก่า/ตัวอย่าง) ---------- */
  var RE_MONEY = /(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*บาท/;
  var RE_WHEN = /(ทุก\s*วันที่\s*\d{1,2}\s*ของ\s*(?:ทุก\s*)?เดือน|(?:ภายใน\s*)?วันที่\s*\d{1,2}\s*ของ\s*(?:ทุก\s*)?เดือน|ภายใน\s*\d{1,3}\s*วัน[^\s,]{0,20}|ล่วงหน้า\s*(?:ไม่น้อยกว่า\s*)?\d{1,3}\s*วัน|ทุก\s*(?:สิ้น)?เดือน|ภายในวันที่\s*\d{1,2}[^\s,]{0,12})/;
  var ROLES = [].concat.apply([], PAIRS).sort(function (a, b) { return b.length - a.length; }).join('|');
  var RE_SUBJ = new RegExp('^(?:' + ROLES + ')\\s*(?:จะ)?(?:ต้อง|มีหน้าที่|ตกลง(?:จะ)?)\\s*');
  var RE_BAN = new RegExp('^ห้าม\\s*(?:' + ROLES + ')\\s*');
  function localExtract(text, result) {
    text = normDigits(text);
    if (!text.trim() && result) text = normDigits((result.items || []).map(function (it) { return it && it.quote || ''; }).join('\n'));
    var pair = null;
    PAIRS.forEach(function (p) { if (!pair && text.indexOf(p[0]) > -1 && text.indexOf(p[1]) > -1) pair = p; });
    if (!pair) PAIRS.forEach(function (p) { if (!pair && (text.indexOf(p[0]) > -1 || text.indexOf(p[1]) > -1)) pair = p; });
    var parts = text.replace(/\s(?=ข้อ\s*\d)/g, '\n').split(/\n|\s{2,}/).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }).filter(function (x) { return x.length > 6; });
    var out = [], seen = {};
    parts.forEach(function (s) {
      if (out.length >= 10) return;
      var kind = /(ห้าม|ต้องไม่|จะไม่|ไม่ยอมให้|ไม่อนุญาต)/.test(s) ? 'dont'
        : /(แจ้ง|บอกกล่าว|บอกเลิก)[^]{0,30}ล่วงหน้า/.test(s) ? 'notice'
        : /(ชำระ|จ่าย|โอนเงิน|ค่าเช่า|ค่าจ้าง|ค่าบริการ|งวด)/.test(s) && RE_MONEY.test(s) ? 'pay'
        : /(ส่งมอบ|ส่งงาน|คืนเงิน|คืนห้อง|คืนทรัพย์|คืนรถ|คืนเงินประกัน)/.test(s) ? 'deliver'
        : /(ต้อง|จะต้อง|ตกลงจะ|มีหน้าที่|ยินยอม)/.test(s) ? 'do' : '';
      if (!kind) return;
      var party = '';
      if (pair) {
        var a = s.indexOf(pair[1]), b = s.indexOf(pair[0]);
        party = a > -1 && (b < 0 || a < b) ? pair[1] : b > -1 ? pair[0] : '';
        if (!party && kind === 'pay') party = pair[0];
      }
      var what = s.replace(/^ข้อ\s*\d+(\.\d+)*\s*/, '').replace(/^\*\s*/, '')
        .replace(RE_SUBJ, '').replace(RE_BAN, 'ห้าม');
      if (what.length > 70) what = what.slice(0, 68) + '…';
      var key = kind + '|' + what.slice(0, 24); if (seen[key]) return; seen[key] = 1;
      var mm = RE_MONEY.exec(s), wh = RE_WHEN.exec(s), dom = /วันที่\s*(\d{1,2})\s*ของ\s*(?:ทุก\s*)?เดือน/.exec(s);
      out.push({ party: party, kind: kind, what: what, amount: mm ? mm[0].replace(/\s+/g, ' ') : '', when: wh ? wh[0].replace(/\s+/g, ' ') : '',
        repeat: dom || /ทุก\s*(?:สิ้น)?เดือน|เดือนละ/.test(s) ? 'monthly' : 'none', due_date: '', day_of_month: dom ? +dom[1] : 0, quote: s.slice(0, 200), local: true });
    });
    out.sort(function (x, y) { return ORDER.indexOf(x.kind) - ORDER.indexOf(y.kind); });
    return { parties: pair ? pair.slice() : [], obligations: out };
  }
  function getData(r) {
    if (r && Array.isArray(r.obligations) && r.obligations.length) return { parties: (r.parties || []).slice(), obligations: r.obligations, ai: true };
    var d = localExtract(srcText(), r); d.ai = false; return d;
  }

  /* ---------- สถานะในเครื่อง ---------- */
  function sigOf(d) { return hash(d.obligations.map(function (o) { return o.kind + o.what + o.party; }).join('|')); }
  function defaultMe(parties) {
    for (var i = 0; i < ME.length; i++) for (var j = 0; j < parties.length; j++) if (parties[j].toLowerCase().indexOf(ME[i].toLowerCase()) === 0) return parties[j];
    return parties[0] || '';
  }

  /* ---------- CSS ---------- */
  var CSS =
    '.vob{position:relative;margin:18px 0;padding:18px 16px 14px;border-radius:20px;background:linear-gradient(160deg,rgba(245,196,81,.07),rgba(24,24,28,.92) 45%);border:1px solid rgba(255,255,255,.09);' +
      'font-family:Prompt,Sarabun,system-ui,sans-serif;color:#ededef;box-shadow:0 18px 40px -26px rgba(0,0,0,.9)}' +
    '.vob *{box-sizing:border-box}' +
    '.vob-hd{display:flex;gap:12px;align-items:flex-start}' +
    '.vob-ic{flex:none;width:42px;height:42px;border-radius:13px;display:grid;place-items:center;font-size:21px;background:linear-gradient(145deg,rgba(245,196,81,.22),rgba(245,196,81,.06));border:1px solid rgba(245,196,81,.3)}' +
    '.vob-hd h4{margin:2px 0 3px;font:700 16.5px/1.25 Prompt,sans-serif;color:#fff}.vob-hd p{margin:0;font:400 12.5px/1.5 Prompt,sans-serif;color:#a3a3aa}' +
    '.vob-ring{flex:none;margin-left:auto;width:50px;height:50px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#34d399 calc(var(--p,0) * 1%),rgba(255,255,255,.1) 0);transition:--p .4s}' +
    '.vob-ring b{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#18181c;font:700 11.5px/1 Prompt,sans-serif;color:#d9f7ea}' +
    '.vob-me{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:14px 0 0;font:500 12.5px/1 Prompt,sans-serif;color:#a3a3aa}' +
    '.vob-me button{appearance:none;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#d8d8de;border-radius:99px;padding:7px 12px;font:600 12.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vob-me button[aria-pressed=true]{background:#f5c451;border-color:#f5c451;color:#231a05}' +
    '.vob-next{display:flex;align-items:center;gap:10px;margin:12px 0 0;padding:10px 12px;border-radius:14px;background:rgba(245,196,81,.08);border:1px dashed rgba(245,196,81,.35);font:500 12.5px/1.4 Prompt,sans-serif;color:#f6e3b0}' +
    '.vob-next b{color:#fff;font-weight:700}' +
    '.vob-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:14px 0 10px;padding:4px;border-radius:14px;background:rgba(0,0,0,.28)}' +
    '.vob-tabs button{appearance:none;border:0;border-radius:11px;padding:10px 6px;background:none;color:#a3a3aa;font:600 13px/1.2 Prompt,sans-serif;cursor:pointer}' +
    '.vob-tabs button[aria-selected=true]{background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}' +
    '.vob-tabs em{font-style:normal;margin-left:4px;padding:1px 7px;border-radius:99px;background:rgba(255,255,255,.1);font-size:11px}' +
    '.vob-g{margin:12px 0 6px;font:700 11.5px/1 Prompt,sans-serif;letter-spacing:.06em;color:#8a8a92}' +
    '.vob-it{position:relative;display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:start;margin:0 0 8px;padding:12px 12px 12px 10px;border-radius:14px;' +
      'background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);transition:opacity .3s,background .3s}' +
    '.vob-it::before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:3px;border-radius:0 3px 3px 0;background:var(--c)}' +
    '.vob-it.is-done{opacity:.55}.vob-it.is-done .vob-w{text-decoration:line-through;text-decoration-color:rgba(255,255,255,.4)}' +
    '.vob-tk{appearance:none;width:26px;height:26px;margin:1px 0 0 2px;border-radius:9px;border:1.5px solid rgba(255,255,255,.28);background:none;cursor:pointer;display:grid;place-items:center;padding:0}' +
    '.vob-tk::after{content:"";width:11px;height:6px;border:solid #0d2a1f;border-width:0 0 2.5px 2.5px;transform:rotate(-45deg) translate(1px,-1px);opacity:0}' +
    '.vob-it.is-done .vob-tk{background:#34d399;border-color:#34d399}.vob-it.is-done .vob-tk::after{opacity:1}' +
    '.vob-it.k-dont .vob-tk{border-radius:50%;border-color:rgba(255,122,134,.5)}.vob-it.k-dont.is-done .vob-tk{background:#ff7a86;border-color:#ff7a86}' +
    '.vob-w{display:block;font:600 14px/1.4 Prompt,sans-serif;color:#f4f4f6;word-break:break-word}' +
    '.vob-ch{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}' +
    '.vob-ch span{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font:600 11px/1.3 Prompt,sans-serif;background:rgba(255,255,255,.07);color:#cfcfd6}' +
    '.vob-ch .m{background:rgba(245,196,81,.15);color:#f8d27a}.vob-ch .t{background:rgba(127,181,255,.13);color:#a9cbff}.vob-ch .r{background:rgba(52,211,153,.13);color:#8ee6c1}' +
    '.vob-ch .d{background:rgba(255,122,134,.13);color:#ffaab3}' +
    '.vob-q{appearance:none;border:0;background:none;padding:0;margin-top:6px;color:#8a8a92;font:500 11.5px/1.4 Prompt,sans-serif;cursor:pointer}' +
    '.vob-qt{display:block;margin-top:6px;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,.3);border-left:2px solid var(--c);font:400 12px/1.6 Sarabun,Prompt,sans-serif;color:#c9c9d0}' +
    '.vob-bell{appearance:none;flex:none;width:34px;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#f6dfa6;font-size:15px;cursor:pointer;display:grid;place-items:center}' +
    '.vob-bell:disabled{opacity:.25;cursor:default}.vob-bell.is-set{background:rgba(245,196,81,.18);border-color:rgba(245,196,81,.5)}' +
    '.vob-empty{margin:6px 0 4px;padding:14px;border-radius:14px;background:rgba(255,255,255,.03);text-align:center;font:400 13px/1.6 Prompt,sans-serif;color:#a3a3aa}' +
    '.vob-ft{margin:10px 2px 0;font:400 11px/1.6 Prompt,sans-serif;color:#7a7a82}' +
    '.vob.vob-flash{animation:vobFl 1.4s ease}@keyframes vobFl{25%{box-shadow:0 0 0 3px rgba(245,196,81,.5),0 18px 40px -26px rgba(0,0,0,.9)}}' +
    /* กันสไตล์ปุ่มทั่วไปของ art.css ทับ */
    'html body #result .vob button{min-height:0 !important;min-width:0 !important;box-shadow:none;text-transform:none;letter-spacing:normal;margin:0}' +
    'html body #result .vob button.vob-tk{width:26px !important;height:26px !important;padding:0 !important;margin:1px 0 0 2px !important}' +
    'html body #result .vob button.vob-bell{width:34px !important;height:34px !important;padding:0 !important;font-size:15px !important;line-height:1 !important}' +
    'html body #result .vob button.vob-q{padding:0 !important;margin-top:6px !important;background:none !important;border:0 !important;width:auto !important}' +
    'html body #result .vob .vob-me button{padding:7px 12px !important;width:auto !important}' +
    'html body #result .vob .vob-tabs button{padding:10px 6px !important;width:auto !important}' +
    '@media (prefers-reduced-motion:reduce){.vob.vob-flash{animation:none}}';

  /* ---------- การ์ด ---------- */
  var card = null, st = null;
  function rowHtml(o, i) {
    var k = KIND[o.kind] || KIND.do, due = nextDue(o), done = !!st.done[i], dont = o.kind === 'dont';
    var chips = (o.amount ? '<span class="m">' + h(o.amount) + '</span>' : '') + (o.when ? '<span class="t">⏱ ' + h(o.when) + '</span>' : '') +
      (o.repeat === 'monthly' ? '<span class="r">ทุกเดือน</span>' : o.repeat === 'yearly' ? '<span class="r">ทุกปี</span>' : '') +
      (due ? '<span class="d">' + h(leftTx(due)) + '</span>' : '');
    return '<div class="vob-it k-' + o.kind + (done ? ' is-done' : '') + '" style="--c:' + k.c + '" data-i="' + i + '">' +
      '<button type="button" class="vob-tk" aria-pressed="' + done + '" aria-label="' + (dont ? 'รับทราบแล้ว' : 'ทำแล้ว') + '"></button>' +
      '<div><span class="vob-w">' + h(o.what) + '</span>' + (chips ? '<div class="vob-ch">' + chips + '</div>' : '') +
      (o.quote ? '<button type="button" class="vob-q" aria-expanded="false">ดูข้อความในสัญญา ›</button><span class="vob-qt" hidden>“' + h(o.quote) + '”</span>' : '') + '</div>' +
      (dont ? '<span></span>' : '<button type="button" class="vob-bell' + (st.bell[i] ? ' is-set' : '') + '" ' + (due ? '' : 'disabled ') + 'aria-label="' + (due ? 'ตั้งเตือน' : 'ไม่มีวันที่แน่นอนในสัญญา') + '" title="' + (due ? 'ตั้งเตือน' : 'ไม่มีวันที่แน่นอนในสัญญา') + '">🔔</button>') +
      '</div>';
  }
  function render() {
    var d = card.__d, me = st.me, list = d.obligations;
    var mine = [], theirs = [];
    list.forEach(function (o, i) { (!o.party || o.party === me ? mine : theirs).push(i); });
    var tab = st.tab === 'them' && theirs.length ? 'them' : 'me';
    if (!mine.length && theirs.length) tab = 'them';
    var idx = tab === 'me' ? mine : theirs;
    var countable = list.map(function (o, i) { return i; }).filter(function (i) { return list[i].kind !== 'dont'; });
    var doneN = countable.filter(function (i) { return st.done[i]; }).length;
    /* รายการถัดไปที่มีวันที่และยังไม่ทำ */
    var next = null;
    mine.forEach(function (i) { var o = list[i], du = nextDue(o); if (du && !st.done[i] && o.kind !== 'dont' && (!next || du < next.du)) next = { o: o, du: du }; });
    var other = d.parties.filter(function (p) { return p !== me; })[0] || 'อีกฝ่าย';
    var groups = ORDER.map(function (k) { return { k: k, ids: idx.filter(function (i) { return list[i].kind === k; }) }; }).filter(function (g) { return g.ids.length; });
    card.innerHTML =
      '<div class="vob-hd"><span class="vob-ic" aria-hidden="true">📋</span><div><h4>สิ่งที่ต้องทำตามสัญญา</h4><p>ใครต้องทำอะไร เท่าไร เมื่อไร ติ๊กเมื่อทำแล้ว แล้วกด 🔔 ให้เตือนก่อนถึงกำหนด</p></div>' +
        (countable.length ? '<span class="vob-ring" style="--p:' + Math.round(doneN / countable.length * 100) + '" role="img" aria-label="ทำแล้ว ' + doneN + ' จาก ' + countable.length + '"><b>' + doneN + '/' + countable.length + '</b></span>' : '') + '</div>' +
      (d.parties.length > 1 ? '<div class="vob-me" role="group" aria-label="คุณคือฝ่ายไหน">คุณคือ' + d.parties.slice(0, 3).map(function (p) {
        return '<button type="button" data-me="' + h(p) + '" aria-pressed="' + (p === me) + '">' + h(p) + '</button>'; }).join('') + '</div>' : '') +
      (next ? '<div class="vob-next">⏰ <span>ถัดไป: <b>' + h(next.o.what) + (next.o.amount ? ' ' + h(next.o.amount) : '') + '</b> · ' + h(leftTx(next.du)) + '</span></div>' : '') +
      (d.parties.length > 1 ? '<div class="vob-tabs" role="tablist"><button type="button" role="tab" data-tab="me" aria-selected="' + (tab === 'me') + '">ที่คุณต้องทำ<em>' + mine.length + '</em></button>' +
        '<button type="button" role="tab" data-tab="them" aria-selected="' + (tab === 'them') + '">' + h(other) + 'ต้องทำ<em>' + theirs.length + '</em></button></div>' : '') +
      (groups.length ? groups.map(function (g) { return '<div class="vob-g">' + KIND[g.k].ic + ' ' + KIND[g.k].name + '</div>' + g.ids.map(function (i) { return rowHtml(list[i], i); }).join(''); }).join('')
        : '<div class="vob-empty">' + (tab === 'me' ? 'ไม่พบสิ่งที่คุณต้องทำในสัญญานี้' : 'ไม่พบสิ่งที่อีกฝ่ายต้องทำ') + '</div>') +
      '<p class="vob-ft">' + (d.ai ? 'AI อ่านจากข้อความในสัญญา' : 'อ่านจากข้อความในเครื่องของคุณอัตโนมัติ') + ' · ตรวจกับสัญญาจริงก่อนใช้ ไม่ใช่คำปรึกษาทางกฎหมาย</p>';
  }
  function persist() { save('vc_ob_' + card.__sig, { me: st.me, tab: st.tab, done: st.done, bell: st.bell }); }
  function bell(i, btn) {
    var o = card.__d.obligations[i], due = nextDue(o); if (!due) return;
    var title = (o.what + (o.amount ? ' ' + o.amount : '')).slice(0, 110);
    var kind = o.kind === 'pay' ? 'pay' : o.kind === 'deliver' ? 'deliver' : o.kind === 'notice' ? 'notice' : 'other';
    var item = { title: title, dueDate: due, kind: kind, repeat: o.repeat === 'monthly' || o.repeat === 'yearly' ? o.repeat : 'none', note: o.when || '' };
    if (user()) {
      btn.disabled = true;
      call('/api/reminders', 'POST', { items: [item] }).then(function (x) {
        btn.disabled = false;
        if (x.ok) { st.bell[i] = 1; persist(); btn.classList.add('is-set'); say('ตั้งเตือนแล้ว · ดูได้ที่ "แจ้งเตือนวันสำคัญ"'); if (window.VCRemind && VCRemind.refresh) VCRemind.refresh(); }
        else say((x.data && x.data.error) || 'ตั้งเตือนไม่สำเร็จ ลองใหม่อีกครั้ง');
      });
    } else if (window.VCRemind && VCRemind._ics) {
      st.bell[i] = 1; persist(); btn.classList.add('is-set'); VCRemind._ics([item]);
    } else say('เข้าสู่ระบบเพื่อบันทึกแจ้งเตือน');
  }
  function bind() {
    card.addEventListener('click', function (e) {
      var t = e.target, it = t.closest('.vob-it'), i = it ? +it.getAttribute('data-i') : -1;
      if (t.closest('[data-me]')) { st.me = t.closest('[data-me]').getAttribute('data-me'); st.tab = 'me'; persist(); render(); return; }
      if (t.closest('[data-tab]')) { st.tab = t.closest('[data-tab]').getAttribute('data-tab'); persist(); render(); return; }
      if (t.closest('.vob-tk')) {
        st.done[i] = st.done[i] ? 0 : 1; persist(); render();
        if (st.done[i] && navigator.vibrate) try { navigator.vibrate(8); } catch (er) {}
        return;
      }
      if (t.closest('.vob-q')) { var q = it.querySelector('.vob-qt'), b = t.closest('.vob-q'); q.hidden = !q.hidden; b.setAttribute('aria-expanded', String(!q.hidden)); b.textContent = q.hidden ? 'ดูข้อความในสัญญา ›' : 'ซ่อนข้อความ ‹'; return; }
      if (t.closest('.vob-bell')) bell(i, t.closest('.vob-bell'));
    });
  }
  function place() {
    pend = false;
    var box = document.getElementById('result'), r = res();
    var rpt = box && box.querySelector('article.rpt');
    if (!rpt || !r) { if (card && card.parentNode) card.remove(); return; }
    if (!card || card.__r !== r || !card.isConnected) {
      var d = getData(r);
      if (!d.obligations.length) { if (card && card.parentNode) card.remove(); return; }
      if (!card) { card = document.createElement('section'); card.className = 'vob'; card.id = 'vobCard'; card.setAttribute('aria-label', 'สิ่งที่ต้องทำตามสัญญา'); bind(); }
      card.__r = r; card.__d = d; card.__sig = sigOf(d);
      st = load('vc_ob_' + card.__sig, null) || {};
      st.done = st.done || {}; st.bell = st.bell || {};
      if (!st.me || d.parties.indexOf(st.me) < 0) st.me = defaultMe(d.parties);
      render();
    }
    var anchor = rpt.querySelector('.vrm-card') || rpt.querySelector('.share-bar');
    if (anchor) { if (card.nextElementSibling !== anchor) rpt.insertBefore(card, anchor); }
    else if (card.parentNode !== rpt) rpt.appendChild(card);
  }
  var pend = false;
  function watch() {
    var s = document.createElement('style'); s.id = 'vobCss'; s.textContent = CSS; document.head.appendChild(s);
    var box = document.getElementById('result'); if (!box) return;
    new MutationObserver(function (m) {
      if (m.every(function (x) { return card && (x.target === card || card.contains(x.target)); })) return;
      if (!pend) { pend = true; setTimeout(place, 450); }
    }).observe(box, { childList: true, subtree: true });
    place();
  }
  function open() {
    place();
    if (card && card.isConnected) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card.classList.remove('vob-flash'); void card.offsetWidth; card.classList.add('vob-flash');
      return true;
    }
    return false;
  }
  window.VCObl = { open: open, list: function () { return card ? card.__d : null; }, _local: localExtract };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
