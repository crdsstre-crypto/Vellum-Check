import re,sys
D={}
for f in ['b10','b11','b12','b13','b14','b15','b16','b17']: exec(open(f'/tmp/pc/{f}.py').read())
exec(open('/tmp/pc/enrich.py').read().split("D={}")[0])  # back(), gloss
def big(m):
  fs=float(m.group(1))
  return m.group(0) if fs>=6.5 else 'DROP'
for s,d in D.items():
  h=d['hero']
  # ตัวหนังสือเล็กกว่า 6.5 อ่านไม่ออกบนมือถือ → เอาออก, ที่เหลือขยายขึ้นเล็กน้อย
  h=re.sub(r'<text[^>]*font-size="([\d.]+)"[^>]*>[^<]*</text>',lambda m: '' if float(m.group(1))<6.5 else m.group(0).replace(f'font-size="{m.group(1)}"',f'font-size="{min(float(m.group(1))*1.15,14):.1f}"'),h)
  halo=f'<circle cx="90" cy="84" r="44" fill="#fff" opacity=".55"/><circle cx="90" cy="84" r="44" fill="none" stroke="{d["ln"]}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".7"/>'
  d['hero']=halo+'<g transform="translate(90 86) scale(0.96) translate(-92 -86)">'+back(d['ln'])+h+gloss+'</g>'
  d['tag']=None
src=open('/tmp/pastel/gen.py').read().split("if __name__")[0]
exec(src)
for s,d in D.items(): build(s,d)
print(len(D))
