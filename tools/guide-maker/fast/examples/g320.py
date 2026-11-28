import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('jtfishing','[ภาพประกอบนิทาน เช้าในร้านอุปกรณ์ตกปลา โทนน้ำเงินทะเล] คันเบ็ด คำพิพากษาพิมพ์ชื่อผิด วงแดง',
 [bg('jt1','#dbeafe','#e0f2fe','#6a8aa8'), '<g stroke="#78350f" stroke-width="2">'+''.join(f'<path d="M{220+i*14} 146l{10+i*3} -90"/>' for i in range(4))+'</g>', SCROLL(140,100,'คำพิพากษา','#1d4ed8'), '<ellipse cx="128" cy="92" rx="18" ry="7" fill="none" stroke="#dc2626" stroke-width="2"/>',
  FLOOR('#172554',.07), DUST(9,320,'#fff',.5), vignette('jt1'), FG('l','#172554',.25)]+person('W',318,'#1d4ed8','#e8b896','worried'))
o+=P('jtcourt','[ภาพประกอบนิทาน บ่ายในศาล โทนเหลืองนวล] ค้อนศาล คำสั่งแก้ไขแนบคำพิพากษา',
 [bg('jt2','#fef9c3','#fefce8','#a89a6a'), desk(230,132,110,'#a16207'), SCROLL(230,104,'+ คำสั่งแก้ไข','#a16207',60), SEAL(140,100,'ห้ามพิจารณาซ้ำ','#ca8a04',w=80),
  FLOOR('#713f12',.07), vignette('jt2')]+person('M',60,'#ca8a04','#d8a882','calm'))
o+=P('jtoffice','[ภาพประกอบนิทาน เย็นที่ร้าน โทนชมพูพีช] วงนับ 1 เดือน ป้ายถึงที่สุด แรคคูนบนกล่อง',
 [bg('jt3','#ffe4e6','#ffedd5','#a87a7a'), RACCOON(250,110,.65), crate(250,138,34,20,'#d97706'), DAYRING(140,104,'1','เดือน',1.0,'#e11d48'),
  FLOOR('#881337',.06), vignette('jt3')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s320.js','w').write(o)
