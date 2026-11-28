# ชุด 232–236: ตัวช่วยใหม่ GLOW (แสงนุ่มรอบของสำคัญ) + SKYWIN (หน้าต่างบอกเวลา เช้า/บ่าย/ค่ำ)
from pk import K
def GLOW(x,y,r=22,c='#fff7cc',op=.55):
  return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity="{op*.35}"/><circle cx="{x}" cy="{y}" r="{r*.6}" fill="{c}" opacity="{op*.45}"/>'
def SKYWIN(x,y,t='day',w=50,h=40):
  sky={'day':('#bfe6fb','#eaf7ff'),'dusk':('#f9a8d4','#fde68a'),'night':('#1e1b4b','#4338ca')}[t]
  s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{sky[1]}"/><rect x="{x}" y="{y}" width="{w}" height="{h/2}" rx="3" fill="{sky[0]}"/>'
  if t=='night': s+=''.join(f'<circle cx="{x+6+i*9}" cy="{y+6+(i%2)*7}" r=".9" fill="#fff"/>' for i in range(5))+f'<circle cx="{x+w-10}" cy="{y+10}" r="5" fill="#fef3c7"/>'
  elif t=='dusk': s+=f'<circle cx="{x+w/2}" cy="{y+h*.62}" r="7" fill="#fb923c"/>'
  else: s+=f'<circle cx="{x+10}" cy="{y+9}" r="5" fill="#fde047"/>'
  return s+f'<path d="M{x+w/2} {y}v{h}M{x} {y+h/2}h{w}" stroke="#fff" stroke-width="2"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="none" stroke="#94a3b8" stroke-width="2"/>'
# ชุด 237–241: BILL (ตั๋วแลกเงินมีต้นขั้วรอยปรุ) + FLOW (ลูกศรประบอกเส้นทางเงิน/ตั๋ว ระหว่างคน)
def BILL(x,y,amt,rot=0,c='#0f766e',w=74,h=40,note=None,nc='#b91c1c'):
  s=f'<g transform="translate({x} {y}) rotate({rot})"><g filter="url(#wsh{K})"><rect width="{w}" height="{h}" rx="3" fill="#fffdf6"/></g><rect width="{w}" height="9" rx="3" fill="{c}"/>'
  s+=f'<text x="4" y="7" font-size="5" font-weight="900" fill="#fff" font-family="sans-serif">ตั๋วแลกเงิน</text><path d="M{w-14} 0v{h}" stroke="{c}" stroke-dasharray="2 2"/>'
  s+=f'<text x="6" y="{h/2+5}" font-size="7" font-weight="900" fill="#334155" font-family="sans-serif">{amt}</text><path d="M6 {h-6}q6-5 10 0t10-2" stroke="#1d4ed8" fill="none"/>'
  if note: s+=f'<text x="6" y="{h-10}" font-size="4.6" font-weight="900" fill="{nc}" font-family="sans-serif">{note}</text>'
  return s+'</g>'
def FLOW(x0,y0,x1,y1,c='#0f766e',lab=None):
  mx,my=(x0+x1)/2,min(y0,y1)-14
  s=f'<path d="M{x0} {y0}Q{mx} {my} {x1} {y1}" stroke="{c}" stroke-width="2" fill="none" stroke-dasharray="4 3" class="cm-blink"/><circle cx="{x1}" cy="{y1}" r="3" fill="{c}"/>'
  if lab: s+=f'<rect x="{mx-16}" y="{my-2}" width="32" height="10" rx="5" fill="#fff" stroke="{c}"/><text x="{mx}" y="{my+5.6}" text-anchor="middle" font-size="5" font-weight="900" fill="{c}" font-family="sans-serif">{lab}</text>'
  return s
# ชุด 242–246: STEPS (แถบขั้นตอนบอกว่าอยู่ขั้นไหน) + VOTE (ป้ายนับเสียง เห็นด้วย/ไม่เห็นด้วย) + TABLE (โต๊ะประชุมมีเก้าอี้)
def STEPS(x,y,labels,active=0,c='#7c3aed',gap=38):
  s=f'<path d="M{x} {y}h{gap*(len(labels)-1)}" stroke="#cbd5e1" stroke-width="3"/>'
  if active: s+=f'<path d="M{x} {y}h{gap*active}" stroke="{c}" stroke-width="3"/>'
  for i,t in enumerate(labels):
    on=i<=active; s+=f'<circle cx="{x+i*gap}" cy="{y}" r="5" fill="{c if on else "#fff"}" stroke="{c}" stroke-width="2"/>'
    s+=f'<text x="{x+i*gap}" y="{y+12}" text-anchor="middle" font-size="4.8" font-weight="900" fill="{c if on else "#64748b"}" font-family="sans-serif">{t}</text>'
  return s
def VOTE(x,y,yes,no,c='#16a34a'):
  return (f'<g transform="translate({x} {y})"><rect x="-22" y="-12" width="44" height="22" rx="6" fill="#fff" stroke="#cbd5e1"/>'
   f'<text x="-11" y="3" text-anchor="middle" font-size="8" font-weight="900" fill="{c}" font-family="sans-serif">✓{yes}</text>'
   f'<text x="11" y="3" text-anchor="middle" font-size="8" font-weight="900" fill="#dc2626" font-family="sans-serif">✗{no}</text></g>')
def TABLE(x,y=146,w=110,n=4,c='#a16207',chairs=('#64748b',)):
  s=f'<ellipse cx="{x}" cy="{y-12}" rx="{w/2}" ry="9" fill="{c}"/><rect x="{x-3}" y="{y-12}" width="6" height="12" fill="{c}"/>'
  for i in range(n):
    cx=x-w/2+12+i*(w-24)/max(n-1,1); cc=chairs[i%len(chairs)]
    s=f'<rect x="{cx-7}" y="{y-34}" width="14" height="16" rx="3" fill="{cc}"/>'+s
  return s
# ชุด 247–251: ZOOM (แว่นขยายซูมตัวเลขสำคัญบนเอกสาร) + SEAL (ตรายางใหญ่เอียง เช่น อนุมัติ/จดแล้ว)
def ZOOM(x,y,t,r=17,c='#0f172a',fc='#b91c1c'):
  return (f'<g filter="url(#wsh{K})"><circle cx="{x}" cy="{y}" r="{r}" fill="#fff"/></g><circle cx="{x}" cy="{y}" r="{r}" fill="#f8fafc" stroke="{c}" stroke-width="3"/>'
   f'<path d="M{x+r*.7} {y+r*.7}l9 9" stroke="{c}" stroke-width="5" stroke-linecap="round"/>'
   f'<text x="{x}" y="{y+3}" text-anchor="middle" font-size="{max(6.5,r*.42):.1f}" font-weight="900" fill="{fc}" font-family="sans-serif">{t}</text>')
def SEAL(x,y,t,c='#dc2626',rot=-12,w=56):
  return (f'<g transform="translate({x} {y}) rotate({rot})" opacity=".85"><rect x="{-w/2}" y="-10" width="{w}" height="20" rx="4" fill="none" stroke="{c}" stroke-width="2.4"/>'
   f'<rect x="{-w/2+3}" y="-7" width="{w-6}" height="14" rx="3" fill="none" stroke="{c}" stroke-width=".8"/><text y="3.4" text-anchor="middle" font-size="8" font-weight="900" fill="{c}" font-family="sans-serif">{t}</text></g>')
# ชุด 252–256: CHAT (มือถือมีบับเบิลแชตซ้าย/ขวา อ่านได้) + CHIP (ป้ายแท็กเล็ก เช่น #โฆษณา ®)
def CHAT(x,y,msgs,w=70,h=96,c='#0f172a'):
  s=f'<g filter="url(#wsh{K})"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{c}"/></g><rect x="{x+4}" y="{y+8}" width="{w-8}" height="{h-14}" rx="5" fill="#f1f5f9"/>'
  yy=y+16
  for side,t in msgs:
    bw=min(w-14,len(t)*3.1+10); bx=x+7 if side=='l' else x+w-7-bw; bc='#fff' if side=='l' else '#bbf7d0'
    s+=f'<rect x="{bx}" y="{yy}" width="{bw}" height="11" rx="5" fill="{bc}" stroke="#cbd5e1" stroke-width=".5"/><text x="{bx+5}" y="{yy+7.6}" font-size="5" font-weight="900" fill="#334155" font-family="sans-serif">{t}</text>'
    yy+=15
  return s
def CHIP(x,y,t,c='#7c3aed',fg='#fff'):
  w=len(t)*4.2+12
  return f'<rect x="{x}" y="{y-7}" width="{w}" height="13" rx="6.5" fill="{c}"/><text x="{x+w/2}" y="{y+2.4}" text-anchor="middle" font-size="6.5" font-weight="900" fill="{fg}" font-family="sans-serif">{t}</text>'
# ชุด 257–261: HANGTAG (ป้ายแขวนแกว่งได้ บอกราคา/สถานะ) + RIBBON (ริบบิ้นแบนเนอร์ปลายแฉก)
def HANGTAG(x,y,t,c='#f59e0b',fg='#1f2937'):
  w=len(t)*4.4+14
  return (f'<g class="cm-bob"><path d="M{x} {y-14}v8" stroke="#64748b" stroke-width="1"/><g transform="translate({x} {y}) rotate(-6)">'
   f'<path d="M{-w/2} -6h{w-6}l6 6-6 6h{-(w-6)}z" fill="{c}"/><circle cx="{w/2-5}" cy="0" r="1.6" fill="#fff"/>'
   f'<text x="-2" y="2.6" text-anchor="middle" font-size="6.5" font-weight="900" fill="{fg}" font-family="sans-serif">{t}</text></g></g>')
def RIBBON(x,y,t,c='#7c3aed',w=None):
  w=w or len(t)*4.6+20
  return (f'<path d="M{x-w/2-8} {y-6}h8v12h-8l4-6z" fill="{c}" opacity=".7"/><path d="M{x+w/2} {y-6}h8l-4 6 4 6h-8z" fill="{c}" opacity=".7"/>'
   f'<rect x="{x-w/2}" y="{y-8}" width="{w}" height="16" rx="2" fill="{c}"/><text x="{x}" y="{y+3}" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="sans-serif">{t}</text>')
# ชุด 262–266: ROUTE (เส้นทางมีหมุดและชื่อจุด บอกเส้นทางขนส่ง) + CRACK (รอยแตกบนของ)
def ROUTE(pts,labels=None,c='#0f766e'):
  d='M'+' L'.join(f'{x} {y}' for x,y in pts)
  s=f'<path d="{d}" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="{d}" stroke="{c}" stroke-width="2.4" fill="none" stroke-dasharray="5 3" stroke-linejoin="round"/>'
  for i,(x,y) in enumerate(pts):
    s+=f'<path d="M{x} {y}c-5-6-6-9-6-11a6 6 0 0 1 12 0c0 2-1 5-6 11z" fill="{c}"/><circle cx="{x}" cy="{y-11}" r="2.2" fill="#fff"/>'
    if labels and i<len(labels) and labels[i]: s+=f'<text x="{x}" y="{y+9}" text-anchor="middle" font-size="6.5" font-weight="900" fill="{c}" font-family="sans-serif">{labels[i]}</text>'
  return s
def CRACK(x,y,s=1,c='#334155'):
  return f'<path d="M{x} {y}l{4*s} {6*s}l{-3*s} {5*s}l{5*s} {6*s}M{x+4*s} {y+6*s}l{6*s} {2*s}" stroke="{c}" stroke-width="1.4" fill="none"/>'
# ชุด 267–271: TAPE (เทปกั้นลายทแยงมีข้อความ) + STICKER (สติกเกอร์วงกลมขอบหยัก เช่น ยึดแล้ว/ตรวจแล้ว)
def TAPE(x0,x1,y,t,c='#facc15',fg='#1f2937'):
  w=x1-x0; s=f'<rect x="{x0}" y="{y-6}" width="{w}" height="12" fill="{c}"/>'+''.join(f'<path d="M{x0+i*12} {y+6}l8-12" stroke="{fg}" stroke-width="3" opacity=".25"/>' for i in range(int(w/12)))
  return s+f'<rect x="{x0+w/2-len(t)*2.4-4}" y="{y-5}" width="{len(t)*4.8+8}" height="10" fill="{c}"/><text x="{x0+w/2}" y="{y+2.6}" text-anchor="middle" font-size="6.5" font-weight="900" fill="{fg}" font-family="sans-serif">{t}</text>'
def STICKER(x,y,t,c='#dc2626',r=13):
  import math
  pts=' '.join(f'{x+(r+(2 if i%2 else 0))*math.cos(i*math.pi/10):.1f},{y+(r+(2 if i%2 else 0))*math.sin(i*math.pi/10):.1f}' for i in range(20))
  return f'<polygon points="{pts}" fill="{c}"/><circle cx="{x}" cy="{y}" r="{r-3}" fill="none" stroke="#fff" stroke-width=".8"/><text x="{x}" y="{y+2.6}" text-anchor="middle" font-size="6.5" font-weight="900" fill="#fff" font-family="sans-serif">{t}</text>'
# GOAT: แพะน่ารักมีหน้า เขา หู เครา คาบผักสลัด (แก้ตามที่ผู้ใช้ขอ ชุด 265)
def GOAT(x,y,s=1,flip=False):
  f=-1 if flip else 1
  legs=''.join(f'<rect x="{lx}" y="10" width="7" height="20" rx="3" fill="#f5f0e6"/><rect x="{lx}" y="27" width="7" height="5" rx="2" fill="#57534e"/>' for lx in (-22,-11,8,18))
  return (f'<g transform="translate({x} {y}) scale({s*f} {s})"><ellipse cx="0" cy="34" rx="34" ry="5" fill="#000" opacity=".12"/>'+legs+
   '<path d="M-30 -6q-8-8-4-14" stroke="#e7e2d8" stroke-width="5" stroke-linecap="round" fill="none"/>'
   '<ellipse cx="0" cy="0" rx="32" ry="18" fill="#fffdf8" stroke="#d6cfc2" stroke-width="1.5"/><ellipse cx="-6" cy="-4" rx="14" ry="7" fill="#fff" opacity=".7"/>'
   '<path d="M20 -8q10-10 14-22" stroke="#fffdf8" stroke-width="14" stroke-linecap="round" fill="none"/><g transform="translate(36 -30)">'
   '<path d="M-6 -10q-6-14 4-18" stroke="#a8a29e" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M4 -10q2-14 12-14" stroke="#a8a29e" stroke-width="4" stroke-linecap="round" fill="none"/>'
   '<ellipse cx="-14" cy="-4" rx="8" ry="4" fill="#f5d0c5" transform="rotate(-25 -14 -4)"/><ellipse cx="16" cy="-4" rx="8" ry="4" fill="#f5d0c5" transform="rotate(25 16 -4)"/>'
   '<ellipse cx="0" cy="2" rx="13" ry="15" fill="#fffdf8" stroke="#d6cfc2" stroke-width="1.5"/><ellipse cx="0" cy="11" rx="9" ry="7" fill="#fde7e1"/>'
   '<circle cx="-5" cy="-1" r="2.6" fill="#1f2937"/><circle cx="5" cy="-1" r="2.6" fill="#1f2937"/><circle cx="-4.2" cy="-1.8" r=".9" fill="#fff"/><circle cx="5.8" cy="-1.8" r=".9" fill="#fff"/>'
   '<circle cx="-9" cy="5" r="2.4" fill="#fda4af" opacity=".7"/><circle cx="9" cy="5" r="2.4" fill="#fda4af" opacity=".7"/><path d="M-2 10q2 2 4 0" stroke="#9f6b5a" stroke-width="1.2" fill="none"/>'
   '<path d="M-3 17q3 9 6 0z" fill="#e7e2d8"/><path d="M4 13q10-6 16 2q-4 8-14 4z" fill="#4ade80" stroke="#16a34a" stroke-width="1"/></g></g>')
# ชุด 272–276: MONEYFLOW (เหรียญไหลตามลูกศร บอกเงินไหลไปทางไหน) + SIREN (ไฟไซเรนกระพริบ)
def MONEYFLOW(x0,y0,x1,y1,n=4,c='#16a34a'):
  s=f'<path d="M{x0} {y0}L{x1} {y1}" stroke="{c}" stroke-width="2" stroke-dasharray="3 3"/><path d="M{x1} {y1}l-7 -4v8z" fill="{c}" transform="rotate(0)"/>'
  for i in range(n):
    t=(i+.5)/n; x=x0+(x1-x0)*t; y=y0+(y1-y0)*t
    s+=f'<circle cx="{x:.0f}" cy="{y:.0f}" r="4.4" fill="#facc15" stroke="#a16207"/><text x="{x:.0f}" y="{y+2:.0f}" text-anchor="middle" font-size="5" font-weight="900" fill="#713f12" font-family="sans-serif">฿</text>'
  return s
def SIREN(x,y,c='#ef4444'):
  return (f'<rect x="{x-9}" y="{y}" width="18" height="5" rx="1" fill="#334155"/><path d="M{x-7} {y}q0-12 7-12t7 12z" fill="{c}"/>'
   f'<g class="cm-blink"><path d="M{x-14} {y-10}l-6-3M{x+14} {y-10}l6-3M{x} {y-16}v-6" stroke="{c}" stroke-width="2"/></g>')

def BELL(x,y,s=1):
  # กริ่งเคาน์เตอร์โรงแรม มีประกายและเงาสะท้อน
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="12" rx="20" ry="4" fill="#000" opacity=".15"/>'
   '<rect x="-19" y="6" width="38" height="6" rx="3" fill="#78716c"/><path d="M-15 6a15 15 0 0 1 30 0z" fill="#fbbf24"/>'
   '<path d="M-9 1a10 12 0 0 1 7-8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".8"/>'
   '<rect x="-2" y="-14" width="4" height="6" fill="#a16207"/><circle cx="0" cy="-15" r="4" fill="#fde68a" stroke="#a16207"/>'
   '<path d="M20 -16l5-4M24 -8h6M-20 -16l-5-4" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></g>')

def CRANE(x,y,s=1,c='#f59e0b'):
  # ทาวเวอร์เครน โครงถัก แขนยื่น ตะขอแขวนคาน
  mast=''.join(f'<path d="M-5 {yy}l10 -12M5 {yy}l-10 -12" stroke="{c}" stroke-width="1.4"/>' for yy in range(0,-108,-12))
  jib=''.join(f'<path d="M{xx} -116l6 -6l6 6" stroke="{c}" stroke-width="1.2" fill="none"/>' for xx in range(-30,72,12))
  return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-6" y="-108" width="12" height="108" fill="none" stroke="{c}" stroke-width="2"/>'+mast+
   f'<rect x="-32" y="-122" width="106" height="6" fill="none" stroke="{c}" stroke-width="2"/>'+jib+
   f'<rect x="-30" y="-116" width="14" height="10" fill="#57534e"/><rect x="-4" y="-132" width="12" height="12" rx="2" fill="{c}"/><rect x="-2" y="-130" width="8" height="5" fill="#bae6fd"/>'
   f'<path d="M58 -116v46" stroke="#334155" stroke-width="1.2"/><path d="M55 -70h6l-3 6z" fill="#334155"/><rect x="40" y="-62" width="38" height="6" fill="#94a3b8"/></g>')

def OWL(x,y,s=1,c='#a16207'):
  # นกฮูกตัวเล็ก ขนอก ตากลมแวว แก้ม เท้าเกาะกิ่ง
  feathers=''.join(f'<path d="M{fx} {fy}q3 3 6 0" stroke="#78350f" stroke-width="1" fill="none" opacity=".5"/>' for fx,fy in ((-6,6),(0,6),(-3,11),(3,11),(-6,16),(0,16)))
  return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-18 24h36" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>'
   f'<ellipse cx="0" cy="8" rx="13" ry="16" fill="{c}"/><ellipse cx="0" cy="12" rx="8" ry="10" fill="#fde68a"/>'+feathers+
   f'<path d="M-12 -4l-3 -10l8 5zM12 -4l3 -10l-8 5z" fill="{c}"/><circle cx="-5" cy="-1" r="5.5" fill="#fff"/><circle cx="5" cy="-1" r="5.5" fill="#fff"/>'
   '<circle cx="-4.5" cy="-1" r="3" fill="#1c1917"/><circle cx="5.5" cy="-1" r="3" fill="#1c1917"/><circle cx="-3.5" cy="-2.2" r="1" fill="#fff"/><circle cx="6.5" cy="-2.2" r="1" fill="#fff"/>'
   '<path d="M-1.5 4l1.5 3l1.5 -3z" fill="#f97316"/><ellipse cx="-9" cy="5" rx="2.5" ry="1.5" fill="#fb7185" opacity=".5"/><ellipse cx="9" cy="5" rx="2.5" ry="1.5" fill="#fb7185" opacity=".5"/>'
   '<path d="M-5 23v-2M-3 23v-2M3 23v-2M5 23v-2" stroke="#f97316" stroke-width="1.5"/></g>')

def ENVFLY(x0,y0,x1,y1,n=3,c='#2563eb'):
  # ซองจดหมายลอยตามเส้นโค้งเป็นจุดๆ
  out=f'<path d="M{x0} {y0}Q{(x0+x1)/2} {min(y0,y1)-26} {x1} {y1}" stroke="{c}" stroke-width="1.6" stroke-dasharray="3 4" fill="none" opacity=".6"/>'
  for i in range(n):
    t=(i+1)/(n+1); mx=(x0+x1)/2; my=min(y0,y1)-26
    px=(1-t)**2*x0+2*(1-t)*t*mx+t*t*x1; py=(1-t)**2*y0+2*(1-t)*t*my+t*t*y1
    out+=(f'<g transform="translate({px:.0f} {py:.0f}) rotate({-14+i*12})"><rect x="-10" y="-7" width="20" height="14" rx="2" fill="#fff" stroke="{c}" stroke-width="1.5"/>'
          f'<path d="M-10 -7l10 8l10-8" stroke="{c}" stroke-width="1.3" fill="none"/></g>')
  return out

def DAYRING(x,y,d,t,frac=.7,c='#e11d48',r=22):
  # วงนับวันถอยหลัง ตัวเลขกลางวง
  import math
  a=2*math.pi*frac; ex=x+r*math.sin(a); ey=y-r*math.cos(a); big=1 if frac>.5 else 0
  return (f'<g><circle cx="{x}" cy="{y}" r="{r+5}" fill="#fff" opacity=".9"/><circle cx="{x}" cy="{y}" r="{r}" stroke="#e5e7eb" stroke-width="5" fill="none"/>'
   f'<path d="M{x} {y-r}A{r} {r} 0 {big} 1 {ex:.1f} {ey:.1f}" stroke="{c}" stroke-width="5" stroke-linecap="round" fill="none"/>'
   f'<text x="{x}" y="{y+3}" text-anchor="middle" font-size="13" font-weight="900" fill="{c}">{d}</text>'
   f'<text x="{x}" y="{y+13}" text-anchor="middle" font-size="6.5" font-weight="700" fill="#475569">{t}</text></g>')

def SQUIRREL(x,y,s=1,c='#c2763a'):
  # กระรอกถือลูกโอ๊ก หางพุ่ม ตาวาว แก้ม หูมีขนปลาย
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="2" cy="26" rx="18" ry="3" fill="#000" opacity=".12"/>'
   f'<path d="M10 22q22-4 18-26q-3-16-16-12q8 6 4 16q-4 10-12 14z" fill="{c}"/><path d="M14 4q6 6 2 14" stroke="#fed7aa" stroke-width="2" fill="none" opacity=".7"/>'
   f'<ellipse cx="0" cy="14" rx="10" ry="12" fill="{c}"/><ellipse cx="-1" cy="17" rx="6" ry="8" fill="#fed7aa"/>'
   f'<circle cx="-2" cy="-2" r="9" fill="{c}"/><path d="M-9 -8l-2-8l5 5zM3 -9l2-8l2 7z" fill="{c}"/><path d="M-11 -16l1 -2M5 -17l1-2" stroke="#7c2d12" stroke-width="1.2"/>'
   '<circle cx="-5" cy="-3" r="2.6" fill="#1c1917"/><circle cx="1" cy="-3" r="2.6" fill="#1c1917"/><circle cx="-4.2" cy="-4" r=".9" fill="#fff"/><circle cx="1.8" cy="-4" r=".9" fill="#fff"/>'
   '<ellipse cx="-2" cy="1" rx="1.6" ry="1.1" fill="#7c2d12"/><ellipse cx="-9" cy="1" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="5" cy="1" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/>'
   '<g transform="translate(-6 12)"><ellipse rx="4" ry="5" fill="#a16207"/><path d="M-4 -3q4-5 8 0z" fill="#713f12"/></g><path d="M-10 12q2 2 6 0M-2 12q-2 2-4 0" stroke="#7c2d12" stroke-width="1.3" fill="none"/></g>')

def CHEQUE(x,y,amt,c='#0e7490',rot=-6):
  # เช็คธนาคาร มีแถบหัว ช่องจำนวนเงิน ลายเซ็น
  return (f'<g transform="translate({x} {y}) rotate({rot})"><rect x="2" y="3" width="76" height="34" rx="3" fill="#000" opacity=".12"/>'
   f'<rect width="76" height="34" rx="3" fill="#f0fdfa" stroke="{c}" stroke-width="1.6"/><rect width="76" height="8" rx="3" fill="{c}"/>'
   f'<text x="5" y="6.5" font-size="5.5" fill="#fff" font-weight="700">BANK CHEQUE</text><path d="M6 16h34M6 22h26" stroke="#99f6e4" stroke-width="2"/>'
   f'<rect x="44" y="12" width="28" height="11" rx="2" fill="#fff" stroke="{c}"/><text x="58" y="20.5" text-anchor="middle" font-size="7" font-weight="900" fill="{c}">{amt}</text>'
   f'<path d="M46 30q4-5 7 0t7 0t6-2" stroke="#334155" stroke-width="1.2" fill="none"/></g>')

def DOUBLE(x,y,t='×2',c='#dc2626'):
  # ป้ายโทษสองเท่า ซ้อนเงาสองชั้น
  return (f'<g transform="translate({x} {y})"><rect x="-18" y="-14" width="36" height="28" rx="6" fill="{c}" opacity=".25" transform="translate(6 5)"/>'
   f'<rect x="-18" y="-14" width="36" height="28" rx="6" fill="{c}" opacity=".5" transform="translate(3 2.5)"/>'
   f'<rect x="-18" y="-14" width="36" height="28" rx="6" fill="{c}"/><text y="6" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">{t}</text></g>')

def HEDGEHOG(x,y,s=1,c='#8b5e3c'):
  # เม่นตัวกลม หนามเป็นชั้น หน้าครีม ตาวาว แก้ม จมูกดำ
  sp=''.join(f'<path d="M{-14+i*5} {-6+abs(i-3)*2}l-3 -9l7 5z" fill="{c}"/>' for i in range(7))
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="14" rx="20" ry="3" fill="#000" opacity=".12"/>'+sp+
   f'<ellipse cx="-2" cy="2" rx="18" ry="12" fill="{c}"/><path d="M-12 -4q4-4 8 0M-2 -6q4-4 8 0M6 -3q4-4 8 0" stroke="#5c3a20" stroke-width="1.2" fill="none"/>'
   '<path d="M10 -2q12 2 14 9q-6 5-16 3z" fill="#fde7c8"/><circle cx="24" cy="7" r="2" fill="#1c1917"/>'
   '<circle cx="14" cy="2" r="2.2" fill="#1c1917"/><circle cx="14.7" cy="1.3" r=".8" fill="#fff"/><ellipse cx="16" cy="7" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/>'
   '<path d="M-10 13v2M-4 13v2M4 13v2M10 13v2" stroke="#5c3a20" stroke-width="2" stroke-linecap="round"/></g>')

def FACESCAN(x,y,c='#2563eb'):
  # มือถือสแกนใบหน้า กรอบมุม เส้นสแกน ติ๊กถูก
  return (f'<g transform="translate({x} {y})"><rect x="-18" y="-32" width="36" height="64" rx="7" fill="#1e293b"/><rect x="-15" y="-27" width="30" height="52" rx="4" fill="#e0f2fe"/>'
   '<circle cx="0" cy="-6" r="8" fill="#fcd9b6"/><path d="M-10 14q10-12 20 0" fill="#fcd9b6"/>'
   f'<path d="M-12 -20v-4h4M12 -20v-4h-4M-12 8v4h4M12 8v4h-4" stroke="{c}" stroke-width="2" fill="none"/>'
   f'<path d="M-12 -4h24" stroke="{c}" stroke-width="1.5" opacity=".7"/><circle cx="12" cy="20" r="6" fill="#16a34a"/><path d="M9 20l2 2l4-4" stroke="#fff" stroke-width="1.6" fill="none"/></g>')

def RECALL(x,y,c='#dc2626'):
  # กล่องสินค้าพร้อมลูกศรวนกลับ ป้าย RECALL
  return (f'<g transform="translate({x} {y})"><path d="M-20 -8l20-10l20 10v22l-20 10l-20-10z" fill="#fde68a" stroke="#a16207" stroke-width="1.6"/>'
   '<path d="M-20 -8l20 10l20-10M0 2v22" stroke="#a16207" stroke-width="1.4" fill="none"/>'
   f'<path d="M-30 -14a30 30 0 0 1 52 -8" stroke="{c}" stroke-width="2.6" fill="none"/><path d="M24 -28l-1 10l-9 -4z" fill="{c}"/>'
   f'<rect x="-22" y="16" width="44" height="12" rx="3" fill="{c}"/><text y="25" text-anchor="middle" font-size="7.5" font-weight="900" fill="#fff">RECALL</text></g>')

def OTTER(x,y,s=1,c='#92603a'):
  # นากลอยตัวถือเปลือกหอย หน้าครีม หนวด แก้ม ตาวาว
  return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-24 12q-8 2-12 -4" stroke="{c}" stroke-width="6" stroke-linecap="round" fill="none"/>'
   f'<ellipse cx="0" cy="8" rx="22" ry="11" fill="{c}"/><ellipse cx="2" cy="6" rx="12" ry="7" fill="#e7c9a6"/>'
   f'<circle cx="18" cy="-4" r="10" fill="{c}"/><ellipse cx="21" cy="-1" rx="6.5" ry="5" fill="#f3dcc0"/><circle cx="11" cy="-12" r="2.6" fill="{c}"/><circle cx="25" cy="-12" r="2.6" fill="{c}"/>'
   '<circle cx="15" cy="-6" r="1.8" fill="#1c1917"/><circle cx="23" cy="-6" r="1.8" fill="#1c1917"/><circle cx="15.6" cy="-6.6" r=".6" fill="#fff"/><circle cx="23.6" cy="-6.6" r=".6" fill="#fff"/>'
   '<ellipse cx="19" cy="-2" rx="2" ry="1.4" fill="#3f2a1a"/><path d="M13 -1h-6M13 1h-5M25 -1h6M25 1h5" stroke="#3f2a1a" stroke-width=".6"/>'
   '<ellipse cx="12" cy="0" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/><ellipse cx="26" cy="0" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/>'
   '<path d="M2 2q6-6 10 0z" fill="#fbcfe8" stroke="#db2777" stroke-width=".8"/><path d="M-6 16q-4 4-8 2M8 17q4 4 8 2" stroke="#3f2a1a" stroke-width="2.5" stroke-linecap="round" fill="none"/></g>')

def COURTHOUSE(x,y,s=1,c='#64748b'):
  # อาคารศาล หน้าจั่ว เสา 4 ต้น บันได ธง
  cols=''.join(f'<rect x="{-26+i*16}" y="-30" width="6" height="30" fill="#f8fafc" stroke="{c}" stroke-width="1"/>' for i in range(4))
  return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-36 -30l36-20l36 20z" fill="#e2e8f0" stroke="{c}" stroke-width="1.5"/><circle cy="-38" r="4" fill="#fbbf24"/>'
   f'<rect x="-34" y="-32" width="68" height="4" fill="{c}"/>'+cols+f'<rect x="-38" y="0" width="76" height="4" fill="{c}"/><rect x="-42" y="4" width="84" height="4" fill="#94a3b8"/>'
   f'<path d="M30 -46v-18" stroke="#334155" stroke-width="1.2"/><path d="M30 -64h12l-3 4l3 4h-12z" fill="#dc2626"/></g>')

def CROWD(x,y,n=5,c='#f97316'):
  # กลุ่มคนตัวเล็กเรียงสองแถว แทนสมาชิกกลุ่ม
  out=''
  for i in range(n):
    px=x+(i%3)*18+(9 if i>=3 else 0); py=y+(14 if i>=3 else 0); col=c if i%2==0 else '#fb7185'
    out+=f'<g transform="translate({px} {py})"><circle r="5" fill="#fcd9b6"/><path d="M-7 14q0-9 7-9t7 9z" fill="{col}"/></g>'
  return out

def PANDA(x,y,s=1):
  # แพนด้านั่งกอดไผ่ หูดำ ตาดำ แก้มชมพู
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="18" ry="3" fill="#000" opacity=".12"/>'
   '<ellipse cx="0" cy="10" rx="15" ry="13" fill="#fafafa" stroke="#e5e5e5"/><ellipse cx="-11" cy="18" rx="6" ry="5" fill="#262626"/><ellipse cx="11" cy="18" rx="6" ry="5" fill="#262626"/>'
   '<path d="M-14 4q8 6 14 2q6 4 14 -2" stroke="#262626" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M10 -4v26" stroke="#65a30d" stroke-width="3"/><path d="M10 2l7-4M10 10l-6-3" stroke="#84cc16" stroke-width="2.5" stroke-linecap="round"/>'
   '<circle cx="0" cy="-10" r="12" fill="#fafafa" stroke="#e5e5e5"/><circle cx="-9" cy="-20" r="4" fill="#262626"/><circle cx="9" cy="-20" r="4" fill="#262626"/>'
   '<ellipse cx="-5" cy="-11" rx="3.2" ry="4" fill="#262626" transform="rotate(-20 -5 -11)"/><ellipse cx="5" cy="-11" rx="3.2" ry="4" fill="#262626" transform="rotate(20 5 -11)"/>'
   '<circle cx="-4.5" cy="-11.5" r="1.3" fill="#fff"/><circle cx="5.5" cy="-11.5" r="1.3" fill="#fff"/><ellipse cy="-5" rx="2" ry="1.4" fill="#262626"/>'
   '<ellipse cx="-9" cy="-5" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/><ellipse cx="9" cy="-5" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/></g>')

def PLOTS(x,y,w=90,h=56,n=4,c='#16a34a'):
  # ที่ดินแบ่งเป็นแปลง เส้นประแบ่ง เลขแปลง หมุดมุม
  out=f'<g transform="translate({x} {y})"><rect width="{w}" height="{h}" fill="#dcfce7" stroke="{c}" stroke-width="2"/>'
  for i in range(1,n): out+=f'<path d="M{w*i/n:.0f} 0v{h}" stroke="{c}" stroke-width="1.5" stroke-dasharray="4 3"/>'
  for i in range(n): out+=f'<text x="{w*(i+.5)/n:.0f}" y="{h/2+4:.0f}" text-anchor="middle" font-size="10" font-weight="900" fill="{c}">{i+1}</text>'
  for px,py in ((0,0),(w,0),(0,h),(w,h)): out+=f'<circle cx="{px}" cy="{py}" r="3" fill="#dc2626"/>'
  return out+f'<path d="M0 {h+8}h{w}" stroke="#64748b"/><path d="M0 {h+5}v6M{w} {h+5}v6" stroke="#64748b"/></g>'

def TRIPOD(x,y,c='#f59e0b'):
  # กล้องรังวัดบนขาตั้งสามขา
  return (f'<g transform="translate({x} {y})"><path d="M0 -30l-14 30M0 -30l14 30M0 -30v30" stroke="#78716c" stroke-width="2.4"/>'
   f'<rect x="-10" y="-44" width="20" height="14" rx="3" fill="{c}"/><circle cx="11" cy="-37" r="4" fill="#1e293b"/><circle cx="11" cy="-37" r="1.6" fill="#7dd3fc"/>'
   '<rect x="-4" y="-50" width="8" height="6" rx="1" fill="#334155"/></g>')

def FOX(x,y,s=1,c='#ea580c'):
  # จิ้งจอกนั่ง หางพุ่มปลายขาว หน้ากากขาว ตาวาว แก้ม
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="24" rx="18" ry="3" fill="#000" opacity=".12"/>'
   f'<path d="M10 20q22 0 18-20q-2 10-12 12z" fill="{c}"/><path d="M24 4q4-2 4-6q-2 6-6 6z" fill="#fff"/>'
   f'<path d="M-12 22q-2-18 12-20q14 2 12 20z" fill="{c}"/><path d="M-6 22q0-12 6-14q6 2 6 14z" fill="#fff7ed"/>'
   f'<path d="M-14 -6l-2-16l10 8zM14 -6l2-16l-10 8z" fill="{c}"/><path d="M-12 -10l-1-8l5 4zM12 -10l1-8l-5 4z" fill="#3f1d0a"/>'
   f'<path d="M-15 -6q15-14 30 0q-4 14-15 16q-11-2-15-16z" fill="{c}"/><path d="M-10 0q10 4 20 0q-3 9-10 10q-7-1-10-10z" fill="#fff"/>'
   '<circle cx="-5" cy="-3" r="2" fill="#1c1917"/><circle cx="5" cy="-3" r="2" fill="#1c1917"/><circle cx="-4.4" cy="-3.6" r=".7" fill="#fff"/><circle cx="5.6" cy="-3.6" r=".7" fill="#fff"/>'
   '<ellipse cy="6" rx="2" ry="1.4" fill="#1c1917"/><ellipse cx="-9" cy="2" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="9" cy="2" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/></g>')

def EVIBAG(x,y,t='A',c='#2563eb'):
  # ถุงหลักฐานซิปล็อก มีป้ายหมายเลข และของข้างใน
  return (f'<g transform="translate({x} {y})"><rect x="-16" y="-20" width="32" height="40" rx="3" fill="#e0f2fe" fill-opacity=".85" stroke="#94a3b8" stroke-width="1.5"/>'
   f'<rect x="-16" y="-20" width="32" height="6" fill="#ef4444"/><rect x="-10" y="-6" width="20" height="14" rx="2" fill="#fff" stroke="#cbd5e1"/>'
   f'<path d="M-6 0h12M-6 4h8" stroke="#94a3b8"/><circle cx="10" cy="14" r="7" fill="{c}"/><text x="10" y="17" text-anchor="middle" font-size="8" font-weight="900" fill="#fff">{t}</text></g>')

def PCT(x,y,p=30,c='#7c3aed',r=18):
  # วงกลมเปอร์เซ็นต์ เติมสัดส่วน พร้อมตัวเลข
  import math
  a=2*math.pi*p/100; ex=x+r*math.sin(a); ey=y-r*math.cos(a); big=1 if p>50 else 0
  return (f'<g><circle cx="{x}" cy="{y}" r="{r}" fill="#f1f5f9" stroke="#cbd5e1"/><path d="M{x} {y}L{x} {y-r}A{r} {r} 0 {big} 1 {ex:.1f} {ey:.1f}z" fill="{c}"/>'
   f'<circle cx="{x}" cy="{y}" r="{r*.55:.1f}" fill="#fff"/><text x="{x}" y="{y+4}" text-anchor="middle" font-size="9" font-weight="900" fill="{c}">≤{p}%</text></g>')

def KOALA(x,y,s=1,c='#9ca3af'):
  # โคอาล่าเกาะกิ่ง หูฟู จมูกใหญ่ ตาวาว แก้ม
  return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-26 24h52" stroke="#78350f" stroke-width="5" stroke-linecap="round"/><path d="M14 22q6-4 10 2" stroke="#65a30d" stroke-width="3" fill="none"/><ellipse cx="18" cy="18" rx="4" ry="2" fill="#84cc16"/>'
   f'<ellipse cx="0" cy="10" rx="14" ry="13" fill="{c}"/><ellipse cx="0" cy="14" rx="8" ry="8" fill="#e5e7eb"/>'
   f'<circle cx="-15" cy="-12" r="9" fill="{c}"/><circle cx="15" cy="-12" r="9" fill="{c}"/><circle cx="-15" cy="-12" r="5" fill="#f3f4f6"/><circle cx="15" cy="-12" r="5" fill="#f3f4f6"/>'
   f'<circle cx="0" cy="-6" r="13" fill="{c}"/><ellipse cx="0" cy="-3" rx="4.5" ry="6" fill="#374151"/><ellipse cx="-1.5" cy="-6" rx="1.2" ry="1.6" fill="#9ca3af"/>'
   '<circle cx="-6" cy="-9" r="2" fill="#111827"/><circle cx="6" cy="-9" r="2" fill="#111827"/><circle cx="-5.4" cy="-9.6" r=".7" fill="#fff"/><circle cx="6.6" cy="-9.6" r=".7" fill="#fff"/>'
   '<ellipse cx="-9" cy="-2" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/><ellipse cx="9" cy="-2" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/>'
   '<path d="M-8 20q-2 4 2 6M8 20q2 4 -2 6" stroke="#6b7280" stroke-width="4" stroke-linecap="round" fill="none"/></g>')

def JSCALE(x,y,tilt=8,c='#a16207',l='',r=''):
  # ตาชั่งความยุติธรรม เอียงได้ มีป้ายสองข้าง
  import math
  dx=34*math.cos(math.radians(tilt)); dy=34*math.sin(math.radians(tilt))
  return (f'<g transform="translate({x} {y})"><path d="M0 0v40M-14 40h28" stroke="{c}" stroke-width="3"/><circle r="4" fill="{c}"/>'
   f'<path d="M{-dx:.1f} {dy:.1f}L{dx:.1f} {-dy:.1f}" stroke="{c}" stroke-width="3"/>'
   f'<path d="M{-dx:.1f} {dy:.1f}l-10 14h20z" fill="#fde68a" stroke="{c}"/><path d="M{dx:.1f} {-dy:.1f}l-10 14h20z" fill="#fde68a" stroke="{c}"/>'
   f'<text x="{-dx:.1f}" y="{dy+12:.1f}" text-anchor="middle" font-size="6.5" font-weight="900" fill="#7c2d12">{l}</text>'
   f'<text x="{dx:.1f}" y="{-dy+12:.1f}" text-anchor="middle" font-size="6.5" font-weight="900" fill="#7c2d12">{r}</text></g>')

def STAIRS(x,y,labels,c='#4f46e5'):
  # บันไดขึ้นศาลสูง แต่ละขั้นมีป้าย ลูกศรขึ้น
  out=f'<g transform="translate({x} {y})">'
  for i,t in enumerate(labels):
    out+=f'<rect x="{i*34}" y="{-i*14}" width="34" height="{14*(i+1)}" fill="{c}" opacity="{.35+i*.2:.2f}"/><text x="{i*34+17}" y="{-i*14+10}" text-anchor="middle" font-size="6.5" font-weight="900" fill="#fff">{t}</text>'
  n=len(labels); return out+f'<path d="M4 -8L{n*34-6} {-n*14+4}" stroke="#16a34a" stroke-width="2" stroke-dasharray="3 3"/><path d="M{n*34-6} {-n*14+4}l-8 1l4 6z" fill="#16a34a"/></g>'

def PENGUIN(x,y,s=1):
  # เพนกวินตัวกลม พุงขาว ปากส้ม แก้มชมพู ถือซอง
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="26" rx="16" ry="3" fill="#000" opacity=".12"/>'
   '<ellipse cx="0" cy="8" rx="15" ry="19" fill="#1e293b"/><ellipse cx="0" cy="12" rx="10" ry="14" fill="#f8fafc"/>'
   '<circle cx="0" cy="-10" r="11" fill="#1e293b"/><path d="M-7 -12q7-6 14 0q0 8-7 9q-7-1-7-9z" fill="#f8fafc"/>'
   '<circle cx="-3.5" cy="-11" r="1.8" fill="#0f172a"/><circle cx="3.5" cy="-11" r="1.8" fill="#0f172a"/><circle cx="-3" cy="-11.6" r=".6" fill="#fff"/><circle cx="4" cy="-11.6" r=".6" fill="#fff"/>'
   '<path d="M-3 -7h6l-3 4z" fill="#f97316"/><ellipse cx="-7" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/><ellipse cx="7" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/>'
   '<path d="M-15 2q-8 8-4 14M15 2q8 8 4 14" stroke="#1e293b" stroke-width="5" stroke-linecap="round" fill="none"/>'
   '<path d="M-7 26h6M1 26h6" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>'
   '<g transform="translate(16 12) rotate(-12)"><rect x="-7" y="-5" width="14" height="10" rx="1" fill="#fff" stroke="#94a3b8"/><path d="M-7 -5l7 5l7-5" stroke="#94a3b8" fill="none"/></g></g>')

def SCROLL(x,y,t='',c='#a16207',w=70):
  # ม้วนกระดาษคำพิพากษา ปลายม้วนสองด้าน ริบบิ้นตรา
  return (f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-18" width="{w}" height="36" fill="#fffbeb" stroke="{c}" stroke-width="1.5"/>'
   f'<rect x="{-w/2-5}" y="-21" width="8" height="42" rx="4" fill="#fde68a" stroke="{c}"/><rect x="{w/2-3}" y="-21" width="8" height="42" rx="4" fill="#fde68a" stroke="{c}"/>'
   f'<path d="M{-w/2+8} -8h{w-20}M{-w/2+8} 0h{w-30}M{-w/2+8} 8h{w-24}" stroke="#e7d7b0" stroke-width="2"/>'
   f'<circle cx="{w/2-14}" cy="10" r="6" fill="#dc2626"/><path d="M{w/2-17} 15l-2 8l5-3l3 4l1-8" fill="#dc2626"/>'
   f'<text y="-24" text-anchor="middle" font-size="7" font-weight="900" fill="{c}">{t}</text></g>')

def SAFEBOX(x,y,c='#475569'):
  # ตู้เซฟเก็บเอกสาร มีหน้าปัดหมุนและเอกสารโผล่
  return (f'<g transform="translate({x} {y})"><rect x="-20" y="-22" width="40" height="44" rx="4" fill="{c}"/><rect x="-16" y="-18" width="32" height="36" rx="3" fill="#64748b"/>'
   '<circle cx="2" cy="0" r="8" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><path d="M2 -6v6l4 3" stroke="#334155" stroke-width="1.5"/>'
   '<rect x="-14" y="-28" width="18" height="10" fill="#fff" stroke="#cbd5e1" transform="rotate(-8)"/><rect x="-12" y="20" width="6" height="4" fill="#334155"/><rect x="6" y="20" width="6" height="4" fill="#334155"/></g>')

def RACCOON(x,y,s=1,c='#9ca3af'):
  # แรคคูนหน้ากากดำ หางลายวง ตาวาว แก้ม
  tail=''.join(f'<path d="M{14+i*4} {18-i*4}l6 -2" stroke="#374151" stroke-width="3"/>' for i in range(4))
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="24" rx="18" ry="3" fill="#000" opacity=".12"/>'
   f'<path d="M10 20q16-2 18-18" stroke="{c}" stroke-width="8" stroke-linecap="round" fill="none"/>'+tail+
   f'<ellipse cx="0" cy="12" rx="13" ry="12" fill="{c}"/><ellipse cx="0" cy="15" rx="7" ry="7" fill="#e5e7eb"/>'
   f'<path d="M-12 -12l-3-9l8 5zM12 -12l3-9l-8 5z" fill="{c}"/><ellipse cx="0" cy="-6" rx="13" ry="11" fill="{c}"/>'
   '<path d="M-12 -7q6-5 12 0q6-5 12 0q-2 6-12 6q-10 0-12-6z" fill="#1f2937"/><path d="M-4 0q4 6 8 0z" fill="#f3f4f6"/>'
   '<circle cx="-5" cy="-6" r="2.2" fill="#fff"/><circle cx="5" cy="-6" r="2.2" fill="#fff"/><circle cx="-5" cy="-6" r="1.3" fill="#111827"/><circle cx="5" cy="-6" r="1.3" fill="#111827"/>'
   '<ellipse cx="0" cy="1" rx="1.8" ry="1.2" fill="#111827"/><ellipse cx="-9" cy="1" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/><ellipse cx="9" cy="1" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/></g>')

def STAND(x,y,c='#92400e'):
  # คอกพยานไม้ มีไมค์และแก้วน้ำ
  return (f'<g transform="translate({x} {y})"><rect x="-26" y="-6" width="52" height="40" rx="3" fill="{c}"/><rect x="-30" y="-12" width="60" height="8" rx="3" fill="#b45309"/>'
   '<path d="M-20 4h40M-20 14h40M-20 24h40" stroke="#78350f" stroke-width="1"/><path d="M6 -12v-14" stroke="#334155" stroke-width="2"/><rect x="3" y="-34" width="6" height="10" rx="3" fill="#1e293b"/>'
   '<path d="M-16 -12v-10h8v10z" fill="#bae6fd" stroke="#64748b"/></g>')

def FEEJAR(x,y,t='คืน',c='#16a34a'):
  # โหลเหรียญค่าธรรมเนียมพร้อมลูกศรคืนเงิน
  coins=''.join(f'<ellipse cx="{-8+(i%3)*8}" cy="{14-(i//3)*6}" rx="5" ry="2.5" fill="#facc15" stroke="#a16207"/>' for i in range(6))
  return (f'<g transform="translate({x} {y})"><path d="M-16 -16h32v4q4 2 4 8v24q0 6-6 6h-28q-6 0-6-6v-24q0-6 4-8z" fill="#e0f2fe" fill-opacity=".85" stroke="#94a3b8" stroke-width="1.5"/>'
   f'<rect x="-14" y="-22" width="28" height="7" rx="2" fill="#64748b"/>'+coins+
   f'<path d="M22 -6q14 6 4 20" stroke="{c}" stroke-width="2.5" fill="none"/><path d="M26 14l-7 -1l4 -6z" fill="{c}"/>'
   f'<text x="30" y="-10" font-size="8" font-weight="900" fill="{c}">{t}</text></g>')

def BEAVER(x,y,s=1,c='#92400e'):
  # บีเวอร์ฟันหน้าใหญ่ หางแบนลายตาราง ตาวาว แก้ม
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="24" rx="18" ry="3" fill="#000" opacity=".12"/>'
   '<ellipse cx="18" cy="20" rx="12" ry="5" fill="#57534e" transform="rotate(-15 18 20)"/><path d="M10 18l16 -4M12 22l16 -4M16 14l4 10M22 13l4 10" stroke="#3f3f46" stroke-width=".8"/>'
   f'<ellipse cx="0" cy="10" rx="13" ry="14" fill="{c}"/><ellipse cx="0" cy="14" rx="8" ry="9" fill="#d6a77a"/>'
   f'<circle cx="0" cy="-8" r="12" fill="{c}"/><circle cx="-10" cy="-17" r="3.5" fill="{c}"/><circle cx="10" cy="-17" r="3.5" fill="{c}"/>'
   '<ellipse cx="0" cy="-3" rx="7" ry="5" fill="#d6a77a"/><ellipse cx="0" cy="-6" rx="2.5" ry="1.6" fill="#1c1917"/>'
   '<rect x="-2.5" y="-2" width="5" height="5" rx="1" fill="#fff" stroke="#e7e5e4"/><path d="M0 -2v5" stroke="#e7e5e4" stroke-width=".6"/>'
   '<circle cx="-5" cy="-11" r="2" fill="#1c1917"/><circle cx="5" cy="-11" r="2" fill="#1c1917"/><circle cx="-4.4" cy="-11.6" r=".7" fill="#fff"/><circle cx="5.6" cy="-11.6" r=".7" fill="#fff"/>'
   '<ellipse cx="-9" cy="-4" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="9" cy="-4" rx="2.2" ry="1.3" fill="#fb7185" opacity=".55"/></g>')

def PROXY(x,y,t='มอบฉันทะ',c='#7c3aed'):
  # ใบมอบฉันทะ บัตรประชาชนคู่ และตราประทับ
  return (f'<g transform="translate({x} {y})"><rect x="-26" y="-30" width="52" height="60" rx="3" fill="#fff" stroke="{c}" stroke-width="1.5"/>'
   f'<rect x="-26" y="-30" width="52" height="12" rx="3" fill="{c}"/><text y="-21" text-anchor="middle" font-size="7" font-weight="900" fill="#fff">{t}</text>'
   '<path d="M-18 -10h36M-18 -3h28M-18 4h32" stroke="#cbd5e1" stroke-width="2"/>'
   '<rect x="-20" y="12" width="16" height="11" rx="2" fill="#bfdbfe"/><rect x="0" y="12" width="16" height="11" rx="2" fill="#bfdbfe"/><circle cx="-15" cy="17" r="2.5" fill="#64748b"/><circle cx="5" cy="17" r="2.5" fill="#64748b"/>'
   f'<circle cx="20" cy="22" r="8" fill="none" stroke="#dc2626" stroke-width="2" opacity=".8"/></g>')

def INBOX(x,y,n=3,c='#0284c7'):
  # ถาดรับเอกสารศาล ซองอีเมลบินเข้า นาฬิกาเส้นตาย
  env=''.join(f'<g transform="translate({-30+i*16} {-34-i*6}) rotate({-10+i*8})"><rect x="-8" y="-5" width="16" height="11" rx="1.5" fill="#fff" stroke="{c}"/><path d="M-8 -5l8 6l8 -6" stroke="{c}" fill="none"/></g>' for i in range(n))
  return (f'<g transform="translate({x} {y})"><path d="M-30 0h60l-6 18h-48z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="-24" y="-6" width="44" height="8" rx="1" fill="#fff" stroke="#cbd5e1"/>'+env+
   '<g transform="translate(36 -18)"><circle r="10" fill="#fff" stroke="#dc2626" stroke-width="2"/><path d="M0 0v-6M0 0l5 2" stroke="#0f172a" stroke-width="1.6"/></g></g>')

def HAMSTER(x,y,s=1,c='#fdba74'):
  # แฮมสเตอร์แก้มป่อง หูชมพู ตาวาว ถือเมล็ด
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="17" ry="3" fill="#000" opacity=".12"/>'
   f'<ellipse cx="0" cy="8" rx="16" ry="15" fill="{c}"/><ellipse cx="0" cy="12" rx="10" ry="9" fill="#fff7ed"/>'
   f'<circle cx="-11" cy="-10" r="5" fill="{c}"/><circle cx="11" cy="-10" r="5" fill="{c}"/><circle cx="-11" cy="-10" r="2.8" fill="#fda4af"/><circle cx="11" cy="-10" r="2.8" fill="#fda4af"/>'
   f'<ellipse cx="0" cy="-3" rx="14" ry="11" fill="{c}"/><ellipse cx="-9" cy="1" rx="6" ry="5" fill="#fff7ed"/><ellipse cx="9" cy="1" rx="6" ry="5" fill="#fff7ed"/>'
   '<circle cx="-5" cy="-5" r="2.2" fill="#1c1917"/><circle cx="5" cy="-5" r="2.2" fill="#1c1917"/><circle cx="-4.3" cy="-5.7" r=".8" fill="#fff"/><circle cx="5.7" cy="-5.7" r=".8" fill="#fff"/>'
   '<ellipse cx="0" cy="-1" rx="1.6" ry="1.1" fill="#f472b6"/><path d="M-2 1q2 2 4 0" stroke="#7c2d12" stroke-width=".8" fill="none"/>'
   '<ellipse cx="-10" cy="2" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/><ellipse cx="10" cy="2" rx="2.4" ry="1.4" fill="#fb7185" opacity=".55"/>'
   '<ellipse cx="0" cy="10" rx="3" ry="4.5" fill="#a16207"/><circle cx="-3" cy="10" r="2" fill="'+c+'"/><circle cx="3" cy="10" r="2" fill="'+c+'"/></g>')

def SHRINE(x,y,c='#dc2626'):
  # ศาลเจ้าเล็ก หลังคาโค้ง ธูป ดอกไม้
  return (f'<g transform="translate({x} {y})"><rect x="-4" y="8" width="8" height="22" fill="#a8a29e"/><rect x="-18" y="-14" width="36" height="24" rx="2" fill="{c}"/>'
   '<path d="M-24 -14q24 -16 48 0z" fill="#facc15" stroke="#a16207"/><rect x="-8" y="-8" width="16" height="14" fill="#7f1d1d"/>'
   '<path d="M-3 -12v-8M0 -12v-10M3 -12v-8" stroke="#a16207" stroke-width="1.2"/><circle cx="0" cy="-23" r="1.4" fill="#f97316" opacity=".8"/>'
   '<circle cx="-14" cy="6" r="3" fill="#fde047"/><circle cx="14" cy="6" r="3" fill="#fde047"/></g>')

def WHEEL(x,y,c='#0f766e'):
  # ล้อวัดระยะของพนักงานสำรวจ + ป้ายตัวเลขเมตร
  return (f'<g transform="translate({x} {y})"><circle r="12" fill="#fff" stroke="{c}" stroke-width="3"/><circle r="2" fill="{c}"/>'
   f'<path d="M0 0l-26 -40" stroke="#475569" stroke-width="3"/><rect x="-34" y="-50" width="16" height="10" rx="2" fill="#1e293b"/><text x="-26" y="-43" text-anchor="middle" font-size="6" font-weight="900" fill="#4ade80">24.5</text>'
   f'<path d="M12 10h40" stroke="{c}" stroke-width="2" stroke-dasharray="3 3"/></g>')

def RABBIT(x,y,s=1,c='#f5f5f4'):
  # กระต่ายหูยาวด้านในชมพู ตาวาว แก้ม จมูกกระดิก หางปุย
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="24" rx="16" ry="3" fill="#000" opacity=".12"/><circle cx="14" cy="16" r="5" fill="#fff" stroke="#e7e5e4"/>'
   f'<ellipse cx="0" cy="10" rx="14" ry="14" fill="{c}" stroke="#e7e5e4"/><ellipse cx="-6" cy="22" rx="6" ry="3" fill="{c}" stroke="#e7e5e4"/><ellipse cx="6" cy="22" rx="6" ry="3" fill="{c}" stroke="#e7e5e4"/>'
   f'<ellipse cx="-6" cy="-26" rx="4.5" ry="13" fill="{c}" stroke="#e7e5e4" transform="rotate(-10 -6 -26)"/><ellipse cx="6" cy="-26" rx="4.5" ry="13" fill="{c}" stroke="#e7e5e4" transform="rotate(10 6 -26)"/>'
   '<ellipse cx="-6" cy="-26" rx="2.2" ry="9" fill="#fbcfe8" transform="rotate(-10 -6 -26)"/><ellipse cx="6" cy="-26" rx="2.2" ry="9" fill="#fbcfe8" transform="rotate(10 6 -26)"/>'
   f'<circle cx="0" cy="-7" r="11" fill="{c}" stroke="#e7e5e4"/><circle cx="-4.5" cy="-9" r="2" fill="#1c1917"/><circle cx="4.5" cy="-9" r="2" fill="#1c1917"/><circle cx="-3.9" cy="-9.6" r=".7" fill="#fff"/><circle cx="5.1" cy="-9.6" r=".7" fill="#fff"/>'
   '<path d="M-1.5 -4h3l-1.5 1.8z" fill="#f472b6"/><path d="M0 -2.2q-2 2 -3.5 1M0 -2.2q2 2 3.5 1" stroke="#78716c" stroke-width=".7" fill="none"/>'
   '<ellipse cx="-8" cy="-4" rx="2.3" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="8" cy="-4" rx="2.3" ry="1.3" fill="#fb7185" opacity=".55"/></g>')

def AWARD(x,y,t='คำชี้ขาด',c='#b45309'):
  # คำชี้ขาดอนุญาโต ม้วนกระดาษ ตราครั่ง ริบบิ้น
  return (f'<g transform="translate({x} {y})"><rect x="-28" y="-30" width="56" height="60" rx="3" fill="#fffbeb" stroke="{c}" stroke-width="1.5"/>'
   f'<rect x="-28" y="-30" width="56" height="11" fill="{c}"/><text y="-22" text-anchor="middle" font-size="7" font-weight="900" fill="#fff">{t}</text>'
   '<path d="M-20 -10h40M-20 -3h32M-20 4h36" stroke="#e7e5e4" stroke-width="2"/>'
   '<circle cx="14" cy="18" r="8" fill="#dc2626"/><circle cx="14" cy="18" r="4.5" fill="none" stroke="#fecaca"/><path d="M10 24l-3 10l6 -4l4 5l1 -10" fill="#dc2626"/></g>')

def KEYRACK(x,y,n=6,c='#a16207'):
  # แผงกุญแจห้องพักโรงแรม มีป้ายเลขห้อง
  ks=''.join(f'<g transform="translate({-30+(i%3)*30} {-8+(i//3)*22})"><circle r="2" fill="#475569"/><path d="M0 2v6" stroke="#475569"/><circle cy="12" r="4" fill="none" stroke="#facc15" stroke-width="2"/><rect x="-6" y="16" width="12" height="7" rx="1" fill="#fef3c7"/><text y="21.5" text-anchor="middle" font-size="5" font-weight="900" fill="#92400e">{101+i}</text></g>' for i in range(n))
  return f'<g transform="translate({x} {y})"><rect x="-44" y="-18" width="88" height="56" rx="4" fill="{c}"/>{ks}</g>'

def TURTLE(x,y,s=1,c='#16a34a'):
  # เต่ากระดองลายหกเหลี่ยม หน้ายิ้ม ตาวาว แก้มชมพู
  hexes=''.join(f'<path d="M{dx-5} {dy}l2.5 -4.3h5l2.5 4.3l-2.5 4.3h-5z" fill="#4ade80" stroke="#15803d" stroke-width=".8"/>' for dx,dy in [(0,-2),(-10,2),(10,2),(-5,-8),(5,-8)])
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="16" rx="22" ry="3" fill="#000" opacity=".12"/>'
   '<ellipse cx="-14" cy="12" rx="5" ry="4" fill="#86efac"/><ellipse cx="12" cy="12" rx="5" ry="4" fill="#86efac"/><path d="M-20 4l-6 2l6 2" fill="#86efac"/>'
   f'<path d="M-20 8q0 -24 20 -24q20 0 20 24z" fill="{c}" stroke="#14532d" stroke-width="1.2"/>'+hexes+
   '<circle cx="24" cy="-2" r="8" fill="#86efac" stroke="#15803d"/><circle cx="26" cy="-4" r="1.8" fill="#14532d"/><circle cx="26.5" cy="-4.6" r=".6" fill="#fff"/>'
   '<path d="M25 1q3 2 6 0" stroke="#14532d" stroke-width=".8" fill="none"/><ellipse cx="22" cy="1" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/></g>')

def SACKS(x,y,n=5,c='#f5f5f4',t='ข้าว'):
  # กองกระสอบข้าว/น้ำตาล ซ้อนเป็นพีระมิด
  out=''
  rows=[(0,3),(1,2)] if n<=5 else [(0,4),(1,3),(2,2)]
  for r,k in rows:
    for i in range(k):
      cx=(i-(k-1)/2)*26; cy=-r*16
      out+=f'<g transform="translate({cx} {cy})"><path d="M-12 -8q12 -5 24 0v14q-12 5 -24 0z" fill="{c}" stroke="#a8a29e"/><path d="M-12 -8l-3 -3M12 -8l3 -3" stroke="#a8a29e"/><text y="3" text-anchor="middle" font-size="5.5" font-weight="900" fill="#78716c">{t}</text></g>'
  return f'<g transform="translate({x} {y})">{out}</g>'

def BILLSET(x,y,c='#0369a1'):
  # ตั๋วแลกเงินคู่ฉีก 2 ฉบับ มีเลขลำดับ 1/2 2/2
  out=''
  for i in range(2):
    out+=(f'<g transform="translate({i*14} {i*10}) rotate({-6+i*8})"><rect x="-30" y="-16" width="60" height="32" rx="2" fill="#f0f9ff" stroke="{c}" stroke-width="1.5"/>'
      f'<path d="M-30 -16l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4l6 4l6 -4" stroke="{c}" fill="none" stroke-width=".8"/><path d="M-22 0h30M-22 6h22" stroke="#bae6fd" stroke-width="2"/>'
      f'<rect x="12" y="-4" width="14" height="10" rx="2" fill="{c}"/><text x="19" y="3.5" text-anchor="middle" font-size="6" font-weight="900" fill="#fff">{i+1}/2</text></g>')
  return f'<g transform="translate({x} {y})">{out}</g>'

def DUCK(x,y,s=1,c='#fde047'):
  # ลูกเป็ดขนฟู ปากส้ม ตาวาว แก้มชมพู ปีกเล็ก
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="15" ry="3" fill="#000" opacity=".12"/>'
   '<path d="M-6 18v4h-4M6 18v4h4" stroke="#f97316" stroke-width="2" fill="none"/>'
   f'<ellipse cx="0" cy="8" rx="14" ry="12" fill="{c}" stroke="#eab308"/><path d="M8 4q8 2 6 10q-6 -2 -8 -6z" fill="#facc15" stroke="#eab308" stroke-width=".8"/>'
   f'<circle cx="-2" cy="-10" r="11" fill="{c}" stroke="#eab308"/><path d="M-4 -21q2 -5 5 -2q2 -4 4 0" stroke="#eab308" fill="none"/>'
   '<path d="M-14 -8q-8 1 -9 4q6 3 10 0z" fill="#fb923c" stroke="#ea580c" stroke-width=".8"/>'
   '<circle cx="-6" cy="-13" r="2" fill="#1c1917"/><circle cx="2" cy="-13" r="2" fill="#1c1917"/><circle cx="-5.4" cy="-13.6" r=".7" fill="#fff"/><circle cx="2.6" cy="-13.6" r=".7" fill="#fff"/>'
   '<ellipse cx="-9" cy="-6" rx="2.2" ry="1.3" fill="#fb7185" opacity=".6"/><ellipse cx="5" cy="-7" rx="2.2" ry="1.3" fill="#fb7185" opacity=".6"/></g>')

def BURNT(x,y,n=3):
  # ห้องแถวไหม้เกรียม คานดำ ควันลอย
  out=''
  for i in range(n):
    out+=(f'<g transform="translate({(i-(n-1)/2)*34} 0)"><rect x="-16" y="-30" width="32" height="44" fill="#57534e"/><path d="M-16 -30l8 -10h16l8 10" fill="#292524"/>'
      '<rect x="-10" y="-20" width="8" height="10" fill="#1c1917"/><rect x="2" y="-20" width="8" height="10" fill="#1c1917"/><path d="M-12 14l6 -14l4 10l6 -12l4 16" stroke="#0c0a09" stroke-width="2" fill="none"/></g>')
  smoke=''.join(f'<circle cx="{-20+i*16}" cy="{-50-i*6}" r="{8+i*2}" fill="#a8a29e" opacity="{.35-i*.06:.2f}"/>' for i in range(4))
  return f'<g transform="translate({x} {y})">{smoke}{out}</g>'

def CONDO(x,y,floors=5,c='#7c3aed'):
  # อาคารชุดหลายชั้น หน้าต่างเรียง มีห้องร้านชั้นล่างไฮไลต์
  win=''.join(f'<rect x="{-22+j*12}" y="{-12-i*14}" width="8" height="9" rx="1" fill="#e0e7ff"/>' for i in range(floors) for j in range(4))
  return (f'<g transform="translate({x} {y})"><rect x="-28" y="{-18-floors*14}" width="56" height="{floors*14+30}" rx="2" fill="{c}"/>{win}'
   '<rect x="-24" y="2" width="22" height="10" fill="#fde047"/><text x="-13" y="9.5" text-anchor="middle" font-size="5.5" font-weight="900" fill="#713f12">ร้าน</text></g>')

def LAMB(x,y,s=1):
  # ลูกแกะขนหยิกปุยเมฆ หน้าครีม ตาวาว หูตก แก้มชมพู
  fluff=''.join(f'<circle cx="{dx}" cy="{dy}" r="7" fill="#fafaf9" stroke="#e7e5e4"/>' for dx,dy in [(-10,4),(0,0),(10,4),(-12,14),(0,16),(12,14),(-4,8),(6,8)])
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="26" rx="16" ry="3" fill="#000" opacity=".12"/>'
   '<rect x="-9" y="18" width="4" height="8" rx="2" fill="#44403c"/><rect x="5" y="18" width="4" height="8" rx="2" fill="#44403c"/>'+fluff+
   '<circle cx="-6" cy="-12" r="5" fill="#fafaf9"/><circle cx="2" cy="-14" r="5" fill="#fafaf9"/><circle cx="8" cy="-11" r="4.5" fill="#fafaf9"/>'
   '<ellipse cx="0" cy="-4" rx="9" ry="10" fill="#fde7cf" stroke="#e7c9a8"/><ellipse cx="-11" cy="-4" rx="5" ry="2.6" fill="#fde7cf" transform="rotate(25 -11 -4)"/><ellipse cx="11" cy="-4" rx="5" ry="2.6" fill="#fde7cf" transform="rotate(-25 11 -4)"/>'
   '<circle cx="-3.5" cy="-5" r="1.8" fill="#1c1917"/><circle cx="3.5" cy="-5" r="1.8" fill="#1c1917"/><circle cx="-3" cy="-5.6" r=".6" fill="#fff"/><circle cx="4" cy="-5.6" r=".6" fill="#fff"/>'
   '<path d="M-1.5 0h3l-1.5 1.5z" fill="#f472b6"/><path d="M0 1.5q-2 2 -3 1M0 1.5q2 2 3 1" stroke="#a8a29e" stroke-width=".6" fill="none"/>'
   '<ellipse cx="-6" cy="-1" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/><ellipse cx="6" cy="-1" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/></g>')

def CINEMA(x,y,c='#1e293b'):
  # จอฉายหนัง ลำแสงโปรเจกเตอร์ แถวเก้าอี้
  seats=''.join(f'<rect x="{-36+i*14}" y="{18+r*10}" width="11" height="8" rx="3" fill="#be123c"/>' for r in range(2) for i in range(6))
  return (f'<g transform="translate({x} {y})"><rect x="-40" y="-36" width="80" height="44" rx="2" fill="#f8fafc" stroke="{c}" stroke-width="3"/>'
   '<path d="M-30 -10l14 -12l12 8l16 -14l18 18v6h-60z" fill="#93c5fd"/><circle cx="22" cy="-26" r="5" fill="#fde047"/>'
   '<path d="M50 -40l-90 16l90 30z" fill="#fef9c3" opacity=".25"/>'+seats+'</g>')

def LEDGERBOOK(x,y,c='#0f766e'):
  # สมุดงบดุลเปิด กราฟแท่ง เครื่องหมายผู้สอบบัญชี
  return (f'<g transform="translate({x} {y})"><path d="M-34 -22h32q2 0 2 2v40q0 -2 -2 -2h-32z" fill="#fff" stroke="{c}"/><path d="M34 -22h-32q-2 0 -2 2v40q0 -2 2 -2h32z" fill="#fff" stroke="{c}"/>'
   '<path d="M-28 -12h22M-28 -6h18M-28 0h22M-28 6h14" stroke="#cbd5e1" stroke-width="2"/>'
   f'<rect x="8" y="2" width="5" height="12" fill="{c}"/><rect x="15" y="-4" width="5" height="18" fill="#14b8a6"/><rect x="22" y="-10" width="5" height="24" fill="#5eead4"/>'
   '<circle cx="26" cy="-16" r="5" fill="none" stroke="#dc2626" stroke-width="1.5"/><path d="M23.5 -16l2 2l3 -4" stroke="#dc2626" stroke-width="1.3" fill="none"/></g>')

def KITTEN(x,y,s=1,c='#fdba74'):
  # ลูกแมวส้มลายทาง ตาโต หนวด แก้มชมพู หางม้วน
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="15" ry="3" fill="#000" opacity=".12"/>'
   f'<path d="M12 16q14 -2 10 -16" stroke="{c}" stroke-width="5" fill="none" stroke-linecap="round"/>'
   f'<ellipse cx="0" cy="10" rx="12" ry="12" fill="{c}"/><path d="M-6 2q6 2 12 0M-8 8q8 2 16 0" stroke="#ea580c" stroke-width="1.5" fill="none"/><ellipse cx="0" cy="14" rx="6" ry="6" fill="#fff7ed"/>'
   f'<path d="M-11 -14l-2 -10l8 6zM11 -14l2 -10l-8 6z" fill="{c}"/><path d="M-10 -15l-1 -6l4 3zM10 -15l1 -6l-4 3z" fill="#fda4af"/>'
   f'<circle cx="0" cy="-8" r="11" fill="{c}"/><path d="M-4 -18l1 4M0 -19v4M4 -18l-1 4" stroke="#ea580c" stroke-width="1.3"/>'
   '<ellipse cx="-4.5" cy="-9" rx="2.4" ry="2.8" fill="#1c1917"/><ellipse cx="4.5" cy="-9" rx="2.4" ry="2.8" fill="#1c1917"/><circle cx="-3.8" cy="-10" r=".9" fill="#fff"/><circle cx="5.2" cy="-10" r=".9" fill="#fff"/>'
   '<path d="M-1.2 -5h2.4l-1.2 1.4z" fill="#f472b6"/><path d="M0 -3.6q-2 2 -3.5 1M0 -3.6q2 2 3.5 1" stroke="#7c2d12" stroke-width=".7" fill="none"/>'
   '<path d="M-6 -5h-8M-6 -3.5l-7 2M6 -5h8M6 -3.5l7 2" stroke="#7c2d12" stroke-width=".5"/>'
   '<ellipse cx="-7.5" cy="-4.5" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/><ellipse cx="7.5" cy="-4.5" rx="2" ry="1.2" fill="#fb7185" opacity=".55"/></g>')
