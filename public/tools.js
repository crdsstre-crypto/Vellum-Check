/* ===== เครื่องมือ (tools.js) — ศูนย์รวมฟีเจอร์เสริม แยกออกจากหน้าตรวจสัญญา =====
   ทางเข้า: มือถือ = แท็บ "เครื่องมือ" ในแถบล่าง (ล็อกอินแล้ว) หรือปุ่มไอคอนบนหัวเว็บ (ยังไม่ล็อกอิน)
            คอม   = ลิงก์ "เครื่องมือ" ในเมนูบน
   เพิ่มฟีเจอร์ใหม่: เติมรายการใน TOOLS ด้านล่างได้เลย */
(function () {
  'use strict';
  if (window.VCTools) return;

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function loggedIn() { var l = document.getElementById('authLoggedIn'); return !!(l && !l.hidden); }
  function mob() { return window.matchMedia('(max-width:767px)').matches; }

  function openHistory() {
    close();
    if (!loggedIn()) { var t = document.getElementById('authToggle'); if (t) t.click(); else location.hash = '#authCard'; return; }
    var nb = document.querySelector('#bottomNav [data-nav="hist"]');
    if (nb && nb.offsetParent) { nb.click(); return; }
    document.documentElement.setAttribute('data-desk', 'acct');
    var wh = document.getElementById('walletHist');
    if (wh && wh.getAttribute('aria-expanded') !== 'true') wh.click();
    setTimeout(function () { if (wh) wh.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 120);
  }
  function hasResult() { return !!document.querySelector('#result article.rpt'); }
  function toResult() {
    close();
    var nh = document.querySelector('#bottomNav [data-nav="home"]'); if (nh && nh.offsetParent) nh.click();
    if (document.documentElement.getAttribute('data-desk') === 'acct') document.documentElement.setAttribute('data-desk', 'check');
    setTimeout(function () { var r = document.getElementById('resultCard') || document.getElementById('result'); if (r) r.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 120);
  }

  /* ---------- รายการเครื่องมือ ---------- */
  var TOOLS = [
    {
      id: 'compare', c: '#7fb5ff', ic: '<rect x="3" y="4" width="7.5" height="16" rx="2"/><rect x="13.5" y="4" width="7.5" height="16" rx="2"/><path d="M5.5 9h2.5M5.5 12.5h2.5M16 9h2.5M16 12.5h2.5M16 16h2.5"/>',
      name: 'เทียบ 2 ฉบับ', tag: 'ฟรี · ไม่ใช้เครดิต',
      desc: 'อีกฝ่ายแก้สัญญาแล้วส่งกลับมา? วางฉบับเดิมกับฉบับใหม่ ระบบชี้ทุกจุดที่แก้ เพิ่ม หรือลบ พร้อมบอกข้อที่เสี่ยงและเงินที่เปลี่ยน',
      pts: ['เห็นทุกคำและตัวเลขที่เปลี่ยน', 'เตือนข้อที่ถูกลบจนเสียสิทธิ์', 'ร่างข้อความต่อรองให้ในปุ่มเดียว'],
      acts: [['เริ่มเทียบ', 'p', function () { close(); setTimeout(function () { window.VCCompare && VCCompare.open(); }, 200); }],
             ['ลองกับตัวอย่าง', '', function () { close(); setTimeout(function () { window.VCCompare && VCCompare.demo(0); }, 200); }]]
    },
    {
      id: 'negotiate', c: '#c4a1ff', ic: '<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="M13.5 6.5l3 3M4 20h16"/>',
      name: 'ร่างข้อความต่อรอง', tag: function () { return hasResult() ? 'จากผลตรวจล่าสุด' : 'ใช้หลังตรวจสัญญา'; },
      desc: 'รวมข้อที่ควรขอแก้จากผลตรวจเป็นข้อความสุภาพข้อความเดียว เลือกน้ำเสียงได้ แก้คำได้ แล้วส่งทาง LINE หรืออีเมลได้ทันที',
      pts: ['เลือกข้อที่อยากต่อรองเอง', 'สุภาพ / กลาง ๆ / ตรงไปตรงมา', 'ส่ง LINE · อีเมล · คัดลอก'],
      acts: function () { return hasResult() ? [['ร่างข้อความ', 'p', function () { close(); setTimeout(function () { window.VCNeg && VCNeg.open(false); }, 220); }]] : [['ไปตรวจสัญญาก่อน', 'p', toResult]]; }
    },
    {
      id: 'explain', c: '#f5c451', ic: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/>',
      name: 'อธิบายข้อสัญญา', tag: 'ในหน้าผลตรวจ',
      desc: 'อ่านข้อไหนไม่เข้าใจ ให้ AI แปลเป็นภาษาง่าย ๆ พร้อมตัวอย่างสถานการณ์ สิ่งที่ควรระวัง และคำถามที่ควรถามอีกฝ่าย',
      steps: ['ตรวจสัญญาให้เสร็จก่อน', 'กดปุ่ม "💡 อธิบายข้อนี้" ใต้ข้อความในแต่ละประเด็น', 'หรือลากเลือกข้อความที่สงสัย แล้วแตะปุ่มที่ลอยขึ้นมา'],
      acts: function () { return hasResult() ? [['ไปที่ผลตรวจ', 'p', toResult]] : [['ไปตรวจสัญญา', 'p', toResult]]; }
    },
    {
      id: 'overview', c: '#34d399', ic: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      name: 'ภาพรวมและวันสำคัญ', tag: function () { return loggedIn() ? 'จากประวัติของคุณ' : 'ต้องเข้าสู่ระบบ'; },
      desc: 'ดูคะแนนสัญญาทุกฉบับที่เคยตรวจ ฉบับไหนเสี่ยงที่สุด และวันครบกำหนดที่ใกล้ถึง เช่น วันต่อสัญญา หรือวันคืนเงินประกัน',
      pts: ['สัญญาที่ควรดูก่อน 3 อันดับ', 'แจ้งเตือนวันสำคัญถัดไป'],
      acts: function () { return [[loggedIn() ? 'เปิดภาพรวม' : 'เข้าสู่ระบบเพื่อดู', 'p', openHistory]]; }
    }
  ];

  /* ---------- สไตล์ ---------- */
  var css = '' +
    '.vct{position:fixed;inset:0;z-index:9994;display:flex;align-items:flex-end;justify-content:center;font-family:Prompt,sans-serif;color:#ececef}' +
    '.vct[hidden]{display:none}' +
    '.vct-bg{position:absolute;inset:0;background:rgba(5,6,8,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}' +
    '.vct.in .vct-bg{opacity:1}' +
    '.vct-card{position:relative;width:100%;max-width:720px;max-height:92vh;display:flex;flex-direction:column;background:#131417;border:1px solid rgba(255,255,255,.08);border-radius:24px 24px 0 0;box-shadow:0 -20px 60px -20px rgba(0,0,0,.9);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.9,.3,1)}' +
    '.vct.in .vct-card{transform:none}' +
    '@media (min-width:768px){.vct{align-items:center}.vct-card{border-radius:24px;transform:translateY(24px) scale(.98);opacity:0;transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s}.vct.in .vct-card{opacity:1}}' +
    '.vct-hd{display:flex;align-items:center;gap:12px;padding:18px 18px 14px;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.vct-hd .ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,rgba(127,181,255,.22),rgba(245,196,81,.16))}' +
    '.vct-hd .ic svg{width:22px;height:22px}' +
    '.vct-hd b{display:block;font:700 17px/1.25 Prompt,sans-serif}.vct-hd small{display:block;font:400 12.5px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vct .vct-x{margin-left:auto;flex:none;display:grid;place-items:center;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#ececef;font-size:20px;line-height:1;cursor:pointer}' +
    '.vct-bd{overflow:auto;overscroll-behavior:contain;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));display:grid;gap:12px}' +
    '@media (min-width:768px){.vct-bd{grid-template-columns:1fr 1fr}.vct-it:first-child{grid-column:1/-1}}' +
    '.vct-it{--c:#7fb5ff;position:relative;padding:14px;border-radius:18px;border:1px solid color-mix(in srgb,var(--c) 26%,transparent);background:linear-gradient(150deg,color-mix(in srgb,var(--c) 11%,transparent),transparent 55%),#17191e;animation:vctIn .4s both}' +
    '.vct-it:nth-child(2){animation-delay:.05s}.vct-it:nth-child(3){animation-delay:.1s}.vct-it:nth-child(4){animation-delay:.15s}' +
    '@keyframes vctIn{from{opacity:0;transform:translateY(10px)}}' +
    '.vct-ih{display:flex;align-items:center;gap:11px}' +
    '.vct-ih .ic{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:color-mix(in srgb,var(--c) 17%,transparent);color:var(--c)}' +
    '.vct-ih .ic svg,.vct-hd .ic svg,.vct-nb svg.t{fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vct-ih .ic svg{width:22px;height:22px}' +
    '.vct-ih b{display:block;font:700 15.5px/1.3 Prompt,sans-serif}' +
    '.vct-ih em{display:inline-block;margin-top:3px;padding:1px 8px;border-radius:99px;background:color-mix(in srgb,var(--c) 15%,transparent);color:var(--c);font:600 11px/1.6 Prompt,sans-serif;font-style:normal}' +
    '.vct-it p{margin:10px 0 0;font:400 13px/1.6 Prompt,sans-serif;color:#b9b9c0}' +
    '.vct-pts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.vct-pts span{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:9px;background:rgba(255,255,255,.04);font:500 11.5px/1.4 Prompt,sans-serif;color:#d4d4d8}' +
    '.vct-pts span::before{content:"✓";color:var(--c);font-weight:700}' +
    '.vct-stp{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px;counter-reset:s}' +
    '.vct-stp li{counter-increment:s;display:flex;gap:9px;align-items:flex-start;font:400 12.5px/1.5 Prompt,sans-serif;color:#d4d4d8}' +
    '.vct-stp li::before{content:counter(s);flex:none;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:color-mix(in srgb,var(--c) 20%,transparent);color:var(--c);font:700 11px/1 Prompt,sans-serif}' +
    '.vct-ac{display:flex;gap:8px;margin-top:12px}' +
    '.vct .vct-ac button{flex:1;min-height:44px !important;padding:0 12px !important;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer;transition:transform .12s}' +
    '.vct .vct-ac button.p{border:0;background:var(--c);color:#0b0c0f;box-shadow:0 8px 20px -10px var(--c)}' +
    '.vct .vct-ac button:active{transform:scale(.97)}' +
    '.vct-soon{display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:18px;border:1px dashed rgba(255,255,255,.12);color:#8a8a93;font:400 12.5px/1.5 Prompt,sans-serif}' +
    '.vct-soon i{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.04);font-style:normal;font-size:17px}' +
    '.vct-soon b{display:block;color:#c4c4cb;font-weight:600}' +
    /* แท็บในแถบล่าง */
    '.bottom-nav .bn-item.vct-nb svg.t{width:22px;height:22px;stroke:url(#vct-g)}' +
    /* ปุ่มเมนู ☰ บนหัวเว็บ (มือถือ): รวมปุ่มภาษา + เครื่องมือ ไว้ที่เดียว */
    '.vct-mb{display:none}' +
    '@media (max-width:767px){.site-header .topbar .vc-lang{display:none !important}' +
      '.site-header .topbar .vct-mb{display:grid;place-items:center;flex:none;width:38px !important;min-width:38px;height:38px;min-height:0 !important;padding:0 !important;margin:0 8px 0 auto;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#ececef;cursor:pointer}' +
      '.vct-mb svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}}' +
    /* จอแคบ: บีบระยะเล็กน้อยให้ โลโก้ · ☰ · เข้าสู่ระบบ · ตรวจสัญญา อยู่ครบในบรรทัดเดียว */
    '@media (max-width:420px){html.vc-art .site-header .topbar,.site-header .topbar{gap:6px !important}html.vc-art .site-header .brand,.site-header .brand{gap:7px !important}' +
      'html.vc-art .site-header .brand-name,.site-header .brand-name{letter-spacing:.01em !important;font-size:14px !important}' +
      'html.vc-art .site-header .topbar .vct-mb,.site-header .topbar .vct-mb{width:34px !important;min-width:34px;height:34px;margin:0 0 0 auto !important}' +
      'html.vc-art .site-header #authToggle,.site-header #authToggle{padding:0 10px !important}html.vc-art .site-header .dx-nav a:last-child,.site-header .dx-nav a:last-child{padding:0 11px !important}}' +
    '.vcm-sec{padding:4px 0}.vcm-h{margin:6px 4px 8px;font:600 11.5px/1 Prompt,sans-serif;letter-spacing:.04em;color:#8a8a93}' +
    '.vct .vcm-row{display:flex;align-items:center;gap:12px;width:100%;min-height:0 !important;padding:12px !important;margin-bottom:6px;border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#ececef;text-align:left;font:inherit;cursor:pointer}' +
    '.vcm-row .i{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:color-mix(in srgb,var(--c,#7fb5ff) 16%,transparent);color:var(--c,#7fb5ff)}' +
    '.vcm-row .i svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vcm-row b{display:block;font:600 14px/1.3 Prompt,sans-serif}.vcm-row small{display:block;font:400 11.5px/1.4 Prompt,sans-serif;color:#9a9aa3}.vcm-row em{margin-left:auto;font-style:normal;color:#71717a;font-size:20px}' +
    '.vcm-lang{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:4px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}' +
    '.vct .vcm-lang button{min-height:46px !important;padding:0 !important;border:0;border-radius:11px;background:transparent;color:#b4b4bb;font:600 13.5px/1.2 Prompt,sans-serif;cursor:pointer}' +
    '.vcm-lang button small{display:block;font:400 10.5px/1.2 Prompt,sans-serif;opacity:.7}' +
    '.vct .vcm-lang button.is-on{background:linear-gradient(180deg,#f1c46a,#d6a447);color:#1c1408}' +
    /* ทางลัดในหน้าภาพรวม */
    '.vct-cc{display:flex;align-items:center;gap:11px;width:100%;margin:10px 0 14px;min-height:0 !important;padding:11px 13px !important;border-radius:14px;border:1px solid rgba(127,181,255,.25);background:rgba(127,181,255,.06);color:#ececef;text-align:left;font:inherit;cursor:pointer}' +
    '.vct-cc span.i{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:rgba(127,181,255,.16);color:#9cc5ff}' +
    '.vct-cc span.i svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.vct-cc b{display:block;font:600 13.5px/1.3 Prompt,sans-serif}.vct-cc small{display:block;font:400 11.5px/1.4 Prompt,sans-serif;color:#9a9aa3}.vct-cc em{margin-left:auto;font-style:normal;color:#7fb5ff;font-size:20px}' +
    '@media (prefers-reduced-motion:reduce){.vct-it{animation:none}.vct-card{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var GRID = '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><path d="M17.25 13.5v7.5M13.5 17.25H21"/>';

  /* ---------- แผง ---------- */
  var el = null, acts = {};
  function render() {
    acts = {};
    var html = TOOLS.map(function (t) {
      var A = typeof t.acts === 'function' ? t.acts() : t.acts;
      return '<section class="vct-it" style="--c:' + t.c + '" data-tool="' + t.id + '"><div class="vct-ih"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">' + t.ic + '</svg></span><div><b>' + esc(t.name) + '</b><em>' + esc(typeof t.tag === 'function' ? t.tag() : t.tag) + '</em></div></div>' +
        '<p>' + esc(t.desc) + '</p>' +
        (t.pts ? '<div class="vct-pts">' + t.pts.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') +
        (t.steps ? '<ol class="vct-stp">' + t.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' : '') +
        '<div class="vct-ac">' + A.map(function (a, k) { var key = t.id + k; acts[key] = a[2]; return '<button type="button" class="' + a[1] + '" data-act="' + key + '">' + esc(a[0]) + '</button>'; }).join('') + '</div></section>';
    }).join('') + '<div class="vct-soon"><i>✨</i><span><b>เครื่องมือใหม่กำลังมา</b>เราจะเพิ่มเครื่องมือช่วยอ่านสัญญาไว้ที่นี่เรื่อย ๆ</span></div>';
    el.querySelector('.vct-bd').innerHTML = html;
  }
  function build() {
    el = document.createElement('div'); el.className = 'vct'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'เครื่องมือ');
    el.innerHTML = '<div class="vct-bg" data-x></div><div class="vct-card"><div class="vct-hd"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true" style="color:#cfe2ff">' + GRID + '</svg></span><div><b>เครื่องมือ</b><small>ตัวช่วยเพิ่มเติม นอกจากการตรวจสัญญา</small></div><button type="button" class="vct-x" data-x aria-label="ปิด">×</button></div><div class="vct-bd"></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-x]')) { close(); return; }
      var b = e.target.closest('[data-act]'); if (b && acts[b.getAttribute('data-act')]) acts[b.getAttribute('data-act')]();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el && !el.hidden) close(); });
  }
  var prevOverflow = '';
  function open() {
    if (!el) build();
    render();
    el.hidden = false; prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    var x = el.querySelector('.vct-x'); x && x.focus({ preventScroll: true });
  }
  function close() {
    if (!el || el.hidden) return;
    el.classList.remove('in'); document.documentElement.style.overflow = prevOverflow || '';
    setTimeout(function () { el.hidden = true; }, 300);
    navReset();
  }

  /* ---------- ทางเข้า ---------- */
  function navReset() {   /* แถบไฮไลต์ในเมนูล่างกลับไปที่แท็บที่เปิดอยู่จริง */
    var bn = document.getElementById('bottomNav'); if (!bn) return;
    var items = bn.querySelectorAll('.bn-item'), on = bn.querySelector('.bn-item.is-on'), ind = bn.querySelector('.vc-bn-ind');
    if (ind && on) ind.style.setProperty('--x', ([].indexOf.call(items, on) * 100) + '%');
  }
  function navItem() {
    var bn = document.getElementById('bottomNav'); if (!bn || bn.querySelector('.vct-nb')) return;
    var hist = bn.querySelector('[data-nav="hist"]');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'bn-item vct-nb'; b.setAttribute('aria-label', 'เครื่องมือ');
    b.innerHTML = '<svg class="t" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><defs><linearGradient id="vct-g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9cc5ff"/><stop offset="1" stop-color="#f5c451"/></linearGradient></defs>' + GRID + '</svg><span>เครื่องมือ</span>';
    /* หยุดไม่ให้ตัวจัดการเมนูเดิมเปิดแผนบัญชี */
    b.addEventListener('click', function (e) { e.stopPropagation(); open(); });
    bn.insertBefore(b, hist || null);
    var ind = bn.querySelector('.vc-bn-ind'); if (ind) ind.style.setProperty('--n', bn.querySelectorAll('.bn-item').length);
  }
  function deskLink() {
    var nav = document.querySelector('.dx-nav'); if (!nav || nav.querySelector('.vct-dl')) return;
    var a = document.createElement('a'); a.href = '#tools'; a.className = 'vct-dl'; a.textContent = 'เครื่องมือ';
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
    var last = nav.lastElementChild; nav.insertBefore(a, last);   /* ก่อนปุ่ม "ตรวจสัญญา" ซึ่งเป็นปุ่มเด่นตัวสุดท้าย */
  }
  /* ---------- เมนู ☰ (มือถือ) ---------- */
  var mel = null;
  function menuOpen() {
    if (!mel) {
      mel = document.createElement('div'); mel.className = 'vct vcm'; mel.hidden = true;
      mel.setAttribute('role', 'dialog'); mel.setAttribute('aria-modal', 'true'); mel.setAttribute('aria-label', 'เมนู'); mel.setAttribute('data-i18n-skip', '');
      document.body.appendChild(mel);
      mel.addEventListener('click', function (e) {
        if (e.target.closest('[data-x]')) { menuClose(); return; }
        if (e.target.closest('[data-m="tools"]')) { menuClose(); setTimeout(open, 220); return; }
        var g = e.target.closest('[data-goto]'); if (g) { menuClose(); var t = document.querySelector(g.getAttribute('data-goto')); if (t) setTimeout(function () { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250); return; }
        var l = e.target.closest('[data-lang]'); if (l && window.VCLang && l.getAttribute('data-lang') !== VCLang.get()) { menuClose(); VCLang.set(l.getAttribute('data-lang')); }
      });
    }
    var L = window.VCLang ? VCLang.get() : 'th';
    var links = [['#introVideo', 'ดูคลิปแนะนำ', 'เห็นภาพรวมการใช้งาน', '#f5c451', '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>'],
                 ['#manifesto', 'วิธีอ่าน', 'หลักการอ่านสัญญาก่อนเซ็น', '#34d399', '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>']]
      .filter(function (x) { return document.querySelector(x[0]); });
    mel.innerHTML = '<div class="vct-bg" data-x></div><div class="vct-card"><div class="vct-hd"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true" style="color:#cfe2ff;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span><div><b>เมนู</b><small>Vellum Check</small></div><button type="button" class="vct-x" data-x aria-label="ปิด">×</button></div>' +
      '<div class="vct-bd" style="display:block">' +
      '<div class="vcm-sec"><button type="button" class="vcm-row" data-m="tools" style="--c:#9cc5ff"><span class="i"><svg viewBox="0 0 24 24" aria-hidden="true">' + GRID + '</svg></span><span><b>เครื่องมือ</b><small>' + TOOLS.map(function (t) { return t.name; }).join(' · ') + '</small></span><em>›</em></button></div>' +
      (links.length ? '<div class="vcm-sec">' + links.map(function (x) { return '<button type="button" class="vcm-row" data-goto="' + x[0] + '" style="--c:' + x[3] + '"><span class="i"><svg viewBox="0 0 24 24" aria-hidden="true">' + x[4] + '</svg></span><span><b>' + x[1] + '</b><small>' + x[2] + '</small></span><em>›</em></button>'; }).join('') + '</div>' : '') +
      '<div class="vcm-sec"><p class="vcm-h">ภาษา · Language · 语言</p><div class="vcm-lang">' +
        [['th', 'ไทย', 'Thai'], ['en', 'English', 'อังกฤษ'], ['zh', '中文', 'จีน']].map(function (x) { return '<button type="button" data-lang="' + x[0] + '" class="' + (L === x[0] ? 'is-on' : '') + '">' + x[1] + '<small>' + x[2] + '</small></button>'; }).join('') +
      '</div></div></div></div>';
    mel.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { mel.classList.add('in'); }); });
  }
  function menuClose() {
    if (!mel || mel.hidden) return;
    mel.classList.remove('in'); document.documentElement.style.overflow = '';
    setTimeout(function () { mel.hidden = true; }, 300);
  }
  function headBtn(tries) {
    var tb = document.querySelector('.site-header .topbar'); if (!tb || tb.querySelector('.vct-mb')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'vct-mb'; b.setAttribute('aria-label', 'เมนู · เครื่องมือ · ภาษา'); b.setAttribute('data-i18n-skip', '');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    b.addEventListener('click', menuOpen);
    var at = document.getElementById('authToggle');
    var lg = tb.querySelector('.vc-lang');
    tb.insertBefore(b, lg || (at && at.parentNode === tb ? at : null));
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menuClose(); });
  /* ทางลัดในหน้าภาพรวม (Command Center) ของประวัติ */
  function ccLink() {
    var panel = document.getElementById('historyPanel'); if (!panel) return;
    function put() {
      var vcc = panel.querySelector('.vcc'); if (!vcc || vcc.hidden) return;
      if (vcc.nextElementSibling && vcc.nextElementSibling.classList.contains('vct-cc')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vct-cc';
      b.innerHTML = '<span class="i"><svg viewBox="0 0 24 24" aria-hidden="true">' + TOOLS[0].ic + '</svg></span><span><b>อีกฝ่ายส่งฉบับแก้มา?</b><small>เทียบ 2 ฉบับ ดูว่าแก้ตรงไหน · ฟรี</small></span><em>›</em>';
      b.addEventListener('click', function () { if (window.VCCompare) { document.body.classList.remove('auth-open'); VCCompare.open(); } });
      vcc.parentNode.insertBefore(b, vcc.nextSibling);
    }
    new MutationObserver(function () { clearTimeout(put.t); put.t = setTimeout(put, 120); }).observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    put();
  }

  function boot() { navItem(); deskLink(); headBtn(); ccLink(); if (location.hash === '#tools') open(); }
  window.VCTools = { open: open, close: close, list: TOOLS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
