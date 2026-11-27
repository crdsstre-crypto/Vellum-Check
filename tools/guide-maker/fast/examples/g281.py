import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bkshowroom','[ภาพประกอบนิทาน สายๆ ในโชว์รูมเฟอร์นิเจอร์ไม้ โทนน้ำตาลอ่อน] โต๊ะไม้สัก ป้ายยึดทรัพย์ ตู้นิรภัยเปิด ดวงตรา สมุดบัญชี',
 [bg('bk1','#fef3c7','#fde68a','#a8865a'), teaktable(220,146), seizetag(232,110), lockedcabinet(120,146), ledger(150,96), stamp(180,100,'#7c2d12'),
  FLOOR('#78350f',.08), DUST(9,281,'#fff',.5), vignette('bk1'), FG('l','#78350f',.3)]+person('M',318,'#a16207','#d8a882','worried'))
o+=P('bkofficeq','[ภาพประกอบนิทาน เช้าที่สำนักงานบังคับคดี โทนครามอ่อน] นาฬิกาทราย 24 ชม. แบบพิมพ์คำชี้แจง 7 วัน หอยทากบนกระถาง',
 [bg('bk2','#e0e7ff','#f5f3ff','#7a7aa8'), hourglass(270,110,'#6366f1'), plant(250,146,.8), snail(256,120) if False else '',
  STEPS(110,98,['24 ชม.','7 วัน','ประชุม'],0,'#4f46e5'), DOC(110,112,84,40,'คำชี้แจง',[('หนี้สิน ทรัพย์สิน','#334155')],'#4f46e5'),
  FLOOR('#312e81',.07), vignette('bk2')]+person('W',60,'#4f46e5','#e8b896','calm'))
o+=P('bkhall','[ภาพประกอบนิทาน บ่ายห้องประชุมเจ้าหนี้ โทนเขียวหยก] แถวเก้าอี้ บัตรลงคะแนน หนังสือพิมพ์ประกาศ 7 วัน',
 [bg('bk3','#d1fae5','#ecfeff','#6aa89a'), chairs3(220,146), gazette(110,110), VOTE(232,104,3,1,'#059669'), newspaper(150,124) if False else '',
  CHIP(30,100,'ประกาศ 7 วัน','#059669'), FLOOR('#064e3b',.07), vignette('bk3')]+person('M',292,'#059669','#d8a882','happy'))
open('/home/claude/work/s281.js','w').write(o)
