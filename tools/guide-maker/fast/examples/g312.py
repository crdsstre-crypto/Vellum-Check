import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wcwarehouse','[ภาพประกอบนิทาน เช้าที่โกดังต่างจังหวัด โทนเขียวขี้ม้าอ่อน] ประตูโกดัง หมุดแผนที่เชียงราย ลูกศรไปศาล',
 [bg('wc1','#ecfccb','#fef9c3','#8aa87a',wall_tex=False), rolldoor(240,100) if False else '<g transform="translate(240 92)"><path d="M-40 0l40-20l40 20v52h-80z" fill="#d6d3d1" stroke="#78716c" stroke-width="2"/>'+''.join(f'<path d="M-30 {10+i*7}h60" stroke="#a8a29e"/>' for i in range(6))+'</g>',
  '<g transform="translate(140 96)"><path d="M0 0c-10 -14 -10 -24 0 -24s10 10 0 24z" fill="#dc2626"/><circle cy="-16" r="4" fill="#fff"/></g>', CHIP(140,118,'ทรัพย์อยู่ที่ไหน','#4d7c0f'),
  FLOOR('#365314',.07), DUST(9,312,'#fff',.5), vignette('wc1'), FG('l','#365314',.25)]+person('M',318,'#4d7c0f','#d8a882','calm'))
o+=P('wcglobe','[ภาพประกอบนิทาน บ่ายในร้านของฝาก โทนฟ้าคราม] ลูกโลก กล่องส่งต่างประเทศ สมุดบัญชีธนาคารไทย',
 [bg('wc2','#e0f2fe','#e0e7ff','#7a8aa8'), globe(240,104), bankbook(270,118), crate(200,124,36,26,'#0369a1'), PENGUIN(150,118,.75),
  FLOOR('#0c4a6e',.07), vignette('wc2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('wccourt','[ภาพประกอบนิทาน เช้าหน้าศาล โทนพีช] สองแฟ้มคดีรวมเป็นแฟ้มเดียว อาคารศาล',
 [bg('wc3','#ffedd5','#fef3c7','#a8846a',wall_tex=False), COURTHOUSE(250,132), '<g transform="translate(140 104)"><rect x="-24" y="-12" width="22" height="28" rx="2" fill="#fdba74"/><rect x="2" y="-12" width="22" height="28" rx="2" fill="#fca5a5"/><path d="M-12 24q12 10 24 0" stroke="#c2410c" stroke-width="2" fill="none"/><path d="M12 24l-2-5l6 1z" fill="#c2410c"/></g>',
  FLOOR('#7c2d12',.06), vignette('wc3')]+person('W',292,'#ea580c','#e8b896','happy'))
open('/home/claude/work/s312.js','w').write(o)
