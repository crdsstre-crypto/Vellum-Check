import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rpimport','[ภาพประกอบนิทาน เช้าในสำนักงานผู้นำเข้า โทนส้มพีช] กล่องเรียกคืน แผน 3 ส่วน วงนับ 7 วัน',
 [bg('rp1','#ffedd5','#fef3c7','#a8846a'), RECALL(240,108), DAYRING(130,104,'7','วัน',.7,'#ea580c'), filestack(190,124),
  FLOOR('#7c2d12',.07), DUST(9,293,'#fff',.5), vignette('rp1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('rpstudio','[ภาพประกอบนิทาน บ่ายในสตูดิโอไลฟ์ขายของ โทนชมพูบานเย็น] ไฟริงไลต์ มือถือบนขาตั้ง ประกาศเรียกคืน ซองอีเมลลอยไปหาลูกค้า',
 [bg('rp2','#fce7f3','#fae8ff','#a87a9a'), '<g transform="translate(240 92)"><circle r="22" fill="none" stroke="#fde68a" stroke-width="6"/><rect x="-7" y="-12" width="14" height="24" rx="3" fill="#1e293b"/><path d="M0 22v42" stroke="#64748b" stroke-width="3"/></g>', ENVFLY(120,120,210,100,3,'#db2777'),
  DOC(104,90,84,40,'ประกาศเรียกคืน',[('หยุดใช้ทันที','#dc2626')],'#db2777'), FLOOR('#831843',.07), vignette('rp2')]+person('W',60,'#db2777','#e8b896','worried'))
o+=P('rpmeeting','[ภาพประกอบนิทาน เช้าที่ห้องประชุมคณะกรรมการ โทนฟ้าคราม] ขอขยายเวลา ปฏิทิน นากบนขอบหน้าต่าง',
 [bg('rp3','#e0e7ff','#e0f2fe','#7a8aa8'), window(60,40), OTTER(88,82,.7), TABLE(250,146,70,2,'#3730a3'),
  STEPS(120,104,['ส่งแผน','รายงาน 7 วัน','ขอขยาย'],2,'#4338ca'), FLOOR('#1e1b4b',.07), vignette('rp3')]+person('M',292,'#4338ca','#d8a882','calm'))
open('/home/claude/work/s293.js','w').write(o)
