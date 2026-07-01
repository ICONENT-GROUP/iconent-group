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

  /* Vimeo facade — defers Vimeo player JS until user clicks Play.
     Cuts ~20s LCP on mobile (Vimeo iframe + its embedded player.js are
     a heavy third-party payload). */
  function setupVimeoFacade() {
    document.querySelectorAll('[data-vimeo-facade]').forEach((wrap) => {
      const playBtn = wrap.querySelector('.sc-video-play');
      const vimeoId = wrap.getAttribute('data-vimeo-id');
      if (!playBtn || !vimeoId) return;

      const swap = () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'ICONENT — Major Label Distribution';
        // Replace poster + play button with the real iframe in one DOM op
        wrap.replaceChildren(iframe);
      };

      playBtn.addEventListener('click', swap);
      // Also swap on click anywhere over the poster (matches user intent
      // on touch devices where tapping the image feels like "play").
      const poster = wrap.querySelector('.sc-video-poster');
      if (poster) poster.addEventListener('click', swap);
    });
  }

  /* Calendly lazy-load — defers widget.js until the booking section
     scrolls into view. Avoids ~150KB of third-party JS on first paint. */
  function setupCalendlyLazy() {
    const widget = document.querySelector('.calendly-inline-widget');
    if (!widget) return;
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    if (!('IntersectionObserver' in window)) {
      // Old browser fallback: load immediately
      injectCalendly();
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        injectCalendly();
      }
    }, { rootMargin: '300px' });
    obs.observe(widget);
  }
  function injectCalendly() {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.head.appendChild(s);
  }

  /* FAQ accordion — .faq-q is a real <button>; sync aria-expanded + .open */
  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function init() {
    setupLock();
    setupCountUps();
    setupSmoothScroll();
    setupVimeoFacade();
    setupCalendlyLazy();
    setupFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
