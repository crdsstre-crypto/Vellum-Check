import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ahfactory','[ภาพประกอบนิทาน เช้าในโรงงานเฟอร์นิเจอร์ โทนไม้อ่อน] โต๊ะไม้ประกอบ แฟ้มเอกสารส่งอีกฝ่าย',
 [bg('ah1','#fef3c7','#fde68a','#a89060'), '<g transform="translate(240 120)"><rect x="-40" y="-8" width="80" height="10" rx="2" fill="#b45309"/><path d="M-34 2v26M34 2v26" stroke="#92400e" stroke-width="5"/><rect x="-24" y="-30" width="20" height="22" fill="#d97706"/></g>', ENVFLY(120,110,190,80,2,'#b45309'),
  FLOOR('#78350f',.08), DUST(9,432,'#fff',.5), vignette('ah1'), FG('l','#78350f',.3)]+person('M',318,'#b45309','#d8a882','calm'))
o+=P('ahfixdesk','[ภาพประกอบนิทาน บ่ายที่สำนักงานอนุญาโต โทนน้ำเงินอ่อน] คำชี้ขาด ตัวเลขดอกเบี้ยขีดแก้ วงนับ 30 วัน',
 [bg('ah2','#e0e7ff','#eef2ff','#7a8aa8'), AWARD(250,104,'คำชี้ขาด','#4338ca'), '<path d="M228 98h40" stroke="#dc2626" stroke-width="2.5"/>', DAYRING(150,98,'30','วัน',.4,'#4338ca',18),
  FLOOR('#1e1b4b',.07), vignette('ah2')]+person('W',60,'#4338ca','#e8b896','worried'))
o+=P('ahdesk','[ภาพประกอบนิทาน เย็นในโรงงาน โทนเขียวมะนาว] ถุงเงินค่าป่วยการ ตาชั่ง เต่าตุ๊กตา',
 [bg('ah3','#ecfccb','#f7fee7','#8a9a6a'), JSCALE(240,90,4,'#4d7c0f','ค่าป่วยการ','ค่าทนาย'), TURTLE(92,128,.65),
  FLOOR('#365314',.06), vignette('ah3')]+person('W',292,'#65a30d','#e8b896','happy'))
open('/home/claude/work/s432.js','w').write(o)
