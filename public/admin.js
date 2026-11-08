/* แผงแอดมิน: แสดงเฉพาะบัญชีที่เซิร์ฟเวอร์ตอบ is_admin = true (ตั้งใน ADMIN_EMAILS)
   เพิ่ม/ลดเครดิตตรวจและเครดิตเสียงให้บัญชีใดก็ได้ผ่าน POST /api/admin/credits
   สิทธิ์ตรวจที่เซิร์ฟเวอร์ทุกครั้ง ไฟล์นี้แค่สร้างหน้าตา */
(function () {
  var loggedIn = document.getElementById('authLoggedIn');
  if (!loggedIn) return;
  var card = null, me = null, busy = false;

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function build() {
    card = el(
      '<section class="adm" id="adminPanel" aria-labelledby="admTitle">' +
        '<header class="adm-head"><span class="adm-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z"/><path d="M9.5 12h5M12 9.5v5"/></svg></span>' +
        '<div><h3 id="admTitle">แผงแอดมิน</h3><p>เพิ่มหรือลดเครดิตให้บัญชีใดก็ได้</p></div></header>' +
        '<label class="adm-f">อีเมลบัญชี<input type="email" id="admEmail" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="email"></label>' +
        '<div class="adm-row">' +
          '<label class="adm-f">เครดิตตรวจ<input type="number" id="admCheck" inputmode="numeric" step="1" value="10"></label>' +
          '<label class="adm-f">เครดิตเสียง<input type="number" id="admVoice" inputmode="numeric" step="1" value="0"></label>' +
        '</div>' +
        '<div class="adm-quick" role="group" aria-label="จำนวนด่วน">' +
          '<button type="button" data-q="5">+5</button><button type="button" data-q="10">+10</button><button type="button" data-q="50">+50</button><button type="button" data-q="100">+100</button>' +
        '</div>' +
        '<button type="button" class="adm-go" id="admGo">เพิ่มเครดิต</button>' +
        '<p class="adm-msg" id="admMsg" role="status" aria-live="polite"></p>' +
        '<p class="adm-fine">ใส่เลขติดลบเพื่อลดเครดิต ยอดจะไม่ต่ำกว่า 0 · ทุกครั้งถูกบันทึกในระบบ</p>' +
      '</section>'
    );
    var wallet = loggedIn.querySelector('.wallet');
    /* วางใต้การ์ดยอดเครดิต (ก่อนรายการเครดิตแยกประเภท) */
    if (wallet && wallet.parentNode) wallet.parentNode.insertBefore(card, wallet); else loggedIn.appendChild(card);

    card.querySelector('.adm-quick').addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return;
      card.querySelector('#admCheck').value = b.getAttribute('data-q');
    });
    card.querySelector('#admGo').addEventListener('click', submit);
  }

  function say(t, kind) { var m = card.querySelector('#admMsg'); m.textContent = t || ''; m.className = 'adm-msg' + (kind ? ' is-' + kind : ''); }

  function submit() {
    if (busy) return;
    var email = card.querySelector('#admEmail').value.trim() || (me && me.email) || '';
    var check = parseInt(card.querySelector('#admCheck').value || '0', 10) || 0;
    var voice = parseInt(card.querySelector('#admVoice').value || '0', 10) || 0;
    if (!check && !voice) { say('ใส่จำนวนเครดิตก่อน', 'err'); return; }
    busy = true; var go = card.querySelector('#admGo'); go.disabled = true; go.textContent = 'กำลังบันทึก...'; say('');
    fetch('/api/admin/credits', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, check: check, voice: voice })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { say(x.d.error || 'ทำรายการไม่สำเร็จ', 'err'); return; }
        say('สำเร็จ · ' + esc(x.d.email) + ' มีเครดิตตรวจ ' + x.d.credits + ' · เสียง ' + x.d.voice_credits, 'ok');
        if (x.d.self && typeof window.showCredits === 'function') { try { window.showCredits(x.d.credits, x.d.voice_credits); } catch (e) {} }
        else if (x.d.self) location.reload();
      })
      .catch(function () { say('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', 'err'); })
      .then(function () { busy = false; go.disabled = false; go.textContent = 'เพิ่มเครดิต'; });
  }

  function check() {
    if (loggedIn.hidden) { if (card) card.hidden = true; return; }
    fetch('/api/me', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      me = d;
      if (!d || !d.is_admin) { if (card) card.hidden = true; return; }
      if (!card) build();
      card.hidden = false;
      var em = card.querySelector('#admEmail'); if (!em.value) em.value = d.email || '';
    }).catch(function () {});
  }

  new MutationObserver(check).observe(loggedIn, { attributes: true, attributeFilter: ['hidden'] });
  check();
})();
