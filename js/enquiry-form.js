/* TRC Homes — 3-step enquiry form (front-end step logic only).
   NO backend / GHL wiring yet: on submit we prevent default, show an honest
   inline note, and never reload. Used on the service-page template
   (services/full-renovations.html): a full form in the Deep Pine closing CTA
   band, plus a Step-1 quick-start in the hero that hands off to the full form.

   Every question/field is required: you cannot advance a step (Next) or submit
   until the current step is fully answered. Validation is JS-driven because the
   step Next buttons are type="button" (native constraint validation only fires
   on submit, and would try to focus the visually-hidden radios). */

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

  /* ---- validation: nothing optional ---- */
  function errorEl(stepEl) {
    var el = stepEl.querySelector('.sf-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'sf-error';
      el.setAttribute('role', 'alert');
      el.hidden = true;
      var nav = stepEl.querySelector('.sf-nav');
      if (nav) stepEl.insertBefore(el, nav); else stepEl.appendChild(el);
    }
    return el;
  }

  function clearInvalid(stepEl) {
    stepEl.querySelectorAll('.is-invalid').forEach(function (n) { n.classList.remove('is-invalid'); });
    stepEl.querySelectorAll('[aria-invalid]').forEach(function (n) { n.removeAttribute('aria-invalid'); });
    var e = stepEl.querySelector('.sf-error');
    if (e) e.hidden = true;
  }

  /* every choice group must have a selection; every text field must be filled */
  function collectInvalid(stepEl) {
    var bad = [];
    stepEl.querySelectorAll('.sf-options').forEach(function (g) {
      if (!g.querySelector('input:checked')) bad.push({ node: g, kind: 'group' });
    });
    stepEl.querySelectorAll('textarea, input[type="text"], input[type="tel"], input[type="email"]').forEach(function (f) {
      var v = (f.value || '').trim();
      var invalid = !v || (f.type === 'email' && !/.+@.+\..+/.test(v));
      if (invalid) bad.push({ node: f, kind: 'field', emptyEmail: !v });
    });
    return bad;
  }

  function flagInvalid(stepEl, bad) {
    clearInvalid(stepEl);
    bad.forEach(function (b) {
      if (b.kind === 'group') {
        b.node.classList.add('is-invalid');
      } else {
        var wrap = b.node.closest('.enq-field') || b.node;
        wrap.classList.add('is-invalid');
        b.node.setAttribute('aria-invalid', 'true');
      }
    });
    var msg = errorEl(stepEl);
    var onlyEmailFormat = bad.length === 1 && bad[0].kind === 'field' && bad[0].node.type === 'email' && !bad[0].emptyEmail;
    msg.textContent = onlyEmailFormat
      ? 'Please enter a valid email address.'
      : (bad.length === 1 ? 'Please answer this to continue.' : 'Please answer every question to continue.');
    msg.hidden = false;

    var first = bad[0].node;
    var focusTarget = bad[0].kind === 'group' ? first.querySelector('.sf-option input') : first;
    if (focusTarget && focusTarget.focus) focusTarget.focus();
    (first.scrollIntoView ? first : msg).scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }

  /* Next / Back — Next is gated on a complete step */
  form.addEventListener('click', function (e) {
    if (e.target.closest('.sf-next')) {
      e.preventDefault();
      var stepEl = steps[current];
      var bad = collectInvalid(stepEl);
      if (bad.length) { flagInvalid(stepEl, bad); return; }
      clearInvalid(stepEl);
      show(current + 1, true);
    } else if (e.target.closest('.sf-back')) {
      e.preventDefault();
      clearInvalid(steps[current]);
      show(current - 1, true);
    }
  });

  /* keep the selected-tile styling in sync + clear errors as the user answers */
  form.addEventListener('change', function (e) {
    if (e.target.matches('.sf-option input')) { syncSelected(); clearInvalid(steps[current]); }
  });
  form.addEventListener('input', function (e) {
    if (e.target.matches('textarea, input')) clearInvalid(steps[current]);
  });

  /* GoHighLevel inbound webhook + thank-you redirect. The form has no backend, so on
     submit we POST the collected answers to GHL. Payload keys are named to match the
     TRC GHL sub-account's custom fields exactly. Delivery uses mode:'no-cors' so the
     fetch RESOLVES once the POST actually completes (GHL returns an opaque response we
     don't need to read) — a real delivery sends the browser to /thank-you, where
     the conversion pixels fire. A genuine network failure REJECTS, and we keep the
     user on the form with an honest error instead of a false thank-you (option C). */
  var WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/KdkkX8xmRBvInWZ1D6ne/webhook-trigger/eb7b38e3-3961-47b3-bb2e-26ae33144080';
  var THANK_YOU_URL = '/thank-you';

  function submitEnquiry() {
    var submitBtn = form.querySelector('.sf-submit');
    var settled = false;
    var timer;
    function finish(action) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      action();
    }
    function goToThankYou() { window.location.assign(THANK_YOU_URL); }
    function showFailure() {
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitBtn.dataset.label) submitBtn.textContent = submitBtn.dataset.label;
      }
      var stepEl = steps[current];
      var msg = errorEl(stepEl);
      msg.textContent = 'Sorry — we couldn’t send that just now. Please try again, or call us on +353 21 202 1167.';
      msg.hidden = false;
      (msg.scrollIntoView ? msg : stepEl).scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    }

    var payload;
    try {
      var data = new FormData(form);
      var g = function (k) { return (data.get(k) || '').toString().trim(); };
      var fullName = g('name');
      var sp = fullName.indexOf(' ');
      payload = {
        name: fullName,
        first_name: sp === -1 ? fullName : fullName.slice(0, sp),
        last_name: sp === -1 ? '' : fullName.slice(sp + 1).trim(),
        email: g('email'),
        phone: g('phone'),
        eircode: g('eircode'),                                 /* Step 3 */
        what_are_you_planning: g('planning'),                  /* Step 1 */
        whats_your_rough_budget: g('project_budget'),          /* Step 2 — budget */
        roughly_when_are_you_hoping_to_start: g('timing'),     /* Step 2 — timing */
        is_it_a_home_you_already_own: g('ownership'),          /* Step 2 — ownership */
        anything_else_about_the_project: g('notes'),           /* Step 2 — detail box */
        source: 'TRC Homes website enquiry form',
        page_url: window.location.href
      };
    } catch (err) {
      console.error('[enquiry-form] could not build GHL payload:', err);
      showFailure();
      return;
    }

    if (submitBtn) {
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    /* POST application/json in cors mode. GHL answers the CORS preflight (ACAO: *) and
       returns a readable, CORS-enabled response, so we check the REAL HTTP status: a
       2xx redirects to /thank-you; anything else — or a network failure — keeps the
       user on the form with an honest error (the strongest "no false thank-you"). This
       matches the EGR survey's pattern. We redirect only after the response is in, so
       the POST always completes before navigation; keepalive is belt-and-braces. The
       8s timer treats a hang as a failure, never a false success. */
    timer = setTimeout(function () { finish(showFailure); }, 8000);
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).then(function (res) {
      if (res && res.ok) {
        finish(goToThankYou);
      } else {
        console.error('[enquiry-form] GHL webhook responded ' + (res && res.status));
        finish(showFailure);
      }
    }, function (err) {
      console.error('[enquiry-form] GHL webhook POST failed:', err);
      finish(showFailure);
    });
  }

  /* Submit — gated on a complete final step. Clear any prior send-error, then fire the
     GHL webhook; a confirmed delivery redirects to the thank-you page (which is the
     confirmation + conversion trigger), a failure keeps the user here with an error. */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var stepEl = steps[current];
    var bad = collectInvalid(stepEl);
    if (bad.length) { flagInvalid(stepEl, bad); return; }
    clearInvalid(stepEl);
    submitEnquiry();
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
