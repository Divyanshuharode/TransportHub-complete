import { useEffect, useState } from "react";
import { Truck, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { getBookingRequestsApi, respondToBookingApi } from "../../services/operations.service";

function mapRequest(item) { return { id: item.booking_id, customer: item.customer_name, pickup: item.pickup_location, drop: item.delivery_location, vehicle: item.vehicle_type, date: item.pickup_date?.slice(0, 10), amount: item.amount ? `₹${Number(item.amount).toLocaleString("en-IN")}` : "To be quoted", status: item.status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) }; }

const Transport_Requests = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("All Status");
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    useEffect(() => { getBookingRequestsApi().then(({ data }) => setRequests(data.data.map(mapRequest))).catch((requestError) => setError(requestError.response?.data?.message || "Could not load booking requests.")); }, []);
    async function updateStatus(id, status) { setError(""); try { await respondToBookingApi(id, status === "Accepted" ? "ACCEPTED" : "REJECTED"); const { data } = await getBookingRequestsApi(); setRequests(data.data.map(mapRequest)); } catch (requestError) { setError(requestError.response?.data?.message || "Could not update this request."); } }
    const visibleRequests = requests.filter((item) => filter === "All Status" || item.status === filter);

    return (
        <div className="space-y-2 p-1">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Transport Requests</h1>
                {/* <p className="mt-1 text-sm text-gray-500">Manage and respond to your transport booking requests.</p> */}
            </div>
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Total Requests</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{requests.length.toString().padStart(2, "0")}</h2>
                    </div>
                    <Truck size={20} className="text-blue-600" />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Pending Requests</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{requests.filter((item) => item.status === "Pending").length.toString().padStart(2, "0")}</h2>
                    </div>
                    <Clock size={20} className="text-amber-600" />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Accepted Requests</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{requests.filter((item) => item.status === "Accepted").length.toString().padStart(2, "0")}</h2>
                    </div>
                    <CheckCircle size={20} className="text-green-600" />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
                    <div>
                        <h2 className="font-semibold text-gray-900">All Requests</h2>
                        <p className="mt-1 text-xs text-gray-500">Review customer booking details.</p>
                    </div>

                    <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Request ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Vehicle</th>
                                <th className="px-4 py-3">Trip Date</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {visibleRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-600">{request.id}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-800">{request.customer}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                        {request.pickup} → {request.drop}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">{request.vehicle}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">{request.date}</td>
                                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-800">{request.amount}</td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === "Pending" ? "bg-amber-100 text-amber-700" : request.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelected(request)} title="View Details" className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
                                                <Eye size={16} />
                                            </button>

                                            {request.status === "Pending" && (
                                                <>
                                                    <button onClick={() => updateStatus(request.id, "Accepted")} title="Accept Request" className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => updateStatus(request.id, "Rejected")} title="Reject Request" className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white"><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-100">Booking request</p><h2 className="mt-1 text-lg font-bold">{selected.id}</h2></div><button onClick={() => setSelected(null)} className="rounded-lg px-3 py-2 text-xl hover:bg-white/15" aria-label="Close">×</button></div><div className="grid gap-4 p-6 sm:grid-cols-2">{[["Customer",selected.customer],["Trip date",selected.date || "Not set"],["Pickup",selected.pickup],["Delivery",selected.drop],["Vehicle requested",selected.vehicle || "Not specified"],["Quoted amount",selected.amount]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 break-words font-semibold text-slate-900">{value || "—"}</p></div>)}</div><div className="flex justify-end border-t border-slate-100 px-6 py-4"><button onClick={() => setSelected(null)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Close</button></div></div></div>}

        </div>
    );
};

export default Transport_Requests;

