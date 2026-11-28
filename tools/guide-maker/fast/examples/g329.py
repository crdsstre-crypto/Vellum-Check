import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('tssauce','[ภาพประกอบนิทาน เช้าในครัวร้านซอสพริก โทนแดงส้ม] ขวดซอส สมุดสูตรล็อกกุญแจ',
 [bg('ts1','#fee2e2','#ffedd5','#a87a6a'), ''.join(f'<g transform="translate({214+i*22} 122)"><rect x="-7" y="-20" width="14" height="30" rx="4" fill="#dc2626"/><rect x="-4" y="-28" width="8" height="8" fill="#fbbf24"/><rect x="-6" y="-12" width="12" height="9" fill="#fff"/></g>' for i in range(4)),
  '<g transform="translate(140 104)"><rect x="-20" y="-24" width="40" height="48" rx="3" fill="#7f1d1d"/><text y="-8" text-anchor="middle" font-size="8" font-weight="900" fill="#fde68a">สูตรลับ</text><rect x="-8" y="2" width="16" height="13" rx="2" fill="#fbbf24"/><path d="M-5 2v-5a5 5 0 0 1 10 0v5" stroke="#fbbf24" stroke-width="2.5" fill="none"/></g>',
  FLOOR('#7f1d1d',.07), DUST(9,329,'#fff',.5), vignette('ts1'), FG('l','#7f1d1d',.25)]+person('M',318,'#dc2626','#d8a882','calm'))
o+=P('tscourt','[ภาพประกอบนิทาน บ่ายห้องพิจารณา โทนฟ้าคราม] คอกพยาน แชตพิมพ์ออกมา ลูกศรถามค้าน',
 [bg('ts2','#e0e7ff','#e0f2fe','#7a8aa8'), STAND(250,118,'#4338ca'), '<g transform="translate(150 100) rotate(-5)"><rect x="-24" y="-20" width="48" height="40" rx="4" fill="#fff" stroke="#4338ca"/><rect x="-18" y="-14" width="28" height="9" rx="4" fill="#dcfce7"/><rect x="-8" y="0" width="28" height="9" rx="4" fill="#e0e7ff"/><text x="-4" y="-7" font-size="6" font-weight="900" fill="#15803d">30%</text></g><path d="M178 100q24 -14 46 0" stroke="#4338ca" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/>',
  FLOOR('#1e1b4b',.07), vignette('ts2')]+person('W',60,'#4338ca','#e8b896','worried'))
o+=P('tsoffice','[ภาพประกอบนิทาน เย็นที่สำนักงานทนาย โทนเหลืองนวล] หนังสือขอรับรองข้อเท็จจริง วงนับ 7 วัน แฮมสเตอร์',
 [bg('ts3','#fef9c3','#fefce8','#a89a6a'), desk(240,134,100,'#a16207'), DAYRING(250,104,'7','วัน',.6,'#a16207',18), HAMSTER(92,126,.65),
  DOC(126,84,86,42,'ขอให้รับรอง',[('ไม่ตอบ = ยอมรับ','#dc2626')],'#ca8a04'), FLOOR('#713f12',.06), vignette('ts3')]+person('M',292,'#ca8a04','#d8a882','happy'))
open('/home/claude/work/s329.js','w').write(o)
