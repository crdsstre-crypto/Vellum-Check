/* ===== เวลลัมพูดสรุป: ตัวละครนูน 3 มิติ ปากขยับตามเสียง + คำบรรยายไฮไลต์ทีละคำ =====
   VCTalk.mount(el, { audio: base64 mp3, text: ข้อความที่พูด, align: { c:[ตัวอักษร], s:[เริ่ม], e:[จบ] } | null })
   - ปาก: วัดความดังจริงด้วย Web Audio · ถ้าวัดไม่ได้ (บางเครื่อง) ใช้เวลาของตัวอักษรแทน
   - คำบรรยาย: ตัดคำไทยด้วย Intl.Segmenter แล้วจับเวลาจาก align (ไม่มี align = ประมาณตามความยาว) */
(function () {
  'use strict';
  var INK = '#3a2a12';
  var css = '' +
    '.vtk{position:relative;margin:0 0 16px;padding:16px 16px 14px;border-radius:22px;border:1px solid rgba(255,255,255,.1);' +
      'background:radial-gradient(120% 90% at 0% 0%,rgba(245,196,81,.12),transparent 55%),radial-gradient(90% 80% at 100% 100%,rgba(52,211,153,.10),transparent 60%),#141519;' +
      'box-shadow:0 18px 40px -22px rgba(0,0,0,.8);overflow:hidden;color:#ececef;font-family:Prompt,sans-serif;--ff:Prompt,sans-serif}' +
    '.vtk *{box-sizing:border-box}' +
    '.vtk-top{display:grid;grid-template-columns:118px minmax(0,1fr);gap:12px;align-items:center}' +
    '.vtk-3d{position:relative;height:150px;perspective:520px;display:grid;place-items:end center}' +
    '.vtk-fig{position:relative;transform-style:preserve-3d;will-change:transform;transition:transform .08s linear}' +
    '.vtk-fig svg{display:block;filter:drop-shadow(0 14px 12px rgba(0,0,0,.55)) drop-shadow(0 2px 1px rgba(0,0,0,.35))}' +
    '.vtk-floor{position:absolute;left:50%;bottom:2px;width:84px;height:12px;margin-left:-42px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);transform-origin:center}' +
    '.vtk-glow{position:absolute;left:50%;top:50%;width:120px;height:120px;margin:-70px 0 0 -60px;border-radius:50%;background:radial-gradient(closest-side,rgba(245,196,81,.22),transparent);opacity:0;transition:opacity .3s}' +
    '.vtk.is-play .vtk-glow{opacity:1}' +
    '.vtk-bub{position:relative;padding:12px 14px;border-radius:18px;background:#f7efdc;color:#2a2116;box-shadow:inset 0 -3px 0 rgba(0,0,0,.08),0 10px 24px -14px rgba(0,0,0,.7)}' +
    '.vtk-bub::before{content:"";position:absolute;left:-9px;top:46%;border:9px solid transparent;border-right-color:#f7efdc;border-left:0}' +
    '.vtk-who{display:flex;align-items:center;gap:6px;margin:0 0 6px;font:600 12px/1.2 Prompt,sans-serif;color:#8a6a2b;letter-spacing:.02em}' +
    '.vtk-who i{width:7px;height:7px;border-radius:50%;background:#c9b48a}' +
    '.vtk.is-play .vtk-who i{background:#e5484d;box-shadow:0 0 0 0 rgba(229,72,77,.6);animation:vtkRec 1.2s infinite}' +
    '@keyframes vtkRec{70%{box-shadow:0 0 0 7px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}' +
    '.vtk-cap{max-height:5.4em;overflow:hidden;font:500 15.5px/1.75 Prompt,sans-serif;--ff:Prompt,sans-serif;scroll-behavior:smooth;position:relative}' +
    '.vtk-cap span{color:#a8987a;transition:color .15s}' +
    '.vtk-cap span.p{color:#2a2116}' +
    '.vtk-cap span.c{color:#1d1407;background:linear-gradient(transparent 12%,#ffd84d 12%,#ffd84d 88%,transparent 88%);border-radius:3px;box-shadow:0 0 0 2px #ffd84d}' +
    '.vtk-ctl{display:flex;align-items:center;gap:10px;margin-top:14px}' +
    '.vtk-pp{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:0;cursor:pointer;color:#1a1305;' +
      'background:linear-gradient(145deg,#ffe28a,#f2b81c);box-shadow:0 8px 18px -8px rgba(242,184,28,.8),inset 0 -3px 0 rgba(0,0,0,.15);transition:transform .12s}' +
    '.vtk-pp:active{transform:scale(.94)}.vtk-pp svg{width:20px;height:20px;fill:currentColor}' +
    '.vtk-bar{position:relative;flex:1;height:30px;display:flex;align-items:center;cursor:pointer;touch-action:none}' +
    '.vtk-bar b{position:absolute;left:0;right:0;height:6px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}' +
    '.vtk-bar b i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:6px;background:linear-gradient(90deg,#34d399,#ffd84d)}' +
    '.vtk-bar em{position:absolute;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.5);left:0}' +
    '.vtk-t{flex:none;min-width:74px;text-align:right;font:500 12px/1 Prompt,sans-serif;color:#a1a1aa;font-variant-numeric:tabular-nums}' +
    '.vtk-rp{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#ddd;cursor:pointer}' +
    '.vtk-rp svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.vtk-hint{position:absolute;left:50%;top:8px;transform:translateX(-50%);white-space:nowrap;font:600 11px/1 Prompt,sans-serif;color:#1a1305;background:#ffd84d;padding:5px 9px;border-radius:999px;animation:vtkHop 1.6s ease-in-out infinite}' +
    '.vtk.is-started .vtk-hint{display:none}' +
    '@keyframes vtkHop{50%{transform:translate(-50%,-4px)}}' +
    '.vtk .vtk-eyes{transform-origin:60px 58px;transform-box:view-box}' +
    '.vtk .vtk-eyes.blink{transform:scaleY(.1)}' +
    '.vtk .vtk-brows{transition:transform .2s;transform-box:view-box;transform-origin:60px 50px}' +
    '.vtk .vm-arm-r{animation:none}' +
    '.vtk.is-play .vm-arm-r{animation:vtkWave 1.6s ease-in-out infinite;transform-origin:89px 72px;transform-box:view-box}' +
    '@keyframes vtkWave{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}' +
    '.vtk-face-happy{display:none}.vtk.is-done .vtk-face-happy{display:inline}.vtk.is-done .vtk-face-talk{display:none}' +
    '@media (max-width:520px){.vtk{padding:14px 12px 12px}.vtk-top{grid-template-columns:92px minmax(0,1fr);gap:10px}.vtk-3d{height:124px}.vtk-cap{font-size:14.5px}}' +
    '@media (prefers-reduced-motion:reduce){.vtk-fig{transition:none}.vtk-hint,.vtk.is-play .vm-arm-r{animation:none}}' +
    'html[data-theme="light"] .vtk{background:#fbf8f1;color:#2a2116;border-color:rgba(0,0,0,.08)}html[data-theme="light"] .vtk-bar b{background:rgba(0,0,0,.1)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var PLAY = '<svg viewBox="0 0 16 16"><path d="M4.5 2.5v11l9-5.5z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>';
  var REPLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" fill="none" stroke="currentColor"/><path d="M3 4v5h5" fill="none" stroke="currentColor"/></svg>';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2); }

  /* ตัวละคร: ใช้มาสคอตเดิม แล้วเปลี่ยนหน้าเป็นหน้าที่ขยับได้ (ตา/คิ้ว/ปาก) + แสงเงานูน */
  function figure() {
    var s = window.VCMascot ? window.VCMascot.svg('wave', 110) : '';
    if (!s) return '<div style="font-size:64px;line-height:1">📜</div>';
    var face = '<g class="vtk-face-talk">' +
      '<g class="vtk-brows"><path d="M45 49q5-4 10-1M65 48q5-3 10 1" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/></g>' +
      '<g class="vtk-eyes"><ellipse cx="50" cy="58" rx="4" ry="5" fill="' + INK + '"/><ellipse cx="70" cy="58" rx="4" ry="5" fill="' + INK + '"/>' +
        '<circle cx="51.4" cy="56.2" r="1.5" fill="#fff"/><circle cx="71.4" cy="56.2" r="1.5" fill="#fff"/></g>' +
      '<g class="vtk-mouth-g"><ellipse class="vtk-mouth" cx="60" cy="68" rx="6" ry="1.6" fill="#8e2a22" stroke="' + INK + '" stroke-width="2"/>' +
        '<ellipse class="vtk-tongue" cx="60" cy="69.5" rx="3.4" ry="0" fill="#f08a80"/></g></g>' +
      '<g class="vtk-face-happy"><path d="M45 59q5-6 10 0M65 59q5-6 10 0" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
        '<path d="M51 65q9 10 18 0z" fill="#c2453b" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/></g>';
    s = s.replace(/<g class="vm-face">[\s\S]*?<\/g>/, '<g class="vm-face">' + face + '</g>');
    // แสงเงานูน (specular) ให้ดูเป็นตัวนูน 3 มิติ
    var uid = 'vtkB' + Math.random().toString(36).slice(2, 7);
    s = s.replace('<g class="vm-body">', '<defs><filter id="' + uid + '" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="3.2" specularConstant=".75" specularExponent="16" lighting-color="#fff6dd" result="sp"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>' +
      '<feComposite in="sp" in2="SourceAlpha" operator="in" result="spi"/><feComposite in="SourceGraphic" in2="spi" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0"/></filter></defs>' +
      '<g class="vm-body" filter="url(#' + uid + ')">');
    return s;
  }

  /* ตัดคำ: คืน [{t: คำ, a: ตำแหน่งเริ่มในข้อความ, b: ตำแหน่งจบ}] */
  function words(text) {
    var out = [];
    try {
      if (window.Intl && Intl.Segmenter) {
        var seg = new Intl.Segmenter('th', { granularity: 'word' }), it = seg.segment(text)[Symbol.iterator](), r;
        while (!(r = it.next()).done) out.push({ t: r.value.segment, a: r.value.index, b: r.value.index + r.value.segment.length });
        if (out.length) return out;
      }
    } catch (e) {}
    var re = /\s+|[^\s]{1,6}/g, m;   // ไม่มีตัวตัดคำ: แบ่งทีละ ~6 ตัวอักษร
    while ((m = re.exec(text))) out.push({ t: m[0], a: m.index, b: m.index + m[0].length });
    return out;
  }

  function mount(host, o) {
    if (!host || !o || !o.audio) return null;
    var text = String(o.text || '').trim() || 'สรุปผลตรวจสัญญา';
    var root = document.createElement('section'); root.className = 'vtk'; root.setAttribute('aria-label', 'เวลลัมอ่านสรุปผลตรวจ');
    var W = words(text);
    root.innerHTML = '<div class="vtk-top"><div class="vtk-3d"><span class="vtk-glow"></span><span class="vtk-floor"></span><div class="vtk-fig">' + figure() + '</div><span class="vtk-hint">แตะฟังได้เลย</span></div>' +
      '<div class="vtk-bub"><p class="vtk-who"><i></i>เวลลัมสรุปให้ฟัง</p><div class="vtk-cap" data-i18n-skip>' +
      W.map(function (w, i) { return '<span data-k="' + i + '">' + esc(w.t) + '</span>'; }).join('') + '</div></div></div>' +
      '<div class="vtk-ctl"><button type="button" class="vtk-pp" aria-label="เล่นเสียงสรุป">' + PLAY + '</button>' +
      '<div class="vtk-bar" role="slider" aria-label="ตำแหน่งเสียง" tabindex="0"><b><i></i></b><em></em></div>' +
      '<span class="vtk-t">0:00 / 0:00</span><button type="button" class="vtk-rp" aria-label="ฟังใหม่ตั้งแต่ต้น">' + REPLAY + '</button></div>';
    host.insertBefore(root, host.firstChild);   /* วางไว้บนสุดของกล่องผลตรวจ */

    var src;
    try {
      var bin = atob(o.audio), u8 = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      src = URL.createObjectURL(new Blob([u8], { type: 'audio/mpeg' }));
    } catch (e) { src = 'data:audio/mpeg;base64,' + o.audio; }
    var au = new Audio(); au.preload = 'auto'; au.src = src;

    var $ = function (q) { return root.querySelector(q); };
    var pp = $('.vtk-pp'), bar = $('.vtk-bar'), fill = $('.vtk-bar i'), knob = $('.vtk-bar em'), tm = $('.vtk-t'), cap = $('.vtk-cap');
    var fig = $('.vtk-fig'), floor = $('.vtk-floor'), mouth = $('.vtk-mouth'), tongue = $('.vtk-tongue'), eyes = $('.vtk-eyes'), brows = $('.vtk-brows');
    var spans = cap.querySelectorAll('span');

    /* เวลาเริ่มของแต่ละคำ */
    var al = o.align && o.align.c && o.align.s ? o.align : null, joined = al ? al.c.join('') : '';
    function charTime(idx, dur) {
      if (al) {
        var j = joined === text ? idx : Math.round(idx * (al.c.length / Math.max(1, text.length)));
        j = Math.min(al.s.length - 1, Math.max(0, j));
        return al.s[j];
      }
      return dur ? idx / text.length * dur : 0;
    }
    var starts = [];
    function calc() { var d = au.duration || 0; starts = W.map(function (w) { return charTime(w.a, d); }); }
    calc(); au.addEventListener('loadedmetadata', calc);

    /* ความดังของเสียง */
    var ctx = null, an = null, buf = null, ampOk = false;
    function setupAudio() {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      try {
        ctx = new AC(); var node = ctx.createMediaElementSource(au); an = ctx.createAnalyser(); an.fftSize = 512;
        node.connect(an); an.connect(ctx.destination); buf = new Uint8Array(an.fftSize);
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { ctx = null; an = null; }
    }
    function level(t) {
      if (an) {
        an.getByteTimeDomainData(buf); var sum = 0;
        for (var i = 0; i < buf.length; i += 2) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / (buf.length / 2));
        if (rms > .01) ampOk = true;
        if (ampOk) return Math.min(1, rms * 4.2);
      }
      // วัดไม่ได้ → ขยับตามเวลาตัวอักษรที่กำลังพูด
      if (!al || au.paused) return 0;
      for (var k = 0; k < al.s.length; k++) {
        if (al.s[k] <= t && t < (al.e[k] || al.s[k] + .08)) {
          if (/[\s,.!?]/.test(al.c[k])) return .05;
          return .35 + .4 * Math.abs(Math.sin(t * 17 + k));
        }
      }
      return 0;
    }

    var cur = -1, raf = 0, sm = 0, blinkAt = performance.now() + 1800;
    function paintWords(t) {
      var k = -1;
      for (var i = 0; i < starts.length; i++) { if (starts[i] <= t + .04) k = i; else break; }
      if (au.ended) k = W.length;
      if (!root.classList.contains('is-started')) k = -1;   /* ยังไม่กดฟัง: ยังไม่ไฮไลต์ */
      if (k === cur) return; cur = k;
      for (var j = 0; j < spans.length; j++) spans[j].className = j < k ? 'p' : j === k ? 'c' : '';
      var el = spans[Math.min(k, spans.length - 1)];
      if (el && k >= 0) { var top = el.offsetTop - cap.clientHeight / 2 + el.offsetHeight / 2; cap.scrollTop = Math.max(0, top); }
    }
    function frame(now) {
      var t = au.currentTime || 0, d = au.duration || 0;
      var a = au.paused ? 0 : level(t);
      sm += (a - sm) * .45;
      mouth.setAttribute('ry', (1.6 + sm * 6.2).toFixed(2));
      mouth.setAttribute('rx', (6 + sm * 1.6).toFixed(2));
      tongue.setAttribute('ry', (sm > .25 ? sm * 2.2 : 0).toFixed(2));
      brows.style.transform = 'translateY(' + (-sm * 2.4).toFixed(2) + 'px)';
      var sec = now / 1000, play = !au.paused;
      var ry = Math.sin(sec * (play ? 1.3 : .7)) * (play ? 9 : 5), rx = Math.sin(sec * .9) * 3, y = -sm * 6 + Math.sin(sec * 2) * (play ? 1.5 : 2.5);
      fig.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg)';
      floor.style.transform = 'scale(' + (1 + y / 40).toFixed(3) + ')';
      if (now > blinkAt) { eyes.classList.add('blink'); setTimeout(function () { eyes.classList.remove('blink'); }, 120); blinkAt = now + 2200 + Math.random() * 2600; }
      var p = d ? t / d : 0; fill.style.width = (p * 100) + '%'; knob.style.left = (p * 100) + '%';
      tm.textContent = fmt(t) + ' / ' + fmt(d);
      paintWords(t);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    // หยุดวาดเมื่อการ์ดถูกเอาออกจากหน้า
    var gone = setInterval(function () { if (!root.isConnected) { cancelAnimationFrame(raf); clearInterval(gone); try { au.pause(); } catch (e) {} } }, 2000);

    function sync() {
      var on = !au.paused && !au.ended;
      root.classList.toggle('is-play', on);
      pp.innerHTML = on ? PAUSE : PLAY; pp.setAttribute('aria-label', on ? 'หยุดชั่วคราว' : 'เล่นเสียงสรุป');
    }
    function play() {
      setupAudio(); root.classList.add('is-started'); root.classList.remove('is-done');
      var p = au.play(); if (p && p.catch) p.catch(function () {});
    }
    pp.addEventListener('click', function () { if (au.paused) play(); else au.pause(); });
    $('.vtk-fig').addEventListener('click', function () { if (au.paused) play(); else au.pause(); });
    $('.vtk-rp').addEventListener('click', function () { au.currentTime = 0; cur = -2; play(); });
    au.addEventListener('play', sync); au.addEventListener('pause', sync);
    au.addEventListener('ended', function () { sync(); root.classList.add('is-done'); paintWords(1e9); });
    function seek(e) {
      var r = bar.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      if (au.duration) { au.currentTime = Math.max(0, Math.min(1, x / r.width)) * au.duration; cur = -2; root.classList.remove('is-done'); }
    }
    var drag = false;
    bar.addEventListener('pointerdown', function (e) { drag = true; seek(e); try { bar.setPointerCapture(e.pointerId); } catch (er) {} });
    bar.addEventListener('pointermove', function (e) { if (drag) seek(e); });
    bar.addEventListener('pointerup', function () { drag = false; });
    bar.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') au.currentTime = Math.min(au.duration || 0, au.currentTime + 3);
      else if (e.key === 'ArrowLeft') au.currentTime = Math.max(0, au.currentTime - 3);
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pp.click(); } else return;
      cur = -2;
    });
    // แตะคำในคำบรรยาย = กระโดดไปฟังตรงนั้น
    cap.addEventListener('click', function (e) {
      var s = e.target.closest('span[data-k]'); if (!s) return;
      var k = +s.getAttribute('data-k'); if (starts[k] != null) { au.currentTime = starts[k]; cur = -2; if (au.paused) play(); }
    });
    return { root: root, audio: au };
  }

  window.VCTalk = { mount: mount };
})();
