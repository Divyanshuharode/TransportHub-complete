const generateUUID = require("../../../utility/uuid");
const bookings = require("../../shared/booking.model");

const listMyBookings = (req, res, next) => { bookings.listCustomerBookings(req.customerId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows })); };
const getBookingHistory = (req, res, next) => { bookings.getBookingHistory(req.params.booking_id, req.customerId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows })); };

async function createBooking(req, res, next) {
    const { pickup_location, delivery_location, goods_type, weight_tonnes, vehicle_type, pickup_date, customer_note } = req.body;
    if (![pickup_location, delivery_location, goods_type, vehicle_type, pickup_date].every((value) => typeof value === "string" && value.trim()) || Number(weight_tonnes) <= 0 || !Number.isFinite(Number(weight_tonnes))) {
        return res.status(400).json({ success: false, message: "Enter pickup, delivery, goods, positive weight, vehicle and pickup date" });
    }
    if (Number.isNaN(Date.parse(pickup_date)) || pickup_date < new Date().toISOString().slice(0, 10)) return res.status(400).json({ success: false, message: "Pickup date must be today or later" });
    try {
        const id = generateUUID();
        const booking = await bookings.createCustomerBooking({ booking_id: id, booking_number: `TH-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`, customer_id: req.customerId, pickup_location: pickup_location.trim(), delivery_location: delivery_location.trim(), goods_type: goods_type.trim(), weight_tonnes: Number(weight_tonnes), vehicle_type: vehicle_type.trim(), pickup_date, customer_note });
        res.status(201).json({ success: true, message: "Booking request created", data: booking });
    } catch (error) { next(error); }
}

async function cancelBooking(req, res, next) {
    try {
        const result = await bookings.cancelCustomerBooking(req.params.booking_id, req.customerId, req.body.reason);
        if (result.notFound) return res.status(404).json({ success: false, message: "Booking not found" });
        if (result.invalidStatus) return res.status(409).json({ success: false, message: `Booking cannot be cancelled from ${result.invalidStatus}` });
        res.json({ success: true, message: "Booking cancelled" });
    } catch (error) { next(error); }
}

async function addReview(req, res, next) {
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || (req.body.review_text && req.body.review_text.length > 1000)) return res.status(400).json({ success: false, message: "Rating must be 1–5 and review text must be at most 1000 characters" });
    try {
        const result = await bookings.createReview(req.params.booking_id, req.customerId, { review_id: generateUUID(), rating, review_text: req.body.review_text?.trim() || null });
        if (result.notFound) return res.status(404).json({ success: false, message: "Booking not found" });
        if (result.notDelivered) return res.status(409).json({ success: false, message: "Only delivered bookings can be reviewed" });
        res.status(201).json({ success: true, message: "Review submitted" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "This booking already has a review" });
        next(error);
    }
}

module.exports = { listMyBookings, getBookingHistory, createBooking, cancelBooking, addReview };
