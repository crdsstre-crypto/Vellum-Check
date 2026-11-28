import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lxgrocery','[ภาพประกอบนิทาน เช้าหน้าร้านของชำ โทนส้มพีช] ชั้นสินค้า ทางเดินสาธารณะข้างร้าน ศาลเจ้าเล็ก',
 [bg('lx1','#ffedd5','#fef3c7','#a88a6a',wall_tex=False), '<g transform="translate(250 112)">'+''.join(f'<rect x="-36" y="{-30+i*16}" width="72" height="4" fill="#92400e"/>'+''.join(f'<rect x="{-32+j*12}" y="{-40+i*16}" width="9" height="10" rx="1" fill="{["#f87171","#60a5fa","#facc15","#4ade80","#c084fc","#fb923c"][(i+j)%6]}"/>' for j in range(6)) for i in range(3))+'</g>', SHRINE(140,104),
  '<path d="M170 150l30 -30h20l-30 30z" fill="#e7e5e4"/>', FLOOR('#7c2d12',.07), DUST(9,428,'#fff',.5), vignette('lx1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('lxplots','[ภาพประกอบนิทาน บ่ายที่สำนักงานท้องถิ่น โทนม่วงอ่อน] แผนที่ 3 แปลงติดกัน วงรวมมูลค่า',
 [bg('lx2','#ede9fe','#f5f3ff','#8a7aa8'), PLOTS(240,110), '<ellipse cx="240" cy="110" rx="56" ry="30" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 4"/>', CHIP(150,90,'รวมมูลค่า','#6d28d9'),
  FLOOR('#2e1065',.07), vignette('lx2')]+person('W',60,'#7c3aed','#e8b896','worried'))
o+=P('lxoffice','[ภาพประกอบนิทาน เย็นในร้าน โทนเขียวพาสเทล] เครื่องคิดเลข สูตรภาษี กระต่ายตุ๊กตา',
 [bg('lx3','#dcfce7','#f0fdf4','#7aa88a'), desk(240,134,100,'#15803d'), '<g transform="translate(240 108)"><rect x="-14" y="-18" width="28" height="36" rx="3" fill="#334155"/><rect x="-10" y="-14" width="20" height="8" fill="#bbf7d0"/>'+''.join(f'<rect x="{-10+(i%3)*7}" y="{-3+(i//3)*7}" width="5" height="5" rx="1" fill="#e2e8f0"/>' for i in range(9))+'</g>', RABBIT(92,124,.65),
  DOC(126,84,84,40,'ฐาน − ยกเว้น',[('× อัตรา','#15803d')],'#16a34a'), FLOOR('#14532d',.06), vignette('lx3')]+person('M',292,'#16a34a','#d8a882','happy'))
open('/home/claude/work/s428.js','w').write(o)
