import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wdtools','[ภาพประกอบนิทาน เช้าในร้านเครื่องมือช่าง โทนแดงอ่อน] ชั้นเครื่องมือ คำฟ้อง ยอดผิด 106,000',
 [bg('wd1','#fee2e2','#fff7ed','#a87a6a'), toolrack(240,96), DOC(120,90,90,48,'คำฟ้อง',[('106,000 ✗','#dc2626'),('160,000 ✓','#15803d')],'#b91c1c'),
  FLOOR('#7f1d1d',.07), DUST(9,311,'#fff',.5), vignette('wd1'), FG('l','#7f1d1d',.25)]+person('M',318,'#b91c1c','#d8a882','worried'))
o+=P('wdcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนฟ้าครีม] ลูกหนี้กับร้านจับมือยอมความ คำร้องถอนฟ้อง',
 [bg('wd2','#e0f2fe','#fef9c3','#7a9aa8'), desk(230,132,110,'#0369a1'), '<g transform="translate(240 100)"><path d="M-16 0q8-8 16 0q8-8 16 0" stroke="#fcd9b6" stroke-width="7" fill="none" stroke-linecap="round"/></g>', SEAL(150,96,'ยอมความ','#0369a1'),
  FLOOR('#0c4a6e',.07), vignette('wd2')]+person('W',60,'#0369a1','#e8b896','calm'))
o+=P('wdoffice','[ภาพประกอบนิทาน เย็นที่ร้าน โทนเหลืองอ่อน] ปากกาแก้คำฟ้อง วงนับ 7 วัน โคอาล่าบนชั้น',
 [bg('wd3','#fef9c3','#fefce8','#a89a6a'), KOALA(250,92,.65), DAYRING(150,104,'7','วัน',.85,'#ca8a04'),
  CHIP(20,136,'ส่งสำเนาก่อน 3 วัน','#a16207'), FLOOR('#713f12',.06), vignette('wd3')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s311.js','w').write(o)
