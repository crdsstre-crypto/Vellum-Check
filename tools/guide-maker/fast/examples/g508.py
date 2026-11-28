import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
MOTO=lambda x,y,c="#dc2626": f"<g transform=\"translate({x} {y})\"><circle cx=\"0\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"44\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"0\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><circle cx=\"44\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><path d=\"M0 0l14 -16h18l12 16\" stroke=\"{c}\" stroke-width=\"5\" fill=\"none\"/><rect x=\"14\" y=\"-22\" width=\"18\" height=\"7\" rx=\"3\" fill=\"#1e293b\"/></g>"
TERM=lambda x,y: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"44\" rx=\"5\" fill=\"#334155\"/><rect x=\"4\" y=\"5\" width=\"22\" height=\"12\" rx=\"2\" fill=\"#a7f3d0\"/>"+"".join(f"<rect x=\"{5+(i%3)*7}\" y=\"{21+(i//3)*6}\" width=\"5\" height=\"4\" rx=\"1\" fill=\"#cbd5e1\"/>" for i in range(9))+"<rect x=\"-3\" y=\"30\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#ef4444\" opacity=\".85\"/></g>"
CARD=lambda x,y,c,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"34\" height=\"22\" rx=\"3\" fill=\"{c}\"/><rect x=\"4\" y=\"5\" width=\"7\" height=\"5\" rx=\"1\" fill=\"#fde68a\"/><path d=\"M4 16h20\" stroke=\"#fff\" stroke-width=\"1.4\"/></g>"
# ตอน 1 ดึกในร้านเครื่องสำอางในห้าง โทนชมพูกุหลาบกับน้ำเงินเข้ม แสงไฟตู้โชว์ สิ่งมีชีวิต: ปลาทองในโหลบนเคาน์เตอร์
o+=P('skdevice','[ภาพประกอบนิทาน ดึกในร้านเครื่องสำอางในห้าง โทนชมพูกุหลาบกับน้ำเงินเข้ม แสงไฟตู้โชว์] เครื่องรูดบัตรมีอุปกรณ์แปลกปลอม แว่นขยายส่อง บัตรปลอมหลายใบ ปลาทองในโหล หญิงตกใจถือคลิปบอร์ด (น้องม้วนขวา)',
 [bg('sk1','#fce7f3','#1e3a8a','#6b7280'), '<g transform="translate(236 70)"><rect width="90" height="50" rx="4" fill="#fff" opacity=".9" stroke="#f9a8d4"/>'+''.join(f'<rect x="{8+i*20}" y="12" width="12" height="26" rx="3" fill="{cc}"/>' for i,cc in enumerate(['#f472b6','#fb7185','#c084fc','#f9a8d4']))+'</g>', fishbowl(312,136,.5),
  TERM(130,80), ZOOM(176,98,'ชิ้นแปลกปลอม',16,'#dc2626','#dc2626') if 'ZOOM' in dir() else '', CARD(196,124,'#1d4ed8',-10), CARD(214,128,'#0f766e',8),
  NOTEBAR(124,140,'มีเครื่องก๊อปข้อมูลบัตร = ม.269/2 (1–5 ปี)','#be185d',150,-2),
  FLOOR('#1e3a8a',.08), DUST(7,540,'#fff',.4), vignette('sk1'), FG('r','#1e3a8a',.16)]+person('W',60,'#ec4899','#e8b88f','worried'))
# ตอน 2 บ่ายที่แคชเชียร์ ลูกค้าใช้บัตรแม่ โทนเขียวมิ้นต์กับครีม แสงบ่ายสว่าง สิ่งมีชีวิต: นกแก้วบนคอนมุมร้าน
o+=P('skother','[ภาพประกอบนิทาน บ่ายที่แคชเชียร์ ลูกค้าใช้บัตรของคนอื่น โทนเขียวมิ้นต์กับครีม แสงบ่ายสว่าง] บัตรชื่อไม่ตรงผู้ถือ เช็กลิสต์แคชเชียร์ นกแก้วบนคอน ชายสวมแว่นมั่นใจถือแว่นขยาย (น้องม้วนซ้าย)',
 [bg('sk2','#d1fae5','#fefce8','#94a3a0'), TOUCAN(250,96,.42), TERM(276,92),
  LETTER(56,64,'เช็กก่อนรูด',['ชื่อบนบัตร = ผู้ถือ?','ลายเซ็นตรงหลังบัตร?','รอยแก้ไข/นูนผิดปกติ?','สงสัย → แจ้งหัวหน้า'],'#0f766e',118,-2,1,12),
  CARD(186,108,'#7c3aed',-6),
  FLOOR('#064e3b',.07), DUST(9,541,'#fff',.5), vignette('sk2')]+person('M',318,'#10b981','#d8a882','firm',glasses=True))
# ตอน 3 เย็นที่ห้องประชุมเล็ก คำนวณโทษ โทนส้มพีชกับม่วงอ่อน แสงเย็นอบอุ่น สิ่งมีชีวิต: แฮมสเตอร์ในกรง
o+=P('skheavier','[ภาพประกอบนิทาน เย็นที่ห้องประชุมเล็ก คำนวณโทษ โทนส้มพีชกับม่วงอ่อน แสงเย็นอบอุ่น] การ์ดโทษปกติกับบัตรชำระเงินหนักขึ้นกึ่งหนึ่ง แฮมสเตอร์ หญิงโล่งใจถือปฏิทิน (น้องม้วนกลาง)',
 [bg('sk3','#ffedd5','#ede9fe','#a8a29e'), window(204,50,46,38), HAMSTER(236,138,.48),
  STEPCARD(10,84,'1','ใช้บัตรคนอื่น','เพดาน ≤ 5 ปี','#7c3aed',ICON('clock','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','บัตรเครดิต/เดบิต','+ กึ่งหนึ่ง ≈ 7.5 ปี','#dc2626',ICON('coin','#dc2626')),
  NOTEBAR(10,128,'ตรวจเครื่องรูดทุกวัน + อยู่ในสายตากล้อง','#7c3aed',140,-2),
  FLOOR('#7c2d12',.07), DUST(7,542,'#fff',.45), vignette('sk3')]+person('W',292,'#f97316','#e8b88f','smile'))
open('/home/claude/work/s508.js','w').write(o)
