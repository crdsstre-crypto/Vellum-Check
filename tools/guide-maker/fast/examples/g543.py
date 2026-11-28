import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('agkitchen','[ภาพประกอบนิทาน เช้าตรู่ในครัวเบเกอรี่ เตาอบใหญ่ของร้าน เครื่องผสมแป้ง ทีมเหมาค่าแรง โทนครีมเนยกับชมพูสตรอว์เบอร์รี แสงเตาอบส้ม] เตาอบ เครื่องผสม ถาดขนมปัง หนูแฮมสเตอร์ หญิงอยากรู้ (น้องม้วนขวา)',
 [bg('ag1','#fef3c7','#fce7f3','#a8a29e'), '<g transform="translate(286 74)"><rect width="56" height="62" rx="4" fill="#94a3b8"/><rect x="6" y="8" width="44" height="28" rx="3" fill="#fb923c" opacity=".8"/><rect x="6" y="42" width="44" height="14" rx="2" fill="#64748b"/></g>', '<g transform="translate(222 100)"><path d="M0 20h30l-4 18h-22z" fill="#e2e8f0"/><path d="M15 0v20" stroke="#64748b" stroke-width="3"/><circle cx="15" cy="0" r="5" fill="#64748b"/></g>', HAMSTER(214,146,.5),
  LETTER(122,64,'เหมาค่าแรงในครัวร้าน',['งานของร้าน + ที่ร้าน + เครื่องมือร้าน','→ ร้านอยู่ในฐานะนายจ้าง (ม.35)'],'#db2777',156,-2,1,12),
  FLOOR('#831843',.05), DUST(7,664,'#fff',.45), vignette('ag1')]+person('W',60,'#f472b6','#e8b88f','curious'))
o+=P('agchain','[ภาพประกอบนิทาน บ่ายในร้านที่กำลังตกแต่ง นั่งร้าน ผังผู้รับเหมาสามทอด รถกระบะ โทนส้มเซฟตี้กับเทาปูน แสงฝุ่นลอย] นั่งร้าน หมวกนิรภัย ผังสามชั้น รถกระบะ บีเวอร์ ชายหนักแน่น (น้องม้วนซ้าย)',
 [bg('ag2','#ffedd5','#e7e5e4','#a8a29e'), '<g stroke="#f97316" stroke-width="2.4" fill="none"><path d="M220 146v-80M270 146v-80M220 90h50M220 118h50"/></g>', ''.join(f'<g transform="translate(290 {66+i*24})"><rect width="44" height="16" rx="3" fill="{c}"/><text x="22" y="11" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif" font-weight="900">{t}</text></g>' for i,(t,c) in enumerate([('ชั้นต้น','#c2410c'),('ช่วง 1','#ea580c'),('ช่วง 2','#fb923c')])), BEAVER(170,144,.45),
  LETTER(56,64,'ผู้รับเหมาช่วงไม่ส่ง',['ถัดขึ้นไปตลอดสาย','จนชั้นต้น ร่วมรับผิด (ม.52)','เงินเพิ่มใช้ด้วย (ม.53)'],'#c2410c',124,-2,1,12),
  FLOOR('#7c2d12',.07), DUST(7,665,'#fff',.4), vignette('ag2')]+person('M',318,'#ea580c','#d8a882','firm'))
o+=P('agpriority','[ภาพประกอบนิทาน เย็นที่ห้องขายทอดตลาด คิวเจ้าหนี้ยืนเรียง ป้ายลำดับ โทนเขียวขวดกับทองอ่อน แสงโคมระย้า] คิวเจ้าหนี้ ป้ายลำดับ ค้อนประมูล นกฮูก หญิงกังวล (น้องม้วนกลาง)',
 [bg('ag3','#d1fae5','#fef3c7','#a8a29e'), ''.join(f'<g transform="translate({214+i*30} {92+i*6})"><rect width="24" height="16" rx="3" fill="{c}"/><text x="12" y="11" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif" font-weight="900">{t}</text></g>' for i,(t,c) in enumerate([('ภาษี','#047857'),('สมทบ','#047857'),('อื่น','#94a3b8')])), OWL(330,128,.45),
  STEPCARD(10,84,'1','ค้างเงินสมทบ','+ เงินเพิ่ม','#047857',ICON('coin','#047857')), ARROW(70,102,'#047857'),
  STEPCARD(80,84,'2','บุริมสิทธิ','ลำดับเท่าภาษี (ม.51)','#ca8a04',ICON('shield','#ca8a04')),
  NOTEBAR(10,128,'ขอสลิปส่งสมทบจากทีมเหมาทุกเดือน','#047857',128,-2),
  FLOOR('#064e3b',.05), DUST(7,666,'#fff',.45), vignette('ag3')]+person('W',292,'#10b981','#e8b88f','worried'))
open('/home/claude/work/s543.js','w').write(o)
