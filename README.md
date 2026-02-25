ForgeHub — Prototype GitHub Alternative

This repo is a minimal, local prototype for a GitHub-like service ("ForgeHub"). It includes:
- `api/` — Node.js + Express backend (simple JSON file DB, file uploads, auth via JWT)
- `web/` — React + Vite frontend with a flashy UI

Quick start (requires Node.js >= 18):

1. Install backend deps and start API

```bash
cd api
npm install
npm start
```

2. Install frontend deps and run dev server

```bash
cd web
npm install
npm run dev
```

The API runs on http://localhost:4000 and the web UI on http://localhost:5173 by default.

Notes & next steps:
- This is a prototype intended for local experimentation. Real git hosting, CI, and secure production settings are not implemented.
- Next: add git push/pull support, CI runner, advanced search, AI code reviews, containerized ephemeral previews.
