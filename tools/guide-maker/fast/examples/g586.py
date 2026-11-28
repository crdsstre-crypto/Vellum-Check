import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cnfile','[ภาพประกอบนิทาน สายที่ดินโครงการรกร้าง ป้ายประกาศขอยกเลิกจัดสรรติดหน้าโครงการ หนังสือพิมพ์ท้องถิ่น ปฏิทิน 60 วัน โทนเหลืองหญ้าแห้งกับฟ้าหม่น แสงสายโล่ง] ป้ายประกาศ หนังสือพิมพ์ ปฏิทิน นกฮูก ชายติดประกาศ (น้องม้วนขวา)',
 [bg('cn1','#fef9c3','#e0f2fe','#a8a29e'), '<g transform="translate(232 66)"><rect width="56" height="40" fill="#fff" stroke="#1d4ed8" stroke-width="2"/><rect x="6" y="6" width="44" height="6" fill="#1d4ed8"/><rect x="6" y="18" width="34" height="3" fill="#93c5fd"/><path d="M28 40v30" stroke="#57534e" stroke-width="3"/></g>', '<g transform="translate(296 104) rotate(-6)"><rect width="34" height="26" fill="#f5f5f4" stroke="#57534e"/><rect x="4" y="4" width="26" height="4" fill="#57534e"/></g>', OWL(342,142,.36),
  LETTER(122,64,'ขอยกเลิกจัดสรร',['ยื่นสำนักงานที่ดิน (ม.54)','ปิดประกาศ 60 วัน (ม.55)','นสพ. ≥ 7 วัน + แจ้งผู้ซื้อ'],'#1d4ed8',124,-2,1,12),
  FLOOR('#713f12',.05), DUST(7,4686,'#fff',.4), vignette('cn1'), FG('r','#713f12',.12)]+person('M',60,'#3b82f6','#d8a882','calm'))
o+=P('cnobject','[ภาพประกอบนิทาน บ่ายผู้ซื้อสามครอบครัวยืนถือหนังสือคัดค้านหน้าสำนักงานที่ดิน บ้านหลังเล็กสามหลังด้านหลัง โทนส้มอุ่นกับเขียวหวัง แสงบ่ายตรง] บ้านสามหลัง หนังสือคัดค้าน ปฏิทิน 30 วัน หญิงตัวแทนผู้ซื้อ (น้องม้วนซ้าย)',
 [bg('cn2','#ffedd5','#dcfce7','#a8a29e'), ''.join(f'<g transform="translate({224+i*30} 96)"><path d="M0 14l13 -14l13 14z" fill="#ea580c"/><rect y="14" width="26" height="22" fill="#fed7aa" stroke="#9a3412"/></g>' for i in range(3)), DAYRING(324,82,'30','วัน',.8,'#15803d',14),
  LETTER(56,64,'คัดค้านใน 30 วัน',['ผู้ซื้อคัดค้าน → เรื่องตก (ม.56)','ผู้อื่นคัดค้าน → คณะกรรมการ','ไม่มีคัดค้าน → สั่งยกเลิก'],'#15803d',146,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(6,4687,'#fff',.4), vignette('cn2')]+person('W',318,'#f97316','#e8b88f','calm'))
o+=P('cndone','[ภาพประกอบนิทาน เย็นที่ดินว่างที่เตรียมทำโกดัง ใบอนุญาตจัดสรรขาดครึ่ง แผนที่ผังเมือง โกดังร่างบนกระดาษ โทนน้ำเงินพลบกับเหลืองโคม แสงเย็น] ใบอนุญาตขาด ผังเมือง โกดังร่าง หญิงวางแผน (น้องม้วนกลาง)',
 [bg('cn3','#1e3a8a','#fde68a','#57534e'), '<g transform="translate(232 74)"><path d="M0 0h28l-4 30l6 30h-30z" fill="#fff"/><path d="M34 0h22v60h-26l-6 -30z" fill="#fff" transform="translate(6 4) rotate(6)"/></g>', '<g transform="translate(296 92)"><path d="M0 16l18 -14l18 14v26h-36z" fill="#fde68a" stroke="#a16207"/></g>',
  STEPCARD(10,84,'1','สั่งยกเลิก','ใบอนุญาตยกเลิก (ม.57)','#ca8a04',ICON('pen','#ca8a04')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','ไม่ส่งเอกสาร','ปรับ ≤ 10,000 (ม.58)','#dc2626',ICON('coin','#dc2626')),
  NOTEBAR(10,128,'ทำโกดังยังต้องดูผังเมือง','#ca8a04',132,-2),
  FLOOR('#000',.14), DUST(7,4688,'#fde68a',.45), vignette('cn3')]+person('W',292,'#facc15','#e8b88f','hopeful'))
open('/home/claude/work/s586.js','w').write(o)
