(function () {
  var navbar = document.getElementById('navbar');
  var menuToggle = document.getElementById('menu-toggle');
  var menuClose = document.getElementById('menu-close');
  var mobileMenu = document.getElementById('mobile-menu');
  var navLinks = document.querySelectorAll('[data-nav-link]');
  var mobileNavLinks = document.querySelectorAll('[data-nav-link-mobile]');
  var allLinkSelectors = Array.from(navLinks).concat(Array.from(mobileNavLinks));
  var sectionIds = ['work', 'about', 'contact'];

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('bg-surface-black/80', 'backdrop-blur-md', 'border-b', 'border-surface-800');
    } else {
      navbar.classList.remove('bg-surface-black/80', 'backdrop-blur-md', 'border-b', 'border-surface-800');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setActiveLink(activeLink) {
    allLinkSelectors.forEach(function (link) {
      link.classList.remove('bg-accent/20', 'text-accent');
    });
    if (activeLink) {
      activeLink.classList.add('bg-accent/20', 'text-accent');
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.isIntersecting) {
          var id = entry.target.id;
          var link = document.querySelector('[data-nav-link][href="#' + id + '"]');
          if (link) setActiveLink(link);
          var mobileLink = document.querySelector('[data-nav-link-mobile][href="#' + id + '"]');
          if (mobileLink) setActiveLink(mobileLink);
        }
      }
    },
    { threshold: 0.6 }
  );

  function observeSections() {
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
  } else {
    observeSections();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
