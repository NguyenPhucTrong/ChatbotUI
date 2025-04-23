import axios from './Custom_axios';

// Lấy danh sách user với phân trang
export const getUsersPagination = async (page: number, size: number) => {
    return await axios.get(`/api/users`, {
        params: { page, size },
    });
};

// Tạo user mới
export const createUser = async (user: {
    username: string;
    fullname: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
    permission?: string; // Tùy chọn
}) => {
    return await axios.post(`/api/users`, user);
};

// Lấy thông tin user theo ID
export const getUserById = async (id: number) => {
    return await axios.get(`/api/users/${id}`);
};

// Cập nhật thông tin user
export const updateUser = async (
    id: number,
    user: {
        username?: string;
        fullname?: string;
        phoneNumber?: string;
        email?: string;
        password?: string;
        role?: string;
        permission?: string; // Tùy chọn
    }
) => {
    return await axios.put(`/api/users/${id}`, user);
};

// Xóa user theo ID
export const deleteUser = async (id: number) => {
    return await axios.delete(`/api/users/${id}`);
};

// Lấy thông tin user theo email
export const getUserByEmail = async (email: string) => {
    return await axios.get(`/api/users/email/${email}`);
};

// Lấy thông tin user theo username
export const getUserByUsername = async (username: string) => {
    return await axios.get(`/api/users/username/${username}`);
};

