import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import flower1 from "../assets/image/flower1.png";

// Register required elements
Chart.register(ArcElement, Tooltip, Legend);

const priorityColors: { [key: string]: string } = {
    High: 'bg-red-500 text-white',
    Medium: 'bg-yellow-500 text-white',
    Low: 'bg-green-500 text-white',
};

const Dashboard = () => {
    const activeProjects = [
        { name: "File Management App", hours: 34, priority: "Medium", members: 5, progress: 15 },
        { name: "Slack Team UI Design", hours: 34, priority: "Low", members: 5, progress: 25 },
        { name: "GitHub Satellite", hours: 34, priority: "Medium", members: 5, progress: 15 },
        { name: "3D Character Modelling", hours: 34, priority: "High", members: 5, progress: 15 },
    ];

    const teams = [
        { name: "Jitu Chauhan", role: "Front End Developer", lastActivity: "Today", image: flower1, email: "jitu@example.com" },
        { name: "Sandeep Chauhan", role: "Project Director", lastActivity: "Today", image: flower1, email: "sandeep@example.com" },
        { name: "Amanda Darnell", role: "Full-Stack Developer", lastActivity: "Today", image: flower1, email: "amanda@example.com" },
        { name: "Patricia Murrill", role: "Account Manager", lastActivity: "3 May, 2022", image: flower1, email: "patricia@example.com" },
    ];

    const data = {
        labels: ['Completed', 'In-Progress', 'Pending', 'Not Started'],
        datasets: [{
            data: [50, 42, 26, 3],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#6B7280'],
        }],
    };

    useEffect(() => {
        return () => {
            // Destroy the chart instance when the component unmounts
            Object.values(Chart.instances).forEach(instance => instance.destroy());
        };
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow mb-6">
                <thead>
                    <tr>
                        <th className="px-6 py-4  bg-gray-300 border-b">Project Name</th>
                        <th className="px-6 py-4  bg-gray-300 border-b">Hours</th>
                        <th className="px-6 py-4  bg-gray-300 border-b">Priority</th>
                        <th className="px-6 py-4  bg-gray-300 border-b">Members</th>
                        <th className="px-6 py-4  bg-gray-300 border-b">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {activeProjects.map((project, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="px-6 py-4  text-center border-b">{project.name}</td>
                            <td className="px-6 py-4  text-center border-b">{project.hours}</td>
                            <td className="px-6 py-4  text-center border-b">
                                <span className={`px-4 py-2 rounded-full ${priorityColors[project.priority]}`}>{project.priority}</span>
                            </td>
                            <td className="px-6 py-4  text-center border-b">{project.members}</td>
                            <td className="px-6 py-4  text-center border-b">{project.progress}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 p-2">
                    <h2 className="text-2xl font-semibold mb-4">Tasks Performance</h2>
                    <div className="max-w-md mx-auto">
                        <Pie data={data} />
                        <div className='mt-4'>
                            {data.labels.map((label, index) => (
                                <div key={index} className='flex items-center mb-2'>
                                    <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}></span>
                                    <span className='text-sm'>{label}:{data.datasets[0].data[index]} </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-2">
                    <h2 className="text-2xl font-semibold mb-4">Teams</h2>
                    <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-6 py-4  bg-gray-300 border-b">Name</th>
                                <th className="px-6 py-4  bg-gray-300 border-b">Role</th>
                                <th className="px-6 py-4  bg-gray-300 border-b">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4  text-center border-b">
                                        <div className="flex  items-center">
                                            <img src={team.image} alt={team.name} className="w-10 h-10 rounded-full mr-2" />
                                            <div>
                                                <div className="font-semibold text-center">{team.name}</div>
                                                <div className="text-sm text-gray-500">{team.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4  text-center border-b">{team.role}</td>
                                    <td className="px-6 py-4  text-center border-b">{team.lastActivity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;