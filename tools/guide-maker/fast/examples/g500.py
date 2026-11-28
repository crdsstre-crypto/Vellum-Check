import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
MANGO=lambda x,y: f'<g transform="translate({x} {y})"><rect x="-3" y="10" width="6" height="40" fill="#78350f"/><circle cx="0" cy="0" r="22" fill="#16a34a"/><circle cx="-12" cy="8" r="13" fill="#15803d"/><circle cx="12" cy="6" r="13" fill="#22c55e"/><ellipse cx="-6" cy="12" rx="3" ry="4" fill="#facc15"/><ellipse cx="8" cy="0" rx="3" ry="4" fill="#facc15"/><ellipse cx="2" cy="16" rx="3" ry="4" fill="#fbbf24"/></g>'
VEG=lambda x,y: f'<g transform="translate({x} {y})"><rect width="46" height="10" rx="2" fill="#a16207"/>'+''.join(f'<path d="M{6+i*9} 0q-3 -8 0 -12q3 4 0 12" fill="#4ade80"/>' for i in range(5))+'</g>'
# ตอน 1 เช้าในสวนหลังร้านกาแฟ โทนเขียวใบไม้กับเหลืองแดด แสงเช้าลอดใบไม้ สิ่งมีชีวิต: กระรอกบนกิ่งมะม่วง
o+=P('sgtree','[ภาพประกอบนิทาน เช้าในสวนหลังร้านกาแฟ โทนเขียวใบไม้กับเหลืองแดด แสงเช้าลอดใบไม้] ต้นมะม่วงติดไปกับที่ดิน แปลงผักไม่ติด ป้ายส่วนควบ กระรอกบนกิ่ง ชายมั่นใจถือแว่นขยาย (น้องม้วนขวา)',
 [bg('sg1','#dcfce7','#fef9c3','#8a9a7a'), BEAM(200,70,'#fff',.25,4,30), MANGO(264,94), VEG(210,136), '<g transform="translate(272 76)"><ellipse rx="5" ry="3.4" fill="#a16207"/><path d="M4 -2q8 -8 4 -14" stroke="#a16207" stroke-width="3" fill="none"/></g>',
  STEPCARD(122,66,'✓','ต้นมะม่วง','ไม้ยืนต้น → ติดไป','#15803d',ICON('shield','#15803d')),
  STEPCARD(122,108,'✗','แปลงผัก','ไม้ล้มลุก → ไม่ติด','#b45309',ICON('mag','#b45309')),
  FLOOR('#14532d',.06), DUST(8,516,'#fff',.4), vignette('sg1'), FG('r','#14532d',.14)]+person('M',60,'#16a34a','#d8a882','firm'))
# ตอน 2 บ่ายในร้านกาแฟ แอร์ ป้าย ซุ้ม โทนครีมกับฟ้าเย็น แสงบ่ายใส สิ่งมีชีวิต: แมวสามสีนอนใต้ซุ้ม
o+=P('sgfixture','[ภาพประกอบนิทาน บ่ายในร้านกาแฟ โทนครีมกับฟ้าเย็น แสงบ่ายใส] แอร์ติดผนังเป็นอุปกรณ์ ป้ายแขวนชั่วคราว ซุ้มของผู้เช่า แมวสามสีใต้ซุ้ม หญิงคิดถือปฏิทิน (น้องม้วนซ้าย)',
 [bg('sg2','#fff7ed','#e0f2fe','#a8a29e'), '<g transform="translate(150 60)"><rect width="56" height="16" rx="4" fill="#f8fafc" stroke="#64748b"/><path d="M6 12h44" stroke="#94a3b8"/><path d="M14 20q2 6 0 10M28 20q2 6 0 10M42 20q2 6 0 10" stroke="#7dd3fc" stroke-width="1.4" fill="none"/></g>',
  '<g transform="translate(234 74)"><rect width="50" height="62" fill="#fef3c7" stroke="#a16207" stroke-width="1.6"/><path d="M-4 0h58l-6 -10h-46z" fill="#f59e0b"/><text x="25" y="34" text-anchor="middle" font-size="6" fill="#a16207" '+F+'>ซุ้มผู้เช่า</text></g>', cat(250,142,'#f5f5f4',.42),
  LETTER(56,82,'ติดไปไหม?',['แอร์ติดผนัง = อุปกรณ์','ป้ายแขวนชั่วคราว = ไม่ติด','ซุ้มผู้เช่า = ไม่ติด'],'#0369a1',108,-2,1,11),
  FLOOR('#78350f',.07), DUST(9,517,'#fff',.5), vignette('sg2')]+person('W',318,'#0284c7','#e8b88f','calm'))
# ตอน 3 เย็นที่สำนักงานที่ดินวันโอน โทนส้มพีชกับน้ำเงิน แสงเย็นผ่านมู่ลี่ สิ่งมีชีวิต: นกกระจอกเกาะขอบหน้าต่าง
o+=P('sgfruit','[ภาพประกอบนิทาน เย็นที่สำนักงานที่ดินวันโอน โทนส้มพีชกับน้ำเงิน แสงเย็นผ่านมู่ลี่] ดอกผลธรรมดาผลมะม่วง ดอกผลนิตินัยค่าเช่า แบ่งตามวันโอน นกกระจอกที่หน้าต่าง หญิงโล่งใจถือเหรียญ (น้องม้วนกลาง)',
 [bg('sg3','#ffedd5','#dbeafe','#a8a29e'), window(204,50,46,38), bird(226,52,'#8a6a4a'), BEAM(204,46,'#fff',.2,4,20),
  STEPCARD(10,84,'ธ','ดอกผลธรรมดา','ผลมะม่วง','#16a34a',ICON('shield','#16a34a')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'น','ดอกผลนิตินัย','ค่าเช่า (คิดรายวัน)','#1d4ed8',ICON('coin','#1d4ed8')),
  NOTEBAR(10,128,'ค่าเช่าถึงวันโอน = ผู้ขาย · หลังโอน = ผู้ซื้อ','#c2410c',140,-2),
  FLOOR('#7c2d12',.07), DUST(7,518,'#fff',.45), vignette('sg3')]+person('W',292,'#f97316','#e8b88f','smile'))
open('/home/claude/work/s500.js','w').write(o)
