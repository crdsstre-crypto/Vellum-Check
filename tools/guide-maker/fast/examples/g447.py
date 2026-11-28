import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ctnail','[ภาพประกอบนิทาน เช้าในร้านทำเล็บชั้นล่างคอนโด โทนชมพูนม] โต๊ะทำเล็บ ขวดยาทาเล็บ อาคารชุด',
 [bg('ct1','#fce7f3','#fff1f2','#a87a8a'), CONDO(270,138,5,'#be185d'), '<g transform="translate(180 128)"><rect x="-30" y="-6" width="60" height="8" rx="3" fill="#fbcfe8"/>'+''.join(f'<rect x="{-24+i*10}" y="-18" width="6" height="12" rx="2" fill="{c}"/>' for i,c in enumerate(['#ef4444','#a855f7','#ec4899','#f59e0b','#14b8a6']))+'</g>',
  FLOOR('#831843',.07), DUST(9,447,'#fff',.5), vignette('ct1'), FG('l','#831843',.25)]+person('W',318,'#db2777','#e8b896','calm'))
o+=P('ctland','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนฟ้าคราม] หนังสือห้องชุดขนาดผิด วงนับ 30 วัน',
 [bg('ct2','#e0e7ff','#e0f2fe','#7a8aa8'), courtcounter(240,146,110), DOC(220,84,74,46,'ห้องชุด',[('32 → 38 ตร.ม.','#dc2626')],'#4338ca'), DAYRING(140,98,'30','วัน',.5,'#4338ca',18),
  FLOOR('#1e1b4b',.07), vignette('ct2')]+person('M',60,'#4338ca','#d8a882','worried'))
o+=P('ctdeedrep','[ภาพประกอบนิทาน เย็นในร้าน โทนเขียวพาสเทล] ใบแทนหนังสือกรรมสิทธิ์ ฉบับเดิมยกเลิก ลูกแมวตุ๊กตา',
 [bg('ct3','#dcfce7','#f0fdf4','#7aa88a'), desk(240,134,100,'#15803d'), AWARD(244,98,'ใบแทน','#15803d'), KITTEN(92,124,.7),
  FLOOR('#14532d',.06), vignette('ct3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s447.js','w').write(o)
