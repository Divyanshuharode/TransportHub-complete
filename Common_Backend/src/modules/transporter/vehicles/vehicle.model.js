const connection = require("../../../config/db");

const addVehicleModel = (data, cbfn) => connection.query("INSERT INTO vehicles (vehicle_id, transporter_id, vehicle_number, vehicle_type, capacity) VALUES (?, ?, ?, ?, ?)", data, cbfn);
const getVehicleModel = (transporterId, cbfn) => connection.query("SELECT * FROM vehicles WHERE transporter_id = ? ORDER BY created_at DESC", [transporterId], cbfn);
const vehiclesCountModel = (transporterId, cbfn) => connection.query(`SELECT COUNT(*) AS totalVehicles,
    COALESCE(SUM(status = 'AVAILABLE'), 0) AS activeVehicles,
    COALESCE(SUM(status = 'ON_TRIP'), 0) AS on_TripVehicles,
    COALESCE(SUM(status = 'MAINTENANCE'), 0) AS maintenanceVehicles,
    COALESCE(SUM(status = 'INACTIVE'), 0) AS inactiveVehicles
    FROM vehicles WHERE transporter_id = ?`, [transporterId], cbfn);
const deleteVehiclesModel = (vehicle_id, transporterId, cbfn) => connection.query("DELETE FROM vehicles WHERE vehicle_id = ? AND transporter_id = ?", [vehicle_id, transporterId], cbfn);

module.exports = { addVehicleModel, getVehicleModel, vehiclesCountModel, deleteVehiclesModel };
