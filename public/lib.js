/* Vellum Legal Library — หน้าเว็บคลังกฎหมาย (หน้าเดียว เปลี่ยนมุมมองด้วย history API)
   มุมมอง: หน้าแรก /library · รายการ /library?browse=1 · อ่าน /library/<slug> · แอดมิน /library/admin
   ข้อความกฎหมายทั้งหมดมาจากฐานข้อมูล ใส่ลงหน้าเว็บด้วย textContent / esc() เสมอ */
(() => {
  'use strict';
  const $main = document.getElementById('main');
  const TH = '๐๑๒๓๔๕๖๗๘๙';
  const toTh = s => String(s).replace(/[0-9]/g, d => TH[d]);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = d => { if (!d) return 'ไม่ทราบ'; const x = new Date(d); if (isNaN(x)) return 'ไม่ทราบ'; return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear() + 543}`; };
  const keyId = k => 's-' + String(k).replace(/[^0-9a-zก-๙-]+/gi, '-');
  let me = null, meta = null, viewToken = 0, cur = null;

  async function api(path, opts = {}) {
    const res = await fetch('/api/lib' + path, { credentials: 'same-origin', headers: opts.body ? { 'Content-Type': 'application/json' } : {}, ...opts });
    let data = null; try { data = await res.json(); } catch {}
    if (!res.ok) throw Object.assign(new Error(data?.error || 'โหลดข้อมูลไม่สำเร็จ'), { status: res.status });
    return data;
  }
  const status = (s, label) => `<span class="lb-st ${esc(s)}">${esc(label || '')}</span>`;
  const lawRow = l => `<li class="lb-row"><a href="/library/${esc(l.slug)}" data-nav>
      <span class="lb-row-t">${esc(l.title)}</span>
      <span class="lb-row-m"><span>${esc(l.docTypeLabel)}</span>${l.yearBE ? `<span>พ.ศ. ${toTh(l.yearBE)}</span>` : ''}${l.sections != null ? `<span>${toTh(l.sections)} มาตรา</span>` : ''}</span>
      ${status(l.status, l.statusLabel)}</a></li>`;
  const skRows = n => Array.from({ length: n }, () => '<li class="lb-row" style="padding:14px 4px"><span class="sk" style="height:14px;width:70%"></span><span class="sk" style="height:10px;width:35%;margin-top:8px"></span></li>').join('');
  const errBox = (e, retry = true) => `<div class="lb-band" role="alert"><div><b>${esc(e.message)}</b>${retry ? '<br><button class="lb-btn" data-retry style="margin-top:8px">ลองอีกครั้ง</button>' : ''}</div></div>`;


  // ---------- ของฉัน: บันทึก/ไฮไลต์/โน้ต/อ่านต่อ เก็บในเครื่องนี้ (ไม่ต้องเข้าสู่ระบบ) ----------
  const STORE_KEY = 'vl_store_v1';
  const store = (() => {
    let d; try { d = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { d = {}; }
    d.laws = d.laws || {}; d.secs = d.secs || {};
    const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} };
    return {
      d, save,
      law: slug => d.laws[slug],
      sec: (slug, key) => d.secs[slug + '#' + key],
      upSec(slug, key, info, fn) { const k = slug + '#' + key; const x = d.secs[k] || { slug, key, hl: [] }; Object.assign(x, info); fn(x); x.at = Date.now();
        if (!x.saved && !(x.hl && x.hl.length) && !x.note) delete d.secs[k]; else d.secs[k] = x; save(); return d.secs[k]; },
      toggleLaw(slug, title) { if (d.laws[slug]?.saved) delete d.laws[slug]; else d.laws[slug] = { slug, title, saved: true, at: Date.now() }; save(); return !!d.laws[slug]; },
      setLast(slug, title, key, number) { d.last = { slug, title, key, number, at: Date.now() }; save(); },
    };
  })();
  const ALIAS = [[/^(ป\.?\s*พ\.?\s*พ\.?|ปพพ)/, 'แพ่งและพาณิชย์'], [/^(ป\.?\s*วิ\.?\s*พ\.?|ปวิพ)/, 'วิธีพิจารณาความแพ่ง'], [/^(ป\.?\s*อ\.?|ปอ)(?![ก-๙])/, 'ประมวลกฎหมายอาญา'], [/^(ป\.?\s*วิ\.?\s*อ\.?|ปวิอ)/, 'วิธีพิจารณาความอาญา']];
  // แยก "ชื่อกฎหมาย + มาตรา N" ออกจากคำค้น
  function parseQuery(q) {
    const t = q.replace(/[๐-๙]/g, d => TH.indexOf(d)).replace(/\s+/g, ' ').trim();
    const m = t.match(/(?:มาตรา|ม\.)\s*(\d{1,4}(?:\s*\/\s*\d{1,3})?(?:\s*(?:ทวิ|ตรี|จัตวา))?)\s*$/);
    let name = m ? t.slice(0, m.index).trim() : t, sec = m ? m[1].replace(/\s*\/\s*/, '/').replace(/\s+/, ' ') : '';
    for (const [re, full] of ALIAS) if (re.test(name)) { name = full; break; }
    return { name, sec };
  }
  let toastT = 0;
  function toast(msg) {
    let el = document.querySelector('.lb-toast'); if (!el) { el = document.createElement('div'); el.className = 'lb-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2200);
  }
  const TOPIC_IC = {
    contract: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>', consumer: '<path d="M5 8h14l-1.5 11h-11z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    labor: '<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M9 7V5h6v2"/>', property: '<path d="M4 11l8-6 8 6v9H4z"/><path d="M10 20v-5h4v5"/>',
    ip: '<path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z"/><path d="M9.5 20h5"/>', court: '<path d="M12 4v16M5 8h14M7 8l-3 6a3 3 0 0 0 6 0zM17 8l-3 6a3 3 0 0 0 6 0z"/>',
    finance: '<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v11"/>',
    business: '<path d="M4 20V9l5 3V9l5 3V5h6v15z"/>', digital: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
    public: '<path d="M12 3l8 4v2H4V7zM6 10v7M10 10v7M14 10v7M18 10v7M4 20h16"/>', tax: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  };
  const ic = (d, cls = '') => `<svg class="lb-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

  // ---------- ตัวเปลี่ยนหน้า ----------
  function go(url, replace) { history[replace ? 'replaceState' : 'pushState']({}, '', url); route(); }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-nav]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    e.preventDefault(); go(a.getAttribute('href'));
  });
  addEventListener('popstate', route);
  $main.addEventListener('click', e => { if (e.target.closest('[data-retry]')) route(); });

  function markNav(which) {
    document.querySelectorAll('.lb-topnav a, .lb-subnav a').forEach(a => a.removeAttribute('aria-current'));
    const sel = { home: '.lb-topnav a[href="/library"]', browse: '.lb-topnav a[href="/library?browse=1"]', saved: '.lb-topnav a[href="/library?saved=1"]', admin: '.lb-admin-link' }[which];
    if (sel) document.querySelector(sel)?.setAttribute('aria-current', 'page');
    document.querySelector(which === 'saved' ? '.lb-subnav a[href="/library?saved=1"]' : '.lb-subnav a[href="/library"]')?.setAttribute('aria-current', 'page');
  }

  function route() {
    const u = new URL(location.href), parts = u.pathname.replace(/\/+$/, '').split('/');
    const tok = ++viewToken;
    window.scrollTo(0, 0);
    if (parts[2] === 'admin') { markNav('admin'); return viewAdmin(tok); }
    if (parts[2]) { markNav(''); return viewLaw(tok, decodeURIComponent(parts[2]), u.hash.slice(1)); }
    if (u.searchParams.has('saved')) { markNav('saved'); return viewSaved(tok); }
    if (u.searchParams.has('q') && !u.searchParams.has('browse')) { markNav(''); return viewSearch(tok, u.searchParams.get('q')); }
    if (u.searchParams.has('browse') || u.searchParams.has('q') || u.searchParams.has('type') || u.searchParams.has('topic')) { markNav('browse'); return viewBrowse(tok, u.searchParams); }
    markNav('home'); return viewHome(tok);
  }

  // ---------- หน้าแรก ----------
  const searchForm = (val = '', big = true) => `
    <form class="lb-search${big ? ' big' : ''}" role="search" data-search>
      <label for="q" class="lb-skip">ค้นหากฎหมาย</label>
      ${ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>', 'lb-search-ic')}
      <input id="q" name="q" type="search" value="${esc(val)}" placeholder="ชื่อกฎหมาย มาตรา หรือคำค้น" autocomplete="off" maxlength="100" enterkeyhint="search">
      <button type="submit">ค้นหา</button>
    </form>`;
  const bindSearch = () => $main.querySelectorAll('[data-search]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const q = f.q.value.trim(); if (q) go('/library?q=' + encodeURIComponent(q));
  }));
  const lawCard = l => `<a class="lb-card" href="/library/${esc(l.slug)}" data-nav>
      <span class="lb-card-t">${esc(l.title)}</span>
      <span class="lb-card-m">${esc(l.docTypeLabel)}${l.sections != null ? ` · ${toTh(l.sections)} มาตรา` : ''}</span>
      ${status(l.status, l.statusLabel)}</a>`;
  async function viewHome(tok) {
    document.title = 'คลังกฎหมาย · Vellum Legal Library';
    const last = store.d.last, nSaved = Object.keys(store.d.laws).length + Object.values(store.d.secs).filter(x => x.saved).length,
      nHl = Object.values(store.d.secs).reduce((n, x) => n + (x.hl?.length || 0), 0), nNote = Object.values(store.d.secs).filter(x => x.note).length;
    $main.innerHTML = `
      <section class="lb-hero2">
        <p class="lb-eyebrow">Vellum Legal Library</p>
        <h1>ค้นกฎหมายไทย<span>ตรงถึงมาตรา</span></h1>
        ${searchForm()}
        <div class="lb-try"><span>ลองค้น</span>
          ${['มาตรา 420', 'ปพพ มาตรา 538', 'เงินประกัน', 'เลิกจ้าง', 'ผิดสัญญา'].map(x => `<a class="lb-chip" href="/library?q=${encodeURIComponent(x)}" data-nav>${esc(x)}</a>`).join('')}
        </div>
      </section>
      <div class="lb-trust" data-trust>
        <div><b data-n>—</b><span>ฉบับในคลัง</span></div>
        <div><b>ทุกฉบับ</b><span>บอกแหล่งที่มาและวันที่รวบรวม</span></div>
        <div class="lb-legend" aria-label="ความหมายของสถานะ">
          <span class="lb-st in_force">มีผลใช้บังคับ</span><span class="lb-st not_yet_in_force">ยังไม่ถึงวันใช้</span><span class="lb-st repealed">ถูกยกเลิก</span><span class="lb-st unverified">ยังไม่ยืนยัน</span>
        </div>
      </div>
      <div data-learn></div>
      ${last || nSaved || nHl || nNote ? `<div class="lb-mine">
        ${last ? `<a class="lb-resume" href="/library/${esc(last.slug)}#${esc(keyId(last.key))}" data-nav>
          ${ic('<path d="M5 4h10l4 4v12H5z"/><path d="M9 12h6M9 16h4"/>')}<span><small>อ่านต่อจากครั้งก่อน</small><b data-lt></b><em data-ln></em></span><i>›</i></a>` : ''}
        ${nSaved || nHl || nNote ? `<a class="lb-resume alt" href="/library?saved=1" data-nav>${ic('<path d="M6 3h12v18l-6-4-6 4z"/>')}
          <span><small>บันทึกของฉัน</small><b>${toTh(nSaved)} บันทึก · ${toTh(nHl)} ไฮไลต์ · ${toTh(nNote)} โน้ต</b></span><i>›</i></a>` : ''}
      </div>` : ''}
      <section class="lb-sec"><h2>กฎหมายที่ใช้บ่อย</h2><div class="lb-cards" data-popular>${'<span class="sk" style="height:108px"></span>'.repeat(4)}</div></section>
      <section class="lb-sec"><h2>เลือกตามหมวด</h2><div class="lb-topics2" data-topics></div></section>
      <section class="lb-sec"><h2>ประเภทกฎหมาย</h2><div class="lb-quick" data-types></div></section>
      <section class="lb-sec"><h2>เพิ่มเข้าคลังล่าสุด <a class="lb-more" href="/library?browse=1" data-nav>ดูทั้งหมด ›</a></h2><ul class="lb-list" data-latest>${skRows(5)}</ul></section>`;
    if (last) { $main.querySelector('[data-lt]').textContent = last.title; $main.querySelector('[data-ln]').textContent = last.number || ''; }
    bindSearch();
    // การ์ด "เรียนรู้" — แสดงเมื่อมีคู่มือที่เผยแพร่แล้ว (แอดมินเห็นฉบับร่างด้วย)
    fetch('/api/guides', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(g => {
      const box = $main.querySelector('[data-learn]');
      if (tok !== viewToken || !box || !g?.items?.length) return;
      box.innerHTML = `<a class="lb-learn" href="/guide"><span class="lb-learn-ic" aria-hidden="true">📘</span><span class="t"><b>ไม่ถนัดอ่านตัวบท? เรียนรู้แบบภาษาง่าย</b>
        <small>${esc(g.items.slice(0, 3).map(x => x.title).join(' · '))}</small></span><i aria-hidden="true">›</i></a>`;
    }).catch(() => {});
    try {
      const d = await api('/home');
      if (tok !== viewToken) return;
      const q = sel => $main.querySelector(sel);
      q('[data-n]').textContent = toTh(d.total.laws);
      q('[data-types]').innerHTML = d.docTypes.map(t => `<a class="lb-chip" href="/library?type=${esc(t.key)}" data-nav>${esc(t.label)}<span class="n">${toTh(t.n)}</span></a>`).join('');
      q('[data-topics]').innerHTML = d.topics.length ? d.topics.map(t => `<a class="lb-topic2" href="/library?topic=${esc(t.key)}" data-nav>${ic(TOPIC_IC[t.key] || TOPIC_IC.contract)}<b>${esc(t.label)}</b><span>${toTh(t.n)} ฉบับ</span></a>`).join('') : '<p class="lb-empty">ยังไม่มีหมวดหมู่</p>';
      q('[data-popular]').innerHTML = d.popular.length ? d.popular.slice(0, 6).map(lawCard).join('') : '<p class="lb-empty">คลังยังว่าง</p>';
      q('[data-latest]').innerHTML = d.latest.length ? d.latest.map(lawRow).join('') : '<li class="lb-empty">คลังยังว่าง แอดมินนำเข้าข้อมูลได้ที่หน้า "จัดการข้อมูล"</li>';
    } catch (e) { if (tok === viewToken) $main.querySelector('[data-latest]').innerHTML = `<li>${errBox(e)}</li>`; }
  }

  // ---------- ผลการค้นหา: ชื่อกฎหมาย + มาตราที่ตรง + คำในเนื้อหา ----------
  function markWords(text, words, q) {
    let h = esc(text); const list = [q.replace(/\s+/g, ''), ...(words || [])].filter(w => w && w.length > 1).sort((x, y) => y.length - x.length);
    for (const w of list) { const re = new RegExp(esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); if (re.test(h)) { h = h.replace(re, m => `<mark>${m}</mark>`); break; } }
    return h;
  }
  async function viewSearch(tok, q) {
    document.title = q + ' · ค้นหา · คลังกฎหมาย';
    const pq = parseQuery(q);
    $main.innerHTML = `${searchForm(q, false)}
      <div class="lb-res" data-res><div data-best></div>
        <section class="lb-sec"><h2>กฎหมายที่ชื่อตรง <small data-c1></small></h2><ul class="lb-list" data-laws>${skRows(3)}</ul></section>
        <section class="lb-sec"><h2 data-h2>มาตราที่เกี่ยวข้อง <small data-c2></small></h2><div class="lb-hits" data-hits>${'<span class="sk" style="height:96px;margin-bottom:10px"></span>'.repeat(3)}</div></section>
      </div>`;
    bindSearch();
    const qs = sel => $main.querySelector(sel);
    const lawsP = pq.name ? api('/laws?q=' + encodeURIComponent(pq.name)).catch(e => ({ err: e })) : Promise.resolve({ items: [], total: 0 });
    const hitsP = api('/search?q=' + encodeURIComponent(pq.sec ? 'มาตรา ' + pq.sec : q)).catch(e => ({ err: e }));
    const [laws, hits] = await Promise.all([lawsP, hitsP]);
    if (tok !== viewToken) return;
    // ตรงที่สุด: ชื่อกฎหมาย + มาตรา → เปิดไปที่มาตรานั้นเลย
    if (pq.sec && pq.name && laws.items?.length) {
      const l = laws.items[0];
      qs('[data-best]').innerHTML = `<a class="lb-best" href="/library/${esc(l.slug)}#${esc(keyId(pq.sec))}" data-nav><small>ตรงที่สุด</small><b></b><span>มาตรา ${esc(toTh(pq.sec))} ›</span></a>`;
      qs('[data-best] b').textContent = l.title;
    }
    if (laws.err) qs('[data-laws]').innerHTML = `<li>${errBox(laws.err)}</li>`;
    else { qs('[data-c1]').textContent = toTh(laws.total || 0) + ' ฉบับ'; qs('[data-laws]').innerHTML = laws.items.length ? laws.items.slice(0, 8).map(lawRow).join('') : '<li class="lb-empty">ไม่มีกฎหมายที่ชื่อตรงกับคำค้น</li>'; }
    if (hits.err) { qs('[data-hits]').innerHTML = errBox(hits.err); return; }
    // ค้น "ชื่อ + มาตรา": เหลือเฉพาะมาตราของกฎหมายที่ชื่อตรง (ถ้ามี)
    if (pq.sec && pq.name && laws.items?.length) { const ok = new Set(laws.items.map(l => l.slug)); const f = hits.items.filter(h => ok.has(h.slug)); if (f.length) hits.items = f; }
    if (hits.mode === 'section') qs('[data-h2]').firstChild.textContent = `มาตรา ${toTh(pq.sec)} ในกฎหมายแต่ละฉบับ `;
    qs('[data-c2]').textContent = hits.items.length ? toTh(hits.items.length) + (hits.items.length >= 40 ? '+' : '') + ' มาตรา' : '';
    qs('[data-hits]').innerHTML = hits.items.length ? hits.items.map(h => `<a class="lb-hit" href="/library/${esc(h.slug)}#${esc(keyId(h.key))}" data-nav>
        <span class="lb-hit-h"><b>${esc(h.number)}</b><span>${esc(h.title)}</span>${status(h.status, h.statusLabel)}</span>
        <span class="lb-hit-b">${markWords(h.excerpt, hits.words, q)}</span></a>`).join('')
      : `<p class="lb-empty">ไม่พบมาตราที่มีคำนี้ ลองใช้คำที่สั้นลง หรือค้นเป็นเลขมาตรา เช่น "มาตรา 420"</p>`;
  }

  // ---------- บันทึกของฉัน ----------
  function viewSaved(tok) {
    document.title = 'บันทึกของฉัน · คลังกฎหมาย';
    const laws = Object.values(store.d.laws).sort((a, b) => b.at - a.at), secs = Object.values(store.d.secs).sort((a, b) => b.at - a.at);
    const card = x => `<li class="lb-sv" data-k="${esc(x.slug + '#' + x.key)}"><a href="/library/${esc(x.slug)}#${esc(keyId(x.key))}" data-nav>
        <span class="lb-sv-h"><b>${esc(toTh(x.num || ''))}</b><span>${esc(x.title || '')}</span></span>
        ${x.hl?.length ? `<span class="lb-sv-q">${x.hl.map(h => `<mark class="c${esc(h.c)}">${esc(h.t || '')}</mark>`).join(' … ')}</span>` : ''}
        ${x.note ? `<span class="lb-sv-n">${esc(x.note)}</span>` : ''}
        <span class="lb-sv-tag">${x.saved ? '★ บันทึก' : ''}${x.hl?.length ? ` · ไฮไลต์ ${toTh(x.hl.length)}` : ''}${x.note ? ' · โน้ต' : ''}</span></a></li>`;
    $main.innerHTML = `<div class="lb-browse-h"><h1>บันทึกของฉัน</h1><span class="lb-count">เก็บไว้ในเครื่องนี้เท่านั้น</span></div>
      <section class="lb-sec"><h2>กฎหมายที่บันทึก <small>${toTh(laws.length)}</small></h2>
        ${laws.length ? `<ul class="lb-list">${laws.map(l => `<li class="lb-row"><a href="/library/${esc(l.slug)}" data-nav><span class="lb-row-t">${esc(l.title)}</span><span class="lb-row-m">บันทึกเมื่อ ${thDate(l.at)}</span></a></li>`).join('')}</ul>` : '<p class="lb-empty">ยังไม่มี กด ☆ ที่หัวกฎหมายเพื่อบันทึก</p>'}</section>
      <section class="lb-sec"><h2>มาตรา ไฮไลต์ และโน้ต <small>${toTh(secs.length)}</small></h2>
        ${secs.length ? `<ul class="lb-svs">${secs.map(card).join('')}</ul>` : '<p class="lb-empty">ยังไม่มี แตะเลขมาตราในหน้าอ่าน แล้วเลือก "บันทึก" "ไฮไลต์" หรือ "โน้ต"</p>'}</section>`;
  }

  // ---------- รายการทั้งหมด ----------
  async function viewBrowse(tok, sp) {
    document.title = 'กฎหมายทั้งหมด · คลังกฎหมาย';
    if (!meta) { try { meta = await api('/meta'); } catch (e) { $main.innerHTML = errBox(e); return; } }
    const cur = k => sp.get(k) || '';
    const opt = (obj, val, all) => `<option value="">${all}</option>` + Object.entries(obj).map(([k, v]) => `<option value="${esc(k)}"${k === val ? ' selected' : ''}>${esc(v)}</option>`).join('');
    $main.innerHTML = `
      <div class="lb-browse-h"><h1>กฎหมายทั้งหมด</h1><span class="lb-count" data-count></span></div>
      <form class="lb-filters" data-f>
        <input name="q" type="search" placeholder="ค้นชื่อกฎหมาย" value="${esc(cur('q'))}" maxlength="100" aria-label="ค้นชื่อกฎหมาย">
        <select name="type" aria-label="ประเภท">${opt(meta.docTypes, cur('type'), 'ทุกประเภท')}</select>
        <select name="topic" aria-label="หมวดหมู่">${opt(meta.topics, cur('topic'), 'ทุกหมวด')}</select>
        <select name="status" aria-label="สถานะ">${opt(meta.statuses, cur('status'), 'ทุกสถานะ')}</select>
        <select name="sort" aria-label="เรียงตาม"><option value="">เพิ่มล่าสุด</option><option value="title"${cur('sort') === 'title' ? ' selected' : ''}>ชื่อ ก–ฮ</option><option value="year"${cur('sort') === 'year' ? ' selected' : ''}>ปีใหม่–เก่า</option></select>
      </form>
      <ul class="lb-list" data-list>${skRows(8)}</ul>
      <div class="lb-pager" data-pager></div>`;
    const f = $main.querySelector('[data-f]');
    const apply = () => {
      const p = new URLSearchParams({ browse: '1' });
      for (const [k, v] of new FormData(f)) if (String(v).trim()) p.set(k, String(v).trim());
      go('/library?' + p.toString(), true);
    };
    f.addEventListener('change', apply);
    f.addEventListener('submit', e => { e.preventDefault(); apply(); });
    try {
      const qs = new URLSearchParams(); for (const k of ['q', 'type', 'topic', 'status', 'sort', 'page']) if (cur(k)) qs.set(k, cur(k));
      const d = await api('/laws?' + qs);
      if (tok !== viewToken) return;
      $main.querySelector('[data-count]').textContent = `พบ ${toTh(d.total)} ฉบับ`;
      $main.querySelector('[data-list]').innerHTML = d.items.length ? d.items.map(lawRow).join('')
        : `<li class="lb-empty">ไม่พบกฎหมายที่ตรงกับเงื่อนไข ลองลดตัวกรองหรือค้นด้วยคำที่สั้นลง${cur('q') ? ' (ตอนนี้ค้นได้เฉพาะชื่อกฎหมาย)' : ''}</li>`;
      const pages = Math.ceil(d.total / d.pageSize);
      if (pages > 1) {
        const link = n => { const p = new URLSearchParams(sp); p.set('page', n); return '/library?' + p; };
        $main.querySelector('[data-pager]').innerHTML = `${d.page > 1 ? `<a class="lb-btn" href="${esc(link(d.page - 1))}" data-nav>ก่อนหน้า</a>` : ''}
          <span class="lb-count" style="align-self:center">หน้า ${toTh(d.page)} / ${toTh(pages)}</span>
          ${d.page < pages ? `<a class="lb-btn" href="${esc(link(d.page + 1))}" data-nav>ถัดไป</a>` : ''}`;
      }
    } catch (e) { if (tok === viewToken) $main.querySelector('[data-list]').innerHTML = `<li>${errBox(e)}</li>`; }
  }

  // ---------- หน้าอ่านกฎหมาย ----------
  async function viewLaw(tok, slug, hash) {
    $main.innerHTML = `<div class="lb-crumb"><a href="/library" data-nav>คลังกฎหมาย</a></div><span class="sk" style="height:34px;width:60%"></span><span class="sk" style="height:14px;width:30%;margin-top:14px"></span>`;
    let law, toc;
    try { [law, toc] = await Promise.all([api('/laws/' + encodeURIComponent(slug)), api('/laws/' + encodeURIComponent(slug) + '/toc')]); }
    catch (e) { if (tok === viewToken) $main.innerHTML = e.status === 404 ? `<div class="lb-band"><div><b>ไม่พบกฎหมายนี้ในคลัง</b><br><a href="/library?browse=1" data-nav>ดูกฎหมายทั้งหมด</a></div></div>` : errBox(e); return; }
    if (tok !== viewToken) return;
    document.title = law.title + ' · คลังกฎหมาย';
    api('/laws/' + encodeURIComponent(slug) + '/view', { method: 'POST' }).catch(() => {});
    const v = law.versions[0];
    const current = law.versions.find(x => x.isCurrent);
    const verifiedNote = law.status !== 'unverified'
      ? `<b>สถานะ: ${esc(law.statusLabel)}</b> · ยืนยันเมื่อ ${thDate(law.statusVerifiedAt)}${law.statusEvidence ? ` · <a href="${esc(law.statusEvidence)}" target="_blank" rel="noopener">หลักฐาน</a>` : ''}`
      : `<b>ยังไม่ยืนยันสถานะและยังไม่ยืนยันว่าเป็นฉบับปัจจุบัน</b><br>ข้อความนี้มาจาก${esc(v?.source?.name || 'แหล่งข้อมูล')}${v?.source?.collectedAt ? ` รวบรวมเมื่อ ${thDate(v.source.collectedAt)}` : ''} อาจไม่รวมการแก้ไขหลังจากนั้น ตรวจกับราชกิจจานุเบกษาก่อนใช้อ้างอิง`;
    $main.innerHTML = `
      <div class="lb-crumb"><a href="/library" data-nav>คลังกฎหมาย</a> / <a href="/library?type=${esc(law.docType)}" data-nav>${esc(law.docTypeLabel)}</a></div>
      <header class="lb-law-h">
        <h1></h1>
        <div class="lb-law-meta">${status(law.status, law.statusLabel)}${law.yearBE ? `<span>พ.ศ. ${toTh(law.yearBE)}</span>` : ''}<span>${toTh(v?.sections ?? 0)} มาตรา</span>${current ? '<span>ฉบับนี้ยืนยันแล้วว่าเป็นฉบับปัจจุบัน</span>' : ''}</div>
        <div class="lb-band"><div>${verifiedNote}</div></div>
      </header>
        <div class="lb-acts" data-acts>
          <button type="button" class="lb-btn lb-tocbtn" data-tocbtn>${ic('<path d="M4 6h16M4 12h16M4 18h10"/>')}สารบัญ</button>
          <form class="lb-jump" data-jump><label for="jump">ไปที่มาตรา</label><input id="jump" name="n" inputmode="numeric" placeholder="420" maxlength="12" autocomplete="off"><button type="submit" aria-label="ไป">›</button></form>
          <button type="button" class="lb-btn lb-savelaw" data-savelaw aria-pressed="false">${ic('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>')}<span>บันทึกกฎหมายนี้</span></button>
        </div>
      <div class="lb-reader">
        <nav class="lb-toc" aria-label="สารบัญ" data-tocnav><div class="lb-toc-h"><h2>สารบัญ</h2><button type="button" class="lb-toc-x" data-tocx aria-label="ปิดสารบัญ">×</button></div><ol data-toc></ol></nav>
        <article class="lb-text" data-text><span class="sk" style="height:16px;width:90%"></span></article>
        <aside class="lb-aside" data-aside></aside>
      </div>`;
    $main.querySelector('.lb-law-h h1').textContent = law.title;
    cur = { slug, title: law.title, law, v };
    renderAside(law, v);
    const sv = $main.querySelector('[data-savelaw]');
    const paintSave = () => { const on = !!store.law(slug)?.saved; sv.setAttribute('aria-pressed', on); sv.querySelector('span').textContent = on ? 'บันทึกแล้ว' : 'บันทึกกฎหมายนี้'; };
    paintSave();
    sv.addEventListener('click', () => { toast(store.toggleLaw(slug, law.title) ? 'บันทึกกฎหมายนี้แล้ว · ดูได้ที่ "บันทึกของฉัน"' : 'เอาออกจากบันทึกแล้ว'); paintSave(); });
    const navEl = $main.querySelector('[data-tocnav]');
    const sheet = on => { navEl.classList.toggle('open', on); document.body.classList.toggle('lb-lock', on); };
    $main.querySelector('[data-tocbtn]').addEventListener('click', () => sheet(true));
    $main.querySelector('[data-tocx]').addEventListener('click', () => sheet(false));
    navEl.addEventListener('click', e => { if (e.target === navEl) sheet(false); });
    // สารบัญ
    const tocEl = $main.querySelector('[data-toc]');
    tocEl.innerHTML = toc.heads.length ? toc.heads.map(h => `<li><a href="#h-${h.ord}" class="l-${esc(h.level || '')}" data-ord="${h.ord}"></a></li>`).join('') : '<li class="lb-empty" style="padding:4px 8px">ฉบับนี้ไม่มีการแบ่งหมวด</li>';
    tocEl.querySelectorAll('a').forEach((a, i) => { a.textContent = toc.heads[i].heading; });
    const keyOrd = new Map(toc.keys);

    // เนื้อหา: โหลดทีละชุด และโหลดเพิ่มจนถึงมาตราที่ลิงก์มา
    const textEl = $main.querySelector('[data-text]');
    let next = 0, more = true, loading = null, first = true;
    const loadMore = async () => {
      if (loading) return loading;
      loading = (async () => {
        const d = await api(`/laws/${encodeURIComponent(slug)}/text?v=${toc.versionId}&from=${next}&limit=300`);
        if (tok !== viewToken) return;
        if (first) { textEl.innerHTML = ''; first = false; if (d.preamble) renderPreamble(textEl, d.preamble); }
        textEl.querySelector('.lb-loadmore')?.remove();
        renderUnits(textEl, d.units, d.footnotes);
        next = d.next; more = d.more;
        if (more) { const b = document.createElement('button'); b.className = 'lb-btn lb-loadmore'; b.textContent = 'โหลดมาตราถัดไป'; b.onclick = () => loadMore(); textEl.appendChild(b); }
        else if (toc.annexFrom) addAnnexButton(textEl, slug, toc.versionId);
      })().finally(() => { loading = null; });
      return loading;
    };
    const ensure = async (ord) => { while (more && next < ord && tok === viewToken) await loadMore(); };
    try {
      await loadMore();
      if (hash) {
        const want = hash.startsWith('h-') ? Number(hash.slice(2)) : [...keyOrd].find(([k]) => keyId(k) === hash)?.[1];
        if (want) { await ensure(want); document.getElementById(hash)?.scrollIntoView({ block: 'start' }); }
      }
    } catch (e) { textEl.innerHTML = errBox(e); }
    const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    $main.querySelector('[data-jump]').addEventListener('submit', async e => {
      e.preventDefault();
      const raw = e.target.n.value.replace(/[๐-๙]/g, d => TH.indexOf(d)).replace(/^\s*(มาตรา|ม\.)\s*/, '').replace(/\s*\/\s*/, '/').replace(/\s+/g, ' ').trim();
      const ord = keyOrd.get(raw);
      if (!ord) { toast('ไม่พบมาตรา ' + toTh(raw || '?') + ' ในฉบับนี้'); return; }
      await ensure(ord); const el = document.getElementById(keyId(raw));
      if (el) { history.replaceState({}, '', '#' + el.id); el.scrollIntoView({ block: 'start', behavior: smooth() }); el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 1600); }
      e.target.n.blur();
    });
    let posT = 0;
    const pio = new IntersectionObserver(es => {
      const top = es.filter(x => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!top) return; clearTimeout(posT);
      posT = setTimeout(() => { if (tok === viewToken) store.setLast(slug, law.title, top.target.dataset.key, top.target.dataset.num); }, 900);
    }, { rootMargin: '-130px 0px -60% 0px' });
    new MutationObserver(() => textEl.querySelectorAll('.lb-s:not([data-po])').forEach(x => { x.dataset.po = 1; pio.observe(x); })).observe(textEl, { childList: true, subtree: true });
    tocEl.addEventListener('click', async e => {
      const a = e.target.closest('a[data-ord]'); if (!a) return;
      e.preventDefault(); sheet(false); const ord = Number(a.dataset.ord);
      await ensure(ord); history.replaceState({}, '', '#h-' + ord);
      document.getElementById('h-' + ord)?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    // เลื่อนอ่านต่อ: ใกล้ล่างสุดแล้วโหลดเพิ่มเอง
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting) && more) loadMore().catch(() => {}); }, { rootMargin: '800px' });
    const watch = () => { const b = textEl.querySelector('.lb-loadmore'); if (b) io.observe(b); };
    new MutationObserver(watch).observe(textEl, { childList: true });
    watch();
  }

  function renderPreamble(el, text) {
    const p = document.createElement('div'); p.className = 'lb-preamble'; p.textContent = text.replace(/\[[๐-๙0-9]+\]/g, '');
    el.appendChild(p);
    if (text.length > 400) {
      p.classList.add('clamp');
      const b = document.createElement('button'); b.className = 'lb-btn lb-more-pre'; b.textContent = 'อ่านคำปรารภทั้งหมด';
      b.onclick = () => { p.classList.remove('clamp'); b.remove(); };
      el.appendChild(b);
    }
  }

  function fnButton(n, text) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'lb-fn'; b.textContent = toTh(n); b.dataset.fn = text; b.setAttribute('aria-label', 'เชิงอรรถ ' + n); b.setAttribute('aria-expanded', 'false');
    return b;
  }
  // ข้อความมาตรา: แทนเครื่องหมายเชิงอรรถ [๑๒] ด้วยปุ่มเล็ก กดแล้วแสดงเชิงอรรถจากต้นฉบับ
  function bodyNode(text, footnotes) {
    const div = document.createElement('div'); div.className = 'lb-s-b';
    const re = /\[([๐-๙0-9]+)\]/g; let last = 0, m;
    while ((m = re.exec(text))) {
      div.appendChild(document.createTextNode(text.slice(last, m.index)));
      const n = m[1].replace(/[๐-๙]/g, d => TH.indexOf(d));
      if (footnotes[n]) { const sup = document.createElement('sup'); sup.appendChild(fnButton(n, footnotes[n])); div.appendChild(sup); }
      last = re.lastIndex;
    }
    div.appendChild(document.createTextNode(text.slice(last)));
    return div;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button.lb-fn'); if (!b) return;
    const host = b.closest('.lb-s')?.querySelector('.lb-s-b'); if (!host) return;
    const open = host.nextElementSibling?.classList.contains('lb-fnpop') ? host.nextElementSibling : null;
    if (open && open.dataset.for === b.textContent) { open.remove(); b.setAttribute('aria-expanded', 'false'); return; }
    open?.remove();
    const p = document.createElement('div'); p.className = 'lb-fnpop'; p.dataset.for = b.textContent; p.textContent = `เชิงอรรถ [${b.textContent}] ${b.dataset.fn}`;
    host.after(p); b.setAttribute('aria-expanded', 'true');
  });

  function renderUnits(el, units, footnotes) {
    const frag = document.createDocumentFragment();
    for (const u of units) {
      if (u.kind === 'heading') {
        const h = document.createElement('h2'); h.className = 'lb-head l-' + (u.level || ''); h.id = 'h-' + u.ord; h.textContent = u.heading;
        frag.appendChild(h); continue;
      }
      const s = document.createElement('section'); s.className = 'lb-s'; s.id = keyId(u.key || u.ord);
      const a = document.createElement('a'); a.className = 'lb-s-n'; a.href = '#' + s.id;
      const num = (u.number || '').replace(/^มาตรา\s*/, '').replace(/\s*ถึงมาตรา\s*/, '–');
      a.innerHTML = '<small>มาตรา</small>'; a.appendChild(document.createTextNode(num));
      a.setAttribute('aria-label', (u.number || '') + ' (ลิงก์ไปมาตรานี้)');
      const g = document.createElement('div'); g.className = 'lb-s-g'; g.appendChild(a);
      // เชิงอรรถที่ติดกับหัวมาตรา (เช่น "แก้ไขเพิ่มเติมโดย…") แสดงใต้เลขมาตรา
      const fnHead = (u.notes || []).filter(n => footnotes[n] && !new RegExp('\\[(' + n + '|' + toTh(n) + ')\\]').test(u.body));
      if (fnHead.length) { const sup = document.createElement('sup'); fnHead.forEach(n => sup.appendChild(fnButton(n, footnotes[n]))); g.appendChild(sup); }
      s.append(g, bodyNode(u.body, footnotes));
      s.dataset.key = u.key || u.ord; s.dataset.num = u.number || '';
      if (cur && u.main !== false) decorate(s);
      frag.appendChild(s);
    }
    el.appendChild(frag);
  }

  function addAnnexButton(el, slug, vid) {
    const b = document.createElement('button'); b.className = 'lb-btn lb-loadmore'; b.textContent = 'แสดงบทบัญญัติของกฎหมายที่แก้ไขเพิ่มเติม (บทเฉพาะกาล)';
    b.onclick = async () => {
      b.disabled = true;
      try {
        const box = document.createElement('div'); box.className = 'lb-annex';
        let from = 0, more = true;
        while (more) { const d = await api(`/laws/${encodeURIComponent(slug)}/text?v=${vid}&annex=only&from=${from}&limit=400`); renderAnnex(box, d.units, d.footnotes); from = d.next; more = d.more; }
        b.replaceWith(box);
      } catch (e) { b.disabled = false; b.textContent = e.message; }
    };
    el.appendChild(b);
  }
  function renderAnnex(box, units, fns) {
    let lastBlock = box.dataset.block;
    for (const u of units) {
      if (String(u.block) !== lastBlock) {
        lastBlock = String(u.block);
        const h = document.createElement('h3'); h.className = 'lb-annex-h'; h.textContent = 'บทบัญญัติท้ายฉบับ (ชุดที่ ' + toTh(u.block) + ')'; box.appendChild(h);
      }
      renderUnits(box, [u], fns);
    }
    box.dataset.block = lastBlock;
  }


  // ---------- เครื่องมือต่อมาตรา: แตะเลขมาตรา → บันทึก · ไฮไลต์ · โน้ต · คัดลอกพร้อมอ้างอิง · ลิงก์ ----------
  const HL = [['1', 'เหลือง'], ['2', 'เขียว'], ['3', 'ชมพู']];
  // ตำแหน่งตัวอักษรในข้อความมาตรา (ไม่นับเลขเชิงอรรถ)
  function textNodes(b) { const out = []; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('sup,.lb-fnpop') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }); let n; while ((n = w.nextNode())) out.push(n); return out; }
  function offsetOf(b, node, off) { let n = 0; for (const t of textNodes(b)) { if (t === node) return n + off; n += t.data.length; } return -1; }
  function paintHL(sEl) {
    const b = sEl.querySelector('.lb-s-b'); if (!b) return;
    b.querySelectorAll('mark.hl').forEach(m => m.replaceWith(...m.childNodes)); b.normalize();
    const x = store.sec(cur.slug, sEl.dataset.key); if (!x?.hl?.length) return;
    [...x.hl].sort((p, q) => q.s - p.s).forEach((h, idx) => {
      let pos = 0;
      for (const t of textNodes(b)) {
        const L = t.data.length, a = Math.max(h.s, pos), z = Math.min(h.e, pos + L);
        if (a < z) { const r = document.createRange(); r.setStart(t, a - pos); r.setEnd(t, z - pos); const m = document.createElement('mark'); m.className = 'hl c' + h.c; m.dataset.hs = h.s; r.surroundContents(m); }
        pos += L;
      }
    });
  }
  function paintSec(sEl) {
    const x = store.sec(cur.slug, sEl.dataset.key);
    sEl.classList.toggle('saved', !!x?.saved);
    let n = sEl.querySelector(':scope > .lb-note');
    if (x?.note) { if (!n) { n = document.createElement('div'); n.className = 'lb-note'; sEl.appendChild(n); } n.textContent = x.note; } else n?.remove();
  }
  function decorate(sEl) { if (!store.sec(cur.slug, sEl.dataset.key)) return; paintHL(sEl); paintSec(sEl); }
  const secInfo = sEl => ({ title: cur.title, num: sEl.dataset.num });
  function cite(sEl) {
    const b = sEl.querySelector('.lb-s-b').cloneNode(true); b.querySelectorAll('sup').forEach(x => x.remove());
    const v = cur.v, unv = cur.law.status === 'unverified';
    return `${cur.title} ${sEl.dataset.num}\n${b.textContent.trim()}\n\nที่มา: ${v?.source?.name || 'แหล่งข้อมูลต้นฉบับ'}${v?.source?.collectedAt ? ` (รวบรวมเมื่อ ${thDate(v.source.collectedAt)})` : ''} ผ่าน Vellum คลังกฎหมาย ${location.origin}/library/${cur.slug}#${sEl.id}`
      + (unv ? '\nหมายเหตุ: ยังไม่ยืนยันว่าเป็นฉบับปัจจุบัน ตรวจกับราชกิจจานุเบกษาก่อนอ้างอิง' : `\nสถานะ: ${cur.law.statusLabel}`);
  }
  async function copy(text) { try { await navigator.clipboard.writeText(text); return true; } catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); return ok; } }
  function closeBar() { document.querySelectorAll('.lb-bar').forEach(x => x.remove()); document.querySelectorAll('.lb-s.act').forEach(x => x.classList.remove('act')); }
  function openBar(sEl) {
    const was = sEl.querySelector(':scope > .lb-bar'); closeBar(); if (was) return;
    const x = store.sec(cur.slug, sEl.dataset.key) || {};
    const bar = document.createElement('div'); bar.className = 'lb-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'เครื่องมือ ' + sEl.dataset.num);
    bar.innerHTML = `<button type="button" data-a="save" aria-pressed="${!!x.saved}">${ic('<path d="M6 3h12v18l-6-4-6 4z"/>')}${x.saved ? 'บันทึกแล้ว' : 'บันทึก'}</button>
      <button type="button" data-a="hl">${ic('<path d="M4 20h7M14.5 4.5l5 5L10 19H5v-5z"/>')}ไฮไลต์ทั้งมาตรา</button>
      <button type="button" data-a="note">${ic('<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4"/>')}${x.note ? 'แก้โน้ต' : 'โน้ต'}</button>
      <button type="button" data-a="copy">${ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>')}คัดลอกพร้อมอ้างอิง</button>
      <button type="button" data-a="link">${ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>')}ลิงก์</button>
      <p class="lb-bar-tip">หรือลากเลือกข้อความในมาตราเพื่อไฮไลต์เฉพาะช่วง</p>`;
    sEl.querySelector('.lb-s-b').after(bar); sEl.classList.add('act');
    bar.addEventListener('click', async e => {
      const a = e.target.closest('button[data-a]')?.dataset.a; if (!a) return;
      const key = sEl.dataset.key;
      if (a === 'save') { const r = store.upSec(cur.slug, key, secInfo(sEl), y => { y.saved = !y.saved; }); paintSec(sEl); toast(r?.saved ? 'บันทึก' + sEl.dataset.num + 'แล้ว' : 'เอาออกจากบันทึกแล้ว'); closeBar(); }
      if (a === 'hl') { const L = textNodes(sEl.querySelector('.lb-s-b')).reduce((n, t) => n + t.data.length, 0);
        store.upSec(cur.slug, key, secInfo(sEl), y => { y.hl = (y.hl || []).filter(h => !(h.s === 0 && h.e === L)); y.hl.push({ s: 0, e: L, c: '1', t: sEl.querySelector('.lb-s-b').textContent.slice(0, 80) }); });
        paintHL(sEl); toast('ไฮไลต์ทั้งมาตราแล้ว · แตะที่ไฮไลต์เพื่อลบ'); closeBar(); }
      if (a === 'note') { bar.innerHTML = `<form class="lb-noteform"><label for="nt">โน้ตส่วนตัว · ${esc(sEl.dataset.num)}</label><textarea id="nt" maxlength="600" rows="3" placeholder="เช่น ใช้กับข้อ 5 ในสัญญาเช่า"></textarea>
          <div><button type="submit" class="lb-btn primary">บันทึกโน้ต</button>${x.note ? ' <button type="button" class="lb-btn" data-del>ลบโน้ต</button>' : ''} <button type="button" class="lb-btn" data-cancel>ยกเลิก</button></div></form>`;
        const f = bar.querySelector('form'); f.querySelector('textarea').value = x.note || ''; f.querySelector('textarea').focus();
        f.addEventListener('submit', ev => { ev.preventDefault(); store.upSec(cur.slug, key, secInfo(sEl), y => { y.note = f.querySelector('textarea').value.trim(); }); paintSec(sEl); closeBar(); toast('บันทึกโน้ตแล้ว'); });
        f.querySelector('[data-cancel]').onclick = closeBar;
        const del = f.querySelector('[data-del]'); if (del) del.onclick = () => { store.upSec(cur.slug, key, {}, y => { y.note = ''; }); paintSec(sEl); closeBar(); toast('ลบโน้ตแล้ว'); };
      }
      if (a === 'copy') { toast(await copy(cite(sEl)) ? 'คัดลอก' + sEl.dataset.num + 'พร้อมที่มาแล้ว' : 'คัดลอกไม่สำเร็จ'); closeBar(); }
      if (a === 'link') { history.replaceState({}, '', '#' + sEl.id); toast(await copy(location.href) ? 'คัดลอกลิงก์มาตรานี้แล้ว' : 'คัดลอกไม่สำเร็จ'); closeBar(); }
    });
  }
  // แตะเลขมาตรา = เปิดเครื่องมือ · แตะไฮไลต์ = ลบ · เลือกข้อความ = ปุ่มไฮไลต์ลอย
  document.addEventListener('click', e => {
    const n = e.target.closest('.lb-text .lb-s-n'); if (n && cur) { e.preventDefault(); openBar(n.closest('.lb-s')); return; }
    const m = e.target.closest('.lb-text mark.hl'); if (m && cur && !getSelection().toString()) {
      const sEl = m.closest('.lb-s'), hs = Number(m.dataset.hs);
      store.upSec(cur.slug, sEl.dataset.key, {}, y => { y.hl = (y.hl || []).filter(h => h.s !== hs); }); paintHL(sEl); toast('ลบไฮไลต์แล้ว');
    }
  });
  let pop = null;
  const hidePop = () => { pop?.remove(); pop = null; };
  document.addEventListener('selectionchange', () => { if (pop && !getSelection().toString()) setTimeout(() => { if (!getSelection().toString()) hidePop(); }, 150); });
  const showPop = () => {
    const sel = getSelection(); if (!cur || !sel.rangeCount || sel.isCollapsed) return;
    const r = sel.getRangeAt(0), b1 = r.startContainer.parentElement?.closest('.lb-text .lb-s-b'), b2 = r.endContainer.parentElement?.closest('.lb-text .lb-s-b');
    if (!b1 || b1 !== b2) return;
    const s0 = offsetOf(b1, r.startContainer, r.startOffset), e0 = offsetOf(b1, r.endContainer, r.endOffset);
    if (s0 < 0 || e0 <= s0) return;
    hidePop(); pop = document.createElement('div'); pop.className = 'lb-pop';
    pop.innerHTML = '<span>ไฮไลต์</span>' + HL.map(([c, t]) => `<button type="button" class="c${c}" data-c="${c}" aria-label="ไฮไลต์สี${t}"></button>`).join('');
    const rc = r.getBoundingClientRect(); pop.style.left = Math.max(8, Math.min(innerWidth - 190, rc.left + rc.width / 2 - 90)) + 'px'; pop.style.top = (rc.top + scrollY - 48) + 'px';
    document.body.appendChild(pop);
    pop.addEventListener('pointerdown', ev => ev.preventDefault());
    pop.addEventListener('click', ev => {
      const c = ev.target.closest('[data-c]')?.dataset.c; if (!c) return;
      const sEl = b1.closest('.lb-s'), text = sel.toString().trim().slice(0, 160);
      store.upSec(cur.slug, sEl.dataset.key, secInfo(sEl), y => { y.hl = (y.hl || []).filter(h => h.e <= s0 || h.s >= e0); y.hl.push({ s: s0, e: e0, c, t: text }); });
      sel.removeAllRanges(); hidePop(); paintHL(sEl); toast('ไฮไลต์แล้ว · ดูรวมได้ที่ "บันทึกของฉัน"');
    });
  };
  document.addEventListener('mouseup', () => setTimeout(showPop, 10));
  document.addEventListener('touchend', () => setTimeout(showPop, 350));

  function renderAside(law, v) {
    const el = $main.querySelector('[data-aside]');
    const ev = law.events || [];
    const src = v?.source || {};
    el.innerHTML = `
      <section class="lb-box"><h2>แหล่งที่มา</h2>
        <dl>
          <dt>ข้อมูลจาก</dt><dd data-src></dd>
          <dt>รวบรวมเมื่อ</dt><dd>${thDate(src.collectedAt)}</dd>
          <dt>สิทธิการใช้</dt><dd data-lic></dd>
          ${v?.sourceUrl ? `<dt>ต้นฉบับ</dt><dd><a href="${esc(v.sourceUrl)}" target="_blank" rel="noopener">เปิดหน้าต้นฉบับ</a></dd>` : ''}
          ${v?.gazette ? `<dt>ราชกิจจาฯ</dt><dd><span data-gaz></span><br><small style="color:var(--ink-3)">อ้างอิงแรกที่พบในเอกสาร</small></dd>` : ''}
        </dl>
        ${v?.quality?.gaps ? `<p style="margin-top:10px">เลขมาตราในข้อมูลชุดนี้ขาดช่วง ${toTh(v.quality.gaps)} เลข ตรวจกับต้นฉบับก่อนอ้างอิง</p>` : ''}
      </section>
      <section class="lb-box"><h2>ประวัติการประกาศและแก้ไข</h2>
        ${ev.length ? `<ol class="lb-tl">${ev.map((e, i) => `<li class="${esc(e.kind)}"><time>${thDate(e.date)}</time><span data-ev="${i}"></span></li>`).join('')}</ol>
          <p style="margin-top:6px;font-size:13px">ดึงจากเชิงอรรถในข้อมูลต้นฉบับ ยังไม่ได้ตรวจยืนยัน</p>` : '<p>ยังไม่มีข้อมูล</p>'}
      </section>`;
    el.querySelector('[data-src]').textContent = src.name || '—';
    el.querySelector('[data-lic]').textContent = src.license || '—';
    if (v?.gazette) el.querySelector('[data-gaz]').textContent = v.gazette;
    el.querySelectorAll('[data-ev]').forEach(s => { const e = ev[Number(s.dataset.ev)]; s.textContent = e.title + (e.gazette ? ' · ' + e.gazette : ''); });
  }

  // ---------- แอดมิน: ยืนยันสถานะ ----------
  const EVIDENCE_URL = 'https://www.ocs.go.th/searchlaw';
  const needsVerify = l => l.status === 'unverified' || !l.is_current_verified;
  const autoNote = l => {
    const asOf = /ข้อมูล ณ ([^)]+)\)/.exec(l.version_label || '');
    const am = l.latest_amend ? String(l.latest_amend).replace(/\s+/g, ' ').slice(0, 160) : '';
    return (`ฉบับรวมกฤษฎีกา${asOf ? ' ณ ' + asOf[1] : ''}` + (am ? ` · แก้ไขล่าสุด: ${am}` : '')).slice(0, 500);
  };

  // ---------- แอดมิน: นำเข้าจาก PDF ----------
  const normTitle = t => String(t || '').replace(/[๐-๙]/g, c => TH.indexOf(c)).replace(/พุทธศักราช/g, 'พ.ศ.').replace(/[\s"“”]+/g, '').toLowerCase();
  const baseTitle = t => normTitle(t).replace(/พ\.ศ\.\d{4}.*$/, '');
  let pdfLib = null;
  async function loadPdf() {
    if (pdfLib) return pdfLib;
    const [pdfjs, conv] = await Promise.all([import('/pdfjs-6.2.108.min.mjs'), import('/pdf2law.js?v=2')]);
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs-6.2.108.worker.min.mjs';
    return (pdfLib = { pdfjs, conv });
  }
  function pdfBatch(box, d, tok) {
    const rowsEl = box.querySelector('[data-pdfrows]'), goEl = box.querySelector('[data-pdfgo]'), sumEl = box.querySelector('[data-pdfsum]'), dateEl = box.querySelector('[data-pdfdate]');
    dateEl.value = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
    let rows = [], busy = false;
    const matchLaw = title => {
      const n = normTitle(title), b = baseTitle(title);
      return d.laws.find(l => normTitle(l.title) === n) || (d.laws.filter(l => baseTitle(l.title) === b).length === 1 ? d.laws.find(l => baseTitle(l.title) === b) : null);
    };
    const LABEL = { wait: 'รอคิว', conv: 'กำลังแปลง', check: 'กำลังตรวจ', ok: 'พร้อมนำเข้า', warn: 'ควรดูก่อน', bad: 'นำเข้าไม่ได้', imp: 'กำลังนำเข้า', done: 'นำเข้าแล้ว' };
    const draw = () => {
      rowsEl.innerHTML = rows.map((r, i) => `<div class="lb-pdfrow ${r.state}" data-i="${i}">
        <label class="lb-pdfck"><input type="checkbox" ${r.pick ? 'checked' : ''} ${['ok', 'warn'].includes(r.state) && !busy ? '' : 'disabled'} aria-label="เลือกไฟล์นี้"></label>
        <div class="lb-pdfmain">
          <div class="lb-pdfst"><b>${LABEL[r.state]}</b>${r.progress ? ` · ${esc(r.progress)}` : ''}</div>
          <textarea class="lb-pdft" rows="2" placeholder="ชื่อกฎหมาย" ${r.text && !busy && r.state !== 'done' ? '' : 'disabled'} aria-label="ชื่อกฎหมาย (แก้ได้)">${esc(r.title || '')}</textarea>
          <div class="lb-count">${esc(r.file.name)}${r.info ? ' · ' + r.info : ''}</div>
          ${r.notes?.length ? `<ul class="lb-warn">${r.notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
        </div></div>`).join('');
      const picked = rows.filter(r => r.pick && ['ok', 'warn'].includes(r.state));
      const working = rows.some(r => ['wait', 'conv', 'check'].includes(r.state));
      sumEl.textContent = rows.length ? `${toTh(rows.length)} ไฟล์ · พร้อม ${toTh(rows.filter(r => r.state === 'ok').length)} · ควรดู ${toTh(rows.filter(r => r.state === 'warn').length)} · ไม่ได้ ${toTh(rows.filter(r => r.state === 'bad').length)}` : '';
      goEl.innerHTML = rows.length && !working ? `<button type="button" class="lb-btn primary" data-pdfimp ${picked.length && !busy ? '' : 'disabled'}>นำเข้า ${toTh(picked.length)} ฉบับที่เลือก</button> <span class="lb-msg" data-pdfmsg></span>` : '';
    };
    async function check(r) {
      r.state = 'check'; r.progress = ''; draw();
      let p;
      try { p = await api('/admin/preview', { method: 'POST', body: JSON.stringify({ title: r.title, text: r.text }) }); }
      catch (e) { r.state = 'bad'; r.notes = [esc(e.message)]; draw(); return; }
      const q = p.quality, notes = [];
      let state = 'ok';
      if (!q.mainSections) { state = 'bad'; notes.push('หามาตราไม่เจอ ไฟล์นี้อาจไม่ใช่ฉบับรวมของกฤษฎีกา'); }
      if (r.bad) { state = 'bad'; notes.push(`มีตัวอักษรที่แปลงไม่ได้ ${toTh(r.bad)} ตัว ส่งไฟล์นี้ให้ผู้พัฒนาตรวจ`); }
      if (q.gaps) { if (state === 'ok') state = 'warn'; notes.push(`เลขมาตราขาดช่วง ${toTh(q.gaps)} จุด (${esc(q.gapList.slice(0, 4).join(', '))})`); }
      if (p.existing?.mainSections && q.mainSections < p.existing.mainSections * 0.9) { if (state === 'ok') state = 'warn'; notes.push(`มาตราน้อยกว่าฉบับเดิมในคลังมาก (${toTh(q.mainSections)} จาก ${toTh(p.existing.mainSections)})`); }
      if (p.duplicateOf) { if (state === 'ok') state = 'warn'; notes.push('ข้อความตรงกับฉบับในคลังทุกตัวอักษร นำเข้าแล้วจะแค่เติมประวัติการแก้ไข'); }
      const am = p.latestAmendments.length ? p.latestAmendments[p.latestAmendments.length - 1].title : '';
      r.info = `${toTh(q.mainSections)} มาตรา (${esc(toTh(q.first || '-'))}–${esc(toTh(q.last || '-'))}) · ${p.existing ? 'ฉบับใหม่ของกฎหมายเดิม' : '<b>กฎหมายใหม่</b>'}${am ? ' · แก้ไขล่าสุด: ' + esc(toTh(am.slice(0, 90))) : ''}`;
      r.state = state; r.notes = notes; r.pick = state === 'ok'; r.existing = p.existing;
      draw();
    }
    async function convert(r) {
      r.state = 'conv'; draw();
      try {
        const { pdfjs, conv } = await loadPdf();
        const data = new Uint8Array(await r.file.arrayBuffer());
        const out = await conv.pdfToLawText(pdfjs, data, (i, n) => { r.progress = `หน้า ${toTh(i)}/${toTh(n)}`; if (i % 5 === 0 || i === n) draw(); });
        r.text = out.text; r.bad = out.badGlyphs;
        const m = matchLaw(out.title);
        r.title = m ? m.title : out.title;
      } catch (e) { r.state = 'bad'; r.progress = ''; r.notes = ['แปลง PDF ไม่สำเร็จ: ' + esc(e.message || e)]; draw(); return; }
      await check(r);
    }
    box.querySelector('[data-pdffile]').addEventListener('change', async e => {
      const files = [...e.target.files].filter(f => /\.pdf$/i.test(f.name) || f.type === 'application/pdf');
      e.target.value = '';
      if (!files.length || busy) return;
      const fresh = files.map(file => ({ file, state: 'wait', pick: false }));
      rows = rows.filter(r => r.state !== 'done').concat(fresh); draw();
      for (const r of fresh) { if (tok !== viewToken) return; await convert(r); }
    });
    rowsEl.addEventListener('change', e => {
      const row = e.target.closest('.lb-pdfrow'); if (!row) return;
      const r = rows[Number(row.dataset.i)];
      if (e.target.type === 'checkbox') { r.pick = e.target.checked; draw(); }
      else if (e.target.classList.contains('lb-pdft')) { r.title = e.target.value.trim(); if (r.title) check(r); }
    });
    goEl.addEventListener('click', async e => {
      if (!e.target.closest('[data-pdfimp]') || busy) return;
      const list = rows.filter(r => r.pick && ['ok', 'warn'].includes(r.state));
      if (!list.length) return;
      busy = true; list.forEach(r => { r.state = 'imp'; }); draw();
      const msg = () => goEl.querySelector('[data-pdfmsg]');
      const label = 'ฉบับรวมแก้ไข (ข้อมูล ณ ' + thDate(dateEl.value) + ')';
      const source = { name: 'สำนักงานคณะกรรมการกฤษฎีกา (ระบบค้นหากฎหมาย)', homepage: 'https://www.ocs.go.th/searchlaw', license: 'ไม่มีลิขสิทธิ์ตามมาตรา 7 พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537', note: 'แอดมินอัปโหลด PDF ฉบับรวมแก้ไข แปลงเป็นข้อความในเบราว์เซอร์' };
      // แบ่งเป็นชุด: ไม่เกิน 20 ฉบับ และไม่เกินราว 9 MB ต่อคำขอ
      const chunks = []; let cur = [], size = 0;
      for (const r of list) { const n = r.text.length * 3; if (cur.length && (cur.length >= 20 || size + n > 9e6)) { chunks.push(cur); cur = []; size = 0; } cur.push(r); size += n; }
      if (cur.length) chunks.push(cur);
      try {
        for (let c = 0; c < chunks.length; c++) {
          if (msg()) msg().textContent = `ชุดที่ ${toTh(c + 1)}/${toTh(chunks.length)} กำลังนำเข้า…`;
          const { jobId } = await api('/admin/upload', { method: 'POST', body: JSON.stringify({ source, laws: chunks[c].map(r => ({ title: r.existing ? r.existing.title : r.title, text: r.text, label })) }) });
          let j = {};
          for (;;) {
            await new Promise(res => setTimeout(res, 1500));
            j = await api('/admin/jobs/' + jobId).catch(() => j);
            if (msg() && j.total) msg().textContent = `ชุดที่ ${toTh(c + 1)}/${toTh(chunks.length)} · ${toTh(j.done)}/${toTh(j.total)} ฉบับ`;
            if (j.status === 'done' || j.status === 'failed') break;
          }
          chunks[c].forEach(r => { r.state = 'done'; r.pick = false; });
          if (j.log?.length) chunks[c][0].notes = (chunks[c][0].notes || []).concat(j.log.slice(-5).map(esc));
          draw();
        }
        busy = false; draw();
        if (msg()) { msg().className = 'lb-msg ok'; msg().textContent = 'นำเข้าเสร็จแล้ว · อย่าลืมยืนยันสถานะในตารางด้านล่าง'; }
        setTimeout(() => tok === viewToken && route(), 2500);
      } catch (err) {
        busy = false; list.filter(r => r.state === 'imp').forEach(r => { r.state = 'ok'; r.pick = true; }); draw();
        if (msg()) { msg().className = 'lb-msg err'; msg().textContent = err.message; }
      }
    });
  }

  // ---------- แอดมิน ----------
  async function viewAdmin(tok) {
    document.title = 'จัดการข้อมูล · คลังกฎหมาย';
    if (!me?.is_admin) { $main.innerHTML = `<div class="lb-band"><div><b>หน้านี้สำหรับแอดมิน</b><br>เข้าสู่ระบบด้วยบัญชีแอดมินที่ <a href="/">หน้าหลัก</a> แล้วกลับมาที่นี่</div></div>`; return; }
    $main.innerHTML = `<div class="lb-adm"><h1>จัดการข้อมูลคลังกฎหมาย</h1><p class="lb-count">ทุกฉบับที่นำเข้าเริ่มที่สถานะ "ยังไม่ยืนยัน" จนกว่าจะแนบหลักฐานและยืนยัน</p><div data-adm><span class="sk" style="height:120px"></span></div></div>`;
    let d;
    try { d = await api('/admin/overview'); } catch (e) { $main.querySelector('[data-adm]').innerHTML = errBox(e); return; }
    if (tok !== viewToken) return;
    const job = d.jobs[0];
    $main.querySelector('[data-adm]').innerHTML = `
      <section class="lb-box"><h2 style="margin:0 0 6px;font-size:16px">นำเข้าชุดแกน (${'กฎหมายเกี่ยวกับสัญญา ๓๓ ฉบับ'})</h2>
        <p>ข้อมูลจากเว็บไซต์สำนักงานคณะกรรมการกฤษฎีกา รวบรวมโดยโครงการ PyThaiNLP เมื่อ ๒๐ มิ.ย. ๒๕๖๔ (CC0) นำเข้าซ้ำได้ ระบบข้ามฉบับที่มีอยู่แล้ว</p>
        <button class="lb-btn primary" data-seed ${d.running ? 'disabled' : ''}>นำเข้าชุดแกน</button>
        <div data-job></div>
      </section>
      <section class="lb-box lb-upd" data-pdfbox>
        <h2>นำเข้าจาก PDF กฤษฎีกา <small>หลายไฟล์พร้อมกัน</small></h2>
        <ol class="lb-steps"><li>เปิดฉบับ "รวมแก้ไขล่าสุด" ในระบบค้นหากฎหมายของกฤษฎีกา แล้วสั่งพิมพ์/แชร์เป็น PDF</li><li>เลือกไฟล์ PDF ได้ครั้งละหลายไฟล์ ระบบแปลงในเครื่องนี้ แล้วตรวจให้ทีละไฟล์</li><li>ติ๊กเฉพาะแถวที่ต้องการ แล้วกดนำเข้า (แถวสีเขียวติ๊กไว้ให้แล้ว)</li></ol>
        <div class="lb-updform">
          <label>ข้อมูล ณ วันที่ (วันที่ดาวน์โหลดจากกฤษฎีกา) <input type="date" data-pdfdate></label>
          <div class="lb-updrow"><label class="lb-btn lb-file">เลือกไฟล์ PDF<input type="file" accept="application/pdf,.pdf" multiple hidden data-pdffile></label><span class="lb-count" data-pdfsum></span></div>
          <div class="lb-pdfrows" data-pdfrows></div>
          <div data-pdfgo></div>
        </div>
      </section>
      <section class="lb-box lb-upd" data-upd>
        <h2>อัปเดตตัวบทเป็นฉบับปัจจุบัน <small>ทีละฉบับ</small></h2>
        <ol class="lb-steps"><li>เปิดฉบับ "รวมแก้ไขล่าสุด" ของกฎหมายนั้นจากระบบค้นหากฎหมายของสำนักงานคณะกรรมการกฤษฎีกา</li><li>คัดลอกข้อความทั้งฉบับ (รวมเชิงอรรถท้ายเอกสาร) มาวางด้านล่าง หรือเลือกไฟล์ .txt</li><li>กด "ตรวจก่อนนำเข้า" ดูว่าระบบแบ่งมาตราถูก แล้วจึงนำเข้า</li></ol>
        <form class="lb-updform" data-updf>
          <label>กฎหมาย <select name="law"><option value="">— เลือกฉบับที่มีในคลัง —</option>${d.laws.map((l, i) => `<option value="${i}">${esc(l.title)}</option>`).join('')}<option value="new">+ กฎหมายใหม่ (พิมพ์ชื่อเอง)</option></select></label>
          <label data-newt hidden>ชื่อกฎหมาย (ตามราชกิจจานุเบกษา) <input name="title" maxlength="400" placeholder="เช่น พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541"></label>
          <label>ข้อมูล ณ วันที่ (วันที่คัดลอกจากแหล่ง) <input name="asOf" type="date" required></label>
          <label>ข้อความทั้งฉบับ <textarea name="text" rows="7" placeholder="วางข้อความฉบับรวมแก้ไขที่นี่"></textarea></label>
          <div class="lb-updrow"><label class="lb-btn lb-file">เลือกไฟล์ .txt<input type="file" accept=".txt,text/plain" hidden data-file></label><span class="lb-count" data-len></span></div>
          <p class="lb-src">แหล่งที่มา: สำนักงานคณะกรรมการกฤษฎีกา · ตัวบทกฎหมายไม่มีลิขสิทธิ์ตามมาตรา ๗ พ.ร.บ.ลิขสิทธิ์ พ.ศ. ๒๕๓๗ · <b>ห้ามคัดลอกจากเว็บเอกชนหรือหนังสือที่เรียบเรียงเอง</b></p>
          <div><button type="submit" class="lb-btn">ตรวจก่อนนำเข้า</button></div>
          <div data-pv></div>
        </form>
      </section>
      <section class="lb-box"><h2 style="margin:0 0 10px;font-size:16px">กฎหมายในคลัง (${toTh(d.laws.length)})</h2>
        <div class="lb-bulk" data-bulk>
          <div class="lb-bulk-top"><b data-bcount>เลือก ๐ ฉบับ</b>
            <button type="button" class="lb-btn" data-bpick>เลือกที่ยังไม่ยืนยัน (${toTh(d.laws.filter(needsVerify).length)})</button>
            <button type="button" class="lb-btn" data-bclear>ล้าง</button></div>
          <form class="lb-verify" data-bform hidden>
            <label>สถานะ <select name="status">${Object.entries(d.statuses).map(([k, v]) => `<option value="${k}"${k === 'in_force' ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
            <label>ลิงก์หลักฐาน (ใส่ให้อัตโนมัติ) <input name="evidenceUrl" type="url" value="${EVIDENCE_URL}"></label>
            <label><input type="checkbox" name="current" checked> ข้อความในคลังตรงกับฉบับปัจจุบันตามหลักฐาน</label>
            <p class="lb-count">บันทึกจะเขียนให้อัตโนมัติทีละฉบับ เช่น "ฉบับรวมกฤษฎีกา ณ ๒๒ พ.ย. ๒๕๖๙ · แก้ไขล่าสุด: …"</p>
            <div><button class="lb-btn primary" data-bgo>ยืนยันสถานะที่เลือก</button> <span class="lb-msg" data-bmsg></span></div>
          </form>
        </div>
        <div style="overflow:auto"><table class="lb-tbl"><thead><tr><th></th><th>ชื่อ</th><th>มาตรา</th><th>สถานะ</th><th></th></tr></thead><tbody data-laws></tbody></table></div>
      </section>`;
    const tbody = $main.querySelector('[data-laws]');
    tbody.innerHTML = d.laws.map((l, i) => {
      const q = l.quality || {};
      return `<tr data-i="${i}"><td class="lb-ckcell"><input type="checkbox" data-ck aria-label="เลือกฉบับนี้"></td><td><a href="/library/${esc(l.slug)}" data-nav data-t></a>${q.gaps ? `<div class="flag">เลขมาตราขาดช่วง ${toTh(q.gaps)}: ${esc((q.gapList || []).slice(0, 4).join(', '))}</div>` : ''}</td>
        <td>${toTh(q.mainSections ?? 0)}</td><td>${status(l.status, d.statuses[l.status])}${l.is_current_verified ? '<div class="lb-count">ฉบับปัจจุบัน ✓</div>' : ''}</td>
        <td><button class="lb-btn" data-open>ยืนยันสถานะ</button></td></tr>`;
    }).join('') || '<tr><td colspan="5" class="lb-empty">ยังไม่มีข้อมูล กด "นำเข้าชุดแกน"</td></tr>';
    tbody.querySelectorAll('[data-t]').forEach(a => { a.textContent = d.laws[Number(a.closest('tr').dataset.i)].title; });
    tbody.addEventListener('click', e => {
      const btn = e.target.closest('[data-open]'); if (!btn) return;
      const tr = btn.closest('tr'), l = d.laws[Number(tr.dataset.i)];
      if (tr.nextElementSibling?.classList.contains('lb-vrow')) { tr.nextElementSibling.remove(); return; }
      const row = document.createElement('tr'); row.className = 'lb-vrow';
      row.innerHTML = `<td colspan="5"><form class="lb-verify">
        <label>สถานะ <select name="status">${Object.entries(d.statuses).map(([k, v]) => `<option value="${k}"${k === l.status ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
        <label>ลิงก์หลักฐานจากแหล่งทางการ (ราชกิจจานุเบกษา / กฤษฎีกา) <input name="evidenceUrl" type="url" placeholder="https://" value="${esc(l.status_evidence_url || EVIDENCE_URL)}"></label>
        <label><input type="checkbox" name="current" ${l.is_current_verified || needsVerify(l) ? 'checked' : ''}> ข้อความฉบับนี้ตรงกับฉบับปัจจุบันตามหลักฐาน</label>
        <label>บันทึก (เขียนให้อัตโนมัติ แก้ได้) <input name="note" maxlength="500" value="${esc(l.status_note || autoNote(l))}"></label>
        <div><button class="lb-btn primary">บันทึกการยืนยัน</button> <span class="lb-msg" data-msg></span></div></form></td>`;
      tr.after(row);
      row.querySelector('form').addEventListener('submit', async ev => {
        ev.preventDefault(); const f = ev.target, msg = row.querySelector('[data-msg]');
        msg.className = 'lb-msg'; msg.textContent = 'กำลังบันทึก…';
        try {
          await api(`/admin/laws/${l.id}/verify`, { method: 'POST', body: JSON.stringify({ status: f.status.value, evidenceUrl: f.evidenceUrl.value.trim(), note: f.note.value, currentVersionId: f.current.checked ? l.version_id : 0 }) });
          msg.className = 'lb-msg ok'; msg.textContent = 'บันทึกแล้ว'; setTimeout(() => route(), 700);
        } catch (e2) { msg.className = 'lb-msg err'; msg.textContent = e2.message; }
      });
    });
    // ---- ยืนยันสถานะหลายฉบับ: ลิงก์หลักฐาน + บันทึกอัตโนมัติ ส่งทีละฉบับ ----
    const bulk = $main.querySelector('[data-bulk]'), bform = bulk.querySelector('[data-bform]');
    const picked = () => [...tbody.querySelectorAll('[data-ck]:checked')].map(c => d.laws[Number(c.closest('tr').dataset.i)]);
    const syncBulk = () => { const n = picked().length; bulk.querySelector('[data-bcount]').textContent = `เลือก ${toTh(n)} ฉบับ`; bform.hidden = !n; bform.querySelector('[data-bgo]').textContent = `ยืนยันสถานะ ${toTh(n)} ฉบับที่เลือก`; };
    tbody.addEventListener('change', e => { if (e.target.matches('[data-ck]')) syncBulk(); });
    bulk.querySelector('[data-bpick]').addEventListener('click', () => { tbody.querySelectorAll('tr[data-i]').forEach(tr => { const c = tr.querySelector('[data-ck]'); if (c) c.checked = needsVerify(d.laws[Number(tr.dataset.i)]); }); syncBulk(); });
    bulk.querySelector('[data-bclear]').addEventListener('click', () => { tbody.querySelectorAll('[data-ck]').forEach(c => { c.checked = false; }); syncBulk(); });
    bform.addEventListener('submit', async ev => {
      ev.preventDefault();
      const list = picked(), msg = bform.querySelector('[data-bmsg]'), btn = bform.querySelector('[data-bgo]');
      const ev2 = bform.evidenceUrl.value.trim(), st = bform.status.value, cur2 = bform.current.checked && st !== 'repealed' && st !== 'unverified';
      if (!list.length) return;
      btn.disabled = true; msg.className = 'lb-msg';
      let ok = 0; const fail = [];
      for (const l of list) {
        msg.textContent = `กำลังบันทึก ${toTh(ok + fail.length + 1)}/${toTh(list.length)}…`;
        try { await api(`/admin/laws/${l.id}/verify`, { method: 'POST', body: JSON.stringify({ status: st, evidenceUrl: ev2, note: autoNote(l), currentVersionId: cur2 ? l.version_id : 0 }) }); ok++; }
        catch (e2) { fail.push(`${l.title.slice(0, 40)}: ${e2.message}`); }
      }
      btn.disabled = false;
      msg.className = 'lb-msg ' + (fail.length ? 'err' : 'ok');
      msg.textContent = `บันทึกแล้ว ${toTh(ok)} ฉบับ` + (fail.length ? ` · ไม่สำเร็จ ${toTh(fail.length)}: ${fail.slice(0, 3).join(' / ')}` : '');
      if (!fail.length) setTimeout(() => tok === viewToken && route(), 900);
    });
    const jobEl = $main.querySelector('[data-job]');
    // ---- นำเข้าจาก PDF หลายไฟล์: แปลงในเบราว์เซอร์ (pdf.js) → ตรวจทีละไฟล์ (/admin/preview) → นำเข้าเป็นชุดละไม่เกิน 20 ฉบับ ----
    pdfBatch($main.querySelector('[data-pdfbox]'), d, tok);
    // ---- อัปเดตทีละฉบับ: ตรวจ (ไม่บันทึก) → นำเข้าเป็นฉบับใหม่ของกฎหมายเดิม ----
    const uf = $main.querySelector('[data-updf]'), pvEl = uf.querySelector('[data-pv]');
    uf.asOf.value = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
    const updTitle = () => uf.law.value === 'new' ? uf.title.value.trim() : (d.laws[Number(uf.law.value)]?.title || '');
    const showLen = () => { uf.querySelector('[data-len]').textContent = uf.text.value ? toTh(uf.text.value.length.toLocaleString()) + ' ตัวอักษร' : ''; pvEl.innerHTML = ''; };
    uf.law.addEventListener('change', () => { uf.querySelector('[data-newt]').hidden = uf.law.value !== 'new'; pvEl.innerHTML = ''; });
    uf.text.addEventListener('input', showLen);
    uf.querySelector('[data-file]').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; uf.text.value = await f.text(); showLen(); });
    uf.addEventListener('submit', async e => {
      e.preventDefault();
      const title = updTitle(), text = uf.text.value;
      if (!title) { pvEl.innerHTML = '<p class="lb-msg err">เลือกกฎหมายหรือพิมพ์ชื่อก่อน</p>'; return; }
      if (text.trim().length < 50) { pvEl.innerHTML = '<p class="lb-msg err">ยังไม่ได้วางข้อความกฎหมาย</p>'; return; }
      pvEl.innerHTML = '<p class="lb-count">กำลังตรวจ…</p>';
      let r; try { r = await api('/admin/preview', { method: 'POST', body: JSON.stringify({ title, text }) }); } catch (err) { pvEl.innerHTML = `<p class="lb-msg err">${esc(err.message)}</p>`; return; }
      const q = r.quality, warn = [];
      if (r.duplicateOf) warn.push('ข้อความนี้ตรงกับฉบับที่มีในคลังแล้วทุกตัวอักษร จะไม่สร้างฉบับใหม่ · กดปุ่มด้านล่างเพื่อเติมประวัติการแก้ไขที่ตัวอ่านรุ่นก่อนหาไม่เจอ');
      if (!q.mainSections) warn.push('ระบบหามาตราไม่เจอ ข้อความอาจไม่ครบหรือรูปแบบไม่ตรง');
      if (q.gaps) warn.push(`เลขมาตราขาดช่วง ${toTh(q.gaps)} จุด (${esc(q.gapList.slice(0, 4).join(', '))}) อาจคัดลอกมาไม่ครบ`);
      if (r.existing?.mainSections && q.mainSections < r.existing.mainSections * 0.9) warn.push(`มีมาตราน้อยกว่าฉบับเดิมมาก (${toTh(q.mainSections)} จาก ${toTh(r.existing.mainSections)})`);
      if (uf.law.value !== 'new' && !r.existing) warn.push('ชื่อในระบบไม่ตรงกับฉบับเดิม จะถูกสร้างเป็นกฎหมายใหม่');
      const ok = q.mainSections > 0;
      pvEl.innerHTML = `<div class="lb-pvcard">
        <div class="lb-pvt">${r.existing ? `ฉบับใหม่ของ <b></b>` : `กฎหมายใหม่ <b></b>`}</div>
        <dl><dt>มาตราในตัวบทหลัก</dt><dd>${toTh(q.mainSections)} มาตรา (${esc(toTh(q.first || '-'))} – ${esc(toTh(q.last || '-'))})</dd>
          ${r.existing?.mainSections ? `<dt>ฉบับเดิมในคลัง</dt><dd>${toTh(r.existing.mainSections)} มาตรา</dd>` : ''}
          <dt>เชิงอรรถ</dt><dd>${toTh(q.footnotes)}</dd>
          <dt>แก้ไขล่าสุดที่เอกสารอ้างถึง</dt><dd>${r.latestAmendments.length ? r.latestAmendments.slice().reverse().map(a => `<div>${esc(toTh(a.title))}</div>`).join('') : 'ไม่พบ'}</dd></dl>
        ${warn.length ? `<ul class="lb-warn">${warn.map(w => `<li>${w}</li>`).join('')}</ul>` : '<p class="lb-msg ok">แบ่งมาตราได้ครบ ไม่พบเลขขาดช่วง</p>'}
        <p class="lb-count">นำเข้าแล้วสถานะยังเป็น "ยังไม่ยืนยัน" จนกว่าจะกดยืนยันพร้อมหลักฐาน · ฉบับเก่ายังเก็บไว้ในประวัติ</p>
        ${ok ? `<button type="button" class="lb-btn primary" data-go>${r.duplicateOf ? 'เติมประวัติการแก้ไข' : 'นำเข้าฉบับนี้'}</button>` : ''}</div>`;
      pvEl.querySelector('.lb-pvt b').textContent = r.existing ? r.existing.title : r.title;
      pvEl.querySelector('[data-go]')?.addEventListener('click', async ev => {
        ev.target.disabled = true;
        const label = 'ฉบับรวมแก้ไข (ข้อมูล ณ ' + thDate(uf.asOf.value) + ')';
        try {
          const j = await api('/admin/upload', { method: 'POST', body: JSON.stringify({
            source: { name: 'สำนักงานคณะกรรมการกฤษฎีกา (ระบบค้นหากฎหมาย)', homepage: 'https://www.ocs.go.th/searchlaw', license: 'ไม่มีลิขสิทธิ์ตามมาตรา 7 พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537', note: 'แอดมินคัดลอกฉบับรวมแก้ไขทีละฉบับ' },
            laws: [{ title: r.existing ? r.existing.title : title, text, label }] }) });
          jobEl.scrollIntoView({ block: 'center' }); pvEl.innerHTML = '<p class="lb-msg ok">เริ่มนำเข้าแล้ว ดูความคืบหน้าที่กล่องด้านบน</p>'; poll(j.jobId);
        } catch (err) { ev.target.disabled = false; pvEl.insertAdjacentHTML('beforeend', `<p class="lb-msg err">${esc(err.message)}</p>`); }
      });
    });
    const showJob = j => {
      if (!j) return;
      const pct = j.total ? Math.round(j.done / j.total * 100) : 0;
      jobEl.innerHTML = `<div class="lb-prog"><i style="width:${pct}%"></i></div>
        <div class="lb-count">งาน #${toTh(j.id)} · ${{ queued: 'รอคิว', running: 'กำลังนำเข้า', done: 'เสร็จแล้ว', failed: 'ไม่สำเร็จ' }[j.status]} · ${toTh(j.done)}/${toTh(j.total)} ฉบับ · ใหม่ ${toTh(j.added)} · ฉบับใหม่ของกฎหมายเดิม ${toTh(j.new_version)} · ซ้ำ ${toTh(j.duplicates)} · ต้องตรวจ ${toTh(j.flagged)}</div>
        ${j.log?.length ? `<ul class="lb-log">${j.log.slice(-30).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`;
    };
    showJob(job);
    const poll = async id => {
      while (tok === viewToken) {
        const j = await api('/admin/jobs/' + id).catch(() => null); showJob(j);
        if (!j || j.status === 'done' || j.status === 'failed') { if (j?.status === 'done') setTimeout(() => tok === viewToken && route(), 900); return; }
        await new Promise(r => setTimeout(r, 1200));
      }
    };
    if (d.running && job) poll(job.id);
    $main.querySelector('[data-seed]').addEventListener('click', async e => {
      e.target.disabled = true;
      try { const r = await api('/admin/import', { method: 'POST', body: JSON.stringify({ source: 'seed' }) }); poll(r.jobId); }
      catch (err) { e.target.disabled = false; jobEl.innerHTML = `<p class="lb-msg err">${esc(err.message)}</p>`; }
    });
  }

  // ---------- เริ่ม ----------
  fetch('/api/me', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).catch(() => null).then(m => {
    me = m; if (me?.is_admin) document.querySelector('.lb-admin-link').hidden = false;
    route();
  });
})();
