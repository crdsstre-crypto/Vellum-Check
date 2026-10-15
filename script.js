// ===== กฎสำหรับตรวจสัญญา: แก้ไข/เพิ่มคำสำคัญได้ที่นี่ =====
const RULES = [
  {level:'high', label:'ค่าปรับ / เบี้ยปรับ', keys:['ค่าปรับ','เบี้ยปรับ','ค่าเสียหาย'], tip:'ตรวจว่าค่าปรับสูงเกินไปหรือไม่ และคิดอย่างไร'},
  {level:'high', label:'ต่ออายุอัตโนมัติ', keys:['ต่ออายุอัตโนมัติ','ต่ออายุโดยอัตโนมัติ','ต่อสัญญาโดยอัตโนมัติ'], tip:'ตรวจระยะเวลาแจ้งยกเลิกล่วงหน้า อาจเสียค่าบริการโดยไม่รู้ตัว'},
  {level:'high', label:'ไม่คืนเงิน', keys:['ไม่คืนเงิน','ไม่สามารถขอคืน','ไม่มีการคืน'], tip:'ถ้ายกเลิกแล้วจะไม่ได้เงินที่จ่ายไปคืน ควรพิจารณาให้ดี'},
  {level:'high', label:'สละสิทธิ์', keys:['สละสิทธิ์','สละสิทธิ','ตัดสิทธิ์'], tip:'ระบุสิทธิ์ที่ต้องสละ ซึ่งอาจกระทบสิทธิ์ของคุณ'},
  {level:'high', label:'เงินประกัน / มัดจำ', keys:['เงินประกัน','เงินมัดจำ','มัดจำ','ริบ'], tip:'ตรวจจำนวนเงิน เงื่อนไขการคืน และกรณีที่จะถูกหักหรือริบ'},
  {level:'mid', label:'การยกเลิกสัญญา', keys:['ยกเลิกสัญญา','บอกเลิกสัญญา','เลิกสัญญา','ยกเลิก','บอกกล่าวล่วงหน้า'], tip:'ตรวจเงื่อนไข ระยะเวลาแจ้ง และค่าใช้จ่ายในการยกเลิก'},
  {level:'mid', label:'ดอกเบี้ย', keys:['ดอกเบี้ย','อัตราดอกเบี้ย'], tip:'ตรวจอัตราดอกเบี้ยและวิธีคำนวณ'},
  {level:'mid', label:'ระยะเวลาผูกพัน', keys:['ผูกพัน','ระยะเวลาสัญญา','มีผลบังคับ','นับตั้งแต่','ถึงวันที่'], tip:'ตรวจระยะเวลาทั้งหมดและเงื่อนไขการต่อ'},
  {level:'mid', label:'การชำระเงิน', keys:['ชำระภายใน','ค่าเช่า','ค่าบริการ','ชำระเงิน'], tip:'ตรวจจำนวน วันที่ชำระ และโทษกรณีชำระล่าช้า'},
  {level:'mid', label:'ข้อยกเว้นความรับผิด', keys:['ไม่รับผิดชอบ','ไม่ต้องรับผิด','ไม่รับผิด','ปฏิเสธความรับผิด','สงวนสิทธิ์'], tip:'ดูว่าอีกฝ่ายพ้นความรับผิดในเรื่องใดบ้าง'},
  {level:'low', label:'การแก้ไขเปลี่ยนแปลง', keys:['แก้ไขเปลี่ยนแปลง','ปรับเปลี่ยน','เปลี่ยนแปลงข้อกำหนด'], tip:'ตรวจว่าอีกฝ่ายแก้ไขเงื่อนไขได้ฝ่ายเดียวหรือไม่'},
  {level:'low', label:'ข้อมูลส่วนบุคคล', keys:['ข้อมูลส่วนบุคคล','เปิดเผยข้อมูล'], tip:'ตรวจว่ามีการนำข้อมูลของคุณไปใช้หรือเปิดเผยต่อหรือไม่'},
  {level:'low', label:'กฎหมาย / เขตอำนาจศาล', keys:['เขตอำนาจศาล','กฎหมายที่ใช้บังคับ','อนุญาโตตุลาการ'], tip:'ดูว่าใช้กฎหมายและศาลของประเทศใด'},
  {level:'low', label:'การจดทะเบียน', keys:['จดทะเบียน','สำนักงานที่ดิน'], tip:'ตรวจว่ามีการจดทะเบียนหรือไม่ และใครรับผิดชอบค่าใช้จ่าย'}
];

const LABEL = {high:'ควรระวังมาก', mid:'ควรพิจารณา', low:'ควรสังเกต'};

// ===== ฟังก์ชันช่วยเหลือ =====
function esc(s){return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

function snippetOf(text, idx, len){
  const start = Math.max(0, idx-60), end = Math.min(text.length, idx+len+80);
  return (start>0?'...':'') + text.slice(start,end).trim() + (end<text.length?'...':'');
}

// ===== ตรรกะหลัก =====
function findHits(text){
  const found = [];
  RULES.forEach(rule=>{
    rule.keys.forEach(k=>{
      let pos = 0, idx;
      while((idx = text.indexOf(k, pos)) !== -1){
        found.push({rule, keyword:k, idx, len:k.length});
        pos = idx + k.length;
      }
    });
  });
  return found;
}

function groupByRule(found){
  const groups = {};
  found.forEach(f=>{
    const key = f.rule.label;
    if(!groups[key]) groups[key] = {rule:f.rule, hits:[]};
    groups[key].hits.push(f);
  });
  return groups;
}

function renderResult(text, box){
  const found = findHits(text);

  if(found.length === 0){
    box.innerHTML = '<p class="empty">✅ ไม่พบคำสำคัญที่ระบบตรวจไว้ ลองอ่านทั้งฉบับอีกครั้งเพื่อความมั่นใจ</p>';
    return;
  }

  const groups = groupByRule(found);
  const counts = {high:0, mid:0, low:0};
  Object.values(groups).forEach(g=>counts[g.rule.level]++);

  let html = `<div class="summary">
    <span class="badge" style="background:var(--high);color:var(--highText)">ระดับสูง ${counts.high}</span>
    <span class="badge" style="background:var(--mid);color:var(--midText)">ระดับกลาง ${counts.mid}</span>
    <span class="badge" style="background:var(--low);color:var(--lowText)">ระดับต่ำ ${counts.low}</span>
  </div>`;

  const order = {high:0, mid:1, low:2};
  Object.values(groups)
    .sort((a,b)=>order[a.rule.level]-order[b.rule.level])
    .forEach(g=>{
      const first = g.hits[0];
      const snip = snippetOf(text, first.idx, first.len);
      const snipHtml = esc(snip).replace(new RegExp(escRe(esc(first.keyword)),'g'), m=>`<mark>${m}</mark>`);
      html += `<div class="item ${g.rule.level}">
        <div class="tag">${LABEL[g.rule.level]} · พบ ${g.hits.length} จุด</div>
        <h3>${esc(g.rule.label)}</h3>
        <div>${esc(g.rule.tip)}</div>
        <div class="snippet">${snipHtml}</div>
      </div>`;
    });

  box.innerHTML = html;
}

// ===== ผูกเหตุการณ์กับปุ่ม =====
function init(){
  const input = document.getElementById('input');
  const box = document.getElementById('result');

  document.getElementById('checkBtn').addEventListener('click', ()=>{
    const text = input.value.trim();
    if(!text){ box.innerHTML = '<p class="empty">กรุณาวางข้อความสัญญาก่อน</p>'; return; }
    renderResult(text, box);
  });

  document.getElementById('clearBtn').addEventListener('click', ()=>{
    input.value = '';
    box.innerHTML = '<p class="empty">ยังไม่มีผลการตรวจ</p>';
  });
}

document.addEventListener('DOMContentLoaded', init);
