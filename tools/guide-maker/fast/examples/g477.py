import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rvland','[ภาพประกอบนิทาน เช้าที่สำนักงานบังคับคดี โทนเขียวครีม] โฉนดรอขายทอดตลาด ปากกาไม่ถูกจับ',
 [bg('v1','#ecfccb','#fef9c3','#8a9a6a',wall_tex=False), DOC(232,80,90,46,'โฉนดรอขายทอดตลาด',[('รอลูกหนี้ลงนาม','#dc2626')],'#65a30d'), CHIP(140,100,'ปลดแล้วยังต้องช่วย','#4d7c0f'),
  FLOOR('#365314',.06), DUST(7,477,'#fff',.5), vignette('v1')]+person('W',318,'#65a30d','#e8b896','inspect'))
o+=P('rvbook','[ภาพประกอบนิทาน บ่ายที่ร้านเครื่องมือช่าง โทนส้มเทา] บัญชีรายปีว่างเปล่า ปฏิทินปี',
 [bg('v2','#ffedd5','#e2e8f0','#9a8a7a'), DOC(232,80,86,44,'บัญชีรับทรัพย์รายปี',[('ยังไม่ส่ง','#dc2626')],'#ea580c'), DAYRING(140,104,'1','ปี',.9,'#ea580c',18),
  SEAL(270,130,'ม.80','#c2410c',10,40), FLOOR('#7c2d12',.07), vignette('v2')]+person('M',60,'#ea580c','#d8a882','firm'))
o+=P('rvnews','[ภาพประกอบนิทาน เย็นในร้าน โทนฟ้าม่วง] หนังสือพิมพ์ประกาศเพิกถอนการปลด นกฮูก',
 [bg('v3','#e0e7ff','#e0f2fe','#7a7aa8'), desk(240,134,100,'#4338ca'), '<g transform="translate(244 96) rotate(-4)"><rect x="-40" y="-24" width="80" height="48" rx="2" fill="#f8fafc" stroke="#64748b"/><rect x="-34" y="-18" width="68" height="9" fill="#4338ca"/><text y="-11" font-size="6.5" font-weight="900" text-anchor="middle" fill="#fff">ประกาศเพิกถอนการปลด</text>'+''.join(f'<rect x="-34" y="{-4+i*7}" width="{68-(i%2)*20}" height="3" rx="1.5" fill="#cbd5e1"/>' for i in range(4))+'</g>', OWL(96,122,.75),
  CHIP(170,86,'ยื่นหนี้หลังปลด','#4338ca'), FLOOR('#312e81',.06), vignette('v3')]+person('W',292,'#4f46e5','#e8b896','inspect'))
open('/home/claude/work/s477.js','w').write(o)
