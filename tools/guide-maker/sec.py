import sys,re
f,secs=sys.argv[1],sys.argv[2:]
t=open(f).read()
th=str.maketrans('0123456789','๐๑๒๓๔๕๖๗๘๙')
for s in secs:
    m=re.search(r'\nมาตรา '+re.escape(s.translate(th))+r'(?:\[[0-9๐-๙]+\])?(?:\s|$)(.{0,700})',t)
    print('##',s, (m.group(1).replace('\n',' ')[:600] if m else 'NOT FOUND'))
