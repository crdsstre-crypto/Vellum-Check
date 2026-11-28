import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bdmeet','[ภาพประกอบนิทาน เช้าในห้องประชุมเจ้าหนี้ โทนพีชครีม] กระดานคำถาม 4 ข้อ ไมค์',
 [bg('d1','#ffedd5','#fef9c3','#9a8a6a',wall_tex=False), '<g transform="translate(236 98)"><rect x="-46" y="-36" width="92" height="66" rx="4" fill="#fff" stroke="#ea580c" stroke-width="2"/>'+''.join(f'<circle cx="-34" cy="{-22+i*14}" r="4" fill="#ea580c"/><text x="-34" y="{-19.5+i*14}" font-size="6" font-weight="900" text-anchor="middle" fill="#fff">{i+1}</text><rect x="-24" y="{-24+i*14}" width="{58-(i%2)*14}" height="4" rx="2" fill="#fdba74"/>' for i in range(4))+'</g>',
  '<g transform="translate(150 110)"><rect x="-4" y="-16" width="8" height="18" rx="4" fill="#475569"/><path d="M0 2v14M-8 16h16" stroke="#475569" stroke-width="2"/></g>', FLOOR('#7c2d12',.06), DUST(8,475,'#fff',.5), vignette('d1')]+person('W',318,'#ea580c','#e8b896','star'))
o+=P('bdgate','[ภาพประกอบนิทาน บ่ายที่ด่านตรวจคนเข้าเมือง โทนน้ำเงินแดง] หมายจับ วง 6 เดือน',
 [bg('d2','#dbeafe','#fee2e2','#7a7a9a'), PASSPORT(150,104,'#7f1d1d'), DOC(236,78,84,42,'หมายจับ',[('ขังไม่เกิน 6 เดือน','#dc2626')],'#dc2626'),
  DAYRING(286,128,'6','เดือน',.5,'#1d4ed8',16), FLOOR('#1e3a8a',.07), vignette('d2')]+person('M',60,'#1d4ed8','#d8a882','alert'))
o+=P('bdacct','[ภาพประกอบนิทาน เย็นที่สำนักงานพิทักษ์ทรัพย์ โทนเขียวพาสเทล] สมุดบัญชีรับจ่าย ปฏิทิน 6 เดือน แพนด้า',
 [bg('d3','#dcfce7','#ecfccb','#7a9a7a'), desk(240,134,100,'#15803d'), LEDGERBOOK(240,100) if 'LEDGERBOOK' in dir() else DOC(210,82,80,40,'บัญชีรับจ่าย',[],'#22c55e'), PANDA(98,122,.74),
  CHIP(170,86,'ทุก 6 เดือน','#15803d'), FLOOR('#14532d',.06), vignette('d3')]+person('W',292,'#16a34a','#e8b896','calm'))
open('/home/claude/work/s475.js','w').write(o)
