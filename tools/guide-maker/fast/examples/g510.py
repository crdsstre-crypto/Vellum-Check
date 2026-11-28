import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
MOTO=lambda x,y,c="#dc2626": f"<g transform=\"translate({x} {y})\"><circle cx=\"0\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"44\" cy=\"0\" r=\"9\" fill=\"#1e293b\"/><circle cx=\"0\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><circle cx=\"44\" cy=\"0\" r=\"4\" fill=\"#94a3b8\"/><path d=\"M0 0l14 -16h18l12 16\" stroke=\"{c}\" stroke-width=\"5\" fill=\"none\"/><rect x=\"14\" y=\"-22\" width=\"18\" height=\"7\" rx=\"3\" fill=\"#1e293b\"/></g>"
TERM=lambda x,y: f"<g transform=\"translate({x} {y})\"><rect width=\"30\" height=\"44\" rx=\"5\" fill=\"#334155\"/><rect x=\"4\" y=\"5\" width=\"22\" height=\"12\" rx=\"2\" fill=\"#a7f3d0\"/>"+"".join(f"<rect x=\"{5+(i%3)*7}\" y=\"{21+(i//3)*6}\" width=\"5\" height=\"4\" rx=\"1\" fill=\"#cbd5e1\"/>" for i in range(9))+"<rect x=\"-3\" y=\"30\" width=\"36\" height=\"6\" rx=\"2\" fill=\"#ef4444\" opacity=\".85\"/></g>"
CARD=lambda x,y,c,rot=0: f"<g transform=\"translate({x} {y}) rotate({rot})\"><rect width=\"34\" height=\"22\" rx=\"3\" fill=\"{c}\"/><rect x=\"4\" y=\"5\" width=\"7\" height=\"5\" rx=\"1\" fill=\"#fde68a\"/><path d=\"M4 16h20\" stroke=\"#fff\" stroke-width=\"1.4\"/></g>"
# ตอน 1 บ่ายในร้านอาหารระหว่างต่อเติมชั้นลอย โทนเทาปูนกับส้มเตือน แสงบ่ายผ่านฝุ่น สิ่งมีชีวิต: แมวส้มหลบใต้โต๊ะ
o+=P('rnbuild','[ภาพประกอบนิทาน บ่ายในร้านอาหารระหว่างต่อเติมชั้นลอย โทนเทาปูนกับส้มเตือน แสงบ่ายผ่านฝุ่น] พื้นชั้นลอยแอ่น ราวกันตกถูกรื้อ นั่งร้าน แมวส้มใต้โต๊ะ ชายตกใจถือปฏิทิน (น้องม้วนขวา)',
 [bg('rn1','#f5f5f4','#ffedd5','#a8a29e'), SCAFFOLD(250,70,70,74,'#f59e0b'), '<path d="M238 92q40 12 90 0" stroke="#57534e" stroke-width="5" fill="none"/><path d="M300 92v-14" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 2"/>', cat(234,140,'#e8a05a',.42),
  STEPCARD(122,66,'1','ไม่ทำตามหลักวิชา','ม.227 ≤ 5 ปี','#ea580c',ICON('pen','#ea580c')),
  STEPCARD(122,108,'2','รื้อราวกันตก','ม.226 ≤ 5 ปี','#dc2626',ICON('shield','#dc2626')),
  FLOOR('#44403c',.07), DUST(10,546,'#fff',.5), vignette('rn1'), FG('r','#44403c',.14)]+person('M',60,'#ea580c','#d8a882','worried'))
# ตอน 2 เช้าหน้าร้าน ท่อประปาแตกทั้งซอย โทนฟ้าน้ำกับน้ำตาลดิน แสงเช้าสะท้อนแอ่งน้ำ สิ่งมีชีวิต: กบบนขอบหลุม
o+=P('rnutility','[ภาพประกอบนิทาน เช้าหน้าร้าน ท่อประปาแตกทั้งซอย โทนฟ้าน้ำกับน้ำตาลดิน แสงเช้าสะท้อนแอ่งน้ำ] หลุมขุดท่อแตกน้ำพุ่ง ท่อระบายอุดปูน กรวยเตือน กบบนขอบหลุม หญิงหัวเราะถือโล่ (น้องม้วนซ้าย)',
 [bg('rn2','#e0f2fe','#fef3c7','#a8a29e'), '<ellipse cx="270" cy="140" rx="34" ry="8" fill="#78350f"/><path d="M250 138h40" stroke="#64748b" stroke-width="6"/><path d="M270 136q-6 -20 -2 -30M270 136q8 -18 14 -24" stroke="#38bdf8" stroke-width="3" fill="none"/><path d="M226 146l6 -14h6l6 14z" fill="#f97316"/>', '<g transform="translate(296 132)"><ellipse rx="6" ry="4" fill="#4ade80"/><circle cx="-3" cy="-3" r="1.6" fill="#fff"/><circle cx="3" cy="-3" r="1.6" fill="#fff"/></g>',
  LETTER(56,64,'ขุดหน้าร้านพลาด',['ท่อประปาแตก → ม.234','เทปูนอุดท่อระบาย → ม.375','ถามประปา/ไฟฟ้าก่อนขุด'],'#0369a1',116,-2,1,12),
  FLOOR('#78350f',.07), DUST(9,547,'#fff',.5), vignette('rn2')]+person('W',318,'#0284c7','#e8b88f','smile'))
# ตอน 3 เย็นที่จุดรับส่งลูกค้า รถตู้คนแน่น โทนเหลืองพระอาทิตย์ตกกับน้ำเงิน แสงเย็น สิ่งมีชีวิต: สุนัขนั่งรอข้างทาง
o+=P('rnvan','[ภาพประกอบนิทาน เย็นที่จุดรับส่งลูกค้า รถตู้คนแน่นปิดประตูไม่ได้ โทนเหลืองพระอาทิตย์ตกกับน้ำเงิน แสงเย็น] การ์ดบรรทุกเกินกับปลอดภัย สุนัขนั่งรอ ชายสวมแว่นมั่นใจถือโทรศัพท์ (น้องม้วนกลาง)',
 [bg('rn3','#fef3c7','#dbeafe','#a8a29e'), '<g transform="translate(200 100)"><rect width="70" height="38" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><rect x="6" y="6" width="58" height="14" rx="3" fill="#bae6fd"/>'+''.join(f'<circle cx="{12+i*10}" cy="13" r="4" fill="#d8a882"/>' for i in range(6))+'<circle cx="16" cy="40" r="7" fill="#1e293b"/><circle cx="54" cy="40" r="7" fill="#1e293b"/><path d="M70 10l8 -4v20l-8 -4" fill="#cbd5e1" stroke="#64748b"/></g>', dog(290,146,'#d6a46a',.42),
  STEPCARD(10,84,'1','รถรับจ้างคนแน่น','ม.233 ≤ 1 ปี','#dc2626',ICON('shield','#dc2626')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'2','คน = ที่นั่ง','ประตูปิดสนิท','#16a34a',ICON('clock','#16a34a')),
  NOTEBAR(10,128,'ตรวจสภาพรถ + ประกันผู้โดยสาร','#1d4ed8',124,-2),
  FLOOR('#1e3a8a',.07), DUST(7,548,'#fff',.45), vignette('rn3')]+person('M',292,'#2563eb','#d8a882','firm',glasses=True))
open('/home/claude/work/s510.js','w').write(o)
