import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
SIGNBOARD=lambda x,y,c,t: f"<g transform=\"translate({x} {y})\"><rect width=\"64\" height=\"26\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"2\"/><text x=\"32\" y=\"17\" text-anchor=\"middle\" font-size=\"8\" fill=\"{c}\" {F}>{t}</text><path d=\"M10 26v20M54 26v20\" stroke=\"#57534e\" stroke-width=\"3\"/></g>"
# ตอน 1 กลางคืนงานเปิดร้านอาหารทะเล โทนน้ำเงินคืนกับทองไฟประดับ แสงไฟประดับ สิ่งมีชีวิต: สุนัขตกใจหลบใต้โต๊ะ
o+=P('opgun','[ภาพประกอบนิทาน กลางคืนงานเปิดร้านอาหารทะเล มีคนยิงปืนขึ้นฟ้า โทนน้ำเงินคืนกับทองไฟประดับ แสงไฟประดับ] ไฟประดับ ป้ายเปิดร้าน กระสุนเส้นทางขึ้นฟ้า สุนัขหลบใต้โต๊ะ ชายตกใจถือโทรศัพท์ (น้องม้วนขวา)',
 [bg('op1','#1e3a8a','#0f172a','#475569'), '<path d="M190 60q80 -14 160 0" stroke="#fde68a" stroke-width="1" fill="none"/>'+''.join(f'<circle cx="{200+i*18}" cy="{60-abs(4-i)*1.2:.1f}" r="2.4" fill="{cc}"/>' for i,cc in enumerate(['#facc15','#f472b6','#60a5fa','#facc15','#f472b6','#60a5fa','#facc15','#f472b6']))+'<path d="M300 120l10 -50" stroke="#fca5a5" stroke-width="1.6" stroke-dasharray="3 3"/>', SIGNBOARD(240,78,'#0ea5e9','เปิดร้านแล้ว!'), dog(312,146,'#d6a46a',.4),
  STEPCARD(122,84,'!','ยิงปืนในชุมชน','ม.376 ≤ 10 วัน/≤ 5,000','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(122,128,'งานเปิดร้าน: ห้ามอาวุธทุกชนิด','#0ea5e9',110,-2),
  FLOOR('#000',.14), DUST(9,576,'#fde68a',.5), vignette('op1'), FG('r','#000',.16)]+person('M',60,'#0ea5e9','#d8a882','worried'))
# ตอน 2 กลางคืนหน้าร้าน เวทีล้ำถนน เครนเกี่ยวสาย โทนส้มไฟถนนกับม่วง แสงไฟถนน สิ่งมีชีวิต: นกฮูกบนเสาไฟ
o+=P('oproad','[ภาพประกอบนิทาน กลางคืนหน้าร้าน เวทีล้ำถนนไม่มีไฟเตือน เครนยกป้ายเกี่ยวสายโทรศัพท์ขาด โทนส้มไฟถนนกับม่วง แสงไฟถนน] เวที สายสื่อสารขาด กรวย นกฮูกบนเสาไฟ หญิงยิ้มเจ้าเล่ห์ถือคลิปบอร์ด (น้องม้วนซ้าย)',
 [bg('op2','#ede9fe','#ffedd5','#a78bfa'), streetlamp(320,146), OWL(318,58,.32), '<path d="M220 64q30 10 50 2" stroke="#1e293b" stroke-width="1.6" fill="none"/><path d="M270 66l8 10" stroke="#1e293b" stroke-width="1.6"/><path d="M276 76l4 -2l-2 5" stroke="#facc15" stroke-width="1.6" fill="none"/><g transform="translate(220 112)"><rect width="66" height="10" fill="#7c3aed"/><path d="M4 10v24M62 10v24" stroke="#57534e" stroke-width="3"/></g>',
  LETTER(56,64,'ก่อนตั้งเวที/ยกป้าย',['เวทีล้ำถนนมืด → ม.229','สายโทรศัพท์ขาด → ม.235','ขออนุญาต + ไฟเตือน'],'#7c3aed',116,-2,1,12),
  FLOOR('#3b0764',.08), DUST(9,577,'#fff',.5), vignette('op2')]+person('W',318,'#8b5cf6','#e8b88f','smile'))
# ตอน 3 เช้าหลังฝนตกหนัก น้ำท่วมบ้านข้างร้าน โทนฟ้าน้ำกับน้ำตาลดิน แสงเช้าหลังฝน สิ่งมีชีวิต: เป็ดว่ายในน้ำท่วม
o+=P('opflood','[ภาพประกอบนิทาน เช้าหลังฝนตกหนัก น้ำท่วมบ้านข้างร้านเพราะถมดินกั้นทางน้ำ โทนฟ้าน้ำกับน้ำตาลดิน แสงเช้าหลังฝน] กองดินกั้นทางน้ำ น้ำท่วม การ์ดเจตนาให้น้ำท่วมกับเกิดอันตรายจริง เป็ดว่ายน้ำ ชายสวมแว่นมั่นใจถือโล่ (น้องม้วนกลาง)',
 [bg('op3','#e0f2fe','#fef3c7','#94a3b8'), '<path d="M190 120q20 -24 46 -20l20 20z" fill="#a16207"/><rect x="190" y="124" width="160" height="22" fill="#38bdf8" opacity=".55"/>', DUCKLING(268,128,.5) if 'DUCKLING' in dir() else '',
  STEPCARD(10,84,'1','ทำเพื่อให้น้ำท่วม','ม.228 ≤ 5 ปี','#0369a1',ICON('shield','#0369a1')), ARROW(70,102,'#0369a1'),
  STEPCARD(80,84,'2','เกิดอันตรายจริง','6 เดือน–7 ปี','#dc2626',ICON('clock','#dc2626')),
  NOTEBAR(10,128,'ไม่ถม/กั้นทางน้ำ ถามท้องถิ่นก่อน','#0369a1',124,-2),
  FLOOR('#0c4a6e',.07), DUST(7,578,'#fff',.45), vignette('op3')]+person('M',292,'#0284c7','#d8a882','firm',glasses=True))
open('/home/claude/work/s520.js','w').write(o)
