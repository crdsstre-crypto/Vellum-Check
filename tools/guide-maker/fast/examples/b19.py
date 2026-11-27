T='font-family="sans-serif" font-weight="900"'
def bl(x,y,amt,c,rot=0,w=70,h=38,note=None):
  s=f'<g transform="translate({x} {y}) rotate({rot})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fffdf6" stroke="{c}" stroke-width="2"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="9" rx="4" fill="{c}"/><path d="M{w/2-12} {-h/2}v{h}" stroke="{c}" stroke-dasharray="2 2"/><text x="-6" y="7" text-anchor="middle" font-size="8.4" fill="#334155" {T}>{amt}</text>'
  if note: s+=f'<text x="-6" y="{h/2-4}" text-anchor="middle" font-size="6.6" fill="{c}" {T}>{note}</text>'
  return s+'</g>'
D['draw-bill-of-exchange']=dict(c1='#fde3c4',c2='#fef9c3',sh='#78350f',bd='#fed7aa',ln='#d97706',bg='#b45309',badge='8',tint='#fffbeb',
 hero=bl(86,92,'640,000','#b45309',-6)+'<g transform="translate(130 64) rotate(30)"><rect x="-3" y="-22" width="6" height="34" rx="2" fill="#f59e0b"/><path d="M-3 12l3 8 3-8z" fill="#334155"/></g>'+''.join(f'<circle cx="{58+i*12}" cy="128" r="4.4" fill="#16a34a"/>' for i in range(5)),tag=None)
D['qualified-acceptance']=dict(c1='#fef08a',c2='#fee2e2',sh='#713f12',bd='#fde68a',ln='#eab308',bg='#ca8a04',badge='½',tint='#fefce8',
 hero=bl(92,84,'360,000','#a16207',3)+f'<g transform="translate(92 120) rotate(-6)"><rect x="-30" y="-10" width="60" height="18" rx="4" fill="none" stroke="#dc2626" stroke-width="2.4"/><text y="3" text-anchor="middle" font-size="8" fill="#dc2626" {T}>รับรองครึ่ง</text></g>',tag=None)
D['bill-holder-defenses']=dict(c1='#bae6fd',c2='#dcfce7',sh='#0c4a6e',bd='#bae6fd',ln='#0284c7',bg='#0369a1',badge='🛡',tint='#f0f9ff',
 hero='<path d="M92 50l34 12v24c0 22-16 36-34 42c-18-6-34-20-34-42V62z" fill="#e0f2fe" stroke="#0369a1" stroke-width="2.4"/>'+bl(92,92,'210,000','#0369a1',0,58,32),tag=None)
D['bill-intervention']=dict(c1='#fbcfe8',c2='#e0e7ff',sh='#831843',bd='#fbcfe8',ln='#ec4899',bg='#be185d',badge='🤝',tint='#fdf2f8',
 hero='<path d="M60 74q32-32 64 0z" fill="#f472b6"/><path d="M92 74v40q0 6 6 6" stroke="#831843" stroke-width="3" fill="none"/>'+bl(92,104,'150,000','#be185d',0,62,32),tag=None)
D['endorser-recovery-amount']=dict(c1='#cbd5e1',c2='#fed7aa',sh='#1e293b',bd='#cbd5e1',ln='#64748b',bg='#475569',badge='↩',tint='#f8fafc',
 hero=bl(84,80,'180,000','#475569',-4)+f'<path d="M120 112q-30 26-62 4" stroke="#ea580c" stroke-width="3" fill="none"/><path d="M58 116l-2-10 10 4z" fill="#ea580c"/><g transform="translate(118 126)"><rect x="-16" y="-8" width="32" height="15" rx="4" fill="#fff" stroke="#ea580c" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7.4" fill="#c2410c" {T}>+5%</text></g>',tag=None)
