(function () {
  function update() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var scrollable = docHeight - winHeight;
    var progress = scrollable > 0 ? (scrollTop / scrollable) : 0;
    var scrollBar = document.getElementById('scroll-bar');
    if (scrollBar) {
      scrollBar.style.transform = 'scaleX(' + progress + ')';
      scrollBar.setAttribute('aria-valuenow', Math.round(progress * 100).toString());
    }
  }

  update();

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  });
})();
