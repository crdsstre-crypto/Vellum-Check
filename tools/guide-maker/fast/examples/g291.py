import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('grgarage','[ภาพประกอบนิทาน เช้าในอู่ซ่อมรถ โทนส้มน้ำมัน] รถกระบะยกบนแม่แรง ใบแจ้งหนี้ค่าซ่อม ป้ายยึดหน่วง แมวลายบนยาง',
 [bg('gr1','#ffedd5','#f5f5f4','#a88a6a'), usedcar(230,140) if False else pickup(230,140), toolrack(120,90), cat(170,140,'#a8a29e',.5),
  HANGTAG(196,104,'ยึดหน่วง','#f97316'), FLOOR('#7c2d12',.08), DUST(9,291,'#fff',.5), vignette('gr1'), FG('l','#7c2d12',.3)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('grlot','[ภาพประกอบนิทาน บ่ายลานจอดรถอู่ โทนฟ้าเทา] เจ้าพนักงานติดป้ายยึด ซองเอกสารบังคับคดี หนังสือแจ้งสิทธิ',
 [bg('gr2','#e0f2fe','#f1f5f9','#7a8a9a',wall_tex=False), pickup(240,140), seizetag(256,104), ENVFLY(130,120,220,96,2,'#0369a1'),
  DOC(104,92,84,44,'แจ้งสิทธิ',[('ค่าซ่อม 68,000','#0369a1')],'#0369a1'), FLOOR('#0f172a',.08), vignette('gr2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('grcourt','[ภาพประกอบนิทาน เช้าหน้าห้องศาล โทนม่วงชมพู] นาฬิกาทราย คำสั่งงดบังคับคดี ป้ายดำเนินต่อ เม่นที่กระถางต้นไม้',
 [bg('gr3','#fae8ff','#fce7f3','#9a7aa8'), plant(70), HEDGEHOG(100,138,.7), hourglass(240,110,'#a21caf'),
  STEPS(130,100,['งด','ครบเวลา','ศาลสั่งต่อ'],2,'#a21caf'), FLOOR('#701a75',.06), vignette('gr3')]+person('M',292,'#a21caf','#d8a882','calm'))
open('/home/claude/work/s291.js','w').write(o)
