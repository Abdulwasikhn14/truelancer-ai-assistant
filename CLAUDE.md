# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (localhost:5200)
npm run build      # production build
npm run preview    # preview production build
```

## Tech Stack

- **Vite** + **React** (JSX)
- **TailwindCSS v3** — dark mode via `class` strategy; base dark background `#0a0a0f`
- **Framer Motion** — animations
- **React Router DOM** — client-side routing
- **Lucide React** — icons
- **Axios** — HTTP client (configured instance at `src/services/api.js`)

## Architecture

**Routing** — all routes defined in [src/App.jsx](src/App.jsx), wrapped in `BrowserRouter` and `AuthProvider`.

**Auth** — [src/context/AuthContext.jsx](src/context/AuthContext.jsx) provides `{ user, login, logout }` via `useAuth()` hook. Token storage is in `localStorage`.

**API layer** — [src/services/api.js](src/services/api.js) exports a pre-configured Axios instance that automatically attaches the Bearer token from localStorage. Set `VITE_API_URL` in `.env` to override the base URL (default: `http://localhost:3000/api`).

**Page routes:**

| Path | Component |
|---|---|
| `/` | `pages/Landing.jsx` |
| `/login` | `pages/Login.jsx` |
| `/signup` | `pages/Signup.jsx` |
| `/dashboard` | `pages/dashboard/Dashboard.jsx` |
| `/dashboard/proposals` | `pages/dashboard/Proposal.jsx` |
| `/dashboard/messages` | `pages/dashboard/Messages.jsx` |
| `/dashboard/gigs` | `pages/dashboard/Gig.jsx` |
| `/dashboard/chatbot` | `pages/dashboard/Chatbot.jsx` |
| `/dashboard/pricing` | `pages/dashboard/Pricing.jsx` |
| `/dashboard/history` | `pages/dashboard/History.jsx` |
| `/dashboard/analytics` | `pages/dashboard/Analytics.jsx` |

**Component organization:**
- `src/components/ui/` — reusable UI primitives (buttons, inputs, modals, etc.)
- `src/components/layout/` — layout wrappers (navbar, sidebar, dashboard shell, etc.)
- `src/hooks/` — custom React hooks
- `src/context/` — React context providers
