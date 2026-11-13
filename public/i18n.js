/* ===== ภาษาอังกฤษ (i18n) — v1 =====
   - เลือกภาษาเก็บไว้ที่ localStorage 'vc_lang' ('th' ค่าเริ่มต้น / 'en' / 'zh' จีนตัวย่อ)
   - v2: ภาษาจีน = พจนานุกรมไทย→อังกฤษ แล้วแปลงอังกฤษ→จีนด้วย ZH (+ ZO สำหรับคำที่ต้องแปลต่างจากอังกฤษ)
   - โหมดไทย: ไม่ทำอะไรเลย (ไม่แตะหน้าเว็บ)
   - โหมดอังกฤษ: แปลข้อความบนหน้าเว็บด้วยพจนานุกรม (ตรงทั้งข้อความ หรือแบบแม่แบบตัวเลข {0} {1})
     ตามติดข้อความที่สคริปต์อื่นสร้างทีหลังด้วย MutationObserver · แปล placeholder / aria-label / title / alt ด้วย
   - ส่ง header x-vc-lang: en ไปกับคำขอ /api/ → เซิร์ฟเวอร์ให้ AI เขียนผลตรวจ/คำตอบเป็นภาษาอังกฤษ
   - ปุ่มสลับภาษา: ปุ่ม TH/EN บนแถบด้านบน + แถว "ภาษา" ในแผงการแสดงผล (สลับแล้วโหลดหน้าใหม่)
   ข้อความที่ยังไม่มีคำแปลจะถูกเก็บไว้ใน window.__vcMissing (ไว้เติมพจนานุกรมรอบหน้า) */
(function () {
  'use strict';
  var LANG = 'th';
  var OKL = { th: 1, en: 1, zh: 1 };
  try { var sv = localStorage.getItem('vc_lang'); LANG = OKL[sv] ? sv : 'th'; } catch (e) {}
  /* ?lang=en|th ในลิงก์ (ใช้ตอนสลับภาษา) มีผลเหนือค่าที่จำไว้ แล้วลบออกจากแถบที่อยู่ */
  try {
    var qm = /[?&]lang=(en|th|zh)\b/.exec(location.search);
    if (qm) {
      LANG = qm[1]; localStorage.setItem('vc_lang', LANG);
      var q = location.search.replace(/([?&])lang=(en|th|zh)(&|$)/, function (m, a, b, c) { return c ? a : ''; }).replace(/([?&])_l=\d+(&|$)/, function (m, a, c) { return c ? a : ''; }).replace(/[?&]$/, '');
      history.replaceState(history.state, '', location.pathname + q + location.hash);
    }
  } catch (e) {}
  var root = document.documentElement;
  root.setAttribute('data-lang', LANG);
  /* สไตล์ของปุ่มสลับภาษา (ฝังไว้ในไฟล์นี้ ไม่ต้องมีไฟล์ CSS เพิ่ม) */
  var css = document.createElement('style');
  css.textContent =
    '.vc-lang{appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:0;padding:3px;margin:0 8px 0 auto;border-radius:99px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);font:600 11.5px/1 Prompt,system-ui,sans-serif;letter-spacing:.04em;flex:none}' +
    '.vc-lang span{padding:5px 8px;border-radius:99px;color:rgba(236,233,226,.55);transition:background-color .2s,color .2s}' +
    '.vc-lang span.is-on{background:linear-gradient(180deg,#f1c46a,#d6a447);color:#1c1408}' +
    '#dispPanel .vds-seg2{grid-template-columns:1fr 1fr !important}' +
    "html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-menu::before{content:\"设置\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-card-num small::after{content:\"点数\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"显示你账户中剩余的点数\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"✓ 账户信息\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"可用\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-rows dd::after{content:\"可用次数\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total::after{content:\"所有类型点数合计\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .cred-card .acct-info::after{content:\"✓ 已登录\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authCard:has(#authLoggedIn:not([hidden])) .sheet-head h2::after{content:\"我的账户\" !important}html[data-lang=zh][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"已登录\" !important}html[data-lang=zh] #authLoggedIn .cred-card .acct-info::after{content:\"✓ 已登录\" !important}html[data-lang=zh] .vsl-item::after{content:\"查看合同 ›\" !important}html[data-lang=zh].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard .credit-chip:not(.is-zero) b::after{content:\" 点\" !important}html[data-lang=zh] body[data-sheet=\"acct\"] #authCard .sheet-head .acct-label::after{content:\"已登录\" !important}html[data-lang=zh].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard:has(.ta-wrap:not(.vc-has)) #checkBtn:disabled::after{content:\"先在上方粘贴合同，再点检查\" !important}html[data-lang=zh].vc-art article.rpt.vc-m3 .ix-row.vc-swiping::after,html[data-lang=zh].vc-art article.rpt.vc-m3 .ix-row.vc-sw-back::after{content:\"✓ 已读\" !important}html[data-lang=zh].vc-art article.rpt.vc-m > .gloss .gl-title p::after{content:\" · 点击查看完整说明\" !important}html[data-lang=zh].vc-art .vc-sum .vc-sum-hd .vc-sum-meta .vc-type-chg::before{content:\"识别的类型 · \" !important}html[data-lang=zh] .hxs::before{content:\"签名\" !important}html[data-lang=zh] .vsl.fix-on .vsl-doc::before{content:\"绿色文字 = 签字前建议要求修改的措辞 · 并非法律意见\" !important}html[data-lang=zh].vc-gin::before{content:\"登录\" !important}html[data-lang=zh] #resultCard .empty::after{content:\"在左侧粘贴合同后点检查，结果会显示在这里\" !important}html[data-lang=zh] #authLoggedIn .acct-menu::before{content:\"设置\" !important}html[data-lang=zh] #authLoggedIn .wallet-card-num small::after{content:\"点数\" !important}html[data-lang=zh] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"显示你账户中剩余的点数\" !important}html[data-lang=zh] #authLoggedIn .acct-info::after{content:\"✓ 账户信息\" !important}html[data-lang=zh] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"可用\" !important}html[data-lang=zh] #authLoggedIn .wallet-rows dd::after{content:\"可用次数\" !important}html[data-lang=zh] #authLoggedIn .wallet-total::after{content:\"所有类型点数合计\" !important}" +
    '#authLoggedIn #dispPanel .vds-seg2 button b{font-size:16px !important}' +
    'html:not([data-lang=th]).i18n-wait body{opacity:0}' +
    '.vc-lnote{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0);-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);transition:background-color .26s,backdrop-filter .26s,-webkit-backdrop-filter .26s}' +
    '.vc-lnote.is-in{background:rgba(0,0,0,.62);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}' +
    '.vc-ln-card{position:relative;width:min(420px,100%);padding:22px 20px 18px;border-radius:22px;background:linear-gradient(180deg,#1b1c21,#141519);border:1px solid rgba(241,196,106,.22);box-shadow:0 30px 70px -24px rgba(0,0,0,.95),inset 0 1px 0 rgba(255,255,255,.05);color:#ece9e2;opacity:0;transform:translateY(14px) scale(.97);transition:transform .32s cubic-bezier(.2,.8,.2,1),opacity .26s}' +
    '.vc-lnote.is-in .vc-ln-card{opacity:1;transform:none}' +
    '.vc-ln-grab{display:none}' +
    '.vc-ln-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}' +
    '.vc-ln-badge{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#f1c46a;background:radial-gradient(circle at 35% 30%,rgba(241,196,106,.28),rgba(241,196,106,.08));box-shadow:inset 0 0 0 1px rgba(241,196,106,.35)}' +
    '.vc-ln-badge svg{width:21px;height:21px}' +
    '.vc-ln-sw{display:flex;align-items:center;gap:6px;padding:5px;border-radius:99px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}' +
    '.vc-ln-sw b{min-width:34px;padding:5px 8px;border-radius:99px;text-align:center;font-size:12px;font-weight:700;letter-spacing:.06em}' +
    '.vc-ln-sw .is-from{color:rgba(236,233,226,.55)}' +
    '.vc-ln-sw .is-to{color:#1c1408;background:linear-gradient(180deg,#f1c46a,#d6a447)}' +
    '.vc-ln-sw i{display:grid;color:#f1c46a}.vc-ln-sw i svg{width:15px;height:15px}' +
    '@media (prefers-reduced-motion:no-preference){.vc-lnote.is-in .vc-ln-sw i{animation:vcLnArrow 1.6s ease-in-out .3s infinite}.vc-lnote.is-in .vc-ln-sw .is-to{animation:vcLnPop .5s cubic-bezier(.3,1.5,.5,1) .25s both}}' +
    '@keyframes vcLnArrow{50%{transform:translateX(3px)}}@keyframes vcLnPop{from{transform:scale(.6);opacity:0}}' +
    '.vc-ln-title{font-size:19px;font-weight:700;line-height:1.3;margin:0 0 14px}' +
    '.vc-ln-title small{display:block;margin-top:2px;font-size:13px;font-weight:500;color:rgba(236,233,226,.5)}' +
    '.vc-ln-list{list-style:none;margin:0;padding:4px 0;border-top:1px solid rgba(255,255,255,.07)}' +
    '.vc-ln-list li{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.vc-ln-ic{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#f1c46a;background:rgba(241,196,106,.1);box-shadow:inset 0 0 0 1px rgba(241,196,106,.22)}' +
    '.vc-ln-list b{display:block;font-size:14.5px;font-weight:600;line-height:1.45;color:#ece9e2}' +
    '.vc-ln-list small{display:block;margin-top:2px;font-size:12.5px;line-height:1.4;color:rgba(236,233,226,.5)}' +
    '.vc-ln-acts{display:flex;gap:10px;margin-top:16px}' +
    '.vc-ln-acts button{position:relative;flex:1;min-height:48px;padding:8px 12px;border-radius:14px;font-size:14px;font-weight:600;line-height:1.2;white-space:nowrap;cursor:pointer;overflow:hidden;outline:none;-webkit-tap-highlight-color:transparent}' +
    '.vc-ln-acts button:focus{outline:none !important;box-shadow:none !important}' +
    '.vc-ln-acts button:focus-visible{outline:2px solid #f1c46a !important;outline-offset:2px}' +
    '.vc-ln-no{flex:.8 !important;background:transparent;border:1px solid rgba(255,255,255,.16);color:#ece9e2}' +
    '.vc-ln-ok{border:0;background:rgba(241,196,106,.16);color:rgba(28,20,8,.85);transition:transform .15s}' +
    '.vc-ln-ok span{position:relative;z-index:1;color:#fbefd2;text-shadow:0 1px 2px rgba(0,0,0,.45);transition:color .2s,text-shadow .2s}' +
    '.vc-ln-ok:not(:disabled) span,.vc-ln-ok.is-ready span{text-shadow:none}' +
    '.vc-ln-fill{position:absolute;inset:0;width:0;background:linear-gradient(180deg,#f1c46a,#d6a447)}' +
    '.vc-lnote.is-in .vc-ln-fill{animation:vcLnFill 3s linear forwards}' +
    '@keyframes vcLnFill{to{width:100%}}' +
    '.vc-ln-ok:not(:disabled) span,.vc-ln-ok.is-ready span{color:#1c1408}' +
    '.vc-ln-ok.is-ready{box-shadow:0 8px 20px -10px rgba(241,196,106,.8) !important}' +
    '.vc-ln-ok.is-ready:active{transform:scale(.97)}' +
    '.vc-ln-ok:disabled{cursor:wait}' +
    /* มือถือ: เลื่อนขึ้นจากด้านล่าง */
    '@media (max-width:600px){.vc-lnote{align-items:flex-end;padding:0}' +
      '.vc-ln-card{width:100%;border-radius:24px 24px 0 0;border-bottom:0;padding:10px 18px calc(18px + env(safe-area-inset-bottom));transform:translateY(100%);opacity:1;transition:transform .34s cubic-bezier(.2,.8,.2,1)}' +
      '.vc-lnote.is-in .vc-ln-card{transform:none}' +
      '.vc-ln-grab{display:block;width:40px;height:4px;margin:0 auto 12px;border-radius:99px;background:rgba(255,255,255,.18)}}' +
    '.vc-lnote.is-out .vc-ln-card{transform:translateY(24px);opacity:0}' +
    '@media (max-width:600px){.vc-lnote.is-out .vc-ln-card{transform:translateY(100%);opacity:1}}' +
    '.vc-why{display:block;margin:6px 0 3px;font:500 11px/1.4 Prompt,system-ui,sans-serif;letter-spacing:.02em;color:rgba(241,196,106,.75)}' +
    '.vc-why:not(.vc-why-d)::before{content:"❝ ";opacity:.8}' +
    '.vc-why-d{margin:0 0 10px;padding:7px 10px;border-radius:9px;background:rgba(241,196,106,.07);border:1px dashed rgba(241,196,106,.3)}' +
    '.vc-lang-legal{margin:10px 0 0;padding:9px 12px;border-radius:10px;border:1px dashed rgba(241,196,106,.35);background:rgba(241,196,106,.06);color:rgba(236,233,226,.78);font:400 12.5px/1.5 Prompt,system-ui,sans-serif;text-align:left}' +
    'html:not([data-lang=th]) body{transition:opacity .15s}' +
    '.vc-lang{gap:5px !important;padding:6px 10px !important;color:#ece9e2}.vc-lang svg{width:14px;height:14px;opacity:.8}.vc-lang b{font-weight:700;letter-spacing:.04em}.vc-lang i{font-style:normal;opacity:.6;font-size:9px}' +
    '.vc-lmenu{position:fixed;z-index:2147482000;min-width:168px;padding:6px;border-radius:14px;background:#1b1c21;border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 40px -14px rgba(0,0,0,.9);opacity:0;transform:translateY(-6px) scale(.98);transition:opacity .18s,transform .18s}' +
    '.vc-lmenu.is-in{opacity:1;transform:none}' +
    '.vc-lmenu button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 11px;border:0;border-radius:10px;background:none;color:#ece9e2;font:500 14px/1.2 Prompt,system-ui,sans-serif;cursor:pointer;text-align:left}' +
    '.vc-lmenu button:hover{background:rgba(255,255,255,.06)}' +
    '.vc-lmenu button b{min-width:30px;padding:3px 0;border-radius:6px;text-align:center;font-size:11px;letter-spacing:.04em;background:rgba(255,255,255,.08)}' +
    '.vc-lmenu button.is-on b{background:linear-gradient(180deg,#f1c46a,#d6a447);color:#1c1408}' +
    '.vc-lmenu button.is-on::after{content:"✓";margin-left:auto;color:#f1c46a}' +
    '#dispPanel .vds-seg3{grid-template-columns:repeat(3,1fr) !important}' +
    '@media (max-width:480px){.vc-lang{margin:0 2px 0 auto !important;font-size:10.5px;padding:5px 7px !important;gap:3px !important}.vc-lang i{display:none}.vc-lang svg{width:13px !important;height:13px !important}html[data-lang=th] .vc-lang b{display:none}html[data-lang=th] .vc-lang{padding:7px !important}html[data-lang=th] .vc-lang svg{width:16px !important;height:16px !important;opacity:.9}}' +
    /* หัวข้อใหญ่หน้าแรก: ภาษาอังกฤษยาวกว่า ย่อให้พอดีจอ */
    'html[data-lang=en] #heroTitle{font-size:clamp(34px,9.6vw,92px) !important;line-height:1.02 !important;letter-spacing:-.02em}' +
    '@media (min-width:768px){html[data-lang=en] #heroTitle{font-size:clamp(44px,4.6vw,68px) !important}}' +
    /* ข้อความที่มาจาก CSS (::before/::after) */
    "html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-menu::before{content:\"Settings\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-card-num small::after{content:\"Credits\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"Shows the credits left on your account\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"✓ Account details\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"Ready\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-rows dd::after{content:\"Checks available\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .wallet-total::after{content:\"Total of all credit types\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .cred-card .acct-info::after{content:\"✓ Logged in\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authCard:has(#authLoggedIn:not([hidden])) .sheet-head h2::after{content:\"My account\" !important}html[data-lang=en][data-view=\"desk\"][data-desk=\"acct\"] #authLoggedIn .acct-info::after{content:\"Logged in\" !important}html[data-lang=en] #authLoggedIn .cred-card .acct-info::after{content:\"✓ Logged in\" !important}html[data-lang=en] .vsl-item::after{content:\"View contract ›\" !important}html[data-lang=en].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard .credit-chip:not(.is-zero) b::after{content:\" credits\" !important}html[data-lang=en] body[data-sheet=\"acct\"] #authCard .sheet-head .acct-label::after{content:\"Logged in\" !important}html[data-lang=en].vc-art[data-view=\"desk\"][data-desk=\"check\"] #checkCard:has(.ta-wrap:not(.vc-has)) #checkBtn:disabled::after{content:\"Paste a contract above, then press Check\" !important}html[data-lang=en].vc-art article.rpt.vc-m3 .ix-row.vc-swiping::after,html[data-lang=en].vc-art article.rpt.vc-m3 .ix-row.vc-sw-back::after{content:\"✓ Read\" !important}html[data-lang=en].vc-art article.rpt.vc-m > .gloss .gl-title p::after{content:\" · tap for the full explanation\" !important}html[data-lang=en].vc-art .vc-sum .vc-sum-hd .vc-sum-meta .vc-type-chg::before{content:\"Detected type · \" !important}html[data-lang=en] .hxs::before{content:\"Signature\" !important}html[data-lang=en] .vsl.fix-on .vsl-doc::before{content:\"Green text = suggested wording to request before signing · not legal advice\" !important}html[data-lang=en].vc-gin::before{content:\"Log in\" !important}html[data-lang=en] #resultCard .empty::after{content:\"Paste a contract on the left and press Check; results appear here\" !important}html[data-lang=en] #authLoggedIn .acct-menu::before{content:\"Settings\" !important}html[data-lang=en] #authLoggedIn .wallet-card-num small::after{content:\"Credits\" !important}html[data-lang=en] #authLoggedIn .pane[data-pane=\"services\"]::after{content:\"Shows the credits left on your account\" !important}html[data-lang=en] #authLoggedIn .acct-info::after{content:\"✓ Account details\" !important}html[data-lang=en] #authLoggedIn .wallet-total.has-credit .wallet-total-label::after{content:\"Ready\" !important}html[data-lang=en] #authLoggedIn .wallet-rows dd::after{content:\"Checks available\" !important}html[data-lang=en] #authLoggedIn .wallet-total::after{content:\"Total of all credit types\" !important}";
  (document.head || root).appendChild(css);
  if (LANG !== 'th') { root.classList.add('i18n-wait'); setTimeout(function () { root.classList.remove('i18n-wait'); }, 1500); }
  window.VCLang = {
    get: function () { return LANG; },
    set: function (l) {
      l = OKL[l] ? l : 'th'; if (l === LANG) return;
      notice(l, function () {
        try { localStorage.setItem('vc_lang', l); } catch (e) {}
        /* เปิดหน้าใหม่ด้วย ?lang= (ไม่ใช้ reload: บาง iPhone ไม่ยอมโหลดซ้ำ) */
        var q = location.search.replace(/[?&](lang=(en|th|zh)|_l=\d+)/g, '').replace(/^&/, '?');
        location.href = location.pathname + (q ? q + '&' : '?') + 'lang=' + l + '&_l=' + Date.now() + location.hash;
      });
    }
  };

  /* ---------- แจ้งก่อนเปลี่ยนภาษา: เป็นแค่การแปลเพื่อความสะดวก ฉบับภาษาไทยมีผลเหนือกว่า ใช้กฎหมายไทย ไม่ใช่คำปรึกษากฎหมาย ---------- */
  var NOTE_TH = 'ภาษาต่างประเทศบนเว็บนี้เป็นคำแปลเพื่อความสะดวกเท่านั้น หากความหมายไม่ตรงกัน ให้ถือข้อความภาษาไทยเป็นหลัก บริการนี้อยู่ภายใต้กฎหมายไทย และผลตรวจไม่ใช่คำปรึกษาทางกฎหมาย';
  var NOTE = {
    en: 'English is a convenience translation only. If the Thai and English versions differ, the Thai version prevails. This service is governed by the laws of Thailand, and results are not legal advice.',
    zh: '中文仅为方便阅读的翻译。如中文与泰文版本不一致，以泰文版本为准。本服务受泰国法律管辖，检查结果并非法律意见。'
  };
  var NOTE_EN = NOTE.en;
  var LN = { th: ['TH', 'ไทย', 'Thai'], en: ['EN', 'English', 'English'], zh: ['中', '中文', 'Chinese'] };
  var NI = {
    en: ['English is a convenience translation only', 'If versions differ, Thai prevails. Governed by Thai law', 'Results are not legal advice', 'Switch to English', 'Switch to Thai', 'Cancel', 'Switch', 'Switching…'],
    zh: ['中文仅为方便阅读的翻译', '如版本不一致，以泰文为准，适用泰国法律', '检查结果并非法律意见', '切换为中文', '切换为泰文', '取消', '切换', '正在切换…']
  };
  function notice(to, go) {
    var old = document.querySelector('.vc-lnote'); if (old) old.remove();
    var S = function (d) { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var sec = to === 'th' ? (LANG === 'th' ? 'en' : LANG) : to, X = NI[sec];   /* ภาษาที่สองที่แสดงคู่กับภาษาไทย */
    var from = LN[LANG][0], dest = LN[to][0], fl = { en: 'ภาษาอังกฤษ', zh: 'ภาษาจีน' }[sec];
    var items = [
      [S('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5z"/>'), fl + 'เป็นคำแปลเพื่อความสะดวกเท่านั้น', X[0]],
      [S('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>'), 'ถ้าความหมายไม่ตรงกัน ถือภาษาไทยเป็นหลัก และใช้กฎหมายไทย', X[1]],
      [S('<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 6a2.5 2.5 0 0 0 5 0z"/><path d="m19 7-2.5 6a2.5 2.5 0 0 0 5 0z"/>'), 'ผลตรวจไม่ใช่คำปรึกษาทางกฎหมาย', X[2]]
    ];
    var tTitle = to === 'th' ? 'เปลี่ยนเป็นภาษาไทย' : 'เปลี่ยนเป็น' + fl, tSub = to === 'th' ? X[4] : X[3];
    var w = document.createElement('div');
    w.className = 'vc-lnote'; w.setAttribute('data-i18n-skip', ''); w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'vcLnT');
    w.innerHTML = '<div class="vc-ln-card">' +
      '<i class="vc-ln-grab" aria-hidden="true"></i>' +
      '<div class="vc-ln-top"><span class="vc-ln-badge">' + S('<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 6a2.5 2.5 0 0 0 5 0z"/><path d="m19 7-2.5 6a2.5 2.5 0 0 0 5 0z"/>') + '</span>' +
        '<div class="vc-ln-sw" aria-hidden="true"><b class="is-from">' + from + '</b><i>' + S('<path d="M5 12h13M13 6l6 6-6 6"/>') + '</i><b class="is-to">' + dest + '</b></div></div>' +
      '<div class="vc-ln-title" id="vcLnT">' + tTitle + '<small>' + tSub + '</small></div>' +
      '<ul class="vc-ln-list">' + items.map(function (x) { return '<li><span class="vc-ln-ic">' + x[0] + '</span><span><b>' + x[1] + '</b><small>' + x[2] + '</small></span></li>'; }).join('') + '</ul>' +
      '<div class="vc-ln-acts"><button type="button" class="vc-ln-no">ยกเลิก · ' + X[5] + '</button>' +
      '<button type="button" class="vc-ln-ok" disabled><i class="vc-ln-fill" aria-hidden="true"></i><span>เปลี่ยนภาษา · ' + X[6] + '</span></button></div></div>';
    document.body.appendChild(w);
    requestAnimationFrame(function () { w.classList.add('is-in'); });
    var ok = w.querySelector('.vc-ln-ok'), gone = false;
    var close = function (then) {
      if (gone) return; gone = true; document.removeEventListener('keydown', esc);
      w.classList.remove('is-in'); w.classList.add('is-out');
      setTimeout(function () { w.remove(); if (then) then(); }, 260);
    };
    var esc = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    w.addEventListener('click', function (e) {
      if (e.target === w || e.target.closest('.vc-ln-no')) close();
      else if (e.target.closest('.vc-ln-ok') && !ok.disabled) { ok.querySelector('span').textContent = 'กำลังเปลี่ยน… · ' + X[7]; ok.disabled = true; go(); }
    });
    /* ให้อ่านก่อน 3 วินาที: แถบทองวิ่งเต็มปุ่ม แล้วปุ่มถึงกดได้ */
    setTimeout(function () { if (!gone) { ok.disabled = false; ok.classList.add('is-ready'); } }, 3000);
  }

  /* ---------- ปุ่มสลับภาษา (แสดงทั้งสองภาษา) ---------- */
  function addSwitch() {
    var tb = document.querySelector('.site-header .topbar');
    if (tb && !tb.querySelector('.vc-lang')) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'vc-lang';
      b.setAttribute('aria-label', 'ภาษา · Language · 语言'); b.setAttribute('aria-haspopup', 'menu');
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5z"/></svg><b>' + LN[LANG][0] + '</b><i aria-hidden="true">▾</i>';
      b.setAttribute('data-i18n-skip', '');
      b.addEventListener('click', function (e) { e.stopPropagation(); menu(b); });
      var at = document.getElementById('authToggle');
      if (at && at.parentNode === tb) tb.insertBefore(b, at); else tb.appendChild(b);
    }
    var dp = document.getElementById('dispPanel');
    if (dp && !dp.querySelector('.vds-lang')) {
      var row = document.createElement('div');
      row.className = 'vds-blk vds-lang'; row.setAttribute('data-i18n-skip', '');
      row.innerHTML = '<p class="vds-h">ภาษา · Language · 语言</p><div class="seg vds-seg vds-seg3" role="group" aria-label="Language">' +
        ['th', 'en', 'zh'].map(function (k) { return '<button type="button" data-lang="' + k + '" class="' + (LANG === k ? 'is-on' : '') + '"><b>' + LN[k][1] + '</b><span>' + LN[k][2] + '</span></button>'; }).join('') + '</div>';
      row.addEventListener('click', function (e) { var x = e.target.closest('[data-lang]'); if (x && x.getAttribute('data-lang') !== LANG) VCLang.set(x.getAttribute('data-lang')); });
      dp.insertBefore(row, dp.firstChild);
    }
  }
  /* เมนูเลือกภาษาจากปุ่มบนแถบด้านบน */
  function menu(btn) {
    var old = document.querySelector('.vc-lmenu'); if (old) { old.remove(); return; }
    var mnu = document.createElement('div'); mnu.className = 'vc-lmenu'; mnu.setAttribute('role', 'menu'); mnu.setAttribute('data-i18n-skip', '');
    mnu.innerHTML = ['th', 'en', 'zh'].map(function (k) { return '<button type="button" role="menuitem" data-lang="' + k + '" class="' + (LANG === k ? 'is-on' : '') + '"><b>' + LN[k][0] + '</b>' + LN[k][1] + '</button>'; }).join('');
    document.body.appendChild(mnu);
    var r = btn.getBoundingClientRect();
    mnu.style.top = Math.round(r.bottom + 8) + 'px';
    mnu.style.left = Math.round(Math.max(8, Math.min(innerWidth - mnu.offsetWidth - 8, r.right - mnu.offsetWidth))) + 'px';
    requestAnimationFrame(function () { mnu.classList.add('is-in'); });
    var off = function (e) { if (e && mnu.contains(e.target)) return; mnu.remove(); document.removeEventListener('click', off, true); removeEventListener('scroll', off, true); };
    setTimeout(function () { document.addEventListener('click', off, true); addEventListener('scroll', off, true); }, 0);
    mnu.addEventListener('click', function (e) { var x = e.target.closest('[data-lang]'); if (!x) return; off(); VCLang.set(x.getAttribute('data-lang')); });
  }
  function boot(f) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f); else f(); }
  boot(function () {
    addSwitch();
    if ('MutationObserver' in window) {
      var t = 0;
      new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; addSwitch(); }, 300); }).observe(document.body, { childList: true, subtree: true });
    }
  });
  if (LANG === 'th') return;

  /* ---------- ส่งภาษาไปกับคำขอ API ---------- */
  var of = window.fetch;
  if (of) window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (/^\/api\/|^https?:\/\/[^/]*vellumcheck\.com\/api\/|^\/\/?api\//.test(url) || (url.indexOf(location.origin + '/api/') === 0)) {
        init = init || {};
        var h = new Headers(init.headers || (typeof input !== 'string' && input.headers) || {});
        h.set('x-vc-lang', LANG); init.headers = h;
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
    "อีก {0} วัน": "In {0} days", "เลยมา {0} วัน": "{0} days ago", "ทุกเดือน": "Monthly", "คำนวณ": "Calculated", "ดูสัญญา ›": "View contract ›",
    "ข้อความในสัญญา": "Text in the contract",
    "คัดลอกข้อความเดิม": "Copy original text",
    "สมัครสมาชิก / อื่น ๆ": "Membership / other",
    "เครดิตคงเหลือทั้งหมด": "Total credits left",
    "นางสาวตัวอย่าง มีสุข": "Jane Doe",
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
  /* อังกฤษ → จีนตัวย่อ (ใช้ตอน LANG = zh) */
  var ZH = {"Contract Check | Vellum Check": "合同检查 | Vellum Check", "Check contract": "检查合同", "Log in": "登录", "My account": "我的账户", "How to read": "阅读指南", "Intro video": "介绍视频", "Account": "账户", "History": "历史", "Main menu": "主菜单", "Need help?": "需要帮助？", "Need help? Tap for fixes": "需要帮助？点此查看解决方法", "Vellum, the Vellum Check mascot": "Vellum Check 吉祥物 Vellum", "Read it all": "完整阅读", "Read": "阅读", "it": "完", "all": "整", "before you sign": "再签字", "Live sample": "实时示例", "Room rental": "租房", "Loan": "借款", "Employment": "雇佣", "Sample": "示例", "Room rental agreement": "房屋租赁合同", "Tenant": "承租人", "Landlord": "出租人", "Read before signing!": "签字前先读！", "Check closely": "需细查", "Caution": "注意", "Note": "备注", "Tap a highlight to see why": "点击高亮查看原因", "Found": "发现", "points to review": "处需关注", "See full result · free": "查看完整结果 · 免费", "Check contracts with confidence · paste the text and we highlight what to watch": "放心检查合同 · 粘贴合同文本，我们会标出需要注意的地方", "Start checking": "开始检查", "Watch intro": "观看介绍", "Sign up free · {0} free checks": "免费注册 · 送 {0} 次检查", "then {0} checks for {1} THB ·": "之后 {0} 次 {1} 泰铢 ·", "Pricing & FAQ": "价格与常见问题", "Press and drag the lens to spot risks": "按住并拖动放大镜查找风险", "Not sure how this helps?": "不确定能帮你什么？", "See example problems ›": "查看问题示例 ›", "Initial screening": "初步筛查", "A screening tool, not legal advice": "初步筛查工具，并非法律意见", "Redact before sending": "发送前隐藏信息", "Personal data is masked in your browser before analysis": "个人信息会在浏览器中先隐藏再分析", "Failed check = refund": "检查失败 = 退还", "Credits are refunded automatically if a check fails": "检查失败时自动退还点数", "Check my contract": "检查我的合同", "Sample contract result": "合同检查结果示例", "Open this sample result, free": "免费打开这份示例结果", "or paste your contract here…": "或在此粘贴你的合同…", "Paste your contract text": "粘贴合同文本", "Check closely before signing": "签字前需细查", "See why: {0}": "查看原因：{0}", "Penalty": "罚金", "Rent": "租金", "Deposit": "押金", "Termination": "解约", "Repairs": "维修费", "See why: Penalty": "查看原因：罚金", "See why: Rent": "查看原因：租金", "See why: Deposit": "查看原因：押金", "See why: Termination": "查看原因：解约", "See why: Repairs": "查看原因：维修费", "Found {0} · keep looking": "已发现 {0} 处 · 继续找", "Prepared sample contracts · no credits · no sign-up": "预备的示例合同 · 不用点数 · 无需注册", "Scroll for more": "向下查看更多", "Clause {0}.": "第 {0} 条", "Clause {0}": "第 {0} 条", "Both parties have read and understood this agreement in full and sign it before witnesses.": "双方已完整阅读并理解本合同，并在证人面前签字。", "If payment is late by even one day, the tenant agrees to pay": "若逾期付款哪怕一天，承租人同意支付", "a penalty of {0}% per year": "每年 {0}% 的罚金", "on the entire outstanding balance": "按全部欠款计算", "Subject to this agreement, the parties agree to follow the terms in the annex.": "在本合同条件约束下，双方同意遵守附件中的条款。", "This agreement": "本合同", "renews automatically every {0} months": "每 {0} 个月自动续约", "unless cancelled in writing at least {0} days in advance": "除非至少提前 {0} 天书面通知解约", "The annex forms part of this agreement and is equally binding.": "附件为本合同的一部分，具有同等效力。", "The tenant has paid a deposit, which": "承租人已支付押金，该押金", "is non-refundable under any circumstances": "在任何情况下均不予退还", "All notices must be in writing and sent to the addresses stated above.": "所有通知须以书面形式寄至上述地址。", "The provider": "服务提供方", "may change the terms unilaterally": "可单方面修改条款", "without notifying users in advance": "无需事先通知用户", "The borrower allows": "借款人同意", "immediate deductions from their salary account": "可直接从其工资账户扣款", "without asking for further consent": "无需再次征得同意", "If cancelled early,": "若提前解约，", "the fee equals all remaining service charges": "费用等于剩余全部服务费", "at rates set by the company": "按公司规定的费率", "Your personal data": "您的个人信息", "may be disclosed to affiliates and partners": "可能被披露给关联公司和合作伙伴", "for marketing purposes": "用于营销目的", "The guarantor": "担保人", "is jointly liable with the debtor": "与债务人承担连带责任", "and waives all rights": "并放弃一切权利", "Any dispute goes to": "如有争议，交由", "an arbitrator chosen by the company": "公司指定的仲裁员处理", "and the award is final": "且裁决为终局", "The contractor": "承包方", "may not work for competitors for {0} years": "{0} 年内不得为竞争对手工作", "after the contract ends": "自合同结束之日起", "Unpaid fees": "未付费用", "accrue daily compound interest": "按日计收复利", "until paid in full": "直至全额付清", "The tenant must": "承租人须", "pay for all structural repairs": "承担全部建筑结构维修费", "even for normal wear and tear": "即使是正常使用造成的损耗", "The company": "公司", "accepts no liability for any damage": "对任何损害概不负责", "direct or indirect": "无论直接或间接", "The company not exercising a right": "公司未行使权利", "is not a waiver": "不视为放弃权利", "and it may claim retroactively at any time": "且公司可随时追溯主张", "⚠ May be disclosed to affiliates and partners": "⚠ 可能被披露给关联公司和合作伙伴", "Your data could be shared widely": "你的信息可能被广泛转给他人", "⚠ Renews automatically every {0} months": "⚠ 每 {0} 个月自动续约", "Forget to cancel and you may be locked in another year": "忘记解约可能再被绑定一年", "⚠ Daily compound interest": "⚠ 按日计收复利", "The debt can grow faster than you expect": "债务可能比你想的增长更快", "⚠ No working for competitors for {0} years": "⚠ {0} 年内不得为竞争对手工作", "A longer restriction than usual": "限制时间比一般更长", "Form · Sign in": "表单 · 登录", "Enter your email and password, or continue with Google": "输入邮箱和密码，或使用 Google 登录", "Email": "邮箱", "Password": "密码", "I have read and accept the": "我已阅读并接受", "Terms of Service": "服务条款", "and": "和", "Privacy Policy": "隐私政策", "Sign up": "注册", "{0} free checks": "免费 {0} 次", "or": "或", "Continue with Google": "使用 Google 登录", "Signature": "签名", "Screening tool · not legal advice": "筛查工具 · 并非法律意见", "Close": "关闭", "Lamp on/off": "开/关台灯", "you@email.com": "you@email.com", "At least {0} characters": "至少 {0} 个字符", "Sign up · {0} free checks": "注册 · 免费 {0} 次检查", "Skip ›": "跳过 ›", "Sound: on": "声音：开", "Sound: off": "声音：关", "Hello, {0}": "你好，{0}", "Welcome": "欢迎", "One step left to check": "只差一步就能检查", "Sign up free · get": "免费注册 · 获得", "{0} checks": "{0} 次", "Your pasted text is kept, no need to paste again": "已粘贴的文本会保留，无需重新粘贴", "After logging in, the check continues right away": "登录后会立即继续检查", "Names, ID and phone numbers are masked before checking": "检查前会隐藏姓名、证件号和电话", "Sign up free / Log in": "免费注册 / 登录", "Later": "稍后", "Add more checks whenever you need": "需要时随时增加检查次数", "Your past results are safe, no rush": "过去的结果都还在，不用着急", "Usage status": "使用状态", "All checks used": "检查次数已用完", "Past results are still available": "过去的结果仍可查看", "Opening history costs no credits": "查看历史不消耗点数", "Check a new contract when ready": "准备好后再检查新合同", "Price and number of checks are shown before you confirm": "确认前会显示价格和次数", "See credit packs": "查看点数套餐", "View check history": "查看检查历史", "You are never charged without your consent": "未经你同意绝不扣费", "Clear · no forced purchase · history kept": "清楚 · 不强制购买 · 保留历史", "Credits used up": "点数已用完", "{0} credits left": "剩余 {0} 点", "Credits left · view or top up": "剩余点数 · 查看或充值", "Type & contract": "类型与合同", "Contract type": "合同类型", "Not sure": "不确定", "We read the text and pick the type for you": "我们读取文本并自动判断类型", "Change": "更改", "Paste contract text here": "在此粘贴合同文本", "Paste contract text here...": "在此粘贴合同文本...", "Paste from clipboard": "从剪贴板粘贴", "Upload PDF · Word · photo": "上传 PDF · Word · 照片", "Upload file": "上传文件", "No contract yet? Try a free sample": "还没有合同？试试免费示例", "{0} samples · no credits · results in {1} seconds": "{0} 份示例 · 不用点数 · {1} 秒出结果", "Free": "免费", "Free!": "免费！", "One tap, instant result": "一点即看结果", "Predatory loan": "高利贷", "Full-time job": "正式工作", "All ›": "全部 ›", "Choose options and protect your data": "选择选项并保护信息", "Audio summary": "语音摘要", "(uses {0} voice credit)": "（使用 {0} 次语音点数）", "Protect personal data": "保护个人信息", "Masked before sending": "发送前隐藏", "On": "已开启", "Paste and tap Check; you sign up free when you check": "粘贴后点检查即可，检查时免费注册", "Check contract ({0} free)": "检查合同（免费 {0} 次）", "Check contract (uses {0} credit)": "检查合同（使用 {0} 点）", "This check uses {0} credit, refunded if it fails": "本次检查使用 {0} 点，失败会退还", "Data masking": "信息隐藏", "before checking": "检查前", "Check failed": "检查失败", "automatic refund": "自动退还", "Questions?": "有疑问？", "Contact us": "联系我们", "Original contract text is never stored · only your latest {0} results are kept, delete anytime ·": "不保存合同原文 · 只保留最近 {0} 条结果，可随时删除 ·", "Read policy": "阅读政策", "Manage history": "管理历史", "* This tool is for initial screening only and is not legal advice. Have a lawyer review important contracts before signing.": "* 本工具仅用于初步筛查，并非法律意见。重要合同签字前请让律师审阅。", "Open {0} sample contracts, free, no credits": "免费打开 {0} 份示例合同，不用点数", "Safety and refunds": "安全与退还", "Paste": "粘贴", "Options": "选项", "Check": "检查", "Read result": "查看结果", "Paste your contract": "粘贴你的合同", "· sign up free when you check, {0} free checks": "· 检查时免费注册，送 {0} 次检查", "Log in / Sign up →": "登录 / 注册 →", "Click the box and press": "点击框内后按", "to paste": "粘贴", "{0} / {1} characters": "{0} / {1} 字", "Paste your contract and personal data is masked before analysis": "粘贴合同后，个人信息会在分析前被隐藏", "Settings": "设置", "Detection may miss some cases, especially names and scanned or photographed documents. Preview before checking. Rent, dates, durations and amounts are not masked.": "可能无法识别所有情况，尤其是姓名以及扫描件或照片。检查前请先预览。租金、日期、期限和金额不会被隐藏。", "Clear text": "清除文本", "Private": "私密", "Results": "结果", "What a result looks like": "结果示例", "From a sample room rental": "来自示例房屋租赁", "Clause {0} · Important": "第 {0} 条 · 重要", "Rent can rise anytime?": "租金随时可涨？", "Ask: keep rent fixed for the {0}-year term; any increase on renewal needs {1} days written notice": "建议：{0} 年合同期内租金固定；续约时涨租须提前 {1} 天书面通知", "How much of the deposit can be kept?": "押金会被扣多少？", "Ask: deduct only for proven tenant damage, itemised in writing, and return the rest within {0}–{1} days": "建议：只扣有证据的承租人损坏，书面列明扣款，并在 {0}–{1} 天内退还余额", "Move out early, lose the whole deposit?": "提前搬走，押金全没？", "Ask: allow cancelling with {0} days notice and return the deposit minus actual damage, or cap the penalty at {1} month of rent": "建议：允许提前 {0} 天通知解约，按实际损失扣除后退还押金，或将罚金限制在 {1} 个月租金以内", "+ {0} more issues · advice · message drafts": "+ 另外 {0} 项 · 建议 · 沟通草稿", "Open full sample · free": "打开完整示例 · 免费", "Before you paste": "粘贴之前", "Include every page": "请包含所有页面", "Include annexes so all terms are seen": "包含附件，才能看到全部条款", "Personal data masked before sending": "发送前隐藏个人信息", "Done in your browser before analysis": "在你的浏览器中完成，然后再分析", "Failed checks are refunded automatically": "检查失败自动退还", "No need to report it": "无需自己申请", "An initial screening tool": "初步筛查工具", "For high-stakes matters, consult a professional": "重大事项请咨询专业人士", "Contract check steps": "合同检查步骤", "Check in today +{0} pts": "今天签到 +{0} 分", "Day {0}/{1} · {2} pts saved": "第 {0}/{1} 天 · 已攒 {2} 分", "Check in": "签到", "Hide today": "今天隐藏", "For: contracts of unknown or mixed type": "适用：类型不明或混合类型的合同", "Focus: we read the text and pick the type": "重点：我们读取文本并判断类型", "Drag to rotate": "拖动旋转", "Choose contract type": "选择合同类型", "The right type tells us what to focus on. Not sure? Let us detect it.": "选对类型，我们就知道重点查什么。不确定？让我们来判断。", "We detect it from the text": "根据文本自动判断", "Rental agreement": "租赁合同", "Rent, deposit, lease term": "租金、押金、租期", "Sale agreement": "买卖合同", "Price, delivery, payment": "价格、交付、付款", "Employment contract": "劳动合同", "Salary, hours, termination": "工资、工时、解雇", "Service agreement": "服务合同", "Scope, deadlines, milestone pay": "工作范围、交付期限、分期付款", "Loan agreement": "借款合同", "Interest, due dates": "利息、还款日期", "Partnership agreement": "合伙协议", "Profit split, duties": "利润分配、各方职责", "Non-disclosure agreement": "保密协议", "Confidentiality, protection period": "保密范围、保护期限", "Other contract": "其他合同", "None of the above": "以上都不符合", "Use “": "使用“", "Use “Not sure”": "使用“不确定”", "General contract": "一般合同", "Copy result": "复制结果", "Share report": "分享报告", "Save PDF": "保存 PDF", "Issues": "问题", "Risks found": "发现风险", "Contract overview": "合同概览", "High caution": "高度注意", "{0} important issue(s) to discuss before signing": "有 {0} 个重要问题，签字前应与对方沟通", "Important": "重要", "Low risk": "低风险", "Read {0} key issue(s)": "阅读 {0} 个重点问题", "Use this result": "使用此结果", "Draft message": "起草消息", "to the other party": "给对方", "Checklist": "清单", "Summary image": "摘要图片", "to share": "用于分享", "Ask more": "继续提问", "Starred": "已加星", "Contract details": "合同信息", "Scope": "工作", "Money": "金额", "Duration": "期限", "Not stated in this contract": "本合同未写明的事项", "The text may be incomplete; check against the original": "文本可能不完整，请与原件核对", "Ask the other party about unticked items ({0})": "就未勾选事项询问对方（{0}）", "Key dates in this contract": "本合同的重要日期", "No dates found; add your own reminders": "未找到日期，可自行添加提醒", "+ Add a date": "+ 添加日期", "Add to calendar": "添加到日历", "Log in to save": "登录以保存", "Your phone calendar reminds you {0} days and {1} day before at {2}:{3} · dates are read automatically and may be incomplete": "手机日历会在 {0} 天和 {1} 天前的 {2}:{3} 提醒 · 日期为自动识别，可能不完整", "About this result": "关于此结果", "What the result is based on and how to read it": "结果依据什么、如何阅读", "Text matches contract": "引文与合同一致", "{0}/{1} issues": "{0}/{1} 个问题", "Legal references": "法律条文引用", "Information not stated": "合同未写明的信息", "{0} topic(s)": "{0} 个主题", "Where the result comes from": "结果的来源", "Contract text · references · verification status": "合同文本 · 参考依据 · 核验状态", "Contract text": "合同文本", "Quotes for all {0} issues match the pasted contract (server-verified)": "全部 {0} 个问题的引文均与粘贴的合同一致（服务器核验）", "References": "参考依据", "AI cited legal sections for {0} issues; not yet verified against the statutes": "AI 为 {0} 个问题引用了法律条文，尚未与法条原文核对", "Verification status": "核验状态", "{0} issues with incomplete data or no matching quote · {1} topic(s) not found in the checked text (does not mean the contract lacks it)": "{0} 个问题信息不全或未找到引文 · {1} 个主题未在检查文本中找到（不代表合同没有）", "Colour guide and notes": "颜色说明与注意事项", "Gold: numbers, durations and amounts in the contract": "金色：合同中的数字、期限和金额", "Red: “Check closely” issues": "红色：“需细查”级别的问题", "Green: suggestions and next steps": "绿色：建议和下一步", "Blue: references": "蓝色：参考依据", "Risk levels are AI assessments of the readable text, not legal standards, sorted high to low rather than by clause number.": "风险等级是 AI 根据可读文本做出的评估，并非法律标准，按从高到低排列，而非按条款编号。", "These notes are not legal rulings; consider the other clauses and the facts too.": "这些提示不是法律裁定，请结合其他条款和实际情况考虑。", "Next steps": "下一步", "{0} of {1} issues read": "已阅读 {0}/{1} 个问题", "Send all change requests": "发送全部修改请求", "Pre-signing checklist": "签字前清单", "Check a new contract": "检查新合同", "Risk levels are AI screening estimates; review status is your own. Not a legal ruling.": "风险等级是 AI 的初步评估；审阅状态由你自己标记。并非法律裁定。", "This is an initial screening only, not legal advice. Have a lawyer review before signing.": "本结果仅为初步筛查，并非法律意见。签字前请让律师审阅。", "{0} issues · read {1}/{2}": "{0} 个问题 · 已读 {1}/{2}", "All read · draft a message to the other party": "已全部阅读 · 起草给对方的消息", "Risk summary": "风险摘要", "Review progress": "审阅进度", "Result sections": "结果分区", "Issues to review": "需审阅的问题", "Back to summary": "返回摘要", "Issue {0}": "问题 {0}", "Go to issue": "前往问题", "Back to top": "回到顶部", "Skip": "跳过", "Next": "下一个", "Swipe cards": "滑动卡片", "Swipe right = mark as read · swipe left = star to negotiate": "右滑 = 标为已读 · 左滑 = 加星待协商", "Checked contract": "已检查的合同", "Contract · {0} characters": "合同 · {0} 字", "Edit / check new": "编辑 / 检查新合同", "Result": "结果", "Contract": "合同", "Incomplete information": "信息不完整", "Copy": "复制", "Share": "分享", "Contract check result": "合同检查结果", "Important {0} · Caution {1}": "重要 {0} · 注意 {1}", "Key points from this contract": "本合同要点", "Information": "信息", "incomplete": "不完整", "Handle first": "优先处理", "In order": "按顺序", "{0} / Important · handle before signing": "{0} / 重要 · 签字前处理", "{0} / Caution · handle before paying/delivery": "{0} / 注意 · 付款/交付前处理", "Check the original text": "核对原文", "Review status": "审阅状态", "Open the first unreviewed issue": "打开第一个未审阅的问题", "Points to review": "需审阅的要点", "{0} issues found": "发现 {0} 个问题", "Sorted by risk · tap for details": "按风险排序 · 点击查看详情", "All {0}": "全部 {0}", "Check closely {0}": "需细查 {0}", "Caution {0}": "注意 {0}", "Low risk {0}": "低风险 {0}", "Issue {0} · Check closely": "问题 {0} · 需细查", "Issue {0} · Caution": "问题 {0} · 注意", "Issue {0} · Low risk": "问题 {0} · 低风险", "Scope:": "工作：", "Money:": "金额：", "Time:": "时间：", "What to know": "需要知道的", "Handle before signing": "签字前处理", "What to ask to change": "应要求修改的内容", "Details, law and original text": "详情、法律依据与原文", "References and text comparison": "参考依据与文本对比", "Risk dimensions": "风险维度", "Impact": "影响", "Urgency": "紧急程度", "Evidence": "证据", "Uncertainty": "不确定性", "Next step": "下一步", "Sections cited": "引用的条文", "Not yet verified against the actual law; please double-check": "尚未与实际法律核对，请再次确认", "Original text": "原文", "Suggested text": "建议文本", "Compare": "对比", "{0} · Original text": "{0} · 原文", "Clearer wording": "表述更清楚", "{0} · Suggested text": "{0} · 建议文本", "Copy suggested text": "复制建议文本", "Sample wording for consideration; check it against the facts and applicable law before use.": "示例措辞仅供参考，使用前请结合事实和适用法律核对。", "Mark as reviewed": "标为已审阅", "Handle before paying/delivery": "付款/交付前处理", "Monitor": "持续关注", "Has a deadline to watch": "有需留意的期限", "Not found in the checked text": "检查文本中未找到", "This does not mean the contract lacks it; the text may be incomplete, so check the original.": "不代表合同没有此内容；文本可能不完整，请核对原件。", "Ask about this result": "就此结果提问", "Ask anything · free, {0} questions per hour": "有疑问随时问 · 免费，每小时 {0} 个问题", "Hi! I have read this result. What would you like me to explain?": "你好！我已读完这份结果，想让我解释哪里？", "Explain the riskiest point simply": "用简单的话解释风险最高的一点", "Are there hidden costs?": "有哪些隐藏费用？", "What are the cancellation terms?": "解约条件是什么？", "What should I ask before signing?": "签字前应该问对方什么？", "The needle reflects the number and level of issues (not an AI score)": "指针根据问题的数量和级别计算（不是 AI 评分）", "Contract summary": "合同摘要", "Report no. {0}": "报告编号 {0}", "Search issues, e.g. penalty, deposit, termination": "搜索问题，例如 罚金、押金、解约", "Search issues": "搜索问题", "Filter by level": "按级别筛选", "Ask about the result": "就结果提问", "Type a question, e.g. what does clause {0} mean?": "输入问题，例如 第 {0} 条是什么意思？", "Type a question": "输入问题", "Send question": "发送问题", "Save reminder": "保存提醒", "Signed-in account": "已登录账户", "Logged in": "已登录", "Admin": "管理员", "Contract checks": "合同检查次数", "Voice": "语音", "checks": "次", "Can check": "还可检查", "more · refunded if a check fails": "份 · 检查失败会退还", "{0} more checks · refunded if a check fails": "还可检查 {0} 份 · 检查失败会退还", "Top up": "充值", "{0} contracts checked": "已检查 {0} 份合同", "Last {0} h ago · view all history": "最近 {0} 小时前 · 查看全部历史", "Last {0} days ago · view all history": "最近 {0} 天前 · 查看全部历史", "Last {0} min ago · view all history": "最近 {0} 分钟前 · 查看全部历史", "Daily check-in": "每日签到", "{0}-day streak": "连续 {0} 天", "· {0} pts": "· {0} 分", "Claim +{0}": "领取 +{0}", "Date reminders": "重要日期提醒", "None yet · save from the end of a result": "暂无 · 可在结果末尾保存", "Admin panel": "管理面板", "Add or remove credits for any account": "为任意账户增加或减少点数", "Account & display": "账户与显示", "Info & policies": "信息与政策", "Account details": "账户信息", "Email, credits and history storage": "邮箱、点数与历史保存", "Data privacy": "数据隐私", "Where data goes, how long it is kept, how to delete": "数据去向、保存多久、如何删除", "Display": "显示", "Compact, text size, reduce motion": "紧凑、字号、减少动画", "How we look after your data": "我们如何保护你的数据", "Agreement and scope of service": "服务协议与范围", "Contact admin": "联系管理员", "Report payment or usage issues": "反馈付款或使用问题", "Log out": "退出登录", "· version {0}": "· 版本 {0}", "Change profile photo": "更换头像", "Credit card, tap to flip for details": "点数卡，点击翻转查看详情", "Daily check-in · {0} pts today · {1} pts saved": "每日签到 · 今天可得 {0} 分 · 已攒 {1} 分", "Your credit wallet": "你的点数钱包", "Info and help": "信息与帮助", "A screening tool, not legal advice.": "初步筛查工具，并非法律意见。", "Signed-in email": "登录邮箱", "Check credits": "检查点数", "Ready": "可用", "Running low": "快用完了", "Used up": "已用完", "+ Top up": "+ 充值", "Voice credits": "语音点数", "Check history": "检查历史", "/ {0} saved": "/ {0} 已保存", "Full · new checks replace the oldest": "已满 · 新检查会替换最早的记录", "Almost full · {0} slots left": "快满了 · 还剩 {0} 个位置", "{0} slots left": "还剩 {0} 个位置", "Loading…": "加载中…", "Top up check credits": "充值检查点数", "Top up voice credits": "充值语音点数", "{0} of {1} saved": "已保存 {0}/{1}", "Text size": "字号", "A": "字", "Small": "小", "Normal": "标准", "Large": "大", "A lease should clearly state when the deposit is returned": "租赁合同应写明押金的退还日期", "Compact mode": "紧凑模式", "Less spacing, shorter cards": "减少间距，卡片更矮", "Reduce motion": "减少动画", "Good for slower devices": "适合较慢的设备", "Sound effects": "音效", "Soft paper and stamp sounds": "轻柔的纸张与盖章声", "Reset to default": "恢复默认", "Saved ✓": "已保存 ✓", "Sound on ✓": "已开启声音 ✓", "Sound off ✓": "已关闭声音 ✓", "Reset ✓": "已恢复默认 ✓", "Where is it processed?": "在哪里处理？", "Contract text you check is sent to our AI provider for analysis. PDF/Word/image files are converted to text on our server.": "你检查的合同文本会发送给我们的 AI 服务商进行分析。PDF/Word/图片文件会在我们的服务器上转成文本。", "What we keep": "我们保存什么", "Only your latest {0} \"results\" per account. Original contract text is never stored.": "每个账户只保存最近 {0} 条“结果”，从不保存合同原文。", "Logs": "日志", "Contract content is never logged, only character counts and file types on upload.": "合同内容从不写入日志，上传时只记录字数和文件类型。", "History page": "历史页面", "Shows only date and type; content appears only when you open it": "只显示日期和类型，打开后才显示内容", "Tip": "提示", "Avoid pasting ID numbers, bank accounts or unrelated data": "请勿粘贴身份证号、银行账号或无关信息", "Delete all my results": "删除我的全部结果", "Keeps your latest {0} results": "保留最近 {0} 条结果", "History storage": "历史保存", "{0} credits": "{0} 点", "Login": "登录", "daily": "每日", "A reward is waiting! Claim +{0} pts": "奖励在等你！领取 +{0} 分", "Day {0} · ready": "第 {0} 天 · 可领取", "{0} pts": "{0} 分", "day streak": "连续天数", "/ {0} pts": "/ {0} 分", "": "", "pts to a free check": "分可换一次免费检查", "Day {0}": "第 {0} 天", "Claimed": "已领取", "Today": "今天", "Day {0} · treasure box": "第 {0} 天 · 宝箱", "{0} days to the treasure box +{1} pts": "还有 {0} 天开宝箱 +{1} 分", "Rules": "规则", "Once a day; resets at midnight (Thai time)": "每天一次，泰国时间午夜重置", "Miss a day and you restart at day {0}, but you keep your points": "中断一天会从第 {0} 天重新开始，但已攒的分数不会消失", "{0} pts = {1} free check · up to {2} per month (used {3})": "{0} 分 = {1} 次免费检查 · 每月最多 {2} 次（已用 {3}）", "Claim +{0} pts": "领取 +{0} 分", "Points toward a free check": "累积分数换免费检查", "Day {0} +{1} pts claimed": "第 {0} 天 +{1} 分 已领取", "Claim day {0} reward +{1} pts": "领取第 {0} 天奖励 +{1} 分", "Day {0} +{1} pts, not yet": "第 {0} 天 +{1} 分 未到", "Checked in +{0} pts": "签到成功 +{0} 分", "Redeemed: +{0} check credit": "已兑换：+{0} 次检查", "View all history": "查看全部历史", "just now": "刚刚", "{0} min ago": "{0} 分钟前", "{0} h ago": "{0} 小时前", "{0} days ago": "{0} 天前", "{0} months ago": "{0} 个月前", "Cancel": "取消", "OK": "确定", "Confirm": "确认", "Delete": "删除", "Save": "保存", "Back": "返回", "Try again": "重试", "Please log in first": "请先登录", "Could not answer, please try again": "无法回答，请重试", "Could not load history, please try again": "无法加载历史，请重试", "Credit system error, please try again": "点数系统出错，请重试", "Google sign-in failed, please try again": "Google 登录失败，请重试", "Log out?": "退出登录？", "Do you want to log out?": "确定要退出登录吗？", "Move your mouse to spot risks in the contract": "移动鼠标查找合同中的风险", "Interest": "利息", "Payout": "放款", "Default": "违约", "Seizure": "扣押财产", "Holding documents": "扣留证件", "Borrower": "借款人", "Lender": "出借人", "Employee": "雇员", "Employer": "雇主", "Salary": "工资", "Dismissal": "解雇", "Working hours": "工作时间", "Made at ……………… on ………… ……": "签订地点 ……………… 日期 ………… ……", "House": "房屋", "Land": "土地", "Office": "办公室", "HR room": "人事部", "Office tower": "写字楼", "Construction site": "建筑工地", "Freelancer desk": "自由职业者工位", "Workshop": "工坊", "Collateral": "抵押物", "Living room": "客厅", "Bank": "银行", "Meeting room": "会议室", "Café": "咖啡馆", "Shop": "商店", "Server room": "服务器机房", "Secret recipe": "秘方", "Confidential archive": "机密档案室", "Agent warehouse": "代理商仓库", "Insurance policy": "保险单", "Consignment store": "寄售店", "Room": "房间", "Condo": "公寓", "Probation": "试用期", "Training fee": "培训费", "Pay deductions": "扣工资", "Leave": "休假", "Clause 1 The landlord agrees to rent room no. 305 to the tenant for…": "第 1 条 出租人同意将 305 号房间出租给承租人，期限为…", "Clause 2 Rent is 8,000 THB a month, due by the 5th of each…": "第 2 条 月租 8,000 泰铢，每月 5 日前支付…", "Clause 3 The landlord may raise the rent at any time without notice…": "第 3 条 出租人可随时涨租，无需事先通知…", "Clause 4 The tenant pays a 16,000 THB deposit, returned when the…": "第 4 条 承租人支付押金 16,000 泰铢，于合同…时退还", "Clause 5 If the tenant ends the lease early for any reason, the…": "第 5 条 若承租人因任何原因提前解约…", "Clause 6 The tenant pays for all repairs in every case, even…": "第 6 条 承租人在任何情况下都要承担全部维修费，即使…", "Clause 1 The borrower borrows 30,000 THB from the lender": "第 1 条 借款人向出借人借款 30,000 泰铢", "Clause 2 The borrower pays 10% interest per month on the 1st…": "第 2 条 借款人每月支付 10% 利息，每月 1 日…", "Clause 3 The lender deducts the first month's interest and a 5,000 THB fee…": "第 3 条 出借人预扣首月利息和 5,000 泰铢手续费…", "Clause 4 Any missed interest payment counts as breach of the whole…": "第 4 条 任何一次逾期付息即视为整份合同违约…", "Clause 5 The borrower lets the lender seize household property at once…": "第 5 条 借款人允许出借人立即扣押家中财产…", "Clause 6 The borrower hands their ATM card and bankbook to the lender": "第 6 条 借款人将 ATM 卡和存折交给出借人保管", "Clause 1 The employer hires the employee as an admin officer at…": "第 1 条 雇主聘用雇员担任行政职员，工资…", "Clause 2 Work hours are Monday to Saturday, 08:00–18:00 …": "第 2 条 工作时间为周一至周六 08:00–18:00…", "Clause 3 180-day probation, during which the employer may dismiss at once…": "第 3 条 试用期 180 天，期间雇主可随时解雇…", "Clause 4 If the employee resigns within 2 years, they repay 50,000 in training…": "第 4 条 雇员若在 2 年内离职，须赔偿培训费 50,000…", "Clause 5 The employer may deduct pay for damaged property, as…": "第 5 条 雇员损坏财物时，雇主可扣工资，按…", "Clause 6 Sick leave is limited to 5 days a year": "第 6 条 病假每年不超过 5 天", "Phone": "电话", "points": "处", "{0} ฿": "{0} ฿", "Hide": "隐藏", "Price": "价格", "Recommended": "推荐", "{0} days": "{0} 天", "Items": "项目", "Documents": "文件", "Awaiting payment": "待付款", "Report": "报告", "Credits": "点数", "Protect": "保护", "Clear ✕": "清除 ✕", "Success": "成功", "Overview": "概览", "{0} Read": "{0} 阅读", "{0} of {1}": "{0}/{1}", "Transactions": "交易", "All": "全部", "Night": "夜间", "Three steps": "三个步骤", "ID number": "证件号", "{0} Mask": "{0} 隐藏", "Pin": "置顶", "Important {0}": "重要 {0}", "Terms": "条款", "In {0} days": "{0} 天内", "Period": "期间", "See packs": "查看套餐", "One minute": "一分钟", "All types": "全部类型", "Quick amounts": "快捷金额", "Newest first": "从新到旧", "How to use": "如何使用", "Oldest first": "从旧到新", "Filter": "筛选", "Reviewed ✓": "已审阅 ✓", "Summary": "摘要", "Account email": "账户邮箱", "Preview": "预览", "Archive": "档案", "Sort": "排序", "Add credits": "增加点数", "Search reports": "搜索报告", "Clear search": "清除搜索", "I · Reading": "I · 阅读", "Choose a service": "选择服务", "Business stats": "业务统计", "Quick filters": "快速筛选", "Check this one": "检查这份", "General questions": "常见问题", "Clear filters": "清除筛选", "Pending": "处理中", "Transaction summary": "交易摘要", "Back to overview": "返回概览", "Use this type": "使用此类型", "Filter by status": "按状态筛选", "Your credits": "你的点数", "Start a new check": "开始新的检查", "Points to ask": "需要询问的点", "Details": "详情", "Remove profile photo": "删除头像", "Clear selection": "清除选择", "History type": "历史类型", "John Doe": "张三", "Phone number": "电话号码", "Credits left": "剩余点数", "Past stats": "历史统计", "What this does": "这个工具做什么", "Restore text": "恢复文本", "Transaction history": "交易历史", "Loans / borrowing": "借款 / 贷款", "Scope of the service": "服务范围", "Nothing hidden": "没有隐藏", "Hide details": "隐藏详情", "National ID number": "身份证号", "{0}. User account": "{0}. 用户账户", "If a check fails": "若检查失败", "in your contract?": "在你的合同里吗？", "II · How it works": "II · 如何运作", "FAQ": "常见问题", "How we help": "我们如何帮你", "Full name": "姓名", "from your contract": "来自你的合同", "tell you what to change": "告诉你应该改什么", "Clauses to watch": "需留意的条款", "← Back to front": "← 返回正面", "Suggested wording": "建议措辞", "{0} Mark": "{0} 标记", "Point out risky clauses": "指出有风险的条款", "Risk level": "风险等级", "Privacy": "隐私", "Common problems": "常见问题", "Room / condo rental": "租房 / 公寓", "Common types": "常用类型", "Credit balance": "点数余额", "Every clause, every line": "每一条，每一行", "Search contract types": "搜索合同类型", "Business partnership": "合伙做生意", "{0} · Read clause by clause": "{0} · 逐条阅读", "Before you start": "使用前须知", "Loading 3D house…": "正在加载 3D 房屋…", "Accept both": "同意两份文件", "Let us decide": "让我们判断", "Pick your situation": "选择你的情况", "{0} contract checks": "{0} 次合同检查", "{0} audio summaries": "{0} 次语音摘要", "Credits & payment": "点数与付款", "Terms & policies": "条款与政策", "No results yet": "还没有结果", "with one contract": "一份合同", "Past checks": "过往检查", "to try it out": "用于试用", "e.g. John Smith": "例如 张伟", "Filter by contract type": "按合同类型筛选", "III · Short film": "III · 短片", "Credits by type": "按类型的点数", "Contract Check intro video": "合同检查介绍视频", "Results appear here": "结果会显示在这里", "Try a sample contract": "试试示例合同", "Mask detected emails": "隐藏识别到的邮箱", "Checked contract text": "已检查的合同文本", "History overview": "历史概览", "✓ What we can do": "✓ 我们能做的", "Risk details": "风险详情", "Contractors / freelancers": "工匠 / 自由职业者", "Transparent payment": "透明付款", "All checks": "全部检查", "Email and contact details": "邮箱与联系方式", "Remind me when it ends": "到期时提醒我", "✕ What we don't do": "✕ 我们不做的", "III · How we help": "III · 我们如何帮你", "Tap a tag to see another": "点击标签查看其他", "or what to ask the other party": "或该问对方什么", "Search top-ups": "搜索充值记录", "Never miss a move-out notice date": "不错过搬离通知日期", "See a free sample result →": "查看免费示例结果 →", "Contracts often say this": "合同里常这样写", "Turn on auto-masking": "开启自动隐藏", "Silent intro video": "无声介绍视频", "About to sign something like this": "正要签这样的合同", "avg {0} THB per check": "平均每次 {0} 泰铢", "Collect points for free checks": "攒分数换免费检查", "Items to discuss before signing": "签字前需沟通的事项", "All your checks are here": "你的所有检查都在这里", "Type words you don't want sent": "输入不想发送的词", "Search, e.g. rent, job, loan": "搜索，例如 租、雇、借", "Account and credit balance": "账户与点数余额", "Send starred only ({0})": "只发送加星项（{0}）", "We don't decide who's right": "我们不判断谁对谁错", "Utility bills higher than expected": "水电费比想的更贵", "Set reminders for key dates": "为重要日期设置提醒", "quoting the actual text": "并引用实际条文", "For audio summaries of results": "用于结果的语音摘要", "Car / land / instalments": "买车 / 土地 / 分期", "We don't contact the other party for you": "我们不会代你联系对方", "↓ We suggest asking for": "↓ 我们建议改为", "Mask detected {0}-digit numbers": "隐藏识别到的 {0} 位号码", "Try a sample result · free": "试看示例结果 · 免费", "Preview the masked text": "预览隐藏后的文本", "Credits are refunded automatically": "点数会自动退还", "Anything breaks, you pay for it all": "东西坏了全部自己修", "{0} · Mask what's yours": "{0} · 隐藏属于你的信息", "We don't redraft the whole contract": "我们不会重写整份合同", "How to use & FAQ": "使用方法与常见问题", "Tap ⊕ to see what to watch": "点 ⊕ 查看需注意的地方", "You've reached the selected issue": "已到达所选问题", "Signed ............ Tenant": "签名 ............ 承租人", "See a sample employment result": "查看雇佣合同示例结果", "Mask detected phone numbers": "隐藏识别到的电话号码", "Signed ............ Landlord": "签名 ............ 出租人", "Check and top-up history": "检查与充值历史", "What to ask or request instead": "该问什么或改成什么", "Masked before the text is analysed": "文本在分析前已隐藏", "Can't connect, please try again": "无法连接，请重试", "Moved out and never got the deposit back": "搬走后押金没退", "See a sample loan result": "查看借款合同示例结果", "How worrying the contract is overall": "合同整体的风险程度", "See a sample room rental result": "查看租房合同示例结果", "Vellum Check intro video": "Vellum Check 介绍视频", "Other (none of the above)": "其他（以上都不符合）", "Clause by clause, explained simply": "逐条用简单的话解释", "Free sample: yearly room rental →": "免费示例：按年租房 →", "Search by report name or contract type": "按报告名称或合同类型搜索", "For contract checks and risk analysis": "用于合同检查和风险分析", "Not a lawyer, no legal advice": "不是律师，不提供法律意见", "Don't know the type? Choose \"Not sure\"": "不知道类型？选“不确定”", "The term is {0} year from signing": "合同期限为签字起 {0} 年", "Not sure (we detect it from the text)": "不确定（根据文本自动判断）", "Search pack / date / reference": "搜索套餐 / 日期 / 编号", "Silent version · loops automatically": "无声版 · 自动循环播放", "The tenant must repair all damage in every case": "承租人在任何情况下都要修复所有损坏", "Mask names, IDs and phone numbers before checking": "检查前隐藏姓名、证件号和电话", "End dates, notice dates, payment dates": "到期日、通知日、付款日", "Choose the pack that suits you": "选择适合你的套餐", "{0} · Mark what to ask before signing": "{0} · 标记签字前要问的事", "{0}:{1} · narrated · tap to play": "{0}:{1} · 有配音 · 点击播放", "Sale (price, delivery, payment)": "买卖（价格、交付、付款）", "Rental (rent, deposit, term)": "租赁（租金、押金、租期）", "Loan (interest, due dates)": "借款（利息、还款日期）", "Move out early, no deposit refund in any case": "提前搬走，任何情况都不退押金", "Partnership (profit split, duties)": "合伙（利润分配、职责）", "Initial screening tool · Vellum Check": "初步筛查工具 · Vellum Check", "Each clause is read and matched to the actual text": "每一条都会被阅读并与原文核对", "Vellum Check intro video (silent)": "Vellum Check 介绍视频（无声）", "Your contract checks and credit history": "你的合同检查和点数记录", "Points out risky clauses, quoting the real text": "指出有风险的条款并引用原文", "Samples are free · new accounts get {0} free checks": "示例免费 · 新账户送 {0} 次免费检查", "Illustration only · not legal advice": "仅作示意 · 并非法律意见", "Your text is kept; choose a pack to continue": "文本已保留，选择套餐即可继续", "No match; try another word or choose \"Not sure\"": "没有匹配项，换个词或选“不确定”", "Employment (salary, hours, dismissal)": "雇佣（工资、工时、解雇）", "Rent is {0} THB a month, due on the {1}th": "月租 {0} 泰铢，每月 {1} 日支付", "Service (scope, deadlines, milestone pay)": "服务（范围、期限、分期付款）", "Pick your situation and see how we help": "选择你的情况，看看我们能帮什么", "The landlord can raise rent anytime without notice": "出租人可随时涨租，无需通知", "NDA (confidentiality, protection period)": "保密协议（保密范围、保护期）", "No matching issues; try another word or clear filters": "没有匹配的问题，换个词或清除筛选", "You've seen every issue; read the whole contract once more before signing": "你已看完所有问题，签字前请再完整读一遍合同", "Return the deposit within {0} days, deducting only proven damage": "{0} 天内退还押金，只扣有证据的损坏", "Mask other words (comma separated, e.g. company name, address)": "隐藏其他词（用逗号分隔，例如 公司名, 地址）", "If the tenant leaves early, the landlord keeps the deposit in every case": "若承租人提前搬走，出租人在任何情况下都不退押金", "· This adapted hand animation is shared under the same licence": "· 修改后的手部动画按相同许可发布", "Unchecked text found, saved only in this browser": "发现未检查的文本，仅保存在本浏览器中", "Use a negative number to remove credits; balance never goes below {0} · every change is logged": "输入负数可减少点数；余额不会低于 {0} · 每次修改都有记录", "Avoid pasting unnecessary personal data such as ID or bank account numbers": "请勿粘贴不必要的个人信息，如身份证号或银行账号", "We don't judge whether a contract is fair; we point out what to ask or check before signing": "我们不判断合同是否公平，只指出签字前该问或该查什么", "Tip: paste only the contract text you want checked, without unnecessary personal data": "提示：只粘贴需要检查的合同文本，不要包含不必要的个人信息", "Check your credits before starting; your transaction history is kept for reference": "开始前请确认点数；交易记录会保留以便查询", "Choose a pack above to see the total; nothing is charged until you create the QR": "选择上方套餐查看总额；在你生成二维码前不会扣费", "Check the amount and number of checks before paying; there are no automatic repeat charges": "付款前请确认金额和次数；不会自动重复扣费", "Names, IDs and contact details are masked in your browser before analysis": "姓名、证件号和联系方式会在你的浏览器中先隐藏再分析", "Screens Thai contracts for risks, showing what to check, grouped by risk level": "筛查泰文合同的风险，指出需检查的地方并按风险分级", "The signing hand comes from the 3D model “Rigged hand” by Elena FF (Sketchfab), used under licence": "签字的手来自 Elena FF 的 3D 模型“Rigged hand”（Sketchfab），按许可使用", "Screening tool · not legal advice · have a lawyer review important contracts before signing": "筛查工具 · 并非法律意见 · 重要合同签字前请让律师审阅", "Log in, choose the contract type (if known), paste the text and press Check. Each check uses {0} credit": "登录，选择合同类型（如知道），粘贴文本后点检查。每次检查使用 {0} 点", "Not legal advice. We don't rule on fairness or say who has the advantage. Have a lawyer review important contracts before signing.": "并非法律意见。我们不判断是否公平，也不说哪方占优。重要合同签字前请让律师审阅。", "Contract text you check is sent to our AI provider (Anthropic) for analysis. PDF/Word/image files are converted to text on our server.": "你检查的合同文本会发送给我们的 AI 服务商（Anthropic）进行分析。PDF/Word/图片会在我们的服务器上转成文本。", "You get a report sorted by risk, saying whether to act before signing or paying, with negotiation tips. Copy, share or save as PDF; it's kept in your history.": "你会得到一份按风险排序的报告，说明应在签字前还是付款前处理，并附协商建议。可复制、分享或保存为 PDF，并保存在历史中。", "AI reads the contract clause by clause and quotes the real text. Our server verifies each quote exists in your contract and clearly labels any that don't.": "AI 逐条阅读合同并引用原文。我们的服务器会核对每条引文是否真的在你的合同中，找不到的会明确标注。", "Names, ID numbers, phone numbers and emails are masked in your browser before analysis. Choose what to mask and preview the result. Detection may miss some cases, so double-check before sending.": "姓名、身份证号、电话和邮箱会在你的浏览器中先隐藏再分析。可选择隐藏哪些内容并预览结果。可能无法识别所有情况，发送前请自行核对。"};
  /* คำไทยที่ภาษาจีนต้องแปลต่างจากภาษาอังกฤษ */
  var ZO = {"อ่าน": "先", "ให้": "读", "ครบ": "完", "อ่านแล้ว": "已读", "ครั้ง": "次", "ตรวจสัญญา": "检查合同", "ก": "字","ข้อความในสัญญา":"合同中的文字","คัดลอกข้อความเดิม":"复制原文","สมัครสมาชิก / อื่น ๆ":"会员 / 其他","เครดิตคงเหลือทั้งหมด":"剩余点数合计","นางสาวตัวอย่าง มีสุข":"李娜","อีก {0} วัน":"还有 {0} 天","เลยมา {0} วัน":"已过 {0} 天","ทุกเดือน":"每月","คำนวณ":"计算","ดูสัญญา ›":"查看合同 ›"};
  /* กฎแบบมีส่วนเนื้อหา: ส่วนที่จับได้ ($1, $2) จะถูกแปลต่อถ้าเป็นภาษาไทย */
  var RULES = [
    [/^(.+) 3D ลากเพื่อหมุน$/, '$1 3D · drag to rotate', '$1 3D · 拖动旋转'],
    [/^บ้าน 3D “(.+)” โดย (.+) \(Sketchfab\) ·$/, '3D house “$1” by $2 (Sketchfab) ·', '$2 的 3D 房屋“$1”（Sketchfab）·'],
    [/^ประเด็นที่ (\d+) · (.*)$/, 'Issue $1 · $2', '问题 $1 · $2'],
    [/^ประเด็น (\d+) · (.*)$/, 'Issue $1 · $2', '问题 $1 · $2'],
    [/^เลขที่รายงาน (.+)$/, 'Report no. $1', '报告编号 $1'],
    [/^ข้อความตรงกับสัญญา · มาตราที่ AI ระบุ: (.*) \(ยังไม่ได้ตรวจเทียบกฎหมาย\)$/, 'Text matches contract · sections cited by AI: $1 (not yet verified against the law)', '引文与合同一致 · AI 引用的条文：$1（尚未与法律核对）'],
    [/^ดูเหตุผล: (.+)$/, 'See why: $1', '查看原因：$1'],
    [/^ใช้ “(.+)”$/, 'Use “$1”', '使用“$1”'],
    [/^สวัสดี คุณ (.+)$/, 'Hello, $1', '你好，$1'],
    [/^ข้อ (\d+) · (.+)$/, 'Clause $1 · $2', '第 $1 条 · $2'],
    [/^เรื่อง "(.+)" ควรเขียนแบบไหนถึงจะเป็นธรรม\?$/, 'How should "$1" be worded to be fair?', '“$1”怎样写才公平？'],
    [/^เรื่อง "(.+)" ถ้าอีกฝ่ายไม่ยอมแก้ ควรทำอย่างไร\?$/, 'What if the other party won\'t change "$1"?', '如果对方不同意修改“$1”怎么办？'],
    [/^เรื่อง "(.+)" มีความเสี่ยงอะไรถ้าเซ็นไปทั้งแบบนี้\?$/, 'What is the risk of signing "$1" as is?', '按现在的“$1”签字有什么风险？'],
    [/^ควรเพิ่มเรื่อง "(.+)" ในสัญญาอย่างไร\?$/, 'How should "$1" be added to the contract?', '应如何在合同中加入“$1”？']
  ];
  /* เดือนไทย → อังกฤษ */
  var MF = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var MS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var EM = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var ES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dates(s) {
    if (LANG === 'zh') {
      s = s.replace(new RegExp('(\\d{1,2})\\s+(' + MF.join('|') + ')\\s+(\\d{4})', 'g'), function (m, d, mo, y) { y = +y; return (y > 2400 ? y - 543 : y) + '年' + (MF.indexOf(mo) + 1) + '月' + d + '日'; });
      return s.replace(new RegExp('(\\d{1,2})\\s*(' + MS.map(function (x) { return x.replace(/\./g, '\\.'); }).join('|') + ')(\\s*(\\d{2,4}))?', 'g'), function (m, d, mo, _, y) {
        var r = (MS.indexOf(mo) + 1) + '月' + d + '日'; if (y) { y = +y; if (y < 100) y += 2500; r = (y > 2400 ? y - 543 : y) + '年' + r; } return r; });
    }
    s = s.replace(new RegExp('(\\d{1,2})\\s+(' + MF.join('|') + ')\\s+(\\d{4})', 'g'), function (m, d, mo, y) { y = +y; return d + ' ' + EM[MF.indexOf(mo)] + ' ' + (y > 2400 ? y - 543 : y); });
    s = s.replace(new RegExp('(\\d{1,2})\\s*(' + MS.map(function (x) { return x.replace(/\./g, '\\.'); }).join('|') + ')(\\s*(\\d{2,4}))?', 'g'), function (m, d, mo, _, y) {
      var r = d + ' ' + ES[MS.indexOf(mo)]; if (y) { y = +y; if (y < 100) y += 2500; r += ' ' + (y > 2400 ? y - 543 : y); } return r; });
    return s;
  }

  var ZOK = LANG === 'zh';
  function L(en) { return ZOK && ZH.hasOwnProperty(en) ? ZH[en] : en; }
  var TH = /[฀-๿]/, NUM = /\d[\d,]*(?:\.\d+)?/g;
  var missing = window.__vcMissing = {};
  var cache = {};
  function tr(s) {
    if (!s || !TH.test(s)) return null;
    if (TOUT[s.trim().replace(/\s+/g, ' ')]) return s;
    if (cache.hasOwnProperty(s)) return cache[s];
    var lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], t = s.trim().replace(/\s+/g, ' '), out = null;
    if (ZOK && ZO.hasOwnProperty(t)) out = ZO[t];
    else if (D.hasOwnProperty(t)) out = L(D[t]);
    else {
      var nums = [], key = t.replace(NUM, function (m) { nums.push(m); return '{' + (nums.length - 1) + '}'; });
      if (nums.length && (D.hasOwnProperty(key) || (ZOK && ZO.hasOwnProperty(key)))) out = (ZOK && ZO.hasOwnProperty(key) ? ZO[key] : L(D[key])).replace(/\{(\d+)\}/g, function (m, i) { return nums[+i] != null ? nums[+i] : m; });
      else { var dt = dates(t); if (dt !== t && !TH.test(dt)) out = dt; }
      if (out == null) for (var r = 0; r < RULES.length; r++) {
        var m = RULES[r][0].exec(t); if (!m) continue;
        var bad = false;
        out = (ZOK && RULES[r][2] ? RULES[r][2] : RULES[r][1]).replace(/\$(\d)/g, function (x, i) { var v = m[+i] || ''; if (TH.test(v)) { var w = tr(v); if (w == null) bad = true; return w != null ? w.trim() : v; } return v; });
        if (bad) out = null;   /* ส่วนเนื้อหายังแปลไม่ได้ → ส่งทั้งประโยคให้ AI แปลแทน */
        break;
      }
    }
    if (out == null && t.indexOf(' · ') > 0) {
      var segs = t.split(' · '), ok = true;
      for (var g = 0; g < segs.length && ok; g++) {
        if (!TH.test(segs[g])) continue;
        var sv = tr(segs[g]); if (sv == null) ok = false; else segs[g] = sv.trim();
      }
      if (ok) out = segs.join(' · ');
    }
    if (out == null && TRC.hasOwnProperty(t)) out = TRC[t];
    if (out == null) { if (Object.keys(missing).length < 3000) missing[t] = (missing[t] || 0) + 1; return null; }
    out = lead + out + trail; cache[s] = out; return out;
  }
  /* ---------- ข้อความที่ไม่มีในพจนานุกรม → ให้ AI แปล (ผ่าน /api/translate) แล้วจำไว้ในเครื่อง ----------
     ใช้กับผลตรวจตัวอย่าง ศัพท์น่ารู้ หน้าช่วยเหลือ วันสำคัญ และผลตรวจเก่าที่เป็นภาษาไทย
     ไม่ส่งข้อความในช่องพิมพ์/ข้อความต้นฉบับสัญญา (ถูกข้ามด้วย skip ด้านล่าง) */
  var TRK = 'vc_trc2_' + LANG, TRC = {};
  try { localStorage.removeItem('vc_trc_' + LANG); } catch (e) {}
  try { TRC = JSON.parse(localStorage.getItem(TRK) || '{}') || {}; } catch (e) { TRC = {}; }
  var pend = {}, inflight = {}, failed = {}, aiT = 0, aiWait = 350, TOUT = {};
  for (var tk in TRC) if (TRC.hasOwnProperty(tk)) TOUT[TRC[tk]] = 1;   /* คำแปลที่ได้แล้ว: ไม่ส่งไปแปลซ้ำ แม้มีอักษรไทยปนอยู่ */
  function saveTRC() {
    try {
      var k = Object.keys(TRC); if (k.length > 2500) { var keep = {}; k.slice(-2000).forEach(function (x) { keep[x] = TRC[x]; }); TRC = keep; }
      localStorage.setItem(TRK, JSON.stringify(TRC));
    } catch (e) { try { localStorage.removeItem(TRK); } catch (e2) {} }
  }
  function ask(raw, target) {
    var t = String(raw || '').trim().replace(/\s+/g, ' ');
    if (t.length < 2 || t.length > 1500 || !TH.test(t) || failed[t] > 1 || TOUT[t]) return;
    (pend[t] = pend[t] || []).push(target);
    if (!aiT) aiT = setTimeout(flushAI, aiWait);
  }
  function apply(t, v) {
    (pend[t] || []).forEach(function (g) {
      if (g.n) { var cur = g.n.nodeValue || ''; if (cur.trim().replace(/\s+/g, ' ') === t) g.n.nodeValue = cur.match(/^\s*/)[0] + v + cur.match(/\s*$/)[0]; }
      else if (g.el && (g.el.getAttribute(g.a) || '').trim().replace(/\s+/g, ' ') === t) g.el.setAttribute(g.a, v);
    });
    delete pend[t];
  }
  function flushAI() {
    aiT = 0;
    Object.keys(pend).forEach(function (k) { if (failed[k] > 1 && !inflight[k]) delete pend[k]; });   /* แปลไม่ได้ 2 ครั้ง = เลิกส่งซ้ำ (เดิมส่งวนทุก 0.15 วิ จนชนเพดานคำขอ ข้อความอื่นเลยไม่ถูกแปล) */
    var keys = Object.keys(pend).filter(function (k) { return !inflight[k]; }), batch = [], total = 0;
    for (var i = 0; i < keys.length && batch.length < 40; i++) {
      if (TRC.hasOwnProperty(keys[i])) { apply(keys[i], TRC[keys[i]]); continue; }
      if (total + keys[i].length > 12000) break;
      batch.push(keys[i]); total += keys[i].length;
    }
    if (!batch.length) return;
    batch.forEach(function (k) { inflight[k] = 1; });
    of.call(window, '/api/translate', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: LANG, texts: batch.map(function (k) { var d = dates(k); return TH.test(d) ? d : k; }) }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        (d.out || []).forEach(function (v, i) { var k = batch[i]; delete inflight[k]; if (v) { TRC[k] = v; TOUT[v.trim().replace(/\s+/g, ' ')] = 1; apply(k, v); } else failed[k] = (failed[k] || 0) + 1; });
        saveTRC(); aiWait = 350;
        if (Object.keys(pend).some(function (k) { return !inflight[k]; })) aiT = setTimeout(flushAI, 150);
      }, function (st) {
        batch.forEach(function (k) { delete inflight[k]; if (st !== 429) failed[k] = (failed[k] || 0) + 1; });   /* 429 = ส่งถี่ไป รอแล้วลองใหม่ ไม่นับว่าแปลไม่ได้ */
        aiWait = st === 429 ? 15000 : Math.min(aiWait * 3, 20000); aiT = setTimeout(flushAI, aiWait);
      });
  }

  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  function skip(el) { return !el || el.closest && el.closest('[data-i18n-skip],script,style,[contenteditable="true"]'); }
  var HEAD = LANG === 'zh' ? { 'ตรวจสัญญา': '检查' } : { 'ตรวจสัญญา': 'Check' };   /* แถบด้านบนพื้นที่น้อย ใช้คำสั้น */
  function doText(n) { var p = n.parentElement;
    if (p && p.closest('.site-header') && HEAD[n.nodeValue.trim()]) { n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), HEAD[n.nodeValue.trim()]); return; } if (skip(p) || (p && p.closest('textarea:not(.vrm-title),#vwBody,.hl-quote,.tx-old,.sg-old > p:not(.sg-plbl),blockquote,.ad-face .gv,.vc-raw,.vrm-src'))) return; var v = tr(n.nodeValue); if (v != null) { if (v !== n.nodeValue) n.nodeValue = v; } else ask(n.nodeValue, { n: n }); }
  function doAttrs(el) {
    if (skip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) { var a = el.getAttribute(ATTRS[i]); if (a && TH.test(a)) { var v = tr(a); if (v != null) { if (v !== a) el.setAttribute(ATTRS[i], v); } else ask(a, { el: el, a: ATTRS[i] }); } }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && TH.test(el.value)) { var w = tr(el.value); if (w != null && w !== el.value) el.value = w; }
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
  function title() { var v = tr(document.title); if (v && v !== document.title) document.title = v; }

  root.setAttribute('lang', LANG === 'zh' ? 'zh-Hans' : 'en');
  /* หมายเหตุภาษาแบบถาวรในโหมดอังกฤษ: ใต้คำเตือนหน้าตรวจ ท้ายผลตรวจ และท้ายหน้า */
  function legal() {
    var spots = [document.querySelector('#checkCard .disclaimer:not(#authMsg)'), document.querySelector('#result'), document.querySelector('body > footer, footer')];
    spots.forEach(function (el, i) {
      if (!el || (i === 1 && !el.children.length)) return;
      var host = i === 0 ? el.parentNode : el, after = i === 0 ? el : null;
      if (!host || host.querySelector(':scope > .vc-lang-legal')) return;
      var p = document.createElement('p'); p.className = 'vc-lang-legal'; p.setAttribute('data-i18n-skip', '');
      p.textContent = (i === 1 ? (LANG === 'zh' ? '本报告由 AI 以中文撰写，仅为方便阅读，以合同原文为准。' : 'This report was written in English by AI for convenience. The original contract text prevails. ') : '') + NOTE[LANG];
      if (after) host.insertBefore(p, after.nextSibling); else host.appendChild(p);
    });
  }
  /* อธิบายส่วนที่ตั้งใจคงไว้เป็นภาษาไทย: ข้อความที่ยกมาจากสัญญา และช่องวันที่ของมือถือ */
  var WHY = LANG === 'zh'
    ? { q: '合同原文 · 为便于与实际合同核对，保留原语言。抱歉给您带来不便', d: '日期格式由你手机的语言设置决定，网站无法更改。抱歉给您带来不便' }
    : { q: 'Original contract text · kept in its original language so you can match it to your contract. Sorry for the inconvenience', d: 'Dates follow your phone\'s language setting and cannot be changed by the website. Sorry for the inconvenience' };
  var QSEL = '.vrm-src,.hl-quote,.tx-old,.sg-old > p:not(.sg-plbl),#result blockquote';
  function why() {
    var qs = document.querySelectorAll(QSEL);
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (q.getAttribute('data-vc-why') || !TH.test(q.textContent || '')) continue;
      q.setAttribute('data-vc-why', '1');
      var n = document.createElement('small'); n.className = 'vc-why'; n.setAttribute('data-i18n-skip', ''); n.textContent = WHY.q;
      q.parentNode.insertBefore(n, q);
    }
    var lists = document.querySelectorAll('.vrm-list');
    for (var j = 0; j < lists.length; j++) {
      var l = lists[j];
      if (!l.querySelector('.vrm-date') || l.previousElementSibling && l.previousElementSibling.classList.contains('vc-why-d')) continue;
      var d = document.createElement('small'); d.className = 'vc-why vc-why-d'; d.setAttribute('data-i18n-skip', ''); d.textContent = 'ⓘ ' + WHY.d;
      l.parentNode.insertBefore(d, l);
    }
  }
  boot(function () {
    title(); try { walk(document.body); } catch (e) {} root.classList.remove('i18n-wait');
    legal(); why(); setInterval(function () { legal(); why(); }, 1500);
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
