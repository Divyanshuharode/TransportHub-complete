const express = require("express");
const customerAuthMiddleware = require("../../../middleware/customerAuthMiddleware");
const { listMyBookings, getBookingHistory, createBooking, cancelBooking, addReview } = require("./booking.controller");

const router = express.Router();
router.get("/api/customer/bookings", customerAuthMiddleware, listMyBookings);
router.get("/api/customer/bookings/:booking_id/history", customerAuthMiddleware, getBookingHistory);
router.post("/api/customer/bookings", customerAuthMiddleware, createBooking);
router.patch("/api/customer/bookings/:booking_id/cancel", customerAuthMiddleware, cancelBooking);
router.post("/api/customer/bookings/:booking_id/review", customerAuthMiddleware, addReview);
module.exports = router;
