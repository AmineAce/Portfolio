(function () {
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight;
        var winHeight = window.innerHeight;
        var scrollable = docHeight - winHeight;
        var progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
        document.documentElement.style.setProperty('--scroll-progress', progress + '%');

        var scrollBar = document.getElementById('scroll-bar');
        if (scrollBar) {
          scrollBar.setAttribute('aria-valuenow', Math.round(progress).toString());
        }

        ticking = false;
      });
      ticking = true;
    }
  });
})();
