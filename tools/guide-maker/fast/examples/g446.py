import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('tlplants','[ภาพประกอบนิทาน เช้าในร้านต้นไม้ โทนเขียวป่า] กระถางเรียง ไปรษณีย์ลงทะเบียน',
 [bg('tl1','#dcfce7','#ecfccb','#7aa87a'), ''.join(f'<g transform="translate({206+i*26} 130)"><path d="M-9 0h18l-3 14h-12z" fill="#b45309"/><circle cy="-10" r="11" fill="#16a34a"/><circle cx="-5" cy="-14" r="5" fill="#22c55e"/></g>' for i in range(4)), courtenvelope(140,108),
  FLOOR('#14532d',.08), DUST(9,446,'#fff',.5), vignette('tl1'), FG('l','#14532d',.3)]+person('M',318,'#16a34a','#d8a882','calm'))
o+=P('tldoor','[ภาพประกอบนิทาน บ่ายหน้าประตูร้านที่ปิด โทนส้มทอง] หนังสือปิดประตู วงนับ 7 วัน',
 [bg('tl2','#fef3c7','#ffedd5','#a89060',wall_tex=False), '<g transform="translate(250 110)"><rect x="-34" y="-46" width="68" height="78" rx="3" fill="#92400e"/><path d="M-34 -20h68M-34 6h68" stroke="#78350f"/><rect x="-14" y="-36" width="28" height="22" fill="#fff" stroke="#a16207"/><path d="M-10 -30h20M-10 -24h14" stroke="#cbd5e1" stroke-width="2"/></g>', DAYRING(140,98,'7','วัน',.6,'#c2410c',18),
  FLOOR('#78350f',.08), vignette('tl2')]+person('W',60,'#c2410c','#e8b896','worried'))
o+=P('tloffice','[ภาพประกอบนิทาน เย็นที่สำนักงานเทศบาล โทนม่วงอ่อน] คำร้องขอขยายเวลา ลูกแกะตุ๊กตา',
 [bg('tl3','#ede9fe','#f5f3ff','#8a7aa8'), desk(240,134,100,'#6d28d9'), DOC(214,80,72,46,'ขอขยายเวลา',[('ยื่นก่อนครบกำหนด','#15803d')],'#7c3aed'), LAMB(92,124,.7),
  FLOOR('#2e1065',.06), vignette('tl3')]+person('M',292,'#7c3aed','#d8a882','happy'))
open('/home/claude/work/s446.js','w').write(o)
