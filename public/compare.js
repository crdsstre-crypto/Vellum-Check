/* ===== เทียบสัญญา 2 ฉบับ (Change Monitor) =====
   วางฉบับเดิม + ฉบับใหม่ (หรือเลือกไฟล์) → ระบบจับคู่ทีละข้อ แล้วไฮไลต์ ข้อที่เพิ่ม / ลบ / แก้ไข และตัวเลขที่เปลี่ยน
   คำนวณในเครื่องทั้งหมด ไม่ส่งข้อความไปไหน (ยกเว้นไฟล์ PDF/Word/รูป ที่ต้องแปลงเป็นข้อความผ่าน /api/extract เหมือนช่องตรวจ) */
(function () {
  'use strict';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').replace(/[๐-๙]/g, function (c) { return String(c.charCodeAt(0) - 0x0E50); }).replace(/[ \t ]+/g, ' ').trim(); }
  var CL = /^\s*(?:ข้อ(?:ที่)?\s*\d+|\d+(?:\.\d+)*[.)]\s|มาตรา\s*\d+|[๑-๙]+[.)])/;
  function blocks(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n').map(norm), out = [];
    lines.forEach(function (l) {
      if (!l) { if (out.length) out[out.length - 1].br = true; return; }
      var last = out[out.length - 1];
      if (last && !CL.test(l) && !last.br && CL.test(last.t) && last.t.length < 600) last.t += ' ' + l;
      else out.push({ t: l });
    });
    return out.map(function (b) { var m = /^\s*(ข้อ(?:ที่)?\s*\d+|\d+(?:\.\d+)*)/.exec(b.t); return { t: b.t, no: m ? m[1].replace(/\s+/g, '').replace('ข้อที่', 'ข้อ').replace(/^(\d)/, 'ข้อ $1').replace(/^ข้อ(\d)/, 'ข้อ $1') : '' }; });
  }
  function toks(s) {
    var out = [];
    try { if (window.Intl && Intl.Segmenter) { var it = new Intl.Segmenter('th', { granularity: 'word' }).segment(s)[Symbol.iterator](), r; while (!(r = it.next()).done) out.push(r.value.segment); return out; } } catch (e) {}
    return s.split(/(\s+)/);
  }
  /* LCS ทั่วไป: คืนคู่ index ที่ตรงกัน */
  function lcs(a, b, eq) {
    var n = a.length, m = b.length, i, j;
    if (n * m > 4e6) return [];
    var dp = []; for (i = 0; i <= n; i++) { dp.push(new Uint16Array(m + 1)); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) dp[i][j] = eq(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var pairs = []; i = 0; j = 0;
    while (i < n && j < m) { if (eq(a[i], b[j])) { pairs.push([i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return pairs;
  }
  function sim(a, b) {
    var A = {}, B = {}, x = 0, k;
    toks(a).forEach(function (t) { if (t.trim()) A[t] = 1; }); toks(b).forEach(function (t) { if (t.trim()) B[t] = 1; });
    var na = Object.keys(A).length, nb = Object.keys(B).length; for (k in A) if (B[k]) x++;
    return na + nb ? (2 * x) / (na + nb) : 0;
  }
  function wordDiff(a, b) {
    var A = toks(a), B = toks(b), P = lcs(A, B, function (x, y) { return x === y; }), h = '', i = 0, j = 0, del = '', ins = '', nd = 0, ni = 0, insAll = [];
    function flush() { if (del) { h += '<del>' + esc(del) + '</del>'; nd += del.trim().length; } if (ins) { h += '<ins>' + esc(ins) + '</ins>'; ni += ins.trim().length; insAll.push(ins); } del = ins = ''; }
    P.concat([[A.length, B.length]]).forEach(function (p) {
      while (i < p[0]) del += A[i++]; while (j < p[1]) ins += B[j++];
      if (p[0] < A.length) { if (/^\s+$/.test(A[p[0]]) && (del || ins)) { del += A[p[0]]; ins += B[p[1]]; } else { flush(); h += esc(A[p[0]]); } i++; j++; }
    });
    flush();
    var tot = a.replace(/\s/g, '').length + b.replace(/\s/g, '').length;
    return { h: h, ratio: tot ? (nd + ni) / tot : 0, ins: insAll.join(' ') };
  }
  var NUMRE = /(?:(?:วันที่|ร้อยละ|อัตรา)\s*)?\d[\d,]*(?:\.\d+)?\s*(?:%|บาท|วัน|เดือน|ปี|ชั่วโมง|ครั้ง|หน่วย)?/g;
  function nums(s) { return (norm(s).replace(CL, '').match(NUMRE) || []).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }); }
  /* จับคู่ตัวเลขเดิม↔ใหม่: ที่เหมือนกันข้าม, ที่อยู่ช่วงเดียวกันจับคู่เป็น "เปลี่ยน", ที่เหลือคือ "ตัดออก" / "เพิ่ม" */
  function numDiff(na, nb) {
    var P = lcs(na, nb, function (x, y) { return x === y; }).concat([[na.length, nb.length]]), out = [], i = 0, j = 0;
    P.forEach(function (p) {
      var a = na.slice(i, p[0]), b = nb.slice(j, p[1]), k;
      for (k = 0; k < Math.max(a.length, b.length); k++) out.push(a[k] && b[k] ? { t: 'chg', a: a[k], b: b[k] } : a[k] ? { t: 'cut', a: a[k] } : { t: 'new', b: b[k] });
      i = p[0] + 1; j = p[1] + 1;
    });
    return out.slice(0, 5);
  }
  function numTxt(p) { return p.t === 'cut' ? 'ถูกตัดออก: ' + p.a : p.t === 'new' ? 'ตัวเลขใหม่: ' + p.b : p.a + ' → ' + p.b; }
  var RISK = /ปรับ|ยึด|ไม่คืน|ฝ่ายเดียว|ทุกกรณี|ดอกเบี้ย|อัตโนมัติ|ไม่ต้องแจ้ง|ตามที่เห็นสมควร|สละสิทธิ์|ไม่รับผิดชอบ|ห้าม|ทันที/;

  function compare(oldT, newT) {
    var A = blocks(oldT), B = blocks(newT);
    var P = lcs(A, B, function (x, y) { return x.t === y.t; }), res = [], i = 0, j = 0;
    function region(i0, i1, j0, j1) {
      var olds = A.slice(i0, i1).map(function (b, k) { return { b: b, k: i0 + k, used: false }; }), news = B.slice(j0, j1);
      news.forEach(function (nb) {
        var best = null, bs = 0;
        olds.forEach(function (o) {
          if (o.used) return;
          var s = (nb.no && o.b.no && nb.no === o.b.no) ? 1 + sim(o.b.t, nb.t) : sim(o.b.t, nb.t);
          if (s > bs) { bs = s; best = o; }
        });
        if (best && bs >= 0.35) {
          // ลบข้อเดิมที่อยู่ก่อนคู่นี้ (ตามลำดับ) ก่อน
          olds.forEach(function (o) { if (!o.used && o.k < best.k) { o.used = true; res.push({ k: 'del', a: o.b }); } });
          best.used = true; res.push({ k: 'mod', a: best.b, b: nb });
        } else res.push({ k: 'add', b: nb });
      });
      olds.forEach(function (o) { if (!o.used) res.push({ k: 'del', a: o.b }); });
    }
    P.concat([[A.length, B.length]]).forEach(function (p) {
      region(i, p[0], j, p[1]);
      if (p[0] < A.length) res.push({ k: 'same', a: A[p[0]], b: B[p[1]] });
      i = p[0] + 1; j = p[1] + 1;
    });
    res.forEach(function (r) {
      r.lv = '';
      if (r.k === 'mod') {
        r.d = wordDiff(r.a.t, r.b.t);
        r.num = numDiff(nums(r.a.t), nums(r.b.t));
        var m = RISK.exec(r.d.ins), rg = new RegExp(RISK.source, 'g'), mm;
        if (!m) while ((mm = rg.exec(r.b.t))) if (r.a.t.indexOf(mm[0]) < 0) { m = mm; break; }
        if (m) { r.lv = 'risk'; r.hit = 'เพิ่มคำว่า "' + m[0] + '" เข้ามา'; }
        else if (r.num.length && (m = /ค่าปรับ|ดอกเบี้ย|ปรับ/.exec(r.b.t))) { r.lv = 'risk'; r.hit = (m[0] === 'ปรับ' ? 'ค่าปรับ' : m[0]) + 'เปลี่ยน — เทียบตัวเลขด้านล่าง'; }
        else if (r.num.length) r.lv = 'num';
      } else if (r.k === 'add') { var m2 = RISK.exec(r.b.t); if (m2) { r.lv = 'risk'; r.hit = 'ข้อใหม่มีคำว่า "' + m2[0] + '"'; } }
      else if (r.k === 'del') { r.lv = RISK.test(r.a.t) ? 'good' : 'lost'; }
      r.risk = r.lv === 'risk' || r.lv === 'lost';
    });
    return res;
  }

  /* ---------- หน้าตา ---------- */
  var css = '' +
    '.vcp{position:fixed;inset:0;z-index:9995;display:flex;align-items:flex-end;justify-content:center;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif;color:#ececef}' +
    '.vcp[hidden]{display:none}.vcp *{box-sizing:border-box}' +
    '.vcp-bg{position:absolute;inset:0;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);opacity:0;transition:opacity .25s}' +
    '.vcp.in .vcp-bg{opacity:1}' +
    '.vcp-card{position:relative;width:min(980px,100%);height:min(92vh,100%);display:flex;flex-direction:column;border-radius:22px 22px 0 0;background:#131417;border:1px solid rgba(255,255,255,.1);transform:translateY(30px);opacity:0;transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s;overflow:hidden}' +
    '.vcp.in .vcp-card{transform:none;opacity:1}' +
    '@media (min-width:768px){.vcp{align-items:center}.vcp-card{border-radius:22px;height:min(86vh,900px)}}' +
    '.vcp-hd{display:flex;align-items:center;gap:10px;padding:16px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.vcp .vcp-hd{flex-direction:row;background:transparent;border-bottom:1px solid rgba(255,255,255,.07)}.vcp .vcp-hd b{color:#ececef}.vcp .vcp-hd span{font:inherit;color:inherit}' +
    '.vcp .vcp-side{padding:0;min-height:0}.vcp .vcp-tag{display:inline-block;margin-left:0;border-radius:6px;padding:2px 8px;font:700 11px/1.4 Prompt,sans-serif;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}' +
    '.vcp .vcp-ft{margin:0 !important;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07);color:inherit !important}' +
    '.vcp-hd .ic{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:rgba(127,181,255,.14);color:#7fb5ff}' +
    '.vcp svg{max-width:none !important;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vcp-hd .ic svg{width:21px;height:21px}' +
    '.vcp-hd b{display:block;font:700 16.5px/1.3 Prompt,sans-serif}.vcp-hd small{display:block;font:400 12px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcp-x{margin-left:auto;flex:none;width:36px;height:36px;min-height:0 !important;padding:0 !important;border-radius:11px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#ccc;font-size:15px;cursor:pointer}' +
    '.vcp-bd{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:14px 16px 18px}' +
    '.vcp-in{display:grid;gap:12px}@media (min-width:768px){.vcp-in{grid-template-columns:1fr 1fr}}' +
    '.vcp-side{display:flex;flex-direction:column;gap:6px}' +
    '.vcp-side label{display:flex;align-items:center;gap:8px;font:600 13.5px/1.3 Prompt,sans-serif}' +
    '.vcp-side label i{font-style:normal;padding:2px 8px;border-radius:7px;font-size:11.5px}' +
    '.vcp-side.o label i{background:rgba(255,255,255,.08);color:#c9c9cf}.vcp-side.n label i{background:rgba(127,181,255,.16);color:#9cc5ff}' +
    '.vcp-side textarea{width:100%;min-height:180px;resize:vertical;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#0d0e10;color:#ececef;font:400 15px/1.6 Sarabun,Prompt,sans-serif;--ff:Sarabun,Prompt,sans-serif}' +
    '.vcp-side textarea:focus{outline:none;border-color:#7fb5ff}' +
    '.vcp-tools{display:flex;flex-wrap:wrap;gap:6px}' +
    '.vcp-tools button,.vcp-tools label.f{display:inline-flex;align-items:center;gap:5px;min-height:32px !important;padding:0 10px !important;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#c9c9cf;font:500 12px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcp-tools input[type=file]{display:none}' +
    '.vcp-tools small{align-self:center;margin-left:auto;font:400 11.5px/1 Prompt,sans-serif;color:#71717a}' +
    '.vcp-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:50px;margin-top:14px;border:0;border-radius:14px;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;font:700 15px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcp-go svg{width:20px !important;height:20px !important;flex:none}' +
    '.vcp-go:disabled{opacity:.45;cursor:default}' +
    '.vcp-note{margin:10px 2px 0;font:400 11.5px/1.5 Prompt,sans-serif;color:#71717a}' +
    /* ผล */
    '.vcp-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}' +
    '.vcp-s{padding:10px 6px;border-radius:14px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:inherit;font:inherit;min-height:0 !important}' +
    '.vcp-s b{display:block;font:700 22px/1.1 Prompt,sans-serif;color:var(--c)}.vcp-s small{display:block;margin-top:3px;font:500 11.5px/1.2 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcp-s[aria-pressed="true"]{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,transparent)}' +
    '.vcp-alert{display:flex;gap:10px;align-items:flex-start;margin:12px 0 0;padding:11px 12px;border-radius:13px;border:1px solid rgba(245,196,81,.35);background:rgba(245,196,81,.08);font:400 13px/1.5 Prompt,sans-serif;color:#f0dca6}' +
    '.vcp-alert b{color:#f5c451}' +
    '.vcp-alert.ok{border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.07);color:#bff3dc}' +
    '.vcp .vcp-list{display:grid !important;grid-template-columns:minmax(0,1fr) !important;gap:8px;margin-top:12px}' +
    '.vcp-it{padding:11px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);border-left:3px solid var(--c)}' +
    '.vcp-it.lv-risk{box-shadow:0 0 0 1px rgba(242,85,90,.3)}.vcp-it.lv-lost{box-shadow:0 0 0 1px rgba(251,146,60,.28)}' +
    '.vcp-ih{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap}' +
    '.vcp-tag{padding:2px 8px;border-radius:6px;font:700 11px/1.4 Prompt,sans-serif;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}' +
    '.vcp-no{font:600 12px/1.4 Prompt,sans-serif;color:#a1a1aa}' +
    '.vcp-rk{--k:#f5c451;margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:2px 9px 2px 7px;border-radius:99px;font:600 11px/1.4 Prompt,sans-serif;background:color-mix(in srgb,var(--k) 15%,transparent);color:var(--k)}' +
    '.vcp-rk i,.vcp-lvs i{width:7px;height:7px;border-radius:50%;background:var(--k);flex:none}' +
    '.vcp .risk{--k:#ff6b70}.vcp .lost{--k:#fb923c}.vcp .num{--k:#f5c451}.vcp .good{--k:#34d399}' +
    '.vcp-lvs{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.vcp-lvs em{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:99px;font:600 12px/1.4 Prompt,sans-serif;font-style:normal;background:color-mix(in srgb,var(--k) 14%,transparent);color:var(--k)}' +
    '.vcp-alert>span{display:block}' +
    '.vcp-why{margin:8px 0 0;padding:7px 10px;border-radius:10px;background:color-mix(in srgb,var(--k,#fb923c) 9%,transparent);font:400 12.5px/1.5 Prompt,sans-serif;color:#d6d6db}' +
    '.vcp-it.lv-risk .vcp-why{--k:#ff6b70}.vcp-it.lv-lost .vcp-why{--k:#fb923c}' +
    '.vcp-two{display:grid;gap:8px}.vcp-two>div{position:relative;padding:8px 10px 8px 12px;border-radius:11px}' +
    '.vcp-two i{display:inline-block;margin-bottom:2px;font:700 11px/1.4 Prompt,sans-serif;font-style:normal;letter-spacing:.02em}' +
    '.vcp-two .o{background:rgba(242,85,90,.07);border-left:2px solid rgba(255,154,156,.55)}.vcp-two .o i{color:#ff9a9c}.vcp-two .o .vcp-tx{color:#c9a9aa}' +
    '.vcp-two .n{background:rgba(52,211,153,.07);border-left:2px solid rgba(110,231,183,.6)}.vcp-two .n i{color:#6ee7b7}.vcp-two .n .vcp-tx{color:#e4f7ee}' +
    '.vcp-tx{margin:0;font:400 14.5px/1.75 Sarabun,Prompt,sans-serif;--ff:Sarabun,Prompt,sans-serif;color:#dcdce0;white-space:pre-wrap;overflow-wrap:anywhere}' +
    '.vcp-tx del{color:#ff9a9c;background:rgba(242,85,90,.16);text-decoration:line-through;text-decoration-color:rgba(255,154,156,.7);border-radius:3px}' +
    '.vcp-tx ins{color:#a7f3d0;background:rgba(52,211,153,.18);text-decoration:none;border-radius:3px}' +
    '.vcp-it.del .vcp-tx{color:#c9a3a4;text-decoration:line-through;text-decoration-color:rgba(255,154,156,.5)}' +
    '.vcp-it.add .vcp-tx{color:#c9f2df}' +
    '.vcp-it.same{opacity:.55}.vcp-it.same .vcp-tx{font-size:13.5px;color:#a1a1aa}' +
    '.vcp-num{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}' +
    '.vcp-num span{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:8px;background:rgba(245,196,81,.12);color:#f5d27a;font:600 12px/1.4 Prompt,sans-serif}' +
    '.vcp-num span.cut{background:rgba(251,146,60,.13);color:#fdba74}.vcp-num span.new{background:rgba(52,211,153,.12);color:#86efac}' +
    '.vcp-num s{color:#ff9a9c;text-decoration-color:rgba(255,154,156,.7)}.vcp-num b{color:#a1a1aa;font-weight:500}' +
    '.vcp-ft{display:flex;gap:8px;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07)}' +
    '.vcp-ft button{flex:1;padding:0 8px;min-height:46px;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;font:600 13.5px/1.2 Prompt,sans-serif;cursor:pointer}' +
    '@media (max-width:420px){.vcp-ft button{font-size:12.5px}}' +
    '.vcp-ft .p{background:linear-gradient(135deg,#ffe28a,#f2b81c);border:0;color:#1a1305}' +
    '.vcp-ft[hidden]{display:none}' +
    '.vcp-empty{padding:14px;border-radius:12px;background:rgba(255,255,255,.03);font:400 13px/1.5 Prompt,sans-serif;color:#9a9aa3;text-align:center}' +
    '.vcp-entry{display:inline-flex;align-items:center;gap:6px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ICO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="7.5" height="16" rx="2"/><rect x="13.5" y="4" width="7.5" height="16" rx="2"/><path d="M5.5 9h2.5M5.5 12.5h2.5M16 9h2.5M16 12.5h2.5M16 16h2.5"/></svg>';
  var C = { add: '#34d399', del: '#f2555a', mod: '#f5c451', same: '#71717a' }, LB = { add: 'เพิ่มใหม่', del: 'ถูกลบ', mod: 'แก้ไข', same: 'เหมือนเดิม' };
  var el = null, state = { res: null, f: 'chg' };

  function say(m) { if (typeof toast === 'function') toast(m); }
  function readFile(file, ta) {
    if (!file) return;
    if (/\.txt$/i.test(file.name)) { var r = new FileReader(); r.onload = function () { ta.value = String(r.result || ''); upd(); }; r.readAsText(file); return; }
    var fr = new FileReader();
    fr.onload = function () {
      ta.value = ''; ta.placeholder = 'กำลังอ่านไฟล์…'; upd();
      fetch('/api/extract', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, data: String(fr.result).split(',')[1] || '' }) })
        .then(function (x) { return x.json().then(function (d) { return { ok: x.ok, d: d }; }); })
        .then(function (r) { ta.placeholder = 'วางข้อความสัญญา'; if (r.ok && r.d.text) { ta.value = r.d.text; upd(); } else say((r.d && r.d.error) || 'อ่านไฟล์ไม่สำเร็จ'); }, function () { ta.placeholder = 'วางข้อความสัญญา'; say('อ่านไฟล์ไม่สำเร็จ'); });
    };
    fr.readAsDataURL(file);
  }
  function side(cls, tag, title, hint) {
    return '<div class="vcp-side ' + cls + '"><label for="vcp-' + cls + '"><i>' + tag + '</i>' + title + '</label>' +
      '<textarea id="vcp-' + cls + '" placeholder="วางข้อความสัญญา' + hint + '" spellcheck="false"></textarea>' +
      '<div class="vcp-tools">' + (cls === 'o' ? '<button type="button" data-fill>ใช้ข้อความในช่องตรวจ</button>' : '') +
      '<label class="f">เลือกไฟล์<input type="file" accept=".txt,.pdf,.docx,image/*"></label><button type="button" data-clr>ล้าง</button><small></small></div></div>';
  }
  function build() {
    el = document.createElement('div'); el.className = 'vcp'; el.hidden = true; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'เทียบสัญญา 2 ฉบับ');
    el.innerHTML = '<div class="vcp-bg" data-x></div><div class="vcp-card"><div class="vcp-hd"><span class="ic">' + ICO + '</span><div><b>เทียบสัญญา 2 ฉบับ</b><small>ดูว่าอีกฝ่ายแก้ เพิ่ม หรือลบข้อไหน</small></div><button type="button" class="vcp-x" data-x aria-label="ปิด">✕</button></div>' +
      '<div class="vcp-bd"></div><div class="vcp-ft" hidden><button type="button" data-back>← แก้ข้อความ</button><button type="button" data-copy>คัดลอกสรุป</button><button type="button" class="p" data-check>ตรวจฉบับใหม่ด้วย AI</button></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) return close();
      if (e.target.closest('[data-back]')) return input();
      if (e.target.closest('[data-copy]')) return copySum();
      if (e.target.closest('[data-check]')) return checkNew();
      if (e.target.closest('.vcp-go')) return run();
      var s = e.target.closest('.vcp-s'); if (s) { state.f = s.getAttribute('data-f'); list(); return; }
      var fl = e.target.closest('[data-fill]'); if (fl) { var src = document.getElementById('input'); var ta = el.querySelector('#vcp-o'); if (src && src.value.trim()) { ta.value = src.value; upd(); } else say('ช่องตรวจยังไม่มีข้อความ'); return; }
      var cl = e.target.closest('[data-clr]'); if (cl) { cl.closest('.vcp-side').querySelector('textarea').value = ''; upd(); }
    });
    el.addEventListener('change', function (e) { if (e.target.type === 'file') { readFile(e.target.files[0], e.target.closest('.vcp-side').querySelector('textarea')); e.target.value = ''; } });
    el.addEventListener('input', upd);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !el.hidden) close(); });
  }
  var saved = { o: '', n: '' };
  function input() {
    var bd = el.querySelector('.vcp-bd');
    bd.innerHTML = '<div class="vcp-in">' + side('o', 'ฉบับเดิม', 'ฉบับที่คุณมีอยู่', ' ฉบับเดิม') + side('n', 'ฉบับใหม่', 'ฉบับที่อีกฝ่ายแก้มา', ' ฉบับใหม่') + '</div>' +
      '<button type="button" class="vcp-go" disabled>' + ICO + 'เทียบเลย</button><p class="vcp-note">เทียบในเครื่องของคุณ ไม่ใช้เครดิต และไม่ส่งข้อความไปที่ไหน · ไฟล์ PDF/Word/รูปต้องเข้าสู่ระบบเพื่ออ่านข้อความเหมือนช่องตรวจ</p>';
    bd.querySelector('#vcp-o').value = saved.o; bd.querySelector('#vcp-n').value = saved.n;
    el.querySelector('.vcp-ft').hidden = true; upd(); bd.scrollTop = 0;
  }
  function upd() {
    if (!el) return; var o = el.querySelector('#vcp-o'), n = el.querySelector('#vcp-n'), go = el.querySelector('.vcp-go'); if (!o || !n) return;
    saved.o = o.value; saved.n = n.value;
    [o, n].forEach(function (t) { var s = t.closest('.vcp-side').querySelector('small'); s.textContent = t.value.trim() ? t.value.trim().length.toLocaleString() + ' ตัวอักษร' : ''; });
    go.disabled = !(o.value.trim() && n.value.trim());
  }
  function run() {
    var o = saved.o, n = saved.n; if (!o.trim() || !n.trim()) return;
    state.res = compare(o, n); state.f = 'chg'; result();
  }
  function counts() { var c = { add: 0, del: 0, mod: 0, same: 0, risk: 0, lost: 0, num: 0, good: 0 }; state.res.forEach(function (r) { c[r.k]++; if (r.lv) c[r.lv]++; }); return c; }
  var LV = { risk: ['เสี่ยง', 'มีคำที่มักทำให้เสียเปรียบ'], lost: ['เสียสิทธิ์ที่เคยมี?', 'ข้อนี้หายไปจากฉบับใหม่'], num: ['ตัวเลขเปลี่ยน', ''], good: ['อาจเป็นผลดี', 'ตัดเงื่อนไขที่เคยเข้มออก'] };
  var ORD = { risk: 0, lost: 1, num: 2, '': 3, good: 4 };
  function badge(lv) { return lv ? '<span class="vcp-rk ' + lv + '"><i></i>' + LV[lv][0] + '</span>' : ''; }
  function result() {
    var c = counts(), bd = el.querySelector('.vcp-bd'), chg = c.add + c.del + c.mod;
    bd.innerHTML = '<div class="vcp-sum">' + [['chg', 'เปลี่ยนทั้งหมด', chg, '#7fb5ff'], ['mod', 'แก้ไข', c.mod, C.mod], ['add', 'เพิ่มใหม่', c.add, C.add], ['del', 'ถูกลบ', c.del, C.del]].map(function (x) {
        return '<button type="button" class="vcp-s" data-f="' + x[0] + '" style="--c:' + x[3] + '"><b>' + x[2] + '</b><small>' + x[1] + '</small></button>';
      }).join('') + '</div>' +
      (!chg ? '<div class="vcp-alert ok">✓ ไม่พบความแตกต่าง ข้อความทั้งสองฉบับเหมือนกันทุกข้อ</div>'
        : (c.risk || c.lost || c.num) ? '<div class="vcp-alert">⚠️ <span><b>อ่านข้อเหล่านี้ก่อนเซ็น</b><span class="vcp-lvs">' +
            (c.risk ? '<em class="risk"><i></i>' + c.risk + ' ข้อเสี่ยง</em>' : '') + (c.lost ? '<em class="lost"><i></i>' + c.lost + ' ข้อถูกลบ อาจเสียสิทธิ์</em>' : '') + (c.num ? '<em class="num"><i></i>' + c.num + ' ข้อตัวเลขเปลี่ยน</em>' : '') +
            '</span>ข้อที่ "เสี่ยง" มีคำอย่าง ไม่ต้องแจ้ง, อัตโนมัติ, ไม่คืน หรือค่าปรับที่เปลี่ยน เรียงไว้ด้านบนแล้ว</span></div>'
        : '<div class="vcp-alert ok">ไม่พบตัวเลขที่เปลี่ยนหรือคำที่มักทำให้เสียเปรียบในส่วนที่แก้ แต่ควรอ่านทุกข้อที่เปลี่ยนอีกครั้ง</div>') +
      '<div class="vcp-list"></div>';
    el.querySelector('.vcp-ft').hidden = false; list(); bd.scrollTop = 0;
  }
  function list() {
    var box = el.querySelector('.vcp-list'); if (!box) return;
    [].forEach.call(el.querySelectorAll('.vcp-s'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === state.f)); });
    var L = state.res.filter(function (r) { return state.f === 'chg' ? r.k !== 'same' : r.k === state.f; });
    L = L.map(function (r, i) { return [r, i]; }).sort(function (a, b) { return (ORD[a[0].lv] - ORD[b[0].lv]) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
    box.innerHTML = L.length ? L.map(function (r) {
      var no = (r.b && r.b.no) || (r.a && r.a.no) || '', tx;
      if (r.k === 'mod' && r.d.ratio > 0.45) tx = '<div class="vcp-two"><div class="o"><i>เดิม</i><p class="vcp-tx">' + esc(r.a.t) + '</p></div><div class="n"><i>ใหม่</i><p class="vcp-tx">' + esc(r.b.t) + '</p></div></div>';
      else tx = '<p class="vcp-tx">' + (r.k === 'mod' ? r.d.h : esc(r.k === 'del' ? r.a.t : r.b.t)) + '</p>';
      var why = r.lv && LV[r.lv][1] ? '<p class="vcp-why">' + esc(r.hit || LV[r.lv][1]) + (r.lv === 'lost' ? ' — ถามอีกฝ่ายว่าทำไมตัดออก และสิทธิ์นี้ยังคุ้มครองคุณอยู่ไหม' : '') + '</p>' : '';
      return '<div class="vcp-it ' + r.k + (r.lv ? ' lv-' + r.lv : '') + '" style="--c:' + C[r.k] + '"><div class="vcp-ih"><span class="vcp-tag">' + LB[r.k] + '</span>' + (no ? '<span class="vcp-no">' + esc(no) + '</span>' : '') + badge(r.lv) + '</div>' +
        tx + (r.lv === 'lost' || r.lv === 'risk' ? why : '') +
        (r.num && r.num.length ? '<div class="vcp-num">' + r.num.map(function (p) {
          return '<span class="' + p.t + '">' + (p.t === 'chg' ? '<s>' + esc(p.a) + '</s><b>→</b>' + esc(p.b) : p.t === 'cut' ? 'ถูกตัดออก: <s>' + esc(p.a) + '</s>' : 'ตัวเลขใหม่: ' + esc(p.b)) + '</span>';
        }).join('') + '</div>' : '') + '</div>';
    }).join('') : '<div class="vcp-empty">ไม่มีรายการในหมวดนี้</div>';
  }
  function copySum() {
    var L = state.res.filter(function (r) { return r.k !== 'same'; });
    var t = 'สรุปการเปลี่ยนแปลงในสัญญาฉบับใหม่ (' + L.length + ' จุด)\n\n' + L.map(function (r, i) {
      var no = (r.b && r.b.no) || (r.a && r.a.no) || '';
      return (i + 1) + ') [' + LB[r.k] + (r.lv ? ' · ' + LV[r.lv][0] : '') + '] ' + (no ? no + ' ' : '') + (r.k === 'mod' ? '\n   เดิม: ' + r.a.t + '\n   ใหม่: ' + r.b.t : (r.k === 'del' ? r.a.t : r.b.t)) + (r.num && r.num.length ? '\n   ตัวเลข: ' + r.num.map(numTxt).join(', ') : '');
    }).join('\n') + '\n\n(เทียบด้วย Vellum Check)';
    var done = function (ok) { say(ok ? 'คัดลอกสรุปแล้ว' : 'คัดลอกไม่ได้'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); }); else done(false);
  }
  function checkNew() {
    var ta = document.getElementById('input'); if (!ta) return;
    ta.value = saved.n; ta.dispatchEvent(new Event('input', { bubbles: true }));
    close();
    setTimeout(function () { var cc = document.getElementById('checkCard'); if (cc) cc.scrollIntoView({ behavior: 'smooth', block: 'start' }); say('ใส่ฉบับใหม่ในช่องตรวจแล้ว กด "ตรวจสัญญา" ได้เลย'); }, 260);
  }
  function open() {
    if (!el) build();
    if (!saved.o) { var src = document.getElementById('input'); if (src && src.value.trim()) saved.o = src.value; }
    if (state.res) result(); else input();
    el.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { el.classList.add('in'); });
  }
  function close() { if (!el) return; el.classList.remove('in'); document.documentElement.style.overflow = ''; setTimeout(function () { el.hidden = true; }, 260); }

  /* ปุ่มเข้า: ข้างปุ่ม "ลองใช้สัญญาตัวอย่าง" */
  function entry() {
    var row = document.querySelector('#checkCard .ta-actions'); if (!row || row.querySelector('.vcp-entry')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'sample-btn vcp-entry'; b.textContent = 'เทียบ 2 ฉบับ';
    b.addEventListener('click', open); row.appendChild(b);
  }
  window.VCCompare = { open: open, compare: compare };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', entry); else entry();
})();
