/* แปลง PDF ฉบับรวมแก้ไขของกฤษฎีกา (หน้าเว็บ ocs.go.th ที่สั่งพิมพ์เป็น PDF) → ข้อความ .txt สำหรับคลังกฎหมาย
   ใช้ pdf.js (ส่งเข้ามาเป็นพารามิเตอร์) · ทำงานได้ทั้งในเบราว์เซอร์และ Node · ไม่แต่งเนื้อหา แค่เรียงตัวอักษรตามตำแหน่งบนหน้า
   ขั้นตอนเหมือน pipeline เดิม (pdfminer → rebuild3 → assemble2 → fixmarks) */

// ฟอนต์ไทยบางตัวในไฟล์กฤษฎีกาไม่มีตาราง ToUnicode สำหรับสระ/วรรณยุกต์บางรูป → แปลงจากรหัสกลีฟ (CID)
const CID_MAP = { 0x2dc: '่', 0x2dd: '่', 0x2df: '้', 0x2e0: '้', 0x2ea: '็', 0x2da: 'ั', 0x2e5: '๋', 0x2ff: '๋', 0x2e7: '์', 0x2ed: 'ิ', 0x2ef: 'ี', 0x2f1: 'ึ', 0x2f3: 'ื', 0x2f5: '่ํ', 0x2f6: '้ํ', 0x1bd: 'ญ', 0x1e2: 'ฬ', 0x2e2: '๊', 0x2e8: '์' };
const SUFL = ['ทวิ', 'ตรี', 'จัตวา', 'เบญจ', 'ฉ', 'สัตต', 'อัฏฐ', 'นว', 'ทศ', 'เอกาทศ', 'ทวาทศ', 'เตรส', 'จตุทศ', 'ปัณรส', 'โสฬส', 'สัตตรส', 'อัฏฐารส'];
const SUF = SUFL.join('|');
const TH = '๐๑๒๓๔๕๖๗๘๙';
const thNum = s => Number(String(s).replace(/[๐-๙]/g, d => TH.indexOf(d)));
const isSup = t => /^\s*(\[\s*\d+\s*\]\s*)+$/.test(t);
const MARKS = /^[ัิ-ฺ็-๎\s]*$/;

async function pageLines(pdfjs, page, pno) {
  const [tc, ol] = await Promise.all([page.getTextContent(), page.getOperatorList()]);
  // กลีฟที่ไม่มี Unicode เรียงตามลำดับในสตรีม → ใช้แทน \u0000 ใน textContent ตามลำดับเดียวกัน
  const unk = [];
  for (let i = 0; i < ol.fnArray.length; i++) {
    if (ol.fnArray[i] !== pdfjs.OPS.showText) continue;
    for (const g of ol.argsArray[i][0] || []) if (g && typeof g === 'object' && (!g.unicode || g.unicode === '\u0000')) unk.push(g.originalCharCode);
  }
  let ui = 0, bad = 0;
  const items = [];
  for (const it of tc.items) {
    if (!it.str) continue;
    const str = it.str.replace(/\u0000/g, () => { const c = unk[ui++]; const r = CID_MAP[c]; if (r == null) bad++; return r ?? '�'; });
    const x = it.transform[4], y = it.transform[5], h = it.height || 0;
    if (!(y > 30 && y < 775)) continue;                 // หัว/ท้ายกระดาษที่เบราว์เซอร์พิมพ์ + เลขหน้า
    if (/^\s*\|\s*\d+\s*$/.test(str)) continue;
    items.push({ x, y, h, w: it.width || 0, t: str, sup: isSup(str) });
  }
  // บรรทัด = กลุ่มของ baseline ที่ห่างกันไม่เกิน 2pt
  const ys = [...new Set(items.filter(i => !i.sup && i.t.trim()).map(i => i.y))].sort((a, b) => b - a);
  const base = [];
  for (const y of ys) if (!base.length || Math.abs(base[base.length - 1] - y) > 2) base.push(y);
  const G = new Map();
  for (const it of items) {
    if (!base.length) break;
    let b;
    if (it.sup) { const below = base.filter(b0 => b0 <= it.y + 0.5 && it.y - b0 <= 8); b = below.length ? Math.max(...below) : base.reduce((a, c) => Math.abs(c - it.y) < Math.abs(a - it.y) ? c : a); }
    else b = base.reduce((a, c) => Math.abs(c - it.y) < Math.abs(a - it.y) ? c : a);
    if (!G.has(b)) G.set(b, []);
    G.get(b).push(it);
  }
  const lines = [], head = [];
  for (const b of [...G.keys()].sort((a, c) => c - a)) {
    const fr = G.get(b).slice().sort((a, c) => Math.abs(a.x - c.x) < 0.6 ? (c.sup - a.sup) || a.x - c.x : a.x - c.x);   // ตำแหน่งเท่ากัน: เลขเชิงอรรถมาก่อนช่องว่าง
    const first = fr.find(i => !i.sup);
    if (!first) continue;
    let t = fr.map(i => i.t).join('');
    t = t.replace(/ํา/g, 'ำ').replace(/\[\s*(\d+)\s*\]/g, '[$1]');
    const sp = /[  ]$/.test(t);
    t = t.replace(/[  ]+/g, ' ').trim();
    t = t.replace(/(?<=\S) +\[(\d+)\]/g, '[$1]');
    t = t.replace(/(\[\d+\])([ัิ-ฺ็-๎]+)/g, '$2$1');
    t = t.replace(/ ((?:\[\d+\])+)(?=[ก-ฮเ-ไ])/g, '$1 ');   // "ปฏิเสธ [3]การ" → "ปฏิเสธ[3] การ"
    if (!t || MARKS.test(t)) continue;
    const y1 = b + (first.h || 10.5);
    if (pno === 0 && y1 > 680) { head.push(t); continue; }   // หัวเอกสารหน้าแรก (ชื่อหน่วยงาน/คำว่า พระราชบัญญัติ) — เก็บไว้เดาชื่อกฎหมาย
    lines.push({ y: y1, x: first.x, t, p: pno, sp });
  }
  return { lines, bad, head };
}

function assemble(lines) {
  const fidx = lines.map((L, k) => /^\[1\]\s*\S/.test(L.t) ? k : -1).filter(k => k >= 0);
  const fstart = fidx.length ? fidx[fidx.length - 1] : lines.length;
  const HRE = new RegExp(`^มาตรา ([๐-๙]+)(?:/([๐-๙]+))?(?:\\[\\d+\\])?(?: (${SUF})(?![ก-๙]))?`);
  const rank = s => { const m = HRE.exec(s); return m ? [thNum(m[1]), m[2] ? thNum(m[2]) : 0, m[3] ? SUFL.indexOf(m[3]) + 1 : 0] : null; };
  const gt = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const PREV_WORD = /(ตาม|แห่ง|ใน|และ|หรือ|ถึง|กับ|ของ|โดย|ด้วย|แต่|ซึ่ง|ต่อ|จาก|เว้นแต่|ยกเว้น|,)\s*(\[\d+\])?$/;
  const paras = []; let cur = null, last = [0, 0, 0];
  lines.forEach((L, k) => {
    const s = L.t, x = L.x, prev = k ? lines[k - 1] : null;
    const isfn = k >= fstart && /^\[\d+\]/.test(s);
    const gap = prev && prev.p === L.p && prev.y - L.y > 21;
    const r = k < fstart ? rank(s) : null;
    const pb = prev && prev.p !== L.p && r && gt(r, last) > 0 && !PREV_WORD.test(prev.t);
    if (r && (x > 112 || gap || pb) && gt(r, last) > 0) last = r;
    if (x > 112 || !cur || isfn || gap || pb) { if (cur) paras.push(cur); cur = [s]; }
    else cur.push((prev.sp ? '\x01' : '') + s);
  });
  if (cur) paras.push(cur);
  const thai = c => c >= '฀' && c <= '๿';
  const join = parts => parts.slice(1).reduce((out, p) => p.startsWith('\x01') ? out + ' ' + p.slice(1) : out + (thai(out[out.length - 1]) && thai(p[0]) ? '' : ' ') + p, parts[0]);
  let txt = paras.map(join).join('\n\n') + '\n';
  txt = txt.replace(new RegExp(`^(มาตรา [๐-๙]+(?:/[๐-๙]+)?)(\\[\\d+\\]) (${SUF})(?![ก-๙])`, 'gm'), '$1 $3$2');
  return txt;
}

// เลขเชิงอรรถที่ยังค้างกลางคำ → ย้ายไปหลัง (๑)/“คำนิยาม” หรือท้ายย่อหน้า · "มาตรา N ทวิ[n]/๑" → "มาตรา N ทวิ/๑[n]"
function fixMarks(txt) {
  const PAT = /(?<=[\u0e01-\u0e4e])\[\d+\](?=[\u0e01-\u0e4e])/g;   // เฉพาะอักษรไทย ไม่รวมเลขไทย
  txt = txt.split('\n').map(line => {
    const marks = line.match(PAT);
    if (!marks) return line;
    const rest = line.replace(PAT, '');
    const m = /^((?:\([๐-๙0-9]+\)\s*)?(?:“[^”"]+[”"])?)(.*)$/.exec(rest);
    const pre = m[1];
    if (pre.trim()) { const p2 = pre.replace(/\s+$/, ''); return p2 + marks.join('') + (pre.length > p2.length ? ' ' : '') + m[2]; }
    return rest.replace(/\s+$/, '') + marks.join('');
  }).join('\n');
  txt = txt.replace(new RegExp(`^(มาตรา [๐-๙]+ (?:${SUF}))((?:\\[\\d+\\])+)(/[๐-๙]+)`, 'gm'), '$1$3$2');
  // ชื่อกฎหมายแก้ไขท้ายเอกสารที่ติดกับ "มาตรา ๒ ..." ในบรรทัดเดียว → แยกย่อหน้า
  txt = txt.replace(/^((?:\*?)(?:พระราชบัญญัติ|พระราชกำหนด|พระราชกฤษฎีกา)[^\n\[]{4,300}?(?:\[\d+\])+) (มาตรา [๐-๙]+ )/gm, '$1\n\n$2');
  return txt;
}

/** data: Uint8Array ของไฟล์ PDF · คืน { text, pages, badGlyphs } */
export async function pdfToLawText(pdfjs, data, onProgress) {
  const task = pdfjs.getDocument({ data, disableFontFace: true, isEvalSupported: false, verbosity: 0 });
  const doc = await task.promise;
  const all = []; let bad = 0, head = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const r = await pageLines(pdfjs, page, i - 1);
    all.push(...r.lines); bad += r.bad; if (i === 1) head = r.head;
    page.cleanup();
    onProgress?.(i, doc.numPages);
  }
  const pages = doc.numPages;
  await task.destroy?.();
  const text = fixMarks(assemble(all));
  return { text, pages, badGlyphs: (text.match(/\ufffd/g) || []).length, title: guessTitle(head, text) };
}

// เดาชื่อกฎหมายจากหัวเอกสารหน้าแรก: "พระราชบัญญัติ" + "ว่าด้วย…" + "พ.ศ. ๒๕๔๐" · ประมวลกฎหมาย → ใช้ชื่อประมวลอย่างเดียว
function guessTitle(head, text) {
  const top = head.filter(h => !/สำนักงานคณะกรรมการกฤษฎีกา|Office of the Council|\d{1,2}\/\d{1,2}\/\d{2}/.test(h));
  const body = [];
  for (const l of text.split('\n').filter(x => x.trim()).slice(0, 6)) {
    if (/^(ภูมิพล|ในพระปรมาภิไธย|สมเด็จ|พระบาท|ให้ไว้|ตราไว้|เป็นปีที่|มาตรา)/.test(l)) break;
    body.push(l.trim());
    if (/(พ\.ศ\.|พุทธศักราช)\s*[๐-๙0-9]{4}\s*$/.test(l)) break;
  }
  let t = [...top, ...body].join(' ').replace(/\s+/g, ' ').replace(/\[\d+\]/g, '').trim();
  const code = /ประมวลกฎหมาย(?:แพ่งและพาณิชย์|วิธีพิจารณาความแพ่ง|วิธีพิจารณาความอาญา|อาญาทหาร|อาญา|ที่ดิน|รัษฎากร|ยาเสพติด)/.exec(t);
  if (code && /(พระราชบัญญัติ|พระราชกฤษฎีกา)\s*ให้ใช้(?:บทบัญญัติแห่ง)?\s*ประมวลกฎหมาย/.test(t.slice(0, 200))) return code[0];
  t = t.replace(/^(พระราชบัญญัติ|พระราชกำหนด|พระราชกฤษฎีกา)\s+/, '$1');
  return t.replace(/[๐-๙]/g, d => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(d))).slice(0, 300);
}
