import sys,io
from playwright.sync_api import sync_playwright
from PIL import Image
slugs=sys.argv[2:]; out=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    ims=[]
    for s in slugs:
        pg.goto(f'http://localhost:3410/guide/{s}'); pg.wait_for_timeout(1500)
        ims.append(Image.open(io.BytesIO(pg.locator('.gd-cover').first.screenshot())))
    W=max(i.width for i in ims); o=Image.new('RGB',(W*3,((len(ims)+2)//3)*(max(i.height for i in ims)+6)),'white')
    for n,i in enumerate(ims): o.paste(i,((n%3)*W,(n//3)*(i.height+6)))
    o.save(out); b.close()
