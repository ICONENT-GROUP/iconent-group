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
      <div class="ic-hdr-mobile" role="menu">
        <p class="ic-hdr-mobile-label">Services</p>
        <a class="featured" href="/services-project-management.html" data-path="/services-project-management">Project Management</a>
        <a href="/services-spotify.html"    data-path="/services-spotify">Spotify</a>
        <a href="/services-youtube.html"    data-path="/services-youtube">YouTube</a>
        <a href="/services-instagram.html"  data-path="/services-instagram">Instagram</a>
        <a href="/services-tiktok.html"     data-path="/services-tiktok">TikTok</a>
        <p class="ic-hdr-mobile-label">Menu</p>
        <a href="/" data-path="/">Home</a>
        <a class="ic-hdr-cta" href="/contact-us.html" data-path="/contact-us">Contact Us</a>
      </div>
    </header>`;

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
      // Burger toggle
      const burger = this.querySelector('.ic-hdr-burger');
      burger.addEventListener('click', () => {
        const open = hdr.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('no-scroll', open);
      });
      // Close mobile on link click
      this.querySelectorAll('.ic-hdr-mobile a').forEach((a) => {
        a.addEventListener('click', () => {
          hdr.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        });
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
        if (e.key === 'Escape' && hdr.classList.contains('is-open')) {
          hdr.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
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
})();
