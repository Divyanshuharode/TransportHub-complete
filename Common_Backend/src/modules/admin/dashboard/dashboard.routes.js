const express = require("express");

const dashboardRouter = express.Router();

const { getTrans, totalBooking, getDashboardSummary } = require("./dashboard.controller");

dashboardRouter.get("/api/admin/dashboard", getDashboardSummary);
dashboardRouter.post("/allTrans", getTrans);
dashboardRouter.post("/allBookings", totalBooking);

module.exports = dashboardRouter;
