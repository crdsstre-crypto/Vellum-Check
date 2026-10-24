/* =====================================================
   ศัพท์น่ารู้ (Glossary) — คำอธิบายศัพท์กฎหมายแบบเข้าใจง่าย + แหล่งอ้างอิง
   หลักการ (ตามที่วางไว้):
   1. คำอธิบายและแหล่งอ้างอิงเป็นข้อมูลที่เราเขียนและตรวจเอง ไม่ได้ให้ AI สร้าง
      จึงไม่มีลิงก์หรือมาตราที่ AI เดาขึ้นมา
   2. ลิงก์ชี้ไปที่เว็บไซต์ทางการของหน่วยงานเท่านั้น (หน้าแรก) ส่วนมาตราแสดงเป็นข้อความ
      ให้ผู้ใช้ค้นต่อในฉบับทางการ
   3. ถ้าไม่มีคำศัพท์ที่ตรงกับผลตรวจ จะไม่แสดงการ์ดนี้เลย
   วิธีเพิ่มคำใหม่: เพิ่มรายการใน TERMS (kw = คำที่ใช้จับในผลตรวจ)
   ===================================================== */

const GLOSS_SOURCES = {
  ocpb:     { name: 'สำนักงานคณะกรรมการคุ้มครองผู้บริโภค (สคบ.)', url: 'https://www.ocpb.go.th' },
  oja:      { name: 'สำนักงานกิจการยุติธรรม',                     url: 'https://www.oja.go.th' },
  orst:     { name: 'ราชบัณฑิตยสภา',                              url: 'https://www.orst.go.th' },
  krisdika: { name: 'สำนักงานคณะกรรมการกฤษฎีกา',                  url: 'https://www.krisdika.go.th' },
};

const GLOSS_TERMS = [
  {
    id: 'lessor', ex: 'ผู้ให้เช่าเป็นเจ้าของห้อง ผู้เช่าเป็นคนเข้าอยู่และจ่ายค่าเช่ารายเดือน', tap: false, name: 'ผู้ให้เช่า / ผู้เช่า', kw: ['ผู้ให้เช่า', 'ผู้เช่า', 'ค่าเช่า', 'สัญญาเช่า'],
    text: 'ผู้ให้เช่าคือฝ่ายที่นำทรัพย์สินออกให้ใช้ ผู้เช่าคือฝ่ายที่จ่ายค่าเช่าเพื่อใช้ทรัพย์สินนั้น แต่ละฝ่ายมีสิทธิและหน้าที่ตามที่เขียนไว้ในสัญญา',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ ลักษณะเช่าทรัพย์ (เริ่มที่มาตรา 537)', src: 'krisdika' }, { src: 'ocpb' }],
  },
  {
    id: 'deposit', ex: 'ผู้เช่าวางเงินประกัน 2 เดือน สัญญาควรบอกว่าจะคืนภายในกี่วันหลังส่งมอบห้อง และหักอะไรได้บ้าง', name: 'เงินประกัน', kw: ['เงินประกัน', 'ประกันการเช่า'],
    text: 'เงินที่วางไว้เพื่อประกันว่าจะทำตามสัญญา เงื่อนไขการหักและการคืนเงินต้องดูจากสัญญาเป็นหลัก ควรตรวจว่าเขียนกำหนดคืนและเหตุที่หักได้ไว้ชัดเจนหรือไม่',
    refs: [{ src: 'ocpb' }, { src: 'oja' }],
  },
  {
    id: 'earnest', ex: 'ผู้ซื้อวางมัดจำ 10,000 บาทตอนจองสินค้า สัญญาควรบอกว่าเมื่อใดมัดจำจะถูกริบหรือต้องคืน', name: 'เงินมัดจำ', kw: ['มัดจำ'],
    text: 'เงินที่ให้ไว้ล่วงหน้าเพื่อเป็นหลักฐานว่ามีสัญญากันแล้ว และเป็นประกันว่าจะปฏิบัติตามสัญญา มัดจำแตกต่างจากเงินประกันตรงที่กฎหมายกำหนดผลไว้ว่าเมื่อไม่ปฏิบัติตามสัญญาจะเกิดอะไรขึ้นกับเงินนั้น',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 377', src: 'krisdika' }],
  },
  {
    id: 'penalty', ex: 'สัญญาเขียนว่าส่งงานช้าปรับวันละ 500 บาท ควรดูว่ามีเพดานรวมหรือไม่', name: 'เบี้ยปรับ', kw: ['เบี้ยปรับ', 'ค่าปรับ'],
    text: 'เงินที่ตกลงกันไว้ล่วงหน้าว่าจะต้องจ่ายหากไม่ทำตามสัญญา ถ้าสูงเกินส่วน ศาลมีอำนาจลดลงได้ จึงควรอ่านว่าตั้งอัตราไว้เท่าใดและเริ่มนับเมื่อไร',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 379 และ 383', src: 'krisdika' }],
  },
  {
    id: 'damages', ex: 'ถ้าของที่ส่งมอบชำรุดจนอีกฝ่ายต้องซ่อมเอง ค่าซ่อมอาจเป็นค่าเสียหายที่เรียกได้ตามสัญญาและกฎหมาย', tap: false, name: 'ค่าเสียหาย / ค่าสินไหมทดแทน', kw: ['ค่าเสียหาย', 'ค่าสินไหม', 'ชดใช้', 'เสียหาย'],
    text: 'เงินที่ฝ่ายหนึ่งต้องชดใช้ให้อีกฝ่ายจากความเสียหายที่เกิดขึ้น ควรดูว่าสัญญากำหนดเพดานหรือขอบเขตไว้หรือไม่ และครอบคลุมความเสียหายประเภทใดบ้าง',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 222', src: 'krisdika' }],
  },
  {
    id: 'default', ex: 'ถึงกำหนดจ่ายค่าเช่าวันที่ 5 แต่ยังไม่จ่าย อาจถือว่าผิดนัดตามเงื่อนไขในสัญญา', name: 'ผิดนัด', kw: ['ผิดนัด', 'ผิดสัญญา', 'การผิดสัญญา'],
    text: 'การที่ลูกหนี้ไม่ชำระหรือไม่ทำตามสัญญาเมื่อถึงกำหนด ผลของการผิดนัดมักมีทั้งดอกเบี้ย ค่าปรับ และสิทธิบอกเลิกสัญญา ควรตรวจว่าสัญญาเปิดโอกาสให้แก้ไขก่อนหรือไม่',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 204', src: 'krisdika' }],
  },
  {
    id: 'terminate', ex: 'สัญญาให้ผู้เช่าบอกเลิกล่วงหน้า 30 วัน ควรเช็กว่าผู้ให้เช่ามีสิทธิแบบเดียวกันหรือไม่', tap: false, name: 'การบอกเลิกสัญญา', kw: ['บอกเลิก', 'เลิกสัญญา', 'ยกเลิกสัญญา', 'ยกเลิกกลางคัน'],
    text: 'การแจ้งยุติสัญญาก่อนครบกำหนด สัญญามักกำหนดเหตุ ระยะเวลาแจ้งล่วงหน้า และผลทางการเงิน เช่น การคืนเงินหรือค่าชดเชย ควรเช็กว่าทั้งสองฝ่ายมีสิทธิเท่ากันหรือไม่',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 386', src: 'krisdika' }],
  },
  {
    id: 'wear', ex: 'สีผนังซีดลงตามอายุการใช้งาน อาจแตกต่างจากความเสียหายที่เกิดจากการกระทำของผู้เช่า', name: 'การเสื่อมสภาพตามการใช้งานปกติ', kw: ['เสื่อมสภาพ', 'สึกหรอ', 'ใช้งานตามปกติ'],
    text: 'การเปลี่ยนแปลงของทรัพย์สินที่เกิดจากการใช้งานตามปกติ ซึ่งควรแยกพิจารณาจากความเสียหายที่เกิดจากการกระทำของผู้เช่า',
    refs: [{ src: 'ocpb' }, { src: 'orst' }],
  },
  {
    id: 'interest', ex: 'กู้ 100,000 บาท ดอกเบี้ยร้อยละ 12 ต่อปี ควรดูว่าคิดจากเงินต้นเต็มหรือจากยอดคงเหลือ', name: 'ดอกเบี้ย', kw: ['ดอกเบี้ย'],
    text: 'ค่าตอบแทนที่จ่ายเพิ่มจากเงินต้นตามระยะเวลาที่ยืมหรือค้างชำระ กฎหมายจำกัดอัตราดอกเบี้ยของการกู้ยืมไว้ ควรตรวจว่าสัญญาระบุอัตราต่อปีและวิธีคิดไว้ชัดเจนหรือไม่',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 654 และ พ.ร.บ.ห้ามเรียกดอกเบี้ยเกินอัตรา', src: 'krisdika' }],
  },
  {
    id: 'hire', ex: 'จ้างทำเว็บไซต์ ควรกำหนดไว้ว่าแก้งานได้กี่ครั้ง และจ่ายเงินเป็นงวดอย่างไร', name: 'สัญญาจ้างทำของ', kw: ['จ้างทำของ', 'ผู้รับจ้าง', 'ผู้ว่าจ้าง', 'ส่งมอบงาน', 'รับมอบงาน'],
    text: 'สัญญาที่ผู้รับจ้างตกลงทำงานให้สำเร็จ และผู้ว่าจ้างตกลงจ่ายค่าจ้างเมื่อได้รับผลงาน ควรดูขอบเขตงาน กำหนดส่งมอบ จำนวนครั้งที่แก้ได้ และเงื่อนไขการจ่ายเงิน',
    refs: [{ label: 'ประมวลกฎหมายแพ่งและพาณิชย์ ลักษณะจ้างทำของ (เริ่มที่มาตรา 587)', src: 'krisdika' }],
  },
  {
    id: 'copyright', ex: 'จ้างออกแบบโลโก้ สัญญาควรบอกว่าลิขสิทธิ์โอนให้ผู้ว่าจ้าง หรือผู้ออกแบบยังเป็นเจ้าของ', name: 'ลิขสิทธิ์', kw: ['ลิขสิทธิ์', 'ทรัพย์สินทางปัญญา'],
    text: 'สิทธิของผู้สร้างสรรค์งาน เช่น งานเขียนหรืองานออกแบบ ในการอนุญาตหรือโอนให้ผู้อื่นใช้ ควรอ่านว่าสัญญาโอนลิขสิทธิ์ทั้งหมดหรือแค่อนุญาตให้ใช้ และเริ่มโอนเมื่อใด',
    refs: [{ label: 'พระราชบัญญัติลิขสิทธิ์ พ.ศ. 2537', src: 'krisdika' }],
  },
  {
    id: 'unfair', ex: 'ข้อที่เขียนว่าฝ่ายหนึ่งไม่ต้องรับผิดชอบในทุกกรณี อาจเป็นข้อที่ควรตรวจละเอียด', name: 'ข้อสัญญาที่ไม่เป็นธรรม', kw: ['ไม่เป็นธรรม', 'เอาเปรียบ', 'ข้อยกเว้นความรับผิด', 'ยกเว้นความรับผิด'],
    text: 'ข้อตกลงที่ทำให้ฝ่ายหนึ่งเสียเปรียบเกินสมควร ในสัญญาสำเร็จรูปหรือสัญญาที่ฝ่ายหนึ่งกำหนดเงื่อนไขเอง กฎหมายให้ศาลใช้ดุลพินิจจำกัดข้อนั้นได้ เครื่องมือนี้ไม่ตัดสินว่าข้อใดไม่เป็นธรรม ใช้เพื่อชี้จุดให้ตรวจเท่านั้น',
    refs: [{ label: 'พ.ร.บ.ว่าด้วยข้อสัญญาที่ไม่เป็นธรรม พ.ศ. 2540', src: 'krisdika' }, { src: 'ocpb' }],
  },
  {
    id: 'nda', ex: 'ตกลงไม่เปิดเผยรายชื่อลูกค้าของบริษัทเป็นเวลา 2 ปี ควรดูว่าข้อมูลใดไม่ถือเป็นความลับ', name: 'ข้อมูลลับ / สัญญารักษาความลับ (NDA)', kw: ['ข้อมูลลับ', 'รักษาความลับ', 'NDA'],
    text: 'สัญญาที่ให้คู่สัญญาไม่เปิดเผยข้อมูลบางประเภท ควรดูว่าข้อมูลลับหมายถึงอะไร มีข้อยกเว้นอะไรบ้าง คุ้มครองนานเท่าใด และมีค่าเสียหายเท่าใดหากรั่วไหล',
    refs: [{ src: 'oja' }],
  },
];

const GLOSS_MAX = 4;

// รวมข้อความทั้งหมดในผลตรวจ แล้วหาคำศัพท์ที่เกี่ยวข้อง
function glossaryMatches(result) {
  const parts = [];
  (Array.isArray(result?.items) ? result.items : []).forEach(it => {
    parts.push(it.title, it.explanation, it.quote, it.reference, it.suggested_fix);
  });
  (Array.isArray(result?.missing_info) ? result.missing_info : []).forEach(m => parts.push(m));
  const hay = parts.filter(Boolean).join(' ');
  if (!hay) return [];

  const hits = [];
  for (const t of GLOSS_TERMS) {
    const found = t.kw.filter(k => hay.includes(k));
    if (found.length) hits.push({ term: t, score: found.length });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, GLOSS_MAX).map(h => h.term);
}

function glossRef(r) {
  const s = GLOSS_SOURCES[r.src];
  if (!s) return '';
  const label = r.label ? `<span class="gl-law">${esc(r.label)}</span>` : '';
  return `<li>${label}<a class="gl-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} <i aria-hidden="true">↗</i></a></li>`;
}

function renderGlossary(result) {
  const terms = glossaryMatches(result);
  if (!terms.length) return '';
  const ICO_BOOK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.5C10.5 5.3 8.5 4.7 5 4.7v13c3.5 0 5.5.6 7 1.8 1.5-1.2 3.5-1.8 7-1.8v-13c-3.5 0-5.5.6-7 1.8zM12 6.5v13"/></svg>';
  return `<section class="gloss" aria-label="ศัพท์น่ารู้">
    <header class="gl-head">
      <span class="gl-ico">${ICO_BOOK}</span>
      <div class="gl-title"><h3>ศัพท์น่ารู้</h3><p>คำศัพท์จากผลตรวจสัญญาฉบับนี้</p></div>
      <span class="gl-count">${terms.length} คำ</span>
    </header>
    ${terms.map((t, i) => `<details class="gl-term">
      <summary><b>${i + 1}. ${esc(t.name)}</b></summary>
      <p class="gl-text">${esc(t.text)}</p>
      <p class="gl-reflbl">แหล่งอ้างอิง</p>
      <ul class="gl-refs">${t.refs.map(glossRef).join('')}</ul>
    </details>`).join('')}
    <p class="gl-note">ตัวอย่างคำอธิบายเพื่อการเรียนรู้ ไม่ใช่คำวินิจฉัยทางกฎหมายสำหรับทุกกรณี ลิงก์ไปยังเว็บไซต์ทางการของหน่วยงาน ส่วนมาตราให้ค้นต่อในฉบับทางการและตรวจว่ายังมีผลใช้บังคับ</p>
  </section>`;
}


/* ---------- แตะคำศัพท์ในผลตรวจ → เปิดคำอธิบายทันที (bottom sheet) ---------- */

// ส่วนของผลตรวจที่ทำให้แตะได้ (ไม่รวมหัวข้อใน <summary> เพราะแตะแล้วต้องพับ/กางรายการ)
// ขีดเส้นใต้เฉพาะคำที่เข้าใจยาก (ไม่ใส่ tap:false) ในคำอธิบายเหตุผล สรุป และรายการที่ไม่พบ
// ไม่ขีดในข้อความต้นฉบับ (.hl-quote) เพราะมีสีเน้นความเสี่ยงอยู่แล้ว
const GLOSS_TAP_AREAS = '.it-text, .it-detail, .brief p, .miss li';
// ต่อหนึ่งรายการความเสี่ยง ขีดเส้นใต้ไม่เกินนี้ และแต่ละคำขีดแค่ครั้งแรก
const GLOSS_TAP_PER_GROUP = 2;

function glossKeywordIndex() {
  const map = new Map();
  GLOSS_TERMS.filter(t => t.tap !== false).forEach(t => t.kw.forEach(k => { if (!map.has(k)) map.set(k, t.id); }));
  const words = [...map.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  return { map, re };
}

// ครอบคำศัพท์ด้วยปุ่มขีดเส้นใต้สีทอง แต่ละคำศัพท์ครอบแค่ครั้งแรกในแต่ละย่อหน้า
function linkifyGlossary(root) {
  if (!root) return;
  const { map, re } = glossKeywordIndex();
  const groups = new Map();
  root.querySelectorAll(GLOSS_TAP_AREAS).forEach(area => {
    const g = area.closest('details.item') || area.closest('.brief') || area.closest('.miss') || root;
    if (!groups.has(g)) groups.set(g, new Set());
    const seen = groups.get(g);
    const nodes = [];
    const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue;
      re.lastIndex = 0;
      let last = 0, m, frag = null;
      while ((m = re.exec(text))) {
        const id = map.get(m[0]);
        if (seen.has(id) || seen.size >= GLOSS_TAP_PER_GROUP) continue;
        seen.add(id);
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'gl-tap';
        b.dataset.gl = id;
        b.textContent = m[0];
        frag.appendChild(b);
        last = m.index + m[0].length;
      }
      if (frag) {
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  });
}


const GLOSS_ICO_BOOK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.5C10.5 5.3 8.5 4.7 5 4.7v13c3.5 0 5.5.6 7 1.8 1.5-1.2 3.5-1.8 7-1.8v-13c-3.5 0-5.5.6-7 1.8zM12 6.5v13"/></svg>';
const GLOSS_ICO_CHECK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.2 9.7"/></svg>';
const GLOSS_ICO_EXT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>';

// ปุ่มอ่านแหล่งอ้างอิงในหน้าต่างคำอธิบาย (ลิงก์ไปเว็บทางการเท่านั้น)
function glossSrcBtn(r) {
  const src = GLOSS_SOURCES[r.src];
  if (!src) return '';
  return `${r.label ? `<p class="gl-law">${esc(r.label)}</p>` : ''}
    <a class="gl-srcbtn" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">
      ${GLOSS_ICO_EXT}<span><b>อ่านแหล่งอ้างอิง</b><small>${esc(src.name)}</small></span><i aria-hidden="true">›</i>
    </a>`;
}

function closeGlossSheet() {
  const s = document.getElementById('glSheet');
  if (s) s.classList.remove('open');
}

function openGlossSheet(id) {
  const t = GLOSS_TERMS.find(x => x.id === id);
  if (!t) return;
  let s = document.getElementById('glSheet');
  if (!s) {
    s = document.createElement('div');
    s.id = 'glSheet';
    s.className = 'gl-sheet';
    s.innerHTML = '<div class="gl-back" data-glclose></div><div class="gl-panel" role="dialog" aria-modal="true" aria-labelledby="glSheetTitle"></div>';
    document.body.appendChild(s);
    s.addEventListener('click', e => { if (e.target.closest('[data-glclose]')) closeGlossSheet(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGlossSheet(); });
  }
  s.querySelector('.gl-panel').innerHTML =
    `<div class="gl-grab" aria-hidden="true"></div>
     <div class="gl-sh-head">
       <span class="gl-ico gl-ico-box">${GLOSS_ICO_BOOK}</span>
       <div class="gl-sh-title"><small>ศัพท์ในสัญญา</small><h3 id="glSheetTitle">${esc(t.name)}</h3></div>
       <button type="button" class="gl-x" data-glclose aria-label="ปิด">✕</button>
     </div>
     <hr class="gl-hr">
     <h4 class="gl-sec">ความหมายแบบเข้าใจง่าย</h4>
     <p class="gl-text gl-text-lg">${esc(t.text)}</p>
     ${t.ex ? `<div class="gl-ex"><b>${GLOSS_ICO_CHECK}ตัวอย่าง</b><p>${esc(t.ex)}</p></div>` : ''}
     <p class="gl-note">การพิจารณาจริงขึ้นอยู่กับข้อเท็จจริง เงื่อนไขในสัญญา และกฎหมายที่เกี่ยวข้อง คำที่ขีดเส้นใต้ไม่ได้แปลว่าเป็นความเสี่ยงของสัญญา</p>
     <div class="gl-srcs">${t.refs.map(glossSrcBtn).join('')}</div>`;
  s.classList.add('open');
}

document.addEventListener('click', e => {
  const b = e.target.closest('.gl-tap');
  if (b) { e.preventDefault(); openGlossSheet(b.dataset.gl); }
});
