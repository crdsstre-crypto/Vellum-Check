import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
FLAME=lambda x,y,s=1: f"<g transform=\"translate({x} {y}) scale({s})\"><path d=\"M0 0q-14 -14 -4 -30q2 10 8 8q-4 -14 8 -24q-2 14 8 20q8 10 -2 26z\" fill=\"#f97316\"/><path d=\"M4 -2q-6 -8 0 -16q2 6 6 4q2 8 -6 12z\" fill=\"#fde047\"/></g>"
SMOKE=lambda x,y: "".join(f"<circle cx=\"{x+i*6}\" cy=\"{y-i*9}\" r=\"{6+i*2}\" fill=\"#94a3b8\" opacity=\"{.45-i*.1:.2f}\"/>" for i in range(4))
CRATES=lambda x,y: ''.join(f'<rect x="{x+i*16}" y="{y-(i%2)*14}" width="15" height="13" fill="#2563eb" stroke="#1e3a8a"/>' for i in range(3))+f'<rect x="{x}" y="{y-14}" width="15" height="13" fill="#2563eb" stroke="#1e3a8a"/>'
# ตอน 1 เช้าหน้าร้านของชำริมถนน โทนเหลืองไข่กับเทาทางเท้า แสงเช้า สิ่งมีชีวิต: นกพิราบเดินบนทางเท้า
o+=P('sfsidewalk','[ภาพประกอบนิทาน เช้าหน้าร้านของชำริมถนน โทนเหลืองไข่กับเทาทางเท้า แสงเช้า] ลังน้ำล้นทางเท้า รางขุดมีกรวย ป้ายไม้แขวนเชือกเปื่อย นกพิราบเดิน ชายเศร้าถือเงิน (น้องม้วนขวา)',
 [bg('sf1','#fef9c3','#e7e5e4','#a8a29e'), SHOPFRONT(244,74,72,'#ca8a04','ร้านชำ'), TILTSIGN(310,70,'ป้ายไม้','#a16207',10), CRATES(212,140), '<path d="M248 146l6 -14h6l6 14z" fill="#f97316"/><path d="M251 140h12" stroke="#fff" stroke-width="2"/>', bird(290,144,'#94a3b8'),
  STEPCARD(122,66,'1','ของล้นทางเท้า','ม.386 ปรับ ≤5,000','#ca8a04',ICON('mag','#ca8a04')),
  STEPCARD(122,108,'2','ป้ายจะหล่น','ม.387 ปรับ ≤5,000','#dc2626',ICON('shield','#dc2626')),
  FLOOR('#57534e',.06), DUST(7,531,'#fff',.4), vignette('sf1'), FG('r','#57534e',.14)]+person('M',60,'#ca8a04','#d8a882','worried'))
# ตอน 2 บ่ายหลังร้าน น้ำล้างพื้นคาว โทนฟ้าน้ำกับน้ำตาลโคลน แสงบ่ายสะท้อนน้ำ สิ่งมีชีวิต: แมวลายดมเศษปลา
o+=P('sfdirty','[ภาพประกอบนิทาน บ่ายหลังร้าน น้ำล้างพื้นมีเศษปลา โทนฟ้าน้ำกับน้ำตาลโคลน แสงบ่ายสะท้อนน้ำ] ถังน้ำสาด รอยน้ำเปื้อนคนเดินผ่าน ถังขยะมีฝา แมวลายดมเศษปลา หญิงหัวเราะถือคลิปบอร์ด (น้องม้วนซ้าย)',
 [bg('sf2','#e0f2fe','#f5f5f4','#a8a29e'), '<g transform="translate(232 118)"><path d="M0 0h20l-3 22h-14z" fill="#64748b"/><path d="M20 4q20 -4 40 10" stroke="#7dd3fc" stroke-width="3" fill="none"/><ellipse cx="54" cy="26" rx="16" ry="3" fill="#a3a38f" opacity=".7"/></g>', cat(290,142,'#d6a46a',.42), '<g transform="translate(214 120)"><rect width="16" height="24" rx="2" fill="#16a34a"/><rect x="-1" y="-3" width="18" height="4" rx="1" fill="#15803d"/></g>',
  LETTER(56,66,'หลังร้านต้องระวัง',['สาดน้ำโสโครกใส่คน → ม.389','ของตกจากชั้นลอย → ม.389','ทิ้งซากสัตว์ริมทาง → ม.396'],'#0369a1',124,-2,1,12),
  FLOOR('#44403c',.07), DUST(9,532,'#fff',.5), vignette('sf2')]+person('W',318,'#0284c7','#e8b88f','smile'))
# ตอน 3 เย็นหน้าประตูร้าน ประกาศเทศกิจ โทนม่วงเย็นกับเหลืองประกาศ แสงโคมถนน สิ่งมีชีวิต: นกเอี้ยงบนสายไฟ
o+=P('sforder','[ภาพประกอบนิทาน เย็นหน้าประตูร้าน มีประกาศเทศกิจติดอยู่ โทนม่วงเย็นกับเหลืองประกาศ แสงโคมถนน] ประกาศเตือน การ์ดไม่ทำตามคำสั่ง ฉีกประกาศ นกเอี้ยงบนสายไฟ ชายสวมแว่นมั่นใจถือโทรศัพท์ (น้องม้วนกลาง)',
 [bg('sf3','#ede9fe','#fef9c3','#a78bfa'), streetlamp(250,146), '<path d="M190 58q60 10 160 -4" stroke="#1e293b" stroke-width="1.2" fill="none"/>', bird(214,60,'#1e293b'), '<g transform="translate(222 92) rotate(3)"><rect width="34" height="40" fill="#fef08a" stroke="#ca8a04"/><text x="17" y="12" text-anchor="middle" font-size="6" fill="#a16207" '+F+'>ประกาศ</text><path d="M6 20h22M6 26h18M6 32h22" stroke="#ca8a04"/></g>',
  STEPCARD(10,84,'1','ไม่ทำตามคำสั่ง','ม.368 ≤10 วัน/≤5,000','#7c3aed',ICON('clock','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','ฉีกประกาศ','ม.369 ปรับ ≤5,000','#dc2626',ICON('pen','#dc2626')),
  NOTEBAR(10,128,'ไม่เห็นด้วย → ทำตามก่อน แล้วคัดค้านเป็นหนังสือ','#7c3aed',150,-2),
  FLOOR('#4c1d95',.07), DUST(7,533,'#fff',.45), vignette('sf3')]+person('M',292,'#8b5cf6','#d8a882','firm',glasses=True))
open('/home/claude/work/s505.js','w').write(o)
