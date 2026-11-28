import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cotoys','[ภาพประกอบนิทาน เช้าในร้านของเล่นชั้นล่างคอนโด โทนฟ้าสดใส] ชั้นของเล่น หนังสือร้องเรียน',
 [bg('ct4','#e0f2fe','#fef9c3','#7a9aa8'), ''.join(f'<rect x="{208+(i%4)*22}" y="{100+(i//4)*24}" width="16" height="16" rx="3" fill="{c}"/>' for i,c in enumerate(['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6','#eab308'])), DOC(110,88,80,44,'ร้องเรียนนิติฯ',[('เงินกองทุน?','#dc2626')],'#0284c7'),
  FLOOR('#0c4a6e',.07), DUST(9,465,'#fff',.5), vignette('ct4'), FG('l','#0c4a6e',.25)]+person('M',318,'#0284c7','#d8a882','calm'))
o+=P('colocked','[ภาพประกอบนิทาน บ่ายหน้าห้องเก็บเอกสาร โทนเทาม่วง] ประตูล็อก บัตรเจ้าหน้าที่ ป้ายจำคุก 3 เดือน',
 [bg('ct5','#ede9fe','#f1f5f9','#8a7aa8'), '<g transform="translate(250 112)"><rect x="-26" y="-44" width="52" height="74" rx="3" fill="#6d28d9"/><rect x="-6" y="-8" width="12" height="10" rx="2" fill="#fbbf24"/><path d="M-4 -8v-5a4 4 0 0 1 8 0v5" stroke="#fbbf24" stroke-width="2" fill="none"/></g>', SEAL(140,100,'ขัดขวาง ≤ 3 เดือน','#dc2626',w=84),
  FLOOR('#2e1065',.07), vignette('ct5')]+person('W',60,'#6d28d9','#e8b896','worried'))
o+=P('cooffice','[ภาพประกอบนิทาน เย็นที่สำนักงานที่ดิน โทนเหลืองนวล] กล่องเอกสารอายัด ฮิปโปตุ๊กตา',
 [bg('ct6','#fef9c3','#fefce8','#a89a6a'), '<g transform="translate(244 114)"><rect x="-28" y="-20" width="56" height="36" rx="3" fill="#d6a77a" stroke="#92400e"/><rect x="-20" y="-6" width="40" height="12" fill="#fff" stroke="#dc2626"/><text y="3" text-anchor="middle" font-size="7" font-weight="900" fill="#dc2626">อายัด</text></g>', HIPPO(92,124,.7),
  FLOOR('#713f12',.06), vignette('ct6')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s465.js','w').write(o)
