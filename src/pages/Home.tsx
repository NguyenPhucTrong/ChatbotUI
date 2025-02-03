import React, { useState } from 'react';

interface Task {
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
}

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Design UI', status: 'In Progress', dueDate: '10/01/2024', priority: 'Low' },
        { id: 2, title: 'Develop Backend', status: 'Pending', dueDate: '15/01/2024', priority: 'High' },
        { id: 3, title: 'Test Application', status: 'Not Started', dueDate: '20/01/2024', priority: 'Medium' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Task Management</h1>


            {/* Search Input và Filter Options */}

            <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <select
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                        >
                            <option value="All">All Statuses</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="Not Started">Not Started</option>
                        </select>
                        {/* Custom arrow icon */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            ▼
                        </div>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        {/* Custom arrow icon */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            ▼
                        </div>
                    </div>
                </div>

            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Task</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Due Date</th>
                        <th className="border px-4 py-2">Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{task.title}</td>
                            <td className="border px-4 py-2">{task.status}</td>
                            <td className="border px-4 py-2">{task.dueDate}</td>
                            <td className="border px-4 py-2">{task.priority}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
