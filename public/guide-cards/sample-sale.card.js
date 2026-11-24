// ภาพการ์ดของคู่มือ sample-sale
VCCards({
// [ภาพนิ่งมุมบน โต๊ะตัดผ้าไม้อ่อน มีสายวัดตัวคลี่] การ์ดตัวอย่างผ้า 4 สีเรียงพัด ชิ้นผ้าจริงสีเพี้ยน และกรรไกร (คู่มือ sample-sale)
    cardswatch: function (k) { var tp='';for(var i=0;i<14;i++){tp+='<rect x="'+(i*10)+'" y="148" width="1" height="'+(i%5?4:7)+'" fill="#3a2a20"/>';}
      var sw=function(r,c){return '<g transform="rotate('+r+' 90 76)"><rect x="80" y="20" width="22" height="56" rx="3" fill="'+c+'" stroke="#fff" stroke-width="2"/></g>';};
      return '<rect width="136" height="160" fill="#e8cfa8"/><path d="M0 40h136M0 90h136" stroke="#d8bc90"/><rect x="0" y="144" width="136" height="16" fill="#f2c94c"/>'+tp+
      sw(-30,'#e88a6a')+sw(-10,'#6aa8c8')+sw(10,'#8ac08a')+sw(30,'#c88ab8')+'<circle cx="90" cy="76" r="3" fill="#c9a040"/>'+
      '<g class="sc-bob"><g transform="translate(96 112) rotate(-8)"><rect x="-22" y="-14" width="44" height="28" fill="#000" opacity=".18" transform="translate(2 3)"/><path d="M-22 -14h44v28l-4-3-4 3-4-3-4 3-4-3-4 3-4-3-4 3-4-3-4 3z" fill="#4a88b0"/><text y="3" text-anchor="middle" font-size="6.4" font-weight="900" fill="#fff" font-family="sans-serif">ของจริง</text></g></g>'+
      '<g transform="translate(36 34) rotate(40)"><circle cx="-6" cy="12" r="5" fill="none" stroke="#d9483b" stroke-width="2.4"/><circle cx="6" cy="12" r="5" fill="none" stroke="#d9483b" stroke-width="2.4"/><path d="M-3 8l6-22M3 8l-6-22" stroke="#9aa4ac" stroke-width="2.4"/></g>'; }
});
