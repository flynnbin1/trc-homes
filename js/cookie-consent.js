/* TRC Homes — cookie consent (custom, GDPR / ePrivacy + Google Consent Mode v2).
   A bottom bar with EQUAL "Reject all" / "Accept all" plus a "Manage" preferences
   panel (Necessary / Analytics / Marketing). Non-essential tags are BLOCKED until the
   visitor consents. The choice is stored in localStorage and can be changed any time
   via a link with [data-cookie-settings] (e.g. the footer "Cookie settings").

   ── WIRING THE ACTUAL TAGS (when the IDs are available) ─────────────────────────────
   Paste your snippets into loadAnalytics() and loadMarketing() below. They run ONLY
   when that category is granted, and Google Consent Mode v2 signals are already sent,
   so a "Reject all" visitor gets no analytics/ad cookies. Nothing else to change. */
(function () {
  'use strict';

  var STORE_KEY = 'trc-cookie-consent-v1';

  /* ---- Google Consent Mode v2 ----
     The DENIED defaults are set inline in each page's <head>, BEFORE the Google Tag
     Manager snippet, so they apply before any tag can load. Here we only keep a
     dataLayer/gtag reference to push the consent UPDATE when the visitor chooses. */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
  }
  function saveConsent(c) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(c)); } catch (e) {}
  }

  var analyticsLoaded = false, marketingLoaded = false;

  function applyConsent(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.analytics) loadAnalytics();
    if (c.marketing) loadMarketing();
  }

  /* === PASTE GOOGLE ANALYTICS / GOOGLE ADS HERE — runs only on Analytics consent === */
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    /* e.g.
       var s = document.createElement('script'); s.async = true;
       s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
       document.head.appendChild(s);
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');            // GA4
       gtag('config', 'AW-XXXXXXXXX');            // Google Ads    */
  }

  /* Meta (Facebook) Pixel — loaded ONLY after Marketing consent, never before. The
     <noscript> image fallback from Meta's snippet is intentionally omitted: it can't be
     consent-gated, and a no-JS visitor can't be shown the consent banner anyway. */
  function loadMarketing() {
    if (marketingLoaded) return;
    marketingLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3748919445262473');
    fbq('track', 'PageView');
  }

  /* ---------- UI ---------- */
  var bar, panel, lastFocus;

  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  function buildBar() {
    bar = h(
      '<div class="cc-bar" role="region" aria-label="Cookie consent">' +
        '<div class="cc-bar-inner">' +
          '<p class="cc-text">We use cookies to run this site and, with your consent, to measure our Facebook and Google advertising. See our <a href="/privacy">Privacy&nbsp;Policy</a>.</p>' +
          '<div class="cc-actions">' +
            '<button type="button" class="cc-btn" data-cc="reject">Reject all</button>' +
            '<button type="button" class="cc-btn cc-btn--ghost" data-cc="manage">Manage</button>' +
            '<button type="button" class="cc-btn cc-btn--primary" data-cc="accept">Accept all</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    document.body.appendChild(bar);
  }

  function buildPanel() {
    panel = h(
      '<div class="cc-panel-backdrop" hidden>' +
        '<div class="cc-panel" role="dialog" aria-modal="true" aria-labelledby="cc-panel-title">' +
          '<h2 id="cc-panel-title" class="cc-panel-title">Cookie preferences</h2>' +
          '<p class="cc-panel-lead">Choose which cookies we can use. You can change this any time from &ldquo;Cookie settings&rdquo; in the footer.</p>' +
          '<ul class="cc-cats">' +
            '<li class="cc-cat">' +
              '<div class="cc-cat-head"><span class="cc-cat-name">Necessary</span><span class="cc-cat-always">Always on</span></div>' +
              '<p class="cc-cat-desc">Required for the site to work &mdash; navigation, the enquiry form and security. No tracking.</p>' +
            '</li>' +
            '<li class="cc-cat">' +
              '<label class="cc-cat-head"><span class="cc-cat-name">Analytics</span><input type="checkbox" class="cc-toggle" data-cat="analytics"></label>' +
              '<p class="cc-cat-desc">Helps us understand how the site is used so we can improve it (e.g. Google Analytics).</p>' +
            '</li>' +
            '<li class="cc-cat">' +
              '<label class="cc-cat-head"><span class="cc-cat-name">Marketing</span><input type="checkbox" class="cc-toggle" data-cat="marketing"></label>' +
              '<p class="cc-cat-desc">Lets us measure our Facebook and Google ads and show relevant ads (Meta Pixel, Google Ads).</p>' +
            '</li>' +
          '</ul>' +
          '<div class="cc-panel-actions">' +
            '<button type="button" class="cc-btn cc-btn--ghost" data-cc="save">Save preferences</button>' +
            '<button type="button" class="cc-btn cc-btn--primary" data-cc="accept">Accept all</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    document.body.appendChild(panel);
    panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });
  }

  function showBar() { if (bar) bar.classList.add('is-shown'); }
  function hideBar() { if (bar) bar.classList.remove('is-shown'); }

  function openPanel() {
    lastFocus = document.activeElement;
    var c = readConsent() || { analytics: false, marketing: false };
    panel.querySelectorAll('.cc-toggle').forEach(function (t) { t.checked = !!c[t.getAttribute('data-cat')]; });
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = panel.querySelector('.cc-toggle');
    if (first) first.focus();
  }
  function closePanel() {
    panel.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function commit(c) {
    saveConsent(c);
    applyConsent(c);
    hideBar();
    if (panel && !panel.hidden) closePanel();
  }

  function onClick(e) {
    var btn = e.target.closest('[data-cc]');
    if (!btn) return;
    var a = btn.getAttribute('data-cc');
    if (a === 'accept') commit({ analytics: true, marketing: true });
    else if (a === 'reject') commit({ analytics: false, marketing: false });
    else if (a === 'manage') openPanel();
    else if (a === 'save') {
      var c = { analytics: false, marketing: false };
      panel.querySelectorAll('.cc-toggle').forEach(function (t) { c[t.getAttribute('data-cat')] = t.checked; });
      commit(c);
    }
  }

  function init() {
    buildBar();
    buildPanel();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel && !panel.hidden) closePanel(); });
    /* reopen from any footer/link with [data-cookie-settings] */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-cookie-settings]');
      if (link) { e.preventDefault(); openPanel(); }
    });

    var stored = readConsent();
    if (stored) applyConsent(stored);   // returning visitor — no banner
    else showBar();                     // first visit — ask
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
