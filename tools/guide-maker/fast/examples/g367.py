import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
CHQ=lambda x,y,r=0: "<g transform=\"translate(%d %d) rotate(%d)\"><rect x=\"0\" y=\"0\" width=\"64\" height=\"30\" rx=\"2\" fill=\"#fefce8\" stroke=\"#a16207\"/><rect x=\"0\" y=\"0\" width=\"64\" height=\"6\" fill=\"#facc15\"/><path d=\"M6 14h30M6 21h20M40 22h18\" stroke=\"#a8a29e\" stroke-width=\"2\"/></g>"%(x,y,r)
o+=P('cedrawer','[ภาพประกอบนิทาน สายในร้านเครื่องมือช่าง โทนส้มเหล็กกับเทา] ลิ้นชักเปิดเจอเช็คเก่าฝุ่นจับ ป้ายเช็คหมดสิทธิแต่หนี้ไม่หาย แผงเครื่องมือ แมวในลิ้นชัก หญิงคำนับตาเป็นประกายถือแก้ว (น้องม้วนซ้าย)',
 [bg('ce1','#ffedd5','#e5e7eb','#a8a29e'), '<rect x="190" y="70" width="80" height="46" rx="3" fill="#475569"/>'+''.join(f'<path d="M{198+i*12} 76v34" stroke="#cbd5e1" stroke-width="3"/>' for i in range(6)),
  '<rect x="60" y="112" width="110" height="34" rx="3" fill="#92400e"/><rect x="66" y="100" width="98" height="16" rx="2" fill="#a16207"/>', CHQ(84,92,-6), DUST(5,437,'#a8a29e',.6), cat(150,112,'#94a3b8',.36),
  STICKER(212,130,'หนี้ยังอยู่','#16a34a',15), FLOOR('#7c2d12',.07), DUST(8,438,'#fff',.4), vignette('ce1'), FG('r','#7c2d12',.3)]+person('W',318,'#ea580c','#e8b896','smile'))
o+=P('cepause','[ภาพประกอบนิทาน บ่ายที่โต๊ะทนาย โทนฟ้าน้ำเงินกับเหลือง] เช็คมีผู้สลักหลังสามคน ลูกศรสะดุดอายุความชี้คนเดียว นาฬิกาทราย นกฮูกบนชั้น ชายใส่แว่นโบกมือโล่งใจถือมือถือ (น้องม้วนขวา)',
 [bg('ce2','#dbeafe','#fef9c3','#8a9ab0'), CHQ(120,70,0), ''.join(f'<g transform="translate({132+i*34} 118)"><circle r="9" fill="{c}"/><rect x="-8" y="9" width="16" height="14" rx="4" fill="{c}"/></g>' for i,c in enumerate(['#94a3b8','#2563eb','#94a3b8'])),
  '<path d="M166 98v8" stroke="#dc2626" stroke-width="2.5"/>'+TX(166,96,'สะดุดแค่คนนี้',4.4,'#b91c1c','middle'), SANDGLASS(240,100,'#1d4ed8',.6), OWL(276,146,.32),
  FLOOR('#1e3a8a',.07), DUST(6,439,'#fff',.4), vignette('ce2'), FG('l','#1e3a8a',.3)]+person('M',60,'#1d4ed8','#d8a882','smile',glasses=True))
o+=P('ceprep','[ภาพประกอบนิทาน เย็นที่เคาน์เตอร์ร้านเครื่องมือ โทนเขียวมะกอกกับครีม] เช็กลิสต์จัดการเช็ค สมุดทะเบียนเช็ครับ ตะกร้าใบส่งของ แรคคูนข้างตะกร้า หญิงยกมือตกใจถือเหรียญ (น้องม้วนกลาง)',
 [bg('ce3','#ecfccb','#fefce8','#a4ac8a'), lamp(220,0,'#fde68a',18), '<g transform="translate(118 104)"><rect x="0" y="0" width="44" height="34" rx="2" fill="#fff" stroke="#4d7c0f"/>'+TX(22,9,'ทะเบียนเช็ค',4.2,'#365314','middle')+'<path d="M4 16h36M4 22h36M4 28h28" stroke="#cbd5e1" stroke-width="2"/></g>', RACCOON(256,146,.34),
  DOC(10,64,100,78,'เช็คเก่าค้าง',[('☑ ถ่ายรูปหน้า–หลัง','#334155'),('☑ หาใบส่งของเดิม','#047857'),('☑ หนังสือทวงถาม','#334155'),('☑ อายุความหนี้ค่าสินค้า','#b91c1c'),('☑ ต่อไปฝากเร็ว','#334155')],'#4d7c0f',False),
  FLOOR('#365314',.06), DUST(9,440,'#fde68a',.5), lightpool(170,150,80,'#f7fee7',.4), vignette('ce3')]+person('W',292,'#65a30d','#e8b896','worried'))
open('/home/claude/work/s367.js','w').write(o)
