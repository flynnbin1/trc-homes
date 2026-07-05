/* TRC Homes — scroll hero: five renovation keyframes crossfade through a pin.
   Spec: WEBSITE-SPEC.md §5 brief (Phase 1) + §9/§10 constraints.
   Stages map across the first 85% of the pin; the finished home holds the
   final 15% (the settle). Two-beat headline crossfades as stage 5 arrives.
   prefers-reduced-motion: static stage-5 hero, no pin, no Lenis. */

(function () {
  'use strict';

  var STAGE_COUNT = 5;
  var SETTLE = 0.85;        /* stages complete at 85% of pin distance */
  var BEAT_START = 3.0;     /* headline swap window, in stage-position units */
  var BEAT_SPAN = 0.9;
  var DWELL = 0.3;          /* each stage holds 30% of its segment, dissolves over 40% */

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  /* Pick the set by physical pixels (CSS width × devicePixelRatio) so
     high-DPI screens never upscale: 1284 / 1920 / 2880 (from 4K sources). */
  var need = window.innerWidth * (window.devicePixelRatio || 1);
  var suffix = need <= 1320 ? '-1284.webp' : need <= 2100 ? '-1920.webp' : '-2880.webp';
  var dir = 'assets/keyframes/web/';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var layers = [];
  var clips = [];
  hero.querySelectorAll('.hero-stage').forEach(function (img) {
    var s = Number(img.dataset.stage);
    layers[s] = img;
    clips[s] = img.parentNode; /* .hero-stage-clip — moves the wipe edge */
  });
  var beat1 = hero.querySelector('.beat--1');
  var beat2 = hero.querySelector('.beat--2');
  var progressBar = hero.querySelector('.hero-progress');
  var wipeEdge = hero.querySelector('.hero-wipe-edge');
  var heroW = hero.clientWidth;

  /* Reduced motion: finished home as a still, second headline beat, no scrub. */
  if (reducedMotion) {
    layers[4].src = dir + layers[4].dataset.stem + suffix;
    hero.classList.add('hero--static');
    return;
  }

  var stageBtns = Array.prototype.slice.call(hero.querySelectorAll('.hero-stages button'));

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    var markers = hero.querySelector('.hero-stages');
    if (markers) markers.style.display = 'none'; /* no scrub to jump within */
    return; /* CDN blocked: stage 1 + copy remain a complete static hero */
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll driving ScrollTrigger */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    /* Lenis starts at the top; letting the browser restore a deep scroll
       position on reload makes the two fight (and falsely triggers
       scroll-reveal sections). Take manual control. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* Anchor clicks must go through Lenis or the two scroll systems fight.
       Nav internals untouched — its own listeners (menu close) still run. */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -document.querySelector('.site-nav').offsetHeight });
    });
  }

  /* Confine smoothing to the hero pin. Lenis smooths the wheel ONLY while the
     hero is pinned; past it, the wheel scrolls natively. We flip smoothWheel
     (not stop() — that locks the page) so the instance, gsap.ticker driver and
     ScrollTrigger.update wiring all stay live through the transition. Snapping
     Lenis to the real scroll on each flip means the handover never jumps: when
     smoothing is off Lenis tracks native scroll the same way it already tracks
     the scrollbar, so re-enabling resumes from the exact current position. */
  function setHeroSmooth(on) {
    if (!lenis) return;
    lenis.options.smoothWheel = on;
    lenis.scrollTo(window.scrollY, { immediate: true });
  }

  /* Progressive load: stage 1 is eager HTML; stream 2→5 in story order. */
  var loaded = [false, false, false, false, false];
  var img0 = layers[0];
  if (img0.complete && img0.naturalWidth) loaded[0] = true;
  else img0.addEventListener('load', function () { loaded[0] = true; render(); });

  for (var i = 1; i < STAGE_COUNT; i++) {
    (function (idx) {
      var img = layers[idx];
      img.addEventListener('load', function () { loaded[idx] = true; render(); });
      img.src = dir + img.dataset.stem + suffix;
    })(i);
  }

  /* Highest stage reachable without gaps, so scrubbing never shows a hole
     while later images stream in. */
  function maxContiguous() {
    var m = 0;
    while (m + 1 < STAGE_COUNT && loaded[m + 1]) m++;
    return m;
  }

  function clamp01(t) {
    return t < 0 ? 0 : t > 1 ? 1 : t;
  }

  /* Hold, then sweep: 0 until DWELL, smoothstep across the middle, 1 after. */
  function sweep(f) {
    var t = clamp01((f - DWELL) / (1 - 2 * DWELL));
    return t * t * (3 - 2 * t);
  }

  var state = { p: 0 };

  function render() {
    var p = state.p;

    if (progressBar) progressBar.style.transform = 'scaleX(' + p + ')';

    /* Stage position 0..4 across the first SETTLE of the pin */
    var pos = Math.min(p / SETTLE, 1) * (STAGE_COUNT - 1);
    var cap = maxContiguous();
    if (pos > cap) pos = cap;

    var seg = Math.floor(pos);
    var eased = seg + (seg < STAGE_COUNT - 1 ? sweep(pos - seg) : 0);

    /* Wipe: layer i sweeps in (left→right) while eased runs i-1 → i.
       Composited translate only — the clip wrapper's right edge is the wipe
       front (shifted left by the hidden fraction); the image counter-shifts by
       the same amount so it stays pinned in the viewport. No clip-path repaint.
       Stage 0 sits fully revealed at the bottom of the stack. */
    for (var i = 1; i < STAGE_COUNT; i++) {
      var reveal = clamp01(eased - (i - 1));
      var hidden = (1 - reveal) * 100; /* percent of width still hidden */
      clips[i].style.transform = 'translate3d(-' + hidden + '%, 0, 0)';
      layers[i].style.transform = 'translate3d(' + hidden + '%, 0, 0)';
    }

    /* Gold edge rides the wipe front, only visible mid-sweep */
    var frac = eased - Math.floor(eased);
    if (wipeEdge) {
      if (frac > 0.001 && frac < 0.999) {
        wipeEdge.style.opacity = '1';
        wipeEdge.style.transform = 'translateX(' + Math.round(frac * heroW) + 'px)';
      } else {
        wipeEdge.style.opacity = '0';
      }
    }

    /* Two-beat headline — opacity only */
    var bt = clamp01((pos - BEAT_START) / BEAT_SPAN);
    bt = bt * bt * (3 - 2 * bt);
    beat1.style.opacity = String(1 - bt);
    beat2.style.opacity = String(bt);

    /* Stage markers: highlight the nearest stage */
    var active = Math.round(pos);
    for (var b = 0; b < stageBtns.length; b++) {
      stageBtns[b].classList.toggle('is-active', b === active);
    }
  }

  window.addEventListener('resize', function () {
    heroW = hero.clientWidth;
    render();
  });

  var tween = gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: isMobile ? '+=100%' : '+=140%', /* pin distance = scroll to clear the hero; shorter = faster wipe */
      scrub: 0.1, /* light second ease — Lenis already smooths the wheel; a
                     small value keeps a faint glide without compounding lag */
      pin: true,
      anticipatePin: 1,
      /* isActive is true only between start ('top top') and end — i.e. while
         the hero is pinned. So Lenis smooths inside the pin and hands off to
         native scroll for every section below, re-enabling on scroll-back-up. */
      onToggle: function (self) { setHeroSmooth(self.isActive); }
    },
    onUpdate: render
  });

  /* Press a stage number to scroll the pin to that stage */
  stageBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = Number(btn.dataset.jump);
      var stRef = tween.scrollTrigger;
      var y = stRef.start + (idx / (STAGE_COUNT - 1)) * SETTLE * (stRef.end - stRef.start);
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
