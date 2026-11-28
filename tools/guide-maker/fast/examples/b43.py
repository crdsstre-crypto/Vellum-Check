T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def pig(x,y,s=.45):
  c='#fbcfe8'
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="10" rx="15" ry="12" fill="{c}" stroke="#f9a8d4"/><circle cx="0" cy="-6" r="11" fill="{c}" stroke="#f9a8d4"/><path d="M-10 -14l-4 -6l8 2zM10 -14l4 -6l-8 2z" fill="#f9a8d4"/>'
   '<ellipse cx="0" cy="-2" rx="5" ry="3.6" fill="#f9a8d4" stroke="#ec4899" stroke-width=".8"/><ellipse cx="-1.8" cy="-2" rx=".9" ry="1.3" fill="#9d174d"/><ellipse cx="1.8" cy="-2" rx=".9" ry="1.3" fill="#9d174d"/><circle cx="-4.5" cy="-9" r="1.8" fill="#1c1917"/><circle cx="4.5" cy="-9" r="1.8" fill="#1c1917"/><circle cx="-4" cy="-9.6" r=".6" fill="#fff"/><circle cx="5" cy="-9.6" r=".6" fill="#fff"/><ellipse cx="-8" cy="-3" rx="2.2" ry="1.3" fill="#fb7185" opacity=".7"/><ellipse cx="8" cy="-3" rx="2.2" ry="1.3" fill="#fb7185" opacity=".7"/></g>')
def ring(x,y,t,c):
  return f'<g transform="translate({x} {y})"><circle r="14" fill="#fff" stroke="{c}" stroke-width="3"/><text y="4" text-anchor="middle" font-size="10" '+T+f' fill="{c}">{t}</text></g>'
D['shop-land-transfer-fee-2pct']=dict(c1='#ecfccb',c2='#fef9c3',sh='#365314',bd='#ecfccb',ln='#bef264',bg='#4d7c0f',badge='🧾',tint='#f7fee7',
 hero='<g transform="translate(84 100)"><rect x="-38" y="-24" width="76" height="48" rx="4" fill="#fff" stroke="#4d7c0f" stroke-width="2"/><text x="-30" y="-6" font-size="8" '+T+' fill="#4d7c0f">ราคาประเมิน</text><text x="0" y="14" text-anchor="middle" font-size="12" '+T+' fill="#15803d">× 2%</text></g>'+pig(138,122)+pill(88,140,'ค่าโอน','#4d7c0f',40),tag=None)
D['boundary-marker-move-permit']=dict(c1='#ffedd5',c2='#f5f5f4',sh='#44403c',bd='#ffedd5',ln='#fdba74',bg='#c2410c',badge='📍',tint='#fff7ed',
 hero='<g transform="translate(84 110)"><ellipse cy="20" rx="20" ry="5" fill="#000" opacity=".15"/><path d="M-10 20v-40h20v40z" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1.5"/><rect x="-10" y="-24" width="20" height="8" fill="#dc2626"/></g>'+ring(134,80,'15','#c2410c')+pill(88,140,'ห้ามย้าย','#c2410c',44),tag=None)
D['condo-committee-shop-seat']=dict(c1='#e0f2fe',c2='#ccfbf1',sh='#0c4a6e',bd='#e0f2fe',ln='#7dd3fc',bg='#0369a1',badge='🪑',tint='#f0f9ff',
 hero='<g transform="translate(86 112)"><rect x="-40" y="-6" width="80" height="10" rx="3" fill="#0369a1"/>'+''.join(f'<rect x="{-34+i*20}" y="-20" width="12" height="12" rx="2" fill="{"#fde047" if i==1 else "#7dd3fc"}"/>' for i in range(4))+'</g>'+ring(132,80,'1 คน','#0369a1')+pill(88,140,'กรรมการ','#0369a1',44),tag=None)
D['condo-manager-hire-fire']=dict(c1='#ede9fe',c2='#ffedd5',sh='#2e1065',bd='#ede9fe',ln='#c4b5fd',bg='#6d28d9',badge='🗂️',tint='#f5f3ff',
 hero='<g transform="translate(84 104)"><rect x="-22" y="-16" width="44" height="34" rx="3" fill="#6d28d9"/><rect x="-12" y="-20" width="24" height="5" fill="#2e1065"/><text y="8" text-anchor="middle" font-size="12" '+T+' fill="#fff">1/4</text></g>'+ring(134,80,'30','#6d28d9')+pill(88,140,'เปลี่ยนผู้จัดการ','#6d28d9',66),tag=None)
D['building-appeal-board-visit']=dict(c1='#fef9c3',c2='#dbeafe',sh='#713f12',bd='#fef9c3',ln='#fde047',bg='#1d4ed8',badge='⚖️',tint='#fefce8',
 hero='<g transform="translate(84 100)"><path d="M-40 -10h80l-8 -14h-64z" fill="#f59e0b"/><rect x="-32" y="-10" width="64" height="40" fill="#fffbeb" stroke="#a16207"/><path d="M-36 -26l72 50M36 -26l-72 50" stroke="#dc2626" stroke-width="3" opacity=".7"/></g>'+pig(138,124)+pill(88,140,'อุทธรณ์','#1d4ed8',44),tag=None)
