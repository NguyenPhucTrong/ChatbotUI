import React, { useState } from 'react';
import Flower1 from '../assets/image/flower1.png';

export default function Profile() {
    const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('123-456-7890');
    const [role, setRole] = useState('Software Engineer');
    const [department, setDepartment] = useState('Engineering');

    interface Project {
        name: string;
        status: string;
    }

    const [projects, setProjects] = useState<Project[]>([
        { name: 'Project A', status: 'In Progress' },
        { name: 'Project B', status: 'Completed' },
    ]);

    const statusColors: { [key: string]: string } = {
        'In Progress': 'bg-blue-500 text-white',
        Pending: 'bg-orange-500 text-white',
        'Not Started': 'bg-gray-500 text-white',
        Completed: 'bg-green-500 text-white',
    };

    const handleSave = () => {
        // Logic to save the updated information
        console.log('Information saved:', { name, email, phone, role, department });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 w-full max-w-3xl bg-white shadow-lg rounded-lg">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-center mb-6">Thông tin cá nhân</h1>

                {/* Hình + tên */}
                <div className="flex flex-row items-center justify-center text-center mb-6 space-x-6">
                    <div className="flex flex-col items-center">
                        <img src={Flower1} alt="Avatar" className="w-24 h-24 rounded-full shadow-md" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-2xl font-bold mt-2 text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="flex flex-row justify-between text-left gap-x-8 mb-6">
                    {/* Cột 1: Email + Phone */}
                    <div className="flex-1">
                        <p className="text-gray-600">
                            <span className="font-semibold">Email:</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Phone:</span>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                    </div>
                    {/* Cột 2: Department + Role */}
                    <div className="flex-1">
                        <p className="text-gray-600">
                            <span className="font-semibold">Department:</span>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Role:</span>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </p>
                    </div>
                </div>

                {/* Dự án đang tham gia */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Ongoing Projects</h2>
                    <ul className="bg-gray-50 rounded-lg shadow-md p-4">
                        {projects.map((project, index) => (
                            <li key={index} className="flex justify-between items-center py-3 px-4 border-b last:border-none">
                                <span className="text-gray-700 font-medium">{project.name}</span>
                                <span className={`px-3 py-1 rounded-lg text-sm ${statusColors[project.status]}`}>
                                    {project.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nút chỉnh sửa */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}