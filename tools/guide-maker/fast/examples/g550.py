import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dsbcheck','[ภาพประกอบนิทาน สายในร้านอะไหล่รถ ชั้นยางรถ เครื่องมือแขวนผนัง แฟ้มประวัติส่งสมทบ โทนส้มสนิมกับฟ้าเหล็ก แสงหน้าต่างโรงงาน] ยางรถ ประแจ แฟ้ม 15 เดือน แพนโกลิน เจ้าของร้านตรวจ (น้องม้วนขวา)',
 [bg('ds1','#dbeafe','#fed7aa','#a8a29e'), ''.join(f'<circle cx="{246+i*30}" cy="112" r="14" fill="#1f2937"/><circle cx="{246+i*30}" cy="112" r="6" fill="#9ca3af"/>' for i in range(3)), '<path d="M236 70l14 14M276 66l-4 18M300 68l10 14" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>', PANGOLIN(338,142,.4),
  LETTER(122,64,'เช็กสิทธิทุพพลภาพ',['ไม่ใช่จากงาน (ม.69)','สมทบ ≥ 3 ใน 15 เดือน','จากงาน → กฎหมายเงินทดแทน'],'#c2410c',124,-2,1,12),
  FLOOR('#7c2d12',.06), DUST(7,1050,'#fff',.4), vignette('ds1'), FG('r','#7c2d12',.12)]+person('M',60,'#f97316','#d8a882','calm'))
o+=P('dsbcare','[ภาพประกอบนิทาน บ่ายในศูนย์ฟื้นฟู ราวจับฝึกเดิน ลูกบอลยาง ต้นไม้ในกระถาง โทนเขียวพาสเทลกับลาเวนเดอร์ แสงบ่ายโปร่ง] ราวฝึกเดิน เทอร์โมมิเตอร์ ฮิปโป หญิงโล่งใจ (น้องม้วนซ้าย)',
 [bg('ds2','#ede9fe','#dcfce7','#a8a29e'), '<g transform="translate(216 92)"><path d="M0 0h96M0 16h96" stroke="#7c3aed" stroke-width="3"/><path d="M4 0v42M92 0v42" stroke="#7c3aed" stroke-width="3"/></g>', plant(330,146,.8), '<circle cx="300" cy="138" r="7" fill="#f472b6"/>', HIPPO(236,140,.4),
  LETTER(56,64,'รักษา + ฟื้นฟู + เงินทดแทน',['ตรวจ ยา ห้อง รถ ฟื้นฟู (ม.70)','เงินทดแทน ≤ 50% (ม.71)','ดีขึ้นอาจลด เสื่อมอาจเพิ่ม (ม.72)'],'#7c3aed',146,-2,1,12),
  FLOOR('#4c1d95',.05), DUST(6,1051,'#fff',.4), vignette('ds2')]+person('W',318,'#a78bfa','#e8b88f','smile'))
o+=P('dsbpick','[ภาพประกอบนิทาน ค่ำในบ้าน โต๊ะมีแบบแสดงความจำนงสองแผ่น ให้เลือกหนึ่ง โคมไฟตั้งโต๊ะ โทนกรมท่ากับครีมทอง แสงโคมอุ่น] แบบสองแผ่น ป้ายเลือก 1 ชายคิด (น้องม้วนกลาง)',
 [bg('ds3','#1e293b','#fef3c7','#57534e'), lamp(320,40,'#fde68a'), '<g transform="translate(214 96) rotate(-6)"><rect width="38" height="48" rx="3" fill="#fff"/><text x="19" y="26" text-anchor="middle" font-size="8" fill="#0f766e" font-family="sans-serif">ม.64</text></g><g transform="translate(250 98) rotate(5)"><rect width="38" height="48" rx="3" fill="#fff"/><text x="19" y="26" text-anchor="middle" font-size="8" fill="#b45309" font-family="sans-serif">ม.71</text></g>',
  STEPCARD(10,84,'1','ป่วย ม.64','หรือ','#0f766e',ICON('pen','#0f766e')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','ทุพพลภาพ ม.71','เลือก 1 (ม.61/1)','#b45309',ICON('coin','#b45309')),
  NOTEBAR(10,128,'เสียชีวิตภายหลัง → ค่าทำศพ (ม.73/1)','#0f766e',132,-2),
  FLOOR('#000',.12), DUST(7,1052,'#fef3c7',.4), vignette('ds3')]+person('M',292,'#0ea5e9','#d8a882','worried'))
open('/home/claude/work/s550.js','w').write(o)
