import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('pvstudio','[ภาพประกอบนิทาน เช้าในสตูดิโอออกแบบภายใน โทนฟ้าครีม] ลูกโลก หนังสือฟ้องจากต่างประเทศ เงินประกันวางศาล',
 [bg('pv1','#e0f2fe','#fef9c3','#7a9aa8'), globe(230,104), desk(230,132,110,'#0369a1'), cash(150,118), SEAL(150,88,'วางประกัน','#0369a1'),
  FLOOR('#0c4a6e',.07), DUST(9,299,'#fff',.5), vignette('pv1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0369a1','#d8a882','calm'))
o+=P('pvbank','[ภาพประกอบนิทาน บ่ายในธนาคาร โทนชมพูเทา] บัญชีถูกล็อก กุญแจ รถตู้ห้ามโอน',
 [bg('pv2','#fce7f3','#f1f5f9','#9a7a8a'), courtcounter(240,146,110), padlock(250,96), bankbook(210,118), van(150,140) if False else '',
  DOC(104,88,84,44,'คำขอแก้คำสั่ง',[('ปล่อย 180,000','#be185d')],'#be185d'), FLOOR('#831843',.07), vignette('pv2')]+person('W',60,'#be185d','#e8b896','worried'))
o+=P('pvcourt','[ภาพประกอบนิทาน เย็นหน้าศาล โทนเขียวอ่อน] ชนะคดี วงนับ 7 วัน ปลดล็อก',
 [bg('pv3','#dcfce7','#fefce8','#7aa88a',wall_tex=False), COURTHOUSE(250,132), DAYRING(140,104,'7','วัน',.85,'#16a34a'), PANDA(92,138,.55),
  FLOOR('#14532d',.06), vignette('pv3')]+person('M',292,'#16a34a','#d8a882','happy'))
open('/home/claude/work/s299.js','w').write(o)
