import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dfaircon','[ภาพประกอบนิทาน เช้าในร้านแอร์ โทนฟ้าเย็น] แอร์โชว์ ซองหมายศาลตกอยู่ที่ร้านสาขาเก่าที่ปิด วงนับ 15 วัน',
 [bg('df1','#e0f2fe','#f0f9ff','#7a9aa8'), aircon(240,70), shopfront(230,96,100,50,'#94a3b8') if False else closedsign(240,112), courtenvelope(160,124), DAYRING(130,86,'15','วัน',.5,'#0284c7',18),
  FLOOR('#0c4a6e',.07), DUST(9,297,'#fff',.5), vignette('df1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','worried'))
o+=P('dfpartner','[ภาพประกอบนิทาน บ่ายห้องประชุมหุ้นส่วน โทนเหลืองอำพัน] ตาชั่งสองข้าง จำเลยสองคน ป้ายหนี้แบ่งไม่ได้',
 [bg('df2','#fef3c7','#fff7ed','#a8946a'), scaletwo(240,120), CROWD(140,96,2,'#d97706'), CHIP(250,82,'แบ่งไม่ได้ = รอ','#b45309'),
  FLOOR('#78350f',.07), vignette('df2')]+person('W',60,'#d97706','#e8b896','calm'))
o+=P('dfcourt','[ภาพประกอบนิทาน เช้าหน้าศาล โทนม่วงพาสเทล] อาคารศาล ปฏิทินวันสืบพยาน แพนด้าตุ๊กตาบนม้านั่ง',
 [bg('df3','#ede9fe','#fae8ff','#8a7aa8',wall_tex=False), COURTHOUSE(240,132), PANDA(90,124,.7), calendar6(0,0) if False else '',
  STICKER(150,104,'วันสืบพยาน','#7c3aed',20), FLOOR('#4c1d95',.06), vignette('df3')]+person('W',292,'#7c3aed','#e8b896','calm'))
open('/home/claude/work/s297.js','w').write(o)
