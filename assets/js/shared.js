(function () {
  /* Inline services dropdown reveal (Discover Services button on CTA blocks) */
  function setupCtaDropdowns() {
    const ctaBlocks = document.querySelectorAll('.cta-block');
    ctaBlocks.forEach((block) => {
      const dropdown = block.querySelector('.btn-dropdown');
      const trigger = block.querySelector('.btn-dropdown .btn-secondary');
      const services = block.querySelector('.services-inline');
      const overlay = document.querySelector('.blur-overlay');
      if (!trigger || !services) return;

      let closeTimer = null;

      const open = () => {
        clearTimeout(closeTimer);
        // Close any other open dropdowns first
        document.querySelectorAll('.cta-block.has-open-dropdown').forEach((b) => {
          if (b !== block) closeBlock(b);
        });
        dropdown.classList.add('open');
        services.classList.add('open');
        block.classList.add('has-open-dropdown');
        overlay && overlay.classList.add('active');
      };
      const closeBlock = (b) => {
        b.querySelector('.btn-dropdown')?.classList.remove('open');
        b.querySelector('.services-inline')?.classList.remove('open');
        b.classList.remove('has-open-dropdown');
      };
      const close = () => {
        closeBlock(block);
        // Hide overlay only if no other dropdown is open
        if (!document.querySelector('.cta-block.has-open-dropdown')) {
          overlay && overlay.classList.remove('active');
        }
      };

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (dropdown.classList.contains('open')) close(); else open();
      });

      // Auto-close on mouse leave (with grace)
      block.addEventListener('mouseleave', () => {
        if (!dropdown.classList.contains('open')) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(close, 200);
      });
      block.addEventListener('mouseenter', () => clearTimeout(closeTimer));

      // Click outside closes
      document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('open')) return;
        if (block.contains(e.target)) return;
        close();
      });

      // ESC closes
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) close();
      });
    });
  }

  /* FAQ accordion */
  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.setAttribute('role', 'button');
      q.setAttribute('tabindex', '0');
      q.setAttribute('aria-expanded', 'false');
      const toggle = () => {
        const open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      };
      item.addEventListener('click', toggle);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupCtaDropdowns();
      setupFaq();
    });
  } else {
    setupCtaDropdowns();
    setupFaq();
  }
})();
