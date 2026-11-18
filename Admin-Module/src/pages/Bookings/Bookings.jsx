import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../../services/api";

const tableStyles = { headRow: { style: { minHeight: "48px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" } }, headCells: { style: { color: "#475569", fontSize: "12px", fontWeight: 600 } }, rows: { style: { minHeight: "58px", color: "#334155", fontSize: "13px" }, highlightOnHoverStyle: { backgroundColor: "#f8fafc" } }, pagination: { style: { borderTop: "1px solid #e2e8f0", color: "#64748b" } } };
const title = (status) => status?.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "—";

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    async function loadBookings() { const { data } = await api.get("/api/admin/bookings"); setBookings(data.data); }
    useEffect(() => { loadBookings().catch((requestError) => setError(requestError.response?.data?.message || "Could not load bookings.")); }, []);
    async function updateStatus(row, status) { if (!window.confirm(`Change ${row.booking_number} to ${title(status)}?`)) return; try { await api.patch(`/api/admin/bookings/${row.booking_id}/status`, { status }); await loadBookings(); setError(""); } catch (requestError) { setError(requestError.response?.data?.message || "Could not update booking."); } }
    const counts = useMemo(() => ({ total: bookings.length, pending: bookings.filter((item) => item.status === "PENDING").length, transit: bookings.filter((item) => item.status === "IN_TRANSIT").length, delivered: bookings.filter((item) => item.status === "DELIVERED").length }), [bookings]);
    const columns = [
        { name: "Booking ID", selector: (row) => row.booking_number, sortable: true },
        { name: "Customer", selector: (row) => row.customer_name, sortable: true },
        { name: "Transporter", selector: (row) => row.transporter_name || "Unassigned", sortable: true },
        { name: "Route", selector: (row) => `${row.pickup_location} → ${row.delivery_location}`, sortable: true },
        { name: "Vehicle", selector: (row) => row.vehicle_number || row.vehicle_type },
        { name: "Date", selector: (row) => row.pickup_date?.slice(0, 10), sortable: true },
        { name: "Status", selector: (row) => title(row.status), cell: (row) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === "PENDING" ? "bg-amber-50 text-amber-700" : row.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : row.status === "CANCELLED" || row.status === "REJECTED" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>{title(row.status)}</span> },
        { name: "Action", cell: (row) => <select aria-label={`Update ${row.booking_number}`} value="" onChange={(event) => updateStatus(row, event.target.value)} disabled={["CANCELLED", "DELIVERED", "REJECTED"].includes(row.status)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs disabled:opacity-40"><option value="" disabled>Update</option>{["CONFIRMED", "IN_TRANSIT", "DELIVERED", "CANCELLED"].map((status) => <option key={status} value={status}>{title(status)}</option>)}</select> }
    ];

    return <div className="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Operations</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Bookings</h1><p className="mt-1 text-sm text-slate-500">Manage and track customer shipments.</p></div>{error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total bookings", counts.total, "text-slate-900"], ["Pending", counts.pending, "text-amber-600"], ["In transit", counts.transit, "text-indigo-700"], ["Delivered", counts.delivered, "text-emerald-700"]].map(([label, value, color]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm font-medium text-slate-500">{label}</p><h2 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h2></div>)}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="text-base font-semibold text-slate-900">Booking list</h2><p className="mt-1 text-xs text-slate-500">{bookings.length} bookings in the system</p></div><DataTable columns={columns} data={bookings} keyField="booking_id" customStyles={tableStyles} pagination highlightOnHover responsive persistTableHead noDataComponent="No bookings have been submitted yet."/></div></div>;
}

export default Bookings;
