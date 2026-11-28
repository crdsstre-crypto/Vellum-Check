import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bdwho','[ภาพประกอบนิทาน สายในร้านขายยา ชั้นยาเรียงสวย ตู้กระจก ป้ายกาชาด เภสัชกรติดเข็มกรรมการ โทนเขียวมิ้นต์กับขาวสะอาด แสงไฟร้านขาวนวล] ชั้นยา ตู้กระจก เข็มกรรมการ นกฮูก ชายกรรมการ (น้องม้วนขวา)',
 [bg('bd1','#d1fae5','#f8fafc','#a8a29e'), ''.join(f'<g transform="translate(226 {66+i*22})"><rect width="100" height="4" fill="#94a3b8"/>'+''.join(f'<rect x="{6+j*16}" y="-12" width="10" height="12" rx="2" fill="{c}"/>' for j,c in enumerate(['#f472b6','#60a5fa','#facc15','#34d399','#f97316','#a78bfa']))+'</g>' for i in range(3)), OWL(340,142,.4),
  LETTER(122,64,'ใครเป็นกรรมการได้',['สมาชิก/ผู้แทนนิติบุคคลสมาชิก','สัญชาติไทยโดยการเกิด (ม.69)','มอบกรรมการ/ตั้งอนุกรรมการ (ม.68)'],'#047857',124,-2,1,12),
  FLOOR('#064e3b',.05), DUST(7,2464,'#fff',.45), vignette('bd1'), FG('r','#064e3b',.12)]+person('M',60,'#10b981','#d8a882','calm'))
o+=P('bdgm','[ภาพประกอบนิทาน บ่ายในห้องประชุมใหญ่ มือยกลงมติ กระดานคะแนน ไมค์ตั้งพื้น โทนส้มพีชกับน้ำเงินกรม แสงบ่ายจากหน้าต่างบานใหญ่] มือยก กระดานคะแนน ไมค์ เพนกวิน หญิงนับคะแนน (น้องม้วนซ้าย)',
 [bg('bd2','#ffedd5','#dbeafe','#a8a29e'), ''.join(f'<g transform="translate({222+i*22} {104-(i%2)*8})"><path d="M0 20v-18" stroke="#e8b88f" stroke-width="6" stroke-linecap="round"/></g>' for i in range(5)), '<g transform="translate(292 62)"><rect width="50" height="34" rx="3" fill="#1e3a8a"/><text x="25" y="22" text-anchor="middle" font-size="11" fill="#fde68a" font-family="sans-serif" font-weight="900">มติ</text></g>', PENGUIN(242,140,.36),
  LETTER(56,64,'ต้องผ่านประชุมใหญ่',['แก้ข้อบังคับ (จด 14 วัน)','จัดสรรเงินสวัสดิการ','เลิก/ควบ/เข้าสหพันธ์ (ม.70)'],'#c2410c',146,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(6,2465,'#fff',.4), vignette('bd2')]+person('W',318,'#fb923c','#e8b88f','calm'))
o+=P('bdaudit','[ภาพประกอบนิทาน ค่ำในห้องบัญชี เครื่องคิดเลขม้วนกระดาษยาว งบดุลบนโต๊ะ ซองถึงนายทะเบียน โทนเขียวบัญชีกับเหลืองโคม แสงโคมโต๊ะเขียว] เครื่องคิดเลข งบดุล ซอง ชายตั้งใจ (น้องม้วนกลาง)',
 [bg('bd3','#14532d','#fde68a','#57534e'), lamp(320,40,'#86efac'), '<g transform="translate(232 98)"><rect width="40" height="30" rx="3" fill="#e5e7eb" stroke="#475569"/><rect x="5" y="4" width="30" height="8" fill="#a7f3d0"/><path d="M10 0v-30q4 -4 8 0v30" fill="#fff" stroke="#94a3b8"/></g>', envelope(290,100,.9,'#fff','#dcfce7',4,'#15803d'),
  STEPCARD(10,84,'1','ตรวจบัญชีทุกปี','งบดุล → ประชุมใหญ่','#15803d',ICON('mag','#15803d')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','ส่งนายทะเบียน','ภายใน 30 วัน (ม.75)','#ca8a04',ICON('mail','#ca8a04')),
  NOTEBAR(10,128,'กรรมการรู้เห็น → คุก ≤ 1 ด. (ม.146)','#15803d',132,-2),
  FLOOR('#000',.14), DUST(7,2466,'#fde68a',.45), vignette('bd3')]+person('M',292,'#22c55e','#d8a882','calm'))
open('/home/claude/work/s564.js','w').write(o)
