import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
MOTO=lambda x,y,c="#dc2626": f"<g transform=\"translate({x} {y})\"><circle cx=\"0\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"44\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"0\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><circle cx=\"44\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><path d=\"M0 0l14 -16h18l12 16\" stroke=\"{c}\" stroke-width=\"5\" fill=\"none\"/><rect x=\"14\" y=\"-22\" width=\"18\" height=\"7\" rx=\"3\" fill=\"#1e293b\"/></g>"
TERM=lambda x,y: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"44\" rx=\"5\" fill=\"#334155\"/><rect x=\"4\" y=\"5\" width=\"22\" height=\"12\" rx=\"2\" fill=\"#a7f3d0\"/>"+"".join(f"<rect x=\"{5+(i%3)*7}\" y=\"{21+(i//3)*6}\" width=\"5\" height=\"4\" rx=\"1\" fill=\"#cbd5e1\"/>" for i in range(9))+"<rect x=\"-3\" y=\"30\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#ef4444\" opacity=\".85\"/></g>"
CARD=lambda x,y,c,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"34\" height=\"22\" rx=\"3\" fill=\"{c}\"/><rect x=\"4\" y=\"5\" width=\"7\" height=\"5\" rx=\"1\" fill=\"#fde68a\"/><path d=\"M4 16h20\" stroke=\"#fff\" stroke-width=\"1.4\"/></g>"
KNIFE=lambda x,y,rot=-30: f'<g transform="translate({x} {y}) rotate({rot})"><path d="M0 0h26l6 4l-6 4h-26z" fill="#e2e8f0" stroke="#64748b"/><rect x="-14" y="0" width="14" height="8" rx="2" fill="#78350f"/></g>'
# ตอน 1 เช้าในตลาดสด ทะเลาะแย่งที่จอด โทนแดงพริกกับเขียวผัก แสงเช้าตลาด สิ่งมีชีวิต: แมวลายวิ่งหนี
o+=P('qrknife','[ภาพประกอบนิทาน เช้าในตลาดสด ทะเลาะแย่งที่จอด โทนแดงพริกกับเขียวผัก แสงเช้าตลาด] มีดหั่นเนื้อถูกชักขึ้นขู่ ตำรวจถามชื่อ การ์ดสองข้อ แมวลายวิ่งหนี ชายคิดหนักถือป้าย (น้องม้วนขวา)',
 [bg('qr1','#fee2e2','#dcfce7','#a8a29e'), awning(230,330,60,'#dc2626','#fef9c3'), KNIFE(270,108), cat(306,140,'#d6a46a',.42), '<g transform="translate(240 112)"><circle r="7" fill="#1e3a8a"/><rect x="-6" y="7" width="12" height="18" fill="#1e3a8a"/><rect x="-5" y="-9" width="10" height="4" fill="#1e293b"/></g>',
  STEPCARD(122,66,'1','ชักมีดตอนวิวาท','ม.379 ≤ 10 วัน','#dc2626',ICON('shield','#dc2626')),
  STEPCARD(122,108,'2','บอกชื่อปลอม','ม.367 ปรับ ≤ 1,000','#1d4ed8',ICON('pen','#1d4ed8')),
  FLOOR('#7f1d1d',.06), DUST(7,549,'#fff',.4), vignette('qr1'), FG('r','#7f1d1d',.14)]+person('M',60,'#dc2626','#d8a882','worried'))
# ตอน 2 บ่ายที่บ่อน้ำหลังตลาด ข่าวลือในไลน์ โทนฟ้าน้ำกับเหลือง แสงบ่ายสะท้อนน้ำ สิ่งมีชีวิต: ปลาในบ่อ
o+=P('qrrumor','[ภาพประกอบนิทาน บ่ายที่บ่อน้ำหลังตลาด มีข่าวลือในกลุ่มไลน์ โทนฟ้าน้ำกับเหลือง แสงบ่ายสะท้อนน้ำ] แชตกลุ่มข่าวเท็จ บ่อน้ำชุมชน ถังน้ำเสีย ปลาในบ่อ ชายสวมแว่นหัวเราะถือปากกา (น้องม้วนซ้าย)',
 [bg('qr2','#e0f2fe','#fef9c3','#94a3b8'), '<ellipse cx="270" cy="136" rx="46" ry="12" fill="#38bdf8" opacity=".7"/><path d="M262 134q6 -4 12 0q-6 4 -12 0z" fill="#f97316"/><g transform="translate(232 108)"><path d="M0 0h16l-2 20h-12z" fill="#64748b"/><path d="M14 4q10 4 14 18" stroke="#a3a38f" stroke-width="3" fill="none"/></g>',
  CHAT(56,64,[('l','น้ำบ่อหลังตลาดมีสารพิษ!!'),('l','ห้ามซื้อผักร้านนั้น'),('r','มีผลตรวจไหม?')],124,52,'#0369a1'),
  NOTEBAR(56,124,'ข่าวเท็จให้คนตื่น ม.384 · น้ำเสียลงบ่อ ม.380','#0369a1',140,-2),
  FLOOR('#0c4a6e',.07), DUST(9,550,'#fff',.5), vignette('qr2')]+person('M',318,'#0284c7','#d8a882','smile',glasses=True))
# ตอน 3 เย็นในร้านที่กำลังรีโนเวท ขุดเจอไหทอง โทนทองอำพันกับม่วงหม่น แสงเย็นลอดหลังคา สิ่งมีชีวิต: หนูแอบดู
o+=P('qrgold','[ภาพประกอบนิทาน เย็นในร้านที่กำลังรีโนเวท ขุดเจอไหทองที่ฝังไว้ โทนทองอำพันกับม่วงหม่น แสงเย็นลอดหลังคา] ไหดินเผามีทองคำ จอบ การ์ดเบียดบังทรัพย์ฝัง หนูแอบดู หญิงง่วงแต่มั่นใจ (น้องม้วนกลาง)',
 [bg('qr3','#fef3c7','#ede9fe','#a8a29e'), BEAM(220,40,'#fde68a',.25,3,20), '<ellipse cx="236" cy="142" rx="26" ry="6" fill="#78350f"/><g transform="translate(226 112)"><path d="M0 8q0 -10 10 -10q10 0 10 10v18q0 6 -10 6q-10 0 -10 -6z" fill="#b45309"/><circle cx="6" cy="-2" r="3" fill="#facc15"/><circle cx="12" cy="-3" r="3" fill="#fde047"/><circle cx="9" cy="-6" r="3" fill="#facc15"/></g><path d="M270 146l-10 -40" stroke="#78350f" stroke-width="3"/><path d="M256 106l10 -4l2 6z" fill="#64748b"/>', '<g transform="translate(206 144)"><ellipse rx="5" ry="3" fill="#78716c"/><circle cx="4" cy="-1" r="1" fill="#000"/></g>',
  STEPCARD(10,84,'1','ขุดเจอของฝัง','ไม่มีใครอ้างเจ้าของ','#b45309',ICON('mag','#b45309')), ARROW(70,102,'#b45309'),
  STEPCARD(80,84,'2','แอบเอาไปเอง','ม.355 ≤ 1 ปี','#dc2626',ICON('coin','#dc2626')),
  NOTEBAR(10,128,'ถ่ายรูป + บันทึกต่อหน้าพยาน + แจ้งตำรวจ','#7c3aed',140,-2),
  FLOOR('#3b0764',.07), DUST(7,551,'#fde68a',.5), vignette('qr3')]+person('W',292,'#a855f7','#e8b88f','tired'))
open('/home/claude/work/s511.js','w').write(o)
