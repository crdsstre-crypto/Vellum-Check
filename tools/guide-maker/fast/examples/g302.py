import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('oobubbletea','[ภาพประกอบนิทาน บ่ายในร้านชาไข่มุก โทนชมพูนม] แก้วชาไข่มุก ซองคำบอกกล่าวศาล หนังสือพิมพ์ประกาศ',
 [bg('oo1','#fce7f3','#fef3c7','#a87a8a'), desk(230,132,110,'#be185d'), bobacup(220,112), bobacup(250,114), newspaper(150,110), courtenvelope(160,86),
  FLOOR('#831843',.07), DUST(9,302,'#fff',.5), vignette('oo1'), FG('l','#831843',.25)]+person('W',318,'#db2777','#e8b896','calm'))
o+=P('oocourt','[ภาพประกอบนิทาน เช้าหน้าศาล โทนม่วงอ่อน] หนังสือขอออกจากกลุ่ม วงนับ 45 วัน ป้ายกลับเข้าไม่ได้',
 [bg('oo2','#ede9fe','#f5f3ff','#8a7aa8',wall_tex=False), COURTHOUSE(250,132), DAYRING(140,104,'45','วัน',.4,'#7c3aed'), CHIP(186,86,'ออกแล้วกลับไม่ได้','#dc2626'),
  FLOOR('#4c1d95',.07), vignette('oo2')]+person('M',60,'#7c3aed','#d8a882','worried'))
o+=P('ooshop','[ภาพประกอบนิทาน เย็นที่ร้าน โทนเขียวมะนาว] สมาชิกกลุ่มตรวจเอกสาร แฟ้มคดี จิ้งจอกตุ๊กตาบนชั้น',
 [bg('oo3','#ecfccb','#f0fdf4','#8aa87a'), FOX(82,100,.75), desk(230,134,100,'#4d7c0f'), filestack(250,112),
  STEPS(120,104,['ฟังพิจารณา','ตรวจเอกสาร','คัดค้าน'],1,'#65a30d'), FLOOR('#365314',.06), vignette('oo3')]+person('W',292,'#65a30d','#e8b896','happy'))
open('/home/claude/work/s302.js','w').write(o)
