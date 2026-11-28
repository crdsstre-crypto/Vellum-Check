import sys; sys.path.insert(0,'/home/claude/tools'); sys.path.insert(0,'/home/claude/work')
from gx import SANDGLASS, CAPY, DAYRING, SEAL, COURTHOUSE, KOALA, ENVFLY, SIREN, JSCALE, FOX, SAFEBOX
T='font-family="sans-serif" font-weight="900"'
D['court-deadline-extension']=dict(c1='#ffedd5',c2='#fde68a',sh='#7c2d12',bd='#ffedd5',ln='#fb923c',bg='#c2410c',badge='15',tint='#fff7ed',
 hero='<g transform="translate(76 104)"><rect x="-26" y="-18" width="52" height="34" rx="3" fill="#fffaf0" stroke="#e6dccb" stroke-width="2"/><path d="M-26 -18l26 18l26 -18" stroke="#d6c7ad" stroke-width="2" fill="none"/><circle cx="0" cy="2" r="6" fill="#dc2626"/></g>'+SANDGLASS(122,108,'#a16207',1.1)+f'<g transform="translate(96 54)"><rect x="-26" y="-11" width="52" height="22" rx="11" fill="#fff" stroke="#c2410c" stroke-width="2"/><text y="4.6" text-anchor="middle" font-size="11" fill="#c2410c" {T}>+15 วัน</text></g>',
 tag=None,tagc='#c2410c')
D['party-dies-during-case']=dict(c1='#ecfccb',c2='#e0e7ff',sh='#365314',bd='#ecfccb',ln='#84cc16',bg='#4d7c0f',badge='1',tint='#f7fee7',
 hero=COURTHOUSE(92,124,1.05)+f'<g transform="translate(130 66)"><circle r="16" fill="#fff" stroke="#4d7c0f" stroke-width="3"/><text y="4" text-anchor="middle" font-size="11" fill="#4d7c0f" {T}>1 ปี</text></g>'+KOALA(60,74,.55),
 tag=None,tagc='#4d7c0f')
D['irregular-procedure-revoke']=dict(c1='#ccfbf1',c2='#fef3c7',sh='#134e4a',bd='#ccfbf1',ln='#2dd4bf',bg='#0f766e',badge='8',tint='#f0fdfa',
 hero='<g transform="translate(78 96)"><rect x="-26" y="-34" width="52" height="56" fill="#94a3b8"/>'+''.join(f'<path d="M-26 {-30+i*7}h52" stroke="#64748b"/>' for i in range(8))+'<rect x="-30" y="-10" width="60" height="9" fill="#facc15" transform="rotate(-8)"/></g>'+ENVFLY(70,70,132,58,3,'#dc2626')+f'<g transform="translate(124 108)"><circle r="15" fill="#fff" stroke="#0f766e" stroke-width="3"/><text y="5" text-anchor="middle" font-size="13" fill="#0f766e" {T}>8</text></g>',
 tag=None,tagc='#0f766e')
D['emergency-court-order']=dict(c1='#e0e7ff',c2='#fee2e2',sh='#1e1b4b',bd='#e0e7ff',ln='#818cf8',bg='#4338ca',badge='!',tint='#eef2ff',
 hero=JSCALE(92,112,10,'#a16207','','')+SIREN(92,56)+f'<g transform="translate(92 132)"><rect x="-34" y="-9" width="68" height="18" rx="4" fill="#fff" stroke="#2563eb" stroke-width="2"/><text y="4" text-anchor="middle" font-size="9" fill="#1d4ed8" {T}>สั่งด่วน</text></g>',
 tag=None,tagc='#4338ca')
D['interim-order-appeal']=dict(c1='#fee2e2',c2='#e0f2fe',sh='#7f1d1d',bd='#fee2e2',ln='#f87171',bg='#b91c1c',badge='↗',tint='#fef2f2',
 hero='<g transform="translate(86 108)"><rect x="-34" y="-20" width="68" height="34" fill="#78350f"/><rect x="-38" y="-26" width="76" height="8" rx="2" fill="#92400e"/></g>'+SEAL(86,92,'โต้แย้งไว้','#dc2626',-10,64)+f'<g transform="translate(116 56)"><circle r="16" fill="#fff" stroke="#b91c1c" stroke-width="3"/><text y="4" text-anchor="middle" font-size="9" fill="#b91c1c" {T}>1 เดือน</text></g>',
 tag=None,tagc='#b91c1c')
