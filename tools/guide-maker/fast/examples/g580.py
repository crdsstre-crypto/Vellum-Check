import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lrlayers','[ภาพประกอบนิทาน เช้าบนที่ดินเปล่าริมถนน หมุดเขตที่ดินสีแดง แบบร้านกาแฟสองชั้นบนขาตั้ง กองหนังสือกฎหมายสามเล่มซ้อน โทนเขียวหญ้ากับครีมกาแฟ แสงเช้าโล่ง] หมุดที่ดิน ขาตั้งแบบ หนังสือสามเล่ม นกทูแคน หญิงเจ้าของที่ (น้องม้วนขวา)',
 [bg('lr1','#dcfce7','#fef3c7','#a8a29e'), ''.join(f'<path d="M{226+i*40} 138v-14" stroke="#dc2626" stroke-width="3"/><circle cx="{226+i*40}" cy="122" r="3" fill="#dc2626"/>' for i in range(3)), '<g transform="translate(250 64)"><rect width="50" height="40" fill="#fff" stroke="#78350f" stroke-width="2"/><path d="M8 36v-20h14v20M28 36v-26h14v26" stroke="#a16207" stroke-width="2" fill="none"/><path d="M10 40l-8 30M40 40l8 30" stroke="#78350f" stroke-width="3"/></g>', ''.join(f'<rect x="306" y="{120-i*8}" width="30" height="7" rx="1" fill="{c}"/>' for i,c in enumerate(['#1d4ed8','#16a34a','#dc2626'])), TOUCAN(342,142,.36),
  LETTER(122,64,'กฎ 3 ชั้น',['กฎกระทรวง (ม.8)','ข้อบัญญัติท้องถิ่น (ม.9–11)','ผังเมือง (ม.12)'],'#15803d',124,-2,1,12),
  FLOOR('#14532d',.05), DUST(7,4080,'#fff',.4), vignette('lr1'), FG('r','#14532d',.12)]+person('W',60,'#22c55e','#e8b88f','calm'))
o+=P('lrlocal','[ภาพประกอบนิทาน บ่ายในห้องประชุมสภาเทศบาล ป้ายข้อบัญญัติ ไม้บรรทัดวัดระยะร่น ตราราชกิจจานุเบกษา โทนน้ำเงินราชการกับทองอ่อน แสงบ่ายผ่านหน้าต่างสูง] ป้ายข้อบัญญัติ ไม้บรรทัด ตรา ชายสงสัย (น้องม้วนซ้าย)',
 [bg('lr2','#dbeafe','#fef3c7','#a8a29e'), '<g transform="translate(226 64)"><rect width="66" height="40" fill="#fff" stroke="#1d4ed8" stroke-width="2"/><rect x="6" y="6" width="54" height="6" fill="#1d4ed8"/>'+''.join(f'<rect x="8" y="{18+i*6}" width="{44-i*8}" height="3" fill="#93c5fd"/>' for i in range(3))+'</g>', '<g transform="translate(226 116)"><rect width="70" height="10" fill="#fde68a" stroke="#a16207"/>'+''.join(f'<path d="M{i*7} 0v{4 if i%2 else 7}" stroke="#a16207"/>' for i in range(11))+'</g>', SEAL(312,86,'ราชกิจจาฯ','#1d4ed8',-8,52),
  LETTER(56,64,'ข้อบัญญัติเข้มกว่า',['เพิ่มรายละเอียดไม่ขัด ได้','ขัดเพราะจำเป็น ต้องเห็นชอบ','ใช้ได้เมื่อลงราชกิจจาฯ'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,4081,'#fff',.4), vignette('lr2')]+person('M',318,'#3b82f6','#d8a882','worried'))
o+=P('lrfreeze','[ภาพประกอบนิทาน เย็นที่ย่านกำลังโต แผนที่ผังเมืองสีสันบนกระดาน หมุดร้าน นาฬิกาทรายหนึ่งปี ป้ายห้ามสร้างชั่วคราว โทนชมพูผังเมืองกับฟ้าเหลือบม่วง แสงเย็นอ่อน] แผนที่ผังเมือง นาฬิกาทราย หญิงวางแผน (น้องม้วนกลาง)',
 [bg('lr3','#fce7f3','#e0e7ff','#a8a29e'), '<g transform="translate(226 62)"><rect width="72" height="54" fill="#fff" stroke="#475569"/>'+''.join(f'<rect x="{4+(i%3)*22}" y="{4+(i//3)*24}" width="20" height="22" fill="{c}" opacity=".7"/>' for i,c in enumerate(['#fca5a5','#fde68a','#86efac','#93c5fd','#f9a8d4','#fdba74']))+'<circle cx="36" cy="28" r="4" fill="#1f2937"/></g>', SANDGLASS(320,96,'#7c3aed',1),
  STEPCARD(10,84,'1','ขัดผังเมือง','ใช้ผังเมือง (ม.12)','#be185d',ICON('shield','#be185d')), ARROW(70,102,'#be185d'),
  STEPCARD(80,84,'2','ประกาศห้ามชั่วคราว','ไม่ออกกฎใน 1 ปี = เลิก','#7c3aed',ICON('clock','#7c3aed')),
  NOTEBAR(10,128,'ตรวจสีผังเมืองก่อนซื้อที่','#be185d',132,-2),
  FLOOR('#831843',.05), DUST(7,4082,'#fff',.45), vignette('lr3')]+person('W',292,'#ec4899','#e8b88f','hopeful'))
open('/home/claude/work/s580.js','w').write(o)
