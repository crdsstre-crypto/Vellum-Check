/* =====================================================
   เติมเครดิตด้วย PromptPay — pay-ui.js (หน้าตาแบบ Premium Legal Tech)
   หน้าที่: เลือกแพ็กเกจ → ยืนยันยอด → แสดง QR → ถามสถานะจากเซิร์ฟเวอร์
   กฎสำคัญ: หน้านี้ไม่เพิ่มเครดิตเอง และไม่ตัดสินว่า "จ่ายแล้ว" เอง
            สำเร็จได้เฉพาะเมื่อ GET /api/payments/:id/status ตอบ credited เท่านั้น
   ราคาและจำนวนครั้งจริงอยู่ที่ server/payments.js หน้านี้ใช้แสดงผลเท่านั้น
   ใช้ api() esc() showCredits() จาก script.js จึงต้องโหลดไฟล์นี้หลัง script.js

   โครงสร้าง
   1. CONFIG    แพ็กเกจ ข้อความ ไอคอน
   2. STATE     สถานะของหน้าต่าง
   3. VIEW      วาดแพ็กเกจและแต่ละสถานะ
   4. ACTIONS   สร้าง QR, ถามสถานะ, ตั้งเวลา
   5. INIT      เริ่มต้นและผูกปุ่ม
   ===================================================== */

/* ทุกอย่างอยู่ใน IIFE เพื่อไม่ชื่อชนกับ script.js (เช่น renderResult) */
(function () {
'use strict';

  /* ---------- 1. CONFIG ---------- */
  const PAYMENT_CONFIG = {
    // id ต้องตรงกับ PACKAGES ใน server/payments.js เสมอ (ยอดจริงใช้ของเซิร์ฟเวอร์)
    packages: [
      { id: 'check3', kind: 'check', title: 'ตรวจสัญญา 3 ครั้ง', count: 3, price: 49, recommended: true },
      { id: 'voice1', kind: 'voice', title: 'สรุปเสียง 1 ครั้ง', count: 1, price: 9, sub: 'สำหรับทดลองใช้งาน' },
      { id: 'voice5', kind: 'voice', title: 'สรุปเสียง 5 ครั้ง', count: 5, price: 39 },
    ],
    kindName: { check: 'ตรวจสัญญา', voice: 'สรุปเสียง' },
    pollMs: 5000,        // ถามสถานะระหว่างรอ
    pollFastMs: 3000,    // ถามถี่ขึ้นหลังผู้ใช้กด "ชำระแล้ว"
    graceMs: 15000,      // เผื่อเวลาหลัง QR หมดอายุก่อนสรุปว่าหมดเวลา
    messages: {
      creating:   'กำลังสร้าง QR กรุณารอสักครู่...',
      failed:     'สร้างรายการชำระเงินไม่สำเร็จ ลองใหม่อีกครั้ง',
      noQr:       'ไม่พบรูป QR กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ',
      loginFirst: 'กรุณาเข้าสู่ระบบก่อนเติมเครดิต',
      testNote:   'โหมดทดสอบ ยังไม่มีการเรียกเก็บเงินจริง',
    },
  };

  const PAY_ICON = {
    check: '<svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" focusable="false"><ellipse cx="32" cy="58.5" rx="17" ry="3" fill="#000" opacity=".3"/><path d="M15 6h22l14 14v30a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V13a7 7 0 0 1 7-7z" fill="url(#vcg-w)"/><path class="st-corner" d="M37 6l14 14H41a4 4 0 0 1-4-4z" fill="#aeb9d1"/><rect class="st-ln" x="15" y="25" width="20" height="4" rx="2" fill="url(#vcg-y)"/><rect class="st-ln" x="15" y="33" width="12" height="4" rx="2" fill="url(#vcg-y)"/><circle cx="41" cy="41" r="11" fill="#fff" opacity=".35"/><circle cx="41" cy="41" r="9" fill="none" stroke="url(#vcg-b)" stroke-width="5"/><path d="M48 48l9 9" stroke="#26376f" stroke-width="6" stroke-linecap="round"/></svg>',
    voice: '<svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" focusable="false"><ellipse cx="32" cy="58.5" rx="17" ry="3" fill="#000" opacity=".3"/><rect x="6" y="26" width="9" height="14" rx="4.5" fill="url(#vcg-p)"/><rect x="18" y="14" width="9" height="38" rx="4.5" fill="url(#vcg-y)"/><rect x="30" y="6" width="9" height="52" rx="4.5" fill="url(#vcg-g)"/><rect x="42" y="18" width="9" height="30" rx="4.5" fill="url(#vcg-b)"/><rect x="54" y="27" width="6" height="12" rx="3" fill="url(#vcg-v)"/><path d="M32.5 12v8" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/></svg>',
    ok:    '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/></svg>',
    warn:  '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.1"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };


  /* ---------- 2. STATE ---------- */

  // stage: idle → selected → creating → waiting ⇄ checking → success | failed | expired
  const pay = {
    stage: 'idle',
    pkgId: null,       // แพ็กเกจที่เลือก
    payment: null,     // ผลจาก POST /api/payments/promptpay
    busy: false,       // กันกดซ้ำระหว่างสร้างรายการ
    polling: false,    // กันถามสถานะซ้อนกัน
    pollTimer: null,
    tickTimer: null,
    note: '',          // ข้อความสั้น ๆ ใต้สถานะ (เช่น ตรวจไม่สำเร็จ จะลองใหม่)
    result: null,      // ผลสำเร็จจากเซิร์ฟเวอร์ { kind, credits, amountBaht }
    errorText: '',
  };

  // element ที่ใช้บ่อย ตั้งค่าใน initPayments()
  const payEls = {};

  function payPkg(id) {
    return PAYMENT_CONFIG.packages.find(p => p.id === id) || null;
  }
  function payAvg(p) {
    return p.count > 1 ? (p.price / p.count).toFixed(2) : null;
  }
  function payBaht(n) {
    return Number(n).toLocaleString('th-TH') + ' ฿';
  }


  /* ---------- 3. VIEW ---------- */

  function showPaymentCard(visible) {
    payEls.card.hidden = !visible;
  }

  function renderPackageButtons() {
    payEls.buttons.innerHTML = PAYMENT_CONFIG.packages.map(function (p) {
      const avg = payAvg(p);
      const sub = avg ? 'เฉลี่ย ' + avg + ' บาทต่อครั้ง' : (p.sub || '');
      return `<button type="button" class="primary pkg" data-package="${esc(p.id)}" aria-pressed="false">
        <span class="pkg-ic" aria-hidden="true">${PAY_ICON[p.kind]}</span>
        <span class="pkg-tx"><b>${esc(p.title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}${p.recommended ? '<em class="pkg-tag">แนะนำ</em>' : ''}</span>
        <span class="pkg-pr">${esc(payBaht(p.price))}</span>
      </button>`;
    }).join('');
  }

  // อัปเดตเฉพาะสถานะเลือก ไม่วาดปุ่มใหม่ (โฟกัสและอนิเมชันไม่หลุด)
  function syncPackageButtons() {
    const locked = pay.busy;
    payEls.buttons.querySelectorAll('button[data-package]').forEach(function (b) {
      const on = b.dataset.package === pay.pkgId;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-pressed', String(on));
      b.disabled = locked;
    });
  }

  function summaryHtml(p) {
    return `<dl class="pay-sum">
      <div><dt>บริการ</dt><dd>${esc(PAYMENT_CONFIG.kindName[p.kind])}</dd></div>
      <div><dt>จำนวน</dt><dd>${esc(p.count)} ครั้ง</dd></div>
      <div class="pay-sum-total"><dt>ยอดชำระ</dt><dd>${esc(payBaht(p.price))}</dd></div>
    </dl>`;
  }

  function isSafeImageUrl(url) {
    // รูป QR ต้องเป็น https เท่านั้น กันค่าที่ไม่ปลอดภัยจากเซิร์ฟเวอร์
    try {
      return new URL(url).protocol === 'https:';
    } catch {
      return false;
    }
  }

  function countdownText() {
    const exp = pay.payment && pay.payment.expiresAt ? Date.parse(pay.payment.expiresAt) : NaN;
    if (!isFinite(exp)) return '';
    const left = Math.max(0, Math.floor((exp - Date.now()) / 1000));
    const m = String(Math.floor(left / 60)).padStart(2, '0');
    const s = String(left % 60).padStart(2, '0');
    return `QR หมดอายุใน ${m}:${s}`;
  }

  function qrHtml(payment) {
    return payment.qrImageUrl && isSafeImageUrl(payment.qrImageUrl)
      ? `<div class="pay-qr"><img src="${esc(payment.qrImageUrl)}" alt="QR PromptPay สำหรับชำระเงิน"></div>`
      : `<p class="notfound">${esc(PAYMENT_CONFIG.messages.noQr)}</p>`;
  }

  function renderResult() {
    const p = payPkg(pay.pkgId);
    let html = '';

    if (pay.stage === 'idle') {
      html = '<p class="pay-hint">เลือกแพ็กเกจด้านบนเพื่อดูยอดชำระ ระบบจะยังไม่เรียกเก็บเงินจนกว่าคุณจะกดสร้าง QR</p>';

    } else if (pay.stage === 'selected' && p) {
      html = summaryHtml(p) +
        `<button type="button" class="primary pay-go" data-action="create">สร้าง QR PromptPay · ${esc(payBaht(p.price))}</button>`;

    } else if (pay.stage === 'creating' && p) {
      html = summaryHtml(p) +
        `<button type="button" class="primary pay-go" disabled>${esc(PAYMENT_CONFIG.messages.creating)}</button>`;

    } else if ((pay.stage === 'waiting' || pay.stage === 'checking') && p && pay.payment) {
      const checking = pay.stage === 'checking';
      html = `<div class="pay-status ${checking ? 'is-checking' : ''}">
          <b>${checking ? 'กำลังตรวจสอบรายการ' : 'รอชำระเงิน'}</b>
          <span>${checking
            ? 'ยังไม่ถือว่าชำระสำเร็จ เครดิตจะเพิ่มเมื่อระบบยืนยันการชำระแล้วเท่านั้น'
            : 'สแกน QR ด้วยแอปธนาคาร หรือบันทึกภาพหน้าจอแล้วเปิดจากแอปธนาคาร'}</span>
        </div>` +
        qrHtml(pay.payment) +
        summaryHtml(p) +
        `<p class="pay-count" id="payCountdown">${esc(countdownText())}</p>` +
        (pay.note ? `<p class="pay-note-line">${esc(pay.note)}</p>` : '') +
        `<button type="button" class="primary pay-go" data-action="check" ${checking ? 'disabled' : ''}>${checking ? 'กำลังตรวจสอบ...' : 'ฉันชำระเงินแล้ว · ตรวจสอบ'}</button>
         <button type="button" class="ghost pay-alt" data-action="change">เปลี่ยนแพ็กเกจ</button>
         <p class="disclaimer">${esc(PAYMENT_CONFIG.messages.testNote)}</p>`;

    } else if (pay.stage === 'success' && pay.result) {
      const r = pay.result;
      html = `<div class="pay-done is-ok">
          <span class="pay-done-ic">${PAY_ICON.ok}</span>
          <b>ชำระเงินสำเร็จ</b>
          <span>ชำระ ${esc(payBaht(r.amountBaht))} · ได้รับเครดิต${esc(PAYMENT_CONFIG.kindName[r.kind] || '')} ${esc(r.credits)} ครั้ง</span>
        </div>
        <button type="button" class="primary pay-go" data-action="done">เสร็จสิ้น</button>`;

    } else if (pay.stage === 'failed' || pay.stage === 'expired') {
      const expired = pay.stage === 'expired';
      html = `<div class="pay-done is-bad">
          <span class="pay-done-ic">${expired ? PAY_ICON.clock : PAY_ICON.warn}</span>
          <b>${expired ? 'QR หมดเวลาแล้ว' : 'ชำระเงินไม่สำเร็จ'}</b>
          <span>${esc(pay.errorText || (expired
            ? 'หากคุณชำระเงินไปแล้ว เครดิตจะเข้าเมื่อระบบยืนยันการชำระ'
            : 'รายการนี้ไม่สำเร็จ คุณสามารถลองสร้างรายการใหม่ได้อย่างปลอดภัย'))}</span>
        </div>
        <button type="button" class="primary pay-go" data-action="retry">สร้างรายการใหม่</button>`;
    }

    payEls.result.innerHTML = html;
    payEls.card.dataset.stage = pay.stage;
    syncPackageButtons();
  }


  /* ---------- 4. ACTIONS ---------- */

  function clearTimers() {
    clearTimeout(pay.pollTimer);
    clearInterval(pay.tickTimer);
    pay.pollTimer = null;
    pay.tickTimer = null;
  }

  function resetPay() {
    clearTimers();
    pay.stage = 'idle';
    pay.pkgId = null;
    pay.payment = null;
    pay.busy = false;
    pay.polling = false;
    pay.note = '';
    pay.result = null;
    pay.errorText = '';
    renderResult();
  }

  function selectPackage(id) {
    if (pay.busy || !payPkg(id)) return;
    // เปลี่ยนแพ็กเกจได้เฉพาะก่อนมีรายการรอชำระ
    if (pay.stage !== 'idle' && pay.stage !== 'selected') return;
    pay.pkgId = id;
    pay.stage = 'selected';
    renderResult();
  }

  async function createPayment() {
    if (pay.busy || !pay.pkgId) return;
    pay.busy = true;
    pay.stage = 'creating';
    renderResult();

    const r = await api('/api/payments/promptpay', 'POST', { packageId: pay.pkgId });
    pay.busy = false;

    if (r.status === 401) {
      pay.stage = 'failed';
      pay.errorText = PAYMENT_CONFIG.messages.loginFirst;
      renderResult();
      return;
    }
    if (!r.ok) {
      pay.stage = 'failed';
      pay.errorText = r.data.error || PAYMENT_CONFIG.messages.failed;
      renderResult();
      return;
    }

    pay.payment = r.data;
    pay.stage = 'waiting';
    pay.note = '';
    renderResult();
    startWatching();
  }

  function startWatching() {
    clearTimers();
    // นับถอยหลังแก้เฉพาะข้อความบรรทัดเดียว ไม่วาดหน้าใหม่
    pay.tickTimer = setInterval(function () {
      const el = document.getElementById('payCountdown');
      if (el) el.textContent = countdownText();
    }, 1000);
    scheduleNextPoll();
  }

  function scheduleNextPoll() {
    clearTimeout(pay.pollTimer);
    if (pay.stage !== 'waiting' && pay.stage !== 'checking') return;
    const ms = pay.stage === 'checking' ? PAYMENT_CONFIG.pollFastMs : PAYMENT_CONFIG.pollMs;
    pay.pollTimer = setTimeout(function () { pollStatus(); }, ms);
  }

  // ถามเซิร์ฟเวอร์ว่ารายการนี้สถานะอะไร (เซิร์ฟเวอร์ตรวจกับ Omise เอง)
  async function pollStatus() {
    if (pay.polling || !pay.payment) return;
    if (pay.stage !== 'waiting' && pay.stage !== 'checking') return;
    const chargeId = pay.payment.chargeId;
    pay.polling = true;

    const r = await api('/api/payments/' + encodeURIComponent(chargeId) + '/status');
    pay.polling = false;
    // ผู้ใช้เปลี่ยนรายการ/ออกจากระบบระหว่างรอ
    if (!pay.payment || pay.payment.chargeId !== chargeId) return;

    if (r.status === 401) {
      clearTimers();
      pay.stage = 'failed';
      pay.errorText = PAYMENT_CONFIG.messages.loginFirst;
      renderResult();
      return;
    }

    if (!r.ok) {
      // เน็ตหลุดหรือเซิร์ฟเวอร์ติดขัด: ไม่สรุปผล บอกผู้ใช้และลองใหม่เอง
      pay.note = 'ตรวจสอบสถานะไม่สำเร็จในตอนนี้ ระบบจะลองใหม่อัตโนมัติ';
      renderResult();
      scheduleNextPoll();
      return;
    }

    const status = r.data.status;

    if (status === 'credited') {
      clearTimers();
      const p = payPkg(pay.pkgId);
      pay.result = {
        kind: r.data.kind || (p && p.kind),
        credits: r.data.credits != null ? r.data.credits : (p && p.count),
        amountBaht: r.data.amountBaht != null ? r.data.amountBaht : (p && p.price),
      };
      pay.stage = 'success';
      renderResult();
      refreshCreditsFromServer();
      return;
    }

    if (status === 'failed' || status === 'expired') {
      clearTimers();
      pay.stage = status;
      pay.errorText = '';
      renderResult();
      return;
    }

    // ยังรอชำระ: ถ้าเลยเวลาหมดอายุไปแล้วและเซิร์ฟเวอร์ยังไม่ยืนยัน ให้บอกว่าหมดเวลา (ไม่ใช่ว่าสำเร็จ)
    const exp = pay.payment.expiresAt ? Date.parse(pay.payment.expiresAt) : NaN;
    if (isFinite(exp) && Date.now() > exp + PAYMENT_CONFIG.graceMs) {
      clearTimers();
      pay.stage = 'expired';
      pay.errorText = '';
      renderResult();
      return;
    }

    pay.note = pay.stage === 'checking' ? 'ยังไม่พบการชำระเงิน อาจใช้เวลาสักครู่ ระบบจะตรวจสอบต่อให้' : '';
    renderResult();
    scheduleNextPoll();
  }

  // ผู้ใช้กด "ฉันชำระเงินแล้ว" เป็นแค่การขอให้ตรวจเร็วขึ้น ไม่ได้ทำให้เครดิตเพิ่ม
  function requestCheck() {
    if (pay.stage !== 'waiting') return;
    pay.stage = 'checking';
    pay.note = '';
    renderResult();
    clearTimeout(pay.pollTimer);
    pollStatus();
  }

  // ดึงเครดิตล่าสุดจากเซิร์ฟเวอร์มาแสดง (ไม่คำนวณเองในหน้าเว็บ)
  async function refreshCreditsFromServer() {
    const me = await api('/api/me');
    if (me.ok && typeof showCredits === 'function') {
      showCredits(me.data.credits, me.data.voice_credits);
    }
  }

  function closeModalIfAny() {
    if (typeof closePayModal === 'function') closePayModal();
  }

  function onPayClick(event) {
    const pkgBtn = event.target.closest('button[data-package]');
    if (pkgBtn) {
      if (!pkgBtn.disabled) selectPackage(pkgBtn.dataset.package);
      return;
    }
    const act = event.target.closest('button[data-action]');
    if (!act || act.disabled) return;

    switch (act.dataset.action) {
      case 'create': createPayment(); break;
      case 'check':  requestCheck(); break;
      case 'change': { const keep = pay.pkgId; resetPay(); selectPackage(keep); break; }
      case 'retry':  { const keep = pay.pkgId; resetPay(); selectPackage(keep); break; }
      case 'done':   resetPay(); closeModalIfAny(); break;
    }
  }

  // script.js เรียกฟังก์ชันนี้ทุกครั้งที่สถานะการล็อกอินเปลี่ยน
  function onAuthChange(user) {
    if (!payEls.card) return;
    showPaymentCard(Boolean(user));
    if (!user) resetPay();
  }


  /* ---------- 5. INIT ---------- */

  function initPayments() {
    payEls.card = document.getElementById('paymentCard');
    payEls.buttons = document.getElementById('packageButtons');
    payEls.result = document.getElementById('paymentResult');

    if (!payEls.card || !payEls.buttons || !payEls.result) {
      console.error('[เติมเครดิต] ไม่พบ element ใน index.html');
      return;
    }

    renderPackageButtons();
    payEls.card.addEventListener('click', onPayClick);
    renderResult();
    showPaymentCard(false);

    // ผู้ใช้สลับไปแอปธนาคารแล้วกลับมา: ตรวจสถานะทันที ไม่ต้องรอรอบถัดไป
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' &&
          (pay.stage === 'waiting' || pay.stage === 'checking')) {
        clearTimeout(pay.pollTimer);
        pollStatus();
      }
    });
  }

  // script.js ตรวจ typeof onAuthChange จึงต้องเปิดเป็นตัวแปรส่วนกลางชื่อนี้
  window.onAuthChange = onAuthChange;

  document.addEventListener('DOMContentLoaded', initPayments);

})();
