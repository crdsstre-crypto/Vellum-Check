from pk import K
def FG(side='r', c='#2f4a2f', op=.55):
  """ชั้นหน้า (foreground) เบลอ เพิ่มความลึก: ใบไม้มุมล่าง"""
  x = 345 if side=='r' else 15; d = -1 if side=='r' else 1
  leaves=''.join(f'<path d="M{x} 182q{d*(14+i*6)} {-30-i*8} {d*(30+i*10)} {-46-i*6}q{d*-6} {22} {d*-30} {46+i*6}z" fill="{c}"/>' for i in range(3))
  return f'<g filter="url(#wbl{K})" opacity="{op}">{leaves}</g>'
def SIGN(x,y,w,t,bgc,fg,fs=7,rot=0):
  return f'<g transform="translate({x} {y}) rotate({rot})"><rect x="{-w/2}" y="-9" width="{w}" height="16" rx="3" fill="{bgc}"/><text y="2.6" text-anchor="middle" font-size="{fs}" font-weight="900" fill="{fg}" font-family="sans-serif">{t}</text></g>'
def DUST(n=10,seed=3,c='#fff',op=.5,y0=60,y1=140):
  """ฝุ่นแสงลอยในอากาศ เพิ่มบรรยากาศ"""
  import random; r=random.Random(seed)
  return '<g class="cm-blink" opacity="%s">'%op+''.join(f'<circle cx="{r.randint(100,340)}" cy="{r.randint(y0,y1)}" r="{r.choice([0.8,1.2,1.6])}" fill="{c}"/>' for _ in range(n))+'</g>'
def BEAM(x0=40,w=60,c='#fff',op=.22,n=3,tilt=50):
  """ลำแสงเฉียงจากหน้าต่าง/ช่องแสง (ชุด 202–206)"""
  return f'<g opacity="{op}">'+''.join(f'<path d="M{x0+i*w*0.7} 0h{w*0.45}l{tilt} 150h{-w*0.45}z" fill="{c}"/>' for i in range(n))+'</g>'
def TX(x,y,t,fs=5,c='#334155',a='start'):
  return f'<text x="{x}" y="{y}" text-anchor="{a}" font-size="{fs}" font-weight="900" fill="{c}" font-family="sans-serif">{t}</text>'
