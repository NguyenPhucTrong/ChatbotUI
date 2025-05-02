import axios from "./Custom_axios";

export const loginAuth = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username.trim());
    formData.append('password', password.trim());

    const response = await axios.post('/api/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
}

export const verifyToken = async (token: string) => {
    const response = await axios.post('/api/verify-token', { token }, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data;
}

export const register = async (user: { username: string, password: string, email?: string }) => {
    const response = await axios.post('/api/register', user, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    return response.data;
}
