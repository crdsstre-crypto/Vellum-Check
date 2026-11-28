import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fpdessert','[ภาพประกอบนิทาน เช้าที่แผงขนมไทย โทนชมพูพาสเทล] ถาดขนมชั้น แผนที่เขตเพลิงไหม้',
 [bg('fp1','#fce7f3','#fef3c7','#a87a8a'), pastrytray(250,118), '<g transform="translate(140 102)"><rect x="-26" y="-20" width="52" height="40" rx="3" fill="#fff" stroke="#be185d"/><path d="M-18 -8h36M-6 -16v32" stroke="#fbcfe8" stroke-width="3"/><path d="M-16 -14h18v14h-18z" fill="#fecaca" stroke="#dc2626" stroke-dasharray="3 2"/></g>',
  FLOOR('#831843',.07), DUST(9,443,'#fff',.5), vignette('fp1'), FG('l','#831843',.25)]+person('M',318,'#db2777','#d8a882','calm'))
o+=P('fpzone','[ภาพประกอบนิทาน บ่ายที่สำนักงานโยธา โทนน้ำเงินคราม] แผนผังปรับปรุงเขต ถนนใหม่ วงนับ 60 วัน',
 [bg('fp2','#e0e7ff','#eef2ff','#7a8aa8'), '<g transform="translate(244 104)"><rect x="-44" y="-30" width="88" height="60" rx="3" fill="#f8fafc" stroke="#3730a3" stroke-width="2"/><path d="M-44 4h88" stroke="#94a3b8" stroke-width="8"/>'+''.join(f'<rect x="{-38+i*20}" y="-24" width="14" height="22" fill="#c7d2fe"/>' for i in range(4))+'<rect x="-18" y="-24" width="14" height="22" fill="#fecaca" stroke="#dc2626"/></g>', DAYRING(140,98,'60','วัน',.5,'#3730a3',18),
  FLOOR('#1e1b4b',.07), vignette('fp2')]+person('W',60,'#4338ca','#e8b896','worried'))
o+=P('fpoffice','[ภาพประกอบนิทาน เย็นในร้าน โทนเหลืองนวล] แฟ้มเอกสารเวนคืน ไทม์ไลน์ ลูกแกะตุ๊กตา',
 [bg('fp3','#fef9c3','#fefce8','#a89a6a'), STEPS(196,96,['15 วัน','45 วัน','+60 วัน'],2,'#a16207'), LAMB(92,124,.7),
  FLOOR('#713f12',.06), vignette('fp3')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s443.js','w').write(o)
