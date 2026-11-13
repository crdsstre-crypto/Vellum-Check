/* ===== อธิบายข้อสัญญา (Clause Explainer) =====
   (ก) เลือกข้อความในผลตรวจ/ต้นฉบับ/สัญญาตัวอย่าง → ปุ่มลอย "💡 อธิบายข้อนี้"
   (ข) ทุกข้อความที่ยกมาจากสัญญาในประเด็น มีปุ่ม "💡 อธิบายข้อนี้" ใต้ข้อความ
   → แผ่นล่าง: แปลว่าอะไร · ตัวอย่างสถานการณ์ · ควรระวัง · ควรถามอีกฝ่าย (AI ผ่าน /api/explain) */
(function () {
  'use strict';
  var ZONES = '#result, .vsl-doc, #vwBody, .vd-body, .sx-slide';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var css = '' +
    '.vex-fab{position:fixed;z-index:9997;display:flex;align-items:center;gap:6px;padding:9px 14px;border:0;border-radius:999px;background:linear-gradient(135deg,#ffe28a,#f2b81c);color:#1a1305;font:700 13.5px/1 Prompt,sans-serif;box-shadow:0 10px 26px -8px rgba(0,0,0,.75);cursor:pointer;transform:translate(-50%,0) scale(.8);opacity:0;transition:opacity .18s,transform .22s cubic-bezier(.3,1.5,.5,1);pointer-events:none}' +
    '.vex-fab.on{opacity:1;transform:translate(-50%,0) scale(1);pointer-events:auto}' +
    '.vex-btn{display:inline-flex;align-items:center;gap:5px;min-height:32px !important;padding:0 11px !important;margin:0 0 0 auto !important;border-radius:999px !important;border:1px solid rgba(245,196,81,.45) !important;background:rgba(245,196,81,.08) !important;color:#f5d27a !important;font:600 12px/1 Prompt,sans-serif !important;cursor:pointer;width:auto !important;white-space:nowrap}' +
    '.src-row{flex-wrap:wrap;gap:6px}.vex-row{display:flex;justify-content:flex-end;margin:6px 0 2px}' +
    '.vex{position:fixed;inset:0;z-index:9996;display:flex;align-items:flex-end;justify-content:center;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif;color:#ececef}' +
    '.vex[hidden]{display:none}.vex *{box-sizing:border-box}' +
    '.vex-bg{position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:0;transition:opacity .25s}.vex.in .vex-bg{opacity:1}' +
    '.vex-card{position:relative;width:min(640px,100%);max-height:86vh;display:flex;flex-direction:column;border-radius:22px 22px 0 0;background:#141519;border:1px solid rgba(255,255,255,.1);transform:translateY(40px);opacity:0;transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s}' +
    '.vex.in .vex-card{transform:none;opacity:1}' +
    '@media (min-width:768px){.vex{align-items:center}.vex-card{border-radius:22px}}' +
    '.vex-card::before{content:"";position:absolute;top:8px;left:50%;width:40px;height:4px;margin-left:-20px;border-radius:4px;background:rgba(255,255,255,.18)}' +
    '.vex-hd{display:flex;align-items:center;gap:10px;padding:20px 16px 10px}' +
    '.vex-hd b{font:700 16px/1.3 Prompt,sans-serif}.vex-hd .ic{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:rgba(245,196,81,.15);font-size:17px}' +
    '.vex-x{margin-left:auto;width:34px;height:34px;min-height:0 !important;padding:0 !important;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#ccc;cursor:pointer}' +
    '.vex-bd{overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:0 16px 16px}' +
    '.vex-q{margin:0 0 12px;padding:10px 12px;border-left:3px solid #c9a24a;border-radius:0 10px 10px 0;background:#f7efdc;color:#2a2116;font:400 14px/1.65 Sarabun,Taviraj,serif;--ff:Sarabun,Taviraj,serif;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}' +
    '.vex-q.full{display:block}' +
    '.vex-sec{margin:0 0 10px;padding:12px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);animation:vexIn .4s cubic-bezier(.2,.8,.2,1) both}' +
    '.vex-sec:nth-child(3){animation-delay:.06s}.vex-sec:nth-child(4){animation-delay:.12s}.vex-sec:nth-child(5){animation-delay:.18s}' +
    '@keyframes vexIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}' +
    '.vex-sec h5{margin:0 0 4px;font:700 12.5px/1.3 Prompt,sans-serif;color:var(--c,#f5c451);letter-spacing:.02em}' +
    '.vex-sec p{margin:0;font:400 14.5px/1.65 Prompt,sans-serif;color:#e4e4e7}' +
    '.vex-sec.w{border-color:rgba(242,85,90,.3);background:rgba(242,85,90,.06)}' +
    '.vex-sec.a{border-color:rgba(127,181,255,.3);background:rgba(127,181,255,.06)}' +
    '.vex-cp{margin-top:8px;min-height:32px !important;padding:0 11px !important;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#d4d4d8;font:500 12px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vex-sk{height:74px;margin:0 0 10px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.08),rgba(255,255,255,.03));background-size:200% 100%;animation:vexSk 1.1s linear infinite}' +
    '@keyframes vexSk{to{background-position:-200% 0}}' +
    '.vex-ld{display:flex;align-items:center;gap:8px;margin:0 0 10px;font:500 13px/1.4 Prompt,sans-serif;color:#a1a1aa}' +
    '.vex-err{padding:14px;border-radius:14px;background:rgba(242,85,90,.08);border:1px solid rgba(242,85,90,.3);font:400 13.5px/1.55 Prompt,sans-serif;color:#fecaca}' +
    '.vex-err button{display:block;margin-top:10px;min-height:40px;padding:0 14px;border:0;border-radius:11px;background:#f5c451;color:#1a1305;font:700 13px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vex-ft{padding:10px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07);font:400 11.5px/1.5 Prompt,sans-serif;color:#71717a}' +
    '@media (prefers-reduced-motion:reduce){.vex-sec,.vex-sk{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = null, sheet = null, selText = '', req = 0;
  function say(m) { if (typeof toast === 'function') toast(m); }

  /* (ก) ปุ่มลอยตอนเลือกข้อความ */
  function ensureFab() {
    if (fab) return fab;
    fab = document.createElement('button'); fab.type = 'button'; fab.className = 'vex-fab'; fab.innerHTML = '💡 อธิบายข้อนี้';
    fab.addEventListener('mousedown', function (e) { e.preventDefault(); });
    fab.addEventListener('click', function () { var t = selText; hideFab(); try { getSelection().removeAllRanges(); } catch (e) {} if (t) open(t); });
    document.body.appendChild(fab); return fab;
  }
  function hideFab() { if (fab) fab.classList.remove('on'); }
  var tm = 0;
  function onSel() {
    clearTimeout(tm);
    tm = setTimeout(function () {
      var s = window.getSelection && getSelection();
      if (!s || s.isCollapsed || !s.rangeCount) { hideFab(); return; }
      var t = s.toString().replace(/\s+/g, ' ').trim(), node = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
      if (t.length < 8 || t.length > 1200 || !node || !node.closest(ZONES) || node.closest('input,textarea,button,.vex,.vcp')) { hideFab(); return; }
      var r = s.getRangeAt(0).getBoundingClientRect(); if (!r || (!r.width && !r.height)) { hideFab(); return; }
      selText = t; ensureFab();
      var touch = matchMedia('(pointer:coarse)').matches, y = touch ? r.bottom + 14 : r.top - 46;
      if (y < 70) y = r.bottom + 14; if (y > innerHeight - 60) y = Math.max(70, r.top - 46);
      fab.style.left = Math.min(innerWidth - 90, Math.max(90, r.left + r.width / 2)) + 'px'; fab.style.top = y + 'px';
      fab.classList.add('on');
    }, 220);
  }
  document.addEventListener('selectionchange', onSel);
  window.addEventListener('scroll', function () { if (fab && fab.classList.contains('on')) onSel(); }, { passive: true });

  /* (ข) ปุ่มใต้ข้อความที่ยกมาจากสัญญา */
  function addBtns() {
    var res = document.getElementById('result'); if (!res) return;
    [].forEach.call(res.querySelectorAll('blockquote'), function (q) {
      if (q.__vex || q.closest('.gl-mine,.vex')) return;
      var item = q.closest('details.item'), idx = item && /^issue-(\d+)$/.exec(item.id || '');
      var src = idx && typeof lastResult !== 'undefined' && lastResult && lastResult.items && lastResult.items[+idx[1]];
      var text = (src && src.quote) || q.textContent;
      text = String(text || '').replace(/\s+/g, ' ').trim(); if (text.length < 8) return;
      q.__vex = 1;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vex-btn'; b.innerHTML = '💡 อธิบายข้อนี้';
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(text); });
      var row = q.nextElementSibling && q.nextElementSibling.classList.contains('src-row') ? q.nextElementSibling : null;
      if (row) row.appendChild(b); else { var w = document.createElement('div'); w.className = 'vex-row'; w.appendChild(b); q.insertAdjacentElement('afterend', w); }
    });
  }

  /* แผ่นคำอธิบาย */
  function build() {
    sheet = document.createElement('div'); sheet.className = 'vex'; sheet.hidden = true; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'อธิบายข้อสัญญา');
    sheet.innerHTML = '<div class="vex-bg" data-x></div><div class="vex-card"><div class="vex-hd"><span class="ic">💡</span><b>อธิบายข้อนี้แบบง่าย ๆ</b><button type="button" class="vex-x" data-x aria-label="ปิด">✕</button></div>' +
      '<div class="vex-bd"></div><div class="vex-ft">คำอธิบายจาก AI เพื่อช่วยให้เข้าใจเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย · <span class="vex-left"></span></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) return close();
      var q = e.target.closest('.vex-q'); if (q) { q.classList.toggle('full'); return; }
      var cp = e.target.closest('.vex-cp');
      if (cp) { var t = cp.getAttribute('data-t'); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { cp.textContent = '✓ คัดลอกแล้ว'; }, function () {}); return; }
      if (e.target.closest('[data-login]')) { close(); var a = document.getElementById('authToggle'); if (a) a.click(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) close(); });
  }
  function close() { if (!sheet) return; sheet.classList.remove('in'); setTimeout(function () { sheet.hidden = true; }, 260); }
  function open(text) {
    if (!sheet) build();
    var bd = sheet.querySelector('.vex-bd'), my = ++req;
    bd.innerHTML = '<p class="vex-q" title="แตะเพื่อดูทั้งหมด">' + esc(text.slice(0, 1200)) + '</p><p class="vex-ld">น้องเวลลัมกำลังอ่านข้อนี้ให้…</p><div class="vex-sk"></div><div class="vex-sk"></div>';
    sheet.querySelector('.vex-left').textContent = '';
    sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('in'); });
    if (text.length > 1200) { bd.innerHTML += ''; }
    fetch('/api/explain', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text.slice(0, 1200) }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (my !== req) return;
        var q = bd.querySelector('.vex-q').outerHTML;
        if (!x.ok) { bd.innerHTML = q + '<div class="vex-err">' + esc(x.d.error || 'อธิบายไม่สำเร็จ ลองใหม่อีกครั้ง') + (x.d.login ? '<button type="button" data-login>เข้าสู่ระบบ</button>' : '') + '</div>'; return; }
        var d = x.d;
        bd.innerHTML = q +
          '<div class="vex-sec" style="--c:#f5c451"><h5>📖 แปลว่า</h5><p>' + esc(d.meaning) + '</p></div>' +
          (d.example ? '<div class="vex-sec" style="--c:#9cc5ff"><h5>🎬 ตัวอย่างสถานการณ์</h5><p>' + esc(d.example) + '</p></div>' : '') +
          (d.watch ? '<div class="vex-sec w" style="--c:#ff8d8f"><h5>⚠️ ควรระวัง</h5><p>' + esc(d.watch) + '</p></div>' : '') +
          (d.ask ? '<div class="vex-sec a" style="--c:#9cc5ff"><h5>💬 ควรถามอีกฝ่าย</h5><p>' + esc(d.ask) + '</p><button type="button" class="vex-cp" data-t="' + esc(d.ask) + '">คัดลอกคำถาม</button></div>' : '');
        if (typeof d.left === 'number') sheet.querySelector('.vex-left').textContent = 'เหลือ ' + d.left + ' ครั้งวันนี้';
      }, function () { if (my === req) bd.innerHTML = bd.querySelector('.vex-q').outerHTML + '<div class="vex-err">เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง</div>'; });
  }

  function boot() {
    var res = document.getElementById('result');
    if (res) { var q = 0; new MutationObserver(function () { clearTimeout(q); q = setTimeout(addBtns, 200); }).observe(res, { childList: true, subtree: true }); addBtns(); }
  }
  window.VCExplain = { open: open };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
