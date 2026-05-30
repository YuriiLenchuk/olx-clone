import axios from "axios";
import { removeAuthToken } from "@/Utils/authToken";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';

        if (
            status === 401 &&
            !url.includes('/auth/login') &&
            !url.includes('/auth/registration')
        ) {
            removeAuthToken();
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;