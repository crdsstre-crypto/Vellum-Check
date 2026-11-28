import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bodcheck','[ภาพประกอบนิทาน สายในห้องตรวจบัญชีส่วนแบ่ง โทนเทาฟ้ากับเหลือง] บัญชีส่วนแบ่งยอดของร้านถูกคิดผิด หนังสือพิมพ์ประกาศ แจ้งล่วงหน้า 7 วัน นกฮูกบนตู้ ชายใส่แว่นชูมือโล่งใจถือปากกา (น้องม้วนซ้าย)',
 [bg('bo4','#e2e8f0','#fef9c3','#94a0a8'), OWL(270,104,.32), '<g transform="translate(196 112)"><rect x="0" y="0" width="40" height="30" fill="#f8fafc" stroke="#94a3b8"/><rect x="3" y="3" width="34" height="6" fill="#334155"/><path d="M3 14h34M3 19h34M3 24h22" stroke="#cbd5e1" stroke-width="2"/></g>'+TX(216,108,'แจ้ง ≥ 7 วัน',4.2,'#334155','middle'),
  DOC(56,66,96,70,'บัญชีส่วนแบ่ง',[('ร้านวัสดุ: คิดจาก 120,000','#b91c1c'),('ควรเป็น 180,000','#047857'),('เจ้าหนี้ X: 3 ล้าน ?','#b91c1c'),('ตรวจวันที่ 10 ธ.ค.','#1d4ed8')],'#475569',False),
  FLOOR('#334155',.07), DUST(8,471,'#fff',.4), vignette('bo4'), FG('r','#334155',.3)]+person('M',318,'#475569','#d8a882','smile',glasses=True))
o+=P('bodobject','[ภาพประกอบนิทาน บ่ายหน้าศาลล้มละลาย โทนม่วงอ่อนกับทอง] สองขั้นคัดค้าน เจ้าพนักงานกับศาล วงนับ 7 วัน ป้ายเลื่อนจ่าย คาปิบาราหน้าบันได หญิงกอดอกหัวเราะถือเหรียญ (น้องม้วนขวา)',
 [bg('bo5','#ede9fe','#fef3c7','#9a98b8'), COURTHOUSE(244,118,.55), '<g transform="translate(122 72)"><rect x="0" y="0" width="64" height="22" rx="4" fill="#fff" stroke="#6d28d9"/></g>'+TX(154,86,'1 ค้านเจ้าพนักงาน',4.6,'#6d28d9','middle')+'<path d="M154 96v8" stroke="#6d28d9" stroke-width="2"/><g transform="translate(122 106)"><rect x="0" y="0" width="64" height="22" rx="4" fill="#fff" stroke="#b91c1c"/></g>'+TX(154,120,'2 ร้องศาลใน 7 วัน',4.6,'#b91c1c','middle'),
  DAYRING(206,90,'7','วัน',.5,'#b91c1c',14), CAPY(282,146,.3), FLOOR('#4c1d95',.07), DUST(6,472,'#fde68a',.4), vignette('bo5'), FG('l','#4c1d95',.3)]+person('W',60,'#7c3aed','#e8b896','smile'))
o+=P('bodprep','[ภาพประกอบนิทาน เย็นในร้านวัสดุตกแต่ง โทนส้มพีชกับฟ้า] เช็กลิสต์เมื่อได้แจ้งให้ตรวจบัญชี ม้วนวอลเปเปอร์ เครื่องคิดเลข เพนกวินบนชั้น ชายกางมือง่วง (น้องม้วนกลาง)',
 [bg('bo6','#ffedd5','#e0f2fe','#c4a68a'), lamp(220,0,'#fde68a',18), ''.join(f'<rect x="{220+i*14}" y="104" width="10" height="42" rx="4" fill="{c}"/>' for i,c in enumerate(['#fda4af','#93c5fd','#fde68a'])), PENGUIN(274,146,.3), '<g transform="translate(134 118)"><rect x="-14" y="-16" width="28" height="34" rx="3" fill="#475569"/><rect x="-10" y="-12" width="20" height="8" fill="#bbf7d0"/></g>',
  DOC(10,64,100,78,'ตรวจบัญชีส่วนแบ่ง',[('☑ จดวันนัดตรวจ','#334155'),('☑ เทียบยอดกับคำสั่ง','#047857'),('☑ ผิด → ค้านวันนั้น','#b91c1c'),('☑ จดวันฟังคำสั่ง','#334155'),('☑ ร้องศาลใน 7 วัน','#b91c1c')],'#c2410c',False),
  FLOOR('#7c2d12',.06), DUST(9,473,'#fde68a',.5), lightpool(170,150,80,'#fff7ed',.4), vignette('bo6')]+person('M',292,'#ea580c','#d8a882','calm'))
open('/home/claude/work/s378.js','w').write(o)
