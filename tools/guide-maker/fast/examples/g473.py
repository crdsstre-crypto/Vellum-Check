import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('brairport','[ภาพประกอบนิทาน เช้าที่สนามบิน โทนฟ้าคราม] หนังสือเดินทางกับตั๋วถูกขีด เครื่องบินลอย',
 [bg('r1','#e0f2fe','#dbeafe','#7a8aa8',wall_tex=False), PASSPORT(236,104), '<g transform="translate(150 70) rotate(-12)"><path d="M-20 0h40l6 -4-6 -2h-14l-10-10h-6l6 10h-10l-6-5h-4l4 7z" fill="#94a3b8"/></g>',
  CHIP(150,118,'ขอฝ่ายเดียว','#1d4ed8'), FLOOR('#1e3a8a',.06), DUST(7,473,'#fff',.5), vignette('r1')]+person('W',318,'#1d4ed8','#e8b896','alert'))
o+=P('brwarehouse','[ภาพประกอบนิทาน ค่ำหน้าโกดัง โทนกรมม่วงส้ม] รถขนของ ดวงอาทิตย์ขึ้นถึงตก',
 [bg('r2','#ede9fe','#ffedd5','#7a6a9a'), '<g transform="translate(232 110)"><rect x="-40" y="-30" width="80" height="50" fill="#c7d2fe" stroke="#4338ca"/><path d="M-46 -30l46 -20 46 20z" fill="#818cf8"/><rect x="-14" y="-8" width="28" height="28" fill="#312e81"/></g><g transform="translate(150 124)"><rect x="-26" y="-18" width="36" height="24" rx="3" fill="#f97316"/><rect x="10" y="-10" width="16" height="16" rx="3" fill="#ea580c"/><circle cx="-16" cy="8" r="5" fill="#1e293b"/><circle cx="16" cy="8" r="5" fill="#1e293b"/></g>',
  '<g transform="translate(290 66)"><circle r="9" fill="#fbbf24"/><path d="M-22 0a22 22 0 0 1 44 0" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 2"/><text y="20" font-size="6.5" font-weight="900" text-anchor="middle" fill="#b45309">ขึ้น→ตก</text></g>',
  FLOOR('#312e81',.08), vignette('r2')]+person('M',60,'#4338ca','#d8a882','shock'))
o+=P('brcourt','[ภาพประกอบนิทาน เย็นที่ศาล โทนชมพูครีม] แม่กุญแจพิทักษ์ชั่วคราว ตาชั่งประกัน เป็ดน้อย',
 [bg('r3','#fce7f3','#fef9c3','#a87a8a'), desk(240,134,100,'#be185d'), '<g transform="translate(250 96)"><rect x="-16" y="-6" width="32" height="26" rx="4" fill="#f9a8d4" stroke="#be185d" stroke-width="2"/><path d="M-9 -6v-8a9 9 0 0 1 18 0v8" fill="none" stroke="#be185d" stroke-width="3"/><circle cy="6" r="3" fill="#be185d"/></g>', DUCK(98,124,.72),
  CHIP(170,90,'ชั่วคราว','#be185d'), FLOOR('#831843',.06), vignette('r3')]+person('W',292,'#db2777','#e8b896','calm'))
open('/home/claude/work/s473.js','w').write(o)
