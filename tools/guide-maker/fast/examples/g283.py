import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('uptailor','[ภาพประกอบนิทาน เช้าในร้านตัดเย็บ โทนชมพูกุหลาบ] จักรเย็บผ้า กองเสื้อทีม ป้ายค่าแรง 450 ขีดฆ่าเหลือ 250',
 [bg('up1','#ffe4e6','#fff7ed','#a87a7a'), shirtpile(230,128), tables(240,146) if False else desk(200,132,90,'#be123c'), skeins(150,118) if False else '',
  '<g transform="translate(130 70)"><rect width="74" height="34" rx="4" fill="#fff" stroke="#e11d48" stroke-width="2"/><text x="37" y="14" text-anchor="middle" font-size="10" font-weight="900" fill="#334155">450 บาท/วัน</text><path d="M8 10l58 0" stroke="#dc2626" stroke-width="2"/><text x="37" y="28" text-anchor="middle" font-size="10" font-weight="900" fill="#dc2626">จ่าย 250?</text></g>',
  CHIP(116,124,'12 คน','#e11d48'), FLOOR('#881337',.07), DUST(9,283,'#fff',.5), vignette('up1'), FG('l','#881337',.25)]+person('W',318,'#e11d48','#e8b896','worried'))
o+=P('upgold','[ภาพประกอบนิทาน บ่ายในร้านรับซื้อทอง โทนทองอุ่น] ตาชั่งทอง สร้อยบนถาด ป้ายราคารับซื้อวันนี้',
 [bg('up2','#fef3c7','#fef9c3','#a8946a'), courtcounter(230,146,110), balance(240,104) if False else hangscale(250,110), '<g transform="translate(200 116)"><ellipse rx="18" ry="5" fill="#a16207"/><path d="M-12 -2q12 -10 24 0" stroke="#facc15" stroke-width="3" fill="none"/></g>',
  DOC(104,90,86,50,'ราคาวันนี้',[('ทองรูปพรรณ ...','#334155'),('ถามความเข้าใจ ✓','#15803d')],'#ca8a04'),
  FLOOR('#713f12',.07), vignette('up2')]+person('M',60,'#ca8a04','#d8a882','calm'))
o+=P('upnotebook','[ภาพประกอบนิทาน เย็นที่โต๊ะในบ้าน โทนฟ้าครามอ่อน] สมุดจด ใบรับเงิน รายชื่อคนงาน นกฮูกตุ๊กตาบนชั้น',
 [bg('up3','#e0f2fe','#ede9fe','#7a8aa8'), lamp(90,58,'#fde047',10), lightpool(90,146,60,'#fef9c3',.3), OWL(70,100,.8,'#7c2d12'),
  STEPS(130,102,['ประกาศค่าจ้าง','รายชื่อ','ใบรับเงิน'],2,'#2563eb'), FLOOR('#1e3a8a',.06), vignette('up3')]+person('W',292,'#2563eb','#e8b896','happy'))
open('/home/claude/work/s283.js','w').write(o)
