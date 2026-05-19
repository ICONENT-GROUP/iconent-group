(function () {
  const HEADER_HTML = `
    <header class="ic-hdr" role="banner">
      <a class="ic-hdr-logo" href="/">ICONENT</a>
      <nav class="ic-hdr-nav" aria-label="Primary">
        <div class="ic-hdr-services">
          <a href="/services-project-management.html" data-path="/services-project-management">Services</a>
          <div class="ic-hdr-services-menu" role="menu">
            <a class="featured" href="/services-project-management.html" data-path="/services-project-management" role="menuitem">▸ Project Management</a>
            <a href="/services-spotify.html"    data-path="/services-spotify"    role="menuitem">Spotify Promotion</a>
            <a href="/services-youtube.html"    data-path="/services-youtube"    role="menuitem">YouTube Promotion</a>
            <a href="/services-instagram.html"  data-path="/services-instagram"  role="menuitem">Instagram Promotion</a>
            <a href="/services-tiktok.html"     data-path="/services-tiktok"     role="menuitem">TikTok Promotion</a>
          </div>
        </div>
        <a href="/contact-us.html" data-path="/contact-us">Contact</a>
        <button class="ic-hdr-cta" data-action="open-calendly" type="button">Book a Call</button>
      </nav>
      <button class="ic-hdr-burger" type="button" aria-label="Open menu" aria-expanded="false"></button>
      <div class="ic-hdr-mobile" role="menu">
        <p class="ic-hdr-mobile-label">Services</p>
        <a href="/services-project-management.html" data-path="/services-project-management">Project Management</a>
        <a href="/services-spotify.html"    data-path="/services-spotify">Spotify</a>
        <a href="/services-youtube.html"    data-path="/services-youtube">YouTube</a>
        <a href="/services-instagram.html"  data-path="/services-instagram">Instagram</a>
        <a href="/services-tiktok.html"     data-path="/services-tiktok">TikTok</a>
        <p class="ic-hdr-mobile-label">Menu</p>
        <a href="/contact-us.html" data-path="/contact-us">Contact</a>
        <button class="ic-hdr-cta" data-action="open-calendly" type="button">Book a Call</button>
      </div>
    </header>`;

  const FOOTER_HTML = `
    <footer class="ic-ftr" role="contentinfo">
      <div class="ic-ftr-inner">
        <div class="ic-ftr-social">
          <a href="https://www.instagram.com/iconent_group/" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.3.4.6.2 1 .5 1.5 1s.7.9 1 1.5c.2.5.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.9 2.6 10.2 2.6 12s0 2.1.1 3.3c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4C9.4 19.4 9.8 19.4 12 19.4s2.6 0 3.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.5.1-3.3s0-2.1-.1-3.3c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.5-.1-3.8-.1zM12 7.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm5-2.1a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
          </a>
          <a href="https://www.facebook.com/ICONENTGROUP" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.2-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9z"/></svg>
          </a>
        </div>
        <p class="ic-ftr-brand">ICONENT GROUP</p>
        <p class="ic-ftr-desc">Digital Marketing and Promotional Services</p>
        <p class="ic-ftr-addr">99 Wall Street, New York, NY, United States, 10005</p>
        <p class="ic-ftr-copy">© 2026 Iconent-Group. All rights reserved.</p>
      </div>
    </footer>`;

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
      // Book-a-Call buttons
      this.querySelectorAll('[data-action="open-calendly"]').forEach((b) => {
        b.addEventListener('click', () => window.icOpenCalendly && window.icOpenCalendly());
      });
      // ESC closes mobile
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hdr.classList.contains('is-open')) {
          hdr.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Open menu');
          document.body.classList.remove('no-scroll');
        }
      });
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
