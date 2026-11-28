import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('crmatyard','[ภาพประกอบนิทาน เช้าที่ร้านวัสดุก่อสร้าง โทนเทาอุ่น] กองปูน เหล็กเส้น ใบแจ้งหนี้ 1.8 ล้าน สัดส่วนหนี้ 1/4',
 [bg('cc1','#f5f5f4','#fef3c7','#9a8a7a'), sack(240,128) if False else ricesacks(250,146), '<g stroke="#64748b" stroke-width="3">'+''.join(f'<path d="M160 {120+i*4}h70"/>' for i in range(4))+'</g>', hen(120,146) if False else '',
  '<g transform="translate(130 82)"><circle r="18" fill="#e7e5e4"/><path d="M0 0v-18a18 18 0 0 1 18 18z" fill="#ea580c"/><text y="32" text-anchor="middle" font-size="9" font-weight="900" fill="#c2410c">≥ 1/4</text></g>',
  FLOOR('#44403c',.07), DUST(9,289,'#fff',.5), vignette('cc1'), FG('l','#44403c',.25)]+person('M',318,'#78716c','#d8a882','calm'))
o+=P('ccroom','[ภาพประกอบนิทาน บ่ายห้องประชุมเจ้าหนี้ โทนน้ำเงินเทา] โต๊ะประธาน รายงานการประชุม บัตรลงมติ',
 [bg('cc2','#e0e7ff','#f1f5f9','#7a8aa8'), TABLE(230,146,110,4,'#334155'), VOTE(240,96,3,2,'#4338ca'), minutebook(130,116) if False else ledger(130,110),
  RIBBON(170,84,'ประธาน','#4338ca'), FLOOR('#1e1b4b',.08), vignette('cc2')]+person('W',60,'#4338ca','#e8b896','calm'))
o+=P('ccoffice','[ภาพประกอบนิทาน เช้าที่ห้องทำงานร้าน โทนเขียวพีช] หนังสือแจ้ง 7 วัน กรรมการเหลือเกินครึ่ง เม่นบนโต๊ะ',
 [bg('cc3','#ecfccb','#ffedd5','#8a9a6a'), desk(220,134,100,'#4d7c0f'), HEDGEHOG(250,118,.75), calendar6(0,0) if False else '', DAYRING(130,112,'7','วัน',.6,'#65a30d'),
  FLOOR('#365314',.06), vignette('cc3')]+person('M',292,'#65a30d','#d8a882','happy'))
open('/home/claude/work/s289.js','w').write(o)
