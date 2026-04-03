# GitLore Backend

Hono + MongoDB API, merged in small PRs. This commit adds protected repository REST helpers (`/api/repo/*`, `/api/repos/*`), guardrails, and narrate (placeholder).

Earlier PRs in this stack: foundation (`/health`, `/test/*`) and GitHub OAuth (`/auth/*`). Next PR adds analyze, explain, and search (Gemini).

## Run

```bash
cd Backend
npm install
cp .env.example .env
```

Configure OAuth and MongoDB as in `.env.example`. With a valid session cookie, `GET /api/repo/:owner/:name` and related routes are available.
