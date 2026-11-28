import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ocsue','[ภาพประกอบนิทาน เช้าหน้าศาลแพ่ง เจ้าหน้าที่ถือแฟ้มคำฟ้องแทนลูกค้า เครื่องกรองน้ำตัวอย่าง โทนฟ้าน้ำกับขาว แสงเช้าใส] เครื่องกรองน้ำ แฟ้มคำฟ้อง อาคารศาล หยดน้ำ เต่า ชายหนักแน่น (น้องม้วนขวา)',
 [bg('oc1','#cffafe','#f8fafc','#a8a29e'), COURTHOUSE(286,66,.6), '<g transform="translate(222 92)"><rect width="26" height="46" rx="5" fill="#fff" stroke="#0891b2" stroke-width="2"/><rect x="5" y="8" width="16" height="20" rx="3" fill="#a5f3fc"/><path d="M13 34q-4 5 0 7q4 -2 0 -7z" fill="#0891b2"/></g>', TURTLE(214,142,.45),
  LETTER(122,104,'สคบ. ฟ้องแทนลูกค้า',['แพ่ง + อาญา + เรียกค่าเสียหาย (ม.39/1)'],'#0891b2',112,-2,1,12),
  FLOOR('#164e63',.05), DUST(7,650,'#fff',.45), vignette('oc1')]+person('M',60,'#06b6d4','#d8a882','firm'))
o+=P('ocfake','[ภาพประกอบนิทาน บ่ายในร้านกาแฟลับตา สองคนยื่นซองให้กัน ป้ายสมาคม โทนน้ำตาลคาราเมลกับเขียวขวด แสงโคมห้อย] ซองเงิน ถ้วยกาแฟ ป้ายสมาคม กระรอก หญิงมีหวังถือจดหมาย (น้องม้วนซ้าย)',
 [bg('oc2','#fde68a','#d1fae5','#a8a29e'), lamp(240,60,'#fbbf24'), TABLE(250,146,70,2,'#92400e'), envelope(236,104,.8,'#fff','#e7e5e4',-8), cup(270,110,'#fff','#92400e'), SQUIRREL(170,140,.5),
  LETTER(56,64,'คู่แข่งจ้างสมาคมฟ้อง',['เจตนาทุจริต กลั่นแกล้ง','→ ≤ 3 ปี / 6 แสน (ม.60)','สมาคมไม่สุจริต → เพิกถอน (ม.42)'],'#92400e',140,-2,1,12),
  FLOOR('#451a03',.07), DUST(7,651,'#fde68a',.45), vignette('oc2')]+person('W',318,'#d97706','#e8b88f','hopeful'))
o+=P('ocsecret','[ภาพประกอบนิทาน เย็นที่โต๊ะทำงานร้าน แฟ้มต้นทุนลับมีกุญแจ ฟองคำพูดหลุดออกไป โทนม่วงพลัมกับเหลืองนวล แสงโคมโต๊ะ] แฟ้มลับ กุญแจ ฟองคำพูด นกพิราบ หญิงตื่นตัว (น้องม้วนกลาง)',
 [bg('oc3','#f3e8ff','#fef9c3','#a8a29e'), '<g transform="translate(220 80)"><rect width="46" height="34" rx="3" fill="#7e22ce"/><rect x="18" y="12" width="10" height="10" rx="2" fill="#fde047"/><path d="M20 12v-4a3 3 0 0 1 6 0v4" stroke="#fde047" stroke-width="2" fill="none"/></g>', '<g transform="translate(282 70)"><rect width="44" height="22" rx="10" fill="#fff" stroke="#a855f7" stroke-width="1.6"/><text x="22" y="15" text-anchor="middle" font-size="7" fill="#7e22ce" font-family="sans-serif" font-weight="900">ต้นทุน…</text></g>', bird(334,104,'#94a3b8',True),
  STEPCARD(10,84,'1','เจ้าหน้าที่เผย','ความลับร้าน','#7e22ce',ICON('mail','#7e22ce')), ARROW(70,102,'#7e22ce'),
  STEPCARD(80,84,'2','โทษ','≤ 1 ปี / 2 แสน (ม.61)','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(10,128,'จดว่าให้ข้อมูลอะไร กับใคร วันไหน','#7e22ce',128,-2),
  FLOOR('#3b0764',.05), DUST(7,652,'#fff',.45), vignette('oc3')]+person('W',292,'#a855f7','#e8b88f','alert'))
open('/home/claude/work/s540.js','w').write(o)
