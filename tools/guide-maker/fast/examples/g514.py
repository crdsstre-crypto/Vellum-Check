import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
BADGE=lambda x,y,c,fake=False: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"40\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"2\"/><rect width=\"30\" height=\"9\" fill=\"{c}\"/><circle cx=\"15\" cy=\"20\" r=\"6\" fill=\"#e2e8f0\"/><path d=\"M6 32h18\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>"+(f"<text x=\"15\" y=\"38\" text-anchor=\"middle\" font-size=\"5\" fill=\"#dc2626\" {F}>ปลอม?</text>" if fake else "")+"</g>"
ENV2=lambda x,y,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"30\" height=\"18\" rx=\"2\" fill=\"#fef3c7\" stroke=\"#a16207\"/><path d=\"M0 0l15 10l15 -10\" stroke=\"#a16207\" fill=\"none\"/><text x=\"15\" y=\"16\" text-anchor=\"middle\" font-size=\"5\" fill=\"#a16207\" {F}>฿</text></g>"
SEALTAPE=lambda x,y,w=60: f"<g transform=\"translate({x} {y})\"><rect width=\"{w}\" height=\"12\" fill=\"#fef08a\" stroke=\"#ca8a04\"/><text x=\"{w/2}\" y=\"9\" text-anchor=\"middle\" font-size=\"6\" fill=\"#a16207\" {F}>ห้ามแกะ · ยึดแล้ว</text></g>"
# ตอน 1 กลางคืนหลังปิดร้านมือถือ ลิ้นชักเงินขาด โทนน้ำเงินกลางคืนกับเขียวจอ แสงจอกล้องวงจรปิด สิ่งมีชีวิต: แมวดำนั่งบนเคาน์เตอร์
o+=P('frstaff','[ภาพประกอบนิทาน กลางคืนหลังปิดร้านมือถือ ลิ้นชักเงินขาด โทนน้ำเงินกลางคืนกับเขียวจอ แสงจอกล้องวงจรปิด] จอกล้องวงจรปิด ลิ้นชักเงินเปิด ใบแจ้งความ แมวดำบนเคาน์เตอร์ ชายร้องไห้ถือคลิปบอร์ด (น้องม้วนขวา)',
 [bg('fs1','#1e3a8a','#0f172a','#475569'), '<g transform="translate(244 66)"><rect width="76" height="46" rx="3" fill="#0f172a" stroke="#64748b"/>'+''.join(f'<rect x="{4+(i%2)*36}" y="{4+(i//2)*20}" width="32" height="17" fill="#14532d"/>' for i in range(4))+'</g><g transform="translate(250 124)"><rect width="40" height="14" fill="#a16207"/><rect x="4" y="4" width="32" height="6" fill="#facc15"/></g>', cat(306,120,'#1f2937',.42),
  LETTER(122,66,'แจ้งตามจริง',['เงินขาด 8,000 ช่วง 18–21น.','สงสัย ยังไม่ระบุชื่อ','แนบไฟล์กล้อง'],'#0f766e',104,-2,1,12),
  SEAL(134,142,'ระบุชื่อมั่วๆ = เสี่ยง ม.172','#dc2626',-4,98),
  FLOOR('#000',.12), DUST(7,558,'#a7f3d0',.4), vignette('fs1'), FG('r','#000',.16)]+person('M',60,'#0d9488','#d8a882','worried'))
# ตอน 2 บ่ายที่บริษัทประกัน ยื่นเคลมปลอม โทนส้มอ่อนกับเทา แสงบ่ายจากหน้าต่างบานใหญ่ สิ่งมีชีวิต: นกฮูกตุ๊กตาบนโต๊ะ
o+=P('frinsure','[ภาพประกอบนิทาน บ่ายที่บริษัทประกัน ยื่นเคลมพร้อมบันทึกแจ้งความปลอม โทนส้มอ่อนกับเทา แสงบ่ายจากหน้าต่างบานใหญ่] ใบเคลม บันทึกแจ้งงัดร้าน การ์ดคุกและปรับ นกฮูก หญิงคิดถือเงิน (น้องม้วนซ้าย)',
 [bg('fs2','#ffedd5','#f1f5f9','#a8a29e'), window(244,56,62,46), OWL(272,118,.4), desk(220,136,100),
  COMPARE2(56,66,132,50,'ที่แจ้ง','ความจริง',[('โดนงัดร้าน','ลืมเก็บเอง'),('ของหาย 12 เครื่อง','หาย 2 เครื่อง')],'#dc2626','#16a34a'),
  NOTEBAR(56,122,'รู้ว่าไม่มีความผิดแต่แจ้ง = ม.173 คุก + ปรับ','#ea580c',150,-2),
  FLOOR('#7c2d12',.07), DUST(9,559,'#fff',.5), vignette('fs2')]+person('W',318,'#f97316','#e8b88f','calm'))
# ตอน 3 เช้าหน้าศาล ถอนฟ้อง โทนม่วงพลับกับทอง แสงเช้าบนเสาศาล สิ่งมีชีวิต: นกพิราบเกาะบันได
o+=P('frsue','[ภาพประกอบนิทาน เช้าหน้าศาล ร้านฟ้องคู่แข่งด้วยเรื่องเท็จแล้วลุแก่โทษถอนฟ้อง โทนม่วงพลับกับทอง แสงเช้าบนเสาศาล] การ์ดฟ้องเท็จกับถอนฟ้อง นกพิราบ ชายสวมแว่นโล่งใจถือป้าย (น้องม้วนกลาง)',
 [bg('fs3','#ede9fe','#fef3c7','#a78bfa'), columns(214,2), GAVEL(232,126,.45), bird(252,142,'#94a3b8'),
  STEPCARD(10,84,'1','ฟ้องเท็จต่อศาล','ม.175 ≤ 5 ปี + ปรับ','#dc2626',ICON('shield','#dc2626')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','ถอนก่อนพิพากษา','ม.176 ลด/ไม่ลงโทษ','#16a34a',ICON('pen','#16a34a')),
  NOTEBAR(10,128,'ตรวจหลักฐานก่อนแจ้งความหรือฟ้อง','#7c3aed',124,-2),
  FLOOR('#4c1d95',.07), DUST(7,560,'#fff',.45), vignette('fs3')]+person('M',292,'#8b5cf6','#d8a882','smile',glasses=True))
open('/home/claude/work/s514.js','w').write(o)
