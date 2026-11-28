import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('oivisit','[ภาพประกอบนิทาน เช้าร้านเครื่องสำอางนำเข้า ชั้นขวดครีมเรียงแสงไฟ เจ้าหน้าที่สองคนถือถุงตัวอย่าง ตาชั่งบนเคาน์เตอร์ โทนชมพูกุหลาบกับขาวมุก แสงเช้า] ชั้นครีม ถุงตัวอย่าง ตาชั่ง กระต่าย หญิงประหม่า (น้องม้วนขวา)',
 [bg('oi1','#fce7f3','#fff7ed','#a8a29e'), shelf(232,60,96,('#f9a8d4','#fbcfe8','#f472b6','#fde68a','#c4b5fd')), shelf(232,92,96,('#fda4af','#f9a8d4','#e9d5ff','#fecdd3','#f0abfc')),
  '<g transform="translate(250 118)"><rect width="34" height="22" rx="3" fill="#fff" stroke="#be185d" stroke-width="2"/><text x="17" y="15" text-anchor="middle" font-size="7" fill="#be185d" font-family="sans-serif" font-weight="900">ตัวอย่าง</text></g>',
  '<g transform="translate(300 122)"><rect x="-14" y="10" width="28" height="6" fill="#64748b"/><rect x="-2" y="-2" width="4" height="12" fill="#64748b"/><ellipse cy="-4" rx="14" ry="3" fill="#94a3b8"/></g>', RABBIT(344,142,.4),
  LETTER(122,64,'อำนาจเจ้าหน้าที่',['เก็บตัวอย่างไม่ต้องจ่าย ม.5(1)','ค้น ยึด เมื่อสงสัย ม.5(2)','ดูสมุดบัญชีได้ ม.5(3)'],'#be185d',124,-2,1,12),
  FLOOR('#831843',.05), DUST(7,5921,'#fff',.4), vignette('oi1'), FG('r','#831843',.12)]+person('W',60,'#ec4899','#e8b88f','worried'))
o+=P('oiid','[ภาพประกอบนิทาน ประตูร้านตอนสาย บัตรเจ้าหน้าที่ยื่นมาใกล้กล้อง นาฬิกาแขวนกับรูปพระอาทิตย์ขึ้น-ตก ซองหนังสือแจ้งล่วงหน้า โทนเหลืองอรุณกับฟ้าคราม แสงสาย] บัตร นาฬิกา ดวงอาทิตย์ ซองแจ้ง ชายถามกลับ (น้องม้วนซ้าย)',
 [bg('oi2','#fef9c3','#dbeafe','#a8a29e'), idcard(236,72,-6), wallclock(316,70,12),
  '<g transform="translate(300 112)"><circle r="10" fill="#fbbf24"/><path d="M-22 10h44" stroke="#f59e0b" stroke-width="2"/><text y="24" text-anchor="middle" font-size="7" fill="#92400e" font-family="sans-serif" font-weight="900">ค้นได้แค่กลางวัน</text></g>', envelope(236,112,.8,'#fffaf0','#e6dccb',-6),
  LETTER(56,64,'ก่อนเข้าตรวจ',['ต้องแสดงบัตรเมื่อขอ ม.7','ไม่ด่วน → แจ้งหนังสือก่อน','ค้นเฉพาะขึ้น–ตก ม.6'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,5922,'#fff',.4), vignette('oi2')]+person('M',318,'#3b82f6','#d8a882','calm'))
o+=P('oisearch','[ภาพประกอบนิทาน บ่ายแก่หลังร้าน สมุดบัญชีเปิดบนโต๊ะ หนังสือเรียกให้ถ้อยคำปักบนบอร์ด กุญแจมือเงาจางๆเป็นคำเตือน โทนเขียวมะกอกกับครีม แสงบ่ายเฉียง] สมุดบัญชี บอร์ด หนังสือเรียก ชายตั้งใจ (น้องม้วนกลาง)',
 [bg('oi3','#ecfccb','#fef3c7','#78716c'), LEDGERBOOK(236,96,'#4d7c0f'), PINBOARD(290,62,58,46,[('หนังสือเรียก','#fff'),('ม.5(4)','#fde68a')],'#a16207'),
  STEPCARD(10,84,'1','ไม่ส่งเอกสาร','ม.45 คุก ≤ 1 เดือน','#dc2626',ICON('mail','#dc2626')), ARROW(70,102,'#ecfccb'),
  STEPCARD(80,84,'2','ไปไม่ได้','ทำหนังสือขอเลื่อน','#4d7c0f',ICON('pen','#4d7c0f')),
  NOTEBAR(10,128,'ท้องถิ่นตรวจได้ถ้าได้รับมอบ ม.8','#4d7c0f',150,-2),
  FLOOR('#000',.12), DUST(7,5923,'#ecfccb',.45), vignette('oi3')]+person('M',292,'#65a30d','#d8a882','calm'))
open('/home/claude/work/s592.js','w').write(o)
