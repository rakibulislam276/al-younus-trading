# AL YOUNUS Trading and Services

A Next.js storefront starter for hygiene, cleaning and sanitation supplies.

## Run locally

1. Install Node.js 20 or newer.
2. Download the repository ZIP or clone this repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Database foundation added

- `prisma/schema.prisma`: PostgreSQL data model for users and roles, categories, products and images, customers, leads and follow-ups, orders and order items, site settings, and audit logs.
- `lib/prisma.ts`: Prisma Client singleton.
- `.env.example`: environment-variable template.
- Database scripts: `npm run db:format`, `npm run db:generate`, `npm run db:push`, and `npm run db:studio`.

## Connect PostgreSQL

1. Create a PostgreSQL database with your chosen provider.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to your provider's connection string.
4. Run `npm run db:format`, then `npm run db:generate`, and `npm run db:push`.

Never commit your real `.env` file, database password, or authentication secrets.

## Current implementation status

- Responsive storefront, sample product cards and WhatsApp enquiry links: included.
- Admin dashboard: visual preview only.
- PostgreSQL schema and Prisma client setup: added, but not connected to a live database yet.
- Secure admin authentication, role enforcement, database-backed product CRUD, image storage, inventory transactions, CRM workflows, orders and reports: still need implementation and testing.
- Sample product pricing is enquiry-based placeholder content.

Do not use the admin preview for real customer data until authentication, authorization, database connection, backups and production deployment have been implemented and tested.
