import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('scexceed','[ภาพประกอบนิทาน กลางคืนหน้าร้านกาแฟเปิดใหม่ ป้ายโดนพ่นสี กระจกร้าว โทนน้ำเงินคืนกับชมพูนีออน แสงไฟป้ายร้าน] ป้ายพ่นสี กระจกร้าว กระป๋องสเปรย์ นกฮูก ชายตื่นตัวถือมือถือ (น้องม้วนขวา)',
 [bg('sc1','#1e3a8a','#fbcfe8','#57534e'), SIGN(236,66,76,'COFFEE','#be185d','#fff',9), '<path d="M240 74 q14 -10 30 2 q12 8 30 -4" stroke="#facc15" stroke-width="3" fill="none"/>', CRACK(300,108,.9,'#e2e8f0'), '<g transform="translate(214 124)"><rect width="10" height="20" rx="2" fill="#ef4444"/><rect x="2" y="-4" width="6" height="5" fill="#94a3b8"/></g>', OWL(330,96,.5),
  LETTER(122,96,'จ้างพ่นสี แต่ชกยาม',['รับผิดเท่าที่สั่ง (ม.87)','เว้นแต่เล็งเห็นได้'],'#be185d',104,-2,1,12),
  FLOOR('#000',.14), DUST(7,641,'#f9a8d4',.45), vignette('sc1')]+person('M',60,'#ec4899','#d8a882','alert'))
o+=P('scstop','[ภาพประกอบนิทาน ดึกในรถที่จอดหัวมุม จอโทรศัพท์โทรออกคำว่าหยุด โทนม่วงหม่นกับส้มไฟถนน แสงเสาไฟ] พวงมาลัยรถ โทรศัพท์ เสาไฟ แมวจรบนกำแพง หญิงครุ่นคิด (น้องม้วนซ้าย)',
 [bg('sc2','#4c1d95','#fed7aa','#57534e'), streetlamp(236), phone(270,90,1,'#fecaca'), '<text x="281" y="112" text-anchor="middle" font-size="8" fill="#b91c1c" font-family="sans-serif" font-weight="900">หยุด!</text>', cat(170,150,'#94a3b8',.7),
  LETTER(56,64,'โทรห้ามทัน',['ผู้ใช้ขัดขวาง → รับผิดน้อยลง','ผู้สนับสนุนขัดขวาง → ไม่รับโทษ','(ม.88) เก็บหลักฐานการห้าม'],'#7c3aed',138,-2,1,12),
  FLOOR('#000',.12), DUST(7,642,'#fde68a',.45), vignette('sc2')]+person('W',318,'#8b5cf6','#e8b88f','think'))
o+=P('scpersonal','[ภาพประกอบนิทาน บ่ายในโรงพักชุมชน ผังเครือญาติบนกระดาน กุญแจลิ้นชัก โทนเขียวมะกอกกับครีม แสงหน้าต่างบานเกล็ด] ผังญาติ กุญแจ ม้านั่ง กระต่าย ชายสวมแว่นตั้งใจ (น้องม้วนกลาง)',
 [bg('sc3','#ecfccb','#fefce8','#a8a29e'), board(216,72,70,46,'#4d7c0f'), '<g stroke="#fff" stroke-width="1.6" fill="#fff"><circle cx="236" cy="86" r="4"/><circle cx="266" cy="86" r="4"/><circle cx="251" cy="106" r="4"/><path d="M236 90l15 12M266 90l-15 12" fill="none"/></g>', RABBIT(330,142,.5),
  STEPCARD(10,84,'1','เหตุส่วนตัว','ใช้เฉพาะคนนั้น','#4d7c0f',ICON('shield','#4d7c0f')), ARROW(70,102,'#4d7c0f'),
  STEPCARD(80,84,'2','เหตุลักษณะคดี','ใช้กับทุกคน (ม.89)','#b45309',ICON('mag','#b45309')),
  NOTEBAR(10,128,'อย่าจ้างใครไปป่วนร้านอื่น','#4d7c0f',124,-2),
  FLOOR('#365314',.06), DUST(7,643,'#fff',.4), vignette('sc3')]+person('M',292,'#65a30d','#c99a74','focus',glasses=True))
open('/home/claude/work/s537.js','w').write(o)
