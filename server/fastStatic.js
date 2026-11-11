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
};
const VERSIONED_MAX_AGE = 30 * 24 * 3600;
const MIN_SIZE = 1024;           // ไฟล์เล็กมากไม่คุ้มบีบ
const MAX_SIZE = 8 * 1024 * 1024;

export function cacheHeader(req) {
  return req.query && req.query.v !== undefined ? `public, max-age=${VERSIONED_MAX_AGE}` : 'no-cache';
}

export function fastStatic(root) {
  root = path.resolve(root);
  const cache = new Map();   // file → { mtime, size, raw, gz, br, brPending }

  function entry(file, st) {
    let e = cache.get(file);
    if (e && e.mtime === st.mtimeMs && e.size === st.size) return e;
    const raw = fs.readFileSync(file);
    e = { mtime: st.mtimeMs, size: st.size, raw, gz: zlib.gzipSync(raw, { level: 6 }), br: null };
    cache.set(file, e);
    // brotli ระดับสูงสุดใช้เวลานาน → ทำเบื้องหลัง ระหว่างนั้นส่ง gzip ไปก่อน
    zlib.brotliCompress(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length } }, (err, out) => {
      if (!err && cache.get(file) === e) e.br = out;
    });
    return e;
  }

  // อุ่นเครื่อง: บีบไฟล์ข้อความทั้งหมดตอนเปิดเซิร์ฟเวอร์ (ไม่บล็อกการเริ่มทำงาน)
  setTimeout(() => {
    const walk = dir => {
      for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
        if (d.name.startsWith('.')) continue;
        const p = path.join(dir, d.name);
        if (d.isDirectory()) walk(p);
        else if (TYPES[path.extname(d.name).toLowerCase()]) {
          try { const st = fs.statSync(p); if (st.size >= MIN_SIZE && st.size <= MAX_SIZE) entry(p, st); } catch { /* ข้าม */ }
        }
      }
    };
    try { walk(root); } catch (err) { console.error('[static] warm-up failed:', err.message); }
  }, 50).unref?.();

  return function (req, res, next) {
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
    const enc = e.br && /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
    const body = enc === 'br' ? e.br : enc === 'gzip' ? e.gz : e.raw;
    const etag = `W/"${st.size.toString(36)}-${Math.floor(st.mtimeMs).toString(36)}${enc ? '-' + enc : ''}"`;

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
