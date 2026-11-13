/* ===== "สิ่งที่สัญญานี้ยังไม่ระบุ" แบบใหม่ =====
   (1) บอกว่าทำไมต้องถาม: คำอธิบายสำเร็จรูปตามหัวข้อ (ไม่เรียก AI)
   (2) ปุ่มคัดลอกคำถามพร้อมส่งของแต่ละข้อ
   (3) สถานะ 3 แบบ: ยังไม่ถาม → ถามแล้ว → ได้คำตอบ · วงแหวน "เคลียร์แล้ว n/N" · จำไว้ในเครื่อง
   (6) ปุ่ม "ถามทีเดียว": รวมทุกข้อที่ยังไม่ถามเป็นข้อความเดียว ส่งผ่านหน้าแชร์ของมือถือ แล้วติ๊ก "ถามแล้ว" ให้
   ใช้รายการจาก section.miss ที่ script.js/art.js สร้างไว้ แล้วซ่อนรายการเดิม (art.js ยังทำงานตามปกติ) */
(function () {
  'use strict';
  var TIPS = [
    [/ทรัพย์สิน|สภาพ|ตรวจรับ|อุปกรณ์|เฟอร์นิเจอร์|ส่งมอบห้อง|ของในห้อง/, 'ถ้าไม่มี ตอนย้ายออกหรือส่งคืน อาจถูกหักเงินค่าของที่ชำรุดอยู่แล้วตั้งแต่แรก', 'ขอให้แนบรายการทรัพย์สินพร้อมรูปถ่ายสภาพวันส่งมอบ และเซ็นรับรองทั้งสองฝ่าย'],
    [/เงินประกัน|มัดจำ|คืนเงิน/, 'ไม่รู้ว่าจะได้เงินคืนเมื่อไร และอีกฝ่ายหักอะไรได้บ้าง', 'ขอให้ระบุว่าจะคืนเงินประกันภายในกี่วัน และหักได้ในกรณีใดบ้าง'],
    [/ชื่อ|ที่อยู่|คู่สัญญา|บัตรประชาชน|นิติบุคคล|ผู้มีอำนาจ/, 'ถ้าข้อมูลคู่สัญญาไม่ครบ จะติดตามหรือเรียกร้องจากอีกฝ่ายได้ยากเมื่อมีปัญหา', 'ขอให้ระบุชื่อ-นามสกุล ที่อยู่ และเลขบัตรประชาชน (หรือเลขนิติบุคคล) ของคู่สัญญาให้ครบ'],
    [/ลายมือชื่อ|พยาน|ลงนาม|เซ็น/, 'สัญญาที่ลายเซ็นหรือพยานไม่ครบ พิสูจน์ได้ยากถ้ามีข้อพิพาท', 'ขอให้ลงลายมือชื่อทั้งสองฝ่าย พร้อมพยานอย่างน้อย 2 คน'],
    [/ค่าน้ำ|ค่าไฟ|ส่วนกลาง|ค่าใช้จ่าย|ภาษี|ค่าธรรมเนียม|ค่าโอน/, 'อาจมีค่าใช้จ่ายเพิ่มที่ไม่ได้คาดไว้ และเถียงกันได้ว่าใครต้องจ่าย', 'ขอให้ระบุค่าใช้จ่ายทุกรายการ อัตราที่คิด และฝ่ายที่ต้องจ่ายให้ชัด'],
    [/ซ่อม|ดูแล|บำรุง|ชำรุด/, 'ไม่ชัดว่าใครต้องจ่ายค่าซ่อม อาจถูกเรียกเก็บทั้งที่ไม่ใช่ความผิดของคุณ', 'ขอให้ระบุว่าใครรับผิดชอบค่าซ่อมแต่ละประเภท และกรณีเสื่อมตามสภาพใช้งาน'],
    [/ยกเลิก|เลิกสัญญา|บอกเลิก|สิ้นสุด|ต่อสัญญา/, 'ไม่รู้ว่าจะออกจากสัญญาได้อย่างไร ต้องแจ้งก่อนกี่วัน และเสียอะไรบ้าง', 'ขอให้ระบุเงื่อนไขการบอกเลิกสัญญา ระยะแจ้งล่วงหน้า และค่าใช้จ่ายถ้าเลิกก่อนกำหนด'],
    [/ดอกเบี้ย|ชำระ|งวด|ค่าจ้าง|ราคา|จ่าย|เงินเดือน|ค่าเช่า|เงิน/, 'ถ้าจำนวนเงินหรือวันจ่ายไม่ชัด อาจเถียงกันภายหลังว่าตกลงไว้อย่างไร', 'ขอให้ระบุจำนวนเงิน วันครบกำหนด และวิธีชำระให้ชัดเจน'],
    [/รับประกัน|warranty/i, 'ถ้าของเสียหลังรับมอบ อาจเรียกร้องอะไรจากอีกฝ่ายไม่ได้', 'ขอให้ระบุระยะเวลารับประกันและสิ่งที่ครอบคลุม'],
    [/วัน|ระยะเวลา|กำหนด|เริ่ม|ส่งงาน|ส่งของ/, 'ถ้าไม่มีวันที่ชัด อีกฝ่ายอาจเร่งหรือเลื่อนได้ตามใจ และนับระยะเวลาไม่ตรงกัน', 'ขอให้ระบุวันเริ่ม วันสิ้นสุด และกำหนดส่งงาน/ส่งของให้ชัด'],
    [/ความลับ|ข้อมูล/, 'ไม่ชัดว่าข้อมูลไหนต้องเก็บเป็นความลับ และนานแค่ไหน', 'ขอให้ระบุขอบเขตข้อมูลที่เป็นความลับ และระยะเวลาที่ต้องรักษาความลับ'],
    [/ศาล|ข้อพิพาท|กฎหมาย/, 'ถ้ามีปัญหา ไม่รู้ว่าจะแก้กันอย่างไรหรือต้องไปศาลที่ไหน', 'ขอให้ระบุวิธีระงับข้อพิพาทและศาลที่มีเขตอำนาจ']
  ];
  var DEF = ['ถ้าไม่เขียนไว้ อาจตีความต่างกันภายหลัง และพิสูจน์ได้ยากว่าตกลงกันไว้อย่างไร', 'ขอให้เพิ่มเรื่องนี้ให้ชัดเจนในสัญญา'];
  function tipOf(t) { for (var i = 0; i < TIPS.length; i++) if (TIPS[i][0].test(t)) return [TIPS[i][1], TIPS[i][2]]; return DEF; }
  var ST = [{ t: 'ยังไม่ถาม', c: 'todo' }, { t: 'ถามแล้ว', c: 'ask' }, { t: 'ได้คำตอบ', c: 'ok' }];

  function hsh(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function k2(t) { return 'vc_miss2_' + hsh((window.__vcCheckedText || '') + '|' + t); }
  function k1(t) { return 'vc_miss_' + hsh((window.__vcCheckedText || '') + '|' + t); }   // ค่าเดิมของ art.js (ติ๊กแล้ว = ได้คำตอบ)
  function getS(t) { try { var v = localStorage.getItem(k2(t)); if (v != null) return +v || 0; return localStorage.getItem(k1(t)) === '1' ? 2 : 0; } catch (e) { return 0; } }
  function setS(t, v) { try { if (v) localStorage.setItem(k2(t), String(v)); else localStorage.removeItem(k2(t)); localStorage.setItem(k1(t), v === 2 ? '1' : ''); if (v !== 2) localStorage.removeItem(k1(t)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function txtOf(li) { var c = li.cloneNode(true); [].forEach.call(c.querySelectorAll('.vc-ck'), function (x) { x.remove(); }); return c.textContent.replace(/\s+/g, ' ').trim(); }
  function q1(t) { var tp = tipOf(t); return 'เรื่อง "' + t + '" สัญญายังไม่ได้ระบุ ' + tp[1]; }

  var IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg>';
  var CP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></svg>';
  var P = 'section.miss.vmi';
  var css = '' +
    'html.vc-art article.rpt.vc-m ' + P + ' > ul,html.vc-art article.rpt.vc-m ' + P + ' .vc-miss-more,html.vc-art article.rpt.vc-m ' + P + ' .vc-miss-ask,' + P + ' > ul,' + P + ' .vc-miss-more,' + P + ' .vc-miss-ask{display:none !important}' +
    P + ' .vmi-top{display:flex;align-items:center;gap:12px;margin:2px 0 12px}' +
    P + ' .vmi-ring{position:relative;flex:none;width:52px;height:52px}' +
    P + ' .vmi-ring svg{width:52px !important;height:52px !important;max-width:none !important;display:block;transform:rotate(-90deg)}' +
    P + ' .vmi-ring .bg{stroke:rgba(255,255,255,.08)}' + P + ' .vmi-ring .fg{stroke:#34d399;stroke-linecap:round;transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)}' +
    P + ' .vmi-ring b{position:absolute;inset:0;display:grid;place-items:center;font:700 13px/1 Prompt,sans-serif;color:#ececef;font-variant-numeric:tabular-nums}' +
    P + ' .vmi-sum{flex:1;min-width:0;font:400 12.5px/1.5 Prompt,sans-serif;color:#a1a1aa}' + P + ' .vmi-sum b{display:block;font:600 14px/1.35 Prompt,sans-serif;color:#ececef}' +
    P + ' .vmi-sum span{display:inline-block;margin-right:8px}' + P + ' .vmi-sum i{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:4px;vertical-align:1px}' +
    P + ' .vmi-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}' +
    P + ' .vmi-it{padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);transition:border-color .25s,background .25s,opacity .25s}' +
    P + ' .vmi-it.s1{border-color:rgba(245,196,81,.35);background:rgba(245,196,81,.05)}' +
    P + ' .vmi-it.s2{border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.05)}' +
    P + ' .vmi-h{display:flex;align-items:flex-start;gap:8px;margin:0;font:600 14.5px/1.45 Prompt,sans-serif;color:#ececef}' +
    P + ' .vmi-it.s2 .vmi-h span{color:#a1a1aa;text-decoration:line-through;text-decoration-color:rgba(255,255,255,.3)}' +
    P + ' .vmi-n{flex:none;display:grid;place-items:center;width:22px;height:22px;margin-top:1px;border-radius:7px;background:rgba(255,255,255,.07);font:700 11.5px/1 Prompt,sans-serif;color:#a1a1aa}' +
    P + ' .vmi-it.s1 .vmi-n{background:rgba(245,196,81,.2);color:#f5c451}' + P + ' .vmi-it.s2 .vmi-n{background:#34d399;color:#06281c}' +
    P + ' .vmi-why{margin:6px 0 0 30px;font:400 12.5px/1.55 Prompt,sans-serif;color:#b4b4bc}' +
    P + ' .vmi-why b{color:#f5c451;font-weight:600}' +
    P + ' .vmi-it.s2 .vmi-why{display:none}' +
    P + ' .vmi-act{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 0 30px}' +
    P + ' .vmi-seg{display:inline-flex;padding:3px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}' +
    P + ' .vmi-seg button{min-height:28px !important;padding:0 10px !important;border:0 !important;border-radius:7px !important;background:transparent !important;color:#9a9aa3 !important;font:500 12px/1 Prompt,sans-serif !important;cursor:pointer;box-shadow:none !important;width:auto !important}' +
    P + ' .vmi-seg button[aria-pressed="true"].todo{background:rgba(255,255,255,.12) !important;color:#ececef !important}' +
    P + ' .vmi-seg button[aria-pressed="true"].ask{background:#f5c451 !important;color:#1a1305 !important}' +
    P + ' .vmi-seg button[aria-pressed="true"].ok{background:#34d399 !important;color:#06281c !important}' +
    P + ' .vmi-cp{display:inline-flex;align-items:center;gap:5px;min-height:34px !important;padding:0 10px !important;margin:0 !important;border-radius:10px !important;border:1px solid rgba(255,255,255,.12) !important;background:transparent !important;color:#d4d4d8 !important;font:500 12px/1 Prompt,sans-serif !important;cursor:pointer;width:auto !important}' +
    P + ' .vmi-cp svg,' + P + ' .vmi-all svg{width:15px !important;height:15px !important;max-width:none !important;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    P + ' .vmi-cp.done{border-color:rgba(52,211,153,.5) !important;color:#34d399 !important}' +
    P + ' .vmi-all{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:48px;margin:14px 0 0;padding:0 14px;border-radius:14px;border:1px solid rgba(245,196,81,.55);background:linear-gradient(120deg,rgba(245,196,81,.2),rgba(245,196,81,.06));color:#f5d27a;font:600 14px/1.2 Prompt,sans-serif;cursor:pointer}' +
    P + ' .vmi-all small{display:block;font:400 11.5px/1.3 Prompt,sans-serif;color:#c9b07a}' +
    P + ' .vmi-all:disabled{border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08);color:#a7f3d0;cursor:default}' +
    P + ' .vmi-all.sent{background:#34d399;border-color:#34d399;color:#06281c}' +
    '@media (max-width:420px){' + P + ' .vmi-why,' + P + ' .vmi-act{margin-left:0}' + P + ' .vmi-seg button{padding:0 7px !important;font-size:11.5px !important}' + P + ' .vmi-act{gap:6px}' + P + ' .vmi-cp{padding:0 9px !important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var C = 2 * Math.PI * 21;

  function say(m) { if (typeof toast === 'function') toast(m); }
  function copy(t, cb) {
    function fb() { try { var a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); var ok = document.execCommand('copy'); a.remove(); return ok; } catch (e) { return false; } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { cb(true); }, function () { cb(fb()); }); else cb(fb());
  }

  function build(m) {
    var texts = [].map.call(m.querySelectorAll(':scope > ul > li'), txtOf).filter(Boolean);
    if (!texts.length) return;
    m.classList.add('vmi');
    var box = document.createElement('div'); box.className = 'vmi-box';
    box.innerHTML = '<div class="vmi-top"><span class="vmi-ring"><svg viewBox="0 0 52 52"><circle class="bg" cx="26" cy="26" r="21" fill="none" stroke-width="6"/><circle class="fg" cx="26" cy="26" r="21" fill="none" stroke-width="6" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg><b></b></span><div class="vmi-sum"></div></div>' +
      '<div class="vmi-list">' + texts.map(function (t, i) {
        var tp = tipOf(t);
        return '<div class="vmi-it" data-i="' + i + '"><p class="vmi-h"><em class="vmi-n">' + (i + 1) + '</em><span>' + esc(t) + '</span></p>' +
          '<p class="vmi-why"><b>ทำไมต้องถาม:</b> ' + esc(tp[0]) + '</p>' +
          '<div class="vmi-act"><span class="vmi-seg" role="group" aria-label="สถานะ">' + ST.map(function (s, k) { return '<button type="button" class="' + s.c + '" data-s="' + k + '" aria-pressed="false">' + s.t + '</button>'; }).join('') + '</span>' +
          '<button type="button" class="vmi-cp" data-cp="' + i + '" title="คัดลอกคำถามไปส่งอีกฝ่าย">' + CP + 'คัดลอก</button></div></div>';
      }).join('') + '</div>' +
      '<button type="button" class="vmi-all">' + IC + '<span></span></button>';
    var note = m.querySelector('.miss-note'); (note || m.querySelector('h3')).insertAdjacentElement('afterend', box);

    function paint() {
      var S = texts.map(getS), done = S.filter(function (x) { return x === 2; }).length, asked = S.filter(function (x) { return x === 1; }).length, todo = S.length - done - asked;
      [].forEach.call(box.querySelectorAll('.vmi-it'), function (li, i) {
        li.className = 'vmi-it s' + S[i];
        [].forEach.call(li.querySelectorAll('.vmi-seg button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-s') === S[i])); });
      });
      box.querySelector('.vmi-ring b').textContent = done + '/' + S.length;
      box.querySelector('.vmi-ring .fg').style.strokeDashoffset = (C * (1 - done / S.length)).toFixed(1);
      box.querySelector('.vmi-sum').innerHTML = '<b>' + (done === S.length ? 'เคลียร์ครบทุกข้อแล้ว 🎉' : 'เคลียร์แล้ว ' + done + ' จาก ' + S.length + ' ข้อ') + '</b>' +
        '<span><i style="background:#71717a"></i>ยังไม่ถาม ' + todo + '</span><span><i style="background:#f5c451"></i>ถามแล้ว ' + asked + '</span><span><i style="background:#34d399"></i>ได้คำตอบ ' + done + '</span>';
      var all = box.querySelector('.vmi-all'); all.classList.remove('sent');
      all.disabled = !todo;
      all.querySelector('span').innerHTML = todo ? 'ถามอีกฝ่ายทีเดียว ' + todo + ' ข้อ<small>รวมเป็นข้อความเดียว ส่งทาง LINE ได้เลย</small>' : (asked ? 'ถามครบแล้ว รอคำตอบอีก ' + asked + ' ข้อ' : 'เคลียร์ครบทุกข้อแล้ว ✓');
    }
    box.addEventListener('click', function (e) {
      var sb = e.target.closest('.vmi-seg button');
      if (sb) { var i = +sb.closest('.vmi-it').getAttribute('data-i'); setS(texts[i], +sb.getAttribute('data-s')); paint(); return; }
      var cp = e.target.closest('.vmi-cp');
      if (cp) {
        var j = +cp.getAttribute('data-cp');
        copy('สวัสดีครับ/ค่ะ ขอสอบถามเพิ่มเติม: ' + q1(texts[j]), function (ok) {
          cp.classList.toggle('done', ok); cp.lastChild.nodeValue = ok ? 'คัดลอกแล้ว' : 'ไม่สำเร็จ';
          if (ok && getS(texts[j]) === 0) { setS(texts[j], 1); paint(); }
          setTimeout(function () { cp.classList.remove('done'); cp.lastChild.nodeValue = 'คัดลอก'; }, 2000);
        });
        return;
      }
      var all = e.target.closest('.vmi-all');
      if (all && !all.disabled) {
        var idx = texts.map(function (t, i) { return getS(t) === 0 ? i : -1; }).filter(function (i) { return i >= 0; });
        var msg = 'สวัสดีครับ/ค่ะ ก่อนลงนาม รบกวนช่วยเพิ่มเรื่องต่อไปนี้ให้ชัดเจนในสัญญาครับ/ค่ะ\n\n' +
          idx.map(function (i, n) { return (n + 1) + ') ' + q1(texts[i]); }).join('\n') + '\n\nขอบคุณครับ/ค่ะ\n(สรุปจาก Vellum Check)';
        var mark = function () { idx.forEach(function (i) { setS(texts[i], 1); }); paint(); all.classList.add('sent'); all.querySelector('span').textContent = 'ส่งแล้ว ✓ ติ๊ก "ถามแล้ว" ให้ ' + idx.length + ' ข้อ'; setTimeout(paint, 2600); };
        if (navigator.share) navigator.share({ text: msg }).then(mark, function (err) { if (err && err.name === 'AbortError') return; copy(msg, function (ok) { if (ok) { say('คัดลอกข้อความแล้ว วางในแชตได้เลย'); mark(); } }); });
        else copy(msg, function (ok) { if (ok) { say('คัดลอกข้อความแล้ว วางในแชตได้เลย'); mark(); } else say('คัดลอกไม่ได้'); });
      }
    });
    paint();
    /* ให้ส่วนอื่นของหน้า (สรุปท้ายหน้า เช็กลิสต์ก่อนเซ็น) นับเฉพาะข้อที่ยังไม่ได้คำตอบ */
    window.__vcMissAsk = function () { return texts.filter(function (t) { return getS(t) !== 2; }); };
  }

  function scan() {
    var res = document.getElementById('result'); if (!res) return;
    var m = res.querySelector('section.miss'); if (!m || m.hidden || m.classList.contains('vmi')) return;
    build(m);
  }
  function boot() {
    var res = document.getElementById('result'); if (!res) return;
    var q = 0;
    new MutationObserver(function () { clearTimeout(q); q = setTimeout(scan, 250); }).observe(res, { childList: true, subtree: true });
    scan();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
