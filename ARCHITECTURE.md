Project architecture (fullstack)

Root files:
- `package.json`, `README.md`, `.env.example`

Frontend:
- `public/` — static assets
- `src/` — frontend source
  - `src/pages/` — route pages
  - `src/components/` — reusable UI components
  - `src/layouts/` — layout components
  - `src/styles/` — global styles and tokens
  - `src/assets/` — images, icons, fonts
  - `src/lib/` — low-level clients (e.g., `supabaseClient.ts`)
  - `src/services/` — business logic and data access
  - `src/hooks/` — custom hooks
  - `src/store/` — global state
  - `src/utils/` — helpers
  - `src/types/` — TypeScript types
  - `src/api/` — frontend API adapters / serverless functions

Backend (server):
- `server/`
  - `server/package.json` — backend npm manifest
  - `server/src/` — backend source
    - `server/src/index.js` — server entry (Express)
    - `server/src/routes/` — API route handlers
  - `server/migrations/` — DB migrations

Database:
- `db/` — schema, seeds, and DB docs

Infra & docs:
- `infra/` — IaC (optional)
- `docs/` — architecture and API specs

Notes:
- Keep low-level SDKs in `src/lib/` and business logic in `src/services/`.
- Use `.env.example` for required env vars; do NOT commit secrets.
- For monorepo-like workflows, the frontend and backend can have separate `package.json` files and independent scripts.
