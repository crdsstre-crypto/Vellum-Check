import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bscafe','[ภาพประกอบนิทาน เช้าที่ที่ดินร้านกาแฟใหม่ โทนเหลืองครีม] ทาวเวอร์เครนยกคาน แบบแปลน ใบอนุญาต ผู้ควบคุมงาน นกกระจอกบนรั้ว',
 [bg('bs1','#fef3c7','#e0f2fe','#a89a7a',wall_tex=False), CRANE(150,146,.95), blueprint(110,110), bird(270,76,'#a8a29e'),
  DOC(172,92,80,44,'ใบอนุญาต',[('ผู้ควบคุมงาน','#1d4ed8'),('เริ่ม–เสร็จ','#334155')],'#ca8a04'),
  FLOOR('#78350f',.07), DUST(9,280,'#fff',.5), vignette('bs1'), FG('l','#78350f',.25)]+person('W',318,'#ca8a04','#e8b896','calm'))
o+=P('bssite','[ภาพประกอบนิทาน บ่ายที่ไซต์ก่อสร้าง โทนเทาฟ้า] เทประกันอันตราย กรวยจราจร ป้ายหยุดงาน หมาวัดนอนข้างกองอิฐ',
 [bg('bs2','#e2e8f0','#dbeafe','#7a8a9a',wall_tex=False), CRANE(230,146,.7,'#64748b'), cone(150), cone(180), hazardtape(120,120,120), dog(270,150,'#d6a46a',.8),
  SEAL(150,84,'หยุดงาน','#dc2626'), FLOOR('#1e293b',.08), vignette('bs2')]+person('M',60,'#64748b','#d8a882','worried'))
o+=P('bsoffice','[ภาพประกอบนิทาน เช้าที่กองช่างเทศบาล โทนเขียวพาสเทล] ใบอนุญาตชำรุด ขอใบแทน 15 วัน แจ้งทายาท 90 วัน ต้นไม้ในกระถาง',
 [bg('bs3','#dcfce7','#f0f9ff','#7aa88a'), plant(80), courtcounter(230,146,100), folders(250,110) if False else filestack(250,112),
  STEPS(120,100,['ใบหาย','15 วัน','ใบแทน'],2,'#16a34a'), TAPE(116,216,126,'ทายาท 90 วัน','#bbf7d0','#14532d'),
  FLOOR('#14532d',.06), vignette('bs3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s280.js','w').write(o)
