/* =====================================================
   เติมเครดิตด้วย PromptPay — payments.js (ขั้นที่ 2)
   หน้าที่: แสดงแพ็กเกจ ขอ QR จากเซิร์ฟเวอร์ และแสดง QR ให้สแกน
   ไม่มีราคาหรือการเติมเครดิตในหน้านี้ ทั้งหมดอยู่ที่ server/payments.js
   ใช้ api() และ esc() จาก script.js จึงต้องโหลดไฟล์นี้หลัง script.js

   โครงสร้าง
   1. CONFIG    ค่าและข้อความ
   2. VIEW      แสดงแพ็กเกจและผล QR
   3. ACTIONS   กดซื้อแพ็กเกจ
   4. INIT      เริ่มต้นและผูกปุ่ม
   ===================================================== */


/* ---------- 1. CONFIG ---------- */
const PAYMENT_CONFIG = {
  // id ต้องตรงกับ PACKAGES ใน server/payments.js เสมอ
  packages: [
    { id: 'check3', label: 'ตรวจสัญญา 3 ครั้ง · 49 บาท', note: '≈ 16.3 บาทต่อครั้ง' },
    { id: 'voice1', label: 'สรุปเสียง 1 ครั้ง · 9 บาท' },
    { id: 'voice5', label: 'สรุปเสียง 5 ครั้ง · 39 บาท', note: '≈ 7.8 บาทต่อครั้ง' },
  ],
  messages: {
    creating:  'กำลังสร้าง QR กรุณารอสักครู่...',
    failed:    'สร้างรายการชำระเงินไม่สำเร็จ ลองใหม่อีกครั้ง',
    noQr:      'ไม่พบรูป QR กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ',
    loginFirst:'กรุณาเข้าสู่ระบบก่อนเติมเครดิต',
    testNote:  'โหมดทดสอบ ยังไม่มีการเรียกเก็บเงินจริง',
  },
};

// element ที่ใช้บ่อย ตั้งค่าใน initPayments()
const payEls = {};


/* ---------- 2. VIEW ---------- */

function showPaymentCard(visible) {
  payEls.card.hidden = !visible;
}

function renderPackageButtons() {
  payEls.buttons.innerHTML = PAYMENT_CONFIG.packages
    .map(p => `<button class="primary" data-package="${esc(p.id)}">${esc(p.label)}${p.note ? `<br><small>${esc(p.note)}</small>` : ''}</button>`)
    .join('');
}

function renderPaymentMessage(message) {
  payEls.result.innerHTML = `<p class="empty">${esc(message)}</p>`;
}

// รูป QR ต้องเป็น https เท่านั้น กันค่าที่ไม่ปลอดภัยจากเซิร์ฟเวอร์
function isSafeImageUrl(url) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

function renderQr(payment) {
  const qr = payment.qrImageUrl && isSafeImageUrl(payment.qrImageUrl)
    ? `<img src="${esc(payment.qrImageUrl)}" alt="QR PromptPay"
            style="display:block;max-width:240px;width:100%;margin:12px auto;">`
    : `<p class="notfound">${esc(PAYMENT_CONFIG.messages.noQr)}</p>`;

  payEls.result.innerHTML = `
    <p><b>${esc(payment.label)}</b></p>
    ${qr}
    <p class="disclaimer">${esc(PAYMENT_CONFIG.messages.testNote)}</p>`;
}


/* ---------- 3. ACTIONS ---------- */

async function buyPackage(packageId) {
  renderPaymentMessage(PAYMENT_CONFIG.messages.creating);
  const r = await api('/api/payments/promptpay', 'POST', { packageId });

  if (r.status === 401) {
    renderPaymentMessage(PAYMENT_CONFIG.messages.loginFirst);
    return;
  }
  if (!r.ok) {
    renderPaymentMessage(r.data.error || PAYMENT_CONFIG.messages.failed);
    return;
  }
  renderQr(r.data);
}

function onPackageClick(event) {
  const btn = event.target.closest('button[data-package]');
  if (!btn || btn.disabled) return;
  // ปุ่มตอบสนองทันที และกดซ้ำไม่ได้ระหว่างรอสร้าง QR
  btn.disabled = true;
  buyPackage(btn.dataset.package).finally(function () { btn.disabled = false; });
}

// script.js เรียกฟังก์ชันนี้ทุกครั้งที่สถานะการล็อกอินเปลี่ยน
function onAuthChange(user) {
  if (!payEls.card) return;
  showPaymentCard(Boolean(user));
  if (!user) payEls.result.innerHTML = '';
}


/* ---------- 4. INIT ---------- */

function initPayments() {
  payEls.card = document.getElementById('paymentCard');
  payEls.buttons = document.getElementById('packageButtons');
  payEls.result = document.getElementById('paymentResult');

  if (!payEls.card || !payEls.buttons || !payEls.result) {
    console.error('[เติมเครดิต] ไม่พบ element ใน index.html');
    return;
  }

  renderPackageButtons();
  payEls.buttons.addEventListener('click', onPackageClick);
  showPaymentCard(false);
}

document.addEventListener('DOMContentLoaded', initPayments);
