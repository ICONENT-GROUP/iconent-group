/* ============================================================
   HOME HERO — interactive layer (feat/home-redesign-3d)
   - Canvas scan-line overlay (lightweight, idle when off-screen)
   - Count-up tickers triggered on first viewport entry
   - CTA hover glitch via feDisplacementMap scale ramp
   Honors prefers-reduced-motion: reduce throughout.
   ============================================================ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Canvas scan-line overlay ----------
  // A thin moving sweep + faint static lines. Drawn at deviceDPR (capped
  // at 2) so it's crisp on Retina without blowing up the fill rate. Pauses
  // when the hero is off-screen to save CPU/GPU on scroll-down.
  function initScanlines() {
    const canvas = document.querySelector('.home-hero__scanlines');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0, cssH = 0;
    let sweepY = 0;
    let running = !reducedMotion;
    let raf = 0;

    function resize() {
      cssW = canvas.offsetWidth;
      cssH = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, cssW, cssH);

      // Faint static horizontal lines (every 3px). Very low alpha so the
      // FX scene grid + glow underneath stays dominant.
      ctx.fillStyle = 'rgba(0, 255, 136, 0.018)';
      for (let y = 0; y < cssH; y += 3) {
        ctx.fillRect(0, y, cssW, 1);
      }

      // Moving sweep line — green tinted, soft glow.
      ctx.fillStyle = 'rgba(0, 255, 136, 0.06)';
      ctx.fillRect(0, sweepY, cssW, 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.02)';
      ctx.fillRect(0, sweepY - 14, cssW, 28); // glow band around the sweep
      sweepY += 1.1;
      if (sweepY > cssH + 14) sweepY = -14;

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }

    // Pause when the hero scrolls out of view.
    if ('IntersectionObserver' in window) {
      const heroSection = canvas.closest('.home-hero');
      if (heroSection) {
        const io = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start(); else stop();
        }, { rootMargin: '0px' });
        io.observe(heroSection);
      }
    }

    resize();
    window.addEventListener('resize', () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    });

    if (!reducedMotion) raf = requestAnimationFrame(frame);
  }

  // ---------- Count-up tickers ----------
  // Each .home-hero__metric-num with data-count-to animates from 0 to its
  // target on first intersection. Honors reduced-motion (snaps to final).
  function initCountUp() {
    const els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    function runOne(el) {
      const target = parseFloat(el.dataset.countTo);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (reducedMotion || !Number.isFinite(target)) {
        el.textContent = prefix + target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        // easeOutCubic — fast start, soft landing
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: just run them all immediately.
      els.forEach(runOne);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runOne(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => observer.observe(el));
  }

  // ---------- CTA hover glitch ----------
  // On mouseenter, ramp the feDisplacementMap scale 0 → ~3 → 0 over 220ms
  // using a half-sine so the displacement peaks in the middle and resolves
  // back to clean. Adds .is-glitching for the duration so CSS can apply
  // the filter (filter URL refs are expensive — only attach when needed).
  function initCtaGlitch() {
    const cta = document.querySelector('[data-cta-glitch]');
    if (!cta || reducedMotion) return;
    const displacement = document.querySelector('#home-hero-glitch feDisplacementMap');
    if (!displacement) return;

    let running = false;
    cta.addEventListener('mouseenter', () => {
      if (running) return;
      running = true;
      cta.classList.add('is-glitching');
      const duration = 220;
      const peak = 3;
      const start = performance.now();
      function tick(now) {
        const t = (now - start) / duration;
        if (t >= 1) {
          displacement.setAttribute('scale', '0');
          cta.classList.remove('is-glitching');
          running = false;
          return;
        }
        const scale = Math.sin(t * Math.PI) * peak;
        displacement.setAttribute('scale', scale.toFixed(2));
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // ---------- Init ----------
  function init() {
    initScanlines();
    initCountUp();
    initCtaGlitch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
