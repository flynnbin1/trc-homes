/* TRC Homes — navigation behaviour
   1. Transparent-over-hero → solid Deep Pine once the hero has scrolled past.
   2. Mobile full-screen menu (open/close, Escape, closes on link tap).
   3. Services dropdown: desktop hover/keyboard popover; on mobile the label
      navigates to the hub and the caret toggles the sub-services. */

(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  var hero = document.getElementById('top');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');

  var servicesItem = document.querySelector('.nav-item--services');
  var servicesLink = servicesItem ? servicesItem.querySelector('.nav-link--services') : null;
  var mqMobile = window.matchMedia('(max-width: 767px)');

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
      var link = e.target.closest('a');
      if (!link) return;
      /* On mobile, tapping the Services CARET only toggles the sub-menu — keep the
         overlay open. Every other tap (including the Services label itself, which
         navigates to the Services hub) closes the overlay. */
      if (link === servicesLink && mqMobile.matches && e.target.closest('.nav-caret')) return;
      setMenu(false);
    });
  }

  /* Services dropdown */
  if (servicesItem && servicesLink) {
    /* Mobile: tapping the caret opens/closes the sub-services; tapping the
       "Services" label itself navigates to the Services hub (default click).
       Desktop: default click navigates; the panel opens on hover/focus. */
    servicesLink.addEventListener('click', function (e) {
      if (mqMobile.matches && e.target.closest('.nav-caret')) {
        e.preventDefault();
        e.stopPropagation(); /* keep the overlay open (see menu click handler) */
        var expanded = servicesItem.classList.toggle('is-expanded');
        servicesLink.setAttribute('aria-expanded', String(expanded));
      }
    });

    /* Desktop keyboard: keep aria-expanded in sync with focus, and clear the
       Escape "collapsed" latch once focus genuinely leaves the item. */
    servicesItem.addEventListener('focusin', function () {
      if (!mqMobile.matches) {
        servicesItem.removeAttribute('data-collapsed');
        servicesLink.setAttribute('aria-expanded', 'true');
      }
    });

    servicesItem.addEventListener('focusout', function (e) {
      if (!servicesItem.contains(e.relatedTarget)) {
        servicesItem.removeAttribute('data-collapsed');
        servicesItem.classList.remove('is-expanded');
        servicesLink.setAttribute('aria-expanded', 'false');
      }
    });

    /* Reset state when the viewport crosses the desktop/mobile breakpoint */
    mqMobile.addEventListener('change', function () {
      servicesItem.classList.remove('is-expanded');
      servicesItem.removeAttribute('data-collapsed');
      servicesLink.setAttribute('aria-expanded', 'false');
    });
  }

  /* Escape closes the mobile overlay, or the desktop Services dropdown */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (menu && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
      return;
    }

    if (servicesItem && servicesLink && !mqMobile.matches &&
        servicesItem.contains(document.activeElement)) {
      /* Latch closed while keeping focus on the trigger (CSS reads [data-collapsed]) */
      servicesItem.setAttribute('data-collapsed', '');
      servicesLink.setAttribute('aria-expanded', 'false');
      servicesLink.focus();
    }
  });
})();
