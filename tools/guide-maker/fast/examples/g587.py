import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('laneed','[ภาพประกอบนิทาน สายในร้านขายมือถือ ตู้กระจกโทรศัพท์ ป้ายเล็กรับประกันชีวิตแปะกระจก ใบอนุญาตตัวแทนว่างเปล่า โทนฟ้าไซเบอร์กับส้มสด แสงไฟร้านสว่าง] ตู้โทรศัพท์ ป้าย ใบอนุญาตว่าง กระรอก ชายเจ้าของร้าน (น้องม้วนขวา)',
 [bg('la1','#e0f2fe','#ffedd5','#a8a29e'), '<g transform="translate(222 84)"><rect width="76" height="50" rx="4" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>'+''.join(f'<rect x="{8+i*22}" y="10" width="14" height="26" rx="3" fill="#1f2937"/>' for i in range(3))+'</g>', '<g transform="translate(300 66)"><rect width="34" height="44" rx="3" fill="#fff" stroke="#ea580c" stroke-width="2" stroke-dasharray="4 3"/><text x="17" y="27" text-anchor="middle" font-size="14" fill="#ea580c" font-family="sans-serif" font-weight="900">?</text></g>', SQUIRREL(342,142,.34),
  LETTER(122,64,'ขายประกันชีวิต',['ต้องมีใบอนุญาตตัวแทน (ม.68)','ไม่มี คุก ≤ 6 ด./ปรับ ≤ 5 หมื่น','ยื่นพร้อมหนังสือของบริษัท'],'#0369a1',124,-2,1,12),
  FLOOR('#0c4a6e',.05), DUST(7,4787,'#fff',.4), vignette('la1'), FG('r','#0c4a6e',.12)]+person('M',60,'#0ea5e9','#d8a882','worried'))
o+=P('larenew','[ภาพประกอบนิทาน บ่ายโต๊ะทำงาน ใบอนุญาตตัวแทนมีวันหมดอายุ ปฏิทินวงสองเดือนก่อน ใบประกาศการอบรม โทนเขียวมิ้นต์กับครีม แสงบ่ายสบาย] ใบอนุญาต ปฏิทิน ใบประกาศ หญิงต่ออายุ (น้องม้วนซ้าย)',
 [bg('la2','#d1fae5','#fef3c7','#a8a29e'), '<g transform="translate(226 74)"><rect width="54" height="38" rx="4" fill="#fff" stroke="#047857" stroke-width="2"/><circle cx="14" cy="18" r="7" fill="#a7f3d0"/><rect x="26" y="12" width="22" height="4" fill="#6ee7b7"/><rect x="26" y="22" width="16" height="4" fill="#fca5a5"/></g>', DAYRING(304,92,'2','เดือน',.7,'#047857',16), '<rect x="230" y="118" width="40" height="18" fill="#fef3c7" stroke="#ca8a04"/>',
  LETTER(56,64,'ใบอนุญาต 1 ปี',['ต่อภายใน 2 เดือนก่อนหมด (ม.77)','ต่อครบ 2 ครั้ง → ครั้งละ 5 ปี','เป็นนายหน้าอยู่ = ต้องห้าม'],'#047857',146,-2,1,12),
  FLOOR('#064e3b',.05), DUST(6,4788,'#fff',.4), vignette('la2')]+person('W',318,'#10b981','#e8b88f','calm'))
o+=P('laname','[ภาพประกอบนิทาน เย็นหน้าร้าน ช่างกำลังจะติดป้าย “ประกันชีวิต” เจ้าของยกมือห้าม กระดาษค่าปรับรายวัน โทนม่วงพลบกับเหลืองป้าย แสงเย็น] ป้ายใหม่ บันได ใบปรับ ชายหยุดคิด (น้องม้วนกลาง)',
 [bg('la3','#ede9fe','#fef9c3','#a8a29e'), '<g transform="translate(232 62)"><rect width="88" height="22" rx="3" fill="#fde047" stroke="#7c3aed" stroke-width="2"/><text x="44" y="15" text-anchor="middle" font-size="9" fill="#7c3aed" font-family="sans-serif" font-weight="900">ประกันชีวิต</text><path d="M4 4l80 14" stroke="#dc2626" stroke-width="3"/></g>', '<path d="M300 140l12 -50M318 140l-6 -50M304 120h12M306 104h10" stroke="#78716c" stroke-width="2.5"/>',
  STEPCARD(10,84,'1','ใช้คำว่าประกันชีวิต','ต้องเป็นบุคคลตาม ม.19','#7c3aed',ICON('shield','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','ใช้ผิด','2 หมื่น–1 แสน + รายวัน','#dc2626',ICON('coin','#dc2626')),
  NOTEBAR(10,128,'ให้ตัวแทนคุยกับลูกค้าเองแทน','#7c3aed',132,-2),
  FLOOR('#4c1d95',.05), DUST(7,4789,'#fff',.45), vignette('la3')]+person('M',292,'#8b5cf6','#d8a882','calm'))
open('/home/claude/work/s587.js','w').write(o)
