# Luxora — Fashion E-Commerce Demo

A polished, animated front-end demo for a fictional fashion brand, **Luxora**. Built as a static single-page application with vanilla HTML, CSS and JavaScript — no build step, no dependencies, no backend. Drop it straight into GitHub Pages.

**This is a portfolio / demo project.** Checkout, payment fields and order placement are fully simulated — no real payments are processed and no data leaves the browser.

## ✨ Features

- **Home** — cinematic hero with staggered text reveals, infinite marquee, category grid, horizontal product rails, brand story with an animated "stitch line" signature element, auto-advancing testimonials, and a newsletter form.
- **Shop** — filterable, sortable catalog (category, tags, price range) with an empty state and live result counts. Deep-linkable by category (`#/shop/women`, `#/shop/men`, `#/shop/accessories`, `#/shop/footwear`).
- **Product detail** — gallery, size + quantity selection with validation, animated "add to bag" feedback, tabbed details/shipping/care info, and a related-products rail.
- **Cart** — quantity steppers, line removal, a working promo code (`LUXORA10`), and a live order summary (subtotal, discount, shipping, tax, total).
- **Checkout** — multi-section form with inline validation and a simulated order-confirmation screen with a generated order number.
- **Slide-out cart drawer** and toast notifications for quick add-to-bag feedback from anywhere on the site.
- 36 demo products across 4 categories, each illustrated with hand-built duotone SVG line art instead of stock photography — fully original, no licensing concerns.
- Scroll-triggered reveal animations, a nav bar that solidifies on scroll, and a responsive layout down to mobile.

## 🗂 Structure

```
luxora/
├── index.html          # App shell: nav, view containers, footer, cart drawer
├── css/
│   └── styles.css      # Design tokens, components, animations, responsive rules
├── js/
│   ├── products.js     # Product data + inline SVG icon library
│   └── app.js          # Hash router, rendering, cart/checkout logic, animations
└── README.md
```

## 🎨 Design system

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1c1512` | Primary text, dark sections |
| `--ivory` | `#f6f1e7` | Background |
| `--plum` | `#33202b` | Hero / accent dark panels |
| `--gold` | `#b68a4e` | Accent, CTAs, highlights |
| `--blush` | `#e3c9c0` | Secondary soft accent |

Typography pairs **Bodoni Moda** (editorial display serif) with **Jost** (clean geometric sans), loaded from Google Fonts.

## ▶️ Running locally

No build tools required. Either:

1. Open `index.html` directly in a browser, or
2. Serve it locally for the best experience:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```

## 🚀 Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the source to the `main` branch, root directory.
4. Your store will be live at `https://<username>.github.io/<repo>/`.

## 🧠 Implementation notes

- **State is in-memory only** (no `localStorage`) — the cart persists across "pages" because the whole app is a single HTML document with client-side hash routing (`#/`, `#/shop`, `#/product/:id`, `#/cart`, `#/checkout`, `#/about`); it resets on a full page reload, by design for this demo.
- All product imagery is original inline SVG line art rendered on duotone gradient cards — no external images, no copyright concerns.
- Fully responsive, with a mobile nav, stacked layouts, and touch-friendly filters below 680px.

---

Built as a UI/UX and front-end animation showcase. Feel free to fork, restyle, or wire up a real backend.
