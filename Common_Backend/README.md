# TransportHub backend

## Database setup

1. Create the database/tables by running `database/schema.sql` with MySQL 8.0 or later. The script creates and selects `TransportHub_Complete`.
2. Copy `.env.example` to `.env` and enter the MySQL username/password and a long random `JWT_SECRET`.
3. Run `npm install`, then `npm start` from this folder. The server uses port 5000 by default.

Example using the MySQL command-line client:

```powershell
mysql -u root -p < database/schema.sql
```

Never commit `.env` or production credentials.

## Core API areas

- Admin authentication, users, roles, customers, transporters, vehicles and bookings.
- Customer registration/login, profile, booking requests and booking reviews.
- Transporter registration/login, vehicles, drivers, booking requests, status history and payouts.

The app uses MySQL transactions for assignment/status changes and stores review ratings separately from booking state.
