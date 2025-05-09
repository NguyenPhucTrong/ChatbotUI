import React, { useEffect, useState } from "react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import { getAllProjects } from "../services/ProjectsServices";
import {
  getAllTasks,
  updateTask,
  deleteTaskAPI,
  createTask,
} from "../services/TaskServices";

import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProjectMembers } from "../services/ProjectMembers";
import SearchAndFilters from "../components/SearchAndFilters";
import ProjectTable from "../components/ProjectTable";

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

interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: string; // UserRole trong ProjectMembers
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
  const [editingAssignee, setEditingAssignee] = useState<{
    projectId: number | null;
    taskId: number | null;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [members, setMembers] = useState<Member[]>([]);

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
            dueDate: task.DueDate
              ? normalizeDate(task.DueDate)
              : new Date().toISOString().split("T")[0], // Chuẩn hóa DueDate
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

  useEffect(() => {
    const fetchMembersForProject = async () => {
      if (!projects.length) return;

      // Lấy danh sách thành viên cho dự án đầu tiên (hoặc dự án được chọn)
      const firstProjectId = projects[0].id;
      try {
        const response = await getProjectMembers(firstProjectId);
        const membersData = response.data;

        // Kiểm tra nếu `membersData` là một mảng
        if (!Array.isArray(membersData)) {
          console.warn("Invalid response format:", membersData);
          setMembers([]); // Đặt danh sách thành viên rỗng nếu không có dữ liệu
          return;
        }

        // Ánh xạ dữ liệu trả về
        const data = membersData.map((member: any) => ({
          id: member.IdUser,
          fullname: member.Fullname,
          email: member.Email,
          phoneNumber: member.PhoneNumber,
          role: member.UserRole,
        }));

        setMembers(data); // Cập nhật state members
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load project members.");
      }
    };

    fetchMembersForProject();
  }, [projects]); // Chạy lại khi danh sách dự án thay đổi

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
      window.dispatchEvent(new Event("taskUpdated"));
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
    if (!newTitle.trim()) {
      toast.error("Tiêu đề không được để trống.");
      return;
    }

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
    const formattedDueDate = `${String(selectedDate.getDate()).padStart(
      2,
      "0"
    )}-${String(selectedDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${selectedDate.getFullYear()}`;

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
                task.id === taskId
                  ? { ...task, dueDate: formattedDueDate }
                  : task
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

  const handleAssignMemberToTask = async (
    projectId: number,
    taskId: number,
    assignee: string
  ) => {
    const updatedTask = projects
      .find((project) => project.id === projectId)
      ?.tasks.find((task) => task.id === taskId);

    if (!updatedTask) {
      toast.error("Task không tồn tại.");
      return;
    }

    const payload = {
      Title: updatedTask.title,
      Status: mapStatusToBackend(updatedTask.status),
      DueDate: updatedTask.dueDate,
      Priority: updatedTask.priority as "Low" | "Medium" | "High",
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
      Assignee: assignee, // Thêm Assignee vào payload
    };

    try {
      console.log("Payload gửi đến API:", payload);
      await updateTask(taskId, payload);

      // Cập nhật state `projects` để phản ánh thay đổi
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, assignee } : task
              ),
            };
          }
          return project;
        })
      );

      toast.success("Gán thành viên thành công!");
    } catch (error) {
      console.error("Lỗi khi gán thành viên:", error);
      toast.error("Không thể gán thành viên.");
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
    <div className="p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
      <h1 className="text-3xl font-semibold my-6 text-gray-800">
        Task Management
      </h1>

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {/* Project Tables */}
      {projects.map((project) => (
        <ProjectTable
          key={project.id}
          project={project}
          members={members}
          filteredTasks={filteredTasks}
          handleEditTitle={handleEditTitle}
          handleEditDueDate={handleEditDueDate}
          updateTaskStatus={updateTaskStatus}
          updateTaskPriority={updateTaskPriority}
          handleAssignMemberToTask={handleAssignMemberToTask}
          deleteTask={deleteTask}
          addTask={addTask}
        />
      ))}
    </div>
  );
}
