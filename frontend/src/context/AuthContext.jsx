import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth/auth.service.js";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
    checkAuthStatus();
}, []);

const checkAuthStatus = async () => {
    try {
        const data = await authService.getSession();
        setUser(data.usuario);
    } catch (error) {
        setUser(null);
    } finally{
        setLoading(false);
    }
}

const login = async (credenciales) => {
    const data = await authService.login(credenciales);
    setUser(data.usuario);
    return data;
}

const logout = async () => {
    try {
        await authService.logout();
    } finally {
        setUser(null);
        setLoading(false);
    }
};

return (
    <AuthContext.Provider value= {{user, loading, login, logout, checkAuthStatus}}>
        {children}
    </AuthContext.Provider>
);

};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }

    return context;
};


