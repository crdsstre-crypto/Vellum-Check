import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('pfkitchen','[ภาพประกอบนิทาน เช้าในเวิร์กช็อปหม้อหุงข้าว โทนส้มพีช] หม้อหุงข้าวต้นแบบ ฝากันล้น ใบค่าธรรมเนียม',
 [bg('pf1','#ffedd5','#fff7ed','#a88a6a'), '<g transform="translate(240 116)"><rect x="-24" y="-14" width="48" height="34" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M-26 -14q26 -18 52 0z" fill="#fb923c" stroke="#c2410c"/><circle cy="-22" r="4" fill="#c2410c"/><rect x="-6" y="0" width="12" height="6" rx="2" fill="#4ade80"/><path d="M20 -26q6 -8 0 -14M10 -28q6 -8 0 -14" stroke="#cbd5e1" stroke-width="2" fill="none"/></g>',
  DOC(110,86,86,50,'ค่าธรรมเนียม',[('คำขอ 1,000','#c2410c'),('ประกาศ 500','#c2410c')],'#ea580c'), FLOOR('#7c2d12',.07), DUST(9,441,'#fff',.5), vignette('pf1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('pfoffice','[ภาพประกอบนิทาน บ่ายที่กรมทรัพย์สินทางปัญญา โทนเทาฟ้า] คำขอสองแบบซ้อน ลูกศรรวมเป็นอนุสิทธิบัตร',
 [bg('pf2','#f1f5f9','#e0f2fe','#7a8a9a'), courtcounter(240,146,110), '<g transform="translate(230 98)"><rect x="-26" y="-18" width="32" height="40" rx="2" fill="#fff" stroke="#1d4ed8"/><text x="-10" y="-6" text-anchor="middle" font-size="6" font-weight="900" fill="#1d4ed8">สิทธิบัตร</text><rect x="0" y="-12" width="32" height="40" rx="2" fill="#fff" stroke="#16a34a"/><text x="16" y="0" text-anchor="middle" font-size="6" font-weight="900" fill="#16a34a">อนุฯ</text></g>', '<path d="M150 92h40" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4 3"/>', CHIP(150,118,'นับเป็นอนุฯ','#16a34a'),
  FLOOR('#334155',.07), vignette('pf2')]+person('W',60,'#475569','#e8b896','worried'))
o+=P('pfgov','[ภาพประกอบนิทาน เย็นหน้าทำเนียบ โทนเขียวหยก] ศาล วงนับ 60 วัน ลูกเป็ดตุ๊กตา',
 [bg('pf3','#ccfbf1','#f0fdfa','#6aa89a'), COURTHOUSE(250,132), DAYRING(160,96,'60','วัน',.5,'#0f766e',16), DUCK(92,126,.7),
  FLOOR('#134e4a',.06), vignette('pf3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s441.js','w').write(o)
