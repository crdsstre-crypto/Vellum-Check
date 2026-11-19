/* Vellum Check · ธีมหน้าปก "นักสืบ" (v3) — ฉากของตัวเองทั้งเรื่อง ไม่ใช้โต๊ะไม้ของธีมอื่น
   หน้าปก   : บอร์ดสืบสวนบนผนัง (มองตรง) สัญญาติดกลางบอร์ดป้าย "ผู้ต้องสงสัย" · เบาะแส 5 ใบ · ข่าวตัดแปะ แผนที่ โน้ต · ด้ายแดง
              เปิดมาจอมืด → ไฟกะพริบติด → เงานักสืบเดินผ่านหน้าบอร์ด · เกรนฟิล์ม
   เลื่อนลง : การ์ดหนังเงียบ "บทที่ 1–3" คั่นฉาก · กล้องซูมไล่ทีละเบาะแส ด้ายแดงวิ่งจากเบาะแสไปที่สัญญา (ตัวนับ 1/5)
              → ของทั้งบอร์ดรวมเข้าแฟ้มคดี + ตราประทับ "ตรวจแล้ว" → ผลตรวจเป็นบัตรหลักฐานติดหมุด
   ข้อมูลในฉากเป็นข้อมูลสมมติ · ไม่แตะข้อความหัวข้อ/โลโก้ (เปลี่ยนเฉพาะสีตัวอักษร) */
(function () {
  /* เบาะแส 5 ข้อ = ตรงกับการ์ดผลตรวจของหน้าปก */
  var EV = [
    { t: 'ขึ้นค่าเช่าได้ตลอดเวลา', ic: 'up', x: 17, y: 30, xp: 21, yp: 42, r: -6 },
    { t: 'หักเงินประกันตามใจ', ic: 'wallet', x: 83, y: 31, xp: 79, yp: 41, r: 5 },
    { t: 'ค่าปรับวันละ 300 บาท', ic: 'clock', x: 15, y: 72, xp: 22, yp: 81, r: 4, mh: 1 },
    { t: 'ยกเลิก = เสียเงินประกันหมด', ic: 'door', x: 85, y: 71, xp: 78, yp: 81, r: -5 },
    { t: 'ต่อสัญญาเองอัตโนมัติ', ic: 'loop', x: 70, y: 89, xp: 50, yp: 88, r: 3, mh: 1 }
  ];
  var C = { x: 50, y: 55, xp: 50, yp: 60 };   /* ตำแหน่งสัญญา (แนวนอน / แนวตั้ง) */
  var IC = {
    up: '<path d="M14 46h44M20 40V24M30 40V18M40 40V28M50 40V12" stroke="#222" stroke-width="5" stroke-linecap="round"/><path d="M44 12h6v6" stroke="#222" stroke-width="4" fill="none"/>',
    wallet: '<rect x="10" y="16" width="52" height="34" rx="6" fill="#333"/><rect x="40" y="26" width="22" height="14" rx="4" fill="#777"/><circle cx="48" cy="33" r="3" fill="#ddd"/>',
    clock: '<circle cx="36" cy="32" r="22" fill="none" stroke="#222" stroke-width="5"/><path d="M36 18v15l10 6" stroke="#222" stroke-width="5" stroke-linecap="round" fill="none"/>',
    door: '<rect x="18" y="8" width="30" height="48" fill="#333"/><circle cx="42" cy="33" r="2.6" fill="#ddd"/><path d="M52 32h14M60 26l6 6-6 6" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/>',
    loop: '<path d="M18 30a18 18 0 0130-12M54 34a18 18 0 01-30 12" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M48 10v9h-9M24 54v-9h9" stroke="#222" stroke-width="4" fill="none"/>'
  };
  var css = `
  /* ---------- ซ่อนฉากโต๊ะไม้ของธีมอื่น ---------- */
  :host([data-th=noir]){background:#0b0b0b}
  :host([data-th=noir]) .cam > .L:not(.cw),:host([data-th=noir]) canvas.dust,:host([data-th=noir]) .cap,:host([data-th=noir]) .uvc{display:none !important}
  :host([data-th=noir]) .paper,:host([data-th=noir]) .curl,:host([data-th=noir]) .scraps,:host([data-th=noir]) .uvl,:host([data-th=noir]) .uvs,:host([data-th=noir]) .nib,
  :host([data-th=noir]) .row .ink,:host([data-th=noir]) .row .strip,:host([data-th=noir]) .row .uvt,:host([data-th=noir]) .uvring,:host([data-th=noir]) .uvtag,
  :host([data-th=noir]) .stamp,:host([data-th=noir]) .splat,:host([data-th=noir]) .shock{display:none !important}
  :host([data-th=noir]) .stage{background:radial-gradient(120% 80% at 50% 30%,#2a2a2a,#121212 60%,#060606)}
  :host([data-th=noir]) .dawn{display:none}
  /* หัวข้อ: ขาวเงิน + "ก่อนเซ็น" แดง */
  :host([data-th=noir]) .ttl small{color:#ececec;letter-spacing:.5em}
  :host([data-th=noir]) .ttl .l1{background-image:linear-gradient(180deg,#ffffff 15%,#e6e6e6 55%,#a9a9a9 100%)}
  :host([data-th=noir]) .ttl .l2{background-image:linear-gradient(180deg,#ff8a8a 5%,#ff3b3b 45%,#b3121b 100%)}
  :host([data-th=noir]) .ttl{filter:blur(var(--tb,0px)) drop-shadow(0 4px 0 rgba(0,0,0,.6)) drop-shadow(0 10px 26px rgba(0,0,0,.95))}
  :host([data-th=noir]) .hint{color:#ddd}
  /* ---------- ผลตรวจ = บัตรหลักฐานติดหมุด ---------- */
  :host([data-th=noir]) .row .card{background:linear-gradient(170deg,#efece4,#dcd8cc);border:0;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:0 14px 26px -12px rgba(0,0,0,.9),0 2px 0 #bfb9aa}
  :host([data-th=noir]) .row:nth-child(odd) .card{rotate:-1.1deg}:host([data-th=noir]) .row:nth-child(even) .card{rotate:.9deg}
  :host([data-th=noir]) .row .card::after{display:none}
  :host([data-th=noir]) .row .card::before{left:14px;top:-5px;bottom:auto;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8080,#c41414 60%,#6e0a0a);box-shadow:1px 3px 3px rgba(0,0,0,.5)}
  :host([data-th=noir]) .row .card .gl{background:repeating-linear-gradient(0deg,transparent 0 11px,rgba(0,0,0,.04) 11px 12px)}
  :host([data-th=noir]) .row .card b{color:#1b1b1b;text-shadow:none;font-family:Sarabun,Prompt}
  :host([data-th=noir]) .row .card i{background:#c41414;box-shadow:none}
  :host([data-th=noir]) .row .card em,:host([data-th=noir]) .row .card em.u{background:transparent;border:1.5px solid #c41414;color:#c41414;font-family:'IBM Plex Mono',monospace;letter-spacing:.04em}
  :host([data-th=noir]) .row .card.bk-on{background:linear-gradient(170deg,#f6f3ea,#e4e0d4)}
  :host([data-th=noir]) .row .card .bkf small{color:#c41414}:host([data-th=noir]) .row .card .bkf span{color:#222}
  :host([data-th=noir]) .row .card:hover{box-shadow:0 20px 34px -12px rgba(0,0,0,.95),0 2px 0 #bfb9aa}
  :host([data-th=noir]) .rh small{color:#bbb;font-family:'IBM Plex Mono',monospace}
  :host([data-th=noir]) .rh h2 em{color:#ff4a4a}
  :host([data-th=noir]) .end a.go{background:linear-gradient(135deg,#f3f0e8,#d6d1c3);color:#141414;animation:none;box-shadow:0 14px 34px -12px rgba(0,0,0,.9),0 0 0 2px #c41414 inset}
  :host([data-th=noir]) .end a.go::after{background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)}
  :host([data-th=noir]) .flh{color:#ddd}
  /* ปุ่มเปลี่ยนฉาก: กรอบเหลี่ยมชั้นเดียว + ไอคอนหมวกนักสืบลายเส้น */
  :host([data-th=noir]) .scn{border:1px solid #8a8a8a;border-radius:4px;background:rgba(18,18,18,.82);box-shadow:0 8px 20px -8px rgba(0,0,0,.8)}
  :host([data-th=noir]) .scn i{font-size:0;border-radius:0;background:transparent center/24px no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='%23f0f0f0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 21c4 2.6 22 2.6 26 0'/%3E%3Cpath d='M7 20.4 9 11c.4-1.8 2-2.6 3.6-1.8L16 11l3.4-1.8c1.6-.8 3.2 0 3.6 1.8l2 9.4'/%3E%3Cpath d='M8 17.6c5 1.4 11 1.4 16 0' stroke='%23e02020' stroke-width='2.4'/%3E%3C/svg%3E");box-shadow:none}
  :host([data-th=noir]) .scn span{color:#eee}
  /* ---------- ชั้นฉากนักสืบ ---------- */
  .nz{position:absolute;inset:0;z-index:14;overflow:hidden;pointer-events:none;background:#111}
  .nz-b{position:absolute;inset:-3%;transform-origin:50% 50%;will-change:transform;
      background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .25 0 0 0 0 .23 0 0 0 0 .2 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23c)'/%3E%3C/svg%3E"),linear-gradient(160deg,#77706a,#5d5751 60%,#4a4540);
      box-shadow:inset 0 0 0 16px #1d1a17,inset 0 0 0 19px #3a3530,inset 0 0 120px rgba(0,0,0,.75)}
  .nz-it{position:absolute;left:var(--x);top:var(--y);transform:translate(-50%,-50%) rotate(var(--r,0deg));box-shadow:4px 10px 16px rgba(0,0,0,.55)}
  @media (orientation:portrait){.nz-it{left:var(--xp,var(--x));top:var(--yp,var(--y))}}
  .nz-it::before{content:"";position:absolute;left:50%;top:-6px;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;z-index:2;background:radial-gradient(circle at 35% 30%,#ff8a8a,#c41414 60%,#6e0a0a);box-shadow:1px 3px 3px rgba(0,0,0,.6)}
  .nz-it.g::before{background:radial-gradient(circle at 35% 30%,#fff,#9a9a9a 60%,#444)}
  /* สัญญา = ผู้ต้องสงสัย */
  .nz-c{width:min(22vw,250px);aspect-ratio:.74;padding:clamp(12px,1.7vw,24px) clamp(12px,1.8vw,26px);background:#e8e6df;background-image:repeating-linear-gradient(180deg,transparent 0 13%,transparent 13%);font:700 clamp(11px,1.5vw,17px)/1.2 Sarabun,Prompt;color:#222}
  .nz-c i{display:block;height:5px;margin:clamp(9px,1.3vw,16px) 0 0;background:#9d9a92;border-radius:2px}.nz-c i:nth-of-type(2n){width:82%}.nz-c i:nth-of-type(3n){width:64%}
  .nz-c u{position:absolute;right:-12%;top:12%;padding:5px 10px;background:#c41414;color:#fff;font:700 clamp(10px,1.2vw,13px)/1 Prompt;text-decoration:none;transform:rotate(8deg);box-shadow:2px 4px 6px rgba(0,0,0,.45)}
  @media (orientation:portrait){.nz-c{width:46vw}.nz-c u{right:-8%;font-size:11px}}
  /* เบาะแส = รูปโพลารอยด์ */
  .nz-e{width:min(13vw,150px);padding:9px 9px 7px;background:#ecebe6}
  .nz-e .ph{aspect-ratio:1.15;background:linear-gradient(160deg,#9a9a9a,#6b6b6b);display:grid;place-items:center}
  .nz-e .ph svg{width:58%;height:58%}
  .nz-e p{margin:8px 0 0;font:400 clamp(11px,1.15vw,14px)/1.25 Charmonman,Sriracha,Prompt;color:#222;text-align:center;min-height:2.5em}
  .nz-e b{position:absolute;right:-8px;top:-8px;padding:3px 6px;border-radius:3px;background:#1b1b1b;color:#fff;font:700 10px/1 'IBM Plex Mono',monospace}
  .nz-e.on{box-shadow:0 0 0 3px #c41414,4px 12px 20px rgba(0,0,0,.6)}
  @media (orientation:portrait){.nz-e{width:31vw}.nz-e p{font-size:11.5px}}
  /* ของตกแต่งบอร์ด */
  .nz-np{width:min(16vw,170px);padding:10px;background:#cfccc3;font:800 clamp(10px,1.1vw,13px)/1.15 Taviraj,Georgia,serif;color:#222}
  .nz-np small{display:block;font:600 8px/1 'IBM Plex Mono',monospace;letter-spacing:.1em;margin-bottom:5px;color:#555}
  .nz-np i{display:block;height:3px;margin-top:5px;background:#9a978e}.nz-np i:nth-of-type(3){width:70%}
  .nz-sn{width:min(10vw,110px);aspect-ratio:1;padding:10px;background:#dcdcd2;font:400 clamp(11px,1.1vw,14px)/1.2 Charmonman,Sriracha,Prompt;color:#333}
  .nz-mp{width:min(14vw,150px);aspect-ratio:1.3;background:#bdbab0}
  .nz-mp svg{width:100%;height:100%}
  @media (orientation:portrait){.nz-np{width:30vw}.nz-sn{width:21vw}.nz-mp{display:none}}
  .nz-s{position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:3;pointer-events:none}
  .nz-s path{fill:none;stroke:#c41414;stroke-width:2;stroke-linecap:round;filter:drop-shadow(1px 3px 1.5px rgba(0,0,0,.45))}
  .nz-s path.dc{stroke:#a01010;stroke-width:1.5;opacity:.75}
  /* ไฟส่องบอร์ด + เงามืดรอบจุดที่กำลังดู */
  .nz-lamp{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(0,0,0,.7))}
  .nz-dim{position:absolute;inset:0;opacity:0;background:radial-gradient(circle var(--sr,140px) at var(--sx,50%) var(--sy,50%),transparent 60%,rgba(0,0,0,.72))}
  /* ตัวนับเบาะแส */
  .nz-cnt{position:absolute;left:50%;top:calc(var(--art-head,56px) + 2.5vh);transform:translateX(-50%);display:block;padding:7px 14px;border-radius:4px;
      background:#141414;border:1px solid #555;color:#eee;font:600 13px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;opacity:0;white-space:nowrap}
  .nz-cnt b{color:#ff4a4a}
  /* การ์ดหนังเงียบ */
  .nz-ic{position:absolute;inset:0;display:grid;place-items:center;background:#070707;opacity:0}
  .nz-ic div{position:relative;width:min(84vw,620px);padding:9vh 6vw;text-align:center;border:2px solid #cfcfcf;outline:1px solid #6a6a6a;outline-offset:7px}
  .nz-ic div::before,.nz-ic div::after{content:"❖";position:absolute;left:50%;transform:translateX(-50%);color:#bbb;font-size:16px;background:#070707;padding:0 10px}
  .nz-ic div::before{top:-11px}.nz-ic div::after{bottom:-11px}
  .nz-ic small{display:block;font:500 clamp(12px,1.6vw,15px)/1 'IBM Plex Mono',monospace;letter-spacing:.4em;color:#9a9a9a}
  .nz-ic h3{margin:18px 0 0;font:600 clamp(28px,6vw,54px)/1.2 Taviraj,Georgia,serif;color:#f1f1f1}
  .nz-ic h3 em{font-style:normal;color:#ff4a4a}
  .nz-burn{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at var(--bx,70%) var(--by,30%),rgba(255,250,235,.95),rgba(255,180,90,.6) 18%,rgba(90,40,10,.4) 30%,transparent 46%)}
  /* แฟ้มคดี + ตรา */
  .nz-f{position:absolute;left:50%;top:56%;width:min(64vw,400px);aspect-ratio:1.25;opacity:0}
  .nz-f svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 26px 30px rgba(0,0,0,.8))}
  .nz-st{position:absolute;left:50%;top:60%;padding:10px 22px 8px;border:5px solid #d11a1a;border-radius:8px;color:#e01e1e;font:800 clamp(28px,7vw,52px)/1 Prompt;letter-spacing:.04em;opacity:0;white-space:nowrap;
      background:rgba(209,26,26,.06);box-shadow:inset 0 0 0 3px rgba(209,26,26,.28);
      -webkit-mask:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.72) 61%,#000 70%);mask:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.72) 61%,#000 70%)}
  .nz-st small{display:block;margin-top:5px;font:700 11px/1 'IBM Plex Mono',monospace;letter-spacing:.3em;text-align:center}
  /* เกรนฟิล์ม (ตลอดทั้งเรื่อง) */
  .nz-fx{position:absolute;inset:0;z-index:18;pointer-events:none;overflow:hidden}
  .nr-gr{position:absolute;inset:-60px;opacity:.15;animation:nrg .5s steps(4) infinite;
      background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.2 -.1'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
  @keyframes nrg{0%{transform:translate(0,0)}25%{transform:translate(-22px,14px)}50%{transform:translate(18px,-26px)}75%{transform:translate(-12px,-8px)}100%{transform:translate(0,0)}}
  .nr-fl{position:absolute;inset:0;background:#000;opacity:0;animation:nrf 7s 3s infinite}
  @keyframes nrf{0%,100%{opacity:0}3%{opacity:.12}5%{opacity:0}47%{opacity:0}48%{opacity:.07}49.5%{opacity:0}}
  .nr-sc{position:absolute;left:12%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.07);animation:nrs 3.2s steps(10) infinite}
  @keyframes nrs{0%{transform:translateX(0)}50%{transform:translateX(60vw)}100%{transform:translateX(20vw)}}
  /* หน้าปก: จอมืด → ไฟกะพริบติด · เงานักสืบเดินผ่านหน้าบอร์ด */
  .nr-in{position:absolute;inset:0;background:#000;opacity:0;animation:nrin .85s linear .05s both}
  @keyframes nrin{0%,40%{opacity:1}48%{opacity:.15}56%{opacity:.95}66%{opacity:.3}76%{opacity:.6}88%,100%{opacity:0}}
  .nr-man{position:absolute;left:0;bottom:-4%;height:92%;aspect-ratio:.42;opacity:0;animation:nrw 30s linear 2.6s infinite}
  .nr-man svg{width:100%;height:100%;filter:blur(5px);animation:nrbob .6s ease-in-out infinite alternate}
  @keyframes nrw{0%{opacity:.72;transform:translateX(105vw)}22%{opacity:.72;transform:translateX(-60vh)}22.1%,100%{opacity:0;transform:translateX(-60vh)}}
  @keyframes nrbob{from{transform:translateY(0)}to{transform:translateY(8px)}}
  /* รอยนิ้วมือตอนแตะ */
  .nr-fp{width:64px;height:78px;margin:-39px 0 0 -32px;animation:nrfp 1.8s ease-out forwards}
  @keyframes nrfp{0%{opacity:0;transform:scale(.7) rotate(-8deg)}15%{opacity:.85;transform:scale(1) rotate(-8deg)}70%{opacity:.6}100%{opacity:0;transform:scale(1.04) rotate(-8deg)}}
  /* ===== 3 วินาทีแรก ===== */
  /* รอจนหน้าปกขึ้นจอจริงก่อนค่อยเริ่ม (กันเล่นไปแล้วตอนเครื่องยังวาดไม่เสร็จ) */
  :host([data-th=noir]:not(.nzgo)) .nz-dl,:host([data-th=noir]:not(.nzgo)) .nz-s .ev0 path,:host([data-th=noir]:not(.nzgo)) .nz-c u,
  :host([data-th=noir]:not(.nzgo)) .ttl small,:host([data-th=noir]:not(.nzgo)) .ttl .l1,:host([data-th=noir]:not(.nzgo)) .ttl .l2,
  :host([data-th=noir]:not(.nzgo)) .nz-spl i,:host([data-th=noir]:not(.nzgo)) .nr-in,:host([data-th=noir]:not(.nzgo)) .nz-bulb,:host([data-th=noir]:not(.nzgo)) .nz-pool,
  :host([data-th=noir]:not(.nzgo)) .nr-man{animation-play-state:paused}
  /* กล้องถอยออกจากป้าย "ผู้ต้องสงสัย" */
  .nz-dl{position:absolute;inset:0;transform-origin:var(--ox,60%) var(--oy,40%);animation:nzdl 1.6s cubic-bezier(.55,0,.2,1) .2s both}
  @keyframes nzdl{from{transform:scale(2.7)}to{transform:none}}
  /* ด้ายแดงพุ่งโยงทุกเบาะแสพร้อมกัน */
  .nz-s .ev0 path{stroke-dasharray:var(--L);stroke-dashoffset:var(--L);animation:nzsh .55s cubic-bezier(.2,.9,.3,1) calc(1s + var(--k) * 70ms) both}
  @keyframes nzsh{0%{stroke-dashoffset:var(--L);stroke-width:3.5;filter:drop-shadow(0 0 6px #ff3030)}70%{stroke-width:3;filter:drop-shadow(0 0 8px #ff3030)}100%{stroke-dashoffset:0;stroke-width:2;filter:drop-shadow(1px 3px 1.5px rgba(0,0,0,.45))}}
  .nz-s.done .ev0 path{animation:none;stroke-dashoffset:0}
  /* ป้าย "ผู้ต้องสงสัย" ตอกลง */
  .nz-c u{animation:nztag .42s cubic-bezier(.2,1.7,.4,1) 1.65s both}
  @keyframes nztag{from{opacity:0;transform:rotate(8deg) scale(2.6)}55%{opacity:1}to{opacity:1;transform:rotate(8deg)}}
  /* หัวข้อ: "อ่านให้ครบ" ขึ้นก่อน → "ก่อนเซ็น" กระแทกลงเป็นตราแดง */
  :host([data-th=noir]) .ttl small,:host([data-th=noir]) .ttl .l1{animation:nzl1 .6s ease-out .35s both}
  @keyframes nzl1{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  :host([data-th=noir]) .ttl .l2{animation:nzst .5s cubic-bezier(.2,1.6,.4,1) 1.85s both}
  @keyframes nzst{0%{opacity:0;transform:scale(2.4) rotate(-6deg)}45%{opacity:1}70%{transform:scale(.96) rotate(1deg)}100%{opacity:1;transform:none}}
  .nz-spl{position:absolute;left:50%;top:calc(var(--art-head,56px) + 4vh + clamp(60px,17vw,150px));width:0;height:0;z-index:3}
  .nz-spl i{position:absolute;width:var(--s);height:var(--s);margin:calc(var(--s) / -2);border-radius:50%;background:#d11a1a;opacity:0;animation:nzspl 1.2s ease-out 2.02s both}
  @keyframes nzspl{0%{opacity:0;transform:translate(0,0)}8%{opacity:.85}60%{opacity:.6}100%{opacity:0;transform:translate(var(--x),var(--y))}}
  /* หลอดไฟห้อยแกว่ง (แสงบนบอร์ดแกว่งตาม) */
  .nz-sw{position:absolute;left:50%;top:0;width:0;height:0;z-index:2;transform-origin:0 0;animation:nzsw 4.6s ease-in-out infinite alternate}
  @keyframes nzsw{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
  .nz-top{position:absolute;inset:0;z-index:20;pointer-events:none;overflow:hidden}
  .nz-cord{position:absolute;left:-1px;top:0;width:2px;height:calc(var(--art-head,56px) + 4vh - 30px);background:linear-gradient(#000,#2a2a2a)}
  .nz-bulb{position:absolute;left:-10px;top:calc(var(--art-head,56px) + 4vh - 32px);width:20px;height:25px;border-radius:45% 45% 50% 50%;
      background:radial-gradient(circle at 45% 60%,#fff,#fff3d6 45%,#e9d3a0 80%);box-shadow:0 0 16px 7px rgba(255,244,215,.85),0 0 60px 26px rgba(255,236,200,.32);animation:nzon .8s steps(1) .05s both}
  .nz-bulb::before{content:"";position:absolute;left:4px;top:-8px;width:12px;height:9px;border-radius:2px;background:#2a2a2a}
  .nz-pool{position:absolute;left:-80vmax;top:calc(50vh - 80vmax);width:160vmax;height:160vmax;border-radius:50%;mix-blend-mode:soft-light;
      background:radial-gradient(circle,rgba(255,250,235,.62),rgba(255,244,220,.26) 18%,rgba(0,0,0,.22) 34%,rgba(0,0,0,.5) 50%);animation:nzon .8s steps(1) .05s both}
  @keyframes nzon{0%{opacity:0}40%{opacity:1}48%{opacity:.15}56%{opacity:1}66%{opacity:.3}76%,100%{opacity:1}}
  /* มือถือ: หน้าปกเหลือสัญญา + เบาะแส 3 ใบที่ใหญ่ขึ้น · อีก 2 ใบโผล่ตอนเลื่อน */
  @media (orientation:portrait){
    .nz-c{width:42vw}.nz-e{width:33vw}.nz-e p{font-size:12.5px}.nz-sn{display:none}
    .nz-e.mh,.nz-s path.mh{opacity:0;transition:opacity .45s}.nz-e.mh.show,.nz-s path.mh.show{opacity:1}
  }
  @media (prefers-reduced-motion:reduce){.nr-man,.nr-gr,.nr-sc,.nz-sw{animation:none !important}.nr-man,.nr-gr,.nr-sc{display:none}}
  `;
  /* เงาคนมองจากด้านหน้า: หมวกเฟดอร่า + โค้ทยาว */
  var man = '<div class="nr-man"><svg viewBox="0 0 42 100" preserveAspectRatio="xMidYMax meet"><g fill="#000">' +
    '<ellipse cx="21" cy="11" rx="12" ry="2.6"/><path d="M14 11c0-7 14-7 14 0z"/><circle cx="21" cy="15" r="5"/>' +
    '<path d="M15 20h12l8 5 3 30-4 1-2-20v38l-4 0-3-26h-1l-3 26h-4V36l-2 20-4-1 3-30z"/></g></svg></div>';
  var stage = man + '<div class="nr-in"></div>';

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function buildBoard() {
    var h = '<div class="nz-dl"><div class="nz-b">';
    h += '<div class="nz-it nz-np g" style="--x:30%;--y:44%;--xp:22%;--yp:23%;--r:-4deg"><small>ข่าวสมมติ · 0417</small>อ่านไม่ครบ เสียเงินประกันฟรี<i></i><i></i><i></i></div>';
    h += '<div class="nz-it nz-sn g" style="--x:70%;--y:46%;--xp:80%;--yp:22%;--r:6deg">ใครเขียน<br>ข้อนี้?</div>';
    h += '<div class="nz-it nz-mp g" style="--x:32%;--y:84%;--r:-3deg"><svg viewBox="0 0 130 100"><path d="M0 30L130 22M0 64L130 70M40 0L46 100M90 0L84 100" stroke="#8e8b82" stroke-width="3"/><path d="M14 84C30 70 44 76 58 56S86 34 104 22" stroke="#333" stroke-width="2.2" stroke-dasharray="5 5" fill="none"/><path d="M98 16l12 12M110 16L98 28" stroke="#c41414" stroke-width="3.5" stroke-linecap="round"/></svg></div>';
    h += '<div class="nz-it nz-c" style="--x:' + C.x + '%;--y:' + C.y + '%;--xp:' + C.xp + '%;--yp:' + C.yp + '%;--r:-1.5deg">สัญญาเช่าห้องพัก<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><u>ผู้ต้องสงสัย</u></div>';
    EV.forEach(function (e, k) {
      h += '<div class="nz-it nz-e' + (e.mh ? ' mh' : '') + '" data-k="' + k + '" style="--x:' + e.x + '%;--y:' + e.y + '%;--xp:' + e.xp + '%;--yp:' + e.yp + '%;--r:' + e.r + 'deg"><b>#' + (k + 1) + '</b><div class="ph"><svg viewBox="0 0 72 64" fill="none">' + IC[e.ic] + '</svg></div><p>' + esc(e.t) + '</p></div>';
    });
    h += '<svg class="nz-s"><g class="dc"></g><g class="ev0"></g><g class="ev"></g></svg></div><div class="nz-sw"><div class="nz-pool"></div></div></div><div class="nz-lamp"></div><div class="nz-dim"></div>';
    h += '<div class="nz-spl">' + [[-120, -30, 9], [110, -40, 7], [-70, 40, 6], [150, 20, 10], [30, -60, 5], [-160, 10, 6], [80, 50, 8]].map(function (d) { return '<i style="--x:' + d[0] + 'px;--y:' + d[1] + 'px;--s:' + d[2] + 'px"></i>'; }).join('') + '</div>';
    h += '<div class="nz-cnt">เบาะแส <b class="n">0</b>/5</div>';
    h += '<div class="nz-f"><svg viewBox="0 0 250 200"><path d="M6 24h80l12-16h146v186H6z" fill="#b9b1a0"/><rect x="6" y="34" width="244" height="160" fill="#cdc5b2"/><path d="M6 34h244" stroke="#8e8674" stroke-width="2"/>' +
      '<text x="24" y="70" font-family="IBM Plex Mono,Courier New,monospace" font-size="15" font-weight="700" fill="#2a2620" letter-spacing="2">CASE FILE · No. 0417</text>' +
      '<text x="24" y="98" font-family="Sarabun,Prompt,sans-serif" font-size="15" font-weight="700" fill="#2a2620">สัญญาเช่าห้องพัก</text>' +
      '<text x="24" y="122" font-family="Sarabun,Prompt,sans-serif" font-size="12.5" fill="#4a4436">เบาะแสที่ควรถามก่อนเซ็น: 5 จุด</text>' +
      '<path d="M24 140h150M24 154h120M24 168h136" stroke="#9a9280" stroke-width="2"/></svg></div>';
    h += '<div class="nz-st">ตรวจแล้ว<small>VELLUM CHECK</small></div>';
    h += '<div class="nz-ic" data-c="1"><div><small>บทที่ 1</small><h3>สัญญาที่<em>ดูปกติ</em></h3></div></div>';
    h += '<div class="nz-ic" data-c="2"><div><small>บทที่ 2</small><h3><em>เบาะแส</em>ที่ซ่อนในตัวหนังสือ</h3></div></div>';
    h += '<div class="nz-ic" data-c="3"><div><small>บทที่ 3</small><h3>สรุป<em>สิ่งที่ควรถาม</em></h3></div></div>';
    h += '<div class="nz-burn"></div>';
    return h;
  }

  /* ---------- เวลา (สัดส่วนการเลื่อน 0–1) ---------- */
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(p, a, b) { return cl((p - a) / (b - a)); }
  function io(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var S0 = .26, S1 = .52;                                  /* ช่วงด้ายแดงวิ่ง */
  var CARDS = [[.1, .17], [.2, .26], [.53, .585]];         /* การ์ดหนังเงียบ */


  /* ---------- แถบบน + แถบล่างของเว็บ (อยู่นอกหน้าปก) — เปลี่ยนเฉพาะหน้าแรก + ธีมนักสืบ · โลโก้คงสีเดิม ---------- */
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var FEDMASK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3.5 9.6c4.2 1.7 12.8 1.7 17 0'/%3E%3Cpath d='M6.8 9.3 7.9 5.3c.3-1 1.2-1.4 2.1-1l2 .9 2-.9c.9-.4 1.8 0 2.1 1l1.1 4'/%3E%3Cpath d='M7.4 8c3.1.8 6.1.8 9.2 0' stroke-width='2.2'/%3E%3Cpath d='M8.6 11.4a3.4 3.4 0 0 0 6.8 0'/%3E%3Cpath d='M5 21c.7-3.5 3.5-5.4 7-5.4s6.3 1.9 7 5.4'/%3E%3C/svg%3E\")";
  var H0 = 'html[data-htheme="noir"]', HH = 'html[data-htheme="noir"][data-view="home"]', HB = 'html[data-htheme="noir"][data-view="home"] body';
  var siteCss =
    /* ชั้นสีดำด้าน (จางเข้า/ออกนุ่ม ๆ ตอนเข้า/ออกหน้าแรก) */
    '.nz-hb{position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity .5s ease;background:' + NOISE + ',linear-gradient(180deg,#191919,#0e0e0e)}' +
    HH + ' .nz-hb{opacity:1}' +
    H0 + ' .site-header,' + H0 + ' .bottom-nav{isolation:isolate}' +
    '.site-header .nz-hb{box-shadow:inset 0 -1px 0 rgba(163,25,28,.85),0 6px 18px rgba(0,0,0,.5)}' +
    '.bottom-nav .nz-hb{box-shadow:inset 0 1px 0 rgba(163,25,28,.85)}' +
    /* ปุ่ม ☰ / บัญชี / ภาษา = ไอคอนขาวเปล่า ๆ (ไม่มีกรอบ) · ชี้/แตะ = ขีดแดงหมึกใต้ไอคอน */
    H0 + ' .site-header .vct-mb,' + H0 + ' .site-header #authToggle,' + H0 + ' .site-header .vc-lang{transition:border-radius .4s,background-color .4s,border-color .4s,color .4s,box-shadow .25s}' +
    HH + ' .site-header .vct-mb,' + HH + ' .site-header #authToggle,' + HH + ' .site-header .vc-lang{border-radius:999px !important;background:rgba(255,255,255,.05) !important;border:1px solid rgba(255,255,255,.28) !important;color:#f0f0f0 !important;box-shadow:none !important}' +
    HH + ' .site-header .vct-mb:hover,' + HH + ' .site-header #authToggle:hover,' + HH + ' .site-header .vc-lang:hover,' + HH + ' .site-header .vct-mb:focus-visible,' + HH + ' .site-header #authToggle:focus-visible,' +
      HH + ' .site-header .vct-mb:active,' + HH + ' .site-header #authToggle:active{border-color:#a3191c !important;box-shadow:0 0 0 2px rgba(163,25,28,.35) !important}' +
    HH + ' .site-header .vct-mb svg,' + HH + ' .site-header #authToggle svg{filter:grayscale(1) brightness(1.7)}' +
    /* ไอคอนบัญชี = เงาคนใส่หมวกเฟดอร่า (แทนไอคอนเดิมเฉพาะหน้าแรกธีมนี้) */
    '.nz-ic{display:none}' + HB + ' .nz-ic,' + HB + ' .bottom-nav .bn-item[data-nav="acct"] svg.nz-ic,' + HB + ' .bottom-nav .bn-item[data-nav="acct"].is-on svg.nz-ic{display:inline-block !important;filter:none !important;background:none !important;color:#a8a8a8}' + HB + ' .bottom-nav .bn-item svg.nz-ic > *{display:inline !important;fill:none !important;stroke:currentColor !important;stroke-width:1.7px !important;opacity:1 !important}' + HB + ' .bottom-nav .bn-item svg.nz-ic > .bd{stroke:#b81d20 !important;stroke-width:2px !important}' +
    HH + ' .bottom-nav .bn-item[data-nav="acct"] svg:not(.nz-ic){display:none !important}' +
    HH + ' #authToggle::before{-webkit-mask-image:' + FEDMASK + ' !important;mask-image:' + FEDMASK + ' !important;-webkit-mask-size:contain !important;mask-size:contain !important;-webkit-mask-repeat:no-repeat !important;mask-repeat:no-repeat !important;-webkit-mask-position:center !important;mask-position:center !important;width:22px !important;height:22px !important;background:#f0f0f0 !important}' +
    /* เมนูคอม */
    H0 + ' .site-header .dx-nav a{transition:color .4s,background .4s,transform .4s,border-radius .4s,box-shadow .4s}' +
    HH + ' .site-header .dx-nav a:not([href="#checkCard"]){color:#d9d9d9 !important}' +
    HH + ' .site-header .dx-nav a:not([href="#checkCard"])::after{background:#a3191c !important}' +
    /* ปุ่ม "ตรวจสัญญา" = บัตรหลักฐานกระดาษครีม ปักหมุดแดง ตั้งตรง สูงเท่าปุ่มอื่น */
    HH + ' .site-header .dx-nav a[href="#checkCard"]{position:relative !important;overflow:visible !important;height:40px !important;display:inline-flex !important;align-items:center;padding:0 18px !important;' +
      'background:radial-gradient(circle 5px at 50% 7px,#e07a7a 0,#a3191c 55%,#560808 85%,transparent 100%),radial-gradient(circle 7px at 51.5% 9px,rgba(0,0,0,.28),transparent 100%),linear-gradient(175deg,#f1eee6,#dcd7ca) !important;padding-top:6px !important;color:#1a1a1a !important;border:0 !important;border-radius:999px !important;transform:none !important;text-shadow:none !important;' +
      'box-shadow:0 1px 0 #bdb6a6,0 6px 14px -4px rgba(0,0,0,.7) !important}' +
    HH + ' .site-header .dx-nav a[href="#checkCard"] *{color:#1a1a1a !important}' +
    '.nz-pin{display:none}' + HH + ' .nz-pin{display:block;position:absolute;left:50%;top:-4px;width:10px;height:10px;margin-left:-5px;border-radius:50%;z-index:3;pointer-events:none;background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808);box-shadow:1px 2px 2px rgba(0,0,0,.55)}' +
    HH + ' .site-header .dx-nav a[href="#checkCard"]::after{display:none !important}' +
    HH + ' .site-header .dx-nav a[href="#checkCard"]:hover{box-shadow:0 1px 0 #bdb6a6,0 10px 18px -4px rgba(0,0,0,.8) !important;transform:translateY(-1px) !important}' +
    HH + ' .site-header .dx-nav a[href="#checkCard"]:active{animation:nzwg .32s ease}' +
    '@keyframes nzwg{25%{transform:rotate(-2.5deg)}60%{transform:rotate(1.8deg)}100%{transform:none}}' +
    /* แถบล่างมือถือ */
    H0 + ' .bottom-nav .bn-item,' + H0 + ' .bottom-nav .bn-item span{transition:color .4s}' +
    HH + ' .bottom-nav .bn-item{color:#9a9a9a !important}' + HH + ' .bottom-nav .bn-item span{color:#a8a8a8 !important}' +
    HB + ' .bottom-nav .bn-item svg:not(.nz-ic){filter:grayscale(1) brightness(1.25) !important}' +
    HH + ' .bottom-nav .bn-item.is-on span{color:#ffffff !important}' +
    HB + ' .bottom-nav .bn-item.is-on svg:not(.nz-ic){filter:grayscale(1) brightness(.62) sepia(1) saturate(9) hue-rotate(-32deg) brightness(1.05) !important}' +
    HB + ' .bottom-nav .bn-item[data-nav="acct"].is-on svg.nz-ic{color:#c23a3c}' +
    HH + ' .bottom-nav .vc-bn-ind::before{background:radial-gradient(closest-side,rgba(163,25,28,.26),rgba(163,25,28,.07) 60%,transparent) !important}' +
    HH + ' .bottom-nav .vc-bn-ind::after{background:#a3191c !important;box-shadow:0 0 8px rgba(163,25,28,.8) !important}';
  var FEDORA = '<path d="M3.5 9.6c4.2 1.7 12.8 1.7 17 0"/><path d="M6.8 9.3 7.9 5.3c.3-1 1.2-1.4 2.1-1l2 .9 2-.9c.9-.4 1.8 0 2.1 1l1.1 4"/><path class="bd" d="M7.4 8c3.1.8 6.1.8 9.2 0" stroke="#b81d20" stroke-width="2"/><path d="M8.6 11.4a3.4 3.4 0 0 0 6.8 0"/><path d="M5 21c.7-3.5 3.5-5.4 7-5.4s6.3 1.9 7 5.4"/>';

  /* ---------- แผ่นบัญชี (มือถือ) ตอนเปิดจากหน้าแรกธีมนักสืบ — บอร์ด · แฟ้มคดี · บัตรดัชนี · หมุดแดง ---------- */
  var ACCT = `
§{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .25 0 0 0 0 .23 0 0 0 0 .2 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23c)'/%3E%3C/svg%3E"),radial-gradient(90% 40% at 50% 0,rgba(255,250,235,.12),transparent 70%),linear-gradient(170deg,#4e4a45,#33302c 50%,#222120) !important;box-shadow:0 -1px 0 rgba(163,25,28,.8),0 -20px 50px -20px rgba(0,0,0,.9) !important}
§ .alx-bg .alx-w,§ .alx-bg .alx-l,§ .alx-bg .alx-leaf,§ .alx-bg .alx-pen,§ .alx-bg .alx-gls,§ .alx-bg .alx-v{display:none !important}
§ .alx-bg{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 900' preserveAspectRatio='none'%3E%3Cg fill='none' stroke='%23a3191c' stroke-width='1.6' opacity='.55'%3E%3Cpath d='M-10 120Q120 190 260 150T410 210'/%3E%3Cpath d='M-10 520Q90 470 200 560T410 520'/%3E%3C/g%3E%3C/svg%3E") 0 0/100% 100% no-repeat !important}
§ .alx-dust i{background:#ddd !important;box-shadow:none !important}
§ .sheet-head{background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.12)) !important;border:0 !important}
§ .alx-hd{background:linear-gradient(90deg,transparent,rgba(163,25,28,.9) 18%,rgba(163,25,28,.9) 82%,transparent) !important;height:1px !important}
§ .alx-hd::before,§ .alx-hd::after{background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808) !important;border-radius:50% !important;transform:none !important;box-shadow:1px 2px 2px rgba(0,0,0,.55) !important}
/* หัวบัญชี = บัตรนักสืบ */
§ #acctAvatarBtn{border-radius:2px !important;background:#3c3c3c !important;border:5px solid #ecebe6 !important;border-bottom-width:13px !important;box-shadow:2px 6px 10px rgba(0,0,0,.6) !important;transform:rotate(-4deg);color:#efefef !important}
§ #acctAvatarBtn::before,§ #acctAvatarBtn::after{display:none !important}
§ #acctAvatarBtn img{filter:grayscale(1) contrast(1.1) !important;border-radius:0 !important}
§ #acctInitial{color:#f0f0f0 !important;font-family:'IBM Plex Mono',Prompt,monospace !important;text-shadow:none !important}
§ .acct-cam{border-radius:50% !important;filter:grayscale(1) !important}
§ .acct-mail{font-family:'IBM Plex Mono',Prompt,monospace !important;color:#f2f2f2 !important;letter-spacing:-.01em;text-shadow:none !important}
§ .acct-label,§ .acct-label > :not(.vc-adm-badge){color:#c9c9c9 !important;-webkit-text-fill-color:#c9c9c9}
§ .acct-label::before{background:#c23a3c !important;box-shadow:0 0 0 3px rgba(194,58,60,.2) !important}
§ .vc-adm-badge{background:transparent !important;border:1.5px solid #b81d20 !important;color:#d24a4c !important;border-radius:3px !important;box-shadow:none !important;text-shadow:none !important;transform:rotate(-4deg);font-family:'IBM Plex Mono',Prompt,monospace !important;letter-spacing:.03em}
§ #authClose{border-radius:50% !important;background:rgba(255,255,255,.05) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f0f0f0' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 6l12 12M18 6 6 18'/%3E%3C/svg%3E") center/18px no-repeat !important;border:1px solid rgba(255,255,255,.3) !important;color:#f0f0f0 !important;box-shadow:none !important}
/* หัวข้อกลุ่ม = ด้ายแดง */
§ #authLoggedIn .vc-mg,§ .vc-mg{color:#dcdcdc !important;text-shadow:none !important}
§ #authLoggedIn .vc-mg::before,§ .vc-mg::before{display:inline-block !important;flex:none;color:#c23a3c !important;background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808) !important;-webkit-mask:none !important;mask:none !important;border-radius:50% !important;width:8px !important;height:8px !important;content:"" !important}
§ #authLoggedIn .vc-mg::after,§ .vc-mg::after{background:linear-gradient(90deg,rgba(163,25,28,.85),rgba(163,25,28,.15)) !important;height:1px !important}
/* การ์ดเครดิต = แฟ้มคดี */
§ .vc-wcard{background:repeating-linear-gradient(180deg,transparent 0 23px,rgba(90,70,40,.08) 23px 24px),linear-gradient(172deg,#d9cfb5,#c6b997 60%,#b6a885) !important;border:0 !important;border-radius:4px 4px 6px 6px !important;box-shadow:0 2px 0 #9b8f70,0 18px 30px -12px rgba(0,0,0,.85) !important;overflow:visible !important;transform:none !important}
§ .vc-wcard::before,§ .vc-wcard::after{display:none !important}
§ .vc-wcard .alx-stud,§ .vc-wcard .alx-glare,§ .vc-wcard .vc-wc-sheen,§ .vc-wcard .vc-wc-glare{display:none !important}
§ .vc-wcard .alx-cf{display:block !important;border:0 !important;background:none !important;box-shadow:none !important;overflow:visible !important}
§ .vc-wcard .alx-spine{display:none !important}
§ .vc-wcard .alx-crest{display:block !important;background:none !important;-webkit-mask:none !important;mask:none !important;filter:none !important;opacity:1 !important;width:auto !important;height:auto !important;right:18px !important;top:62px !important;left:auto !important;transform:rotate(-12deg) !important}
§ .vc-wcard .alx-crest::after{content:"CASE FILE" !important;display:block !important;position:static !important;padding:4px 8px;border:2px solid rgba(163,25,28,.5);border-radius:3px;color:rgba(163,25,28,.55);font:700 13px/1 'IBM Plex Mono',monospace;letter-spacing:.12em;background:none !important;width:auto !important;height:auto !important;-webkit-mask:none !important;mask:none !important}
§ .vc-wcard .alx-crest::before,§ .vc-wcard .alx-crest > *{display:none !important}
§ .vc-wcard .alx-crest{overflow:visible !important}
§ .vc-wc-lab{color:#3a342a !important;text-shadow:none !important}
§ .vc-wc-lab svg,§ .vc-wc-lab::before{filter:grayscale(1) brightness(.35) !important}
§ .vc-wc-voice{background:transparent !important;border:1.5px solid rgba(40,34,26,.55) !important;color:#2a251c !important;box-shadow:none !important;text-shadow:none !important}
§ .vc-wc-voice *{color:#2a251c !important;filter:grayscale(1) brightness(.4)}
§ .vc-wc-num{background:rgba(255,255,255,.18) !important;border:1.5px dashed rgba(60,52,40,.55) !important;box-shadow:none !important;border-radius:3px !important}
§ .vc-wc-num::before,§ .vc-wc-num::after{display:none !important}
§ .vc-wc-num b{color:#161616 !important;background:none !important;-webkit-text-fill-color:#161616 !important;text-shadow:none !important;font-family:'IBM Plex Mono',Prompt,monospace !important;filter:none !important}
§ .vc-wc-num small{color:#3a342a !important;-webkit-text-fill-color:#3a342a !important;text-shadow:none !important}
§ .vc-wc-warn{background:rgba(163,25,28,.07) !important;border:1.5px solid rgba(163,25,28,.6) !important;color:#5a1414 !important;box-shadow:none !important}
§ .vc-wc-warn *{color:#5a1414 !important;filter:none}
§ .vc-wc-warn i{filter:grayscale(1) brightness(.3) !important}
§ .vc-wcard > p:not(.vc-wc-num):not(.vc-wc-warn){color:#3a342a !important}
§ .vc-wc-top-up{background:linear-gradient(180deg,#b3211f,#8a1414) !important;border:0 !important;color:#fff !important;border-radius:4px !important;box-shadow:0 2px 0 #5a0c0c,0 10px 18px -8px rgba(0,0,0,.7) !important;text-shadow:0 1px 0 rgba(0,0,0,.3) !important}
§ .vc-wc-top-up::before,§ .vc-wc-top-up::after,§ .vc-wc-top-up .alx-stc,§ .vc-wc-top-up .alx-coin{display:none !important}
§ .vc-wc-top-up *{color:#fff !important}
§ .vc-wc-top-up .alx-arr{filter:grayscale(1) brightness(2.2) !important}
/* การ์ดเมนู = บัตรดัชนีเทาเข้ม */
§ #authLoggedIn .acct-menu .menu-item{border-radius:0 !important;border-left:1px solid #454545 !important;border-right:1px solid #454545 !important;border-top:1px dashed #3d3d3d !important;border-bottom:0 !important}
§ .vc-stat,§ #vdcAcct,§ #vrmAcct,§ #authLoggedIn #adminPanel,§ #authLoggedIn .acct-menu .menu-item,§ .vst-acct{background:linear-gradient(180deg,#2a2a2a,#1f1f1f) !important;border-color:#454545 !important;box-shadow:0 8px 16px -10px rgba(0,0,0,.8) !important}
§ .acct-menu .menu-item::before,§ .acct-menu .menu-item::after{filter:grayscale(1) !important;border-color:#454545 !important}
§ .vc-stat b,§ .vda-tx b,§ .vra-tx b,§ .menu-item .menu-txt b,§ #adminPanel h3,§ .vc-stat-tx b{color:#f0f0f0 !important;text-shadow:none !important}
§ .vc-stat small,§ .vda-tx small,§ .vra-tx small,§ .menu-item .menu-txt small,§ #adminPanel .adm-head p{color:#9e9e9e !important}
§ .vc-stat-ic,§ .vra-ic,§ .vda-ic,§ .menu-ico,§ .vc-mi,§ .adm-ico,§ .acct-ico{filter:grayscale(1) brightness(1.35) !important}
§ .vc-stat > i,§ .vra-chev,§ .vda-chev,§ .vc-mchev,§ .vc-adm-chev,§ .acct-chev{filter:grayscale(1) brightness(.55) sepia(1) saturate(9) hue-rotate(-32deg) brightness(1.1) !important}
/* แต้มรายวัน = หมุด */
§ .vda-dots i{width:9px !important;height:9px !important;border-radius:50% !important;background:#4a4a4a !important;box-shadow:inset 0 0 0 1px #5e5e5e !important}
§ .vda-dots i.is-done{background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808) !important;box-shadow:1px 2px 2px rgba(0,0,0,.5) !important}
§ .vda-dots em{color:#9e9e9e !important}
§ .vda-tx small *,§ .vda-tx small{color:#b0b0b0 !important;-webkit-text-fill-color:#b0b0b0}
§ .vda-pill{background:transparent !important;border:1.5px solid #b81d20 !important;color:#d24a4c !important;border-radius:4px !important;box-shadow:none !important;transform:rotate(-3deg);text-shadow:none !important}
§ .vda-pill small{color:#b8b8b8 !important}
/* ออกจากระบบ = กรอบเส้นแดงหมึก */
§ #authLoggedIn #logoutBtn.acct-out{background:transparent !important;border:1.5px solid rgba(163,25,28,.85) !important;box-shadow:none !important;color:#e46a6c !important}
§ .acct-out *{color:#e46a6c !important;text-shadow:none !important}
§ #authLoggedIn #logoutBtn.acct-out::before,§ #authLoggedIn #logoutBtn.acct-out::after{display:none !important}
§ .vc-acct-foot{color:#8a8a8a !important}
/* ===== การ์ดเครดิต v2: แฟ้มคดีมีมิติ + กระดาษรายงาน + คลิป + ตัวเลขตราปั๊ม + ป้ายเทป + ตราครั่ง + แสงไฟ ===== */
§ .cred-card{padding-top:26px !important}
§ .vc-wcard{contain:none !important;margin-top:10px !important;border-radius:3px 3px 4px 4px !important;
  background:linear-gradient(transparent 0 0),repeating-linear-gradient(180deg,transparent 0 25px,rgba(70,90,140,.13) 25px 26px) 0 58px/100% calc(100% - 58px) no-repeat,linear-gradient(90deg,transparent 22px,rgba(190,40,40,.35) 22px 23.5px,transparent 23.5px),linear-gradient(174deg,#f6f1e4,#ebe3d0 65%,#ddd3bc) !important;
  box-shadow:7px 9px 0 -1px #c5ab78,7px 9px 0 0 rgba(0,0,0,.25),-5px 13px 0 -2px #b3965f,0 26px 34px -14px rgba(0,0,0,.9) !important}
/* แถบแฟ้ม No. 0417 */
§ .vc-wcard .alx-spine b{display:none !important}
§ .vc-wcard.vc-3d .alx-cf i.alx-spine{background:linear-gradient(180deg,#d2b984,#c5ab78) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 -2px 6px rgba(0,0,0,.25) !important;-webkit-mask:none !important;mask:none !important;filter:none !important}
§ .vc-wcard .alx-spine{display:block !important;position:absolute !important;left:16px !important;top:-19px !important;bottom:auto !important;right:auto !important;width:118px !important;height:20px !important;
  border-radius:8px 8px 0 0 !important;background:linear-gradient(180deg,#d2b984,#c5ab78) !important;border:0 !important;transform:none !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35) !important;z-index:-1}
§ .vc-wcard.vc-3d .alx-cf i.alx-spine::after{content:"CASE No. 0417" !important;display:block !important;position:absolute !important;left:12px;top:5px;font:700 10px/1 'IBM Plex Mono',monospace;color:#4a3a1e;letter-spacing:.06em;background:none !important;width:auto !important;height:auto !important}
§ .vc-wcard .alx-spine::before{display:none !important}
/* คลิปหนีบกระดาษ (มุมขวาบน) */
§ .vc-wcard .alx-stud.tr{display:block !important;position:absolute !important;right:34px !important;top:-16px !important;left:auto !important;bottom:auto !important;width:16px !important;height:44px !important;border:0 !important;box-shadow:none !important;border-radius:0 !important;z-index:4;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 44' fill='none' stroke='%23b9bcc2' stroke-width='2.2' stroke-linecap='round'%3E%3Cpath d='M5 38V9a3.5 3.5 0 0 1 7 0v27a5.5 5.5 0 0 1-11 0V12'/%3E%3C/svg%3E") center/contain no-repeat !important;filter:drop-shadow(1px 2px 1.5px rgba(0,0,0,.45))}
§ .vc-wcard .alx-stud.tr::before,§ .vc-wcard .alx-stud.tr::after{display:none !important}
/* มุมกระดาษพับ (ขวาล่าง) */
§ .vc-wcard .alx-stud.br{display:block !important;position:absolute !important;right:0 !important;bottom:0 !important;left:auto !important;top:auto !important;width:26px !important;height:26px !important;border:0 !important;border-radius:0 0 4px 0 !important;z-index:3;
  background:linear-gradient(315deg,#c5ab78 0 49%,#cfc4ab 50%,#e9e1cd 70%,#d8ceb6 100%) !important;box-shadow:-3px -3px 5px -2px rgba(0,0,0,.35) !important}
§ .vc-wcard .alx-stud.br::before,§ .vc-wcard .alx-stud.br::after{display:none !important}
§ .vc-wcard .alx-tw{display:none !important}
/* แสงไฟส่องจากมุมบน */
§ .vc-wcard .vc-wc-glare{display:block !important;position:absolute !important;inset:0 !important;pointer-events:none;z-index:2;border-radius:inherit;background:radial-gradient(75% 55% at 18% -5%,rgba(255,252,238,.55),rgba(255,248,225,.12) 45%,transparent 70%),linear-gradient(180deg,transparent 60%,rgba(60,40,15,.1)) !important;mix-blend-mode:normal !important;animation:none !important;opacity:1 !important;transform:none !important}
/* ตรา CASE FILE ชัดขึ้น */
§ .vc-wcard .alx-crest{top:58px !important;right:16px !important;transform:rotate(-10deg) !important}
§ .vc-wcard .alx-crest::after{border:2.5px solid rgba(163,25,28,.82) !important;color:rgba(163,25,28,.85) !important;font-size:14px !important;padding:5px 9px !important;
  -webkit-mask:radial-gradient(circle at 30% 40%,#000 55%,rgba(0,0,0,.6) 56%,#000 66%),radial-gradient(circle at 75% 70%,#000 50%,rgba(0,0,0,.55) 52%,#000 62%) !important;-webkit-mask-composite:source-in;mask:radial-gradient(circle at 30% 40%,#000 55%,rgba(0,0,0,.6) 56%,#000 66%) !important}
/* หัวการ์ด */
§ .vc-wc-lab{font-family:'IBM Plex Mono',Prompt,monospace !important;letter-spacing:.02em;color:#463c2c !important}
/* เครดิตเสียง = แท็กกระดาษผูกเชือก */
§ .vc-wc-voice{position:relative;background:#efe6cf !important;border:1px solid #b8aa88 !important;border-radius:3px 12px 12px 3px !important;padding-left:18px !important;transform:rotate(5deg);box-shadow:1px 3px 4px rgba(0,0,0,.25) !important}
§ .vc-wc-voice::before{content:"" !important;display:block !important;position:absolute !important;left:6px !important;top:50% !important;width:6px !important;height:6px !important;margin-top:-3px;border-radius:50%;background:#7a6d52 !important;box-shadow:inset 0 1px 1px rgba(0,0,0,.4)}
§ .vc-wc-voice::after{content:"" !important;display:block !important;position:absolute !important;left:8px !important;top:-14px !important;width:1.5px !important;height:14px !important;background:#8a7a5a !important;transform:rotate(-20deg);transform-origin:50% 100%;border:0 !important}
/* ตัวเลข = ตราปั๊มหมึกดำ ใหญ่ ไม่มีกรอบ */
§ .vc-wc-num{background:none !important;border:0 !important;padding:0 !important;margin-top:4px !important;transform:rotate(-2deg);transform-origin:0 100%}
§ .vc-wc-num b{font:800 clamp(64px,19vw,84px)/.9 'IBM Plex Mono',Prompt,monospace !important;color:#151515 !important;-webkit-text-fill-color:#151515 !important;letter-spacing:-.04em;
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 2.05'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23n)'/%3E%3C/svg%3E");mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 2.05'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:nzpump .5s cubic-bezier(.2,1.6,.4,1) .25s both !important;display:inline-block}
§ .vc-wc-num small{font:600 15px/1 'IBM Plex Mono',Prompt,monospace !important;color:#3a3226 !important;-webkit-text-fill-color:#3a3226 !important;margin-left:4px}
@keyframes nzpump{0%{opacity:0;transform:scale(1.9) rotate(-8deg)}55%{opacity:1}75%{transform:scale(.95)}100%{opacity:1;transform:none}}
/* คำเตือน = ป้ายกระดาษแดงติดเทป */
§ .vc-wc-warn{position:relative;width:fit-content !important;max-width:calc(100% - 10px);background:linear-gradient(180deg,#b5231f,#951714) !important;border:0 !important;border-radius:1px !important;color:#fff !important;
  padding:9px 12px 8px !important;margin:6px 0 14px 4px !important;transform:rotate(-1.4deg);box-shadow:0 6px 10px -4px rgba(0,0,0,.45) !important}
§ .vc-wc-warn *{color:#fff !important}
§ .vc-wc-warn i{filter:brightness(0) invert(1) !important}
§ .vc-wc-warn::before{content:"" !important;display:block !important;position:absolute !important;left:50% !important;top:-8px !important;width:54px !important;height:16px !important;margin-left:-27px;background:rgba(255,255,255,.45) !important;transform:rotate(3deg);box-shadow:0 1px 2px rgba(0,0,0,.15) !important;border:0 !important}
§ .vc-wc-warn::after{display:none !important}
§ .vc-wc-sub{color:#4a4032 !important;font-family:Prompt,sans-serif}
§ .vc-wc-sub *{color:#4a4032 !important}
/* ปุ่มเติมเครดิต = แถบแดงหมึก + ตราครั่ง */
§ .vc-wc-top-up{position:relative;padding-left:56px !important;border-radius:3px !important;background:linear-gradient(180deg,#b9241f,#8f1512) !important;
  box-shadow:0 2px 0 #5e0c0b,0 14px 20px -8px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.18) !important;transform:translateY(-1px)}
§ .vc-wc-top-up .alx-coin{display:block !important;position:absolute !important;left:12px !important;top:50% !important;width:36px !important;height:36px !important;margin-top:-18px !important;border-radius:46% 54% 50% 50% !important;border:0 !important;
  background:radial-gradient(circle at 50% 50%,transparent 0 9px,rgba(0,0,0,.18) 9.5px 10.5px,transparent 11px),radial-gradient(circle at 35% 30%,#e0574f,#9e1814 55%,#5a0807) !important;
  box-shadow:0 2px 3px rgba(0,0,0,.45),inset 0 -2px 3px rgba(0,0,0,.35),inset 0 2px 2px rgba(255,180,170,.35) !important;filter:none !important;animation:none !important;transform:rotate(-8deg) !important}
§ .vc-wc-top-up .alx-coin::before,§ .vc-wc-top-up .alx-coin::after{display:none !important}
§ .vc-wc-top-up .alx-coin > *{display:none !important}
§ .vc-wc-top-up:active{transform:translateY(1px)}
/* ===== การ์ดเครดิต v3: มุมขวาบนโล่ง · CASE FILE ประทับใต้ตัวเลข · คำเตือนพิมพ์ดีดแดงขีดเส้นใต้ · แถบแดงเหลือแค่ปุ่ม · ตราครั่งจริง ===== */
§ .vc-wcard .alx-crest{top:98px !important;right:24px !important;left:auto !important;z-index:0 !important;opacity:.42 !important;transform:rotate(-9deg) !important;pointer-events:none}
§ .vc-wcard .alx-crest::after{font-size:15px !important;padding:5px 10px !important}
§ .vc-wc-num{position:relative;z-index:1}
§ .vc-wcard .alx-stud.tr{right:93px !important;top:-18px !important}
§ .vc-wc-voice{transform:rotate(3deg) !important;transform-origin:10px 0}
§ .vc-wc-voice::after{left:8px !important;top:-13px !important;height:13px !important;transform:none !important;width:1.4px !important;background:#7d6e50 !important}
§ .vc-wc-warn{background:none !important;box-shadow:none !important;transform:none !important;padding:0 !important;margin:6px 2px 16px !important;color:#a3191c !important;width:auto !important;max-width:none !important;gap:10px;align-items:flex-start}
§ .vc-wc-warn::before{display:none !important}
§ .vc-wc-warn span{color:#9b1714 !important;font:600 14.5px/1.65 Prompt,sans-serif !important;text-decoration:underline solid rgba(163,25,28,.55);text-decoration-thickness:2px;text-underline-offset:5px;text-decoration-skip-ink:none}
§ .vc-wc-warn i{-webkit-mask:none !important;mask:none !important;min-width:28px;flex:none;width:28px !important;height:28px !important;display:grid !important;place-items:center;border-radius:50% 46% 52% 48% !important;border:2px solid rgba(163,25,28,.85) !important;transform:rotate(-8deg);filter:none !important;margin-top:-2px;box-shadow:inset 0 0 0 0 transparent !important;background:none !important}
§ .vc-wc-warn i > *{display:none !important}
§ .vc-wc-warn i::before{content:"!" !important;display:block !important;font:800 16px/1 Prompt,sans-serif;color:#a3191c;background:none !important;-webkit-mask:none !important;mask:none !important;width:auto !important;height:auto !important;position:static !important}
§ .vc-wc-warn i::after{display:none !important}
§ .vc-wc-top-up{outline:1.5px dashed rgba(255,215,205,.4) !important;outline-offset:-6px !important;box-shadow:0 3px 0 #5e0c0b,0 18px 26px -10px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.2) !important}
§ .vc-wc-top-up .alx-coin{width:44px !important;height:48px !important;margin-top:-24px !important;left:8px !important;border-radius:0 !important;box-shadow:none !important;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 52'%3E%3Cdefs%3E%3CradialGradient id='g' cx='.38' cy='.32' r='.75'%3E%3Cstop offset='0' stop-color='%23e2645a'/%3E%3Cstop offset='.55' stop-color='%23a51a15'/%3E%3Cstop offset='1' stop-color='%235e0a08'/%3E%3C/radialGradient%3E%3CradialGradient id='h' cx='.5' cy='.5' r='.5'%3E%3Cstop offset='.7' stop-color='%238e1512'/%3E%3Cstop offset='1' stop-color='%23b82a22'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d='M33 46c1 3 0 5-2 5s-2-2-1.6-4.4' fill='%238e1512'/%3E%3Cpath d='M24 2c3 0 4 2 7 2s5 0 7 3 1 5 3 7 4 4 3 7-2 4-2 7 2 5 0 8-5 2-7 4-3 5-6 5-4-2-6-2-5 3-8 1-2-4-4-6-5-2-6-5 1-4 0-7-3-5-1-8 4-2 5-5 0-5 3-7 5 0 7-1 2-3 5-3z' fill='url(%23g)'/%3E%3Ccircle cx='24' cy='24.5' r='12.5' fill='url(%23h)' stroke='%235e0a08' stroke-opacity='.45'/%3E%3Cpath d='M18 25l4.5 4.5L31 20' fill='none' stroke='%235e0a08' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round' opacity='.75'/%3E%3Cpath d='M18 24l4.5 4.5L31 19' fill='none' stroke='%23f08a80' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='.55'/%3E%3Cpath d='M12 13c3-4 8-6 13-6' fill='none' stroke='%23fff' stroke-opacity='.35' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat !important;filter:drop-shadow(0 3px 2px rgba(0,0,0,.45)) !important;transform:rotate(-10deg) !important}
/* ===== การ์ดเครดิต v4: ใกล้หมด = วงตัวเลขปากกาแดง + ลูกศร + ลายมือ "ใกล้หมด!" · ข้อความเต็มเป็นบรรทัดเล็กตัวเข้ม ===== */
§ .vc-wc-warn{display:block !important;margin:10px 2px 14px !important;padding:0 !important;gap:0}
§ .vc-wc-warn i{display:none !important}
§ .vc-wc-warn span{color:#3e352a !important;font:500 13.5px/1.55 Prompt,sans-serif !important;text-decoration:none !important}
§ .vc-wc-warn *{color:#3e352a !important}
/* ===== แผงย่อย: ข้อมูลบัญชี (บัตรประจำตัว + ตั๋ว) · ความเป็นส่วนตัว · การแสดงผล · แผงแอดมิน ===== */
§ #authLoggedIn #acctDetail.acct-detail,§ #authLoggedIn #dispPanel.menu-panel,§ #authLoggedIn #privPanel.menu-panel{background:linear-gradient(180deg,rgba(0,0,0,.32),rgba(0,0,0,.18)) !important;outline:1.4px dashed rgba(163,25,28,.6) !important;outline-offset:-7px}
/* ข้อมูลบัญชี v4 (แบบ A): ผังเดิม · การ์ดเทาเข้มแบบเมนู · ตัวเลขขาว · "+ เติม" ขอบแดงหมึก · หลอดแดง */
§ #authLoggedIn #acctDetail .vai-c,§ #authLoggedIn #acctDetail .vai-c.is-mail,§ #authLoggedIn #acctDetail .vai-c.is-check,§ #authLoggedIn #acctDetail .vai-c.is-voice,§ #authLoggedIn #acctDetail .vai-c.is-hist{background:linear-gradient(180deg,#252525,#1c1c1c) !important;border:1px solid #3d3d3d !important;border-radius:12px !important;
  box-shadow:0 8px 16px -10px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04) !important;-webkit-mask:none !important;mask:none !important;outline:0 !important}
§ #authLoggedIn #acctDetail .vai-c::before,§ #authLoggedIn #acctDetail .vai-c::after{display:none !important}
§ #authLoggedIn #acctDetail .vai-ic{background:#141414 !important;border:1px solid #3d3d3d !important;box-shadow:none !important;color:#e6e6e6 !important;filter:none !important}
§ #authLoggedIn #acctDetail .vai-ic *{stroke:#e6e6e6 !important;color:#e6e6e6 !important}
§ #authLoggedIn #acctDetail .vai-c .vai-ic::after{background:#e6e6e6 !important}
§ #authLoggedIn #acctDetail .vai-c.is-mail .vai-ic svg{opacity:0 !important}
§ #authLoggedIn #acctDetail .vai-lab{color:#a8a8a8 !important;-webkit-text-fill-color:#a8a8a8 !important;text-shadow:none !important}
§ #authLoggedIn #acctDetail .vai-mail{color:#f2f2f2 !important;-webkit-text-fill-color:#f2f2f2 !important;text-shadow:none !important}
§ #authLoggedIn #acctDetail .vai-num b,§ #authLoggedIn #acctDetail .vai-cap b{color:#f4f4f4 !important;-webkit-text-fill-color:#f4f4f4 !important;background:none !important;text-shadow:none !important;-webkit-mask:none !important;mask:none !important}
§ #authLoggedIn #acctDetail .vai-num small,§ #authLoggedIn #acctDetail .vai-cap small{color:#bdbdbd !important;-webkit-text-fill-color:#bdbdbd !important}
§ #authLoggedIn #acctDetail .vai-note{color:#9a9a9a !important}
§ #authLoggedIn #acctDetail .vai-add{background:transparent !important;border:1px solid #a3191c !important;color:#e46a6c !important;box-shadow:none !important;text-shadow:none !important}
§ #authLoggedIn #acctDetail .vai-add *{color:#e46a6c !important}
§ #authLoggedIn #acctDetail .vai-add:active{background:rgba(163,25,28,.15) !important}
§ #authLoggedIn #acctDetail .vai-go{color:#c23a3c !important;filter:none !important}
§ #authLoggedIn #acctDetail .vai-go *{stroke:#c23a3c !important;color:#c23a3c !important}
§ #authLoggedIn #acctDetail .vai-bar{background:#3a3a3a !important;box-shadow:none !important}
§ #authLoggedIn #acctDetail .vai-bar i{background:linear-gradient(90deg,#8f1512,#c23a3c) !important;box-shadow:none !important}
§ #authLoggedIn #acctDetail .is-hist .vai-note,§ #authLoggedIn #acctDetail .is-hist .vai-note *{color:#9a9a9a !important;stroke:#9a9a9a !important}
§ #authLoggedIn #acctDetail .is-hist.is-full .vai-note,§ #authLoggedIn #acctDetail .is-hist.is-full .vai-note *,§ #authLoggedIn #acctDetail .is-hist.is-near .vai-note,§ #authLoggedIn #acctDetail .is-hist.is-near .vai-note *{color:#e46a6c !important;stroke:#e46a6c !important}
/* ความเป็นส่วนตัว */
§ #authLoggedIn #privPanel .priv-list li:not(:last-child) b{color:#f0f0f0 !important}
§ #authLoggedIn #privPanel .priv-list li:not(:last-child){color:#b5b5b5 !important}
§ #authLoggedIn #privPanel .priv-list li:last-child,§ #authLoggedIn #privPanel .priv-list li:last-child *{color:#3a3226 !important}
§ #authLoggedIn #privPanel .priv-list li:last-child mark.alx-hl{color:#1a1a1a !important}
§ #authLoggedIn #privPanel .priv-list li:not(:last-child)::before,§ #authLoggedIn #privPanel .priv-list li > i,§ #authLoggedIn #privPanel .priv-list svg{filter:grayscale(1) brightness(1.3) !important}
§ #authLoggedIn #privPanel .priv-list mark.alx-hl{color:#f2f2f2 !important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'%3E%3Cpath d='M1.5 3.6C18 2.4 36 2.9 52 3.3S84 3.9 98.5 2.6' stroke='%23c23a3c' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") !important}
§ #authLoggedIn #privPanel .priv-del{background:transparent !important;border:1.5px solid rgba(163,25,28,.85) !important;color:#e46a6c !important;box-shadow:none !important}
/* การแสดงผล */
§ #authLoggedIn #dispPanel .vds-h{color:#dcdcdc !important}
§ #authLoggedIn #dispPanel .vds-h::before{color:#c23a3c !important}
§ #authLoggedIn #dispPanel .vds-seg button.is-on{background:linear-gradient(174deg,#f3ecdb,#e2d8c0) !important;color:#161616 !important;box-shadow:0 2px 0 #b9ad92,0 6px 10px -4px rgba(0,0,0,.6) !important;outline:0 !important;border:0 !important}
§ #authLoggedIn #dispPanel .vds-seg button.is-on *{color:#161616 !important}
§ #authLoggedIn #dispPanel .vds-seg button:not(.is-on),§ #authLoggedIn #dispPanel .vds-seg button:not(.is-on) *{color:#c8c8c8 !important}
§ #authLoggedIn #dispPanel .vds-ic{filter:grayscale(1) brightness(1.35) !important}
§ #authLoggedIn #dispPanel .vds-tx,§ #authLoggedIn #dispPanel .vds-tx *{color:#efefef !important}
§ #authLoggedIn #dispPanel .vds-tx small{color:#9e9e9e !important}
§ #authLoggedIn #dispPanel .vds-sw i::after{background:radial-gradient(circle at 35% 30%,#ffffff,#c9c9c9 55%,#7a7a7a) !important;box-shadow:0 0 0 1px #111,0 2px 4px rgba(0,0,0,.55) !important}
§ #authLoggedIn #dispPanel .vds-sw input:checked + i{background:linear-gradient(180deg,#b9241f,#8f1512) !important}
§ #authLoggedIn #dispPanel .vds-reset{color:#e46a6c !important;border-color:rgba(163,25,28,.6) !important}
/* แผงแอดมิน */
§ #authLoggedIn #adminPanel .adm-go{background:linear-gradient(180deg,#b9241f,#8f1512) !important;color:#fff !important;border:0 !important;box-shadow:0 2px 0 #5e0c0b,0 10px 18px -8px rgba(0,0,0,.65) !important;text-shadow:none !important}
§ #authLoggedIn #adminPanel .adm-f input{background:#141414 !important;border-color:#4a4a4a !important;color:#f0f0f0 !important}
§ #authLoggedIn #adminPanel .adm-f input:focus{border-color:#a3191c !important;box-shadow:0 0 0 3px rgba(163,25,28,.25) !important}
§ #authLoggedIn #adminPanel .adm-quick button{border-color:#4a4a4a !important;color:#e0e0e0 !important;background:#1b1b1b !important}
§ #authLoggedIn #adminPanel .adm-tile{background:#1b1b1b !important;border-color:#3d3d3d !important}
`;
  siteCss += ACCT.split('§').join('html[data-htheme="noir"][data-view="home"] body[data-sheet="acct"] #authCard');

  /* ---------- แผ่น "เครื่องมือ" (มือถือ) ตอนเปิดจากหน้าแรกธีมนักสืบ — ผังเดิม เปลี่ยนแค่สี ---------- */
  var TOOLS = `
¤ .vct-card{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .25 0 0 0 0 .23 0 0 0 0 .2 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23c)'/%3E%3C/svg%3E"),radial-gradient(90% 30% at 50% 0,rgba(255,250,235,.08),transparent 70%),linear-gradient(170deg,#4e4a45,#33302c 50%,#222120) !important;box-shadow:0 -1px 0 rgba(163,25,28,.8),0 -20px 50px -20px rgba(0,0,0,.9) !important}
¤ .vct-hd{background:linear-gradient(180deg,#1c1c1c,#141414) !important}
¤ .vct-hd::after{background:linear-gradient(90deg,transparent,rgba(163,25,28,.9) 18%,rgba(163,25,28,.9) 82%,transparent) !important}
¤ .vct-hd::before{background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808) !important;border-radius:50% !important;transform:none !important;width:9px !important;height:9px !important;margin-left:-4.5px !important;bottom:-4.5px !important;box-shadow:1px 2px 2px rgba(0,0,0,.55)}
¤ .vct-hd .ic{background:#141414 !important;box-shadow:inset 0 0 0 1px #3d3d3d !important}
¤ .vct-hd .ic svg,¤ .vct-ih .ic svg{background:#e6e6e6 !important}
¤ .vct-hd b{color:#f2f2f2 !important}¤ .vct-hd small{color:#a8a8a8 !important}
¤ .vct-x{background:rgba(255,255,255,.05) !important;border:1px solid rgba(255,255,255,.3) !important;box-shadow:none !important;color:#f0f0f0 !important;border-radius:50% !important}
¤ .vct-gh{color:#dcdcdc !important}
¤ .vct-gh::before{content:"" !important;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e17070,#a3191c 58%,#560808);flex:none}
¤ .vct-gh::after{background:linear-gradient(90deg,rgba(163,25,28,.85),rgba(163,25,28,.12)) !important}
¤ .vct-it,¤ .vct-it[data-tool]{--l1:#252525;--l2:#1c1c1c;background:linear-gradient(180deg,#252525,#1c1c1c) !important;box-shadow:0 0 0 1px #3d3d3d,0 10px 18px -10px rgba(0,0,0,.85) !important}
¤ .vct-it::before{background:linear-gradient(180deg,transparent 14px,rgba(255,255,255,.14) 14px 15.5px,transparent 15.5px 18px,rgba(255,255,255,.14) 18px 19.5px,transparent 19.5px calc(100% - 19.5px),rgba(255,255,255,.14) calc(100% - 19.5px) calc(100% - 18px),transparent calc(100% - 18px) calc(100% - 15.5px),rgba(255,255,255,.14) calc(100% - 15.5px) calc(100% - 14px),transparent calc(100% - 14px)),#1a1a1a !important}
¤ .vct-ih .ic{background:#141414 !important;box-shadow:inset 0 0 0 1px #3d3d3d !important}
¤ .vct-ih b{color:#f2f2f2 !important}
¤ .vct-ih em{color:#e46a6c !important;text-shadow:none !important}
¤ .vct-it p{color:#bdbdbd !important}
¤ mark.vct-hl{color:#ffffff !important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M1 17C20 16 40 16.6 60 16.2S88 16.8 99 15.6' stroke='%23c23a3c' stroke-width='2.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") !important}
¤ .vct-it.has-x2 .vct-tb{border-bottom-color:#3d3d3d !important}
¤ .vct-it.has-x2 .vct-tb button{color:#9a9a9a !important}
¤ .vct-it.has-x2 .vct-tb button.is-on{color:#f2f2f2 !important;background:rgba(255,255,255,.05) !important;box-shadow:inset 1px 0 0 #3d3d3d,inset -1px 0 0 #3d3d3d !important}
¤ .vct-it.has-x2 .vct-tb button.is-on::after{background:#c23a3c !important}
¤ .vct-it.has-x2 .vct-ben{background:#141414 !important;box-shadow:inset 0 0 0 1px #333 !important;color:#ececec !important}
¤ .vct-it.has-x2 .vct-ben b{color:#e46a6c !important}
¤ .vct-it.has-x2 .vct-ben::before{background:linear-gradient(90deg,#7a1010,#a3191c 50%,#7a1010) !important}
¤ .vct-it.has-x2 .vct-bi i{background:#141414 !important;box-shadow:inset 0 0 0 1px #3d3d3d !important}
¤ .vct-it.has-x2 .vct-bi i::after{background:#e6e6e6 !important}
¤ .vct-it.has-x2 .vct-bi b{color:#f2f2f2 !important}¤ .vct-it.has-x2 .vct-bi span{color:#a8a8a8 !important}
¤ .vct-it.has-x2 .vct-bi{border-color:#333 !important}
¤ .vct-it.has-x2 .vct-hw li{color:#cfcfcf !important}
¤ .vct-it.has-x2 .vct-hw li::before{background:#141414 !important;color:#f2f2f2 !important;box-shadow:inset 0 0 0 1.2px #555 !important;font-family:'IBM Plex Mono',monospace !important}
¤ .vct-it.has-x2 .vct-hw li:not(:last-child)::after{background:#3d3d3d !important}
¤ .vct-it.has-x2 .vct-mo{background:transparent !important;box-shadow:inset 0 0 0 1px #4a4a4a !important;color:#e6e6e6 !important}
¤ .vct-ac button{border:1px solid #4a4a4a !important;background:transparent !important;color:#f0f0f0 !important}
¤ .vct-ac button.p{border:0 !important;background:linear-gradient(180deg,#b9241f,#8f1512) !important;color:#fff !important;box-shadow:0 2px 0 #5e0c0b,0 10px 18px -8px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.18) !important;text-shadow:0 1px 0 rgba(0,0,0,.3) !important}
`;
  siteCss += TOOLS.split('¤').join('html[data-htheme="noir"][data-view="home"] body .vct');
  siteCss += 'html[data-htheme="noir"][data-view="home"] body[data-sheet="hist"] #authCard .vd-meta{color:#e46a6c !important}' +
    'html[data-htheme="noir"][data-view="home"] body[data-sheet="hist"] #authCard .sheet-head h2::after,html[data-htheme="noir"][data-view="home"] body[data-sheet="hist"] #authCard .sheet-head .sheet-title::after{background:linear-gradient(90deg,rgba(163,25,28,.9),rgba(163,25,28,.2)) !important}';
  /*NZHIST*/ siteCss += "html[data-htheme=\"noir\"]{--nzn:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .25 0 0 0 0 .23 0 0 0 0 .2 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23c)'/%3E%3C/svg%3E\")}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard{background:radial-gradient(90% 22% at 50% 0%,rgba(196,196,196,.1),transparent 70%),linear-gradient(rgba(6,6,6,.62),rgba(6,6,6,.74)),var(--nzn) 0 0/600px 600px,repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 96px,rgba(0,0,0,.3) 96px 99px),linear-gradient(180deg,#3f3f3f,#323232 60%,#282828) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard .sheet-head{background:radial-gradient(130% 80% at 0% 0%,rgba(207,207,207,.1),transparent 50%),var(--nzn) 0 0/180px 180px,linear-gradient(165deg,#2a2a2a,#1d1d1d 55%,#151515) !important;box-shadow:inset 0 -1px 0 rgba(159,159,159,.32),0 6px 14px rgba(0,0,0,.35) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard .sheet-head h2{color:#e0e0e0 !important;border-color:rgba(159,159,159,.3) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc{background:radial-gradient(120% 60% at 0% 0%,rgba(217,217,217,.07),transparent 55%),var(--nzn) 0 0/180px 180px,linear-gradient(160deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.1),0 0 0 1px rgba(0,0,0,.5),0 8px 18px rgba(0,0,0,.45) !important;outline:1.2px dashed rgba(159,159,159,.28) !important;color:#dbdbdb !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc::before{background:linear-gradient(180deg,transparent 14px,rgba(159,159,159,.5) 14px 15.5px,transparent 15.5px 18px,rgba(159,159,159,.5) 18px 19.5px,transparent 19.5px calc(100% - 19.5px),rgba(159,159,159,.5) calc(100% - 19.5px) calc(100% - 18px),transparent calc(100% - 18px) calc(100% - 15.5px),rgba(159,159,159,.5) calc(100% - 15.5px) calc(100% - 14px),transparent calc(100% - 14px)),linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.25) 70%,rgba(217,217,217,.08)) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-h b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-h small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-h .ic{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),inset 0 -1px 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-h .ic svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-rf{background:linear-gradient(180deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.14),0 0 0 1px #0f0f0f !important;color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-st{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),inset 0 -1px 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-st b{color:#b8b8b8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-st small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-sec > p{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-sec > p::before{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-sec > p em{color:#787878 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-row{box-shadow:inset 0 1px 3px rgba(0,0,0,.45),inset 0 -1px 0 rgba(217,217,217,.05) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-tx b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-tx small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-ar{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-tx em[style*=\"#f5c451\"]{color:#9b9b9b !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-pg{background:linear-gradient(180deg,#cccccc,#b0b0b0) !important;color:#2f2f2f !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-pg i{background:#a3191c !important;color:#dfdfdf !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-cd{color:#afafaf !important;border:1px solid rgba(159,159,159,.3) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vcc-empty{color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vct-cc{background:var(--nzn) 0 0/180px 180px,linear-gradient(160deg,#2e3a4c,#1f2836) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.08),0 0 0 1px rgba(0,0,0,.5),0 6px 14px rgba(0,0,0,.4) !important;color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vct-cc span.i{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),inset 0 -1px 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vct-cc span.i svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vct-cc small{color:#a5a5a5 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vct-cc em{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-txt b{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-txt small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-period{background:linear-gradient(180deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.14),0 0 0 1px #0f0f0f,0 2px 4px rgba(0,0,0,.4) !important;color:#d4d4d4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-period svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-strip{background:radial-gradient(120% 60% at 0% 0%,rgba(217,217,217,.07),transparent 55%),var(--nzn) 0 0/180px 180px,linear-gradient(160deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.1),0 0 0 1px rgba(0,0,0,.5),0 6px 14px rgba(0,0,0,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-strip .ls-cell + .ls-cell{border-color:rgba(159,159,159,.2) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ls-cell:not(.is-ok):not(.is-pin) svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ls-cell.is-ok svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ls-cell.is-pin svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ls-num{color:#b8b8b8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ls-v small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-trend button{border:1px solid rgba(159,159,159,.22) !important;color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-trend b{color:#b8b8b8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .ld-trend-h{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-tabs{border-bottom:1px solid rgba(159,159,159,.28) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-tab{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-tab.is-on{color:#bbbbbb !important;box-shadow:inset 1px 0 0 rgba(159,159,159,.22),inset -1px 0 0 rgba(159,159,159,.22),inset 0 1px 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-tab.is-on::after{background:linear-gradient(90deg,#7b7b7b,#b5b5b5,#7b7b7b) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-seg-b{border:1px solid rgba(159,159,159,.22) !important;color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-seg-b.is-on{background:linear-gradient(180deg,#3d3d3d,#262626) !important;color:#bbbbbb !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.16),0 0 0 1px #0f0f0f,0 2px 4px rgba(0,0,0,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-seg-b[data-seg=\"all\"] svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-seg-b[data-seg=\"done\"] svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-seg-b[data-seg=\"pin\"] svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-chip{border:1px solid rgba(159,159,159,.22) !important;color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-chip.is-on:not(.is-plain){background:linear-gradient(180deg,#3d3d3d,#262626) !important;color:#bbbbbb !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-day-h{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-day-h > span::before{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-day-n{color:#afafaf !important;box-shadow:inset 0 0 0 1px rgba(159,159,159,.3) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-day-line{background:linear-gradient(90deg,rgba(159,159,159,.45),transparent) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-day-chev{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr-day-list::before{background:repeating-linear-gradient(180deg,rgba(159,159,159,.45) 0 3px,transparent 3px 6px) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr2::before,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr-day:first-of-type .hr2:first-child::before{background:radial-gradient(circle at 35% 30%,#d3d3d3,#898989 55%,#3b3b3b) !important;box-shadow:0 1px 2px rgba(0,0,0,.6),0 0 0 1px #191919 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr2,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr-day:first-of-type .hr2:first-child{background:radial-gradient(120% 60% at 0% 0%,rgba(217,217,217,.07),transparent 55%),var(--nzn) 0 0/180px 180px,linear-gradient(160deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.1),0 0 0 1px rgba(0,0,0,.5),0 6px 14px rgba(0,0,0,.42) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr2::after{background:linear-gradient(180deg,#3b3b3b,#323232) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.12),-1px 0 0 rgba(0,0,0,.5),1px 0 0 rgba(0,0,0,.5),0 -1px 0 rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #histList .hr2.is-pinned{box-shadow:inset 0 1px 0 rgba(217,217,217,.1),0 0 0 1px rgba(159,159,159,.45),0 6px 14px rgba(0,0,0,.42) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-main b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-no{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-chip{color:#a3a3a3 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-chip svg{color:#a3a3a3 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-chip.is-pin{color:#afafaf !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-chip.is-pin::before{background:radial-gradient(circle at 35% 30%,#d3d3d3,#898989 55%,#3b3b3b) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-review{border:1.4px solid rgba(134,134,134,.7) !important;color:#a0a0a0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-time{color:#838383 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-time svg{color:#9c9c9c !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hr-menu{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-review{background:var(--nzn) 0 0/180px 180px,linear-gradient(180deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.16),0 0 0 1px #0f0f0f,0 6px 16px rgba(0,0,0,.55) !important;color:#bbbbbb !important;outline:1.2px dashed rgba(159,159,159,.3) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-review .lr-t{color:#bbbbbb !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-review b{color:#cecece !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-review i{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .lib-review svg{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .hist-tools{background:linear-gradient(180deg,rgba(26,26,26,.96),rgba(26,26,26,.9)) !important;border-color:rgba(159,159,159,.18) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard .sheet-head h2::after,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard .sheet-head h2{border-bottom-color:rgba(159,159,159,.35) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head{background:radial-gradient(circle at 100% 100%,transparent 8px,#3e3e3e 8.5px,#838383 9.5px,#686868 15px) left top/15px 15px no-repeat,radial-gradient(circle at 0 100%,transparent 8px,#3e3e3e 8.5px,#838383 9.5px,#686868 15px) right top/15px 15px no-repeat,radial-gradient(circle at 100% 0,transparent 8px,#3e3e3e 8.5px,#838383 9.5px,#686868 15px) left bottom/15px 15px no-repeat,radial-gradient(circle at 0 0,transparent 8px,#3e3e3e 8.5px,#838383 9.5px,#686868 15px) right bottom/15px 15px no-repeat,radial-gradient(70% 60% at 50% 0%,rgba(207,207,207,.16),transparent 70%),var(--nzn) 0 0/400px 200px,linear-gradient(180deg,#2a2a2a,#1e1e1e) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.12),inset 0 0 0 1px rgba(0,0,0,.4),0 0 0 1px #0c0c0c,0 10px 18px rgba(0,0,0,.55) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-top i{background:linear-gradient(180deg,rgba(217,217,217,.07),transparent 45%),var(--nzn) 0 0/400px 200px,linear-gradient(180deg,#4c4c4c,#3f3f3f 60%,#343434) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.14),inset 0 -1px 0 rgba(0,0,0,.4),0 0 0 1px #0f0f0f,0 2px 3px rgba(0,0,0,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-top i::before{background:linear-gradient(180deg,#d2d2d2,#b0b0b0) !important;box-shadow:0 0 0 1.5px #686868,0 0 0 2.2px #252525 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-top i::after{background:radial-gradient(circle at 35% 30%,#b8b8b8,#585858 70%) !important;box-shadow:0 0 0 .8px #181818,0 1px 1px rgba(0,0,0,.6) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-main::before{background:linear-gradient(180deg,rgba(217,217,217,.07),transparent 45%),var(--nzn) 0 0/400px 200px,linear-gradient(180deg,#4c4c4c,#3f3f3f 60%,#343434) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.16),inset 0 -2px 0 rgba(0,0,0,.4),0 0 0 1px #0f0f0f,0 6px 10px rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-main::after{background:linear-gradient(180deg,#070707,#131313) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-cab-main > .alx-grv{box-shadow:inset 0 1px 0 rgba(0,0,0,.5),inset 0 -1px 0 rgba(217,217,217,.12),inset 1px 0 0 rgba(0,0,0,.35),inset -1px 0 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt{background:repeating-linear-gradient(180deg,transparent 0 19px,rgba(100,100,100,.14) 19px 20px) 0 6px,linear-gradient(180deg,#dbdbdb,#c0c0c0) !important;box-shadow:0 0 0 3px #6b6b6b,0 0 0 4px #303030,inset 0 0 10px rgba(75,75,75,.2),0 4px 6px 3px rgba(0,0,0,.35) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt::before,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt::after{background:radial-gradient(circle at 35% 30%,#b8b8b8,#585858 70%) !important;box-shadow:0 0 0 1px #181818,0 1px 1px rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt b{color:#252525 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt b[data-n]::after{color:#525252 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .vault-txt small{color:#4d4d4d !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-pull::before{background:linear-gradient(180deg,#919191,#686868 60%,#424242) !important;box-shadow:inset 0 1px 0 rgba(232,232,232,.35),0 0 0 1px #181818,0 2px 2px rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-pull::after{border:3px solid #757575 !important;box-shadow:0 2px 2px rgba(0,0,0,.45),inset 0 -1px 0 rgba(232,232,232,.25) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #historyPanel .vault-head .alx-pull i{background:radial-gradient(circle at 35% 30%,#d4d4d4,#585858 70%) !important}"; /*/NZHIST*/
  /*NZHIST2*/ siteCss += "\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .vcc-st{background:linear-gradient(180deg,#232323,#1a1a1a) !important;border:1px solid #3d3d3d !important;box-shadow:0 8px 16px -10px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04) !important;border-radius:12px !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .vcc-st b{color:#f4f4f4 !important;-webkit-text-fill-color:#f4f4f4 !important;text-shadow:none !important;background:none !important;font-size:24px !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .vcc-st small{color:#9e9e9e !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .vcc-st.nz-hot b{color:#ff6b68 !important;-webkit-text-fill-color:#ff6b68 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ld-strip{background:linear-gradient(180deg,#232323,#1a1a1a) !important;border:1px solid #3d3d3d !important;box-shadow:0 8px 16px -10px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04) !important;border-radius:12px !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ls-cell{background:none !important;box-shadow:none !important;border:0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ls-cell + .ls-cell{border-left:1px solid #3a3a3a !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ls-cell svg,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-seg-b svg{filter:grayscale(1) brightness(1.8) contrast(.9)}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ls-num{color:#f4f4f4 !important;-webkit-text-fill-color:#f4f4f4 !important;text-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .ls-cell small{color:#9e9e9e !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-tabs{border-bottom:1px solid #3d3d3d !important;background:none !important;box-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-tab{color:#9a9a9a !important;background:transparent !important;box-shadow:none !important;border:0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-tab.is-on{color:#f4f4f4 !important;background:rgba(255,255,255,.05) !important;box-shadow:inset 1px 0 0 #3d3d3d,inset -1px 0 0 #3d3d3d !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-tab::after,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-tab.is-on::after{background:#c23a3c !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-search input{background:#141414 !important;border:1px solid #3d3d3d !important;color:#f0f0f0 !important;box-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-search input::placeholder{color:#7a7a7a !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .hist-search input:focus{border-color:#a3191c !important;box-shadow:0 0 0 3px rgba(163,25,28,.25) !important;outline:0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-seg-b,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-chip{background:#1a1a1a !important;border:1px solid #444 !important;color:#d8d8d8 !important;box-shadow:none !important;text-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-seg-b.is-on,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-chip.is-on:not(.is-plain){background:#1a1a1a !important;border:1.5px solid #c23a3c !important;color:#ffffff !important;box-shadow:0 0 0 3px rgba(163,25,28,.15) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-seg-b *,html[data-htheme=\"noir\"][data-view=\"home\"] body[data-sheet=\"hist\"] #authCard #historyPanel .lib-chip *{color:inherit !important}\n"; /*/NZHIST2*/
  /*NZVRH*/ siteCss += "html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-card{background:radial-gradient(90% 22% at 50% 0%,rgba(196,196,196,.1),transparent 70%),linear-gradient(rgba(6,6,6,.6),rgba(6,6,6,.72)),var(--nzn) 0 0/600px 600px,repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 96px,rgba(0,0,0,.3) 96px 99px),linear-gradient(180deg,#3f3f3f,#323232 60%,#282828) !important;box-shadow:0 -1px 0 rgba(159,159,159,.28),0 -20px 50px -20px rgba(0,0,0,.9) !important;color:#dbdbdb !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-grip{background:rgba(159,159,159,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head{background:radial-gradient(130% 80% at 0% 0%,rgba(207,207,207,.1),transparent 50%),var(--nzn) 0 0/180px 180px,linear-gradient(165deg,#2a2a2a,#1d1d1d 55%,#151515) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head::after{background:linear-gradient(90deg,transparent,rgba(159,159,159,.45) 30%,rgba(159,159,159,.45) 70%,transparent) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head::before{background:linear-gradient(135deg,#c0c0c0,#7b7b7b) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head h3{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head p{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head .vrm-ic{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),inset 0 -1px 0 rgba(217,217,217,.08) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head .vrm-ic::after{background:linear-gradient(180deg,#c0c0c0,#989898 55%,#6f6f6f) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-x{background:linear-gradient(180deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.14),0 0 0 1px #0f0f0f,0 2px 4px rgba(0,0,0,.45) !important;color:#d4d4d4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-new{background:linear-gradient(180deg,#474747,#303030 60%,#252525) !important;color:#b8b8b8 !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.2),0 0 0 1px #0f0f0f,0 3px 0 #0c0c0c,0 5px 10px rgba(0,0,0,.4) !important;outline:1.2px dashed rgba(159,159,159,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-allcal{border:1px solid rgba(212,212,212,.3) !important;color:#d4d4d4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-allcal svg{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form input,html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form select{border:1px solid rgba(159,159,159,.22) !important;color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form button[type=submit]{background:linear-gradient(180deg,#474747,#252525) !important;color:#b8b8b8 !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.2),0 0 0 1px #0f0f0f !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-empty{color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh div.vrh-empty > b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li{color:#b9b9b9 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li::before{background:radial-gradient(circle at 35% 30%,#3d3d3d,#1e1e1e) !important;color:#b8b8b8 !important;box-shadow:inset 0 0 0 1.2px rgba(159,159,159,.55),0 2px 4px rgba(0,0,0,.45) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5::before{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5 span{color:#afafaf !important;box-shadow:inset 0 0 0 1px rgba(159,159,159,.3) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row{background:radial-gradient(120% 60% at 0% 0%,rgba(217,217,217,.07),transparent 55%),var(--nzn) 0 0/180px 180px,linear-gradient(160deg,#323232,#212121) !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.1),0 0 0 1px rgba(0,0,0,.5),0 5px 12px rgba(0,0,0,.4) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-txt b{color:#e0e0e0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-txt small{color:#939393 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row.is-near .vrh-txt small{color:#a0a0a0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-acts button{background:linear-gradient(180deg,#323232,#212121) !important;color:#989898 !important;box-shadow:inset 0 1px 0 rgba(217,217,217,.12),0 0 0 1px #0f0f0f !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-acts svg{color:#989898 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-fine{color:#a3a3a3 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-fine::before{background:#989898 !important}"; /*/NZVRH*/
  /*NZVRH2*/ siteCss += "\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head{background:linear-gradient(180deg,#121212,#0a0a0a) !important;border-bottom:0 !important;position:relative}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head::after{background:linear-gradient(90deg,transparent 2%,#a3191c 14%,#c23a3c 50%,#a3191c 86%,transparent 98%) !important;height:1.5px !important;opacity:.95 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head::before{background:radial-gradient(circle at 35% 30%,#ff8a86,#c23a3c 45%,#5e0b0d) !important;box-shadow:0 2px 3px rgba(0,0,0,.7),0 0 0 1px #3a0507 !important;border-radius:50% !important;transform:none !important;width:10px !important;height:10px !important;margin-left:-5px !important;bottom:-5px !important;z-index:2 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head .vrm-ic{background:#1c1c1c !important;border:1px solid #3d3d3d !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head .vrm-ic svg{color:#f4f4f4 !important;stroke:#f4f4f4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head .vrm-ic::after{background:#f4f4f4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head h3{color:#f6f6f6 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-head p{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-x{background:#2a2a2a !important;border:1px solid #4a4a4a !important;color:#e6e6e6 !important;box-shadow:0 2px 6px rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-new{background:linear-gradient(180deg,#b9241f,#8f1512) !important;border:1px solid #5e0b0d !important;color:#fff !important;text-shadow:0 1px 0 rgba(0,0,0,.35) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 6px 14px -6px rgba(163,25,28,.6) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-new::before,html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-new::after{border-color:rgba(255,255,255,.28) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-allcal{background:transparent !important;border:1px solid #4a4a4a !important;color:#f0f0f0 !important;box-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-allcal svg{color:#f0f0f0 !important;stroke:currentColor !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form button[type=submit]{background:linear-gradient(180deg,#b9241f,#8f1512) !important;color:#fff !important;border:1px solid #5e0b0d !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form input,html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form select{background:#141414 !important;border:1px solid #3d3d3d !important;color:#f0f0f0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form input:focus,html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-form select:focus{border-color:#a3191c !important;box-shadow:0 0 0 3px rgba(163,25,28,.25) !important;outline:0 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh div.vrh-empty .vrm-ic{background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 120'%3E %3Cdefs%3E%3ClinearGradient id='pp' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23efe9da'/%3E%3Cstop offset='1' stop-color='%23d9d1bd'/%3E%3C/linearGradient%3E %3CradialGradient id='pn' cx='.35' cy='.3' r='.8'%3E%3Cstop offset='0' stop-color='%23ff8a86'/%3E%3Cstop offset='.45' stop-color='%23c23a3c'/%3E%3Cstop offset='1' stop-color='%235e0b0d'/%3E%3C/radialGradient%3E%3C/defs%3E %3Cpath d='M4 22 C40 30 52 24 70 20' stroke='%23a3191c' stroke-width='1.3' fill='none' opacity='.85'/%3E %3Cpath d='M70 20 C92 26 110 18 136 30' stroke='%23a3191c' stroke-width='1.3' fill='none' opacity='.85'/%3E %3Cellipse cx='72' cy='112' rx='44' ry='4.5' fill='%23000' opacity='.45'/%3E %3Cg transform='rotate(-4 70 64)'%3E %3Crect x='30' y='22' width='82' height='84' fill='%23000' opacity='.35' transform='translate(3 4)'/%3E %3Crect x='30' y='22' width='82' height='84' fill='url(%23pp)'/%3E %3Cpath d='M30 38h82' stroke='%23c23a3c' stroke-width='.9' opacity='.55'/%3E %3Cpath d='M40 52h58M40 63h62M40 74h50M40 85h36' stroke='%238d8778' stroke-width='1.6' stroke-linecap='round' stroke-dasharray='2 5' opacity='.8'/%3E %3Ctext x='96' y='96' font-family='Georgia,serif' font-size='22' font-weight='700' fill='%23a3191c' opacity='.8'%3E%3F%3C/text%3E %3C/g%3E %3Cline x1='70' y1='22' x2='71' y2='30' stroke='%23555' stroke-width='1.4'/%3E %3Ccircle cx='70' cy='20' r='6.5' fill='url(%23pn)' stroke='%233a0507' stroke-width='.7'/%3E %3Ccircle cx='68' cy='18' r='1.8' fill='%23fff' opacity='.6'/%3E %3C/svg%3E\") center/100% 100% no-repeat !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh div.vrh-empty > b{color:#f6f6f6 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li::before{background:#1a1a1a !important;color:#fff !important;font-family:inherit !important;box-shadow:inset 0 0 0 1.3px #6a6a6a,0 2px 4px rgba(0,0,0,.5) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .alx-st li b{color:#f6f6f6 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-fine{color:#8f8f8f !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-fine::before{background:#8f8f8f !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row{background:linear-gradient(180deg,#252525,#1c1c1c) !important;border:1px solid #3d3d3d !important;box-shadow:0 8px 16px -10px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04) !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-txt b{color:#f4f4f4 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-txt small{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row.is-near .vrh-txt small,html[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row.is-over .vrh-txt small{color:#a8a8a8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .nz-left{display:table;margin:2px 0 3px;padding:0 8px;border:1px solid #c23a3c;border-radius:999px;color:#ff8a86 !important;font-weight:600;line-height:1.5}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-row:not(.is-near):not(.is-over) .nz-left{border-color:#555;color:#d8d8d8 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-acts button{background:#1a1a1a !important;border:1px solid #444 !important;color:#e0e0e0 !important;box-shadow:none !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-acts svg{color:#e0e0e0 !important;stroke:currentColor !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-acts .vrh-del{color:#ff8a86 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5{color:#e6e6e6 !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5::before{color:#c23a3c !important}\nhtml[data-htheme=\"noir\"][data-view=\"home\"] body .vrh .vrh-g h5 span{background:#2a2a2a !important;border:1px solid #4a4a4a !important;color:#f0f0f0 !important}\n"; /*/NZVRH2*/
  /*NZDESK*/
  /* คอม: แปลงกฎ noir ของหน้ามือถือ (data-view="home") ไปใช้กับหน้าบัญชีบนคอม (data-view="desk") — รูปแบบเดียวกับ desk-acct.css */
  function deskify(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    var SKIP = /\.sheet-head|\.sheet-body|\.sheet-x|\.sheet-grab|#authCard\s*$|#authCard::|#authCard:not|#authBackdrop|sheet-backdrop|#authLoggedIn(:not\(\[hidden\]\))?\s*$|#authLoggedIn\s*>\s*\.(cred-card|wallet)\s*$|\.wallet\s*>\s*\.pane/;
    var D = '[data-view="desk"][data-desk="acct"] body';
    function split(p) { var o = [], d = 0, c = ''; for (var i = 0; i < p.length; i++) { var ch = p[i]; if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--; if (ch === ',' && !d) { o.push(c.trim()); c = ''; } else c += ch; } o.push(c.trim()); return o; }
    function map(x) {
      if (x.indexOf('[data-view="home"]') < 0) return null;
      if (/body\[data-sheet="hist"\]|\.vrh\b/.test(x)) return null;   /* ประวัติ/แจ้งเตือนบนคอม: ยังไม่ได้ทำ (ข้อ 7) */
      if (/body\[data-sheet="/.test(x)) { if (SKIP.test(x)) return null; return x.replace(/\[data-view="home"\]\s*body\[data-sheet="(acct|hist)"\]/, D); }
      if (/\.bottom-nav/.test(x)) return null;
      return x.replace('[data-view="home"]', '[data-view="desk"]');
    }
    var out = [], i = 0;
    while (true) {
      var j = css.indexOf('{', i); if (j < 0) break;
      var pre = css.slice(i, j).trim(), d = 1, k = j + 1;
      while (k < css.length && d) { var ch = css[k]; if (ch === '{') d++; else if (ch === '}') d--; k++; }
      var body = css.slice(j + 1, k - 1); i = k;
      if (pre.charAt(0) === '@') continue;
      var s = split(pre).map(map).filter(Boolean);
      if (s.length) out.push(s.join(',') + '{' + body + '}');
    }
    return out.join('\n');
  }
  var deskCss = "html[data-htheme=\"noir\"][data-view=\"desk\"][data-desk=\"acct\"] body{background:var(--nzn) 0 0/180px 180px,radial-gradient(70% 45% at 50% 0,rgba(255,250,235,.10),transparent 70%),linear-gradient(170deg,#3d3a36,#2a2826 50%,#1d1c1b) fixed !important}\nhtml[data-htheme=\"noir\"][data-view=\"desk\"] body .vct .vct-it{--c:#cfcfcf !important}\nhtml[data-htheme=\"noir\"][data-view=\"desk\"] body .vct .vct-card .vct-hd .ic svg,html[data-htheme=\"noir\"][data-view=\"desk\"] body .vct .vct-card .vct-ih .ic svg{background:none !important;color:#e6e6e6 !important;stroke:#e6e6e6 !important}\nhtml[data-htheme=\"noir\"][data-view=\"desk\"] body .vct .vct-pts span::before{color:#e46a6c !important}\n";
  /*/NZDESK*/
  function siteInit() {
    if (!document.getElementById('nz-site')) { var st = document.createElement('style'); st.id = 'nz-site'; st.textContent = siteCss + '\n' + deskify(siteCss) + deskCss; document.head.appendChild(st); }
    function addHb(el) { if (el && !el.querySelector(':scope > .nz-hb')) { var i = document.createElement('i'); i.className = 'nz-hb'; i.setAttribute('aria-hidden', 'true'); el.insertBefore(i, el.firstChild); } }
    addHb(document.querySelector('.site-header')); addHb(document.querySelector('.bottom-nav'));
    function addIc(btn) {
      if (!btn || btn.querySelector('.nz-ic')) return; var o = btn.querySelector('svg'); if (!o) return;
      var r = o.getBoundingClientRect(), cs = getComputedStyle(o), w = r.width || parseFloat(cs.width) || 22, h = r.height || parseFloat(cs.height) || 22;
      var n = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); n.setAttribute('class', 'nz-ic'); n.setAttribute('viewBox', '0 0 24 24'); n.setAttribute('aria-hidden', 'true');
      n.setAttribute('fill', 'none'); n.setAttribute('stroke', 'currentColor'); n.setAttribute('stroke-width', '1.7'); n.setAttribute('stroke-linecap', 'round'); n.setAttribute('stroke-linejoin', 'round');
      n.style.width = w + 'px'; n.style.height = h + 'px'; n.innerHTML = FEDORA; o.parentNode.insertBefore(n, o.nextSibling);
    }
    function pin() { var c = document.querySelector('.site-header .dx-nav a[href="#checkCard"]'); if (c && !c.querySelector('.nz-pin')) { var i = document.createElement('i'); i.className = 'nz-pin'; i.setAttribute('aria-hidden', 'true'); c.appendChild(i); } }
    function icons() { addIc(document.querySelector('.bottom-nav .bn-item[data-nav="acct"]')); }
    icons(); setTimeout(icons, 1500); setTimeout(icons, 4000);
    /* ประวัติ: ช่อง "ฉบับเสี่ยงสูง" / "ข้อที่ยังไม่แก้" เป็นแดงเฉพาะตอนมากกว่า 0 */
    function hot() { document.querySelectorAll('#historyPanel .vcc-stats .vcc-st').forEach(function (e, i) { if (i !== 1 && i !== 2) return; var b = e.querySelector('b'), n = parseInt((b && b.textContent) || '0', 10); e.classList.toggle('nz-hot', n > 0); }); }
    var hpo = false; function hwatch() { var hp = document.getElementById('historyPanel'); if (!hp || hpo) return !!hp; hpo = true; new MutationObserver(function () { hot(); }).observe(hp, { childList: true, subtree: true, characterData: true }); hot(); return true; }
    if (!hwatch()) { var ht = 0, hi = setInterval(function () { if (hwatch() || ++ht > 60) clearInterval(hi); }, 1000); }
    /* แจ้งเตือนวันสำคัญ: ครอบ "อีก N วัน" เป็นป้ายขอบแดง (แค่ห่อข้อความเดิม ไม่เปลี่ยนคำ) */
    function pills(root) { root.querySelectorAll('.vrh-row .vrh-txt small').forEach(function (s) { if (s.querySelector('.nz-left')) return; var t = s.firstChild; if (!t || t.nodeType !== 3) return; var k = t.nodeValue.indexOf(' · '); if (k < 1) return; var sp = document.createElement('span'); sp.className = 'nz-left'; sp.textContent = t.nodeValue.slice(0, k); t.nodeValue = t.nodeValue.slice(k + 3); s.insertBefore(sp, t); }); }
    var vrO = null; new MutationObserver(function () { var v = document.querySelector('.vrh'); if (v && v !== vrO) { vrO = v; pills(v); new MutationObserver(function () { pills(v); }).observe(v, { childList: true, subtree: true }); } }).observe(document.body, { childList: true });
    if (document.querySelector('.vrh')) { vrO = document.querySelector('.vrh'); pills(vrO); new MutationObserver(function () { pills(vrO); }).observe(vrO, { childList: true, subtree: true }); }


    /* แถบล่างอาจถูกสร้างทีหลัง (ตอนล็อกอิน) */
    if (!document.querySelector('.bottom-nav')) { var tries = 0, iv = setInterval(function () { var bn = document.querySelector('.bottom-nav'); if (bn) { addHb(bn); icons(); } if (bn || ++tries > 20) clearInterval(iv); }, 500); }
  }

  var Z = null;
  function init(SR, host) {
    try { siteInit(); } catch (e) {}
    host.__thQuiet = true;   /* ไม่ใช้เสียงแว่นขยายของฉากเดิม */
    var st = SR.getElementById('st'), cam = SR.getElementById('cam');
    var nz = document.createElement('div'); nz.className = 'nz'; nz.setAttribute('aria-hidden', 'true'); nz.innerHTML = buildBoard(); st.insertBefore(nz, cam.nextSibling);
    /* หลอดไฟ: อยู่เหนือเงามืดหลังหัวข้อ แต่ใต้ตัวหัวข้อ */
    var top = document.createElement('div'); top.className = 'nz-top'; top.setAttribute('aria-hidden', 'true');
    top.innerHTML = '<div class="nz-sw"><div class="nz-cord"></div><div class="nz-bulb"></div></div>'; st.insertBefore(top, SR.getElementById('ttl'));
    var fx = document.createElement('div'); fx.className = 'nz-fx'; fx.setAttribute('aria-hidden', 'true'); fx.innerHTML = '<div class="nr-fl"></div><div class="nr-sc"></div><div class="nr-gr"></div>'; st.appendChild(fx);
    Z = { top: top, t0: performance.now(), dl: nz.querySelector('.nz-dl'), ev0: nz.querySelector('.nz-s .ev0'), host: host, st: st, nz: nz, b: nz.querySelector('.nz-b'), svg: nz.querySelector('.nz-s'), dc: nz.querySelector('.nz-s .dc'), ev: nz.querySelector('.nz-s .ev'),
      c: nz.querySelector('.nz-c'), es: [].slice.call(nz.querySelectorAll('.nz-e')), deco: [].slice.call(nz.querySelectorAll('.nz-it.g')), dim: nz.querySelector('.nz-dim'),
      cnt: nz.querySelector('.nz-cnt'), cn: nz.querySelector('.nz-cnt .n'), f: nz.querySelector('.nz-f'), stp: nz.querySelector('.nz-st'),
      ic: [].slice.call(nz.querySelectorAll('.nz-ic')), burn: nz.querySelector('.nz-burn'), paths: [], W: 0, H: 0, lastN: 0, sb: SR.getElementById('snd'), AC: null };
    function geo() {
      var b = Z.b, W = b.offsetWidth, H = b.offsetHeight; Z.W = W; Z.H = H; Z.vw = st.clientWidth; Z.vh = st.clientHeight;
      Z.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      function ctr(el) { return { x: el.offsetLeft, y: el.offsetTop, h: el.offsetHeight }; }
      var c = ctr(Z.c); Z.cp = { x: c.x, y: c.y - c.h / 2 }; Z.cc = { x: c.x, y: c.y };
      Z.ep = Z.es.map(function (e) { var q = ctr(e); return { x: q.x, y: q.y - q.h / 2, cx: q.x, cy: q.y }; });
      /* ด้ายตกแต่ง (มีอยู่แล้วบนบอร์ด) */
      var d = Z.deco.filter(function (e) { return e.offsetWidth; }).map(ctr), dh = '';
      d.forEach(function (q, i) { var t = i ? d[i - 1] : Z.cp; dh += '<path class="dc" d="M' + q.x + ' ' + (q.y - q.h / 2) + 'Q' + ((q.x + t.x) / 2) + ' ' + (Math.max(q.y, t.y) + 40) + ' ' + t.x + ' ' + (t.y - (t.h ? t.h / 2 : 0)) + '"/>'; });
      Z.dc.innerHTML = dh;
      /* ด้ายเบาะแส → สัญญา */
      Z.ev.innerHTML = Z.ep.map(function (e) { var mx = (e.x + Z.cp.x) / 2, my = Math.max(e.y, Z.cp.y) + 60; return '<path d="M' + e.x + ' ' + e.y + 'Q' + mx + ' ' + my + ' ' + Z.cp.x + ' ' + Z.cp.y + '"/>'; }).join('');
      Z.paths = [].slice.call(Z.ev.children).map(function (pa) { var L = pa.getTotalLength(); pa.style.strokeDasharray = L; pa.style.strokeDashoffset = L; return { el: pa, L: L, q: -1 }; });
      /* ด้ายชุดเปิดตัว (พุ่งพร้อมกัน) — ใช้เส้นเดียวกัน */
      Z.paths.forEach(function (pa, k) { if (EV[k].mh) pa.el.classList.add('mh'); });
      Z.ev0.innerHTML = Z.ev.innerHTML;
      [].slice.call(Z.ev0.children).forEach(function (pa, k) { pa.removeAttribute('style'); pa.style.setProperty('--L', Z.paths[k].L.toFixed(1)); pa.style.setProperty('--k', k); if (EV[k].mh) pa.classList.add('mh'); });
      if (host.classList.contains('nzgo') && performance.now() - Z.t0 > 2600) Z.svg.classList.add('done');
      /* จุดเริ่มกล้องถอย = ป้าย "ผู้ต้องสงสัย" */
      Z.dl.style.setProperty('--ox', (Z.b.offsetLeft + c.x + Z.c.offsetWidth * .42).toFixed(0) + 'px');
      Z.dl.style.setProperty('--oy', (Z.b.offsetTop + c.y - c.h * .3).toFixed(0) + 'px');
    }
    Z.geo = geo; geo();
    /* เริ่มจังหวะเปิดหลังเฟรมแรกที่เห็นจริง */
    var H = document.documentElement;
    function go() { requestAnimationFrame(function () { requestAnimationFrame(function () { host.classList.add('nzgo'); Z.t0 = performance.now(); setTimeout(function () { Z.svg.classList.add('done'); }, 2700); }); }); }
    if (H.classList.contains('vch-on')) go(); else { var mo = new MutationObserver(function () { if (H.classList.contains('vch-on')) { mo.disconnect(); go(); } }); mo.observe(H, { attributes: true, attributeFilter: ['class'] }); }
    setTimeout(function () { host.classList.add('nzgo'); }, 4000);
    addEventListener('resize', function () { geo(); Z.lp = -1; });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { geo(); Z.lp = -1; });
    Z.sb && Z.sb.addEventListener('click', function () { if (!Z.AC) { try { Z.AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } else if (Z.AC.state !== 'running') Z.AC.resume(); });
  }
  function pluck(k) {   /* เสียงดีดด้าย (เฉพาะตอนเปิดเสียง) */
    var A = Z.AC; if (!A || !Z.sb || !Z.sb.classList.contains('on')) return;
    var t = A.currentTime, o = A.createOscillator(), g = A.createGain(); o.type = 'triangle';
    o.frequency.setValueAtTime(220 + k * 40, t); o.frequency.exponentialRampToValueAtTime(110 + k * 20, t + .25);
    g.gain.setValueAtTime(.16, t); g.gain.exponentialRampToValueAtTime(.001, t + .5); o.connect(g); g.connect(A.destination); o.start(t); o.stop(t + .55);
  }

  function frame(p) {
    if (!Z || !Z.W) return;
    if (Z.lp === p) return; Z.lp = p;
    /* เวลาของแต่ละเบาะแส */
    var span = (S1 - S0) / EV.length, act = Math.min(EV.length - 1, Math.max(0, Math.floor((p - S0) / span)));
    var drawn = 0;
    Z.paths.forEach(function (pa, k) {
      var q = io(seg(p, S0 + k * span + span * .25, S0 + (k + 1) * span));
      if (q !== pa.q) { pa.q = q; pa.el.style.strokeDashoffset = (pa.L * (1 - q)).toFixed(1); }
      if (q >= 1) drawn++;
      Z.es[k].classList.toggle('on', p > S0 + k * span && p < S1 + .06);
    });
    if (drawn > Z.lastN) pluck(drawn); Z.lastN = drawn; Z.cn.textContent = drawn;
    Z.ev0.style.opacity = (1 - seg(p, .06, .1)).toFixed(3);
    var to = 1 - seg(p, .07, .1); Z.top.style.opacity = to.toFixed(3); Z.top.style.visibility = to > 0 ? '' : 'hidden';
    Z.es.forEach(function (e, k) { if (EV[k].mh) { var on = p > S0 + k * span - .01; e.classList.toggle('show', on); Z.paths[k].el.classList.toggle('show', on); } });
    Z.cnt.style.opacity = (seg(p, S0 - .01, S0 + .01) * (1 - seg(p, S1 + .03, S1 + .05))).toFixed(3);
    /* กล้อง: ซูมที่สัญญา (.17–.2) → ไล่ตามเบาะแส (.26–.52) → ถอยออก (.52–.58) */
    var cx = Z.cc.x, cy = Z.cc.y, sc = 1, tx = 0, ty = 0;
    var z1 = io(seg(p, .15, .2)), z3 = io(seg(p, .52, .58));
    var fx2 = cx, fy2 = cy;
    if (p >= S0 - .02 && p < S1 + .02) {
      var fpos = (p - S0) / span, k0 = Math.max(0, Math.min(EV.length - 1, Math.floor(fpos))), fr = io(cl((fpos - k0) * 3));
      var prev = k0 > 0 ? Z.ep[k0 - 1] : { cx: cx, cy: cy }, cur = Z.ep[k0];
      var ax = lerp(prev.cx, cur.cx, fr), ay = lerp(prev.cy, cur.cy, fr), w = io(seg(p, S0 - .02, S0 + .02)) * (1 - z3);
      fx2 = lerp(cx, lerp(cx, ax, .55), w); fy2 = lerp(cy, lerp(cy, ay, .55), w);
    }
    sc = 1 + .22 * z1 * (1 - z3) + .14 * io(seg(p, S0 - .02, S0 + .03)) * (1 - z3);
    tx = (Z.W / 2 - fx2) * (sc - 1 > 0 ? 1 : 0) * Math.min(1, (sc - 1) / .2);
    ty = (Z.H / 2 - fy2) * Math.min(1, (sc - 1) / .2);
    /* รวมเข้าแฟ้ม (.58–.61) */
    var fold = io(seg(p, .575, .61));
    var shk = seg(p, .612, .645), sa = (1 - shk) * (shk > 0 ? 7 : 0), sx = Math.sin(p * 2600) * sa, sy = Math.cos(p * 3300) * sa * .7;
    Z.b.style.transform = 'translate(' + (tx + sx).toFixed(1) + 'px,' + (ty + sy).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
    var items = Z.es.concat(Z.deco, [Z.c]);
    items.forEach(function (el) {
      if (fold <= 0) { if (el.__f) { el.style.translate = ''; el.style.scale = ''; el.style.opacity = ''; el.__f = 0; } return; }
      var dx = (Z.cc.x - el.offsetLeft) * fold, dy = (Z.cc.y - el.offsetTop) * fold;
      el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px'; el.style.scale = (1 - .75 * fold).toFixed(3); el.style.opacity = (1 - seg(fold, .6, 1)).toFixed(3); el.__f = 1;
    });
    Z.svg.style.opacity = (1 - seg(p, .57, .595)).toFixed(3);
    /* จุดสปอตไลต์ที่เบาะแสที่กำลังดู */
    var dimO = seg(p, S0 - .01, S0 + .02) * (1 - seg(p, S1 + .01, S1 + .04));
    Z.dim.style.opacity = dimO.toFixed(3);
    if (dimO > 0) { var e2 = Z.ep[act], vx = (e2.cx - Z.W / 2) * sc + Z.W / 2 + tx - Z.W * .03, vy = (e2.cy - Z.H / 2) * sc + Z.H / 2 + ty - Z.H * .03;
      Z.dim.style.setProperty('--sx', vx.toFixed(0) + 'px'); Z.dim.style.setProperty('--sy', vy.toFixed(0) + 'px'); Z.dim.style.setProperty('--sr', (Math.min(Z.vw, Z.vh) * .26).toFixed(0) + 'px'); }
    /* แฟ้มคดีเลื่อนขึ้น + ตรา "ตรวจแล้ว" */
    var fi = io(seg(p, .585, .612));
    Z.f.style.opacity = cl(fi * 2).toFixed(3);
    Z.f.style.transform = 'translate(calc(-50% + ' + sx.toFixed(1) + 'px),calc(-50% + ' + ((1 - fi) * 70 + sy).toFixed(1) + 'vh)) rotate(' + lerp(-10, -3, fi).toFixed(2) + 'deg)';
    var si = seg(p, .608, .622);
    Z.stp.style.opacity = cl(si * 3).toFixed(3);
    Z.stp.style.transform = 'translate(-50%,-50%) rotate(-11deg) scale(' + (lerp(2.6, 1, io(si))).toFixed(3) + ')';
    /* การ์ดหนังเงียบ + รอยฟิล์มไหม้ตอนเปลี่ยนฉาก */
    var bo = 0;
    CARDS.forEach(function (w, i) {
      var a = w[0], b = w[1], o = seg(p, a, a + .012) * (1 - seg(p, b - .014, b));
      if (o > 0 && o < 1) o *= .82 + .18 * Math.abs(Math.sin(p * 1800));
      Z.ic[i].style.opacity = o.toFixed(3); Z.ic[i].style.visibility = o > .001 ? '' : 'hidden';
      var bb = seg(p, b - .016, b - .004) * (1 - seg(p, b - .004, b + .006)); if (bb > bo) bo = bb;
    });
    Z.burn.style.opacity = bo.toFixed(3); Z.burn.style.transform = 'scale(' + (1 + bo * 1.4).toFixed(2) + ')';
    /* ทั้งฉากจางออก → เห็นบัตรหลักฐาน (ผลตรวจ) ของหน้าปก */
    var out = seg(p, .665, .735);
    Z.nz.style.opacity = (1 - out).toFixed(3); Z.nz.style.visibility = out >= 1 ? 'hidden' : '';
  }

  /* แตะบอร์ด → รอยนิ้วมือ */
  var fpSvg = (function () { var h = '<svg viewBox="0 0 64 78" fill="none" stroke="rgba(235,235,235,.6)" stroke-width="1.6" stroke-linecap="round">', i;
    for (i = 0; i < 8; i++) { var rx = 6 + i * 3.4, ry = 8 + i * 4.2; h += '<path d="M' + (32 - rx) + ' 40 A' + rx + ' ' + ry + ' 0 1 1 ' + (32 + rx) + ' ' + (40 - i % 3) + '"/>'; }
    return h + '</svg>'; })();
  function tap(x, y, lay) { var d = document.createElement('div'); d.className = 'thm-fx nr-fp'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.innerHTML = fpSvg; lay.appendChild(d); setTimeout(function () { d.remove(); }, 1900); }

  (window.VCHT = window.VCHT || {}).noir = { css: css, stage: stage, init: init, frame: frame, tap: tap };
  if (window.__vchApply) window.__vchApply();
})();
