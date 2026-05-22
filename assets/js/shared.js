(function () {
  /* Inline services dropdown reveal (Discover Services button on CTA blocks) */
  function setupCtaDropdowns() {
    const ctaBlocks = document.querySelectorAll('.cta-block');
    ctaBlocks.forEach((block) => {
      const dropdown = block.querySelector('.btn-dropdown');
      const trigger = block.querySelector('.btn-dropdown .btn-secondary');
      const services = block.querySelector('.services-inline');
      if (!trigger || !services) return;

      const closeBlock = (b) => {
        b.querySelector('.btn-dropdown')?.classList.remove('open');
        b.querySelector('.services-inline')?.classList.remove('open');
        b.classList.remove('has-open-dropdown');
      };
      const open = () => {
        document.querySelectorAll('.cta-block.has-open-dropdown').forEach((b) => {
          if (b !== block) closeBlock(b);
        });
        dropdown.classList.add('open');
        services.classList.add('open');
        block.classList.add('has-open-dropdown');
      };
      const close = () => closeBlock(block);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown.classList.contains('open')) close(); else open();
      });

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
    /* .faq-q is now a real <button> in HTML — keyboard (Enter / Space)
       and ARIA semantics are native. We only sync aria-expanded on click. */
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* Count-up metrics — animates any [data-count] number into view.
     Shared across home + service pages. */
  function initCountUps() {
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

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupCtaDropdowns();
      setupFaq();
      initCountUps();
    });
  } else {
    setupCtaDropdowns();
    setupFaq();
    initCountUps();
  }
})();
