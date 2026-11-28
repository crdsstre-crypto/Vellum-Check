import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('csfood','[ภาพประกอบนิทาน เช้าในร้านอาหาร โทนส้มอบอุ่น] กราฟวงกลมแบ่งกลุ่มย่อย ร้านเล็กร้านใหญ่',
 [bg('cs1','#ffedd5','#fef3c7','#a8846a'), pie4(240,100) if True else '', CROWD(140,96,3,'#ea580c'), CROWD(140,122,2,'#0ea5e9'),
  FLOOR('#7c2d12',.07), DUST(9,303,'#fff',.5), vignette('cs1'), FG('l','#7c2d12',.25)]+person('M',318,'#ea580c','#d8a882','calm'))
o+=P('cssubstitute','[ภาพประกอบนิทาน บ่ายในศาล โทนฟ้าคราม] เก้าอี้โจทก์ว่าง สมาชิกขอเข้าแทน วงนับ 45 วัน',
 [bg('cs2','#e0f2fe','#e0e7ff','#7a8aa8'), emptychair(240,146), HANGTAG(256,92,'เข้าแทน','#38bdf8'), DAYRING(140,104,'45','วัน',.3,'#0284c7'),
  FLOOR('#0c4a6e',.07), vignette('cs2')]+person('W',60,'#0284c7','#e8b896','worried'))
o+=P('csmeeting','[ภาพประกอบนิทาน เย็นห้องประชุมสมาชิกกลุ่ม โทนเหลืองอ่อน] หนังสือคัดค้านยอมความ 30% ป้ายขีดฆ่า จิ้งจอกที่หน้าต่าง',
 [bg('cs3','#fef9c3','#fefce8','#a89a6a'), window(250,40), FOX(272,80,.6), TABLE(230,146,90,3,'#a16207'),
  DOC(110,90,90,44,'คัดค้านยอมความ',[('30% ต่ำเกินไป','#dc2626')],'#ca8a04'), FLOOR('#713f12',.06), vignette('cs3')]+person('M',292,'#ca8a04','#d8a882','calm'))
open('/home/claude/work/s303.js','w').write(o)
