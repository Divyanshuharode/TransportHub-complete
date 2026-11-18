const bookings = require("../../shared/booking.model");
const connection = require("../../../config/db");

function getDashboard(req, res, next) {
    const transporterId = req.transporterId;
    Promise.all([
        connection.promise().query("SELECT status, COUNT(*) AS count FROM bookings WHERE transporter_id = ? GROUP BY status", [transporterId]),
        connection.promise().query("SELECT COUNT(*) AS totalVehicles, COALESCE(SUM(status = 'AVAILABLE'), 0) AS availableVehicles FROM vehicles WHERE transporter_id = ?", [transporterId]),
        connection.promise().query("SELECT COUNT(*) AS totalDrivers FROM drivers WHERE transporter_id = ? AND status = 'ACTIVE'", [transporterId]),
        connection.promise().query("SELECT COALESCE(SUM(amount), 0) AS totalEarnings FROM payments WHERE transporter_id = ? AND status = 'PAID'", [transporterId]),
        connection.promise().query(`SELECT b.booking_id, b.booking_number, b.pickup_location, b.delivery_location, b.status, b.amount, c.customer_name
            FROM bookings b JOIN customers c ON c.customer_id = b.customer_id WHERE b.transporter_id = ? ORDER BY b.created_at DESC LIMIT 5`, [transporterId])
    ]).then(([[statuses], [vehicles], [drivers], [earnings], [recent]]) => res.json({ success: true, data: { statuses, vehicles: vehicles[0], drivers: drivers[0], earnings: earnings[0], recent } })).catch(next);
}

function getReports(req, res, next) {
    connection.promise().query(`SELECT DATE_FORMAT(b.created_at, '%Y-%m') AS month, COUNT(DISTINCT b.booking_id) AS trips,
        COALESCE(SUM(CASE WHEN p.status = 'PAID' THEN p.amount ELSE 0 END), 0) AS revenue
        FROM bookings b LEFT JOIN payments p ON p.booking_id = b.booking_id
        WHERE b.transporter_id = ? AND b.created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
        GROUP BY DATE_FORMAT(b.created_at, '%Y-%m') ORDER BY month`, [req.transporterId])
        .then(([rows]) => res.json({ success: true, data: rows })).catch(next);
}

function getPayments(req, res, next) {
    Promise.all([
        connection.promise().query(`SELECT COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) AS totalPaid,
            COALESCE(SUM(CASE WHEN status IN ('PENDING','PROCESSING') THEN amount ELSE 0 END), 0) AS processingAmount,
            COUNT(DISTINCT CASE WHEN status = 'PAID' THEN booking_id END) AS paidTrips FROM payments WHERE transporter_id = ?`, [req.transporterId]),
        connection.promise().query(`SELECT p.payment_id, p.booking_id, b.booking_number, b.pickup_location, b.delivery_location,
            p.amount, p.currency, p.status, p.paid_at, p.created_at FROM payments p JOIN bookings b ON b.booking_id = p.booking_id
            WHERE p.transporter_id = ? ORDER BY p.created_at DESC LIMIT 100`, [req.transporterId])
    ]).then(([[summary], [rows]]) => res.json({ success: true, data: { summary: summary[0], payments: rows } })).catch(next);
}

function listReviews(req, res, next) {
    bookings.listTransporterReviews(req.transporterId, (err, rows) => {
        if (err) return next(err);
        const count = rows.length;
        const average = count ? Number((rows.reduce((sum, item) => sum + item.rating, 0) / count).toFixed(1)) : 0;
        res.json({ success: true, data: { average_rating: average, review_count: count, reviews: rows } });
    });
}

const listRequests = (req, res, next) => bookings.listTransporterRequests(req.transporterId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows }));
const listMyBookings = (req, res, next) => bookings.listTransporterBookings(req.transporterId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows }));

async function respondToRequest(req, res, next) {
    try {
        const accepted = req.body.response === "ACCEPTED";
        if (!accepted && req.body.response !== "REJECTED") return res.status(400).json({ success: false, message: "Response must be ACCEPTED or REJECTED" });
        const result = await bookings.respondToRequest(req.params.booking_id, req.transporterId, accepted, req.body.note);
        if (result.notFound) return res.status(404).json({ success: false, message: "Booking request not found" });
        if (result.unavailable) return res.status(409).json({ success: false, message: "Booking request has already been assigned or closed" });
        res.json({ success: true, message: accepted ? "Booking accepted" : "Booking declined" });
    } catch (error) { next(error); }
}

async function updateStatus(req, res, next) {
    const status = String(req.body.status || "").toUpperCase();
    if (!["CONFIRMED", "IN_TRANSIT", "DELIVERED", "CANCELLED"].includes(status)) return res.status(400).json({ success: false, message: "Unsupported booking status" });
    try {
        const result = await bookings.updateTransporterBookingStatus(req.params.booking_id, req.transporterId, status, req.body);
        if (result.notFound) return res.status(404).json({ success: false, message: "Booking not found" });
        if (result.invalidStatus) return res.status(409).json({ success: false, message: `Cannot move booking from ${result.invalidStatus} to ${status}` });
        res.json({ success: true, message: "Booking status updated" });
    } catch (error) { next(error); }
}

module.exports = { getDashboard, getReports, getPayments, listRequests, listMyBookings, listReviews, respondToRequest, updateStatus };
