import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cnfashion','[ภาพประกอบนิทาน เช้าในโชว์รูมเสื้อผ้าในคอนโด โทนม่วงชมพู] ราวเสื้อ วงกลมหุ้นต่างชาติ 60%',
 [bg('cn1','#fae8ff','#fce7f3','#9a7aa8'), '<g transform="translate(250 110)"><path d="M-40 -30h80" stroke="#64748b" stroke-width="3"/>'+''.join(f'<path d="M{-32+i*16} -30l-7 26h14z" fill="{c}"/>' for i,c in enumerate(['#f472b6','#a78bfa','#60a5fa','#fbbf24','#34d399']))+'</g>', PIEHOLD(140,96,60,'#a21caf'),
  FLOOR('#701a75',.07), DUST(9,463,'#fff',.5), vignette('cn1'), FG('l','#701a75',.25)]+person('M',318,'#a21caf','#d8a882','worried'))
o+=P('cnnominee','[ภาพประกอบนิทาน บ่ายที่สำนักงานทนาย โทนแดงอิฐ] หนังสือกรรมสิทธิ์ห้องชุดชื่อพนักงาน ป้ายจำคุก 2 ปี',
 [bg('cn2','#fee2e2','#fef2f2','#a87a7a'), AWARD(244,98,'ห้องชุด','#b91c1c'), SEAL(140,100,'จำคุก ≤ 2 ปี','#dc2626',w=66),
  FLOOR('#7f1d1d',.07), vignette('cn2')]+person('W',60,'#b91c1c','#e8b896','worried'))
o+=P('cnoffice','[ภาพประกอบนิทาน เย็นในออฟฟิศ โทนฟ้าใส] ลูกโลก หนังสือแจ้งเปลี่ยนสภาพ ฮิปโปตุ๊กตา',
 [bg('cn3','#e0f2fe','#f0f9ff','#7a9aa8'), GLOBEPIN(250,98,'#0369a1'), DOC(150,92,74,40,'แจ้งเปลี่ยนสภาพ',[('ภายใน 60 วัน','#0369a1')],'#0284c7'), HIPPO(92,126,.7),
  FLOOR('#0c4a6e',.06), vignette('cn3')]+person('M',292,'#0284c7','#d8a882','happy'))
open('/home/claude/work/s463.js','w').write(o)
