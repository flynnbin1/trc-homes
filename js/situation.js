/* TRC Homes — The Situation: lines reveal as they enter the viewport,
   and a reading-focus keeps only the current line at full strength
   (earlier lines soften to 40%). Opts in only when motion is allowed;
   otherwise every line is simply visible at full opacity. */

(function () {
  'use strict';

  var section = document.querySelector('.situation');
  if (!section) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function begin() {
    section.classList.add('js-animate');

    var lines = Array.prototype.slice.call(section.querySelectorAll('.sit-line'));
    var eyebrow = section.querySelector('.sit-eyebrow');
    var currentIndex = -1;

    function setCurrent(idx) {
      if (idx === currentIndex) return;
      currentIndex = idx;
      lines.forEach(function (l, i) {
        l.classList.toggle('is-current', i === idx);
      });
    }

    /* Reveal: latch each element once it enters; the newest revealed
       line becomes the current beat. */
    var revealIO = new IntersectionObserver(function (entries) {
      var newest = -1;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
        var i = lines.indexOf(entry.target);
        if (i > newest) newest = i;
      });
      if (newest > currentIndex) setCurrent(newest);
    }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });

    if (eyebrow) revealIO.observe(eyebrow);
    lines.forEach(function (line) { revealIO.observe(line); });

    /* Reading focus: whichever revealed line sits in the middle band of
       the viewport becomes current — so scrolling back up re-focuses
       earlier lines too. */
    var bandIO = new IntersectionObserver(function (entries) {
      var best = null;
      var bestDist = Infinity;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var r = entry.target.getBoundingClientRect();
        var dist = Math.abs((r.top + r.height / 2) - window.innerHeight / 2);
        if (dist < bestDist) { bestDist = dist; best = entry.target; }
      });
      if (best && best.classList.contains('is-in')) {
        setCurrent(lines.indexOf(best));
      }
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    lines.forEach(function (line) { bandIO.observe(line); });
  }

  /* Start only after load settles: ScrollTrigger's pin measurement can
     transiently scroll the page during its load-time refresh. */
  if (document.readyState === 'complete') {
    setTimeout(begin, 300);
  } else {
    window.addEventListener('load', function () {
      setTimeout(begin, 300);
    });
  }
})();
