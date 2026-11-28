import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lfagri','[ภาพประกอบนิทาน เช้าในร้านวัสดุเกษตร โทนเขียวมะกอก] กระสอบปุ๋ย ที่ดินข้างร้าน ป้ายราคาประเมิน',
 [bg('lf1','#ecfccb','#fef9c3','#8a9a6a'), SACKS(254,132,5,'#fef3c7','ปุ๋ย'), PRICEBOARD(150,100,'2.6 ล้าน','4 ล้าน','#4d7c0f'),
  FLOOR('#365314',.08), DUST(9,452,'#fff',.5), vignette('lf1'), FG('l','#365314',.3)]+person('M',318,'#65a30d','#d8a882','calm'))
o+=P('lfcounter','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนฟ้าคราม] ใบเสร็จค่าธรรมเนียม 2% ตรายกเว้นบริจาคราชการ',
 [bg('lf2','#e0f2fe','#e0e7ff','#7a8aa8'), courtcounter(240,146,110), receipt(250,110), SEAL(140,100,'บริจาค = ยกเว้น','#15803d',w=80),
  FLOOR('#1e3a8a',.07), vignette('lf2')]+person('W',60,'#1d4ed8','#e8b896','worried'))
o+=P('lfdeed','[ภาพประกอบนิทาน เย็นในร้าน โทนเหลืองนวล] โฉนดฉบับเจ้าของในซองกันน้ำ ลูกหมูตุ๊กตา',
 [bg('lf3','#fef9c3','#fefce8','#a89a6a'), desk(240,134,100,'#a16207'), AWARD(244,98,'โฉนด','#a16207'), PIGLET(92,124,.7),
  FLOOR('#713f12',.06), vignette('lf3')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s452.js','w').write(o)
