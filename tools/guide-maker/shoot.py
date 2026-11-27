import sys
from playwright.sync_api import sync_playwright
from PIL import Image
slug=sys.argv[1]; port=sys.argv[2] if len(sys.argv)>2 else '3410'
U=f'http://localhost:{port}/guide/{slug}'
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto(U); pg.wait_for_timeout(2200)
    shots=[pg.locator('.gd-cover').first.screenshot()]+[x.screenshot() for x in pg.locator('.gd-cm').all()]
    ims=[Image.open(__import__('io').BytesIO(s)) for s in shots]
    W=max(i.width for i in ims); H=sum(i.height+10 for i in ims)
    o=Image.new('RGB',(W,H),'white'); y=0
    for i in ims: o.paste(i,(0,y)); y+=i.height+10
    o.save(f'/tmp/sh_{slug}_m.png')
    pg2=b.new_page(viewport={'width':1440,'height':900}); pg2.on('pageerror',lambda e: errs.append(str(e)))
    pg2.goto(U); pg2.wait_for_timeout(2200)
    shots=[x.screenshot() for x in pg2.locator('.gd-cm').all()]
    ims=[Image.open(__import__('io').BytesIO(s)) for s in shots]
    W=max(i.width for i in ims); H=sum(i.height+8 for i in ims)
    o=Image.new('RGB',(W,H),'white'); y=0
    for i in ims: o.paste(i,(0,y)); y+=i.height+8
    o.save(f'/tmp/sh_{slug}_d.png')
    print('panels',len(shots),'errors',errs); b.close()
