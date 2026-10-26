(function(){
var EMB=false;try{EMB=window.parent!==window}catch(e){EMB=true}if(EMB)document.documentElement.classList.add('emb');
var D=32.8,W0=5.5,X=14.8,W1=22.2,X2=0,DR=D+X+X2,O=4.4,SS=5.6,st=document.getElementById('st'),box=document.getElementById('lines'),doc=document.getElementById('doc'),pts=document.getElementById('pts'),cap=document.getElementById('cap');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var K=function(x){return Math.min(1,Math.max(0,x))};
var E=function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
var seg=function(t,a,b){return E(K((t-a)/(b-a)))};
var sp=function(t,a,b){var x=K((t-a)/(b-a))-1;return 1+2.4*x*x*x+1.4*x*x};
var els=[],pos=[],H=177.8;
function ln(w,p,c){var d=document.createElement('div');d.className='ln'+(c?' '+c:'');d.style.width=w+'%';p.appendChild(d);els.push(d);return d}
[100,86,94,70].forEach(function(w){ln(w,box)});
[[80,'ok'],[92,'warn'],[68,'risk']].forEach(function(r){var tr=document.createElement('div');tr.className='tr';ln(70,tr);ln(r[0],tr,r[1]);box.appendChild(tr)});
[100,64].forEach(function(w){ln(w,box)});
function measure(){var h=doc.offsetHeight||1;pos=els.map(function(e){return(e.offsetTop+e.offsetHeight/2)/h});H=st.clientHeight/(st.clientWidth||1)*100||177.8}
var P=[];for(var i=0;i<22;i++){var d=document.createElement('i');d.className='pt';var s=.5+Math.random()*.8;d.style.width=d.style.height=s+'cqw';pts.appendChild(d);P.push({e:d,x:Math.random()*100,y:Math.random(),v:2+Math.random()*4,ph:Math.random()*6})}
var names=['อินโทร โลโก้ Vellum Check','ภาพก่อนใช้ สัญญายาวอ่านไม่ไหว','ฉากที่ 1 เปิดตัวอย่างมีระดับ','ฉากที่ 2 แสดงการตรวจสอบ','ฉากที่ 3 สรุปผลให้เข้าใจง่าย','ฉากที่ 4 ปิดท้ายด้วยความน่าเชื่อถือ','ฉากที่ 1 ปัญหาและกลุ่มเป้าหมาย','ฉากที่ 2 ฟีเจอร์หลัก','ฉากปิด คำเตือนและข้อจำกัด','ฉากจบ ตัดสินใจด้วยตัวเอง'];
var CP=[[.3,2.8,'อ่านสัญญา 20 หน้า… เสี่ยงโดนเอาเปรียบโดยไม่รู้ตัว?'],[2.9,4.3,'ให้ Vellum Check ช่วยอ่านและสรุปให้ ก่อนเซ็น'],[4.6,6.4,'ส่งสัญญาเข้ามา ระบบเข้ารหัสและปกป้องข้อมูลก่อนเริ่มตรวจ'],[6.6,9.1,'เอ็กซ์เรย์ทุกข้อ พร้อม AI แนะนำข้อความที่ควรขอแก้'],[9.2,12.5,'ตรวจเสร็จ ให้คะแนนสุขภาพสัญญา สรุปง่าย แยกสีตามความเสี่ยง'],[12.6,13.9,'รู้ก่อนว่าข้อไหนควรระวัง ก่อนลงนาม'],[14.1,16.4,'ปกป้องคุณจากข้อสัญญาที่ไม่เป็นธรรม คุ้มกว่าเสี่ยงเสียเงินทีหลัง']];
CP.forEach(function(c,i){if(i>0){c[0]+=SS;c[1]+=SS}});CP.push([2.9,5.4,'สัญญายาว ศัพท์ซับซ้อน ใครๆ ก็พลาดได้'],[5.6,8.2,'สแกนหาข้อเสียเปรียบ สรุปให้เข้าใจง่าย และปลอดภัยสูง']);var t=0,u=0,playing=true,last=0,capIdx=-2;
/*VO*/var VC=[[0.0, 4.22, "อ่านสัญญา 20 หน้า… เสี่ยงโดนเอาเปรียบโดยไม่รู้ตัว?"], [4.77, 8.31, "สัญญายาว ศัพท์ซับซ้อน ใครๆ ก็พลาดได้"], [8.7, 12.54, "สิ่งที่น่ากังวลที่สุด อาจไม่ใช่สิ่งที่คุณอ่านเจอ"], [12.82, 14.45, "แต่เป็นสิ่งที่คุณมองข้ามไป"], [14.87, 18.74, "ค่าเช่าปรับได้ เลิกสัญญาต้องแจ้งล่วงหน้า มีค่าปรับ"], [19.07, 21.36, "ข้อเล็ก ๆ เหล่านี้ อาจเปลี่ยนทุกอย่าง"], [21.65, 24.16, "Vellum Check เข้ามาช่วยอ่านสัญญาแทนคุณ"], [24.32, 27.59, "ชี้จุดที่ควรระวัง พร้อมคำแนะนำที่ควรขอแก้"], [27.72, 31.59, "สแกนหาข้อเสียเปรียบ สรุปให้เข้าใจง่าย และปลอดภัยสูง"], [31.71, 34.67, "ให้ Vellum Check ช่วยอ่านและสรุปให้ ก่อนเซ็น"], [34.82, 38.34, "ส่งสัญญาเข้ามา ระบบเข้ารหัสและปกป้องข้อมูลก่อนเริ่มตรวจ"], [38.5, 42.37, "เอ็กซ์เรย์ทุกข้อ พร้อม AI แนะนำข้อความที่ควรขอแก้"], [42.49, 45.98, "ตรวจเสร็จ ให้คะแนนสุขภาพสัญญา สรุปง่าย แยกสีตามความเสี่ยง"], [46.1, 48.92, "รู้ก่อนว่าข้อไหนควรระวัง ก่อนลงนาม"], [48.98, 53.3, "ปกป้องคุณจากข้อสัญญาที่ไม่เป็นธรรม คุ้มกว่าเสี่ยงเสียเงินทีหลัง"]],WO=[0, 5.5, 10.2, 14.8, 20.3, 26.8, 30.1, 32.6, 34.1, 35.2, 36.0, 37.0],WV=[0, 8.45, 14.62, 21.46, 27.55, 37.6, 41.0, 43.0, 44.6, 46.3, 48.9, 53.3],MD=63.9,MW=0;
function wf(m){var n=WV.length-1;if(m<=0)return m;if(m>=WV[n])return WO[n]+(m-WV[n]);for(var i=0;i<n;i++)if(m<WV[i+1])return WO[i]+(m-WV[i])*(WO[i+1]-WO[i])/(WV[i+1]-WV[i]);return m}
var RTw=0,NC=[[5.7,7.9,'สิ่งที่น่ากังวลที่สุด อาจไม่ใช่สิ่งที่คุณอ่านเจอ'],[8,10.2,'แต่เป็นสิ่งที่คุณมองข้ามไป'],[10.6,12.4,'ค่าเช่าปรับได้ เลิกสัญญาต้องแจ้งล่วงหน้า มีค่าปรับ'],[12.5,14.6,'ข้อเล็ก ๆ เหล่านี้ อาจเปลี่ยนทุกอย่าง'],[15,17.1,'Vellum Check เข้ามาช่วยอ่านสัญญาแทนคุณ'],[17.2,20.2,'ชี้จุดที่ควรระวัง พร้อมคำแนะนำที่ควรขอแก้'],[37.3,41.8,'ตัวอย่าง: AI ชี้ข้อเสี่ยง พร้อมแนะนำข้อความที่ควรขอแก้'],[42.3,46.8,'สรุปง่าย แยกสีตามระดับความเสี่ยง'],[47.3,51.8,'AI ช่วยเช็ก ผู้เชี่ยวชาญตรวจซ้ำ แต่คุณเป็นผู้ตัดสินใจ']];
var pp=document.getElementById('pp'),sk=document.getElementById('sk'),sc=document.getElementById('sc'),tm=document.getElementById('tm'),sn=document.getElementById('sn');
var sc_={};function set(k,v){if(sc_[k]!==v){sc_[k]=v;st.style.setProperty(k,v)}}
var lite=false,lr=0,ltb=document.getElementById('lt');
function setLite(v){lite=v;st.classList.toggle('lite',v);ltb.textContent='โหมดลื่น: '+(v?'เปิด':'ปิด');ltb.setAttribute('aria-pressed',v)}
ltb.onclick=function(){setLite(!lite);try{localStorage.setItem('vc-lite',lite?'1':'0')}catch(e){}};
var fD=function(x){return sp(x,4.9,5.8)},f1=function(x){return sp(x,5.3,6.2)},f2=function(x){return sp(x,6.1,7)},f3=function(x){return sp(x,6.9,7.8)},f4=function(x){return sp(x,9.4,10.3)};
function bl(f){return Math.min(5,Math.abs(f(u+.03)-f(u-.03))/.06*1.3).toFixed(2)}
/* ---- Web Audio SFX (synthesized, no files) ---- */
var AC=null,master=null,sfx=false,sweep=null;
function ensure(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;AC=new C();master=AC.createGain();master.gain.value=.55;master.connect(AC.destination)}
 if(AC.state==='suspended')AC.resume();return true}
function tone(f,dur,vol,type,dly,f2){var n=AC.currentTime+(dly||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+dur);
 g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(vol,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+dur);o.connect(g);g.connect(master);o.start(n);o.stop(n+dur+.05)}
function noise(dur,vol,hz){var n=AC.currentTime,len=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
 var s=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=hz||1800;g.gain.value=vol;s.buffer=b;s.connect(f);f.connect(g);g.connect(master);s.start(n)}
function chime(f,v){tone(f,1.1,v);tone(f*2,.8,v*.35,'sine',.01);tone(f*3.01,.5,v*.14,'sine',.02)}
function stamp(){tone(150,.24,.55,'sine',0,45);noise(.07,.3,1500)}
function rustle(){tone(80,1.5,.1,'sine');for(var i=0;i<4;i++)(function(i){setTimeout(function(){if(sfx&&AC&&playing)noise(.18,.16,900)},i*320)})(i)}
function whoosh(){noise(.4,.28,2600);tone(260,.4,.07,'sine',0,1400)}
function seal(){stamp();tone(2400,.5,.05,'sine',.08);tone(3200,.4,.04,'sine',.14)}
function stopSweep(){if(!sweep||!AC)return;try{var n=AC.currentTime;sweep.g.gain.cancelScheduledValues(n);sweep.g.gain.setTargetAtTime(.0001,n,.06);sweep.o.stop(n+.4);sweep.o2.stop(n+.4)}catch(e){}sweep=null}
function startSweep(){stopSweep();var n=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();
 o.type='sawtooth';o2.type='sine';o.frequency.setValueAtTime(110,n);o.frequency.exponentialRampToValueAtTime(330,n+2.8);o2.frequency.setValueAtTime(220,n);o2.frequency.exponentialRampToValueAtTime(660,n+2.8);
 f.type='lowpass';f.frequency.setValueAtTime(300,n);f.frequency.exponentialRampToValueAtTime(2200,n+2.8);
 g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.07,n+.4);g.gain.setValueAtTime(.07,n+2.3);g.gain.exponentialRampToValueAtTime(.0001,n+2.8);
 o.connect(f);o2.connect(f);f.connect(g);g.connect(master);o.start(n);o2.start(n);o.stop(n+2.9);o2.stop(n+2.9);sweep={o:o,o2:o2,g:g}}
var EV=[{t:1.3,f:function(){chime(880,.1)}},{t:2.9,f:rustle},{t:4.15,f:whoosh},{t:O+2,f:startSweep},{t:O+3.3,f:function(){tone(1760,.2,.05)}},{t:O+3.55,f:function(){tone(1320,.2,.05)}},{t:O+3.8,f:function(){tone(990,.25,.06)}},{t:O+4.8,f:seal},{t:O+5.3,f:function(){chime(1568,.12)}},{t:O+6.1,f:function(){chime(1175,.12)}},{t:O+6.9,f:function(){chime(880,.12)}},{t:O+9.8,f:function(){chime(1318,.1);chime(1760,.07)}},{t:2.95,a:1,f:whoosh},{t:3.2,a:1,f:function(){tone(1320,.12,.05)}},{t:3.5,a:1,f:function(){tone(1320,.12,.05)}},{t:3.8,a:1,f:function(){tone(1320,.12,.05)}},{t:4.1,a:1,f:function(){tone(1320,.12,.05)}},{t:5.6,a:1,f:whoosh},{t:5.88,a:1,f:stamp},{t:6.33,a:1,f:stamp},{t:6.78,a:1,f:stamp},{t:6.95,a:1,f:function(){chime(1568,.05)}},{t:7.35,a:1,f:function(){chime(1568,.05)}},{t:7.75,a:1,f:function(){chime(1568,.05)}},{t:22.7,a:1,f:stamp},{t:23.1,a:1,f:function(){tone(880,.15,.06);tone(660,.25,.06,'sine',.15)}},{t:27.3,a:1,f:function(){chime(1175,.06)}},{t:29.3,a:1,f:function(){chime(880,.04)}},{t:31.2,a:1,f:function(){chime(660,.03)}},{t:5.65,r:1,f:whoosh},{t:7.05,r:1,f:function(){chime(1568,.06)}},{t:10.15,r:1,f:whoosh},{t:10.95,r:1,f:function(){tone(1320,.12,.05)}},{t:11.75,r:1,f:function(){tone(1320,.12,.05)}},{t:12.55,r:1,f:function(){tone(1320,.12,.05)}},{t:14.7,r:1,f:whoosh},{t:15.6,r:1,f:whoosh},{t:16.95,r:1,f:function(){chime(1568,.05)}},{t:17.35,r:1,f:function(){chime(1568,.05)}},{t:17.75,r:1,f:function(){chime(1568,.05)}}];
function sfxCheck(a,b){if(!sfx||!AC)return;for(var i=0;i<EV.length;i++){var e=EV[i];var et=e.r?e.t:(e.a?e.t:(e.t>2?e.t+SS:e.t));if(!e.r&&et>=W0)et+=X;if(!e.r&&et>=W1+X)et+=X2;if(et>a&&et<=b)e.f()}}
var SH=[],bpg=document.getElementById('bpg'),imn=document.getElementById('imn'),imk=document.getElementById('imk'),pgc=0,imc='',kc='',BR=[-10,-5,1,6,10,-2];
(function(){var w=document.getElementById('shs');for(var i=0;i<6;i++){var d=document.createElement('div');d.className='sh';w.appendChild(d);SH.push(d)}})();
function shake(){var t=T0;if(t<2.6||t>4.6)return;
 for(var i=0;i<6;i++){SH[i].style.transform='translate('+(Math.sin(t*17+i*2)*.7+(i-3)*.5).toFixed(2)+'cqw,'+(Math.cos(t*21+i)*.6+i*.15).toFixed(2)+'cqw) rotate('+(BR[i]+Math.sin(t*13+i)*1.6).toFixed(2)+'deg)'}
 set('--bx',(Math.sin(t*29)*.5).toFixed(2)+'cqw');set('--by',(Math.cos(t*31)*.5).toFixed(2)+'cqw');
 var pg=Math.max(1,Math.min(20,1+Math.floor((t-2.9)/1.2*20)));if(pg!==pgc){pgc=pg;bpg.textContent='หน้า '+pg+' / 20'}}
var gn=document.getElementById('gn'),gc='';function counter(){var g=seg(u,10.1,11.5),gs=Math.round(68*g)+'%';set('--gq',g);if(gs!==gc){gc=gs;gn.textContent=gs}var c=seg(u,9.6,11.4),n='฿'+Math.round(14500*c).toLocaleString('en-US'),k=String(Math.round(3*c));if(n!==imc){imc=n;imn.textContent=n}if(k!==kc){kc=k;imk.textContent=k}}
var T0=0,tx=0,ty=0,px=0,py=0,gp=0,cl=function(v){return Math.max(-1,Math.min(1,v))};
function pm(e){var r=st.getBoundingClientRect();tx=cl(((e.clientX-r.left)/r.width-.5)*2);ty=cl(((e.clientY-r.top)/r.height-.5)*2)}
st.addEventListener('pointermove',pm);st.addEventListener('pointerdown',function(e){pm(e);if(gp)return;gp=1;try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)DeviceOrientationEvent.requestPermission().catch(function(){})}catch(x){}});
st.addEventListener('pointerleave',function(){tx=ty=0});
addEventListener('deviceorientation',function(e){if(e.gamma==null||e.beta==null)return;tx=cl(e.gamma/25);ty=cl((e.beta-45)/25)});
function bn(x,a,d){var k=(x-a)/(d*1.35);if(k<=0)return 0;if(k>=1)return 1;var m=k-1;return 1+1.9*m*m*m+0.9*m*m}
function fxi(x){var m=0,e=function(v){v=Math.max(0,1-Math.abs(v));return v*v*(3-2*v)};for(var k=0;k<3;k++)m=Math.max(m,e((x-(5.95+.45*k))/.32)*.16);return Math.max(m,e((x-22.85)/.32)*.16)}
function shk(x){var a=0;for(var k=0;k<3;k++){var d=x-(5.88+.45*k);if(d>0&&d<.5)a=Math.max(a,Math.exp(-d*9))}var d2=x-22.7;if(d2>0&&d2<.5)a=Math.max(a,Math.exp(-d2*9));return a}
function soft(x){var a=0,w=function(d){return d>0&&d<.7?Math.sin(Math.PI*d/.7):0};for(var k=0;k<3;k++)a=Math.max(a,w(x-(5.88+.45*k)));return Math.max(a,w(x-22.7))}
var SP=[],sp5=document.getElementById('sp5'),spOn=false,CT=[29.55,29.8,30.3,30.05];
(function(){for(var i=0;i<18;i++){var d=document.createElement('i');d.className='pt';d.style.width=d.style.height=(.5+Math.random()*.7).toFixed(2)+'cqw';sp5.appendChild(d);var sd=i%2?1:-1;SP.push({e:d,sx:sd<0?2+Math.random()*22:76+Math.random()*22,sy:10+Math.random()*38,tx:50+(Math.random()-.5)*14,ty:10+(Math.random()-.5)*7,ph:Math.random()*6,k:i<4})}})();
function fin(){var g3=seg(t,30.6,31.6),g4=seg(t,31.5,32.5),i,a;
 set('--g3',g3.toFixed(3));set('--g4',g4.toFixed(3));set('--rA',seg(t,28.7,31.1).toFixed(3));set('--rB',seg(t,29,31.4).toFixed(3));
 for(i=0;i<4;i++){a=CT[i];set('--n'+(i+1),sp(t,28.6+.16*i,29.5+.16*i).toFixed(3));set('--hv'+(i+1),(seg(t,a,a+.22)*(1-seg(t,a+.28,a+.6))).toFixed(3));set('--hs'+(i+1),seg(t,a,a+.6).toFixed(3))}
 var on=t>28.5&&t<33;
 if(on||spOn){spOn=on;var g=seg(t,28.8,29.6),p=E(g3);
  for(var j=0;j<SP.length;j++){var q=SP[j],x=q.sx+(q.tx-q.sx)*p+Math.sin(t*1.1+q.ph)*1.2*(1-p),y=q.sy+(q.ty-q.sy)*p+Math.cos(t*.9+q.ph)*1.2*(1-p);
   q.e.style.transform='translate('+x.toFixed(2)+'cqw,'+y.toFixed(2)+'cqw) scale('+(1-.4*p).toFixed(2)+')';
   q.e.style.opacity=(on?g*(.3+.7*Math.pow(Math.sin(t*3+q.ph),2))*(q.k?1-.5*g4:1-g4):0).toFixed(2)}}}
var NS=['ฉากที่ 2 กับดักที่ซ่อนอยู่','ฉากที่ 3 จุดเล็ก ๆ ที่อาจเปลี่ยนทุกอย่าง','ฉากที่ 4 Vellum Check เข้ามาช่วย'];sk.max=MD;
function nsc(R){var i,o2=seg(R,5.4,5.9)*(1-seg(R,10,10.4)),o3=seg(R,10.1,10.5)*(1-seg(R,14.4,14.8)),o4=seg(R,14.7,15.1)*(1-seg(R,19.9,20.4));
 set('--no2',o2);set('--no3',o3);set('--no4',o4);
 for(i=0;i<5;i++)set('--np'+i,sp(R,5.7+.2*i,6.5+.2*i));
 set('--nz',seg(R,7.1,7.9));set('--nt1',seg(R,6.2,6.9));set('--nt2',seg(R,7,7.7));set('--nt3',seg(R,7.9,8.6));set('--nic',seg(R,8.1,9.2));set('--nt4',seg(R,8.9,9.5));set('--nsl',seg(R,6.4,7.4));set('--nzm',seg(R,8.2,10.2));set('--ncam',seg(R,5.4,10.2));
 set('--nly',(2+8.95*seg(R,10.4,10.9)+8.8*seg(R,11.2,11.7)+8.8*seg(R,12,12.5)).toFixed(2));
 set('--nm1',seg(R,10.8,11.1));set('--nm2',seg(R,11.6,11.9));set('--nm3',seg(R,12.4,12.7));
 set('--nc1',sp(R,10.9,11.5));set('--nc2',sp(R,11.7,12.3));set('--nc3',sp(R,12.5,13.1));set('--nct',seg(R,13.3,13.9));set('--nu1',seg(R,10.9,11.5));set('--nu2',seg(R,11.5,12.1));set('--nu3',seg(R,12.5,13.2));set('--nu4',seg(R,13.4,14));set('--nz3',seg(R,13.6,14.8));
 set('--nda',seg(R,14.9,15.6));set('--ns',seg(R,15.7,17));set('--nh1',seg(R,17,17.5));set('--nh2',seg(R,17.3,17.8));set('--nh3',seg(R,17.7,18.2));set('--bva',seg(R,14.85,15.15)*(1-seg(R,16.95,17.45)));set('--bvb',seg(R,14.85,15.4));set('--bvd',seg(R,15,15.8));set('--bvw',seg(R,15.25,15.8));set('--bvr',seg(R,15.5,16.1));set('--bvt',seg(R,15.8,16.3));set('--bvs',seg(R,15.6,16.5));set('--k5h',seg(R,17,17.5));set('--k5c',seg(R,17.3,17.9));set('--k5p',sp(R,17.6,18.4));set('--k5t',seg(R,18.1,18.7));set('--k5z',seg(R,14.9,20.3));set('--k5e',seg(R,18.9,20.2))}

/* ===== icon wow fx (scene 2) ===== */
var VI=[];
(function(){var ic=document.querySelectorAll('.fc .ic.vst'),cols=['255,176,84','255,226,140','72,222,168'];
 function mk(c,p){var d=document.createElement('div');d.className=c;if(p)p.appendChild(d);return d}
 for(var i=0;i<ic.length;i++){var el=ic[i],img=el.querySelector('img');if(!img)continue;
  var c=cols[i]||cols[0],fx=mk('vfx',el),gl=mk('vgl',fx),rg=mk('vrg',fx),sh=mk('vsh',el);
  gl.style.background='radial-gradient(circle,rgba('+c+',.6),rgba('+c+',0) 66%)';
  rg.style.borderColor='rgba('+c+',.9)';
  sh.style.width=img.style.width;sh.style.height=img.style.height;
  sh.style.webkitMaskImage=sh.style.maskImage='url("'+img.src+'")';
  sh.style.backgroundImage='linear-gradient(105deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%)';
  sh.style.backgroundSize='320% 100%';
  var ps=[];for(var k=0;k<9;k++){var p=mk('vp',fx);if(k%3==1)p.style.background='rgb('+c+')';ps.push({e:p,a:k/9*6.2832+i,r:5.5+(k%3)*2.2,s:.8+(k%2)*.7})}
  VI.push({el:el,gl:gl,rg:rg,sh:sh,ps:ps,i:i})}})();
function sprg(x){if(x<=0)return 0;if(x>=1)return 1;return 1-Math.exp(-5.2*x)*Math.cos(x*10.5)}
function iconFx(){if(!VI.length)return;if(t<5.3||t>8.6)return;
 for(var n=0;n<VI.length;n++){var o=VI[n],i=o.i,b=5.95+.45*i,te=t-b,s=sprg(te/.85),
  w=seg(t,b+.8,b+1.4),ph=i*1.7,tm=t+ph,x=0,y=0,r=0,sc=1;
  if(!reduce){
   y=Math.sin(tm*2.1)*.55*w;
   if(i==0){r=Math.sin(tm*2.4)*5*w;x=Math.sin(tm*1.7)*.7*w;y+=Math.cos(tm*1.7)*.5*w}
   else if(i==1){r=Math.sin(tm*1.9)*3.5*w;sc=1+Math.sin(tm*3.1)*.025*w}
   else{r=Math.sin(tm*3)*2*w;sc=1+Math.max(0,Math.sin(tm*2.6))*.05*w}}
  x+=px*.8;y+=py*.5;
  o.el.style.transform='translate('+x.toFixed(2)+'cqw,'+(y+(1-s)*7).toFixed(2)+'cqw) rotate('+(r+(1-s)*-28).toFixed(2)+'deg) scale('+(Math.max(0,s)*sc).toFixed(3)+')';
  o.el.style.opacity=Math.min(1,Math.max(0,te*6+.05)).toFixed(2);
  var pl=.55+.45*Math.sin(t*3+ph),ge=te>0?Math.min(1,te*3):0;
  o.gl.style.opacity=(ge*(.35+.4*pl)).toFixed(2);o.gl.style.transform='scale('+(.9+.25*pl+(te>0&&te<.5?(.5-te):0)).toFixed(3)+')';
  var rt=te>0?(te<.8?te/.8:((t*.45+i*.31)%1)):-1,rs=te<.8?1.6:1;
  if(rt>=0&&(te<.8||w>0)){o.rg.style.opacity=((1-rt)*(te<.8?.9:.45*w)).toFixed(2);o.rg.style.transform='scale('+(.6+rt*rs*1.9).toFixed(3)+')'}else o.rg.style.opacity=0;
  var sp=((t*(i==0?.55:i==1?.4:.5)+i*.27)%1),sa=w*(sp<.5?Math.sin(sp/.5*Math.PI):0);
  o.sh.style.backgroundPosition=(100-sp*200)+'% 0';o.sh.style.opacity=(sa*.95).toFixed(2);
  for(var k=0;k<o.ps.length;k++){var p=o.ps[k],bt=te/.9,bo=0,bx=0,by=0,bs=0;
   if(bt>0&&bt<1){var e=1-Math.pow(1-bt,3);bx=Math.cos(p.a)*p.r*e*1.15;by=Math.sin(p.a)*p.r*e*1.15-bt*1.2;bo=Math.sin(bt*Math.PI);bs=p.s*(1-bt*.4)}
   var tw=0;if(w>0&&!reduce){var q=(t*.9+k*.37+i*.2)%1;tw=w*Math.pow(Math.sin(q*Math.PI),3);if(tw>.02){var ax=((k*53+i*17)%100)/100*2-1,ay=((k*29+i*41)%100)/100*2-1;bx=ax*6.5;by=ay*6.5-q*1.5;bo=tw*.9;bs=.5+tw*.6}}
   if(bo>0.01){p.e.style.opacity=bo.toFixed(2);p.e.style.transform='translate('+bx.toFixed(2)+'cqw,'+by.toFixed(2)+'cqw) scale('+bs.toFixed(2)+') rotate('+(t*90).toFixed(0)+'deg)'}else p.e.style.opacity=0}}}
var WI=[];
(function(){var ks=document.querySelectorAll('.who .pl .sk');
 function mk(c,p){var d=document.createElement('div');d.className=c;p.appendChild(d);return d}
 for(var i=0;i<ks.length;i++){var el=ks[i],img=el.querySelector('img'),fx=mk('wfx',el),gl=mk('wgl',fx),rg=mk('wrg',fx),sh=null,ps=[];
  if(img){sh=mk('wsh',el);sh.style.webkitMaskImage=sh.style.maskImage='url("'+img.src+'")'}
  for(var k=0;k<4;k++)ps.push({e:mk('wp',fx),a:k/4*6.2832+.6+i*.9,r:4+(k%2)*1.3});
  WI.push({el:el,gl:gl,rg:rg,sh:sh,ps:ps,i:i})}})();
function iconFx1(){if(!WI.length||t<2.7||t>5.65)return;
 for(var n=0;n<WI.length;n++){var o=WI[n],i=o.i,te=t-(3.3+.28*i),s=sprg(te/.75),wv=t-(4.6+.2*i),
  hop=(wv>0&&wv<.5)?Math.sin(wv/.5*Math.PI):0,fl=(te>.8&&!reduce)?Math.sin(t*2.4+i*1.3)*.22:0;
  o.el.style.transform='translate('+(px*.3).toFixed(2)+'cqw,'+((1-s)*2.5-hop*.7+fl).toFixed(2)+'cqw) rotate('+((1-s)*-30).toFixed(1)+'deg) scale('+(Math.max(0,s)*(1+hop*.12)).toFixed(3)+')';
  o.el.style.opacity=Math.min(1,Math.max(0,te*8+.05)).toFixed(2);
  var ge=te>0?Math.min(1,te*2.5):0;
  o.gl.style.opacity=(ge*(.3+.2*Math.sin(t*3+i))+hop*.5).toFixed(2);
  var rt=te/.8;if(rt>0&&rt<1){o.rg.style.opacity=((1-rt)*.85).toFixed(2);o.rg.style.transform='scale('+(.6+rt*2.2).toFixed(3)+')'}else o.rg.style.opacity=0;
  if(o.sh){var sw=wv/.55;if(sw>0&&sw<1){o.sh.style.backgroundPosition=(100-sw*200)+'% 0';o.sh.style.opacity=(Math.sin(sw*Math.PI)*.9).toFixed(2)}else o.sh.style.opacity=0}
  for(var k=0;k<o.ps.length;k++){var p=o.ps[k],bt=te/.8;
   if(bt>0&&bt<1){var e=1-Math.pow(1-bt,3);p.e.style.opacity=Math.sin(bt*Math.PI).toFixed(2);p.e.style.transform='translate('+(Math.cos(p.a)*p.r*e).toFixed(2)+'cqw,'+(Math.sin(p.a)*p.r*e-bt*.8).toFixed(2)+'cqw) scale('+(1-bt*.4).toFixed(2)+') rotate('+(bt*120).toFixed(0)+'deg)'}else p.e.style.opacity=0}}}
var CI=[];
(function(){var ks=document.querySelectorAll('.cards .card .ic.stkr'),cols=['80,225,160','255,190,90','255,100,100'];
 function mk(c,p){var d=document.createElement('div');d.className=c;p.appendChild(d);return d}
 for(var i=0;i<ks.length;i++){var el=ks[i],img=el.querySelector('img'),c=cols[i]||cols[0],fx=mk('xfx',el),gl=mk('xgl',fx),rg=mk('xrg',fx),sh=null,ps=[];
  gl.style.background='radial-gradient(circle,rgba('+c+',.6),rgba('+c+',0) 65%)';rg.style.borderColor='rgba('+c+',.95)';
  if(i==2)el.style.transformOrigin='35% 18%';
  if(img&&i!=1){sh=mk('xsh',el);sh.style.webkitMaskImage=sh.style.maskImage='url("'+img.src+'")'}
  for(var k=0;k<5;k++){var p=mk('xp',fx);if(k%2)p.style.background='rgb('+c+')';ps.push({e:p,a:k/5*6.2832+i*.8,r:9+(k%2)*3})}
  CI.push({el:el,gl:gl,rg:rg,sh:sh,ps:ps,i:i})}})();
function iconFx2(){if(!CI.length||u<5||u>10.2)return;
 for(var n=0;n<CI.length;n++){var o=CI[n],i=o.i,b=5.6+.8*i,te=u-b,s=sprg(te/.8),w=seg(u,b+.8,b+1.4),r=0,y=0,ring=-1,cy=0;
  if(!reduce){
   if(i==0){r=Math.sin(u*1.8)*2.5*w;y=Math.sin(u*2)*.8*w}
   else if(i==1){cy=((u-b-.7)%2.2+2.2)%2.2;if(te>.7&&cy<.55)r=Math.sin(cy*50)*9*(1-cy/.55);if(te>.7&&cy<.8)ring=cy/.8}
   else{cy=((u-b-.6)%2.8+2.8)%2.8;if(te>.6)r=Math.sin(cy*7)*10*Math.exp(-cy*1.6)}}
  o.el.style.transform='translate('+(px*.8).toFixed(2)+'cqw,'+(y+(1-s)*5+py*.4).toFixed(2)+'cqw) rotate('+(r+(1-s)*-25).toFixed(2)+'deg) scale('+Math.max(0,s).toFixed(3)+')';
  o.el.style.opacity=Math.min(1,Math.max(0,te*8+.05)).toFixed(2);
  var ge=te>0?Math.min(1,te*2.5):0;o.gl.style.opacity=(ge*(.28+.18*Math.sin(u*3+i))).toFixed(2);
  var rt=te/.9;if(rt>0&&rt<1){o.rg.style.opacity=((1-rt)*.85).toFixed(2);o.rg.style.transform='scale('+(.6+rt*2.2).toFixed(3)+')'}
  else if(ring>=0){o.rg.style.opacity=((1-ring)*.5).toFixed(2);o.rg.style.transform='scale('+(.9+ring*1.6).toFixed(3)+')'}else o.rg.style.opacity=0;
  if(o.sh){var sw=((u-b-1)%2.6+2.6)%2.6/.6;if(te>1&&sw<1){o.sh.style.backgroundPosition=(100-sw*200)+'% 0';o.sh.style.opacity=(Math.sin(sw*Math.PI)*.9).toFixed(2)}else o.sh.style.opacity=0}
  for(var k=0;k<o.ps.length;k++){var p=o.ps[k],bt=te/.85;
   if(bt>0&&bt<1){var e=1-Math.pow(1-bt,3);p.e.style.opacity=Math.sin(bt*Math.PI).toFixed(2);p.e.style.transform='translate('+(Math.cos(p.a)*p.r*e).toFixed(2)+'cqw,'+(Math.sin(p.a)*p.r*e-bt*1.5).toFixed(2)+'cqw) scale('+(1-bt*.4).toFixed(2)+') rotate('+(bt*120).toFixed(0)+'deg)'}else p.e.style.opacity=0}}}
function render(){var M=t,RT=wf(M),inW=RT>=W0&&RT<W0+X,inW2=RT>=W1+X&&RT<W1+X+X2;RTw=RT;MW=M;t=RT<W0?RT:(inW?W0:(RT-X<W1?RT-X:(inW2?W1:RT-X-X2)));render0();nsc(RT);wsc(RT);vsync(M);if(inW2){var wi=Math.min(2,Math.floor((RT-W1-X)/5));if(sc.textContent!==NW[wi])sc.textContent=NW[wi]}iconFx();iconFx1();iconFx2();
 if(RT<W0+X)set('--s2',0);else if(RT<W0+X+.4)set('--s2',seg(RT,W0+X,W0+X+.4)*(1-seg(t,8,8.4)));
 if(RT>=W0&&RT<W0+X+.15)set('--s1',RT<W0+X?1-seg(RT,5.2,5.6):0);
 if(inW){var ni=RT<10.2?0:RT<14.8?1:2;if(sc.textContent!==NS[ni])sc.textContent=NS[ni];
  if(!reduce){set('--m1',Math.sin(RT*.5));set('--m2',Math.cos(RT*.4));set('--fl',Math.sin(RT*1.6))}
  for(var j=0;j<P.length;j++){var q=P[j],y=((q.y*H-RT*q.v)%H+H)%H;q.e.style.transform='translate('+(q.x+Math.sin(RT*.7+q.ph)*2).toFixed(2)+'cqw,'+y.toFixed(2)+'cqw)';q.e.style.opacity=(.2+.3*Math.pow(Math.sin(RT*1.3+q.ph),2)).toFixed(2)}}
 t=M;var DT=Math.min(RT,DR);tm.textContent=M.toFixed(1)+' / '+MD.toFixed(1)+' วินาที';sk.value=Math.min(M,MD);set('--p',(DT/DR*100).toFixed(2))}
function render0(){
 px+=((reduce?0:tx)-px)*.08;py+=((reduce?0:ty)-py)*.08;set('--px',px.toFixed(3));set('--py',py.toFixed(3));
 var T=t<=2.7?t:(t<2.7+SS?2.7:t-SS);T0=T;u=T-O;var scan=seg(u,2,4.8);
 var EN=t>=26.1;set('--lgd',EN?seg(t,26.8,28.3):seg(t,.2,1.5)*(1-seg(t,25.6,26)));set('--au',EN?seg(t,27.2,28.4):seg(t,.4,1.6)*(1-seg(t,25.6,26)));set('--wd',EN?seg(t,27.6,28.6):seg(t,.6,1.3)*(1-seg(t,25.6,26)));set('--lg',EN?0:sp(t,2,2.9));set('--l0',EN?.44:.72);set('--ly0',EN?'3.5cqw':'9.5cqw');set('--rot',(t*50).toFixed(1));
 set('--a',seg(u,-.3,.9));set('--cam',seg(t,0,D));
 var fl=reduce?0:Math.sin(t*1.6),ry=-16+seg(t,0,D)*12+fl*2;
 set('--fl',fl);set('--m1',reduce?0:Math.sin(t*.5));set('--m2',reduce?0:Math.cos(t*.4));
 set('--ha',(145-ry*2.2-px*25).toFixed(1));set('--hx',(50-ry*2.6-px*18).toFixed(1)+'%');set('--hy',(12+fl*6).toFixed(1)+'%');
 set('--scan',scan);set('--scanop',u>2&&u<5.2?K(Math.min(scan*12,(1-scan)*12+(u<4.8?1:0))):0);
 set('--dock',fD(u));set('--c1',f1(u));set('--c2',f2(u));set('--c3',f3(u));
 set('--out',seg(u,9.3,9.9));set('--s4',f4(u));set('--chk',seg(u,9.8,10.8));
 set('--sig',seg(u,3.6,4.8));set('--s1',seg(t,2.8,3.2)*(1-seg(t,5.2,5.6)));for(var qi=1;qi<=4;qi++)set('--q'+qi,sp(t,3.1+.28*(qi-1),3.8+.28*(qi-1)));set('--s2',seg(t,5.3,5.6)*(1-seg(t,8,8.4)));for(var fi=1;fi<=3;fi++)set('--f'+fi,bn(t,5.8+.45*(fi-1),.6));set('--e1',seg(t,5.1,5.6));set('--z',seg(t,21.8,22.4));set('--d0',seg(t,22.3,22.7)*(1-seg(t,25.9,26.3)));set('--dk',seg(t,25.9,26.5));set('--k1',seg(t,28.4,29.1));set('--k2',seg(t,29,29.8));set('--k3',seg(t,29.8,30.4));set('--k4',seg(t,30.2,30.8));set('--bk',seg(t,31.8,32.6));set('--st3',bn(t,22.6,.7));set('--wb',bn(t,23,.6));set('--h3',seg(t,23,23.7));set('--h4',seg(t,23.5,24.2));var sa=soft(t);set('--kx','0cqw');set('--ky',(sa*.45).toFixed(3)+'cqw');set('--i2',1-seg(t,5.5,6));set('--h1',seg(t,2.9,3.6));set('--h2',seg(t,3.3,4));for(var ai=1;ai<=3;ai++){var at=6.95+.4*(ai-1);set('--ac'+ai,seg(t,at,at+.15)*(1-seg(t,at+.35,at+.5)))}set('--sb',seg(u,.45,1)*(1-seg(u,1.75,2.1)));set('--sw',seg(u,.6,1.9));set('--ai',seg(u,7.9,8.5));set('--st',sp(u,4.8,5.35));
 set('--bf',(seg(T,2.75,3)*(1-seg(T,4,4.4))).toFixed(3));set('--fx',Math.max(fxi(t),Math.max(0,1-Math.abs(T-4.28)/.16)*.75,Math.max(0,1-Math.abs(u-4.85)/.12)*.35).toFixed(3));
 set('--x1',sp(u,3.3,3.75));set('--x2',sp(u,3.55,4));set('--x3',sp(u,3.8,4.25));
 set('--gl',((t*.7)%1).toFixed(3));set('--hr',((t*40)%360).toFixed(1));set('--sh',(.5+.5*Math.sin(t*1.3)).toFixed(3));var rg=seg(u,4.85,5.8);set('--rg',rg);set('--rgo',u>4.85?((1-rg)*.8).toFixed(3):0);

 (function(){var a=u-9.3;set('--sb1',seg(u,9.3,9.7));set('--sd',seg(u,9.6,10.1));set('--sr',seg(u,10,10.6));set('--sa',seg(u,9.2,9.6));
  set('--sf',reduce?0:Math.sin(t*6.2832/6).toFixed(3));set('--or',reduce?0:(t*24).toFixed(1));
  var sw=u<11.4?seg(u,10.4,11.4):((t%8.5)/1.1);set('--swp',Math.min(1,Math.max(0,sw)).toFixed(3));set('--sw',(sw>0&&sw<1)?1:0);
  set('--tw',(.55+.45*Math.sin(t*2.1)).toFixed(2))})();
 shake();counter();fin();set('--p',(Math.min(t,D)/D*100).toFixed(2));
 set('--bd',bl(fD));set('--b1',bl(f1));set('--b2',bl(f2));set('--b3',bl(f3));set('--bt',bl(f4));
 var hlOn=u>7.8;
 for(var i=0;i<els.length;i++){var e=els[i],c=e.classList,h=c.contains('ok')||c.contains('warn')||c.contains('risk');
  c.toggle('lit',(pos[i]||0)<scan&&!hlOn);c.toggle('on',hlOn&&h)}
 for(var j=0;j<P.length;j++){var q=P[j],y=((q.y*H-t*q.v)%H+H)%H;
  q.e.style.transform='translate('+(q.x+Math.sin(t*.7+q.ph)*2).toFixed(2)+'cqw,'+y.toFixed(2)+'cqw)';
  q.e.style.opacity=(.2+.3*Math.pow(Math.sin(t*1.3+q.ph),2)).toFixed(2)}
 var n=t>26.1?9:t>22.2?8:t<2.8?0:t<5.5?6:t<8.3?7:T<O?1:u<2?2:u<5?3:u<9?4:5;
 if(sc.textContent!==names[n])sc.textContent=names[n];
 var ci=-1,inw=(RTw>=W0&&RTw<W0+X)||(RTw>=W1+X&&RTw<W1+X+X2);for(var k=0;k<VC.length;k++)if(MW>=VC[k][0]&&MW<VC[k][1]){ci=k+(inw?100:0);break}
 if(ci!==capIdx){capIdx=ci;if(ci>=0){cap.classList.remove('show');cap.classList.toggle('w',ci>=100);cap.innerHTML=VC[ci%100][2].split(' ').map(function(w,i){return '<span style="transition-delay:'+(i*.09).toFixed(2)+'s">'+w+'</span>'}).join(' ');void cap.offsetWidth;cap.classList.add('show')}else cap.classList.remove('show')}
 tm.textContent=Math.min(t,D).toFixed(1)+' / '+D+' วินาที';
 sk.value=Math.min(t,D);
}
function tick(now){
 var dt=Math.min(.1,(now-last)/1000);last=now;
 if(playing){var a=t,ta=(sfx&&AC&&AC.state==='running'&&vsrc&&vbuf&&a<vbuf.duration-.1)?AC.currentTime-vstart:-1;t=(ta>=0&&Math.abs(ta-a)<1.5)?ta:a+dt;if(t>MD+1){t=0;stopSweep()}else sfxCheck(wf(a),wf(t))}
 if(!lite||now-lr>=32){lr=now;render()}requestAnimationFrame(tick);
}
function setPlay(v){playing=v;pp.textContent=v?'หยุด':'เล่น';if(!v)stopSweep()}
setPlay(playing);
pp.onclick=function(){setPlay(!playing)};
document.getElementById('rp').onclick=function(){stopSweep();t=0;setPlay(true)};
sn.onclick=function(){sfx=!sfx;sn.setAttribute('aria-pressed',sfx);sn.textContent='เสียง: '+(sfx?'เปิด':'ปิด');
 if(sfx){if(!ensure()){sfx=false;sn.textContent='เสียง: ปิด';return}chime(1318,.08)}else stopSweep()};
/*VOJS*/var NW=['ฉากที่ 5 ตัวอย่างคำแนะนำ','ฉากที่ 6 แยกสีตามความเสี่ยง','ฉากที่ 7 ตัดสินใจด้วยตัวคุณเอง'];
function wsc(R){set('--wo',0);for(var i=0;i<3;i++)set('--ws'+i,0);return;var b=W1+X;set('--wo',seg(R,b-.2,b+.2)*(1-seg(R,b+X2-.2,b+X2+.2)));for(var i=0;i<3;i++){var a=b+i*5;set('--ws'+i,seg(R,a+.15,a+.65)*(1-seg(R,a+4.45,a+4.9)))}}
var VURL='audio/vo.mp3',vbuf=null,vld=false,vsrc=null,vstart=0,vg=null;
function vload(){if(vbuf||vld||!AC)return;vld=true;try{fetch(VURL).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(buf){AC.decodeAudioData(buf,function(b){vbuf=b},function(){vld=false})}).catch(function(){vld=false})}catch(x){vld=false}}
function vstop(){if(vsrc){try{vsrc.stop()}catch(x){}vsrc=null}}
function vsync(R){if(sfx&&playing&&AC&&vbuf&&R<vbuf.duration){if(!vsrc||Math.abs(AC.currentTime-vstart-R)>.6){vstop();if(!vg){vg=AC.createGain();vg.gain.value=1.5;vg.connect(AC.destination)}vsrc=AC.createBufferSource();vsrc.buffer=vbuf;vsrc.connect(vg);vsrc.start(0,Math.max(0,R));vstart=AC.currentTime-R}}else vstop()}
sn.addEventListener('click',function(){if(sfx)vload()});
sk.oninput=function(){t=parseFloat(sk.value);setPlay(false)};
var fsb=document.getElementById('fs'),de=document.documentElement,body=document.body;
function isPortrait(){return innerHeight>innerWidth||(EMB&&innerWidth<640&&!document.fullscreenElement)}
function leave(){body.classList.remove('rot');fsb.textContent='เต็มจอ';try{if(document.fullscreenElement)document.exitFullscreen();if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}setTimeout(measure,60)}
function enter(){var p=null;try{if(de.requestFullscreen)p=de.requestFullscreen()}catch(e){}
 Promise.resolve(p).then(function(){return screen.orientation&&screen.orientation.lock?screen.orientation.lock('landscape'):0}).catch(function(){}).then(function(){setTimeout(function(){if(isPortrait())body.classList.add('rot');fsb.textContent='ออก';measure()},350)})}
fsb.onclick=function(){if(fsb.textContent==='ออก')leave();else enter()};
addEventListener('resize',function(){if(body.classList.contains('rot')&&!isPortrait())body.classList.remove('rot')});
var bar=document.querySelector('.bar'),lbl=document.querySelector('.lbl');
function place(){var out=isPortrait()&&!body.classList.contains('rot');if(out&&bar.parentNode===st){body.insertBefore(bar,lbl);bar.classList.add('out');measure()}else if(!out&&bar.parentNode!==st){st.appendChild(bar);bar.classList.remove('out');measure()}}
addEventListener('resize',place);addEventListener('orientationchange',place);new MutationObserver(place).observe(body,{attributes:true,attributeFilter:['class']});place();
measure();window.addEventListener('load',measure);window.addEventListener('resize',measure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
var sv=null;try{sv=localStorage.getItem('vc-lite')}catch(e){}
setLite(sv!==null?sv==='1':((window.matchMedia&&matchMedia('(pointer:coarse)').matches)||innerWidth<820||(navigator.hardwareConcurrency||8)<=4));
requestAnimationFrame(function(n){last=n;tick(n)});
if(EMB){var lastH=0;function sendH(){if(document.fullscreenElement||body.classList.contains('rot'))return;var h=Math.ceil(body.getBoundingClientRect().height);if(h&&h!==lastH){lastH=h;try{parent.postMessage({type:'vc-height',h:h},location.origin)}catch(e){}}}
 if(window.ResizeObserver)new ResizeObserver(sendH).observe(body);addEventListener('resize',sendH);document.addEventListener('fullscreenchange',function(){lastH=0;setTimeout(sendH,200)});sendH()}
})();
