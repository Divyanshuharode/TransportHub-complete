const express = require("express");

const adminAuthRoutes = express.Router();

const { loginAdmin } = require("./auth.controller");
const adminAuthMiddleware = require("../../../middleware/adminAuthMiddleware");

adminAuthRoutes.post("/login", loginAdmin);
adminAuthRoutes.get("/api/admin/me", adminAuthMiddleware, (req, res) => res.json({ success: true, data: { user_id: req.admin.user_id, email: req.admin.email } }));
adminAuthRoutes.post("/api/admin/logout", (req, res) => res.clearCookie("adminToken", { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", path: "/" }).json({ success: true }));

module.exports = adminAuthRoutes;
