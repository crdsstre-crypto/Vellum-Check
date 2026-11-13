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
    { k: 'money', n: 'การเงิน', ic: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/>', re: /ค่าเช่า|เงิน|ค่าปรับ|ดอกเบี้ย|ราคา|ชำระ|จ่าย|มัดจำ|บาท|ค่าจ้าง|ค่าคอม|ค่าธรรมเนียม|ค่าไฟ|ค่าน้ำ|ภาษี|%|ค่า|pay|fee|price|interest|deposit/i },
    { k: 'end', n: 'การยกเลิก / ต่อสัญญา', ic: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/>', re: /ยกเลิก|เลิกสัญญา|บอกเลิก|ต่อสัญญา|ต่ออายุ|ย้ายออก|สิ้นสุด|หมดสัญญา|ผิดสัญญา|ผิดนัด|cancel|terminat|renew/i },
    { k: 'liab', n: 'ความรับผิด', ic: '<path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="M12 8.5v4.5M12 15.8v.2"/>', re: /รับผิด|เสียหาย|ซ่อม|ชดใช้|ชดเชย|ค้ำ|ยึด|ฟ้อง|ศาล|หลักประกัน|สูญหาย|ของหาย|liab|damage|indemn/i },
    { k: 'time', n: 'เวลาและกำหนดส่ง', ic: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', re: /วัน|เวลา|กำหนด|ล่วงหน้า|ระยะ|ส่งมอบ|ล่าช้า|เกินเวลา|โอที|ชั่วโมง|เดือน|ปี|deadline|delay|notice/i },
    { k: 'rights', n: 'สิทธิ์ของคุณ', ic: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5"/>', re: /ความเป็นส่วนตัว|เข้าห้อง|เข้าบ้าน|เข้าตรวจ|ข้อมูลส่วนตัว|ความลับ|เปิดเผย|ห้าม|แข่งขัน|คู่แข่ง|เลี้ยงสัตว์|ลิขสิทธิ์|ทรัพย์สินทางปัญญา|privacy|confiden|compete/i }
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
  function compute(result) {
    var items = (result && result.items) || [], score = 100, per = {}, log = [];
    CATS.forEach(function (c) { per[c.k] = { s: 100, items: [] }; });
    items.forEach(function (it, i) {
      var l = lv(it), c = catOf(it);
      score -= OVR[l]; per[c].s -= CAT_D[l]; per[c].items.push({ i: i, it: it, l: l });
      log.push({ i: i, it: it, l: l, c: c, d: OVR[l] });
    });
    CATS.forEach(function (c) { per[c.k].s = Math.max(0, per[c.k].s); });
    return { score: Math.max(items.length ? 5 : 100, score), per: per, log: log, n: items.length,
      hi: items.filter(function (x) { return lv(x) === 'check_detail'; }).length };
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
    '.vhs-list button{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#e4e4e7;font:400 13px/1.35 Prompt,sans-serif;text-align:left;cursor:pointer}' +
    '.vhs-list button i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--lc)}' +
    '.vhs-list button span{flex:1;min-width:0}.vhs-list button b{flex:none;font-weight:500;color:#8d8d96;font-size:11.5px}' +
    '.vhs-how{margin-top:10px;border-top:1px solid rgba(255,255,255,.07);padding-top:8px}' +
    '.vhs-how summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 2px;font:500 12.5px/1.4 Prompt,sans-serif;color:#a1a1aa}' +
    '.vhs-how summary::-webkit-details-marker{display:none}' +
    '.vhs-how summary::after{content:"›";margin-left:auto;transition:transform .2s;font-size:16px}.vhs-how[open] summary::after{transform:rotate(90deg)}' +
    '.vhs-how ol{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:3px;font:400 12.5px/1.45 Prompt,sans-serif;color:#c9c9cf}' +
    '.vhs-how li{display:flex;gap:8px}.vhs-how li b{flex:none;min-width:34px;color:#f2555a;font-variant-numeric:tabular-nums}' +
    '.vhs-how li.cau b{color:#f5c451}.vhs-how li.low b{color:#a1a1aa}' +
    '.vhs-how p{margin:8px 0 0;font:400 11.5px/1.5 Prompt,sans-serif;color:#8d8d96}' +
    '@media (max-width:420px){.vhs{padding:16px 13px 12px}.vhs-ring,.vhs-ring svg{width:96px !important;height:96px !important}.vhs-num b{font-size:29px}.vhs-top{gap:13px}}' +
    '@media (prefers-reduced-motion:reduce){.vhs-ring .fg,.vhs-bar i{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var LC = { check_detail: '#f2555a', caution: '#f5c451', low: '#8d8d96' };

  function build(result) {
    var h = compute(result), b = band(h.score), C = 2 * Math.PI * 46;
    var el = document.createElement('section'); el.className = 'vhs'; el.setAttribute('aria-label', 'คะแนนสุขภาพสัญญา ' + h.score + ' จาก 100');
    el.style.setProperty('--hc', b.c);
    var msg = h.hi ? 'มี ' + h.hi + ' ข้อสำคัญ — ' + b.m : b.m;
    el.innerHTML = '<div class="vhs-top"><div class="vhs-ring"><svg viewBox="0 0 112 112" aria-hidden="true"><circle class="bg" cx="56" cy="56" r="46" fill="none" stroke-width="10"/>' +
      '<circle class="fg" cx="56" cy="56" r="46" fill="none" stroke-width="10" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg>' +
      '<div class="vhs-num"><b>0</b><small>/ 100</small></div></div>' +
      '<div><p class="vhs-k">คะแนนสุขภาพสัญญา</p><span class="vhs-band">' + b.t + '</span><p class="vhs-msg">' + esc(msg) + '</p></div></div>' +
      '<div class="vhs-cats">' + CATS.map(function (c) {
        var p = h.per[c.k], cb = band(p.s), n = p.items.length;
        return '<button type="button" class="vhs-cat" data-k="' + c.k + '" style="--cc:' + (n ? cb.c : '#34d399') + '"' + (n ? ' aria-expanded="false"' : ' disabled') + '>' +
          '<span class="vhs-ci">' + '<svg viewBox="0 0 24 24" aria-hidden="true">' + c.ic + '</svg></span><span class="vhs-cn">' + c.n + '</span>' +
          '<span class="vhs-cs">' + p.s + '<em>' + (n ? n + ' ประเด็น' : 'ไม่พบปัญหา') + '</em></span><span class="vhs-bar"><i data-w="' + p.s + '"></i></span></button>' +
          (n ? '<ul class="vhs-list" data-for="' + c.k + '" hidden>' + p.items.map(function (x) {
            return '<li><button type="button" data-go="' + x.i + '" style="--lc:' + LC[x.l] + '"><i></i><span>' + esc(x.it.title || 'ประเด็น') + '</span><b>' + LV[x.l] + '</b></button></li>';
          }).join('') + '</ul>' : '');
      }).join('') + '</div>' +
      '<details class="vhs-how"><summary>คะแนนนี้คิดยังไง</summary><ol>' +
        (h.log.length ? h.log.map(function (x) {
          return '<li class="' + (x.l === 'caution' ? 'cau' : x.l === 'low' ? 'low' : '') + '"><b>−' + x.d + '</b><span>' + esc(x.it.title || '') + ' · ' + LV[x.l] + '</span></li>';
        }).join('') : '<li><b style="color:#34d399">±0</b><span>ไม่พบประเด็นที่ต้องหักคะแนน</span></li>') +
      '</ol><p>เริ่มที่ 100 แล้วหักตามประเด็นที่ระบบพบ: สำคัญ −15 · ควรระวัง −7 · เล็กน้อย −2 (ต่ำสุด 5) · คะแนนแต่ละด้านหัก −35 / −18 / −6 · เป็นตัวช่วยดูภาพรวม ไม่ใช่ความเห็นทางกฎหมาย</p></details>';

    /* แตะด้าน = ดูรายการประเด็นในด้านนั้น · แตะประเด็น = ไปที่ประเด็นในผลตรวจ */
    el.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]');
      if (g) {
        var i = g.getAttribute('data-go'), row = document.querySelector('#result .ix-row[data-ixcard="' + i + '"]');
        if (row) { if (row.hidden) { var m = document.querySelector('#result [data-ixmore]'); if (m) m.click(); } row.click(); }
        else { var it = document.getElementById('issue-' + i); if (it) { it.open = true; it.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
        return;
      }
      var c = e.target.closest('.vhs-cat'); if (!c || c.disabled) return;
      var list = el.querySelector('.vhs-list[data-for="' + c.getAttribute('data-k') + '"]'), open = c.getAttribute('aria-expanded') !== 'true';
      c.setAttribute('aria-expanded', String(open)); if (list) list.hidden = !open;
    });

    /* แอนิเมชันตอนเลื่อนมาเห็น: วงแหวนวิ่ง + ตัวเลขนับขึ้น + แถบด้านต่าง ๆ */
    var done = false;
    function play() {
      if (done) return; done = true;
      el.querySelector('.fg').style.strokeDashoffset = (C * (1 - h.score / 100)).toFixed(1);
      [].forEach.call(el.querySelectorAll('.vhs-bar i'), function (x) { x.style.width = x.getAttribute('data-w') + '%'; });
      var num = el.querySelector('.vhs-num b'), t0 = performance.now();
      (function tick(now) { var p = Math.min(1, (now - t0) / 1100), e2 = 1 - Math.pow(1 - p, 3); num.textContent = Math.round(h.score * e2); if (p < 1) requestAnimationFrame(tick); })(t0);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: .3 }); io.observe(el);
    } else play();
    setTimeout(play, 4000);
    return el;
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
