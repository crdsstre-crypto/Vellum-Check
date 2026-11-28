import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dcroof','[ภาพประกอบนิทาน เช้าบนดาดฟ้า โทนฟ้าเหลือง] นั่งร้านต่อเติม อิฐ ป้ายขออนุญาต',
 [bg('k1','#e0f2fe','#fef9c3','#8a9aa8',wall_tex=False), '<g transform="translate(236 108)"><path d="M-40 20v-50M40 20v-50M-40 -10h80M-40 -30h80M-40 20l80 -50" stroke="#a16207" stroke-width="3"/>'+''.join(f'<rect x="{-30+(i%4)*16}" y="{4-(i//4)*8}" width="14" height="7" fill="#f87171" stroke="#b91c1c"/>' for i in range(8))+'</g>',
  CHIP(140,92,'ขอนายทะเบียน','#a16207'), FLOOR('#713f12',.06), DUST(7,481,'#fff',.5), vignette('k1')]+person('W',318,'#ca8a04','#e8b896','think'))
o+=P('dcmove','[ภาพประกอบนิทาน บ่ายหน้าหอ โทนเทาชมพู] กล่องย้ายของ หนังสือแจ้ง 90 วัน',
 [bg('k2','#f1f5f9','#fce7f3','#8a8a9a'), ''.join(f'<rect x="{126+i*26}" y="{110-(i%2)*14}" width="24" height="20" rx="2" fill="#d6a76a" stroke="#92400e"/>' for i in range(3)), DOC(246,78,84,42,'แจ้งเลิกหอพัก',[('ล่วงหน้า 90 วัน','#be185d')],'#db2777'),
  DAYRING(290,128,'90','วัน',.8,'#be185d',16), FLOOR('#475569',.07), vignette('k2')]+person('M',60,'#be185d','#d8a882','sad'))
o+=P('dcheir','[ภาพประกอบนิทาน เย็นในห้องผู้จัดการ โทนเขียวพีช] ใบอนุญาตโอนทายาท วง 180 วัน นกฮูก',
 [bg('k3','#dcfce7','#ffedd5','#8a9a7a'), desk(240,134,100,'#15803d'), DOC(214,80,84,42,'ขอรับโอนใบอนุญาต',[('ทายาท','#15803d')],'#22c55e'), DAYRING(150,90,'180','วัน',.6,'#15803d',16), BEAVER(96,124,.72),
  FLOOR('#14532d',.06), vignette('k3')]+person('W',292,'#16a34a','#e8b896','hopeful'))
open('/home/claude/work/s481.js','w').write(o)
