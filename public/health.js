/* ===== คะแนนสุขภาพสัญญา (Contract Health Score) =====
   คิดจากประเด็นที่ผลตรวจพบจริงเท่านั้น (ไม่เรียก AI เพิ่ม ไม่สุ่ม) เกณฑ์เปิดให้ดูได้ใน "คะแนนนี้คิดยังไง"
   - คะแนนรวมเริ่ม 100 · หักต่อประเด็น: สำคัญ −15 · ควรระวัง −7 · เล็กน้อย −2 · ต่ำสุด 5
   - แยก 5 ด้าน (เงิน · การยกเลิก · ความรับผิด · เวลา · สิทธิ์ของคุณ) ด้านละ 100 หัก: สำคัญ −35 · ควรระวัง −18 · เล็กน้อย −6
   - จัดด้านจากหัวข้อ (topic) → ชื่อประเด็น → คำอธิบาย ตามคำสำคัญ
   แสดงใต้การ์ดสรุปของผลตรวจทุกครั้ง (ผลจริง ผลตัวอย่าง และผลจากประวัติ) */
(function () {
  'use strict';
  var OVR = { check_detail: 15, caution: 7, low: 2 }, CAT_D = { check_detail: 35, caution: 18, low: 6 };
  // ลำดับ = ลำดับการจับคำ (ด้านที่เฉพาะเจาะจงกว่ามาก่อน เช่น "ค่าซ่อม" = ความรับผิด ไม่ใช่การเงิน)
  var ORDER = ['end', 'liab', 'rights', 'money', 'time'];
  var CATS = [
    { k: 'money', n: 'การเงิน', s: 'เงิน', ic: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/>', re: /ค่าเช่า|เงิน|ค่าปรับ|ดอกเบี้ย|ราคา|ชำระ|จ่าย|มัดจำ|บาท|ค่าจ้าง|ค่าคอม|ค่าธรรมเนียม|ค่าไฟ|ค่าน้ำ|ภาษี|%|ค่า|pay|fee|price|interest|deposit/i },
    { k: 'end', n: 'การยกเลิก / ต่อสัญญา', s: 'ยกเลิก', ic: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/>', re: /ยกเลิก|เลิกสัญญา|บอกเลิก|ต่อสัญญา|ต่ออายุ|ย้ายออก|สิ้นสุด|หมดสัญญา|ผิดสัญญา|ผิดนัด|cancel|terminat|renew/i },
    { k: 'liab', n: 'ความรับผิด', s: 'รับผิด', ic: '<path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="M12 8.5v4.5M12 15.8v.2"/>', re: /รับผิด|เสียหาย|ซ่อม|ชดใช้|ชดเชย|ค้ำ|ยึด|ฟ้อง|ศาล|หลักประกัน|สูญหาย|ของหาย|liab|damage|indemn/i },
    { k: 'time', n: 'เวลาและกำหนดส่ง', s: 'เวลา', ic: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', re: /วัน|เวลา|กำหนด|ล่วงหน้า|ระยะ|ส่งมอบ|ล่าช้า|เกินเวลา|โอที|ชั่วโมง|เดือน|ปี|deadline|delay|notice/i },
    { k: 'rights', n: 'สิทธิ์ของคุณ', s: 'สิทธิ์', ic: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5"/>', re: /ความเป็นส่วนตัว|เข้าห้อง|เข้าบ้าน|เข้าตรวจ|ข้อมูลส่วนตัว|ความลับ|เปิดเผย|ห้าม|แข่งขัน|คู่แข่ง|เลี้ยงสัตว์|ลิขสิทธิ์|ทรัพย์สินทางปัญญา|privacy|confiden|compete/i }
  ];
  var BYK = {}; CATS.forEach(function (c) { BYK[c.k] = c; });
  var LV = { check_detail: 'สำคัญ', caution: 'ควรระวัง', low: 'เล็กน้อย' };
  function lv(it) { return OVR[it && it.level] != null ? it.level : 'low'; }
  function catOf(it) {
    var fields = [it.topic, it.title, it.explanation];
    for (var f = 0; f < fields.length; f++) {
      var s = String(fields[f] || ''); if (!s) continue;
      for (var c = 0; c < ORDER.length; c++) if (BYK[ORDER[c]].re.test(s)) return ORDER[c];
    }
    return 'rights';
  }
  function band(s) {
    return s >= 80 ? { k: 'good', t: 'ดี', c: '#34d399', m: 'ไม่พบจุดเสี่ยงร้ายแรง อ่านทวนอีกรอบก่อนเซ็นก็พอ' }
      : s >= 60 ? { k: 'ok', t: 'พอใช้', c: '#a3d65c', m: 'มีบางข้อควรถามหรือขอเขียนให้ชัดก่อนเซ็น' }
      : s >= 40 ? { k: 'warn', t: 'ควรระวัง', c: '#f5c451', m: 'ควรขอแก้ข้อที่สำคัญก่อนเซ็น' }
      : { k: 'bad', t: 'เสี่ยงสูง', c: '#f2555a', m: 'มีหลายข้อที่อาจทำให้เสียเงินหรือเสียสิทธิ์ ควรขอแก้ก่อนเซ็น' };
  }
  function compute(result, fixed) {
    var items = (result && result.items) || [], score = 100, per = {}, log = [], fx = fixed || {};
    CATS.forEach(function (c) { per[c.k] = { s: 100, items: [] }; });
    items.forEach(function (it, i) {
      var l = lv(it), c = catOf(it), f = !!fx[i];
      if (!f) { score -= OVR[l]; per[c].s -= CAT_D[l]; }
      per[c].items.push({ i: i, it: it, l: l, f: f });
      log.push({ i: i, it: it, l: l, c: c, d: OVR[l], f: f });
    });
    CATS.forEach(function (c) { per[c.k].s = Math.max(0, per[c.k].s); });
    var open = items.filter(function (x, i) { return !fx[i]; });
    return { score: open.length ? Math.max(5, score) : 100, per: per, log: log, n: items.length,
      hi: open.filter(function (x) { return lv(x) === 'check_detail'; }).length,
      done: items.length - open.length };
  }

  var css = '' +
    '.vhs{position:relative;margin:14px 0;padding:18px 16px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.09);color:#ececef;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif;' +
      'background:radial-gradient(110% 80% at 0% 0%,color-mix(in srgb,var(--hc) 16%,transparent),transparent 60%),#141519;box-shadow:0 16px 36px -22px rgba(0,0,0,.8)}' +
    '.vhs *{box-sizing:border-box}' +
    '.vhs-top{display:flex;align-items:center;gap:16px}' +
    '.vhs-ring{position:relative;flex:none;width:112px;height:112px}' +
    '.vhs-ring svg{width:112px !important;height:112px !important;max-width:none !important;display:block;transform:rotate(-90deg)}' +
    '.vhs-ring .bg{stroke:rgba(255,255,255,.08)}' +
    '.vhs-ring .fg{stroke:var(--hc);stroke-linecap:round;transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--hc) 60%,transparent))}' +
    '.vhs-num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}' +
    '.vhs-num b{font:700 34px/1 Prompt,sans-serif;color:#fff;font-variant-numeric:tabular-nums}' +
    '.vhs-num small{margin-top:3px;font:500 11px/1 Prompt,sans-serif;color:#8d8d96}' +
    '.vhs-k{margin:0;font:500 12px/1.3 Prompt,sans-serif;color:#9a9aa3;letter-spacing:.02em}' +
    '.vhs-band{display:inline-flex;align-items:center;gap:6px;margin:4px 0 4px;padding:4px 11px;border-radius:999px;font:700 15px/1.2 Prompt,sans-serif;color:#141519;background:var(--hc)}' +
    '.vhs-msg{margin:0;font:400 13px/1.5 Prompt,sans-serif;color:#c9c9cf}' +
    '.vhs-cats{display:grid;gap:4px;margin-top:16px}' +
    '.vhs-cat{display:grid;grid-template-columns:30px minmax(0,1fr) auto;align-items:center;gap:4px 10px;width:100%;padding:8px 6px;border:0;border-radius:12px;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit;transition:background .2s}' +
    '.vhs-cat:hover,.vhs-cat[aria-expanded="true"]{background:rgba(255,255,255,.04)}' +
    '.vhs-cat:disabled{cursor:default}.vhs-cat:disabled:hover{background:transparent}' +
    '.vhs-ci{grid-row:1 / span 2;display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:color-mix(in srgb,var(--cc) 16%,transparent);color:var(--cc)}' +
    '.vhs-ci svg{width:17px !important;height:17px !important;max-width:none !important;display:block;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vhs-cn{font:500 13.5px/1.3 Prompt,sans-serif;color:#e4e4e7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vhs-cs{font:600 13px/1.3 Prompt,sans-serif;color:var(--cc);font-variant-numeric:tabular-nums;text-align:right}' +
    '.vhs-cs em{font-style:normal;font-weight:400;color:#8d8d96;font-size:11.5px;margin-left:4px}' +
    '.vhs-bar{grid-column:2 / span 2;height:6px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden}' +
    '.vhs-bar i{display:block;height:100%;width:0;border-radius:4px;background:var(--cc);transition:width 1s cubic-bezier(.2,.8,.2,1)}' +
    '.vhs-list{margin:2px 0 6px 40px;padding:0;list-style:none;display:grid;gap:4px}' +
    '.vhs-list[hidden]{display:none}' +
    '.vhs-list button[data-go]{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#e4e4e7;font:400 13px/1.35 Prompt,sans-serif;text-align:left;cursor:pointer}' +
    '.vhs-list button[data-go] i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--lc)}' +
    '.vhs-list button[data-go] span{flex:1;min-width:0}.vhs-list button[data-go] b{flex:none;font-weight:500;color:#8d8d96;font-size:11.5px}' +
    '.vhs-how{margin-top:10px;border-top:1px solid rgba(255,255,255,.07);padding-top:8px}' +
    '.vhs-how summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 2px;font:500 12.5px/1.4 Prompt,sans-serif;color:#a1a1aa}' +
    '.vhs-how summary::-webkit-details-marker{display:none}' +
    '.vhs-how summary::after{content:"›";margin-left:auto;transition:transform .2s;font-size:16px}.vhs-how[open] summary::after{transform:rotate(90deg)}' +
    '.vhs-how ol{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:3px;font:400 12.5px/1.45 Prompt,sans-serif;color:#c9c9cf}' +
    '.vhs-how li{display:flex;gap:8px}.vhs-how li b{flex:none;min-width:34px;color:#f2555a;font-variant-numeric:tabular-nums}' +
    '.vhs-how li.cau b{color:#f5c451}.vhs-how li.low b{color:#a1a1aa}' +
    '.vhs-how p{margin:8px 0 0;font:400 11.5px/1.5 Prompt,sans-serif;color:#8d8d96}' +
    '@media (max-width:420px){.vhs{padding:16px 13px 12px}.vhs-ring,.vhs-ring svg{width:96px !important;height:96px !important}.vhs-num b{font-size:29px}.vhs-top{gap:13px}}' +
    '@media (prefers-reduced-motion:reduce){.vhs-ring .fg,.vhs-bar i{transition:none}}' +
    /* (1) ถ้าแก้แล้ว · (2) ติ๊กแก้แล้ว · (3) เทียบค่าเฉลี่ย · (5) แชร์ */
    '.vhs-goal{display:flex;align-items:center;gap:10px;width:100%;margin-top:14px;padding:10px 12px;border-radius:14px;border:1px dashed color-mix(in srgb,var(--gc,#34d399) 55%,transparent);background:color-mix(in srgb,var(--gc,#34d399) 8%,transparent);color:#e4e4e7;font:500 13px/1.45 Prompt,sans-serif;text-align:left;cursor:pointer}' +
    '.vhs-goal b{color:var(--gc,#34d399);font-weight:700}.vhs-goal .ar{margin-left:auto;flex:none;font-size:16px;color:#a1a1aa}' +
    '.vhs-goal .gi{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:color-mix(in srgb,var(--gc,#34d399) 20%,transparent);font-size:15px}' +
    '.vhs-goal.win{border-style:solid}' +
    '.vhs-bench{margin:10px 2px 0;font:400 12.5px/1.5 Prompt,sans-serif;color:#a1a1aa}.vhs-bench b{color:#e4e4e7;font-weight:600}.vhs-bench .up{color:#34d399}.vhs-bench .dn{color:#f5a3a5}' +
    /* (1) ย่อ-ขยาย */
    '.vhs-more{display:none}.vhs.open .vhs-more{display:block;animation:vhsIn .35s cubic-bezier(.25,.8,.3,1)}' +
    '@keyframes vhsIn{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}' +
    '.vhs.open .vhs-mini{display:none}' +
    '.vhs-mini{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:14px;padding:12px 8px 8px;border-radius:14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06)}' +
    '.vhs-mb{display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0}' +
    '.vhs-mb b{font:700 15px/1 Prompt,sans-serif;color:var(--cc);font-variant-numeric:tabular-nums}' +
    '.vhs-mb i{position:relative;width:12px;height:44px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}' +
    '.vhs-mb u{position:absolute;left:0;right:0;bottom:0;height:0;border-radius:6px;background:var(--cc);transition:height 1s cubic-bezier(.2,.8,.2,1)}' +
    '.vhs-mb small{font:500 11.5px/1.2 Prompt,sans-serif;color:#a1a1aa;white-space:nowrap}' +
    '.vhs-acts .vhs-tog{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:0 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--hc) 45%,transparent);background:color-mix(in srgb,var(--hc) 10%,transparent);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vhs-tog svg{width:16px !important;height:16px !important;max-width:none !important;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;transition:transform .3s}' +
    '.vhs.open .vhs-tog svg{transform:rotate(180deg)}' +
    '.vhs-acts .vhs-share{flex:none}' +
    /* (2)+(3) รายการประเด็นแบบการ์ดเล็ก */
    '.vhs-list li{display:block;padding:9px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);transition:opacity .25s,background .25s}' +
    '.vhs-list li.f{background:rgba(52,211,153,.05);border-color:rgba(52,211,153,.2)}' +
    '.vhs-it-top{display:flex;align-items:flex-start;gap:8px}' +
    '.vhs-list .vhs-it-top button[data-go]{flex:1;min-width:0;padding:0 !important;border:0 !important;background:transparent !important;font:500 13.5px/1.4 Prompt,sans-serif}' +
    '.vhs-list .vhs-it-top button[data-go] i{margin-top:6px}' +
    '.vhs-pts{flex:none;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--lc) 18%,transparent);color:var(--lc);font:700 12px/1.2 Prompt,sans-serif;font-variant-numeric:tabular-nums}' +
    '.vhs-list li.f .vhs-pts{background:rgba(52,211,153,.15);color:#34d399}' +
    '.vhs-it-act{display:flex;align-items:center;gap:6px;margin-top:8px;padding-left:16px}' +
    '.vhs-it-act small{margin-right:auto;font:500 11.5px/1 Prompt,sans-serif;color:var(--lc)}' +
    '.vhs-list .vhs-hw,.vhs-list .vhs-fix{min-height:32px !important;padding:0 10px !important;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#d4d4d8;font:500 12px/1 Prompt,sans-serif;cursor:pointer;white-space:nowrap}' +
    '.vhs-list .vhs-hw[aria-expanded="true"]{background:rgba(245,196,81,.1);border-color:rgba(245,196,81,.4);color:#f5d27a}' +
    '.vhs-it-how{margin:8px 0 2px 16px;padding:10px 12px;border-radius:10px;background:rgba(245,196,81,.06);border:1px solid rgba(245,196,81,.2)}' +
    '.vhs-it-how[hidden]{display:none}' +
    '.vhs-it-how p{margin:0 0 6px;font:400 13px/1.55 Prompt,sans-serif;color:#e4e4e7}.vhs-it-how p b{display:block;margin-bottom:1px;font:600 11.5px/1.3 Prompt,sans-serif;color:#f5c451}' +
    '.vhs-it-how .vhs-copy{width:100%;min-height:36px;margin-top:4px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#ececef;font:600 12.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vhs-list .vhs-fix{flex:none;width:auto !important;display:flex;align-items:center;gap:5px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#bdbdc4;font:500 12px/1 Prompt,sans-serif;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s,border-color .2s}' +
    '.vhs-list .vhs-fix i{width:15px;height:15px;border-radius:5px;border:1.6px solid currentColor;display:grid;place-items:center;font-style:normal;font-size:10px;line-height:1}' +
    '.vhs-list .vhs-fix.on{background:rgba(52,211,153,.14);border-color:rgba(52,211,153,.5);color:#34d399}' +
    '.vhs-list li.f .vhs-it-top button[data-go] span{text-decoration:line-through;text-decoration-color:rgba(255,255,255,.35);color:#8d8d96}' +
    '.vhs-done{margin-left:6px;font:500 11px/1 Prompt,sans-serif;color:#34d399}' +
    '.vhs-how li.f{opacity:.45}.vhs-how li.f b{color:#34d399 !important}' +
    '.vhs-acts{display:flex;gap:8px;margin-top:12px}' +
    '.vhs-share{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vhs-share svg{width:17px !important;height:17px !important;max-width:none !important;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.vhs-conf{position:absolute;left:68px;top:68px;width:0;height:0;pointer-events:none;z-index:3}' +
    '.vhs-conf i{position:absolute;width:6px;height:9px;border-radius:1.5px;opacity:0;animation:vhsConf 1.2s cubic-bezier(.15,.6,.35,1) forwards}' +
    '@keyframes vhsConf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}' +
    '.vhs-lvup{position:absolute;left:50%;top:10px;transform:translateX(-50%);padding:6px 12px;border-radius:999px;background:var(--hc);color:#141519;font:700 12.5px/1 Prompt,sans-serif;white-space:nowrap;animation:vhsUp 2.2s ease forwards;pointer-events:none;z-index:4}' +
    '@keyframes vhsUp{0%{opacity:0;transform:translate(-50%,8px) scale(.8)}12%{opacity:1;transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-6px)}}' +
    '.vhs-band,.vhs-ring .fg{transition:background .4s,stroke .4s,stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)}' +
    '';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var LC = { check_detail: '#f2555a', caution: '#f5c451', low: '#8d8d96' };
  var TYPE = { rent: 'สัญญาเช่า', sale: 'สัญญาซื้อขาย', employment: 'สัญญาจ้างงาน', service: 'สัญญาจ้างบริการ', loan: 'สัญญากู้ยืม', shareholder: 'สัญญาหุ้นส่วน', nda: 'สัญญารักษาความลับ', other: 'สัญญาประเภทอื่น' };

  /* (2) จำว่าข้อไหนแก้แล้ว (เก็บในเครื่อง ผูกกับผลตรวจฉบับนั้นด้วยลายนิ้วมือจากหัวข้อ) */
  function keyOf(result) {
    var s = (result.items || []).map(function (x) { return (x.level || '') + (x.title || ''); }).join('|'), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return 'vc_fix_' + (h >>> 0).toString(36);
  }
  function loadFix(k) { try { var a = JSON.parse(localStorage.getItem(k) || '[]'), o = {}; a.forEach(function (i) { o[i] = 1; }); return o; } catch (e) { return {}; } }
  function saveFix(k, o) { try { var a = Object.keys(o).filter(function (x) { return o[x]; }); if (a.length) localStorage.setItem(k, JSON.stringify(a)); else localStorage.removeItem(k); } catch (e) {} }

  /* (3) ค่าเฉลี่ยจริงจากเซิร์ฟเวอร์ (โหลดครั้งเดียว) */
  var benchP = null;
  function bench() { if (!benchP) benchP = fetch('/api/bench', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); return benchP; }

  var CIRC = 2 * Math.PI * 46;
  var ICON_SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12.5v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';

  function build(result) {
    var KEY = keyOf(result), fixed = loadFix(KEY), h0 = compute(result, {}), started = false, lastBand = null;
    var el = document.createElement('section'); el.className = 'vhs';
    el.innerHTML = '<div class="vhs-conf"></div><div class="vhs-top"><div class="vhs-ring"><svg viewBox="0 0 112 112" aria-hidden="true"><circle class="bg" cx="56" cy="56" r="46" fill="none" stroke-width="10"/>' +
      '<circle class="fg" cx="56" cy="56" r="46" fill="none" stroke-width="10" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + CIRC.toFixed(1) + '"/></svg>' +
      '<div class="vhs-num"><b>0</b><small>/ 100</small></div></div>' +
      '<div><p class="vhs-k">คะแนนสุขภาพสัญญา<span class="vhs-done"></span></p><span class="vhs-band"></span><p class="vhs-msg"></p></div></div>' +
      '<p class="vhs-bench" hidden></p>' +
      '<button type="button" class="vhs-goal" hidden></button>' +
      '<div class="vhs-mini">' + CATS.map(function (c) {
        return '<span class="vhs-mb" data-k="' + c.k + '"><b></b><i><u></u></i><small>' + c.s + '</small></span>';
      }).join('') + '</div>' +
      '<div class="vhs-more"><div class="vhs-cats">' + CATS.map(function (c) {
        var n = h0.per[c.k].items.length;
        return '<button type="button" class="vhs-cat" data-k="' + c.k + '"' + (n ? ' aria-expanded="false"' : ' disabled') + '>' +
          '<span class="vhs-ci"><svg viewBox="0 0 24 24" aria-hidden="true">' + c.ic + '</svg></span><span class="vhs-cn">' + c.n + '</span>' +
          '<span class="vhs-cs"></span><span class="vhs-bar"><i></i></span></button>' +
          (n ? '<ul class="vhs-list" data-for="' + c.k + '" hidden>' + h0.per[c.k].items.slice().sort(function (a, b) { return OVR[b.l] - OVR[a.l] || a.i - b.i; }).map(function (x) {
            var fix = String(x.it.suggested_fix || '').trim(), neg = String(x.it.how_to_negotiate || '').trim();
            return '<li data-i="' + x.i + '" style="--lc:' + LC[x.l] + '"><div class="vhs-it-top"><button type="button" data-go="' + x.i + '"><i></i><span>' + esc(x.it.title || 'ประเด็น') + '</span></button>' +
                '<span class="vhs-pts">+' + OVR[x.l] + '</span></div>' +
              '<div class="vhs-it-act"><small>' + LV[x.l] + '</small>' +
                (fix || neg ? '<button type="button" class="vhs-hw" data-how="' + x.i + '" aria-expanded="false">💡 ขอแก้ยังไง</button>' : '') +
                '<button type="button" class="vhs-fix" data-fix="' + x.i + '" aria-pressed="false"><i></i>แก้แล้ว</button></div>' +
              (fix || neg ? '<div class="vhs-it-how" hidden>' + (fix ? '<p><b>ขอแก้เป็น</b>' + esc(fix) + '</p>' : '') + (neg ? '<p><b>วิธีคุย</b>' + esc(neg) + '</p>' : '') +
                '<button type="button" class="vhs-copy" data-copy="' + x.i + '">📋 คัดลอกข้อความไปคุย</button></div>' : '') + '</li>';
          }).join('') + '</ul>' : '');
      }).join('') + '</div>' +
      '<details class="vhs-how"><summary>คะแนนนี้คิดยังไง</summary><ol></ol>' +
      '<p>เริ่มที่ 100 แล้วหักตามประเด็นที่ระบบพบ: สำคัญ −15 · ควรระวัง −7 · เล็กน้อย −2 (ต่ำสุด 5) · คะแนนแต่ละด้านหัก −35 / −18 / −6 · ข้อที่ติ๊ก "แก้แล้ว" ไม่หักคะแนน · เป็นตัวช่วยดูภาพรวม ไม่ใช่ความเห็นทางกฎหมาย</p></details>' +
      '</div><div class="vhs-acts"><button type="button" class="vhs-tog" aria-expanded="false"><span>ดูรายละเอียดและวิธีแก้</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
      '<button type="button" class="vhs-share" aria-label="แชร์คะแนน (ไม่มีข้อความสัญญา)">' + ICON_SHARE + '<span>แชร์</span></button></div>';
    var $ = function (q) { return el.querySelector(q); };

    function confetti() {
      var box = $('.vhs-conf'), C = ['#ffd84d', '#34d399', '#f472b6', '#60a5fa', '#fb923c'];
      for (var i = 0; i < 18; i++) {
        var c = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 50;
        c.style.background = C[i % C.length]; c.style.setProperty('--x', Math.round(Math.cos(a) * d) + 'px'); c.style.setProperty('--y', Math.round(Math.sin(a) * d) + 'px'); c.style.setProperty('--r', Math.round(Math.random() * 540 - 270) + 'deg');
        box.appendChild(c);
      }
      setTimeout(function () { box.innerHTML = ''; }, 1400);
    }
    var shown = 0;
    function render(animate) {
      var h = compute(result, fixed), b = band(h.score);
      el.style.setProperty('--hc', b.c);
      el.setAttribute('aria-label', 'คะแนนสุขภาพสัญญา ' + h.score + ' จาก 100 ระดับ' + b.t);
      $('.vhs-band').textContent = b.t;
      $('.vhs-msg').textContent = h.hi ? 'มี ' + h.hi + ' ข้อสำคัญ — ' + b.m : (h.done && h.done === h.n ? 'แก้ครบทุกข้อแล้ว เยี่ยมมาก! อ่านทวนฉบับแก้อีกรอบก่อนเซ็น' : b.m);
      $('.vhs-done').textContent = h.done ? ' · แก้แล้ว ' + h.done + '/' + h.n : '';
      // วงแหวน + ตัวเลข
      if (started) {
        $('.fg').style.strokeDashoffset = (CIRC * (1 - h.score / 100)).toFixed(1);
        var num = $('.vhs-num b'), from = shown, to = h.score, t0 = performance.now(), dur = animate === false ? 0 : 900;
        (function tick(now) { var p = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - p, 3); num.textContent = Math.round(from + (to - from) * e); if (p < 1) requestAnimationFrame(tick); })(t0);
        shown = to;
      }
      // ด้านต่าง ๆ
      CATS.forEach(function (c) {
        var p = h.per[c.k], n = p.items.length, open = p.items.filter(function (x) { return !x.f; }).length, btn = el.querySelector('.vhs-cat[data-k="' + c.k + '"]');
        var cc = n && open ? band(p.s).c : '#34d399';
        btn.style.setProperty('--cc', cc);
        btn.querySelector('.vhs-cs').innerHTML = p.s + '<em>' + (!n ? 'ไม่พบปัญหา' : open ? open + ' ประเด็น' : 'แก้ครบแล้ว ✓') + '</em>';
        if (started) btn.querySelector('.vhs-bar i').style.width = p.s + '%';
        var mb = el.querySelector('.vhs-mb[data-k="' + c.k + '"]');
        mb.style.setProperty('--cc', cc); mb.querySelector('b').textContent = p.s;
        if (started) mb.querySelector('u').style.height = Math.max(4, p.s) + '%';
        mb.title = c.n + ' ' + p.s + '/100';
      });
      [].forEach.call(el.querySelectorAll('.vhs-list li'), function (li) {
        var i = li.getAttribute('data-i'), on = !!fixed[i], fb = li.querySelector('.vhs-fix');
        li.classList.toggle('f', on); fb.classList.toggle('on', on); fb.setAttribute('aria-pressed', String(on));
        var pt = li.querySelector('.vhs-pts'); if (pt) pt.textContent = on ? '✓' : '+' + OVR[lv(result.items[i])];
        fb.innerHTML = '<i>' + (on ? '✓' : '') + '</i>' + (on ? 'แก้แล้ว' : 'แก้แล้ว?');
      });
      // คะแนนนี้คิดยังไง
      $('.vhs-how ol').innerHTML = h.log.length ? h.log.map(function (x) {
        return '<li class="' + (x.f ? 'f ' : '') + (x.l === 'caution' ? 'cau' : x.l === 'low' ? 'low' : '') + '"><b>' + (x.f ? '±0' : '−' + x.d) + '</b><span>' + esc(x.it.title || '') + ' · ' + LV[x.l] + (x.f ? ' · แก้แล้ว' : '') + '</span></li>';
      }).join('') : '<li><b style="color:#34d399">±0</b><span>ไม่พบประเด็นที่ต้องหักคะแนน</span></li>';
      // (1) ถ้าแก้แล้วคะแนนจะเป็นเท่าไร
      var goal = $('.vhs-goal'), openHi = [], openCau = [];
      h.log.forEach(function (x) { if (!x.f) (x.l === 'check_detail' ? openHi : x.l === 'caution' ? openCau : []).push(x.i); });
      var tgt = openHi.length ? openHi : openCau;
      if (!h.n) goal.hidden = true;
      else if (!tgt.length) {
        goal.hidden = false; goal.className = 'vhs-goal win'; goal.style.setProperty('--gc', '#34d399');
        goal.innerHTML = '<span class="gi">🏆</span><span>' + (h.done ? 'แก้ข้อสำคัญและข้อควรระวังครบแล้ว คะแนนตอนนี้ <b>' + h.score + '</b>' : 'ไม่มีข้อสำคัญหรือข้อควรระวัง') + '</span>';
        goal.removeAttribute('data-open');
      } else {
        var f2 = {}; for (var k in fixed) f2[k] = fixed[k]; tgt.forEach(function (i) { f2[i] = 1; });
        var after = compute(result, f2).score, bb = band(after);
        goal.hidden = false; goal.className = 'vhs-goal'; goal.style.setProperty('--gc', bb.c);
        goal.setAttribute('data-open', tgt.join(','));
        goal.innerHTML = '<span class="gi">🎯</span><span>ขอแก้ ' + tgt.length + ' ข้อ' + (openHi.length ? 'สำคัญ' : 'ควรระวัง') + ' → คะแนนขึ้นเป็น <b>' + after + ' (' + bb.t + ')</b></span><span class="ar">›</span>';
      }
      // เลื่อนระดับ = ฉลอง
      if (lastBand && lastBand !== b.k && started && h.score > 0) {
        var order = ['bad', 'warn', 'ok', 'good'];
        if (order.indexOf(b.k) > order.indexOf(lastBand)) {
          confetti(); var up = document.createElement('span'); up.className = 'vhs-lvup'; up.textContent = '⬆ ขึ้นเป็น "' + b.t + '"'; el.appendChild(up); setTimeout(function () { if (up.parentNode) up.parentNode.removeChild(up); }, 2300);
        }
      }
      lastBand = b.k;
      return h;
    }
    render(false);

    /* (3) เทียบค่าเฉลี่ย */
    var tp = (document.getElementById('contractType') || {}).value;
    if (!tp || tp === 'unsure') tp = result.detected_type || '';
    bench().then(function (d) {
      if (!d) return;
      var g = d.types && d.types[tp], label = g ? TYPE[tp] || 'สัญญาประเภทนี้' : 'สัญญาทั้งหมด', avg = g || d.all;
      if (!avg) return;
      var sc = compute(result, {}).score, diff = sc - avg.avg, p = $('.vhs-bench');
      p.innerHTML = '📊 ' + label + 'ที่ตรวจในเว็บนี้ได้เฉลี่ย <b>' + avg.avg + '</b> (' + avg.n.toLocaleString() + ' ฉบับ) · ฉบับนี้ ' +
        (diff === 0 ? 'เท่ากับค่าเฉลี่ย' : '<span class="' + (diff > 0 ? 'up' : 'dn') + '">' + (diff > 0 ? 'สูงกว่า ' : 'ต่ำกว่า ') + Math.abs(diff) + ' คะแนน</span>');
      p.hidden = false;
    });

    el.addEventListener('click', function (e) {
      var fx = e.target.closest('[data-fix]');
      if (fx) { var i = fx.getAttribute('data-fix'); if (fixed[i]) delete fixed[i]; else fixed[i] = 1; saveFix(KEY, fixed); render(); return; }
      var g = e.target.closest('[data-go]');
      if (g) {
        var ii = g.getAttribute('data-go'), row = document.querySelector('#result .ix-row[data-ixcard="' + ii + '"]');
        if (row) { if (row.hidden) { var m = document.querySelector('#result [data-ixmore]'); if (m) m.click(); } row.click(); }
        else { var it = document.getElementById('issue-' + ii); if (it) { it.open = true; it.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
        return;
      }
      if (e.target.closest('.vhs-tog')) { setOpen(!el.classList.contains('open')); return; }
      var hw = e.target.closest('[data-how]');
      if (hw) { var box = hw.closest('li').querySelector('.vhs-it-how'), o = box.hidden; box.hidden = !o; hw.setAttribute('aria-expanded', String(o)); hw.textContent = o ? '💡 ซ่อนวิธีแก้' : '💡 ขอแก้ยังไง'; return; }
      var cp = e.target.closest('[data-copy]');
      if (cp) {
        var it2 = result.items[+cp.getAttribute('data-copy')] || {}, txt = 'ขอปรับแก้เรื่อง "' + (it2.title || '').replace(/\?$/, '') + '" ครับ/ค่ะ' + (it2.suggested_fix ? '\nเสนอให้แก้เป็น: ' + it2.suggested_fix : '');
        copyText(txt, function (ok) { cp.textContent = ok ? '✓ คัดลอกแล้ว วางในแชตได้เลย' : 'คัดลอกไม่ได้ ลองกดค้างที่ข้อความแทน'; setTimeout(function () { cp.textContent = '📋 คัดลอกข้อความไปคุย'; }, 2200); });
        return;
      }
      var gl = e.target.closest('.vhs-goal[data-open]');
      if (gl) {
        setOpen(true);   // เปิดด้านที่มีข้อที่ควรแก้ให้เห็นทันที
        var want = gl.getAttribute('data-open').split(','), cats = {};
        compute(result, fixed).log.forEach(function (x) { if (want.indexOf(String(x.i)) >= 0) cats[x.c] = 1; });
        Object.keys(cats).forEach(function (k) { var b = el.querySelector('.vhs-cat[data-k="' + k + '"]'), l = el.querySelector('.vhs-list[data-for="' + k + '"]'); if (b && l) { b.setAttribute('aria-expanded', 'true'); l.hidden = false; } });
        var first = el.querySelector('.vhs-list:not([hidden])'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
      if (e.target.closest('.vhs-share')) { share(result, compute(result, fixed)); return; }
      var c = e.target.closest('.vhs-cat'); if (!c || c.disabled) return;
      var list = el.querySelector('.vhs-list[data-for="' + c.getAttribute('data-k') + '"]'), open = c.getAttribute('aria-expanded') !== 'true';
      c.setAttribute('aria-expanded', String(open)); if (list) list.hidden = !open;
    });

    function setOpen(o) {
      el.classList.toggle('open', o);
      var t = el.querySelector('.vhs-tog'); t.setAttribute('aria-expanded', String(o)); t.querySelector('span').textContent = o ? 'ย่อการ์ด' : 'ดูรายละเอียดและวิธีแก้';
      if (!o) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function copyText(t, cb) {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { cb(true); }, function () { cb(fallback()); });
      else cb(fallback());
      function fallback() { try { var a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); var ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; } }
    }
    function play() { if (started) return; started = true; shown = 0; render(); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: .3 }); io.observe(el);
    } else play();
    setTimeout(play, 4000);
    return el;
  }

  /* (5) รูปการ์ดคะแนนสำหรับแชร์ (วาดด้วย canvas · ไม่มีข้อความจากสัญญา มีแค่ตัวเลข ระดับ และชื่อด้าน) */
  function share(result, h) {
    var W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var x = cv.getContext('2d'), b = band(h.score), F = '"Prompt","Sukhumvit Set","Noto Sans Thai",sans-serif';
    function rr(X, Y, w, hh, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + hh, r); x.arcTo(X + w, Y + hh, X, Y + hh, r); x.arcTo(X, Y + hh, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
    var go = function () {
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1b1c22'); g.addColorStop(1, '#0e0f12'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      var rg = x.createRadialGradient(240, 220, 10, 240, 220, 620); rg.addColorStop(0, b.c + '44'); rg.addColorStop(1, 'transparent'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
      x.fillStyle = '#a1a1aa'; x.font = '500 34px ' + F; x.fillText('คะแนนสุขภาพสัญญา', 80, 130);
      var tp = (document.getElementById('contractType') || {}).value; if (!tp || tp === 'unsure') tp = result.detected_type || '';
      x.fillStyle = '#ececef'; x.font = '700 52px ' + F; x.fillText(TYPE[tp] || 'สัญญา', 80, 200);
      // วงแหวน
      var cx = 300, cy = 470, R = 170; x.lineWidth = 36; x.lineCap = 'round';
      x.strokeStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = b.c; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * h.score / 100); x.stroke();
      x.textAlign = 'center'; x.fillStyle = '#fff'; x.font = '700 130px ' + F; x.fillText(String(h.score), cx, cy + 40);
      x.fillStyle = '#8d8d96'; x.font = '500 34px ' + F; x.fillText('/ 100', cx, cy + 95); x.textAlign = 'left';
      // ระดับ
      x.font = '700 54px ' + F; var tw = x.measureText(b.t).width; rr(560, 380, tw + 64, 92, 46); x.fillStyle = b.c; x.fill();
      x.fillStyle = '#141519'; x.fillText(b.t, 592, 444);
      x.fillStyle = '#c9c9cf'; x.font = '400 32px ' + F;
      x.fillText(h.hi ? 'มี ' + h.hi + ' ข้อสำคัญที่ควรขอแก้' : 'ไม่มีข้อสำคัญค้างอยู่', 560, 530);
      if (h.done) { x.fillStyle = '#34d399'; x.fillText('แก้แล้ว ' + h.done + '/' + h.n + ' ข้อ', 560, 580); }
      // 5 ด้าน
      var y = 730;
      CATS.forEach(function (c) {
        var p = h.per[c.k], n = p.items.length, cc = n ? band(p.s).c : '#34d399';
        x.fillStyle = '#e4e4e7'; x.font = '500 36px ' + F; x.fillText(c.n, 80, y);
        x.textAlign = 'right'; x.fillStyle = cc; x.font = '700 38px ' + F; x.fillText(String(p.s), W - 80, y); x.textAlign = 'left';
        rr(80, y + 22, W - 160, 16, 8); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
        if (p.s > 0) { rr(80, y + 22, Math.max(16, (W - 160) * p.s / 100), 16, 8); x.fillStyle = cc; x.fill(); }
        y += 88;
      });
      // ท้าย
      x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(80, H - 170, W - 160, 2);
      x.fillStyle = '#ececef'; x.font = '700 40px ' + F; x.fillText('Vellum Check', 80, H - 100);
      x.fillStyle = '#8d8d96'; x.font = '400 28px ' + F; x.fillText('ตรวจสัญญาก่อนเซ็นที่ vellumcheck.com · ไม่ใช่คำปรึกษาทางกฎหมาย', 80, H - 55);
      cv.toBlob(function (blob) {
        if (!blob) return;
        var file = new File([blob], 'vellum-score-' + h.score + '.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'คะแนนสุขภาพสัญญา ' + h.score + '/100', text: 'ตรวจสัญญาก่อนเซ็นที่ vellumcheck.com' }).catch(function () {});
        } else {
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
        }
      }, 'image/png');
    };
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 52px Prompt'), document.fonts.load('400 32px Prompt')]).then(go, go); else go();
  }

  function attach() {
    var res = document.getElementById('result'); if (!res) return;
    var rpt = res.querySelector('.rpt'); if (!rpt || rpt.querySelector(':scope > .vhs')) return;
    var data = typeof lastResult !== 'undefined' ? lastResult : null;   // ตัวแปรจาก script.js
    if (!data || !Array.isArray(data.items)) return;
    var el = build(data), anchor = rpt.querySelector(':scope > .vc-sum') || rpt.querySelector(':scope > .rpt-head');
    if (anchor && anchor.nextSibling) rpt.insertBefore(el, anchor.nextSibling); else rpt.insertBefore(el, rpt.firstChild);
  }
  function boot() {
    var res = document.getElementById('result'); if (!res) return;
    var q = false;
    new MutationObserver(function () { if (q) return; q = true; setTimeout(function () { q = false; attach(); }, 120); }).observe(res, { childList: true, subtree: true });
    attach();
  }
  window.VCHealth = { compute: compute };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
