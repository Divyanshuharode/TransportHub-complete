const { getTransporterCountModel, getBookingCountModel, getDashboardSummaryModel } = require("./dashboard.model");

const getTrans = (req, res, next) => {
    getTransporterCountModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Total transporters fetched successfully", data: result });
    });
};

const totalBooking = (req, res, next) => {
    getBookingCountModel((err, result) => {
        if (err) return next(err);
        res.send({ success: true, message: "Total Bookings fetched successfully", data: result });
    });
};

const getDashboardSummary = (req, res, next) => getDashboardSummaryModel((err, data) => {
    if (err) return next(err);
    res.json({ success: true, data });
});

module.exports = { getTrans, totalBooking, getDashboardSummary };
