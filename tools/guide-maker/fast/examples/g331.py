import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('iowood','[ภาพประกอบนิทาน เช้าในร้านเฟอร์นิเจอร์ไม้ โทนน้ำตาลอบอุ่น] เก้าอี้ไม้ ตู้ ใบแจ้งหนี้',
 [bg('io1','#fef3c7','#ffedd5','#a8906a'), '<g transform="translate(240 116)"><rect x="-16" y="-34" width="32" height="6" rx="2" fill="#92400e"/><rect x="-16" y="-6" width="32" height="6" fill="#b45309"/><path d="M-14 -28v52M14 -28v22M14 0v24M-14 0" stroke="#92400e" stroke-width="4"/></g><g transform="translate(290 108)"><rect x="-14" y="-36" width="28" height="60" rx="2" fill="#a16207"/><path d="M0 -36v60" stroke="#78350f"/></g>', receipt(140,110),
  FLOOR('#78350f',.08), DUST(9,331,'#fff',.5), vignette('io1'), FG('l','#78350f',.3)]+person('W',318,'#b45309','#e8b896','worried'))
o+=P('iocourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนม่วงชมพู] คำสั่งยึดชั่วคราว วงนับ 1 เดือน',
 [bg('io2','#fae8ff','#fce7f3','#9a7aa8'), courtcounter(240,146,110), SEAL(250,106,'ยึดชั่วคราว','#a21caf',w=74), DAYRING(140,98,'1','เดือน',.3,'#a21caf',18),
  FLOOR('#701a75',.07), vignette('io2')]+person('M',60,'#a21caf','#d8a882','worried'))
o+=P('iooffice','[ภาพประกอบนิทาน เย็นที่สำนักงานทนาย โทนฟ้าใส] แฟ้มคดีซ้อน ขั้นตอนโต้แย้ง แฮมสเตอร์',
 [bg('io3','#e0f2fe','#f0f9ff','#7a9aa8'), STEPS(196,96,['โต้แย้ง','จดรายงาน','อุทธรณ์'],1,'#0284c7'), HAMSTER(90,128,.65),
  ''.join(f'<rect x="{220+i*4}" y="{124-i*7}" width="50" height="9" rx="2" fill="{c}"/>' for i,c in enumerate(['#fdba74','#93c5fd','#86efac'])),
  FLOOR('#0c4a6e',.06), vignette('io3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s331.js','w').write(o)
