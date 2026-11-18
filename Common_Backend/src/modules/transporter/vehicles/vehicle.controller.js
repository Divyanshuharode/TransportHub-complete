const generateUUID = require("../../../utility/uuid");
const {
    addVehicleModel,
    getVehicleModel,
    vehiclesCountModel,
    deleteVehiclesModel,
    updateVehicleModel
} = require("./vehicle.model");

const addVehicle = (req, res, next) => {
    const { vehicle_number, vehicle_type, capacity } = req.body;
    if (!vehicle_number?.trim() || !vehicle_type?.trim() || !Number.isFinite(Number(capacity)) || Number(capacity) <= 0) return res.status(400).json({ success: false, message: "Vehicle number, type and positive capacity are required" });
    const vehicle_id = generateUUID();
    const data = [vehicle_id, req.transporterId, vehicle_number.trim().toUpperCase(), vehicle_type.trim(), Number(capacity)]
    addVehicleModel(data, (err, result) => {
        if (err) return next(err)
        res.json({ success: true, message: "vehicle added sucessfully", data: { vehicle_id, ...result } })
    });
}

const getVehicles = (req, res, next) => {
    getVehicleModel(req.transporterId, (err, result) => {
        if (err) return next(err)
        res.send({ success: true, message: " feched vehicles ", data: result })
    })
}

const vehiclesCount = (req, res, next) => {
    vehiclesCountModel(req.transporterId, (err, result) => {
        if (err) return next(err);
        res.status(200).json({ success: true, message: "vehicles Count", data: result })
    })
}

const deleteVehicles = (req, res, next) => {
    deleteVehiclesModel(req.params.vehicle_id, req.transporterId, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Vehicle not found" });
        res.send({ success: true, message: "vehicle deleted", data: result })
    })
}
module.exports = {
    addVehicle,
    getVehicles,
    vehiclesCount,
    deleteVehicles,
    updateVehicle
};

function updateVehicle(req, res, next) {
    const { vehicle_number, vehicle_type, capacity } = req.body;
    const status = String(req.body.status || "AVAILABLE").toUpperCase();
    if (!vehicle_number?.trim() || !vehicle_type?.trim() || !Number.isFinite(Number(capacity)) || Number(capacity) <= 0 || !["AVAILABLE", "MAINTENANCE", "INACTIVE"].includes(status)) return res.status(400).json({ success: false, message: "Enter a vehicle number, type, positive capacity and valid status" });
    updateVehicleModel(req.params.vehicle_id, req.transporterId, { vehicle_number: vehicle_number.trim().toUpperCase(), vehicle_type: vehicle_type.trim(), capacity: Number(capacity), status }, (err, result) => {
        if (err) return next(err);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Vehicle not found" });
        res.json({ success: true, message: "Vehicle updated" });
    });
}

