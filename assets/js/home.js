(function () {
  /* ============ HERO CANVAS ============
     Three composited layers:
     1. Matrix — falling green digit stacks
     2. Spectrogram-style waveform — vertical dot columns emanating from center
     3. Particles — drifting mixed-color dots with connection lines
  */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      w = canvas.width;
      h = canvas.height;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = {
      green: { r: 0,   g: 255, b: 136 },
      blue:  { r: 61,  g: 139, b: 255 },
      grey:  { r: 140, g: 140, b: 140 }
    };

    /* Particles */
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random();
      const colorKey = r < 0.45 ? 'green' : (r < 0.75 ? 'blue' : 'grey');
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (Math.random() - 0.5) * 0.3 * dpr,
        size: (Math.random() * 1.2 + 0.4) * dpr,
        color: COLORS[colorKey],
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    /* Matrix-style falling numbers */
    const matrixCols = Math.floor(canvas.getBoundingClientRect().width / 30);
    const matrixDrops = [];
    for (let i = 0; i < matrixCols; i++) {
      const chars = [];
      for (let j = 0; j < 12; j++) chars.push(Math.floor(Math.random() * 10).toString());
      matrixDrops.push({
        x: i * 30 * dpr,
        y: Math.random() * h,
        speed: (Math.random() * 1.5 + 0.5) * dpr,
        chars: chars,
        nextChange: 0
      });
    }

    /* Spectrogram waveform */
    let waveOffset = 0;
    const waveColor = { r: 100, g: 220, b: 255 };

    /* Stable pseudo-random so dots don't tremble every frame */
    function pseudoRand(x, t) {
      const v = Math.sin(x * 12.9898 + t * 0.3) * 43758.5453;
      return v - Math.floor(v);
    }

    let rafId = null;

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.14)';
      ctx.fillRect(0, 0, w, h);

      /* Matrix layer */
      ctx.font = (11 * dpr) + 'px ui-monospace, Menlo, "Courier New", monospace';
      matrixDrops.forEach(function (drop) {
        drop.nextChange -= 1;
        if (drop.nextChange <= 0) {
          drop.chars.shift();
          drop.chars.push(Math.floor(Math.random() * 10).toString());
          drop.nextChange = 5 + Math.random() * 8;
        }
        drop.chars.forEach(function (ch, i) {
          const y = drop.y + i * 20 * dpr;
          if (y < 0 || y > h) return;
          if (i === drop.chars.length - 1) {
            ctx.fillStyle = 'rgba(0, 255, 136, 0.55)';
          } else {
            const fade = (i / drop.chars.length) * 0.25;
            ctx.fillStyle = 'rgba(0, 255, 136, ' + fade + ')';
          }
          ctx.fillText(ch, drop.x, y);
        });
        drop.y += drop.speed;
        if (drop.y - drop.chars.length * 20 * dpr > h) drop.y = -50;
      });

      /* Spectrogram waveform */
      waveOffset += 0.025;
      const centerY = h / 2;
      const centerX = w / 2;
      const colStep = 3 * dpr;
      const dotSize = 1.4 * dpr;

      /* Central emanating glow */
      const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 280 * dpr);
      centerGlow.addColorStop(0,   'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ', 0.22)');
      centerGlow.addColorStop(0.4, 'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ', 0.08)');
      centerGlow.addColorStop(1,   'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ', 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, centerY - 280 * dpr, w, 560 * dpr);

      /* Vertical dot columns */
      for (let x = 0; x <= w; x += colStep) {
        const wave1 = Math.sin(x * 0.008  + waveOffset);
        const wave2 = Math.sin(x * 0.025  + waveOffset * 1.4) * 0.55;
        const wave3 = Math.sin(x * 0.055  + waveOffset * 0.7) * 0.35;
        const wave4 = Math.sin(x * 0.11   + waveOffset * 2.1) * 0.18;
        const composite = wave1 + wave2 + wave3 + wave4;

        const baseAmp = Math.abs(composite) * 120 * dpr + 25 * dpr;

        const distFromCenterX = Math.abs(x - centerX);
        const maxDistX = w / 2;
        const fadeX = Math.max(0, 1 - Math.pow(distFromCenterX / maxDistX, 1.3));
        if (fadeX < 0.02) continue;

        const ampBoost = 1 + fadeX * 0.6;
        const amplitude = baseAmp * ampBoost;
        const numDots = Math.floor(amplitude / (3.5 * dpr));

        for (let i = 0; i < numDots; i++) {
          const rand = pseudoRand(x * 0.07 + i * 13.7, waveOffset);
          const yOffset = (rand - 0.5) * 2 * amplitude;
          const y = centerY + yOffset;
          if (y < 0 || y > h) continue;

          const yDist = Math.abs(yOffset) / amplitude;
          const yFade = 1 - Math.pow(yDist, 0.7) * 0.55;
          const dotAlpha = fadeX * yFade * 0.65;

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ',' + dotAlpha + ')';
          ctx.fill();

          if (yDist < 0.35 && fadeX > 0.4) {
            const halo = ctx.createRadialGradient(x, y, 0, x, y, dotSize * 4);
            halo.addColorStop(0, 'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ',' + (dotAlpha * 0.6) + ')');
            halo.addColorStop(1, 'rgba(' + waveColor.r + ',' + waveColor.g + ',' + waveColor.b + ', 0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(x, y, dotSize * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* Particle connections */
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140 * dpr;
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            const r = Math.round((p1.color.r + p2.color.r) / 2);
            const g = Math.round((p1.color.g + p2.color.g) / 2);
            const b = Math.round((p1.color.b + p2.color.b) / 2);
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
            ctx.lineWidth = 0.5 * dpr;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      /* Particles */
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.alpha + ')';
        ctx.fill();

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        gradient.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (p.alpha * 0.35) + ')');
        gradient.addColorStop(1, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ', 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    }

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
      ctx.fillStyle = 'rgba(10,10,10,1)';
      ctx.fillRect(0, 0, w, h);
      draw();
      stop();
    } else {
      start();
    }
  }

  function init() {
    initHeroCanvas();
    /* Count-up metrics (data-count) are handled by shared.js — no need to duplicate here. */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
