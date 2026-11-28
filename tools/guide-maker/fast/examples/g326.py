import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('arfilter','[ภาพประกอบนิทาน เช้าในร้านเครื่องกรองน้ำ โทนฟ้าใส] เครื่องกรองน้ำ ซองสำเนาอุทธรณ์ วงนับ 15 วัน',
 [bg('ar1','#e0f2fe','#ecfeff','#7aa0a8'), '<g transform="translate(240 104)"><rect x="-14" y="-30" width="28" height="56" rx="8" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/><rect x="-8" y="-20" width="16" height="22" rx="4" fill="#bae6fd"/><path d="M14 -10h10v10" stroke="#64748b" stroke-width="3" fill="none"/></g>', courtenvelope(150,118), DAYRING(140,84,'15','วัน',.4,'#0284c7',16),
  FLOOR('#0c4a6e',.07), DUST(9,326,'#fff',.5), vignette('ar1'), FG('l','#0c4a6e',.25)]+person('W',318,'#0284c7','#e8b896','calm'))
o+=P('arcourt','[ภาพประกอบนิทาน บ่ายหน้าศาล โทนม่วงชมพู] คำสั่งไม่รับอุทธรณ์ ซองวางเงิน บันไดศาล',
 [bg('ar2','#fae8ff','#fce7f3','#9a7aa8',wall_tex=False), STAIRS(190,140,['ชั้นต้น','อุทธรณ์'],'#a21caf'), SEAL(140,96,'ไม่รับอุทธรณ์','#dc2626',w=80), cash(260,112),
  FLOOR('#701a75',.07), vignette('ar2')]+person('M',60,'#a21caf','#d8a882','worried'))
o+=P('aroffice','[ภาพประกอบนิทาน เย็นที่ศาลอุทธรณ์ โทนเขียวหยก] สำนวนส่งกลับ ลูกศรวน บีเวอร์ตุ๊กตา',
 [bg('ar3','#ccfbf1','#ecfeff','#6aa89a'), COURTHOUSE(250,132), BEAVER(92,130,.6), '<g transform="translate(160 100)"><rect x="-16" y="-12" width="26" height="30" rx="2" fill="#fdba74"/><path d="M14 -16a20 20 0 1 1 -30 0" stroke="#0f766e" stroke-width="2.5" fill="none"/><path d="M-16 -16l2 8l6 -6z" fill="#0f766e"/></g>',
  FLOOR('#134e4a',.06), vignette('ar3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s326.js','w').write(o)
