T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
def peng(x,y,s=.5):
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="8" rx="15" ry="19" fill="#1e293b"/><ellipse cx="0" cy="12" rx="10" ry="14" fill="#f8fafc"/><circle cx="0" cy="-10" r="11" fill="#1e293b"/><path d="M-7 -12q7-6 14 0q0 8-7 9q-7-1-7-9z" fill="#f8fafc"/>'
   '<circle cx="-3.5" cy="-11" r="1.8" fill="#0f172a"/><circle cx="3.5" cy="-11" r="1.8" fill="#0f172a"/><path d="M-3 -7h6l-3 4z" fill="#f97316"/><ellipse cx="-7" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/><ellipse cx="7" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/><path d="M-7 26h6M1 26h6" stroke="#f97316" stroke-width="3"/></g>')
def scale(x,y,c='#a16207',t=8):
  import math
  dx=28*math.cos(math.radians(t)); dy=28*math.sin(math.radians(t))
  return f'<g transform="translate({x} {y})"><path d="M0 0v34M-12 34h24" stroke="{c}" stroke-width="3"/><path d="M{-dx:.1f} {dy:.1f}L{dx:.1f} {-dy:.1f}" stroke="{c}" stroke-width="3"/><path d="M{-dx:.1f} {dy:.1f}l-9 12h18z" fill="#fde68a" stroke="{c}"/><path d="M{dx:.1f} {-dy:.1f}l-9 12h18z" fill="#fde68a" stroke="{c}"/></g>'
D['shop-which-court-to-sue']=dict(c1='#ecfccb',c2='#e0f2fe',sh='#365314',bd='#ecfccb',ln='#a3e635',bg='#4d7c0f',badge='🗺️',tint='#f7fee7',
 hero='<path d="M60 78l20-8l24 8l24-8v40l-24 8l-24-8l-20 8z" fill="#fff" stroke="#4d7c0f" stroke-width="2"/><path d="M80 70v40M104 78v40" stroke="#d9f99d" stroke-width="2"/><g transform="translate(104 92)"><path d="M0 0c-8 -12 -8 -20 0 -20s8 8 0 20z" fill="#dc2626"/><circle cy="-13" r="3" fill="#fff"/></g>'+pill(92,134,'ศาลไหน?','#4d7c0f',42),tag=None)
D['court-papers-to-shop']=dict(c1='#f5f5f4',c2='#e0f2fe',sh='#44403c',bd='#f5f5f4',ln='#a8a29e',bg='#57534e',badge='📬',tint='#fafaf9',
 hero='<g transform="translate(80 92) rotate(-8)"><rect x="-24" y="-16" width="48" height="32" rx="3" fill="#fff" stroke="#57534e" stroke-width="2"/><path d="M-24 -16l24 18l24-18" stroke="#57534e" stroke-width="1.8" fill="none"/><circle cy="4" r="5" fill="#dc2626"/></g>'+peng(122,100)+pill(92,134,'รับแทนได้?','#57534e',48),tag=None)
D['shop-documents-in-court']=dict(c1='#ffe4e6',c2='#fef9c3',sh='#881337',bd='#ffe4e6',ln='#fb7185',bg='#be123c',badge='📄',tint='#fff1f2',
 hero='<rect x="62" y="66" width="44" height="54" rx="3" fill="#e0f2fe" stroke="#be123c" stroke-width="2"/><path d="M68 76h32M68 84h24M68 92h28" stroke="#93c5fd" stroke-width="3"/><path d="M62 100q11-6 22 4t22-4v20h-44z" fill="#60a5fa" opacity=".6"/><g transform="translate(122 88)"><rect x="-11" y="-20" width="22" height="40" rx="4" fill="#1e293b"/><rect x="-8" y="-15" width="16" height="28" fill="#fff"/><path d="M-5 -9h10M-5 -4h8M-5 1h10" stroke="#cbd5e1"/></g>'+pill(92,134,'สำเนาใช้ได้?','#be123c',54),tag=None)
D['judgment-costs-who-pays']=dict(c1='#ffedd5',c2='#e0f2fe',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='⚖️',tint='#fff7ed',
 hero=scale(92,82,'#c2410c',-8)+''.join(f'<circle cx="{120+i*4}" cy="{112-i*5}" r="6" fill="#facc15" stroke="#a16207"/>' for i in range(3))+pill(92,134,'ค่าฤชาธรรมเนียม','#c2410c',66),tag=None)
D['shop-appeal-deadline-limit']=dict(c1='#e0e7ff',c2='#cffafe',sh='#1e1b4b',bd='#e0e7ff',ln='#818cf8',bg='#4338ca',badge='📈',tint='#eef2ff',
 hero=''.join(f'<rect x="{60+i*22}" y="{112-i*14}" width="22" height="{14*(i+1)}" fill="#4f46e5" opacity="{.35+i*.25:.2f}"/>' for i in range(3))+'<path d="M64 104L126 66" stroke="#16a34a" stroke-width="2" stroke-dasharray="3 3"/><path d="M126 66l-8 1l4 6z" fill="#16a34a"/><circle cx="128" cy="98" r="12" fill="#fff" stroke="#4338ca" stroke-width="3"/><text x="128" y="102" text-anchor="middle" font-size="8" fill="#4338ca" '+T+'>1 ด.</text>'+pill(92,134,'อุทธรณ์','#4338ca',42),tag=None)
