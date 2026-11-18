const dotenv = require("dotenv");
dotenv.config();

const connection = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing required .env values: ${missing.join(", ")}`);

connection.getConnection((error, db) => {
    if (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
    db.release();
    app.listen(PORT, () => console.log(`TransportHub API listening on port ${PORT}`));
});
