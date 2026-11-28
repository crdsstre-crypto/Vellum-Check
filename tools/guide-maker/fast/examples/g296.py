import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('drstartup','[ภาพประกอบนิทาน เช้าในออฟฟิศสตาร์ตอัป โทนม่วงฟ้า] โน้ตบุ๊ก มือถือสแกนหน้า ป้ายพระราชกฤษฎีกา ต้นไม้',
 [bg('dr1','#e0e7ff','#e0f2fe','#7a8aa8'), desk(220,134,110,'#4338ca'), laptop(210,116), FACESCAN(262,104), plant(120),
  ZOOM(160,80,'พรฎ.?'), FLOOR('#1e1b4b',.07), DUST(9,296,'#fff',.5), vignette('dr1'), FG('l','#1e1b4b',.25)]+person('W',318,'#4f46e5','#e8b896','calm'))
o+=P('droffice','[ภาพประกอบนิทาน บ่ายที่หน่วยงานกำกับ โทนส้มทราย] ใบรับคำขอ วงนับ 30 วัน เจ้าหน้าที่ถือบัตร',
 [bg('dr2','#ffedd5','#fef3c7','#a8846a'), courtcounter(240,146,110), idcard(250,110), DAYRING(140,104,'30','วัน',.65,'#ea580c'),
  HANGTAG(200,96,'ใบรับคำขอ','#fdba74'), FLOOR('#7c2d12',.07), vignette('dr2')]+person('M',60,'#ea580c','#d8a882','worried'))
o+=P('drcounter','[ภาพประกอบนิทาน เย็นที่เคาน์เตอร์ร้านค้า โทนเขียวพาสเทล] ลูกค้าสแกนหน้าผ่านแอป ติ๊กยืนยันแล้ว นากตุ๊กตาข้างเครื่องคิดเงิน',
 [bg('dr3','#dcfce7','#f0fdf4','#7aa88a'), courtcounter(220,146,110), register(250,118), FACESCAN(120,100,'#16a34a'), OTTER(66,140,.6),
  FLOOR('#14532d',.06), vignette('dr3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s296.js','w').write(o)
