import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ctphone','[ภาพประกอบนิทาน เช้าในร้านซ่อมมือถือ โทนฟ้าน้ำทะเล] จอแตก อะไหล่ปลอม ถุงหลักฐาน',
 [bg('ct1','#cffafe','#e0f2fe','#6aa8b8'), desk(230,134,110,'#0e7490'), '<g transform="translate(220 112)"><rect x="-10" y="-18" width="20" height="34" rx="4" fill="#1e293b"/><path d="M-6 -10l6 8l-4 6l6 6" stroke="#e2e8f0" stroke-width="1.2" fill="none"/></g>', EVIBAG(256,110,'1','#0891b2'), ZOOM(150,96,'ปลอม'),
  FLOOR('#164e63',.07), DUST(9,309,'#fff',.5), vignette('ct1'), FG('l','#164e63',.25)]+person('M',318,'#0891b2','#d8a882','calm'))
o+=P('ctcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนส้มอิฐ] เก้าอี้จำเลยว่าง ศาลส่องแว่นขยายหาพยาน',
 [bg('ct2','#ffedd5','#fef3c7','#a8846a'), emptychair(240,146), magnifier(160,104), CHIP(250,84,'ยังต้องสืบพยาน','#c2410c'),
  FLOOR('#7c2d12',.07), vignette('ct2')]+person('W',60,'#ea580c','#e8b896','worried'))
o+=P('ctdesk','[ภาพประกอบนิทาน เย็นที่โต๊ะทำงาน โทนม่วงพาสเทล] นาฬิกาทรายหยุด วงนับ 60 วัน โคอาล่าบนกิ่ง',
 [bg('ct3','#f3e8ff','#fae8ff','#8a7aa8'), KOALA(84,90,.7), hourglass(250,110,'#9333ea'), DAYRING(160,104,'60','วัน',.3,'#9333ea'),
  FLOOR('#581c87',.06), vignette('ct3')]+person('M',292,'#9333ea','#d8a882','calm'))
open('/home/claude/work/s309.js','w').write(o)
