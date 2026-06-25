(function () {
  'use strict';
  /* ============ HERO WORDMARK — 3D DEPTH-SCAN (looping) ============
     A blue "scanner" beam sweeps across the homepage wordmark every 7s.
     The H1 is rasterized once into a blue, depth-shaded GLOW layer (each
     glyph stroke reads as a rounded 3D tube, brighter at its core). A thick,
     soft band then REVEALS a horizontal slice of that glow as it sweeps,
     using destination-in masking — so the light is strictly clipped to the
     letter shapes: it never appears in counters (the hollow of an O), in the
     gaps between letters, or as white pixels around the outline. It reads as
     one cohesive second layer of light behind the type, not loose particles.
     No-op under prefers-reduced-motion. Global: window.runHeroScan(h1).      */

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.runHeroScan = function () {};
    return;
  }

  var PERIOD = 7000;   // full cycle: one sweep every 7 seconds
  var SWEEP  = 1150;   // active sweep duration (ms) — fast & dynamic
  var HALF   = 0.30;   // band half-height as a fraction of wordmark height (thick beam)

  function easeInOut(p) {
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  }

  // Two-pass chamfer distance transform: for every inside pixel, distance to
  // the nearest glyph EDGE — the real geometry of the strokes (centers far/
  // raised, edges ~0). Mapped to a dome profile each stroke becomes a rounded
  // 3D tube the light curves over.
  function edgeDistance(alpha, W, H) {
    var INF = 1e9, D1 = 1, D2 = 1.41421356, dist = new Float64Array(W * H), k, x, y, v;
    for (k = 0; k < W * H; k++) dist[k] = alpha[k * 4 + 3] > 80 ? INF : 0;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      k = y * W + x; v = dist[k]; if (v === 0) continue;
      if (x > 0) v = Math.min(v, dist[k - 1] + D1);
      if (y > 0) v = Math.min(v, dist[k - W] + D1);
      if (x > 0 && y > 0) v = Math.min(v, dist[k - W - 1] + D2);
      if (x < W - 1 && y > 0) v = Math.min(v, dist[k - W + 1] + D2);
      dist[k] = v;
    }
    for (y = H - 1; y >= 0; y--) for (x = W - 1; x >= 0; x--) {
      k = y * W + x; v = dist[k]; if (v === 0) continue;
      if (x < W - 1) v = Math.min(v, dist[k + 1] + D1);
      if (y < H - 1) v = Math.min(v, dist[k + W] + D1);
      if (x < W - 1 && y < H - 1) v = Math.min(v, dist[k + W + 1] + D2);
      if (x > 0 && y < H - 1) v = Math.min(v, dist[k + W - 1] + D2);
      dist[k] = v;
    }
    return dist;
  }

  // Rasterize the wordmark into a blue, depth-shaded GLOW canvas. Returns the
  // glow canvas + pixel dims, or null if the element isn't laid out yet.
  function buildGlow(h1) {
    var rect = h1.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cs = getComputedStyle(h1);

    var off = document.createElement('canvas');
    off.width = Math.round(rect.width * dpr);
    off.height = Math.round(rect.height * dpr);
    var o = off.getContext('2d');
    o.scale(dpr, dpr);
    o.fillStyle = '#fff';
    o.textBaseline = 'middle';
    var align = cs.textAlign;
    o.textAlign = (align === 'start' || align === 'left') ? 'left'
                : (align === 'end' || align === 'right') ? 'right' : 'center';
    try { o.letterSpacing = cs.letterSpacing; } catch (e) { /* older browsers */ }
    o.font = (cs.font && cs.font.indexOf('px') >= 0)
      ? cs.font
      : (cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily);
    var text = (h1.textContent || '').trim();
    if (cs.textTransform === 'uppercase') text = text.toUpperCase();
    var tx = (o.textAlign === 'left') ? 0 : (o.textAlign === 'right') ? rect.width : rect.width / 2;
    o.fillText(text, tx, rect.height / 2);

    var W = off.width, H = off.height;
    var src = o.getImageData(0, 0, W, H);
    var img = src.data;
    var dist = edgeDistance(img, W, H);

    var maxD = 0, i;
    for (i = 0; i < W * H; i++) if (dist[i] > maxD) maxD = dist[i];
    var K = Math.max(2, maxD * 0.78);

    // Paint the glow: per pixel, alpha follows the glyph mask × stroke height,
    // colour shifts from deep electric blue at the edges to bright azure (NOT
    // white) at the stroke core → a rounded, luminous 3D tube.
    var glow = document.createElement('canvas');
    glow.width = W; glow.height = H;
    var gctx = glow.getContext('2d');
    var gimg = gctx.createImageData(W, H);
    var gd = gimg.data;
    for (i = 0; i < W * H; i++) {
      var a = img[i * 4 + 3];
      if (a <= 40) continue;                         // outside glyph → stays empty
      var h = Math.sqrt(Math.min(1, dist[i] / K));   // 0 = edge, 1 = stroke core
      gd[i * 4]     = Math.round(30 + 120 * h);      // r: 30 → 150
      gd[i * 4 + 1] = Math.round(110 + 110 * h);     // g: 110 → 220
      gd[i * 4 + 2] = 255;                           // b: full
      gd[i * 4 + 3] = Math.round((a / 255) * (0.45 + 0.55 * h) * 255);
    }
    gctx.putImageData(gimg, 0, 0);

    return { glow: glow, W: W, H: H, rect: rect };
  }

  function runHeroScan(h1) {
    if (!h1 || h1.__heroScan) return;
    h1.__heroScan = true;

    var heroEl = h1.closest('.hero') || h1.parentElement;
    var state = null, building = false;

    function build() {
      building = true;
      state = buildGlow(h1);
      building = false;
    }

    // The element may not be laid out the instant the entry animation ends;
    // retry a few times before giving up.
    var tries = 0;
    (function tryBuild() {
      build();
      if (!state && tries++ < 12) { setTimeout(tryBuild, 120); return; }
      if (state) start();
    })();

    function start() {
      var cv = document.createElement('canvas');
      cv.width = state.W; cv.height = state.H;
      cv.setAttribute('aria-hidden', 'true');
      cv.style.cssText = 'position:fixed;pointer-events:none;z-index:9;';
      document.body.appendChild(cv);
      var ctx = cv.getContext('2d');

      // Rebuild on resize (layout/size of the wordmark changes).
      var rT;
      window.addEventListener('resize', function () {
        clearTimeout(rT);
        rT = setTimeout(function () {
          build();
          if (state) { cv.width = state.W; cv.height = state.H; }
        }, 200);
      }, { passive: true });

      function frame(now) {
        if (!state) { requestAnimationFrame(frame); return; }
        var W = state.W, H = state.H;
        var rect = h1.getBoundingClientRect();
        cv.style.left = rect.left + 'px';
        cv.style.top = rect.top + 'px';
        cv.style.width = rect.width + 'px';
        cv.style.height = rect.height + 'px';

        ctx.clearRect(0, 0, W, H);

        // Only while the hero wordmark is on screen and hasn't scrolled away.
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var visible = rect.bottom > 0 && rect.top < vh && window.scrollY < (heroEl.offsetHeight || vh) * 0.4;

        if (visible) {
          var tt = now % PERIOD;                       // ms within the 7s cycle
          if (tt < SWEEP) {
            var p = easeInOut(tt / SWEEP);
            // band centre travels from just below the bottom to just above the
            // top (0 = top, 1 = bottom of the wordmark).
            var scan = (1 + HALF) - p * (1 + 2 * HALF);
            var cy = scan * H;
            var halfPx = HALF * H;

            // 1) lay down the full blue glow layer
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(state.glow, 0, 0);

            // 2) keep only the soft horizontal slice under the beam — this
            //    masking is what clips the light to the letters and kills any
            //    glow in empty space / counters / outline.
            ctx.globalCompositeOperation = 'destination-in';
            var g = ctx.createLinearGradient(0, cy - halfPx, 0, cy + halfPx);
            g.addColorStop(0.00, 'rgba(255,255,255,0)');
            g.addColorStop(0.42, 'rgba(255,255,255,1)');   // bright leading core
            g.addColorStop(0.62, 'rgba(255,255,255,0.85)');
            g.addColorStop(1.00, 'rgba(255,255,255,0)');   // soft trailing glow
            ctx.fillStyle = g;
            ctx.fillRect(0, cy - halfPx, W, halfPx * 2);
            ctx.globalCompositeOperation = 'source-over';
          }
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }

  window.runHeroScan = runHeroScan;
})();
