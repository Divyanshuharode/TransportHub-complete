import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import adminStore from "../../store/admin.store";
import { logoutAdmin } from "../../services/auth.service";

function Navbar({ onMenuClick }) {
    const navigate = useNavigate();

    const { logOut } = adminStore();

    const logout = () => {
        logoutAdmin().catch(() => {}).finally(logOut);
        navigate("/");
    };

    return (
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21}/></button>
                <div>
                <h1 className="text-sm font-semibold text-slate-800">Admin Panel</h1>
                <p className="text-xs text-slate-500">Welcome back, Admin</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={logout} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;

