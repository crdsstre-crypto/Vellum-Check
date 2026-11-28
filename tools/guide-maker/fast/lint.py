"""ตรวจคู่มือก่อนส่ง (ไม่กินเครดิตถ่ายภาพ): python3 -I lint.py <slug>  (รันที่ราก repo)"""
import json,sys,re,glob
s=sys.argv[1]; g=json.load(open(f'server/library/guides/{s}.json')); E=[]
W=lambda t:sum(1 for ch in t if not ('\u0e31'==ch or '\u0e34'<=ch<='\u0e3a' or '\u0e47'<=ch<='\u0e4e'))
for i,l in enumerate(g['coverLines']):
  if W(l)>17: E.append(f'coverLines[{i}] กว้าง {W(l)} > 17')
arms=[g['mood'].split('+')[0]]+[x['panel']['mood'].split('+')[0] for x in g['sections']]
if len(set(arms))<len(arms): E.append(f'แขนซ้ำในเรื่อง {arms}')
for x in g['sections']:
  m=x['panel']['mood'].split('+')
  if len(m)!=4: E.append(f'mood ไม่ครบ 4 ส่วน {m}')
  say=re.sub(r'\*\*','',x['panel']['say']); w=sum(1 for ch in say if not ('\u0e31'==ch or '\u0e34'<=ch<='\u0e3a' or '\u0e47'<=ch<='\u0e4e'))
  if w>26: E.append(f'say ยาว {len(say)}: {say}')
  if not 1<=len(x['items'])<=3: E.append('items ต่อ section ต้อง 1–3')
  for it in x['items']:
    if '**' not in it['a']: E.append('คำตอบไม่มีไฮไลต์: '+it['q'][:20])
for k,n in (('summary',5),('redFlags',4)):
  if len(g[k])!=n: E.append(f'{k} ต้อง {n} ข้อ')
LIMIT_T=95
if len(g['title'])>LIMIT_T: E.append(f'หัวข้อยาว {len(g["title"])} > {LIMIT_T} (หน้ารายการบนมือถืออ่านไม่จบ)')
titles={json.load(open(f))['title'] for f in glob.glob('server/library/guides/*.json')}
for q in re.findall(r'"([^"]{25,})"',' '.join(it['a'] for x in g['sections'] for it in x['items'])):
  if q.endswith('?') and not any(q in T for T in titles) and q!=g['title']: E.append('อ้างชื่อคู่มือไม่ตรง: '+q[:40])
seed=open('server/library/seed/krisdika-core-2021.json').read()
th=str.maketrans('0123456789','๐๑๒๓๔๕๖๗๘๙')
for x in g['sections']:
  for it in x['items']:
    for c in it['cite']:
      if 'sec' in c and not re.search(r'มาตรา(?:\\n|\s)+'+re.escape(c['sec'].translate(th))+r'(?![๐-๙/])',seed): E.append('ไม่พบมาตรา '+c['sec'])
for f in ('guide-panels/%s.panels.js','guide-cards/%s.card.js','guide-covers/%s.cover.css'):
  try: open('public/'+f%s)
  except: E.append('ขาดไฟล์ '+f%s)
print('LINT OK' if not E else '\n'.join('✗ '+e for e in E))
