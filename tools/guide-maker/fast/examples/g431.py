import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('caphone','[ภาพประกอบนิทาน เช้าในร้านขายมือถือ โทนฟ้าเทอร์ควอยซ์] ตู้โชว์มือถือ หูฟังโชว์ บันทึกข้อตกลงลงชื่อ',
 [bg('ca1','#ccfbf1','#ecfeff','#6aa8a0'), '<g transform="translate(250 120)"><rect x="-44" y="-20" width="88" height="40" rx="3" fill="#e0f2fe" fill-opacity=".7" stroke="#0f766e" stroke-width="2"/>'+''.join(f'<rect x="{-36+i*20}" y="-14" width="12" height="22" rx="3" fill="#1e293b"/>' for i in range(4))+'</g><g transform="translate(250 84)"><path d="M-10 6a10 10 0 0 1 20 0" stroke="#1e293b" stroke-width="3" fill="none"/><rect x="-13" y="4" width="6" height="9" rx="2" fill="#0f766e"/><rect x="7" y="4" width="6" height="9" rx="2" fill="#0f766e"/></g>',
  DOC(110,84,90,50,'บันทึกข้อตกลง',[('3 งวด × 1,500','#0f766e'),('ลงชื่อ ✓ ✓ ✓','#15803d')],'#0d9488'), FLOOR('#134e4a',.07), DUST(9,431,'#fff',.5), vignette('ca1'), FG('l','#134e4a',.25)]+person('W',318,'#0d9488','#e8b896','calm'))
o+=P('cacounter','[ภาพประกอบนิทาน บ่ายหน้าเคาน์เตอร์ร้าน โทนส้มอิฐ] สลิปโอนงวด 1 งวด 2 หายไป',
 [bg('ca2','#ffedd5','#fee2e2','#a8846a'), courtcounter(240,146,110), ''.join(f'<g transform="translate({214+i*30} 108)"><rect x="-12" y="-16" width="24" height="32" rx="2" fill="{"#fff" if i<1 else "none"}" stroke="{"#16a34a" if i<1 else "#dc2626"}" stroke-width="2" stroke-dasharray="{"0" if i<1 else "4 3"}"/><text y="4" text-anchor="middle" font-size="8" font-weight="900" fill="{"#16a34a" if i<1 else "#dc2626"}">{"✓" if i<1 else "?"}</text></g>' for i in range(3)), SEAL(140,96,'ผิดนัด','#dc2626',w=56),
  FLOOR('#7c2d12',.07), vignette('ca2')]+person('M',60,'#c2410c','#d8a882','worried'))
o+=P('cadone','[ภาพประกอบนิทาน เย็นที่สำนักงานอัยการ โทนเหลืองนวล] ตรายุติคดี แฟ้มสำนวนปิด กระต่ายตุ๊กตา',
 [bg('ca3','#fef9c3','#fefce8','#a89a6a'), COURTHOUSE(250,132), RABBIT(92,126,.65), SEAL(160,96,'ยุติคดี','#15803d',w=58),
  FLOOR('#713f12',.06), vignette('ca3')]+person('W',292,'#ca8a04','#e8b896','happy'))
open('/home/claude/work/s431.js','w').write(o)
