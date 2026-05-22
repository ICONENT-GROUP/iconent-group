(function () {
  const HEADER_HTML = `
    <header class="ic-hdr" role="banner">
      <a class="ic-hdr-logo" href="/">ICONENT GROUP</a>
      <nav class="ic-hdr-nav" aria-label="Primary">
        <div class="ic-hdr-services">
          <a href="/services-project-management.html" data-path="/services-project-management">Services</a>
          <div class="ic-hdr-services-menu" role="menu">
            <a class="featured" href="/services-project-management.html" data-path="/services-project-management" role="menuitem">Project Management</a>
            <a href="/services-spotify.html"    data-path="/services-spotify"    role="menuitem">Spotify Promotion</a>
            <a href="/services-youtube.html"    data-path="/services-youtube"    role="menuitem">YouTube Promotion</a>
            <a href="/services-instagram.html"  data-path="/services-instagram"  role="menuitem">Instagram Promotion</a>
            <a href="/services-tiktok.html"     data-path="/services-tiktok"     role="menuitem">TikTok Promotion</a>
          </div>
        </div>
        <a href="/" data-path="/">Home</a>
        <a class="ic-hdr-cta" href="/contact-us.html" data-path="/contact-us">Contact Us</a>
      </nav>
      <button class="ic-hdr-burger" type="button" aria-label="Open menu" aria-expanded="false"></button>
    </header>
    <!-- Mobile menu is a sibling of <header>, NOT a child.
         Reason: .ic-hdr.scrolled has backdrop-filter which creates a
         containing block — a fixed-positioned child would be clipped to
         the header's 52px box. Keeping the menu as a sibling avoids that. -->
    <div class="ic-hdr-mobile" role="menu">
      <a href="/" data-path="/" class="ic-hdr-mobile-home">Home</a>
      <p class="ic-hdr-mobile-label">Services</p>
      <a class="featured" href="/services-project-management.html" data-path="/services-project-management">Project Management</a>
      <a href="/services-spotify.html"    data-path="/services-spotify">Spotify</a>
      <a href="/services-youtube.html"    data-path="/services-youtube">YouTube</a>
      <a href="/services-instagram.html"  data-path="/services-instagram">Instagram</a>
      <a href="/services-tiktok.html"     data-path="/services-tiktok">TikTok</a>
      <a class="ic-hdr-cta ic-hdr-mobile-contact" href="/contact-us.html" data-path="/contact-us">Contact Us</a>
    </div>`;

  const FOOTER_HTML = `
    <div class="ic-ftr-root">
      <footer class="ic-ftr-block" role="contentinfo">
        <div class="ic-ftr-block-inner">
          <div class="ic-ftr-block-social">
            <a href="https://www.instagram.com/iconent_group/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/ICONENTGROUP" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </a>
          </div>
          <p class="ic-ftr-block-brand">ICONENT GROUP</p>
          <p class="ic-ftr-block-tagline">Next-Generation Music Industry System</p>
          <p class="ic-ftr-block-address">99 Wall Street, New York, NY, United States, 10005</p>
          <p class="ic-ftr-block-legal">
            <a href="/privacy-policy.html">Privacy Policy</a>
            <span class="ic-ftr-block-legal-sep">·</span>
            <a href="/terms.html">Terms of Service</a>
          </p>
          <p class="ic-ftr-block-copyright">© 2026 ICONENT GROUP. All rights reserved.</p>
        </div>
      </footer>
    </div>`;

  function pathMatches(linkPath, currentPath) {
    if (linkPath === '/' && currentPath === '/') return true;
    return currentPath.replace(/\.html$/, '') === linkPath;
  }

  function markActive(root) {
    const current = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
    root.querySelectorAll('[data-path]').forEach((a) => {
      if (pathMatches(a.dataset.path, current)) a.classList.add('is-active');
    });
  }

  class IcHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = HEADER_HTML;
      const hdr = this.querySelector('.ic-hdr');
      markActive(this);
      // Burger toggle — toggle is-open on the <ic-header> host (this), not on
      // <header>. The mobile menu is now a sibling of <header> (see HEADER_HTML
      // for why); the selector `ic-header.is-open .ic-hdr-mobile` opens it.
      const burger = this.querySelector('.ic-hdr-burger');
      burger.addEventListener('click', () => {
        const open = this.classList.toggle('is-open');
        // Keep .ic-hdr in sync for any styling that still references it
        hdr.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('no-scroll', open);
      });
      // Close mobile on link click
      const closeMenu = () => {
        this.classList.remove('is-open');
        hdr.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('no-scroll');
      };
      this.querySelectorAll('.ic-hdr-mobile a').forEach((a) => {
        a.addEventListener('click', closeMenu);
      });

      // Click on the mobile menu background (anywhere that's not a link or
      // label) closes the menu — gives users an intuitive "tap outside" exit
      // beyond just tapping the burger again.
      const mobileMenu = this.querySelector('.ic-hdr-mobile');
      if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
          if (e.target === mobileMenu) closeMenu();
        });
      }
      // Click anywhere outside <ic-header> closes the menu too (defensive —
      // covers cases where users tap on visible page content under a
      // partially-transparent menu, or on the body if menu doesn't fully
      // cover the viewport on some devices).
      document.addEventListener('click', (e) => {
        if (!this.classList.contains('is-open')) return;
        if (this.contains(e.target)) return;
        closeMenu();
      });
      // Scroll → .scrolled
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          hdr.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      // Book-a-Call buttons: handled by global delegation in calendly.js
      // ESC closes mobile
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // Desktop services dropdown: click toggles open/closed state.
      // The CSS opens the menu on :hover too, so to "close on second click"
      // we need an is-closed class that overrides hover. is-closed clears
      // automatically when the cursor leaves the wrapper, so the next hover
      // gets a fresh state.
      const services = this.querySelector('.ic-hdr-services');
      const servicesLink = services && services.querySelector(':scope > a');
      if (services && servicesLink) {
        servicesLink.addEventListener('click', (e) => {
          if (!window.matchMedia('(min-width: 901px)').matches) return;
          e.preventDefault();
          const visuallyOpen = services.classList.contains('is-open') ||
            (services.matches(':hover') && !services.classList.contains('is-closed'));
          if (visuallyOpen) {
            services.classList.remove('is-open');
            services.classList.add('is-closed');
          } else {
            services.classList.add('is-open');
            services.classList.remove('is-closed');
          }
        });
        // When the cursor leaves the services wrapper, clear the force-closed
        // flag so the next :hover opens normally.
        services.addEventListener('mouseleave', () => {
          services.classList.remove('is-closed');
          services.classList.remove('is-open');
        });
        // Click outside closes
        document.addEventListener('click', (e) => {
          if (!services.contains(e.target)) {
            services.classList.remove('is-open');
            services.classList.remove('is-closed');
          }
        });
        // ESC closes
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            services.classList.remove('is-open');
            services.classList.remove('is-closed');
          }
        });
      }
    }
  }

  class IcFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = FOOTER_HTML;
    }
  }

  customElements.define('ic-header', IcHeader);
  customElements.define('ic-footer', IcFooter);

  /* ============================================================
     HOLOGRAPHIC FX BACKGROUND
     Two modes:
       - HOME (.hero present): scene attached at <body> level with
         position: fixed so it stays visible during scroll. A
         scroll-driven dark overlay (.ic-fx-darken) progressively
         dims the fx as the user scrolls down.
       - SERVICE PAGES (.platform-page or .pm-page): scene injected
         inside .hero-compact only, scoped to the title area.
       - OTHER PAGES: no fx.
     Glitch effects honor prefers-reduced-motion.
     ============================================================ */
  function injectFxScene() {
    if (document.querySelector('.ic-fx-scene')) return;

    const hero = document.querySelector('.hero');
    const isStrategyCall = document.body.classList.contains('strategy-call-page');
    const isServicePage = document.body.classList.contains('platform-page')
                       || document.body.classList.contains('pm-page');

    let target = null;
    let globalMode = false;
    if (hero || isStrategyCall) {
      target = document.body;
      globalMode = true;
    } else if (isServicePage) {
      target = document.querySelector('.hero-compact');
    }
    if (!target) return;

    const scene = document.createElement('div');
    scene.className = 'ic-fx-scene' + (globalMode ? ' ic-fx-scene--global' : '');
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = `
      <div class="ic-fx-glow"></div>
      <div class="ic-fx-grid"></div>
      <div class="ic-fx-edge-noise"></div>
      <div class="ic-fx-scanlines"></div>
      <div class="ic-fx-sweep"></div>
      <div class="ic-fx-chroma" id="ic-fx-chroma"></div>
      <div class="ic-fx-glitch-bars" id="ic-fx-glitch-bars"></div>
      <div class="ic-fx-tear" id="ic-fx-tear"></div>
      <svg class="ic-fx-noise" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="ic-fx-film-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.65  0 0 0 0 0.85  0 0 0 0 0.88  0 0 0 0.55 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#ic-fx-film-noise)"/>
      </svg>
      <div class="ic-fx-vignette"></div>
      ${globalMode ? '' : '<div class="ic-fx-fade-bottom"></div>'}`;
    target.insertBefore(scene, target.firstChild);

    if (globalMode) {
      const darken = document.createElement('div');
      darken.className = 'ic-fx-darken';
      darken.setAttribute('aria-hidden', 'true');
      target.insertBefore(darken, scene.nextSibling);
      setupScrollDarken(darken);
    }

    initFxGlitch();
  }

  function setupScrollDarken(darken) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      darken.style.opacity = '0';
      return;
    }
    // Strategy-call gets a quick fade (~one viewport) so the fx behaves
    // like the service-pages fade-bottom. Home gets a slower fade across
    // ~two viewports for a more gradual reveal of the body content.
    const isStrategyCall = document.body.classList.contains('strategy-call-page');
    const maxScroll = isStrategyCall ? 650 : 1800;
    const maxOpacity = isStrategyCall ? 0.98 : 0.92;
    let ticking = false;
    const update = () => {
      const opacity = Math.min(maxOpacity, window.scrollY / maxScroll);
      darken.style.opacity = opacity.toFixed(3);
      ticking = false;
    };
    update();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  function initFxGlitch() {
    const reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionMq.matches) return;
    const chroma = document.getElementById('ic-fx-chroma');
    const bars   = document.getElementById('ic-fx-glitch-bars');
    const tear   = document.getElementById('ic-fx-tear');
    if (!chroma || !bars || !tear) return;

    // Track active state from BOTH tab visibility and runtime reduce-motion
    // preference (a user can toggle reduce-motion mid-session).
    let tabVisible = !document.hidden;
    let reduceMotion = reduceMotionMq.matches;
    const active = () => tabVisible && !reduceMotion;

    // Track scheduled timeouts so we can fully stop the animation chains
    // when the tab is hidden (avoids burning battery in background).
    const timers = new Set();
    const schedule = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };
    const stopAll = () => {
      timers.forEach(id => clearTimeout(id));
      timers.clear();
    };

    // Batched style writes via cssText — single reflow per element per cycle
    // (vs 3 reflows when assigning .style.X individually). Visual output is
    // identical; only the layout invalidation cost drops.
    function triggerChroma() {
      if (active()) {
        chroma.classList.remove('glitching');
        // Force reflow so the animation re-triggers from the start
        void chroma.offsetWidth;
        chroma.classList.add('glitching');
      }
      if (tabVisible) schedule(triggerChroma, 2500 + Math.random() * 5000);
    }
    function spawnBars() {
      if (active()) {
        // Build bars off-DOM in a fragment, then attach in one shot
        const frag = document.createDocumentFragment();
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const bar = document.createElement('div');
          bar.className = 'ic-fx-bar';
          bar.style.cssText =
            `top:${Math.random() * 100}%;` +
            `height:${1 + Math.random() * 3}px;` +
            `opacity:${0.4 + Math.random() * 0.5};`;
          frag.appendChild(bar);
        }
        bars.replaceChildren(frag);
        bars.style.opacity = '1';
        schedule(() => { bars.style.opacity = '0'; }, 90 + Math.random() * 120);
      }
      if (tabVisible) schedule(spawnBars, 3500 + Math.random() * 6500);
    }
    function tearFlash() {
      if (active()) {
        // Single cssText assignment = one reflow instead of three
        tear.style.cssText =
          `top:${10 + Math.random() * 80}%;` +
          `height:${10 + Math.random() * 45}px;` +
          `opacity:${0.55 + Math.random() * 0.4};`;
        schedule(() => { tear.style.opacity = '0'; }, 70);
      }
      if (tabVisible) schedule(tearFlash, 5500 + Math.random() * 9000);
    }

    document.addEventListener('visibilitychange', () => {
      tabVisible = !document.hidden;
      if (!tabVisible) {
        stopAll();
      } else {
        // Restart chains
        schedule(triggerChroma, 1800);
        schedule(spawnBars,     3200);
        schedule(tearFlash,     6000);
      }
    });
    reduceMotionMq.addEventListener('change', e => {
      reduceMotion = e.matches;
      if (reduceMotion) stopAll();
    });

    schedule(triggerChroma, 1800);
    schedule(spawnBars,     3200);
    schedule(tearFlash,     6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFxScene);
  } else {
    injectFxScene();
  }
})();
