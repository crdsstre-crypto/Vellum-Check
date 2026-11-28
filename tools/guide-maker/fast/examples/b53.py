import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import RACCOON, PANDA, GOAT, BEAVER, HEDGEHOG, GAVEL
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
def ring(x,y,t,c,fs=10):
  return f'<g transform="translate({x} {y})"><circle r="16" fill="#fff" stroke="{c}" stroke-width="3"/><path d="M0 -16a16 16 0 1 1 -15 6" stroke="{c}" stroke-width="5" fill="none" opacity=".35"/><text y="4" text-anchor="middle" font-size="{fs}" fill="{c}" {T}>{t}</text></g>'
BOX=lambda x,y,lid: f'<g transform="translate({x} {y})"><rect x="0" y="0" width="58" height="36" rx="3" fill="#e7d3a8" stroke="#a16207" stroke-width="2.4"/>'+''.join(f'<rect x="{8+i*14}" y="{-12 if not lid else -5}" width="12" height="16" rx="2" fill="{c}"/>' for i,c in enumerate(['#93c5fd','#fca5a5','#86efac']))+(f'<rect x="-3" y="-7" width="64" height="10" rx="2" fill="#d6b77a" stroke="#a16207" stroke-width="2"/>' if lid else '')+f'<rect x="13" y="13" width="32" height="13" rx="2" fill="#fff"/><text x="29" y="23" text-anchor="middle" font-size="8" fill="#475569" {T}>ปิดคดี</text></g>'
D['sme-rehab-crimes']=dict(c1='#ffedd5',c2='#e5e7eb',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='124',tint='#fff7ed',
 hero=doc(74,94,60,74,'#c2410c','หนี้ในแผน')+'<text x="74" y="104" text-anchor="middle" font-size="11" fill="#b91c1c" '+T+'>4 ล้าน ?</text>'+ring(124,70,'5 ปี','#dc2626')+RACCOON(134,142,.44),tag=None,tagc='#c2410c')
D['rehab-who-in-charge']=dict(c1='#dbeafe',c2='#ede9fe',sh='#1e3a8a',bd='#dbeafe',ln='#818cf8',bg='#4338ca',badge='59',tint='#eef2ff',
 hero='<g transform="translate(46 70)"><rect x="0" y="0" width="30" height="40" rx="3" fill="#1e3a8a"/><rect x="5" y="6" width="20" height="5" fill="#fde68a"/><text x="15" y="30" text-anchor="middle" font-size="8" fill="#fff" '+T+'>บัญชี</text><rect x="36" y="16" width="14" height="22" rx="2" fill="#b91c1c"/><ellipse cx="43" cy="15" rx="10" ry="5" fill="#dc2626"/><circle cx="62" cy="22" r="7" fill="none" stroke="#ca8a04" stroke-width="3.4"/><path d="M62 29v14M62 38h6" stroke="#ca8a04" stroke-width="3.4"/></g><path d="M44 124h76" stroke="#4338ca" stroke-width="3"/><path d="M120 124l-8 -5v10z" fill="#4338ca"/>'+ring(124,70,'ใคร?','#4338ca',8)+PANDA(134,146,.32),tag=None,tagc='#4338ca')
D['bankrupt-final-close']=dict(c1='#d1fae5',c2='#fef3c7',sh='#065f46',bd='#d1fae5',ln='#34d399',bg='#047857',badge='133',tint='#ecfdf5',
 hero=BOX(46,92,True)+ring(126,70,'14','#047857',11)+GOAT(134,142,.34),tag=None,tagc='#047857')
D['bankrupt-annul']=dict(c1='#fce7f3',c2='#ecfccb',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#be185d',badge='135',tint='#fdf2f8',
 hero=doc(74,94,60,74,'#be185d','ล้มละลาย')+'<path d="M50 82l48 28M98 82l-48 28" stroke="#dc2626" stroke-width="3.4" stroke-linecap="round"/>'+ring(124,70,'4 เหตุ','#be185d',8)+BEAVER(134,142,.32),tag=None,tagc='#be185d')
D['bankrupt-trustee-complaint']=dict(c1='#ccfbf1',c2='#ede9fe',sh='#134e4a',bd='#ccfbf1',ln='#2dd4bf',bg='#0f766e',badge='146',tint='#f0fdfa',
 hero=doc(72,96,58,70,'#0f766e','คำร้อง')+GAVEL(122,98,.85)+ring(124,62,'14','#dc2626',11)+HEDGEHOG(138,144,.3),tag=None,tagc='#0f766e')
