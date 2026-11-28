import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lwdecor','[ภาพประกอบนิทาน เช้าในร้านของตกแต่งบ้าน โทนครีมเขียวเสจ] โคมไฟ แจกัน มือถือข้อความทนายขอถอนตัว',
 [bg('lw1','#ecfccb','#fef9c3','#8a9a6a'), '<g transform="translate(250 100)"><path d="M-14 -20h28l-8 -16h-12z" fill="#fde68a" stroke="#a16207"/><path d="M0 -20v40" stroke="#57534e" stroke-width="3"/><ellipse cx="0" cy="22" rx="14" ry="4" fill="#57534e"/></g><g transform="translate(205 116)"><path d="M-8 -16q-6 16 0 28h16q6 -12 0 -28z" fill="#86efac" stroke="#15803d"/></g>',
  '<g transform="translate(140 104) rotate(-6)"><rect x="-18" y="-28" width="36" height="56" rx="6" fill="#1e293b"/><rect x="-14" y="-22" width="28" height="40" rx="2" fill="#f8fafc"/><rect x="-11" y="-16" width="22" height="12" rx="3" fill="#dcfce7"/><text y="-8" text-anchor="middle" font-size="5" font-weight="900" fill="#15803d">ขอถอนตัว</text></g>',
  FLOOR('#3f6212',.07), DUST(9,327,'#fff',.5), vignette('lw1'), FG('l','#3f6212',.25)]+person('M',318,'#65a30d','#d8a882','worried'))
o+=P('lwcourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนม่วงลาเวนเดอร์] ใบมอบฉันทะ บัตรประชาชน ตราประทับ',
 [bg('lw2','#ede9fe','#fae8ff','#8a7aa8'), courtcounter(240,146,110), PROXY(250,100,'มอบฉันทะ','#7c3aed'), CHIP(150,96,'ยื่นทุกครั้ง','#7c3aed'),
  FLOOR('#2e1065',.07), vignette('lw2')]+person('W',60,'#7c3aed','#e8b896','calm'))
o+=P('lwoffice','[ภาพประกอบนิทาน เย็นห้องประชุมบริษัท โทนฟ้าพาสเทล] หนังสือรับรองบริษัท แฮมสเตอร์ตุ๊กตาบนโต๊ะ',
 [bg('lw3','#e0f2fe','#f0f9ff','#7a9aa8'), desk(240,134,100,'#0369a1'), HAMSTER(240,104,.8), DOC(110,86,92,44,'หนังสือรับรอง',[('กรรมการ 2 คน + ตรา','#0369a1')],'#0284c7'),
  FLOOR('#0c4a6e',.06), vignette('lw3')]+person('W',292,'#0284c7','#e8b896','happy'))
open('/home/claude/work/s327.js','w').write(o)
