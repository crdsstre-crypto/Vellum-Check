/* เลือกเสียงสรุป: แสดงใต้สวิตช์ "สรุปเป็นเสียง" เมื่อเปิด · กด ▶ ฟังตัวอย่างก่อนเลือก · จำเสียงที่เลือกไว้ในเครื่อง
   รายการเสียงมาจาก /api/voices (เสียงใน My Voices ของบัญชี ElevenLabs) ถ้ามีเสียงเดียวจะไม่แสดงตัวเลือก */
(function () {
  'use strict';
  var KEY = 'vc_voice', voices = [], sel = '', box = null, audio = null, playing = '', loaded = false;
  try { sel = localStorage.getItem(KEY) || ''; } catch (e) {}

  var css = '' +
    '.vpk{margin:10px 0 4px;padding:14px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.025);' +
      'overflow:hidden;transition:opacity .25s ease,transform .25s ease}' +
    '.vpk[hidden]{display:none}' +
    '.vpk-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin:0 2px 10px;font:600 14px/1.3 Prompt,sans-serif;color:#e7e7ea;--ff:Prompt,sans-serif}' +
    '.vpk-h small{font:400 12px/1.3 Prompt,sans-serif;color:#9a9aa3}' +
    '.vpk-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}' +
    '.vpk-c{position:relative;display:flex;align-items:center;gap:10px;min-height:58px;padding:9px 10px;border:1.5px solid rgba(255,255,255,.1);border-radius:14px;' +
      'background:#17181c;color:#ececef;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:border-color .2s,background .2s,transform .12s;font:inherit}' +
    '.vpk-c:active{transform:scale(.98)}' +
    '.vpk-c.is-on{border-color:#34d399;background:linear-gradient(135deg,rgba(52,211,153,.14),rgba(52,211,153,.04))}' +
    '.vpk-av{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;font:700 15px/1 Prompt,sans-serif;color:#0b0c0f;--ff:Prompt,sans-serif}' +
    '.vpk-t{flex:1;min-width:0}' +
    '.vpk-t b{display:block;font:600 14px/1.25 Prompt,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;--ff:Prompt,sans-serif}' +
    '.vpk-t small{display:block;margin-top:2px;font:400 11.5px/1.2 Prompt,sans-serif;color:#9a9aa3;--ff:Prompt,sans-serif}' +
    '.vpk-c.is-on .vpk-t small{color:#7fe3bd}' +
    '.vpk-p{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;padding:0}' +
    '.vpk-p svg{width:13px;height:13px;fill:currentColor}' +
    '.vpk-p.is-play{background:#34d399;border-color:#34d399;color:#06281c}' +
    '.vpk-ring{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:#34d399;animation:vpkSpin .7s linear infinite}' +
    '.vpk-p .vpk-ring{display:none}.vpk-p.is-load .vpk-ring{display:block}.vpk-p.is-load svg,.vpk-p.is-load .vpk-bars{display:none !important}' +
    '.vpk-note{margin:8px 2px 0;font:400 12px/1.4 Prompt,sans-serif;color:#9a9aa3}' +
    '@keyframes vpkSpin{to{transform:rotate(360deg)}}' +
    '.vpk-bars{display:none;gap:2px;align-items:flex-end;height:12px}' +
    '.vpk-p.is-play svg{display:none}.vpk-p.is-play .vpk-bars{display:flex}' +
    '.vpk-bars i{width:2.5px;border-radius:2px;background:currentColor;animation:vpkB .7s ease-in-out infinite alternate}' +
    '.vpk-bars i:nth-child(2){animation-delay:.15s}.vpk-bars i:nth-child(3){animation-delay:.3s}' +
    '@keyframes vpkB{from{height:3px}to{height:12px}}' +
    '@media (max-width:520px){.vpk{padding:12px}.vpk-g{grid-template-columns:1fr 1fr;gap:7px}.vpk-c{gap:8px;padding:9px 8px 9px 11px}.vpk-av{display:none}.vpk-h small{font-size:11px}}' +
    '.vpk-err{margin:8px 2px 0;font:400 12px/1.4 Prompt,sans-serif;color:#fca5a5}' +
    'html:not(.vc-art) .vpk,html[data-theme="light"] .vpk{border-color:rgba(0,0,0,.1);background:rgba(0,0,0,.02)}' +
    '@media (prefers-reduced-motion:reduce){.vpk-bars i,.vpk-p.is-load svg{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var COL = ['#34d399', '#f5c451', '#a78bfa', '#60a5fa', '#f472b6', '#fb923c', '#2dd4bf', '#f87171'];
  var PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
  var LOAD = '<span class="vpk-ring" aria-hidden="true"></span>';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function current() { return voices.some(function (v) { return v.id === sel; }) ? sel : (voices[0] ? voices[0].id : ''); }
  function stop() { if (audio) { try { audio.pause(); } catch (e) {} } audio = null; playing = ''; paintBtns(); }
  function paintBtns() {
    if (!box) return;
    [].forEach.call(box.querySelectorAll('.vpk-p'), function (b) {
      var id = b.getAttribute('data-id'), on = playing === id;
      b.classList.toggle('is-play', on && !b.classList.contains('is-load'));
      b.setAttribute('aria-label', on ? 'หยุดฟัง' : 'ฟังตัวอย่างเสียง');
    });
  }
  function play(id, btn) {
    if (playing === id) { stop(); return; }
    stop();
    btn.classList.add('is-load'); btn.innerHTML = LOAD + '<span class="vpk-bars"><i></i><i></i><i></i></span>';
    var a = new Audio(blobs[id] || purl(id));   /* โหลดไว้ในเครื่องแล้ว = เล่นทันที */
    audio = a; playing = id;
    function done() { btn.classList.remove('is-load'); btn.innerHTML = PLAY + '<span class="vpk-bars"><i></i><i></i><i></i></span>'; }
    var started = false, slow = setTimeout(function () { if (!started && audio === a) note('กำลังเตรียมเสียงครั้งแรก รอสักครู่…'); }, 1500);
    a.addEventListener('playing', function () { started = true; clearTimeout(slow); note(''); done(); paintBtns(); });
    a.addEventListener('ended', function () { if (audio === a) stop(); });
    a.addEventListener('error', function () { clearTimeout(slow); note(''); done(); if (audio === a) stop(); if (!started) err('ฟังตัวอย่างไม่ได้ตอนนี้ ลองใหม่อีกครั้ง'); });
    var p = a.play(); if (p && p.catch) p.catch(function () { done(); if (audio === a) stop(); });
  }
  function note(t) { var e = box && box.querySelector('.vpk-note'); if (e) { e.textContent = t; e.hidden = !t; } }
  function err(t) { var e = box && box.querySelector('.vpk-err'); if (e) { e.textContent = t; e.hidden = false; setTimeout(function () { e.hidden = true; }, 4000); } }

  function render() {
    if (!box) return;
    var cur = current();
    box.innerHTML = '<div class="vpk-h"><span>เลือกเสียงที่ใช้สรุป</span><small>กด ▶ เพื่อฟังตัวอย่าง</small></div>' +
      '<div class="vpk-g" role="radiogroup" aria-label="เลือกเสียงที่ใช้สรุป">' + voices.map(function (v, i) {
        var on = v.id === cur;
        return '<div class="vpk-c' + (on ? ' is-on' : '') + '" role="radio" tabindex="0" aria-checked="' + on + '" data-id="' + esc(v.id) + '">' +
          '<span class="vpk-av" style="background:' + COL[i % COL.length] + '">' + esc(((v.name || '?').replace(/^[\u0E40-\u0E44]/, '').charAt(0) || '?').toUpperCase()) + '</span>' +
          '<span class="vpk-t"><b>' + esc(v.name) + '</b><small>' + (on ? '✓ เลือกอยู่' : esc(v.gender || 'เลือก')) + '</small></span>' +
          '<button type="button" class="vpk-p" data-id="' + esc(v.id) + '" aria-label="ฟังตัวอย่างเสียง">' + PLAY + '<span class="vpk-bars"><i></i><i></i><i></i></span></button></div>';
      }).join('') + '</div><p class="vpk-note" hidden></p><p class="vpk-err" hidden></p>';
    paintBtns();
  }
  function choose(id) {
    sel = id; try { localStorage.setItem(KEY, id); } catch (e) {}
    render();
  }
  /* โหลดตัวอย่างทุกเสียงเก็บไว้ในเครื่องทันทีที่กล่องโผล่ (ทีละเสียง) กด ▶ แล้วเล่นได้เลยไม่ต้องรอเน็ต */
  var blobs = {}, pre = false;
  function purl(id) { return '/api/voices/' + encodeURIComponent(id) + '/preview?t=3'; }
  function prefetch() {
    if (pre || !window.fetch || !window.URL || !URL.createObjectURL) return; pre = true;
    var ids = voices.map(function (v) { return v.id; }), cur = current();
    ids.sort(function (a, b) { return (b === cur) - (a === cur); });
    (function next(i) {
      if (i >= ids.length) return;
      var id = ids[i]; if (blobs[id]) return next(i + 1);
      fetch(purl(id)).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
        .then(function (b) { if (b && b.size > 1000) blobs[id] = URL.createObjectURL(b); }, function () {})
        .then(function () { next(i + 1); });
    })(0);
  }
  function sync() {
    var cb = document.getElementById('voiceOpt'); if (!box || !cb) return;
    box.hidden = !(cb.checked && voices.length > 1);
    if (box.hidden) stop(); else prefetch();
  }
  function mount() {
    var cb = document.getElementById('voiceOpt'); if (!cb) return;
    var lab = cb.closest('label') || cb;
    box = document.createElement('div'); box.className = 'vpk'; box.hidden = true;
    lab.parentNode.insertBefore(box, lab.nextSibling);
    box.addEventListener('click', function (e) {
      var p = e.target.closest('.vpk-p'); if (p) { e.preventDefault(); e.stopPropagation(); play(p.getAttribute('data-id'), p); return; }
      var c = e.target.closest('.vpk-c'); if (c) choose(c.getAttribute('data-id'));
    });
    box.addEventListener('keydown', function (e) {
      var c = e.target.closest('.vpk-c'); if (!c || e.target.closest('.vpk-p')) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(c.getAttribute('data-id')); c = box.querySelector('.vpk-c[data-id="' + c.getAttribute('data-id') + '"]'); if (c) c.focus(); }
    });
    cb.addEventListener('change', function () { if (cb.checked) load(); sync(); });
    if (cb.checked) load();
    setTimeout(load, 2500);
  }
  function load() {
    if (loaded) return; loaded = true;
    fetch('/api/voices', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : { voices: [] }; })
      .then(function (d) { voices = (d && d.voices) || []; if (voices.length < 2) loaded = false; render(); sync(); })
      .catch(function () { loaded = false; });
  }

  window.VCVoice = { get: function () { return voices.length ? current() : sel; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
