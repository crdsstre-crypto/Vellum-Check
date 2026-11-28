import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('ctwho','[ภาพประกอบนิทาน สายในห้องแถวสองคูหา ผนังกลางถูกทุบเป็นช่องใหญ่ ฝุ่นปูน กันสาดเก่าครึ่งรื้อ ทางเท้า โทนเทาปูนกับส้มสนิม แสงฝุ่นลอย] ผนังทุบ กันสาด ฝุ่น บีเวอร์ ชายเจ้าของร้าน (น้องม้วนขวา)',
 [bg('ct1','#e7e5e4','#fed7aa','#a8a29e'), '<rect x="222" y="60" width="104" height="70" fill="#d6d3d1"/><rect x="258" y="76" width="34" height="54" fill="#fef3c7"/><path d="M258 76l6 -6l8 4l10 -6l10 8" stroke="#78716c" stroke-width="2" fill="none"/>', '<path d="M216 62h40l-4 10h-36z" fill="#b45309"/>', ''.join(f'<circle cx="{262+i*7}" cy="{90+(i%3)*10}" r="2" fill="#a8a29e"/>' for i in range(6)), BEAVER(342,142,.38),
  LETTER(122,64,'งานแบบไหนต้องขอ',['ทุบผนัง = ดัดแปลง (ม.21)','รื้อห่างทางเท้า < 2 ม. (ม.22)','อาคารสูง > 15 ม. ก็ต้องขอ'],'#b45309',124,-2,1,12),
  FLOOR('#44403c',.07), DUST(7,3878,'#fff',.5), vignette('ct1'), FG('r','#44403c',.12)]+person('M',60,'#f97316','#d8a882','worried'))
o+=P('ctdouble','[ภาพประกอบนิทาน บ่ายที่หน้างาน หมวกนิรภัยสีเหลือง สัญญาจ้างบนโต๊ะพับ แชตในมือถือ ตาชั่ง x2 โทนเหลืองเซฟตี้กับน้ำเงินกรม แสงบ่ายจ้า] หมวกนิรภัย สัญญา มือถือ หญิงเก็บหลักฐาน (น้องม้วนซ้าย)',
 [bg('ct2','#fef08a','#dbeafe','#a8a29e'), '<g transform="translate(230 70)"><path d="M0 18a20 18 0 0 1 40 0z" fill="#facc15" stroke="#a16207" stroke-width="2"/><rect x="-4" y="16" width="48" height="5" rx="2" fill="#ca8a04"/></g>', '<rect x="232" y="104" width="44" height="30" fill="#fff" stroke="#1e3a8a" stroke-width="2"/><rect x="238" y="112" width="30" height="3" fill="#93c5fd"/>', '<g transform="translate(296 92)"><rect width="26" height="44" rx="5" fill="#1f2937"/><rect x="3" y="6" width="20" height="30" fill="#e0f2fe"/></g>',
  LETTER(56,64,'ใครรับผิด',['ถือว่าเจ้าของ/ผู้รับเหมาทำ (ม.71)','ผู้ดำเนินการผิด โทษ x2 (ม.69)','เก็บหลักฐานว่าคนอื่นทำ'],'#1e3a8a',146,-2,1,12),
  FLOOR('#1e3a8a',.05), DUST(6,3879,'#fff',.4), vignette('ct2')]+person('W',318,'#facc15','#e8b88f','calm'))
o+=P('ctcompany','[ภาพประกอบนิทาน ค่ำในสำนักงานบริษัทรับเหมา โต๊ะประชุม ป้ายบริษัทจำกัด แผนงานบนกระดาน โทนน้ำเงินเข้มกับส้มทอง แสงโคมห้องประชุม] ป้ายบริษัท กระดาน โต๊ะ ชายกรรมการ (น้องม้วนกลาง)',
 [bg('ct3','#1e3a8a','#fed7aa','#57534e'), '<g transform="translate(226 62)"><rect width="76" height="20" rx="3" fill="#ca8a04"/><text x="38" y="14" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif" font-weight="900">บจก.รับเหมา</text></g>', '<rect x="232" y="90" width="64" height="40" fill="#fff" stroke="#475569"/><path d="M240 120l10 -12l10 6l12 -14l14 8" stroke="#ea580c" stroke-width="2" fill="none"/>', lamp(320,40,'#fde68a'),
  STEPCARD(10,84,'1','บริษัทผิด','กรรมการสั่ง/ละเว้น','#ea580c',ICON('shield','#ea580c')), ARROW(70,102,'#fed7aa'),
  STEPCARD(80,84,'2','กรรมการ','รับโทษด้วย (ม.72)','#1d4ed8',ICON('pen','#1d4ed8')),
  NOTEBAR(10,128,'ฝ่าฝืนคำสั่งระงับ ≤ 1 แสน + รายวัน','#ea580c',132,-2),
  FLOOR('#000',.14), DUST(7,3880,'#fed7aa',.45), vignette('ct3')]+person('M',292,'#f59e0b','#d8a882','calm'))
open('/home/claude/work/s578.js','w').write(o)
