# ตรวจว่าข้อความ/สติกเกอร์บนการ์ดหน้ารายการทับน้องม้วนไหม: python3 mascot_overlap_check.py ค้าขาย (ต้องรันเซิร์ฟเวอร์ /tmp/mini2.mjs ที่พอร์ต 3410) — กล่อง RECT ใหญ่กว่า 70x30 คือพื้นหลัง ไม่นับ
import json,sys
from playwright.sync_api import sync_playwright
cat=sys.argv[1] if len(sys.argv)>1 else 'ค้าขาย'
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844})
    pg.goto('http://localhost:3410/guide'); pg.wait_for_timeout(1500)
    pg.locator('.gd-chips button',has_text=cat).first.click(); pg.wait_for_timeout(1200)
    for i in range(80):
        m=pg.locator('.gd-more')
        if m.count()==0: break
        m.first.click(); pg.wait_for_timeout(500)
    res=pg.evaluate('''async()=>{const out=[];const cards=[...document.querySelectorAll('a.gd-lc')];
     for(const c of cards){c.scrollIntoView();await new Promise(r=>setTimeout(r,60));
      const mz=c.querySelector('.gd-lc-mz svg')||c.querySelector('.gd-lc-mz'); const fr=c.querySelector('.gd-lc-frame'); if(!mz||!fr)continue;
      const M=mz.getBoundingClientRect(); const F=c.querySelector('.gd-lc-img').getBoundingClientRect();
      const bad=[];
      for(const t of fr.querySelectorAll('svg text, svg rect[rx]')){ if(t.closest('.gd-lc-mz'))continue; const r=t.getBoundingClientRect(); if(!r.width)continue;
        const ix=Math.min(r.right,M.right-6)-Math.max(r.left,M.left+6), iy=Math.min(r.bottom,M.bottom)-Math.max(r.top,M.top+4);
        const vis=r.right>F.left&&r.left<F.right&&r.bottom>F.top&&r.top<F.bottom;
        if(ix>1&&iy>1&&vis) bad.push(t.tagName=='text'?t.textContent.trim():'RECT'+Math.round(r.width)+'x'+Math.round(r.height));}
      if(bad.length) out.push([c.getAttribute('href').split('/').pop(),bad]);}
     return out;}''')
    print(json.dumps(res,ensure_ascii=False)); b.close()
