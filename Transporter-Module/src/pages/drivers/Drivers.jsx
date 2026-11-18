import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { addDriverApi, deleteDriverApi, getDriversApi, updateDriverApi } from "../../services/operations.service";
import { getVehiclesApi } from "../../services/vehicles.service";

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [filter, setFilter] = useState("All Status");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    async function loadDrivers() { const { data } = await getDriversApi(); setDrivers(data.data.map((driver) => ({ id: driver.driver_id, name: driver.full_name, phone: driver.phone, license: driver.license_number, vehicle: driver.vehicle_number || "Not Assigned", vehicle_id: driver.vehicle_id, status: driver.status === "ACTIVE" ? "Active" : "Inactive" }))); }
    useEffect(() => { loadDrivers().catch((requestError) => setError(requestError.response?.data?.message || "Could not load drivers.")); getVehiclesApi().then(({ data }) => setVehicles(data.data)).catch(() => setVehicles([])); }, []);
    const visibleDrivers = drivers.filter((driver) => filter === "All Status" || driver.status === filter);
    async function saveDriver(event) { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); const payload = { full_name: values.name, phone: values.phone, license_number: values.license, vehicle_id: values.vehicle_id || null, status: "ACTIVE" }; try { if (editingId) await updateDriverApi(editingId, payload); else await addDriverApi(payload); await loadDrivers(); setShowForm(false); setEditingId(null); setError(""); } catch (requestError) { setError(requestError.response?.data?.message || "Could not save this driver."); } }
    async function removeDriver(id) { try { await deleteDriverApi(id); await loadDrivers(); } catch (requestError) { setError(requestError.response?.data?.message || "Could not delete this driver."); } }

    return (
        <div className="space-y-2 p-1">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Drivers</h1>
                    {/* <p className="mt-1 text-sm text-gray-500">Manage your drivers and their vehicle assignments.</p> */}
                </div>
                <button onClick={() => { setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus size={17} /> Add Driver
                </button>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Total Drivers</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{drivers.length.toString().padStart(2, "0")}</h2>
                    </div>
                    <Users size={20} className="text-blue-600" />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Active Drivers</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{drivers.filter((driver) => driver.status === "Active").length.toString().padStart(2, "0")}</h2>
                    </div>
                    <CheckCircle size={20} className="text-green-600" />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                        <p className="text-xs text-gray-500">Inactive Drivers</p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">{drivers.filter((driver) => driver.status === "Inactive").length.toString().padStart(2, "0")}</h2>
                    </div>
                    <Clock size={20} className="text-amber-600" />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
                    <div>
                        <h2 className="font-semibold text-gray-900">Driver List</h2>
                        <p className="mt-1 text-xs text-gray-500">View driver details and assigned vehicles.</p>
                    </div>

                    <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Driver</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">License Number</th>
                                <th className="px-4 py-3">Assigned Vehicle</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {visibleDrivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                                                {driver.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-800">{driver.name}</span>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">{driver.phone}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">{driver.license}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-gray-600">{driver.vehicle}</td>

                                    <td className="whitespace-nowrap px-4 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${driver.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {driver.status}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button title="View Driver" className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => { setEditingId(driver.id); setShowForm(true); }} title="Edit Driver" className="rounded-md border border-gray-200 p-2 text-blue-600 hover:bg-blue-50">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => removeDriver(driver.id)} title="Delete Driver" className="rounded-md border border-gray-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && <div className="fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4"><form onSubmit={saveDriver} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{editingId ? "Edit driver" : "Add driver"}</h2><button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-500">Close</button></div>{[["name", "Full name"], ["phone", "Phone number"], ["license", "License number"]].map(([name, label]) => <label key={name} className="block text-sm font-medium">{label}<input name={name} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue={drivers.find((driver) => driver.id === editingId)?.[name] || ""} /></label>)}<label className="block text-sm font-medium">Assigned vehicle<select name="vehicle_id" defaultValue={drivers.find((driver) => driver.id === editingId)?.vehicle_id || ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Not assigned</option>{vehicles.map((vehicle) => <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>{vehicle.vehicle_number} · {vehicle.vehicle_type}</option>)}</select></label><button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Save driver</button></form></div>}

        </div>
    );
};

export default Drivers;
