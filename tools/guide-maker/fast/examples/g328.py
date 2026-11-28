import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('svplant','[ภาพประกอบนิทาน เช้าในร้านต้นไม้ โทนเขียวใบไม้] กระถางเรียงชั้น คำให้การ 3 ชุด',
 [bg('sv1','#dcfce7','#ecfccb','#7aa87a'), ''.join(f'<g transform="translate({206+i*26} 128)"><path d="M-9 0h18l-3 14h-12z" fill="#c2410c"/><path d="M0 0q-10 -16 -2 -26q8 10 2 26M0 0q10 -12 6 -22" fill="#22c55e" stroke="#15803d"/></g>' for i in range(4)),
  ''.join(f'<rect x="{118+i*6}" y="{90+i*5}" width="34" height="42" rx="2" fill="#fff" stroke="#16a34a"/>' for i in range(3)), CHIP(150,82,'สำเนา 3 ชุด','#15803d'),
  FLOOR('#14532d',.07), DUST(9,328,'#fff',.5), vignette('sv1'), FG('l','#14532d',.3)]+person('W',318,'#16a34a','#e8b896','worried'))
o+=P('svcourt','[ภาพประกอบนิทาน ใกล้เย็นที่ศาล โทนส้มอำพัน] ถาดรับเอกสาร ซองอีเมลบินเข้า นาฬิกาเส้นตาย',
 [bg('sv2','#ffedd5','#fef3c7','#a88a6a'), courtcounter(240,146,110), INBOX(240,116,3,'#c2410c'), SEAL(140,100,'ทันกำหนด','#15803d',w=70),
  FLOOR('#7c2d12',.07), vignette('sv2')]+person('M',60,'#ea580c','#d8a882','calm'))
o+=P('svpost','[ภาพประกอบนิทาน กลางวันหน้าบ้านพยาน โทนฟ้าสดใส] หมายเรียกพยาน ดวงอาทิตย์ แฮมสเตอร์ในกระถาง',
 [bg('sv3','#e0f2fe','#fef9c3','#7a9aa8',wall_tex=False), '<g transform="translate(250 72)"><circle r="14" fill="#fde047"/>'+''.join(f'<path d="M0 -20v-6" stroke="#facc15" stroke-width="3" transform="rotate({a})"/>' for a in range(0,360,45))+'</g>', courtenvelope(240,124), HAMSTER(96,128,.65),
  FLOOR('#0c4a6e',.06), vignette('sv3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s328.js','w').write(o)
