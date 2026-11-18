/* Vellum Check · ธีมหน้าปก "ปีใหม่" (v1) — ใช้ช่วง 1 ธ.ค. – 7 ม.ค.
   - สายไฟประดับห้อยเป็นโค้งด้านบน หลอดไฟกะพริบสลับกัน
   - กล่องของขวัญผูกโบว์ทอง 2 กล่องบนโต๊ะ (ขยับตามกล้องเหมือนของชิ้นอื่น)
   - ประกายดาวทองระยิบรอบขอบจอ · หัวข้อสีทองแชมเปญมีแสงวิ่ง
   ไม่แตะข้อความหัวข้อ/โลโก้ — เปลี่ยนเฉพาะสีตัวอักษรหัวข้อ */
(function () {
  var css = `
  :host([data-th=newyear]) .ttl small{color:#ffe7b0;text-shadow:0 0 12px rgba(255,200,90,.55)}
  :host([data-th=newyear]) .ttl span{background-image:linear-gradient(100deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 60%),linear-gradient(180deg,#fffaf0 10%,#ffe9b0 42%,#f2c35a 70%,#c98a2a 100%);
      background-size:250% 100%,100% 100%;background-repeat:no-repeat;animation:nysh 5s ease-in-out infinite}
  :host([data-th=newyear]) .ttl .l2{animation-delay:.25s}
  @keyframes nysh{0%,55%{background-position:160% 0,0 0}100%{background-position:-60% 0,0 0}}
  :host([data-th=newyear]) .ttl{filter:blur(var(--tb,0px)) drop-shadow(0 0 18px rgba(255,190,80,.35)) drop-shadow(0 6px 22px rgba(0,0,0,.75))}
  @media (prefers-reduced-motion:reduce){:host([data-th=newyear]) .ttl span{animation:none}}
  /* อยู่เหนือเงามืดหลังหัวข้อ (scrim) แต่ยังใต้ตัวหัวข้อ */
  :host([data-th=newyear]) .thm{z-index:20}
  /* สายไฟประดับ */
  .ny-lt{position:absolute;left:-2%;right:-2%;top:calc(var(--art-head,56px) - 10px);height:min(30vh,250px)}
  .ny-lt svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .ny-b{position:absolute;width:13px;height:18px;margin:-1px 0 0 -6.5px;border-radius:50% 50% 46% 46%;background:var(--c);
      box-shadow:0 0 10px 3px var(--c),0 0 30px 10px color-mix(in srgb,var(--c) 40%,transparent);animation:nyb 2.4s ease-in-out var(--w,0s) infinite}
  .ny-b::before{content:"";position:absolute;left:3px;top:-5px;width:5px;height:6px;border-radius:1px;background:#6b5a3a}
  @keyframes nyb{0%,100%{opacity:1}50%{opacity:.35;box-shadow:0 0 4px 1px var(--c)}}
  /* ประกายดาวทอง */
  .ny-s{position:absolute;width:var(--s,14px);height:var(--s,14px);background:radial-gradient(circle,#fffbe8 0 22%,#ffd36a 45%,rgba(255,211,106,.4) 70%);
      clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);opacity:0;animation:nys var(--d,3.2s) ease-in-out var(--w,0s) infinite}
  @keyframes nys{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
  @media (max-width:767px){.ny-lt{height:92px}.ny-b{width:11px;height:15px;margin-left:-5.5px}}
  /* แสงอุ่นทองจาง ๆ ด้านบน */
  .ny-glow{position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 0%,rgba(255,200,110,.16),transparent 70%)}
  `;
  /* สายไฟ 2 เส้น: โค้งห้อยแบบโซ่ (คำนวณตำแหน่งหลอดเป็น % ตามเส้นโค้ง) */
  var C = ['#ffd36a', '#ff6b6b', '#fff3cf', '#7fe0b0', '#ffb347'];
  function strand(y0, sag, n, off) {
    var bulbs = '', i, x, y;
    for (i = 1; i < n; i++) { x = i / n; y = y0 + sag * 4 * x * (1 - x); bulbs += '<i class="ny-b" style="left:' + (x * 100).toFixed(1) + '%;top:' + y.toFixed(1) + '%;--c:' + C[(i + off) % C.length] + ';--w:-' + ((i * .37 + off) % 2.4).toFixed(2) + 's"></i>'; }
    return { path: 'M0 ' + y0 + ' Q50 ' + (y0 + sag * 2) + ' 100 ' + y0, bulbs: bulbs };
  }
  var a = strand(6, 30, 13, 0), b = strand(0, 52, 10, 2);
  var lights = '<div class="ny-lt"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + a.path + '" stroke="#3a2c18" stroke-width=".5" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:1.6px"/><path d="' + b.path + '" stroke="#3a2c18" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:1.6px"/></svg>' + a.bulbs + b.bulbs + '</div>';
  var stars = '';
  [[6, 34, 22, 3.4, 0], [93, 30, 18, 2.8, 1.1], [12, 62, 16, 3, 2], [88, 56, 24, 3.8, .6], [5, 84, 18, 3.1, 1.7], [95, 76, 16, 2.6, 2.4], [24, 46, 14, 3.6, 1.3], [76, 42, 15, 3.2, .3], [62, 86, 14, 3, 2.1]].forEach(function (s) {
    stars += '<i class="ny-s" style="left:' + s[0] + '%;top:' + s[1] + '%;--s:' + s[2] + 'px;--d:' + s[3] + 's;--w:-' + s[4] + 's"></i>';
  });
  var stage = '<div class="ny-glow"></div>' + lights + stars;

  /* กล่องของขวัญมองจากด้านบน */
  function gift(base, dark, rib, rib2) {
    return '<svg viewBox="0 0 120 120"><rect x="6" y="6" width="108" height="108" rx="6" fill="' + base + '"/><rect x="6" y="6" width="108" height="108" rx="6" fill="none" stroke="' + dark + '" stroke-width="3"/>' +
      '<path d="M6 6h108v10H6z" fill="#fff" opacity=".12"/><rect x="51" y="6" width="18" height="108" fill="' + rib + '"/><rect x="6" y="51" width="108" height="18" fill="' + rib + '"/>' +
      '<rect x="56" y="6" width="3" height="108" fill="' + rib2 + '" opacity=".6"/><rect x="6" y="56" width="108" height="3" fill="' + rib2 + '" opacity=".6"/>' +
      '<path d="M60 60C44 36 22 40 30 54c5 9 20 8 30 6z" fill="' + rib + '" stroke="' + rib2 + '" stroke-width="1.5"/><path d="M60 60C76 36 98 40 90 54c-5 9-20 8-30 6z" fill="' + rib + '" stroke="' + rib2 + '" stroke-width="1.5"/>' +
      '<path d="M60 60l-14 26 8-2 4 8zM60 60l14 26-8-2-4 8z" fill="' + rib + '" stroke="' + rib2 + '" stroke-width="1.2"/><circle cx="60" cy="60" r="8" fill="' + rib + '" stroke="' + rib2 + '" stroke-width="1.5"/></svg>';
  }
  var cam = '<div class="L obj" data-k="1.2" data-x="-.47" data-y=".22" data-w="19vmin" data-r="-14" style="z-index:12">' + gift('#b3242f', '#7a1219', '#f2c35a', '#a8761f') + '</div>' +
            '<div class="L obj" data-k="1.3" data-x=".47" data-y="-.2" data-w="17vmin" data-r="12" style="z-index:12">' + gift('#14513f', '#0b3328', '#f2c35a', '#a8761f') + '</div>';

  (window.VCHT = window.VCHT || {}).newyear = { css: css, stage: stage, cam: cam };
  if (window.__vchApply) window.__vchApply();
})();
