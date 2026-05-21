# Quiz Application — Full Content Reference

**For:** Claude / dev assistants working on the Iconent custom CRM, internal tooling, or any system that needs full knowledge of the application form.
**Purpose:** complete reference of every screen, field, option, helper text, narrative block, and case study in the live quiz.
**Last sync:** 2026-05-22 (frontend `quiz-application.js?v=3`)

This document is the **single source of truth** for the form's content. The two HTML files (`artist-management-application/index.html` and `major-label-application/index.html`) are functionally identical — they differ only in the H1, page title, and the hidden `source` value (`team` vs `distribution`).

For technical integration (HTTP, JSON schema, CORS, etc.) see `2026-05-22-quiz-application-crm-integration.md`.

---

## Form-level metadata

| Property | `team` variant | `distribution` variant |
|----------|---------------|------------------------|
| URL | `/artist-management-application/` | `/major-label-application/` |
| Page title | ICONENT — Artist Management Application | ICONENT — Major Label Distribution Application |
| Intro H1 | Artist Management **Application** | Major Label **Distribution** Application |
| Intro paragraph | "A short application to understand where your project is and whether structured development is the right next move." | "A short application to understand whether your project is ready for structured major-label distribution and positioning." |
| Hidden field `source` | `team` | `distribution` |
| Steps | 12 | 12 (identical) |
| Submit button label | "Submit Application" | "Submit Application" |
| Submit currently | **Disabled** until CRM endpoint wired | **Disabled** until CRM endpoint wired |
| Post-submit redirect | `/strategy-call/?source=team&applied=1` | `/strategy-call/?source=distribution&applied=1` |

**Header (every step):**
- Left: `● ICONENT — APPLICATION`
- Right: `STEP <n> / 12`
- Thin green progress bar below

**Footer (every step):**
- Back button (disabled on Step 1)
- Next button (Steps 1–11) / Submit Application button (Step 12)

**Trust strip below card:** *Reviewed manually by our team. **Limited intake.***

---

## STEP 1 — Identity

**Helper text (above question):**
> Let's start with the basics so our team can review your project.

**Question (H2):**
> Tell us who you are *

**Fields:**

| Label | Field name | Type | Required | Placeholder | Notes |
|-------|-----------|------|----------|-------------|-------|
| Artist name | `artist_name` | text | ✅ Yes | Type your artist name | autocomplete: nickname |
| Email | `email` | email | ✅ Yes | Where should we contact you? | autocomplete: email |
| Phone | `phone` | tel | ✅ Yes | Phone number | autocomplete: tel. Validation: ≥7 digits after non-digit strip. |
| Instagram handle | `instagram` | text | ❌ Optional | @yourhandle | |
| Spotify / SoundCloud link | `spotify_url` | url | ❌ Optional | https://open.spotify.com/artist/... | If filled, validates against `spotify.com` or `soundcloud.com` |

**Error messages (shown red below field when invalid):**
- artist_name → "Please enter your artist name."
- email → "Please enter a valid email."
- phone → "Please enter a valid phone number."

---

## STEP 2 — Sound profile

### Question 2a (no helper):
> What genre best represents your sound?

**Field name:** `genre` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Hip-Hop / Rap` | Hip-Hop / Rap |
| `R&B / Soul` | R&B / Soul |
| `Rock` | Rock |
| `Electronic / Dance` | Electronic / Dance |
| `Pop` | Pop |
| `Other` | Other |

### Question 2b
**Helper:**
> Operating at a label-ready level requires measurable traction and structured growth.

**Question:**
> How many monthly listeners are you currently averaging? *

**Field name:** `monthly_listeners` — radio (required)

| Value | Label shown |
|-------|-------------|
| `0-1k` | 0–1k |
| `1k-10k` | 1k–10k |
| `10k-50k` | 10k–50k |
| `50k-100k` | 50k–100k |
| `100k+` | 100k+ |

---

## STEP 3 — Growth challenge

**Helper:**
> Real growth problems usually come down to positioning, strategy, and execution — not talent.

**Question:**
> What is your biggest growth challenge right now? *

**Field name:** `growth_challenge` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Building a real fan base` | Building a real fan base |
| `Increasing streams consistently` | Increasing streams consistently |
| `Creating strong brand positioning` | Creating strong brand positioning |
| `Running marketing that converts` | Running marketing that converts |
| `Accessing industry opportunities` | Accessing industry opportunities |
| `No clear strategy yet` | I don't currently have a clear strategy |

---

## STEP 4 — Narrative intermezzo (no input)

**Label (small, uppercase, green):** Why this matters

**H2:**
> Positioning **leads** marketing

**Paragraphs:**
1. > **Most independent artists release consistently but without structured amplification.** Without positioning and execution planning, numbers spike — then disappear.
2. > Running ads without identity alignment rarely creates long-term leverage. When strategy defines the narrative, capital scales predictably.
3. (muted) > A defined growth framework creates compounding results instead of temporary spikes.

User clicks "Next →" to advance.

---

## STEP 5 — Team & investment history

### Question 5a
**Helper:**
> This is where structured development begins — understanding how you currently operate.

**Question:**
> Do you currently operate with a team? *

**Field name:** `team` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Strategic team supporting growth` | I have a strategic team supporting my growth |
| `Technical collaborators, no strategy` | I have technical collaborators but no strategic direction |
| `Freelancers when needed` | I rely mostly on freelancers when needed |
| `Solo / entirely on my own` | I manage the project entirely on my own |
| `No real team yet` | I haven't built a real team yet |

### Question 5b
**Helper:**
> Structured growth requires structured investment.

**Question:**
> Have you invested in marketing or promotion before? *

**Field name:** `invested_before` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Yes, consistently` | Yes, consistently |
| `Yes, occasionally` | Yes, occasionally |
| `Not yet` | Not yet |

---

## STEP 6 — Case study 1 (no input)

**Label:** Real growth leaves visible proof

**H2:**
> Case 1 — **Growth + industry leverage**

**Lead paragraph:**
> The objective wasn't just to increase streams. It was to build measurable validation strong enough to open major-level conversations. Every release followed a defined positioning sequence — from audience targeting to editorial leverage.

**Layout:**
- Left: portrait image `/assets/img/iicy-portrait.png`
- Right: body

**Body:**
- **Subhead (green, uppercase):** IICY OTW — BANDLAB MUZIC EP
- **Strategy** (bulleted, green ▲ markers):
  - Instagram Ads
  - Organic social media content
  - Press Office
- **Achievement**:
  > After 6 months of work, signed a contract with a **Major Label** (+165% listeners, +66% streams).

User clicks "Next →" to advance.

---

## STEP 7 — Vision

### Question 7a
**Helper:**
> Artists who reach a label-ready level operate with clarity long before they sign.

**Question:**
> Where do you see your music career 12 months from now? *

**Field name:** `vision_12m` — textarea (required), placeholder: "Be specific — this helps us understand your vision"

### Question 7b
**Helper:**
> The gap between where you are and where you want to be is rarely talent. It's clarity, positioning, and disciplined execution.

**Question:**
> What are you really working toward right now? *

**Field name:** `working_toward` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Serious long-term project` | Building a serious long-term project |
| `Growing leverage before labels` | Growing leverage before approaching labels |
| `Positioning for major-level` | Positioning for major-level opportunities |
| `Still figuring things out` | Still figuring things out |

---

## STEP 8 — Case study 2 (no input)

**Label:** Editorial positioning + compounding growth

**H2:**
> Case 2 — **Spotify results**

**Lead paragraph:**
> Through coordinated paid amplification, influencer activation, and organic TikTok positioning, each release was engineered to generate signals Spotify's editorial ecosystem responds to. The result wasn't a single placement — it was **repeatable entry into editorial playlists.**

**Layout:**
- Top row: split before/after images
  - Left: `/assets/img/exxia-before.png` — label "BEFORE"
  - Right: `/assets/img/exxia-after.png` — label "AFTER" (green background)
- Below: full-width body

**Body:**
- **Subhead (green, uppercase):** EXXIA — SPOTIFY RESULTS
- **Strategy** (bulleted, green ▲ markers):
  - Strategic release sequencing
  - Paid + organic amplification
  - Influencer activation
  - Editorial targeting strategy
- **Achievement (12 months):**
  > **+1,851% stream growth** · **+20 Spotify Editorial Playlists**

User clicks "Next →" to advance.

---

## STEP 9 — Commitment & strategy (4 sub-questions)

### Question 9a
**Helper:**
> Operating at a label-ready level requires commitment, structure, and accountability.

**Question:**
> How serious are you about treating your music career as a business? *

**Field name:** `seriousness` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Hobby` | It's a hobby |
| `Side focus` | It's a side focus |
| `Fully committed` | I'm fully committed |

### Question 9b
**Helper:**
> Acceleration requires alignment.

**Question:**
> Are you open to creative direction and operating within a structured development plan? *

**Field name:** `open_to_direction` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Yes` | Yes |
| `It depends` | It depends |
| `Not really` | Not really |

### Question 9c (no helper)
**Question:**
> Do you currently operate with a defined release strategy? *

**Field name:** `release_strategy` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Yes` | Yes |
| `Not yet, but I know I need one` | Not yet, but I know I need one |
| `No` | No |

### Question 9d
**Helper:**
> Momentum is built through execution.

**Question:**
> Do you currently have a finished track (mixed & mastered) ready to release within 30–60 days? *

**Field name:** `track_ready` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Yes` | Yes |
| `Almost` | Almost |
| `Not yet` | Not yet |

---

## STEP 10 — Why us

**Helper:**
> We work with artists who understand that structured growth requires discipline, consistency, and long-term commitment.

**Question:**
> Why should our team consider working with you? *

**Field name:** `why_us` — textarea (required), placeholder: "Tell us what makes you stand out"

**Narrative block (below textarea, with top border):**
> **This isn't a campaign — it's a development phase designed to build real positioning.**
>
> (muted) The question isn't whether you can grow. It's whether you're ready to grow with structure.

---

## STEP 11 — Investment readiness

### Question 11a (no helper)
**Question:**
> On average, how much do you currently invest per release? *

**Field name:** `current_spend` — radio (required)

| Value | Label shown |
|-------|-------------|
| `$0-$300` | $0–$300 |
| `$300-$500` | $300–$500 |
| `$500-$1,000` | $500–$1,000 |
| `$1,000-$3,000+` | $1,000–$3,000+ |

### Pricing reveal block (visual, no input)

Boxed block with green-tinted gradient background:

> **3-month development phase** *(tag)*
>
> **$1,500 upfront**
>
> — or —
>
> **$690 /month**
>
> **This is not an expense. It is infrastructure.**
> Includes strategic positioning, release sequencing, execution oversight, and ongoing directional support throughout the entire phase.

### Question 11b
**Helper:**
> Serious growth requires serious commitment.

**Question:**
> If we determine strong alignment, are you prepared to invest at this level to operate at a label-ready standard? *

**Field name:** `ready_to_invest` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Yes` | Yes |
| `Possibly` | Possibly |
| `No` | No |

---

## STEP 12 — Timing + Submit

**Helper:**
> Clarity removes hesitation. Strong alignment creates momentum.

**Question:**
> If accepted, when would you want to begin? *

**Field name:** `start_timing` — radio (required)

| Value | Label shown |
|-------|-------------|
| `Immediately` | Immediately |
| `Within 30 days` | Within 30 days |
| `Gathering information` | Gathering information |

**Submit button:** "Submit Application" (currently disabled)

**Note below submit button (currently always visible since endpoint is empty):**
> 🔧 **Submissions are temporarily paused** while we upgrade our internal systems. Please check back soon, or follow us on Instagram for updates.

When `FORM_ENDPOINT` is set in `quiz-application.js:14`, this note will only appear on Step 12 (and the submit button becomes active).

---

## Full field index (alphabetical, for CRM mapping)

| Field name | Step | Type | Required | Enum values (if applicable) |
|------------|------|------|----------|----------------------------|
| `artist_name` | 1 | text | ✅ | — |
| `current_spend` | 11 | radio | ✅ | $0-$300, $300-$500, $500-$1,000, $1,000-$3,000+ |
| `email` | 1 | email | ✅ | — |
| `genre` | 2 | radio | ✅ | Hip-Hop / Rap, R&B / Soul, Rock, Electronic / Dance, Pop, Other |
| `growth_challenge` | 3 | radio | ✅ | Building a real fan base, Increasing streams consistently, Creating strong brand positioning, Running marketing that converts, Accessing industry opportunities, No clear strategy yet |
| `instagram` | 1 | text | ❌ | — |
| `invested_before` | 5 | radio | ✅ | Yes, consistently / Yes, occasionally / Not yet |
| `monthly_listeners` | 2 | radio | ✅ | 0-1k, 1k-10k, 10k-50k, 50k-100k, 100k+ |
| `open_to_direction` | 9 | radio | ✅ | Yes / It depends / Not really |
| `phone` | 1 | tel | ✅ | — |
| `ready_to_invest` | 11 | radio | ✅ | Yes / Possibly / No |
| `release_strategy` | 9 | radio | ✅ | Yes / Not yet, but I know I need one / No |
| `seriousness` | 9 | radio | ✅ | Hobby / Side focus / Fully committed |
| `source` | hidden | text | (auto) | team / distribution |
| `spotify_url` | 1 | url | ❌ | — |
| `start_timing` | 12 | radio | ✅ | Immediately / Within 30 days / Gathering information |
| `submitted_at` | meta | ISO timestamp | (auto) | — |
| `team` | 5 | radio | ✅ | Strategic team supporting growth, Technical collaborators no strategy, Freelancers when needed, Solo / entirely on my own, No real team yet |
| `track_ready` | 9 | radio | ✅ | Yes / Almost / Not yet |
| `vision_12m` | 7 | textarea | ✅ | — |
| `why_us` | 10 | textarea | ✅ | — |
| `working_toward` | 7 | radio | ✅ | Serious long-term project, Growing leverage before labels, Positioning for major-level, Still figuring things out |

**Total fields sent in POST body: 22** (20 user inputs + `source` + `submitted_at`).

---

## Visual / behavioral notes

- **Wizard navigation:** one step per screen, fade animation, progress bar
- **Validation:** runs on Next click — invalid required fields turn red with error text below
- **Draft persistence:** `localStorage` key `iconent_quiz_draft_v1` — partial answers survive page refresh
- **Enter key:** advances to next step (unless inside a textarea)
- **Keyboard a11y:** radio groups have `role="radiogroup"`; tab order respects DOM
- **Mobile-first:** all steps stack to single column under 640px; case study images stack vertically
- **Theme:** dark page (`#0A0A0A`), card on `#141414`, accent green `#00FF88`, error red `#FF5050`

---

## Files involved (frontend)

| File | Role |
|------|------|
| `artist-management-application/index.html` | Team variant page |
| `major-label-application/index.html` | Distribution variant page |
| `assets/css/pages/quiz-application.css` | All wizard styling |
| `assets/js/quiz-application.js` | Wizard logic, validation, localStorage, (deferred) submit |
| `vercel.json` | Routes `?fluent-form=15/16` to these URLs |

---

**Last updated:** 2026-05-22
**Frontend version:** `quiz-application.js?v=3`, `quiz-application.css?v=3`
