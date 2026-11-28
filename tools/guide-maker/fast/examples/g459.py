import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fccoffee','[ภาพประกอบนิทาน เช้าในร้านกาแฟเครือข่าย โทนน้ำตาลครีม] เครื่องชง วงกลมหุ้น 45% เกณฑ์ 49%',
 [bg('fc1','#fef3c7','#f5f5f4','#a8987a'), '<g transform="translate(260 120)"><rect x="-24" y="-24" width="48" height="38" rx="4" fill="#475569"/><rect x="-16" y="-16" width="32" height="10" rx="2" fill="#94a3b8"/><path d="M-4 14v6h8v-6" fill="#78350f"/></g>', PIEHOLD(150,96,45,'#0369a1'),
  FLOOR('#78350f',.08), DUST(9,459,'#fff',.5), vignette('fc1'), FG('l','#78350f',.25)]+person('W',318,'#92400e','#e8b896','calm'))
o+=P('fcgroup','[ภาพประกอบนิทาน บ่ายห้องประชุมผู้ถือหุ้น โทนน้ำเงินคราม] ผังบริษัทแม่-ลูก ลูกโลก',
 [bg('fc2','#e0e7ff','#dbeafe','#7a8aa8'), '<g transform="translate(240 100)"><rect x="-24" y="-30" width="48" height="18" rx="3" fill="#dc2626"/><text y="-18" text-anchor="middle" font-size="7" font-weight="900" fill="#fff">บริษัทแม่ (ต่างด้าว)</text><path d="M0 -12v14" stroke="#1e293b" stroke-width="2"/><rect x="-24" y="2" width="48" height="18" rx="3" fill="#fca5a5"/><text y="14" text-anchor="middle" font-size="7" font-weight="900" fill="#7f1d1d">บริษัทลูก = ต่างด้าว</text></g>', GLOBEPIN(130,102,'#3730a3'),
  FLOOR('#1e1b4b',.07), vignette('fc2')]+person('M',60,'#3730a3','#d8a882','worried'))
o+=P('fcoffice','[ภาพประกอบนิทาน เย็นในออฟฟิศ โทนเขียวพาสเทล] วงกลมหุ้นหลังเพิ่มทุน 55% ลูกวัวตุ๊กตา',
 [bg('fc3','#dcfce7','#f0fdf4','#7aa88a'), PIEHOLD(244,98,55,'#dc2626'), CALF(92,124,.7),
  FLOOR('#14532d',.06), vignette('fc3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s459.js','w').write(o)
