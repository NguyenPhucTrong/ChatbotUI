import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { getAllProjects } from "../services/ProjectsServices";
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
    projectId: number;
}

interface ProjectMember {
    projectId: number;
    members: number[];
}

interface Project {
    id: number;
    name: string;
    tasks: Task[];
}

interface Member {
    id: number;
    fullname: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export default function UserProjectManagement() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");

    const token = localStorage.getItem("userToken");

    if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập trang này.");
        return <Navigate to="/" />;
    }

    const fetchProjectsForUser = async () => {
        try {
            const projectResponse = await getAllProjects();
            console.log("Dự án trả về từ API:", projectResponse.data.data);

            const projectsData = projectResponse.data.data.map((project: any) => ({
                id: project.IdProject,
                name: project.ProjectName,
                tasks: [],
            }));

            const memberPromises = projectsData.map(async (project: Project) => {
                const response = await getProjectMembers(project.id);
                console.log(`Thành viên của dự án ${project.id}:`, response.data);
                return {
                    projectId: project.id,
                    members: response.data.map((member: any) => member.IdUser),
                };
            });

            const projectMembers = await Promise.all(memberPromises);
            console.log("Danh sách thành viên của các dự án:", projectMembers);

            const currentUserId = Number(localStorage.getItem("userId"));
            console.log("ID người dùng hiện tại:", currentUserId);

            const filteredProjects: Project[] = projectsData.filter((project: Project) =>
                projectMembers.some(
                    (pm: ProjectMember) => pm.projectId === project.id && pm.members.includes(currentUserId)
                )
            );

            console.log("Dự án của người dùng hiện tại:", filteredProjects);
            setProjects(filteredProjects);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            toast.error("Không thể tải danh sách dự án.");
        }
    };

    useEffect(() => {
        fetchProjectsForUser();
    }, []);

    const filteredTasks = (tasks: Task[]) => {
        return tasks.filter((task) => {
            return (
                (filterStatus === "All" || task.status === filterStatus) &&
                (filterPriority === "All" || task.priority === filterPriority) &&
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    return (
        <div className="p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
            <h1 className="text-3xl font-semibold my-6 text-gray-800">
                User Project Management
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
            {projects.length > 0 ? (
                projects.map((project) => (
                    <ProjectTable
                        key={project.id}
                        project={project}
                        members={[]} // Không cần danh sách thành viên cho user
                        filteredTasks={filteredTasks}
                        handleEditTitle={() => { }} // Không cần chỉnh sửa tiêu đề
                        handleEditDueDate={() => { }} // Không cần chỉnh sửa ngày hết hạn
                        updateTaskStatus={() => { }} // Không cần cập nhật trạng thái
                        updateTaskPriority={() => { }} // Không cần cập nhật mức độ ưu tiên
                        handleAssignMemberToTask={() => { }} // Không cần gán thành viên
                        deleteTask={() => { }} // Không cần xóa task
                        addTask={() => { }} // Không cần thêm task
                    />
                ))
            ) : (
                <p className="text-gray-500">No projects available.</p>
            )}
        </div>
    );
}