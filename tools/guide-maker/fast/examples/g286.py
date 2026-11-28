import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bmparts','[ภาพประกอบนิทาน เช้าในร้านอะไหล่รถ โทนส้มทราย] ชั้นอะไหล่ จดหมายบินไปเจ้าพนักงาน หมายค้นโกดัง',
 [bg('bm1','#ffedd5','#fef9c3','#a88a6a'), toolrack(250,100) if False else shelf(240,146), wheel(200,130) if False else '', ENVFLY(140,128,250,112,3,'#ea580c'),
  DAYRING(110,96,'6','เดือน',.5,'#ea580c',20), FLOOR('#7c2d12',.07), DUST(9,286,'#fff',.5), vignette('bm1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','worried'))
o+=P('bmcourtroom','[ภาพประกอบนิทาน บ่ายในศาล โทนน้ำเงินขรึม] แฟ้มคดีค้าง ป้ายงดพิจารณา มติเจ้าหนี้ 7 วัน',
 [bg('bm2','#dbeafe','#e0e7ff','#6a7aa8'), desk(220,132,110,'#1e3a8a'), filestack(250,110), pausesign(200,96) if False else SEAL(200,104,'งดคดี','#1d4ed8'),
  DOC(104,92,86,50,'คดีค้าง',[('เจ้าพนักงานเข้าว่า','#1d4ed8'),('มติ ร้องใน 7 วัน','#334155')],'#1d4ed8'),
  FLOOR('#172554',.08), vignette('bm2')]+person('W',60,'#1d4ed8','#e8b896','calm'))
o+=P('bmhearing','[ภาพประกอบนิทาน สายๆ ห้องไต่สวน โทนเขียวมะกอกอ่อน] ไมค์ให้การ บันทึกถ้อยคำ กระรอกบนกิ่งนอกหน้าต่าง',
 [bg('bm3','#ecfccb','#fefce8','#8a9a6a'), window(60,40), SQUIRREL(82,80,.75), witnessmic(140,120) if False else '', desk(160,132,90,'#4d7c0f'),
  DOC(120,92,84,40,'บันทึกถ้อยคำ',[('อ่านทวนแล้วลงชื่อ','#4d7c0f')],'#4d7c0f'), FLOOR('#365314',.06), vignette('bm3')]+person('M',292,'#65a30d','#d8a882','calm'))
open('/home/claude/work/s286.js','w').write(o)
