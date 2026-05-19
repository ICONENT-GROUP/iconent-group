# ICONENT-GROUP.COM

Static rebuild of iconent-group.com. Plain HTML / CSS / vanilla JS. No build step.

## Stack

- HTML5
- CSS with custom properties (no preprocessor)
- Vanilla ES2020 JS, Custom Elements v1
- Calendly widget (lazy-loaded only when modal opens, eager on contact page)
- No package.json, no node_modules, no framework

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:3000` (or `:8000`).

You can also open `index.html` directly with `open index.html` — most things work, but a local server is recommended.

## Deploy

### Netlify

Drag the project folder into the Netlify drop zone. Set the custom domain to `iconent-group.com`. No build command, publish directory = root.

### Vercel

```bash
vercel --prod
```

No build command, output directory = root.

### Cloudflare Pages

Connect this repo. Build command: empty. Output directory: `/`.

## Editing shared chrome

Header and footer are defined as `<ic-header>` and `<ic-footer>` custom elements in [assets/js/components.js](assets/js/components.js). Edit there and all 8 pages update.

## Files of interest

- [index.html](index.html) — homepage
- [assets/css/components.css](assets/css/components.css) — all shared UI styles (header, footer, buttons, cards, modal, etc.)
- [assets/css/tokens.css](assets/css/tokens.css) — palette, spacing, type, breakpoints
- [assets/js/components.js](assets/js/components.js) — header + footer web components
- [assets/js/calendly.js](assets/js/calendly.js) — modal + lazy widget loader
- [assets/js/home.js](assets/js/home.js) — hero canvas animation + count-up metrics
- [assets/js/shared.js](assets/js/shared.js) — CTA dropdown, FAQ accordion

## Updating assets

Replace files in [assets/img/](assets/img/). Keep filenames the same to avoid editing HTML. If renaming:

```bash
grep -rln 'old-filename.png' --include='*.html' --include='*.css' . | xargs sed -i '' 's/old-filename.png/new-filename.png/g'
```

## Pending items

- **YouTube proof screenshots** (3 files) — the service-youtube page references `youtube-overview-822k.png`, `youtube-campaign-58k.png`, `youtube-campaign-207k.png`. Drop them into `assets/img/` before deploy.
- **TikTok proof screenshots** — the service-tiktok page currently shows a placeholder block (`.proof-todo`). When screenshots arrive, replace the placeholder div with a `.platform-proof` grid matching the Spotify/YouTube/Instagram pattern.

## Out of scope (deferred)

- Real contact form (Netlify Forms / Formspree) — v1 uses Calendly + `mailto:info@iconent-group.com`
- Image optimization (avif/webp) — assets ship at source resolution
- Cookie banner / EU compliance prompt
