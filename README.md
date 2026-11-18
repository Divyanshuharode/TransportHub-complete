# TransportHub

Transport booking platform with separate customer, transporter and admin frontends, plus a shared Express/MySQL backend.

## Frontend apps

For each frontend, open a terminal in its folder, then run `npm install` and `npm run dev`:

- `Customer-module`
- `Transporter-Module`
- `Admin-Module`

## Backend

Configure the MySQL connection and `JWT_SECRET` in `Common_Backend/.env`, then run `npm install` and `npm start` from `Common_Backend`.

Some customer and transporter screens currently use browser local storage and sample data; their database-backed endpoints still need implementation.