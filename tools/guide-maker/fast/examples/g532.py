import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('jlcount','[ภาพประกอบนิทาน เช้าในร้านซ่อมมือถือที่ปิดชั่วคราว ปฏิทินวงวันถูกขัง โทนฟ้าพาสเทลกับเหลืองนวล แสงเช้าผ่านม่านเหล็ก] ปฏิทินวงวัน กุญแจร้าน โทรศัพท์บนชั้น เต่าน้อย หญิงตั้งใจ (น้องม้วนขวา)',
 [bg('jl1','#dbeafe','#fef9c3','#a8a29e'), '<g transform="translate(212 64)">'+''.join(f'<rect x="{i*12}" y="0" width="10" height="70" fill="#cbd5e1" opacity=".5"/>' for i in range(11))+'</g>', phone(300,100,.8), TURTLE(326,140,.6),
  LETTER(122,68,'ขังมาแล้ว 20 วัน',['จำคุก 2 เดือน = 60 วัน','หักวันถูกขัง → เหลือ ~40','วันแรก = 1 วันเต็ม (ม.21)'],'#2563eb',112,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(7,621,'#fff',.45), vignette('jl1'), FG('r','#1e40af',.12)]+person('W',60,'#3b82f6','#e8b88f','focus'))
o+=P('jldetain','[ภาพประกอบนิทาน บ่ายหน้าห้องพิจารณาคดี ม้านั่งยาว นาฬิกาแขวน โทนเขียวเซจกับน้ำตาลไม้ แสงหน้าต่างสูง] นาฬิกาผนัง ม้านั่ง เอกสารคำแถลง ลูกแกะ ชายสวมแว่นสงบ (น้องม้วนซ้าย)',
 [bg('jl2','#dcfce7','#fef3c7','#a8a29e'), '<g transform="translate(236 70)"><circle r="14" fill="#fff" stroke="#15803d" stroke-width="2.4"/><path d="M0 0v-9M0 0l6 4" stroke="#15803d" stroke-width="2"/></g>', bench(210,146) if 'bench' in globals() else desk(206,130,110,'#92400e'), LAMB(160,140,.6),
  LETTER(56,64,'จะจำคุก ≤ 3 เดือน',['ไม่เคยติดคุก → กักขังแทน','เคยแค่ประมาท/ลหุโทษ → ได้','(ม.23) ศาลใช้ดุลพินิจ'],'#15803d',128,-2,1,12),
  FLOOR('#14532d',.06), DUST(7,622,'#fff',.4), vignette('jl2')]+person('M',318,'#22c55e','#d8a882','calm',glasses=True))
o+=P('jlfine','[ภาพประกอบนิทาน เย็นที่ช่องชำระเงินศาล ใบเสร็จค่าปรับ ประตูเปิดออก โทนพีชกับม่วงอ่อน แสงอบอุ่น] ประตูเปิด ใบเสร็จ เหรียญ ผีเสื้อ ชายยิ้ม (น้องม้วนกลาง)',
 [bg('jl3','#ffedd5','#ede9fe','#a8a29e'), '<g transform="translate(316 66)"><rect width="34" height="80" fill="#c4b5fd"/><path d="M0 0l20 8v80l-20 -8z" fill="#7c3aed"/></g>', butterfly(230,72,'#f9a8d4'), coins(236,132,3),
  STEPCARD(10,84,'1','จำคุก ≤ 3 เดือน','+ มีโทษปรับ','#ea580c',ICON('clock','#ea580c')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','ยกจำคุก','ปรับอย่างเดียว (ม.55)','#7c3aed',ICON('coin','#7c3aed')),
  NOTEBAR(10,128,'ให้ทนายแถลงขอ + เตรียมเงินค่าปรับ','#7c3aed',128,-2),
  FLOOR('#4c1d95',.05), DUST(7,623,'#fff',.45), vignette('jl3')]+person('M',292,'#f97316','#c99a74','smile'))
open('/home/claude/work/s532.js','w').write(o)
