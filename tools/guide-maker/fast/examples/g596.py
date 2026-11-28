import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('csfree','[ภาพประกอบนิทาน บูธแจกตัวอย่างครีมในห้าง ป้ายฟรีตัวใหญ่ ซองตัวอย่างเรียงในตะกร้า ธงราวสีพาสเทล โทนพีชกับเขียวมินต์ แสงห้างสว่าง] ป้ายฟรี ตะกร้าซอง ธงราว ลูกแมว หญิงยิ้มแจก (น้องม้วนขวา)',
 [bg('cs1','#ffedd5','#d1fae5','#a8a29e'), stringlights(56,'#fda4af',220,352,20), SIGN(240,64,62,'แจกฟรี!','#f97316','#fff',10,-4),
  '<g transform="translate(248 104)"><path d="M0 0h56l-6 30h-44z" fill="#d6a46b" stroke="#92400e" stroke-width="1.5"/>'+''.join(f'<rect x="{6+i*12}" y="-10" width="10" height="14" rx="2" fill="{c}" transform="rotate({(-8+i*5)} {11+i*12} -3)"/>' for i,c in enumerate(['#fbcfe8','#bbf7d0','#fde68a','#c7d2fe']))+'</g>', KITTEN(344,142,.4),
  LETTER(122,64,'ของฟรีก็คุ้มครอง',['ผู้ใช้โดยชอบแม้ไม่จ่าย ม.3','ถูกชวนก็เป็นผู้บริโภค','ขาย รวมให้เช่า/ชักชวน'],'#c2410c',124,-2,1,12),
  FLOOR('#7c2d12',.05), DUST(7,5961,'#fff',.4), vignette('cs1'), FG('r','#7c2d12',.12)]+person('W',60,'#fb923c','#e8b88f','happy'))
o+=P('csadvert','[ภาพประกอบนิทาน สตูดิโอรีวิวเล็กๆ ไฟวงแหวน ขาตั้งมือถือถ่ายคลิป ครีมวางบนโต๊ะ บับเบิลคำโฆษณา โทนม่วงนีออนกับชมพู แสงไฟวงแหวน] ไฟวงแหวน มือถือ ครีม ชายรีวิว (น้องม้วนซ้าย)',
 [bg('cs2','#f5d0fe','#fce7f3','#a8a29e'), '<g transform="translate(286 86)"><circle r="26" fill="none" stroke="#fff" stroke-width="7"/><circle r="26" fill="none" stroke="#e879f9" stroke-width="2"/><rect x="-7" y="-12" width="14" height="24" rx="2" fill="#1e293b"/><path d="M0 26v40M-12 66h24" stroke="#475569" stroke-width="2"/></g>', '<g transform="translate(236 118)"><rect width="16" height="20" rx="3" fill="#fbcfe8" stroke="#a21caf"/><rect x="2" y="-5" width="12" height="6" fill="#a21caf"/></g>',
  '<g transform="translate(236 62)"><rect width="44" height="18" rx="9" fill="#fff" stroke="#a21caf"/><text x="22" y="12" text-anchor="middle" font-size="7" fill="#a21caf" font-family="sans-serif" font-weight="900">ใช้แล้วขาว!</text></g>',
  LETTER(56,64,'เพจรีวิวก็เกี่ยว',['ผู้ประกอบกิจการโฆษณา ม.3','ภาพ เสียง ก็เป็นข้อความ','เจ้าของสื่อ โทษกึ่งหนึ่ง ม.50'],'#a21caf',146,-2,1,12),
  FLOOR('#581c87',.05), DUST(6,5962,'#fff',.4), vignette('cs2')]+person('M',318,'#c026d3','#d8a882','calm'))
o+=P('csspecial','[ภาพประกอบนิทาน โต๊ะเอกสารสองกองหนังสือกฎหมายเฉพาะกับกฎหมาย สคบ. ซ้อนเหลื่อมกัน ตราประทับชี้ขาด กล่องครีมมีเลขทะเบียน โทนเทาฟ้ากับทองอ่อน แสงสำนักงาน] หนังสือสองเล่ม ตราประทับ กล่องครีม ชายคิด (น้องม้วนกลาง)',
 [bg('cs3','#e2e8f0','#fef3c7','#57534e'), '<g transform="translate(160 74)"><rect width="38" height="50" rx="2" fill="#2563eb"/><text x="19" y="26" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif" font-weight="900">กฎหมาย</text><text x="19" y="36" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif" font-weight="900">เฉพาะ</text></g><g transform="translate(192 84)"><rect width="38" height="50" rx="2" fill="#16a34a"/><text x="19" y="30" text-anchor="middle" font-size="8" fill="#fff" font-family="sans-serif" font-weight="900">สคบ.</text></g>', SEAL(196,70,'ชี้ขาด','#b91c1c',-12,44),
  STEPCARD(10,84,'1','มีกฎหมายเฉพาะ','ใช้กฎหมายเฉพาะก่อน','#2563eb',ICON('shield','#2563eb')), ARROW(70,102,'#e2e8f0'),
  STEPCARD(80,84,'2','ไม่ซ้ำ/ไม่ขัด','ใช้ สคบ.ได้ด้วย ม.21','#16a34a',ICON('mag','#16a34a')),
  NOTEBAR(10,128,'หน่วยงานเถียงกัน กรรมการชี้ขาด','#b91c1c',156,-2),
  FLOOR('#000',.12), DUST(7,5963,'#e2e8f0',.45), vignette('cs3')]+person('M',292,'#64748b','#d8a882','calm'))
open('/home/claude/work/s596.js','w').write(o)
