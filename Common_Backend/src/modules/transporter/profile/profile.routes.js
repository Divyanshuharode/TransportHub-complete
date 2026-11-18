const express = require("express");
const { getProfile, updateProfile } = require("./profile.controller");
const connection = require("../../../config/db");

const router = express.Router();
router.get("/api/transporter/profile", getProfile);
router.patch("/api/transporter/profile", updateProfile);
router.get("/api/transporter/settings", (req, res, next) => connection.query("SELECT setting_key, setting_value FROM app_settings WHERE owner_type = 'TRANSPORTER' AND owner_id = ?", [req.transporterId], (err, rows) => err ? next(err) : res.json({ success: true, data: rows })));
router.put("/api/transporter/settings", (req, res, next) => {
    const allowed = ["bookingAlerts", "paymentAlerts", "weeklySummary", "publicProfile"];
    const entries = Object.entries(req.body || {});
    if (entries.some(([key, value]) => !allowed.includes(key) || typeof value !== "boolean")) return res.status(400).json({ success: false, message: "Settings must contain supported boolean values" });
    if (!entries.length) return res.status(400).json({ success: false, message: "No settings provided" });
    const statement = "INSERT INTO app_settings (owner_type, owner_id, setting_key, setting_value) VALUES ('TRANSPORTER', ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)";
    let remaining = entries.length;
    let failed = false;
    for (const [key, value] of entries) connection.query(statement, [req.transporterId, key, JSON.stringify(value)], (err) => {
        if (failed) return;
        if (err) { failed = true; return next(err); }
        remaining -= 1;
        if (!remaining) res.json({ success: true, message: "Settings saved" });
    });
});
module.exports = router;
