import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoutes = () => {
    const {user, loading} = useAuth();

    if (loading) {
        return <div>Cargando sesion...</div>

        if (!user) {
            return <Navigate to="/login" replace />
        }

        return <Outlet />
    }
}