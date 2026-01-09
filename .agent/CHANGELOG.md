# hAutomatico - Change Log

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
