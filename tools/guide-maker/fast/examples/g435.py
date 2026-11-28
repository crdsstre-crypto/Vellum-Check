import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('hihomestay','[ภาพประกอบนิทาน เช้าหน้าโฮมสเตย์ โทนเขียวป่า] เคาน์เตอร์ต้อนรับ แผงกุญแจห้อง ทะเบียนผู้พัก',
 [bg('hi1','#dcfce7','#fef9c3','#7aa87a'), KEYRACK(240,96,6,'#92400e'), DOC(120,92,76,40,'ทะเบียนผู้พัก',[('12 ห้อง','#15803d')],'#16a34a'),
  FLOOR('#14532d',.08), DUST(9,435,'#fff',.5), vignette('hi1'), FG('l','#14532d',.3)]+person('W',318,'#16a34a','#e8b896','calm'))
o+=P('hilobby','[ภาพประกอบนิทาน ค่ำในล็อบบี้ โทนม่วงคราม] นาฬิกาสามทุ่ม บัตรเจ้าหน้าที่ ใบปรับทางปกครอง',
 [bg('hi2','#e0e7ff','#ede9fe','#7a7aa8'), '<g transform="translate(250 80)"><circle r="16" fill="#fff" stroke="#4338ca" stroke-width="3"/><path d="M0 0v-10M0 0l-9 0" stroke="#0f172a" stroke-width="2"/><circle r="2" fill="#0f172a"/></g>', receipt(250,128), SEAL(140,100,'ปรับ 5 พัน–2 หมื่น','#dc2626',w=86),
  FLOOR('#1e1b4b',.07), vignette('hi2')]+person('M',60,'#4338ca','#d8a882','worried'))
o+=P('hioffice','[ภาพประกอบนิทาน เย็นในห้องผู้จัดการ โทนชมพูพีช] รายการแก้ไข ติ๊กครบ เต่าตุ๊กตา',
 [bg('hi3','#ffe4e6','#fff1f2','#a87a7a'), desk(240,134,100,'#be123c'), DOC(214,80,70,46,'แผนแก้ไข',[('✓ ป้ายหนีไฟ','#15803d'),('✓ ทะเบียนครบ','#15803d')],'#e11d48'), TURTLE(92,128,.65),
  FLOOR('#881337',.06), vignette('hi3')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s435.js','w').write(o)
