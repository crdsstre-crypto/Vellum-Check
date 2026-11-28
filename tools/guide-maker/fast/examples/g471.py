import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bemart','[ภาพประกอบนิทาน เช้าหน้ามินิมาร์ทที่ปิด โทนฟ้าหม่น] ป้ายปิดร้าน ดอกไม้ วง 1 ปี',
 [bg('be1','#e0f2fe','#f1f5f9','#7a8a9a',wall_tex=False), '<g transform="translate(232 100)"><rect x="-40" y="-30" width="80" height="56" rx="2" fill="#f8fafc" stroke="#94a3b8"/><path d="M-40 -30h80v10h-80z" fill="#60a5fa"/><rect x="-18" y="-6" width="36" height="14" rx="2" fill="#fff" stroke="#64748b"/><text x="0" y="4" font-size="7" font-weight="900" text-anchor="middle" fill="#475569">ปิด</text></g>',
  DAYRING(140,96,'1','ปี',.33,'#2563eb',18), '<g transform="translate(286 132)"><path d="M0 0v-14" stroke="#16a34a" stroke-width="2"/><circle cy="-17" r="5" fill="#fde68a"/><circle cy="-17" r="2" fill="#f59e0b"/></g>',
  FLOOR('#1e293b',.06), DUST(7,471,'#fff',.4), vignette('be1')]+person('W',318,'#3b82f6','#e8b896','think'))
o+=P('beheir','[ภาพประกอบนิทาน บ่ายในศาล โทนส้มอิฐ] ทายาทส่ายหน้า หมายเรียก ศาลไต่สวน',
 [bg('be2','#ffedd5','#fef3c7','#a8846a'), DOC(222,78,88,44,'หมายเรียกทายาท',[('แก้คดีแทน','#c2410c')],'#ea580c'),
  CHIP(140,96,'ศาลไต่สวน','#c2410c'), SEAL(252,130,'ม.83','#c2410c',10,44), FLOOR('#7c2d12',.07), vignette('be2')]+person('M',60,'#c2410c','#d8a882','shock'))
o+=P('beoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานพิทักษ์ทรัพย์ โทนเขียวพีช] แฟ้มมรดก กล่องทรัพย์ที่เหลือคืน กบ',
 [bg('be3','#dcfce7','#ffedd5','#8a9a7a'), desk(240,134,100,'#15803d'), RABBIT(98,124,.72),
  DOC(210,82,80,40,'จัดการมรดก',[('เหลือ → คืน','#15803d')],'#22c55e'), CHIP(150,90,'คำชี้แจง ม.30','#15803d'), FLOOR('#14532d',.06), vignette('be3')]+person('W',292,'#16a34a','#e8b896','relief'))
open('/home/claude/work/s471.js','w').write(o)
