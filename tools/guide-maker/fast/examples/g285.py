import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bashabu','[ภาพประกอบนิทาน บ่ายในร้านชาบู โทนแดงอิฐอุ่น] หม้อชาบู ไอน้ำ เจ้าหน้าที่ถือบัตร นาฬิกาเวลาทำการ',
 [bg('ba1','#fee2e2','#fff7ed','#a87a6a'), hotpot(230,124), steam(230,98), desk(220,138,100,'#991b1b'), wallclock(150,62) if False else '', idcard(150,96),
  RIBBON(120,64,'เวลาทำการ','#dc2626'), FLOOR('#7f1d1d',.07), DUST(9,285,'#fff',.5), vignette('ba1'), FG('l','#7f1d1d',.25)]+person('W',318,'#dc2626','#e8b896','calm'))
o+=P('baparking','[ภาพประกอบนิทาน บ่ายลานจอดรถหน้าร้าน โทนเทาเหลือง] เส้นช่องจอดรถ โต๊ะวางทับ กรวย ป้ายคืนสภาพ',
 [bg('ba2','#f1f5f9','#fef9c3','#8a8a7a',wall_tex=False), '<g stroke="#fff" stroke-width="3">'+''.join(f'<path d="M{x} 110l-8 36"/>' for x in (150,200,250,300))+'</g>', TABLE(200,146,70,3,'#a16207'), cone(150), cone(290),
  SEAL(240,90,'คืนสภาพ','#ca8a04'), FLOOR('#334155',.08), vignette('ba2')]+person('M',60,'#475569','#d8a882','worried'))
o+=P('baoffice','[ภาพประกอบนิทาน เช้าห้องรับเรื่องเทศบาล โทนเขียวมิ้นต์] วงนับ 30 วัน ซองอุทธรณ์ ต้นไม้ นกบนกรอบหน้าต่าง',
 [bg('ba3','#d1fae5','#f0fdf4','#7aa88a'), window(70,40), bird(92,52,'#a8a29e'), plant(260), DAYRING(130,116,'30','วัน',.35,'#059669'), envelope(200,112) if False else '',
  ENVFLY(160,124,240,110,2,'#059669'), FLOOR('#064e3b',.06), vignette('ba3')]+person('W',292,'#059669','#e8b896','happy'))
open('/home/claude/work/s285.js','w').write(o)
