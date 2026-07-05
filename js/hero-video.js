/* TRC Homes — scroll hero: three renovation clips as ONE continuous frame
   sequence, scrubbed through a pin. Replaces the original five-keyframe wipe
   (js/hero.js) on index.html; the keyframe hero is preserved at
   hero-keyframes-demo.html. Spec: WEBSITE-SPEC.md §5.

   Timeline: the 79-frame sequence (dated → strip-out → render → finished) plays
   across the first 85% of the pin; the finished home holds the final 15% (the
   settle). Two-beat headline crossfades as the finished home arrives, and the
   FREE CONSULTATION button fills solid white once the home is finished.
   Frames are served in two tiers by viewport: 1920px HD ≥768px, 960px <768px.
   prefers-reduced-motion: static finished-home frame, no pin, no Lenis. */

(function () {
  'use strict';

  var FRAME_COUNT = 79;
  /* Two tiers of the same 79-frame sequence, chosen on the same 768px break
     the pin length uses: sharp HD on desktop, lighter set on mobile. */
  var FRAME_DIR = window.matchMedia('(max-width: 767px)').matches
    ? 'assets/hero-video/frames-mobile/'
    : 'assets/hero-video/frames-hd/';
  var SETTLE = 0.85;        /* frames complete at 85% of pin; finished home holds last 15% */
  var BEAT_START = 3.0;     /* headline swap window, in 0..4 stage-position units */
  var BEAT_SPAN = 0.9;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  var hero = document.querySelector('.hero');
  if (!hero) return;
  var canvas = hero.querySelector('.hero-frames');
  if (!canvas) return; /* not the video hero (e.g. keyframe hero present) */

  var ctx = canvas.getContext('2d');
  var beat1 = hero.querySelector('.beat--1');
  var beat2 = hero.querySelector('.beat--2');
  var progressBar = hero.querySelector('.hero-progress');
  var consultBtn = hero.querySelector('.btn-consult--hero');

  /* ---- Frame preload ---- */
  var frames = new Array(FRAME_COUNT);
  var loaded = new Array(FRAME_COUNT).fill(false);
  function pad(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

  var lastDrawn = -1;

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  /* Highest frame index reachable with no gap, so the scrub never shows a hole
     while later frames stream in. */
  function maxContiguous() {
    var m = 0;
    while (m + 1 < FRAME_COUNT && loaded[m + 1]) m++;
    return m;
  }

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = hero.clientWidth, h = hero.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  /* object-fit: cover, centred */
  function drawFrame(idx) {
    var img = frames[idx];
    if (!img || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastDrawn = idx;
  }

  for (var i = 0; i < FRAME_COUNT; i++) {
    (function (idx) {
      var img = new Image();
      img.decoding = 'async';
      img.addEventListener('load', function () {
        loaded[idx] = true;
        if (idx === 0 && lastDrawn === -1) drawFrame(0);
        else render();
      });
      img.src = FRAME_DIR + 'frame-' + pad(idx + 1) + '.webp';
      frames[idx] = img;
    })(i);
  }

  var state = { p: 0 };

  function render() {
    var p = state.p;
    if (progressBar) progressBar.style.transform = 'scaleX(' + p + ')';

    /* frame position across the first SETTLE of the pin, then hold */
    var fp = Math.min(p / SETTLE, 1);           /* 0..1 over the renovation */
    var idx = Math.round(fp * (FRAME_COUNT - 1));
    var cap = maxContiguous();
    if (idx > cap) idx = cap;
    if (idx !== lastDrawn) drawFrame(idx);

    /* Two-beat headline — opacity only. Beats swap over stage-position 3.0–3.9
       (fp 0.75–0.975), so the headline resolves as the finished home lands. */
    var pos = fp * 4;
    var bt = clamp01((pos - BEAT_START) / BEAT_SPAN);
    bt = bt * bt * (3 - 2 * bt);
    beat1.style.opacity = String(1 - bt);
    beat2.style.opacity = String(bt);

    /* Button fills solid white once the finished home settles in (fp hits 1 at
       p >= SETTLE, the start of the 15% finished-home hold). */
    if (consultBtn) consultBtn.classList.toggle('is-finished', fp >= 1);
  }

  /* ---- Reduced motion: static finished home, second beat, no pin ---- */
  if (reducedMotion) {
    sizeCanvas();
    hero.classList.add('hero--static');
    beat1.style.opacity = '0';
    beat2.style.opacity = '1';
    if (consultBtn) consultBtn.classList.add('is-finished'); /* finished home is shown */
    if (progressBar) progressBar.style.display = 'none';
    var last = new Image();
    last.addEventListener('load', function () {
      frames[FRAME_COUNT - 1] = last;
      loaded[FRAME_COUNT - 1] = true;
      drawFrame(FRAME_COUNT - 1);
    });
    last.src = FRAME_DIR + 'frame-' + pad(FRAME_COUNT) + '.webp';
    return;
  }

  sizeCanvas();

  /* ---- No GSAP (CDN blocked): first frame + copy remain a static hero ---- */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    var f0 = new Image();
    f0.addEventListener('load', function () {
      frames[0] = f0; loaded[0] = true; drawFrame(0);
    });
    f0.src = FRAME_DIR + 'frame-001.webp';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---- Lenis smooth scroll driving ScrollTrigger (same wiring as js/hero.js so
     the rest of the page's scroll-reveal sections keep working) ---- */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -document.querySelector('.site-nav').offsetHeight });
    });
  }

  /* Confine smoothing to the hero pin (same handoff pattern as js/hero.js) */
  function setHeroSmooth(on) {
    if (!lenis) return;
    lenis.options.smoothWheel = on;
    lenis.scrollTo(window.scrollY, { immediate: true });
  }

  window.addEventListener('resize', function () {
    sizeCanvas();
    lastDrawn = -1;
    render();
  });

  gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: isMobile ? '+=100%' : '+=140%',
      scrub: 0.1,
      pin: true,
      anticipatePin: 1,
      onToggle: function (self) { setHeroSmooth(self.isActive); }
    },
    onUpdate: render
  });
})();
