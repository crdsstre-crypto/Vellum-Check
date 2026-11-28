import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('sctile','[ภาพประกอบนิทาน เช้าในร้านกระเบื้อง โทนเทาครีม] กองกระเบื้อง ใบส่งของ ป้ายทุนทรัพย์',
 [bg('sc1','#f5f5f4','#fef9c3','#9a8a7a'), '<g>'+''.join(f'<rect x="{210+i*8}" y="{100+i*6}" width="50" height="30" fill="#e7e5e4" stroke="#a8a29e"/>' for i in range(3))+'</g>', receipt(140,108),
  CHIP(140,84,'46,000 บาท','#57534e'), FLOOR('#44403c',.07), DUST(9,298,'#fff',.5), vignette('sc1'), FG('l','#44403c',.25)]+person('W',318,'#78716c','#e8b896','calm'))
o+=P('sccounter','[ภาพประกอบนิทาน สายๆ ที่ศาล โทนเขียวมิ้นต์] เคาน์เตอร์รับฟ้อง แถลงด้วยวาจา ค่าขึ้นศาลไม่เกิน 1,000',
 [bg('sc2','#ccfbf1','#f0fdf4','#6aa89a'), courtcounter(240,146,110), CHAT(110,96,['ขอฟ้องด้วยวาจาค่ะ','ได้ครับ'],'#0f766e') if False else STICKER(150,100,'≤ ฿1,000','#0f766e',20),
  ZOOM(230,96,'วาจา'), FLOOR('#134e4a',.07), vignette('sc2')]+person('M',60,'#0d9488','#d8a882','calm'))
o+=P('schall','[ภาพประกอบนิทาน บ่ายห้องพิจารณา โทนส้มพีช] ศาลถามพยาน ไมค์ แพนด้าตุ๊กตาที่หน้าต่าง',
 [bg('sc3','#ffedd5','#fef3c7','#a8846a'), window(60,40), PANDA(84,74,.6), desk(230,132,100,'#c2410c'), witnessmic(160,118) if False else '',
  STEPS(130,104,['ศาลถามก่อน','คู่ความถาม','พิพากษาวาจา'],0,'#ea580c'), FLOOR('#7c2d12',.06), vignette('sc3')]+person('W',292,'#ea580c','#e8b896','happy'))
open('/home/claude/work/s298.js','w').write(o)
