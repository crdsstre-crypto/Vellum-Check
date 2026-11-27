from pk import K
def FG(side='r', c='#2f4a2f', op=.55):
  """ชั้นหน้า (foreground) เบลอ เพิ่มความลึก: ใบไม้มุมล่าง"""
  x = 345 if side=='r' else 15; d = -1 if side=='r' else 1
  leaves=''.join(f'<path d="M{x} 182q{d*(14+i*6)} {-30-i*8} {d*(30+i*10)} {-46-i*6}q{d*-6} {22} {d*-30} {46+i*6}z" fill="{c}"/>' for i in range(3))
  return f'<g filter="url(#wbl{K})" opacity="{op}">{leaves}</g>'
def SIGN(x,y,w,t,bgc,fg,fs=7,rot=0):
  return f'<g transform="translate({x} {y}) rotate({rot})"><rect x="{-w/2}" y="-9" width="{w}" height="16" rx="3" fill="{bgc}"/><text y="2.6" text-anchor="middle" font-size="{fs}" font-weight="900" fill="{fg}" font-family="sans-serif">{t}</text></g>'
