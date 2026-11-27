import sys,re
# ใส่ชั้นกระดาษซ้อนด้านหลัง + ไฮไลต์ ให้ภาพหลักทุกเรื่องมีมิติแบบชุด 147–151
def back(ln):
  return (f'<rect x="64" y="52" width="56" height="66" rx="6" fill="{ln}" opacity=".22" transform="rotate(8 92 85)"/>'
          f'<rect x="62" y="50" width="56" height="66" rx="6" fill="#fff" opacity=".75" transform="rotate(4 90 83)"/>')
gloss='<path d="M58 44q20-10 44-6" stroke="#fff" stroke-width="2.4" opacity=".55" fill="none" stroke-linecap="round"/><circle cx="126" cy="44" r="2.2" fill="#fff" opacity=".8"/>'
D={}
for f in sys.argv[1:]: exec(open(f).read())
for s,d in D.items(): d['hero']=back(d['ln'])+d['hero']+gloss
