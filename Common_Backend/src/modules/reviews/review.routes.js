const express = require("express");
const { listTransporterReviews } = require("./review.controller");

const router = express.Router();
router.get("/api/transporters/:transporter_id/reviews", listTransporterReviews);
module.exports = router;
