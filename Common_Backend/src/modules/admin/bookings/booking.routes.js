const express = require("express");
const { getBookings, getReviews, updateBookingStatus } = require("./booking.controller");

const router = express.Router();
router.get("/api/admin/bookings", getBookings);
router.get("/api/admin/reviews", getReviews);
router.patch("/api/admin/bookings/:booking_id/status", updateBookingStatus);
module.exports = router;
