import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cfparcel','[ภาพประกอบนิทาน เช้าในโกดังพัสดุ โทนครีมน้ำตาล] กล่องพัสดุบุบ วงเปอร์เซ็นต์รางวัลทนาย',
 [bg('cf1','#fef3c7','#ffedd5','#a8926a'), crate(220,124,40,28,'#b45309'), crate(260,124,40,28,'#d97706'), PCT(150,96,30,'#7c3aed',20), CHIP(150,128,'6 ล้าน','#92400e'),
  FLOOR('#78350f',.07), DUST(9,310,'#fff',.5), vignette('cf1'), FG('l','#78350f',.25)]+person('W',318,'#b45309','#e8b896','calm'))
o+=P('cffeedesk','[ภาพประกอบนิทาน บ่ายที่สำนักงานบังคับคดี โทนเขียวมิ้นต์] ใบเสร็จค่าธรรมเนียม 200 บาท ป้ายไม่เกิน 2 หมื่นฟรี',
 [bg('cf2','#ccfbf1','#f0fdf4','#6aa89a'), courtcounter(240,146,110), receipt(250,112), STICKER(150,96,'≤2หมื่น ฟรี','#0f766e',22),
  FLOOR('#134e4a',.07), vignette('cf2')]+person('M',60,'#0d9488','#d8a882','happy'))
o+=P('cfappeal','[ภาพประกอบนิทาน เช้าหน้าศาลอุทธรณ์ โทนน้ำเงินเทา] อาคารศาล ซองวางเงิน โคอาล่าตุ๊กตาบนม้านั่ง',
 [bg('cf3','#e0e7ff','#f1f5f9','#7a8aa8',wall_tex=False), COURTHOUSE(250,132), KOALA(90,126,.6), cash(160,118),
  FLOOR('#1e1b4b',.06), vignette('cf3')]+person('W',292,'#4338ca','#e8b896','calm'))
open('/home/claude/work/s310.js','w').write(o)
