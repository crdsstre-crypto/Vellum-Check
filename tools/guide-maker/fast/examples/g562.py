import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('asfound','[ภาพประกอบนิทาน เย็นริมทะเล ร้านอาหารไม้หลายร้านเรียงกัน โคมไฟเชือก เจ้าของร้านมาประชุม โทนฟ้าทะเลกับส้มพระอาทิตย์ตก แสงอาทิตย์ตกอุ่น] ร้านริมทะเล โคมไฟ คลื่น นกนางนวล ชายผู้เริ่มก่อการ (น้องม้วนขวา)',
 [bg('as1','#fed7aa','#bae6fd','#a8a29e'), '<circle cx="320" cy="70" r="16" fill="#fb923c" opacity=".8"/><path d="M220 112q20 -6 40 0t40 0t40 0" stroke="#0284c7" stroke-width="3" fill="none"/>', ''.join(f'<g transform="translate({224+i*36} 116)"><path d="M0 0l15 -12l15 12z" fill="#b45309"/><rect y="0" width="30" height="22" fill="#fde68a" stroke="#92400e"/></g>' for i in range(3)), stringlights(70,'#fde68a',220,350,20),
  LETTER(122,64,'ใครตั้งสมาคมได้',['นายจ้างกิจการประเภทเดียวกัน','บรรลุนิติภาวะ สัญชาติไทย','ผู้เริ่มก่อการ ≥ 3 คน (ม.57)'],'#c2410c',124,-2,1,12),
  FLOOR('#7c2d12',.06), DUST(7,2262,'#fff',.4), vignette('as1'), FG('r','#0c4a6e',.12)]+person('M',60,'#f97316','#d8a882','calm'))
o+=P('asrules','[ภาพประกอบนิทาน บ่ายในห้องสมุดเล็ก กองร่างข้อบังคับสามชุด ปากกาหมึกซึม ตราประทับ โทนเขียวหยกกับครีมกระดาษ แสงบ่ายผ่านมู่ลี่] ร่างข้อบังคับ 3 ชุด ตรา ชั้นหนังสือ หญิงเขียน (น้องม้วนซ้าย)',
 [bg('as2','#ccfbf1','#fef9c3','#a8a29e'), shelf(296,64,56), ''.join(f'<g transform="translate({222+i*8} {94+i*6}) rotate({-4+i*3})"><rect width="46" height="34" rx="2" fill="#fff" stroke="#0f766e" stroke-width="1.4"/><rect x="6" y="8" width="30" height="3" fill="#99f6e4"/><rect x="6" y="16" width="24" height="3" fill="#99f6e4"/></g>' for i in range(3)), SEAL(296,122,'สมาคมนายจ้าง','#0f766e',-8,64),
  LETTER(56,64,'ข้อบังคับ 10 หัวข้อ',['ชื่อมีคำว่า สมาคมนายจ้าง','ค่าบำรุง ตรวจบัญชี','วิธีปิดงาน/อนุมัติข้อตกลง (ม.58)'],'#0f766e',146,-2,1,12),
  FLOOR('#134e4a',.05), DUST(6,2263,'#fff',.4), vignette('as2')]+person('W',318,'#14b8a6','#e8b88f','calm'))
o+=P('asfirst','[ภาพประกอบนิทาน สายในห้องประชุมใหญ่ เก้าอี้เรียงแถว โพเดียม ปฏิทินวงวันที่ 120 ราชกิจจานุเบกษาบนโต๊ะ โทนน้ำเงินกรมกับทอง แสงไฟห้องประชุม] โพเดียม เก้าอี้ ปฏิทิน 120 หญิงประธาน (น้องม้วนกลาง)',
 [bg('as3','#dbeafe','#fef3c7','#a8a29e'), '<g transform="translate(236 88)"><rect width="30" height="44" fill="#1e3a8a"/><rect x="-4" y="-4" width="38" height="8" fill="#ca8a04"/></g>'+''.join(f'<rect x="{280+i*16}" y="122" width="12" height="18" rx="2" fill="#93c5fd"/>' for i in range(4)), DAYRING(300,80,'120','วัน',.6,'#1d4ed8',18),
  STEPCARD(10,84,'1','ประชุมใหญ่แรก','ภายใน 120 วัน (ม.61)','#1d4ed8',ICON('clock','#1d4ed8')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'2','จดข้อบังคับ+กรรมการ','ภายใน 14 วัน','#ca8a04',ICON('pen','#ca8a04')),
  NOTEBAR(10,128,'ไม่ทำ → ปรับวันละ ≤ 50 (ม.144)','#1d4ed8',132,-2),
  FLOOR('#1e3a8a',.05), DUST(7,2264,'#fff',.45), vignette('as3')]+person('W',292,'#3b82f6','#e8b88f','smile'))
open('/home/claude/work/s562.js','w').write(o)
