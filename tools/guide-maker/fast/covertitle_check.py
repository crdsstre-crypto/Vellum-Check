import sys
from playwright.sync_api import sync_playwright
slugs=(sys.argv[2:] or open('/tmp/s40.txt').read().split()); W=int(sys.argv[1]) if len(sys.argv)>1 else 360
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':W,'height':800})
    bad=[]
    for s in slugs:
        pg.goto(f'http://localhost:3410/guide/{s}'); pg.wait_for_timeout(500)
        r=pg.evaluate("""()=>{const c=document.querySelector('.gd-cover');const cr=c.getBoundingClientRect().right;const t=[...c.querySelectorAll('*')].filter(e=>!e.closest('svg')&&e.children.length==0&&e.textContent.trim());return t.slice(1).map(e=>{const rg=document.createRange();rg.selectNodeContents(e);return [e.textContent.trim(),Math.round(rg.getBoundingClientRect().right-cr)]})}""")
        o=[x for x in r if x[1]>-10]
        if s in ("guesthouse-guest-unpaid","shop-relocation-staff"): print(s,r)
        o=[x for x in r if x[1]>-12]
        if o: bad.append((s,o))
    for x in bad: print(x)
    print(len(bad),'bad of',len(slugs)); b.close()
