T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D['consignee-refuses-delivery']=dict(c1='#fef08a',c2='#bae6fd',sh='#713f12',bd='#fef08a',ln='#eab308',bg='#a16207',badge='↩',tint='#fefce8',
 hero='<rect x="62" y="80" width="60" height="44" rx="3" fill="#d6b48a" stroke="#92400e" stroke-width="2"/><path d="M62 94h60M92 80v44" stroke="#92400e" stroke-width="2"/><circle cx="122" cy="76" r="11" fill="#dc2626"/><path d="M117 71l10 10M127 71l-10 10" stroke="#fff" stroke-width="2.4"/>'+pill(92,140,'ไม่รับของ','#a16207',50),tag=None)
D['cargo-transit-insurance']=dict(c1='#fed7aa',c2='#dbeafe',sh='#7c2d12',bd='#fed7aa',ln='#f97316',bg='#c2410c',badge='☂',tint='#fff7ed',
 hero='<path d="M60 88q32-36 64 0z" fill="#3b82f6"/><path d="M92 88v34q0 6 6 6" stroke="#1e3a8a" stroke-width="3" fill="none"/><path d="M70 122l4-24h12l4 24z" fill="#ea580c"/><path d="M98 122l4-20h10l4 20z" fill="#f59e0b"/>',tag=None)
D['shop-insurance-premium-rights']=dict(c1='#fed7aa',c2='#d1fae5',sh='#7c2d12',bd='#fed7aa',ln='#ea580c',bg='#c2410c',badge='↓',tint='#fff7ed',
 hero='<rect x="64" y="62" width="56" height="74" rx="4" fill="#fff" stroke="#c2410c" stroke-width="2"/><path d="M92 76q-12 14-4 24q-10-2-10 10a14 14 0 0 0 28 0q0-10-14-34z" fill="#f97316"/>'+pill(92,128,'เบี้ยลด','#16a34a',40),tag=None)
D['self-help-stray-animal']=dict(c1='#bbf7d0',c2='#fefce8',sh='#14532d',bd='#bbf7d0',ln='#22c55e',bg='#15803d',badge='🐐',tint='#f0fdf4',
 hero='<g transform="translate(92 104)"><ellipse rx="26" ry="14" fill="#f8fafc" stroke="#a8a29e"/><circle cx="24" cy="-12" r="10" fill="#f8fafc" stroke="#a8a29e"/><path d="M20-22l-3-9M28-22l3-9" stroke="#78716c" stroke-width="3"/><path d="M-14 12v12M12 12v12" stroke="#d6d3d1" stroke-width="4"/></g>'+''.join(f'<path d="M{58+i*14} 140q4-14 8 0" fill="#22c55e"/>' for i in range(5)),tag=None)
D['rented-shop-repair-contractor']=dict(c1='#e2e8f0',c2='#fce7f3',sh='#334155',bd='#e2e8f0',ln='#64748b',bg='#475569',badge='🔧',tint='#f8fafc',
 hero='<path d="M56 96l36-28 36 28z" fill="#db2777"/><rect x="64" y="96" width="56" height="40" fill="#fff" stroke="#64748b" stroke-width="2"/><path d="M98 74l6 8-6 8" stroke="#60a5fa" stroke-width="2" fill="none"/><path d="M102 92v14" stroke="#60a5fa" stroke-dasharray="2 3" stroke-width="2"/>'+pill(92,124,'ซ่อมด่วน','#475569',44),tag=None)
