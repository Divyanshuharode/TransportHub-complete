const bookings = require("../shared/booking.model");

function listTransporterReviews(req, res, next) {
    bookings.listPublicTransporterReviews(req.params.transporter_id, (err, rows) => {
        if (err) return next(err);
        const count = rows.length;
        const average = count ? Number((rows.reduce((sum, row) => sum + row.rating, 0) / count).toFixed(1)) : 0;
        res.json({ success: true, data: { average_rating: average, review_count: count, reviews: rows } });
    });
}

module.exports = { listTransporterReviews };
