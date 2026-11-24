// ภาพและปกของคู่มือแยกเป็นไฟล์เล็กรายเรื่อง — เพิ่มเรื่องใหม่ = อัปโหลดไฟล์ใหม่ ไม่ต้องแก้ไฟล์ใหญ่ (guide-comic.js / guide-scenes.js / guide.css เก็บไว้เป็นของเดิม)
//   public/guide-panels/<slug>.panels.js   ภาพช่องการ์ตูน  VCPanels({ ชื่อฉาก: function (k) {...}, ... });
//   public/guide-cards/<slug>.card.js      ภาพการ์ด       VCCards({ ชื่อการ์ด: function (k) {...} });
//   public/guide-covers/<slug>.cover.css   แบบปก          .gd-cover[data-layout="ชื่อปก"] ...
// เซิร์ฟเวอร์รวมให้เอง: /guide-cards.js · /guide-covers.css (no-cache + ETag ไม่ต้องเพิ่มเลข ?v=) · ภาพช่องการ์ตูนส่งผ่าน comic-split.js
// ชื่อฉาก/การ์ด/ปกในไฟล์เหล่านี้ถูกเพิ่มเข้ารายชื่อที่อนุญาตของ guide-api.js อัตโนมัติ
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DIRS = { panels: ['guide-panels', '.panels.js'], cards: ['guide-cards', '.card.js'], covers: ['guide-covers', '.cover.css'] };
const NAME = /^[a-z0-9]{1,40}$/;

export function listParts(publicDir, kind) {
  const [d, ext] = DIRS[kind], dir = path.join(publicDir, d);
  let fl; try { fl = fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort(); } catch { return { sig: '', files: [] }; }
  const files = fl.map(f => { const p = path.join(dir, f); return { file: f, path: p, mtime: fs.statSync(p).mtimeMs }; });
  return { sig: files.map(x => x.file + ':' + x.mtime).join('|'), files };
}
const readAll = l => l.files.map(x => ({ ...x, text: fs.readFileSync(x.path, 'utf8') }));

// รันไฟล์ภาพแบบแยกส่วน เก็บซอร์สของแต่ละฟังก์ชัน → Map(ชื่อ → ซอร์ส) · ไฟล์ไหนพังข้ามไฟล์นั้น
export function evalParts(parts, fnName) {
  const out = new Map();
  for (const p of parts) {
    try {
      vm.runInNewContext(p.text, { window: {}, [fnName]: o => { for (const n of Object.keys(o || {})) if (NAME.test(n) && typeof o[n] === 'function') out.set(n, String(o[n])); } }, { timeout: 1000 });
    } catch (e) { console.error('[guide-parts] อ่านไฟล์ไม่ได้', p.file, e.message); }
  }
  return out;
}

export function panelSources(publicDir) {
  const l = listParts(publicDir, 'panels'), parts = readAll(l);
  return { sig: l.sig, src: evalParts(parts, 'VCPanels'), text: parts.map(p => p.text).join('\n') };
}

export function partNames(publicDir) {
  const covers = [];
  for (const p of readAll(listParts(publicDir, 'covers'))) for (const m of p.text.matchAll(/data-layout="([a-z0-9]{1,40})"/g)) covers.push(m[1]);
  return {
    panels: [...evalParts(readAll(listParts(publicDir, 'panels')), 'VCPanels').keys()],
    cards: [...evalParts(readAll(listParts(publicDir, 'cards')), 'VCCards').keys()],
    covers: [...new Set(covers)],
  };
}

export function mountParts(app, publicDir) {
  const cache = {};
  function get(kind) {
    const l = listParts(publicDir, kind);
    if (cache[kind] && cache[kind].sig === l.sig) return cache[kind];
    const parts = readAll(l);
    const body = kind === 'cards'
      ? '(function(){var S=window.VCScenes;if(!S||!S.add)return;S.add({' + [...evalParts(parts, 'VCCards')].map(([n, s]) => JSON.stringify(n) + ':' + s).join(',\n') + '});})();\n'
      : parts.map(p => '/* ' + p.file + ' */\n' + p.text.trim()).join('\n') + '\n';
    const raw = Buffer.from(body);
    return (cache[kind] = { sig: l.sig, raw, br: zlib.brotliCompressSync(raw), gz: zlib.gzipSync(raw), etag: '"' + crypto.createHash('sha1').update(raw).digest('hex').slice(0, 16) + '"' });
  }
  const route = (url, kind, type) => app.get(url, (req, res) => {
    let c; try { c = get(kind); } catch (e) { res.statusCode = 500; return res.end('/* ' + e.message + ' */'); }
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('ETag', c.etag);
    res.setHeader('Vary', 'Accept-Encoding');
    if (req.headers['if-none-match'] === c.etag) { res.statusCode = 304; return res.end(); }
    const ae = String(req.headers['accept-encoding'] || ''), enc = /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
    const b = enc === 'br' ? c.br : enc === 'gzip' ? c.gz : c.raw;
    if (enc) res.setHeader('Content-Encoding', enc);
    res.statusCode = 200;
    res.setHeader('Content-Length', b.length);
    res.end(req.method === 'HEAD' ? undefined : b);
  });
  route('/guide-cards.js', 'cards', 'text/javascript; charset=utf-8');
  route('/guide-covers.css', 'covers', 'text/css; charset=utf-8');
}
