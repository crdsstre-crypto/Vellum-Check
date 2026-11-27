import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('tacurtain','[ภาพประกอบนิทาน บ่ายในร้านผ้าม่าน โทนม่วงลาเวนเดอร์] ผ้าม่านห้อย ใบแจ้งภาษีค้าง กุญแจโอนตึกถูกล็อก กิ้งก่าบนผนัง',
 [bg('ta1','#ede9fe','#fce7f3','#8a7aa8'), fabricroll(220,120,'#c4b5fd'), fabricroll(250,124,'#f9a8d4'), gecko(150,60,'#84cc16'), padlock(232,84),
  DOC(110,92,90,52,'ภาษีค้าง',[('2 ปี 38,000 บาท','#b91c1c'),('โอนไม่ได้ ม.59','#334155')],'#7c3aed'),
  FLOOR('#4c1d95',.07), DUST(9,278,'#fff',.5), vignette('ta1'), FG('l','#4c1d95',.25)]+person('W',318,'#7c3aed','#e8b896','worried'))
o+=P('tamunicipal','[ภาพประกอบนิทาน เช้าที่ห้องคลังเทศบาล โทนเหลืองมะนาว] หนังสือเตือนพฤษภาคม นาฬิกาทราย 90 วัน ป้ายยึดทรัพย์',
 [bg('ta2','#fef9c3','#ecfccb','#8a9a6a'), wallclock(250,50) if False else '', hourglass(250,110), seizetag(280,126), courtenvelope(150,124),
  STEPS(110,96,['เตือน พ.ค.','90 วัน','ยึดได้'],1,'#ca8a04'), FLOOR('#365314',.07), vignette('ta2')]+person('M',60,'#65a30d','#d8a882','calm',glasses=True))
o+=P('taauction','[ภาพประกอบนิทาน บ่ายห้องขายทอดตลาด โทนฟ้าน้ำทะเล] เงินชำระครบ ป้ายถอนการยึด ค้อนประมูลวางพัก เป็ดตัวน้อยข้างประตู',
 [bg('ta3','#cffafe','#f0fdf4','#6a9aa8'), judgebench(220,146) if False else desk(200,130,90,'#0e7490'), cash(150,118), MONEYFLOW(150,110,230,96,4,'#16a34a'), SEAL(250,90,'ถอนยึด','#16a34a'), duck(90,146),
  FLOOR('#164e63',.07), vignette('ta3')]+person('W',292,'#0891b2','#e8b896','happy'))
open('/home/claude/work/s278.js','w').write(o)
