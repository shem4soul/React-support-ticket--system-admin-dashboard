# Support Ticket System — Admin Dashboard

React + Vite + Tailwind. A login-protected dashboard for staff to view and manage
support tickets.

**Live:** _add once deployed_

## What this is

- A login screen (JWT-based session, stored in the browser)
- A ticket table with filters (status, priority), colored status badges, and an
  action menu per ticket (Mark in progress / Resolve / Close)

There's no public sign-up — admin accounts are created directly in the database via
the backend's `seed-admin.js` script. Log in with those credentials.

Talks to the backend API here: https://backend-support-ticket-system.onrender.com

## Local setup

```bash
cp .env.example .env   # set VITE_API_URL — see below
npm install
npm run dev              # usually http://localhost:5173 or :5174
```

### Environment variables
VITE_API_URL=https://backend-support-ticket-system.onrender.com/api

For local backend testing instead, use `http://localhost:5000/api`.

> Vite bakes `VITE_API_URL` into the built files at **build time**, not runtime —
> changing it requires a fresh `npm run build` (or a new deploy) to take effect.

## Build

```bash
npm run build     # outputs to dist/
```

## Deploying (Netlify)

1. New site on Netlify, connect this repo
2. Build command: `npm run build` · Publish directory: `dist`
3. Environment variable: `VITE_API_URL=https://backend-support-ticket-system.onrender.com/api`
4. Deploy

After deploying, make sure this site's URL is added to `CORS_ORIGIN` on the backend
(Render), with no trailing slash — otherwise login and ticket-loading requests will
fail with a CORS error in the browser console.
