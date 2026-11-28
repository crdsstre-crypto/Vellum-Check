import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import RACCOON, CALGRID, OWL, FOX, PANDA
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
D['sme-rehab-eligibility']=dict(c1='#ffedd5',c2='#dcfce7',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='SME',tint='#fff7ed',
 hero='<g transform="translate(48 60)"><rect x="0" y="0" width="84" height="56" rx="4" fill="#fff" stroke="#94a3b8" stroke-width="2"/><path d="M8 12l18 10l18 12l18 8l14 6" stroke="#dc2626" stroke-width="4" fill="none"/><path d="M8 44l30 -10l34 -24" stroke="#16a34a" stroke-width="4" stroke-dasharray="5 3" fill="none"/></g>'+RACCOON(130,138,.32),tag=None,tagc='#c2410c')
D['sme-rehab-petition']=dict(c1='#dbeafe',c2='#ffedd5',sh='#1e3a8a',bd='#dbeafe',ln='#60a5fa',bg='#1d4ed8',badge='2/3',tint='#eff6ff',
 hero=doc(72,94,56,70,'#1d4ed8','แผน')+'<g transform="translate(128 76)"><circle r="20" fill="#e5e7eb"/><path d="M0 0L0 -20A20 20 0 1 1 -17.3 10z" fill="#16a34a"/></g>',tag=None,tagc='#1d4ed8')
D['rehab-claim-objection']=dict(c1='#fef3c7',c2='#e0f2fe',sh='#78350f',bd='#fef3c7',ln='#f59e0b',bg='#a16207',badge='14',tint='#fffbeb',
 hero=doc(76,94,60,72,'#a16207','คำขอ')+'<g transform="translate(126 68)"><circle r="15" fill="#dc2626"/><text y="6" text-anchor="middle" font-size="16" fill="#fff" '+T+'>?</text></g>'+OWL(134,136,.3),tag=None,tagc='#a16207')
D['rehab-missed-claim']=dict(c1='#dcfce7',c2='#ffedd5',sh='#14532d',bd='#dcfce7',ln='#4ade80',bg='#15803d',badge='61',tint='#f0fdf4',
 hero=''.join(f'<rect x="{46+(i%2)*40}" y="{112-(i//2)*26}" width="36" height="22" rx="2" fill="#a16207"/><circle cx="{56+(i%2)*40}" cy="{110-(i//2)*26}" r="5" fill="{c}"/>' for i,c in enumerate(['#16a34a','#f97316','#dc2626','#16a34a']))+'<g transform="translate(130 68)"><circle r="15" fill="#dc2626"/><path d="M-7 -7l14 14M7 -7l-14 14" stroke="#fff" stroke-width="3"/></g>',tag=None,tagc='#15803d')
D['rehab-plan-vote']=dict(c1='#e0f2fe',c2='#fef3c7',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='46',tint='#f0f9ff',
 hero=''.join(f'<rect x="{50+i*28}" y="{136-h}" width="20" height="{h}" fill="{c}"/>' for i,(h,c) in enumerate([(62,'#16a34a'),(54,'#16a34a'),(34,'#dc2626')]))+'<path d="M44 90h96" stroke="#a16207" stroke-width="2" stroke-dasharray="4 3"/>'+PANDA(136,138,.3),tag=None,tagc='#0369a1')
