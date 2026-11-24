// Vellum คู่มือ (/guide) — คู่มือกฎหมายภาษาง่ายตามเรื่องในชีวิตจริง
// เนื้อหาเก็บเป็นไฟล์ JSON ใน server/library/guides/ (1 เรื่อง = 1 ไฟล์) · ตอนเปิดเซิร์ฟเวอร์ทำสารบัญ เนื้อหาเต็มอ่านทีละเรื่องตอนมีคนเปิด
// คู่มือที่ยังไม่ผ่านการตรวจ ("reviewed": false) แสดงเฉพาะแอดมิน คนทั่วไปมองไม่เห็น
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { mountComic } from './comic-split.js';
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
const PANEL_SCENES = ['pay', 'hwkitchen', 'hwledger', 'hwsplit', 'hwcourt', 'pwcounter', 'pwsafe', 'pwnotice', 'pwshop', 'wtphone', 'wtinbox', 'wtspent', 'wtbank', 'dpclock', 'dpstack', 'dpsign', 'dpcourt', 'hpdealer', 'hproad', 'hplot', 'hpdesk', 'gtsign', 'gtdemand', 'gtfree', 'gtrecover', 'mgbank', 'mgletter', 'mgauction', 'mgfamily', 'srdeed', 'srcalendar', 'srcash', 'srtrap', 'sxform', 'sxdeny', 'sxcourt', 'sxprep', 'ccroad', 'cchospital', 'ccbed', 'cclaw', 'olcalc', 'olscan', 'oldesk', 'olarchive', 'lblocker', 'lbparking', 'lbcoworker', 'lbreport', 'gvhall', 'gvguard', 'gvss', 'gvcheck', 'dcmirror', 'dcuniform', 'dcgender', 'dcdesk', 'shclock', 'shcalendar', 'shrota', 'shmeeting', 'nwkiosk', 'nwproof', 'nwfamily', 'nwshutter', 'rpdesk', 'rpchart', 'rpdiploma', 'rpbusstop', 'btstation', 'btcarwindow', 'btsite', 'btrainroad', 'vlkitchen', 'vlclinic', 'vlledger', 'vlhall', 'ceinbox', 'cequit', 'ceconsent', 'ceevidence', 'rfphone', 'rfcert', 'rfpost', 'rfstation', 'rtbox', 'rtpay', 'rtdorm', 'rtbus', 'mtletter', 'mtcamp', 'mtclass', 'mtdesk', 'sjnight', 'sjpantry', 'sjslips', 'sjrain', 'nopay', 'notice', 'labor', 'sign', 'repair', 'moveout', 'iou', 'rate', 'guarantee', 'hourglass', 'umbrella', 'hours', 'nothreat', 'complain', 'bankcall', 'mule', 'shared', 'tilt', 'cut', 'fence', 'sick', 'errand', 'vacation', 'holiday', 'workday', 'consent', 'rates', 'manager', 'payslip', 'trial', 'dismiss', 'day120', 'court', 'deductlist', 'pie', 'broken', 'vault', 'payday', 'orbit', 'hospital', 'nursery', 'jobcenter', 'retire', 'bridge', 'verdict', 'xray', 'donut', 'roadmap', 'lantern', 'grid120', 'jars', 'signs', 'guard', 'stroller', 'flapboard', 'stamp', 'receipt', 'certificate', 'crossroads', 'seesaw', 'barrier', 'balloon', 'chainlock', 'corkboard', 'cans', 'ledger', 'vesting', 'threeways', 'cloche', 'agegate', 'clock24', 'hazards', 'handoff', 'permit', 'permitcard', 'mailbox', 'sameenv', 'tenpct', 'drawer', 'founders', 'lanyards', 'talkline', 'megaphone', 'shield', 'puzzle', 'letter', 'twodoors', 'courtfree', 'claimlist', 'paintcal', 'popburst', 'neonshop', 'cutaway', 'sunsetglass', 'pixelstairs', 'splitretire', 'claydays', 'origami', 'retiremap', 'metroline', 'boardgame', 'sketchgraph', 'stainedladder', 'stickers', 'oneline', 'diary', 'glassphone', 'mosaic', 'constellation', 'venn', 'terminal', 'memphis', 'stitch', 'thermal', 'spotstage', 'neumorph', 'steelchain', 'lighthouse', 'redact', 'newspaper', 'forecast', 'queue', 'ledcount', 'safetynet', 'binder', 'kanban', 'mediaplayer', 'refcard', 'fridge', 'blueprint', 'smartwatch', 'woodcut', 'papercut', 'swissarrow', 'abacus', 'dashboard', 'skilltree', 'riso', 'lowpoly', 'seal', 'tearpad', 'lifebuoy', 'blocks', 'copier', 'popbook', 'vapor', 'slot', 'rocket', 'traffic', 'lofi', 'shadowplay', 'artdeco', 'isosite', 'cards', 'noir', 'vhs', 'watercolor', 'paperplane', 'baton', 'toytrain', 'treerings', 'aquarium', 'atomic', 'candyjar', 'scissors', 'pinata', 'roundtable', 'megachorus', 'magnifier', 'monitorwall', 'fingerprint', 'keyring', 'envelopeseal', 'scooterbump', 'stencilloop', 'crayondesk', 'mobilebalance', 'safetycard', 'punchclock', 'azulejo', 'anaglyph', 'lacquergold', 'diorama', 'vinylbanner', 'stringart', 'skeuo', 'heatcam', 'rubberhose', 'pinball', 'letterpress', 'clothesline', 'basrelief', 'sumie', 'batik', 'lanternglow', 'passbook', 'pressedflower', 'chiaroscuro', 'bedpov', 'savingjars', 'meetingroom', 'rainumbrella', 'docfolder', 'designerdesk', 'cafehandover', 'gallerywall', 'inventorbench', 'contractmorning', 'canteenboard', 'twostreams', 'farewellstation', 'kitchenform', 'inspectordesk', 'bankapp', 'payslipdesk', 'hourglassdesk', 'coinscale', 'advanceenvelope', 'breakroomvote', 'ballotbox', 'meetingtable', 'umbrellaguard', 'noticeboardteam', 'cashdrawer', 'twopaths', 'deductnote', 'policedesk', 'evidencebox', 'idcardtray', 'atmlocker', 'resignwalk', 'dormgate', 'returnrequest', 'wagestack', 'salesboard', 'allowancejars', 'calcdesk', 'payslipzoom', 'offerinbox', 'canceledstamp', 'daycounter', 'twowaydoor', 'offerfolder', 'summonsmail', 'courtcorridor', 'mediationtable', 'emptychair', 'helpdesk', 'bossorder', 'illegalorder', 'overtimeclock', 'clipboardstack', 'speakupnotes', 'phonefamily', 'finaljudgment', 'probationcard', 'termletter', 'returnwork', 'shopshutter', 'keyhandover', 'closedsign', 'estatebox', 'deadlinecal', 'ssbooklet', 'sspayslip', 'sssafe', 'sswarning', 'ssappcheck'];   // ฉากช่องการ์ตูน (public/guide-comic.js)

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
    items: arr(s?.items).map(it => ({ q: str(it?.q, 200), a: str(it?.a, 1200), cite: arr(it?.cite).map(cleanCite).filter(Boolean).slice(0, 4) }))
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
    scene: ['condo', 'ringledger', 'goldscale', 'paperboatcoin', 'hourglassnote', 'carkeyfob', 'cosignpen', 'houseabacus', 'landdeed', 'appealtray', 'helmetroad', 'punchclockflat', 'lockerkeys', 'stampedfolder', 'hangerrail', 'rosterboard', 'bamboomat', 'resumedesk', 'suitcasemap', 'medkitflat', 'linenchat', 'terrazzocall', 'returnkeys', 'camofold', 'twolanyards', 'office', 'money', 'debt', 'scam', 'contract', 'leave', 'overtime', 'probation', 'payroll', 'social', 'worksite', 'cradle', 'farewell', 'chalk', 'pvd', 'youth', 'border', 'union', 'court', 'wallet', 'porch', 'truck', 'bokeh', 'groovy', 'conveyor', 'shutter', 'chess', 'isoroom', 'foodcart', 'typewriter', 'fireworks', 'nightshift', 'crumple', 'merger', 'giftbox', 'cctv', 'scooter', 'timecard', 'vinyl', 'gouache', 'pastel', 'teaportrait', 'designerportrait', 'fundjar', 'phoneportrait', 'committeeportrait', 'accusedportrait', 'docflatlay', 'paypieces', 'offerplane', 'summonsdoormat', 'ordersticky', 'absencenote', 'storefrontkey', 'stampbook'].includes(g.scene) ? g.scene : 'condo',   // ฉากในรูปการ์ด
    mood: okMood(g.mood) ? g.mood : 'curious',   // ท่าน้องม้วน
    coverLayout: ['right', 'knotframe', 'velvetbox', 'returnarrow', 'tornticket', 'plateframe', 'signline', 'creased', 'deedseal', 'calendarpage', 'roadsign', 'calcbody', 'lockertag', 'docket', 'dressform', 'flipclock', 'napkin', 'scorecard', 'luggagetag', 'stitched', 'corkpin', 'redacted', 'clipboard', 'dogtag', 'badge', 'banner', 'polaroid', 'ticket', 'notebook', 'arch', 'phone', 'postage', 'torn', 'film', 'stack', 'pane', 'tape', 'hex', 'folder', 'ribbon', 'bubble', 'envelope', 'window', 'coin', 'diploma', 'tag', 'hazard', 'mirror', 'split', 'gift', 'lens', 'bandage', 'punch', 'rollup', 'carbon', 'bloom', 'wristband', 'artboard', 'savingsbook', 'banknote', 'ballot', 'evidence', 'flatlay', 'receiptroll', 'ticketstub', 'airmail', 'bubbleframe', 'hangtag', 'postcard', 'perforated'].includes(g.coverLayout) ? g.coverLayout : '',   // ปก: "right" = ภาพวงกลมอยู่ขวา · "banner" = ภาพกว้างเต็มบน
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

// ---------- สารบัญ + อ่านไฟล์ทีละเรื่อง ----------
// รองรับคู่มือหลักหมื่นเรื่อง: ตอนเปิดเซิร์ฟเวอร์อ่านทุกไฟล์ครั้งเดียวเพื่อตรวจและทำ "สารบัญ" (ข้อมูลการ์ด + คำค้น)
// แล้วทิ้งเนื้อหาเต็มไป · เนื้อหาเต็มอ่านจากไฟล์เฉพาะตอนมีคนเปิด และจำไว้ล่าสุด CACHE_MAX เรื่อง
// (ถ้าวันหนึ่งย้ายไป Postgres แก้แค่ buildIndex/readGuide หน้าเว็บไม่ต้องแก้)
const CACHE_MAX = 200;
const plain = t => String(t || '').replace(/\*\*/g, '').toLowerCase();
const cardOf = g => ({ slug: g.slug, title: g.title, category: g.category, categoryIcon: g.categoryIcon, categoryNote: g.categoryNote, scene: g.scene, mood: g.mood, cardText: g.cardText, minutes: g.minutes, updated: g.updated, reviewed: g.reviewed, intro: g.intro || g.summary[0] || '', hasVideo: !!g.video });

export function buildIndex() {
  const list = [];
  const seen = new Set();
  let files = [];
  try { files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')); }
  catch { console.warn('[guides] ไม่พบโฟลเดอร์ guides'); }
  for (const f of files) {
    try {
      const g = cleanGuide(JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')), f);
      if (seen.has(g.slug)) throw new Error(`${f}: slug "${g.slug}" ซ้ำกับไฟล์อื่น`);
      seen.add(g.slug);
      // คำค้น: ชื่อเรื่อง ข้อความการ์ด บทนำ สรุป หัวข้อตอน และคำถามทุกข้อ
      const words = [g.title, g.cardText, g.intro, ...g.summary, ...g.sections.flatMap(s => [s.title, ...(s.items || []).map(i => i.q)])];
      list.push({ card: cardOf(g), order: g.order, file: f, find: plain(words.join(' ')).slice(0, 2000) });   // จำกัดขนาดคำค้นต่อเรื่อง กันหน่วยความจำบวมเมื่อมีหลายหมื่นเรื่อง
    } catch (e) { console.error('[guides] ข้ามไฟล์', f, '—', e.message); }
  }
  // ในแต่ละหมวด เรื่องใหม่ (order มาก) ขึ้นก่อน
  list.sort((a, b) => a.card.category.localeCompare(b.card.category, 'th') || b.order - a.order || a.card.title.localeCompare(b.card.title, 'th'));
  const bySlug = new Map(list.map(x => [x.card.slug, x]));
  console.log(`[guides] สารบัญคู่มือ ${list.length} เรื่อง`);
  return { list, bySlug };
}

const cache = new Map();   // slug → เนื้อหาเต็ม (จำล่าสุด CACHE_MAX เรื่อง)
export function readGuide(index, slug) {
  const x = index.bySlug.get(slug);
  if (!x) return null;
  if (cache.has(slug)) { const g = cache.get(slug); cache.delete(slug); cache.set(slug, g); return g; }
  let g;
  try { g = cleanGuide(JSON.parse(fs.readFileSync(path.join(DIR, x.file), 'utf8')), x.file); }
  catch (e) { console.error('[guides] อ่านไม่ได้', x.file, '—', e.message); return null; }
  if (g.slug !== slug) return null;
  cache.set(slug, g);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  return g;
}

// ค้นหา/แบ่งหน้า: ?q=คำค้น&cat=หมวด&offset=0&limit=24
// ตอบ { cats:[{name,icon,note,count,offset,items}], total, all:[{name,icon,count}] }
//   cats = หมวดที่มีผลลัพธ์ (ถ้าระบุ cat จะมีหมวดเดียว) · items = การ์ดช่วง offset..offset+limit ของหมวดนั้น
//   all = ทุกหมวดพร้อมจำนวนทั้งหมด (ไม่สนคำค้น) ใช้ทำปุ่มเลือกหมวด
export function searchGuides(index, { q = '', cat = '', offset = 0, limit = 24, admin = false } = {}) {
  const terms = plain(q).split(/\s+/).filter(Boolean).slice(0, 8);
  const groups = new Map(), all = new Map();
  for (const x of index.list) {
    const c = x.card;
    if (!admin && !c.reviewed) continue;
    if (!all.has(c.category)) all.set(c.category, { name: c.category, icon: '', count: 0 });
    const A = all.get(c.category); A.count++; if (!A.icon && c.categoryIcon) A.icon = c.categoryIcon;
    if (cat && c.category !== cat) continue;
    if (terms.length && !terms.every(t => x.find.includes(t))) continue;
    if (!groups.has(c.category)) groups.set(c.category, { name: c.category, icon: '', note: '', count: 0, offset, items: [] });
    const G = groups.get(c.category);
    if (!G.icon && c.categoryIcon) G.icon = c.categoryIcon;
    if (!G.note && c.categoryNote) G.note = c.categoryNote;
    if (G.count >= offset && G.items.length < limit) G.items.push(c);
    G.count++;
  }
  const cats = [...groups.values()];
  return { cats, total: cats.reduce((n, G) => n + G.count, 0), all: [...all.values()] };
}

// ส่ง JSON แบบบีบอัด (brotli/gzip) — ไฟล์ js/css บีบโดย fastStatic อยู่แล้ว แต่ข้อมูลคู่มือจาก API ยังส่งเต็มขนาด
// คู่มือหนึ่งเรื่อง ~26KB → ~4–5KB · ใช้ zlib ของ Node ไม่ต้องลงแพ็กเกจ · บีบไม่สำเร็จจะส่งแบบเดิม
function sendJson(req, res, obj, status = 200) {
  const raw = Buffer.from(JSON.stringify(obj));
  const ae = String(req.headers['accept-encoding'] || '');
  const enc = raw.length < 1024 ? null : /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
  let body = raw;
  if (enc) {
    try { body = enc === 'br' ? zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.gzipSync(raw, { level: 6 }); }
    catch { body = raw; }
  }
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'Accept-Encoding');
  if (body !== raw) res.setHeader('Content-Encoding', enc);
  res.setHeader('Content-Length', body.length);
  res.end(body);
}

export function mountGuides(app, { getUserFromRequest, isAdmin }) {
  const index = buildIndex();
  const viewerIsAdmin = async req => { try { const u = await getUserFromRequest(req); return !!u && isAdmin(u); } catch { return false; } };
  const int = (v, d, lo, hi) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };

  app.get('/api/guides', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const admin = await viewerIsAdmin(req);
    const qs = req.query || {};
    const out = searchGuides(index, {
      q: str(qs.q, 80), cat: str(qs.cat, 80),
      offset: int(qs.offset, 0, 0, 1e7), limit: int(qs.limit, 24, 1, 60), admin,
    });
    sendJson(req, res, { ...out, isAdmin: admin });
  });

  app.get('/api/guides/:slug', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const g = readGuide(index, String(req.params.slug));
    const admin = await viewerIsAdmin(req);
    if (!g || (!g.reviewed && !admin)) return sendJson(req, res, { error: 'ไม่พบคู่มือนี้' }, 404);
    sendJson(req, res, { ...g, isAdmin: admin });
  });

  mountComic(app, path.dirname(GUIDE_PAGE));   // ภาพการ์ตูนแยกรายฉาก (/guide-comic-core.js, /guide-comic-scenes.js)

  const page = (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(GUIDE_PAGE); };
  app.get('/guide', page);
  app.get('/guide/:slug', page);
}
