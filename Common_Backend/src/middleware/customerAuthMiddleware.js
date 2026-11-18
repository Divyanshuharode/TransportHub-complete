const jwt = require("jsonwebtoken");

function customerAuthMiddleware(req, res, next) {
    const token = req.cookies?.customerToken;
    if (!token) return res.status(401).json({ success: false, message: "Customer login required" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.customerId = decoded.customer_id;
        req.customer = decoded;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired customer session" });
    }
}

module.exports = customerAuthMiddleware;
