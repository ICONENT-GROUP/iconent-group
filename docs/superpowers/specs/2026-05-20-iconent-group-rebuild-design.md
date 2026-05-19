# ICONENT-GROUP.COM — Static Site Rebuild

**Date:** 2026-05-20
**Status:** Design approved
**Owner:** Kenzo (zeby2014@gmail.com)

---

## 1. Goal

Rebuild iconent-group.com as a clean, dependency-free static HTML/CSS/JS site, replacing the current WordPress + Elementor implementation. Target deployment: drop into Netlify / Vercel / Cloudflare Pages. Solve the CSP problem (canvas hero animation currently broken on production), eliminate plugin conflicts, drop the 3-widget Elementor stack pattern.

## 2. Non-goals

- No CMS, no admin UI, no WordPress migration tooling
- No build step (no Astro, no Eleventy, no bundler)
- No backend (contact form goes via `mailto:` initially; Fluent integration deferred)
- No analytics integration in this scope (placeholder slots only)
- No image optimization pipeline (use the existing assets at served sizes)

## 3. Tech stack

- **Plain HTML5** — one file per page, slug = filename
- **CSS** — vanilla, custom properties for theming, no preprocessor
- **JS** — vanilla ES2020+, web components (Custom Elements v1), no framework
- **No dependencies, no package.json, no node_modules**
- **External script:** `https://assets.calendly.com/assets/external/widget.js` (lazy-loaded only when modal opens)

## 4. Project structure

```
iconent-group/
├── index.html                          # Home
├── about-us.html
├── services-project-management.html    # Featured service
├── services-spotify.html
├── services-youtube.html
├── services-instagram.html
├── services-tiktok.html
├── contact-us.html
├── assets/
│   ├── css/
│   │   ├── tokens.css                  # palette, spacing, type scale, breakpoints
│   │   ├── base.css                    # reset, body, typography, grid background
│   │   ├── components.css              # header, footer, btn, card, marquee, faq, modal, hero, sections
│   │   └── pages/
│   │       ├── home.css                # homepage-specific overrides
│   │       ├── about.css
│   │       ├── service-pm.css          # project management page
│   │       ├── service-platform.css    # template for spotify/yt/ig/tt
│   │       └── contact.css
│   ├── js/
│   │   ├── components.js               # <ic-header>, <ic-footer> custom elements
│   │   ├── shared.js                   # mobile menu, nav scroll, dropdown CTA, FAQ accordion, utils
│   │   ├── home.js                     # hero canvas animation, count-up metrics
│   │   └── calendly.js                 # modal open/close, lazy-load widget script
│   ├── img/                            # all images downloaded from iconent-group.com
│   │   ├── team-hayden.png             # was 35.png
│   │   ├── team-jack.png               # was 34.png
│   │   ├── team-joe.png                # was 33.png
│   │   ├── iicy-portrait.png           # was adv-2.png
│   │   ├── spotify-listeners.png       # was adv-3.png
│   │   ├── spotify-editorials.png      # was adv-4.png
│   │   ├── spotify-saves-adds.png      # was 43.png
│   │   ├── ig-1-4m.jpg                 # was IMG_7702.jpg
│   │   ├── ig-51m.jpg                  # was IMG_7694.jpg
│   │   ├── youtube-overview-822k.png   # Google Ads: 4.08M impressions, 822K TrueView views
│   │   ├── youtube-campaign-207k.png   # 207K impressions, 19.8K TrueView views, €0.01 CPV
│   │   ├── youtube-campaign-58k.png    # 58.6K impressions, 23K TrueView views, 39.16% view rate
│   │   ├── tiktok-1.png                # TBD — user sending later
│   │   ├── stop-dropping.jpg           # was 1.jpg
│   │   ├── banner-map.jpg              # was 4.jpg
│   │   ├── partner-sony.png
│   │   ├── partner-warner.png          # was 25.png
│   │   ├── partner-universal.png       # was 24.png
│   │   ├── partner-believe.png         # was BELIEVE-MUSIC.png
│   │   └── partner-ingrooves.png       # was 28.png
│   └── icons/
│       └── (SVG inline, no separate files — embedded in components.js for header/footer social)
├── llms.txt
├── robots.txt
├── sitemap.xml
└── README.md
```

**Asset rename rationale:** the WP filenames (`35.png`, `adv-3.png`, etc.) are opaque. Renaming to semantic filenames during the download step makes the codebase self-documenting and survives image swaps without grep-and-replace.

## 5. Design tokens (locked from brief)

```css
:root {
  /* palette */
  --ic-bg: #0A0A0A;
  --ic-bg-soft: #141414;
  --ic-text: #F5F5F5;
  --ic-muted: #8A8A8A;
  --ic-rule: #2A2A2A;
  --ic-green: #00FF88;
  --ic-blue: #3D8BFF;
  --ic-grey: #6B7280;

  /* platform brand colors */
  --plat-spotify: #1DB954;
  --plat-youtube: #FF3B30;
  --plat-instagram: #00B2FF;
  --plat-tiktok-pink: #FF0050;
  --plat-tiktok-cyan: #00E6FF;

  /* spacing scale */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
  --sp-9: 80px; --sp-10: 110px;

  /* font */
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", system-ui, sans-serif;

  /* breakpoints (used in JS only — CSS uses literals) */
}
```

**Typography rules:**
- "ICONENT GROUP" always uppercase
- Footer "© 2026 Iconent-Group" capitalized + hyphen (exception)
- US spelling (catalog, not catalogue)
- No em-dashes for stylistic contrast, no "not X, it's Y" pattern, no lists of three
- Industry verbs: drop, rollout, land, hold, break, plays/adds/saves
- "emerging" → "up-and-coming" / "urban" / "indie"

## 6. Header & footer architecture

**Single source of truth: `assets/js/components.js`** — defines `<ic-header>` and `<ic-footer>` as Custom Elements.

```html
<!-- in every page -->
<body>
  <ic-header></ic-header>
  <main>...</main>
  <ic-footer></ic-footer>
  <script src="/assets/js/components.js" defer></script>
</body>
```

**`<ic-header>` behavior:**
- Renders nav: logo "ICONENT" → `/`, Services dropdown (hover desktop / click mobile), Contact, Book a Call (green CTA)
- Reads `location.pathname`, applies `.is-active` to current nav item
- Hover desktop: text → `#BBBBBB` (NOT opacity — brief: opacity on black goes invisible)
- Mobile (≤900px): hamburger toggle → fullscreen menu with labels SERVICES / MENU, 3×18px platform-colored bars next to each service item
- Scroll handler: adds `.scrolled` class when `scrollY > 60` (background blur)
- "Book a Call" buttons call `window.icOpenCalendly()` (defined in `calendly.js`)

**`<ic-footer>` behavior:**
- Centered, max-width 600px
- Social SVG icons (Instagram + Facebook) inline in template, grey 0.55 → white 1.0 + translateY(-2px) on hover
- Text blocks: "ICONENT GROUP" (13px uppercase grey), "Digital Marketing and Promotional Services" (11px), address (11px), "© 2026 Iconent-Group. All rights reserved." (10px)

**Why custom elements over copy-paste:**
- DRY: one file to edit when chrome changes
- Zero FOUC: synchronous innerHTML in `connectedCallback`, no fetch
- Works with `file://` (no CORS)
- CSP-safe: no inline scripts, no eval
- SEO acceptable: Googlebot executes JS (header/footer not load-bearing for indexing anyway — main content is in `<main>`)

**SEO trade-off accepted:** header/footer don't render until JS executes (~5ms). If this becomes a problem in audits, the alternative is copy-paste header/footer into all 8 files manually. Defer that decision until a real audit complaint.

## 7. Homepage (`index.html`)

**Porting strategy:** the user provided the existing HTML/CSS source. The new homepage is a clean port, not a redesign. Visual output should be pixel-equivalent.

**Cleanup applied during port:**
1. Remove `.ic-home` prefix from all selectors — was Elementor scoping, no longer needed (file is the scope now)
2. Remove all Elementor / WP parent resets (~80 lines: `.elementor-section`, `.e-con`, `.elementor-widget-html`, etc.)
3. Move `.ic-home::before` grid pattern to `body::before` in `base.css`
4. Replace all `<a href="javascript:void(0)" onclick="...">` with `<button class="ic-btn">` + event listeners attached in `home.js`
5. Move inline `<script>` block entirely into `home.js`
6. Move inline `<style>` block, split across `tokens.css`, `base.css`, `components.css`, `pages/home.css`
7. Update all `<img src="https://iconent-group.com/wp-content/uploads/.../X.png">` to local `/assets/img/<semantic-name>.png`

**Section order (unchanged from source):**
1. Hero (canvas + H1 + tagline + scroll hint)
2. Marquee — Artist Project Management ◆ A&R Direction ◆ Music Distribution ◆ Release Strategy ◆ Urban Artists ◆ Nashville · LA · Chicago · NY
3. Who we are — 2col grid: copy + 1.jpg portrait
4. Comparison — DIY way vs ICONENT way (2 cards)
5. Method — Foundation / Sound & Brand / Launch (3 steps)
6. CTA block #1 — "Ready to build something real?" + Book Call + Discover Services (inline dropdown)
7. Case study IICY — circular portrait + 4 count-up metrics (19,730 / 153,366 / 6,034 / 7,280) + outcome
8. Proof strip — 5 cards desktop + 6th mobile-only, alternating Spotify ↔ Instagram screenshots
9. Team brief — Hayden / Jack / Joe (3 circular cards with radial green flares)
10. Partners marquee — Sony ◆ TuneCore ◆ Warner ◆ DistroKid ◆ Universal ◆ Believe ◆ Ingrooves (height 140px, Warner 200px, Ingrooves 161px)
11. Banner — 4.jpg (banner-map) full-width, 21:9, max-height 480px, double gradient overlay for 4-side fade
12. FAQ — 5 accordion items, first is "What is ICONENT GROUP?"
13. Final CTA — "Stop posting and praying"
14. Calendly modal (hidden, rendered last)

**Hero canvas animation (`home.js`):**
- Rebuilt from the brief specification (the source JS was truncated in the brief delivery)
- Three layers composited with `requestAnimationFrame`:
  - **Matrix layer:** falling green digits/glyphs, columns spaced ~20px, char drop speed varies per column
  - **Spectrogram layer:** vertical blue dots arranged as audio wave bars across viewport bottom third, oscillating amplitude
  - **Particles layer:** 80 floating particles desktop / 40 mobile, mix of green/blue/grey, random drift with subtle parallax on mousemove
- Color palette: `{green: rgba(0,255,136,X)}`, `{blue: rgba(61,139,255,X)}`, `{grey: rgba(140,140,140,X)}`
- DPR-aware canvas resize on `window.resize`
- Pauses RAF when `document.hidden === true` (battery / cpu)
- Respects `prefers-reduced-motion: reduce` — disables animation, shows static frame

**Count-up metrics:**
- IntersectionObserver triggers when case study section enters viewport (threshold 0.3)
- Animates from 0 to `data-count` value over 1.6s with `easeOutQuad`
- Number formatting: `toLocaleString('en-US')` for commas

## 8. About page (`about-us.html`)

Generated on-brand, reusing homepage components and content where it exists.

**Sections:**
1. **Hero (compact)** — H1 "Built to succeed" or "We build artist careers" + subtitle. No canvas animation (reserved for homepage). Just the body grid pattern + radial green glow center.
2. **Mission block** — "Stop dropping. Start building." reused tagline + expanded mission copy (2 paragraphs from "Who we are" section, longer-form)
3. **Method recap** — 3-step Foundation / Sound & Brand / Launch (same component as homepage, slight visual variation)
4. **Team (full)** — Hayden, Jack, Joe with bigger photos + extended bios. Use existing photos: `team-hayden.png`, `team-jack.png`, `team-joe.png`.
5. **Where we are** — Nashville · Chicago · Los Angeles · New York with the address `99 Wall Street, New York, NY 10005`
6. **What's next** — expansion areas: publishing, sync licensing, music technology
7. **CTA** — Book a Review Call (reuse component)

**Copy guidelines:** voice = direct, no fluff. Industry vocabulary. Same compare structure if it makes sense, but don't force.

## 9. Service pages

**Two templates:**

### 9.1 Project Management — featured (`services-project-management.html`)

The hero service. Most prominent. Use case study IICY here as social proof.

**Sections:**
1. **Hero** — H1 "Project Management" with green accent. Subtitle: "The full execution layer for your career." Compact, no canvas.
2. **What it is** — 2-3 paragraphs on what artist project management means at ICONENT (not what every label calls it)
3. **3-step method (detailed)** — Foundation / Sound & Brand / Launch — but each step is a deeper block with sub-deliverables (Artist Analysis, Brand Development, etc. listed from method brief)
4. **What you get** — bullet list of deliverables (release calendar, content strategy, distribution coordination, etc.)
5. **Case study IICY** — same component as homepage with the 4 metrics
6. **FAQ (3 items)** — service-specific
7. **CTA** — Book a Review Call

### 9.2 Platform services (`services-spotify.html`, `services-youtube.html`, `services-instagram.html`, `services-tiktok.html`)

Shared template, only variables change. Each uses its platform brand color as accent throughout (replacing `--ic-green` selectively).

**Template sections:**
1. **Hero** — H1 = "Spotify Promotion" (or YouTube/Instagram/TikTok). Accent color glow background. Compact.
2. **What we do on {platform}** — 1 paragraph, real text from homepage and existing brief
3. **Deliverables list** — bulleted, platform-specific (editorial pitching, ads, content drops, etc.)
4. **Proof** — 1-2 cards from the proof strip that match the platform:
   - Spotify page: `spotify-listeners.png` (+104% listeners) + `spotify-editorials.png` (20+ editorials) + `spotify-saves-adds.png`
   - YouTube page: use Instagram screenshots as placeholders (note in spec: real YT screenshots TBD — flag for user)
   - Instagram page: `ig-1-4m.jpg` (1.4M views) + `ig-51m.jpg` (51M views, 90 days no ads)
   - TikTok page: same Instagram screenshots as placeholders (flag TBD)
5. **Method (compact)** — single sentence per step, links to project-management page for detail
6. **CTA** — Book a Review Call

**Platform accent variables (per page):**

```css
/* services-spotify.html includes <link rel="stylesheet" href="assets/css/pages/service-platform.css"> */
/* page-level override */
body[data-platform="spotify"] { --plat-accent: var(--plat-spotify); }
body[data-platform="youtube"] { --plat-accent: var(--plat-youtube); }
body[data-platform="instagram"] { --plat-accent: var(--plat-instagram); }
body[data-platform="tiktok"] {
  --plat-accent: #FFFFFF;
  /* glow uses tiktok-pink + tiktok-cyan */
}
```

`service-platform.css` replaces `--ic-green` with `--plat-accent` in selective places (h2 accent, hero glow, btn-primary if appropriate, section labels). The page sets `<body data-platform="spotify">` etc.

## 10. Contact page (`contact-us.html`)

**Sections:**
1. **Hero (very compact)** — H1 "Let's talk" or "Get in touch"
2. **Calendly inline embed** — primary CTA, full Calendly widget inline (not modal — already on the dedicated page, no need to gate it)
3. **Alternative: email** — `info@iconent-group.com` (confirmed)
4. **Address block** — 99 Wall Street, New York, NY 10005 + city list
5. **Social** — Instagram + Facebook links (reuse footer icons inline)

**No form in v1.** Confirmed: only Calendly + email in v1. Form integration (Netlify Forms / Formspree) deferred to a future iteration.

## 11. Behavior modules

### 11.1 Mobile nav (`components.js` + `shared.js`)

- `<ic-header>` listens for click on `.ic-hdr-burger`
- Toggles `.is-open` on `<ic-header>` element
- `.is-open` triggers fullscreen overlay with services list + Contact + Book a Call
- `body { overflow: hidden }` while open
- Close on: burger click again, ESC, link click, route change

### 11.2 Dropdown CTA inline (`shared.js`)

- "Discover Services" buttons on home + service pages
- Click toggles `.open` on parent `.ic-btn-dropdown` AND on associated `.ic-services-inline` (pushed content reveal, max-height transition)
- When open: blur overlay activates (`.ic-blur-overlay.active`), CTA section gets `.has-open-dropdown` (z-index lift above overlay)
- Auto-close on: another dropdown opens, click outside, mouseleave from CTA block (with 200ms grace), ESC

### 11.3 FAQ accordion (`shared.js`)

- Click `.ic-faq-item` → toggle `.open`
- One open at a time? **No** — multiple can be open simultaneously (matches source behavior)
- `+` ↔ `−` via CSS pseudo-element swap on `.open`

### 11.4 Calendly modal (`calendly.js`)

- `window.icOpenCalendly()` → adds `.open` to `#ic-modal-overlay`, locks body scroll
- First open: lazy-loads `assets.calendly.com/assets/external/widget.js`, then initializes the inline widget
- Subsequent opens: reuse loaded widget
- `window.icCloseCalendly(event)` → removes `.open`, restores scroll. If called with event, checks `event.target === currentTarget` (overlay click) to allow background-click-to-close
- ESC key closes
- Focus trap inside modal while open
- Calendly URL: `https://calendly.com/d/cxy6-2pj-4zj/iconent-artist-discovery-call?hide_gdpr_banner=1&background_color=141414&text_color=f5f5f5&primary_color=00ff88`

## 12. SEO & meta

**Every page includes:**
- `<title>` (unique, format: "Page Name — ICONENT GROUP")
- `<meta name="description">` (unique, 140-160 chars)
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<meta name="theme-color" content="#0A0A0A">`
- OG: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`
- Twitter: `twitter:card=summary_large_image`
- Canonical URL
- Schema.org JSON-LD:
  - All pages: `Organization`
  - Service pages: `Service`
  - Home: `Organization` + `FAQPage`
  - Contact: `ContactPage`

**Top-level files:**
- `robots.txt` — allow all, sitemap pointer
- `sitemap.xml` — all 8 pages, lastmod = build date
- `llms.txt` — companion for AI crawlers per brief (organization summary, services, key links)

## 13. Responsive & a11y

**Breakpoints:**
- `@media (max-width: 900px)` — tablet/mobile
- `@media (max-width: 480px)` — small mobile

**iOS Safari fixes:**
- All interactive elements: `touch-action: manipulation; -webkit-tap-highlight-color: transparent;`
- Hover styles wrapped in `@media (hover: hover) { ... }` so they don't stick on touch
- `:active` styles defined separately for tactile feedback
- No `<a onclick>` without `href` (use `<button>` instead — done as part of porting)

**A11y baseline:**
- All images have `alt` (decorative ones get `alt=""`)
- All buttons have accessible labels
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap, ESC to close
- Hamburger: `aria-expanded` toggled
- FAQ: `aria-expanded` on question, `aria-controls` linking to answer
- Color contrast: text on bg passes WCAG AA (verified at design tokens stage)
- `prefers-reduced-motion`: canvas hero disabled, marquees paused, transitions shortened

## 14. Deploy

**Local preview:**
```bash
# Option A: open index.html directly (works because no fetch dependencies)
open index.html

# Option B: serve over HTTP (recommended)
npx serve .
# or
python3 -m http.server 8000
```

**Production:**
- **Netlify** (recommended for forms-ready future): drag-and-drop the folder, done
- **Vercel:** `vercel --prod` after `vercel link`
- **Cloudflare Pages:** connect Git repo, no build command, output dir = root

**Custom domain:** point `iconent-group.com` DNS to chosen host. SSL automatic on all three.

**Git:** initialize repo (`git init`) before first deploy so commit history exists. Repo is not currently initialized (verified at design time).

## 15. Out of scope (explicit YAGNI)

- Light mode toggle (dark mode forced per brief)
- Cookie banner / GDPR consent (out of scope this iteration; Calendly's own banner is hidden via URL param, EU compliance deferred)
- A11y audit beyond the baseline checklist above
- Image optimization pipeline (assets used at their existing dimensions)
- Internationalization
- Analytics integration (placeholder slots only)
- CMS
- Server-side anything
- A/B testing infrastructure
- Service worker / offline mode

## 16. Resolved questions

1. **Contact email address:** `info@iconent-group.com` (confirmed)
2. **Real contact form:** v1 is Calendly + email only (confirmed). Form integration deferred to a future iteration.
3. **YouTube proof screenshots:** user provided 3 unique Google Ads YouTube dashboards:
   - `youtube-overview-822k.png` — campaigns overview: 4.08M impressions, 822K TrueView views, 8.12K clicks, €0.89 CPC. Includes 5 campaign names (Miky Nex, Rey. Rouge, Dubrazil, jd no control, PEAKY BLINDERS TEAM) with cost / views / view rate.
   - `youtube-campaign-207k.png` — single campaign: 207K impressions, 19.8K TrueView views, 9.56% view rate, €0.01 avg CPV.
   - `youtube-campaign-58k.png` — single campaign: 58.6K impressions, 23K TrueView views, 39.16% view rate, €0.01 avg CPV.
4. **TikTok proof screenshots:** user will provide later. Placeholder `tiktok-1.png` with TODO comment in markup; service page renders with placeholder visual until file arrives.

---

## Acceptance criteria

- 8 HTML pages render correctly in latest Chrome, Safari, Firefox, mobile Safari
- Homepage visually matches the provided source (within rounding) — no Elementor wrappers, no CSP errors in console
- Canvas hero animation runs on production without CSP exceptions
- All 8 pages share header/footer via `<ic-header>` / `<ic-footer>` — editing the component file changes all pages
- All assets served locally from `/assets/img/`, no `wp-content` URLs in HTML
- Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100 on the homepage
- All forms of "ICONENT GROUP" are uppercase in body content (footer copyright is the only exception)
- No console errors, no broken links between pages
- Deploys to Netlify with a single drag-and-drop
