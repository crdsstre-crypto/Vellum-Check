/* Vellum คลังคำถาม — ภาพประกอบเฉพาะข้อ (spot art) viewBox 340×170
   ลายเส้นประจำบ้าน: เส้นหมึกม่วงเข้ม #2b2540 หนา 2.2 ปลายมน · ฉากหลังสีพาสเทลหนึ่งสี + วงกลมรัศมีด้านหลังของหลัก
   สีเน้นปะการัง #ff7a59 กับเหลือง #ffd84d · เงาพื้นวงรีจาง · ตัวหนังสือในภาพสั้นและตรงกับคำตอบเท่านั้น
   ฝั่งที่น้องม้วนยืน (art.side) ต้องเว้นว่าง: left = x 8–92 · right = x 248–332 (น้องม้วนวางทับด้วย HTML)
   คลาสอนิเมชันขึ้นต้น qs- (guide.css) · ห้ามใส่คลาสอนิเมชันบน <g> ที่มี transform */
(function () {
  'use strict';
  var INK = '#2b2540', C = '#ff7a59', Y = '#ffd84d';
  var ln = 'stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  var tx = function (x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 8) + '" font-weight="' + (o.w || 800) + '" fill="' + (o.f || INK) + '" font-family="IBM Plex Sans Thai,sans-serif">' + t + '</text>'; };
  // ฉากหลังประจำบ้าน: สีพื้น + วงรัศมี + พื้นห้อง + จุดตกแต่ง
  var room = function (bg, halo, floor, hx) { return '<rect width="340" height="170" fill="' + bg + '"/><circle cx="' + hx + '" cy="84" r="70" fill="' + halo + '"/>' +
    '<path d="M0 138h340v32H0z" fill="' + floor + '"/><path d="M0 138h340" ' + ln + ' opacity=".35"/>' +
    '<g fill="' + INK + '" opacity=".14"><circle cx="' + (hx - 84) + '" cy="22" r="2.4"/><circle cx="' + (hx + 92) + '" cy="30" r="1.8"/><circle cx="' + (hx + 70) + '" cy="12" r="1.4"/></g>'; };
  var shadow = function (x, w) { return '<ellipse cx="' + x + '" cy="141" rx="' + w + '" ry="4.5" fill="' + INK + '" opacity=".12"/>'; };

  var S = {
    // ทำงานนานแค่ไหนถึงได้ค่าชดเชย: บันไดปฏิทินอายุงาน 6 ขั้น เหรียญสูงขึ้นตามขั้น (น้องม้วนขวา)
    tenure: function (k) {
      var lab = ['120 วัน', '1 ปี', '3 ปี', '6 ปี', '10 ปี', '20 ปี'], d = ['30', '90', '180', '240', '300', '400'], t = '';
      for (var i = 0; i < 6; i++) {
        var x = 22 + i * 36, h = 26 + 14 * i, y = 138 - h, coins = '';
        for (var j = 0; j <= i; j++) coins += '<ellipse cx="' + (x + 18) + '" cy="' + (y - 4 - j * 3.4) + '" rx="8" ry="2.8" fill="' + Y + '" ' + ln.replace('2.2', '1.4') + '/>';
        t += '<rect x="' + x + '" y="' + y + '" width="36" height="' + h + '" fill="#fff" ' + ln + '/><rect x="' + x + '" y="' + y + '" width="36" height="6" fill="' + (i % 2 ? '#7cc0ff' : C) + '" ' + ln + '/>' +
          tx(x + 18, y + 15, lab[i], { s: 6.6 }) + (h >= 40 ? tx(x + 18, y + 28, d[i], { s: 9.5, f: C, w: 900 }) + tx(x + 18, y + 36, 'วัน', { s: 5.8, w: 700 }) : tx(x + 18, y + 23, d[i] + ' วัน', { s: 6.4, f: C, w: 900 })) +
          '<g class="qs-twk" style="animation-delay:' + (i * .25) + 's">' + coins + '</g>';
      }
      return room('#fff4e2', '#ffe2b8', '#f3d9b0', 130) + shadow(130, 112) + t +
        '<path d="M28 34q30-16 70-6" fill="none" ' + ln + ' stroke-dasharray="3 5" opacity=".5"/>' + tx(24, 24, 'ทำครบ 120 วัน เริ่มมีสิทธิ', { a: 'start', s: 7.4 });
    },
    // ให้ออกวันนี้เลย: กล่องของส่วนตัว นาฬิกาเดิน ประตูทางออก ถุงเงินแทนการบอกล่วงหน้า (น้องม้วนซ้าย)
    sameday: function (k) {
      return room('#eef3ff', '#d9e4ff', '#cfd8ee', 220) +
        '<rect x="262" y="40" width="54" height="98" rx="3" fill="#a9b8e0" ' + ln + '/><circle cx="306" cy="92" r="3" fill="' + INK + '"/><rect x="270" y="26" width="38" height="12" rx="3" fill="#2ecc71" ' + ln + '/>' + tx(289, 35, 'ทางออก', { s: 7, f: '#fff' }) +
        '<circle cx="236" cy="34" r="17" fill="#fff" ' + ln + '/>' + tx(236, 24, '12', { s: 5.4 }) + '<circle cx="236" cy="34" r="2.2" fill="' + INK + '"/><path d="M236 34v-9" ' + ln + '/><path class="qs-tick" d="M236 34v-13" stroke="' + C + '" stroke-width="2" stroke-linecap="round"/>' +
        shadow(200, 70) + '<rect x="132" y="96" width="136" height="10" rx="2" fill="#c48a55" ' + ln + '/><path d="M142 106v32M258 106v32" ' + ln + '/>' +
        '<path d="M150 96l6-34h44l6 34z" fill="#e0b27a" ' + ln + '/><path d="M150 62l-8-10h44l14 10" fill="#ecc690" ' + ln + '/>' +
        '<path d="M164 62v-14q0-8 8-8" fill="none" stroke="#3aa35b" stroke-width="2.6" stroke-linecap="round"/><path d="M172 40q8-4 10 4q-8 2-10-4z" fill="#6fbf5a" ' + ln.replace('2.2', '1.2') + '/>' +
        '<rect x="180" y="46" width="14" height="16" rx="2" fill="#fff" ' + ln + '/><path d="M194 50q6 0 6 5t-6 5" fill="none" ' + ln + '/>' +
        '<g class="qs-bob"><path d="M222 96q-12-2-10-14t14-12q12 0 14 12t-10 14z" fill="' + Y + '" ' + ln + '/><path d="M220 70l6-6 6 6" fill="none" ' + ln + '/>' + tx(226, 88, '฿', { s: 12, w: 900 }) + '</g>' +
        '<rect x="196" y="112" width="70" height="20" rx="4" fill="#fff" ' + ln.replace('2.2', '1.4') + '/>' + tx(231, 121, 'เงินแทนการ', { s: 6.4, f: C }) + tx(231, 129, 'บอกล่วงหน้า', { s: 6.4, f: C });
    },
    // ลาป่วยได้กี่วัน: เตียง ผ้าห่ม ปรอทวัดไข้ ปฏิทิน "30 วันทำงาน ได้ค่าจ้าง" (น้องม้วนขวา)
    sickbed: function (k) {
      return room('#eaf7f1', '#cfeee0', '#c4e4d4', 120) +
        '<rect x="132" y="22" width="58" height="56" rx="4" fill="#fff" ' + ln + '/><rect x="132" y="22" width="58" height="13" rx="4" fill="' + C + '" ' + ln + '/>' + tx(161, 32, 'ปีละไม่เกิน', { s: 6.4, f: '#fff' }) +
        tx(161, 58, '30', { s: 20, w: 900, f: C }) + tx(161, 70, 'วันทำงาน ได้ค่าจ้าง', { s: 5.6 }) +
        shadow(110, 100) + '<rect x="24" y="74" width="14" height="66" rx="3" fill="#7aa7d8" ' + ln + '/><rect x="180" y="96" width="12" height="44" rx="3" fill="#7aa7d8" ' + ln + '/>' +
        '<rect x="36" y="104" width="148" height="20" rx="4" fill="#f4f7ff" ' + ln + '/><path d="M60 104q50-22 124-6v26H60z" fill="#9fd6c2" ' + ln + '/><path d="M80 112l10-8M104 108l10-6M132 104l10-4" ' + ln.replace('2.2', '1.4') + ' opacity=".45"/>' +
        '<ellipse cx="54" cy="96" rx="18" ry="10" fill="#fff" ' + ln + '/>' +
        '<g transform="translate(212 92)"><rect x="-3" y="-30" width="9" height="40" rx="4.5" fill="#fff" ' + ln + '/><circle cx="1.5" cy="12" r="6" fill="#e5484d" ' + ln + '/><rect class="qs-rise" x="0" y="-22" width="3" height="30" rx="1.5" fill="#e5484d"/></g>' +
        '<g transform="translate(110 70)"><path class="qs-steam" d="M0 0q-4-6 0-12t0-12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>';
    },
    // พักร้อนสะสมไปปีหน้า: กระปุกปีนี้ → ปีหน้า ตั๋ววันหยุดหล่นลงกระปุก (น้องม้วนซ้าย)
    vacationjar: function (k) {
      var tk = function (x, y, r, c) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-8" y="-6" width="16" height="12" rx="2" fill="' + c + '" ' + ln.replace('2.2', '1.3') + '/><circle cx="0" cy="0" r="2.6" fill="' + Y + '"/></g>'; };
      return room('#fff6e0', '#ffe7a8', '#f0dca8', 226) + shadow(232, 92) +
        '<rect x="128" y="94" width="50" height="44" rx="10" fill="#e9f6ff" ' + ln + '/><rect x="134" y="86" width="38" height="10" rx="3" fill="#c48a55" ' + ln + '/>' + tk(144, 126, -10, '#7cc0ff') + tk(160, 128, 12, C) + tx(153, 152, 'ปีนี้', { s: 8 }) +
        '<path d="M186 112h26" ' + ln + '/><path d="M206 106l7 6-7 6" fill="none" ' + ln + '/>' + tx(199, 104, 'ตกลงกันก่อน', { s: 5.8, f: C }) +
        '<rect x="224" y="62" width="82" height="76" rx="16" fill="#e9f6ff" ' + ln + '/><rect x="234" y="50" width="62" height="14" rx="4" fill="#c48a55" ' + ln + '/>' +
        tk(244, 124, -12, '#7cc0ff') + tk(264, 126, 8, C) + tk(286, 122, -4, '#7cd3a4') + tk(254, 108, 16, '#b79cf0') + tk(276, 106, -14, '#7cc0ff') + tk(292, 96, 10, C) +
        '<g transform="translate(265 20)"><g class="qs-drop">' + tk(0, 0, 0, '#7cd3a4') + '</g></g>' + tx(265, 152, 'ปีหน้า', { s: 8 }) +
        '<path d="M318 40q-8-14-22-14q8 6 6 14z" fill="' + C + '" ' + ln.replace('2.2', '1.4') + '/><path d="M310 38l-6 30" ' + ln.replace('2.2', '1.4') + '/>';
    },
    // บังคับทำ OT ได้ไหม: คลิปบอร์ด "ทำ OT วันนี้?" ช่องยินยอม/ไม่ยินยอม ปากกาลอย พระอาทิตย์ตก (น้องม้วนขวา)
    otconsent: function (k) {
      return room('#fff0e8', '#ffd2bd', '#f0cdb8', 124) +
        '<rect x="20" y="26" width="64" height="46" rx="3" fill="#ffb37a" ' + ln + '/><circle cx="52" cy="58" r="10" fill="#ff7a59"/><path d="M20 66h64" ' + ln + '/><path d="M52 26v46" ' + ln + '/>' +
        shadow(126, 64) + '<rect x="78" y="36" width="96" height="104" rx="6" fill="#c48a55" ' + ln + '/><rect x="86" y="46" width="80" height="88" rx="2" fill="#fff" ' + ln + '/><rect x="108" y="30" width="36" height="12" rx="3" fill="#9aa4b8" ' + ln + '/>' +
        tx(126, 62, 'ทำ OT วันนี้ไหม?', { s: 8 }) + '<path d="M94 70h64" ' + ln.replace('2.2', '1') + ' opacity=".4"/>' +
        '<rect x="96" y="80" width="11" height="11" rx="2" fill="#fff" ' + ln + '/>' + tx(112, 89, 'ยินยอม', { a: 'start', s: 7.4 }) +
        '<rect x="96" y="100" width="11" height="11" rx="2" fill="#fff" ' + ln + '/>' + tx(112, 109, 'ไม่ยินยอม', { a: 'start', s: 7.4 }) +
        tx(126, 126, 'ลูกจ้างเลือกเองทุกครั้ง', { s: 6, f: C }) +
        '<g transform="translate(196 74)"><g class="qs-bob"><path d="M-4 0l8 0 0 36-4 8-4-8z" fill="' + Y + '" ' + ln + '/><path d="M-4 30h8" ' + ln + '/></g></g>' +
        '<rect x="194" y="26" width="46" height="22" rx="5" fill="#2b2540"/>' + tx(217, 41, '18:00', { s: 10, w: 900, f: Y });
    },
    // ค่า OT คิดยังไง: ตาชั่งโยก ฝั่งหนึ่งนาฬิกา 1 ชม. อีกฝั่งเหรียญ ×1.5 ตึกยามเย็น (น้องม้วนซ้าย)
    otrate: function (k) {
      return room('#efeaff', '#ddd2ff', '#d4cbef', 222) +
        '<g fill="#b8acec" opacity=".7"><rect x="268" y="56" width="20" height="82"/><rect x="292" y="40" width="26" height="98"/><rect x="322" y="70" width="18" height="68"/></g><g fill="' + Y + '"><rect x="296" y="50" width="5" height="5"/><rect x="306" y="62" width="5" height="5"/><rect x="272" y="66" width="4" height="4"/></g>' +
        shadow(212, 56) + '<path d="M212 136V56" ' + ln + '/><path d="M196 138h32" ' + ln + '/><circle cx="212" cy="52" r="4" fill="' + C + '" ' + ln + '/>' +
        '<g class="qs-rock"><path d="M156 58h112" ' + ln + '/><path d="M162 58l-14 38M162 58l14 38M262 58l-14 38M262 58l14 38" ' + ln.replace('2.2', '1.4') + '/>' +
        '<path d="M142 96h40q-4 14-20 14t-20-14z" fill="#fff" ' + ln + '/><path d="M242 96h40q-4 14-20 14t-20-14z" fill="#fff" ' + ln + '/>' +
        '<circle cx="162" cy="84" r="11" fill="#fff" ' + ln + '/><path d="M162 84v-6M162 84l4 2" ' + ln + '/>' +
        '<ellipse cx="262" cy="92" rx="10" ry="3.4" fill="' + Y + '" ' + ln.replace('2.2', '1.4') + '/><ellipse cx="262" cy="87" rx="10" ry="3.4" fill="' + Y + '" ' + ln.replace('2.2', '1.4') + '/><ellipse cx="262" cy="82" rx="7" ry="2.6" fill="' + Y + '" ' + ln.replace('2.2', '1.4') + '/></g>' +
        tx(162, 128, '1 ชั่วโมง', { s: 8 }) + tx(262, 128, '≥ 1.5 เท่า', { s: 9, w: 900, f: C }) + tx(212, 156, 'ของค่าจ้างต่อชั่วโมงในวันทำงาน', { s: 6.6 });
    },
    // ลาคลอดได้กี่วัน: เปลเด็ก โมบายดาวแกว่ง ปฏิทิน 120 วัน (น้องม้วนขวา)
    maternity: function (k) {
      var star = function (x, y) { return '<path transform="translate(' + x + ' ' + y + ')" d="M0-6l1.8 4 4.4.6-3.2 3 .8 4.4L0 3.8-3.8 6l.8-4.4-3.2-3 4.4-.6z" fill="' + Y + '" ' + ln.replace('2.2', '1.2') + '/>'; };
      return room('#f6eefc', '#e9d9fa', '#e2d3f2', 120) +
        '<rect x="170" y="24" width="56" height="58" rx="4" fill="#fff" ' + ln + '/><rect x="170" y="24" width="56" height="13" rx="4" fill="#b79cf0" ' + ln + '/>' + tx(198, 34, 'ลาคลอด', { s: 6.8, f: '#fff' }) +
        tx(198, 64, '120', { s: 19, w: 900, f: '#8a5ad6' }) + tx(198, 76, 'วันต่อครรภ์', { s: 6 }) +
        '<path d="M100 12v24" ' + ln + '/><g transform="translate(100 36)"><g class="qs-swing"><path d="M-26 0h52" ' + ln + '/><path d="M-22 0v10M0 0v16M22 0v8" ' + ln.replace('2.2', '1.2') + '/>' + star(-22, 16) + star(0, 22) + star(22, 14) + '</g></g>' +
        shadow(100, 72) + '<rect x="40" y="82" width="120" height="44" rx="10" fill="#fff" ' + ln + '/>' +
        '<g ' + ln.replace('2.2', '1.6') + '>' + [52, 64, 76, 88, 100, 112, 124, 136, 148].map(function (x) { return '<path d="M' + x + ' 86v36"/>'; }).join('') + '</g>' +
        '<path d="M44 106q56-14 112 0v16H44z" fill="#ffc6d6" ' + ln + '/><circle cx="76" cy="100" r="9" fill="#ffe0c2" ' + ln + '/><path d="M72 100q4 3 8 0" fill="none" ' + ln.replace('2.2', '1.4') + '/>' +
        '<path d="M46 126v12M154 126v12" ' + ln + '/>';
    },
    // หักค่าปรับจากงวดสุดท้าย: สลิปเงินเดือนยาว แถว "ค่าปรับ" กรรไกรจ่อ วงห้าม (น้องม้วนซ้าย)
    finalfine: function (k) {
      return room('#fdf3e7', '#ffe4c8', '#f1dcc0', 226) + shadow(222, 70) +
        '<path d="M168 20h104v118l-8-5-8 5-8-5-8 5-8-5-8 5-8-5-8 5-8-5-8 5-8-5-8 5z" fill="#fff" ' + ln + '/>' +
        tx(220, 34, 'สลิปเงินเดือน', { s: 8 }) + tx(220, 44, 'งวดสุดท้าย', { s: 6.4, f: '#8a7a6a' }) +
        '<g ' + ln.replace('2.2', '1') + ' opacity=".45"><path d="M178 54h84M178 70h84M178 86h84"/></g>' +
        tx(180, 64, 'ค่าจ้าง', { a: 'start', s: 6.6 }) + tx(260, 64, '✓', { a: 'end', s: 8, f: '#2e9e5b' }) +
        tx(180, 80, 'OT ค้างจ่าย', { a: 'start', s: 6.6 }) + tx(260, 80, '✓', { a: 'end', s: 8, f: '#2e9e5b' }) +
        '<rect x="176" y="92" width="88" height="16" rx="3" fill="#ffe1d8"/><path d="M172 112h96" stroke="' + C + '" stroke-width="2" stroke-dasharray="4 3"/>' + tx(180, 103, 'ค่าปรับ', { a: 'start', s: 6.8, f: C }) + tx(260, 103, '−???', { a: 'end', s: 6.8, f: C }) +
        '<g transform="translate(296 108)"><g class="qs-snip"><circle cx="0" cy="-10" r="6" fill="none" ' + ln + '/><circle cx="0" cy="10" r="6" fill="none" ' + ln + '/><path d="M5-7l-26 10M5 7l-26-10" ' + ln + '/></g></g>' +
        '<g transform="translate(150 124)"><circle r="14" fill="#fff" stroke="#e5484d" stroke-width="3"/><path d="M-10 10l20-20" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/></g>' + tx(150, 152, 'หักเองไม่ได้', { s: 7, f: '#e5484d' });
    },
    // หัวหน้าทักไลน์สี่ทุ่ม: ห้องนอนกลางคืน หน้าต่างพระจันทร์ เตียง โคมไฟ มือถือสั่น (น้องม้วนขวา)
    latechat: function (k) {
      return '<rect width="340" height="170" fill="#2b2f5e"/><circle cx="128" cy="84" r="70" fill="#353a72"/><path d="M0 138h340v32H0z" fill="#3a3f78"/>' +
        '<rect x="22" y="18" width="70" height="54" rx="4" fill="#1d2048" ' + ln.replace(INK, '#11132e') + '/><path d="M57 18v54M22 45h70" stroke="#11132e" stroke-width="2.2"/><circle cx="74" cy="32" r="9" fill="#ffe7a8"/><circle cx="79" cy="28" r="8" fill="#1d2048"/>' +
        '<g fill="#fff"><circle cx="34" cy="58" r="1.3"/><circle cx="44" cy="28" r="1"/><circle cx="112" cy="20" r="1.4"/><circle cx="210" cy="34" r="1.1"/><circle cx="236" cy="16" r="1.3"/></g>' +
        '<ellipse cx="166" cy="141" rx="80" ry="4.5" fill="#000" opacity=".25"/><rect x="100" y="96" width="140" height="40" rx="5" fill="#6c70bf" ' + ln.replace(INK, '#11132e') + '/><rect x="96" y="80" width="12" height="58" rx="3" fill="#8a8ed8" ' + ln.replace(INK, '#11132e') + '/>' +
        '<ellipse cx="126" cy="92" rx="16" ry="8" fill="#e9e6ff" ' + ln.replace(INK, '#11132e') + '/><path d="M140 96q50-16 100 0v18H140z" fill="#a9acf0" ' + ln.replace(INK, '#11132e') + '/>' +
        '<g transform="translate(176 76)"><g class="qs-zz">' + tx(0, 0, 'z', { s: 12, f: '#c8cbf5' }) + tx(9, -9, 'z', { s: 9, f: '#c8cbf5' }) + '</g></g>' +
        '<rect x="22" y="110" width="66" height="28" rx="3" fill="#8a5a3a" ' + ln.replace(INK, '#11132e') + '/><path d="M28 110l5-22h16l5 22z" fill="#ffd27a" ' + ln.replace(INK, '#11132e') + '/><path d="M41 88V78" stroke="#11132e" stroke-width="2"/>' +
        '<g transform="translate(72 110)"><g class="qs-buzz"><rect x="-10" y="-28" width="20" height="28" rx="4" fill="#111" ' + ln.replace(INK, '#11132e') + '/><rect x="-8" y="-25" width="16" height="20" rx="2" fill="#2ecc71"/>' + tx(0, -17, 'หัวหน้า', { s: 4.6, f: '#fff' }) + tx(0, -9, '22:07', { s: 4.8, f: '#fff' }) + '</g></g>' +
        '<g stroke="' + Y + '" stroke-width="2" stroke-linecap="round"><path d="M86 82l6-4M88 92h7M70 72l-2-7"/></g>' +
        '<rect x="150" y="146" width="92" height="18" rx="9" fill="#e24b4a"/>' + tx(196, 158, 'เลิกงานแล้ว ไม่ตอบได้', { s: 7, f: '#fff' });
    },
    // โน้ตบุ๊กพังที่บ้าน: จอร้าวกะพริบ กาแฟหก สลิปพร้อมเงื่อนไข "ต้องยินยอม" (น้องม้วนซ้าย)
    brokenlaptop: function (k) {
      return room('#eef6ff', '#d6e9ff', '#cddbea', 216) + shadow(214, 96) +
        '<rect x="120" y="104" width="196" height="10" rx="2" fill="#c48a55" ' + ln + '/><path d="M132 114v24M304 114v24" ' + ln + '/>' +
        '<path d="M150 104l8-56h88l8 56z" fill="#3f4a6b" ' + ln + '/><path d="M158 98l6-44h76l6 44z" fill="#a8e0f0"/>' +
        '<path class="qs-flick" d="M200 56l-8 16 12 6-10 18M200 72l18-6 6 14" fill="none" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M140 104h124l-6 6H146z" fill="#cfd6e6" ' + ln + '/>' +
        '<path d="M272 102q10-6 22 0q6 4-2 6h-26q-4-2 6-6z" fill="#8a5a3a" opacity=".8"/><path d="M278 86h14l-2 16h-10z" fill="#fff" ' + ln + '/>' +
        '<rect x="240" y="14" width="90" height="56" rx="5" fill="#fff" ' + ln + '/>' + tx(285, 28, 'หักค่าเสียหายได้เมื่อ', { s: 6.8 }) + tx(285, 42, 'จงใจ/ประมาทร้ายแรง', { s: 6.4, f: '#6a5a4a' }) + tx(285, 58, '+ ลูกจ้างยินยอม', { s: 7.2, f: C }) +
        '<g transform="translate(128 52)"><path d="M-6 52l2-12h12l2 12z" fill="#e4744a" ' + ln.replace('2.2', '1.4') + '/><path d="M2 40q-10-14-2-24q4 10 2 24zM2 40q4-16 14-18q-4 12-14 18z" fill="#6fbf5a" ' + ln.replace('2.2', '1.4') + '/></g>';
    }
  };

  function svg(name, key, alt) {
    var f = S[name]; if (!f) return '';
    var k = String(key || '0').replace(/[^a-z0-9]/gi, '');
    return '<svg class="qa-spot" viewBox="0 0 340 170" preserveAspectRatio="xMidYMid slice" role="img"' + (alt ? ' aria-label="' + String(alt).replace(/[&<>"]/g, '') + '"' : ' aria-hidden="true"') + '>' + f(k) + '</svg>';
  }
  window.VCSpots = { svg: svg, names: Object.keys(S) };
})();
