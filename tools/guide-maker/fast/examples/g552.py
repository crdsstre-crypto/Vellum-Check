import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lcwhy','[ภาพประกอบนิทาน เช้าในร้านเบเกอรี่ ตู้ขนมปังอบใหม่ หมายศาลแรงงานซองสีน้ำตาลบนเคาน์เตอร์ โทนครีมเนยกับฟ้าหม่น แสงเช้าจากหน้าร้าน] ตู้ขนมปัง ซองหมายศาล ตาชั่ง แมวน้อย หญิงสงสัย (น้องม้วนขวา)',
 [bg('lc1','#fef3c7','#dbeafe','#a8a29e'), '<g transform="translate(228 88)"><rect width="96" height="48" rx="4" fill="#fff7ed" stroke="#92400e" stroke-width="2"/>'+''.join(f'<ellipse cx="{16+i*22}" cy="20" rx="9" ry="6" fill="#d97706"/><ellipse cx="{16+i*22}" cy="36" rx="9" ry="6" fill="#f59e0b"/>' for i in range(4))+'</g>', envelope(276,64,.9,'#fef3c7','#d6c7a6',-8,'#7c2d12'), KITTEN(338,142,.42),
  LETTER(122,64,'คดีอะไรขึ้นศาลแรงงาน',['สัญญาจ้าง/สภาพการจ้าง (ม.8)','คุ้มครองแรงงาน ประกันสังคม','ศาลอื่นห้ามรับ (ม.9)'],'#92400e',124,-2,1,12),
  FLOOR('#78350f',.06), DUST(7,1252,'#fff',.4), vignette('lc1'), FG('r','#78350f',.12)]+person('W',60,'#f59e0b','#e8b88f','calm'))
o+=P('lcwhere','[ภาพประกอบนิทาน บ่ายในสถานีรถทัวร์ ป้ายเชียงใหม่–ขอนแก่น แผนที่หมุดสองจุด กระเป๋าเดินทาง โทนส้มพระอาทิตย์กับครามอ่อน แสงบ่ายแดดแรง] ป้ายรถทัวร์ แผนที่สองหมุด กระเป๋า ชายครุ่นคิด (น้องม้วนซ้าย)',
 [bg('lc2','#e0e7ff','#fed7aa','#a8a29e'), SIGN(226,60,96,'เชียงใหม่ → ขอนแก่น','#1e3a8a','#fff',7), '<g transform="translate(232 92)"><rect width="84" height="44" rx="4" fill="#fff" stroke="#1e3a8a" stroke-width="1.6"/><path d="M14 30q30 -30 56 -6" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3" fill="none"/><circle cx="14" cy="30" r="5" fill="#dc2626"/><circle cx="70" cy="24" r="5" fill="#16a34a"/></g>', '<g transform="translate(214 124)"><rect width="22" height="18" rx="3" fill="#ea580c"/><path d="M6 0v-5h10v5" stroke="#7c2d12" stroke-width="2" fill="none"/></g>',
  LETTER(56,64,'ฟ้องศาลไหน',['ที่ลูกจ้างทำงาน = มูลคดี','ภูมิลำเนา → ศาลอนุญาต','ขอโอนคดี: มีเหตุผล (ม.33)'],'#1e3a8a',146,-2,1,12),
  FLOOR('#1e1b4b',.06), DUST(6,1253,'#fff',.4), vignette('lc2')]+person('M',318,'#6366f1','#d8a882','worried'))
o+=P('lcprov','[ภาพประกอบนิทาน สายหน้าศาลจังหวัดเล็กๆ ต้นจามจุรีใหญ่ ธงชาติ บันไดหิน โทนเขียวจามจุรีกับเหลืองทอง แสงเช้าลอดใบไม้] ศาลจังหวัด ต้นไม้ใหญ่ ธง หญิงมั่นใจ (น้องม้วนกลาง)',
 [bg('lc3','#dcfce7','#fef9c3','#a8a29e'), COURTHOUSE(236,62), '<circle cx="330" cy="70" r="26" fill="#4ade80" opacity=".55"/><rect x="327" y="90" width="6" height="40" fill="#78350f"/>',
  STEPCARD(10,84,'1','ไม่มีศาลแรงงานจว.','ยื่นศาลจังหวัด/ภาค','#15803d',ICON('mail','#15803d')), ARROW(70,102,'#15803d'),
  STEPCARD(80,84,'2','ศาลแรงงานภาค','มานั่งพิจารณาที่นี่','#ca8a04',ICON('shield','#ca8a04')),
  NOTEBAR(10,128,'นัดนอกศาล/วันหยุดได้ถ้ามีเหตุ (ม.28)','#15803d',132,-2),
  FLOOR('#14532d',.05), DUST(7,1254,'#fff',.45), vignette('lc3')]+person('W',292,'#22c55e','#e8b88f','smile'))
open('/home/claude/work/s552.js','w').write(o)
