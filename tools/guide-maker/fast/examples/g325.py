import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('idbike','[ภาพประกอบนิทาน เช้าในร้านซ่อมมอเตอร์ไซค์ โทนเทาส้ม] รถจักรยานยนต์บนแท่น เครื่องมือ ใบรับรถ',
 [bg('id1','#f5f5f4','#ffedd5','#9a8a7a'), '<g transform="translate(240 118)"><circle cx="-24" cy="16" r="12" fill="none" stroke="#1f2937" stroke-width="4"/><circle cx="24" cy="16" r="12" fill="none" stroke="#1f2937" stroke-width="4"/><path d="M-24 16l14 -20h20l14 20M-4 -4l-6 -10h10" stroke="#ea580c" stroke-width="5" fill="none"/></g>', toolrack(120,88),
  FLOOR('#44403c',.08), DUST(9,325,'#fff',.5), vignette('id1'), FG('l','#44403c',.3)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('idcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนฟ้าคราม] ตารางยอมรับ-โต้แย้ง วงนับ 10 วัน',
 [bg('id2','#e0e7ff','#e0f2fe','#7a8aa8'), desk(240,132,100,'#3730a3'), DOC(104,86,96,56,'ชี้สองสถาน',[('ซ่อมรถจริง ✓ ยอมรับ','#15803d'),('สาเหตุเครื่องดับ ✗ โต้แย้ง','#dc2626')],'#4338ca'), DAYRING(250,100,'10','วัน',.5,'#4338ca',18),
  FLOOR('#1e1b4b',.07), vignette('id2')]+person('W',60,'#4338ca','#e8b896','calm'))
o+=P('idoffice','[ภาพประกอบนิทาน เย็นห้องพิจารณา โทนชมพูพีช] คอกพยาน แถลงปิดคดี บีเวอร์ตุ๊กตาบนชั้น',
 [bg('id3','#ffe4e6','#ffedd5','#a87a7a'), BEAVER(84,96,.7), STAND(240,118,'#9f1239'), STEPS(120,108,['โจทก์','จำเลย','โจทก์ตอบ'],1,'#e11d48'),
  FLOOR('#881337',.06), vignette('id3')]+person('M',292,'#e11d48','#d8a882','happy'))
open('/home/claude/work/s325.js','w').write(o)
