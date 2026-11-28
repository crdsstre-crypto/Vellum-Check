import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fmcoffee','[ภาพประกอบนิทาน เช้าที่โรงคั่วกาแฟ โทนน้ำตาลครีม] กระสอบเมล็ดกาแฟ จับมือ ไกล่เกลี่ย',
 [bg('fm1','#fef3c7','#fde7d7','#9a7a5a',wall_tex=False), SACKS(240,124,4,'#e7d3b0','กาแฟ'), '<g transform="translate(250 78)"><circle r="16" fill="#fff" stroke="#92400e" stroke-width="2"/><path d="M-9 0l5 -4 4 3 4 -3 5 4-5 4-4-3-4 3z" fill="#f59e0b"/></g>',
  CHIP(140,98,'ไกล่เกลี่ยก่อนฟ้อง','#92400e'), FLOOR('#78350f',.06), DUST(8,468,'#fff',.5), vignette('fm1')]+person('W',318,'#92400e','#e8b896','hmm'))
o+=P('fmprovince','[ภาพประกอบนิทาน บ่ายที่ศาลากลาง โทนม่วงชมพู] แผนที่สองจังหวัด หมุดพื้นที่ส่วนใหญ่',
 [bg('fm2','#f3e8ff','#fce7f3','#9a7aa8'), PLOTS(236,104,96,58,2,'#a855f7'), GLOBEPIN(268,82,'#9333ea'), CHIP(140,92,'พื้นที่ส่วนใหญ่','#7e22ce'),
  FLOOR('#581c87',.07), vignette('fm2')]+person('M',60,'#9333ea','#d8a882','shock'))
o+=P('fmoffice','[ภาพประกอบนิทาน เย็นที่ห้องประชุม โทนฟ้าเหลือง] วง 20 วัน ปฏิทิน +10 กบนั่งโต๊ะ',
 [bg('fm3','#e0f2fe','#fef9c3','#7a8aa8'), desk(240,134,100,'#0369a1'), DAYRING(246,98,'20','วัน',.7,'#0369a1',20), CHIP(300,72,'+10','#ca8a04'), FROG(100,124,.7,'#bbf7d0'),
  DOC(122,80,70,36,'นัดไกล่เกลี่ย',[('12 ราย รวมเรื่อง','#0369a1')],'#0ea5e9'), FLOOR('#0c4a6e',.06), vignette('fm3')]+person('W',292,'#0284c7','#e8b896','relief'))
open('/home/claude/work/s468.js','w').write(o)
