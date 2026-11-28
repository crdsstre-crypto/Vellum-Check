import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fnmax','[ภาพประกอบนิทาน เช้าที่ร้านอาหารริมทาง โต๊ะพับ ใบเสร็จค่าปรับยาว โทนเหลืองมะนาวกับฟ้าใส แสงแดดเช้า] โต๊ะพับ หม้อก๋วยเตี๋ยว ใบเสร็จ นกทูแคน หญิงมีหวัง (น้องม้วนขวา)',
 [bg('fn1','#fef9c3','#e0f2fe','#a8a29e'), awning(200,350,60,'#38bdf8','#fff'), TABLE(270,146,80,2,'#a16207'), steam(300,104), TOUCAN(214,92,.5),
  LETTER(122,84,'โทษปรับอย่างเดียว',['จ่ายอัตราสูงสุด ก่อนสืบพยาน','→ คดีระงับ (ม.79)'],'#0369a1',108,-2,1,12),
  FLOOR('#0c4a6e',.05), DUST(7,633,'#fff',.45), vignette('fn1'), FG('r','#075985',.12)]+person('W',60,'#38bdf8','#e8b88f','hopeful'))
o+=P('fnmany','[ภาพประกอบนิทาน บ่ายที่ช่องการเงินศาล สองใบเสร็จแยกชื่อ แจกันดอกไม้ โทนชมพูอมส้มกับเทาอ่อน แสงนุ่ม] ใบเสร็จสองใบ แจกันดอกไม้ ป้ายชำระต่อศาล ตัวนิ่ม ชายสวมแว่นเศร้า (น้องม้วนซ้าย)',
 [bg('fn2','#ffe4e6','#f1f5f9','#a8a29e'), '<g transform="translate(220 72) rotate(-4)"><rect width="34" height="44" rx="2" fill="#fff" stroke="#e11d48"/><text x="17" y="14" text-anchor="middle" font-size="7" fill="#e11d48" font-family="sans-serif" font-weight="900">พี่</text></g><g transform="translate(262 76) rotate(5)"><rect width="34" height="44" rx="2" fill="#fff" stroke="#e11d48"/><text x="17" y="14" text-anchor="middle" font-size="7" fill="#e11d48" font-family="sans-serif" font-weight="900">น้อง</text></g>', plant(320,146,.7,'#fb7185','#16a34a'), PANGOLIN(170,142,.4,'#a16207'),
  LETTER(56,64,'ปรับหุ้นส่วนหลายคน',['ปรับเรียงรายตัว (ม.31)','จ่ายต่อศาลเท่านั้น (ม.28)','ทั้งจำทั้งปรับ → จำอย่างเดียวได้'],'#e11d48',140,-2,1,12),
  FLOOR('#881337',.05), DUST(7,634,'#fff',.4), vignette('fn2')]+person('M',318,'#fb7185','#d8a882','sad',glasses=True))
o+=P('fndeath','[ภาพประกอบนิทาน เย็นที่ศาลาวัดหลังงานศพ ตาชั่งความยุติธรรม พวงมาลัย โทนครีมกับม่วงหม่น แสงเย็นสงบ] ตาชั่ง พวงมาลัย เทียน ลูกเป็ด หญิงยิ้มบางๆ (น้องม้วนกลาง)',
 [bg('fn3','#fefce8','#e9d5ff','#a8a29e'), JSCALE(244,84,6,'#7c3aed','อาญา','แพ่ง'), '<g transform="translate(316 92)"><circle r="12" fill="none" stroke="#f9a8d4" stroke-width="4"/><circle r="12" fill="none" stroke="#fde047" stroke-width="2" stroke-dasharray="2 3"/></g>', DUCK(330,138,.5),
  STEPCARD(10,84,'1','ผู้กระทำผิดตาย','โทษระงับ (ม.38)','#7c3aed',ICON('shield','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','เงินร้าน','เรียกกองมรดก (แพ่ง)','#ca8a04',ICON('coin','#ca8a04')),
  NOTEBAR(10,128,'เก็บหลักฐานหนี้ · ติดต่อผู้จัดการมรดก','#7c3aed',132,-2),
  FLOOR('#4c1d95',.05), DUST(7,635,'#fff',.45), vignette('fn3')]+person('W',292,'#c084fc','#e8b88f','smile'))
open('/home/claude/work/s536.js','w').write(o)
