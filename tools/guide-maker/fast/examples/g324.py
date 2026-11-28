import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('picater','[ภาพประกอบนิทาน สายๆ ในร้านจัดเลี้ยง โทนส้มพีช] ถาดอาหาร ใบเสร็จวัตถุดิบ ป้ายยอมรับ 100,000',
 [bg('pi1','#ffedd5','#fef3c7','#a8846a'), TABLE(240,146,90,3,'#c2410c'), pastrytray(240,110), receipt(140,110), CHIP(150,84,'ยอมรับ 100,000','#c2410c'),
  FLOOR('#7c2d12',.07), DUST(9,324,'#fff',.5), vignette('pi1'), FG('l','#7c2d12',.25)]+person('W',318,'#ea580c','#e8b896','calm'))
o+=P('picourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนเขียวพาสเทล] ซองเงินวางศาล นาฬิกาดอกเบี้ยหยุด',
 [bg('pi2','#dcfce7','#f0fdf4','#7aa88a'), courtcounter(240,146,110), cash(250,114), '<g transform="translate(150 98)"><circle r="16" fill="#fff" stroke="#16a34a" stroke-width="3"/><text y="4" text-anchor="middle" font-size="9" font-weight="900" fill="#16a34a">%</text><path d="M-12 12l24 -24" stroke="#dc2626" stroke-width="3"/></g>',
  FLOOR('#14532d',.07), vignette('pi2')]+person('M',60,'#16a34a','#d8a882','worried'))
o+=P('pioffice','[ภาพประกอบนิทาน เย็นที่โกดังจัดเลี้ยง โทนเหลืองนวล] ชุดโต๊ะจีนพร้อมส่ง บีเวอร์ตุ๊กตา',
 [bg('pi3','#fef9c3','#fefce8','#a89a6a'), '<g transform="translate(240 120)"><ellipse rx="34" ry="10" fill="#dc2626"/><path d="M-30 0v22M30 0v22" stroke="#7f1d1d" stroke-width="4"/></g>', BEAVER(90,128,.6), CHIP(150,96,'ส่งมอบในศาล','#a16207'),
  FLOOR('#713f12',.06), vignette('pi3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s324.js','w').write(o)
