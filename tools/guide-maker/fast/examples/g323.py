import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('frroof','[ภาพประกอบนิทาน เช้าที่ร้านวัสดุมุงหลังคา โทนแดงอิฐ] แผ่นหลังคาซ้อน สัญญายอมความ โหลเงินคืน',
 [bg('fr1','#fee2e2','#fef3c7','#a87a6a'), '<g>'+''.join(f'<path d="M{210+i*6} {120-i*8}l60 0l-6 10h-60z" fill="#dc2626" opacity="{.6+i*.1:.1f}"/>' for i in range(4))+'</g>', FEEJAR(140,108,'คืน','#16a34a'),
  FLOOR('#7f1d1d',.07), DUST(9,323,'#fff',.5), vignette('fr1'), FG('l','#7f1d1d',.25)]+person('M',318,'#b91c1c','#d8a882','calm'))
o+=P('frcourt','[ภาพประกอบนิทาน บ่ายที่สำนักงานบังคับคดี โทนฟ้าเทา] ใบรับค่าบังคับคดี รถเจ้าพนักงาน',
 [bg('fr2','#e0f2fe','#f1f5f9','#7a8a9a'), courtcounter(240,146,110), receipt(250,112), van(150,140) if False else '<g transform="translate(150 118)"><rect x="-24" y="-14" width="48" height="22" rx="4" fill="#94a3b8"/><rect x="10" y="-10" width="12" height="8" fill="#e0f2fe"/><circle cx="-12" cy="10" r="5" fill="#334155"/><circle cx="12" cy="10" r="5" fill="#334155"/></g>',
  CHIP(150,86,'ค่าพาหนะ ค่าป่วยการ','#0369a1'), FLOOR('#0c4a6e',.07), vignette('fr2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('frhelp','[ภาพประกอบนิทาน เช้าที่ศาล โทนม่วงอ่อน] ตาชั่งยกเว้นค่าธรรมเนียม บีเวอร์บนม้านั่ง',
 [bg('fr3','#ede9fe','#f5f3ff','#8a7aa8'), JSCALE(240,90,6,'#6d28d9','ยกเว้น','มีเงิน'), BEAVER(96,130,.6),
  FLOOR('#2e1065',.06), vignette('fr3')]+person('M',292,'#6d28d9','#d8a882','calm'))
open('/home/claude/work/s323.js','w').write(o)
