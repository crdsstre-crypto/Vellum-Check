import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('kpcam','[ภาพประกอบนิทาน ตีสองในมินิมาร์ท ไฟนีออนเย็นตา ชั้นขนม กล้องวงจรปิดมุมเพดาน จอ DVR นับถอยหลัง 30 วัน โทนเขียวนีออนกับม่วงดึก แสงไฟตู้แช่] กล้อง จอ DVR ลิ้นชักเงิน นกฮูก ชายกังวล (น้องม้วนขวา)',
 [bg('kp1','#1e1b4b','#a7f3d0','#57534e'), '<g transform="translate(300 48)"><rect width="28" height="14" rx="3" fill="#e5e7eb"/><circle cx="6" cy="7" r="4" fill="#1f2937"/><circle cx="6" cy="7" r="1.6" fill="#ef4444"/><path d="M28 7h10" stroke="#9ca3af" stroke-width="3"/></g>', '<g transform="translate(228 84)"><rect width="66" height="44" rx="4" fill="#0f172a" stroke="#34d399" stroke-width="2"/><text x="33" y="20" text-anchor="middle" font-size="9" fill="#34d399" font-family="sans-serif" font-weight="900">ลบใน 30 วัน</text><rect x="8" y="28" width="50" height="6" rx="3" fill="#334155"/><rect x="8" y="28" width="38" height="6" rx="3" fill="#f43f5e"/></g>', OWL(336,140,.4),
  LETTER(122,64,'ขอสืบพยานไว้ก่อน',['เกรงว่าหลักฐานจะหาย (ม.32/1)','ยังไม่มีคดี → คำร้องขอ','ศาลเรียกอีกฝ่ายมาฟังก่อน'],'#047857',124,-2,1,12),
  FLOOR('#000',.14), DUST(7,1353,'#a7f3d0',.4), vignette('kp1'), FG('r','#064e3b',.14)]+person('M',60,'#10b981','#d8a882','worried'))
o+=P('kpseize','[ภาพประกอบนิทาน เช้ามืดหน้าสนามบิน ป้ายขาออก กระเป๋าลาก นาฬิกาใหญ่ แฟ้มคำร้องด่วนสีแดง โทนฟ้ารุ่งอรุณกับชมพูพีช แสงเช้ามืดเย็น] ป้ายขาออก นาฬิกา เครื่องบิน ตราด่วน หญิงรีบ (น้องม้วนซ้าย)',
 [bg('kp2','#bfdbfe','#fecdd3','#a8a29e'), SIGN(236,58,70,'ขาออก ✈','#1d4ed8','#fff',8), wallclock(318,92,13), '<path d="M226 104l30 -8l4 4l-26 10z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.4"/>', SEAL(232,124,'ด่วน','#e11d48',-10,46),
  LETTER(56,64,'เหตุฉุกเฉิน',['ขอให้สั่งโดยไม่ชักช้า (ม.32/2)','ยึด/อายัดเอกสาร-วัตถุไว้ก่อน','ตามเงื่อนไขที่ศาลกำหนด'],'#be123c',146,-2,1,12),
  FLOOR('#1e3a8a',.06), DUST(6,1354,'#fff',.4), vignette('kp2')]+person('W',318,'#f43f5e','#e8b88f','worried'))
o+=P('kpdetain','[ภาพประกอบนิทาน บ่ายในห้องพิจารณาศาลแรงงาน ค้อนผู้พิพากษา คำสั่งศาลมีตราครุฑ นาฬิกาทรายหกเดือน โทนไม้สักกับเทาฟ้า แสงหน้าต่างสูง] ค้อนศาล นาฬิกาทราย ชายตั้งใจ (น้องม้วนกลาง)',
 [bg('kp3','#e2e8f0','#fde68a','#a8a29e'), judgebench(260,74) if 'judgebench' in globals() else '', SANDGLASS(326,96,'#7c2d12',1),
  STEPCARD(10,84,'1','ศาลสั่งทำ/ละเว้น','ผิดขั้นตอนกม.แรงงาน','#334155',ICON('pen','#334155')), ARROW(70,102,'#334155'),
  STEPCARD(80,84,'2','ฝ่าฝืนคำสั่ง','กักขัง ≤ 6 เดือน','#b91c1c',ICON('clock','#b91c1c')),
  NOTEBAR(10,128,'ใช้กับทุกฝ่าย รวมทั้งร้าน (ม.32)','#334155',132,-2),
  FLOOR('#1e293b',.06), DUST(7,1355,'#fff',.45), vignette('kp3')]+person('M',292,'#64748b','#d8a882','calm'))
open('/home/claude/work/s553.js','w').write(o)
