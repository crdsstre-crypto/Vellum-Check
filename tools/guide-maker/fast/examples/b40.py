T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def duck(x,y,s=.45):
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="8" rx="14" ry="12" fill="#fde047" stroke="#eab308"/><circle cx="-2" cy="-10" r="11" fill="#fde047" stroke="#eab308"/><path d="M-14 -8q-8 1 -9 4q6 3 10 0z" fill="#fb923c"/>'
   '<circle cx="-6" cy="-13" r="2" fill="#1c1917"/><circle cx="2" cy="-13" r="2" fill="#1c1917"/><circle cx="-5.4" cy="-13.6" r=".7" fill="#fff"/><circle cx="2.6" cy="-13.6" r=".7" fill="#fff"/><ellipse cx="-9" cy="-6" rx="2.2" ry="1.3" fill="#fb7185" opacity=".6"/><ellipse cx="5" cy="-7" rx="2.2" ry="1.3" fill="#fb7185" opacity=".6"/></g>')
def sacks(x,y,c,t):
  o=''
  for r,k in [(0,3),(1,2)]:
    for i in range(k):
      cx=(i-(k-1)/2)*26; cy=-r*16
      o+=f'<g transform="translate({cx} {cy})"><path d="M-12 -8q12 -5 24 0v14q-12 5 -24 0z" fill="{c}" stroke="#a8a29e"/><text y="3" text-anchor="middle" font-size="7" '+T+f' fill="#78716c">{t}</text></g>'
  return f'<g transform="translate({x} {y})">{o}</g>'
D['warehouse-receipt-split-lost']=dict(c1='#fef3c7',c2='#f5f5f4',sh='#57534e',bd='#fef3c7',ln='#fcd34d',bg='#a16207',badge='🌾',tint='#fffbeb',
 hero=sacks(78,116,'#fafaf9','ข้าว')+'<g transform="translate(134 82)"><circle r="14" fill="#fff" stroke="#a16207" stroke-width="3"/><text y="5" text-anchor="middle" font-size="14" '+T+' fill="#dc2626">?</text></g>'+pill(88,140,'ใบรับหาย','#a16207',46),tag=None)
D['warehouse-pledge-notice-auction']=dict(c1='#fce7f3',c2='#fff1f2',sh='#831843',bd='#fce7f3',ln='#f9a8d4',bg='#be185d',badge='🍬',tint='#fdf2f8',
 hero=sacks(78,116,'#fff','น้ำตาล')+'<g transform="translate(134 80) rotate(8)"><rect x="-18" y="-12" width="36" height="24" rx="2" fill="#fff" stroke="#be185d" stroke-width="2"/><path d="M-18 -12l18 13l18 -13" stroke="#be185d" stroke-width="1.5" fill="none"/></g>'+pill(88,140,'แจ้งนายคลัง','#be185d',56),tag=None)
D['bill-of-exchange-set-copies']=dict(c1='#e0f2fe',c2='#ecfeff',sh='#0c4a6e',bd='#e0f2fe',ln='#7dd3fc',bg='#0369a1',badge='🧾',tint='#f0f9ff',
 hero=''.join(f'<g transform="translate({80+i*16} {92+i*14}) rotate({-6+i*8})"><rect x="-32" y="-18" width="64" height="36" rx="2" fill="#f0f9ff" stroke="#0369a1" stroke-width="2"/><path d="M-24 0h30M-24 7h22" stroke="#bae6fd" stroke-width="2.5"/><rect x="12" y="-6" width="16" height="12" rx="2" fill="#0369a1"/><text x="20" y="3" text-anchor="middle" font-size="7.5" '+T+f' fill="#fff">{i+1}/2</text></g>' for i in range(2))+pill(88,140,'คู่ฉีก','#0369a1',40),tag=None)
D['band-performer-moral-rights']=dict(c1='#ede9fe',c2='#fce7f3',sh='#2e1065',bd='#ede9fe',ln='#c4b5fd',bg='#7c3aed',badge='🥁',tint='#f5f3ff',
 hero='<g transform="translate(84 108)"><ellipse cx="0" cy="-6" rx="20" ry="7" fill="#e5e7eb" stroke="#475569"/><rect x="-20" y="-6" width="40" height="20" fill="#be123c"/><ellipse cx="-30" cy="-14" rx="12" ry="4" fill="#facc15"/><path d="M-30 -14v26" stroke="#475569" stroke-width="2"/></g><g transform="translate(134 80)"><path d="M-10 -10l20 20M10 -10l-20 20" stroke="#7c3aed" stroke-width="3"/><circle cx="-12" cy="12" r="5" fill="none" stroke="#7c3aed" stroke-width="2.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="#7c3aed" stroke-width="2.5"/></g>'+pill(88,140,'คลิปวงดนตรี','#7c3aed',56),tag=None)
D['patent-fees-both-types-state-use']=dict(c1='#ffedd5',c2='#fff7ed',sh='#7c2d12',bd='#ffedd5',ln='#fdba74',bg='#c2410c',badge='💡',tint='#fff7ed',
 hero='<g transform="translate(80 108)"><rect x="-24" y="-14" width="48" height="34" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M-26 -14q26 -18 52 0z" fill="#fb923c" stroke="#c2410c"/><circle cy="-22" r="4" fill="#c2410c"/></g>'+duck(134,118)+pill(88,140,'1,000 บาท','#c2410c',50),tag=None)
