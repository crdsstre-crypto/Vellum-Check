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
  function siteInit() {
    if (!document.getElementById('nz-site')) { var st = document.createElement('style'); st.id = 'nz-site'; st.textContent = siteCss; document.head.appendChild(st); }
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
