import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('tabuild','[ภาพประกอบนิทาน เช้าที่ร้านวัสดุก่อสร้าง โทนเทาอิฐ] กองอิฐ ปูนถุง ซองอุทธรณ์',
 [bg('ta1','#f5f5f4','#fee2e2','#9a8a7a'), ''.join(f'<rect x="{206+(i%4)*18}" y="{128-(i//4)*10}" width="16" height="9" rx="1" fill="#c2410c" stroke="#7c2d12" stroke-width=".8"/>' for i in range(10)), '<g transform="translate(296 118)"><path d="M-12 -18h24l4 34h-32z" fill="#e7e5e4" stroke="#78716c"/><text y="2" text-anchor="middle" font-size="7" font-weight="900" fill="#57534e">ปูน</text></g>', courtenvelope(140,108),
  FLOOR('#44403c',.08), DUST(9,436,'#fff',.5), vignette('ta1'), FG('l','#44403c',.3)]+person('M',318,'#b91c1c','#d8a882','worried'))
o+=P('tacommittee','[ภาพประกอบนิทาน บ่ายห้องประชุมคณะกรรมการ โทนฟ้าคราม] โต๊ะกรรมการ ป้ายงดออกเสียง วงนับ 60 วัน',
 [bg('ta2','#e0f2fe','#e0e7ff','#7a8aa8'), '<g transform="translate(240 128)"><rect x="-56" y="-8" width="112" height="14" rx="3" fill="#1e40af"/>'+''.join(f'<rect x="{-48+i*34}" y="-22" width="14" height="10" rx="2" fill="#fff" stroke="#1e40af"/>' for i in range(3))+'<path d="M20 -24l12 12M32 -24l-12 12" stroke="#dc2626" stroke-width="2.5"/></g>', DAYRING(150,96,'60','วัน',.6,'#1d4ed8',18),
  FLOOR('#1e3a8a',.07), vignette('ta2')]+person('W',60,'#1d4ed8','#e8b896','calm'))
o+=P('taoffice','[ภาพประกอบนิทาน เย็นหน้าศาลปกครอง โทนเหลืองนวล] ศาล วงนับ 30 วัน เต่าตุ๊กตา',
 [bg('ta3','#fef9c3','#fefce8','#a89a6a'), COURTHOUSE(250,132), TURTLE(92,128,.65), DAYRING(160,96,'30','วัน',.3,'#a16207',16),
  FLOOR('#713f12',.06), vignette('ta3')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s436.js','w').write(o)
