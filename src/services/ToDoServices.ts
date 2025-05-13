import axios from "./Custom_axios";

// Lấy danh sách ToDos theo phân trang
export const getToDosPagination = async (page: number, size: number) => {
    return await axios.get(`/api/todos/`, {
        params: { page, pageSize: size },
    });
};

// Tạo mới một ToDo
export const createToDo = async (toDoData: { IdProjectMember: number; IdTask: number }) => {
    return await axios.post(`/api/todos/`, toDoData);
};

// Lấy thông tin ToDo theo ID
export const getToDoById = async (id: number) => {
    return await axios.get(`/api/todos/${id}`);
};

// Cập nhật ToDo
export const updateToDo = async (id: number, toDoData: { IdProjectMember?: number; IdTask?: number }) => {
    return await axios.put(`/api/todos/${id}`, toDoData);
};

// Xóa ToDo
export const deleteToDo = async (id: number) => {
    return await axios.delete(`/api/todos/${id}`);
};

// Lấy danh sách ToDos theo IdProjectMember
export const getToDosByProjectMember = async (projectMemberId: number) => {
    return await axios.get(`/api/todos/projectMember/${projectMemberId}`);
};

// Lấy danh sách ToDos theo Task Title
export const getToDosByTaskTitle = async (taskTitle: string) => {
    return await axios.get(`/api/todos/task/${taskTitle}`);
};