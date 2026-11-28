import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cptyre','[ภาพประกอบนิทาน เช้าในร้านยางรถยนต์ โทนเทาส้ม] กองยาง เจ้าหน้าที่ส่งหมาย ซองลงทะเบียนตอบรับ',
 [bg('cp1','#f5f5f4','#ffedd5','#9a8a7a'), ''.join(f'<g transform="translate({220+i*26} 128)"><circle r="14" fill="#1f2937"/><circle r="6" fill="#9ca3af"/></g>' for i in range(3)), courtenvelope(150,108), STICKER(176,86,'ลงทะเบียน','#ea580c',18),
  FLOOR('#44403c',.08), DUST(9,313,'#fff',.5), vignette('cp1'), FG('l','#44403c',.3)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('cpcounter','[ภาพประกอบนิทาน บ่ายที่เคาน์เตอร์ร้าน โทนฟ้าพาสเทล] ลูกจ้างเซ็นรับหมาย ป้ายอายุเกิน 20 เพนกวินตุ๊กตาถือซอง',
 [bg('cp2','#e0f2fe','#f0f9ff','#7a9aa8'), courtcounter(240,146,110), PENGUIN(250,110,.7), CHIP(150,96,'อายุเกิน 20 รับแทนได้','#0284c7'),
  FLOOR('#0c4a6e',.07), vignette('cp2')]+person('W',60,'#0284c7','#e8b896','worried'))
o+=P('cpshutter','[ภาพประกอบนิทาน เย็นหน้าร้านที่ปิด โทนม่วงเย็น] ประตูม้วนปิด หมายปิดไว้ วงนับ 15 วัน',
 [bg('cp3','#ede9fe','#e0e7ff','#8a7aa8',wall_tex=False), '<g transform="translate(240 70)"><rect x="-46" y="0" width="92" height="76" fill="#cbd5e1"/>'+''.join(f'<path d="M-46 {6+i*7}h92" stroke="#94a3b8"/>' for i in range(10))+'<rect x="-10" y="22" width="20" height="26" fill="#fff" stroke="#dc2626"/></g>', DAYRING(140,104,'15','วัน',.6,'#7c3aed'),
  FLOOR('#4c1d95',.06), vignette('cp3')]+person('M',292,'#7c3aed','#d8a882','calm'))
open('/home/claude/work/s313.js','w').write(o)
