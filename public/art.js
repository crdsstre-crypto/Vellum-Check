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

/* ===== (จาก art-scene.js) ===== */
/* =========================================================
   art/scene.js: ฉาก 3 มิติของหน้าแรก "ห้องอ่านสัญญา" (WebGL ล้วน ไม่พึ่งไลบรารี ไม่ใช้ไฟล์ภาพ)
   ภาพต้นฉบับของ Vellum: แผ่นเวลลัมโปร่งแสงตั้งเรียงลึกเข้าไป พื้นเงามืดสะท้อนแสง ทรงกลมกระดาษ และแสงเงินไกล ๆ
   - กล้องขยับตามเมาส์ (พาราแลกซ์) และเดินเข้าไปในห้องตามการเลื่อนหน้า (ค่า 0..1 ของ hero ที่เลื่อนพ้น)
   - ใช้การตัดกันของรังสีกับระนาบแบบวิเคราะห์ (ไม่มี raymarching) จึงเบา  ความละเอียดภายในต่ำกว่าจอ
     และลดลงเองถ้าเครื่องช้า  วาดเฉพาะตอนฉากเปิดอยู่ในจอและแท็บไม่ถูกซ่อน
   - ไม่มี WebGL / context หลุด / ผู้ใช้ลดการเคลื่อนไหว: ถอยเป็นภาพนิ่ง หรือกลับไปใช้ฉากฝุ่น 2 มิติของ field.js
   ลบการโหลดไฟล์นี้ออกจาก index.html เพื่อปิดฉาก 3 มิติทั้งหมด
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;uniform float uDim;',
    'const int N=8;',
    'const vec3 L=vec3(-.5,.62,.6);',                       /* ทิศแสงที่ตกบนทรงกลม (ก่อน normalize ในโค้ด) */
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    /* แสงเงินไกล ๆ และท้องฟ้ามืด */
    'vec3 sky(vec3 rd){',
    '  float h=clamp(rd.y*.5+.5,0.,1.);',
    '  vec3 c=mix(vec3(.050,.052,.060),vec3(.010,.010,.013),h);',
    '  vec3 Ld=normalize(vec3(.34,.30,-1.));',
    '  float g=max(dot(rd,Ld),0.);',
    '  c+=vec3(.50,.52,.56)*pow(g,5.)*.30;',
    '  c+=vec3(.90,.92,.96)*pow(g,48.)*.75;',
    '  return c;',
    '}',
    /* แผ่นเวลลัม: ตำแหน่ง ทิศ และขนาดของแผ่นที่ i */
    'vec3 slabC(float i){float x=sin(i*2.399)*3.5+(mod(i,2.)<.5?-1.:1.)*1.5;return vec3(x,2.7,-3.4-i*3.3);}',
    'float slabYaw(float i){return sin(i*1.7)*.2;}',
    'float slabHx(float i){return 1.15+.3*sin(i*3.1);}',
    /* ทรงกลมกระดาษ (วิเคราะห์) */
    'vec3 sphere(vec3 ro,vec3 rd,vec3 col,float tmax){',
    '  vec3 S=vec3(2.3,1.15,-10.5);float R=1.15;',
    '  vec3 oc=ro-S;float b=dot(oc,rd);float c=dot(oc,oc)-R*R;float d=b*b-c;',
    '  if(d>0.){float t=-b-sqrt(d);if(t>0.&&t<tmax){',
    '    vec3 p=ro+rd*t;vec3 n=normalize(p-S);vec3 Ln=normalize(L);',
    '    float df=max(dot(n,Ln),0.);float rim=pow(1.-max(dot(n,-rd),0.),3.);',
    '    vec3 sc=vec3(.80,.79,.76)*(.10+.95*df)+vec3(.55,.58,.64)*rim*.35;',
    '    sc=mix(sc,sky(rd),clamp(1.-exp(-t*.03),0.,1.)*.55);',
    '    col=sc;}}',
    '  return col;',
    '}',
    /* แผ่นเวลลัมโปร่ง: วางทับจากไกลมาใกล้ */
    'vec3 slabs(vec3 ro,vec3 rd,vec3 col,float tmax){',
    '  for(int k=0;k<N;k++){',
    '    float i=float(N-1-k);',
    '    vec3 C=slabC(i);float yw=slabYaw(i);float hx=slabHx(i);float hy=2.7;',
    '    vec3 n=vec3(sin(yw),0.,cos(yw));vec3 tg=vec3(cos(yw),0.,-sin(yw));',
    '    float dn=dot(rd,n);',
    '    if(abs(dn)<1e-4)continue;',
    '    float t=dot(C-ro,n)/dn;',
    '    if(t<=.05||t>=tmax)continue;',
    '    vec3 p=ro+rd*t;vec3 lc=p-C;float u=dot(lc,tg);float v=lc.y;',
    '    if(abs(u)>=hx||abs(v)>=hy)continue;',
    '    float eo=min(hx-abs(u),hy-abs(v));',                 /* ระยะถึงขอบนอก */
    '    float win=step(abs(u),hx*.56)*step(-hy*.72,v)*step(v,hy*.38);',
    '    float ei=win>.5?min(hx*.56-abs(u),min(v+hy*.72,hy*.38-v)):1.;',
    '    float edge=smoothstep(.07,0.,eo)+smoothstep(.05,0.,ei)*step(.5,win);',
    '    float lit=.45+.55*smoothstep(hy,-hy*.4,v);',          /* สว่างช่วงล่าง (รับแสงจากพื้น) */
    '    float al=mix(.27,.07,win)*lit+edge*.7;',
    '    float fog=1.-exp(-t*.045);',
    '    vec3 sc=vec3(.74,.76,.80)*(.55+.55*lit);sc=mix(sc,vec3(.03,.032,.038),fog*.7);',
    '    col=mix(col,sc,clamp(al*(1.-fog*.55),0.,1.));',
    '  }',
    '  return col;',
    '}',
    'vec3 noFloor(vec3 ro,vec3 rd,float tmax){',
    '  vec3 c=sky(rd);c=sphere(ro,rd,c,tmax);c=slabs(ro,rd,c,tmax);return c;',
    '}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    '  float asp=uRes.x/uRes.y;float fv=clamp(.9/asp,1.,2.3);',
    '  vec3 ro=vec3(uMouse.x*1.3+sin(uTime*.11)*.22,1.25-uMouse.y*.4+sin(uTime*.09)*.05,5.6-uScroll*12.);',
    '  vec3 ta=vec3(.45+uMouse.x*1.8,2.7-uMouse.y*.6,-9.-uScroll*12.);',
    '  vec3 f=normalize(ta-ro);vec3 r=normalize(cross(f,vec3(0.,1.,0.)));vec3 u=cross(r,f);',
    '  vec3 rd=normalize(f+(uv.x*r+uv.y*u)*1.12*fv);',
    '  vec3 col;float tf=1e5;',
    '  if(rd.y<-1e-3)tf=-ro.y/rd.y;',
    '  if(tf<1e4){',
    '    vec3 p=ro+rd*tf;',
    '    vec3 rr=vec3(rd.x,-rd.y,rd.z);',
    '    vec3 rc=noFloor(p+vec3(0.,.002,0.),rr,60.);',
    '    float fres=.10+.62*pow(1.-clamp(-rd.y,0.,1.),3.);',
    '    vec2 g=abs(fract(p.xz*.5)-.5);float grid=smoothstep(.012,0.,min(g.x,g.y))*.05;',
    '    float pool=exp(-length(p.xz-vec2(1.6,-9.))*.13)*.07;',
    '    vec3 base=vec3(.016,.017,.020)+vec3(.55,.57,.62)*(grid+pool);',
    '    col=mix(base,rc,fres);',
    '    col=mix(col,sky(rd)*.9,clamp(1.-exp(-tf*.055),0.,1.));',
    '    col=sphere(ro,rd,col,tf);',
    '    col=slabs(ro,rd,col,tf);',
    '  }else{',
    '    col=noFloor(ro,rd,1e5);',
    '  }',
    '  col=col/(1.+col*.55);',
    '  float vig=1.-dot(uv*vec2(.9,1.),uv*vec2(.9,1.))*.9;col*=clamp(vig,.25,1.);',
    '  float cx=abs(gl_FragCoord.x/uRes.x-.5)*2.;float m=mix(uDim,1.,smoothstep(.2,.95,cx));col*=m;',
    '  col+=(hash(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.022;',
    '  gl_FragColor=vec4(pow(max(col,0.),vec3(.95)),1.);',
    '}'
  ].join('\n');

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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uRes', 'uTime', 'uMouse', 'uScroll', 'uDim'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    hero.insertBefore(cv, hero.firstChild);
    root.classList.add('vc-3d');

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var small = window.innerWidth < 768;
    var scale = small ? 0.6 : 0.8, running = false, inView = true, t0 = performance.now(), raf = 0, W = 0, H = 0;
    var frames = 0, acc = 0, last = 0, lost = false;

    function size() {
      var r = hero.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.max(2, Math.round(r.width * scale * dpr)); H = Math.max(2, Math.round(r.height * scale * dpr));
      cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
    }
    function draw(now, still) {
      var P = window.VCPointer || { x: 0, y: 0 };
      var r = hero.getBoundingClientRect();
      var sc = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      gl.uniform2f(U.uRes, W, H);
      gl.uniform1f(U.uTime, still ? 3.0 : (now - t0) / 1000);
      gl.uniform2f(U.uMouse, still ? 0 : P.x, still ? 0 : P.y);
      gl.uniform1f(U.uScroll, still ? 0 : sc);
      gl.uniform1f(U.uDim, small ? 0.6 : 0.46);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(now) {
      raf = 0; if (!running || lost) return;
      draw(now, false);
      /* ปรับคุณภาพเองถ้าเครื่องช้า: เฉลี่ย 40 เฟรมแรกเกิน 30ms ให้ลดความละเอียดลง */
      if (last) { acc += now - last; frames++; if (frames === 40) { if (acc / frames > 30 && scale > 0.36) { scale = Math.max(0.36, scale * 0.75); size(); } frames = 0; acc = 0; } }
      last = now; raf = requestAnimationFrame(loop);
    }
    function go() {
      if (lost) return;
      if (mq && mq.matches) { running = false; draw(performance.now(), true); return; }
      if (!running && inView && !document.hidden) { running = true; last = 0; if (!raf) raf = requestAnimationFrame(loop); }
    }
    size(); draw(performance.now(), mq && mq.matches); go();
    window.VCScene = { ok: true, get scale() { return scale; } };

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
