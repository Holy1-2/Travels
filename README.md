# Hamubere Travels

A full-stack Rwanda travel and booking site built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS** and **SQLite** (`better-sqlite3`).

Guests can browse handpicked stays and experiences, book in the app, pay with MTN MoMo, Airtel Money or a card through Flutterwave, and manage their booking. Admins get a separate panel for bookings, content, host requests and payments.

## Getting started

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The SQLite database is created automatically at `data/hamubere.db` and seeded with the original demo content on first run.

### Requirements

- Node.js 20+ (tested on Node 24)
- npm
- Python / build tools only if `better-sqlite3` needs to compile on your machine (prebuilt binaries are normally used)

## Environment

All variables are optional in development. See `.env.example` for the full list.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` / `SITE_URL` | Public base URL used for metadata and payment redirects. |
| `HAMUBERE_DATA_DIR` | Where the SQLite file lives (default `./data`). |
| `HAMUBERE_DATABASE_PATH` | Full path to the database file, if you prefer. |
| `FLUTTERWAVE_SECRET_KEY` | Enables live Flutterwave payments. Blank = sandbox mode. |
| `FLUTTERWAVE_WEBHOOK_HASH` | Secret hash from the Flutterwave webhook settings. |
| `PAYMENTS_SANDBOX` | Set `true` to force test mode, `false` to force live mode. |
| `ADMIN_PASSWORD` | Admin panel password. Required in production. |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the admin session cookie. |

Without a Flutterwave key, checkout runs in **sandbox mode**: the guest can start a payment and confirm it with a clearly labelled “test payment” button. No money moves. Add a key to switch to real card and mobile-money charges.

## Admin panel

- Sign in at `/admin/login`.
- In development the fallback password is `hamubere-admin`.
- In production set `ADMIN_PASSWORD` (and ideally `ADMIN_SESSION_SECRET`).
- Sessions are HttpOnly, signed and expire after 8 hours.

The panel covers:

- **Overview** — revenue, bookings, content counts, recent activity, payment mode.
- **Bookings** — filter, open a booking, change booking/payment status, add an internal note, inspect payment attempts and the activity log.
- **Stays** and **Experiences** — create, edit and delete DB-backed listings. Changes appear on the public site immediately.
- **Host requests** — review property submissions from `/list-property` and set their status.
- **Demo content** — clear the seeded sample stays/experiences when your own content is ready, or restore them later.

## How booking and payment work

1. A guest chooses dates on a stay or experience page and continues to `/checkout`.
2. `POST /api/bookings` quotes the price **on the server** and creates a pending booking. Dates are held for 30 minutes.
3. `POST /api/bookings/[reference]/pay` starts a payment:
   - **Sandbox** — returns a payment id that can be confirmed through `/api/payments/[reference]/confirm`.
   - **Mobile money** — charges MTN MoMo / Airtel Money and waits for the phone prompt.
   - **Card** — redirects to the hosted Flutterwave checkout.
4. Payments are only marked paid after the provider is verified, either by redirect verification or by the signed webhook.
5. The guest lands on `/bookings/[reference]` to see status, retry payment, print or cancel.

Prices are never trusted from the client. Service fees are applied server-side (5% for stays, 3% for experiences).

### Flutterwave setup

1. Add `FLUTTERWAVE_SECRET_KEY` to your environment.
2. Register the webhook URL `https://your-domain.com/api/webhooks/flutterwave` in the Flutterwave dashboard and copy the secret hash into `FLUTTERWAVE_WEBHOOK_HASH`.
3. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS URL so card redirects return to the right host.
4. Test with a Flutterwave test key first, then switch to live keys.

## API surface

Public:

- `POST /api/bookings` — create a booking
- `GET /api/bookings/[reference]` — booking status
- `POST /api/bookings/[reference]/cancel` — cancel an unpaid booking
- `GET /api/bookings/lookup?reference=&email=` — guest lookup
- `POST /api/bookings/[reference]/pay` — start a payment
- `POST /api/payments/[reference]/confirm` — sandbox confirmation only
- `GET /api/availability` — booked dates/ranges
- `POST /api/listing-requests` — host property submission
- `GET /api/health` — database + payment mode health check

Payment callbacks:

- `GET /api/payments/callback` — card redirect verification
- `POST /api/webhooks/flutterwave` — signed webhook with provider verification

Admin (cookie protected):

- `POST /api/admin/login`, `POST /api/admin/logout`
- `GET /api/admin/stats`
- `GET|POST /api/admin/stays`, `GET|PUT|DELETE /api/admin/stays/[slug]`
- `GET|POST /api/admin/experiences`, `GET|PUT|DELETE /api/admin/experiences/[slug]`
- `GET /api/admin/bookings`, `GET|PATCH /api/admin/bookings/[reference]`
- `GET|PATCH /api/admin/listing-requests`
- `POST /api/admin/content?action=clear|restore`

## Data and content

- Regions stay a static taxonomy in `lib/data.ts`.
- Stays and experiences live in SQLite (`stays`, `experiences`) and are managed from the admin panel.
- The original site content is seeded once with `is_demo = 1`. Clearing demo content removes only those rows; content created in the admin panel is untouched.
- `content_meta.demo_seeded` prevents cleared demo content from reappearing on restart.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # lint
```

## Deployment notes

- Use a Node.js host (Vercel, Railway, Fly.io, a VPS) so `better-sqlite3` can persist its file.
- Mount a persistent volume for `data/` (or point `HAMUBERE_DATA_DIR` at one). Serverless filesystems are ephemeral.
- Set all production environment variables, especially `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `FLUTTERWAVE_SECRET_KEY` and `FLUTTERWAVE_WEBHOOK_HASH`.
- The in-memory rate limiter is per process; use Redis/Upstash for multi-instance deployments.
