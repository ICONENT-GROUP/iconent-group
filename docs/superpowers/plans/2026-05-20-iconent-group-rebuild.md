# ICONENT-GROUP.COM Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild iconent-group.com as a clean, dependency-free static HTML/CSS/JS site (8 pages), ready for drag-and-drop deploy to Netlify / Vercel / Cloudflare Pages.

**Architecture:** Plain HTML5 + vanilla CSS (custom properties) + vanilla ES2020 JS. Web Components for shared `<ic-header>` / `<ic-footer>`. No build step, no package.json, no node_modules. Lazy-loaded Calendly widget only when the booking modal opens.

**Tech Stack:** HTML5, CSS3 (no preprocessor), vanilla JS (Custom Elements v1, Canvas 2D, IntersectionObserver). No framework, no bundler, no test runner.

**Testing approach:** This project has no test runner by design (spec section 3: "no dependencies, no package.json"). Verification is:
1. **Browser smoke tests** — open the file in Chrome / Safari / Firefox after each task, verify the visible behavior matches the step's expected output
2. **Console probes** — for JS behavior, paste a one-line probe into DevTools console (e.g. `customElements.get('ic-header')` should be `class IcHeader`)
3. **Lighthouse audit** — final acceptance check on the homepage (target: Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100)

This is appropriate for the project size (8 marketing pages, no business logic). Don't add Vitest/Jest etc. — it would violate the no-deps constraint.

**Reference spec:** `docs/superpowers/specs/2026-05-20-iconent-group-rebuild-design.md`

**Working directory:** `/Users/kenzo/Desktop/SITO ICONENT GROUP`

---

## File Structure (created by this plan)

```
.
├── index.html                            # T9
├── about-us.html                         # T12
├── services-project-management.html      # T13
├── services-spotify.html                 # T15
├── services-youtube.html                 # T15
├── services-instagram.html               # T15
├── services-tiktok.html                  # T15
├── contact-us.html                       # T16
├── llms.txt                              # T1
├── robots.txt                            # T1
├── sitemap.xml                           # T17
├── README.md                             # T19
├── .gitignore                            # T1
├── assets/
│   ├── css/
│   │   ├── tokens.css                    # T3
│   │   ├── base.css                      # T4
│   │   ├── components.css                # T5
│   │   └── pages/
│   │       ├── home.css                  # T10
│   │       ├── about.css                 # T12
│   │       ├── service-pm.css            # T13
│   │       ├── service-platform.css      # T14
│   │       └── contact.css               # T16
│   ├── js/
│   │   ├── components.js                 # T6
│   │   ├── shared.js                     # T7
│   │   ├── home.js                       # T11
│   │   └── calendly.js                   # T8
│   └── img/                              # T2 (all images)
└── docs/                                 # already exists with spec + plan
```

---

## Task 1: Project scaffolding

**Files:**
- Create: `.gitignore`, `robots.txt`, `llms.txt`
- Create folders: `assets/css/pages/`, `assets/js/`, `assets/img/`, `assets/icons/`

- [ ] **Step 1.1: Create folder structure**

Run from `/Users/kenzo/Desktop/SITO ICONENT GROUP`:

```bash
mkdir -p assets/css/pages assets/js assets/img assets/icons
```

Verify: `ls assets/` shows `css icons img js`.

- [ ] **Step 1.2: Initialize git repository**

```bash
git init
git config user.name "Kenzo"
git config user.email "zeby2014@gmail.com"
```

Expected: `Initialized empty Git repository in .../SITO ICONENT GROUP/.git/`

- [ ] **Step 1.3: Create `.gitignore`**

```
.DS_Store
Thumbs.db
*.swp
*.swo
node_modules/
.vscode/
.idea/
.netlify/
.vercel/
```

- [ ] **Step 1.4: Create `robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://iconent-group.com/sitemap.xml
```

- [ ] **Step 1.5: Create `llms.txt`**

```
# ICONENT GROUP

> US-based music industry company for urban artists. We manage the parts most artists get left figuring out on their own — positioning, planning, content, rollout, team coordination, and long-term growth.

## About

ICONENT GROUP (BuiltToSucceed Learning Hub LLC, DBA Iconent-Group) is a Wyoming, USA based music agency. Address: 99 Wall Street, New York, NY 10005. Distributed team across Nashville, Chicago, Los Angeles, and New York.

## Services

- Project Management — full execution layer for artist careers
- Artist Development
- Marketing
- Music Distribution (partners: Sony, Warner, Universal, Believe, Ingrooves, TuneCore, DistroKid)
- Release Strategy
- Catalog Management
- Music Business Consulting

## Method

Three-step framework: Foundation → Sound & Brand → Launch.

## Team

- Hayden — Head of Artist Management (Nashville, 6 years)
- Jack — Project Manager (4 years)
- Joe — Project Manager / A&R (3 years)

## Contact

- Email: info@iconent-group.com
- Booking: https://calendly.com/d/cxy6-2pj-4zj/iconent-artist-discovery-call
- Instagram: https://www.instagram.com/iconent_group/
- Facebook: https://www.facebook.com/ICONENTGROUP

## Pages

- / — Home
- /about-us — About
- /services-project-management — Featured service
- /services-spotify — Spotify promotion
- /services-youtube — YouTube promotion
- /services-instagram — Instagram promotion
- /services-tiktok — TikTok promotion
- /contact-us — Contact
```

- [ ] **Step 1.6: First commit**

```bash
git add .gitignore robots.txt llms.txt
git commit -m "chore: project scaffolding"
```

Expected: 1 commit on main / master with 3 files.

---

## Task 2: Download assets from iconent-group.com

**Files:**
- Create: 16 image files in `assets/img/`

- [ ] **Step 2.1: Download images via curl**

Run from project root:

```bash
cd assets/img

# Team
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/35.png" -o team-hayden.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/34.png" -o team-jack.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/33.png" -o team-joe.png

# Case study + proof
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/adv-2.png" -o iicy-portrait.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/adv-3.png" -o spotify-listeners.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/adv-4.png" -o spotify-editorials.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/43.png" -o spotify-saves-adds.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2025/11/IMG_7702.jpg" -o ig-1-4m.jpg
curl -fSL "https://iconent-group.com/wp-content/uploads/2025/11/IMG_7694.jpg" -o ig-51m.jpg

# Section images
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/1.jpg" -o stop-dropping.jpg
curl -fSL "https://iconent-group.com/wp-content/uploads/2026/05/4.jpg" -o banner-map.jpg

# Partners
curl -fSL "https://iconent-group.com/wp-content/uploads/2023/12/sony.png" -o partner-sony.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2023/12/25.png" -o partner-warner.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2023/12/24.png" -o partner-universal.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2023/12/BELIEVE-MUSIC.png" -o partner-believe.png
curl -fSL "https://iconent-group.com/wp-content/uploads/2023/12/28.png" -o partner-ingrooves.png

cd ../..
```

Verify: `ls assets/img/ | wc -l` returns `16`. Open one in Preview to confirm not corrupt.

- [ ] **Step 2.2: User saves YouTube screenshots**

USER ACTION REQUIRED — the 3 YouTube screenshots were shared inline in chat. Save them to `assets/img/` with these filenames:

- `youtube-overview-822k.png` — Google Ads campaigns overview (4.08M impressions, 822K TrueView views, 5 campaigns listed)
- `youtube-campaign-207k.png` — single campaign (207K impressions, 19.8K TrueView views, 9.56% view rate)
- `youtube-campaign-58k.png` — single campaign (58.6K impressions, 23K TrueView views, 39.16% view rate)

Verify: `ls assets/img/youtube-*.png` returns 3 files.

If TikTok screenshots are available, also save them as `tiktok-1.png`, `tiktok-2.png`. Otherwise skip — Task 15 will use a placeholder block with TODO.

- [ ] **Step 2.3: Commit**

```bash
git add assets/img/
git commit -m "feat: add image assets"
```

---

## Task 3: CSS tokens

**Files:**
- Create: `assets/css/tokens.css`

- [ ] **Step 3.1: Write `assets/css/tokens.css`**

```css
:root {
  /* Palette */
  --ic-bg: #0A0A0A;
  --ic-bg-soft: #141414;
  --ic-text: #F5F5F5;
  --ic-muted: #8A8A8A;
  --ic-rule: #2A2A2A;
  --ic-green: #00FF88;
  --ic-blue: #3D8BFF;
  --ic-grey: #6B7280;

  /* Platform brand colors */
  --plat-spotify: #1DB954;
  --plat-youtube: #FF3B30;
  --plat-instagram: #00B2FF;
  --plat-tiktok-pink: #FF0050;
  --plat-tiktok-cyan: #00E6FF;

  /* Spacing scale */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;
  --sp-7: 48px;
  --sp-8: 64px;
  --sp-9: 80px;
  --sp-10: 110px;

  /* Type */
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", system-ui, sans-serif;

  /* Z-index scale */
  --z-base: 1;
  --z-marquee: 5;
  --z-overlay-blur: 800;
  --z-cta-elevated: 900;
  --z-header: 1000;
  --z-modal: 9999;

  /* Defaults for a service page (overridden per page) */
  --plat-accent: var(--ic-green);
}
```

- [ ] **Step 3.2: Commit**

```bash
git add assets/css/tokens.css
git commit -m "feat(css): add design tokens"
```

---

## Task 4: CSS base (reset + typography + body)

**Files:**
- Create: `assets/css/base.css`

- [ ] **Step 4.1: Write `assets/css/base.css`**

```css
/* Reset */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font-sans);
  background: var(--ic-bg);
  color: var(--ic-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  padding-top: 64px; /* room for fixed header */
}
body.no-scroll { overflow: hidden; }

img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
ul, ol { list-style: none; padding: 0; margin: 0; }
h1, h2, h3, h4, h5, h6 { margin: 0; color: inherit; font-weight: 900; }
p { margin: 0; }

/* Body grid pattern overlay (from original homepage) */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

/* Main is the document content layer */
main { position: relative; z-index: 1; }

/* Section primitives shared across pages */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 110px 28px;
  position: relative;
  z-index: 2;
}
.section-label {
  font-size: 17px;
  color: var(--ic-green);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 22px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.section-label::before {
  content: '';
  width: 9px;
  height: 9px;
  background: var(--ic-green);
  border-radius: 50%;
  box-shadow: 0 0 16px var(--ic-green);
}
.section h2 {
  font-size: clamp(36px, 6vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  margin: 0 0 24px;
  text-transform: uppercase;
}
.section h2 .accent { color: var(--ic-green); }
.section .lead {
  font-size: clamp(17px, 1.6vw, 19px);
  line-height: 1.55;
  margin: 0 0 24px;
  max-width: 720px;
}
.text-highlight { color: var(--ic-green); font-weight: 600; }

/* Responsive */
@media (max-width: 900px) {
  .section { padding: 72px 20px; }
  .section h2 { font-size: clamp(32px, 8vw, 48px); }
  .section-label { font-size: 12px; margin-bottom: 14px; gap: 8px; }
  .section-label::before { width: 7px; height: 7px; }
}
@media (max-width: 480px) {
  .section { padding: 56px 16px; }
  .section h2 { font-size: clamp(28px, 9vw, 42px); }
}

/* Reduce motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4.2: Commit**

```bash
git add assets/css/base.css
git commit -m "feat(css): add base reset and typography"
```

---

## Task 5: CSS components (shared UI)

**Files:**
- Create: `assets/css/components.css`

- [ ] **Step 5.1: Write `assets/css/components.css`**

```css
/* ============ HEADER ============ */
.ic-hdr {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: rgba(10, 10, 10, 0.55);
  border-bottom: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease;
}
.ic-hdr.scrolled {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom-color: var(--ic-rule);
}
.ic-hdr-logo {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ic-text);
}
.ic-hdr-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.ic-hdr-nav a, .ic-hdr-nav button {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ic-text);
  transition: color 0.2s ease;
}
@media (hover: hover) {
  .ic-hdr-nav a:hover, .ic-hdr-nav button:hover { color: #BBBBBB; }
}
.ic-hdr-nav .is-active { color: var(--ic-green); }
.ic-hdr-services {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ic-hdr-services::after { content: '▾'; font-size: 10px; opacity: 0.6; }
.ic-hdr-services-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  min-width: 240px;
  background: var(--ic-bg-soft);
  border: 1px solid var(--ic-rule);
  border-radius: 6px;
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ic-hdr-services:hover .ic-hdr-services-menu,
.ic-hdr-services:focus-within .ic-hdr-services-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
.ic-hdr-services-menu a {
  display: block;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.ic-hdr-services-menu a.featured {
  background: rgba(0,255,136,0.06);
  color: var(--ic-green);
}
@media (hover: hover) {
  .ic-hdr-services-menu a:hover { background: rgba(255,255,255,0.05); }
}
.ic-hdr-cta {
  background: var(--ic-green);
  color: var(--ic-bg) !important;
  padding: 10px 18px;
  border-radius: 4px;
  text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ic-hdr-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 24px rgba(0,255,136,0.4);
}
.ic-hdr-burger {
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.ic-hdr-burger::before, .ic-hdr-burger::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--ic-text);
  transition: transform 0.2s ease;
}
.ic-hdr-burger::before { transform: translateY(-5px); }
.ic-hdr-burger::after  { transform: translateY(5px); }
.ic-hdr.is-open .ic-hdr-burger::before { transform: rotate(45deg); }
.ic-hdr.is-open .ic-hdr-burger::after  { transform: rotate(-45deg); }

.ic-hdr-mobile {
  display: none;
  position: fixed;
  top: 64px;
  left: 0; right: 0; bottom: 0;
  background: var(--ic-bg);
  padding: 32px 24px;
  overflow-y: auto;
  flex-direction: column;
  gap: 8px;
}
.ic-hdr.is-open .ic-hdr-mobile { display: flex; }
.ic-hdr-mobile-label {
  font-size: 10px;
  color: var(--ic-muted);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 16px 0 4px;
}
.ic-hdr-mobile a {
  position: relative;
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--ic-rule);
  border-radius: 6px;
  background: var(--ic-bg-soft);
}
.ic-hdr-mobile a::before {
  content: '';
  position: absolute;
  left: -1px; top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  border-radius: 0 2px 2px 0;
  background: var(--ic-green);
}
.ic-hdr-mobile a[href*="spotify"]::before    { background: var(--plat-spotify); }
.ic-hdr-mobile a[href*="youtube"]::before    { background: var(--plat-youtube); }
.ic-hdr-mobile a[href*="instagram"]::before  { background: var(--plat-instagram); }
.ic-hdr-mobile a[href*="tiktok"]::before     { background: var(--plat-tiktok-pink); }
.ic-hdr-mobile .ic-hdr-cta {
  text-align: center;
  border-color: transparent;
}

@media (max-width: 900px) {
  .ic-hdr-nav { display: none; }
  .ic-hdr-burger { display: inline-flex; }
}

/* ============ FOOTER ============ */
.ic-ftr {
  position: relative;
  z-index: 2;
  background: var(--ic-bg);
  border-top: 1px solid var(--ic-rule);
  padding: 48px 24px 32px;
  text-align: center;
}
.ic-ftr-inner { max-width: 600px; margin: 0 auto; }
.ic-ftr-social {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-bottom: 24px;
}
.ic-ftr-social a {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.55;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.ic-ftr-social a:hover { opacity: 1; transform: translateY(-2px); }
.ic-ftr-social svg { width: 22px; height: 22px; fill: currentColor; color: var(--ic-text); }
.ic-ftr-brand {
  font-size: 13px;
  text-transform: uppercase;
  color: var(--ic-muted);
  letter-spacing: 0.16em;
  margin-bottom: 8px;
  font-weight: 700;
}
.ic-ftr-desc, .ic-ftr-addr {
  font-size: 11px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
  line-height: 1.6;
  margin: 0 0 6px;
}
.ic-ftr-copy {
  font-size: 10px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
  margin: 16px 0 0;
}

/* ============ BUTTONS ============ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  border: 1px solid transparent;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.btn-primary {
  background: var(--ic-green);
  color: var(--ic-bg);
  box-shadow: 0 0 0 1px rgba(0,255,136,0.3), 0 0 40px -10px rgba(0,255,136,0.5);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px rgba(0,255,136,0.5), 0 0 60px -10px rgba(0,255,136,0.7);
}
.btn-secondary {
  background: rgba(255,255,255,0.04);
  color: var(--ic-text);
  border-color: var(--ic-rule);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 0 30px -10px rgba(255,255,255,0.25);
}
.btn-secondary:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.08);
}
.btn-secondary::after {
  content: '▾';
  font-size: 18px;
  margin-left: 2px;
  line-height: 1;
  transition: transform 0.2s ease;
}
.btn-dropdown { position: relative; display: inline-block; }
.btn-dropdown.open .btn-secondary::after { transform: rotate(180deg); }

/* ============ HERO (homepage) ============ */
.hero {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ic-bg);
  margin-top: -64px; /* eat the body padding-top so hero is true full-height */
}
.hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.7) 100%);
  z-index: 2;
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 24px;
  width: 100%;
  max-width: 1400px;
}
.hero h1 {
  font-size: clamp(40px, 11vw, 180px);
  line-height: 1;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin: 0 0 24px;
  text-shadow:
    0 0 40px rgba(0,0,0,0.55),
    0 4px 16px rgba(0,0,0,0.5),
    0 0 80px rgba(100,220,255,0.18);
  white-space: nowrap;
}
.hero-tagline {
  font-size: clamp(12px, 1.4vw, 16px);
  color: #B8B8B8;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 0 0 20px rgba(0,0,0,0.8);
}
.hero-tagline .pipe {
  margin: 0 10px;
  color: var(--ic-green);
  opacity: 0.8;
}
.hero-scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--ic-muted);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 600;
  z-index: 3;
  animation: ic-scroll-pulse 2s ease-in-out infinite;
}
.hero-scroll-hint::after {
  content: '';
  display: block;
  width: 1px;
  height: 32px;
  background: var(--ic-muted);
  margin: 12px auto 0;
  opacity: 0.4;
}
@keyframes ic-scroll-pulse {
  0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
  50% { opacity: 1; transform: translateX(-50%) translateY(4px); }
}

/* Compact hero variant (about + service pages) */
.hero-compact {
  position: relative;
  padding: 160px 24px 96px;
  text-align: center;
  overflow: hidden;
}
.hero-compact h1 {
  font-size: clamp(40px, 8vw, 96px);
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin: 0 0 20px;
}
.hero-compact .hero-sub {
  font-size: clamp(14px, 1.6vw, 18px);
  color: var(--ic-muted);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
}
.hero-compact::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 60%);
  z-index: -1;
  pointer-events: none;
}

/* ============ MARQUEE (cities/services strip) ============ */
.marquee {
  overflow: hidden;
  border-top: 1px solid var(--ic-rule);
  border-bottom: 1px solid var(--ic-rule);
  padding: 18px 0;
  background: var(--ic-bg);
  white-space: nowrap;
  position: relative;
  z-index: var(--z-marquee);
}
.marquee-track {
  display: inline-block;
  animation: ic-marquee-slide 50s linear infinite;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ic-muted);
}
.marquee-track span { margin: 0 22px; }
.marquee-track .diamond {
  color: var(--ic-grey);
  margin: 0 14px;
  opacity: 0.6;
}
@keyframes ic-marquee-slide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (max-width: 900px) {
  .marquee-track { font-size: 11px; letter-spacing: 0.16em; }
  .marquee-track span { margin: 0 14px; }
  .marquee-track .diamond { margin: 0 8px; }
}

/* ============ COMPARE CARDS ============ */
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 48px 0 0;
}
.compare-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
  border: 1px solid var(--ic-rule);
  padding: 36px;
  border-radius: 6px;
  position: relative;
}
.compare-card.good {
  border-color: rgba(0,255,136,0.3);
  box-shadow: 0 0 0 1px rgba(0,255,136,0.1), 0 0 60px -20px rgba(0,255,136,0.25);
}
.compare-label {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 16px;
}
.compare-card.bad .compare-label { color: var(--ic-grey); }
.compare-card.good .compare-label { color: var(--ic-green); }
.compare-card h3 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}
.compare-list li {
  padding: 14px 0 14px 24px;
  border-bottom: 1px solid var(--ic-rule);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
}
.compare-list li:last-child { border-bottom: none; }
.compare-card.bad .compare-list li::before {
  content: '✕';
  position: absolute;
  left: 0;
  color: var(--ic-grey);
  font-weight: 700;
}
.compare-card.good .compare-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--ic-green);
  font-weight: 700;
}
@media (max-width: 900px) {
  .compare { grid-template-columns: 1fr; }
  .compare-card { padding: 24px; }
  .compare-card h3 { font-size: 22px; }
}

/* ============ METHOD STEPS ============ */
.method-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 56px 0 0;
}
.method-step {
  border-top: 1px solid var(--ic-rule);
  padding-top: 28px;
  position: relative;
}
.method-step::before {
  content: '';
  position: absolute;
  top: -1px; left: 0;
  width: 32px;
  height: 1px;
  background: var(--ic-green);
}
.method-step-num {
  font-size: 11px;
  color: var(--ic-green);
  letter-spacing: 0.22em;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 14px;
}
.method-step h3 {
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  text-transform: uppercase;
}
.method-step p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ic-muted);
}
@media (max-width: 900px) {
  .method-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .method-step h3 { font-size: 26px; }
}

/* ============ CTA BLOCK ============ */
.cta-block {
  text-align: center;
  padding: 100px 28px;
  background: var(--ic-bg);
  border-top: 1px solid var(--ic-rule);
  border-bottom: 1px solid var(--ic-rule);
  position: relative;
  z-index: 2;
  overflow: hidden;
}
.cta-block::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.cta-block > * { position: relative; z-index: 1; }
.cta-block h2 {
  font-size: clamp(32px, 5vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0 0 16px;
  text-transform: uppercase;
}
.cta-block h2 .accent { color: var(--ic-green); }
.cta-block > p {
  color: var(--ic-muted);
  margin: 0 auto 64px;
  max-width: 600px;
  font-size: 15px;
  line-height: 1.55;
}
.cta-row {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}
.cta-block.has-open-dropdown { z-index: var(--z-cta-elevated); }
.cta-block.has-open-dropdown .cta-row,
.cta-block.has-open-dropdown .services-inline { position: relative; z-index: calc(var(--z-cta-elevated) + 1); }

/* Inline services reveal */
.services-inline {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s ease, opacity 0.25s ease, margin-top 0.35s ease;
  width: 100%;
  margin-top: 0;
}
.services-inline.open {
  max-height: 600px;
  opacity: 1;
  margin-top: 24px;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
}
.service-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 10px;
  background: var(--ic-bg-soft);
  border: 1px solid var(--ic-rule);
  border-radius: 6px;
  color: var(--ic-text);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.3;
  transition: all 0.2s ease;
}
.service-card:hover {
  border-color: rgba(0,255,136,0.4);
  color: var(--ic-green);
  transform: translateY(-2px);
}
.service-card.featured {
  background: rgba(0,255,136,0.06);
  border-color: rgba(0,255,136,0.3);
  color: var(--ic-green);
  grid-column: 1 / -1;
  padding: 22px;
  font-size: 13px;
}
.service-card[href*="spotify"]:hover {
  color: var(--plat-spotify) !important;
  border-color: rgba(29,185,84,0.5);
  text-shadow: 0 0 14px rgba(29,185,84,0.6);
  background: rgba(29,185,84,0.05);
}
.service-card[href*="youtube"]:hover {
  color: var(--plat-youtube) !important;
  border-color: rgba(255,59,48,0.5);
  text-shadow: 0 0 14px rgba(255,59,48,0.6);
  background: rgba(255,59,48,0.05);
}
.service-card[href*="instagram"]:hover {
  color: var(--plat-instagram) !important;
  border-color: rgba(0,178,255,0.5);
  text-shadow: 0 0 14px rgba(0,178,255,0.6);
  background: rgba(0,178,255,0.05);
}
.service-card[href*="tiktok"]:hover {
  color: #FFFFFF !important;
  border-color: rgba(255,255,255,0.6);
  text-shadow:
    0 0 14px rgba(255,255,255,0.7),
    0 0 4px rgba(255,0,80,0.5),
    0 0 4px rgba(0,230,255,0.5);
  background: rgba(255,255,255,0.06);
}
@media (max-width: 900px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .service-card.featured { grid-column: 1 / -1; }
  .cta-row { flex-direction: column; align-items: stretch; }
  .btn { justify-content: center; }
  .cta-block { padding: 64px 20px; }
  .cta-block > p {
    margin-top: 0;
    margin-bottom: 80px;
    line-height: 1.7;
  }
}
@media (max-width: 480px) {
  .services-grid { grid-template-columns: 1fr; gap: 10px; }
  .service-card { padding: 16px 10px; font-size: 11px; }
}

/* ============ BLUR OVERLAY ============ */
.blur-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: var(--z-overlay-blur);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.blur-overlay.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* ============ PARTNERS MARQUEE ============ */
.partners {
  padding: 72px 0;
  background: var(--ic-bg);
  overflow: hidden;
  position: relative;
  z-index: 2;
}
.partners-label {
  text-align: center;
  font-size: 11px;
  color: var(--ic-muted);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 32px;
}
.partners-track {
  display: flex;
  align-items: center;
  animation: ic-marquee-slide 35s linear infinite;
  width: max-content;
}
.partners-track > * { margin: 0 28px; flex-shrink: 0; }
.partner-logo {
  height: 140px;
  width: auto;
  max-width: 200px;
  opacity: 0.9;
  filter: brightness(0) invert(1);
  object-fit: contain;
  transition: opacity 0.2s ease;
}
.partner-logo--warner { height: 200px; max-width: 280px; }
.partner-logo--ingrooves { height: 161px; max-width: 230px; }
.partner-logo:hover { opacity: 1; }
.partner-text {
  font-size: 36px;
  font-weight: 800;
  color: var(--ic-text);
  letter-spacing: -0.01em;
  opacity: 0.9;
}
.partner-divider {
  color: var(--ic-grey);
  font-size: 22px;
  opacity: 0.5;
}
@media (max-width: 900px) {
  .partners { padding: 40px 0; }
  .partners-track > * { margin: 0 16px; }
  .partner-logo { height: 64px; max-width: 100px; }
  .partner-logo--warner { height: 100px; max-width: 140px; }
  .partner-logo--ingrooves { height: 74px; max-width: 115px; }
  .partner-text { font-size: 20px; }
  .partner-divider { font-size: 14px; }
}
@media (max-width: 480px) {
  .partner-logo { height: 50px; max-width: 80px; }
  .partner-logo--warner { height: 80px; max-width: 110px; }
  .partner-logo--ingrooves { height: 58px; max-width: 90px; }
  .partner-text { font-size: 18px; }
}

/* ============ FAQ ============ */
.faq { max-width: 800px; margin: 0 auto; }
.faq-item {
  border-bottom: 1px solid var(--ic-rule);
  padding: 24px 0;
  cursor: pointer;
}
.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.faq-q::after {
  content: '+';
  font-size: 24px;
  font-weight: 300;
  color: var(--ic-muted);
  transition: color 0.2s ease;
}
.faq-item.open .faq-q::after { content: '−'; color: var(--ic-green); }
.faq-a {
  font-size: 15px;
  line-height: 1.65;
  color: var(--ic-muted);
  margin: 16px 0 0;
  display: none;
}
.faq-item.open .faq-a { display: block; }
@media (max-width: 900px) {
  .faq-q { font-size: 16px; }
}
@media (max-width: 480px) {
  .faq-q { font-size: 15px; padding-right: 12px; }
}

/* ============ MODAL (Calendly) ============ */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: var(--z-modal);
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-overlay.open { display: flex; }
.modal {
  width: 100%;
  max-width: 1000px;
  height: 85vh;
  max-height: 750px;
  background: var(--ic-bg);
  border: 1px solid var(--ic-rule);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.modal-close {
  position: absolute;
  top: 12px; right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover { background: rgba(255,255,255,0.2); }
.calendly-inline-widget {
  width: 100%;
  height: 100%;
  min-width: 320px;
}
@media (max-width: 900px) {
  .modal { height: 90vh; max-height: none; }
}

/* ============ BANNER FULL-WIDTH IMAGE ============ */
.banner-image {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  max-height: 480px;
  overflow: hidden;
  background: var(--ic-bg);
  z-index: 2;
}
.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  object-position: center 70%;
}
.banner-image::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(to bottom, var(--ic-bg) 0%, var(--ic-bg) 4%, rgba(10,10,10,0.7) 12%, transparent 32%, transparent 68%, rgba(10,10,10,0.6) 88%, var(--ic-bg) 100%),
    linear-gradient(to right, var(--ic-bg) 0%, rgba(10,10,10,0.4) 6%, transparent 18%, transparent 82%, rgba(10,10,10,0.4) 94%, var(--ic-bg) 100%);
}
@media (max-width: 900px) {
  .banner-image { aspect-ratio: 4 / 3; }
}
```

- [ ] **Step 5.2: Commit**

```bash
git add assets/css/components.css
git commit -m "feat(css): add shared UI components"
```

---

## Task 6: Web components — header & footer

**Files:**
- Create: `assets/js/components.js`

- [ ] **Step 6.1: Write `assets/js/components.js`**

```js
(function () {
  const HEADER_HTML = `
    <header class="ic-hdr" role="banner">
      <a class="ic-hdr-logo" href="/">ICONENT</a>
      <nav class="ic-hdr-nav" aria-label="Primary">
        <div class="ic-hdr-services">
          <a href="/services-project-management.html" data-path="/services-project-management">Services</a>
          <div class="ic-hdr-services-menu" role="menu">
            <a class="featured" href="/services-project-management.html" data-path="/services-project-management" role="menuitem">▸ Project Management</a>
            <a href="/services-spotify.html"    data-path="/services-spotify"    role="menuitem">Spotify Promotion</a>
            <a href="/services-youtube.html"    data-path="/services-youtube"    role="menuitem">YouTube Promotion</a>
            <a href="/services-instagram.html"  data-path="/services-instagram"  role="menuitem">Instagram Promotion</a>
            <a href="/services-tiktok.html"     data-path="/services-tiktok"     role="menuitem">TikTok Promotion</a>
          </div>
        </div>
        <a href="/contact-us.html" data-path="/contact-us">Contact</a>
        <button class="ic-hdr-cta" data-action="open-calendly" type="button">Book a Call</button>
      </nav>
      <button class="ic-hdr-burger" type="button" aria-label="Open menu" aria-expanded="false"></button>
      <div class="ic-hdr-mobile" role="menu">
        <p class="ic-hdr-mobile-label">Services</p>
        <a href="/services-project-management.html" data-path="/services-project-management">Project Management</a>
        <a href="/services-spotify.html"    data-path="/services-spotify">Spotify</a>
        <a href="/services-youtube.html"    data-path="/services-youtube">YouTube</a>
        <a href="/services-instagram.html"  data-path="/services-instagram">Instagram</a>
        <a href="/services-tiktok.html"     data-path="/services-tiktok">TikTok</a>
        <p class="ic-hdr-mobile-label">Menu</p>
        <a href="/contact-us.html" data-path="/contact-us">Contact</a>
        <button class="ic-hdr-cta" data-action="open-calendly" type="button">Book a Call</button>
      </div>
    </header>`;

  const FOOTER_HTML = `
    <footer class="ic-ftr" role="contentinfo">
      <div class="ic-ftr-inner">
        <div class="ic-ftr-social">
          <a href="https://www.instagram.com/iconent_group/" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.3.4.6.2 1 .5 1.5 1s.7.9 1 1.5c.2.5.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.9 2.6 10.2 2.6 12s0 2.1.1 3.3c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4C9.4 19.4 9.8 19.4 12 19.4s2.6 0 3.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.5.1-3.3s0-2.1-.1-3.3c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.5-.1-3.8-.1zM12 7.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm5-2.1a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
          </a>
          <a href="https://www.facebook.com/ICONENTGROUP" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.2-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9z"/></svg>
          </a>
        </div>
        <p class="ic-ftr-brand">ICONENT GROUP</p>
        <p class="ic-ftr-desc">Digital Marketing and Promotional Services</p>
        <p class="ic-ftr-addr">99 Wall Street, New York, NY, United States, 10005</p>
        <p class="ic-ftr-copy">© 2026 Iconent-Group. All rights reserved.</p>
      </div>
    </footer>`;

  function pathMatches(linkPath, currentPath) {
    if (linkPath === '/' && currentPath === '/') return true;
    return currentPath.replace(/\.html$/, '') === linkPath;
  }

  function markActive(root) {
    const current = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
    root.querySelectorAll('[data-path]').forEach((a) => {
      if (pathMatches(a.dataset.path, current)) a.classList.add('is-active');
    });
  }

  class IcHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = HEADER_HTML;
      const hdr = this.querySelector('.ic-hdr');
      markActive(this);
      // Burger toggle
      const burger = this.querySelector('.ic-hdr-burger');
      burger.addEventListener('click', () => {
        const open = hdr.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('no-scroll', open);
      });
      // Close mobile on link click
      this.querySelectorAll('.ic-hdr-mobile a').forEach((a) => {
        a.addEventListener('click', () => {
          hdr.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
        });
      });
      // Scroll → .scrolled
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          hdr.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      // Book-a-Call buttons
      this.querySelectorAll('[data-action="open-calendly"]').forEach((b) => {
        b.addEventListener('click', () => window.icOpenCalendly && window.icOpenCalendly());
      });
      // ESC closes mobile
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hdr.classList.contains('is-open')) {
          hdr.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
        }
      });
    }
  }

  class IcFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = FOOTER_HTML;
    }
  }

  customElements.define('ic-header', IcHeader);
  customElements.define('ic-footer', IcFooter);
})();
```

- [ ] **Step 6.2: Smoke test (manual)**

Create a minimal probe file `_probe.html` in project root with just `<ic-header></ic-header><ic-footer></ic-footer>` and `<script src="/assets/js/components.js"></script>` plus links to `tokens.css`, `base.css`, `components.css`. Serve with `npx serve .` and open `http://localhost:3000/_probe.html`. Verify:
- Header appears at top
- Footer appears with social SVGs
- Resize to <900px: burger appears, click opens mobile menu
- Scroll > 60px: header gains background blur
- Click Book a Call: console error `icOpenCalendly is not defined` (expected — `calendly.js` not loaded yet)

Delete `_probe.html` after verification.

- [ ] **Step 6.3: Commit**

```bash
git add assets/js/components.js
git commit -m "feat(js): add ic-header and ic-footer web components"
```

---

## Task 7: Shared JS (mobile menu shared, dropdown CTA, FAQ accordion)

**Files:**
- Create: `assets/js/shared.js`

- [ ] **Step 7.1: Write `assets/js/shared.js`**

```js
(function () {
  /* Inline services dropdown reveal (Discover Services button on CTA blocks) */
  function setupCtaDropdowns() {
    const ctaBlocks = document.querySelectorAll('.cta-block');
    ctaBlocks.forEach((block) => {
      const dropdown = block.querySelector('.btn-dropdown');
      const trigger = block.querySelector('.btn-dropdown .btn-secondary');
      const services = block.querySelector('.services-inline');
      const overlay = document.querySelector('.blur-overlay');
      if (!trigger || !services) return;

      let closeTimer = null;

      const open = () => {
        clearTimeout(closeTimer);
        // Close any other open dropdowns first
        document.querySelectorAll('.cta-block.has-open-dropdown').forEach((b) => {
          if (b !== block) closeBlock(b);
        });
        dropdown.classList.add('open');
        services.classList.add('open');
        block.classList.add('has-open-dropdown');
        overlay && overlay.classList.add('active');
      };
      const closeBlock = (b) => {
        b.querySelector('.btn-dropdown')?.classList.remove('open');
        b.querySelector('.services-inline')?.classList.remove('open');
        b.classList.remove('has-open-dropdown');
      };
      const close = () => {
        closeBlock(block);
        // Hide overlay only if no other dropdown is open
        if (!document.querySelector('.cta-block.has-open-dropdown')) {
          overlay && overlay.classList.remove('active');
        }
      };

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (dropdown.classList.contains('open')) close(); else open();
      });

      // Auto-close on mouse leave (with grace)
      block.addEventListener('mouseleave', () => {
        if (!dropdown.classList.contains('open')) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(close, 200);
      });
      block.addEventListener('mouseenter', () => clearTimeout(closeTimer));

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
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.setAttribute('role', 'button');
      q.setAttribute('tabindex', '0');
      q.setAttribute('aria-expanded', 'false');
      const toggle = () => {
        const open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      };
      item.addEventListener('click', toggle);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupCtaDropdowns();
      setupFaq();
    });
  } else {
    setupCtaDropdowns();
    setupFaq();
  }
})();
```

- [ ] **Step 7.2: Commit**

```bash
git add assets/js/shared.js
git commit -m "feat(js): add CTA dropdown and FAQ accordion behaviors"
```

---

## Task 8: Calendly modal (lazy-loaded widget)

**Files:**
- Create: `assets/js/calendly.js`

- [ ] **Step 8.1: Write `assets/js/calendly.js`**

```js
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

  window.icOpenCalendly = async function () {
    const modal = getModal();
    lastFocused = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    try {
      await loadScript();
      // Calendly's widget.js auto-initializes elements with .calendly-inline-widget[data-url]
      // Trigger initialization if widget exists (idempotent)
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
```

- [ ] **Step 8.2: Smoke test**

Create `_probe2.html` with `<ic-header>`, `<ic-footer>`, plus links to all CSS files + `components.js`, `shared.js`, `calendly.js`. Serve at `localhost:3000/_probe2.html`. Click "Book a Call" in the header. Verify:
- Modal overlay appears with dark background
- Calendly widget loads after ~500ms
- ESC closes
- Click outside the modal frame closes
- Body scroll is locked while open

Delete `_probe2.html`.

- [ ] **Step 8.3: Commit**

```bash
git add assets/js/calendly.js
git commit -m "feat(js): add Calendly modal with lazy widget loading"
```

---

## Task 9: Homepage HTML

**Files:**
- Create: `index.html`

- [ ] **Step 9.1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0A0A0A" />
  <title>ICONENT GROUP — Music industry company for urban artists</title>
  <meta name="description" content="ICONENT GROUP runs project management, artist development, marketing, distribution, and release strategy for urban artists. Nashville · Chicago · LA · NY." />
  <link rel="canonical" href="https://iconent-group.com/" />
  <meta property="og:title" content="ICONENT GROUP" />
  <meta property="og:description" content="Music industry company for urban artists. Project management, distribution, release strategy." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconent-group.com/" />
  <meta property="og:image" content="https://iconent-group.com/assets/img/banner-map.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  <link rel="stylesheet" href="/assets/css/pages/home.css" />
</head>
<body>
  <ic-header></ic-header>

  <div class="blur-overlay" id="ic-blur-overlay"></div>

  <main>
    <!-- HERO -->
    <section class="hero" id="hero">
      <canvas class="hero-canvas" id="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-vignette"></div>
      <div class="hero-content">
        <h1>ICONENT GROUP</h1>
        <p class="hero-tagline">
          Artist Development <span class="pipe">·</span>
          Music Distribution <span class="pipe">·</span>
          Release Strategy
        </p>
      </div>
      <div class="hero-scroll-hint">Scroll</div>
    </section>

    <!-- MARQUEE -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>Artist Project Management</span><span class="diamond">◆</span>
        <span>A&amp;R Direction</span><span class="diamond">◆</span>
        <span>Music Distribution</span><span class="diamond">◆</span>
        <span>Release Strategy</span><span class="diamond">◆</span>
        <span>Urban Artists</span><span class="diamond">◆</span>
        <span>Nashville · Los Angeles · Chicago · New York</span><span class="diamond">◆</span>
        <span>Artist Project Management</span><span class="diamond">◆</span>
        <span>A&amp;R Direction</span><span class="diamond">◆</span>
        <span>Music Distribution</span><span class="diamond">◆</span>
        <span>Release Strategy</span><span class="diamond">◆</span>
        <span>Urban Artists</span><span class="diamond">◆</span>
        <span>Nashville · Los Angeles · Chicago · New York</span><span class="diamond">◆</span>
      </div>
    </div>

    <!-- WHO WE ARE -->
    <section class="section who">
      <div class="who-grid">
        <div class="who-text">
          <p class="section-label">What we do</p>
          <h2>Stop dropping<br /><span class="accent">Start building</span></h2>
          <p class="lead">ICONENT GROUP is a US-based music industry company for urban artists. We manage the parts most artists get left figuring out on their own — positioning, planning, content, rollout, team coordination, and long-term growth. We diagnose where the career is actually stuck, then build a structured plan to unstick&nbsp;it.</p>
          <p class="lead">We operate across <span class="text-highlight">project management, artist development, marketing, music distribution, release strategy, catalog management, and music business consulting</span>. Distributed team across Nashville, Chicago, Los Angeles, and New York — with expansion underway in publishing, sync licensing, and music technology.</p>
        </div>
        <div class="who-image">
          <img src="/assets/img/stop-dropping.jpg" alt="ICONENT Group at work" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- COMPARISON -->
    <section class="section">
      <p class="section-label">The Problem</p>
      <h2>Two ways to build<br />a career</h2>
      <div class="compare">
        <div class="compare-card bad">
          <p class="compare-label">The DIY Way</p>
          <h3>Posting and Praying</h3>
          <ul class="compare-list">
            <li>Release singles without rollout strategy</li>
            <li>Boost posts on Instagram with no funnel</li>
            <li>Chase features that don't convert</li>
            <li>Post every day, get nowhere</li>
            <li>No audience data, no real fans</li>
            <li>Flat streams, forgotten between releases</li>
          </ul>
        </div>
        <div class="compare-card good">
          <p class="compare-label">The ICONENT Way</p>
          <h3>Project Management</h3>
          <ul class="compare-list">
            <li>Structured release calendar built around your sound</li>
            <li>Ads with real funnel, real targeting, real data</li>
            <li>Feature strategy based on fan conversion, not reach</li>
            <li>Content that moves people from view to listen</li>
            <li>Audience built from real fans, not impressions</li>
            <li>Compounding growth release after release</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- METHOD -->
    <section class="section">
      <p class="section-label">The Method</p>
      <h2>How we work</h2>
      <p class="lead">Every project runs through the same three-step framework. The structure is consistent. The work inside each step is custom to the artist.</p>
      <div class="method-grid">
        <div class="method-step">
          <p class="method-step-num">Step 01</p>
          <h3>Foundation</h3>
          <p>We get clear on who you are, what you stand for, and how the project should be positioned. Artist Analysis, Brand Development, Communication Strategy.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 02</p>
          <h3>Sound &amp; Brand</h3>
          <p>We shape the sound, the creative direction, and the content around it. Sound Identity, Track Development, Content Strategy.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 03</p>
          <h3>Launch</h3>
          <p>We give the music a real shot — rollout, positioning, and getting the release in front of the right people. Marketing, Distribution, Promotion.</p>
        </div>
      </div>
    </section>

    <!-- CTA #1 -->
    <section class="cta-block">
      <h2>Ready to build<br />something <span class="accent">real?</span></h2>
      <p>Book a free review call with our Project Manager. Or explore our services to see how we work on the execution side.</p>
      <div class="cta-row">
        <button class="btn btn-primary" type="button" data-action="open-calendly">Book a Review Call</button>
        <div class="btn-dropdown">
          <button class="btn btn-secondary" type="button">Discover Services</button>
        </div>
      </div>
      <div class="services-inline">
        <div class="services-grid">
          <a href="/services-project-management.html" class="service-card featured">▸ Project Management</a>
          <a href="/services-spotify.html" class="service-card">Spotify Promotion</a>
          <a href="/services-youtube.html" class="service-card">YouTube Promotion</a>
          <a href="/services-instagram.html" class="service-card">Instagram Promotion</a>
          <a href="/services-tiktok.html" class="service-card">TikTok Promotion</a>
        </div>
      </div>
    </section>

    <!-- CASE STUDY IICY -->
    <section class="section">
      <p class="section-label">Receipts</p>
      <h2>Real numbers<br /><span class="accent">Real artist</span></h2>
      <p class="lead">One recent project from start to major label deal — in six months.</p>
      <div class="case-iicy">
        <div class="case-iicy-photo">
          <img src="/assets/img/iicy-portrait.png" alt="IICY OTW" loading="lazy" />
        </div>
        <div class="case-iicy-content">
          <p class="case-iicy-label">Case Study</p>
          <h3 class="case-iicy-name">IICY OTW</h3>
          <p class="case-iicy-period">Bandlab Muzic · 6 Months</p>
          <div class="case-metrics">
            <div class="case-metric">
              <div class="case-metric-value" data-count="19730">0</div>
              <div class="case-metric-label">Listeners (+165%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value" data-count="153366">0</div>
              <div class="case-metric-label">Streams (+66%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value" data-count="6034">0</div>
              <div class="case-metric-label">Saves (+133%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value" data-count="7280">0</div>
              <div class="case-metric-label">Playlist Adds</div>
            </div>
          </div>
          <p class="case-outcome">After 6 months of structured work, the project signed a major label deal.</p>
        </div>
      </div>
    </section>

    <!-- PROOF STRIP -->
    <section class="proof">
      <div class="proof-inner">
        <div class="proof-header">
          <p class="section-label" style="justify-content: center;">Proof</p>
          <h3>Real <span class="accent">dashboards</span><br />from real projects</h3>
        </div>
        <div class="proof-grid">
          <div class="proof-card">
            <div class="proof-card-img"><img src="/assets/img/spotify-listeners.png" alt="Spotify listeners growth +104%" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">+104% LISTENERS</p>
              <p class="proof-card-label">Spotify catalog growth</p>
            </div>
          </div>
          <div class="proof-card">
            <div class="proof-card-img"><img src="/assets/img/ig-1-4m.jpg" alt="1.4M Instagram views" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">1.4M VIEWS</p>
              <p class="proof-card-label">Instagram organic reach</p>
            </div>
          </div>
          <div class="proof-card">
            <div class="proof-card-img"><img src="/assets/img/spotify-saves-adds.png" alt="Spotify saves and adds" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">SAVES &amp; ADDS</p>
              <p class="proof-card-label">Editorial playlist results</p>
            </div>
          </div>
          <div class="proof-card">
            <div class="proof-card-img"><img src="/assets/img/ig-51m.jpg" alt="51M Instagram views" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">51M VIEWS</p>
              <p class="proof-card-label">Last 90 days · no ads</p>
            </div>
          </div>
          <div class="proof-card">
            <div class="proof-card-img"><img src="/assets/img/spotify-editorials.png" alt="Spotify editorial placements" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">20+ EDITORIALS</p>
              <p class="proof-card-label">Spotify playlist placements</p>
            </div>
          </div>
          <div class="proof-card mobile-only">
            <div class="proof-card-img"><img src="/assets/img/ig-1-4m.jpg" alt="Instagram analytics" loading="lazy" /></div>
            <div class="proof-card-caption">
              <p class="proof-card-value">ENGAGEMENT</p>
              <p class="proof-card-label">Instagram audience activity</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="section">
      <p class="section-label">The Team</p>
      <h2>Who you'll<br />work with</h2>
      <div class="team-brief">
        <div class="team-card">
          <div class="team-photo"><img src="/assets/img/team-hayden.png" alt="Hayden" width="160" height="160" loading="lazy" /></div>
          <p class="team-name">Hayden</p>
          <p class="team-role">Head of Artist Management</p>
          <p class="team-bio">Six years inside the music industry across audio engineering, DJing, A&amp;R, and project management. Based in Nashville, TN.</p>
        </div>
        <div class="team-card">
          <div class="team-photo"><img src="/assets/img/team-jack.png" alt="Jack" width="160" height="160" loading="lazy" /></div>
          <p class="team-name">Jack</p>
          <p class="team-role">Project Manager</p>
          <p class="team-bio">Four years as an artist manager. Day-to-day responsibility for release rollouts, content schedules, and catalog work.</p>
        </div>
        <div class="team-card">
          <div class="team-photo"><img src="/assets/img/team-joe.png" alt="Joe" width="160" height="160" loading="lazy" /></div>
          <p class="team-name">Joe</p>
          <p class="team-role">Project Manager · A&amp;R</p>
          <p class="team-bio">Three years in artist management. Focus on content structure, release calendars, and production direction.</p>
        </div>
      </div>
    </section>

    <!-- PARTNERS MARQUEE -->
    <div class="partners">
      <p class="partners-label">Distribution Partners &amp; Connections</p>
      <div class="partners-track">
        <img src="/assets/img/partner-sony.png" class="partner-logo" alt="Sony Music" loading="lazy" />
        <span class="partner-divider">◆</span>
        <span class="partner-text">TuneCore</span>
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-warner.png" class="partner-logo partner-logo--warner" alt="Warner Music" loading="lazy" />
        <span class="partner-divider">◆</span>
        <span class="partner-text">DistroKid</span>
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-universal.png" class="partner-logo" alt="Universal Music" loading="lazy" />
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-believe.png" class="partner-logo" alt="Believe Music" loading="lazy" />
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-ingrooves.png" class="partner-logo partner-logo--ingrooves" alt="Ingrooves" loading="lazy" />
        <span class="partner-divider">◆</span>
        <!-- duplicate for seamless loop -->
        <img src="/assets/img/partner-sony.png" class="partner-logo" alt="" loading="lazy" />
        <span class="partner-divider">◆</span>
        <span class="partner-text">TuneCore</span>
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-warner.png" class="partner-logo partner-logo--warner" alt="" loading="lazy" />
        <span class="partner-divider">◆</span>
        <span class="partner-text">DistroKid</span>
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-universal.png" class="partner-logo" alt="" loading="lazy" />
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-believe.png" class="partner-logo" alt="" loading="lazy" />
        <span class="partner-divider">◆</span>
        <img src="/assets/img/partner-ingrooves.png" class="partner-logo partner-logo--ingrooves" alt="" loading="lazy" />
        <span class="partner-divider">◆</span>
      </div>
    </div>

    <!-- BANNER -->
    <div class="banner-image">
      <img src="/assets/img/banner-map.jpg" alt="ICONENT Group across the US" loading="lazy" />
    </div>

    <!-- FAQ -->
    <section class="section">
      <p class="section-label">Questions</p>
      <h2>Things <span class="accent">artists ask</span></h2>
      <div class="faq">
        <div class="faq-item">
          <p class="faq-q">What is ICONENT GROUP?</p>
          <p class="faq-a">ICONENT GROUP is a US-based music industry company for urban artists. We run structured programs covering project management, artist development, marketing, music distribution, release strategy, catalog management, and music business consulting. Distributed team across Nashville, Chicago, Los Angeles, and New York, with active expansion in publishing, sync licensing, and music technology.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">What kind of artists do you work with?</p>
          <p class="faq-a">We work with urban artists who already have music out and need professional A&amp;R and project management direction to grow. The program is built for artists with a catalog and real commitment to building a sustainable career.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">How does the program work?</p>
          <p class="faq-a">The first step is a free review call with our Project Manager. It's a diagnostic call — we look at your current numbers, releases, content, and structure, and identify the specific gaps. From there, if there's a fit, we build a custom plan.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Do you guarantee results?</p>
          <p class="faq-a">No. Real A&amp;R work doesn't come with guaranteed viral hits or stream counts. What we guarantee is structure, professional execution, and a real diagnosis of what's actually holding your project back.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">How do I start?</p>
          <p class="faq-a">Book a free review call. No commitment, no obligation — just a real conversation about where your project is and where it could go.</p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="cta-block">
      <h2>Stop posting<br />and <span class="accent">praying</span></h2>
      <p>Book a free review call with our Project Manager.<br />Real diagnosis, no obligations — just a serious conversation.</p>
      <div class="cta-row">
        <button class="btn btn-primary" type="button" data-action="open-calendly">Book a Review Call</button>
        <div class="btn-dropdown">
          <button class="btn btn-secondary" type="button">Discover Services</button>
        </div>
      </div>
      <div class="services-inline">
        <div class="services-grid">
          <a href="/services-project-management.html" class="service-card featured">▸ Project Management</a>
          <a href="/services-spotify.html" class="service-card">Spotify Promotion</a>
          <a href="/services-youtube.html" class="service-card">YouTube Promotion</a>
          <a href="/services-instagram.html" class="service-card">Instagram Promotion</a>
          <a href="/services-tiktok.html" class="service-card">TikTok Promotion</a>
        </div>
      </div>
    </section>
  </main>

  <ic-footer></ic-footer>

  <!-- JSON-LD: Organization + FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "ICONENT GROUP",
        "url": "https://iconent-group.com/",
        "logo": "https://iconent-group.com/assets/img/banner-map.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "99 Wall Street",
          "addressLocality": "New York",
          "addressRegion": "NY",
          "postalCode": "10005",
          "addressCountry": "US"
        },
        "sameAs": [
          "https://www.instagram.com/iconent_group/",
          "https://www.facebook.com/ICONENTGROUP"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What is ICONENT GROUP?", "acceptedAnswer": { "@type": "Answer", "text": "ICONENT GROUP is a US-based music industry company for urban artists." } },
          { "@type": "Question", "name": "What kind of artists do you work with?", "acceptedAnswer": { "@type": "Answer", "text": "We work with urban artists who already have music out and need professional A&R and project management direction to grow." } },
          { "@type": "Question", "name": "How does the program work?", "acceptedAnswer": { "@type": "Answer", "text": "The first step is a free review call with our Project Manager — a diagnostic call where we identify gaps." } },
          { "@type": "Question", "name": "Do you guarantee results?", "acceptedAnswer": { "@type": "Answer", "text": "No. We guarantee structure, professional execution, and a real diagnosis of what's actually holding your project back." } },
          { "@type": "Question", "name": "How do I start?", "acceptedAnswer": { "@type": "Answer", "text": "Book a free review call. No commitment, no obligation." } }
        ]
      }
    ]
  }
  </script>

  <script src="/assets/js/components.js" defer></script>
  <script src="/assets/js/shared.js" defer></script>
  <script src="/assets/js/calendly.js" defer></script>
  <script src="/assets/js/home.js" defer></script>
</body>
</html>
```

- [ ] **Step 9.2: Commit**

```bash
git add index.html
git commit -m "feat: add homepage HTML structure"
```

---

## Task 10: Homepage CSS (page-specific styles)

**Files:**
- Create: `assets/css/pages/home.css`

- [ ] **Step 10.1: Write `assets/css/pages/home.css`**

```css
/* Who We Are */
.who { border-top: 1px solid var(--ic-rule); max-width: 1200px; }
.who-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.who-text .section-label { margin-bottom: 16px; }
.who-text h2 { margin-bottom: 28px; }
.who-text .lead { margin-bottom: 22px; max-width: none; }
.who-text .lead:last-child { margin-bottom: 0; }
.who-image {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--ic-rule);
}
.who-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.6) 100%);
  pointer-events: none;
  z-index: 1;
}
.who-image::after {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.who-image img {
  width: 100%; height: 100%;
  object-fit: cover;
  position: relative; z-index: 0;
  object-position: 35% center;
}
@media (max-width: 900px) {
  .who-grid { grid-template-columns: 1fr; gap: 32px; }
  .who-image { aspect-ratio: 16 / 10; }
}

/* Case Study IICY */
.case-iicy {
  margin: 48px 0 0;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 56px;
  align-items: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
  border: 1px solid var(--ic-rule);
  padding: 48px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.case-iicy::before {
  content: '';
  position: absolute;
  top: -100px; left: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}
.case-iicy::after {
  content: '';
  position: absolute;
  bottom: -100px; right: -100px;
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(61,139,255,0.15) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}
.case-iicy-photo {
  position: relative;
  z-index: 1;
  width: 240px; height: 240px;
  margin: 0 auto;
}
.case-iicy-photo::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(0,255,136,0.35) 0%, transparent 50%);
  border-radius: 50%;
  z-index: -1;
}
.case-iicy-photo img {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0,255,136,0.3);
  box-shadow: 0 0 40px rgba(0,255,136,0.2);
}
.case-iicy-content { position: relative; z-index: 1; }
.case-iicy-label {
  font-size: 11px;
  color: var(--ic-green);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 8px;
}
.case-iicy-name {
  font-size: 48px;
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin: 0 0 8px;
}
.case-iicy-period {
  font-size: 13px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 32px;
}
.case-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.case-metric {
  border-top: 1px solid var(--ic-rule);
  padding-top: 14px;
}
.case-metric-value {
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  color: var(--ic-green);
  letter-spacing: -0.03em;
  margin: 0 0 6px;
  text-shadow: 0 0 24px rgba(0,255,136,0.3);
}
.case-metric-label {
  font-size: 11px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}
.case-outcome {
  margin: 32px 0 0;
  padding-top: 24px;
  border-top: 1px solid var(--ic-rule);
  font-size: 15px;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .case-iicy { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
  .case-iicy::before, .case-iicy::after { display: none; }
  .case-iicy-photo { width: 180px; height: 180px; }
  .case-iicy-name { font-size: 36px; }
  .case-metric-value { font-size: 26px; }
}
@media (max-width: 480px) {
  .case-metrics { grid-template-columns: 1fr; }
  .case-iicy-name { font-size: 30px; }
  .case-metric-value { font-size: 24px; }
}

/* Proof Strip */
.proof {
  padding: 80px 28px;
  position: relative;
  z-index: 2;
  background: var(--ic-bg);
  border-top: 1px solid var(--ic-rule);
  border-bottom: 1px solid var(--ic-rule);
}
.proof-inner { max-width: 1300px; margin: 0 auto; }
.proof-header { text-align: center; margin: 0 0 48px; }
.proof-header h3 {
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin: 0;
}
.proof-header h3 .accent { color: var(--ic-green); }
.proof-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.proof-card.mobile-only { display: none; }
.proof-card {
  background: var(--ic-bg-soft);
  border: 1px solid var(--ic-rule);
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.proof-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0,255,136,0.3);
}
.proof-card-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #000;
}
.proof-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.proof-card-caption {
  padding: 14px 16px;
  border-top: 1px solid var(--ic-rule);
}
.proof-card-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--ic-green);
  letter-spacing: -0.01em;
  margin: 0 0 4px;
  text-shadow: 0 0 16px rgba(0,255,136,0.2);
}
.proof-card-label {
  font-size: 10px;
  color: var(--ic-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}
@media (max-width: 900px) {
  .proof-grid { grid-template-columns: repeat(2, 1fr); }
  .proof-card.mobile-only { display: block; }
}
@media (max-width: 480px) {
  .proof-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}

/* Team Brief */
.team-brief {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin: 56px 0 0;
}
.team-card { text-align: center; position: relative; }
.team-photo {
  width: 160px; height: 160px;
  margin: 0 auto 20px;
  position: relative;
}
.team-photo::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(0,255,136,0.24) 0%, transparent 60%);
  border-radius: 50%;
  z-index: -1;
}
.team-photo img {
  width: 100%; height: 100%;
  object-fit: contain;
}
.team-name {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}
.team-role {
  font-size: 11px;
  color: var(--ic-green);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 14px;
}
.team-bio {
  font-size: 13px;
  color: var(--ic-muted);
  line-height: 1.55;
}
@media (max-width: 900px) {
  .team-brief { grid-template-columns: 1fr; }
}
```

- [ ] **Step 10.2: Commit**

```bash
git add assets/css/pages/home.css
git commit -m "feat(css): add homepage-specific styles"
```

---

## Task 11: Homepage JS (canvas + count-up)

**Files:**
- Create: `assets/js/home.js`

- [ ] **Step 11.1: Write `assets/js/home.js`**

```js
(function () {
  /* ============ HERO CANVAS ============
     Three composited layers:
     1. Matrix — falling green digits, columns
     2. Spectrogram — vertical blue dots forming wave bars at bottom third
     3. Particles — drifting mixed-color dots
  */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let w = 0, h = 0;
    const COLORS = {
      green: { r: 0,   g: 255, b: 136 },
      blue:  { r: 61,  g: 139, b: 255 },
      grey:  { r: 140, g: 140, b: 140 }
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      w = canvas.width;
      h = canvas.height;
      initLayers();
    }

    // Matrix
    const matrixFontSize = 14 * dpr;
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテト';
    let matrixCols = [];
    function initMatrix() {
      const columnCount = Math.floor(w / (matrixFontSize * 1.4));
      matrixCols = [];
      for (let i = 0; i < columnCount; i++) {
        matrixCols.push({
          y: Math.random() * h,
          speed: (1.4 + Math.random() * 2.5) * dpr,
          opacity: 0.15 + Math.random() * 0.35
        });
      }
    }

    // Spectrogram
    const specBarCount = 64;
    let specPhases = [];
    function initSpec() {
      specPhases = new Array(specBarCount).fill(0).map(() => Math.random() * Math.PI * 2);
    }

    // Particles
    let particles = [];
    function initParticles() {
      const count = window.innerWidth < 768 ? 40 : 80;
      particles = [];
      const palette = [COLORS.green, COLORS.blue, COLORS.grey];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3 * dpr,
          vy: (Math.random() - 0.5) * 0.3 * dpr,
          r: (0.6 + Math.random() * 1.6) * dpr,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.25 + Math.random() * 0.4
        });
      }
    }

    function initLayers() {
      initMatrix();
      initSpec();
      initParticles();
    }

    let mouseX = w / 2, mouseY = h / 2;
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (e.clientY - rect.top)  * dpr;
    });

    let frame = 0;
    function draw() {
      // soft fade
      ctx.fillStyle = 'rgba(10,10,10,0.18)';
      ctx.fillRect(0, 0, w, h);

      // Matrix layer
      ctx.font = `bold ${matrixFontSize}px ${getComputedStyle(document.body).fontFamily.split(',')[0] || 'monospace'}`;
      for (let i = 0; i < matrixCols.length; i++) {
        const col = matrixCols[i];
        const x = i * matrixFontSize * 1.4;
        const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillStyle = `rgba(0,255,136,${col.opacity})`;
        ctx.fillText(ch, x, col.y);
        col.y += col.speed;
        if (col.y > h + matrixFontSize) {
          col.y = -matrixFontSize;
          col.opacity = 0.15 + Math.random() * 0.35;
        }
      }

      // Spectrogram layer (vertical dot bars in bottom third)
      const specBaseY = h * 0.7;
      const specBarWidth = w / specBarCount;
      for (let i = 0; i < specBarCount; i++) {
        specPhases[i] += 0.04 + (i % 5) * 0.005;
        const amplitude = (Math.sin(specPhases[i]) * 0.5 + 0.5) * h * 0.22;
        const cx = i * specBarWidth + specBarWidth / 2;
        const dotCount = 18;
        for (let d = 0; d < dotCount; d++) {
          const dy = specBaseY - (d / dotCount) * amplitude;
          const a = 0.45 - (d / dotCount) * 0.35;
          if (a <= 0) continue;
          ctx.fillStyle = `rgba(61,139,255,${a})`;
          ctx.beginPath();
          ctx.arc(cx, dy, 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particles layer
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Subtle parallax toward mouse
        const dx = (mouseX - p.x) * 0.00015;
        const dy = (mouseY - p.y) * 0.00015;
        p.x += p.vx + dx;
        p.y += p.vy + dy;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      rafId = requestAnimationFrame(draw);
    }

    let rafId = null;
    resize();
    window.addEventListener('resize', resize);

    function start() {
      if (rafId == null) rafId = requestAnimationFrame(draw);
    }
    function stop() {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    if (prefersReduced) {
      // Draw one static frame and stop
      ctx.fillStyle = 'rgba(10,10,10,1)';
      ctx.fillRect(0, 0, w, h);
      draw(); // one tick
      stop();
    } else {
      start();
    }
  }

  /* ============ COUNT-UP METRICS ============ */
  function initCountUps() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) {
      // Fallback: set final values directly
      els.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        el.textContent = target.toLocaleString('en-US');
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

  function init() {
    initHeroCanvas();
    initCountUps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 11.2: Browser smoke test**

```bash
npx serve .
```

Open `http://localhost:3000/`. Verify:
- Hero canvas animates: falling green digits + blue wave dots at bottom + drifting particles
- Tagline displays with green pipes between items
- Scroll past hero: marquee scrolls horizontally
- Comparison cards render side-by-side desktop, stacked mobile
- Method 3-step blocks with green accent rules at top
- "Discover Services" button opens inline dropdown that pushes content down
- Scroll to Case Study IICY: 4 metrics count up from 0 to target
- 5 proof cards display in a row desktop, 2-col mobile + 6th card visible mobile only
- Partners marquee scrolls (Sony, TuneCore, Warner, etc.)
- Banner image full-width with vignette fade on all 4 edges
- FAQ items expand/collapse on click
- Final CTA section
- Header shows ICONENT logo + nav, "Book a Call" opens Calendly modal
- Resize to 480px: hero text wraps, sections stack, mobile-only proof card appears
- Console: zero errors

If anything is off, fix inline and re-test before committing.

- [ ] **Step 11.3: Commit**

```bash
git add assets/js/home.js
git commit -m "feat(js): add hero canvas animation and count-up metrics"
```

---

## Task 12: About page

**Files:**
- Create: `about-us.html`, `assets/css/pages/about.css`

- [ ] **Step 12.1: Write `assets/css/pages/about.css`**

```css
.about-mission {
  border-top: 1px solid var(--ic-rule);
  max-width: 1100px;
}
.about-mission h2 { margin-bottom: 24px; }
.about-mission .lead { margin-bottom: 20px; max-width: none; }

.about-team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin: 56px 0 0;
}
.about-team-card {
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
  border: 1px solid var(--ic-rule);
  border-radius: 8px;
  padding: 40px 28px;
  position: relative;
}
.about-team-photo {
  width: 180px; height: 180px;
  margin: 0 auto 24px;
  position: relative;
}
.about-team-photo::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(0,255,136,0.24) 0%, transparent 60%);
  border-radius: 50%;
  z-index: -1;
}
.about-team-photo img {
  width: 100%; height: 100%;
  object-fit: contain;
}
.about-team-name {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.about-team-role {
  font-size: 11px;
  color: var(--ic-green);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 16px;
}
.about-team-bio {
  font-size: 14px;
  color: var(--ic-muted);
  line-height: 1.6;
}

.where-cities {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 32px;
  margin: 32px 0;
}
.where-cities span {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ic-text);
}
.where-cities span::after {
  content: '◆';
  color: var(--ic-grey);
  margin-left: 32px;
  opacity: 0.5;
}
.where-cities span:last-child::after { content: none; }
.where-address {
  text-align: center;
  font-size: 14px;
  color: var(--ic-muted);
  letter-spacing: 0.04em;
  margin: 24px 0 0;
}

.expand-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 48px 0 0;
}
.expand-card {
  background: var(--ic-bg-soft);
  border: 1px solid var(--ic-rule);
  border-radius: 6px;
  padding: 28px;
}
.expand-card h4 {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
  color: var(--ic-text);
}
.expand-card p {
  font-size: 13px;
  color: var(--ic-muted);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .about-team-grid, .expand-grid { grid-template-columns: 1fr; }
  .where-cities span::after { display: none; }
  .where-cities { gap: 12px; }
}
```

- [ ] **Step 12.2: Write `about-us.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0A0A0A" />
  <title>About — ICONENT GROUP</title>
  <meta name="description" content="ICONENT GROUP is a US-based music industry company for urban artists. Distributed team across Nashville, Chicago, Los Angeles, and New York." />
  <link rel="canonical" href="https://iconent-group.com/about-us" />
  <meta property="og:title" content="About — ICONENT GROUP" />
  <meta property="og:description" content="A US-based music industry company for urban artists. Built to succeed." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconent-group.com/about-us" />
  <meta property="og:image" content="https://iconent-group.com/assets/img/banner-map.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  <link rel="stylesheet" href="/assets/css/pages/about.css" />
</head>
<body>
  <ic-header></ic-header>
  <div class="blur-overlay"></div>

  <main>
    <section class="hero-compact">
      <h1>Built to <span style="color: var(--ic-green);">succeed</span></h1>
      <p class="hero-sub">A US-based music industry company for urban artists. We manage what most artists are left figuring out alone.</p>
    </section>

    <section class="section about-mission">
      <p class="section-label">Mission</p>
      <h2>Stop dropping<br /><span class="accent">Start building</span></h2>
      <p class="lead">ICONENT GROUP is a US-based music industry company for urban artists. We manage the parts most artists get left figuring out on their own — positioning, planning, content, rollout, team coordination, and long-term growth. We diagnose where the career is actually stuck, then build a structured plan to unstick&nbsp;it.</p>
      <p class="lead">We operate across <span class="text-highlight">project management, artist development, marketing, music distribution, release strategy, catalog management, and music business consulting</span>. Distributed team across Nashville, Chicago, Los Angeles, and New York — with expansion underway in publishing, sync licensing, and music technology.</p>
    </section>

    <section class="section">
      <p class="section-label">The Method</p>
      <h2>How we work</h2>
      <p class="lead">Every project runs through the same three-step framework. The structure is consistent. The work inside each step is custom to the artist.</p>
      <div class="method-grid">
        <div class="method-step">
          <p class="method-step-num">Step 01</p>
          <h3>Foundation</h3>
          <p>We get clear on who you are, what you stand for, and how the project should be positioned. Artist Analysis, Brand Development, Communication Strategy.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 02</p>
          <h3>Sound &amp; Brand</h3>
          <p>We shape the sound, the creative direction, and the content around it. Sound Identity, Track Development, Content Strategy.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 03</p>
          <h3>Launch</h3>
          <p>We give the music a real shot — rollout, positioning, and getting the release in front of the right people. Marketing, Distribution, Promotion.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="section-label">The Team</p>
      <h2>Who you'll<br />work with</h2>
      <div class="about-team-grid">
        <div class="about-team-card">
          <div class="about-team-photo"><img src="/assets/img/team-hayden.png" alt="Hayden" loading="lazy" /></div>
          <p class="about-team-name">Hayden</p>
          <p class="about-team-role">Head of Artist Management</p>
          <p class="about-team-bio">Six years inside the music industry across audio engineering, DJing, A&amp;R, and project management. Based in Nashville, TN. Leads the artist development and creative direction side of every project.</p>
        </div>
        <div class="about-team-card">
          <div class="about-team-photo"><img src="/assets/img/team-jack.png" alt="Jack" loading="lazy" /></div>
          <p class="about-team-name">Jack</p>
          <p class="about-team-role">Project Manager</p>
          <p class="about-team-bio">Four years as an artist manager. Day-to-day responsibility for release rollouts, content schedules, and catalog work. Runs the execution layer end-to-end.</p>
        </div>
        <div class="about-team-card">
          <div class="about-team-photo"><img src="/assets/img/team-joe.png" alt="Joe" loading="lazy" /></div>
          <p class="about-team-name">Joe</p>
          <p class="about-team-role">Project Manager · A&amp;R</p>
          <p class="about-team-bio">Three years in artist management. Focus on content structure, release calendars, and production direction. Bridges A&amp;R judgment with marketing execution.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="section-label">Where we are</p>
      <h2>Distributed by design</h2>
      <p class="lead">A team built where the music is. We work across four cities to cover the urban scene from coast to coast.</p>
      <div class="where-cities">
        <span>Nashville</span>
        <span>Chicago</span>
        <span>Los Angeles</span>
        <span>New York</span>
      </div>
      <p class="where-address">99 Wall Street, New York, NY 10005</p>
    </section>

    <section class="section">
      <p class="section-label">What's next</p>
      <h2>Built to <span class="accent">expand</span></h2>
      <p class="lead">Three areas we're actively building into. Same standard, broader reach.</p>
      <div class="expand-grid">
        <div class="expand-card">
          <h4>Publishing</h4>
          <p>Royalty registration, sync placement, and rights management for the catalogs we already manage.</p>
        </div>
        <div class="expand-card">
          <h4>Sync Licensing</h4>
          <p>Placing our artists' music in film, TV, advertising, and game licensing pipelines.</p>
        </div>
        <div class="expand-card">
          <h4>Music Technology</h4>
          <p>Internal tooling and partnerships that make A&amp;R, distribution, and analytics work faster for the artists we work with.</p>
        </div>
      </div>
    </section>

    <section class="cta-block">
      <h2>Want to <span class="accent">work with us?</span></h2>
      <p>Book a free review call with our Project Manager. Real diagnosis, no obligations.</p>
      <div class="cta-row">
        <button class="btn btn-primary" type="button" data-action="open-calendly">Book a Review Call</button>
        <div class="btn-dropdown">
          <button class="btn btn-secondary" type="button">Discover Services</button>
        </div>
      </div>
      <div class="services-inline">
        <div class="services-grid">
          <a href="/services-project-management.html" class="service-card featured">▸ Project Management</a>
          <a href="/services-spotify.html" class="service-card">Spotify Promotion</a>
          <a href="/services-youtube.html" class="service-card">YouTube Promotion</a>
          <a href="/services-instagram.html" class="service-card">Instagram Promotion</a>
          <a href="/services-tiktok.html" class="service-card">TikTok Promotion</a>
        </div>
      </div>
    </section>
  </main>

  <ic-footer></ic-footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ICONENT GROUP",
    "url": "https://iconent-group.com/",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "99 Wall Street",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10005",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.instagram.com/iconent_group/",
      "https://www.facebook.com/ICONENTGROUP"
    ]
  }
  </script>

  <script src="/assets/js/components.js" defer></script>
  <script src="/assets/js/shared.js" defer></script>
  <script src="/assets/js/calendly.js" defer></script>
</body>
</html>
```

- [ ] **Step 12.3: Browser test**

Open `http://localhost:3000/about-us.html`. Verify hero, mission, method, team grid (3 cards), cities, expansion grid, CTA dropdown. Header should highlight nothing as active (about doesn't have a service in nav).

- [ ] **Step 12.4: Commit**

```bash
git add about-us.html assets/css/pages/about.css
git commit -m "feat: add about page"
```

---

## Task 13: Project Management service page (featured)

**Files:**
- Create: `services-project-management.html`, `assets/css/pages/service-pm.css`

- [ ] **Step 13.1: Write `assets/css/pages/service-pm.css`**

```css
.pm-what {
  border-top: 1px solid var(--ic-rule);
  max-width: 1100px;
}
.pm-method-detailed {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin: 56px 0 0;
}
.pm-method-card {
  background: linear-gradient(180deg, rgba(0,255,136,0.04), rgba(0,255,136,0.01));
  border: 1px solid rgba(0,255,136,0.2);
  border-radius: 8px;
  padding: 32px 28px;
}
.pm-method-card .method-step-num { font-size: 12px; }
.pm-method-card h3 {
  font-size: 28px;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  margin: 0 0 18px;
}
.pm-method-card .sublist {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--ic-rule);
}
.pm-method-card .sublist li {
  padding: 8px 0 8px 18px;
  font-size: 13px;
  position: relative;
  color: var(--ic-text);
}
.pm-method-card .sublist li::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: var(--ic-green);
  font-size: 9px;
  top: 14px;
}

.pm-deliverables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 32px;
  margin: 48px 0 0;
}
.pm-deliverables li {
  padding: 16px 0 16px 28px;
  border-bottom: 1px solid var(--ic-rule);
  position: relative;
  font-size: 14px;
  line-height: 1.5;
}
.pm-deliverables li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--ic-green);
  font-weight: 700;
}

@media (max-width: 900px) {
  .pm-method-detailed { grid-template-columns: 1fr; }
  .pm-deliverables { grid-template-columns: 1fr; }
}
```

- [ ] **Step 13.2: Write `services-project-management.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0A0A0A" />
  <title>Project Management — ICONENT GROUP</title>
  <meta name="description" content="The full execution layer for urban artist careers. Foundation, Sound & Brand, Launch — managed end-to-end by ICONENT GROUP." />
  <link rel="canonical" href="https://iconent-group.com/services-project-management" />
  <meta property="og:title" content="Project Management — ICONENT GROUP" />
  <meta property="og:description" content="The full execution layer for urban artist careers." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconent-group.com/services-project-management" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  <link rel="stylesheet" href="/assets/css/pages/home.css" />
  <link rel="stylesheet" href="/assets/css/pages/service-pm.css" />
</head>
<body>
  <ic-header></ic-header>
  <div class="blur-overlay"></div>

  <main>
    <section class="hero-compact">
      <h1>Project <span style="color: var(--ic-green);">management</span></h1>
      <p class="hero-sub">The full execution layer for your career. We run the parts that make releases actually land — calendar, content, distribution, rollout — and we run them together.</p>
    </section>

    <section class="section pm-what">
      <p class="section-label">What it is</p>
      <h2>Beyond a manager</h2>
      <p class="lead">Most artist managers handle a fraction of the work. Bookings here, a release there, a few DMs to a label. We do the opposite — every moving part of the project runs through one structured system, executed by one team.</p>
      <p class="lead">Project Management at ICONENT means owning the full execution stack: positioning, release calendar, content strategy, ads, distribution coordination, editorial pitching, partnership outreach, catalog growth. One artist, one system, one team responsible for output. That's the difference between hoping a release works and building a career that compounds.</p>
    </section>

    <section class="section">
      <p class="section-label">The Method</p>
      <h2>Three steps,<br /><span class="accent">one system</span></h2>
      <p class="lead">Every artist on Project Management runs through the same framework. The structure stays consistent. The work inside each step is custom.</p>
      <div class="pm-method-detailed">
        <div class="pm-method-card">
          <p class="method-step-num">Step 01</p>
          <h3>Foundation</h3>
          <p>We diagnose where the project is actually stuck and build the strategic plan around it.</p>
          <ul class="sublist">
            <li>Artist Analysis</li>
            <li>Brand Development</li>
            <li>Communication Strategy</li>
            <li>Positioning Audit</li>
          </ul>
        </div>
        <div class="pm-method-card">
          <p class="method-step-num">Step 02</p>
          <h3>Sound &amp; Brand</h3>
          <p>We shape the sound, the creative direction, and the content layer around it.</p>
          <ul class="sublist">
            <li>Sound Identity</li>
            <li>Track Development</li>
            <li>Content Strategy</li>
            <li>Creative Direction</li>
          </ul>
        </div>
        <div class="pm-method-card">
          <p class="method-step-num">Step 03</p>
          <h3>Launch</h3>
          <p>We give the music a real shot — rollout planning, distribution coordination, and promotion execution.</p>
          <ul class="sublist">
            <li>Release Strategy</li>
            <li>Distribution</li>
            <li>Marketing &amp; Ads</li>
            <li>Editorial Pitching</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="section-label">What you get</p>
      <h2>The deliverables</h2>
      <ul class="pm-deliverables">
        <li>Structured release calendar built around your sound and lifecycle</li>
        <li>Content schedule with platform-specific creative direction</li>
        <li>Distribution coordination with major-tier partners</li>
        <li>Targeted ad campaigns with real funnel data</li>
        <li>Editorial and playlist pitching for every drop</li>
        <li>Catalog management and rights tracking</li>
        <li>A&amp;R direction on track selection and sequencing</li>
        <li>Monthly reporting on listeners, streams, saves, and adds</li>
      </ul>
    </section>

    <section class="section">
      <p class="section-label">Receipts</p>
      <h2>Real numbers<br /><span class="accent">Real artist</span></h2>
      <p class="lead">One recent project from start to major label deal — in six months.</p>
      <div class="case-iicy">
        <div class="case-iicy-photo">
          <img src="/assets/img/iicy-portrait.png" alt="IICY OTW" loading="lazy" />
        </div>
        <div class="case-iicy-content">
          <p class="case-iicy-label">Case Study</p>
          <h3 class="case-iicy-name">IICY OTW</h3>
          <p class="case-iicy-period">Bandlab Muzic · 6 Months</p>
          <div class="case-metrics">
            <div class="case-metric">
              <div class="case-metric-value">19,730</div>
              <div class="case-metric-label">Listeners (+165%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value">153,366</div>
              <div class="case-metric-label">Streams (+66%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value">6,034</div>
              <div class="case-metric-label">Saves (+133%)</div>
            </div>
            <div class="case-metric">
              <div class="case-metric-value">7,280</div>
              <div class="case-metric-label">Playlist Adds</div>
            </div>
          </div>
          <p class="case-outcome">After 6 months of structured work, the project signed a major label deal.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="section-label">Questions</p>
      <h2>Common <span class="accent">asks</span></h2>
      <div class="faq">
        <div class="faq-item">
          <p class="faq-q">Who is this for?</p>
          <p class="faq-a">Urban artists with a real catalog who are committed to building a long-term career and need structured execution instead of ad-hoc effort.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">How long does a program last?</p>
          <p class="faq-a">Programs run in 6-month cycles minimum. That's the window where compounding starts to show — anything shorter is essentially a launch sprint, not management.</p>
        </div>
        <div class="faq-item">
          <p class="faq-q">Do you replace my existing team?</p>
          <p class="faq-a">No. We integrate. If you have an audio engineer, a producer, a videographer — they stay. We coordinate them inside the release plan.</p>
        </div>
      </div>
    </section>

    <section class="cta-block">
      <h2>Ready to <span class="accent">start?</span></h2>
      <p>Book a free review call with our Project Manager. We'll diagnose where your project actually stands.</p>
      <div class="cta-row">
        <button class="btn btn-primary" type="button" data-action="open-calendly">Book a Review Call</button>
        <div class="btn-dropdown">
          <button class="btn btn-secondary" type="button">Discover Services</button>
        </div>
      </div>
      <div class="services-inline">
        <div class="services-grid">
          <a href="/services-project-management.html" class="service-card featured">▸ Project Management</a>
          <a href="/services-spotify.html" class="service-card">Spotify Promotion</a>
          <a href="/services-youtube.html" class="service-card">YouTube Promotion</a>
          <a href="/services-instagram.html" class="service-card">Instagram Promotion</a>
          <a href="/services-tiktok.html" class="service-card">TikTok Promotion</a>
        </div>
      </div>
    </section>
  </main>

  <ic-footer></ic-footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Project Management",
    "provider": { "@type": "Organization", "name": "ICONENT GROUP" },
    "description": "Full execution layer for urban artist careers: foundation, sound & brand, launch.",
    "areaServed": "US"
  }
  </script>

  <script src="/assets/js/components.js" defer></script>
  <script src="/assets/js/shared.js" defer></script>
  <script src="/assets/js/calendly.js" defer></script>
</body>
</html>
```

- [ ] **Step 13.3: Commit**

```bash
git add services-project-management.html assets/css/pages/service-pm.css
git commit -m "feat: add project management service page"
```

---

## Task 14: Platform service CSS template

**Files:**
- Create: `assets/css/pages/service-platform.css`

- [ ] **Step 14.1: Write `assets/css/pages/service-platform.css`**

```css
/* Variables set per-page via body[data-platform] selector */
body[data-platform="spotify"]   { --plat-accent: var(--plat-spotify);  --plat-glow: 29,185,84; }
body[data-platform="youtube"]   { --plat-accent: var(--plat-youtube);  --plat-glow: 255,59,48; }
body[data-platform="instagram"] { --plat-accent: var(--plat-instagram);--plat-glow: 0,178,255; }
body[data-platform="tiktok"]    { --plat-accent: #FFFFFF;              --plat-glow: 255,255,255; }

/* TikTok needs dual-color glow */
body[data-platform="tiktok"] .hero-compact::before {
  background: radial-gradient(circle, rgba(255,0,80,0.10) 0%, transparent 50%),
              radial-gradient(circle, rgba(0,230,255,0.06) 0%, transparent 60%);
}
body[data-platform="tiktok"] .hero-compact h1 .accent {
  text-shadow:
    0 0 16px rgba(255,0,80,0.45),
    0 0 24px rgba(0,230,255,0.35);
}

/* Platform-tinted hero glow */
.hero-compact::before {
  background: radial-gradient(circle, rgba(var(--plat-glow), 0.10) 0%, transparent 60%);
}

/* Platform-tinted accents on this page only */
.platform-page .section-label { color: var(--plat-accent); }
.platform-page .section-label::before {
  background: var(--plat-accent);
  box-shadow: 0 0 16px var(--plat-accent);
}
.platform-page .section h2 .accent { color: var(--plat-accent); }
.platform-page .accent { color: var(--plat-accent); }

/* Compact method (1-liner per step) */
.platform-method-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0 0;
}
.platform-method-compact .method-step::before { background: var(--plat-accent); }
.platform-method-compact .method-step-num { color: var(--plat-accent); }

/* Deliverables list */
.platform-deliverables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 32px;
  margin: 40px 0 0;
}
.platform-deliverables li {
  padding: 14px 0 14px 24px;
  border-bottom: 1px solid var(--ic-rule);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
}
.platform-deliverables li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--plat-accent);
  font-weight: 700;
}

/* Proof grid (variable count: 1, 2, or 3 cards) */
.platform-proof {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin: 40px 0 0;
}
.platform-proof .proof-card-value { color: var(--plat-accent); }

/* TODO placeholder for missing screenshots */
.proof-todo {
  background: var(--ic-bg-soft);
  border: 1px dashed var(--ic-rule);
  border-radius: 6px;
  padding: 48px 24px;
  text-align: center;
  font-size: 12px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* CTA accent override (keep green primary, but section labels use platform color) */
@media (max-width: 900px) {
  .platform-method-compact, .platform-deliverables { grid-template-columns: 1fr; }
}
```

- [ ] **Step 14.2: Commit**

```bash
git add assets/css/pages/service-platform.css
git commit -m "feat(css): add platform service page template"
```

---

## Task 15: The 4 platform service pages

**Files:**
- Create: `services-spotify.html`, `services-youtube.html`, `services-instagram.html`, `services-tiktok.html`

- [ ] **Step 15.1: Write `services-spotify.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0A0A0A" />
  <title>Spotify Promotion — ICONENT GROUP</title>
  <meta name="description" content="Spotify promotion for urban artists. Editorial pitching, ad campaigns, catalog growth — managed end-to-end by ICONENT GROUP." />
  <link rel="canonical" href="https://iconent-group.com/services-spotify" />
  <meta property="og:title" content="Spotify Promotion — ICONENT GROUP" />
  <meta property="og:description" content="Editorial pitching, ad campaigns, catalog growth." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconent-group.com/services-spotify" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  <link rel="stylesheet" href="/assets/css/pages/home.css" />
  <link rel="stylesheet" href="/assets/css/pages/service-platform.css" />
</head>
<body data-platform="spotify" class="platform-page">
  <ic-header></ic-header>
  <div class="blur-overlay"></div>

  <main>
    <section class="hero-compact">
      <h1>Spotify <span class="accent">promotion</span></h1>
      <p class="hero-sub">Catalog growth, editorial pitching, and ad campaigns built around real listener data — not vanity reach.</p>
    </section>

    <section class="section">
      <p class="section-label">What we do</p>
      <h2>Built for <span class="accent">listeners</span></h2>
      <p class="lead">Spotify rewards retention, save rate, and playlist behavior — not raw plays. We run the campaigns that move those numbers. Editorial outreach to playlist curators, Meta and Spotify ad campaigns funneled through proper landing pages, catalog audits to find tracks that should be re-pitched, and growth strategies that compound release after release.</p>
    </section>

    <section class="section">
      <p class="section-label">Deliverables</p>
      <h2>What you get</h2>
      <ul class="platform-deliverables">
        <li>Editorial playlist pitching for every release</li>
        <li>Spotify and Meta ad campaigns with real funnel</li>
        <li>Catalog audit and re-pitching for older tracks</li>
        <li>Save-rate optimization across release sequence</li>
        <li>Monthly reporting on listeners, streams, saves, adds</li>
        <li>Coordination with distribution partners (Sony, Warner, Universal, Believe, Ingrooves)</li>
      </ul>
    </section>

    <section class="section">
      <p class="section-label">Proof</p>
      <h2>Real <span class="accent">results</span></h2>
      <div class="platform-proof">
        <div class="proof-card">
          <div class="proof-card-img"><img src="/assets/img/spotify-listeners.png" alt="Spotify listeners growth +104%" loading="lazy" /></div>
          <div class="proof-card-caption">
            <p class="proof-card-value">+104% LISTENERS</p>
            <p class="proof-card-label">Spotify catalog growth</p>
          </div>
        </div>
        <div class="proof-card">
          <div class="proof-card-img"><img src="/assets/img/spotify-editorials.png" alt="Spotify editorial placements" loading="lazy" /></div>
          <div class="proof-card-caption">
            <p class="proof-card-value">20+ EDITORIALS</p>
            <p class="proof-card-label">Spotify playlist placements</p>
          </div>
        </div>
        <div class="proof-card">
          <div class="proof-card-img"><img src="/assets/img/spotify-saves-adds.png" alt="Spotify saves and adds" loading="lazy" /></div>
          <div class="proof-card-caption">
            <p class="proof-card-value">SAVES &amp; ADDS</p>
            <p class="proof-card-label">Editorial playlist results</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="section-label">The Method</p>
      <h2>How it fits</h2>
      <p class="lead">Spotify Promotion runs inside the broader 3-step framework.</p>
      <div class="platform-method-compact">
        <div class="method-step">
          <p class="method-step-num">Step 01 — Foundation</p>
          <p>Catalog audit and positioning for editorial fit.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 02 — Sound &amp; Brand</p>
          <p>Release sequencing and creative direction tuned to platform behavior.</p>
        </div>
        <div class="method-step">
          <p class="method-step-num">Step 03 — Launch</p>
          <p>Editorial pitching, ads, and post-release retention work.</p>
        </div>
      </div>
      <p class="lead" style="margin-top: 24px;">Full system: <a href="/services-project-management.html" style="color: var(--plat-accent); text-decoration: underline;">Project Management</a>.</p>
    </section>

    <section class="cta-block">
      <h2>Ready to <span class="accent">grow?</span></h2>
      <p>Book a free review call. We'll audit your Spotify catalog on the spot.</p>
      <div class="cta-row">
        <button class="btn btn-primary" type="button" data-action="open-calendly">Book a Review Call</button>
        <div class="btn-dropdown">
          <button class="btn btn-secondary" type="button">Discover Services</button>
        </div>
      </div>
      <div class="services-inline">
        <div class="services-grid">
          <a href="/services-project-management.html" class="service-card featured">▸ Project Management</a>
          <a href="/services-spotify.html" class="service-card">Spotify Promotion</a>
          <a href="/services-youtube.html" class="service-card">YouTube Promotion</a>
          <a href="/services-instagram.html" class="service-card">Instagram Promotion</a>
          <a href="/services-tiktok.html" class="service-card">TikTok Promotion</a>
        </div>
      </div>
    </section>
  </main>

  <ic-footer></ic-footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Spotify Promotion",
    "provider": { "@type": "Organization", "name": "ICONENT GROUP" },
    "description": "Spotify catalog growth, editorial pitching, and targeted ad campaigns for urban artists."
  }
  </script>

  <script src="/assets/js/components.js" defer></script>
  <script src="/assets/js/shared.js" defer></script>
  <script src="/assets/js/calendly.js" defer></script>
</body>
</html>
```

- [ ] **Step 15.2: Write `services-youtube.html`**

Same template as Spotify with these replacements (and the YouTube screenshots from Task 2):
- `<title>YouTube Promotion — ICONENT GROUP</title>`
- description: "YouTube promotion for urban artists. TrueView campaigns, music video distribution, channel growth — managed end-to-end."
- canonical: `https://iconent-group.com/services-youtube`
- `<body data-platform="youtube" class="platform-page">`
- H1: `YouTube <span class="accent">promotion</span>`
- Hero sub: `Music video distribution, TrueView campaigns, and channel growth strategy — built on real campaign data, not impressions theater.`
- "What we do" lead: `YouTube is two products: a video platform and a music platform. We run both. TrueView campaigns optimized for view-through rate, music video distribution via Content ID partners, channel and topic-channel strategy, and Shorts integration for catalog discovery. Every campaign is measured against view rate, completion, and downstream Spotify save activity — not just impression counts.`
- Deliverables list:
  - Music video distribution to YouTube Content ID partners
  - TrueView campaigns optimized for view-through rate
  - Channel and topic-channel growth strategy
  - YouTube Shorts integration and catalog repackaging
  - Comment-section moderation and engagement coordination
  - Monthly reporting on views, view rate, CPV, and downstream platform impact
- Proof section uses the 3 YouTube screenshots:

```html
<section class="section">
  <p class="section-label">Proof</p>
  <h2>Real <span class="accent">campaigns</span></h2>
  <div class="platform-proof">
    <div class="proof-card">
      <div class="proof-card-img"><img src="/assets/img/youtube-overview-822k.png" alt="YouTube campaigns overview" loading="lazy" /></div>
      <div class="proof-card-caption">
        <p class="proof-card-value">822K VIEWS</p>
        <p class="proof-card-label">4.08M impressions across campaigns</p>
      </div>
    </div>
    <div class="proof-card">
      <div class="proof-card-img"><img src="/assets/img/youtube-campaign-58k.png" alt="YouTube campaign 39% view rate" loading="lazy" /></div>
      <div class="proof-card-caption">
        <p class="proof-card-value">39.16% VIEW RATE</p>
        <p class="proof-card-label">€0.01 CPV · 23K TrueView views</p>
      </div>
    </div>
    <div class="proof-card">
      <div class="proof-card-img"><img src="/assets/img/youtube-campaign-207k.png" alt="YouTube campaign 207K impressions" loading="lazy" /></div>
      <div class="proof-card-caption">
        <p class="proof-card-value">19.8K VIEWS</p>
        <p class="proof-card-label">9.56% view rate · €0.01 CPV</p>
      </div>
    </div>
  </div>
</section>
```

- Method block: same structure as Spotify, copy: `Catalog and channel audit for YouTube fit.`, `Music video and Shorts creative direction.`, `TrueView campaigns and channel growth execution.`
- CTA: `Want YouTube to actually grow?` / `Book a free review call. We'll audit your channel live.`
- JSON-LD: same shape, name "YouTube Promotion", description: "YouTube music video distribution, TrueView campaigns, and channel growth for urban artists."

- [ ] **Step 15.3: Write `services-instagram.html`**

Same template, replacements:
- `<title>Instagram Promotion — ICONENT GROUP</title>`
- description: "Instagram promotion for urban artists. Reels strategy, ads, and audience growth — built on real engagement data."
- canonical: `https://iconent-group.com/services-instagram`
- `<body data-platform="instagram" class="platform-page">`
- H1: `Instagram <span class="accent">promotion</span>`
- Hero sub: `Reels strategy, content production direction, and ads tied to real audience growth — built around fan conversion, not impressions.`
- "What we do" lead: `Instagram is where urban artists either build a real fanbase or burn through impressions and have nothing left. We run the strategy that compounds — Reels production cadence, hook engineering, audio sourcing, ads tied to landing pages instead of profile views, and audience analytics that tell you what's actually converting.`
- Deliverables:
  - Reels content strategy with production cadence
  - Hook and audio sourcing for catalog tracks
  - Meta ads campaigns with real funnel tracking
  - Engagement coordination and comment strategy
  - Story and DM funnels for warm leads
  - Monthly reporting on reach, saves, and follower growth
- Proof block uses the 2 IG screenshots:

```html
<div class="proof-card">
  <div class="proof-card-img"><img src="/assets/img/ig-1-4m.jpg" alt="1.4M Instagram views" loading="lazy" /></div>
  <div class="proof-card-caption">
    <p class="proof-card-value">1.4M VIEWS</p>
    <p class="proof-card-label">Instagram organic reach</p>
  </div>
</div>
<div class="proof-card">
  <div class="proof-card-img"><img src="/assets/img/ig-51m.jpg" alt="51M Instagram views" loading="lazy" /></div>
  <div class="proof-card-caption">
    <p class="proof-card-value">51M VIEWS</p>
    <p class="proof-card-label">Last 90 days · no ads</p>
  </div>
</div>
```

- Method block: same structure, copy: `Profile audit and content positioning.`, `Reels and ads creative direction.`, `Daily execution and funnel optimization.`
- CTA: `Tired of impressions?` / `Book a free review call. We'll diagnose what's actually broken on your Instagram.`
- JSON-LD: name "Instagram Promotion", description: "Instagram Reels strategy, Meta ads, and audience growth for urban artists."

- [ ] **Step 15.4: Write `services-tiktok.html`**

Same template, replacements:
- `<title>TikTok Promotion — ICONENT GROUP</title>`
- description: "TikTok promotion for urban artists. Sound seeding, creator partnerships, and catalog discovery — managed end-to-end."
- canonical: `https://iconent-group.com/services-tiktok`
- `<body data-platform="tiktok" class="platform-page">`
- H1: `TikTok <span class="accent">promotion</span>`
- Hero sub: `Sound seeding, creator partnerships, and catalog discovery strategy. Built for tracks that should be moving, but aren't.`
- "What we do" lead: `TikTok promotion isn't about going viral. It's about engineering the right sound seeding, finding creators whose audience actually matches your catalog, and building a discovery funnel that lands listeners on Spotify and Instagram. We run that system — sourcing, briefing, and tracking — across every release we manage.`
- Deliverables:
  - Sound seeding to creator network across genres
  - Creator brief development and matching
  - TikTok ads (Spark Ads + in-feed) with conversion tracking
  - UGC monitoring and amplification strategy
  - Catalog discovery campaigns for older tracks
  - Monthly reporting on sound usage, save-rate impact, and downstream platform conversion
- Proof block placeholder:

```html
<section class="section">
  <p class="section-label">Proof</p>
  <h2>Real <span class="accent">campaigns</span></h2>
  <div class="proof-todo">
    <!-- TODO: TikTok screenshots from user — pending delivery. Replace with .proof-card grid like the Spotify/Instagram pages. -->
    TikTok proof screenshots — coming soon
  </div>
</section>
```

- Method block: same structure, copy: `Catalog audit for TikTok fit and sound selection.`, `Creator briefing and sound packaging.`, `Seeding, ads, and amplification.`
- CTA: `Ready to move on TikTok?` / `Book a free review call. We'll show you what's actually moving for artists like yours.`
- JSON-LD: name "TikTok Promotion", description: "TikTok sound seeding, creator partnerships, and catalog discovery campaigns for urban artists."

- [ ] **Step 15.5: Browser test all 4 platform pages**

Open in order: `/services-spotify.html`, `/services-youtube.html`, `/services-instagram.html`, `/services-tiktok.html`. For each verify:
- Hero accent color matches platform (green Spotify, red YT, blue IG, white-with-glow TikTok)
- Section labels use platform color (the small dot in `.section-label::before` matches)
- Header nav: the corresponding service item in the Services dropdown is highlighted (use the dev tools to confirm `.is-active`)
- Proof cards render (TikTok shows TODO placeholder)
- CTA dropdown opens, links work

- [ ] **Step 15.6: Commit**

```bash
git add services-spotify.html services-youtube.html services-instagram.html services-tiktok.html
git commit -m "feat: add 4 platform service pages"
```

---

## Task 16: Contact page

**Files:**
- Create: `contact-us.html`, `assets/css/pages/contact.css`

- [ ] **Step 16.1: Write `assets/css/pages/contact.css`**

```css
.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  margin: 0 auto;
  max-width: 1200px;
  padding: 56px 28px 96px;
}
.contact-calendly {
  position: relative;
  background: var(--ic-bg-soft);
  border: 1px solid var(--ic-rule);
  border-radius: 8px;
  min-height: 600px;
  overflow: hidden;
}
.contact-calendly .calendly-inline-widget {
  width: 100%;
  height: 600px;
  min-width: 320px;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.contact-info-block h3 {
  font-size: 14px;
  color: var(--ic-green);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 12px;
}
.contact-info-block p,
.contact-info-block a {
  font-size: 15px;
  line-height: 1.65;
  color: var(--ic-text);
}
.contact-info-block a {
  border-bottom: 1px solid rgba(0,255,136,0.4);
  transition: color 0.2s ease, border-color 0.2s ease;
}
.contact-info-block a:hover {
  color: var(--ic-green);
  border-bottom-color: var(--ic-green);
}
.contact-cities {
  font-size: 13px;
  color: var(--ic-muted);
  letter-spacing: 0.08em;
}
.contact-socials {
  display: flex;
  gap: 18px;
  margin-top: 4px;
}
.contact-socials a {
  width: 36px;
  height: 36px;
  border: 1px solid var(--ic-rule);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  border-bottom: 1px solid var(--ic-rule);
}
.contact-socials a:hover {
  border-color: var(--ic-green);
  color: var(--ic-green);
  transform: translateY(-2px);
}
.contact-socials svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
@media (max-width: 900px) {
  .contact-main { grid-template-columns: 1fr; gap: 32px; }
}
```

- [ ] **Step 16.2: Write `contact-us.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0A0A0A" />
  <title>Contact — ICONENT GROUP</title>
  <meta name="description" content="Get in touch with ICONENT GROUP. Book a free review call or reach us at info@iconent-group.com." />
  <link rel="canonical" href="https://iconent-group.com/contact-us" />
  <meta property="og:title" content="Contact — ICONENT GROUP" />
  <meta property="og:description" content="Book a free review call with our Project Manager." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconent-group.com/contact-us" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/components.css" />
  <link rel="stylesheet" href="/assets/css/pages/contact.css" />
</head>
<body>
  <ic-header></ic-header>
  <div class="blur-overlay"></div>

  <main>
    <section class="hero-compact">
      <h1>Let's <span style="color: var(--ic-green);">talk</span></h1>
      <p class="hero-sub">Book a review call below, or reach us directly. We answer real artists with real catalogs.</p>
    </section>

    <div class="contact-main">
      <div class="contact-calendly">
        <div class="calendly-inline-widget" data-url="https://calendly.com/d/cxy6-2pj-4zj/iconent-artist-discovery-call?hide_gdpr_banner=1&background_color=141414&text_color=f5f5f5&primary_color=00ff88"></div>
      </div>
      <div class="contact-info">
        <div class="contact-info-block">
          <h3>Email</h3>
          <p><a href="mailto:info@iconent-group.com">info@iconent-group.com</a></p>
        </div>
        <div class="contact-info-block">
          <h3>Office</h3>
          <p>99 Wall Street<br />New York, NY 10005<br />United States</p>
        </div>
        <div class="contact-info-block">
          <h3>Team across</h3>
          <p class="contact-cities">NASHVILLE · CHICAGO · LOS ANGELES · NEW YORK</p>
        </div>
        <div class="contact-info-block">
          <h3>Social</h3>
          <div class="contact-socials">
            <a href="https://www.instagram.com/iconent_group/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.3.4.6.2 1 .5 1.5 1s.7.9 1 1.5c.2.5.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zM12 7.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm5-2.1a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
            </a>
            <a href="https://www.facebook.com/ICONENTGROUP" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.2-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <ic-footer></ic-footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://iconent-group.com/contact-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "ICONENT GROUP",
      "email": "info@iconent-group.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "99 Wall Street",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10005",
        "addressCountry": "US"
      }
    }
  }
  </script>

  <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
  <script src="/assets/js/components.js" defer></script>
  <script src="/assets/js/shared.js" defer></script>
  <script src="/assets/js/calendly.js" defer></script>
</body>
</html>
```

- [ ] **Step 16.3: Browser test**

Open `http://localhost:3000/contact-us.html`. Verify:
- Hero compact renders
- Calendly inline widget loads on the left (or top on mobile)
- Right column shows email (clickable mailto), office address, cities, social icons
- Resize: layout stacks vertically, Calendly widget still functions
- Header "Contact" nav item is highlighted (`.is-active`)

- [ ] **Step 16.4: Commit**

```bash
git add contact-us.html assets/css/pages/contact.css
git commit -m "feat: add contact page with inline Calendly"
```

---

## Task 17: sitemap.xml

**Files:**
- Create: `sitemap.xml`

- [ ] **Step 17.1: Write `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://iconent-group.com/</loc><lastmod>2026-05-20</lastmod><priority>1.0</priority></url>
  <url><loc>https://iconent-group.com/about-us</loc><lastmod>2026-05-20</lastmod><priority>0.8</priority></url>
  <url><loc>https://iconent-group.com/services-project-management</loc><lastmod>2026-05-20</lastmod><priority>0.9</priority></url>
  <url><loc>https://iconent-group.com/services-spotify</loc><lastmod>2026-05-20</lastmod><priority>0.7</priority></url>
  <url><loc>https://iconent-group.com/services-youtube</loc><lastmod>2026-05-20</lastmod><priority>0.7</priority></url>
  <url><loc>https://iconent-group.com/services-instagram</loc><lastmod>2026-05-20</lastmod><priority>0.7</priority></url>
  <url><loc>https://iconent-group.com/services-tiktok</loc><lastmod>2026-05-20</lastmod><priority>0.7</priority></url>
  <url><loc>https://iconent-group.com/contact-us</loc><lastmod>2026-05-20</lastmod><priority>0.6</priority></url>
</urlset>
```

- [ ] **Step 17.2: Commit**

```bash
git add sitemap.xml
git commit -m "feat: add sitemap.xml"
```

---

## Task 18: Final cross-page audit

- [ ] **Step 18.1: Manual nav + footer consistency check**

For each of the 8 pages, open in browser and verify:
- Header renders identically on all pages
- Footer renders identically on all pages
- Active nav item highlights correctly (home → no service highlighted; service page → that service highlighted; contact → Contact highlighted)
- No console errors
- No 404s in Network tab

Pages:
- `/` (index.html)
- `/about-us.html`
- `/services-project-management.html`
- `/services-spotify.html`
- `/services-youtube.html`
- `/services-instagram.html`
- `/services-tiktok.html`
- `/contact-us.html`

- [ ] **Step 18.2: Cross-link check**

Click every "Discover Services" dropdown link, every footer social icon, every CTA Book a Call. Verify no broken navigation.

- [ ] **Step 18.3: Mobile pass**

Resize browser to 375px width. Visit all 8 pages. Verify:
- Burger menu opens fullscreen overlay
- Platform colored bars on left of mobile menu items match (green PM, Spotify green, YT red, IG blue, TikTok white/glow)
- All sections stack correctly
- Touch targets ≥ 44px

- [ ] **Step 18.4: Lighthouse audit on homepage**

Run Lighthouse (DevTools → Lighthouse → Mobile + Desktop, Performance + Accessibility + Best Practices + SEO). Target:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices = 100
- SEO = 100

Common fixes if scores miss:
- Performance: add `width` + `height` attrs to images for CLS, add `preload` for hero image
- Accessibility: add missing `aria-label` on buttons, fix color contrast
- SEO: ensure all pages have unique title + description (verify in Network tab)

Fix any issues inline.

- [ ] **Step 18.5: Commit any fixes**

```bash
git add -A
git commit -m "fix: cross-page audit fixes (a11y/perf/SEO)"
```

(Skip if no changes.)

---

## Task 19: README

**Files:**
- Create: `README.md`

- [ ] **Step 19.1: Write `README.md`**

```markdown
# ICONENT-GROUP.COM

Static rebuild of iconent-group.com. Plain HTML / CSS / vanilla JS. No build step.

## Stack

- HTML5
- CSS with custom properties (no preprocessor)
- Vanilla ES2020 JS, Custom Elements v1
- Calendly widget (lazy-loaded only when modal opens)
- No package.json, no node_modules, no framework

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:3000` (or `:8000`).

You can also open `index.html` directly with `open index.html` — most things work, but web components rely on a real document context so a local server is recommended.

## Deploy

### Netlify

Drag the project folder into the Netlify drop zone. Done. Set the custom domain to `iconent-group.com`.

### Vercel

```bash
vercel --prod
```

No build command, output directory = root.

### Cloudflare Pages

Connect this repo. Build command: empty. Output directory: `/`.

## Editing shared chrome

The header and footer are defined as `<ic-header>` and `<ic-footer>` custom elements in `assets/js/components.js`. Edit there and all 8 pages update.

## Files of interest

- `index.html` — homepage
- `assets/css/components.css` — all shared UI styles (header, footer, buttons, cards, modal, etc.)
- `assets/css/tokens.css` — palette, spacing, type, breakpoints
- `assets/js/components.js` — header + footer web components
- `assets/js/calendly.js` — modal + lazy widget loader
- `assets/js/home.js` — hero canvas animation + count-up metrics
- `assets/js/shared.js` — CTA dropdown, FAQ accordion

## Updating assets

Replace files in `assets/img/`. Keep filenames the same to avoid editing HTML. If renaming, update references with:

```bash
grep -rln 'old-filename.png' --include='*.html' --include='*.css' . | xargs sed -i '' 's/old-filename.png/new-filename.png/g'
```

## Things to do later

- Real contact form (Netlify Forms / Formspree) — currently Calendly + mailto
- TikTok proof screenshots — currently a TODO placeholder block
- Image optimization (avif/webp) — assets ship at source resolution
- Cookie banner if EU traffic grows
```

- [ ] **Step 19.2: Commit + final tag**

```bash
git add README.md
git commit -m "docs: add README"
git tag v1.0.0
```

---

## Self-review checklist (run after completing all tasks)

- [ ] **Spec coverage:** Every section of `docs/superpowers/specs/2026-05-20-iconent-group-rebuild-design.md` maps to at least one task above. Sections covered:
  - §4 file structure → T1, T2, T3-T19
  - §5 tokens → T3
  - §6 web components → T6
  - §7 homepage porting → T9, T10, T11
  - §8 about → T12
  - §9.1 PM service → T13
  - §9.2 platform services → T14, T15
  - §10 contact → T16
  - §11 behavior modules → T6, T7, T8
  - §12 SEO meta → embedded in each page (T9, T12, T13, T15, T16) + T17 sitemap
  - §13 responsive/a11y → embedded in every CSS task
  - §14 deploy → T19 README
- [ ] **Placeholder scan:** No "TBD" / "TODO: implement" in task content (only intentional placeholders for missing TikTok screenshots in T15.4 — flagged in spec §16 as a deferred user delivery)
- [ ] **Type consistency:** Web component names (`ic-header`, `ic-footer`) used consistently. Global JS functions (`icOpenCalendly`, `icCloseCalendly`) named consistently across T6, T7, T8, T9.
- [ ] **Z-index scale:** values in `tokens.css` (T3) match usage in `components.css` (T5). No magic numbers in component files.

---

**Plan complete.** Ready for execution.
