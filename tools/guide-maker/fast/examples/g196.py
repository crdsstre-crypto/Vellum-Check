import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from pk import *; from fgk import *
o=''
# ตอน 1 สาย คาเฟ่ช่วงลูกค้าแน่น โทนครีมกับเขียวเสจ แสงจากโคมแขวน สิ่งมีชีวิต: ต้นมอนสเตอร่าแขวน
o+=P('iscounterwork','[ภาพประกอบนิทาน สายในคาเฟ่ลูกค้าแน่น โทนครีมเขียวเสจ โคมไฟแขวน] เด็กฝึกงานคล้องป้ายชื่อ INTERN ยืนหลังเคาน์เตอร์รับออเดอร์ไม่หยุด กระดาษคิวยาว นาฬิกาบอกเวลาเกินกะ ต้นไม้แขวน หญิงเหนื่อยถือถาด (น้องม้วนซ้าย)',
 [bg('is1','#f5f0e1','#e3ecdf','#a89a7a'), lamp(170,30,'#fde68a'), lamp(240,30,'#fde68a'), wallclock(140,66),
  '<g transform="translate(206 48)"><path d="M0 0v10" stroke="#78350f"/><path d="M-10 10h20l-3 10h-14z" fill="#c8744a"/>'+''.join(f'<path d="M{i*5-8} 18q{i*4} 16 {i*7} 22" stroke="#3f8a5a" stroke-width="3" fill="none"/>' for i in range(4))+'</g>',
  '<g>'+''.join(f'<rect x="{176+i*14}" y="{80+(i%2)*4}" width="11" height="16" rx="1" fill="#fff" stroke="#cbd5e1"/>' for i in range(5))+'</g>',
  vignette('is1'), FG('r','#3a4a2a',.5)]+person('W',318,'#16a34a','#e8b896','tired')+[
  '<g transform="translate(318 122)"><rect x="-12" y="-6" width="24" height="12" rx="2" fill="#fff"/><text y="3" text-anchor="middle" font-size="5.6" font-weight="900" fill="#16a34a" font-family="sans-serif">INTERN</text></g>',
  arm('M304 140q-14-8-20-18','#16a34a','#e8b896',(284,122)), '<ellipse cx="270" cy="122" rx="18" ry="3" fill="#94a3b8"/><rect x="262" y="112" width="8" height="10" rx="2" fill="#fff"/><rect x="274" y="112" width="8" height="10" rx="2" fill="#fef3c7"/>',
  '<rect x="96" y="134" width="264" height="46" fill="#a47148"/><rect x="96" y="134" width="264" height="46" fill="url(#is1v@K@)"/><path d="M92 142h272l-6-8H98z" fill="#d6b48a"/><path d="M100 135h256" stroke="#fff" stroke-opacity=".6"/>'+''.join(f'<path d="M{130+i*44} 140v40" stroke="#000" stroke-opacity=".1"/>' for i in range(5)), '<g filter="url(#wsh@K@)"><rect x="120" y="100" width="44" height="34" rx="4" fill="#cbd5e1"/></g><rect x="120" y="100" width="44" height="8" rx="3" fill="#94a3b8"/><rect x="128" y="114" width="10" height="6" rx="2" fill="#334155"/><rect x="146" y="114" width="10" height="6" rx="2" fill="#334155"/>'+''.join(f'<rect x="{180+i*14}" y="122" width="10" height="12" rx="2" fill="#fff" stroke="#a16207"/>' for i in range(4))])
# ตอน 2 สี่ทุ่ม ร้านสะดวกซื้อโทนฟ้าเย็นกับขาวนีออน ไฟนีออนจ้า สิ่งมีชีวิต: แมลงเม่าบินรอบไฟ
o+=P('isteenshift','[ภาพประกอบนิทาน สี่ทุ่มในร้านสะดวกซื้อ โทนฟ้าเย็นนีออนขาว] นาฬิกาดิจิทัล 22:30 ป้ายห้ามเด็กต่ำกว่า 18 ทำงานหลังสี่ทุ่ม แมลงเม่าบินรอบหลอดไฟ ชายวัยรุ่นร้องไห้ยกมือปิดหน้า (น้องม้วนขวา)',
 [bg('is2','#0c2a4a','#1e3a5f','#3a4a5a'), '<rect x="100" y="28" width="150" height="5" rx="2" fill="#e0f2fe"/><ellipse cx="175" cy="34" rx="70" ry="8" fill="#e0f2fe" opacity=".25"/>', moth(150,46), moth(196,40),
  shopshelf(150,146,110), '<g transform="translate(220 68)"><rect x="-26" y="-12" width="52" height="22" rx="3" fill="#111"/><text y="4" text-anchor="middle" font-size="11" font-weight="900" fill="#f87171" font-family="monospace">22:30</text></g>',
  SIGN(220,92,60,'อายุ<18 ห้ามหลัง 22.00','#fef3c7','#b91c1c',5.2), vignette('is2'), FG('l','#020617',.7)]+person('M',60,'#0ea5e9','#d8a882','worried')+[
  arm('M76 140q10-20 6-36','#0ea5e9','#d8a882',(82,104))])
# ตอน 3 เช้า ห้องประชุมเล็กหลังร้าน โทนส้มพีชกับฟ้า แดดอ่อน สิ่งมีชีวิต: ปลากัดในโหล
o+=P('isagreement','[ภาพประกอบนิทาน เช้าในห้องเล็กหลังร้าน โทนพีชฟ้า แดดอ่อน] ข้อตกลงฝึกงาน 6 ข้อ ชุดปฐมพยาบาลบนผนัง ถุงมือกันร้อนข้างเครื่องชง โหลปลากัด ชายใส่แว่นยิ้มชี้ข้อตกลง (น้องม้วนกลาง)',
 [bg('is3','#fde5d0','#e0f0fb','#c0a080'), window(300,44,60,40),
  '<g filter="url(#wsh@K@)"><rect x="52" y="82" width="86" height="62" rx="4" fill="#fff"/></g><text x="95" y="94" text-anchor="middle" font-size="6.4" font-weight="900" fill="#c2410c" font-family="sans-serif">ข้อตกลงฝึกงาน</text>'+''.join(f'<path d="M60 {102+i*7}l2 2 3-4" stroke="#16a34a" stroke-width="1.4" fill="none"/><text x="68" y="{105+i*7}" font-size="4.8" font-weight="800" fill="#334155" font-family="sans-serif">{t}</text>' for i,t in enumerate(['ชั่วโมง/วัน','งานที่ห้ามทำ','เบี้ยเลี้ยง/ค่าจ้าง','ผู้ดูแล','ประกันอุบัติเหตุ','ลายเซ็นผู้ปกครอง'])),
  '<g transform="translate(330 96)"><rect x="-14" y="-10" width="28" height="22" rx="3" fill="#fff" stroke="#dc2626"/><path d="M-4 1h8M0-3v8" stroke="#dc2626" stroke-width="3"/></g>', '<rect x="224" y="130" width="40" height="16" rx="2" fill="#a47148"/>', fishbowl(244,126,.8),
  lightpool(270,150,60,'#fff6d8',.35), vignette('is3')]+person('M',292,'#ea580c','#d8a882','smile',True)+[
  arm('M278 140q-12-14-14-30','#ea580c','#d8a882',(264,110))])
open('/home/claude/work/s196.js','w').write(o)
