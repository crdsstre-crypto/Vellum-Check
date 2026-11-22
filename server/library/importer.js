// นำเข้ากฎหมาย: ดึง → แยกมาตรา → กันซ้ำ → บันทึกเป็น "ยังไม่ยืนยัน" เสมอ
// งานรันเบื้องหลังในเซิร์ฟเวอร์ (ไม่บล็อกคำขออื่น) และบันทึกความคืบหน้าในตาราง lib_import_jobs
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseLaw, titleInfo, normalizeText, thToArabic } from './parse.js';
import { tokenize } from './tokens.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ชุดแกน: อ่านไฟล์ .json (ข้อความธรรมดา) ก่อน ถ้าไม่มีจึงใช้ .json.gz (ไฟล์บีบอัด) — วางไว้ไฟล์ใดไฟล์หนึ่งก็พอ
const SEED_JSON = path.join(__dirname, 'seed', 'krisdika-core-2021.json');
export const SEED_FILE = path.join(__dirname, 'seed', 'krisdika-core-2021.json.gz');
async function readSeed() {
  try { return JSON.parse(await readFile(SEED_JSON, 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw new Error('ไฟล์ชุดแกน (.json) เสียหาย: ' + e.message); }
  try { return JSON.parse(gunzipSync(await readFile(SEED_FILE)).toString('utf8')); }
  catch (e) { throw new Error(e.code === 'ENOENT' ? 'ไม่พบไฟล์ชุดแกนใน server/library/seed/' : 'ไฟล์ชุดแกน (.gz) เสียหาย: ' + e.message); }
}

export const TOPICS = {
  contract: 'สัญญาและหนี้', consumer: 'คุ้มครองผู้บริโภค', labor: 'แรงงาน', property: 'ที่ดินและอสังหาริมทรัพย์',
  ip: 'ทรัพย์สินทางปัญญา', court: 'ศาลและวิธีพิจารณาความ', finance: 'การเงินและประกันภัย', business: 'ธุรกิจและการค้า',
  digital: 'ดิจิทัลและธุรกรรมออนไลน์', public: 'รัฐธรรมนูญและกฎหมายอาญา', tax: 'ภาษี',
};
// หมวดหมู่เริ่มต้นของชุดแกน (เป็นการจัดหมวดเพื่อค้นง่าย ไม่ใช่เนื้อหากฎหมาย · แอดมินแก้ได้)
const SEED_TOPICS = {
  567410: ['contract', 'property', 'business'], 570093: ['court'], 302495: ['consumer'], 683582: ['consumer', 'court'],
  642571: ['labor'], 304513: ['labor'], 300760: ['labor'], 561757: ['labor', 'court'], 573031: ['property'],
  395094: ['property'], 570844: ['property'], 308574: ['property', 'contract'], 302148: ['property', 'contract'],
  726463: ['property', 'consumer'], 564433: ['property'], 766238: ['contract', 'finance'], 570721: ['digital', 'contract'],
  686804: ['ip'], 302661: ['ip'], 308383: ['ip'], 588154: ['finance', 'court'], 580579: ['finance', 'court'],
  325398: ['court', 'contract'], 834090: ['court'], 780886: ['business'], 571251: ['finance'], 722980: ['finance'],
  777570: ['contract', 'business'], 829030: ['tax', 'property'], 510490: ['business'], 857329: ['digital'],
  774606: ['public'], 443287: ['public'],
};

const sha = s => createHash('sha256').update(s).digest('hex');
const isUrl = s => typeof s === 'string' && /^https?:\/\/[^\s]{3,500}$/.test(s);

export async function ensureSource(pool, s) {
  const { rows } = await pool.query(
    `INSERT INTO lib_sources (code, name, homepage, license, license_note, collected_at)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, homepage = EXCLUDED.homepage,
       license = EXCLUDED.license, license_note = EXCLUDED.license_note, collected_at = EXCLUDED.collected_at
     RETURNING id`,
    [s.code, s.name, s.homepage || null, s.license, s.note || null, s.collectedAt || null]
  );
  return rows[0].id;
}

// บันทึกกฎหมาย 1 ฉบับ (transaction เดียว) → 'added' | 'new_version' | 'duplicate'
export async function importOne(pool, item, sourceId) {
  const info = titleInfo(item.title);
  if (!info.title || info.title.length > 400) throw new Error('ชื่อกฎหมายไม่ถูกต้อง');
  const text = normalizeText(item.text || '');
  if (text.replace(/\s/g, '').length < 50) throw new Error('เนื้อหาสั้นเกินไป');
  const hash = sha(text.replace(/\s+/g, ' ').trim());

  const dup = await pool.query('SELECT v.id, l.slug FROM lib_versions v JOIN lib_laws l ON l.id = v.law_id WHERE v.content_hash = $1', [hash]);
  if (dup.rows[0]) return { result: 'duplicate', slug: dup.rows[0].slug };

  const p = parseLaw(text);
  const flagged = p.quality.mainSections === 0 || p.quality.gaps > 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '120s'");
    let lawId, slug, result = 'added';
    const found = await client.query(
      'SELECT id, slug FROM lib_laws WHERE doc_type = $1 AND title_norm = $2 AND COALESCE(year_be,0) = COALESCE($3::int,0)',
      [info.docType, info.titleNorm, info.yearBE]
    );
    if (found.rows[0]) { lawId = found.rows[0].id; slug = found.rows[0].slug; result = 'new_version'; }
    else {
      slug = `${info.docType}-${info.yearBE || 'x'}-${sha(info.titleNorm).slice(0, 8)}`;
      const topics = (item.topics || []).filter(t => t in TOPICS);
      const ins = await client.query(
        `INSERT INTO lib_laws (slug, title, title_norm, doc_type, year_be, topics) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [slug, info.title, info.titleNorm, info.docType, info.yearBE, topics]
      );
      lawId = ins.rows[0].id;
    }
    const g = p.gazette;
    const v = await client.query(
      `INSERT INTO lib_versions (law_id, label, promulgated_on, gazette_ref, source_id, source_url, source_ref, content_hash, preamble, footnotes, blocks, quality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text::jsonb,$11::text::jsonb,$12::text::jsonb) RETURNING id`,
      [lawId, item.label || 'ฉบับรวมแก้ไขจากแหล่งข้อมูล', null, g ? g.text : null, sourceId,
       isUrl(item.sourceUrl) ? item.sourceUrl : null, item.ref ? String(item.ref).slice(0, 100) : null, hash,
       p.preamble.slice(0, 200000), JSON.stringify(p.footnotes), JSON.stringify(p.blocks), JSON.stringify(p.quality)]
    );
    const versionId = v.rows[0].id;
    const mainBlocks = new Set(p.blocks.filter(b => b.main).map(b => b.id));
    // แทรกมาตราเป็นชุด ๆ ละ 200 แถว
    const units = p.units;
    for (let i = 0; i < units.length; i += 200) {
      const chunk = units.slice(i, i + 200), vals = [], args = [];
      chunk.forEach((u, k) => {
        const ord = i + k + 1, b = args.length;
        args.push(versionId, ord, u.kind, u.block, mainBlocks.has(u.block), u.level || null, u.number || null, u.key || null,
          u.heading || null, u.body || '', u.notes || [], tokenize(`${u.number || ''} ${u.heading || ''} ${u.body || ''}`));
        vals.push(`($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9},$${b + 10},$${b + 11},to_tsvector('simple',$${b + 12}))`);
      });
      await client.query(
        `INSERT INTO lib_sections (version_id, ord, kind, block, is_main, level, number, number_key, heading, body, notes, search_tokens) VALUES ${vals.join(',')}`,
        args
      );
    }
    // เส้นเวลาจากเชิงอรรถต้นฉบับ (ยังไม่ยืนยัน)
    if (g) {
      await client.query(
        `INSERT INTO lib_events (law_id, version_id, kind, title, event_date, gazette_ref, evidence) VALUES ($1,$2,'promulgated',$3,$4,$5,$6)
         ON CONFLICT (law_id, kind, title) DO NOTHING`,
        [lawId, versionId, 'ราชกิจจานุเบกษาที่อ้างถึงเป็นลำดับแรกในเอกสาร', g.date, g.text, `เชิงอรรถ [${g.note}]`]
      );
    }
    for (const a of p.amendments) {
      await client.query(
        `INSERT INTO lib_events (law_id, version_id, kind, title, event_date, gazette_ref, evidence) VALUES ($1,$2,'amended',$3,$4,$5,$6)
         ON CONFLICT (law_id, kind, title) DO NOTHING`,
        [lawId, versionId, a.title.slice(0, 300), a.gazette?.date || null, a.gazette?.text || null, 'บทบัญญัติท้ายเอกสาร']
      );
    }
    await client.query('UPDATE lib_laws SET updated_at = now() WHERE id = $1', [lawId]);
    await client.query('COMMIT');
    return { result, slug, flagged, quality: p.quality };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally { client.release(); }
}

let running = false;
export const isRunning = () => running;

async function runJob(pool, jobId, items, sourceId) {
  running = true;
  const log = async (msg) => pool.query(`UPDATE lib_import_jobs SET log = (log || $2::text::jsonb) WHERE id = $1`, [jobId, JSON.stringify([msg])]).catch(() => {});
  try {
    await pool.query(`UPDATE lib_import_jobs SET status = 'running', total = $2 WHERE id = $1`, [jobId, items.length]);
    for (const it of items) {
      let col = null;
      try {
        const r = await importOne(pool, it, sourceId);
        col = r.result === 'added' ? 'added' : r.result === 'new_version' ? 'new_version' : 'duplicates';
        if (r.flagged) { await pool.query('UPDATE lib_import_jobs SET flagged = flagged + 1 WHERE id = $1', [jobId]); await log(`ตรวจ: ${it.title.slice(0, 80)} (เลขมาตราขาดช่วง ${r.quality.gaps} · ${r.quality.gapList.slice(0, 3).join(', ')})`); }
      } catch (e) {
        await pool.query('UPDATE lib_import_jobs SET flagged = flagged + 1 WHERE id = $1', [jobId]);
        await log(`ไม่สำเร็จ: ${String(it.title || '').slice(0, 80)} — ${e.message}`);
      }
      await pool.query(`UPDATE lib_import_jobs SET done = done + 1${col ? `, ${col} = ${col} + 1` : ''} WHERE id = $1`, [jobId]);
      await new Promise(r => setImmediate(r));   // ให้คำขออื่นได้ทำงานระหว่างนำเข้า
    }
    await pool.query(`UPDATE lib_import_jobs SET status = 'done', finished_at = now() WHERE id = $1`, [jobId]);
  } catch (e) {
    console.error('[library] import job failed:', e.message);
    await pool.query(`UPDATE lib_import_jobs SET status = 'failed', finished_at = now(), log = (log || $2::text::jsonb) WHERE id = $1`, [jobId, JSON.stringify([e.message])]).catch(() => {});
  } finally { running = false; }
}

async function createJob(pool, code, userId) {
  const { rows } = await pool.query('INSERT INTO lib_import_jobs (source_code, started_by) VALUES ($1,$2) RETURNING id', [code, userId]);
  return rows[0].id;
}

// ชุดแกน (ไฟล์มากับโค้ด): ข้อมูลจากเว็บไซต์กฤษฎีกา รวบรวมโดยโครงการ PyThaiNLP เมื่อ 20 มิ.ย. 2564
export async function startSeedImport(pool, userId) {
  if (running) throw Object.assign(new Error('มีงานนำเข้ากำลังทำอยู่'), { status: 409 });
  let seed;
  try { seed = await readSeed(); } catch (e) { throw Object.assign(e, { status: 400 }); }
  const sourceId = await ensureSource(pool, {
    code: 'pythainlp-thai-law-2021', name: 'ชุดข้อมูล thai-law (PyThaiNLP) จากเว็บไซต์สำนักงานคณะกรรมการกฤษฎีกา',
    homepage: seed.repo, license: seed.license, collectedAt: seed.collectedAt,
    note: `รวบรวมเมื่อ ${seed.collectedAt} (commit ${String(seed.commit).slice(0, 7)}) · อาจไม่รวมการแก้ไขหลังวันที่รวบรวม · ทุกฉบับต้องตรวจสถานะกับราชกิจจานุเบกษาก่อนยืนยัน`,
  });
  const items = seed.laws.map(l => ({ ...l, topics: SEED_TOPICS[l.ref] || [], label: `ฉบับรวมแก้ไข (ข้อมูล ณ ${seed.collectedAt})` }));
  const jobId = await createJob(pool, 'pythainlp-thai-law-2021', userId);
  runJob(pool, jobId, items, sourceId);   // ไม่รอ — ทำเบื้องหลัง
  return jobId;
}

// แอดมินวางข้อความกฎหมายเอง (คัดลอกจากแหล่งทางการ) — ต้องระบุแหล่งที่มาเสมอ
export function cleanUpload(body) {
  const list = Array.isArray(body?.laws) ? body.laws : [body];
  if (!list.length || list.length > 20) return { error: 'ส่งได้ครั้งละ 1–20 ฉบับ' };
  const src = body?.source || {};
  if (!isUrl(src.homepage) || !String(src.name || '').trim() || !String(src.license || '').trim()) {
    return { error: 'ต้องระบุแหล่งที่มา (ชื่อ, ลิงก์, เงื่อนไขการใช้) ก่อนนำเข้า' };
  }
  const laws = [];
  for (const l of list) {
    const title = String(l?.title || '').trim(), text = String(l?.text || '');
    if (!title || title.length > 400) return { error: 'ชื่อกฎหมายว่างหรือยาวเกิน' };
    if (text.length < 50 || text.length > 3_000_000) return { error: `เนื้อหา "${title.slice(0, 40)}" สั้นหรือยาวเกินไป` };
    if (l.sourceUrl && !isUrl(l.sourceUrl)) return { error: `ลิงก์ต้นฉบับของ "${title.slice(0, 40)}" ไม่ถูกต้อง` };
    laws.push({ title, text, sourceUrl: l.sourceUrl || null, ref: l.ref ? String(l.ref).slice(0, 100) : null, topics: Array.isArray(l.topics) ? l.topics.slice(0, 5) : [],
      label: l.label ? String(l.label).trim().slice(0, 120) : undefined });
  }
  const code = 'upload-' + sha(String(src.homepage).toLowerCase()).slice(0, 10);
  return { laws, source: { code, name: String(src.name).trim().slice(0, 200), homepage: src.homepage, license: String(src.license).trim().slice(0, 200), note: String(src.note || '').slice(0, 500) } };
}

export async function startUploadImport(pool, userId, cleaned) {
  if (running) throw Object.assign(new Error('มีงานนำเข้ากำลังทำอยู่'), { status: 409 });
  const sourceId = await ensureSource(pool, cleaned.source);
  const jobId = await createJob(pool, cleaned.source.code, userId);
  runJob(pool, jobId, cleaned.laws, sourceId);
  return jobId;
}

// ตรวจก่อนนำเข้า (ไม่บันทึกอะไร): แบ่งมาตราได้กี่มาตรา · ชื่อตรงกับฉบับไหนในคลัง · แก้ไขล่าสุดที่เอกสารอ้างถึง
export async function previewOne(pool, item) {
  const info = titleInfo(item.title || '');
  if (!info.title || info.title.length > 400) throw Object.assign(new Error('ชื่อกฎหมายว่างหรือยาวเกิน'), { status: 400 });
  const text = normalizeText(String(item.text || ''));
  if (text.replace(/\s/g, '').length < 50) throw Object.assign(new Error('เนื้อหาสั้นเกินไป'), { status: 400 });
  if (text.length > 3_000_000) throw Object.assign(new Error('เนื้อหายาวเกินไป'), { status: 400 });
  const hash = sha(text.replace(/\s+/g, ' ').trim());
  const p = parseLaw(text);
  const [dup, found] = await Promise.all([
    pool.query('SELECT l.slug, l.title FROM lib_versions v JOIN lib_laws l ON l.id = v.law_id WHERE v.content_hash = $1 LIMIT 1', [hash]),
    pool.query(`SELECT l.slug, l.title, v.quality FROM lib_laws l LEFT JOIN LATERAL (SELECT quality FROM lib_versions WHERE law_id = l.id ORDER BY id DESC LIMIT 1) v ON true
                 WHERE l.doc_type = $1 AND l.title_norm = $2 AND COALESCE(l.year_be,0) = COALESCE($3::int,0)`, [info.docType, info.titleNorm, info.yearBE]),
  ]);
  const am = p.amendments.filter(a => a.yearBE).sort((x, y) => x.yearBE - y.yearBE);
  return {
    title: info.title, docType: info.docType, quality: p.quality,
    duplicateOf: dup.rows[0] || null,
    existing: found.rows[0] ? { slug: found.rows[0].slug, title: found.rows[0].title, mainSections: found.rows[0].quality?.mainSections ?? null } : null,
    amendments: am.length, latestAmendments: am.slice(-3).map(a => ({ title: a.title.slice(0, 200), yearBE: a.yearBE, gazette: a.gazette?.text || null })),
  };
}

export { thToArabic };
