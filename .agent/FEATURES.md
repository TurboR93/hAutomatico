# hAutomatico Website - Features & Structure

## Project Overview
**hAutomatico** - Italian company website focused on AI and automation solutions for businesses.

**Tech Stack:**
- React 18 + TypeScript
- Vite 5 (build tool)
- TailwindCSS 3.4 (styling)
- Framer Motion 11 (animations)
- Lucide React (icons)
- React Router DOM (routing)
- PT Sans font (Google Fonts)

**Color Palette:**
- Primary Yellow: `#FDF07A` (backgrounds, accents)
- Primary Red: `#D03F29` (CTAs, headings, highlights)
- Black: `#000000` (text, dark sections)
- White: `#FFFFFF` (text on dark)

---

## Current Page Structure

### 1. Header (`Header.tsx`)
- Fixed navigation bar with scroll effect (adds blur/shadow on scroll)
- Logo: Red square with "A" letter
- Nav Links: HOME, SERVIZI, PREPARATI, CHI SIAMO
- Mobile hamburger menu with AnimatePresence animations
- Yellow background (`#FDF07A`)

### 2. Hero Section (`Hero.tsx`)
- Full-height hero with floating 3D administrator image
- Large title: "RIVOLUZIONIAMO LA TECNOLOGIA AL TUO SERVIZIO"
- Yellow background with text overlay on image
- Subtle floating animation on hero image

### 3. Visione Section (`Visione.tsx`)
- Black background with white text
- Left: Title "VISIONE" (red) + description paragraph
- Right: Image with Ken Burns zoom effect on scroll
- WavyDivider transition from yellow to black

### 4. Missione Section (`Missione.tsx`)
- Yellow background, black text
- Left: 3D network illustration image
- Right: Title "MISSIONE" (red) + description paragraph
- Focus on AI integration and ethical automation

### 5. Services Section (`Services.tsx`)
- Red background (`#D03F29`)
- Title: "COSA POSSIAMO FARE, PARTIAMO DA..."
- 5 service cards (clickable → dedicated pages):
  1. Manager Tabelle Orari - €2,500.00
  2. Gestionale completo - €18,000.00
  3. Gestionale ecommerce - €9,600.00
  4. **ioNoleggio** - €7,500.00 (rental management)
  5. **miaPizzeria** - €5,200.00 (pizzeria management)
- Cards have hover lift effect and "Scopri di più" link

### 6. Service Detail Pages (`ServiceDetail.tsx`)
- Accessible at `/servizi/:serviceId`
- Hero section with image and full description
- Features grid with checkmark icons
- CTA section with "Richiedi Demo" button
- Back navigation to services section

### 6. Footer (`Footer.tsx`)
- Yellow background
- Brand description (explains "h" in hAutomatico = Planck constant)
- Contact: Via Vistorta 11, Cordignano (TV), ITALIA
- Email: info@hautomatico.com
- P. IVA: 0438991137

### 7. WavyDivider Component (`WavyDivider.tsx`)
- SVG wave transition between sections with different colors
- Used for smooth color transitions

---

## Images (in `public/imgs/`)

| Component | Image File |
|-----------|------------|
| Hero | `d53d22_ffe974_..._54y0j3ag0rm80do95wln_3.png` |
| Visione | `image_describilng_classic_papers_..._5a10xyxgato608l4dplp_0.png` |
| Missione | `d53d22_ffe974_..._8ugfg51cmh3dbucrj7k3_0.png` |
| Service 1 | `use_palette_-_d53d22_ffe974_..._3s862q07eatgronwo1fp_3.png` |
| Service 2 | `d53d22_ffe974_..._r7tq932hn1wfqfzzi7bl_1.png` |
| Service 3 | `d53d22_ffe974_..._uiije41cr8x3uwhmpqzf_1.png` |

---

## Development Notes

### Vite Configuration
- Base path: `/hautomatico/` (important for deployment)
- Images must be in `public/imgs/` to be served correctly

### Styling Approach
- TailwindCSS utility classes
- Custom colors defined in `tailwind.config.js`
- PT Sans font family

---

## Planned Features / TODO

- [ ] Add "PREPARATI" section (referenced in nav)
- [ ] Add "CHI SIAMO" section (referenced in nav)
- [ ] Improve service descriptions (currently placeholders)
- [ ] Add contact form
- [ ] Add social media links
- [ ] Improve SEO meta tags
- [ ] Add favicon/logo
