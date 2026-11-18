import api from "./api";

export const getBookingRequestsApi = () => api.get("/api/transporter/booking-requests");
export const respondToBookingApi = (bookingId, response) => api.patch(`/api/transporter/bookings/${bookingId}/respond`, { response });
export const getTransporterBookingsApi = () => api.get("/api/transporter/bookings");
export const updateBookingStatusApi = (bookingId, data) => api.patch(`/api/transporter/bookings/${bookingId}/status`, data);
export const getDriversApi = () => api.get("/api/transporter/drivers");
export const addDriverApi = (data) => api.post("/api/transporter/drivers", data);
export const updateDriverApi = (driverId, data) => api.patch(`/api/transporter/drivers/${driverId}`, data);
export const deleteDriverApi = (driverId) => api.delete(`/api/transporter/drivers/${driverId}`);
