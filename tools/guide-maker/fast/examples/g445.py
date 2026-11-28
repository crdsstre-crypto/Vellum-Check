import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cdspa','[ภาพประกอบนิทาน เช้าในร้านสปาชั้นล่างอาคารชุด โทนเขียวมิ้นต์] เตียงนวด ตะเกียงอโรมา อาคารชุดเก่า',
 [bg('cd1','#d1fae5','#ecfeff','#6aa89a'), CONDO(250,138,5,'#0f766e'), '<g transform="translate(150 124)"><rect x="-26" y="-6" width="52" height="10" rx="4" fill="#fef3c7" stroke="#a16207"/><path d="M-22 4v12M22 4v12" stroke="#a16207" stroke-width="3"/><circle cx="34" cy="-14" r="5" fill="#fde047" opacity=".7"/></g>',
  FLOOR('#134e4a',.07), DUST(9,445,'#fff',.5), vignette('cd1'), FG('l','#134e4a',.25)]+person('W',318,'#0d9488','#e8b896','worried'))
o+=P('cdtitle','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนชมพูกุหลาบ] หนังสือกรรมสิทธิ์ห้องชุดประทับยกเลิก โฉนดรวม',
 [bg('cd2','#ffe4e6','#fdf2f8','#a87a8a'), courtcounter(240,146,110), DOC(220,84,70,44,'ห้องชุด',[('','#be123c')],'#be123c'), SEAL(252,104,'ยกเลิก','#dc2626',w=52), DAYRING(140,98,'30','วัน',.5,'#be123c',18),
  FLOOR('#881337',.07), vignette('cd2')]+person('M',60,'#be123c','#d8a882','calm'))
o+=P('cdoffice','[ภาพประกอบนิทาน เย็นห้องประชุมเจ้าของร่วม โทนฟ้าพาสเทล] กราฟวงกลมส่วนแบ่ง ลูกแกะตุ๊กตา',
 [bg('cd3','#e0f2fe','#f0f9ff','#7a9aa8'), PCT(244,104,32,'#0284c7') if False else '<g transform="translate(244 104)"><circle r="26" fill="#bae6fd"/><path d="M0 0v-26a26 26 0 0 1 8 1z" fill="#0284c7"/><text y="40" text-anchor="middle" font-size="8" font-weight="900" fill="#0369a1">ห้องร้าน 3.2%</text></g>', LAMB(92,124,.7),
  FLOOR('#0c4a6e',.06), vignette('cd3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s445.js','w').write(o)
