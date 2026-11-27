// ภาพช่องการ์ตูนของคู่มือ buyer-claims-not-received
VCPanels({
// [ภาพประกอบนิทานภาพสีกวอชนุ่ม ประตูบ้านไม้ ไม้กระถาง แสงบ่าย] กล่องพัสดุวางหน้าประตู ไรเดอร์ถ่ายรูปยืนยัน มือถือร้านขึ้น "ส่งสำเร็จ" แต่ลูกค้าแชตว่าไม่ได้รับ (น้องม้วนซ้าย)
 nrdoorstep:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  return '<rect width="360" height="180" fill="#fef3c7"/><rect x="90" y="58" width="270" height="94" fill="#fde68a" opacity=".6"/>'+
  '<g transform="translate(240 64)"><rect width="56" height="88" rx="4" fill="#92400e"/><rect x="6" y="8" width="44" height="34" rx="3" fill="#a16207"/><rect x="6" y="48" width="44" height="34" rx="3" fill="#a16207"/><circle cx="46" cy="48" r="3" fill="#fde68a"/></g>'+
  '<g transform="translate(306 122)"><path d="M0 30h22l-3-18H3z" fill="#c2410c"/><path d="M11 12q-10-14 0-22q10 8 0 22z" fill="#16a34a"/></g>'+
  '<g transform="translate(250 134)"><rect width="30" height="18" fill="#d6a46b" stroke="#7c2d12"/><path d="M15 0v18" stroke="#7c2d12"/></g>'+
  '<rect x="90" y="152" width="270" height="28" fill="#a16207" opacity=".8"/>'+
  PR(196,116,.76,{hs:'cap',cap:'#f97316',h:'#111',c:'#f97316',e:'smile',a:'phone',ph:'#e0f2fe'})+
  '<g class="cm-flash"><circle cx="220" cy="118" r="4" fill="#fff" opacity=".9"/></g>'+
  '<g transform="translate(104 76)"><rect width="66" height="40" rx="6" fill="#fff" stroke="#334155"/><rect x="4" y="4" width="58" height="12" rx="3" fill="#dcfce7"/><text x="33" y="13" text-anchor="middle" font-size="6" font-weight="900" fill="#166534" font-family="sans-serif">✓ ส่งสำเร็จ</text>'+
   '<g class="cm-popin"><rect x="4" y="20" width="58" height="14" rx="4" fill="#fee2e2"/><text x="33" y="30" text-anchor="middle" font-size="5.6" font-weight="900" fill="#b91c1c" font-family="sans-serif">ไม่ได้รับของค่ะ!</text></g></g>';},
// [ภาพประกอบกระดานนักสืบ ไม้ก๊อก หมุดแดงโยงเส้นด้ายแดง โพลารอยด์] รูปส่งถึง ลายเซ็นผู้รับ น้ำหนักพัสดุ และ "เคลม 3 ร้าน" โยงเข้าหาลูกค้าคนเดียว (น้องม้วนขวา)
 nrfraudpattern:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var pol=function(x,y,r,t,c){return '<g transform="translate('+x+' '+y+') rotate('+r+')"><rect width="40" height="42" fill="#fff" stroke="#d6d3d1"/><rect x="4" y="4" width="32" height="26" fill="'+c+'"/><text x="20" y="38" text-anchor="middle" font-size="5" font-weight="900" fill="#44403c" font-family="sans-serif">'+t+'</text><circle cx="20" cy="2" r="2.6" fill="#dc2626"/></g>';};
  return '<rect width="360" height="180" fill="#b08968"/><rect x="10" y="70" width="200" height="104" fill="#d4a373" stroke="#7f5539" stroke-width="3"/>'+
  '<g opacity=".25" fill="#7f5539"><circle cx="40" cy="90" r="1.4"/><circle cx="150" cy="140" r="1.4"/><circle cx="190" cy="80" r="1.4"/></g>'+
  '<g stroke="#dc2626" stroke-width="1.4" fill="none"><path d="M40 80L110 116M100 78L110 116M170 82L110 116M40 126L110 116M170 126L110 116"/></g>'+
  pol(20,78,-6,'รูปส่งถึง','#fde68a')+pol(80,76,4,'ลายเซ็น','#e0f2fe')+pol(150,80,-3,'น้ำหนัก 1.2kg','#dcfce7')+pol(22,124,5,'เคลมร้าน A','#fee2e2')+pol(150,124,-5,'เคลมร้าน B','#fee2e2')+
  '<g transform="translate(110 116)"><circle r="12" fill="#fff" stroke="#dc2626" stroke-width="2"/><text y="4" text-anchor="middle" font-size="12" font-weight="900" fill="#dc2626" font-family="sans-serif">?</text></g>'+
  PR(240,116,.8,{hs:'short',h:'#111',c:'#334155',gl:1,e:'calm',a:'point',f:1});},
// [ภาพประกอบหน้าจอช่องมองภาพกล้องมือถือ กรอบมุม ตัวเลข REC แบตเตอรี่] ซ้าย: กล่องบนตาชั่ง 1.2 kg เทปกาวลายร้าน เลขพัสดุในเฟรม ขวา: แม่ค้าถ่ายคลิปแพ็ก (น้องม้วนกลาง)
 nrpackingcam:function(k){var PR=function(x,y,s,o){o=o||{};var sk=o.sk||'#f3c9a5',sd=o.sd||'#e0a882',hc=o.h||'#2b1d16',sh=o.c||'#3f6fb5',e=o.e||'calm',hs=o.hs||'short',ink='#2a1a12';
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
  var cr='stroke="#fff" stroke-width="2.4" fill="none"';
  return '<rect width="360" height="180" fill="#1f2937"/><rect x="50" y="72" width="126" height="80" fill="#e7d3b3"/>'+
  '<path d="M56 80v-6h10M170 80v-6h-10M56 144v6h10M170 144v6h-10" '+cr+'/>'+
  '<g font-family="monospace" font-weight="900" font-size="6"><text x="60" y="88" fill="#ef4444" class="cm-blink">● REC 00:42</text><text x="166" y="88" text-anchor="end" fill="#fff">▮▮▮</text></g>'+
  '<g transform="translate(66 124)"><rect width="56" height="12" rx="2" fill="#9ca3af"/><rect x="18" y="12" width="20" height="8" fill="#4b5563"/><rect x="4" y="2" width="20" height="8" rx="1" fill="#052e16"/><text x="14" y="8.4" text-anchor="middle" font-size="5" font-weight="900" fill="#4ade80" font-family="monospace">1.2kg</text></g>'+
  '<g transform="translate(74 94)"><rect width="40" height="30" fill="#d6a46b" stroke="#7c2d12"/><rect x="0" y="12" width="40" height="6" fill="#f472b6"/><text x="20" y="17" text-anchor="middle" font-size="4.4" font-weight="900" fill="#fff" font-family="sans-serif">MALI SHOP</text><rect x="22" y="2" width="16" height="8" fill="#fff"/><path d="M24 4v4M26 4v4M29 4v4M31 4v4M34 4v4" stroke="#111" stroke-width=".8"/></g>'+
  '<rect y="152" width="360" height="28" fill="#111827"/>'+
  PR(270,110,.84,{hs:'bun',h:'#2b1d16',c:'#f472b6',e:'smile',a:'phone',ph:'#bfdbfe'})+
  '<g class="cm-popin"><g transform="translate(290 84)"><rect width="46" height="14" rx="7" fill="#16a34a"/><text x="23" y="10" text-anchor="middle" font-size="6" font-weight="900" fill="#fff" font-family="sans-serif">มีหลักฐาน ✓</text></g></g>';}
});
