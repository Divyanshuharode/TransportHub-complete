const express = require("express");
const { getDashboard, getReports, getPayments, listRequests, listMyBookings, listReviews, respondToRequest, updateStatus } = require("./booking.controller");

const router = express.Router();
router.get("/api/transporter/booking-requests", listRequests);
router.get("/api/transporter/bookings", listMyBookings);
router.get("/api/transporter/reviews", listReviews);
router.patch("/api/transporter/bookings/:booking_id/respond", respondToRequest);
router.patch("/api/transporter/bookings/:booking_id/status", updateStatus);
module.exports = router;
router.get("/api/transporter/dashboard", getDashboard);
router.get("/api/transporter/reports", getReports);
router.get("/api/transporter/payments", getPayments);
