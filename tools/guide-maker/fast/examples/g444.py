import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ikorean','[ภาพประกอบนิทาน เช้าในร้านอาหารเกาหลีที่กำลังรีโนเวท โทนส้มแดง] นั่งร้าน ชั้นลอย แฟ้มใบอนุญาต',
 [bg('ik1','#fee2e2','#ffedd5','#a87a6a'), '<g transform="translate(244 112)"><path d="M-40 30v-60M40 30v-60M-40 -10h80M-40 10h80M-40 -30l80 40M40 -30l-80 40" stroke="#64748b" stroke-width="2.5" fill="none"/><rect x="-30" y="-14" width="60" height="6" fill="#a16207"/></g>', DOC(110,86,80,46,'แฟ้มหน้างาน',[('ใบอนุญาต ✓','#15803d'),('แบบ ✓','#15803d')],'#dc2626'),
  FLOOR('#7f1d1d',.08), DUST(9,444,'#fff',.5), vignette('ik1'), FG('l','#7f1d1d',.25)]+person('M',318,'#dc2626','#d8a882','calm'))
o+=P('icounter','[ภาพประกอบนิทาน บ่ายที่หน้าร้านเสร็จใหม่ โทนฟ้าเทา] นายช่างถือแว่นขยาย บัตรประจำตัว ป้ายเปลี่ยนการใช้',
 [bg('ic2','#e0f2fe','#f1f5f9','#7a8a9a'), '<g transform="translate(250 100)"><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#fff" stroke="#0369a1" stroke-width="2"/><rect x="-14" y="-8" width="10" height="12" fill="#bfdbfe"/><path d="M0 -6h14M0 0h10" stroke="#0369a1" stroke-width="2"/></g>', '<g transform="translate(150 104)"><circle r="14" fill="#e0f2fe" fill-opacity=".6" stroke="#334155" stroke-width="3"/><path d="M10 10l12 12" stroke="#334155" stroke-width="4"/></g>', CHIP(250,130,'บ้าน → ร้านอาหาร','#0369a1'),
  FLOOR('#334155',.07), vignette('ic2')]+person('W',60,'#0369a1','#e8b896','worried'))
o+=P('ioffice2','[ภาพประกอบนิทาน เย็นในออฟฟิศร้าน โทนม่วงอ่อน] ใบทะเบียนผู้ตรวจสอบอาคาร ลูกแกะตุ๊กตา',
 [bg('io4','#ede9fe','#f5f3ff','#8a7aa8'), desk(240,134,100,'#6d28d9'), AWARD(244,98,'ผู้ตรวจสอบ','#6d28d9'), LAMB(92,124,.7),
  FLOOR('#2e1065',.06), vignette('io4')]+person('W',292,'#7c3aed','#e8b896','happy'))
open('/home/claude/work/s444.js','w').write(o)
