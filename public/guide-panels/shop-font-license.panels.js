// ภาพช่องการ์ตูนของคู่มือ shop-font-license
VCPanels({
// [ภาพประกอบโรงเขียนป้ายแบบโบราณ สีป้ายเพนต์มือ แดง เขียวขวด ครีม ลายพู่กัน] ช่างเพนต์ป้ายเขียนชื่อร้านด้วยฟอนต์สวย จอคอมข้าง ๆ ขึ้นคำว่า "Free for personal use" (น้องม้วนซ้าย)
 fnsignshop:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  return '<rect width="360" height="180" fill="#f3e9d2"/><rect x="90" y="60" width="270" height="90" fill="#e8dbbd"/>'+
  '<g fill="none" stroke="#b91c1c" stroke-width="3" opacity=".25" stroke-linecap="round"><path d="M100 70q20-8 40 0"/><path d="M320 140q20-8 30 4"/></g>'+
  // ป้ายไม้
  '<g transform="translate(150 70)"><rect width="120" height="40" rx="4" fill="#14532d" stroke="#3f2a14" stroke-width="3"/>'+
   '<text x="60" y="27" text-anchor="middle" font-size="16" font-weight="900" fill="#fef3c7" font-family="Georgia, serif" font-style="italic" class="cm-type">Mali Café</text></g>'+
  // จอคอม
  '<g transform="translate(290 98)"><rect width="56" height="40" rx="3" fill="#1f2937"/><rect x="3" y="3" width="50" height="30" fill="#fff"/><text x="28" y="14" text-anchor="middle" font-size="5" font-weight="800" fill="#334155" font-family="sans-serif">FREE for</text><text x="28" y="23" text-anchor="middle" font-size="6.4" font-weight="900" fill="#dc2626" font-family="sans-serif">personal use</text><rect x="22" y="40" width="12" height="8" fill="#1f2937"/></g>'+
  '<rect x="90" y="150" width="270" height="30" fill="#7c4a1e"/><rect x="90" y="148" width="270" height="4" fill="#3f2a14"/>'+
  PR(222,116,.8,{hs:'cap',cap:'#b91c1c',h:'#2b1d16',c:'#fef3c7',ap:'#14532d',e:'calm',a:'up'})+
  '<g transform="translate(240 92) rotate(-30)"><rect width="4" height="20" fill="#a16207"/><path d="M-1 0h6l-1 -6h-4z" fill="#111"/></g>'+
  '<g class="cm-pop"><text x="266" y="100" font-size="14" font-weight="900" fill="#b91c1c" font-family="sans-serif">?</text></g>';},
// [ภาพประกอบลายเส้นเดียวต่อเนื่อง (one-line) สีดำบนพื้นเหลืองพาสเทล] กล่องจดหมายเปิดมีอีเมลทวงเงิน 30,000 บาท โล่ "ตรวจสอบก่อน" เจ้าของร้านถือมือถือหยุดคิด (น้องม้วนขวา)
 fninboxletter:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var s='stroke="#1c1917" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  return '<rect width="360" height="180" fill="#fef9c3"/>'+
  '<path '+s+' d="M20 160h250"/>'+
  '<g transform="translate(40 94)"><path '+s+' d="M0 0h110v60H0zM0 0l55 34 55-34"/>'+
   '<rect x="18" y="-6" width="74" height="44" fill="#fff" stroke="#1c1917" stroke-width="2" class="cm-rise"/>'+
   '<text x="55" y="8" text-anchor="middle" font-size="6.4" font-weight="900" fill="#1c1917" font-family="sans-serif">ค่าไลเซนส์ฟอนต์</text><text x="55" y="22" text-anchor="middle" font-size="10" font-weight="900" fill="#dc2626" font-family="sans-serif">฿30,000</text><text x="55" y="32" text-anchor="middle" font-size="5" fill="#57534e" font-family="sans-serif">โอนภายใน 3 วัน</text></g>'+
  '<g transform="translate(176 110)"><path '+s+' d="M0 -14l16 6v10q0 12-16 18q-16-6-16-18v-10z"/><path d="M-6 2l4 4 8-8" stroke="#15803d" stroke-width="2.4" fill="none"/></g>'+
  '<text x="176" y="146" text-anchor="middle" font-size="6.6" font-weight="900" fill="#15803d" font-family="sans-serif">ตรวจสอบก่อน</text>'+
  PR(238,114,.82,{hs:'bob',h:'#1c1917',c:'#fde047',e:'worried',a:'phone',ph:'#fff',f:1});},
// [ภาพประกอบตัวเรียงพิมพ์ไม้ (wood type) ลายเนื้อไม้ หมึกพิมพ์สีกรมท่าและแดง] ซ้าย: ลิ้นชักตัวพิมพ์มีป้าย "ใช้เชิงพาณิชย์ได้ ✓" ขวา: เจ้าของร้านถือใบเสร็จไลเซนส์ (น้องม้วนกลาง)
 fntypecase:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var cells='';for(var r=0;r<3;r++)for(var c2=0;c2<4;c2++)cells+='<rect x="'+(c2*15+2)+'" y="'+(r*15+16)+'" width="13" height="13" fill="#c08a56" stroke="#7a4f27"/>';
  var letters=['ก','ข','A','B','ร','ม','C','ฟ'];var lt='';letters.forEach(function(L,i){lt+='<text x="'+((i%4)*15+8.5)+'" y="'+(Math.floor(i/4)*15+26.5)+'" text-anchor="middle" font-size="9" font-weight="900" fill="'+(i%3?'#1e3a8a':'#b91c1c')+'" font-family="serif">'+L+'</text>';});
  return '<rect width="360" height="180" fill="#efe1c6"/><g opacity=".2" stroke="#7a4f27"><path d="M0 70q90 6 180 0t180 0M0 120q90 6 180 0t180 0"/></g><rect y="152" width="360" height="28" fill="#7a4f27"/>'+
  '<g transform="translate(76 76)"><rect width="64" height="62" rx="3" fill="#a8703c" stroke="#5c3a1a" stroke-width="2"/>'+cells+lt+'<rect x="2" y="2" width="60" height="11" rx="2" fill="#15803d"/><text x="32" y="10" text-anchor="middle" font-size="5.6" font-weight="900" fill="#fff" font-family="sans-serif">ใช้เชิงพาณิชย์ได้ ✓</text></g>'+
  PR(270,110,.84,{hs:'short',h:'#2b1d16',c:'#1e3a8a',ap:'#efe1c6',e:'smile',a:'hold',f:1})+
  '<g transform="translate(236 122) rotate(-6)"><rect width="24" height="20" fill="#fff" stroke="#1e3a8a"/><path d="M4 6h16M4 10h12" stroke="#94a3b8"/><text x="12" y="17.5" text-anchor="middle" font-size="4.6" font-weight="900" fill="#b91c1c" font-family="sans-serif">LICENSE</text></g>'+
  '<g class="cm-twinkle"><path d="M320 84l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#b91c1c"/></g>';}
});
