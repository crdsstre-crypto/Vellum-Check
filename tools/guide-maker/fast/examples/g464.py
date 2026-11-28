import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('nbmango','[ภาพประกอบนิทาน เช้าหน้าร้านผลไม้ โทนเหลืองมะม่วง] ผนังร้าว น้ำฝนจากหลังคาตึกข้าง ตะกร้ามะม่วง',
 [bg('nb1','#fef9c3','#fef3c7','#a89a6a',wall_tex=False), RAINWALL(250,108), '<g transform="translate(150 128)"><path d="M-24 -6h48l-6 18h-36z" fill="#a16207"/>'+''.join(f'<ellipse cx="{-14+i*10}" cy="-10" rx="6" ry="5" fill="#facc15" stroke="#ca8a04"/>' for i in range(4))+'</g>',
  FLOOR('#713f12',.08), DUST(9,464,'#fff',.5), vignette('nb1'), FG('l','#713f12',.25)]+person('W',318,'#ca8a04','#e8b896','worried'))
o+=P('nbsite','[ภาพประกอบนิทาน บ่ายที่ไซต์ตึกข้าง โทนส้มเทา] ชั้นสามต่อเติม หมวกนิรภัย วงนับ 30 วัน',
 [bg('nb2','#ffedd5','#f5f5f4','#a8907a',wall_tex=False), '<g transform="translate(250 120)"><rect x="-30" y="-40" width="60" height="64" fill="#d6d3d1"/><rect x="-30" y="-56" width="60" height="16" fill="#fca5a5" stroke="#dc2626" stroke-dasharray="4 3"/><path d="M-36 -56l36 -14l36 14" fill="none" stroke="#64748b" stroke-width="2"/></g>', DAYRING(140,98,'30','วัน',.5,'#c2410c',18),
  FLOOR('#44403c',.08), vignette('nb2')]+person('M',60,'#ea580c','#d8a882','calm'))
o+=P('nboffice','[ภาพประกอบนิทาน เย็นที่เทศบาล โทนเขียวมิ้นต์] หนังสือร้องเรียนผู้เสียหาย ฮิปโปตุ๊กตา',
 [bg('nb3','#d1fae5','#ecfeff','#6aa89a'), desk(240,134,100,'#0f766e'), DOC(214,80,72,46,'ร้องเรียน',[('ผู้เสียหาย ม.73','#0f766e')],'#0d9488'), HIPPO(92,124,.7),
  FLOOR('#134e4a',.06), vignette('nb3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s464.js','w').write(o)
