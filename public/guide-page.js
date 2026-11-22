/* Vellum เรียนรู้ — /guide (รายการ) และ /guide/<slug> (อ่าน/ฟัง/ดูคลิป)
   เนื้อหามาจาก /api/guides · ตัวบทมาตรามาจาก /api/lib/cite · ใส่ลงหน้าด้วย esc() เสมอ
   เสียงอ่านใช้ Web Speech API ของเบราว์เซอร์ (ไม่มีค่าใช้จ่าย ไม่ส่งข้อมูลออกนอกเครื่อง) */
(() => {
  'use strict';
  const $main = document.getElementById('main');
  const TH = '๐๑๒๓๔๕๖๗๘๙';
  const toTh = s => String(s).replace(/[0-9]/g, d => TH[d]);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${Number(m[1]) + 543}` : ''; };
  const keyId = k => 's-' + String(k).replace(/[^0-9a-zก-๙-]+/gi, '-');
  const lawShort = name => name === 'ประมวลกฎหมายแพ่งและพาณิชย์' ? 'ป.พ.พ.' : name === 'ประมวลกฎหมายอาญา' ? 'ป.อ.' : name === 'ประมวลกฎหมายวิธีพิจารณาความแพ่ง' ? 'ป.วิ.พ.'
    : name.startsWith('พระราชบัญญัติจัดตั้งศาลแรงงาน') ? 'พ.ร.บ.ศาลแรงงาน'
    : name.startsWith('พระราชกำหนดมาตรการป้องกันและปราบปรามอาชญากรรมทางเทคโนโลยี') ? 'พ.ร.ก.อาชญากรรมทางเทคโนโลยี'
    : name.replace(/^พระราชบัญญัติ\s*(ว่าด้วย)?/, 'พ.ร.บ.').replace(/^พระราชกำหนด\s*/, 'พ.ร.ก.').replace(/\s*(พ\.ศ\.|พุทธศักราช)\s*[0-9๐-๙]{4}.*$/, '');

  async function get(url) {
    const res = await fetch(url, { credentials: 'same-origin' });
    let d = null; try { d = await res.json(); } catch {}
    if (!res.ok) throw Object.assign(new Error(d?.error || 'โหลดข้อมูลไม่สำเร็จ'), { status: res.status });
    return d;
  }
  const errBox = e => `<div class="lb-band" role="alert"><div><b>${esc(e.message)}</b><br><a href="/guide">กลับไปหน้าเรียนรู้</a></div></div>`;

  // ---------- เสียงอ่าน ----------
  const tts = (() => {
    const ok = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    let chunks = [], idx = 0, playing = false, rate = 1, token = 0, ui = null, voice = null;
    const pickVoice = () => { if (!ok) return; const v = speechSynthesis.getVoices(); voice = v.find(x => /^th(-|_|$)/i.test(x.lang)) || null; if (ui) ui.noVoice(v.length > 0 && !voice); };
    if (ok) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); }
    const split = text => {   // ตัดเป็นท่อนสั้น ๆ (iPhone ตัดเสียงถ้ายาวเกิน)
      const out = []; let cur = '';
      for (const w of String(text).split(/(\s+)/)) { if ((cur + w).length > 160 && cur.trim()) { out.push(cur.trim()); cur = ''; } cur += w; }
      if (cur.trim()) out.push(cur.trim());
      return out;
    };
    const total = () => chunks.reduce((n, c) => n + c.text.length, 0) || 1;
    const done = () => chunks.slice(0, idx).reduce((n, c) => n + c.text.length, 0);
    const secs = n => Math.round(n / (13 * rate));
    const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const mark = el => { document.querySelectorAll('.gd-reading').forEach(x => x.classList.remove('gd-reading')); if (el) { el.classList.add('gd-reading'); const r = el.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight - 20) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } };
    const paint = () => { if (!ui) return; ui.progress(done() / total(), mmss(secs(done())), mmss(secs(total())), playing); };
    function speakAt(i) {
      const my = ++token;
      if (i >= chunks.length) { playing = false; idx = 0; mark(null); paint(); return; }
      idx = i; const c = chunks[i];
      const u = new SpeechSynthesisUtterance(c.text);
      u.lang = 'th-TH'; if (voice) u.voice = voice; u.rate = rate;
      u.onend = () => { if (my === token && playing) speakAt(i + 1); };
      u.onerror = ev => { if (my !== token) return; if (ev.error === 'interrupted' || ev.error === 'canceled') return; playing = false; paint(); ui?.fail(); };
      mark(c.el); paint();
      speechSynthesis.speak(u);
    }
    return {
      ok,
      bind(newUi) { ui = newUi; pickVoice(); },
      load(list) { chunks = []; for (const { text, el } of list) for (const t of split(text)) chunks.push({ text: t, el }); idx = 0; playing = false; paint(); },
      toggle() { if (!ok) return; if (playing) { playing = false; token++; speechSynthesis.cancel(); mark(null); paint(); } else { speechSynthesis.cancel(); playing = true; speakAt(idx); } },
      stop() { if (!ok) return; playing = false; token++; speechSynthesis.cancel(); idx = 0; mark(null); paint(); },
      setRate(r) { rate = r; if (playing) { token++; speechSynthesis.cancel(); speakAt(idx); } else paint(); },
      once(text) {   // อ่านข้อความเดียว (เช่นตัวบทในแผ่นมาตรา) — หยุดเสียงหลักก่อน
        if (!ok) return; playing = false; token++; speechSynthesis.cancel(); mark(null); paint();
        const parts = split(text); let k = 0; const my = ++token;
        const next = () => { if (my !== token || k >= parts.length) return; const u = new SpeechSynthesisUtterance(parts[k++]); u.lang = 'th-TH'; if (voice) u.voice = voice; u.rate = rate; u.onend = next; speechSynthesis.speak(u); };
        next();
      },
    };
  })();
  addEventListener('pagehide', () => { try { speechSynthesis.cancel(); } catch {} });

  // ---------- รายการ "เรียนรู้" ----------
  // **คำ** ในข้อความการ์ด = ไฮไลต์ (escape ก่อนเสมอ แล้วค่อยแปลงเป็น <mark>)
  const hl = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<mark>$1</mark>');
  const hlA = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<mark class="gd-hl">$1</mark>');   // คำสำคัญในคำตอบ/สรุป
  const hlB = s => esc(s || '').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');   // กรอบคำพูดการ์ตูน
  const mascot = (mood, size) => (window.VCMascot && typeof VCMascot.svg === 'function') ? VCMascot.svg(mood || 'curious', size) : '';
  const scene = (name, key) => (window.VCScenes ? VCScenes.svg(name, key) : '');

  async function viewList() {
    document.title = 'เรียนรู้กฎหมายแบบภาษาง่าย · Vellum';
    try {
      const d = await get('/api/guides');
      const groups = new Map();
      for (const g of d.items) {
        if (!groups.has(g.category)) groups.set(g.category, { icon: '', note: '', list: [] });
        const G = groups.get(g.category); G.list.push(g);
        if (!G.icon && g.categoryIcon) G.icon = g.categoryIcon;
        if (!G.note && g.categoryNote) G.note = g.categoryNote;
      }
      const cats = [...groups];
      let k = 0;
      const card = g => `<a class="gd-lc" href="/guide/${esc(g.slug)}">
          <div class="gd-lc-img" aria-hidden="true">${scene(g.scene, 'c' + (++k))}<span class="gd-lc-mz">${mascot(g.mood, 74)}</span></div>
          <div class="gd-lc-body">
            <span class="gd-lc-tag"><span class="gd-lc-cat">${g.categoryIcon ? esc(g.categoryIcon) + ' ' : ''}${esc(g.category)}</span>คู่มือ${g.minutes ? ` · ${toTh(g.minutes)} นาที` : ''}${g.reviewed ? '' : '<span class="gd-lc-draft">ฉบับร่าง</span>'}</span>
            <h3>${esc(g.title)}</h3>
            <p>${hl(g.cardText || g.intro)}</p>
            <span class="gd-lc-go">อ่านคู่มือ →</span>
          </div></a>`;
      $main.innerHTML = `<h1 class="gd-lh">รู้ก่อนเซ็น<em>เรื่องที่คุณเจอ</em></h1>
        <p class="gd-lsub">อ่าน ฟัง หรือดูคลิป ภาษาง่าย พร้อมตัวบทจริงทุกข้อ</p>
        ${d.isAdmin ? '<div class="gd-draft">คุณเห็นคู่มือฉบับร่างด้วยเพราะเป็นแอดมิน · คนทั่วไปจะเห็นเฉพาะเรื่องที่ตั้ง "reviewed": true แล้ว</div>' : ''}
        ${cats.length > 1 ? `<nav class="gd-chips" aria-label="เลือกหมวด"><button type="button" class="on" aria-pressed="true" data-cat="">ทั้งหมด</button>${cats.map(([c, G]) => `<button type="button" aria-pressed="false" data-cat="${esc(c)}">${G.icon ? esc(G.icon) + ' ' : ''}${esc(c)}</button>`).join('')}</nav>` : ''}
        ${cats.length ? cats.map(([c, G]) => `<section class="gd-sec" data-sec="${esc(c)}">
            <h2>${G.icon ? `<span class="gd-ic" aria-hidden="true">${esc(G.icon)}</span>` : ''}${esc(c)}</h2>
            ${G.note ? `<p class="gd-sec-d">${esc(G.note)}</p>` : ''}
            ${G.list.map(card).join('')}</section>`).join('')
          : '<p class="gd-empty">ยังไม่มีเรื่องที่เผยแพร่ เร็ว ๆ นี้จะมีเพิ่มครับ</p>'}`;
      const chips = [...$main.querySelectorAll('.gd-chips button')];
      chips.forEach(b => b.addEventListener('click', () => {
        chips.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        $main.querySelectorAll('.gd-sec').forEach(sec => { sec.hidden = !!b.dataset.cat && sec.dataset.sec !== b.dataset.cat; });
      }));
    } catch (e) { $main.innerHTML = errBox(e); }
  }

  // ---------- อ่านคู่มือ ----------
  const citeBtn = c => c.law
    ? `<button type="button" class="gd-law" data-law="${esc(c.law)}" data-sec="${esc(c.sec)}" data-easy="${esc(c.easy || '')}">${esc(lawShort(c.law))} มาตรา ${esc(toTh(c.sec))} ›</button>`
    : `<span class="gd-law ext" title="${esc(c.note || '')}">${esc(c.label)}</span>`;

  async function viewGuide(slug) {
    let g;
    try { g = await get('/api/guides/' + encodeURIComponent(slug)); }
    catch (e) { $main.innerHTML = e.status === 404 ? `<div class="lb-band"><div><b>ไม่พบคู่มือนี้</b><br><a href="/guide">ดูเรื่องทั้งหมด</a></div></div>` : errBox(e); return; }
    document.title = g.title + ' · เรียนรู้ · Vellum';
    let n = 0;
    $main.innerHTML = `
      ${g.reviewed ? '' : `<div class="gd-draft" role="note">ฉบับร่าง · ยังไม่ผ่านการตรวจโดยนักกฎหมาย${g.isAdmin ? ' · ตอนนี้เห็นเฉพาะแอดมิน' : ''}</div>`}
      <div class="gd-crumb"><a href="/guide">เรียนรู้</a> › ${esc(g.category)}</div>
      ${g.coverLines.length ? `<div class="gd-cover"${window.VCComic ? ` data-bg="${esc(g.scene)}"` : ''}>${window.VCComic ? VCComic.coverBg(g.scene) : ''}
        ${scene(g.scene, 'cv') ? `<div class="gd-cover-art" aria-hidden="true">${scene(g.scene, 'cv')}<span class="gd-cover-m">${mascot(g.mood, 66)}</span></div>`
          : `<div class="gd-cover-m" aria-hidden="true">${mascot(g.mood, 112)}</div>`}
        <div class="gd-cover-t"><small>${g.categoryIcon ? esc(g.categoryIcon) + ' ' : ''}คู่มือ · ${esc(g.category)}</small>
          <h1 data-say>${g.coverLines.map((l, i) => `<span>${i ? `<em>${esc(l)}</em>` : esc(l)}</span>`).join(' ')}</h1></div>
      </div>` : `<h1 class="gd-h1" data-say>${esc(g.title)}</h1>`}
      <div class="gd-meta">
        ${g.minutes ? `<span class="gd-chip">อ่าน ${toTh(g.minutes)} นาที</span>` : ''}
        ${g.updated ? `<span class="gd-chip">อัปเดต ${esc(thDate(g.updated))}</span>` : ''}
        ${g.reviewed ? `<span class="gd-chip ok">✓ ตรวจโดยนักกฎหมาย${g.reviewer ? ' · ' + esc(g.reviewer) : ''}</span>` : '<span class="gd-chip wait">⏳ รอนักกฎหมายตรวจ</span>'}
      </div>
      <section class="gd-media" aria-label="ฟัง ดูคลิป หรืออ่าน">
        <div class="gd-tabs" role="tablist">
          <button role="tab" aria-selected="true" data-tab="listen">🔊 ฟัง</button>
          <button role="tab" aria-selected="false" data-tab="video">▶ ดูคลิป</button>
          <button role="tab" aria-selected="false" data-tab="read">📖 อ่าน</button>
        </div>
        <div data-pane="listen">
          ${tts.ok ? `<div class="gd-player">
            <button class="gd-play" type="button" data-play aria-label="เล่นเสียงอ่าน">▶</button>
            <div class="gd-bar"><div class="gd-track"><i data-prog></i></div><div class="gd-tm"><span data-t1>0:00</span><span data-t2>0:00</span></div></div>
            <button class="gd-spd" type="button" data-rate aria-label="ความเร็วเสียง">1.0×</button>
            <button class="gd-stop" type="button" data-stop aria-label="หยุดและเริ่มใหม่">■</button>
          </div>
          <div class="gd-ainote" data-ttsnote>🤖 เสียงอ่านโดยเบราว์เซอร์ จากข้อความในหน้านี้ · ไม่ใช่เสียงทนายจริง</div>`
          : '<p class="gd-empty">เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง</p>'}
        </div>
        <div data-pane="video" hidden>
          ${g.video ? `<div class="gd-video"><video controls preload="none" playsinline src="${esc(g.video.url)}"${g.video.poster ? ` poster="${esc(g.video.poster)}"` : ''}></video></div>
            <div class="gd-ainote">🤖 คลิปสร้างด้วย AI จากเนื้อหาในหน้านี้ · ไม่ใช่ทนายจริง</div>` : '<p class="gd-empty">ยังไม่มีคลิปสำหรับเรื่องนี้ ลองฟังเสียงอ่านหรืออ่านด้านล่างได้เลย</p>'}
        </div>
        <div data-pane="read" hidden><p class="gd-empty">เลื่อนลงอ่านด้านล่างได้เลย ⬇</p></div>
      </section>
      ${g.summary.length ? `<div class="gd-sum" data-say><h2>สรุปใน 30 วินาที</h2><ul>${g.summary.map(s => `<li>${hlA(s)}</li>`).join('')}</ul></div>` : ''}
      <div id="gd-body">
      ${g.sections.map(s => `<h2 class="gd-h2" data-say><span class="gd-n" aria-hidden="true">${++n}</span>${esc(s.title)}</h2>
        ${s.panel && window.VCComic ? VCComic.panel(s.panel.scene, s.panel.mood, hlB(s.panel.say), 'ตอนที่ ' + n, 'p' + n) : ''}
        ${s.items.map(it => `<div class="gd-item" data-say><p class="gd-q">${esc(it.q)}</p><p class="gd-a">${hlA(it.a)}</p>
          ${it.cite.length ? `<div class="gd-cites">${it.cite.map(citeBtn).join('')}</div>` : ''}</div>`).join('')}`).join('')}
      ${g.redFlags.length ? `<h2 class="gd-h2" data-say>🚩 เจอแบบนี้ในสัญญา ระวัง</h2>${g.redFlags.map(f => `<div class="gd-flag" data-say><b>${esc(f.text)}</b>${f.note ? `<br>${esc(f.note)}` : ''}</div>`).join('')}` : ''}
      </div>
      ${g.cta ? `<div class="gd-cta"><p>${esc(g.cta.text)}</p><a href="${esc(g.cta.href)}">${esc(g.cta.button)}</a></div>` : ''}
      <p class="gd-disc">ข้อมูลทั่วไปเพื่อการศึกษา ไม่ใช่คำปรึกษากฎหมาย · ตัวบทที่อ้างอิงดึงจากคลังกฎหมายของ Vellum (ฉบับรวมกฤษฎีกา) · หากมีข้อพิพาทควรปรึกษาทนายความ</p>`;

    // แท็บ
    const tabs = [...$main.querySelectorAll('[data-tab]')];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-selected', String(x === b)));
      $main.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; });
      if (b.dataset.tab !== 'listen') tts.stop();
      if (b.dataset.tab !== 'video') $main.querySelector('video')?.pause();
      if (b.dataset.tab === 'read') document.getElementById('gd-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    // เสียงอ่าน: อ่านทุกกล่องที่มี data-say ตามลำดับ (ไม่อ่านป้ายมาตรา)
    if (tts.ok) {
      const $play = $main.querySelector('[data-play]'), $prog = $main.querySelector('[data-prog]'), $t1 = $main.querySelector('[data-t1]'), $t2 = $main.querySelector('[data-t2]'), $note = $main.querySelector('[data-ttsnote]');
      tts.bind({
        progress(p, a, b, playing) { $prog.style.width = Math.round(p * 100) + '%'; $t1.textContent = a; $t2.textContent = b; $play.textContent = playing ? '❚❚' : '▶'; $play.setAttribute('aria-label', playing ? 'หยุดชั่วคราว' : 'เล่นเสียงอ่าน'); },
        noVoice(missing) { if (missing) $note.textContent = '⚠️ เครื่องนี้อาจไม่มีเสียงภาษาไทย ถ้าไม่ได้ยินเสียง ลองเปิดใน Safari หรือ Chrome หรือเพิ่มเสียงภาษาไทยในการตั้งค่าของเครื่อง'; },
        fail() { $note.textContent = '⚠️ เล่นเสียงไม่สำเร็จ ลองกดอีกครั้ง หรือเปิดในเบราว์เซอร์อื่น'; },
      });
      tts.load([...$main.querySelectorAll('[data-say]')].map(el => {
        const c = el.cloneNode(true); c.querySelectorAll('.gd-cites,.gd-n').forEach(x => x.remove()); c.querySelectorAll('li,p,h2,b,br').forEach(x => x.after(' '));
        return { text: c.textContent.replace(/\s+/g, ' ').trim(), el };
      }));
      $play.addEventListener('click', () => tts.toggle());
      $main.querySelector('[data-stop]').addEventListener('click', () => tts.stop());
      const rates = [1, 1.25, 0.8]; let ri = 0;
      $main.querySelector('[data-rate]').addEventListener('click', e => { ri = (ri + 1) % rates.length; e.currentTarget.textContent = rates[ri].toFixed(rates[ri] === 1.25 ? 2 : 1) + '×'; tts.setRate(rates[ri]); });
    }

    $main.addEventListener('click', e => { const b = e.target.closest('button.gd-law'); if (b) openCite(b); });
  }

  // ---------- แผ่นตัวบท ----------
  let lastFocus = null;
  function closeSheet() { document.querySelector('.gd-sheet-bg')?.remove(); document.removeEventListener('keydown', onKey); lastFocus?.focus(); }
  function onKey(e) { if (e.key === 'Escape') closeSheet(); }
  async function openCite(btn) {
    lastFocus = btn; closeSheet(); lastFocus = btn;
    const { law, sec, easy } = btn.dataset;
    const bg = document.createElement('div'); bg.className = 'gd-sheet-bg';
    bg.innerHTML = `<div class="gd-sheet" role="dialog" aria-modal="true" aria-labelledby="gd-sh-t"><div class="gd-grab" aria-hidden="true"></div>
      <div class="gd-sheet-h"><h2 id="gd-sh-t">${esc(lawShort(law))} มาตรา ${esc(toTh(sec))}</h2><button class="gd-x" type="button" aria-label="ปิด">✕</button></div>
      <div data-c><p class="gd-src">กำลังโหลดตัวบท…</p></div></div>`;
    bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('.gd-x')) closeSheet(); });
    document.body.appendChild(bg); document.addEventListener('keydown', onKey);
    bg.querySelector('.gd-x').focus();
    const $c = bg.querySelector('[data-c]');
    try {
      const d = await get('/api/lib/cite?law=' + encodeURIComponent(law) + '&sec=' + encodeURIComponent(sec));
      $c.innerHTML = `<p class="gd-src${d.isCurrent ? '' : ' warn'}">${esc(d.title)} · ${d.isCurrent ? 'ตัวบทจากคลัง · ฉบับปัจจุบัน ✓' : 'ตัวบทจากคลัง · ⚠️ ยังไม่ยืนยันว่าเป็นฉบับปัจจุบัน'}</p>
        <div class="gd-stext"></div>
        ${easy ? `<div class="gd-easy"><b>แปลง่าย ๆ:</b> ${esc(easy)}</div>` : ''}
        <div class="gd-sbtns">${tts.ok ? '<button type="button" data-say1>🔊 ฟังมาตรานี้</button>' : ''}<a class="p" href="/library/${esc(d.slug)}#${esc(keyId(d.key))}">เปิดในคลังกฎหมาย</a></div>`;
      $c.querySelector('.gd-stext').textContent = `${d.number} ${d.body}`;
      $c.querySelector('[data-say1]')?.addEventListener('click', () => tts.once(`${d.number} ${d.body}`));
    } catch (e) {
      $c.innerHTML = `<p class="gd-src warn">${esc(e.message)}</p>${easy ? `<div class="gd-easy"><b>แปลง่าย ๆ:</b> ${esc(easy)}</div>` : ''}`;
    }
  }

  // ---------- เริ่ม ----------
  const parts = location.pathname.replace(/\/+$/, '').split('/');
  if (parts[1] === 'guide' && parts[2]) viewGuide(decodeURIComponent(parts[2])); else viewList();
})();
