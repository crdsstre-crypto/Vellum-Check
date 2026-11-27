// ภาพช่องการ์ตูนของคู่มือ market-stall-rent
VCPanels({
// [ภาพประกอบงานวัดไทย ธงราวหลากสี สีสดจัด ผ้าใบแผงลายทาง] แม่ค้าแผงขนมหน้าเศร้า เจ้าของตลาดถือป้าย "ออกพรุ่งนี้!" (น้องม้วนซ้าย)
 msnightmarket:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var fl='';var cols=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899'];for(var i=0;i<13;i++)fl+='<path d="M'+(92+i*21)+' '+(62+(i%2)*2)+'l10 0-5 9z" fill="'+cols[i%6]+'"/>';
  return '<rect width="360" height="180" fill="#fff1d6"/><path d="M90 62q135 8 270 0" stroke="#7c2d12" stroke-width="1" fill="none"/>'+fl+
  '<g transform="translate(110 88)"><path d="M0 0h110l-10-16H10z" fill="#ef4444"/><g fill="#fff"><path d="M18 -16l-4 16h12l2-16z"/><path d="M46 -16l-2 16h12v-16z"/><path d="M74 -16l2 16h12l-4-16z"/></g><rect x="4" y="0" width="102" height="54" fill="#fde68a"/><rect x="4" y="34" width="102" height="20" fill="#d97706"/>'+
   '<g fill="#f472b6"><circle cx="20" cy="30" r="5"/><circle cx="32" cy="30" r="5" fill="#a3e635"/><circle cx="44" cy="30" r="5" fill="#fbbf24"/></g></g>'+
  '<rect x="90" y="152" width="270" height="28" fill="#a16207"/>'+
  PR(170,116,.78,{hs:'bun',h:'#2b1d16',c:'#22c55e',ap:'#fff',e:'worried'})+
  PR(296,114,.8,{hs:'short',h:'#111',c:'#3b82f6',e:'sneaky',a:'hold',f:1})+
  '<g class="cm-vibx"><g transform="translate(226 100)"><rect width="46" height="18" rx="3" fill="#fff" stroke="#dc2626" stroke-width="2"/><text x="23" y="12.5" text-anchor="middle" font-size="7" font-weight="900" fill="#dc2626" font-family="sans-serif">ออกพรุ่งนี้!</text></g></g>';},
// [ภาพประกอบผนังปูนเปลือยเทาหยาบ สีแดงเป็นสีเน้นสีเดียว] แผงถูกคล้องโซ่แม่กุญแจ สินค้าอยู่ข้างใน ป้ายแดง "ห้ามยึดเอง" ทับ (น้องม้วนขวา)
 msstallpadlock:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var sp='';for(var i=0;i<50;i++)sp+='<circle cx="'+((i*41)%270)+'" cy="'+((i*29)%120+56)+'" r="'+(0.6+(i%3)*.4)+'" fill="#57534e" opacity=".35"/>';
  return '<rect width="360" height="180" fill="#a8a29e"/>'+sp+'<rect y="150" width="270" height="30" fill="#57534e"/>'+
  '<g transform="translate(40 76)"><rect width="120" height="74" fill="#d6d3d1" stroke="#44403c" stroke-width="2"/><g stroke="#78716c" stroke-width="3"><path d="M20 0v74M40 0v74M60 0v74M80 0v74M100 0v74"/></g><g fill="#fbbf24" opacity=".9"><rect x="8" y="50" width="10" height="10"/><rect x="46" y="50" width="10" height="10" fill="#f472b6"/><rect x="86" y="50" width="10" height="10" fill="#a3e635"/></g>'+
   '<path d="M0 30q60 16 120 0" stroke="#44403c" stroke-width="3" fill="none" stroke-dasharray="6 3"/><g transform="translate(60 38)"><path d="M-6 -4a6 6 0 0 1 12 0v4" stroke="#44403c" stroke-width="3" fill="none"/><rect x="-9" y="0" width="18" height="14" rx="2" fill="#44403c"/></g></g>'+
  '<g class="cm-stampin"><g transform="translate(150 70) rotate(-8)"><rect width="60" height="20" rx="3" fill="#dc2626"/><text x="30" y="14" text-anchor="middle" font-size="8" font-weight="900" fill="#fff" font-family="sans-serif">ห้ามยึดเอง</text></g></g>'+
  PR(236,114,.82,{hs:'bun',h:'#2b1d16',c:'#22c55e',e:'worried',a:'point',f:1});},
// [ภาพประกอบดินสอสีระบายหยาบ ลายเส้นสีไม้บนกระดาษถนอมสายตา] ซ้าย: สัญญาเช่าแผงเลขแผง 24 ค่าเช่า ระยะเวลา ขวา: แม่ค้ารับใบเสร็จจากเจ้าของตลาด (น้องม้วนกลาง)
 msleaseboard:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var hatch=function(x,y,w,h,c){var s='';for(var i=0;i<w+h;i+=4)s+='<path d="M'+(x+Math.min(i,w))+' '+(y+Math.max(0,i-w))+'L'+(x+Math.max(0,i-h))+' '+(y+Math.min(i,h))+'" stroke="'+c+'" stroke-width="1.6" opacity=".6"/>';return s;};
  return '<rect width="360" height="180" fill="#fbf7ee"/>'+hatch(0,152,360,28,'#a3e635')+hatch(300,56,50,40,'#fcd34d')+
  '<g transform="translate(76 72)"><rect width="64" height="76" fill="#fff" stroke="#2563eb" stroke-width="1.6"/>'+hatch(0,0,64,14,'#93c5fd')+'<text x="32" y="10" text-anchor="middle" font-size="6.6" font-weight="900" fill="#1e3a8a" font-family="sans-serif">สัญญาเช่าแผง</text>'+
   '<g font-size="5.6" font-weight="800" fill="#334155" font-family="sans-serif"><text x="6" y="26">แผงเลขที่ 24</text><text x="6" y="36">ค่าเช่า 3,000/เดือน</text><text x="6" y="46">1 ม.ค.–31 ธ.ค.</text><text x="6" y="56">ขึ้นค่าเช่า แจ้ง 60 วัน</text></g><path d="M8 68q8-6 16 0t16 0" stroke="#2563eb" fill="none"/></g>'+
  PR(262,110,.84,{hs:'bun',h:'#2b1d16',c:'#22c55e',ap:'#fff',e:'happy',a:'hold'})+
  '<g transform="translate(280 124)"><rect width="18" height="22" fill="#fff" stroke="#334155"/><path d="M3 6h12M3 10h12M3 14h8" stroke="#94a3b8"/></g>'+
  PR(324,112,.84,{hs:'short',h:'#111',c:'#3b82f6',e:'smile',f:1})+
  '<g class="cm-twinkle"><path d="M150 86l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f59e0b"/></g>';}
});
