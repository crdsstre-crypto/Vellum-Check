/* ===== มาสคอต "เวลลัม" (น้องม้วน) — กระดาษสัญญาม้วนน้อยถือปากกาไฮไลต์ (วาดเอง ไม่ใช้ภาพจากที่อื่น) =====
   VCMascot.svg(mood, size) คืนสตริง SVG · mood: wave | happy | sleep | party | sad | curious | stop | alert | inspect
   ท่าขยับอยู่ใน mascot.css (คลาส vm-<mood>)
   ท่าผสม: VCMascot.svg('point+smile+phone+bob') · VCMascot.pick(mood, seed, prev) เลือกท่าผสมไม่ให้ซ้ำช่องก่อนหน้า */
(function () {
  'use strict';
  var INK = '#3a2a12', PAPER = '#f7efdc', ROLL = '#eadcb8', ROLL_END = '#d6c193', BLUSH = '#f4a7a0', HL = '#ffd84d';

  function roll(y) {
    return '<rect x="22" y="' + y + '" width="76" height="14" rx="7" fill="' + ROLL + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<ellipse cx="24" cy="' + (y + 7) + '" rx="4.5" ry="7" fill="' + ROLL_END + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<ellipse cx="96" cy="' + (y + 7) + '" rx="4.5" ry="7" fill="' + ROLL_END + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M30 ' + (y + 4) + 'h52" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>';
  }
  // ปากกาไฮไลต์ (หมุนตามมือ)
  function pen(x, y, rot) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' +
      '<rect x="-4" y="-17" width="8" height="22" rx="2.5" fill="' + HL + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="-4" y="-17" width="8" height="6" rx="2" fill="#f2b81c" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M-3 5h6l-1.5 5h-3z" fill="#f2b81c" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/></g>';
  }
  function coin(x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="#f4c542" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle r="' + (r * .62) + '" fill="none" stroke="#fff3c4" stroke-width="1.6" opacity=".8"/>' +
      '<path d="M-1.6 ' + (-r * .4) + 'v' + (r * .8) + 'M1.6 ' + (-r * .4) + 'v' + (r * .8) + '" stroke="#8a5a08" stroke-width="1.8" stroke-linecap="round"/></g>';
  }
  function sparkle(x, y, s, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-6l1.6 4.4L6 0l-4.4 1.6L0 6l-1.6-4.4L-6 0l4.4-1.6z" fill="' + (c || '#ffe28a') + '"/>';
  }

  // ใบหน้าตามอารมณ์
  var FACE = {
    wave: '<ellipse cx="50" cy="58" rx="4" ry="5" fill="' + INK + '"/><ellipse cx="70" cy="58" rx="4" ry="5" fill="' + INK + '"/>' +
      '<circle cx="51.4" cy="56.2" r="1.5" fill="#fff"/><circle cx="71.4" cy="56.2" r="1.5" fill="#fff"/>' +
      '<path d="M53 66q7 7 14 0" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M45 49q5-4 10-1M65 48q5-3 10 1" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/>',
    happy: '<path d="M45 59q5-6 10 0M65 59q5-6 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M51 65q9 10 18 0z" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M55 69.5q5 2.6 10 0" stroke="#f4a7a0" stroke-width="2" stroke-linecap="round" fill="none"/>',
    sleep: '<path d="M45 59q5 3.5 10 0M65 59q5 3.5 10 0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="60" cy="68" rx="2.6" ry="3" fill="' + INK + '" opacity=".85"/>',
    party: sparkle(50, 58, .95, INK) + sparkle(70, 58, .95, INK) +
      '<path d="M50 65q10 13 20 0z" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>',
    sad: '<ellipse cx="50" cy="59" rx="3.6" ry="4.4" fill="' + INK + '"/><ellipse cx="70" cy="59" rx="3.6" ry="4.4" fill="' + INK + '"/>' +
      '<circle cx="51.2" cy="57.6" r="1.3" fill="#fff"/><circle cx="71.2" cy="57.6" r="1.3" fill="#fff"/>' +
      '<path d="M45 51q5 1 9-3M75 51q-5 1-9-3" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M54 69q6-4 12 0" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M76 62q2.4 4 0 6q-2.4-2 0-6z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.4"/>',
    // สงสัย: ตามองขึ้นขวา คิ้วซ้ายยก ปากเบี้ยว
    curious: '<ellipse cx="51" cy="58" rx="4" ry="5" fill="' + INK + '"/><ellipse cx="71" cy="58" rx="4" ry="5" fill="' + INK + '"/>' +
      '<circle cx="53" cy="55.6" r="1.6" fill="#fff"/><circle cx="73" cy="55.6" r="1.6" fill="#fff"/>' +
      '<path d="M44 46q5-5 11-2" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M66 50q5-1.5 9 1" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M55 69q4-3 9-1" stroke="' + INK + '" stroke-width="2.3" stroke-linecap="round" fill="none"/>',
    // ห้าม!: คิ้วขมวด ปากตรง จริงจัง
    stop: '<ellipse cx="50" cy="59" rx="4" ry="4.6" fill="' + INK + '"/><ellipse cx="70" cy="59" rx="4" ry="4.6" fill="' + INK + '"/>' +
      '<circle cx="51.3" cy="57.4" r="1.4" fill="#fff"/><circle cx="71.3" cy="57.4" r="1.4" fill="#fff"/>' +
      '<path d="M44 49l10 3M76 49l-10 3" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M54 69h12" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>',
    // ตกใจ: ตาโต ปากกลม เหงื่อตก
    alert: '<circle cx="50" cy="58" r="5.6" fill="#fff" stroke="' + INK + '" stroke-width="2"/><circle cx="70" cy="58" r="5.6" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="50" cy="58.5" r="2.4" fill="' + INK + '"/><circle cx="70" cy="58.5" r="2.4" fill="' + INK + '"/>' +
      '<path d="M44 47q5-4 10-2M66 45q5-2 10 2" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="60" cy="70" rx="3.6" ry="4.4" fill="#c2453b" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M80 44q3 5 0 8q-3-3 0-8z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.4"/>',
    // ส่องแว่นขยาย: ตาซ้ายหรี่ ตาขวาโตผ่านเลนส์
    inspect: '<path d="M45 58q5-2 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="72" cy="58" rx="5" ry="6" fill="' + INK + '"/><circle cx="73.8" cy="55.6" r="2" fill="#fff"/>' +
      '<path d="M44 50q5-2 10 0M66 46q6-3 12 1" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M53 69q4 2 9-1" stroke="' + INK + '" stroke-width="2.3" stroke-linecap="round" fill="none"/>'
  };

  // แขน/ของในมือ/ของประกอบ (ด้านหลังตัว = back, ด้านหน้า = front)
  function pose(m) {
    var lArm = '', rArm = '', front = '', back = '';
    var arm = function (d) { return '<path d="' + d + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>'; };
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>'; };
    if (m === 'wave') {
      lArm = arm('M31 76q-10 4-12 12') + pen(19, 90, -20) + hand(19, 90);
      rArm = '<g class="vm-arm-r">' + arm('M89 72q10-6 12-18') + hand(101, 53) + '</g>';
    } else if (m === 'happy') {
      lArm = arm('M31 76q-10 4-12 12') + pen(19, 90, -20) + hand(19, 90);
      rArm = arm('M89 72q11-8 12-22') + hand(101, 50) + '<g class="vm-coin">' + coin(103, 36, 9) + '</g>';
      back = sparkle(88, 28, .9) + sparkle(112, 52, .7);
    } else if (m === 'sleep') {
      lArm = arm('M31 78q-6 8-4 14') + pen(29, 96, 70) + hand(28, 93);
      rArm = arm('M89 78q6 8 4 14') + hand(93, 93);
      back = '<g class="vm-z" fill="none" stroke="#c9c2ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path class="z1" d="M84 30h8l-8 9h8"/><path class="z2" d="M97 18h6l-6 7h6"/><path class="z3" d="M106 8h4.5l-4.5 5h4.5"/></g>';
    } else if (m === 'party') {
      lArm = arm('M31 72q-10-6-12-20') + hand(19, 51) + pen(19, 41, -10);
      rArm = arm('M89 72q10-6 12-20') + hand(101, 51);
      back = '<g class="vm-conf">' + sparkle(12, 30, 1, '#ffe28a') + sparkle(108, 26, 1.1, '#5fd3a6') + sparkle(98, 8, .7, '#ff9a4d') +
        '<rect x="20" y="10" width="5" height="3" rx="1" fill="#ff7aa8" transform="rotate(25 22 11)"/><rect x="104" y="40" width="5" height="3" rx="1" fill="#7ab8ff" transform="rotate(-20 106 41)"/>' +
        '<rect x="6" y="56" width="5" height="3" rx="1" fill="#5fd3a6" transform="rotate(40 8 57)"/></g>';
    } else if (m === 'curious') {
      // มือขวาเท้าคาง มือซ้ายถือปากกา มีเครื่องหมายคำถามลอยอยู่
      lArm = arm('M31 78q-9 5-10 13') + pen(21, 94, -15) + hand(21, 92);
      rArm = arm('M89 86q5-7-4-10q-7-2-12 2') + hand(72, 79);
      back = '<g class="vm-q" fill="none" stroke="#f08a24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<g class="q1"><path d="M96 22q0-7 7-7q7 0 7 6q0 4-5 6q-2 1-2 5"/><circle cx="103" cy="37" r="1.3" fill="#f08a24"/></g>' +
        '<g class="q2"><path d="M6 4q0-5 5-5q5 0 5 4.5q0 3-3.5 4.5q-1.5.7-1.5 3.5"/><circle cx="11" cy="15" r="1" fill="#f08a24"/></g></g>';
    } else if (m === 'stop') {
      // มือขวายกตั้งฝ่ามือ "หยุด!" มือซ้ายถือปากกา
      lArm = arm('M31 76q-10 4-12 12') + pen(19, 90, -20) + hand(19, 90);
      rArm = '<g class="vm-push">' + arm('M89 74q12-2 16-14') +
        '<g transform="translate(108 52)"><rect x="-7" y="-10" width="14" height="17" rx="6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="M-3-6v6M0-7v7M3-6v6" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></g></g>';
      back = '<g class="vm-burst" stroke="#ff5d5d" stroke-width="2.6" stroke-linecap="round"><path d="M116 34l4-6M122 44l7-2M104 32l-1-7"/></g>';
    } else if (m === 'alert') {
      // ตกใจ ยกสองมือข้างหน้า มี ! สีแดงเด้งบนหัว
      lArm = arm('M31 76q-12-2-14-14') + hand(17, 60);
      rArm = arm('M89 76q12-2 14-14') + hand(103, 60);
      back = '<g class="vm-bang"><rect x="56" y="-8" width="8" height="18" rx="4" fill="#ff5d5d" stroke="' + INK + '" stroke-width="2"/><circle cx="60" cy="15" r="3.6" fill="#ff5d5d" stroke="' + INK + '" stroke-width="2"/></g>';
    } else if (m === 'inspect') {
      // ถือแว่นขยายส่องตรงหน้า
      lArm = arm('M31 78q-9 5-10 13') + pen(21, 94, -15) + hand(21, 92);
      rArm = '<g class="vm-mag">' + arm('M89 80q10 0 14-8') +
        '<path d="M103 72l9-12" stroke="#8a5a08" stroke-width="5" stroke-linecap="round"/>' + hand(103, 72) +
        '<circle cx="116" cy="52" r="11" fill="#cfefff" fill-opacity=".55" stroke="' + INK + '" stroke-width="3"/>' +
        '<path d="M110 47q3-4 7-3" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/></g>';
    } else { // sad
      lArm = arm('M31 78q-8 6-9 14') + pen(22, 96, -8) + hand(22, 93);
      // ถือหัวใจดวงเล็กไว้ข้างตัว = ยังให้กำลังใจ
      rArm = arm('M89 80q4 5 5 9') + '<g class="vm-heart" transform="translate(104 96) scale(1.5)">' +
        '<path d="M0 6c-5-3.4-7.6-6-7.6-9a3.7 3.7 0 0 1 7.6-1a3.7 3.7 0 0 1 7.6 1c0 3-2.6 5.6-7.6 9z" fill="#ff7a8a" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M-4.6-4.2q1.2-1.4 2.8-.8" stroke="#fff" stroke-width="1.1" stroke-linecap="round" fill="none" opacity=".85"/></g>' + hand(95, 92);
    }
    return { back: back, arms: lArm + rArm, front: front };
  }

  function svg(mood, size) {
    var m = FACE[mood] ? mood : 'wave', p = pose(m), s = size || 120;
    return '<svg class="vm vm-' + m + '" viewBox="0 0 120 140" width="' + s + '" height="' + Math.round(s * 140 / 120) + '" role="img" aria-label="เวลลัม มาสคอตของ Vellum Check">' +
      '<ellipse cx="60" cy="134" rx="30" ry="4" fill="#000" opacity=".28"/>' +
      p.back +
      '<g class="vm-body">' +
        // เท้า
        '<ellipse cx="48" cy="126" rx="7" ry="4.5" fill="' + INK + '"/><ellipse cx="72" cy="126" rx="7" ry="4.5" fill="' + INK + '"/>' +
        // ตัวกระดาษ
        '<path d="M30 30h60v80H30z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M34 34h6v72h-6z" fill="#fff" opacity=".35"/>' +
        // บรรทัดข้อความบนกระดาษ + ไฮไลต์หนึ่งบรรทัด (ลายเซ็นของแบรนด์)
        '<rect x="40" y="81" width="30" height="6" rx="2" fill="' + HL + '" opacity=".75"/>' +
        '<path d="M42 84h26M42 92h36M42 99h20" stroke="#bfae86" stroke-width="2" stroke-linecap="round"/>' +
        roll(20) + roll(104) +
        // แก้ม + หน้า
        '<ellipse cx="42" cy="66" rx="5" ry="3.2" fill="' + BLUSH + '" opacity=".75"/><ellipse cx="78" cy="66" rx="5" ry="3.2" fill="' + BLUSH + '" opacity=".75"/>' +
        '<g class="vm-face">' + FACE[m] + '</g>' +
        p.arms + p.front +
      '</g></svg>';
  }


  /* ===== ท่าผสม (combo): "แขน+หน้า+ของถือ+การขยับ" เช่น "point+smile+phone+bob" (ลำดับไม่สำคัญ ขาดอันไหนใช้ค่าเริ่มต้น) =====
     แขน: wave point up thumb cross scratch chin cheer cover palm open bow
     หน้า: smile laugh star wink hmm think shock sad cry firm relief sleepy
     ของถือ: pen mag coin phone sign umbrella shield cal money clip cup none
     ขยับ: sway bob hop shake spin peek lean breathe
     ชื่อท่าเดิม 9 ชื่อ (ไม่มี +) ยังวาดแบบเดิมทุกอย่าง */
  var EX = {
    wink: '<path d="M45 59q5-5 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/><ellipse cx="70" cy="58" rx="4" ry="5" fill="' + INK + '"/><circle cx="71.4" cy="56.2" r="1.5" fill="#fff"/>' +
      '<path d="M65 48q5-3 10 1" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M52 66q8 7 16-1" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>',
    think: '<ellipse cx="48" cy="57" rx="3.6" ry="4.6" fill="' + INK + '"/><ellipse cx="68" cy="57" rx="3.6" ry="4.6" fill="' + INK + '"/><circle cx="47" cy="54.8" r="1.4" fill="#fff"/><circle cx="67" cy="54.8" r="1.4" fill="#fff"/>' +
      '<path d="M43 49q5-3 10-1M64 47q5-2 10 1" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M54 69h9" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>',
    cry: '<path d="M45 57q5 4 10 0M65 57q5 4 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M45 49q5 2 9-2M75 49q-5 2-9-2" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M53 70q3.5-4 7 0t7 0" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<g class="vmx-tear"><path d="M48 61q-2 6 0 9q2-3 0-9z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.2"/><path d="M72 61q-2 6 0 9q2-3 0-9z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.2"/></g>',
    relief: '<path d="M45 58q5 4 10 0M65 58q5 4 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M54 67q6 4 12 0" stroke="' + INK + '" stroke-width="2.3" stroke-linecap="round" fill="none"/><path d="M79 46q3 5 0 8q-3-3 0-8z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.4"/>'
  };
  var FMAP = { smile: 'wave', laugh: 'happy', star: 'party', hmm: 'curious', shock: 'alert', sad: 'sad', firm: 'stop', sleepy: 'sleep' };
  var ARMS = ['wave', 'point', 'up', 'thumb', 'cross', 'scratch', 'chin', 'cheer', 'cover', 'palm', 'open', 'bow'];
  var FACES = ['smile', 'laugh', 'star', 'wink', 'hmm', 'think', 'shock', 'sad', 'cry', 'firm', 'relief', 'sleepy'];
  var PROPS = ['pen', 'mag', 'coin', 'phone', 'sign', 'umbrella', 'shield', 'cal', 'money', 'clip', 'cup', 'none'];
  var MOVES = ['sway', 'bob', 'hop', 'shake', 'spin', 'peek', 'lean', 'breathe'];

  function faceSvg(f) { return FMAP[f] ? FACE[FMAP[f]] : (EX[f] || FACE.wave); }
  // ของตกแต่งรอบตัวตามสีหน้า
  function faceBack(f) {
    if (f === 'hmm' || f === 'think') return '<g class="vmx-q" fill="none" stroke="#f08a24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M100 18q0-7 7-7q7 0 7 6q0 4-5 6q-2 1-2 5"/><circle cx="107" cy="33" r="1.3" fill="#f08a24"/></g>';
    if (f === 'star' || f === 'laugh') return '<g class="vmx-tw">' + sparkle(12, 26, .9, '#ffe28a') + sparkle(110, 20, 1, '#5fd3a6') + sparkle(102, 4, .6, '#ff9a4d') + '</g>';
    if (f === 'shock') return '<g class="vmx-bang"><rect x="56" y="-8" width="8" height="18" rx="4" fill="#ff5d5d" stroke="' + INK + '" stroke-width="2"/><circle cx="60" cy="15" r="3.6" fill="#ff5d5d" stroke="' + INK + '" stroke-width="2"/></g>';
    if (f === 'sleepy') return '<g class="vmx-z" fill="none" stroke="#c9c2ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M84 30h8l-8 9h8"/><path d="M97 18h6l-6 7h6"/></g>';
    if (f === 'relief') return '<g class="vmx-puff" fill="#fff" stroke="#c9d6e6" stroke-width="1.4"><circle cx="96" cy="62" r="4"/><circle cx="103" cy="58" r="3"/><circle cx="108" cy="53" r="2"/></g>';
    if (f === 'firm') return '<g class="vmx-tw" stroke="#ff5d5d" stroke-width="2.6" stroke-linecap="round"><path d="M14 30l-5-5M10 42l-7 0M20 24l0-7"/></g>';
    return '';
  }
  // ของถือ วาดให้ "มือ" อยู่ที่ (x, y)
  function propSvg(p, x, y) {
    var g = function (s) { return '<g transform="translate(' + x + ' ' + y + ')">' + s + '</g>'; }, W = 'stroke="' + INK + '" stroke-width="2"';
    switch (p) {
      case 'pen': return pen(x, y, -20);
      case 'mag': return g('<g class="vmx-mag"><path d="M0 0l8-12" stroke="#8a5a08" stroke-width="5" stroke-linecap="round"/><circle cx="13" cy="-20" r="10" fill="#cfefff" fill-opacity=".55" stroke="' + INK + '" stroke-width="3"/><path d="M8-24q3-4 7-3" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/></g>');
      case 'coin': return g('<g class="vmx-coin">' + coin(0, -14, 8) + '</g>');
      case 'phone': return g('<rect x="-7" y="-24" width="14" height="24" rx="3" fill="#2b3566" ' + W + '/><rect x="-4.5" y="-20" width="9" height="14" rx="1" fill="#9fe0ff"/><circle cy="-3" r="1.2" fill="#fff"/><g class="vmx-ring" fill="none" stroke="#38c172" stroke-width="1.8" stroke-linecap="round"><path d="M10-22q4 4 0 8M14-25q7 7 0 14"/></g>');
      case 'sign': return g('<path d="M0 2v-24" stroke="#8a5a08" stroke-width="3" stroke-linecap="round"/><rect x="-17" y="-44" width="34" height="22" rx="3" fill="#fff" ' + W + '/><path d="M-11-36h22M-11-30h14" stroke="#ffb347" stroke-width="2.4" stroke-linecap="round"/>');
      case 'umbrella': return g('<path d="M0 2v-30" stroke="' + INK + '" stroke-width="2.4"/><path d="M0 2q0 5 4 5" fill="none" stroke="' + INK + '" stroke-width="2.4"/><path d="M-18-28a18 14 0 0 1 36 0q-4-3-9 0q-4-3-9 0q-4-3-9 0q-5-3-9 0z" fill="#5ab8ff" ' + W + '/><path d="M0-42v-3" stroke="' + INK + '" stroke-width="2"/>');
      case 'shield': return g('<path d="M0-24l12 4v9q0 12-12 18q-12-6-12-18v-9z" fill="#7cc58a" ' + W + '/><path d="M-5-8l4 4 7-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>');
      case 'cal': return g('<rect x="-10" y="-24" width="20" height="20" rx="3" fill="#fff" ' + W + '/><path d="M-10-24h20v6h-20z" fill="#e0453a" ' + W + '/><text y="-8" text-anchor="middle" font-size="9" font-weight="900" fill="' + INK + '" font-family="sans-serif">30</text>');
      case 'money': return g('<rect x="-12" y="-18" width="24" height="15" rx="2" fill="#fff" ' + W + '/><path d="M-12-18l12 8 12-8" fill="none" ' + W + '/><circle cy="-7" r="3.4" fill="#f4c542" stroke="' + INK + '" stroke-width="1.2"/>');
      case 'clip': return g('<rect x="-10" y="-26" width="20" height="26" rx="2" fill="#c48d55" ' + W + '/><rect x="-7" y="-22" width="14" height="19" fill="#fff"/><rect x="-4" y="-29" width="8" height="5" rx="1.5" fill="#c4cbd6" stroke="' + INK + '" stroke-width="1.4"/><path d="M-5-17h10M-5-12h8M-5-7h10" stroke="#9aa6ba" stroke-width="1.4"/>');
      case 'cup': return g('<path d="M-6-16h12l-1.5 14h-9z" fill="#fff6e6" ' + W + '/><path d="M6-13q5 0 5 3.5t-5 3.5" fill="none" ' + W + '/><g class="vmx-steam" fill="none" stroke="#c9c2b6" stroke-width="1.4" stroke-linecap="round"><path d="M-2-19q-2-3 0-6t0-6"/><path d="M3-19q-2-3 0-6t0-6"/></g>');
    }
    return '';
  }
  // แขนแต่ละแบบ: l/r = เส้นแขน+มือ, hx/hy = มือที่ถือของ (null = ถือไม่ได้)
  function armSet(a) {
    var arm = function (d) { return '<path d="' + d + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>'; };
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>'; };
    var finger = function (x, y, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><rect x="0" y="-2" width="9" height="4" rx="2" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2"/></g>'; };
    var L = { a: arm('M31 76q-10 4-12 12'), x: 19, y: 90 };
    switch (a) {
      case 'point': return { l: L, r: '<g class="vmx-point">' + arm('M89 76q12 0 22-3') + finger(114, 73, -6) + hand(111, 73) + '</g>' };
      case 'up': return { l: L, r: arm('M89 72q8-12 5-30') + finger(94, 38, -90) + hand(94, 42) };
      case 'thumb': return { l: L, r: '<g class="vmx-thumb">' + arm('M89 80q10 0 14-8') + '<rect x="98" y="66" width="11" height="10" rx="4" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.2"/><rect x="100" y="57" width="5" height="11" rx="2.5" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.2"/></g>' };
      case 'cross': return { l: { a: arm('M31 84q14 12 30 8') + hand(62, 92), x: null }, r: arm('M89 84q-14 12-30 8') + hand(58, 94) };
      case 'scratch': return { l: L, r: arm('M89 72q12-14 2-40') + hand(90, 30) + '<g class="vmx-tw" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"><path d="M100 26l5-3M100 33l6 0"/></g>' };
      case 'chin': return { l: { a: arm('M31 78q-9 5-10 13'), x: 21, y: 92 }, r: arm('M89 86q5-7-4-10q-7-2-12 2') + hand(72, 79) };
      case 'cheer': return { l: { a: arm('M31 72q-10-6-12-20') + hand(19, 51), x: null }, r: arm('M89 72q10-6 12-20'), rx: 101, ry: 51 };
      case 'cover': return { l: { a: arm('M31 80q10-2 19-10') + hand(51, 70), x: null }, r: arm('M89 80q-10-2-19-10') + hand(69, 70) };
      case 'palm': return { l: L, r: '<g class="vmx-push">' + arm('M89 74q12-2 16-14') + '<g transform="translate(108 52)"><rect x="-7" y="-10" width="14" height="17" rx="6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/><path d="M-3-6v6M0-7v7M3-6v6" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></g></g>' };
      case 'open': return { l: { a: arm('M31 78q-12 6-18 2') + hand(13, 80), x: null }, r: arm('M89 78q12 6 18 2'), rx: 107, ry: 80 };
      case 'bow': return { l: { a: arm('M31 82q8 14 22 18') + hand(54, 100), x: null }, r: arm('M89 82q-8 14-22 18') + hand(66, 100) };
      default: return { l: L, r: '<g class="vmx-wavearm">' + arm('M89 72q10-6 12-18') + hand(101, 53) + '</g>' };
    }
  }
  function parseCombo(str) {
    var o = { arm: 'wave', face: 'smile', prop: 'pen', move: 'bob' };
    String(str).split('+').forEach(function (t) {
      t = t.trim();
      if (ARMS.indexOf(t) >= 0) o.arm = t; else if (FACES.indexOf(t) >= 0) o.face = t;
      else if (PROPS.indexOf(t) >= 0) o.prop = t; else if (MOVES.indexOf(t) >= 0) o.move = t;
    });
    return o;
  }
  function comboSvg(str, size) {
    var o = parseCombo(str), s = size || 120, A = armSet(o.arm), left = A.l.a + '', propOut = '';
    if (o.prop !== 'none') {
      if (A.rx != null) propOut = propSvg(o.prop, A.rx, A.ry) + '<circle cx="' + A.rx + '" cy="' + A.ry + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>';
      else if (A.l.x != null) propOut = propSvg(o.prop, A.l.x, A.l.y) + '<circle cx="' + A.l.x + '" cy="' + A.l.y + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>';
    } else {
      if (A.rx != null) propOut = '<circle cx="' + A.rx + '" cy="' + A.ry + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>';
      else if (A.l.x != null) propOut = '<circle cx="' + A.l.x + '" cy="' + A.l.y + '" r="4.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4"/>';
    }
    return '<svg class="vm vmx vmx-m-' + o.move + ' vmx-a-' + o.arm + '" viewBox="0 0 120 140" width="' + s + '" height="' + Math.round(s * 140 / 120) + '" role="img" aria-label="เวลลัม มาสคอตของ Vellum Check">' +
      '<ellipse cx="60" cy="134" rx="30" ry="4" fill="#000" opacity=".28"/>' + faceBack(o.face) +
      '<g class="vm-body">' +
        '<ellipse cx="48" cy="126" rx="7" ry="4.5" fill="' + INK + '"/><ellipse cx="72" cy="126" rx="7" ry="4.5" fill="' + INK + '"/>' +
        '<path d="M30 30h60v80H30z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M34 34h6v72h-6z" fill="#fff" opacity=".35"/>' +
        '<rect x="40" y="81" width="30" height="6" rx="2" fill="' + HL + '" opacity=".75"/>' +
        '<path d="M42 84h26M42 92h36M42 99h20" stroke="#bfae86" stroke-width="2" stroke-linecap="round"/>' +
        roll(20) + roll(104) +
        '<ellipse cx="42" cy="66" rx="5" ry="3.2" fill="' + BLUSH + '" opacity=".75"/><ellipse cx="78" cy="66" rx="5" ry="3.2" fill="' + BLUSH + '" opacity=".75"/>' +
        '<g class="vm-face">' + faceSvg(o.face) + '</g>' +
        left + A.r + propOut +
      '</g></svg>';
  }
  // ชุดท่าผสมตามอารมณ์เดิม — ใช้สุ่มแบบคงที่ (seed) ให้ช่องติดกันไม่ซ้ำกัน
  var FAMILY = {
    wave: ['wave', 'wave+smile+pen+bob', 'open+laugh+none+sway', 'wave+wink+cup+bob', 'up+smile+pen+lean', 'thumb+smile+pen+bob'],
    happy: ['happy', 'thumb+laugh+pen+hop', 'cheer+star+coin+hop', 'point+smile+money+bob', 'wave+wink+coin+sway', 'open+laugh+money+hop', 'thumb+wink+clip+bob'],
    sleep: ['sleep', 'chin+sleepy+cup+breathe', 'bow+sleepy+none+breathe'],
    party: ['party', 'cheer+laugh+coin+hop', 'open+star+none+spin', 'thumb+star+money+hop', 'cheer+star+sign+hop'],
    sad: ['sad', 'cover+cry+none+breathe', 'chin+sad+pen+sway', 'bow+sad+none+breathe', 'scratch+sad+money+sway'],
    curious: ['curious', 'scratch+hmm+pen+sway', 'chin+think+clip+lean', 'point+hmm+cal+bob', 'up+think+pen+lean', 'chin+hmm+phone+sway', 'cross+think+none+lean'],
    stop: ['stop', 'palm+firm+shield+bob', 'cross+firm+none+bob', 'point+firm+sign+shake', 'palm+firm+pen+shake', 'open+firm+shield+bob'],
    alert: ['alert', 'cover+shock+none+shake', 'scratch+shock+phone+shake', 'point+shock+cal+hop', 'open+shock+none+shake'],
    inspect: ['inspect', 'chin+hmm+mag+lean', 'point+wink+mag+peek', 'up+think+mag+sway', 'wave+firm+clip+peek', 'thumb+wink+mag+bob']
  };
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  // pick(ท่าเดิมหรือท่าผสม, seed, ท่าก่อนหน้า) → ท่าที่จะใช้จริง
  function pick(mood, seed, prev) {
    if (!mood || String(mood).indexOf('+') >= 0) return mood || 'curious';
    var list = FAMILY[mood]; if (!list) return mood;
    var i = hash(seed) % list.length;
    if (list[i] === prev) i = (i + 1) % list.length;
    return list[i];
  }

  window.VCMascot = { svg: function (mood, size) { return String(mood || '').indexOf('+') >= 0 ? comboSvg(mood, size) : svg(mood, size); }, pick: pick, parts: { arms: ARMS, faces: FACES, props: PROPS, moves: MOVES }, moods: ['wave', 'happy', 'sleep', 'party', 'sad', 'curious', 'stop', 'alert', 'inspect'] };
})();
