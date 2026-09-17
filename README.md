# My Project

A React + Vite frontend with a Node + Express API, set up to run inside an
Alloy session via Docker.

## Structure

- `src/` — React frontend (`App.jsx`, `main.jsx`, `index.css`)
- `api/` — Node + Express backend (`server.js`)
- `docker-compose.alloy.yaml` — the checked-in Alloy Docker Compose setup (`api` + `web` services)
- `.alloy/environment.json` — tells Alloy where the compose file is and which port the frontend uses
- `vite.config.js` — Vite config (dev server pinned to `0.0.0.0:3000`, proxies `/api` to the backend)

## Run with Docker

```sh
docker compose -f docker-compose.alloy.yaml up -d
```

- Frontend (Vite): http://localhost:3000
- API (Express): http://localhost:4000

The frontend calls the API through a Vite proxy at `/api/*`.

## Run locally

```sh
npm install
npm run dev
```

In another terminal:

```sh
cd api && npm install && npm run dev
```

Then open http://localhost:3000.

## API

| Method | Path         | Description                       |
| ------ | ------------ | --------------------------------- |
| GET    | `/api/health` | Health/status of the API service  |
| GET    | `/api/count` | Current server-side counter       |
| POST   | `/api/count` | Increment the server-side counter |

## Requirements

- Node 18+
- Docker (for the Alloy compose setup)