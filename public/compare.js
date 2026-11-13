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
    '.vcp-side textarea{display:block;width:100%;min-height:270px;resize:vertical;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#0d0e10;color:#ececef;font:400 15px/1.6 Sarabun,Prompt,sans-serif;--ff:Sarabun,Prompt,sans-serif}' +
    '.vcp-side textarea:focus{outline:none;border-color:#7fb5ff}' +
    '.vcp-tools{display:flex;flex-wrap:wrap;gap:6px}' +
    '.vcp-tools button,.vcp-tools label.f{display:inline-flex;align-items:center;gap:5px;min-height:32px !important;padding:0 10px !important;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#c9c9cf;font:500 12px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcp-tools input[type=file]{display:none}' +
    '.vcp-tools small{align-self:center;margin-left:auto;font:400 11.5px/1 Prompt,sans-serif;color:#71717a}' +
    '.vcp-top{display:flex;align-items:center;gap:8px;margin-bottom:12px}' +
    '.vcp-tabs{display:flex;flex:1;gap:4px;padding:4px;border-radius:13px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07)}' +
    '.vcp .vcp-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;min-height:38px !important;padding:0 8px !important;border:0;border-radius:10px;background:transparent;color:#9a9aa3;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer;transition:background .2s,color .2s}' +
    '.vcp .vcp-tabs button[aria-selected="true"]{background:#24262c;color:#fff;box-shadow:0 2px 8px -2px rgba(0,0,0,.6)}' +
    '.vcp-tabs i{width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25);display:grid;place-items:center;font:700 10px/1 Prompt,sans-serif;font-style:normal;transition:all .25s}' +
    '.vcp-tabs .ok i{border-color:#34d399;background:#34d399;color:#06281b}.vcp-tabs .ok i::before{content:"✓"}' +
    '.vcp .vcp-demo{flex:none;min-height:46px !important;padding:0 12px !important;border-radius:12px;border:1px dashed rgba(245,196,81,.45);background:rgba(245,196,81,.07);color:#f5d27a;font:600 12.5px/1.25 Prompt,sans-serif;cursor:pointer;max-width:42%}' +
    '@media (min-width:768px){.vcp-tabs{display:none}.vcp-top{justify-content:flex-end}.vcp .vcp-demo{max-width:none;min-height:36px !important}}' +
    '@media (max-width:767px){.vcp-in[data-t="o"] .vcp-side.n,.vcp-in[data-t="n"] .vcp-side.o{display:none}.vcp-side label i{display:none}.vcp-side textarea{min-height:46vh}}' +
    '.vcp-side label .vcp-st{margin-left:auto;color:#34d399;font-weight:700}' +
    '.vcp-box{position:relative}' +
    '.vcp-e0{position:absolute;inset:1px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px;border-radius:13px;text-align:center;cursor:text;' +
      'background:radial-gradient(120% 80% at 50% 0%,rgba(127,181,255,.08),transparent 60%),#0d0e10;border:1.5px dashed rgba(127,181,255,.25)}' +
    '.vcp-side.n .vcp-e0{border-color:rgba(127,181,255,.4)}' +
    '.vcp-box.has .vcp-e0,.vcp-box.typing .vcp-e0{display:none}' +
    '.vcp-e0 .d{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:rgba(127,181,255,.12);color:#9cc5ff;margin-bottom:4px;animation:vcpBob 3s ease-in-out infinite}' +
    '.vcp-e0 .d svg{width:26px;height:26px}@keyframes vcpBob{50%{transform:translateY(-4px)}}' +
    '.vcp-e0 b{font:700 15px/1.3 Prompt,sans-serif;color:#ececef}.vcp-e0 small{font:400 12px/1.4 Prompt,sans-serif;color:#8a8a93}' +
    '.vcp-e0 .a{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:8px}' +
    '.vcp .vcp-e0 .a button,.vcp .vcp-e0 .a label{display:inline-flex;align-items:center;gap:6px;min-height:44px !important;padding:0 16px !important;border-radius:12px;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcp .vcp-e0 .pp{border:0;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;box-shadow:0 6px 18px -8px rgba(91,155,255,.8)}' +
    '.vcp .vcp-e0 .a label{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#e4e4e7}.vcp-e0 input[type=file]{display:none}' +
    '.vcp .vcp-e0 .lk{margin-top:4px;min-height:32px !important;padding:0 8px !important;border:0;background:transparent;color:#7fb5ff;font:500 12.5px/1 Prompt,sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
    '.vcp-e0 .lk0{margin-top:6px;font:400 11.5px/1 Prompt,sans-serif;color:#5f5f68}' +
    '.vcp-side:not(.has) .vcp-tools{display:none}' +
    '.vcp-tools small{order:-1;margin-left:0 !important;margin-right:auto;color:#9a9aa3 !important}.vcp-tools small b{color:#34d399}' +
    '.vcp-go{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin-top:14px;border:0;border-radius:14px;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;font:700 15px/1 Prompt,sans-serif;cursor:pointer;overflow:hidden;transition:transform .15s,box-shadow .3s,background .3s}' +
    '.vcp-go .ic{display:inline-flex}' +
    '.vcp-go.ready{box-shadow:0 0 0 1px rgba(156,197,255,.5),0 10px 30px -8px rgba(91,155,255,.85);animation:vcpRdy .5s cubic-bezier(.3,1.6,.5,1)}' +
    '.vcp-go.ready::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.45) 50%,transparent 65%);transform:translateX(-100%);animation:vcpShine 2.6s ease-in-out .4s infinite}' +
    '.vcp-go.ready:active{transform:scale(.97)}' +
    '@keyframes vcpRdy{0%{transform:scale(.96)}60%{transform:scale(1.03)}100%{transform:none}}@keyframes vcpShine{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}' +
    '.vcp-scan{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(19,20,23,.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}' +
    '.vcp-scan.in{opacity:1}.vcp-scan b{font:600 14px/1 Prompt,sans-serif;color:#cfe2ff}' +
    '.vcp-scan .pp{position:relative;width:130px;height:120px}' +
    '.vcp-scan .pg{position:absolute;top:0;width:76px;height:100px;padding:14px 10px;border-radius:9px;background:#f3ecdc;box-shadow:0 10px 24px -8px rgba(0,0,0,.7);display:flex;flex-direction:column;gap:8px}' +
    '.vcp-scan .pg i{height:5px;border-radius:3px;background:#cfc5ae}.vcp-scan .pg i:nth-child(2n){width:70%}' +
    '.vcp-scan .pg.a{left:0;transform:rotate(-8deg);animation:vcpPa 1.1s cubic-bezier(.5,0,.3,1) forwards}' +
    '.vcp-scan .pg.b{right:0;background:#e3eeff;transform:rotate(8deg);animation:vcpPb 1.1s cubic-bezier(.5,0,.3,1) forwards}.vcp-scan .pg.b i{background:#b8cdf0}' +
    '.vcp-scan .pg.b i:nth-child(3){background:#f5c451}.vcp-scan .pg.b i:nth-child(5){background:#ff8a8e}' +
    '@keyframes vcpPa{to{left:27px;transform:rotate(-3deg)}}@keyframes vcpPb{to{right:27px;transform:rotate(3deg)}}' +
    '.vcp-scan .ln{position:absolute;left:10px;right:10px;top:0;height:3px;border-radius:2px;background:#7fb5ff;box-shadow:0 0 14px 3px rgba(127,181,255,.8);animation:vcpLn 1.1s ease-in-out .15s infinite alternate}' +
    '@keyframes vcpLn{from{top:4px}to{top:104px}}' +
    '@media (prefers-reduced-motion:reduce){.vcp-go.ready,.vcp-go.ready::after,.vcp-e0 .d{animation:none}}' +
    '.vcp-go svg{width:20px !important;height:20px !important;flex:none}' +
    '.vcp-go:disabled{opacity:1;background:rgba(255,255,255,.06);color:#8a8a93;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);cursor:default}' +
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
    '.vcp-map{margin-top:12px;padding:11px 12px 10px;border-radius:14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07)}' +
    '.vcp-mapt{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}.vcp-mapt span{font:600 12.5px/1.3 Prompt,sans-serif}.vcp-mapt small{margin-left:auto;font:400 11px/1.3 Prompt,sans-serif;color:#71717a}' +
    '.vcp-bar{display:flex;gap:3px;height:22px}' +
    '.vcp .vcp-seg{flex:1 1 0;min-width:4px;min-height:0 !important;height:100%;padding:0 !important;border:0;border-radius:5px;background:var(--c);cursor:pointer;transition:transform .15s,filter .15s;box-shadow:0 0 10px -2px color-mix(in srgb,var(--c) 60%,transparent)}' +
    '.vcp .vcp-seg.s{background:rgba(255,255,255,.09);box-shadow:none;cursor:default}' +
    '.vcp .vcp-seg:not(.s):hover{transform:scaleY(1.25);filter:brightness(1.15)}' +
    '.vcp-leg{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:8px;font:400 11px/1.3 Prompt,sans-serif;color:#9a9aa3}.vcp-leg span{display:inline-flex;align-items:center;gap:5px}' +
    '.vcp-leg i{display:inline-block;width:8px;height:8px;border-radius:2px;background:var(--c)}.vcp-leg i.s{background:rgba(255,255,255,.15)}' +
    '.vcp-it.flash{animation:vcpFl 1.3s ease-out}@keyframes vcpFl{0%,30%{box-shadow:0 0 0 3px #7fb5ff}100%{box-shadow:0 0 0 0 transparent}}' +
    '.vcp-money{margin-top:12px;padding:12px 12px 10px;border-radius:14px;background:linear-gradient(160deg,rgba(245,196,81,.08),rgba(255,255,255,.02));border:1px solid rgba(245,196,81,.2)}' +
    '.vcp-mh{font:700 13.5px/1.3 Prompt,sans-serif;margin-bottom:4px;color:#f5d27a}' +
    '.vcp-mr{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:10px;padding:9px 0;border-top:1px dashed rgba(255,255,255,.08)}.vcp-mh+.vcp-mr{border-top:0}' +
    '.vcp-mr .l b{display:block;font:600 13.5px/1.3 Prompt,sans-serif}.vcp-mr .l small{font:400 11px/1.3 Prompt,sans-serif;color:#71717a}' +
    '.vcp-mr .v{display:flex;align-items:baseline;gap:5px;font:500 13px/1.2 Prompt,sans-serif;white-space:nowrap}.vcp-mr .v s{color:#8a8a93}.vcp-mr .v span{color:#71717a}.vcp-mr .v b{font:700 15px/1.2 Prompt,sans-serif}.vcp-mr .v small{font-size:11px;color:#9a9aa3}' +
    '.vcp-mr em{min-width:50px;text-align:center;padding:3px 8px;border-radius:99px;font:700 12px/1.3 Prompt,sans-serif;font-style:normal}' +
    '.vcp-mr.up .v b,.vcp-mt.up b{color:#ff8a8e}.vcp-mr.up em{background:rgba(242,85,90,.16);color:#ff8a8e}' +
    '.vcp-mr.dn .v b,.vcp-mt.dn b{color:#6ee7b7}.vcp-mr.dn em{background:rgba(52,211,153,.15);color:#6ee7b7}' +
    '.vcp-mt{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px;margin-top:4px;padding:10px 12px;border-radius:11px;background:rgba(0,0,0,.25)}.vcp-mt span{font:500 13px/1.3 Prompt,sans-serif}.vcp-mt b{font:800 19px/1.2 Prompt,sans-serif}.vcp-mt small{flex-basis:100%;font:400 11px/1.4 Prompt,sans-serif;color:#71717a}' +
    '@media (max-width:420px){.vcp-mr{grid-template-columns:minmax(0,1fr) auto;row-gap:4px}.vcp-mr .v{grid-column:1/-1;grid-row:2}.vcp-mr em{grid-column:2;grid-row:1}}' +
    '.vcp-neg{margin-top:12px;border-radius:14px;border:1px solid rgba(127,181,255,.28);background:rgba(127,181,255,.06);overflow:hidden}' +
    '.vcp .vcp-negb{display:flex;align-items:center;gap:11px;width:100%;min-height:0 !important;padding:12px !important;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}' +
    '.vcp-negb>span{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:rgba(127,181,255,.16);font-size:18px}' +
    '.vcp-negb b{display:block;font:700 14px/1.3 Prompt,sans-serif;color:#cfe2ff}.vcp-negb small{display:block;font:400 11.5px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcp-negb em{margin-left:auto;font:400 22px/1 Prompt,sans-serif;font-style:normal;color:#7fb5ff;transition:transform .2s}.vcp-neg.on .vcp-negb em{transform:rotate(90deg)}' +
    '.vcp-negp{padding:0 12px 12px}.vcp-negp[hidden]{display:none}' +
    '.vcp-negp textarea{width:100%;min-height:160px;resize:vertical;padding:11px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:#0d0e10;color:#ececef;font:400 14px/1.65 Sarabun,Prompt,sans-serif}' +
    '.vcp-nega{display:flex;gap:8px;margin-top:8px}.vcp .vcp-nega button{flex:1;min-height:42px !important;border-radius:11px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcp .vcp-nega button.p{border:0;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b}' +
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
  function readFile(file, ta, k) {
    if (!file) return;
    if (/\.txt$/i.test(file.name)) { var r = new FileReader(); r.onload = function () { ta.value = String(r.result || ''); filled(k); }; r.readAsText(file); return; }
    var fr = new FileReader();
    fr.onload = function () {
      ta.value = ''; ta.placeholder = 'กำลังอ่านไฟล์…'; upd();
      fetch('/api/extract', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, data: String(fr.result).split(',')[1] || '' }) })
        .then(function (x) { return x.json().then(function (d) { return { ok: x.ok, d: d }; }); })
        .then(function (r) { ta.placeholder = 'วางข้อความสัญญา'; if (r.ok && r.d.text) { ta.value = r.d.text; filled(k); } else say((r.d && r.d.error) || 'อ่านไฟล์ไม่สำเร็จ'); }, function () { ta.placeholder = 'วางข้อความสัญญา'; say('อ่านไฟล์ไม่สำเร็จ'); });
    };
    fr.readAsDataURL(file);
  }
  var DOC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';
  function side(cls, tag, title, hint) {
    return '<div class="vcp-side ' + cls + '"><label for="vcp-' + cls + '"><i>' + tag + '</i>' + title + '<span class="vcp-st"></span></label>' +
      '<div class="vcp-box"><textarea id="vcp-' + cls + '" placeholder="วางข้อความสัญญา' + hint + '" spellcheck="false"></textarea>' +
      '<div class="vcp-e0" data-focus><span class="d">' + DOC + '</span><b>วางสัญญา' + hint + '</b><small>วางข้อความ หรือเลือกไฟล์ PDF / Word / รูป</small>' +
      '<div class="a"><button type="button" class="pp" data-paste>📋 วางจากคลิปบอร์ด</button><label class="f">📄 เลือกไฟล์<input type="file" accept=".txt,.pdf,.docx,image/*"></label></div>' +
      (cls === 'o' ? '<button type="button" class="lk" data-fill>ใช้ข้อความที่อยู่ในช่องตรวจ</button>' : '<span class="lk0">หรือแตะเพื่อพิมพ์เอง</span>') + '</div></div>' +
      '<div class="vcp-tools"><small></small><label class="f">เปลี่ยนไฟล์<input type="file" accept=".txt,.pdf,.docx,image/*"></label><button type="button" data-clr>ล้าง</button></div></div>';
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
      var sg = e.target.closest('[data-go]'); if (sg) return goTo(+sg.getAttribute('data-go'));
      if (e.target.closest('[data-neg]')) { var pn = el.querySelector('.vcp-negp'), nb = el.querySelector('.vcp-neg'); pn.hidden = !pn.hidden; nb.classList.toggle('on', !pn.hidden); if (!pn.hidden) { var ta2 = pn.querySelector('textarea'); ta2.style.height = 'auto'; ta2.style.height = Math.min(ta2.scrollHeight + 4, 420) + 'px'; } return; }
      if (e.target.closest('[data-ncopy]')) { var tx2 = el.querySelector('.vcp-negp textarea').value; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tx2).then(function () { say('คัดลอกข้อความต่อรองแล้ว'); }, function () { say('คัดลอกไม่ได้'); }); else say('คัดลอกไม่ได้'); return; }
      if (e.target.closest('[data-nshare]')) { navigator.share({ text: el.querySelector('.vcp-negp textarea').value }).catch(function () {}); return; }
      var s = e.target.closest('.vcp-s'); if (s) { state.f = s.getAttribute('data-f'); list(); return; }
      var tb = e.target.closest('[data-tab]'); if (tb) { setTab(tb.getAttribute('data-tab')); return; }
      if (e.target.closest('[data-vdemo]')) { el.querySelector('#vcp-o').value = SAMPLE_O; el.querySelector('#vcp-n').value = SAMPLE_N; tab = 'n'; upd(); say('ใส่สัญญาเช่าตัวอย่าง (ข้อมูลสมมติ) แล้ว กด "เทียบเลย" ได้เลย'); var g = el.querySelector('.vcp-go'); g && g.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      var ps = e.target.closest('[data-paste]'); if (ps) { paste(ps.closest('.vcp-side').classList.contains('o') ? 'o' : 'n'); return; }
      var fl = e.target.closest('[data-fill]'); if (fl) { var src = document.getElementById('input'); var ta = el.querySelector('#vcp-o'); if (src && src.value.trim()) { ta.value = src.value; filled('o'); } else say('ช่องตรวจยังไม่มีข้อความ'); return; }
      var cl = e.target.closest('[data-clr]'); if (cl) { cl.closest('.vcp-side').querySelector('textarea').value = ''; upd(); return; }
      var fc = e.target.closest('[data-focus]'); if (fc && !e.target.closest('button,label')) { var bx = fc.closest('.vcp-box'); bx.classList.add('typing'); bx.querySelector('textarea').focus(); }
    });
    el.addEventListener('change', function (e) { if (e.target.type === 'file') { var sd = e.target.closest('.vcp-side'); readFile(e.target.files[0], sd.querySelector('textarea'), sd.classList.contains('o') ? 'o' : 'n'); e.target.value = ''; } });
    el.addEventListener('focusout', function (e) { var bx = e.target.closest && e.target.closest('.vcp-box'); if (bx && e.target.tagName === 'TEXTAREA') setTimeout(function () { bx.classList.remove('typing'); }, 150); });
    el.addEventListener('paste', function (e) { var t = e.target; if (t.id === 'vcp-o') setTimeout(function () { filled('o'); }, 0); });
    el.addEventListener('input', upd);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !el.hidden) close(); });
  }
  var saved = { o: '', n: '' };
  var tab = 'o';
  var SAMPLE_O = 'สัญญาเช่าห้องพัก (ตัวอย่าง)\nข้อ 1 ผู้ให้เช่าตกลงให้ นายตัวอย่าง นามสมมติ เช่าห้องเลขที่ 000 มีกำหนด 1 ปี\nข้อ 2 ค่าเช่าเดือนละ 8,000 บาท ชำระภายในวันที่ 5 ของทุกเดือน\nข้อ 3 หากชำระล่าช้า ผู้เช่าเสียค่าปรับวันละ 100 บาท\nข้อ 4 เงินประกัน 16,000 บาท ผู้ให้เช่าจะคืนภายใน 30 วันหลังย้ายออก โดยหักเฉพาะค่าเสียหายที่เกิดจากผู้เช่า\nข้อ 5 ค่าไฟฟ้าหน่วยละ 7 บาท ค่าน้ำตามจริง\nข้อ 6 ผู้ให้เช่าจะเข้าตรวจห้องได้โดยแจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมง\nข้อ 7 ห้ามนำสัตว์เลี้ยงเข้ามาในห้อง\nข้อ 8 ผู้ให้เช่ารับผิดชอบซ่อมแซมความเสียหายที่เกิดจากการเสื่อมสภาพตามปกติ';
  var SAMPLE_N = 'สัญญาเช่าห้องพัก (ตัวอย่าง)\nข้อ 1 ผู้ให้เช่าตกลงให้ นายตัวอย่าง นามสมมติ เช่าห้องเลขที่ 000 มีกำหนด 1 ปี\nข้อ 2 ค่าเช่าเดือนละ 8,500 บาท ชำระภายในวันที่ 1 ของทุกเดือน\nข้อ 3 หากชำระล่าช้า ผู้เช่าเสียค่าปรับวันละ 300 บาท\nข้อ 4 เงินประกัน 16,000 บาท ผู้ให้เช่ามีสิทธิ์หักได้ตามที่เห็นสมควร และจะคืนส่วนที่เหลือภายใน 60 วัน\nข้อ 5 ค่าไฟฟ้าหน่วยละ 9 บาท ค่าน้ำตามจริง\nข้อ 6 ผู้ให้เช่าเข้าตรวจห้องได้ทุกเวลาโดยไม่ต้องแจ้งล่วงหน้า\nข้อ 7 ห้ามนำสัตว์เลี้ยงเข้ามาในห้อง\nข้อ 9 สัญญานี้ต่ออายุอัตโนมัติคราวละ 1 ปี หากผู้เช่าไม่แจ้งยกเลิกล่วงหน้า 90 วัน\nข้อ 10 ผู้เช่าต้องทำความสะอาดห้องโดยบริษัทที่ผู้ให้เช่ากำหนดก่อนย้ายออก';
  function input() {
    var bd = el.querySelector('.vcp-bd');
    bd.innerHTML = '<div class="vcp-top"><div class="vcp-tabs" role="tablist"><button type="button" role="tab" data-tab="o"><i></i>ฉบับเดิม</button><button type="button" role="tab" data-tab="n"><i></i>ฉบับใหม่</button></div>' +
      '<button type="button" class="vcp-demo" data-vdemo>✨ ลองด้วยสัญญาตัวอย่าง</button></div>' +
      '<div class="vcp-in">' + side('o', 'ฉบับเดิม', 'ฉบับที่คุณมีอยู่', 'ฉบับเดิม') + side('n', 'ฉบับใหม่', 'ฉบับที่อีกฝ่ายแก้มา', 'ฉบับใหม่') + '</div>' +
      '<button type="button" class="vcp-go" disabled><span class="ic">' + ICO + '</span><span class="t">เทียบเลย</span></button><p class="vcp-note">เทียบในเครื่องของคุณ ไม่ใช้เครดิต และไม่ส่งข้อความไปที่ไหน · ไฟล์ PDF/Word/รูปต้องเข้าสู่ระบบเพื่ออ่านข้อความเหมือนช่องตรวจ</p>';
    bd.querySelector('#vcp-o').value = saved.o; bd.querySelector('#vcp-n').value = saved.n;
    tab = saved.o.trim() && !saved.n.trim() ? 'n' : 'o';
    el.querySelector('.vcp-ft').hidden = true; upd(); bd.scrollTop = 0;
  }
  function setTab(t) {
    tab = t; var inn = el.querySelector('.vcp-in'); if (!inn) return;
    inn.setAttribute('data-t', t);
    [].forEach.call(el.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === t)); });
  }
  var lastFill = { o: false, n: false };
  function upd() {
    if (!el) return; var o = el.querySelector('#vcp-o'), n = el.querySelector('#vcp-n'), go = el.querySelector('.vcp-go'); if (!o || !n) return;
    saved.o = o.value; saved.n = n.value;
    [o, n].forEach(function (t) {
      var sd = t.closest('.vcp-side'), k = sd.classList.contains('o') ? 'o' : 'n', v = t.value.trim(), has = !!v;
      sd.querySelector('.vcp-box').classList.toggle('has', has); sd.classList.toggle('has', has);
      var cnt = has ? blocks(v).filter(function (b) { return b.no; }).length : 0;
      sd.querySelector('.vcp-tools small').innerHTML = has ? '<b>✓</b> ' + (cnt ? cnt + ' ข้อ · ' : '') + v.length.toLocaleString() + ' ตัวอักษร' : '';
      sd.querySelector('.vcp-st').textContent = has ? '✓' : '';
      var tb = el.querySelector('[data-tab="' + k + '"]'); if (tb) tb.classList.toggle('ok', has);
      lastFill[k] = has;
    });
    setTab(tab);
    var ok = !!(o.value.trim() && n.value.trim()), miss = (o.value.trim() ? 0 : 1) + (n.value.trim() ? 0 : 1);
    go.disabled = !ok; go.classList.toggle('ready', ok);
    go.querySelector('.t').textContent = ok ? 'เทียบเลย' : miss === 2 ? 'วางสัญญาทั้ง 2 ฉบับก่อน' : 'วางอีก 1 ฉบับ (' + (o.value.trim() ? 'ฉบับใหม่' : 'ฉบับเดิม') + ')';
  }
  /* ถ้าวางฉบับเดิมเสร็จ และฉบับใหม่ยังว่าง → พาไปแท็บฉบับใหม่ */
  function filled(k) {
    upd();
    if (k === 'o' && !saved.n.trim() && window.matchMedia('(max-width:767px)').matches) setTimeout(function () { setTab('n'); }, 350);
  }
  function paste(k) {
    var ta = el.querySelector('#vcp-' + k);
    if (!(navigator.clipboard && navigator.clipboard.readText)) { ta.focus(); say('กดค้างในกล่อง แล้วเลือก "วาง"'); return; }
    navigator.clipboard.readText().then(function (t) {
      if (t && t.trim()) { ta.value = t; filled(k); } else { ta.focus(); say('คลิปบอร์ดยังว่างอยู่ — คัดลอกข้อความสัญญามาก่อน'); }
    }, function () { ta.focus(); say('กดค้างในกล่อง แล้วเลือก "วาง"'); });
  }
  function run() {
    var o = saved.o, n = saved.n; if (!o.trim() || !n.trim()) return;
    var bd = el.querySelector('.vcp-bd'), go = el.querySelector('.vcp-go');
    if (go) go.disabled = true;
    var ov = document.createElement('div'); ov.className = 'vcp-scan';
    ov.innerHTML = '<div class="pp"><div class="pg a"><i></i><i></i><i></i><i></i><i></i></div><div class="pg b"><i></i><i></i><i></i><i></i><i></i></div><div class="ln"></div></div><b>กำลังเทียบทีละข้อ…</b>';
    el.querySelector('.vcp-card').appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('in'); });
    var t0 = Date.now(), res = compare(o, n), wait = Math.max(0, (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1100) - (Date.now() - t0));
    setTimeout(function () {
      state.res = res; state.f = 'chg'; result();
      ov.classList.remove('in'); setTimeout(function () { ov.remove(); }, 300);
    }, wait);
  }
  /* ---------- (3) เงินที่เปลี่ยน ---------- */
  function money(r) {
    var out = [];
    (r.num || []).forEach(function (p) {
      if (p.t !== 'chg' || !/บาท/.test(p.a) || !/บาท/.test(p.b)) return;
      var a = parseFloat(p.a.replace(/[^\d.]/g, '')), b = parseFloat(p.b.replace(/[^\d.]/g, ''));
      if (!(a >= 0) || !(b >= 0) || a === b) return;
      var at = r.b.t.indexOf(p.b.replace(/\s*บาท$/, '')), pre = at > 0 ? r.b.t.slice(Math.max(0, at - 40), at) : '';
      var lb = (/(ค่า[ก-๙]+|เงิน[ก-๙]+)[^ค]*$/.exec(pre) || [])[1] || 'จำนวนเงิน';
      lb = lb.replace(/(เดือนละ|วันละ|ปีละ|ครั้งละ|หน่วยละ|ละ)$/, '');
      var per = /เดือนละ\s*$/.test(pre) ? 'm' : /วันละ\s*$/.test(pre) ? 'd' : /หน่วยละ\s*$/.test(pre) ? 'u' : /ปีละ\s*$/.test(pre) ? 'y' : '';
      out.push({ no: (r.b && r.b.no) || '', lb: lb, a: a, b: b, per: per });
    });
    return out;
  }
  function baht(n) { return Math.round(n).toLocaleString('th-TH'); }
  function moneyCard() {
    var M = []; state.res.forEach(function (r) { if (r.k === 'mod') M = M.concat(money(r)); });
    if (!M.length) return '';
    var yr = 0;
    var rows = M.map(function (m) {
      var d = m.b - m.a, up = d > 0, x = m.a > 0 ? m.b / m.a : 0, unit = { m: '/เดือน', d: '/วัน', u: '/หน่วย', y: '/ปี' }[m.per] || '';
      if (m.per === 'm') yr += d * 12; else if (m.per === 'y') yr += d;
      var big = x >= 1.9 ? '×' + (Math.round(x * 10) / 10) : (up ? '+' : '−') + (m.a > 0 ? Math.round(Math.abs(d) / m.a * 100) + '%' : '');
      return '<div class="vcp-mr ' + (up ? 'up' : 'dn') + '"><div class="l"><b>' + esc(m.lb) + '</b><small>' + esc(m.no) + '</small></div>' +
        '<div class="v"><s>' + baht(m.a) + '</s><span>→</span><b>' + baht(m.b) + '</b><small>บาท' + unit + '</small></div><em>' + big + '</em></div>';
    }).join('');
    var tot = yr ? '<div class="vcp-mt ' + (yr > 0 ? 'up' : 'dn') + '"><span>รวมแล้วคุณจ่าย' + (yr > 0 ? 'เพิ่ม' : 'น้อยลง') + 'ประมาณ</span><b>' + baht(Math.abs(yr)) + ' บาท/ปี</b><small>คิดเฉพาะรายการที่จ่ายรายเดือน/รายปี ยังไม่รวมค่าปรับหรือค่าใช้ตามจริง</small></div>' : '';
    return '<div class="vcp-money"><div class="vcp-mh">💸 เงินที่เปลี่ยน</div>' + rows + tot + '</div>';
  }
  /* ---------- (1) แถบภาพรวมทั้งฉบับ ---------- */
  var LVC = { risk: '#ff6b70', lost: '#fb923c', num: '#f5c451', good: '#34d399' };
  function mapBar() {
    if (state.res.length < 2) return '';
    return '<div class="vcp-map"><div class="vcp-mapt"><span>ภาพรวมทั้งฉบับ</span><small>แตะแถบสีเพื่อไปที่ข้อนั้น</small></div><div class="vcp-bar">' + state.res.map(function (r, i) {
      var c = r.k === 'same' ? '' : (LVC[r.lv] || C[r.k]), no = (r.b && r.b.no) || (r.a && r.a.no) || '';
      return '<button type="button" class="vcp-seg' + (r.k === 'same' ? ' s' : '') + '"' + (c ? ' style="--c:' + c + '"' : ' tabindex="-1"') + ' data-go="' + i + '" title="' + esc(no + ' ' + LB[r.k]) + '" aria-label="' + esc(no + ' ' + LB[r.k]) + '"></button>';
    }).join('') + '</div><div class="vcp-leg"><span><i style="--c:#ff6b70"></i>เสี่ยง</span><span><i style="--c:#fb923c"></i>ถูกลบ</span><span><i style="--c:#f5c451"></i>แก้ไข</span><span><i style="--c:#34d399"></i>เพิ่มใหม่</span><span><i class="s"></i>เหมือนเดิม</span></div></div>';
  }
  function goTo(i) {
    var r = state.res[i]; if (!r || r.k === 'same') return;
    if (state.f !== 'chg' && state.f !== r.k) { state.f = 'chg'; list(); }
    var c = el.querySelector('.vcp-it[data-i="' + i + '"]'); if (!c) return;
    c.scrollIntoView({ behavior: 'smooth', block: 'center' });
    c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash');
  }
  /* ---------- (5) ร่างข้อความต่อรอง ---------- */
  function strip(t) { return String(t).replace(CL, '').trim(); }
  function negText() {
    var L = state.res.filter(function (r) { return r.lv === 'risk' || r.lv === 'lost' || r.lv === 'num'; });
    L.sort(function (a, b) { return ORD[a.lv] - ORD[b.lv]; });
    var n = 0, lines = L.map(function (r) {
      var no = (r.b && r.b.no) || (r.a && r.a.no) || 'ข้อที่เพิ่มใหม่', t;
      if (r.k === 'del') t = no + ' (ฉบับเดิม): ขอให้คงข้อนี้ไว้ตามเดิม คือ "' + strip(r.a.t) + '"';
      else if (r.k === 'add') t = no + ' (เพิ่มใหม่): ขอให้ตัดข้อนี้ออก หรือแก้ให้เป็นธรรมกับทั้งสองฝ่าย';
      else {
        var ch = (r.num || []).map(function (p) { return p.t === 'chg' ? p.a + ' เป็น ' + p.b : p.t === 'cut' ? 'ตัด "' + p.a + '" ออก' : 'เพิ่ม ' + p.b; });
        t = no + ': ' + (r.lv === 'num' ? 'ฉบับใหม่เปลี่ยน ' + ch.join(', ') + ' ขอทราบเหตุผล หรือขอคงไว้ตามเดิม'
          : 'ขอให้คงข้อความเดิม คือ "' + strip(r.a.t) + '"');
      }
      return (++n) + '. ' + t;
    });
    if (!lines.length) return '';
    return 'สวัสดีครับ/ค่ะ\n\nได้อ่านสัญญาฉบับแก้ไขแล้ว ขอปรับบางข้อก่อนเซ็นดังนี้\n\n' + lines.join('\n') + '\n\nหากสะดวก รบกวนส่งฉบับที่ปรับแล้วกลับมาอีกครั้ง ขอบคุณครับ/ค่ะ';
  }
  function negPanel() {
    var t = negText(); if (!t) return '';
    return '<div class="vcp-neg"><button type="button" class="vcp-negb" data-neg><span>✍️</span><div><b>ร่างข้อความต่อรอง</b><small>รวมข้อที่ควรขอแก้ไว้ในข้อความเดียว แก้คำได้ก่อนส่ง</small></div><em>›</em></button>' +
      '<div class="vcp-negp" hidden><textarea spellcheck="false">' + esc(t) + '</textarea><div class="vcp-nega"><button type="button" data-ncopy>คัดลอก</button>' + (navigator.share ? '<button type="button" class="p" data-nshare>ส่งต่อ</button>' : '') + '</div></div></div>';
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
      (chg ? mapBar() + moneyCard() + negPanel() : '') +
      '<div class="vcp-list"></div>';
    el.querySelector('.vcp-ft').hidden = false; list(); bd.scrollTop = 0;
  }
  function list() {
    var box = el.querySelector('.vcp-list'); if (!box) return;
    [].forEach.call(el.querySelectorAll('.vcp-s'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === state.f)); });
    state.res.forEach(function (r, i) { r.i = i; });
    var L = state.res.filter(function (r) { return state.f === 'chg' ? r.k !== 'same' : r.k === state.f; });
    L = L.map(function (r, i) { return [r, i]; }).sort(function (a, b) { return (ORD[a[0].lv] - ORD[b[0].lv]) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
    box.innerHTML = L.length ? L.map(function (r) {
      var no = (r.b && r.b.no) || (r.a && r.a.no) || '', tx;
      if (r.k === 'mod' && r.d.ratio > 0.45) tx = '<div class="vcp-two"><div class="o"><i>เดิม</i><p class="vcp-tx">' + esc(r.a.t) + '</p></div><div class="n"><i>ใหม่</i><p class="vcp-tx">' + esc(r.b.t) + '</p></div></div>';
      else tx = '<p class="vcp-tx">' + (r.k === 'mod' ? r.d.h : esc(r.k === 'del' ? r.a.t : r.b.t)) + '</p>';
      var why = r.lv && LV[r.lv][1] ? '<p class="vcp-why">' + esc(r.hit || LV[r.lv][1]) + (r.lv === 'lost' ? ' — ถามอีกฝ่ายว่าทำไมตัดออก และสิทธิ์นี้ยังคุ้มครองคุณอยู่ไหม' : '') + '</p>' : '';
      return '<div class="vcp-it ' + r.k + (r.lv ? ' lv-' + r.lv : '') + '" data-i="' + r.i + '" style="--c:' + C[r.k] + '"><div class="vcp-ih"><span class="vcp-tag">' + LB[r.k] + '</span>' + (no ? '<span class="vcp-no">' + esc(no) + '</span>' : '') + badge(r.lv) + '</div>' +
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
