import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('pcavg','[ภาพประกอบนิทาน สายในร้านเย็บผ้าม่าน จักรเย็บผ้า ม้วนผ้าหลากสี ผ้าม่านแขวน สมุดนับผืน โทนชมพูแป้งกับเขียวมิ้นต์ แสงหน้าต่างใส] จักรเย็บ ม้วนผ้า สมุดนับผืน ผีเสื้อ หญิงช่างเย็บ (น้องม้วนขวา)',
 [bg('pc1','#fce7f3','#d1fae5','#a8a29e'), '<g transform="translate(230 98)"><rect y="18" width="64" height="12" rx="3" fill="#78716c"/><path d="M8 18v-22h40v10" stroke="#1f2937" stroke-width="7" fill="none"/><path d="M44 8v12" stroke="#94a3b8" stroke-width="2"/></g>', ''.join(f'<rect x="{304+i*12}" y="64" width="9" height="52" fill="{c}" opacity=".85"/>' for i,c in enumerate(['#f9a8d4','#86efac','#fde68a'])), butterfly(342,88,'#f472b6'),
  LETTER(122,64,'วันลาของคนรับตามชิ้น',['จ่ายเฉลี่ยวันทำงาน (ม.60)','ใช้งวดค่าจ้างก่อนวันลา','เช่น 12,000 ÷ 24 = 500/วัน'],'#be185d',124,-2,1,12),
  FLOOR('#831843',.05), DUST(7,2969,'#fff',.45), vignette('pc1'), FG('r','#166534',.1)]+person('W',60,'#ec4899','#e8b88f','calm'))
o+=P('pcmin','[ภาพประกอบนิทาน บ่ายเงียบงานน้อย กองผ้าเตี้ย ตาชั่งเงินกับป้ายขั้นต่ำ ลูกศรชี้ขึ้น โทนเหลืองมัสตาร์ดกับฟ้าหม่น แสงบ่ายนิ่ง] ตาชั่ง ป้ายขั้นต่ำ กองผ้าเตี้ย กระรอก ชายคิดเลข (น้องม้วนซ้าย)',
 [bg('pc2','#fef9c3','#dbeafe','#a8a29e'), JSCALE(262,72,8,'#a16207','ชิ้น','ขั้นต่ำ'), '<rect x="300" y="122" width="40" height="10" rx="2" fill="#fbcfe8"/>', SQUIRREL(232,142,.36),
  LETTER(56,64,'ขั้นต่ำใช้กับทุกคน',['ไม่เลือกปฏิบัติ (ม.89)','จ่ายตามชิ้นก็ไม่ยกเว้น','เทียบขั้นต่ำทุกงวด'],'#a16207',146,-2,1,12),
  FLOOR('#713f12',.05), DUST(6,2970,'#fff',.4), vignette('pc2')]+person('M',318,'#eab308','#d8a882','worried'))
o+=P('pcdays','[ภาพประกอบนิทาน เย็นในร้าน ปฏิทินสัปดาห์มีวันหยุดนักขัตฤกษ์ ไฟประดับธงทิว นาฬิกาตอกบัตร โทนม่วงอ่อนกับส้มทอง แสงเย็นอบอุ่น] ปฏิทินสัปดาห์ ธงทิว นาฬิกา หญิงยิ้ม (น้องม้วนกลาง)',
 [bg('pc3','#ede9fe','#fed7aa','#a8a29e'), '<g transform="translate(228 74)">'+''.join(f'<rect x="{i*14}" width="12" height="40" rx="2" fill="{c}"/>' for i,c in enumerate(['#fff','#fff','#fca5a5','#fff','#fff','#fff','#e5e7eb']))+'</g>', '<path d="M220 66'+''.join(f'l10 8l10 -8' for i in range(6))+'" stroke="#ea580c" stroke-width="2" fill="none"/>', wallclock(336,92,12),
  STEPCARD(10,84,'1','วันลา/ร้านสั่งหยุด','นับอายุงาน (ม.19)','#7c3aed',ICON('clock','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','เวลาเป็นสัปดาห์','วันหยุด = วันทำงาน','#ea580c',ICON('pen','#ea580c')),
  NOTEBAR(10,128,'คิด OT ห้ามหักวันหยุดออก (ม.69)','#7c3aed',132,-2),
  FLOOR('#4c1d95',.05), DUST(7,2971,'#fff',.45), vignette('pc3')]+person('W',292,'#a78bfa','#e8b88f','joy'))
open('/home/claude/work/s569.js','w').write(o)
