import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fbmango','[ภาพประกอบนิทาน เช้าในสวนมะม่วง โทนเหลืองเขียว] ลังมะม่วงเกรด A สัญญาขาดช่อง วง 30 วัน',
 [bg('fb1','#fef9c3','#dcfce7','#8a9a6a',wall_tex=False), MANGOCRATE(240,128), DAYRING(250,80,'30','วัน',.5,'#ca8a04',18),
  DOC(124,80,84,42,'สัญญารับซื้อ',[('ขาดรายละเอียด','#dc2626')],'#16a34a'), FLOOR('#365314',.06), DUST(7,467,'#fff',.5), vignette('fb1')]+person('W',318,'#16a34a','#e8b896','think'))
o+=P('fbsplit','[ภาพประกอบนิทาน บ่ายในห้องบัญชี โทนส้มแดง] สัญญาถูกตัดเป็นชิ้น ป้ายห้ามเลี่ยง',
 [bg('fb2','#ffedd5','#fee2e2','#a87a6a'), '<g transform="translate(240 100)">'+''.join(f'<rect x="{-36+i*25}" y="{-20+(i%2)*6}" width="20" height="30" rx="2" fill="#fff" stroke="#ea580c" transform="rotate({-8+i*8} {-26+i*25} 0)"/>' for i in range(3))+'<path d="M-44 -26l88 52M44 -26l-88 52" stroke="#dc2626" stroke-width="4" opacity=".8"/></g>',
  SEAL(132,96,'ห้ามแบ่งเลี่ยง','#dc2626',-10,70), FLOOR('#7c2d12',.07), vignette('fb2')]+person('M',60,'#ea580c','#d8a882','shock'))
o+=P('fboffice','[ภาพประกอบนิทาน เย็นในสำนักงานร้าน โทนฟ้าเขียวมิ้นต์] คู่มือวิธีใช้ปุ๋ย ร่มกันฝน กบตุ๊กตา',
 [bg('fb3','#ccfbf1','#e0f2fe','#6a9a9a'), desk(240,134,100,'#0f766e'), FROG(96,124,.75),
  DOC(206,84,84,40,'วิธีใช้ปุ๋ย',[('อบรม+ลงชื่อ','#0f766e')],'#14b8a6'), CHIP(150,92,'ร้านรับผิด','#0f766e'), FLOOR('#134e4a',.06), vignette('fb3')]+person('W',292,'#0d9488','#e8b896','relief'))
open('/home/claude/work/s467.js','w').write(o)
