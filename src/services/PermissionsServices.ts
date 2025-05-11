import axios from "./Custom_axios";

const API_BASE_URL = "/api/userpermissions";

// Lấy danh sách phân quyền theo idUser
export const getUserPermissionsById = async (idUser: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${idUser}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user permissions by ID:", error);
        throw error;
    }
};

// Lấy phân quyền theo idUser và tên quyền
export const getUserPermissionByName = async (idUser: number, name: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${idUser}/name/${name}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user permission by name:", error);
        throw error;
    }
};

// Tạo mới phân quyền
export const createUserPermission = async (idUser: number, permissionList: string[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, {
            IdUser: idUser,
            PermissionList: permissionList,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user permission:", error);
        throw error;
    }
};

// Cập nhật phân quyền
export const updateUserPermission = async (idUser: number, idPermission: number) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${idUser}/${idPermission}`);
        return response.data;
    } catch (error) {
        console.error("Error updating user permission:", error);
        throw error;
    }
};

// Xóa phân quyền
export const deleteUserPermission = async (idUser: number) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${idUser}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user permission:", error);
        throw error;
    }
};