import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dcflower','[ภาพประกอบนิทาน เช้าในร้านดอกไม้ โทนชมพูกุหลาบ] สัญญาเปียกน้ำ มือถือมีรูปสัญญา ดอกไม้',
 [bg('dc1','#ffe4e6','#fdf2f8','#a87a8a'), plant(250,146,1,'#fda4af','#db2777'), plant(280,146,.8,'#fbcfe8','#16a34a'), '<g transform="translate(140 100)"><rect x="-20" y="-24" width="40" height="48" rx="2" fill="#e0f2fe"/><path d="M-14 -14h28M-14 -6h20M-14 2h24" stroke="#93c5fd" stroke-width="3"/><path d="M-20 10q10 -6 20 4t20 -4v14h-40z" fill="#60a5fa" opacity=".6"/></g>', FACESCAN(196,104,'#db2777') if False else '',
  FLOOR('#881337',.07), DUST(9,314,'#fff',.5), vignette('dc1'), FG('l','#881337',.25)]+person('W',318,'#db2777','#e8b896','worried'))
o+=P('dccourt','[ภาพประกอบนิทาน บ่ายในศาล โทนเหลืองอ่อน] สัญญาลงชื่อ ป้ายห้ามสืบแก้เอกสาร ตาชั่ง',
 [bg('dc2','#fef9c3','#fefce8','#a89a6a'), JSCALE(240,90,8,'#a16207','เอกสาร','คำพูด'), DOC(104,90,84,44,'สัญญา',[('ไม่มีส่วนลด 30%','#b91c1c')],'#a16207'),
  FLOOR('#713f12',.07), vignette('dc2')]+person('M',60,'#a16207','#d8a882','calm'))
o+=P('dcoffice','[ภาพประกอบนิทาน เย็นห้องเก็บเอกสาร โทนเขียวพาสเทล] ไมค์พยาน ป้ายรู้เห็นเอง เพนกวินบนชั้น',
 [bg('dc3','#dcfce7','#f0fdf4','#7aa88a'), PENGUIN(84,98,.7), desk(230,134,100,'#15803d'), witnessmic(240,110) if False else '<g transform="translate(240 110)"><rect x="-4" y="-14" width="8" height="14" rx="4" fill="#334155"/><path d="M0 0v10M-8 10h16" stroke="#334155" stroke-width="2"/></g>',
  CHIP(140,100,'เห็น/ได้ยินเอง ✓','#15803d'), FLOOR('#14532d',.06), vignette('dc3')]+person('W',292,'#16a34a','#e8b896','happy'))
open('/home/claude/work/s314.js','w').write(o)
