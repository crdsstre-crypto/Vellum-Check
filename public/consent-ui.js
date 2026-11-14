/* ===== ยอมรับข้อกำหนดก่อนตรวจสัญญา (consent-ui.js) =====
   - ก่อนตรวจครั้งแรก (และทุกครั้งที่ข้อกำหนดเปลี่ยนฉบับ) เปิดหน้าต่างสรุป 3 ข้อ + ช่องติ๊กยอมรับ
   - ติ๊กแล้วบันทึกฝั่งเซิร์ฟเวอร์ (POST /api/consent) เป็นหลักฐาน แล้วตรวจต่อให้อัตโนมัติ
   - กันสองชั้น: ดักปุ่มตรวจก่อนเริ่ม + ถ้าเซิร์ฟเวอร์ตอบ 428 (เช่น ยอมรับจากเครื่องอื่นไม่ได้) จะเปิดหน้าต่างแล้วส่งคำขอเดิมใหม่
   - ★ VERSION ต้องตรงกับ TERMS_VERSION ใน server/consent.js และ VERSION ใน art.js */
(function () {
  'use strict';
  if (window.VCConsent) return;
  var VERSION = '1.1', KEY = 'vc_ack_check';

  var TX = {
    th: { t: 'ก่อนตรวจสัญญา โปรดอ่าน 3 ข้อนี้', s: 'ใช้เวลาไม่ถึง 10 วินาที และจะถามแค่ครั้งเดียว',
      p: [['🤖', 'ผลตรวจมาจาก AI', 'เป็นการคัดกรองเบื้องต้น อาจผิดพลาดหรือไม่ครบทุกประเด็น การไม่พบจุดเสี่ยงไม่ได้แปลว่าสัญญาปลอดภัย'],
        ['⚖️', 'ไม่ใช่คำปรึกษาทางกฎหมาย', 'ต้องอ่านสัญญาฉบับเต็มและตัดสินใจเอง สัญญาที่มีมูลค่าสูงหรือมีผลสำคัญ ควรให้ทนายความตรวจก่อนเซ็น'],
        ['🔒', 'ข้อความถูกส่งให้ AI ประมวลผล', 'ระบบปกปิดข้อมูลส่วนตัวบางส่วนให้ แต่อาจไม่ครบ ควรลบข้อมูลที่ไม่จำเป็นก่อนส่ง']],
      c: 'ฉันเข้าใจข้อความข้างต้น และยอมรับ', terms: 'ข้อกำหนดการใช้บริการ', and: 'และ', priv: 'นโยบายความเป็นส่วนตัว', ver: 'ฉบับ',
      go: 'ยอมรับและเริ่มตรวจ', no: 'ยกเลิก', need: 'ติ๊กช่องด้านบนก่อนนะครับ', fail: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง', saving: 'กำลังบันทึก…' },
    en: { t: 'Before we check, please read these 3 points', s: 'Takes under 10 seconds and we only ask once',
      p: [['🤖', 'Results come from AI', 'This is an initial screening. It can be wrong or miss issues. Finding no risks does not mean the contract is safe.'],
        ['⚖️', 'Not legal advice', 'Read the full contract and decide for yourself. For high-value or important contracts, have a lawyer review before signing.'],
        ['🔒', 'Your text is sent to an AI provider', 'We mask some personal data automatically, but not every case. Remove anything unnecessary before sending.']],
      c: 'I understand the above and accept the', terms: 'Terms of Service', and: 'and', priv: 'Privacy Policy', ver: 'version',
      go: 'Accept and check', no: 'Cancel', need: 'Please tick the box first', fail: 'Could not save. Please try again.', saving: 'Saving…' },
    zh: { t: '检查前请阅读以下 3 点', s: '不到 10 秒，只需确认一次',
      p: [['🤖', '结果来自 AI', '这只是初步筛查，可能有误或遗漏。未发现风险并不代表合同安全。'],
        ['⚖️', '并非法律意见', '请阅读合同全文并自行决定。高金额或重要合同，签署前请让律师审阅。'],
        ['🔒', '文本将发送给 AI 服务商处理', '系统会自动遮盖部分个人信息，但可能不完整。发送前请删除不必要的信息。']],
      c: '我已了解以上内容，并接受', terms: '服务条款', and: '和', priv: '隐私政策', ver: '版本',
      go: '接受并开始检查', no: '取消', need: '请先勾选上方的方框', fail: '保存失败，请重试', saving: '正在保存…' }
  };
  function L() { var k = 'th'; try { k = (window.VCLang && VCLang.get && VCLang.get()) || document.documentElement.lang || 'th'; } catch (e) {} k = String(k).slice(0, 2); return TX[k] || TX.th; }
  function acked() { try { return localStorage.getItem(KEY) === VERSION; } catch (e) { return false; } }
  function setAck(on) { try { if (on) localStorage.setItem(KEY, VERSION); else localStorage.removeItem(KEY); } catch (e) {} }
  function logged() { try { return typeof currentUser !== 'undefined' && !!currentUser; } catch (e) { return false; } }
  function h(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var CSS =
    '.vcs{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;background:rgba(5,5,8,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}' +
    '.vcs.on{opacity:1}' +
    '.vcs *{box-sizing:border-box}' +
    '.vcs-p{width:min(100%,520px);max-height:92vh;overflow:auto;margin:0;padding:22px 18px calc(18px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:linear-gradient(170deg,#1f1b16,#141318 60%);' +
      'border:1px solid rgba(246,214,140,.22);box-shadow:0 -20px 60px -20px rgba(0,0,0,.9);color:#ececef;font-family:Prompt,Sarabun,system-ui,sans-serif;transform:translateY(24px);transition:transform .32s cubic-bezier(.2,1.2,.4,1)}' +
    '.vcs.on .vcs-p{transform:none}' +
    '@media (min-width:640px){.vcs{align-items:center}.vcs-p{border-radius:24px}}' +
    '.vcs-p h3{margin:0 0 4px;font:700 18px/1.35 Prompt,sans-serif;color:#fff}.vcs-p .vcs-s{margin:0 0 14px;font:400 12.5px/1.5 Prompt,sans-serif;color:#a3a3aa}' +
    '.vcs-i{display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:start;margin:0 0 8px;padding:12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}' +
    '.vcs-i i{font-style:normal;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:18px;background:rgba(246,214,140,.1)}' +
    '.vcs-i b{display:block;font:700 14px/1.35 Prompt,sans-serif;color:#fff}.vcs-i span{display:block;margin-top:3px;font:400 12.5px/1.55 Prompt,sans-serif;color:#bdbdc5}' +
    '.vcs-c{display:flex;gap:10px;align-items:flex-start;margin:14px 2px 4px;font:500 13px/1.55 Prompt,sans-serif;color:#e4e4e8;cursor:pointer}' +
    '.vcs-c input{flex:none;width:22px;height:22px;margin:1px 0 0;accent-color:#3be0c0;cursor:pointer}' +
    '.vcs-c a{color:#f6d68c;text-decoration:underline;text-underline-offset:2px}' +
    '.vcs-c.err{animation:vcsSh .4s}@keyframes vcsSh{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
    '.vcs-m{min-height:18px;margin:2px 2px 8px;font:500 12px/1.4 Prompt,sans-serif;color:#ff9aa4}' +
    '.vcs-b{display:grid;grid-template-columns:1fr 2fr;gap:8px}' +
    '.vcs-b button{appearance:none;border:0;border-radius:14px;padding:14px 10px;font:700 14.5px/1 Prompt,sans-serif;cursor:pointer}' +
    '.vcs-no{background:rgba(255,255,255,.07);color:#d4d4da}' +
    '.vcs-go{background:linear-gradient(135deg,#3be0c0,#22c3e6);color:#04201c;transition:opacity .2s,filter .2s}' +
    '.vcs-go[aria-disabled=true]{opacity:.45;filter:grayscale(.6)}' +
    '.vcs-v{margin:10px 0 0;text-align:center;font:400 10.5px/1 Prompt,sans-serif;color:#6f6f78}' +
    'html .vd-modal.on{z-index:2147483600 !important}' +
    '@media (prefers-reduced-motion:reduce){.vcs,.vcs-p{transition:none}}';

  var box = null, pending = null;
  function ensure() {
    if (box) return;
    var st = document.createElement('style'); st.id = 'vcsCss'; st.textContent = CSS; document.head.appendChild(st);
    box = document.createElement('div'); box.className = 'vcs'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.hidden = true;
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var t = e.target;
      if (t === box || t.closest('.vcs-no')) { close(false); return; }
      var lg = t.closest('[data-vcs-legal]');
      if (lg) { e.preventDefault(); if (window.VCLegal) VCLegal.open(lg.getAttribute('data-vcs-legal')); return; }
      if (t.closest('.vcs-go')) accept();
    });
    box.addEventListener('change', function (e) { if (e.target.id === 'vcsCb') { var g = box.querySelector('.vcs-go'); g.setAttribute('aria-disabled', String(!e.target.checked)); box.querySelector('.vcs-m').textContent = ''; } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && !box.hidden) close(false); });
  }
  function render() {
    var x = L();
    box.setAttribute('aria-label', x.t);
    box.innerHTML = '<div class="vcs-p"><h3>' + h(x.t) + '</h3><p class="vcs-s">' + h(x.s) + '</p>' +
      x.p.map(function (r) { return '<div class="vcs-i"><i aria-hidden="true">' + r[0] + '</i><div><b>' + h(r[1]) + '</b><span>' + h(r[2]) + '</span></div></div>'; }).join('') +
      '<label class="vcs-c"><input type="checkbox" id="vcsCb"><span>' + h(x.c) + ' <a href="#terms" data-vcs-legal="terms">' + h(x.terms) + '</a> ' + h(x.and) + ' <a href="#privacy" data-vcs-legal="privacy">' + h(x.priv) + '</a></span></label>' +
      '<p class="vcs-m" role="alert" aria-live="polite"></p>' +
      '<div class="vcs-b"><button type="button" class="vcs-no">' + h(x.no) + '</button><button type="button" class="vcs-go" aria-disabled="true">' + h(x.go) + '</button></div>' +
      '<p class="vcs-v">' + h(x.ver) + ' ' + VERSION + '</p></div>';
  }
  function open() {
    ensure(); render(); box.hidden = false; requestAnimationFrame(function () { box.classList.add('on'); });
    document.documentElement.classList.add('vd-lock');
    setTimeout(function () { var c = box.querySelector('#vcsCb'); try { c.focus({ preventScroll: true }); } catch (e) {} }, 80);
    return new Promise(function (res) { pending = res; });
  }
  function close(ok) {
    if (!box) return; box.classList.remove('on'); document.documentElement.classList.remove('vd-lock');
    setTimeout(function () { box.hidden = true; }, 260);
    var p = pending; pending = null; if (p) p(ok);
  }
  function accept() {
    var x = L(), cb = box.querySelector('#vcsCb'), go = box.querySelector('.vcs-go'), m = box.querySelector('.vcs-m');
    if (!cb.checked) { m.textContent = x.need; var lb = box.querySelector('.vcs-c'); lb.classList.remove('err'); void lb.offsetWidth; lb.classList.add('err'); return; }
    if (go.dataset.busy) return; go.dataset.busy = '1'; go.textContent = x.saving;
    realFetch('/api/consent', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agree: true, version: VERSION, kind: 'check' }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (r) {
        delete go.dataset.busy; go.textContent = x.go;
        if (r.ok) { setAck(true); close(true); }
        else m.textContent = (r.d && r.d.error) || x.fail;
      }, function () { delete go.dataset.busy; go.textContent = x.go; m.textContent = x.fail; });
  }

  /* ---- ชั้นที่ 1: ดักปุ่มตรวจก่อนเริ่ม (ไม่ให้หน้ารอตรวจขึ้นมาก่อน) ---- */
  var replay = false;
  window.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#checkBtn') : null;
    if (!b || replay || b.disabled || acked() || !logged()) return;
    try { var ta = document.getElementById('input'); if (window.VCDemo && ta && VCDemo.match(ta.value)) return; } catch (x) {}
    e.preventDefault(); e.stopImmediatePropagation();
    open().then(function (ok) { if (!ok) return; replay = true; try { b.click(); } finally { replay = false; } });
  }, true);

  /* ---- ชั้นที่ 2: เซิร์ฟเวอร์ตอบ 428 → ขอความยินยอมแล้วส่งคำขอเดิมใหม่ ---- */
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var p = realFetch(input, init);
    if (!/\/api\/check(\?|$)/.test(url) || !init || String(init.method || 'GET').toUpperCase() !== 'POST') return p;
    return p.then(function (res) {
      if (res.status !== 428) return res;
      setAck(false);
      return open().then(function (ok) { return ok ? realFetch(input, init) : res; });
    });
  };

  window.VCConsent = { open: open, version: VERSION, accepted: acked };
})();
