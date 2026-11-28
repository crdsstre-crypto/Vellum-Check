import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import TOUCAN, OWL, SQUIRREL, HIPPO, OTTER
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
def ring(x,y,t,c,fs=10):
  return f'<g transform="translate({x} {y})"><circle r="16" fill="#fff" stroke="{c}" stroke-width="3"/><path d="M0 -16a16 16 0 1 1 -15 6" stroke="{c}" stroke-width="5" fill="none" opacity=".35"/><text y="4" text-anchor="middle" font-size="{fs}" fill="{c}" {T}>{t}</text></g>'
SEALER='<g transform="translate(46 82)"><rect width="56" height="40" rx="4" fill="#64748b"/><rect x="6" y="6" width="44" height="9" rx="2" fill="#e2e8f0"/><rect x="-6" y="18" width="68" height="6" fill="#f87171"/><circle cx="46" cy="32" r="3" fill="#22c55e"/></g>'
RACK='<g transform="translate(46 74)"><path d="M0 0h62M5 0v52M57 0v52" stroke="#64748b" stroke-width="3"/>'+''.join(f'<path d="M{10+i*10} 0v5l-6 22h12l-6 -22" fill="{c}"/>' for i,c in enumerate(['#f9a8d4','#93c5fd','#fde68a','#86efac','#c4b5fd']))+'</g>'
HOUSE='<g transform="translate(48 84)"><path d="M0 18l30 -24l30 24z" fill="#fca5a5" stroke="#b91c1c" stroke-width="2"/><rect x="5" y="18" width="50" height="34" fill="#fef3c7" stroke="#d6d3d1" stroke-width="2"/><rect x="24" y="32" width="12" height="20" fill="#a16207"/>'+''.join(f'<path d="M{-6+i*24} 4v50" stroke="#f59e0b" stroke-width="3"/>' for i in range(4))+'<path d="M-6 24h72" stroke="#f59e0b" stroke-width="3"/></g>'
CHATB='<g transform="translate(48 66)"><rect width="56" height="64" rx="9" fill="#0369a1"/><rect x="4" y="7" width="48" height="50" rx="4" fill="#f1f5f9"/><rect x="8" y="14" width="34" height="10" rx="5" fill="#fff" stroke="#cbd5e1"/><rect x="16" y="30" width="32" height="10" rx="5" fill="#bbf7d0"/><text x="32" y="38" text-anchor="middle" font-size="7" fill="#166534" '+T+'>ตกลง</text></g>'
D['movable-seller-privilege']=dict(c1='#fce7f3',c2='#e5e7eb',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='270',tint='#fdf2f8',
 hero=SEALER+ring(124,68,'ก่อน?','#be185d',9)+TOUCAN(134,136,.55),tag=None,tagc='#be185d')
D['landlord-hotel-carrier-privilege']=dict(c1='#ede9fe',c2='#fefce8',sh='#4c1d95',bd='#ede9fe',ln='#a78bfa',bg='#6d28d9',badge='261',tint='#f5f3ff',
 hero=RACK+ring(126,66,'3 งวด','#6d28d9',8)+OWL(138,140,.3),tag=None,tagc='#6d28d9')
D['contractor-property-privilege']=dict(c1='#e0f2fe',c2='#fef9c3',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='286',tint='#f0f9ff',
 hero=HOUSE+ring(126,64,'จด','#0369a1',11)+SQUIRREL(138,142,.3),tag=None,tagc='#0369a1')
D['chat-deal-contract-formed']=dict(c1='#e0f2fe',c2='#ffedd5',sh='#0c4a6e',bd='#e0f2fe',ln='#7dd3fc',bg='#0284c7',badge='366',tint='#f0f9ff',
 hero=CHATB+ring(124,66,'เกิด?','#0284c7',9)+HIPPO(134,142,.32),tag=None,tagc='#0284c7')
D['debtor-loses-time-benefit']=dict(c1='#d1fae5',c2='#fef3c7',sh='#065f46',bd='#d1fae5',ln='#34d399',bg='#047857',badge='193',tint='#ecfdf5',
 hero=doc(72,94,58,72,'#047857','ผ่อน 12 งวด')+'<path d="M50 108l44 0" stroke="#dc2626" stroke-width="3"/><text x="72" y="104" text-anchor="middle" font-size="9" fill="#b91c1c" '+T+'>ประกันหาย</text>'+ring(124,66,'ทั้งหมด','#dc2626',7.5)+OTTER(136,142,.3),tag=None,tagc='#047857')
