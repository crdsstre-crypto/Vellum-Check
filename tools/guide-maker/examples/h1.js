// ภาพช่องการ์ตูนของคู่มือ supplier-price-hike
VCPanels({
// [ภาพสเก็ตช์บนกระดาษกราฟวิศวกรรม เส้นดินสอฟ้า แต้มเหลือง โต๊ะทำงานไม้] เจ้าของร้านเบเกอรีถือใบเสนอราคา "450 ยืนราคา 30 วัน" มือถือดังมีข้อความ "ขึ้นเป็น 520" (น้องม้วนซ้าย)
 qhquotedesk:function(k){@@PR@@
  return '<defs><pattern id="qhg'+k+'" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#93c5fd" stroke-width=".5"/></pattern></defs><rect width="360" height="180" fill="#f8fafc"/><rect width="360" height="180" fill="url(#qhg'+k+')"/>'+
  '<g transform="translate(260 46)"><rect width="70" height="46" fill="#fff" stroke="#1e40af"/><path d="M8 34l14-12 12 8 14-16 14 6" stroke="#dc2626" stroke-width="2" fill="none"/><text x="35" y="10" text-anchor="middle" font-size="6" font-weight="900" fill="#1e40af" font-family="sans-serif">ราคาแป้ง</text></g>'+
  FL(k,'a',146,'#e2e8f0','#94a3b8','#64748b',220,{sp:30,op:.3})+
  PR(176,110,.92,{hs:'bun',h:'#3b2314',c:'#f8fafc',ap:'#d97706',e:'shock',a:'hold'})+
  CT(k,'b',100,240,142,'#d6a76c','#92400e',{panel:40})+
  '<g transform="translate(130 128) rotate(-6)"><rect x="-26" y="-16" width="52" height="30" fill="#fff" stroke="#1e40af"/><text y="-6" text-anchor="middle" font-size="5.6" font-weight="900" fill="#1e40af" font-family="sans-serif">ใบเสนอราคา</text><text y="4" text-anchor="middle" font-size="8" font-weight="900" fill="#111" font-family="sans-serif">450.-/ถุง</text><rect x="-22" y="7" width="44" height="6" fill="#fde047"/><text y="12" text-anchor="middle" font-size="4.6" font-weight="900" fill="#713f12" font-family="sans-serif">ยืนราคา 30 วัน</text></g>'+
  '<g class="cm-vibx"><g transform="translate(250 126)"><rect x="-12" y="-18" width="24" height="36" rx="4" fill="#111"/><rect x="-10" y="-14" width="20" height="26" rx="2" fill="#fef2f2"/><text y="-4" text-anchor="middle" font-size="4.4" font-weight="900" fill="#111" font-family="sans-serif">ซัพ:</text><text y="5" text-anchor="middle" font-size="5.4" font-weight="900" fill="#dc2626" font-family="sans-serif">ขึ้นเป็น 520</text></g></g>'+
  '<g transform="translate(310 128)"><path d="M-12 12h24l-2-20h-20z" fill="#fef3c7" stroke="#a16207"/><text y="6" text-anchor="middle" font-size="5" font-weight="900" fill="#a16207" font-family="sans-serif">แป้ง</text></g>';},
// [ภาพไอโซเมตริกโกดังสีส้มอบอุ่น ชั้นวางสูง กระสอบเรียง พื้นปูนมีเส้นตีช่อง] ซัพยืนกอดอกหน้ากองกระสอบแป้ง ป้าย "ไม่จ่าย 520 ไม่ส่ง" (น้องม้วนขวา)
 qhwarehouse:function(k){@@PR@@
  var bags='';for(var r=0;r<3;r++)for(var c=0;c<4;c++)bags+='<rect x="'+(24+c*26+(r%2)*13)+'" y="'+(118-r*16)+'" width="24" height="15" rx="5" fill="#fef3c7" stroke="#b45309"/>';
  return '<rect width="360" height="180" fill="#ffedd5"/><g stroke="#c2410c" stroke-width="3" opacity=".5"><path d="M10 30v104M130 30v104M10 60h120M10 90h120"/></g>'+
  FL(k,'a',134,'#d6d3d1','#a8a29e','#fbbf24',140,{sp:40,op:.5,w:2})+bags+
  PR(196,116,.95,{hs:'cap',cap:'#ea580c',h:'#111',c:'#ea580c',e:'angry',a:'up',f:1})+
  '<g transform="translate(256 104) rotate(-4)"><rect x="-34" y="-12" width="68" height="22" rx="3" fill="#fff" stroke="#dc2626" stroke-width="2"/><text y="3" text-anchor="middle" font-size="7.4" font-weight="900" fill="#dc2626" font-family="sans-serif">ไม่จ่าย 520 ไม่ส่ง</text></g>'+
  '<g transform="translate(240 150)"><rect x="-20" y="-6" width="40" height="8" fill="#ea580c"/><circle cx="-14" cy="6" r="4" fill="#111"/><circle cx="14" cy="6" r="4" fill="#111"/><path d="M20-6v-20" stroke="#ea580c" stroke-width="3"/></g>';},
// [ภาพงานกระดาษคราฟต์ ตัดกระดาษซ้อนชั้น เงานุ่ม] ซ้าย: ใบสั่งซื้อมีช่องราคา วันยืนราคา วันส่ง ค่าปรับ ขวา: เจ้าของร้านกับซัพจับมือหลังโต๊ะ (น้องม้วนกลาง)
 qhorderform:function(k){@@PR@@
  var row=function(y,t){return '<g transform="translate(52 '+y+')"><rect width="12" height="12" rx="2" fill="#fff" stroke="#92400e"/><path d="M2 6l3 3 5-6" stroke="#16a34a" stroke-width="2" fill="none"/><text x="18" y="9.6" font-size="6.6" font-weight="800" fill="#78350f" font-family="sans-serif">'+t+'</text></g>';};
  return '<rect width="360" height="180" fill="#fef3c7"/><path d="M0 0h360v30q-90 14-180 0T0 30z" fill="#fde68a"/>'+FL(k,'a',148,'#e7c08e','#b07a4a','#78350f',280,{noV:1,gap:4,op:.3})+
  '<g transform="translate(42 70)"><rect x="3" y="4" width="98" height="78" fill="#000" opacity=".12"/><rect width="98" height="78" fill="#fffbeb" stroke="#92400e"/><rect width="98" height="12" fill="#d97706"/><text x="49" y="9" text-anchor="middle" font-size="6.6" font-weight="900" fill="#fff" font-family="sans-serif">ใบสั่งซื้อ</text></g>'+row(86,'ราคา/หน่วย')+row(102,'ยืนราคาถึง...')+row(118,'วันส่ง')+row(134,'ค่าปรับส่งช้า')+
  PR(252,112,.9,{hs:'bun',h:'#3b2314',c:'#fff',ap:'#d97706',e:'smile',a:'point'})+PR(322,112,.9,{hs:'cap',cap:'#ea580c',h:'#111',c:'#ea580c',e:'smile',a:'point',f:1})+
  CT(k,'b',214,146,144,'#d6a76c','#92400e',{panel:36})+'<g transform="translate(288 136) rotate(4)"><rect x="-12" y="-8" width="24" height="16" fill="#fff" stroke="#92400e"/><path d="M-8-2h16M-8 2h12" stroke="#d6a76c"/></g>';}
});
