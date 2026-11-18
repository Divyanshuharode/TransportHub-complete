import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";

function BookingChart({ monthly = [] }) {
    const data = monthly.map((item) => ({ month: new Date(`${item.month}-01T00:00:00`).toLocaleString("en", { month: "short" }), bookings: Number(item.bookings) }));
    return (
        <div className="bg-white rounded-xl shadow p-6 h-96">
            <h2 className="text-xl font-semibold mb-6">
                Booking Overview
            </h2>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#2563eb"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BookingChart;
