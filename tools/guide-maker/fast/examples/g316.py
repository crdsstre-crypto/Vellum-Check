import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('adaircon','[ภาพประกอบนิทาน เช้าในร้านซ่อมแอร์ โทนฟ้าน้ำ] แอร์ ฝ้ามีคราบรั่ว ป้ายไม่เกิน 5 หมื่น',
 [bg('ad1','#cffafe','#e0f2fe','#6aa8b8'), aircon(150,84), '<g opacity=".5"><ellipse cx="230" cy="96" rx="22" ry="8" fill="#94a3b8"/><path d="M230 104v10M226 112l4 6l4-6" stroke="#38bdf8" stroke-width="2"/></g>', CHIP(110,132,'≤ 50,000 บาท','#0e7490'),
  FLOOR('#164e63',.07), DUST(9,316,'#fff',.5), vignette('ad1'), FG('l','#164e63',.25)]+person('M',318,'#0e7490','#d8a882','calm'))
o+=P('adcourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนม่วงคราม] บันไดสู่ศาลอุทธรณ์ วงนับ 1 เดือน',
 [bg('ad2','#e0e7ff','#ede9fe','#7a7aa8'), STAIRS(190,140,['ชั้นต้น','อุทธรณ์','ฎีกา'],'#4f46e5'), DAYRING(130,100,'1','เดือน',.5,'#4f46e5'),
  FLOOR('#1e1b4b',.07), vignette('ad2')]+person('W',60,'#4f46e5','#e8b896','worried'))
o+=P('adoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานบังคับคดี โทนส้มพีช] เงินประกัน แม่กุญแจ ป้ายขอทุเลา เพนกวินตุ๊กตา',
 [bg('ad3','#ffedd5','#fef3c7','#a8846a'), courtcounter(230,146,100), PENGUIN(256,112,.6), cash(140,112), padlock(176,98),
  FLOOR('#7c2d12',.06), vignette('ad3')]+person('M',292,'#ea580c','#d8a882','calm'))
open('/home/claude/work/s316.js','w').write(o)
