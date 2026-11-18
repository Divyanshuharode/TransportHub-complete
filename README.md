# TransportHub

Transport booking platform with customer, transporter, admin and shared Node.js/MySQL backend modules.

## Start the full stack locally

Requirements: Docker Desktop with Docker Compose.

1. Copy `.env.docker.example` to `.env` in the repository root.
2. Set unique values for `MYSQL_ROOT_PASSWORD`, `JWT_SECRET`, and the initial admin password in `.env`.
3. Start the database, API and all three web apps:

```powershell
docker compose up --build
```

Open these URLs:

- Admin: http://localhost:5173
- Customer: http://localhost:5174
- Transporter: http://localhost:5175
- API health: http://localhost:5000/api/health
- Database health: http://localhost:5000/api/health/database

The schema in `Common_Backend/database/schema.sql` is loaded automatically when the MySQL volume is first initialized. To create the first admin user, open a second terminal in the repository root and run `docker compose exec backend npm run create-admin`. The login details come from the root `.env` file.

Stop the stack with `Ctrl+C`, then `docker compose down`. The named database volume keeps the database between restarts.

## Run against an existing local MySQL server

Run `Common_Backend/database/schema.sql` once in MySQL Workbench or with `mysql -u root -p < Common_Backend/database/schema.sql`. Copy `Common_Backend/.env.example` to `Common_Backend/.env`, enter the database credentials and a long `JWT_SECRET`, then start the backend from `Common_Backend` with `npm install` and `npm run dev`.

For the web apps, run `npm install` and `npm run dev` from each of `Admin-Module`, `Customer-module`, and `Transporter-Module`. Each Vite terminal prints the URL to open.

## Main tables

The schema includes admin users and roles, customers, transporters, vehicles, drivers, bookings, booking status history, transporter booking responses, reviews, payments, transporter documents and account settings. Reviews are limited to one per delivered booking and can only be submitted by that booking's customer.

## Production deployment

The Compose setup is for local full-stack development. A public deployment still needs a production MySQL instance, HTTPS domain/origins, secure secrets, and hosting for the API and frontends. Set `COOKIE_SECURE=true` and `FRONTEND_ORIGINS` to the deployed HTTPS URLs in production; do not use the example passwords or commit `.env` files.

Some modules still need a payment-gateway integration and live GPS/location provider before those external services can be used in production.
