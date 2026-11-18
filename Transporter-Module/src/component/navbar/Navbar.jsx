
import { Menu, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function TransporterNavbar({ onMenuClick }) {
    const location = useLocation();
    const section = location.pathname.split("/").filter(Boolean).at(-1) || "dashboard";
    const title = ({ dashboard: "Dashboard", vehicles: "My Vehicles", transportRequests: "Transport Requests", bookings: "My Bookings", livetracking: "Trip Tracking", drivers: "My Drivers", earnings_payments: "Earnings & Payments", reports: "Reports", reviews: "Reviews", profile: "My Profile", documentsVerify: "Documents & Verification", settings: "Settings" })[section] || "TransportHub";
    return (
        <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">

            {/* Left Section */}
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                    <p className="text-xs text-slate-500">Manage your transport business</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-5">

                {/* Profile */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <UserRound size={20} />
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">Transporter Name</p>
                        <p className="text-xs text-slate-500">Transport Partner</p>
                    </div>

                    <ChevronDown size={16} className="hidden text-slate-500 sm:block" />
                </div>

            </div>
        </nav>
    );
}

