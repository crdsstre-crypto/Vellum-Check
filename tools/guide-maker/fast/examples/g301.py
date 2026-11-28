import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('canoodle','[ภาพประกอบนิทาน เช้าในร้านก๋วยเตี๋ยว โทนส้มอบอุ่น] มือถือแอปสั่งอาหาร ค่าธรรมเนียมเกิน กลุ่มร้านค้า',
 [bg('ca1','#ffedd5','#fef3c7','#a8846a'), hotpot(240,124), steam(240,100), bigphone(150,104) if False else FACESCAN(150,104,'#ea580c') if False else '<g transform="translate(150 104)"><rect x="-16" y="-28" width="32" height="56" rx="6" fill="#1e293b"/><rect x="-13" y="-23" width="26" height="44" rx="3" fill="#fff7ed"/><text y="-4" text-anchor="middle" font-size="7" font-weight="900" fill="#dc2626">ค่าธรรมเนียม</text><text y="8" text-anchor="middle" font-size="9" font-weight="900" fill="#dc2626">+8%</text></g>',
  CROWD(196,72,5,'#f97316'), FLOOR('#7c2d12',.07), DUST(9,301,'#fff',.5), vignette('ca1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('cacourt','[ภาพประกอบนิทาน บ่ายหน้าศาล โทนน้ำเงินเทา] อาคารศาล แฟ้มคำร้องแบบกลุ่ม ค่าขึ้นศาลเฉพาะโจทก์',
 [bg('ca2','#e0e7ff','#f1f5f9','#7a8aa8',wall_tex=False), COURTHOUSE(250,132), DOC(104,90,90,48,'คำร้องแบบกลุ่ม',[('400 ร้าน','#4338ca'),('วิธีคำนวณ ✓','#15803d')],'#4338ca'),
  FLOOR('#1e1b4b',.07), vignette('ca2')]+person('W',60,'#4338ca','#e8b896','calm'))
o+=P('caoffice','[ภาพประกอบนิทาน เย็นที่ห้องประชุมกลุ่มร้านค้า โทนเขียวมะนาว] กองกลางค่าใช้จ่าย วงนับ 7 วัน แพนด้าบนชั้น',
 [bg('ca3','#ecfccb','#f0fdf4','#8aa87a'), TABLE(240,146,90,3,'#4d7c0f'), PANDA(84,90,.6), DAYRING(150,104,'7','วัน',.6,'#65a30d'), MONEYFLOW(190,100,240,112,3,'#16a34a'),
  FLOOR('#365314',.06), vignette('ca3')]+person('W',292,'#65a30d','#e8b896','happy'))
open('/home/claude/work/s301.js','w').write(o)
