import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sbsize','[ภาพประกอบนิทาน สายหน้าร้านก๋วยเตี๋ยวเรือติดตลาด ป้ายไฟกล่องใหญ่ยื่นเหนือทางเท้า สายวัด ตาชั่งแขวน โทนแดงพริกกับเขียวผัก แสงเช้าตลาด] ป้ายไฟกล่อง สายวัด ทางเท้า แมวน้อย ชายวัดป้าย (น้องม้วนขวา)',
 [bg('sb1','#fee2e2','#dcfce7','#a8a29e'), '<rect x="220" y="118" width="120" height="8" fill="#a8a29e"/><g transform="translate(232 66)"><rect width="96" height="34" rx="4" fill="#fef08a" stroke="#dc2626" stroke-width="3"/><text x="48" y="22" text-anchor="middle" font-size="11" fill="#dc2626" font-family="sans-serif" font-weight="900">ก๋วยเตี๋ยวเรือ</text><path d="M0 34v-40M96 34v-40" stroke="#57534e" stroke-width="3"/></g>', '<path d="M232 108h96" stroke="#2563eb" stroke-width="2"/><path d="M232 104v8M328 104v8" stroke="#2563eb" stroke-width="2"/><text x="280" y="116" text-anchor="middle" font-size="8" fill="#2563eb" font-family="sans-serif" font-weight="900">3.6 ตร.ม.</text>', KITTEN(342,142,.4),
  LETTER(122,64,'ป้ายเป็นอาคารเมื่อ',['เหนือที่สาธารณะ > 1 ตร.ม.','หรือหนักรวมโครง > 10 กก.','(ม.4)'],'#dc2626',124,-2,1,12),
  FLOOR('#7f1d1d',.06), DUST(7,3777,'#fff',.4), vignette('sb1'), FG('r','#7f1d1d',.12)]+person('M',60,'#ef4444','#d8a882','calm'))
o+=P('sbpermit','[ภาพประกอบนิทาน บ่ายที่กองช่างเทศบาล เคาน์เตอร์รับเรื่อง แบบป้ายพับ ตรายาง ปฏิทิน โทนฟ้าราชการกับเหลืองเอกสาร แสงบ่ายสว่าง] เคาน์เตอร์ แบบป้าย ตรา หญิงยื่นเรื่อง (น้องม้วนซ้าย)',
 [bg('sb2','#dbeafe','#fef9c3','#a8a29e'), '<g transform="translate(218 104)"><rect width="110" height="12" fill="#1d4ed8"/><rect y="12" width="110" height="22" fill="#93c5fd"/></g>', '<g transform="translate(236 76) rotate(-6)"><rect width="50" height="30" fill="#fff" stroke="#1d4ed8"/><rect x="6" y="8" width="38" height="12" fill="#fef08a" stroke="#dc2626"/></g>', SEAL(300,84,'รับเรื่อง','#1d4ed8',-8,54),
  LETTER(56,64,'ก่อนติดป้าย',['ขอใบอนุญาตหรือแจ้ง (ม.21)','ขยาย/เพิ่มน้ำหนัก = ดัดแปลง','ย้ายป้าย = เคลื่อนย้าย'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,3778,'#fff',.4), vignette('sb2')]+person('W',318,'#3b82f6','#e8b88f','calm'))
o+=P('sbdouble','[ภาพประกอบนิทาน ค่ำหน้าร้านไฟป้ายสว่าง เครื่องคิดเลขแสดง x2 ช่างป้ายยักไหล่ สัญญาจ้างในมือ โทนม่วงพลบกับเหลืองนีออน แสงไฟป้าย] ป้ายนีออน เครื่องคิดเลข สัญญา ชายรับรู้ (น้องม้วนกลาง)',
 [bg('sb3','#4c1d95','#fde68a','#57534e'), neon(250,80,'x2','#fde047'), '<g transform="translate(296 92)"><rect width="34" height="44" rx="4" fill="#e5e7eb"/><rect x="5" y="5" width="24" height="10" fill="#a7f3d0"/></g>',
  STEPCARD(10,84,'1','อาคารพาณิชย์ผิด','โทษสองเท่า (ม.70)','#7c3aed',ICON('coin','#7c3aed')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','ช่างติดเอง','ถือว่าเจ้าของทำ (ม.71)','#ca8a04',ICON('pen','#ca8a04')),
  NOTEBAR(10,128,'ให้ช่างเป็นคนขออนุญาตในสัญญา','#7c3aed',132,-2),
  FLOOR('#000',.14), DUST(7,3779,'#fde68a',.45), vignette('sb3')]+person('M',292,'#a78bfa','#d8a882','worried'))
open('/home/claude/work/s577.js','w').write(o)
