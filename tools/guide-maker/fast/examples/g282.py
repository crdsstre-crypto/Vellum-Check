import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('mdnoodle','[ภาพประกอบนิทาน เช้าในโรงงานขนมจีนเล็ก โทนเขียวมะนาวอ่อน] เครื่องรีดเส้นหยุด สายไฟขาด ไอน้ำ กระรอกตัวเล็กบนชั้น',
 [bg('md1','#ecfccb','#f0fdf4','#8aa87a'), machine(220,146), CRACK(240,108) if False else ZOOM(250,92,'ขาด'), steam(200,96), SQUIRREL(110,74,.9), crate(130,124),
  FLOOR('#365314',.07), DUST(9,282,'#fff',.5), vignette('md1'), FG('l','#365314',.25)]+person('M',318,'#65a30d','#d8a882','worried'))
o+=P('mdfactory','[ภาพประกอบนิทาน บ่ายโถงโรงงาน โทนเทาฟ้าเย็น] เฟืองใหญ่ ป้ายโทษหนักขึ้น 5 ปี กล้องวงจรปิด',
 [bg('md2','#e0f2fe','#f1f5f9','#7a8a9a'), gear(240,80,'#64748b') if False else '', machine(250,146), CHIP(200,98,'จำคุก ≤ 5 ปี','#dc2626'),
  DOC(104,92,90,54,'ม.359',[('เครื่องจักร ✓','#b91c1c'),('ปศุสัตว์ / รถขนส่ง','#334155'),('พืชผลกสิกร','#334155')],'#0369a1'),
  FLOOR('#0f172a',.08), vignette('md2')]+person('W',60,'#0369a1','#e8b896','calm'))
o+=P('mdbusstop','[ภาพประกอบนิทาน ค่ำหน้าร้าน โทนม่วงชมพูไฟถนน] ศาลาที่พักผู้โดยสาร ม้านั่งหัก ไฟถนน แมวเทาบนหลังคา',
 [bg('md3','#fae8ff','#e0e7ff','#8a7aa8',wall_tex=False), streetlamp(80), '<g transform="translate(200 104)"><rect x="-50" y="-8" width="100" height="6" rx="2" fill="#7c3aed"/><path d="M-44 -2v44M44 -2v44" stroke="#6d28d9" stroke-width="4"/><path d="M-32 30h24l6 -6M8 24h26" stroke="#a16207" stroke-width="5" stroke-linecap="round"/></g>', cat(220,92,'#94a3b8',.5),
  STICKER(140,120,'สาธารณะ','#7c3aed',17), FLOOR('#4c1d95',.07), vignette('md3')]+person('W',292,'#9333ea','#e8b896','calm'))
open('/home/claude/work/s282.js','w').write(o)
