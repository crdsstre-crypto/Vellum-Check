/* ความเห็นต่อผลตรวจ (👍/👎 + เหตุผล) — แสดงท้ายผลตรวจจริงเท่านั้น (ไม่แสดงกับผลตัวอย่าง)
   ส่งไป POST /api/feedback · ไม่ส่งข้อความสัญญา · ส่งซ้ำ = แก้ความเห็นเดิมของผลตรวจนั้น
   เหตุผลต้องตรงกับ FEEDBACK_REASONS ใน server/stats.js */
(function () {
  var REASONS = {
    up: ['เข้าใจง่าย', 'เจอจุดที่ไม่เคยสังเกต', 'ได้คำแนะนำไปคุยต่อ', 'ประหยัดเวลา'],
    down: ['ชี้ข้อผิด', 'ขาดประเด็นสำคัญ', 'อธิบายไม่เข้าใจ', 'คำแนะนำใช้จริงไม่ได้', 'ช้าเกินไป']
  };
  var KEY = 'vc_fb_';
  var THUMB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v10H4V10z"/><path d="M7 10l4-7c1.7 0 2.6 1.2 2.3 2.8L12.8 9H19a2 2 0 0 1 2 2.3l-1.2 6.6A2.5 2.5 0 0 1 17.3 20H7"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function saved(id) { try { return JSON.parse(localStorage.getItem(KEY + id) || 'null'); } catch (e) { return null; } }
  function remember(id, v) { try { localStorage.setItem(KEY + id, JSON.stringify(v)); } catch (e) {} }

  function send(id, st) {
    return fetch('/api/feedback', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionId: id, rating: st.rating, reasons: st.reasons, note: st.note })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .catch(function () { return { ok: false, d: { error: 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง' } }; });
  }

  function attach(id) {
    var res = document.getElementById('result'); if (!res || !id) return;
    var old = res.querySelector('.vc-fb'); if (old) old.remove();
    var st = saved(id) || { rating: 0, reasons: [], note: '', sent: false };
    var el = document.createElement('section'); el.className = 'vc-fb'; el.setAttribute('aria-label', 'ความเห็นต่อผลตรวจนี้');
    el.innerHTML =
      '<div class="vc-fb-top"><div><h4>ผลตรวจนี้ช่วยคุณได้ไหม?</h4><p>ความเห็นของคุณช่วยให้ผลตรวจครั้งต่อไปแม่นขึ้น</p></div>' +
      '<div class="vc-fb-btns" role="group" aria-label="ให้คะแนน"><button type="button" class="vc-fb-r up" data-r="1" aria-pressed="false">' + THUMB + 'ช่วยได้</button>' +
      '<button type="button" class="vc-fb-r down" data-r="-1" aria-pressed="false">' + THUMB + 'ยังไม่ดี</button></div></div>' +
      '<div class="vc-fb-more" hidden><p class="vc-fb-q"></p><div class="vc-fb-chips" role="group"></div>' +
      '<textarea class="vc-fb-note" maxlength="300" rows="2" placeholder="บอกเพิ่มได้ เช่น ข้อไหนผิด (ไม่ต้องใส่ชื่อหรือข้อมูลส่วนตัว)"></textarea>' +
      '<div class="vc-fb-act"><span class="vc-fb-msg" role="status" aria-live="polite"></span><button type="button" class="vc-fb-send">ส่งความเห็น</button></div></div>' +
      '<p class="vc-fb-done" hidden></p>';
    res.appendChild(el);
    var more = el.querySelector('.vc-fb-more'), chips = el.querySelector('.vc-fb-chips'), note = el.querySelector('.vc-fb-note');
    var msg = el.querySelector('.vc-fb-msg'), done = el.querySelector('.vc-fb-done'), busy = false;

    function paint() {
      [].forEach.call(el.querySelectorAll('.vc-fb-r'), function (b) { var on = +b.dataset.r === st.rating; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      el.classList.toggle('is-up', st.rating === 1); el.classList.toggle('is-down', st.rating === -1);
      if (!st.rating) { more.hidden = true; return; }
      var list = st.rating === 1 ? REASONS.up : REASONS.down;
      el.querySelector('.vc-fb-q').textContent = st.rating === 1 ? 'ชอบตรงไหน (เลือกได้หลายข้อ)' : 'ควรปรับตรงไหน (เลือกได้หลายข้อ)';
      chips.innerHTML = list.map(function (r) { var on = st.reasons.indexOf(r) > -1; return '<button type="button" class="vc-fb-c' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '">' + esc(r) + '</button>'; }).join('');
      note.value = st.note || '';
      more.hidden = !!st.sent; done.hidden = !st.sent;
      if (st.sent) done.innerHTML = 'ขอบคุณสำหรับความเห็นครับ <button type="button" class="vc-fb-edit">แก้ไข</button>';
    }
    function post(final) {
      if (busy) return; busy = true; msg.textContent = final ? 'กำลังส่ง…' : '';
      send(id, st).then(function (x) {
        busy = false;
        if (!x.ok) { msg.textContent = x.d.error || 'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง'; return; }
        msg.textContent = '';
        if (final) { st.sent = true; paint(); }
        remember(id, st);
      });
    }
    el.addEventListener('click', function (e) {
      var r = e.target.closest('.vc-fb-r');
      if (r) { var v = +r.dataset.r; if (v !== st.rating) { st.rating = v; st.reasons = []; } st.sent = false; paint(); post(false); return; } /* คะแนนอย่างเดียวก็นับ */
      var c = e.target.closest('.vc-fb-c');
      if (c) { var t = c.textContent, k = st.reasons.indexOf(t); if (k > -1) st.reasons.splice(k, 1); else st.reasons.push(t); c.classList.toggle('is-on', k < 0); c.setAttribute('aria-pressed', k < 0 ? 'true' : 'false'); return; }
      if (e.target.closest('.vc-fb-send')) { st.note = note.value.trim().slice(0, 300); post(true); return; }
      if (e.target.closest('.vc-fb-edit')) { st.sent = false; paint(); note.focus(); }
    });
    paint();
  }
  window.VCFeedback = { attach: attach };
  /* ลิงก์ "จัดการประวัติ" ใต้ปุ่มตรวจ: เปิดหน้าบัญชีแล้วกางประวัติให้ (ลบรายการ/ลบทั้งหมดได้จากตรงนั้น) */
  document.addEventListener('click', function (e) {
    if (!(e.target.closest && e.target.closest('[data-manage-hist]'))) return;
    setTimeout(function () {
      var li = document.getElementById('authLoggedIn'), h = document.getElementById('walletHist');
      if (li && !li.hidden && h && h.getAttribute('aria-expanded') !== 'true') h.click();
      if (h && li && !li.hidden) setTimeout(function () { try { h.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (er) {} }, 150);
    }, 450);
  });
})();
