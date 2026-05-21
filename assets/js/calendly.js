(function () {
  const CALENDLY_URL = 'https://calendly.com/d/cxy6-2pj-4zj/iconent-artist-discovery-call?hide_gdpr_banner=1&background_color=141414&text_color=f5f5f5&primary_color=00ff88';
  const SCRIPT_URL = 'https://assets.calendly.com/assets/external/widget.js';

  let scriptLoaded = false;
  let lastFocused = null;

  function loadScript() {
    return new Promise((resolve, reject) => {
      if (scriptLoaded) return resolve();
      const s = document.createElement('script');
      s.src = SCRIPT_URL;
      s.async = true;
      s.onload = () => { scriptLoaded = true; resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function getModal() {
    let modal = document.getElementById('ic-modal');
    if (modal) return modal;
    // Inject modal at end of body if page didn't include it
    modal = document.createElement('div');
    modal.id = 'ic-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Book a discovery call');
    modal.innerHTML = `
      <div class="modal" role="document">
        <button class="modal-close" type="button" aria-label="Close">✕</button>
        <div class="calendly-inline-widget" data-url="${CALENDLY_URL}"></div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function trapFocus(modal) {
    const focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return null;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    modal.addEventListener('keydown', handler);
    first.focus();
    return handler;
  }

  let focusHandler = null;

  function findInlineWidgetOnPage() {
    // Look for a .calendly-inline-widget NOT inside #ic-modal
    const widgets = document.querySelectorAll('.calendly-inline-widget');
    for (const w of widgets) {
      if (!w.closest('#ic-modal')) return w;
    }
    return null;
  }

  window.icOpenCalendly = async function () {
    // If page already has an inline Calendly widget (e.g. contact page),
    // scroll to it instead of opening a duplicate in the modal.
    const inline = findInlineWidgetOnPage();
    if (inline) {
      inline.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const modal = getModal();
    lastFocused = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    try {
      await loadScript();
      if (window.Calendly && window.Calendly.initInlineWidgets) {
        window.Calendly.initInlineWidgets();
      }
    } catch (e) {
      console.error('Failed to load Calendly widget', e);
    }
    focusHandler = trapFocus(modal);
  };

  window.icCloseCalendly = function (event) {
    const modal = document.getElementById('ic-modal');
    if (!modal) return;
    // If called from overlay click, only close when the overlay itself was clicked
    if (event && event.target !== modal && event.currentTarget !== event.target) return;
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (focusHandler) {
      modal.removeEventListener('keydown', focusHandler);
      focusHandler = null;
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  // Wire up close button + overlay click + ESC after DOM ready
  function wire() {
    // Global delegation: any [data-action="open-calendly"] on the page opens.
    // Header buttons are also covered here, so a second listener in the header
    // component is harmless but redundant.
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-action="open-calendly"]');
      if (!trigger) return;
      e.preventDefault();
      window.icOpenCalendly();
    });

    // If page already has an inline Calendly widget, don't inject a modal —
    // having two .calendly-inline-widget elements causes the second to render empty.
    if (findInlineWidgetOnPage()) return;

    const modal = getModal();
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.icCloseCalendly(e);
    });
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn && closeBtn.addEventListener('click', () => window.icCloseCalendly());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) window.icCloseCalendly();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
