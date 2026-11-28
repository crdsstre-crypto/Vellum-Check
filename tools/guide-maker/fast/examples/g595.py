import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('nwnamed','[ภาพประกอบนิทาน เช้าโต๊ะแบรนด์ปลั๊กพ่วง จอแล็ปท็อปแสดงประกาศเตือนพร้อมชื่อแบรนด์ หนังสือพิมพ์พับ ปลั๊กพ่วงขดบนโต๊ะ โทนเหลืองเตือนภัยกับเทาเข้ม แสงหน้าจอ] แล็ปท็อป ประกาศ ปลั๊ก เพนกวิน หญิงตกใจ (น้องม้วนขวา)',
 [bg('nw1','#fef9c3','#e5e7eb','#a8a29e'), '<g transform="translate(234 66)"><rect width="76" height="48" rx="3" fill="#1f2937"/><rect x="4" y="4" width="68" height="40" fill="#fef08a"/><path d="M20 14l8-0 -4 -8z" fill="#dc2626"/><text x="38" y="22" text-anchor="middle" font-size="7" fill="#7f1d1d" font-family="sans-serif" font-weight="900">ประกาศเตือน</text><rect x="12" y="28" width="52" height="8" fill="#dc2626"/><text x="38" y="34.5" text-anchor="middle" font-size="5.5" fill="#fff" font-family="sans-serif" font-weight="900">ชื่อแบรนด์เรา</text></g><path d="M226 116h92l-6 6h-80z" fill="#374151"/>',
  '<g transform="translate(296 126)"><rect width="30" height="10" rx="2" fill="#fff" stroke="#374151"/><path d="M0 5c-12 0-14 10-26 8" stroke="#374151" stroke-width="2" fill="none"/></g>', PENGUIN(346,142,.4),
  LETTER(122,64,'ประกาศระบุชื่อได้',['สคบ.แจ้งข่าวระบุชื่อ ม.20(2/2)','ตามแนวทางกรรมการ ม.10(3)','ผู้บริโภคมีสิทธิปลอดภัย ม.4'],'#a16207',124,-2,1,12),
  FLOOR('#374151',.05), DUST(7,5951,'#fff',.4), vignette('nw1'), FG('r','#374151',.12)]+person('W',60,'#eab308','#e8b88f','worried'))
o+=P('nwtest','[ภาพประกอบนิทาน ห้องแล็บทดสอบ ปลั๊กต่อกับเครื่องวัด เทอร์โมมิเตอร์สูง ขวดทดลอง ป้ายเลขล็อต โทนฟ้าห้องแล็บกับขาว แสงเย็นสะอาด] เครื่องวัด เทอร์โม ป้ายล็อต ชายครุ่นคิด (น้องม้วนซ้าย)',
 [bg('nw2','#e0f2fe','#f8fafc','#a8a29e'), THERMO(240,70,'85°','#ef4444'), '<g transform="translate(262 78)"><rect width="50" height="36" rx="4" fill="#334155"/><circle cx="16" cy="18" r="10" fill="#fff"/><path d="M16 18l6-6" stroke="#dc2626" stroke-width="2"/><rect x="30" y="8" width="14" height="6" fill="#22c55e"/><rect x="30" y="20" width="14" height="6" fill="#facc15"/></g>',
  SIGN(268,124,56,'ล็อต 2511-A','#fff','#0369a1',7,-2), '<g transform="translate(330 98)"><path d="M-6 0h12v12l8 20h-28l8-20z" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5"/></g>',
  LETTER(56,64,'การทดสอบสินค้า',['สคบ.ทดสอบ/พิสูจน์ได้ ม.20(2)','เก็บตัวอย่างไม่จ่าย ม.5(1)','จดรุ่น ล็อต จำนวนไว้'],'#0369a1',146,-2,1,12),
  FLOOR('#0c4a6e',.05), DUST(6,5952,'#fff',.4), vignette('nw2')]+person('M',318,'#0ea5e9','#d8a882','calm'))
o+=P('nwreply','[ภาพประกอบนิทาน เย็นหน้าร้าน ป้ายประกาศเปลี่ยนคืนล็อตที่มีปัญหา คลิปบอร์ดรายชื่อลูกค้า โทรโข่งเล็ก โทนเขียวมิ้นต์กับชมพูแซลมอน แสงเย็นอบอุ่น] ป้ายเปลี่ยนคืน คลิปบอร์ด โทรโข่ง หญิงมั่นใจ (น้องม้วนกลาง)',
 [bg('nw3','#d1fae5','#fecaca','#57534e'), '<g transform="translate(240 92)"><rect width="34" height="44" rx="3" fill="#fef3c7" stroke="#92400e" stroke-width="2"/><rect x="11" y="-4" width="12" height="7" rx="2" fill="#92400e"/>'+''.join(f'<path d="M6 {10+i*8}h22" stroke="#a8a29e"/>' for i in range(4))+'</g>', '<g transform="translate(300 104)"><path d="M0 0l22-10v26l-22-10z" fill="#f97316"/><rect x="-8" y="-3" width="8" height="10" fill="#ea580c"/></g>',
  STEPCARD(10,84,'1','ชี้แจงข้อเท็จจริง','สิทธิ์ตาม ม.18','#047857',ICON('pen','#047857')), ARROW(70,102,'#d1fae5'),
  STEPCARD(80,84,'2','เสนอทางชั่วคราว','เรียกคืนเฉพาะล็อต','#e11d48',ICON('shield','#e11d48')),
  NOTEBAR(10,128,'เรื่องเร่งด่วนอาจสั่งก่อนฟัง','#047857',140,-2),
  FLOOR('#000',.12), DUST(7,5953,'#d1fae5',.45), vignette('nw3')]+person('W',292,'#10b981','#e8b88f','calm'))
open('/home/claude/work/s595.js','w').write(o)
