T='font-family="sans-serif" font-weight="900"'
goat=('<g transform="translate(90 92) scale(.92)">'
 '<ellipse cx="0" cy="34" rx="34" ry="5" fill="#000" opacity=".12"/>'
 # legs with hooves
 +''.join(f'<rect x="{x}" y="10" width="7" height="20" rx="3" fill="#f5f0e6"/><rect x="{x}" y="27" width="7" height="5" rx="2" fill="#57534e"/>' for x in (-22,-11,8,18))+
 # tail + body
 '<path d="M-30 -6q-8-8-4-14" stroke="#e7e2d8" stroke-width="5" stroke-linecap="round" fill="none"/>'
 '<ellipse cx="0" cy="0" rx="32" ry="18" fill="#fffdf8" stroke="#d6cfc2" stroke-width="1.5"/>'
 '<ellipse cx="-6" cy="-4" rx="14" ry="7" fill="#fff" opacity=".7"/>'
 '<path d="M-14 8q6 6 14 0" stroke="#e7e2d8" stroke-width="2" fill="none"/>'
 # neck + head
 '<path d="M20 -8q10-10 14-22" stroke="#fffdf8" stroke-width="14" stroke-linecap="round" fill="none"/>'
 '<g transform="translate(36 -30)">'
 '<path d="M-6 -10q-6-14 4-18" stroke="#a8a29e" stroke-width="4" stroke-linecap="round" fill="none"/>'
 '<path d="M4 -10q2-14 12-14" stroke="#a8a29e" stroke-width="4" stroke-linecap="round" fill="none"/>'
 '<ellipse cx="-14" cy="-4" rx="8" ry="4" fill="#f5d0c5" transform="rotate(-25 -14 -4)"/>'
 '<ellipse cx="16" cy="-4" rx="8" ry="4" fill="#f5d0c5" transform="rotate(25 16 -4)"/>'
 '<ellipse cx="0" cy="2" rx="13" ry="15" fill="#fffdf8" stroke="#d6cfc2" stroke-width="1.5"/>'
 '<ellipse cx="0" cy="11" rx="9" ry="7" fill="#fde7e1"/>'
 '<circle cx="-5" cy="-1" r="2.6" fill="#1f2937"/><circle cx="5" cy="-1" r="2.6" fill="#1f2937"/>'
 '<circle cx="-4.2" cy="-1.8" r=".9" fill="#fff"/><circle cx="5.8" cy="-1.8" r=".9" fill="#fff"/>'
 '<circle cx="-9" cy="5" r="2.4" fill="#fda4af" opacity=".7"/><circle cx="9" cy="5" r="2.4" fill="#fda4af" opacity=".7"/>'
 '<path d="M-2 10q2 2 4 0" stroke="#9f6b5a" stroke-width="1.2" fill="none"/>'
 '<path d="M-3 17q3 9 6 0z" fill="#e7e2d8"/>'
 # lettuce in mouth
 '<path d="M4 13q10-6 16 2q-4 8-14 4z" fill="#4ade80" stroke="#16a34a" stroke-width="1"/><path d="M8 15q5-2 9 1" stroke="#16a34a" stroke-width=".8" fill="none"/>'
 '</g></g>')
garden=''.join(f'<g transform="translate({46+i*18} 150)"><path d="M0 0q-6-10 0-16q6 6 0 16z" fill="#22c55e"/><path d="M0 0q-9-4-10-12q8 0 10 12z" fill="#4ade80"/><path d="M0 0q9-4 10-12q-8 0-10 12z" fill="#16a34a"/></g>' for i in range(6))
D['self-help-stray-animal']=dict(c1='#bbf7d0',c2='#fefce8',sh='#14532d',bd='#bbf7d0',ln='#22c55e',bg='#15803d',badge='🐐',tint='#f0fdf4',
 hero=garden+goat,tag=None)
