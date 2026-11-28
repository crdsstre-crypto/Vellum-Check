import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
FLAME=lambda x,y,s=1: f"<g transform=\"translate({x} {y}) scale({s})\"><path d=\"M0 0q-14 -14 -4 -30q2 10 8 8q-4 -14 8 -24q-2 14 8 20q8 10 -2 26z\" fill=\"#f97316\"/><path d=\"M4 -2q-6 -8 0 -16q2 6 6 4q2 8 -6 12z\" fill=\"#fde047\"/></g>"
SMOKE=lambda x,y: "".join(f"<circle cx=\"{x+i*6}\" cy=\"{y-i*9}\" r=\"{6+i*2}\" fill=\"#94a3b8\" opacity=\"{.45-i*.1:.2f}\"/>" for i in range(4))
HORSE=lambda x,y: f'<g transform="translate({x} {y})"><ellipse cx="0" cy="0" rx="18" ry="10" fill="#a16207"/><path d="M14 -4l10 -14l6 4l-6 12z" fill="#a16207"/><path d="M-12 8v14M-4 8v14M6 8v14M12 8l2 14" stroke="#78350f" stroke-width="3"/><path d="M24 -18l3 -5" stroke="#78350f" stroke-width="2"/><path d="M-18 -2q-8 4 -6 12" stroke="#57534e" stroke-width="3" fill="none"/><rect x="10" y="20" width="6" height="4" fill="#fecaca"/></g>'
GOAT=lambda x,y: f'<g transform="translate({x} {y})"><ellipse rx="12" ry="7" fill="#f5f5f4" stroke="#a8a29e"/><circle cx="12" cy="-6" r="5" fill="#f5f5f4" stroke="#a8a29e"/><path d="M10 -11l-2 -5M14 -11l2 -5" stroke="#78716c" stroke-width="1.6"/><path d="M-8 6v8M-2 6v8M4 6v8M9 6v8" stroke="#78716c" stroke-width="2"/></g>'
# ตอน 1 เช้าหน้าร้านของฝากริมทาง หมาดุเดินเพ่นพ่าน โทนส้มอิฐกับเขียวหญ้า แสงเช้าแรง สิ่งมีชีวิต: หมาพันธุ์ดุ
o+=P('anfierce','[ภาพประกอบนิทาน เช้าหน้าร้านของฝากริมทาง หมาดุเดินเพ่นพ่าน โทนส้มอิฐกับเขียวหญ้า แสงเช้าแรง] หมาดุไม่ได้ล่าม ป้ายระวังสุนัขดุ คอกกั้น ชายง่วงถือโล่ (น้องม้วนขวา)',
 [bg('an1','#ffedd5','#dcfce7','#a8a29e'), SHOPFRONT(256,74,64,'#ea580c','ของฝาก'), dog(232,146,'#57534e',.75), SIGN(300,128,40,'ระวังสุนัข','#dc2626','#fff',5.5),
  STEPCARD(122,66,'✗','ปล่อยเดินลำพัง','ม.377 ผิด','#dc2626',ICON('shield','#dc2626')),
  STEPCARD(122,108,'✓','ล่าม/ขังคอก','ติดป้ายเตือน','#16a34a',ICON('mag','#16a34a')),
  FLOOR('#7c2d12',.06), DUST(7,534,'#fff',.4), vignette('an1'), FG('r','#7c2d12',.14)]+person('M',60,'#ea580c','#d8a882','tired'))
# ตอน 2 บ่ายที่ลานจอดรถม้า โทนเหลืองทรายกับฟ้าใส แสงบ่ายร้อน สิ่งมีชีวิต: ม้าแก่ขาเจ็บ
o+=P('anwork','[ภาพประกอบนิทาน บ่ายที่ลานจอดรถม้าพาเที่ยว โทนเหลืองทรายกับฟ้าใส แสงบ่ายร้อน] ม้าแก่ขาพันผ้า ตารางพักสัตว์ ถังน้ำ ร่มเงา หญิงโล่งใจถือปฏิทิน (น้องม้วนซ้าย)',
 [bg('an2','#fef9c3','#e0f2fe','#a8a29e'), HORSE(258,124), '<g transform="translate(214 128)"><path d="M0 0h14l-2 16h-10z" fill="#3b82f6"/></g>', '<path d="M290 60q20 -10 40 0" stroke="#16a34a" stroke-width="10" fill="none" opacity=".4"/>',
  LETTER(56,66,'ตารางงานม้า',['ลากรถ ≤ 4 รอบ/วัน','พักทุก 1 ชม. + น้ำ','ป่วย/ขาเจ็บ = หยุดงาน'],'#a16207',112,-2,1,12),
  NOTEBAR(56,122,'ฆ่าสัตว์ให้ทรมานเกินจำเป็น → ม.381','#dc2626',124,-2),
  FLOOR('#78350f',.07), DUST(9,535,'#fff',.5), vignette('an2')]+person('W',318,'#ca8a04','#e8b88f','calm'))
# ตอน 3 เย็นที่แปลงผักข้างฟาร์มนมแพะ โทนเขียวผักกับชมพูพระอาทิตย์ตก แสงเย็นนุ่ม สิ่งมีชีวิต: แพะกินผัก
o+=P('anfarm','[ภาพประกอบนิทาน เย็นที่แปลงผักข้างฟาร์มนมแพะ โทนเขียวผักกับชมพูพระอาทิตย์ตก แสงเย็นนุ่ม] แพะลอดรั้วพังกินผัก การ์ดไล่ต้อนกับปล่อยปละ ชายสวมแว่นยิ้มถือเงิน (น้องม้วนกลาง)',
 [bg('an3','#dcfce7','#fce7f3','#8a9a7a'), '<path d="M196 120h70" stroke="#a16207" stroke-width="3"/>'+''.join(f'<path d="M{200+i*12} 108v22" stroke="#a16207" stroke-width="3"/>' for i in range(6) if i!=3), GOAT(236,136), VEG(214,140) if 'VEG' in dir() else '<g transform="translate(250 142)">'+''.join(f'<path d="M{i*8} 0q-3 -8 0 -12q3 4 0 12" fill="#4ade80"/>' for i in range(5))+'</g>',
  STEPCARD(10,84,'1','ไล่ต้อนเข้าไร่','ม.394 จำคุก/ปรับ','#dc2626',ICON('shield','#dc2626')), ARROW(70,102,'#15803d'),
  STEPCARD(80,84,'2','ปล่อยปละเข้าไป','ม.395 ปรับ ≤5,000','#15803d',ICON('mag','#15803d')),
  NOTEBAR(10,128,'ซ่อมรั้ว + บันทึกชดใช้ค่าผัก','#15803d',120,-2),
  FLOOR('#14532d',.07), DUST(7,536,'#fff',.45), vignette('an3')]+person('M',292,'#16a34a','#d8a882','smile',glasses=True))
open('/home/claude/work/s506.js','w').write(o)
