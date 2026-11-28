import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('mhvet','[ภาพประกอบนิทาน เช้าในร้านขายยาสัตว์ โทนม่วงอ่อน] ทางลาดหน้าร้านชำรุด ชั้นอาหารสัตว์',
 [bg('mh1','#ede9fe','#fae8ff','#8a7aa8',wall_tex=False), '<g transform="translate(244 136)"><path d="M-44 12l80 -24h10v24z" fill="#a8a29e"/><path d="M-10 0l8 -4l4 6l6 -4" stroke="#44403c" stroke-width="2" fill="none"/></g>', '<g transform="translate(150 104)">'+''.join(f'<rect x="{-24+i*16}" y="-14" width="12" height="20" rx="2" fill="{c}"/>' for i,c in enumerate(['#f97316','#22c55e','#3b82f6','#eab308']))+'</g>',
  FLOOR('#2e1065',.07), DUST(9,455,'#fff',.5), vignette('mh1'), FG('l','#2e1065',.25)]+person('W',318,'#7c3aed','#e8b896','worried'))
o+=P('mhmeeting','[ภาพประกอบนิทาน บ่ายประชุมใหญ่เจ้าของร่วม โทนส้มพีช] กล่องลงคะแนน 1/4 ค้อนประธาน',
 [bg('mh2','#ffedd5','#fff7ed','#a88a6a'), '<g transform="translate(244 112)"><rect x="-22" y="-14" width="44" height="34" rx="3" fill="#c2410c"/><rect x="-12" y="-18" width="24" height="5" fill="#7c2d12"/><path d="M-6 -24h12v10h-12z" fill="#fff"/><text y="10" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">1/4</text></g>', SEAL(140,100,'ถอดถอน','#dc2626',w=56),
  FLOOR('#7c2d12',.07), vignette('mh2')]+person('M',60,'#ea580c','#d8a882','calm'))
o+=P('mhoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานที่ดิน โทนฟ้าพาสเทล] สัญญาจ้างผู้จัดการใหม่ วงนับ 30 วัน ลูกหมูตุ๊กตา',
 [bg('mh3','#e0f2fe','#f0f9ff','#7a9aa8'), desk(240,134,100,'#0369a1'), DOC(214,82,72,44,'สัญญาจ้าง',[('จดใน 30 วัน','#0369a1')],'#0284c7'), PIGLET(92,124,.7),
  FLOOR('#0c4a6e',.06), vignette('mh3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s455.js','w').write(o)
