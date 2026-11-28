import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import CALGRID, DAYRING, FOX, SEAL, PENGUIN, GOAT, JSCALE
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
D['bankrupt-claim-rent-interest']=dict(c1='#ffedd5',c2='#e0f2fe',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='99',tint='#fff7ed',
 hero='<rect x="44" y="76" width="70" height="56" rx="3" fill="#fdba74"/><path d="M38 76l10 -18h62l10 18z" fill="#f97316"/><rect x="50" y="118" width="40" height="8" rx="4" fill="#16a34a"/><rect x="90" y="118" width="18" height="8" rx="4" fill="#e5e7eb"/>'+GOAT(138,138,.32),tag=None,tagc='#c2410c')
D['bankrupt-claim-objection']=dict(c1='#e2e8f0',c2='#fefce8',sh='#334155',bd='#e2e8f0',ln='#94a3b8',bg='#475569',badge='106',tint='#f8fafc',
 hero=doc(78,94,62,74,'#475569','เจ้าหนี้')+'<g transform="translate(126 70)"><circle r="16" fill="#dc2626"/><text y="6" text-anchor="middle" font-size="18" fill="#fff" '+T+'>?</text></g>'+DAYRING(128,120,'14','วัน',.5,'#1d4ed8',15),tag=None,tagc='#475569')
D['bankrupt-composition-vote']=dict(c1='#fce7f3',c2='#dcfce7',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='48',tint='#fdf2f8',
 hero=doc(74,96,56,68,'#be185d','ออกเสียง')+'<g transform="translate(126 74) rotate(-8)"><rect x="-22" y="-14" width="44" height="28" rx="3" fill="#fffaf0" stroke="#a16207" stroke-width="2"/><path d="M-22 -14l22 16l22 -16" stroke="#a16207" stroke-width="2" fill="none"/></g>'+FOX(136,138,.32),tag=None,tagc='#be185d')
D['bankrupt-vs-enforcement']=dict(c1='#e5e7eb',c2='#ffedd5',sh='#44403c',bd='#e5e7eb',ln='#a8a29e',bg='#c2410c',badge='110',tint='#fafaf9',
 hero='<g transform="translate(46 96)"><path d="M0 30v-14l14 -14h46l14 14v14z" fill="#ef4444"/><rect x="18" y="4" width="36" height="12" fill="#bae6fd"/><circle cx="16" cy="32" r="8" fill="#1f2937"/><circle cx="58" cy="32" r="8" fill="#1f2937"/></g>'+SEAL(124,70,'กักเงิน','#dc2626',-12,44),tag=None,tagc='#c2410c')
D['bankrupt-business-continue']=dict(c1='#e0f2fe',c2='#ffedd5',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='120',tint='#f0f9ff',
 hero='<rect x="44" y="80" width="80" height="56" rx="3" fill="#fde68a"/><path d="M38 80l10 -18h72l10 18z" fill="#f97316"/><text x="84" y="104" text-anchor="middle" font-size="10" fill="#9a3412" '+T+'>เปิดปกติ</text>'+PENGUIN(140,138,.3),tag=None,tagc='#0369a1')
