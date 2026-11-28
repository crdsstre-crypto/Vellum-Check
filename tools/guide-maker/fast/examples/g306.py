import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lsplot','[ภาพประกอบนิทาน เช้าที่ดินริมถนน โทนเขียวทุ่ง] ที่ดินแบ่ง 4 แปลง หมุดสีแดง ต้นไม้',
 [bg('ls1','#dcfce7','#fefce8','#8aa87a',wall_tex=False), PLOTS(150,76,110,52,4,'#15803d'), tree(110), landdeed(280,118) if False else '',
  FLOOR('#14532d',.07), DUST(9,306,'#fff',.5), vignette('ls1'), FG('l','#14532d',.25)]+person('W',318,'#15803d','#e8b896','calm'))
o+=P('lsfield','[ภาพประกอบนิทาน สายๆ ในทุ่ง โทนฟ้าสด] กล้องรังวัด ธงแนวเขต ประกาศ 15 วัน',
 [bg('ls2','#e0f2fe','#fefce8','#7aa0a8',wall_tex=False), TRIPOD(240,146), '<g transform="translate(290 110)"><path d="M0 36v-36" stroke="#78716c" stroke-width="2"/><path d="M0 0h16l-4 5l4 5h-16z" fill="#dc2626"/></g>', noticeboard(150,100),
  STICKER(194,84,'15 วัน','#0284c7',16), FLOOR('#0c4a6e',.06), vignette('ls2')]+person('M',60,'#0284c7','#d8a882','worried'))
o+=P('lsoffice','[ภาพประกอบนิทาน เช้าสำนักงานที่ดิน โทนครีมส้ม] โฉนดสองฉบับตรงกัน เพื่อนบ้านลงชื่อ จิ้งจอกตุ๊กตาบนเคาน์เตอร์',
 [bg('ls3','#ffedd5','#fef9c3','#a8946a'), courtcounter(230,146,110), FOX(256,118,.55), landdeed(140,104), landdeed(176,112),
  CHIP(100,134,'2 ฉบับตรงกัน','#c2410c'), FLOOR('#7c2d12',.06), vignette('ls3')]+person('W',292,'#ea580c','#e8b896','happy'))
open('/home/claude/work/s306.js','w').write(o)
