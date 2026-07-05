/* TRC Homes — Enquire: reveal, placeholder form handling, mobile thumb bar.
   The form is NOT connected to an endpoint yet — submitting shows an
   honest note instead of pretending to send. */

(function () {
  'use strict';

  var section = document.querySelector('.enquire');
  if (!section) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Placeholder submit: never pretend success */
  var form = section.querySelector('.enq-form');
  var note = section.querySelector('.enq-form-note');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.hidden = false;
    });
  }

  /* Mobile thumb bar: hide while the enquiry section is on screen
     (its own form and phone number make the bar redundant there) */
  var bar = document.querySelector('.thumb-bar');
  if (bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(section);
  }

  /* Reveal animation — opt-in only */
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  function begin() {
    section.classList.add('js-animate');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    section.querySelectorAll('.enq-copy > *, .enq-form').forEach(function (el) {
      io.observe(el);
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(begin, 300);
  } else {
    window.addEventListener('load', function () {
      setTimeout(begin, 300);
    });
  }
})();
