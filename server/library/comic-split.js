// แยกภาพการ์ตูนคู่มือเป็นรายฉาก — เบราว์เซอร์ไม่ต้องโหลดภาพของทุกเรื่องทุกครั้ง
// ไฟล์ต้นฉบับยังเป็น public/guide-comic.js ไฟล์เดียว (เขียน/แก้ที่เดิม) · เซิร์ฟเวอร์แยกให้เองตอนรัน
//   GET /guide-comic-core.js            แกน: ฟังก์ชันช่วยวาด ฉากหลังปก ภาพปกกว้าง (ไม่มีฉากช่องการ์ตูน)
//   GET /guide-comic-scenes.js?s=a,b&v= เฉพาะฉากที่ขอ (ไม่เกิน 12 ฉาก) → VCComic.add({...})
// · อ่านไฟล์ใหม่เองเมื่อไฟล์ถูกแก้ (ดู mtime) · บีบ brotli/gzip และจำผลไว้ในหน่วยความจำ
// · v ของไฟล์ฉาก = แฮชของ guide-comic.js → ตรงกันแคช 30 วัน ไม่ตรงให้ตรวจใหม่ทุกครั้ง
// · ถ้าแยกไม่สำเร็จ (รูปแบบไฟล์เปลี่ยน) แกนจะส่งไฟล์เต็มแทน หน้าเว็บยังทำงานได้ตามเดิม
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { listParts, panelSources } from './guide-parts.js';

const NAME = /^[a-z0-9]{1,40}$/;
const MAX_SCENES = 12;
const LONG = 'public, max-age=2592000, immutable';

export function mountComic(app, publicDir) {
  const SRC = path.join(publicDir, 'guide-comic.js');
  let st = null;            // { mtime, hash, core, src: Map(name → source), helpers: [] }
  const zcache = new Map(); // key → { raw, br, gz }

  function build() {
    // ภาพช่องการ์ตูนของเรื่องใหม่อยู่ใน public/guide-panels/*.panels.js (ดู guide-parts.js) รวมเข้ามาด้วย
    const m = fs.statSync(SRC).mtimeMs + '|' + listParts(publicDir, 'panels').sig;
    if (st && st.mtime === m) return st;
    const text = fs.readFileSync(SRC, 'utf8'), parts = panelSources(publicDir);
    const hash = crypto.createHash('sha1').update(text).update(parts.text).digest('hex').slice(0, 10);
    let core = text, src = new Map(), helpers = [];
    try {
      const a = text.indexOf('\nvar P={'), b = text.indexOf('\n};\nvar BG={', a);
      if (a < 0 || b < 0) throw new Error('ไม่พบช่วง var P={ … };');
      const win = {};
      vm.runInNewContext(text, { window: win }, { timeout: 20000 });
      const C = win.VCComic;
      if (!C || !C._P || !C._h) throw new Error('ไฟล์ไม่มี VCComic._P/_h');
      helpers = Object.keys(C._h).filter(n => /^[A-Za-z_$][\w$]*$/.test(n));
      for (const n of Object.keys(C._P)) src.set(n, String(C._P[n]));
      for (const [n, s2] of parts.src) src.set(n, s2);
      core = text.slice(0, a) + '\nvar P={' + text.slice(b) +
        `\nwindow.VCComic && (window.VCComic.ver = ${JSON.stringify(hash)});\n`;
    } catch (e) {
      console.error('[comic] แยกไฟล์ไม่สำเร็จ ส่งไฟล์เต็มแทน:', e.message);
      src = new Map(); core = text;
      // ส่งไฟล์เต็มแทน: แนบภาพช่องการ์ตูนจากไฟล์แยกรายเรื่องต่อท้ายด้วย ไม่งั้นเรื่องใหม่จะไม่มีภาพ
      if (parts.src.size) core += '\n(function(){var C=window.VCComic;if(!C||!C.add)return;var h=C._h||{},I=h.I,coins=h.coins,bg=h.bg,desk=h.desk,spark=h.spark,person=h.person;\nC.add({' +
        [...parts.src].map(([n, f]) => JSON.stringify(n) + ':' + f).join(',\n') + '});})();\n';
    }
    zcache.clear();
    st = { mtime: m, hash, core, src, helpers };
    console.log(`[comic] แกน ${(Buffer.byteLength(core) / 1024).toFixed(0)}KB · ${src.size} ฉาก · ver ${hash}`);
    return st;
  }

  function send(req, res, key, makeBody, cache) {
    let z = zcache.get(key);
    if (!z) {
      const raw = Buffer.from(makeBody());
      z = { raw, br: zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } }), gz: zlib.gzipSync(raw, { level: 6 }) };
      if (zcache.size > 400) zcache.clear();
      zcache.set(key, z);
    }
    const ae = String(req.headers['accept-encoding'] || '');
    const enc = /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
    const body = enc === 'br' ? z.br : enc === 'gzip' ? z.gz : z.raw;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', cache);
    if (enc) res.setHeader('Content-Encoding', enc);
    res.setHeader('Content-Length', body.length);
    res.end(req.method === 'HEAD' ? undefined : body);
  }
  const qs = req => new URL(req.url, 'http://x').searchParams;

  app.get('/guide-comic-core.js', (req, res) => {
    let s; try { s = build(); } catch (e) { res.statusCode = 500; return res.end('// ' + e.message); }
    // มี ?v= (เลขที่ใส่ใน guide.html) แคช 30 วันเหมือนไฟล์อื่น · ต้องเพิ่มเลขทุกครั้งที่แก้ guide-comic.js
    send(req, res, 'core:' + s.hash, () => s.core, qs(req).has('v') ? LONG : 'no-cache');
  });

  app.get('/guide-comic-scenes.js', (req, res) => {
    let s; try { s = build(); } catch (e) { res.statusCode = 500; return res.end('// ' + e.message); }
    const q = qs(req);
    const names = [...new Set(String(q.get('s') || '').split(','))].filter(n => NAME.test(n) && s.src.has(n)).sort().slice(0, MAX_SCENES);
    const cache = q.get('v') === s.hash ? LONG : 'no-cache';
    send(req, res, 'sc:' + s.hash + ':' + names.join(','), () =>
      '(function(){var C=window.VCComic;if(!C||!C.add)return;var h=C._h' + (s.helpers.length ? ',' + s.helpers.map(n => `${n}=h.${n}`).join(',') : '') + ';\n' +
      'C.add({' + names.map(n => JSON.stringify(n) + ':' + s.src.get(n)).join(',\n') + '});})();\n', cache);
  });
}
