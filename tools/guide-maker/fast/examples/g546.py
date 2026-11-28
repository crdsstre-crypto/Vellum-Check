import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bbbirth','[ภาพประกอบนิทาน เช้าในร้านดอกไม้ ถังดอกไม้สด สมุดฝากครรภ์สีชมพู โทนชมพูโรสกับเขียวใบไม้ แสงเช้านุ่ม] ถังดอกไม้ สมุดฝากครรภ์ เมฆหัวใจ ผีเสื้อ หญิงสงบ (น้องม้วนขวา)',
 [bg('bb1','#fce7f3','#dcfce7','#a8a29e'), ''.join(f'<g transform="translate({222+i*30} 110)"><rect width="22" height="30" rx="3" fill="#94a3b8"/>'+''.join(f'<circle cx="{4+j*7}" cy="{-2-(j%2)*6}" r="5" fill="{c}"/>' for j,c in enumerate(['#f472b6','#fde047','#fb7185']))+'</g>' for i in range(3)), butterfly(320,74,'#f9a8d4'),
  LETTER(122,64,'ฝากครรภ์ถึงคลอด',['ฝากครรภ์ ยา ทำคลอด ค่าห้อง','ดูแลทารก รถพยาบาล (ม.66)'],'#db2777',124,-2,1,12),
  FLOOR('#831843',.05), DUST(7,673,'#fff',.45), vignette('bb1'), FG('r','#9d174d',.12)]+person('W',60,'#f472b6','#e8b88f','calm'))
o+=P('bbhospital','[ภาพประกอบนิทาน กลางคืนหน้าห้องฉุกเฉินโรงพยาบาลอื่น ป้ายสีแดง รถพยาบาล ของเล่นเด็ก โทนแดงกุหลาบกับฟ้าคืน แสงไฟป้ายฉุกเฉิน] ป้ายฉุกเฉิน รถพยาบาล ใบเสร็จ ตุ๊กตาหมี ชายดีใจ (น้องม้วนซ้าย)',
 [bg('bb2','#1e3a8a','#fecdd3','#57534e'), SIGN(232,66,62,'ฉุกเฉิน','#dc2626','#fff',9), '<g transform="translate(220 106)"><rect width="64" height="30" rx="4" fill="#fff"/><path d="M64 8h12l6 10v12h-18z" fill="#f1f5f9"/><path d="M26 10h6v14h-6zM22 14h14v6h-14z" fill="#dc2626"/><circle cx="14" cy="32" r="6" fill="#1e293b"/><circle cx="66" cy="32" r="6" fill="#1e293b"/></g>', '<g transform="translate(170 132)"><circle r="8" fill="#d6a46a"/><circle cx="-6" cy="-7" r="3.4" fill="#d6a46a"/><circle cx="6" cy="-7" r="3.4" fill="#d6a46a"/></g>',
  LETTER(56,64,'คลอดโรงพยาบาลอื่น',['ใช้สถานพยาบาลตามสิทธิ (ม.58–59)','นอกสิทธิ → เงินทดแทนตามอัตรา','ละเลยคำสั่งแพทย์ → อาจลด (ม.60)'],'#be123c',146,-2,1,12),
  FLOOR('#000',.12), DUST(7,674,'#fecdd3',.45), vignette('bb2')]+person('M',318,'#e11d48','#d8a882','joy'))
o+=P('bbchild','[ภาพประกอบนิทาน บ่ายในบ้านที่มีเปลเด็ก ปฏิทินนับเดือนสมทบ ถุงนม โทนฟ้าเด็กอ่อนกับเหลืองครีม แสงบ่ายอบอุ่น] เปลเด็ก ปฏิทิน 12/36 ถุงนม ลูกแกะ หญิงมีหวัง (น้องม้วนกลาง)',
 [bg('bb3','#e0f2fe','#fef9c3','#a8a29e'), '<g transform="translate(216 104)"><path d="M0 0h60l-6 26h-48z" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/><path d="M6 26l-6 12M54 26l6 12" stroke="#0369a1" stroke-width="2"/></g>', calendar6(296,70,'#0369a1'), LAMB(330,142,.45),
  STEPCARD(10,84,'1','สมทบ ≥ 12','ใน 36 เดือน (ม.74)','#0369a1',ICON('clock','#0369a1')), ARROW(70,102,'#0369a1'),
  STEPCARD(80,84,'2','สงเคราะห์บุตร','เป็นอยู่ เรียน รักษา (ม.75)','#ca8a04',ICON('coin','#ca8a04')),
  NOTEBAR(10,128,'ร้านส่งสมทบตรงเวลา = สิทธิลูกจ้างครบ','#0369a1',132,-2),
  FLOOR('#0c4a6e',.05), DUST(7,675,'#fff',.45), vignette('bb3')]+person('W',292,'#38bdf8','#e8b88f','hopeful'))
open('/home/claude/work/s546.js','w').write(o)
