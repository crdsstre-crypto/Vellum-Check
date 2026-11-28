import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cmfile','[ภาพประกอบนิทาน โกดังร้านเฟอร์นิเจอร์ออนไลน์ กล่องโต๊ะซ้อนรอส่ง ป้ายติดตามพัสดุสีแดงล่าช้า มือถือแสดงแจ้งเตือนร้องเรียน โทนไม้โอ๊คกับเขียวเซจ แสงโกดังสลัว] กล่อง ป้ายล่าช้า มือถือ บีเวอร์ ชายกังวล (น้องม้วนขวา)',
 [bg('cm1','#ecfdf5','#fef3c7','#a8a29e'), ''.join(f'<rect x="{230+(i%2)*40}" y="{74+(i//2)*30}" width="36" height="26" fill="#d6a46b" stroke="#92400e" stroke-width="1.5"/>' for i in range(4)), SIGN(230,58,76,'ส่งช้า 3 สัปดาห์','#dc2626','#fff',7,-3), BEAVER(344,142,.4),
  LETTER(122,64,'เรื่องร้องเรียนไปไหน',['สคบ. รับเรื่อง ม.20(1)','กรรมการพิจารณา ม.10(1)','ลูกค้ามีสิทธิชดเชย ม.4(4)'],'#047857',124,-2,1,12),
  FLOOR('#064e3b',.05), DUST(7,5941,'#fff',.4), vignette('cm1'), FG('r','#064e3b',.12)]+person('M',60,'#10b981','#d8a882','worried'))
o+=P('cmmediate','[ภาพประกอบนิทาน โต๊ะกลมไกล่เกลี่ย สองแก้วชา ใบข้อตกลงมีช่องลงชื่อสองช่อง ปากกาวางเฉียง มือจับกันเป็นเงา โทนฟ้าพาสเทลกับพีช แสงสบาย] โต๊ะกลม แก้วชา ใบข้อตกลง หญิงยิ้ม (น้องม้วนซ้าย)',
 [bg('cm2','#e0f2fe','#ffedd5','#a8a29e'), '<ellipse cx="282" cy="128" rx="54" ry="10" fill="#c7a17a"/>', '<g transform="translate(258 74) rotate(-4)"><rect width="52" height="46" fill="#fff" stroke="#0369a1" stroke-width="2"/><text x="26" y="12" text-anchor="middle" font-size="7" fill="#0369a1" font-family="sans-serif" font-weight="900">ข้อตกลง</text><path d="M6 30h16M30 30h16" stroke="#334155"/><text x="14" y="40" font-size="5" fill="#64748b" text-anchor="middle">ร้าน</text><text x="38" y="40" font-size="5" fill="#64748b" text-anchor="middle">ลูกค้า</text></g>',
  '<g fill="#fff" stroke="#0369a1" stroke-width="1.5"><rect x="236" y="112" width="12" height="14" rx="2"/><rect x="318" y="112" width="12" height="14" rx="2"/></g>',
  LETTER(56,64,'ไกล่เกลี่ยแล้วทำหนังสือ',['ทั้งคู่ต้องตกลง ม.10(1/1)','ไม่มีหนังสือ ฟ้องบังคับไม่ได้','ข้อเรียกร้องที่สละ ระงับ'],'#0369a1',146,-2,1,12),
  FLOOR('#0c4a6e',.05), DUST(6,5942,'#fff',.4), vignette('cm2')]+person('W',318,'#38bdf8','#e8b88f','calm'))
o+=P('cmsettle','[ภาพประกอบนิทาน หน้าอาคารราชการยามเย็น บันไดขึ้นศาล แฟ้มคดีในมือเงาเจ้าหน้าที่ ทางแยกสองทางมีป้ายตกลงกับฟ้อง โทนส้มอิฐกับน้ำเงินค่ำ แสงตะวันตก] ศาล ป้ายทางแยก แฟ้ม ชายลังเล (น้องม้วนกลาง)',
 [bg('cm3','#ffedd5','#1e3a8a','#57534e'), COURTHOUSE(286,74,.7,'#64748b'),
  STEPCARD(10,84,'1','ตกลงได้','ทำหนังสือ ป.พ.พ. 851','#0f766e',ICON('pen','#0f766e')), ARROW(70,102,'#ffedd5'),
  STEPCARD(80,84,'2','ไม่ได้','สคบ.อาจฟ้องแทน ม.39','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(10,128,'ฟ้องแทนเมื่อเป็นประโยชน์ส่วนรวม','#c2410c',156,-2),
  FLOOR('#000',.12), DUST(7,5943,'#ffedd5',.45), vignette('cm3')]+person('M',292,'#f97316','#d8a882','worried'))
open('/home/claude/work/s594.js','w').write(o)
