import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import adminStore from "../store/admin.store";
import { getAdminSession } from "../services/auth.service";

function ProtectedRoute({ children }) {

    const { isAuthenticated, isChecking, loginInfo, logOut, setChecking } = adminStore();

    useEffect(() => { setChecking(true); getAdminSession().then(({ data }) => loginInfo(data.data)).catch(logOut); }, []);

    if (isChecking) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading admin session...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
