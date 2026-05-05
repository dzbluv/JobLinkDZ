Project Architecture (Fullstack)

Root Files:
- `package.json`, `README.md`, `.env.example`, `.gitignore`

Frontend (`src/`):
- `public/` — static assets
- `src/` — React application source
  - `src/pages/` — Route-level page components
  - `src/components/` — Reusable UI components (admin, dashboard, layout, ui)
  - `src/context/` — React Context providers (Auth, Theme, i18n)
  - `src/lib/` — Low-level client initializations (Supabase)
  - `src/services/` — API layer and business logic
  - `src/locales/` — Internationalization JSON files (EN, FR, AR)
  - `src/data/` — Mock data and TypeScript interfaces
  - `src/index.css` — Global styles, Tailwind directives, and design tokens

Backend (`server/`):
- `server/` — Express.js API server
  - `server/src/index.js` — Server entry point
  - `server/src/routes/` — API route handlers (admin, users)
  - `server/package.json` — Backend dependencies

Database (`supabase/`):
- `supabase/migrations/` — SQL migration files (schema, profile fields, RLS fixes)

Infra & Docs:
- `docs/` — Specifications and implementation plans
- `tests/` — End-to-end testing suite (Playwright)
- `vercel.json` — Frontend deployment configuration

Notes:
- Keep low-level SDKs in `src/lib/` and business logic in `src/services/`.
- Use `.env.example` for required env vars; do NOT commit secrets.
- The project uses `concurrently` to run both frontend (Vite) and backend (Express) during development.
