import axios from "./Custom_axios";

// Lấy toàn bộ danh sách task
const getAllTasks = async () => {
  return await axios.get("/api/tasks"); // Không cần tham số phân trang
};

// Tạo mới một task
const createTask = async (taskData: {
  Title: string;
  Status?: "Pending" | "In Progress" | "Completed" | "Blocked";
  DueDate: string;
  Priority?: "Low" | "Medium" | "High";
  IdProject: number;
}) => {
  return await axios.post("/api/tasks", taskData);
};

// Lấy thông tin chi tiết task theo ID
const getTaskById = async (id: number) => {
  return await axios.get(`/api/tasks/${id}`);
};

// Cập nhật thông tin task theo ID
const updateTask = async (
  id: number,
  taskData: {
    Title?: string;
    Status?: "Pending" | "In Progress" | "Completed" | "Blocked";
    DueDate?: string;
    Priority?: "Low" | "Medium" | "High";
    IdProject?: number;
    DateCreate?: string;
  }
) => {
  return await axios.put(`/api/tasks/${id}`, taskData);
};

// Xóa task theo ID
const deleteTaskAPI = async (id: number) => {
  return await axios.delete(`/api/tasks/${id}`);
};

export { getAllTasks, createTask, getTaskById, updateTask, deleteTaskAPI };
