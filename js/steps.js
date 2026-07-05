/* TRC Homes — How It Works: eyebrow, intro and steps rise in on entry.
   Opt-in animation only (motion allowed + IntersectionObserver);
   otherwise everything is simply visible. */

(function () {
  'use strict';

  var section = document.querySelector('.steps');
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
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    section.querySelectorAll('.st-eyebrow, .st-intro, .st-step, .st-media').forEach(function (el) {
      io.observe(el);
    });

    /* Timelapse: play only while on screen; browsers may veto autoplay,
       so failures are swallowed and the poster simply remains. */
    var video = section.querySelector('.st-video');
    if (video) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.35 }).observe(video);
    }
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
