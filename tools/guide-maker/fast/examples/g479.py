import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('drlobby','[ภาพประกอบนิทาน เช้าที่ล็อบบี้หอพัก โทนเขียวมิ้นต์] บอร์ดระเบียบหอพัก โล่ประกันภัย',
 [bg('u1','#ccfbf1','#dcfce7','#6a9a8a',wall_tex=False), '<g transform="translate(236 96)"><rect x="-44" y="-36" width="88" height="68" rx="3" fill="#a16207"/><rect x="-40" y="-32" width="80" height="60" fill="#fef9c3"/><text y="-20" font-size="7.5" font-weight="900" text-anchor="middle" fill="#0f766e">ระเบียบหอพัก</text>'+''.join(f'<circle cx="-30" cy="{-8+i*10}" r="2.5" fill="#0f766e"/><rect x="-24" y="{-10+i*10}" width="{52-(i%2)*12}" height="4" rx="2" fill="#99f6e4"/>' for i in range(4))+'</g>',
  '<g transform="translate(140 104)"><path d="M0 -20l16 6v10c0 12-8 18-16 22c-8-4-16-10-16-22v-10z" fill="#14b8a6" stroke="#0f766e" stroke-width="2"/><path d="M-6 2l4 4 8-9" stroke="#fff" stroke-width="3" fill="none"/></g>', FLOOR('#134e4a',.06), DUST(7,479,'#fff',.5), vignette('u1')]+person('W',318,'#0d9488','#e8b896','calm'))
o+=P('drsign','[ภาพประกอบนิทาน บ่ายหน้าตึก โทนชมพูส้ม] ตึกหอพักป้ายไทย ป้ายอังกฤษถูกขีด',
 [bg('u2','#fce7f3','#ffedd5','#a87a7a'), DORMBLDG(236,116,'#ec4899','หอพักหญิง','ข้าวมันไก่'), '<g transform="translate(140 88) rotate(-6)"><rect x="-30" y="-9" width="60" height="18" rx="3" fill="#94a3b8"/><text y="4" font-size="7" font-weight="900" text-anchor="middle" fill="#fff">DORM ONLY</text><path d="M-32 -11l64 22M32 -11l-64 22" stroke="#dc2626" stroke-width="3"/></g>',
  FLOOR('#831843',.07), vignette('u2')]+person('M',60,'#db2777','#d8a882','shock'))
o+=P('drstaff','[ภาพประกอบนิทาน เย็นที่ห้องผู้จัดการ โทนเหลืองครีม] ใบตรวจประวัติพนักงาน ป้ายชื่อ นกฮูก',
 [bg('u3','#fef9c3','#fef3c7','#9a8a6a'), desk(240,134,100,'#a16207'), DOC(214,82,84,42,'ตรวจประวัติพนักงาน',[('ไม่มีประวัติ ✓','#16a34a')],'#ca8a04'), HAMSTER(96,124,.72),
  CHIP(170,118,'หอหญิง คนดูแลเป็นหญิง','#a16207'), FLOOR('#713f12',.06), vignette('u3')]+person('W',292,'#ca8a04','#e8b896','relief'))
open('/home/claude/work/s479.js','w').write(o)
