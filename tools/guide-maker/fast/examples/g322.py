import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wtmart','[ภาพประกอบนิทาน ค่ำในมินิมาร์ต โทนฟ้านีออน] เคาน์เตอร์แคชเชียร์ บัตรเครดิต หมายเรียกพยาน',
 [bg('wt1','#e0f2fe','#ecfeff','#7a9aa8'), courtcounter(230,146,110), register(250,118), '<g transform="translate(190 112) rotate(-10)"><rect x="-14" y="-9" width="28" height="18" rx="3" fill="#6366f1"/><rect x="-10" y="-4" width="8" height="6" rx="1" fill="#fde68a"/></g>', courtenvelope(130,108),
  FLOOR('#0c4a6e',.07), DUST(9,322,'#fff',.5), vignette('wt1'), FG('l','#0c4a6e',.25)]+person('W',318,'#0284c7','#e8b896','worried'))
o+=P('wtcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนน้ำตาลไม้] คอกพยาน ไมค์ ป้ายห้ามอ่านโน้ต',
 [bg('wt2','#fef3c7','#ffedd5','#a8926a'), STAND(240,112), '<g transform="translate(150 100) rotate(-8)"><rect x="-16" y="-12" width="32" height="24" fill="#fef9c3" stroke="#a16207"/><path d="M-10 -4h20M-10 2h14" stroke="#ca8a04"/><path d="M-18 -14l36 28" stroke="#dc2626" stroke-width="3"/></g>',
  FLOOR('#78350f',.07), vignette('wt2')]+person('M',60,'#b45309','#d8a882','calm'))
o+=P('wtoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานทนาย โทนเขียวมิ้นต์] บันทึกถ้อยคำ วงนับ 7 วัน บีเวอร์ตุ๊กตา',
 [bg('wt3','#d1fae5','#ecfeff','#6aa89a'), BEAVER(84,100,.75), desk(230,134,100,'#0f766e'), DAYRING(250,104,'7','วัน',.7,'#0f766e',18),
  DOC(126,90,84,40,'บันทึกถ้อยคำ',[('ยังต้องมาศาล','#dc2626')],'#0f766e'), FLOOR('#134e4a',.06), vignette('wt3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s322.js','w').write(o)
