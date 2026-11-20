# WedPlan — Wedding Planning Platform

WedPlan is a role-based wedding planning marketplace. Couples discover approved wedding vendors, send booking requests and track their status. Vendors publish services, manage incoming requests and upgrade to Premium for unlimited listings. Admins review services, manage users and monitor transactions.

## Important Features

- **Public**: home with animated banner, featured services, category explorer, Browse Services with search/filter/price sorting, branded footer
- **Auth**: Better Auth email/password + Google sign-in; signup with role selection (Customer/Vendor), password complexity, optional ImgBB profile photo; admin accounts are never created publicly
- **Customer**: dashboard overview, booking history with details, cancel pending requests, profile settings
- **Vendor**: dashboard with live stats, add/edit/delete services (multi-image ImgBB upload), approval status, availability controls, booking request accept/reject, free plan limit (3 active services), Premium subscription via Stripe Checkout
- **Admin**: platform overview, manage users (search/filter/block/unblock/view details), review/approve/reject/delete services, read-only transaction records
- **Security**: role checks on every dashboard and API route, blocked-user enforcement, short-lived JWT issued from verified Better Auth sessions and validated by Express middleware with ownership checks
- **Payments**: Stripe Checkout (test mode) with signature-verified webhooks; Premium activates only after a verified payment event
- **UX**: shadcn/ui, Motion animations, toasts (no browser alerts), skeleton loaders, branded 404/error states, responsive layout

## Technology Stack

Next.js 16 (App Router, Cache Components) · React 19 · JavaScript · Tailwind CSS 4 · shadcn/ui (Base UI) · Motion · Better Auth · Express.js 5 · MongoDB · JWT · Stripe · ImgBB

## Installation & Local Run

```bash
# Client
cd wed-plan
npm install
cp .env.example .env.local   # fill in the values listed below
npm run dev                  # http://localhost:3000

# Server (separate terminal)
cd wed-plan-server
npm install
cp .env.example .env         # fill in the values listed below
node index.js                # http://localhost:5000
```

Production build: `npm run build && npm run start` (client) and `node index.js` (server).

## Environment Variables

Never commit `.env`, `.env.local` or any secret value.

**Client (`wed-plan/.env.local`)**
`MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_IMGBB_API_KEY`, `JWT_SECRET`, `API_URL`, `NEXT_PUBLIC_API_URL`

**Server (`wed-plan-server/.env`)**
`PORT`, `MONGODB_URI`, `JWT_SECRET` (same value as client), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL`

Stripe webhook endpoint: `POST /api/subscription/webhook`. For local testing forward events with `stripe listen --forward-to localhost:5000/api/subscription/webhook` and use the printed webhook secret.

## Application URLs

- Home `/` · Browse Services `/services` · Sign In `/sign-in` · Sign Up `/sign-up`
- Customer `/dashboard` · Vendor `/vendor` · Admin `/admin`
- Payment result `/payment/success` · `/payment/cancel`

## Deployment Guideline

Deploy the Next.js client and the Express API separately. Set all environment variables in both hosting dashboards. Update `CLIENT_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL` and `API_URL` to the live domains. Configure CORS, Stripe webhooks and Google OAuth redirect URLs for the live domain. Verify public routes, role dashboards, reloads, and a Stripe test checkout after deployment.

## Links

- Live site: _add your deployed URL_
- Client repository: _add your client repo URL_
- Server repository: _add your server repo URL_
- Admin credentials for evaluation: _add the admin email/password you created directly in the database_

## Notes

Auth collections are managed by Better Auth. Business data lives in `user`, `services`, `bookings` and `transactions`. Legacy field names (`blocked`/`isBlocked`, `plan`/`subscriptionPlan`, `serviceImage`/`images`) are kept in sync so existing data and newer spec fields both work.
