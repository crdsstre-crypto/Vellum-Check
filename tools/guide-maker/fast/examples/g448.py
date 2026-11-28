import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cacafe','[ภาพประกอบนิทาน เช้าในคาเฟ่ชั้นล่างคอนโด โทนครีมกาแฟ] เครื่องชงกาแฟ ใบแจ้งค่าส่วนกลาง',
 [bg('cc4','#fef3c7','#f5f5f4','#a8987a'), '<g transform="translate(240 116)"><rect x="-26" y="-26" width="52" height="40" rx="4" fill="#475569"/><rect x="-18" y="-18" width="36" height="10" rx="2" fill="#94a3b8"/><path d="M-6 14v6h12v-6" fill="#78350f"/><path d="M-4 -4v10M4 -4v10" stroke="#e5e7eb" stroke-width="2"/></g>', receipt(140,110),
  FLOOR('#78350f',.08), DUST(9,448,'#fff',.5), vignette('cc4'), FG('l','#78350f',.25)]+person('M',318,'#92400e','#d8a882','calm'))
o+=P('caoffice2','[ภาพประกอบนิทาน บ่ายที่สำนักงานนิติบุคคล โทนเขียวหยก] สมุดงบดุล วงนับ 7 วัน',
 [bg('cc5','#ccfbf1','#f0fdfa','#6aa89a'), LEDGERBOOK(244,104,'#0f766e'), DAYRING(140,98,'7','วัน',.6,'#0f766e',18),
  FLOOR('#134e4a',.07), vignette('cc5')]+person('W',60,'#0d9488','#e8b896','worried'))
o+=P('caparking','[ภาพประกอบนิทาน เย็นที่ลานจอดส่วนกลาง โทนส้มพีช] รถคนนอกจอดทับ ป้ายส่วนกลาง ลูกแมวตุ๊กตา',
 [bg('cc6','#ffedd5','#fff7ed','#a88a6a',wall_tex=False), '<g transform="translate(244 126)"><rect x="-32" y="-14" width="64" height="20" rx="6" fill="#64748b"/><path d="M-22 -14l8 -10h28l8 10" fill="#94a3b8"/><circle cx="-18" cy="8" r="6" fill="#1e293b"/><circle cx="18" cy="8" r="6" fill="#1e293b"/></g>', CHIP(244,92,'ส่วนกลาง','#c2410c'), KITTEN(92,126,.7),
  FLOOR('#7c2d12',.06), vignette('cc6')]+person('M',292,'#ea580c','#d8a882','happy'))
open('/home/claude/work/s448.js','w').write(o)
