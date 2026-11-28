import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rfwhy','[ภาพประกอบนิทาน ตีสองหน้ารีสอร์ตริมเขา โคมไฟทางเดิน ลำโพงบลูทูธ ขวดเปล่า แขกอื่นปิดหู โทนน้ำเงินกลางคืนกับเหลืองโคม แสงโคมทางเดิน] โคมทางเดิน ลำโพง ภูเขา หมาจิ้งจอก ชายผู้จัดการ (น้องม้วนขวา)',
 [bg('rf1','#1e1b4b','#fde68a','#57534e'), '<path d="M220 110l40 -46l30 30l26 -24l34 40z" fill="#312e81"/>', '<g transform="translate(244 106)"><rect width="24" height="30" rx="5" fill="#334155"/><circle cx="12" cy="16" r="7" fill="#64748b"/></g>', ''.join(f'<path d="M{276+i*6} 98q4 -6 0 -12" stroke="#fde68a" stroke-width="2" fill="none"/>' for i in range(3)), FOX(340,142,.4),
  LETTER(122,64,'ปฏิเสธได้ 4 เหตุ',['สงสัยมั่วสุม/ทำผิด/รบกวนแขก','จ่ายค่าห้องไม่ได้','โรคติดต่อ / เหตุตามประกาศ'],'#4338ca',124,-2,1,12),
  FLOOR('#000',.14), DUST(7,3575,'#fde68a',.4), vignette('rf1'), FG('r','#1e1b4b',.14)]+person('M',60,'#6366f1','#d8a882','calm'))
o+=P('rfsick','[ภาพประกอบนิทาน เช้าที่ล็อบบี้ ขวดเจลล้างมือ หน้ากากอนามัย โทรศัพท์โทรหาสาธารณสุข เทอร์โมมิเตอร์ โทนฟ้าสะอาดกับเขียวมิ้นต์ แสงเช้าใส] เจล หน้ากาก เทอร์โมมิเตอร์ หญิงห่วงใย (น้องม้วนซ้าย)',
 [bg('rf2','#e0f2fe','#d1fae5','#a8a29e'), THERMO(240,78,'38.5°','#ef4444'), '<g transform="translate(272 100)"><rect width="16" height="30" rx="4" fill="#a5f3fc"/><rect x="4" y="-6" width="8" height="8" fill="#0e7490"/></g>', '<g transform="translate(300 96)"><rect width="30" height="16" rx="6" fill="#fff" stroke="#0e7490"/><path d="M0 8h-6M30 8h6" stroke="#0e7490" stroke-width="2"/></g>',
  LETTER(56,64,'แขกป่วยโรคติดต่อ',['ปฏิเสธได้ถ้ามีเหตุอันควรเชื่อ','รับไว้ → แจ้งสาธารณสุข (ม.39)','เกิดภัย → ดูแลผู้พัก (ม.34)'],'#0e7490',146,-2,1,12),
  FLOOR('#164e63',.05), DUST(6,3576,'#fff',.4), vignette('rf2')]+person('W',318,'#22d3ee','#e8b88f','worried'))
o+=P('rfpolice','[ภาพประกอบนิทาน ดึกที่ทางเดินห้องพัก ประตูห้องแง้ม ไฟฉาย โทรศัพท์แจ้งตำรวจ บันทึกเหตุการณ์ โทนกรมท่ากับแดงไซเรนจาง แสงไฟฉาย] ประตูแง้ม ไฟฉาย โทรศัพท์ ชายจดบันทึก (น้องม้วนกลาง)',
 [bg('rf3','#1e293b','#fecaca','#57534e'), '<g transform="translate(240 62)"><rect width="44" height="76" fill="#78350f"/><rect x="28" y="0" width="16" height="76" fill="#451a03" transform="skewY(-8)"/><circle cx="8" cy="40" r="3" fill="#fde68a"/></g>', '<path d="M300 100l40 -20v40z" fill="#fde68a" opacity=".35"/><rect x="290" y="96" width="14" height="8" rx="2" fill="#475569"/>',
  STEPCARD(10,84,'1','สงสัยมั่วสุม','แจ้งตำรวจทันที (ม.38)','#dc2626',ICON('mail','#dc2626')), ARROW(70,102,'#fecaca'),
  STEPCARD(80,84,'2','ไม่แจ้ง','ปรับ 2 หมื่น–1 แสน (ม.56)','#475569',ICON('coin','#475569')),
  NOTEBAR(10,128,'ปฏิเสธไม่มีเหตุ ปรับ 5,000–20,000','#dc2626',132,-2),
  FLOOR('#000',.14), DUST(7,3577,'#fecaca',.45), vignette('rf3')]+person('M',292,'#f87171','#d8a882','calm'))
open('/home/claude/work/s575.js','w').write(o)
