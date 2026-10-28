/* ใส่คลิปไม่มีเสียงในพื้นที่ว่างด้านบนของ Hero เฉพาะจอคอม/โน้ตบุ๊ก (≥1024px)
   บนมือถือไม่สร้างองค์ประกอบและไม่โหลดไฟล์คลิป */
(function () {
  try {
    var mq = window.matchMedia('(min-width: 1024px)');
    var sec = null;
    function sync() {
      /* ออกแบบใหม่: คลิปไม่มีเสียงอยู่ในช่อง #silentSlot ของแผ่นคลิป ถ้าไม่มีช่องนี้ ใช้ตำแหน่งเดิม (ลูกแรกของ hero) */
      var slot = document.getElementById('silentSlot');
      var hero = slot || document.querySelector('main > .hero');
      if (!hero) return;
      if (!mq.matches) {
        if (sec) sec.hidden = true;
        return;
      }
      if (!sec) {
        sec = document.createElement('section');
        sec.className = 'vs-embed';
        sec.id = 'silentClip';
        sec.setAttribute('aria-label', 'คลิปแนะนำแบบไม่มีเสียง');
        sec.innerHTML = '<iframe class="vs-frame" src="silent-clip.html?v=2' + (slot ? '' : '&bg=1') + '" title="คลิปแนะนำ Vellum Check เช็กสัญญา (ไม่มีเสียง)"' + (slot ? ' loading="lazy"' : '') + '></iframe>';
        if (slot) slot.appendChild(sec); else hero.insertBefore(sec, hero.firstChild);
      }
      sec.hidden = false;
    }
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
  } catch (e) {}
})();
