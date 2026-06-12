# hAutomatico Website - Features & Structure

> Aggiornato al 2026-06-12. Se modifichi il sito, riallinea questo file (vedi CHANGELOG.md).

## Project Overview
**hAutomatico** - Italian company website focused on AI and automation solutions for businesses.

Due anime nello stesso repo:
- **Sito pubblico** su https://www.hautomatico.com
- **Area Amministrazione** (gestionale interno) su https://amministrazione.hautomatico.com — codice in `src/admin/`, API in `functions/api/` (Cloudflare Pages Functions + D1 + R2)

**Tech Stack:**
- React 18 + TypeScript
- Vite 5 (build tool)
- TailwindCSS 3.4 (styling)
- Framer Motion 11 (animations)
- Lucide React (icons)
- React Router DOM (routing)
- PT Sans font (Google Fonts)
- Cloudflare Pages (hosting), D1 (database), R2 (allegati)

**Color Palette:**
- Primary Yellow: `#FDF07A` (backgrounds, accents)
- Primary Red: `#D03F29` (CTAs, headings, highlights)
- Black: `#000000` (text, dark sections)
- White: `#FFFFFF` (text on dark)

---

## Routes (sito pubblico)

| Path | Component | Note |
|------|-----------|------|
| `/` | `HomePage` (Hero, Visione, Missione, Services, Footer) | |
| `/about` | `About.tsx` | pagina "Chi siamo" |
| `/servizi` | `ServicesPage.tsx` | elenco completo servizi |
| `/servizi/:serviceId` | `ServiceDetail.tsx` | dettaglio singolo servizio |

Header nav: SERVIZI (`/#servizi`), CHI SIAMO (`/about`).

## Current Page Structure

### 1. Header (`Header.tsx`)
- Fixed navigation bar with scroll effect (adds blur/shadow on scroll)
- Logo hAutomatico + nav links, mobile hamburger menu with AnimatePresence
- Yellow background (`#FDF07A`)

### 2. Hero Section (`Hero.tsx`)
- Full-height hero, yellow background

### 3. Visione Section (`Visione.tsx`)
- Black background with white text, WavyDivider transition

### 4. Missione Section (`Missione.tsx`)
- Yellow background, black text

### 5. Services Section (`Services.tsx`)
- Red background (`#D03F29`), title "COSA POSSIAMO FARE, PARTIAMO DA..."
- Marquee di keyword scorrevoli
- **7 service cards** (clickable → pagina dettaglio), **senza prezzi** (rimossi il 2026-06-12):
  1. Manager Tabelle Orari
  2. Gestionale Completo
  3. Gestionale E-commerce
  4. ioNoleggio
  5. miaPizzeria
  6. Sito Web Standard
  7. Documentazione Sicurezza Cantiere
- Ogni card chiude con la CTA "Scopri di più"
- Dati centralizzati in `src/data/services.ts` (il campo `price` non esiste più)

### 6. Service Detail Pages (`ServiceDetail.tsx`)
- Hero con immagine e descrizione completa; al posto del prezzo c'è un link "Scopri di più" (mailto:info@hautomatico.com)
- Features grid with checkmark icons
- CTA section with "Richiedi Demo" button (mailto:info@hautomatico.com)
- SEO per-route via `useSeo` (meta + JSON-LD Service/Breadcrumb, senza `offers`/prezzo)

### 7. Footer (`Footer.tsx`)
- Yellow background
- Brand description (la "h" = costante di Planck)
- Dove: Via Cucumero 13, Vittorio Veneto (TV), Italia
- Contatti: info@hautomatico.com (alias Google Workspace di riccardo@, attivo dal 2026-06-12)
- P. IVA : 05111993 (placeholder volutamente provvisorio, non è una P.IVA valida)

### 8. Motion system (`src/components/motion/`)
- Sistema animazioni "Quantum Geometry": `GeometricField`, `RevealText`, `Reveal`, `Marquee`, `MagneticButton`, `AccentLine`, `Counter`, `CursorFollower`, `DrawnPath`
- `WavyDivider.tsx` per le transizioni di colore tra sezioni

---

## Area Amministrazione (`src/admin/`)

Gestionale interno (login richiesto) con pagine: Panoramica, Movimenti, Preventivi, Fatture, Clienti, Abbonamenti, Ritenute. Backend in `functions/api/` su Cloudflare D1; allegati su R2. Dettagli operativi in `AMMINISTRAZIONE.md`.

---

## Images

- In `public/imgs/`, formato **.webp** con nomi descrittivi (es. `gestionale-completo.webp`, `documentazione-sicurezza-cantiere.webp`)
- Favicon/apple-touch-icon presenti in `public/`

---

## Development Notes

- Base path: `/` (dominio dedicato www.hautomatico.com); `BASE_URL` usato per i path immagini
- SEO: meta per-route, `sitemap.xml`, `robots.txt`, schema arricchito in `index.html` (commit ddaf9a6)
- Deploy: `npm run deploy` → build + `wrangler pages deploy dist --project-name=hautomatico` (pubblica sito + admin insieme)
- Config Cloudflare in `wrangler.toml` (D1 binding `DB`, R2 binding `DOCS`)

---

## Planned Features / TODO

- [ ] Add contact form
- [ ] Add social media links
- [ ] Sostituire la P.IVA placeholder nel footer con quella reale
