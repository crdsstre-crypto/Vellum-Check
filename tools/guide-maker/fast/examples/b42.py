import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import FOX, OTTER, DAYRING, PENGUIN, KOALA, SEAL, THERMO
T='font-family="sans-serif" font-weight="900"'
def doc(x,y,w,h,c,head):
  return f'<g transform="translate({x} {y})"><rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="4" fill="#fff" stroke="{c}" stroke-width="2.5"/><rect x="{-w/2}" y="{-h/2}" width="{w}" height="12" rx="4" fill="{c}"/><text y="{-h/2+9}" text-anchor="middle" font-size="8" fill="#fff" {T}>{head}</text>'+''.join(f'<path d="M{-w/2+8} {-h/2+20+i*8}h{w-16}" stroke="#cbd5e1" stroke-width="2.5"/>' for i in range(int((h-24)/8)))+'</g>'
D['case-struck-off']=dict(c1='#cffafe',c2='#e7e5e4',sh='#164e63',bd='#cffafe',ln='#22d3ee',bg='#0891b2',badge='132',tint='#ecfeff',
 hero=doc(80,94,58,72,'#57534e','สารบบ')+'<path d="M58 96h44" stroke="#dc2626" stroke-width="4"/>'+'<g transform="translate(128 70)"><circle r="15" fill="#16a34a"/><text y="4" text-anchor="middle" font-size="9" fill="#fff" '+T+'>≠แพ้</text></g>'+FOX(136,138,.36),tag=None,tagc='#0891b2')
D['court-fee-basics']=dict(c1='#fef3c7',c2='#ffe4e6',sh='#78350f',bd='#fef3c7',ln='#f59e0b',bg='#a16207',badge='฿',tint='#fffbeb',
 hero='<g transform="translate(76 96)"><rect x="-30" y="-16" width="60" height="32" rx="3" fill="#86efac" stroke="#16a34a" stroke-width="2.5"/><circle r="9" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/><text y="4" text-anchor="middle" font-size="10" fill="#166534" '+T+'>฿</text></g>'+doc(124,78,44,52,'#1d4ed8','ใบรับ')+OTTER(130,140,.36),tag=None,tagc='#a16207')
D['enforcement-cost-deposit']=dict(c1='#fef9c3',c2='#e5e7eb',sh='#1f2937',bd='#fef9c3',ln='#facc15',bg='#a16207',badge='7',tint='#fefce8',
 hero=''.join(f'<ellipse cx="72" cy="{130-i*14}" rx="28" ry="8" fill="#1f2937" stroke="#4b5563" stroke-width="2"/>' for i in range(4))+DAYRING(128,70,'7','วัน',.6,'#a16207',18),tag=None,tagc='#a16207')
D['court-hearing-schedule']=dict(c1='#e0f2fe',c2='#ffedd5',sh='#0c4a6e',bd='#e0f2fe',ln='#38bdf8',bg='#0369a1',badge='35',tint='#f0f9ff',
 hero=''.join(f'<rect x="{50+(i%2)*40}" y="{108-(i//2)*28}" width="36" height="26" rx="2" fill="#d97706" stroke="#92400e" stroke-width="2"/>' for i in range(4))+THERMO(136,74,'4°','#0284c7')+PENGUIN(138,140,.34),tag=None,tagc='#0369a1')
D['closed-hearing-shop']=dict(c1='#dbeafe',c2='#fce7f3',sh='#172554',bd='#dbeafe',ln='#60a5fa',bg='#1e40af',badge='36',tint='#eff6ff',
 hero='<g transform="translate(84 96)"><rect x="-34" y="-40" width="68" height="76" rx="3" fill="#1e3a8a"/><path d="M0 -40v76" stroke="#172554" stroke-width="2.5"/><rect x="-28" y="-26" width="56" height="22" rx="2" fill="#fff"/><text y="-11" text-anchor="middle" font-size="9" fill="#b91c1c" '+T+'>พิจารณาลับ</text><circle cx="-6" cy="10" r="2.5" fill="#facc15"/><circle cx="6" cy="10" r="2.5" fill="#facc15"/></g>'+KOALA(138,138,.34),tag=None,tagc='#1e40af')
