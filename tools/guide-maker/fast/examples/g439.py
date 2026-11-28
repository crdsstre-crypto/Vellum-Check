import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('bspottery','[ภาพประกอบนิทาน เช้าในโรงปั้นดินเผา โทนดินเผาอุ่น] โอ่งและแจกันดินเผา ตั๋วแลกเงิน 2 ฉบับ',
 [bg('bs1','#ffedd5','#fde68a','#a8806a'), ''.join(f'<g transform="translate({214+i*30} 126)"><path d="M-10 -20q-6 10 -4 22q4 10 14 10q10 0 14 -10q2 -12 -4 -22z" fill="{c}" stroke="#7c2d12"/><path d="M-6 -22h12" stroke="#7c2d12" stroke-width="2"/></g>' for i,c in enumerate(['#c2410c','#ea580c','#b45309','#9a3412'])), BILLSET(140,98,'#0369a1'),
  FLOOR('#7c2d12',.08), DUST(9,439,'#fff',.5), vignette('bs1'), FG('l','#7c2d12',.3)]+person('W',318,'#ea580c','#e8b896','calm'))
o+=P('bsport','[ภาพประกอบนิทาน บ่ายที่ท่าเรือ โทนฟ้าทะเล] ตู้คอนเทนเนอร์ เครื่องบิน ฉบับคู่ฉีกแยกทาง',
 [bg('bs2','#e0f2fe','#ecfeff','#7aa0a8',wall_tex=False), '<g transform="translate(250 124)"><rect x="-40" y="-18" width="80" height="30" fill="#0e7490"/><path d="M-32 -18v30M-20 -18v30M-8 -18v30M4 -18v30M16 -18v30M28 -18v30" stroke="#155e75" stroke-width="2"/></g><g transform="translate(250 72)"><path d="M-20 0h40l6 -4l-6 -2h-14l-10 -10h-6l6 10h-16l-4 -4h-4l2 6z" fill="#64748b"/></g>', BILLSET(140,102,'#dc2626'),
  FLOOR('#164e63',.07), vignette('bs2')]+person('M',60,'#0891b2','#d8a882','worried'))
o+=P('bspaid','[ภาพประกอบนิทาน เย็นที่ธนาคาร โทนเขียวมิ้นต์] ตราจ่ายแล้วทั้งสำรับ ลูกเป็ดตุ๊กตา',
 [bg('bs3','#d1fae5','#ecfeff','#6aa89a'), BILLSET(240,104,'#0f766e'), SEAL(250,108,'จ่ายแล้ว','#15803d',w=54), DUCK(92,124,.7),
  FLOOR('#134e4a',.06), vignette('bs3')]+person('W',292,'#0d9488','#e8b896','happy'))
open('/home/claude/work/s439.js','w').write(o)
