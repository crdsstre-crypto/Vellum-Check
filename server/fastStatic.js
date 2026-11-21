// ส่งไฟล์หน้าเว็บแบบบีบอัด (brotli / gzip) + แคชในเบราว์เซอร์ — ไม่ต้องติดตั้งแพ็กเกจเพิ่ม (ใช้ zlib ของ Node)
// - ไฟล์ข้อความ (js, css, html, svg, json) เล็กลงราว 70–85% → โหลดเร็วขึ้นมาก โดยเฉพาะบนมือถือ/เน็ตช้า
// - บีบครั้งเดียวต่อไฟล์แล้วเก็บในหน่วยความจำ · ไฟล์ถูกแก้ (mtime เปลี่ยน) จะบีบใหม่เอง
// - ไฟล์ที่เรียกพร้อม ?v=... (เช่น art.js?v=261) แคชในเบราว์เซอร์ 30 วัน → เปิดครั้งถัดไปแทบไม่ต้องโหลด
//   ไฟล์ที่ไม่มี ?v= (เช่น index.html) ยังตรวจกับเซิร์ฟเวอร์ทุกครั้ง → แก้เว็บแล้วผู้ใช้เห็นของใหม่ทันที
//   ⚠ เวลาแก้ไฟล์ที่มี ?v= ต้องเพิ่มเลข v ใน index.html ด้วยทุกครั้ง (ทำอยู่แล้ว)

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json',
  /* v3: รูป/ฟอนต์ — ส่งตรงไม่บีบ (บีบไม่ลงอยู่แล้ว) แต่ได้แคช 30 วันเมื่อมี ?v= */
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
};
const BINARY = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.ico', '.woff2', '.woff']);
/* v3: ย่อไฟล์ js/css ตอนส่ง (ตัดคอมเมนต์/ช่องว่าง ย่อชื่อตัวแปรภายใน) ด้วย esbuild — ไฟล์ต้นฉบับในโฟลเดอร์ยังอ่านง่ายเหมือนเดิม
   · ย่อไม่ได้/ไม่มี esbuild → ส่งไฟล์เดิม · ปิดได้ด้วย env VC_MINIFY=0 · ไม่ย่อ index.html (มีสคริปต์ฝังในหน้า) */
const MINIFY = process.env.VC_MINIFY !== '0';
let esbP = null;
const esb = () => (esbP = esbP || import('esbuild').then(m => m.default || m, () => null));
const VERSIONED_MAX_AGE = 30 * 24 * 3600;
const MIN_SIZE = 1024;           // ไฟล์เล็กมากไม่คุ้มบีบ
const MAX_SIZE = 8 * 1024 * 1024;

export function cacheHeader(req) {
  return req.query && req.query.v !== undefined ? `public, max-age=${VERSIONED_MAX_AGE}` : 'no-cache';
}

export function fastStatic(root) {
  root = path.resolve(root);
  const cache = new Map();   // file → { mtime, size, raw, gz, br, brPending }

  /* v2 (18 พ.ย.): เดิมตอนเปิดเครื่องบีบไฟล์ทั้งหมด ~10MB ในครั้งเดียว — gzipSync ทุกไฟล์ (บล็อกเซิร์ฟเวอร์) + brotli ระดับ 11
     ทุกไฟล์พร้อมกันใน thread pool → บนเครื่องฟรี (CPU 0.1) thread pool เต็มหลายนาที ทำให้ DNS/ต่อฐานข้อมูล/ต่อ Google
     ช่วงหลัง deploy หมดเวลา (Connection terminated due to connection timeout · UND_ERR_CONNECT_TIMEOUT)
     ตอนนี้: บีบแบบไม่บล็อก (async) · ทีละไฟล์ตามคิว (เหลือ thread ให้งานอื่น) · brotli ระดับกลาง (เร็วกว่ามาก เล็กกว่า gzip อยู่ดี)
     · อุ่นเครื่องเลื่อนเป็น 3 นาทีหลังเปิด */
  let qGz = Promise.resolve(), qBr = Promise.resolve(), qMin = Promise.resolve();   // คิวแยก: ย่อ → gzip (ต้องใช้ทันที) · brotli ทีหลัง
  const enqGz = job => (qGz = qGz.then(job, job)), enqBr = job => (qBr = qBr.then(job, job)), enqMin = job => (qMin = qMin.then(job, job));
  const minA = async (raw, ext) => {
    const es = await esb(); if (!es) return raw;
    const r = await es.transform(raw.toString('utf8'), { loader: ext === '.css' ? 'css' : 'js', minify: true, legalComments: 'none', charset: 'utf8', logLevel: 'silent' });
    const out = Buffer.from(r.code, 'utf8');
    return out.length && out.length < raw.length ? out : raw;
  };
  const gzipA = raw => new Promise((ok, no) => zlib.gzip(raw, { level: 6 }, (err, out) => err ? no(err) : ok(out)));
  const brA = raw => new Promise((ok, no) => zlib.brotliCompress(raw, { params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: raw.length > 200 * 1024 ? 5 : 8, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length } }, (err, out) => err ? no(err) : ok(out)));

  function entry(file, st) {
    let e = cache.get(file);
    if (e && e.mtime === st.mtimeMs && e.size === st.size) return e;
    const raw = fs.readFileSync(file), ext = path.extname(file).toLowerCase();
    e = { mtime: st.mtimeMs, size: st.size, raw, body: raw, gz: null, br: null, bin: BINARY.has(ext) };
    cache.set(file, e);
    if (e.bin) { e.minP = e.gzP = Promise.resolve(null); return e; }
    const doMin = MINIFY && (ext === '.js' || ext === '.css') && !/\.min\.(js|css)$/i.test(file);
    e.minP = (doMin ? enqMin(() => minA(raw, ext)) : Promise.resolve(raw)).then(b => { e.body = b || raw; e.mini = e.body !== raw; return e.body; }, () => raw);
    e.gzP = e.minP.then(b => enqGz(() => gzipA(b))).then(out => { if (cache.get(file) === e) e.gz = out; return out; }, () => null);
    e.minP.then(b => enqBr(() => brA(b).then(out => { if (cache.get(file) === e) e.br = out; }, () => {})));
    return e;
  }

  /* v4: ไฟล์ฉากหน้าปก (hero-theme-*.js) + ไฟล์หลักของหน้าแรก ย่อ/บีบเตรียมไว้ตั้งแต่ 8 วินาทีหลังเปิดเครื่อง
     — ไม่ต้องให้คนแรกที่กดเปลี่ยนฉากหลัง deploy ต้องรอย่อไฟล์ใหญ่ ๆ (เดิมทำให้จอดำนานตอนเปลี่ยนเป็นฉากนักสืบ) · ทำทีละไฟล์ตามคิวเดิม */
  setTimeout(() => {
    try {
      const pick = fs.readdirSync(root).filter(n => /^hero-theme-[a-z]+\.js$/.test(n) || /^(hero-scene|art|perf-boost)\.(js|css)$/.test(n));
      pick.sort((a, b) => (a.startsWith('hero-theme-') ? 0 : 1) - (b.startsWith('hero-theme-') ? 0 : 1));
      for (const n of pick) { const p = path.join(root, n); try { const st = fs.statSync(p); if (st.size >= MIN_SIZE && st.size <= MAX_SIZE) entry(p, st); } catch { /* ข้าม */ } }
    } catch (err) { console.error('[static] early warm failed:', err.message); }
  }, 8 * 1000).unref?.();

  // อุ่นเครื่อง: 3 นาทีหลังเปิด ค่อยๆ บีบไฟล์ข้อความที่เหลือทีละไฟล์ (ไม่แย่งงานช่วงเครื่องเพิ่งเปิด)
  setTimeout(() => {
    const walk = dir => {
      for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
        if (d.name.startsWith('.')) continue;
        const p = path.join(dir, d.name);
        if (d.isDirectory()) walk(p);
        else if (TYPES[path.extname(d.name).toLowerCase()]) {
          try { const st = fs.statSync(p); if (st.size >= MIN_SIZE && st.size <= MAX_SIZE && !BINARY.has(path.extname(p).toLowerCase())) entry(p, st); } catch { /* ข้าม */ }
        }
      }
    };
    try { walk(root); } catch (err) { console.error('[static] warm-up failed:', err.message); }
  }, 180 * 1000).unref?.();

  return async function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    let rel;
    try { rel = decodeURIComponent((req.path || req.url.split('?')[0])); } catch { return next(); }
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(root, path.normalize(rel));
    if (!file.startsWith(root + path.sep) || /[\\/]\./.test(rel)) return next();
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!type) return next();
    let st;
    try { st = fs.statSync(file); } catch { return next(); }
    if (!st.isFile() || st.size < MIN_SIZE || st.size > MAX_SIZE) return next();

    const ae = String(req.headers['accept-encoding'] || '');
    let e;
    try { e = entry(file, st); } catch { return next(); }
    const wantGz = !e.bin && /\bgzip\b/.test(ae);
    if (!(e.br && /\bbr\b/.test(ae)) && wantGz && !e.gz) { try { await e.gzP; } catch { /* ส่งไม่บีบ */ } }
    const enc = e.bin ? null : e.br && /\bbr\b/.test(ae) ? 'br' : wantGz && e.gz ? 'gzip' : null;
    if (!enc && !e.bin) { try { await e.minP; } catch { /* ส่งไฟล์เดิม */ } }
    const body = enc === 'br' ? e.br : enc === 'gzip' ? e.gz : e.body;
    const etag = `W/"${st.size.toString(36)}-${Math.floor(st.mtimeMs).toString(36)}${e.mini ? 'm' : ''}${enc ? '-' + enc : ''}"`;

    res.setHeader('Content-Type', type);
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', cacheHeader(req));
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', st.mtime.toUTCString());
    if (req.headers['if-none-match'] === etag) { res.statusCode = 304; return res.end(); }
    if (enc) res.setHeader('Content-Encoding', enc);
    res.setHeader('Content-Length', body.length);
    if (req.method === 'HEAD') return res.end();
    res.end(body);
  };
}
