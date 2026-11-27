import sys,asyncio
from playwright.async_api import async_playwright
from PIL import Image
OUT='/home/claude/work/'
async def run():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    errs=[]
    for name,vp,sc in [('m',{'width':390,'height':844},2),('d',{'width':1440,'height':900},1)]:
      pg=await b.new_page(viewport=vp,device_scale_factor=sc); pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:3401/guide'); await pg.wait_for_timeout(1200)
      card=pg.locator('a[href*="shipping-note-bill-of-lading"]').first
      await card.screenshot(path=OUT+name+'_card.png')
      await pg.goto('http://localhost:3401/guide/shipping-note-bill-of-lading'); await pg.wait_for_timeout(1500)
      await pg.locator('.gd-cover').first.screenshot(path=OUT+name+'_cover.png')
      cms=pg.locator('.gd-cm'); n=await cms.count()
      for i in range(n):
        await cms.nth(i).scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
        await cms.nth(i).screenshot(path=OUT+f'{name}_cm{i}.png')
      await pg.close()
    await b.close(); print('errors',errs)
asyncio.run(run())
import glob
for name in 'md':
  fs=[OUT+name+'_cover.png',OUT+name+'_card.png']+sorted(glob.glob(OUT+name+'_cm*.png'))
  ims=[Image.open(f) for f in fs]; W=max(i.width for i in ims); H=sum(i.height for i in ims)+10*len(ims)
  c=Image.new('RGB',(W,H),'white'); y=0
  for i in ims: c.paste(i,(0,y)); y+=i.height+10
  if name=='m': c=c.resize((c.width//2,c.height//2))
  c.save(OUT+name+'_all.png'); print(name,c.size)
