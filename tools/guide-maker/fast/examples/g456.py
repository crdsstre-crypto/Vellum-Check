import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('abstationery','[ภาพประกอบนิทาน เช้าในร้านเครื่องเขียน โทนเหลืองสดใส] กันสาดถูกสั่งรื้อ ชั้นปากกา',
 [bg('ab1','#fef9c3','#fef3c7','#a89a6a',wall_tex=False), '<g transform="translate(250 100)"><path d="M-44 -10h88l-8 -14h-72z" fill="#f59e0b"/><path d="M-44 -24h88" stroke="#fff" stroke-dasharray="6 6" stroke-width="2"/><rect x="-36" y="-10" width="72" height="44" fill="#fffbeb" stroke="#a16207"/></g>', SEAL(150,108,'สั่งรื้อ','#dc2626',w=50),
  FLOOR('#713f12',.08), DUST(9,456,'#fff',.5), vignette('ab1'), FG('l','#713f12',.25)]+person('M',318,'#ca8a04','#d8a882','worried'))
o+=P('abshop','[ภาพประกอบนิทาน บ่ายที่ศาลากลาง โทนน้ำเงิน] หนังสือเรียกจากคณะกรรมการอุทธรณ์ แฟ้มแบบ',
 [bg('ab2','#dbeafe','#e0e7ff','#7a8aa8'), courtcounter(240,146,110), courtenvelope(250,108), DOC(110,86,80,44,'แบบ + รูปถ่าย',[('ส่งตามหนังสือเรียก','#1d4ed8')],'#2563eb'),
  FLOOR('#1e3a8a',.07), vignette('ab2')]+person('W',60,'#1d4ed8','#e8b896','calm'))
o+=P('aboffice','[ภาพประกอบนิทาน ช่วงบ่ายหน้าร้าน โทนเขียวมิ้นต์] กรรมการมาดูหน้าร้าน ตลับเมตร ลูกหมูตุ๊กตา',
 [bg('ab3','#d1fae5','#ecfeff','#6aa89a',wall_tex=False), '<g transform="translate(244 118)"><rect x="-14" y="-10" width="28" height="20" rx="4" fill="#facc15" stroke="#a16207"/><circle r="5" fill="#a16207"/><path d="M14 0h30" stroke="#facc15" stroke-width="4"/></g>', PIGLET(92,126,.7), CHIP(244,90,'กลางวันเท่านั้น','#0f766e'),
  FLOOR('#134e4a',.06), vignette('ab3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s456.js','w').write(o)
