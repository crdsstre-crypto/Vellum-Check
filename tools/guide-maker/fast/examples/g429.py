import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cmchicken','[ภาพประกอบนิทาน ค่ำหน้าร้านข้าวมันไก่ โทนเหลืองอุ่น] กระจกร้านแตกร้าว ไก่ต้มแขวน',
 [bg('cm1','#fef3c7','#ffedd5','#a8906a'), '<g transform="translate(240 104)"><rect x="-44" y="-34" width="88" height="62" fill="#bae6fd" fill-opacity=".6" stroke="#64748b" stroke-width="3"/><path d="M-6 -6l-18 -22M-6 -6l20 -24M-6 -6l-26 14M-6 -6l14 30M-6 -6l34 4" stroke="#475569" stroke-width="1.5"/></g>',
  ''.join(f'<g transform="translate({118+i*20} 98)"><path d="M0 -14v6" stroke="#78350f"/><ellipse cy="0" rx="7" ry="9" fill="#fde68a" stroke="#d97706"/></g>' for i in range(3)), FLOOR('#78350f',.07), DUST(9,429,'#fff',.5), vignette('cm1'), FG('l','#78350f',.25)]+person('W',318,'#d97706','#e8b896','worried'))
o+=P('cmstation','[ภาพประกอบนิทาน บ่ายที่สถานีตำรวจ โทนน้ำเงินคราม] เคาน์เตอร์รับแจ้งความ คำร้องขอไกล่เกลี่ย',
 [bg('cm2','#e0e7ff','#f1f5f9','#7a8aa8'), courtcounter(240,146,110), '<g transform="translate(250 82)"><path d="M0 -14l12 6v8q0 10 -12 16q-12 -6 -12 -16v-8z" fill="#1e3a8a" stroke="#facc15" stroke-width="1.5"/><circle r="4" fill="#facc15"/></g>', DOC(110,90,90,40,'คำร้องขอไกล่เกลี่ย',[('สมัครใจทั้งสองฝ่าย','#15803d')],'#3730a3'),
  FLOOR('#1e1b4b',.07), vignette('cm2')]+person('M',60,'#3730a3','#d8a882','calm'))
o+=P('cmoffice','[ภาพประกอบนิทาน เย็นในร้าน โทนชมพูพีช] นาฬิกาทรายหยุด ใบเสนอราคากระจก กระต่ายตุ๊กตา',
 [bg('cm3','#ffe4e6','#fff1f2','#a87a7a'), desk(240,134,100,'#be123c'), '<g transform="translate(240 106)"><path d="M-12 -18h24M-12 18h24M-10 -18q0 14 10 18q-10 4 -10 18M10 -18q0 14 -10 18q10 4 10 18" stroke="#9f1239" stroke-width="2" fill="#fecdd3"/><rect x="-16" y="-4" width="32" height="8" rx="2" fill="#dc2626"/><text y="3" text-anchor="middle" font-size="6" font-weight="900" fill="#fff">หยุด</text></g>', RABBIT(92,124,.65),
  receipt(150,104), FLOOR('#881337',.06), vignette('cm3')]+person('W',292,'#e11d48','#e8b896','happy'))
open('/home/claude/work/s429.js','w').write(o)
