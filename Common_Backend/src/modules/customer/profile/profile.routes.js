const express = require("express");
const customerAuthMiddleware = require("../../../middleware/customerAuthMiddleware");
const { getProfile, updateProfile } = require("./profile.controller");

const router = express.Router();
router.get("/api/customer/profile", customerAuthMiddleware, getProfile);
router.patch("/api/customer/profile", customerAuthMiddleware, updateProfile);
module.exports = router;
