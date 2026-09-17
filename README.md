# My Project

A minimal React + Vite app set up to run inside an Alloy session via Docker.

## Structure

- `src/` — React app (`App.jsx`, `main.jsx`, `index.css`)
- `docker-compose.alloy.yaml` — the checked-in Alloy Docker Compose setup
- `.alloy/environment.json` — tells Alloy where the compose file is and which port the frontend uses
- `vite.config.js` — Vite config (dev server pinned to `0.0.0.0:3000`)

## Run with Docker

```sh
docker compose -f docker-compose.alloy.yaml up -d
```

The frontend listens on port `3000`.

## Run locally

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

## Requirements

- Node 18+
- Docker (for the Alloy compose setup)