import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
BADGE=lambda x,y,c,fake=False: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"40\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"2\"/><rect width=\"30\" height=\"9\" fill=\"{c}\"/><circle cx=\"15\" cy=\"20\" r=\"6\" fill=\"#e2e8f0\"/><path d=\"M6 32h18\" stroke=\"#cbd5e1\" stroke-width=\"2\"/>"+(f"<text x=\"15\" y=\"38\" text-anchor=\"middle\" font-size=\"5\" fill=\"#dc2626\" {F}>ปลอม?</text>" if fake else "")+"</g>"
ENV2=lambda x,y,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"30\" height=\"18\" rx=\"2\" fill=\"#fef3c7\" stroke=\"#a16207\"/><path d=\"M0 0l15 10l15 -10\" stroke=\"#a16207\" fill=\"none\"/><text x=\"15\" y=\"16\" text-anchor=\"middle\" font-size=\"5\" fill=\"#a16207\" {F}>฿</text></g>"
SEALTAPE=lambda x,y,w=60: f"<g transform=\"translate({x} {y})\"><rect width=\"{w}\" height=\"12\" fill=\"#fef08a\" stroke=\"#ca8a04\"/><text x=\"{w/2}\" y=\"9\" text-anchor=\"middle\" font-size=\"6\" fill=\"#a16207\" {F}>ห้ามแกะ · ยึดแล้ว</text></g>"
STEEL=lambda x,y: ''.join(f'<rect x="{x}" y="{y-i*5}" width="56" height="4" rx="1" fill="#94a3b8" stroke="#475569" stroke-width=".6"/>' for i in range(5))
# ตอน 1 กลางคืนในร้านวัสดุก่อสร้าง ลบไฟล์กล้อง โทนน้ำเงินคืนกับแดงเตือน แสงจอคอม สิ่งมีชีวิต: จิ้งจกบนผนัง
o+=P('hdhelp','[ภาพประกอบนิทาน กลางคืนในร้านวัสดุก่อสร้าง กำลังลบไฟล์กล้องวงจรปิด โทนน้ำเงินคืนกับแดงเตือน แสงจอคอม] จอกด Delete กุญแจบ้านสวน การ์ดลบหลักฐานกับซ่อนคน จิ้งจก ชายตกใจถือโทรศัพท์ (น้องม้วนขวา)',
 [bg('hd1','#1e293b','#334155','#475569'), '<g transform="translate(244 80)"><rect width="64" height="42" rx="3" fill="#0f172a" stroke="#64748b"/><rect x="6" y="6" width="52" height="22" fill="#7f1d1d"/><text x="32" y="21" text-anchor="middle" font-size="7" fill="#fff" '+F+'>DELETE?</text></g>', gecko(316,70,'#7ab86a'),
  STEPCARD(122,66,'1','ลบไฟล์กล้อง','ม.184 ≤ 5 ปี','#dc2626',ICON('shield','#dc2626')),
  STEPCARD(122,108,'2','ให้ไปหลบบ้านสวน','ม.189 ≤ 2 ปี','#b45309',ICON('mag','#b45309')),
  FLOOR('#000',.14), DUST(7,564,'#fca5a5',.4), vignette('hd1'), FG('r','#000',.16)]+person('M',60,'#dc2626','#d8a882','worried'))
# ตอน 2 บ่ายที่โกดังเพื่อน ขนเหล็กหนีการยึด โทนเทาเหล็กกับส้มสนิม แสงบ่ายฝุ่น สิ่งมีชีวิต: นกพิราบบนคานโกดัง
o+=P('hdseize','[ภาพประกอบนิทาน บ่ายที่โกดังเพื่อน ขนเหล็กหนีการยึด โทนเทาเหล็กกับส้มสนิม แสงบ่ายมีฝุ่น] กองเหล็ก รถกระบะ ประกาศยึดทรัพย์ การ์ดยักย้ายทรัพย์ นกพิราบบนคาน ชายสวมแว่นคิดถือเหรียญ (น้องม้วนซ้าย)',
 [bg('hd2','#e7e5e4','#ffedd5','#a8a29e'), STEEL(244,140), pickup(258,146), bird(296,64,'#94a3b8'),
  LETTER(56,64,'บังคับคดี',['ถูกยึด/จะถูกยึด → ห้ามย้าย','ม.187 ≤ 3 ปี','ของที่ศาลริบ → ม.186'],'#c2410c',112,-2,1,12),
  NOTEBAR(56,116,'จ่ายไม่ไหว → เจรจาผ่อน ไม่ซ่อนทรัพย์','#c2410c',134,-2),
  FLOOR('#44403c',.07), DUST(10,565,'#fff',.5), vignette('hd2')]+person('M',318,'#ea580c','#d8a882','calm',glasses=True))
# ตอน 3 เช้าที่ห้องเก็บเอกสารศาล โทนเขียวขวดกับครีม แสงเช้าลอดหน้าต่าง สิ่งมีชีวิต: เต่าเล็กในอ่างหน้าศาล
o+=P('hdcourt','[ภาพประกอบนิทาน เช้าที่ห้องเก็บเอกสารศาล โทนเขียวขวดกับครีม แสงเช้าลอดหน้าต่าง] แฟ้มเอกสารที่ยื่นศาล การ์ดของที่ส่งศาลห้ามทำหาย เต่าเล็ก หญิงโล่งใจถือแว่นขยาย (น้องม้วนกลาง)',
 [bg('hd3','#d1fae5','#fefce8','#94a3a0'), shelf(214,96), turtle(236,146),
  STEPCARD(10,84,'1','ของที่ยื่นศาล','ทำลาย/ซ่อน ม.185','#047857',ICON('mail','#047857')), ARROW(70,102,'#047857'),
  STEPCARD(80,84,'2','ป้องกัน','ยื่นสำเนา เก็บต้นฉบับ','#16a34a',ICON('shield','#16a34a')),
  NOTEBAR(10,128,'เก็บหลักฐานครบ · แนะนำให้มอบตัว','#047857',124,-2),
  FLOOR('#064e3b',.07), DUST(7,566,'#fff',.45), vignette('hd3')]+person('W',292,'#10b981','#e8b88f','smile'))
open('/home/claude/work/s516.js','w').write(o)
