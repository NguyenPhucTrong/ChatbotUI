import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000", // ← Chính là backend FastAPI bạn đang chạy
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;
