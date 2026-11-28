import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('odice','[ภาพประกอบนิทาน เช้าที่ร้านน้ำแข็ง โทนฟ้าเย็นจัด] ถังน้ำแข็ง ใบส่งของคาร์บอน ต้นฉบับอยู่ที่ลูกค้า',
 [bg('od1','#e0f2fe','#f0f9ff','#7a9aa8'), '<g transform="translate(240 112)"><rect x="-26" y="-20" width="52" height="38" rx="4" fill="#bae6fd" stroke="#0284c7"/>'+''.join(f'<rect x="{-20+i*12}" y="-14" width="10" height="10" rx="2" fill="#fff" opacity=".9"/>' for i in range(4))+'</g>', receipt(140,108), CHIP(150,84,'ต้นฉบับอยู่ที่ลูกค้า','#0369a1'),
  FLOOR('#0c4a6e',.07), DUST(9,319,'#fff',.6), vignette('od1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('odcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนแดงอ่อน] ใบเสร็จที่ถูกคัดค้านว่าปลอม แว่นขยาย ป้ายถือว่ายอมรับ',
 [bg('od2','#fee2e2','#fff7ed','#a87a6a'), DOC(196,86,84,48,'ใบเสร็จ?',[('ลายเซ็นไม่ตรง','#dc2626')],'#b91c1c'), magnifier(260,110), CHIP(100,126,'ค้านก่อนสืบเสร็จ','#b91c1c'),
  FLOOR('#7f1d1d',.07), vignette('od2')]+person('W',60,'#b91c1c','#e8b896','worried'))
o+=P('odoffice','[ภาพประกอบนิทาน เช้าที่สำนักงาน โทนเขียวอ่อน] ตู้เซฟเอกสาร ตราราชการ แรคคูนตุ๊กตา',
 [bg('od3','#dcfce7','#f0fdf4','#7aa88a'), SAFEBOX(250,116), RACCOON(84,130,.6), stamp(170,110,'#15803d'),
  FLOOR('#14532d',.06), vignette('od3')]+person('M',292,'#16a34a','#d8a882','happy'))
open('/home/claude/work/s319.js','w').write(o)
