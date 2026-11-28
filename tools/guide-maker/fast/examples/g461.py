import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cbbakery','[ภาพประกอบนิทาน เช้าในร้านขนมปังชั้นล่างคอนโด โทนครีมส้ม] ตู้ขนมปัง อาคารชุด สัญญาสองฉบับเทียบกัน',
 [bg('cb1','#ffedd5','#fef3c7','#a8906a'), CONDO(276,138,5,'#c2410c'), pastrytray(200,120), '<g transform="translate(130 100)">'+''.join(f'<g transform="translate({i*20} {i*6}) rotate({-6+i*10})"><rect x="-14" y="-18" width="28" height="36" rx="2" fill="#fff" stroke="{c}" stroke-width="1.5"/><path d="M-8 -8h16M-8 -2h12M-8 4h14" stroke="#e7e5e4" stroke-width="2"/></g>' for i,c in enumerate(['#15803d','#dc2626']))+'</g>',
  FLOOR('#7c2d12',.07), DUST(9,461,'#fff',.5), vignette('cb1'), FG('l','#7c2d12',.25)]+person('W',318,'#ea580c','#e8b896','calm'))
o+=P('cbrules','[ภาพประกอบนิทาน บ่ายสำนักงานนิติบุคคล โทนฟ้าเทา] ข้อบังคับเรื่องการใช้ห้อง หนังสือนัดประชุม 7 วัน',
 [bg('cb2','#e0f2fe','#f1f5f9','#7a8a9a'), DOC(214,80,86,56,'ข้อบังคับ',[('การใช้ทรัพย์ส่วนบุคคล','#0369a1'),('แก้โดยมติที่ประชุม','#0369a1')],'#0284c7'), DAYRING(140,98,'7','วัน',.5,'#0369a1',18),
  FLOOR('#334155',.07), vignette('cb2')]+person('M',60,'#0369a1','#d8a882','worried'))
o+=P('cboffice','[ภาพประกอบนิทาน เย็นวันรับโอน โทนเขียวหยก] หนังสือกรรมสิทธิ์ห้องชุด แผนผังกว้างยาวสูง ลูกวัวตุ๊กตา',
 [bg('cb3','#ccfbf1','#f0fdfa','#6aa89a'), '<g transform="translate(244 104)"><rect x="-30" y="-24" width="60" height="46" rx="2" fill="#fff" stroke="#0f766e" stroke-width="2"/><path d="M-18 14l0 -24l20 -8l18 8v24z" fill="none" stroke="#0f766e" stroke-width="1.5"/><path d="M-18 -10l20 8l18 -8M2 -2v24" stroke="#0f766e" stroke-width="1.2"/><text y="32" text-anchor="middle" font-size="7" font-weight="900" fill="#0f766e">กว้าง×ยาว×สูง</text></g>', CALF(92,124,.7),
  FLOOR('#134e4a',.06), vignette('cb3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s461.js','w').write(o)
