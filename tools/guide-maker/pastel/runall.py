import sys
sys.argv=['x']+[f'/tmp/pc/b{i}.py' for i in range(2,9)]
exec(open('/tmp/pc/enrich.py').read())
src=open('/tmp/pastel/gen.py').read().split("if __name__")[0]
exec(src)
for s,d in D.items(): print(s, build(s,d)[0])
