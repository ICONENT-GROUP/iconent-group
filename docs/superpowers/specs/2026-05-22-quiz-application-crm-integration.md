# Quiz Application → CRM Integration Spec

**For:** the team building the Iconent custom CRM (gestionale).
**Purpose:** describe exactly what the public-facing quiz form sends, so the CRM can ingest applications without changes to the form.
**Status:** Frontend is built and live. Submit is disabled pending this integration.

---

## 1. Where the form lives

The custom quiz is a static multi-step wizard hosted on Vercel. There are **two URLs** that both render the same form:

| URL | Used by | `source` value |
|-----|---------|----------------|
| `https://iconent-group.com/artist-management-application/` | Team / management ads (ex Fluent Form 15) | `team` |
| `https://iconent-group.com/major-label-application/` | Distribution ads (ex Fluent Form 16) | `distribution` |

The form fields are **identical** between the two URLs — only the H1, page title, and the hidden `source` value differ. The CRM should treat them as one ingestion endpoint and use `source` to segment leads.

**Frontend source location** (for reference, do not modify from the CRM side):
- HTML: `artist-management-application/index.html` and `major-label-application/index.html`
- CSS: `assets/css/pages/quiz-application.css`
- JS: `assets/js/quiz-application.js`

---

## 2. How to "turn on" submissions

Currently the Submit button is **disabled** because no endpoint is wired. To activate it, exactly one line in JS must change:

`assets/js/quiz-application.js` line 14:
```js
const FORM_ENDPOINT = ''; // <— set this to the CRM endpoint URL
```

Change to (example):
```js
const FORM_ENDPOINT = 'https://crm.iconent-group.com/api/applications';
```

Once `FORM_ENDPOINT` is non-empty:
- Submit button becomes clickable (after final-step validation passes)
- On click → `fetch(POST)` with JSON body (see schema below)
- On HTTP 2xx → user is redirected to `/strategy-call/?source=<value>&applied=1`
- On non-2xx or network error → alert + Submit re-enabled

No other frontend code needs to change.

---

## 3. HTTP request the form will make

```http
POST {FORM_ENDPOINT}
Content-Type: application/json
```

**Body**: JSON object with the schema in section 4. No auth header is sent — if the CRM endpoint needs auth, expose it via:
- A pre-signed URL (simplest, no JS change), OR
- A shared HMAC signature (we can add it to JS — coordinate with frontend), OR
- A CORS-permitted public ingestion endpoint with rate limiting + spam filter on the CRM side (recommended for MVP).

**CORS requirement**: the endpoint must respond with `Access-Control-Allow-Origin: https://iconent-group.com` (and preferably `https://iconent-group.vercel.app` for previews). Without CORS, the browser will block the request silently — leads lost.

---

## 4. JSON payload schema

All keys are top-level, no nesting. Empty strings are sent for unfilled optional fields. Required fields are guaranteed non-empty (frontend blocks submit otherwise).

```jsonc
{
  // ---- IDENTITY (Step 1) ----
  "artist_name":      "string, required",
  "email":            "string, required, valid email",
  "phone":            "string, required, ≥7 digits after non-digit strip",
  "instagram":        "string, optional",         // e.g. "@username" — may include @ or not
  "spotify_url":      "string, optional",         // spotify.com or soundcloud.com URL

  // ---- SOURCE TRACKING (hidden) ----
  "source":           "team" | "distribution",    // which URL the artist landed on

  // ---- SOUND PROFILE (Step 2) ----
  "genre":            "Hip-Hop / Rap" | "R&B / Soul" | "Rock" | "Electronic / Dance" | "Pop" | "Other",
  "monthly_listeners":"0-1k" | "1k-10k" | "10k-50k" | "50k-100k" | "100k+",

  // ---- GROWTH CHALLENGE (Step 3) ----
  "growth_challenge": "Building a real fan base"
                    | "Increasing streams consistently"
                    | "Creating strong brand positioning"
                    | "Running marketing that converts"
                    | "Accessing industry opportunities"
                    | "No clear strategy yet",

  // ---- TEAM & HISTORY (Step 5) ----
  "team":             "Strategic team supporting growth"
                    | "Technical collaborators, no strategy"
                    | "Freelancers when needed"
                    | "Solo / entirely on my own"
                    | "No real team yet",
  "invested_before":  "Yes, consistently" | "Yes, occasionally" | "Not yet",

  // ---- VISION (Step 7) ----
  "vision_12m":       "string (textarea), required",
  "working_toward":   "Serious long-term project"
                    | "Growing leverage before labels"
                    | "Positioning for major-level"
                    | "Still figuring things out",

  // ---- COMMITMENT (Step 9) ----
  "seriousness":      "Hobby" | "Side focus" | "Fully committed",
  "open_to_direction":"Yes" | "It depends" | "Not really",
  "release_strategy": "Yes" | "Not yet, but I know I need one" | "No",
  "track_ready":      "Yes" | "Almost" | "Not yet",

  // ---- PITCH (Step 10) ----
  "why_us":           "string (textarea), required",

  // ---- INVESTMENT (Step 11) ----
  "current_spend":    "$0-$300" | "$300-$500" | "$500-$1,000" | "$1,000-$3,000+",
  "ready_to_invest":  "Yes" | "Possibly" | "No",

  // ---- TIMING (Step 12) ----
  "start_timing":     "Immediately" | "Within 30 days" | "Gathering information",

  // ---- META (auto-added) ----
  "submitted_at":     "ISO-8601 string, e.g. 2026-05-22T14:23:11.547Z"
}
```

### Realistic example payload

```json
{
  "artist_name": "JANE DEMO",
  "email": "jane@example.com",
  "phone": "+393331234567",
  "instagram": "@janedemo",
  "spotify_url": "https://open.spotify.com/artist/abc123",
  "source": "team",
  "genre": "R&B / Soul",
  "monthly_listeners": "10k-50k",
  "growth_challenge": "Creating strong brand positioning",
  "team": "Technical collaborators, no strategy",
  "invested_before": "Yes, occasionally",
  "vision_12m": "I want to sign with a major label and tour Europe with a 20-date run...",
  "working_toward": "Positioning for major-level",
  "seriousness": "Fully committed",
  "open_to_direction": "Yes",
  "release_strategy": "Not yet, but I know I need one",
  "track_ready": "Almost",
  "why_us": "I have momentum from the last EP and I'm ready to scale with structure...",
  "current_spend": "$500-$1,000",
  "ready_to_invest": "Yes",
  "start_timing": "Within 30 days",
  "submitted_at": "2026-05-22T14:23:11.547Z"
}
```

---

## 5. Expected response

The frontend only checks **HTTP status code**:
- `2xx` → success → redirect to `/strategy-call/?source=<source>&applied=1`
- anything else → user-facing alert + Submit re-enabled

Response body is **not parsed**. The CRM can return anything (empty body, JSON ack, HTML — frontend ignores it). Recommended for debugging: return `{ "ok": true, "id": "<crm-lead-id>" }` so logs are useful.

---

## 6. Field semantics & CRM mapping suggestions

| Field | CRM use |
|-------|---------|
| `artist_name` | Lead display name |
| `email` | Primary contact + dedup key |
| `phone` | Secondary contact, WhatsApp outreach |
| `instagram` | Profile audit (followers, content cadence) |
| `spotify_url` | Stream/listener verification before call |
| `source` | **Campaign attribution.** `team` = artist management ads, `distribution` = major-label distribution ads. Use to segment pipelines and reporting. |
| `genre`, `monthly_listeners` | Initial fit/score |
| `growth_challenge`, `team`, `invested_before` | Pre-call discovery prep |
| `vision_12m`, `working_toward`, `why_us` | Manual review fields — show in lead detail view |
| `seriousness`, `open_to_direction`, `release_strategy`, `track_ready` | **Qualification gate.** Flag if `seriousness="Hobby"` or `open_to_direction="Not really"`. |
| `current_spend`, `ready_to_invest` | **Budget qualification.** `ready_to_invest="No"` should auto-flag as low-priority. |
| `start_timing` | Pipeline urgency — `Immediately` = call within 24h. |
| `submitted_at` | Lead created-at timestamp |

### Suggested lead score (CRM-side, optional)
```
+3 if monthly_listeners >= 10k-50k
+3 if seriousness == "Fully committed"
+3 if ready_to_invest == "Yes"
+2 if open_to_direction == "Yes"
+2 if track_ready == "Yes"
+2 if working_toward in {"Serious long-term project", "Positioning for major-level"}
+1 if start_timing == "Immediately"
-5 if seriousness == "Hobby"
-3 if ready_to_invest == "No"
-3 if open_to_direction == "Not really"
```
Threshold for auto-route to call calendar: `>= 10`.

---

## 7. Post-submit flow

After successful POST, the browser redirects to:
```
https://iconent-group.com/strategy-call/?source=<team|distribution>&applied=1
```

`/strategy-call/` is the existing VSL + Calendly page. The `applied=1` flag can be used to:
- Suppress the 30-second Calendly lock (optional UX improvement — talk to frontend if you want this)
- Show a personalized "Welcome back, your application is being reviewed" banner (optional)

For now, the page treats `applied=1` like any other visit. No backend changes needed on day 1.

---

## 8. Idempotency & retries

The frontend does **not retry** on failure. The user sees an alert and can click Submit again. So the CRM endpoint should be **idempotent on `email`**:
- If an email already exists in the last 24h → update the existing lead (don't create duplicate).
- If older → treat as a new lead (artist may legitimately re-apply months later).

Frontend has no draft-ID system. If you want server-side dedup beyond email, consider adding a client-side UUID — coordinate with frontend.

---

## 9. Local draft persistence (no CRM impact)

The frontend stores partial answers in `localStorage` under key `iconent_quiz_draft_v1` so a refresh doesn't wipe progress. This is **purely client-side** — nothing is sent to the CRM until the user clicks Submit. The CRM will never see partial drafts.

---

## 10. Testing checklist (CRM side)

Before flipping `FORM_ENDPOINT` to production:

- [ ] Endpoint accepts `POST application/json` from `https://iconent-group.com` (CORS ✓)
- [ ] Endpoint handles all 24 fields above (validate schema)
- [ ] Returns 2xx on success
- [ ] Logs/stores `source` field for attribution
- [ ] Dedup logic on `email` works
- [ ] Test with a real submission from staging URL before pointing to prod
- [ ] Set up internal notification (email/Slack) on new submission
- [ ] Confirm spam filter (rate limit IP, honeypot, reCAPTCHA if needed — coordinate with frontend if reCAPTCHA needed)

---

## 11. Open coordination points

When CRM is ready, ping frontend with:
1. Final `FORM_ENDPOINT` URL (HTTPS only)
2. Whether auth header / HMAC signature is needed
3. Any required additional fields (we can add them — but try to keep schema stable)
4. Whether `applied=1` redirect param should trigger anything on `/strategy-call/` (e.g., skip Calendly lock)

Contact: Kenzo / Iconent Group frontend team.

---

**Last updated:** 2026-05-22
**Frontend version reference:** `quiz-application.js?v=3`
