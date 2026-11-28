import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fiforeign','[ภาพประกอบนิทาน สายร้านแลกเงินย่านท่องเที่ยว ป้ายอัตราแลกเปลี่ยนไฟวิ่ง โบรชัวร์ประกันต่างประเทศวางเคาน์เตอร์ ลูกโลก โทนฟ้าไฟฟ้ากับทองเงินตรา แสงไฟร้าน] ป้ายอัตรา ลูกโลก โบรชัวร์ ลูกเป็ด ชายลังเล (น้องม้วนขวา)',
 [bg('fi1','#dbeafe','#fde68a','#a8a29e'), '<g transform="translate(222 62)"><rect width="80" height="28" rx="3" fill="#0f172a"/>'+''.join(f'<text x="{8+i*24}" y="18" font-size="9" fill="#fde047" font-family="monospace" font-weight="900">{t}</text>' for i,t in enumerate(['USD','EUR','JPY']))+'</g>', globe(320,96) if 'globe' in globals() else '', '<g transform="translate(240 102) rotate(-6)"><rect width="34" height="26" fill="#fff" stroke="#dc2626" stroke-width="2"/><path d="M4 4l26 18M30 4l-26 18" stroke="#dc2626" stroke-width="2"/></g>', DUCKLING(342,142,.4),
  LETTER(122,64,'ชวนซื้อประกันต่างประเทศ',['ห้ามชักชวน/แนะนำ (ม.83)','คุก ≤ 6 ด./ปรับ ≤ 5 หมื่น','ยกเว้นแค่ประกันต่อของบริษัท'],'#1d4ed8',124,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(7,5191,'#fff',.4), vignette('fi1'), FG('r','#1e3a8a',.12)]+person('M',60,'#3b82f6','#d8a882','worried'))
o+=P('fibrochure','[ภาพประกอบนิทาน บ่ายตัวแทนยื่นโบรชัวร์พิมพ์เองให้ร้าน ตราอนุมัติของบริษัทหายไป แว่นขยายส่อง โทนส้มพีชกับม่วงอ่อน แสงบ่าย] โบรชัวร์พิมพ์เอง แว่นขยาย ช่องตราว่าง หญิงสงสัย (น้องม้วนซ้าย)',
 [bg('fi2','#ffedd5','#ede9fe','#a8a29e'), '<g transform="translate(228 70) rotate(-6)"><rect width="48" height="60" fill="#fff" stroke="#c2410c" stroke-width="2"/><rect x="6" y="8" width="36" height="14" fill="#fed7aa"/><rect x="26" y="40" width="16" height="14" fill="none" stroke="#94a3b8" stroke-dasharray="3 2"/></g><g transform="translate(300 98)"><circle r="12" fill="none" stroke="#7c3aed" stroke-width="4"/><path d="M8 8l12 12" stroke="#7c3aed" stroke-width="4"/></g>',
  LETTER(56,64,'โบรชัวร์ตัวแทนทำเอง',['ต้องผ่านบริษัทเห็นชอบ (ม.79/2)','ฝ่าฝืน ≤ 5 หมื่น + วันละ 2,000','เสียหาย → คุก ≤ 5 เดือน'],'#c2410c',146,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(6,5192,'#fff',.4), vignette('fi2')]+person('W',318,'#f97316','#e8b88f','worried'))
o+=P('fiprotect','[ภาพประกอบนิทาน เย็นเคาน์เตอร์ร้าน ป้ายเล็ก “ร้านไม่ได้ขายประกัน” โทรศัพท์โทร 1186 ถังขยะใส่โบรชัวร์ โทนเขียวมิ้นต์กับกรมท่า แสงเย็นสงบ] ป้ายเล็ก โทรศัพท์ ถังขยะ ชายตั้งใจ (น้องม้วนกลาง)',
 [bg('fi3','#ccfbf1','#1e293b','#57534e'), '<g transform="translate(232 80)"><rect width="66" height="22" rx="3" fill="#fff" stroke="#0f766e" stroke-width="2"/><text x="33" y="15" text-anchor="middle" font-size="7.5" fill="#0f766e" font-family="sans-serif" font-weight="900">ไม่ได้ขายประกัน</text></g>', '<g transform="translate(306 106)"><path d="M0 0h24l-3 30h-18z" fill="#64748b"/><rect x="4" y="-6" width="16" height="8" fill="#fff" stroke="#dc2626" transform="rotate(-10 12 -2)"/></g>',
  STEPCARD(10,84,'1','ป้ายว่าประกันชีวิต','ห้าม ถ้าไม่ใช่ ม.19','#0f766e',ICON('shield','#0f766e')), ARROW(70,102,'#ccfbf1'),
  STEPCARD(80,84,'2','ใช้ผิด','2 หมื่น–1 แสน (ม.92)','#dc2626',ICON('coin','#dc2626')),
  NOTEBAR(10,128,'ให้ลูกค้าเช็กกับ คปภ. 1186','#0f766e',132,-2),
  FLOOR('#000',.12), DUST(7,5193,'#ccfbf1',.45), vignette('fi3')]+person('M',292,'#14b8a6','#d8a882','calm'))
open('/home/claude/work/s591.js','w').write(o)
