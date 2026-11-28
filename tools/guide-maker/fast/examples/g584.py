import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('adclaim','[ภาพประกอบนิทาน สายในห้องการตลาด บิลบอร์ดโฆษณามีสระว่ายน้ำ แผนผังจริงมีแค่สวนเล็ก แว่นขยายเทียบ โทนฟ้าสระน้ำกับส้มโฆษณา แสงจอคอมพิวเตอร์] บิลบอร์ด แผนผัง แว่นขยาย นกทูแคน หญิงตรวจโฆษณา (น้องม้วนขวา)',
 [bg('ad1','#e0f2fe','#ffedd5','#a8a29e'), '<g transform="translate(222 62)"><rect width="70" height="44" rx="3" fill="#fff" stroke="#ea580c" stroke-width="2"/><rect x="8" y="22" width="30" height="14" rx="4" fill="#38bdf8"/><circle cx="54" cy="18" r="8" fill="#86efac"/></g>', '<g transform="translate(300 96)"><rect width="36" height="32" fill="#fff" stroke="#15803d"/><circle cx="18" cy="16" r="5" fill="#86efac"/></g>', '<g transform="translate(290 80)"><circle r="9" fill="none" stroke="#1f2937" stroke-width="3"/><path d="M6 6l8 8" stroke="#1f2937" stroke-width="3"/></g>', TOUCAN(342,142,.34),
  LETTER(122,64,'โฆษณาต้องตรงคำขอ',['ตรงแผนผังที่ยื่น (ม.29)','ฝ่าฝืน ปรับ 5 หมื่น–1 แสน','นายหน้าโฆษณาเองก็อาจผิด'],'#ea580c',124,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(7,4484,'#fff',.4), vignette('ad1'), FG('r','#0c4a6e',.12)]+person('W',60,'#f97316','#e8b88f','worried'))
o+=P('adcontract','[ภาพประกอบนิทาน บ่ายโต๊ะเซ็นสัญญา สัญญาสองฉบับ แบบมาตรฐานกับร่างเอง ข้อริบเงินถูกขีดฆ่า ปากกาหมึกซึม โทนน้ำตาลไม้กับเขียวหยก แสงบ่ายนุ่ม] สัญญาสองฉบับ ข้อถูกขีดฆ่า ปากกา ชายอ่านสัญญา (น้องม้วนซ้าย)',
 [bg('ad2','#fef3c7','#ccfbf1','#a8a29e'), '<g transform="translate(224 70) rotate(-5)"><rect width="44" height="58" fill="#fff" stroke="#0f766e" stroke-width="2"/><rect x="6" y="6" width="32" height="5" fill="#0f766e"/></g><g transform="translate(276 72) rotate(5)"><rect width="44" height="58" fill="#fff" stroke="#b91c1c" stroke-width="2"/><rect x="6" y="20" width="32" height="4" fill="#fca5a5"/><path d="M4 22h36" stroke="#b91c1c" stroke-width="3"/></g>',
  LETTER(56,64,'สัญญาตามแบบ',['ต้องใช้แบบคณะกรรมการกลาง','ข้อไม่เป็นคุณผู้ซื้อ = ไม่มีผล','ฝ่าฝืน ปรับ ≤ 5,000 (ม.63)'],'#0f766e',146,-2,1,12),
  FLOOR('#134e4a',.05), DUST(6,4485,'#fff',.4), vignette('ad2')]+person('M',318,'#14b8a6','#d8a882','calm'))
o+=P('adreceipt','[ภาพประกอบนิทาน เย็นที่สำนักงานขายโครงการ เครื่องพิมพ์ใบเสร็จ เงินจองในซอง ตราลายเซ็น โทนชมพูอ่อนกับทองอุ่น แสงไฟสำนักงาน] ใบเสร็จ ซองเงิน ตรา หญิงออกใบเสร็จ (น้องม้วนกลาง)',
 [bg('ad3','#fce7f3','#fef3c7','#a8a29e'), '<g transform="translate(236 92)"><rect width="44" height="30" rx="3" fill="#475569"/><rect x="8" y="-22" width="28" height="24" fill="#fff" stroke="#be185d"/><rect x="12" y="-16" width="20" height="3" fill="#f9a8d4"/></g>', envelope(296,96,.9,'#fde68a','#ca8a04',4,'#be185d'),
  STEPCARD(10,84,'1','รับเงินราคา/จำนอง','ออกหลักฐานลงชื่อ','#be185d',ICON('pen','#be185d')), ARROW(70,102,'#be185d'),
  STEPCARD(80,84,'2','ไม่ออก','ปรับ ≤ 5,000 (ม.64)','#ca8a04',ICON('coin','#ca8a04')),
  NOTEBAR(10,128,'ใบเสร็จมีเลขที่ แปลง ลายเซ็น','#be185d',132,-2),
  FLOOR('#831843',.05), DUST(7,4486,'#fff',.45), vignette('ad3')]+person('W',292,'#ec4899','#e8b88f','smile'))
open('/home/claude/work/s584.js','w').write(o)
