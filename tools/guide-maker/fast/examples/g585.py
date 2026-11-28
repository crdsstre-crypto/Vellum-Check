import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('opblock','[ภาพประกอบนิทาน สายในหมู่บ้านจัดสรร ถนนเส้นรองถูกรั้วตาข่ายปิด มินิมาร์ทหัวมุม ลูกค้าเดินอ้อม โทนเขียวต้นไม้กับเทาถนน แสงเช้า] รั้วปิดถนน มินิมาร์ท ลูกค้าอ้อม หมาน้อย ชายเจ้าของร้าน (น้องม้วนขวา)',
 [bg('op1','#dcfce7','#e7e5e4','#a8a29e'), '<rect x="214" y="110" width="120" height="26" fill="#a8a29e"/><g transform="translate(262 90)">'+''.join(f'<path d="M{i*8} 0l8 46M{i*8+8} 0l-8 46" stroke="#57534e" stroke-width="1.4"/>' for i in range(5))+'<rect x="-2" y="-2" width="44" height="4" fill="#57534e"/></g>', SHOPFRONT(220,62,40,'#0f766e','มินิ'), FOX(342,142,.38),
  LETTER(122,64,'ถนนส่วนกลาง',['ภาระจำยอม ห้ามทำให้ลด (ม.43)','คณะกรรมการสั่งระงับ (ม.52)','ไม่ทำตาม ปรับวันละ 1,000'],'#15803d',124,-2,1,12),
  FLOOR('#14532d',.05), DUST(7,4585,'#fff',.4), vignette('op1'), FG('r','#14532d',.12)]+person('M',60,'#22c55e','#d8a882','worried'))
o+=P('optransfer','[ภาพประกอบนิทาน บ่ายในสวนส่วนกลาง ม้านั่ง เครื่องเล่นเด็ก ป้ายห้ามโอน แฟ้มโอนกรรมสิทธิ์ถูกกากบาท โทนเขียวใบไม้กับชมพูอ่อน แสงบ่ายผ่านต้นไม้] ม้านั่ง ชิงช้า แฟ้มกากบาท หญิงปกป้องสวน (น้องม้วนซ้าย)',
 [bg('op2','#dcfce7','#fce7f3','#a8a29e'), '<g transform="translate(228 74)"><path d="M0 50l20 -50l20 50" stroke="#be185d" stroke-width="3" fill="none"/><path d="M20 0v34" stroke="#57534e"/><rect x="12" y="34" width="16" height="4" fill="#be185d"/></g>', '<rect x="276" y="118" width="50" height="6" fill="#92400e"/><path d="M280 124v12M322 124v12" stroke="#92400e" stroke-width="3"/>', '<g transform="translate(296 74)"><rect width="34" height="28" fill="#fff" stroke="#475569"/><path d="M4 4l26 20M30 4l-26 20" stroke="#dc2626" stroke-width="3"/></g>',
  LETTER(56,64,'ที่ดินสาธารณูปโภค',['ห้ามโอน (ม.43/1)','โอนให้นิติบุคคลหมู่บ้าน ยกเว้นภาษี','ค่าบริการตามอัตราเห็นชอบ'],'#be185d',146,-2,1,12),
  FLOOR('#14532d',.05), DUST(6,4586,'#fff',.4), vignette('op2')]+person('W',318,'#ec4899','#e8b88f','calm'))
o+=P('opdissolve','[ภาพประกอบนิทาน เย็นสำนักงานขายโครงการปิดทำการ ป้ายบริษัทหลุด กล่องเอกสาร สำนักงานวางทรัพย์ตราทอง โทนส้มทองกับเทาหม่น แสงเย็นอ่อน] ป้ายหลุด กล่อง ตรา ชายรอบคอบ (น้องม้วนกลาง)',
 [bg('op3','#ffedd5','#e7e5e4','#a8a29e'), '<g transform="translate(230 64) rotate(10)"><rect width="66" height="18" fill="#a8a29e"/><text x="33" y="13" text-anchor="middle" font-size="8" fill="#fff" font-family="sans-serif" font-weight="900">บจก.ผู้จัดสรร</text></g>', '<rect x="236" y="104" width="44" height="30" fill="#d6a46a" stroke="#92400e"/>', SEAL(304,104,'วางทรัพย์','#ca8a04',-6,54),
  STEPCARD(10,84,'1','บริษัทเลิก','ใช้ ม.40 โดยอนุโลม (ม.42)','#ea580c',ICON('mail','#ea580c')), ARROW(70,102,'#ea580c'),
  STEPCARD(80,84,'2','กรรมการ','สั่ง/ละเว้น → รับโทษ','#57534e',ICON('shield','#57534e')),
  NOTEBAR(10,128,'เก็บรูป แผนผัง ยอดขายที่ลดลง','#ea580c',132,-2),
  FLOOR('#7c2d12',.05), DUST(7,4587,'#fff',.45), vignette('op3')]+person('M',292,'#f97316','#d8a882','calm'))
open('/home/claude/work/s585.js','w').write(o)
