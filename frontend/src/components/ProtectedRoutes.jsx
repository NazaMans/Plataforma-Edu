import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoutes = () => {
    const {user, loading} = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

     return <Outlet />
}