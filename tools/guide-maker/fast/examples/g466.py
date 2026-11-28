import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('crfamily','[ภาพประกอบนิทาน เช้าในสวนคาเฟ่ครอบครัว โทนเขียวสดใส] สไลเดอร์ใหญ่ รางรถไฟเล็ก',
 [bg('cr1','#dcfce7','#fef9c3','#7aa87a',wall_tex=False), SLIDE(244,112), '<g transform="translate(150 140)"><path d="M-40 0h80" stroke="#78350f" stroke-width="3"/>'+''.join(f'<path d="M{-36+i*12} -3v6" stroke="#78350f" stroke-width="2"/>' for i in range(7))+'<rect x="-14" y="-16" width="24" height="12" rx="3" fill="#ef4444"/><circle cx="-8" cy="-3" r="3" fill="#1e293b"/><circle cx="4" cy="-3" r="3" fill="#1e293b"/></g>',
  FLOOR('#14532d',.06), DUST(9,466,'#fff',.5), vignette('cr1'), FG('l','#14532d',.25)]+person('W',318,'#16a34a','#e8b896','calm'))
o+=P('crplan','[ภาพประกอบนิทาน บ่ายที่โยธาเทศบาล โทนฟ้าคราม] แบบสถาปนิก ทางหนีไฟไฮไลต์แดง',
 [bg('cr2','#dbeafe','#e0f2fe','#7a8aa8'), '<g transform="translate(244 104)"><rect x="-40" y="-30" width="80" height="60" rx="2" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2"/><path d="M-40 0h80M0 -30v60" stroke="#93c5fd" stroke-width="1.5"/><path d="M28 -30v60" stroke="#dc2626" stroke-width="4"/><text x="20" y="-34" font-size="6.5" font-weight="900" fill="#dc2626">ทางหนีไฟ</text></g>', CHIP(140,100,'สถาปนิกเซ็น','#1d4ed8'),
  FLOOR('#1e3a8a',.07), vignette('cr2')]+person('M',60,'#1d4ed8','#d8a882','worried'))
o+=P('croffice','[ภาพประกอบนิทาน เย็นในคาเฟ่ โทนชมพูพีช] หนังสือขอทบทวนข้อบัญญัติ วงนับ 120 วัน ฮิปโปตุ๊กตา',
 [bg('cr3','#ffe4e6','#fff1f2','#a87a7a'), desk(240,134,100,'#be123c'), DAYRING(250,104,'120','วัน',.4,'#be123c',18), HIPPO(92,124,.7),
  DOC(126,82,84,42,'ทบทวนข้อบัญญัติ',[('ภาระเกินจำเป็น','#be123c')],'#e11d48'), FLOOR('#881337',.06), vignette('cr3')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s466.js','w').write(o)
