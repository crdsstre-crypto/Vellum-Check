import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('arstuck','[ภาพประกอบนิทาน เช้าในโรงทำขนมไทย ถาดขนมชั้น ลังถึงไม้ไอน้ำ ปฏิทิน 5 วันขีดหมด โทนชมพูขนมชั้นกับเขียวใบเตย แสงเช้าผ่านไอน้ำ] ลังถึง ขนมชั้น ปฏิทิน 5 วัน แพะ หญิงลังเล (น้องม้วนขวา)',
 [bg('ar1','#fce7f3','#dcfce7','#a8a29e'), ''.join(f'<g transform="translate(232 {84+i*16})"><ellipse cx="36" cy="8" rx="36" ry="8" fill="#d6a46a" stroke="#92400e" stroke-width="1.4"/></g>' for i in range(3)), ''.join(f'<path d="M{246+i*14} 76q4 -8 0 -14" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>' for i in range(4)), '<g transform="translate(310 100)">'+''.join(f'<rect y="{i*5}" width="26" height="5" fill="{c}"/>' for i,c in enumerate(['#f9a8d4','#86efac','#f9a8d4','#86efac']))+'</g>', GOAT(340,142,.38),
  LETTER(122,64,'ไกล่เกลี่ยไม่จบ',['ไกล่เกลี่ย 5 วัน (ม.22)','ตกลงไม่ได้ → ตั้งผู้ชี้ขาด','ระหว่างชี้ขาดห้ามปิดงาน'],'#be185d',124,-2,1,12),
  FLOOR('#831843',.05), DUST(7,1959,'#fff',.45), vignette('ar1'), FG('r','#166534',.12)]+person('W',60,'#ec4899','#e8b88f','worried'))
o+=P('arhear','[ภาพประกอบนิทาน บ่ายในห้องประชุมเล็ก โต๊ะกลมไม้ คนกลางนั่งหัวโต๊ะ เอกสารสองกอง ไมค์ตั้งโต๊ะ โทนม่วงลาเวนเดอร์กับทองอ่อน แสงบ่ายนวล] โต๊ะกลม เอกสารสองกอง ปฏิทิน 7 วัน นกฟลามิงโก ชายชี้แจง (น้องม้วนซ้าย)',
 [bg('ar2','#ede9fe','#fef9c3','#a8a29e'), '<g transform="translate(232 108)"><ellipse cx="44" cy="8" rx="46" ry="10" fill="#a16207"/><rect x="40" y="16" width="8" height="18" fill="#78350f"/><rect x="10" y="-6" width="20" height="10" fill="#fff" stroke="#7c3aed"/><rect x="60" y="-6" width="20" height="10" fill="#fff" stroke="#be185d"/></g>', DAYRING(268,76,'7','วัน',.8,'#7c3aed',16), FLAMINGO(240,140,.36),
  LETTER(56,64,'ผู้ชี้ขาดต้องทำอะไร',['แจ้งนัดภายใน 7 วัน (ม.27)','ให้ชี้แจง + นำพยาน (ม.28)','คำชี้ขาดมีเหตุผล (ม.29)'],'#7c3aed',146,-2,1,12),
  FLOOR('#4c1d95',.05), DUST(6,1960,'#fff',.4), vignette('ar2')]+person('M',318,'#8b5cf6','#d8a882','calm'))
o+=P('aryear','[ภาพประกอบนิทาน ค่ำช่วงเทศกาล หน้าร้านขนมแขวนโคมกระดาษ กล่องของขวัญเรียงสูง ปฏิทินหนึ่งปี โทนแดงโคมกับทองประกาย แสงโคมไฟอบอุ่น] โคมกระดาษ กล่องขนม ปฏิทินปี หญิงยิ้มโล่ง (น้องม้วนกลาง)',
 [bg('ar3','#7f1d1d','#fde68a','#57534e'), ''.join(f'<g transform="translate({240+i*34} 60)"><path d="M0 -10v8" stroke="#fde68a"/><ellipse cy="10" rx="11" ry="13" fill="#ef4444"/><path d="M-8 10h16" stroke="#fde68a"/></g>' for i in range(3)), ''.join(f'<rect x="{236+i*24}" y="{112-(i%2)*10}" width="20" height="{24+(i%2)*10}" fill="{c}" stroke="#7c2d12"/>' for i,c in enumerate(['#fde68a','#fca5a5','#fde68a','#fca5a5'])),
  STEPCARD(10,84,'1','คำชี้ขาด','มีผล 1 ปี (ม.30)','#b91c1c',ICON('clock','#b91c1c')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','ไม่ทำตาม','คุก ≤ 1 ด. (ม.131)','#ca8a04',ICON('shield','#ca8a04')),
  NOTEBAR(10,128,'ผู้ชี้ขาดรับสินบน → คุก ≤ 1 ปี','#b91c1c',132,-2),
  FLOOR('#000',.14), DUST(7,1961,'#fde68a',.45), vignette('ar3')]+person('W',292,'#f43f5e','#e8b88f','joy'))
open('/home/claude/work/s559.js','w').write(o)
