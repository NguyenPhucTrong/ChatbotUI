import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createProject, deleteProject, getAllProjects } from '../services/ProjectsServices';
import { toast } from 'react-toastify';

interface Project {
        id: number;
        name: string;
        tableName: string;
}

export default function Home() {
        const [projects, setProjects] = useState<Project[]>([]);
        const navigate = useNavigate();

        const token = localStorage.getItem('userToken');

        if (!token) {
                toast.error('Vui lòng đăng nhập để truy cập trang này.');
                return <Navigate to="/" />;
            }


        useEffect(() => {
                const fetchProjects = async () => {
                        try {
                                const response = await getAllProjects();
                                const projectsData = response.data.data.map((project: any) => ({
                                        id: project.IdProject,
                                        name: project.ProjectName,
                                        tableName: `Table ${project.ProjectName}`,
                                }));
                                setProjects(projectsData);
                        } catch (error) {
                                console.error('Lỗi khi lấy danh sách project:', error);
                        }
                };

                fetchProjects();
        }, []);

        const handleProjectClick = () => {
                navigate(`/project-management`); // Chuyển hướng đến ProjectManagement với projectId
        };

        const handleCreateProject = async () => {
                const projectName = prompt('Nhập tên project mới:');
                if (projectName) {
                        try {
                                // Gọi API để tạo project mới
                                const response = await createProject({
                                        ProjectName: projectName,
                                        DateCreate: new Date().toISOString(),
                                        Manager: 1, // Replace with the appropriate manager ID
                                        Status: "Active", // Optional: Set a default status
                                        Priority: "Medium", // Optional: Set a default priority
                                });

                                const newProject = {
                                        id: response.data.IdProject,
                                        name: response.data.ProjectName,
                                        tableName: `Table ${response.data.ProjectName}`,
                                };

                                // Cập nhật state `projects` để thêm project mới
                                setProjects((prevProjects) => [...prevProjects, newProject]);
                                toast.success(`Project "${projectName}" đã được tạo thành công!`);
                        } catch (error) {
                                console.error('Lỗi khi tạo project:', error);
                                toast.error('Không thể tạo project.');
                        }
                }
        };

        const handleDeleteProject = async (projectId: number) => {
                if (confirm('Bạn có chắc chắn muốn xóa project này?')) {
                        try {
                                // Gọi API để xóa project
                                await deleteProject(projectId);

                                // Cập nhật state `projects` để xóa project khỏi danh sách
                                setProjects((prevProjects) =>
                                        prevProjects.filter((project) => project.id !== projectId)
                                );
                                toast.success('Project đã được xóa thành công!');
                        } catch (error) {
                                console.error('Lỗi khi xóa project:', error);
                                toast.error('Không thể xóa project.');
                        }
                }
        };



        return (
                <div className="p-6 flex-1 max-w-[1632px] mx-auto overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-semibold text-gray-800">Recently Projects</h1>
                                <button
                                        onClick={handleCreateProject}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                        + Tạo Project
                                </button>
                        </div>                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                        <div
                                                key={project.id}
                                                className="p-4 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
                                        >
                                                <h2
                                                        className="text-xl font-semibold"
                                                        onClick={() => handleProjectClick()}
                                                >
                                                        {project.name}
                                                </h2>
                                                <p className="text-gray-600">{project.tableName}</p>
                                                <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                        Xóa
                                                </button>
                                        </div>
                                ))}
                        </div>
                </div>
        );
}