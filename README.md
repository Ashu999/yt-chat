# Youtube Chat

Get Answers from a Youtube video with references.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.13 or higher)
- **uv** (Python package manager) - Install from [uv docs](https://docs.astral.sh/uv/)

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start the server (FastAPI):**
   ```bash
   npm run dev:server
   ```
   Server runs at http://127.0.0.1:8000

3. **Start the client (React/Vite) in a new terminal:**
   ```bash
   npm run dev:client
   ```
   Client runs at http://localhost:3000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:server` | Start FastAPI server with hot reload |
| `npm run dev:client` | Start React client with Vite dev server |
| `npm run install:all` | Install dependencies for root, client, and server |
| `npm run lint` | Lint both client (Biome) and server (Ruff) |
| `npm run format` | Format both client and server code |

## Project Structure

```
yt-chat/
├── client/          # React frontend (Vite + TanStack Router)
├── server/          # FastAPI backend (Python)
├── package.json     # Root development scripts
└── README.md        # This file
```

## Development Workflow

1. Run both services in separate terminals for full-stack development
2. The server uses `uv run` which automatically handles Python virtual environment
3. Client hot-reloads on changes via Vite
4. Server hot-reloads on changes via FastAPI dev mode