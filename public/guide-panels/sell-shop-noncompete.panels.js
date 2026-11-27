// ภาพช่องการ์ตูนของคู่มือ sell-shop-noncompete
VCPanels({
// [ภาพประกอบแผนที่เดินเรือโบราณ เข็มทิศกุหลาบลม เส้นวงรัศมีสีน้ำเงินจาง กระดาษครีม] ร้านที่ขายไปอยู่กลางวงรัศมี 3 กม. ผู้ขายกับผู้ซื้อยื่นกุญแจร้านให้กัน (น้องม้วนซ้าย)
 ncsalesdesk:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var rings='';for(var i=1;i<=4;i++)rings+='<circle cx="220" cy="104" r="'+(i*16)+'" fill="none" stroke="#1e40af" stroke-width="1" stroke-dasharray="'+(i%2?'4 3':'0')+'" opacity=".45"/>';
  return '<rect width="360" height="180" fill="#f4ecd8"/><g stroke="#1e40af" opacity=".12"><path d="M90 80h270M90 120h270M150 56v124M270 56v124"/></g>'+rings+
  '<g transform="translate(320 74)"><circle r="12" fill="none" stroke="#7c2d12"/><path d="M0 -14l3 12-3 2-3-2zM0 14l3-12-3-2-3 2z" fill="#7c2d12"/><path d="M-14 0l12 3 2-3-2-3zM14 0l-12 3-2-3 2-3z" fill="#b45309"/><text y="-17" text-anchor="middle" font-size="6" font-weight="900" fill="#7c2d12" font-family="serif">N</text></g>'+
  '<g transform="translate(206 90)"><path d="M0 10h28l-4-10H4z" fill="#b91c1c"/><rect x="2" y="10" width="24" height="18" fill="#fde68a" stroke="#7c2d12"/></g><text x="220" y="72" text-anchor="middle" font-size="6.4" font-weight="900" fill="#1e40af" font-family="serif" font-style="italic">รัศมี 3 กม. · 2 ปี</text>'+
  '<rect x="90" y="152" width="270" height="28" fill="#c9b48e"/>'+
  PR(132,116,.78,{hs:'short',h:'#2b1d16',c:'#0f766e',e:'calm',a:'hold'})+
  '<g class="cm-swing"><g transform="translate(150 120)"><circle r="4" fill="none" stroke="#b45309" stroke-width="2"/><path d="M4 0h12M12 0v4M16 0v3" stroke="#b45309" stroke-width="2"/></g></g>'+
  PR(312,116,.78,{hs:'bob',h:'#111',c:'#7c3aed',e:'smile',f:1});},
// [ภาพประกอบหน้าหนังสือพิมพ์ขาวดำ คอลัมน์ข่าว พาดหัวตัวหนา รูปพิมพ์เม็ดหมึก] พาดหัว "ร้านใหม่เปิดแล้ว! ห่างไป 500 ม." ผู้ซื้อร้านถือหนังสือพิมพ์ตกใจ ตราเบี้ยปรับ (น้องม้วนขวา)
 ncrivalopening:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var col='';for(var y=106;y<160;y+=6)col+='<path d="M24 '+y+'h50M84 '+y+'h50M144 '+y+'h50" stroke="#a3a3a3" stroke-width="2.2"/>';
  var dots='';for(var x=86;x<134;x+=4)for(var y=104;y<150;y+=4)dots+='<circle cx="'+x+'" cy="'+y+'" r="'+(1.4-(Math.abs(x-110)+Math.abs(y-126))/60)+'" fill="#262626"/>';
  return '<g transform="translate(0 8)">'+'<rect width="360" height="180" fill="#d4d4d4"/><rect x="14" y="62" width="190" height="104" fill="#fafaf9" stroke="#525252"/>'+
  '<text x="109" y="76" text-anchor="middle" font-size="9" font-weight="900" fill="#171717" font-family="Georgia, serif">ข่าวย่านตลาด</text><path d="M20 80h178" stroke="#171717" stroke-width="1.6"/>'+
  '<text x="109" y="96" text-anchor="middle" font-size="11" font-weight="900" fill="#171717" font-family="sans-serif">ร้านใหม่เปิดแล้ว!</text>'+col+'<rect x="84" y="102" width="52" height="50" fill="#fafaf9"/>'+dots+
  '<g class="cm-stampin"><g transform="translate(150 132) rotate(-10)"><rect width="48" height="16" fill="none" stroke="#dc2626" stroke-width="2"/><text x="24" y="11" text-anchor="middle" font-size="6.4" font-weight="900" fill="#dc2626" font-family="sans-serif">เบี้ยปรับ?</text></g></g>'+
  '</g>'+
  PR(240,116,.8,{hs:'bob',h:'#111',c:'#7c3aed',e:'shock',a:'hold',f:1});},
// [ภาพประกอบหมึกปากกาคอแร้งลายวิจิตรบนกระดาษครีม เส้นลายมือเอียง] ซ้าย: ข้อห้ามแข่งขันที่เขียนอย่างพอดี ประเภท พื้นที่ เวลา ขวา: ผู้ซื้อกับผู้ขายจับมือ (น้องม้วนกลาง)
 ncdraftclause:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var ink='font-family="Georgia, serif" font-style="italic" fill="#1e1b4b"';
  return '<rect width="360" height="180" fill="#fbf6ea"/><path d="M14 64q20-10 40 0t40 0" stroke="#1e1b4b" fill="none" opacity=".4"/><path d="M300 170q16-12 32 0t28 0" stroke="#1e1b4b" fill="none" opacity=".4"/>'+
  '<rect y="154" width="360" height="26" fill="#e7dcc0"/>'+
  '<g transform="translate(50 74)"><rect width="72" height="78" fill="#fffef8" stroke="#a8a29e"/><text x="36" y="14" text-anchor="middle" font-size="7.4" font-weight="900" '+ink+'>ข้อห้ามแข่งขัน</text>'+
   '<g font-size="5.8" '+ink+'><text x="6" y="30">ประเภท: ร้านกาแฟ</text><text x="6" y="42">พื้นที่: 3 กม.</text><text x="6" y="54">เวลา: 2 ปี</text><text x="6" y="66">ปรับ: 50,000</text></g>'+
   '<path class="cm-tick" d="M44 72q6-8 12 0t12-3" stroke="#1e1b4b" stroke-width="1.2" fill="none" pathLength="100" stroke-dasharray="100"/></g>'+
  '<g transform="translate(150 140) rotate(-30)"><path d="M0 0l20 -4 2 3-20 4z" fill="#1e1b4b"/><path d="M-4 1l4-1 1 3z" fill="#a16207"/></g>'+
  PR(262,110,.84,{hs:'short',h:'#2b1d16',c:'#0f766e',e:'happy',a:'point'})+
  PR(322,110,.84,{hs:'bob',h:'#111',c:'#7c3aed',e:'smile',a:'point',f:1});}
});
