import axios from "./Custom_axios";


// Lấy toàn bộ danh sách dự án
const getAllProjects = async () => {
    return await axios.get('/api/projects'); // Không cần tham số phân trang
};

// Tạo mới một dự án
const createProject = async (projectData: {
    ProjectName: string;
    DateCreate: string;
    Manager: number;
    Status?: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
    Priority?: 'Low' | 'Medium' | 'High';
}) => {
    return await axios.post('/api/projects', projectData);
};

// Lấy thông tin chi tiết dự án theo ID
const getProjectById = async (id: number) => {
    return await axios.get(`/api/projects/${id}`);
};

// Cập nhật thông tin dự án theo ID
const updateProject = async (
    id: number,
    projectData: {
        ProjectName?: string;
        DateCreate?: string;
        Manager?: number;
        Status?: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
        Priority?: 'Low' | 'Medium' | 'High';
    }
) => {
    return await axios.put(`/api/projects/${id}`, projectData);
};

// Xóa dự án theo ID
const deleteProject = async (id: number) => {
    return await axios.delete(`/api/projects/${id}`);
};

export { getAllProjects, createProject, getProjectById, updateProject, deleteProject };