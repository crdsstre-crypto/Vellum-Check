import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rgfire','[ภาพประกอบนิทาน เช้าที่ทางเดินหอพัก โทนแดงครีม] ถังดับเพลิง กล่องยา ป้ายทางหนีไฟ',
 [bg('g1','#fee2e2','#fef3c7','#a87a6a',wall_tex=False), FIREKIT(232,112), '<g transform="translate(150 78)"><rect x="-26" y="-10" width="52" height="20" rx="3" fill="#16a34a"/><text y="4" font-size="7" font-weight="900" text-anchor="middle" fill="#fff">ทางหนีไฟ →</text></g>',
  CHIP(140,120,'หน้าที่ร่วม','#b91c1c'), FLOOR('#7f1d1d',.06), DUST(7,480,'#fff',.5), vignette('g1')]+person('W',318,'#dc2626','#e8b896','focus'))
o+=P('rgdesk','[ภาพประกอบนิทาน บ่ายที่เคาน์เตอร์หอพัก โทนฟ้าน้ำเงิน] สมุดทะเบียนผู้พัก วง 7 วัน',
 [bg('g2','#dbeafe','#e0f2fe','#7a8aa8'), DOC(234,80,92,48,'ทะเบียนผู้พัก',[('ชื่อ อายุ เพศ','#1d4ed8'),('ผู้ปกครอง','#1d4ed8')],'#2563eb'), DAYRING(140,100,'7','วัน',.5,'#1d4ed8',20),
  FLOOR('#1e3a8a',.07), vignette('g2')]+person('M',60,'#1d4ed8','#d8a882','shock'))
o+=P('rghall','[ภาพประกอบนิทาน ค่ำที่ทางเดินหอ โทนม่วงคราม] ประตูห้อง โน้ตดนตรีลอย โทรโข่ง แพนด้า',
 [bg('g3','#ede9fe','#e0e7ff','#7a7aa8'), '<g transform="translate(244 98)"><rect x="-20" y="-36" width="40" height="66" rx="2" fill="#a78bfa" stroke="#6d28d9" stroke-width="2"/><circle cx="12" cy="0" r="2.5" fill="#fde68a"/><rect x="-8" y="-28" width="16" height="8" rx="1" fill="#fff"/><text y="-22" font-size="6" font-weight="900" text-anchor="middle" fill="#6d28d9">208</text></g>'+''.join(f'<text x="{272+i*10}" y="{70-i*8}" font-size="12" fill="#7c3aed">♪</text>' for i in range(3)), PANDA(96,122,.72),
  CHIP(170,86,'คนนอกต้องอนุญาต','#6d28d9'), FLOOR('#2e1065',.07), vignette('g3')]+person('W',292,'#7c3aed','#e8b896','calm'))
open('/home/claude/work/s480.js','w').write(o)
