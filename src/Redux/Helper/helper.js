import axios from "axios";
import cookies from "js-cookie";
export const axiosInstance = axios.create({
    baseURL: "https://shopdesi-api.onrender.com"
})
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || cookies.get("token") || sessionStorage.getItem("token");
    if (token) {
        config.headers["x-auth-user-token"] = token;
    }
    return config;
})