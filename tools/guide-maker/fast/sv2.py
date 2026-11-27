import sys,re
t=open('/home/claude/vellum-check/tools/guide-maker/laws/ประมวลกฎหมายแพ่งและพาณิชย์-กฤษฎีกา-v2.txt').read()
th=str.maketrans('0123456789','๐๑๒๓๔๕๖๗๘๙'); W=int(sys.argv[1])
for s in sys.argv[2:]:
  m=list(re.finditer(r'มาตรา '+s.translate(th)+r'(\[\d+\])? ',t))
  if not m: print('##',s,'-'); continue
  i=m[0].start(); j=re.search(r'\nมาตรา [๐-๙]',t[i+5:]); seg=t[i:i+5+(j.start() if j else 2000)]
  print('##',s,re.sub(r'\s+',' ',seg)[:W])
