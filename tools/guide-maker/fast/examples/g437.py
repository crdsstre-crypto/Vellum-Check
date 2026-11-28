import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wrrice','[ภาพประกอบนิทาน เช้าในคลังสินค้า โทนครีมทราย] กองกระสอบข้าว ใบรับคลังสินค้าสลักหลัง',
 [bg('wr1','#fef3c7','#f5f5f4','#a8987a'), SACKS(244,132,6,'#fafaf9','ข้าว'), DOC(110,86,80,46,'ใบรับคลังสินค้า',[('สลักหลัง → ลูกค้า','#15803d')],'#a16207'),
  FLOOR('#57534e',.08), DUST(9,437,'#fff',.5), vignette('wr1'), FG('l','#57534e',.3)]+person('M',318,'#a16207','#d8a882','calm'))
o+=P('wrlost','[ภาพประกอบนิทาน บ่ายในออฟฟิศที่กำลังย้าย โทนฟ้าเทา] กล่องลังเกลื่อน แว่นขยายหาใบรับ',
 [bg('wr2','#e0f2fe','#f1f5f9','#7a8a9a'), ''.join(f'<rect x="{214+i*28}" y="{124-(i%2)*18}" width="26" height="22" rx="2" fill="#d6a77a" stroke="#92400e"/>' for i in range(4)), '<g transform="translate(150 104)"><circle r="14" fill="#e0f2fe" fill-opacity=".6" stroke="#334155" stroke-width="3"/><path d="M10 10l12 12" stroke="#334155" stroke-width="4"/><text y="4" text-anchor="middle" font-size="12" font-weight="900" fill="#dc2626">?</text></g>',
  FLOOR('#334155',.07), vignette('wr2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('wroffice','[ภาพประกอบนิทาน เย็นที่สำนักงานคลังสินค้า โทนเขียวพาสเทล] ใบรับฉบับใหม่ ต้นขั้ว ลูกเป็ดตุ๊กตา',
 [bg('wr3','#dcfce7','#f0fdf4','#7aa88a'), desk(240,134,100,'#15803d'), DOC(214,82,72,44,'ฉบับใหม่',[('จดในต้นขั้ว ✓','#15803d')],'#16a34a'), DUCK(92,124,.7),
  FLOOR('#14532d',.06), vignette('wr3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s437.js','w').write(o)
