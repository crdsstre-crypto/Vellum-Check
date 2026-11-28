import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('brcafe','[ภาพประกอบนิทาน ค่ำในคาเฟ่ดนตรีสด โทนม่วงอบอุ่น] เวทีเล็ก ไฟสปอต ชุดกลอง ไมค์',
 [bg('br1','#ede9fe','#fce7f3','#8a7aa8'), '<g transform="translate(240 124)"><ellipse cx="0" cy="-2" rx="16" ry="6" fill="#e5e7eb" stroke="#475569"/><rect x="-16" y="-2" width="32" height="16" fill="#be123c"/><ellipse cx="-28" cy="-8" rx="10" ry="3" fill="#facc15"/><path d="M-28 -8v24" stroke="#475569" stroke-width="2"/><ellipse cx="28" cy="2" rx="8" ry="4" fill="#be123c"/></g><path d="M200 60l40 60l40 -60" fill="#fef9c3" opacity=".35"/>',
  '<g transform="translate(150 104)"><path d="M0 -20v32" stroke="#334155" stroke-width="2"/><rect x="-4" y="-30" width="8" height="12" rx="4" fill="#1e293b"/><path d="M-10 12h20" stroke="#334155" stroke-width="3"/></g>', FLOOR('#2e1065',.08), DUST(9,440,'#fff',.6), vignette('br1'), FG('l','#2e1065',.3)]+person('W',318,'#7c3aed','#e8b896','calm'))
o+=P('brstage','[ภาพประกอบนิทาน บ่ายห้องตัดต่อ โทนฟ้าน้ำเงิน] ไทม์ไลน์คลิป กรรไกรตัด ป้ายห้ามบิดเบือน',
 [bg('br2','#dbeafe','#e0f2fe','#7a8aa8'), '<g transform="translate(240 104)"><rect x="-50" y="-26" width="100" height="56" rx="4" fill="#1e293b"/><rect x="-44" y="-20" width="88" height="30" rx="2" fill="#3b82f6" opacity=".6"/><path d="M-44 18h88" stroke="#64748b" stroke-width="4"/>'+''.join(f'<rect x="{-44+i*18}" y="15" width="14" height="6" rx="1" fill="{c}"/>' for i,c in enumerate(['#facc15','#f472b6','#4ade80','#facc15','#f472b6']))+'<path d="M-4 15v8M4 15v8" stroke="#dc2626" stroke-width="2"/></g>', SEAL(140,100,'ห้ามบิดเบือน','#dc2626',w=70),
  FLOOR('#1e3a8a',.07), vignette('br2')]+person('M',60,'#1d4ed8','#d8a882','worried'))
o+=P('broffice','[ภาพประกอบนิทาน เย็นหลังร้าน โทนเหลืองนวล] สัญญาจ้างวง ช่องเครดิต ลูกเป็ดตุ๊กตา',
 [bg('br3','#fef9c3','#fefce8','#a89a6a'), desk(240,134,100,'#a16207'), DOC(214,80,72,46,'สัญญาจ้างวง',[('✓ ใส่ชื่อวง','#15803d'),('✓ คลิป ≤ 60 วิ','#15803d')],'#ca8a04'), DUCK(92,124,.7),
  FLOOR('#713f12',.06), vignette('br3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s440.js','w').write(o)
