/* ===== ภาพการ์ตูนในหน้าอ่านคู่มือ (วาดเอง ไม่ใช้ภาพจากที่อื่น) =====
   VCComic.panel(scene, mood, sayHtml, cap, key) คืน <figure> ช่องการ์ตูนเต็มฉาก (viewBox 360×180)
     scene: pay nopay notice labor (เลิกจ้าง) · sign repair moveout (เช่า) · iou rate guarantee hourglass (กู้เงิน)
            umbrella hours nothreat complain (ทวงหนี้) · bankcall mule shared (มิจฉาชีพ) · tilt cut fence (ข้อสัญญา) · sick errand vacation holiday (วันลา) · workday consent rates manager payslip (OT)
     ของสำคัญวางช่วงล่าง/ซ้าย เพราะกรอบคำพูดทับมุมขวาบน
   VCComic.coverBg(name) คืน <svg> ลายฉากหลังปกตามฉากการ์ด (condo | office | money | debt | scam | contract) */
(function () {
'use strict';
var I='#3a2a12';
function coins(x,y,n){var s='';for(var i=0;i<n;i++)s+='<ellipse cx="'+x+'" cy="'+(y-i*5)+'" rx="11" ry="4" fill="#f4c542" stroke="'+I+'" stroke-width="1.6"/>';return '<g class="cm-grow">'+s+'</g>';}
// ฉากหลังห้องไล่สี + พื้น
function bg(k, c1, c2, floor) {
  return '<defs><linearGradient id="bgx' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
    '<rect width="360" height="180" fill="url(#bgx' + k + ')"/><rect x="0" y="152" width="360" height="28" fill="' + floor + '"/><path d="M0 152h360" stroke="' + I + '" stroke-width="2"/>';
}
function desk(y) { return '<rect x="100" y="' + y + '" width="260" height="10" rx="3" fill="#b07a45" stroke="' + I + '" stroke-width="2"/><path d="M116 ' + (y + 10) + 'V180M346 ' + (y + 10) + 'V180" stroke="' + I + '" stroke-width="3.4"/>'; }
function spark(x, y, s) { return '<path class="cm-tw" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-7l1.9 5.1L7 0l-5.1 1.9L0 7l-1.9-5.1L-7 0l5.1-1.9z" fill="#ffd84d"/>'; }
// คนตัวกลม ๆ ไม่มีหน้า (ใช้แทน "คนทั่วไป") + ป้ายชื่อ
function person(x, y, c, label) {
  return '<g transform="translate(' + x + ' ' + y + ')" stroke="' + I + '" stroke-width="2"><circle cx="0" cy="0" r="10" fill="#f7d9b3"/><path d="M-14 40v-18q0-10 14-10t14 10v18z" fill="' + c + '"/>' +
    '<rect x="-20" y="22" width="40" height="13" rx="6" fill="#fff" stroke-width="1.4"/><text x="0" y="32" text-anchor="middle" font-size="8.5" font-weight="800" fill="' + I + '" stroke="none" font-family="sans-serif">' + label + '</text></g>';
}

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
  '<g class="cm-tw" stroke="#ffd84d" stroke-width="3" stroke-linecap="round"><path d="M228 98l-6-6M276 96l4-7"/></g>';},
 // ===== เงินกู้ =====
 // ก่อนยืม: โต๊ะคาเฟ่ ธนบัตร + หนังสือยืมเงินมีลายเซ็น
 iou:function(k){return bg(k,'#fff4e0','#ffe0b8','#e5b27a')+desk(126)+
  '<g transform="translate(150 92) rotate(-5)" stroke="'+I+'" stroke-width="2"><rect width="70" height="44" rx="3" fill="#fff"/><text x="35" y="14" text-anchor="middle" font-size="9" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">หนังสือยืมเงิน</text><path d="M10 22h50M10 29h36" stroke="#c4cbd6" stroke-width="2" stroke-linecap="round"/><path d="M38 38q5-7 9 0t9 0" stroke="#3b6fd6" fill="none" stroke-width="2"/></g>'+
  '<g transform="translate(236 100)"><g class="cm-pop" stroke="'+I+'" stroke-width="1.8"><rect x="0" y="6" width="52" height="24" rx="3" fill="#8fd39f"/><rect x="4" y="0" width="52" height="24" rx="3" fill="#a8e0b4"/><circle cx="30" cy="12" r="7" fill="#e6f7ea"/><text x="30" y="16" text-anchor="middle" font-size="10" font-weight="800" fill="#2e7d4a" stroke="none" font-family="sans-serif">฿</text></g></g>'+
  '<g transform="translate(306 96)" stroke="'+I+'" stroke-width="1.8"><path d="M2 8h22l-3 22H5z" fill="#fff"/><path d="M24 12q8 0 6 8t-8 6" fill="none"/><path d="M8 2q2 3 0 5M15 1q2 3 0 5" stroke="#c4cbd6" fill="none"/></g>'+spark(222,84,1);},
 // ดอกเบี้ย: เครื่องคิดเลข + มิเตอร์ % มีขีดแดงเพดาน 15
 rate:function(k){return bg(k,'#eefaf3','#cdeeda','#a8d5b5')+desk(130)+
  '<g transform="translate(132 76)" stroke="'+I+'" stroke-width="2"><rect width="50" height="56" rx="6" fill="#3b4a66"/><rect x="6" y="6" width="38" height="14" rx="2" fill="#d7f5e1"/><text x="40" y="17" text-anchor="end" font-size="10" font-weight="800" fill="#2e7d4a" stroke="none" font-family="sans-serif">15%</text>'+
   [0,1,2,3,4,5].map(function(i){return '<rect x="'+(7+(i%3)*13)+'" y="'+(26+Math.floor(i/3)*13)+'" width="10" height="9" rx="2" fill="#f7efdc" stroke-width="1.2"/>';}).join('')+'</g>'+
  '<g transform="translate(270 128)"><path d="M-48 0a48 48 0 0 1 96 0" fill="#fff" stroke="'+I+'" stroke-width="2.4"/><path d="M-40 0a40 40 0 0 1 56-36.7" fill="none" stroke="#7cc58a" stroke-width="10"/><path d="M16-36.7a40 40 0 0 1 24 36.7" fill="none" stroke="#ff8a7a" stroke-width="10"/><path d="M16-36.7l5-11" stroke="#e0453a" stroke-width="3" stroke-linecap="round"/><text x="24" y="-50" font-size="10" font-weight="800" fill="#e0453a" font-family="sans-serif">15</text><g class="cm-needle"><path d="M0 0l-22-26" stroke="'+I+'" stroke-width="3.4" stroke-linecap="round"/></g><circle r="5" fill="'+I+'"/></g>';},
 // ค้ำประกัน: สัญญามีลายเซ็นสองคน + โล่ระบุวงเงิน
 guarantee:function(k){return bg(k,'#f3efff','#ddd6fb','#c4b9f0')+desk(130)+
  '<g transform="translate(140 74)" stroke="'+I+'" stroke-width="2"><rect width="66" height="56" rx="3" fill="#fff"/><text x="33" y="14" text-anchor="middle" font-size="9" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">สัญญาค้ำประกัน</text><path d="M8 22h50M8 29h40" stroke="#c4cbd6" stroke-width="2" stroke-linecap="round"/><rect x="8" y="34" width="34" height="7" rx="2" fill="#ffd84d" stroke="none" opacity=".8"/><path d="M8 50q4-6 8 0t8 0M38 50q4-6 8 0t8 0" stroke="#3b6fd6" fill="none" stroke-width="1.8"/></g>'+
  '<g transform="translate(236 72)"><g class="cm-pop" stroke="'+I+'" stroke-width="2.2"><path d="M28 0l26 9v18c0 18-12 28-26 34c-14-6-26-16-26-34V9z" fill="#8f7ad6"/><text x="28" y="30" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" stroke="none" font-family="sans-serif">วงเงิน</text><text x="28" y="44" text-anchor="middle" font-size="10" font-weight="800" fill="#ffd84d" stroke="none" font-family="sans-serif">สูงสุด</text></g></g>'+
  '<g stroke="#8f7ad6" stroke-width="2.4" fill="none" opacity=".6"><path d="M206 100q14 0 26-8"/></g>'+spark(318,92,.9);},
 // อายุความ: นาฬิกาทราย + ปฏิทิน 10 ปี
 hourglass:function(k){return bg(k,'#fff6e8','#f6e1c0','#e2bd85')+desk(130)+
  '<g transform="translate(150 66)" stroke="'+I+'" stroke-width="2.2"><rect x="-4" y="0" width="52" height="7" rx="3" fill="#b07a45"/><rect x="-4" y="59" width="52" height="7" rx="3" fill="#b07a45"/><path d="M4 7h36q0 18-14 26q14 8 14 26H4q0-18 14-26Q4 25 4 7z" fill="#e8f6ff"/><path d="M10 14h24q-3 9-12 15q-9-6-12-15z" fill="#f4c542" stroke="none"/><path d="M8 56q14-14 28 0z" fill="#f4c542" stroke="none"/><path class="cm-sand" d="M22 31v20" stroke="#f4c542" stroke-width="2.4"/></g>'+
  '<g transform="translate(232 82)" stroke="'+I+'" stroke-width="2"><rect width="56" height="48" rx="5" fill="#fff"/><rect width="56" height="13" rx="5" fill="#ff6b5a"/><path d="M14-5v10M42-5v10" stroke-width="2.6" stroke-linecap="round"/><text x="28" y="38" text-anchor="middle" font-size="17" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">10 ปี</text></g>'+spark(312,100,1);},
 // ===== ทวงหนี้ =====
 // ใครได้รับความคุ้มครอง: ร่มใหญ่กันฝนข้อความทวง ให้คนสองคน
 umbrella:function(k){return bg(k,'#e9f1ff','#cbdcf7','#a9c0e6')+
  '<g class="cm-rain" stroke="#7f9cc9" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M120 10l-4 9M150 24l-4 9M300 20l-4 9M330 40l-4 9M110 50l-4 9M340 70l-4 9"/></g>'+
  '<g transform="translate(232 60)"><path d="M-70 26q70-60 140 0q-12-8-23 0q-12-9-24 0q-12-9-23 0q-12-9-24 0q-11-8-23 0q-12-8-23 0z" fill="#ff8a5b" stroke="'+I+'" stroke-width="2.4" stroke-linejoin="round"/><path d="M0-8v84q0 8-8 8" fill="none" stroke="'+I+'" stroke-width="3" stroke-linecap="round"/></g>'+
  person(196,104,'#6fb3a8','ลูกหนี้')+person(268,104,'#f3a07d','ผู้ค้ำ')+'<rect x="0" y="152" width="360" height="28" fill="#a9c0e6"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>';},
 // เวลาทวง: ครึ่งกลางวัน ครึ่งกลางคืน นาฬิกา 8–20
 hours:function(k){return '<rect width="360" height="180" fill="#fff4cf"/><path d="M230 0h130v180H230z" fill="#3b4377"/><circle cx="160" cy="34" r="0" />'+
  '<g class="cm-tw"><circle cx="128" cy="40" r="14" fill="#ffd84d" stroke="'+I+'" stroke-width="2"/></g><path d="M330 26a12 12 0 1 0 11 17a10 10 0 1 1-11-17z" fill="#ffe9a8"/><g fill="#fff"><circle cx="300" cy="20" r="1.3"/><circle cx="346" cy="70" r="1"/><circle cx="252" cy="16" r="1.2"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#d8c48e"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g transform="translate(230 112)" stroke="'+I+'" stroke-width="2.4"><circle r="34" fill="#fff"/><path d="M0-34a34 34 0 0 1 0 68" fill="#e7e9f7" stroke="none"/><circle r="34" fill="none"/><path d="M0 0v-22M0 0l15 9" stroke-width="3" stroke-linecap="round"/><circle r="3" fill="'+I+'"/><text x="-20" y="4" font-size="9" font-weight="800" fill="#2e7d4a" stroke="none" font-family="sans-serif">8</text><text x="12" y="-14" font-size="8" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">20</text></g>'+
  '<g transform="translate(132 118)"><rect width="56" height="22" rx="11" fill="#7cc58a" stroke="'+I+'" stroke-width="2"/><text x="28" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">ทวงได้</text></g>'+
  '<g transform="translate(282 126)"><rect width="56" height="22" rx="11" fill="#e0453a" stroke="'+I+'" stroke-width="2"/><text x="28" y="15" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">ห้ามโทร</text></g>';},
 // สิ่งที่ห้ามทำ: โทรโข่ง ข้อความด่า ถูกห้ามด้วยวงแดง
 nothreat:function(k){return bg(k,'#fff0f0','#ffd6d6','#f0b3b3')+
  '<g transform="translate(160 104)" stroke="'+I+'" stroke-width="2.2"><path d="M0 8l40-18v44L0 16z" fill="#ffd84d"/><rect x="-14" y="4" width="16" height="16" rx="3" fill="#f3a07d"/><path d="M-6 20l4 16h8l-2-16" fill="#f3a07d"/></g>'+
  '<g transform="translate(212 74)" stroke="'+I+'" stroke-width="2"><path d="M0 0h60a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H20l-10 9v-9H0a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z" fill="#fff"/><text x="30" y="25" text-anchor="middle" font-size="14" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">#@!%</text></g>'+
  '<g transform="translate(244 92)"><g class="cm-pop"><circle r="46" fill="none" stroke="#e0453a" stroke-width="7" opacity=".9"/><path d="M-32-32l64 64" stroke="#e0453a" stroke-width="7" stroke-linecap="round" opacity=".9"/></g></g>'+
  '<g transform="translate(300 116)" stroke="'+I+'" stroke-width="2"><rect width="40" height="28" rx="3" fill="#fff"/><path d="M0 2l20 14 20-14" fill="none"/><path d="M28 -4l12 12M40 -4L28 8" stroke="#e0453a" stroke-width="3" stroke-linecap="round"/></g>';},
 // ร้องเรียน: อาคารที่ว่าการ/สถานีตำรวจ + มือถือบันทึกหลักฐาน
 complain:function(k){return bg(k,'#eaf6ff','#cfe6fb','#a9cde6')+
  '<g stroke="'+I+'" stroke-width="2.2"><path d="M200 152V96h120v56" fill="#fff"/><path d="M188 96l72-30 72 30z" fill="#3b6fd6"/><rect x="246" y="120" width="28" height="32" fill="#b07a45"/>'+
  '<rect x="212" y="106" width="20" height="16" fill="#9fd3ff"/><rect x="288" y="106" width="20" height="16" fill="#9fd3ff"/></g><text x="260" y="88" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="sans-serif">ร้องเรียน</text>'+
  '<g stroke="'+I+'" stroke-width="2"><path d="M330 96V58" stroke-width="2.6"/><rect x="330" y="58" width="22" height="15" fill="#fff"/></g><g fill="#e0453a"><rect x="331" y="59" width="21" height="3"/><rect x="331" y="69" width="21" height="3"/></g><rect x="331" y="63" width="21" height="5" fill="#3b4fd6"/>'+
  '<g transform="translate(128 86)"><g class="cm-pop" stroke="'+I+'" stroke-width="2"><rect width="38" height="62" rx="7" fill="#24283d"/><rect x="4" y="8" width="30" height="44" rx="3" fill="#fff"/><circle cx="19" cy="24" r="7" fill="#e0453a"/><path d="M9 38h20M9 44h14" stroke="#c4cbd6" stroke-width="2.4" stroke-linecap="round"/></g></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#a9cde6"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>';},
 // ===== มิจฉาชีพ =====
 // เพิ่งโอน: มือถือโทรหาธนาคาร + นาฬิกาจับเวลา 72 ชม.
 bankcall:function(k){return bg(k,'#fff0f4','#fbd3df','#eeb0c4')+
  '<g stroke="'+I+'" stroke-width="2.2"><path d="M250 152V100h96v52" fill="#fff"/><path d="M240 100l58-26 58 26z" fill="#2e7d4a"/><path d="M262 108v38M284 108v38M306 108v38M328 108v38" stroke-width="3"/></g><text x="298" y="96" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="sans-serif">ธนาคาร</text>'+
  '<g transform="translate(130 80)"><g class="cm-vibx" stroke="'+I+'" stroke-width="2"><rect width="40" height="66" rx="7" fill="#24283d"/><rect x="4" y="8" width="32" height="48" rx="3" fill="#ff7a6b"/><circle cx="20" cy="26" r="8" fill="#fff"/><path d="M16 24q0 6 7 6l1.2-2-2.4-1.6-1.3 1.1q-2-.8-2.8-2.8l1.1-1.3-1.6-2.4z" fill="#e0453a" stroke="none"/><path d="M10 44h20" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g></g>'+
  '<g fill="none" stroke="#e0453a" stroke-width="2.2" stroke-linecap="round" opacity=".6"><path d="M180 104q8 6 0 14M188 98q14 12 0 26"/></g>'+
  '<g transform="translate(212 118)" stroke="'+I+'" stroke-width="2.2"><circle r="20" fill="#fff7e6"/><rect x="-5" y="-27" width="10" height="6" rx="2" fill="#8a96a8"/><text x="0" y="5" text-anchor="middle" font-size="12" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">72</text></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#eeb0c4"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>';},
 // บัญชีม้า: น้องม้าคาบบัตร ATM + ป้ายห้าม
 mule:function(k){return bg(k,'#fff7e8','#fde3bd','#e8c08a')+
  '<g transform="translate(206 76)" stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round"><path d="M22 76V44h32v32z" fill="#d9a066"/><path d="M14 8l4-16 10 12zM38 6l8-14 4 16z" fill="#d9a066"/><ellipse cx="32" cy="28" rx="22" ry="25" fill="#d9a066"/><path d="M44 6q16 8 14 34q-2 18 0 36h-6q-6-30-12-62z" fill="#6b3f22"/><ellipse cx="22" cy="50" rx="19" ry="13" fill="#f0c495"/><circle cx="16" cy="49" r="2" fill="'+I+'"/><circle cx="28" cy="49" r="2" fill="'+I+'"/><path d="M16 57q6 4 12 0" fill="none"/><circle cx="38" cy="24" r="4" fill="'+I+'"/><circle cx="39.4" cy="22.6" r="1.3" fill="#fff" stroke="none"/><ellipse cx="46" cy="36" rx="4" ry="2.4" fill="#f4a7a0" stroke="none" opacity=".8"/></g>'+
  '<g transform="translate(168 118) rotate(-14)"><g class="cm-pop" stroke="'+I+'" stroke-width="2"><rect width="44" height="28" rx="4" fill="#3b6fd6"/><rect y="6" width="44" height="6" fill="#24283d" stroke="none"/><rect x="5" y="16" width="10" height="7" rx="1.5" fill="#f4c542"/></g></g>'+
  '<g transform="translate(298 104)"><circle r="22" fill="#fff" stroke="#e0453a" stroke-width="5"/><path d="M-15 15l30-30" stroke="#e0453a" stroke-width="5"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="800" fill="'+I+'" font-family="sans-serif">฿</text></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#e8c08a"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>';},
 // ใครรับผิดชอบ: ธนาคาร เสาสัญญาณ แชตโซเชียล ต่อเส้นมาที่ตาชั่ง
 shared:function(k){return bg(k,'#f2efff','#ddd7fa','#c2b8ef')+
  '<g stroke="'+I+'" stroke-width="2"><path d="M118 132V100h40v32" fill="#fff"/><path d="M112 100l26-12 26 12z" fill="#2e7d4a"/><path d="M128 104v24M138 104v24M148 104v24" stroke-width="2.4"/></g>'+
  '<g stroke="'+I+'" stroke-width="2.2" fill="none"><path d="M196 132l10-46 10 46M200 116h12M198 124h16"/><circle cx="206" cy="84" r="3" fill="#e0453a"/></g><g fill="none" stroke="#8f7ad6" stroke-width="2" stroke-linecap="round" class="cm-tw"><path d="M194 76q-6 8 0 16M218 76q6 8 0 16"/></g>'+
  '<g transform="translate(240 92)" stroke="'+I+'" stroke-width="2"><path d="M0 0h40a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H14l-8 7v-7H0a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z" fill="#3b6fd6"/><circle cx="12" cy="15" r="3" fill="#fff" stroke="none"/><circle cx="20" cy="15" r="3" fill="#fff" stroke="none"/><circle cx="28" cy="15" r="3" fill="#fff" stroke="none"/></g>'+
  '<g transform="translate(316 96)" stroke="'+I+'" stroke-width="2"><path d="M0 0v40M-14 40h28" stroke-width="2.6"/><g class="cm-pop"><path d="M-16 6h32" stroke-width="2.4"/><path d="M-16 6l-6 12h12zM16 6l-6 12h12z" fill="#ffd84d"/></g></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#c2b8ef"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/><path d="M0 132h360" stroke="'+I+'" stroke-width="0"/>'+'<rect x="100" y="132" width="260" height="6" fill="#a99de6"/>';},
 // ===== ข้อสัญญา =====
 // ไม่เป็นธรรม: ตาชั่งใหญ่ เอียงข้างที่มีสัญญาหนา ๆ
 tilt:function(k){return bg(k,'#fff8dc','#f6e3a8','#e2c27a')+
  '<g transform="translate(236 0)" stroke="'+I+'" stroke-width="2.4"><path d="M0 150V78" stroke-width="3.4"/><path d="M-24 152h48" stroke-width="4" stroke-linecap="round"/><circle cy="76" r="5" fill="#f4c542"/><g class="cm-scale2"><path d="M-70 66l140 24" stroke-width="3"/><path d="M-70 66l-14 26h28zM70 90l-14 26h28z" fill="none" stroke-width="1.4"/><path d="M-88 92h36q-4 9-18 9q-14 0-18-9z" fill="#f4c542"/><path d="M52 116h36q-4 9-18 9q-14 0-18-9z" fill="#f4c542"/><g stroke-width="1.8"><rect x="54" y="92" width="32" height="24" rx="2" fill="#fff"/><rect x="57" y="86" width="32" height="24" rx="2" fill="#fff"/><path d="M62 94h22M62 100h16" stroke="#c4cbd6"/></g><circle cx="-70" cy="86" r="5" fill="#fff"/></g></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#e2c27a"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>';},
 // มัดจำ ค่าปรับ: ถุงเงินมีป้ายราคาใหญ่ กรรไกรตัดลดลง
 cut:function(k){return bg(k,'#eefaf3','#cdeeda','#a8d5b5')+desk(132)+
  '<g transform="translate(150 70)" stroke="'+I+'" stroke-width="2.2"><path d="M20 10q-6-10 4-10h16q10 0 4 10q22 10 22 36q0 18-34 18T-2 46q0-26 22-36z" fill="#d6a76a"/><path d="M18 10h28" stroke-width="3" stroke-linecap="round"/><text x="32" y="46" text-anchor="middle" font-size="16" font-weight="800" fill="#7a4a1a" stroke="none" font-family="sans-serif">฿</text></g>'+
  '<g transform="translate(224 84)" stroke="'+I+'" stroke-width="2"><path d="M0 8l10-10h56v36H10z" fill="#fff"/><circle cx="10" cy="8" r="3" fill="#cdeeda"/><text x="40" y="12" text-anchor="middle" font-size="11" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif" text-decoration="line-through">ค่าปรับสูง</text><text x="40" y="28" text-anchor="middle" font-size="11" font-weight="800" fill="#2e7d4a" stroke="none" font-family="sans-serif">ลดลง ✓</text></g>'+
  '<g transform="translate(300 74)"><g class="cm-snip" stroke="'+I+'" stroke-width="2"><circle cx="0" cy="0" r="6" fill="none" stroke-width="2.4"/><circle cx="0" cy="16" r="6" fill="none" stroke-width="2.4"/><path d="M5 3l22 14M5 13l22-14" stroke-width="2.6" stroke-linecap="round"/></g></g>'+spark(206,70,1);},
 // ห้ามทำงานคู่แข่ง: แผนที่มีรั้วล้อมพื้นที่ + ปฏิทินระยะเวลา
 fence:function(k){return bg(k,'#eef6ff','#d3e4f7','#b4cbe6')+
  '<g transform="translate(150 80)" stroke="'+I+'" stroke-width="2"><path d="M0 8l40-8 40 8 40-8v60l-40 8-40-8-40 8z" fill="#e9f5e1"/><path d="M40 0v60M80 8v60" stroke="#9fc58a" stroke-width="1.6"/><path d="M14 30q20-14 40 2t40-2" fill="none" stroke="#7fb3e6" stroke-width="3"/><circle cx="62" cy="34" r="16" fill="none" stroke="#e0453a" stroke-width="2.4" stroke-dasharray="4 3"/><path d="M62 22c-6 0-8 5-8 8 0 6 8 12 8 12s8-6 8-12c0-3-2-8-8-8z" fill="#e0453a" stroke-width="1.6"/></g>'+
  '<g transform="translate(290 94)" stroke="'+I+'" stroke-width="2"><rect width="46" height="40" rx="4" fill="#fff"/><rect width="46" height="11" rx="4" fill="#3b6fd6"/><text x="23" y="32" text-anchor="middle" font-size="12" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">?ปี</text></g>'+
  '<g stroke="#b07a45" stroke-width="3" stroke-linecap="round"><path d="M110 152v-22M126 152v-22M142 152v-22M110 136h40"/></g>'+
  '<rect x="0" y="152" width="360" height="28" fill="#b4cbe6"/><path d="M0 152h360" stroke="'+I+'" stroke-width="2"/>'+spark(332,80,.9);},
 // ===== วันลา =====
 // ลาป่วย: เตียง ผ้าห่ม ปรอท ยา ใบรับรองแพทย์
 sick:function(k){return bg(k,'#f2f7ff','#dbe7fb','#b9cbe6')+
  '<g stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round"><rect x="214" y="96" width="140" height="44" rx="6" fill="#fff"/><path d="M214 152v-60M354 152v-40" stroke-width="4"/><rect x="220" y="86" width="40" height="18" rx="8" fill="#fff7e6"/><path d="M246 104q30-14 108-4v40H246z" fill="#8fb8f0"/><path d="M262 112q30-6 80-2M262 124q30-4 80 0" stroke="#6f9ad6" stroke-width="2" fill="none"/></g>'+
  '<g stroke="'+I+'" stroke-width="2"><rect x="128" y="112" width="70" height="40" rx="3" fill="#c48d55"/><path d="M128 124h70" stroke-width="1.6"/></g>'+
  '<g transform="translate(136 82)" stroke="'+I+'" stroke-width="1.8"><rect width="20" height="30" rx="3" fill="#fff"/><rect y="0" width="20" height="8" rx="3" fill="#e0453a"/><path d="M6 18h8M10 14v8" stroke="#e0453a" stroke-width="2.4" stroke-linecap="round"/></g>'+
  '<g transform="translate(164 92)" stroke="'+I+'" stroke-width="1.6"><path d="M0 0h14l-2 20H2z" fill="#cfefff"/><path d="M1 8h12" stroke="#7fb3e6"/></g>'+
  '<g transform="translate(150 108) rotate(-8)"><g class="cm-pop" stroke="'+I+'" stroke-width="1.6"><rect width="44" height="30" rx="2" fill="#fff"/><path d="M6 8h20M6 14h30M6 20h24" stroke="#c4cbd6" stroke-width="2" stroke-linecap="round"/><circle cx="36" cy="9" r="5" fill="#fff" stroke="#e0453a"/><path d="M36 6v6M33 9h6" stroke="#e0453a" stroke-width="1.8"/></g></g>'+
  '<g class="cm-tw" fill="none" stroke="#7fb3e6" stroke-width="2.2" stroke-linecap="round"><path d="M300 76h8l-8 8h8M316 64h6l-6 6h6"/></g>';},
 // ลากิจ: บัตรประชาชน แฟ้มเอกสาร บัตรคิว นาฬิกา
 errand:function(k){return bg(k,'#fff7ec','#ffe5c7','#e8c08a')+desk(128)+
  '<g transform="translate(104 34)" stroke="'+I+'" stroke-width="2"><circle cx="18" cy="18" r="18" fill="#fff"/><path d="M18 18V7M18 18l8 4" stroke-width="2.6" stroke-linecap="round"/></g>'+
  '<g transform="translate(144 92) rotate(-6)" stroke="'+I+'" stroke-width="2"><rect width="58" height="36" rx="5" fill="#9fd3ff"/><circle cx="14" cy="16" r="7" fill="#fff7e6"/><path d="M26 12h24M26 19h18M8 29h40" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>'+
  '<g transform="translate(214 88)" stroke="'+I+'" stroke-width="2"><path d="M0 6h20l4-6h36v40H0z" fill="#f6c86b"/><rect x="6" y="12" width="48" height="24" rx="2" fill="#fff"/><path d="M12 20h30M12 27h22" stroke="#c4cbd6" stroke-width="2" stroke-linecap="round"/></g>'+
  '<g transform="translate(290 96)"><g class="cm-pop" stroke="'+I+'" stroke-width="2"><rect width="40" height="30" rx="4" fill="#fff7e6"/><text x="20" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#d9731a" stroke="none" font-family="sans-serif">B07</text></g></g>'+spark(276,86,.9);},
 // พักร้อน: ชายหาด ร่มชายหาด เก้าอี้ผ้าใบ กระเป๋าเดินทาง
 vacation:function(k){return '<defs><linearGradient id="va'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8ff"/><stop offset="1" stop-color="#e9f8ff"/></linearGradient></defs><rect width="360" height="180" fill="url(#va'+k+')"/>'+
  '<g class="cm-tw"><circle cx="132" cy="34" r="16" fill="#ffd84d" stroke="'+I+'" stroke-width="2"/></g><path d="M0 104q30-8 60 0t60 0t60 0t60 0t60 0t60 0V128H0z" fill="#4fb6e0"/><path class="cm-wave" d="M0 112q30-6 60 0t60 0t60 0t60 0t60 0t60 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8"/>'+
  '<rect x="0" y="124" width="360" height="56" fill="#f6dc9f"/><path d="M0 124h360" stroke="'+I+'" stroke-width="2"/>'+
  '<g stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round"><path d="M226 150V70" stroke-width="3"/><path d="M176 84q50-40 100 0q-12-8-25 0q-12-8-25 0q-12-8-25 0q-12-8-25 0z" fill="#ff6b5a"/><path d="M201 84q25-36 25-36q0 0 25 36" fill="none" stroke-width="1.6"/></g>'+
  '<g stroke="'+I+'" stroke-width="2" stroke-linejoin="round"><path d="M250 150l14-30h40l-10 30" fill="none" stroke-width="2.6"/><path d="M262 124h40l-8 18h-40z" fill="#3bb3a0"/><path d="M270 124l-8 18M286 124l-8 18" stroke="#fff" stroke-width="3"/></g>'+
  '<g transform="translate(140 118)"><g class="cm-pop" stroke="'+I+'" stroke-width="2" stroke-linejoin="round"><rect width="40" height="34" rx="5" fill="#f08a5d"/><path d="M12 0v-8h16v8" fill="none" stroke-width="2.6"/><circle cx="12" cy="20" r="4" fill="#ffd84d" stroke-width="1.4"/><rect x="20" y="14" width="12" height="8" rx="2" fill="#7cc58a" stroke-width="1.4"/></g></g>';},
 // วันหยุด: ธงราวงาน ปฏิทินวงวันหยุด ป้าย 13 วัน
 holiday:function(k){return bg(k,'#fff3f8','#ffd9e8','#f0b3c9')+
  '<g stroke="'+I+'" stroke-width="1.4" stroke-linejoin="round"><path d="M96 14q32 18 64 4" fill="none"/><path d="M104 18l6 14 8-12z" fill="#ffd84d"/><path d="M122 24l5 14 9-11z" fill="#3bb3a0"/><path d="M140 24l4 14 9-12z" fill="#ff6b5a"/></g>'+
  '<g transform="translate(172 96)" stroke="'+I+'" stroke-width="2"><rect width="110" height="56" rx="5" fill="#fff"/><rect width="110" height="14" rx="5" fill="#ff6b5a"/>'+
   [0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(function(i){return '<rect x="'+(6+(i%7)*15)+'" y="'+(20+Math.floor(i/7)*19)+'" width="12" height="14" rx="2" fill="#f1f3f8" stroke="none"/>';}).join('')+
   '<g fill="none" stroke="#e0453a" stroke-width="2.2"><circle cx="27" cy="27" r="8"/><circle cx="87" cy="27" r="8"/><circle cx="57" cy="46" r="8"/></g></g>'+
  '<g transform="translate(296 102)"><g class="cm-pop" stroke="'+I+'" stroke-width="2"><circle cx="22" cy="22" r="22" fill="#ffd84d"/><text x="22" y="22" text-anchor="middle" font-size="15" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">13</text><text x="22" y="34" text-anchor="middle" font-size="8" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">วันขึ้นไป</text></g></g>'+spark(140,96,1);},
 // ===== OT =====
 // เวลาทำงานปกติ: แถบเวลา 8 ชั่วโมง + นาฬิกา + โต๊ะทำงาน
 workday:function(k){return bg(k,'#eef6ff','#d6e7fb','#b4cbe6')+desk(128)+
  '<g transform="translate(104 36)" stroke="'+I+'" stroke-width="2"><circle cx="18" cy="18" r="18" fill="#fff"/><path d="M18 18V6M18 18l9 0" stroke-width="2.6" stroke-linecap="round"/></g>'+
  '<g transform="translate(132 84)" stroke="'+I+'" stroke-width="2"><rect width="200" height="22" rx="11" fill="#fff"/><g class="cm-fill"><rect x="2" y="2" width="150" height="18" rx="9" fill="#7cc58a" stroke="none"/></g><rect x="152" y="2" width="46" height="18" rx="9" fill="#ff8a7a" stroke="none" opacity=".85"/><text x="76" y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" stroke="none" font-family="sans-serif">8 ชม.</text><text x="175" y="16" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" stroke="none" font-family="sans-serif">OT</text></g>'+
  '<g stroke="'+I+'" stroke-width="2" stroke-linejoin="round"><path d="M208 128l4-14h30l4 14z" fill="#3b4a66"/><rect x="214" y="114" width="22" height="2" fill="#9fd3ff"/></g><g stroke="'+I+'" stroke-width="1.8"><path d="M268 112h12l-2 16h-8z" fill="#fff"/><path d="M280 116q5 0 4 5t-5 3" fill="none"/></g>'+spark(318,118,.9);},
 // ต้องยินยอม: ปุ่ม ตกลง / ไม่ตกลง + มือถือแชตขอ OT
 consent:function(k){return bg(k,'#f4fff0','#d9f2cf','#b5dca5')+
  '<g transform="translate(132 84)" stroke="'+I+'" stroke-width="2"><rect width="44" height="68" rx="7" fill="#24283d"/><rect x="4" y="8" width="36" height="50" rx="3" fill="#fff"/><path d="M8 16h22a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H14l-4 3v-3H8z" fill="#e9eef6" stroke-width="1.2"/><text x="20" y="25" text-anchor="middle" font-size="7" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">OT ไหม?</text></g>'+
  '<g transform="translate(196 104)"><g class="cm-pop" stroke="'+I+'" stroke-width="2.2"><rect width="62" height="30" rx="15" fill="#7cc58a"/><text x="31" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" stroke="none" font-family="sans-serif">ยินยอม</text></g></g>'+
  '<g transform="translate(266 104)" stroke="'+I+'" stroke-width="2.2"><rect width="62" height="30" rx="15" fill="#fff"/><text x="31" y="20" text-anchor="middle" font-size="12" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">ไม่สะดวก</text></g>'+
  '<g stroke="'+I+'" stroke-width="2" stroke-linecap="round"><path d="M226 98l4-8M296 98l-4-8" stroke="#3bb3a0"/></g>';},
 // อัตราค่า OT: กองเหรียญ 3 ขนาด ป้าย 1.5× 2× 3×
 rates:function(k){var cs=function(x,n){return coins(x,138,n);};return bg(k,'#fffbea','#ffefb8','#e8cf86')+
  '<rect x="100" y="138" width="260" height="14" fill="#e8cf86"/>'+cs(160,3)+cs(240,5)+cs(318,8)+
  '<g font-family="sans-serif" font-weight="800" text-anchor="middle"><g transform="translate(160 112)"><rect x="-26" y="-14" width="52" height="22" rx="11" fill="#fff" stroke="'+I+'" stroke-width="2"/><text y="2" font-size="11" fill="#3b6fd6">1.5×</text></g>'+
  '<g transform="translate(240 102)"><rect x="-26" y="-14" width="52" height="22" rx="11" fill="#fff" stroke="'+I+'" stroke-width="2"/><text y="2" font-size="11" fill="#2e7d4a">1–2×</text></g>'+
  '<g transform="translate(318 88)"><g class="cm-pop"><rect x="-24" y="-14" width="48" height="22" rx="11" fill="#ff6b5a" stroke="'+I+'" stroke-width="2"/><text y="2" font-size="12" fill="#fff">3×</text></g></g></g>'+
  '<g font-family="sans-serif" font-weight="700" font-size="8" fill="#7a5a00" text-anchor="middle"><text x="160" y="164">OT</text><text x="240" y="164">วันหยุด</text><text x="318" y="164">OT วันหยุด</text></g>';},
 // ใครไม่ได้ OT: เก้าอี้ผู้บริหาร ป้ายชื่อ "ผู้จัดการ" + กระเป๋าเซลส์
 manager:function(k){return bg(k,'#f5f1ea','#e6dccb','#cdbda1')+desk(128)+
  '<g stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round"><path d="M248 62h48q6 0 6 6v50h-60V68q0-6 6-6z" fill="#7a4a2a"/><rect x="236" y="112" width="72" height="14" rx="5" fill="#8d5a33"/></g>'+
  '<g transform="translate(150 106)" stroke="'+I+'" stroke-width="2"><path d="M0 22l6-22h56l6 22z" fill="#c89a62"/><rect x="10" y="6" width="48" height="12" rx="2" fill="#fff"/><text x="34" y="15" text-anchor="middle" font-size="8" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">ผู้จัดการ</text></g>'+
  '<g transform="translate(320 104)"><g class="cm-pop" stroke="'+I+'" stroke-width="2"><rect width="30" height="24" rx="4" fill="#3b4a66"/><path d="M9 0v-6h12v6" fill="none" stroke-width="2.4"/><text x="15" y="16" text-anchor="middle" font-size="9" font-weight="800" fill="#ffd84d" stroke="none" font-family="sans-serif">%</text></g></g>'+spark(220,80,.9);},
 // OT ไม่จ่าย: สลิปเงินเดือนช่อง OT ว่าง + แว่นขยาย + ป้าย +15%
 payslip:function(k){return bg(k,'#fff1ee','#ffd8cf','#efb3a5')+desk(130)+
  '<g transform="translate(140 74) rotate(-4)" stroke="'+I+'" stroke-width="2"><rect width="78" height="56" rx="3" fill="#fff"/><text x="39" y="12" text-anchor="middle" font-size="8" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">สลิปเงินเดือน</text><path d="M8 20h40M8 30h40" stroke="#c4cbd6" stroke-width="2" stroke-linecap="round"/><text x="8" y="44" font-size="8" font-weight="800" fill="#e0453a" stroke="none" font-family="sans-serif">OT</text><rect x="26" y="37" width="44" height="10" rx="2" fill="#ffe1dc" stroke="#e0453a" stroke-width="1.6" stroke-dasharray="3 2"/></g>'+
  '<g transform="translate(196 112)"><g class="cm-pop"><circle r="15" fill="#cfefff" fill-opacity=".6" stroke="'+I+'" stroke-width="3"/><path d="M10 11l12 12" stroke="#8a5a08" stroke-width="5" stroke-linecap="round"/></g></g>'+
  '<g transform="translate(258 92)" stroke="'+I+'" stroke-width="2"><rect width="46" height="40" rx="4" fill="#fff"/><rect width="46" height="11" rx="4" fill="#ff6b5a"/><text x="23" y="32" text-anchor="middle" font-size="12" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">7 วัน</text></g>'+
  '<g transform="translate(316 96)" stroke="'+I+'" stroke-width="2"><circle cx="16" cy="16" r="16" fill="#ffd84d"/><text x="16" y="20" text-anchor="middle" font-size="10" font-weight="800" fill="'+I+'" stroke="none" font-family="sans-serif">+15%</text></g>';}
};
var BG={
 overtime:'<g fill="#fff" opacity=".85"><circle cx="210" cy="16" r="1.3"/><circle cx="250" cy="28" r="1"/><circle cx="290" cy="12" r="1.5"/><circle cx="230" cy="164" r="1.1"/><circle cx="300" cy="168" r="1.3"/></g><path d="M338 12a11 11 0 1 0 10 16a9 9 0 1 1-10-16z" fill="#ffe9a8"/><g opacity=".5" stroke="#ffd2a0" stroke-width="2"><circle cx="330" cy="150" r="12" fill="none"/><path d="M330 150v-7M330 150l5 2" stroke-linecap="round"/></g>',
 leave:'<path d="M300 22l26-8-4 6 10 2-6 4 6 6-10-2z" fill="#fff" stroke="#3a2a12" stroke-width="1.4" stroke-linejoin="round" opacity=".85"/><path d="M296 26q-30 10-60 2" fill="none" stroke="#7fb3e6" stroke-width="2" stroke-dasharray="4 5"/><path d="M200 166q20-6 40 0t40 0t40 0t40 0" fill="none" stroke="#7fc6e6" stroke-width="3" opacity=".7"/><circle cx="342" cy="150" r="8" fill="#ffd84d" opacity=".7"/>',debt:'<g fill="#fff" opacity=".85"><circle cx="190" cy="14" r="1.3"/><circle cx="230" cy="24" r="1"/><circle cx="268" cy="10" r="1.5"/><circle cx="300" cy="26" r="1"/><circle cx="214" cy="166" r="1.2"/><circle cx="262" cy="160" r="1"/><circle cx="300" cy="168" r="1.4"/></g><path d="M338 10a11 11 0 1 0 10 16a9 9 0 1 1-10-16z" fill="#ffe9a8"/><g fill="none" stroke="#ffb3a6" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M318 152q-4 7 0 14M312 148q-8 11 0 22M346 152q4 7 0 14M352 148q8 11 0 22"/></g>',
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
