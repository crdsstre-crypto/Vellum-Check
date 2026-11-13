/* ===== หน้าตาใหม่ของ "ปกป้องข้อมูลส่วนตัว" (privacy.js ยังเป็นตัวทำงานหลัก ไฟล์นี้แต่งหน้าอย่างเดียว) =====
   (1) สวิตช์แทนช่องติ๊ก + ไอคอนแต่ละหมวด · ปิดสวิตช์หลัก = แถวย่อยจางลง
   (2) ตัวอย่างก่อน/หลังปกปิด: แถบดำปาดทับข้อความตัวอย่างตอนเปิดสวิตช์
   (3) โล่ใหญ่ + แถบระดับ "ปกป้อง n/4 หมวด" (เขียว = ครบ · เหลือง = บางส่วน · เทา = ปิด)
   (4) คำที่ปกปิดเพิ่มเองเป็นป้ายแท็ก (Enter หรือ , เพื่อเพิ่ม · ✕ ลบ) · ยังเขียนกลับไปที่ #psCustom ให้ privacy.js ใช้ตามเดิม
   (5) คำเตือนเป็นการ์ดสีเหลืองอ่อน แบ่งเป็นข้อสั้น ๆ
   (6) ไม่มีปุ่ม "ตั้งค่า/ซ่อน" แล้ว — แตะหัวแผงเพื่อเปิด/ปิด มีลูกศรหมุน + แอนิเมชันกาง */
(function () {
  'use strict';
  var P = '#checkCard #privacyShield';
  var css = '' +
    P + '{--vx-ok:#34d399;--vx-warn:#f5c451;--vx-mu:#9a9aa3;--vx-line:rgba(255,255,255,.08);font-family:Prompt,sans-serif;--ff:Prompt,sans-serif}' +
    P + ' #psMore{display:none !important}' +
    /* (6) หัวแผงกดได้ */
    P + ' .ps-head{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}' +
    P + '.vx-desk .ps-chev{display:block !important;flex:0 0 20px;width:20px;height:20px;color:var(--vx-mu);transition:transform .3s cubic-bezier(.3,1.3,.5,1)}' +
    P + '.vx-desk.vx-open .ps-chev{transform:rotate(180deg)}' +
    P + ' .ps-chev{transition:transform .3s cubic-bezier(.3,1.3,.5,1) !important}' +
    P + '.ps-open > :not(.ps-head),' + P + '.vx-desk.vx-open .ps-body{animation:vxIn .35s cubic-bezier(.25,.8,.3,1) both}' +
    '@keyframes vxIn{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}' +
    /* (3) โล่ + แถบระดับ */
    P + ' .vx-meter{display:flex;align-items:center;gap:14px;margin:0 0 12px;padding:14px;border-radius:16px;border:1px solid var(--vx-line);' +
      'background:radial-gradient(120% 120% at 0% 0%,rgba(52,211,153,.12),transparent 60%),rgba(255,255,255,.02);transition:background .4s}' +
    P + ' .vx-meter.warn{background:radial-gradient(120% 120% at 0% 0%,rgba(245,196,81,.13),transparent 60%),rgba(255,255,255,.02)}' +
    P + ' .vx-meter.off{background:rgba(255,255,255,.02)}' +
    P + ' .vx-shield{flex:none;width:58px;height:64px;display:block}' +
    P + ' .vx-shield svg{width:58px !important;height:64px !important;max-width:none !important;display:block;overflow:visible}' +
    P + ' .vx-shield .vx-sh{transition:fill .4s}' +
    P + ' .vx-shield .vx-ck{stroke-dasharray:40;stroke-dashoffset:0;transition:stroke-dashoffset .5s .1s,opacity .3s}' +
    P + ' .vx-meter.off .vx-ck{stroke-dashoffset:40;opacity:0}' +
    P + ' .vx-mt{flex:1;min-width:0}' +
    P + ' .vx-mt b{display:block;font:600 15px/1.3 Prompt,sans-serif;color:#ececef}' +
    P + ' .vx-mt small{display:block;margin-top:2px;font:400 12.5px/1.4 Prompt,sans-serif;color:var(--vx-mu)}' +
    P + ' .vx-segs{display:flex;gap:4px;margin-top:8px}' +
    P + ' .vx-segs i{flex:1;height:6px;border-radius:4px;background:rgba(255,255,255,.1);transition:background .35s}' +
    P + ' .vx-segs i.on{background:var(--vx-ok)}' + P + ' .vx-meter.warn .vx-segs i.on{background:var(--vx-warn)}' +
    /* (1) แถวตั้งค่า */
    P + ' .ps-list{background:rgba(255,255,255,.02) !important;border:1px solid var(--vx-line) !important;border-radius:16px !important;overflow:hidden;padding:0 !important}' +
    P + ' .ps-list li+li{border-top:1px solid var(--vx-line) !important}' +
    P + ' .ps-row{display:flex !important;align-items:center !important;gap:12px !important;min-height:62px !important;padding:12px 14px !important;transition:opacity .3s,background .2s}' +
    P + ' .ps-row:active{background:rgba(255,255,255,.03)}' +
    P + ' .ps-row > span:not(.vx-ic){flex:1;min-width:0;font:500 15px/1.35 Prompt,sans-serif !important;color:#ececef !important}' +
    P + ' .ps-row small{display:block;margin-top:2px;font:400 12.5px/1.4 Prompt,sans-serif !important;color:var(--vx-mu) !important}' +
    P + ' .vx-ic{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--c,rgba(255,255,255,.06));color:var(--k,#ddd)}' +
    P + ' .vx-ic svg{width:20px !important;height:20px !important;max-width:none !important;display:block;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    P + ' .ps-list li:first-child .ps-row{background:linear-gradient(90deg,rgba(52,211,153,.08),transparent 70%)}' +
    P + ' .ps-list li:first-child .ps-row > span:not(.vx-ic){font-weight:600 !important}' +
    P + '.is-off .ps-list li:not(:first-child) .ps-row{opacity:.38;pointer-events:none}' +
    P + '.is-off .ps-list li:first-child .ps-row{background:none}' +
    /* สวิตช์ */
    P + ' .ps-row input[type="checkbox"]{-webkit-appearance:none !important;appearance:none !important;position:relative;flex:0 0 48px !important;width:48px !important;height:28px !important;min-width:48px;margin:0 !important;padding:0 !important;' +
      'border-radius:999px !important;border:0 !important;background:#3a3b42 !important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);cursor:pointer;transition:background .25s;accent-color:auto}' +
    P + ' .ps-row input[type="checkbox"]::before{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.4);transition:transform .28s cubic-bezier(.3,1.4,.5,1)}' +
    P + ' .ps-row input[type="checkbox"]:checked{background:var(--vx-ok) !important}' +
    P + ' .ps-row input[type="checkbox"]:checked::before{transform:translateX(20px)}' +
    P + ' .ps-row input[type="checkbox"]:focus-visible{outline:2px solid var(--vx-ok);outline-offset:2px}' +
    /* (2) ตัวอย่างก่อน/หลัง */
    P + ' .vx-demo{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px;font:500 12px/1 Prompt,sans-serif;color:#c9c9cf}' +
    P + ' .vx-demo q{quotes:none;position:relative;display:inline-block;padding:4px 7px;border-radius:6px;background:rgba(255,255,255,.06);white-space:nowrap;overflow:hidden}' +
    P + ' .vx-demo q::after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--w,0%);background:#0b0b0d;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);transition:width .55s cubic-bezier(.6,0,.2,1)}' +
    P + ' .vx-demo q.on::after{--w:100%}' +
    P + ' .vx-pre{font:500 12px/1 Prompt,sans-serif;color:#c9c9cf;padding:4px 2px 4px 7px;border-radius:6px 0 0 6px;background:rgba(255,255,255,.06);margin-right:-6px}' +
    P + ' .vx-pre + q{border-radius:0 6px 6px 0}' +
    P + ' .ps-row .vx-demo > *{flex:none !important;min-width:0 !important;width:auto !important}' +
    P + ' .ps-row .vx-demo{flex:none !important}' +
    P + ' .vx-demo em{font-style:normal;color:var(--vx-ok);font-size:11px;white-space:nowrap}' +
    P + ' .vx-demo em.off{color:var(--vx-mu)}' +
    /* (4) ป้ายแท็ก */
    P + ' .ps-custom{margin:14px 0 0 !important;font:500 13px/1.4 Prompt,sans-serif !important;color:#d4d4d8 !important}' +
    P + ' #psCustom{position:absolute !important;width:1px !important;height:1px !important;opacity:0 !important;pointer-events:none !important;margin:0 !important;padding:0 !important;border:0 !important}' +
    P + ' .vx-tags{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px;padding:8px;min-height:52px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#0e0f12;cursor:text;transition:border-color .2s,box-shadow .2s}' +
    P + ' .vx-tags.focus{border-color:var(--vx-ok);box-shadow:0 0 0 3px rgba(52,211,153,.15)}' +
    P + ' .vx-tag{display:inline-flex;align-items:center;gap:4px;max-width:100%;padding:5px 6px 5px 10px;border-radius:999px;background:#26272d;border:1px solid rgba(255,255,255,.1);color:#ececef;font:500 13px/1.2 Prompt,sans-serif;animation:vxTag .3s cubic-bezier(.3,1.5,.5,1)}' +
    P + ' .vx-tag::before{content:"";width:12px;height:8px;border-radius:2px;background:#0b0b0d;box-shadow:inset 0 0 0 1px rgba(255,255,255,.15);margin-right:2px}' +
    P + ' .vx-tag span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}' +
    P + ' .vx-tag button{display:grid;place-items:center;width:20px;height:20px;min-height:0 !important;padding:0 !important;border:0 !important;border-radius:50%;background:rgba(255,255,255,.1) !important;color:#ccc;font-size:11px;line-height:1;cursor:pointer}' +
    '@keyframes vxTag{0%{transform:scale(.6);opacity:0}100%{transform:none;opacity:1}}' +
    P + ' .vx-tin{flex:1 1 120px;min-width:110px;height:34px;margin:0 !important;padding:0 6px !important;border:0 !important;outline:0;background:transparent !important;color:#ececef;font:400 16px/1.3 Prompt,sans-serif;box-shadow:none !important}' +
    P + ' .vx-quick{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}' +
    P + ' .vx-quick button{min-height:30px !important;padding:4px 11px !important;border-radius:999px !important;border:1px dashed rgba(255,255,255,.2) !important;background:transparent !important;color:#bdbdc4 !important;font:500 12px/1.2 Prompt,sans-serif !important;cursor:pointer}' +
    P + ' .vx-quick button:active{transform:scale(.96)}' +
    P + ' .vx-hint{margin:6px 2px 0;font:400 11.5px/1.4 Prompt,sans-serif;color:var(--vx-mu)}' +
    /* (5) การ์ดคำเตือน */
    P + ' .ps-fine{display:flex !important;gap:10px;margin:14px 0 0 !important;padding:12px 14px !important;border-radius:14px !important;border:1px solid rgba(245,196,81,.25) !important;background:rgba(245,196,81,.07) !important;color:#e9dcb4 !important;font:400 12.5px/1.55 Prompt,sans-serif !important}' +
    P + ' .vx-fi{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:rgba(245,196,81,.2);color:#f5c451;font:700 13px/1 Prompt,sans-serif}' +
    P + ' .vx-fl{margin:0;padding:0;list-style:none;display:grid;gap:4px}' +
    P + ' .vx-fl li{position:relative;padding-left:12px}' +
    P + ' .vx-fl li::before{content:"";position:absolute;left:0;top:.6em;width:5px;height:5px;border-radius:50%;background:#f5c451}' +
    P + ' .vx-fl b{color:#f5d27a;font-weight:600}' +
    '@media (prefers-reduced-motion:reduce){' + P + ' *{transition:none !important;animation:none !important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ICON = {
    master: ['rgba(52,211,153,.14)', '#34d399', '<path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="m9 12 2.2 2.2L15.3 10"/>'],
    name: ['rgba(96,165,250,.14)', '#7fb5ff', '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5"/>'],
    id: ['rgba(167,139,250,.15)', '#b4a0ff', '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6.5 15.5c.6-1.2 1.4-1.8 2.5-1.8s1.9.6 2.5 1.8M14 10h3.5M14 13h3.5"/>'],
    phone: ['rgba(245,196,81,.14)', '#f5c451', '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>'],
    email: ['rgba(244,114,182,.14)', '#f9a8d4', '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>']
  };
  // ตัวอย่าง: [ข้อความก่อน, ส่วนที่ไม่ถูกปิด (ไว้ข้างหน้า)]
  var DEMO = { name: ['นายสมชาย ใจดี', 'นาย'], id: ['1-2345-67890-12-3', ''], phone: ['081-234-5678', ''], email: ['somchai@mail.com', ''] };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function init() {
    var ps = document.getElementById('privacyShield'); if (!ps || ps.getAttribute('data-vx')) return;
    ps.setAttribute('data-vx', '1');
    var head = ps.querySelector('.ps-head'), body = document.getElementById('psBody'), more = document.getElementById('psMore');
    var master = document.getElementById('psMaster'), keys = ['name', 'id', 'phone', 'email'];

    /* (1)+(2) ไอคอน + ตัวอย่าง */
    [['master', master]].concat(keys.map(function (k) { return [k, document.getElementById('ps_' + k)]; })).forEach(function (p) {
      var cb = p[1]; if (!cb) return; var row = cb.closest('.ps-row'); if (!row) return;
      var ic = ICON[p[0]], s = document.createElement('span'); s.className = 'vx-ic'; s.style.setProperty('--c', ic[0]); s.style.setProperty('--k', ic[1]); s.innerHTML = svg(ic[2]);
      row.insertBefore(s, row.firstChild);
      var d = DEMO[p[0]];
      if (d) {
        var txt = row.querySelector('span:not(.vx-ic)');
        var demo = document.createElement('span'); demo.className = 'vx-demo'; demo.setAttribute('aria-hidden', 'true');
        demo.innerHTML = (d[1] ? '<span class="vx-pre">' + esc(d[1]) + '</span>' : '') + '<q>' + esc(d[0].slice(d[1].length).trim()) + '</q><em></em>';
        txt.appendChild(demo);
      }
    });

    /* (3) โล่ + แถบระดับ */
    var meter = document.createElement('div'); meter.className = 'vx-meter';
    meter.innerHTML = '<span class="vx-shield">' + '<svg viewBox="0 0 58 64" aria-hidden="true"><defs><linearGradient id="vxG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<path class="vx-sh" d="M29 3 53 11.5v18.8C53 46 42.5 56.5 29 61 15.5 56.5 5 46 5 30.3V11.5z" fill="#34d399"/>' +
      '<path d="M29 3 53 11.5v18.8C53 46 42.5 56.5 29 61z" fill="#000" opacity=".12"/><path d="M29 8 48 14.8v15.5c0 2-.2 3.9-.6 5.7L10.6 15.2 29 8z" fill="url(#vxG)"/>' +
      '<path class="vx-ck" d="M18 32l7.5 7.5L41 24" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '<div class="vx-mt"><b></b><small></small><div class="vx-segs">' + keys.map(function () { return '<i></i>'; }).join('') + '</div></div>';
    if (body) body.insertBefore(meter, body.firstChild);

    /* (4) ป้ายแท็ก */
    var src = document.getElementById('psCustom'), lab = src && src.closest('.ps-custom');
    var tags = [];
    if (src && lab) {
      lab.firstChild.nodeValue = 'ปกปิดคำอื่นเพิ่มเอง';
      var box = document.createElement('div'); box.className = 'vx-tags';
      var tin = document.createElement('input'); tin.className = 'vx-tin'; tin.type = 'text'; tin.setAttribute('autocomplete', 'off'); tin.setAttribute('autocapitalize', 'off'); tin.spellcheck = false;
      tin.placeholder = 'พิมพ์คำ แล้วกด Enter'; tin.setAttribute('aria-label', 'เพิ่มคำที่ต้องการปกปิด');
      box.appendChild(tin);
      var quick = document.createElement('div'); quick.className = 'vx-quick';
      [['ชื่อบริษัท', 'พิมพ์ชื่อบริษัท แล้วกด Enter'], ['ที่อยู่', 'พิมพ์ที่อยู่ แล้วกด Enter'], ['เลขบัญชี', 'พิมพ์เลขบัญชี แล้วกด Enter'], ['ชื่อโครงการ', 'พิมพ์ชื่อโครงการ แล้วกด Enter']].forEach(function (q) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = '+ ' + q[0];
        b.addEventListener('click', function (e) { e.preventDefault(); tin.placeholder = q[1]; tin.focus(); });
        quick.appendChild(b);
      });
      var hint = document.createElement('p'); hint.className = 'vx-hint'; hint.textContent = 'คำเหล่านี้ไม่ถูกบันทึกในเครื่อง ปิดหน้าเว็บแล้วหายไป';
      lab.parentNode.insertBefore(box, lab.nextSibling); box.parentNode.insertBefore(quick, box.nextSibling); quick.parentNode.insertBefore(hint, quick.nextSibling);
      tags = String(src.value || '').split(/[,\n]/).map(function (x) { return x.trim(); }).filter(Boolean);
      var push = function () { src.value = tags.join(', '); src.dispatchEvent(new Event('input', { bubbles: true })); };
      var draw = function () {
        [].slice.call(box.querySelectorAll('.vx-tag')).forEach(function (t) { t.parentNode.removeChild(t); });
        tags.forEach(function (w, i) {
          var t = document.createElement('span'); t.className = 'vx-tag';
          t.innerHTML = '<span>' + esc(w) + '</span><button type="button" aria-label="ลบคำ ' + esc(w) + '">✕</button>';
          t.querySelector('button').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); tags.splice(i, 1); draw(); push(); tin.focus(); });
          box.insertBefore(t, tin);
        });
      };
      var add = function (v) {
        String(v).split(/[,\n،、]/).map(function (x) { return x.trim(); }).forEach(function (w) { if (w.length >= 2 && tags.indexOf(w) < 0) tags.push(w); });
        tin.value = ''; draw(); push();
      };
      tin.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); if (tin.value.trim()) add(tin.value); }
        else if (e.key === 'Backspace' && !tin.value && tags.length) { tags.pop(); draw(); push(); }
      });
      tin.addEventListener('input', function () { if (/[,\n]/.test(tin.value)) add(tin.value); });
      tin.addEventListener('blur', function () { box.classList.remove('focus'); if (tin.value.trim()) add(tin.value); });
      tin.addEventListener('focus', function () { box.classList.add('focus'); });
      box.addEventListener('click', function (e) { if (e.target === box) tin.focus(); });
      lab.addEventListener('click', function (e) { if (e.target === lab) { e.preventDefault(); tin.focus(); } });
      draw();
    }

    /* (5) การ์ดคำเตือน */
    var fine = ps.querySelector('.ps-fine');
    if (fine) fine.innerHTML = '<span class="vx-fi" aria-hidden="true">i</span><ul class="vx-fl">' +
      '<li>ระบบอาจตรวจจับ<b>ไม่ครบทุกกรณี</b> โดยเฉพาะชื่อ และไฟล์สแกนหรือภาพถ่ายเอกสาร ควรดูตัวอย่างก่อนกดตรวจ</li>' +
      '<li><b>ไม่ปกปิด</b> ค่าเช่า วันที่ ระยะเวลา และจำนวนเงิน เพราะจำเป็นต่อการตรวจสัญญา</li></ul>';

    /* (6) แตะหัวแผงเพื่อเปิด/ปิด (มือถือใช้ระบบพับเดิมของหน้า · คอมเปิด/ปิดส่วนตั้งค่า) */
    if (more) more.setAttribute('hidden', '');
    function desk() { return !ps.classList.contains('ps-fold'); }
    function syncMode() {
      var d = desk(); ps.classList.toggle('vx-desk', d);
      if (!d && body) body.hidden = false;                       // มือถือ: แผงพับทั้งแผงอยู่แล้ว ส่วนตั้งค่าแสดงเสมอเมื่อกาง
      if (d && body) { body.hidden = !ps.classList.contains('vx-open'); }
      if (d && !ps.querySelector('.ps-chev')) {
        var c = document.createElement('span'); c.className = 'ps-chev'; c.setAttribute('aria-hidden', 'true');
        c.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
        head.appendChild(c);
      }
    }
    if (head) {
      head.setAttribute('role', 'button'); head.setAttribute('tabindex', '0');
      head.addEventListener('click', function () {
        if (!desk()) return;   // มือถือ: art.js จัดการ
        var open = !ps.classList.contains('vx-open'); ps.classList.toggle('vx-open', open);
        if (body) body.hidden = !open; head.setAttribute('aria-expanded', String(open));
      });
      head.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && desk()) { e.preventDefault(); head.click(); } });
    }
    syncMode();
    new MutationObserver(syncMode).observe(ps, { attributes: true, attributeFilter: ['class'] });

    /* อัปเดตโล่ + ตัวอย่างตามสวิตช์ */
    function paint() {
      var on = master && master.checked, n = 0;
      keys.forEach(function (k) {
        var cb = document.getElementById('ps_' + k), act = on && cb && cb.checked; if (act) n++;
        var row = cb && cb.closest('.ps-row'), q = row && row.querySelector('.vx-demo q'), em = row && row.querySelector('.vx-demo em');
        if (q) q.classList.toggle('on', !!act);
        if (em) { em.textContent = act ? '✓ ปกปิด' : 'ส่งตามจริง'; em.className = act ? '' : 'off'; }
      });
      var segs = meter.querySelectorAll('.vx-segs i'); for (var i = 0; i < segs.length; i++) segs[i].className = i < n ? 'on' : '';
      meter.className = 'vx-meter' + (!on || !n ? ' off' : n < keys.length ? ' warn' : '');
      meter.querySelector('.vx-sh').setAttribute('fill', !on || !n ? '#5b5d66' : n < keys.length ? '#f5c451' : '#34d399');
      meter.querySelector('b').textContent = !on ? 'ปิดการปกป้องอยู่' : 'ปกป้อง ' + n + '/' + keys.length + ' หมวด';
      meter.querySelector('small').textContent = !on ? 'ข้อความจะถูกส่งไปวิเคราะห์ตามที่เห็น' : n === keys.length ? 'ปกปิดข้อมูลส่วนตัวครบทุกหมวดก่อนส่ง' : n ? 'บางหมวดจะถูกส่งตามจริง' : 'ยังไม่ได้เลือกหมวดที่จะปกปิด';
    }
    ps.addEventListener('change', function () { setTimeout(paint, 0); });
    setTimeout(paint, 50); setTimeout(paint, 600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
