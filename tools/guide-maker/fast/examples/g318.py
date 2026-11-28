import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('esbath','[ภาพประกอบนิทาน เช้าในห้องน้ำคอนโด โทนฟ้าน้ำ] กระเบื้องร่อน ท่อรั่ว หยดน้ำ',
 [bg('es1','#cffafe','#e0f2fe','#6aa8b8'), '<g>'+''.join(f'<rect x="{200+(i%4)*22}" y="{60+(i//4)*22}" width="20" height="20" fill="#e0f2fe" stroke="#7dd3fc" transform="rotate({8 if i in (5,6) else 0} {210+(i%4)*22} {70+(i//4)*22})"/>' for i in range(12))+'</g>', '<path d="M190 40v40" stroke="#64748b" stroke-width="6"/><path d="M190 82q-4 6 0 10q4-4 0-10z" fill="#38bdf8"/>',
  ZOOM(140,96,'รั่ว'), FLOOR('#164e63',.07), DUST(9,318,'#fff',.5), vignette('es1'), FG('l','#164e63',.25)]+person('W',318,'#0891b2','#e8b896','worried'))
o+=P('escondo','[ภาพประกอบนิทาน บ่ายศาลไปตรวจหน้างาน โทนส้มทราย] ผู้เชี่ยวชาญใส่หมวกนิรภัย แว่นขยาย ป้ายตรวจสถานที่',
 [bg('es2','#ffedd5','#fef3c7','#a8846a'), '<g transform="translate(240 92)"><circle r="12" fill="#fcd9b6"/><path d="M-12 -4a12 12 0 0 1 24 0z" fill="#facc15"/><path d="M-16 30q0-18 16-18t16 18z" fill="#ea580c"/></g>', magnifier(180,110), SEAL(150,86,'ตรวจสถานที่','#c2410c',w=74),
  FLOOR('#7c2d12',.07), vignette('es2')]+person('M',60,'#c2410c','#d8a882','calm'))
o+=P('esoffice','[ภาพประกอบนิทาน เย็นที่ร้าน โทนเขียวมิ้นต์] กล้องถ่ายวิดีโอหลักฐาน คำร้องสืบพยานไว้ก่อน แรคคูนบนชั้น',
 [bg('es3','#d1fae5','#ecfeff','#6aa89a'), RACCOON(84,96,.7), desk(230,134,100,'#0f766e'), '<g transform="translate(250 112)"><rect x="-16" y="-10" width="26" height="20" rx="3" fill="#1e293b"/><path d="M10 -6l10 -5v22l-10 -5z" fill="#334155"/><circle cx="-3" r="5" fill="#64748b"/></g>',
  CHIP(140,102,'สืบไว้ก่อน','#0f766e'), FLOOR('#134e4a',.06), vignette('es3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s318.js','w').write(o)
