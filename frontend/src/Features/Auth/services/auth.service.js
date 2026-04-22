import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

const registerUser = async (userData) => {
    try {
        const response = await authApiInstance.post(`/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (userData) => {
    try {
        const response = await authApiInstance.post(`/login`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const googleAuth = () => {
    window.location.href = "/api/auth/google";
};

export { registerUser, loginUser, googleAuth };