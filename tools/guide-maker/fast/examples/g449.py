import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cplaundry','[ภาพประกอบนิทาน เช้าในร้านซักผ้าหยอดเหรียญ โทนฟ้าใส] เครื่องซักผ้าเรียง ช่องหยอดเหรียญ',
 [bg('cp1','#e0f2fe','#ecfeff','#7aa0a8'), ''.join(f'<g transform="translate({206+i*34} 120)"><rect x="-15" y="-22" width="30" height="42" rx="4" fill="#f8fafc" stroke="#64748b"/><circle cy="4" r="10" fill="#bae6fd" stroke="#475569" stroke-width="2"/><rect x="-10" y="-18" width="8" height="4" rx="1" fill="#facc15"/></g>' for i in range(3)), CHIP(140,96,'ค่าใช้จ่ายเฉพาะ','#0369a1'),
  FLOOR('#0c4a6e',.07), DUST(9,449,'#fff',.5), vignette('cp1'), FG('l','#0c4a6e',.25)]+person('W',318,'#0284c7','#e8b896','calm'))
o+=P('cpmeeting','[ภาพประกอบนิทาน บ่ายห้องประชุมเจ้าของร่วม โทนม่วงชมพู] ใบมอบฉันทะ ไม่เกิน 3 ห้อง ป้ายห้ามผู้จัดการรับมอบ',
 [bg('cp2','#fae8ff','#fce7f3','#9a7aa8'), PROXY(250,102,'มอบฉันทะ','#a21caf'), SEAL(140,96,'ผู้จัดการ ✗','#dc2626',w=66), CHIP(250,140,'≤ 3 ห้อง','#86198f'),
  FLOOR('#701a75',.07), vignette('cp2')]+person('M',60,'#a21caf','#d8a882','worried'))
o+=P('cpoffice','[ภาพประกอบนิทาน เย็นในร้าน โทนเหลืองนวล] ใบเสร็จค่าส่วนกลางทุกงวด ลูกแมวตุ๊กตา',
 [bg('cp3','#fef9c3','#fefce8','#a89a6a'), desk(240,134,100,'#a16207'), ''.join(f'<g transform="translate({220+i*18} {108-i*4}) rotate({-8+i*6})"><rect x="-10" y="-14" width="20" height="28" rx="2" fill="#fff" stroke="#a16207"/><path d="M-6 -6h12M-6 0h8" stroke="#fde68a" stroke-width="2"/></g>' for i in range(3)), KITTEN(92,124,.7),
  FLOOR('#713f12',.06), vignette('cp3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s449.js','w').write(o)
