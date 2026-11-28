import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('pnbuy','[ภาพประกอบนิทาน เช้าหน้าร้านซ่อมมือถือ โทนฟ้ามิ้นต์] ตึกที่ซื้อต่อ ใบอนุญาตชื่อเดิม',
 [bg('q1','#e0f2fe','#ccfbf1','#7a9aa8',wall_tex=False), DORMBLDG(236,116,'#0ea5e9','หอพักเอกชน','ซ่อมมือถือ'), DOC(140,90,70,36,'ใบอนุญาตเดิม',[('ชื่อเจ้าของเก่า','#dc2626')],'#64748b'),
  FLOOR('#0c4a6e',.06), DUST(7,485,'#fff',.5), vignette('q1')]+person('W',318,'#0284c7','#e8b896','hmm'))
o+=P('pnroof','[ภาพประกอบนิทาน บ่ายบนดาดฟ้า โทนส้มเหลือง] ห้องต่อเติม ใบปรับ 20,000',
 [bg('q2','#ffedd5','#fef9c3','#a88a6a'), '<g transform="translate(150 110)"><rect x="-30" y="-24" width="60" height="40" fill="#fde68a" stroke="#a16207" stroke-width="2"/><path d="M-36 -24l36 -14 36 14z" fill="#f97316"/><rect x="-8" y="-4" width="16" height="20" fill="#a16207"/></g>', FINESLIP(250,96,'20,000','#c2410c'),
  FLOOR('#7c2d12',.07), vignette('q2')]+person('M',60,'#ea580c','#d8a882','shock'))
o+=P('pndesk','[ภาพประกอบนิทาน เย็นที่ล็อบบี้ โทนม่วงพาสเทล] ป้ายผู้จัดการว่าง ปฏิทินแจ้งนายทะเบียน นกฮูก',
 [bg('q3','#f3e8ff','#ede9fe','#8a7aa8'), desk(240,134,100,'#7e22ce'), '<g transform="translate(250 92)"><rect x="-28" y="-14" width="56" height="28" rx="3" fill="#fff" stroke="#7e22ce" stroke-width="2"/><text y="-2" font-size="6.5" font-weight="900" text-anchor="middle" fill="#7e22ce">ผู้จัดการหอพัก</text><text y="8" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626">ว่าง?</text></g>', OWL(96,122,.75,'#ddd6fe'),
  CHIP(164,86,'ต้องมีใบอนุญาต','#7e22ce'), FLOOR('#581c87',.06), vignette('q3')]+person('W',292,'#9333ea','#e8b896','calm'))
open('/home/claude/work/s485.js','w').write(o)
