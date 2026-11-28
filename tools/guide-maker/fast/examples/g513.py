import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
BADGE=lambda x,y,c,fake=False: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"40\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"2\"/><rect width=\"30\" height=\"9\" fill=\"{c}\"/><circle cx=\"15\" cy=\"20\" r=\"6\" fill=\"#e2e8f0\"/><path d=\"M6 32h18\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>"+(f"<text x=\"15\" y=\"38\" text-anchor=\"middle\" font-size=\"5\" fill=\"#dc2626\" {F}>ปลอม?</text>" if fake else "")+"</g>"
ENV2=lambda x,y,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"30\" height=\"18\" rx=\"2\" fill=\"#fef3c7\" stroke=\"#a16207\"/><path d=\"M0 0l15 10l15 -10\" stroke=\"#a16207\" fill=\"none\"/><text x=\"15\" y=\"16\" text-anchor=\"middle\" font-size=\"5\" fill=\"#a16207\" {F}>฿</text></g>"
SEALTAPE=lambda x,y,w=60: f"<g transform=\"translate({x} {y})\"><rect width=\"{w}\" height=\"12\" fill=\"#fef08a\" stroke=\"#ca8a04\"/><text x=\"{w/2}\" y=\"9\" text-anchor=\"middle\" font-size=\"6\" fill=\"#a16207\" {F}>ห้ามแกะ · ยึดแล้ว</text></g>"
# ตอน 1 บ่ายในร้านเครื่องสำอางนำเข้า เจ้าหน้าที่ยึดลัง โทนชมพูอมม่วงกับเทา แสงหลอดไฟร้าน สิ่งมีชีวิต: แมวขาวหลบใต้ชั้น
o+=P('sefight','[ภาพประกอบนิทาน บ่ายในร้านเครื่องสำอางนำเข้า เจ้าหน้าที่ยึดลังสินค้า โทนชมพูอมม่วงกับเทา แสงหลอดไฟร้าน] ลังติดตรา ลูกจ้างยืนขวางประตู การ์ดด่ากับขวาง แมวขาวใต้ชั้น หญิงตกใจถือแก้ว (น้องม้วนขวา)',
 [bg('se1','#fae8ff','#f1f5f9','#a8a29e'), '<g transform="translate(236 104)">'+''.join(f'<rect x="{i*24}" y="{-(i%2)*14}" width="22" height="22" fill="#d8a86a" stroke="#a16207"/><rect x="{i*24}" y="{8-(i%2)*14}" width="22" height="6" fill="#fef08a"/>' for i in range(3))+'</g>', cat(316,140,'#f5f5f4',.4),
  STEPCARD(122,66,'1','ด่า "รีดไถ"','ม.136 ≤ 1 ปี','#be185d',ICON('mail','#be185d')),
  STEPCARD(122,108,'2','ยืนขวางประตู','ม.138 ≤ 1 ปี','#dc2626',ICON('shield','#dc2626')),
  FLOOR('#701a75',.06), DUST(7,555,'#fff',.4), vignette('se1'), FG('r','#701a75',.14)]+person('W',60,'#c026d3','#e8b88f','worried'))
# ตอน 2 กลางคืนหน้าโกดัง ตราถูกแกะ โทนน้ำเงินดึกกับเหลืองตรา แสงไฟฉาย สิ่งมีชีวิต: ค้างคาวบินผ่าน
o+=P('sebreak','[ภาพประกอบนิทาน กลางคืนหน้าโกดัง ตราที่เจ้าหน้าที่ติดถูกแกะ โทนน้ำเงินดึกกับเหลืองตรา แสงไฟฉาย] เทปตรายึดขาด ลังถูกขนออก รถกระบะ ค้างคาวบินผ่าน ชายสวมแว่นหัวเราะถือปฏิทิน (น้องม้วนซ้าย)',
 [bg('se2','#1e293b','#334155','#475569'), rolldoor(232,66,74,78), '<g transform="translate(234 100) rotate(-12)"><rect width="34" height="12" fill="#fef08a" stroke="#ca8a04"/></g><g transform="translate(274 96) rotate(14)"><rect width="30" height="12" fill="#fef08a" stroke="#ca8a04"/></g>', '<g transform="translate(286 64)"><path d="M0 0q-6 -6 -12 0q4 -2 6 2q2 -4 6 -2zM0 0q6 -6 12 0q-4 -2 -6 2q-2 -4 -6 -2z" fill="#0f172a"/></g>',
  LETTER(56,66,'ห้ามทำ!',['แกะตรายึด → ม.141 ≤ 2 ปี','ขนของที่ถูกยึด → ม.142','แม้เจ้าหน้าที่สั่งให้เราเก็บเอง'],'#ca8a04',118,-2,1,12),
  FLOOR('#000',.14), DUST(7,556,'#fde68a',.45), vignette('se2')]+person('M',318,'#ca8a04','#d8a882','smile',glasses=True))
# ตอน 3 เช้าที่สถานีตำรวจ แจ้งว่าของถูกขโมย โทนฟ้าครามกับครีม แสงเช้าเย็นตา สิ่งมีชีวิต: นกพิราบบนราวระเบียง
o+=P('selie','[ภาพประกอบนิทาน เช้าที่สถานีตำรวจ แจ้งว่าของถูกขโมยทั้งที่ขนไปเอง โทนฟ้าครามกับครีม แสงเช้า] การ์ดแจ้งเท็จกับทางที่ถูก นกพิราบบนราว หญิงมั่นใจถือร่ม (น้องม้วนกลาง)',
 [bg('se3','#dbeafe','#fefce8','#94a3b8'), SIGN(196,96,56,'สถานีตำรวจ','#1e3a8a','#fff',6.5), bird(240,92,'#94a3b8'),
  STEPCARD(10,84,'1','แจ้งว่าถูกขโมย','ม.137 แจ้งเท็จ','#dc2626',ICON('mail','#dc2626')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'2','ทางที่ถูก','คัดค้านด้วยเอกสาร','#16a34a',ICON('pen','#16a34a')),
  NOTEBAR(10,128,'ห้ามแตะตรา ห้ามย้ายของ พูดสุภาพ','#1d4ed8',124,-2),
  FLOOR('#1e3a8a',.07), DUST(7,557,'#fff',.45), vignette('se3')]+person('W',292,'#3b82f6','#e8b88f','firm'))
open('/home/claude/work/s513.js','w').write(o)
