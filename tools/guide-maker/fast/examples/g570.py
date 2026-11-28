import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('hzban','[ภาพประกอบนิทาน ค่ำในห้องพ่นสีรถ ละอองสีลอย รถคลุมผ้า หน้ากากกันสารเคมีแขวน ป้ายเตือนสามเหลี่ยม โทนเขียวเคมีกับเทาเหล็ก แสงไฟสปอตไลต์] รถคลุมผ้า หน้ากาก ป้ายเตือน นาฬิกา ชายหยุดคิด (น้องม้วนขวา)',
 [bg('hz1','#d9f99d','#e5e7eb','#78716c'), '<g transform="translate(226 98)"><path d="M6 20l14 -16h56l16 16v18h-86z" fill="#cbd5e1" stroke="#64748b"/><circle cx="24" cy="40" r="8" fill="#1f2937"/><circle cx="76" cy="40" r="8" fill="#1f2937"/></g>', ''.join(f'<circle cx="{240+i*17}" cy="{70+(i%3)*7}" r="{3+(i%2)}" fill="#a3e635" opacity=".6"/>' for i in range(6)), '<path d="M330 60l14 24h-28z" fill="#facc15" stroke="#a16207" stroke-width="2"/><text x="330" y="80" text-anchor="middle" font-size="11" fill="#7c2d12" font-family="sans-serif" font-weight="900">!</text>',
  LETTER(122,64,'งานอันตรายห้าม OT',['ห้าม OT/ทำวันหยุด (ม.31)','ฝ่าฝืน คุก ≤ 1 ปี','หรือปรับ ≤ 200,000 (ม.148)'],'#4d7c0f',124,-2,1,12),
  FLOOR('#1f2937',.08), DUST(7,3070,'#ecfccb',.4), vignette('hz1'), FG('r','#365314',.12)]+person('M',60,'#65a30d','#d8a882','worried'))
o+=P('hzplan','[ภาพประกอบนิทาน เช้าหน้าอู่ กระดานตารางกะสามสี ช่างใหม่สวมหมวก ถังสี ลูกค้ารอ โทนฟ้าครามกับส้มสด แสงเช้าแจ่ม] กระดานกะ หมวก ถังสี แรคคูน หญิงวางกะ (น้องม้วนซ้าย)',
 [bg('hz2','#dbeafe','#ffedd5','#a8a29e'), '<g transform="translate(214 62)"><rect width="78" height="52" rx="3" fill="#fff" stroke="#1d4ed8" stroke-width="2"/>'+''.join(f'<rect x="6" y="{8+i*14}" width="{30+i*10}" height="9" rx="2" fill="{c}"/>' for i,c in enumerate(['#93c5fd','#fdba74','#86efac']))+'</g>', '<rect x="306" y="110" width="22" height="26" rx="3" fill="#ea580c"/><ellipse cx="317" cy="110" rx="11" ry="3" fill="#c2410c"/>', RACCOON(240,142,.36),
  LETTER(56,64,'งานล้นทำยังไง',['เพิ่มคน/แบ่งกะในเวลาปกติ','ประกาศเวลาทำงาน (ม.23)','ไม่ประกาศ ปรับ ≤ 5,000'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,3071,'#fff',.4), vignette('hz2')]+person('W',318,'#3b82f6','#e8b88f','calm'))
o+=P('hzleave','[ภาพประกอบนิทาน บ่ายหน้าคลินิก ป้ายกาชาด ม้านั่ง ใบรับรองแพทย์ในมือ ต้นไม้กระถาง โทนขาวสะอาดกับเขียวใบไม้ แสงบ่ายนุ่ม] คลินิก ใบรับรองแพทย์ ต้นไม้ ชายพักฟื้น (น้องม้วนกลาง)',
 [bg('hz3','#f0fdf4','#e0f2fe','#a8a29e'), '<g transform="translate(240 62)"><rect width="70" height="56" rx="4" fill="#fff" stroke="#16a34a" stroke-width="2"/><path d="M30 14h10v10h10v10h-10v10h-10v-10h-10v-10h10z" fill="#dc2626"/></g>', plant(330,146,.8),
  STEPCARD(10,84,'1','ลาทำหมัน','สิทธิลูกจ้าง (ม.33)','#16a34a',ICON('shield','#16a34a')), ARROW(70,102,'#16a34a'),
  STEPCARD(80,84,'2','กี่วัน','ตามใบรับรองแพทย์','#0369a1',ICON('pen','#0369a1')),
  NOTEBAR(10,128,'ค่าจ้างวันลาดู ม.57','#16a34a',132,-2),
  FLOOR('#14532d',.05), DUST(7,3072,'#fff',.45), vignette('hz3')]+person('M',292,'#22c55e','#d8a882','smile'))
open('/home/claude/work/s570.js','w').write(o)
