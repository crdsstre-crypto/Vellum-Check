import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
TAG=lambda x,y,t,c="#dc2626": f"<g transform=\"translate({x} {y}) rotate(-6)\"><rect width=\"44\" height=\"16\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"1.6\"/><circle cx=\"6\" cy=\"8\" r=\"2\" fill=\"{c}\"/><text x=\"26\" y=\"11\" text-anchor=\"middle\" font-size=\"6\" fill=\"{c}\" {F}>{t}</text></g>"
BIKE=lambda x,y,c: f'<g transform="translate({x} {y})"><circle r="9" fill="none" stroke="#1e293b" stroke-width="2.4"/><circle cx="34" r="9" fill="none" stroke="#1e293b" stroke-width="2.4"/><path d="M0 0l12 -16h14l8 16M12 -16l-4 -6h-6M26 -16l2 -6" stroke="{c}" stroke-width="2.6" fill="none"/></g>'
# ตอน 1 บ่ายในร้านของเก่า กองของรับซื้อ โทนน้ำตาลสนิมกับครีม แสงบ่ายลอดหลังคา สิ่งมีชีวิต: นกเอี้ยงบนกองเหล็ก
o+=P('mslaw','[ภาพประกอบนิทาน บ่ายในร้านของเก่า กองของรับซื้อ โทนน้ำตาลสนิมกับครีม แสงบ่ายลอดหลังคา] กองเหล็ก ป้ายรายการสินค้าต้องห้าม เจ้าของอ้างไม่รู้ นกเอี้ยงบนกองเหล็ก ชายคิดถือปฏิทิน (น้องม้วนขวา)',
 [bg('ms1','#fef3c7','#ffedd5','#a8a29e'), BEAM(220,40,'#fde68a',.25,3,20), '<g transform="translate(246 110)">'+''.join(f'<rect x="{i*14}" y="{(i%2)*6}" width="40" height="6" rx="1" fill="#94a3b8" transform="rotate({(-8,6,-3,10)[i]})"/>' for i in range(4))+'</g>', bird(290,100,'#1e293b'),
  LETTER(122,66,'สินค้าต้องห้ามรับซื้อ',['ถามหน่วยงานใบอนุญาต','ติดรายการหน้าเคาน์เตอร์','สงสัย = ไม่รับ'],'#a16207',100,-2,1,12),
  SEAL(134,138,'ไม่รู้กฎหมาย แก้ตัวไม่ได้ (ม.64)','#dc2626',-4,112),
  FLOOR('#78350f',.06), DUST(7,591,'#fff',.4), vignette('ms1'), FG('r','#78350f',.14)]+person('M',60,'#b45309','#d8a882','worried'))
# ตอน 2 เช้าหน้าร้าน จักรยานสองคันเหมือนกัน โทนฟ้าอ่อนกับแดง แสงเช้าใส สิ่งมีชีวิต: แมวขาวนั่งบนอานจักรยาน
o+=P('msfact','[ภาพประกอบนิทาน เช้าหน้าร้าน จักรยานสองคันรุ่นเดียวกันสีเดียวกัน โทนฟ้าอ่อนกับแดง แสงเช้าใส] จักรยานสองคัน การ์ดสำคัญผิดกับประมาท แมวขาวบนอาน หญิงตกใจถือเงิน (น้องม้วนซ้าย)',
 [bg('ms2','#e0f2fe','#fee2e2','#94a3b8'), BIKE(230,136,'#dc2626'), BIKE(280,136,'#dc2626'), cat(250,110,'#f5f5f4',.38),
  STEPCARD(56,66,'1','เข้าใจผิดจริง','ไม่ผิด/ลดโทษ ม.62','#16a34a',ICON('mag','#16a34a')),
  STEPCARD(122,66,'2','เพราะไม่ดูให้ดี','รับผิดฐานประมาท','#b45309',ICON('clock','#b45309')),
  NOTEBAR(56,112,'รู้ว่าเอาผิด → คืนทันที + ขอโทษ','#0369a1',124,-2),
  FLOOR('#0c4a6e',.07), DUST(9,592,'#fff',.5), vignette('ms2')]+person('W',318,'#0ea5e9','#e8b88f','worried'))
# ตอน 3 กลางวันฝนตกหนักน้ำท่วมตลาด โทนฟ้าเทากับเหลืองเสื้อกันฝน แสงฟ้าครึ้ม สิ่งมีชีวิต: เป็ดลอยน้ำ
o+=P('msnecessity','[ภาพประกอบนิทาน กลางวันฝนตกหนักน้ำท่วมตลาดฉับพลัน โทนฟ้าเทากับเหลืองเสื้อกันฝน แสงฟ้าครึ้ม] ประตูร้านข้างๆ ถูกพัง น้ำท่วม การ์ดจำเป็นกับบันดาลโทสะ เป็ดลอยน้ำ ชายสวมแว่นโล่งใจถือป้าย (น้องม้วนกลาง)',
 [bg('ms3','#cbd5e1','#e0f2fe','#94a3b8'), '<g transform="translate(196 60)">'+''.join(f'<path d="M{i*20} 0l-6 14" stroke="#64748b" stroke-width="1.4"/>' for i in range(8))+'</g><rect x="190" y="128" width="160" height="18" fill="#38bdf8" opacity=".5"/><g transform="translate(232 88)"><rect width="30" height="44" fill="#a16207"/><path d="M4 10l22 24" stroke="#fde68a" stroke-width="2"/></g>', DUCKLING(280,128,.5) if 'DUCKLING' in dir() else '',
  STEPCARD(10,84,'1','พังประตูหนีน้ำ','จำเป็น ไม่เกินสมควร ม.67','#16a34a',ICON('shield','#16a34a')), ARROW(70,102,'#475569'),
  STEPCARD(80,84,'2','ถูกถุยน้ำลายแล้วตบ','บันดาลโทสะ ลดโทษ ม.72','#b45309',ICON('clock','#b45309')),
  NOTEBAR(10,128,'ทางแพ่งอาจยังต้องชดใช้ค่าประตู','#475569',124,-2),
  FLOOR('#334155',.07), DUST(9,593,'#fff',.5), vignette('ms3')]+person('M',292,'#facc15','#d8a882','calm',glasses=True))
open('/home/claude/work/s525.js','w').write(o)
