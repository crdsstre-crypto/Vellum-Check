/* ปรับความสูง iframe ของคลิปตามเนื้อหาจริง (คลิปส่งความสูงมาทาง postMessage)
   ใช้กับทุกคลิปที่ใส่ class="vc-frame" — เพิ่มคลิปใหม่ไม่ต้องแก้ไฟล์นี้ */
(function () {
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var d = e.data;
    if (d && d.type === 'vc-cta') {
      var c = document.getElementById('contractType');
      var t = (c && (c.closest('.card') || c)) || document.querySelector('.card');
      if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!d || d.type !== 'vc-height' || !(d.h > 0)) return;
    var frames = document.querySelectorAll('iframe.vc-frame');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].style.aspectRatio = 'auto';
        frames[i].style.height = Math.min(d.h, 1200) + 'px';
      }
    }
  });
})();
