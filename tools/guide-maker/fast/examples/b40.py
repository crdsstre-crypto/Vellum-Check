import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import COURTHOUSE, PANDA, RACCOON, DAYRING, SQUIRREL, SEAL, GOAT, THERMO, DUCKLING
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
D['related-cases-merge']=dict(c1='#fce7f3',c2='#ecfccb',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='28',tint='#fdf2f8',
 hero=COURTHOUSE(62,96,.7)+COURTHOUSE(124,96,.7,'#7c3aed')+'<path d="M74 64q19 -18 38 0" stroke="#be185d" stroke-width="3" stroke-dasharray="5 3" fill="none"/>'+PANDA(92,140,.4),tag=None,tagc='#be185d')
D['lawyer-withdraws-shop']=dict(c1='#e0f2fe',c2='#fef3c7',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='65',tint='#f0f9ff',
 hero='<g transform="translate(84 92)"><rect x="-24" y="-38" width="48" height="76" rx="8" fill="#111827"/><rect x="-20" y="-31" width="40" height="58" rx="3" fill="#f1f5f9"/><rect x="-16" y="-22" width="32" height="20" rx="4" fill="#fee2e2"/><text y="-9" text-anchor="middle" font-size="8" fill="#b91c1c" '+T+'>ขอถอนตัว</text></g>'+RACCOON(136,136,.42),tag=None,tagc='#0369a1')
D['fact-admission-notice']=dict(c1='#dcfce7',c2='#fef9c3',sh='#14532d',bd='#dcfce7',ln='#4ade80',bg='#15803d',badge='7',tint='#f0fdf4',
 hero=doc(80,94,60,72,'#15803d','บอกกล่าว')+DAYRING(132,64,'7','วัน',.8,'#16a34a',17)+SQUIRREL(138,134,.38),tag=None,tagc='#15803d')
D['witness-no-show']=dict(c1='#e2e8f0',c2='#fed7aa',sh='#1e293b',bd='#e2e8f0',ln='#94a3b8',bg='#475569',badge='!',tint='#f8fafc',
 hero='<g transform="translate(78 96)"><rect x="-30" y="0" width="60" height="34" rx="3" fill="#92400e"/><rect x="-34" y="-4" width="68" height="8" rx="2" fill="#b45309"/><path d="M0 -4v-26" stroke="#334155" stroke-width="3"/><circle cy="-32" r="5" fill="#334155"/><text y="22" text-anchor="middle" font-size="9" fill="#fde68a" '+T+'>ว่าง</text></g>'+SEAL(132,62,'หมายจับ','#dc2626',-12,44)+GOAT(136,138,.36),tag=None,tagc='#475569')
D['foreign-document-translate']=dict(c1='#fee2e2',c2='#dbeafe',sh='#7f1d1d',bd='#fee2e2',ln='#f87171',bg='#b91c1c',badge='ก',tint='#fef2f2',
 hero=doc(72,96,54,66,'#b91c1c','INVOICE')+'<g transform="translate(124 82)"><rect x="-24" y="-28" width="48" height="58" rx="4" fill="#fff" stroke="#1d4ed8" stroke-width="2.5"/><rect x="-24" y="-28" width="48" height="12" rx="4" fill="#1d4ed8"/><text y="-19" text-anchor="middle" font-size="8" fill="#fff" '+T+'>คำแปล</text><path d="M-16 -6h32M-16 2h32M-16 10h22" stroke="#cbd5e1" stroke-width="2.5"/></g>'+DUCKLING(140,140,.42),tag=None,tagc='#b91c1c')
