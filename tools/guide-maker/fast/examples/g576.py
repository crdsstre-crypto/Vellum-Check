import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sglist','[ภาพประกอบนิทาน สายหน้าเกสต์เฮาส์ใหม่ ป้ายชื่อไม้แกะ ใบอนุญาตใส่กรอบที่ล็อบบี้ ป้ายราคาห้อง เลขห้องทองเหลือง โทนเขียวพาสเทลกับครีมไม้ แสงเช้าสดชื่น] ป้ายชื่อ กรอบใบอนุญาต ป้ายราคา นกน้อย หญิงติดป้าย (น้องม้วนขวา)',
 [bg('sg1','#dcfce7','#fef3c7','#a8a29e'), SIGN(230,60,80,'เกสต์เฮาส์','#15803d','#fff',9), '<g transform="translate(236 92)"><rect width="36" height="44" rx="2" fill="#fff" stroke="#ca8a04" stroke-width="3"/><rect x="6" y="8" width="24" height="3" fill="#a3a3a3"/><circle cx="18" cy="28" r="6" fill="#fde68a"/></g><g transform="translate(286 96)"><rect width="40" height="34" rx="3" fill="#fff" stroke="#15803d"/><text x="20" y="22" text-anchor="middle" font-size="10" fill="#15803d" font-family="sans-serif" font-weight="900">฿890</text></g>', DUCKLING(342,142,.42),
  LETTER(122,64,'ต้องจัดให้มี (ม.34)',['ป้ายชื่อ ใบอนุญาต เลขห้อง','ราคาห้องในที่เปิดเผย','ไม่ทำ ปรับ 1–5 หมื่น + รายวัน'],'#15803d',124,-2,1,12),
  FLOOR('#14532d',.05), DUST(7,3676,'#fff',.45), vignette('sg1'), FG('r','#14532d',.1)]+person('W',60,'#22c55e','#e8b88f','smile'))
o+=P('sgfire','[ภาพประกอบนิทาน บ่ายในห้องพัก หลังประตูติดแผนผังหนีไฟ ป้ายทางออกสีเขียวเรืองแสง เอกสารความรับผิดบนโต๊ะ โทนส้มอ่อนกับเขียวเรืองแสง แสงบ่ายผ่านม่าน] แผนผังหนีไฟ ป้ายทางออก เอกสาร ชายตรวจห้อง (น้องม้วนซ้าย)',
 [bg('sg2','#ffedd5','#ecfccb','#a8a29e'), '<g transform="translate(224 66)"><rect width="56" height="70" fill="#fff" stroke="#c2410c" stroke-width="2"/><path d="M8 60v-40h20v20h20" stroke="#16a34a" stroke-width="3" fill="none"/><path d="M44 36l6 4l-6 4" fill="#16a34a"/><circle cx="12" cy="56" r="4" fill="#dc2626"/></g>', '<g transform="translate(290 62)"><rect width="44" height="18" rx="2" fill="#16a34a"/><text x="22" y="13" text-anchor="middle" font-size="8" fill="#fff" font-family="sans-serif" font-weight="900">ทางออก</text></g>', '<rect x="296" y="112" width="32" height="22" fill="#fff" stroke="#57534e" transform="rotate(5 312 123)"/>',
  LETTER(56,64,'แผนผังหนีไฟ',['ทุกชั้น + ทุกห้อง (ม.34)','ป้ายทางออกฉุกเฉินทุกชั้น','เอกสารความรับผิด ม.675'],'#c2410c',146,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(6,3677,'#fff',.4), vignette('sg2')]+person('M',318,'#f97316','#d8a882','calm'))
o+=P('sgcover','[ภาพประกอบนิทาน เช้าสนามบิน ผู้จัดการลากกระเป๋า ปฏิทินวง 7 วัน และ 90 วัน หนังสือแจ้งนายทะเบียน 3 วัน โทนฟ้าท้องฟ้ากับขาวเมฆ แสงเช้าสว่าง] เครื่องบิน ปฏิทิน ซองแจ้ง หญิงรับไม้ต่อ (น้องม้วนกลาง)',
 [bg('sg3','#bfdbfe','#f8fafc','#a8a29e'), '<path d="M230 76l60 -16l6 6l-50 22z" fill="#e2e8f0" stroke="#64748b"/>', DAYRING(270,108,'7','วัน',.5,'#1d4ed8',14), DAYRING(316,98,'90','วัน',.9,'#7c3aed',16),
  STEPCARD(10,84,'1','ผู้จัดการลา > 7 วัน','คนแทน ≤ 90 วัน (ม.32)','#1d4ed8',ICON('clock','#1d4ed8')), ARROW(70,102,'#1d4ed8'),
  STEPCARD(80,84,'2','แจ้งนายทะเบียน','ภายใน 3 วัน','#7c3aed',ICON('mail','#7c3aed')),
  NOTEBAR(10,128,'ไม่แจ้ง ปรับ 5,000–20,000 (ม.54)','#1d4ed8',132,-2),
  FLOOR('#1e3a8a',.05), DUST(7,3678,'#fff',.45), vignette('sg3')]+person('W',292,'#3b82f6','#e8b88f','hopeful'))
open('/home/claude/work/s576.js','w').write(o)
