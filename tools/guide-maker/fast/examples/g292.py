import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('stwarehouse','[ภาพประกอบนิทาน เช้าในโกดังร้านออนไลน์ โทนฟ้าพาสเทล] กล่องพาวเวอร์แบงก์ เครื่องบวมมีควัน ป้ายอาจอันตราย แมวส้มบนกล่อง',
 [bg('st1','#e0f2fe','#fef9c3','#7a9aa8'), crate(220,124,40,28,'#d97706'), crate(262,124,40,28,'#d97706'), crate(240,96,40,28,'#f59e0b'),
  '<g transform="translate(150 104)"><rect x="-14" y="-20" width="28" height="40" rx="6" fill="#334155"/><rect x="-10" y="-14" width="20" height="8" rx="2" fill="#86efac"/><path d="M-6 -24q4-8 0-14M4 -24q4-8 0-14" stroke="#94a3b8" stroke-width="2" fill="none"/></g>', cat(250,82,'#fb923c',.5),
  STICKER(176,80,'อาจอันตราย','#dc2626',20), FLOOR('#0c4a6e',.07), DUST(9,292,'#fff',.5), vignette('st1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','worried'))
o+=P('stlab','[ภาพประกอบนิทาน บ่ายในห้องแล็บทดสอบ โทนม่วงอ่อน] ขวดทดลอง เครื่องวัด ป้ายห้ามขายชั่วคราว',
 [bg('st2','#f3e8ff','#e0f2fe','#8a7aa8'), desk(230,132,110,'#6d28d9'), beaker(210,110), beaker(240,112), testchart(270,100) if False else '', SEAL(260,92,'ห้ามขายชั่วคราว','#dc2626',w=90),
  DOC(104,92,84,48,'คำสั่ง ม.29/8',[('ส่งทดสอบ','#7c3aed'),('รายงานผลตามกำหนด','#334155')],'#7c3aed'),
  FLOOR('#3b0764',.07), vignette('st2')]+person('W',60,'#7c3aed','#e8b896','calm'))
o+=P('stoffice','[ภาพประกอบนิทาน เช้าที่ห้องประชุม สคบ. โทนเขียวอ่อน] รายงานผลทดสอบ สองทาง ไม่อันตราย/อันตราย นากตุ๊กตาบนชั้น',
 [bg('st3','#dcfce7','#fef9c3','#7aa88a'), OTTER(84,96,.8), labreport(240,110) if False else desk(230,134,100,'#15803d'),
  CHIP(150,96,'ไม่อันตราย → เพิกถอน','#16a34a'), CHIP(150,120,'อันตราย → ห้ามขาย','#dc2626'), FLOOR('#14532d',.06), vignette('st3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s292.js','w').write(o)
