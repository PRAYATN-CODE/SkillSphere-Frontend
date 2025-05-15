import axios from "@/config/axios";


const register = async (userData) => {
    try {
        const response = await axios.post(`/api/auth/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const login = async (userData) => {
    try {
        const response = await axios.post(`/api/auth/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

export default {
    register,
    login,
    logout
};