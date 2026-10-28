/* art.js: รวมจาก art-motion, art-cursor, art-scene, art-field (ตามลำดับ) แต่ละส่วนเป็นฟังก์ชันแยกของตัวเอง */

/* ===== (จาก art-motion.js) ===== */
/* =========================================================
   art/motion.js: โครงระบบการเคลื่อนไหวของ Vellum (ไม่พึ่งไลบรารี ไม่ยึดการเลื่อนของเบราว์เซอร์)
   - VCMotion.reduced        true เมื่อผู้ใช้ตั้ง prefers-reduced-motion
   - html[data-motion]       "reduced" | "full" (อัปเดตเมื่อผู้ใช้เปลี่ยนการตั้งค่า)
   - html.vc-motion          เติมเมื่อเล่นอนิเมชันได้ (มี IntersectionObserver และไม่ลดการเคลื่อนไหว)
                             CSS จะซ่อน [data-reveal] เฉพาะเมื่อมี class นี้ จึงไม่มีเนื้อหาหายถ้า JS ล้ม
   - [data-reveal]           เมื่อเข้าจอ เติม .is-in  (ตัวเลือก: style="--i:2" เพื่อหน่วงตามลำดับ)
   - [data-split="lines"]    ห่อข้อความเป็นบรรทัด/คำ เพื่อเปิดทีละบรรทัด (ตัดคำไทยด้วย Intl.Segmenter)
   - [data-scene]            เขียนค่า --p (0..1) ตามความคืบหน้าการเลื่อนผ่านองค์ประกอบ (ใช้ rAF เฉพาะตอนอยู่ในจอ)
                             เพิ่ม data-pin = ฉากตรึงจอ (องค์ประกอบสูงกว่าจอ แล้วเนื้อหา position:sticky)
                             data-scene="exit" = 0 เมื่ออยู่บนสุด → 1 เมื่อเลื่อนพ้นไป (ใช้ทำพาราแลกซ์ตอนออก)
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var hasIO = 'IntersectionObserver' in window;

  var api = { reduced: !!(mq && mq.matches) };
  window.VCMotion = api;

  function applyMode() {
    api.reduced = !!(mq && mq.matches);
    root.setAttribute('data-motion', api.reduced ? 'reduced' : 'full');
    root.classList.toggle('vc-motion', !api.reduced && hasIO);
    if (api.reduced) revealAll();
  }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', applyMode);
    else if (mq.addListener) mq.addListener(applyMode);
  }

  /* ---- แยกข้อความเป็นคำ/บรรทัด (ภาษาไทยไม่มีช่องว่างคั่นคำ ใช้ Intl.Segmenter กันสระและวรรณยุกต์แตก) ---- */
  function segmentWords(text) {
    if (window.Intl && Intl.Segmenter) {
      var seg = new Intl.Segmenter('th', { granularity: 'word' });
      return Array.from(seg.segment(text), function (s) { return s.segment; });
    }
    return text.split(/(\s+)/);
  }
  api.split = function (el) {
    if (!el || el.getAttribute('data-split-done')) return;
    var text = el.textContent;
    var parts = segmentWords(text), html = '', i = 0;
    /* ข้อความจริงสำหรับโปรแกรมอ่านหน้าจอ (ซ่อนด้วยสายตา) ส่วนคำที่แยกแล้วเป็น aria-hidden */
    html += '<span class="vc-sr" style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">' + text.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span>';
    parts.forEach(function (w) {
      if (/^\s+$/.test(w)) { html += w; return; }
      html += '<span class="vc-word" aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:top"><span style="display:inline-block;transition:transform var(--dur-4) var(--ease-out);transition-delay:calc(' + (i++) + ' * 28ms)">' + w.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span></span>';
    });
    el.innerHTML = html;
    el.setAttribute('data-split-done', '1');
    if (root.classList.contains('vc-motion')) {
      el.querySelectorAll('.vc-word > span').forEach(function (s) { s.style.transform = 'translate3d(0,110%,0)'; });
    }
  };
  function playSplit(el) {
    el.querySelectorAll('.vc-word > span').forEach(function (s) { s.style.transform = 'none'; });
  }

  /* ---- เปิดเผยตอนเลื่อน ---- */
  var io = null;
  function enter(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-split')) playSplit(el);
    if (io) io.unobserve(el);
  }
  function revealAll() {
    document.querySelectorAll('[data-reveal]:not(.is-in),[data-split]:not(.is-in)').forEach(function (el) {
      el.classList.add('is-in');
      if (el.hasAttribute('data-split')) playSplit(el);
    });
  }
  api.observe = function (scope) {
    var els = (scope || document).querySelectorAll('[data-reveal],[data-split]');
    els.forEach(function (el) {
      if (el.hasAttribute('data-split')) api.split(el);
      if (el.classList.contains('is-in')) return;
      if (!root.classList.contains('vc-motion') || !io) { enter(el); return; }
      io.observe(el);
    });
  };

  /* ---- ความคืบหน้าการเลื่อนของฉาก ---- */
  var scenes = [], ticking = false;
  function updateScenes() {
    ticking = false;
    var vh = window.innerHeight || 1;
    scenes.forEach(function (s) {
      if (!s.on) return;
      var r = s.el.getBoundingClientRect();
      var p = s.pin ? -r.top / Math.max(1, r.height - vh)
            : s.exit ? -r.top / Math.max(1, r.height)
            : (vh - r.top) / (r.height + vh);
      p = Math.min(1, Math.max(0, p));
      s.el.style.setProperty('--p', p.toFixed(4));
    });
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(updateScenes); } }
  api.scene = function (el, opts) {
    var s = { el: el, on: false, pin: !!(opts && opts.pin), exit: !!(opts && opts.exit) };
    scenes.push(s);
    if (api.reduced || !hasIO) { el.style.setProperty('--p', s.exit ? '0' : '1'); return s; }
    new IntersectionObserver(function (es) { s.on = es[0].isIntersecting; if (s.on) requestTick(); }, { rootMargin: '10% 0px' }).observe(el);
    return s;
  };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  function init() {
    applyMode();
    if (hasIO) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) enter(e.target); });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    api.observe(document);
    document.querySelectorAll('[data-scene]').forEach(function (el) { api.scene(el, { pin: el.hasAttribute('data-pin'), exit: el.getAttribute('data-scene') === 'exit' }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ===== (จาก art-cursor.js) ===== */
/* =========================================================
   art/cursor.js: การโต้ตอบด้วยเมาส์ของ Vellum (เฉพาะอุปกรณ์ที่มีเมาส์จริง: hover + pointer:fine)
   - วงแหวนกลวงตามหลังลูกศร (ลูกศรเดิมยังอยู่ ไม่ซ่อน) ขยายเมื่อชี้ลิงก์/ปุ่ม และหายไปเมื่ออยู่บนช่องพิมพ์
   - [data-tilt]  เอียงเล็กน้อยตามตำแหน่งเมาส์ (เฉพาะตอนเมาส์อยู่บนองค์ประกอบนั้น)
   - window.VCPointer {x,y}  ตำแหน่งเมาส์ปรับให้นิ่ง (-0.5..0.5) สำหรับพาราแลกซ์ (field.js และ CSS --mx/--my บน .hero)
   - ลิงก์เมนูที่ตรงกับส่วนที่กำลังดูอยู่ได้ class .is-here
   ปิดทั้งหมดเมื่อผู้ใช้ลดการเคลื่อนไหว  ไม่ทำงานบนจอสัมผัส
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;
  var pointer = { x: 0, y: 0 };
  window.VCPointer = pointer;

  /* ---- เมนู: ไฮไลต์ลิงก์ของส่วนที่กำลังดู (ทำงานทุกอุปกรณ์) ---- */
  function navHere() {
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.dx-nav a[href^="#"]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var order = ['manifesto', 'introVideo', 'authCard', 'checkCard'];
    var targets = order.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bv = 0;
      order.forEach(function (id) { if ((vis[id] || 0) > bv) { bv = vis[id]; best = id; } });
      links.forEach(function (a) { a.classList.remove('is-here'); a.removeAttribute('aria-current'); });
      if (best && map[best]) { map[best].classList.add('is-here'); map[best].setAttribute('aria-current', 'location'); }
    }, { threshold: [0, .15, .4, .7] });
    targets.forEach(function (t) { io.observe(t); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', navHere); else navHere();

  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  function start() {
    var ring = document.createElement('div');
    ring.className = 'vc-cursor';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<i></i>';
    document.body.appendChild(ring);
    root.classList.add('vc-cursor-on');

    var tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, seen = false;
    var tiltEl = null, tiltT = { x: 0, y: 0 }, tiltC = { x: 0, y: 0 };
    var px = 0, py = 0;               /* ตำแหน่งเมาส์ที่นิ่งแล้ว (พาราแลกซ์) */
    var LINK = 'a,button,summary,select,label[for],[role="button"],[data-cursor]';
    var TEXT = 'input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[contenteditable="true"]';

    function frame() {
      raf = 0;
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      px += (pointer.tx - px) * 0.06; py += (pointer.ty - py) * 0.06;
      pointer.x = px; pointer.y = py;
      var hero = document.querySelector('.hero');
      if (hero) { hero.style.setProperty('--mx', px.toFixed(3)); hero.style.setProperty('--my', py.toFixed(3)); }
      tiltC.x += (tiltT.x - tiltC.x) * 0.12; tiltC.y += (tiltT.y - tiltC.y) * 0.12;
      var moving = Math.abs(tx - rx) > .3 || Math.abs(ty - ry) > .3 || Math.abs(pointer.tx - px) > .001 || Math.abs(pointer.ty - py) > .001 ||
                   Math.abs(tiltT.x - tiltC.x) > .02 || Math.abs(tiltT.y - tiltC.y) > .02;
      if (tiltEl) tiltEl.style.transform = 'perspective(900px) rotateX(' + (-tiltC.y).toFixed(2) + 'deg) rotateY(' + tiltC.x.toFixed(2) + 'deg)';
      if (moving || tiltEl) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    pointer.tx = 0; pointer.ty = 0;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; rx = tx; ry = ty; ring.classList.add('is-on'); }
      pointer.tx = e.clientX / window.innerWidth - .5; pointer.ty = e.clientY / window.innerHeight - .5;
      var t = e.target && e.target.closest ? e.target : null;
      if (t) {
        var inText = !!t.closest(TEXT);
        ring.classList.toggle('is-text', inText);
        ring.classList.toggle('is-link', !inText && !!t.closest(LINK));
        var tilt = t.closest('[data-tilt]');
        if (tilt) {
          if (tilt !== tiltEl) { if (tiltEl) tiltEl.style.transform = ''; tiltEl = tilt; }
          var r = tilt.getBoundingClientRect();
          tiltT.x = ((e.clientX - r.left) / r.width - .5) * 7;
          tiltT.y = ((e.clientY - r.top) / r.height - .5) * 7;
        } else if (tiltEl) { tiltT.x = 0; tiltT.y = 0; }
      }
      kick();
    }, { passive: true });
    window.addEventListener('pointerdown', function () { ring.classList.add('is-down'); }, { passive: true });
    window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
    document.addEventListener('pointerleave', function () { ring.classList.remove('is-on'); });
    document.addEventListener('pointerenter', function () { if (seen) ring.classList.add('is-on'); });
    /* เมื่อเมาส์ออกจากองค์ประกอบเอียง ให้ค่อย ๆ กลับที่เดิมแล้วล้าง transform */
    setInterval(function () {
      if (tiltEl && tiltT.x === 0 && tiltT.y === 0 && Math.abs(tiltC.x) < .05 && Math.abs(tiltC.y) < .05) { tiltEl.style.transform = ''; tiltEl = null; }
    }, 600);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

/* ===== (จาก art-scene.js) — ฉาก 3 มิติ "แผ่นสัญญาลอยในห้องมืด" (ฉบับสัญญา 29 ต.ค. 2026) =====
   ภาพต้นฉบับของ Vellum (WebGL ล้วน ไม่ใช้ไฟล์ภาพ): แผ่นสัญญา 9 แผ่นลอยเอียงในห้องมืด แต่ละแผ่นมีบรรทัดข้อความ
   ไฮไลต์ความเสี่ยง (แดง/เหลือง/ฟ้า) แถบปกปิด เส้นลายเซ็น และตราตรวจแล้วบางแผ่น · พื้นเงาสะท้อนแผ่นสัญญา
   "แว่นขยาย" วงกลมตามเมาส์ (บนมือถือตามนิ้ว หรือเดินวนเองเมื่อไม่มีการแตะ) ขยายบรรทัดที่อยู่ใต้เลนส์
   กล้องขยับตามเมาส์และเดินเข้าห้องตามการเลื่อน · ไม่มี WebGL / ลดการเคลื่อนไหว / context หลุด = ถอยเป็นภาพนิ่งหรือฉากฝุ่น 2 มิติ */
(function () {
  'use strict';
  var root = document.documentElement;
  var NS = 12;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;uniform float uDim;uniform vec2 uLens;uniform float uLensOn;',
    'uniform vec3 uC[12];uniform vec3 uR[12];uniform vec3 uU[12];',
    'const int N=12;',
    'const vec3 L=vec3(-.35,.7,.62);',
    'float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float dseg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}',
    /* แสงไกล ๆ และท้องฟ้ามืด */
    'vec3 sky(vec3 rd){',
    '  float h=clamp(rd.y*.5+.5,0.,1.);',
    '  vec3 c=mix(vec3(.050,.052,.060),vec3(.010,.010,.013),h);',
    '  vec3 Ld=normalize(vec3(.30,.34,-1.));float g=max(dot(rd,Ld),0.);',
    '  c+=vec3(.50,.52,.56)*pow(g,5.)*.26;c+=vec3(.90,.92,.96)*pow(g,48.)*.6;',
    '  return c;',
    '}',
    /* ลวดลายบนแผ่นสัญญา: q = (u,v) ในช่วง -1..1 */
    'vec3 sheetCol(float seed,vec2 q){',
    '  vec3 col=vec3(.91,.90,.86);float u=q.x,v=q.y;float ink=0.;vec3 hl=vec3(0.);float hla=0.;',
    '  if(v>.80&&v<.90&&u>-.8&&u<.12)ink=.85;',                              /* หัวเรื่อง */
    '  float yy=(.70-v)/.068;',
    '  if(yy>0.&&yy<18.&&abs(u)<.8){',
    '    float row=floor(yy);float fy=fract(yy);float r=h21(vec2(seed,row));',
    '    if(r>.10){',
    '      float Ln=.55+.43*h21(vec2(row,seed+3.));float x=(u+.8)/1.6;',
    '      float words=step(.16,fract(x*(9.+6.*r)+r*7.));float inL=step(x,Ln);',
    '      float band=step(.28,fy)*step(fy,.66);',
    '      ink=max(ink,band*words*inL*.80);',
    '      float hv=h21(vec2(seed*1.7,row+11.));float hb=step(.10,fy)*step(fy,.84);',
    '      if(inL>.5&&x>.12){',
    '        if(hv>.935){hl=vec3(.80,.34,.32);hla=.58*hb;}',                   /* ควรตรวจละเอียด */
    '        else if(hv>.875){hl=vec3(.80,.60,.22);hla=.52*hb;}',                /* ควรระวัง */
    '        else if(hv>.835){hl=vec3(.36,.58,.74);hla=.46*hb;}',                /* ข้อสังเกต */
    '      }',
    '      if(hv<.045&&x>.25&&x<.25+.32*Ln&&band>.5)ink=1.;',                    /* แถบปกปิด */
    '    }',
    '  }',
    '  hla*=.82+.18*sin(uTime*2.1+seed*3.7+u*2.);col=mix(col,hl,hla);col=mix(col,vec3(.09,.09,.11),ink);',
    '  col=mix(col,vec3(.16),smoothstep(.006,0.,abs(v+.90))*step(abs(u+.12),.60)*.55);',   /* เส้นลายเซ็น */
    '  float sg=smoothstep(.010,0.,abs(v+.86+.045*sin(u*13.+seed*2.)))*step(.04,u)*step(u,.66);col=mix(col,vec3(.10,.10,.16),sg*.8);',
    '  if(mod(seed,4.)>2.5){',                                                  /* ตราตรวจแล้ว */
    '    vec2 c=vec2(.50,-.52);float ring=smoothstep(.014,0.,abs(length(q-c)-.20));',
    '    float tk=min(dseg(q,c+vec2(-.10,-.01),c+vec2(-.03,-.09)),dseg(q,c+vec2(-.03,-.09),c+vec2(.11,.08)));',
    '    col=mix(col,vec3(.30,.40,.46),max(ring,smoothstep(.016,0.,tk))*.85);',
    '  }',
    '  float e=min(1.-abs(u),1.-abs(v));col*=.88+.12*smoothstep(0.,.05,e);',
    '  return col;',
    '}',
    /* ตัดรังสีกับแผ่นสัญญาทั้งหมด เก็บเฉพาะข้อมูลของแผ่นที่ใกล้สุด แล้วค่อยลงสีครั้งเดียวหลังลูป (ลดขนาด shader มาก) */
    'vec3 sheets(vec3 ro,vec3 rd,float tmax,out float hit){',
    '  float best=tmax;hit=0.;float bs=0.;vec2 bq=vec2(0.);float bdn=1.;float bl=1.;float bf=1.;',
    '  for(int i=0;i<N;i++){',
    '    vec3 C=uC[i];vec3 R=uR[i];vec3 U=uU[i];vec3 n=normalize(cross(R,U));',
    '    float dn=dot(rd,n);if(abs(dn)<1e-4)continue;',
    '    float t=dot(C-ro,n)/dn;if(t<=.05||t>=best)continue;',
    '    vec3 p=ro+rd*t-C;float u=dot(p,R)/.78;float v=dot(p,U)/1.1;',
    '    if(abs(u)>1.||abs(v)>1.)continue;',
    '    best=t;hit=1.;bs=float(i)+1.;bq=vec2(u,v);bdn=dn;',
    '    bl=.40+.60*clamp(abs(dot(n,normalize(L))),0.,1.);',
    '    bf=smoothstep(-1.25,-.55,C.y)*smoothstep(4.7,4.0,C.y);',
    '  }',
    '  vec3 col=vec3(0.);',
    '  if(hit>.5){',
    '    vec3 c=bdn<0.?sheetCol(bs,bq):vec3(.50,.49,.47);',                  /* ด้านหลังแผ่นเป็นกระดาษเปล่า */
    '    c*=bl*.92;c=mix(c,vec3(.02,.022,.027),1.-exp(-best*.075));',
    '    col=mix(vec3(.02,.022,.027),c,bf);',
    '  }',
    '  return col;',
    '}',
    'vec3 render(vec2 uv){',
    '  float asp=uRes.x/uRes.y;float fv=clamp(.9/asp,1.,2.3);',
    '  vec3 ro=vec3(-uMouse.x*.9+sin(uTime*.11)*.15,.45+uMouse.y*.7+sin(uTime*.09)*.04,4.9-uScroll*9.);',
    '  vec3 ta=vec3(0.,.7,-4.5-uScroll*9.);',
    '  vec3 f=normalize(ta-ro);',
    '  float yw=uMouse.x*.34;float pt=uMouse.y*.5;float cyw=cos(yw),syw=sin(yw);',
    '  f=vec3(f.x*cyw+f.z*syw,f.y,-f.x*syw+f.z*cyw);f.y+=pt;f=normalize(f);',
    '  vec3 r=normalize(cross(f,vec3(0.,1.,0.)));vec3 u=cross(r,f);',
    '  float rl=uMouse.x*.10;vec3 r2=r*cos(rl)+u*sin(rl);vec3 u2=-r*sin(rl)+u*cos(rl);',
    '  vec3 rd=normalize(f+(uv.x*r2+uv.y*u2)*1.12*fv);',
    '  vec3 col;float tf=1e5;float h=0.;',
    '  if(rd.y<-1e-3)tf=(-1.7-ro.y)/rd.y;',
    '  if(tf>0.&&tf<1e4){',
    '    vec3 p=ro+rd*tf;vec3 rr=vec3(rd.x,-rd.y,rd.z);',
    '    float rh;vec3 rc=sheets(p+vec3(0.,.002,0.),rr,40.,rh);rc=mix(sky(rr),rc,rh);',
    '    float fres=.10+.62*pow(1.-clamp(-rd.y,0.,1.),3.);',
    '    vec2 g=abs(fract(p.xz*.5)-.5);float grid=smoothstep(.012,0.,min(g.x,g.y))*.045;',
    '    float pool=exp(-length(p.xz-vec2(1.2,-7.))*.14)*.06;',
    '    vec3 base=vec3(.016,.017,.020)+vec3(.55,.57,.62)*(grid+pool);',
    '    col=mix(base,rc,fres);col=mix(col,sky(rd)*.9,clamp(1.-exp(-tf*.05),0.,1.));',
    '    vec3 sc=sheets(ro,rd,tf,h);col=mix(col,sc,h);',
    '  }else{',
    '    col=sky(rd);vec3 sc=sheets(ro,rd,1e5,h);col=mix(col,sc,h);',
    '  }',
    '  return col;',
    '}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    '  float d=length(uv-uLens);float LR=.12;float inL=uLensOn*step(d,LR);float k=clamp(d/LR,0.,1.);',
    '  vec2 uvm=uLens+(uv-uLens)*mix(1.,.50+.50*k*k,inL);',        /* เลนส์ขยาย */
    '  vec3 col=render(uvm);',
    '  col=col/(1.+col*.55);',
    '  float vig=1.-dot(uv*vec2(.9,1.),uv*vec2(.9,1.))*.9;col*=clamp(vig,.25,1.);',
    '  float cx=abs(gl_FragCoord.x/uRes.x-.5)*2.;float m=mix(uDim,1.,smoothstep(.2,.95,cx));m=mix(m,1.,inL*.85);col*=m;',
    '  col+=inL*vec3(.035,.038,.045)*(1.-k);',
    '  float rim=uLensOn*smoothstep(.0065,0.,abs(d-LR));float halo=uLensOn*smoothstep(.03,0.,abs(d-LR-.006))*.18;',
    '  col=mix(col,vec3(.93,.94,.96),rim*.92)+halo*vec3(.7,.72,.76);',
    '  col+=(h21(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.022;',
    '  gl_FragColor=vec4(pow(max(col,0.),vec3(.95)),1.);',
    '}'
  ].join('\n');

  /* ตำแหน่งและการหมุนของแผ่นสัญญาแต่ละแผ่น (คำนวณทุกเฟรมเพื่อให้ลอยเบา ๆ) */
  var AC = new Float32Array(NS * 3), AR = new Float32Array(NS * 3), AU = new Float32Array(NS * 3);
  function layout(t) {
    for (var i = 0; i < NS; i++) {
      if (i >= 9) {                                   /* กระดาษที่ร่วงลงมาและหมุนตกลงมาเป็นรอบ ๆ */
        var j = i - 9, v = .46 + .08 * j, cyc = 6.2, ph = j * 2.3;
        var yw = t * .5 + j * 2, pt = Math.sin(t * .8 + j) * .6, rl = t * .35 + j, sc = .7;
        var c1 = Math.cos(yw), s1 = Math.sin(yw), c2 = Math.cos(pt), s2 = Math.sin(pt), c3 = Math.cos(rl), s3 = Math.sin(rl);
        AR[i * 3] = (c3 * c1 + s3 * s2 * s1) / sc; AR[i * 3 + 1] = (s3 * c2) / sc; AR[i * 3 + 2] = (-c3 * s1 + s3 * s2 * c1) / sc;
        AU[i * 3] = (-s3 * c1 + c3 * s2 * s1) / sc; AU[i * 3 + 1] = (c3 * c2) / sc; AU[i * 3 + 2] = (s3 * s1 + c3 * s2 * c1) / sc;
        AC[i * 3] = [-2.5, .5, 2.7][j] + Math.sin(t * .7 + j * 2) * .4;
        AC[i * 3 + 1] = 4.5 - (((t * v + ph) % cyc) + cyc) % cyc;
        AC[i * 3 + 2] = -1.2 - j * 1.3;
        continue;
      }
      var yaw = Math.sin(i * 1.9) * .55 + Math.sin(t * .17 + i) * .07;
      var pit = Math.sin(i * 2.7) * .16 + Math.sin(t * .13 + i * 2) * .04;
      var rol = Math.sin(i * 3.3) * .22 + Math.sin(t * .11 + i * 3) * .05;
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), cr = Math.cos(rol), sr = Math.sin(rol);
      AR[i * 3] = cr * cy + sr * sp * sy; AR[i * 3 + 1] = sr * cp; AR[i * 3 + 2] = -cr * sy + sr * sp * cy;
      AU[i * 3] = -sr * cy + cr * sp * sy; AU[i * 3 + 1] = cr * cp; AU[i * 3 + 2] = sr * sy + cr * sp * cy;
      var side = (i % 2) ? 1 : -1;
      AC[i * 3] = side * (1.5 + ((i * .37) % 1.7)) + Math.sin(i * 2.1) * .5;
      AC[i * 3 + 1] = .45 + .85 * Math.sin(i * 1.7) + Math.sin(t * .4 + i * 1.3) * .08;
      AC[i * 3 + 2] = -.6 - i * 1.05;
    }
  }

  function init() {
    var hero = document.querySelector('main > .hero');
    if (!hero) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero-3d'; cv.setAttribute('aria-hidden', 'true');
    var gl = null;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', depth: false, stencil: false }); } catch (e) { gl = null; }
    if (!gl) return;

    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { try { console.warn('[VCScene] shader', gl.getShaderInfoLog(s)); } catch (e) {} return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { try { console.warn('[VCScene] link', gl.getProgramInfoLog(prog)); } catch (e) {} return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uRes', 'uTime', 'uMouse', 'uScroll', 'uDim', 'uLens', 'uLensOn', 'uC', 'uR', 'uU'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    hero.insertBefore(cv, hero.firstChild);
    root.classList.add('vc-3d');

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var small = window.innerWidth < 768;
    var scale = small ? 0.55 : 0.72, running = false, inView = true, t0 = performance.now(), raf = 0, W = 0, H = 0;
    var frames = 0, acc = 0, last = 0, lost = false;
    var lens = { x: .12, y: .06, tx: .12, ty: .06, moved: -1e9 };
    var mp = { x: 0, y: 0, tx: 0, ty: 0 }, fixedT = null;
    window.addEventListener('pointermove', function (e) { mp.tx = e.clientX / window.innerWidth - .5; mp.ty = e.clientY / window.innerHeight - .5; }, { passive: true });
    document.addEventListener('pointerleave', function () { mp.tx = 0; mp.ty = 0; });

    /* แว่นขยายตามเมาส์/นิ้วที่อยู่บนฉากเปิด ถ้านิ่งเกิน 6 วินาทีจะเดินวนเอง */
    function onMove(e) {
      var r = hero.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      lens.tx = ((e.clientX - r.left) / r.width - .5) * (r.width / r.height);
      lens.ty = .5 - (e.clientY - r.top) / r.height;
      lens.moved = performance.now();
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });

    function size() {
      var r = hero.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.max(2, Math.round(r.width * scale * dpr)); H = Math.max(2, Math.round(r.height * scale * dpr));
      cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
    }
    function draw(now, still) {
      var r = hero.getBoundingClientRect();
      var sc = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      if (!still) { mp.x += (mp.tx - mp.x) * .16; mp.y += (mp.ty - mp.y) * .16; }
      var P = still ? { x: 0, y: 0 } : mp;
      var t = still ? 3.0 : (fixedT !== null ? fixedT : (now - t0) / 1000), asp = W / H;
      if (still) { lens.x = asp * .12; lens.y = .05; }
      else {
        if (now - lens.moved > 6000) { lens.tx = Math.sin(t * .33) * .27 * asp; lens.ty = Math.cos(t * .21) * .15; }
        lens.x += (lens.tx - lens.x) * .12; lens.y += (lens.ty - lens.y) * .12;
      }
      layout(t);
      gl.uniform2f(U.uRes, W, H);
      gl.uniform1f(U.uTime, t);
      gl.uniform2f(U.uMouse, still ? 0 : P.x, still ? 0 : P.y);
      gl.uniform1f(U.uScroll, still ? 0 : sc);
      gl.uniform1f(U.uDim, small ? 0.6 : 0.5);
      gl.uniform2f(U.uLens, lens.x, lens.y);
      gl.uniform1f(U.uLensOn, sc < .6 ? 1 : 0);
      gl.uniform3fv(U.uC, AC); gl.uniform3fv(U.uR, AR); gl.uniform3fv(U.uU, AU);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(now) {
      raf = 0; if (!running || lost) return;
      draw(now, false);
      if (last) { acc += now - last; frames++; if (frames === 12) { if (acc / frames > 36 && scale > 0.36) { scale = Math.max(0.36, scale * 0.75); size(); } frames = 0; acc = 0; } }
      last = now; raf = requestAnimationFrame(loop);
    }
    function go() {
      if (lost) return;
      if (mq && mq.matches) { running = false; draw(performance.now(), true); return; }
      if (!running && inView && !document.hidden) { running = true; last = 0; if (!raf) raf = requestAnimationFrame(loop); }
    }
    size(); draw(performance.now(), mq && mq.matches); go();
    window.VCScene = { ok: true, get scale() { return scale; }, freeze: function (t) { fixedT = (typeof t === 'number') ? t : null; } };   /* freeze(t): ตรึงเวลาของฉาก ใช้ทดสอบ */

    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; running = false; root.classList.remove('vc-3d'); cv.style.display = 'none'; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (!inView) running = false; else go(); }, { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else go(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { small = window.innerWidth < 768; size(); if (!running) draw(performance.now(), mq && mq.matches); }, 150); });
    if (mq) { var h = function () { if (mq.matches) { running = false; draw(performance.now(), true); } else go(); }; if (mq.addEventListener) mq.addEventListener('change', h); else if (mq.addListener) mq.addListener(h); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ===== (จาก art-field.js) ===== */
/* =========================================================
   art/field.js: บรรยากาศของหน้าแรก (ภาพต้นฉบับของ Vellum ไม่คัดลอกจากเว็บใด)
   1) ผืนแคนวาสในฉากเปิด: แสงเงินเฉียงจางสองแนว กับฝุ่นลอยในแสงแบบมีชั้นความลึก (ตอบสนองเมาส์และการเลื่อน)
      - วาดเฉพาะตอนฉากเปิดอยู่ในจอ และหยุดเมื่อแท็บถูกซ่อน  ปรับ DPR ไม่เกิน 1.5
      - โหมดลดการเคลื่อนไหว: วาดภาพนิ่งเฟรมเดียว
   2) พื้นผิวจุดฝุ่นและเส้นใยแบบกระดาษ: สร้างครั้งเดียวด้วย canvas แล้วคลุมทั้งหน้าที่ body::before (ดู art/finish.css)
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- 2) พื้นผิวจุดฝุ่น ---------- */
  function specks() {
    try {
      var S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
      var g = c.getContext('2d'); if (!g) return;
      var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      function blob(col, n, rmin, rmax) {
        g.fillStyle = col;
        for (var i = 0; i < n; i++) {
          var x = rnd() * S, y = rnd() * S, r = rmin + rnd() * (rmax - rmin);
          g.save(); g.translate(x, y); g.rotate(rnd() * 3.14); g.scale(1, .45 + rnd() * .55);
          g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore();
        }
      }
      function fibers(col, n) {
        g.strokeStyle = col; g.lineWidth = .8; g.lineCap = 'round';
        for (var i = 0; i < n; i++) {
          var x = rnd() * S, y = rnd() * S, a = rnd() * 6.283, l = 6 + rnd() * 16;
          g.beginPath(); g.moveTo(x, y);
          g.quadraticCurveTo(x + Math.cos(a) * l * .6 + rnd() * 5, y + Math.sin(a) * l * .6 + rnd() * 5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
        }
      }
      blob('rgba(0,0,0,.5)', 150, .5, 2.4);          /* จุดเข้ม: เห็นบนพื้นกระดาษ (บนชาร์โคลแทบมองไม่เห็น) */
      blob('rgba(236,233,226,.30)', 130, .5, 2.0);   /* จุดสว่าง: เห็นบนพื้นเข้ม (บนกระดาษแทบมองไม่เห็น) */
      fibers('rgba(0,0,0,.35)', 26);
      fibers('rgba(236,233,226,.22)', 22);
      root.style.setProperty('--specks', 'url(' + c.toDataURL('image/png') + ')');
      root.classList.add('vc-specks');
    } catch (e) { /* ไม่มีพื้นผิวก็ไม่กระทบการใช้งาน */ }
  }
  specks();

  /* ---------- 1) ผืนแคนวาสฉากเปิด ---------- */
  function field() {
    var hero = document.querySelector('main > .hero');
    if (!hero) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero-field'; cv.setAttribute('aria-hidden', 'true');
    hero.insertBefore(cv, hero.firstChild);
    var g = cv.getContext('2d'); if (!g) return;
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var W = 0, H = 0, dpr = 1, parts = [], running = false, inView = true, t0 = performance.now();
    var small = window.innerWidth < 768;

    function size() {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = small ? 28 : 64;
      parts = [];
      var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var i = 0; i < n; i++) parts.push({ x: rnd() * W, y: rnd() * H, z: .25 + rnd() * .75, r: .5 + rnd() * 1.7, vy: -(.012 + rnd() * .03), ph: rnd() * 6.283, sp: .4 + rnd() * .9 });
    }
    function beam(cx, w, a, sway) {
      var grd = g.createLinearGradient(cx - w, 0, cx + w, 0);
      grd.addColorStop(0, 'rgba(217,219,223,0)'); grd.addColorStop(.5, 'rgba(217,219,223,' + a + ')'); grd.addColorStop(1, 'rgba(217,219,223,0)');
      g.save(); g.translate(cx, -H * .1); g.rotate(.32 + sway); g.translate(-cx, 0);
      g.fillStyle = grd; g.fillRect(cx - w, 0, w * 2, H * 1.6); g.restore();
    }
    function draw(now) {
      var t = (now - t0) / 1000, P = window.VCPointer || { x: 0, y: 0 };
      var sc = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, H)));
      g.clearRect(0, 0, W, H);
      if (!root.classList.contains('vc-3d')) {
        beam(W * .72, W * .07, .055, Math.sin(t * .18) * .015 + P.x * .02);
        beam(W * .9, W * .045, .035, Math.sin(t * .13 + 1) * .012 + P.x * .015);
      }
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var x = p.x + Math.sin(t * .25 * p.sp + p.ph) * 14 * p.z - P.x * 46 * p.z;
        var y = p.y + t * p.vy * H * .16 - sc * 90 * p.z - P.y * 28 * p.z;
        y = ((y % (H + 20)) + (H + 20)) % (H + 20) - 10;
        var inBeam = Math.max(0, 1 - Math.abs(x - (W * .72 + (y - H * .1) * -.33)) / (W * .12));
        var tw = .55 + .45 * Math.sin(t * p.sp * 1.4 + p.ph);
        var a = (.1 + .4 * inBeam) * p.z * tw;
        g.fillStyle = 'rgba(236,233,226,' + a.toFixed(3) + ')';
        g.beginPath(); g.arc(x, y, p.r * p.z * 1.2, 0, 6.283); g.fill();
      }
    }
    function loop(now) { if (!running) return; draw(now); requestAnimationFrame(loop); }
    function go() {
      var reduced = mq && mq.matches;
      if (reduced) { running = false; draw(t0 + 4000); return; }
      if (!running && inView && !document.hidden) { running = true; requestAnimationFrame(loop); }
    }
    size(); draw(performance.now()); go();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (!inView) running = false; else go(); }, { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else go(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { small = window.innerWidth < 768; size(); draw(performance.now()); }, 150); });
    if (mq) { var h = function () { if (mq.matches) { running = false; draw(t0 + 4000); } else go(); }; if (mq.addEventListener) mq.addEventListener('change', h); else if (mq.addListener) mq.addListener(h); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', field); else field();
})();
