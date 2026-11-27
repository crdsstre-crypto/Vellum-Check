import sys; sys.path.insert(0,'/home/claude/tools')
from pk import *
o=''
o+=P('blbuild','[ภาพประกอบนิทาน เช้าที่ไซต์ก่อสร้างร้านอาหารบนที่ดินจำนองโทนส้มอิฐกับฟ้า แดดเช้า] โครงอาคารร้านใหม่ ป้ายจำนองปักที่ดิน กองอิฐ นกเกาะเสาเข็ม ชายเศร้าแอบมองสัญญาจำนอง (น้องม้วนซ้าย)',
 [bg('bla','#d6e8f8','#f6ece0','#a8826a',wall_tex=False), '<rect x="160" y="70" width="80" height="76" fill="none" stroke="#8a6a4a" stroke-width="3"/><path d="M160 96h80M160 120h80M200 70v76" stroke="#8a6a4a" stroke-width="2"/>',
  bricks(124), '<rect x="150" y="100" width="3" height="46" fill="#6a5a4a"/>', mortgagetag(152,96), bird(200,66,'#6a5a4a'),
  vignette('bla')]+person('M',318,'#c8603a','#d8a882','worried')+[
  arm('M304 140q-16-8-26-22','#c8603a','#d8a882',(278,118)), clipboard(266,100)])
o+=P('blpartial','[ภาพประกอบนิทาน บ่ายในธนาคารโทนเขียวขวดกับครีม แสงจากหน้าต่าง] โฉนดสองแปลงวางคู่ หนังสือขอปลดจำนองแปลงหนึ่ง ปากกา กระถางต้นไม้ หญิงหนักแน่นเขียนคำขอ (น้องม้วนขวา)',
 [bg('blb','#dceada','#f8f6ee','#3a5a3a'), window(150,62,52,40,('#f4fff4','#ffffff')),
  desk(110,124,132,'#3a5a3a'), lightpool(176,150,62,'#ffffff',.3),
  landtitle(130,94), landtitle(176,96,'ขอปลด'), plant(276,146,1.0,'#3a5a3a','#4a8a4a'),
  vignette('blb')]+person('W',60,'#3a5a3a','#e8b896','firm')+[
  arm('M76 140q24-8 46-26','#3a5a3a','#e8b896',(122,114))])
o+=P('blrent','[ภาพประกอบนิทาน เย็นหน้าร้านอาหารที่ปล่อยเช่าครึ่งหนึ่งให้ร้านกาแฟโทนเหลืองอุ่นกับน้ำเงิน ไฟห้อยหน้าร้าน] สองหน้าร้านติดกัน ซองค่าเช่า สุนัขนอนหน้าร้าน ชายสวมแว่นหัวเราะหมุนตัวถือโล่ (น้องม้วนกลาง)',
 [bg('blc','#f6e8c8','#e4ecf4','#3a4a6a',wall_tex=False), stringlights(64,'#ffd890',10,140,20),
  shopfront(14,74,60,72,'#c8603a'), shopfront(78,74,60,72,'#5a3e2e'), envelope(60,128,.8,'#fffaf0','#e6dccb',-6,'#4aa86a'),
  dog(226,152,'#c89a6a'),
  vignette('blc')]+person('M',292,'#3a4a6a','#d8a882','smile',True)+[
  arm('M278 140q-12-8-16-20','#3a4a6a','#d8a882',(262,120))])
open('/home/claude/work/s187.js','w').write(o)
