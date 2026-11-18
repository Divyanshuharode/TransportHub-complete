require("dotenv").config();
const bcrypt = require("bcrypt");
const connection = require("../src/config/db");

async function createAdmin() {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error("Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env");
    const db = connection.promise();
    const [roles] = await db.query("SELECT role_id FROM roles WHERE role_name = 'SUPER_ADMIN' LIMIT 1");
    if (!roles.length) throw new Error("SUPER_ADMIN role is missing; run database/schema.sql first");
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const userId = require("../src/utility/uuid")();
    const [result] = await db.query("INSERT INTO users (user_id, full_name, email, password, account_status) VALUES (?, ?, ?, ?, 'ACTIVE')", [userId, ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), password]);
    await db.query("INSERT INTO role_assign (user_id, role_id) VALUES (?, ?)", [userId, roles[0].role_id]);
    console.log(`Admin created for ${ADMIN_EMAIL}. Remove ADMIN_PASSWORD from .env after setup.`);
    return result;
}

createAdmin().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => connection.end());
