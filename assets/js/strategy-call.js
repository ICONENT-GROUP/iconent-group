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

  /* Video facade — nothing is fetched until the user clicks Play, so the
     poster is the only cost on first paint. Same trick as the old Vimeo
     facade (which saved ~20s LCP on mobile), except the file is now ours:
     self-hosted on the Vercel CDN, no third-party player, no cookies.
     The mp4 is 1080p/faststart: nothing downloads until Play, and the moov
     atom is up front so playback starts while the rest still streams. */
  function setupVideoFacade() {
    document.querySelectorAll('[data-video-facade]').forEach((wrap) => {
      const playBtn = wrap.querySelector('.sc-video-play');
      const src = wrap.getAttribute('data-video-src');
      if (!playBtn || !src) return;

      const swap = () => {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true; // iOS: play inline instead of going fullscreen
        video.preload = 'auto';
        video.setAttribute('title', 'ICONENT — Major Label Distribution');
        trackProgress(video);
        // Replace poster + play button with the real player in one DOM op
        wrap.replaceChildren(video);
      };

      playBtn.addEventListener('click', swap);
      // Also swap on click anywhere over the poster (matches user intent
      // on touch devices where tapping the image feels like "play").
      const poster = wrap.querySelector('.sc-video-poster');
      if (poster) poster.addEventListener('click', swap);
    });
  }

  /* Retention milestones — the one thing a hosted player gave us for free.
     Fires each quarter once, so we still know where viewers drop off. */
  function trackProgress(video) {
    const marks = [25, 50, 75, 100];
    const fired = new Set();
    const send = (pct) => {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'VSLProgress', { percent: pct });
      }
    };
    video.addEventListener('play', function onFirst() {
      send(0);
      video.removeEventListener('play', onFirst);
    });
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      marks.forEach((m) => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          send(m);
        }
      });
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
    setupVideoFacade();
    setupCalendlyLazy();
    setupFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
