const { getProfileModel, updateProfileModel } = require("./profile.model");

function getProfile(req, res, next) {
    getProfileModel(req.customerId, (err, rows) => {
        if (err) return next(err);
        if (!rows.length) return res.status(404).json({ success: false, message: "Profile not found" });
        res.json({ success: true, data: rows[0] });
    });
}

function updateProfile(req, res, next) {
    const { customer_name, mobile_number, city, address } = req.body;
    if (!customer_name || !mobile_number) return res.status(400).json({ success: false, message: "Name and mobile number are required" });
    updateProfileModel(req.customerId, { customer_name, mobile_number, city, address }, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Profile not found" });
        getProfileModel(req.customerId, (profileError, rows) => profileError ? next(profileError) : res.json({ success: true, message: "Profile updated", data: rows[0] }));
    });
}

module.exports = { getProfile, updateProfile };
