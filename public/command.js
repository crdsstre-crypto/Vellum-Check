/* ===== Command Center: ภาพรวมสัญญาทั้งหมดของลูกค้า (บนสุดของคลังรายงาน) =====
   ข้อมูลจาก /api/history/overview (ระดับ/หัวข้อของประเด็น + วันสำคัญ) · คะแนนคิดสูตรเดียวกับ health.js
   ไม่เรียก AI · ข้อที่ติ๊ก "แก้แล้ว" ในการ์ดคะแนนถูกนับด้วย (จำในเครื่อง) */
(function () {
  'use strict';
  var TYPE = { rent: 'สัญญาเช่า', sale: 'สัญญาซื้อขาย', employment: 'สัญญาจ้างงาน', service: 'สัญญาจ้างบริการ', loan: 'สัญญากู้ยืม', shareholder: 'สัญญาหุ้นส่วน', nda: 'สัญญารักษาความลับ', other: 'สัญญาอื่น ๆ', unsure: 'สัญญา' };
  var W = { check_detail: 15, caution: 7, low: 2 };
  var MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  function band(s) {
    if (window.VCHealth && VCHealth.band) return VCHealth.band(s);
    return s >= 80 ? { k: 'good', t: 'ดี', c: '#34d399' } : s >= 60 ? { k: 'ok', t: 'พอใช้', c: '#a3d65c' } : s >= 40 ? { k: 'warn', t: 'ควรระวัง', c: '#f5c451' } : { k: 'bad', t: 'เสี่ยงสูง', c: '#f2555a' };
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function thd(iso) { var d = new Date(iso); return isNaN(d) ? '' : d.getDate() + ' ' + MON[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2); }
  function days(ymd) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd || ''); if (!m) return null; var t = new Date(); t = new Date(t.getFullYear(), t.getMonth(), t.getDate()); return Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - t) / 864e5); }

  function scoreOf(ins) {
    var items = Array.isArray(ins.items) ? ins.items : [], fx = {};
    try { if (window.VCHealth && VCHealth.fixedOf) fx = VCHealth.fixedOf({ items: items }); } catch (e) {}
    var s = 100, open = [], done = 0;
    items.forEach(function (it, i) {
      var l = W[it && it.level] != null ? it.level : 'low';
      if (fx[i]) { done++; return; }
      s -= W[l]; if (l !== 'low') open.push({ i: i, l: l, t: it.title || '' });
    });
    var sc = items.length ? (items.length - done ? Math.max(5, s) : 100) : 100;
    var gain = open.reduce(function (a, x) { return a + W[x.l]; }, 0);
    return { s: sc, open: open, done: done, n: items.length, after: Math.min(100, sc + gain) };
  }
  function nameOf(ins) {
    var tp = ins.contract_type && ins.contract_type !== 'unsure' ? ins.contract_type : (ins.dt || 'unsure');
    return { t: (ins.title || '').trim() || TYPE[tp] || 'สัญญา', tp: TYPE[tp] || 'สัญญา' };
  }

  var css = '' +
    '.vcc{margin:0 0 14px;padding:16px 14px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.09);color:#ececef;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif;' +
      'background:radial-gradient(120% 70% at 0% 0%,rgba(245,196,81,.10),transparent 55%),radial-gradient(90% 70% at 100% 0%,rgba(52,211,153,.08),transparent 60%),#121317}' +
    '.vcc *{box-sizing:border-box}.vcc[hidden]{display:none}' +
    '.vcc-h{display:flex;align-items:center;gap:10px;margin:0 0 12px}' +
    '.vcc-h b{font:700 16px/1.3 Prompt,sans-serif}.vcc-h small{display:block;font:400 12px/1.3 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcc-h .ic{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:11px;background:rgba(245,196,81,.15);color:#f5c451}' +
    '.vcc svg{max-width:none !important}' +
    '.vcc-h .ic svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vcc-rf{margin-left:auto;width:34px;height:34px;min-height:0 !important;padding:0 !important;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#bdbdc4;cursor:pointer;display:grid;place-items:center}' +
    '.vcc-rf svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.vcc-rf.spin svg{animation:vccSpin .8s linear infinite}@keyframes vccSpin{to{transform:rotate(360deg)}}' +
    '.vcc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}' +
    '.vcc-st{padding:10px 6px 9px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);text-align:center;min-width:0}' +
    '.vcc-st b{display:block;font:700 22px/1.1 Prompt,sans-serif;font-variant-numeric:tabular-nums;color:var(--c,#ececef)}' +
    '.vcc-st small{display:block;margin-top:4px;font:500 11px/1.3 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcc-dist{display:flex;height:10px;margin:12px 0 4px;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.06)}' +
    '.vcc-dist i{height:100%;transition:width .8s cubic-bezier(.2,.8,.2,1)}' +
    '.vcc-leg{display:flex;flex-wrap:wrap;gap:4px 12px;font:400 11.5px/1.4 Prompt,sans-serif;color:#a1a1aa}.vcc-leg span::before{content:"";display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;background:var(--c)}' +
    '.vcc-sec{margin-top:16px}' +
    '.vcc-sec > p{margin:0 0 8px;font:600 13px/1.3 Prompt,sans-serif;color:#d4d4d8;display:flex;align-items:center;gap:6px}' +
    '.vcc-sec > p em{font-style:normal;font-weight:500;font-size:11.5px;color:#8d8d96}' +
    '.vcc-row{display:flex;align-items:center;gap:11px;width:100%;margin:0 0 6px;padding:9px 10px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);color:inherit;text-align:left;font:inherit;cursor:pointer;min-height:0 !important}' +
    '.vcc-row:active{transform:scale(.99)}' +
    '.vcc-mr{position:relative;flex:none;width:42px;height:42px}' +
    '.vcc-mr svg{width:42px;height:42px;display:block;transform:rotate(-90deg)}.vcc-mr .bg{stroke:rgba(255,255,255,.08)}.vcc-mr .fg{stroke-linecap:round}' +
    '.vcc-mr b{position:absolute;inset:0;display:grid;place-items:center;font:700 13px/1 Prompt,sans-serif;font-variant-numeric:tabular-nums}' +
    '.vcc-tx{flex:1;min-width:0}.vcc-tx b{display:block;font:600 13.5px/1.35 Prompt,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vcc-tx small{display:block;font:400 11.5px/1.4 Prompt,sans-serif;color:#9a9aa3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vcc-tx small em{font-style:normal;color:var(--gc,#34d399);font-weight:600}' +
    '.vcc-ar{flex:none;color:#71717a;font-size:16px}' +
    '.vcc-pg{flex:none;width:40px;height:44px;border-radius:9px;overflow:hidden;background:#f7efdc;display:flex;flex-direction:column;box-shadow:0 4px 10px -5px rgba(0,0,0,.7)}' +
    '.vcc-pg i{display:block;padding:2px 0;text-align:center;background:#c04a36;color:#fff;font:700 9.5px/1.2 Prompt,sans-serif;font-style:normal}' +
    '.vcc-pg b{flex:1;display:grid;place-items:center;font:700 17px/1 Prompt,sans-serif;color:#2a2116}' +
    '.vcc-cd{flex:none;padding:4px 9px;border-radius:999px;font:600 11.5px/1.2 Prompt,sans-serif;background:rgba(255,255,255,.06);color:#c9c9cf}' +
    '.vcc-cd.hot{background:rgba(242,85,90,.16);color:#ff8d8f}.vcc-cd.near{background:rgba(245,196,81,.16);color:#f5d27a}' +
    '.vcc-empty{margin:0;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.03);font:400 12.5px/1.5 Prompt,sans-serif;color:#9a9aa3}' +
    '.vcc-skel{height:84px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.07),rgba(255,255,255,.03));background-size:200% 100%;animation:vccSk 1.2s linear infinite}' +
    '@keyframes vccSk{to{background-position:-200% 0}}' +
    '@media (max-width:420px){.vcc-st b{font-size:19px}.vcc-st small{font-size:10.5px}}' +
    '@media (prefers-reduced-motion:reduce){.vcc-skel,.vcc-rf.spin svg{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="9" rx="2"/><rect x="13.5" y="3.5" width="7" height="5" rx="2"/><rect x="13.5" y="11.5" width="7" height="9" rx="2"/><rect x="3.5" y="15.5" width="7" height="5" rx="2"/></svg>';
  var RF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/></svg>';
  function ring(s, size) {
    var r = size / 2 - 4, C = 2 * Math.PI * r, b = band(s);
    return '<span class="vcc-mr"><svg viewBox="0 0 ' + size + ' ' + size + '"><circle class="bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="5"/>' +
      '<circle class="fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="5" stroke="' + b.c + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - s / 100)).toFixed(1) + '"/></svg><b style="color:' + b.c + '">' + s + '</b></span>';
  }

  var box = null, loading = false, lastAt = 0;
  function mount() {
    var panel = document.getElementById('historyPanel'); if (!panel) return null;
    if (box && box.isConnected) return box;
    box = document.createElement('section'); box.className = 'vcc'; box.hidden = true; box.setAttribute('aria-label', 'ภาพรวมสัญญาของคุณ');
    var anchor = document.getElementById('libStats');
    if (anchor) anchor.parentNode.insertBefore(box, anchor); else panel.insertBefore(box, panel.firstChild);
    box.addEventListener('click', function (e) {
      if (e.target.closest('.vcc-rf')) { load(true); return; }
      var r = e.target.closest('[data-open]'); if (r && window.vcOpenResult) window.vcOpenResult(r.getAttribute('data-open'));
    });
    return box;
  }
  function render(d) {
    var ins = (d && d.inspections) || [], rem = ((d && d.reminders) || []).filter(function (x) { return !x.done; });
    if (!ins.length) { box.hidden = true; return; }
    var list = ins.map(function (x) { var sc = scoreOf(x), nm = nameOf(x); return { x: x, sc: sc, nm: nm }; });
    var avg = Math.round(list.reduce(function (a, y) { return a + y.sc.s; }, 0) / list.length), ab = band(avg);
    var risky = list.filter(function (y) { return y.sc.s < 40; }).length;
    var open = list.reduce(function (a, y) { return a + y.sc.open.length; }, 0);
    var up = rem.map(function (r) { return { r: r, n: days(r.dueDate) }; }).filter(function (y) { return y.n != null && y.n >= 0; }).sort(function (a, b) { return a.n - b.n; });
    var soon = up.filter(function (y) { return y.n <= 30; }).length;
    var dist = { bad: 0, warn: 0, ok: 0, good: 0 }; list.forEach(function (y) { dist[band(y.sc.s).k]++; });
    var DC = [['bad', '#f2555a', 'เสี่ยงสูง'], ['warn', '#f5c451', 'ควรระวัง'], ['ok', '#a3d65c', 'พอใช้'], ['good', '#34d399', 'ดี']];
    var top = list.filter(function (y) { return y.sc.open.length; }).sort(function (a, b) { return a.sc.s - b.sc.s; }).slice(0, 3);

    box.innerHTML = '<div class="vcc-h"><span class="ic">' + IC + '</span><div><b>ภาพรวมสัญญาของคุณ</b><small>' + list.length + ' ฉบับ · อัปเดตตามข้อที่ติ๊กแก้แล้ว</small></div><button type="button" class="vcc-rf" aria-label="โหลดใหม่">' + RF + '</button></div>' +
      '<div class="vcc-stats">' +
        '<div class="vcc-st" style="--c:' + ab.c + '"><b>' + avg + '</b><small>คะแนนเฉลี่ย</small></div>' +
        '<div class="vcc-st" style="--c:' + (risky ? '#f2555a' : '#34d399') + '"><b>' + risky + '</b><small>ฉบับเสี่ยงสูง</small></div>' +
        '<div class="vcc-st" style="--c:' + (open ? '#f5c451' : '#34d399') + '"><b>' + open + '</b><small>ข้อที่ยังไม่แก้</small></div>' +
        '<div class="vcc-st" style="--c:' + (soon ? '#7fb5ff' : '#a1a1aa') + '"><b>' + soon + '</b><small>วันสำคัญใน 30 วัน</small></div>' +
      '</div>' +
      '<div class="vcc-dist" aria-hidden="true">' + DC.map(function (c) { return dist[c[0]] ? '<i style="width:' + (dist[c[0]] / list.length * 100).toFixed(1) + '%;background:' + c[1] + '"></i>' : ''; }).join('') + '</div>' +
      '<div class="vcc-leg">' + DC.filter(function (c) { return dist[c[0]]; }).map(function (c) { return '<span style="--c:' + c[1] + '">' + c[2] + ' ' + dist[c[0]] + '</span>'; }).join('') + '</div>' +
      '<div class="vcc-sec"><p>ควรจัดการก่อน <em>เรียงจากคะแนนต่ำสุด</em></p>' +
        (top.length ? top.map(function (y) {
          var hi = y.sc.open.filter(function (o) { return o.l === 'check_detail'; }).length, gb = band(y.sc.after);
          return '<button type="button" class="vcc-row" data-open="' + y.x.id + '">' + ring(y.sc.s, 42) +
            '<span class="vcc-tx"><b>' + esc(y.nm.t) + '</b><small>' + (hi ? hi + ' ข้อสำคัญ · ' : '') + 'แก้ ' + y.sc.open.length + ' ข้อ → <em style="--gc:' + gb.c + '">' + y.sc.after + '</em> · ' + thd(y.x.created_at) + '</small></span><span class="vcc-ar">›</span></button>';
        }).join('') : '<p class="vcc-empty">ไม่มีข้อสำคัญหรือข้อควรระวังค้างอยู่ เยี่ยมมาก 🎉</p>') + '</div>' +
      '<div class="vcc-sec"><p>วันสำคัญที่ใกล้ถึง</p>' +
        (up.length ? up.slice(0, 3).map(function (y) {
          var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(y.r.dueDate), u = y.n <= 7 ? 'hot' : y.n <= 30 ? 'near' : '';
          return '<div class="vcc-row" ' + (y.r.inspectionId ? 'data-open="' + y.r.inspectionId + '"' : 'style="cursor:default"') + '><span class="vcc-pg"><i>' + MON[+m[2] - 1] + '</i><b>' + (+m[3]) + '</b></span>' +
            '<span class="vcc-tx"><b>' + esc(y.r.title) + '</b><small>' + thd(y.r.dueDate) + (y.r.repeat === 'monthly' ? ' · ทุกเดือน' : '') + '</small></span>' +
            '<span class="vcc-cd ' + u + '">' + (y.n === 0 ? 'วันนี้' : y.n === 1 ? 'พรุ่งนี้' : 'อีก ' + y.n + ' วัน') + '</span></div>';
        }).join('') : '<p class="vcc-empty">ยังไม่มีวันสำคัญที่ตั้งเตือนไว้ เปิดผลตรวจแล้วกด "บันทึกแจ้งเตือน" ในการ์ดวันสำคัญได้</p>') + '</div>';
    box.hidden = false;
  }
  function load(force) {
    if (!mount() || loading) return;
    if (!force && Date.now() - lastAt < 20000 && !box.hidden) return;
    loading = true;
    var rf = box.querySelector('.vcc-rf'); if (rf) rf.classList.add('spin');
    if (box.hidden && !box.innerHTML) { box.innerHTML = '<div class="vcc-skel"></div>'; box.hidden = false; }
    fetch('/api/history/overview', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { loading = false; lastAt = Date.now(); if (d) render(d); else box.hidden = true; }, function () { loading = false; if (!box.querySelector('.vcc-h')) box.hidden = true; });
  }
  function onTab() {
    if (!box) return;
    var pay = document.querySelector('#historyPanel .hist-tab[data-tab="pay"].is-on');
    box.style.display = pay ? 'none' : '';
  }
  function boot() {
    var panel = document.getElementById('historyPanel'); if (!panel) return;
    var check = function () { if (!panel.hidden) { load(false); onTab(); } };
    new MutationObserver(check).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#historyPanel .hist-tab')) setTimeout(onTab, 30); });
    check();
  }
  window.VCCommand = { refresh: function () { load(true); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
