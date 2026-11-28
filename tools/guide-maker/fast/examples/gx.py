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
