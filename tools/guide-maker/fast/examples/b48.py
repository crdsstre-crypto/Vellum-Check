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
D['discharged-debtor-revoke-new-debt']=dict(c1='#ecfccb',c2='#e0e7ff',sh='#365314',bd='#ecfccb',ln='#bef264',bg='#4d7c0f',badge='📰',tint='#f7fee7',
 hero=doc(82,100,'คำสั่งปลด','#4d7c0f')+'<path d="M58 78l48 48M106 78l-48 48" stroke="#dc2626" stroke-width="5" opacity=".75"/>'+owl(138,118,.6)+pill(86,144,'เพิกถอนได้','#4d7c0f',50),tag=None)
D['dorm-manager-license-shop']=dict(c1='#e0f2fe',c2='#f3e8ff',sh='#0c4a6e',bd='#e0f2fe',ln='#7dd3fc',bg='#0369a1',badge='🏠',tint='#f0f9ff',
 hero=bldg(80,104,'#0ea5e9','หอพัก')+'<g transform="translate(138 86)"><rect x="-18" y="-13" width="36" height="26" rx="3" fill="#fff" stroke="#0369a1" stroke-width="2"/><circle cx="-8" cy="-2" r="5" fill="#bae6fd"/><rect x="0" y="-5" width="13" height="3" fill="#0369a1"/><rect x="0" y="1" width="9" height="3" fill="#7dd3fc"/></g>'+ring(140,126,'30','#0369a1','ปี')+pill(80,144,'ผู้จัดการ','#0369a1',46),tag=None)
D['dorm-rules-sign-insurance']=dict(c1='#ccfbf1',c2='#fce7f3',sh='#134e4a',bd='#ccfbf1',ln='#5eead4',bg='#0f766e',badge='🛡️',tint='#f0fdfa',
 hero=bldg(80,104,'#ec4899','หอพักหญิง')+'<g transform="translate(138 96)"><path d="M0 -22l18 7v11c0 13-9 20-18 24c-9-4-18-11-18-24v-11z" fill="#14b8a6" stroke="#0f766e" stroke-width="2"/><path d="M-7 2l5 5 9-10" stroke="#fff" stroke-width="3" fill="none"/></g>'+pill(86,144,'ประกันภัย','#0f766e',48),tag=None)
D['dorm-register-duties-7days']=dict(c1='#dbeafe',c2='#fee2e2',sh='#1e3a8a',bd='#dbeafe',ln='#93c5fd',bg='#1d4ed8',badge='📒',tint='#eff6ff',
 hero=doc(80,100,'ทะเบียนผู้พัก','#1d4ed8',-4)+ring(138,86,'7','#1d4ed8')+'<g transform="translate(138 128)"><rect x="-8" y="-12" width="10" height="24" rx="4" fill="#dc2626"/><rect x="5" y="-2" width="14" height="12" rx="2" fill="#fff" stroke="#16a34a" stroke-width="1.5"/><path d="M12 0v8M8 4h8" stroke="#16a34a" stroke-width="2.5"/></g>'+pill(80,146,'ส่งใน 7 วัน','#1d4ed8',50),tag=None)
D['dorm-renovate-rename-close']=dict(c1='#fef9c3',c2='#fce7f3',sh='#713f12',bd='#fef9c3',ln='#fde047',bg='#a16207',badge='📦',tint='#fefce8',
 hero=bldg(80,104,'#a16207','หอพัก')+''.join(f'<rect x="{118+i*16}" y="{116-(i%2)*12}" width="18" height="15" rx="2" fill="#d6a76a" stroke="#92400e"/>' for i in range(2))+ring(140,80,'90','#be185d')+pill(80,146,'แจ้ง 90 วัน','#a16207',50),tag=None)
