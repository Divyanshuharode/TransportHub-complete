const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getUserByEmailModel } = require("./auth.model");

const loginAdmin = (req, res, next) => {
    getUserByEmailModel(req.body.email, (err, data) => {
        if (err) return next(err);
        if (data.length === 0) {
            return res.status(401).send({ success: false, message: "Invalid email or password", data: null });
        }

        if (data[0].account_status && data[0].account_status.toUpperCase() !== "ACTIVE") return res.status(403).json({ success: false, message: "Admin account is inactive" });

        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
            if (err) return next(err);

            if (!result) {
                return res.send({ success: false, message: "Invalid email or password", data: null });
            }

            try {
                const user = { user_id: data[0].user_id, email: data[0].email };

                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });

                res.cookie("adminToken", token, { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", maxAge: 8 * 60 * 60 * 1000, path: "/" });

                res.status(200).send({
                    success: true,
                    message: "Login successful",
                    data: {
                        user_id: data[0].user_id,
                        email: data[0].email
                    }
                });
            } catch (err) {
                next(err);
            }
        });
    });
};

module.exports = { loginAdmin };
