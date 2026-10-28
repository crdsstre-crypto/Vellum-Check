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
    '  float m=mix(uDim,1.,smoothstep(.12,.7,gl_FragCoord.x/uRes.x));col*=m;',
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
      gl.uniform1f(U.uDim, small ? 0.62 : 0.52);
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
