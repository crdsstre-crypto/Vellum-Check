// Vellum คู่มือ (/guide) — คู่มือกฎหมายภาษาง่ายตามเรื่องในชีวิตจริง
// เนื้อหาเก็บเป็นไฟล์ JSON ใน server/library/guides/ (1 เรื่อง = 1 ไฟล์) · อ่านครั้งเดียวตอนเปิดเซิร์ฟเวอร์
// คู่มือที่ยังไม่ผ่านการตรวจ ("reviewed": false) แสดงเฉพาะแอดมิน คนทั่วไปมองไม่เห็น
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, 'guides');
export const GUIDE_PAGE = path.join(__dirname, '..', '..', 'public', 'guide.html');

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const arr = v => (Array.isArray(v) ? v : []);
const MOODS = ['wave', 'happy', 'sleep', 'party', 'sad', 'curious', 'stop', 'alert', 'inspect'];   // ท่าน้องม้วน (public/mascot.js)
// ท่าผสม "แขน+หน้า+ของถือ+การขยับ" (public/mascot.js) เช่น "point+smile+phone+bob"
const MOOD_PARTS = ['wave', 'point', 'up', 'thumb', 'cross', 'scratch', 'chin', 'cheer', 'cover', 'palm', 'open', 'bow',
  'smile', 'laugh', 'star', 'wink', 'hmm', 'think', 'shock', 'sad', 'cry', 'firm', 'relief', 'sleepy',
  'pen', 'mag', 'coin', 'phone', 'sign', 'umbrella', 'shield', 'cal', 'money', 'clip', 'cup', 'none',
  'sway', 'bob', 'hop', 'shake', 'spin', 'peek', 'lean', 'breathe'];
const okMood = m => typeof m === 'string' && (MOODS.includes(m) || (m.includes('+') && m.length <= 60 && m.split('+').every(t => MOOD_PARTS.includes(t))));
const PANEL_SCENES = ['pay', 'nopay', 'notice', 'labor', 'sign', 'repair', 'moveout', 'iou', 'rate', 'guarantee', 'hourglass', 'umbrella', 'hours', 'nothreat', 'complain', 'bankcall', 'mule', 'shared', 'tilt', 'cut', 'fence', 'sick', 'errand', 'vacation', 'holiday', 'workday', 'consent', 'rates', 'manager', 'payslip', 'trial', 'dismiss', 'day120', 'court', 'deductlist', 'pie', 'broken', 'vault', 'payday', 'orbit', 'hospital', 'nursery', 'jobcenter', 'retire', 'bridge', 'verdict', 'xray', 'donut', 'roadmap', 'lantern', 'grid120', 'jars', 'signs', 'guard', 'stroller', 'flapboard', 'stamp', 'receipt', 'certificate', 'crossroads', 'seesaw', 'barrier', 'balloon', 'chainlock', 'corkboard', 'cans', 'ledger', 'vesting', 'threeways', 'cloche', 'agegate', 'clock24', 'hazards', 'handoff', 'permit', 'permitcard', 'mailbox', 'sameenv', 'tenpct', 'drawer', 'founders', 'lanyards', 'talkline', 'megaphone', 'shield', 'puzzle', 'letter', 'twodoors', 'courtfree', 'claimlist', 'paintcal', 'popburst', 'neonshop', 'cutaway', 'sunsetglass', 'pixelstairs', 'splitretire', 'claydays', 'origami', 'retiremap', 'metroline', 'boardgame', 'sketchgraph', 'stainedladder', 'stickers', 'oneline', 'diary', 'glassphone', 'mosaic', 'constellation', 'venn', 'terminal', 'memphis', 'stitch', 'thermal', 'spotstage', 'neumorph', 'steelchain', 'lighthouse', 'redact', 'newspaper', 'forecast', 'queue', 'ledcount', 'safetynet', 'binder', 'kanban', 'mediaplayer', 'refcard', 'fridge', 'blueprint', 'smartwatch', 'woodcut', 'papercut', 'swissarrow'];   // ฉากช่องการ์ตูน (public/guide-comic.js)

// ภาพประกอบเฉพาะคำถาม (public/qa-art.js) · ลายเส้นประจำบ้านแบบเดียวกันทุกภาพ
const SPOTS = ['tenure', 'sameday', 'sickbed', 'vacationjar', 'otconsent', 'otrate', 'maternity', 'finalfine', 'latechat', 'brokenlaptop'];
const cleanArt = a => a && SPOTS.includes(a.spot) ? { spot: a.spot, mood: okMood(a.mood) ? a.mood : 'curious', side: a.side === 'right' ? 'right' : 'left', alt: str(a.alt, 160) } : null;

function cleanCite(c) {
  const law = str(c?.law, 200), sec = str(c?.sec, 30), label = str(c?.label, 120);
  if (law && sec) return { law, sec, easy: str(c.easy, 600) };
  if (label) return { label, note: str(c.note, 300) };   // อ้างอิงที่ยังไม่มีในคลัง (แสดงเป็นป้ายสีเทา)
  return null;
}

function cleanGuide(g, file) {
  const slug = str(g?.slug, 60);
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) throw new Error(`${file}: slug ต้องเป็น a-z 0-9 และ - เท่านั้น`);
  const title = str(g.title, 160);
  if (!title) throw new Error(`${file}: ไม่มี title`);
  const sections = arr(g.sections).map(s => ({
    title: str(s?.title, 120),
    // ช่องการ์ตูนต้นหัวข้อ (ไม่บังคับ) · scene ตามที่มีใน public/guide-comic.js · say ใส่ **คำ** เพื่อเน้น
    panel: s?.panel && PANEL_SCENES.includes(s.panel.scene) ? { scene: s.panel.scene, mood: okMood(s.panel.mood) ? s.panel.mood : 'happy', say: str(s.panel.say, 140),
      layout: ['left', 'right', 'center'].includes(s.panel.layout) ? s.panel.layout : 'left', bubble: ['talk', 'think', 'shout', 'caption'].includes(s.panel.bubble) ? s.panel.bubble : 'talk' } : null,
    // id = ที่อยู่หน้าคำถาม /guide/q/<id> (ไม่ใส่ จะได้ <slug>-<ลำดับ>) · art = ภาพประกอบเฉพาะข้อ
    items: arr(s?.items).map(it => ({ id: /^[a-z0-9-]{3,80}$/.test(str(it?.id, 80)) ? str(it.id, 80) : '', q: str(it?.q, 200), a: str(it?.a, 1200), cite: arr(it?.cite).map(cleanCite).filter(Boolean).slice(0, 4), art: cleanArt(it?.art) }))
      .filter(it => it.q && it.a),
  })).filter(s => s.title && s.items.length);
  if (!sections.length) throw new Error(`${file}: ไม่มีเนื้อหาใน sections`);
  const video = g.video && /^\/videos\/[A-Za-z0-9._\/-]+\.(mp4|webm)$/.test(str(g.video.url, 300))
    ? { url: str(g.video.url, 300), poster: /^\/videos\/[A-Za-z0-9._\/-]+\.(jpg|jpeg|png|webp)$/.test(str(g.video.poster, 300)) ? str(g.video.poster, 300) : '' }
    : null;
  return {
    slug, title,
    category: str(g.category, 60) || 'ทั่วไป',
    categoryIcon: str(g.categoryIcon, 8),          // อีโมจิหน้าหมวด เช่น 🏠
    categoryNote: str(g.categoryNote, 160),        // คำอธิบายใต้ชื่อหมวดในหน้ารวม
    scene: ['condo', 'office', 'money', 'debt', 'scam', 'contract', 'leave', 'overtime', 'probation', 'payroll', 'social', 'worksite', 'cradle', 'farewell', 'chalk', 'pvd', 'youth', 'border', 'union', 'court', 'wallet', 'porch', 'truck', 'bokeh', 'groovy', 'conveyor', 'shutter', 'chess', 'isoroom'].includes(g.scene) ? g.scene : 'condo',   // ฉากในรูปการ์ด
    mood: okMood(g.mood) ? g.mood : 'curious',   // ท่าน้องม้วน
    coverLayout: ['right', 'banner', 'polaroid', 'ticket', 'notebook', 'arch', 'phone', 'postage', 'torn', 'film', 'stack', 'pane', 'tape', 'hex', 'folder', 'ribbon', 'bubble', 'envelope', 'window'].includes(g.coverLayout) ? g.coverLayout : '',   // ปก: "right" = ภาพวงกลมอยู่ขวา · "banner" = ภาพกว้างเต็มบน
    cardText: str(g.cardText, 300),                // คำอธิบายบนการ์ด · ใส่ **คำ** เพื่อไฮไลต์
    coverLines: arr(g.coverLines).map(x => str(x, 60)).filter(Boolean).slice(0, 2),   // ข้อความบนปก (บรรทัดที่ 2 เป็นสีส้ม)
    order: Number.isFinite(g.order) ? g.order : 999,
    minutes: Number.isFinite(g.minutes) ? Math.max(1, Math.min(60, Math.round(g.minutes))) : null,
    updated: /^\d{4}-\d{2}-\d{2}$/.test(str(g.updated, 10)) ? str(g.updated, 10) : '',
    reviewed: g.reviewed === true,
    reviewer: str(g.reviewer, 120),
    intro: str(g.intro, 600),
    summary: arr(g.summary).map(x => str(x, 300)).filter(Boolean).slice(0, 6),
    sections,
    redFlags: arr(g.redFlags).map(f => ({ text: str(f?.text, 300), note: str(f?.note, 400) })).filter(f => f.text).slice(0, 8),
    cta: g.cta && str(g.cta.text, 200) ? { text: str(g.cta.text, 200), button: str(g.cta.button, 60) || 'ตรวจสัญญา', href: /^\/[A-Za-z0-9_\-\/?=&#.]*$/.test(str(g.cta.href, 200)) ? str(g.cta.href, 200) : '/' } : null,
    video,
  };
}

export function loadGuides() {
  const map = new Map();
  let files = [];
  try { files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')); }
  catch { console.warn('[guides] ไม่พบโฟลเดอร์ guides'); return map; }
  for (const f of files) {
    try {
      const g = cleanGuide(JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')), f);
      if (map.has(g.slug)) throw new Error(`${f}: slug "${g.slug}" ซ้ำกับไฟล์อื่น`);
      map.set(g.slug, g);
    } catch (e) { console.error('[guides] ข้ามไฟล์', f, '—', e.message); }
  }
  console.log(`[guides] โหลดคู่มือ ${map.size} เรื่อง`);
  return map;
}

// คลังคำถาม: แตกทุกข้อในทุกคู่มือเป็นหน้าของตัวเอง
function buildQA(guides) {
  const list = [], byId = new Map();
  for (const g of guides.values()) {
    let n = 0;
    g.sections.forEach((s, si) => s.items.forEach(it => {
      n++;
      if (!it.id) it.id = `${g.slug}-${n}`;
      if (byId.has(it.id)) { console.error('[qa] id ซ้ำ', it.id, '—', g.slug); it.id = `${g.slug}-${n}`; }
      const q = { id: it.id, q: it.q, a: it.a, cite: it.cite, art: it.art, n, sec: si + 1, secTitle: s.title, guide: g };
      list.push(q); byId.set(it.id, q);
    }));
  }
  console.log(`[qa] คำถาม ${list.length} ข้อ (มีภาพ ${list.filter(x => x.art).length})`);
  return { list, byId };
}
const shortA = a => { const t = a.replace(/\*\*/g, ''); return t.length > 150 ? t.slice(0, 148).replace(/\s+\S*$/, '') + '…' : t; };

export function mountGuides(app, { getUserFromRequest, isAdmin }) {
  const guides = loadGuides();
  const qa = buildQA(guides);
  const viewerIsAdmin = async req => { try { const u = await getUserFromRequest(req); return !!u && isAdmin(u); } catch { return false; } };
  const card = g => ({ slug: g.slug, title: g.title, category: g.category, categoryIcon: g.categoryIcon, categoryNote: g.categoryNote, scene: g.scene, mood: g.mood, cardText: g.cardText, minutes: g.minutes, updated: g.updated, reviewed: g.reviewed, intro: g.intro || g.summary[0] || '', hasVideo: !!g.video });

  app.get('/api/guides', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const admin = await viewerIsAdmin(req);
    const items = [...guides.values()].filter(g => admin || g.reviewed)
      .sort((a, b) => a.category.localeCompare(b.category, 'th') || a.order - b.order || a.title.localeCompare(b.title, 'th')).map(card);
    res.json({ items, isAdmin: admin });
  });

  app.get('/api/guides/:slug', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const g = guides.get(String(req.params.slug));
    const admin = await viewerIsAdmin(req);
    if (!g || (!g.reviewed && !admin)) return res.status(404).json({ error: 'ไม่พบคู่มือนี้' });
    res.json({ ...g, isAdmin: admin });
  });

  const qOrder = (a, b) => a.guide.category.localeCompare(b.guide.category, 'th') || a.guide.order - b.guide.order || a.n - b.n;
  const qCard = x => ({ id: x.id, q: x.q, short: shortA(x.a), art: x.art, category: x.guide.category, categoryIcon: x.guide.categoryIcon, guide: { slug: x.guide.slug, title: x.guide.title }, reviewed: x.guide.reviewed,
    cite: x.cite.filter(c => c.law).slice(0, 2).map(c => ({ law: c.law, sec: c.sec })) });

  app.get('/api/qa', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const admin = await viewerIsAdmin(req);
    const items = qa.list.filter(x => admin || x.guide.reviewed).sort(qOrder).map(qCard);
    res.json({ items, isAdmin: admin });
  });

  app.get('/api/qa/:id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const x = qa.byId.get(String(req.params.id));
    const admin = await viewerIsAdmin(req);
    if (!x || (!x.guide.reviewed && !admin)) return res.status(404).json({ error: 'ไม่พบคำถามนี้' });
    const same = qa.list.filter(y => y.guide === x.guide);
    const i = same.indexOf(x);
    const g = x.guide;
    res.json({
      id: x.id, q: x.q, a: x.a, cite: x.cite, art: x.art, secTitle: x.secTitle, n: x.n, total: same.length,
      guide: { slug: g.slug, title: g.title, category: g.category, categoryIcon: g.categoryIcon, reviewed: g.reviewed, reviewer: g.reviewer, updated: g.updated, scene: g.scene, mood: g.mood },
      prev: i > 0 ? { id: same[i - 1].id, q: same[i - 1].q } : null,
      next: i < same.length - 1 ? { id: same[i + 1].id, q: same[i + 1].q } : null,
      related: same.filter(y => y !== x && y.sec === x.sec).slice(0, 4).map(qCard),
      isAdmin: admin,
    });
  });

  const page = (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(GUIDE_PAGE); };
  app.get('/guide/q/:id', page);
  app.get('/guide', page);
  app.get('/guide/:slug', page);
}
