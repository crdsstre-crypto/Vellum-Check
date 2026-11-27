from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('http://localhost:3410/guide'); pg.wait_for_timeout(1500)
    pg.locator('.gd-chips button',has_text='ค้าขาย').first.click(); pg.wait_for_timeout(1200)
    for i in range(14):
        m=pg.locator('.gd-more')
        if m.count()==0: break
        m.first.click(); pg.wait_for_timeout(900)
    from PIL import Image; import io
    ims=[]
    for s in ['distributor-terminated','salon-service-injury','customer-food-allergy','shop-noise-neighbor']:
        c=pg.locator(f'a.gd-lc[href="/guide/{s}"]'); c.scroll_into_view_if_needed(); pg.wait_for_timeout(600); ims.append(Image.open(io.BytesIO(c.screenshot())))
    W=max(i.width for i in ims); H=sum(i.height+8 for i in ims); o=Image.new('RGB',(W,H),'white'); y=0
    for i in ims: o.paste(i,(0,y)); y+=i.height+8
    o=o.resize((W//2,H//2)); o.save('/tmp/list5.png'); print('errors',errs); b.close()
