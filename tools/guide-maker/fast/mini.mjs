// เซิร์ฟเวอร์จำลองสำหรับทดสอบหน้า /guide โดยไม่ต้องใช้ Postgres/Express
// ใช้: ROOT=/path/to/repo PORT=3401 node mini.mjs   (ADMIN=1 เพื่อเห็นฉบับร่าง)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.env.ROOT, routes = [];
const app = { get: (p, h) => routes.push([new RegExp('^' + p.replace(/\./g, '\\.').replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), h]) };
const { mountGuides } = await import(ROOT + '/server/library/guide-api.js');
mountGuides(app, { getUserFromRequest: async () => (process.env.ADMIN ? {} : null), isAdmin: () => true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  res.status = c => { res.statusCode = c; return res; };
  res.sendFile = f => { res.setHeader('Content-Type', types[path.extname(f)] || 'text/plain'); res.end(fs.readFileSync(f)); };
  for (const [re, h] of routes) { const m = u.pathname.match(re); if (m) return h({ params: m.groups || {}, query: Object.fromEntries(u.searchParams), headers: req.headers, url: req.url, method: req.method }, res); }
  if (u.pathname.startsWith('/api/lib/cite')) { res.setHeader('Content-Type', 'application/json'); return res.end('{"error":"mock"}'); }
  const f = path.join(ROOT, 'public', u.pathname);
  if (f.startsWith(path.join(ROOT, 'public')) && fs.existsSync(f) && fs.statSync(f).isFile()) return res.sendFile(f);
  res.statusCode = 404; res.end();
}).listen(Number(process.env.PORT || 3401), () => console.log('ready'));
