import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('otrally','[ภาพประกอบนิทาน สายหน้าร้านเสื้อผ้าในห้าง ป้ายประท้วงกระดาษ คนนอกถือโทรโข่ง เชือกกั้น หุ่นโชว์เสื้อ โทนชมพูบานเย็นกับเทาห้าง แสงไฟห้างขาว] หุ่นโชว์ โทรโข่ง เชือกกั้น นกทูแคน ชายกังวล (น้องม้วนขวา)',
 [bg('ot1','#fce7f3','#e5e7eb','#a8a29e'), '<g transform="translate(300 64)"><circle cx="10" cy="6" r="7" fill="#e7e5e4"/><path d="M0 14h20l-4 34h-12z" fill="#db2777"/><path d="M10 48v26" stroke="#78716c" stroke-width="2"/></g>', '<g transform="translate(232 82) rotate(-12)"><path d="M0 8l20 -8v28l-20 -8z" fill="#f59e0b"/><rect x="-6" y="6" width="8" height="10" fill="#92400e"/></g>', '<path d="M220 126h84" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 4"/><rect x="218" y="122" width="6" height="22" fill="#475569"/><rect x="300" y="122" width="6" height="22" fill="#475569"/>', TOUCAN(342,142,.38),
  LETTER(122,64,'คนนอกห้ามร่วม',['ไม่ใช่นายจ้าง/ลูกจ้าง/ผู้แทน','ห้ามร่วมเจรจา/ชุมนุม (ม.32)','ฝ่าฝืน คุก ≤ 1 ด. (ม.137)'],'#db2777',124,-2,1,12),
  FLOOR('#831843',.05), DUST(7,2060,'#fff',.4), vignette('ot1'), FG('r','#831843',.12)]+person('M',60,'#ec4899','#d8a882','worried'))
o+=P('otnotice','[ภาพประกอบนิทาน กลางคืนประตูเหล็กม้วนครึ่งปิด นาฬิกาดิจิทัล 24:00 ซองหนังสือแจ้งนัดหยุดงาน โทนน้ำเงินกลางคืนกับเขียวนีออน แสงไฟฉุกเฉิน] ประตูม้วน นาฬิกา 24 ชม. ซองหนังสือ แมว หญิงถือหนังสือ (น้องม้วนซ้าย)',
 [bg('ot2','#1e3a8a','#a7f3d0','#57534e'), rolldoor(222,62,62,72), '<g transform="translate(292 64)"><rect width="52" height="22" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="2"/><text x="26" y="16" text-anchor="middle" font-size="11" fill="#34d399" font-family="monospace" font-weight="900">24:00</text></g>', envelope(300,104,.9,'#fff','#d1fae5',4,'#047857'),
  LETTER(56,64,'นัดหยุด/ปิดงาน',['แจ้งเป็นหนังสือ ≥ 24 ชม.','ห้ามช่วงชี้ขาด/ทำตามแล้ว','ฝ่าฝืน คุก ≤ 6 ด. (ม.139)'],'#047857',146,-2,1,12),
  FLOOR('#000',.14), DUST(6,2061,'#a7f3d0',.4), vignette('ot2')]+person('W',318,'#10b981','#e8b88f','calm'))
o+=P('otbribe','[ภาพประกอบนิทาน ค่ำในร้านกาแฟเงียบ ซองเงินถูกเลื่อนบนโต๊ะ มือปัดกลับ แว่นขยาย โทนน้ำตาลคาราเมลกับเขียวหยก แสงโคมห้อยต่ำ] ซองเงิน ถ้วยกาแฟ โคม ชายปฏิเสธ (น้องม้วนกลาง)',
 [bg('ot3','#fef3c7','#ccfbf1','#78716c'), lamp(300,40,'#fde68a'), '<g transform="translate(236 110)"><rect width="92" height="8" rx="2" fill="#78350f"/><path d="M8 8v24M84 8v24" stroke="#78350f" stroke-width="4"/></g>', '<g transform="translate(250 96) rotate(-8)"><rect width="30" height="16" rx="2" fill="#fde68a" stroke="#a16207"/><text x="15" y="12" text-anchor="middle" font-size="9" fill="#a16207" font-family="sans-serif" font-weight="900">฿</text></g>', SEAL(296,90,'ไม่รับ','#dc2626',-8,46),
  STEPCARD(10,84,'1','ผู้แทนรับเงิน','คุก ≤ 1 ปี (ม.128)','#b45309',ICON('coin','#b45309')), ARROW(70,102,'#b45309'),
  STEPCARD(80,84,'2','ที่ปรึกษารับเงิน','โทษเท่ากัน (ม.129)','#0f766e',ICON('shield','#0f766e')),
  NOTEBAR(10,128,'ผู้แทนต้องรายงานทุกการติดต่อ','#b45309',132,-2),
  FLOOR('#451a03',.06), DUST(7,2062,'#fff',.4), vignette('ot3')]+person('M',292,'#0d9488','#d8a882','calm'))
open('/home/claude/work/s560.js','w').write(o)
