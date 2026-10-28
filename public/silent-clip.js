/* ใส่คลิปไม่มีเสียงเฉพาะจอคอม/โน้ตบุ๊ก (≥1024px): บนมือถือไม่สร้างองค์ประกอบ ไม่โหลดไฟล์คลิป */
(function () {
  try {
    var mq = window.matchMedia('(min-width: 1024px)');
    var sec = null;
    function sync() {
      var main = document.querySelector('main');
      var hero = document.querySelector('main > .hero');
      if (!main || !hero) return;
      if (!mq.matches) {
        if (sec) sec.hidden = true;
        main.classList.remove('has-silent');
        return;
      }
      if (!sec) {
        sec = document.createElement('section');
        sec.className = 'vs-embed';
        sec.id = 'silentClip';
        sec.setAttribute('aria-label', 'คลิปแนะนำแบบไม่มีเสียง');
        sec.innerHTML = '<iframe class="vs-frame" src="silent-clip.html?v=1" title="คลิปแนะนำ Vellum Check เช็กสัญญา (ไม่มีเสียง)" loading="lazy"></iframe>';
        hero.parentNode.insertBefore(sec, hero.nextSibling);
      }
      sec.hidden = false;
      main.classList.add('has-silent');
    }
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
  } catch (e) {}
})();
