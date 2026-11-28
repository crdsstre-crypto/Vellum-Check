import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ipnight','[ภาพประกอบนิทาน ค่ำหน้าร้านชานม โทนม่วงคราม] ดวงจันทร์ นาฬิกาสองทุ่ม ป้ายขึ้น→ตก',
 [bg('i1','#ede9fe','#e0e7ff','#6a6a9a',wall_tex=False), '<g transform="translate(290 66)"><circle r="12" fill="#fde68a"/><circle cx="5" cy="-3" r="10" fill="#ede9fe"/></g><g transform="translate(236 104)"><circle r="22" fill="#fff" stroke="#4338ca" stroke-width="3"/><path d="M0 0v-14M0 0l-10 4" stroke="#4338ca" stroke-width="3"/><text y="34" font-size="7" font-weight="900" text-anchor="middle" fill="#4338ca">20:00</text></g>',
  CHIP(140,96,'ตรวจได้ ขึ้น→ตก','#4338ca'), FLOOR('#312e81',.07), DUST(7,483,'#fff',.5), vignette('i1')]+person('W',318,'#4f46e5','#e8b896','inspect'))
o+=P('ipdoor','[ภาพประกอบนิทาน บ่ายหน้าตึก โทนแดงชมพู] ป้ายหอพักถูกปลด ใบปรับ 50,000',
 [bg('i2','#fee2e2','#fce7f3','#a87a7a'), '<g transform="translate(150 84) rotate(12)"><rect x="-30" y="-9" width="60" height="18" rx="3" fill="#94a3b8"/><text y="4" font-size="7" font-weight="900" text-anchor="middle" fill="#fff">หอพักนักศึกษา</text><path d="M-32 -11l64 22" stroke="#dc2626" stroke-width="3"/></g>', FINESLIP(246,100,'50,000'),
  CHIP(150,124,'+วันละ 5,000','#b91c1c'), FLOOR('#7f1d1d',.07), vignette('i2')]+person('M',60,'#dc2626','#d8a882','alert'))
o+=P('ipcard','[ภาพประกอบนิทาน เย็นที่เคาน์เตอร์ร้าน โทนเหลืองเขียว] บัตรเจ้าหน้าที่ แฟ้มเอกสาร โคอาลา',
 [bg('i3','#fef9c3','#ecfccb','#8a9a6a'), desk(240,134,100,'#4d7c0f'), '<g transform="translate(244 96) rotate(-6)"><rect x="-26" y="-16" width="52" height="32" rx="4" fill="#fff" stroke="#4d7c0f" stroke-width="2"/><circle cx="-12" cy="-2" r="7" fill="#d9f99d"/><rect x="0" y="-8" width="20" height="3" fill="#4d7c0f"/><rect x="0" y="-1" width="14" height="3" fill="#a3e635"/><rect x="-22" y="9" width="44" height="3" fill="#4d7c0f"/></g>', TURTLE(96,124,.72),
  CHIP(164,86,'แสดงบัตรทุกครั้ง','#4d7c0f'), FLOOR('#365314',.06), vignette('i3')]+person('W',292,'#65a30d','#e8b896','calm'))
open('/home/claude/work/s483.js','w').write(o)
