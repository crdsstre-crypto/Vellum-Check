import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rvtoilet','[ภาพประกอบนิทาน เช้าที่ห้องน้ำรวมหอพัก โทนฟ้าครีม] หนังสือแจ้งแก้ไข กระเบื้องแตก',
 [bg('e1','#e0f2fe','#fef9c3','#7a9aa8',wall_tex=False), '<g transform="translate(150 112)">'+''.join(f'<rect x="{-24+(i%4)*12}" y="{-24+(i//4)*12}" width="11" height="11" fill="#f1f5f9" stroke="#94a3b8"/>' for i in range(16))+'<path d="M-6 -20l4 10-6 8 6 10" stroke="#475569" stroke-width="1.5" fill="none"/></g>',
  DOC(240,82,90,46,'หนังสือแจ้งแก้ไข',[('ไม่ตามกฎกระทรวง','#dc2626')],'#0284c7'), FLOOR('#0c4a6e',.06), DUST(7,482,'#fff',.5), vignette('e1')]+person('W',318,'#0284c7','#e8b896','worried'))
o+=P('rvdeadline','[ภาพประกอบนิทาน บ่ายในสำนักงานร้าน โทนส้มแดง] วง 60 วัน ป้าย +30 ใบอนุญาตจะโอน',
 [bg('e2','#ffedd5','#fee2e2','#a87a6a'), DAYRING(244,92,'60','วัน',.7,'#c2410c',22), CHIP(292,70,'+30','#b91c1c'), DOC(140,96,74,38,'โอนใบอนุญาต',[('หรือขึ้นทะเบียน','#c2410c')],'#ea580c'),
  FLOOR('#7c2d12',.07), vignette('e2')]+person('M',60,'#c2410c','#d8a882','shock'))
o+=P('rvrefund','[ภาพประกอบนิทาน เย็นที่ล็อบบี้หอ โทนเขียวมิ้นต์] ซองคืนเงินผู้พัก โคอาลา',
 [bg('e3','#dcfce7','#ccfbf1','#6a9a8a'), desk(240,134,100,'#047857'), ''.join(f'<g transform="translate({220+i*22} {100-i*4}) rotate({-8+i*8})"><rect x="-12" y="-8" width="24" height="16" rx="2" fill="#fff" stroke="#047857"/><text y="3" font-size="6" font-weight="900" text-anchor="middle" fill="#047857">คืนเงิน</text></g>' for i in range(3)), KOALA(96,122,.75),
  CHIP(160,86,'ก่อนเพิกถอน','#047857'), FLOOR('#064e3b',.06), vignette('e3')]+person('W',292,'#059669','#e8b896','relief'))
open('/home/claude/work/s482.js','w').write(o)
