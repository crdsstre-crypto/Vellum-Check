import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bqsouvenir','[ภาพประกอบนิทาน เช้าหน้าร้านของฝาก โทนส้มทอง] กันสาดที่จะต่อเติม ทางเท้า ระยะร่นวัดด้วยตลับเมตร',
 [bg('bq1','#fef3c7','#ffedd5','#a89060',wall_tex=False), '<g transform="translate(250 112)"><rect x="-40" y="-20" width="80" height="44" fill="#fde68a" stroke="#a16207"/><path d="M-46 -20h92l-10 -14h-72z" fill="#dc2626"/><path d="M-46 -34h92" stroke="#fff" stroke-dasharray="6 6" stroke-width="2"/></g>', '<path d="M190 150h-60" stroke="#475569" stroke-width="2"/><path d="M190 146v8M130 146v8" stroke="#475569" stroke-width="2"/><text x="160" y="144" text-anchor="middle" font-size="8" font-weight="900" fill="#475569">0.80 ม.</text>',
  FLOOR('#78350f',.08), DUST(9,450,'#fff',.5), vignette('bq1'), FG('l','#78350f',.3)]+person('M',318,'#d97706','#d8a882','calm'))
o+=P('bqstreet','[ภาพประกอบนิทาน บ่ายที่เทศบาล โทนฟ้าเทา] หนังสือหารือ คำตอบใน 30 วัน ประกาศราชกิจจาฯ',
 [bg('bq2','#e0f2fe','#f1f5f9','#7a8a9a'), courtcounter(240,146,110), DOC(220,82,74,48,'หนังสือหารือ',[('ตอบใน 30 วัน','#0369a1')],'#0284c7'), DOC(110,92,70,40,'ประกาศห้าม',[('ชั่วคราว ≤ 1 ปี','#dc2626')],'#64748b'),
  FLOOR('#334155',.07), vignette('bq2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('bqorder','[ภาพประกอบนิทาน เย็นหน้าร้าน โทนเขียวพาสเทล] คำสั่งระงับงานปิดประตู วงนับ 3 วัน ลูกแมวตุ๊กตา',
 [bg('bq3','#dcfce7','#f0fdf4','#7aa88a'), '<g transform="translate(250 112)"><rect x="-30" y="-44" width="60" height="74" rx="3" fill="#a16207"/><rect x="-14" y="-34" width="28" height="22" fill="#fff" stroke="#dc2626"/><text y="-19" text-anchor="middle" font-size="6.5" font-weight="900" fill="#dc2626">ระงับงาน</text></g>', DAYRING(160,96,'3','วัน',.7,'#15803d',16), KITTEN(92,126,.7),
  FLOOR('#14532d',.06), vignette('bq3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s450.js','w').write(o)
