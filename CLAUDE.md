# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint (flat config, ESLint 9+)
```

No test runner is configured.

## Stack

- **React 19** (JSX, no TypeScript)
- **Vite** with `@vitejs/plugin-react` (uses Oxc parser)
- **Tailwind CSS 3** — utility-only, no custom theme extensions
- **Lucide React** for icons
- ESLint flat config (`eslint.config.js`) — `no-unused-vars` ignores uppercase-prefixed identifiers

## Architecture

This is a **single-page festival landing/ticketing hub** for XTRAVAGANZA Festival.

```
src/
├── main.jsx                  # Entry point (StrictMode)
├── App.jsx                   # Root — renders XtravaganzaPreview
├── XtravaganzaPreview.jsx    # The entire application (single component, ~470 lines)
├── index.css                 # Tailwind directives only
└── assets/                   # Static assets (hero.png, svgs)
public/                       # Images served as-is (logos, backgrounds, butterfly PNG)
```

All product logic lives in [XtravaganzaPreview.jsx](src/XtravaganzaPreview.jsx):
- **DJ disc animation** — `requestAnimationFrame` loop rotating a disc image
- **Pulsing lights** — dynamic HSL color generation cycling through hues
- **Background switching** — alternates between two images every 5 seconds via `setInterval`
- **Ticket links** — four vendors: Tidar.ma, Ticket.ma, Shotgun.live, Eventbrite.es
- **Social links** — Instagram, TikTok, Threads
- **Meta Pixel tracking** — Facebook Conversions API events (`AddToCart`, `Lead`, `Contact`, `ViewContent`) fired on user interactions; Pixel is initialized in [index.html](index.html)

Adding a new page/section means extending `XtravaganzaPreview.jsx` or extracting parts of it into child components imported there.
