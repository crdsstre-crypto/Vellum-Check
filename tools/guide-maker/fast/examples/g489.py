import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
F='font-family="sans-serif" font-weight="900"'
def tellerwin(x,y,w=120):
    s=f'<g transform="translate({x} {y})"><rect width="{w}" height="70" rx="6" fill="#0f4c75" opacity=".92"/>'
    for i in range(3):
        s+=f'<rect x="{8+i*(w-16)/3}" y="8" width="{(w-16)/3-6}" height="40" rx="4" fill="#bde0fe" opacity=".55"/><rect x="{8+i*(w-16)/3}" y="8" width="{(w-16)/3-6}" height="40" rx="4" fill="none" stroke="#e0f2fe" stroke-width="1.2"/>'
    s+=f'<rect x="{w/2-22}" y="-12" width="44" height="12" rx="3" fill="#fbbf24"/><text x="{w/2}" y="-3" text-anchor="middle" font-size="7" fill="#78350f" {F}>ธนาคาร</text>'
    s+=f'<rect x="-6" y="52" width="{w+12}" height="20" rx="3" fill="#e2e8f0" stroke="#94a3b8"/><rect x="-6" y="52" width="{w+12}" height="4" fill="#cbd5e1"/></g>'
    return s
def bigbill(x,y,rot=-4):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><g filter="drop-shadow(0 3px 3px rgba(0,0,0,.18))"><rect width="104" height="54" rx="4" fill="#f0fdf4" stroke="#15803d" stroke-width="2"/></g>'
      f'<rect x="4" y="4" width="96" height="46" rx="2" fill="none" stroke="#86efac" stroke-dasharray="3 2"/>'
      f'<text x="10" y="16" font-size="6.5" fill="#15803d" {F}>ตั๋วแลกเงิน</text><text x="94" y="16" text-anchor="end" font-size="9.5" fill="#1e293b" {F}>฿180,000</text>'
      f'<text x="10" y="27" font-size="5.6" fill="#475569" {F}>ผู้จ่าย: ธนาคาร ข.</text>'
      f'<g transform="translate(62 38) rotate(-12)"><rect x="-30" y="-9" width="60" height="17" rx="3" fill="#fff" fill-opacity=".7" stroke="#dc2626" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7.2" fill="#dc2626" {F}>ไม่ยอมใช้เงิน</text></g>'
      f'<path d="M12 44q6 -6 10 0t10 0" stroke="#1e3a8a" stroke-width="1.4" fill="none"/><text x="12" y="51" font-size="4.6" fill="#64748b" {F}>16 พ.ย. · ลงชื่อ</text></g>')
# ตอน 1 เช้าที่เคาน์เตอร์ธนาคาร โทนฟ้าน้ำทะเลกับขาว แสงไฟเพดานนวล สิ่งมีชีวิต: ปลาทองในโหลบนเคาน์เตอร์
o+=P('bdrefuse','[ภาพประกอบนิทาน เช้าที่เคาน์เตอร์ธนาคาร โทนฟ้าน้ำทะเลกับขาว แสงไฟเพดานนวล] ช่องเคาน์เตอร์ธนาคาร ตั๋วแลกเงินมีตราบอกปัด ไม่ยอมใช้เงิน ลงวันที่ ลงชื่อ ปลาทองในโหล หญิงครุ่นคิด (น้องม้วนขวา)',
 [bg('bd1','#e0f2fe','#f8fafc','#94a3b8'), BEAM(150,70,'#fff',.25,3,40), tellerwin(214,58,112), fishbowl(312,104,.7),
  bigbill(110,74), SEAL(244,146,'ไม่ต้องทำคำคัดค้าน','#16a34a',-4,84), DAYRING(244,96,'4','วัน',.5,'#e11d48',15),
  FLOOR('#0c4a6e',.06), DUST(7,489,'#fff',.45), vignette('bd1'), FG('r','#0c4a6e',.14)]+person('W',60,'#0ea5e9','#e8b88f','worried'))
def letter(x,y,items):
    s=(f'<g transform="translate({x} {y}) rotate(-2)"><g filter="drop-shadow(0 3px 4px rgba(0,0,0,.18))"><rect width="112" height="70" rx="3" fill="#fffdf7"/></g>'
       f'<rect width="112" height="13" rx="3" fill="#ea580c"/><text x="56" y="9.5" text-anchor="middle" font-size="6.6" fill="#fff" {F}>แจ้งตั๋วขาดความเชื่อถือ</text>')
    for i,t in enumerate(items):
        cx=8+(i//4)*54; cy=22+(i%4)*12
        s+=(f'<circle cx="{cx+4}" cy="{cy}" r="4.4" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/><path d="M{cx+2} {cy}l1.6 1.8l3 -3.4" stroke="#16a34a" stroke-width="1.3" fill="none"/>'
            f'<text x="{cx+11}" y="{cy+2.2}" font-size="5.8" fill="#334155" {F}>{t}</text>')
    s+='<path d="M70 64q5 -5 9 0t9 0t9 -2" stroke="#1e3a8a" stroke-width="1.3" fill="none"/></g>'
    return s
REG=lambda x,y: f'<g transform="translate({x} {y}) rotate(8)"><rect width="46" height="30" rx="2" fill="#fef3c7" stroke="#b45309"/><path d="M0 0l23 16l23 -16" stroke="#b45309" fill="none"/><rect x="26" y="18" width="18" height="10" fill="#dc2626"/><text x="35" y="25.5" text-anchor="middle" font-size="5" fill="#fff" {F}>ลทบ.</text></g>'
# ตอน 2 บ่ายที่โต๊ะหลังร้านเครื่องครัว โทนส้มพีชกับเทาเหล็ก แสงบ่ายลอดม่านไม้ สิ่งมีชีวิต: แมวขาวนอนบนโต๊ะ
o+=P('bdletter','[ภาพประกอบนิทาน บ่ายที่โต๊ะหลังร้านเครื่องครัว โทนส้มพีชกับเทาเหล็ก แสงบ่ายลอดม่านไม้] หนังสือแจ้งตั๋วขาดความเชื่อถือมีเครื่องหมายถูก 7 รายการ ซองลงทะเบียนตอบรับ ปฏิทินนับ 4 วัน แมวขาวนอนบนโต๊ะ ชายสวมแว่นยืนมั่นใจ (น้องม้วนซ้าย)',
 [bg('bd2','#ffedd5','#fff7ed','#a8a29e'), BEAM(40,70,'#fff',.22,3,50), desk(46,128,190),
  letter(58,68,['วันที่ตั๋ว','ผู้สั่งจ่าย/ผู้จ่าย','จำนวนเงิน','วันถึงกำหนด','ผู้ทรง + สำนัก','วันบอกปัด','ข้อความไม่จ่าย']),
  REG(180,114), cat(250,130,'#f5f5f4',.5), CALGRID(180,64,'ภายใน 4 วัน',{16:'#dc2626',20:'#16a34a'},None,'#c2410c',46),
  FLOOR('#7c2d12',.07), DUST(9,490,'#fff',.5), vignette('bd2')]+person('M',318,'#ea580c','#d8a882','firm',glasses=True))
def stepcard(x,y,n,t,sub,c,ic):
    return (f'<g transform="translate({x} {y})"><g filter="drop-shadow(0 2px 3px rgba(0,0,0,.15))"><rect width="58" height="36" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/></g>'
      f'<circle cx="10" cy="10" r="6" fill="{c}"/><text x="10" y="13" text-anchor="middle" font-size="7" fill="#fff" {F}>{n}</text>{ic}'
      f'<text x="29" y="24" text-anchor="middle" font-size="6.6" fill="#1e293b" {F}>{t}</text><text x="29" y="32" text-anchor="middle" font-size="5.2" fill="#64748b" {F}>{sub}</text></g>')
IC_MAG='<g transform="translate(44 10) scale(.7)"><circle r="6" fill="#dcfce7" stroke="#047857" stroke-width="2"/><path d="M4 4l5 5" stroke="#047857" stroke-width="2.6"/></g>'
IC_PEN='<g transform="translate(46 10) rotate(35) scale(.7)"><rect x="-2.5" y="-9" width="5" height="16" rx="1" fill="#0369a1"/><path d="M-2.5 7l2.5 5l2.5 -5z" fill="#fde68a"/></g>'
IC_MAIL='<g transform="translate(40 4) scale(.75)"><rect width="16" height="12" rx="1.5" fill="#fee2e2" stroke="#dc2626" stroke-width="1.4"/><path d="M0 0l8 6l8 -6" stroke="#dc2626" stroke-width="1.4" fill="none"/></g>'
ARR=lambda x,y,c: f'<path d="M{x} {y}h8" stroke="{c}" stroke-width="2.2"/><path d="M{x+8} {y}l-4 -3v6z" fill="{c}"/>'
NOTE=lambda x,y: f'<g transform="translate({x} {y}) rotate(-2)"><rect width="132" height="15" rx="7.5" fill="#047857"/><text x="66" y="10" text-anchor="middle" font-size="5.3" fill="#fff" {F}>ไม่มีคำบอกปัด → ทำคำคัดค้าน + สำเนาตั๋วทั้งใบ</text></g>'
# ตอน 3 เย็นในสำนักงานทนาย โทนเขียวขวดกับทองเหลือง แสงโคมเขียว สิ่งมีชีวิต: นกทูแคนบนคอนข้างหน้าต่าง
o+=P('bdprotest','[ภาพประกอบนิทาน เย็นในสำนักงานทนาย โทนเขียวขวดกับทองเหลือง แสงโคมเขียว] การ์ด 3 ขั้น ตรวจตั๋ว ดูคำบอกปัด แจ้งใน 4 วัน แถบคำคัดค้านพร้อมสำเนาตั๋ว นกทูแคนบนคอน หญิงยิ้มโล่งใจ (น้องม้วนกลาง)',
 [bg('bd3','#d1fae5','#ecfdf5','#6b7f72'), window(200,50,46,38), lamp(256,40,'#facc15',10), lightpool(250,150,80,'#fef3c7',.35), TOUCAN(232,104,.42),
  stepcard(10,84,1,'ตรวจตั๋ว','ภายในประเทศ?','#047857',IC_MAG), ARR(70,102,'#047857'),
  stepcard(80,84,2,'คำบอกปัด','วันที่ + ลงชื่อ?','#0369a1',IC_PEN), ARR(140,102,'#047857'),
  stepcard(150,84,3,'แจ้งใน 4 วัน','ครบ 7 รายการ','#dc2626',IC_MAIL),
  NOTE(10,128),
  FLOOR('#064e3b',.07), DUST(7,491,'#fff',.45), vignette('bd3')]+person('W',292,'#059669','#e8b88f','smile'))
open('/home/claude/work/s489.js','w').write(o)
