import axios from "axios";
import { getAuthToken, removeAuthToken } from "@/Utils/authToken";

let isHandlingUnauthorized = false;

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
        "Content-Type": "application/json",
    },
});

function getRequestToken(error) {
    const headers = error?.config?.headers || {};
    const authHeader =
        typeof headers.get === 'function'
            ? headers.get('Authorization')
            : headers.Authorization || headers.authorization || '';

    return typeof authHeader === 'string'
        ? authHeader.replace(/^Bearer\s+/i, '')
        : '';
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';

        const isAuthAction =
            url.includes('/auth/login') ||
            url.includes('/auth/registration');

        const requestToken = getRequestToken(error);
        const currentToken = getAuthToken();

        if (
            status === 401 &&
            !isAuthAction &&
            currentToken &&
            requestToken &&
            requestToken === currentToken &&
            !isHandlingUnauthorized
        ) {
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