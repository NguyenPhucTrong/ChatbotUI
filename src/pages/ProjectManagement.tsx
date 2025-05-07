import React, { useEffect, useState } from "react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import { getAllProjects } from "../services/ProjectsServices";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTaskAPI,
} from "../services/TaskServices";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  assignee: string;
  createdAt: string;
  projectId: number; // Added projectId property
}

interface Project {
  id: number;
  name: string;
  tableName: string; // Added tableName property
  tasks: Task[];
}

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-green-500 text-white",
};

const statusColors: { [key: string]: string } = {
  "In Progress": "bg-blue-500 text-white",
  Pending: "bg-orange-500 text-white",
  "Not Started": "bg-gray-500 text-white",
  Completed: "bg-green-500 text-white",
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [isEditing, setIsEditing] = useState<{
    tableId: number | null;
    taskId: number | null;
    field: keyof Task | null;
  }>({ tableId: null, taskId: null, field: null });
  const [editedTitle, setEditedTitle] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.error("Vui lòng đăng nhập để truy cập trang này.");
    return <Navigate to="/" />;
  }

  const mapStatusToBackend = (status: string): string => {
    if (status === "Not Started") return "Blocked";
    return status;
  };

  const mapStatusToFrontend = (status: string): string => {
    if (status === "Blocked") return "Not Started";
    return status;
  };

  const normalizeDate = (dateString: string): string => {
    // Kiểm tra nếu định dạng là DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`; // Chuyển thành YYYY-MM-DD
    }

    // Kiểm tra nếu định dạng là DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`; // Chuyển thành YYYY-MM-DD
    }

    // Nếu không khớp định dạng, trả về giá trị mặc định
    console.warn("Invalid date format:", dateString);
    return new Date().toISOString().split("T")[0]; // Ngày hiện tại
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách dự án
        const projectResponse = await getAllProjects();
        console.log(
          "Dữ liệu trả về từ API getAllProjects:",
          projectResponse.data.data
        );

        const projectsData = projectResponse.data.data.map((project: any) => ({
          id: project.IdProject,
          name: project.ProjectName,
          tasks: [], // Sẽ gắn task sau
        }));

        // Lấy danh sách task
        const taskResponse = await getAllTasks();
        const tasksData = taskResponse.data.data.map((task: any) => {
          console.log("Task DueDate:", task.DueDate); // Debug giá trị DueDate
          return {
            id: task.IdTask,
            title: task.Title,
            status: mapStatusToFrontend(task.Status),
            dueDate: task.DueDate ? normalizeDate(task.DueDate) : new Date().toISOString().split("T")[0], // Chuẩn hóa DueDate
            priority: task.Priority,
            assignee: "Unassigned", // Nếu API không trả về assignee
            projectId: task.IdProject,
            createdAt: task.DateCreate, // Thay đổi tên thuộc tính cho phù hợp với API
          };
        });

        // Gắn task vào dự án tương ứng
        const projectsWithTasks = projectsData.map((project: Project) => ({
          ...project,
          tasks: tasksData.filter(
            (task: Task) => task.projectId === project.id
          ),
        }));

        setProjects(projectsWithTasks);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // const startEditing = (tableId: number, taskId: number, currentAssignee: string) => {
  //     setIsEditing({ tableId, taskId });
  //     setEditAssignee(currentAssignee);
  // };

  // const createNewTable = () => {
  //     const tableName = prompt('Enter table name:');
  //     if (tableName) {
  //         const newTable: Project = {
  //             id: projects.length + 1, // Tạo ID mới cho bảng
  //             name: tableName, // Tên bảng do người dùng nhập
  //             tableName: `Table ${tableName}`, // Tên hiển thị của bảng
  //             tasks: [
  //                 {
  //                     id: 1, // ID mặc định cho task đầu tiên
  //                     title: 'New Task', // Tên mặc định
  //                     status: 'Not Started', // Trạng thái mặc định
  //                     dueDate: '01/01/2025', // Ngày hết hạn mặc định
  //                     priority: 'Low', // Mức độ ưu tiên mặc định
  //                     assignee: 'Unassigned', // Người được giao mặc định
  //                     projectId: projects.length + 1, // ID của bảng mới
  //                 },
  //             ], // Danh sách task mặc định
  //         };

  //         // Cập nhật state `projects` để thêm bảng mới
  //         setProjects([...projects, newTable]);
  //         toast.success(`Bảng "${tableName}" đã được tạo thành công với một task mặc định!`);
  //     }
  // };

  const addTask = async (projectId: number) => {
    const newTask: Task = {
      id: Date.now(), // Tạo ID tạm thời để React nhận diện
      title: "New Task", // Tên mặc định
      status: "Pending", // Trạng thái mặc định (chỉ dùng trên frontend)
      dueDate: "01/01/2025", // Ngày hết hạn mặc định
      priority: "Low", // Mức độ ưu tiên mặc định
      assignee: "Unassigned", // Người được giao mặc định
      projectId: projectId, // ID dự án
      createdAt: new Date().toISOString(), // Thời gian tạo task
    };

    try {
      // Format DateCreate để phù hợp với backend
      const formattedDateCreate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      // Tạo payload gửi lên backend
      const payload = {
        Title: newTask.title,
        Status: mapStatusToBackend(newTask.status), // Chuyển đổi giá trị Status
        DueDate: newTask.dueDate,
        Priority: newTask.priority as "Low" | "Medium" | "High",
        IdProject: newTask.projectId,
        DateCreate: formattedDateCreate, // Thêm DateCreate vào payload
      };

      console.log("Payload gửi đến API:", payload); // Debug payload

      // Gọi API để lưu task vào database
      const response = await createTask(payload);

      // Backend trả về task đã được lưu (bao gồm ID mới)
      const savedTask = response.data;

      // Cập nhật state `projects` với task mới
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: [...project.tasks, { ...newTask, id: savedTask.IdTask }],
            };
          }
          return project;
        })
      );

      toast.success("Task đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm task:", error);
      toast.error("Không thể thêm task.");
    }
  };

  // Hàm chỉnh sửa tiêu đề (title)
  const handleEditTitle = async (
    projectId: number,
    taskId: number,
    newTitle: string
  ) => {
    const updatedTask = projects
      .find((project) => project.id === projectId)
      ?.tasks.find((task) => task.id === taskId);

    if (!updatedTask) {
      toast.error("Không tìm thấy task để cập nhật.");
      return;
    }

    const payload = {
      Title: newTitle,
      Status: mapStatusToBackend(updatedTask.status), // Chuyển đổi giá trị Status
      DueDate: updatedTask.dueDate,
      Priority: updatedTask.priority as "Low" | "Medium" | "High" | undefined,
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
    };

    try {
      console.log("Payload gửi đến API:", payload); // Debug payload
      await updateTask(taskId, payload);
      // Cập nhật state `projects` để phản ánh thay đổi
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle } : task
              ),
            };
          }
          return project;
        })
      );
      toast.success("Cập nhật tiêu đề thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật tiêu đề:", error);
      toast.error("Không thể cập nhật tiêu đề.");
    }
  };

  // Hàm chỉnh sửa ngày đến hạn (DueDate)

  const handleEditDueDate = async (
    projectId: number,
    taskId: number,
    newDueDate: string
  ) => {
    if (!newDueDate || isNaN(Date.parse(newDueDate))) {
      toast.error("Ngày hết hạn không hợp lệ.");
      return;
    }

    // Kiểm tra nếu ngày mới nằm trong quá khứ
    const today = new Date();
    const selectedDate = new Date(newDueDate);
    if (selectedDate.getTime() < today.setHours(0, 0, 0, 0)) {
      toast.error("Ngày hết hạn không thể là ngày trong quá khứ.");
      return;
    }

    // Định dạng lại ngày thành DD-MM-YYYY
    const formattedDueDate = `${String(selectedDate.getDate()).padStart(2, "0")}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${selectedDate.getFullYear()}`;

    const updatedTask = projects
      .find((project) => project.id === projectId)
      ?.tasks.find((task) => task.id === taskId);

    if (!updatedTask) {
      toast.error("Không tìm thấy task để cập nhật.");
      return;
    }

    const payload = {
      Title: updatedTask.title,
      Status: mapStatusToBackend(updatedTask.status), // Chuyển đổi giá trị Status
      DueDate: formattedDueDate, // Sử dụng ngày đã định dạng
      Priority: updatedTask.priority as "Low" | "Medium" | "High" | undefined,
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
    };

    try {
      console.log("Payload gửi đến API:", payload); // Debug payload
      await updateTask(taskId, payload);

      // Cập nhật state `projects` để phản ánh thay đổi
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, dueDate: formattedDueDate } : task
              ),
            };
          }
          return project;
        })
      );

      toast.success("Cập nhật ngày hết hạn thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật ngày hết hạn:", error);
      toast.error("Không thể cập nhật ngày hết hạn.");
    }
  };

  const handleEditTask = (
    projectId: number,
    taskId: number,
    field: keyof Task,
    value: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, [field]: value };
              }
              return task;
            }),
          };
        }
        return project;
      })
    );

    // Gọi API để lưu thay đổi vào backend
    try {
      const updatedTask = projects
        .find((project) => project.id === projectId)
        ?.tasks.find((task) => task.id === taskId);
      if (updatedTask) {
        console.log("Payload gửi đến API:", {
          Title: updatedTask.title,
          Status: updatedTask.status,
          DueDate: updatedTask.dueDate,
          Priority: updatedTask.priority,
          IdProject: updatedTask.projectId,
        });
        updateTask(taskId, {
          Title: updatedTask.title,
          Status: updatedTask.status as
            | "Pending"
            | "In Progress"
            | "Completed"
            | "Blocked"
            | undefined,
          DueDate: updatedTask.dueDate,
          Priority: updatedTask.priority as
            | "Low"
            | "Medium"
            | "High"
            | undefined,
          IdProject: updatedTask.projectId,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật task:", error);
    }
  };

  const updateTaskStatus = async (
    projectId: number,
    taskId: number,
    newStatus: string
  ) => {
    const backendStatus = mapStatusToBackend(newStatus); // Chuyển đổi giá trị cho backend

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        return project;
      })
    );

    try {
      const updatedTask = projects
        .find((project) => project.id === projectId)
        ?.tasks.find((task) => task.id === taskId);

      if (updatedTask) {
        await updateTask(taskId, {
          Title: updatedTask.title,
          Status: backendStatus as
            | "Pending"
            | "In Progress"
            | "Completed"
            | "Blocked",
          DueDate: updatedTask.dueDate,
          Priority: updatedTask.priority as "Low" | "Medium" | "High",
          IdProject: updatedTask.projectId,
          DateCreate: updatedTask.createdAt,
        });
        toast.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error(`Failed to update task ${taskId} status:`, error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  // Removed duplicate declaration of updateTaskPriority

  const updateTaskPriority = async (
    projectId: number,
    taskId: number,
    newPriority: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, priority: newPriority } : task
            ),
          };
        }
        return project;
      })
    );

    try {
      const updatedTask = projects
        .find((project) => project.id === projectId)
        ?.tasks.find((task) => task.id === taskId);

      if (updatedTask) {
        const payload = {
          Title: updatedTask.title,
          Status: mapStatusToBackend(updatedTask.status), // Chuyển đổi giá trị Status
          DueDate: updatedTask.dueDate,
          Priority: newPriority as "Low" | "Medium" | "High",
          IdProject: updatedTask.projectId,
          DateCreate: updatedTask.createdAt,
        };

        console.log("Payload gửi đến API:", payload); // Debug payload
        await updateTask(taskId, payload);
        toast.success("Cập nhật mức độ ưu tiên thành công!");
      }
    } catch (error) {
      console.error(`Failed to update task ${taskId} priority:`, error);
      toast.error("Cập nhật mức độ ưu tiên thất bại");
    }
  };

  const filteredTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      return (
        (filterStatus === "All" || task.status === filterStatus) &&
        (filterPriority === "All" || task.priority === filterPriority) &&
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const deleteTask = async (projectId: number, taskId: number) => {
    try {
      // Gọi API để xóa task khỏi backend
      await deleteTaskAPI(taskId); // Sử dụng hàm deleteTask từ TaskServices.ts

      // Cập nhật state `projects` để xóa task khỏi giao diện
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            };
          }
          return project;
        })
      );

      toast.success("Task đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa task:", error);
      toast.error("Không thể xóa task.");
    }
  };

  return (
    <div className="  p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
      <h1 className="text-3xl font-semibold my-6 text-gray-800">
        Task Management
      </h1>

      {/* Search Input and Filter Options */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <MdSearch
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>
        <div className="flex flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pl-3 pr-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Not Started">Not Started</option>
              <option value="Completed">Completed</option>
            </select>
            {/* Custom arrow icon */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              ▼
            </div>
          </div>
          <div className="relative w-full md:w-auto">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full appearance-none pl-3 pr-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {/* Custom arrow icon */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Project Table */}
      {projects.map((project) => (
        <div
          key={project.id}
          className="w-full overflow-x-auto mx-auto mt-6 mb-6"
        >
          <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>

          <table className="min-w-full bg-white border border-gray-300 rounded shadow border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 min-w-[333px] bg-gray-200">Task</th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Created At
                </th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Status
                </th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Due Date
                </th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Priority
                </th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Assignee
                </th>
                <th className="border px-4 py-2 min-w-[200px] bg-gray-200">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks(project.tasks).map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-100 text-center items-center"
                >
                  {/* Cột Task */}
                  <td className="border-b px-6 py-4">
                    {isEditing?.tableId === project.id &&
                      isEditing?.taskId === task.id &&
                      isEditing?.field === "title" ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEditTitle(project.id, task.id, editedTitle);
                            setIsEditing({
                              tableId: null,
                              taskId: null,
                              field: null,
                            });
                          }
                        }}
                        onBlur={() => {
                          handleEditTitle(project.id, task.id, editedTitle);
                          setIsEditing({
                            tableId: null,
                            taskId: null,
                            field: null,
                          });
                        }}
                        className="border px-2 py-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditedTitle(task.title); // Đặt giá trị hiện tại vào input
                          setIsEditing({
                            tableId: project.id,
                            taskId: task.id,
                            field: "title",
                          });
                        }}
                        className="cursor-pointer"
                      >
                        {task.title}
                      </span>
                    )}
                  </td>

                  {/* Cột CreatedAt */}
                  <td className="border-b px-6 py-4">
                    {new Date(task.createdAt).toLocaleString()}{" "}
                    {/* Hiển thị thời gian tạo task */}
                  </td>

                  {/* Cột Status */}
                  <td className="border-b px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(project.id, task.id, e.target.value)
                      }
                      className={`px-4 py-2 rounded-full ${statusColors[task.status]
                        } appearance-none`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Cột DueDate */}
                  <td className="border-b px-6 py-4">
                    {isEditing?.tableId === project.id &&
                      isEditing?.taskId === task.id &&
                      isEditing?.field === "dueDate" ? (
                      <ReactDatePicker
                        selected={new Date(task.dueDate)} // Chuyển đổi `dueDate` thành đối tượng Date
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formattedDate = date
                              .toISOString()
                              .split("T")[0]; // Định dạng thành `YYYY-MM-DD`
                            handleEditDueDate(
                              project.id,
                              task.id,
                              formattedDate
                            );
                          }
                          setIsEditing({
                            tableId: null,
                            taskId: null,
                            field: null,
                          });
                        }}
                        onBlur={() =>
                          setIsEditing({
                            tableId: null,
                            taskId: null,
                            field: null,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() =>
                          setIsEditing({
                            tableId: project.id,
                            taskId: task.id,
                            field: "dueDate",
                          })
                        }
                        className="cursor-pointer"
                      >
                        {task.dueDate}
                      </span>
                    )}
                  </td>

                  <td className="border-b px-6 py-4">
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        updateTaskPriority(project.id, task.id, e.target.value)
                      }
                      className={`px-4 py-2 rounded-full text-center items-center ${priorityColors[task.priority]
                        } appearance-none`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>

                  {/* Cột Assignee */}
                  <td className="border-b px-6 py-4">
                    {isEditing?.tableId === project.id &&
                      isEditing?.taskId === task.id &&
                      isEditing?.field === "assignee" ? (
                      <input
                        type="text"
                        value={task.assignee}
                        onChange={(e) => {
                          if (!isComposing) {
                            handleEditTask(
                              project.id,
                              task.id,
                              "assignee",
                              (e.target as HTMLInputElement).value
                            );
                          }
                        }}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={(e) => {
                          setIsComposing(false);
                          handleEditTask(
                            project.id,
                            task.id,
                            "assignee",
                            (e.target as HTMLInputElement).value
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setIsEditing({
                              tableId: null,
                              taskId: null,
                              field: null,
                            });
                          }
                        }}
                        onBlur={() =>
                          setIsEditing({
                            tableId: null,
                            taskId: null,
                            field: null,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() =>
                          setIsEditing({
                            tableId: project.id,
                            taskId: task.id,
                            field: "assignee",
                          })
              