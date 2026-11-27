import re,sys
for f in sys.argv[1:]:
    s=open(f).read(); n=0
    while True:
        m=None
        for mm in re.finditer(r'<g ([^>]*)>',s):
            a=mm.group(1)
            if re.search(r'class="(cm|sc)-',a) and 'transform=' in a: m=mm;break
        if not m: break
        a=m.group(1); cl=re.search(r'class="[^"]*"',a).group(0); rest=a.replace(cl,'').strip()
        new='<g '+cl+'><g '+rest+'>'
        # find matching close
        i=m.end(); d=1
        while d:
            o=s.find('<g',i); c=s.find('</g>',i)
            if o!=-1 and o<c and s[o+2] in ' >': d+=1; i=o+2
            else: d-=1; i=c+4
        s=s[:m.start()]+new+s[m.end():i]+'</g>'+s[i:]; n+=1
    open(f,'w').write(s); print(f,n)
