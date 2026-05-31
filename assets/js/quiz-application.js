/* ============================================================
   QUIZ APPLICATION — multi-step wizard logic
   Used by /major-label-application/. The /artist-management-application/
   URL still exists as a 301 redirect for legacy ad links.
   ============================================================ */

(function () {
  'use strict';

  // ---------- CONFIG ----------
  const FORM_ENDPOINT = 'https://app.iconent-group.com/api/leads/intake';
  const POST_SUBMIT_REDIRECT = '/application-received/';
  const AUTO_ADVANCE_DELAY_MS = 450; // longer = more time to see selection / change mind before advance fires

  // ---------- BOOT ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const root = document.querySelector('[data-quiz-root]');
    if (!root) return;

    const steps = Array.from(root.querySelectorAll('.quiz-step'));
    const totalSteps = steps.length;
    if (totalSteps === 0) return;

    // The card wraps both the intro (H1/descriptor) and the quiz shell.
    // We toggle a class on the card once user moves past step 1 so CSS can
    // hide the intro on mobile — keeps the viewport focused on the question.
    const card = document.querySelector('.quiz-card');
    const counterCurrent = root.querySelector('[data-step-current]');
    const counterTotal = root.querySelector('[data-step-total]');
    const progressBar = root.querySelector('[data-progress-bar]');
    const backBtn = root.querySelector('[data-quiz-back]');
    const nextBtn = root.querySelector('[data-quiz-next]');
    const submitBtn = root.querySelector('[data-quiz-submit]');
    const submitNote = root.querySelector('[data-quiz-submit-note]');

    if (counterTotal) counterTotal.textContent = totalSteps;

    let currentIndex = 0;

    // ---------- NAV ----------
    function showStep(i, opts = {}) {
      currentIndex = i;
      steps.forEach((step, idx) => {
        step.classList.toggle('is-active', idx === i);
        step.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
      });

      // progress
      const pct = ((i + 1) / totalSteps) * 100;
      if (progressBar) progressBar.style.width = pct + '%';
      if (counterCurrent) counterCurrent.textContent = i + 1;

      // back btn state
      if (backBtn) backBtn.disabled = i === 0;

      // After the user moves past step 1, mark the card so mobile CSS can
      // collapse the H1/descriptor — saves vertical space while answering.
      if (card) card.classList.toggle('is-past-first', i > 0);

      // last step → swap next for submit. Footer Next is the single, always-
      // present forward CTA — narrative/case-study steps used to have an
      // inline Continue button, removed for consistency (one button, one place).
      const isLast = i === totalSteps - 1;
      if (nextBtn && submitBtn) {
        nextBtn.style.display = isLast ? 'none' : '';
        submitBtn.style.display = isLast ? '' : 'none';
        if (submitNote) submitNote.style.display = isLast ? '' : 'none';
      }

      // Focus only real text inputs/textareas, and only on desktop. Auto-focusing
      // radio labels on mobile caused the first option to look "pre-selected"
      // (focus ring on first .quiz-option) and triggered iOS keyboard scrolls.
      if (!opts.skipFocus && window.innerWidth >= 900) {
        const focusTarget = steps[i].querySelector(
          'input:not([type="hidden"]):not([type="radio"]), textarea'
        );
        if (focusTarget) {
          setTimeout(() => focusTarget.focus({ preventScroll: true }), 50);
        }
      }

      // scroll card into view on small screens
      if (window.innerWidth < 900) {
        const card = root.querySelector('.quiz-shell');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // update next button state (e.g., disabled until required filled)
      updateNextState();
    }

    function goNext() {
      if (!validateStep(currentIndex)) return;
      if (currentIndex < totalSteps - 1) showStep(currentIndex + 1);
    }
    function goBack() {
      if (currentIndex > 0) showStep(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (backBtn) backBtn.addEventListener('click', goBack);

    // Enter key advances
    root.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        // only if a button-like or option isn't the active element
        if (e.target.matches('input, .quiz-option')) {
          e.preventDefault();
          goNext();
        }
      }
    });

    // Live update next-button state as user fills
    root.addEventListener('input', updateNextState);
    root.addEventListener('change', updateNextState);

    // ---------- AUTO-ADVANCE on radio click ----------
    // Steps with [data-auto-advance] on their .quiz-field auto-advance to
    // the next step after the user picks a radio option. Gives the typeform-
    // style "tap → next" UX while keeping the explicit Back/Next buttons
    // in the footer for users who want to review/correct answers.
    root.addEventListener('change', (e) => {
      const input = e.target;
      if (!input || input.type !== 'radio') return;
      const field = input.closest('[data-required="radio"]');
      if (!field || !field.hasAttribute('data-auto-advance')) return;
      // Already validated by virtue of being checked. Brief delay to let the
      // user SEE their selection animate (the green pip + border) before the
      // step transitions.
      setTimeout(() => {
        if (currentIndex < totalSteps - 1) goNext();
      }, AUTO_ADVANCE_DELAY_MS);
    });

    // ---------- VALIDATION ----------
    function validateStep(i) {
      const step = steps[i];
      const fields = step.querySelectorAll('[data-required]');
      let firstInvalid = null;

      fields.forEach(group => {
        const valid = isFieldValid(group);
        group.classList.toggle('has-error', !valid);
        if (!valid && !firstInvalid) firstInvalid = group;
      });

      if (firstInvalid) {
        const focusEl = firstInvalid.querySelector('input, textarea');
        if (focusEl) focusEl.focus();
      }
      return !firstInvalid;
    }

    function isFieldValid(group) {
      const type = group.getAttribute('data-required');
      if (type === 'radio') {
        return !!group.querySelector('input[type="radio"]:checked');
      }
      const input = group.querySelector('input, textarea');
      if (!input) return true;
      const v = (input.value || '').trim();
      if (!v) return false;
      if (input.type === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      }
      if (input.type === 'tel') {
        return v.replace(/[^\d]/g, '').length >= 7;
      }
      if (input.type === 'url') {
        return /^(https?:\/\/)?(www\.)?(open\.spotify\.com|spotify\.com|soundcloud\.com)/i.test(v);
      }
      return v.length > 0;
    }

    function updateNextState() {
      // Next button stays always clickable; validation runs on click instead.
      // This avoids the confusing "Next is grey, I don't know why" state.
      const step = steps[currentIndex];
      if (!step) return;
      const required = step.querySelectorAll('[data-required]');
      let allValid = true;
      required.forEach(g => {
        if (!isFieldValid(g)) allValid = false;
        // Clear previous error markers once the user starts fixing them
        if (isFieldValid(g)) g.classList.remove('has-error');
      });
      // Submit on last step: enabled when required fields are filled.
      // Redirect to /strategy-call/ happens regardless of CRM endpoint being wired.
      if (submitBtn && currentIndex === totalSteps - 1) {
        submitBtn.disabled = !allValid;
      }
    }

    // ---------- SUBMIT ----------
    // The form ALWAYS redirects to /strategy-call/ at the end of the quiz.
    // If FORM_ENDPOINT is set, we also fire-and-forget a POST to the CRM
    // before redirecting (data is not blocked on POST success).

    async function postWithRetry(url, payload, attempts = 3) {
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          });
          if (res.ok || res.status === 409) return res; // 409 = duplicate, ok
          console.warn('[quiz] CRM non-ok status', res.status, 'attempt', i + 1);
        } catch (err) {
          console.warn('[quiz] CRM fetch error, attempt', i + 1, err);
        }
        if (i < attempts - 1) {
          await new Promise(r => setTimeout(r, (i + 1) * 1000)); // 1s, 2s
        }
      }
      console.error('[quiz] CRM submission failed after', attempts, 'attempts. Payload:', JSON.stringify(payload));
      return null;
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', async e => {
        e.preventDefault();
        if (!validateStep(currentIndex)) return;

        const payload = buildPayload();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';

        let crmRes = null;
        if (FORM_ENDPOINT) {
          crmRes = await postWithRetry(FORM_ENDPOINT, payload);
        }

        // Meta Pixel Lead — fire ONLY when the CRM POST succeeded (res.ok / 409).
        // postWithRetry returns the response on success, or null on failure.
        // Never fires on the click itself, and never if the submission failed.
        if (crmRes && window.metaPixel) {
          window.metaPixel.trackLead();
        }

        window.location.href = POST_SUBMIT_REDIRECT;
      });
    }

    // ---------- COLLECT ANSWERS ----------
    function getValue(name) {
      const radio = root.querySelector(`input[name="${name}"]:checked`);
      if (radio) return radio.value;
      const el = root.querySelector(`[name="${name}"]`);
      return el ? (el.value || '').trim() || null : null;
    }

    function buildPayload() {
      const quiz = {
        genre:             getValue('genre'),
        monthly_listeners: getValue('monthly_listeners'),
        growth_challenge:  getValue('growth_challenge'),
        team:              getValue('team'),
        invested_before:   getValue('invested_before'),
        vision_12m:        getValue('vision_12m'),
        vision_12m_detail: getValue('vision_12m_detail'),
        working_toward:    getValue('working_toward'),
        seriousness:       getValue('seriousness'),
        open_to_direction: getValue('open_to_direction'),
        release_strategy:  getValue('release_strategy'),
        track_ready:       getValue('track_ready'),
        why_us:            getValue('why_us'),
        ready_to_invest:   getValue('ready_to_invest'),
        start_timing:      getValue('start_timing'),
      };
      Object.keys(quiz).forEach(k => { if (quiz[k] === null) delete quiz[k]; });

      const payload = {
        source:        'quiz_iconent_group',
        full_name:     getValue('artist_name'),
        email:         getValue('email'),
        custom_fields: { quiz },
      };
      const phone            = getValue('phone');
      const instagram_handle = getValue('instagram');
      const spotify_url      = getValue('spotify_url');
      const budget_band      = getValue('current_spend');
      if (phone)             payload.phone = phone;
      if (instagram_handle)  payload.instagram_handle = instagram_handle;
      if (spotify_url)       payload.spotify_url = spotify_url;
      if (budget_band)       payload.budget_band = budget_band;
      return payload;
    }

    // ---------- INITIAL RENDER ----------
    showStep(0, { skipFocus: true });
  }
})();
