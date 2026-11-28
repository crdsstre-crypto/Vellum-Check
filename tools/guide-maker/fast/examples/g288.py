import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rsriver','[ภาพประกอบนิทาน เช้าที่รีสอร์ตริมคลอง โทนฟ้าเขียวอ่อน] ศาลาไม้ริมน้ำ ใบอนุญาตหลายใบยื่นพร้อมกัน นกกระเต็นบนเสา',
 [bg('rs1','#e0f2fe','#dcfce7','#7aa8a0',wall_tex=False), '<path d="M0 132q60-8 120 0t120 0t120 0v20h-360z" fill="#7dd3fc" opacity=".6"/>', '<g transform="translate(230 92)"><path d="M-36 0l36-20l36 20z" fill="#a16207"/><rect x="-30" y="0" width="60" height="30" fill="#fde68a"/><path d="M-26 30v14M26 30v14" stroke="#78350f" stroke-width="4"/></g>', bird(140,60,'#0ea5e9'),
  filestack(120,112), CHIP(170,104,'ยื่นพร้อมกัน','#0369a1'), FLOOR('#0c4a6e',.05), DUST(9,288,'#fff',.5), vignette('rs1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('rsnotice','[ภาพประกอบนิทาน บ่ายที่เคาน์เตอร์รีสอร์ต โทนส้มส้มโอ] หนังสือเตือน 30 วัน กริ่ง วงพักใช้ 15 วัน',
 [bg('rs2','#ffedd5','#fef3c7','#a8846a'), courtcounter(240,146,110), BELL(250,112), DAYRING(140,108,'15','วัน',.5,'#ea580c'), courtenvelope(200,122),
  FLOOR('#7c2d12',.07), vignette('rs2')]+person('W',60,'#ea580c','#e8b896','worried'))
o+=P('rsdesk','[ภาพประกอบนิทาน ค่ำที่ห้องทำงานรีสอร์ต โทนม่วงอ่อน] อุทธรณ์ ผังหนีไฟติดครบ ตราเปิดต่อได้ นกฮูกบนชั้น',
 [bg('rs3','#ede9fe','#fae8ff','#8a7aa8'), lamp(250,56,'#fde047',10), lightpool(250,146,60,'#fef9c3',.3), OWL(80,96,.85), desk(220,132,90,'#6d28d9'),
  DOC(120,92,86,44,'อุทธรณ์',[('ติดผังหนีไฟครบ ✓','#15803d')],'#7c3aed'), FLOOR('#4c1d95',.06), vignette('rs3')]+person('M',292,'#7c3aed','#d8a882','happy'))
open('/home/claude/work/s288.js','w').write(o)
