import api from "./api";

export const loginAdmin = (credentials) => api.post("/login", credentials);
export const getAdminSession = () => api.get("/api/admin/me");
export const logoutAdmin = () => api.post("/api/admin/logout");
