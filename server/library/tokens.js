// ตัดคำภาษาไทยสำหรับดัชนีค้นหา (Postgres ตัดคำไทยเองไม่ได้)
// ใช้ Intl.Segmenter ที่มากับ Node อยู่แล้ว · แปลงเลขไทยเป็นอารบิก เพื่อให้ "มาตรา ๖๓" กับ "มาตรา 63" ค้นเจอเหมือนกัน
import { thToArabic } from './parse.js';

const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;

export function tokenize(text, max = 60000) {
  const s = thToArabic(String(text || '')).toLowerCase().slice(0, max);
  if (!seg) return s.replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ').trim();
  const out = [];
  for (const p of seg.segment(s)) {
    if (!p.isWordLike) continue;
    const w = p.segment.replace(/[^\p{L}\p{N}\p{M}/]+/gu, '');
    if (w) out.push(w);
  }
  return out.join(' ');
}
