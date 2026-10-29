# AL YOUNUS Trading and Services

A Next.js storefront and admin-system foundation for hygiene, cleaning and sanitation supplies.

## Run locally

1. Install Node.js 20 or newer.
2. Download the repository ZIP from GitHub and extract it, or clone the repository.
3. Open the extracted project root in VS Code (the folder containing `package.json` and `app/`).
4. Run `npm install`.
5. Copy `.env.example` to `.env` and fill in the values described below.
6. Create a PostgreSQL database with a provider of your choice and put its connection string in `DATABASE_URL`.
7. Set `AUTH_SECRET` to a unique random string of at least 32 characters.
8. Set a private `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters.
9. Run `npm run db:format`, `npm run db:generate`, and `npm run db:push`.
10. Run `npm run db:seed` to create the first administrator.
11. Run `npm run dev` and open `http://localhost:3000`.
12. Open `http://localhost:3000/admin/login` and sign in using the values used to seed the admin.

## Security and secrets

- Keep `.env` private; never commit it, upload it to GitHub, or share its secrets.
- `.env.example` contains placeholders only.
- The login route stores passwords as bcrypt hashes and issues an HTTP-only, eight-hour signed session cookie.
- Admin pages and admin API routes require a valid session.
- Use HTTPS, backups, least-privilege database credentials and a secret manager in production.
- Rotate any credential that has accidentally been exposed.

## Implemented foundation

- Responsive storefront, sample product cards and WhatsApp enquiry links.
- PostgreSQL Prisma schema for users/roles, categories, products and images, customers, leads/follow-ups, orders/items, site settings and audit logs.
- Prisma client singleton and database setup scripts.
- Admin login/logout endpoints, protected admin routes and an environment-driven administrator seed script.
- Authenticated product list/create/update/delete API endpoints.
- Admin product management screen for creating and listing products and deleting products.
- Responsive styling for the product form.

## Still to finish before production

- Configure a real PostgreSQL service and verify schema generation/migration against it.
- Complete edit UX, image storage integration, category management, customer/lead workflows, follow-up reminders, order processing, sales reports, site settings and audit-log writes.
- Add rate limiting, CSRF review for mutations, account recovery, session revocation, tests, monitoring and backups.
- Run a full production build and security review.
- Configure hosting, domain, HTTPS and production environment variables.

The admin login and database features cannot work until PostgreSQL and the private environment variables are configured. Do not enter real customer data until deployment and security testing are complete.
