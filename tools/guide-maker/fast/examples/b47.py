import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import FOX, DAYRING, SQUIRREL, RACCOON, STICKER
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
coin=lambda x,y,n: ''.join(f'<ellipse cx="{x}" cy="{y-i*6}" rx="13" ry="4.5" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>' for i in range(n))
D['bankrupt-dividend-timing']=dict(c1='#e0f2fe',c2='#ffedd5',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='124',tint='#f0f9ff',
 hero=coin(56,126,4)+coin(88,126,3)+coin(120,126,2)+'<g transform="translate(92 66)"><circle r="20" fill="#fff" stroke="#c2410c" stroke-width="3"/><text y="-1" text-anchor="middle" font-size="8" fill="#c2410c" '+T+'>ทุก</text><text y="10" text-anchor="middle" font-size="9" fill="#c2410c" '+T+'>6 เดือน</text></g>',tag=None,tagc='#0369a1')
D['bankrupt-dividend-objection']=dict(c1='#ede9fe',c2='#fef3c7',sh='#4c1d95',bd='#ede9fe',ln='#a78bfa',bg='#6d28d9',badge='127',tint='#f5f3ff',
 hero=doc(78,96,60,72,'#475569','ส่วนแบ่ง')+'<path d="M58 100h40" stroke="#dc2626" stroke-width="3"/>'+DAYRING(130,68,'7','วัน',.5,'#b91c1c',16),tag=None,tagc='#6d28d9')
D['guarantor-claim-bankrupt']=dict(c1='#fef3c7',c2='#dcfce7',sh='#78350f',bd='#fef3c7',ln='#f59e0b',bg='#a16207',badge='101',tint='#fffbeb',
 hero=doc(76,92,58,66,'#a16207','ค้ำประกัน')+'<path d="M108 118q16 -20 30 -8" stroke="#16a34a" stroke-width="3" stroke-dasharray="5 3" fill="none"/><path d="M134 104l6 8l-9 2z" fill="#16a34a"/>'+SQUIRREL(132,68,.3),tag=None,tagc='#a16207')
D['trustee-rejects-contract']=dict(c1='#ede9fe',c2='#e5e7eb',sh='#312e81',bd='#ede9fe',ln='#818cf8',bg='#7c3aed',badge='122',tint='#f5f3ff',
 hero=doc(80,96,60,72,'#6d28d9','สัญญา')+'<g transform="translate(128 66)"><circle r="16" fill="#dc2626"/><path d="M-8 -8l16 16M8 -8l-16 16" stroke="#fff" stroke-width="3.5"/></g>'+RACCOON(134,138,.3),tag=None,tagc='#7c3aed')
D['buy-from-bankrupt-estate']=dict(c1='#fce7f3',c2='#e5e7eb',sh='#831843',bd='#fce7f3',ln='#f472b6',bg='#db2777',badge='123',tint='#fdf2f8',
 hero=''.join(f'<rect x="{48+(i%3)*30}" y="{98-(i//3)*26}" width="28" height="24" rx="2" fill="{c}" stroke="#be185d" stroke-width="1.5"/>' for i,c in enumerate(['#f9a8d4','#fbcfe8','#f9a8d4','#fbcfe8','#f9a8d4']))+'<g transform="translate(118 128)"><rect x="-26" y="-10" width="52" height="20" rx="10" fill="#16a34a"/><text y="4" text-anchor="middle" font-size="8" fill="#fff" '+T+'>เสนอซื้อ</text></g>',tag=None,tagc='#db2777')
