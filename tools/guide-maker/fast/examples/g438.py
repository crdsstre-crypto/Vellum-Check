import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wpsugar','[ภาพประกอบนิทาน เช้าในร้านค้าส่งน้ำตาล โทนชมพูอ่อน] กระสอบน้ำตาล ประทวนสินค้า จดหมายถึงนายคลัง',
 [bg('wp1','#fce7f3','#fff1f2','#a87a8a'), SACKS(250,132,5,'#fff','น้ำตาล'), ENVFLY(120,112,180,84,2,'#be185d'),
  FLOOR('#831843',.07), DUST(9,438,'#fff',.5), vignette('wp1'), FG('l','#831843',.25)]+person('W',318,'#db2777','#e8b896','calm'))
o+=P('wpauction','[ภาพประกอบนิทาน บ่ายที่ลานขายทอดตลาด โทนส้มอุ่น] ค้อนประมูล ลำดับแบ่งเงิน',
 [bg('wp2','#ffedd5','#fef3c7','#a88a6a'), STEPS(200,96,['ค่าเก็บ','ประทวน','จำนำหลัง'],1,'#c2410c'), '<g transform="translate(150 128) rotate(-30)"><rect x="-4" y="-2" width="30" height="5" rx="2" fill="#92400e"/><rect x="-14" y="-8" width="16" height="16" rx="3" fill="#78350f"/></g>',
  FLOOR('#7c2d12',.07), vignette('wp2')]+person('M',60,'#c2410c','#d8a882','worried'))
o+=P('wpoffice','[ภาพประกอบนิทาน เย็นในร้าน โทนม่วงอ่อน] ประทวนที่จดยอดแล้ว วงนับ 1 ปี ลูกเป็ดตุ๊กตา',
 [bg('wp3','#ede9fe','#f5f3ff','#8a7aa8'), desk(240,134,100,'#6d28d9'), DAYRING(250,104,'1','ปี',.2,'#6d28d9',18), DUCK(92,124,.7),
  DOC(126,82,84,42,'ประทวน',[('ได้แล้ว 320,000','#6d28d9')],'#7c3aed'), FLOOR('#2e1065',.06), vignette('wp3')]+person('M',292,'#7c3aed','#d8a882','happy'))
open('/home/claude/work/s438.js','w').write(o)
