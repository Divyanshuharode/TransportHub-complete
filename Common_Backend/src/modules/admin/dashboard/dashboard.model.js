const connection = require("../../../config/db");

const getTransporterCountModel = (cbfn) => {
    const query = "SELECT COUNT(*) AS totalTransporters FROM transporters";
    connection.query(query, cbfn);
};

const getBookingCountModel = (cbfn) => {
    const query = "SELECT COUNT(*) AS totalBookings FROM bookings";
    connection.query(query, cbfn);

}

const getDashboardSummaryModel = (cbfn) => {
    Promise.all([
        connection.promise().query(`SELECT (SELECT COUNT(*) FROM transporters) AS totalTransporters,
            (SELECT COUNT(*) FROM customers) AS totalCustomers,
            (SELECT COUNT(*) FROM bookings) AS totalBookings,
            (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'PAID') AS totalRevenue`),
        connection.promise().query("SELECT status, COUNT(*) AS count FROM bookings GROUP BY status"),
        connection.promise().query(`SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS bookings FROM bookings
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH) GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month`),
        connection.promise().query(`SELECT b.booking_id, b.booking_number, c.customer_name, t.transporter_name, b.pickup_location, b.delivery_location, b.vehicle_type, b.status, b.created_at
            FROM bookings b JOIN customers c ON c.customer_id = b.customer_id LEFT JOIN transporters t ON t.transporter_id = b.transporter_id
            ORDER BY b.created_at DESC LIMIT 5`)
    ]).then(([[counts], [statuses], [monthly], [recent]]) => cbfn(null, { counts: counts[0], statuses, monthly, recent })).catch(cbfn);
};

module.exports = { getTransporterCountModel, getBookingCountModel, getDashboardSummaryModel };
