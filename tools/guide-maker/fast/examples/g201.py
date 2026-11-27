import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from pk import *; from fgk import *
def tray(x,y,c='#fbbf24'): return f'<g transform="translate({x} {y})"><rect x="-22" y="-4" width="44" height="8" rx="2" fill="#cbd5e1"/><rect x="-20" y="-10" width="40" height="7" rx="3" fill="{c}"/><circle cx="-12" cy="-12" r="3" fill="#f97316"/><circle cx="0" cy="-12" r="3" fill="#84cc16"/><circle cx="12" cy="-12" r="3" fill="#ef4444"/></g>'
def T(x,y,t,fs=5,c='#334155',a='start'): return f'<text x="{x}" y="{y}" text-anchor="{a}" font-size="{fs}" font-weight="900" fill="{c}" font-family="sans-serif">{t}</text>'
o=''
# ตอน 1 ตีห้า ครัวจัดเลี้ยง โทนสเตนเลสฟ้าเทากับไฟส้มเตา ไอน้ำ สิ่งมีชีวิต: นกบนขอบหน้าต่าง
o+=P('ckkitchenprep','[ภาพประกอบนิทาน ตีห้าในครัวจัดเลี้ยง โทนสเตนเลสฟ้าเทากับไฟส้ม ไอน้ำลอย] ถาดอาหาร 3 ถาดเตรียมไว้บนเคาน์เตอร์ หม้อใหญ่มีไอน้ำ มือถือเด้งข้อความลูกค้า "ขอยกเลิกงานพรุ่งนี้" นกเกาะขอบหน้าต่าง ชายใส่แว่นยกนิ้วโป้งทั้งที่หน้าเหนื่อย (น้องม้วนซ้าย)',
 [bg('ck1','#dbe4ee','#eef2f6','#94a3b8'), window(150,30,60,44,('#fed7aa','#fff7ed')), bird(196,72,'#7c5a3a'),
  '<rect x="120" y="120" width="170" height="60" fill="#cbd5e1"/><rect x="116" y="116" width="178" height="6" rx="2" fill="#e2e8f0"/>',
  tray(140,114), tray(196,114,'#fde68a'), '<g transform="translate(256 114)"><rect x="-16" y="-20" width="32" height="20" rx="3" fill="#64748b"/><rect x="-18" y="-22" width="36" height="4" rx="2" fill="#94a3b8"/>'+''.join(f'<path class="cm-bob" d="M{-8+i*8} -26q-4-8 0-14q4-6 0-12" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/>' for i in range(3))+'</g>',
  '<g class="cm-vibx"><rect x="166" y="80" width="58" height="18" rx="5" fill="#fff"/>'+T(195,92,'ขอยกเลิกงานพรุ่งนี้',5.2,'#dc2626','middle')+'</g>',
  lightpool(256,150,50,'#fdba74',.3), DUST(8,31,'#fff',.5), vignette('ck1'), FG('r','#334155',.45)]+person('M',318,'#0f766e','#d8a882','tired',glasses=True)+[
  arm('M304 140q-10-10-14-22','#0f766e','#d8a882',(290,118))])
# ตอน 2 บ่าย โต๊ะเจ้าของร้าน โทนชมพูกะปิกับครีม แดดเฉียง สิ่งมีชีวิต: ต้นมอนสเตอร่า
o+=P('ckpenaltydesk','[ภาพประกอบนิทาน บ่ายที่โต๊ะเจ้าของร้าน โทนชมพูกับครีม แดดเฉียงจากซ้าย] สัญญาวางบนโต๊ะ ข้อความ "ยกเลิก ปรับ 30%" ถูกวงไว้ ข้างกันมีบิลค่าวัตถุดิบที่ซื้อไปแล้ว เครื่องคิดเลข ต้นมอนสเตอร่า หญิงกอดอกโล่งใจ (น้องม้วนขวา)',
 [bg('ck2','#fce7f3','#fff7ed','#d6b8a8'), '<path d="M0 0l140 0l-60 146H0z" fill="#fff" opacity=".25"/>', plant(268,146,1.1,'#a16207','#15803d'),
  desk(110,130,150,'#c08457'),
  '<g filter="url(#wsh@K@)"><rect x="124" y="92" width="52" height="38" rx="3" fill="#fff"/></g>'+T(130,102,'สัญญาจัดเลี้ยง',4.8)+'<path d="M130 108h38M130 114h30" stroke="#cbd5e1" stroke-width="2"/><ellipse cx="150" cy="122" rx="22" ry="6" fill="none" stroke="#e11d48" stroke-width="1.4"/>'+T(150,124,'ยกเลิก ปรับ 30%',4.6,'#e11d48','middle'),
  '<rect x="184" y="100" width="34" height="30" rx="2" fill="#fef3c7"/>'+T(188,110,'บิลวัตถุดิบ',4.4,'#92400e')+'<path d="M188 116h24M188 122h18" stroke="#d6b36a" stroke-width="2"/>',
  '<rect x="224" y="108" width="20" height="22" rx="3" fill="#475569"/><rect x="227" y="111" width="14" height="5" fill="#a7f3d0"/>',
  DUST(9,32,'#fff',.55), vignette('ck2'), FG('l','#9d4b6b',.4)]+person('W',60,'#be185d','#e8b896','smile'))
# ตอน 3 ค่ำ ร้านปิดแล้ว โทนเขียวเสจกับไฟหลอดอุ่น สิ่งมีชีวิต: แมวส้มนอนบนเก้าอี้
o+=P('ckquotesheet','[ภาพประกอบนิทาน ค่ำหลังร้านปิด โทนเขียวเสจ ไฟหลอดอุ่นห้อย] ใบเสนอราคาใหม่แปะบนบอร์ด มีตารางยกเลิก: ก่อน 14 วันคืนเต็ม / 7 วันหัก 30% / 3 วันหักตามจริง แมวส้มนอนบนเก้าอี้ ชายปิดปากชี้ไปที่ปฏิทิน (น้องม้วนกลาง)',
 [bg('ck3','#dcebdc','#f0f5ea','#8fa98a'), lamp(110,0,'#fde68a',20), lamp(200,0,'#fde68a',14),
  '<g filter="url(#wsh@K@)"><rect x="36" y="58" width="112" height="86" rx="6" fill="#fff"/></g><rect x="36" y="58" width="112" height="14" rx="6" fill="#4d7c0f"/>'+T(92,68,'ใบเสนอราคา',6,'#fff','middle')
  +T(44,84,'มัดจำ 30% ยืนยันวันงาน',4.8)+'<rect x="44" y="90" width="96" height="44" rx="3" fill="#f7fee7"/>'
  +T(48,100,'ยกเลิกก่อน 14 วัน  คืนเต็ม',4.6,'#15803d')+T(48,112,'ก่อน 7 วัน  หัก 30%',4.6,'#a16207')+T(48,124,'ก่อน 3 วัน  หักตามจริง',4.6,'#b91c1c')+T(48,132,'+ แนบบิลวัตถุดิบ',4,'#64748b'),
  '<rect x="206" y="120" width="40" height="6" rx="2" fill="#8b5e3c"/><path d="M210 126v26M242 126v26" stroke="#8b5e3c" stroke-width="3"/>', cat(226,120,'#f59e0b',.8),
  lightpool(92,150,70,'#fef3c7',.35), DUST(10,33,'#fde68a',.6), vignette('ck3'), FG('r','#2f4a2f',.4)]+person('M',292,'#65a30d','#d8a882','calm')+[
  arm('M306 140q12-14 14-30','#65a30d','#d8a882',(320,110))])
open('/home/claude/work/s201.js','w').write(o)
