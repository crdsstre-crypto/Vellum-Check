import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('furamen','[ภาพประกอบนิทาน เช้าหน้าร้านราเมนที่ปิด โทนแดงโคมไฟ] ป้ายปิดกิจการ โคมแดง ชามราเมน',
 [bg('fu1','#fee2e2','#ffedd5','#a87a6a',wall_tex=False), '<g transform="translate(250 112)"><rect x="-40" y="-30" width="80" height="54" fill="#7f1d1d"/><rect x="-24" y="-16" width="48" height="18" rx="2" fill="#fff"/><text y="-4" text-anchor="middle" font-size="8" font-weight="900" fill="#dc2626">ปิดกิจการ</text><ellipse cx="-30" cy="-36" rx="7" ry="9" fill="#dc2626"/><ellipse cx="30" cy="-36" rx="7" ry="9" fill="#dc2626"/></g>', DAYRING(140,98,'30','วัน',.4,'#b91c1c',18),
  FLOOR('#7f1d1d',.08), DUST(9,458,'#fff',.5), vignette('fu1'), FG('l','#7f1d1d',.25)]+person('M',318,'#dc2626','#d8a882','worried'))
o+=P('fusell','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนส้มทอง] นาฬิกาทราย 180 วัน–1 ปี ป้ายประกาศขาย',
 [bg('fu2','#ffedd5','#fef3c7','#a8906a'), '<g transform="translate(250 104)"><path d="M-14 -22h28M-14 22h28M-12 -22q0 18 12 22q-12 4 -12 22M12 -22q0 18 -12 22q12 4 12 22" stroke="#92400e" stroke-width="2" fill="#fde68a"/></g>', CHIP(250,140,'180 วัน – 1 ปี','#c2410c'), DOC(110,88,70,40,'ประกาศขาย',[('อธิบดีขายแทน','#dc2626')],'#ea580c'),
  FLOOR('#7c2d12',.07), vignette('fu2')]+person('W',60,'#ea580c','#e8b896','calm'))
o+=P('fuoffice','[ภาพประกอบนิทาน เย็นในออฟฟิศ โทนม่วงอ่อน] คำขออนุญาตกิจการใหม่ ลูกวัวตุ๊กตา',
 [bg('fu3','#ede9fe','#f5f3ff','#8a7aa8'), desk(240,134,100,'#6d28d9'), DOC(214,80,72,46,'ขอเปลี่ยนกิจการ',[('ยื่นก่อนเลิกใช้','#15803d')],'#7c3aed'), CALF(92,124,.7),
  FLOOR('#2e1065',.06), vignette('fu3')]+person('M',292,'#7c3aed','#d8a882','happy'))
open('/home/claude/work/s458.js','w').write(o)
