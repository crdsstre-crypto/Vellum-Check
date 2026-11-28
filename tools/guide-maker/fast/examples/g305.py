import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ahcafe','[ภาพประกอบนิทาน เช้าในร้านอุปกรณ์กาแฟ โทนน้ำตาลครีม] เครื่องชงกาแฟ คำพิพากษา แผนที่ลูกหนี้ย้ายไปเชียงใหม่',
 [bg('ah1','#fef3c7','#ffedd5','#a8926a'), espresso(240,118), desk(240,134,90,'#92400e'), ROUTE(110,120,200,80,'#b45309') if False else '<path d="M110 120Q150 60 200 84" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4" fill="none"/><circle cx="200" cy="84" r="6" fill="#dc2626"/>',
  CHIP(150,132,'กทม. → เชียงใหม่','#92400e'), FLOOR('#78350f',.07), DUST(9,305,'#fff',.5), vignette('ah1'), FG('l','#78350f',.25)]+person('M',318,'#b45309','#d8a882','calm'))
o+=P('ahcourt','[ภาพประกอบนิทาน บ่ายหน้าศาล โทนม่วงชมพู] คำบังคับ วงนับ 15 วัน คำสั่งคุ้มครอง',
 [bg('ah2','#fae8ff','#fce7f3','#9a7aa8',wall_tex=False), COURTHOUSE(250,132), DAYRING(140,104,'15','วัน',.8,'#a21caf'), SEAL(204,86,'คุ้มครอง','#a21caf'),
  FLOOR('#701a75',.07), vignette('ah2')]+person('W',60,'#a21caf','#e8b896','worried'))
o+=P('ahoffice','[ภาพประกอบนิทาน เช้าห้องไต่สวน โทนเขียวหยก] แว่นขยายส่องรายการทรัพย์ หมายเรียกลูกหนี้ จิ้งจอกบนชั้นหนังสือ',
 [bg('ah3','#ccfbf1','#ecfeff','#6aa89a'), FOX(84,96,.7), desk(230,134,100,'#0f766e'), magnifier(250,110),
  DOC(120,90,90,44,'ไต่สวนทรัพย์',[('เครื่องชง 3 เครื่อง?','#0f766e')],'#0f766e'), FLOOR('#134e4a',.06), vignette('ah3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s305.js','w').write(o)
