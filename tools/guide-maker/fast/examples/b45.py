T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def hip(x,y,s=.45):
  c='#c4b5fd'
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="10" rx="17" ry="13" fill="{c}" stroke="#a78bfa"/><ellipse cx="0" cy="-6" rx="13" ry="10" fill="{c}" stroke="#a78bfa"/><ellipse cx="0" cy="0" rx="12" ry="7" fill="#ddd6fe" stroke="#a78bfa"/>'
   f'<circle cx="-9" cy="-16" r="3" fill="{c}"/><circle cx="9" cy="-16" r="3" fill="{c}"/><circle cx="-5" cy="-11" r="2" fill="#1c1917"/><circle cx="5" cy="-11" r="2" fill="#1c1917"/><circle cx="-4.4" cy="-11.6" r=".7" fill="#fff"/><circle cx="5.6" cy="-11.6" r=".7" fill="#fff"/><ellipse cx="-11" cy="-3" rx="2.3" ry="1.3" fill="#fb7185" opacity=".6"/><ellipse cx="11" cy="-3" rx="2.3" ry="1.3" fill="#fb7185" opacity=".6"/></g>')
def ring(x,y,t,c):
  return f'<g transform="translate({x} {y})"><circle r="14" fill="#fff" stroke="{c}" stroke-width="3"/><text y="4" text-anchor="middle" font-size="9" '+T+f' fill="{c}">{t}</text></g>'
def condo(x,y,c):
  return f'<g transform="translate({x} {y})"><rect x="-24" y="-78" width="48" height="88" rx="2" fill="{c}"/>'+''.join(f'<rect x="{-18+j*12}" y="{-10-i*14}" width="8" height="9" rx="1" fill="#fff" opacity=".8"/>' for i in range(5) for j in range(3))+'</g>'
D['condo-foreign-heir-nationality']=dict(c1='#fce7f3',c2='#e0e7ff',sh='#831843',bd='#fce7f3',ln='#f9a8d4',bg='#be185d',badge='🛂',tint='#fdf2f8',
 hero=condo(74,120,'#be185d')+ring(132,80,'60','#be185d')+pill(88,140,'มรดก/สัญชาติ','#be185d',60),tag=None)
D['condo-company-turns-foreign-nominee']=dict(c1='#fae8ff',c2='#fee2e2',sh='#701a75',bd='#fae8ff',ln='#f0abfc',bg='#a21caf',badge='🏢',tint='#fdf4ff',
 hero=condo(74,120,'#a21caf')+'<g transform="translate(132 84)"><circle r="16" fill="none" stroke="#dc2626" stroke-width="4"/><path d="M-11 -11l22 22" stroke="#dc2626" stroke-width="4"/></g>'+pill(88,140,'ถือแทน','#a21caf',40),tag=None)
D['neighbor-illegal-build-victim']=dict(c1='#fef9c3',c2='#ffedd5',sh='#713f12',bd='#fef9c3',ln='#fde047',bg='#ca8a04',badge='🏚️',tint='#fefce8',
 hero='<g transform="translate(84 104)"><rect x="-28" y="-28" width="56" height="56" fill="#e7e5e4" stroke="#64748b"/><path d="M-6 -28l4 14l-6 10l8 12l-4 14" stroke="#44403c" stroke-width="2.5" fill="none"/><path d="M-34 -38h68l-6 10h-56z" fill="#9ca3af"/>'+''.join(f'<path d="M{-18+i*8} {-24+(i%2)*6}l-2 7" stroke="#38bdf8" stroke-width="2"/>' for i in range(5))+'</g>'+hip(138,124)+pill(86,142,'ผู้เสียหาย','#ca8a04',48),tag=None)
D['condo-officer-inspect-juristic']=dict(c1='#ede9fe',c2='#e0f2fe',sh='#2e1065',bd='#ede9fe',ln='#c4b5fd',bg='#6d28d9',badge='🔍',tint='#f5f3ff',
 hero='<g transform="translate(80 104)"><rect x="-30" y="-22" width="60" height="40" rx="3" fill="#d6a77a" stroke="#92400e" stroke-width="1.5"/><rect x="-22" y="-6" width="44" height="14" fill="#fff" stroke="#dc2626" stroke-width="1.5"/><text y="4" text-anchor="middle" font-size="9" '+T+' fill="#dc2626">อายัด</text></g><g transform="translate(134 82)"><rect x="-16" y="-11" width="32" height="22" rx="3" fill="#fff" stroke="#6d28d9" stroke-width="2"/><rect x="-12" y="-7" width="9" height="11" fill="#c4b5fd"/></g>'+pill(86,140,'ตรวจนิติฯ','#6d28d9',46),tag=None)
D['cafe-ride-architect-plan-rules']=dict(c1='#dcfce7',c2='#fef9c3',sh='#14532d',bd='#dcfce7',ln='#86efac',bg='#15803d',badge='🛝',tint='#f0fdf4',
 hero='<g transform="translate(84 104)"><path d="M-24 26v-48M-12 26v-48" stroke="#3b82f6" stroke-width="3.5"/>'+''.join(f'<path d="M-24 {16-i*11}h12" stroke="#3b82f6" stroke-width="2.5"/>' for i in range(4))+'<rect x="-28" y="-28" width="20" height="6" rx="2" fill="#facc15"/><path d="M-10 -24q22 4 38 42l6 4" stroke="#f97316" stroke-width="8" fill="none" stroke-linecap="round"/></g>'+hip(140,122)+pill(86,142,'เครื่องเล่น','#15803d',50),tag=None)
