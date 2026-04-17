import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/v1/auth",
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

export { registerUser, loginUser };