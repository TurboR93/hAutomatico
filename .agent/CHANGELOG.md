# hAutomatico - Change Log

## [2026-06-12] Rimozione prezzi, P.IVA provvisoria, riallineamento docs

### Changed
- **Rimossi tutti i prezzi dal sito pubblico** (campo `price` eliminato da `src/data/services.ts` e dall'interfaccia `Service`)
  - Card servizi: tolto il blocco "a partire da €…", resta la CTA "Scopri di più"
  - Pagina dettaglio: al posto del prezzo un link "Scopri di più" (mailto:info@hautomatico.com)
  - JSON-LD: rimosso il blocco `offers` (il prezzo non è più esposto nemmeno a Google)
- **Footer**: P.IVA aggiornata a `05111993` — placeholder volutamente provvisorio (non è una P.IVA valida), da sostituire con quella reale
- **Docs**: FEATURES.md riscritto e riallineato allo stato attuale; questo changelog recupera i mesi mancanti

### Notes
- info@hautomatico.com ora funziona: creato come alias di riccardo@ in Google Workspace (prima le mail rimbalzavano; il vecchio inoltro Squarespace non è mai stato attivo)

---

## [2026-01 → 2026-06] Riepilogo interventi non registrati qui (vedi git log)

- **Sito pubblico**
  - Pagina About ("Chi siamo"), nuovo logo, pagina `/servizi` dedicata, card interamente cliccabili
  - 2 nuovi servizi: Sito Web Standard, Documentazione Sicurezza Cantiere (totale: 7)
  - Immagini ottimizzate in .webp con nomi descrittivi
  - Sistema animazioni "Quantum Geometry" (`src/components/motion/`) (8fa039e)
  - SEO: meta per-route, schema arricchito, H1 unico, sitemap, robots.txt (a27f46e, ddaf9a6)
- **Area Amministrazione** (nuova, su amministrazione.hautomatico.com — f6a4c7a e successivi)
  - Gestionale con Panoramica, Movimenti, Preventivi, Fatture, Clienti, Abbonamenti, Ritenute
  - Cloudflare Pages Functions + D1; allegati documenti su R2
  - Ritenuta d'acconto (gross-up, soglia 5000 €/anno), ricorrenze anche pluriennali, proiezione rinnovi, tipo movimento "Spesa"
  - Deploy unificato: `npm run deploy` (e05ea07)

---

## [2026-01-09] Service Cards & Dedicated Pages

### Added
- **2 new service cards**:
  - `ioNoleggio` - Rental management system (€7,500.00)
  - `miaPizzeria` - Pizzeria management system (€5,200.00)
- **Generated images** for new services in `public/imgs/`
- **React Router** for client-side navigation
- **Service detail pages** at `/servizi/:serviceId` with:
  - Full description
  - Feature list with checkmarks
  - CTA section with demo request button
- **Centralized services data** in `src/data/services.ts`
- **Updated Header** with React Router Links and hash navigation

### Modified
- `App.tsx` - Added BrowserRouter and routes
- `Services.tsx` - Now uses shared data, cards are clickable
- `Header.tsx` - Now uses React Router Links

### New Files
- `src/data/services.ts` - Centralized service definitions
- `src/components/ServiceDetail.tsx` - Detail page component
- `public/imgs/ionoleggio_service.png` - ioNoleggio image
- `public/imgs/miapizzeria_service.png` - miaPizzeria image

---

## [2026-01-09] Initial Setup & Image Fix

### Fixed
- **Services.tsx**: Fixed image path for "Manager Tabelle Orari" service card
  - Changed from: `/imgs/d53d22_ffe974_..._3s862q07eatgronwo1fp_3.png`
  - Changed to: `/imgs/use_palette_-_d53d22_ffe974_..._3s862q07eatgronwo1fp_3.png`
  - Reason: Filename mismatch between code and actual file in `public/imgs/`

### Notes
- Dev server running at: `http://localhost:5173/hautomatico/`
- Base path configured as `/hautomatico/` in `vite.config.ts`

---

## Modification Guidelines

When making changes:
1. Update this file with date, changes, and reasoning
2. Update FEATURES.md if adding new features
3. Test in browser before confirming completion
