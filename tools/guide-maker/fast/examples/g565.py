import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rginspect','[ภาพประกอบนิทาน สายในสำนักงานสมาคม ตู้แฟ้มเหล็ก เจ้าหน้าที่ถือบัตรนายทะเบียน แว่นขยาย โทนเทาฟ้ากับเหลืองบัตร แสงไฟฟลูออเรสเซนต์] ตู้แฟ้ม บัตร แว่นขยาย แพนด้า ชายต้อนรับ (น้องม้วนขวา)',
 [bg('rg1','#e2e8f0','#fef9c3','#a8a29e'), ''.join(f'<rect x="{226+i*30}" y="70" width="26" height="66" rx="2" fill="#94a3b8" stroke="#475569"/><rect x="{232+i*30}" y="{80+j*18}" width="14" height="4" fill="#1e293b"/>' for i in range(3) for j in range(3)), idcard(300,60) if 'idcard' in globals() else '', PANDA(340,142,.38),
  LETTER(122,64,'นายทะเบียนตรวจ',['เข้าสำนักงานในเวลาทำการ','สั่งส่งเอกสาร/เรียกชี้แจง (ม.72)','ขัดขวาง → คุก ≤ 1 ด. (ม.142)'],'#475569',124,-2,1,12),
  FLOOR('#1e293b',.06), DUST(7,2565,'#fff',.4), vignette('rg1'), FG('r','#1e293b',.12)]+person('M',60,'#64748b','#d8a882','calm'))
o+=P('rgremove','[ภาพประกอบนิทาน บ่ายในห้องกรรมการ เก้าอี้ว่างหนึ่งตัว ป้ายชื่อกรรมการถูกถอด ร่มพิงผนัง คำสั่งเป็นหนังสือ โทนแดงอิฐกับครีม แสงบ่ายเฉียง] เก้าอี้ว่าง ป้ายชื่อ ร่ม หญิงตกใจ (น้องม้วนซ้าย)',
 [bg('rg2','#fee2e2','#fef3c7','#a8a29e'), '<g transform="translate(232 92)"><rect width="30" height="8" fill="#7f1d1d"/><rect x="2" y="-30" width="26" height="30" rx="3" fill="#b91c1c"/><path d="M4 8v26M26 8v26" stroke="#7f1d1d" stroke-width="3"/></g>', '<g transform="translate(276 76) rotate(18)"><rect width="40" height="12" rx="2" fill="#fde68a" stroke="#a16207"/></g>', '<path d="M330 76v56M318 80q12 -16 24 0z" stroke="#1d4ed8" stroke-width="3" fill="#93c5fd"/>',
  LETTER(56,64,'สั่งกรรมการออก (ม.73)',['ขัดขวางพนักงานประนอม/ผู้ชี้ขาด','ทำผิดวัตถุประสงค์จนขัดกฎหมาย','ให้คนนอกดำเนินกิจการ'],'#b91c1c',146,-2,1,12),
  FLOOR('#7f1d1d',.05), DUST(6,2566,'#fff',.4), vignette('rg2')]+person('W',318,'#ef4444','#e8b88f','worried'))
o+=P('rgappeal','[ภาพประกอบนิทาน เช้าหน้ากระทรวงแรงงาน บันไดกว้าง ซองอุทธรณ์ ปฏิทินวง 15 วัน โทนฟ้าสดกับเขียวต้นไม้ แสงเช้าแจ่ม] อาคารราชการ ปฏิทิน 15 วัน ซอง ชายมุ่งมั่น (น้องม้วนกลาง)',
 [bg('rg3','#dbeafe','#dcfce7','#a8a29e'), COURTHOUSE(236,62,1,'#1d4ed8'), DAYRING(324,90,'15','วัน',.8,'#1d4ed8',16),
  STEPCARD(10,84,'1','อุทธรณ์รัฐมนตรี','ยื่นนายทะเบียน 15 วัน','#1d4ed8',ICON('mail','#1d4ed8')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'2','ไม่พอใจ','ศาลแรงงาน (ม.74)','#15803d',ICON('shield','#15803d')),
  NOTEBAR(10,128,'สั่งเลือกใหม่แล้วไม่เลือก → สั่งเลิก','#1d4ed8',132,-2),
  FLOOR('#1e3a8a',.05), DUST(7,2567,'#fff',.45), vignette('rg3')]+person('M',292,'#3b82f6','#d8a882','hopeful'))
open('/home/claude/work/s565.js','w').write(o)
