/* TRC Homes — testimonial slider (vanilla, no dependencies).
   Manual controls only (prev/next + dots + arrow keys); no auto-advance.
   Placeholder/sample content on services/full-renovations.html. */

(function () {
  'use strict';

  var slider = document.querySelector('[data-testimonials]');
  if (!slider) return;

  var track = slider.querySelector('.tsl-track');
  var slides = Array.prototype.slice.call(slider.querySelectorAll('.tsl-slide'));
  var dots = Array.prototype.slice.call(slider.querySelectorAll('.tsl-dot'));
  var prev = slider.querySelector('.tsl-prev');
  var next = slider.querySelector('.tsl-next');
  var total = slides.length;
  if (!track || !total) return;

  var index = 0;

  function go(target) {
    index = (target + total) % total;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('is-on', i === index);
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    slides.forEach(function (s, i) {
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
  }

  if (prev) prev.addEventListener('click', function () { go(index - 1); });
  if (next) next.addEventListener('click', function () { go(index + 1); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { go(i); });
  });

  /* left/right arrows move the slider when focus is inside it */
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  go(0);
})();
