const express = require("express");
const { registerCustomer, loginCustomer, getCustomerSession, logoutCustomer } = require("./auth.controller");
const { validateRegister, validateLogin } = require("./auth.validation");
const customerAuthMiddleware = require("../../../middleware/customerAuthMiddleware");

const router = express.Router();
router.post("/api/customer/register", validateRegister, registerCustomer);
router.post("/api/customer/login", validateLogin, loginCustomer);
router.get("/api/customer/me", customerAuthMiddleware, getCustomerSession);
router.post("/api/customer/logout", customerAuthMiddleware, logoutCustomer);
module.exports = router;
