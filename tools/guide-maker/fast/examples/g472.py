import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bfcounter','[ภาพประกอบนิทาน เช้าที่ศาลล้มละลาย โทนครีมฟ้า] เคาน์เตอร์ยื่นฟ้อง เหรียญประกัน 5,000',
 [bg('f1','#fef9c3','#dbeafe','#8a8a7a',wall_tex=False), courtcounter(240,120) if 'courtcounter' in dir() else desk(240,134,100,'#1d4ed8'), cash(250,96) if 'cash' in dir() else '', CHIP(250,70,'ประกัน 5,000','#1d4ed8'),
  DOC(130,84,80,40,'คำฟ้องล้มละลาย',[('หนี้ 1.6 ล้าน','#1d4ed8')],'#3b82f6'), FLOOR('#1e3a8a',.06), DUST(8,472,'#fff',.5), vignette('f1')]+person('W',318,'#2563eb','#e8b896','focus'))
o+=P('bfcrowd','[ภาพประกอบนิทาน บ่ายหน้าห้องพิจารณา โทนม่วงพีช] แฟ้มคดีสามแฟ้มรวมเป็นหนึ่ง ป้ายจำหน่าย',
 [bg('f2','#f3e8ff','#ffedd5','#9a7a9a'), ''.join(DOC(196+i*30,74+i*10,54,30,'คดี %d'%(i+1),[],'#a855f7') for i in range(3)), SEAL(150,128,'จำหน่าย','#7e22ce',-8,50),
  FLOOR('#581c87',.07), vignette('f2')]+person('M',60,'#9333ea','#d8a882','shock'))
o+=P('bfcourt','[ภาพประกอบนิทาน เย็นในห้องรอศาล โทนเขียวมิ้นต์] ปฏิทินนัดด่วน วง 7 วัน แพนด้าถือใบไผ่',
 [bg('f3','#dcfce7','#ccfbf1','#6a9a8a'), desk(240,134,100,'#15803d'), DAYRING(250,96,'7','วัน',.25,'#15803d',20), PANDA(98,122,.75),
  CHIP(170,90,'นัดด่วน','#15803d'), FLOOR('#14532d',.06), vignette('f3')]+person('W',292,'#16a34a','#e8b896','relief'))
open('/home/claude/work/s472.js','w').write(o)
