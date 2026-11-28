import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sostop','[ภาพประกอบนิทาน สายในร้านชาบู บันไดขึ้นชั้นลอยถูกกั้นเชือก ป้ายห้ามใช้ของเทศบาล หม้อชาบูบนโต๊ะ โทนแดงส้มกับครีม แสงไฟร้านอุ่น] ชั้นลอย เชือกกั้น ป้ายห้าม หม้อชาบู นกฮูก ชายพนักงาน (น้องม้วนขวา)',
 [bg('so1','#fee2e2','#fef3c7','#a8a29e'), '<rect x="222" y="66" width="110" height="8" fill="#92400e"/>'+''.join(f'<rect x="{230+i*10}" y="{74+i*8}" width="12" height="4" fill="#78350f"/>' for i in range(7)), '<path d="M228 104h44" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 4"/>', SIGN(282,84,48,'ห้ามใช้','#dc2626','#fff',8), '<ellipse cx="320" cy="126" rx="16" ry="6" fill="#57534e"/><path d="M310 120q4 -8 0 -14M322 120q4 -8 0 -14" stroke="#e5e7eb" stroke-width="2" fill="none"/>', OWL(342,142,.38),
  LETTER(122,64,'คำสั่ง ม.40',['ระงับการกระทำ','ห้ามใช้/เข้า + ติดป้าย','สั่งแก้หรือรื้อใน 30 วัน'],'#dc2626',124,-2,1,12),
  FLOOR('#7f1d1d',.06), DUST(7,3979,'#fff',.4), vignette('so1'), FG('r','#7f1d1d',.12)]+person('M',60,'#ef4444','#d8a882','worried'))
o+=P('soopen','[ภาพประกอบนิทาน ค่ำเสาร์ร้านคนแน่น ลูกค้าเดินขึ้นชั้นลอยที่ถูกห้าม ปฏิทินขีดวันซ้อน เครื่องคิดเลขตัวเลขพุ่ง โทนม่วงกลางคืนกับแดงเตือน แสงไฟสลัว] ลูกค้า ปฏิทิน เครื่องคิดเลข หญิงตกใจ (น้องม้วนซ้าย)',
 [bg('so2','#3b0764','#fecaca','#57534e'), CALGRID(214,62,'รายวัน',{6:'#dc2626',7:'#dc2626',13:'#dc2626',14:'#dc2626'},None,'#b91c1c',64), '<g transform="translate(290 92)"><rect width="40" height="44" rx="4" fill="#e5e7eb"/><rect x="5" y="5" width="30" height="12" fill="#fecaca"/><text x="20" y="14" text-anchor="middle" font-size="7" fill="#b91c1c" font-family="monospace" font-weight="900">300,000</text></g>',
  LETTER(56,64,'ยังเปิดใช้',['คุก ≤ 6 ด. หรือปรับ ≤ 1 แสน','+ ปรับวันละ ≤ 30,000 (ม.67)','อาคารพาณิชย์ x2 (ม.70)'],'#b91c1c',146,-2,1,12),
  FLOOR('#000',.14), DUST(6,3980,'#fecaca',.4), vignette('so2')]+person('W',318,'#f43f5e','#e8b88f','worried'))
o+=P('soneighbor','[ภาพประกอบนิทาน บ่ายระหว่างร้านสองห้องติดกัน ผนังร่วมมีรอยน้ำซึม เพื่อนบ้านยืนถือกระดาษ ร้านเราเปิดประตูคุย โทนเขียวมะกอกกับครีม แสงบ่ายนุ่ม] ผนังร่วม รอยน้ำซึม จดหมาย ชายเจรจา (น้องม้วนกลาง)',
 [bg('so3','#ecfccb','#fef3c7','#a8a29e'), '<rect x="226" y="62" width="50" height="74" fill="#fde68a" stroke="#a16207"/><rect x="276" y="62" width="52" height="74" fill="#bbf7d0" stroke="#15803d"/><path d="M276 70q-6 20 2 40" stroke="#60a5fa" stroke-width="5" opacity=".5" fill="none"/>', envelope(296,92,.9,'#fff','#d9f99d',4,'#15803d'),
  STEPCARD(10,84,'1','เพื่อนบ้านเดือดร้อน','เป็นผู้เสียหาย (ม.73)','#15803d',ICON('shield','#15803d')), ARROW(70,102,'#15803d'),
  STEPCARD(80,84,'2','ร้านทำ','หยุดใช้ + แก้ + คุย','#ca8a04',ICON('mail','#ca8a04')),
  NOTEBAR(10,128,'จดวันรับคำสั่ง นับ 30 วัน','#15803d',132,-2),
  FLOOR('#365314',.05), DUST(7,3981,'#fff',.45), vignette('so3')]+person('M',292,'#84cc16','#d8a882','calm'))
open('/home/claude/work/s579.js','w').write(o)
