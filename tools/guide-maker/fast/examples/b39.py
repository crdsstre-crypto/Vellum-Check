import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import RACCOON, FOX, DAYRING, JSCALE, OTTER, SANDGLASS, BEAVER, SEAL
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
D['staff-proxy-court-date']=dict(c1='#ffedd5',c2='#e0f2fe',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='64',tint='#fff7ed',
 hero=doc(88,90,60,72,'#c2410c','มอบฉันทะ')+'<g transform="translate(130 120) rotate(-10)"><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><circle cx="-8" cy="-1" r="5" fill="#94a3b8"/></g>'+RACCOON(52,138,.45),tag=None,tagc='#c2410c')
D['witness-summons-shop']=dict(c1='#fef3c7',c2='#dbeafe',sh='#78350f',bd='#fef3c7',ln='#f59e0b',bg='#b45309',badge='3',tint='#fffbeb',
 hero='<g transform="translate(84 92)"><rect x="-32" y="-22" width="64" height="44" rx="3" fill="#fffaf0" stroke="#b45309" stroke-width="2.5"/><path d="M-32 -22l32 24l32 -24" stroke="#b45309" stroke-width="2.5" fill="none"/><text y="16" text-anchor="middle" font-size="9" fill="#b45309" '+T+'>หมายเรียก</text></g>'+DAYRING(132,62,'3','วัน',.85,'#dc2626',18)+FOX(140,136,.42),tag=None,tagc='#b45309')
D['court-costs-who-pays']=dict(c1='#fce7f3',c2='#fef3c7',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='฿',tint='#fdf2f8',
 hero=JSCALE(92,112,12,'#a16207','','')+''.join(f'<ellipse cx="{70+i*3}" cy="{74-i*5}" rx="11" ry="4" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>' for i in range(4))+OTTER(142,136,.42),tag=None,tagc='#be185d')
D['law-question-first']=dict(c1='#dbeafe',c2='#fce7f3',sh='#1e3a8a',bd='#dbeafe',ln='#60a5fa',bg='#1d4ed8',badge='24',tint='#eff6ff',
 hero=doc(80,92,58,70,'#1d4ed8','อายุความ')+SANDGLASS(128,100,'#be185d',1.2)+BEAVER(50,138,.4),tag=None,tagc='#1d4ed8')
D['minor-customer-lawsuit']=dict(c1='#ede9fe',c2='#cffafe',sh='#4c1d95',bd='#ede9fe',ln='#a78bfa',bg='#7c3aed',badge='17',tint='#f5f3ff',
 hero='<g transform="translate(86 92)"><rect x="-22" y="-38" width="44" height="76" rx="8" fill="#1f2937"/><rect x="-18" y="-31" width="36" height="58" rx="3" fill="#c4b5fd"/><text y="6" text-anchor="middle" font-size="16" fill="#4c1d95" '+T+'>17</text></g>'+SEAL(134,70,'ยินยอม?','#7c3aed',-12,46),tag=None,tagc='#7c3aed')
