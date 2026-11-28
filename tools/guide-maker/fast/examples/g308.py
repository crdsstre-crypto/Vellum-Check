import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('jsmarket','[ภาพประกอบนิทาน ค่ำที่ตลาดนัด โทนส้มไฟ] สามร้านอาหาร ถังแก๊ส ท่อที่ยังไม่เสร็จ ไฟประดับ',
 [bg('js1','#ffedd5','#fde68a','#a8846a',wall_tex=False), stringlights(40,40,300) if False else bunting(40,34,300) if False else '', awning(150,330,60,'#f97316','#fff7ed'), '<g transform="translate(240 112)"><rect x="-10" y="-20" width="20" height="34" rx="8" fill="#ef4444"/><rect x="-5" y="-26" width="10" height="7" fill="#64748b"/></g>', CROWD(150,96,3,'#ea580c'),
  FLOOR('#7c2d12',.08), DUST(9,308,'#fff',.5), vignette('js1'), FG('l','#7c2d12',.25)]+person('W',318,'#ea580c','#e8b896','worried'))
o+=P('jscourt','[ภาพประกอบนิทาน สายๆ ห้องรับฟ้อง โทนม่วงเทา] ใบแต่งทนาย ลงชื่อสองฝ่าย ปากกา',
 [bg('js2','#ede9fe','#f1f5f9','#8a7aa8'), courtcounter(240,146,110), DOC(110,88,90,48,'ใบแต่งทนาย',[('ลงชื่อตัวความ ✓','#15803d'),('ลงชื่อทนาย ✓','#15803d')],'#6d28d9'),
  SEAL(250,96,'คดีนี้เท่านั้น','#6d28d9',w=80), FLOOR('#2e1065',.07), vignette('js2')]+person('M',60,'#6d28d9','#d8a882','calm'))
o+=P('jsoffice','[ภาพประกอบนิทาน เย็นที่ร้าน โทนเขียวอ่อน] กุญแจอำนาจ ยอมความต้องอนุญาต โคอาล่าตุ๊กตา',
 [bg('js3','#dcfce7','#f0fdf4','#7aa88a'), KOALA(250,96,.7), keyribbon(140,104), CHIP(20,136,'ยอมความ = ต้องอนุญาต','#15803d'),
  FLOOR('#14532d',.06), vignette('js3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s308.js','w').write(o)
