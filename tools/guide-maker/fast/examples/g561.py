import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('crfreeze','[ภาพประกอบนิทาน เช้าในร้านวัสดุก่อสร้าง กองปูนซีเมนต์ เหล็กเส้น ป้ายราคาตรึง กราฟลง ราชกิจจาฯ บนโต๊ะ โทนเทาซีเมนต์กับเหลืองเตือน แสงเช้าหม่น] ปูน เหล็กเส้น ป้ายตรึงราคา กราฟลง บีเวอร์ ชายอ่านประกาศ (น้องม้วนขวา)',
 [bg('cr1','#e5e7eb','#fef9c3','#a8a29e'), ''.join(f'<rect x="{228+i*26}" y="{112-(i%2)*8}" width="24" height="{30+(i%2)*8}" rx="3" fill="#d6d3d1" stroke="#78716c"/>' for i in range(3)), '<path d="M304 60v60M310 60v60M316 60v60" stroke="#57534e" stroke-width="3"/>', CHART(296,92) if False else '<path d="M226 70l16 8l14 -4l18 16" stroke="#dc2626" stroke-width="3" fill="none"/>', BEAVER(342,142,.38),
  LETTER(122,64,'วิกฤต ห้ามขึ้นค่าจ้าง',['รมต.ประกาศในราชกิจจาฯ (ม.33)','ขึ้นเงินประจำปีที่กำหนดแล้ว ได้','ฝ่าฝืน คุก ≤ 6 ด. (ม.138)'],'#a16207',124,-2,1,12),
  FLOOR('#44403c',.07), DUST(7,2161,'#fff',.4), vignette('cr1'), FG('r','#44403c',.12)]+person('M',60,'#eab308','#d8a882','worried'))
o+=P('crorder','[ภาพประกอบนิทาน บ่ายหน้าร้านที่ปิดประตูเหล็ก จดหมายคำสั่งรัฐมนตรีตราครุฑ พนักงานรอหน้าร้าน โทนน้ำเงินราชการกับส้มอิฐ แสงบ่ายจ้า] ประตูเหล็ก ซองคำสั่ง ตรา ป้ายเปิด หญิงรับคำสั่ง (น้องม้วนซ้าย)',
 [bg('cr2','#dbeafe','#fed7aa','#a8a29e'), '<g transform="translate(218 62)"><rect width="86" height="70" fill="#94a3b8"/>'+''.join(f'<path d="M0 {6+i*8}h86" stroke="#64748b" stroke-width="2"/>' for i in range(8))+'</g>', envelope(306,86,1,'#fff','#bfdbfe',6,'#1d4ed8'), SIGN(226,122,50,'เปิด','#16a34a','#fff',8),
  LETTER(56,64,'รมต.สั่งได้',['ปิดงาน → รับกลับ + จ่ายค่าจ้าง','หยุดงาน → กลับเข้าทำงาน (ม.35)','ฝ่าฝืน คุก ≤ 6 ด. (ม.140)'],'#1d4ed8',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,2162,'#fff',.4), vignette('cr2')]+person('W',318,'#3b82f6','#e8b88f','calm'))
o+=P('cremerg','[ภาพประกอบนิทาน เย็นในเมืองช่วงประกาศฉุกเฉิน ไฟไซเรนสีแดงน้ำเงิน แผงกั้นถนน ป้ายพื้นที่ฉุกเฉิน โทนม่วงพลบกับแดงไซเรน แสงไซเรนวาบ] แผงกั้น ไซเรน ป้ายฉุกเฉิน ชายมั่นคง (น้องม้วนกลาง)',
 [bg('cr3','#312e81','#fecaca','#57534e'), '<g transform="translate(226 108)"><rect width="100" height="10" fill="#fff"/>'+''.join(f'<rect x="{i*20}" width="10" height="10" fill="#dc2626"/>' for i in range(5))+'<path d="M8 10v24M92 10v24" stroke="#475569" stroke-width="3"/></g>', '<circle cx="262" cy="72" r="9" fill="#ef4444" opacity=".85"/><circle cx="286" cy="72" r="9" fill="#3b82f6" opacity=".85"/><rect x="254" y="80" width="40" height="8" rx="2" fill="#1f2937"/>', SIGN(300,58,60,'ฉุกเฉิน','#dc2626','#fff',8),
  STEPCARD(10,84,'1','กฎอัยการศึก/ฉุกเฉิน','รมต.ห้ามปิดงาน','#4338ca',ICON('shield','#4338ca')), ARROW(70,102,'#fecaca'),
  STEPCARD(80,84,'2','ฝ่าฝืน ม.36','คุก ≤ 2 ปี/4 หมื่น','#dc2626',ICON('clock','#dc2626')),
  NOTEBAR(10,128,'เช็กประกาศจริงก่อนตัดสินใจ','#4338ca',132,-2),
  FLOOR('#000',.14), DUST(7,2163,'#fecaca',.45), vignette('cr3')]+person('M',292,'#6366f1','#d8a882','calm'))
open('/home/claude/work/s561.js','w').write(o)
