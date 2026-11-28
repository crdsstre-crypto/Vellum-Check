T='font-family="sans-serif" font-weight="900"'
def pill(x,y,t,c,w=44):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="-8" width="{w}" height="15" rx="7" fill="#fff" stroke="{c}" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7" fill="{c}" {T}>{t}</text></g>'
D={} if 'D' not in dir() else D
def ring(x,y,t,c,u='วัน'):
  return f'<g transform="translate({x} {y})"><circle r="17" fill="#fff" stroke="{c}" stroke-width="4" stroke-dasharray="70 40" transform="rotate(-90)"/><text y="2" text-anchor="middle" font-size="12" fill="{c}" {T}>{t}</text><text y="11" text-anchor="middle" font-size="6" fill="{c}" {T}>{u}</text></g>'
def doc(x,y,t,c,r=-6):
  return f'<g transform="translate({x} {y}) rotate({r})"><rect x="-22" y="-28" width="44" height="56" rx="3" fill="#fff" stroke="{c}" stroke-width="2"/><rect x="-22" y="-28" width="44" height="11" rx="3" fill="{c}"/><text y="-20" text-anchor="middle" font-size="6.5" fill="#fff" {T}>{t}</text>'+''.join(f'<rect x="-15" y="{-10+i*8}" width="{30-(i%2)*8}" height="3" rx="1.5" fill="{c}" opacity=".3"/>' for i in range(4))+'</g>'
def owl(x,y,s=.55):
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="16" ry="3" fill="#000" opacity=".12"/><ellipse cx="0" cy="4" rx="15" ry="18" fill="#d6b48a" stroke="#92400e"/><ellipse cx="0" cy="10" rx="9" ry="10" fill="#fef3c7"/><path d="M-13 -12l-3 -9 8 5zM13 -12l3 -9 -8 5z" fill="#a16207"/>'
   '<circle cx="-6" cy="-6" r="6" fill="#fff" stroke="#92400e"/><circle cx="6" cy="-6" r="6" fill="#fff" stroke="#92400e"/><circle cx="-6" cy="-5.5" r="3.4" fill="#1c1917"/><circle cx="6" cy="-5.5" r="3.4" fill="#1c1917"/><circle cx="-5" cy="-6.6" r="1.2" fill="#fff"/><circle cx="7" cy="-6.6" r="1.2" fill="#fff"/><path d="M-2 0l2 4 2-4z" fill="#f97316"/><ellipse cx="-11" cy="2" rx="2.4" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="11" cy="2" rx="2.4" ry="1.3" fill="#fb7185" opacity=".55"/></g>')
def bldg(x,y,c,t):
  w=''.join(f'<rect x="{-26+(i%3)*19}" y="{-40+(i//3)*14}" width="12" height="9" rx="1.5" fill="#e0f2fe" stroke="#94a3b8"/>' for i in range(9))
  return f'<g transform="translate({x} {y})"><rect x="-32" y="-46" width="64" height="70" rx="2" fill="#fff7ed" stroke="#a8a29e"/>'+w+f'<rect x="-32" y="6" width="64" height="18" fill="{c}" opacity=".35"/><rect x="-26" y="-58" width="52" height="12" rx="3" fill="{c}"/><text y="-49.5" font-size="7" text-anchor="middle" fill="#fff" {T}>{t}</text></g>'
def koala(x,y,s=.55):
  c='#cbd5e1'
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="22" rx="17" ry="3" fill="#000" opacity=".12"/><ellipse cx="0" cy="10" rx="15" ry="13" fill="{c}" stroke="#64748b"/><circle cx="-14" cy="-12" r="8" fill="{c}" stroke="#64748b"/><circle cx="14" cy="-12" r="8" fill="{c}" stroke="#64748b"/><circle cx="-14" cy="-12" r="4.5" fill="#f8fafc"/><circle cx="14" cy="-12" r="4.5" fill="#f8fafc"/>'
   f'<circle cx="0" cy="-5" r="12" fill="{c}" stroke="#64748b"/><circle cx="-5" cy="-7" r="2.2" fill="#1c1917"/><circle cx="5" cy="-7" r="2.2" fill="#1c1917"/><circle cx="-4.3" cy="-7.7" r=".8" fill="#fff"/><circle cx="5.7" cy="-7.7" r=".8" fill="#fff"/><ellipse cx="0" cy="-1" rx="3.4" ry="4.2" fill="#334155"/><ellipse cx="-8" cy="1" rx="2.3" ry="1.3" fill="#fb7185" opacity=".55"/><ellipse cx="8" cy="1" rx="2.3" ry="1.3" fill="#fb7185" opacity=".55"/></g>')
def fine(x,y,a,c):
  return f'<g transform="translate({x} {y}) rotate(-5)"><rect x="-30" y="-20" width="60" height="40" rx="3" fill="#fff" stroke="{c}" stroke-width="2"/><rect x="-30" y="-20" width="60" height="10" rx="3" fill="{c}"/><text y="7" font-size="10" text-anchor="middle" fill="{c}" {T}>{a}</text></g>'
D['dorm-license-revoke-steps']=dict(c1='#e0f2fe',c2='#ffedd5',sh='#0c4a6e',bd='#e0f2fe',ln='#7dd3fc',bg='#0369a1',badge='📄',tint='#f0f9ff',
 hero=doc(80,100,'ใบอนุญาต','#0369a1')+'<path d="M58 78l44 44" stroke="#dc2626" stroke-width="5" opacity=".7"/>'+ring(140,84,'60','#c2410c')+koala(138,128,.5)+pill(80,146,'แจ้งก่อน','#0369a1',44),tag=None)
D['dorm-inspector-visit-unlicensed']=dict(c1='#ede9fe',c2='#fef9c3',sh='#312e81',bd='#ede9fe',ln='#c4b5fd',bg='#4338ca',badge='🔍',tint='#f5f3ff',
 hero=bldg(80,106,'#4338ca','หอพัก')+'<g transform="translate(136 92)"><circle r="14" fill="#fff" stroke="#4338ca" stroke-width="4"/><path d="M10 10l12 12" stroke="#4338ca" stroke-width="5"/></g>'+pill(84,146,'ขึ้น→ตก','#4338ca',46),tag=None)
D['dorm-money-fines-settle']=dict(c1='#dbeafe',c2='#fce7f3',sh='#1e3a8a',bd='#dbeafe',ln='#93c5fd',bg='#1d4ed8',badge='💰',tint='#eff6ff',
 hero='<g transform="translate(70 108)"><path d="M-18 -6q-6 22 18 26q24 -4 18 -26z" fill="#fcd34d" stroke="#b45309" stroke-width="2"/><path d="M-10 -10h20l-4 -6h-12z" fill="#fcd34d" stroke="#b45309"/><text y="10" font-size="9" text-anchor="middle" fill="#92400e" '+T+'>≤1</text></g>'+fine(130,92,'100,000','#1d4ed8')+ring(138,132,'15','#be185d')+pill(76,146,'เงินประกัน','#1d4ed8',48),tag=None)
D['dorm-license-manager-penalties']=dict(c1='#ffedd5',c2='#f3e8ff',sh='#7c2d12',bd='#ffedd5',ln='#fdba74',bg='#c2410c',badge='⚠️',tint='#fff7ed',
 hero=bldg(78,106,'#c2410c','หอพัก')+fine(134,94,'วันละ','#c2410c')+'<text x="134" y="114" font-size="7" text-anchor="middle" fill="#9a3412" '+T+'>≤10,000</text>'+pill(82,146,'ไม่มีใบอนุญาต','#c2410c',60),tag=None)
D['dorm-duty-fines-award-perks']=dict(c1='#fef9c3',c2='#dbeafe',sh='#713f12',bd='#fef9c3',ln='#fde047',bg='#b45309',badge='🏆',tint='#fefce8',
 hero='<g transform="translate(82 100)"><path d="M-22 -30h44v10a22 22 0 0 1-44 0z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><path d="M-22 -22h-9a9 9 0 0 0 9 14M22 -22h9a9 9 0 0 1-9 14" stroke="#b45309" stroke-width="3" fill="none"/><rect x="-5" y="2" width="10" height="12" fill="#d97706"/><rect x="-18" y="14" width="36" height="12" rx="2" fill="#78350f"/></g>'+koala(138,120,.55)+pill(84,146,'ลดภาษีได้','#b45309',48),tag=None)
