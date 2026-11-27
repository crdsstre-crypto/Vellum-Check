# ระบบไฟล์แยกรายเรื่อง: apply2.py N slug  → เขียน public/guide-panels/<slug>.panels.js · public/guide-cards/<slug>.card.js · public/guide-covers/<slug>.cover.css
# อ่าน /home/claude/work/sN.js (ฉาก มี /*M*/) · cN.js (การ์ด) · cssN.css (ปก) · ไม่แตะ guide-comic.js / guide-scenes.js / guide.css / guide-api.js / guide.html
import sys,os,re,glob
os.chdir('/home/claude/src/Vellum-Check-main')
N,slug=sys.argv[1:3]
H=os.environ.get('HANDOFF') or max(glob.glob('/mnt/user-data/uploads/*handoff*.md'),key=os.path.getmtime)
m=open(H).read().split('## ภาคผนวก')[-1].split('```js\n')[1].split('```')[0].rstrip('\n')
body=lambda t:t.strip().rstrip(',')
pan=open(f'/home/claude/work/s{N}.js').read().replace('/*M*/',m)
card=open(f'/home/claude/work/c{N}.js').read(); css=open(f'/home/claude/work/css{N}.css').read()
names=re.findall(r'^\s*([a-z0-9]+)\s*:\s*function',pan,re.M)+re.findall(r'^\s*([a-z0-9]+)\s*:\s*function',card,re.M)+re.findall(r'data-layout="([a-z0-9]+)"',css)
allt=''.join(open(f).read() for f in ['public/guide-comic.js','public/guide-scenes.js','public/guide.css','server/library/guide-api.js']+glob.glob('public/guide-panels/*')+glob.glob('public/guide-cards/*')+glob.glob('public/guide-covers/*'))
dup=[n for n in set(names) if re.search(r'\b'+n+r'\b',allt)]
assert not dup,'ชื่อซ้ำ: %s'%dup
for d in ['guide-panels','guide-cards','guide-covers']: os.makedirs('public/'+d,exist_ok=True)
open(f'public/guide-panels/{slug}.panels.js','w').write('// ภาพช่องการ์ตูนของคู่มือ '+slug+'\nVCPanels({\n'+body(pan)+'\n});\n')
open(f'public/guide-cards/{slug}.card.js','w').write('// ภาพการ์ดของคู่มือ '+slug+'\nVCCards({\n'+body(card)+'\n});\n')
open(f'public/guide-covers/{slug}.cover.css','w').write(css.strip()+'\n')
print('OK',names)
