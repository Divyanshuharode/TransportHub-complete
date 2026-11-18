const { getProfileModel, updateProfileModel } = require("./profile.model");

const getProfile = (req, res, next) => getProfileModel(req.transporterId, (err, rows) => {
    if (err) return next(err);
    if (!rows.length) return res.status(404).json({ success: false, message: "Transporter profile not found" });
    res.json({ success: true, data: rows[0] });
});

const updateProfile = (req, res, next) => {
    const { transporter_name, mobile_number, business_name, business_address, city } = req.body;
    if (!transporter_name?.trim() || !mobile_number?.trim()) return res.status(400).json({ success: false, message: "Name and mobile number are required" });
    if (!/^[0-9+() -]{7,20}$/.test(mobile_number)) return res.status(400).json({ success: false, message: "Mobile number is invalid" });
    updateProfileModel(req.transporterId, { transporter_name: transporter_name.trim(), mobile_number: mobile_number.trim(), business_name, business_address, city }, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Transporter profile not found" });
        getProfileModel(req.transporterId, (profileError, rows) => profileError ? next(profileError) : res.json({ success: true, message: "Profile updated", data: rows[0] }));
    });
};

module.exports = { getProfile, updateProfile };
