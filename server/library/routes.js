// Vellum Legal Library — เส้นทาง /api/lib/* และหน้า /library
// ต่อเข้ากับระบบเดิมผ่าน mountLibrary(app, { pool, getUserFromRequest, isAdmin }) เท่านั้น
// ถ้าสร้างตารางไม่สำเร็จ คลังกฎหมายตอบ 503 แต่ส่วนอื่นของเว็บทำงานปกติ
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initLibraryDb } from './db.js';
import { DOC_TYPES, thToArabic, titleInfo, sectionKey } from './parse.js';
import { mountGuides } from './guide-api.js';
import { tokenize } from './tokens.js';
import { TOPICS, startSeedImport, startUploadImport, cleanUpload, isRunning, previewOne } from './importer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.join(__dirname, '..', '..', 'public', 'library.html');
const STATUSES = { in_force: 'มีผลใช้บังคับ', not_yet_in_force: 'ยังไม่ถึงวันใช้บังคับ', repealed: 'ถูกยกเลิก', unverified: 'ยังไม่ยืนยันสถานะ' };

let state = { ready: false, error: null };
const isUrl = s => typeof s === 'string' && /^https?:\/\/[^\s]{3,500}$/.test(s);
const int = (v, d, min, max) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d; };

export async function initLibrary(pool) {
  for (let i = 1; i <= 3; i++) {
    try { await initLibraryDb(pool); state = { ready: true, error: null }; console.log('[library] พร้อมใช้งาน'); return; }
    catch (e) { state = { ready: false, error: e.message }; console.error(`[library] สร้างตารางไม่สำเร็จ (${i}/3):`, e.message); await new Promise(r => setTimeout(r, i * 5000)); }
  }
}

export function mountLibrary(app, { pool, getUserFromRequest, isAdmin }) {
  const r = express.Router();
  const send500 = (res, tag, err) => { console.error(`[library] ${tag}:`, err.message); res.status(500).json({ error: 'ระบบคลังกฎหมายมีปัญหา ลองใหม่อีกครั้ง' }); };
  r.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!state.ready) return res.status(503).json({ error: 'คลังกฎหมายกำลังเตรียมระบบ ลองใหม่ในอีกสักครู่' });
    next();
  });
  const admin = async (req, res, next) => {
    try {
      const user = await getUserFromRequest(req);
      if (!user) return res.status(401).json({ error: 'ยังไม่ได้เข้าสู่ระบบ' });
      if (!isAdmin(user)) return res.status(403).json({ error: 'บัญชีนี้ไม่มีสิทธิ์แอดมิน' });
      req.user = user; next();
    } catch (e) { send500(res, 'admin auth', e); }
  };

  const lawCard = row => ({
    slug: row.slug, title: row.title, docType: row.doc_type, docTypeLabel: DOC_TYPES[row.doc_type] || row.doc_type,
    yearBE: row.year_be, status: row.status, statusLabel: STATUSES[row.status], topics: row.topics,
    sections: row.sections != null ? Number(row.sections) : undefined, createdAt: row.created_at,
  });
  const CARD_SQL = `SELECT l.*, (SELECT count(*) FROM lib_sections s JOIN lib_versions v ON v.id = s.version_id
                     WHERE v.law_id = l.id AND s.kind = 'section' AND s.is_main AND v.id = (SELECT max(id) FROM lib_versions WHERE law_id = l.id)) AS sections
                    FROM lib_laws l`;

  // ---------- สาธารณะ (ไม่ต้องล็อกอิน) ----------
  r.get('/meta', (req, res) => res.json({ docTypes: DOC_TYPES, topics: TOPICS, statuses: STATUSES }));

  r.get('/home', async (req, res) => {
    try {
      const [latest, popular, types, topics, total] = await Promise.all([
        pool.query(`${CARD_SQL} ORDER BY l.created_at DESC, l.id DESC LIMIT 8`),
        pool.query(`${CARD_SQL} ORDER BY l.views_total DESC, l.id ASC LIMIT 8`),
        pool.query(`SELECT doc_type, count(*)::int AS n FROM lib_laws GROUP BY doc_type ORDER BY n DESC`),
        pool.query(`SELECT t AS topic, count(*)::int AS n FROM lib_laws, unnest(topics) t GROUP BY t ORDER BY n DESC`),
        pool.query(`SELECT count(*)::int AS laws, count(*) FILTER (WHERE status <> 'unverified')::int AS verified FROM lib_laws`),
      ]);
      res.json({
        total: total.rows[0], latest: latest.rows.map(lawCard), popular: popular.rows.map(lawCard),
        docTypes: types.rows.map(x => ({ key: x.doc_type, label: DOC_TYPES[x.doc_type] || x.doc_type, n: x.n })),
        topics: topics.rows.filter(x => TOPICS[x.topic]).map(x => ({ key: x.topic, label: TOPICS[x.topic], n: x.n })),
      });
    } catch (e) { send500(res, 'home', e); }
  });

  // มาตราสุ่มจากคลัง (ข้อความจริงจากฐานข้อมูล พร้อมชื่อกฎหมาย) — ใช้บนหน้าแรก
  r.get('/spotlight', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT l.slug, l.title, l.status, s.number, s.number_key, s.body FROM lib_sections s
           JOIN lib_versions v ON v.id = s.version_id JOIN lib_laws l ON l.id = v.law_id
          WHERE s.kind = 'section' AND s.is_main AND length(s.body) BETWEEN 120 AND 520 AND s.body NOT LIKE '%ยกเลิก%'
            AND l.topics && ARRAY['contract','consumer','property','labor','digital']::text[]
            AND v.id = (SELECT max(id) FROM lib_versions WHERE law_id = l.id)
          ORDER BY random() LIMIT 1`
      );
      if (!rows[0]) return res.json(null);
      const x = rows[0];
      res.json({ slug: x.slug, title: x.title, status: x.status, statusLabel: STATUSES[x.status], number: x.number, key: x.number_key, body: x.body.replace(/\[[๐-๙0-9]+\]/g, '') });
    } catch (e) { send500(res, 'spotlight', e); }
  });

  // ค้นในเนื้อหามาตรา (เฉพาะฉบับล่าสุดของแต่ละกฎหมาย) · "มาตรา 420" = หามาตราเลขนี้ในทุกฉบับ · อย่างอื่น = ค้นคำในเนื้อหา
  // คืนข้อความมาตราจริงจากฐานข้อมูลเป็นตัวอย่างสั้น ๆ (ตัดตรงคำที่ค้น) พร้อมสถานะของกฎหมาย
  r.get('/search', async (req, res) => {
    try {
      const q = String(req.query.q || '').trim().slice(0, 100);
      if (q.length < 2) return res.json({ q, mode: 'text', items: [] });
      const LATEST = 'v.id = (SELECT max(id) FROM lib_versions WHERE law_id = l.id)';
      const BASE = `SELECT l.slug, l.title, l.status, s.ord, s.number, s.number_key, s.body FROM lib_sections s
                      JOIN lib_versions v ON v.id = s.version_id JOIN lib_laws l ON l.id = v.law_id
                     WHERE s.kind = 'section' AND s.is_main AND ${LATEST}`;
      const sec = thToArabic(q).replace(/\s+/g, ' ').match(/^(?:มาตรา|ม\.)\s*(\d{1,4})(?:\s*\/\s*(\d{1,3}))?(?:\s*(ทวิ|ตรี|จัตวา|เบญจ|ฉ|สัตต|อัฏฐ|นว|ทศ))?$/);
      let rows, mode, words = [];
      if (sec) {
        mode = 'section';
        const key = sec[1] + (sec[2] ? '/' + sec[2] : '') + (sec[3] ? ' ' + sec[3] : '');
        ({ rows } = await pool.query(`${BASE} AND s.number_key = $1 ORDER BY l.views_total DESC, l.id LIMIT 40`, [key]));
      } else {
        mode = 'text';
        words = tokenize(q).split(' ').map(w => w.replace(/[^\p{L}\p{N}\p{M}]+/gu, '')).filter(w => w.length > 0).slice(0, 8);
        if (!words.length) return res.json({ q, mode, items: [] });
        ({ rows } = await pool.query(
          `${BASE} AND s.search_tokens @@ to_tsquery('simple', $1) ORDER BY (strpos(s.body, $2) > 0) DESC, l.views_total DESC, l.id, s.ord LIMIT 60`,
          [words.join(' & '), q.replace(/\s+/g, '')]));
      }
      const items = rows.map(x => {
        const body = x.body.replace(/\[[๐-๙0-9]+\]/g, '');
        const plain = thToArabic(body).toLowerCase();
        let at = plain.indexOf(thToArabic(q).toLowerCase().replace(/\s+/g, '')); if (at < 0) for (const w of words) { at = plain.indexOf(w); if (at >= 0) break; }
        const from = Math.max(0, at - 70), excerpt = (from > 0 ? '…' : '') + body.slice(from, from + 240) + (from + 240 < body.length ? '…' : '');
        return { slug: x.slug, title: x.title, status: x.status, statusLabel: STATUSES[x.status], number: x.number, key: x.number_key, ord: x.ord, excerpt };
      });
      res.json({ q, mode, words, items });
    } catch (e) { send500(res, 'search', e); }
  });

  // รายการกฎหมาย (กรองตามประเภท/หมวด/สถานะ/ชื่อ) — การค้นหาเนื้อหาเต็มรูปแบบอยู่ใน Phase 2
  r.get('/laws', async (req, res) => {
    try {
      const where = [], args = [];
      const add = (sql, v) => { args.push(v); where.push(sql.replace('?', `$${args.length}`)); };
      if (DOC_TYPES[req.query.type]) add('l.doc_type = ?', req.query.type);
      if (TOPICS[req.query.topic]) add('? = ANY(l.topics)', req.query.topic);
      if (STATUSES[req.query.status]) add('l.status = ?', req.query.status);
      const q = String(req.query.q || '').trim().slice(0, 100);
      if (q) add("l.title_norm ILIKE '%' || ? || '%'", q.replace(/[%_\\]/g, m => '\\' + m).toLowerCase());
      const page = int(req.query.page, 1, 1, 500), size = 24;
      const sort = req.query.sort === 'year' ? 'l.year_be DESC NULLS LAST, l.id' : req.query.sort === 'title' ? 'l.title_norm' : 'l.created_at DESC, l.id DESC';
      const w = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const [list, count] = await Promise.all([
        pool.query(`${CARD_SQL} ${w} ORDER BY ${sort} LIMIT ${size} OFFSET ${(page - 1) * size}`, args),
        pool.query(`SELECT count(*)::int AS n FROM lib_laws l ${w}`, args),
      ]);
      res.json({ total: count.rows[0].n, page, pageSize: size, items: list.rows.map(lawCard) });
    } catch (e) { send500(res, 'laws', e); }
  });

  async function loadLaw(slug) {
    if (typeof slug !== 'string' || !/^[a-z_]+-[0-9x]+-[0-9a-f]{8}$/.test(slug)) return null;
    const { rows } = await pool.query('SELECT * FROM lib_laws WHERE slug = $1', [slug]);
    return rows[0] || null;
  }

  r.get('/laws/:slug', async (req, res) => {
    try {
      const law = await loadLaw(req.params.slug);
      if (!law) return res.status(404).json({ error: 'ไม่พบกฎหมายนี้' });
      const [versions, events] = await Promise.all([
        pool.query(`SELECT v.id, v.label, v.promulgated_on, v.effective_on, v.gazette_ref, v.source_url, v.source_ref, v.is_current_verified,
                           v.verified_at, v.imported_at, v.quality, v.blocks,
                           s.name AS source_name, s.homepage AS source_homepage, s.license AS source_license, s.license_note, s.collected_at,
                           (SELECT count(*)::int FROM lib_sections x WHERE x.version_id = v.id AND x.kind = 'section' AND x.is_main) AS sections
                      FROM lib_versions v JOIN lib_sources s ON s.id = v.source_id WHERE v.law_id = $1 ORDER BY v.imported_at DESC, v.id DESC`, [law.id]),
        pool.query(`SELECT kind, title, event_date, gazette_ref, evidence, verified FROM lib_events WHERE law_id = $1 ORDER BY event_date NULLS LAST, id`, [law.id]),
      ]);
      res.json({
        ...lawCard(law), statusEvidence: law.status_evidence_url, statusNote: law.status_note, statusVerifiedAt: law.status_verified_at,
        versions: versions.rows.map(v => ({
          id: v.id, label: v.label, promulgatedOn: v.promulgated_on, effectiveOn: v.effective_on, gazette: v.gazette_ref,
          sourceUrl: v.source_url, sourceRef: v.source_ref, isCurrent: v.is_current_verified, verifiedAt: v.verified_at, importedAt: v.imported_at,
          sections: v.sections, quality: v.quality,
          annexes: (v.blocks || []).filter(b => !b.main).map(b => ({ id: b.id, title: b.title, count: b.count })),
          source: { name: v.source_name, homepage: v.source_homepage, license: v.source_license, note: v.license_note, collectedAt: v.collected_at },
        })),
        events: events.rows.map(e => ({ kind: e.kind, title: e.title, date: e.event_date, gazette: e.gazette_ref, evidence: e.evidence, verified: e.verified })),
      });
    } catch (e) { send500(res, 'law', e); }
  });

  // เนื้อหา (แบ่งหน้าตามลำดับ) · ?v=รุ่น (ไม่ใส่ = รุ่นล่าสุด) · &from=ord · &annex=1 รวมบทบัญญัติท้าย
  r.get('/laws/:slug/text', async (req, res) => {
    try {
      const law = await loadLaw(req.params.slug);
      if (!law) return res.status(404).json({ error: 'ไม่พบกฎหมายนี้' });
      const vq = await pool.query(
        `SELECT id, preamble, footnotes FROM lib_versions WHERE law_id = $1 AND ($2::int IS NULL OR id = $2::int) ORDER BY imported_at DESC, id DESC LIMIT 1`,
        [law.id, req.query.v ? int(req.query.v, null, 1, 2 ** 31 - 1) : null]
      );
      const ver = vq.rows[0];
      if (!ver) return res.status(404).json({ error: 'ไม่พบเนื้อหาฉบับนี้' });
      const from = int(req.query.from, 0, 0, 1e6), limit = int(req.query.limit, 150, 1, 400);
      const annex = req.query.annex === 'only' ? 'AND NOT is_main' : req.query.annex === '1' ? '' : 'AND is_main';
      const { rows } = await pool.query(
        `SELECT id, ord, kind, block, is_main, level, number, number_key, heading, body, notes FROM lib_sections
          WHERE version_id = $1 AND ord > $2 ${annex} ORDER BY ord LIMIT $3`,
        [ver.id, from, limit + 1]
      );
      const more = rows.length > limit; if (more) rows.pop();
      const fn = {};
      const TH = '๐๑๒๓๔๕๖๗๘๙';
      for (const u of rows) {
        const marks = [...String(u.body).matchAll(/\[([๐-๙0-9]+)\]/g)].map(m => m[1].replace(/[๐-๙]/g, d => TH.indexOf(d)));
        for (const n of [...u.notes, ...marks]) if (ver.footnotes[n]) fn[n] = ver.footnotes[n];
      }
      res.json({
        versionId: ver.id, preamble: from === 0 && req.query.annex !== 'only' ? ver.preamble : undefined, footnotes: fn, more, next: rows.length ? rows[rows.length - 1].ord : from,
        units: rows.map(u => ({ id: u.id, ord: u.ord, kind: u.kind, main: u.is_main, block: u.block, level: u.level, number: u.number, key: u.number_key, heading: u.heading, body: u.body, notes: u.notes })),
      });
    } catch (e) { send500(res, 'text', e); }
  });

  // สารบัญ: หัวข้อทั้งหมด + ตำแหน่งของทุกมาตรา (ใช้กระโดดไปมาตราที่ยังไม่ได้โหลด)
  r.get('/laws/:slug/toc', async (req, res) => {
    try {
      const law = await loadLaw(req.params.slug);
      if (!law) return res.status(404).json({ error: 'ไม่พบกฎหมายนี้' });
      const v = await pool.query(`SELECT id FROM lib_versions WHERE law_id = $1 AND ($2::int IS NULL OR id = $2::int) ORDER BY imported_at DESC, id DESC LIMIT 1`,
        [law.id, req.query.v ? int(req.query.v, null, 1, 2 ** 31 - 1) : null]);
      if (!v.rows[0]) return res.status(404).json({ error: 'ไม่พบเนื้อหาฉบับนี้' });
      const { rows } = await pool.query(
        `SELECT ord, kind, level, heading, number_key, is_main FROM lib_sections WHERE version_id = $1 ORDER BY ord`, [v.rows[0].id]);
      res.json({
        versionId: v.rows[0].id,
        heads: rows.filter(x => x.kind === 'heading' && x.is_main).map(x => ({ ord: x.ord, level: x.level, heading: x.heading })),
        keys: rows.filter(x => x.kind === 'section' && x.is_main).map(x => [x.number_key, x.ord]),
        lastMain: rows.filter(x => x.is_main).reduce((m, x) => Math.max(m, x.ord), 0),
        annexFrom: rows.find(x => !x.is_main)?.ord || null,
      });
    } catch (e) { send500(res, 'toc', e); }
  });

  // ตัวบทมาตราเดียว สำหรับหน้าคู่มือ: ?law=<ชื่อกฎหมาย>&sec=<เลขมาตรา> → รุ่นล่าสุดในคลัง
  r.get('/cite', async (req, res) => {
    try {
      const lawName = String(req.query.law || '').slice(0, 200).trim(), sec = String(req.query.sec || '').slice(0, 30).trim();
      const m = /^(?:มาตรา\s*)?([0-9๐-๙]+(?:\/[0-9๐-๙]+)?)\s*([ก-๙]*)$/.exec(sec);
      if (!lawName || !m) return res.status(400).json({ error: 'ข้อมูลอ้างอิงไม่ครบ' });
      const info = titleInfo(lawName);
      // ตรงชื่อเต็มก่อน ถ้าไม่เจอ ลองหาแบบไม่สนปี พ.ศ. (เผื่อตอนนำเข้าตั้งชื่อสั้น/ยาวต่างกัน)
      const base = info.titleNorm.replace(/\s*พ\.ศ\.\s*\d{4}.*$/, '').replace(/^(พระราชบัญญัติ|พ\.ร\.บ\.)\s*/, '').trim();
      const like = '%' + base.replace(/[\\%_]/g, m => '\\' + m) + '%';
      const l = await pool.query(
        `SELECT id, slug, title, status FROM lib_laws WHERE title_norm = $1 OR ($2 <> '' AND title_norm LIKE $3)
          ORDER BY (title_norm = $1) DESC, length(title_norm), id LIMIT 1`, [info.titleNorm, base.length >= 6 ? base : '', like]);
      const law = l.rows[0];
      if (!law) return res.status(404).json({ error: 'ยังไม่มีกฎหมายนี้ในคลัง' });
      const key = sectionKey(m[1], m[2] || '');
      const q = await pool.query(
        `SELECT s.number, s.body, s.number_key, v.is_current_verified FROM lib_sections s JOIN lib_versions v ON v.id = s.version_id
          WHERE v.id = (SELECT id FROM lib_versions WHERE law_id = $1 ORDER BY imported_at DESC, id DESC LIMIT 1)
            AND s.kind = 'section' AND s.is_main AND s.number_key = $2 ORDER BY s.ord LIMIT 1`, [law.id, key]);
      const s = q.rows[0];
      if (!s) return res.status(404).json({ error: 'ไม่พบมาตรานี้ในคลัง' });
      res.json({
        slug: law.slug, title: law.title, status: law.status, statusLabel: STATUSES[law.status], isCurrent: !!s.is_current_verified,
        number: s.number, key: s.number_key, body: String(s.body).replace(/\[[๐-๙0-9]+\]/g, ''),
      });
    } catch (e) { send500(res, 'cite', e); }
  });

  // นับการเปิดอ่าน (กันกดรัว: IP เดิม + กฎหมายเดิม นับครั้งเดียวต่อ 6 ชั่วโมง)
  const seen = new Map();
  r.post('/laws/:slug/view', async (req, res) => {
    try {
      const key = `${req.ip}|${req.params.slug}`, now = Date.now();
      if (seen.size > 20000) seen.clear();
      if (seen.has(key) && now - seen.get(key) < 6 * 3600e3) return res.json({ ok: true });
      seen.set(key, now);
      await pool.query('UPDATE lib_laws SET views_total = views_total + 1 WHERE slug = $1', [String(req.params.slug).slice(0, 60)]);
      res.json({ ok: true });
    } catch (e) { send500(res, 'view', e); }
  });

  // ---------- แอดมิน ----------
  r.get('/admin/overview', admin, async (req, res) => {
    try {
      const [laws, jobs, sources] = await Promise.all([
        pool.query(`SELECT l.id, l.slug, l.title, l.doc_type, l.year_be, l.status, l.status_evidence_url, l.status_note, l.topics,
                           v.id AS version_id, v.quality, v.is_current_verified, v.gazette_ref, v.label AS version_label,
                           ev.title AS latest_amend, ev.event_date AS latest_amend_date
                      FROM lib_laws l LEFT JOIN LATERAL (SELECT * FROM lib_versions WHERE law_id = l.id ORDER BY imported_at DESC, id DESC LIMIT 1) v ON true
                      LEFT JOIN LATERAL (SELECT title, event_date FROM lib_events WHERE law_id = l.id AND kind = 'amended' ORDER BY event_date DESC NULLS LAST, id DESC LIMIT 1) ev ON true
                     ORDER BY l.id`),
        pool.query(`SELECT * FROM lib_import_jobs ORDER BY id DESC LIMIT 10`),
        pool.query(`SELECT * FROM lib_sources ORDER BY id`),
      ]);
      res.json({ running: isRunning(), laws: laws.rows, jobs: jobs.rows, sources: sources.rows, topics: TOPICS, statuses: STATUSES });
    } catch (e) { send500(res, 'admin overview', e); }
  });

  r.post('/admin/import', admin, async (req, res) => {
    try {
      if (req.body?.source !== 'seed') return res.status(400).json({ error: 'ไม่รู้จักแหล่งข้อมูลนี้' });
      res.json({ jobId: await startSeedImport(pool, req.user.id) });
    } catch (e) { if (e.status) return res.status(e.status).json({ error: e.message }); send500(res, 'import', e); }
  });

  r.post('/admin/upload', admin, async (req, res) => {
    try {
      const c = cleanUpload(req.body);
      if (c.error) return res.status(400).json({ error: c.error });
      res.json({ jobId: await startUploadImport(pool, req.user.id, c) });
    } catch (e) { if (e.status) return res.status(e.status).json({ error: e.message }); send500(res, 'upload', e); }
  });

  r.post('/admin/preview', admin, async (req, res) => {
    try { res.json(await previewOne(pool, { title: req.body?.title, text: req.body?.text })); }
    catch (e) { if (e.status) return res.status(e.status).json({ error: e.message }); send500(res, 'preview', e); }
  });

  r.get('/admin/jobs/:id', admin, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM lib_import_jobs WHERE id = $1', [int(req.params.id, 0, 0, 2 ** 31 - 1)]);
      if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
      res.json(rows[0]);
    } catch (e) { send500(res, 'job', e); }
  });

  // ยืนยันสถานะ: ต้องแนบหลักฐาน (ลิงก์ราชกิจจาฯ หรือหน้าทางการ) · ยืนยันฉบับปัจจุบันได้ทีละฉบับ
  r.post('/admin/laws/:id/verify', admin, async (req, res) => {
    const client = await pool.connect();
    try {
      const id = int(req.params.id, 0, 0, 2 ** 31 - 1);
      const status = String(req.body?.status || '');
      const evidence = req.body?.evidenceUrl ? String(req.body.evidenceUrl).trim() : '';
      const note = String(req.body?.note || '').trim().slice(0, 500) || null;
      const versionId = req.body?.currentVersionId != null ? int(req.body.currentVersionId, 0, 0, 2 ** 31 - 1) : null;
      if (!STATUSES[status]) return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
      if (status !== 'unverified' && !isUrl(evidence)) return res.status(400).json({ error: 'ต้องแนบลิงก์หลักฐานจากแหล่งทางการก่อนยืนยันสถานะ' });
      if (versionId && !isUrl(evidence)) return res.status(400).json({ error: 'ต้องแนบลิงก์หลักฐานก่อนยืนยันฉบับปัจจุบัน' });
      await client.query('BEGIN');
      const up = await client.query(
        `UPDATE lib_laws SET status = $2, status_evidence_url = $3, status_note = $4,
                status_verified_by = CASE WHEN $2 = 'unverified' THEN NULL ELSE $5::int END,
                status_verified_at = CASE WHEN $2 = 'unverified' THEN NULL ELSE now() END, updated_at = now()
          WHERE id = $1 RETURNING id`,
        [id, status, status === 'unverified' ? null : evidence, note, req.user.id]
      );
      if (!up.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'ไม่พบกฎหมายนี้' }); }
      if (versionId !== null) {
        await client.query('UPDATE lib_versions SET is_current_verified = false, verified_by = NULL, verified_at = NULL WHERE law_id = $1', [id]);
        if (versionId > 0) {
          const v = await client.query('UPDATE lib_versions SET is_current_verified = true, verified_by = $3, verified_at = now() WHERE id = $2 AND law_id = $1 RETURNING id', [id, versionId, req.user.id]);
          if (!v.rows[0]) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'ฉบับที่เลือกไม่ใช่ของกฎหมายนี้' }); }
        }
      }
      // ยกเลิกสถานะ → ไม่มีฉบับปัจจุบันอีกต่อไป
      if (status === 'repealed' || status === 'unverified') await client.query('UPDATE lib_versions SET is_current_verified = false WHERE law_id = $1', [id]);
      await client.query('COMMIT');
      console.log(`[library] verify law ${id} → ${status} by user ${req.user.id}`);
      res.json({ ok: true });
    } catch (e) { await client.query('ROLLBACK').catch(() => {}); send500(res, 'verify', e); }
    finally { client.release(); }
  });

  r.post('/admin/laws/:id/topics', admin, async (req, res) => {
    try {
      const topics = (Array.isArray(req.body?.topics) ? req.body.topics : []).filter(t => TOPICS[t]).slice(0, 5);
      const { rowCount } = await pool.query('UPDATE lib_laws SET topics = $2, updated_at = now() WHERE id = $1', [int(req.params.id, 0, 0, 2 ** 31 - 1), topics]);
      if (!rowCount) return res.status(404).json({ error: 'ไม่พบกฎหมายนี้' });
      res.json({ ok: true, topics });
    } catch (e) { send500(res, 'topics', e); }
  });

  app.use('/api/lib', r);

  // หน้าเว็บ: /library และลิงก์แชร์ /library/<slug>
  const page = (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(PAGE); };
  app.get('/library', page);
  app.get('/library/admin', page);
  app.get('/library/:slug', page);

  // คู่มือ (/guide, /api/guides) — เนื้อหาเป็นไฟล์ JSON ไม่ใช้ฐานข้อมูล จึงไม่ติด 503 ของคลัง
  mountGuides(app, { getUserFromRequest, isAdmin });
}
