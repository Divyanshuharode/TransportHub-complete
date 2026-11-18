const jwt = require("jsonwebtoken");
const connection = require("../config/db");

async function adminAuthMiddleware(req, res, next) {
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ success: false, message: "Admin login required" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await connection.promise().query(`SELECT u.user_id, u.email, u.account_status, r.role_name
            FROM users u JOIN role_assign ra ON ra.user_id = u.user_id JOIN roles r ON r.role_id = ra.role_id
            WHERE u.user_id = ? AND r.role_name IN ('SUPER_ADMIN','ADMIN','OPERATIONS')`, [decoded.user_id]);
        if (!rows.length || rows[0].account_status.toUpperCase() !== "ACTIVE") return res.status(403).json({ success: false, message: "Admin access is not enabled for this account" });
        req.admin = rows[0];
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Invalid or expired admin session" });
        next(error);
    }
}

module.exports = adminAuthMiddleware;
