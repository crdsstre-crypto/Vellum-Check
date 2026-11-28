import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dthome','[ภาพประกอบนิทาน สายในบ้านแถวชั้นล่างที่เป็นร้านขนมไทย เตียงคนป่วยหลังม่าน โทนชมพูกลีบบัวกับเขียวใบเตย แสงโคมไฟอุ่น] ถาดขนม เตียงหลังม่าน โคมไฟ ลูกวัว หญิงภูมิใจ (น้องม้วนขวา)',
 [bg('dt1','#fce7f3','#dcfce7','#a8a29e'), lamp(320,60,'#fbbf24'), '<g transform="translate(270 108)"><rect width="70" height="20" rx="3" fill="#f5f5f4" stroke="#a8a29e"/><rect x="0" y="-8" width="16" height="10" rx="2" fill="#fff"/></g>', '<g transform="translate(210 126)">'+''.join(f'<circle cx="{8+i*11}" cy="6" r="5" fill="{c}"/>' for i,c in enumerate(['#4ade80','#f472b6','#fde047','#4ade80']))+'<rect y="10" width="52" height="5" rx="2" fill="#b45309"/></g>', CALF(170,144,.55),
  LETTER(122,64,'ขอกักขังที่บ้าน',['ศาลสั่งที่อาศัยตัวเองได้','มีคนต้องพึ่งพา → เหตุสำคัญ','(ม.24)'],'#db2777',112,-2,1,12),
  FLOOR('#831843',.05), DUST(7,624,'#fff',.45), vignette('dt1')]+person('W',60,'#ec4899','#e8b88f','proud'))
o+=P('dtwork','[ภาพประกอบนิทาน บ่ายในครัวหลังร้าน ซึ้งนึ่งขนมมีไอ กระดิ่งรับออเดอร์ โทนเหลืองมะม่วงกับฟ้าคราม แสงจากหน้าต่างครัว] ซึ้งนึ่ง ไอน้ำ กระดิ่ง ลูกบีเวอร์ ชายดีใจ (น้องม้วนซ้าย)',
 [bg('dt2','#fef9c3','#e0f2fe','#a8a29e'), '<g transform="translate(232 104)"><rect width="40" height="30" rx="4" fill="#94a3b8"/><rect y="-6" width="40" height="8" rx="3" fill="#64748b"/></g>', steam(252,96), BELL(300,72,.8), BEAVER(170,142,.55),
  LETTER(56,64,'กักขังที่บ้าน',['ทำอาชีพในบ้านได้ (ม.26)','สถานกักขัง: อาหาร/เยี่ยม ≥ 1 ชม.','รับส่งจดหมายได้ (ม.25)'],'#0369a1',134,-2,1,12),
  FLOOR('#0c4a6e',.06), DUST(7,625,'#fff',.45), vignette('dt2')]+person('M',318,'#0ea5e9','#d8a882','joy'))
o+=P('dtbreak','[ภาพประกอบนิทาน ค่ำหน้าประตูบ้าน มอเตอร์ไซค์ส่งของจอดรอ สมุดบันทึกเจ้าหน้าที่ โทนกรมท่ากับส้มหลอดไฟ แสงไฟหน้าบ้าน] ประตูบ้าน กล่องขนม สมุดบันทึก แพะ หญิงตรวจสอบ (น้องม้วนกลาง)',
 [bg('dt3','#1e3a8a','#fed7aa','#57534e'), '<g transform="translate(316 62)"><rect width="34" height="84" fill="#7c2d12"/><circle cx="26" cy="46" r="2.4" fill="#fde68a"/></g>', box(214,120,30,24,'#fbcfe8','#db2777'), GOAT(258,138,.5),
  STEPCARD(10,84,'1','ออกนอกบ้าน','ผิดเงื่อนไขศาล','#dc2626',ICON('clock','#dc2626')), ARROW(70,102,'#dc2626'),
  STEPCARD(80,84,'2','เปลี่ยนเป็นจำคุก','≤ เวลาที่เหลือ (ม.27)','#1d4ed8',ICON('shield','#1d4ed8')),
  NOTEBAR(10,128,'ให้คนอื่นไปส่งของแทน','#1d4ed8',124,-2),
  FLOOR('#000',.12), DUST(7,626,'#fde68a',.45), vignette('dt3')]+person('W',292,'#f59e0b','#e8b88f','inspect'))
open('/home/claude/work/s533.js','w').write(o)
