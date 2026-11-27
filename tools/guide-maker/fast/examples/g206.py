import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from pk import *; from fgk import *
o=''
def dress(x,y,c,c2): return f'<g transform="translate({x} {y})"><path d="M0-4v6" stroke="#94a3b8"/><path d="M-6 2h12l4 12-3 0 5 30h-24l5-30-3 0z" fill="{c}"/><path d="M-6 2h12l-2 6h-8z" fill="{c2}"/><path d="M-9 30h18" stroke="{c2}" stroke-width="2"/></g>'
# ตอน 1 สาย ร้านเช่าชุด โทนม่วงลาเวนเดอร์กับทอง แสงสปอตไลต์ สิ่งมีชีวิต: นกในกรง
o+=P('crcounter','[ภาพประกอบนิทาน สายในร้านเช่าชุดไทย โทนลาเวนเดอร์ทอง แสงสปอตไลต์] ราวแขวนชุดไทยหลากสี ชุดสีทองแขวนเด่นติดป้าย 18,000 ใบเช่าพร้อมรูปชุดและลายเซ็น กรงนกหน้าร้าน หญิงเจ้าของร้านยิ้มถ่ายรูปชุด (น้องม้วนซ้าย)',
 [bg('cr1','#ede9fe','#faf5ff','#b8a6c8'), '<path d="M110 66h160" stroke="#a16207" stroke-width="3"/>'+dress(126,66,'#be185d','#fde68a')+dress(156,66,'#0e7490','#fde68a')+dress(222,66,'#7c3aed','#fde68a')+dress(252,66,'#15803d','#fde68a'),
  '<g class="cm-bob">'+dress(189,66,'#eab308','#b45309')+'</g>', SIGN(189,122,40,'18,000','#fff','#a16207',6), birdcage(96,70,'#d4a017'),
  '<g transform="translate(124 136) rotate(-4)"><rect x="-22" y="-14" width="44" height="28" rx="3" fill="#fff"/>'+TX(0,-6,'ใบเช่า คืน 18 พ.ย.',4,'#6d28d9','middle')+'<rect x="-18" y="-2" width="12" height="12" fill="#fde68a"/><path d="M0 6q6-6 10 0t8-2" stroke="#1d4ed8" fill="none"/></g>',
  lightpool(189,150,50,'#fef3c7',.45), DUST(10,81,'#fde68a',.6), vignette('cr1'), FG('r','#4c1d95',.35)]+person('W',318,'#a21caf','#e8b896','smile')+[
  arm('M304 140q-12-16-10-34','#a21caf','#e8b896',(294,106)), phone(292,100,.6,'#f5d0fe')])
# ตอน 2 บ่ายแก่ ห้องซักรีดหลังร้าน โทนฟ้าครามกับขาวไอน้ำ สิ่งมีชีวิต: แมวขาวดำ
o+=P('crstain','[ภาพประกอบนิทาน บ่ายแก่ในห้องซักรีดหลังร้าน โทนฟ้าครามกับไอน้ำขาว] ชุดสีทองแขวนมีคราบไวน์และตะเข็บขาด ใบเสร็จค่าซัก 600 ค่าซ่อม 400 ปฏิทินกากบาทวันคืนช้าเกิน 10 วัน นาฬิกาแขวน แมวขาวดำ ชายใส่แว่นยิ้มเศร้า (น้องม้วนขวา)',
 [bg('cr2','#dbeafe','#eff6ff','#8fa3bf'), wallclock(300,36,11), crossedcal(120,80,'#e11d48'), TX(120,114,'เกิน 10 วัน',5,'#be123c','middle'),
  '<path d="M150 64h90" stroke="#64748b" stroke-width="3"/>'+dress(196,64,'#eab308','#b45309')+'<ellipse cx="192" cy="92" rx="5" ry="4" fill="#7f1d1d" opacity=".75"/><ellipse cx="200" cy="100" rx="3" ry="2.4" fill="#7f1d1d" opacity=".6"/><path d="M204 104l3 4-3 3 3 4" stroke="#334155" stroke-width="1.2" fill="none"/>',
  steam(256,106), '<rect x="236" y="106" width="40" height="40" rx="5" fill="#f8fafc" stroke="#cbd5e1"/><circle cx="256" cy="128" r="11" fill="#bfdbfe" stroke="#94a3b8" stroke-width="2"/>',
  '<g transform="translate(160 132) rotate(-5)"><rect x="-18" y="-14" width="36" height="28" fill="#fff"/>'+TX(0,-5,'ค่าซัก 600',4.4,'#334155','middle')+TX(0,4,'ซ่อม 400',4.4,'#334155','middle')+TX(0,12,'รวม 1,000',4.4,'#dc2626','middle')+'</g>',
  cat(296,150,'#f8fafc',.75), DUST(8,82,'#fff',.6), vignette('cr2'), FG('l','#1e3a8a',.4)]+person('M',60,'#1d4ed8','#d8a882','worried',glasses=True))
# ตอน 3 หัวค่ำ เคาน์เตอร์คืนเงินประกัน โทนเขียวมรกตกับไฟทองอุ่น สิ่งมีชีวิต: กล้วยไม้และผีเสื้อกลางคืน
o+=P('crdeposit','[ภาพประกอบนิทาน หัวค่ำที่เคาน์เตอร์คืนเงินประกัน โทนเขียวมรกตไฟทองอุ่น] ซองเงินประกัน 3,000 หักค่าซักซ่อม 1,000 คืน 2,000 พร้อมใบเสร็จ แชตทวงลูกค้าที่ยังไม่คืนชุดกำหนดวันชัดเจน กล้วยไม้ ผีเสื้อกลางคืนบินรอบโคมไฟ หญิงกอดอกมองตัวเลข (น้องม้วนกลาง)',
 [bg('cr3','#134e4a','#1f5f57','#2c4a44',wall_tex=False), lamp(200,0,'#fde68a',18), moth(214,40), orchid(116,122),
  '<rect x="100" y="126" width="180" height="54" fill="#7c4a2a"/><rect x="96" y="122" width="188" height="6" rx="2" fill="#a16207"/>',
  '<g filter="url(#wsh@K@)"><rect x="14" y="70" width="80" height="56" rx="5" fill="#fffbeb"/></g>'+TX(20,84,'เงินประกัน 3,000',5,'#334155')+TX(20,96,'หักซักซ่อม -1,000',5,'#b91c1c')+'<path d="M20 101h66" stroke="#94a3b8"/>'+TX(20,114,'คืน 2,000 บาท',6,'#047857'),
  '<g class="cm-bob"><rect x="222" y="80" width="58" height="28" rx="6" fill="#fff"/>'+TX(251,91,'ขอคืนชุด',4.8,'#0f766e','middle')+TX(251,101,'ภายใน 3 ธ.ค.',4.8,'#dc2626','middle')+'</g>',
  cashenvelope(150,112) if False else '<rect x="200" y="110" width="34" height="16" rx="2" fill="#fef3c7" stroke="#d97706"/>'+TX(217,121,'2,000',5,'#92400e','middle'),
  lightpool(200,150,80,'#fde68a',.3), DUST(10,83,'#fde68a',.6), vignette('cr3'), FG('r','#052e2b',.55)]+person('W',292,'#0d9488','#e8b896','calm'))
open('/home/claude/work/s206.js','w').write(o)
