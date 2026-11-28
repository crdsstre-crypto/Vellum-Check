import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import ALPACA, HIPPO, OWL, KOALA, FOX, GAVEL
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
def ring(x,y,t,c):
  return f'<g transform="translate({x} {y})"><circle r="16" fill="#fff" stroke="{c}" stroke-width="3"/><path d="M0 -16a16 16 0 1 1 -15 6" stroke="{c}" stroke-width="5" fill="none" opacity=".35"/><text y="4" text-anchor="middle" font-size="11" fill="{c}" {T}>{t}</text></g>'
LED='<g transform="translate(108 60)"><rect width="34" height="20" rx="3" fill="#1e293b"/>'+''.join(f'<circle cx="{6+i*7.4}" cy="10" r="2.4" fill="#fde047"/>' for i in range(4))+'</g>'
D['rehab-debtor-statement-summons']=dict(c1='#dbeafe',c2='#fef9c3',sh='#1e3a8a',bd='#dbeafe',ln='#60a5fa',bg='#1e40af',badge='37',tint='#eff6ff',
 hero=doc(74,96,60,70,'#1e40af','หมายเรียก')+LED+HIPPO(132,142,.4),tag=None,tagc='#1e40af')
D['rehab-plan-meeting-stall']=dict(c1='#ede9fe',c2='#ecfccb',sh='#4c1d95',bd='#ede9fe',ln='#a78bfa',bg='#6d28d9',badge='51',tint='#f5f3ff',
 hero='<g transform="translate(56 76)"><rect x="0" y="0" width="40" height="34" rx="6" fill="#c4b5fd" stroke="#6d28d9" stroke-width="2.5"/><rect x="-4" y="32" width="48" height="10" rx="3" fill="#a78bfa" stroke="#6d28d9" stroke-width="2.5"/><path d="M4 42v18M36 42v18" stroke="#6d28d9" stroke-width="4"/><text x="20" y="22" text-anchor="middle" font-size="16" fill="#6d28d9" '+T+'>?</text></g>'+ring(122,70,'45','#ea580c')+ALPACA(134,146,.4),tag=None,tagc='#6d28d9')
D['rehab-creditor-committee-court']=dict(c1='#ffedd5',c2='#dcfce7',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='57',tint='#fff7ed',
 hero=doc(72,94,60,72,'#166534','ค้านแผน')+GAVEL(122,96,.85)+OWL(138,138,.32),tag=None,tagc='#c2410c')
D['rehab-false-claim-crime']=dict(c1='#fce7f3',c2='#f1f5f9',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='80',tint='#fdf2f8',
 hero=doc(76,94,64,74,'#9d174d','คำขอ')+'<text x="76" y="104" text-anchor="middle" font-size="11" fill="#b91c1c" '+T+'>25 ล้าน</text><path d="M50 100l52 0" stroke="#dc2626" stroke-width="3"/><g transform="translate(124 70) rotate(-14)"><rect x="-20" y="-10" width="40" height="20" rx="4" fill="none" stroke="#dc2626" stroke-width="2.6"/><text y="4" text-anchor="middle" font-size="10" fill="#dc2626" '+T+'>เท็จ</text></g>'+KOALA(136,140,.3),tag=None,tagc='#be185d')
D['rehab-vote-buying-crime']=dict(c1='#fde68a',c2='#cffafe',sh='#78350f',bd='#fde68a',ln='#f59e0b',bg='#b45309',badge='86',tint='#fffbeb',
 hero='<g transform="translate(50 76)"><rect width="64" height="42" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2.5"/><path d="M0 0l32 22l32 -22" fill="none" stroke="#b45309" stroke-width="2.5"/><text x="32" y="36" text-anchor="middle" font-size="11" fill="#15803d" '+T+'>฿ +20%</text></g><g transform="translate(124 72)"><circle r="16" fill="#fff" stroke="#dc2626" stroke-width="3"/><path d="M-11 -11l22 22" stroke="#dc2626" stroke-width="3.5"/></g>'+FOX(136,140,.3),tag=None,tagc='#b45309')
