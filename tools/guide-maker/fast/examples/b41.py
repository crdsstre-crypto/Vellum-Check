T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def lamb(x,y,s=.45):
  fl=''.join(f'<circle cx="{dx}" cy="{dy}" r="7" fill="#fafaf9" stroke="#d6d3d1"/>' for dx,dy in [(-10,4),(0,0),(10,4),(-12,14),(0,16),(12,14)])
  return (f'<g transform="translate({x} {y}) scale({s})">'+fl+'<ellipse cx="0" cy="-4" rx="9" ry="10" fill="#fde7cf" stroke="#e7c9a8"/><circle cx="-3.5" cy="-5" r="1.8" fill="#1c1917"/><circle cx="3.5" cy="-5" r="1.8" fill="#1c1917"/><circle cx="-3" cy="-5.6" r=".6" fill="#fff"/><circle cx="4" cy="-5.6" r=".6" fill="#fff"/><ellipse cx="-6" cy="-1" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/><ellipse cx="6" cy="-1" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/></g>')
def ring(x,y,t,c):
  return f'<g transform="translate({x} {y})"><circle r="14" fill="#fff" stroke="{c}" stroke-width="3"/><text y="4" text-anchor="middle" font-size="11" '+T+f' fill="{c}">{t}</text></g>'
burnt=''.join(f'<g transform="translate({60+i*30} 112)"><rect x="-13" y="-24" width="26" height="36" fill="#57534e"/><path d="M-13 -24l6 -8h14l6 8" fill="#292524"/><rect x="-8" y="-16" width="6" height="8" fill="#1c1917"/><rect x="2" y="-16" width="6" height="8" fill="#1c1917"/></g>' for i in range(2))
D['fire-zone-45-day-ban']=dict(c1='#f5f5f4',c2='#fee2e2',sh='#292524',bd='#f5f5f4',ln='#fca5a5',bg='#b91c1c',badge='🔥',tint='#fafaf9',
 hero=burnt+ring(132,78,'45','#b91c1c')+pill(88,140,'ห้ามสร้าง','#b91c1c',48),tag=None)
D['fire-zone-redevelopment-plan']=dict(c1='#e0e7ff',c2='#fce7f3',sh='#1e1b4b',bd='#e0e7ff',ln='#a5b4fc',bg='#3730a3',badge='🗺️',tint='#eef2ff',
 hero='<g transform="translate(84 102)"><rect x="-36" y="-26" width="72" height="52" rx="3" fill="#f8fafc" stroke="#3730a3" stroke-width="2"/><path d="M-36 4h72" stroke="#94a3b8" stroke-width="7"/>'+''.join(f'<rect x="{-30+i*18}" y="-20" width="12" height="18" fill="{"#fecaca" if i==1 else "#c7d2fe"}"/>' for i in range(4))+'</g>'+ring(134,78,'60','#3730a3')+pill(88,140,'แผนผังใหม่','#3730a3',52),tag=None)
D['building-inspector-site-visit']=dict(c1='#fee2e2',c2='#ffedd5',sh='#7f1d1d',bd='#fee2e2',ln='#fca5a5',bg='#dc2626',badge='👷',tint='#fef2f2',
 hero='<g transform="translate(84 104)"><path d="M-32 26v-52M32 26v-52M-32 -8h64M-32 10h64M-32 -26l64 36M32 -26l-64 36" stroke="#64748b" stroke-width="2.5" fill="none"/></g><g transform="translate(134 82)"><path d="M-14 4q0 -16 14 -16q14 0 14 16z" fill="#facc15" stroke="#a16207" stroke-width="1.5"/><rect x="-17" y="3" width="34" height="5" rx="2" fill="#eab308"/></g>'+pill(88,140,'นายช่างตรวจ','#dc2626',56),tag=None)
D['condo-dissolution-liquidation']=dict(c1='#d1fae5',c2='#ccfbf1',sh='#134e4a',bd='#d1fae5',ln='#5eead4',bg='#0f766e',badge='🏢',tint='#f0fdfa',
 hero='<g transform="translate(80 120)"><rect x="-24" y="-78" width="48" height="88" rx="2" fill="#0f766e"/>'+''.join(f'<rect x="{-18+j*12}" y="{-10-i*14}" width="8" height="9" rx="1" fill="#ccfbf1"/>' for i in range(5) for j in range(3))+'</g>'+lamb(134,120)+pill(88,140,'เลิกอาคารชุด','#0f766e',58),tag=None)
D['land-tax-letter-delivery-extension']=dict(c1='#fef3c7',c2='#ffedd5',sh='#78350f',bd='#fef3c7',ln='#fcd34d',bg='#c2410c',badge='✉️',tint='#fffbeb',
 hero='<g transform="translate(80 102)"><rect x="-28" y="-38" width="56" height="70" rx="3" fill="#92400e"/><rect x="-12" y="-28" width="24" height="18" fill="#fff" stroke="#a16207"/><circle cx="18" cy="0" r="2.5" fill="#fde68a"/></g>'+ring(134,78,'7','#c2410c')+pill(88,140,'ปิดหนังสือ','#c2410c',50),tag=None)
