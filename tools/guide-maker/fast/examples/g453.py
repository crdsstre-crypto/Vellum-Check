import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('mkgarage','[ภาพประกอบนิทาน เช้าหน้าอู่ซ่อมรถ โทนส้มเทา] หมุดหลักเขตกลางทางเข้า กองแบบหล่อคอนกรีต',
 [bg('mk1','#ffedd5','#f5f5f4','#a8907a',wall_tex=False), PEG(230,128,'#dc2626','ห้ามย้าย'), '<g transform="translate(150 132)"><rect x="-30" y="-6" width="60" height="12" fill="#a8a29e"/><path d="M-30 -6l10 -8h40l10 8" fill="#d6d3d1"/></g>', toolrack(290,86),
  FLOOR('#44403c',.08), DUST(9,453,'#fff',.5), vignette('mk1'), FG('l','#44403c',.3)]+person('M',318,'#ea580c','#d8a882','worried'))
o+=P('mkland','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนม่วงอ่อน] คำร้องขอย้ายหมุด วงนับ 15 วัน 60 วัน',
 [bg('mk2','#ede9fe','#f5f3ff','#8a7aa8'), courtcounter(240,146,110), DOC(220,84,70,44,'ขอย้ายหมุด',[('อุทธรณ์ 15 วัน','#6d28d9')],'#7c3aed'), DAYRING(140,98,'60','วัน',.6,'#6d28d9',18),
  FLOOR('#2e1065',.07), vignette('mk2')]+person('W',60,'#7c3aed','#e8b896','calm'))
o+=P('mksurvey','[ภาพประกอบนิทาน เย็นที่ลานหน้าร้าน โทนเขียวพาสเทล] กล้องรังวัดบนขาตั้ง กิ่งไม้ที่ตัด ลูกหมูตุ๊กตา',
 [bg('mk3','#dcfce7','#f0fdf4','#7aa88a',wall_tex=False), TRIPOD(244,112) if 'TRIPOD' in dir() else '', PIGLET(92,126,.7), CHIP(160,90,'แจ้งก่อนเข้า','#15803d'),
  FLOOR('#14532d',.06), vignette('mk3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s453.js','w').write(o)
