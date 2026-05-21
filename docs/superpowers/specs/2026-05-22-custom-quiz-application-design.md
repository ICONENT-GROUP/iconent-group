# Custom Quiz Application Form — Design Spec

**Date:** 2026-05-22
**Status:** Draft — pending user approval
**Owner:** Kenzo (with Claude)

---

## 1. Context

The current Fluent Forms quiz lives on the old WordPress site (Rocket hosted). When DNS is moved to Vercel, those quiz URLs would break. The new static site needs a **custom-built replacement** for the Fluent quiz at the same two URLs the ads point to, so the funnel keeps working post-DNS-switch.

### Current state (pre-DNS-switch)
- DNS still on WP/Rocket → Fluent quiz live and working
- Vercel deployed but not yet receiving public traffic
- `vercel.json` redirects already exist for those URLs → `/strategy-call/` (would break the quiz funnel once DNS flips)
- **Ads are currently paused**, so there's no time pressure to keep submissions working

### Target state (post-build)
- Two real HTML pages at the ads-landing URLs serve a custom multi-step quiz
- Quiz UI is complete (validation, animation, mobile-first)
- Submit button is present but **disabled** ("Coming Soon — CRM integration pending") until the custom CRM exposes an endpoint
- DNS can be switched without breaking ad URLs (though ads stay off until CRM ready)

---

## 2. Goals

- Replicate the Fluent quiz's questions, narrative copy, and case studies in a custom HTML/CSS/JS implementation
- Multi-step wizard UX (one question per screen) instead of long single-page scroll
- Two URLs sharing one form (different H1/headline + hidden `source` field for tracking)
- Match the existing site's visual language (dark theme, accents, typography)
- Zero dependency on Fluent Forms / WordPress

## 3. Non-goals

- Submit functionality (deferred until custom CRM endpoint exists)
- Scoring/result page (user chose plain application form, no score)
- A/B testing infrastructure
- Multi-language (English only, matches current site)

---

## 4. URL & file structure

```
/artist-management-application/
  index.html                              ← Ads "Team" landing — H1: "Artist Management Application"
/major-label-application/
  index.html                              ← Ads "Distribution" landing — H1: "Major Label Distribution Application"
/assets/css/pages/quiz-application.css    ← Shared styles (new file)
/assets/js/quiz-application.js            ← Shared wizard logic (new file)
vercel.json                               ← Remove 2 redirects (lines 42-45). Update fluent-form=15/16 destinations.
```

### vercel.json changes

**Remove** these redirects (the 2 application URLs become real pages):
```json
{ "source": "/artist-management-application/", "destination": "/strategy-call/?utm_source=ads&utm_campaign=team", "permanent": true },
{ "source": "/artist-management-application",  "destination": "/strategy-call/?utm_source=ads&utm_campaign=team", "permanent": true },
{ "source": "/major-label-application/",       "destination": "/strategy-call/?utm_source=ads&utm_campaign=distribution", "permanent": true },
{ "source": "/major-label-application",        "destination": "/strategy-call/?utm_source=ads&utm_campaign=distribution", "permanent": true },
```

**Update** the fluent-form query redirects to land on the new quiz pages (not strategy-call):
```json
{ "source": "/", "has": [{ "type": "query", "key": "fluent-form", "value": "15" }], "destination": "/artist-management-application/", "permanent": true },
{ "source": "/", "has": [{ "type": "query", "key": "fluent-form", "value": "16" }], "destination": "/major-label-application/", "permanent": true },
```

---

## 5. Wizard structure

12 screens total (one per "step"). Progress bar in header shows `current/total`.

| # | Step | Type | Fields |
|---|------|------|--------|
| 1 | **Identity** | inputs | artist name, email, phone, IG handle, Spotify/SoundCloud URL |
| 2 | **Sound profile** | radios | genre (5 options), monthly listeners (4 brackets) |
| 3 | **Growth challenge** | radio | biggest blocker right now (6 options) |
| 4 | *Narrative intermezzo* | text only | "Positioning leads marketing" — 2 short paragraphs. Continue button. |
| 5 | **Team & investment history** | radios | operate with team (5 options), invested in marketing before (3 options) |
| 6 | *Case study — IICY OTW* | image + text | `iicy-portrait.png`, +165% listeners, +66% streams, signed major label. Continue. |
| 7 | **Vision** | input + radio | 12-month career goal (textarea), what you're working toward (4 options) |
| 8 | *Case study — Exxia* | image + text | `exxia-before.png` / `exxia-after.png`, +1,851% stream growth, +20 editorial playlists. Continue. |
| 9 | **Commitment & strategy** | radios | serious about music as business (3 options), open to creative direction (3 options), defined release strategy (3 options), finished track ready 30-60 days (3 options) |
| 10 | **Why us** | textarea | "Why should our team consider working with you?" |
| 11 | **Investment readiness** | radios + reveal | current spend per release (4 brackets), pricing reveal ($1,500 upfront / $690mo), prepared to invest at this level (3 options) |
| 12 | **Timing** | radio + submit | when to begin (3 options), **Submit Application** button (disabled) |

### Field details (full)

All fields, options, and intermezzo copy are taken **verbatim** from the Fluent screenshots provided by the user. See `docs/superpowers/specs/2026-05-22-quiz-content-source.md` (to be created during implementation, or inlined into HTML directly).

Required fields (red asterisk in Fluent): artist name, email, phone, monthly listeners, growth challenge, team, invested before, 12-month vision, working toward, music as business, defined release strategy, finished track, creative direction, why us, current spend, prepared to invest, when to begin.

Optional: IG handle, Spotify/SoundCloud, genre (treat as optional even though Fluent marks it required — too aggressive at step 2).

---

## 6. Visual design

### Layout
- **Card-centered**: max-width 640px, white card on dark page background
- **Header bar**: ICONENT logo (left), step counter "3 / 12" (right), thin progress bar below
- **Body**: question label (large), optional helper text (smaller, muted), input(s), Back/Next buttons
- **Footer**: trust strip (small) — "Reviewed manually by our team" + privacy note

### Style tokens (existing site tokens reused)
- Background: `#0A0A0A` page, `#FFFFFF` card
- Accent: existing site accents (jade/ice-blue/fluo-yellow per `tokens.css`)
- Typography: existing system fonts from `base.css`
- Question label: large (28-32px desktop, 22-24px mobile), semibold
- Helper text: 14px, muted gray
- Inputs: large click targets (48px+), 2px focus ring in accent color
- Radio options: full-row clickable cards (not tiny dots), hover state, selected state with checkmark
- Buttons: Back (ghost, left), Next/Submit (solid, right). Disabled Submit shown muted with tooltip.

### Animation
- Step transitions: 200ms slide-left (next) / slide-right (back) + opacity fade
- Progress bar: smooth width transition
- No autoplay sounds, no aggressive animations

### Responsive
- Mobile-first; on <640px the card is full-width with 16px padding
- Single column always (no side-by-side fields)
- Inputs stack vertically on Step 1 (identity) on mobile

---

## 7. JS behavior (no submit)

### Wizard state
```js
const state = {
  currentStep: 0,        // 0-indexed
  totalSteps: 12,
  answers: {},           // { fieldName: value }
  source: 'team' | 'distribution'  // pre-filled per URL
};
```

### Validation
- Required fields validated on Next click
- Inline error message under field if invalid (red text)
- Next button disabled until required fields on current step are filled
- Email: simple regex check
- Phone: minimum 7 digits (lenient — international users)
- URL fields (Spotify/SoundCloud): if filled, must contain `spotify.com` or `soundcloud.com`

### Navigation
- Back button: previous step (disabled on step 1)
- Next button: next step (validates first)
- Keyboard: Enter advances, Esc clears focus
- Browser back button: prevents accidental exit (with `confirm()` if user has typed anything)

### Submit (disabled state)
- Final step shows a **disabled "Submit Application" button**
- Below it: muted text "🔧 Submissions temporarily paused while we upgrade our internal systems. Please come back soon, or follow us on Instagram for updates."
- No fetch call. No POST. No redirect.
- When CRM endpoint is ready: change `const FORM_ENDPOINT = '';` to the real URL → submit becomes active, fetches POST, redirects to `/strategy-call/?source=<team|distribution>`

### Persistence
- Each step's input saved to `localStorage` under `iconent_quiz_draft` on change
- Restored on page load if user accidentally refreshes
- Cleared on successful submit (or, for now, ignored — no submit yet)

---

## 8. Content source

All quiz copy (questions, options, intermezzo paragraphs, case study text, pricing block) is sourced **verbatim** from the user's Fluent admin screenshots provided in the conversation. Specifically:

- **15 screenshots** showing every field, option, helper text, and narrative block
- Pricing: "$1,500 upfront or $690/month — This is not an expense. It is infrastructure."
- Case studies: IICY OTW (BANDLAB MUZIC EP — Instagram Ads + Organic + Press Office, signed major label after 6 months) and EXXIA (Spotify — Strategic release sequencing + Paid/Organic amplification + Influencer activation + Editorial targeting, +1,851% streams, +20 Editorial Playlists in 12 months)

Case study images available in `assets/img/`:
- `iicy-portrait.png` (Case 1)
- `exxia-before.png` + `exxia-after.png` (Case 2)

---

## 9. Implementation plan (deferred to writing-plans skill)

High-level order:
1. Create `assets/css/pages/quiz-application.css` (shared styles)
2. Create `assets/js/quiz-application.js` (shared wizard logic)
3. Create `artist-management-application/index.html` (team-variant)
4. Create `major-label-application/index.html` (distribution-variant) — copy of above with H1 + hidden field swap
5. Update `vercel.json` (remove 2 redirects, update 2 fluent-form params)
6. Verify locally with a static server + manual click-through on both URLs
7. Commit

---

## 10. Open questions / risks

- **CRM endpoint format** (when ready): assume JSON POST with `{name, email, phone, ig, spotify, genre, listeners, ...all answers, source}`. Confirm with backend dev before activating submit.
- **Case study image cropping**: existing `iicy-portrait.png` is a portrait crop; need to verify it works in the case-study layout or if we need a different framing.
- **Mobile keyboard**: long textarea fields (vision, why us) need to handle iOS Safari sticky keyboard well — test before deploy.
- **Accessibility**: ensure radio cards have proper `role="radiogroup"`, focus visible, and keyboard arrows navigate options.

---

## 11. Spec self-review notes

- ✅ No placeholders or TBDs in content sections
- ✅ No internal contradictions (URLs, redirects, file paths consistent)
- ✅ Scope is one form, not decomposable further
- ✅ All requirements unambiguous (e.g., "submit disabled" is explicit, "no scoring" is explicit)
