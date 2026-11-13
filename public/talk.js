/* ===== เวลลัมพูดสรุป: ตัวละครนูน 3 มิติบนเวที + คำบรรยายคาราโอเกะ + แถบคลื่นเสียง =====
   VCTalk.mount(el, { audio: base64 | src: url, text, align: {c,s,e} | null, title, autoplay, compact })
   (1) แถบเวลาเป็นแท่งคลื่นเสียงจากเสียงจริง  (2) เวที: สปอตไลต์ พื้นเรืองแสง วงคลื่นเสียงตามความดัง
   (3) คำบรรยายทีละประโยค ไฮไลต์ไหลตามคำ ประโยคที่จบเลื่อนขึ้นจางหาย
   (4) ท่าทางตามเนื้อหา: ตัวเลข/เงิน = ชูเหรียญ · ประเด็นสำคัญ = หน้าจริงจัง+ชี้ · จบ = ยิ้ม 👍 + พลุกระดาษ */
(function () {
  'use strict';
  var INK = '#3a2a12';
  var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = '' +
    '.vtk{position:relative;margin:0 0 16px;padding:16px 16px 14px;border-radius:22px;border:1px solid rgba(255,255,255,.1);' +
      'background:radial-gradient(120% 90% at 0% 0%,rgba(245,196,81,.10),transparent 55%),radial-gradient(90% 80% at 100% 100%,rgba(52,211,153,.09),transparent 60%),#121317;' +
      'box-shadow:0 18px 40px -22px rgba(0,0,0,.8);overflow:hidden;color:#ececef;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif}' +
    '.vtk *{box-sizing:border-box}' +
    '.vtk-top{display:grid;grid-template-columns:120px minmax(0,1fr);gap:12px;align-items:center}' +
    /* (2) เวที */
    '.vtk-stage{position:relative;height:158px;perspective:520px;display:grid;place-items:end center;isolation:isolate}' +
    '.vtk-spot{position:absolute;left:50%;top:-18px;width:150px;height:170px;margin-left:-75px;pointer-events:none;z-index:0;' +
      'background:linear-gradient(180deg,rgba(255,236,170,.30),rgba(255,236,170,.06) 70%,transparent);clip-path:polygon(42% 0,58% 0,100% 100%,0 100%);' +
      'filter:blur(3px);opacity:.25;transition:opacity .5s ease}' +
    '.vtk.is-play .vtk-spot{opacity:1}' +
    '.vtk-lamp{position:absolute;left:50%;top:-22px;width:30px;height:8px;margin-left:-15px;border-radius:0 0 12px 12px;background:#2b2c33;box-shadow:0 4px 14px 2px rgba(255,226,138,.0);transition:box-shadow .5s;z-index:1}' +
    '.vtk.is-play .vtk-lamp{box-shadow:0 5px 18px 4px rgba(255,226,138,.55)}' +
    '.vtk-floor{position:absolute;left:50%;bottom:-2px;width:118px;height:26px;margin-left:-59px;border-radius:50%;z-index:0;' +
      'background:radial-gradient(closest-side,rgba(255,216,77,.38),rgba(255,216,77,.08) 60%,transparent);opacity:.35;transition:opacity .5s}' +
    '.vtk.is-play .vtk-floor{opacity:1}' +
    '.vtk-shadow{position:absolute;left:50%;bottom:4px;width:70px;height:10px;margin-left:-35px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent);z-index:1}' +
    '.vtk-rings{position:absolute;left:50%;top:58%;width:0;height:0;z-index:1;pointer-events:none}' +
    '.vtk-ring{position:absolute;left:-46px;top:-46px;width:92px;height:92px;border-radius:50%;border:2px solid rgba(255,216,77,.7);opacity:0;animation:vtkRing 1.15s cubic-bezier(.2,.7,.3,1) forwards}' +
    '@keyframes vtkRing{0%{transform:scale(.55);opacity:.55}100%{transform:scale(1.7);opacity:0}}' +
    '.vtk-fig{position:relative;z-index:2;transform-style:preserve-3d;will-change:transform}' +
    '.vtk-fig svg{display:block;max-width:none !important;filter:drop-shadow(0 14px 12px rgba(0,0,0,.55)) drop-shadow(0 2px 1px rgba(0,0,0,.35))}' +
    /* (4) ของประกอบ */
    '.vtk-coin{position:absolute;z-index:3;left:calc(50% + 30px);top:6px;width:30px;height:30px;opacity:0;transform:translateY(14px) scale(.4);transition:opacity .2s,transform .35s cubic-bezier(.3,1.6,.5,1);pointer-events:none}' +
    '.vtk-coin svg{width:30px !important;height:30px !important;max-width:none !important;display:block;animation:vtkSpin 1.4s linear infinite}' +
    '@keyframes vtkSpin{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}' +
    '.vtk.is-money .vtk-coin{opacity:1;transform:none}' +
    '.vtk-thumb{position:absolute;z-index:3;left:calc(50% + 26px);top:10px;font-size:26px;line-height:1;opacity:0;transform:scale(.3) rotate(-20deg);transition:opacity .2s,transform .45s cubic-bezier(.3,1.7,.5,1);pointer-events:none}' +
    '.vtk.is-done .vtk-thumb{opacity:1;transform:none}' +
    '.vtk-conf{position:absolute;left:50%;top:40%;width:0;height:0;z-index:4;pointer-events:none}' +
    '.vtk-conf i{position:absolute;width:6px;height:9px;border-radius:1.5px;opacity:0;animation:vtkConf 1.3s cubic-bezier(.15,.6,.35,1) forwards}' +
    '@keyframes vtkConf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}' +
    '.vtk-hint{position:absolute;z-index:5;left:50%;top:0;transform:translateX(-50%);white-space:nowrap;font:600 11px/1 Prompt,sans-serif;color:#1a1305;background:#ffd84d;padding:5px 9px;border-radius:999px;animation:vtkHop 1.6s ease-in-out infinite}' +
    '.vtk.is-started .vtk-hint{display:none}' +
    '@keyframes vtkHop{50%{transform:translate(-50%,-4px)}}' +
    '.vtk .vtk-eyes{transform-origin:60px 58px;transform-box:view-box}.vtk .vtk-eyes.blink{transform:scaleY(.1)}' +
    '.vtk .vtk-brows{transition:transform .2s;transform-box:view-box;transform-origin:60px 50px}' +
    '.vtk .vm-arm-r{animation:none;transform-origin:89px 72px;transform-box:view-box;transition:transform .35s cubic-bezier(.3,1.4,.5,1)}' +
    '.vtk.is-play .vm-arm-r{animation:vtkWave 1.6s ease-in-out infinite}' +
    '.vtk.is-play.is-serious .vm-arm-r{animation:none;transform:rotate(48deg)}' +
    '@keyframes vtkWave{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}' +
    '.vtk-face-happy{display:none}.vtk.is-done .vtk-face-happy{display:inline}.vtk.is-done .vtk-face-talk{display:none}' +
    /* (3) บับเบิล + คำบรรยาย */
    '.vtk-bub{position:relative;padding:12px 14px 12px;border-radius:18px;background:#f7efdc;color:#2a2116;box-shadow:inset 0 -3px 0 rgba(0,0,0,.08),0 10px 24px -14px rgba(0,0,0,.7)}' +
    '.vtk-bub::before{content:"";position:absolute;left:-9px;top:46%;border:9px solid transparent;border-right-color:#f7efdc;border-left:0}' +
    '.vtk-who{display:flex;align-items:center;gap:6px;margin:0 0 6px;font:600 12px/1.2 Prompt,sans-serif;color:#8a6a2b;letter-spacing:.02em}' +
    '.vtk-who i{width:7px;height:7px;border-radius:50%;background:#c9b48a;flex:none}' +
    '.vtk.is-play .vtk-who i{background:#e5484d;animation:vtkRec 1.2s infinite}' +
    '@keyframes vtkRec{0%{box-shadow:0 0 0 0 rgba(229,72,77,.6)}70%{box-shadow:0 0 0 7px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}' +
    '.vtk-view{position:relative;height:5.6em;overflow:hidden;font:500 16px/1.6 Prompt,sans-serif;--ff:Prompt,sans-serif;' +
      '-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 100%);mask-image:linear-gradient(180deg,transparent 0,#000 22%,#000 100%)}' +
    '.vtk-lines{position:absolute;left:0;right:0;top:0;transition:transform .5s cubic-bezier(.25,.8,.3,1)}' +
    '.vtk-ln{margin:0;padding:1px 0 4px;opacity:.5;transform-origin:0 50%;transition:opacity .4s,transform .4s}' +
    '.vtk-ln.past{opacity:.28;transform:scale(.94)}.vtk-ln.now{opacity:1;transform:none}' +
    '.vtk-wait{display:none;margin:0;height:5.6em;align-items:center;gap:3px;font:500 15px/1.6 Prompt,sans-serif;color:#8a6a2b}' +
    '.vtk-wait i{width:6px;height:6px;border-radius:50%;background:#c9a24a;animation:vtkDot 1s ease-in-out infinite}.vtk-wait i:nth-child(2){animation-delay:.15s}.vtk-wait i:nth-child(3){animation-delay:.3s}' +
    '@keyframes vtkDot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}' +
    '.vtk.is-started:not(.is-live) .vtk-wait{display:flex}.vtk.is-started:not(.is-live) .vtk-view{display:none}' +
    '.vtk-w{color:#a8987a;border-radius:3px;background-image:linear-gradient(#ffd84d,#ffd84d);background-repeat:no-repeat;background-position:0 88%;background-size:0 52%;transition:color .12s}' +
    '.vtk-w.p{color:#2a2116;background-image:linear-gradient(rgba(255,216,77,.42),rgba(255,216,77,.42));background-size:100% 52%}' +
    '.vtk-w.c{color:#1d1407;background-size:calc(var(--f,0) * 100%) 52%}' +
    '.vtk-ln.past .vtk-w{color:#6f6250}' +
    /* (1) แถบคลื่นเสียง + ปุ่ม */
    '.vtk-ctl{display:flex;align-items:center;gap:10px;margin-top:14px}' +
    '.vtk-wave{position:relative;flex:1;min-width:0;height:40px;display:flex;align-items:center;justify-content:space-between;gap:2px;cursor:pointer;touch-action:none;padding:0 2px}' +
    '.vtk-wave i{flex:1 1 0;max-width:4px;min-width:2px;border-radius:3px;background:rgba(255,255,255,.18);transition:background .15s,transform .15s}' +
    '.vtk-wave i.on{background:linear-gradient(180deg,#ffe28a,#f2b81c)}' +
    '.vtk-wave i.at{background:#fff;transform:scaleY(1.15)}' +
    '.vtk-t{flex:none;min-width:70px;text-align:right;font:500 12px/1 Prompt,sans-serif;color:#a1a1aa;font-variant-numeric:tabular-nums}' +
    '.vtk .vtk-pp,.vtk .vtk-rp{box-sizing:border-box !important;flex:0 0 46px !important;width:46px !important;height:46px !important;min-width:46px !important;min-height:46px !important;max-width:46px !important;max-height:46px !important;' +
      'padding:0 !important;margin:0 !important;border-radius:50% !important;aspect-ratio:1/1;display:flex !important;align-items:center !important;justify-content:center !important;line-height:0 !important;font-size:0 !important;cursor:pointer;transition:transform .12s}' +
    '.vtk .vtk-pp{border:0 !important;color:#1a1305;background:linear-gradient(145deg,#ffe28a,#f2b81c) !important;box-shadow:0 8px 18px -8px rgba(242,184,28,.8) !important}' +
    '.vtk .vtk-rp{border:1.5px solid rgba(255,255,255,.18) !important;background:rgba(255,255,255,.06) !important;color:#ddd}' +
    '.vtk .vtk-pp:active,.vtk .vtk-rp:active{transform:scale(.93)}' +
    '.vtk .vtk-pp svg,.vtk .vtk-rp svg{display:block !important;max-width:none !important;flex:none;width:20px !important;height:20px !important}.vtk .vtk-rp svg{width:19px !important;height:19px !important}' +
    '.vtk .vtk-pp.is-p svg{transform:translateX(1.5px)}' +
    '.vtk-compact{margin:12px 0 0;padding:12px;border-radius:18px}.vtk-compact .vtk-stage{height:140px}.vtk-compact .vtk-top{grid-template-columns:100px minmax(0,1fr)}.vtk-compact .vtk-ctl{margin-top:10px}' +
    /* (2) ฝุ่นในแสงไฟ + ม่านเวที */
    '.vtk-dust{position:absolute;left:50%;top:-10px;width:110px;height:160px;margin-left:-55px;z-index:1;pointer-events:none;opacity:.35;transition:opacity .5s}' +
    '.vtk.is-play .vtk-dust{opacity:1}' +
    '.vtk-dust i{position:absolute;bottom:0;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;background:#ffe9a8;box-shadow:0 0 6px 1px rgba(255,226,138,.7);opacity:0;animation:vtkDust var(--d) linear var(--dl) infinite}' +
    '@keyframes vtkDust{0%{opacity:0;transform:translate(0,0)}15%{opacity:.9}80%{opacity:.6}100%{opacity:0;transform:translate(var(--dx),-150px)}}' +
    '.vtk-cur{position:absolute;top:-16px;bottom:-14px;width:16px;z-index:0;opacity:.6;pointer-events:none;' +
      'background:repeating-linear-gradient(90deg,#4a111a 0 3px,#7b2331 3px 7px,#5a1621 7px 10px);box-shadow:inset 0 -10px 14px rgba(0,0,0,.5)}' +
    '.vtk-cur.l{left:-16px;border-radius:0 0 14px 0;transform-origin:0 0}.vtk-cur.r{right:-16px;border-radius:0 0 0 14px;transform-origin:100% 0}' +
    '.vtk-val{position:absolute;left:-16px;right:-16px;top:-16px;height:14px;z-index:1;opacity:.65;pointer-events:none;' +
      'background:radial-gradient(circle at 9px 0,#7b2331 8px,transparent 8.5px) 0 0/18px 14px repeat-x,linear-gradient(#5a1621,#5a1621) 0 0/100% 5px no-repeat}' +
    /* (3) เปิดตัว */
    '.vtk.is-enter .vtk-drop{animation:vtkDrop .8s cubic-bezier(.3,1.45,.5,1) .3s both}' +
    '@keyframes vtkDrop{0%{transform:translateY(-150px) rotate(-8deg);opacity:0}45%{opacity:1}100%{transform:none;opacity:1}}' +
    '.vtk.is-enter .vtk-spot,.vtk.is-enter .vtk-lamp{animation:vtkLight .6s steps(1,end) both}' +
    '@keyframes vtkLight{0%{opacity:0}30%{opacity:.6}45%{opacity:.1}60%{opacity:1}100%{opacity:1}}' +
    '.vtk.is-enter .vtk-bub{animation:vtkBub .5s cubic-bezier(.3,1.5,.5,1) .85s both;transform-origin:0 50%}' +
    '@keyframes vtkBub{0%{transform:scale(.3);opacity:0}100%{transform:none;opacity:1}}' +
    '.vtk.is-enter .vtk-cur.l{animation:vtkCurL .9s ease-out both}.vtk.is-enter .vtk-cur.r{animation:vtkCurR .9s ease-out both}' +
    '@keyframes vtkCurL{0%{transform:scaleX(4)}100%{transform:none}}@keyframes vtkCurR{0%{transform:scaleX(4)}100%{transform:none}}' +
    '.vtk.is-enter .vm-arm-r{animation:vtkWave .45s ease-in-out 1.15s 3}' +
    '.vtk-puff{position:absolute;left:50%;bottom:4px;width:0;height:0;z-index:3;pointer-events:none}' +
    '.vtk-puff i{position:absolute;width:8px;height:8px;margin:-4px;border-radius:50%;background:rgba(247,239,220,.7);animation:vtkPuff .6s ease-out forwards}' +
    '@keyframes vtkPuff{0%{opacity:.9;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(var(--x),-8px) scale(1.6)}}' +
    /* (5) การ์ดประเด็นที่เด้งตามที่พูด */
    '.vtk-chips{display:flex;flex-wrap:nowrap;gap:6px;margin:10px -2px 0;padding:2px 2px 4px;overflow-x:auto;scrollbar-width:none;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}.vtk-chips::-webkit-scrollbar{display:none}' +
    '.vtk-chips.has{min-height:38px}.vtk-chips:not(.has){display:none}' +
    '.vtk-chips .vtk-chip{flex:none;max-width:82%}' +
    '.vtk-chip{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:6px 10px 6px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);' +
      'color:#ececef;font:500 12.5px/1.3 Prompt,sans-serif;--ff:Prompt,sans-serif;cursor:pointer;text-align:left;animation:vtkChip .45s cubic-bezier(.3,1.5,.5,1) both}' +
    '.vtk-chip b{flex:none;display:grid;place-items:center;width:18px;height:18px;border-radius:6px;font-size:11px;color:#fff;background:#e5484d}' +
    '.vtk-chip.cau b{background:#f2b81c;color:#1a1305}.vtk-chip.low b{background:#34d399;color:#06281c}' +
    '.vtk-chip span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.vtk-chip em{flex:none;font-style:normal;color:#9a9aa3;font-size:11.5px}' +
    '.vtk-chip.now{border-color:#ffd84d;background:rgba(255,216,77,.12);box-shadow:0 0 0 3px rgba(255,216,77,.12)}' +
    '@keyframes vtkChip{0%{opacity:0;transform:translateY(8px) scale(.85)}100%{opacity:1;transform:none}}' +
    '.vtk-flash{animation:vtkFlash 1.6s ease-out}@keyframes vtkFlash{0%,30%{box-shadow:0 0 0 3px #ffd84d,0 0 30px rgba(255,216,77,.5)}100%{box-shadow:0 0 0 0 rgba(255,216,77,0)}}' +
    /* (6) เครื่องเล่นลอย */
    '.vtk-mini{position:fixed;left:14px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:900;display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:999px;' +
      'background:rgba(20,21,25,.92);border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 30px -10px rgba(0,0,0,.8);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);' +
      'color:#ececef;font:600 12px/1.2 Prompt,sans-serif;--ff:Prompt,sans-serif;opacity:0;transform:translateY(20px) scale(.9);pointer-events:none;transition:opacity .3s,transform .35s cubic-bezier(.3,1.4,.5,1)}' +
    '.vtk-mini.on{opacity:1;transform:none;pointer-events:auto}' +
    '.vtk-mini-av{position:relative;width:52px;height:52px;flex:none;border-radius:50%;display:grid;place-items:center;cursor:pointer;' +
      'background:conic-gradient(#ffd84d calc(var(--p,0)*1%),rgba(255,255,255,.12) 0);padding:3px}' +
    '.vtk-mini-av>span{width:100%;height:100%;border-radius:50%;background:#1d1e24;display:grid;place-items:end center;overflow:hidden}' +
    '.vtk-mini-av svg{width:40px !important;height:47px !important;max-width:none !important;display:block;margin-bottom:-4px}' +
    '.vtk-mini-st{position:absolute;right:-2px;bottom:-2px;width:20px;height:20px;border-radius:50%;background:#ffd84d;color:#1a1305;display:grid;place-items:center;box-shadow:0 2px 6px rgba(0,0,0,.5)}' +
    '.vtk-mini-st svg{width:10px !important;height:10px !important;max-width:none !important;margin:0 !important;display:block}' +
    '.vtk-mini-tx{display:flex;flex-direction:column;gap:2px;cursor:pointer}.vtk-mini-tx small{font:400 11px/1.2 Prompt,sans-serif;color:#9a9aa3}' +
    '.vtk-mini-x{width:26px;height:26px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:#bbb;font-size:13px;line-height:1;cursor:pointer;padding:0}' +
    '@media (max-width:520px){.vtk{padding:14px 12px 12px}.vtk-top{grid-template-columns:96px minmax(0,1fr);gap:10px}.vtk-stage{height:136px}.vtk-view{font-size:15px}.vtk-t{min-width:0;font-size:11px}.vtk-ctl{gap:8px}}' +
    '@media (prefers-reduced-motion:reduce){.vtk-dust,.vtk.is-enter *{animation:none !important}.vtk-hint,.vtk.is-play .vm-arm-r,.vtk-coin svg{animation:none}.vtk-lines{transition:none}}' +
    'html[data-theme="light"] .vtk{background:#fbf8f1;color:#2a2116;border-color:rgba(0,0,0,.08)}html[data-theme="light"] .vtk-wave i{background:rgba(0,0,0,.14)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var PLAY = '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4.5 2.5v11l9-5.5z" fill="currentColor"/></svg>';
  var PAUSE = '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>';
  var REPLAY = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" fill="none" stroke="currentColor"/><path d="M3 4v5h5" fill="none" stroke="currentColor"/></svg>';
  var COIN = '<svg viewBox="-12 -12 24 24" width="30" height="30"><circle r="10.5" fill="#f4c542" stroke="' + INK + '" stroke-width="2"/><circle r="6.6" fill="none" stroke="#fff3c4" stroke-width="1.6" opacity=".8"/>' +
    '<text x="0" y="4.2" text-anchor="middle" font-size="11" font-weight="700" fill="#8a5a08" font-family="Prompt,sans-serif">฿</text></svg>';
  var BROW = 'M45 49q5-4 10-1M65 48q5-3 10 1', BROW_S = 'M45 47q5 0 10 3M65 50q5-3 10-3';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2); }

  function figure(size) {
    var s = window.VCMascot ? window.VCMascot.svg('wave', size || 110) : '';
    if (!s) return '<div style="font-size:64px;line-height:1">📜</div>';
    var face = '<g class="vtk-face-talk">' +
      '<g class="vtk-brows"><path class="vtk-brow" d="' + BROW + '" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/></g>' +
      '<g class="vtk-eyes"><ellipse cx="50" cy="58" rx="4" ry="5" fill="' + INK + '"/><ellipse cx="70" cy="58" rx="4" ry="5" fill="' + INK + '"/>' +
        '<circle cx="51.4" cy="56.2" r="1.5" fill="#fff"/><circle cx="71.4" cy="56.2" r="1.5" fill="#fff"/></g>' +
      '<ellipse class="vtk-mouth" cx="60" cy="68" rx="6" ry="1.6" fill="#8e2a22" stroke="' + INK + '" stroke-width="2"/>' +
      '<ellipse class="vtk-tongue" cx="60" cy="69.5" rx="3.4" ry="0" fill="#f08a80"/></g>' +
      '<g class="vtk-face-happy"><path d="M45 59q5-6 10 0M65 59q5-6 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
        '<path d="M51 65q9 10 18 0z" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/></g>';
    s = s.replace(/<g class="vm-face">[\s\S]*?<\/g>/, '<g class="vm-face">' + face + '</g>');
    var uid = 'vtkB' + Math.random().toString(36).slice(2, 7);
    s = s.replace('<g class="vm-body">', '<defs><filter id="' + uid + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="3.2" specularConstant=".75" specularExponent="16" lighting-color="#fff6dd" result="sp"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>' +
      '<feComposite in="sp" in2="SourceAlpha" operator="in" result="spi"/><feComposite in="SourceGraphic" in2="spi" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0"/></filter></defs>' +
      '<g class="vm-body" filter="url(#' + uid + ')">');
    // เงาวงรีเดิมของมาสคอตไม่ใช้ (เวทีมีเงาของตัวเอง)
    return s.replace(/<ellipse cx="60" cy="134"[^>]*\/>/, '');
  }

  /* ตัดคำไทย */
  function dust() {
    var h = '';
    for (var i = 0; i < 9; i++) h += '<i style="--x:' + (18 + Math.random() * 64).toFixed(0) + '%;--s:' + (1.5 + Math.random() * 2).toFixed(1) + 'px;--d:' + (3.5 + Math.random() * 3).toFixed(1) + 's;--dl:-' + (Math.random() * 6).toFixed(1) + 's;--dx:' + (Math.random() * 30 - 15).toFixed(0) + 'px"></i>';
    return h;
  }
  /* (1) ทรงปากตามสระ: A=อ้ากว้าง E=ยิ้มแบน O=ห่อกลม M=หุบ (ม บ ป พ ผ ฟ ฝ) */
  var VIS = { A: [6.8, 5.2], E: [8.2, 2.2], O: [3.9, 4.4], M: [6.2, .5], N: [6, 3] };
  function viseme(str, i) {
    var c = str.charAt(i) || '', n1 = str.charAt(i + 1) || '', n2 = str.charAt(i + 2) || '';
    if (!c || /[\s,.!?]/.test(c)) return 'M';
    var look = c + n1 + n2;
    if (/[ุูโ]/.test(look) || /ัว|อ$/.test(c + n1)) return 'O';
    if (/[ิีึืเแ]/.test(look)) return 'E';
    if (/[าะัำไใ]/.test(look)) return 'A';
    if (/[มบปพผฟฝ]/.test(c)) return 'M';
    return 'N';
  }
  function words(text) {
    var out = [];
    try {
      if (window.Intl && Intl.Segmenter) {
        var it = new Intl.Segmenter('th', { granularity: 'word' }).segment(text)[Symbol.iterator](), r;
        while (!(r = it.next()).done) out.push({ t: r.value.segment, a: r.value.index });
        if (out.length) return out;
      }
    } catch (e) {}
    var re = /\s+|[^\s]{1,6}/g, m;
    while ((m = re.exec(text))) out.push({ t: m[0], a: m.index });
    return out;
  }
  /* รวมคำเป็นประโยคสั้น ๆ (จบที่ . , ? ! หรือก่อน "ได้แก่" หรือยาวเกิน ~42 ตัวอักษร) */
  function phrases(W) {
    var P = [], cur = [], len = 0;
    W.forEach(function (w, i) {
      var nx = W[i + 1] ? W[i + 1].t : '';
      if (!cur.length && /^\s+$/.test(w.t)) return;
      if (!cur.length && /^[,.!?]+$/.test(w.t) && P.length) { P[P.length - 1].push(i); return; }   /* เครื่องหมายหลุดมา = ติดประโยคก่อน */
      cur.push(i); len += w.t.length;
      var cut = /[.,!?]\s*$/.test(w.t) || (/^\s+$/.test(w.t) && (/^(ได้แก่|และ)$/.test(W[i + 1] && W[i + 1].t) || len > 42)) || !nx;
      if (/^\s+$/.test(w.t) && /[.,!?]$/.test(W[i - 1] ? W[i - 1].t : '')) cut = true;
      if (cut) { P.push(cur); cur = []; len = 0; }
    });
    if (cur.length) P.push(cur);
    return P;
  }

  function mount(host, o) {
    if (!host || !o || !(o.audio || o.src)) return null;
    var text = String(o.text || '').trim() || 'สรุปผลตรวจสัญญา';
    var W = words(text), P = phrases(W), lineOf = [];
    P.forEach(function (p, li) { p.forEach(function (k) { lineOf[k] = li; }); });
    var MONEY = /\d|บาท|%|ล้าน|หมื่น|พัน|ค่าปรับ|ดอกเบี้ย|เงิน/, SERIOUS = /ประเด็น|สำคัญ|เสี่ยง|ไม่คืน|ห้าม|ยึด|สูงเกิน|ไม่ครบ|ได้ตลอด|ไม่ต้อง|ทุกกรณี|ผิดสัญญา/;
    var money = W.map(function (w) { return MONEY.test(w.t); });
    var serious = P.map(function (p) { return SERIOUS.test(p.map(function (k) { return W[k].t; }).join('')); });

    var root = document.createElement('section'); root.className = 'vtk' + (o.compact ? ' vtk-compact' : '');
    root.setAttribute('aria-label', 'เวลลัมอ่านสรุปผลตรวจ');
    root.innerHTML = '<div class="vtk-top"><div class="vtk-stage"><span class="vtk-cur l"></span><span class="vtk-cur r"></span><span class="vtk-val"></span><span class="vtk-spot"></span><div class="vtk-dust">' + dust() + '</div><span class="vtk-lamp"></span><span class="vtk-floor"></span><span class="vtk-shadow"></span><div class="vtk-rings"></div>' +
      '<div class="vtk-drop"><div class="vtk-fig">' + figure() + '</div></div><div class="vtk-puff"></div><span class="vtk-coin">' + COIN + '</span><span class="vtk-thumb">👍</span><div class="vtk-conf"></div><span class="vtk-hint">แตะฟังได้เลย</span></div>' +
      '<div class="vtk-bub"><p class="vtk-who"><i></i>' + esc(o.title || 'เวลลัมสรุปให้ฟัง') + '</p><p class="vtk-wait">กำลังเตรียมเสียง<i></i><i></i><i></i></p><div class="vtk-view" data-i18n-skip><div class="vtk-lines">' +
      P.map(function (p) { return '<p class="vtk-ln">' + p.map(function (k) { return '<span class="vtk-w" data-k="' + k + '">' + esc(W[k].t) + '</span>'; }).join('') + '</p>'; }).join('') +
      '</div></div></div></div>' +
      '<div class="vtk-chips"></div>' +
      '<div class="vtk-ctl"><button type="button" class="vtk-pp is-p" aria-label="เล่นเสียงสรุป">' + PLAY + '</button>' +
      '<div class="vtk-wave" role="slider" aria-label="ตำแหน่งเสียง" tabindex="0"></div>' +
      '<span class="vtk-t">0:00 / 0:00</span><button type="button" class="vtk-rp" aria-label="ฟังใหม่ตั้งแต่ต้น">' + REPLAY + '</button></div>';
    host.insertBefore(root, host.firstChild);

    var bytes = null, src = o.src;
    if (!src) try {
      var bin = atob(o.audio); bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      src = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
    } catch (e) { src = 'data:audio/mpeg;base64,' + o.audio; }
    var au = new Audio(); au.preload = 'auto'; au.src = src;

    var $ = function (q) { return root.querySelector(q); };
    var pp = $('.vtk-pp'), wave = $('.vtk-wave'), tm = $('.vtk-t'), lines = $('.vtk-lines'), view = $('.vtk-view');
    var fig = $('.vtk-fig'), mouth = $('.vtk-mouth'), tongue = $('.vtk-tongue'), eyes = $('.vtk-eyes'), brows = $('.vtk-brows'), brow = $('.vtk-brow'), rings = $('.vtk-rings'), shadow = $('.vtk-shadow');
    var spans = lines.querySelectorAll('.vtk-w'), lns = lines.querySelectorAll('.vtk-ln');

    /* (1) แท่งคลื่นเสียง */
    var bars = [], NB = 0;
    function buildBars(peaks) {
      NB = Math.max(24, Math.min(64, Math.floor((wave.clientWidth || 200) / 5)));
      var h = [];
      for (var i = 0; i < NB; i++) {
        var v;
        if (peaks) { var a = Math.floor(i / NB * peaks.length), b = Math.max(a + 1, Math.floor((i + 1) / NB * peaks.length)), m = 0; for (var j = a; j < b; j++) m = Math.max(m, peaks[j]); v = m; }
        else { var x = Math.sin(i * 12.9898 + text.length) * 43758.5453; v = .25 + .6 * (x - Math.floor(x)); }
        h.push(v);
      }
      var mx = Math.max.apply(null, h) || 1;
      wave.innerHTML = h.map(function (v) { return '<i style="height:' + Math.round(6 + 30 * Math.pow(v / mx, .8)) + 'px"></i>'; }).join('');
      bars = wave.querySelectorAll('i'); lastBar = -2;
    }
    buildBars(null);
    function decodePeaks(ab) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC || !ab) return;
      var c; try { c = new AC(); } catch (e) { return; }
      var done = function (b) {
        try {
          var d = b.getChannelData(0), n = 200, step = Math.floor(d.length / n) || 1, pk = [];
          for (var i = 0; i < n; i++) { var s = 0; for (var j = i * step; j < (i + 1) * step && j < d.length; j += 8) s = Math.max(s, Math.abs(d[j])); pk.push(s); }
          buildBars(pk);
        } catch (e) {}
        try { c.close(); } catch (e) {}
      };
      try { var p = c.decodeAudioData(ab, done, function () { try { c.close(); } catch (e) {} }); if (p && p.then) p.then(function () {}, function () {}); } catch (e) {}
    }
    if (bytes) decodePeaks(bytes.buffer.slice(0));
    else fetch(src).then(function (r) { return r.arrayBuffer(); }).then(decodePeaks, function () {});

    /* เวลาเริ่มของแต่ละคำ */
    var al = o.align && o.align.c && o.align.s ? o.align : null, joined = al ? al.c.join('') : '';
    function charTime(idx, dur) {
      if (al) { var j = joined === text ? idx : Math.round(idx * (al.c.length / Math.max(1, text.length))); j = Math.min(al.s.length - 1, Math.max(0, j)); return al.s[j]; }
      return dur ? idx / text.length * dur : 0;
    }
    var starts = [];
    function calc() {
      var d = isFinite(au.duration) ? au.duration : 0;
      if (!al && !d) { starts = W.map(function () { return 1e9; }); starts.push(1e9); return; }   /* ยังไม่รู้ความยาว = ยังไม่เดา */
      starts = W.map(function (w) { return charTime(w.a, d); }); starts.push(d || 1e9);
    }
    calc(); au.addEventListener('loadedmetadata', calc); au.addEventListener('durationchange', calc);

    /* ความดัง: Web Audio (ยกเว้น iPhone ซึ่งทำให้เสียงเงียบได้) · ไม่งั้นขยับตามคำ */
    var ctx = null, an = null, buf = null, ampOk = false;
    function setupAudio() {
      if (IOS) return;
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      try { ctx = new AC(); var node = ctx.createMediaElementSource(au); an = ctx.createAnalyser(); an.fftSize = 512; node.connect(an); an.connect(ctx.destination); buf = new Uint8Array(an.fftSize); if (ctx.state === 'suspended') ctx.resume(); }
      catch (e) { ctx = null; an = null; }
    }
    function level(t, k) {
      if (au.paused) return 0;
      if (an) {
        an.getByteTimeDomainData(buf); var sum = 0;
        for (var i = 0; i < buf.length; i += 2) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / (buf.length / 2)); if (rms > .01) ampOk = true;
        if (ampOk) return Math.min(1, rms * 4.2);
      }
      var w = W[k]; if (!w || /^[\s,.!?]+$/.test(w.t)) return .04;
      var f = (t - starts[k]) / Math.max(.05, (starts[k + 1] || t + .3) - starts[k]);
      f = Math.max(0, Math.min(1, f));
      return (.3 + .45 * Math.abs(Math.sin(t * 15.5 + k))) * Math.min(1, f * 6) * Math.min(1, (1 - f) * 6 + .2);
    }

    /* (3)+(4) วาดคำบรรยายและท่าทาง */
    var cur = -2, curLine = -1, lastBar = -2, live = false;
    au.addEventListener('playing', function () { live = true; calc(); root.classList.add('is-live'); });
    function wordAt(t) {
      if (!live) return -1;   /* ยังไม่มีเสียงออกจริง = ยังไม่ขยับคำบรรยาย */
      if (au.ended) return W.length;
      var k = -1; for (var i = 0; i < W.length; i++) { if (starts[i] <= t + .04) k = i; else break; } return k;
    }
    function paintWords(t, k) {
      if (k !== cur) {
        cur = k;
        for (var j = 0; j < spans.length; j++) { var kk = +spans[j].getAttribute('data-k'); spans[j].className = 'vtk-w' + (kk < k ? ' p' : kk === k ? ' c' : ''); }
        var li = k >= W.length ? P.length - 1 : k < 0 ? 0 : lineOf[k] != null ? lineOf[k] : curLine;
        if (li !== curLine && li != null && lns[li]) {
          curLine = li;
          for (var q = 0; q < lns.length; q++) lns[q].className = 'vtk-ln' + (q < li ? ' past' : q === li ? ' now' : '');
          var target = lns[li].offsetTop - Math.max(0, view.clientHeight - lns[li].offsetHeight - 4);
          lines.style.transform = 'translateY(' + (-Math.max(0, target)) + 'px)';
        }
        root.classList.toggle('is-serious', !!serious[curLine] && k >= 0 && k < W.length);
      }
      if (k >= 0 && k < W.length) {
        var el = lines.querySelector('.vtk-w.c');
        if (el) { var f = (t - starts[k]) / Math.max(.05, starts[k + 1] - starts[k]); el.style.setProperty('--f', Math.max(0, Math.min(1, f)).toFixed(3)); }
      }
      // ชูเหรียญเมื่อพูดถึงตัวเลข/เงิน (ค้างไว้อีกนิดให้เห็นทัน)
      var mon = false; if (k >= 0 && k < W.length) for (var m = Math.max(0, k - 2); m <= Math.min(W.length - 1, k + 1); m++) if (money[m]) mon = true;
      root.classList.toggle('is-money', mon && !au.paused);
      brow.setAttribute('d', root.classList.contains('is-serious') && !au.paused ? BROW_S : BROW);
    }
    var sm = 0, mx = 6, my = 1.6, ringAt = 0, blinkAt = performance.now() + 1800, raf = 0;
    function frame(now) {
      var t = au.currentTime || 0, d = au.duration || 0, k = wordAt(t);
      var a = Math.max(0, level(t, k) || 0); sm += (a - sm) * .45; if (sm < 0) sm = 0;
      var vs = 'N';
      if (!au.paused && k >= 0 && k < W.length) {
        if (al && joined === text) { for (var q = 0; q < al.s.length; q++) if (al.s[q] <= t && t < (al.e[q] || al.s[q] + .1)) { vs = viseme(text, q); break; } }
        else { var ww = W[k].t, ff = Math.max(0, Math.min(.999, (t - starts[k]) / Math.max(.05, starts[k + 1] - starts[k]))); vs = viseme(ww, Math.floor(ff * ww.length)); }
      }
      var tv = VIS[vs], open = Math.min(1, .35 + sm * 1.3);
      mx += ((au.paused ? 6 : tv[0]) - mx) * .35; my += ((au.paused ? 1.6 : Math.max(.5, tv[1] * open)) - my) * .35;
      mouth.setAttribute('rx', mx.toFixed(2)); mouth.setAttribute('ry', my.toFixed(2));
      tongue.setAttribute('ry', (vs === 'A' && my > 3.5 ? my * .35 : 0).toFixed(2));
      if (miniMouth) { miniMouth.setAttribute('rx', mx.toFixed(2)); miniMouth.setAttribute('ry', my.toFixed(2)); }
      brows.style.transform = 'translateY(' + (-sm * 2.2).toFixed(2) + 'px)';
      var sec = now / 1000, play = !au.paused;
      var ry = RM ? 0 : Math.sin(sec * (play ? 1.3 : .7)) * (play ? 10 : 5), rx = RM ? 0 : Math.sin(sec * .9) * 3, y = RM ? 0 : -sm * 7 + Math.sin(sec * 2) * (play ? 1.5 : 2.5);
      fig.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg)';
      shadow.style.transform = 'scale(' + (1 + y / 36).toFixed(3) + ')'; shadow.style.opacity = (1 + y / 30).toFixed(2);
      if (play && !RM && sm > .32 && now - ringAt > 260) { ringAt = now; var r = document.createElement('span'); r.className = 'vtk-ring'; rings.appendChild(r); setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 1200); }
      if (now > blinkAt) { eyes.classList.add('blink'); setTimeout(function () { eyes.classList.remove('blink'); }, 120); blinkAt = now + 2200 + Math.random() * 2600; }
      var p = d ? Math.min(1, t / d) : 0, on = Math.round(p * NB);
      if (on !== lastBar) { lastBar = on; for (var i = 0; i < bars.length; i++) bars[i].className = i < on ? 'on' : (i === on && t > 0 && !au.ended ? 'at' : ''); }
      wave.setAttribute('aria-valuenow', Math.round(p * 100));
      tm.textContent = fmt(t) + ' / ' + fmt(d);
      paintWords(t, k);
      chipTick(k);
      if (mini) mini.av.style.setProperty('--p', (p * 100).toFixed(1));
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    var gone = setInterval(function () { if (!root.isConnected) { cancelAnimationFrame(raf); clearInterval(gone); try { au.pause(); } catch (e) {} } }, 2000);

    function confetti() {
      if (RM) return; var box = $('.vtk-conf'), C = ['#ffd84d', '#34d399', '#f472b6', '#60a5fa', '#fb923c', '#f7efdc'];
      for (var i = 0; i < 16; i++) {
        var c = document.createElement('i'), ang = -Math.PI / 2 + (Math.random() - .5) * 2.4, dist = 45 + Math.random() * 45;
        c.style.background = C[i % C.length];
        c.style.setProperty('--x', Math.round(Math.cos(ang) * dist) + 'px'); c.style.setProperty('--y', Math.round(Math.sin(ang) * dist + 30) + 'px'); c.style.setProperty('--r', Math.round(Math.random() * 540 - 270) + 'deg');
        c.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
        box.appendChild(c);
      }
      setTimeout(function () { box.innerHTML = ''; }, 1600);
    }
    function sync() {
      var on = !au.paused && !au.ended;
      root.classList.toggle('is-play', on);
      pp.innerHTML = on ? PAUSE : PLAY; pp.classList.toggle('is-p', !on); pp.setAttribute('aria-label', on ? 'หยุดชั่วคราว' : 'เล่นเสียงสรุป');
    }
    function play() {
      setupAudio(); root.classList.add('is-started'); root.classList.remove('is-done'); cur = -2;
      var p = au.play();
      if (p && p.catch) p.catch(function () { root.classList.remove('is-started'); $('.vtk-hint').textContent = 'แตะปุ่มสีทองเพื่อฟัง'; sync(); });
    }
    pp.addEventListener('click', function () { if (au.paused) play(); else au.pause(); });
    fig.addEventListener('click', function () { if (au.paused) play(); else au.pause(); });
    $('.vtk-rp').addEventListener('click', function () { try { au.currentTime = 0; } catch (e) {} play(); });
    au.addEventListener('play', sync); au.addEventListener('pause', sync);
    au.addEventListener('ended', function () { sync(); root.classList.add('is-done'); root.classList.remove('is-serious', 'is-money'); cur = -2; paintWords(1e9, W.length); confetti(); });
    function seek(e) {
      var r = wave.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      if (au.duration) { au.currentTime = Math.max(0, Math.min(1, x / r.width)) * au.duration; cur = -2; root.classList.remove('is-done'); if (!root.classList.contains('is-started')) root.classList.add('is-started'); }
    }
    var drag = false;
    wave.addEventListener('pointerdown', function (e) { drag = true; seek(e); try { wave.setPointerCapture(e.pointerId); } catch (er) {} });
    wave.addEventListener('pointermove', function (e) { if (drag) seek(e); });
    wave.addEventListener('pointerup', function () { drag = false; });
    wave.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') au.currentTime = Math.min(au.duration || 0, au.currentTime + 3);
      else if (e.key === 'ArrowLeft') au.currentTime = Math.max(0, au.currentTime - 3);
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pp.click(); } else return;
      cur = -2;
    });
    view.addEventListener('click', function (e) {
      var s = e.target.closest('.vtk-w'); if (!s) return;
      var k = +s.getAttribute('data-k'); if (starts[k] != null) { au.currentTime = starts[k]; cur = -2; if (au.paused) play(); }
    });
    window.addEventListener('resize', function () { if (root.isConnected && bars.length) { var hs = [].map.call(bars, function (b) { return parseFloat(b.style.height) / 36; }); buildBars(hs); } });

    /* (5) การ์ดประเด็น: เด้งขึ้นเมื่อพูดถึงหัวข้อนั้น */
    var chipsBox = $('.vtk-chips'), CH = [];
    (o.items || []).forEach(function (it) {
      var tt = String(it.title || '').trim(); if (!tt) return;
      var at = text.indexOf(tt); if (at < 0) at = text.indexOf(tt.slice(0, 12)); if (at < 0) return;
      var k0 = 0; for (var i = 0; i < W.length; i++) if (W[i].a <= at) k0 = i;
      CH.push({ k: k0, it: it, el: null });
    });
    CH.sort(function (a, b) { return a.k - b.k; });
    if (CH.length) chipsBox.classList.add('has');   /* จองพื้นที่ไว้ก่อน การ์ดจะได้ไม่กระตุกตอนเด้ง */
    function addChip(c) {
      if (c.el) return;
      var it = c.it, lv = it.level === 'check_detail' ? '' : it.level === 'caution' ? ' cau' : ' low';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vtk-chip' + lv;
      b.innerHTML = '<b>' + (it.level === 'check_detail' ? '!' : it.level === 'caution' ? '⚠' : 'i') + '</b><span>' + esc(it.title) + '</span>' + (it.ref ? '<em>· ' + esc(it.ref) + '</em>' : '');
      b.addEventListener('click', function () {
        var el = it.target && (typeof it.target === 'string' ? document.querySelector(it.target) : it.target);
        if (!el) { b.classList.add('now'); setTimeout(function () { b.classList.remove('now'); }, 700); return; }
        if (el.tagName === 'DETAILS') el.open = true;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('vtk-flash'); void el.offsetWidth; el.classList.add('vtk-flash');
      });
      c.el = b; chipsBox.appendChild(b);
      chipsBox.scrollLeft = chipsBox.scrollWidth;   /* เลื่อนให้เห็นการ์ดล่าสุด */
    }
    var lastChipK = -9;
    function chipTick(k) {
      if (!CH.length || k === lastChipK) return; lastChipK = k;
      var now = -1;
      CH.forEach(function (c, i) { if (k >= c.k) { addChip(c); now = i; } });
      CH.forEach(function (c, i) { if (c.el) c.el.classList.toggle('now', i === now && !au.paused && !au.ended); });
    }

    /* (6) เครื่องเล่นลอย: เลื่อนลงจนการ์ดหลุดจอ แต่ยังเล่นอยู่ */
    var mini = null, miniMouth = null, inView = true;
    if (!o.compact && 'IntersectionObserver' in window) {
      var el = document.createElement('div'); el.className = 'vtk-mini'; el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'เวลลัมกำลังพูดสรุป');
      el.innerHTML = '<div class="vtk-mini-av" role="button" tabindex="0" aria-label="เล่น/หยุด"><span>' + figure(40) + '</span><i class="vtk-mini-st">' + PAUSE + '</i></div>' +
        '<div class="vtk-mini-tx" role="button" tabindex="0" aria-label="กลับไปที่การ์ดเสียงสรุป">เวลลัมกำลังสรุป<small>แตะเพื่อกลับไปดู</small></div><button type="button" class="vtk-mini-x" aria-label="ปิดเสียงสรุป">✕</button>';
      document.body.appendChild(el);
      mini = { el: el, av: el.querySelector('.vtk-mini-av') };
      miniMouth = el.querySelector('.vtk-mouth');
      var toggle = function () { if (au.paused) play(); else au.pause(); };
      mini.av.addEventListener('click', toggle);
      el.querySelector('.vtk-mini-tx').addEventListener('click', function () { root.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      el.querySelector('.vtk-mini-x').addEventListener('click', function () { au.pause(); el.classList.remove('on'); });
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; miniSync(); }, { threshold: .15 }).observe(root);
    }
    function miniSync() {
      if (!mini) return;
      var show = !inView && root.isConnected && root.classList.contains('is-started') && !au.ended && !(au.paused && !mini.el.classList.contains('on'));
      mini.el.classList.toggle('on', show);
      mini.el.querySelector('.vtk-mini-st').innerHTML = au.paused ? PLAY : PAUSE;
      mini.el.querySelector('.vtk-mini-tx').firstChild.nodeValue = au.paused ? 'หยุดไว้ · ' : 'เวลลัมกำลังสรุป';
    }
    au.addEventListener('play', miniSync); au.addEventListener('pause', miniSync); au.addEventListener('ended', miniSync);
    var goneMini = setInterval(function () { if (!root.isConnected) { clearInterval(goneMini); if (mini && mini.el.parentNode) mini.el.parentNode.removeChild(mini.el); } }, 2000);

    /* (3) เปิดตัว: ไฟติด → ม่านเปิด → น้องกระโดดลงเวที (ฝุ่นฟุ้ง) → บับเบิลกาง → โบกมือ */
    if (!RM) {
      root.classList.add('is-enter');
      setTimeout(function () {
        var pf = $('.vtk-puff'); if (!pf) return;
        for (var i = 0; i < 6; i++) { var d = document.createElement('i'); d.style.setProperty('--x', ((i - 2.5) * 12) + 'px'); pf.appendChild(d); }
        setTimeout(function () { pf.innerHTML = ''; }, 700);
      }, 900);
      setTimeout(function () { root.classList.remove('is-enter'); }, 2600);
    }

    if (o.autoplay) play();
    return { root: root, audio: au, play: play, stop: function () { try { au.pause(); } catch (e) {} } };
  }

  window.VCTalk = { mount: mount };
})();
