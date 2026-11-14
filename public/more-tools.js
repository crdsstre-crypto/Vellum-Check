/* ===== เครื่องมือเสริม (more-tools.js) =====
   1) เช็กลิสต์ก่อนเซ็น — รายการติ๊กตามประเภทสัญญา เก็บความคืบหน้าในเครื่อง
   2) แชร์ลิงก์ผลตรวจ — ลิงก์อ่านอย่างเดียว ปิดบังข้อมูลส่วนตัว หมดอายุ 7 วัน (เซิร์ฟเวอร์: server/share.js)
   ทางเข้า: แถวปุ่มใต้การ์ด "ร่างข้อความต่อรอง" ในผลตรวจ · แท็บเครื่องมือ */
(function () {
  'use strict';
  if (window.VCMore) return;

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function res() { try { return typeof lastResult !== 'undefined' ? lastResult : null; } catch (e) { return null; } }
  function typeVal() { var s = document.getElementById('contractType'); return s && s.value && s.value !== 'unsure' ? s.value : ''; }
  function typeText() { var s = document.getElementById('contractType'); return s && s.value && s.value !== 'unsure' ? s.options[s.selectedIndex].text.replace(/\s*[(（].*$/, '').trim() : ''; }
  function loggedIn() { var l = document.getElementById('authLoggedIn'); return !!(l && !l.hidden); }

  /* ---------- ข้อมูลเช็กลิสต์ ---------- */
  var CK = {
    rent: ['🏠', 'เช่าที่พัก', [
      ['ก่อนเซ็น', [['ตรวจว่าผู้ให้เช่าเป็นเจ้าของจริง', 'ขอดูสำเนาโฉนด/หนังสือกรรมสิทธิ์ หรือหนังสือมอบอำนาจ ชื่อต้องตรงกับในสัญญา'],
        ['ถ่ายรูปและวิดีโอสภาพห้องทุกมุม', 'รวมรอยเดิม คราบ ของที่ชำรุด เก็บไฟล์ที่มีวันที่ไว้ ใช้ตอนขอเงินประกันคืน'],
        ['จดเลขมิเตอร์น้ำและไฟวันเข้าอยู่', 'ถ่ายรูปหน้าปัดมิเตอร์เก็บไว้ด้วย'],
        ['ทำรายการเฟอร์นิเจอร์แนบท้ายสัญญา', 'ระบุสภาพของแต่ละชิ้น ให้ทั้งสองฝ่ายเซ็นกำกับ'],
        ['ถามค่าใช้จ่ายอื่นให้ครบ', 'ค่าส่วนกลาง อินเทอร์เน็ต ที่จอดรถ ค่าทำความสะอาดตอนย้ายออก']]],
      ['วันเซ็น', [['อ่านทุกหน้า และเซ็นกำกับทุกหน้า', 'ช่องว่างที่ไม่ใช้ให้ขีดฆ่า กันการเติมข้อความภายหลัง'],
        ['จ่ายเงินประกันแบบมีหลักฐาน', 'โอนผ่านบัญชี และขอใบรับเงินที่ระบุว่าเป็น "เงินประกัน"'],
        ['ขอสำเนาสัญญาที่เซ็นแล้ว 1 ชุด', 'เก็บทั้งตัวจริงหรือสำเนา และถ่ายรูปเก็บในโทรศัพท์']]],
      ['หลังเซ็น', [['ตั้งเตือนวันครบสัญญาและวันต้องแจ้งย้ายออก', 'สัญญาหลายฉบับต่ออายุอัตโนมัติถ้าไม่แจ้งล่วงหน้า'],
        ['เก็บหลักฐานการจ่ายค่าเช่าทุกเดือน', 'สลิปโอน หรือใบเสร็จ'],
        ['ก่อนย้ายออก ถ่ายรูปสภาพห้องอีกครั้ง', 'เทียบกับรูปวันเข้าอยู่ แล้วนัดตรวจห้องพร้อมกัน']]]]],
    employment: ['💼', 'จ้างงาน', [
      ['ก่อนเซ็น', [['ตำแหน่ง ค่าจ้าง และวันจ่ายตรงกับที่คุยไว้', 'ถ้าไม่ตรง ขอแก้ก่อนเซ็น อย่ารับปากด้วยวาจา'],
        ['ดูเงื่อนไขทดลองงาน', 'ระยะเวลา เกณฑ์ประเมิน และสิ่งที่เกิดขึ้นถ้าไม่ผ่าน'],
        ['ถามเรื่องสวัสดิการและประกันสังคม', 'วันลา ประกันสุขภาพ โบนัส ค่าล่วงเวลา'],
        ['ระวังข้อห้ามทำงานกับคู่แข่งและค่าปรับลาออก', 'ดูระยะเวลา ขอบเขต และจำนวนเงินที่ต้องจ่าย']]],
      ['วันเซ็น', [['ไม่เซ็นเอกสารเปล่าหรือกรอกไม่ครบ', 'รวมใบลาออกที่ให้เซ็นล่วงหน้า'],
        ['ขอสำเนาสัญญาจ้าง', 'พร้อมเอกสารแนบ เช่น ระเบียบบริษัท ใบบรรยายงาน']]],
      ['หลังเซ็น', [['เก็บสลิปเงินเดือนทุกเดือน', 'ตรวจว่าได้ค่าจ้าง ค่าล่วงเวลา และถูกหักภาษี/ประกันสังคมถูกต้อง'],
        ['จดวันลาและชั่วโมงทำงานล่วงเวลาไว้เอง', 'ใช้เป็นหลักฐานถ้ามีข้อโต้แย้ง']]]]],
    service: ['💻', 'จ้างทำงาน/ฟรีแลนซ์', [
      ['ก่อนเซ็น', [['ขอบเขตงานเขียนเป็นข้อ ๆ ชัดเจน', 'อะไรรวม อะไรไม่รวม จำนวนชิ้นงาน ไฟล์ที่ส่งมอบ'],
        ['กำหนดจำนวนครั้งที่แก้ได้', 'และค่าใช้จ่ายถ้าแก้เกิน'],
        ['ตกลงมัดจำก่อนเริ่มงาน', 'และงวดจ่ายตามความคืบหน้า'],
        ['กำหนดการตรวจรับงาน', 'เช่น ถ้าไม่แจ้งแก้ภายใน 7 วัน ถือว่ารับงาน'],
        ['ลิขสิทธิ์โอนเมื่อจ่ายครบ', 'ไม่ใช่ตั้งแต่เริ่มงาน']]],
      ['วันเซ็น', [['ทั้งสองฝ่ายเซ็นและเก็บสำเนา', 'ข้อตกลงในแชตให้สรุปแนบท้ายด้วย'],
        ['ได้รับมัดจำก่อนเริ่มงาน', 'เก็บหลักฐานการโอน']]],
      ['หลังเซ็น', [['ส่งงานผ่านช่องทางที่มีหลักฐาน', 'อีเมลหรือลิงก์ที่มีวันเวลา'],
        ['ขอการตรวจรับงานเป็นลายลักษณ์อักษร', 'ก่อนเริ่มงวดถัดไป'],
        ['ออกใบแจ้งหนี้ตามงวด', 'ระบุวันครบกำหนดจ่าย']]]]],
    loan: ['💰', 'กู้ยืมเงิน', [
      ['ก่อนเซ็น', [['คำนวณยอดที่ต้องจ่ายทั้งหมด', 'เงินต้น + ดอกเบี้ย + ค่าธรรมเนียม เทียบกับเงินที่ได้รับจริง'],
        ['ตรวจว่าผู้ให้กู้ได้รับอนุญาตถูกต้อง', 'ระวังเงินกู้นอกระบบที่คิดดอกเบี้ยสูงผิดปกติ'],
        ['ไม่ยอมให้ยึดบัตร ATM สมุดบัญชี หรือบัตรประชาชน', 'เป็นสัญญาณอันตรายของเงินกู้นอกระบบ'],
        ['ดูค่าปรับผิดนัดและค่าทวงถาม', 'และเงื่อนไขเรียกหนี้คืนทั้งหมดทันที']]],
      ['วันเซ็น', [['จำนวนเงินในสัญญาตรงกับที่ได้รับจริง', 'ไม่เซ็นสัญญาที่ยังกรอกตัวเลขไม่ครบ'],
        ['ขอสำเนาสัญญาและตารางผ่อน', 'ระบุวันครบกำหนดแต่ละงวด']]],
      ['หลังเซ็น', [['จ่ายแบบมีหลักฐานทุกงวด', 'โอนผ่านบัญชี เก็บสลิป'],
        ['ตั้งเตือนวันผ่อนก่อนครบกำหนด', 'กันค่าปรับผิดนัด']]]]],
    sale: ['🚗', 'ซื้อขาย', [
      ['ก่อนเซ็น', [['ตรวจเอกสารกรรมสิทธิ์และชื่อผู้ขาย', 'เช่น เล่มทะเบียน ใบเสร็จ ชื่อต้องตรงกับผู้ขาย'],
        ['ตรวจสภาพสินค้า หรือให้ช่างดู', 'ถ่ายรูปเก็บไว้ก่อนส่งมอบ'],
        ['ตรวจภาระผูกพัน', 'ติดไฟแนนซ์ ติดจำนอง หรือถูกอายัดหรือไม่'],
        ['ตกลงเรื่องรับประกันและการคืนสินค้า', 'เขียนระยะเวลาและสิ่งที่รับประกันให้ชัด']]],
      ['วันเซ็น', [['ระบุราคา มัดจำ และวันส่งมอบให้ชัด', 'และกรณีไม่ส่งมอบ มัดจำคืนอย่างไร'],
        ['จ่ายผ่านช่องทางที่มีหลักฐาน', 'เก็บใบเสร็จและสำเนาสัญญา']]],
      ['หลังเซ็น', [['ตรวจของตอนรับมอบ', 'ไม่ตรงตามตกลงให้แจ้งเป็นลายลักษณ์อักษรทันที'],
        ['โอนกรรมสิทธิ์ให้เสร็จ', 'และเก็บใบรับประกัน']]]]],
    other: ['📄', 'ทั่วไป', [
      ['ก่อนเซ็น', [['อ่านทุกหน้า ถามข้อที่ไม่เข้าใจ', 'อย่าเซ็นเพราะเกรงใจหรือถูกเร่ง'],
        ['ชื่อและข้อมูลคู่สัญญาถูกต้อง', 'ตรงกับบัตรประชาชนหรือหนังสือรับรองบริษัท'],
        ['ตัวเลขเงินตรงกันทุกจุด', 'ตัวเลขกับตัวอักษรต้องตรงกัน']]],
      ['วันเซ็น', [['ช่องว่างกรอกครบ หรือขีดฆ่า', 'กันการเติมข้อความภายหลัง'],
        ['ขอสำเนาสัญญาที่เซ็นแล้ว', 'และถ่ายรูปเก็บไว้']]],
      ['หลังเซ็น', [['ตั้งเตือนวันสำคัญในสัญญา', 'วันครบกำหนด วันต่ออายุ วันชำระ'],
        ['เก็บหลักฐานการชำระและการสื่อสาร', 'สลิป อีเมล แชตที่ตกลงกัน']]]]]
  };
  var MAP = { rent: 'rent', employment: 'employment', service: 'service', loan: 'loan', sale: 'sale' };
  function ckType() { var t = ls('vc_ck_type'); var v = typeVal(); return MAP[v] || (CK[t] ? t : 'other'); }
  function ckState(t) { try { return JSON.parse(ls('vc_ck_' + t) || '{}'); } catch (e) { return {}; } }
  function ckSave(t, o) { ls('vc_ck_' + t, JSON.stringify(o)); }
  function ckCount(t) { var o = ckState(t), n = 0, d = 0; CK[t][2].forEach(function (g) { g[1].forEach(function (_, i) { n++; if (o[g[0] + i]) d++; }); }); return { n: n, d: d }; }

  /* ---------- สไตล์ ---------- */
  var css = '' +
    '.vmx{position:fixed;inset:0;z-index:9995;display:flex;align-items:flex-end;justify-content:center;font-family:Prompt,sans-serif;color:#ececef}.vmx[hidden]{display:none}' +
    '.vmx-bg{position:absolute;inset:0;background:rgba(5,6,8,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}.vmx.in .vmx-bg{opacity:1}' +
    '.vmx-card{position:relative;width:100%;max-width:640px;max-height:92vh;display:flex;flex-direction:column;background:#131417;border:1px solid rgba(255,255,255,.08);border-radius:24px 24px 0 0;box-shadow:0 -20px 60px -20px rgba(0,0,0,.9);transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.9,.3,1)}' +
    '.vmx.in .vmx-card{transform:none}' +
    '@media (min-width:768px){.vmx{align-items:center}.vmx-card{border-radius:24px;transform:translateY(24px);opacity:0;transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s}.vmx.in .vmx-card{opacity:1}}' +
    '.vmx-hd{display:flex;align-items:center;gap:12px;padding:16px 18px 12px;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.vmx-hd .ic{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:color-mix(in srgb,var(--c) 18%,transparent);font-size:20px}' +
    '.vmx-hd b{display:block;font:700 17px/1.25 Prompt,sans-serif}.vmx-hd small{display:block;font:400 12.5px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '.vmx .vmx-x{margin-left:auto;flex:none;display:grid;place-items:center;width:40px;height:40px;min-height:0 !important;padding:0 !important;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#ececef;font-size:20px;line-height:1;cursor:pointer}' +
    '.vmx-bd{overflow:auto;overscroll-behavior:contain;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px))}' +
    /* เช็กลิสต์ */
    '.vck-types{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -16px 12px;padding:0 16px}.vck-types::-webkit-scrollbar{display:none}' +
    '.vmx .vck-types button{flex:none;display:flex;align-items:center;gap:6px;min-height:38px !important;padding:0 12px !important;border-radius:99px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#c4c4cb;font:600 12.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vmx .vck-types button.on{border-color:#34d399;background:rgba(52,211,153,.12);color:#d1fae5}' +
    '.vck-top{display:flex;align-items:center;gap:14px;padding:12px 14px;margin-bottom:6px;border-radius:16px;background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.2)}' +
    '.vck-ring{flex:none;position:relative;width:58px;height:58px}.vck-ring svg{width:58px;height:58px;transform:rotate(-90deg)}' +
    '.vck-ring circle{fill:none;stroke-width:6}.vck-ring .bg{stroke:rgba(255,255,255,.08)}.vck-ring .fg{stroke:#34d399;stroke-linecap:round;transition:stroke-dashoffset .5s cubic-bezier(.3,1.2,.5,1)}' +
    '.vck-ring b{position:absolute;inset:0;display:grid;place-items:center;font:700 14px/1 Prompt,sans-serif}' +
    '.vck-top p{margin:0;font:600 14.5px/1.35 Prompt,sans-serif}.vck-top small{display:block;margin-top:2px;font:400 12px/1.5 Prompt,sans-serif;color:#9a9aa3}' +
    '.vck-ph{display:flex;align-items:center;gap:8px;margin:16px 2px 8px;font:700 13.5px/1 Prompt,sans-serif}.vck-ph i{font-style:normal;font:600 11.5px/1 Prompt,sans-serif;color:#8a8a93}' +
    '.vck-it{display:flex;gap:11px;align-items:flex-start;padding:11px 12px;margin-bottom:6px;border-radius:13px;background:#18191d;border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:background .15s,border-color .15s}' +
    '.vck-it input{position:absolute;opacity:0;pointer-events:none}' +
    '.vck-cb{flex:none;display:grid;place-items:center;width:22px;height:22px;margin-top:1px;border-radius:50%;border:1.5px solid rgba(255,255,255,.28);transition:all .2s}' +
    '.vck-it.on{background:rgba(52,211,153,.06);border-color:rgba(52,211,153,.25)}.vck-it.on .vck-cb{background:#34d399;border-color:#34d399}' +
    '.vck-it.on .vck-cb::after{content:"";width:9px;height:5px;margin-top:-2px;border:2px solid #052e1f;border-top:0;border-right:0;transform:rotate(-45deg)}' +
    '.vck-it.pop .vck-cb{animation:vckPop .35s cubic-bezier(.3,1.8,.5,1)}@keyframes vckPop{50%{transform:scale(1.3)}}' +
    '.vck-it b{display:block;font:600 14px/1.4 Prompt,sans-serif;transition:color .2s}.vck-it.on b{color:#a1a1aa;text-decoration:line-through;text-decoration-color:rgba(52,211,153,.6)}' +
    '.vck-it small{display:block;margin-top:2px;font:400 12px/1.5 Prompt,sans-serif;color:#8a8a93}' +
    '.vmx .vck-rs{display:block;margin:14px auto 0;min-height:0 !important;padding:6px 12px !important;border:0;background:transparent;color:#8a8a93;font:500 12px/1 Prompt,sans-serif;text-decoration:underline;cursor:pointer}' +
    /* แชร์ */
    '.vsh-h{margin:4px 2px 8px;font:600 12px/1.2 Prompt,sans-serif;color:#9a9aa3}' +
    '.vsh-who,.vsh-days{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}' +
    '.vmx .vsh-who button,.vmx .vsh-days button{min-height:38px !important;padding:0 12px !important;border-radius:99px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#c4c4cb;font:600 12.5px/1 Prompt,sans-serif;cursor:pointer;transition:all .15s}' +
    '.vmx .vsh-who button.on,.vmx .vsh-days button.on{border-color:#7fb5ff;background:rgba(127,181,255,.14);color:#e1edff}' +
    '.vsh-days{display:grid;grid-template-columns:repeat(3,1fr)}' +
    '.vsh-who{display:grid;grid-template-columns:repeat(3,1fr)}' +
    '.vmx .vsh-who button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:64px !important;padding:8px 4px !important;border-radius:15px;font-size:12.5px}.vsh-who button span{font-size:22px;line-height:1}' +
    '.vsh-pc{display:flex;flex-direction:column;gap:8px}' +
    '.vsh-pc .vsh-tg{margin-top:0;padding:8px 10px;gap:8px;border-radius:12px}.vsh-pc .vsh-tg b{font-size:11.5px;line-height:1.3}.vsh-pc .vsh-sw{width:36px;height:22px}.vsh-pc .vsh-sw::after{width:16px;height:16px}.vsh-pc .vsh-tg input:checked + .vsh-sw::after{transform:translateX(14px)}' +
    '.vsh-rows{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;padding:10px;border-radius:13px;background:#f3ecdc}' +
    '.vsh-rw{display:flex;min-width:0;overflow:hidden;align-items:center;gap:8px;padding:6px 8px;border-radius:9px;background:rgba(42,37,27,.06)}' +
    '.vsh-rw .l{flex:none;width:58px;font:600 10.5px/1.2 Prompt,sans-serif;color:#8a7f6a}' +
    '.vsh-rw .v{display:block;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:500 13px/1.4 Sarabun,Prompt,sans-serif;color:#2a251b}' +
    '.vsh-rw .vsh-mk2{max-width:100%;vertical-align:bottom}.vsh-rw .vsh-mk2>span{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}' +
    '.vsh-pl{margin:2px 2px 4px;font:400 11.5px/1.6 Prompt,sans-serif;color:#9ad9bd}' +
    '.vsh-ft{padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.07);background:#131417;border-radius:0 0 24px 24px}.vsh-ft[hidden]{display:none}' +
    '.vsh-ft .vsh-go{margin-top:0 !important}' +
    '.vmx .vsh-again{display:flex;align-items:center;justify-content:center;width:100%;margin-top:14px;min-height:50px !important;border:0;border-radius:15px;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;font:700 15px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vsh-scr{height:auto !important;min-height:220px}' +
    '.vsh-scr .ct2{margin-top:auto;padding:6px;border-radius:7px;background:#f3ecdc;color:#1b1710;text-align:center;font:700 7.5px/1 Prompt,sans-serif}' +
    '.vsh-msg{display:flex;align-items:center;gap:8px;margin:0 0 14px;padding:9px 12px;border-radius:14px 14px 14px 4px;background:rgba(141,224,85,.12);border:1px solid rgba(141,224,85,.25);font:400 13px/1.45 Prompt,sans-serif;color:#dcf5c9}' +
    '.vsh-msg span{flex:1;min-width:0}.vsh-msg em{flex:none;font-style:normal;font:600 11px/1 Prompt,sans-serif;color:#9cc98a}' +
    '.vsh-grid{display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px;align-items:start;margin-bottom:14px}' +
    '@media (max-width:380px){.vsh-grid{grid-template-columns:130px minmax(0,1fr)}}' +
    '.vsh-ph{padding:6px;border-radius:24px;background:#2a2c33;box-shadow:0 14px 30px -12px rgba(0,0,0,.9),inset 0 0 0 1px rgba(255,255,255,.08)}' +
    '.vsh-scr{height:250px;overflow:hidden;border-radius:19px;background:#0b0c0f;padding:8px 7px;display:flex;flex-direction:column;gap:6px}' +
    '.vsh-scr .sb{display:flex;align-items:center;gap:4px}.vsh-scr .sb i{width:9px;height:9px;border-radius:3px;background:#c9ced6}.vsh-scr .sb b{font:600 8px/1 Prompt,sans-serif;letter-spacing:.04em}.vsh-scr .sb em{margin-left:auto;font:500 6.5px/1 Prompt,sans-serif;font-style:normal;color:#7fb5ff}' +
    '.vsh-scr .bn{padding:5px 6px;border-radius:7px;background:rgba(127,181,255,.12);font:500 7.5px/1.3 Prompt,sans-serif;color:#cfe2ff}' +
    '.vsh-scr .ct{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.vsh-scr .ct span{padding:4px 0;border-radius:6px;background:#15171c;text-align:center;font:700 11px/1 Prompt,sans-serif;color:var(--c)}' +
    '.vsh-scr .it{position:relative;padding:6px 6px 6px 9px;border-radius:8px;background:#15171c;overflow:hidden}.vsh-scr .it::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2.5px;background:var(--c)}' +
    '.vsh-scr .it b{display:block;font:600 8.5px/1.35 Prompt,sans-serif}' +
    '.vsh-scr .it p{margin:4px 0 0;font:400 7px/1.45 Prompt,sans-serif}.vsh-scr .q{padding:4px 5px;border-radius:5px;background:#f3ecdc;color:#2a251b;max-height:40px;transition:max-height .35s,opacity .3s,padding .3s,margin .3s;overflow:hidden}' +
    '.vsh-scr .q.off{max-height:0;opacity:0;padding:0 5px;margin:0}.vsh-scr .fx{padding:4px 5px;border-radius:5px;background:rgba(52,211,153,.12);color:#9ee7c6}' +
    '.vsh-scr .ghost{height:46px;--c:#f5c451;opacity:.6}' +
    '.vsh-side{min-width:0}.vsh-side .vsh-h{margin-top:0}' +
    '.vsh-mask{padding:10px 11px;border-radius:12px;background:#f3ecdc;color:#2a251b;font:400 13px/1.75 Sarabun,Prompt,sans-serif}' +
    '.vsh-mk2{position:relative;display:inline-block;line-height:1.3}.vsh-mk2 i{position:absolute;inset:-1px -2px;border-radius:4px;background:#1c1a16;transform:scaleX(0);transform-origin:left;animation:vshMk .45s var(--d) cubic-bezier(.5,0,.2,1) forwards}' +
    '.vsh-mk2 i::after{content:"ปิดบัง";position:absolute;inset:0;display:grid;place-items:center;font:600 9px/1 Prompt,sans-serif;color:#8a8170;letter-spacing:.06em;opacity:0;animation:vshFd .3s calc(var(--d) + .4s) forwards}' +
    '@keyframes vshMk{to{transform:scaleX(1)}}@keyframes vshFd{to{opacity:1}}' +
    '.vsh-dm{display:block;margin:5px 2px 0;font:400 11px/1.4 Prompt,sans-serif;color:#71717a}' +
        '@media (prefers-reduced-motion:reduce){.vsh-mk2 i,.vsh-mk2 i::after{animation:none;transform:none;opacity:1}}' +
    '.vsh-pv{padding:12px 14px;border-radius:14px;background:#18191d;border:1px solid rgba(255,255,255,.08)}' +
    '.vsh-pv p{margin:0 0 6px;font:600 12px/1.3 Prompt,sans-serif;color:#9a9aa3}.vsh-pv ul{margin:0;padding:0;list-style:none;display:grid;gap:6px}' +
    '.vsh-pv li{display:flex;gap:8px;font:400 13px/1.5 Prompt,sans-serif;color:#d4d4d8}.vsh-pv li::before{content:"✓";color:#34d399;font-weight:700}.vsh-pv li.x::before{content:"✕";color:#f2555a}' +
    '.vsh-tg{display:flex;align-items:center;gap:12px;margin-top:12px;padding:12px 14px;border-radius:14px;background:#18191d;border:1px solid rgba(255,255,255,.08);cursor:pointer}' +
    '.vsh-tg input{position:absolute;opacity:0;pointer-events:none}.vsh-sw{flex:none;position:relative;width:44px;height:26px;border-radius:99px;background:rgba(255,255,255,.15);transition:background .2s}' +
    '.vsh-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}' +
    '.vsh-tg input:checked + .vsh-sw{background:#34d399}.vsh-tg input:checked + .vsh-sw::after{transform:translateX(18px)}' +
    '.vsh-tg b{display:block;font:600 13.5px/1.35 Prompt,sans-serif}.vsh-tg small{display:block;font:400 12px/1.45 Prompt,sans-serif;color:#9a9aa3}' +
    '.vsh-mk{margin-top:8px;padding:9px 12px;border-radius:10px;background:#f3ecdc;color:#2a251b;font:400 13px/1.6 Sarabun,Prompt,sans-serif}.vsh-mk em{font-style:normal;background:#2a251b;color:#f3ecdc;border-radius:4px;padding:0 4px}' +
    '.vmx .vsh-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:14px;min-height:52px !important;border:0;border-radius:15px;background:linear-gradient(135deg,#9cc5ff,#5b9bff);color:#06142b;font:700 15px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vmx .vsh-go:disabled{opacity:.6;cursor:default}' +
    '.vsh-link{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;border-radius:14px;background:#0d0e10;border:1px solid rgba(127,181,255,.35)}' +
    '.vsh-link input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#cfe2ff;font:500 14px/1 Prompt,sans-serif}' +
    '.vmx .vsh-link button{flex:none;min-height:40px !important;padding:0 14px !important;border:0;border-radius:11px;background:#7fb5ff;color:#06142b;font:700 13px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vsh-ok{text-align:center;margin:4px 0 14px}.vsh-ok i{display:block;font-style:normal;font-size:38px}.vsh-ok b{display:block;margin-top:4px;font:700 17px/1.3 Prompt,sans-serif}.vsh-ok small{display:block;margin-top:3px;font:400 12.5px/1.5 Prompt,sans-serif;color:#9a9aa3}' +
    '.vsh-acts{display:grid;grid-template-columns:repeat(var(--n,2),1fr);gap:8px;margin-top:10px}' +
    '.vmx .vsh-acts button{min-height:48px !important;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ececef;font:600 13.5px/1 Prompt,sans-serif;cursor:pointer}.vmx .vsh-acts button.line{border:0;background:#06c755;color:#fff}' +
    '.vmx .vsh-rv{display:block;margin:16px auto 0;min-height:0 !important;padding:6px 12px !important;border:0;background:transparent;color:#f2898c;font:500 12.5px/1 Prompt,sans-serif;text-decoration:underline;cursor:pointer}' +
    '.vsh-er{margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(242,85,90,.1);color:#ffb4b6;font:400 13px/1.5 Prompt,sans-serif}' +
    /* แถวปุ่มในผลตรวจ */
    '.vmx-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:-6px 0 16px}' +
    'html body #result button.vmx-rb.vmx-rb{display:flex !important;align-items:center;gap:9px;min-height:54px !important;height:auto !important;padding:9px 12px !important;margin:0 !important;border-radius:14px !important;border:1px solid rgba(255,255,255,.1);background:#15171c;color:#ececef;text-align:left;font-family:Prompt,sans-serif;cursor:pointer}' +
    '.vmx-rb .i{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:color-mix(in srgb,var(--c) 16%,transparent);font-size:16px}' +
    '.vmx-rb b{display:block;font:600 13px/1.3 Prompt,sans-serif}.vmx-rb small{display:block;font:400 11px/1.35 Prompt,sans-serif;color:#8a8a93}' +
    '@media (prefers-reduced-motion:reduce){.vmx-card,.vck-ring .fg{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- แผงพื้นฐาน ---------- */
  function sheet(cls, c, ic, title, sub) {
    var el = document.createElement('div'); el.className = 'vmx ' + cls; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', title);
    el.innerHTML = '<div class="vmx-bg" data-x></div><div class="vmx-card" style="--c:' + c + '"><div class="vmx-hd"><span class="ic">' + ic + '</span><div><b>' + title + '</b><small>' + sub + '</small></div><button type="button" class="vmx-x" data-x aria-label="ปิด">×</button></div><div class="vmx-bd"></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target.closest('[data-x]')) hide(el); });
    return el;
  }
  var prevOv = '';
  function show(el) { el.hidden = false; prevOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); }); el.querySelector('.vmx-bd').scrollTop = 0; }
  function hide(el) { if (!el || el.hidden) return; el.classList.remove('in'); document.documentElement.style.overflow = prevOv || ''; setTimeout(function () { el.hidden = true; }, 300); setTimeout(row, 320); }
  document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; [].forEach.call(document.querySelectorAll('.vmx.in'), hide); });

  /* ---------- 1) เช็กลิสต์ ---------- */
  var ck = null, cur = 'other';
  function ckOpen(t) {
    if (!ck) {
      ck = sheet('vck', '#34d399', '📋', 'เช็กลิสต์ก่อนเซ็น', 'สิ่งที่ควรทำก่อน ระหว่าง และหลังเซ็น · บันทึกไว้ในเครื่องนี้');
      ck.addEventListener('click', function (e) {
        var b = e.target.closest('[data-ty]'); if (b) { cur = b.getAttribute('data-ty'); ls('vc_ck_type', cur); ckRender(); return; }
        if (e.target.closest('.vck-rs')) { ls('vc_ck_' + cur, null); ckRender(); return; }
      });
      ck.addEventListener('change', function (e) {
        var it = e.target.closest('.vck-it'); if (!it) return;
        var o = ckState(cur), k = it.getAttribute('data-k'); if (e.target.checked) o[k] = 1; else delete o[k]; ckSave(cur, o);
        it.classList.toggle('on', e.target.checked); it.classList.remove('pop'); void it.offsetWidth; if (e.target.checked) it.classList.add('pop');
        ckTop();
      });
    }
    cur = t && CK[t] ? t : ckType(); ckRender(); show(ck);
  }
  function ckTop() {
    var c = ckCount(cur), C = 2 * Math.PI * 24, top = ck.querySelector('.vck-top');
    top.querySelector('.fg').style.strokeDashoffset = (C * (1 - c.d / c.n)).toFixed(1);
    top.querySelector('.vck-ring b').textContent = c.d + '/' + c.n;
    top.querySelector('p').textContent = c.d === c.n ? 'ครบทุกข้อแล้ว 🎉' : c.d ? 'ทำไปแล้ว ' + c.d + ' จาก ' + c.n + ' ข้อ' : 'เริ่มติ๊กข้อที่ทำแล้วได้เลย';
  }
  function ckRender() {
    var o = ckState(cur), C = 2 * Math.PI * 24, T = CK[cur];
    var h = '<div class="vck-types">' + Object.keys(CK).map(function (k) { return '<button type="button" data-ty="' + k + '" class="' + (k === cur ? 'on' : '') + '">' + CK[k][0] + ' ' + CK[k][1] + '</button>'; }).join('') + '</div>' +
      '<div class="vck-top"><div class="vck-ring"><svg viewBox="0 0 58 58"><circle class="bg" cx="29" cy="29" r="24"/><circle class="fg" cx="29" cy="29" r="24" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg><b></b></div><div><p></p><small>สัญญา' + esc(T[1]) + ' · ติ๊กเก็บไว้ได้ กลับมาดูต่อได้ทุกเมื่อ</small></div></div>';
    h += T[2].map(function (g) {
      return '<p class="vck-ph">' + g[0] + ' <i>' + g[1].length + ' ข้อ</i></p>' + g[1].map(function (x, i) {
        var k = g[0] + i, on = !!o[k];
        return '<label class="vck-it' + (on ? ' on' : '') + '" data-k="' + esc(k) + '"><input type="checkbox"' + (on ? ' checked' : '') + '><span class="vck-cb"></span><span><b>' + esc(x[0]) + '</b><small>' + esc(x[1]) + '</small></span></label>';
      }).join('');
    }).join('') + '<button type="button" class="vck-rs">เริ่มใหม่ (ล้างที่ติ๊กไว้)</button>';
    ck.querySelector('.vmx-bd').innerHTML = h;
    requestAnimationFrame(ckTop);
    var on = ck.querySelector('.vck-types .on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  /* ---------- 2) แชร์ลิงก์ ---------- */
  var sh = null, last = null;
  /* ข้อความที่ส่งไปพร้อมลิงก์ ตามผู้รับ */
  var WHO = {
    fam: ['👨‍👩‍👧', 'ครอบครัว', function (P) { return 'ช่วยดูสัญญานี้ให้หน่อยนะ' + P + ' 🙏 มีจุดที่ควรระวังก่อนเซ็นอยู่ ' }],
    fri: ['🧑‍🤝‍🧑', 'เพื่อน', function (P) { return 'ช่วยดูผลตรวจสัญญาให้หน่อย เคยเจอแบบนี้ไหม? 🙏 ' }],
    law: ['⚖️', 'ทนาย / ที่ปรึกษา', function (P) { return 'รบกวนขอความเห็นเบื้องต้นเกี่ยวกับสัญญาฉบับนี้' + P + ' ผลตรวจเบื้องต้นอยู่ในลิงก์นี้ ' }]
  };
  function who() { var w = ls('vc_sh_who'); return WHO[w] ? w : 'fam'; }
  function days() { var d = +ls('vc_sh_days'); return [1, 7, 30].indexOf(d) > -1 ? d : 7; }
  function pp() { return ls('vc_neg_pp') === 'ค่ะ' ? 'ค่ะ' : 'ครับ'; }
  function msg(url) { return WHO[who()][2](pp()) + '\n' + url; }

  /* (2) อนิเมชันปิดบังข้อมูล */
  var PII = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+|\b\d[\d -]{11,16}\d\b|\b0\d{1,2}[- ]?\d{3}[- ]?\d{3,4}\b|(?:นางสาว|นาย|นาง|น\.ส\.)\s*[ก-๙]{2,}(?:\s+[ก-๙]{2,})?|(?:บ้านเลขที่|เลขที่)\s*[\d/]+)/g;
  function piiLine() {
    var r = res(), q = '';
    if (r && r.items) r.items.some(function (it) { var t = String(it.quote || ''); PII.lastIndex = 0; if (PII.test(t)) { q = t; return true; } return false; });
    if (q) { PII.lastIndex = 0; var m = PII.exec(q), a = Math.max(0, m.index - 30); return { t: (a ? '…' : '') + q.slice(a, a + 110), demo: false }; }
    return { t: 'ผู้เช่า นายตัวอย่าง นามสมมติ โทร 000-000-0000 อีเมล sample@example.com', demo: true };
  }
  function maskHtml(t) {
    var out = '', last = 0, k = 0; PII.lastIndex = 0; var m;
    while ((m = PII.exec(t))) {
      var pre = '', body = m[0], pm = /^(นางสาว|นาย|นาง|น\.ส\.|บ้านเลขที่|เลขที่)\s*/.exec(body);
      if (pm) { pre = pm[0]; body = body.slice(pre.length); }
      out += esc(t.slice(last, m.index)) + esc(pre) + '<span class="vsh-mk2" style="--d:' + (0.5 + k * 0.45).toFixed(2) + 's"><span>' + esc(body) + '</span><i></i></span>';
      last = m.index + m[0].length; k++;
    }
    return out + esc(t.slice(last));
  }
  function maskRows(L) {
    var rows = [];
    if (L.demo) rows = [['ชื่อ', 'นาย', 'ตัวอย่าง นามสมมติ'], ['เบอร์โทร', '', '000-000-0000'], ['อีเมล', '', 'sample@example.com']];
    else { PII.lastIndex = 0; var m, seen = {}; while ((m = PII.exec(L.t)) && rows.length < 4) {
      var v = m[0], pm = /^(นางสาว|นาย|นาง|น\.ส\.|บ้านเลขที่|เลขที่)\s*/.exec(v), pre = pm ? pm[1] + ' ' : '', body = pm ? v.slice(pm[0].length) : v;
      var lb = /@/.test(v) ? 'อีเมล' : pm && /เลขที่/.test(pm[1]) ? 'ที่อยู่' : pm ? 'ชื่อ' : /^0\d/.test(v) && v.replace(/\D/g, '').length <= 10 ? 'เบอร์โทร' : 'เลขบัตร/บัญชี';
      if (seen[lb + body]) continue; seen[lb + body] = 1; rows.push([lb, pre, body]); } }
    return '<div class="vsh-rows">' + rows.map(function (r, k) { return '<div class="vsh-rw"><span class="l">' + r[0] + '</span><span class="v">' + esc(r[1]) + '<span class="vsh-mk2" style="--d:' + (0.45 + k * 0.4).toFixed(2) + 's"><span>' + esc(r[2]) + '</span><i></i></span></span></div>'; }).join('') + '</div>';
  }
  /* (1) ตัวอย่างหน้าที่ผู้รับเห็น */
  function phone(quotes) {
    var r = res() || {}, it = (r.items || [])[0] || {}, c = { check_detail: 0, caution: 0, low: 0 };
    (r.items || []).forEach(function (x) { if (c[x.level] != null) c[x.level]++; });
    var q = it.quote && !it.missing ? it.quote.replace(PII, function (m) { var pm = /^(นางสาว|นาย|นาง|น\.ส\.|บ้านเลขที่|เลขที่)\s*/.exec(m); return (pm ? pm[0] : '') + '•••'; }) : '';
    var LC = { check_detail: '#f2555a', caution: '#f5c451', low: '#8d8d96' };
    return '<div class="vsh-ph"><div class="vsh-scr"><div class="sb"><i></i><b>Vellum Check</b><em>อ่านอย่างเดียว</em></div>' +
      '<div class="bn">👀 มีคนแชร์ผลตรวจให้คุณดู</div>' +
      '<div class="ct"><span style="--c:#f2555a">' + c.check_detail + '</span><span style="--c:#f5c451">' + c.caution + '</span><span style="--c:#8d8d96">' + c.low + '</span></div>' +
      '<div class="it" style="--c:' + (LC[it.level] || '#8d8d96') + '"><b>' + esc(String(it.title || 'ประเด็นที่ 1').slice(0, 40)) + '</b>' +
      (q ? '<p class="q' + (quotes ? '' : ' off') + '">“' + esc(q.slice(0, 70)) + '…”</p>' : '') + '<p class="fx">สิ่งที่ควรขอแก้ไข…</p></div>' +
      (function () { var it2 = (r.items || [])[1]; return it2 ? '<div class="it" style="--c:' + (LC[it2.level] || '#8d8d96') + '"><b>' + esc(String(it2.title || '').slice(0, 40)) + '</b><p class="fx">สิ่งที่ควรขอแก้ไข…</p></div>' : ''; })() +
      '<div class="ct2">ตรวจสัญญาของคุณ →</div></div></div>';
  }
  function shOpen() {
    if (!sh) {
      sh = sheet('vsh', '#7fb5ff', '🔗', 'แชร์ผลตรวจให้คนอื่นดู', 'ลิงก์อ่านอย่างเดียว · ปิดบังข้อมูลส่วนตัวให้อัตโนมัติ');
      sh.addEventListener('change', function (e) { if (e.target.classList.contains('vsh-q')) { var q = sh.querySelector('.vsh-ph .q'); if (q) q.classList.toggle('off', !e.target.checked); } });
      sh.addEventListener('click', function (e) {
        if (e.target.closest('.vsh-go')) return create();
        if (e.target.closest('.vsh-again')) return shForm();
        var wb = e.target.closest('[data-who]'); if (wb) { ls('vc_sh_who', wb.getAttribute('data-who')); [].forEach.call(sh.querySelectorAll('[data-who]'), function (x) { x.classList.toggle('on', x === wb); }); var mm = sh.querySelector('.vsh-msg span'); if (mm) mm.textContent = WHO[who()][2](pp()); footer(true); return; }
        var db = e.target.closest('[data-days]'); if (db) { ls('vc_sh_days', db.getAttribute('data-days')); [].forEach.call(sh.querySelectorAll('[data-days]'), function (x) { x.classList.toggle('on', x === db); }); footer(true); return; }
        if (e.target.closest('[data-login]')) { hide(sh); var a = document.querySelector('#bottomNav [data-nav="acct"]') || document.getElementById('authToggle'); if (a) setTimeout(function () { a.click(); }, 300); return; }
        var url = last ? location.origin + last.url : '';
        if (e.target.closest('[data-cp]')) { var b = e.target.closest('[data-cp]'); (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = 'คัดลอกแล้ว ✓'; setTimeout(function () { b.textContent = 'คัดลอก'; }, 1500); }, function () { var i = sh.querySelector('.vsh-link input'); i.select(); try { document.execCommand('copy'); } catch (er) {} }); return; }
        if (e.target.closest('[data-ln]')) { window.open('https://line.me/R/share?text=' + encodeURIComponent(msg(url)), '_blank', 'noopener'); return; }
        if (e.target.closest('[data-sh]')) { navigator.share({ title: 'ผลตรวจสัญญา', text: WHO[who()][2](pp()), url: url }).catch(function () {}); return; }
        if (e.target.closest('.vsh-rv')) return revoke();
      });
    }
    if (!res()) { if (window.VCTools) VCTools.open(); return; }
    last = null; shForm(); show(sh);
  }
  function goLabel() { return '🔗 สร้างลิงก์ · ส่งให้' + WHO[who()][1].split(' /')[0] + ' · ' + days() + ' วัน'; }
  function footer(on) {
    var card = sh.querySelector('.vmx-card'), f = card.querySelector('.vsh-ft');
    if (!f) { f = document.createElement('div'); f.className = 'vsh-ft'; f.innerHTML = '<button type="button" class="vsh-go"></button>'; card.appendChild(f); }
    f.hidden = !on; if (on) { var b = f.querySelector('.vsh-go'); b.disabled = false; b.textContent = goLabel(); }
  }
  function shForm(err) {
    var L = piiLine(), w = who(), d = days();
    var h = '<p class="vsh-h">ส่งให้ใคร</p><div class="vsh-who">' + Object.keys(WHO).map(function (k) { return '<button type="button" data-who="' + k + '" class="' + (k === w ? 'on' : '') + '"><span>' + WHO[k][0] + '</span>' + WHO[k][1].split(' /')[0] + '</button>'; }).join('') + '</div>' +
      '<div class="vsh-msg">💬 <span>' + esc(WHO[w][2](pp())) + '</span><em>+ ลิงก์</em></div>' +
      '<div class="vsh-grid"><div class="vsh-pc">' + phone(true) +
        '<label class="vsh-tg"><input type="checkbox" class="vsh-q" checked><span class="vsh-sw"></span><span><b>ข้อความจากสัญญา</b></span></label></div>' +
        '<div class="vsh-side"><p class="vsh-h">ข้อมูลส่วนตัวถูกปิดบังให้อัตโนมัติ</p>' + maskRows(L) + (L.demo ? '<small class="vsh-dm">ตัวอย่างสมมติ · ข้อความที่ยกมาในผลตรวจนี้ไม่มีข้อมูลส่วนตัว</small>' : '<small class="vsh-dm">จากข้อความในผลตรวจของคุณ</small>') + '</div></div>' +
      '<p class="vsh-h">ลิงก์ใช้ได้นาน</p><div class="vsh-days">' + [[1, '1 วัน'], [7, '7 วัน'], [30, '30 วัน']].map(function (x) { return '<button type="button" data-days="' + x[0] + '" class="' + (x[0] === d ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<p class="vsh-pl">🔒 ปิดบังข้อมูลส่วนตัว · 👁️ อ่านอย่างเดียว · 📄 ไม่ส่งสัญญาฉบับเต็ม · 🗑️ ยกเลิกได้ทุกเมื่อ</p>' +
      (err ? '<div class="vsh-er">' + esc(err.msg) + (err.login ? ' <button type="button" data-login style="margin-left:6px;border:0;background:#7fb5ff;color:#06142b;border-radius:8px;padding:4px 10px;font:600 12px Prompt;cursor:pointer">เข้าสู่ระบบ</button>' : '') + '</div>' : '');
    sh.querySelector('.vmx-bd').innerHTML = h;
    footer(true);
  }
  function create() {
    var b = sh.querySelector('.vsh-go'); b.disabled = true; b.textContent = 'กำลังสร้างลิงก์…';
    var qe = sh.querySelector('.vsh-q'), quotes = qe ? qe.checked : true;
    var title = (document.querySelector('#result .rpt-title') || {}).textContent || '';
    fetch('/api/share', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ result: res(), quotes: quotes, typeText: typeText(), title: title.trim(), days: days() }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) { if (!x.ok) throw { msg: x.j.error || 'สร้างลิงก์ไม่สำเร็จ', login: !!x.j.login }; last = x.j; done(); })
      .catch(function (er) { shForm(er && er.msg ? er : { msg: 'สร้างลิงก์ไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่' }); });
  }
  function done() {
    var url = location.origin + last.url, exp = ''; try { exp = new Date(last.expiresAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) {}
    var share = !!navigator.share; footer(false);
    sh.querySelector('.vmx-bd').innerHTML = '<div class="vsh-ok"><i>✅</i><b>ลิงก์พร้อมแชร์แล้ว</b><small>ใช้ได้ ' + (last.days || days()) + ' วัน ถึง ' + esc(exp) + ' · ใครมีลิงก์ก็เปิดดูได้ แชร์เฉพาะคนที่ไว้ใจ</small></div>' +
      '<div class="vsh-msg">💬 <span>' + esc(WHO[who()][2](pp())) + '</span><em>+ ลิงก์</em></div>' +
      '<div class="vsh-link"><input type="text" readonly value="' + esc(url) + '" aria-label="ลิงก์แชร์"><button type="button" data-cp>คัดลอก</button></div>' +
      '<div class="vsh-acts" style="--n:' + (share ? 2 : 1) + '"><button type="button" class="line" data-ln>ส่งทาง LINE</button>' + (share ? '<button type="button" data-sh>ส่งต่อ…</button>' : '') + '</div>' +
      '<button type="button" class="vsh-rv">ยกเลิกลิงก์นี้ (คนที่มีลิงก์จะเปิดไม่ได้อีก)</button>';
  }
  function revoke() {
    if (!last) return;
    fetch('/api/share/' + encodeURIComponent(last.id), { method: 'DELETE', credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw 0;
      sh.querySelector('.vmx-bd').innerHTML = '<div class="vsh-ok"><i>🗑️</i><b>ยกเลิกลิงก์แล้ว</b><small>คนที่มีลิงก์เดิมจะเปิดไม่ได้อีก · สร้างลิงก์ใหม่ได้ทุกเมื่อ</small></div><button type="button" class="vsh-again">🔗 สร้างลิงก์ใหม่</button>';
      last = null;
    }).catch(function () { var b = sh.querySelector('.vsh-rv'); if (b) b.textContent = 'ยกเลิกไม่สำเร็จ ลองใหม่อีกครั้ง'; });
  }

  /* ---------- แถวปุ่มในผลตรวจ ---------- */
  var pend = false;
  function row() {
    pend = false;
    var r = document.getElementById('result'); if (!r) return;
    var rpt = r.querySelector('article.rpt'), ex = r.querySelector('.vmx-row');
    if (!rpt || !res()) { if (ex) ex.remove(); return; }
    if (!ex) {
      ex = document.createElement('div'); ex.className = 'vmx-row';
      ex.addEventListener('click', function (e) { if (e.target.closest('[data-m="ck"]')) ckOpen(); else if (e.target.closest('[data-m="sh"]')) shOpen(); });
    }
    var t = ckType(), c = ckCount(t);
    var html = '<button type="button" class="vmx-rb" data-m="ck" style="--c:#34d399"><span class="i">📋</span><span><b>เช็กลิสต์ก่อนเซ็น</b><small>' + (c.d ? 'ทำแล้ว ' + c.d + '/' + c.n + ' ข้อ' : c.n + ' ข้อที่ควรทำ') + '</small></span></button>' +
      '<button type="button" class="vmx-rb" data-m="sh" style="--c:#7fb5ff"><span class="i">🔗</span><span><b>แชร์ให้คนอื่นดู</b><small>ลิงก์อ่านอย่างเดียว</small></span></button>';
    if (ex.getAttribute('data-sig') !== html) { ex.innerHTML = html; ex.setAttribute('data-sig', html); }
    var anchor = rpt.querySelector('.vng-cta') || rpt.querySelector('.vhs') || rpt.querySelector('.vc-sum') || rpt.querySelector('.rpt-head');
    if (anchor && ex.previousElementSibling !== anchor) anchor.parentNode.insertBefore(ex, anchor.nextSibling);
  }
  function watch() {
    var r = document.getElementById('result'); if (!r) return;
    new MutationObserver(function (m) {
      if (m.every(function (x) { return x.target.closest && x.target.closest('.vmx-row'); })) return;
      if (!pend) { pend = true; setTimeout(row, 600); }
    }).observe(r, { childList: true, subtree: true });
    row();
  }

  window.VCMore = { checklist: ckOpen, share: shOpen };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
