/* ============================================================
   QUIZ APPLICATION — multi-step wizard logic
   Shared by /artist-management-application/ and /major-label-application/

   Submission is currently disabled while the custom CRM is being built.
   When the CRM endpoint is ready, set FORM_ENDPOINT below and the submit
   button will become active.
   ============================================================ */

(function () {
  'use strict';

  // ---------- CONFIG ----------
  const FORM_ENDPOINT = ''; // set to '<crm-endpoint-url>' to enable submit
  const STORAGE_KEY = 'iconent_quiz_draft_v1';
  const POST_SUBMIT_REDIRECT = '/strategy-call/';

  // ---------- BOOT ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const root = document.querySelector('[data-quiz-root]');
    if (!root) return;

    const steps = Array.from(root.querySelectorAll('.quiz-step'));
    const totalSteps = steps.length;
    if (totalSteps === 0) return;

    const counterCurrent = root.querySelector('[data-step-current]');
    const counterTotal = root.querySelector('[data-step-total]');
    const progressBar = root.querySelector('[data-progress-bar]');
    const backBtn = root.querySelector('[data-quiz-back]');
    const nextBtn = root.querySelector('[data-quiz-next]');
    const submitBtn = root.querySelector('[data-quiz-submit]');
    const submitNote = root.querySelector('[data-quiz-submit-note]');

    if (counterTotal) counterTotal.textContent = totalSteps;

    let currentIndex = 0;

    // ---------- DRAFT PERSISTENCE ----------
    restoreDraft();

    // Save on every input/change
    root.addEventListener('input', saveDraft);
    root.addEventListener('change', saveDraft);

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

      // last step → swap next for submit
      const isLast = i === totalSteps - 1;
      if (nextBtn && submitBtn) {
        nextBtn.style.display = isLast ? 'none' : '';
        submitBtn.style.display = isLast ? '' : 'none';
        if (submitNote) submitNote.style.display = isLast ? '' : 'none';
      }

      // focus first input/option for keyboard users
      if (!opts.skipFocus) {
        const focusTarget = steps[i].querySelector(
          'input:not([type="hidden"]):not([type="radio"]), textarea, .quiz-option, [data-quiz-continue]'
        );
        if (focusTarget) {
          // small delay so animation doesn't fight focus; preventScroll keeps
          // the view stable (we handle scroll-into-view ourselves below).
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

    // "Continue" buttons inside narrative/case-study steps
    root.querySelectorAll('[data-quiz-continue]').forEach(btn => {
      btn.addEventListener('click', goNext);
    });

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
    if (submitBtn) {
      submitBtn.addEventListener('click', async e => {
        e.preventDefault();
        if (!validateStep(currentIndex)) return;

        const data = collectAnswers();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';

        // Try POST to CRM if endpoint is configured. Don't block on failure —
        // we still want to redirect the user to the VSL.
        if (FORM_ENDPOINT) {
          try {
            await fetch(FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
              keepalive: true
            });
          } catch (err) {
            console.warn('[quiz] CRM submission failed, redirecting anyway', err);
          }
        }

        clearDraft();
        const params = new URLSearchParams({ source: data.source || '', applied: '1' });
        window.location.href = POST_SUBMIT_REDIRECT + '?' + params.toString();
      });
    }

    // ---------- COLLECT ANSWERS ----------
    function collectAnswers() {
      const out = {};
      root.querySelectorAll('input[name], textarea[name]').forEach(el => {
        if (el.type === 'radio') {
          if (el.checked) out[el.name] = el.value;
        } else if (el.type === 'checkbox') {
          out[el.name] = el.checked;
        } else {
          out[el.name] = (el.value || '').trim();
        }
      });
      out.source = root.getAttribute('data-source') || '';
      out.submitted_at = new Date().toISOString();
      return out;
    }

    // ---------- DRAFT ----------
    function saveDraft() {
      try {
        const data = collectAnswers();
        delete data.submitted_at;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (_) { /* quota or privacy mode — ignore */ }
    }
    function restoreDraft() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        Object.entries(data).forEach(([name, value]) => {
          // Never restore `source` — it's bound to the URL (team vs distribution).
          // Restoring would bleed source across the two quiz pages if the user
          // started on one URL and continued on the other.
          if (name === 'source') return;
          const el = root.querySelector(`[name="${name}"]`);
          if (!el) return;
          if (el.type === 'radio') {
            const radio = root.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
          } else {
            el.value = value;
          }
        });
      } catch (_) { /* corrupt — ignore */ }
    }
    function clearDraft() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    // ---------- INITIAL RENDER ----------
    showStep(0, { skipFocus: true });
  }
})();
