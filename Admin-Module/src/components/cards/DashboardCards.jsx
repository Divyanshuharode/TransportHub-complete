import DashboardCard from "./DashboardCard";

import {
    Truck,
    Users,
    ClipboardList,
    IndianRupee,
} from "lucide-react";

function DashboardCards({ counts = {} }) {
    return (
        <div className="grid grid-cols-4 gap-4">

            <DashboardCard
                title="Total Transporters"
                value={counts.totalTransporters || 0}
                icon={<Truck />}
                color="bg-blue-100 text-blue-600"
            />

            <DashboardCard
                title="Total Customers"
                value={counts.totalCustomers || 0}
                icon={<Users />}
                color="bg-green-100 text-green-600"
            />

            <DashboardCard
                title="Total Bookings"
                value={counts.totalBookings || 0}
                icon={<ClipboardList />}
                color="bg-purple-100 text-purple-600"
            />

            <DashboardCard
                title="Total Revenue"
                value={`₹${Number(counts.totalRevenue || 0).toLocaleString("en-IN")}`}
                icon={<IndianRupee />}
                color="bg-yellow-100 text-yellow-600"
            />

        </div>
    );
}

export default DashboardCards;
