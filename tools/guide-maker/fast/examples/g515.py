import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
BADGE=lambda x,y,c,fake=False: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"40\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"2\"/><rect width=\"30\" height=\"9\" fill=\"{c}\"/><circle cx=\"15\" cy=\"20\" r=\"6\" fill=\"#e2e8f0\"/><path d=\"M6 32h18\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>"+(f"<text x=\"15\" y=\"38\" text-anchor=\"middle\" font-size=\"5\" fill=\"#dc2626\" {F}>ปลอม?</text>" if fake else "")+"</g>"
ENV2=lambda x,y,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"30\" height=\"18\" rx=\"2\" fill=\"#fef3c7\" stroke=\"#a16207\"/><path d=\"M0 0l15 10l15 -10\" stroke=\"#a16207\" fill=\"none\"/><text x=\"15\" y=\"16\" text-anchor=\"middle\" font-size=\"5\" fill=\"#a16207\" {F}>฿</text></g>"
SEALTAPE=lambda x,y,w=60: f"<g transform=\"translate({x} {y})\"><rect width=\"{w}\" height=\"12\" fill=\"#fef08a\" stroke=\"#ca8a04\"/><text x=\"{w/2}\" y=\"9\" text-anchor=\"middle\" font-size=\"6\" fill=\"#a16207\" {F}>ห้ามแกะ · ยึดแล้ว</text></g>"
CAR=lambda x,y,c: f'<g transform="translate({x} {y})"><path d="M0 0h50l-4 -12h-30l-8 12z" fill="{c}"/><rect x="-2" y="0" width="56" height="12" rx="3" fill="{c}"/><circle cx="12" cy="13" r="5" fill="#1e293b"/><circle cx="42" cy="13" r="5" fill="#1e293b"/><rect x="16" y="-10" width="12" height="8" fill="#bae6fd"/></g>'
# ตอน 1 เช้าที่อู่ซ่อมรถ หมายเรียกพยาน โทนเทาน้ำมันกับเหลืองเครื่องมือ แสงเช้าจากประตูอู่ สิ่งมีชีวิต: สุนัขนอนข้างยางรถ
o+=P('smsummons','[ภาพประกอบนิทาน เช้าที่อู่ซ่อมรถ ได้หมายเรียกพยาน โทนเทาน้ำมันกับเหลืองเครื่องมือ แสงเช้าจากประตูอู่] หมายเรียกพนักงานสอบสวน หมายศาล แฟลชไดรฟ์ไฟล์กล้อง รถยกบนลิฟต์ สุนัขนอนข้างยาง หญิงเศร้าถือโล่ (น้องม้วนขวา)',
 [bg('sm1','#f1f5f9','#fef9c3','#94a3b8'), toolrack(256,70), CAR(250,118,'#dc2626'), dog(312,146,'#d6a46a',.42),
  STEPCARD(122,66,'1','หมายตำรวจ','ไม่ไป ม.168 · ไม่ส่ง ม.169','#1d4ed8',ICON('mail','#1d4ed8')),
  STEPCARD(122,108,'2','หมายศาล','ไม่ไป ม.170 ≤ 6 ด.','#7c3aed',ICON('clock','#7c3aed')),
  FLOOR('#334155',.07), DUST(9,561,'#fff',.4), vignette('sm1'), FG('r','#334155',.14)]+person('W',60,'#64748b','#e8b88f','worried'))
# ตอน 2 บ่ายในห้องพิจารณาคดี คอกพยาน โทนไม้สักกับเขียวผ้าโต๊ะ แสงบ่ายจากหน้าต่างสูง สิ่งมีชีวิต: นกฮูกแกะสลักบนบัลลังก์
o+=P('smperjury','[ภาพประกอบนิทาน บ่ายในห้องพิจารณาคดี คอกพยาน โทนไม้สักกับเขียวผ้าโต๊ะ แสงบ่ายจากหน้าต่างสูง] คอกพยาน คำสาบาน การ์ดเบิกความเท็จกับกลับใจ นกฮูกแกะสลัก ชายสวมแว่นมั่นใจถือปากกา (น้องม้วนซ้าย)',
 [bg('sm2','#fef3c7','#d1fae5','#a8a29e'), judgebench(236,146,90), OWL(286,76,.36),
  LETTER(56,64,'ที่คอกพยาน',['ไม่สาบาน/ไม่ตอบ → ม.171','เบิกความเท็จ → ม.177 ≤ 5–7 ปี','กลับใจก่อนจบ → ม.182 ไม่ต้องรับโทษ'],'#047857',124,-2,1,12),
  FLOOR('#78350f',.07), DUST(9,562,'#fff',.5), vignette('sm2')]+person('M',318,'#059669','#d8a882','firm',glasses=True))
# ตอน 3 เย็นที่โต๊ะคอมในร้าน ตัดต่อคลิป โทนม่วงจอกับส้มโคม แสงจอคอม สิ่งมีชีวิต: แฮมสเตอร์ในกรงข้างจอ
o+=P('smfake','[ภาพประกอบนิทาน เย็นที่โต๊ะคอมในร้าน ตัดต่อคลิปกล้องวงจรปิด โทนม่วงจอกับส้มโคม แสงจอคอม] จอตัดต่อวิดีโอ การ์ดหลักฐานเท็จชั้นตำรวจกับชั้นศาล แฮมสเตอร์ หญิงหัวเราะถือร่ม (น้องม้วนกลาง)',
 [bg('sm3','#ede9fe','#ffedd5','#a78bfa'), '<g transform="translate(206 92)"><rect width="56" height="38" rx="3" fill="#1e1b4b"/><rect x="4" y="4" width="48" height="22" fill="#4c1d95"/><path d="M6 30h44" stroke="#f0abfc" stroke-width="3"/><path d="M20 30v-4M34 30v-4" stroke="#facc15" stroke-width="2"/></g>', HAMSTER(276,138,.45),
  STEPCARD(10,84,'1','ทำหลักฐานเท็จ','ให้ตำรวจ ม.179','#b45309',ICON('pen','#b45309')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','ยื่นศาล','ม.180 ≤ 3–7 ปี','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(10,128,'ส่งไฟล์ต้นฉบับเท่านั้น ห้ามตัดต่อ','#7c3aed',124,-2),
  FLOOR('#3b0764',.07), DUST(7,563,'#f0abfc',.45), vignette('sm3')]+person('W',292,'#a855f7','#e8b88f','smile'))
open('/home/claude/work/s515.js','w').write(o)
