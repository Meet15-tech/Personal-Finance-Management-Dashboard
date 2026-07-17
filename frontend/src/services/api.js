import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Attach the JWT to authenticated requests.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("pfm_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Remove invalid authentication data after an unauthorized response.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("pfm_token");
            localStorage.removeItem("pfm_user");
        }

        return Promise.reject(error);
    }
);

export default api;