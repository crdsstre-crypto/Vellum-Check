import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import RABBIT, GOAT, TOUCAN, OWL
from gx import FOX
T='font-family="sans-serif" font-weight="900"'
def ring(x,y,t,c,fs=10):
  return f'<g transform="translate({x} {y})"><circle r="16" fill="#fff" stroke="{c}" stroke-width="3"/><path d="M0 -16a16 16 0 1 1 -15 6" stroke="{c}" stroke-width="5" fill="none" opacity=".35"/><text y="4" text-anchor="middle" font-size="{fs}" fill="{c}" {T}>{t}</text></g>'
GRID='<g transform="translate(44 64)">'+''.join(f'<rect x="{(i%4)*17}" y="{(i//4)*17}" width="15" height="15" fill="{c}" stroke="#15803d" stroke-width="1.4"/>' for i,c in enumerate(['#bbf7d0','#86efac']*6))+'</g>'
DEED='<g transform="translate(46 60)"><rect width="56" height="68" rx="4" fill="#fff" stroke="#dc2626" stroke-width="2.4"/><circle cx="28" cy="16" r="8" fill="#fecaca" stroke="#dc2626"/>'+''.join(f'<rect x="10" y="{30+i*9}" width="36" height="4" rx="2" fill="#fca5a5"/>' for i in range(4))+'</g>'
BILL='<g transform="translate(42 64)"><rect width="76" height="46" rx="4" fill="#fff" stroke="#ea580c" stroke-width="2.4"/><rect x="8" y="24" width="30" height="14" rx="5" fill="#38bdf8"/><circle cx="56" cy="20" r="9" fill="#86efac"/><path d="M38 46v14M58 46v14" stroke="#57534e" stroke-width="3"/></g>'
ROAD='<g transform="translate(42 70)"><rect width="76" height="26" fill="#a8a29e"/><path d="M4 13h68" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/><g transform="translate(26 -14)">'+''.join(f'<path d="M{i*6} 0l6 40M{i*6+6} 0l-6 40" stroke="#be185d" stroke-width="1.6"/>' for i in range(4))+'</g></g>'
BOARD='<g transform="translate(46 58)"><rect width="62" height="44" fill="#fff" stroke="#1d4ed8" stroke-width="2.4"/><rect x="6" y="6" width="50" height="7" fill="#1d4ed8"/><path d="M12 22l38 16M50 22l-38 16" stroke="#dc2626" stroke-width="4"/><path d="M31 44v26" stroke="#57534e" stroke-width="4"/></g>'
D['land-split-ten-plots-permit']=dict(c1='#dcfce7',c2='#fef9c3',sh='#14532d',bd='#dcfce7',ln='#86efac',bg='#15803d',badge='10',tint='#f0fdf4',hero=GRID+ring(126,62,'3ปี','#15803d',8)+RABBIT(138,142,.38),tag=None,tagc='#15803d')
D['land-allot-permit-steps']=dict(c1='#fee2e2',c2='#fef3c7',sh='#7f1d1d',bd='#fee2e2',ln='#fca5a5',bg='#dc2626',badge='23',tint='#fef2f2',hero=DEED+ring(126,62,'45ว','#dc2626',8)+GOAT(138,142,.32),tag=None,tagc='#dc2626')
D['land-allot-advert-truth']=dict(c1='#ffedd5',c2='#e0f2fe',sh='#7c2d12',bd='#ffedd5',ln='#fdba74',bg='#ea580c',badge='29',tint='#fff7ed',hero=BILL+ring(126,62,'1แสน','#ea580c',7)+TOUCAN(138,142,.34),tag=None,tagc='#ea580c')
D['land-allot-off-plan-order']=dict(c1='#fce7f3',c2='#dcfce7',sh='#831843',bd='#fce7f3',ln='#f9a8d4',bg='#be185d',badge='52',tint='#fdf2f8',hero=ROAD+ring(126,62,'1พัน','#be185d',7)+FOX(138,142,.38),tag=None,tagc='#be185d')
D['land-allot-cancel-project']=dict(c1='#dbeafe',c2='#fef9c3',sh='#1e3a8a',bd='#dbeafe',ln='#93c5fd',bg='#1d4ed8',badge='56',tint='#eff6ff',hero=BOARD+ring(126,62,'60ว','#1d4ed8',8)+OWL(138,142,.36),tag=None,tagc='#1d4ed8')
