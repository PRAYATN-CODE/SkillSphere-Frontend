import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const createAxiosInstance = () => {

    const headers = {
        "Content-Type": "application/json",
    };

    return axios.create({
        baseURL: BASE_URL,
        headers,
    });
};

// Export the function that returns the axios instance
const axiosInstance = createAxiosInstance();
export default axiosInstance;