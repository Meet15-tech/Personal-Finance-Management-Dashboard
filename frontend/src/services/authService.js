import api from "./api";

const normalizeAuthResponse = (response) => {
    const responseBody = response.data;

    // Supports both:
    // { data: { token, user } }
    // and { token, user }
    const authData = responseBody.data || responseBody;

    if (!authData.token || !authData.user) {
        throw new Error("Invalid authentication response from server");
    }

    return {
        token: authData.token,
        user: authData.user,
        message: responseBody.message || "Authentication successful",
    };
};

export const registerUser = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return normalizeAuthResponse(response);
};

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return normalizeAuthResponse(response);
};