/* ===== ภาพการ์ตูนในหน้าอ่านคู่มือ (วาดเอง ไม่ใช้ภาพจากที่อื่น) =====
   VCComic.panel(scene, mood, sayHtml, cap, key) คืน <figure> ช่องการ์ตูนเต็มฉาก (viewBox 360×180)
     scene: pay | nopay | notice | labor | sign | repair | moveout
     ของสำคัญวางช่วงล่าง/ซ้าย เพราะกรอบคำพูดทับมุมขวาบน
   VCComic.coverBg(name) คืน <svg> ลายฉากหลังปกตามฉากการ์ด (condo | office | money | debt | scam | contract) */
(function () {
'use strict';
var I='#3a2a12';
function coins(x,y,n){var s='';for(var i=0;i<n;i++)s+='<ellipse cx="'+x+'" cy="'+(y-i*5)+'" rx="11" ry="4" fill="#f4c542" stroke="'+I+'" stroke-width="1.6"/>';return '<g class="cm-grow">'+s+'</g>';}
var P={
 // ค่าชดเชยตามอายุงาน: ออฟฟิศแดดดี เหรียญซ้อนเป็นขั้นบันได + ปฏิทิน
 pay:function(k){return '<defs><linearGradient id="pa'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf4ff"/><stop offset="1" stop-color="#d4e5fb"/></linearGradient><radialGradient id="pb'+k+'" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>'+
  '<rect width="360" height="180" fill="url(#pa'+k+')"/><g opacity=".5" fill="#c6d8f2"><rect x="0" y="0" width="360" height="6"/></g>'+
  '<g stroke="'+I+'" stroke-width="2.2"><rect x="18" y="16" width="78" height="62" rx="5" fill="#9fd3ff"/><path d="M57 16v62M18 47h78"/></g><circle cx="80" cy="30" r="8" fill="#ffe27a"/><g fill="#fff" opacity=".9"><ellipse cx="38" cy="62" rx="12" ry="5"/><ellipse cx="46" cy="58" rx="8" ry="5"/></g>'+
  '<circle cx="260" cy="120" r="60" fill="url(#pb'+k+')"/>'+
  '<rect x="0" y="150" width="360" height="30" fill="#b9cbe6"/><path d="M0 150h360" stroke="'+I+'" stroke-width="2"/>'+
  '<rect x="100" y="130" width="260" height="10" rx="3" fill="#b07a45" stroke="'+I+'" stroke-width="2"/><path d="M116 140v40M346 140v40" stroke="'+I+'" stroke-width="3.4"/>'+
  '<g transform="translate(118 92)" stroke="'+I+'" stroke-width="2"><rect width="40" height="38" rx="4" fill="#fff"/><rect width="40" height="11" rx="4" fill="#ff6b5a"/><text x="20" y="31" text-anchor="middle" font-size="15" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">120</text></g>'+
  coins(186,126,2)+coins(214,126,4)+coins(242,126,7)+coins(270,126,10)+coins(298,126,13)+
  
  '<g stroke="'+I+'" stroke-width="1.6"><path d="M334 130q-2-22 8-30q4 14-2 30" fill="#7cc58a"/><path d="M338 130q-12-14-6-26q8 10 6 26" fill="#5fae73"/></g>'+
  '<path class="cm-tw" d="M326 56l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#ffd84d"/><path class="cm-tw" style="animation-delay:.8s" d="M170 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffd84d"/>';},
 // นายจ้างไม่ต้องจ่าย: ห้องโทนอุ่นตอนเย็น บอร์ดเช็กลิสต์มีกากบาท ปฏิทินขาด 3 วัน
 nopay:function(k){return '<defs><linearGradient id="na'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1e6"/><stop offset="1" stop-color="#ffd9c2"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#na'+k+')"/><g opacity=".35" stroke="#f0a77d" stroke-width="10"><path d="M-20 40l80-80M40 200L260-20M300 200l100-100"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#e8b48f"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g transform="translate(112 56) scale(.8)" stroke="'+I+'" stroke-width="2"><rect width="86" height="96" rx="6" fill="#c89a62"/><rect x="8" y="8" width="70" height="80" rx="3" fill="#fff"/><rect x="30" y="-4" width="26" height="12" rx="3" fill="#8a96a8"/>'+
   '<g stroke-width="2.4" stroke-linecap="round"><path d="M16 24l6 6M22 24l-6 6M16 44l6 6M22 44l-6 6M16 64l6 6M22 64l-6 6" stroke="#e0453a"/><path d="M30 27h38M30 47h32M30 67h36" stroke="#c4cbd6"/></g></g>'+
  '<g transform="translate(188 112)" stroke="'+I+'" stroke-width="1.8">'+
   [0,1,2].map(function(i){return '<g transform="translate('+(i*34)+' 0) rotate('+(i-1)*4+' 14 20)"><rect width="28" height="34" rx="3" fill="#fff"/><rect width="28" height="9" rx="3" fill="#ff6b5a"/><path d="M7 16l14 14M21 16L7 30" stroke="#e0453a" stroke-width="3" stroke-linecap="round"/></g>';}).join('')+'</g>'+
  '<g transform="translate(282 92) scale(.78)"><g class="cm-pop"><path d="M34 0l34 60H0z" fill="#ffd24d" stroke="'+I+'" stroke-width="2.6" stroke-linejoin="round"/><path d="M34 20v20" stroke="'+I+'" stroke-width="6" stroke-linecap="round"/><circle cx="34" cy="50" r="3.6" fill="'+I+'"/></g></g>'+
  '<g stroke="#e0453a" stroke-width="3" stroke-linecap="round" class="cm-tw"><path d="M286 96l-8-6M282 112h-10"/></g>';},
 // ต้องบอกล่วงหน้า: หน้าประตู จดหมายบินมาพร้อมเส้นความเร็ว ปฏิทินวงวันจ่ายเงินเดือน
 notice:function(k){return '<defs><linearGradient id="la'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eefbf2"/><stop offset="1" stop-color="#cdeeda"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#la'+k+')"/><g fill="#fff" opacity=".7"><ellipse cx="60" cy="30" rx="22" ry="8"/><ellipse cx="300" cy="22" rx="18" ry="6"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#a8d5b5"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g stroke="'+I+'" stroke-width="2.2"><rect x="270" y="40" width="62" height="112" rx="4" fill="#b07a45"/><rect x="280" y="52" width="42" height="40" rx="3" fill="#c48d55"/><rect x="280" y="100" width="42" height="40" rx="3" fill="#c48d55"/><rect x="288" y="94" width="26" height="6" rx="2" fill="'+I+'"/><circle cx="322" cy="98" r="3" fill="#f4c542"/></g>'+
  '<g class="cm-fly"><g transform="translate(146 96) rotate(-8) scale(.85)" stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round"><rect width="60" height="40" rx="4" fill="#fff"/><path d="M0 2l30 21 30-21" fill="none"/><circle cx="50" cy="7" r="8" fill="#e0453a"/></g><g stroke="#5fae73" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M100 104h34M110 116h24M96 128h36"/></g></g>'+
  '<g transform="translate(196 106)" stroke="'+I+'" stroke-width="1.8"><rect width="64" height="46" rx="4" fill="#fff"/><rect width="64" height="12" rx="4" fill="#3b6fd6"/>'+
   [0,1,2,3,4,5,6,7].map(function(i){return '<rect x="'+(6+(i%4)*14)+'" y="'+(17+Math.floor(i/4)*13)+'" width="10" height="9" rx="1.5" fill="#e9eef6" stroke="none"/>';}).join('')+
   '<circle cx="53" cy="34" r="8" fill="none" stroke="#e0453a" stroke-width="2.6"/><text x="53" y="38" text-anchor="middle" font-size="10" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">฿</text></g>'+
  '<g transform="translate(130 140) scale(.8)" stroke="'+I+'" stroke-width="2"><circle r="18" fill="#fff7e6"/><path d="M0 0v-11M0 0l8 4" stroke-width="2.8" stroke-linecap="round"/></g>';},
 // ไปร้องเรียนสิทธิ: เคาน์เตอร์หน่วยงานรัฐ บัตรคิว แฟ้มคำร้องได้ตราอนุมัติ (ของทั้งหมดอยู่ใต้ y≈85 ไม่ให้กรอบคำพูดบัง)
 labor:function(k){return '<defs><linearGradient id="ga'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1efff"/><stop offset="1" stop-color="#dcd8fb"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#ga'+k+')"/><g fill="#e6e2fd"><rect x="0" y="40" width="360" height="8"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#bfb7ee"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g stroke="'+I+'" stroke-width="2.2"><rect x="110" y="112" width="250" height="12" rx="3" fill="#8f7ad6"/><rect x="122" y="124" width="226" height="28" fill="#a998e6"/><path d="M180 124v28M260 124v28" stroke-width="1.6"/></g>'+
  '<g transform="translate(130 86)" stroke="'+I+'" stroke-width="2"><rect width="34" height="26" rx="4" fill="#fff7e6"/><text x="17" y="19" text-anchor="middle" font-size="13" font-weight="800" fill="#d9731a" stroke="none" font-family="sans-serif">A12</text></g>'+
  '<g transform="translate(184 82) rotate(-4)" stroke="'+I+'" stroke-width="2"><rect width="44" height="32" rx="3" fill="#fff"/><path d="M8 9h28M8 16h20M8 23h24" stroke="#c4cbd6" stroke-width="2.2" stroke-linecap="round"/></g>'+
  '<g transform="translate(240 92)"><g class="cm-pop"><g stroke="'+I+'" stroke-width="2"><rect x="0" y="12" width="26" height="8" rx="2" fill="#e0453a"/><path d="M9 12v-8h8v8" fill="#8a5a08"/><rect x="5" y="-4" width="16" height="8" rx="4" fill="#8a5a08"/></g></g></g>'+
  '<g transform="translate(276 80)" stroke="'+I+'" stroke-width="2"><circle cx="16" cy="18" r="16" fill="#5fae73"/><path d="M8 18l6 6 11-12" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'+
  '<g stroke="'+I+'" stroke-width="1.6"><path d="M330 112q-2-22 8-30q4 14-2 30" fill="#7cc58a"/><path d="M334 112q-12-14-6-26q8 10 6 26" fill="#5fae73"/></g>'+
  '<path class="cm-tw" d="M232 66l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#ffd84d"/>';},
 // ก่อนเซ็นสัญญาเช่า: โต๊ะ สัญญา 2 ฉบับ ปากกา กุญแจห้อง
 sign:function(k){return '<defs><linearGradient id="sa'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1dc"/><stop offset="1" stop-color="#f7d9b3"/></linearGradient><linearGradient id="sb'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b6fd6"/><stop offset=".6" stop-color="#ff9f8a"/><stop offset="1" stop-color="#ffd49a"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#sa'+k+')"/><rect x="20" y="14" width="80" height="64" rx="5" fill="url(#sb'+k+')" stroke="'+I+'" stroke-width="2.2"/><g fill="#5a4b8a"><rect x="26" y="50" width="12" height="28"/><rect x="40" y="40" width="14" height="38"/><rect x="58" y="54" width="10" height="24"/><rect x="72" y="46" width="16" height="32"/></g><path d="M60 14v64" stroke="'+I+'" stroke-width="2"/>'+
  '<rect x="0" y="152" width="360" height="28" fill="#d9a46a"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<rect x="104" y="128" width="256" height="10" rx="3" fill="#a0673a" stroke="'+I+'" stroke-width="2"/><path d="M120 138v42M344 138v42" stroke="'+I+'" stroke-width="3.4"/>'+
  '<g stroke="'+I+'" stroke-width="2"><g transform="translate(150 84) rotate(-6)"><rect width="52" height="42" rx="3" fill="#fff"/><path d="M8 10h34M8 17h28M8 24h34" stroke="#c4cbd6" stroke-width="2.2" stroke-linecap="round"/><path d="M10 34q5-6 9 0t9 0" stroke="#3b6fd6" fill="none" stroke-width="2"/></g><g transform="translate(212 86) rotate(5)"><rect width="52" height="42" rx="3" fill="#fff"/><path d="M8 10h34M8 17h28M8 24h34" stroke="#c4cbd6" stroke-width="2.2" stroke-linecap="round"/><path d="M28 34q5-6 9 0t9 0" stroke="#e0453a" fill="none" stroke-width="2"/></g></g>'+
  '<g transform="translate(200 104) rotate(-35)"><g class="cm-pop" stroke="'+I+'" stroke-width="1.8"><rect x="-3" y="-20" width="7" height="24" rx="2" fill="#3b6fd6"/><path d="M-3 4h7l-3.5 6z" fill="#f7efdc"/></g></g>'+
  '<g transform="translate(276 112) rotate(-20)" stroke="'+I+'" stroke-width="1.8" fill="#f4c542"><circle r="7"/><circle r="2.4" fill="#fff6d0"/><path d="M7 0h16v4h-4v4h-4v-4h-8z" stroke-linejoin="round"/></g>'+
  '<g transform="translate(320 102)" stroke="'+I+'" stroke-width="1.8"><rect width="20" height="26" rx="3" fill="#fff"/><path d="M4 26v-6h12v6" fill="#6fb3a8"/></g>'+
  '<path class="cm-tw" d="M248 66l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffd84d"/>';},
 // ระหว่างเช่า: ก๊อกน้ำรั่ว กล่องเครื่องมือ ประแจ
 repair:function(k){return '<defs><linearGradient id="ra'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f7f5"/><stop offset="1" stop-color="#c3e9e4"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#ra'+k+')"/><g stroke="#a9dbd4" stroke-width="1.4"><path d="M0 40h360M0 80h360M0 120h360M60 0v152M120 0v152M180 0v152M240 0v152M300 0v152"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#9fd0c8"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g stroke="'+I+'" stroke-width="2.2"><path d="M130 100h90v14q0 22-45 22t-45-22z" fill="#fff"/><path d="M150 100v-12h22" fill="none" stroke-width="5" stroke-linecap="round"/><rect x="166" y="82" width="14" height="10" rx="2" fill="#9fb3c4"/></g>'+
  '<g class="cm-drip"><path d="M173 94q4 7 0 10q-4-3 0-10z" fill="#5ab8ff" stroke="'+I+'" stroke-width="1.4"/></g><g fill="#8fd0ff"><ellipse cx="176" cy="146" rx="18" ry="4"/></g>'+
  '<g transform="translate(250 112)" stroke="'+I+'" stroke-width="2"><rect width="64" height="38" rx="4" fill="#e0453a"/><path d="M20 0v-10h24v10" fill="none" stroke-width="3"/><rect x="26" y="14" width="12" height="8" rx="2" fill="#f4c542"/></g>'+
  '<g transform="translate(250 98) rotate(-20)"><g class="cm-pop"><path d="M0 0h40" stroke="'+I+'" stroke-width="8" stroke-linecap="round"/><path d="M0 0h40" stroke="#9fb3c4" stroke-width="4.4" stroke-linecap="round"/><circle cx="44" cy="0" r="9" fill="#9fb3c4" stroke="'+I+'" stroke-width="2"/><rect x="42" y="-4" width="10" height="8" fill="#c3e9e4"/></g></g>'+
  '<path class="cm-tw" d="M228 88l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#ffd84d"/>';},
 // ย้ายออก: กล่องลัง ประตูเปิด กล้องถ่ายรูปห้อง
 moveout:function(k){return '<defs><linearGradient id="ma'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e1"/><stop offset="1" stop-color="#ffe7b3"/></linearGradient></defs>'+
  '<rect width="360" height="180" fill="url(#ma'+k+')"/><rect x="0" y="152" width="360" height="28" fill="#e8c27e"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g stroke="'+I+'" stroke-width="2.2"><rect x="286" y="34" width="60" height="118" rx="3" fill="#fff3d0"/><path d="M286 34l-26 10v118l26-10" fill="#b07a45"/><circle cx="266" cy="100" r="3" fill="#f4c542"/></g>'+
  '<g stroke="'+I+'" stroke-width="2" stroke-linejoin="round"><path d="M120 112h56v40h-56z" fill="#d6a76a"/><path d="M120 112l-8-10h56l8 10" fill="#e8bf86"/><path d="M134 126h28" stroke-width="2.4" stroke-linecap="round"/><path d="M186 122h44v30h-44z" fill="#d6a76a"/><path d="M186 122l-6-8h44l6 8" fill="#e8bf86"/><path d="M150 112h48v-26h-48z" fill="#e2b578" transform="translate(-4 0)"/></g>'+
  '<g transform="translate(232 98) scale(.8)"><g class="cm-pop"><g stroke="'+I+'" stroke-width="2.2"><rect width="50" height="36" rx="6" fill="#3b4a66"/><rect x="10" y="-6" width="14" height="8" rx="2" fill="#3b4a66"/><circle cx="25" cy="18" r="11" fill="#9fd3ff"/><circle cx="25" cy="18" r="5" fill="#3b6fd6"/><circle cx="42" cy="8" r="2.4" fill="#ffd84d" stroke="none"/></g></g></g>'+
  '<g class="cm-tw" stroke="#ffd84d" stroke-width="3" stroke-linecap="round"><path d="M228 98l-6-6M276 96l4-7"/></g>';}
};
var BG={debt:'<g fill="#fff" opacity=".85"><circle cx="190" cy="14" r="1.3"/><circle cx="230" cy="24" r="1"/><circle cx="268" cy="10" r="1.5"/><circle cx="300" cy="26" r="1"/><circle cx="214" cy="166" r="1.2"/><circle cx="262" cy="160" r="1"/><circle cx="300" cy="168" r="1.4"/></g><path d="M338 10a11 11 0 1 0 10 16a9 9 0 1 1-10-16z" fill="#ffe9a8"/><g fill="none" stroke="#ffb3a6" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M318 152q-4 7 0 14M312 148q-8 11 0 22M346 152q4 7 0 14M352 148q8 11 0 22"/></g>',
 scam:'<g opacity=".55" transform="translate(326 6) scale(.7)"><path d="M14 0l16 28H-2z" fill="#ffd24d" stroke="#3a2a12" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 9v9" stroke="#3a2a12" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="23" r="1.8" fill="#3a2a12"/></g><g fill="#e88aa8" opacity=".3"><circle cx="230" cy="166" r="7"/><circle cx="344" cy="160" r="9"/><circle cx="270" cy="14" r="4"/><circle cx="300" cy="170" r="3"/></g>',
 contract:'<g stroke="#c89a62" stroke-width="2" stroke-linecap="round" opacity=".35"><path d="M196 160h70M196 168h50"/><path d="M290 14h56M300 22h46"/></g><g opacity=".4" stroke="#3a2a12" stroke-width="1.6" fill="none" transform="translate(322 136) scale(.8)"><path d="M14 40v-34M0 6l28 5"/><path d="M0 6l-6 11h12zM28 11l-6 11h12z"/></g>',
 office:'<g stroke="#9fb3d6" stroke-width="2" stroke-linecap="round" opacity=".6"><path d="M200 8l-3 7M232 18l-3 7M262 6l-3 7M296 16l-3 7M326 4l-3 7M214 160l-3 7M270 162l-3 7M330 158l-3 7"/></g><path d="M330 30q0-8 8-8q4-5 10-3q7-2 9 4" fill="#dfe7f3" stroke="#9fb3d6" stroke-width="1.6" opacity=".9"/>',
 condo:'<g fill="#7b6fd6" opacity=".18"><rect x="232" y="138" width="16" height="38"/><rect x="252" y="124" width="20" height="52"/><rect x="276" y="144" width="14" height="32"/><rect x="294" y="130" width="22" height="46"/><rect x="320" y="146" width="16" height="30"/><rect x="340" y="134" width="20" height="42"/></g><circle cx="336" cy="26" r="12" fill="#ffd49a" opacity=".75"/>',
 money:'<g opacity=".5" stroke="#3a2a12" stroke-width="1.4" fill="#f4c542"><circle cx="334" cy="24" r="9"/><circle cx="312" cy="14" r="6"/><ellipse cx="330" cy="166" rx="12" ry="4"/><ellipse cx="330" cy="161" rx="12" ry="4"/><ellipse cx="300" cy="168" rx="10" ry="3.6"/></g><path d="M270 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" opacity=".9"/>'
};
function panel(scene, mood, say, cap, key) {
  var f = P[scene]; if (!f) return '';
  var k = String(key || '0').replace(/[^a-z0-9]/gi, '');
  return '<figure class="gd-cm" aria-hidden="true"><svg class="gd-cm-bg" viewBox="0 0 360 180" preserveAspectRatio="xMidYMax slice">' + f(k) + '</svg>' +
    '<span class="gd-cm-m">' + (window.VCMascot ? window.VCMascot.svg(mood, 92) : '') + '</span>' +
    (say ? '<figcaption class="gd-cm-bub">' + say + '</figcaption>' : '') + (cap ? '<span class="gd-cm-cap">' + cap + '</span>' : '') + '</figure>';
}
function coverBg(name) {
  return BG[name] ? '<svg class="gd-cover-bg" viewBox="0 0 360 176" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">' + BG[name] + '</svg>' : '';
}
window.VCComic = { panel: panel, coverBg: coverBg, scenes: Object.keys(P) };
})();
