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
