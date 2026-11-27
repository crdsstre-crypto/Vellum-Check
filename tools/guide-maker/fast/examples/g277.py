import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ltnoodle','[ภาพประกอบนิทาน เช้าที่ร้านก๋วยเตี๋ยวชั้นล่างตึกแถว โทนเขียวมิ้นต์] ปฏิทิน 1 ม.ค. วงแดง โฉนดที่ดิน ไอน้ำจากหม้อ แมวนอนบนเก้าอี้',
 [bg('lt1','#ccfbf1','#fef9c3','#7a9a8a'), shophouse(200), hotpot(240,128), steam(240,104), SEAL(130,80,'1 ม.ค.','#dc2626'), landdeed(100,118), cat(170,138,'#f8fafc',.55),
  FLOOR('#134e4a',.07), DUST(9,277,'#fff',.5), vignette('lt1'), FG('l','#134e4a',.25)]+person('M',318,'#0d9488','#d8a882','calm'))
o+=P('ltoffice','[ภาพประกอบนิทาน สายๆ ที่สำนักงานเทศบาล โทนฟ้าครีม] แบบประเมินภาษี เคาน์เตอร์ ป้ายขอแก้บัญชี นกพิราบที่หน้าต่าง',
 [bg('lt2','#dbeafe','#fff7ed','#7a8aa8'), window(250,40), bird(272,52,'#94a3b8'), courtcounter(240,146,110),
  DOC(110,84,92,62,'แบบประเมิน',[('ใช้ทำการค้าทั้งหลัง ✗','#b91c1c'),('ชั้นบนอยู่อาศัย','#15803d'),('ขอแก้ ม.32','#1d4ed8')],'#1d4ed8'),
  ZOOM(214,96,'ผิด!'), FLOOR('#1e3a8a',.07), vignette('lt2')]+person('W',60,'#2563eb','#e8b896','worried'))
o+=P('ltupstairs','[ภาพประกอบนิทาน เย็นที่ชั้นบนตึกแถว โทนพีชอบอุ่น] ห้องนั่งเล่น ต้นไม้ นกฮูกตุ๊กตาบนชั้น หนังสือแจ้งเปลี่ยนการใช้ใน 60 วัน',
 [bg('lt3','#ffe4e6','#fef3c7','#a8847a'), lamp(120,60,'#fde047',10), lightpool(120,140,60,'#fef9c3',.3), shelf(70,90) if False else '', OWL(80,96,.9), plant(250), rug(180,150) if False else '',
  STEPS(140,104,['เปลี่ยนการใช้','ยื่นแจ้ง','ปีหน้าตรง'],1,'#e11d48'), FLOOR('#881337',.06), vignette('lt3')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s277.js','w').write(o)
