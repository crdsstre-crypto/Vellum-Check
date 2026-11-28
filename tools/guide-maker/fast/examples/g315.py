import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('jcbuild','[ภาพประกอบนิทาน เช้าที่ร้านวัสดุก่อสร้าง โทนส้มอิฐ] คำพิพากษา ขอ 300,000 ได้ 220,000 กองอิฐ',
 [bg('jc1','#ffedd5','#fef3c7','#a8846a'), '<g>'+''.join(f'<rect x="{212+(i%3)*22}" y="{112-(i//3)*10}" width="20" height="9" fill="#ea580c" stroke="#9a3412"/>' for i in range(6))+'</g>',
  DOC(110,86,92,50,'คำพิพากษา',[('ขอ 300,000','#64748b'),('ได้ 220,000','#15803d')],'#c2410c'), FLOOR('#7c2d12',.07), DUST(9,315,'#fff',.5), vignette('jc1'), FG('l','#7c2d12',.25)]+person('M',318,'#c2410c','#d8a882','calm'))
o+=P('jcdesk','[ภาพประกอบนิทาน บ่ายที่ห้องทำงาน โทนฟ้าเทา] ตาชั่งค่าฤชาธรรมเนียม เหรียญสองกอง',
 [bg('jc2','#e0f2fe','#f1f5f9','#7a8a9a'), JSCALE(240,88,-6,'#0369a1','ร้าน','จำเลย'), coins(150,118), STICKER(150,90,'ตามส่วน','#0369a1',16),
  FLOOR('#0c4a6e',.07), vignette('jc2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('jcoffice','[ภาพประกอบนิทาน เย็นที่ร้าน โทนเขียวมะนาว] จำเลยร่วมสองคน แบ่งเท่าๆ กัน เพนกวินตุ๊กตา',
 [bg('jc3','#ecfccb','#f0fdf4','#8aa87a'), PENGUIN(250,110,.65), CROWD(130,96,2,'#65a30d'), CHIP(20,136,'คนละครึ่ง','#4d7c0f'),
  FLOOR('#365314',.06), vignette('jc3')]+person('M',292,'#65a30d','#d8a882','happy'))
open('/home/claude/work/s315.js','w').write(o)
