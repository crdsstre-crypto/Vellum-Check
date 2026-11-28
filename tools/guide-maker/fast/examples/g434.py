import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ccair','[ภาพประกอบนิทาน เช้าในร้านซ่อมแอร์ โทนฟ้าเย็น] คอยล์แอร์ ใบเสนอราคา 38,000',
 [bg('cc1','#e0f2fe','#f0f9ff','#7a9aa8'), '<g transform="translate(240 100)"><rect x="-40" y="-18" width="80" height="30" rx="5" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M-30 6h60" stroke="#cbd5e1" stroke-width="3"/><path d="M-24 18q4 8 0 16M0 18q4 8 0 16M24 18q4 8 0 16" stroke="#7dd3fc" stroke-width="2" fill="none"/></g>', receipt(140,112), CHIP(150,84,'38,000 บาท','#0369a1'),
  FLOOR('#0c4a6e',.07), DUST(9,434,'#fff',.5), vignette('cc1'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('cccounter','[ภาพประกอบนิทาน บ่ายที่ศูนย์ไกล่เกลี่ยตำบล โทนเหลืองอุ่น] ซองเงินถูกปัดทิ้ง ป้ายห้ามสินบน',
 [bg('cc2','#fef9c3','#fef3c7','#a89a6a'), courtcounter(240,146,110), '<g transform="translate(250 104) rotate(-10)"><rect x="-18" y="-12" width="36" height="24" rx="2" fill="#fff" stroke="#a16207" stroke-width="2"/><path d="M-18 -12l18 13l18 -13" stroke="#a16207" fill="none"/></g><g transform="translate(250 104)"><circle r="22" fill="none" stroke="#dc2626" stroke-width="4"/><path d="M-15 -15l30 30" stroke="#dc2626" stroke-width="4"/></g>',
  CHIP(150,92,'จำคุก ≤ 5 ปี','#b91c1c'), FLOOR('#713f12',.07), vignette('cc2')]+person('W',60,'#ca8a04','#e8b896','worried'))
o+=P('cccert','[ภาพประกอบนิทาน เย็นที่ศูนย์ไกล่เกลี่ย โทนเขียวพาสเทล] หนังสือรับรองตรากรม เต่าตุ๊กตา',
 [bg('cc3','#dcfce7','#f0fdf4','#7aa88a'), AWARD(244,104,'หนังสือรับรอง','#15803d'), TURTLE(92,128,.65),
  FLOOR('#14532d',.06), vignette('cc3')]+person('M',292,'#16a34a','#d8a882','happy'))
open('/home/claude/work/s434.js','w').write(o)
