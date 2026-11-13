/* ===== ภาษาอังกฤษ (i18n) — v1 =====
   - เลือกภาษาเก็บไว้ที่ localStorage 'vc_lang' ('th' ค่าเริ่มต้น / 'en')
   - โหมดไทย: ไม่ทำอะไรเลย (ไม่แตะหน้าเว็บ)
   - โหมดอังกฤษ: แปลข้อความบนหน้าเว็บด้วยพจนานุกรม (ตรงทั้งข้อความ หรือแบบแม่แบบตัวเลข {0} {1})
     ตามติดข้อความที่สคริปต์อื่นสร้างทีหลังด้วย MutationObserver · แปล placeholder / aria-label / title / alt ด้วย
   - ส่ง header x-vc-lang: en ไปกับคำขอ /api/ → เซิร์ฟเวอร์ให้ AI เขียนผลตรวจ/คำตอบเป็นภาษาอังกฤษ
   - ปุ่มสลับภาษา: ปุ่ม TH/EN บนแถบด้านบน + แถว "ภาษา" ในแผงการแสดงผล (สลับแล้วโหลดหน้าใหม่)
   ข้อความที่ยังไม่มีคำแปลจะถูกเก็บไว้ใน window.__vcMissing (ไว้เติมพจนานุกรมรอบหน้า) */
(function () {
  'use strict';
  var LANG = 'th';
  try { LANG = localStorage.getItem('vc_lang') === 'en' ? 'en' : 'th'; } catch (e) {}
  var root = document.documentElement;
  root.setAttribute('data-lang', LANG);
  /* สไตล์ของปุ่มสลับภาษา (ฝังไว้ในไฟล์นี้ ไม่ต้องมีไฟล์ CSS เพิ่ม) */
  var css = document.createElement('style');
  css.textContent =
    '.vc-lang{appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:0;padding:3px;margin:0 8px 0 auto;border-radius:99px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);font:600 11.5px/1 Prompt,system-ui,sans-serif;letter-spacing:.04em;flex:none}' +
    '.vc-lang span{padding:5px 8px;border-radius:99px;color:rgba(236,233,226,.55);transition:background-color .2s,color .2s}' +
    '.vc-lang span.is-on{background:linear-gradient(180deg,#f1c46a,#d6a447);color:#1c1408}' +
    '#dispPanel .vds-seg2{grid-template-columns:1fr 1fr !important}' +
    '#authLoggedIn #dispPanel .vds-seg2 button b{font-size:16px !important}' +
    'html[data-lang=en].i18n-wait body{opacity:0}' +
    'html[data-lang=en] body{transition:opacity .15s}' +
    '@media (max-width:480px){.vc-lang{margin:0 2px 0 auto;font-size:10.5px}.vc-lang span{padding:5px 6px}}' +
    /* หัวข้อใหญ่หน้าแรก: ภาษาอังกฤษยาวกว่า ย่อให้พอดีจอ */
    'html[data-lang=en] #heroTitle{font-size:clamp(34px,9.6vw,92px) !important;line-height:1.02 !important;letter-spacing:-.02em}' +
    '@media (min-width:768px){html[data-lang=en] #heroTitle{font-size:clamp(44px,4.6vw,68px) !important}}' +
    /* ข้อความที่มาจาก CSS (::before/::after) */
    "html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-menu::before{content:\"Settings\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-card-num small::after{content:\"Credits\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"Shows the credits left on your account\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"✓ Account details\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"Ready\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-rows dd::after{content:\"Checks available\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total::after{content:\"Total of all credit types\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .cred-card .acct-info::after{content:\"✓ Logged in\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authCard:has(#authLoggedIn:not([hidden])) .sheet-head h2::after{content:\"My account\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"Logged in\" !important}html[data-lang=en] #authLoggedIn .cred-card .acct-info::after{content:\"✓ Logged in\" !important}html[data-lang=en] .vsl-item::after{content:\"View contract ›\" !important}html[data-lang=en].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard .credit-chip:not(.is-zero) b::after{content:\" credits\" !important}html[data-lang=en] body[data-sheet=\"acct\"] #authCard .sheet-head .acct-label::after{content:\"Logged in\" !important}html[data-lang=en].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard:has(.ta-wrap:not(.vc-has)) #checkBtn:disabled::after{content:\"Paste a contract above, then press Check\" !important}html[data-lang=en].vc-art article.rpt.vc-m3 .ix-row.vc-swiping::after,html[data-lang=en].vc-art article.rpt.vc-m3 .ix-row.vc-sw-back::after{content:\"✓ Read\" !important}html[data-lang=en].vc-art article.rpt.vc-m > .gloss .gl-title p::after{content:\" · tap for the full explanation\" !important}html[data-lang=en].vc-art .vc-sum .vc-sum-hd .vc-sum-meta .vc-type-chg::before{content:\"Detected type · \" !important}html[data-lang=en] .hxs::before{content:\"Signature\" !important}html[data-lang=en] .vsl.fix-on .vsl-doc::before{content:\"Green text = suggested wording to request before signing · not legal advice\" !important}html[data-lang=en].vc-gin::before{content:\"Log in\" !important}html[data-lang=en] #resultCard .empty::after{content:\"Paste a contract on the left and press Check; results appear here\" !important}html[data-lang=en] #authLoggedIn .acct-menu::before{content:\"Settings\" !important}html[data-lang=en] #authLoggedIn .wallet-card-num small::after{content:\"Credits\" !important}html[data-lang=en] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"Shows the credits left on your account\" !important}html[data-lang=en] #authLoggedIn .acct-info::after{content:\"✓ Account details\" !important}html[data-lang=en] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"Ready\" !important}html[data-lang=en] #authLoggedIn .wallet-rows dd::after{content:\"Checks available\" !important}html[data-lang=en] #authLoggedIn .wallet-total::after{content:\"Total of all credit types\" !important}";
  (document.head || root).appendChild(css);
  if (LANG === 'en') { root.classList.add('i18n-wait'); setTimeout(function () { root.classList.remove('i18n-wait'); }, 1500); }
  window.VCLang = {
    get: function () { return LANG; },
    set: function (l) { try { localStorage.setItem('vc_lang', l === 'en' ? 'en' : 'th'); } catch (e) {} location.reload(); }
  };

  /* ---------- ปุ่มสลับภาษา (แสดงทั้งสองภาษา) ---------- */
  function addSwitch() {
    var tb = document.querySelector('.site-header .topbar');
    if (tb && !tb.querySelector('.vc-lang')) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'vc-lang';
      b.setAttribute('aria-label', LANG === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English');
      b.innerHTML = '<span class="' + (LANG === 'th' ? 'is-on' : '') + '">TH</span><span class="' + (LANG === 'en' ? 'is-on' : '') + '">EN</span>';
      b.setAttribute('data-i18n-skip', '');
      b.addEventListener('click', function () { VCLang.set(LANG === 'en' ? 'th' : 'en'); });
      var at = document.getElementById('authToggle');
      if (at && at.parentNode === tb) tb.insertBefore(b, at); else tb.appendChild(b);
    }
    var dp = document.getElementById('dispPanel');
    if (dp && !dp.querySelector('.vds-lang')) {
      var row = document.createElement('div');
      row.className = 'vds-blk vds-lang'; row.setAttribute('data-i18n-skip', '');
      row.innerHTML = '<p class="vds-h">ภาษา · Language</p><div class="seg vds-seg vds-seg2" role="group" aria-label="Language">' +
        '<button type="button" data-lang="th" class="' + (LANG === 'th' ? 'is-on' : '') + '"><b>ไทย</b><span>Thai</span></button>' +
        '<button type="button" data-lang="en" class="' + (LANG === 'en' ? 'is-on' : '') + '"><b>EN</b><span>English</span></button></div>';
      row.addEventListener('click', function (e) { var x = e.target.closest('[data-lang]'); if (x && x.getAttribute('data-lang') !== LANG) VCLang.set(x.getAttribute('data-lang')); });
      dp.insertBefore(row, dp.firstChild);
    }
  }
  function boot(f) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f); else f(); }
  boot(function () {
    addSwitch();
    if ('MutationObserver' in window) {
      var t = 0;
      new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; addSwitch(); }, 300); }).observe(document.body, { childList: true, subtree: true });
    }
  });
  if (LANG !== 'en') return;

  /* ---------- ส่งภาษาไปกับคำขอ API ---------- */
  var of = window.fetch;
  if (of) window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (/^\/api\/|^https?:\/\/[^/]*vellumcheck\.com\/api\/|^\/\/?api\//.test(url) || (url.indexOf(location.origin + '/api/') === 0)) {
        init = init || {};
        var h = new Headers(init.headers || (typeof input !== 'string' && input.headers) || {});
        h.set('x-vc-lang', 'en'); init.headers = h;
      }
    } catch (e) {}
    return of.call(this, input, init);
  };

  /* ---------- พจนานุกรม ---------- */
  var D = {
    /* ส่วนหัว / เมนู */
    'เช็กสัญญา | Vellum Check': 'Contract Check | Vellum Check',
    'ตรวจสัญญา': 'Check contract', 'เข้าสู่ระบบ': 'Log in', 'บัญชีของฉัน': 'My account', 'วิธีอ่าน': 'How to read', 'คลิปแนะนำ': 'Intro video',
    'บัญชี': 'Account', 'ประวัติ': 'History', 'เมนูหลัก': 'Main menu', 'ติดปัญหา?': 'Need help?', 'ติดปัญหา? กดเพื่อดูวิธีแก้': 'Need help? Tap for fixes',
    'เวลลัม มาสคอตของ Vellum Check': 'Vellum, the Vellum Check mascot',

    /* หน้าแรก */
    'อ่านให้ครบ': 'Read it all', 'อ่าน': 'Read', 'ให้': 'it', 'ครบ': 'all', 'ก่อนเซ็น': 'before you sign',
    'ตัวอย่างสด': 'Live sample', 'เช่าห้อง': 'Room rental', 'กู้เงิน': 'Loan', 'จ้างงาน': 'Employment', 'ตัวอย่าง': 'Sample',
    'สัญญาเช่าห้องพัก': 'Room rental agreement', 'ผู้เช่า': 'Tenant', 'ผู้ให้เช่า': 'Landlord', 'อ่านก่อนเซ็น!': 'Read before signing!',
    'ตรวจละเอียด': 'Check closely', 'ควรระวัง': 'Caution', 'ข้อสังเกต': 'Note', 'แตะแถบสีเพื่อดูเหตุผล': 'Tap a highlight to see why',
    'พบ': 'Found', 'จุดที่ควรดู': 'points to review', 'ดูผลเต็ม · ฟรี': 'See full result · free',
    'ตรวจสัญญาอย่างมั่นใจ · วางข้อความสัญญา ระบบจะไฮไลต์จุดที่ควรระวัง': 'Check contracts with confidence · paste the text and we highlight what to watch',
    'เริ่มตรวจสัญญา': 'Start checking', 'ดูคลิปแนะนำ': 'Watch intro',
    'สมัครฟรี รับตรวจ {0} ครั้ง': 'Sign up free · {0} free checks', 'จากนั้น {0} ครั้ง {1} บาท ·': 'then {0} checks for {1} THB ·',
    'ดูราคาและคำถามที่พบบ่อย': 'Pricing & FAQ', 'แตะค้างแล้วลากแว่น ส่องหาจุดเสี่ยง': 'Press and drag the lens to spot risks',
    'ไม่แน่ใจว่าเว็บนี้ช่วยอะไรได้?': 'Not sure how this helps?', 'ดูตัวอย่างปัญหา ›': 'See example problems ›',
    'คัดกรองเบื้องต้น': 'Initial screening', 'เครื่องมือคัดกรองเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย': 'A screening tool, not legal advice',
    'ปกปิดข้อมูลก่อนส่ง': 'Redact before sending', 'ปกปิดข้อมูลส่วนตัวในเบราว์เซอร์ก่อนส่งวิเคราะห์': 'Personal data is masked in your browser before analysis',
    'ตรวจพลาด คืนเครดิต': 'Failed check = refund', 'คืนเครดิตให้อัตโนมัติเมื่อระบบตรวจไม่สำเร็จ': 'Credits are refunded automatically if a check fails',
    'ดูวิธีอ่าน': 'How to read', 'ตรวจสัญญาของฉัน': 'Check my contract', 'ตัวอย่างผลตรวจสัญญา': 'Sample contract result',
    'เปิดผลตรวจตัวอย่างฉบับนี้ ฟรี': 'Open this sample result, free', 'หรือวางสัญญาของคุณตรงนี้…': 'or paste your contract here…',
    'วางข้อความสัญญาของคุณ': 'Paste your contract text', 'ควรตรวจละเอียดก่อนเซ็น': 'Check closely before signing',
    'ดูเหตุผล: {0}': 'See why: {0}', 'ค่าปรับ': 'Penalty', 'ค่าเช่า': 'Rent', 'เงินประกัน': 'Deposit', 'การเลิกสัญญา': 'Termination', 'ค่าซ่อม': 'Repairs',
    'ดูเหตุผล: ค่าปรับ': 'See why: Penalty', 'ดูเหตุผล: ค่าเช่า': 'See why: Rent', 'ดูเหตุผล: เงินประกัน': 'See why: Deposit', 'ดูเหตุผล: การเลิกสัญญา': 'See why: Termination', 'ดูเหตุผล: ค่าซ่อม': 'See why: Repairs',
    'ส่องเจอแล้ว {0} จุด · ลองหาต่อ': 'Found {0} · keep looking', 'สัญญาตัวอย่างที่เตรียมไว้ · ไม่ใช้เครดิต · ไม่ต้องสมัคร': 'Prepared sample contracts · no credits · no sign-up', 'เลื่อนดูต่อ': 'Scroll for more',
    /* ข้อความในสัญญาตัวอย่างที่แว่นส่อง */
    'ข้อ {0}.': 'Clause {0}.', 'ข้อ {0}': 'Clause {0}',
    'ทั้งสองฝ่ายได้อ่านและเข้าใจข้อความในสัญญานี้โดยตลอดแล้ว จึงลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน': 'Both parties have read and understood this agreement in full and sign it before witnesses.',
    'หากผิดนัดชำระแม้เพียงวันเดียว ผู้เช่าตกลงชำระ': 'If payment is late by even one day, the tenant agrees to pay', 'ค่าปรับร้อยละ {0} ต่อปี': 'a penalty of {0}% per year', 'ของยอดค้างทั้งหมด': 'on the entire outstanding balance',
    'ภายใต้บังคับแห่งเงื่อนไขในสัญญานี้ คู่สัญญาตกลงปฏิบัติตามข้อกำหนดที่ระบุไว้ในเอกสารแนบท้าย': 'Subject to this agreement, the parties agree to follow the terms in the annex.',
    'สัญญานี้': 'This agreement', 'ต่ออายุอัตโนมัติทุก {0} เดือน': 'renews automatically every {0} months', 'เว้นแต่จะแจ้งยกเลิกเป็นหนังสือล่วงหน้าไม่น้อยกว่า {0} วัน': 'unless cancelled in writing at least {0} days in advance',
    'ให้ถือว่าเอกสารแนบท้ายเป็นส่วนหนึ่งของสัญญานี้ และมีผลบังคับใช้เช่นเดียวกับข้อความในสัญญา': 'The annex forms part of this agreement and is equally binding.',
    'ผู้เช่าได้วางเงินประกันไว้แล้ว ซึ่ง': 'The tenant has paid a deposit, which', 'ไม่สามารถขอคืนได้ไม่ว่ากรณีใดๆ': 'is non-refundable under any circumstances',
    'การบอกกล่าวใดๆ ให้ทำเป็นหนังสือ และส่งไปยังที่อยู่ของคู่สัญญาตามที่ระบุไว้ข้างต้น': 'All notices must be in writing and sent to the addresses stated above.',
    'ผู้ให้บริการ': 'The provider', 'มีสิทธิ์แก้ไขเงื่อนไขได้ฝ่ายเดียว': 'may change the terms unilaterally', 'โดยไม่ต้องแจ้งให้ผู้ใช้บริการทราบล่วงหน้า': 'without notifying users in advance',
    'ผู้กู้ยินยอมให้': 'The borrower allows', 'หักเงินจากบัญชีเงินเดือนได้ทันที': 'immediate deductions from their salary account', 'โดยไม่ต้องขอความยินยอมอีก': 'without asking for further consent',
    'กรณียกเลิกก่อนครบกำหนด': 'If cancelled early,', 'ค่าธรรมเนียมเท่ากับค่าบริการคงเหลือทั้งหมด': 'the fee equals all remaining service charges', 'ตามอัตราที่บริษัทกำหนด': 'at rates set by the company',
    'ข้อมูลส่วนบุคคลของท่าน': 'Your personal data', 'อาจถูกเปิดเผยแก่บริษัทในเครือและพันธมิตร': 'may be disclosed to affiliates and partners', 'เพื่อวัตถุประสงค์ทางการตลาด': 'for marketing purposes',
    'ผู้ค้ำประกัน': 'The guarantor', 'ต้องรับผิดร่วมกับลูกหนี้อย่างลูกหนี้ร่วม': 'is jointly liable with the debtor', 'โดยสละสิทธิ์ทุกประการ': 'and waives all rights',
    'หากเกิดข้อพิพาท ให้ใช้': 'Any dispute goes to', 'อนุญาโตตุลาการที่บริษัทเป็นผู้เลือก': 'an arbitrator chosen by the company', 'และให้ถือคำชี้ขาดเป็นที่สุด': 'and the award is final',
    'ผู้รับจ้าง': 'The contractor', 'ห้ามทำงานกับคู่แข่งเป็นเวลา {0} ปี': 'may not work for competitors for {0} years', 'นับแต่วันสิ้นสุดสัญญา': 'after the contract ends',
    'ค่าบริการค้างชำระ': 'Unpaid fees', 'คิดดอกเบี้ยทบต้นรายวัน': 'accrue daily compound interest', 'จนกว่าจะชำระครบถ้วน': 'until paid in full',
    'ผู้เช่าต้อง': 'The tenant must', 'รับผิดชอบค่าซ่อมแซมโครงสร้างอาคารทั้งหมด': 'pay for all structural repairs', 'แม้ความเสียหายเกิดจากสภาพการใช้งานปกติ': 'even for normal wear and tear',
    'บริษัท': 'The company', 'ไม่รับผิดชอบความเสียหายใดๆ ทั้งสิ้น': 'accepts no liability for any damage', 'ไม่ว่าทางตรงหรือทางอ้อม': 'direct or indirect',
    'การไม่ใช้สิทธิ์ของบริษัท': 'The company not exercising a right', 'ไม่ถือเป็นการสละสิทธิ์': 'is not a waiver', 'และบริษัทอาจเรียกร้องย้อนหลังได้ตลอดเวลา': 'and it may claim retroactively at any time',
    '⚠ อาจถูกเปิดเผยแก่บริษัทในเครือและพันธมิตร': '⚠ May be disclosed to affiliates and partners', 'ข้อมูลของคุณอาจถูกส่งต่อเป็นวงกว้าง': 'Your data could be shared widely',
    '⚠ ต่ออายุอัตโนมัติทุก {0} เดือน': '⚠ Renews automatically every {0} months', 'ลืมแจ้งยกเลิก อาจถูกผูกต่ออีกปี': 'Forget to cancel and you may be locked in another year',
    '⚠ คิดดอกเบี้ยทบต้นรายวัน': '⚠ Daily compound interest', 'ยอดหนี้อาจโตเร็วกว่าที่คิด': 'The debt can grow faster than you expect',
    '⚠ ห้ามทำงานกับคู่แข่งเป็นเวลา {0} ปี': '⚠ No working for competitors for {0} years', 'จำกัดการทำงานนานกว่าที่พบทั่วไป': 'A longer restriction than usual',

    /* ล็อกอิน */
    'แบบฟอร์ม · เข้าใช้งาน': 'Form · Sign in', 'กรอกอีเมลและรหัสผ่านด้วยตัวเอง หรือเข้าด้วยบัญชี Google': 'Enter your email and password, or continue with Google',
    'อีเมล': 'Email', 'รหัสผ่าน': 'Password', 'ฉันได้อ่านและยอมรับ': 'I have read and accept the', 'ข้อกำหนดการใช้บริการ': 'Terms of Service', 'และ': 'and',
    'นโยบายความเป็นส่วนตัว': 'Privacy Policy', 'สมัครใหม่': 'Sign up', 'ฟรี {0} ครั้ง': '{0} free checks', 'หรือ': 'or', 'เข้าสู่ระบบด้วย Google': 'Continue with Google',
    'ลงชื่อ': 'Signature', 'เครื่องมือคัดกรองเบื้องต้น · ไม่ใช่คำปรึกษาทางกฎหมาย': 'Screening tool · not legal advice', 'ปิด': 'Close', 'เปิด/ปิดตะเกียง': 'Lamp on/off',
    'ชื่อ@อีเมลของคุณ': 'you@email.com', 'อย่างน้อย {0} ตัว': 'At least {0} characters', 'สมัครใหม่ รับตรวจฟรี {0} ครั้ง': 'Sign up · {0} free checks',
    'ข้าม ›': 'Skip ›', 'เสียง: เปิด': 'Sound: on', 'เสียง: ปิด': 'Sound: off', 'สวัสดี คุณ {0}': 'Hello, {0}', 'ยินดีต้อนรับ': 'Welcome',
    'อีกขั้นเดียวก็ตรวจได้': 'One step left to check', 'สมัครฟรี รับตรวจสัญญา': 'Sign up free · get', '{0} ครั้ง': '{0} checks',
    'ข้อความที่วางไว้ยังอยู่ครบ ไม่ต้องวางใหม่': 'Your pasted text is kept, no need to paste again', 'เข้าสู่ระบบแล้ว ระบบจะตรวจให้ต่อทันที': 'After logging in, the check continues right away',
    'ปกปิดชื่อ เลขบัตร เบอร์โทร ก่อนส่งตรวจ': 'Names, ID and phone numbers are masked before checking', 'สมัครฟรี / เข้าสู่ระบบ': 'Sign up free / Log in', 'ไว้ทีหลัง': 'Later',

    /* เครดิต */
    'สิทธิ์การใช้งานพร้อมเพิ่มเมื่อคุณต้องการ': 'Add more checks whenever you need', 'ผลตรวจเดิมยังอยู่ครบ ไม่ต้องรีบตัดสินใจ': 'Your past results are safe, no rush',
    'สถานะการใช้งาน': 'Usage status', 'ใช้สิทธิ์ครบแล้ว': 'All checks used', 'ผลตรวจเดิมยังดูย้อนหลังได้': 'Past results are still available',
    'เปิดประวัติการตรวจได้โดยไม่ต้องใช้เครดิตเพิ่ม': 'Opening history costs no credits', 'ตรวจฉบับใหม่ได้เมื่อพร้อม': 'Check a new contract when ready',
    'ตรวจสอบราคาและจำนวนครั้งก่อนยืนยันทุกครั้ง': 'Price and number of checks are shown before you confirm', 'ดูแพ็กเกจเครดิต': 'See credit packs',
    'ดูประวัติการตรวจ': 'View check history', 'ไม่มีการชำระเงินโดยไม่ได้รับความยินยอมจากคุณ': 'You are never charged without your consent',
    'ชัดเจน · ไม่บังคับซื้อ · ดูประวัติได้': 'Clear · no forced purchase · history kept', 'ใช้เครดิตครบแล้ว': 'Credits used up',
    'เครดิตคงเหลือ {0}': '{0} credits left', 'เครดิตคงเหลือ ดูหรือเติมเครดิต': 'Credits left · view or top up',

    /* หน้าตรวจ */
    'เลือกประเภทและใส่สัญญา': 'Type & contract', 'ประเภทสัญญา': 'Contract type', 'ไม่แน่ใจ': 'Not sure',
    'ระบบอ่านข้อความแล้วเลือกประเภทให้เอง': 'We read the text and pick the type for you', 'เปลี่ยน': 'Change', 'วางข้อความสัญญาที่นี่': 'Paste contract text here',
    'วางข้อความสัญญาที่นี่...': 'Paste contract text here...', 'วางจากคลิปบอร์ด': 'Paste from clipboard', 'อัปโหลด PDF · Word · รูปถ่าย': 'Upload PDF · Word · photo', 'อัปโหลดไฟล์': 'Upload file',
    'ยังไม่มีสัญญา? ลองตรวจตัวอย่างฟรี': 'No contract yet? Try a free sample', '{0} ฉบับ · ไม่ใช้เครดิต · เห็นผลใน {1} วินาที': '{0} samples · no credits · results in {1} seconds',
    'ฟรี': 'Free', 'ฟรี!': 'Free!', 'แตะเดียว ดูผลเลย': 'One tap, instant result', 'กู้ดอกโหด': 'Predatory loan', 'งานประจำ': 'Full-time job', 'ทั้งหมด ›': 'All ›',
    'เลือกสิ่งที่ต้องการและปกป้องข้อมูล': 'Choose options and protect your data', 'สรุปเป็นเสียง': 'Audio summary', '(ใช้เครดิตเสียง {0} ครั้ง)': '(uses {0} voice credit)',
    'ปกป้องข้อมูลส่วนตัว': 'Protect personal data', 'ปกปิดให้ก่อนส่ง': 'Masked before sending', 'เปิดใช้งาน': 'On',
    'วางสัญญาแล้วกดตรวจได้เลย ระบบจะให้สมัครฟรีตอนกดตรวจ': 'Paste and tap Check; you sign up free when you check', 'ตรวจสัญญา (ฟรี {0} ครั้ง)': 'Check contract ({0} free)',
    'ตรวจสัญญา (ใช้ {0} เครดิต)': 'Check contract (uses {0} credit)', 'ตรวจครั้งนี้ใช้ {0} เครดิต และคืนให้ถ้าตรวจไม่สำเร็จ': 'This check uses {0} credit, refunded if it fails',
    'ปกปิดข้อมูล': 'Data masking', 'ก่อนส่งตรวจ': 'before checking', 'ตรวจไม่สำเร็จ': 'Check failed', 'คืนเครดิตอัตโนมัติ': 'automatic refund', 'มีคำถาม?': 'Questions?',
    'ติดต่อทีมงาน': 'Contact us', 'ข้อความสัญญาต้นฉบับไม่ถูกบันทึกในระบบ · เก็บเฉพาะผลตรวจล่าสุด {0} รายการ ลบเองได้ทุกเมื่อ ·': 'Original contract text is never stored · only your latest {0} results are kept, delete anytime ·',
    'อ่านนโยบาย': 'Read policy', 'จัดการประวัติ': 'Manage history',
    '* เครื่องมือนี้ช่วยคัดกรองเบื้องต้นเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย ควรให้ทนายตรวจก่อนลงนามในสัญญาสำคัญ': '* This tool is for initial screening only and is not legal advice. Have a lawyer review important contracts before signing.',
    'เปิดคลังสัญญาตัวอย่าง {0} ฉบับ ฟรี ไม่ใช้เครดิต': 'Open {0} sample contracts, free, no credits', 'ความปลอดภัยและการคืนเครดิต': 'Safety and refunds',
    'วางสัญญา': 'Paste', 'เลือกสิ่งที่ต้องการ': 'Options', 'กดตรวจ': 'Check', 'อ่านผล': 'Read result', 'วางสัญญาได้เลย': 'Paste your contract',
    '· สมัครฟรีตอนกดตรวจ รับตรวจ {0} ครั้ง': '· sign up free when you check, {0} free checks', 'เข้าสู่ระบบ / สมัคร →': 'Log in / Sign up →',
    'คลิกในกล่องแล้วกด': 'Click the box and press', 'ก็ได้': 'to paste', '{0} / {1} ตัวอักษร': '{0} / {1} characters',
    'วางข้อความสัญญา แล้วระบบจะปกปิดข้อมูลส่วนตัวให้ก่อนส่งวิเคราะห์': 'Paste your contract and personal data is masked before analysis', 'ตั้งค่า': 'Settings',
    'ระบบอาจตรวจจับไม่ครบทุกกรณี โดยเฉพาะชื่อและไฟล์สแกนหรือภาพถ่ายเอกสาร ควรดูตัวอย่างก่อนกดตรวจ ค่าเช่า วันที่ ระยะเวลา และจำนวนเงินจะไม่ถูกปกปิด': 'Detection may miss some cases, especially names and scanned or photographed documents. Preview before checking. Rent, dates, durations and amounts are not masked.',
    'ล้างข้อความ': 'Clear text', 'ส่วนตัว': 'Private', 'ผลการตรวจ': 'Results', 'ตัวอย่างหน้าตาผลตรวจ': 'What a result looks like', 'จากสัญญาเช่าห้องตัวอย่าง': 'From a sample room rental',
    'ควรตรวจละเอียด': 'Check closely', 'ข้อ {0} · สำคัญ': 'Clause {0} · Important', 'ขึ้นค่าเช่าเมื่อไหร่ก็ได้?': 'Rent can rise anytime?',
    'ขอแก้: ขอให้ค่าเช่าคงที่ตลอดอายุสัญญา {0} ปี และถ้าจะปรับเมื่อต่อสัญญา ต้องแจ้งเป็นหนังสือล่วงหน้าอย่างน้อย {1} วัน': 'Ask: keep rent fixed for the {0}-year term; any increase on renewal needs {1} days written notice',
    'เงินประกันจะถูกหักเท่าไหร่?': 'How much of the deposit can be kept?',
    'ขอแก้: ขอให้หักได้เฉพาะความเสียหายที่เกิดจากผู้เช่าและมีหลักฐาน พร้อมแจ้งรายการหักเป็นหนังสือ และคืนส่วนที่เหลือภายใน {0}–{1} วัน': 'Ask: deduct only for proven tenant damage, itemised in writing, and return the rest within {0}–{1} days',
    'ย้ายออกก่อนกำหนด เงินประกันหายหมด?': 'Move out early, lose the whole deposit?',
    'ขอแก้: ขอให้ยกเลิกได้โดยแจ้งล่วงหน้า {0} วัน และคืนเงินประกันหลังหักค่าเสียหายจริง หรือกำหนดค่าปรับเป็นค่าเช่าไม่เกิน {1} เดือน': 'Ask: allow cancelling with {0} days notice and return the deposit minus actual damage, or cap the penalty at {1} month of rent',
    '+ อีก {0} ประเด็น · คำแนะนำ · ร่างข้อความไปคุย': '+ {0} more issues · advice · message drafts', 'เปิดผลตัวอย่างเต็ม · ฟรี': 'Open full sample · free',
    'ก่อนวางสัญญา': 'Before you paste', 'ใส่ให้ครบทุกหน้า': 'Include every page', 'รวมเอกสารแนบท้าย ระบบจะเห็นเงื่อนไขครบกว่า': 'Include annexes so all terms are seen',
    'ปกปิดข้อมูลส่วนตัวให้ก่อนส่ง': 'Personal data masked before sending', 'ทำในเบราว์เซอร์ของคุณก่อนส่งไปวิเคราะห์': 'Done in your browser before analysis',
    'ตรวจไม่สำเร็จ คืนเครดิตอัตโนมัติ': 'Failed checks are refunded automatically', 'ไม่ต้องแจ้งเอง': 'No need to report it', 'เป็นเครื่องมือคัดกรองเบื้องต้น': 'An initial screening tool',
    'เรื่องสำคัญมากควรปรึกษาผู้เชี่ยวชาญ': 'For high-stakes matters, consult a professional', 'ขั้นตอนการตรวจสัญญา': 'Contract check steps',
    'เช็กอินวันนี้ +{0} แต้ม': 'Check in today +{0} pts', 'วันที่ {0}/{1} · สะสม {2} แต้ม': 'Day {0}/{1} · {2} pts saved', 'เช็กอิน': 'Check in', 'ซ่อนวันนี้': 'Hide today',

    /* เลือกประเภท */
    'ใช้กับ: สัญญาที่ไม่รู้ว่าเป็นแบบไหน หรือมีหลายเรื่องรวมกัน': 'For: contracts of unknown or mixed type', 'เน้นตรวจ: ระบบอ่านข้อความแล้วเลือกประเภทให้เอง': 'Focus: we read the text and pick the type',
    'ลากเพื่อหมุน': 'Drag to rotate', 'เลือกประเภทสัญญา': 'Choose contract type', 'เลือกให้ตรง ระบบจะรู้ว่าต้องเน้นตรวจเรื่องไหน ไม่แน่ใจก็ให้ระบบดูเองได้': 'The right type tells us what to focus on. Not sure? Let us detect it.',
    'ระบบจะดูจากข้อความให้เอง': 'We detect it from the text', 'สัญญาเช่า': 'Rental agreement', 'ค่าเช่า เงินมัดจำ ระยะเวลาเช่า': 'Rent, deposit, lease term',
    'สัญญาซื้อขาย': 'Sale agreement', 'ราคา การส่งมอบ การชำระเงิน': 'Price, delivery, payment', 'สัญญาจ้างงาน': 'Employment contract', 'เงินเดือน ชั่วโมงทำงาน การเลิกจ้าง': 'Salary, hours, termination',
    'สัญญาจ้างบริการ': 'Service agreement', 'ขอบเขตงาน กำหนดส่งงาน ค่าจ้างงวด': 'Scope, deadlines, milestone pay', 'สัญญากู้ยืมเงิน': 'Loan agreement', 'ดอกเบี้ย วันครบกำหนดชำระ': 'Interest, due dates',
    'สัญญาหุ้นส่วน': 'Partnership agreement', 'แบ่งกำไร หน้าที่ของแต่ละฝ่าย': 'Profit split, duties', 'สัญญารักษาความลับ': 'Non-disclosure agreement', 'ห้ามเปิดเผยข้อมูล ระยะเวลาคุ้มครอง': 'Confidentiality, protection period',
    'สัญญาอื่น ๆ': 'Other contract', 'ไม่ตรงกับข้อด้านบน': 'None of the above', 'ใช้ “': 'Use “', 'ใช้ “ไม่แน่ใจ”': 'Use “Not sure”', 'สัญญาทั่วไป': 'General contract',

    /* ผลตรวจ */
    'คัดลอกผล': 'Copy result', 'แชร์รายงาน': 'Share report', 'บันทึก PDF': 'Save PDF', 'ประเด็น': 'Issues', 'พบจุดเสี่ยง': 'Risks found', 'ภาพรวมสัญญา': 'Contract overview',
    'ควรระวังมาก': 'High caution', 'มี {0} ประเด็นสำคัญ ควรคุยกับอีกฝ่ายก่อนลงนาม': '{0} important issue(s) to discuss before signing', 'สำคัญ': 'Important', 'เสี่ยงต่ำ': 'Low risk',
    'เริ่มอ่าน {0} ข้อสำคัญ': 'Read {0} key issue(s)', 'อ่านแล้ว': 'Read', 'ใช้ผลนี้ต่อ': 'Use this result', 'ร่างข้อความ': 'Draft message', 'ถึงอีกฝ่าย': 'to the other party',
    'เช็กลิสต์': 'Checklist', 'รูปสรุป': 'Summary image', 'ไว้แชร์': 'to share', 'ถามต่อ': 'Ask more', 'ติดดาว': 'Starred', 'ข้อมูลสัญญา': 'Contract details',
    'งาน': 'Scope', 'เงิน': 'Money', 'ระยะเวลา': 'Duration', 'สิ่งที่สัญญานี้ยังไม่ระบุ': 'Not stated in this contract', 'ระบบอาจอ่านไม่ครบ ควรเช็กกับต้นฉบับอีกครั้ง': 'The text may be incomplete; check against the original',
    'ถามอีกฝ่ายเรื่องที่ยังไม่ติ๊ก ({0})': 'Ask the other party about unticked items ({0})', 'วันสำคัญในสัญญานี้': 'Key dates in this contract',
    'ไม่พบวันที่ในสัญญานี้ เพิ่มวันที่อยากให้เตือนเองได้': 'No dates found; add your own reminders', '+ เพิ่มวันเอง': '+ Add a date', 'เพิ่มลงปฏิทิน': 'Add to calendar',
    'เข้าสู่ระบบเพื่อบันทึก': 'Log in to save', 'ปฏิทินในมือถือจะเตือนก่อน {0} วันและ {1} วัน เวลา {2}:{3} · วันที่จากระบบเป็นการอ่านอัตโนมัติ อาจไม่ครบหรือคลาดเคลื่อน': 'Your phone calendar reminds you {0} days and {1} day before at {2}:{3} · dates are read automatically and may be incomplete',
    'เกี่ยวกับผลนี้': 'About this result', 'ผลตรวจอ้างอิงอะไร และควรอ่านอย่างไร': 'What the result is based on and how to read it', 'ข้อความตรงกับสัญญา': 'Text matches contract',
    '{0}/{1} ประเด็น': '{0}/{1} issues', 'อ้างอิงมาตรากฎหมาย': 'Legal references', 'ข้อมูลที่สัญญายังไม่ระบุ': 'Information not stated', '{0} หัวข้อ': '{0} topic(s)',
    'ที่มาของผลตรวจสอบ': 'Where the result comes from', 'ข้อความสัญญา · แหล่งอ้างอิง · สถานะการตรวจสอบ': 'Contract text · references · verification status', 'ข้อความสัญญา': 'Contract text',
    'ข้อความอ้างอิงของทั้ง {0} ประเด็นตรงกับสัญญาที่วาง (ตรวจโดยเซิร์ฟเวอร์)': 'Quotes for all {0} issues match the pasted contract (server-verified)', 'แหล่งอ้างอิง': 'References',
    'AI ระบุมาตรา/ข้อกฎหมายไว้ {0} ประเด็น ยังไม่ได้ตรวจเทียบตัวบทกฎหมาย': 'AI cited legal sections for {0} issues; not yet verified against the statutes', 'สถานะการตรวจสอบ': 'Verification status',
    '{0} ประเด็นที่ข้อมูลไม่ครบหรือไม่พบข้อความอ้างอิง · {1} หัวข้อที่ไม่พบในข้อความที่ตรวจ (ไม่ได้แปลว่าสัญญาไม่มี)': '{0} issues with incomplete data or no matching quote · {1} topic(s) not found in the checked text (does not mean the contract lacks it)',
    'วิธีอ่านสีและข้อควรทราบ': 'Colour guide and notes', 'ทอง: ตัวเลข ระยะเวลา จำนวนเงินในข้อความสัญญา': 'Gold: numbers, durations and amounts in the contract',
    'แดง: ประเด็นระดับ “ควรตรวจละเอียด”': 'Red: “Check closely” issues', 'เขียว: ข้อเสนอแนะและขั้นตอนถัดไป': 'Green: suggestions and next steps', 'ฟ้า: แหล่งอ้างอิง': 'Blue: references',
    'ระดับความเสี่ยงมาจากการประเมินของ AI ตามข้อความสัญญาที่อ่านได้ ไม่ใช่เกณฑ์ทางกฎหมาย และเรียงจากระดับสูงไปต่ำ ไม่ได้เรียงตามเลขข้อสัญญา': 'Risk levels are AI assessments of the readable text, not legal standards, sorted high to low rather than by clause number.',
    'ข้อสังเกตเหล่านี้ไม่ใช่คำวินิจฉัยทางกฎหมาย ควรพิจารณาข้อสัญญาอื่นและข้อเท็จจริงประกอบ': 'These notes are not legal rulings; consider the other clauses and the facts too.',
    'ขั้นต่อไป': 'Next steps', 'อ่านแล้ว {0} จาก {1} ประเด็น': '{0} of {1} issues read', 'ส่งข้อขอแก้ทุกข้อ': 'Send all change requests', 'เช็กลิสต์ก่อนเซ็น': 'Pre-signing checklist',
    'ตรวจฉบับใหม่': 'Check a new contract', 'ระดับความเสี่ยงมาจากการประเมินของ AI เพื่อคัดกรองเบื้องต้น ส่วนสถานะการตรวจเป็นของคุณเอง ไม่ใช่คำวินิจฉัยทางกฎหมาย': 'Risk levels are AI screening estimates; review status is your own. Not a legal ruling.',
    'ผลนี้เป็นการคัดกรองเบื้องต้นเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย ควรให้ทนายตรวจก่อนลงนาม': 'This is an initial screening only, not legal advice. Have a lawyer review before signing.',
    '{0} ประเด็น · อ่านแล้ว {1}/{2}': '{0} issues · read {1}/{2}', 'อ่านครบแล้ว · ร่างข้อความถึงอีกฝ่าย': 'All read · draft a message to the other party', 'สรุปความเสี่ยง': 'Risk summary',
    'ความคืบหน้าการตรวจ': 'Review progress', 'ส่วนของผลตรวจ': 'Result sections', 'สารบัญประเด็นที่ควรตรวจสอบ': 'Issues to review', 'กลับไปที่สรุปผล': 'Back to summary',
    'ประเด็นที่ {0}': 'Issue {0}', 'ไปยังประเด็น': 'Go to issue', 'กลับขึ้นบนสุด': 'Back to top', 'กลับขึ้นด้านบน': 'Back to top', 'ข้าม': 'Skip', 'ถัดไป': 'Next', 'ปัดการ์ด': 'Swipe cards',
    'ปัดขวา = ทำเครื่องหมายว่าอ่านแล้ว · ปัดซ้าย = ติดดาวข้อที่จะต่อรอง': 'Swipe right = mark as read · swipe left = star to negotiate',
    'สัญญาที่ตรวจ': 'Checked contract', 'สัญญา · {0} ตัวอักษร': 'Contract · {0} characters', 'แก้ไข / ตรวจฉบับใหม่': 'Edit / check new', 'ผลตรวจ': 'Result', 'สัญญา': 'Contract',
    'ข้อมูลยังไม่ครบ': 'Incomplete information', 'คัดลอก': 'Copy', 'แชร์': 'Share', 'ผลการตรวจสอบสัญญา': 'Contract check result', 'สำคัญ {0} · ควรระวัง {1}': 'Important {0} · Caution {1}',
    'สรุปประเด็นจากสัญญาฉบับนี้': 'Key points from this contract', 'ข้อมูล': 'Information', 'ยังไม่ครบ': 'incomplete', 'ควรจัดการก่อน': 'Handle first', 'เรียงตามลำดับ': 'In order',
    '{0} / สำคัญ · ควรจัดการก่อนลงนาม': '{0} / Important · handle before signing', '{0} / ควรระวัง · ควรจัดการก่อนชำระเงิน/ส่งมอบ': '{0} / Caution · handle before paying/delivery',
    'ตรวจสอบข้อความต้นฉบับ': 'Check the original text', 'สถานะการตรวจ': 'Review status', 'เปิดประเด็นแรกที่ยังไม่ตรวจ': 'Open the first unreviewed issue', 'จุดที่ควรตรวจสอบ': 'Points to review',
    'พบ {0} ประเด็น': '{0} issues found', 'เรียงตามความเสี่ยง · แตะรายการเพื่อดูรายละเอียด': 'Sorted by risk · tap for details', 'ทั้งหมด {0}': 'All {0}',
    'ควรตรวจละเอียด {0}': 'Check closely {0}', 'ควรระวัง {0}': 'Caution {0}', 'เสี่ยงต่ำ {0}': 'Low risk {0}',
    'ประเด็น {0} · ควรตรวจละเอียด': 'Issue {0} · Check closely', 'ประเด็น {0} · ควรระวัง': 'Issue {0} · Caution', 'ประเด็น {0} · เสี่ยงต่ำ': 'Issue {0} · Low risk',
    'งาน:': 'Scope:', 'เงิน:': 'Money:', 'เวลา:': 'Time:', 'สิ่งที่ต้องรู้': 'What to know', 'ควรจัดการก่อนลงนาม': 'Handle before signing', 'สิ่งที่ควรขอแก้ไข': 'What to ask to change',
    'ดูรายละเอียด ข้อกฎหมาย และข้อความต้นฉบับ': 'Details, law and original text', 'แหล่งอ้างอิงและข้อความเปรียบเทียบ': 'References and text comparison', 'มิติความเสี่ยง': 'Risk dimensions',
    'ผลกระทบ': 'Impact', 'ความเร่งด่วน': 'Urgency', 'หลักฐาน': 'Evidence', 'ความไม่แน่นอน': 'Uncertainty', 'ขั้นตอนถัดไป': 'Next step', 'มาตราที่ระบบระบุ': 'Sections cited',
    'ระบบยังไม่ได้ตรวจเทียบกับแหล่งกฎหมายจริง ต้องตรวจสอบเพิ่มเติม': 'Not yet verified against the actual law; please double-check', 'ข้อความเดิม': 'Original text', 'ข้อความแนะนำ': 'Suggested text',
    'เปรียบเทียบ': 'Compare', '{0} · ข้อความเดิม': '{0} · Original text', 'ปรับถ้อยคำให้ชัดเจนขึ้น': 'Clearer wording', '{0} · ข้อความแนะนำ': '{0} · Suggested text', 'คัดลอกข้อความแนะนำ': 'Copy suggested text',
    'ข้อความตัวอย่างเพื่อประกอบการพิจารณา ควรตรวจสอบให้สอดคล้องกับข้อเท็จจริงและกฎหมายที่ใช้บังคับก่อนนำไปใช้จริง': 'Sample wording for consideration; check it against the facts and applicable law before use.',
    'ทำเครื่องหมายว่าตรวจแล้ว': 'Mark as reviewed', 'ควรจัดการก่อนชำระเงิน/ส่งมอบ': 'Handle before paying/delivery', 'ติดตามได้': 'Monitor', 'มีกำหนดเวลาที่ต้องระวัง': 'Has a deadline to watch',
    'ไม่พบในข้อความที่ตรวจ': 'Not found in the checked text', 'ไม่ได้แปลว่าสัญญาไม่มีเรื่องนี้ ระบบอาจอ่านเอกสารได้ไม่ครบ ควรเช็กกับต้นฉบับอีกครั้ง': 'This does not mean the contract lacks it; the text may be incomplete, so check the original.',
    'ถามต่อจากผลตรวจนี้': 'Ask about this result', 'สงสัยข้อไหน ถามได้เลย · ฟรี ชั่วโมงละ {0} คำถาม': 'Ask anything · free, {0} questions per hour',
    'สวัสดีครับ ผมอ่านผลตรวจฉบับนี้แล้ว อยากให้อธิบายตรงไหนเพิ่มไหมครับ?': 'Hi! I have read this result. What would you like me to explain?',
    'อธิบายข้อที่เสี่ยงที่สุดแบบเข้าใจง่าย': 'Explain the riskiest point simply', 'มีค่าใช้จ่ายแฝงตรงไหนบ้าง': 'Are there hidden costs?', 'มีเงื่อนไขการยกเลิกอย่างไร': 'What are the cancellation terms?',
    'มีข้อไหนที่ควรถามอีกฝ่ายก่อนเซ็น': 'What should I ask before signing?', 'ตำแหน่งเข็มคิดจากจำนวนและระดับของประเด็นที่พบ (ไม่ใช่คะแนนจาก AI)': 'The needle reflects the number and level of issues (not an AI score)',
    'สรุปภาพรวมสัญญา': 'Contract summary', 'เลขที่รายงาน {0}': 'Report no. {0}', 'ค้นหาในประเด็น เช่น ค่าปรับ เงินประกัน การบอกเลิก': 'Search issues, e.g. penalty, deposit, termination',
    'ค้นหาในประเด็นที่พบ': 'Search issues', 'กรองประเด็นตามระดับ': 'Filter by level', 'ถามต่อจากผลตรวจ': 'Ask about the result', 'พิมพ์คำถาม เช่น ข้อ {0} แปลว่าอะไร': 'Type a question, e.g. what does clause {0} mean?',
    'พิมพ์คำถาม': 'Type a question', 'ส่งคำถาม': 'Send question', 'บันทึกแจ้งเตือน': 'Save reminder',

    /* บัญชี */
    'บัญชีที่เข้าสู่ระบบ': 'Signed-in account', 'เข้าสู่ระบบแล้ว': 'Logged in', 'แอดมิน': 'Admin', 'เครดิตตรวจสัญญา': 'Contract checks', 'เสียง': 'Voice', 'ครั้ง': 'checks',
    'ตรวจได้อีก': 'Can check', 'ฉบับ · คืนเครดิตถ้าตรวจไม่สำเร็จ': 'more · refunded if a check fails', 'ตรวจได้อีก {0} ฉบับ · คืนเครดิตถ้าตรวจไม่สำเร็จ': '{0} more checks · refunded if a check fails',
    'เติมเครดิต': 'Top up', 'ตรวจไปแล้ว {0} ฉบับ': '{0} contracts checked', 'ล่าสุด {0} ชม.ที่แล้ว · ดูประวัติทั้งหมด': 'Last {0} h ago · view all history',
    'ล่าสุด {0} วันที่แล้ว · ดูประวัติทั้งหมด': 'Last {0} days ago · view all history', 'ล่าสุด {0} นาทีที่แล้ว · ดูประวัติทั้งหมด': 'Last {0} min ago · view all history',
    'เช็กอินรายวัน': 'Daily check-in', '{0} วันติด': '{0}-day streak', '· {0} แต้ม': '· {0} pts', 'รับ +{0}': 'Claim +{0}', 'แจ้งเตือนวันสำคัญ': 'Date reminders',
    'ยังไม่มีรายการ · บันทึกได้จากท้ายผลตรวจ': 'None yet · save from the end of a result', 'แผงแอดมิน': 'Admin panel', 'เพิ่มหรือลดเครดิตให้บัญชีใดก็ได้': 'Add or remove credits for any account',
    'บัญชีและการแสดงผล': 'Account & display', 'ข้อมูลและนโยบาย': 'Info & policies', 'ข้อมูลบัญชี': 'Account details', 'อีเมล เครดิต และการเก็บประวัติ': 'Email, credits and history storage',
    'ความเป็นส่วนตัวของข้อมูล': 'Data privacy', 'ข้อมูลไปที่ไหน เก็บนานแค่ไหน ลบได้อย่างไร': 'Where data goes, how long it is kept, how to delete', 'การแสดงผล': 'Display',
    'กะทัดรัด ขนาดตัวอักษร ลดภาพเคลื่อนไหว': 'Compact, text size, reduce motion', 'วิธีที่เราดูแลข้อมูลของคุณ': 'How we look after your data', 'เงื่อนไขการใช้บริการ': 'Terms of Service',
    'ข้อตกลงและขอบเขตของบริการ': 'Agreement and scope of service', 'ติดต่อผู้ดูแล': 'Contact admin', 'แจ้งปัญหาการชำระเงินหรือการใช้งาน': 'Report payment or usage issues',
    'ออกจากระบบ': 'Log out', '· เวอร์ชัน {0}': '· version {0}', 'เปลี่ยนรูปโปรไฟล์': 'Change profile photo', 'บัตรเครดิต แตะเพื่อพลิกดูรายละเอียด': 'Credit card, tap to flip for details',
    'เช็กอินรายวัน วันนี้รับได้ {0} แต้ม แต้มสะสม {1}': 'Daily check-in · {0} pts today · {1} pts saved', 'กระเป๋าเครดิตของคุณ': 'Your credit wallet', 'ข้อมูลและความช่วยเหลือ': 'Info and help',
    'เครื่องมือคัดกรองเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย ': 'A screening tool, not legal advice', 'เครื่องมือคัดกรองเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย.': 'A screening tool, not legal advice.',
    'อีเมลที่เข้าสู่ระบบ': 'Signed-in email', 'เครดิตตรวจ': 'Check credits', 'พร้อมใช้': 'Ready', 'ใกล้หมด': 'Running low', 'หมดแล้ว': 'Used up', '+ เติม': '+ Top up',
    'เครดิตเสียง': 'Voice credits', 'ประวัติการตรวจ': 'Check history', '/ {0} ฉบับ': '/ {0} saved', 'เต็มแล้ว · ตรวจฉบับใหม่ ฉบับเก่าสุดจะถูกลบ': 'Full · new checks replace the oldest',
    'ใกล้เต็ม · เก็บได้อีก {0} ฉบับ': 'Almost full · {0} slots left', 'เก็บได้อีก {0} ฉบับ': '{0} slots left', 'กำลังโหลด…': 'Loading…',
    'เติมเครดิตตรวจ': 'Top up check credits', 'เติมเครดิตเสียง': 'Top up voice credits', 'เก็บแล้ว {0} จาก {1} ฉบับ': '{0} of {1} saved',
    'ขนาดตัวอักษร': 'Text size', 'ก': 'A', 'เล็ก': 'Small', 'ปกติ': 'Normal', 'ใหญ่': 'Large', 'สัญญาเช่าควรระบุวันคืนเงินมัดจำให้ชัดเจน': 'A lease should clearly state when the deposit is returned',
    'โหมดกะทัดรัด': 'Compact mode', 'ลดระยะห่างและความสูงการ์ด': 'Less spacing, shorter cards', 'ลดภาพเคลื่อนไหว': 'Reduce motion', 'เหมาะกับเครื่องช้า': 'Good for slower devices',
    'เสียงประกอบ': 'Sound effects', 'เสียงกระดาษและตราประทับเบา ๆ': 'Soft paper and stamp sounds', 'คืนค่าเริ่มต้น': 'Reset to default',
    'บันทึกแล้ว ✓': 'Saved ✓', 'เปิดเสียงแล้ว ✓': 'Sound on ✓', 'ปิดเสียงแล้ว ✓': 'Sound off ✓', 'คืนค่าเริ่มต้นแล้ว ✓': 'Reset ✓',
    'ส่งไปประมวลผลที่ไหน': 'Where is it processed?', 'ข้อความสัญญาที่คุณกดตรวจจะถูกส่งให้ผู้ให้บริการ AI เพื่อวิเคราะห์ ไฟล์ PDF/Word/รูปภาพถูกอ่านเป็นข้อความบนเซิร์ฟเวอร์ของเรา': 'Contract text you check is sent to our AI provider for analysis. PDF/Word/image files are converted to text on our server.',
    'เราเก็บอะไร': 'What we keep', 'เก็บเฉพาะ "ผลตรวจ" ล่าสุดไม่เกิน {0} รายการต่อบัญชี ไม่เก็บข้อความสัญญาต้นฉบับไว้ในฐานข้อมูล': 'Only your latest {0} "results" per account. Original contract text is never stored.',
    'บันทึก (log)': 'Logs', 'ระบบไม่บันทึกเนื้อหาสัญญาลง log เก็บเพียงจำนวนตัวอักษรและชนิดไฟล์ตอนอัปโหลด': 'Contract content is never logged, only character counts and file types on upload.',
    'หน้าประวัติ': 'History page', 'แสดงเพียงวันที่และประเภท ไม่แสดงเนื้อหาจนกว่าคุณจะกดเปิด': 'Shows only date and type; content appears only when you open it',
    'คำแนะนำ': 'Tip', 'ไม่ควรวางเลขบัตรประชาชน เลขบัญชี หรือข้อมูลที่ไม่เกี่ยวกับการตรวจ': 'Avoid pasting ID numbers, bank accounts or unrelated data', 'ลบผลตรวจทั้งหมดของฉัน': 'Delete all my results',
    'เก็บผลตรวจล่าสุดไม่เกิน {0} รายการ': 'Keeps your latest {0} results', 'การเก็บประวัติ': 'History storage', '{0} เครดิต': '{0} credits',

    /* เช็กอิน */
    'ล็อกอิน': 'Login', 'รายวัน': 'daily', 'วันนี้มีของรออยู่นะ! กดรับ +{0} แต้มเลย': 'A reward is waiting! Claim +{0} pts', 'วันที่ {0} · รับได้': 'Day {0} · ready', '{0} แต้ม': '{0} pts',
    'วันติด': 'day streak', '/ {0} แต้ม': '/ {0} pts', 'อีก': '', 'แต้ม แลกตรวจฟรี {0} ครั้ง': 'pts to a free check', 'วัน {0}': 'Day {0}', 'รับแล้ว': 'Claimed', 'วันนี้': 'Today',
    'วันที่ {0} · กล่องสมบัติ': 'Day {0} · treasure box', 'อีก {0} วัน เปิดกล่องสมบัติ +{1} แต้ม': '{0} days to the treasure box +{1} pts', 'กติกา': 'Rules',
    'รับได้วันละ {0} ครั้ง ขึ้นวันใหม่ตอนเที่ยงคืน (เวลาไทย)': 'Once a day; resets at midnight (Thai time)', 'ขาดวันไหน เริ่มวันที่ {0} ใหม่ แต่แต้มที่สะสมไว้ไม่หาย': 'Miss a day and you restart at day {0}, but you keep your points',
    '{0} แต้ม แลกตรวจสัญญาฟรีได้ {1} ครั้ง · เดือนละไม่เกิน {2} ครั้ง (ใช้แล้ว {3})': '{0} pts = {1} free check · up to {2} per month (used {3})', 'รับ +{0} แต้ม': 'Claim +{0} pts',
    'แต้มสะสมสู่การแลกตรวจฟรี': 'Points toward a free check', 'วันที่ {0} +{1} แต้ม รับแล้ว': 'Day {0} +{1} pts claimed', 'รับรางวัลวันที่ {0} +{1} แต้ม': 'Claim day {0} reward +{1} pts',
    'วันที่ {0} +{1} แต้ม ยังไม่ถึง': 'Day {0} +{1} pts, not yet', 'เช็กอินแล้ว +{0} แต้ม': 'Checked in +{0} pts', 'แลกแล้ว ได้เครดิตตรวจ +{0} ครั้ง': 'Redeemed: +{0} check credit',

    /* ประวัติ / ทั่วไป */
    'ดูประวัติทั้งหมด': 'View all history', 'เมื่อสักครู่': 'just now', '{0} นาทีก่อน': '{0} min ago', '{0} ชม. ก่อน': '{0} h ago', '{0} วันก่อน': '{0} days ago', '{0} เดือนก่อน': '{0} months ago',
    'ยกเลิก': 'Cancel', 'ตกลง': 'OK', 'ยืนยัน': 'Confirm', 'ลบ': 'Delete', 'บันทึก': 'Save', 'กลับ': 'Back', 'ลองใหม่': 'Try again', 'ลองใหม่อีกครั้ง': 'Try again',
    'กรุณาเข้าสู่ระบบก่อน': 'Please log in first', 'ตอบไม่สำเร็จ ลองใหม่อีกครั้ง': 'Could not answer, please try again', 'โหลดประวัติไม่สำเร็จ ลองใหม่อีกครั้ง': 'Could not load history, please try again',
    'ระบบเครดิตมีปัญหา ลองใหม่อีกครั้ง': 'Credit system error, please try again', 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ ลองใหม่อีกครั้ง': 'Google sign-in failed, please try again',
    'ยืนยันออกจากระบบ?': 'Log out?', 'ต้องการออกจากระบบใช่ไหม?': 'Do you want to log out?',
    'ขยับเมาส์ ส่องหาจุดเสี่ยงในสัญญา': 'Move your mouse to spot risks in the contract',
    'ดอกเบี้ย': 'Interest', 'การรับเงิน': 'Payout', 'การผิดนัด': 'Default', 'การยึดทรัพย์': 'Seizure', 'การยึดเอกสาร': 'Holding documents', 'ผู้กู้': 'Borrower', 'ผู้ให้กู้': 'Lender',
    'ลูกจ้าง': 'Employee', 'นายจ้าง': 'Employer', 'เงินเดือน': 'Salary', 'การเลิกจ้าง': 'Dismissal', 'ชั่วโมงทำงาน': 'Working hours',
    'ทำที่ ……………… วันที่ ………… พ.ศ. ……': 'Made at ……………… on ………… ……',
    /* ชื่อฉาก 3D ในหน้าเลือกประเภท */
    'บ้าน': 'House', 'ที่ดิน': 'Land', 'ออฟฟิศ': 'Office', 'ห้องฝ่ายบุคคล': 'HR room', 'ตึกสำนักงาน': 'Office tower', 'ไซต์ก่อสร้าง': 'Construction site', 'โต๊ะฟรีแลนซ์': 'Freelancer desk',
    'มุมช่าง': 'Workshop', 'หลักประกัน': 'Collateral', 'ห้องรับแขก': 'Living room', 'ธนาคาร': 'Bank', 'ห้องประชุม': 'Meeting room', 'คาเฟ่': 'Café', 'ร้านค้า': 'Shop',
    'ห้องเซิร์ฟเวอร์': 'Server room', 'สูตรลับ': 'Secret recipe', 'ห้องเอกสารลับ': 'Confidential archive', 'โกดังตัวแทน': 'Agent warehouse', 'กรมธรรม์': 'Insurance policy',
    'ร้านฝากขาย': 'Consignment store', 'ห้อง': 'Room', 'คอนโด': 'Condo',
    "สัญญาจ้างแรงงาน": "Employment contract",
    "เวลาทำงาน": "Working hours",
    "ทดลองงาน": "Probation",
    "ค่าฝึกอบรม": "Training fee",
    "การหักค่าจ้าง": "Pay deductions",
    "วันลา": "Leave",
    "ข้อ 1 ผู้ให้เช่าตกลงให้ผู้เช่าเช่าห้องพักเลขที่ 305 เป็นระ…": "Clause 1 The landlord agrees to rent room no. 305 to the tenant for…",
    "ข้อ 2 ค่าเช่าเดือนละ 8,000 บาท ชำระภายในวันที่ 5 ของทุกเดื…": "Clause 2 Rent is 8,000 THB a month, due by the 5th of each…",
    "ข้อ 3 ผู้ให้เช่าอาจปรับค่าเช่าขึ้นได้ตลอดเวลาโดยไม่ต้องแจ้…": "Clause 3 The landlord may raise the rent at any time without notice…",
    "ข้อ 4 ผู้เช่าวางเงินประกัน 16,000 บาท ซึ่งจะคืนให้เมื่อสัญ…": "Clause 4 The tenant pays a 16,000 THB deposit, returned when the…",
    "ข้อ 5 หากผู้เช่ายกเลิกสัญญาก่อนครบกำหนด ไม่ว่าด้วยเหตุใด ผ…": "Clause 5 If the tenant ends the lease early for any reason, the…",
    "ข้อ 6 ผู้เช่าต้องรับผิดชอบค่าซ่อมแซมความเสียหายทุกกรณี แม้…": "Clause 6 The tenant pays for all repairs in every case, even…",
    "ข้อ 1 ผู้กู้ได้กู้ยืมเงินจากผู้ให้กู้จำนวน 30,000 บาท": "Clause 1 The borrower borrows 30,000 THB from the lender",
    "ข้อ 2 ผู้กู้ตกลงชำระดอกเบี้ยร้อยละ 10 ต่อเดือน ทุกวันที่ 1…": "Clause 2 The borrower pays 10% interest per month on the 1st…",
    "ข้อ 3 ผู้ให้กู้หักดอกเบี้ยเดือนแรกและค่าดำเนินการ 5,000 บา…": "Clause 3 The lender deducts the first month's interest and a 5,000 THB fee…",
    "ข้อ 4 หากผิดนัดชำระดอกเบี้ยครั้งใด ให้ถือว่าผิดสัญญาทั้งหม…": "Clause 4 Any missed interest payment counts as breach of the whole…",
    "ข้อ 5 ผู้กู้ยินยอมให้ผู้ให้กู้เข้ายึดทรัพย์สินในบ้านได้ทัน…": "Clause 5 The borrower lets the lender seize household property at once…",
    "ข้อ 6 ผู้กู้มอบบัตร ATM และสมุดบัญชีไว้กับผู้ให้กู้": "Clause 6 The borrower hands their ATM card and bankbook to the lender",
    "ข้อ 1 นายจ้างตกลงจ้างลูกจ้างในตำแหน่งเจ้าหน้าที่ธุรการ อัต…": "Clause 1 The employer hires the employee as an admin officer at…",
    "ข้อ 2 เวลาทำงานวันจันทร์ถึงวันเสาร์ เวลา 08.00 - 18.00 น. …": "Clause 2 Work hours are Monday to Saturday, 08:00–18:00 …",
    "ข้อ 3 ทดลองงาน 180 วัน ระหว่างทดลองงานนายจ้างเลิกจ้างได้ทั…": "Clause 3 180-day probation, during which the employer may dismiss at once…",
    "ข้อ 4 หากลูกจ้างลาออกภายใน 2 ปี ต้องชดใช้ค่าฝึกอบรม 50,000…": "Clause 4 If the employee resigns within 2 years, they repay 50,000 in training…",
    "ข้อ 5 นายจ้างหักค่าจ้างได้หากลูกจ้างทำทรัพย์สินเสียหาย ตาม…": "Clause 5 The employer may deduct pay for damaged property, as…",
    "ข้อ 6 ลูกจ้างลาป่วยได้ไม่เกินปีละ 5 วัน": "Clause 6 Sick leave is limited to 5 days a year",
    "ดูคลิปแนะนำ (มีเสียงพากย์)": "Watch intro",
    "โทร": "Phone",
    "จุด": "points",
    "{0} ฿": "{0} ฿",
    "ซ่อน": "Hide",
    "ราคา": "Price",
    "แนะนำ": "Recommended",
    "{0} วัน": "{0} days",
    "รายการ": "Items",
    "เอกสาร": "Documents",
    "รอชำระ": "Awaiting payment",
    "รายงาน": "Report",
    "เครดิต": "Credits",
    "ปกป้อง": "Protect",
    "ล้าง ✕": "Clear ✕",
    "สำเร็จ": "Success",
    "ภาพรวม": "Overview",
    "{0} อ่าน": "{0} Read",
    "{0} จาก {1}": "{0} of {1}",
    "ธุรกรรม": "Transactions",
    "ทั้งหมด": "All",
    "กลางคืน": "Night",
    "สามขั้น": "Three steps",
    "เลขบัตร": "ID number",
    "{0} ปกปิด": "{0} Mask",
    "ปักหมุด": "Pin",
    "สำคัญ {0}": "Important {0}",
    "ข้อกำหนด": "Terms",
    "ใน {0} วัน": "In {0} days",
    "ช่วงเวลา": "Period",
    "ดูแพ็กเกจ": "See packs",
    "หนึ่งนาที": "One minute",
    "ทุกประเภท": "All types",
    "จำนวนด่วน": "Quick amounts",
    "ใหม่ไปเก่า": "Newest first",
    "ใช้อย่างไร": "How to use",
    "ประเด็น {0}": "Issue {0}",
    "เก่าไปใหม่": "Oldest first",
    "กรองรายการ": "Filter",
    "ตรวจแล้ว ✓": "Reviewed ✓",
    "สรุปรายการ": "Summary",
    "อีเมลบัญชี": "Account email",
    "ดูตัวอย่าง": "Preview",
    "คลังเอกสาร": "Archive",
    "เรียงลำดับ": "Sort",
    "สัญญากู้ยืม": "Loan agreement",
    "เพิ่มเครดิต": "Add credits",
    "ค้นหารายงาน": "Search reports",
    "ล้างคำค้นหา": "Clear search",
    "I · การอ่าน": "I · Reading",
    "เลือกบริการ": "Choose a service",
    "พร้อมใช้งาน": "Ready",
    "สถิติธุรกิจ": "Business stats",
    "ตัวกรองด่วน": "Quick filters",
    "ตรวจฉบับนี้": "Check this one",
    "คำถามทั่วไป": "General questions",
    "ล้างตัวกรอง": "Clear filters",
    "รอดำเนินการ": "Pending",
    "สรุปธุรกรรม": "Transaction summary",
    "กลับไปภาพรวม": "Back to overview",
    "ใช้ประเภทนี้": "Use this type",
    "กรองตามสถานะ": "Filter by status",
    "เครดิตของคุณ": "Your credits",
    "เริ่มงานใหม่": "Start a new check",
    "กลับหน้าสรุป": "Back to summary",
    "จุดที่ควรถาม": "Points to ask",
    "ดูรายละเอียด": "Details",
    "ลบรูปโปรไฟล์": "Remove profile photo",
    "ล้างการเลือก": "Clear selection",
    "ประเภทประวัติ": "History type",
    "นายสมมติ ใจดี": "John Doe",
    "เบอร์โทรศัพท์": "Phone number",
    "เครดิตคงเหลือ": "Credits left",
    "สถิติย้อนหลัง": "Past stats",
    "ระบบนี้ทำอะไร": "What this does",
    "กู้คืนข้อความ": "Restore text",
    "ประวัติรายการ": "Transaction history",
    "กู้ / ยืมเงิน": "Loans / borrowing",
    "ขอบเขตของระบบ": "Scope of the service",
    "ไม่มีอะไรซ่อน": "Nothing hidden",
    "ซ่อนรายละเอียด": "Hide details",
    "เลขบัตรประชาชน": "National ID number",
    "{0}. บัญชีผู้ใช้": "{0}. User account",
    "ถ้าระบบล้มเหลว": "If a check fails",
    "อยู่หรือเปล่า?": "in your contract?",
    "II · วิธีทำงาน": "II · How it works",
    "คำถามที่พบบ่อย": "FAQ",
    "เว็บเราช่วยคุณ": "How we help",
    "ชื่อและนามสกุล": "Full name",
    "จากสัญญาของคุณ": "from your contract",
    "บอกว่าควรขอแก้": "tell you what to change",
    "ข้อที่ควรระวัง": "Clauses to watch",
    "← กลับด้านหน้า": "← Back to front",
    "สิทธิ์ตรวจสัญญา": "Contract checks",
    "ข้อความที่แนะนำ": "Suggested wording",
    "{0} ทำเครื่องหมาย": "{0} Mark",
    "ชี้ข้อที่เสี่ยง": "Point out risky clauses",
    "ระดับความเสี่ยง": "Risk level",
    "ความเป็นส่วนตัว": "Privacy",
    "ปัญหาที่เจอบ่อย": "Common problems",
    "ประเด็นควรทบทวน": "Issues to review",
    "สิ่งที่ควรขอแก้": "What to ask to change",
    "เช่าห้อง / คอนโด": "Room / condo rental",
    "ประเภทที่ใช้บ่อย": "Common types",
    "ยอดเครดิตคงเหลือ": "Credit balance",
    "ทุกข้อ ทุกบรรทัด": "Every clause, every line",
    "ค้นหาประเภทสัญญา": "Search contract types",
    "ร่วมหุ้นทำธุรกิจ": "Business partnership",
    "{0} · อ่านทีละข้อ": "{0} · Read clause by clause",
    "รู้ไว้ก่อนใช้งาน": "Before you start",
    "กำลังโหลดบ้าน 3D…": "Loading 3D house…",
    "ยอมรับทั้งสองฉบับ": "Accept both",
    "ให้ระบบพิจารณาเอง": "Let us decide",
    "เลือกเรื่องที่เจอ": "Pick your situation",
    "ตรวจสัญญา {0} ครั้ง": "{0} contract checks",
    "สรุปเสียง {0} ครั้ง": "{0} audio summaries",
    "เครดิตและชำระเงิน": "Credits & payment",
    "ข้อกำหนดและนโยบาย": "Terms & policies",
    "ยังไม่มีผลการตรวจ": "No results yet",
    "กับสัญญาหนึ่งฉบับ": "with one contract",
    "ตรวจสัญญาย้อนหลัง": "Past checks",
    "สำหรับทดลองใช้งาน": "to try it out",
    "เช่น นายสมชาย ใจดี": "e.g. John Smith",
    "กรองตามประเภทสัญญา": "Filter by contract type",
    "III · ภาพยนตร์สั้น": "III · Short film",
    "เครดิตแยกตามประเภท": "Credits by type",
    "คลิปแนะนำเช็กสัญญา": "Contract Check intro video",
    "ผลตรวจจะแสดงตรงนี้": "Results appear here",
    "ลองใช้สัญญาตัวอย่าง": "Try a sample contract",
    "ปกปิดอีเมลที่ตรวจพบ": "Mask detected emails",
    "ข้อความสัญญาที่ตรวจ": "Checked contract text",
    "ภาพรวมประวัติรายการ": "History overview",
    "✓ สิ่งที่เราช่วยได้": "✓ What we can do",
    "รายละเอียดจุดเสี่ยง": "Risk details",
    "จ้างช่าง / ฟรีแลนซ์": "Contractors / freelancers",
    "ชำระเงินอย่างโปร่งใส": "Transparent payment",
    "รายการตรวจสอบทั้งหมด": "All checks",
    "อีเมลและข้อมูลติดต่อ": "Email and contact details",
    "ตั้งเตือนวันครบสัญญา": "Remind me when it ends",
    "ใช้สิทธิ์ตรวจครบแล้ว": "All checks used",
    "✕ สิ่งที่เราไม่ได้ทำ": "✕ What we don't do",
    "III · เราช่วยอะไรได้": "III · How we help",
    "แตะป้ายเพื่อดูแบบอื่น": "Tap a tag to see another",
    "หรือถามอีกฝ่ายว่าอะไร": "or what to ask the other party",
    "ค้นหารายการเติมเครดิต": "Search top-ups",
    "ไม่พลาดวันแจ้งย้ายออก": "Never miss a move-out notice date",
    "ดูตัวอย่างผลตรวจฟรี →": "See a free sample result →",
    "ในสัญญามักเขียนแบบนี้": "Contracts often say this",
    "เปิดการปกปิดอัตโนมัติ": "Turn on auto-masking",
    "คลิปแนะนำแบบไม่มีเสียง": "Silent intro video",
    "กำลังจะเซ็นสัญญาแบบนี้": "About to sign something like this",
    "เฉลี่ย {0} บาทต่อครั้ง": "avg {0} THB per check",
    "สะสมแต้มแลกตรวจสัญญาฟรี": "Collect points for free checks",
    "รายการที่ควรคุยก่อนเซ็น": "Items to discuss before signing",
    "ทุกการตรวจสอบอยู่ที่นี่": "All your checks are here",
    "พิมพ์คำที่ไม่ต้องการส่ง": "Type words you don't want sent",
    "ค้นหา เช่น เช่า จ้าง กู้": "Search, e.g. rent, job, loan",
    "บัญชีและยอดเครดิตคงเหลือ": "Account and credit balance",
    "ส่งเฉพาะข้อที่ติดดาว ({0})": "Send starred only ({0})",
    "ไม่ตัดสินว่าใครถูกใครผิด": "We don't decide who's right",
    "ค่าน้ำค่าไฟแพงกว่าที่คิด": "Utility bills higher than expected",
    "ตั้งเตือนวันสำคัญในสัญญา": "Set reminders for key dates",
    "พร้อมยกข้อความจริงมาให้ดู": "quoting the actual text",
    "ใช้สรุปผลการตรวจเป็นเสียง": "For audio summaries of results",
    "ซื้อรถ / ที่ดิน / ผ่อนของ": "Car / land / instalments",
    "ไม่ได้ติดต่ออีกฝ่ายแทนคุณ": "We don't contact the other party for you",
    "↓ เราจะบอกว่าควรขอแก้เป็น": "↓ We suggest asking for",
    "ปกปิดเลข {0} หลักที่ตรวจพบ": "Mask detected {0}-digit numbers",
    "ลองดูตัวอย่างผลตรวจ · ฟรี": "Try a sample result · free",
    "ดูตัวอย่างข้อความหลังปกปิด": "Preview the masked text",
    "เครดิตจะถูกคืนให้อัตโนมัติ": "Credits are refunded automatically",
    "ของในห้องพัง ต้องซ่อมเองหมด": "Anything breaks, you pay for it all",
    "{0} · ปกปิดสิ่งที่เป็นของคุณ": "{0} · Mask what's yours",
    "ไม่ได้ร่างสัญญาใหม่ทั้งฉบับ": "We don't redraft the whole contract",
    "วิธีใช้งาน & คำถามที่พบบ่อย": "How to use & FAQ",
    "แตะ ⊕ เพื่อดูจุดที่ควรระวัง": "Tap ⊕ to see what to watch",
    "คุณมาถึงประเด็นที่เลือกแล้ว": "You've reached the selected issue",
    "ลงชื่อ ............ ผู้เช่า": "Signed ............ Tenant",
    "ดูตัวอย่างผลตรวจสัญญาจ้างงาน": "See a sample employment result",
    "ปกปิดหมายเลขโทรศัพท์ที่ตรวจพบ": "Mask detected phone numbers",
    "ลงชื่อ ............ ผู้ให้เช่า": "Signed ............ Landlord",
    "ประวัติการตรวจและการเติมเครดิต": "Check and top-up history",
    "บอกว่าควรถาม หรือขอแก้เป็นอะไร": "What to ask or request instead",
    "ปกปิดก่อนส่งข้อความไปวิเคราะห์": "Masked before the text is analysed",
    "เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง": "Can't connect, please try again",
    "ย้ายออกแล้ว ไม่ได้เงินประกันคืน": "Moved out and never got the deposit back",
    "ดูตัวอย่างผลตรวจสัญญากู้ยืมเงิน": "See a sample loan result",
    "ภาพรวมของสัญญาว่าน่ากังวลแค่ไหน": "How worrying the contract is overall",
    "ดูตัวอย่างผลตรวจสัญญาเช่าห้องพัก": "See a sample room rental result",
    "คลิปแนะนำ Vellum Check เช็กสัญญา": "Vellum Check intro video",
    "สัญญาอื่น ๆ (ไม่ตรงกับข้อด้านบน)": "Other (none of the above)",
    "ชี้ทีละข้อพร้อมเหตุผลแบบภาษาง่าย": "Clause by clause, explained simply",
    "ดูตัวอย่างฟรี: เช่าห้องพักรายปี →": "Free sample: yearly room rental →",
    "ค้นหาจากชื่อรายงานหรือประเภทสัญญา": "Search by report name or contract type",
    "ใช้ตรวจสัญญาและวิเคราะห์ความเสี่ยง": "For contract checks and risk analysis",
    "ไม่ใช่ทนาย ไม่ได้ให้คำปรึกษากฎหมาย": "Not a lawyer, no legal advice",
    "ไม่รู้ประเภทก็เลือก \"ไม่แน่ใจ\" ได้": "Don't know the type? Choose \"Not sure\"",
    "สัญญามีระยะเวลา {0} ปี นับจากวันลงนาม": "The term is {0} year from signing",
    "ไม่แน่ใจ (ระบบจะดูจากข้อความให้เอง)": "Not sure (we detect it from the text)",
    "ค้นหาแพ็กเกจ / วันที่ / เลขที่รายการ": "Search pack / date / reference",
    "เวอร์ชันไม่มีเสียง · เล่นวนอัตโนมัติ": "Silent version · loops automatically",
    "ผู้เช่าต้องซ่อมแซมความเสียหายทุกกรณี": "The tenant must repair all damage in every case",
    "ปิดชื่อ เลขบัตร เบอร์โทร ก่อนส่งตรวจ": "Mask names, IDs and phone numbers before checking",
    "วันสิ้นสุด วันแจ้งล่วงหน้า วันชำระเงิน": "End dates, notice dates, payment dates",
    "เลือกแพ็กเกจที่เหมาะกับการใช้งานของคุณ": "Choose the pack that suits you",
    "{0} · ทำเครื่องหมายสิ่งที่ควรถามก่อนเซ็น": "{0} · Mark what to ask before signing",
    "{0}:{1} · มีเสียงพากย์ · แตะที่ภาพเพื่อเล่น": "{0}:{1} · narrated · tap to play",
    "สัญญาซื้อขาย (ราคา การส่งมอบ การชำระเงิน)": "Sale (price, delivery, payment)",
    "สัญญาเช่า (ค่าเช่า เงินมัดจำ ระยะเวลาเช่า)": "Rental (rent, deposit, term)",
    "สัญญากู้ยืมเงิน (ดอกเบี้ย วันครบกำหนดชำระ)": "Loan (interest, due dates)",
    "ย้ายออกก่อนครบสัญญา ไม่คืนเงินประกันทุกกรณี": "Move out early, no deposit refund in any case",
    "สัญญาหุ้นส่วน (แบ่งกำไร หน้าที่ของแต่ละฝ่าย)": "Partnership (profit split, duties)",
    "เครื่องมือช่วยคัดกรองเบื้องต้น · Vellum Check": "Initial screening tool · Vellum Check",
    "แต่ละข้อถูกอ่าน และเทียบกับข้อความจริงในสัญญา": "Each clause is read and matched to the actual text",
    "คลิปแนะนำ Vellum Check เช็กสัญญา (ไม่มีเสียง)": "Vellum Check intro video (silent)",
    "ดูรายการตรวจสัญญาและประวัติการใช้เครดิตของคุณ": "Your contract checks and credit history",
    "ชี้ข้อที่ควรระวัง พร้อมอ้างข้อความจริงในสัญญา": "Points out risky clauses, quoting the real text",
    "ตัวอย่างไม่ใช้เครดิต · สมัครใหม่ตรวจฟรี {0} ครั้ง": "Samples are free · new accounts get {0} free checks",
    "ตัวอย่างเพื่อให้เห็นภาพ · ไม่ใช่คำแนะนำทางกฎหมาย": "Illustration only · not legal advice",
    "ข้อความที่วางไว้ยังอยู่ เลือกแพ็กเกจเพื่อตรวจต่อ": "Your text is kept; choose a pack to continue",
    "ไม่พบประเภทที่ตรง ลองคำอื่น หรือเลือก \"ไม่แน่ใจ\"": "No match; try another word or choose \"Not sure\"",
    "สัญญาจ้างงาน (เงินเดือน ชั่วโมงทำงาน การเลิกจ้าง)": "Employment (salary, hours, dismissal)",
    "ค่าเช่าเดือนละ {0} บาท ชำระทุกวันที่ {1} ของเดือน": "Rent is {0} THB a month, due on the {1}th",
    "สัญญาจ้างบริการ (ขอบเขตงาน กำหนดส่งงาน ค่าจ้างงวด)": "Service (scope, deadlines, milestone pay)",
    "เลือกเรื่องที่ตรงกับคุณ แล้วดูว่าเราช่วยอะไรได้บ้าง": "Pick your situation and see how we help",
    "ผู้ให้เช่าปรับค่าเช่าได้ตลอดเวลา โดยไม่แจ้งล่วงหน้า": "The landlord can raise rent anytime without notice",
    "สัญญารักษาความลับ (ห้ามเปิดเผยข้อมูล ระยะเวลาคุ้มครอง)": "NDA (confidentiality, protection period)",
    "ไม่พบประเด็นที่ตรงกับคำค้น ลองใช้คำอื่นหรือล้างตัวกรอง": "No matching issues; try another word or clear filters",
    "คุณดูครบทุกประเด็นแล้ว ควรอ่านสัญญาทั้งฉบับอีกครั้งก่อนลงนาม": "You've seen every issue; read the whole contract once more before signing",
    "คืนเงินประกันภายใน {0} วัน หักได้เฉพาะความเสียหายที่มีหลักฐาน": "Return the deposit within {0} days, deducting only proven damage",
    "ปกปิดคำอื่นเพิ่มเอง (คั่นด้วยจุลภาค เช่น ชื่อบริษัท, ที่อยู่)": "Mask other words (comma separated, e.g. company name, address)",
    "ผู้เช่าย้ายออกก่อนครบสัญญา ผู้ให้เช่าจะไม่คืนเงินประกันทุกกรณี": "If the tenant leaves early, the landlord keeps the deposit in every case",
    "· ภาพเคลื่อนไหวมือที่ดัดแปลงนี้เผยแพร่ภายใต้สัญญาอนุญาตเดียวกัน": "· This adapted hand animation is shared under the same licence",
    "พบข้อความที่ยังไม่ได้ตรวจ บันทึกไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น": "Unchecked text found, saved only in this browser",
    "ใส่เลขติดลบเพื่อลดเครดิต ยอดจะไม่ต่ำกว่า {0} · ทุกครั้งถูกบันทึกในระบบ": "Use a negative number to remove credits; balance never goes below {0} · every change is logged",
    "ไม่ควรวางข้อมูลส่วนตัวที่ไม่จำเป็น เช่น เลขบัตรประชาชน หรือเลขบัญชีธนาคาร": "Avoid pasting unnecessary personal data such as ID or bank account numbers",
    "ระบบไม่ตัดสินว่าสัญญาเป็นธรรมหรือไม่ แต่ชี้ว่าควรถามหรือตรวจอะไรก่อนลงนาม": "We don't judge whether a contract is fair; we point out what to ask or check before signing",
    "แนะนำ: วางเฉพาะข้อความสัญญาที่ต้องการตรวจ ไม่ต้องใส่ข้อมูลส่วนตัวที่ไม่จำเป็น": "Tip: paste only the contract text you want checked, without unnecessary personal data",
    "ตรวจสอบจำนวนเครดิตก่อนเริ่มใช้งาน และเก็บประวัติรายการไว้สำหรับตรวจสอบย้อนหลัง": "Check your credits before starting; your transaction history is kept for reference",
    "เลือกแพ็กเกจด้านบนเพื่อดูยอดชำระ ระบบจะยังไม่เรียกเก็บเงินจนกว่าคุณจะกดสร้าง QR": "Choose a pack above to see the total; nothing is charged until you create the QR",
    "ตรวจสอบยอดเงินและจำนวนครั้งก่อนชำระทุกครั้ง ไม่มีการเรียกเก็บเงินซ้ำโดยอัตโนมัติ": "Check the amount and number of checks before paying; there are no automatic repeat charges",
    "ชื่อ เลขบัตร และข้อมูลติดต่อถูกปิดทับในเบราว์เซอร์ ก่อนข้อความจะถูกส่งไปวิเคราะห์": "Names, IDs and contact details are masked in your browser before analysis",
    "ช่วยคัดกรองความเสี่ยงเบื้องต้นของสัญญาภาษาไทย แสดงข้อที่ควรตรวจและแยกเป็นระดับความเสี่ยง": "Screens Thai contracts for risks, showing what to check, grouped by risk level",
    "ภาพมือเซ็นชื่อสร้างจากโมเดล 3D “Rigged hand” โดย Elena FF (Sketchfab) ใช้ภายใต้สัญญาอนุญาต": "The signing hand comes from the 3D model “Rigged hand” by Elena FF (Sketchfab), used under licence",
    "เครื่องมือคัดกรองเบื้องต้น · ไม่ใช่คำปรึกษาทางกฎหมาย · ควรให้ทนายตรวจก่อนลงนามในสัญญาสำคัญ": "Screening tool · not legal advice · have a lawyer review important contracts before signing",
    "เข้าสู่ระบบ เลือกประเภทสัญญา (ถ้ารู้) วางข้อความสัญญา แล้วกดตรวจ การตรวจแต่ละครั้งใช้ {0} เครดิต": "Log in, choose the contract type (if known), paste the text and press Check. Each check uses {0} credit",
    "ไม่ใช่คำปรึกษาทางกฎหมาย ระบบไม่ฟันธงว่าสัญญาเป็นธรรมหรือไม่ และไม่บอกว่าฝ่ายใดได้เปรียบ ควรให้ทนายตรวจก่อนลงนามในสัญญาสำคัญ": "Not legal advice. We don't rule on fairness or say who has the advantage. Have a lawyer review important contracts before signing.",
    "ข้อความสัญญาที่คุณกดตรวจจะถูกส่งให้ผู้ให้บริการ AI (Anthropic) เพื่อวิเคราะห์ ไฟล์ PDF/Word/รูปภาพถูกอ่านเป็นข้อความบนเซิร์ฟเวอร์ของเรา": "Contract text you check is sent to our AI provider (Anthropic) for analysis. PDF/Word/image files are converted to text on our server.",
    "ได้รายงานเรียงตามระดับความเสี่ยง บอกว่าควรจัดการก่อนลงนามหรือก่อนจ่ายเงิน มีแนวทางต่อรอง คัดลอก แชร์ หรือบันทึกเป็น PDF และเก็บไว้ในคลังประวัติ": "You get a report sorted by risk, saying whether to act before signing or paying, with negotiation tips. Copy, share or save as PDF; it's kept in your history.",
    "AI อ่านสัญญาทีละข้อและชี้จุดที่ควรตรวจ พร้อมอ้างข้อความจากสัญญาจริง เซิร์ฟเวอร์ตรวจว่าข้อความที่อ้างมีอยู่ในสัญญาจริง ถ้าไม่พบจะติดป้ายให้เห็นชัด": "AI reads the contract clause by clause and quotes the real text. Our server verifies each quote exists in your contract and clearly labels any that don't.",
    "ชื่อ เลขบัตรประชาชน เบอร์โทร และอีเมล ถูกปกปิดในเบราว์เซอร์ของคุณก่อนส่งไปวิเคราะห์ เลือกได้ว่าจะปกปิดอะไร และดูตัวอย่างข้อความหลังปกปิดได้ ระบบอาจตรวจจับไม่ครบทุกกรณี ควรอ่านทวนเองก่อนส่ง": "Names, ID numbers, phone numbers and emails are masked in your browser before analysis. Choose what to mask and preview the result. Detection may miss some cases, so double-check before sending."
  };
  /* กฎแบบมีส่วนเนื้อหา: ส่วนที่จับได้ ($1, $2) จะถูกแปลต่อถ้าเป็นภาษาไทย */
  var RULES = [
    [/^(.+) 3D ลากเพื่อหมุน$/, '$1 3D · drag to rotate'],
    [/^บ้าน 3D “(.+)” โดย (.+) \(Sketchfab\) ·$/, '3D house “$1” by $2 (Sketchfab) ·'],
    [/^ประเด็นที่ (\d+) · (.*)$/, 'Issue $1 · $2'],
    [/^ประเด็น (\d+) · (.*)$/, 'Issue $1 · $2'],
    [/^เลขที่รายงาน (.+)$/, 'Report no. $1'],
    [/^ข้อความตรงกับสัญญา · มาตราที่ AI ระบุ: (.*) \(ยังไม่ได้ตรวจเทียบกฎหมาย\)$/, 'Text matches contract · sections cited by AI: $1 (not yet verified against the law)'],
    [/^ดูเหตุผล: (.+)$/, 'See why: $1'],
    [/^สวัสดี คุณ (.+)$/, 'Hello, $1'],
    [/^ข้อ (\d+) · (.+)$/, 'Clause $1 · $2'],
    [/^เรื่อง "(.+)" ควรเขียนแบบไหนถึงจะเป็นธรรม\?$/, 'How should "$1" be worded to be fair?'],
    [/^เรื่อง "(.+)" ถ้าอีกฝ่ายไม่ยอมแก้ ควรทำอย่างไร\?$/, 'What if the other party won\'t change "$1"?'],
    [/^เรื่อง "(.+)" มีความเสี่ยงอะไรถ้าเซ็นไปทั้งแบบนี้\?$/, 'What is the risk of signing "$1" as is?'],
    [/^ควรเพิ่มเรื่อง "(.+)" ในสัญญาอย่างไร\?$/, 'How should "$1" be added to the contract?']
  ];
  /* เดือนไทย → อังกฤษ */
  var MF = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var MS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var EM = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var ES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dates(s) {
    s = s.replace(new RegExp('(\\d{1,2})\\s+(' + MF.join('|') + ')\\s+(\\d{4})', 'g'), function (m, d, mo, y) { y = +y; return d + ' ' + EM[MF.indexOf(mo)] + ' ' + (y > 2400 ? y - 543 : y); });
    s = s.replace(new RegExp('(\\d{1,2})\\s*(' + MS.map(function (x) { return x.replace(/\./g, '\\.'); }).join('|') + ')(\\s*(\\d{2,4}))?', 'g'), function (m, d, mo, _, y) {
      var r = d + ' ' + ES[MS.indexOf(mo)]; if (y) { y = +y; if (y < 100) y += 2500; r += ' ' + (y > 2400 ? y - 543 : y); } return r; });
    return s;
  }

  var TH = /[฀-๿]/, NUM = /\d[\d,]*(?:\.\d+)?/g;
  var missing = window.__vcMissing = {};
  var cache = {};
  function tr(s) {
    if (!s || !TH.test(s)) return null;
    if (cache.hasOwnProperty(s)) return cache[s];
    var lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], t = s.trim().replace(/\s+/g, ' '), out = null;
    if (D.hasOwnProperty(t)) out = D[t];
    else {
      var nums = [], key = t.replace(NUM, function (m) { nums.push(m); return '{' + (nums.length - 1) + '}'; });
      if (nums.length && D.hasOwnProperty(key)) out = D[key].replace(/\{(\d+)\}/g, function (m, i) { return nums[+i] != null ? nums[+i] : m; });
      else { var dt = dates(t); if (dt !== t && !TH.test(dt)) out = dt; }
      if (out == null) for (var r = 0; r < RULES.length; r++) {
        var m = RULES[r][0].exec(t); if (!m) continue;
        out = RULES[r][1].replace(/\$(\d)/g, function (x, i) { var v = m[+i] || ''; if (TH.test(v)) { var w = tr(v); return w != null ? w.trim() : v; } return v; });
        break;
      }
    }
    if (out == null) { if (Object.keys(missing).length < 3000) missing[t] = (missing[t] || 0) + 1; cache[s] = null; return null; }
    out = lead + out + trail; cache[s] = out; return out;
  }
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  function skip(el) { return !el || el.closest && el.closest('[data-i18n-skip],script,style,[contenteditable="true"]'); }
  var HEAD = { 'ตรวจสัญญา': 'Check' };   /* แถบด้านบนพื้นที่น้อย ใช้คำสั้น */
  function doText(n) { var p = n.parentElement;
    if (p && p.closest('.site-header') && HEAD[n.nodeValue.trim()]) { n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), HEAD[n.nodeValue.trim()]); return; } if (skip(p) || (p && p.closest('textarea,#vwBody,.hl-quote,.tx-old,.sg-old > p:not(.sg-plbl),blockquote,.ad-face .gv,.vc-raw'))) return; var v = tr(n.nodeValue); if (v != null && v !== n.nodeValue) n.nodeValue = v; }
  function doAttrs(el) {
    if (skip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) { var a = el.getAttribute(ATTRS[i]); if (a && TH.test(a)) { var v = tr(a); if (v != null) el.setAttribute(ATTRS[i], v); } }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && TH.test(el.value)) { var w = tr(el.value); if (w != null) el.value = w; }
  }
  function walk(node) {
    if (node.nodeType === 3) { doText(node); return; }
    if (node.nodeType !== 1) return;
    doAttrs(node);
    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) if (TH.test(n.nodeValue)) doText(n);
    if (node.querySelectorAll) { var els = node.querySelectorAll('[placeholder],[aria-label],[title],[alt],input[type=button],input[type=submit]'); for (var i = 0; i < els.length; i++) doAttrs(els[i]); }
  }
  /* ข้อความในกล่องเตือน/ยืนยันของเบราว์เซอร์ */
  ['alert', 'confirm', 'prompt'].forEach(function (k) {
    var f = window[k]; if (!f) return;
    window[k] = function (m) { var a = [].slice.call(arguments); if (typeof m === 'string') { var v = tr(m); if (v != null) a[0] = v; } return f.apply(window, a); };
  });
  function title() { var v = tr(document.title); if (v) document.title = v; }

  root.setAttribute('lang', 'en');
  boot(function () {
    title(); try { walk(document.body); } catch (e) {} root.classList.remove('i18n-wait');
    if (!('MutationObserver' in window)) return;
    var q = [], sched = false;
    function flush() { sched = false; var a = q; q = []; for (var i = 0; i < a.length; i++) { var n = a[i]; if (n.nodeType === 3) doText(n); else if (n.isConnected) walk(n); } }
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === 'characterData') { if (TH.test(m.target.nodeValue)) q.push(m.target); }
        else if (m.type === 'attributes') { if (m.target.nodeType === 1) doAttrs(m.target); }
        else for (var j = 0; j < m.addedNodes.length; j++) q.push(m.addedNodes[j]);
      }
      if (q.length && !sched) { sched = true; (window.queueMicrotask || setTimeout)(flush); }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    new MutationObserver(title).observe(document.querySelector('title') || document.head, { childList: true, characterData: true, subtree: true });
  });
})();
