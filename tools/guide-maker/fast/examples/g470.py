import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bkcourt','[ภาพประกอบนิทาน เช้าหน้าศาลอุทธรณ์ โทนครีมทอง] อาคารศาล บันได 5 ขั้น',
 [bg('ba1','#fef9c3','#fef3c7','#9a8a6a',wall_tex=False), COURTHOUSE(244,104,.9,'#a16207'), STEPS(150,140,['1','2','3','4','5'],2,'#ca8a04',18),
  FLOOR('#713f12',.06), DUST(8,470,'#fff',.5), vignette('ba1')]+person('W',318,'#a16207','#e8b896','think'))
o+=P('bkdesk','[ภาพประกอบนิทาน บ่ายในสำนักงานทนาย โทนชมพูแดง] คำสั่งไม่รับอุทธรณ์ วง 15 วัน',
 [bg('ba2','#ffe4e6','#fee2e2','#a87a7a'), DAYRING(246,88,'15','วัน',.6,'#e11d48',20), DOC(130,80,84,42,'ไม่รับอุทธรณ์',[('ต้องห้าม ม.25','#be123c')],'#e11d48'),
  SEAL(250,128,'ขออนุญาต','#be123c',-8,58), FLOOR('#881337',.07), vignette('ba2')]+person('M',60,'#e11d48','#d8a882','shock'))
o+=P('bksupreme','[ภาพประกอบนิทาน เย็นในห้องพิจารณา โทนน้ำเงินม่วง] ค้อนศาล ตาชั่ง กบตุ๊กตา',
 [bg('ba3','#e0e7ff','#ede9fe','#7a7aa8'), desk(240,134,100,'#4338ca'), JSCALE(244,96,6,'#4338ca','อาญา','แพ่ง'), HIPPO(98,124,.7),
  FLOOR('#312e81',.06), vignette('ba3')]+person('W',292,'#4f46e5','#e8b896','relief'))
open('/home/claude/work/s470.js','w').write(o)
