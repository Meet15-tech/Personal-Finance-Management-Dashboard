import { createContext, useCallback, useMemo, useState } from "react";
import {
    loginUser as loginUserRequest,
    registerUser as registerUserRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("pfm_user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        localStorage.removeItem("pfm_user");
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);
    const [token, setToken] = useState(
        () => localStorage.getItem("pfm_token") || ""
    );
    const [loading, setLoading] = useState(false);

    const saveAuthentication = useCallback((authData) => {
        localStorage.setItem("pfm_token", authData.token);
        localStorage.setItem("pfm_user", JSON.stringify(authData.user));

        setToken(authData.token);
        setUser(authData.user);
    }, []);

    const register = useCallback(
        async (formData) => {
            setLoading(true);

            try {
                const authData = await registerUserRequest(formData);
                saveAuthentication(authData);
                return authData;
            } finally {
                setLoading(false);
            }
        },
        [saveAuthentication]
    );

    const login = useCallback(
        async (credentials) => {
            setLoading(true);

            try {
                const authData = await loginUserRequest(credentials);
                saveAuthentication(authData);
                return authData;
            } finally {
                setLoading(false);
            }
        },
        [saveAuthentication]
    );

    const logout = useCallback(() => {
        localStorage.removeItem("pfm_token");
        localStorage.removeItem("pfm_user");

        setToken("");
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            isAuthenticated: Boolean(token && user),
            register,
            login,
            logout,
        }),
        [user, token, loading, register, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}