import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('tochili','[ภาพประกอบนิทาน เช้าในครัวน้ำพริก โทนแดงพริกอ่อน] กระปุกน้ำพริกสองแบรนด์ชื่อคล้าย ป้ายคัดค้าน',
 [bg('to1','#fee2e2','#fff7ed','#a87a6a'), desk(220,134,120,'#b91c1c'),
  '<g transform="translate(200 112)"><rect x="-12" y="-16" width="24" height="26" rx="5" fill="#dc2626"/><rect x="-13" y="-20" width="26" height="6" rx="2" fill="#7f1d1d"/><rect x="-9" y="-8" width="18" height="9" rx="2" fill="#fff"/></g>',
  '<g transform="translate(250 112)"><rect x="-12" y="-16" width="24" height="26" rx="5" fill="#f97316"/><rect x="-13" y="-20" width="26" height="6" rx="2" fill="#9a3412"/><rect x="-9" y="-8" width="18" height="9" rx="2" fill="#fff"/></g>',
  ZOOM(226,80,'คล้าย'), FLOOR('#7f1d1d',.07), DUST(9,294,'#fff',.5), vignette('to1'), FG('l','#7f1d1d',.25)]+person('W',318,'#dc2626','#e8b896','calm'))
o+=P('toboard','[ภาพประกอบนิทาน บ่ายห้องคณะกรรมการเครื่องหมายการค้า โทนเทาม่วง] ปฏิทินกำหนดอุทธรณ์เลยไป ตราเป็นที่สุด',
 [bg('to2','#ede9fe','#f1f5f9','#8a7aa8'), desk(230,134,110,'#5b21b6'), SEAL(250,96,'เป็นที่สุด','#7c3aed',w=70), DAYRING(140,106,'0','วันเหลือ',1.0,'#dc2626'),
  FLOOR('#2e1065',.08), vignette('to2')]+person('M',60,'#6d28d9','#d8a882','worried'))
o+=P('toshelf','[ภาพประกอบนิทาน เย็นหน้าชั้นสินค้าในร้าน โทนเหลืองอุ่น] กระปุกน้ำพริกแม่ปลาพร้อมตรา ® ใบสำคัญการจดทะเบียน เม่นบนชั้น',
 [bg('to3','#fef9c3','#ffedd5','#a8946a'), shopshelf(240,146) if False else shelf(240,146), HEDGEHOG(100,140,.6), certframe(130,96),
  STICKER(170,120,'®','#ca8a04',14), FLOOR('#713f12',.06), vignette('to3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s294.js','w').write(o)
