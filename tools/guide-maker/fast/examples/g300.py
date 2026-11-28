import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('lccarwash','[ภาพประกอบนิทาน เช้าที่ร้านคาร์แคร์ โทนฟ้าน้ำ] ฟองโฟม รถ ที่ดินว่างข้างร้าน โฉนด',
 [bg('lc1','#cffafe','#e0f2fe','#6aa8b8',wall_tex=False), pickup(240,140), '<g opacity=".8">'+''.join(f'<circle cx="{220+i*12}" cy="{108-(i%2)*6}" r="{5+i%3}" fill="#fff"/>' for i in range(5))+'</g>', landdeed(130,110),
  FLOOR('#164e63',.07), DUST(9,300,'#fff',.5), vignette('lc1'), FG('l','#164e63',.25)]+person('M',318,'#0891b2','#d8a882','calm'))
o+=P('lclandoff','[ภาพประกอบนิทาน บ่ายสำนักงานที่ดิน โทนเหลืองมัสตาร์ด] คำขออายัด วงนับ 30 วัน ตรายาง',
 [bg('lc2','#fef9c3','#fef3c7','#a89a6a'), courtcounter(240,146,110), stamp(250,112,'#b45309'), DAYRING(140,104,'30','วัน',.2,'#ca8a04'),
  HANGTAG(196,96,'อายัด','#fbbf24'), FLOOR('#713f12',.07), vignette('lc2')]+person('W',60,'#ca8a04','#e8b896','worried'))
o+=P('lcredeem','[ภาพประกอบนิทาน เช้าที่ธนาคาร โทนเขียวหยก] หนังสือยืนยันไถ่ถอน โฉนดพร้อมตรา แพนด้าบนเคาน์เตอร์',
 [bg('lc3','#ccfbf1','#ecfeff','#6aa89a'), courtcounter(230,146,100), PANDA(250,116,.55), DOC(120,90,90,44,'หนังสือไถ่ถอน',[('จดทะเบียนได้','#15803d')],'#0f766e'),
  FLOOR('#134e4a',.06), vignette('lc3')]+person('M',292,'#0d9488','#d8a882','happy'))
open('/home/claude/work/s300.js','w').write(o)
