const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connection = require("./config/db");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
const allowedOrigins = process.env.FRONTEND_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) || ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

const errorMiddleware = require("./middleware/errorMiddleware");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware");
const { transporterAuthMiddleware } = require("./middleware/transporterAuthMiddleware");
const adminAuthRoutes = require("./modules/admin/auth/auth.routes");
const customerAuthRoutes = require("./modules/customer/auth/auth.routes");
const customerProfileRoutes = require("./modules/customer/profile/profile.routes");
const customerBookingRoutes = require("./modules/customer/bookings/booking.routes");
const transporterAuthRoutes = require("./modules/transporter/auth/auth.routes");
const transporterVehicleRoutes = require("./modules/transporter/vehicles/vehicle.routes");
const transporterDriverRoutes = require("./modules/transporter/drivers/driver.routes");
const transporterBookingRoutes = require("./modules/transporter/bookings/booking.routes");
const transporterProfileRoutes = require("./modules/transporter/profile/profile.routes");
const transporterDocumentRoutes = require("./modules/transporter/documents/document.routes");
const adminRoleRoutes = require("./modules/admin/roles/role.routes");
const adminRoleAssignRoutes = require("./modules/admin/roles/roleAssign.routes");
const adminUserRoutes = require("./modules/admin/users/user.routes");
const adminDashboardRoutes = require("./modules/admin/dashboard/dashboard.routes");
const adminCustomerRoutes = require("./modules/admin/customers/customer.routes");
const adminTransporterRoutes = require("./modules/admin/transporters/transporter.routes");
const adminBookingRoutes = require("./modules/admin/bookings/booking.routes");
const publicReviewRoutes = require("./modules/reviews/review.routes");
const adminInventoryRoutes = require("./modules/admin/inventory/inventory.routes");
const adminDocumentRoutes = require("./modules/admin/documents/document.routes");

app.get("/api/health", (req, res) => res.json({ success: true, message: "TransportHub API is running" }));
app.get("/api/health/database", (req, res, next) => {
    connection.query("SELECT 1 AS connected", (error) => error ? next(error) : res.json({ success: true, message: "Database connected" }));
});
app.use("/", adminAuthRoutes);
app.use("/", customerAuthRoutes, customerProfileRoutes, customerBookingRoutes);
app.use("/", publicReviewRoutes);
app.use("/", transporterAuthRoutes);
app.use("/", transporterAuthMiddleware, transporterVehicleRoutes, transporterDriverRoutes, transporterBookingRoutes, transporterProfileRoutes, transporterDocumentRoutes);
app.use("/", adminAuthMiddleware, adminRoleRoutes, adminRoleAssignRoutes, adminUserRoutes, adminDashboardRoutes, adminCustomerRoutes, adminTransporterRoutes, adminBookingRoutes, adminInventoryRoutes, adminDocumentRoutes);
app.use(errorMiddleware);

module.exports = app;

