import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('flitalian','[ภาพประกอบนิทาน เช้าในร้านอาหารอิตาเลียน โทนเขียวแดงครีม] เตาพิซซ่า ลูกโลกหมุดที่ดิน',
 [bg('fl1','#fef3c7','#dcfce7','#a8987a'), '<g transform="translate(250 116)"><path d="M-30 20v-24q30 -30 60 0v24z" fill="#b45309"/><path d="M-14 20v-14q14 -14 28 0v14z" fill="#1c1917"/><circle cx="-4" cy="14" r="4" fill="#f97316"/><circle cx="4" cy="15" r="3" fill="#facc15"/></g>', GLOBEPIN(140,100,'#15803d'),
  FLOOR('#78350f',.08), DUST(9,457,'#fff',.5), vignette('fl1'), FG('l','#78350f',.25)]+person('M',318,'#16a34a','#d8a882','calm'))
o+=P('flinherit','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนชมพูอิฐ] โฉนดมรดก ตาราง 1 ไร่ ป้ายโทษ 2 ปี',
 [bg('fl2','#fee2e2','#fff1f2','#a87a7a'), courtcounter(240,146,110), DOC(220,82,74,50,'จำนวนที่ดิน',[('พาณิชย์ ≤ 1 ไร่','#b91c1c'),('อุตสาหกรรม ≤ 10','#b91c1c')],'#dc2626'), SEAL(140,100,'จำคุก ≤ 2 ปี','#dc2626',w=66),
  FLOOR('#7f1d1d',.07), vignette('fl2')]+person('W',60,'#b91c1c','#e8b896','worried'))
o+=P('floffice','[ภาพประกอบนิทาน เย็นในร้าน โทนฟ้าใส] เช็กลิสต์ก่อนวางมัดจำ ลูกวัวตุ๊กตา',
 [bg('fl3','#e0f2fe','#f0f9ff','#7a9aa8'), desk(240,134,100,'#0369a1'), DOC(214,80,72,46,'ก่อนวางมัดจำ',[('✓ สนธิสัญญา','#15803d'),('✓ ขออนุญาต','#15803d')],'#0284c7'), CALF(92,124,.7),
  FLOOR('#0c4a6e',.06), vignette('fl3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s457.js','w').write(o)
