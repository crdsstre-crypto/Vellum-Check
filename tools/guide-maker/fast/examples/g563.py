import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('mbbook','[ภาพประกอบนิทาน สายในร้านซักรีด เครื่องซักเรียง ผ้าพับซ้อน สมุดบัญชีสมาคมเปิดบนโต๊ะ แว่นขยาย โทนฟ้าน้ำยาปรับผ้ากับลาเวนเดอร์ แสงสะอาดสดใส] เครื่องซัก ผ้าพับ สมุดบัญชี แกะน้อย หญิงตรวจบัญชี (น้องม้วนขวา)',
 [bg('mb1','#e0f2fe','#ede9fe','#a8a29e'), ''.join(f'<g transform="translate({224+i*36} 84)"><rect width="32" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/><circle cx="16" cy="26" r="10" fill="#bae6fd" stroke="#64748b" stroke-width="2"/></g>' for i in range(3)), LAMB(340,142,.42),
  LETTER(122,64,'ขอดูบัญชีสมาคม',['สมาชิกตรวจทะเบียน/บัญชีได้ (ม.64)','สมาคมต้องมีทะเบียนสมาชิก (ม.71)','ไม่ทำ → ปรับ ≤ 2,000 (ม.146)'],'#6d28d9',124,-2,1,12),
  FLOOR('#4c1d95',.05), DUST(7,2363,'#fff',.45), vignette('mb1'), FG('r','#4c1d95',.12)]+person('W',60,'#a78bfa','#e8b88f','calm'))
o+=P('mbtalk','[ภาพประกอบนิทาน บ่ายในห้องเจรจา สองฝั่งโต๊ะ ธงสมาคมนายจ้าง แฟ้มข้อตกลง จับมือ โทนเขียวมะกอกกับส้มอ่อน แสงบ่ายนุ่ม] ธงสมาคม โต๊ะเจรจา แฟ้ม ชายผู้แทนสมาคม (น้องม้วนซ้าย)',
 [bg('mb2','#ecfccb','#ffedd5','#a8a29e'), '<g transform="translate(300 56)"><path d="M0 0v70" stroke="#57534e" stroke-width="3"/><path d="M0 2h34l-6 10l6 10h-34z" fill="#65a30d"/></g>', '<g transform="translate(220 110)"><rect width="76" height="10" rx="2" fill="#78350f"/><rect x="10" y="-8" width="22" height="8" fill="#fff" stroke="#65a30d"/><rect x="44" y="-8" width="22" height="8" fill="#fff" stroke="#c2410c"/></g>',
  LETTER(56,64,'สมาคมทำอะไรแทนได้',['เจรจา ทำข้อตกลง รับคำชี้ขาด','ปรึกษา สนเทศ สวัสดิการ (ม.66)','ร้านยังต้องแจ้งปิดงาน 24 ชม.'],'#4d7c0f',146,-2,1,12),
  FLOOR('#365314',.05), DUST(6,2364,'#fff',.4), vignette('mb2')]+person('M',318,'#84cc16','#d8a882','calm'))
o+=P('mbout','[ภาพประกอบนิทาน ค่ำหน้าสำนักงานสมาคม ป้ายชื่อทองเหลือง ร่มกันฝน ตู้จดหมาย ใบลาออก โทนม่วงพลบกับเหลืองโคม แสงโคมหน้าประตู] ป้ายทองเหลือง ตู้จดหมาย ร่ม หญิงลังเล (น้องม้วนกลาง)',
 [bg('mb3','#4c1d95','#fde68a','#57534e'), '<g transform="translate(230 66)"><rect width="72" height="22" rx="3" fill="#ca8a04"/><text x="36" y="15" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif" font-weight="900">สมาคมนายจ้าง</text></g>', '<g transform="translate(316 100)"><rect width="22" height="30" rx="3" fill="#dc2626"/><rect x="4" y="6" width="14" height="3" fill="#1f2937"/></g>', lamp(260,40,'#fde68a'),
  STEPCARD(10,84,'1','ทำเพื่อสมาชิก','คุ้มกันแพ่ง/อาญา (ม.67)','#7c3aed',ICON('shield','#7c3aed')), ARROW(70,102,'#fde68a'),
  STEPCARD(80,84,'2','สิ้นสมาชิกภาพ','ตาย ลาออก ให้ออก (ม.65)','#ca8a04',ICON('mail','#ca8a04')),
  NOTEBAR(10,128,'ใส่ร้าย/ทำร้าย → ไม่คุ้มกัน','#7c3aed',132,-2),
  FLOOR('#000',.14), DUST(7,2365,'#fde68a',.45), vignette('mb3')]+person('W',292,'#c084fc','#e8b88f','worried'))
open('/home/claude/work/s563.js','w').write(o)
