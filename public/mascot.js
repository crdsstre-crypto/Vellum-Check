/* ===== มาสคอต "เวลลัม" — กระดาษสัญญาม้วนน้อยถือปากกาไฮไลต์ (วาดเอง ไม่ใช้ภาพจากที่อื่น) =====
   VCMascot.svg(mood, size) คืนสตริง SVG · mood: wave | happy | sleep | party | sad
   ท่าขยับอยู่ใน mascot.css (คลาส vm-<mood>) */
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
      '<path d="M76 62q2.4 4 0 6q-2.4-2 0-6z" fill="#8fd0ff" stroke="' + INK + '" stroke-width="1.4"/>'
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

  window.VCMascot = { svg: svg, moods: ['wave', 'happy', 'sleep', 'party', 'sad'] };
})();
