import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cmoptic','[ภาพประกอบนิทาน เช้าในร้านแว่นตา โทนฟ้าใส] ชั้นแว่น ป้ายห้อง 101 102 หนังสือแต่งตั้งตัวแทน',
 [bg('co1','#e0f2fe','#ecfeff','#7aa0a8'), ''.join(f'<g transform="translate({214+i*30} {108+(i%2)*20})"><circle cx="-6" r="5" fill="none" stroke="#1e293b" stroke-width="2"/><circle cx="6" r="5" fill="none" stroke="#1e293b" stroke-width="2"/><path d="M-1 0h2" stroke="#1e293b" stroke-width="2"/></g>' for i in range(4)), DOC(110,88,80,44,'แต่งตั้งตัวแทน',[('1 คน','#0369a1')],'#0284c7'),
  FLOOR('#0c4a6e',.07), DUST(9,454,'#fff',.5), vignette('co1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('cmboard','[ภาพประกอบนิทาน บ่ายห้องประชุมกรรมการ โทนแดงอิฐ] ป้ายต้องห้าม รายการคุณสมบัติ',
 [bg('co2','#fee2e2','#fef2f2','#a87a7a'), DOC(214,82,86,56,'ลักษณะต้องห้าม',[('✗ เคยทุจริต','#dc2626'),('✗ เคยจำคุก','#dc2626')],'#b91c1c'), CHIP(140,100,'เว้นประมาท/ลหุโทษ','#991b1b'),
  FLOOR('#7f1d1d',.07), vignette('co2')]+person('W',60,'#b91c1c','#e8b896','worried'))
o+=P('cmchair','[ภาพประกอบนิทาน เย็นห้องประชุม โทนเขียวหยก] โต๊ะกรรมการ ค้อนประธาน วงนับ 7 วัน ลูกหมูตุ๊กตา',
 [bg('co3','#ccfbf1','#f0fdfa','#6aa89a'), '<g transform="translate(244 128)"><rect x="-46" y="-8" width="92" height="12" rx="3" fill="#0f766e"/>'+''.join(f'<rect x="{-40+i*22}" y="-22" width="14" height="12" rx="2" fill="#5eead4"/>' for i in range(4))+'</g>', DAYRING(244,90,'7','วัน',.5,'#0f766e',16), PIGLET(92,124,.7),
  FLOOR('#134e4a',.06), vignette('co3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s454.js','w').write(o)
