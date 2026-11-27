import json,sys,re,os
d=json.load(open(sys.argv[1])); key=sys.argv[2]
th=str.maketrans('0123456789/','๐๑๒๓๔๕๖๗๘๙/')
L=[l for l in d['laws'] if key in l['title']][0]; t=L['text']; print('LAW',L['title'])
n=int(os.environ.get('L','450'))
for s in sys.argv[3:]:
  m=[x for x in re.finditer(r'\nมาตรา?\s+'+re.escape(s.translate(th))+r'(?:\s|\[)',t)]
  if not m: print('--',s,'NOT FOUND'); continue
  i=m[-1 if os.environ.get('LAST') else 0].start(); print('--',s,re.sub(r'\s+',' ',t[i:i+n]))
