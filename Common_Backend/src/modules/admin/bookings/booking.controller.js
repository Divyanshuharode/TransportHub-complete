const bookingModel = require("./booking.model");
const bookingRepository = require("../../shared/booking.model");

function getBookings(req, res, next) {
    const status = req.query.status ? String(req.query.status).toUpperCase() : null;
    const validStatuses = ["PENDING", "ACCEPTED", "REJECTED", "CONFIRMED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid booking status filter" });
    bookingModel.listAdminBookings(status, (err, rows) => err ? next(err) : res.json({ success: true, data: rows }));
}

const getReviews = (req, res, next) => { bookingRepository.getAdminReviews((err, rows) => err ? next(err) : res.json({ success: true, data: rows })); };

async function updateBookingStatus(req, res, next) {
    const status = String(req.body.status || "").toUpperCase();
    try {
        const result = await bookingModel.updateAdminBookingStatus(req.params.booking_id, status, req.body.note);
        if (result.notFound) return res.status(404).json({ success: false, message: "Booking not found" });
        if (result.invalidStatus) return res.status(409).json({ success: false, message: `Cannot change booking from ${result.invalidStatus} to ${status}` });
        res.json({ success: true, message: "Booking status updated" });
    } catch (error) { next(error); }
}

module.exports = { getBookings, getReviews, updateBookingStatus };
