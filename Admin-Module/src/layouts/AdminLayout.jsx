import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <div className="hidden lg:block"><Sidebar /></div>
            {menuOpen && <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden" onClick={() => setMenuOpen(false)}><div className="h-full w-64" onClick={(event) => { if (event.target.closest("a")) setMenuOpen(false); }}><Sidebar /></div></div>}

            <div className="flex flex-col flex-1 overflow-hidden">

                <Navbar onMenuClick={() => setMenuOpen(true)} />

                <div className="flex-1 overflow-y-auto ">
                    <Outlet />
                </div>

                <Footer />

            </div>

        </div>
    );
}

export default AdminLayout;

