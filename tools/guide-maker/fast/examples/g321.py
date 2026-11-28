import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sptea','[ภาพประกอบนิทาน เช้าในร้านชานมแฟรนไชส์ โทนน้ำตาลนม] แก้วชานม สัญญาแฟรนไชส์ ค่าปรับ 1.2 ล้าน',
 [bg('sp1','#fef3c7','#ffedd5','#a8926a'), desk(230,134,110,'#92400e'), bobacup(210,112), bobacup(240,114), DOC(110,86,92,48,'สัญญาแฟรนไชส์',[('ค่าปรับ 1.2 ล้าน','#dc2626')],'#92400e'),
  FLOOR('#78350f',.07), DUST(9,321,'#fff',.5), vignette('sp1'), FG('l','#78350f',.25)]+person('M',318,'#b45309','#d8a882','calm'))
o+=P('spcourt','[ภาพประกอบนิทาน บ่ายหน้าศาลฎีกา โทนครามขาว] บันไดสามชั้น ศาลสูงสุด ป้ายปัญหาสำคัญ',
 [bg('sp2','#e0e7ff','#f8fafc','#7a7aa8',wall_tex=False), STAIRS(170,140,['ชั้นต้น','อุทธรณ์','ฎีกา'],'#3730a3'), COURTHOUSE(290,80,.55),
  CHIP(130,90,'ปัญหาสำคัญ?','#3730a3'), FLOOR('#1e1b4b',.07), vignette('sp2')]+person('W',60,'#3730a3','#e8b896','worried'))
o+=P('spoffice','[ภาพประกอบนิทาน เย็นห้องทำงาน โทนเขียวหยก] คำร้องขออนุญาตฎีกา วงนับ 1 เดือน แรคคูนตุ๊กตา',
 [bg('sp3','#ccfbf1','#ecfeff','#6aa89a'), RACCOON(84,100,.65), desk(230,134,100,'#0f766e'), SCROLL(240,110,'ขออนุญาตฎีกา','#0f766e',56), DAYRING(150,114,'1','เดือน',.4,'#0f766e',18),
  FLOOR('#134e4a',.06), vignette('sp3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s321.js','w').write(o)
