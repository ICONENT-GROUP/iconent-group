/* Strategy Call landing — booking lock countdown + count-up stats + smooth scroll */
(function () {
  const LOCK_DURATION_SECONDS = 30;
  const STORAGE_KEY = 'ic_strategy_call_unlocked';

  function setupLock() {
    const lockEl = document.getElementById('sc-calendar-lock');
    const countdownEl = document.getElementById('sc-countdown');
    if (!lockEl || !countdownEl) return;

    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      lockEl.classList.add('is-unlocked');
      return;
    }

    let remaining = LOCK_DURATION_SECONDS;
    countdownEl.textContent = String(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        countdownEl.textContent = '0';
        lockEl.classList.add('is-unlocked');
        try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
      } else {
        countdownEl.textContent = String(remaining);
      }
    }, 1000);
  }

  /* Count-up animation on stats — fires when element scrolls into view.
     Mirrors the IICY counter in home.js so the visual rhythm is identical. */
  function setupCountUps() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        if (!isNaN(target)) el.textContent = target.toLocaleString('en-US');
      });
      return;
    }

    const easeOutQuad = (t) => t * (2 - t);
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.floor(easeOutQuad(t) * target);
        el.textContent = value.toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    els.forEach((el) => observer.observe(el));
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function init() {
    setupLock();
    setupCountUps();
    setupSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
