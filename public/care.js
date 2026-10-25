/* =====================================================
   care.js — รายละเอียดที่ใส่ใจผู้ใช้ (หน้าตรวจสัญญา)
   1. กู้คืนข้อความที่ยังไม่ได้ตรวจ (เก็บในเบราว์เซอร์เครื่องนี้เท่านั้น ลบได้)
   2. บรรทัดบอกสถานะเครดิตใต้ปุ่มตรวจ
   3. แถบสถานะการอัปโหลดไฟล์ (window.careUpload ถูกเรียกจาก script.js)
   ไม่ส่งข้อมูลไปเซิร์ฟเวอร์ ไม่แก้ตรรกะตรวจหรือเครดิต โหลดหลัง script.js
   ===================================================== */
(function () {
  'use strict';

  var KEY = 'vc_draft_v1';
  var MIN_SAVE = 20;   // ไม่บันทึกข้อความสั้นมาก
  var timer = null;

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
  function getDraft() {
    var raw = store(function (s) { return s.getItem(KEY); });
    if (!raw) return null;
    try { var d = JSON.parse(raw); return d && typeof d.t === 'string' ? d : null; } catch (e) { return null; }
  }
  function setDraft(t) { store(function (s) { s.setItem(KEY, JSON.stringify({ t: t, ts: Date.now() })); }); }
  function dropDraft() { store(function (s) { s.removeItem(KEY); }); }

  /* ---------- 1. กู้คืนข้อความ ---------- */
  function initDraft() {
    var input = document.getElementById('input');
    var bar = document.getElementById('draftBar');
    if (!input || !bar) return;

    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var v = input.value;
        if (v.trim().length >= MIN_SAVE) setDraft(v); else dropDraft();
      }, 600);
    });

    var d = getDraft();
    if (d && d.t.trim().length >= MIN_SAVE && input.value.trim() === '') {
      bar.hidden = false;
    }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-draft]');
      if (!b) return;
      if (b.dataset.draft === 'restore') {
        var cur = getDraft();
        if (cur) {
          input.value = cur.t;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else {
        dropDraft();
      }
      bar.hidden = true;
    });

    // ออกจากระบบ: ลบข้อความที่เก็บไว้ในเครื่อง กันค้างบนเครื่องที่ใช้ร่วมกัน
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#logoutBtn')) dropDraft();
    });
  }

  /* ---------- 2. สถานะเครดิตใต้ปุ่มตรวจ ---------- */
  function updateCheckNote() {
    var el = document.getElementById('checkNote');
    var cost = document.getElementById('stepCost');   // บรรทัดค่าใช้จ่ายของขั้นที่ 3 อยู่เหนือปุ่มตรวจ
    if (!el && !cost) return;
    var user = null, credits = null;
    try { user = currentUser; credits = lastCredits; } catch (e) { return; }

    var costMsg, note = '';
    if (!user) {
      costMsg = 'เข้าสู่ระบบก่อนตรวจ เพื่อใช้เครดิตและดูประวัติย้อนหลัง';
    } else if (credits === 0) {
      // เครดิต 0: ใช้ถ้อยคำเป็นกลาง ไม่ฟ้องว่า "หมด" และไม่ใช้สีแดง
      costMsg = 'พร้อมตรวจครั้งถัดไปเมื่อคุณต้องการ ดูแพ็กเกจเพื่อเพิ่มสิทธิ์ ข้อความที่พิมพ์ไว้จะไม่ถูกลบ';
      note = 'ผลตรวจเดิมยังดูย้อนหลังได้ในประวัติ';
    } else if (typeof credits === 'number') {
      costMsg = 'ตรวจครั้งนี้ใช้ 1 เครดิต และคืนให้ถ้าตรวจไม่สำเร็จ';
      note = 'เครดิตคงเหลือ ' + credits;
    } else {
      costMsg = '';
    }
    if (cost) cost.textContent = costMsg;
    if (el) {
      el.textContent = note;
      el.classList.toggle('is-low', Boolean(user) && credits === 0);
    }
  }

  function initCheckNote() {
    var btn = document.getElementById('checkBtn');
    if (!btn) return;
    new MutationObserver(updateCheckNote).observe(btn, { childList: true, characterData: true, subtree: true });
    updateCheckNote();
    setTimeout(updateCheckNote, 1200);   // เผื่อโหลดสถานะล็อกอินช้า
  }

  /* ---------- 3. สถานะอัปโหลดไฟล์ ---------- */
  // kind: 'busy' | 'ok' | 'error' | 'clear'
  window.careUpload = function (kind, message) {
    var el = document.getElementById('upStatus');
    if (!el) return false;
    if (kind === 'clear' || !message) { el.hidden = true; el.textContent = ''; return true; }
    el.hidden = false;
    el.textContent = message;
    el.className = 'up-status is-' + kind;
    return true;
  };

  function init() { initDraft(); initCheckNote(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
