import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bvoffice','[ภาพประกอบนิทาน เช้าในร้านวัสดุก่อสร้าง โทนเทาฟ้า] คำขอสืบพยานไว้ก่อน ตั๋วเครื่องบินพยาน',
 [bg('bk1','#e2e8f0','#dbeafe','#7a8a9a',wall_tex=False), DOC(226,78,90,46,'ขอสืบพยานไว้ก่อน',[('หนี้ 2.4 ล้าน','#1d4ed8')],'#2563eb'),
  '<g transform="translate(140 104) rotate(-8)"><rect x="-22" y="-10" width="44" height="20" rx="3" fill="#fff" stroke="#0ea5e9"/><path d="M-14 0l10 -4 2 3 8 -2-8 6z" fill="#0ea5e9"/><text x="8" y="5" font-size="5.5" font-weight="800" fill="#0369a1">บิน</text></g>',
  FLOOR('#1e293b',.06), DUST(7,469,'#fff',.5), vignette('bk1')]+person('W',318,'#475569','#e8b896','worried'))
o+=P('bkvan','[ภาพประกอบนิทาน บ่ายหน้าออฟฟิศลูกหนี้ โทนส้มแดง] กล่องหลักฐานคาดเทปอายัด รถขนของ',
 [bg('bk2','#ffedd5','#fee2e2','#a87a6a'), EVIDBOX(226,112), '<g transform="translate(150 118)"><rect x="-26" y="-18" width="36" height="24" rx="3" fill="#94a3b8"/><rect x="10" y="-10" width="16" height="16" rx="3" fill="#64748b"/><circle cx="-16" cy="8" r="5" fill="#1e293b"/><circle cx="16" cy="8" r="5" fill="#1e293b"/></g>',
  SEAL(288,76,'ฉุกเฉิน','#dc2626',12,54), FLOOR('#7c2d12',.07), vignette('bk2')]+person('M',60,'#dc2626','#d8a882','shock'))
o+=P('bkpost','[ภาพประกอบนิทาน เย็นที่ไปรษณีย์ โทนเขียวมิ้นต์] ซองลงทะเบียนตอบรับบินไปต่างประเทศ',
 [bg('bk3','#dcfce7','#ccfbf1','#6a9a8a'), desk(240,134,100,'#15803d'), ENVFLY(140,110,300,70,3,'#16a34a'),
  CHIP(236,104,'ลงทะเบียนตอบรับ','#15803d'), FLOOR('#14532d',.06), vignette('bk3')]+person('W',292,'#16a34a','#e8b896','relief'))
open('/home/claude/work/s469.js','w').write(o)
