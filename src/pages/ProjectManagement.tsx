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
import { Navigate, useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProjectMembers } from "../services/ProjectMembers";
import SearchAndFilters from "../components/SearchAndFilters";
import ProjectTable from "../components/ProjectTable";
import { useDropzone } from "react-dropzone";
import axios from "../services/Custom_axios";
import { useNotification } from "../context/NotificationProvider";
import { getUsersPagination } from "../services/UserServices";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  assignee: string;
  createdAt: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  tableName: string;
  tasks: Task[];
}

interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
  publicId: string;
  folder: string;
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

const UploadFileModal: React.FC<{
  projectId: number;
  projectName: string;
  onClose: () => void;
}> = ({ projectId, projectName, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [folderPath, setFolderPath] = useState(`projects/${projectId}`);

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL!;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET!;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
        toast.success(`${acceptedFiles.length} file(s) added!`);
      }
    },
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/json": [".json"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload!");
      return;
    }

    setIsUploading(true);

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderPath);
      formData.append("tags", `project-${projectId}`);

      const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
      formData.append("public_id", fileNameWithoutExt);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        const uploadedFile = {
          id: response.data.asset_id,
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          url: response.data.secure_url,
          publicId: response.data.public_id,
          folder: response.data.folder || folderPath,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);
        toast.success(`File "${file.name}" uploaded successfully!`);
        return uploadedFile;
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload "${file.name}".`);
        return null;
      }
    });

    await Promise.all(uploadPromises);
    setSelectedFiles([]);
    setIsUploading(false);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Upload Files for {projectName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Upload Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Path
              </label>
              <input
                type="text"
                value={folderPath}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-blue-500">Drop files here...</p>
            ) : (
              <p className="text-gray-500">
                Drag and drop files here or{" "}
                <span className="text-blue-500 underline">click to browse</span>
              </p>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
              <ul className="border rounded divide-y">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="p-3 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedFile(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className={`px-6 py-2 rounded-lg text-white ${
                isUploading || selectedFiles.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {isUploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} File(s)`}
            </button>
            {selectedFiles.length > 0 && (
              <button
                onClick={() => setSelectedFiles([])}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear Selection
              </button>
            )}
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Uploaded Files</h2>
          {uploadedFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left">File Name</th>
                    <th className="px-4 py-3 text-left">Size</th>
                    <th className="px-4 py-3 text-left">Folder</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 border-t">
                      <td className="px-4 py-3">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {file.name}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {(file.size / 1024).toFixed(2)} KB
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {file.folder}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeUploadedFile(file.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No files have been uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProjectManagement() {
  const navigate = useNavigate(); // Initialize navigate
  const [projects, setProjects] = useState<Project[]>([]);
  const [listManager, setListManager] = useState([]);
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
  const [role, setRole] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<
    number | null
  >(null);

  const token = localStorage.getItem("userToken");

  const { fetchNotifications } = useNotification();

  if (!token) {
    toast.error("Please login to access this page.");
    return <Navigate to="/" />;
  }
  const [permissionsList, setPermissionsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchPermissionsList = async () => {
      const permissions = localStorage.getItem("Permission");
      setPermissionsList(permissions ? permissions.split(",") : []);
    };

    async function getListManager() {
      try {
        const response = await getUsersPagination(1, 100, "");
        let data = response.data.data.filter(
          (item: any) => item.Role === "Admin"
        );
        setListManager(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    getListManager();

    fetchPermissionsList();
  }, []);

  const mapStatusToBackend = (status: string): string => {
    if (status === "Not Started") return "Blocked";
    return status;
  };

  const mapStatusToFrontend = (status: string): string => {
    if (status === "Blocked") return "Not Started";
    return status;
  };

  const normalizeDate = (dateString: string): string => {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }

    // console.warn("Invalid date format:", dateString);
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await getAllProjects();
        console.log("Projects data:", projectResponse.data.data);

        const projectsData: any = [];
        projectResponse.data.data.map((project: any) => {
          if (localStorage.getItem("userRole") === "Admin") {
            console.log(project);
            if (project.Manager === null) {
              return;
            }
            if (
              localStorage.getItem("userId") !== project.Manager?.toString()
            ) {
              return;
            }
          }
          projectsData.push({
            id: project.IdProject,
            name: project.ProjectName,
            status: project.Status,
            priority: project.Priority,
            manager: project.Manager,
            tasks: [],
          });
        });

        const taskResponse = await getAllTasks();
        const tasksData = taskResponse.data.data.map((task: any) => {
          return {
            id: task.IdTask,
            title: task.Title,
            status: mapStatusToFrontend(task.Status),
            dueDate: task.DueDate
              ? normalizeDate(task.DueDate)
              : new Date().toISOString().split("T")[0],
            priority: task.Priority,
            assignee: "Unassigned",
            projectId: task.IdProject,
            createdAt: task.DateCreate,
          };
        });

        const projectsWithTasks = projectsData.map((project: Project) => ({
          ...project,
          tasks: tasksData.filter(
            (task: Task) => task.projectId === project.id
          ),
        }));

        setProjects(projectsWithTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMembersForProject = async () => {
      if (!projects.length) return;

      const firstProjectId = projects[0].id;
      try {
        const response = await getProjectMembers(firstProjectId);
        const membersData = response.data;

        if (!Array.isArray(membersData)) {
          console.warn("Invalid response format:", membersData);
          setMembers([]);
          return;
        }

        const data = membersData.map((member: any) => ({
          id: member.IdUser,
          fullname: member.Fullname,
          email: member.Email,
          phoneNumber: member.PhoneNumber,
          role: member.UserRole,
        }));

        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load project members.");
      }
    };

    fetchMembersForProject();
  }, [projects]);

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

  const addTask = async (projectId: number) => {
    const newTask: Task = {
      id: Date.now(),
      title: "New Task",
      status: "Pending",
      dueDate: convertDateandNextMonth(new Date().toISOString().split("T")[0]),
      priority: "Low",
      assignee: "Unassigned",
      projectId: projectId,
      createdAt: convertDate(new Date().toISOString().split("T")[0]),
    };

    try {
      const formattedDateCreate = new Date().toISOString().split("T")[0];
      const payload = {
        Title: newTask.title,
        Status: mapStatusToBackend(newTask.status),
        DueDate: newTask.dueDate,
        Priority: newTask.priority as "Low" | "Medium" | "High",
        IdProject: newTask.projectId,
        DateCreate: formattedDateCreate,
      };

      console.log("Payload:", payload);
      const response = await createTask(payload);
      const savedTask = response.data;

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

      toast.success("Task added successfully!");
      window.dispatchEvent(new Event("taskUpdated"));
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };

  const handleEditTitle = async (
    projectId: number,
    taskId: number,
    newTitle: string
  ) => {
    if (!newTitle.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }

    const updatedTask = projects
      .find((project) => project.id === projectId)
      ?.tasks.find((task) => task.id === taskId);

    if (!updatedTask) {
      toast.error("Task not found.");
      return;
    }

    const payload = {
      Title: newTitle,
      Status: mapStatusToBackend(updatedTask.status),
      DueDate: updatedTask.dueDate,
      Priority: updatedTask.priority as "Low" | "Medium" | "High" | undefined,
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
    };

    try {
      console.log("Payload:", payload);
      await updateTask(taskId, payload);
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

      const projectMember = await getProjectMembers(projectId);
      if (!projectMember.data || !Array.isArray(projectMember.data)) {
        throw new Error("Invalid response format from getProjectMembers API.");
      }

      const dataProjectMembers = projectMember.data;

      // Gửi thông báo cho từng thành viên qua API
      await Promise.all(
        dataProjectMembers.map((member: { IdUser: number }) => {
          const msg = `The task "${newTitle}" in project "${
            projects.find((p) => p.id === projectId)?.name
          }" has been updated.`;
          console.log("Sending notification:", {
            idUser: member.IdUser,
            message: msg,
          });
          return axios.post(
            "/api/notifications",
            {},
            {
              params: {
                idUser: member.IdUser,
                message: msg,
              },
            }
          );
        })
      );

      // Cập nhật lại notifications cho user hiện tại (nếu muốn)
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetchNotifications(userId);
      }

      toast.success("Title updated successfully!");
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Failed to update title.");
    }
  };

  const handleEditDueDate = async (
    projectId: number,
    taskId: number,
    newDueDate: string
  ) => {
    if (!newDueDate || isNaN(Date.parse(newDueDate))) {
      toast.error("Invalid due date.");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(newDueDate);
    if (selectedDate.getTime() < today.setHours(0, 0, 0, 0)) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    const formattedDueDate = convertDate(newDueDate);

    const updatedTask = projects
      .find((project) => project.id === projectId)
      ?.tasks.find((task) => task.id === taskId);

    if (!updatedTask) {
      toast.error("Task not found.");
      return;
    }

    const payload = {
      Title: updatedTask.title,
      Status: mapStatusToBackend(updatedTask.status),
      DueDate: formattedDueDate,
      Priority: updatedTask.priority as "Low" | "Medium" | "High" | undefined,
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
    };

    try {
      console.log("Payload:", payload);
      await updateTask(taskId, payload);

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

      toast.success("Due date updated successfully!");
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Failed to update due date.");
    }
  };

  const updateTaskStatus = async (
    projectId: number,
    taskId: number,
    newStatus: string
  ) => {
    const backendStatus = mapStatusToBackend(newStatus);

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
        toast.success("Status updated successfully!");
      }
    } catch (error) {
      console.error(`Failed to update task status:`, error);
      toast.error("Failed to update status");
    }
  };

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
          Status: mapStatusToBackend(updatedTask.status),
          DueDate: updatedTask.dueDate,
          Priority: newPriority as "Low" | "Medium" | "High",
          IdProject: updatedTask.projectId,
          DateCreate: updatedTask.createdAt,
        };

        console.log("Payload:", payload);
        await updateTask(taskId, payload);
        toast.success("Priority updated successfully!");
      }
    } catch (error) {
      console.error(`Failed to update task priority:`, error);
      toast.error("Failed to update priority");
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
      toast.error("Task not found.");
      return;
    }

    const payload = {
      Title: updatedTask.title,
      Status: mapStatusToBackend(updatedTask.status),
      DueDate: updatedTask.dueDate,
      Priority: updatedTask.priority as "Low" | "Medium" | "High",
      IdProject: updatedTask.projectId,
      DateCreate: updatedTask.createdAt,
      Assignee: assignee,
    };

    try {
      console.log("Payload:", payload);
      await updateTask(taskId, payload);

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

      toast.success("Member assigned successfully!");
    } catch (error) {
      console.error("Error assigning member:", error);
      toast.error("Failed to assign member.");
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
      await deleteTaskAPI(taskId);
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
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const openUploadModal = (projectId: number) => {
    setSelectedProjectForUpload(projectId);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedProjectForUpload(null);
  };

  const handleViewDetails = (projectId: number) => {
    navigate(`/project-detail/${projectId}`); // Navigate to ProjectDetail with projectId
  };

  return (
    <div className="p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
      <h1 className="text-3xl font-semibold my-6 text-gray-800">
        Task Management
      </h1>

      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {projects.map((project) => (
        <div key={project.id} className="mb-8">
          <ProjectTable
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
            permissionsList={permissionsList}
            listManager={listManager}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleViewDetails(project.id)} // Call handleViewDetails
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          </div>

          {/* <div className="mt-4 flex justify-end">
            <button
              onClick={() => openUploadModal(project.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Upload Files for {project.name}
            </button>
          </div> */}
        </div>
      ))}

      {showUploadModal && selectedProjectForUpload && (
        <UploadFileModal
          projectId={selectedProjectForUpload}
          projectName={
            projects.find((p) => p.id === selectedProjectForUpload)?.name || ""
          }
          onClose={closeUploadModal}
        />
      )}
    </div>
  );
}
