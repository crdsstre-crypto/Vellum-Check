// ตัวกรองถ้อยคำก่อนส่งผลให้ผู้ใช้ (ชั้นสุดท้ายหลัง AI)
// เป้าหมาย: ระบบต้องไม่ "ฟันธง" แทนทนาย — ไม่บอกว่าผิดกฎหมาย/โมฆะ/ปลอดภัย/เซ็นได้แบบเด็ดขาด
// - แก้เฉพาะช่องคำอธิบายที่ AI เขียน · ห้ามแตะ quote (ต้องตรงกับสัญญาทุกตัวอักษร)
// - คำที่มี "อาจ" นำหน้าอยู่แล้วจะไม่ถูกแก้ซ้ำ · ชื่อกฎหมาย "ข้อสัญญาที่ไม่เป็นธรรม" ไม่ถูกแก้
// - นับจำนวนครั้งที่แก้ไว้ใน result.guard (ใช้ดูว่าคำสั่ง AI ต้องปรับไหม)

const NOT_MAYBE = '(?<!อาจ\\s?)(?<!อาจจะ\\s?)(?<!อาจถือว่า\\s?)(?<!อาจเข้าข่าย\\s?)';

const RULES = [
  // ฟันธงเรื่องกฎหมาย
  [new RegExp(NOT_MAYBE + '(?:เป็นการ)?ผิดกฎหมาย(?:แน่นอน|อย่างชัดเจน|ชัดเจน)?', 'g'), 'อาจขัดต่อกฎหมาย (ควรให้ทนายยืนยัน)'],
  [new RegExp(NOT_MAYBE + '(?:ถือว่า)?เป็นโมฆะ(?:แน่นอน|ทันที)?', 'g'), 'อาจไม่มีผลใช้บังคับ (ควรให้ทนายยืนยัน)'],
  [new RegExp(NOT_MAYBE + '(?:จะ)?ใช้บังคับไม่ได้', 'g'), 'อาจใช้บังคับไม่ได้'],
  [new RegExp(NOT_MAYBE + '(?<!ข้อสัญญาที่)(?<!ว่าด้วยข้อสัญญาที่)ไม่เป็นธรรม', 'g'), 'อาจไม่เป็นธรรม'],
  // รับรองว่าปลอดภัย / ให้เซ็น
  [/(?:สัญญา|ข้อ)นี้ปลอดภัย(?:แล้ว|ดี)?/g, 'ไม่พบจุดเด่นที่ต้องระวังในข้อนี้ (ไม่ได้แปลว่าปลอดภัยเสมอไป)'],
  [/(?:สามารถ)?(?:เซ็น|ลงนาม|ลงชื่อ)(?:ได้เลย|ได้ทันที|ได้อย่างสบายใจ|ได้โดยไม่ต้องกังวล)/g, 'ตัดสินใจได้หลังอ่านทวนทั้งฉบับ'],
  [/ไม่ต้อง(?:ปรึกษา|จ้าง|ถาม)ทนาย(?:ความ)?/g, 'หากมีข้อสงสัยควรปรึกษาทนายความ'],
  [/(?:ชนะ|แพ้)คดี(?:แน่นอน|แน่ๆ|แน่ ๆ|ได้แน่)/g, 'ผลทางคดีขึ้นกับข้อเท็จจริง ควรปรึกษาทนายความ'],
  [/(?:ไม่มีความเสี่ยง(?:ใด ?ๆ)?(?:เลย)?|ไม่มีปัญหาแน่นอน|รับประกันได้)/g, 'ไม่พบความเสี่ยงเด่นจากข้อความนี้ (ไม่ได้แปลว่าไม่มีความเสี่ยง)'],
];

const EN_RULES = [
  [/\b(?<!may be |might be |could be )(clearly |definitely )?illegal\b/gi, 'possibly unlawful (confirm with a lawyer)'],
  [/\b(?<!may be |might be |could be )(null and )?void\b/gi, 'possibly unenforceable (confirm with a lawyer)'],
  [/\bsafe to sign\b/gi, 'best decided after reading the whole contract'],
  [/\bno need (?:for|to see|to consult) a lawyer\b/gi, 'consult a lawyer if unsure'],
];

export function soften(s, counter) {
  if (typeof s !== 'string' || !s) return s;
  let out = s;
  for (const [re, rep] of RULES.concat(EN_RULES)) {
    out = out.replace(re, () => { if (counter) counter.n++; return rep; });
  }
  return out;
}

const ITEM_FIELDS = ['title', 'topic', 'explanation', 'suggested_fix', 'how_to_negotiate', 'impact', 'urgency_note', 'uncertainty', 'reference'];

export function guardResult(result) {
  if (!result || typeof result !== 'object') return result;
  const c = { n: 0 };
  if (Array.isArray(result.items)) {
    result.items.forEach(it => { if (it && typeof it === 'object') ITEM_FIELDS.forEach(f => { if (typeof it[f] === 'string') it[f] = soften(it[f], c); }); });
  }
  if (result.summary && typeof result.summary === 'object') {
    for (const k of Object.keys(result.summary)) if (typeof result.summary[k] === 'string') result.summary[k] = soften(result.summary[k], c);
  }
  if (Array.isArray(result.missing_info)) result.missing_info = result.missing_info.map(x => soften(x, c));
  if (Array.isArray(result.obligations)) result.obligations.forEach(o => { if (o && typeof o.what === 'string') o.what = soften(o.what, c); });
  if (c.n) { result.guard = (result.guard || 0) + c.n; console.log(`[guard] softened ${c.n} phrase(s)`); }
  return result;
}

// ใช้กับข้อความอิสระ (ถามต่อ / อธิบายข้อ) — รับได้ทั้ง string และ object ที่มีค่า string
export function guardAny(v) {
  const c = { n: 0 };
  const walk = x => typeof x === 'string' ? soften(x, c)
    : Array.isArray(x) ? x.map(walk)
    : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, val]) => [k, /quote/i.test(k) ? val : walk(val)]))
    : x;
  const out = walk(v);
  if (c.n) console.log(`[guard] softened ${c.n} phrase(s) in free text`);
  return out;
}
