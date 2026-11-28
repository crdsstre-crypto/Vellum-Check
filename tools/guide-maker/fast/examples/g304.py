import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('cwsalon','[ภาพประกอบนิทาน สายๆ ในร้านเสริมสวย โทนชมพูพีช] เครื่องอบไอน้ำ กระจก คำพิพากษาชนะ ทนายบังคับคดีแทน',
 [bg('cw1','#ffe4e6','#fef3c7','#a87a7a'), '<g transform="translate(240 92)"><path d="M-20 -10a20 18 0 0 1 40 0v8h-40z" fill="#f9a8d4" stroke="#be185d" stroke-width="1.5"/><path d="M0 -2v40" stroke="#94a3b8" stroke-width="4"/><path d="M-14 38h28" stroke="#64748b" stroke-width="4"/></g>', mirror_ if False else '',
  SEAL(150,92,'ชนะคดี','#16a34a'), FLOOR('#881337',.07), DUST(9,304,'#fff',.5), vignette('cw1'), FG('l','#881337',.25)]+person('W',318,'#e11d48','#e8b896','happy'))
o+=P('cwoffice','[ภาพประกอบนิทาน บ่ายที่สำนักงานบังคับคดี โทนฟ้าเทา] คำขอรับชำระหนี้ ใบเสร็จ วงนับวันยื่น',
 [bg('cw2','#e0f2fe','#f1f5f9','#7a8a9a'), courtcounter(240,146,110), receipt(250,112), DAYRING(140,104,'30','วัน',.5,'#0369a1'),
  CHIP(200,90,'ยื่นในกำหนด','#0369a1'), FLOOR('#0c4a6e',.07), vignette('cw2')]+person('M',60,'#0369a1','#d8a882','calm'))
o+=P('cwhall','[ภาพประกอบนิทาน เช้าห้องพิจารณา โทนเขียวพาสเทล] ตาชั่ง ผู้โต้แย้ง 15 วัน เหรียญไหลแจกสมาชิก จิ้งจอกตุ๊กตา',
 [bg('cw3','#dcfce7','#f0fdf4','#7aa88a'), FOX(80,138,.6), scaletwo(240,120), MONEYFLOW(120,126,200,112,4,'#16a34a'), CROWD(210,70,3,'#16a34a') if False else '',
  STICKER(120,100,'15 วัน','#15803d',16), FLOOR('#14532d',.06), vignette('cw3')]+person('W',292,'#16a34a','#e8b896','calm'))
open('/home/claude/work/s304.js','w').write(o)
