/* ===== ร่างข้อความต่อรอง (negotiate.js) — ใช้ได้ทั้งมือถือและคอม =====
   สร้างจากข้อมูลผลตรวจ (lastResult) ไม่พึ่งหน้าตาการ์ด
   ทางเข้า: ปุ่มในผลตรวจ · แท็บเครื่องมือ · ปุ่มเดิมของมือถือ (window.__vcNeg ถูกแทนที่ด้วยตัวนี้) */
(function () {
  'use strict';
  if (window.VCNeg) return;

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function res() { try { return typeof lastResult !== 'undefined' ? lastResult : null; } catch (e) { return null; } }
  function trimQ(q) { q = String(q || '').replace(/\s+/g, ' ').trim(); return q.length > 150 ? q.slice(0, 150) + '…' : q; }
  var LV = { check_detail: ['ตรวจละเอียด', '#f2555a', 0], caution: ['ควรระวัง', '#f5c451', 1], low: ['ข้อสังเกต', '#8d8d96', 2] };

  /* ดึงรายการที่ขอแก้ได้จากผลตรวจ */
  function collect(onlyStar) {
    var r = res(); if (!r || !Array.isArray(r.items)) return [];
    var fixed = (window.VCHealth && VCHealth.fixedOf) ? VCHealth.fixedOf(r) : {};
    var cards = document.querySelectorAll('#result details.item');
    return r.items.map(function (it, i) {
      var fix = it.suggested_fix || it.how_to_negotiate || '';
      if (!fix || it.missing) return null;
      var star = !!(cards[i] && cards[i].classList.contains('vc-star'));
      var done = !!fixed[i];
      var on = onlyStar ? star : (!done && it.level !== 'low');
      var no = (/^\s*(ข้อ(?:ที่)?\s*[0-9๐-๙]+(?:\.[0-9๐-๙]+)*)/.exec(it.quote || '') || [])[1] || '';
      var head = (no ? no.replace(/\s+/g, ' ') + ' — ' : '') + (it.topic || String(it.title || '').replace(/[?？]\s*$/, ''));
      return { i: i, head: head, lv: LV[it.level] ? it.level : 'low', title: it.title || it.topic || ('ข้อ ' + (i + 1)), quote: it.quote || '', fix: fix, ask: !it.suggested_fix, on: on, done: done, star: star };
    }).filter(Boolean).sort(function (a, b) { return LV[a.lv][2] - LV[b.lv][2] || a.i - b.i; });
  }
  function missing() {
    var m = typeof window.__vcMissAsk === 'function' ? window.__vcMissAsk() : [];
    if (!m.length) { var r = res(); m = (r && Array.isArray(r.missing_info)) ? r.missing_info.map(function (x) { return typeof x === 'string' ? x : (x.item || x.title || ''); }).filter(Boolean) : []; }
    return m.slice(0, 12);
  }

  /* ---------- สร้างข้อความ ---------- */
  var st = { tone: ls('vc_neg_tone') || 'soft', pp: ls('vc_neg_pp') || 'ครับ', to: ls('vc_neg_to') || '' };
  function compose(fx, ms) {
    var P = st.pp, Q = P === 'ครับ' ? 'ครับ' : 'คะ', to = st.to.trim(), L = [];
    var hi = 'สวัสดี' + P + (to ? ' ' + to : '');
    if (st.tone === 'soft') { L.push(hi); L.push('ขอบคุณที่ส่งร่างสัญญามาให้พิจารณานะ' + Q + ' หลังจากอ่านละเอียดแล้ว มีบางข้อที่อยากขอปรับให้ชัดเจนและเป็นธรรมกับทั้งสองฝ่าย ดังนี้' + P); }
    else if (st.tone === 'mid') { L.push(hi); L.push('เรื่องร่างสัญญา มีข้อที่ขอแก้ไขก่อนลงนาม ดังนี้' + P); }
    else { if (to) L.push('ถึง ' + to); L.push('ก่อนลงนาม ขอให้แก้ไขข้อต่อไปนี้' + P); }
    L.push('');
    fx.forEach(function (x, k) {
      if (st.tone === 'direct') { L.push((k + 1) + ') ' + x.head + ' → ' + x.fix); return; }
      L.push((k + 1) + ') ' + x.head);
      if (x.quote) L.push('   ในสัญญาเขียนว่า: “' + trimQ(x.quote) + '”');
      L.push('   ' + (x.ask ? 'ขอสอบถาม/ขอให้ชี้แจง: ' : st.tone === 'soft' ? 'ขอปรับเป็น: ' : 'ขอแก้เป็น: ') + x.fix);
      if (k < fx.length - 1) L.push('');
    });
    if (ms.length) {
      if (fx.length) L.push('');
      L.push(st.tone === 'direct' ? 'และขอให้เพิ่มเรื่องเหล่านี้ในสัญญา:' : 'นอกจากนี้ สัญญายังไม่ได้เขียนเรื่องต่อไปนี้ ขอให้ระบุเพิ่มด้วย' + P);
      ms.forEach(function (m) { L.push('• ' + m); });
    }
    L.push('');
    if (st.tone === 'soft') L.push('ถ้าสะดวก รบกวนพิจารณาปรับแก้ หรือนัดคุยกันก่อนลงนามได้เลย' + P + ' ขอบคุณมาก' + P);
    else if (st.tone === 'mid') L.push('รบกวนแจ้งกลับด้วย' + P + ' ขอบคุณ' + P);
    else L.push('เมื่อแก้ไขตามนี้แล้ว ค่อยนัดลงนามกัน' + P);
    return L.join('\n');
  }

  /* ---------- สไตล์ ---------- */
  var css = '' +
    '.vng{position:fixed;inset:0;z-index:9995;display:flex;align-items:flex-end;justify-content:center;font-family:Prompt,sans-serif;color:#ececef}.vng[hidden]{display:none}' +
    '.vng-bg{position:absolute;inset:0;background:rgba(5,6,8,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}.vng.in .vng-bg{opacity:1}' +
    '.vng-card{position:relative;width:100%;max-width:760px;height:min(92vh,900px);display:flex;flex-direction:column;background:#131417;border:1px solid rgba(255,255,255,.08);border-radius:24px 24px 0 0;box-shadow:0 -20px 60px -20px rgba(0,0,0,.9);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.9,.3,1)}' +
    '.vng.in .vng-card{transform:none}' +
    '@media (min-width:768px){.vng{align-items:center}.vng-card{border-radius:24px;height:min(88vh,860px);transform:translateY(24px);opacity:0;transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s}.vng.in .vng-card{opacity:1}}' +
    '.vng-hd{display:flex;align-items:center;gap:12px;padding:16px 18px 12px}' +
    '.vng-hd .ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:rgba(127,181,255,.16);font-size:20px}' +
    '.vng-hd b{display:block;font:700 17px/1.25 Prompt,sans-serif}.vng-hd small{display:block;font:400 12.5px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vng .vng-x{margin-left:auto;flex:none;display:grid;place-items:center;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#ececef;font-size:20px;line-height:1;cursor:pointer}' +
    /* (1) แท็บ */
    '.vng-tabs{position:relative;display:flex;margin:0 16px 4px;padding:4px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07)}' +
    '.vng-tabs i{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:10px;background:#2a2c33;box-shadow:0 2px 8px -2px rgba(0,0,0,.6);transition:transform .3s cubic-bezier(.3,1.3,.5,1)}' +
    '.vng-bd[data-t="r"] ~ .vng-ft, .vng[data-t="r"] .vng-tabs i{}' +
    '.vng[data-t="r"] .vng-tabs i{transform:translateX(100%)}' +
    '.vng .vng-tabs button{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;gap:7px;min-height:40px !important;padding:0 !important;border:0;background:transparent;color:#9a9aa3;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer;transition:color .2s}' +
    '.vng .vng-tabs button.on{color:#fff}' +
    '.vng-tabs b{display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:99px;background:#7fb5ff;color:#06142b;font:700 12px/1 Prompt,sans-serif}' +
    '.vng-tabs b.pop{animation:vngPop .35s cubic-bezier(.3,1.8,.5,1)}@keyframes vngPop{50%{transform:scale(1.35)}}' +
    '.vng-bd{flex:1;min-height:0;position:relative;overflow:hidden;border-top:1px solid rgba(255,255,255,.06)}' +
    '.vng-l,.vng-r{position:absolute;inset:0;overflow:auto;overscroll-behavior:contain;padding:12px 16px 16px;transition:transform .32s cubic-bezier(.2,.9,.3,1),opacity .25s}' +
    '.vng[data-t="l"] .vng-r{transform:translateX(100%);opacity:0;pointer-events:none}.vng[data-t="r"] .vng-l{transform:translateX(-30%);opacity:0;pointer-events:none}' +
    '@media (min-width:900px){.vng-card{max-width:1060px}.vng-tabs{display:none}.vng-bd{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr)}.vng-l,.vng-r{position:relative;inset:auto;transform:none !important;opacity:1 !important;pointer-events:auto !important}.vng-l{border-right:1px solid rgba(255,255,255,.06)}}' +
    '.vng-h{display:flex;align-items:center;gap:8px;margin:14px 2px 8px;font:600 12px/1.2 Prompt,sans-serif;color:#9a9aa3;letter-spacing:.02em}.vng-l>.vng-h:first-child{margin-top:2px}' +
    '.vng-seg{display:flex;gap:4px;padding:4px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}' +
    '.vng .vng-seg button{flex:1;min-height:40px !important;padding:0 6px !important;border:0;border-radius:10px;background:transparent;color:#a1a1aa;font:600 13px/1.2 Prompt,sans-serif;cursor:pointer}' +
    '.vng .vng-seg button.on{background:#2a2c33;color:#fff;box-shadow:0 2px 8px -2px rgba(0,0,0,.6)}' +
    '.vng-row2{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:8px}' +
    '.vng-to{width:100%;min-height:48px;padding:0 12px;border-radius:13px;border:1px solid rgba(255,255,255,.1);background:#0d0e10;color:#ececef;font:400 14px/1 Prompt,sans-serif}' +
    /* (3) รายการแบบกะทัดรัด */
    '.vng-q{display:flex;gap:6px;margin-left:auto}.vng .vng-q button{min-height:0 !important;padding:4px 10px !important;border-radius:99px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#c4c4cb;font:600 11.5px/1.3 Prompt,sans-serif;cursor:pointer}' +
    '.vng .vng-q button:active{background:rgba(255,255,255,.08)}' +
    '.vng-it{border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);margin-bottom:6px;transition:border-color .15s,background .15s}' +
    '.vng-it.on{border-color:color-mix(in srgb,var(--c) 42%,transparent);background:color-mix(in srgb,var(--c) 7%,transparent)}' +
    '.vng-ir{display:flex;align-items:center;gap:10px;padding:10px 6px 10px 11px;cursor:pointer}' +
    '.vng-it input{position:absolute;opacity:0;pointer-events:none}' +
    '.vng-ck{flex:none;display:grid;place-items:center;width:20px;height:20px;border-radius:6px;border:1.5px solid rgba(255,255,255,.25);transition:all .15s}' +
    '.vng-it.on .vng-ck{background:var(--c);border-color:var(--c)}.vng-it.on .vng-ck::after{content:"";width:9px;height:5px;margin-top:-2px;border:2px solid #111;border-top:0;border-right:0;transform:rotate(-45deg)}' +
    '.vng-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--c)}' +
    '.vng-ir b{flex:1;min-width:0;font:600 13.5px/1.35 Prompt,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vng-ir .d{flex:none;font:600 10.5px/1 Prompt,sans-serif;color:#34d399}' +
    '.vng .vng-more{flex:none;display:grid;place-items:center;width:32px;height:32px;min-height:0 !important;padding:0 !important;border:0;border-radius:9px;background:transparent;color:#8a8a93;cursor:pointer;transition:transform .2s}' +
    '.vng-it.open .vng-more{transform:rotate(180deg)}' +
    '.vng-more svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.vng-dt{display:none;padding:0 12px 11px 41px;font:400 12.5px/1.55 Prompt,sans-serif;color:#b4b4bb}.vng-it.open .vng-dt{display:block}' +
    '.vng-dt i{display:block;font-style:normal;font-size:11px;color:var(--c);font-weight:600;margin-bottom:2px}' +
    '.vng-empty{padding:14px;border-radius:13px;border:1px dashed rgba(255,255,255,.12);font:400 13px/1.6 Prompt,sans-serif;color:#9a9aa3}' +
    /* (2) หน้าแชตจำลอง */
    '.vng-r{display:flex;flex-direction:column;padding:0 !important;background:#8fa9c9;background:linear-gradient(180deg,#7f9cc0,#97b0cf)}' +
    '.vng-chd{flex:none;display:flex;align-items:center;gap:10px;padding:10px 14px;background:#24324a;color:#fff}' +
    '.vng-chd .av{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#e8eef7;color:#24324a;font:700 15px/1 Prompt,sans-serif}' +
    '.vng-chd b{display:block;font:600 14.5px/1.2 Prompt,sans-serif}.vng-chd small{display:block;font:400 11px/1.3 Prompt,sans-serif;color:#b7c4d8}' +
    '.vng .vng-re{margin-left:auto;min-height:0 !important;padding:5px 10px !important;border-radius:99px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font:600 11.5px/1.3 Prompt,sans-serif;cursor:pointer}.vng .vng-re[hidden]{display:none}' +
    '.vng-chat{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:16px 12px 18px}' +
    '.vng-day{display:table;margin:0 auto 12px;padding:3px 10px;border-radius:99px;background:rgba(0,0,0,.18);color:#fff;font:500 11px/1.4 Prompt,sans-serif}' +
    '.vng-msg{display:flex;justify-content:flex-end;align-items:flex-end;gap:6px}' +
    '.vng-meta{flex:none;text-align:right;font:400 10.5px/1.35 Prompt,sans-serif;color:rgba(255,255,255,.92);text-shadow:0 1px 1px rgba(0,0,0,.15)}' +
    '.vng-bub{position:relative;width:84%;max-width:560px;flex:0 0 auto;border-radius:18px 18px 4px 18px;background:#8de055;box-shadow:0 1px 1px rgba(0,0,0,.12);animation:vngIn .3s ease-out}' +
    '@keyframes vngIn{from{opacity:0;transform:translateY(8px) scale(.98)}}' +
    '.vng-bub textarea{display:block;width:100%;min-width:200px;border:0;outline:0;resize:none;overflow:hidden;padding:10px 13px;border-radius:inherit;background:transparent;color:#132a0b;font:400 14.5px/1.6 Sarabun,Prompt,sans-serif}' +
    '.vng-bub.fade textarea{animation:vngFd .3s}@keyframes vngFd{from{opacity:.3}}' +
    '.vng-hint{margin:10px 4px 0;text-align:center;font:400 11px/1.5 Prompt,sans-serif;color:rgba(255,255,255,.85)}' +
    /* (6) แถบล่าง */
    '.vng-ft{display:flex;align-items:center;gap:8px;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07)}' +
    '.vng .vng-main{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px !important;padding:0 14px !important;border:0;border-radius:15px;background:#06c755;color:#fff;font:700 15px/1 Prompt,sans-serif;cursor:pointer;box-shadow:0 10px 24px -12px rgba(6,199,85,.9);transition:transform .12s,opacity .2s}' +
    '.vng .vng-main:active{transform:scale(.98)}.vng-main em{font-style:normal;font-weight:600;opacity:.85}' +
    '.vng-main svg{width:20px;height:20px}' +
    '.vng .vng-rb{flex:none;position:relative;display:grid;place-items:center;width:52px;height:52px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;cursor:pointer}' +
    '.vng-rb svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vng-rb::after{content:attr(data-l);position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);white-space:nowrap;font:500 9.5px/1 Prompt,sans-serif;color:#8a8a93}' +
    '.vng-ft{padding-bottom:calc(20px + env(safe-area-inset-bottom,0px))}' +
    '.vng .vng-ft button:disabled{opacity:.4;cursor:default}' +
    '.vng .vng-rb.ok{background:#34d399;border-color:#34d399;color:#06281b}' +
    /* หน้าต่างแนะนำ */
    '.vng .vng-help{margin-left:auto;flex:none;display:grid;place-items:center;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(127,181,255,.35);background:rgba(127,181,255,.08);color:#9cc5ff;font:700 16px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vng-help + .vng-x{margin-left:8px !important}' +
    '.vng-in{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:inherit;background:rgba(10,11,13,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .25s}' +
    '.vng-in[hidden]{display:none}.vng-in.in{opacity:1}' +
    '.vng-ic{position:relative;width:100%;max-width:440px;overflow:hidden;border-radius:22px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,#1c2130,#141519 60%);box-shadow:0 30px 60px -20px rgba(0,0,0,.9);transform:translateY(14px) scale(.97);transition:transform .35s cubic-bezier(.2,1.2,.4,1)}' +
    '.vng-in.in .vng-ic{transform:none}' +
    '.vng .vng-skip{position:absolute;top:12px;right:12px;z-index:2;min-height:0 !important;padding:5px 12px !important;border-radius:99px;border:0;background:rgba(255,255,255,.07);color:#a1a1aa;font:600 12px/1.3 Prompt,sans-serif;cursor:pointer}' +
    '.vng-track{display:flex;transition:transform .4s cubic-bezier(.2,.9,.3,1)}' +
    '.vng-sl{flex:0 0 100%;padding:26px 22px 8px;box-sizing:border-box}' +
    '.vng-sl .k{margin:0 0 4px;font:600 12px/1.3 Prompt,sans-serif;color:#7fb5ff;letter-spacing:.03em}' +
    '.vng .vng-sl h3{margin:0 0 10px !important;font:700 20px/1.35 Prompt,sans-serif !important;letter-spacing:0 !important;color:#fff !important}' +
    '.vng-sl .d{margin:0;font:400 13.5px/1.7 Prompt,sans-serif;color:#b9b9c0}' +
    '.vng-art{position:relative;height:150px;margin:0 0 16px;display:grid;place-items:center}' +
    '.vng-art .vng-ph{width:150px;height:140px;border-radius:18px;background:linear-gradient(180deg,#7f9cc0,#97b0cf);overflow:hidden;box-shadow:0 14px 30px -12px rgba(0,0,0,.8)}' +
    '.vng-art .vng-chh{display:flex;align-items:center;gap:6px;height:24px;padding:0 8px;background:#24324a}.vng-art .vng-chh i{width:12px;height:12px;border-radius:50%;background:#e8eef7}.vng-art .vng-chh b{width:46px;height:5px;border-radius:3px;background:#b7c4d8}' +
    '.vng-art .vng-bb{display:flex;flex-direction:column;gap:4px;width:92px;margin:10px 8px 0 auto;padding:8px;border-radius:10px 10px 3px 10px;background:#8de055;opacity:0;transform:translateY(10px)}' +
    '.vng-art .vng-bb.r{width:70px;margin-top:6px}.vng-art .vng-bb i{height:4px;border-radius:2px;background:rgba(19,42,11,.45)}.vng-art .vng-bb i.s{width:60%}' +
    '.vng-sl.on .vng-art .vng-bb{animation:vngBb .5s .25s forwards}.vng-sl.on .vng-art .vng-bb.r{animation-delay:.75s}' +
    '@keyframes vngBb{to{opacity:1;transform:none}}' +
    '.vng-art .vng-pn{position:absolute;left:calc(50% - 100px);bottom:8px;font-size:34px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.6))}.vng-sl.on .vng-art .vng-pn{animation:vngPn 2.4s ease-in-out infinite}' +
    '@keyframes vngPn{50%{transform:translate(6px,-6px) rotate(-8deg)}}' +
    '.vng-steps{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:10px}' +
    '.vng-steps li{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);opacity:0;transform:translateX(14px)}' +
    '.vng-sl.on .vng-steps li{animation:vngSt .4s forwards}.vng-sl.on .vng-steps li:nth-child(2){animation-delay:.12s}.vng-sl.on .vng-steps li:nth-child(3){animation-delay:.24s}' +
    '@keyframes vngSt{to{opacity:1;transform:none}}' +
    '.vng-steps li>i{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;font:800 13px/1 Prompt,sans-serif;font-style:normal}' +
    '.vng-steps b{display:block;font:600 14px/1.35 Prompt,sans-serif;color:#fff}.vng-steps small{display:block;margin-top:2px;font:400 12px/1.5 Prompt,sans-serif;color:#9a9aa3}' +
    '.vng-pros{display:grid;gap:8px}.vng-pros>div{display:flex;gap:11px;align-items:flex-start;padding:10px 11px;border-radius:14px;background:rgba(255,255,255,.035);opacity:0;transform:translateY(8px)}' +
    '.vng-sl.on .vng-pros>div{animation:vngSt .4s forwards}.vng-sl.on .vng-pros>div:nth-child(2){animation-delay:.08s}.vng-sl.on .vng-pros>div:nth-child(3){animation-delay:.16s}.vng-sl.on .vng-pros>div:nth-child(4){animation-delay:.24s}' +
    '.vng-pros span{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:rgba(255,255,255,.06);font-size:17px}' +
    '.vng-pros p{margin:0}.vng-pros b{display:block;font:600 13.5px/1.35 Prompt,sans-serif;color:#fff}.vng-pros small{display:block;font:400 12px/1.45 Prompt,sans-serif;color:#9a9aa3}' +
    '.vng-disc{margin:12px 2px 0;font:400 11px/1.5 Prompt,sans-serif;color:#71717a}' +
    '.vng-nav{display:flex;align-items:center;gap:10px;padding:14px 16px 16px}' +
    '.vng .vng-pv2{flex:none;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:transparent;color:#ececef;font:400 22px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vng-dts{flex:1;display:flex;justify-content:center;gap:6px}' +
    '.vng .vng-dts button{width:8px;height:8px;min-height:0 !important;padding:0 !important;border:0;border-radius:99px;background:rgba(255,255,255,.2);cursor:pointer;transition:width .25s,background .25s}.vng .vng-dts button.on{width:22px;background:#7fb5ff}' +
    '.vng .vng-nx{flex:none;min-width:110px;min-height:44px !important;padding:0 16px !important;border:0;border-radius:13px;background:rgba(127,181,255,.16);color:#cfe2ff;font:700 14px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vng .vng-nx.go{background:#06c755;color:#fff;box-shadow:0 10px 22px -10px rgba(6,199,85,.9)}' +
    '@media (prefers-reduced-motion:reduce){.vng-track{transition:none}.vng-sl *{animation:none !important;opacity:1 !important;transform:none !important}}' +
    /* (1) แถบสรุปการตั้งค่า */
    '.vng .vng-sum{display:flex;align-items:center;gap:10px;width:100%;min-height:46px !important;padding:0 14px !important;margin:2px 0 4px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:#e4e4e7;font:500 13.5px/1.3 Prompt,sans-serif;text-align:left;cursor:pointer}' +
    '.vng-sum .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vng-sum em{flex:none;font-style:normal;font-size:12px;font-weight:600;color:#7fb5ff}' +
    '.vng-sum[aria-expanded="true"]{border-color:rgba(127,181,255,.4)}.vng-set{padding:0 2px 6px;animation:vngIn .25s ease-out}.vng-set[hidden]{display:none}' +
    /* (2)+(3) กลุ่มและแถว */
    '.vng-grp{margin-top:14px}' +
    '.vng-gh{display:flex;align-items:center;gap:8px;margin:0 2px 8px}.vng-gh i{width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 8px var(--c)}' +
    '.vng-gh b{font:700 13.5px/1.2 Prompt,sans-serif;color:#ececef}.vng-gh .c{font:600 12px/1 Prompt,sans-serif;color:#8a8a93}' +
    '.vng .vng-gh button{margin-left:auto;min-height:0 !important;padding:4px 10px !important;border-radius:99px;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);background:transparent;color:var(--c);font:600 11.5px/1.3 Prompt,sans-serif;cursor:pointer}' +
    '.vng-it{position:relative;overflow:hidden;background:#18191d !important;border-color:rgba(255,255,255,.07) !important;opacity:.58;transition:opacity .2s,border-color .2s}' +
    '.vng-it::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--c);opacity:.35;transition:opacity .2s}' +
    '.vng-it.on{opacity:1;border-color:rgba(255,255,255,.12) !important}.vng-it.on::before{opacity:1}' +
    '.vng-dot{display:none}.vng-ir{padding:10px 6px 10px 13px}' +
    '.vng-tx{flex:1;min-width:0}.vng-tx b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vng-tx small{display:block;margin-top:2px;font:400 11.5px/1.3 Prompt,sans-serif;color:#8a8a93;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vng-tx small .d{color:#34d399;font-weight:600}' +
    /* (6) บับเบิลลอยเหนือปุ่มล่าง */
    '.vng .vng-mini{display:flex;align-items:center;gap:8px;margin:0 16px -4px;min-height:0 !important;padding:8px 8px 8px 12px !important;border:0;border-radius:14px 14px 4px 14px;background:#8de055;color:#132a0b;text-align:left;cursor:pointer;box-shadow:0 6px 18px -8px rgba(0,0,0,.7);animation:vngIn .3s ease-out}' +
    '.vng-mini .b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:400 13px/1.4 Sarabun,Prompt,sans-serif}' +
    '.vng-mini em{flex:none;padding:3px 9px;border-radius:99px;background:rgba(19,42,11,.12);font:700 11.5px/1.3 Prompt,sans-serif;font-style:normal}' +
    '.vng[data-t="r"] .vng-mini{display:none}@media (min-width:900px){.vng .vng-mini{display:none}}' +
    '@media (prefers-reduced-motion:reduce){.vng-l,.vng-r,.vng-tabs i,.vng-bub{transition:none;animation:none}}';
  var sty = document.createElement('style'); sty.textContent = css; document.head.appendChild(sty);

  var I = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12.5v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s6-3.5 8.2-6.1C21.7 14 22 12.5 22 11c0-4.4-4.5-8-10-8z"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  /* ---------- แผง ---------- */
  var el = null, list = [], miss = [], edited = false, prevOv = '';
  function build() {
    el = document.createElement('div'); el.className = 'vng'; el.hidden = true; el.setAttribute('data-t', 'l');
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'ร่างข้อความต่อรอง');
    var share = !!navigator.share;
    el.innerHTML = '<div class="vng-bg" data-x></div><div class="vng-card">' +
      '<div class="vng-hd"><span class="ic">✍️</span><div><b>ร่างข้อความต่อรอง</b><small>เลือกข้อ เลือกน้ำเสียง แก้คำได้ แล้วส่งให้อีกฝ่าย</small></div><button type="button" class="vng-help" data-help aria-label="วิธีใช้">?</button><button type="button" class="vng-x" data-x aria-label="ปิด">×</button></div>' +
      '<div class="vng-tabs" role="tablist"><i aria-hidden="true"></i><button type="button" role="tab" data-tab="l" class="on">เลือกข้อ <b class="vng-n">0</b></button><button type="button" role="tab" data-tab="r">ดูข้อความ</button></div>' +
      '<div class="vng-bd"><div class="vng-l">' +
        '<button type="button" class="vng-sum" aria-expanded="false"><span class="t"></span><em>✎ ปรับ</em></button><div class="vng-set" hidden>' +
        '<p class="vng-h">น้ำเสียง</p><div class="vng-seg" data-g="tone"><button type="button" data-v="soft">สุภาพ</button><button type="button" data-v="mid">กลาง ๆ</button><button type="button" data-v="direct">ตรงไปตรงมา</button></div>' +
        '<p class="vng-h">ส่งถึง</p><div class="vng-row2"><input class="vng-to" type="text" maxlength="40" placeholder="ชื่อผู้รับ (ไม่ใส่ก็ได้)"><div class="vng-seg" data-g="pp"><button type="button" data-v="ครับ">ครับ</button><button type="button" data-v="ค่ะ">ค่ะ</button></div></div></div>' +
        '<div class="vng-list"></div>' +
      '</div><div class="vng-r"><div class="vng-chd"><span class="av">?</span><div><b class="vng-who">อีกฝ่าย</b><small>ตัวอย่างหน้าตาตอนส่ง · แตะข้อความเพื่อแก้ได้</small></div><button type="button" class="vng-re" hidden>↺ สร้างใหม่</button></div>' +
        '<div class="vng-chat"><span class="vng-day">วันนี้</span><div class="vng-msg"><span class="vng-meta">อ่านแล้ว<br><span class="vng-tm"></span></span><div class="vng-bub"><textarea spellcheck="false" aria-label="ข้อความต่อรอง"></textarea></div></div>' +
        '<p class="vng-hint">ร่างจากผลตรวจของ AI ใช้ประกอบการพูดคุย ไม่ใช่คำปรึกษาทางกฎหมาย ควรอ่านทวนก่อนส่ง</p></div></div></div>' +
      '<button type="button" class="vng-mini" data-tab="r" aria-label="ดูข้อความเต็ม"><span class="b"></span><em>ดู ›</em></button>' +
      '<div class="vng-ft"><button type="button" class="vng-main" data-line>' + I.line + 'ส่งทาง LINE <em class="vng-mn"></em></button>' +
        '<button type="button" class="vng-rb" data-copy data-l="คัดลอก" aria-label="คัดลอก">' + I.copy + '</button><button type="button" class="vng-rb" data-mail data-l="อีเมล" aria-label="อีเมล">' + I.mail + '</button>' +
        (share ? '<button type="button" class="vng-rb" data-share data-l="ส่งต่อ" aria-label="ส่งต่อ">' + I.share + '</button>' : '') + '</div></div>';
    document.body.appendChild(el);
    el.querySelector('.vng-card').appendChild(introEl());
    var ta = el.querySelector('textarea');
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) return close();
      if (e.target.closest('[data-help]')) return intro(true);
      var iv = e.target.closest('[data-iv]');
      if (iv) { var a = iv.getAttribute('data-iv'); if (a === 'next') return slide(ix + 1); if (a === 'prev') return slide(ix - 1); if (a === 'skip' || a === 'go') return introClose(); return slide(+a); }
      var tb = e.target.closest('[data-tab]'); if (tb) return tab(tb.getAttribute('data-tab'));
      var sb = e.target.closest('.vng-seg button');
      if (sb) { var g = sb.parentNode.getAttribute('data-g'); st[g] = sb.getAttribute('data-v'); ls(g === 'tone' ? 'vc_neg_tone' : 'vc_neg_pp', st[g]); segs(); regen(); fade(); return; }
      var sm = e.target.closest('.vng-sum'); if (sm) { var se = el.querySelector('.vng-set'); se.hidden = !se.hidden; sm.setAttribute('aria-expanded', String(!se.hidden)); return; }
      var gb = e.target.closest('[data-grp]');
      if (gb) { var gr = el.querySelectorAll('.vng-it[data-g="' + gb.getAttribute('data-grp') + '"]'), allOn = [].every.call(gr, function (d) { return d.querySelector('input').checked; }); [].forEach.call(gr, function (d) { d.querySelector('input').checked = !allOn; d.classList.toggle('on', !allOn); }); count(true); if (!edited) regen(); return; }
      var mo = e.target.closest('.vng-more'); if (mo) { e.preventDefault(); var it = mo.closest('.vng-it'); it.classList.toggle('open'); mo.setAttribute('aria-expanded', String(it.classList.contains('open'))); return; }
      if (e.target.closest('.vng-re')) { regen(true); fade(); return; }
      var t = ta.value;
      if (e.target.closest('[data-copy]')) return copy(t, e.target.closest('button'));
      if (e.target.closest('[data-line]')) { window.open('https://line.me/R/share?text=' + encodeURIComponent(t), '_blank', 'noopener'); return; }
      if (e.target.closest('[data-mail]')) { location.href = 'mailto:?subject=' + encodeURIComponent('ขอแก้ไขร่างสัญญาก่อนลงนาม') + '&body=' + encodeURIComponent(t); return; }
      if (e.target.closest('[data-share]')) { navigator.share({ text: t }).catch(function () {}); return; }
    });
    el.addEventListener('change', function (e) {
      var it = e.target.closest('.vng-it'); if (!it) return;
      it.classList.toggle('on', e.target.checked); count(true); if (!edited) regen();
    });
    el.querySelector('.vng-to').addEventListener('input', function () { st.to = this.value; ls('vc_neg_to', st.to); who(); sumTx(); if (!edited) regen(); });
    ta.addEventListener('input', function () { edited = true; el.querySelector('.vng-re').hidden = false; grow(); count(); });
    document.addEventListener('keydown', function (e) { if (e.key !== 'Escape' || !el || el.hidden) return; var d = el.querySelector('.vng-in'); if (d && !d.hidden) introClose(); else close(); });
  }
  /* ---------- หน้าต่างแนะนำการใช้งาน ---------- */
  var ix = 0, NS = 3;
  function introEl() {
    var d = document.createElement('div'); d.className = 'vng-in'; d.hidden = true; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'วิธีใช้ร่างข้อความต่อรอง');
    var S = [
      '<div class="vng-sl"><div class="vng-art a1"><div class="vng-ph"><div class="vng-chh"><i></i><b></b></div><div class="vng-bb"><i></i><i></i><i class="s"></i></div><div class="vng-bb r"><i></i><i class="s"></i></div></div><span class="vng-pn">✍️</span></div>' +
        '<p class="k">ร่างข้อความต่อรองคืออะไร?</p><h3>เปลี่ยนผลตรวจ เป็นข้อความที่ส่งได้ทันที</h3>' +
        '<p class="d">ระบบหยิบข้อที่ควรขอแก้จากผลตรวจ มาเรียบเรียงเป็นข้อความสุภาพถึงอีกฝ่าย พร้อมข้อความเดิมในสัญญา และสิ่งที่ขอให้แก้ — ไม่ต้องคิดคำเอง</p></div>',
      '<div class="vng-sl"><p class="k">ใช้ยังไง</p><h3>3 ขั้น ไม่ถึง 1 นาที</h3><ol class="vng-steps">' +
        '<li><i>1</i><div><b>เลือกข้อที่อยากต่อรอง</b><small>ระบบติ๊กข้อสำคัญไว้ให้แล้ว แตะ ⌄ เพื่อดูว่าจะขอแก้เป็นอะไร</small></div></li>' +
        '<li><i>2</i><div><b>เลือกน้ำเสียงและผู้รับ</b><small>สุภาพ · กลาง ๆ · ตรงไปตรงมา และลงท้าย ครับ/ค่ะ ที่แถบ ✎ ปรับ</small></div></li>' +
        '<li><i>3</i><div><b>ดูข้อความ แล้วส่ง</b><small>แก้คำได้ในบับเบิล จากนั้นกด "ส่งทาง LINE" หรือคัดลอก / อีเมล</small></div></li></ol></div>',
      '<div class="vng-sl"><p class="k">ช่วยอะไรคุณ</p><h3>ต่อรองได้มั่นใจขึ้น</h3><div class="vng-pros">' +
        '<div><span>🕊️</span><p><b>ไม่ต้องกลัวเสียมารยาท</b><small>ถ้อยคำสุภาพ เป็นมืออาชีพ ไม่ดูเหมือนหาเรื่อง</small></p></div>' +
        '<div><span>🎯</span><p><b>ชัดเจน อีกฝ่ายแก้ได้ทันที</b><small>อ้างข้อในสัญญา + บอกว่าอยากให้แก้เป็นอะไร</small></p></div>' +
        '<div><span>📝</span><p><b>ไม่ลืมเรื่องที่ยังไม่ได้เขียน</b><small>ขอให้เพิ่มเรื่องที่สัญญายังไม่ระบุได้ในข้อความเดียว</small></p></div>' +
        '<div><span>⚡</span><p><b>ส่งได้ในแตะเดียว</b><small>LINE · อีเมล · คัดลอก ไปวางที่ไหนก็ได้</small></p></div></div>' +
        '<p class="vng-disc">ข้อความร่างจากผลตรวจของ AI ใช้ประกอบการพูดคุย ไม่ใช่คำปรึกษาทางกฎหมาย</p></div>'
    ];
    d.innerHTML = '<div class="vng-ic"><button type="button" class="vng-skip" data-iv="skip">ข้าม</button><div class="vng-track">' + S.join('') + '</div>' +
      '<div class="vng-nav"><button type="button" class="vng-pv2" data-iv="prev" aria-label="ก่อนหน้า">‹</button><div class="vng-dts">' + S.map(function (_, k) { return '<button type="button" data-iv="' + k + '" aria-label="หน้า ' + (k + 1) + '"></button>'; }).join('') + '</div>' +
      '<button type="button" class="vng-nx" data-iv="next">ถัดไป ›</button></div></div>';
    /* ปัดซ้าย/ขวา */
    var x0 = null;
    d.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 45) slide(ix + (dx < 0 ? 1 : -1)); }, { passive: true });
    return d;
  }
  function slide(k) {
    var d = el.querySelector('.vng-in'); ix = Math.max(0, Math.min(NS - 1, k));
    d.querySelector('.vng-track').style.transform = 'translateX(' + (-ix * 100) + '%)';
    [].forEach.call(d.querySelectorAll('.vng-dts button'), function (b, j) { b.classList.toggle('on', j === ix); });
    d.querySelector('.vng-pv2').style.visibility = ix ? 'visible' : 'hidden';
    var nx = d.querySelector('.vng-nx'); nx.textContent = ix === NS - 1 ? 'เริ่มร่างข้อความ' : 'ถัดไป ›'; nx.setAttribute('data-iv', ix === NS - 1 ? 'go' : 'next'); nx.classList.toggle('go', ix === NS - 1);
    [].forEach.call(d.querySelectorAll('.vng-sl'), function (sl, j) { sl.classList.toggle('on', j === ix); sl.setAttribute('aria-hidden', String(j !== ix)); });
  }
  function intro(force) {
    if (!force && ls('vc_neg_intro') === '1') return;
    var d = el.querySelector('.vng-in'); d.hidden = false; slide(0);
    requestAnimationFrame(function () { d.classList.add('in'); });
  }
  function introClose() {
    ls('vc_neg_intro', '1');
    var d = el.querySelector('.vng-in'); d.classList.remove('in'); setTimeout(function () { d.hidden = true; }, 250);
  }
  function tab(t) {
    el.setAttribute('data-t', t);
    [].forEach.call(el.querySelectorAll('[data-tab]'), function (b) { var on = b.getAttribute('data-tab') === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
    if (t === 'r') setTimeout(grow, 30);
  }
  function grow() { var ta = el.querySelector('textarea'); ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px'; }
  function fade() { var b = el.querySelector('.vng-bub'); b.classList.remove('fade'); void b.offsetWidth; b.classList.add('fade'); }
  function who() { var n = st.to.trim(); el.querySelector('.vng-who').textContent = n || 'อีกฝ่าย'; el.querySelector('.vng-chd .av').textContent = n ? n.replace(/^(คุณ|นาย|นาง|นางสาว)\s*/, '').charAt(0) || n.charAt(0) : '?'; }
  function copy(t, btn) {
    function ok() { btn.classList.add('ok'); var l = btn.getAttribute('data-l'); btn.setAttribute('data-l', 'คัดลอกแล้ว'); setTimeout(function () { btn.classList.remove('ok'); btn.setAttribute('data-l', l); }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
    function fb() { var ta = el.querySelector('textarea'); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} }
  }
  var TONE = { soft: '🙂 สุภาพ', mid: '🤝 กลาง ๆ', direct: '💼 ตรงไปตรงมา' };
  function sumTx() { var t = el.querySelector('.vng-sum .t'); if (t) t.textContent = TONE[st.tone] + ' · ' + st.pp + ' · ถึง: ' + (st.to.trim() || 'อีกฝ่าย'); }
  function segs() { sumTx(); [].forEach.call(el.querySelectorAll('.vng-seg'), function (sg) { var v = st[sg.getAttribute('data-g')]; [].forEach.call(sg.children, function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); }); }
  function picked() {
    var fx = [], ms = [];
    [].forEach.call(el.querySelectorAll('.vng-it input:checked'), function (c) { var d = c.closest('.vng-it'), k = d.getAttribute('data-k'), n = +d.getAttribute('data-n'); if (k === 'f') fx.push(list[n]); else ms.push(miss[n]); });
    return { fx: fx, ms: ms };
  }
  function count(pop) {
    var p = picked(), n = p.fx.length + p.ms.length, b = el.querySelector('.vng-n');
    if (b.textContent !== String(n)) { b.textContent = n; if (pop) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } }
    el.querySelector('.vng-mn').textContent = n ? '· ' + n + ' ข้อ' : '';
    [].forEach.call(el.querySelectorAll('.vng-gh'), function (g) {
      var k = g.getAttribute('data-gh'), its = el.querySelectorAll('.vng-it[data-g="' + k + '"]'), on = [].filter.call(its, function (d) { return d.querySelector('input').checked; }).length;
      g.querySelector('.c').textContent = on + '/' + its.length; g.querySelector('[data-grp]').textContent = on === its.length ? 'ล้างกลุ่ม' : 'เลือกทั้งกลุ่ม';
    });
    var mb = el.querySelector('.vng-mini .b'); if (mb) { var hs = p.fx.map(function (x) { return x.head.replace(' — ', ' '); }).concat(p.ms); mb.textContent = edited ? 'ข้อความที่คุณแก้เอง · แตะเพื่อดู' : n ? 'ขอแก้ ' + n + ' ข้อ: ' + hs.join(', ') : 'ยังไม่ได้เลือกข้อ · แตะเพื่อพิมพ์เอง'; }
    var can = !!(n || (edited && el.querySelector('textarea').value.trim()));
    [].forEach.call(el.querySelectorAll('.vng-ft button'), function (x) { x.disabled = !can; });
  }
  function regen(force) { var p = picked(); el.querySelector('textarea').value = compose(p.fx, p.ms); if (force || !edited) { edited = false; el.querySelector('.vng-re').hidden = true; } count(); grow(); }
  var GRP = [['check_detail', '#f2555a', 'ควรแก้ก่อนเซ็น'], ['caution', '#f5c451', 'ควรต่อรอง'], ['low', '#8d8d96', 'ข้อสังเกต'], ['miss', '#7fb5ff', 'ขอให้เขียนเพิ่ม']];
  function renderList() {
    var row = function (k, n, g, c, on, title, sub, tag, det, done) {
      return '<div class="vng-it' + (on ? ' on' : '') + '" data-k="' + k + '" data-n="' + n + '" data-g="' + g + '" style="--c:' + c + '"><label class="vng-ir"><input type="checkbox"' + (on ? ' checked' : '') + '><span class="vng-ck"></span><span class="vng-tx"><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + (done ? ' · <span class="d">แก้แล้ว</span>' : '') + '</small>' : '') + '</span>' +
        '<button type="button" class="vng-more" aria-label="ดูรายละเอียด" aria-expanded="false">' + I.down + '</button></label><div class="vng-dt"><i>' + esc(tag) + '</i>' + esc(det) + '</div></div>';
    };
    var h = GRP.map(function (G) {
      var rows;
      if (G[0] === 'miss') rows = miss.map(function (m, n) { return row('m', n, 'miss', G[1], false, m, 'ยังไม่ได้เขียนไว้ในสัญญา', 'ขอให้เพิ่ม', 'ขอให้เขียนเรื่องนี้เพิ่มในสัญญาให้ชัดเจน'); });
      else rows = list.map(function (x, n) { return x.lv === G[0] ? row('f', n, G[0], G[1], x.on, (x.star ? '⭐ ' : '') + x.title, x.head.replace(' — ', ' · '), x.ask ? 'ขอให้ชี้แจง' : 'ขอแก้เป็น', x.fix, x.done) : ''; }).filter(Boolean);
      if (!rows.length) return '';
      return '<div class="vng-grp" style="--c:' + G[1] + '"><div class="vng-gh" data-gh="' + G[0] + '"><i></i><b>' + G[2] + '</b><span class="c"></span><button type="button" data-grp="' + G[0] + '"></button></div>' + rows.join('') + '</div>';
    }).join('');
    if (!h) h = '<div class="vng-empty">ผลตรวจนี้ไม่มีข้อที่ต้องขอแก้ไข 🎉 ถ้ายังอยากส่งข้อความถึงอีกฝ่าย ไปที่ "ดูข้อความ" แล้วพิมพ์ได้เลย</div>';
    el.querySelector('.vng-list').innerHTML = h;
  }
  function open(onlyStar) {
    if (!res()) { if (window.VCTools) VCTools.open(); return; }
    if (!el) build();
    list = collect(!!onlyStar); miss = missing(); edited = false;
    if (onlyStar && !list.some(function (x) { return x.on; })) list = collect(false);
    renderList(); segs(); el.querySelector('.vng-to').value = st.to; who();
    var d = new Date(); el.querySelector('.vng-tm').textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    tab('l'); regen(true);
    el.hidden = false; prevOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); grow(); }); });
    el.querySelector('.vng-l').scrollTop = 0;
    var din = el.querySelector('.vng-in'); din.hidden = true; din.classList.remove('in');
    setTimeout(function () { intro(false); }, 320);
  }
  function close() { if (!el || el.hidden) return; el.classList.remove('in'); document.documentElement.style.overflow = prevOv || ''; setTimeout(function () { el.hidden = true; }, 300); }
  /* ---------- ปุ่มในผลตรวจ ---------- */
  var PEN = '<svg class="vng-pen" viewBox="0 0 48 48" aria-hidden="true">' +
    '<rect x="7" y="6" width="28" height="36" rx="4" fill="#eef3fb"/>' +
    '<path class="l1" d="M13 16h16"/><path class="l2" d="M13 23h16"/><path class="l3" d="M13 30h10"/>' +
    '<g class="p"><path d="M30 33 41 22a2.4 2.4 0 0 1 3.4 3.4L33.4 36.4 29 38z" fill="#f5c451"/><path d="M29 38l1-4.2 3.4 2.6z" fill="#3a2f1a"/></g></svg>';
  var LINE_S = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s6-3.5 8.2-6.1C21.7 14 22 12.5 22 11c0-4.4-4.5-8-10-8z"/></svg>';
  var ccss = '' +
    '.vng-cta{position:relative;display:block !important;width:100%;height:auto !important;margin:16px 0;min-height:0 !important;padding:14px !important;border-radius:18px;border:1px solid rgba(127,181,255,.3);background:linear-gradient(140deg,rgba(127,181,255,.14),rgba(127,181,255,.03) 55%),#15171c;color:#ececef;text-align:left;font-family:Prompt,sans-serif;cursor:pointer;overflow:hidden;transition:border-color .2s,transform .12s,box-shadow .3s}' +
    'html body #result button.vng-cta.vng-cta{padding:14px !important;margin:16px 0 !important;border-radius:18px !important}' +
    '.vng-cta:hover{border-color:rgba(127,181,255,.6)}.vng-cta:active{transform:scale(.985)}' +
    '.vng-ct{display:flex;align-items:center;gap:12px}' +
    '.vng-cta .ic{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:rgba(127,181,255,.16)}' +
    '.vng-pen{width:36px;height:36px}.vng-pen path[class^=l]{fill:none;stroke:#9fb3d1;stroke-width:3;stroke-linecap:round;stroke-dasharray:16;stroke-dashoffset:16;animation:vngW 4.8s ease-in-out infinite}' +
    '.vng-pen .l2{animation-delay:.6s !important}.vng-pen .l3{stroke-dasharray:10;stroke-dashoffset:10;animation-delay:1.2s !important}' +
    '.vng-pen .p{animation:vngP 4.8s ease-in-out infinite}' +
    '@keyframes vngW{0%,8%{stroke-dashoffset:16}30%,80%{stroke-dashoffset:0}92%,100%{stroke-dashoffset:16}}' +
    '@keyframes vngP{0%{transform:translate(-16px,-22px)}12%{transform:translate(0,-22px)}20%{transform:translate(-16px,-15px)}32%{transform:translate(0,-15px)}40%{transform:translate(-16px,-8px)}50%,80%{transform:translate(-6px,-8px)}100%{transform:translate(-16px,-22px)}}' +
    '.vng-cta b{display:block;font:700 15.5px/1.3 Prompt,sans-serif}' +
    '.vng-st{display:block;margin-top:3px;font:500 12.5px/1.4 Prompt,sans-serif;color:#a9b8d0}.vng-st.star{color:#f5d27a}.vng-st.done{color:#6ee7b7}' +
    '.vng-dots{margin-left:auto;flex:none;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;max-width:92px}' +
    '.vng-dots i{width:11px;height:11px;border-radius:50%;border:2px solid var(--c);box-sizing:border-box}' +
    '.vng-dots i.on{background:var(--c)}.vng-dots i.st{box-shadow:0 0 0 2px rgba(245,196,81,.5)}' +
    '.vng-pv{display:flex;align-items:flex-end;gap:8px;margin-top:12px;padding:10px;border-radius:14px;background:linear-gradient(180deg,#7f9cc0,#97b0cf)}' +
    '.vng-pv span.b{flex:1;min-width:0;padding:8px 11px;border-radius:14px 14px 4px 14px;background:#8de055;color:#132a0b;font:400 13px/1.5 Sarabun,Prompt,sans-serif;box-shadow:0 1px 1px rgba(0,0,0,.12)}' +
    '.vng-pv span.b i{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-height:3em;font-style:normal}' +
    '.vng-pv span.ln{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#06c755}.vng-pv span.ln svg{width:18px;height:18px}' +
    '.vng-cta.ready{border-color:rgba(110,231,183,.55);box-shadow:0 12px 30px -16px rgba(52,211,153,.8)}' +
    '.vng-cta.ready::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.14) 50%,transparent 65%);transform:translateX(-100%);animation:vngSh 3.2s ease-in-out 1s infinite;pointer-events:none}' +
    '@keyframes vngSh{0%,55%{transform:translateX(-100%)}100%{transform:translateX(100%)}}' +
    '@media (prefers-reduced-motion:reduce){.vng-pen *,.vng-cta::after{animation:none !important}.vng-pen path[class^=l]{stroke-dashoffset:0}}';
  var cst = document.createElement('style'); cst.textContent = ccss; document.head.appendChild(cst);

  function progress() {
    var its = document.querySelectorAll('#result details.item'), rows = document.querySelectorAll('#result .ix-row');
    var a = [].filter.call(its, function (d) { var b = d.querySelector('.rv-btn'); return b && b.getAttribute('aria-pressed') === 'true'; }).length;
    var b = [].filter.call(rows, function (x) { return x.classList.contains('is-done'); }).length;
    var stars = [].filter.call(its, function (d) { return d.classList.contains('vc-star'); }).length;
    return { read: Math.max(a, b), total: its.length || rows.length, stars: stars };
  }
  var pend = false, starMode = false;
  function cta() {
    pend = false;
    var r = document.getElementById('result'); if (!r) return;
    var rpt = r.querySelector('article.rpt'), ex = r.querySelector('.vng-cta');
    if (!rpt || !res()) { if (ex) ex.remove(); return; }
    var all = collect(false), sel = all.filter(function (x) { return x.on; }), pg = progress();
    if (!ex) {
      ex = document.createElement('button'); ex.type = 'button'; ex.className = 'vng-cta';
      ex.addEventListener('click', function () { open(starMode); });
    }
    starMode = pg.stars > 0;
    var ready = pg.total > 0 && pg.read >= pg.total;
    var stTx = starMode ? '<span class="vng-st star">⭐ ติดดาวไว้ ' + pg.stars + ' ข้อ · ร่างจากข้อที่เลือก</span>'
      : ready ? '<span class="vng-st done">อ่านครบแล้ว พร้อมส่งให้อีกฝ่าย ✓</span>'
      : sel.length ? '<span class="vng-st">ร่างจาก ' + sel.length + ' ข้อที่ควรขอแก้' + (pg.read ? ' · อ่านแล้ว ' + pg.read + '/' + pg.total : '') + '</span>'
      : '<span class="vng-st">ร่างข้อความถึงอีกฝ่ายจากผลตรวจนี้</span>';
    var dots = all.slice(0, 12).map(function (x) { return '<i class="' + (x.on ? 'on' : '') + (x.star ? ' st' : '') + '" style="--c:' + LV[x.lv][1] + '"></i>'; }).join('');
    var use = starMode ? all.filter(function (x) { return x.star; }) : sel;
    var heads = use.slice(0, 3).map(function (x) { return x.head.replace(' — ', ' '); }).join(', ');
    var P = st.pp, pv = use.length ? 'สวัสดี' + P + ' ขอแก้ ' + use.length + ' ข้อก่อนลงนามนะ' + (P === 'ครับ' ? 'ครับ' : 'คะ') + ': ' + heads + (use.length > 3 ? ' …' : '') : 'สวัสดี' + P + ' อ่านร่างสัญญาแล้ว ขอคุยรายละเอียดก่อนลงนามนะ' + (P === 'ครับ' ? 'ครับ' : 'คะ');
    var html = '<span class="vng-ct"><span class="ic">' + PEN + '</span><span><b>ร่างข้อความต่อรอง</b>' + stTx + '</span>' + (dots ? '<span class="vng-dots" aria-hidden="true">' + dots + '</span>' : '') + '</span>' +
      '<span class="vng-pv"><span class="b"><i>' + esc(pv) + '</i></span><span class="ln">' + LINE_S + '</span></span>';
    var sig = html.length + '|' + pv + stTx + dots;
    if (ex.getAttribute('data-sig') !== sig) { ex.innerHTML = html; ex.setAttribute('data-sig', sig); }
    ex.setAttribute('aria-label', 'ร่างข้อความต่อรอง ' + (use.length ? use.length + ' ข้อ' : ''));
    ex.classList.toggle('ready', ready && !starMode);
    var anchor = rpt.querySelector('.vhs') || rpt.querySelector('.vc-sum') || rpt.querySelector('.rpt-head');
    if (anchor && ex.previousElementSibling !== anchor) anchor.parentNode.insertBefore(ex, anchor.nextSibling);
  }
  function watch() {
    var r = document.getElementById('result'); if (!r) return;
    new MutationObserver(function (m) {
      if (m.every(function (x) { return x.target.closest && x.target.closest('.vng-cta'); })) return;
      if (!pend) { pend = true; setTimeout(cta, 400); }
    }).observe(r, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
    cta();
  }

  window.VCNeg = { open: open, close: close };
  /* ปุ่มเดิมบนมือถือ (ติดดาว / ปุ่มลอย / การ์ดท้าย) ใช้หน้าใหม่นี้ */
  /* art.js โหลดทีหลังและตั้ง __vcNeg ของมันเอง จึงตั้งทับอีกครั้งหลังหน้าโหลดเสร็จ */
  function hook() { window.__vcNeg = function (onlyStar) { open(!!onlyStar); }; }
  hook(); addEventListener('load', hook);
  function boot() { hook(); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
