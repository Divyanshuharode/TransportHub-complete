import api from "./api";

export const getCardsDataApi = () => api.post("/api/vehicles/count");
export const getVehiclesApi = () => api.post("/api/getvehicles");
export const addVehicleApi = (data) => api.post("/api/addvehicle", data);
export const updateVehicleApi = (vehicleId, data) => api.patch(`/api/transporter/vehicles/${vehicleId}`, data);
export const deleteVehicleApi = (vehicleId) => api.post(`/api/deletevehicles/${vehicleId}`);

