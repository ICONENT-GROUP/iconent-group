(function () {
  /* ============ HERO CANVAS ============
     Three composited layers:
     1. Matrix — falling green digits, columns
     2. Spectrogram — vertical blue dots forming wave bars at bottom third
     3. Particles — drifting mixed-color dots
  */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let w = 0, h = 0;
    const COLORS = {
      green: { r: 0,   g: 255, b: 136 },
      blue:  { r: 61,  g: 139, b: 255 },
      grey:  { r: 140, g: 140, b: 140 }
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      w = canvas.width;
      h = canvas.height;
      initLayers();
    }

    // Matrix
    const matrixFontSize = 14 * dpr;
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテト';
    let matrixCols = [];
    function initMatrix() {
      const columnCount = Math.floor(w / (matrixFontSize * 1.4));
      matrixCols = [];
      for (let i = 0; i < columnCount; i++) {
        matrixCols.push({
          y: Math.random() * h,
          speed: (1.4 + Math.random() * 2.5) * dpr,
          opacity: 0.15 + Math.random() * 0.35
        });
      }
    }

    // Spectrogram
    const specBarCount = 64;
    let specPhases = [];
    function initSpec() {
      specPhases = new Array(specBarCount).fill(0).map(() => Math.random() * Math.PI * 2);
    }

    // Particles
    let particles = [];
    function initParticles() {
      const count = window.innerWidth < 768 ? 40 : 80;
      particles = [];
      const palette = [COLORS.green, COLORS.blue, COLORS.grey];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3 * dpr,
          vy: (Math.random() - 0.5) * 0.3 * dpr,
          r: (0.6 + Math.random() * 1.6) * dpr,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.25 + Math.random() * 0.4
        });
      }
    }

    function initLayers() {
      initMatrix();
      initSpec();
      initParticles();
    }

    let mouseX = w / 2, mouseY = h / 2;
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (e.clientY - rect.top)  * dpr;
    });

    let frame = 0;
    function draw() {
      // soft fade
      ctx.fillStyle = 'rgba(10,10,10,0.18)';
      ctx.fillRect(0, 0, w, h);

      // Matrix layer
      ctx.font = `bold ${matrixFontSize}px ${getComputedStyle(document.body).fontFamily.split(',')[0] || 'monospace'}`;
      for (let i = 0; i < matrixCols.length; i++) {
        const col = matrixCols[i];
        const x = i * matrixFontSize * 1.4;
        const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillStyle = `rgba(0,255,136,${col.opacity})`;
        ctx.fillText(ch, x, col.y);
        col.y += col.speed;
        if (col.y > h + matrixFontSize) {
          col.y = -matrixFontSize;
          col.opacity = 0.15 + Math.random() * 0.35;
        }
      }

      // Spectrogram layer (vertical dot bars in bottom third)
      const specBaseY = h * 0.7;
      const specBarWidth = w / specBarCount;
      for (let i = 0; i < specBarCount; i++) {
        specPhases[i] += 0.04 + (i % 5) * 0.005;
        const amplitude = (Math.sin(specPhases[i]) * 0.5 + 0.5) * h * 0.22;
        const cx = i * specBarWidth + specBarWidth / 2;
        const dotCount = 18;
        for (let d = 0; d < dotCount; d++) {
          const dy = specBaseY - (d / dotCount) * amplitude;
          const a = 0.45 - (d / dotCount) * 0.35;
          if (a <= 0) continue;
          ctx.fillStyle = `rgba(61,139,255,${a})`;
          ctx.beginPath();
          ctx.arc(cx, dy, 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particles layer
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Subtle parallax toward mouse
        const dx = (mouseX - p.x) * 0.00015;
        const dy = (mouseY - p.y) * 0.00015;
        p.x += p.vx + dx;
        p.y += p.vy + dy;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      rafId = requestAnimationFrame(draw);
    }

    let rafId = null;
    resize();
    window.addEventListener('resize', resize);

    function start() {
      if (rafId == null) rafId = requestAnimationFrame(draw);
    }
    function stop() {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    if (prefersReduced) {
      // Draw one static frame and stop
      ctx.fillStyle = 'rgba(10,10,10,1)';
      ctx.fillRect(0, 0, w, h);
      draw(); // one tick
      stop();
    } else {
      start();
    }
  }

  /* ============ COUNT-UP METRICS ============ */
  function initCountUps() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) {
      // Fallback: set final values directly
      els.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        el.textContent = target.toLocaleString('en-US');
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

  function init() {
    initHeroCanvas();
    initCountUps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
