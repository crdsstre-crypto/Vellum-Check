import sys,re
pr=open('/tmp/art/pr.js').read().strip()
for name,slug in [a.split(':') for a in sys.argv[1:]]:
    s=open(f'/tmp/art/{name}.js').read().replace('@@PR@@',pr+open('/tmp/art/fl.js').read().strip())
    open(f'/home/claude/vellum-check/public/guide-panels/{slug}.panels.js','w').write(s)
print('built')
