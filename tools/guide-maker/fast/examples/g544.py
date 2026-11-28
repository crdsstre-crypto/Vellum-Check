import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('isvisit','[ภาพประกอบนิทาน บ่ายในมินิมาร์ท เจ้าหน้าที่สองคนโชว์บัตร ชั้นสินค้าเรียง โทนเขียวมะนาวกับขาว แสงฟลูออเรสเซนต์] ชั้นสินค้า บัตรเจ้าหน้าที่ กล่องเอกสาร เต่า ชายสงบ (น้องม้วนขวา)',
 [bg('is1','#ecfccb','#f8fafc','#a8a29e'), shelf(286,70,64), '<g transform="translate(222 82) rotate(-6)"><rect width="40" height="26" rx="3" fill="#fff" stroke="#4d7c0f" stroke-width="2"/><circle cx="11" cy="13" r="6" fill="#d9f99d"/><rect x="20" y="8" width="16" height="3" fill="#4d7c0f"/><rect x="20" y="15" width="12" height="3" fill="#a3e635"/></g>', box(234,124,30,22), TURTLE(330,142,.4),
  LETTER(122,104,'เจ้าหน้าที่มาตรวจ',['เวลาทำการ เข้าตรวจ/ถ่ายรูปได้ (ม.80)'],'#4d7c0f',124,-2,1,12),
  FLOOR('#365314',.05), DUST(7,667,'#fff',.45), vignette('is1')]+person('M',60,'#65a30d','#d8a882','calm'))
o+=P('issearch','[ภาพประกอบนิทาน สามทุ่มหน้าร้าน รถส่งของจอด นาฬิกาบอก 21:00 ไฟฉาย โทนกรมท่าเข้มกับเหลืองไฟฉาย แสงไฟถนน] รถส่งของ นาฬิกา 21:00 ไฟฉาย แมวดำ หญิงตื่นตัวถือบัตร (น้องม้วนซ้าย)',
 [bg('is2','#1e3a8a','#fde68a','#57534e'), '<g transform="translate(206 104)"><rect width="60" height="30" rx="4" fill="#e2e8f0"/><path d="M60 8h14l8 10v12h-22z" fill="#cbd5e1"/><circle cx="14" cy="32" r="6" fill="#1e293b"/><circle cx="66" cy="32" r="6" fill="#1e293b"/></g>', '<g transform="translate(300 70)"><circle r="14" fill="#fff" stroke="#1d4ed8" stroke-width="2.4"/><text y="4" text-anchor="middle" font-size="7" fill="#1d4ed8" font-family="sans-serif" font-weight="900">21:00</text></g>', cat(170,150,'#1f2937',.7),
  LETTER(56,64,'ขอค้นรถตอนสามทุ่ม',['ต้องมีเหตุอันควรเชื่อ','ค้นในเวลาทำการ/กลางวัน','ขอดูบัตร (ม.82)'],'#1d4ed8',124,-2,1,12),
  FLOOR('#000',.14), DUST(7,668,'#fde68a',.45), vignette('is2')]+person('W',318,'#3b82f6','#e8b88f','alert'))
o+=P('isregister','[ภาพประกอบนิทาน เช้าที่เคาน์เตอร์ร้าน ทะเบียนผู้ประกันตนเปิดอยู่ กล้องถ่ายเอกสาร โทนส้มพีชกับฟ้าคราม แสงเช้า] ทะเบียน กล้อง แฟ้มเรียงเดือน เพนกวิน หญิงตรวจสอบ (น้องม้วนกลาง)',
 [bg('is3','#ffedd5','#e0f2fe','#a8a29e'), LEDGERBOOK(232,92,'#0369a1'), '<g transform="translate(300 80)"><rect width="30" height="20" rx="3" fill="#334155"/><circle cx="15" cy="10" r="6" fill="#94a3b8"/><rect x="20" y="-4" width="8" height="5" fill="#334155"/></g>', PENGUIN(330,140,.4),
  STEPCARD(10,84,'1','ทะเบียนผู้ประกันตน','เก็บที่ร้าน (ม.84)','#0369a1',ICON('pen','#0369a1')), ARROW(70,102,'#0369a1'),
  STEPCARD(80,84,'2','ไม่มี/ขัดขวาง','≤ 1 เดือน/1 หมื่น','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(10,128,'สลิป + ใบส่งสมทบ เรียงเป็นเดือน','#0369a1',124,-2),
  FLOOR('#0c4a6e',.05), DUST(7,669,'#fff',.45), vignette('is3')]+person('W',292,'#f59e0b','#e8b88f','inspect'))
open('/home/claude/work/s544.js','w').write(o)
