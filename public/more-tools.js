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
    '.vsh-who{display:flex;gap:8px;flex-wrap:wrap;margin:2px 0 14px}.vsh-who span{padding:5px 10px;border-radius:99px;background:rgba(255,255,255,.05);font:500 12px/1.3 Prompt,sans-serif;color:#c4c4cb}' +
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
  function sample() {
    var r = res(); if (!r || !r.items) return '';
    var q = ''; r.items.some(function (it) { if (it.quote && /นาย|นาง|\d{3}/.test(it.quote)) { q = it.quote; return true; } return false; });
    if (!q) r.items.some(function (it) { if (it.quote) { q = it.quote; return true; } return false; });
    return q.slice(0, 120);
  }
  function maskPreview(s) {
    var M = '<em>•••</em>';
    return esc(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, M).replace(/\b\d[\d -]{11,16}\d\b/g, function (m) { return m.replace(/\D/g, '').length >= 10 ? M : m; })
      .replace(/\b0\d{1,2}[- ]?\d{3}[- ]?\d{3,4}\b/g, M).replace(/(นางสาว|นาย|นาง|น\.ส\.)\s*[ก-๙]{2,}(\s+[ก-๙]{2,})?/g, '$1 ' + M).replace(/(บ้านเลขที่|เลขที่)\s*[\d/]+/g, '$1 ' + M);
  }
  function shOpen() {
    if (!sh) {
      sh = sheet('vsh', '#7fb5ff', '🔗', 'แชร์ผลตรวจให้คนอื่นดู', 'ลิงก์อ่านอย่างเดียว · ปิดบังข้อมูลส่วนตัว · หมดอายุใน 7 วัน');
      sh.addEventListener('click', function (e) {
        if (e.target.closest('.vsh-go')) return create();
        if (e.target.closest('[data-login]')) { hide(sh); var a = document.querySelector('#bottomNav [data-nav="acct"]') || document.getElementById('authToggle'); if (a) setTimeout(function () { a.click(); }, 300); return; }
        var url = last ? location.origin + last.url : '';
        if (e.target.closest('[data-cp]')) { var b = e.target.closest('[data-cp]'); (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = 'คัดลอกแล้ว ✓'; setTimeout(function () { b.textContent = 'คัดลอก'; }, 1500); }, function () { var i = sh.querySelector('.vsh-link input'); i.select(); try { document.execCommand('copy'); } catch (er) {} }); return; }
        if (e.target.closest('[data-ln]')) { window.open('https://line.me/R/share?text=' + encodeURIComponent('ผลตรวจสัญญาของฉัน ช่วยดูให้หน่อย 🙏\n' + url), '_blank', 'noopener'); return; }
        if (e.target.closest('[data-sh]')) { navigator.share({ title: 'ผลตรวจสัญญา', text: 'ผลตรวจสัญญาของฉัน ช่วยดูให้หน่อย 🙏', url: url }).catch(function () {}); return; }
        if (e.target.closest('.vsh-rv')) return revoke();
      });
    }
    if (!res()) { if (window.VCTools) VCTools.open(); return; }
    last = null; shForm(); show(sh);
  }
  function shForm(err) {
    var q = sample(), n = (res().items || []).length;
    var h = '<div class="vsh-who"><span>👨‍👩‍👧 พ่อแม่ / ครอบครัว</span><span>🧑‍🤝‍🧑 เพื่อนที่เคยเช่า/เคยเซ็น</span><span>⚖️ ทนาย / ที่ปรึกษา</span></div>' +
      '<div class="vsh-pv"><p>คนที่เปิดลิงก์จะเห็น</p><ul><li>ผลตรวจทั้ง ' + n + ' ประเด็น พร้อมสิ่งที่ควรขอแก้</li><li>เรื่องที่สัญญายังไม่ได้ระบุ</li><li class="x">ไม่เห็นข้อความสัญญาฉบับเต็ม บัญชี หรือเครดิตของคุณ</li><li class="x">ชื่อ เลขบัตร เบอร์โทร อีเมล เลขบัญชี ถูกปิดบัง</li></ul></div>' +
      '<label class="vsh-tg"><input type="checkbox" class="vsh-q" checked><span class="vsh-sw"></span><span><b>แสดงข้อความจากสัญญาที่ยกมา</b><small>ช่วยให้คนอ่านเข้าใจบริบท · ข้อมูลส่วนตัวยังถูกปิดบัง</small></span></label>' +
      (q ? '<div class="vsh-mk">ตัวอย่างหลังปิดบัง: “' + maskPreview(q) + '”</div>' : '') +
      (err ? '<div class="vsh-er">' + esc(err.msg) + (err.login ? ' <button type="button" data-login style="margin-left:6px;border:0;background:#7fb5ff;color:#06142b;border-radius:8px;padding:4px 10px;font:600 12px Prompt;cursor:pointer">เข้าสู่ระบบ</button>' : '') + '</div>' : '') +
      '<button type="button" class="vsh-go">🔗 สร้างลิงก์แชร์</button>';
    sh.querySelector('.vmx-bd').innerHTML = h;
  }
  function create() {
    var b = sh.querySelector('.vsh-go'); b.disabled = true; b.textContent = 'กำลังสร้างลิงก์…';
    var quotes = sh.querySelector('.vsh-q').checked;
    var title = (document.querySelector('#result .rpt-title') || {}).textContent || '';
    fetch('/api/share', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ result: res(), quotes: quotes, typeText: typeText(), title: title.trim() }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) { if (!x.ok) throw { msg: x.j.error || 'สร้างลิงก์ไม่สำเร็จ', login: !!x.j.login }; last = x.j; done(); })
      .catch(function (er) { shForm(er && er.msg ? er : { msg: 'สร้างลิงก์ไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่' }); });
  }
  function done() {
    var url = location.origin + last.url, exp = ''; try { exp = new Date(last.expiresAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) {}
    var share = !!navigator.share;
    sh.querySelector('.vmx-bd').innerHTML = '<div class="vsh-ok"><i>✅</i><b>ลิงก์พร้อมแชร์แล้ว</b><small>ใช้ได้ถึง ' + esc(exp) + ' · ใครมีลิงก์ก็เปิดดูได้ แชร์เฉพาะคนที่ไว้ใจ</small></div>' +
      '<div class="vsh-link"><input type="text" readonly value="' + esc(url) + '" aria-label="ลิงก์แชร์"><button type="button" data-cp>คัดลอก</button></div>' +
      '<div class="vsh-acts" style="--n:' + (share ? 2 : 1) + '"><button type="button" class="line" data-ln>ส่งทาง LINE</button>' + (share ? '<button type="button" data-sh>ส่งต่อ…</button>' : '') + '</div>' +
      '<button type="button" class="vsh-rv">ยกเลิกลิงก์นี้ (คนที่มีลิงก์จะเปิดไม่ได้อีก)</button>';
  }
  function revoke() {
    if (!last) return;
    fetch('/api/share/' + encodeURIComponent(last.id), { method: 'DELETE', credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw 0;
      sh.querySelector('.vmx-bd').innerHTML = '<div class="vsh-ok"><i>🗑️</i><b>ยกเลิกลิงก์แล้ว</b><small>คนที่มีลิงก์เดิมจะเปิดไม่ได้อีก · สร้างลิงก์ใหม่ได้ทุกเมื่อ</small></div><button type="button" class="vsh-go">🔗 สร้างลิงก์ใหม่</button>';
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
      '<button type="button" class="vmx-rb" data-m="sh" style="--c:#7fb5ff"><span class="i">🔗</span><span><b>แชร์ให้คนอื่นดู</b><small>ลิงก์อ่านอย่างเดียว 7 วัน</small></span></button>';
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
