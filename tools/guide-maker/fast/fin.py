import sys,re
n,slug,order,cover,prefix=sys.argv[1:6]
p='/home/claude/tools/HANDOFF.md';s=open(p).read()
s=re.sub(r'\(ตอนนี้ตั้งเป็น [a-z0-9-]+\)','(ตอนนี้ตั้งเป็น %s)'%slug,s)
m=list(re.finditer(r'order (\d+) = [a-z0-9-]+ \(apply (\d+)\)',s))[-1]
s=s[:m.end()]+', order %s = %s (apply %s)'%(order,slug,n)+s[m.end():]
s=re.sub(r'( · prefix ใช้แล้ว: [^\n]*)',lambda x:x.group(1)+' '+prefix,s,count=1)
s=s.replace(' · prefix ใช้แล้ว:',' '+cover+' · prefix ใช้แล้ว:',1)
open(p,'w').write(s); print('fin ok')
