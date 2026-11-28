T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def calf(x,y,s=.45):
  c='#fafaf9'
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="8" rx="15" ry="11" fill="{c}" stroke="#d6d3d1"/><ellipse cx="-6" cy="6" rx="5" ry="4" fill="#44403c"/><circle cx="0" cy="-10" r="11" fill="{c}" stroke="#d6d3d1"/><ellipse cx="4" cy="-16" rx="4" ry="3" fill="#44403c"/>'
   '<ellipse cx="0" cy="-3" rx="7" ry="5" fill="#fbcfe8" stroke="#f9a8d4"/><circle cx="-4.5" cy="-11" r="2" fill="#1c1917"/><circle cx="4.5" cy="-11" r="2" fill="#1c1917"/><circle cx="-4" cy="-11.6" r=".7" fill="#fff"/><circle cx="5" cy="-11.6" r=".7" fill="#fff"/><ellipse cx="-8.5" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/><ellipse cx="8.5" cy="-6" rx="2" ry="1.2" fill="#fb7185" opacity=".6"/></g>')
def globe(x,y,c):
  return f'<g transform="translate({x} {y})"><circle r="22" fill="#bae6fd" stroke="{c}" stroke-width="2.5"/><path d="M-22 0h44M0 -22q13 22 0 44M0 -22q-13 22 0 44" stroke="{c}" fill="none"/><g transform="translate(2 -14)"><path d="M0 0c-7 -9 -7 -16 0 -16s7 7 0 16z" fill="#dc2626"/><circle cy="-10" r="2.5" fill="#fff"/></g></g>'
def ring(x,y,t,c):
  return f'<g transform="translate({x} {y})"><circle r="14" fill="#fff" stroke="{c}" stroke-width="3"/><text y="4" text-anchor="middle" font-size="9" '+T+f' fill="{c}">{t}</text></g>'
D['foreigner-land-for-shop']=dict(c1='#dcfce7',c2='#fef3c7',sh='#14532d',bd='#dcfce7',ln='#86efac',bg='#15803d',badge='🌍',tint='#f0fdf4',
 hero=globe(82,100,'#15803d')+calf(136,122)+pill(86,140,'≤ 1 ไร่','#15803d',40),tag=None)
D['foreigner-land-use-change-sell']=dict(c1='#fee2e2',c2='#ffedd5',sh='#7f1d1d',bd='#fee2e2',ln='#fca5a5',bg='#b91c1c',badge='⏳',tint='#fef2f2',
 hero='<g transform="translate(80 104)"><path d="M-16 -26h32M-16 26h32M-14 -26q0 22 14 26q-14 4 -14 26M14 -26q0 22 -14 26q14 4 14 26" stroke="#92400e" stroke-width="2.5" fill="#fde68a"/></g>'+ring(134,80,'30','#b91c1c')+pill(86,140,'แจ้ง/ขาย','#b91c1c',44),tag=None)
D['foreign-share-company-land']=dict(c1='#e0e7ff',c2='#e0f2fe',sh='#1e1b4b',bd='#e0e7ff',ln='#a5b4fc',bg='#3730a3',badge='🥧',tint='#eef2ff',
 hero='<g transform="translate(84 100)"><circle r="26" fill="#e0f2fe"/><path d="M0 0v-26a26 26 0 0 1 8 25z" fill="#3730a3"/><path d="M0 0v-26a26 26 0 0 1 4.1 25.7" fill="none"/><path d="M0 0L1.6 -29" stroke="#1e293b" stroke-width="2" stroke-dasharray="3 2"/><text x="6" y="-30" font-size="8" '+T+' fill="#1e293b">49%</text></g>'+calf(138,124)+pill(86,140,'หุ้นต่างชาติ','#3730a3',52),tag=None)
D['land-nominee-for-foreigner']=dict(c1='#d1fae5',c2='#fee2e2',sh='#134e4a',bd='#d1fae5',ln='#6ee7b7',bg='#0f766e',badge='🚫',tint='#ecfdf5',
 hero='<g transform="translate(82 100)"><rect x="-26" y="-30" width="52" height="58" rx="3" fill="#fffbeb" stroke="#0f766e" stroke-width="2"/><rect x="-26" y="-30" width="52" height="12" fill="#0f766e"/><text y="-21" text-anchor="middle" font-size="8" '+T+' fill="#fff">โฉนด</text></g><g transform="translate(134 84)"><circle r="16" fill="none" stroke="#dc2626" stroke-width="4"/><path d="M-11 -11l22 22" stroke="#dc2626" stroke-width="4"/></g>'+pill(86,140,'ถือแทน','#0f766e',40),tag=None)
D['condo-unit-buy-for-shop-check']=dict(c1='#ffedd5',c2='#ccfbf1',sh='#7c2d12',bd='#ffedd5',ln='#fdba74',bg='#c2410c',badge='🥐',tint='#fff7ed',
 hero='<g transform="translate(78 120)"><rect x="-24" y="-78" width="48" height="88" rx="2" fill="#c2410c"/>'+''.join(f'<rect x="{-18+j*12}" y="{-10-i*14}" width="8" height="9" rx="1" fill="#fff" opacity=".8"/>' for i in range(5) for j in range(3))+'<rect x="-20" y="0" width="18" height="8" fill="#fde047"/></g><g transform="translate(134 88)"><circle r="12" fill="#e0f2fe" fill-opacity=".6" stroke="#334155" stroke-width="3"/><path d="M9 9l10 10" stroke="#334155" stroke-width="4"/></g>'+pill(86,140,'เช็กก่อนซื้อ','#c2410c',54),tag=None)
