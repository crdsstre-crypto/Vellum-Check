import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
TAG=lambda x,y,t,c="#dc2626": f"<g transform=\"translate({x} {y}) rotate(-6)\"><rect width=\"44\" height=\"16\" rx=\"3\" fill=\"#fff\" stroke=\"{c}\" stroke-width=\"1.6\"/><circle cx=\"6\" cy=\"8\" r=\"2\" fill=\"{c}\"/><text x=\"26\" y=\"11\" text-anchor=\"middle\" font-size=\"6\" fill=\"{c}\" {F}>{t}</text></g>"
SAFE2=lambda x,y,open_=False: f'<g transform="translate({x} {y})"><rect width="44" height="50" rx="4" fill="#475569"/><rect x="4" y="4" width="36" height="42" rx="3" fill="#64748b"/>'+(f'<rect x="4" y="4" width="16" height="42" fill="#1e293b"/><rect x="20" y="10" width="16" height="10" fill="#facc15"/>' if open_ else '<circle cx="22" cy="25" r="8" fill="#94a3b8"/><path d="M22 25l5 -4" stroke="#1e293b" stroke-width="2"/>')+'</g>'
GOLD=lambda x,y: ''.join(f'<rect x="{x+i*10}" y="{y-(i%2)*4}" width="9" height="5" rx="1" fill="#facc15" stroke="#a16207" stroke-width=".6"/>' for i in range(4))
# ตอน 1 เย็นในร้านทองรูปพรรณ ลิ้นชักเงินเปิดค้าง โทนแดงจีนกับทอง แสงไฟตู้โชว์ สิ่งมีชีวิต: ปลาคาร์ปในโหลบนเคาน์เตอร์
o+=P('ftfamily','[ภาพประกอบนิทาน เย็นในร้านทองรูปพรรณ ลิ้นชักเงินเปิดค้าง โทนแดงจีนกับทอง แสงไฟตู้โชว์] ตู้โชว์ทอง ลิ้นชักเงิน ผังญาติสามีภริยาพ่อลูกพี่น้อง ปลาคาร์ปในโหล หญิงร้องไห้ถือเหรียญ (น้องม้วนขวา)',
 [bg('ft1','#fee2e2','#fef3c7','#a8a29e'), '<g transform="translate(236 92)"><rect width="88" height="40" rx="3" fill="#fef3c7" stroke="#b91c1c" stroke-width="2"/></g>', GOLD(246,112), GOLD(286,114), fishbowl(312,90,.45),
  LETTER(122,66,'ใครเอาเงินร้าน?',['สามี/ภรรยา → ไม่ต้องรับโทษ','พ่อแม่–ลูก/พี่น้องร่วมพ่อแม่','→ ยอมความได้ ลดโทษได้'],'#b91c1c',106,-2,1,12),
  FLOOR('#7f1d1d',.06), DUST(7,594,'#fde68a',.4), vignette('ft1'), FG('r','#7f1d1d',.14)]+person('W',60,'#dc2626','#e8b88f','worried'))
# ตอน 2 กลางคืนในห้องตู้เซฟ สัญญาณกันขโมยกะพริบ โทนน้ำเงินคืนกับแดงไฟเตือน แสงไฟกะพริบ สิ่งมีชีวิต: จิ้งจกบนผนัง
o+=P('ftattempt','[ภาพประกอบนิทาน กลางคืนในห้องตู้เซฟ สัญญาณกันขโมยกะพริบ โทนน้ำเงินคืนกับแดงไฟเตือน แสงไฟกะพริบ] ตู้เซฟสองใบ ใบหนึ่งเปิดแล้วปิดคืน ไขควงพลาสติก การ์ดพยายาม จิ้งจก ชายสวมแว่นคิดถือปากกา (น้องม้วนซ้าย)',
 [bg('ft2','#1e3a8a','#0f172a','#475569'), SAFE2(230,96), SAFE2(282,96,True), '<circle cx="256" cy="66" r="7" fill="#ef4444"/><circle cx="256" cy="66" r="13" fill="#ef4444" opacity=".25"/>', gecko(320,74,'#7ab86a'),
  LETTER(56,64,'พยายามขโมย',['ถูกจับก่อนได้ของ → 2/3 (ม.80)','ไขควงพลาสติก → ≤ 1/2 (ม.81)','เปลี่ยนใจเอง → ไม่รับโทษพยายาม'],'#0369a1',122,-2,1,12),
  FLOOR('#000',.14), DUST(7,595,'#fca5a5',.45), vignette('ft2')]+person('M',318,'#0ea5e9','#d8a882','calm',glasses=True))
# ตอน 3 บ่ายหน้าร้านทอง กล้องจับภาพคนเฝ้าต้นทาง โทนเหลืองทองกับเทาถนน แสงบ่ายแรง สิ่งมีชีวิต: นกพิราบบนป้ายร้าน
o+=P('ftgroup','[ภาพประกอบนิทาน บ่ายหน้าร้านทอง กล้องวงจรปิดจับภาพคนเฝ้าต้นทาง โทนเหลืองทองกับเทาถนน แสงบ่ายแรง] กล้องวงจรปิด มอเตอร์ไซค์จอดรอ การ์ดตัวการร่วม นกพิราบบนป้าย หญิงมั่นใจถือแว่นขยาย (น้องม้วนกลาง)',
 [bg('ft3','#fef3c7','#e7e5e4','#a8a29e'), SIGN(196,96,52,'ร้านทอง','#b91c1c','#fde68a',8), bird(250,62,'#94a3b8'), '<g transform="translate(268 76)"><rect width="18" height="10" rx="2" fill="#1e293b"/><circle cx="18" cy="5" r="4" fill="#475569"/><path d="M-4 5h4" stroke="#1e293b" stroke-width="2"/></g>',
  STEPCARD(10,84,'1','ชิง + ขับรถ','ตัวการ ม.83','#dc2626',ICON('shield','#dc2626')), ARROW(70,102,'#b45309'),
  STEPCARD(80,84,'2','เฝ้าต้นทาง','แบ่งหน้าที่ = ตัวการร่วม','#b45309',ICON('mag','#b45309')),
  NOTEBAR(10,128,'ตู้เซฟ + สัญญาณ + กล้องหน้าร้าน','#b45309',124,-2),
  FLOOR('#57534e',.07), DUST(7,596,'#fff',.45), vignette('ft3')]+person('W',292,'#ca8a04','#e8b88f','firm'))
open('/home/claude/work/s526.js','w').write(o)
