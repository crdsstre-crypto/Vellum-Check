import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('evsign','[ภาพประกอบนิทาน เช้าในร้านทำป้าย โทนเหลืองนีออน] ป้ายไฟ ใบเสนอราคา ถุงหลักฐาน',
 [bg('ev1','#fef9c3','#fef3c7','#a89a6a'), '<g transform="translate(240 70)"><rect x="-40" y="-14" width="80" height="28" rx="5" fill="#1e293b"/><text y="6" text-anchor="middle" font-size="13" font-weight="900" fill="#fde047">OPEN</text></g>', EVIBAG(140,110,'A','#ca8a04'), EVIBAG(180,116,'B','#ca8a04'),
  FLOOR('#713f12',.07), DUST(9,307,'#fff',.5), vignette('ev1'), FG('l','#713f12',.25)]+person('M',318,'#ca8a04','#d8a882','calm'))
o+=P('evcourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนฟ้าเย็น] บัญชีระบุพยาน วงนับ 7 วัน สำเนาเอกสาร',
 [bg('ev2','#e0f2fe','#f0f9ff','#7a9aa8',wall_tex=False), COURTHOUSE(250,132), DAYRING(140,104,'7','วัน',.75,'#0284c7'), ENVFLY(160,124,210,104,2,'#0284c7'),
  FLOOR('#0c4a6e',.07), vignette('ev2')]+person('W',60,'#0284c7','#e8b896','worried'))
o+=P('evoffice','[ภาพประกอบนิทาน เย็นที่ห้องทำงานร้าน โทนชมพูอ่อน] แฟ้มพยานเรียงลำดับ โคอาล่าตุ๊กตาบนชั้น',
 [bg('ev3','#fce7f3','#fdf2f8','#a87a8a'), KOALA(84,94,.75), desk(230,134,100,'#be185d'), filestack(250,112),
  STEPS(120,104,['บัญชีพยาน','สำเนา','ต้นฉบับ'],1,'#db2777'), FLOOR('#831843',.06), vignette('ev3')]+person('M',292,'#db2777','#d8a882','happy'))
open('/home/claude/work/s307.js','w').write(o)
