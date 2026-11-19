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
  let me = null, meta = null, viewToken = 0;

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
    document.querySelectorAll('.lb-topnav a').forEach(a => a.removeAttribute('aria-current'));
    const sel = { home: '.lb-topnav a[href="/library"]', browse: '.lb-topnav a[href="/library?browse=1"]', admin: '.lb-admin-link' }[which];
    if (sel) document.querySelector(sel)?.setAttribute('aria-current', 'page');
  }

  function route() {
    const u = new URL(location.href), parts = u.pathname.replace(/\/+$/, '').split('/');
    const tok = ++viewToken;
    window.scrollTo(0, 0);
    if (parts[2] === 'admin') { markNav('admin'); return viewAdmin(tok); }
    if (parts[2]) { markNav(''); return viewLaw(tok, decodeURIComponent(parts[2]), u.hash.slice(1)); }
    if (u.searchParams.has('browse') || u.searchParams.has('q') || u.searchParams.has('type') || u.searchParams.has('topic')) { markNav('browse'); return viewBrowse(tok, u.searchParams); }
    markNav('home'); return viewHome(tok);
  }

  // ---------- หน้าแรก ----------
  async function viewHome(tok) {
    document.title = 'คลังกฎหมาย · Vellum Legal Library';
    $main.innerHTML = `
      <section class="lb-hero">
        <div>
          <h1>อ่านกฎหมายไทยทีละมาตรา<br>พร้อมที่มาของทุกฉบับ</h1>
          <p class="lb-lede">ค้นจากชื่อกฎหมาย แล้วเปิดอ่านฉบับเต็มที่แบ่งตามมาตรา ทุกฉบับบอกแหล่งข้อมูล วันที่รวบรวม และสถานะการตรวจสอบ</p>
          <form class="lb-search" role="search" data-search>
            <label for="q" class="lb-skip">ค้นหากฎหมาย</label>
            <input id="q" name="q" type="search" placeholder="ชื่อกฎหมาย เช่น คุ้มครองผู้บริโภค" autocomplete="off" maxlength="100">
            <button type="submit">ค้นหา</button>
          </form>
          <div class="lb-quick" data-types><span class="sk" style="height:26px;width:260px"></span></div>
        </div>
        <figure class="lb-spot" data-spot aria-live="polite"><span class="sk" style="height:16px;width:80%"></span><span class="sk" style="height:16px;width:90%;margin-top:12px"></span><span class="sk" style="height:16px;width:60%;margin-top:12px"></span></figure>
      </section>
      <div data-note></div>
      <section class="lb-sec"><h2>หมวดหมู่</h2><div class="lb-topics" data-topics></div></section>
      <div class="lb-cols">
        <section class="lb-sec"><h2>เพิ่มเข้าคลังล่าสุด</h2><ul class="lb-list" data-latest>${skRows(5)}</ul></section>
        <section class="lb-sec"><h2>เปิดอ่านมากที่สุด</h2><ul class="lb-list" data-popular>${skRows(5)}</ul></section>
      </div>`;
    $main.querySelector('[data-search]').addEventListener('submit', e => {
      e.preventDefault(); const q = e.target.q.value.trim(); go('/library?browse=1' + (q ? '&q=' + encodeURIComponent(q) : ''));
    });
    spotlight(tok);
    try {
      const d = await api('/home');
      if (tok !== viewToken) return;
      const q = sel => $main.querySelector(sel);
      q('[data-types]').innerHTML = d.docTypes.map(t => `<a class="lb-chip" href="/library?type=${esc(t.key)}" data-nav>${esc(t.label)}<span class="n">${toTh(t.n)}</span></a>`).join('');
      q('[data-topics]').innerHTML = d.topics.length ? d.topics.map(t => `<a class="lb-topic" href="/library?topic=${esc(t.key)}" data-nav><b>${esc(t.label)}</b><span>${toTh(t.n)}</span></a>`).join('') : '<p class="lb-empty">ยังไม่มีหมวดหมู่</p>';
      q('[data-latest]').innerHTML = d.latest.length ? d.latest.map(lawRow).join('') : '<li class="lb-empty">คลังยังว่าง แอดมินนำเข้าข้อมูลได้ที่หน้า "จัดการข้อมูล"</li>';
      q('[data-popular]').innerHTML = d.popular.some(l => l) ? d.popular.map(lawRow).join('') : '<li class="lb-empty">ยังไม่มีข้อมูลการเปิดอ่าน</li>';
      if (d.total.laws) {
        q('[data-note]').innerHTML = `<div class="lb-band" style="margin-bottom:36px"><div><b>คลังมี ${toTh(d.total.laws)} ฉบับ · ยืนยันสถานะแล้ว ${toTh(d.total.verified)} ฉบับ</b><br>
          ฉบับที่ยังไม่ยืนยัน อาจไม่รวมการแก้ไขหลังวันที่รวบรวมข้อมูล ดูวันที่รวบรวมได้ในหน้าของแต่ละฉบับ และควรตรวจกับราชกิจจานุเบกษาก่อนใช้อ้างอิง</div></div>`;
      }
    } catch (e) { if (tok === viewToken) $main.querySelector('[data-latest]').innerHTML = `<li>${errBox(e)}</li>`; }
  }

  async function spotlight(tok) {
    const box = $main.querySelector('[data-spot]');
    try {
      const s = await api('/spotlight');
      if (tok !== viewToken || !box) return;
      if (!s) { box.innerHTML = '<p class="lb-empty">เมื่อมีกฎหมายในคลัง มาตราจากคลังจะแสดงที่นี่</p>'; return; }
      const num = s.number.replace(/^มาตรา\s*/, '');
      box.innerHTML = `<div class="lb-spot-k"><small>มาตรา</small>${esc(num)}</div>
        <blockquote cite="/library/${esc(s.slug)}#${esc(keyId(s.key))}"></blockquote>
        <footer><a href="/library/${esc(s.slug)}#${esc(keyId(s.key))}" data-nav></a><button class="lb-again" type="button">มาตราอื่น</button></footer>`;
      box.querySelector('blockquote').textContent = s.body;
      box.querySelector('footer a').textContent = s.title;
      box.querySelector('.lb-again').addEventListener('click', () => spotlight(tok));
    } catch { if (box) box.innerHTML = '<p class="lb-empty">โหลดมาตราไม่สำเร็จ</p>'; }
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
      <div class="lb-reader">
        <nav class="lb-toc" aria-label="สารบัญ"><h2>สารบัญ</h2><ol data-toc></ol></nav>
        <article class="lb-text" data-text><span class="sk" style="height:16px;width:90%"></span></article>
        <aside class="lb-aside" data-aside></aside>
      </div>`;
    $main.querySelector('.lb-law-h h1').textContent = law.title;
    renderAside(law, v);
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
    tocEl.addEventListener('click', async e => {
      const a = e.target.closest('a[data-ord]'); if (!a) return;
      e.preventDefault(); const ord = Number(a.dataset.ord);
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
      <section class="lb-box"><h2>ลำดับเหตุการณ์จากเชิงอรรถต้นฉบับ</h2>
        ${ev.length ? `<ol class="lb-tl">${ev.map((e, i) => `<li class="${esc(e.kind)}"><time>${thDate(e.date)}</time><span data-ev="${i}"></span></li>`).join('')}</ol>
          <p style="margin-top:6px;font-size:13px">ดึงจากเชิงอรรถในข้อมูลต้นฉบับ ยังไม่ได้ตรวจยืนยัน</p>` : '<p>ยังไม่มีข้อมูล</p>'}
      </section>`;
    el.querySelector('[data-src]').textContent = src.name || '—';
    el.querySelector('[data-lic]').textContent = src.license || '—';
    if (v?.gazette) el.querySelector('[data-gaz]').textContent = v.gazette;
    el.querySelectorAll('[data-ev]').forEach(s => { const e = ev[Number(s.dataset.ev)]; s.textContent = e.title + (e.gazette ? ' · ' + e.gazette : ''); });
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
      <section class="lb-box"><h2 style="margin:0 0 10px;font-size:16px">กฎหมายในคลัง (${toTh(d.laws.length)})</h2>
        <div style="overflow:auto"><table class="lb-tbl"><thead><tr><th>ชื่อ</th><th>มาตรา</th><th>สถานะ</th><th></th></tr></thead><tbody data-laws></tbody></table></div>
      </section>`;
    const tbody = $main.querySelector('[data-laws]');
    tbody.innerHTML = d.laws.map((l, i) => {
      const q = l.quality || {};
      return `<tr data-i="${i}"><td><a href="/library/${esc(l.slug)}" data-nav data-t></a>${q.gaps ? `<div class="flag">เลขมาตราขาดช่วง ${toTh(q.gaps)}: ${esc((q.gapList || []).slice(0, 4).join(', '))}</div>` : ''}</td>
        <td>${toTh(q.mainSections ?? 0)}</td><td>${status(l.status, d.statuses[l.status])}${l.is_current_verified ? '<div class="lb-count">ฉบับปัจจุบัน ✓</div>' : ''}</td>
        <td><button class="lb-btn" data-open>ยืนยันสถานะ</button></td></tr>`;
    }).join('') || '<tr><td colspan="4" class="lb-empty">ยังไม่มีข้อมูล กด "นำเข้าชุดแกน"</td></tr>';
    tbody.querySelectorAll('[data-t]').forEach(a => { a.textContent = d.laws[Number(a.closest('tr').dataset.i)].title; });
    tbody.addEventListener('click', e => {
      const btn = e.target.closest('[data-open]'); if (!btn) return;
      const tr = btn.closest('tr'), l = d.laws[Number(tr.dataset.i)];
      if (tr.nextElementSibling?.classList.contains('lb-vrow')) { tr.nextElementSibling.remove(); return; }
      const row = document.createElement('tr'); row.className = 'lb-vrow';
      row.innerHTML = `<td colspan="4"><form class="lb-verify">
        <label>สถานะ <select name="status">${Object.entries(d.statuses).map(([k, v]) => `<option value="${k}"${k === l.status ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
        <label>ลิงก์หลักฐานจากแหล่งทางการ (ราชกิจจานุเบกษา / กฤษฎีกา) <input name="evidenceUrl" type="url" placeholder="https://" value="${esc(l.status_evidence_url || '')}"></label>
        <label><input type="checkbox" name="current" ${l.is_current_verified ? 'checked' : ''}> ข้อความฉบับนี้ตรงกับฉบับปัจจุบันตามหลักฐาน</label>
        <label>บันทึก (ไม่บังคับ) <input name="note" maxlength="500"></label>
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
    const jobEl = $main.querySelector('[data-job]');
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
