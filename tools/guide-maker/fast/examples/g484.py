import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fnwallet','[ภาพประกอบนิทาน เช้าที่ร้านถ่ายเอกสาร โทนฟ้าครีม] ถุงเงินสองใบ ป้าย ≤1 เดือน ≤3 เดือน',
 [bg('n1','#dbeafe','#fef9c3','#7a8aa8',wall_tex=False), '<g transform="translate(220 108)"><path d="M-18 -6q-6 22 18 26q24 -4 18 -26z" fill="#fcd34d" stroke="#b45309" stroke-width="2"/><path d="M-10 -10h20l-4 -6h-12z" fill="#fcd34d" stroke="#b45309"/><text y="10" font-size="8" font-weight="900" text-anchor="middle" fill="#92400e">≤1</text></g><g transform="translate(276 112)"><path d="M-18 -6q-6 22 18 26q24 -4 18 -26z" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><path d="M-10 -10h20l-4 -6h-12z" fill="#bfdbfe" stroke="#1d4ed8"/><text y="10" font-size="8" font-weight="900" text-anchor="middle" fill="#1d4ed8">≤3</text></g>',
  CHIP(140,92,'ประกัน/ล่วงหน้า','#1d4ed8'), FLOOR('#1e3a8a',.06), DUST(7,484,'#fff',.5), vignette('n1')]+person('W',318,'#2563eb','#e8b896','firm'))
o+=P('fnmale','[ภาพประกอบนิทาน บ่ายหน้าหอพักหญิง โทนชมพูม่วง] ตึกหอหญิง ป้ายห้ามรับต่างเพศ',
 [bg('n2','#fce7f3','#f3e8ff','#9a7a9a'), DORMBLDG(236,116,'#ec4899','หอพักหญิง','ถ่ายเอกสาร'), SEAL(140,96,'รับผิดประเภท','#be185d',-10,64),
  FLOOR('#831843',.07), vignette('n2')]+person('M',60,'#be185d','#d8a882','shock'))
o+=P('fnoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานอัยการ โทนเขียวพีช] ตาชั่ง วง 15 วัน ลูกแมว',
 [bg('n3','#dcfce7','#ffedd5','#8a9a7a'), desk(240,134,100,'#15803d'), JSCALE(240,96,4,'#15803d','ปรับ','เลิกคดี'), DAYRING(160,88,'15','วัน',.5,'#15803d',16), KITTEN(96,124,.72),
  FLOOR('#14532d',.06), vignette('n3')]+person('W',292,'#16a34a','#e8b896','relief'))
open('/home/claude/work/s484.js','w').write(o)
