import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fzsilk','[ภาพประกอบนิทาน เช้าหลังไฟไหม้ตลาด โทนเทาควัน] ห้องแถวไหม้เกรียม ม้วนผ้าไหมที่รอด',
 [bg('fz1','#f5f5f4','#fee2e2','#8a8078',wall_tex=False), BURNT(250,128,3), '<g transform="translate(140 122)">'+''.join(f'<rect x="{-20+i*12}" y="-12" width="10" height="24" rx="5" fill="{c}"/>' for i,c in enumerate(['#db2777','#7c3aed','#0891b2','#ca8a04']))+'</g>',
  FLOOR('#292524',.1), DUST(9,442,'#d6d3d1',.5), vignette('fz1'), FG('l','#292524',.3)]+person('W',318,'#db2777','#e8b896','worried'))
o+=P('fzruins','[ภาพประกอบนิทาน บ่ายที่เขตเพลิงไหม้ โทนส้มเตือน] ป้ายประกาศเขตเพลิงไหม้ กรวยกั้น วงนับ 45 วัน',
 [bg('fz2','#ffedd5','#fef3c7','#a8846a',wall_tex=False), DOC(220,84,80,50,'เขตเพลิงไหม้',[('ห้ามก่อสร้าง','#dc2626'),('45 วัน','#dc2626')],'#ea580c'), ''.join(f'<path d="M{184+i*22} 150l7 -22l7 22z" fill="#f97316" stroke="#fff"/>' for i in range(3)), DAYRING(140,98,'45','วัน',.3,'#c2410c',18),
  FLOOR('#7c2d12',.08), vignette('fz2')]+person('M',60,'#ea580c','#d8a882','worried'))
o+=P('fzoffice','[ภาพประกอบนิทาน เย็นที่ร้านชั่วคราว โทนเขียวอ่อน] หลังคาผ้าใบชั่วคราว แผงขายผ้า ลูกแกะตุ๊กตา',
 [bg('fz3','#dcfce7','#f0fdf4','#7aa88a',wall_tex=False), '<g transform="translate(240 120)"><path d="M-44 -24h88l-8 -14h-72z" fill="#38bdf8"/><path d="M-40 -24v44M40 -24v44" stroke="#475569" stroke-width="3"/><rect x="-36" y="4" width="72" height="12" fill="#a16207"/></g>', LAMB(92,124,.7),
  CHIP(150,90,'ซ่อมเท่าที่จำเป็น','#15803d'), FLOOR('#14532d',.06), vignette('fz3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s442.js','w').write(o)
