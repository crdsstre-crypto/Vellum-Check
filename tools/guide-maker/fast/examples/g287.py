import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sxspa','[ภาพประกอบนิทาน เช้าที่ร้านสปาไม้บนที่ดินเช่า โทนเขียวเซจ] เตียงนวด กล้วยไม้ ป้ายที่ดิน–อาคารต่างเจ้าของ เม่นตัวน้อยใต้ระเบียง',
 [bg('sx1','#dcfce7','#fef9c3','#8aa88a'), orchid(250,110) if False else plant(250), '<g transform="translate(200 120)"><rect x="-34" y="0" width="68" height="10" rx="4" fill="#fff" stroke="#86efac"/><path d="M-30 10v16M30 10v16" stroke="#a16207" stroke-width="4"/></g>', HEDGEHOG(120,138,.9),
  CHIP(140,80,'ที่ดิน: เจ้าของที่','#15803d'), CHIP(150,100,'อาคาร: ร้าน','#0e7490'),
  FLOOR('#14532d',.07), DUST(9,287,'#fff',.5), vignette('sx1'), FG('l','#14532d',.25)]+person('W',318,'#16a34a','#e8b896','calm'))
o+=P('sxpost','[ภาพประกอบนิทาน บ่ายที่ไปรษณีย์ โทนแดงครีม] เช็คธนาคาร ซองลงทะเบียน ตราประทับวันที่',
 [bg('sx2','#fee2e2','#fff7ed','#a87a7a'), courtcounter(240,146,110), CHEQUE(116,96,'฿12,400'), stamp(220,110,'#dc2626'), STICKER(250,92,'วันนี้','#dc2626',16),
  FLOOR('#7f1d1d',.07), vignette('sx2')]+person('M',60,'#dc2626','#d8a882','calm'))
o+=P('sxcounter','[ภาพประกอบนิทาน เช้าที่เคาน์เตอร์เทศบาล โทนฟ้าน้ำทะเล] เงินคืน 4,200 บาท วงนับ 1 ปี นกบนขอบหน้าต่าง',
 [bg('sx3','#cffafe','#f0fdf4','#6aa8a8'), window(60,40), bird(82,52,'#94a3b8'), courtcounter(230,146,100), DAYRING(140,112,'1','ปี',.85,'#0891b2'), MONEYFLOW(240,110,170,124,3,'#16a34a'),
  FLOOR('#164e63',.06), vignette('sx3')]+person('W',292,'#0891b2','#e8b896','happy'))
open('/home/claude/work/s287.js','w').write(o)
