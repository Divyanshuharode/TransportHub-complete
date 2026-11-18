const connection = require("../../config/db");

const pool = connection.promise();
const allowedStatusChanges = {
    PENDING: ["CANCELLED"],
    ACCEPTED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
    REJECTED: []
};

async function withTransaction(work) {
    const db = await pool.getConnection();
    try { await db.beginTransaction(); const result = await work(db); await db.commit(); return result; }
    catch (error) { await db.rollback(); throw error; }
    finally { db.release(); }
}

async function createCustomerBooking(data) {
    return withTransaction(async (db) => {
        const bookingId = data.booking_id;
        await db.query(`INSERT INTO bookings (booking_id, booking_number, customer_id, pickup_location, delivery_location, goods_type, weight_tonnes, vehicle_type, pickup_date, customer_note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [bookingId, data.booking_number, data.customer_id, data.pickup_location, data.delivery_location, data.goods_type, data.weight_tonnes, data.vehicle_type, data.pickup_date, data.customer_note || null]);
        await db.query("INSERT INTO booking_status_history (booking_id, changed_by_type, changed_by_id, old_status, new_status, note) VALUES (?, 'CUSTOMER', ?, NULL, 'PENDING', 'Booking request created')", [bookingId, data.customer_id]);
        const [rows] = await db.query("SELECT * FROM bookings WHERE booking_id = ?", [bookingId]);
        return rows[0];
    });
}

function listCustomerBookings(customerId, cbfn) {
    const sql = `SELECT b.*, t.transporter_name, t.mobile_number AS transporter_mobile,
        (SELECT r.rating FROM reviews r WHERE r.booking_id = b.booking_id LIMIT 1) AS review_rating
        FROM bookings b LEFT JOIN transporters t ON t.transporter_id = b.transporter_id
        WHERE b.customer_id = ? ORDER BY b.created_at DESC`;
    connection.query(sql, [customerId], cbfn);
}

function getCustomerBooking(bookingId, customerId, cbfn) {
    connection.query("SELECT * FROM bookings WHERE booking_id = ? AND customer_id = ?", [bookingId, customerId], cbfn);
}

async function cancelCustomerBooking(bookingId, customerId, note) {
    return withTransaction(async (db) => {
        const [rows] = await db.query("SELECT booking_id, status FROM bookings WHERE booking_id = ? AND customer_id = ? FOR UPDATE", [bookingId, customerId]);
        if (!rows.length) return { notFound: true };
        if (!allowedStatusChanges[rows[0].status]?.includes("CANCELLED")) return { invalidStatus: rows[0].status };
        await db.query("UPDATE bookings SET status = 'CANCELLED', cancellation_reason = ? WHERE booking_id = ?", [note || null, bookingId]);
        await db.query("INSERT INTO booking_status_history (booking_id, changed_by_type, changed_by_id, old_status, new_status, note) VALUES (?, 'CUSTOMER', ?, ?, 'CANCELLED', ?)", [bookingId, customerId, rows[0].status, note || "Cancelled by customer"]);
        return { success: true };
    });
}

function listTransporterRequests(transporterId, cbfn) {
    connection.query(`SELECT b.*, c.customer_name, c.mobile_number AS customer_mobile
        FROM bookings b JOIN customers c ON c.customer_id = b.customer_id
        LEFT JOIN booking_offers o ON o.booking_id = b.booking_id AND o.transporter_id = ?
        WHERE b.status = 'PENDING' AND b.transporter_id IS NULL AND o.offer_id IS NULL ORDER BY b.pickup_date ASC`, [transporterId], cbfn);
}

function listTransporterBookings(transporterId, cbfn) {
    connection.query(`SELECT b.*, c.customer_name, c.mobile_number AS customer_mobile, v.vehicle_number, d.full_name AS driver_name
        FROM bookings b JOIN customers c ON c.customer_id = b.customer_id
        LEFT JOIN vehicles v ON v.vehicle_id = b.vehicle_id LEFT JOIN drivers d ON d.driver_id = b.driver_id
        WHERE b.transporter_id = ? ORDER BY b.created_at DESC`, [transporterId], cbfn);
}

async function respondToRequest(bookingId, transporterId, accepted, note) {
    return withTransaction(async (db) => {
        const [rows] = await db.query("SELECT booking_id, status, transporter_id FROM bookings WHERE booking_id = ? FOR UPDATE", [bookingId]);
        if (!rows.length) return { notFound: true };
        const booking = rows[0];
        if (booking.status !== "PENDING" || booking.transporter_id) return { unavailable: true };
        await db.query("INSERT INTO booking_offers (booking_id, transporter_id, status, response_note) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), response_note = VALUES(response_note), responded_at = CURRENT_TIMESTAMP", [bookingId, transporterId, accepted ? "ACCEPTED" : "REJECTED", note || null]);
        if (accepted) {
            await db.query("UPDATE bookings SET transporter_id = ?, status = 'ACCEPTED' WHERE booking_id = ? AND transporter_id IS NULL AND status = 'PENDING'", [transporterId, bookingId]);
            await db.query("INSERT INTO booking_status_history (booking_id, changed_by_type, changed_by_id, old_status, new_status, note) VALUES (?, 'TRANSPORTER', ?, 'PENDING', 'ACCEPTED', ?)", [bookingId, transporterId, note || "Accepted by transporter"]);
        }
        return { success: true };
    });
}

async function updateTransporterBookingStatus(bookingId, transporterId, nextStatus, data = {}) {
    return withTransaction(async (db) => {
        const [rows] = await db.query("SELECT booking_id, status FROM bookings WHERE booking_id = ? AND transporter_id = ? FOR UPDATE", [bookingId, transporterId]);
        if (!rows.length) return { notFound: true };
        const oldStatus = rows[0].status;
        if (!allowedStatusChanges[oldStatus]?.includes(nextStatus)) return { invalidStatus: oldStatus };
        await db.query("UPDATE bookings SET status = ?, vehicle_id = COALESCE(?, vehicle_id), driver_id = COALESCE(?, driver_id), amount = COALESCE(?, amount) WHERE booking_id = ?", [nextStatus, data.vehicle_id || null, data.driver_id || null, data.amount || null, bookingId]);
        await db.query("INSERT INTO booking_status_history (booking_id, changed_by_type, changed_by_id, old_status, new_status, note) VALUES (?, 'TRANSPORTER', ?, ?, ?, ?)", [bookingId, transporterId, oldStatus, nextStatus, data.note || null]);
        if (nextStatus === "IN_TRANSIT" && data.vehicle_id) await db.query("UPDATE vehicles SET status = 'ON_TRIP' WHERE vehicle_id = ? AND transporter_id = ?", [data.vehicle_id, transporterId]);
        if (nextStatus === "DELIVERED") await db.query("UPDATE vehicles SET status = 'AVAILABLE' WHERE vehicle_id = (SELECT vehicle_id FROM bookings WHERE booking_id = ?)", [bookingId]);
        return { success: true };
    });
}

function listAdminBookings(status, cbfn) {
    let sql = `SELECT b.*, c.customer_name, c.email AS customer_email, t.transporter_name, t.email AS transporter_email, v.vehicle_number
        FROM bookings b JOIN customers c ON c.customer_id = b.customer_id
        LEFT JOIN transporters t ON t.transporter_id = b.transporter_id LEFT JOIN vehicles v ON v.vehicle_id = b.vehicle_id`;
    const params = [];
    if (status) { sql += " WHERE b.status = ?"; params.push(status); }
    sql += " ORDER BY b.created_at DESC";
    connection.query(sql, params, cbfn);
}

async function updateAdminBookingStatus(bookingId, nextStatus, note) {
    return withTransaction(async (db) => {
        const [rows] = await db.query("SELECT booking_id, status FROM bookings WHERE booking_id = ? FOR UPDATE", [bookingId]);
        if (!rows.length) return { notFound: true };
        const oldStatus = rows[0].status;
        if (oldStatus === nextStatus) return { success: true };
        if (!["CANCELLED", "CONFIRMED", "IN_TRANSIT", "DELIVERED"].includes(nextStatus)) return { invalidStatus: oldStatus };
        await db.query("UPDATE bookings SET status = ?, cancellation_reason = IF(? = 'CANCELLED', ?, cancellation_reason) WHERE booking_id = ?", [nextStatus, nextStatus, note || null, bookingId]);
        await db.query("INSERT INTO booking_status_history (booking_id, changed_by_type, old_status, new_status, note) VALUES (?, 'ADMIN', ?, ?, ?)", [bookingId, oldStatus, nextStatus, note || null]);
        return { success: true };
    });
}

async function createReview(bookingId, customerId, data) {
    return withTransaction(async (db) => {
        const [rows] = await db.query("SELECT booking_id, transporter_id, status FROM bookings WHERE booking_id = ? AND customer_id = ? FOR UPDATE", [bookingId, customerId]);
        if (!rows.length) return { notFound: true };
        if (rows[0].status !== "DELIVERED" || !rows[0].transporter_id) return { notDelivered: true };
        await db.query("INSERT INTO reviews (review_id, booking_id, customer_id, transporter_id, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)", [data.review_id, bookingId, customerId, rows[0].transporter_id, data.rating, data.review_text || null]);
        return { success: true };
    });
}

function listTransporterReviews(transporterId, cbfn) {
    connection.query(`SELECT r.review_id, r.booking_id, r.rating, r.review_text, r.created_at, c.customer_name
        FROM reviews r JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.transporter_id = ? ORDER BY r.created_at DESC`, [transporterId], cbfn);
}

function listPublicTransporterReviews(transporterId, cbfn) {
    connection.query(`SELECT r.review_id, r.rating, r.review_text, r.created_at, c.customer_name, b.booking_number
        FROM reviews r JOIN customers c ON c.customer_id = r.customer_id JOIN bookings b ON b.booking_id = r.booking_id
        WHERE r.transporter_id = ? ORDER BY r.created_at DESC`, [transporterId], cbfn);
}

function getBookingHistory(bookingId, customerId, cbfn) {
    connection.query(`SELECT h.old_status, h.new_status, h.note, h.created_at
        FROM booking_status_history h JOIN bookings b ON b.booking_id = h.booking_id
        WHERE h.booking_id = ? AND b.customer_id = ? ORDER BY h.created_at ASC`, [bookingId, customerId], cbfn);
}

function getAdminReviews(cbfn) {
    connection.query(`SELECT r.review_id, r.booking_id, b.booking_number, r.rating, r.review_text, r.created_at,
        c.customer_name, t.transporter_name FROM reviews r JOIN bookings b ON b.booking_id = r.booking_id
        JOIN customers c ON c.customer_id = r.customer_id JOIN transporters t ON t.transporter_id = r.transporter_id
        ORDER BY r.created_at DESC`, cbfn);
}

module.exports = { createCustomerBooking, listCustomerBookings, getCustomerBooking, cancelCustomerBooking, listTransporterRequests, listTransporterBookings, respondToRequest, updateTransporterBookingStatus, listAdminBookings, updateAdminBookingStatus, createReview, listTransporterReviews, listPublicTransporterReviews, getBookingHistory, getAdminReviews };
