/* TRC Homes — 3-step enquiry form (front-end step logic only).
   NO backend / GHL wiring yet: on submit we prevent default, show an honest
   inline note, and never reload. Used on the service-page template
   (services/full-renovations.html): a full form in the Deep Pine closing CTA
   band, plus a Step-1 quick-start in the hero that hands off to the full form. */

(function () {
  'use strict';

  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll('.sf-step'));
  var dots = Array.prototype.slice.call(form.querySelectorAll('.sf-dot'));
  var label = form.querySelector('.sf-step-label');
  var note = form.querySelector('.sf-note');
  var total = steps.length;
  var current = 0;

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function show(idx, moveFocus) {
    current = Math.max(0, Math.min(idx, total - 1));
    steps.forEach(function (s, i) { s.hidden = i !== current; });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i <= current); });
    if (label) label.textContent = 'Step ' + (current + 1) + ' of ' + total;
    if (moveFocus) {
      var q = steps[current].querySelector('.sf-q');
      var field = steps[current].querySelector('.sf-option input, textarea, input, button');
      if (q) { q.setAttribute('tabindex', '-1'); q.focus(); }
      else if (field) { field.focus(); }
    }
  }

  function syncSelected() {
    form.querySelectorAll('.sf-option').forEach(function (o) {
      o.classList.toggle('is-selected', !!o.querySelector('input:checked'));
    });
  }

  /* Next / Back */
  form.addEventListener('click', function (e) {
    if (e.target.closest('.sf-next')) { e.preventDefault(); show(current + 1, true); }
    else if (e.target.closest('.sf-back')) { e.preventDefault(); show(current - 1, true); }
  });

  /* keep the selected-tile styling in sync (belt-and-braces alongside :has) */
  form.addEventListener('change', function (e) {
    if (e.target.matches('.sf-option input')) syncSelected();
  });

  /* Submit — honest inline note, no backend, no reload */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('is-done');
    if (note) {
      note.hidden = false;
      note.setAttribute('tabindex', '-1');
      note.focus();
    }
  });

  /* Hero quick-start → set the choice, advance to step 2, scroll to the form */
  Array.prototype.forEach.call(document.querySelectorAll('.hero-qopt'), function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-value');
      var radio = form.querySelector('.sf-option input[value="' + val + '"]');
      if (radio) { radio.checked = true; syncSelected(); }
      show(1, false);
      var target = document.getElementById('enquire');
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  show(0, false);
})();
