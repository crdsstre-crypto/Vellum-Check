T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def tur(x,y,s=.45):
  hx=''.join(f'<path d="M{dx-5} {dy}l2.5 -4.3h5l2.5 4.3l-2.5 4.3h-5z" fill="#4ade80" stroke="#15803d" stroke-width=".8"/>' for dx,dy in [(0,-2),(-10,2),(10,2),(-5,-8),(5,-8)])
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="-14" cy="12" rx="5" ry="4" fill="#86efac"/><ellipse cx="12" cy="12" rx="5" ry="4" fill="#86efac"/><path d="M-20 8q0 -24 20 -24q20 0 20 24z" fill="#16a34a" stroke="#14532d" stroke-width="1.2"/>'+hx+
   '<circle cx="24" cy="-2" r="8" fill="#86efac" stroke="#15803d"/><circle cx="26" cy="-4" r="1.8" fill="#14532d"/><circle cx="26.5" cy="-4.6" r=".6" fill="#fff"/><path d="M25 1q3 2 6 0" stroke="#14532d" stroke-width=".8" fill="none"/><ellipse cx="22" cy="1" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/></g>')
def aw(x,y,c,t):
  return f'<g transform="translate({x} {y})"><rect x="-26" y="-30" width="52" height="58" rx="3" fill="#fffbeb" stroke="{c}" stroke-width="2"/><rect x="-26" y="-30" width="52" height="12" fill="{c}"/><text y="-21" text-anchor="middle" font-size="8" '+T+f' fill="#fff">{t}</text><path d="M-18 -8h36M-18 0h28M-18 8h32" stroke="#e7e5e4" stroke-width="2.5"/><circle cx="14" cy="18" r="8" fill="#dc2626"/></g>'
D['arbitration-award-typo-costs']=dict(c1='#e0e7ff',c2='#ede9fe',sh='#1e1b4b',bd='#e0e7ff',ln='#a5b4fc',bg='#4338ca',badge='📜',tint='#eef2ff',
 hero=aw(82,100,'#4338ca','คำชี้ขาด')+'<path d="M62 92h40" stroke="#dc2626" stroke-width="3"/><g transform="translate(134 80)"><circle r="14" fill="#fff" stroke="#4338ca" stroke-width="3"/><text y="4" text-anchor="middle" font-size="11" '+T+' fill="#4338ca">30</text></g>'+pill(88,140,'ขอแก้','#4338ca',40),tag=None)
D['arbitration-award-refuse-enforce']=dict(c1='#ffe4e6',c2='#fce7f3',sh='#881337',bd='#ffe4e6',ln='#fda4af',bg='#be123c',badge='🌐',tint='#fff1f2',
 hero=aw(80,100,'#be123c','AWARD')+'<g transform="translate(132 84)"><circle r="16" fill="none" stroke="#dc2626" stroke-width="4"/><path d="M-11 -11l22 22" stroke="#dc2626" stroke-width="4"/></g>'+pill(90,140,'ปฏิเสธบังคับ','#be123c',56),tag=None)
D['community-mediation-center-shop']=dict(c1='#fef9c3',c2='#ecfccb',sh='#713f12',bd='#fef9c3',ln='#fde047',bg='#a16207',badge='🏘️',tint='#fefce8',
 hero='<g transform="translate(84 100)"><path d="M-30 -4l30 -24l30 24z" fill="#ca8a04"/><rect x="-24" y="-4" width="48" height="32" fill="#fef3c7" stroke="#a16207" stroke-width="2"/><rect x="-6" y="8" width="12" height="20" fill="#a16207"/></g>'+tur(136,122)+pill(90,140,'ไม่เกิน 5 แสน','#a16207',58),tag=None)
D['hotel-inspection-admin-fine']=dict(c1='#dcfce7',c2='#d1fae5',sh='#14532d',bd='#dcfce7',ln='#86efac',bg='#15803d',badge='🔑',tint='#f0fdf4',
 hero='<g transform="translate(86 96)"><rect x="-38" y="-24" width="76" height="52" rx="4" fill="#92400e"/>'+''.join(f'<g transform="translate({-24+(i%3)*24} {-10+(i//3)*22})"><circle cy="4" r="4" fill="none" stroke="#facc15" stroke-width="2.5"/><rect x="-6" y="9" width="12" height="7" rx="1" fill="#fef3c7"/></g>' for i in range(6))+'</g>'+pill(88,140,'ตรวจโรงแรม','#15803d',54),tag=None)
D['land-tax-appeal-board-court']=dict(c1='#e0f2fe',c2='#dbeafe',sh='#1e3a8a',bd='#e0f2fe',ln='#93c5fd',bg='#1d4ed8',badge='🏛️',tint='#eff6ff',
 hero='<g transform="translate(80 108)"><path d="M-34 -20l34 -18l34 18z" fill="#1d4ed8"/>'+''.join(f'<rect x="{-28+i*14}" y="-18" width="6" height="34" fill="#bfdbfe"/>' for i in range(5))+'<rect x="-36" y="16" width="72" height="6" fill="#1d4ed8"/></g><g transform="translate(134 80)"><circle r="14" fill="#fff" stroke="#1d4ed8" stroke-width="3"/><text y="4" text-anchor="middle" font-size="11" '+T+' fill="#1d4ed8">30</text></g>'+pill(88,140,'ฟ้องศาล','#1d4ed8',44),tag=None)
