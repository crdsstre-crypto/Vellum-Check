import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('aefruit','[ภาพประกอบนิทาน เช้าในโกดังผลไม้อบแห้ง โทนส้มมะม่วง] ลังผลไม้ส่งออก หมายศาลขอบังคับ',
 [bg('ae1','#ffedd5','#fef9c3','#a88a6a'), ''.join(f'<g transform="translate({214+i*30} {130-(i%2)*24})"><rect x="-14" y="-12" width="28" height="22" rx="2" fill="#d97706"/><path d="M-14 -4h28" stroke="#92400e"/><circle cx="-4" cy="2" r="3" fill="#fbbf24"/><circle cx="4" cy="3" r="3" fill="#f97316"/></g>' for i in range(4)), courtenvelope(140,110),
  FLOOR('#7c2d12',.07), DUST(9,433,'#fff',.5), vignette('ae1'), FG('l','#7c2d12',.25)]+person('W',318,'#ea580c','#e8b896','worried'))
o+=P('aecourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนชมพูกุหลาบ] คำชี้ขาดต่างประเทศ ส่วนนอกขอบเขตถูกตัดออก',
 [bg('ae2','#ffe4e6','#fdf2f8','#a87a8a'), AWARD(240,104,'AWARD','#be123c'), '<path d="M212 116h56" stroke="#be123c" stroke-width="2" stroke-dasharray="4 3"/><path d="M266 112l8 8M274 112l-8 8" stroke="#dc2626" stroke-width="2.5"/>', CHIP(150,96,'นอกขอบเขต','#be123c'),
  FLOOR('#881337',.07), vignette('ae2')]+person('M',60,'#be123c','#d8a882','calm'))
o+=P('aeoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานทนาย โทนฟ้าน้ำทะเล] ลูกโลก ตาชั่งความสงบเรียบร้อย เต่าตุ๊กตา',
 [bg('ae3','#cffafe','#ecfeff','#6aa0a8'), '<g transform="translate(240 104)"><circle r="20" fill="#7dd3fc" stroke="#0369a1" stroke-width="2"/><path d="M-20 0h40M0 -20q12 20 0 40M0 -20q-12 20 0 40" stroke="#0369a1" fill="none"/><path d="M0 20v12M-12 32h24" stroke="#475569" stroke-width="3"/></g>', TURTLE(92,128,.65),
  CHIP(150,90,'ความสงบเรียบร้อย','#0e7490'), FLOOR('#164e63',.06), vignette('ae3')]+person('W',292,'#0891b2','#e8b896','happy'))
open('/home/claude/work/s433.js','w').write(o)
