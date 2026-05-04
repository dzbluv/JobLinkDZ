# JobLinkDZ — Frontend (mock) + Backend skeleton

This repo contains a React + Vite frontend scaffold and a simple Express backend (mock).

Quick start:

```bash
# from repo root
npm install
npm run dev
```

What to expect:
- Frontend runs on Vite (http://localhost:3000)
- Backend runs on Express (http://localhost:4000)

Notes:
- Supabase integration is prepared in `src/lib/supabaseClient.ts` but not called.
- Mock data and services live in `src/data` and `src/services`.
- Authentication is mocked via `src/context/AuthContext.jsx`.

Next steps:
- Wire real Supabase calls in `src/services/api.js` and `src/lib/supabaseClient.ts`.
- Add file upload flow using Supabase Storage.
