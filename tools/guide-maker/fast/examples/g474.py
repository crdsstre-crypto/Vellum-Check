import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bpliq','[ภาพประกอบนิทาน เช้าที่สำนักงานผู้ชำระบัญชี โทนเหลืองเขียว] งบดุล ทุนหมด หนี้ล้น',
 [bg('p1','#fef9c3','#ecfccb','#8a9a6a',wall_tex=False), '<g transform="translate(236 104)"><rect x="-44" y="-34" width="88" height="64" rx="3" fill="#fff" stroke="#65a30d" stroke-width="2"/><text y="-22" font-size="7.5" font-weight="900" text-anchor="middle" fill="#3f6212">งบผู้ชำระบัญชี</text><rect x="-34" y="-12" width="20" height="30" fill="#bef264"/><rect x="10" y="-26" width="20" height="44" fill="#f87171"/><text x="-24" y="26" font-size="6" text-anchor="middle" font-weight="800" fill="#3f6212">ทรัพย์</text><text x="20" y="26" font-size="6" text-anchor="middle" font-weight="800" fill="#b91c1c">หนี้</text></g>',
  CHIP(140,96,'ทุนหมดแล้ว','#4d7c0f'), FLOOR('#365314',.06), DUST(7,474,'#fff',.5), vignette('p1')]+person('W',318,'#65a30d','#e8b896','curious'))
o+=P('bppartner','[ภาพประกอบนิทาน บ่ายในศาล โทนแดงส้ม] หนังสือรับรองห้าง ชื่อหุ้นส่วนไม่จำกัดวงแดง',
 [bg('p2','#fee2e2','#ffedd5','#a87a6a'), DOC(232,80,92,48,'หนังสือรับรอง หจก.',[('ไม่จำกัดความรับผิด','#dc2626'),('จำกัดความรับผิด','#64748b')],'#ef4444'),
  SEAL(140,110,'ไม่ฟ้องใหม่','#dc2626',-10,60), FLOOR('#7f1d1d',.07), vignette('p2')]+person('M',60,'#dc2626','#d8a882','shock'))
o+=P('bpmeeting','[ภาพประกอบนิทาน เย็นในห้องประชุมเจ้าหนี้ โทนฟ้าม่วง] โต๊ะประชุม เก้าอี้ว่าง ค้อนศาล เต่าน้อย',
 [bg('p3','#e0e7ff','#f3e8ff','#7a7aa8'), TABLE(240,128) if 'TABLE' in dir() else desk(240,134,100,'#4338ca'), '<g transform="translate(250 92) rotate(-25)"><rect x="-18" y="-6" width="26" height="12" rx="2" fill="#a16207"/><rect x="6" y="-2" width="22" height="4" fill="#78350f"/></g>', TURTLE(96,124,.72),
  CHIP(170,86,'ประชุมเจ้าหนี้','#4338ca'), FLOOR('#312e81',.06), vignette('p3')]+person('W',292,'#4f46e5','#e8b896','relief'))
open('/home/claude/work/s474.js','w').write(o)
