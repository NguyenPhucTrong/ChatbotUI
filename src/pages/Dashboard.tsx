import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllProjects } from '../services/ProjectsServices';
import { getAllTasks } from '../services/TaskServices';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);

    const token = localStorage.getItem('userToken');
    console.log(token);
    if (!token) {
        toast.error('Vui lòng đăng nhập để truy cập trang này.');
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchProjectsAndTasks = async () => {
            try {
                const projectsResponse = await getAllProjects();
                const tasksResponse = await getAllTasks();

                console.log('Dữ liệu Projects:', projectsResponse.data.data);
                console.log('Dữ liệu Tasks:', tasksResponse.data.data);

                setProjects(projectsResponse.data.data || []);
                setTasks(tasksResponse.data.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchProjectsAndTasks();
    }, []);

    // Dữ liệu cho biểu đồ tasks theo trạng thái
    const taskStatusCounts = Array.isArray(tasks)
        ? tasks.reduce((acc: any, task: any) => {
            acc[task.Status] = (acc[task.Status] || 0) + 1;
            return acc;
        }, {})
        : {};

    const chartData = {
        labels: Object.keys(taskStatusCounts),
        datasets: [
            {
                label: 'Số lượng trạng thái',
                data: Object.values(taskStatusCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Số lượng Tasks theo Trạng thái',
            },
        },
    };

    // Dữ liệu cho biểu đồ tasks theo dự án
    const projectTaskCounts = projects.map((project) => {
        const taskCount = Array.isArray(tasks)
            ? tasks.filter((task) => task.IdProject === project.Id).length
            : 0;
        return { projectName: project.ProjectName, taskCount };
    });

    const projectChartData = {
        labels: projectTaskCounts.map((item) => item.projectName),
        datasets: [
            {
                label: 'Số lượng Tasks',
                data: projectTaskCounts.map((item) => item.taskCount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const projectChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Số lượng Tasks theo Dự án',
            },
        },
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Biểu đồ số lượng tasks theo trạng thái */}
                <div>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Biểu đồ số lượng tasks theo dự án */}
                <div>
                    <Bar data={projectChartData} options={projectChartOptions} />
                </div>
            </div>

            {/* Hiển thị danh sách Projects */}
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow mb-6">
                <thead>
                    <tr>
                        <th className="px-6 py-4 bg-gray-300 border-b">Project Name</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Priority</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Date Created</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Status</th>
                        <th className="px-6 py-4 bg-gray-300 border-b">Number of Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                Không có dự án nào.
                            </td>
                        </tr>
                    ) : (
                        projects.map((project, index) => {
                            const taskCount = Array.isArray(tasks)
                                ? tasks.filter((task) => task.IdProject === project.Id).length
                                : 0;
                            return (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 text-center border-b">{project.ProjectName}</td>
                                    <td className="px-6 py-4 text-center border-b">{project.Priority}</td>
                                    <td className="px-6 py-4 text-center border-b">{project.DateCreate}</td>
                                    <td className="px-6 py-4 text-center border-b">{project.Status}</td>
                                    <td className="px-6 py-4 text-center border-b">{taskCount}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;