import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('brfavor','[ภาพประกอบนิทาน สายที่แผงผลไม้ส่ง ลังมะม่วงซ้อน โบรชัวร์ 10% กับกรมธรรม์ 5% วางเทียบ ลูกศรชี้ฝั่งโบรชัวร์ โทนเหลืองมะม่วงกับเขียวใบไม้ แสงตลาดเช้า] ลังมะม่วง โบรชัวร์ กรมธรรม์ ลูกศร ชายเจ้าของแผง (น้องม้วนขวา)',
 [bg('bf1','#fef9c3','#dcfce7','#a8a29e'), ''.join(f'<rect x="{224+i*20}" y="{116-(i%2)*10}" width="18" height="{22+(i%2)*10}" fill="#d6a46a" stroke="#92400e"/><circle cx="{233+i*20}" cy="{112-(i%2)*10}" r="6" fill="#facc15"/>' for i in range(3)), '<g transform="translate(290 64)"><rect width="34" height="44" fill="#fff" stroke="#16a34a" stroke-width="2"/><text x="17" y="28" text-anchor="middle" font-size="11" fill="#16a34a" font-family="sans-serif" font-weight="900">10%</text></g><g transform="translate(296 112) rotate(6)"><rect width="34" height="24" fill="#fff" stroke="#94a3b8"/><text x="17" y="16" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="sans-serif" font-weight="900">5%</text></g>',
  LETTER(122,64,'โบรชัวร์ vs กรมธรรม์',['โฆษณาเป็นส่วนของกรมธรรม์','ขัดกัน → ตีความเป็นคุณผู้ซื้อ','(ม.30/1)'],'#16a34a',124,-2,1,12),
  FLOOR('#713f12',.05), DUST(7,4989,'#fff',.4), vignette('bf1'), FG('r','#14532d',.12)]+person('M',60,'#22c55e','#d8a882','calm'))
o+=P('brform','[ภาพประกอบนิทาน บ่ายโต๊ะไม้ กรมธรรม์สองฉบับวางคู่ แบบที่เห็นชอบมีตราเขียว แบบที่ได้รับไม่มีตรา ปากกาวงเลือก โทนครีมกระดาษกับน้ำเงินหมึก แสงบ่ายนุ่ม] กรมธรรม์สองฉบับ ตรา ปากกา หญิงเลือก (น้องม้วนซ้าย)',
 [bg('bf2','#fef3c7','#dbeafe','#a8a29e'), '<g transform="translate(222 74) rotate(-4)"><rect width="46" height="58" fill="#fff" stroke="#1d4ed8" stroke-width="2"/><circle cx="34" cy="46" r="7" fill="none" stroke="#16a34a" stroke-width="2"/></g><g transform="translate(276 76) rotate(4)"><rect width="46" height="58" fill="#fff" stroke="#94a3b8" stroke-width="2"/><text x="23" y="34" text-anchor="middle" font-size="16" fill="#dc2626" font-family="sans-serif" font-weight="900">?</text></g>',
  LETTER(56,64,'กรมธรรม์ผิดแบบ',['เลือกฉบับที่ดีกว่า (ม.29)','แบบไม่เคยเห็นชอบ → เลิกได้','ห้ามจ่ายเป็นเงินต่างประเทศ'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,4990,'#fff',.4), vignette('bf2')]+person('W',318,'#60a5fa','#e8b88f','calm'))
o+=P('brdelay','[ภาพประกอบนิทาน ค่ำโต๊ะทำงาน กองเอกสารสูงขึ้นเรื่อยๆ ปฏิทินขีดหลายเดือน นาฬิกาทราย โทรศัพท์โทร คปภ. โทนม่วงหม่นกับส้มโคม แสงโคมโต๊ะ] กองเอกสาร ปฏิทิน นาฬิกาทราย ชายอดทน (น้องม้วนกลาง)',
 [bg('bf3','#3b0764','#fed7aa','#57534e'), ''.join(f'<rect x="{230+i*4}" y="{124-i*10}" width="44" height="9" fill="#fff" stroke="#c2410c"/>' for i in range(5)), SANDGLASS(310,96,'#fdba74',1),
  STEPCARD(10,84,'1','ประวิงจ่าย','ห้าม (ม.37)','#c2410c',ICON('clock','#c2410c')), ARROW(70,102,'#fed7aa'),
  STEPCARD(80,84,'2','บริษัทฝ่าฝืน','≤ 5 แสน + วันละ 2 หมื่น','#7c3aed',ICON('coin','#7c3aed')),
  NOTEBAR(10,128,'ขอรายการเอกสารเป็นหนังสือครั้งเดียว','#c2410c',132,-2),
  FLOOR('#000',.14), DUST(7,4991,'#fed7aa',.45), vignette('bf3')]+person('M',292,'#f97316','#d8a882','worried'))
open('/home/claude/work/s589.js','w').write(o)
