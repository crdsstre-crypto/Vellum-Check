import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('chbakery','[ภาพประกอบนิทาน เช้าในร้านเบเกอรี่ชั้นล่างคอนโด โทนครีมชมพู] ตู้ขนม พวงหรีดเล็ก หนังสือแจ้งมรดก',
 [bg('ch1','#fce7f3','#fef3c7','#a87a8a'), CONDO(278,138,5,'#be185d'), pastrytray(206,122), DOC(110,86,80,44,'แจ้งมรดก',[('ภายใน 60 วัน','#be185d')],'#db2777'),
  FLOOR('#831843',.07), DUST(9,462,'#fff',.5), vignette('ch1'), FG('l','#831843',.25)]+person('M',318,'#db2777','#d8a882','worried'))
o+=P('chpassport','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนน้ำเงินคราม] หนังสือเดินทางสองเล่ม วงนับ 180 วัน',
 [bg('ch2','#e0e7ff','#dbeafe','#7a8aa8'), courtcounter(240,146,110), ''.join(f'<g transform="translate({236+i*26} {106-i*6}) rotate({-8+i*14})"><rect x="-11" y="-15" width="22" height="30" rx="2" fill="{c}"/><circle r="5" fill="none" stroke="#fde68a" stroke-width="1.5"/></g>' for i,c in enumerate(['#1e3a8a','#7f1d1d'])), DAYRING(140,98,'180','วัน',.5,'#3730a3',18),
  FLOOR('#1e1b4b',.07), vignette('ch2')]+person('W',60,'#3730a3','#e8b896','calm'))
o+=P('choffice','[ภาพประกอบนิทาน เย็นในร้าน โทนเขียวพาสเทล] ไทม์ไลน์ 60 วัน 1 ปี ฮิปโปตุ๊กตา',
 [bg('ch3','#dcfce7','#f0fdf4','#7aa88a'), STEPS(196,96,['ได้ห้อง','+60 วัน','+1 ปี'],1,'#15803d'), HIPPO(92,124,.7),
  FLOOR('#14532d',.06), vignette('ch3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s462.js','w').write(o)
