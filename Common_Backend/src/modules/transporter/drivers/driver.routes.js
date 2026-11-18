const express = require("express");
const { listDrivers, addDriver, updateDriver, deleteDriver } = require("./driver.controller");

const router = express.Router();
router.get("/api/transporter/drivers", listDrivers);
router.post("/api/transporter/drivers", addDriver);
router.patch("/api/transporter/drivers/:driver_id", updateDriver);
router.delete("/api/transporter/drivers/:driver_id", deleteDriver);
module.exports = router;
