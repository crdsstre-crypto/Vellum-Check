import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cslaundry','[ภาพประกอบนิทาน เช้าในร้านซักรีด โทนฟ้าน้ำแข็ง] เครื่องซักผ้า ราวผ้าแขวน หมายนัดไกล่เกลี่ย',
 [bg('cs1','#e0f2fe','#ecfeff','#7aa0a8'), ''.join(f'<g transform="translate({214+i*44} 122)"><rect x="-18" y="-22" width="36" height="44" rx="4" fill="#f8fafc" stroke="#94a3b8"/><circle cy="4" r="11" fill="#bae6fd" stroke="#64748b" stroke-width="2"/></g>' for i in range(2)),
  '<path d="M110 76h80" stroke="#64748b" stroke-width="2"/>'+''.join(f'<path d="M{118+i*22} 76l-8 22h16z" fill="{c}"/>' for i,c in enumerate(['#f9a8d4','#a5b4fc','#fde68a','#86efac'])), DAYRING(150,120,'7','วัน',.5,'#0284c7',14),
  FLOOR('#0c4a6e',.07), DUST(9,430,'#fff',.5), vignette('cs1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('csroom','[ภาพประกอบนิทาน บ่ายห้องไกล่เกลี่ย โทนเขียวเสจ] โต๊ะกลม เก้าอี้ 2 ตัวสำหรับคนที่ไว้ใจ นาฬิกา 30 วัน',
 [bg('cs2','#ecfccb','#f0fdf4','#8a9a6a'), '<g transform="translate(240 128)"><ellipse rx="46" ry="12" fill="#a16207"/><path d="M0 12v18" stroke="#78350f" stroke-width="5"/></g>'+''.join(f'<g transform="translate({x} 124)"><rect x="-8" y="-20" width="16" height="22" rx="3" fill="#65a30d"/><path d="M-8 2v12M8 2v12" stroke="#3f6212" stroke-width="2"/></g>' for x in (180,300)), DAYRING(150,96,'30','วัน',.3,'#4d7c0f',16), CHIP(240,92,'+2 คนไว้ใจ','#4d7c0f'),
  FLOOR('#365314',.07), vignette('cs2')]+person('W',60,'#4d7c0f','#e8b896','worried'))
o+=P('csoffice','[ภาพประกอบนิทาน เย็นที่โรงพัก โทนม่วงชมพู] ประตูทางออก ป้ายถอนตัวได้ กระต่ายตุ๊กตา',
 [bg('cs3','#fae8ff','#fdf4ff','#9a7aa8'), '<g transform="translate(250 112)"><rect x="-22" y="-42" width="44" height="68" rx="3" fill="#a21caf"/><circle cx="14" cy="-8" r="2.5" fill="#fde68a"/><rect x="-16" y="-54" width="32" height="10" rx="2" fill="#16a34a"/><text y="-46" text-anchor="middle" font-size="6.5" font-weight="900" fill="#fff">EXIT</text></g>', RABBIT(92,126,.65),
  CHIP(150,96,'ถอนตัวได้ทุกเมื่อ','#86198f'), FLOOR('#701a75',.06), vignette('cs3')]+person('M',292,'#a21caf','#d8a882','happy'))
open('/home/claude/work/s430.js','w').write(o)
