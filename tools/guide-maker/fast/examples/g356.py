import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('chopen','[ภาพประกอบนิทาน สายในคลินิกความงาม โทนชมพูกุหลาบกับขาวมุก] ขวดครีมสูตรเฉพาะ แฟ้มรายชื่อลูกค้า ประตูห้องพิจารณาเปิดกว้าง คนนั่งฟังหลายคน เม่นแคระบนชั้น หญิงยกมือครุ่นคิดถือเหรียญ (น้องม้วนซ้าย)',
 [bg('ch1','#fce7f3','#f8fafc','#c4a4b4'), shelf(196,74,64), HEDGEHOG(236,70,.3), ''.join(f'<rect x="{204+i*14}" y="118" width="10" height="16" rx="3" fill="#fbcfe8" stroke="#be185d"/>' for i in range(3)),
  '<g transform="translate(64 72)"><rect x="0" y="0" width="80" height="72" rx="3" fill="#78350f"/><rect x="6" y="6" width="68" height="66" fill="#fef3c7"/>'+''.join(f'<circle cx="{18+i*15}" cy="40" r="5" fill="#94a3b8"/><rect x="{13+i*15}" y="46" width="10" height="14" rx="3" fill="#94a3b8"/>' for i in range(4))+'</g>'+TX(104,66,'พิจารณาเปิดเผย',5,'#78350f','middle'),
  FLOOR('#831843',.06), DUST(8,404,'#fff',.5), vignette('ch1'), FG('r','#831843',.3)]+person('W',318,'#db2777','#e8b896','calm'))
o+=P('chclose','[ภาพประกอบนิทาน บ่ายในห้องพิจารณาที่ปิดประตู โทนน้ำเงินกรมท่ากับทอง] ป้ายพิจารณาลับห้ามบุคคลภายนอก ป้ายห้ามเผยแพร่ ม้านั่งว่าง โคอาล่าข้างประตู ชายใส่แว่นคำนับหัวเราะถือเงิน (น้องม้วนขวา)',
 [bg('ch2','#dbeafe','#fef3c7','#8a93a8'), '<rect x="200" y="72" width="70" height="74" rx="3" fill="#1e3a8a"/><path d="M235 72v74" stroke="#172554" stroke-width="2"/>'+'<rect x="206" y="88" width="58" height="22" rx="2" fill="#fff"/>'+TX(235,98,'พิจารณาลับ',5,'#b91c1c','middle')+TX(235,106,'ห้ามบุคคลภายนอก',4,'#334155','middle'),
  DOC(118,66,76,58,'คำสั่งศาล',[('ห้ามเข้าฟัง: ช่วงสูตร','#047857'),('ห้ามเผยแพร่','#b91c1c'),('รายชื่อลูกค้า','#334155')],'#1e3a8a',True),
  KOALA(282,146,.34), FLOOR('#172554',.08), DUST(6,405,'#fde68a',.4), vignette('ch2'), FG('l','#172554',.3)]+person('M',60,'#1e40af','#d8a882','smile',glasses=True))
o+=P('chprep','[ภาพประกอบนิทาน เย็นในห้องพักพนักงานคลินิก โทนเขียวมิ้นต์กับพีช] เช็กลิสต์ขอพิจารณาลับ เอกสารที่ปิดเลขบัตรด้วยแถบดำ บีเวอร์ข้างตู้ หญิงกอดอกเศร้าถือป้าย (น้องม้วนกลาง)',
 [bg('ch3','#d1fae5','#ffedd5','#9ab0a0'), lamp(220,0,'#fde68a',18),
  '<g transform="translate(118 96)"><rect x="0" y="0" width="44" height="50" rx="2" fill="#fff" stroke="#94a3b8"/><rect x="6" y="8" width="32" height="5" fill="#1f2937"/><path d="M6 20h32M6 28h24" stroke="#cbd5e1" stroke-width="3"/><rect x="6" y="34" width="22" height="5" fill="#1f2937"/></g>', BEAVER(262,146,.36),
  DOC(10,64,100,78,'ขอพิจารณาลับ',[('☑ ข้อมูลไหนลับ','#334155'),('☑ เสียหายถ้ารั่ว','#b91c1c'),('☑ ขอเฉพาะช่วงจำเป็น','#047857'),('☑ ขอห้ามเผยแพร่ด้วย','#334155'),('☑ ยื่นก่อนวันสืบ','#334155')],'#0f766e',False),
  FLOOR('#134e4a',.06), DUST(9,406,'#fde68a',.5), lightpool(170,150,80,'#ecfdf5',.4), vignette('ch3')]+person('W',292,'#14b8a6','#e8b896','worried'))
open('/home/claude/work/s356.js','w').write(o)
