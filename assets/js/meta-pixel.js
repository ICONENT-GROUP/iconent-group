/* ============================================================
   Meta (Facebook) Pixel — ICONENT GROUP
   Pixel ID: 1646160763491341

   Fires IMMEDIATELY on every page, independent of cookie consent.
   It is intentionally NOT wired to the `iconent:consent` banner event.

   Events:
     - PageView    : every page (here, on load)
     - ViewContent : auto-fired on strategy-call and services-* pages
     - Lead        : fired manually from quiz-application.js, only after
                     the CRM POST succeeds (see window.metaPixel.trackLead)
   ============================================================ */
(function () {
  // --- Official Meta Pixel base code ---
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '1646160763491341');
  fbq('track', 'PageView');

  // --- Helpers (exposed for manual use, e.g. the quiz Lead event) ---
  window.metaPixel = {
    trackViewContent: function () {
      if (window.fbq) fbq('track', 'ViewContent');
    },
    trackLead: function () {
      if (window.fbq) fbq('track', 'Lead');
    }
  };

  // --- Auto ViewContent on strategy-call and services pages ---
  var path = (location.pathname || '').toLowerCase();
  if (path.indexOf('strategy-call') !== -1 || path.indexOf('services-') !== -1) {
    window.metaPixel.trackViewContent();
  }
})();
