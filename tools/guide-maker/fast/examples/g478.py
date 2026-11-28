import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('dmlaundry','[ภาพประกอบนิทาน เช้าที่ร้านซักรีด โทนฟ้าพาสเทล] ตึกหอพักเหนือร้าน เครื่องซักผ้า ป้ายอายุ 30+',
 [bg('m1','#e0f2fe','#f0f9ff','#7a9aa8',wall_tex=False), DORMBLDG(238,112,'#0ea5e9','หอพักเอกชน','ร้านซักรีด'), '<g transform="translate(140 116)"><rect x="-16" y="-20" width="32" height="38" rx="4" fill="#fff" stroke="#64748b"/><circle cy="2" r="10" fill="#bae6fd" stroke="#64748b"/></g>',
  CHIP(140,80,'อายุ 30+','#0369a1'), FLOOR('#0c4a6e',.06), DUST(7,478,'#fff',.5), vignette('m1')]+person('W',318,'#0284c7','#e8b896','proud'))
o+=P('dmtravel','[ภาพประกอบนิทาน บ่ายหน้าร้าน โทนส้มเหลือง] กระเป๋าเดินทาง ป้ายผู้ทำหน้าที่แทน วง 15 วัน',
 [bg('m2','#ffedd5','#fef9c3','#a88a6a'), '<g transform="translate(150 118)"><rect x="-16" y="-20" width="32" height="38" rx="4" fill="#f97316"/><rect x="-6" y="-26" width="12" height="7" rx="2" fill="none" stroke="#7c2d12" stroke-width="2"/><circle cx="-10" cy="20" r="3" fill="#1e293b"/><circle cx="10" cy="20" r="3" fill="#1e293b"/></g>',
  DOC(240,80,84,40,'ตั้งผู้ทำหน้าที่แทน',[('แจ้งนายทะเบียน','#c2410c')],'#ea580c'), DAYRING(280,128,'15','วัน',.5,'#c2410c',16), FLOOR('#7c2d12',.07), vignette('m2')]+person('M',60,'#ea580c','#d8a882','worried'))
o+=P('dmframe','[ภาพประกอบนิทาน เย็นที่ล็อบบี้หอพัก โทนม่วงชมพู] กรอบใบอนุญาตผู้จัดการ อายุ 2 ปี นกฮูก',
 [bg('m3','#f3e8ff','#fce7f3','#9a7aa8'), desk(240,134,100,'#7e22ce'), '<g transform="translate(250 90)"><rect x="-30" y="-22" width="60" height="44" rx="2" fill="#a16207"/><rect x="-25" y="-17" width="50" height="34" fill="#fffbeb"/><text y="-5" font-size="6.5" font-weight="900" text-anchor="middle" fill="#7e22ce">ใบอนุญาต</text><text y="5" font-size="6.5" font-weight="900" text-anchor="middle" fill="#7e22ce">ผู้จัดการหอพัก</text><circle cx="16" cy="11" r="4" fill="#dc2626"/></g>', OWL(96,122,.75,'#e9d5ff'),
  CHIP(170,86,'อายุ 2 ปี','#7e22ce'), FLOOR('#581c87',.06), vignette('m3')]+person('W',292,'#9333ea','#e8b896','happy'))
open('/home/claude/work/s478.js','w').write(o)
