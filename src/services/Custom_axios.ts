import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000", // ← Chính là backend FastAPI bạn đang chạy
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
)

export default instance;
