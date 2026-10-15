// ===== ตรรกะการทำงาน (ใช้ RULES จาก rules.js) =====
const LABEL = {high:'ควรระวังมาก', mid:'ควรพิจารณา', low:'ควรสังเกต'};
const ORDER = {high:0, mid:1, low:2};

function esc(s){return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

function snippetOf(text, idx, len){
  const start = Math.max(0, idx-60), end = Math.min(text.length, idx+len+80);
  return (start>0?'...':'') + text.slice(start,end).trim() + (end<text.length?'...':'');
}

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

  Object.values(groups)
    .sort((a,b)=>ORDER[a.rule.level]-ORDER[b.rule.level])
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
