const generateUUID = require("../../../utility/uuid");
const drivers = require("./driver.model");

function validateDriver(body) {
    if (!body.full_name?.trim() || !body.phone?.trim() || !body.license_number?.trim()) return "Name, phone and license number are required";
    if (!/^[0-9+() -]{7,20}$/.test(body.phone)) return "Phone number is invalid";
    return null;
}

const listDrivers = (req, res, next) => drivers.listDriversModel(req.transporterId, (err, rows) => err ? next(err) : res.json({ success: true, data: rows }));
const addDriver = (req, res, next) => {
    const error = validateDriver(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const driver_id = generateUUID();
    drivers.addDriverModel({ ...req.body, driver_id, transporter_id: req.transporterId }, (err) => err ? next(err) : res.status(201).json({ success: true, message: "Driver added", data: { driver_id } }));
};
const updateDriver = (req, res, next) => {
    const error = validateDriver(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    drivers.updateDriverModel(req.params.driver_id, req.transporterId, req.body, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Driver not found" });
        res.json({ success: true, message: "Driver updated" });
    });
};
const deleteDriver = (req, res, next) => drivers.deleteDriverModel(req.params.driver_id, req.transporterId, (err, result) => {
    if (err) return next(err);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Driver not found" });
    res.json({ success: true, message: "Driver deleted" });
});

module.exports = { listDrivers, addDriver, updateDriver, deleteDriver };
