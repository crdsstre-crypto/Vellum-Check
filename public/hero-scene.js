/* hero-scene.js — หน้าปกแบบเล่าเรื่องตามการเลื่อน (โต๊ะทำงาน → ส่อง UV → ตราประทับ → การ์ดผลตรวจ)
   - สร้างจาก hero-proto.html (ต้นแบบ) · อยู่ใน Shadow DOM จึงไม่ชนกับ art.css / style.css
   - เลื่อนภายในกล่องของตัวเอง (หน้าแรกของเว็บไม่เลื่อน) · ซ่อนส่วนหัวเดิม main > .hero ด้วย html.vch-on
   - ข้อมูลในสัญญาตัวอย่างเป็นข้อมูลสมมติทั้งหมด
   - ปิด: ลบ <script src="hero-scene.js"> ออกจาก index.html ส่วนหัวเดิมจะกลับมาเอง */
(function () {
  'use strict';
  if (window.__vcHeroScene) return; window.__vcHeroScene = 1;
  var CSS = ":host{display:block;position:relative;height:100vh;height:100svh;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;\n  background:#0a0806;color:#ececef;font-family:Prompt,system-ui,sans-serif;-webkit-font-smoothing:antialiased;scrollbar-width:none}\n:host::-webkit-scrollbar{display:none}\n\n  :host{--paper:#f5efe0;--ink:#2a251b;--hi:#ff4d5e;--md:#ffb020;--uv:#b06bff}\n  *{box-sizing:border-box}\n  .hx{position:relative;height:760vh}\n  .stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;perspective:1000px}\n  .L{position:absolute;left:50%;top:50%;will-change:transform,opacity}\n  /* ---------- โต๊ะไม้ ---------- */\n  .desk{width:160%;height:160%;margin:0;transform-origin:50% 50%;\n        background:\n          radial-gradient(60% 50% at 30% 30%,rgba(255,196,120,.18),transparent 70%),\n          repeating-linear-gradient(90deg,rgba(0,0,0,.0) 0 118px,rgba(0,0,0,.28) 118px 121px),\n          repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 7px,rgba(0,0,0,.035) 7px 13px,rgba(255,255,255,.02) 13px 29px),\n          linear-gradient(180deg,#5b3a22,#4a2e1a 60%,#3b2414)}\n  .desk::after{content:\"\";position:absolute;inset:0;opacity:.5;background:radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,0,.65) 85%)}\n  /* แสงโคมไฟ */\n  .pool{width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;border-radius:50%;\n        background:radial-gradient(circle at 50% 50%,rgba(255,214,150,.42),rgba(255,180,90,.16) 28%,transparent 55%);mix-blend-mode:screen;pointer-events:none}\n  .cam{position:absolute;inset:0;perspective:1000px;transform:translate(calc(var(--cx,0px) + var(--shx,0px)),calc(var(--cy,0px) + var(--shy,0px))) rotate(var(--cr,0deg)) scale(1.03)}\n  .grain{position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:multiply;opacity:.5}\n  .obj{filter:drop-shadow(16px 22px 14px rgba(0,0,0,.5))}\n  .pool{opacity:var(--po,1)}\n  .bulb{opacity:var(--bo,1)}\n  .note{width:100%;aspect-ratio:1;padding:10%;font:500 clamp(10px,3.4vmin,18px)/1.35 Sriracha,Prompt;color:#5a4410;\n        background:linear-gradient(160deg,#fff0a0,#ffd95a 70%,#f4c94a);box-shadow:inset 0 -10px 14px rgba(0,0,0,.08)}\n  .note::before{content:\"\";position:absolute;left:30%;top:-7%;width:40%;height:14%;background:rgba(255,255,255,.45);transform:rotate(-4deg)}\n  .steam path{stroke-dasharray:20 60;animation:stm 3.2s linear infinite;filter:blur(2px)}\n  .steam path+path{animation-delay:-1.6s}\n  @keyframes stm{0%{stroke-dashoffset:80;opacity:0}30%{opacity:.9}100%{stroke-dashoffset:0;opacity:0}}\n  .flash{position:absolute;inset:0;z-index:9;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(200,140,255,.75),rgba(120,60,255,.25) 40%,transparent 70%);opacity:var(--fl,0);mix-blend-mode:screen}\n  .snd{position:absolute;left:12px;bottom:calc(12px + var(--vh-nav,0px) + env(safe-area-inset-bottom));z-index:50;display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:99px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.5);color:#ddd;font:600 12px/1 Prompt;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);cursor:pointer}\n  .snd.on{border-color:#f5d27a;color:#f5d27a}\n  .obj svg{display:block;width:100%;height:100%;overflow:visible}\n  /* ---------- หัวข้อ ---------- */\n  .ttl{position:absolute;left:0;right:0;top:calc(var(--art-head,56px) + 4vh);margin:0;text-align:center;font-weight:800;line-height:1;z-index:20;pointer-events:none;\n       transform:translateY(var(--ty,0)) scale(var(--ts,1));opacity:var(--o1,1);filter:blur(var(--tb,0px)) drop-shadow(0 6px 24px rgba(0,0,0,.7))}\n  .ttl small{display:block;margin-bottom:10px;font:600 12px/1 Prompt;letter-spacing:.42em;color:#f3dcae}\n  .ttl span{display:block;background:linear-gradient(180deg,#fffaf0 15%,#f6dfa6 50%,#d9a54a 100%);-webkit-background-clip:text;background-clip:text;color:transparent}\n  .ttl .l1{font-size:clamp(50px,15vw,130px)}.ttl .l2{font-size:clamp(62px,19vw,170px)}\n  .hint{position:absolute;left:0;right:0;bottom:calc(4vh + var(--vh-nav,0px) + env(safe-area-inset-bottom));z-index:20;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 13px/1 Prompt;color:#f3dcae;opacity:var(--o1,1);text-shadow:0 2px 10px #000}\n  .sc{display:inline-block;width:22px;height:34px;border:2px solid rgba(255,255,255,.55);border-radius:12px;position:relative}\n  .sc::after{content:\"\";position:absolute;left:50%;top:6px;width:4px;height:7px;margin-left:-2px;border-radius:2px;background:#fff;animation:sc 1.6s infinite}\n  @keyframes sc{60%{transform:translateY(10px);opacity:0}100%{opacity:0}}\n  /* ---------- ความมืด + UV ---------- */\n  .dark{position:absolute;inset:0;z-index:8;background:#05030a;opacity:var(--dk,0);pointer-events:none}\n  .vig{position:absolute;inset:0;z-index:19;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(0,0,0,.6))}\n  canvas.dust{position:absolute;inset:0;z-index:18;pointer-events:none}\n  /* ---------- สัญญา ---------- */\n  .cw{z-index:10;width:min(86vw,470px);transform-style:preserve-3d}\n  .paper{position:absolute;inset:0;border-radius:6px;background:var(--paper);\n         box-shadow:0 2px 0 #e2d8c1,0 40px 80px -20px rgba(0,0,0,.8);opacity:var(--pa,1)}\n  .rows .ink{filter:brightness(calc(1 - var(--pd,0)))}\n  .paper{filter:brightness(calc(1 - var(--pd,0)))}\n  .paper::before{content:\"\";position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent 0 27px,rgba(42,37,27,.035) 27px 28px)}\n  .paper::after{content:\"\";position:absolute;inset:0;border-radius:inherit;background:rgba(40,10,80,.55);opacity:var(--pu,0)}\n  .rows{position:relative;padding:20px 18px 16px;transform-style:preserve-3d}\n  .row{position:relative;height:34px;display:flex;align-items:center;transform-style:preserve-3d;will-change:transform,opacity}\n  .row .ink{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden;font:400 13.5px/1 Sarabun,Prompt;color:var(--ink);opacity:var(--io,1)}\n  .row.h .ink{font:700 19px/1 Prompt}\n  .row.sig .ink{justify-content:space-between;font:400 11px/1 Prompt;color:#8a7f6a}.row.sig .ink i{flex:1;margin:0 8px;border-bottom:1px dotted #b8ad95}\n  .row .ink b{font-weight:600}\n  .row.rk .ink .mk{position:absolute;left:-4px;right:-4px;top:58%;height:38%;border-radius:3px;background:var(--c);opacity:calc(var(--rm,0) * .32)}\n  /* หมึกล่องหน */\n  .row.hid .ink{color:transparent}\n  .row.hid .uvt{position:absolute;inset:0;display:flex;align-items:center;white-space:nowrap;font:700 13.5px/1 Sarabun,Prompt;color:#ff6fa8;\n       text-shadow:0 0 6px rgba(255,80,160,.9),0 0 16px rgba(190,90,255,.7);opacity:calc(var(--io,1) * var(--lit,0))}\n  .uvl{position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:6px;opacity:var(--uo,0);\n       -webkit-mask:radial-gradient(circle 80px at var(--bx,50%) var(--by,50%),#000 55%,transparent 100%);mask:radial-gradient(circle 80px at var(--bx,50%) var(--by,50%),#000 55%,transparent 100%)}\n  .uvl .rows{padding:20px 18px 16px}\n  .uvl .row .t{position:absolute;inset:0;display:flex;align-items:center;white-space:nowrap;font:700 13.5px/1 Sarabun,Prompt;color:#ff7ab2;text-shadow:0 0 6px rgba(255,80,160,.95),0 0 18px rgba(190,90,255,.8)}\n  .uvl .row .t.dim{color:rgba(225,210,255,.55);text-shadow:none;font-weight:400}\n  .uvl .row.h .t{font:700 19px/1 Prompt}\n  .beam{position:absolute;z-index:6;width:240px;height:240px;margin:-120px 0 0 -120px;border-radius:50%;pointer-events:none;opacity:var(--uo,0);\n        background:radial-gradient(circle,rgba(176,107,255,.38),rgba(120,60,255,.14) 40%,transparent 70%);mix-blend-mode:screen;left:var(--bx,50%);top:var(--by,50%)}\n  .torch{position:absolute;z-index:7;left:var(--bx,50%);top:var(--by,50%);width:120px;height:26px;margin:46px 0 0 30px;transform:rotate(-35deg);transform-origin:0 50%;opacity:var(--uo,0);pointer-events:none}\n  /* หน้าการ์ดผลตรวจ */\n  .row .card{position:absolute;left:-6px;right:-6px;top:-8px;bottom:-8px;display:flex;align-items:center;gap:10px;padding:0 12px 0 16px;border-radius:14px;background:#17181d;border:1px solid rgba(255,255,255,.08);\n       box-shadow:0 14px 30px -14px rgba(0,0,0,.9),0 0 30px -8px var(--c);opacity:var(--co,0);overflow:hidden}\n  .row .card::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}\n  .row .card i{flex:none;width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 10px var(--c)}\n  .row .card b{flex:1;min-width:0;font:700 14px/1.2 Prompt;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .row .card em{flex:none;padding:3px 8px;border-radius:99px;background:color-mix(in srgb,var(--c) 22%,transparent);color:var(--c);font:700 10.5px/1.3 Prompt;font-style:normal}\n  .row .card em.u{background:rgba(176,107,255,.2);color:#d6b4ff}\n  /* ---------- UV v2 ---------- */\n  .beam,.torch{display:none}\n  .uvl{-webkit-mask:radial-gradient(ellipse 96px 62px at var(--bx,50%) var(--by,50%),#000 50%,transparent 100%);mask:radial-gradient(ellipse 96px 62px at var(--bx,50%) var(--by,50%),#000 50%,transparent 100%)}\n  .uvs{position:absolute;left:0;top:0;z-index:7;overflow:visible;pointer-events:none;opacity:var(--uo,0)}\n  .uvs .scr{mix-blend-mode:screen}\n  .row.hid .uvt{opacity:var(--io,1)}\n  .uvt .ch{display:inline-block;white-space:pre;opacity:0;will-change:opacity,filter}\n  .uvtag{position:absolute;right:-6px;top:-13px;z-index:3;padding:3px 8px;border-radius:99px;background:#ff3d8b;color:#fff;font:700 10px/1 Prompt;white-space:nowrap;\n         box-shadow:0 0 14px rgba(255,61,139,.85);opacity:calc(var(--tg,0) * var(--io,1));transform:translateY(calc((1 - var(--tg,0)) * 8px)) scale(calc(.6 + .4 * var(--tg,0)));pointer-events:none}\n  .uvring{position:absolute;left:-8px;right:-8px;top:2px;bottom:2px;z-index:2;border:1.5px solid #ff6fb0;border-radius:10px;pointer-events:none;\n          box-shadow:0 0 12px rgba(255,80,170,.6),inset 0 0 10px rgba(255,80,170,.25);opacity:calc(var(--rg,0) * var(--io,1));clip-path:inset(0 calc((1 - var(--rg,0)) * 100%) 0 0 round 10px)}\n  .uvc{position:absolute;left:50%;z-index:22;top:calc(var(--art-head,56px) + 2.5vh + 44px);transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:6px 12px 6px 8px;border-radius:99px;\n       background:rgba(20,8,36,.7);border:1px solid rgba(214,180,255,.35);color:#e9d8ff;font:600 12.5px/1 Prompt;opacity:var(--co2,0);pointer-events:none;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}\n  .uvc i{display:flex;gap:4px}.uvc i b{width:8px;height:8px;border-radius:50%;background:rgba(214,180,255,.25);transition:background .25s,box-shadow .25s}\n  .uvc i b.on{background:#ff6fb0;box-shadow:0 0 8px #ff6fb0}\n  .uvc span b{color:#fff}\n  /* v8: ลำแสงโคมไฟ */\n  .shaft{position:absolute;inset:0;z-index:14;pointer-events:none;opacity:var(--sh,0);mix-blend-mode:screen}\n  /* v8: ลายเซ็น */\n  .row.sig .ink .sg{position:relative}\n  .row.sig .ink .sg svg{position:absolute;left:4%;bottom:-2px;width:92%;height:24px;overflow:visible}\n  .row.sig .ink .sg path{fill:none;stroke:#1f3a8a;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}\n  .row.sig .ink .gap{flex:none;width:14px}\n  .row.sig .ink .wt{position:absolute;left:0;right:0;bottom:3px;text-align:center;font:600 9.5px/1 Prompt;color:#c08a1e;opacity:var(--wt,0);animation:vcblink 1.4s ease-in-out infinite}\n  @keyframes vcblink{50%{opacity:calc(var(--wt,0) * .35)}}\n  .row.sig .ink i.me{position:relative;border-bottom-color:#d9a54a}\n  /* v8: การ์ดพลิก */\n  .row .card{transform:perspective(700px) translateY(var(--lift,0px)) translateX(calc((1 - var(--cp,1)) * 40px)) scale(calc((.86 + .14 * var(--cp,1)) * var(--lsc,1))) rotateX(var(--frot,0deg));cursor:pointer}\n  .row .card .fr{display:flex;align-items:center;gap:10px;flex:1;min-width:0}\n  .row .card .bkf{display:none;flex:1;min-width:0;flex-direction:column;justify-content:center;gap:3px}\n  .row .card .bkf small{font:700 9.5px/1 Prompt;letter-spacing:.12em;color:#3be0c0}\n  .row .card .bkf span{font:600 12px/1.3 Prompt;color:#eafff9;white-space:normal}\n  .row .card.bk-on .fr{display:none}.row .card.bk-on .bkf{display:flex}\n  .row .card.bk-on{background:linear-gradient(135deg,rgba(12,52,48,.82),rgba(14,24,28,.75))}\n  .flh{display:block;margin:0 0 10px;text-align:center;font:500 12.5px/1 Prompt;color:#bfe9df;opacity:.9}\n  .flh b{display:inline-block;animation:vctap 1.6s ease-in-out infinite}\n  @keyframes vctap{50%{transform:translateY(-3px)}}\n  /* v7: ไฟฉายเปิด */\n  .uvs{opacity:var(--to,0)}\n  #uled{opacity:var(--led,0)}\n  #ucone,#uspot{opacity:var(--bk,0)}\n  /* v7: กระดาษม้วน + ฉีก */\n  .curl{position:absolute;right:0;bottom:0;z-index:4;width:var(--cs,0px);height:var(--cs,0px);pointer-events:none;opacity:var(--pa,1);\n        background:linear-gradient(315deg,transparent 49%,#d8ccb0 50%,#efe5cf 62%,#fffaf0 78%,#e2d6bb 100%);border-radius:0 0 6px 0;\n        box-shadow:-10px -10px 18px -6px rgba(0,0,0,.45);filter:brightness(calc(1 - var(--pd,0)))}\n  .curl::before{content:\"\";position:absolute;inset:0;background:linear-gradient(315deg,#0b0710 0 49%,transparent 50%)}\n  .row .strip{position:absolute;left:-18px;right:-18px;top:-1px;bottom:-1px;z-index:-1;background:var(--paper);opacity:var(--sb,0);\n              box-shadow:0 18px 30px -12px rgba(0,0,0,.7);filter:brightness(calc(1 - var(--pd,0)))}\n  .row .strip::after{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 40px,rgba(120,100,70,.05) 40px 41px)}\n  .scraps{position:absolute;left:50%;top:50%;z-index:9;pointer-events:none}\n  .scraps i{position:absolute;width:var(--w);height:var(--h);margin:calc(var(--h) / -2) 0 0 calc(var(--w) / -2);background:#efe6d2;box-shadow:0 4px 8px rgba(0,0,0,.4);opacity:var(--sco,0);\n            clip-path:polygon(0 10%,40% 0,100% 20%,85% 100%,20% 90%);filter:brightness(calc(1 - var(--pd,0)))}\n  /* v7: การ์ดกระจกเรืองแสง */\n  @property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}\n  @keyframes vcspin{to{--ang:360deg}}\n  .row .card{background:linear-gradient(135deg,rgba(40,38,52,.72),rgba(18,18,24,.62));-webkit-backdrop-filter:blur(10px) saturate(1.3);backdrop-filter:blur(10px) saturate(1.3);\n             border:1px solid rgba(255,255,255,.14);pointer-events:auto;cursor:default;transition:box-shadow .25s;\n             transform:translateY(var(--lift,0px)) translateX(calc((1 - var(--cp,1)) * 40px)) scale(calc((.86 + .14 * var(--cp,1)) * var(--lsc,1)))}\n  .row .card::after{content:\"\";position:absolute;inset:0;border-radius:inherit;padding:1.5px;pointer-events:none;\n             background:conic-gradient(from var(--ang),transparent 0 55%,var(--c) 75%,#fff 80%,var(--c) 85%,transparent 100%);\n             -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);\n             animation:vcspin 3.6s linear infinite;opacity:.9}\n  .row:nth-child(odd) .card::after{animation-duration:4.4s;animation-direction:reverse}\n  .row .card b{text-shadow:0 1px 0 rgba(0,0,0,.5)}\n  .row .card .gl{position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.14),transparent 38%);}\n  .row .card:hover,.row .card:active{--lift:-4px;--lsc:1.02;box-shadow:0 22px 40px -14px rgba(0,0,0,.95),0 0 40px -6px var(--c)}\n  /* v7: รุ่งเช้า + ปุ่มเงาวิ่ง */\n  .dawn{position:absolute;inset:0;z-index:18;pointer-events:none;opacity:var(--dw,0);mix-blend-mode:screen;\n        background:radial-gradient(120% 70% at 15% -10%,rgba(255,196,120,.45),rgba(255,150,80,.12) 45%,transparent 70%),linear-gradient(180deg,rgba(255,200,140,.08),transparent 40%)}\n  .end a.go{position:relative;overflow:hidden}\n  .end a.go::after{content:\"\";position:absolute;top:-20%;bottom:-20%;left:-40%;width:30%;transform:skewX(-20deg);\n        background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);animation:vcsheen 2.8s ease-in-out infinite}\n  @keyframes vcsheen{0%,55%{left:-40%}100%{left:130%}}\n  .end a.go{animation:vcpulse 2.8s ease-in-out infinite}\n  @keyframes vcpulse{0%,100%{box-shadow:0 14px 34px -12px rgba(34,195,230,.85)}50%{box-shadow:0 14px 44px -8px rgba(34,195,230,1),0 0 0 4px rgba(59,224,192,.15)}}\n  /* v9: ปุ่มเสียง — แผ่นเสียง + คลื่นเสียง + กระจกฝ้าขอบทอง */\n  .snd{gap:9px;padding:5px 14px 5px 5px;border:1px solid rgba(246,223,166,.38);color:#f6dfa6;font:600 12.5px/1 Prompt;\n       background:linear-gradient(135deg,rgba(255,240,200,.16),rgba(255,255,255,.04) 60%);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);\n       box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.25),0 10px 26px -10px rgba(0,0,0,.8);transition:border-color .3s,box-shadow .3s,padding .3s}\n  .snd.on{border-color:rgba(246,214,140,.85);padding-right:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 10px 26px -10px rgba(0,0,0,.8),0 0 22px -4px rgba(246,196,100,.7)}\n  .snd::before,.snd::after{content:\"\";position:absolute;inset:-1px;border-radius:inherit;border:1.5px solid rgba(246,210,140,.7);opacity:0;pointer-events:none}\n  .snd.on::before{animation:sndr 2.6s ease-out infinite}.snd.on::after{animation:sndr 2.6s 1.3s ease-out infinite}\n  @keyframes sndr{0%{opacity:.75;transform:scale(1)}100%{opacity:0;transform:scale(1.45,1.9)}}\n  .snd .vw{position:relative;flex:none;width:32px;height:32px}\n  .snd .vin{position:absolute;inset:0;border-radius:50%;animation:vspin 2.4s linear infinite;animation-play-state:paused;\n       background:radial-gradient(circle,transparent 30%,rgba(255,255,255,.05) 31% 32%,transparent 33% 45%,rgba(255,255,255,.06) 46% 47%,transparent 48% 60%,rgba(255,255,255,.05) 61% 62%,transparent 63%),\n                  conic-gradient(from 30deg,#151515,#2b2b2b 12%,#111 25%,#151515 50%,#2b2b2b 62%,#111 75%,#151515);\n       box-shadow:0 0 0 1.5px rgba(246,223,166,.55),0 3px 8px rgba(0,0,0,.6)}\n  .snd .vin i{position:absolute;left:50%;top:50%;width:13px;height:13px;margin:-6.5px;border-radius:50%;display:grid;place-items:center;\n       background:radial-gradient(circle at 35% 30%,#ffe9a8,#d9a54a 60%,#9a6d22)}\n  .snd .vin i svg{width:9px;height:9px}\n  .snd .vin i::after{content:\"\";position:absolute;width:2px;height:2px;border-radius:50%;background:#1a1206}\n  .snd.on .vin{animation-play-state:running}\n  .snd .arm{position:absolute;right:-5px;top:-4px;width:3px;height:21px;border-radius:2px;transform-origin:50% 2px;transform:rotate(-8deg);transition:transform .6s cubic-bezier(.3,1.4,.5,1);\n       background:linear-gradient(90deg,#fff1c4,#c8933a);box-shadow:1px 1px 2px rgba(0,0,0,.6)}\n  .snd .arm::before{content:\"\";position:absolute;left:-2px;top:-2px;width:7px;height:7px;border-radius:50%;background:#e8c27a;box-shadow:0 1px 2px rgba(0,0,0,.5)}\n  .snd .arm::after{content:\"\";position:absolute;left:-1px;bottom:-3px;width:5px;height:6px;border-radius:1px;background:#3a2a10}\n  .snd.on .arm{transform:rotate(26deg)}\n  .snd .eq{display:flex;align-items:flex-end;gap:2.5px;height:16px}\n  .snd .eq i{width:3px;height:100%;border-radius:2px;background:linear-gradient(#fff6d6,#d9a54a);transform-origin:50% 100%;transform:scaleY(.16);transition:transform .08s linear;opacity:.85}\n  .snd .tx{max-width:40px;overflow:hidden;white-space:nowrap;transition:max-width .35s,opacity .3s}\n  .snd.on .tx{max-width:0;opacity:0}\n  .stip{position:absolute;left:12px;bottom:calc(108px + var(--vh-nav,0px) + env(safe-area-inset-bottom));z-index:51;padding:9px 13px;border-radius:14px;\n        background:linear-gradient(135deg,rgb(40,30,14),rgb(24,18,10));border:1px solid rgba(246,214,140,.55);color:#fbe9bd;font:600 12.5px/1 Prompt;white-space:nowrap;\n        -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 10px 26px -8px rgba(0,0,0,.8),0 0 18px -6px rgba(246,196,100,.6);\n        opacity:0;transform:translateY(8px) scale(.94);transform-origin:20px 100%;transition:opacity .35s,transform .45s cubic-bezier(.3,1.5,.5,1);pointer-events:none}\n  .stip::after{content:\"\";position:absolute;z-index:-1;left:18px;bottom:-6px;width:10px;height:10px;transform:rotate(45deg);background:rgb(36,27,13);border-right:1px solid rgba(246,214,140,.55);border-bottom:1px solid rgba(246,214,140,.55)}\n  .stip.show{opacity:1;transform:none}\n  @keyframes vspin{to{transform:rotate(360deg)}}\n  /* ข้อ 1: เขียนตัวเอง */\n  .row .ink{clip-path:inset(-6px calc(100% - var(--wx,4000px)) -6px -6px)}\n  .row .ink .tx{display:inline-flex;align-items:center;gap:8px}\n  .nib{position:absolute;z-index:8;left:0;top:0;width:58px;height:14px;margin:-12px 0 0 -2px;transform-origin:2px 12px;pointer-events:none;opacity:var(--no,0);\n       transform:translate(var(--nx,0px),var(--ny,0px)) rotate(-38deg) translateY(var(--nw,0px));filter:drop-shadow(3px 6px 4px rgba(0,0,0,.45))}\n  /* ข้อ 3: ตราประทับ */\n  .stamp{position:absolute;z-index:9;left:50%;top:46%;width:min(66%,300px);padding:12px 10px 10px;border:5px solid #e8263d;border-radius:14px;text-align:center;color:#ff3348;pointer-events:none;\n         font:800 clamp(22px,7vw,34px)/1.05 Prompt;letter-spacing:.02em;background:rgba(232,38,61,.06);\n         box-shadow:0 0 0 3px rgba(232,38,61,.25) inset,0 0 26px rgba(255,40,70,.55);text-shadow:0 0 14px rgba(255,40,70,.8);\n         opacity:var(--so,0);transform:translate(-50%,-50%) rotate(-11deg) scale(var(--ss,1));\n         -webkit-mask:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.75) 61%,#000 70%);mask:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.75) 61%,#000 70%)}\n  .stamp small{display:block;margin-top:6px;font:700 10.5px/1 Prompt;letter-spacing:.3em;opacity:.85}\n  .splat{position:absolute;z-index:8;left:50%;top:46%;width:2px;height:2px;pointer-events:none;opacity:var(--sp,0)}\n  .splat i{position:absolute;border-radius:50%;background:#e8263d;box-shadow:0 0 10px rgba(255,40,70,.7);transform:translate(calc(var(--dx) * var(--sr,0)),calc(var(--dy) * var(--sr,0)))}\n  .shock{position:absolute;z-index:8;left:50%;top:46%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid rgba(255,70,90,.8);pointer-events:none;\n         opacity:var(--ko,0);transform:scale(var(--ks,1))}\n  /* ข้อ 4: การ์ดเด้ง + ตัวนับ */\n  .row .card{transform:translateX(calc((1 - var(--cp,1)) * 40px)) scale(calc(.86 + .14 * var(--cp,1)))}\n  .rh .money{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:6px 12px;border-radius:99px;background:rgba(255,77,94,.12);border:1px solid rgba(255,77,94,.35);color:#ffb3bb;font:600 12.5px/1 Prompt}\n  .rh .money b{color:#fff;font-weight:800}\n  .rh h2 em .n{display:inline-block;min-width:.6em;transform:scale(var(--nb,1))}\n  /* ข้อ 6: ข้าม / ดูอีกรอบ */\n  .skip{position:absolute;right:12px;bottom:calc(12px + var(--vh-nav,0px) + env(safe-area-inset-bottom));z-index:50;padding:8px 14px;border-radius:99px;border:1px solid rgba(255,255,255,.22);background:rgba(0,0,0,.55);color:#f3dcae;\n        font:600 12px/1 Prompt;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);cursor:pointer;transition:opacity .3s,transform .3s}\n  .skip.off{opacity:0;transform:translateY(10px);pointer-events:none}\n  .end .again{display:flex;align-items:center;justify-content:center;gap:6px;margin:10px auto 0;padding:8px 14px;border:0;background:none;color:#9a9aa3;font:500 13px/1 Prompt;cursor:pointer}\n  .end .again:hover{color:#f3dcae}\n  :host(.playing) .skip{opacity:0;pointer-events:none}\n  /* ---------- ข้อความนำ + ผลสรุป ---------- */\n  .cap{position:absolute;left:0;right:0;z-index:21;pointer-events:none;text-align:center}\n  .cap p{position:absolute;left:0;right:0;margin:0 auto;max-width:360px;padding:0 20px;font:600 15px/1.5 Prompt;color:#fff;text-shadow:0 2px 12px #000;opacity:0;transform:translateY(10px);transition:opacity .4s,transform .4s}\n  .cap p.on{opacity:1;transform:none}.cap p b{color:#f6dfa6}.cap p .u{color:#d6b4ff}\n  .cap.top{top:calc(var(--art-head,56px) + 2.5vh)}.cap.bot{bottom:calc(5vh + env(safe-area-inset-bottom))}\n  .cap.bot p{bottom:0}\n  .rh{position:absolute;left:0;right:0;z-index:21;text-align:center;opacity:var(--ro,0);transform:translateY(calc((1 - var(--ro,0)) * 16px));pointer-events:none}\n  .rh small{display:block;font:600 11.5px/1 Prompt;letter-spacing:.3em;color:#9a9aa3}\n  .rh h2{margin:8px 0 0;font:800 26px/1.2 Prompt}.rh h2 em{font-style:normal;color:#ff7a86}\n  .rh p{margin:6px 0 0;font:400 13px/1.5 Prompt;color:#c9b8ff}\n  .end{position:absolute;left:50%;z-index:21;width:min(90vw,470px);transform:translate(-50%,calc((1 - var(--eo,0)) * 30px));opacity:var(--eo,0);pointer-events:var(--ep,none)}\n  .end a.go{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;border-radius:16px;background:linear-gradient(135deg,#3be0c0,#22c3e6);color:#04201c;font:800 16px/1 Prompt;text-decoration:none;box-shadow:0 14px 34px -12px rgba(34,195,230,.85)}\n  .end a.paste{display:block;margin-top:8px;padding:14px 16px;border-radius:16px;border:1.5px dashed rgba(255,255,255,.25);color:#a1a1aa;font:400 14px/1 Prompt;text-decoration:none}\n  .prog{position:absolute;right:10px;top:50%;z-index:50;width:3px;height:120px;margin-top:-60px;border-radius:2px;background:rgba(255,255,255,.12)}\n  .prog i{position:absolute;left:0;right:0;top:0;height:calc(var(--pp,0) * 100%);border-radius:2px;background:linear-gradient(#f6dfa6,#b06bff,#ff4d5e)}\n\n  .prog{top:calc(50% + 20px)}\n  :host(.vh-tight) .end a.paste,:host(.vh-tight) .end .note2{display:none}\n  :host(.vh-tight) .end .again{margin-top:6px}\n  .skip{left:50%;right:auto;transform:translateX(-50%)}.skip.off{transform:translate(-50%,10px)}\n  .end .more{display:flex;justify-content:center;gap:14px;margin-top:4px;font:500 12.5px/1 Prompt}\n  .end .more a{color:#bfb6a3;text-decoration:none;border-bottom:1px dashed rgba(191,182,163,.4);padding-bottom:2px}\n  .end .note2{margin:10px 0 0;text-align:center;font:400 11px/1.5 Prompt;color:#7d7a74}\n  @media (max-height:700px){.end .again{margin-top:4px}.flh{margin-bottom:6px}}\n";
  var HTML = "<section class=\"hx\" id=\"hx\">\n<div class=\"stage\" id=\"st\">\n<div class=\"prog\" id=\"prog\"><i></i></div>\n<button type=\"button\" class=\"snd\" id=\"snd\" aria-pressed=\"false\" aria-label=\"เปิดเสียงประกอบ\"><span class=\"vw\"><span class=\"vin\"><i><svg viewBox=\"0 0 64 64\" aria-hidden=\"true\"><path d=\"M32 6L53 14V32C53 45 44 53 32 58C20 53 11 45 11 32V14Z\" fill=\"#2a1d08\"/><path d=\"M22 32L29 39L43 24\" stroke=\"#fff3c8\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg></i></span><span class=\"arm\"></span></span><span class=\"eq\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i></span><span class=\"tx\">เสียง</span></button>\n<div class=\"stip\" id=\"stip\" role=\"status\">🎧 ฟังพร้อมเสียงดีกว่านะ</div>\n<button type=\"button\" class=\"skip off\" id=\"skip\">ข้ามไปตรวจเลย ↓</button>\n\n  <div class=\"cam\" id=\"cam\">\n  <div class=\"L desk\" data-k=\".35\"><svg class=\"grain\" aria-hidden=\"true\"><defs><pattern id=\"wg\" width=\"420\" height=\"160\" patternUnits=\"userSpaceOnUse\">\n      <path d=\"M0 20 C80 14 140 30 220 22 S360 12 420 20\" stroke=\"rgba(30,15,5,.28)\" stroke-width=\"2\" fill=\"none\"/>\n      <path d=\"M0 52 C60 46 150 62 230 54 S350 44 420 52\" stroke=\"rgba(255,220,180,.06)\" stroke-width=\"3\" fill=\"none\"/>\n      <path d=\"M0 86 C90 80 160 98 250 88 S370 78 420 86\" stroke=\"rgba(30,15,5,.22)\" stroke-width=\"1.6\" fill=\"none\"/>\n      <ellipse cx=\"300\" cy=\"120\" rx=\"26\" ry=\"7\" fill=\"none\" stroke=\"rgba(30,15,5,.3)\" stroke-width=\"2\"/><ellipse cx=\"300\" cy=\"120\" rx=\"14\" ry=\"3.5\" fill=\"none\" stroke=\"rgba(30,15,5,.25)\" stroke-width=\"1.5\"/>\n      <path d=\"M0 132 C100 126 200 112 274 118 M326 120 C360 124 400 136 420 132\" stroke=\"rgba(30,15,5,.22)\" stroke-width=\"1.6\" fill=\"none\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#wg)\"/></svg></div>\n  <div class=\"L pool\" id=\"pool\" data-k=\".5\" data-x=\"-.18\" data-y=\"-.16\"></div>\n\n  <!-- กองกระดาษใต้สัญญา -->\n  <div class=\"L obj\" data-k=\".9\" data-x=\".04\" data-y=\".03\" data-w=\"min(50vw,270px)\" data-r=\"7\" style=\"z-index:3\">\n    <svg viewBox=\"0 0 100 135\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"135\" rx=\"1.5\" fill=\"#e6dcc5\"/><path d=\"M8 14h60M8 22h80M8 30h72M8 38h80M8 46h50\" stroke=\"#cfc3a8\" stroke-width=\"1.6\"/></svg></div>\n  <div class=\"L obj\" data-k=\".95\" data-x=\"-.03\" data-y=\".02\" data-w=\"min(50vw,270px)\" data-r=\"-5\" style=\"z-index:4\">\n    <svg viewBox=\"0 0 100 135\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"135\" rx=\"1.5\" fill=\"#efe6d2\"/><path d=\"M8 14h70M8 22h80M8 30h64M8 38h80\" stroke=\"#d6cbb2\" stroke-width=\"1.6\"/></svg></div>\n\n  <!-- โคมไฟ -->\n  <div class=\"L obj near\" data-k=\"2.2\" data-x=\"-.42\" data-y=\"-.36\" data-w=\"44vmin\" style=\"z-index:12\">\n    <svg viewBox=\"0 0 200 200\"><defs>\n      <radialGradient id=\"lb\"><stop offset=\"0\" stop-color=\"#fffbea\"/><stop offset=\".3\" stop-color=\"#ffe199\"/><stop offset=\".7\" stop-color=\"#ffb347\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#ffb347\" stop-opacity=\"0\"/></radialGradient>\n      <radialGradient id=\"ls\" cx=\".35\" cy=\".3\"><stop offset=\"0\" stop-color=\"#3f7564\"/><stop offset=\".7\" stop-color=\"#1f3b33\"/><stop offset=\"1\" stop-color=\"#132620\"/></radialGradient>\n      <linearGradient id=\"la\" x1=\"0\" x2=\"1\"><stop offset=\"0\" stop-color=\"#4a4a4a\"/><stop offset=\".5\" stop-color=\"#8a8a8a\"/><stop offset=\"1\" stop-color=\"#3a3a3a\"/></linearGradient></defs>\n      <path d=\"M100 100 L172 40 L196 52\" stroke=\"url(#la)\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n      <circle cx=\"172\" cy=\"40\" r=\"7\" fill=\"#9a9a9a\"/><circle cx=\"196\" cy=\"52\" r=\"16\" fill=\"#222\"/><circle cx=\"196\" cy=\"52\" r=\"10\" fill=\"#333\"/>\n      <circle cx=\"100\" cy=\"100\" r=\"64\" fill=\"url(#ls)\"/><circle cx=\"100\" cy=\"100\" r=\"64\" fill=\"none\" stroke=\"#c9a24b\" stroke-width=\"3\"/>\n      <path d=\"M58 72a50 50 0 0 1 40-24\" stroke=\"rgba(255,255,255,.35)\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/>\n      <circle cx=\"100\" cy=\"100\" r=\"46\" fill=\"#0f1f1a\"/><circle class=\"bulb\" cx=\"100\" cy=\"100\" r=\"46\" fill=\"url(#lb)\"/><circle class=\"bulb\" cx=\"100\" cy=\"100\" r=\"15\" fill=\"#fffdf2\"/></svg></div>\n  <!-- แก้วกาแฟ -->\n  <div class=\"L obj near\" data-k=\"1.6\" data-x=\".36\" data-y=\".33\" data-w=\"34vmin\" style=\"z-index:12\">\n    <svg viewBox=\"0 0 200 200\"><defs><radialGradient id=\"cf\" cx=\".45\" cy=\".42\"><stop offset=\"0\" stop-color=\"#7a4a24\"/><stop offset=\".7\" stop-color=\"#4a2a12\"/><stop offset=\"1\" stop-color=\"#2e190a\"/></radialGradient>\n      <radialGradient id=\"sc\" cx=\".4\" cy=\".35\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\"1\" stop-color=\"#d8d1c4\"/></radialGradient></defs>\n      <circle cx=\"100\" cy=\"100\" r=\"94\" fill=\"url(#sc)\"/><circle cx=\"100\" cy=\"100\" r=\"80\" fill=\"none\" stroke=\"#c9c1b3\" stroke-width=\"2\"/>\n      <rect x=\"148\" y=\"86\" width=\"50\" height=\"28\" rx=\"14\" fill=\"#f2ede4\" stroke=\"#d3cbbd\" stroke-width=\"2\"/><circle cx=\"100\" cy=\"100\" r=\"64\" fill=\"#fbf8f2\" stroke=\"#ddd5c7\" stroke-width=\"2\"/>\n      <circle cx=\"100\" cy=\"100\" r=\"54\" fill=\"url(#cf)\"/><circle cx=\"100\" cy=\"100\" r=\"54\" fill=\"none\" stroke=\"#c99a62\" stroke-width=\"4\" opacity=\".55\"/>\n      <path d=\"M84 104c-8-14 6-28 18-22 12 6 20-4 14-14\" stroke=\"#e8c28e\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\" opacity=\".75\"/>\n      <ellipse cx=\"80\" cy=\"80\" rx=\"12\" ry=\"6\" fill=\"#fff\" opacity=\".25\" transform=\"rotate(-35 80 80)\"/>\n      <g class=\"steam\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"7\" stroke-linecap=\"round\"><path d=\"M88 96c-10-14 10-22 0-38\"/><path d=\"M110 98c-10-16 12-24 2-44\"/></g></svg></div>\n  <!-- แว่นตา -->\n  <div class=\"L obj near\" data-k=\"1.35\" data-x=\"-.36\" data-y=\".34\" data-w=\"40vmin\" data-r=\"-18\" style=\"z-index:12\">\n    <svg viewBox=\"0 0 220 90\"><defs><linearGradient id=\"gl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"rgba(200,230,255,.38)\"/><stop offset=\".5\" stop-color=\"rgba(120,160,200,.12)\"/><stop offset=\"1\" stop-color=\"rgba(255,220,170,.28)\"/></linearGradient></defs>\n      <g fill=\"url(#gl)\" stroke=\"#161616\" stroke-width=\"7\"><ellipse cx=\"55\" cy=\"48\" rx=\"44\" ry=\"34\"/><ellipse cx=\"165\" cy=\"48\" rx=\"44\" ry=\"34\"/></g>\n      <path d=\"M99 40c6-8 16-8 22 0\" stroke=\"#161616\" stroke-width=\"7\" fill=\"none\"/><path d=\"M12 36 0 4M208 36l12-32\" stroke=\"#161616\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n      <path d=\"M26 34c8-8 22-12 32-10M136 34c8-8 22-12 32-10\" stroke=\"#fff\" stroke-width=\"5\" opacity=\".6\" fill=\"none\" stroke-linecap=\"round\"/>\n      <path d=\"M70 70l14-14M180 70l14-14\" stroke=\"#fff\" stroke-width=\"3\" opacity=\".35\" stroke-linecap=\"round\"/></svg></div>\n  <!-- ปากกาหมึกซึม -->\n  <div class=\"L obj\" data-k=\"1.25\" data-x=\".43\" data-y=\"-.06\" data-w=\"52vmin\" data-r=\"-62\" style=\"z-index:12\">\n    <svg viewBox=\"0 0 260 30\"><defs><linearGradient id=\"pb\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3a3a3a\"/><stop offset=\".35\" stop-color=\"#111\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient>\n      <linearGradient id=\"pg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffe6a3\"/><stop offset=\".5\" stop-color=\"#d9a54a\"/><stop offset=\"1\" stop-color=\"#8a6420\"/></linearGradient></defs>\n      <rect x=\"0\" y=\"5\" width=\"150\" height=\"20\" rx=\"10\" fill=\"url(#pb)\"/><rect x=\"150\" y=\"6\" width=\"58\" height=\"18\" rx=\"8\" fill=\"url(#pb)\"/>\n      <rect x=\"146\" y=\"5\" width=\"8\" height=\"20\" fill=\"url(#pg)\"/><path d=\"M208 7 L258 15 L208 23Z\" fill=\"url(#pg)\"/><path d=\"M214 15h36\" stroke=\"#5a4210\" stroke-width=\"1.5\"/>\n      <rect x=\"20\" y=\"1\" width=\"80\" height=\"5\" rx=\"2.5\" fill=\"url(#pg)\"/><path d=\"M8 10h130\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".28\" stroke-linecap=\"round\"/></svg></div>\n  <!-- ต้นไม้ -->\n  <div class=\"L obj near\" data-k=\"2.6\" data-x=\".46\" data-y=\"-.44\" data-w=\"52vmin\" style=\"z-index:13\">\n    <svg viewBox=\"0 0 200 200\"><defs><linearGradient id=\"lf\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4f9a66\"/><stop offset=\"1\" stop-color=\"#215c3a\"/></linearGradient></defs>\n      <circle cx=\"100\" cy=\"100\" r=\"42\" fill=\"#b9643f\"/><circle cx=\"100\" cy=\"100\" r=\"35\" fill=\"#3a2a1f\"/>\n      <g id=\"lv\"><path d=\"M100 100 C78 70 82 20 100 -2 C118 20 122 70 100 100Z\" fill=\"url(#lf)\" stroke=\"#1d4a2f\" stroke-width=\"2\"/><path d=\"M100 96 V4\" stroke=\"#8fd1a3\" stroke-width=\"2\" opacity=\".6\"/>\n        <path d=\"M100 70 l-12-10M100 50 l-10-9M100 70 l12-10M100 50 l10-9M100 30 l-8-7M100 30 l8-7\" stroke=\"#8fd1a3\" stroke-width=\"1.5\" opacity=\".45\"/></g>\n      <use href=\"#lv\" transform=\"rotate(72 100 100)\"/><use href=\"#lv\" transform=\"rotate(144 100 100)\"/><use href=\"#lv\" transform=\"rotate(216 100 100)\"/><use href=\"#lv\" transform=\"rotate(288 100 100)\"/>\n      <g opacity=\".9\" transform=\"scale(.7) translate(43 43)\"><use href=\"#lv\" transform=\"rotate(36 100 100)\"/><use href=\"#lv\" transform=\"rotate(180 100 100)\"/><use href=\"#lv\" transform=\"rotate(252 100 100)\"/></g></svg></div>\n  <!-- โทรศัพท์ -->\n  <div class=\"L obj\" data-k=\"1.1\" data-x=\"-.44\" data-y=\".02\" data-w=\"24vmin\" data-r=\"12\" style=\"z-index:11\">\n    <svg viewBox=\"0 0 100 200\"><defs><linearGradient id=\"ps\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#18263d\"/><stop offset=\"1\" stop-color=\"#0b111c\"/></linearGradient></defs>\n      <rect x=\"2\" y=\"2\" width=\"96\" height=\"196\" rx=\"16\" fill=\"#0f0f12\" stroke=\"#3a3a42\" stroke-width=\"3\"/><rect x=\"9\" y=\"12\" width=\"82\" height=\"176\" rx=\"9\" fill=\"url(#ps)\"/>\n      <text x=\"50\" y=\"34\" text-anchor=\"middle\" font-family=\"Prompt\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\" opacity=\".85\">22:41</text>\n      <rect x=\"15\" y=\"44\" width=\"70\" height=\"32\" rx=\"8\" fill=\"#06c755\"/><rect x=\"21\" y=\"52\" width=\"40\" height=\"5\" rx=\"2.5\" fill=\"#fff\"/><rect x=\"21\" y=\"61\" width=\"52\" height=\"4\" rx=\"2\" fill=\"#fff\" opacity=\".75\"/>\n      <rect x=\"15\" y=\"82\" width=\"70\" height=\"24\" rx=\"7\" fill=\"#25324a\"/><rect x=\"21\" y=\"90\" width=\"44\" height=\"4\" rx=\"2\" fill=\"#9fb3d1\"/>\n      <path d=\"M20 16 L80 40\" stroke=\"#fff\" stroke-width=\"10\" opacity=\".05\"/></svg></div>\n  <!-- โน้ตกระดาษ -->\n  <div class=\"L obj\" data-k=\"1.45\" data-x=\".33\" data-y=\".14\" data-w=\"27vmin\" data-r=\"9\" style=\"z-index:12\">\n    <div class=\"note\">อย่าลืม!<br>อ่านทุกบรรทัด<br>ก่อนเซ็น ✍️</div></div>\n\n  <svg class=\"shaft\" id=\"shaft\" aria-hidden=\"true\"><defs>\n    <linearGradient id=\"gsh\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#fff0c8\" stop-opacity=\".95\"/><stop offset=\".5\" stop-color=\"#ffc066\" stop-opacity=\".38\"/><stop offset=\"1\" stop-color=\"#ff9a3c\" stop-opacity=\"0\"/></linearGradient>\n    <filter id=\"fsh\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\"><feGaussianBlur stdDeviation=\"10\"/></filter></defs>\n    <path id=\"shp\" fill=\"url(#gsh)\" filter=\"url(#fsh)\"/><g id=\"shd\"></g></svg>\n  <div class=\"dark\" id=\"dk\"></div>\n  <div class=\"flash\" id=\"flash\"></div>\n\n  <!-- สัญญาหลัก -->\n  <div class=\"L cw\" id=\"cw\">\n    <div class=\"paper\" id=\"pp\"></div>\n    <div class=\"rows\" id=\"rows\"></div>\n    <div class=\"curl\" id=\"curl\"></div>\n    <div class=\"scraps\" id=\"scraps\"></div>\n    <div class=\"uvl\" id=\"uvl\"><div class=\"rows\" id=\"urows\"></div></div>\n    <div class=\"beam\" id=\"beam\"></div>\n    <svg class=\"uvs\" id=\"uvs\" aria-hidden=\"true\"><defs>\n      <linearGradient id=\"gcone\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#e7c9ff\" stop-opacity=\".75\"/><stop offset=\".25\" stop-color=\"#b06bff\" stop-opacity=\".38\"/><stop offset=\"1\" stop-color=\"#7a3cff\" stop-opacity=\".16\"/></linearGradient>\n      <radialGradient id=\"gspot\"><stop offset=\"0\" stop-color=\"#f1dcff\" stop-opacity=\".55\"/><stop offset=\".45\" stop-color=\"#b06bff\" stop-opacity=\".35\"/><stop offset=\".8\" stop-color=\"#7a3cff\" stop-opacity=\".12\"/><stop offset=\"1\" stop-color=\"#7a3cff\" stop-opacity=\"0\"/></radialGradient>\n      <radialGradient id=\"gled\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".95\"/><stop offset=\".25\" stop-color=\"#d6b4ff\" stop-opacity=\".8\"/><stop offset=\"1\" stop-color=\"#8a4dff\" stop-opacity=\"0\"/></radialGradient>\n      <linearGradient id=\"gbody\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4258\"/><stop offset=\".45\" stop-color=\"#221d2c\"/><stop offset=\"1\" stop-color=\"#110e17\"/></linearGradient>\n      <linearGradient id=\"gmet\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f2f2f6\"/><stop offset=\".4\" stop-color=\"#9a9aa6\"/><stop offset=\".7\" stop-color=\"#5a5a66\"/><stop offset=\"1\" stop-color=\"#2a2a33\"/></linearGradient>\n      <filter id=\"fblur\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"6\"/></filter></defs>\n      <path id=\"ucone\" class=\"scr\" fill=\"url(#gcone)\" filter=\"url(#fblur)\"/>\n      <ellipse id=\"uspot\" class=\"scr\" fill=\"url(#gspot)\"/>\n      <g id=\"udust\" class=\"scr\"></g>\n      <g id=\"utorch\" filter=\"drop-shadow(6px 10px 8px rgba(0,0,0,.6))\">\n        <circle id=\"uled\" cx=\"4\" cy=\"0\" r=\"40\" fill=\"url(#gled)\" class=\"scr\"/>\n        <rect x=\"-128\" y=\"-9\" width=\"10\" height=\"18\" rx=\"3\" fill=\"#3a3046\"/>\n        <rect x=\"-120\" y=\"-11\" width=\"86\" height=\"22\" rx=\"6\" fill=\"url(#gbody)\"/>\n        <path d=\"M-112 -11v22M-106 -11v22M-100 -11v22M-94 -11v22M-88 -11v22\" stroke=\"#000\" stroke-opacity=\".45\" stroke-width=\"2\"/>\n        <rect x=\"-74\" y=\"-15\" width=\"16\" height=\"5\" rx=\"2\" fill=\"#b06bff\"/><rect x=\"-72\" y=\"-14\" width=\"6\" height=\"2\" rx=\"1\" fill=\"#e9d8ff\"/>\n        <path d=\"M-36 -11 L-8 -17 L0 -17 L0 17 L-8 17 L-36 11Z\" fill=\"url(#gmet)\"/>\n        <path d=\"M-30 -10 L-8 -15\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".55\" stroke-linecap=\"round\"/>\n        <rect x=\"-2\" y=\"-18\" width=\"5\" height=\"36\" rx=\"2\" fill=\"#c9c9d2\"/>\n        <ellipse cx=\"3\" cy=\"0\" rx=\"4\" ry=\"15\" fill=\"#5a4a6e\"/><g style=\"opacity:var(--led,0)\"><ellipse cx=\"3\" cy=\"0\" rx=\"4\" ry=\"15\" fill=\"#e8d2ff\"/><ellipse cx=\"3\" cy=\"0\" rx=\"2.2\" ry=\"10\" fill=\"#fff\"/></g>\n      </g></svg>\n    <svg class=\"nib\" viewBox=\"0 0 58 14\" aria-hidden=\"true\"><defs><linearGradient id=\"ng\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffe6a3\"/><stop offset=\".5\" stop-color=\"#d9a54a\"/><stop offset=\"1\" stop-color=\"#8a6420\"/></linearGradient></defs>\n      <path d=\"M0 12 L16 5 L16 13Z\" fill=\"url(#ng)\"/><path d=\"M2 12 L13 8\" stroke=\"#5a4210\" stroke-width=\"1\"/><rect x=\"16\" y=\"3\" width=\"42\" height=\"11\" rx=\"5\" fill=\"#111\"/><rect x=\"16\" y=\"3\" width=\"4\" height=\"11\" fill=\"url(#ng)\"/><path d=\"M22 5h32\" stroke=\"#fff\" stroke-width=\"1.5\" opacity=\".25\"/></svg>\n    <div class=\"shock\" id=\"shock\"></div>\n    <div class=\"splat\" id=\"splat\"></div>\n    <div class=\"stamp\" id=\"stamp\">พบความเสี่ยง<small>VELLUM CHECK</small></div>\n    <svg class=\"torch\" viewBox=\"0 0 120 26\" aria-hidden=\"true\"><rect x=\"22\" y=\"3\" width=\"98\" height=\"20\" rx=\"6\" fill=\"#2a2433\"/><rect x=\"0\" y=\"0\" width=\"26\" height=\"26\" rx=\"5\" fill=\"#3a3046\"/><rect x=\"2\" y=\"4\" width=\"6\" height=\"18\" rx=\"2\" fill=\"#c08bff\"/></svg>\n  </div>\n\n  </div>\n  <canvas class=\"dust\" id=\"dust\"></canvas>\n  <div class=\"vig\"></div>\n  <div class=\"dawn\" id=\"dawn\"></div>\n\n  <h1 class=\"ttl\" id=\"ttl\" aria-label=\"อ่านให้ครบ ก่อนเซ็น\"><small>AI CONTRACT REVIEW</small><span class=\"l1\">อ่านให้ครบ</span><span class=\"l2\">ก่อนเซ็น</span></h1>\n  <div class=\"hint\" id=\"hint\">เลื่อนลงเพื่อเริ่มอ่าน<span class=\"sc\"></span></div>\n\n  <div class=\"cap top\"><p data-c=\"1\">สัญญาฉบับนี้ <b>ดูปกติ</b>…</p><p data-c=\"2\">ส่องด้วย <span class=\"u\">แสง UV</span> ดูสิ 🔦</p><p data-c=\"3\">เจอ<span class=\"u\">ข้อความที่ซ่อนอยู่</span> 3 จุด</p></div>\n  <div class=\"uvc\" id=\"uvc\"><i><b></b><b></b><b></b></i><span>พบแล้ว <b id=\"uvn\">0</b>/3</span></div>\n  <div class=\"rh\" id=\"rh\"><small>RESULT</small><h2>พบ <em><span class=\"n\" id=\"cnt\">0</span> จุดเสี่ยง</em></h2><p>3 จุดซ่อนอยู่ในตัวหนังสือที่มองข้ามได้ง่าย</p><span class=\"money\">💸 เสี่ยงเสียเงินอย่างน้อย <b id=\"money\">0</b> บาท</span></div>\n  <div class=\"end\" id=\"end\"><span class=\"flh\">แตะการ์ดเพื่อดูวิธีแก้ <b>👆</b></span><a class=\"go\" href=\"/#checkCard\">ตรวจสัญญาของคุณ →</a><a class=\"paste\" href=\"/#checkCard\">หรือวางสัญญาตรงนี้…</a><button type=\"button\" class=\"again\" id=\"again\">↺ ดูอีกรอบ</button><div class=\"more\"><a href=\"#manifesto\">ดูวิธีอ่าน</a><a href=\"#introVideo\">ดูคลิปแนะนำ</a></div><p class=\"note2\">เครื่องมือคัดกรองเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย · ตัวอย่างนี้เป็นข้อมูลสมมติ</p></div>\n</div>\n</section>";
  function mount() {
    var main = document.querySelector('main'), old = document.querySelector('main > .hero');
    if (!main || !document.body.attachShadow) return;
    var host = document.createElement('section'); host.className = 'vch'; host.id = 'vch'; host.setAttribute('data-v', 'home'); host.setAttribute('aria-label', 'Vellum Check · อ่านให้ครบ ก่อนเซ็น');
    if (old) main.insertBefore(host, old); else main.insertBefore(host, main.firstChild);
    var SR = host.attachShadow({ mode: 'open' });
    SR.innerHTML = '<style>' + CSS + '</style>' + HTML;
    var gs = document.createElement('style'); gs.textContent =
      'html.vch-on main > .hero{display:none !important}' +
      'main > .vch{grid-area:hero !important;grid-column:1 / -1;width:100% !important;max-width:none !important;margin:0 !important;justify-self:stretch !important}' +
      'body.has-nav .vch{--vh-nav:64px}' +
      'html.vc-spa:not([data-view="home"]) .vch{display:none !important}' +
      '@media (max-width:767px){html.vch-on .vch{height:100svh}}';
    document.head.appendChild(gs);
    document.documentElement.classList.add('vch-on');
    /* ลิงก์ในฉาก (#checkCard ฯลฯ): ส่งต่อให้ระบบสลับหน้าของเว็บ (hash) */
    SR.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"], a[href^="/#"]'); if (!a) return;
      e.preventDefault(); var h = a.getAttribute('href').replace(/^\//, ''); if (location.hash === h) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = h;
    });
    run(host, SR);
  }
  function run(host, SR) {
  /* ---------- ข้อมูลแถวในสัญญา (ข้อมูลสมมติ) ----------
     k: s=ปกติ  r=เสี่ยงที่มองเห็น  h=หมึกล่องหน (เห็นเมื่อส่อง UV) */
  var ROWS = [
    { k: 's', cls: 'h', t: 'สัญญาเช่าห้องพัก' },
    { k: 's', t: 'ข้อ 1 ผู้ให้เช่าตกลงให้ นายตัวอย่าง นามสมมติ เช่าห้อง 000' },
    { k: 's', t: 'ข้อ 2 ค่าเช่าเดือนละ <b>8,500 บาท</b> ชำระทุกวันที่ 1' },
    { k: 'h', t: '* ผู้ให้เช่าปรับค่าเช่าได้ตลอดเวลา โดยไม่ต้องแจ้ง', c: 'var(--hi)', card: 'ขึ้นค่าเช่าได้ตลอดเวลา', tag: 'ซ่อนอยู่', fix: 'ขอให้แจ้งล่วงหน้า 30 วัน และขึ้นได้ไม่เกินปีละครั้ง' },
    { k: 'r', t: 'ข้อ 3 เงินประกัน 17,000 บาท หักได้ตามที่เห็นสมควร', c: 'var(--hi)', card: 'หักเงินประกันตามใจ', tag: 'เงินประกัน', fix: 'ขอให้ระบุรายการที่หักได้ และแนบใบเสร็จทุกครั้ง' },
    { k: 'r', t: 'ข้อ 4 ชำระล่าช้า ปรับวันละ <b>300 บาท</b>', c: 'var(--md)', card: 'ค่าปรับวันละ 300 บาท', tag: 'ค่าปรับ', fix: 'ต่อรองเหลือวันละ 50 บาท หรือกำหนดเพดานสูงสุด' },
    { k: 'h', t: '* ยกเลิกก่อนกำหนด ยึดเงินประกันทั้งหมดทุกกรณี', c: 'var(--hi)', card: 'ยกเลิก = เสียเงินประกันหมด', tag: 'ซ่อนอยู่', fix: 'ขอคืนเงินประกันบางส่วน ถ้าแจ้งล่วงหน้า 30 วัน' },
    { k: 's', t: 'ข้อ 5 ห้ามนำสัตว์เลี้ยงเข้ามาในห้อง' },
    { k: 'h', t: '* ต่ออายุอัตโนมัติ หากไม่แจ้งล่วงหน้า 90 วัน', c: 'var(--md)', card: 'ต่อสัญญาเองอัตโนมัติ', tag: 'ซ่อนอยู่', fix: 'ให้ต่ออายุเมื่อทั้งสองฝ่ายยืนยันเป็นหนังสือเท่านั้น' },
    { k: 's', cls: 'sig', t: 'ลงชื่อ<i class="sg"><svg viewBox="0 0 120 30" preserveAspectRatio="none"><path id="sgp" d="M4 22C9 8 17 3 16 16 15 27 23 12 29 14 34 16 31 24 37 21 43 17 45 7 50 11 55 16 51 25 58 21 64 17 69 11 74 17 78 23 85 11 91 14 97 17 103 18 116 7M30 26C50 23 76 24 104 22"/></svg></i>ผู้ให้เช่า<b class="gap"></b>ลงชื่อ<i class="me"><em class="wt">รอคุณอ่านก่อนเซ็น…</em></i>ผู้เช่า' }
  ];
  var rowsEl = SR.getElementById('rows'), urows = SR.getElementById('urows');
  ROWS.forEach(function (r, i) {
    var d = document.createElement('div'); d.className = 'row ' + (r.cls || '') + (r.k === 'h' ? ' hid rk' : r.k === 'r' ? ' rk' : '');
    if (r.c) d.style.setProperty('--c', r.c);
    d.innerHTML = '<span class="ink">' + (r.cls === 'sig' ? r.t : '<span class="tx">' + r.t + '</span>') + (r.k === 'r' ? '<span class="mk"></span>' : '') + '</span>' + (r.k === 'h' ? '<span class="uvt">' + r.t + '</span>' : '') +
      (r.card ? '<span class="card"><span class="fr"><i></i><b>' + r.card + '</b><em class="' + (r.k === 'h' ? 'u' : '') + '">' + r.tag + '</em></span><span class="bkf"><small>✍ วิธีแก้</small><span>' + r.fix + '</span></span></span>' : '');
    rowsEl.appendChild(d);
    var u = document.createElement('div'); u.className = 'row ' + (r.cls || '');
    u.innerHTML = '<span class="t dim">' + r.t.replace(/<em[^>]*>.*?<\/em>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ') + '</span>';
    urows.appendChild(u);
  });
  var rowEls = [].slice.call(rowsEl.children);
  (function () { var sp = SR.getElementById('splat'), h = '', s2 = 3; function r2() { s2 = (s2 * 9301 + 49297) % 233280; return s2 / 233280; }
    for (var i = 0; i < 16; i++) { var a = r2() * 6.28, d = 60 + r2() * 110, z = 3 + r2() * 9; h += '<i style="width:' + z + 'px;height:' + z + 'px;margin:' + (-z / 2) + 'px;--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d * .8).toFixed(0) + 'px"></i>'; }
    sp.innerHTML = h; })();
  /* แตกหมึกล่องหนเป็นตัวอักษร (รวมสระ/วรรณยุกต์ไทยเข้ากับตัวหน้า) */
  function graph(t) {
    if (window.Intl && Intl.Segmenter) return Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(t), function (x) { return x.segment; });
    return t.match(/.[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]*/g) || [t];
  }
  var hidCh = [], hk = 0;
  rowEls.forEach(function (r, i) {
    if (ROWS[i].k !== 'h') return; hk++;
    var uv = r.querySelector('.uvt'); uv.innerHTML = graph(ROWS[i].t).map(function (g) { return '<span class="ch">' + g + '</span>'; }).join('');
    hidCh[i] = [].slice.call(uv.children);
    r.insertAdjacentHTML('beforeend', '<span class="uvring"></span><span class="uvtag">⚠ ซ่อน #' + hk + '</span>');
  });
  var uvs = SR.getElementById('uvs'), ucone = SR.getElementById('ucone'), uspot = SR.getElementById('uspot'), utorch = SR.getElementById('utorch'), udust = SR.getElementById('udust'), gcone = SR.getElementById('gcone');
  var uvc = SR.getElementById('uvc'), uvn = SR.getElementById('uvn'), uvDots = [].slice.call(uvc.querySelectorAll('i b'));
  (function () { var h = ''; for (var i = 0; i < 18; i++) h += '<circle r="' + (0.7 + (i % 3) * .5) + '" fill="#f3e6ff"/>'; udust.innerHTML = h; })();
  var BG = { on: 0, hx: 0, hy: 0, bx: 0, by: 0 }, chX = [];
  var s3 = 21; function r3() { s3 = (s3 * 9301 + 49297) % 233280; return s3 / 233280; }
  function torn() { var top = [], bot = [], n = 18, i; for (i = 0; i <= n; i++) { top.push((i / n * 100).toFixed(1) + '% ' + (r3() * 9).toFixed(1) + '%'); bot.push(((n - i) / n * 100).toFixed(1) + '% ' + (91 + r3() * 9).toFixed(1) + '%'); } return 'polygon(' + top.concat(bot).join(',') + ')'; }
  rowEls.forEach(function (r) { var sp = document.createElement('span'); sp.className = 'strip'; sp.style.clipPath = torn(); r.insertBefore(sp, r.firstChild);
    var c = r.querySelector('.card'); if (c) c.insertAdjacentHTML('afterbegin', '<span class="gl"></span>'); });
  var scrapsEl = SR.getElementById('scraps'), SCR = [];
  for (var si = 0; si < 16; si++) { var a3 = r3() * 6.28, d3 = 160 + r3() * 260; SCR.push({ x: Math.cos(a3) * d3, y: Math.sin(a3) * d3 * .9, r: (r3() - .5) * 720, z: r3() });
    scrapsEl.insertAdjacentHTML('beforeend', '<i style="--w:' + (6 + r3() * 12).toFixed(0) + 'px;--h:' + (4 + r3() * 9).toFixed(0) + 'px"></i>'); }
  var scrEls = [].slice.call(scrapsEl.children), curlEl = SR.getElementById('curl'), dawnEl = SR.getElementById('dawn');
  var sgp = SR.getElementById('sgp'), sgLen = sgp.getTotalLength(), sgI = sgp.closest('i'), sigRow = sgp.closest('.row');
  sgp.style.strokeDasharray = sgLen; sgp.style.strokeDashoffset = sgLen;
  /* การ์ดพลิกดูวิธีแก้ */
  function flip(c) {
    if (c._fl) return; c._fl = 1; var t0 = performance.now(), sw = false, back = !c.classList.contains('bk-on');
    (function st2(now) { var k = cl((now - t0) / 520), a = io(k) * 180;
      if (!sw && a >= 90) { sw = true; c.classList.toggle('bk-on', back); }
      c.style.setProperty('--frot', (a < 90 ? a : a - 180).toFixed(1) + 'deg');
      if (k < 1) requestAnimationFrame(st2); else { c.style.setProperty('--frot', '0deg'); c._fl = 0; } })(t0);
    if (sOn) tick2(2);
  }
  [].slice.call(SR.querySelectorAll('.row .card')).forEach(function (c) { c.addEventListener('click', function () { autoFl = true; flip(c); }); });
  var autoFl = false;
  /* ลำแสงโคมไฟ */
  var shaft = SR.getElementById('shaft'), shp = SR.getElementById('shp'), gsh = SR.getElementById('gsh'), shd = SR.getElementById('shd');
  (function () { var h = ''; for (var i = 0; i < 26; i++) h += '<circle r="' + (0.8 + (i % 3) * .6) + '" fill="#fff1d6"/>'; shd.innerHTML = h; })();
  var SH = { lx: 0, ly: 0, ex: 0, ey: 0, w: 0, on: 0 };
  function shaftGeom() {
    SH.lx = W * .08; SH.ly = H * .14; SH.ex = W * .56; SH.ey = H * .6; SH.w = Math.min(W, H) * .42;
    shaft.setAttribute('viewBox', '0 0 ' + W + ' ' + H); shaft.setAttribute('width', W); shaft.setAttribute('height', H);
    var dx = SH.ex - SH.lx, dy = SH.ey - SH.ly, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    shp.setAttribute('d', 'M' + (SH.lx + nx * 18) + ' ' + (SH.ly + ny * 18) + 'L' + (SH.ex + nx * SH.w) + ' ' + (SH.ey + ny * SH.w) + 'Q' + (SH.ex + dx / L * SH.w * .5) + ' ' + (SH.ey + dy / L * SH.w * .5) + ' ' + (SH.ex - nx * SH.w) + ' ' + (SH.ey - ny * SH.w) + 'L' + (SH.lx - nx * 18) + ' ' + (SH.ly - ny * 18) + 'Z');
    gsh.setAttribute('x1', SH.lx); gsh.setAttribute('y1', SH.ly); gsh.setAttribute('x2', SH.ex + dx / L * SH.w * .4); gsh.setAttribute('y2', SH.ey + dy / L * SH.w * .4);
  }
  var nib = SR.querySelector('.nib'), stampEl = SR.getElementById('stamp'), cntEl = SR.getElementById('cnt'), moneyEl = SR.getElementById('money');
  var risky = rowEls.map(function (e, i) { return ROWS[i].card ? i : -1; }).filter(function (i) { return i > -1; });
  var hiddenIdx = rowEls.map(function (e, i) { return ROWS[i].k === 'h' ? i : -1; }).filter(function (i) { return i > -1; });

  /* สุ่มทิศทางการกระจายแบบคงที่ */
  var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var fly = ROWS.map(function () { return { x: (rnd() - .5) * 900, y: (rnd() - .5) * 700, z: -400 - rnd() * 900, rx: (rnd() - .5) * 120, rz: (rnd() - .5) * 70 }; });

  var cam = SR.getElementById('cam'), lampL = 1;
  var canBlur = (navigator.hardwareConcurrency || 4) >= 6 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- เสียง (ปิดไว้ก่อน ต้องกดเปิดเอง) ---------- */
  var AC = null, sOn = false, lastL = 1, uvDone = false, sb = SR.getElementById('snd');
  var eqI = [].slice.call(sb.querySelectorAll('.eq i')), stip = SR.getElementById('stip'), eqBuf = null;
  function sbUI() { sb.classList.toggle('on', sOn); sb.setAttribute('aria-pressed', String(sOn)); sb.setAttribute('aria-label', sOn ? 'ปิดเสียงประกอบ' : 'เปิดเสียงประกอบ'); if (sOn) tipOff(); }
  /* คลื่นเสียงเต้นตามเพลงจริง (AnalyserNode) */
  function eqTick() {
    if (!MU || !MU.on || !MU.an) { if (eqI[0]._v !== 0) { eqI.forEach(function (e) { e.style.transform = ''; }); eqI[0]._v = 0; } return; }
    if (!eqBuf) eqBuf = new Uint8Array(MU.an.frequencyBinCount); MU.an.getByteFrequencyData(eqBuf);
    var B = [[1, 3], [3, 6], [6, 12], [12, 24], [24, 48]];
    eqI.forEach(function (e, k) { var a = 0; for (var j = B[k][0]; j < B[k][1]; j++) a += eqBuf[j]; a /= (B[k][1] - B[k][0]) * 255; e.style.transform = 'scaleY(' + Math.max(.16, Math.min(1, a * 1.9)).toFixed(2) + ')'; });
    eqI[0]._v = 1;
  }
  /* ป้ายชวนเปิดเสียง (ครั้งแรกเท่านั้น) */
  var tipT = 0;
  function tipOff() { if (stip.classList.contains('show')) stip.classList.remove('show'); clearTimeout(tipT); }
  try { if (!localStorage.getItem('vc_hero_sndtip')) { localStorage.setItem('vc_hero_sndtip', '1'); setTimeout(function () { if (!sOn && (lastP < .02)) { stip.classList.add('show'); tipT = setTimeout(tipOff, 4200); } }, 1400); } } catch (e) {}
  function ensureAC() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); }
  sb.addEventListener('click', function () {
    sOn = !sOn; sbUI(); try { localStorage.setItem('vc_hero_snd', sOn ? '1' : '0'); } catch (e) {}
    if (sOn) { ensureAC(); musicOn(); } else musicOff();
  });
  /* จำค่าเปิดเสียงไว้ แต่เบราว์เซอร์ให้เริ่มเสียงได้หลังผู้ใช้แตะจอครั้งแรกเท่านั้น */
  try { if (localStorage.getItem('vc_hero_snd') === '1') { sOn = true; sbUI(); } } catch (e) {}
  function gest() { if (sOn && !(MU && MU.on)) { ensureAC(); musicOn(); } }
  ['pointerdown', 'keydown', 'touchend'].forEach(function (e) { addEventListener(e, gest, { passive: true }); });

  /* ---------- ดนตรีประกอบ (สร้างด้วยโค้ดทั้งหมด ไม่มีไฟล์เพลง ไม่มีลิขสิทธิ์) ----------
     4 ชั้นเสียงที่ค่อย ๆ ผสมตามเรื่อง: warm (โต๊ะทำงาน) · dark (ไฟดับ/UV) · tension (กำลังส่อง) · resolve (ผลตรวจ/รุ่งเช้า) */
  var MU = null;
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function musicBuild() {
    var A = AC, out = A.createGain(); out.gain.value = 0;
    var comp = A.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; out.connect(comp); comp.connect(A.destination);
    var rv = A.createConvolver(), len = A.sampleRate * 3.2, ir = A.createBuffer(2, len, A.sampleRate);
    for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rv.buffer = ir; var rvG = A.createGain(); rvG.gain.value = .55; rv.connect(rvG); rvG.connect(out);
    function bus() { var g = A.createGain(); g.gain.value = 0; g.connect(out); var s2 = A.createGain(); s2.gain.value = .6; g.connect(s2); s2.connect(rv); return g; }
    var an = A.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .7; comp.connect(an);
    var M = { an: an, out: out, rv: rv, warm: bus(), dark: bus(), ten: bus(), res: bus(), on: false, next: 0, step: 0, bellT: 0, beatT: 0, mix: { w: 1, d: 0, t: 0, r: 0 } };
    /* เสียงห้องเงียบ ๆ (noise กรองต่ำ) */
    var nb = A.createBuffer(1, A.sampleRate * 2, A.sampleRate), nd = nb.getChannelData(0); for (var j = 0; j < nd.length; j++) nd[j] = Math.random() * 2 - 1;
    var ns = A.createBufferSource(); ns.buffer = nb; ns.loop = true; var nf = A.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 420; var ng = A.createGain(); ng.gain.value = .05;
    ns.connect(nf); nf.connect(ng); ng.connect(M.warm); ns.start();
    /* โดรนลึกลับ: saw 2 ตัวเพี้ยนกันนิด ผ่าน lowpass ที่เปิดกว้างขึ้นตามการส่อง */
    M.df = A.createBiquadFilter(); M.df.type = 'lowpass'; M.df.frequency.value = 260; M.df.Q.value = 6; var dg = A.createGain(); dg.gain.value = .11; M.df.connect(dg); dg.connect(M.dark);
    [45, 45.08, 52].forEach(function (m, k) { var o = A.createOscillator(); o.type = k === 2 ? 'triangle' : 'sawtooth'; o.frequency.value = hz(m); o.connect(M.df); o.start(); });
    var lfo = A.createOscillator(), lg = A.createGain(); lfo.frequency.value = .13; lg.gain.value = 120; lfo.connect(lg); lg.connect(M.df.frequency); lfo.start();
    /* แพดสว่าง (F add9) สำหรับตอนจบ */
    [53, 60, 64, 67, 69].forEach(function (m, k) { var o = A.createOscillator(), g = A.createGain(); o.type = 'sine'; o.frequency.value = hz(m); o.detune.value = (k - 2) * 4; g.gain.value = .045; o.connect(g); g.connect(M.res); o.start(); });
    return M;
  }
  function pluck(bus, f, t, dur, g, type) {
    var A = AC, o = A.createOscillator(), o2 = A.createOscillator(), e = A.createGain(), lp = A.createBiquadFilter();
    o.type = type || 'triangle'; o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 2.001;
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(Math.min(6000, f * 6), t); lp.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.2), t + dur);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + .012); e.gain.exponentialRampToValueAtTime(.0008, t + dur);
    var e2 = A.createGain(); e2.gain.value = .25; o.connect(lp); o2.connect(e2); e2.connect(lp); lp.connect(e); e.connect(bus);
    o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
  }
  function kick(bus, t, g) {
    var A = AC, o = A.createOscillator(), e = A.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(38, t + .22);
    e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(e); e.connect(bus); o.start(t); o.stop(t + .32);
  }
  /* คอร์ดอุ่น ๆ ช่วงโต๊ะทำงาน (Cmaj7 · Am7 · Fmaj7 · G6) และคอร์ดสว่างช่วงจบ (F · C/E · Dm9 · Bb6) */
  var WARM = [[60, 64, 67, 71, 74], [57, 60, 64, 67, 72], [53, 57, 60, 64, 69], [55, 59, 62, 64, 67]];
  var BRIGHT = [[65, 69, 72, 76, 79], [64, 67, 72, 76, 79], [62, 65, 69, 72, 76], [58, 62, 65, 67, 70]];
  var BELL = [81, 84, 86, 88, 91, 93];
  function sched() {
    if (!MU || !MU.on || AC.state !== 'running') return;
    var now = AC.currentTime, x = MU.mix;
    while (MU.next < now + .25) {
      var t = MU.next, br = x.r > x.w, set = br ? BRIGHT : WARM, ch = set[Math.floor(MU.step / 8) % 4], k = MU.step % 8;
      var idx = [0, 2, 1, 3, 4, 3, 1, 2][k], vel = (k === 0 ? .16 : .1) * (.85 + Math.random() * .3);
      if (x.w > .02 && !br) pluck(MU.warm, hz(ch[idx]), t, 1.6, vel);
      if (br && x.r > .02 && k % 2 === 0) pluck(MU.res, hz(ch[idx] + (k === 0 ? -12 : 0)), t, 2.4, vel * .9, 'sine');
      if (k === 0 && (x.w > .02 || x.r > .02)) pluck(br ? MU.res : MU.warm, hz(ch[0] - 24), t, 2.8, .09, 'sine');
      MU.step++; MU.next += br ? .42 : .36;
    }
    if (x.d > .05 && now > MU.bellT) { MU.bellT = now + 1.6 + Math.random() * 1.8; pluck(MU.dark, hz(BELL[Math.floor(Math.random() * BELL.length)]), now + .05, 3.5, .07, 'sine'); }
    if (x.t > .05 && now > MU.beatT) { var bpm = 60 + x.t * 40; kick(MU.ten, now + .02, .5); kick(MU.ten, now + .3, .3); MU.beatT = now + 60 / bpm; }
  }
  function musicOn() {
    if (!AC) return; if (!MU) MU = musicBuild(); if (MU.on) return;
    MU.on = true; MU.next = AC.currentTime + .1; MU.out.gain.cancelScheduledValues(AC.currentTime); MU.out.gain.setTargetAtTime(.55, AC.currentTime, .6);
    if (!MU.iv) MU.iv = setInterval(sched, 90);
    musicMix(lastP < 0 ? 0 : lastP);
  }
  function musicOff() { if (!MU || !MU.on) return; MU.on = false; MU.out.gain.setTargetAtTime(0, AC.currentTime, .25); }
  function musicMix(p) {
    if (!MU || !MU.on) return;
    var w = 1 - seg(p, .25, .33), d = seg(p, .27, .34) * (1 - seg(p, .62, .72)), t = seg(p, .4, .5) * (1 - seg(p, .56, .62)), r = seg(p, .8, .9);
    MU.mix = { w: w, d: d, t: t, r: r }; var n = AC.currentTime;
    MU.warm.gain.setTargetAtTime(w * .9, n, .3); MU.dark.gain.setTargetAtTime(d, n, .4); MU.ten.gain.setTargetAtTime(t * .7, n, .2); MU.res.gain.setTargetAtTime(r * .9, n, .5);
    MU.df.frequency.setTargetAtTime(220 + seg(p, .36, .58) * 900, n, .3);
  }
  /* หยุดเสียงเมื่อหน้าปกถูกซ่อน / สลับแท็บ */
  function musicIdle(h) { if (!AC) return; if (h) { if (AC.state === 'running') AC.suspend(); } else if (sOn && MU && MU.on && AC.state === 'suspended') AC.resume(); }
  document.addEventListener('visibilitychange', function () { musicIdle(document.hidden); });
  function click() {
    if (!AC) return; var n = AC.createBufferSource(), b = AC.createBuffer(1, AC.sampleRate * .03, AC.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; var g = AC.createGain(); g.gain.value = .5;
    n.buffer = b; n.connect(f); f.connect(g); g.connect(AC.destination); n.start();
  }
  function hum() {
    if (!AC) return; var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = 'sine';
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(140, t + .35);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .05); g.gain.exponentialRampToValueAtTime(.001, t + .6);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .65);
  }
  function thump() {
    if (!AC) return; var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = 'triangle';
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + .25);
    g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .4); click();
  }
  function tear() {
    if (!AC) return; var n = AC.createBufferSource(), b = AC.createBuffer(1, AC.sampleRate * .45, AC.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) { var x = i / d.length; d[i] = (Math.random() * 2 - 1) * (Math.random() < .3 ? 1 : .3) * Math.pow(1 - x, 1.5); }
    var f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1400; var g = AC.createGain(); g.gain.value = .35; n.buffer = b; n.connect(f); f.connect(g); g.connect(AC.destination); n.start();
  }
  function tick2(i) {
    if (!AC) return; var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = 'sine'; o.frequency.value = 660 + i * 90;
    g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .14);
  }
  var stDone = false, lastCnt = 0, lastLed = 0, tearDone = false;
  function sfx(Lv, p) {
    musicMix(p); if (p > .03) tipOff();
    if (sOn && !stDone && p > .615 && p < .68) { thump(); stDone = true; } if (p < .6) stDone = false;
    if (sOn && Math.abs(Lv - lastL) > .4) click();
    if (sOn && !uvDone && p > .335 && p < .4) { hum(); uvDone = true; }
    if (p < .3) uvDone = false;
    lastL = Lv;
  }
  var R = host, hx = SR.getElementById('hx'), st = SR.getElementById('st'), cw = SR.getElementById('cw');
  var objs = [].slice.call(SR.querySelectorAll('.L[data-k]'));
  var ttl = SR.getElementById('ttl'), caps = [].slice.call(SR.querySelectorAll('.cap p')), prog = SR.getElementById('prog');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function io(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sv(el, k, v) { el.style.setProperty(k, v); }

  /* วางของบนโต๊ะ: ตำแหน่ง/ขนาดจาก data-* */
  var W, H, vmin, cwW, cwH, rowY = [], tgt = [], txW = [];
  function layout() {
    W = st.clientWidth; H = st.clientHeight; vmin = Math.min(W, H);
    objs.forEach(function (o) { if (o.dataset.w) { o.style.width = o.dataset.w; } });
    cwW = cw.offsetWidth; cwH = rowsEl.offsetHeight; cw.style.height = cwH + 'px';
    rowY = rowEls.map(function (r) { return r.offsetTop; });
    shaftGeom();
    hiddenIdx.forEach(function (i) { chX[i] = hidCh[i].map(function (c) { return 18 + c.offsetLeft + c.offsetWidth / 2; }); });
    uvs.setAttribute('width', cwW); uvs.setAttribute('height', cwH); uvs.setAttribute('viewBox', '0 0 ' + cwW + ' ' + cwH);
    txW = rowEls.map(function (r) { var t = r.querySelector('.tx'); return t ? t.offsetWidth : r.offsetWidth; });
    /* ตำแหน่งการ์ดผลตรวจ: เรียงกลางจอ ใต้หัวข้อผลลัพธ์ */
    var hd = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--art-head')) || 56, rhT = Math.max(H * .1, hd + 14), nvH = parseFloat(getComputedStyle(host).getPropertyValue('--vh-nav')) || 0, gap = Math.min(62, (H * .42 - nvH) / risky.length), top0 = Math.max(H * .27, rhT + 150), cTop = (H - cwH) / 2;
    tgt = rowEls.map(function (r, i) { var k = risky.indexOf(i); return k < 0 ? null : (top0 + k * gap) - (cTop + rowY[i]); });
    SR.getElementById('rh').style.top = rhT + 'px'; host.classList.toggle('vh-tight', H - nvH < 760);
    SR.getElementById('end').style.top = (top0 + risky.length * gap + 18) + 'px';
  }

  var lastP = -1;
  function frame(p) {
    if (p === lastP) return; lastP = p;
    sv(prog, '--pp', p.toFixed(3));
    /* ---- ฉาก 1: โต๊ะทำงาน → กล้องดิ่งลงไปที่สัญญา (0 – .26) ---- */
    var d = io(seg(p, .04, .26));
    objs.forEach(function (o) {
      var k = +o.dataset.k, x = +(o.dataset.x || 0) * W, y = +(o.dataset.y || 0) * H, r = +(o.dataset.r || 0);
      var s = 1 + d * k * 2.4, w = o.offsetWidth, h = o.offsetHeight;
      o.style.transform = 'translate(' + (x * s - w / 2) + 'px,' + (y * s - h / 2) + 'px) rotate(' + r + 'deg) scale(' + s + ')';
      if (!o.classList.contains('desk') && !o.classList.contains('pool')) {
        o.style.opacity = 1 - seg(d, .55, .95);
        /* ระยะชัด: ของที่ใกล้กล้องเบลอเมื่อกล้องดิ่ง (เฉพาะเครื่องแรงพอ) */
        if (!canBlur) o.style.filter = 'drop-shadow(' + (22 * lampL + 4).toFixed(0) + 'px ' + (30 * lampL + 6).toFixed(0) + 'px 12px rgba(0,0,0,' + (.35 + .2 * lampL).toFixed(2) + '))';
        if (canBlur) { var bl = Math.min(7, (o.classList.contains('near') ? .5 : 0) * k + d * k * 2.2); o.style.filter = 'drop-shadow(' + (24 * lampL + 4).toFixed(0) + 'px ' + (34 * lampL + 6).toFixed(0) + 'px 14px rgba(0,0,0,' + (.35 + .25 * lampL).toFixed(2) + '))' + (bl > .2 ? ' blur(' + bl.toFixed(1) + 'px)' : ''); }
      }
    });
    var cs = lerp(.56, 1, d), crz = lerp(-4, 0, d);
    var ex = io(seg(p, .65, .81)); /* ฉาก 3 */
    cw.style.transform = 'translate(' + (-cwW / 2) + 'px,' + (-cwH / 2 + lerp(H * .1, 0, d)) + 'px) rotate(' + crz + 'deg) scale(' + cs + ')';
    var t1 = seg(p, 0, .12); sv(ttl, '--o1', 1 - t1); sv(ttl, '--ty', (-t1 * 40) + 'px'); sv(ttl, '--tb', (t1 * 8) + 'px'); sv(ttl, '--ts', 1 + t1 * .1);
    SR.getElementById('hint').style.opacity = 1 - seg(p, 0, .05);

    /* ---- ฉาก 2: ปิดไฟ ส่อง UV (.28 – .6) ---- */
    /* ไฟโคมกะพริบ 2 ครั้ง แล้วดับ */
    var lt = seg(p, .27, .33), Lv = lt <= 0 ? 1 : lt < .15 ? 1 : lt < .25 ? .12 : lt < .38 ? 1 : lt < .48 ? .08 : lt < .58 ? .7 : 0;
    var dawn = io(seg(p, .88, .98)); Lv = Math.max(Lv, dawn * .85); sv(st, '--dw', dawn.toFixed(3));
    SH.on = Lv * (1 - seg(d, .3, .8)); sv(cam, '--sh', SH.on.toFixed(3));
    if (!autoFl && p > .97) { autoFl = true; var c0 = rowEls[risky[0]].querySelector('.card'); setTimeout(function () { flip(c0); setTimeout(function () { if (c0.classList.contains('bk-on')) flip(c0); }, 2200); }, 500); }
    lampL = Lv; sv(cam, '--bo', (.2 + .8 * Lv).toFixed(3));
    var dk = (1 - Lv) * (1 - seg(p, .86, .95) * .2); sv(cam, '--dk', (dk * .9).toFixed(3));
    var fl = seg(p, .355, .365) * (1 - seg(p, .365, .39)); sv(cam, '--fl', fl.toFixed(3));
    sfx(Lv, p);
    /* v7: ไฟฉายเปิด: โผล่ → LED กะพริบ → ลำแสงยืดออก */
    var tIn = seg(p, .32, .335), uOff = 1 - seg(p, .56, .6), lf = seg(p, .335, .352);
    var led = lf <= 0 ? 0 : lf < .2 ? 1 : lf < .35 ? .1 : lf < .55 ? 1 : lf < .7 ? .25 : 1;
    var bk = io(seg(p, .35, .368)), uvOn = bk * uOff;
    sv(cw, '--to', (tIn * uOff).toFixed(3)); sv(cw, '--led', (led * uOff).toFixed(3)); sv(cw, '--bk', (bk * uOff).toFixed(3));
    if (sOn && led > .5 && lastLed <= .5) click(); lastLed = led;
    sv(cw, '--uo', uvOn.toFixed(3)); sv(cw, '--pu', (uvOn * .85).toFixed(3)); sv(cw, '--pd', (dk * (1 - uvOn) * .7 + uvOn * .62).toFixed(3));
    /* ลำแสงวิ่งซิกแซกผ่านแถวหมึกล่องหนทีละแถว */
    var u = seg(p, .36, .56), n = hiddenIdx.length, f = u * n, ri = Math.min(n - 1, Math.floor(f)), fr = f - ri, dir = ri % 2 ? -1 : 1;
    var ry = rowY[hiddenIdx[ri]] + 17 + 20, bx = cwW * (dir > 0 ? lerp(.08, .92, io(fr)) : lerp(.92, .08, io(fr)));
    if (u <= 0) { bx = cwW * .08; ry = rowY[hiddenIdx[0]] + 37; }
    sv(cw, '--bx', bx + 'px'); sv(cw, '--by', ry + 'px');
    /* หมึกซึมขึ้นทีละตัวตามจุดที่แสงผ่าน */
    var found = 0;
    hiddenIdx.forEach(function (i, k) {
      var r = rowEls[i], xs = chX[i], chs = hidCh[i], cur = (k === ri && u > 0 && u < 1), done = u >= 1 || k < ri || (k === ri && fr > .97);
      r.style.setProperty('--lit', (done || cur) ? 1 : 0);
      chs.forEach(function (c, j) {
        var q, age;
        if (done) { q = 1; age = 9; }
        else if (!cur) { q = 0; age = 0; }
        else { var pass = dir > 0 ? bx - xs[j] : xs[j] - bx; q = cl((pass + 30) / 70); age = cl(pass / 160); }
        var g = q * (1 + 1.1 * (1 - cl(age))), bl = (1 - q) * 4;
        c.style.opacity = q.toFixed(3);
        c.style.filter = q > 0 && q < 1 || age < 1 ? 'blur(' + bl.toFixed(1) + 'px) brightness(' + g.toFixed(2) + ')' : '';
      });
      var tg = done ? 1 : 0; if (done) found++;
      r.style.setProperty('--tg', tg); r.style.setProperty('--rg', done ? 1 : cur ? cl(fr * 1.05) : 0);
    });
    uvn.textContent = found; uvDots.forEach(function (d, k) { d.classList.toggle('on', k < found); });
    sv(uvc, '--co2', (seg(p, .35, .37) * (1 - seg(p, .57, .6))).toFixed(3));
    /* ไฟฉาย + ลำแสงกรวย */
    var hxp = Math.min(cwW - 24, cwW * .5 + (bx - cwW * .5) * .4 + 110), hyp = ry - 150 - Math.sin(fr * Math.PI) * 10;
    var ax = bx - hxp, ay = ry - hyp, al = Math.hypot(ax, ay), ux = ax / al, uy = ay / al, nx2 = -uy, ny2 = ux, RX = 96, RY = 62;
    var bkk = Math.max(.001, bk), ex2 = hxp + (bx - hxp) * bkk, ey2 = hyp + (ry - hyp) * bkk;
    var ew = (Math.abs(nx2) * RX + Math.abs(ny2) * RY) * (.25 + .75 * bkk);
    ucone.setAttribute('d', 'M' + (hxp + ux * 4 + nx2 * 11) + ' ' + (hyp + uy * 4 + ny2 * 11) + 'L' + (ex2 + nx2 * ew) + ' ' + (ey2 + ny2 * ew) + 'L' + (ex2 - nx2 * ew) + ' ' + (ey2 - ny2 * ew) + 'L' + (hxp + ux * 4 - nx2 * 11) + ' ' + (hyp + uy * 4 - ny2 * 11) + 'Z');
    gcone.setAttribute('x1', hxp); gcone.setAttribute('y1', hyp); gcone.setAttribute('x2', bx); gcone.setAttribute('y2', ry);
    uspot.setAttribute('cx', ex2); uspot.setAttribute('cy', ey2); uspot.setAttribute('rx', RX * bkk); uspot.setAttribute('ry', RY * bkk);
    utorch.setAttribute('transform', 'translate(' + hxp.toFixed(1) + ' ' + hyp.toFixed(1) + ') rotate(' + (Math.atan2(uy, ux) * 180 / Math.PI).toFixed(1) + ')');
    BG.on = uvOn; BG.hx = hxp; BG.hy = hyp; BG.bx = ex2; BG.by = ey2; BG.ew = ew;

    /* ---- ข้อ 1: ตัวหนังสือเขียนตัวเอง (.02 – .3) ---- */
    var wN = rowEls.length, wA = .02, wB = .245, wS = (wB - wA) / wN, wf = reduce ? 1 : seg(p, wA, wB) * wN, wi = Math.min(wN - 1, Math.floor(wf));
    rowEls.forEach(function (r, i) { var q = cl(wf - i); r.style.setProperty('--wx', q >= 1 ? '4000px' : (q * (txW[i] + 4)).toFixed(1) + 'px'); });
    var wq = cl(wf - wi), nx = 18 + wq * txW[wi], ny = 20 + rowY[wi] + 22;
    sv(cw, '--nx', nx.toFixed(1) + 'px'); sv(cw, '--ny', ny.toFixed(1) + 'px');
    sv(cw, '--nw', (Math.sin(wq * 60) * 2.2).toFixed(2) + 'px');
    /* v8: เซ็นชื่อฝั่งผู้ให้เช่า (.25 – .285) */
    var sgq = reduce ? 1 : io(seg(p, .25, .285)); sgp.style.strokeDashoffset = (sgLen * (1 - sgq)).toFixed(1);
    if (sgq > 0 && sgq < 1) {
      var pt = sgp.getPointAtLength(sgLen * sgq), sw = sgI.offsetWidth * .92 / 120, shh = 24 / 30;
      nx = sigRow.offsetLeft + sgI.offsetLeft + sgI.offsetWidth * .04 + pt.x * sw; ny = sigRow.offsetTop + sgI.offsetTop + sgI.offsetHeight + 2 - 24 + pt.y * shh + 12;
      sv(cw, '--nx', nx.toFixed(1) + 'px'); sv(cw, '--ny', ny.toFixed(1) + 'px'); sv(cw, '--nw', '0px');
    }
    sigRow.style.setProperty('--wt', seg(p, .29, .31) * (1 - seg(p, .6, .64)));
    sv(cw, '--no', (seg(p, .015, .03) * (1 - seg(p, .29, .31))).toFixed(3));
    /* ---- ข้อ 3: ตราประทับ "พบความเสี่ยง" (.59 – .66) ---- */
    var sIn = seg(p, .59, .615), sOut = seg(p, .65, .69);
    sv(cw, '--so', (cl(sIn * 3) * (1 - sOut)).toFixed(3)); sv(cw, '--ss', (lerp(2.6, 1, io(sIn)) + sOut * .25).toFixed(3));
    var hit = seg(p, .612, .625), shk = seg(p, .615, .65);
    sv(cw, '--sp', (cl(hit * 4) * (1 - sOut)).toFixed(3)); sv(cw, '--sr', io(hit).toFixed(3));
    sv(cw, '--ko', (hit > 0 ? (1 - shk) * .9 : 0).toFixed(3)); sv(cw, '--ks', (1 + shk * 9).toFixed(2));
    var sa = (1 - shk) * (shk > 0 ? 9 : 0), shx = Math.sin(p * 2400) * sa, shy = Math.cos(p * 3100) * sa * .7;
    sv(st, '--shx', shx.toFixed(2) + 'px'); sv(st, '--shy', shy.toFixed(2) + 'px');
    /* ---- ฉาก 3: สัญญาระเบิดเป็นเส้น (.65 – .81) ---- */
    sv(cw, '--pa', (1 - seg(p, .66, .7)).toFixed(3));
    /* v7: มุมกระดาษม้วนขึ้น แล้วฉีกเป็นแถบ */
    var cu = io(seg(p, .63, .665)); curlEl.style.setProperty('--cs', (cu * Math.min(cwW, cwH) * .32).toFixed(1) + 'px');
    var sb = seg(p, .655, .67);
    var sx = seg(p, .655, .79);
    scrEls.forEach(function (e, k) { var S = SCR[k], q = io(sx); e.style.transform = 'translate(' + (S.x * q).toFixed(1) + 'px,' + (S.y * q + q * q * 120).toFixed(1) + 'px) rotate(' + (S.r * q).toFixed(0) + 'deg) scale(' + (1 + S.z * q) + ')'; e.style.setProperty('--sco', (sx > 0 ? 1 - seg(sx, .55, 1) : 0).toFixed(3)); });
    if (sOn && !tearDone && p > .655 && p < .72) { tear(); tearDone = true; } if (p < .64) tearDone = false;
    var cardF = io(seg(p, .74, .86));
    rowEls.forEach(function (r, i) {
      var F = fly[i];
      if (tgt[i] == null) {
        r.style.transform = 'translate3d(' + F.x * ex + 'px,' + F.y * ex + 'px,' + F.z * ex + 'px) rotateX(' + F.rx * ex + 'deg) rotateZ(' + F.rz * ex + 'deg)';
        r.style.opacity = 1 - seg(ex, .3, .9);
      } else {
        /* แถวเสี่ยง: พุ่งเข้าหากล้อง หมุนนิด ๆ แล้วไปเรียงเป็นการ์ด */
        var pop = Math.sin(Math.PI * ex) * 220, lift = Math.sin(Math.PI * ex) * F.rz * .4;
        var yy = lerp(0, tgt[i], io(seg(p, .7, .85)));
        r.style.transform = 'translate3d(0,' + yy + 'px,' + pop + 'px) rotateZ(' + lift + 'deg)';
        r.style.opacity = 1;
        sv(r, '--rm', seg(p, .6, .66).toFixed(3));
      }
      var kk = risky.indexOf(i), cf = kk < 0 ? cardF : io(seg(p, .74 + kk * .018, .8 + kk * .018));
      var cp = kk < 0 ? 1 : (cf < 1 ? 1 + Math.sin(cf * Math.PI) * .12 : 1);
      sv(r, '--sb', (sb * (kk < 0 ? 1 - seg(ex, .5, .9) : 1 - cf)).toFixed(3));
      sv(r, '--co', cf.toFixed(3)); sv(r, '--io', (1 - cf).toFixed(3)); sv(r, '--cp', (cf * cp).toFixed(3));
    });
    /* ---- ฉาก 4: ผลตรวจ + ปุ่ม (.84 – 1) ---- */
    var ro = seg(p, .83, .88), eo = io(seg(p, .9, .97));
    /* ข้อ 4: ตัวนับ 0 → 5 และยอดเงินเสี่ยง */
    var cn = Math.round(seg(p, .845, .9) * risky.length);
    if (cn !== lastCnt) { if (sOn && cn > lastCnt) tick2(cn); lastCnt = cn; cntEl.textContent = cn; sv(cntEl, '--nb', 1.25); setTimeout(function () { sv(cntEl, '--nb', 1); }, 120); }
    moneyEl.textContent = Math.round(io(seg(p, .85, .92)) * 17000).toLocaleString('en-US');
    SR.getElementById('skip').classList.toggle('off', !(p > .015 && p < .86));
    sv(st, '--ro', ro.toFixed(3)); sv(st, '--eo', eo.toFixed(3)); sv(st, '--ep', eo > .5 ? 'auto' : 'none');
    var ci = p < .12 ? 0 : p < .3 ? 1 : p < .44 ? 2 : p < .58 ? 3 : 0;
    caps.forEach(function (c) { c.classList.toggle('on', +c.getAttribute('data-c') === ci); });
    dustMode = p < .3 ? 0 : p < .64 ? 1 : 2;
  }
  function pr() { var tot = host.scrollHeight - host.clientHeight; return tot > 0 ? cl(host.scrollTop / tot) : 0; }
  var tick = false;
  function on() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; frame(pr()); }); } }

  /* ---------- ฝุ่นลอยในแสง ---------- */
  var cv = SR.getElementById('dust'), cx = cv.getContext('2d'), P = [], dustMode = 0, DPR = Math.min(2, devicePixelRatio || 1);
  function initDust() { cv.width = W * DPR; cv.height = H * DPR; P = []; for (var i = 0; i < 46; i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: .1 + Math.random() * .35, a: Math.random() * 6.28 }); }
  function dust() {
    if (!host.offsetParent && getComputedStyle(host).position !== 'fixed') { musicIdle(true); setTimeout(function () { requestAnimationFrame(dust); }, 400); return; }
    musicIdle(document.hidden); eqTick();
    cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, W, H);
    var col = dustMode === 1 ? '200,150,255' : '255,220,160';
    P.forEach(function (q) { q.y -= q.v; q.a += .01; q.x += Math.sin(q.a) * .25; if (q.y < -5) { q.y = H + 5; q.x = Math.random() * W; }
      cx.globalAlpha = (dustMode === 2 ? .25 : .55) * (.5 + .5 * Math.sin(q.a * 2)); cx.fillStyle = 'rgb(' + col + ')'; cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 6.28); cx.fill(); });
    if (SH.on > .01) {
      var t5 = performance.now() * .00004, c5 = shd.children, dx5 = SH.ex - SH.lx, dy5 = SH.ey - SH.ly, L5 = Math.hypot(dx5, dy5);
      for (var j5 = 0; j5 < c5.length; j5++) { var a5 = (t5 * (1 + j5 % 5 * .2) + j5 / c5.length) % 1, o5 = Math.sin(j5 * 7.31) * .85 * lerp(10, SH.w, a5) + Math.sin(performance.now() * .0007 + j5) * 6;
        c5[j5].setAttribute('cx', (SH.lx + dx5 * a5 - dy5 / L5 * o5).toFixed(1)); c5[j5].setAttribute('cy', (SH.ly + dy5 * a5 + dx5 / L5 * o5).toFixed(1)); c5[j5].setAttribute('opacity', (Math.sin(a5 * Math.PI) * .9).toFixed(2)); }
    }
    if (BG.on > .01) {
      var tt0 = performance.now() * .00006, cs2 = udust.children, dxv = BG.bx - BG.hx, dyv = BG.by - BG.hy, L2 = Math.hypot(dxv, dyv), px = -dyv / L2, py = dxv / L2;
      for (var di = 0; di < cs2.length; di++) {
        var a2 = (tt0 * (1 + di % 4 * .35) + di / cs2.length) % 1, off = Math.sin(di * 12.9898) * .9 * lerp(8, BG.ew, a2), wob = Math.sin(performance.now() * .001 + di) * 4;
        cs2[di].setAttribute('cx', (BG.hx + dxv * a2 + px * (off + wob)).toFixed(1)); cs2[di].setAttribute('cy', (BG.hy + dyv * a2 + py * (off + wob)).toFixed(1));
        cs2[di].setAttribute('opacity', (Math.sin(a2 * Math.PI) * .85).toFixed(2));
      }
    }
    /* ฉากขยับเองเบา ๆ ก่อนเลื่อน: กล้องโยก + แสงโคมไฟกะพริบอุ่น */
    var t = performance.now(), amp = 1 - seg(lastP < 0 ? 0 : lastP, .04, .26);
    sv(cam, '--cx', (Math.sin(t * .00042) * 7 * amp).toFixed(2) + 'px'); sv(cam, '--cy', (Math.cos(t * .00031) * 5 * amp).toFixed(2) + 'px'); sv(cam, '--cr', (Math.sin(t * .00023) * .45 * amp).toFixed(3) + 'deg');
    var fk = .93 + .05 * Math.sin(t * .0031) + .02 * Math.sin(t * .0173);
    sv(cam, '--po', (lampL * fk).toFixed(3));
    if (!reduce) requestAnimationFrame(dust);
  }

  function boot() {
    if (!host.offsetParent) return;
    layout(); initDust(); lastP = -1;
    if (reduce) { frame(.97); dust(); return; }
    frame(pr());
  }
  /* ข้อ 6: ข้าม + ดูอีกรอบ (เล่นอัตโนมัติ) */
  function endY() { return (host.scrollHeight - host.clientHeight) * .975; }
  var play = 0;
  function stopPlay() { if (play) { cancelAnimationFrame(play); play = 0; R.classList.remove('playing'); } }
  SR.getElementById('skip').addEventListener('click', function () { stopPlay(); host.scrollTo(0, endY()); });
  SR.getElementById('again').addEventListener('click', function () {
    stopPlay(); host.scrollTo(0, 0); R.classList.add('playing');
    var y0 = 0, y1 = endY(), dur = 9000, t0 = performance.now();
    function stepP(now) { var k = cl((now - t0) / dur); host.scrollTo(0, y0 + (y1 - y0) * k); if (k < 1) play = requestAnimationFrame(stepP); else { play = 0; R.classList.remove('playing'); } }
    play = requestAnimationFrame(stepP);
  });
  ['wheel', 'touchstart', 'keydown'].forEach(function (e) { host.addEventListener(e, stopPlay, { passive: true }); });
  host.addEventListener('scroll', on, { passive: true });
  addEventListener('resize', function () { boot(); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);
  boot(); if (!reduce) requestAnimationFrame(dust);

  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
