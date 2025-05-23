import axios from './Custom_axios';

// Lấy danh sách user với phân trang
export const getUsersPagination = async (page: number, size: number, searchTerm: string = '') => {
    return await axios.get(`/api/users/`, {
        params: { page, pageSize: size, searchTerm },
    });
};
export const getAllUsers = async () => {
    return await axios.get('/api/users');
};

// const getCurrentUser = async () => {
//     return await axios.get('/api/auth/me', {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('userToken')}`,
//         },
//     })
// }


// Tạo user mới
export const createUser = async (user: {
    username: string;
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
    role?: string;
    permission?: string;
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
    },
    token: string | null // Thêm tham số token
) => {
    return await axios.put(`/api/users/${id}`, user, { // Thêm config object
        headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào header
        },
    });
};

// Xóa user theo ID
export const deleteUser = async (id: number, token: string | null) => {
    if (!token) {
        throw new Error('Token is required');
    }
    return await axios.delete(`/api/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            // Add any additional headers if needed
        },
    });
};

// Lấy thông tin user theo email
export const getUserByEmail = async (email: string) => {
    return await axios.get(`/api/users/email/${email}`);
};

// Lấy thông tin user theo username
export const getUserByUsername = async (username: string) => {
    return await axios.get(`/api/users/username/${username}`);
};

