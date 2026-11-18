import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Roles from "../pages/Roles/Roles";
import Users from "../pages/Users/Users";
import Customers from "../pages/Customers/Customers";
import Transporters from "../pages/Transporters/Transporters";
import Vehicles from "../pages/Vehicles/Vehicles";
import Inventory from "../pages/Inventory/Inventory";
import Bookings from "../pages/Bookings/Bookings";
import Login from "../pages/Login/Login";
import Settings from "../pages/Setting/Settings";
import Reviews from "../pages/Reviews/Reviews";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

                    <Route index element={<Dashboard />} />

                    <Route path="roles" element={<Roles />} />

                    <Route path="users" element={<Users />} />

                    <Route path="customers" element={<Customers />} />

                    <Route path="transporters" element={<Transporters />} />

                    <Route path="vehicles" element={<Vehicles />} />

                    {/* <Route path="inventory" element={<Inventory />} /> */}
                    <Route path="inventory" element={<Inventory />} />

                    <Route path="bookings" element={<Bookings />} />
                    <Route path="reviews" element={<Reviews />} />

                    <Route path="settings" element={<Settings />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}
