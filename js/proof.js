/* TRC Homes — Proof/Projects: gallery tiles rise in as they enter.
   Opt-in animation only (motion allowed + IntersectionObserver);
   otherwise everything is simply visible. */

(function () {
  'use strict';

  var section = document.querySelector('.proof');
  if (!section) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function begin() {
    section.classList.add('js-animate');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    section.querySelectorAll('.pf-eyebrow, .pf-intro, .pf-tile, .pf-note').forEach(function (el) {
      io.observe(el);
    });
  }

  /* Start after load settles — ScrollTrigger's pin measurement transiently
     scrolls the page during its load-time refresh. */
  if (document.readyState === 'complete') {
    setTimeout(begin, 300);
  } else {
    window.addEventListener('load', function () {
      setTimeout(begin, 300);
    });
  }
})();
