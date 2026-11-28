import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lscafe','[ภาพประกอบนิทาน เช้าในร้านกาแฟสวน โทนเขียวมิ้นต์] เคาน์เตอร์กาแฟ ประกาศสำรวจติดบอร์ด',
 [bg('ls1','#d1fae5','#ecfccb','#7aa88a'), '<g transform="translate(240 120)"><rect x="-40" y="-6" width="80" height="30" rx="3" fill="#92400e"/><rect x="-30" y="-28" width="18" height="22" rx="3" fill="#475569"/><path d="M10 -14h12v8h-12z" fill="#fff"/><path d="M22 -12q6 0 4 5" stroke="#fff" fill="none"/></g>',
  DOC(116,84,80,48,'ประกาศสำรวจ',[('ล่วงหน้า 15 วัน','#15803d')],'#0f766e'), FLOOR('#134e4a',.07), DUST(9,427,'#fff',.5), vignette('ls1'), FG('l','#134e4a',.25)]+person('W',318,'#0d9488','#e8b896','calm'))
o+=P('lsgarden','[ภาพประกอบนิทาน บ่ายในสวนหลังร้าน โทนเหลืองแดด] โต๊ะลูกค้า ล้อวัดระยะ บัตรพนักงานสำรวจ',
 [bg('ls2','#fef9c3','#dcfce7','#a89a6a',wall_tex=False), TABLE(250,146,70,2,'#a16207'), WHEEL(200,128,'#0f766e'), '<g transform="translate(140 100) rotate(-8)"><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#fff" stroke="#0369a1" stroke-width="2"/><rect x="-14" y="-8" width="10" height="12" fill="#bfdbfe"/><path d="M0 -6h14M0 0h10" stroke="#0369a1" stroke-width="2"/></g>',
  FLOOR('#3f6212',.07), vignette('ls2')]+person('M',60,'#65a30d','#d8a882','worried'))
o+=P('lsdesk','[ภาพประกอบนิทาน เย็นที่สำนักงานเขต โทนฟ้าพาสเทล] บัญชีรายการที่ดิน ช่องรกร้างขีดแก้ กระต่ายตุ๊กตา',
 [bg('ls3','#e0f2fe','#f0f9ff','#7a9aa8'), desk(240,134,100,'#0369a1'), RABBIT(240,104,.75), DOC(110,84,96,50,'บัญชีรายการ',[('รกร้าง → ที่นั่งลูกค้า','#dc2626')],'#0284c7'),
  FLOOR('#0c4a6e',.06), vignette('ls3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s427.js','w').write(o)
