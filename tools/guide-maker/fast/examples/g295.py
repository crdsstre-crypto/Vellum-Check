import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ttbakery','[ภาพประกอบนิทาน เช้าในร้านเบเกอรี่ โทนครีมน้ำตาล] ขนมเปี๊ยะ ขนมปัง ป้ายแบรนด์คล้าย หนังสือยินยอม',
 [bg('tt1','#fef3c7','#ffedd5','#a8926a'), pastrytray(230,120), desk(230,134,110,'#92400e'), signedletter(130,104) if False else '',
  DOC(110,84,84,44,'หนังสือยินยอม',[('จากผู้รับโอนทุกราย','#15803d')],'#a16207'),
  FLOOR('#78350f',.07), DUST(9,295,'#fff',.5), vignette('tt1'), FG('l','#78350f',.25)]+person('M',318,'#a16207','#d8a882','calm'))
o+=P('ttoffice','[ภาพประกอบนิทาน บ่ายที่กรมทรัพย์สินทางปัญญา โทนฟ้าเย็น] หนังสือแจ้งแก้คำขอโอน วงนับ 60 วัน',
 [bg('tt2','#e0f2fe','#f0f9ff','#7a9aa8'), courtcounter(240,146,110), DAYRING(140,106,'60','วัน',.4,'#0284c7'), transferslip(220,112) if False else courtenvelope(230,118),
  FLOOR('#0c4a6e',.07), vignette('tt2')]+person('W',60,'#0284c7','#e8b896','worried'))
o+=P('ttassoc','[ภาพประกอบนิทาน เช้าที่สำนักงานสมาคม โทนเขียวมิ้นต์] ตราเครื่องหมายรับรอง ห้ามใช้กับของตัวเอง นากบนโต๊ะ',
 [bg('tt3','#ccfbf1','#ecfccb','#6aa89a'), desk(220,134,100,'#0f766e'), OTTER(250,118,.65), sealbadge(140,104) if False else SEAL(140,104,'รับรอง','#0f766e'),
  CHIP(196,98,'ห้ามใช้กับของตัวเอง','#dc2626'), FLOOR('#134e4a',.06), vignette('tt3')]+person('M',292,'#0d9488','#d8a882','calm'))
open('/home/claude/work/s295.js','w').write(o)
