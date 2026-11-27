import re,sys,json,os
P='/home/claude/vellum-check/public/'
def build(slug,d):
    cj=open(P+f'guide-cards/{slug}.card.js').read()
    fn=re.search(r'^([a-z0-9]+): function',cj,re.M).group(1)
    css=open(P+f'guide-covers/{slug}.cover.css').read()
    lay=re.search(r'data-layout="([a-z0-9]+)"',css).group(1)
    p=fn[:6]  # id prefix
    k="' + k + '"
    def I(s): return s.replace('@',k)
    sh=d['sh']
    defs=(f'<defs><linearGradient id="{p}g@" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{d["c1"]}"/><stop offset="1" stop-color="{d["c2"]}"/></linearGradient>'
      f'<linearGradient id="{p}w@" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="{d.get("tint","#e2e8f0")}"/></linearGradient>'
      f'<filter id="{p}f@" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="1" dy="3" stdDeviation="2.4" flood-color="{sh}" flood-opacity=".22"/></filter>{d.get("defs","")}</defs>')
    hero=d['hero'].replace('#W',f'url(#{p}w@)').replace('#F',f'url(#{p}f@)')
    t1,t2=d['tag'] or (None,None); tc=d['tagc']
    tag=(f'<g transform="translate({96 if d.get("ty",118)>=100 else d.get("tx",114)} {26 if d.get("ty",118)>=100 else d.get("ty")}) rotate({-4 if d.get("ty",118)>=100 else d.get("tr",10)})"><g filter="url(#{p}f@)"><rect x="-21" y="-11" width="42" height="22" rx="4" fill="#fff" stroke="{tc}" stroke-width="2"/></g>'
      f'<text y="-1" text-anchor="middle" font-size="6.2" font-weight="900" fill="{tc}" font-family="sans-serif">{t1}</text><text y="7" text-anchor="middle" font-size="5" font-weight="800" fill="#64748b" font-family="sans-serif">{t2}</text></g>') if t1 else ''
    body=(defs+f'<rect width="136" height="160" fill="url(#{p}g@)"/><g transform="translate(-22 0)"><circle cx="118" cy="26" r="30" fill="#fff" opacity=".4"/><path d="M0 132q36-10 70-4t66-6V160H0z" fill="#fff" opacity=".3"/>'
      '<g class="sc-twinkle" fill="#fff"><path d="M54 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M140 70l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/></g>'
      f'<ellipse cx="96" cy="124" rx="34" ry="6" fill="{sh}" opacity=".12"/>'
      f'<g class="sc-bob"><g filter="url(#{p}f@)" transform="rotate({d.get("rot",-6)} 96 86)">{hero}</g></g>{tag}</g>')
    body=I(body)
    js=f"// ภาพการ์ดของคู่มือ {slug} (สไตล์พาสเทล)\nVCCards({{\n{fn}: function (k) {{ return '{body}'; }}\n}});\n"
    open(P+f'guide-cards/{slug}.card.js','w').write(js)
    b=d['badge']; pos=d.get('bpos','right')
    if len(b)<=2: bc=f'content: "{b}"; {pos}: -8px; bottom: 10px; width: 24px; height: 24px; border-radius: 50%; font: 900 13px/24px sans-serif; text-align: center;'
    else: bc=f'content: "{b}"; {pos}: -8px; bottom: 10px; padding: 2px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 800; transform: rotate(-4deg);'
    out=(f'/* ปกแบบ "{lay}" = กรอบพาสเทลบาง ๆ สีเดียวกับภาพ + ป้ายเล็กมุมล่าง (คู่มือ {slug}) */\n'
      f'.gd-cover[data-layout="{lay}"] .gd-cover-art {{ overflow: visible; border: 5px solid {d["bd"]}; border-radius: 10px; box-shadow: 0 0 0 2px {d["ln"]} inset, 0 6px 14px rgba(30,41,59,.16); }}\n'
      f'.gd-cover[data-layout="{lay}"] .gd-cover-art .gd-scene {{ border-radius: 6px; }}\n'
      f'.gd-cover[data-layout="{lay}"] .gd-cover-art::before {{ content: none; }}\n'
      f'.gd-cover[data-layout="{lay}"] .gd-cover-art::after {{ {bc} position: absolute; z-index: 4; background: {d["bg"]}; color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,.15); pointer-events: none; }}\n')
    open(P+f'guide-covers/{slug}.cover.css','w').write(out)
    return fn,lay
if __name__=='__main__':
    D={}
    exec(open(sys.argv[1]).read())
    for s,d in D.items(): print(s,build(s,d))
