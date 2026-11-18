const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { registerCustomerModel, getCustomerByEmailModel, getCustomerByIdModel } = require("./auth.model");

function setCustomerSession(res, customer) {
    const token = jwt.sign({ customer_id: customer.customer_id, role: "CUSTOMER" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.cookie("customerToken", token, { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", maxAge: 8 * 60 * 60 * 1000, path: "/" });
}

async function registerCustomer(req, res, next) {
    try {
        const password = await argon2.hash(req.body.password);
        registerCustomerModel({ ...req.body, password }, (err, result) => {
            if (err) return next(err);
            const customer = { customer_id: result.insertId, ...req.body };
            setCustomerSession(res, customer);
            res.status(201).json({ success: true, message: "Customer account created", data: customer });
        });
    } catch (error) { next(error); }
}

function loginCustomer(req, res, next) {
    getCustomerByEmailModel(req.body.email, async (err, rows) => {
        if (err) return next(err);
        if (!rows.length || rows[0].account_status.toLowerCase() !== "active") return res.status(401).json({ success: false, message: "Invalid email or password" });
        try {
            const valid = await argon2.verify(rows[0].password || "", req.body.password);
            if (!valid) return res.status(401).json({ success: false, message: "Invalid email or password" });
            const customer = rows[0];
            setCustomerSession(res, customer);
            delete customer.password;
            res.json({ success: true, message: "Login successful", data: customer });
        } catch (error) { next(error); }
    });
}

function getCustomerSession(req, res, next) {
    getCustomerByIdModel(req.customerId, (err, rows) => {
        if (err) return next(err);
        if (!rows.length) return res.status(404).json({ success: false, message: "Customer account not found" });
        res.json({ success: true, data: rows[0] });
    });
}

function logoutCustomer(req, res) { res.clearCookie("customerToken", { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", path: "/" }); res.json({ success: true, message: "Logged out" }); }

module.exports = { registerCustomer, loginCustomer, getCustomerSession, logoutCustomer };
