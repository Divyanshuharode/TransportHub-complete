const connection = require("../../../config/db");

const listDriversModel = (transporterId, cbfn) => connection.query(`SELECT d.*, v.vehicle_number FROM drivers d LEFT JOIN vehicles v ON v.vehicle_id = d.vehicle_id WHERE d.transporter_id = ? ORDER BY d.created_at DESC`, [transporterId], cbfn);
const addDriverModel = (data, cbfn) => connection.query("INSERT INTO drivers (driver_id, transporter_id, full_name, phone, license_number, vehicle_id) VALUES (?, ?, ?, ?, ?, ?)", [data.driver_id, data.transporter_id, data.full_name, data.phone, data.license_number, data.vehicle_id || null], cbfn);
const updateDriverModel = (driverId, transporterId, data, cbfn) => connection.query("UPDATE drivers SET full_name = ?, phone = ?, license_number = ?, vehicle_id = ?, status = ? WHERE driver_id = ? AND transporter_id = ?", [data.full_name, data.phone, data.license_number, data.vehicle_id || null, data.status || "ACTIVE", driverId, transporterId], cbfn);
const deleteDriverModel = (driverId, transporterId, cbfn) => connection.query("DELETE FROM drivers WHERE driver_id = ? AND transporter_id = ?", [driverId, transporterId], cbfn);

module.exports = { listDriversModel, addDriverModel, updateDriverModel, deleteDriverModel };
