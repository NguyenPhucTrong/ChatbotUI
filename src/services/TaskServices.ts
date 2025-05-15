import axios from "./Custom_axios";

// Lấy toàn bộ danh sách task
const getAllTasks = async () => {
  return await axios.get("/api/tasks", {
    params: { page: 1, pageSize: 100, searchTerm: "" },
  }); // Không cần tham số phân trang
};

function convertDate(input: string) {
  const [year, month, day] = input.split("-");
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  return `${paddedDay}/${paddedMonth}/${year}`;
}

function convertDateandNextMonth(input: string) {
  let [year, month, day] = input.split("-").map((str) => parseInt(str));
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  const paddedDay = String(day).padStart(2, "0");
  const paddedMonth = String(month).padStart(2, "0");

  return `${paddedDay}/${paddedMonth}/${year}`;
}

// Tạo mới một task
const createTask = async (taskData: {
  Title: string;
  Status?: "Pending" | "In Progress" | "Completed" | "Blocked";
  DueDate: string;
  Priority?: "Low" | "Medium" | "High";
  IdProject: number;
}) => {
  let currentDate = taskData.DateCreate;
  taskData.DateCreate = convertDate(currentDate);
  taskData.DueDate = convertDateandNextMonth(currentDate);
  console.log(taskData);
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
