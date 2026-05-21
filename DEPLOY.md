# Guida deploy — ICONENT GROUP

Ciao 👋 — questa è la guida per pubblicare il sito su `iconent-group.com`. Il sito è statico (HTML/CSS/JS), niente WordPress, niente database, niente backend. Puoi servirlo da qualunque static host.

Tempo stimato: **30-60 minuti** end-to-end.

---

## 1. Cosa hai davanti

### Stack
- **Statico puro**: HTML/CSS/JS, niente build step, niente Node, niente framework.
- **8 pagine HTML**:
  - `index.html` — homepage
  - `about-us.html` — about + team + testimonials + FAQ
  - `contact-us.html` — Calendly inline + info
  - `services-project-management.html`
  - `services-spotify.html`
  - `services-youtube.html`
  - `services-instagram.html`
  - `services-tiktok.html`
- **Una pagina nascosta** (`noindex`, link interno discreto):
  - `strategy-call/index.html` — VSL page con video Vimeo + Calendly lock
- **Assets**:
  - `assets/css/*` — fogli di stile (tokens, base, components, pages/*)
  - `assets/js/*` — componenti web (`<ic-header>` / `<ic-footer>`), Calendly modal, animazioni
  - `assets/img/*` — tutte le immagini (PNG/JPG, già ottimizzate)
- **SEO files**:
  - `robots.txt`
  - `sitemap.xml`
  - `llms.txt` (per AI search engines)
- **Schema.org JSON-LD** è dentro a ogni HTML (Organization / LocalBusiness / Service / FAQPage / BreadcrumbList / Review).

### Cose da NON fare
- Non aggiungere processo di build (Webpack/Vite/etc.) — non serve.
- Non spostare i file in sotto-cartelle: i percorsi `/assets/...` sono assoluti.
- Non comprimere/minimizzare i file a mano — gli host moderni (Cloudflare Pages, Netlify, Vercel) lo fanno in automatico.

---

## 2. Pre-flight check (da verificare PRIMA del deploy)

Verifica con Kenzo che questi valori siano corretti, perché vivono nel codice hardcoded:

| Cosa | Dove | Valore attuale |
|---|---|---|
| Email contatto | tutte le pagine + JSON-LD + `llms.txt` | `info@iconent-group.com` |
| Indirizzo legale | tutte le pagine (JSON-LD) + `contact-us.html` | `99 Wall Street, New York, NY 10005, US` |
| Instagram URL | `assets/js/components.js` (footer social) + JSON-LD | `https://www.instagram.com/iconent_group/` |
| Facebook URL | `assets/js/components.js` + JSON-LD | `https://www.facebook.com/ICONENTGROUP` |
| Calendly URL | `assets/js/calendly.js` (CALENDLY_URL) + `contact-us.html` + `strategy-call/index.html` | `https://calendly.com/d/cxy6-2pj-4zj/iconent-artist-discovery-call` |
| Dominio canonico | tutti gli `<link rel="canonical">` + `og:url` + `sitemap.xml` + `robots.txt` + `llms.txt` | `https://iconent-group.com/` |

Se uno di questi è da cambiare, fai search-and-replace nel repo (sono tutti hardcoded). Esempio:
```bash
grep -rn "info@iconent-group.com" .
```

---

## 3. Scelta dell'hosting

Tre opzioni equivalenti, scegli quella che preferisci. Tutte gratuite per traffico tipico di un sito brochure.

### Opzione A — Cloudflare Pages *(consigliata)*
- Già usato un Cloudflare account per il dominio? Allora questo è il path naturale.
- CDN globale incluso, HTTPS automatico, supporto perfetto per static site.
- Permette rewrite URL senza `.html` con un file `_redirects` (2 righe).

### Opzione B — Netlify
- Stesso identico setup. Drag-and-drop deploy possibile.
- File `_redirects` con stessa sintassi di Cloudflare Pages.

### Opzione C — Vercel
- Anche qui zero-config. Rewrite URL via `vercel.json`.

In ogni caso, **NON serve un piano a pagamento** per questo sito. Free tier abbondante.

---

## 4. Deploy step-by-step

### 4.1 — Push del codice su GitHub (preparazione per tutti gli host)

Il repo dovrebbe essere già un repo git locale (controlla con `git status` nella cartella). Se non c'è già un remote GitHub:

```bash
cd "/percorso/alla/cartella/SITO ICONENT GROUP"
git status                                    # verifica file modificati
git add -A
git commit -m "Site ready for production deploy"
gh repo create iconent-group-site --private   # se hai gh CLI
git push -u origin main
```

Se non hai `gh` CLI: crea il repo a mano su github.com/new e collegalo con `git remote add origin ...`.

### 4.2 — Deploy su Cloudflare Pages (Opzione A)

1. Login su https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Autorizza GitHub, seleziona il repo.
3. Build settings:
   - **Framework preset**: `None`
   - **Build command**: *(lascia vuoto)*
   - **Build output directory**: `/` *(root)*
4. **Save and Deploy**. Cloudflare costruisce e pubblica su un URL temporaneo (`*.pages.dev`).
5. Verifica che la preview funzioni → poi vai al punto **5. DNS**.

### 4.3 — Deploy su Netlify (Opzione B)

1. Login su https://app.netlify.com → **Add new site** → **Import an existing project** → GitHub.
2. Seleziona il repo. Build settings:
   - **Build command**: *(vuoto)*
   - **Publish directory**: `.` *(root)*
3. **Deploy site**. URL temporaneo `*.netlify.app`.

### 4.4 — Deploy su Vercel (Opzione C)

1. Login su https://vercel.com → **Add new** → **Project** → import dal repo GitHub.
2. Vercel rileva auto che è statico. **Deploy**.
3. URL temporaneo `*.vercel.app`.

---

## 5. URL puliti SENZA `.html` (opzionale ma consigliato)

Attualmente tutti i canonical e la sitemap puntano a URL con estensione `.html` (es. `/about-us.html`). È **safe** e funziona ovunque, ma se vuoi URL puliti tipo `/about-us` (più moderno + meglio per SEO), fai così:

### Cloudflare Pages / Netlify
Crea un file `_redirects` nella root del repo:
```
/about-us               /about-us.html              200
/contact-us             /contact-us.html            200
/services-project-management  /services-project-management.html  200
/services-spotify       /services-spotify.html      200
/services-youtube       /services-youtube.html      200
/services-instagram     /services-instagram.html    200
/services-tiktok        /services-tiktok.html       200
```

### Vercel
Crea `vercel.json` nella root:
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Dopo aver attivato URL puliti
Fai search-and-replace per **togliere `.html`** da:
- Tutti i `<link rel="canonical">` (8 file HTML)
- Tutti i `<meta property="og:url">`
- `sitemap.xml`
- Tutti gli `href` interni nel sito (`/services-spotify.html` → `/services-spotify`)
- Schema.org `BreadcrumbList` (campo `item`)

Comando rapido:
```bash
grep -rln "iconent-group.com/about-us.html" .
# poi sed -i '' 's/about-us\.html/about-us/g' file.html  per ogni file
```

⚠️ **Se NON vuoi fare URL puliti**: salta tutta questa sezione 5. Il sito funziona perfettamente anche così com'è. Decisione di stile, non di funzionalità.

---

## 6. Collegare il dominio `iconent-group.com`

### Cloudflare Pages
1. In Cloudflare Pages → tab **Custom domains** → **Set up a custom domain** → `iconent-group.com` + `www.iconent-group.com`.
2. Cloudflare aggiunge i CNAME automaticamente se il dominio è già su CF DNS. Altrimenti aggiungi i CNAME manualmente come ti dice la dashboard.

### Netlify
1. Site settings → **Domain management** → **Add custom domain** → `iconent-group.com`.
2. Aggiungi i record DNS suggeriti (CNAME o A record) presso il tuo registrar.

### Vercel
1. Project settings → **Domains** → `Add` → `iconent-group.com`.
2. Stesso processo, ti dà i record da aggiungere al DNS.

### Propagazione DNS
5 minuti–24 ore. Test con:
```bash
dig iconent-group.com +short
curl -I https://iconent-group.com
```

HTTPS dovrebbe attivarsi automaticamente entro pochi minuti dal punto in cui il DNS punta correttamente.

---

## 7. Post-deploy checks

### 7.1 — Verifica funzionalità nel browser
Apri `https://iconent-group.com` e clicca attraverso:
- [ ] Header con menu Services (hover desktop + tap mobile)
- [ ] Bottone "Book a Review Call" apre il modal Calendly
- [ ] FAQ accordion espande/collassa
- [ ] Footer mostra logo, social, copyright `© 2026 ICONENT GROUP`
- [ ] Nessun errore in console (F12 → Console)
- [ ] Animazione hero canvas attiva su `/`
- [ ] Animazione spotlight reveal sui titoli di `services-*.html`
- [ ] Stats count-up scrolla da 0 entrando in viewport (es. "By the numbers" su `/services-spotify`)

### 7.2 — SEO base
- [ ] `https://iconent-group.com/robots.txt` restituisce 200
- [ ] `https://iconent-group.com/sitemap.xml` restituisce 200 e valido XML
- [ ] Test rich-results: https://search.google.com/test/rich-results — passa per FAQ + Organization + Service
- [ ] Test PageSpeed: https://pagespeed.web.dev/ — target LCP < 2.5s, CLS < 0.1

### 7.3 — Submit a Google Search Console
1. Vai su https://search.google.com/search-console → **Add property** → URL prefix `https://iconent-group.com/`.
2. Verifica ownership (DNS TXT record è il modo più sicuro).
3. **Sitemaps** → submit `https://iconent-group.com/sitemap.xml`.

### 7.4 — Privacy/Cookie banner
Calendly mette tracking cookie. Per essere compliant GDPR/CCPA (se traffico UE arriva), aggiungi un cookie consent banner. Opzioni gratuite:
- **Cookiebot** free tier
- **Klaro!** (open-source, self-hosted)

Anche aggiungi una pagina `/privacy-policy.html` che menzioni Calendly come data processor. **Al momento il sito non ha privacy policy** — segnalato a Kenzo.

---

## 8. Dove modificare CHE COSA in futuro

| Voglio cambiare... | Dove agisco |
|---|---|
| Testo di una pagina | Direttamente nell'HTML della pagina (`*.html` in root) |
| Logo testo nell'header | `assets/js/components.js` → variabile `HEADER_HTML` |
| Tagline footer | `assets/js/components.js` → variabile `FOOTER_HTML` (riga `ic-ftr-block-tagline`) |
| Indirizzo footer | `assets/js/components.js` → `ic-ftr-block-address` |
| Copyright footer | `assets/js/components.js` → `ic-ftr-block-copyright` |
| Colori brand | `assets/css/tokens.css` (variabili `--ic-*`) |
| Spaziature globali | `assets/css/base.css` |
| Header/CTA/Footer style | `assets/css/components.css` |
| Style di una pagina specifica | `assets/css/pages/[nome-pagina].css` |
| URL Calendly | `assets/js/calendly.js` (riga 2: `CALENDLY_URL`) + `contact-us.html` (riga ~40) + `strategy-call/index.html` (riga ~74) |
| Aggiungere/togliere voce nel menu | `assets/js/components.js` → `HEADER_HTML` |
| Aggiungere una pagina | Crea il nuovo HTML + aggiungi entry in `sitemap.xml` + (opz.) link dal menu |
| Cambiare numeri stats | Cerca `data-count` nell'HTML della service page interessata |

Pubblicare i cambiamenti dopo aver fatto un edit:
```bash
git add -A
git commit -m "descrivere cambiamento"
git push
```
L'host (Cloudflare/Netlify/Vercel) ricostruisce e pubblica automaticamente in 30 secondi–2 minuti.

---

## 9. Cose da tenere a mente

- **Web Components**: header e footer sono **iniettati via JavaScript** (`assets/js/components.js`). Se disabiliti JS, il sito ha header e footer vuoti. È un trade-off accettabile per DRY (un solo punto di modifica) — i bot SEO indicizzano comunque il contenuto delle 8 pagine HTML.
- **No build step**: non lanciare `npm install` o `npm run build`. Non serve.
- **Cache**: gli host applicano cache aggressiva. Se vedi vecchie versioni dopo un deploy, fai hard refresh (Cmd/Ctrl + Shift + R) o aspetta 5 min per la propagazione CDN.
- **Mobile**: tutte le pagine sono responsive. Breakpoint principale a `900px` (desktop sopra, mobile sotto). Hero canvas si adatta in DPR per Retina.

---

## 10. Contatto

Se trovi qualcosa di strano nel codice o vuoi confermare un'assunzione, scrivi a Kenzo. La documentazione di questo file è completa: se serve dettaglio in più, è nei commenti CSS/JS dentro al repo.

Buon deploy.
