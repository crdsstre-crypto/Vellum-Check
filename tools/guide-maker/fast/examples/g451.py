import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cmcafe','[ภาพประกอบนิทาน เช้าในคาเฟ่หนังสือ โทนน้ำตาลอบอุ่น] ชั้นหนังสือ ป้ายรอบฉายหนัง',
 [bg('cm4','#fef3c7','#fde68a','#a89060'), '<g transform="translate(250 112)"><rect x="-40" y="-36" width="80" height="66" fill="#92400e"/>'+''.join(f'<rect x="{-36+i*8}" y="{-32+r*22}" width="6" height="18" fill="{["#ef4444","#3b82f6","#22c55e","#eab308","#a855f7"][(i+r)%5]}"/>' for r in range(3) for i in range(9))+'</g>', DOC(110,86,80,40,'รอบฉาย 19:00',[('ตั๋ว 150 บาท','#b45309')],'#d97706'),
  FLOOR('#78350f',.08), DUST(9,451,'#fff',.5), vignette('cm4'), FG('l','#78350f',.3)]+person('W',318,'#d97706','#e8b896','calm'))
o+=P('cmscreen','[ภาพประกอบนิทาน ค่ำในห้องฉาย โทนกรมท่า] จอฉาย แถวเก้าอี้ ป้ายทางออกไฟดับ',
 [bg('cm5','#e0e7ff','#c7d2fe','#5a6a98'), CINEMA(240,98,'#1e293b'), '<g transform="translate(130 86)"><rect x="-18" y="-8" width="36" height="16" rx="2" fill="#475569"/><text y="4" text-anchor="middle" font-size="7" font-weight="900" fill="#94a3b8">EXIT</text><path d="M14 -12l8 -6M16 -4l10 0" stroke="#dc2626" stroke-width="2"/></g>',
  FLOOR('#1e1b4b',.1), vignette('cm5')]+person('M',60,'#3730a3','#d8a882','worried'))
o+=P('cmrenew','[ภาพประกอบนิทาน เย็นที่ศาลากลาง โทนชมพูพีช] ใบอนุญาตโรงมหรสพ 2 ปี ปฏิทิน 31 ธ.ค. ลูกแมวตุ๊กตา',
 [bg('cm6','#ffe4e6','#fff1f2','#a87a7a'), AWARD(244,98,'โรงมหรสพ','#be123c'), DAYRING(160,96,'31','ธ.ค.',.9,'#be123c',16), KITTEN(92,126,.7),
  FLOOR('#881337',.06), vignette('cm6')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s451.js','w').write(o)
