(function () {
  'use strict';
  /* ============ HERO WORDMARK — 3D DEPTH-SCAN ============
     Reproduces the concept-site face-scanner (FilmSite FaceScan) on the
     homepage wordmark: the H1 is rasterized to an offscreen canvas, its
     pixels sampled into a point-grid, then a thin accent band sweeps ONCE
     from the BOTTOM to the TOP. A smooth pseudo-depth surface ripples the
     scan line per-point so it reads like a 3D mesh being mapped, not a flat
     line. Fired by the page's hero driver right after the entry glitch ends.
     No-op under prefers-reduced-motion. Global: window.runHeroScan(h1).      */

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.runHeroScan = function () {};
    return;
  }

  // Two-pass chamfer distance transform: for every inside pixel, distance to
  // the nearest glyph EDGE. This is the real geometry of the letters — stroke
  // centers get large distances (raised/closer), edges ~0 (far). Mapped to a
  // dome profile it makes each stroke a rounded 3D tube the scan curves over.
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

  function runHeroScan(h1) {
    if (!h1 || h1.dataset.scanDone === '1') return;
    h1.dataset.scanDone = '1';

    var rect = h1.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cs = getComputedStyle(h1);

    // ---- rasterize the wordmark SHAPE (alpha) into an offscreen canvas ----
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

    // ---- distance transform = real 3D depth of every glyph stroke ----
    var W = off.width, H = off.height;
    var img = o.getImageData(0, 0, W, H).data;
    var dist = edgeDistance(img, W, H);

    // ---- sample inside pixels into points, carrying their stroke depth ----
    var stride = Math.max(2, Math.round(2 * dpr));
    var pts = [], minY = H, maxY = 0, maxD = 0;
    for (var y = 0; y < H; y += stride) {
      for (var x = 0; x < W; x += stride) {
        var k = y * W + x;
        var a = img[k * 4 + 3];
        if (a > 60) {
          var d = dist[k];
          pts.push({ x: x, y: y, a: a / 255, d: d });
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (d > maxD) maxD = d;
        }
      }
    }
    if (!pts.length) return;
    var spanY = Math.max(1, maxY - minY);
    // normalize depth -> height with a dome (sqrt) profile so strokes read as
    // rounded tubes; K based on the thickest stroke keeps it consistent.
    var K = Math.max(2, maxD * 0.78);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.u = p.x / W;
      p.v = (p.y - minY) / spanY;            // 0 = top, 1 = bottom
      p.h = Math.sqrt(Math.min(1, p.d / K)); // 0 = edge (far), 1 = stroke core (near)
      // accent gradient: deep electric blue -> bright sky blue across the wordmark
      var r = Math.round(40 + (90 - 40) * p.u);
      var g = Math.round(120 + (185 - 120) * p.u);
      var b = 255;
      p.col = 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    // ---- overlay canvas pinned over the wordmark ----
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    cv.setAttribute('aria-hidden', 'true');
    cv.setAttribute('data-hero-scan', '1');
    cv.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + rect.top +
      'px;width:' + rect.width + 'px;height:' + rect.height +
      'px;pointer-events:none;z-index:9;mix-blend-mode:screen;';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');

    var DUR = 1500, BAND = 0.045, TRAIL = 0.15, AMP = 0.07;
    var rad = Math.max(1, 1.4 * dpr);
    var t0 = performance.now();

    function frame(now) {
      var t = (now - t0) / DUR;
      ctx.clearRect(0, 0, W, H);
      if (t >= 1.25) { cv.remove(); return; }   // done -> remove, wordmark stays
      var scan = 1.12 - t * 1.24;               // sweep bottom(1.12) -> top(-0.12)
      var fade = t > 1 ? Math.max(0, 1 - (t - 1) / 0.25) : 1;
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        // raised stroke cores (high h) bulge toward the viewer -> scanned a hair
        // earlier, so the band curves OVER each rounded letter instead of flat.
        var sv = p.v - p.h * AMP;
        var dd = sv - scan;
        var fl;
        if (dd >= 0 && dd < BAND) fl = 1 - dd / BAND;               // leading band
        else if (dd < 0 && -dd < TRAIL) fl = (1 + dd / TRAIL) * 0.45; // fading trail
        else continue;
        // shade by height: stroke cores catch the light bright, edges stay dim
        // -> each letter reads as a rounded 3D surface being mapped.
        var op = fl * (0.3 + 0.7 * p.a) * fade * (0.4 + 0.85 * p.h);
        if (op < 0.02) continue;
        if (op > 1) op = 1;
        ctx.globalAlpha = op;
        ctx.fillStyle = p.col;
        var lift = fl * p.h * 5 * dpr;           // parallax pop along the surface
        ctx.fillRect(p.x - rad, p.y - rad - lift, rad * 2, rad * 2);
      }
      // Clip the whole frame to the glyph shape so the scan never bleeds into
      // empty space — counters (the hollow of an O), gaps between letters, or
      // the parallax pop above each stroke. Keeps it precisely mapped.
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(off, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Public entry: play once immediately, then REPEAT the sweep every 7s.
  // Each replay resets the one-shot guard and re-pins to the wordmark's current
  // position; it only fires while the wordmark is on screen so the fixed canvas
  // never flashes floating over the page once you've scrolled past the hero.
  window.runHeroScan = function (h1) {
    if (!h1) return;
    runHeroScan(h1);
    // On resize the wordmark reflows (clamp/vw) but the fixed overlay canvas
    // stays pinned to its old rect, smearing the screen-blend band across the
    // page. Drop any in-flight overlay on resize; the 7s loop re-pins a fresh
    // one cleanly. Bound once per page.
    if (!window.__heroScanResizeBound) {
      window.__heroScanResizeBound = true;
      window.addEventListener('resize', function () {
        var olds = document.querySelectorAll('canvas[data-hero-scan]');
        for (var i = 0; i < olds.length; i++) olds[i].remove();
      }, { passive: true });
    }
    setInterval(function () {
      var r = h1.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom > 0 && r.top < vh) {
        h1.dataset.scanDone = '';
        runHeroScan(h1);
      }
    }, 7000);
  };
})();
