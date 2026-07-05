/* TRC Homes — navigation behaviour
   1. Transparent-over-hero → solid Deep Pine once the hero has scrolled past.
   2. Mobile full-screen menu (open/close, Escape, closes on link tap). */

(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  var hero = document.getElementById('top');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');

  /* Solid background once the hero has passed behind the nav bar.
     rootMargin excludes the nav-height strip at the top, so the strip of
     hero that legitimately sits behind the nav at anchor positions
     doesn't hold the nav transparent. */
  if (nav && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-solid', !entries[0].isIntersecting);
    }, { rootMargin: '-' + (nav.offsetHeight + 1) + 'px 0px 0px 0px' }).observe(hero);
  } else if (nav) {
    nav.classList.add('is-solid'); /* very old browser: always legible */
  }

  /* Mobile menu */
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (e) {
      /* any anchor in the overlay (section links + consultation CTA) closes it */
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }
})();
