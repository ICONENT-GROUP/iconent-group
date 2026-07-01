# Jarvis + Ecosystem Loops — Blueprint

**For:** the session building Jarvis (personal AI orchestrator running on the MacBook, controlled from the phone via Telegram). Pick this up after the Jarvis core is working.
**Purpose:** define how the "AI loop" pattern is applied across the whole Iconent ecosystem (CRM, content, creatives, dev, ops) on top of one shared approval gate and one shared memory.
**Status:** Design/handoff. Nothing built yet. Build in the phased order in §7 — do NOT build all domains at once.

---

## 0. The one rule everything hangs on

> **A loop is only as good as its VERIFY.**

A loop is powerful because it **self-corrects toward a goal**: try → verify → if not there, iterate. It can only do that if it has an *objective* way to say "done / not done". So for every candidate task the question is always: **can a machine check the VERIFY on its own?**

- **Yes, fully** → autonomous loop (CRM data, dev/bugs, ops).
- **Yes, partially** → loop with objective auto-checks + a human gate as the final verify (content).
- **No** → not a loop; generation-of-options on command, human picks (creatives).

Every loop MUST have `STOP WHEN` (a condition **and** a max-iteration cap). A loop without a stop is a token black hole (see §6).

---

## 1. Architecture (three layers)

1. **Jarvis (orchestrator)** — always-on on the Mac. Does not do the work; it *routes*: understands the request, picks the right skill/agent, runs the loop, applies the gate.
2. **Unified Telegram gate** — the single place from which the user approves / edits / denies / stops any "action that counts", from any domain, from the phone. Implemented via the Agent SDK `can_use_tool` callback (async, can stay pending indefinitely → perfect for waiting on a phone tap). See `2026-07-01`-adjacent permissions notes / §5.
3. **Shared memory** — the glue (Supabase for structured data + Drive for documents). Who the artist/lead is, what was already done, brand voice, history. Without it every agent restarts from zero and outputs are disconnected. **Extending this memory is the second phase after Jarvis core.**

Domain agents sit underneath and pull from the existing tools: Gmail, Google Calendar, Google Drive, Fireflies, Canva, Higgsfield, Supabase, GitHub, Sentry.

---

## 2. Loopability map of the Iconent ecosystem

| Domain | Tools | Loopability | Mode |
|---|---|---|---|
| CRM / leads (gestionale) | Supabase, Gmail, Calendar | 🟢 High | Autonomous loop |
| Dev / product (site + CRM) | GitHub, Supabase, Sentry | 🟢 High | Autonomous loop, gate on merge |
| Ops (strategy calls, meetings) | Fireflies, Calendar, Drive, CRM | 🟢 High | Autonomous loop, gate on outbound |
| Content (social: Spotify/TikTok/YouTube/IG) | Drive, Canva, CRM | 🟡 Medium | Loop with human gate = final verify |
| Admin / inbox | Gmail, Calendar | 🟡 Medium | Loop with batch human confirm |
| Creatives (visual assets) | Higgsfield, Canva | 🔴 Low | NOT a loop — generate options on command |

---

## 3. Loop specs — autonomous (objective VERIFY)

### 3.1 CRM — lead enrichment
```
GOAL: every new lead (source = team | distribution) has valid email, name,
      artist/project, stage, and a score.
EACH ITERATION:
  1. pull leads with missing required fields
  2. enrich the single highest-impact missing field
  3. re-check required fields
VERIFY: 0 leads with empty required fields + email format valid
STOP WHEN: verify passes, OR 5 iterations
ON STOP: report "enriched X, unresolved Y (why)"
```

### 3.2 CRM — follow-up cadence
```
GOAL: no active lead is stale (no touch > 7 days) without a queued follow-up.
EACH ITERATION:
  1. find leads with last_touch > 7d and no pending follow-up
  2. draft a personalized follow-up (uses brand voice from memory)
  3. queue it → GATE: user approves send from Telegram
VERIFY: every stale lead has an approved-or-queued follow-up
STOP WHEN: verify passes, OR 3 iterations
ON STOP: list leads that need a human decision (not a template)
```

### 3.3 Dev — Sentry bug
```
GOAL: Sentry error #ID stops recurring and tests pass.
EACH ITERATION:
  1. reproduce the error
  2. write the smallest change that fixes it
  3. re-run tests + type check
VERIFY: green tests + zero errors + error no longer reproduces
STOP WHEN: verify passes, OR 8 iterations → GATE on merge
ON STOP: summarize what changed and what still fails
```

### 3.4 Ops — meeting → actions
```
GOAL: every Fireflies meeting has summary + tasks created + notes saved.
EACH ITERATION:
  1. take the next unprocessed meeting
  2. extract action items → create CRM tasks + Drive notes
  3. verify each action item maps to a task
VERIFY: N action items = N tasks, each with owner + due date
STOP WHEN: verify passes, OR 3 iterations
ON STOP: list action items that couldn't be mapped
        (GATE only when an action item is outbound, e.g. email a client)
```

---

## 4. Loop specs — human gate as final verify

### 4.1 Content (social post / newsletter)
```
GOAL: an on-brand post ready for brief X (platform: Spotify/TikTok/YouTube/IG).
EACH ITERATION:
  1. generate draft + 2 variants
  2. AUTO-CHECK (objective): brand voice, length limits, CTA present, hashtags
  3. fix whatever fails the auto-check
VERIFY: passes objective auto-checks → THEN Telegram gate (user = final verify)
STOP WHEN: user approves, OR 3 rounds, OR timeout → stays as draft
ON STOP: save best variant to Drive as draft
```
Key trick: **split the VERIFY**. The objective part (length, CTA, tone) the loop
verifies and self-corrects; the subjective part ("is it good?") is the human tap.
This is what stops the loop from spinning forever on taste.

### 4.2 Admin — inbox triage
```
GOAL: inbox has no unclassified message; routine replies drafted.
EACH ITERATION:
  1. classify new messages (lead / client / vendor / noise)
  2. draft replies for routine ones; create tasks/events for the rest
VERIFY: 0 unclassified + every routine message has a draft
STOP WHEN: verify passes, OR 3 iterations → batch GATE (approve sends together)
ON STOP: surface anything needing a real decision
```

---

## 5. The unified gate (cross-cutting)

The SAME Telegram bot is the gate for every domain. Any agent, when it reaches an
action "that counts", routes the request to the one bot; the user approves from
the phone. One control point for the whole business.

- Implemented via `can_use_tool` (Agent SDK). Pre-filter with `allow` / `deny` /
  `ask` rules + `additionalDirectories` so only the ~10% that matters reaches the phone.
- Message must show **tool + exact action + target** (e.g. "send email to lead X",
  "publish post", "change price").
- Three buttons: **✅ Once / 📌 Always / ❌ No**. "Always" persists via
  `updated_permissions` so that category isn't asked again.
- Timeout → soft deny (`interrupt=False`, agent can retry). `/stop` → hard deny
  (`interrupt=True`). `/status` shows current activity.
- Auto-approved actions still get logged to a read-only channel for audit.

---

## 6. Cost discipline (hard rules)

Each iteration reloads the whole context → cost compounds. With a "free / max €5"
mindset this is the make-or-break.

- `STOP WHEN` is **mandatory** everywhere — condition + max iterations, no exceptions.
- A loop is worth it only when **value of result > cost of iterations**. CRM/dev: yes
  (a fixed bug is worth the tokens). "Perfecting" a creative: no.
- **Creatives never loop** — one generation pass of N options, human picks. Looping
  visuals burns Higgsfield/Canva credits with no objective signal it's improving.
- Cheap model for objective/mechanical tasks (CRM, triage); big model for dev + reasoning.
  Quality of the VERIFY matters more than power of the generator.
- The gate doubles as a cost brake: before a repeated/expensive action, it asks.

---

## 7. Build order (do not skip — slide-11 rule)

Applies the "order that actually works": **manual run → skill → loop → schedule.**
One domain at a time; each new domain reuses the same gate + memory.

1. Jarvis core + Telegram gate working (this session's current task).
2. **Extend shared memory** (Supabase schema + Drive conventions) — the glue for everything else.
3. First domain: **CRM lead enrichment (§3.1)** — objective, high ROI, safe.
   - run it manually until reliable → save as skill → wrap in loop → then schedule.
4. Second: **Ops meeting → actions (§3.4)**.
5. Third: **Content with human gate (§4.1)**.
6. Then dev/admin as needed. Creatives stay generation-on-command (§6).

---

## 8. Benefits (why this and not one-shot prompting)

The only real difference between a prompt and a loop is **self-correction**. With a
prompt, the human is the verifier every turn. With a loop, the machine runs the
correction cycles by itself up to the edge of judgment, and calls the human only there.

Applied across the ecosystem, that means:
- **Control from anywhere, one control point** — run CRM/content/dev/creatives from the phone.
- **Reclaims dead time, not creative time** — machine eats the repetitive/objective work
  (CRM data, meeting notes, triage, first drafts); human keeps judgment + relationships.
- **Consistency across domains** — shared memory makes the sales email, the post, and the
  creative speak the same language about the same artist/lead.
- **Cost controlled by design** — loops only where VERIFY is objective, STOP WHEN always,
  cheap models for routine, creatives on command.
- **Scales by composition** — new domain = reuse the same gate + method, not a rewrite.
- **Traceability** — every auto-action is logged; you always know what ran while you were away.

**Honest limits:** it's a co-pilot that amplifies the user, not "press a button and the
business runs itself". The human becomes the bottleneck (approvals) — manage it by
pre-approving safe categories and gating only what matters. Creative quality stays a human
call; the AI multiplies options, not taste.
