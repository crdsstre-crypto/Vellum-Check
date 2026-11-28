import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bprooms','[ภาพประกอบนิทาน เช้าที่ไซต์ห้องเช่า โทนครีมฟ้า] แบบบันไดหนีไฟถูกวงแก้ เครน รายการคำนวณวิศวกร',
 [bg('bp1','#fef9c3','#e0f2fe','#a89a7a',wall_tex=False), CRANE(250,146,.8,'#0ea5e9'), blueprint(140,100,60,44), ZOOM(180,96,'แก้'), squirrel_ if False else '',
  FLOOR('#78350f',.07), DUST(9,290,'#fff',.5), vignette('bp1'), FG('l','#78350f',.25)]+person('W',318,'#0ea5e9','#e8b896','calm'))
o+=P('bpsite','[ภาพประกอบนิทาน บ่ายหน้าห้องเช่า 4 ชั้น โทนแดงอิฐ] ชั้นเกินแบบ ป้ายโทษสองเท่า กรวย',
 [bg('bp2','#fee2e2','#fef3c7','#a87a6a',wall_tex=False), '<g transform="translate(240 60)"><rect x="-34" y="0" width="68" height="86" fill="#fecaca" stroke="#b91c1c" stroke-width="2"/>'+''.join(f'<rect x="{-26+i*20}" y="{8+j*20}" width="12" height="10" fill="#fff"/>' for i in range(3) for j in range(4))+'<rect x="-34" y="-20" width="68" height="20" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/></g>',
  DOUBLE(150,92), cone(140), FLOOR('#7f1d1d',.08), vignette('bp2')]+person('M',60,'#b91c1c','#d8a882','worried'))
o+=P('bpoffice','[ภาพประกอบนิทาน ค่ำที่สำนักงาน โทนเขียวหยก] แฟ้มหลักฐาน หนังสือสั่งหยุดงาน แชตทักท้วง',
 [bg('bp3','#ccfbf1','#ecfeff','#6aa89a'), desk(230,134,100,'#0f766e'), filestack(250,112), CHAT(110,96,['สร้างตามแบบเท่านั้น','รับทราบครับ'],'#0f766e') if False else '',
  STEPS(120,100,['สัญญา','หนังสือหยุด','แชต'],1,'#0f766e'), FLOOR('#134e4a',.06), vignette('bp3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s290.js','w').write(o)
