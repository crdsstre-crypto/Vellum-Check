import sys
def mkc(n,name,cols,hero,acc):
  s=open('/home/claude/work/c206gen.py').read()
  a=s.index('hero=');b=s.index("open('/home/claude/work/c206")
  s=s[:a]+'hero='+repr(hero)+'\nacc='+repr(acc)+'\n'+s[b:]
  s=s.replace("'cardtimerfile'",repr(name)).replace("ns['AC']['cardtimerfile']","ns['AC']["+repr(name)+"]").replace('c206.js','c%d.js'%n)
  s=s.replace("'#eaf0fa','#c4d2ec','#f8faff','#3a5a9a'",",".join(repr(c) for c in cols))
  open('/home/claude/work/c%dgen.py'%n,'w').write(s)
