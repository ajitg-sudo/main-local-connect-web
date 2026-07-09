# India Local Connect — Frontend

Next.js (App Router) + React + Tailwind CSS (port **5173**).

## Setup

```bash
npm install
```

Optional `.env` variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:5173
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_API_ORIGIN=
```

## Run

```bash
npm run dev
```

App: http://localhost:5173

API requests proxy to `http://localhost:5000` (start backend first).

## Build

```bash
npm run build
npm start
```

## Structure

```
app/            Next.js routes (thin wrappers)
src/
  components/   Reusable UI
  context/      Auth, language, toast state
  layouts/      User, owner & admin shells
  pages/        Page components (unchanged logic)
  routes/       Protected routes
  services/     API client
  utils/        Constants & helpers
```
