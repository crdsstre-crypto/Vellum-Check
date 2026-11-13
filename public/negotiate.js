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
    '.vng-hd{display:flex;align-items:center;gap:12px;padding:16px 18px 12px;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.vng-hd .ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:rgba(127,181,255,.16);font-size:20px}' +
    '.vng-hd b{display:block;font:700 17px/1.25 Prompt,sans-serif}.vng-hd small{display:block;font:400 12.5px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vng .vng-x{margin-left:auto;flex:none;display:grid;place-items:center;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#ececef;font-size:20px;line-height:1;cursor:pointer}' +
    '.vng-bd{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:14px 16px 16px}' +
    '@media (min-width:900px){.vng-card{max-width:1040px}.vng-bd{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:18px;overflow:hidden}.vng-l,.vng-r{overflow:auto;min-height:0}.vng-r{display:flex;flex-direction:column}.vng-r textarea{flex:1}}' +
    '.vng-h{display:flex;align-items:center;gap:8px;margin:14px 2px 8px;font:600 12px/1.2 Prompt,sans-serif;color:#9a9aa3;letter-spacing:.02em}.vng-l>.vng-h:first-child{margin-top:0}' +
    '.vng-h em{margin-left:auto;font-style:normal;color:#7fb5ff}' +
    '.vng-seg{display:flex;gap:4px;padding:4px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}' +
    '.vng .vng-seg button{flex:1;min-height:40px !important;padding:0 6px !important;border:0;border-radius:10px;background:transparent;color:#a1a1aa;font:600 13px/1.2 Prompt,sans-serif;cursor:pointer}' +
    '.vng .vng-seg button.on{background:#2a2c33;color:#fff;box-shadow:0 2px 8px -2px rgba(0,0,0,.6)}' +
    '.vng-row2{display:grid;grid-template-columns:minmax(0,1fr) 130px;gap:8px}' +
    '.vng-to{width:100%;min-height:48px;padding:0 12px;border-radius:13px;border:1px solid rgba(255,255,255,.1);background:#0d0e10;color:#ececef;font:400 14px/1 Prompt,sans-serif}' +
    '.vng-it{display:flex;gap:10px;align-items:flex-start;padding:10px 11px;margin-bottom:6px;border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);cursor:pointer;transition:border-color .15s,background .15s}' +
    '.vng-it.on{border-color:color-mix(in srgb,var(--c) 45%,transparent);background:color-mix(in srgb,var(--c) 7%,transparent)}' +
    '.vng-it input{position:absolute;opacity:0;pointer-events:none}' +
    '.vng-ck{flex:none;display:grid;place-items:center;width:20px;height:20px;margin-top:1px;border-radius:6px;border:1.5px solid rgba(255,255,255,.25);transition:all .15s}' +
    '.vng-it.on .vng-ck{background:var(--c);border-color:var(--c)}.vng-it.on .vng-ck::after{content:"";width:9px;height:5px;margin-top:-2px;border:2px solid #111;border-top:0;border-right:0;transform:rotate(-45deg)}' +
    '.vng-it b{display:block;font:600 13.5px/1.4 Prompt,sans-serif}' +
    '.vng-it small{display:block;margin-top:2px;font:400 12px/1.45 Prompt,sans-serif;color:#9a9aa3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '.vng-tg{display:inline-flex;align-items:center;gap:5px;margin-right:6px;font:600 10.5px/1 Prompt,sans-serif;color:var(--c)}.vng-tg::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c)}' +
    '.vng-tg.d{color:#34d399}.vng-tg.d::before{background:#34d399}' +
    '.vng-empty{padding:14px;border-radius:13px;border:1px dashed rgba(255,255,255,.12);font:400 13px/1.6 Prompt,sans-serif;color:#9a9aa3}' +
    '.vng-r textarea{width:100%;min-height:260px;resize:vertical;padding:13px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#f6f1e6;color:#25221c;font:400 14.5px/1.7 Sarabun,Prompt,sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 10px 24px -12px rgba(0,0,0,.8)}' +
    '.vng .vng-re{margin-left:auto;min-height:0 !important;padding:4px 10px !important;border-radius:99px;border:1px solid rgba(127,181,255,.35);background:transparent;color:#9cc5ff;font:600 11.5px/1.3 Prompt,sans-serif;cursor:pointer}.vng .vng-re[hidden]{display:none}' +
    '.vng-note{margin:8px 2px 0;font:400 11.5px/1.5 Prompt,sans-serif;color:#71717a}' +
    '.vng-ft{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:8px;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07)}' +
    '.vng .vng-ft button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:48px !important;padding:0 8px !important;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vng .vng-ft button.line{border:0;background:#06c755;color:#fff}.vng .vng-ft button.p{border:0;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b}' +
    '.vng .vng-ft button:disabled{opacity:.4;cursor:default}' +
    '.vng .vng-ft button.ok{background:#34d399 !important;color:#06281b !important;border-color:#34d399 !important}' +
    /* ปุ่มในผลตรวจ */
    '.vng-cta{display:flex;align-items:center;gap:12px;width:100%;margin:14px 0;min-height:0 !important;padding:13px 14px !important;border-radius:16px;border:1px solid rgba(127,181,255,.3);background:linear-gradient(135deg,rgba(127,181,255,.13),rgba(127,181,255,.03) 60%),#15171c;color:#ececef;text-align:left;font-family:Prompt,sans-serif;cursor:pointer;transition:border-color .2s,transform .12s}' +
    '.vng-cta:hover{border-color:rgba(127,181,255,.6)}.vng-cta:active{transform:scale(.985)}' +
    '.vng-cta .ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:rgba(127,181,255,.18);font-size:20px}' +
    '.vng-cta b{display:block;font:700 15px/1.3 Prompt,sans-serif}.vng-cta small{display:block;margin-top:2px;font:400 12.5px/1.4 Prompt,sans-serif;color:#a9b8d0}' +
    '.vng-cta em{margin-left:auto;flex:none;display:grid;place-items:center;min-width:30px;height:30px;padding:0 9px;border-radius:99px;background:rgba(127,181,255,.18);color:#cfe2ff;font:700 13px/1 Prompt,sans-serif;font-style:normal}';
  var sty = document.createElement('style'); sty.textContent = css; document.head.appendChild(sty);

  /* ---------- แผง ---------- */
  var el = null, list = [], miss = [], edited = false, prevOv = '';
  function build() {
    el = document.createElement('div'); el.className = 'vng'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'ร่างข้อความต่อรอง');
    var share = !!navigator.share;
    el.innerHTML = '<div class="vng-bg" data-x></div><div class="vng-card">' +
      '<div class="vng-hd"><span class="ic">✍️</span><div><b>ร่างข้อความต่อรอง</b><small>เลือกข้อ เลือกน้ำเสียง แก้คำได้ แล้วส่งให้อีกฝ่าย</small></div><button type="button" class="vng-x" data-x aria-label="ปิด">×</button></div>' +
      '<div class="vng-bd"><div class="vng-l">' +
        '<p class="vng-h">น้ำเสียง</p><div class="vng-seg" data-g="tone"><button type="button" data-v="soft">สุภาพ</button><button type="button" data-v="mid">กลาง ๆ</button><button type="button" data-v="direct">ตรงไปตรงมา</button></div>' +
        '<p class="vng-h">ส่งถึง</p><div class="vng-row2"><input class="vng-to" type="text" maxlength="40" placeholder="ชื่อผู้รับ (ไม่ใส่ก็ได้)"><div class="vng-seg" data-g="pp"><button type="button" data-v="ครับ">ครับ</button><button type="button" data-v="ค่ะ">ค่ะ</button></div></div>' +
        '<p class="vng-h">ใส่ข้อไหนบ้าง <em class="vng-n"></em></p><div class="vng-list"></div>' +
      '</div><div class="vng-r"><p class="vng-h">ข้อความ <button type="button" class="vng-re" hidden>↺ สร้างใหม่จากที่เลือก</button></p><textarea spellcheck="false" aria-label="ข้อความต่อรอง"></textarea>' +
        '<p class="vng-note">ร่างจากผลตรวจของ AI ใช้ประกอบการพูดคุย ไม่ใช่คำปรึกษาทางกฎหมาย ควรอ่านทวนก่อนส่ง</p></div></div>' +
      '<div class="vng-ft" style="--n:' + (share ? 4 : 3) + '"><button type="button" data-copy>คัดลอก</button><button type="button" class="line" data-line>LINE</button><button type="button" data-mail>อีเมล</button>' + (share ? '<button type="button" class="p" data-share>ส่งต่อ</button>' : '') + '</div></div>';
    document.body.appendChild(el);
    var ta = el.querySelector('textarea');
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) return close();
      var sb = e.target.closest('.vng-seg button');
      if (sb) { var g = sb.parentNode.getAttribute('data-g'); st[g] = sb.getAttribute('data-v'); ls(g === 'tone' ? 'vc_neg_tone' : 'vc_neg_pp', st[g]); segs(); regen(); return; }
      if (e.target.closest('.vng-re')) return regen(true);
      var t = text();
      if (e.target.closest('[data-copy]')) return copy(t, e.target.closest('button'));
      if (e.target.closest('[data-line]')) { window.open('https://line.me/R/share?text=' + encodeURIComponent(t), '_blank', 'noopener'); return; }
      if (e.target.closest('[data-mail]')) { location.href = 'mailto:?subject=' + encodeURIComponent('ขอแก้ไขร่างสัญญาก่อนลงนาม') + '&body=' + encodeURIComponent(t); return; }
      if (e.target.closest('[data-share]')) { navigator.share({ text: t }).catch(function () {}); return; }
    });
    el.addEventListener('change', function (e) {
      var it = e.target.closest('.vng-it'); if (!it) return;
      it.classList.toggle('on', e.target.checked); count(); if (!edited) regen();
    });
    el.querySelector('.vng-to').addEventListener('input', function () { st.to = this.value; ls('vc_neg_to', st.to); if (!edited) regen(); });
    ta.addEventListener('input', function () { edited = true; el.querySelector('.vng-re').hidden = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !el.hidden) close(); });
  }
  function text() { return el.querySelector('textarea').value; }
  function copy(t, btn) {
    function ok() { var o = btn.textContent; btn.classList.add('ok'); btn.textContent = 'คัดลอกแล้ว ✓'; setTimeout(function () { btn.classList.remove('ok'); btn.textContent = o; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { fb(); });
    else fb();
    function fb() { var ta = el.querySelector('textarea'); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} }
  }
  function segs() { [].forEach.call(el.querySelectorAll('.vng-seg'), function (sg) { var v = st[sg.getAttribute('data-g')]; [].forEach.call(sg.children, function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); }); }
  function picked() {
    var fx = [], ms = [];
    [].forEach.call(el.querySelectorAll('.vng-it input:checked'), function (c) { var d = c.closest('.vng-it'), k = d.getAttribute('data-k'), n = +d.getAttribute('data-n'); if (k === 'f') fx.push(list[n]); else ms.push(miss[n]); });
    return { fx: fx, ms: ms };
  }
  function count() { var p = picked(), n = p.fx.length + p.ms.length; el.querySelector('.vng-n').textContent = n + ' ข้อที่เลือก'; [].forEach.call(el.querySelectorAll('.vng-ft button'), function (b) { b.disabled = !n && !edited; }); }
  function regen(force) { var p = picked(); el.querySelector('textarea').value = compose(p.fx, p.ms); if (force || !edited) { edited = false; el.querySelector('.vng-re').hidden = true; } count(); }
  function renderList() {
    var h = list.map(function (x, n) {
      var c = LV[x.lv][1];
      return '<label class="vng-it' + (x.on ? ' on' : '') + '" data-k="f" data-n="' + n + '" style="--c:' + c + '"><input type="checkbox"' + (x.on ? ' checked' : '') + '><span class="vng-ck"></span><span><b>' + esc(x.title) + '</b>' +
        '<small><span class="vng-tg">' + LV[x.lv][0] + '</span>' + (x.done ? '<span class="vng-tg d">แก้แล้ว</span>' : '') + (x.star ? '⭐ ' : '') + esc(x.fix) + '</small></span></label>';
    }).join('');
    if (miss.length) h += '<p class="vng-h">เรื่องที่สัญญายังไม่ระบุ</p>' + miss.map(function (m, n) {
      return '<label class="vng-it" data-k="m" data-n="' + n + '" style="--c:#7fb5ff"><input type="checkbox"><span class="vng-ck"></span><span><b>' + esc(m) + '</b><small>ขอให้เขียนเพิ่มในสัญญา</small></span></label>';
    }).join('');
    if (!h) h = '<div class="vng-empty">ผลตรวจนี้ไม่มีข้อที่ต้องขอแก้ไข 🎉 ถ้ายังอยากส่งข้อความถึงอีกฝ่าย พิมพ์ในช่องข้อความได้เลย</div>';
    el.querySelector('.vng-list').innerHTML = h;
  }
  function open(onlyStar) {
    if (!res()) { if (window.VCTools) VCTools.open(); return; }
    if (!el) build();
    list = collect(!!onlyStar); miss = missing(); edited = false;
    if (onlyStar && !list.some(function (x) { return x.on; })) list = collect(false);
    renderList(); segs(); el.querySelector('.vng-to').value = st.to; regen(true);
    el.hidden = false; prevOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    var l = el.querySelector('.vng-l'); if (l) l.scrollTop = 0; el.querySelector('.vng-bd').scrollTop = 0;
  }
  function close() { if (!el || el.hidden) return; el.classList.remove('in'); document.documentElement.style.overflow = prevOv || ''; setTimeout(function () { el.hidden = true; }, 300); }

  /* ---------- ปุ่มในผลตรวจ ---------- */
  var pend = false;
  function cta() {
    pend = false;
    var r = document.getElementById('result'); if (!r) return;
    var rpt = r.querySelector('article.rpt'), ex = r.querySelector('.vng-cta');
    if (!rpt || !res()) { if (ex) ex.remove(); return; }
    var n = collect(false).filter(function (x) { return x.on; }).length;
    if (!ex) {
      ex = document.createElement('button'); ex.type = 'button'; ex.className = 'vng-cta';
      ex.addEventListener('click', function () { open(false); });
    }
    var html = '<span class="ic">✍️</span><span><b>ร่างข้อความต่อรอง</b><small>' + (n ? 'รวมข้อที่ควรขอแก้เป็นข้อความเดียว ส่งทาง LINE หรืออีเมลได้เลย' : 'ร่างข้อความถึงอีกฝ่ายจากผลตรวจนี้') + '</small></span>' + (n ? '<em>' + n + ' ข้อ</em>' : '');
    if (ex.innerHTML !== html) ex.innerHTML = html;
    var anchor = rpt.querySelector('.vhs') || rpt.querySelector('.vc-sum') || rpt.querySelector('.rpt-head');
    if (anchor && ex.previousElementSibling !== anchor) anchor.parentNode.insertBefore(ex, anchor.nextSibling);
  }
  function watch() {
    var r = document.getElementById('result'); if (!r) return;
    new MutationObserver(function (m) {
      if (m.every(function (x) { return x.target.closest && x.target.closest('.vng-cta'); })) return;
      if (!pend) { pend = true; setTimeout(cta, 500); }
    }).observe(r, { childList: true, subtree: true });
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
