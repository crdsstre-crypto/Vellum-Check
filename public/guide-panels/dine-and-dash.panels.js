// ภาพช่องการ์ตูนของคู่มือ dine-and-dash
VCPanels({
// [ภาพประกอบสไตล์คอมิกส์ เส้นความเร็ว พื้นหลังลายเส้นแอ็กชัน โต๊ะร้านก๋วยเตี๋ยวแดง] ลูกค้าวิ่งออกประตูทิ้งชามเปล่า พนักงานถือบิลตกใจ (น้องม้วนซ้าย)
 ddnoodleshop:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
 var r='<g transform="translate('+x+' '+y+') scale('+(o.f?-s:s)+' '+s+')">';
 if(hs==='long')r+='<path d="M-20 -2q-3-22 20-22q23 0 20 22v30q-7 5-10 0v-26q-10-8-20 0v26q-3 5-10 0z" fill="'+hc+'"/>';
 r+='<path d="M-27 66q-1-38 27-40q28 2 27 40z" fill="'+sh+'"/><path d="M-27 66q-1-38 27-40q9 1 14 5q-18 4-21 35z" fill="#fff" opacity=".13"/><path d="M9 29q18 6 18 37h-9q0-25-9-37z" fill="#000" opacity=".13"/>';
 if(o.ap)r+='<path d="M-15 66v-24q15 6 30 0v24z" fill="'+o.ap+'"/><path d="M-15 42q15 6 30 0" stroke="#000" stroke-opacity=".12" stroke-width="1.5" fill="none"/>';
 r+='<path d="M-7 17h14v11q-7 5-14 0z" fill="'+sd+'"/><path d="M-10 27l10 8 10-8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linejoin="round"/>';
 r+='<ellipse cx="-17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><ellipse cx="17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><circle r="17.6" fill="'+sk+'"/><path d="M8 -13q12 11 4 27q-6 6-16 6q14-10 12-33z" fill="'+sd+'" opacity=".42"/>';
 if(hs==='cap')r+='<path d="M-18 -2q-1-9 3-12h30q4 3 3 12q-3-5-18-5t-18 5z" fill="'+hc+'"/><path d="M-19 -5q0-20 19-20t19 20z" fill="'+(o.cap||'#e0563a')+'"/><path d="M0 -8h25q4 3-2 6H0z" fill="'+(o.cap||'#e0563a')+'"/><path d="M-12 -17q8-6 18-3" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else if(hs==='bob'||hs==='long')r+='<path d="M-19.5 9q-5-33 19.5-33t19.5 33q-4-5-4-13q-5-10-15.5-10q-6 0-9 4q-4 6-11 7q0 8-3 12z" fill="'+hc+'"/><path d="M-6 -20q9-3 16 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else{r+='<path d="M-18.5 -1q-3-22 18.5-23q21.5 1 18.5 23q-3-9-9-12q-6 5-18 5q-7 0-10 7z" fill="'+hc+'"/><path d="M-6 -20q9-3 15 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';if(hs==='bun')r+='<circle cx="2" cy="-23" r="7.5" fill="'+hc+'"/><circle cx="0" cy="-25" r="2" fill="#fff" opacity=".2"/>';}
 var br=function(d){return '<path d="'+d+'" stroke="'+hc+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';},m=function(d,f){return f?'<path d="'+d+'" fill="#9b3b3b" stroke="#7a2a2a" stroke-width=".8"/>':'<path d="'+d+'" stroke="#9b3b3b" stroke-width="1.7" fill="none" stroke-linecap="round"/>';};
 var ey='<ellipse cx="-7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><ellipse cx="7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><circle cx="-6.2" cy="0" r=".85" fill="#fff"/><circle cx="7.8" cy="0" r=".85" fill="#fff"/>';
 if(e==='happy')r+='<path d="M-10 1q3-3.4 6 0M4 1q3-3.4 6 0" stroke="'+ink+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>'+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5.5 8q5.5 7 11 0z',1);
 else if(e==='worried')r+=ey+br('M-10.5 -4.5l6-2.6M10.5 -4.5l-6-2.6')+m('M-4 11q4-3.4 8 0')+'<path d="M15 -9q3 5 0 7q-3-2 0-7z" fill="#9fd8ff"/>';
 else if(e==='angry')r+=ey+'<path d="M-11.5 -7.5l7.5 3.2M11.5 -7.5l-7.5 3.2" stroke="'+hc+'" stroke-width="2.4" stroke-linecap="round"/>'+m('M-5 11q5-4.5 10 0');
 else if(e==='shock')r+='<circle cx="-7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="-7" cy="1.4" r="1.5" fill="'+ink+'"/><circle cx="7" cy="1.4" r="1.5" fill="'+ink+'"/>'+br('M-11 -8q4-3 8-1M3 -9q4-2 8 1')+'<ellipse cy="10.5" rx="3.2" ry="3.8" fill="#7a2a2a"/>';
 else if(e==='sneaky')r+='<path d="M-10.5 -.5h7M3.5 -.5h7" stroke="'+ink+'" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="-5" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/><ellipse cx="9" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/>'+br('M-10 -4l6 1M4 -3l6-2')+m('M-3 9q4 2.6 7-2');
 else if(e==='pain')r+='<path d="M-10 -1.5l5 2.5-5 2.5M10 -1.5l-5 2.5 5 2.5" stroke="'+ink+'" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+br('M-10.5 -5l6-2M10.5 -5l-6-2')+m('M-4 10q2-2 4 0t4 0');
 else if(e==='smile')r+=ey+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5 8.5q5 5 10 0');
 else r+=ey+br('M-10 -6q3-1.6 6-.6M4 -6.6q3-1 6 .6')+m('M-3.5 9.5q3.5 1.8 7 0');
 r+='<ellipse cx="-10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><ellipse cx="10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><path d="M0 3.5q1 3-1 4" stroke="'+sd+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
 if(o.gl)r+='<g fill="#fff" fill-opacity=".18" stroke="#2a2a2a" stroke-width="1.3"><rect x="-12.5" y="-3.5" width="10" height="8" rx="3"/><rect x="2.5" y="-3.5" width="10" height="8" rx="3"/></g><path d="M-2.5 0h5" stroke="#2a2a2a" stroke-width="1.2"/>';
 var a=o.a;if(a==='phone')r+='<path d="M20 64q4-20-8-24" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><g transform="rotate(-8 8 38)"><rect x="1" y="26" width="12" height="20" rx="2.4" fill="#1f2937"/><rect x="2.6" y="28.4" width="8.8" height="14" rx="1" fill="'+(o.ph||'#7dd3fc')+'"/></g><circle cx="12" cy="40" r="4.2" fill="'+sk+'"/>';
 else if(a==='up')r+='<path d="M21 52q12-22 8-42" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="29" cy="7" r="4.8" fill="'+sk+'"/>';
 else if(a==='point')r+='<path d="M20 50q15-6 26-11" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="47" cy="38" r="4.3" fill="'+sk+'"/><path d="M50 37l7-2" stroke="'+sk+'" stroke-width="3" stroke-linecap="round"/>';
 else if(a==='hold')r+='<path d="M-20 64q-2-18 8-22M20 64q2-18-8-22" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="-11" cy="42" r="4.2" fill="'+sk+'"/><circle cx="11" cy="42" r="4.2" fill="'+sk+'"/>';
 return r+'</g>';};
  var sp='';for(var i=0;i<14;i++)sp+='<path d="M360 '+(60+i*8)+'L'+(250-i*6)+' '+(100+i*3)+'" stroke="#fde68a" stroke-width="1.2" opacity=".6"/>';
  return '<rect width="360" height="180" fill="#fff7d6"/>'+sp+'<rect x="90" y="150" width="270" height="30" fill="#b91c1c" opacity=".9"/>'+
  // โต๊ะและชาม
  '<rect x="100" y="128" width="78" height="6" rx="2" fill="#dc2626"/><path d="M106 134v22M172 134v22" stroke="#7f1d1d" stroke-width="3"/>'+
  '<g transform="translate(118 116)"><path d="M0 0h28q-2 12-14 12T0 0z" fill="#fff" stroke="#7f1d1d" stroke-width="1.4"/><path d="M18 -14l10 12M22 -14l8 12" stroke="#a16207" stroke-width="1.6"/></g><g transform="translate(150 118)"><path d="M0 0h22q-2 10-11 10T0 0z" fill="#fff" stroke="#7f1d1d" stroke-width="1.4"/></g>'+
  '<g class="cm-steam2" stroke="#d6d3d1" fill="none" stroke-width="1.4"><path d="M126 110q-3-5 0-9M134 110q-3-5 0-9"/></g>'+
  // ประตูและคนวิ่ง
  '<rect x="300" y="62" width="50" height="88" fill="#7f1d1d"/><rect x="304" y="66" width="42" height="84" fill="#fde68a" opacity=".5"/>'+
  '<g class="cm-vibx">'+PR(324,112,.72,{hs:'cap',cap:'#111',h:'#111',c:'#2563eb',e:'sneaky'})+'</g>'+
  '<path d="M286 96h-18M290 108h-24M286 120h-16" stroke="#111" stroke-width="2" stroke-linecap="round"/>'+
  PR(218,112,.82,{hs:'short',h:'#1a1410',c:'#fff',ap:'#b91c1c',e:'shock',a:'hold'})+
  '<g transform="translate(236 126) rotate(-8)"><rect width="18" height="24" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="M3 6h12M3 10h12M3 14h8" stroke="#94a3b8"/><text x="9" y="21.5" text-anchor="middle" font-size="5" font-weight="900" fill="#b91c1c" font-family="sans-serif">฿480</text></g>';},
// [ภาพประกอบแสงเงาตัดจัดแบบภาพเขียนคลาสสิก บาร์มืด โคมไฟเหนือเคาน์เตอร์] ลูกค้ากำมือถือหลบ บาร์เทนเดอร์ยื่นมือไม่แย่ง ประตูเปิดโล่งไม่ล็อก (น้องม้วนขวา)
 ddbarstool:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
 var r='<g transform="translate('+x+' '+y+') scale('+(o.f?-s:s)+' '+s+')">';
 if(hs==='long')r+='<path d="M-20 -2q-3-22 20-22q23 0 20 22v30q-7 5-10 0v-26q-10-8-20 0v26q-3 5-10 0z" fill="'+hc+'"/>';
 r+='<path d="M-27 66q-1-38 27-40q28 2 27 40z" fill="'+sh+'"/><path d="M-27 66q-1-38 27-40q9 1 14 5q-18 4-21 35z" fill="#fff" opacity=".13"/><path d="M9 29q18 6 18 37h-9q0-25-9-37z" fill="#000" opacity=".13"/>';
 if(o.ap)r+='<path d="M-15 66v-24q15 6 30 0v24z" fill="'+o.ap+'"/><path d="M-15 42q15 6 30 0" stroke="#000" stroke-opacity=".12" stroke-width="1.5" fill="none"/>';
 r+='<path d="M-7 17h14v11q-7 5-14 0z" fill="'+sd+'"/><path d="M-10 27l10 8 10-8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linejoin="round"/>';
 r+='<ellipse cx="-17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><ellipse cx="17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><circle r="17.6" fill="'+sk+'"/><path d="M8 -13q12 11 4 27q-6 6-16 6q14-10 12-33z" fill="'+sd+'" opacity=".42"/>';
 if(hs==='cap')r+='<path d="M-18 -2q-1-9 3-12h30q4 3 3 12q-3-5-18-5t-18 5z" fill="'+hc+'"/><path d="M-19 -5q0-20 19-20t19 20z" fill="'+(o.cap||'#e0563a')+'"/><path d="M0 -8h25q4 3-2 6H0z" fill="'+(o.cap||'#e0563a')+'"/><path d="M-12 -17q8-6 18-3" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else if(hs==='bob'||hs==='long')r+='<path d="M-19.5 9q-5-33 19.5-33t19.5 33q-4-5-4-13q-5-10-15.5-10q-6 0-9 4q-4 6-11 7q0 8-3 12z" fill="'+hc+'"/><path d="M-6 -20q9-3 16 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else{r+='<path d="M-18.5 -1q-3-22 18.5-23q21.5 1 18.5 23q-3-9-9-12q-6 5-18 5q-7 0-10 7z" fill="'+hc+'"/><path d="M-6 -20q9-3 15 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';if(hs==='bun')r+='<circle cx="2" cy="-23" r="7.5" fill="'+hc+'"/><circle cx="0" cy="-25" r="2" fill="#fff" opacity=".2"/>';}
 var br=function(d){return '<path d="'+d+'" stroke="'+hc+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';},m=function(d,f){return f?'<path d="'+d+'" fill="#9b3b3b" stroke="#7a2a2a" stroke-width=".8"/>':'<path d="'+d+'" stroke="#9b3b3b" stroke-width="1.7" fill="none" stroke-linecap="round"/>';};
 var ey='<ellipse cx="-7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><ellipse cx="7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><circle cx="-6.2" cy="0" r=".85" fill="#fff"/><circle cx="7.8" cy="0" r=".85" fill="#fff"/>';
 if(e==='happy')r+='<path d="M-10 1q3-3.4 6 0M4 1q3-3.4 6 0" stroke="'+ink+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>'+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5.5 8q5.5 7 11 0z',1);
 else if(e==='worried')r+=ey+br('M-10.5 -4.5l6-2.6M10.5 -4.5l-6-2.6')+m('M-4 11q4-3.4 8 0')+'<path d="M15 -9q3 5 0 7q-3-2 0-7z" fill="#9fd8ff"/>';
 else if(e==='angry')r+=ey+'<path d="M-11.5 -7.5l7.5 3.2M11.5 -7.5l-7.5 3.2" stroke="'+hc+'" stroke-width="2.4" stroke-linecap="round"/>'+m('M-5 11q5-4.5 10 0');
 else if(e==='shock')r+='<circle cx="-7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="-7" cy="1.4" r="1.5" fill="'+ink+'"/><circle cx="7" cy="1.4" r="1.5" fill="'+ink+'"/>'+br('M-11 -8q4-3 8-1M3 -9q4-2 8 1')+'<ellipse cy="10.5" rx="3.2" ry="3.8" fill="#7a2a2a"/>';
 else if(e==='sneaky')r+='<path d="M-10.5 -.5h7M3.5 -.5h7" stroke="'+ink+'" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="-5" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/><ellipse cx="9" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/>'+br('M-10 -4l6 1M4 -3l6-2')+m('M-3 9q4 2.6 7-2');
 else if(e==='pain')r+='<path d="M-10 -1.5l5 2.5-5 2.5M10 -1.5l-5 2.5 5 2.5" stroke="'+ink+'" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+br('M-10.5 -5l6-2M10.5 -5l-6-2')+m('M-4 10q2-2 4 0t4 0');
 else if(e==='smile')r+=ey+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5 8.5q5 5 10 0');
 else r+=ey+br('M-10 -6q3-1.6 6-.6M4 -6.6q3-1 6 .6')+m('M-3.5 9.5q3.5 1.8 7 0');
 r+='<ellipse cx="-10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><ellipse cx="10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><path d="M0 3.5q1 3-1 4" stroke="'+sd+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
 if(o.gl)r+='<g fill="#fff" fill-opacity=".18" stroke="#2a2a2a" stroke-width="1.3"><rect x="-12.5" y="-3.5" width="10" height="8" rx="3"/><rect x="2.5" y="-3.5" width="10" height="8" rx="3"/></g><path d="M-2.5 0h5" stroke="#2a2a2a" stroke-width="1.2"/>';
 var a=o.a;if(a==='phone')r+='<path d="M20 64q4-20-8-24" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><g transform="rotate(-8 8 38)"><rect x="1" y="26" width="12" height="20" rx="2.4" fill="#1f2937"/><rect x="2.6" y="28.4" width="8.8" height="14" rx="1" fill="'+(o.ph||'#7dd3fc')+'"/></g><circle cx="12" cy="40" r="4.2" fill="'+sk+'"/>';
 else if(a==='up')r+='<path d="M21 52q12-22 8-42" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="29" cy="7" r="4.8" fill="'+sk+'"/>';
 else if(a==='point')r+='<path d="M20 50q15-6 26-11" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="47" cy="38" r="4.3" fill="'+sk+'"/><path d="M50 37l7-2" stroke="'+sk+'" stroke-width="3" stroke-linecap="round"/>';
 else if(a==='hold')r+='<path d="M-20 64q-2-18 8-22M20 64q2-18-8-22" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="-11" cy="42" r="4.2" fill="'+sk+'"/><circle cx="11" cy="42" r="4.2" fill="'+sk+'"/>';
 return r+'</g>';};
  return '<defs><radialGradient id="dbl'+k+'" cx=".5" cy=".35" r=".55"><stop offset="0" stop-color="#f5c77e" stop-opacity=".85"/><stop offset="1" stop-color="#1a0f08" stop-opacity="0"/></radialGradient></defs>'+
  '<rect width="360" height="180" fill="#1a0f08"/><ellipse cx="140" cy="100" rx="140" ry="90" fill="url(#dbl'+k+')"/>'+
  '<path d="M140 56v18" stroke="#3b2414" stroke-width="2"/><path d="M128 74h24l-5 8h-14z" fill="#6b4226"/>'+
  '<g fill="#3b2414" opacity=".9"><rect x="14" y="70" width="60" height="4"/><rect x="14" y="92" width="60" height="4"/></g><g fill="#a16207" opacity=".8"><rect x="18" y="58" width="6" height="12"/><rect x="30" y="60" width="6" height="10" fill="#15803d"/><rect x="44" y="56" width="6" height="14" fill="#7f1d1d"/><rect x="20" y="80" width="6" height="12" fill="#1e40af"/></g>'+
  '<rect x="0" y="140" width="270" height="10" fill="#6b4226"/><rect x="0" y="150" width="270" height="30" fill="#3b2414"/>'+
  // ประตูเปิด
  '<g transform="translate(210 70)"><rect width="44" height="70" fill="#2a1a0e" stroke="#6b4226" stroke-width="2"/><path d="M0 0l-14 6v70l14-6z" fill="#4b2e1a"/><text x="22" y="40" text-anchor="middle" font-size="7" font-weight="900" fill="#f5c77e" font-family="sans-serif">ไม่ล็อก</text></g>'+
  PR(100,112,.82,{hs:'short',h:'#0f0a05',c:'#f8fafc',ap:'#111',e:'calm',a:'point'})+
  PR(170,114,.8,{hs:'long',h:'#3b2414',c:'#7c3aed',e:'worried',a:'phone',ph:'#bfdbfe',f:1})+
  '<g class="cm-pop"><circle cx="140" cy="98" r="9" fill="#fff" stroke="#dc2626" stroke-width="2"/><path d="M134 92l12 12" stroke="#dc2626" stroke-width="2"/><rect x="137" y="93" width="6" height="10" rx="1" fill="#334155"/></g>';},
// [ภาพประกอบน่ารักพาสเทลสไตล์คาวาอิ ลายจุดหัวใจเล็ก ๆ] ซ้าย: ป้าย "บุฟเฟต์ จ่ายก่อนทาน" ขวา: พนักงานรับเงินมัดจำจากลูกค้าโต๊ะใหญ่ยิ้ม (น้องม้วนกลาง)
 ddbuffetline:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
 var r='<g transform="translate('+x+' '+y+') scale('+(o.f?-s:s)+' '+s+')">';
 if(hs==='long')r+='<path d="M-20 -2q-3-22 20-22q23 0 20 22v30q-7 5-10 0v-26q-10-8-20 0v26q-3 5-10 0z" fill="'+hc+'"/>';
 r+='<path d="M-27 66q-1-38 27-40q28 2 27 40z" fill="'+sh+'"/><path d="M-27 66q-1-38 27-40q9 1 14 5q-18 4-21 35z" fill="#fff" opacity=".13"/><path d="M9 29q18 6 18 37h-9q0-25-9-37z" fill="#000" opacity=".13"/>';
 if(o.ap)r+='<path d="M-15 66v-24q15 6 30 0v24z" fill="'+o.ap+'"/><path d="M-15 42q15 6 30 0" stroke="#000" stroke-opacity=".12" stroke-width="1.5" fill="none"/>';
 r+='<path d="M-7 17h14v11q-7 5-14 0z" fill="'+sd+'"/><path d="M-10 27l10 8 10-8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linejoin="round"/>';
 r+='<ellipse cx="-17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><ellipse cx="17.6" cy="2" rx="3.6" ry="4.6" fill="'+sd+'"/><circle r="17.6" fill="'+sk+'"/><path d="M8 -13q12 11 4 27q-6 6-16 6q14-10 12-33z" fill="'+sd+'" opacity=".42"/>';
 if(hs==='cap')r+='<path d="M-18 -2q-1-9 3-12h30q4 3 3 12q-3-5-18-5t-18 5z" fill="'+hc+'"/><path d="M-19 -5q0-20 19-20t19 20z" fill="'+(o.cap||'#e0563a')+'"/><path d="M0 -8h25q4 3-2 6H0z" fill="'+(o.cap||'#e0563a')+'"/><path d="M-12 -17q8-6 18-3" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else if(hs==='bob'||hs==='long')r+='<path d="M-19.5 9q-5-33 19.5-33t19.5 33q-4-5-4-13q-5-10-15.5-10q-6 0-9 4q-4 6-11 7q0 8-3 12z" fill="'+hc+'"/><path d="M-6 -20q9-3 16 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else{r+='<path d="M-18.5 -1q-3-22 18.5-23q21.5 1 18.5 23q-3-9-9-12q-6 5-18 5q-7 0-10 7z" fill="'+hc+'"/><path d="M-6 -20q9-3 15 2" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>';if(hs==='bun')r+='<circle cx="2" cy="-23" r="7.5" fill="'+hc+'"/><circle cx="0" cy="-25" r="2" fill="#fff" opacity=".2"/>';}
 var br=function(d){return '<path d="'+d+'" stroke="'+hc+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';},m=function(d,f){return f?'<path d="'+d+'" fill="#9b3b3b" stroke="#7a2a2a" stroke-width=".8"/>':'<path d="'+d+'" stroke="#9b3b3b" stroke-width="1.7" fill="none" stroke-linecap="round"/>';};
 var ey='<ellipse cx="-7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><ellipse cx="7" cy="1" rx="2.2" ry="2.8" fill="'+ink+'"/><circle cx="-6.2" cy="0" r=".85" fill="#fff"/><circle cx="7.8" cy="0" r=".85" fill="#fff"/>';
 if(e==='happy')r+='<path d="M-10 1q3-3.4 6 0M4 1q3-3.4 6 0" stroke="'+ink+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>'+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5.5 8q5.5 7 11 0z',1);
 else if(e==='worried')r+=ey+br('M-10.5 -4.5l6-2.6M10.5 -4.5l-6-2.6')+m('M-4 11q4-3.4 8 0')+'<path d="M15 -9q3 5 0 7q-3-2 0-7z" fill="#9fd8ff"/>';
 else if(e==='angry')r+=ey+'<path d="M-11.5 -7.5l7.5 3.2M11.5 -7.5l-7.5 3.2" stroke="'+hc+'" stroke-width="2.4" stroke-linecap="round"/>'+m('M-5 11q5-4.5 10 0');
 else if(e==='shock')r+='<circle cx="-7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="7" cy="1" r="3.6" fill="#fff" stroke="'+ink+'" stroke-width="1.2"/><circle cx="-7" cy="1.4" r="1.5" fill="'+ink+'"/><circle cx="7" cy="1.4" r="1.5" fill="'+ink+'"/>'+br('M-11 -8q4-3 8-1M3 -9q4-2 8 1')+'<ellipse cy="10.5" rx="3.2" ry="3.8" fill="#7a2a2a"/>';
 else if(e==='sneaky')r+='<path d="M-10.5 -.5h7M3.5 -.5h7" stroke="'+ink+'" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="-5" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/><ellipse cx="9" cy="1.6" rx="1.7" ry="1.6" fill="'+ink+'"/>'+br('M-10 -4l6 1M4 -3l6-2')+m('M-3 9q4 2.6 7-2');
 else if(e==='pain')r+='<path d="M-10 -1.5l5 2.5-5 2.5M10 -1.5l-5 2.5 5 2.5" stroke="'+ink+'" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+br('M-10.5 -5l6-2M10.5 -5l-6-2')+m('M-4 10q2-2 4 0t4 0');
 else if(e==='smile')r+=ey+br('M-10 -6q3-2 6-1M4 -7q3-1 6 1')+m('M-5 8.5q5 5 10 0');
 else r+=ey+br('M-10 -6q3-1.6 6-.6M4 -6.6q3-1 6 .6')+m('M-3.5 9.5q3.5 1.8 7 0');
 r+='<ellipse cx="-10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><ellipse cx="10.5" cy="7.5" rx="3.6" ry="2.1" fill="#ff8f8f" opacity=".33"/><path d="M0 3.5q1 3-1 4" stroke="'+sd+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
 if(o.gl)r+='<g fill="#fff" fill-opacity=".18" stroke="#2a2a2a" stroke-width="1.3"><rect x="-12.5" y="-3.5" width="10" height="8" rx="3"/><rect x="2.5" y="-3.5" width="10" height="8" rx="3"/></g><path d="M-2.5 0h5" stroke="#2a2a2a" stroke-width="1.2"/>';
 var a=o.a;if(a==='phone')r+='<path d="M20 64q4-20-8-24" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><g transform="rotate(-8 8 38)"><rect x="1" y="26" width="12" height="20" rx="2.4" fill="#1f2937"/><rect x="2.6" y="28.4" width="8.8" height="14" rx="1" fill="'+(o.ph||'#7dd3fc')+'"/></g><circle cx="12" cy="40" r="4.2" fill="'+sk+'"/>';
 else if(a==='up')r+='<path d="M21 52q12-22 8-42" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="29" cy="7" r="4.8" fill="'+sk+'"/>';
 else if(a==='point')r+='<path d="M20 50q15-6 26-11" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="47" cy="38" r="4.3" fill="'+sk+'"/><path d="M50 37l7-2" stroke="'+sk+'" stroke-width="3" stroke-linecap="round"/>';
 else if(a==='hold')r+='<path d="M-20 64q-2-18 8-22M20 64q2-18-8-22" stroke="'+sh+'" stroke-width="8.5" fill="none" stroke-linecap="round"/><circle cx="-11" cy="42" r="4.2" fill="'+sk+'"/><circle cx="11" cy="42" r="4.2" fill="'+sk+'"/>';
 return r+'</g>';};
  var dots='';for(var i=0;i<22;i++)dots+='<circle cx="'+((i*47)%360)+'" cy="'+(10+(i*29)%150)+'" r="2" fill="#f9a8d4" opacity=".5"/>';
  return '<rect width="360" height="180" fill="#fdf2f8"/>'+dots+'<rect y="152" width="360" height="28" fill="#c4b5fd"/><rect y="150" width="360" height="3" fill="#a78bfa"/>'+
  '<g transform="translate(78 74)"><rect width="62" height="54" rx="12" fill="#fff" stroke="#f472b6" stroke-width="2.4"/><text x="31" y="20" text-anchor="middle" font-size="8" font-weight="900" fill="#db2777" font-family="sans-serif">บุฟเฟต์</text><text x="31" y="33" text-anchor="middle" font-size="6.6" font-weight="800" fill="#6d28d9" font-family="sans-serif">จ่ายก่อนทาน</text><text x="31" y="45" text-anchor="middle" font-size="6.6" font-weight="800" fill="#6d28d9" font-family="sans-serif">โต๊ะ 6+ มัดจำ</text></g>'+
  '<path d="M109 128v22" stroke="#f472b6" stroke-width="3"/>'+
  '<g class="cm-bob"><path d="M150 82c-3-5-10-2-8 3l8 8 8-8c2-5-5-8-8-3z" fill="#f472b6"/></g>'+
  PR(256,110,.82,{hs:'bob',h:'#7c2d12',c:'#fff',ap:'#f472b6',e:'happy',a:'hold'})+
  '<g transform="translate(274 124)"><rect width="22" height="13" rx="2" fill="#86efac" stroke="#15803d"/><text x="11" y="10" text-anchor="middle" font-size="8" font-weight="900" fill="#15803d" font-family="sans-serif">฿</text></g>'+
  PR(322,112,.82,{hs:'short',h:'#1a1410',c:'#60a5fa',e:'smile',f:1});}
});
