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
