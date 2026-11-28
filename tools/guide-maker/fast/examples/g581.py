import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('fpfence','[ภาพประกอบนิทาน สายหน้าร้านวัสดุเกษตร กระสอบปุ๋ยเรียง รั้วคอนกรีตใหม่ติดถนน ท่อระบายน้ำหน้าร้าน โทนเขียวไร่กับเทาคอนกรีต แสงแดดจัด] กระสอบปุ๋ย รั้ว ท่อระบายน้ำ ไก่ ชายชี้รั้ว (น้องม้วนขวา)',
 [bg('fp1','#dcfce7','#e5e7eb','#a8a29e'), SACKS(232,104) if 'SACKS' in globals() else '', '<g transform="translate(220 110)">'+''.join(f'<rect x="{i*22}" width="18" height="28" fill="#d6d3d1" stroke="#78716c"/>' for i in range(5))+'</g>', '<rect x="220" y="138" width="110" height="6" fill="#57534e"/>', bird(340,90) if 'bird' in globals() else '',
  LETTER(122,64,'รั้วติดถนน = อาคาร',['รั้ว กำแพง ประตู (ม.4(2))','ท่อระบายน้ำติดที่สาธารณะ','ต้องขอหรือแจ้ง (ม.21)'],'#15803d',124,-2,1,12),
  FLOOR('#14532d',.05), DUST(7,4181,'#fff',.4), vignette('fp1'), FG('r','#14532d',.12)]+person('M',60,'#22c55e','#d8a882','calm'))
o+=P('fpparking','[ภาพประกอบนิทาน บ่ายลานจอดรถกระบะหน้าร้าน เส้นจอดสีขาว ลูกศรทางเข้าออก กรวยจราจร โทนเทาแอสฟัลต์กับส้มกรวย แสงบ่ายร้อน] รถกระบะ เส้นจอด ลูกศร กรวย หญิงวัดพื้นที่ (น้องม้วนซ้าย)',
 [bg('fp2','#e7e5e4','#ffedd5','#78716c'), '<rect x="214" y="100" width="120" height="40" fill="#57534e"/>'+''.join(f'<path d="M{226+i*28} 104v32" stroke="#fff" stroke-width="2"/>' for i in range(4)), '<g transform="translate(236 104)"><rect width="36" height="16" rx="3" fill="#dc2626"/><rect x="20" y="-8" width="14" height="10" fill="#fca5a5"/><circle cx="8" cy="18" r="4" fill="#1f2937"/><circle cx="28" cy="18" r="4" fill="#1f2937"/></g>', '<path d="M300 86h24l-6 -6M324 86l-6 6" stroke="#facc15" stroke-width="3" fill="none"/>', ''.join(f'<path d="M{306+i*14} 140l5 -14l5 14z" fill="#f97316"/>' for i in range(2)),
  LETTER(56,64,'ลานจอด ทางเข้าออก',['ที่จอด/กลับรถ/ทางเข้าออก','สำหรับอาคารตาม ม.8(9)','นับเป็นอาคาร (ม.4(4))'],'#c2410c',146,-2,1,12),
  FLOOR('#000',.1), DUST(6,4182,'#fff',.4), vignette('fp2')]+person('W',318,'#f97316','#e8b88f','calm'))
o+=P('fpdemolish','[ภาพประกอบนิทาน เช้ากำแพงอิฐเก่าชิดถนน ตลับเมตรวัด 1.5 เมตร ป้ายเตือนกั้นทางเท้า ค้อนปอนด์วางพิง โทนแดงอิฐกับเหลืองเตือน แสงเช้าแรง] กำแพงเก่า ตลับเมตร ป้ายเตือน ชายตั้งใจ (น้องม้วนกลาง)',
 [bg('fp3','#fee2e2','#fef9c3','#a8a29e'), '<rect x="226" y="70" width="70" height="60" fill="#b45309"/>'+''.join(f'<path d="M226 {78+i*10}h70" stroke="#fde68a" stroke-width="1.5"/>' for i in range(5)), '<path d="M226 136h70" stroke="#2563eb" stroke-width="2"/><text x="261" y="146" text-anchor="middle" font-size="8" fill="#2563eb" font-family="sans-serif" font-weight="900">1.5 ม.</text>', '<path d="M320 98l14 24h-28z" fill="#facc15" stroke="#a16207" stroke-width="2"/>',
  STEPCARD(10,84,'1','รื้อห่างถนน < 2 ม.','ต้องขอ/แจ้ง (ม.22)','#b91c1c',ICON('pen','#b91c1c')), ARROW(70,102,'#b91c1c'),
  STEPCARD(80,84,'2','ร้านค้าผิด','โทษ x2 (ม.70)','#ca8a04',ICON('coin','#ca8a04')),
  NOTEBAR(10,128,'ยื่นรั้ว ลานจอด กำแพง ชุดเดียว','#b91c1c',132,-2),
  FLOOR('#7f1d1d',.05), DUST(7,4183,'#fff',.5), vignette('fp3')]+person('M',292,'#ef4444','#d8a882','calm'))
open('/home/claude/work/s581.js','w').write(o)
