import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('eaudio','[ภาพประกอบนิทาน บ่ายในร้านเครื่องเสียง โทนครามม่วง] ลำโพง มิกเซอร์ ป้ายยึด ผู้มีส่วนได้เสียยืนดู',
 [bg('ea1','#e0e7ff','#f5f3ff','#7a7aa8'), '<g transform="translate(230 98)"><rect x="-16" y="0" width="32" height="48" rx="4" fill="#1e293b"/><circle cy="14" r="8" fill="#475569"/><circle cy="34" r="11" fill="#475569"/><circle cy="34" r="4" fill="#94a3b8"/></g>', '<g transform="translate(276 110)"><rect x="-16" y="0" width="32" height="36" rx="4" fill="#1e293b"/><circle cy="18" r="9" fill="#475569"/></g>', seizetag(250,96),
  DOC(110,92,84,48,'สิทธิ ม.288',[('อยู่ดูได้','#15803d'),('คัดสำเนาได้','#15803d')],'#4f46e5'),
  FLOOR('#312e81',.08), DUST(9,284,'#fff',.5), vignette('ea1'), FG('l','#312e81',.25)]+person('M',318,'#4f46e5','#d8a882','calm'))
o+=P('eawarehouse','[ภาพประกอบนิทาน เช้าในโกดังเก็บของยึด โทนส้มพีช] กองลำโพงที่ยึดสูงเกินหนี้ ตาชั่งเอียง ป้ายหนี้ 2 แสน vs 1.2 ล้าน',
 [bg('ea2','#ffedd5','#fef3c7','#a8846a'), crate(200,122,36,26,'#b45309'), crate(240,122,36,26,'#b45309'), crate(220,96,36,26,'#c2410c'), crate(280,122,36,26,'#b45309'),
  scaletwo(150,126) if False else '', CHIP(130,90,'หนี้ 2 แสน','#334155'), CHIP(130,112,'ยึด 1.2 ล้าน','#dc2626'), HANGTAG(270,92,'ของลูกค้า','#fbbf24'),
  FLOOR('#7c2d12',.07), vignette('ea2')]+person('W',60,'#ea580c','#e8b896','worried'))
o+=P('eacourt','[ภาพประกอบนิทาน สายๆ ที่ศาล โทนฟ้าหยก] คำร้องขอเพิกถอนหมาย ตราศาล กระรอกที่หน้าต่างศาล',
 [bg('ea3','#ccfbf1','#e0f2fe','#6aa8a0'), window(70,44), SQUIRREL(92,84,.8), judgebench(230,146) if False else desk(210,132,100,'#0f766e'),
  DOC(150,96,90,40,'คำร้อง ม.295',[('ขอเพิกถอน/แก้หมาย','#0f766e')],'#0f766e'), SEAL(256,92,'ก่อนเสร็จ','#0f766e'),
  FLOOR('#134e4a',.06), vignette('ea3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s284.js','w').write(o)
