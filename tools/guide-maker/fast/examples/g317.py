import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('nstable','[ภาพประกอบนิทาน เช้าข้างถนน โทนฟ้าครีม] รถกระบะเสียฝากระโปรงเปิด นาฬิกาเลยเวลานัด',
 [bg('ns1','#e0f2fe','#fef9c3','#7a9aa8',wall_tex=False), pickup(230,140), '<g opacity=".7"><path d="M260 98q4-10 0-18M268 98q4-10 0-18" stroke="#94a3b8" stroke-width="2" fill="none"/></g>', wallclock(150,74) if False else '<g transform="translate(150 84)"><circle r="16" fill="#fff" stroke="#0284c7" stroke-width="3"/><path d="M0 0v-10M0 0l8 4" stroke="#0f172a" stroke-width="2"/></g>',
  STICKER(170,116,'สาย!','#dc2626',14), FLOOR('#0c4a6e',.07), DUST(9,317,'#fff',.5), vignette('ns1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','worried'))
o+=P('nscourt','[ภาพประกอบนิทาน บ่ายในศาล โทนม่วงเทา] เก้าอี้จำเลยว่าง ตาชั่ง ป้ายต้องมีมูล',
 [bg('ns2','#ede9fe','#f1f5f9','#8a7aa8'), emptychair(250,146), JSCALE(170,88,0,'#6d28d9','มีมูล','ขาดนัด'),
  FLOOR('#2e1065',.07), vignette('ns2')]+person('W',60,'#6d28d9','#e8b896','calm'))
o+=P('nsoffice','[ภาพประกอบนิทาน เย็นที่ร้านเฟอร์นิเจอร์ โทนเหลืองไม้] ซองหมายนัดใหม่ แรคคูนตุ๊กตาบนโต๊ะ',
 [bg('ns3','#fef3c7','#ffedd5','#a8926a'), desk(230,134,100,'#92400e'), RACCOON(250,112,.65), ENVFLY(110,120,200,104,2,'#b45309'),
  FLOOR('#78350f',.06), vignette('ns3')]+person('M',292,'#b45309','#d8a882','happy'))
open('/home/claude/work/s317.js','w').write(o)
