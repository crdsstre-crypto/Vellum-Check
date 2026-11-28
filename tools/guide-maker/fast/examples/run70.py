import re,sys
D={}
for f in ["b70"]: exec(open(f'/tmp/pc/{f}.py').read())
exec(open('/tmp/pc/enrich.py').read().split("D={}")[0])  # back(), gloss
def big(m):
  fs=float(m.group(1))
  return m.group(0) if fs>=6.5 else 'DROP'
for s,d in D.items():
  h=d['hero']
  # ตัวหนังสือเล็กกว่า 6.5 อ่านไม่ออกบนมือถือ → เอาออก, ที่เหลือขยายขึ้นเล็กน้อย
  h=re.sub(r'<text[^>]*font-size="([\d.]+)"[^>]*>[^<]*</text>',lambda m: '' if float(m.group(1))<6.5 else m.group(0).replace(f'font-size="{m.group(1)}"',f'font-size="{min(float(m.group(1))*1.15,14):.1f}"'),h)
  halo=f'<circle cx="92" cy="86" r="50" fill="#fff" opacity=".55"/><circle cx="92" cy="86" r="50" fill="none" stroke="{d["ln"]}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".7"/>'
  d['hero']='<g transform="translate(89 72) scale(0.62) translate(-92 -86)">'+halo+back(d['ln'])+h+gloss+'</g>'
  d['tag']=None; d.setdefault('tagc',d['bg'])
src=open('/tmp/pastel/gen.py').read().split("if __name__")[0]
exec(src)
for s,d in D.items(): build(s,d)
print(len(D))
