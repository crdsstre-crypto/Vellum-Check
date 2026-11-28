import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('wnsign','[ภาพประกอบนิทาน เช้าในร้านทำป้าย โทนชมพูพีช] ป้ายไฟกำลังทำ มือถือโทรไม่ติด',
 [bg('wn1','#ffe4e6','#ffedd5','#a87a7a'), '<g transform="translate(240 96)"><rect x="-40" y="-20" width="80" height="34" rx="4" fill="#1e293b"/><text y="3" text-anchor="middle" font-size="12" font-weight="900" fill="#fb7185">OPEN</text><path d="M-30 14v26M30 14v26" stroke="#475569" stroke-width="3"/></g>',
  '<g transform="translate(140 108)"><rect x="-14" y="-24" width="28" height="48" rx="5" fill="#334155"/><rect x="-11" y="-19" width="22" height="34" rx="2" fill="#fecdd3"/><path d="M-6 -6l12 12M6 -6l-12 12" stroke="#dc2626" stroke-width="2.5"/></g>',
  FLOOR('#881337',.07), DUST(9,330,'#fff',.5), vignette('wn1'), FG('l','#881337',.25)]+person('M',318,'#e11d48','#d8a882','worried'))
o+=P('wncourt','[ภาพประกอบนิทาน บ่ายที่ศาล โทนเทาฟ้า] ใบรับรองแพทย์ หมายจับพยานที่หลบ ประตูห้องพิจารณา',
 [bg('wn2','#f1f5f9','#e0f2fe','#7a8a9a'), DOC(220,90,64,48,'ใบรับรองแพทย์',[('ป่วย 3 วัน','#0369a1')],'#0284c7'), SEAL(140,100,'หมายจับ','#dc2626',w=60),
  FLOOR('#334155',.07), vignette('wn2')]+person('W',60,'#475569','#e8b896','calm'))
o+=P('wnoffice','[ภาพประกอบนิทาน เย็นห้องพิจารณา โทนเขียวมิ้นต์] พยานรอนอกห้อง ม้านั่ง แฮมสเตอร์ตุ๊กตา',
 [bg('wn3','#d1fae5','#ecfeff','#6aa89a'), '<g transform="translate(240 112)"><rect x="-22" y="-40" width="44" height="66" rx="3" fill="#a16207"/><circle cx="14" cy="-6" r="2.5" fill="#fde68a"/><rect x="-14" y="-32" width="28" height="12" rx="2" fill="#fef3c7"/><text y="-23" text-anchor="middle" font-size="6" font-weight="900" fill="#92400e">พิจารณาคดี</text></g>', HAMSTER(92,126,.65),
  CHIP(150,96,'รอนอกห้อง','#0f766e'), FLOOR('#134e4a',.06), vignette('wn3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s330.js','w').write(o)
