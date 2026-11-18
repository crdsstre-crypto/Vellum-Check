/* Vellum Check · ธีมหน้าปก "คืนฝนตก" (v1)
   - แสงจันทร์ลอดหน้าต่างพาดโต๊ะ มีเงาสายฝนไหลผ่าน + หยดน้ำไหลบนกระจก (เงา)
   - โทนเย็นรอบขอบจอ ให้แสงโคมไฟอุ่นเด่นขึ้น · ฟ้าแลบจาง ๆ นาน ๆ ครั้ง
   - เปิดเพลงแล้วมีเสียงฝนเบา ๆ คลอ
   ไม่แตะข้อความหัวข้อ/โลโก้ — เปลี่ยนเฉพาะสีตัวอักษรหัวข้อ */
(function () {
  var css = `
  :host([data-th=night]) .desk{filter:saturate(.82) brightness(.86)}
  :host([data-th=night]) .vig{background:radial-gradient(ellipse at 50% 50%,transparent 38%,rgba(4,8,22,.72))}
  :host([data-th=night]) .ttl small{color:#d6e2ff;text-shadow:0 0 14px rgba(150,180,255,.45)}
  :host([data-th=night]) .ttl span{background-image:linear-gradient(180deg,#ffffff 12%,#e4ebff 46%,#9fb4e8 74%,#e9c27a 100%)}
  :host([data-th=night]) .ttl{filter:blur(var(--tb,0px)) drop-shadow(0 6px 24px rgba(0,4,20,.85))}
  .tn-cool{position:absolute;inset:0;background:
      radial-gradient(90% 70% at 85% 0%,rgba(50,80,170,.26),transparent 60%),
      radial-gradient(70% 60% at 0% 100%,rgba(25,45,110,.26),transparent 65%);}
  .tn-tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,18,44,.28),rgba(10,18,44,0) 45%,rgba(10,18,44,.22))}
  /* แสงจันทร์ลอดหน้าต่าง (มองจากบน: 4 ช่องกระจก เอียงพาดโต๊ะ) — ใช้ความโปร่งใสธรรมดา */
  .tn-win{position:absolute;left:46%;top:4%;width:max(80vmin,560px);height:max(62vmin,420px);display:grid;grid-template:1fr 1fr/1fr 1fr;gap:16px;
      transform:rotate(-16deg) skewX(-14deg);-webkit-mask:radial-gradient(closest-side,#000 45%,transparent 100%);mask:radial-gradient(closest-side,#000 45%,transparent 100%)}
  .tn-pane{position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(190,210,255,.42),rgba(160,185,255,.28) 60%,rgba(140,170,250,.16))}
  /* สายฝนไหลบนกระจก → เงาเส้นเลื่อนลง (ขยับด้วย transform อย่างเดียว) */
  .tn-rain{position:absolute;left:-20%;right:-20%;top:-100%;height:200%;opacity:.7;
      background:repeating-linear-gradient(94deg,transparent 0 21px,rgba(8,14,36,.42) 21px 23px,transparent 23px 57px,rgba(8,14,36,.28) 57px 58px,transparent 58px 91px);
      -webkit-mask:repeating-linear-gradient(180deg,#000 0 60px,transparent 60px 110px,#000 110px 190px,transparent 190px 240px);mask:repeating-linear-gradient(180deg,#000 0 60px,transparent 60px 110px,#000 110px 190px,transparent 190px 240px);
      animation:tnr 1.15s linear infinite}
  .tn-rain.b{opacity:.45;animation-duration:.85s;background-position:33px 0;-webkit-mask-size:100% 300px;mask-size:100% 300px}
  @keyframes tnr{to{transform:translateY(50%)}}
  .tn-drop{position:absolute;top:-8%;width:10px;height:13px;border-radius:50% 50% 45% 45%;opacity:.9;
      background:radial-gradient(circle at 38% 32%,rgba(235,242,255,.95),rgba(170,195,255,.4) 42%,rgba(6,10,28,.6) 78%);animation:tnd var(--d,7s) cubic-bezier(.5,0,.85,1) var(--w,0s) infinite}
  .tn-drop::after{content:"";position:absolute;left:3.5px;bottom:100%;width:3px;height:var(--tr,90px);border-radius:2px;background:linear-gradient(transparent,rgba(6,10,28,.45))}
  @keyframes tnd{0%{transform:translateY(0)}22%{transform:translateY(6vmin)}30%{transform:translateY(7vmin)}100%{transform:translateY(46vmin)}}
  /* ฟ้าแลบจาง ๆ ทุก ~14 วินาที */
  .tn-flash{position:absolute;inset:0;background:radial-gradient(120% 90% at 80% 0%,rgba(205,220,255,.32),rgba(160,180,255,.08) 50%,transparent 75%);opacity:0;animation:tnf 14s 4s infinite}
  @keyframes tnf{0%,90%,100%{opacity:0}91%{opacity:.5}92%{opacity:.08}93.5%{opacity:.38}96%{opacity:0}}
  @media (max-width:767px){.tn-win{left:22%;top:12%;width:120vmin;height:92vmin;gap:10px}}
  `;
  var drops = '';
  [[18, 6.5, 0, 70], [33, 8, 2.2, 110], [52, 7.2, 4.1, 80], [67, 9, 1.1, 130], [80, 6.8, 3.3, 90], [43, 10, 5.6, 60]].forEach(function (d) {
    drops += '<i class="tn-drop" style="left:' + d[0] + '%;--d:' + d[1] + 's;--w:-' + d[2] + 's;--tr:' + d[3] + 'px"></i>';
  });
  var dl = drops.split('</i>'), panes = '';
  for (var k = 0; k < 4; k++) panes += '<div class="tn-pane"><div class="tn-rain"></div><div class="tn-rain b"></div>' + (dl[k] ? dl[k] + '</i>' : '') + (dl[k + 4] ? dl[k + 4] + '</i>' : '') + '</div>';
  var stage = '<div class="tn-tint"></div><div class="tn-cool"></div><div class="tn-win">' + panes + '</div><div class="tn-flash"></div>';

  /* เสียงฝน: เปิดตามปุ่มเพลงของหน้าปก */
  function init(SR, host) {
    var sb = SR.getElementById('snd'); if (!sb) return;
    var AC = null, g = null, on = false;
    function build() {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
      var n = AC.sampleRate * 2, buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0), last = 0;
      for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; last = (last + .04 * w) / 1.04; d[i] = last * 3.2 + w * .12; }
      var src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      var hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 280;
      g = AC.createGain(); g.gain.value = 0;
      src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(AC.destination); src.start();
    }
    function set(v) {
      if (v === on) return; on = v;
      if (v && !AC) build(); if (!AC) return;
      if (v && AC.state !== 'running') AC.resume();
      g.gain.setTargetAtTime(v ? .07 : 0, AC.currentTime, .6);
    }
    sb.addEventListener('click', function () { setTimeout(function () { set(sb.classList.contains('on')); }, 0); });
    new MutationObserver(function () { set(sb.classList.contains('on')); }).observe(sb, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', function () { if (AC) { if (document.hidden) AC.suspend(); else if (on) AC.resume(); } });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (!AC) return; if (es[0].isIntersecting) { if (on) AC.resume(); } else AC.suspend(); }).observe(host);
  }

  (window.VCHT = window.VCHT || {}).night = { css: css, stage: stage, init: init };
  if (window.__vchApply) window.__vchApply();
})();
