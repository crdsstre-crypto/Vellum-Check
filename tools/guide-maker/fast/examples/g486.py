import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('awshield','[ภาพประกอบนิทาน เช้าที่ร้านกาแฟ โทนฟ้าครีม] โล่ประกันภัย ใบปรับ 300,000',
 [bg('w1','#e0f2fe','#fef3c7','#7a8a9a',wall_tex=False), '<g transform="translate(150 104)"><path d="M0 -24l20 8v12c0 14-10 22-20 26c-10-4-20-12-20-26v-12z" fill="#93c5fd" stroke="#1d4ed8" stroke-width="2"/><path d="M-8 -4l16 16M8 -4l-16 16" stroke="#dc2626" stroke-width="3"/></g>', FINESLIP(246,98,'300,000','#1d4ed8'),
  FLOOR('#1e3a8a',.06), DUST(7,486,'#fff',.5), vignette('w1')]+person('W',318,'#2563eb','#e8b896','focus'))
o+=P('awlate','[ภาพประกอบนิทาน บ่ายในห้องประชุมบริษัท โทนแดงเทา] ป้ายกรรมการ ทะเบียนส่งช้า',
 [bg('w2','#fee2e2','#f1f5f9','#9a7a7a'), DOC(236,80,88,44,'ทะเบียนผู้พัก',[('ส่งช้า','#dc2626')],'#64748b'), '<g transform="translate(146 104)"><rect x="-26" y="-10" width="52" height="20" rx="3" fill="#7f1d1d"/><text y="4" font-size="7" font-weight="900" text-anchor="middle" fill="#fff">กรรมการ</text></g>',
  SEAL(272,128,'ม.94','#b91c1c',10,40), FLOOR('#450a0a',.07), vignette('w2')]+person('M',60,'#b91c1c','#d8a882','shock'))
o+=P('awstage','[ภาพประกอบนิทาน เย็นบนเวทีมอบรางวัล โทนทองพีช] ถ้วยหอพักดีเด่น ริบบิ้น โคอาลา',
 [bg('w3','#fef9c3','#ffedd5','#9a8a6a'), '<g transform="translate(240 136)"><rect x="-56" y="-6" width="112" height="14" rx="3" fill="#a16207"/></g>', TROPHY(240,98), KOALA(96,122,.75),
  CHIP(170,84,'ลดภาษีได้','#b45309'), '<g opacity=".8">'+''.join(f'<rect x="{150+i*22}" y="{60+(i%3)*6}" width="4" height="7" fill="{["#f472b6","#60a5fa","#facc15","#34d399"][i%4]}" transform="rotate({i*30} {152+i*22} 64)"/>' for i in range(8))+'</g>', FLOOR('#713f12',.06), vignette('w3')]+person('W',292,'#d97706','#e8b896','happy'))
open('/home/claude/work/s486.js','w').write(o)
