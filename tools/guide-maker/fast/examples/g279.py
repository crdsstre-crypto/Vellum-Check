import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('hmlobby','[ภาพประกอบนิทาน เช้าที่ล็อบบี้โฮสเทล โทนชมพูพาสเทล] กริ่งเคาน์เตอร์ ป้ายชื่อโรงแรม ใบรับแจ้งผู้จัดการ นกฮูกบนคานไม้',
 [bg('hm1','#fce7f3','#e0f2fe','#a87a9a'), stringlights(40,40,300) if False else '', courtcounter(200,146,120), BELL(200,112), OWL(110,64,.9),
  SIGN(160,40,'VELA HOSTEL') if False else RIBBON(150,40,'VELA HOSTEL','#db2777'), HANGTAG(140,108,'ผู้จัดการ','#f472b6'),
  FLOOR('#831843',.06), DUST(9,279,'#fff',.5), vignette('hm1'), FG('l','#831843',.25)]+person('M',318,'#db2777','#d8a882','happy'))
o+=P('hmcorridor','[ภาพประกอบนิทาน ค่ำที่ทางเดินห้องพัก โทนกรมท่าอุ่น] เลขห้อง ผังหนีไฟ ป้ายทางออกฉุกเฉินเขียว สปริงเกอร์',
 [bg('hm2','#1e293b','#334155','#475569',wall_tex=False), streetlamp(130) if False else lamp(240,56,'#fde047',10), lightpool(240,150,70,'#fef9c3',.25), sprinkler(200,40) if False else '',
  '<g transform="translate(250 82)"><rect width="46" height="18" rx="3" fill="#16a34a"/><text x="23" y="13" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">EXIT</text></g>',
  DOC(104,92,92,60,'ผังหนีไฟ',[('ทุกชั้น ✓','#15803d'),('ทุกห้อง ✓','#15803d'),('ม.675 ✓','#15803d')],'#16a34a'),
  FLOOR('#0f172a',.12), vignette('hm2')]+person('W',60,'#475569','#e8b896','calm'))
o+=P('hmkitchen','[ภาพประกอบนิทาน เช้าหลังเหตุในครัวโฮสเทล โทนส้มแอปริคอต] ผนังมีคราบเขม่า ถังดับเพลิง แจ้งนายทะเบียนใน 15 วัน แมวส้มหลบใต้โต๊ะ',
 [bg('hm3','#ffedd5','#fef3c7','#a8846a'), '<g opacity=".35"><ellipse cx="230" cy="70" rx="40" ry="22" fill="#57534e"/></g>', '<g transform="translate(270 112)"><rect width="14" height="30" rx="5" fill="#dc2626"/><rect x="3" y="-6" width="8" height="7" fill="#1f2937"/></g>', cat(140,140,'#fb923c',.55),
  SEAL(120,104,'15 วัน','#ea580c'), FLOOR('#7c2d12',.07), vignette('hm3')]+person('M',292,'#ea580c','#d8a882','worried'))
open('/home/claude/work/s279.js','w').write(o)
