import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('hsrooms','[ภาพประกอบนิทาน สายในโฮสเทลเมืองเก่า ผนังอิฐถูกทุบเป็นช่อง เตียงสองชั้น ค้อนและนั่งร้าน โทนอิฐส้มกับฟ้าคราม แสงลอดช่องผนัง] ผนังทุบ เตียงสองชั้น นั่งร้าน แมวน้อย ชายช่างคิด (น้องม้วนขวา)',
 [bg('hs1','#ffedd5','#dbeafe','#a8a29e'), '<rect x="222" y="62" width="62" height="64" fill="#fb923c"/>'+''.join(f'<path d="M222 {70+i*10}h62" stroke="#fed7aa" stroke-width="2"/>' for i in range(6)), '<path d="M244 82l10 6l-4 12l12 8" stroke="#1f2937" stroke-width="2" fill="none"/>', '<g transform="translate(292 78)"><rect width="40" height="6" fill="#0369a1"/><rect y="28" width="40" height="6" fill="#0369a1"/><path d="M2 0v58M38 0v58" stroke="#1e3a8a" stroke-width="3"/></g>', KITTEN(340,142,.4),
  LETTER(122,64,'เพิ่มห้อง เปลี่ยนประเภท',['ต้องได้อนุญาตก่อน (ม.22)','ฝ่าฝืน ปรับ ≤ 5 แสน (ม.50)','+ วันละ ≤ 20,000'],'#c2410c',124,-2,1,12),
  FLOOR('#7c2d12',.06), DUST(7,3272,'#fff',.4), vignette('hs1'), FG('r','#7c2d12',.12)]+person('M',60,'#f97316','#d8a882','worried'))
o+=P('hsname','[ภาพประกอบนิทาน บ่ายหน้าโฮสเทล ช่างปลดป้ายชื่อเก่า ป้ายใหม่พิงผนัง โทรศัพท์แอปจองห้อง โทนเขียวมะนาวกับชมพูนีออน แสงบ่ายสดใส] ป้ายเก่า ป้ายใหม่ มือถือ หญิงลังเล (น้องม้วนซ้าย)',
 [bg('hs2','#ecfccb','#fce7f3','#a8a29e'), '<g transform="translate(222 64) rotate(-8)"><rect width="64" height="20" rx="3" fill="#a8a29e"/><text x="32" y="14" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif" font-weight="900">ชื่อเดิม</text></g>', neon(240,104,'NEW','#ec4899') if 'neon' in globals() else '', '<g transform="translate(304 90)"><rect width="26" height="44" rx="5" fill="#1f2937"/><rect x="3" y="5" width="20" height="30" fill="#bef264"/></g>',
  LETTER(56,64,'ชื่อใหม่ ใบอนุญาตหาย',['เปลี่ยนชื่อต้องขอ ปรับ ≤ 1 แสน','ใบหาย → ใบแทนใน 30 วัน (ม.23)','ไม่ขอใบแทน ปรับ 1–5 หมื่น'],'#65a30d',146,-2,1,12),
  FLOOR('#365314',.05), DUST(6,3273,'#fff',.4), vignette('hs2')]+person('W',318,'#ec4899','#e8b88f','worried'))
o+=P('hssell','[ภาพประกอบนิทาน เย็นที่ระเบียงโฮสเทล สองคนจับมือ แฟ้มโอนใบอนุญาต กุญแจพวงใหญ่ โทนส้มทองพระอาทิตย์ตกกับม่วงอ่อน แสงเย็นอบอุ่น] กุญแจ แฟ้ม ระเบียงไม้ ชายส่งมอบ (น้องม้วนกลาง)',
 [bg('hs3','#fed7aa','#ede9fe','#a8a29e'), '<g transform="translate(236 70)"><circle r="12" fill="none" stroke="#ca8a04" stroke-width="4"/><path d="M8 8l22 22M24 24l6 -6M30 30l6 -6" stroke="#ca8a04" stroke-width="4"/></g>', '<rect x="290" y="96" width="44" height="32" rx="3" fill="#fff" stroke="#7c3aed" stroke-width="2"/><rect x="296" y="104" width="30" height="4" fill="#c4b5fd"/>',
  STEPCARD(10,84,'1','โอนใบอนุญาต','ต้องได้อนุญาต (ม.24)','#7c3aed',ICON('pen','#7c3aed')), ARROW(70,102,'#7c3aed'),
  STEPCARD(80,84,'2','บริษัทเลิก','ใบอนุญาตสิ้นอายุ (ม.26)','#c2410c',ICON('clock','#c2410c')),
  NOTEBAR(10,128,'ไม่มีใบอนุญาต คุก ≤ 1 ปี (ม.59)','#7c3aed',132,-2),
  FLOOR('#4c1d95',.05), DUST(7,3274,'#fff',.45), vignette('hs3')]+person('M',292,'#8b5cf6','#d8a882','smile'))
open('/home/claude/work/s572.js','w').write(o)
