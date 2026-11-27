# Panel kit: prettier, consistent comic panels with fewer tokens.
# Usage: from pk import *; write panels with P(name, comment, [parts...]) -> JS text
import random
K = '@K@'
SH = f'url(#wsh{K})'

def js(s):  # raw JS expression marker
    return ('JS', s)

def _lit(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'").replace(K, "'+k+'") + "'"

def P(name, comment, parts, M=False):
    M = M or any(isinstance(p, tuple) and "+M(" in p[1] for p in parts)
    defs = "'<defs>'+WD+" + ("MD+" if M else "")
    gid = name[:2]
    body = []
    buf = ''
    for p in parts:
        if isinstance(p, tuple):
            if buf: body.append(_lit(buf)); buf = ''
            body.append(p[1])
        else:
            buf += p
    if buf: body.append(_lit(buf))
    B = ("  var B=function(x,c,sk){return '<g filter=\"url(#wsh'+k+')\"><path d=\"M'+(x-24)+' 164v-34q0-18 24-18t24 18v34z\" fill=\"'+c+'\"/></g>"
         "<path d=\"M'+(x-24)+' 150q24 6 48 0\" stroke=\"rgba(0,0,0,.08)\" stroke-width=\"6\" fill=\"none\"/>"
         "<path d=\"M'+(x-6)+' 100h12v12q-6 3-12 0z\" fill=\"'+sk+'\"/>';};\n")
    return f" // {comment}\n {name}:function(k){{/*M*/\n{B}  return {defs}" + "+\n  ".join(body) + ";},\n"

# ---------- scenery ----------
def bg(id, top, bot, floor, fy=146, wall_tex=True):
    s = (f'</defs>' if False else '')
    s += (f'<linearGradient id="{id}{K}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>'
          f'<radialGradient id="{id}v{K}" cx=".5" cy=".35" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient></defs>'
          f'<rect width="360" height="180" fill="url(#{id}{K})"/>')
    if wall_tex:
        s += ''.join(f'<path d="M{x} 0v{fy}" stroke="#fff" stroke-opacity=".08" stroke-width="10"/>' for x in range(20, 360, 40))
    s += (f'<rect y="{fy}" width="360" height="{180-fy}" fill="{floor}"/><rect y="{fy}" width="360" height="3" fill="#fff" opacity=".25"/>'
          f'<rect y="{fy+3}" width="360" height="6" fill="#000" opacity=".06"/>'
          + ''.join(f'<path d="M{x} {fy+3}l{(x-180)//6} {180-fy}" stroke="#000" stroke-opacity=".05"/>' for x in range(0, 361, 45)))
    return s

def vignette(id):
    return f'<rect width="360" height="180" fill="url(#{id}v{K})"/>'

def shadow(x, y, rx=26, op=.16):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx*0.18:.1f}" fill="#000" opacity="{op}"/>'

def window(x, y, w=56, h=46, sky=('#bfe6fb', '#eaf7ff')):
    return (f'<rect x="{x-3}" y="{y-3}" width="{w+6}" height="{h+6}" rx="3" fill="#fff" opacity=".9"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{sky[0]}"/><rect x="{x}" y="{y+h*0.55:.0f}" width="{w}" height="{h*0.45:.0f}" fill="{sky[1]}"/>'
            f'<circle cx="{x+w*0.75:.0f}" cy="{y+h*0.3:.0f}" r="5" fill="#fff6c8"/><path d="M{x+w/2} {y}v{h}M{x} {y+h/2}h{w}" stroke="#fff" stroke-width="2.4"/>'
            f'<path d="M{x} {y+h+3}l-14 40h{w+28}l-14-40z" fill="#fff" opacity=".1"/>')

def plant(x, y=146, s=1.0, pot='#c8744a', leaf='#5aa06a'):
    return (shadow(x, y, 12*s, .12) + f'<g transform="translate({x} {y}) scale({s})"><path d="M-9 0l-2-16h22l-2 16z" fill="{pot}"/><rect x="-12" y="-19" width="24" height="4" rx="1" fill="{pot}" opacity=".85"/>'
            f'<path d="M0-19q-14-10-12-26q8 6 12 20M0-19q2-18 12-24q2 12-12 24M0-19q-4-22 2-32q6 14-2 32" fill="{leaf}"/><path d="M0-19q-14-10-12-26" stroke="#000" stroke-opacity=".12" fill="none"/></g>')

def frame(x, y, w=34, h=26, art='#e8c47a', fr='#8a6a4a'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="{fr}"/><rect x="{x+3}" y="{y+3}" width="{w-6}" height="{h-6}" fill="#fbf4e4"/>'
            f'<path d="M{x+4} {y+h-4}l{w*0.3:.0f}-{h*0.4:.0f} {w*0.2:.0f} {h*0.2:.0f} {w*0.2:.0f}-{h*0.3:.0f} {w*0.22:.0f} {h*0.5:.0f}z" fill="{art}"/>')

def shelf(x, y, w=70, books=('#c0504a', '#4a7ab0', '#e0b040', '#5a9a6a', '#8a5aa0')):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="4" rx="1" fill="#8a6a4a"/><rect x="{x}" y="{y+4}" width="{w}" height="2" fill="#000" opacity=".1"/>'
    bx = x + 4
    for i, c in enumerate(books):
        h = 16 + (i * 7) % 8
        s += f'<rect x="{bx}" y="{y-h}" width="7" height="{h}" rx="1" fill="{c}"/><rect x="{bx+1}" y="{y-h+3}" width="5" height="1.6" fill="#fff" opacity=".5"/>'
        bx += 9
    return s

def desk(x, y, w, c='#8a5a3a', legs=True):
    s = shadow(x + w/2, 160, w*0.48, .12) + f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="9" rx="2" fill="{c}"/></g><rect x="{x}" y="{y}" width="{w}" height="2.4" rx="1" fill="#fff" opacity=".25"/>'
    if legs:
        s += f'<rect x="{x+8}" y="{y+9}" width="6" height="{150-y}" fill="{c}" opacity=".85"/><rect x="{x+w-14}" y="{y+9}" width="6" height="{150-y}" fill="{c}" opacity=".85"/>'
    else:
        s += f'<rect x="{x}" y="{y+9}" width="{w}" height="{180-y}" fill="{c}" opacity=".9"/><rect x="{x}" y="{y+9}" width="{w}" height="4" fill="#000" opacity=".12"/>'
    return s

def paper(x, y, w, h, lines=3, rot=0, fill='#fffdf6', head=None):
    g = f'<g transform="rotate({rot} {x+w/2} {y+h/2})"><g filter="{SH}"><path d="M{x} {y}h{w-7}l7 7v{h-7}h-{w}z" fill="{fill}"/></g><path d="M{x+w-7} {y}v7h7" fill="#e6dccb"/>'
    if head: g += f'<rect x="{x}" y="{y}" width="{w-7}" height="5" fill="{head}"/>'
    for i in range(lines):
        g += f'<rect x="{x+5}" y="{y+10+i*6}" width="{(w-12)*(1 if i%2==0 else .7):.0f}" height="2" rx="1" fill="#c8bfae"/>'
    return g + '</g>'

def label(x, y, text, w=None, bg='#fff', fg='#2a2a32', fs=7, rot=0):
    w = w or (len(text) * fs * 0.62 + 10)
    return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><rect x="{x-w/2:.1f}" y="{y-fs-2}" width="{w:.1f}" height="{fs+7}" rx="3" fill="{bg}"/></g>'
            f'<text x="{x}" y="{y+1.5}" text-anchor="middle" font-size="{fs}" font-weight="900" fill="{fg}" font-family="sans-serif">{text}</text></g>')

def coins(x, y, n=3):
    return ''.join(f'<ellipse cx="{x}" cy="{y-i*3}" rx="7" ry="2.6" fill="#e8b83a" stroke="#c8962a" stroke-width=".8"/>' for i in range(n)) + f'<ellipse cx="{x}" cy="{y-(n-1)*3-.6}" rx="4" ry="1.2" fill="#fff" opacity=".5"/>'

def cash(x, y, rot=0, c='#7ac08a'):
    return f'<g transform="rotate({rot} {x} {y})"><rect x="{x-11}" y="{y-6}" width="22" height="12" rx="1.5" fill="{c}" stroke="#4a8a5a" stroke-width=".7"/><circle cx="{x}" cy="{y}" r="3" fill="none" stroke="#4a8a5a" stroke-width=".8"/></g>'

def sparkle(x, y, r=4, c='#fff'):
    return f'<path d="M{x} {y-r}l{r*.3:.1f} {r*.7:.1f} {r*.7:.1f} {r*.3:.1f}-{r*.7:.1f} {r*.3:.1f}-{r*.3:.1f} {r*.7:.1f}-{r*.3:.1f}-{r*.7:.1f}-{r*.7:.1f}-{r*.3:.1f} {r*.7:.1f}-{r*.3:.1f}z" fill="{c}"/>'

# ---------- people ----------
def person(kind, x, shirt, skin, face, glasses=False, hair=None):
    # kind 'W' or 'M'. Returns parts list (with js())
    call = f"W({x},86,1,'{face}')" if kind == 'W' else f"M({x},86,1,'{face}',{'true' if glasses else 'false'})"
    return [shadow(x, 165, 30, .18), js(f"'<g transform=\"translate(0 24)\">'+B({x},'{shirt}','{skin}')+{call}+'</g>'")]

def arm(path, shirt, skin, hand):
    hx, hy = hand
    return (f'<path d="{path}" stroke="{shirt}" stroke-width="7.5" fill="none" stroke-linecap="round"/>'
            f'<path d="{path}" stroke="#000" stroke-opacity=".08" stroke-width="2" fill="none" transform="translate(1.5 1.5)"/>'
            f'<circle cx="{hx}" cy="{hy}" r="4.2" fill="{skin}"/><circle cx="{hx-1.2}" cy="{hy-1.2}" r="1.4" fill="#fff" opacity=".35"/>')

# ---------- v2 extras (ความสวยมาตรฐาน: แสง + ของมีชีวิต) ----------
def lightpool(x, y=150, rx=70, c='#fff6d8', op=.35):
    """แอ่งแสงบนพื้นใต้ของหลัก ทำให้ฉากมีมิติ"""
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx*.16:.1f}" fill="{c}" opacity="{op}"/>'

def lamp(x, y=64, c='#f2c94c', drop=10):
    """โคมไฟห้อยเพดาน + แสงกรวย (วางนอกโซนห้ามตามข้อ 3)"""
    return (f'<path d="M{x} 0v{y-drop}" stroke="#4a4a52" stroke-width="1.2"/><path d="M{x-10} {y}l4-{drop}h12l4 {drop}z" fill="{c}"/>'
            f'<path d="M{x-10} {y}l-22 70h64l-22-70z" fill="#fff6c8" opacity=".14"/><circle cx="{x}" cy="{y+1}" r="2.4" fill="#fff8d8"/>')

def stringlights(y=70, c='#f8d878', x0=10, x1=350, step=24):
    s = f'<path d="M{x0} {y}q{(x1-x0)/4} 10 {(x1-x0)/2} 2t{(x1-x0)/2} 0" stroke="#2a2a32" stroke-opacity=".5" stroke-width=".8" fill="none"/>'
    return s + ''.join(f'<circle cx="{x}" cy="{y+3+((x//step)%2)*2}" r="2.4" fill="{c}"/><circle cx="{x}" cy="{y+3+((x//step)%2)*2}" r="5" fill="{c}" opacity=".18"/>' for x in range(x0+6, x1, step))

def steam(x, y, c='#fff'):
    return f'<path d="M{x-2} {y}q-4-5 0-9t0-9M{x+3} {y-2}q-4-5 0-9" stroke="{c}" stroke-width="1.4" fill="none" opacity=".6" stroke-linecap="round"/>'

def cat(x, y=152, c='#e8a05a', s=1):
    """แมวนั่ง (ของมีชีวิต) ก้นแตะพื้นที่ y"""
    return (shadow(x, y, 10*s, .14) + f'<g transform="translate({x} {y}) scale({s})"><path d="M-8 0q-2-14 8-16q10 2 8 16z" fill="{c}"/><circle cy="-18" r="6.5" fill="{c}"/>'
            f'<path d="M-6-22l1-7 4 4M6-22l-1-7-4 4" fill="{c}"/><path d="M8-2q10-2 8-10" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/>'
            f'<circle cx="-2.4" cy="-18.5" r="1" fill="#2a2a32"/><circle cx="2.4" cy="-18.5" r="1" fill="#2a2a32"/></g>')

def rug(x, y=158, w=120, c='#c8784a', c2='#f2d0a0'):
    return f'<ellipse cx="{x}" cy="{y}" rx="{w/2}" ry="{w*.08:.1f}" fill="{c}" opacity=".85"/><ellipse cx="{x}" cy="{y}" rx="{w/2-6}" ry="{w*.08-2.4:.1f}" fill="none" stroke="{c2}" stroke-width="1.2" stroke-dasharray="4 3"/>'

def bokeh(n=6, c='#fff', seed=1, ymax=60):
    r = random.Random(seed)
    return ''.join(f'<circle cx="{r.randint(10,350)}" cy="{r.randint(8,ymax)}" r="{r.randint(3,9)}" fill="{c}" opacity="{r.choice((.08,.12,.16))}"/>' for _ in range(n))

def phone(x, y, s=1, scr='#bfe0f8', rot=0):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><g filter="{SH}"><rect x="-9" y="-16" width="18" height="32" rx="3" fill="#2a2a32"/></g>'
            f'<rect x="-7.4" y="-13" width="14.8" height="25" rx="1.4" fill="{scr}"/><rect x="-3" y="-14.6" width="6" height="1" rx=".5" fill="#555"/></g>')

def box(x, y, w=28, h=22, c='#d8a86a', tape='#c08a4a'):
    """กล่องพัสดุ ก้นแตะ y"""
    return (shadow(x+w/2, y, w*.55, .14) + f'<g filter="{SH}"><rect x="{x}" y="{y-h}" width="{w}" height="{h}" rx="1.5" fill="{c}"/></g>'
            f'<path d="M{x} {y-h}h{w}" stroke="#000" stroke-opacity=".1" stroke-width="2"/><rect x="{x+w/2-2.5}" y="{y-h}" width="5" height="{h}" fill="{tape}" opacity=".8"/>')

# ---------- เพิ่มจากเรื่อง 217 ----------
def envelope(x,y,s=1,c='#fffaf0',flap='#e6dccb',rot=0,seal=None):
  g=f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><g filter="{SH}"><rect x="-14" y="-9" width="28" height="18" rx="1.5" fill="{c}"/></g><path d="M-14 -9l14 10 14-10" fill="{flap}" stroke="#c8bfae" stroke-width=".6"/>'
  if seal: g+=f'<circle cy="1" r="3.4" fill="{seal}"/>'
  return g+'</g>'
def laptop(x,y,w=70,scr='#eaf2fb',body='#5a5f6a'):
  h=w*.62
  return (shadow(x,y+2,w*.6,.14)+f'<g filter="{SH}"><rect x="{x-w/2:.1f}" y="{y-h:.1f}" width="{w}" height="{h:.1f}" rx="3" fill="{body}"/></g>'
    f'<rect x="{x-w/2+4:.1f}" y="{y-h+4:.1f}" width="{w-8}" height="{h-8:.1f}" rx="1.5" fill="{scr}"/>'
    f'<path d="M{x-w/2-8:.1f} {y}h{w+16}l-6 4h-{w+4}z" fill="#8a8f9a"/>')
def hourglass(x,y,c='#d8a84a'):
  return (shadow(x,y,9,.15)+f'<rect x="{x-10}" y="{y-4}" width="20" height="4" rx="1" fill="#6a4a32"/><rect x="{x-10}" y="{y-30}" width="20" height="4" rx="1" fill="#6a4a32"/>'
    f'<path d="M{x-7} {y-26}h14q0 8-7 11q7 3 7 11h-14q0-8 7-11q-7-3-7-11z" fill="#eef4f8" stroke="#a8b4c0" stroke-width=".8"/>'
    f'<path d="M{x-4} {y-22}h8q-1 3-4 5q-3-2-4-5z" fill="{c}"/><path d="M{x-6} {y-4}q6-6 12 0z" fill="{c}"/><path d="M{x} {y-15}v8" stroke="{c}" stroke-width="1"/>')
def pin(x,y,c='#d9363e'):
  return f'<path d="M{x} {y}q-7-8-7-13a7 7 0 0 1 14 0q0 5-7 13z" fill="{c}"/><circle cx="{x}" cy="{y-13}" r="2.6" fill="#fff"/>'
def fishbowl(x,y=122,s=1):
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cy="10" rx="16" ry="3" fill="#000" opacity=".12"/><path d="M-10-14h20q12 8 6 22q-4 4-16 4t-16-4q-6-14 6-22z" fill="#bfe4f2" opacity=".75"/>'
    f'<path d="M-15-2h30q0 8-4 10q-4 4-11 4t-11-4q-4-2-4-10z" fill="#7ac4e0" opacity=".55"/><path d="M-6 0q5-5 10 0q-5 5-10 0zM4 0l5-4v8z" fill="#f08a3a"/><circle cx="-3" cy="-1" r=".8" fill="#2a2a32"/>'
    f'<circle cx="6" cy="-8" r="1.4" fill="#fff" opacity=".7"/><circle cx="9" cy="-12" r="1" fill="#fff" opacity=".6"/><path d="M-12-10q-3 6-1 14" stroke="#fff" stroke-width="1.6" opacity=".6" fill="none"/></g>')
def loom(x,y=146):
  return (shadow(x,y,34,.12)+f'<g opacity=".95"><rect x="{x-34}" y="{y-56}" width="6" height="56" fill="#8a5a3a"/><rect x="{x+28}" y="{y-56}" width="6" height="56" fill="#8a5a3a"/>'
    f'<rect x="{x-34}" y="{y-58}" width="68" height="6" rx="2" fill="#a06a42"/>'+''.join(f'<path d="M{x-26+i*4} {y-52}v30" stroke="#f2e6d0" stroke-width="1"/>' for i in range(14))+
    f'<rect x="{x-28}" y="{y-24}" width="56" height="16" fill="#3a5a9a"/><path d="M{x-28} {y-20}h56M{x-28} {y-14}h56" stroke="#e8b84a" stroke-width="2" stroke-dasharray="4 3"/></g>')

# ---------- เพิ่มจากเรื่อง 218–219 ----------
def dog(x,y=152,c='#c89a6a',s=1):
  """สุนัขนอนขดหลับ (ของมีชีวิต) ท้องแตะพื้น y"""
  return (shadow(x,y,18*s,.15)+f'<g transform="translate({x} {y}) scale({s})"><path d="M-18 0q-2-12 12-14q14-2 22 4q4 6 0 10z" fill="{c}"/>'
    f'<circle cx="12" cy="-8" r="7" fill="{c}"/><path d="M8-14q-4 4-2 10M16-14q4 4 2 9" stroke="#8a5a3a" stroke-width="3" fill="none" stroke-linecap="round"/>'
    f'<path d="M9-8q2 1.4 4 0M14-8q2 1.4 4 0" stroke="#2a2a32" stroke-width=".9" fill="none"/><ellipse cx="18" cy="-5" rx="1.6" ry="1.2" fill="#2a2a32"/>'
    f'<path d="M-18 0q-6-2-4-8" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/><text x="22" y="-18" font-size="6" fill="#fff" opacity=".7" font-family="sans-serif">z</text><text x="27" y="-24" font-size="5" fill="#fff" opacity=".5" font-family="sans-serif">z</text></g>')
def sack(x,y=146,c='#c8a878',lbl='#6a4a2a'):
  return (shadow(x,y,16,.15)+f'<g filter="{SH}"><path d="M{x-14} {y}q-3-18 2-28q12-4 24 0q5 10 2 28z" fill="{c}"/></g>'
    f'<path d="M{x-10} {y-28}q10 4 20 0" stroke="#9a7a52" stroke-width="1.4" fill="none"/><circle cx="{x}" cy="{y-13}" r="5" fill="none" stroke="{lbl}" stroke-width="1.2"/><path d="M{x-2} {y-15}q2 2 0 4q2 2 0 4" stroke="{lbl}" stroke-width="1" fill="none"/>')
def roaster(x,y=146):
  return (shadow(x,y,30,.18)+f'<rect x="{x-24}" y="{y-8}" width="48" height="8" rx="2" fill="#3a3a42"/><g filter="{SH}"><rect x="{x-20}" y="{y-44}" width="40" height="36" rx="6" fill="#c0392b"/></g>'
    f'<circle cx="{x}" cy="{y-26}" r="12" fill="#2a2a32"/><circle cx="{x}" cy="{y-26}" r="9" fill="#5a3a2a"/><circle cx="{x-3}" cy="{y-29}" r="2" fill="#8a5a3a"/><circle cx="{x+3}" cy="{y-24}" r="1.6" fill="#8a5a3a"/>'
    f'<path d="M{x-8} {y-44}l4-14h8l4 14z" fill="#9aa0aa"/><rect x="{x+20}" y="{y-34}" width="10" height="4" rx="1" fill="#9aa0aa"/>')
def calendar6(x,y,c='#2e8a6a'):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="56" height="40" rx="2" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="56" height="8" rx="2" fill="{c}"/>'
  for i in range(6):
    s+=f'<rect x="{x+4+i*8.4:.1f}" y="{y+13}" width="7" height="7" rx="1" fill="{c}" opacity="{.25+i*.1:.2f}"/>'
  s+=f'<path d="M{x+4} {y+27}h48" stroke="#e8b84a" stroke-width="2.4" stroke-linecap="round"/><circle cx="{x+4}" cy="{y+27}" r="2.6" fill="#e8b84a"/><path d="M{x+52} {y+27}l-5-3v6z" fill="#e8b84a"/>'
  return s+f'<text x="{x+28}" y="{y+37}" font-size="6" text-anchor="middle" fill="#3a3a42" font-family="sans-serif" font-weight="700">6 เดือน</text>'
def bunting(y,x0,x1,cols):
  s=f'<path d="M{x0} {y}q{(x1-x0)/2} 12 {x1-x0} 0" stroke="#5a4a3a" stroke-width=".8" fill="none"/>'
  n=int((x1-x0)/18)
  for i in range(n):
    xx=x0+9+i*18; yy=y+12*4*(xx-x0)*(x1-xx)/((x1-x0)**2)*1
    s+=f'<path d="M{xx-6:.1f} {yy:.1f}h12l-6 10z" fill="{cols[i%len(cols)]}"/>'
  return s
def booth(x,y=146,c='#2e8a6a'):
  return (shadow(x,y,46,.14)+f'<rect x="{x-44}" y="{y-66}" width="88" height="14" rx="2" fill="{c}"/><text x="{x}" y="{y-56}" font-size="8" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">DOI MIST</text>'
    f'<rect x="{x-42}" y="{y-52}" width="3" height="52" fill="#8a8f9a"/><rect x="{x+39}" y="{y-52}" width="3" height="52" fill="#8a8f9a"/>'
    f'<g filter="{SH}"><rect x="{x-38}" y="{y-26}" width="76" height="26" rx="2" fill="#fffaf0"/></g><rect x="{x-38}" y="{y-26}" width="76" height="5" fill="{c}" opacity=".7"/>')
def cup(x,y,c='#fff',sl='#c0392b'):
  return f'<g filter="{SH}"><path d="M{x-4} {y-10}h8l-1 10h-6z" fill="{c}"/></g><rect x="{x-4.4}" y="{y-7}" width="8.8" height="2.4" fill="{sl}"/><rect x="{x-5}" y="{y-11.5}" width="10" height="2" rx="1" fill="#5a4a3a"/>'
def hangscale(x,y,c='#d8a84a'):
  """ตาชั่งแขวนแบบจานกลม ตะขอบนที่ y"""
  return (f'<path d="M{x} {y}v10" stroke="#5a5a62" stroke-width="1.4"/><g filter="{SH}"><circle cx="{x}" cy="{y+22}" r="12" fill="#fffaf0"/></g>'
    f'<circle cx="{x}" cy="{y+22}" r="12" fill="none" stroke="{c}" stroke-width="2.6"/><path d="M{x} {y+22}l6-5" stroke="#c0392b" stroke-width="1.6" stroke-linecap="round"/>'
    + ''.join(f'<path d="M{x} {y+12}v2" stroke="#8a8f9a" stroke-width=".8" transform="rotate({a} {x} {y+22})"/>' for a in range(-120,121,40))+
    f'<path d="M{x} {y+34}v6M{x-14} {y+52}l14-12 14 12" stroke="#5a5a62" stroke-width="1" fill="none"/><path d="M{x-18} {y+52}h36q-4 8-18 8t-18-8z" fill="#c0c6ce"/>')
def fruit(x,y,c,r=5):
  return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/><circle cx="{x-r*.35:.1f}" cy="{y-r*.35:.1f}" r="{r*.3:.1f}" fill="#fff" opacity=".35"/>'
def awning(x0,x1,y,c1,c2):
  n=int((x1-x0)/16); s=''
  for i in range(n):
    s+=f'<path d="M{x0+i*16} {y}h16v12q-8 6-16 0z" fill="{c1 if i%2==0 else c2}"/>'
  return f'<rect x="{x0}" y="{y-4}" width="{n*16}" height="5" fill="#5a4a3a"/>'+s
def bird(x,y,c='#8a6a4a',flip=False):
  t=f' transform="translate({2*x} 0) scale(-1 1)"' if flip else ''
  return (f'<g{t}><ellipse cx="{x}" cy="{y}" rx="6" ry="4.4" fill="{c}"/><circle cx="{x+5}" cy="{y-3}" r="3.2" fill="{c}"/><path d="M{x+8} {y-3}l3 1-3 1z" fill="#e8a040"/>'
    f'<circle cx="{x+6}" cy="{y-3.6}" r=".7" fill="#1a1a22"/><path d="M{x-6} {y}l-5-2 1 4z" fill="{c}"/><path d="M{x-3} {y-1}q3 3 7 0" stroke="#f2e6d0" stroke-width=".8" fill="none"/><path d="M{x-1} {y+4}v3M{x+2} {y+4}v3" stroke="#e8a040" stroke-width=".8"/></g>')
def logobox(x,y,name,c,fg='#fff',rot=0):
  return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><rect x="{x-20}" y="{y-24}" width="40" height="24" rx="2" fill="{c}"/></g><path d="M{x-20} {y-18}h40" stroke="#000" stroke-opacity=".12"/>'
    f'<circle cx="{x}" cy="{y-11}" r="6" fill="none" stroke="{fg}" stroke-width="1.2"/><path d="M{x-2} {y-14}q4 3 0 6" stroke="{fg}" stroke-width="1" fill="none"/>'
    f'<text x="{x}" y="{y-2}" font-size="4.8" text-anchor="middle" fill="{fg}" font-weight="800" font-family="sans-serif">{name}</text></g>')
def magnifier(x,y,r=9,rot=35):
  return (f'<g transform="rotate({rot} {x} {y})"><circle cx="{x}" cy="{y}" r="{r}" fill="#dff2fb" opacity=".55" stroke="#3a3a42" stroke-width="2.4"/>'
    f'<rect x="{x-2}" y="{y+r}" width="4" height="12" rx="2" fill="#6a4a32"/><path d="M{x-r*.5:.1f} {y-r*.3:.1f}q2-4 6-4" stroke="#fff" stroke-width="1.4" fill="none"/></g>')
def gecko(x,y,c='#7ab86a'):
  return (f'<g transform="translate({x} {y}) rotate(-20)"><ellipse rx="7" ry="2.6" fill="{c}"/><circle cx="8" r="2.6" fill="{c}"/><path d="M-7 0q-6 1-9 5" stroke="{c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    f'<path d="M-3-2l-2-4M-3 2l-2 4M4-2l2-4M4 2l2 4" stroke="{c}" stroke-width="1.2" stroke-linecap="round"/><circle cx="9" cy="-1" r=".6" fill="#1a1a22"/></g>')
def crate(x,y,w=34,h=26,c='#b8864a'):
  return (shadow(x+w/2,y,w*.55,.16)+f'<g filter="{SH}"><rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="{c}"/></g>'
    f'<path d="M{x} {y-h/2}h{w}M{x+3} {y-h+2}l{w-6} {h-4}" stroke="#7a5430" stroke-width="1.4"/><rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="none" stroke="#7a5430" stroke-width="1.4"/>')

# ---------- เพิ่มจากเรื่อง 220–223 ----------
def chair(x,y=146,c='#5a6a8a',tag=None,tc='#fff'):
  s=(shadow(x,y,14,.14)+f'<rect x="{x-12}" y="{y-46}" width="24" height="26" rx="5" fill="{c}"/><rect x="{x-13}" y="{y-22}" width="26" height="6" rx="2" fill="{c}"/>'
     f'<path d="M{x-10} {y-16}v16M{x+10} {y-16}v16" stroke="#3a3a42" stroke-width="2.2"/><rect x="{x-12}" y="{y-46}" width="24" height="4" rx="2" fill="#fff" opacity=".18"/>')
  if tag: s+=f'<g filter="{SH}"><path d="M{x-11} {y-56}h22v10h-22z" fill="#fff"/></g><text x="{x}" y="{y-48.6}" font-size="6.4" text-anchor="middle" fill="{tc}" font-weight="800" font-family="sans-serif">{tag}</text>'
  return s
def butterfly(x,y,c='#f29ab8'):
  return (f'<g transform="translate({x} {y}) rotate(-15)"><path d="M0 0q-9-10-11-2q0 6 11 2zM0 0q9-10 11-2q0 6-11 2z" fill="{c}"/><path d="M0 0q-7 7-8 2q1-4 8-2zM0 0q7 7 8 2q-1-4-8-2z" fill="{c}" opacity=".75"/>'
    f'<path d="M0-4v7" stroke="#3a2a2a" stroke-width="1.2" stroke-linecap="round"/><path d="M0-4l-3-4M0-4l3-4" stroke="#3a2a2a" stroke-width=".6"/></g>')
def columns(x0,n,y0=70,y1=140,gap=34,c='#efe6d4'):
  s=f'<path d="M{x0-12} {y0}l{(n-1)*gap/2+12} -8 {(n-1)*gap/2+12} 8z" fill="{c}"/><rect x="{x0-14}" y="{y0}" width="{(n-1)*gap+28}" height="6" fill="#ddd2bc"/>'
  for i in range(n):
    xx=x0+i*gap
    s+=f'<rect x="{xx-6}" y="{y0+6}" width="12" height="{y1-y0-6}" fill="{c}"/><path d="M{xx-3} {y0+8}v{y1-y0-10}M{xx+3} {y0+8}v{y1-y0-10}" stroke="#c8bca4" stroke-width=".8"/><rect x="{xx-8}" y="{y1-4}" width="16" height="4" fill="#ddd2bc"/>'
  return s+f'<rect x="{x0-18}" y="{y1}" width="{(n-1)*gap+36}" height="3" fill="#cfc4ac"/><rect x="{x0-24}" y="{y1+3}" width="{(n-1)*gap+48}" height="3" fill="#c4b89e"/>'
def handtruck(x,y=146):
  return (shadow(x+8,y,18,.16)+f'<path d="M{x-6} {y-50}l6 46h22" stroke="#3a3a42" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="{x+4}" cy="{y-3}" r="4" fill="#2a2a32"/><circle cx="{x+4}" cy="{y-3}" r="1.4" fill="#8a8f9a"/>'
    f'<g filter="{SH}"><rect x="{x+2}" y="{y-34}" width="26" height="28" rx="2" fill="#7a8a9a"/></g><circle cx="{x+15}" cy="{y-20}" r="7" fill="#5a6a7a"/><path d="M{x+11} {y-22}q4-5 8 0v5q-4 3-8 0z" fill="#c8d4e0"/>')
def splitdoc(x,y):
  return (f'<g transform="rotate(-5 {x} {y})"><g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="22" rx="1.5" fill="#fffdf4"/></g>'
    + ''.join(f'<rect x="{x+4}" y="{y+4+i*4}" width="{22-(i%2)*6}" height="1.6" rx=".8" fill="#c8c0b0"/>' for i in range(4)) + '</g>'
    f'<path d="M{x+33} {y+8}l4 2-4 2" stroke="#e8c870" stroke-width="1.4" fill="none"/>'
    f'<g transform="rotate(7 {x+48} {y+8})"><g filter="{SH}"><rect x="{x+40}" y="{y+2}" width="18" height="14" rx="1.5" fill="#fff6d0"/></g><rect x="{x+43}" y="{y+6}" width="12" height="1.6" fill="#c0392b"/><rect x="{x+43}" y="{y+10}" width="9" height="1.6" fill="#d8c8a0"/></g>')
def sprinkler(x,y=146,c='#5ab0e0'):
  s=shadow(x,y,10,.15)+f'<rect x="{x-1.5}" y="{y-22}" width="3" height="22" fill="#6a6f7a"/><g filter="{SH}"><rect x="{x-7}" y="{y-28}" width="14" height="7" rx="2" fill="#e8b84a"/></g><rect x="{x-5}" y="{y-32}" width="10" height="4" rx="2" fill="#c0392b"/>'
  for dx,h in ((-46,30),(-30,40),(30,40),(46,30)):
    s+=f'<path d="M{x} {y-32}q{dx/2} -{h} {dx} {h-6}" stroke="{c}" stroke-width="1.6" stroke-dasharray="2 3" fill="none" opacity=".85" stroke-linecap="round"/>'
  return s+''.join(f'<circle cx="{x+dx}" cy="{y-4+(i%2)*2}" r="1.4" fill="{c}" opacity=".7"/>' for i,dx in enumerate((-46,-30,30,46)))
def board(x,y,w,h,c='#a87a4a'):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="#e8d4b0"/></g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" stroke="{c}" stroke-width="3"/>'
    f'<path d="M{x+8} {y+h}v{146-y-h}M{x+w-8} {y+h}v{146-y-h}" stroke="{c}" stroke-width="3"/>')
def frog(x,y=146,c='#6ab84a'):
  return (shadow(x,y,7,.15)+f'<ellipse cx="{x}" cy="{y-4}" rx="7" ry="5" fill="{c}"/><circle cx="{x-3.6}" cy="{y-9}" r="2.6" fill="{c}"/><circle cx="{x+3.6}" cy="{y-9}" r="2.6" fill="{c}"/>'
    f'<circle cx="{x-3.6}" cy="{y-9.4}" r="1.2" fill="#1a1a22"/><circle cx="{x+3.6}" cy="{y-9.4}" r="1.2" fill="#1a1a22"/><path d="M{x-3} {y-4}q3 2 6 0" stroke="#2a4a1a" stroke-width=".8" fill="none"/>'
    f'<path d="M{x-7} {y}q-3-1-2-3M{x+7} {y}q3-1 2-3" stroke="{c}" stroke-width="2" fill="none" stroke-linecap="round"/>')
def blueprint(x,y,w=46,h=34,rot=0):
  g=''.join(f'<path d="M{x+i*6} {y}v{h}" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>' for i in range(1,int(w/6)+1))+''.join(f'<path d="M{x} {y+i*6}h{w}" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>' for i in range(1,int(h/6)+1))
  return (f'<g transform="rotate({rot} {x+w/2} {y+h/2})"><g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#2e5a8a"/></g>{g}'
    f'<circle cx="{x+w/2}" cy="{y+h/2}" r="8" fill="none" stroke="#fff" stroke-width="1.2"/><circle cx="{x+w/2}" cy="{y+h/2}" r="3" fill="none" stroke="#fff" stroke-width="1"/>'
    f'<path d="M{x+w/2-14} {y+h/2}h-4M{x+w/2+14} {y+h/2}h4M{x+w/2} {y+h/2-12}v-4" stroke="#fff" stroke-width="1"/><rect x="{x+w-14}" y="{y+h-7}" width="11" height="4" fill="#fff" opacity=".7"/></g>')
def birdcage(x,y,c='#d8a84a'):
  return (f'<path d="M{x} 0v{y-22}" stroke="#5a4a3a" stroke-width="1"/><path d="M{x-12} {y}v-14q12-14 24 0v14z" fill="none" stroke="{c}" stroke-width="1.4"/>'
    + ''.join(f'<path d="M{x-12+i*4} {y}v-{14+ (6 if 2<=i<=4 else 2)}" stroke="{c}" stroke-width=".7"/>' for i in range(1,6)) +
    f'<rect x="{x-14}" y="{y}" width="28" height="3" rx="1.5" fill="{c}"/><path d="M{x-8} {y-6}h16" stroke="#8a5a3a" stroke-width="1.2"/>'
    f'<ellipse cx="{x}" cy="{y-10}" rx="4.6" ry="3.6" fill="#f6d84a"/><circle cx="{x+3.6}" cy="{y-13}" r="2.6" fill="#f6d84a"/><path d="M{x+6} {y-13}l2.4 .8-2.4.8z" fill="#e8903a"/><circle cx="{x+4.2}" cy="{y-13.6}" r=".6" fill="#1a1a22"/>')
def cooler(x,y=146,c='#4ab0a0'):
  return (shadow(x+20,y,26,.16)+f'<g filter="{SH}"><rect x="{x}" y="{y-24}" width="40" height="24" rx="3" fill="{c}"/></g><rect x="{x-2}" y="{y-30}" width="44" height="7" rx="2" fill="#fff"/>'
    f'<path d="M{x+8} {y-24}v24M{x+20} {y-24}v24M{x+32} {y-24}v24" stroke="#fff" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 2"/><rect x="{x+14}" y="{y-34}" width="12" height="4" rx="2" fill="#3a3a42"/>')
def turtle(x,y=146):
  return (f'<g filter="{SH}"><rect x="{x-20}" y="{y-26}" width="40" height="26" rx="3" fill="#bfe6ee" opacity=".6"/></g><rect x="{x-20}" y="{y-14}" width="40" height="14" fill="#8ad0de" opacity=".5"/>'
    f'<ellipse cx="{x}" cy="{y-6}" rx="7" ry="4.4" fill="#6a9a4a"/><path d="M{x-4} {y-8}h8M{x} {y-10}v7" stroke="#4a7a2a" stroke-width=".8"/><circle cx="{x+8}" cy="{y-6}" r="2.4" fill="#8aba6a"/><circle cx="{x+9}" cy="{y-6.6}" r=".5" fill="#1a1a22"/>'
    f'<path d="M{x-14} {y-2}q3-6 6 0" fill="#7a9a5a"/><rect x="{x-20}" y="{y-26}" width="40" height="26" rx="3" fill="none" stroke="#e8f4f8" stroke-width="1.4"/>')
def folders(x,y=146):
  s=''
  for i,(c,dy) in enumerate((('#c0392b',0),('#e8b84a',7),('#3a6ab0',14))):
    s+=f'<g filter="{SH}"><rect x="{x+(i%2)*3}" y="{y-7-dy}" width="34" height="7" rx="1" fill="{c}"/></g><rect x="{x+(i%2)*3+4}" y="{y-5-dy}" width="12" height="2.4" rx="1" fill="#fff" opacity=".8"/>'
  return shadow(x+18,y,20,.15)+s
def easel(x,y=146):
  return (shadow(x,y,22,.15)+f'<path d="M{x-18} {y}l14-70M{x+18} {y}l-14-70M{x} {y-70}v70" stroke="#8a5a3a" stroke-width="2.6" stroke-linecap="round"/><rect x="{x-24}" y="{y-34}" width="48" height="4" rx="1" fill="#8a5a3a"/>'
    f'<g filter="{SH}"><rect x="{x-22}" y="{y-74}" width="44" height="40" rx="1.5" fill="#fffdf6"/></g>')
def elephant(x,y,s=1,c='#9ab8d8'):
  """มาสคอตช้างน้อยสมมติ (ออกแบบเอง) ฐานที่ y"""
  return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cy="-12" rx="12" ry="10" fill="{c}"/><circle cx="-2" cy="-22" r="9" fill="{c}"/>'
    f'<ellipse cx="-11" cy="-22" rx="5" ry="6.4" fill="#f2b8c8"/><ellipse cx="-11" cy="-22" rx="5" ry="6.4" fill="none" stroke="{c}" stroke-width="1.6"/>'
    f'<path d="M5-20q6 2 6 9q0 3-3 3" stroke="{c}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="1" cy="-24" r="1.3" fill="#2a2a32"/>'
    f'<path d="M-8-3v4M4-3v4" stroke="{c}" stroke-width="4" stroke-linecap="round"/><path d="M-4-30l2-5 2 5" fill="#e8b84a"/></g>')
def rabbit(x,y=146,c='#f6f2ec'):
  return (shadow(x,y,9,.15)+f'<ellipse cx="{x}" cy="{y-6}" rx="9" ry="6.4" fill="{c}"/><circle cx="{x+7}" cy="{y-12}" r="5" fill="{c}"/>'
    f'<ellipse cx="{x+5}" cy="{y-21}" rx="1.8" ry="5.4" fill="{c}"/><ellipse cx="{x+9}" cy="{y-21}" rx="1.8" ry="5.4" fill="{c}" transform="rotate(14 {x+9} {y-21})"/>'
    f'<ellipse cx="{x+5}" cy="{y-21}" rx=".8" ry="3.6" fill="#f2b8c8"/><circle cx="{x+9}" cy="{y-13}" r=".9" fill="#2a2a32"/><circle cx="{x+12}" cy="{y-11}" r=".8" fill="#e88aa0"/><circle cx="{x-9}" cy="{y-6}" r="2.4" fill="#fff"/>')
def tree(x,y=146,c='#4a9a5a'):
  return (shadow(x,y,18,.15)+f'<rect x="{x-3}" y="{y-40}" width="6" height="40" fill="#8a5a3a"/><circle cx="{x}" cy="{y-50}" r="18" fill="{c}"/><circle cx="{x-12}" cy="{y-42}" r="11" fill="{c}"/><circle cx="{x+12}" cy="{y-43}" r="12" fill="{c}"/>'
    f'<circle cx="{x-5}" cy="{y-56}" r="6" fill="#fff" opacity=".14"/>')
def flagpole_banner(x,y=146,c='#2e8a8a'):
  return (shadow(x,y,8,.15)+f'<rect x="{x-1.6}" y="{y-80}" width="3.2" height="80" fill="#8a8f9a"/><circle cx="{x}" cy="{y-81}" r="2.4" fill="#e8b84a"/>'
    f'<path d="M{x+2} {y-76}h40v46l-20-6-20 6z" fill="{c}"/><path d="M{x+2} {y-76}h40" stroke="#e8b84a" stroke-width="2"/>')
def copier(x,y=146):
  return (shadow(x,y,26,.17)+f'<g filter="{SH}"><rect x="{x-24}" y="{y-36}" width="48" height="36" rx="3" fill="#d8dce2"/></g><rect x="{x-26}" y="{y-42}" width="52" height="7" rx="2" fill="#b8bec8"/>'
    f'<rect x="{x-20}" y="{y-28}" width="26" height="5" rx="1" fill="#8a9098"/><circle cx="{x+14}" cy="{y-25}" r="2.4" fill="#3aaa5a"/><rect x="{x-22}" y="{y-16}" width="44" height="3" fill="#a8aeb8"/>'
    f'<g transform="rotate(-6 {x+30} {y-30})"><rect x="{x+20}" y="{y-36}" width="18" height="13" fill="#fff"/><rect x="{x+22}" y="{y-34}" width="14" height="7" fill="#9ac0e0"/><rect x="{x+22}" y="{y-25}" width="9" height="1.4" fill="#c8c0b0"/></g>')
def archive_shelf(x,y,w=96,rows=3):
  s=f'<rect x="{x}" y="{y}" width="{w}" height="{rows*20+4}" fill="#5a5a3a"/>'
  cols=['#c8a04a','#8a9a5a','#d8b870','#6a7a4a','#b8904a']
  for r in range(rows):
    yy=y+2+r*20; xx=x+4; i=r
    while xx<x+w-10:
      ww=8+(i*3)%5; s+=f'<rect x="{xx}" y="{yy+2}" width="{ww}" height="16" fill="{cols[i%5]}"/><rect x="{xx+2}" y="{yy+6}" width="{ww-4}" height="3" fill="#fff" opacity=".6"/>'; xx+=ww+1.6; i+=1
    s+=f'<rect x="{x}" y="{yy+18}" width="{w}" height="2.6" fill="#3a3a26"/>'
  return s
def globe(x,y,r=16):
  return (shadow(x,y+r+10,r*.8,.15)+f'<path d="M{x-8} {y+r+10}h16l-3-6h-10z" fill="#8a6a4a"/><path d="M{x} {y+r+4}v-4" stroke="#8a6a4a" stroke-width="2"/>'
    f'<path d="M{x-r-3} {y}a{r+3} {r+3} 0 0 0 {2*r+6} 0" stroke="#c8a04a" stroke-width="1.6" fill="none"/>'
    f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="{r}" fill="#7ac0e0"/></g><path d="M{x-10} {y-8}q6-4 10 0t8 6q-4 6-10 4t-8-10zM{x+2} {y+4}q6 0 8 6q-6 4-10 0z" fill="#8ac07a"/>'
    f'<circle cx="{x-5}" cy="{y-5}" r="{r*.3:.1f}" fill="#fff" opacity=".25"/>')
def dyecloth(x,y,w,h,c):
  return (f'<path d="M{x} {y}h{w}v{h}q-{w/4} 4-{w/2} 0t-{w/2} 0z" fill="{c}"/><path d="M{x+4} {y+6}h{w-8}M{x+4} {y+14}h{w-8}" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="3 2"/>')
def vat(x,y=146,c='#2e3a7a'):
  return (shadow(x,y,20,.16)+f'<g filter="{SH}"><path d="M{x-18} {y-26}h36l-4 26h-28z" fill="#8a6a4a"/></g><ellipse cx="{x}" cy="{y-26}" rx="18" ry="4" fill="{c}"/><ellipse cx="{x-4}" cy="{y-27}" rx="6" ry="1.4" fill="#fff" opacity=".25"/>'
    f'<path d="M{x-18} {y-16}h36M{x-17} {y-8}h34" stroke="#5a4030" stroke-width="1.4"/>')
def hen(x,y=146,c='#f6efe2'):
  return (shadow(x,y,10,.15)+f'<ellipse cx="{x}" cy="{y-9}" rx="10" ry="8" fill="{c}"/><circle cx="{x+8}" cy="{y-18}" r="5" fill="{c}"/><path d="M{x+6} {y-23}q2-4 4 0q2-3 3 1" fill="#d9363e"/>'
    f'<path d="M{x+13} {y-18}l3 1-3 1z" fill="#e8a040"/><circle cx="{x+9}" cy="{y-19}" r=".8" fill="#1a1a22"/><path d="M{x+11} {y-15}q1 3-1 3" fill="#d9363e"/>'
    f'<path d="M{x-10} {y-12}q-6-4-4-10q4 2 6 6" fill="{c}"/><path d="M{x-2} {y-1}v3M{x+2} {y-1}v3" stroke="#e8a040" stroke-width="1"/><path d="M{x-4} {y-10}q4 4 8 0" stroke="#d8ccb8" stroke-width="1" fill="none"/>')
def blocks(x,y=124):
  s=f'<g filter="{SH}"><rect x="{x-26}" y="{y-14}" width="52" height="14" rx="1.5" fill="#d9363e"/></g><rect x="{x-26}" y="{y-10}" width="52" height="3" fill="#fff"/><rect x="{x-26}" y="{y-8}" width="52" height="2" fill="#2e3a7a"/>'
  s+=f'<path d="M{x-4} {y-14}l3 5-4 4 3 5" stroke="#3a2a20" stroke-width="1.2" fill="none"/>'
  for i,(c,dx) in enumerate((('#f2f2f2',-17),('#3a6ab0',0),('#e8b84a',17))):
    s+=f'<g transform="rotate({(-6,3,8)[i]} {x+dx} {y-24})"><g filter="{SH}"><rect x="{x+dx-8}" y="{y-32}" width="16" height="16" rx="1.5" fill="{c}"/></g>'
    s+=(f'<circle cx="{x+dx}" cy="{y-24}" r="3.6" fill="#d9363e"/>' if i==0 else f'<path d="M{x+dx-5} {y-24}h10M{x+dx} {y-29}v10" stroke="#fff" stroke-width="1.4"/>' if i==1 else f'<path d="M{x+dx} {y-29}l1.4 3 3.2.4-2.4 2.2.6 3.2-2.8-1.6-2.8 1.6.6-3.2-2.4-2.2 3.2-.4z" fill="#d9363e"/>')+'</g>'
  return s
def worldmap(x,y,w=110,h=50):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="#2e3a6a"/></g>'
    f'<path d="M{x+10} {y+14}q8-6 16 0t12 8q-6 8-14 6t-14-14zM{x+46} {y+10}q10-4 18 2q6 8-2 14q-8 2-14-4t-2-12zM{x+74} {y+12}q12-2 20 6q2 10-8 12q-10 0-12-8t0-10zM{x+80} {y+32}q6-2 10 4q-2 6-8 4z" fill="#8a7ac8" opacity=".8"/>'
    f'<path d="M{x+90} {y+18}q-14 6-22 16" stroke="#f8d878" stroke-width="1.4" stroke-dasharray="3 2" fill="none"/><circle cx="{x+90}" cy="{y+18}" r="2.2" fill="#f8d878"/>'
    f'<path d="M{x+68} {y+34}q-2 -6 2-8q4 2 2 8z" fill="#f29ab8"/><circle cx="{x+69}" cy="{y+29}" r="1.2" fill="#fff"/>')

# ---------- เพิ่มจากเรื่อง 224–225 ----------
def teaktable(x,y=146,w=60,c='#b8783e'):
  return (shadow(x,y,w*.5,.16)+f'<g filter="{SH}"><rect x="{x-w/2}" y="{y-30}" width="{w}" height="7" rx="1.5" fill="{c}"/></g>'
    f'<path d="M{x-w/2+4} {y-27}h{w-8}" stroke="#8a5a2a" stroke-width=".8" opacity=".6"/><rect x="{x-w/2+4}" y="{y-23}" width="5" height="23" fill="#9a6230"/><rect x="{x+w/2-9}" y="{y-23}" width="5" height="23" fill="#9a6230"/>')
def wallclock(x,y,r=11):
  return (f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="{r}" fill="#fffdf6"/></g><circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="#6a4a32" stroke-width="2"/>'
    f'<path d="M{x} {y}v-{r*.6:.1f}M{x} {y}l{r*.45:.1f} {r*.2:.1f}" stroke="#2a2a32" stroke-width="1.4" stroke-linecap="round"/><circle cx="{x}" cy="{y}" r="1.2" fill="#c0392b"/>')
def receipt(x,y,rot=0):
  return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><path d="M{x} {y}h18v24l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="#fff"/></g>'
    f'<rect x="{x+3}" y="{y+4}" width="12" height="2" fill="#3aaa6a"/><rect x="{x+3}" y="{y+9}" width="9" height="1.6" fill="#c8c0b0"/><rect x="{x+3}" y="{y+13}" width="11" height="1.6" fill="#c8c0b0"/><path d="M{x+4} {y+18}l2 2 4-4" stroke="#3aaa6a" stroke-width="1.4" fill="none"/></g>')
def plank(x,y,c='#b8783e'):
  return (f'<g filter="{SH}"><path d="M{x} {y}q30-8 60 0v8q-30-8-60 0z" fill="{c}"/></g><path d="M{x+6} {y+3}q24-6 48 0" stroke="#8a5a2a" stroke-width=".8" fill="none"/>')
def meter(x,y):
  return (f'<g filter="{SH}"><rect x="{x-7}" y="{y-14}" width="14" height="22" rx="3" fill="#e8b84a"/></g><rect x="{x-5}" y="{y-11}" width="10" height="7" rx="1" fill="#cfe8d0"/>'
    f'<text x="{x}" y="{y-5.6}" font-size="4.4" text-anchor="middle" fill="#2a5a3a" font-weight="800" font-family="sans-serif">18%</text><path d="M{x-3} {y+8}v6M{x+3} {y+8}v6" stroke="#8a8f9a" stroke-width="1.2"/>')
def emptychair(x,y=146,c='#7a8aa0',tag=''):
  return (shadow(x,y,13,.14)+f'<rect x="{x-11}" y="{y-44}" width="22" height="24" rx="5" fill="{c}"/><rect x="{x-12}" y="{y-22}" width="24" height="6" rx="2" fill="{c}"/>'
    f'<path d="M{x-9} {y-16}v16M{x+9} {y-16}v16" stroke="#3a3a42" stroke-width="2"/>'
    + (f'<g filter="{SH}"><rect x="{x-15}" y="{y-36}" width="30" height="9" rx="1" fill="#fff"/></g><text x="{x}" y="{y-29.6}" font-size="4.8" text-anchor="middle" fill="#c0392b" font-weight="800" font-family="sans-serif">{tag}</text>' if tag else ''))
def bigphone(x,y,s=1):
  return (f'<g transform="translate({x} {y}) scale({s}) rotate(-6)"><g filter="{SH}"><rect x="-13" y="-22" width="26" height="44" rx="4" fill="#2a2a32"/></g><rect x="-11" y="-18" width="22" height="34" rx="2" fill="#cfe8f8"/>'
    f'<circle cy="-5" r="6" fill="#e8b896"/><path d="M-8 10q8-10 16 0z" fill="#3a6ab0"/><circle cx="-2" cy="-6" r=".8" fill="#2a2a32"/><circle cx="2" cy="-6" r=".8" fill="#2a2a32"/><path d="M-2-3q2 1.4 4 0" stroke="#b0503a" stroke-width=".8" fill="none"/></g>')
def bagclip(x,y,c='#f29ab8',rot=0):
  return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><rect x="{x-10}" y="{y-3}" width="20" height="6" rx="3" fill="{c}"/></g><rect x="{x-6}" y="{y-1}" width="5" height="2" rx="1" fill="#fff" opacity=".7"/><path d="M{x+10} {y}l4-3v6z" fill="{c}"/></g>')
def hamster(x,y=146,c='#e8b070'):
  return (shadow(x,y,9,.15)+f'<ellipse cx="{x}" cy="{y-7}" rx="9" ry="7" fill="{c}"/><ellipse cx="{x+1}" cy="{y-4}" rx="6" ry="3.6" fill="#fff4e0"/><circle cx="{x-5}" cy="{y-13}" r="2.4" fill="{c}"/><circle cx="{x+5}" cy="{y-13}" r="2.4" fill="{c}"/>'
    f'<circle cx="{x-3}" cy="{y-8}" r="1" fill="#1a1a22"/><circle cx="{x+3}" cy="{y-8}" r="1" fill="#1a1a22"/><circle cx="{x}" cy="{y-6}" r=".8" fill="#e88aa0"/><circle cx="{x+6}" cy="{y-5}" r="1.6" fill="#f2a0a0" opacity=".5"/>')
def shopshelf(x,y,w=90):
  s=f'<rect x="{x}" y="{y}" width="{w}" height="58" fill="#f6efe6"/><rect x="{x}" y="{y}" width="{w}" height="58" fill="none" stroke="#c8a88a" stroke-width="2"/>'
  for r in range(3):
    yy=y+18+r*19; s+=f'<rect x="{x}" y="{yy}" width="{w}" height="3" fill="#c8a88a"/>'
    for i in range(5):
      cc=['#f29ab8','#7ad0c0','#f6c84a','#9ab8f0','#f2a06a'][(i+r)%5]
      s+=f'<path d="M{x+6+i*17} {yy}v-12q0-3 3-3h8q3 0 3 3v12z" fill="{cc}"/><rect x="{x+6+i*17}" y="{yy-12}" width="14" height="2.4" fill="#fff" opacity=".5"/>'
  return s
def snail(x,y,c='#d8a86a'):
  return (f'<path d="M{x-8} {y}h14q4 0 4-4" stroke="#b8c8a0" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="{x-2}" cy="{y-5}" r="5.4" fill="{c}"/><path d="M{x-2} {y-5}m-2.6 0a2.6 2.6 0 1 0 2.6-2.6" stroke="#8a5a2a" stroke-width="1" fill="none"/>'
    f'<path d="M{x+9} {y-4}l1-4M{x+11} {y-3}l2-3" stroke="#b8c8a0" stroke-width="1"/><circle cx="{x+10}" cy="{y-8}" r=".8" fill="#2a2a32"/>')
def stamp(x,y,c='#c0392b'):
  return (shadow(x,y+2,10,.14)+f'<g filter="{SH}"><rect x="{x-10}" y="{y-6}" width="20" height="6" rx="1" fill="{c}"/></g><rect x="{x-3}" y="{y-20}" width="6" height="14" fill="#6a4a32"/><circle cx="{x}" cy="{y-22}" r="5" fill="#6a4a32"/>')
def foodbox(x,y=146,c='#f2f0ea',lid='#e85a5a'):
  return (shadow(x+15,y,18,.14)+f'<g filter="{SH}"><rect x="{x}" y="{y-16}" width="30" height="16" rx="3" fill="{c}"/></g><rect x="{x-2}" y="{y-21}" width="34" height="6" rx="2" fill="{lid}"/>'
    f'<rect x="{x+4}" y="{y-19}" width="5" height="9" rx="1" fill="{lid}" opacity=".7"/><rect x="{x+21}" y="{y-19}" width="5" height="9" rx="1" fill="{lid}" opacity=".7"/>')
def swapforms(x,y):
  return (f'<g transform="rotate(-6 {x+14} {y+14})"><g filter="{SH}"><rect x="{x}" y="{y}" width="28" height="30" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="28" height="6" fill="#3a6ab0"/><text x="{x+14}" y="{y+4.6}" font-size="4" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">สิทธิบัตร</text>'
    f'<rect x="{x+4}" y="{y+11}" width="18" height="2" fill="#c8c0b0"/><rect x="{x+4}" y="{y+16}" width="14" height="2" fill="#c8c0b0"/></g>'
    f'<path d="M{x+34} {y+8}h16l-4-4M{x+50} {y+20}h-16l4 4" stroke="#e8b84a" stroke-width="2" fill="none" stroke-linecap="round"/>'
    f'<g transform="rotate(5 {x+70} {y+14})"><g filter="{SH}"><rect x="{x+56}" y="{y}" width="28" height="30" rx="1.5" fill="#fff"/></g><rect x="{x+56}" y="{y}" width="28" height="6" fill="#c0392b"/><text x="{x+70}" y="{y+4.6}" font-size="3.6" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">อนุสิทธิบัตร</text>'
    f'<rect x="{x+60}" y="{y+11}" width="18" height="2" fill="#c8c0b0"/><rect x="{x+60}" y="{y+16}" width="14" height="2" fill="#c8c0b0"/></g>')

# ---------- เพิ่มจากเรื่อง 226 ----------
def roundtable(x,y=146,c='#c8a07a'):
  return (shadow(x,y,40,.16)+f'<ellipse cx="{x}" cy="{y-28}" rx="40" ry="8" fill="{c}"/><ellipse cx="{x}" cy="{y-30}" rx="40" ry="8" fill="#d8b48a"/><rect x="{x-3}" y="{y-24}" width="6" height="24" fill="#8a6a4a"/><ellipse cx="{x}" cy="{y}" rx="14" ry="2.6" fill="#8a6a4a"/>')
def teaset(x,y):
  return (f'<g filter="{SH}"><path d="M{x-8} {y}q-2-10 8-10t8 10z" fill="#fffaf0"/></g><path d="M{x+8} {y-6}q6-1 6 4" stroke="#fffaf0" stroke-width="2" fill="none"/><path d="M{x-8} {y-4}q-5-2-6-6" stroke="#fffaf0" stroke-width="2" fill="none"/><circle cx="{x}" cy="{y-11}" r="1.6" fill="#c8a07a"/>'
    f'<path d="M{x+16} {y}h8l-1 -5h-6z" fill="#fffaf0"/><path d="M{x-24} {y}h8l-1-5h-6z" fill="#fffaf0"/>'+steam(x+20,y-6,'#fff'))
def aircon(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="56" height="18" rx="4" fill="#f6f8fa"/></g><path d="M{x+6} {y+13}h44" stroke="#c8d0d8" stroke-width="1.6"/><circle cx="{x+48}" cy="{y+6}" r="1.4" fill="#3aaa6a"/>'
    f'<path d="M{x+14} {y+22}q-2 6 0 10M{x+28} {y+22}q-2 6 0 10M{x+42} {y+22}q-2 6 0 10" stroke="#9ad0f0" stroke-width="1.2" fill="none" opacity=".7"/>')
def orchid(x,y=146):
  return (shadow(x,y,9,.14)+f'<path d="M{x-7} {y}l2-12h10l2 12z" fill="#f2f0ea"/><path d="M{x} {y-12}q2-20 10-26" stroke="#5a8a4a" stroke-width="1.4" fill="none"/>'
    + ''.join(f'<g transform="translate({x+px} {y+py})"><circle r="3.4" fill="#d88ad8"/><circle r="1.4" fill="#f8e070"/></g>' for px,py in ((4,-28),(8,-34),(10,-24)))+
    f'<path d="M{x-6} {y-12}q-8-2-10 4q6 2 10-4zM{x+6} {y-12}q8-4 12 2q-6 4-12-2z" fill="#5a9a5a"/>')
def bee(x,y):
  return (f'<ellipse cx="{x}" cy="{y}" rx="4" ry="2.8" fill="#f6c84a"/><path d="M{x-1} {y-2.6}v5.2M{x+1.6} {y-2.4}v4.8" stroke="#2a2a32" stroke-width="1"/><ellipse cx="{x-1}" cy="{y-4}" rx="2.4" ry="1.6" fill="#fff" opacity=".8"/><ellipse cx="{x+2}" cy="{y-4}" rx="2.4" ry="1.6" fill="#fff" opacity=".8"/>'
    f'<path d="M{x-12} {y+4}q4-6 8-4" stroke="#2a2a32" stroke-width=".6" stroke-dasharray="1 2" fill="none"/>')
def nameplate(x,y,t,c='#5a4a7a'):
  return (f'<g filter="{SH}"><path d="M{x-16} {y}l3-9h26l3 9z" fill="{c}"/></g><text x="{x}" y="{y-2.6}" font-size="4.6" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">{t}</text>')
def crossedcal(x,y,c='#e86a5a'):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="46" height="36" rx="2" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="46" height="7" rx="2" fill="{c}"/>'
  for i in range(12):
    cx=x+6+(i%4)*11; cy=y+13+(i//4)*8
    s+=f'<rect x="{cx-3}" y="{cy-2.6}" width="7" height="5.4" rx="1" fill="#f2e6e0"/>'
    if i in (1,6,9): s+=f'<path d="M{cx-3} {cy-3}l7 6M{cx+4} {cy-3}l-7 6" stroke="#c0392b" stroke-width="1.3"/>'
  return s
def signedletter(x,y,rot=0):
  return (f'<g transform="rotate({rot} {x+14} {y+16})"><g filter="{SH}"><rect x="{x}" y="{y}" width="28" height="34" rx="1.5" fill="#fff"/></g><rect x="{x+4}" y="{y+5}" width="20" height="2" fill="#c0392b"/>'
    f'<rect x="{x+4}" y="{y+10}" width="18" height="1.6" fill="#c8c0b0"/><rect x="{x+4}" y="{y+14}" width="15" height="1.6" fill="#c8c0b0"/>'
    + ''.join(f'<path d="M{x+4} {y+21+i*4}q3-3 5 0t5 0" stroke="#2e3a8a" stroke-width="1" fill="none"/>' for i in range(3)) + '</g>')
def folderpass(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}h14l3 4h19v24h-36z" fill="#e8b84a"/></g><rect x="{x+4}" y="{y+8}" width="28" height="16" fill="#fff" opacity=".85"/><rect x="{x+8}" y="{y+12}" width="18" height="1.6" fill="#c8c0b0"/><rect x="{x+8}" y="{y+16}" width="14" height="1.6" fill="#c8c0b0"/>'
    f'<path d="M{x+40} {y+14}h14l-4-4M{x+54} {y+14}l-4 4" stroke="#f8e0a0" stroke-width="1.8" fill="none" stroke-linecap="round"/>')

# ---------- เพิ่มจากเรื่อง 227–228 ----------

def rolldoor(x,y0,w,h):
  s=f'<rect x="{x-4}" y="{y0-6}" width="{w+8}" height="{h+6}" fill="#6a7060"/><rect x="{x}" y="{y0}" width="{w}" height="{h}" fill="#fff6d8" opacity=".55"/>'
  s+=f'<rect x="{x}" y="{y0}" width="{w}" height="{h*.35:.1f}" fill="#b8c0b0"/>'+''.join(f'<path d="M{x} {y0+3+i*4}h{w}" stroke="#8a9080" stroke-width=".8"/>' for i in range(int(h*.35/4)))
  return s
def fertsack(x,y=146,c='#e8e2d0',band='#4a8a3a'):
  return (shadow(x,y,14,.15)+f'<g filter="{SH}"><path d="M{x-13} {y}q-2-10 0-18h26q2 8 0 18z" fill="{c}"/></g><rect x="{x-13}" y="{y-12}" width="26" height="4" fill="{band}"/><path d="M{x-12} {y-18}q12 3 24 0" stroke="#c8c0a8" stroke-width="1" fill="none"/>')
def idcard(x,y,rot=-8):
  return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><rect x="{x-14}" y="{y-9}" width="28" height="18" rx="2" fill="#fff"/></g><rect x="{x-14}" y="{y-9}" width="28" height="5" rx="2" fill="#2e5a8a"/>'
    f'<rect x="{x-11}" y="{y-2}" width="8" height="9" rx="1" fill="#c8d4e0"/><circle cx="{x-7}" cy="{y+1}" r="2" fill="#8a9aaa"/><rect x="{x-1}" y="{y-1}" width="12" height="1.6" fill="#8a9aaa"/><rect x="{x-1}" y="{y+3}" width="9" height="1.6" fill="#c8c0b0"/></g>')
def secretfolder(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}h16l3 4h21v28h-40z" fill="#c86a4a"/></g><g transform="rotate(-12 {x+20} {y+18})"><rect x="{x+4}" y="{y+14}" width="32" height="8" fill="none" stroke="#fff" stroke-width="1.2"/><text x="{x+20}" y="{y+20}" font-size="4.4" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">ข้อมูลลับ</text></g>')
def padlock(x,y,c='#e8b84a'):
  return (f'<path d="M{x-5} {y-6}v-4a5 5 0 0 1 10 0v4" stroke="#8a8f9a" stroke-width="2.4" fill="none"/><g filter="{SH}"><rect x="{x-8}" y="{y-6}" width="16" height="13" rx="2" fill="{c}"/></g><circle cx="{x}" cy="{y}" r="1.8" fill="#6a4a1a"/><path d="M{x} {y}v3" stroke="#6a4a1a" stroke-width="1.2"/>')
def finereceipt(x,y):
  return (f'<g transform="rotate(4 {x+14} {y+16})"><g filter="{SH}"><path d="M{x} {y}h28v32l-4-2-4 2-4-2-4 2-4-2-4 2-4-2z" fill="#fffdf6"/></g><rect x="{x+4}" y="{y+4}" width="20" height="3" fill="#e8833a"/>'
    f'<text x="{x+14}" y="{y+15}" font-size="4" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">เปรียบเทียบปรับ</text><rect x="{x+5}" y="{y+19}" width="18" height="1.6" fill="#c8c0b0"/><path d="M{x+8} {y+25}l3 3 7-7" stroke="#3aaa6a" stroke-width="1.6" fill="none"/></g>')
def signboard(x,y,w,txt,c='#8a3a2a',fg='#f8e0a0'):
  return (f'<path d="M{x+10} {y-8}v8M{x+w-10} {y-8}v8" stroke="#5a4a3a" stroke-width="1.4"/><g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="18" rx="2" fill="{c}"/></g>'
    f'<rect x="{x+2}" y="{y+2}" width="{w-4}" height="14" rx="1.5" fill="none" stroke="{fg}" stroke-width=".8"/><text x="{x+w/2}" y="{y+12.6}" font-size="8" text-anchor="middle" fill="{fg}" font-weight="800" font-family="sans-serif">{txt}</text>')
def pastrytray(x,y):
  s=f'<g filter="{SH}"><rect x="{x-26}" y="{y-4}" width="52" height="4" rx="1" fill="#c8a07a"/></g>'
  for i in range(5):
    s+=f'<ellipse cx="{x-20+i*10}" cy="{y-8}" rx="4.6" ry="3.6" fill="#e8c080"/><circle cx="{x-20+i*10}" cy="{y-9}" r="1" fill="#c0392b"/>'
  return s
def oldphoto(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="24" height="30" rx="1" fill="#8a6a4a"/></g><rect x="{x+3}" y="{y+3}" width="18" height="24" fill="#e8dcc0"/>'
    f'<circle cx="{x+12}" cy="{y+12}" r="4.6" fill="#a89070"/><path d="M{x+5} {y+26}q7-10 14 0z" fill="#a89070"/><path d="M{x+7} {y+8}q5-6 10 0" fill="#d8d0c0"/>')
def keyribbon(x,y):
  return (f'<circle cx="{x}" cy="{y}" r="5" fill="none" stroke="#d8a840" stroke-width="2.2"/><path d="M{x+5} {y}h14M{x+15} {y}v4M{x+19} {y}v3" stroke="#d8a840" stroke-width="2.2"/>'
    f'<path d="M{x-4} {y-4}l-6-6M{x-4} {y-4}l-8 -2" stroke="#d9363e" stroke-width="2" stroke-linecap="round"/>')
def certframe(x,y,w=46,h=34):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="#c8a060"/></g><rect x="{x+3}" y="{y+3}" width="{w-6}" height="{h-6}" fill="#fffaf0"/>'
    f'<circle cx="{x+w/2}" cy="{y+13}" r="5" fill="none" stroke="#c8a060" stroke-width="1.2"/><rect x="{x+9}" y="{y+21}" width="{w-18}" height="2" fill="#c8c0b0"/><rect x="{x+12}" y="{y+25}" width="{w-24}" height="2" fill="#c8c0b0"/>'
    f'<path d="M{x+8} {y+10}q6 8 2 16M{x+w-12} {y+6}q4 10-2 18" stroke="#8ac0e0" stroke-width="2.6" opacity=".55" fill="none"/>'
    + ''.join(f'<path d="M{x+dx} {y+h+2}q-2 4 0 6q2-2 0-6z" fill="#8ac0e0"/>' for dx in (10,22,36)))

# ---------- เพิ่มจากเรื่อง 229–232 ----------
def hide(x,y,c='#b8783e'):
  return (f'<g filter="{SH}"><path d="M{x} {y}q10-6 20-2q12-4 22 2q4 12-2 22q4 10-4 18q-14 4-24 0q-12 2-14-8q-4-10 2-18q-4-8 0-14z" fill="{c}"/></g>'
    f'<path d="M{x+6} {y+8}q14 4 30 0M{x+6} {y+20}q14 4 30 0" stroke="#8a5a2a" stroke-width=".8" stroke-dasharray="2 2" fill="none"/>')
def toolrack(x,y):
  return (f'<rect x="{x}" y="{y}" width="44" height="4" rx="1" fill="#6a4a32"/><path d="M{x+6} {y+4}v14M{x+16} {y+4}v18M{x+28} {y+4}v12M{x+38} {y+4}v16" stroke="#8a8f9a" stroke-width="1.6"/>'
    f'<circle cx="{x+6}" cy="{y+20}" r="2.4" fill="#c8a040"/><rect x="{x+14}" y="{y+20}" width="4" height="6" fill="#6a4a32"/><path d="M{x+26} {y+16}l4 4M{x+30} {y+16}l-4 4" stroke="#8a8f9a" stroke-width="1.4"/><circle cx="{x+38}" cy="{y+22}" r="3" fill="none" stroke="#c0392b" stroke-width="1.2"/>')
def rain(n=26,seed=3):
  import random as R; r=R.Random(seed)
  return ''.join(f'<path d="M{r.randint(0,360)} {r.randint(64,140)}l-3 8" stroke="#bcd4ea" stroke-width="1.2" opacity=".6" stroke-linecap="round"/>' for _ in range(n))
def shopfront(x,y,w,h,c='#8a9aaa'):
  return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/><rect x="{x+6}" y="{y+10}" width="{w-12}" height="{h-10}" fill="#5a6a7a"/>'
    + ''.join(f'<path d="M{x+6} {y+14+i*5}h{w-12}" stroke="#7a8a9a" stroke-width="1.2"/>' for i in range(int((h-14)/5))))
def mailbox(x,y=146,c='#c0392b'):
  return (shadow(x,y,10,.15)+f'<rect x="{x-2}" y="{y-28}" width="4" height="28" fill="#5a5a62"/><g filter="{SH}"><path d="M{x-12} {y-28}v-12a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v12z" fill="{c}"/></g>'
    f'<rect x="{x-8}" y="{y-40}" width="16" height="3" rx="1" fill="#2a2a32"/><path d="M{x-6} {y-44}l4 4M{x-1} {y-46}l2 6M{x+5} {y-45}l-2 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M{x-6} {y-44}l4 4M{x-1} {y-46}l2 6M{x+5} {y-45}l-2 5" stroke="#e8e2d6" stroke-width="2" stroke-linecap="round"/>')
def puddle(x,y=150,w=40):
  return f'<ellipse cx="{x}" cy="{y}" rx="{w/2}" ry="{w*.12:.1f}" fill="#9ab8d0" opacity=".6"/><ellipse cx="{x-4}" cy="{y-1}" rx="{w/5}" ry="1.4" fill="#fff" opacity=".5"/>'
def streetlamp(x,y=146):
  return (f'<rect x="{x-1.6}" y="{y-80}" width="3.2" height="80" fill="#4a4a52"/><path d="M{x} {y-80}q0-6 10-6h4" stroke="#4a4a52" stroke-width="2.4" fill="none"/>'
    f'<path d="M{x+10} {y-86}h12l-2 6h-8z" fill="#3a3a42"/><ellipse cx="{x+16}" cy="{y-79}" rx="5" ry="2" fill="#fff4b0"/><path d="M{x+11} {y-79}l-14 70h40l-14-70z" fill="#fff4b0" opacity=".12"/>')
def gear(x,y,r=10,c='#8a8f9a',n=8):
  import math
  pts=[]
  for i in range(n*2):
    a=math.pi*i/n; rr=r if i%2==0 else r*.78
    pts.append(f'{x+rr*math.cos(a):.1f},{y+rr*math.sin(a):.1f}')
  return f'<polygon points="{" ".join(pts)}" fill="{c}"/><circle cx="{x}" cy="{y}" r="{r*.32:.1f}" fill="#2a2a32" opacity=".6"/>'
def compostbin(x,y=146):
  return (shadow(x,y,28,.17)+f'<g filter="{SH}"><rect x="{x-26}" y="{y-46}" width="52" height="40" rx="5" fill="#4a8a5a"/></g><rect x="{x-30}" y="{y-6}" width="60" height="6" rx="2" fill="#3a3a42"/>'
    + gear(x-8,y-30,11,'#c8ccd2') + gear(x+10,y-22,8,'#e8b84a',7) + f'<rect x="{x-22}" y="{y-42}" width="14" height="5" rx="1" fill="#cfe8d0"/>')
def worm(x,y=146,c='#e8909a'):
  return (f'<path d="M{x-10} {y}q4-10 8-4t8-6" stroke="{c}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="{x+6}" cy="{y-10}" r=".9" fill="#2a2a32"/><path d="M{x-14} {y}q14-4 28 0" stroke="#6a4a32" stroke-width="3" fill="none"/>')
def registerbook(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}q14-4 26 0v22q-12-4-26 0z" fill="#fffdf6"/><path d="M{x+26} {y}q14-4 26 0v22q-12-4-26 0z" fill="#fffaf0"/></g>'
    f'<path d="M{x+4} {y+6}h18M{x+4} {y+10}h14M{x+30} {y+6}h18M{x+30} {y+10}h12" stroke="#c8c0b0" stroke-width="1.2"/>'
    f'<path d="M{x+38} {y-4}v22l3-3 3 3v-22z" fill="#3aaa6a"/><text x="{x+13}" y="{y+18}" font-size="4.2" text-anchor="middle" fill="#3aaa6a" font-weight="800" font-family="sans-serif">ยินยอม</text>')
def coveredmachine(x,y=146):
  return (shadow(x,y,26,.16)+f'<g filter="{SH}"><path d="M{x-26} {y}q-2-30 8-44q18-8 36 0q10 14 8 44z" fill="#d8d0c0"/></g>'
    f'<path d="M{x-14} {y-40}q6 18 2 40M{x+8} {y-44}q-2 20 6 44" stroke="#b8b0a0" stroke-width="1.2" fill="none"/>'
    + ''.join(f'<circle cx="{x+dx}" cy="{y-dy}" r="1" fill="#a89880" opacity=".7"/>' for dx,dy in ((-10,30),(4,36),(12,22),(-4,14),(16,8))))
def pricetag(x,y,t='฿฿฿'):
  return (f'<g transform="rotate(12 {x} {y})"><g filter="{SH}"><path d="M{x-14} {y-8}h22l8 8-8 8h-22z" fill="#e8833a"/></g><circle cx="{x+10}" cy="{y}" r="1.8" fill="#fff"/>'
    f'<text x="{x-4}" y="{y+3}" font-size="8" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">{t}</text></g>')
def balance(x,y):
  return (f'<path d="M{x} {y}v34M{x-12} {y+36}h24" stroke="#c8a040" stroke-width="2.6" stroke-linecap="round"/><path d="M{x-26} {y+4}h52" stroke="#c8a040" stroke-width="2.2" stroke-linecap="round"/>'
    f'<circle cx="{x}" cy="{y}" r="2.6" fill="#e8c870"/><path d="M{x-26} {y+4}l-7 14h14zM{x+26} {y+4}l-7 14h14z" fill="none" stroke="#c8a040" stroke-width=".9"/>'
    f'<path d="M{x-34} {y+18}h16q-2 5-8 5t-8-5zM{x+18} {y+18}h16q-2 5-8 5t-8-5z" fill="#e8c870"/>'
    f'<ellipse cx="{x-26}" cy="{y+16}" rx="4.6" ry="1.8" fill="#f2d070"/><ellipse cx="{x-26}" cy="{y+14}" rx="4.6" ry="1.8" fill="#e8b84a"/>' + gear(x+26,y+12,6,'#9aa4b0',7))
def gameshelf(x,y,w=96):
  s=f'<rect x="{x}" y="{y}" width="{w}" height="64" fill="#2a2440"/><rect x="{x}" y="{y}" width="{w}" height="3" fill="#6ae0f0"/>'
  for r in range(3):
    yy=y+20+r*20; s+=f'<rect x="{x}" y="{yy}" width="{w}" height="2.6" fill="#4a4060"/>'
    for i in range(7):
      cc=['#e85a9a','#6ae0f0','#f6c84a','#8a6af0','#5ad08a'][(i*2+r)%5]
      s+=f'<rect x="{x+5+i*13}" y="{yy-15}" width="10" height="15" rx="1" fill="{cc}"/><rect x="{x+6+i*13}" y="{yy-13}" width="8" height="4" fill="#fff" opacity=".35"/>'
  return s
def usbs(x,y):
  s=''
  for i,c in enumerate(('#e85a9a','#6ae0f0','#f6c84a','#8a6af0')):
    s+=f'<g transform="rotate({(-10,5,-3,8)[i]} {x+i*9} {y})"><rect x="{x+i*9-3}" y="{y-9}" width="6" height="12" rx="1.5" fill="{c}"/><rect x="{x+i*9-2}" y="{y-13}" width="4" height="4" fill="#c8ccd2"/></g>'
  return s
def van(x,y=146):
  return (shadow(x,y,48,.18)+f'<g filter="{SH}"><path d="M{x-46} {y-8}v-44h60l20 18v26z" fill="#f2f0ea"/></g><path d="M{x+14} {y-52}l20 18h-20z" fill="#bcd4ea"/>'
    f'<rect x="{x-46}" y="{y-52}" width="10" height="44" fill="#3a5a8a"/><rect x="{x-44}" y="{y-48}" width="6" height="36" fill="#2a2a32" opacity=".6"/>'
    f'<circle cx="{x-28}" cy="{y-6}" r="7" fill="#2a2a32"/><circle cx="{x+20}" cy="{y-6}" r="7" fill="#2a2a32"/><circle cx="{x-28}" cy="{y-6}" r="2.6" fill="#8a8f9a"/><circle cx="{x+20}" cy="{y-6}" r="2.6" fill="#8a8f9a"/>'
    f'<rect x="{x-36}" y="{y-40}" width="44" height="8" fill="#3a5a8a"/>')
def evidencebag(x,y):
  return (f'<g transform="rotate(-6 {x} {y})"><g filter="{SH}"><rect x="{x-12}" y="{y-14}" width="24" height="28" rx="1.5" fill="#e8f4fa" opacity=".9"/></g><rect x="{x-12}" y="{y-14}" width="24" height="4" fill="#c0392b"/>'
    f'<rect x="{x-5}" y="{y-4}" width="6" height="12" rx="1.5" fill="#e85a9a"/><rect x="{x-4}" y="{y-8}" width="4" height="4" fill="#c8ccd2"/><rect x="{x+3}" y="{y}" width="6" height="10" rx="1.5" fill="#6ae0f0"/></g>')
def clipboard(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="24" height="32" rx="2" fill="#a87a4a"/></g><rect x="{x+3}" y="{y+5}" width="18" height="24" fill="#fff"/><rect x="{x+7}" y="{y-2}" width="10" height="5" rx="1.5" fill="#8a8f9a"/>'
    + ''.join(f'<path d="M{x+5} {y+10+i*5}h4M{x+11} {y+10+i*5}h8" stroke="#c8c0b0" stroke-width="1.4"/>' for i in range(4)))
def seats(y=146,c='#8a1e2e'):
  s=''
  for row,(yy,sc) in enumerate(((y-6,1),(y-22,.86))):
    for i in range(6 if row==0 else 7):
      x=16+i*(22 if row==0 else 19)+(0 if row==0 else 4)
      s+=f'<g transform="translate({x} {yy}) scale({sc})"><rect x="-8" y="-14" width="16" height="14" rx="4" fill="{c}"/><rect x="-9" y="-2" width="18" height="6" rx="2" fill="#6a1420"/></g>'
  return s
def screenbeam(x0,y0):
  return (f'<rect x="{x0}" y="66" width="120" height="40" rx="2" fill="#dfe8f6" opacity=".9"/><rect x="{x0}" y="66" width="120" height="40" rx="2" fill="none" stroke="#e8c870" stroke-width="1.4"/>'
    f'<path d="M{x0+20} 96l14-12 10 8 12-14 18 18z" fill="#9ab0d0"/><path d="M360 64l-{360-x0-120} 2v38z" fill="#fff8d8" opacity=".08"/>')
def recphone(x,y):
  return (f'<g transform="translate({x} {y}) rotate(-8)"><g filter="{SH}"><rect x="-10" y="-16" width="20" height="30" rx="3" fill="#2a2a32"/></g><rect x="-8" y="-13" width="16" height="22" rx="1.4" fill="#cfe0f0"/>'
    f'<circle cx="-4" cy="-9" r="2" fill="#e83a3a"/><text x="2" y="-7.6" font-size="4" fill="#e83a3a" font-weight="800" font-family="sans-serif">REC</text></g>')
def moth(x,y):
  return (f'<g transform="translate({x} {y})"><path d="M0 0q-8-6-10 0q2 5 10 0zM0 0q8-6 10 0q-2 5-10 0z" fill="#d8ccb0"/><ellipse rx="1.4" ry="4" fill="#8a7a5a"/><path d="M0-4l-2-3M0-4l2-3" stroke="#8a7a5a" stroke-width=".6"/></g>')
def dashboard(x,y,w=66):
  h=w*.62
  return (laptop(x,y,w,'#f4fbf2','#4a5a4a')+f'<rect x="{x-w/2+8}" y="{y-h+8}" width="{w*.35:.1f}" height="4" rx="1" fill="#5ab04a"/>'
    + ''.join(f'<rect x="{x-w/2+8+i*8}" y="{y-12-[10,16,8,20,14][i]}" width="5" height="{[10,16,8,20,14][i]}" fill="#8ad07a"/>' for i in range(5))
    + f'<circle cx="{x+w/2-14}" cy="{y-h/2}" r="7" fill="none" stroke="#e8b84a" stroke-width="3"/>')
def shopicons(x,y):
  s=''
  for i,c in enumerate(('#e85a5a','#5a9ae8','#e8b84a')):
    xx=x+i*20
    s+=f'<g filter="{SH}"><path d="M{xx-7} {y}v-9h14v9z" fill="#fff"/></g><path d="M{xx-8} {y-9}l2-5h12l2 5z" fill="{c}"/><rect x="{xx-2}" y="{y-6}" width="4" height="6" fill="{c}"/>'
  return s+f'<path d="M{x-22} {y-20}q10-10 22 0M{x+2} {y-20}q10-10 20 0M{x+22} {y-20}q10-10 20 0" stroke="#e8b84a" stroke-width="1.4" stroke-dasharray="2 2" fill="none"/>'
def whiteboard(x,y,w=54,h=36):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="#fff"/></g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" stroke="#b8c0c8" stroke-width="2"/>'
    f'<text x="{x+w/2}" y="{y+16}" font-size="7" text-anchor="middle" fill="#3a6ab0" font-weight="800" font-family="sans-serif">พ.ร.ฎ. ?</text><path d="M{x+8} {y+24}h{w-16}M{x+8} {y+29}h{w-24}" stroke="#e85a5a" stroke-width="1.4"/>')
def serverrack(x,y=146,h=74):
  s=shadow(x,y,18,.18)+f'<g filter="{SH}"><rect x="{x-16}" y="{y-h}" width="32" height="{h}" rx="2" fill="#2a3040"/></g>'
  for i in range(int((h-6)/10)):
    yy=y-h+4+i*10; s+=f'<rect x="{x-13}" y="{yy}" width="26" height="7" rx="1" fill="#3a4258"/><circle cx="{x+8}" cy="{yy+3.5}" r="1.2" fill="{["#5ad08a","#f2a03a","#5ad08a","#6ae0f0"][i%4]}"/><circle cx="{x+4}" cy="{yy+3.5}" r="1.2" fill="#5ad08a"/>'
  return s
def countdown(x,y,t='90 วัน',c='#e8833a'):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="36" height="22" rx="3" fill="#1e2430"/></g><text x="{x+18}" y="{y+15}" font-size="8" text-anchor="middle" fill="{c}" font-weight="900" font-family="sans-serif">{t}</text>')
def neon(x,y,t,c='#f27ab8'):
  return (f'<text x="{x}" y="{y}" font-size="10" text-anchor="middle" fill="none" stroke="{c}" stroke-width="3" opacity=".3" font-weight="800" font-family="sans-serif">{t}</text>'
    f'<text x="{x}" y="{y}" font-size="10" text-anchor="middle" fill="{c}" font-weight="800" font-family="sans-serif">{t}</text>')

# ---------- เพิ่มจากเรื่อง 233–237 ----------
def courtcounter(x,y=146,w=120):
  return (shadow(x+w/2,y,w*.5,.15)+f'<g filter="{SH}"><rect x="{x}" y="{y-34}" width="{w}" height="34" rx="2" fill="#b8a888"/></g><rect x="{x-4}" y="{y-38}" width="{w+8}" height="6" rx="2" fill="#8a7a5a"/>'
    f'<rect x="{x+8}" y="{y-28}" width="{w-16}" height="3" fill="#a8987a"/>')
def queuedisplay(x,y,n='012'):
  return (f'<path d="M{x+14} {y-8}v8" stroke="#5a5a62" stroke-width="1.4"/><g filter="{SH}"><rect x="{x}" y="{y}" width="28" height="16" rx="2" fill="#1e2430"/></g><text x="{x+14}" y="{y+12}" font-size="9" text-anchor="middle" fill="#f2c94c" font-weight="900" font-family="sans-serif">{n}</text>')
def airpurifier(x,y=146,s=1,c='#f6f8fa'):
  return (shadow(x,y,10*s,.15)+f'<g transform="translate({x} {y}) scale({s})"><g filter="{SH}"><rect x="-10" y="-34" width="20" height="34" rx="5" fill="{c}"/></g>'
    f'<circle cy="-24" r="5" fill="#cfe0ea"/><circle cy="-24" r="2" fill="#5ab0e0"/>' + ''.join(f'<path d="M-6 {-14+i*3}h12" stroke="#d0d8e0" stroke-width="1"/>' for i in range(4)) + '</g>')
def profileboard(x,y,w=70,h=40):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="#fbf4e6"/></g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" stroke="#c87a5a" stroke-width="2"/>'
  for i in range(12):
    cx=x+8+(i%6)*11; cy=y+11+(i//6)*18
    s+=f'<circle cx="{cx}" cy="{cy}" r="3.2" fill="#e8b896"/><path d="M{cx-4} {cy+8}q4-6 8 0z" fill="{["#4aa0a0","#c87a5a","#8a6ab0"][i%3]}"/>'
  return s
def glassdome(x,y=122):
  return (f'<path d="M{x-16} {y}v-26a16 16 0 0 1 32 0v26z" fill="#dff2fb" opacity=".35" stroke="#e8f6ff" stroke-width="1.4"/><rect x="{x-20}" y="{y}" width="40" height="5" rx="1.5" fill="#6a5a8a"/>'
    f'<path d="M{x-10} {y-30}q-3 8-2 18" stroke="#fff" stroke-width="1.6" opacity=".6" fill="none"/>')
def workbench_phones(x,y):
  s=''
  for i,(c,r) in enumerate((('#2a2a32',-8),('#3a4a6a',6),('#2a2a32',-2))):
    s+=phone(x+i*18,y,.7,['#bfe0f8','#f8d0c0','#1e1e24'][i],r)
  return s+f'<path d="M{x+44} {y+6}l10-4M{x+46} {y+10}l8 2" stroke="#8a8f9a" stroke-width="1.6" stroke-linecap="round"/>'
def corkboard(x,y,w=58,h=40):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="#c89a6a"/></g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" stroke="#8a5a3a" stroke-width="2.4"/>'
    f'<rect x="{x+6}" y="{y+6}" width="22" height="28" fill="#fff" transform="rotate(-4 {x+17} {y+20})"/><rect x="{x+9}" y="{y+10}" width="16" height="3" fill="#c0392b" transform="rotate(-4 {x+17} {y+20})"/>'
    f'<rect x="{x+32}" y="{y+8}" width="20" height="18" fill="#fffdf6"/><rect x="{x+32}" y="{y+8}" width="20" height="4" fill="#e8833a"/><circle cx="{x+44}" cy="{y+19}" r="3.4" fill="none" stroke="#c0392b" stroke-width="1.2"/>'
    f'<circle cx="{x+17}" cy="{y+7}" r="1.8" fill="#3a6ab0"/><circle cx="{x+42}" cy="{y+9}" r="1.8" fill="#3a6ab0"/>')
def judgebench(x,y=146,w=110):
  return (shadow(x+w/2,y,w*.5,.16)+f'<g filter="{SH}"><rect x="{x}" y="{y-52}" width="{w}" height="52" rx="2" fill="#7a3e2a"/></g><rect x="{x-4}" y="{y-56}" width="{w+8}" height="6" rx="2" fill="#5a2a1a"/>'
    f'<rect x="{x+8}" y="{y-44}" width="{w-16}" height="36" rx="2" fill="none" stroke="#a8603e" stroke-width="1.4"/><circle cx="{x+w/2}" cy="{y-28}" r="9" fill="#e8c870"/><circle cx="{x+w/2}" cy="{y-28}" r="6" fill="none" stroke="#a87a20" stroke-width="1"/>')
def witnessmic(x,y=146):
  return (shadow(x,y,12,.15)+f'<g filter="{SH}"><rect x="{x-12}" y="{y-30}" width="24" height="30" rx="2" fill="#9a5a3a"/></g><path d="M{x+4} {y-30}l6-12" stroke="#3a3a42" stroke-width="1.6"/><ellipse cx="{x+11}" cy="{y-44}" rx="3" ry="4" fill="#3a3a42"/>')
def skeins(x,y):
  s=f'<path d="M{x-4} {y}h88" stroke="#6a4a32" stroke-width="2.4"/>'
  for i,c in enumerate(('#e8b84a','#c83a7a','#8a3aa8','#e86a3a','#3a8aa8')):
    xx=x+6+i*17; s+=f'<path d="M{xx} {y}q-5 18 0 30q5-12 0-30z" fill="{c}"/><path d="M{xx+4} {y}q-3 18 0 30" stroke="#fff" stroke-opacity=".3" stroke-width="1" fill="none"/>'
  return s
def cocoontray(x,y):
  s=f'<g filter="{SH}"><ellipse cx="{x}" cy="{y}" rx="24" ry="5" fill="#c89a5a"/></g><ellipse cx="{x}" cy="{y-1}" rx="21" ry="3.6" fill="#a87a3a"/>'
  for i in range(7):
    s+=f'<ellipse cx="{x-15+i*5}" cy="{y-3-(i%2)*2}" rx="2.6" ry="1.8" fill="#f8e8a0"/>'
  return s
def silkworm(x,y):
  return (f'<path d="M{x} {y}q-6-6 0-10l16 2q4 4 0 8z" fill="#5a9a4a"/><path d="M{x-2} {y-4}q10-6 20 0q2 6-4 8q-8-2-16-2z" fill="#f6f2e2"/>'
    f'<path d="M{x+2} {y-4}v3M{x+6} {y-5}v3M{x+10} {y-5}v3M{x+14} {y-4}v3" stroke="#d8d0b8" stroke-width=".6"/><circle cx="{x+17}" cy="{y-3}" r=".7" fill="#2a2a32"/>')
def sealbadge(x,y,r=8,c='#c83a7a'):
  return (f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="{r}" fill="#e8c870"/></g><circle cx="{x}" cy="{y}" r="{r*.7:.1f}" fill="none" stroke="{c}" stroke-width="1"/><path d="M{x-3} {y}l2 2 4-4" stroke="{c}" stroke-width="1.4" fill="none"/>'
    f'<path d="M{x-4} {y+r}l-2 6 3-1 2 3 1-7M{x+4} {y+r}l2 6-3-1-2 3-1-7" fill="{c}"/>')
def silkshelf(x,y,w=70):
  s=f'<rect x="{x}" y="{y}" width="{w}" height="50" fill="#e8dcf0"/><rect x="{x}" y="{y+24}" width="{w}" height="3" fill="#8a6aa8"/><rect x="{x}" y="{y+48}" width="{w}" height="3" fill="#8a6aa8"/>'
  for r in range(2):
    for i in range(4):
      c=['#c83a7a','#8a3aa8','#e8b84a','#3a8aa8'][(i+r)%4]
      s+=f'<rect x="{x+5+i*16}" y="{y+8+r*24}" width="13" height="16" rx="1" fill="{c}"/><path d="M{x+5+i*16} {y+14+r*24}h13" stroke="#fff" stroke-opacity=".35"/>'
  return s
def rulebooks(x,y):
  return (f'<g transform="rotate(-6 {x+12} {y+14})"><g filter="{SH}"><rect x="{x}" y="{y}" width="24" height="30" rx="1.5" fill="#d8d0c0"/></g><text x="{x+12}" y="{y+12}" font-size="5" text-anchor="middle" fill="#6a6a62" font-weight="800" font-family="sans-serif">เดิม</text><path d="M{x+4} {y+18}h16M{x+4} {y+22}h12" stroke="#a8a090" stroke-width="1.2"/></g>'
    f'<path d="M{x+30} {y+14}h12l-4-4M{x+42} {y+14}l-4 4" stroke="#f2b84a" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    f'<g transform="rotate(5 {x+60} {y+14})"><g filter="{SH}"><rect x="{x+48}" y="{y}" width="24" height="30" rx="1.5" fill="#fffaf0"/></g><rect x="{x+48}" y="{y}" width="24" height="6" fill="#f2b84a"/><text x="{x+60}" y="{y+16}" font-size="5" text-anchor="middle" fill="#2a6a6a" font-weight="800" font-family="sans-serif">ใหม่</text><path d="M{x+52} {y+20}h16M{x+52} {y+24}h12" stroke="#c8c0b0" stroke-width="1.2"/></g>')
def dyepots(x,y):
  s=''
  for i,c in enumerate(('#2e3a7a','#e8b030','#8a2a4a')):
    xx=x+i*16; s+=f'<g filter="{SH}"><path d="M{xx-6} {y-12}h12l-2 12h-8z" fill="#8a6a4a"/></g><ellipse cx="{xx}" cy="{y-12}" rx="6" ry="1.8" fill="{c}"/>'
  return s
def lathe(x,y=146):
  return (shadow(x,y,34,.18)+f'<rect x="{x-34}" y="{y-8}" width="68" height="8" rx="2" fill="#3a4250"/><g filter="{SH}"><rect x="{x-30}" y="{y-34}" width="20" height="26" rx="3" fill="#5a7a9a"/></g>'
    f'<rect x="{x-10}" y="{y-24}" width="36" height="6" rx="2" fill="#9aa4b0"/><g filter="{SH}"><rect x="{x+20}" y="{y-30}" width="12" height="22" rx="2" fill="#5a7a9a"/></g><circle cx="{x-20}" cy="{y-24}" r="5" fill="#c8a040"/><circle cx="{x-20}" cy="{y-24}" r="2" fill="#3a3a42"/>')
def draftboard(x,y,w=60,h=42):
  return (f'<g filter="{SH}"><path d="M{x} {y+h}l6-{h}h{w}l-6 {h}z" fill="#f6f4ee"/></g><path d="M{x+14} {y+h-10}h{w-24}M{x+16} {y+h-16}h{w-28}" stroke="#c8d0d8" stroke-width="1"/>'
    f'<circle cx="{x+w/2}" cy="{y+16}" r="9" fill="none" stroke="#3a6ab0" stroke-width="1.4"/><path d="M{x+w/2-9} {y+16}h18M{x+w/2} {y+7}v18" stroke="#3a6ab0" stroke-width=".8"/><path d="M{x+w/2+9} {y+16}l12 6" stroke="#3a6ab0" stroke-width="1.4"/>'
    f'<path d="M{x+w-14} {y+4}l10 30" stroke="#c8a040" stroke-width="2"/>')
def splitfolders(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}h16l3 4h21v26h-40z" fill="#e8907a"/></g><path d="M{x+44} {y+8}l10-6M{x+44} {y+22}l10 6" stroke="#3a8a7a" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    f'<g filter="{SH}"><path d="M{x+58} {y-10}h12l2 3h14v18h-28z" fill="#5ab0a0"/><path d="M{x+58} {y+16}h12l2 3h14v18h-28z" fill="#5ab0a0"/></g>'
    f'<g transform="translate({x+38} {y+14}) rotate(-30)"><circle cx="-4" cy="4" r="3" fill="none" stroke="#3a3a42" stroke-width="1.4"/><circle cx="4" cy="4" r="3" fill="none" stroke="#3a3a42" stroke-width="1.4"/><path d="M-2 2l6-10M2 2l-6-10" stroke="#8a8f9a" stroke-width="1.6"/></g>')
def lockedcabinet(x,y=146):
  return (shadow(x,y,18,.16)+f'<g filter="{SH}"><rect x="{x-18}" y="{y-60}" width="36" height="60" rx="2" fill="#5a6a6a"/></g>'
    + ''.join(f'<rect x="{x-14}" y="{y-56+i*19}" width="28" height="16" rx="1.5" fill="#6a7a7a"/><rect x="{x-5}" y="{y-50+i*19}" width="10" height="3" rx="1.5" fill="#c8ccd2"/>' for i in range(3))
    + f'<path d="M{x-3} {y-34}v-3a3 3 0 0 1 6 0v3" stroke="#e8c870" stroke-width="1.6" fill="none"/><rect x="{x-5}" y="{y-34}" width="10" height="7" rx="1" fill="#e8c870"/>')
def translation(x,y):
  return (f'<g transform="rotate(-5 {x+12} {y+12})"><g filter="{SH}"><rect x="{x}" y="{y}" width="22" height="26" fill="#fff"/></g>'
    + ''.join(f'<path d="M{x+4} {y+5+i*5}h3M{x+9} {y+5+i*5}h3M{x+14} {y+5+i*5}h4" stroke="#3a3a42" stroke-width="1.4"/>' for i in range(4)) + '</g>'
    f'<path d="M{x+26} {y+12}h10l-3-3M{x+36} {y+12}l-3 3" stroke="#5ac0a0" stroke-width="1.6" fill="none"/>'
    f'<g transform="rotate(4 {x+50} {y+12})"><g filter="{SH}"><rect x="{x+40}" y="{y}" width="22" height="26" fill="#fffdf2"/></g><rect x="{x+40}" y="{y}" width="22" height="5" fill="#5ac0a0"/><text x="{x+51}" y="{y+16}" font-size="5" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">ไทย</text></g>')
def powerstrip(x,y,c='#f6f6f2',melt=False):
  s=f'<g filter="{SH}"><rect x="{x-18}" y="{y-6}" width="36" height="10" rx="3" fill="{c}"/></g>'+''.join(f'<rect x="{x-13+i*9}" y="{y-3}" width="5" height="4" rx="1" fill="#3a3a42"/>' for i in range(4))+f'<path d="M{x+18} {y}q10 2 12 10" stroke="#3a3a42" stroke-width="1.6" fill="none"/>'
  if melt: s+=f'<path d="M{x-6} {y+4}q2 6 0 8q-3-2 0-8z" fill="#c8b890"/><path d="M{x+2} {y-6}q-4-8 0-14M{x+6} {y-6}q-4-6 0-12" stroke="#8a8f9a" stroke-width="1.6" fill="none" opacity=".6"/><circle cx="{x-2}" cy="{y}" r="5" fill="#3a2a20" opacity=".4"/>'
  return s
def hazardtape(x,y,w,rot=0):
  return (f'<g transform="rotate({rot} {x+w/2} {y})"><rect x="{x}" y="{y-5}" width="{w}" height="10" fill="#f2c832"/>'
    + ''.join(f'<path d="M{x+i*12} {y-5}l8 10h6l-8-10z" fill="#2a2a2a"/>' for i in range(int(w/12)+1)) + '</g>')
def recallbox(x,y=146,w=30,h=22):
  return box(x,y,w,h,'#d8a86a','#c08a4a')+f'<rect x="{x+4}" y="{y-h+6}" width="{w-8}" height="8" rx="1" fill="#e8402a"/><text x="{x+w/2}" y="{y-h+12}" font-size="5" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">เรียกคืน</text>'
def shopwindow(x,y,w,h):
  return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#3a3040"/><rect x="{x+4}" y="{y+4}" width="{w-8}" height="{h-8}" fill="#5a6a8a" opacity=".6"/>'
    + ''.join(f'<path d="M{x+10+i*14} {y+6}l-3 8" stroke="#bcd4ea" stroke-width="1.1" opacity=".6"/>' for i in range(int(w/14))))

# ---------- เพิ่มจากเรื่อง 238–242 ----------
def airfryer(x,y,c='#2a2a32',s=1):
  return (f'<g transform="translate({x} {y}) scale({s})"><g filter="{SH}"><path d="M-10 0v-20q0-6 6-6h8q6 0 6 6v20z" fill="{c}"/></g><rect x="-8" y="-12" width="16" height="9" rx="2" fill="#4a4a52"/><rect x="-3" y="-9" width="6" height="2" rx="1" fill="#c8ccd2"/><circle cy="-20" r="2.4" fill="#e85a3a"/></g>')
def courtenvelope(x,y,rot=-6):
  return (f'<g transform="rotate({rot} {x} {y})"><g filter="{SH}"><rect x="{x-16}" y="{y-11}" width="32" height="22" rx="1.5" fill="#f6efe0"/></g><path d="M{x-16} {y-11}l16 12 16-12" fill="none" stroke="#c8bfae" stroke-width=".8"/>'
    f'<circle cx="{x}" cy="{y+2}" r="5" fill="#c0392b"/><circle cx="{x}" cy="{y+2}" r="3" fill="none" stroke="#f8d0a0" stroke-width=".8"/></g>')
def labreport(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="26" height="32" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="26" height="6" fill="#7ab84a"/>'
    + ''.join(f'<rect x="{x+4}" y="{y+10+i*5}" width="{14-(i%2)*4}" height="2" fill="#c8c0b0"/><path d="M{x+20} {y+10+i*5}l1.4 1.4 2.6-3" stroke="#3aaa5a" stroke-width="1.1" fill="none"/>' for i in range(4)))
def beaker(x,y,c='#9ad08a'):
  return (f'<path d="M{x-5} {y-24}h10v8l7 16h-24l7-16z" fill="#eaf6ff" opacity=".8" stroke="#bcd4ea" stroke-width="1"/><path d="M{x-10} {y-6}h20l2 6h-24z" fill="{c}" opacity=".85"/><circle cx="{x-2}" cy="{y-10}" r="1.4" fill="#fff" opacity=".7"/>')
def doornotice(x,y):
  return (f'<rect x="{x}" y="{y}" width="44" height="76" rx="2" fill="#6a4a3a"/><rect x="{x+4}" y="{y+4}" width="36" height="68" rx="1.5" fill="#7a5a4a"/><circle cx="{x+36}" cy="{y+42}" r="2" fill="#e8c870"/>'
    f'<g filter="{SH}"><rect x="{x+9}" y="{y+14}" width="24" height="28" fill="#fffdf6"/></g><rect x="{x+9}" y="{y+14}" width="24" height="6" fill="#e8833a"/><text x="{x+21}" y="{y+18.6}" font-size="4" text-anchor="middle" fill="#fff" font-weight="800" font-family="sans-serif">หมายบังคับคดี</text>'
    f'<rect x="{x+12}" y="{y+24}" width="18" height="1.6" fill="#c8c0b0"/><rect x="{x+12}" y="{y+29}" width="14" height="1.6" fill="#c8c0b0"/>')
def porchlamp(x,y):
  return (f'<path d="M{x} {y}h6v-4" stroke="#3a3a42" stroke-width="1.6" fill="none"/><path d="M{x+2} {y}h8l-1 10h-6z" fill="#f2b84a"/><path d="M{x+3} {y+10}l-16 60h46l-16-60z" fill="#fff0c0" opacity=".14"/>')
def blender(x,y,c='#e8833a'):
  return (f'<g filter="{SH}"><rect x="{x-8}" y="{y-8}" width="16" height="8" rx="2" fill="{c}"/></g><path d="M{x-7} {y-8}l2-20h10l2 20z" fill="#eaf6ff" opacity=".85" stroke="#bcd4ea" stroke-width=".8"/>'
    f'<path d="M{x-6} {y-12}l1.6-8h8.8l1.6 8z" fill="#f6a03a" opacity=".8"/><rect x="{x-6}" y="{y-31}" width="12" height="3" rx="1.5" fill="#3a3a42"/>')
def yearcal(x,y):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="54" height="34" rx="2" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="54" height="7" rx="2" fill="#5aa04a"/>'
  for i in range(10):
    cx=x+5+(i%5)*10; cy=y+12+(i//5)*10
    s+=f'<rect x="{cx}" y="{cy}" width="8" height="7" rx="1" fill="{"#f2a03a" if i==4 else "#e2f0dc"}"/><text x="{cx+4}" y="{cy+5.6}" font-size="4.6" text-anchor="middle" fill="#3a3a42" font-family="sans-serif">{i+1}</text>'
  return s
def cashenvelope(x,y):
  return (f'<g transform="rotate(-6 {x} {y})"><g filter="{SH}"><rect x="{x-16}" y="{y-10}" width="32" height="20" rx="1.5" fill="#e8d4a0"/></g><rect x="{x-12}" y="{y-14}" width="24" height="8" fill="#7ac08a"/>'
    f'<text x="{x}" y="{y+5}" font-size="4.6" text-anchor="middle" fill="#6a4a1a" font-weight="800" font-family="sans-serif">จ่ายล่วงหน้า</text></g>')
def twosign(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="24" rx="1.5" fill="#fff"/></g><rect x="{x+4}" y="{y+4}" width="20" height="2" fill="#c8c0b0"/>'
    f'<path d="M{x+4} {y+14}q3-3 6 0t6 0" stroke="#2e3a8a" stroke-width="1" fill="none"/><path d="M{x+4} {y+20}h22" stroke="#c8c0b0" stroke-width="1" stroke-dasharray="2 2"/><text x="{x+26}" y="{y+19}" font-size="5" fill="#c0392b" font-family="sans-serif">?</text>')
def missingcert(x,y):
  return (f'<rect x="{x}" y="{y}" width="36" height="26" rx="1.5" fill="none" stroke="#e8d8f0" stroke-width="1.6" stroke-dasharray="3 3"/><text x="{x+18}" y="{y+17}" font-size="9" text-anchor="middle" fill="#e8d8f0" font-weight="800" font-family="sans-serif">?</text>')
def photoframe(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="26" height="30" rx="1" fill="#8a6a4a"/></g><rect x="{x+3}" y="{y+3}" width="20" height="24" fill="#e8dcc8"/>'
    f'<circle cx="{x+13}" cy="{y+12}" r="4.6" fill="#a8907a"/><path d="M{x+6} {y+26}q7-10 14 0z" fill="#a8907a"/><path d="M{x+8} {y+9}q5-3 10 0" stroke="#f2f2f2" stroke-width="1.4" fill="none"/>')
def twistvase(x,y,s=1,c='#d8784a'):
  return (f'<g transform="translate({x} {y}) scale({s})"><g filter="{SH}"><path d="M-6 0q-8-10-4-20q4-8 2-14h16q-2 6 2 14q4 10-4 20z" fill="{c}"/></g>'
    f'<path d="M-8-6q8-6 16 0M-9-14q9-6 18 0M-7-22q7-5 14 0" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/><rect x="-6" y="-37" width="12" height="3" rx="1" fill="{c}"/></g>')
def wheel(x,y=146):
  return (shadow(x,y,22,.16)+f'<rect x="{x-20}" y="{y-14}" width="40" height="14" rx="3" fill="#8a6a4a"/><ellipse cx="{x}" cy="{y-16}" rx="20" ry="4" fill="#6a5040"/><ellipse cx="{x}" cy="{y-17}" rx="14" ry="2.6" fill="#a8886a"/>')
def viewsheet(x,y):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="56" height="34" rx="1.5" fill="#fffdf6"/></g>'
  for i,(dx,sc) in enumerate(((10,.42),(24,.42),(38,.42))):
    s+=f'<g transform="translate({x+dx+4} {y+30}) scale({sc})"><path d="M-6 0q-8-10-4-20q4-8 2-14h16q-2 6 2 14q4 10-4 20z" fill="none" stroke="#3a3a42" stroke-width="2"/></g>'
  return s+f'<text x="{x+28}" y="{y+7}" font-size="4.4" text-anchor="middle" fill="#8a8f9a" font-family="sans-serif">หน้า / ข้าง / บน</text>'
def suitcase(x,y=146,c='#4a8ac8'):
  return (shadow(x,y,18,.16)+f'<g filter="{SH}"><rect x="{x-16}" y="{y-30}" width="32" height="26" rx="4" fill="{c}"/></g><path d="M{x-6} {y-30}v-5h12v5" stroke="#3a3a42" stroke-width="2" fill="none"/>'
    f'<path d="M{x-16} {y-18}h32" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><circle cx="{x-10}" cy="{y-2}" r="2.4" fill="#2a2a32"/><circle cx="{x+10}" cy="{y-2}" r="2.4" fill="#2a2a32"/><rect x="{x+2}" y="{y-26}" width="10" height="7" rx="1" fill="#f6e8c8"/>')
def planewindow(x,y):
  return (f'<rect x="{x-14}" y="{y-20}" width="28" height="40" rx="12" fill="#e8eef4"/><rect x="{x-10}" y="{y-16}" width="20" height="32" rx="9" fill="#9ad0f0"/>'
    f'<path d="M{x-6} {y+4}l12-6-4 6z" fill="#fff"/><ellipse cx="{x+2}" cy="{y-8}" rx="6" ry="2" fill="#fff" opacity=".8"/>')
def jug(x,y=146,s=1,c='#7ac8e8',logo=True):
  g=(f'<g transform="translate({x} {y}) scale({s})"><g filter="{SH}"><path d="M-10 0v-22q0-6 6-8v-5h8v5q6 2 6 8v22z" fill="{c}" opacity=".85"/></g>'
     f'<rect x="-5" y="-38" width="10" height="4" rx="1.4" fill="#2e7ab0"/><path d="M-8-18h16" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/>')
  if logo: g+='<path d="M-3-10q3-6 6 0q-3 4-6 0z" fill="#3a9a5a"/>'
  return g+'</g>'
def filler(x,y=146):
  return (shadow(x,y,22,.16)+f'<g filter="{SH}"><rect x="{x-20}" y="{y-54}" width="40" height="14" rx="2" fill="#c8d4e0"/></g><rect x="{x-4}" y="{y-40}" width="8" height="8" fill="#9aa4b0"/>'
    f'<path d="M{x} {y-32}v6" stroke="#7ac8e8" stroke-width="2" stroke-dasharray="2 2"/><rect x="{x-24}" y="{y-6}" width="48" height="6" rx="2" fill="#6a7484"/><circle cx="{x+12}" cy="{y-47}" r="2" fill="#3aaa5a"/>')
def duck(x,y=146):
  return (shadow(x,y,8,.14)+f'<ellipse cx="{x}" cy="{y-6}" rx="8" ry="5.4" fill="#f6d84a"/><circle cx="{x+6}" cy="{y-13}" r="4" fill="#f6d84a"/><path d="M{x+9} {y-13}l4 1-4 1.4z" fill="#e8903a"/>'
    f'<circle cx="{x+7}" cy="{y-14}" r=".8" fill="#2a2a32"/><path d="M{x-4} {y-7}q3 3 6 0" stroke="#e8c030" stroke-width="1" fill="none"/>')
def pickup(x,y=146):
  return (shadow(x,y,44,.18)+f'<g filter="{SH}"><path d="M{x-42} {y-8}v-22h44l6-14h20l10 14v22z" fill="#e8b830"/></g><path d="M{x+10} {y-42}h16l8 12h-24z" fill="#bcd4ea"/>'
    f'<circle cx="{x-26}" cy="{y-6}" r="7" fill="#2a2a32"/><circle cx="{x+20}" cy="{y-6}" r="7" fill="#2a2a32"/><circle cx="{x-26}" cy="{y-6}" r="2.6" fill="#8a8f9a"/><circle cx="{x+20}" cy="{y-6}" r="2.6" fill="#8a8f9a"/>')
def cone(x,y=146):
  return (shadow(x,y,6,.14)+f'<path d="M{x-6} {y}l4-18h4l4 18z" fill="#f2833a"/><path d="M{x-4.4} {y-7}h8.8" stroke="#fff" stroke-width="2"/><rect x="{x-8}" y="{y-2}" width="16" height="2" fill="#c8601a"/>')
def stophand(x,y):
  return (f'<path d="M{x} {y+30}v-24" stroke="#5a5a62" stroke-width="2"/><g filter="{SH}"><circle cx="{x}" cy="{y}" r="9" fill="#e83a3a"/></g><circle cx="{x}" cy="{y}" r="7" fill="none" stroke="#fff" stroke-width="1"/>'
    f'<text x="{x}" y="{y+2.6}" font-size="5.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">หยุด</text>')
def ledger(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}q14-4 26 0v20q-12-4-26 0z" fill="#fffdf6"/><path d="M{x+26} {y}q14-4 26 0v20q-12-4-26 0z" fill="#fffaf0"/></g>'
    + ''.join(f'<path d="M{x+4} {y+5+i*4}h18M{x+30} {y+5+i*4}h18" stroke="#c8c0b0" stroke-width="1"/>' for i in range(4)) + f'<path d="M{x+26} {y-2}v24" stroke="#c87a3a" stroke-width="1.4"/>')
def bookshelf(x,y,w=80,rows=3):
  s=f'<rect x="{x}" y="{y}" width="{w}" height="{rows*22+4}" fill="#6a4a32"/>'
  cols=['#c0503a','#3a6ab0','#e8b84a','#5a9a6a','#8a5aa0','#d8784a','#4a8a8a']
  for r in range(rows):
    yy=y+3+r*22; xx=x+4; i=r*3
    while xx<x+w-8:
      ww=6+(i*5)%6; h=15+(i%3)*2
      s+=f'<rect x="{xx}" y="{yy+19-h}" width="{ww}" height="{h}" fill="{cols[i%7]}"/><rect x="{xx+1}" y="{yy+22-h}" width="{ww-2}" height="1.4" fill="#fff" opacity=".45"/>'; xx+=ww+1; i+=1
    s+=f'<rect x="{x}" y="{yy+19}" width="{w}" height="3" fill="#4a3222"/>'
  return s
def vinylcrate(x,y=146):
  s=shadow(x+18,y,20,.15)+f'<g filter="{SH}"><rect x="{x}" y="{y-20}" width="36" height="20" rx="1.5" fill="#c89a5a"/></g>'
  for i in range(4):
    s+=f'<rect x="{x+3+i*8}" y="{y-32+(i%2)*2}" width="7" height="14" fill="{["#2a2a32","#c0503a","#3a6ab0","#e8b84a"][i]}"/>'
  return s+f'<circle cx="{x+30}" cy="{y-28}" r="6" fill="#1e1e24"/><circle cx="{x+30}" cy="{y-28}" r="1.8" fill="#e8b84a"/>'
def armchair(x,y=146,c='#7ab8a0'):
  return (shadow(x,y,18,.16)+f'<g filter="{SH}"><rect x="{x-16}" y="{y-36}" width="32" height="24" rx="6" fill="{c}"/></g><rect x="{x-20}" y="{y-20}" width="40" height="12" rx="4" fill="{c}"/>'
    f'<rect x="{x-20}" y="{y-26}" width="8" height="18" rx="3" fill="#6aa890"/><rect x="{x+12}" y="{y-26}" width="8" height="18" rx="3" fill="#6aa890"/><path d="M{x-14} {y-8}v8M{x+14} {y-8}v8" stroke="#6a4a32" stroke-width="2"/>')
def policysign(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="44" height="26" rx="2" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="44" height="6" rx="2" fill="#c0392b"/>'
    f'<text x="{x+22}" y="{y+16}" font-size="5.4" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">ห้ามรับของก๊อป</text><path d="M{x+8} {y+20}h28" stroke="#c8c0b0" stroke-width="1"/>')

# ---------- เพิ่มจากเรื่อง 243–247 ----------
def bobacup(x,y,c='#d8b890'):
  return (f'<g filter="{SH}"><path d="M{x-7} {y-22}h14l-2 22h-10z" fill="#fff" opacity=".9"/></g><path d="M{x-6.4} {y-14}h12.8l-1.4 14h-10z" fill="{c}"/>'
    + ''.join(f'<circle cx="{x-4+i*2.6}" cy="{y-2.6}" r="1.3" fill="#3a2a22"/>' for i in range(4)) + f'<rect x="{x-8}" y="{y-24}" width="16" height="3" rx="1.5" fill="#8a6ab0"/><path d="M{x+2} {y-24}l3-8" stroke="#e85a9a" stroke-width="2"/>')
def moonlogo(x,y):
  return (f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="16" fill="#3a2a5a"/></g><circle cx="{x-3}" cy="{y}" r="9" fill="#f8e8a8"/><circle cx="{x+1}" cy="{y-3}" r="8" fill="#3a2a5a"/>'
    f'<circle cx="{x+7}" cy="{y+6}" r="1.4" fill="#f8e8a8"/><circle cx="{x+9}" cy="{y-7}" r="1" fill="#f8e8a8"/>')
def ticketmachine(x,y=146):
  return (shadow(x,y,12,.16)+f'<g filter="{SH}"><rect x="{x-10}" y="{y-56}" width="20" height="56" rx="3" fill="#e8833a"/></g><rect x="{x-7}" y="{y-50}" width="14" height="9" rx="1.5" fill="#1e2430"/>'
    f'<text x="{x}" y="{y-43.6}" font-size="6" text-anchor="middle" fill="#f2c94c" font-weight="900" font-family="sans-serif">02</text><rect x="{x-5}" y="{y-34}" width="10" height="2" fill="#2a2a32"/><path d="M{x-3} {y-32}h6v8h-6z" fill="#fff"/>')
def folderlabel(x,y,t,c):
  return (f'<g filter="{SH}"><path d="M{x} {y}h14l3 4h19v24h-36z" fill="{c}"/></g><rect x="{x+5}" y="{y+10}" width="26" height="9" rx="1" fill="#fff" opacity=".9"/>'
    f'<text x="{x+18}" y="{y+16.6}" font-size="5.4" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">{t}</text>')
def gazette(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="32" rx="1" fill="#f6f0e2"/></g><rect x="{x+4}" y="{y+4}" width="32" height="4" fill="#c8a040"/>'
    + ''.join(f'<rect x="{x+4}" y="{y+11+i*4}" width="{32-(i%2)*8}" height="1.6" fill="#c8c0b0"/>' for i in range(5))
    + f'<path d="M{x+2} {y+28}l36-24" stroke="#e83a3a" stroke-width="2.4" stroke-linecap="round"/>')
def opener(x,y,c='#7a8a9a'):
  return (f'<g filter="{SH}"><path d="M{x} {y}h22a6 6 0 0 1 0 12h-22z" fill="{c}"/></g><circle cx="{x+22}" cy="{y+6}" r="3.4" fill="#2a2a32"/>'
    f'<rect x="{x-14}" y="{y+2}" width="16" height="8" rx="3" fill="#c8744a"/><path d="M{x+4} {y+3}h10" stroke="#fff" stroke-width="1" opacity=".5"/>')
def rejectletter(x,y,rot=-4):
  return (f'<g transform="rotate({rot} {x+16} {y+20})"><g filter="{SH}"><rect x="{x}" y="{y}" width="32" height="40" rx="1.5" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="32" height="6" fill="#3a5a8a"/>'
    + ''.join(f'<rect x="{x+4}" y="{y+11+i*4}" width="{24-(i%2)*6}" height="1.5" fill="#c8c0b0"/>' for i in range(4))
    + f'<rect x="{x+3}" y="{y+29}" width="26" height="8" rx="1" fill="none" stroke="#c0392b" stroke-width="1.4"/><text x="{x+16}" y="{y+35.2}" font-size="5.4" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">ยกคำขอ</text></g>')
def testchart(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="30" rx="1.5" fill="#fff"/></g><path d="M{x+5} {y+25}h30M{x+5} {y+25}v-19" stroke="#8a8a92" stroke-width="1"/>'
    + ''.join(f'<rect x="{x+9+i*8}" y="{y+25-h}" width="5" height="{h}" fill="{c}"/>' for i,(h,c) in enumerate([(7,'#9ab0b0'),(12,'#9ab0b0'),(17,'#4a9a5a'),(19,'#4a9a5a')]))
    + f'<text x="{x+20}" y="{y+5.6}" font-size="4.6" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">ผลทดสอบ</text>')
def book(x,y,w,h,c,t=None,rot=0):
  s=f'<g transform="rotate({rot} {x+w/2} {y+h/2})"><g filter="{SH}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="{c}"/></g><rect x="{x+2}" y="{y}" width="2" height="{h}" fill="#000" opacity=".15"/>'
  if t: s+=f'<text x="{x+w/2+1}" y="{y+h/2+2}" font-size="5.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">{t}</text>'
  return s+'</g>'
def bookstack(x,y,n=4,cs=('#3a6ab0','#4a8a8a')):
  return shadow(x+14,y,18,.14)+''.join(f'<rect x="{x+(i%2)*2}" y="{y-6-i*6}" width="28" height="6" rx="1" fill="{cs[i%2]}" stroke="#fff" stroke-width=".6"/>' for i in range(n))
def emptyslot(x,y):
  return (f'<rect x="{x}" y="{y}" width="12" height="18" fill="none" stroke="#f2c94c" stroke-width="1.2" stroke-dasharray="2 2"/><text x="{x+6}" y="{y+12}" font-size="8" text-anchor="middle" fill="#f2c94c" font-weight="900" font-family="sans-serif">?</text>')
def noticeboard(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="34" rx="1.5" fill="#fffdf2"/></g><rect x="{x}" y="{y}" width="40" height="7" fill="#6a8a3a"/>'
    f'<text x="{x+20}" y="{y+5.6}" font-size="5" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">ประกาศ</text>'
    + ''.join(f'<path d="M{x+5} {y+13+i*6}l2 2 3-4" stroke="#4a9a5a" stroke-width="1.2" fill="none"/><rect x="{x+13}" y="{y+13+i*6}" width="{22-(i%2)*6}" height="1.6" fill="#c8c0b0"/>' for i in range(3))
    + f'<circle cx="{x+20}" cy="{y-1}" r="2" fill="#e85a5a"/>')
def register(x,y=124):
  return (f'<g filter="{SH}"><path d="M{x} {y}h40l-4-22h-32z" fill="#3a5a4a"/></g><rect x="{x+8}" y="{y-30}" width="24" height="10" rx="1.5" fill="#1e2430"/>'
    f'<text x="{x+20}" y="{y-22.6}" font-size="6.4" text-anchor="middle" fill="#7af0a0" font-weight="900" font-family="sans-serif">฿890</text>'
    + ''.join(f'<rect x="{x+9+(i%4)*6}" y="{y-16+(i//4)*5}" width="4" height="3" rx=".6" fill="#d8c890"/>' for i in range(8)))
def overreceipt(x,y):
  return (f'<g transform="rotate(-6 {x+12} {y+18})"><g filter="{SH}"><path d="M{x} {y}h26v36l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2-2-2z" fill="#fff"/></g>'
    + ''.join(f'<rect x="{x+4}" y="{y+5+i*5}" width="18" height="1.4" fill="#c8c0b0"/>' for i in range(3))
    + f'<text x="{x+13}" y="{y+29}" font-size="6.4" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">฿980</text><path d="M{x+3} {y+31}h20" stroke="#c0392b" stroke-width="1.2"/></g>')
def filestack(x,y):
  return (shadow(x+16,y,20,.14)+''.join(f'<rect x="{x+i}" y="{y-8-i*5}" width="32" height="6" rx="1" fill="{c}" stroke="#fff" stroke-width=".6"/>' for i,c in enumerate(['#e8dcc0','#f2e8d0','#e0d4b4','#f6eedc','#e8dcc0'])))
def scanfile(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="26" height="20" rx="2" fill="#3a8ad8"/></g><path d="M{x+6} {y+6}h10l4 4v6h-14z" fill="#fff"/>'
    f'<text x="{x+13}" y="{y+17}" font-size="4.6" text-anchor="middle" fill="#3a8ad8" font-weight="900" font-family="sans-serif">PDF</text><path d="M{x+20} {y-4}l3 3 5-6" stroke="#4ac87a" stroke-width="2" fill="none" stroke-linecap="round"/>')
def mailscreen(x,y):
  return (f'<rect x="{x}" y="{y}" width="36" height="22" rx="1.5" fill="#fff"/><path d="M{x+6} {y+5}h24v12h-24zM{x+6} {y+5}l12 7 12-7" stroke="#6a8a3a" stroke-width="1.4" fill="none"/>')
def certshield(x,y):
  return (f'<g filter="{SH}"><path d="M{x} {y}l16 6v12q0 12-16 18q-16-6-16-18v-12z" fill="#5a4ab0"/></g><path d="M{x-6} {y+18}l4 4 8-9" stroke="#7af0e8" stroke-width="2.4" fill="none" stroke-linecap="round"/>')

# ---------- เพิ่มจากเรื่อง 152–156 ----------
def invoicepile(x,y):
  return ''.join(f'<g transform="rotate({r} {x+14} {y})"><g filter="{SH}"><rect x="{x}" y="{y-20+i*2}" width="28" height="20" rx="1" fill="#fffdf6"/></g><rect x="{x+3}" y="{y-16+i*2}" width="16" height="2" fill="#c8a040"/></g>' for i,r in enumerate((-8,4,-2)))
def planboard(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="64" height="44" rx="2" fill="#f8fbff"/></g><rect x="{x}" y="{y}" width="64" height="7" fill="#2e7a8a"/>'
    f'<text x="{x+32}" y="{y+5.6}" font-size="5" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">แผนฟื้นฟู</text>'
    + ''.join(f'<rect x="{x+8+i*11}" y="{y+38-h}" width="7" height="{h}" fill="#4ab0a0"/>' for i,h in enumerate((8,12,16,20,24)))
    + f'<text x="{x+52}" y="{y+18}" font-size="7" text-anchor="middle" fill="#e8833a" font-weight="900" font-family="sans-serif">40%</text>')
def offerdoc(x,y,rot=-5):
  return (f'<g transform="rotate({rot} {x+16} {y+20})"><g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="42" rx="1.5" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="34" height="6" fill="#b04a6a"/>'
    f'<text x="{x+17}" y="{y+22}" font-size="10" text-anchor="middle" fill="#b04a6a" font-weight="900" font-family="sans-serif">30%</text>'
    + ''.join(f'<rect x="{x+5}" y="{y+27+i*4}" width="{24-i*5}" height="1.5" fill="#c8c0b0"/>' for i in range(3))+'</g>')
def ballotbox(x,y=124):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y-26}" width="34" height="26" rx="2" fill="#5a8a6a"/></g><rect x="{x+9}" y="{y-27}" width="16" height="3" fill="#2a3a2e"/>'
    f'<rect x="{x+12}" y="{y-36}" width="10" height="12" fill="#fff" transform="rotate(8 {x+17} {y-30})"/><text x="{x+17}" y="{y-8}" font-size="5.6" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">มติ</text>')
def votecard(x,y,c,t):
  return (f'<path d="M{x} {y}v18" stroke="#6a5a4a" stroke-width="1.6"/><g filter="{SH}"><rect x="{x-8}" y="{y-12}" width="16" height="12" rx="1.5" fill="{c}"/></g>'
    f'<text x="{x}" y="{y-4}" font-size="5.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">{t}</text>')
def summonsenv(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="22" rx="1.5" fill="#f6efe0"/></g><path d="M{x} {y}l17 11 17-11" fill="none" stroke="#c8bfae" stroke-width=".9"/>'
    f'<rect x="{x+4}" y="{y+14}" width="18" height="5" fill="#c0392b"/><text x="{x+13}" y="{y+18.2}" font-size="3.8" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">หมายศาล</text>')
def machine(x,y=146):
  return (shadow(x,y,26,.18)+f'<g filter="{SH}"><rect x="{x-24}" y="{y-34}" width="48" height="34" rx="3" fill="#7a8a9a"/></g><circle cx="{x-8}" cy="{y-18}" r="8" fill="#5a6a7a"/><circle cx="{x-8}" cy="{y-18}" r="3" fill="#c8d0d8"/><rect x="{x+4}" y="{y-28}" width="14" height="8" rx="1" fill="#2a3040"/>'
    f'<rect x="{x-20}" y="{y-40}" width="26" height="9" rx="1" fill="#fff" transform="rotate(-6 {x-7} {y-36})"/><text x="{x-7}" y="{y-33.4}" font-size="5" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif" transform="rotate(-6 {x-7} {y-36})">ยึด</text>')
def carsale(x,y=146):
  return (shadow(x,y,34,.18)+f'<g filter="{SH}"><path d="M{x-34} {y-8}v-14q0-4 4-5l10-2 8-10q3-3 8-3h22q5 0 8 4l7 9 10 2q3 1 3 5v14z" fill="#d84a4a"/></g>'
    f'<path d="M{x-14} {y-27}l6-8h12v8zM{x+8} {y-35}h10l6 8h-16z" fill="#cfe8f8"/><circle cx="{x-20}" cy="{y-6}" r="6" fill="#2a2a32"/><circle cx="{x+20}" cy="{y-6}" r="6" fill="#2a2a32"/><circle cx="{x-20}" cy="{y-6}" r="2.4" fill="#c8c8d0"/><circle cx="{x+20}" cy="{y-6}" r="2.4" fill="#c8c8d0"/>'
    f'<rect x="{x-12}" y="{y-24}" width="20" height="9" rx="1" fill="#fff" transform="rotate(-6 {x-2} {y-20})"/><text x="{x-2}" y="{y-17.6}" font-size="5.6" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif" transform="rotate(-6 {x-2} {y-20})">ขาย</text>')
def landdeed(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="28" rx="1.5" fill="#fbf4dc"/></g><circle cx="{x+20}" cy="{y+9}" r="5" fill="none" stroke="#c8a040" stroke-width="1.2"/>'
    f'<rect x="{x+6}" y="{y+17}" width="28" height="1.6" fill="#c8c0b0"/><rect x="{x+9}" y="{y+21}" width="22" height="1.6" fill="#c8c0b0"/>'
    f'<path d="M{x-2} {y+30}l44-32" stroke="#c0392b" stroke-width="2" opacity=".85"/>')
def shirtpile(x,y=124):
  return shadow(x+16,y,22,.14)+''.join(f'<path d="M{x+i} {y-6-i*5}h32v5h-32z" fill="{c}" stroke="#fff" stroke-width=".6"/>' for i,c in enumerate(['#e85a5a','#3a8ad8','#f2c94c','#4aa86a']))
def tshirt(x,y,c):
  return f'<g filter="{SH}"><path d="M{x-12} {y}l8-6h16l8 6-5 6-4-2v18h-14v-18l-4 2z" fill="{c}"/></g>'
def scaletwo(x,y):
  return (f'<path d="M{x} {y}v34M{x-24} {y+6}h48" stroke="#8a6a3a" stroke-width="2"/><path d="M{x-10} {y+40}h20" stroke="#8a6a3a" stroke-width="3"/>'
    f'<path d="M{x-32} {y+20}h16l-8-14zM{x+16} {y+16}h16l-8-10z" fill="none" stroke="#8a6a3a"/><ellipse cx="{x-24}" cy="{y+20}" rx="10" ry="3" fill="#c8a040"/><ellipse cx="{x+24}" cy="{y+16}" rx="10" ry="3" fill="#c8a040"/>'
    f'<text x="{x-24}" y="{y+16}" font-size="5.4" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">฿เขา</text><text x="{x+24}" y="{y+12}" font-size="5.4" text-anchor="middle" fill="#2e7a5a" font-weight="900" font-family="sans-serif">฿เรา</text>')

# ---------- เพิ่มจากเรื่อง 157–161 ----------
def handbag(x,y,c):
  return f'<g filter="{SH}"><path d="M{x-9} {y}h18l-2-14h-14z" fill="{c}"/></g><path d="M{x-5} {y-14}q5-8 10 0" stroke="{c}" stroke-width="1.6" fill="none"/>'
def seizetag(x,y):
  return f'<g transform="rotate(-8 {x} {y})"><rect x="{x-11}" y="{y-5}" width="22" height="10" rx="1" fill="#fff" stroke="#c0392b"/><text x="{x}" y="{y+2.6}" font-size="5.4" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">ยึด</text></g>'
def espresso(x,y=124):
  return f'<g filter="{SH}"><rect x="{x-14}" y="{y-30}" width="28" height="30" rx="3" fill="#5a6a7a"/></g><rect x="{x-10}" y="{y-26}" width="20" height="6" rx="1" fill="#c8d0d8"/><rect x="{x-3}" y="{y-14}" width="6" height="5" fill="#2a2a32"/>'
def verdict(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="32" height="40" rx="1.5" fill="#fffdf6"/></g><rect x="{x}" y="{y}" width="32" height="7" fill="#7a3e2a"/>'
    f'<text x="{x+16}" y="{y+5.6}" font-size="4.6" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">คำพิพากษา</text>'
    + ''.join(f'<rect x="{x+4}" y="{y+12+i*5}" width="{24-(i%2)*6}" height="1.6" fill="#c8c0b0"/>' for i in range(4))
    + f'<text x="{x+16}" y="{y+37}" font-size="5.6" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">แพ้ 45,000</text>')
def pausesign(x,y):
  return f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="14" fill="#3a8ad8"/></g><rect x="{x-6}" y="{y-7}" width="4" height="14" rx="1" fill="#fff"/><rect x="{x+2}" y="{y-7}" width="4" height="14" rx="1" fill="#fff"/>'
def cake(x,y=124):
  return (f'<g filter="{SH}"><rect x="{x-16}" y="{y-14}" width="32" height="14" rx="2" fill="#f8d8e0"/></g><rect x="{x-12}" y="{y-24}" width="24" height="10" rx="2" fill="#fff4f6"/>'
    f'<path d="M{x-16} {y-10}q4 4 8 0t8 0 8 0 8 0" stroke="#e86a8a" stroke-width="1.6" fill="none"/><rect x="{x-1}" y="{y-31}" width="2" height="7" fill="#f2c94c"/><circle cx="{x}" cy="{y-33}" r="1.8" fill="#f8a040"/>')
def unpaidbill(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="36" rx="1.5" fill="#fff"/></g><text x="{x+15}" y="{y+12}" font-size="5.4" text-anchor="middle" fill="#6a4a5a" font-weight="900" font-family="sans-serif">ค้างจ่าย</text>'
    f'<text x="{x+15}" y="{y+25}" font-size="7" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">32,000</text>')
def emptypurse(x,y):
  return (f'<g filter="{SH}"><path d="M{x-16} {y}h32l-3-18h-26z" fill="#a8603a"/></g><path d="M{x-10} {y-18}q10-10 20 0" stroke="#7a4028" stroke-width="2" fill="none"/>'
    f'<circle cx="{x+20}" cy="{y-2}" r="3" fill="#e8b83a" opacity=".6"/><path d="M{x-4} {y-8}h8" stroke="#fff" stroke-width="1.4" opacity=".5"/>')
def bankbook(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="26" height="32" rx="2" fill="#3a6aa8"/></g><rect x="{x+4}" y="{y+6}" width="18" height="4" fill="#fff" opacity=".8"/>'
    f'<text x="{x+13}" y="{y+24}" font-size="6" text-anchor="middle" fill="#f2c94c" font-weight="900" font-family="sans-serif">฿0</text>')

# ---------- เพิ่มจากเรื่อง 162–166 ----------
def twofiles(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="36" rx="2" fill="#e8c870"/></g><text x="{x+15}" y="{y+20}" font-size="6" text-anchor="middle" fill="#6a4a1a" font-weight="900" font-family="sans-serif">ศาล A</text>'
    f'<g filter="{SH}"><rect x="{x+36}" y="{y+2}" width="30" height="36" rx="2" fill="#e8c870" opacity=".9"/></g><text x="{x+51}" y="{y+22}" font-size="6" text-anchor="middle" fill="#6a4a1a" font-weight="900" font-family="sans-serif">ศาล B</text>'
    f'<path d="M{x+32} {y+4}l40 34M{x+72} {y+4}l-40 34" stroke="#c0392b" stroke-width="3" opacity=".85"/>')
def bricks(x,y=146):
  return shadow(x+20,y,24,.15)+''.join(f'<rect x="{x+(i%3)*14+(i//3%2)*7}" y="{y-8-(i//3)*8}" width="13" height="7" rx="1" fill="#c8603a" stroke="#a84a2a" stroke-width=".6"/>' for i in range(9))
def transferslip(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="22" rx="2" fill="#fff"/></g><rect x="{x}" y="{y}" width="34" height="6" fill="#4aa86a"/>'
    f'<text x="{x+17}" y="{y+16}" font-size="6.6" text-anchor="middle" fill="#2e7a4a" font-weight="900" font-family="sans-serif">฿300,000</text>')
def usedcar(x,y=146,c='#4a8ac8'):
  return (shadow(x,y,32,.18)+f'<g filter="{SH}"><path d="M{x-32} {y-8}v-12q0-4 4-5l10-2 8-10q3-3 8-3h20q5 0 8 4l7 9 10 2q3 1 3 5v12z" fill="{c}"/></g>'
    f'<path d="M{x-12} {y-25}l6-8h12v8zM{x+8} {y-33}h9l6 8h-15z" fill="#d8ecf8"/><circle cx="{x-18}" cy="{y-6}" r="6" fill="#2a2a32"/><circle cx="{x+18}" cy="{y-6}" r="6" fill="#2a2a32"/>')
def landplot(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="44" height="30" rx="2" fill="#fbf4dc"/></g><path d="M{x+6} {y+24}l10-14 8 6 8-10 8 18z" fill="#8ac86a"/>'
    f'<rect x="{x+28}" y="{y+4}" width="12" height="6" fill="#c0392b"/><text x="{x+34}" y="{y+8.6}" font-size="3.8" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">จำนอง</text>')
def vegcrate(x,y=124,c='#4aa86a'):
  return (f'<g filter="{SH}"><rect x="{x-16}" y="{y-14}" width="32" height="14" rx="1.5" fill="#c8a070"/></g>'
    + ''.join(f'<circle cx="{x-10+i*7}" cy="{y-16}" r="4" fill="{c}"/>' for i in range(4)) + f'<path d="M{x-16} {y-7}h32" stroke="#a8804a" stroke-width="1"/>')
def offsetnote(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="30" rx="2" fill="#fffdf2"/></g>'
    f'<text x="{x+20}" y="{y+9}" font-size="5" text-anchor="middle" fill="#3a3a42" font-weight="800" font-family="sans-serif">50,000</text>'
    f'<text x="{x+20}" y="{y+17}" font-size="5" text-anchor="middle" fill="#c0392b" font-weight="800" font-family="sans-serif">−30,000</text>'
    f'<path d="M{x+6} {y+20}h28" stroke="#3a3a42"/><text x="{x+20}" y="{y+27}" font-size="6" text-anchor="middle" fill="#2e7a4a" font-weight="900" font-family="sans-serif">20,000</text>')

# ---------- เพิ่มจากเรื่อง 167–171 ----------
def peeler(x,y):
  return (f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="11" fill="#e8833a"/></g><circle cx="{x}" cy="{y}" r="5" fill="#fff4e0"/><rect x="{x-2}" y="{y+10}" width="4" height="14" rx="2" fill="#5a4a3a"/>'
    f'<ellipse cx="{x+22}" cy="{y+10}" rx="9" ry="6" fill="#f2c94c"/><path d="M{x+14} {y+6}q8-6 16 0" stroke="#8ac04a" stroke-width="1.6" fill="none"/>')
def filestamp(x,y,t,c):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="36" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="30" height="6" fill="{c}"/>'
    f'<text x="{x+15}" y="{y+22}" font-size="6" text-anchor="middle" fill="{c}" font-weight="900" font-family="sans-serif">{t}</text>')
def hotpot(x,y=124):
  return (f'<g filter="{SH}"><ellipse cx="{x}" cy="{y-6}" rx="16" ry="7" fill="#3a3a42"/></g><ellipse cx="{x}" cy="{y-9}" rx="13" ry="4" fill="#e85a3a"/><path d="M{x-6} {y-14}q2-6 0-10M{x+4} {y-14}q2-6 0-10" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>')
def namesign(x,y,names):
  s=f'<g filter="{SH}"><rect x="{x}" y="{y}" width="80" height="22" rx="3" fill="#7a2a2a"/></g><text x="{x+40}" y="{y+9}" font-size="6.4" text-anchor="middle" fill="#f8e0a0" font-weight="900" font-family="sans-serif">ชาบูสี่สหาย</text>'
  return s+f'<text x="{x+40}" y="{y+18}" font-size="4.6" text-anchor="middle" fill="#fff" font-family="sans-serif">{names}</text>'
def newspaper(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="38" height="28" rx="1" fill="#f4f0e4"/></g><rect x="{x+3}" y="{y+3}" width="32" height="5" fill="#3a3a42"/>'
    + ''.join(f'<rect x="{x+3+(i%2)*17}" y="{y+11+(i//2)*4}" width="15" height="1.6" fill="#a8a49a"/>' for i in range(8)))
def pie4(x,y,r=16,new=False):
  cols=['#e8833a','#3a8ad8','#4aa86a','#c85a8a']
  s=f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="{r}" fill="#fff"/></g>'
  import math
  for i,c in enumerate(cols):
    a0=math.radians(i*90-90); a1=math.radians((i+1)*90-90)
    s+=f'<path d="M{x} {y}L{x+r*math.cos(a0):.1f} {y+r*math.sin(a0):.1f}A{r} {r} 0 0 1 {x+r*math.cos(a1):.1f} {y+r*math.sin(a1):.1f}z" fill="{c}"/>'
  return s
def oven(x,y=124):
  return (f'<g filter="{SH}"><rect x="{x-18}" y="{y-28}" width="36" height="28" rx="3" fill="#8a8a92"/></g><rect x="{x-13}" y="{y-22}" width="22" height="16" rx="2" fill="#2a2a32"/><rect x="{x-11}" y="{y-20}" width="18" height="12" rx="1" fill="#f8a040" opacity=".6"/>'
    f'<circle cx="{x+13}" cy="{y-18}" r="2" fill="#2a2a32"/><circle cx="{x+13}" cy="{y-10}" r="2" fill="#2a2a32"/>')
def balancesheet(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="36" height="44" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="36" height="7" fill="#2e5a8a"/>'
    f'<text x="{x+18}" y="{y+5.6}" font-size="4.6" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">งบดุล</text>'
    + ''.join(f'<rect x="{x+4}" y="{y+12+i*5}" width="12" height="1.6" fill="#c8c0b0"/><rect x="{x+22}" y="{y+12+i*5}" width="10" height="1.6" fill="#8aa8c8"/>' for i in range(5))
    + f'<text x="{x+18}" y="{y+42}" font-size="5" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">?</text>')
def minutebook(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="26" rx="2" fill="#7a3a2a"/></g><rect x="{x+3}" y="{y+3}" width="28" height="20" rx="1" fill="#fbf4e4"/>'
    f'<path d="M{x+17} {y+3}v20" stroke="#c8b898"/><text x="{x+10}" y="{y+14}" font-size="4" text-anchor="middle" fill="#7a3a2a" font-weight="900" font-family="sans-serif">มติ</text>')

# ---------- เพิ่มจากเรื่อง 172–176 ----------
def chairs3(x,y=146,cs=('#8a5a3a','#8a5a3a','#c0392b')):
  return ''.join(shadow(x+i*30,y,10,.12)+f'<g filter="{SH}"><rect x="{x+i*30-9}" y="{y-34}" width="18" height="20" rx="3" fill="{c}"/><rect x="{x+i*30-10}" y="{y-16}" width="20" height="5" rx="2" fill="{c}"/></g><path d="M{x+i*30-8} {y-11}v11M{x+i*30+8} {y-11}v11" stroke="#4a3a2a" stroke-width="2"/>' for i,c in enumerate(cs))
def fabricroll(x,y,c):
  return f'<g filter="{SH}"><rect x="{x}" y="{y-12}" width="34" height="12" rx="6" fill="{c}"/></g><ellipse cx="{x+34}" cy="{y-6}" rx="3" ry="6" fill="#fff" opacity=".6"/>'
def lossgraph(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="44" height="32" rx="2" fill="#fff"/></g><path d="M{x+6} {y+8}l8 6 8-2 8 8 8 6" stroke="#c0392b" stroke-width="2" fill="none"/><path d="M{x+40} {y+26}l-4 0 0-4" stroke="#c0392b" stroke-width="2" fill="none"/>')
def closedsign(x,y):
  return f'<path d="M{x+14} {y-10}l-10 10M{x+14} {y-10}l10 10" stroke="#6a6a6a" stroke-width="1"/><g filter="{SH}"><rect x="{x}" y="{y}" width="28" height="14" rx="2" fill="#c0392b"/></g><text x="{x+14}" y="{y+9.6}" font-size="6.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">ปิด</text>'
def labelroll(x,y):
  return f'<g filter="{SH}"><circle cx="{x}" cy="{y}" r="12" fill="#fff"/></g><circle cx="{x}" cy="{y}" r="5" fill="#c8c0b0"/><path d="M{x+10} {y+6}h22v8h-22" fill="#fff" stroke="#e8a0c0"/>'

# ---------- เพิ่มจากเรื่อง 177–181 ----------
def scissorbar(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="12" height="36" fill="#3a8ad8"/><rect x="{x+16}" y="{y+12}" width="12" height="24" fill="#3a8ad8" opacity=".6"/></g>'
    f'<path d="M{x+14} {y+10}l14 -6M{x+14} {y+10}l14 6" stroke="#c0392b" stroke-width="2"/><circle cx="{x+30}" cy="{y+4}" r="3" fill="none" stroke="#c0392b" stroke-width="1.6"/><circle cx="{x+30}" cy="{y+16}" r="3" fill="none" stroke="#c0392b" stroke-width="1.6"/>')
def twoshops(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="28" rx="2" fill="#e8833a"/><rect x="{x+44}" y="{y}" width="34" height="28" rx="2" fill="#3a8ad8"/></g>'
    f'<path d="M{x+34} {y+14}h10" stroke="#3a3a42" stroke-width="2"/><path d="M{x+36} {y+10}l6 4-6 4" fill="none" stroke="#3a3a42" stroke-width="2"/><text x="{x+17}" y="{y+18}" font-size="7" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">A</text><text x="{x+61}" y="{y+18}" font-size="7" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">B</text>')
def proxyletter(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="38" rx="1.5" fill="#fff"/></g><text x="{x+15}" y="{y+9}" font-size="5" text-anchor="middle" fill="#3a3a42" font-weight="900" font-family="sans-serif">มอบฉันทะ</text>'
    + ''.join(f'<rect x="{x+4}" y="{y+14+i*5}" width="22" height="1.6" fill="#c8c0b0"/>' for i in range(3)) + f'<path d="M{x+6} {y+32}q6-6 10 0t8 -2" stroke="#3a6ab0" stroke-width="1.2" fill="none"/>')
def ballotbox2(x,y=124):
  return f'<g filter="{SH}"><rect x="{x}" y="{y-24}" width="32" height="24" rx="2" fill="#8a5ab0"/></g><rect x="{x+9}" y="{y-25}" width="14" height="3" fill="#3a2a4a"/><text x="{x+16}" y="{y-8}" font-size="5.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">ลับ</text>'
def regbook(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="46" height="30" rx="2" fill="#2e5a8a"/></g><rect x="{x+3}" y="{y+3}" width="40" height="24" rx="1" fill="#fbf4e4"/><path d="M{x+23} {y+3}v24" stroke="#c8b898"/>'
    + ''.join(f'<rect x="{x+6}" y="{y+7+i*4}" width="14" height="1.4" fill="#c8c0b0"/><rect x="{x+26}" y="{y+7+i*4}" width="14" height="1.4" fill="#c8c0b0"/>' for i in range(4))
    + f'<rect x="{x+26}" y="{y+18}" width="14" height="3" fill="#f2c94c" opacity=".7"/>')
def auditreport(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="34" height="42" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="34" height="7" fill="#2e7a5a"/>'
    f'<text x="{x+17}" y="{y+5.6}" font-size="4.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">รายงานผู้สอบ</text>'
    + ''.join(f'<rect x="{x+4}" y="{y+12+i*5}" width="{26-(i%2)*6}" height="1.6" fill="#c8c0b0"/>' for i in range(4))
    + f'<path d="M{x+8} {y+36}l4 4 8-9" stroke="#2e7a5a" stroke-width="2" fill="none"/>')

# ---------- เพิ่มจากเรื่อง 182–186 ----------
def shophouse(x,y=146):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y-80}" width="70" height="80" fill="#d8c8b0"/></g><rect x="{x}" y="{y-84}" width="70" height="6" fill="#a88a6a"/>'
    f'<rect x="{x+8}" y="{y-70}" width="22" height="18" fill="#cfe6fa"/><rect x="{x+40}" y="{y-70}" width="22" height="18" fill="#cfe6fa"/><rect x="{x+6}" y="{y-40}" width="58" height="40" fill="#8a7a6a"/>'
    + ''.join(f'<path d="M{x+6} {y-36+i*5}h58" stroke="#6a5a4a" stroke-width=".8"/>' for i in range(7)))
def mortgagetag(x,y):
  return f'<g transform="rotate(-8 {x} {y})"><rect x="{x-18}" y="{y-7}" width="36" height="14" rx="2" fill="#c0392b"/><text x="{x}" y="{y+3}" font-size="6.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">ติดจำนอง</text></g>'
def landtitle(x,y,stamp=None):
  s=(f'<g filter="{SH}"><rect x="{x}" y="{y}" width="40" height="30" rx="1.5" fill="#fbf4dc"/></g><circle cx="{x+20}" cy="{y+10}" r="6" fill="none" stroke="#c8a040" stroke-width="1.2"/>'
    f'<rect x="{x+6}" y="{y+19}" width="28" height="1.6" fill="#c8c0b0"/><rect x="{x+9}" y="{y+23}" width="22" height="1.6" fill="#c8c0b0"/>')
  if stamp: s+=f'<g transform="rotate(-10 {x+20} {y+15})"><rect x="{x+4}" y="{y+9}" width="32" height="11" rx="1" fill="none" stroke="#2e8a5a" stroke-width="1.6"/><text x="{x+20}" y="{y+17}" font-size="5.6" text-anchor="middle" fill="#2e8a5a" font-weight="900" font-family="sans-serif">{stamp}</text></g>'
  return s
def ricesacks(x,y=146):
  return ''.join(sack(x+(i%3)*24+(i//3)*12,y-(i//3)*18,'#e8e0c8','#6a6a4a') for i in range(5))
def twotickets(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="28" height="20" rx="1.5" fill="#fff"/></g><rect x="{x}" y="{y}" width="28" height="5" fill="#2e7a5a"/><text x="{x+14}" y="{y+14}" font-size="4.6" text-anchor="middle" fill="#2e7a5a" font-weight="900" font-family="sans-serif">ใบรับของ</text>'
    f'<g filter="{SH}"><rect x="{x+32}" y="{y+2}" width="28" height="20" rx="1.5" fill="#fff"/></g><rect x="{x+32}" y="{y+2}" width="28" height="5" fill="#c8803a"/><text x="{x+46}" y="{y+16}" font-size="4.6" text-anchor="middle" fill="#c8803a" font-weight="900" font-family="sans-serif">ประทวน</text>')
def bill(x,y,acc=False,rot=-4):
  s=(f'<g transform="rotate({rot} {x+24} {y+14})"><g filter="{SH}"><rect x="{x}" y="{y}" width="48" height="28" rx="1.5" fill="#f4ecd4"/></g><rect x="{x+2}" y="{y+2}" width="44" height="24" fill="none" stroke="#a88a4a" stroke-width=".8"/>'
    f'<text x="{x+24}" y="{y+10}" font-size="5" text-anchor="middle" fill="#6a4a1a" font-weight="900" font-family="sans-serif">ตั๋วแลกเงิน</text><rect x="{x+8}" y="{y+14}" width="32" height="1.4" fill="#c8b890"/><text x="{x+36}" y="{y+23}" font-size="5" text-anchor="middle" fill="#6a4a1a" font-weight="900" font-family="sans-serif">฿</text>')
  if acc: s+=f'<text x="{x+16}" y="{y+23}" font-size="4.6" text-anchor="middle" fill="#2e7a5a" font-weight="900" font-family="sans-serif">รับรองแล้ว</text><path d="M{x+6} {y+25}q4-3 8 0t8-1" stroke="#3a6ab0" fill="none"/>'
  return s+'</g>'
def billback(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="48" height="28" rx="1.5" fill="#f4ecd4"/></g>'
    + ''.join(f'<path d="M{x+4} {y+6+i*7}q6-4 10 0t10-1" stroke="#3a6ab0" fill="none"/><rect x="{x+28}" y="{y+5+i*7}" width="16" height="1.4" fill="#c8b890"/>' for i in range(3))
    + f'<g transform="rotate(-12 {x+24} {y+14})"><rect x="{x+10}" y="{y+8}" width="28" height="11" rx="1" fill="none" stroke="#c0392b" stroke-width="1.6"/><text x="{x+24}" y="{y+16}" font-size="5.4" text-anchor="middle" fill="#c0392b" font-weight="900" font-family="sans-serif">ไม่จ่าย</text></g>')

# ---------- เพิ่มจากเรื่อง 187–191 ----------
def queue2(x,y):
  return (f'<g filter="{SH}"><rect x="{x}" y="{y}" width="30" height="20" rx="2" fill="#3a6ab0"/><rect x="{x+36}" y="{y+4}" width="30" height="20" rx="2" fill="#e8833a"/></g>'
    f'<text x="{x+15}" y="{y+13}" font-size="6.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">1 ธนาคาร</text><text x="{x+51}" y="{y+17}" font-size="6.4" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">2 ร้าน</text>')
def tables(x,y=146):
  return ''.join(f'<g filter="{SH}"><rect x="{x+i*22}" y="{y-28-(i%2)*4}" width="20" height="4" fill="#a87a4a"/></g><path d="M{x+i*22+2} {y-24-(i%2)*4}v{24+(i%2)*4}M{x+i*22+18} {y-24-(i%2)*4}v{24+(i%2)*4}" stroke="#8a5a3a" stroke-width="2"/>' for i in range(4))
