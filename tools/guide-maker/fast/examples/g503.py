import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F="font-family=\"sans-serif\" font-weight=\"900\""
FLAME=lambda x,y,s=1: f"<g transform=\"translate({x} {y}) scale({s})\"><path d=\"M0 0q-14 -14 -4 -30q2 10 8 8q-4 -14 8 -24q-2 14 8 20q8 10 -2 26z\" fill=\"#f97316\"/><path d=\"M4 -2q-6 -8 0 -16q2 6 6 4q2 8 -6 12z\" fill=\"#fde047\"/></g>"
SMOKE=lambda x,y: "".join(f"<circle cx=\"{x+i*6}\" cy=\"{y-i*9}\" r=\"{6+i*2}\" fill=\"#94a3b8\" opacity=\"{.45-i*.1:.2f}\"/>" for i in range(4))
CUPJ=lambda x,y,c: f'<g transform="translate({x} {y})"><path d="M0 0h18l-3 28h-12z" fill="{c}" opacity=".85"/><rect x="-1" y="-4" width="20" height="4" rx="1" fill="#f8fafc" stroke="#94a3b8"/><path d="M11 -4l4 -12" stroke="#22c55e" stroke-width="2"/></g>'
# ตอน 1 บ่ายร้อนที่ร้านน้ำผลไม้ปั่น โทนเหลืองมะนาวกับชมพูแตงโม แสงแดดจ้า สิ่งมีชีวิต: ผึ้งบินวนแก้ว
o+=P('fdcolor','[ภาพประกอบนิทาน บ่ายร้อนที่ร้านน้ำผลไม้ปั่น โทนเหลืองมะนาวกับชมพูแตงโม แสงแดดจ้า] แก้วน้ำผลไม้สีสด ขวดสีที่ไม่ใช่สีผสมอาหาร ถังน้ำแข็งสองถัง ผึ้งบิน หญิงเศร้าถือปฏิทิน (น้องม้วนขวา)',
 [bg('fd1','#fef9c3','#fce7f3','#b8a39a'), CUPJ(250,108,'#f43f5e'), CUPJ(274,108,'#f97316'), CUPJ(298,108,'#a855f7'), '<g transform="translate(228 96)"><rect width="14" height="26" rx="2" fill="#fff" stroke="#dc2626" stroke-width="1.6"/><text x="7" y="16" text-anchor="middle" font-size="8" fill="#dc2626" '+F+'>!</text></g>', '<g transform="translate(262 72)"><ellipse rx="4" ry="3" fill="#facc15"/><path d="M-2 -3l0 6M1 -3l0 6" stroke="#1e293b"/></g>',
  STEPCARD(122,70,'✗','สีไม่ใช่ของอาหาร','ปลอมปน → ม.236','#dc2626',ICON('mag','#dc2626')),
  STEPCARD(122,112,'✓','น้ำแข็งแยกถัง','กิน / แช่ของ','#16a34a',ICON('shield','#16a34a')),
  FLOOR('#a16207',.06), DUST(7,525,'#fff',.4), vignette('fd1'), FG('r','#a16207',.14)]+person('W',60,'#facc15','#e8b88f','worried'))
# ตอน 2 เช้าในตลาด หม้อแกงถูกแกล้ง โทนแดงพริกกับเขียวใบเตย แสงตลาดเช้า สิ่งมีชีวิต: นกกระจอกบนผ้าใบ
o+=P('fdpoison','[ภาพประกอบนิทาน เช้าในตลาด หม้อแกงถูกแกล้งเทน้ำยา โทนแดงพริกกับเขียวใบเตย แสงตลาดเช้า] หม้อแกง ขวดน้ำยาล้างจาน เส้นเวลาโทษ ป่วยสาหัส ตาย นกกระจอก ชายสวมแว่นหัวเราะถือโทรศัพท์ (น้องม้วนซ้าย)',
 [bg('fd2','#fee2e2','#dcfce7','#a8a29e'), awning(220,330,60,'#dc2626','#fef9c3'), '<g transform="translate(240 112)"><path d="M0 0h40v24q0 8 -8 8h-24q-8 0 -8 -8z" fill="#475569"/><ellipse cx="20" cy="0" rx="20" ry="4" fill="#ea580c"/></g><g transform="translate(286 104)"><rect width="10" height="22" rx="2" fill="#22d3ee"/><rect x="2" y="-5" width="6" height="6" fill="#0e7490"/></g>', bird(300,58,'#8a6a4a'),
  LETTER(56,66,'เจือของมีพิษในอาหาร',['ม.237 จำคุก 6 ด.–10 ปี','สาหัส → 1–10 ปี (ม.238)','ตาย → 5–20 ปี/ตลอดชีวิต'],'#dc2626',122,-2,1,12),
  FLOOR('#7f1d1d',.07), DUST(9,526,'#fff',.5), vignette('fd2')]+person('M',318,'#16a34a','#d8a882','smile',glasses=True))
# ตอน 3 เย็นหน้าร้านอาหาร ลูกค้าสำลัก โทนฟ้าอมเขียวกับส้ม แสงไฟหน้าร้าน สิ่งมีชีวิต: เต่าในอ่างบัวหน้าร้าน
o+=P('fdchoke','[ภาพประกอบนิทาน เย็นหน้าร้านอาหาร ลูกค้าสำลัก โทนฟ้าอมเขียวกับส้ม แสงไฟหน้าร้าน] ป้ายเบอร์ฉุกเฉิน 1669 การ์ดเห็นคนอันตรายต้องช่วย อ่างบัวมีเต่า หญิงมั่นใจ (น้องม้วนกลาง)',
 [bg('fd3','#ccfbf1','#ffedd5','#94a3a0'), SIGN(196,96,46,'1669','#dc2626','#fff',10), '<g transform="translate(222 132)"><ellipse rx="22" ry="7" fill="#0e7490" opacity=".5"/><circle cx="-8" cy="-3" r="5" fill="#86efac"/></g>', turtle(236,146),
  STEPCARD(10,84,'1','เห็นคนอันตราย','ช่วยได้ไม่เสี่ยง','#0f766e',ICON('mag','#0f766e')), ARROW(70,102,'#0f766e'),
  STEPCARD(80,84,'2','ยืนดูเฉย','ม.374 ผิด','#dc2626',ICON('shield','#dc2626')),
  NOTEBAR(10,128,'อย่างน้อยโทร 1669 + ช่วยเท่าที่ทำได้','#0f766e',134,-2),
  FLOOR('#134e4a',.07), DUST(7,527,'#fff',.45), vignette('fd3')]+person('W',292,'#14b8a6','#e8b88f','firm'))
open('/home/claude/work/s503.js','w').write(o)
