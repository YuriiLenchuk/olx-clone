import axios from "axios";
import { removeAuthToken } from "@/Utils/authToken";

let isHandlingUnauthorized = false;

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

        const isAuthAction =
            url.includes('/auth/login') ||
            url.includes('/auth/registration');

        if (status === 401 && !isAuthAction && !isHandlingUnauthorized) {
            isHandlingUnauthorized = true;
            removeAuthToken();

            setTimeout(() => {
                isHandlingUnauthorized = false;
            }, 1000);
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;