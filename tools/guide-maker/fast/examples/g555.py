import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('jdread','[ภาพประกอบนิทาน เช้าวันอ่านคำพิพากษา ทางเดินศาลยาว ม้านั่งไม้ ปฏิทินวง 3 วัน ซองคำพิพากษา โทนฟ้าครามกับเหลืองมะนาว แสงเช้าแนวยาว] ม้านั่ง ปฏิทิน 3 วัน แฟ้ม นกน้อย หญิงรอฟัง (น้องม้วนขวา)',
 [bg('jd1','#dbeafe','#fef9c3','#a8a29e'), '<g transform="translate(226 112)"><rect width="90" height="8" rx="2" fill="#92400e"/><path d="M8 8v18M82 8v18" stroke="#78350f" stroke-width="4"/><rect y="-22" width="90" height="6" rx="2" fill="#a16207"/></g>', DAYRING(300,74,'3','วัน',.9,'#1d4ed8',18), DUCKLING(342,142,.45),
  LETTER(122,64,'อ่านคำพิพากษา',['สืบเสร็จ = สิ้นสุดพิจารณา','อ่านภายใน 3 วัน (ม.50)','มีเหตุผล อ่านให้ดี (ม.51)'],'#1d4ed8',124,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(7,1555,'#fff',.4), vignette('jd1'), FG('r','#1e3a8a',.12)]+person('W',60,'#3b82f6','#e8b88f','calm'))
o+=P('jdbeyond','[ภาพประกอบนิทาน ค่ำในร้านอาหารตามสั่ง กระทะเหล็ก ไฟเตาแดง บิลเงินเดือนยาวเลยโต๊ะ โทนแดงไฟเตากับน้ำตาลไหม้ แสงไฟหลอดไส้] กระทะ บิลยาว ป้าย +OT ชายตกใจ (น้องม้วนซ้าย)',
 [bg('jd2','#7f1d1d','#fde68a','#57534e'), '<g transform="translate(236 110)"><ellipse cx="30" cy="10" rx="30" ry="9" fill="#1f2937"/><path d="M60 8h22" stroke="#1f2937" stroke-width="5"/><path d="M14 22q16 10 32 0" stroke="#f97316" stroke-width="4" fill="none"/></g>', receipt(300,58) if 'receipt' in globals() else '', STICKER(222,78,'+OT','#dc2626',14),
  LETTER(56,64,'พิพากษาเกินคำขอ',['หลัก: ห้ามเกินคำฟ้อง (ม.52)','เว้นแต่เพื่อความเป็นธรรม','เลิกจ้างไม่ธรรม → รับกลับ/ค่าเสียหาย'],'#b91c1c',146,-2,1,12),
  FLOOR('#000',.14), DUST(6,1556,'#fde68a',.4), vignette('jd2')]+person('M',318,'#ef4444','#d8a882','worried'))
o+=P('jdbind','[ภาพประกอบนิทาน บ่ายในห้องพักพนักงาน ตู้ล็อกเกอร์ห้าตู้ ผ้ากันเปื้อนแขวน ป้ายผูกพันทุกคน โทนมิ้นต์กับลาเวนเดอร์ แสงบ่ายจากหน้าต่าง] ล็อกเกอร์ 5 ตู้ ผ้ากันเปื้อน หญิงคิดวางแผน (น้องม้วนกลาง)',
 [bg('jd3','#d1fae5','#ede9fe','#a8a29e'), ''.join(f'<g transform="translate({220+i*24} 70)"><rect width="20" height="62" rx="2" fill="{c}" stroke="#475569" stroke-width="1.2"/><path d="M4 12h12M4 18h12" stroke="#475569" stroke-width="1"/><circle cx="15" cy="34" r="1.6" fill="#475569"/></g>' for i,c in enumerate(['#a7f3d0','#c4b5fd','#a7f3d0','#c4b5fd','#a7f3d0'])),
  STEPCARD(10,84,'1','ผูกพันคู่ความ','เป็นหลัก (ม.53)','#047857',ICON('pen','#047857')), ARROW(70,102,'#047857'),
  STEPCARD(80,84,'2','ศาลกำหนดได้','ลูกจ้างอื่นร่วมประโยชน์','#7c3aed',ICON('shield','#7c3aed')),
  NOTEBAR(10,128,'ทบทวนค่าจ้างทุกคนตั้งแต่ตอนนี้','#047857',132,-2),
  FLOOR('#064e3b',.05), DUST(7,1557,'#fff',.45), vignette('jd3')]+person('W',292,'#a78bfa','#e8b88f','hopeful'))
open('/home/claude/work/s555.js','w').write(o)
