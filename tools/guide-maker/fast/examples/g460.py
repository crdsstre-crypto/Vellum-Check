import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('nmspa','[ภาพประกอบนิทาน เช้าในร้านสปา โทนเขียวมิ้นต์] เตียงนวด โฉนดมีชื่อผู้จัดการ เงินในซอง',
 [bg('nm1','#d1fae5','#ecfeff','#6aa89a'), '<g transform="translate(250 126)"><rect x="-34" y="-6" width="68" height="10" rx="4" fill="#fef3c7" stroke="#a16207"/><path d="M-30 4v14M30 4v14" stroke="#a16207" stroke-width="3"/></g>', AWARD(150,96,'โฉนด','#0f766e'), '<g transform="translate(184 120) rotate(10)"><rect x="-14" y="-8" width="28" height="16" rx="2" fill="#fde68a" stroke="#a16207"/><text y="3" text-anchor="middle" font-size="6" font-weight="900" fill="#a16207">5,000/ด.</text></g>',
  FLOOR('#134e4a',.07), DUST(9,460,'#fff',.5), vignette('nm1'), FG('l','#134e4a',.25)]+person('W',318,'#0d9488','#e8b896','worried'))
o+=P('nmland','[ภาพประกอบนิทาน บ่ายที่สำนักงานที่ดิน โทนแดงเข้ม] คำสั่งอธิบดีจำหน่ายที่ดิน ค้อน',
 [bg('nm2','#fee2e2','#fef2f2','#a87a7a'), courtcounter(240,146,110), SEAL(250,104,'อธิบดีสั่งขาย','#dc2626',w=72), '<g transform="translate(140 118) rotate(-30)"><rect x="-4" y="-2" width="30" height="5" rx="2" fill="#92400e"/><rect x="-14" y="-8" width="16" height="16" rx="3" fill="#78350f"/></g>',
  FLOOR('#7f1d1d',.07), vignette('nm2')]+person('M',60,'#b91c1c','#d8a882','worried'))
o+=P('nmoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานทนาย โทนเหลืองนวล] สัญญาณเตือนการถือแทน ลูกวัวตุ๊กตา',
 [bg('nm3','#fef9c3','#fefce8','#a89a6a'), desk(240,134,100,'#a16207'), DOC(214,80,72,50,'สัญญาณเตือน',[('อีกฝ่ายออกเงิน','#dc2626'),('อีกฝ่ายเก็บโฉนด','#dc2626')],'#ca8a04'), CALF(92,124,.7),
  FLOOR('#713f12',.06), vignette('nm3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s460.js','w').write(o)
