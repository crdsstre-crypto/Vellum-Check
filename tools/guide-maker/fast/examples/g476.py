import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bcnotice','[ภาพประกอบนิทาน เช้าที่ร้านผ้าม่าน โทนชมพูม่วง] จดหมายแจ้งความวันพิจารณา วง 14 วัน ผ้าม่าน',
 [bg('c1','#fce7f3','#f3e8ff','#9a7a9a',wall_tex=False), '<g transform="translate(300 60)">'+''.join(f'<path d="M{i*8} 0q4 40 0 80" stroke="#f472b6" stroke-width="7" fill="none" opacity=".7"/>' for i in range(4))+'</g>',
  DOC(208,82,88,44,'แจ้งความ',[('ขอปลดจากล้มละลาย','#be185d')],'#ec4899'), DAYRING(140,100,'14','วัน',.5,'#be185d',18), FLOOR('#831843',.06), DUST(7,476,'#fff',.5), vignette('c1')]+person('W',318,'#db2777','#e8b896','hopeful'))
o+=P('bchearing','[ภาพประกอบนิทาน บ่ายในห้องพิจารณา โทนเทาน้ำเงิน] แถบร้อยละ 30 เทียบเกณฑ์ 50',
 [bg('c2','#e2e8f0','#dbeafe','#7a8a9a'), PCTBAR(236,96,30,50,'#2563eb',110), DOC(150,120,74,34,'คำคัดค้าน',[('ไม่ถึง 50%','#dc2626')],'#475569'),
  FLOOR('#1e293b',.07), vignette('c2')]+person('M',60,'#334155','#d8a882','firm'))
o+=P('bcfree','[ภาพประกอบนิทาน เย็นหน้าศาล โทนเหลืองส้ม] หนังสือสำคัญปลด ริบบิ้น ลูกแมว',
 [bg('c3','#fef9c3','#ffedd5','#9a8a6a'), desk(240,134,100,'#b45309'), '<g transform="translate(250 94)"><rect x="-34" y="-22" width="68" height="44" rx="3" fill="#fffbeb" stroke="#d97706" stroke-width="2"/><text y="-6" font-size="8" font-weight="900" text-anchor="middle" fill="#92400e">คำสั่งปลด</text><circle cx="20" cy="12" r="7" fill="#f59e0b"/><path d="M16 18l-3 10M24 18l3 10" stroke="#f59e0b" stroke-width="3"/></g>', KITTEN(98,124,.72),
  CHIP(170,86,'มีเงื่อนไขได้','#b45309'), FLOOR('#78350f',.06), vignette('c3')]+person('W',292,'#d97706','#e8b896','calm'))
open('/home/claude/work/s476.js','w').write(o)
