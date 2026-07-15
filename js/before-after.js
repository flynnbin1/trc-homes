/* TRC Homes — before/after slider (reusable).
   One handler for every [data-ba-slider] on the page. Mouse, touch and keyboard.
   The wipe is a clip-path update only (no layout thrash, no transitions), so
   prefers-reduced-motion needs nothing special. Vertical page scroll stays free
   because the track is touch-action: pan-y; the handle is touch-action: none. */
(function () {
  'use strict';

  var sliders = document.querySelectorAll('[data-ba-slider]');
  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    var handle = slider.querySelector('.ba-handle');
    var dragging = false;

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', pct + '%');
      if (handle) handle.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    function posFromEvent(e) {
      var rect = slider.getBoundingClientRect();
      if (!rect.width) return 50;
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    slider.addEventListener('pointerdown', function (e) {
      if (!e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      try { slider.setPointerCapture(e.pointerId); } catch (err) {}
      /* Mouse/pen: jump to the click. Touch: wait for the first move so a
         vertical scroll that starts on the image doesn't nudge the wipe. */
      if (e.pointerType !== 'touch') setPos(posFromEvent(e));
      if (handle) handle.focus({ preventScroll: true });
    });

    slider.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      setPos(posFromEvent(e));
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      try { slider.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);

    /* Keyboard on the handle (role="slider") */
    if (handle) {
      handle.addEventListener('keydown', function (e) {
        var cur = parseFloat(handle.getAttribute('aria-valuenow'));
        if (isNaN(cur)) cur = 50;
        var step = e.shiftKey ? 10 : 2;
        var next;
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowDown': next = cur - step; break;
          case 'ArrowRight':
          case 'ArrowUp': next = cur + step; break;
          case 'PageDown': next = cur - 10; break;
          case 'PageUp': next = cur + 10; break;
          case 'Home': next = 0; break;
          case 'End': next = 100; break;
          default: return;
        }
        e.preventDefault();
        setPos(next);
      });
    }
  });
})();
