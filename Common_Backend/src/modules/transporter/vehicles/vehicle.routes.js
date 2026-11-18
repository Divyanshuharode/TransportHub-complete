const {
    addVehicle,
    getVehicles,
    vehiclesCount,
    deleteVehicles,
    updateVehicle
} = require("./vehicle.controller")

const express = require("express");
const vehicleRoute = express.Router();

vehicleRoute.post("/api/addvehicle", addVehicle);
vehicleRoute.post("/api/getvehicles", getVehicles);
vehicleRoute.post("/api/vehicles/count", vehiclesCount);
vehicleRoute.post("/api/deletevehicles/:vehicle_id", deleteVehicles)
vehicleRoute.patch("/api/transporter/vehicles/:vehicle_id", updateVehicle);

module.exports = vehicleRoute;

