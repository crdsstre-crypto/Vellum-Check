// แยกข้อความกฎหมาย (ฉบับรวมแก้ไขแบบเว็บไซต์กฤษฎีกา) เป็นโครงสร้าง: คำปรารภ · หัวข้อ (บรรพ/ลักษณะ/หมวด/ส่วน) · มาตรา · บทบัญญัติประกอบ · เชิงอรรถ
// ฟังก์ชันล้วน (ไม่แตะฐานข้อมูล) เพื่อทดสอบได้ง่าย · ไม่แต่งเนื้อหา: ข้อความทุกตัวอักษรมาจากต้นฉบับ (แค่จัดช่องว่าง/อักขระพิเศษ)

const TH_DIGITS = '๐๑๒๓๔๕๖๗๘๙';
export const thToArabic = s => String(s).replace(/[๐-๙]/g, d => String(TH_DIGITS.indexOf(d)));

// อักขระจาก Windows-1252 ที่หลุดมาในไฟล์ (เครื่องหมายคำพูด ฯลฯ) และช่องว่างแปลก ๆ
export function normalizeText(raw) {
  return String(raw)
    .replace(/\r\n?/g, '\n')
    .replace(/\u0093/g, '“').replace(/\u0094/g, '”').replace(/\u0091/g, '‘').replace(/\u0092/g, '’')
    .replace(/\u0096/g, '–').replace(/\u0097/g, '—').replace(/\u0085/g, '…')
    .replace(/[   \t]/g, ' ')
    .replace(/[​﻿]/g, '')
    .replace(/ +\n/g, '\n');
}

const SUFFIX = 'ทวิ|ตรี|จัตวา|เบญจ|ฉ|สัตต|อัฏฐ|นว|ทศ|เอกาทศ|ทวาทศ|เตรส|จตุทศ|ปัณรส|โสฬส|สัตตรส|อัฏฐารส';
const SUFFIX_RANK = SUFFIX.split('|');
// "มาตรา ๓/๑ ทวิ[๑๒] ข้อความ..." · ตัวเลขอาจขึ้นบรรทัดถัดไป (รวมบรรทัดก่อนเรียก)
const SEC_RE = new RegExp(`^มาตรา?\\s*([๐-๙0-9]+(?:\\s*/\\s*[๐-๙0-9]+)?)(?:\\s*(${SUFFIX})(?=[\\s\\[]|$))?(?:\\s*(?:ถึง|-)\\s*(?:มาตรา\\s*)?([๐-๙0-9]+(?:\\s*/\\s*[๐-๙0-9]+)?))?\\s*((?:\\[[๐-๙0-9]+\\]\\s*)*)(.*)$`);
const HEAD_RE = /^(ภาค|บรรพ|ลักษณะ|หมวด|ส่วนที่|ส่วน|บทเฉพาะกาล|บททั่วไป|บทกำหนดโทษ|บทนิยาม)(?:\s*[๐-๙0-9]+)?(?=\s|\[|$)/;
const END_RE = /^(ผู้รับสนองพระบรมราชโองการ|ผู้รับสนองพระราชโองการ|หมายเหตุ\s*(:-|:)?)/;
const FN_LINE_RE = /^\[([๐-๙0-9]+)\]\s*(.*)$/;
const GAZ_RE = /ราชกิจจานุเบกษา\s*เล่ม\s*([๐-๙0-9]+)\s*\/\s*(ตอน(?:ที่|พิเศษ)?\s*[๐-๙0-9]+\s*[กขคง]?(?:\s*ฉบับพิเศษ)?)\s*(?:\/\s*ฉบับพิเศษ\s*)?\/?\s*หน้า\s*([๐-๙0-9]+)\s*\/\s*(?:วันที่\s*)?([๐-๙0-9]{1,2})\s*([ก-๙.]+)\s*(?:พ\.ศ\.\s*)?([๐-๙0-9]{4})/;
const MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const blank = l => !l || !l.trim();
const SUBITEM_RE = new RegExp(`^\\s*\\((?:[๐-๙0-9]{1,3}(?:\\s*(?:${SUFFIX}))?|[ก-ฮ])\\)(?:\\s|\\[|$)`);
const clean = s => s.replace(/[ ]{2,}/g, ' ').trim();

// ค่าลำดับของเลขมาตรา: "๓/๑" → 3.001 · "๔ ทวิ" → 4.002 (ใช้ตรวจว่าเรียงขึ้นหรือไม่)
export function sectionValue(num, suffix) {
  const [a, b] = thToArabic(num).replace(/\s/g, '').split('/');
  let v = Number(a) + (b ? Number(b) / 1000 : 0);
  if (suffix) v += (SUFFIX_RANK.indexOf(suffix) + 2) / 1e6;
  return v;
}
export const sectionKey = (num, suffix) => thToArabic(num).replace(/\s/g, '') + (suffix ? ' ' + suffix : '');

// อ่านเชิงอรรถอ้างอิงราชกิจจานุเบกษา → { volume, section, page, date: 'YYYY-MM-DD' (ค.ศ.), text }
export function parseGazette(text) {
  const m = GAZ_RE.exec(String(text).replace(/\n/g, ' '));
  if (!m) return null;
  const mon = MONTHS.indexOf(m[5].replace(/\./g, ''));
  const yBE = Number(thToArabic(m[6])), d = Number(thToArabic(m[4]));
  const date = mon >= 0 && d >= 1 && d <= 31 && yBE > 2400 ? `${yBE - 543}-${String(mon + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : null;
  return { volume: thToArabic(m[1]), section: clean(m[2]), page: thToArabic(m[3]), date, text: clean(m[0]) };
}

// เชิงอรรถท้ายเอกสาร: ชุด [๑] [๒] [๓] ... ที่ต่อเนื่องกันชุดสุดท้าย
function splitFootnotes(lines) {
  let start = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = FN_LINE_RE.exec(lines[i].trim());
    if (m && thToArabic(m[1]) === '1') { start = i; break; }
  }
  if (start < 0) return { body: lines, notes: {} };
  const notes = {}; let cur = null, expect = 1;
  for (let i = start; i < lines.length; i++) {
    const t = lines[i].trim();
    const m = FN_LINE_RE.exec(t);
    if (m && Number(thToArabic(m[1])) === expect) { cur = String(expect); notes[cur] = m[2]; expect++; continue; }
    if (cur && t) notes[cur] += (notes[cur] ? ' ' : '') + t;
  }
  if (expect < 3 && Object.keys(notes).length < 2) return { body: lines, notes: {} };   // ไม่ใช่ชุดเชิงอรรถจริง
  for (const k in notes) notes[k] = clean(notes[k]);
  return { body: lines.slice(0, start), notes };
}

// รวมย่อหน้า: บรรทัดที่ถูกตัดกลางประโยคต่อด้วยช่องว่าง · บรรทัดว่างคือขึ้นย่อหน้าใหม่
function paragraphs(lines) {
  const out = []; let cur = [];
  for (const l of lines) {
    if (blank(l)) { if (cur.length) { out.push(clean(cur.join(' '))); cur = []; } continue; }
    // อนุมาตรา "(๑) ..." / "(ก) ..." ขึ้นบรรทัดใหม่ในต้นฉบับ → เป็นย่อหน้าใหม่
    if (cur.length && SUBITEM_RE.test(l)) { out.push(clean(cur.join(' '))); cur = []; }
    cur.push(l.trim());
  }
  if (cur.length) out.push(clean(cur.join(' ')));
  return out.filter(Boolean).join('\n');
}

/**
 * parseLaw(raw) → {
 *   preamble, units: [{ block, kind:'heading'|'section', key, number, value, heading, body, notes:[n] }],
 *   blocks: [{ id, title, main:boolean, first, last, count, intro }], footnotes: {n:text},
 *   gazette (ฉบับแรก), amendments: [{ title, yearBE, gazette }], quality: {...}
 * }
 */
export function parseLaw(raw) {
  const text = normalizeText(raw);
  let lines = text.split('\n');
  const { body: bodyLines, notes: footnotes } = splitFootnotes(lines);
  lines = bodyLines;

  // รวม "มาตรา" ที่ตัวเลขขึ้นบรรทัดใหม่
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^\s*\([๐-๙0-9]{1,3}\s*$/.test(lines[i]) && new RegExp(`^\\s*(${SUFFIX})\\)`).test(lines[i + 1])) { lines[i] = lines[i].trim() + ' ' + lines[i + 1].trim(); lines.splice(i + 1, 1); }
    if (/^\s*มาตรา\s*$/.test(lines[i]) && /^\s*[๐-๙0-9]/.test(lines[i + 1])) { lines[i] = 'มาตรา ' + lines[i + 1].trim(); lines.splice(i + 1, 1); }
  }

  // หาหัวมาตรา: ต้องขึ้นต้นบรรทัด และบรรทัดก่อนหน้าว่าง (กันคำว่า "มาตรา ..." ที่ถูกตัดบรรทัดกลางประโยค)
  const cand = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!/^มาตรา?\s*[๐-๙0-9]/.test(t)) continue;   // "มาตร ๗๙๘" (พิมพ์ตกในต้นฉบับ) ก็นับ
    const strict = i === 0 || blank(lines[i - 1]);
    const m = SEC_RE.exec(t);
    if (!m) continue;
    const to = m[3] ? m[3].replace(/\s/g, '') : '';
    cand.push({ strict, line: i, number: m[1].replace(/\s/g, ''), suffix: m[2] || '', to, refs: m[4], rest: m[5], value: sectionValue(m[1], m[2]), endValue: to ? sectionValue(to) : sectionValue(m[1], m[2]) });
  }

  // แบ่งเป็นช่วง (block): เลขมาตราต้องเรียงขึ้น ถ้าย้อนกลับ = เริ่มกฎหมายฉบับอื่นที่แนบมา (พ.ร.บ.ให้ใช้/ฉบับแก้ไข)
  const blocks = []; let cur = null;
  let prevLine = -1;
  for (const c of cand) {
    // บรรทัดก่อนหน้าไม่ว่าง (ต้นฉบับบางฉบับไม่เว้นบรรทัด) → รับเฉพาะเมื่อเป็นเลขถัดไปพอดี
    if (!c.strict) {
      const nextOk = cur && c.value > cur.lastValue && (Math.floor(c.value) === Math.floor(cur.lastValue) + 1 || (Math.floor(c.value) === Math.floor(cur.lastValue) && c.value - cur.lastValue < 0.01));
      if (!nextOk) continue;
    }
    // บรรทัดลงนาม ("ผู้รับสนองพระบรมราชโองการ") คั่นระหว่างมาตรา = จบกฎหมายฉบับหนึ่งแล้ว
    let signed = false;
    if (cur) for (let i = prevLine + 1; i < c.line; i++) { const t = lines[i].trim(); if (/^ผู้รับสนองพระ(บรม)?ราชโองการ|^หมายเหตุ/.test(t) || (blank(lines[i - 1]) && t.length < 260 && /^\*?(พระราชบัญญัติ|พระราชกฤษฎีกา|พระราชกำหนด|ประกาศคณะ|ประกาศของคณะ|คำสั่งหัวหน้า|คำสั่งคณะ)/.test(t))) { signed = true; break; } }
    // ช่วงสั้น ๆ (พ.ร.บ.ให้ใช้ ม.๑–๔) แล้วกระโดดไปเลขสูง (ตัวบทประมวล) = คนละฉบับ
    const jump = cur && c.value - cur.lastValue > 25 && cur.items.length <= 30 && cur.items[0].value < 2;
    prevLine = c.line;
    if (signed || jump) { cur = { items: [], lastValue: -1 }; blocks.push(cur); }
    if (!cur || c.value <= cur.lastValue) {
      // ย่อหน้าที่ขึ้นต้น "มาตรา X" ซึ่ง X ย้อนกลับเล็กน้อย แต่ไม่ใช่มาตรา ๑ → น่าจะเป็นข้อความอ้างถึง ไม่ใช่หัวมาตรา
      if (cur && c.value > 1.0001 && cur.items.length && c.value < cur.lastValue && cur.lastValue - c.value < 50 && Math.floor(c.value) !== 1) {
        const prev = cur.items[cur.items.length - 1];
        if (prev && c.line - prev.line < 40) continue;
      }
      cur = { items: [], lastValue: -1 }; blocks.push(cur);
    }
    cur.items.push(c); cur.lastValue = c.endValue;
  }

  // ตัวบทหลัก = ชุดช่วงที่เลขต่อกันขึ้นไปเรื่อย ๆ และมีมาตรารวมมากที่สุด (เช่น ป.พ.พ. บรรพ ๑–๖ คั่นด้วยพระราชกฤษฎีกาให้ใช้)
  const n = blocks.length, best = new Array(n), prevIdx = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    best[i] = blocks[i].items.length;
    for (let j = 0; j < i; j++) {
      const lastJ = blocks[j].items[blocks[j].items.length - 1].endValue;
      const gapJ = blocks[i].items[0].value - lastJ;
      if (gapJ > 0 && gapJ <= 30 && best[j] + blocks[i].items.length > best[i]) { best[i] = best[j] + blocks[i].items.length; prevIdx[i] = j; }
    }
  }
  let endIdx = 0; for (let i = 1; i < n; i++) if (best[i] > best[endIdx]) endIdx = i;
  const mainSet = new Set(); for (let i = n ? endIdx : -1; i >= 0; i = prevIdx[i]) mainSet.add(i);

  // ขอบเขตบรรทัดของแต่ละมาตรา: ถึงหัวมาตราถัดไป / บรรทัดลงนาม / หมายเหตุ
  const all = []; blocks.forEach((b, bi) => b.items.forEach(it => all.push({ ...it, block: bi })));
  all.sort((a, b) => a.line - b.line);
  const firstLine = all.length ? all[0].line : lines.length;
  const units = [];
  const headingsBetween = (from, to, block) => {
    // หัวข้อ (บรรพ/ลักษณะ/หมวด/ส่วน) ในช่องว่างระหว่างมาตรา · ชื่อหัวข้ออาจอยู่บรรทัดถัดไป
    for (let i = from; i < to; i++) {
      const t = lines[i].trim();
      if (!t || (i > 0 && !blank(lines[i - 1]) && !HEAD_RE.test(lines[i - 1].trim()))) continue;
      const m = HEAD_RE.exec(t);
      if (!m || t.length > 90) continue;
      let title = t, j = i + 1;
      if (/^(ภาค|บรรพ|ลักษณะ|หมวด|ส่วนที่|ส่วน)\s*[๐-๙0-9]+(\[[๐-๙0-9]+\])*$/.test(t)) {
        while (j < to && blank(lines[j])) j++;
        if (j < to && lines[j].trim().length <= 80 && !lines[j].trim().startsWith('มาตรา') && !HEAD_RE.test(lines[j].trim())) { title = t + ' ' + lines[j].trim(); i = j; }
      }
      const notes = [...title.matchAll(/\[([๐-๙0-9]+)\]/g)].map(x => thToArabic(x[1]));
      units.push({ block, kind: 'heading', level: m[1], heading: clean(title.replace(/\[[๐-๙0-9]+\]/g, '')), body: '', notes });
    }
  };
  const blockIntro = {};
  for (let k = 0; k < all.length; k++) {
    const s = all[k], next = all[k + 1];
    let end = next ? next.line : lines.length, endMarker = -1;
    for (let i = s.line + 1; i < end; i++) { if (END_RE.test(lines[i].trim())) { endMarker = i; break; } }
    const stop = endMarker >= 0 ? endMarker : end;
    // หัวข้อที่ติดท้ายมาตรา (ก่อนหัวมาตราถัดไป) ไม่ใช่เนื้อมาตรา → ตัดออก
    let bodyEnd = stop;
    if (endMarker < 0 && next && next.block === s.block) {
      for (let i = s.line + 1; i < stop; i++) {
        const t = lines[i].trim();
        if (HEAD_RE.test(t) && t.length <= 90 && blank(lines[i - 1])) { bodyEnd = i; break; }
      }
    }
    const notes = [...s.refs.matchAll(/\[([๐-๙0-9]+)\]/g)].map(x => thToArabic(x[1]));
    const bodyText = paragraphs([s.rest, ...lines.slice(s.line + 1, bodyEnd)]);
    units.push({ block: s.block, kind: 'section', key: sectionKey(s.number, s.suffix) + (s.to ? '-' + thToArabic(s.to) : ''), number: `มาตรา ${s.number}${s.suffix ? ' ' + s.suffix : ''}${s.to ? ' ถึงมาตรา ' + s.to : ''}`, value: s.value, heading: '', body: bodyText, notes, line: s.line });
    if (bodyEnd < stop) headingsBetween(bodyEnd, stop, s.block);
    // ข้อความหลังบรรทัดลงนามถึงมาตราถัดไปของช่วงอื่น = หัวเรื่อง/คำปรารภของช่วงนั้น
    if (endMarker >= 0 && next && next.block !== s.block) blockIntro[next.block] = paragraphs(lines.slice(endMarker, next.line));
    else if (next && next.block !== s.block && !blockIntro[next.block]) blockIntro[next.block] = paragraphs(lines.slice(bodyEnd, next.line));
  }
  // หัวข้อก่อนมาตราแรกของแต่ละช่วงหลัก
  const firstOfBlock = {};
  all.forEach(s => { if (!(s.block in firstOfBlock)) firstOfBlock[s.block] = s.line; });

  // ชื่อช่วงที่แนบท้าย: บรรทัดที่ขึ้นต้นด้วยประเภทกฎหมาย เช่น "พระราชบัญญัติคุ้มครองผู้บริโภค (ฉบับที่ ๒) พ.ศ. ๒๕๔๑[๙๐]"
  const blockInfo = blocks.map((b, bi) => {
    const intro = blockIntro[bi] || (bi === all[0]?.block ? '' : '');
    const t = (intro.split('\n').map(x => x.trim()).find(x => /^(พระราชบัญญัติ|พระราชกำหนด|พระราชกฤษฎีกา|ประกาศ|คำสั่ง|ประมวลกฎหมาย|รัฐธรรมนูญ)/.test(x)) || '');
    const notes = [...t.matchAll(/\[([๐-๙0-9]+)\]/g)].map(x => thToArabic(x[1]));
    const title = clean(t.replace(/\[[๐-๙0-9]+\]/g, '')).slice(0, 300);
    return { id: bi, main: mainSet.has(bi), title, notes, first: b.items[0].number, last: b.items[b.items.length - 1].number, count: b.items.length };
  });

  // แทรกหัวข้อที่อยู่ก่อนมาตราแรกของช่วงหลัก (เช่น "บรรพ ๑ หลักทั่วไป" "ลักษณะ ๑ ...")
  const pre = [];
  for (const [bi, ln] of Object.entries(firstOfBlock)) {
    if (!mainSet.has(Number(bi))) continue;
    let from = ln - 1;
    while (from > 0 && !END_RE.test(lines[from].trim()) && !(ln - from > 40)) from--;
    const tmp = units.length; headingsBetween(from + 1, ln, Number(bi));
    const added = units.splice(tmp);
    // ตัดหัวข้อที่เป็นชื่อพระราชกฤษฎีกา/ชื่อกฎหมาย (ไม่ใช่โครงสร้างบรรพ/ลักษณะ)
    pre.push({ before: ln, items: added.filter(u => /^(ภาค|บรรพ|ลักษณะ|หมวด|ส่วน|บท)/.test(u.heading)) });
  }
  // เรียงตามตำแหน่งบรรทัด: หัวข้อก่อนมาตรา
  const ordered = [];
  const sections = units.filter(u => u.kind === 'section');
  const headsAfter = new Map();   // หัวข้อที่อยู่หลังมาตรา i
  let si = -1;
  for (const u of units) { if (u.kind === 'section') si++; else { if (!headsAfter.has(si)) headsAfter.set(si, []); headsAfter.get(si).push(u); } }
  const preMap = new Map(pre.map(p => [p.before, p.items]));
  sections.forEach((s, i) => {
    if (preMap.has(s.line)) ordered.push(...preMap.get(s.line));
    ordered.push(s);
    if (headsAfter.has(i)) ordered.push(...headsAfter.get(i));
  });

  const preamble = paragraphs(lines.slice(0, firstLine));
  // ราชกิจจาฯ ฉบับแรก = เชิงอรรถอ้างอิงราชกิจจาฯ ตัวแรก
  let gazette = null;
  for (const k of Object.keys(footnotes).sort((a, b) => a - b)) { const g = parseGazette(footnotes[k]); if (g) { gazette = { ...g, note: k }; break; } }
  // ฉบับแก้ไขเพิ่มเติม: ช่วงที่แนบท้ายซึ่งมีชื่อเป็น "(ฉบับที่ n)" หรือ "แก้ไขเพิ่มเติม"
  const amendments = blockInfo.filter(b => !b.main && /ฉบับที่|แก้ไขเพิ่มเติม/.test(b.title)).map(b => {
    const y = /(?:พ\.ศ\.|พุทธศักราช)\s*([๐-๙0-9]{4})/.exec(b.title);
    const g = b.notes.map(nn => footnotes[nn] && parseGazette(footnotes[nn])).find(Boolean) || null;
    return { title: b.title, yearBE: y ? Number(thToArabic(y[1])) : null, gazette: g, block: b.id };
  });

  // คุณภาพการแบ่ง: ช่องว่างของเลขมาตราในตัวบทหลัก (ข้ามเกิน 1 เลข) เพื่อให้แอดมินเห็นว่าต้องตรวจ
  const mainSecs = ordered.filter(u => u.kind === 'section' && mainSet.has(u.block));
  let gaps = 0; const gapList = [];
  for (let i = 1; i < mainSecs.length; i++) {
    const pk = mainSecs[i - 1].key, a = Math.floor(pk.includes('-') ? Number(pk.split('-')[1].split('/')[0]) : mainSecs[i - 1].value), b = Math.floor(mainSecs[i].value);
    if (b - a > 1) { gaps += b - a - 1; if (gapList.length < 20) gapList.push(`${a}→${b}`); }
  }
  ordered.forEach(u => { delete u.line; });
  return {
    preamble, units: ordered, blocks: blockInfo, footnotes, gazette, amendments,
    quality: {
      sections: sections.length, mainSections: mainSecs.length, blocks: blocks.length,
      first: mainSecs[0]?.key || null, last: mainSecs[mainSecs.length - 1]?.key || null,
      gaps, gapList, footnotes: Object.keys(footnotes).length,
    },
  };
}

// ข้อมูลจากชื่อ: ประเภทเอกสาร · ปี พ.ศ. · ชื่อที่ทำให้เป็นรูปแบบเดียว (ใช้กันซ้ำ)
const TYPE_MAP = [
  [/^รัฐธรรมนูญ/, 'constitution'], [/^ประมวล/, 'code'], [/^พระราชบัญญัติประกอบรัฐธรรมนูญ/, 'act'], [/^พระราชบัญญัติ/, 'act'],
  [/^พระราชกำหนด/, 'royal_ordinance'], [/^พระราชกฤษฎีกา/, 'royal_decree'], [/^กฎกระทรวง/, 'ministerial_reg'],
  [/^ประกาศ/, 'notification'], [/^ระเบียบ/, 'regulation'], [/^ข้อบังคับ/, 'rule'], [/^(คำวินิจฉัย|คำพิพากษา)/, 'decision'], [/^พระธรรมนูญ/, 'act'],
];
export function titleInfo(rawTitle) {
  const title = clean(String(rawTitle).replace(/\(\s*ฉบับ\s*Update\s*ล่าสุด\s*\)/i, '').replace(/\s+/g, ' '));
  const docType = (TYPE_MAP.find(([re]) => re.test(title)) || [null, 'other'])[1];
  const y = /(?:พ\.ศ\.|พุทธศักราช)\s*([๐-๙0-9]{4})/.exec(title);
  const yearBE = y ? Number(thToArabic(y[1])) : null;
  const titleNorm = thToArabic(title).replace(/พุทธศักราช/g, 'พ.ศ.').replace(/พ\.ศ\.\s*/g, 'พ.ศ. ').replace(/[\s"“”]+/g, ' ').trim().toLowerCase();
  return { title, docType, yearBE, titleNorm };
}

export const DOC_TYPES = {
  constitution: 'รัฐธรรมนูญ', code: 'ประมวลกฎหมาย', act: 'พระราชบัญญัติ', royal_ordinance: 'พระราชกำหนด',
  royal_decree: 'พระราชกฤษฎีกา', ministerial_reg: 'กฎกระทรวง', notification: 'ประกาศ', regulation: 'ระเบียบ',
  rule: 'ข้อบังคับ', decision: 'คำวินิจฉัย', other: 'อื่น ๆ',
};
